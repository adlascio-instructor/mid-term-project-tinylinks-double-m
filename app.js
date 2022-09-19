const express = require('express');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const authRoute = require('./routes/auth');
const urlsRoute = require('./routes/urls');

const app = express();
// app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],
    maxAge: 24 * 60 * 60 * 1000,
  })
);
app.set("view engine", "ejs");
app.use('/auth', authRoute);
app.use('/urls', urlsRoute);
app.get('/', (req, res) => {
  res.send('Hi');
})
app.listen(3000, () => console.log('Server 3000 is running'));