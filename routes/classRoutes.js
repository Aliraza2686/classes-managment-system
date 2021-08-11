const express = require('express')
const Clas = require('../models/classModel')
const auth = require('../auth/auth')

const router = express.Router()

//delete class @route DELETE
//Private
router.delete('/delete/class/:id', auth, async(req, res) => {

    const id = req.params.id

    try {

        const clas = await Clas.findByIdAndDelete(id)
 
        req.flash('success', 'class has been deleted')

        res.redirect('/dashboard')
    }catch(error) {

        req.flash('error', 'cannot delete this class')

        res.redirect('/dashboard')
    }
})

//update class @route GET
//Private
router.get('/update/class/:id', auth, async(req, res) => {

    const clas = await Clas.findById(req.params.id)

    res.render('updateClass', {
        user : req.user,
        clas
    })

})

//class update @route PUT
//Private
router.put('/update/class/:id', auth, async(req, res) => {

    const id = req.params.id

    try {

          const clas = await Clas.findByIdAndUpdate(id, req.body, {
              new : true,
              runValidators : true
          })

          await clas.save()

          req.flash('success', 'class successfully updated')

          res.redirect('/dashboard')


    }catch(error){

        req.flash('error', 'class cannot be updated')

        res.redirect('/dashboard')
    }

})
module.exports = router