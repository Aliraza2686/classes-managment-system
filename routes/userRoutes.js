const express = require('express')
const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const router = express.Router()

//register @route GET
// Public
router.get('/', (req, res) => {
    res.render('register')
})

//login @route GET
// Public
router.get('/login', (req, res) => {

    res.render('login')
})

//register @route POST
// Public
router.post('/', async(req, res) => {
    
    const { name, email, password } = req.body

    const hashedPassword = await bcrypt.hash(password, 8)

    try {

        const user = new User({
            name,
            email,
            password : hashedPassword
        })

        await user.save()

        req.flash('success', 'Account successfully registered now you can login')

        res.redirect('/login')
    }catch(error) {

        if(error.code === 11000) {
            req.flash('error', 'This email already exists')
            res.redirect('/')
        }else {
            req.flash('error', 'Cannot register this account')
            res.redirect('/')
        }
    }
    
})

//login @route POST
// Public
router.post('/login', async(req, res) => {
    
    const { email, password } = req.body

    try {
         //finding user by email
        const user = await User.findOne({email : email})

        if(!user) {
            req.flash('error', 'cannot find any user with this email')
            return res.redirect('/login')
        }else {

            //finding by password
            const isMatch = await bcrypt.compare(password, user.password)
            if(!isMatch) {
                req.flash('error', 'invalid password')
                return res.redirect('/login')
            }

            //assigning token
            const token = jwt.sign({id : user.id}, 'secret token')
            
            //assigning cookie
            res.cookie('jwt', token, {
                httpOnly : true
            })

            res.redirect('/dashboard')
        }

    }catch(error) {

        req.flash('error', 'invalid credentials')
        res.redirect('/login')
    }
})

module.exports = router