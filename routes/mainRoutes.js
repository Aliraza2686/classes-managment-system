const express = require('express')
const auth = require('../auth/auth')
const Clas = require('../models/classModel')

const router = express.Router()

router.get('/dashboard', auth, async(req, res) => {

    const classes = await Clas.find({user : req.user.id})

    //finding morning classes 
    const morning = await Clas.find({user : req.user.id, shift : 'Morning'})

    //findning eveninig classes
    const evening = await Clas.find({user : req.user.id, shift : "Evening"})
  
    const eveLength = evening.length

    res.render('index', {
        user : req.user,
        classes,
        morning,
        eveLength
    })
})

//logout @route GET
//private
router.get('/logout', auth, (req, res) => {

    res.cookie('jwt', '', {
        httpOnly : true
    })

    req.flash('success', 'You are now loged out')

    res.redirect('/login')
})

//add class @route GET
router.get('/add/class', auth, (req, res) => {

     res.render('addClass', {
         user : req.user
     })
})

//add class @route POST
// Private
router.post('/add/class', auth, async(req, res) => {

    const { 
            classname,
            semmester, 
            timeline, 
            department, 
            subject, 
            subjectcode, 
            credithours, 
            teacher, 
            shift 
        } = req.body

        const user = req.user.id

        try {

            const clas = new Clas({
                classname,
                semmester, 
                timeline, 
                department, 
                subject, 
                subjectcode, 
                credithours, 
                teacher, 
                shift,
                user 
            })

            await clas.save()

            req.flash('success', 'Class has been added')

            res.redirect('/dashboard')

        }catch(error) {
 
            req.flash('error', 'Cannot add class')

            res.redirect('/class/add')
        }
})

module.exports = router