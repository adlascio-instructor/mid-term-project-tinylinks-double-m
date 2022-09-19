const express = require('express');
const router = express.Router();
// let isLogIn = true; //Test purpose (delete this line later)
let isLogIn = false; //Test purpose (delete this line later)
// let idExist = true; //Test purpose (delete this line later)
let idExist = false; //Test purpose (delete this line later)
// let hasURL = true; //Test purpose (delete this line later)
let hasURL = false; //Test purpose (delete this line later)

//localhost:3000/urls
router.get('/', (req, res) => {
  if (isLogIn) { //if logged in
    res.render('urls');
  } else { //if not logged in
    res.render('error', {Error:"You need to log-in first!"});
  }
});

router.get('/new', (req, res) => {
  if (isLogIn) {
    res.render('newUrl');
  } else {
    res.redirect('/auth/login');
  }
});

router.get('/:id', (req, res) => {
  if (isLogIn && idExist && hasURL) {
    res.render('singleUrl');
  } else if (!idExist) {
    res.render('error', {Error:"ID doesn't exist."}); 
  } else if (!isLogIn) {
    res.render('error', {Error:"You need to log-in first!"});
  } else if (isLogIn && idExist && !hasURL) { 
    res.render('error', {Error:"You have't registered URLs yet."}); 
  }
});

router.get('/u/:id', (req, res) => {
  if (idExist) {
    res.redirect(''); //corresponding long url
  } else {
    res.render('error', {Error:"ID doesn't exist."});
  }
});

// router.post('/', (req, res) => {
//   if (isLogIn) {
//     console.log("Login");
//   } else {
//     res.render('error', {Error:"You need to log-in first!"});
//   }
// })

module.exports = router;