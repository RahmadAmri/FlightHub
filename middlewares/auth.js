const isLoggedIn = function (req,res,next) {
    if (!req.session.email) {
        let msg = `Please Login First!`
        res.redirect(`/login?name=errorLogin&msg=${msg}`)
    } else {
        next()
    }
}
const isAdmin = function (req,res,next) {
    if (req.session.email && req.session.role !== 'admin') {
        let msg = `You Have no access`
        res.redirect(`/login?name=errorLogin&msg=${msg}`)
    } else {
        next()
    }
}

module.exports = {isLoggedIn,isAdmin}