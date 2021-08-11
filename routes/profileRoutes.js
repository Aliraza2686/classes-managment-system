const express = require('express')
const auth = require('../auth/auth')
const Clas = require('../models/classModel')

const router = express.Router()

//profile @route GET
//Private
router.get('/student/profile/:clasId/:stdId', auth, async(req, res) => {

    const clasId = req.params.clasId
    const stdId = req.params.stdId

    const clas = await Clas.findById(clasId)

    const student = clas.students.find((std) => std.id === stdId)

    //finding  quizzes length
    const Qlength = student.quizzes.length

    // finding given quizzes
    const givenQ = student.quizzes.filter((qz) => qz.Qattendence === 'P')
    
    const QAlength = givenQ.length

    //finding abesenties
    const abq = student.quizzes.filter((q) => q.Qattendence === 'A')

    const abqLength = abq.length

    //finding verified assignments
    const Vas = student.assignments.filter((as) => as.Astatus === 'verified')

    const vaslength = Vas.length

     //finding unverified assignments
     const Uas = student.assignments.filter((as) => as.Astatus === 'unverified')

     const uaslength = Uas.length

     //finding present pres
     const Apres = student.presentations.filter((pre) => pre.Pattendence === 'P')

     const Apreslength = Apres.length

      //finding absent pres
      const Abpres = student.presentations.filter((p) => p.Pattendence === 'A')

      const Abpreslength = Abpres.length
 

    res.render('profile', {
        user : req.user,
        clas,
        student,
        Qlength,
        QAlength,
        abqLength,
        vaslength,
        uaslength,
        Apreslength,
        Abpreslength
    })

})

//add quiz @route GET
// Private
router.get('/add/quiz/:clasId/:stdId', auth, async(req, res) => {

    const clasId = req.params.clasId
    const stdId = req.params.stdId

    const clas = await Clas.findById(clasId)

    const student = clas.students.find((std) => std.id === stdId)


    res.render('addQuiz', {
        user : req.user,
        clas,
        student
    })

})

//add quiz @route POST
//Private
router.post('/add/quiz/:clasId/:stdId', auth, async(req, res) => {

    const clasId = req.params.clasId
    const stdId = req.params.stdId

    const clas = await Clas.findById(clasId)

    const student = clas.students.find((std) => std.id === stdId)

    const index = clas.students.map((student) => student.id).indexOf(student.id)

   try {   
        const {
            Qnumber,
            Qtopic,
            Qdate,
            Qattendence,
            Qscore,
            Qscorefrom
        } = req.body

        const perc = Qscore*100/Qscorefrom
        const percentage = perc.toString().substr(0, 4)

        const quiz = {
            Qnumber,
            Qtopic,
            Qdate,
            Qattendence,
            Qscore,
            Qscorefrom,
            Qpercentage : percentage
        }

        clas.students[index].quizzes.unshift(quiz)

        await clas.save()

        req.flash('success', 'Quiz added')

        res.redirect(`/student/profile/${clasId}/${stdId}`)

   } catch (error) {
       req.flash('error', 'cannot add quiz')
       
       res.redirect(`/student/profile/${clasId}/${stdId}`)
   }
})

//delete quiz @route DELETE
//Private
router.delete('/delete/quiz/:clasId/:stdId/:quizId', auth, async(req, res) => {

    const clasId = req.params.clasId
    const stdId = req.params.stdId
    const quizId = req.params.quizId

    try{

        const clas = await Clas.findById(clasId)
  
        const student = clas.students.find((std) => std.id === stdId)
    
        const quiz = student.quizzes.find((qz) => qz.id === quizId)
    
        const index = student.quizzes.map((quiz) => quiz.id).indexOf(quiz.id)

        student.quizzes.splice(index, 1)

        await clas.save()

        req.flash('success', 'quiz deleted')

        res.redirect(`/student/profile/${clasId}/${stdId}`)
        
    }catch(error) {

        req.flash('error', 'cannot delete quiz')

        res.redirect(`/student/profile/${clasId}/${stdId}`)
    }
})

//update quiz @route GET
// private
router.get('/update/quiz/:clasId/:stdId/:quizId', auth, async(req, res) => {


    const clasId = req.params.clasId
    const stdId = req.params.stdId
    const quizId = req.params.quizId

    const clas = await Clas.findById(clasId)
  
    const student = clas.students.find((std) => std.id === stdId)

    const quiz = student.quizzes.find((qz) => qz.id === quizId)

    res.render('updateQuiz', {
        user : req.user,
        clas,
        student,
        quiz
    })

})

