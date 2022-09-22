const fs = require('fs');
const bcrypt = require("bcrypt");
const { getFilePath } = require('./file');
const users = require('../models/users.json');

const filePath = getFilePath('/models/users.json');

function getAllUsers() {
    return Object.values(users);
}

function createUser(newUser) {
    users[newUser.id] = newUser;
    const newFileContent = JSON.stringify(users);
    fs.writeFileSync(filePath, newFileContent);
}

async function verifyUserCredentials(email, password) {
    const foundUser = getAllUsers().find(u => u.email === email);
    if (foundUser && await bcrypt.compare(password, foundUser.password)) {
        return foundUser;
    } else {
        return false;
    }
}

function getLoggedUser(userid) {
    if (!userid) {
        return undefined;
    }
    return users[userid];
}

const hashPassword = async (password) => {
    const saltRounds = 12;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

module.exports = {
    getAllUsers,
    createUser,
    hashPassword,
    verifyUserCredentials,
    getLoggedUser,
};
