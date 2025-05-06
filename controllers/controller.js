const { Travel, Category } = require('../models')

class Controller {
    static async showLandingPage(req, res) {
        try {
            //! Session
            const { email, role, name, userId } = req.session
            res.render('landingPage', { email, role, name, userId })
        } catch (error) {
            res.send(error)
        }
    }

    static async showSchedule(req, res) {
        try {
            const { airlineName } = req.query
            const dataTravelCategory = await Travel.getTravelCategoryActive(airlineName)
            //! Session
            const { email, role, name, userId } = req.session
            res.render('schedulePage', { dataTravelCategory, email, role, name, userId })
        } catch (error) {
            res.send(error)
        }
    }

    static async showListSchedule(req, res) {
        try {
            const { error } = req.query
            //! Session
            const { email, role, name, userId } = req.session
            const dataTravelCategory = await Travel.getTravelCategory()
            res.render('scheduleListPage', { dataTravelCategory, error, email, role, name, userId })
        } catch (error) {
            res.send(error)
        }
    }

    static async showAddSchedule(req, res) {
        try {
            let { error } = req.query
            if (error) {
                error = error.split(',')
            }
            //! Session
            const { email, role, name, userId } = req.session
            const dataCategory = await Category.getCategory()
            res.render('scheduleAddPage', { dataCategory, error, email, role, name, userId })
        } catch (error) {
            res.send(error)
        }
    }

    static async postAddSchedule(req, res) {
        try {
            const data = await Travel.createTravel(req.body)
            res.redirect('/schedules/list')  // Changed from '/schedules' to '/schedules/list'
        } catch (error) {
            if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
                error = error.errors.map(el => {
                    return el.message
                })
                res.redirect(`/schedules/add?error=${error}`)
            } else {
                res.send(error)
            }
        }
    }

    static async showEditTravel(req, res) {
        try {

            let { error } = req.query
            if (error) {
                error = error.split(',')
            }

            //! Session
            const { email, role, name, userId } = req.session

            const { id } = req.params
            const dataTravelCategoryById = await Travel.getTravelCategoryById(id)
            const dataCategory = await Category.getCategory()

            res.render('scheduleEditPage', { dataTravelCategoryById, dataCategory, error, email, role, name, userId })
        } catch (error) {
            res.send(error)
        }
    }

    static async postEditTravel(req, res) {
        try {
            let { id } = req.params
            await Travel.updateTravel(id, req.body)

            res.redirect('/schedules/list')
        } catch (error) {
            const { id } = req.params
            if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
                error = error.errors.map(el => {
                    return el.message
                })
                res.redirect(`/schedules/list/${id}/edit?error=${error}`)
            } else {
                res.send(error)
            }
        }
    }

    static async destroyTravel(req, res) {
        try {
            const { id } = req.params
            await Travel.deleteTravel(id)
            res.redirect('/schedules/list')
        } catch (error) {
            res.redirect(`/schedules/list?error=${error.msg}`)
        }
    }

    static async showListCategory(req, res) {
        try {
            const { deleted } = req.query
            const { error } = req.query
            //! Session
            const { email, role, name, userId } = req.session
            const dataCategory = await Category.getCategory()
            res.render('categoryListPage', { dataCategory, deleted, email, role, name, userId, error })
        } catch (error) {
            res.send(error)
        }
    }

    static async showAddCategory(req, res) {
        try {
            let { error } = req.query
            if (error) {
                error = error.split(',')
            }
            //! Session
            const { email, role, name, userId } = req.session
            res.render('categoryAddPage', { error, email, role, name, userId })
        } catch (error) {
            res.send(error)
        }
    }

    static async postAddCategory(req, res) {
        try {
            const data = await Category.createCategory(req.body)
            res.redirect('/categories/list')
        } catch (error) {
            if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
                error = error.errors.map(el => {
                    return el.message
                })
                res.redirect(`/categories/add?error=${error}`)
            } else {
                res.send(error)
            }
        }
    }

    static async showEditCategory(req, res) {
        try {
            let { error } = req.query
            if (error) {
                error = error.split(',')
            }
            //! Session
            const { email, role, name, userId } = req.session

            const { id } = req.params
            const dataCategoryById = await Category.getCategoryById(id)

            res.render('categoryEditPage', { dataCategoryById, error, email, role, name, userId })
        } catch (error) {
            res.send(error)
        }
    }

    static async postEditCategory(req, res) {
        try {
            const { id } = req.params
            await Category.updateCategory(id, req.body)

            res.redirect('/categories/list')
        } catch (error) {
            const { id } = req.params
            if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
                error = error.errors.map(el => {
                    return el.message
                })
                res.redirect(`/categories/list/${id}/edit?error=${error}`)
            } else {
                res.send(error)
            }
        }
    }

    static async destroyCategory(req, res) {
        try {
            const { id } = req.params
            const dataNameDeleted = (await Category.getCategoryById(id)).nameCategory

            await Category.deleteCategory(id)
            res.redirect(`/categories/list?deleted=${dataNameDeleted}`)
        } catch (error) {
            res.redirect(`/categories/list?error=${error}`)
        }
    }
}


module.exports = Controller