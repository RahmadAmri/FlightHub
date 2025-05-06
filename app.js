const express = require('express')
const app = express()
const port = 3000
const session = require('express-session')
app.set('view engine','ejs')
app.use(express.urlencoded({extended : true}))
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false, // set false karena tidak perlu di save untuk setiap user login
  cookie: {
	 secure: false, //set false karena masih development (http/https)
	sameSite: true // set false untuk menghindari csrf attack (untuk security)
  } 
}))


app.use('/',require('./routers'))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})