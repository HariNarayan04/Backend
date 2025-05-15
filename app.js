const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const placeRoutes = require("./routes/place-route");
const userRoutes = require("./routes/user-route");
const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json());

app.use('/uploads/images', express.static(path.join('uploads', 'images')))

app.use((req,res,next) =>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, authorization');
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PATCH, DELETE');
    next();
})

app.use('/api/places', placeRoutes);
app.use('/api/users',userRoutes);

app.use((req,res,next)=>{
    const error = new HttpError("We cannot find this route ", 404);
    throw(error);
})

app.use((error,req,res,next) =>{
    if(req.file){
        fs.unlink(req.file.path, err => {
            console.log(err);
        });
    }
    if(res.headerSent){
        return next(error);
    }
    res.status(error.code || 500)
    res.json({message : error.message || 'Some error occured there'});
})

mongoose
    .connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qo7lx.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`)
    .then(()=>{
        app.listen(process.env.PORT || 5001);
    })  
    .catch((err) =>{
        console.error("Database connection failed:", err);
        process.exit(1); // Stop the server if DB connection fails
    });


