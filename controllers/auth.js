const { getAllUsers, createUser, hashPassword } = require('../helpers/users');
const { v4: uuidv4 } = require('uuid');

async function showRegisterForm(_req, res) {
    res.render('register', { error: '' });
}

async function registerNewUser(req, res) {
    const users = getAllUsers();

    console.log('body', req.body)

    if (!req.body.email || !req.body.password || !req.body.name) {
        res.render('register', { error: 'Please provide name, email and password' });
        return;
    }

    const sameEmail = users.some(u => u.email === req.body.email);

    if (sameEmail) {
        res.render('register', { error: 'This email is already in use' });
        return;
    }

    const hashedPassword = await hashPassword(req.body.password);
    const userId = uuidv4();

    createUser({
        id: userId,
        email: req.body.email,
        password: hashedPassword,
        name: req.body.name,
    });

    req.session.userid = userId;
    res.send('User created!');
}

module.exports = {
    showRegisterForm,
    registerNewUser,
}