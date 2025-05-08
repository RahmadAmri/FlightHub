const { User, Profile, Travel, Transaction } = require('../models')

class userController {
    static async showRegistration(req, res) {
        try {
            let { error } = req.query
            if (error) {
                error = error.split(',')
            }
            //! Session
            let { email, role, name, userId } = req.session
            res.render('userRegistrationPage', { error, email, role, name, userId })
        } catch (error) {
            res.send(error)
        }
    }
    static async postRegistration(req, res) {
        try {
            let { name, birthDate, identityNumber, phoneNumber } = req.body //profile
            let { email, password, role } = req.body //user

            let newDataUser = await User.createUser(email, password, role)
            let UserId = newDataUser.id
            if (name !== '' && birthDate !== '' && identityNumber !== '' && phoneNumber !== '') { //! kalo form Profile sudah lengkap
                await Profile.createProfile(name, birthDate, identityNumber, phoneNumber, UserId)
                res.redirect('/login')
            } else { //! kalo form Profile belum lengkap maka delete user yang baru terbuat
                await User.deleteUserById(UserId)
                await Profile.createProfile(name, birthDate, identityNumber, phoneNumber, UserId) //! untuk trigger error pada form Profile
            }
        } catch (error) {
            if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
                error = error.errors.map(el => {
                    return el.message
                })
                res.redirect(`/registration?error=${error}`)
            } else {
                res.send(error)
            }
        }
    }
    static async showLogin(req, res) {
        try {
            const error = req.query
             //! Session
            const { email, role, name, userId } = req.session
            res.render('userLoginPage', { error, email, role, name, userId })
        } catch (error) {
            res.send(error)
        }
    }
    static async postLogin(req, res) {
        try {
            const { email, password } = req.body
            const userLogin = await User.decryptPassword(email, password)

            if (userLogin.checkPassword) {
                req.session.userId = userLogin.dataUserProfile.id
                req.session.email = userLogin.dataUserProfile.email
                req.session.role = userLogin.dataUserProfile.role
                req.session.name = userLogin.dataUserProfile.Profile.name

                res.redirect(`/schedules/${req.session.userId}`)
            }
        } catch (error) {
            res.redirect(`/login?name=${error.name}&msg=${error.msg}`)
        }
    }
    static async userLogout(req, res) {
        try {
            req.session.destroy() //! clear session
            res.redirect('/schedules')
        } catch (error) {
            res.send(error)
        }
    }
    static async showUserBook(req, res) {
        try {
            const { error } = req.query //!

            //! Session
            const { email, role, name, userId } = req.session
            const { travelId } = req.params
            const dataTravelCategoryById = await Travel.getTravelCategoryById(travelId)
            res.render('userBookPage', { dataTravelCategoryById, email, role, name, userId, error })
        } catch (error) {
            res.send(error)
        }
    }
    static async postUserBook(req, res) {
        try {
            const { travelId, userId } = req.params
            const { quantityOrder } = req.body
            const dataTravelCategoryById = await Travel.getTravelCategoryById(travelId)
            const { schedule, capacity } = dataTravelCategoryById

            const insertDataTrans = {
                schedule,
                TravelId: +travelId,
                UserId: +userId,
                quantityOrder: +quantityOrder,
                totalPrice: dataTravelCategoryById.Category.price * +quantityOrder
            }

            await Transaction.createTransaction(insertDataTrans, capacity) //! create new transaction
            await Travel.decrementCapacity(travelId, quantityOrder) //! kurangin capacity travel
            res.redirect(`/schedules/${userId}`)
        } catch (error) {
            if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
                error = error.errors.map(el => {
                    return el.message
                })
            }
            res.redirect(`/schedules/${req.params.userId}/book/${req.params.travelId}?error=${error}`)
        }
    }
    static async convertPdf(req, res) {
        try {
            const { userId } = req.params
            const dataTransactionUserTravel = await Transaction.getTransactionUserTravel(userId)

            let arr = []
            dataTransactionUserTravel.map(el => {
                arr.push({
                    idTransaction: el.id,
                    quantityOrder: el.quantityOrder,
                    totalPrice: el.totalPrice,
                    email: el.User.email,
                    airlineName: el.Travel.airlineName,
                    schedule: el.Travel.schedule
                })
            })

            await Transaction.exportPdf(arr, userId)
            res.redirect(`/schedules/${userId}`)

            // http://localhost:3000/schedules/28/convert //! to run this controller
        } catch (error) {
            res.send(error)
        }
    }

}
module.exports = userController