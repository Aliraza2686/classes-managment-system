const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

const auth = ((req, res, next) => {

    const token = req.cookies.jwt
    
    if(token) {
        jwt.verify(token, 'secret token', async(error, decodedToken) => {

            if(error) {
                return res.redirect('/login')
            }
            else {

                const id = decodedToken.id

                const user = await User.findById(id)

                req.user = user

                next()
            }
        })
    }else{
        res.redirect('/login')
    }
})

module.exports = auth