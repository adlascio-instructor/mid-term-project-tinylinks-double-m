const express = require('express');
const router = express.Router();
const fs = require('fs');
const urls  = require('../models/urls.json');
const { getLoggedUser } = require('../helpers/users');
const { getFilePath } = require('../helpers/file');
const randomstring = require("randomstring");

router.get('/', (req, res) => {
  const loggedUser = getLoggedUser(req.session.userid);
  const urlsArr = Object.values(urls);
  if (loggedUser) { //if logged in
    res.render('urls', { loggedUser, urlsArr });
  } else { //if not logged in
    res.render('error', {Error:"You need to log-in first!", loggedUser});
  }
});

router.get('/new', (req, res) => {
  const loggedUser = getLoggedUser(req.session.userid);
  if (loggedUser) {
    res.render('newUrl', { loggedUser });
  } else {
    res.redirect('/auth/login');
  }
});

router.get('/:id', (req, res) => {
  const loggedUser = getLoggedUser(req.session.userid);
  if (isLogIn && idExist && hasURL) {
    res.render('singleUrl');
  } else if (!idExist) {
    res.render('error', {Error:"ID doesn't exist.", loggedUser}); 
  } else if (!isLogIn) {
    res.render('error', {Error:"You need to log-in first!", loggedUser});
  } else if (isLogIn && idExist && !hasURL) { 
    res.render('error', {Error:"You have't registered URLs yet.", loggedUser}); 
  }
});

router.get('/u/:id', (req, res) => {
  if (idExist) {
    res.redirect(''); //corresponding long url
  } else {
    res.render('error', {Error:"ID doesn't exist."});
  }
});

router.post('/', (req, res) => {
  const loggedUser = getLoggedUser(req.session.userid);
  if (loggedUser) {
    const id = randomstring.generate(6);
    urls[id] = {
      shortUrl: id, longUrl: req.body.longURL, userId: req.session.userid
    };
    console.log(urls);
    fs.writeFileSync(getFilePath('/models/urls.json'),  JSON.stringify(urls));
    res.redirect(`/urls/${id}`);
  } else {
    res.render('error', { Error:"You need to log-in first!", loggedUser });
  }
})

// router.post('/:id', (req, res) => {

// })

// router.post('/:id/delete', (req, res) => {
  
// })

module.exports = router;