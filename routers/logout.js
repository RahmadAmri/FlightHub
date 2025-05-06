const express = require('express')
const routerLogout = express.Router()
const Controller = require('../controllers/controller')
const userController = require('../controllers/userController')
const {isLoggedIn,isAdmin} = require('../middlewares/auth')


//! Logout
routerLogout.get('/',userController.userLogout)

module.exports = routerLogout