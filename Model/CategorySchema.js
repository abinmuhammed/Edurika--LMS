const mongoose=require('mongoose')

const CategorySchema=mongoose.Schema({

    CategoryName:{
        type:String,
        required:[true,"Please Add Category Name"]
    },
    Description:{
        type:String,
        required:[true,"Please Add the Description"]
    },
    Image:{
        type:String,
        required:[true,"please Add the Image"]
    },
    isDelete:{
        type:Boolean
    }
},{
    timestamps: true,
  })

module.exports=mongoose.model('Category',CategorySchema)