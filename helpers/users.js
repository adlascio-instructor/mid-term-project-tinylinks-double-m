const fs = require('fs');
const bcrypt = require("bcrypt");
const { getFilePath } = require('./file');

const filePath = getFilePath('/models/users.json');

function getAllUsers() {
    let users = [];
    const fileContent = fs.readFileSync(filePath, 'utf8');
    if (fileContent) {
        users = Object.values(JSON.parse(fileContent));
    }
    return users;
}

function createUser(newUser) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    if (fileContent) {
        const userObj = JSON.parse(fileContent);
        userObj[newUser.id] = newUser;
        const newFileContent = JSON.stringify(userObj);
        fs.writeFileSync(filePath, newFileContent);
    }
}

async function verifyUserCredentials(email, password) {
    const users = getAllUsers();
    const foundUser = users.find(u => u.email === email);
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

    let user = undefined;

    const fileContent = fs.readFileSync(filePath, 'utf8');
    if (fileContent) {
        user = JSON.parse(fileContent)[userid];
    }

    return user;
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
