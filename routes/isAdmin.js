module.exports = (req, res, next) => {
  if(req.session == undefined || !req.session.isAdmin) {
    return res.redirect('/')
  }
  next()
}