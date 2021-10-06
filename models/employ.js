import mongoose from "mongoose";

import { APP_URL } from '../config'



const employSchema = new mongoose.Schema({
    title: {type: String, required: true},
    name: {type: String, required: true},
    email: {type: String, required:true, unique: true, lowercase: true,},
    father: {type: String, required: true},
    dob: {type: Date, required: true},
    mobileNo: {type: Number, required: true},
    image: {
        type: String,
        get: (image) => {
            return `${APP_URL}/${image}`;
        },
    },
    address: {type: String, required: true},
    position: {type: String, required: true},
    department: {type: String, require: true},
    joinDate: { type: Date, require: true},
    formerDate: { type: Date},
    salary: {type: Number, required: true},
    status: {type: String, default: 'working'}
},{timestamps: true, toJSON: {getters: true}, id:false});

export default mongoose.model('Employ',employSchema,'emploies');


