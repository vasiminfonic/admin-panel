import Joi from 'joi';


import { Department } from "../models";
import customErrorHandler from "../services/customErrorHandler";


const departmentController = {
    async getList(req, res, next){
        try{
            const data = await Department.find();
            if(!data){
                return next(customErrorHandler.serverError());
            }
            return res.status(200).json(data);
        }catch(err){
           
            return next(customErrorHandler.serverError(err));
        }
    },
    async addList(req, res, next){
        const { department, list }= req.body;

        const registerSchema = Joi.object({
            department: Joi.string().min(3).max(30).required(),
            list: Joi.array().required(),
        })
       
            
        try{
            const {error} = registerSchema.validate(req.body)
            if (error){
                return next(error);
            }
            const exData = await Department.findOne({department})
            if(exData){
                return next(customErrorHandler.alreadyExist())
            }
            const data = await Department.create({
                department,
                list
            })
            if(!data){
                return next(customErrorHandler.serverError());
            }
            return res.status(200).json({message: 'Data Has Been Inserted', data})
        }catch(err){
            return next(customErrorHandler.serverError(err))
        }

    },
    async updateList(req, res, next){
        const { department, list, _id }= req.body;
        const registerSchema = Joi.object({
            _id: Joi.string().min(3).max(30).required(),
            department: Joi.string().min(3).max(30).required(),
            list: Joi.array().required(),
        })   
        try{
            const {error} = registerSchema.validate(req.body)
            if (error){
                return next(error);
            }
            const data = await Department.findOneAndUpdate({_id},{
                department,
                list
            }, {new:true})
            if(!data){
                return next(customErrorHandler.serverError());
            }
            return res.status(200).json({message: 'Data Has Been Updated', data})
        }catch(err){
            return next(customErrorHandler.serverError(err))
        }
    },
    async deleteList(req, res, next){
        const { _id }= req.params;
        const registerSchema = Joi.object({
            _id: Joi.string().min(3).max(30).required(),
        })   
        try{
            const {error} = registerSchema.validate(req.params)
            if (error){
                return next(error);
            }
            const data = await Department.findOneAndDelete({_id})
            if(!data){
                return next(customErrorHandler.serverError());
            }
            return res.status(200).json({message: 'One Data Has Been Deleted', data})
        }catch(err){
            return next(customErrorHandler.serverError(err))
        }
    },

    async getTotal(req, res, next){
        try{
            const total = await Department.countDocuments();
            if(!total){
                return next(customErrorHandler.serverError());
            }
            return res.status(200).json({message: `Total Number Of Department ${total}`, total});
        }catch(err){
            console.log(err)
            return next(customErrorHandler.serverError(err));
        }
    },
}
export default departmentController;
