const { getAllUsers, createUser, hashPassword, verifyUserCredentials, getLoggedUser } = require('../helpers/users');
const { v4: uuidv4 } = require('uuid');

async function showRegisterForm(req, res) {
    const loggedUser = getLoggedUser(req.session.userid);
    if (loggedUser) {
        res.redirect('/urls');
        return;
    }

    res.render('register', { error: undefined });
}

async function registerNewUser(req, res) {
    if (!req.body.email || !req.body.password || !req.body.name) {
        res.render('register', { error: 'Please provide name, email and password' });
        return;
    }

    const users = getAllUsers();

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
    res.redirect('/urls');
}

async function showLoginForm(req, res) {
    const loggedUser = getLoggedUser(req.session.userid);
    if (loggedUser) {
        res.redirect('/urls');
        return;
    }
    
    res.render('login', { error: '' });
}

async function login(req, res) {
    if (!req.body.email || !req.body.password) {
        res.render('login', { error: 'Please provide email and password' });
        return;
    }

    const loggedUser = await verifyUserCredentials(req.body.email, req.body.password);
    if (!loggedUser) {
        res.render('login', { error: 'Invalid email and password' });
        return;
    }

    req.session.userid = loggedUser.id;
    res.redirect('/urls');
}

function logout(req, res) {
    req.session = null;
    res.redirect("/auth/login");
}

module.exports = {
    showRegisterForm,
    registerNewUser,
    showLoginForm,
    login,
    logout,
}