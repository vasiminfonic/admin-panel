import mongoose from "mongoose";


const employSchema = new mongoose.Schema({
    department: {type: String, required: true},
    list: {type: [String], required:true}
},{timestamps: true});

export default mongoose.model('Department',employSchema,'departments');


