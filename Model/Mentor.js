const mongoose=require ('mongoose')

const mentors=mongoose.Schema({

    FirstName:{
        type:String,
        required:[true,"please add the first Name"]
    },
    LastName:{
        type:String,
        required:[true,"please add the Last Name"]
    },
    Email:{
        type:String,
        required:[true,"please add the Email"]
    },
    Mobile:{
        type:String,
        required:[true,"please add the Mobile number"]
    },
    Password:{
        type:String,
        required:[true,"please add the password"]
    },
    isActive:{
        type:Boolean,
        default:true
    }



})

module.exports=mongoose.model('mentors',mentors)