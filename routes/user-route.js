const express = require('express');
const { check } = require('express-validator');

const userControler = require('../controllers/users-controllers');
const fileUpload = require('../middleware/file-upload');

const router = express.Router();

router.get('/',userControler.getUsers);

router.post('/signup',
    fileUpload.single('image'),
    [check('name').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({min: 6})],
userControler.signup);

router.post('/login',userControler.login);


module.exports=router ;   