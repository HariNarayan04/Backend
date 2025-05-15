const express = require('express');
const { check } = require('express-validator');

const placeControler = require('../controllers/places-controllers');
const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.get('/:pid', placeControler.getPlaceById);
router.get('/user/:uid', placeControler.getPlacesByUserId);

router.use(checkAuth);       

router.post('/', 
    fileUpload.single('image'),
    [
        check('title')
        .not()
        .isEmpty(),
        check('description').isLength({min: 5}),
        check('address')
        .not()
        .isEmpty()
    ],
    placeControler.createPlaces);
router.patch('/:pid',
    [
        check('title')
        .not()
        .isEmpty(),
        check('description').isLength({min: 5})
    ],
    placeControler.updatePlace);
router.delete('/:pid', placeControler.deletePlace)

module.exports = router;   