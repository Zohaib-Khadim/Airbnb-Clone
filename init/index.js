const mongoose  = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGOOSE_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
.then(()=>{
    console.log("Connected to DB Successfully");
})
.catch(()=>{
    console.log(err);
})
async function main(){
    await mongoose.connect(MONGOOSE_URL);
}

const initDB = async()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj,owner:'66a8efe5fc492a3bb03b8347'}));
    await Listing.insertMany(initData.data);
    console.log("successful Initialization of Db Data");
}

initDB();