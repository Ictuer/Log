require('dotenv').config()
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET


var encode = function(data, expiresIn = 10**10) {
    data.salt = Date.now()
    return jwt.sign(data, JWT_SECRET, { expiresIn })
}

var decode = function(token) {
    try {
        var res = jwt.verify(token, JWT_SECRET)
    } catch(e) {
        return null
    }
    return res
}

module.exports = {
    encode,
    decode
}

