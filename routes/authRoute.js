const express = require('express')
const fs = require('fs')
const bcrypt = require('bcrypt');
const User = require('../schemas/User.js')
const isAuth = require('./isAuth.js')
const isAdmin = require('./isAdmin.js')
const Router = express.Router()
const { getNextWeekDates, getCw } = require('../utils/dateUtility')

Router.post('/add-user', isAuth, async (req, res, next) => {
  const { email, password } = req.body
  const hashed = await bcrypt.hash(password, 12)
  const user = new User({
    email,
    password: hashed,
    timetables: []
  })
  user.save().catch(err => console.error(err))
  res.redirect('/admin')
})

Router.post('/delete-user/:email', isAdmin, async (req, res, next) => {
  const email = req.params.email
  User.findOneAndDelete({ email })
  .then(r => res.redirect('/admin'))
  .catch(err => console.error('Upps, something went wrong:' + err))
})

Router.post('/auth/login', async (req, res, next) => {
  const { email, password } = req.body

  User.findOne({ email })
  .then(res => {
    if(!res) throw new Error("Username or password incorrect")
    const hashed = res.password
    return bcrypt.compare(password, hashed)
  })
  .then(async (isCorrect) => {
    if(!isCorrect) throw new Error('Username or password incorrect')
    //login
    console.log('user found and password correct')

    const userId = await User.findOne({ email })
    req.session.isLoggedIn = true
    req.session.userId = userId._id
    req.session.isAdmin = (isCorrect &&
      email === 'seidermann.paul@gmail.com')

    console.log('session created')

    return req.session.save(err => {
      if(err) console.error(err)
      console.log('saving session')
      return res.redirect('/timetable')
    })
  })
  .catch(err => {
    console.error(err)
    return res.redirect('/')
  })
})

Router.get('/logout', (req, res, next) => {
  req.session.destroy()
  res.clearCookie('connected.sid')
  res.redirect('/')
})

Router.post('/clicked-day/:day', isAuth, async(req, res, next) => {
  try {
    const dates = getNextWeekDates()
    const cw = getCw(new Date(dates[0].real))

    const day = req.params.day
    const userId = req.session.userId

    const user = await User.findById(userId)
    if(!user) throw new Error("Could not find user with userid")

    let index = user.timetables.findIndex(t => t.cw == cw)
    const exists = (index != undefined)

    if(!exists) return res.redirect('/timetable')

    const dayIndex = user.timetables[index]
      .days.findIndex(d => d.display == day)

    if(dayIndex == undefined) throw new Error('Could not find day index')

    user.timetables[index].days[dayIndex].canWork = !Boolean(
      user.timetables[index].days[dayIndex].canWork
    )
    await user.save()

    return res.redirect('/timetable')
  } catch(err) {
    err.statusCode = 500
    next(500)
  }
})

Router.get('/timetable', isAuth, async(req, res, next) => {
  try {
    const dates = getNextWeekDates()
    const cw = getCw(new Date(dates[0].real))

    const user = await User.findById(req.session.userId)
    if(!user) throw new Error("Could not find user with userid")

    const found = user.timetables.find(t => t.cw === cw)
    const exists = found != undefined

    if(!exists) {
      let days = dates.map(date => {
        return {
          'real': date.real,
          'display': date.display,
          'canWork': false
        }
      })

      const timetable = {
        cw,
        startDate: dates[0].real,
        endDate: dates[6].real,
        days: [...days]
      }

      user.timetables = [ timetable ]

      await user.save()

      return res.render('timetable.ejs', {
        type: 'Weekly',
        days,
        remark: user.timetables[timetableIndex].remark
      })
    } else {
      const timetableIndex = user.timetables.findIndex(t => t.cw == cw)
      if(timetableIndex == undefined)
        throw new Error('Could not find fitting timetable')

      const days = user.timetables[timetableIndex].days

      return res.render('timetable.ejs', {
        type: 'Weekly',
        days,
        remark: user.timetables[timetableIndex].remark
      })
    }

  } catch(err) {
    err.statusCode = 500
    next(500)
  }
})

Router.post('/save-days', isAuth, (req, res, next) => {
  const { days } = req.body
  fs.writeFileSync('./active-days.json',
   JSON.stringify(getNextWeekDates()))
  res.redirect('/timetable')
})

Router.get('/admin', isAdmin, async (req, res, next) => {
  const users = await User.find();
  return res.render('admin.ejs', {
    users
  })
})

Router.post('/save-remark', isAuth, async(req, res, next) => {
  try {
    const dates = getNextWeekDates()
    const cw = getCw(new Date(dates[0].real))

    const { remark } = req.body;
    const user = await User.findById(req.session.userId)
    if(!user) throw new Error("Could not find user with userid")

    let index = user.timetables.findIndex(t => t.cw == cw)
    const exists = (index != undefined)

    if(!exists) throw new Error("Could not find timetable")
    user.timetables[index].remark = remark

    await user.save()

    return res.redirect('/timetable')
  } catch(err) {
    err.statusCode = 500
    next(err)
  }
})

Router.get('/', (req, res, next) => {
  if(req.session.isLoggedIn) 
    return res.redirect('/timetable')
  res.render('start.ejs')
})

Router.use('*', (req, res, next) => {
  res.render('pageNotFound.ejs')
})

module.exports = Router