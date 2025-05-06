const express = require('express')
const routerSchedules = express.Router()
const Controller = require('../controllers/controller')
const userController = require('../controllers/userController')
const { isLoggedIn, isAdmin } = require('../middlewares/auth')

//! Schedules
routerSchedules.get('', Controller.showSchedule)

routerSchedules.get('/add', isLoggedIn, isAdmin, Controller.showAddSchedule)
routerSchedules.post('/add', Controller.postAddSchedule)

routerSchedules.get('/list', isLoggedIn, isAdmin, Controller.showListSchedule)

routerSchedules.get('/list/:id/edit', isLoggedIn, isAdmin, Controller.showEditTravel)
routerSchedules.post('/list/:id/edit', Controller.postEditTravel)

routerSchedules.get('/list/:id/delete', isLoggedIn, isAdmin, Controller.destroyTravel)


//! User
routerSchedules.get('/:userId', isLoggedIn, Controller.showSchedule)

routerSchedules.get('/:userId/book/:travelId', isLoggedIn, userController.showUserBook)
routerSchedules.post('/:userId/book/:travelId', userController.postUserBook)

routerSchedules.get('/:userId/convert', isLoggedIn, userController.convertPdf)

module.exports = routerSchedules