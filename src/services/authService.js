require("dotenv").config();
const jwt = require("jsonwebtoken");
const JWT_KEY = process.env.JWT_KEY;

function checkApiKey(api_key) {
    const API_KET = process.env.API_KEY;
    if (api_key == API_KET){
        return true;
    }
    else
        return false
}

function assignJwt(id) {
    const token = jwt.sign({
        data: id
    }, JWT_KEY, { expiresIn: '3d' });
    return token;
}

function verifyJwt(token) {
    try {
        const id = jwt.verify(token, JWT_KEY);
        return { id: id }
    } catch (error) {
        return { error: error.message }
    }

}

module.exports = {
    checkApiKey,
    assignJwt,
    verifyJwt
}