require('dotenv/config')
const bodyParser = require('body-parser')
const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const sessionStorage = require('connect-mongodb-session')(session)
const helmet = require('helmet')
const cors = require('cors')
const server = express()

const authRoute = require('./routes/authRoute')
const { setServers } = require('dns')

const store = new sessionStorage({
  uri: process.env.MONGOOSE_URI,
  collection: 'sessions'
})

server.use(bodyParser.urlencoded({ extended: true }))
server.use(cors())
server.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      maxAge: 60 * 60 * 24 * 31
    }
  })
);
server.use(express.static(path.join(__dirname, 'public')))
server.use(helmet({   contentSecurityPolicy: false }))
server.use(authRoute)
server.set('view engine', 'ejs')
server.set('views', 'views')
server.use((err, req, res, next) => {
  console.error('error occured: ' + err)
  const errorCode = err.code ?? 500
  const errorMessage = err.message ?? 'Unknown problem'
  return res.render('error.ejs', {
    errorCode,
    errorMessage
  })
})

mongoose.connect(process.env.MONGOOSE_URI)
.then(() => server.listen(3000))
.then(() => console.log('Started on port 3000'))
.catch(err => console.error(err));