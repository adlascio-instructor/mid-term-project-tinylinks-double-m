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
};
