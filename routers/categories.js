const express = require('express')
const routerCategories = express.Router()
const Controller = require('../controllers/controller')
const { isLoggedIn,isAdmin } = require('../middlewares/auth')


//! Categories
routerCategories.get('/list',isLoggedIn,isAdmin,Controller.showListCategory)

routerCategories.get('/add',isLoggedIn,isAdmin,Controller.showAddCategory)
routerCategories.post('/add',Controller.postAddCategory)

routerCategories.get('/list/:id/edit',isLoggedIn,isAdmin,Controller.showEditCategory)
routerCategories.post('/list/:id/edit', Controller.postEditCategory)

routerCategories.get('/list/:id/delete',isLoggedIn,isAdmin,Controller.destroyCategory)

module.exports = routerCategories