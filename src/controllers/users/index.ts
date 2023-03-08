const register = require('./register');
const Me = require('./me');
const editUser = require('./editUser');
const profilePic = require('./profilePic');
const deletePic = require('./DeletPic');
const forgetPassword = require('./forgetPassword');
const resetPassword = require('./resetPassword');
const changePassword = require('./changePassword');
const forgetPasswordCheck = require('./forgetPasswordCheck'); 
const accountIsActive = require('./accountIsActive');
const Heir = require('./addHeir');
const listWill = require('./listWill');
const editWill = require('./updateheir');

module.exports = {
  register,
  Me,
  editUser,
  profilePic,
  deletePic,
  forgetPassword,
  resetPassword,
  changePassword,
  forgetPasswordCheck,
  accountIsActive,
  Heir,
  listWill,
  editWill
}

export {};