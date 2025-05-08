const express = require('express')
const routerLogout = express.Router()
const userController = require('../controllers/userController')


//! Logout
routerLogout.get('/',userController.userLogout)

module.exports = routerLogout