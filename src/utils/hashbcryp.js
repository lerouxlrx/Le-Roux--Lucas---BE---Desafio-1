//Hasheo contraseñas

const bcrypt = require("bcrypt");

//Hashear Password:
const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

//Validar Password:

const isValidPassword = (password, user) => bcrypt.compareSync(password, user.password);

module.exports = {
    createHash,
    isValidPassword
}