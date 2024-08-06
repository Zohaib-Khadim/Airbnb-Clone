const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email:{
        type:String,
        required:true
    }
});
// this will add the username , password in their hashed and salted form plus more methods 
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",userSchema)
