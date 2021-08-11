const express = require('express')
const Clas = require('../models/classModel')
const auth = require('../auth/auth')

const router = express.Router()

//syllabus @route GET
//private
router.get('/syllabus/:id', auth, async(req, res) => {

  const id = req.params.id
  const clas = await Clas.findById(id)

  res.render('syllabus', {
      user : req.user,
      clas
  })
})

//add topic @route GET
//private
router.get('/topic/add/:id', auth, async(req, res) => {
    const clas = await Clas.findById(req.params.id)

    res.render('addTopic', {
        user : req.user,
        clas
    })
})

//add topic @route POST
//private
router.post('/topic/add/:id', auth, async(req, res) => {

    const { topic, status } = req.body

    const clasId = req.params.id

    const clas = await Clas.findById(req.params.id)

    try {
        
      const newTopic = {
          topic,
          status
      }

      clas.syllabus.unshift(newTopic)

      await clas.save()

      req.flash('success', 'Topic Added')

      res.redirect(`/syllabus/${clasId}`)

    } catch (error) {

        req.flash('error', 'Cant Add this topic')

        res.redirect(`/syllabus/${clasId}`)
    }

})

//delete topic @route DELETE
//private
router.delete('/delete/topic/:clasId/:topId', auth, async(req, res) => {

    try{

        const clasId = req.params.clasId
        const topId = req.params.topId

        const clas = await Clas.findById(clasId)

        const topic = clas.syllabus.find((sy) => sy.id === topId)

        const index = clas.syllabus.map((topic) => topic.id).indexOf(topic.id)

        clas.syllabus.splice(index, 1)

        await clas.save()

        req.flash('success', 'Topic Deleted')

        res.redirect(`/syllabus/${clasId}`)
    }catch(error) {

        req.flash('error', 'cant delete this topic')

        res.redirect(`/syllabus/${clasId}`)
    }

})

//update topic @route GET
//private
router.get('/update/topic/:clasId/:topId', auth, async (req, res) => {
    const clasId = req.params.clasId
    const topId = req.params.topId

    const clas = await Clas.findById(clasId)

    const topic = clas.syllabus.find((sy) => sy.id === topId)

    res.render('updateTopic', {
        user : req.user,
        clas,
        topic
    })

})

//update topic @route PUT
//private
router.put('/update/topic/:clasId/:topId', auth, async(req, res) => {

    const { topic, status } = req.body

    try{

        const clasId = req.params.clasId
        const topId = req.params.topId

        const clas = await Clas.findById(clasId)

        const topics = clas.syllabus.find((sy) => sy.id === topId)

        const index = clas.syllabus.map((topics) => topics.id).indexOf(topics.id)

        clas.syllabus[index].topic = topic
        clas.syllabus[index].status = status

        await clas.save()

        req.flash('success', 'Topic updated')

        res.redirect(`/syllabus/${clasId}`)
    }catch(error) {

        req.flash('error', 'cant update this topic')

        res.redirect(`/syllabus/${clasId}`)
    }


})

module.exports = router