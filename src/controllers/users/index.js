const register = require('./register');
const Me = require('./me');
const editUser = require('./editUser');
const profilePic = require('./profilePic');
const deletePic = require('./DeletPic');
const forgetPassword = require('./forgetPassword');
const restPassword = require('./restPassword');
const changePassword = require('./changePassword');
const forgetPasswordCheck = require('./forgetPasswordCheck'); 

module.exports = {
  register,
  Me,
  editUser,
  profilePic,
  deletePic,
  forgetPassword,
  restPassword,
  changePassword,
  forgetPasswordCheck,
}