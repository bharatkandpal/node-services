const mongoose = require("mongoose")


//create Book Model(Schema)
mongoose.model("Book",{
    // Title,author,numberPages,publisher
    title:{
        type:String,
        required:true,
    },
    author:{
        type:String,
        required:true
    },
    numberPages:{
        type:Number,
        required:false
    },
    publisher:{
        type: String,
        required:false
    }
})