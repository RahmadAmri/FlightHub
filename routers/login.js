const express = require('express')
const routerLogin = express.Router()
const userController = require('../controllers/userController')

//! Login
routerLogin.get('/',userController.showLogin)
routerLogin.post('/',userController.postLogin)

module.exports = routerLogin