//update quiz @route PUT
// private
router.put('/update/quiz/:clasId/:stdId/:quizId', auth, async(req, res) => {

    const clasId = req.params.clasId
    const stdId = req.params.stdId
    const quizId = req.params.quizId

    try {

        const {
            Qnumber,
            Qtopic,
            Qdate,
            Qattendence,
            Qscore,
            Qscorefrom
        } = req.body

        const perc = Qscore*100/Qscorefrom
        const percentage = perc.toString().substr(0, 4)


        const clas = await Clas.findById(clasId)
  
        const student = clas.students.find((std) => std.id === stdId)

        let quiz = student.quizzes.find((qz) => qz.id === quizId)

        const index = student.quizzes.map((quiz) => quiz.id).indexOf(quiz.id)

        student.quizzes[index].Qnumber = Qnumber
        student.quizzes[index].Qtopic = Qtopic
        student.quizzes[index].Qdate = Qdate
        student.quizzes[index].Qattendence = Qattendence
        student.quizzes[index].Qscore = Qscore
        student.quizzes[index].Qscorefrom = Qscorefrom
        student.quizzes[index].Qpercentage = percentage

        await clas.save()

        req.flash('success', 'Quiz updated')

        res.redirect(`/student/profile/${clasId}/${stdId}`)

    } catch (error) {
        
        req.flash('error', 'cannot update quiz')

        res.redirect(`/student/profile/${clasId}/${stdId}`)

    }

})

//add assgnment @route GET
//private
router.get('/add/assignment/:clasId/:stdId', auth, async(req, res) => {
  
    const clasId = req.params.clasId
    const stdId = req.params.stdId
    
    const clas = await Clas.findById(clasId)
  
    const student = clas.students.find((std) => std.id === stdId)
 
    res.render('addAssign', {
        user : req.user,
        clas,
        student
    })

})

//add assignment @route POST
//private
router.post('/add/assignment/:clasId/:stdId', auth, async(req, res) => {

    const clasId = req.params.clasId
    const stdId = req.params.stdId
    
    const {
        Anumber,
        Atopic,
        Adate,
        Aattendence,
        Ascore,
        Ascorefrom,
        Astatus
    } = req.body

    const perc = Ascore*100/Ascorefrom
    const percentage = perc.toString().substr(0, 4)

    try {

        const clas = await Clas.findById(clasId)
  
        const student = clas.students.find((std) => std.id === stdId)

        const index = clas.students.map((student) => student.id).indexOf(student.id)

        const assignment = {

            Anumber,
            Atopic,
            Adate,
            Aattendence,
            Ascore,
            Ascorefrom,
            Astatus,
            Apercentage : percentage
        }

        student.assignments.unshift(assignment)

        await clas.save()

        req.flash('success', 'Assignment added')

        res.redirect(`/student/profile/${clasId}/${stdId}`)

    }catch(error){

        
        req.flash('error', 'cannot add Assignment ')

        res.redirect(`/student/profile/${clasId}/${stdId}`)

    } 

})

//delete assignment @route DELETE
// private
router.delete('/delete/assignment/:clasId/:stdId/:assignId', auth, async(req, res) => {

    const clasId = req.params.clasId
    const stdId = req.params.stdId
    const assignId = req.params.assignId

    try {

        const clas = await Clas.findById(clasId)
  
        const student = clas.students.find((std) => std.id === stdId)

        const assignment = student.assignments.find((as) => as.id === assignId)

        const index = student.assignments.map((assignment) => assignment.id).indexOf(assignment.id)

        student.assignments.splice(index, 1)

        await clas.save()

        req.flash('success', 'Assignment deleted')

        res.redirect(`/student/profile/${clasId}/${stdId}`)
        
    } catch (error) {
        
        req.flash('error', 'cannot delete Assignment')

        res.redirect(`/student/profile/${clasId}/${stdId}`)
        
    }

})

//update assignment @route GET
// private
router.get('/update/assignment/:clasId/:stdId/:assignId', auth, async(req, res) => {

    const clasId = req.params.clasId
    const stdId = req.params.stdId
    const assignId = req.params.assignId

    const clas = await Clas.findById(clasId)
  
    const student = clas.students.find((std) => std.id === stdId)

    const assignment = student.assignments.find((as) => as.id === assignId)

    const index = student.assignments.map((assignment) => assignment.id).indexOf(assignment.id)

    res.render('updateAssign', {
        user : req.user,
        clas,
        student,
        assignment
    })

})

//update assignment @route PUT
//private
router.put('/update/assignment/:clasId/:stdId/:assignId', auth, async(req, res) => {

    const clasId = req.params.clasId
    const stdId = req.params.stdId
    const assignId = req.params.assignId

    const {
        Anumber,
        Atopic,
        Adate,
        Aattendence,
        Ascore,
        Ascorefrom,
        Astatus
    } = req.body

    const perc = Ascore*100/Ascorefrom
    const percentage = perc.toString().substr(0, 4)


    try {

        const clas = await Clas.findById(clasId)
  
        const student = clas.students.find((std) => std.id === stdId)

        const assignment = student.assignments.find((as) => as.id === assignId)

        const index = student.assignments.map((assignment) => assignment.id).indexOf(assignment.id)

        student.assignments[index].Anumber = Anumber
        student.assignments[index].Atopic = Atopic
        student.assignments[index].Adate = Adate
        student.assignments[index].Aattendence = Aattendence
        student.assignments[index].Astatus = Astatus
        student.assignments[index].Ascore = Ascore
        student.assignments[index].Ascorefrom = Ascorefrom
        student.assignments[index].Apercentage = percentage

        await clas.save()

        req.flash('success', 'Assignment updated')

        res.redirect(`/student/profile/${clasId}/${stdId}`)
        
    } catch (error) {
        
        req.flash('error', 'cannot update Assignment')

        res.redirect(`/student/profile/${clasId}/${stdId}`)
        
    }

})

