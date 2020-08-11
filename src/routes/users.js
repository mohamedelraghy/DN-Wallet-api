const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');

const usersController = require('../controllers/users');


router.post('/register', usersController.register); // create new user

router.get('/me', auth, usersController.Me); // show user info

router.put('/info', auth, usersController.editUser); // edit user info

router.post('/pic', auth, usersController.profilePic); // add profile picture

router.delete('/pic', auth, usersController.deletePic); // delelte profile pic

router.post('/forget-password', usersController.forgetPassword); //forget password

router.post('/forget-password-check', usersController.forgetPasswordCheck);

router.post('/rest-password', usersController.resetPassword); // rest password

router.put('/new-password', auth, usersController.changePassword); // Change Password

router.get('/active', auth, usersController.accountIsActive);

router.post('/heir', auth, usersController.Heir);

router.get('/heir', auth, usersController.listWill);

module.exports = router;