const express = require('express');
const router = express.Router();
const fs = require('fs');
const urls  = require('../models/urls.json');
const { getLoggedUser } = require('../helpers/users');
const { getFilePath } = require('../helpers/file');
const randomstring = require("randomstring");

router.get('/', (req, res) => {
  const loggedUser = getLoggedUser(req.session.userid);
  if (loggedUser) { //if logged in
    const urlsArr = Object.values(urls);
    const newUrlsArr = [];
    urlsArr.map(url => {
      if (loggedUser.id === url.userId) {
        //create new array which only belongs to one user 
        newUrlsArr.push(url);
      }
    })
    res.render('urls', { loggedUser, urlsArr, newUrlsArr });
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
  if (!loggedUser) {
    res.render('error', {Error:"You need to log-in first!", loggedUser});
  } else if (!urls[req.params.id]) {
    res.render('error', {Error:"ID doesn't exist.", loggedUser}); 
  } else if (loggedUser.id !== urls[req.params.id].userId) {
    res.render('error', {Error:"You don't have access to this url.", loggedUser});
  } else {
    res.render('singleUrl', { loggedUser, url:urls[req.params.id] });
  }
});

router.get('/u/:id', (req, res) => {
  const loggedUser = getLoggedUser(req.session.userid);
  const urlsArr = Object.values(urls);
  urlsArr.map(url => {
    if (req.params.id === url.shortUrl) {
      res.redirect(url.longUrl); 
    } 
  })
  res.render('error', { Error:"ID doesn't exist.", loggedUser });
});

router.post('/', (req, res) => {
  const loggedUser = getLoggedUser(req.session.userid);
  if (loggedUser) {
    const id = randomstring.generate(6);
    urls[id] = {
      shortUrl: id, longUrl: req.body.longURL, userId: req.session.userid
    };
    fs.writeFileSync(getFilePath('/models/urls.json'),  JSON.stringify(urls));
    res.redirect(`/urls/${id}`);
  } else {
    res.render('error', { Error:"You need to log-in first!", loggedUser });
  }
})

router.post('/:id', (req, res) => {
  const loggedUser = getLoggedUser(req.session.userid);
  if (!loggedUser) {
    res.render('error', {Error:"You need to log-in first!", loggedUser});
  } else if (!urls[req.params.id]) {
    res.render('error', {Error:"ID doesn't exist.", loggedUser}); 
  } else if (loggedUser.id !== urls[req.params.id].userId) {
    res.render('error', {Error:"You don't have access to this url.", loggedUser});
  } else {
    const newUrl = req.body.longURL;
    urls[req.params.id] = {
      ...urls[req.params.id], longUrl: newUrl
    }
    fs.writeFileSync(getFilePath('/models/urls.json'),  JSON.stringify(urls));
    res.redirect('/urls');
  }
})

router.post('/:id/delete', async (req, res) => {
  const loggedUser = getLoggedUser(req.session.userid);
  const urlsArr = Object.values(urls);
  let updateArr;
  console.log(urls);

  if (!loggedUser) {
    res.render('error', {Error:"You need to log-in first!", loggedUser});
  } else if (!urls[req.params.id]) {
    res.render('error', {Error:"ID doesn't exist.", loggedUser}); 
  } else if (loggedUser.id !== urls[req.params.id].userId) {
    res.render('error', {Error:"You don't have access to this url.", loggedUser});
  } else 
  {
    updateArr = urlsArr.filter(url => req.params.id !== url.shortUrl);
    const newUrlsObj = {};
    updateArr.map(url => {
      newUrlsObj[url.shortUrl] = url;
    })
    fs.writeFileSync(getFilePath('/models/urls.json'),  JSON.stringify(newUrlsObj)); 
    res.redirect('/urls');
  }
})

module.exports = router;