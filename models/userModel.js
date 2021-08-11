const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
     name : {
         type : String,
         trim : true,
         required : true
     },
     email : {
         type : String,
         trim : true,
         required : true,
         unique : true
     },
     password : {
         type : String,
         trim : true,
         required : true,
         minlength : 6
     }
})

const User = mongoose.model('User', userSchema)

module.exports = User