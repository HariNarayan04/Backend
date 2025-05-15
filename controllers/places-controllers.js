const fs = require('fs');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../utils/location');
const Place = require('../models/place');
const User = require('../models/user');
const cloudinary = require('cloudinary').v2; 



const getPlaceById = async(req,res,next) =>{
    const PlaceId = req.params.pid;

    let place;
    try {
        place = await Place.findById(PlaceId);
    } catch (err) {
        const error = new HttpError('Something went wrong in fetching the place', 500);
    }
    
    if(!place){
        const error =  new HttpError('Could not find a place for pid', 404);
        return next(error);
    }
    res.json({place : place.toObject({getters : true})});
};

const getPlacesByUserId = async(req,res,next) =>{
    const userId = req.params.uid;
    let places;
    
    try {
        places = await Place.find({creator : userId});
    } catch (err) {
        const error = new HttpError('Something went wrong in fetching the place ', 500);
        return next(error);
    }


    if(!places || places.length === 0){
        return next(new HttpError('Could not find a place for pid', 404));
    }
    res.json({places : places.map(place => place.toObject({getters : true}))});
};

const createPlaces = async (req,res,next) =>{

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return next(new HttpError('Invalid user input try agian', 422));

    }

    const {title, description, address}=req.body;

    let coordinates;

    try {
        coordinates = await getCoordsForAddress(address);
    } catch (error) {
        return next(error);
    } 

    const createdPlace = new Place({
        title,
        description,
        location : coordinates,
        image: req.file.path,
        address,
        creator : req.userData.userId
    });

    let user;
    try{
        user = await User.findById(req.userData.userId);
    }
    catch(err) {
        const error = new HttpError('Failed to create a new place', 500);
        return next(error);
    }

    if(!user){
        const error = new HttpError('Could not find this user', 404);
        return next(error);
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdPlace.save({session: sess});
        user.places.push(createdPlace);
        await user.save({session: sess});
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError('Error creating place , try again ', 500);
        return next(error);
    }

    res.status(201).json({place : createdPlace});
}

const updatePlace = async(req,res,next) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new HttpError('Invalid user input try agian', 422);
        return next(error);
    }

    const {title, description} = req.body;
    const placeId = req.params.pid;
    
    let place;

    try {
        place = await Place.findById(placeId);
    } catch (err) {
        const error = new HttpError('Could not update the place ',500);
        return next(error);
    }

    if(place.creator.toString() !== req.userData.userId){
        const error = new HttpError('You are not allowed to do that', 401);
        return next(error);
    }

    place.title = title;
    place.description = description;

    try {
        await place.save();
    } catch (err) {
        const error = new HttpError('Something went wrong could not update places',500);
        return next(error);
    }

    res.status(200).json({place : place.toObject({getters : true})});
};

const deletePlace = async(req,res,next) =>{
    const placeId = req.params.pid;

    let place;

    try {
        place = await Place.findById(placeId).populate('creator');
    } catch (err) {
        const error = new HttpError('Something went wrong could not get place ', 500);
        return next(error);
    }

    if(!place){
        const error = new HttpError('could not find place for this id ', 404);
        return next(error);
    }

    if(place.creator.id !== req.userData.userId){
        const error = new HttpError('You are not allowed to do that', 401);
        return next(error);
    }
    
    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await place.deleteOne({session:sess});
        place.creator.places.pull(place)
        await place.creator.save({session: sess});
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError('Something went wrong could not delete place ', 500);
        return next(error);  
    }
    const imagePath = place.image;
    if (imagePath.startsWith('http')) {
        // It's a Cloudinary image
        const publicId = imagePath
            .split('/')
            .slice(7) // skip domain and version
            .join('/')
            .split('.')[0]; // get 'uploads/images/<uuid>'
        
        cloudinary.uploader.destroy(publicId, { resource_type: 'image' }, (error, result) => {
            if (error){
                const error = new HttpError('There is an error deleting file', 500);
                return next(error);
            }
        });
    } else {
        // Local image
        fs.unlink(imagePath, err => {
            if (err){
                const error = new HttpError(err.message, 500);
                return next(error);
            }
        });
    }

    res.status(200).json({message : "Deleted place"});
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlaces = createPlaces;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;