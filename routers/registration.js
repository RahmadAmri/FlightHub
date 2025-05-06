const express = require('express')
const routerRegistration = express.Router()
const userController = require('../controllers/userController')

//! Registration
routerRegistration.get('/',userController.showRegistration)
routerRegistration.post('/',userController.postRegistration)

module.exports = routerRegistration