const dotenv = require("dotenv");

dotenv.config({
    path: "./.env.desarrollo"
});

const configObject = {
    mongo_url: process.env.MONGO_URL
}

module.exports = configObject;