//add presentation @route GET
//private
router.get('/add/pres/:clasId/:stdId', auth, async(req, res) => {

    const clasId = req.params.clasId
    const stdId = req.params.stdId

    const clas = await Clas.findById(clasId)
  
    const student = clas.students.find((std) => std.id === stdId)

    res.render('addPre', {
        user : req.user,
        clas,
        student
    })
})

//add presentation @route POST
//private
router.post('/add/pres/:clasId/:stdId', auth, async(req, res) => {

    const clasId = req.params.clasId
    const stdId = req.params.stdId

    const {
        Pnumber,
        Ptopic,
        Pdate,
        Pattendence,
        Pscore,
        Pscorefrom
    } = req.body

     try {

        const clas = await Clas.findById(clasId)
  
        const student = clas.students.find((std) => std.id === stdId)

        const perc = Pscore*100/Pscorefrom
        const percentage = perc.toString().substr(0, 4)

        const presentation = {
                Pnumber,
                Ptopic,
                Pdate,
                Pattendence,
                Pscore,
                Pscorefrom,
                Ppercentage : percentage
        }

        student.presentations.unshift(presentation)

        await clas.save()

        req.flash('success', 'Presentation added')

        res.redirect(`/student/profile/${clasId}/${stdId}`)
        

     } catch (error) {
         
        req.flash('error', 'Cannot add presentation')

        res.redirect(`/student/profile/${clasId}/${stdId}`)
        
     }

})

//delete presentation @route DELETE
//private
router.delete('/delete/pres/:clasId/:stdId/:presId', auth, async(req, res) => {

    const clasId = req.params.clasId
    const stdId = req.params.stdId
    const presId = req.params.presId

    try {

        const clas = await Clas.findById(clasId)
  
        const student = clas.students.find((std) => std.id === stdId)

        const presentation = student.presentations.find((pre) => pre.id === presId)

        const index = student.presentations.map((presentation) => presentation.id).indexOf(presentation.id)

        student.presentations.splice(index, 1)

        await clas.save()

        req.flash('success', 'Presentation deleted')

        res.redirect(`/student/profile/${clasId}/${stdId}`)
        
    } catch (error) {
        
        req.flash('error', 'cannot delete this Presentation')

        res.redirect(`/student/profile/${clasId}/${stdId}`)
        
    }

})

//update presentation @route GET
//Private
router.get('/update/pres/:clasId/:stdId/:presId', auth, async(req, res) => {

    const clasId = req.params.clasId
    const stdId = req.params.stdId
    const presId = req.params.presId

    const clas = await Clas.findById(clasId)
  
    const student = clas.students.find((std) => std.id === stdId)

    const presentation = student.presentations.find((pre) => pre.id === presId)

    res.render('updatePres', {
        user : req.user,
        clas,
        student,
        presentation
    })

})

//update presentation @route PUT
//private
router.put('/update/pres/:clasId/:stdId/:presId', auth, async(req, res) => {

    const clasId = req.params.clasId
    const stdId = req.params.stdId
    const presId = req.params.presId

    const {
        Pnumber,
        Ptopic,
        Pdate,
        Pattendence,
        Pscore,
        Pscorefrom
    } = req.body

    const perc = Pscore*100/Pscorefrom
    const percentage = perc.toString().substr(0, 4)


    try {

        const clas = await Clas.findById(clasId)
  
        const student = clas.students.find((std) => std.id === stdId)

        const presentation = student.presentations.find((pre) => pre.id === presId)

        const index = student.presentations.map((presentation) => presentation.id).indexOf(presentation.id)

        student.presentations[index].Pnumber = Pnumber
        student.presentations[index].Ptopic = Ptopic
        student.presentations[index].Pdate = Pdate
        student.presentations[index].Pattendence = Pattendence
        student.presentations[index].Pscore = Pscore
        student.presentations[index].Pscorefrom = Pscorefrom
        student.presentations[index].Ppercentage = percentage

        await clas.save()

        req.flash('success', 'presentation updated')

        res.redirect(`/student/profile/${clasId}/${stdId}`)
        
    } catch (error) {
        
        req.flash('error', 'cannot update presentation')

        res.redirect(`/student/profile/${clasId}/${stdId}`)
        
    }

})

module.exports = router