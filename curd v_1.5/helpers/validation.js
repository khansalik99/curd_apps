const { check, body } = require('express-validator');

// Validation rules
var loginValidation =[
//check email
check('email', 'Please Enter a valid Email').isEmail().trim().escape().normalizeEmail(),
//check password
check('password')
.isLength({ min: 5 }).withMessage('Password Must be at least 5 characters')
.matches('[0-9]').withMessage('Password Must contain a number')
.trim().escape()
];

var signUpValidation=[
    check('username').not().isEmpty().withMessage("Name is required"),
    check('email').isEmail().withMessage('Please enter a valid email address.').custom((value, { req }) => {
        if (value.indexOf('test') > -1) {
            throw new Error('This is a forbidden email address');
        }
        return true;
    }).trim().escape().normalizeEmail(),
    body('password')
        .isLength({ min: 5 }).withMessage('Password Must be at least 5 characters')
        .isAlphanumeric().withMessage('Password Must contain a number')
        .trim().escape(),
    body('confirmPassword').trim().escape().custom((value, { req }) => {
        if (req.body.repeatPassword !== req.body.password) {
            throw new Error('Password does not match.');
        }
        return true;
    })
]
var passwordResetValidation=[
    check('email').isEmail().withMessage('Please enter a valid email address.').custom((value, { req }) => {
        if (value.indexOf('test') > -1) {
            throw new Error('This is a forbidden email address');
        }
        return true;
    }).trim().escape().normalizeEmail(),
    body('password')
        .isLength({ min: 5 }).withMessage('Password Must be at least 5 characters')
        .isAlphanumeric().withMessage('Password Must contain a number')
        .trim().escape(),
    body('confirmPassword').trim().escape().custom((value, { req }) => {
        if (req.body.repeatPassword !== req.body.password) {
            throw new Error('Password does not match.');
        }
        return true;
    })
]
var newUserValidation = [
    check('name').not().isEmpty().withMessage("Name is required"),
    check('email').isEmail().withMessage('Please enter a valid email address.').custom((value, { req }) => {
        if (value.indexOf('test') > -1) {
            throw new Error('This is a forbidden email address');
        }
        return true;
    }).trim().escape().normalizeEmail(),
    body('password')
        .isLength({ min: 5 }).withMessage('Password Must be at least 5 characters')
        .isAlphanumeric().withMessage('Password Must contain a number')
        .trim().escape()
]
module.exports = { loginValidation, signUpValidation, passwordResetValidation, newUserValidation };