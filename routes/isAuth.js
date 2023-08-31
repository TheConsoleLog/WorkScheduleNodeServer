module.exports = (req, res, next) => {
  if(req.session == undefined || !req.session.isLoggedIn) {
    return res.redirect('/')
  }
  next()
}