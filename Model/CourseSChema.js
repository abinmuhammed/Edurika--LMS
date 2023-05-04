const mongoose=require('mongoose')

const Course=mongoose.Schema({

Title:{
    type:String,
    required:[true,"please add the section"]
},
Description:{
    type:String,
    required:[true,"please add the section"]
},
Author:{
    type:String,
    required:[true,"please add the section"]
},
Category:{
    type:String,
    required:[true,"please add the section"]
},
userID:{
    type:String,
    required:[true,"please add the section"]
    
},
Lessons:[{ ModuleName: String, url: String,duration:Number }],
isvisible:{
    type:Boolean
}


},{
    timestamps: true,
  })

module.exports=mongoose.model('Course',Course)