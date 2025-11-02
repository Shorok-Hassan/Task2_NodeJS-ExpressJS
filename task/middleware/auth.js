
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  
  req.session.error = 'Please login to access this page';
  res.redirect('/login');
};

const isNotAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return res.redirect('/students');
  }
  
  next();
};

const setLocals = (req, res, next) => {
  res.locals.username = req.session ? req.session.username : null;
  res.locals.userId = req.session ? req.session.userId : null;
  res.locals.error = req.session ? req.session.error : null;
  res.locals.message = req.session ? req.session.message : null;
  
  
  if (req.session) {
    req.session.error = null;
    req.session.message = null;
  }
  
  next();
};

module.exports = {
  isAuthenticated,
  isNotAuthenticated,
  setLocals
};