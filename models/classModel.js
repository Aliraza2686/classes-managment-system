const mongoose = require('mongoose')

const classSchema = new mongoose.Schema({
      user : {
          type : mongoose.Schema.Types.ObjectId,
          ref : 'User'
      },
     classname : {
          type : String,
          trim : true,
      },
     semmester : {
         type : String,
         trim : true
     },
     department : {
         type : String,
         trim : true
     },
     timeline : {
         type : String,
         trim : true
     },
     subject : {
         type : String,
         trim : true
     },
     credithours : {
         type : String,
         trim : true
     },
     subjectcode : {
         type : String,
         trim : true
     },
     teacher : {
         type : String,
         trim : true
     },
     shift : {
         type : String,
         Enumerator : ["Morning", "Evening"]
     },
     students : [{
         Sname : {
             type : String,
             trim : true
         },
         Srollno : {
             type : String,
             trim : true
         },
         Sgender : {
             type : String,
             Enumerator : ["male", "female"]
         },
         Sstatus : {
             type : String,
             Enumerator : ["average", "good", "excelent", "bad"]
         },
          Stype : {
             type : String,
             Enumerator : ["cr", "gr", "secondCr", "secondGr", "genral"]
         }, 
         quizzes : [{
             Qnumber :{
                 type : String,
                 trim : true
             },
             Qtopic : {
                 type : String,
                 trim : true
             },
             Qdate : {
                 type : String,
                 trim : true
             },
             Qattendence : {
                 type : String,
                 Enumerator : ["P","A","L"]
             },
            Qscore : {
                type : String,
                trim : true
            },
            Qscorefrom : {
                type : String,
                trim : true
            },
            Qpercentage : {
                type : String,
                trim : true
            }
         }],
         assignments : [{
             Anumber : {
                 type : String,
                 trim : true
             },
             Adate : {
                 type : String,
                 trim : true
             },
             Atopic : {
                 type : String,
                 trim : true
             },
             Aattendence : {
                 type : String,
                 Enumerator : ["P","A","L"]  
             },
             Astatus : {
                 type : String,
                 Enumerator : ["verified", "unverified"]
             },
             Ascore : {
                 type : String,
                 trim : true
             },
             Ascorefrom : {
                 type : String,
                 trim : true
             },
             Apercentage : {
                 type : String,
                 trim : true
             }
         }],
         presentations : [{
              Pnumber : {
                 type : String,
                 trim : true
             },
             Ptopic : {
                 type : String,
                 trim : true
             },
             Pattendence : {
                 type : String,
                 Enumerator : ["P","A","A"]
             },
             Pdate : {
                type : String,
                trim : true
             },
             Pscore : {
                 type : String,
                 trim : true
             },
             Pscorefrom : {
                 type : String,
                 trim : true
             },
             Ppercentage : {
                 type : String,
                 trim : true
             }
         }]
     }],
     syllabus : [{
         topic : {
             type : String,
             trim : true,
         },
         status : {
             type : String,
             Enumerator : ["Pending", "Completed"],
             default : "Pending",
         }
     }]
    
})

const Clas = mongoose.model('Clas', classSchema)

module.exports = Clas