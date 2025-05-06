const express = require('express')
const router = express.Router()
const Controller = require('../controllers/controller')


router.get('/',Controller.showLandingPage)
router.use('/registration',require('./registration'))
router.use('/login',require('./login'))
router.use('/logout',require('./logout'))
router.use('/schedules',require('./schedules'))
router.use('/categories',require('./categories'))


module.exports = router

