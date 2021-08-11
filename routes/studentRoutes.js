const express = require('express')
const Clas = require('../models/classModel')
const auth = require('../auth/auth')

const router = express.Router()

//add student @route GET
//Private
router.get('/add/student/:id', auth, async(req, res) => {

    const clas = await Clas.findById(req.params.id)

    res.render('addStudent', {
        user : req.user,
        clas
    })

})

//add student @route POST
//Private
router.post('/add/student/:id', auth, async(req, res) => {

    const clas = await Clas.findById(req.params.id)

    const {
        Sname,
        Srollno,
        Sgender,
        Sstatus,
        Stype
    } = req.body

     const student = {
            Sname,
            Srollno,
            Sgender,
            Sstatus,
            Stype
     }

    try {

        clas.students.unshift(student)

        await clas.save()

        req.flash('success', 'Student added successfully')

        res.redirect('/dashboard')

    }catch(error) {

        req.flash('error', 'cannot add student')
        res.redirect('/dashboard')
    }

})

//students dashboard @route GET
// Private
router.get('/view/students/:id', auth, async(req, res) => {

    const id = req.params.id
    
    const clas = await Clas.findById(id)

    //finding clas cr
    let cr = clas.students.find((st) => st.Stype === 'cr')

    //finding gr
    let gr = clas.students.find((g) => g.Stype === 'gr')

    if(gr === undefined) {
        gr= {}
    }else{
        gr = clas.students.find((g) => g.Stype === 'gr')
    }

    if(cr === undefined) {
         cr = {}
    }else{
        cr = clas.students.find((st) => st.Stype === 'cr')
    }

    res.render('studentDash', {
        user : req.user,
        clas,
        cr,
        gr
    })
})

//delete student @route DELETE
//Private
router.delete('/delete/student/:clasId/:studentId', auth, async(req, res) => {

    try {

        const classId = req.params.clasId
        const stdId = req.params.studentId
    
        const clas = await Clas.findById(classId)
    
        const student = clas.students.find((stud) => stud.id === stdId)
    
        const index = clas.students.map((student) => student.id).indexOf(student.id)
    
        clas.students.splice(index, 1)
    
        await clas.save()
    
        req.flash('success', 'student deleted')

        res.redirect(`/view/students/${clas.id}`)

    }catch(error) {

        req.flash('error', 'cannot delet student')
        res.redirect(`/view/students/${clas.id}`)
    }
   
})

//update student @route GET
// Private
router.get('/update/student/:classId/:studentId', auth, async(req, res) => {

    const clasId = req.params.classId
    const stdId = req.params.studentId

    const clas = await Clas.findById(clasId)

    const student = clas.students.find((stud) => stud.id === stdId)

    res.render('updateStd', {
        user : req.user,
        clas,
        student
    })

})

//update student @route PUT
//Private
router.put('/update/student/:clsId/:stdId', auth, async(req, res) => {

    const clsId = req.params.clsId
    const stdId = req.params.stdId

    const {
        Sname,
        Srollno,
        Sgender,
        Sstatus,
        Stype
    } = req.body

    const clas = await Clas.findById(clsId)

    const student = clas.students.find((std) => std.id === stdId)

    const index = clas.students.map((student) => student.id).indexOf(student.id)


    clas.students[index].Sname = Sname
    clas.students[index].Srollno = Srollno
    clas.students[index].Sgender = Sgender
    clas.students[index].Sstatus = Sstatus
    clas.students[index].Stype = Stype

    await clas.save()

    req.flash('success', 'student credentials updated')

    res.redirect(`/view/students/${clas.id}`)
})

module.exports = router