import { Employ } from "../models";
import Joi from 'joi';
import multer from "multer";
import path from 'path';
import fs from 'fs';


import customErrorHandler from "../services/customErrorHandler";


const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(
            Math.random() * 1e9
        )}${path.extname(file.originalname)}`;
        // 3746674586-836534453.png
        cb(null, uniqueName);
    },
});

export const handleMultipartData = multer({
    storage,
    limits: { fileSize: 1000000 * 5 },
}).single('image'); // 5mb


const employController = {


    async register(req, res, next) {
        console.log(req.body);
        console.log(req.file);
        //  console.log(req.files)
        const { name, father, email, dob, mobileNo, address, position, department, joinDate, status, salary, title, formerDate } = req.body;
        const registerSchema = Joi.object({
            title: Joi.string().required(),
            name: Joi.string().min(3).max(30).required(),
            father: Joi.string().min(3).max(30).required(),
            email: Joi.string().email().required(),
            mobileNo: Joi.string().length(10).required(),
            address: Joi.string().required(),
            dob: Joi.date().raw().required(),
            position: Joi.string().required(),
            department: Joi.string().required(),
            joinDate: Joi.date().raw().required(),
            salary: Joi.string().min(3).max(6).required(),
            status: Joi.string(),
            image: Joi.string().allow(''),
            formerDate: Joi.date().raw().allow('')
        });
        let filePath;
        try {
            const { error } = registerSchema.validate(req.body);

            if (!!req.file) {
                filePath = req.file.path;
            }
            console.log(req.body);
            console.log(req.file)


            if (error) {
                // Delete the uploaded file
                if (filePath) {
                    fs.unlink(`${appRoot}/${filePath}`, (err) => {
                        if (err) {
                            return next(
                                customErrorHandler.serverError(err.message)
                            );
                        }
                    });

                }

                return next(error);
                // rootfolder/uploads/filename.png
            }

            const exEmploy = await Employ.findOne({ email });
            if (exEmploy) {
                if (filePath) {
                    fs.unlink(`${appRoot}/${filePath}`, (err) => {
                        if (err) {
                            return next(
                                customErrorHandler.serverError(err.message)
                            );
                        }
                    })

                }

                return next(customErrorHandler.alreadyExist());
            } else {
                try {
                    const employ = await Employ.create({
                        title,
                        name,
                        father,
                        email,
                        ...(req.file && { image: filePath }),
                        image: filePath,
                        mobileNo,
                        address,
                        position,
                        department,
                        joinDate,
                        formerDate,
                        ...(status === 'former' && { formerDate }),
                        status,
                        salary,
                        dob
                    });
                    res.status(200).json({message: 'Employee Has Been Registered Successfully',data: employ});
                } catch (err) {
                    console.log(err);
                    if (filePath) {
                        fs.unlink(`${appRoot}/${filePath}`, (err) => {
                            if (err) {
                                return next(
                                    customErrorHandler.serverError(err.message)
                                );
                            }
                        })
                    }

                    return next(err);
                }
            }

        } catch (err) {
            if (filePath) {
                fs.unlink(`${appRoot}/${filePath}`, (err) => {
                    if (err) {
                        return next(
                            customErrorHandler.serverError(err.message)
                        );
                    }
                })
            }
            console.log(err)
            return next(err);
        }
    },




    async update(req, res, next) {


        const { _id, title, name, father, email, dob, mobileNo, address, position, department, joinDate, status, salary, formerDate } = req.body;
        const registerSchema = Joi.object({
            _id: Joi.string().min(3).max(30).required(),
            title: Joi.string().required(),
            name: Joi.string().min(3).max(30).required(),
            father: Joi.string().min(3).max(30).required(),
            email: Joi.string().email().required(),
            mobileNo: Joi.string().length(10).required(),
            address: Joi.string().required(),
            dob: Joi.date().raw().required(),
            position: Joi.string().required(),
            department: Joi.string().required(),
            joinDate: Joi.string(),
            salary: Joi.string().min(3).max(6).required(),
            status: Joi.string(),
            image: Joi.string().allow(''),
            formerDate: Joi.string().allow(''),
            createdAt: Joi.string().allow()
        });
        let filePath;

        try {

            const { error } = registerSchema.validate(req.body);
            if (!!req.file) {
                filePath = req.file.path;
            }


            if (error) {
                if (filePath) {
                    fs.unlink(`${appRoot}/${filePath}`, (err) => {
                        if (err) {
                            return next(
                                customErrorHandler.serverError(err.message)
                            );
                        }
                    });
                }
                // Delete the uploaded file


                return next(error);
                // rootfolder/uploads/filename.png
            }


            try {
                const employ = await Employ.findOneAndUpdate(
                    { _id }, {
                    title,
                    name,
                    father,
                    email,
                    ...(req.file && { image: filePath }),
                    mobileNo,
                    address,
                    position,
                    department,
                    joinDate,
                    formerDate,
                    status,
                    salary,
                    dob
                }, { new: true }
                );
                res.status(201).json({message: 'Employee Profile Update Successfully',data: employ});
            } catch (err) {
                if (filePath) {
                    fs.unlink(`${appRoot}/${filePath}`, (err) => {
                        if (err) {
                            return next(
                                customErrorHandler.serverError(err.message)
                            );
                        }
                    })
                }
                return next(customErrorHandler.serverError(err.message));
            }

        } catch (err) {
            if (!!filePath) {
                fs.unlink(`${appRoot}/${filePath}`, (err) => {
                    if (err) {
                        return next(
                            customErrorHandler.serverError(err.message)
                        );
                    }
                })
            }
            console.log(err)
            next(customErrorHandler.serverError(err))
        }

    },


    async remove(req, res, next) {
        const { ids } = req.body;
        const cou = ids.length;
        try {
            const employ = await Employ.deleteMany({ _id: {$in: ids}});
            if (!employ) {
                return next(new Error('Nothing to Delete'));
            }
            // const imagePath = employ._doc.image;
            const imagePath = '';

            if(imagePath){
                fs.unlink(`${appRoot}/${imagePath}`, (err) => {
                    if (err) {
                        return next(
                            customErrorHandler.serverError(err.message)
                        );
                    }
                })
            }
            res.status(200).json({ message: `${cou} employ Removed` });
        } catch (err) {
            console.log(err);
            return next(err)
        }
    },


    async getOne(req, res, next) {
        const _id = req.params.id
        try {
            const employ = await Employ.findOne({ _id }).select('-updatedAt -__v');
            return res.status(200).json(employ);
        } catch (err) {
            next(customErrorHandler.serverError(err));
        }
    },


    async getEmploy(req, res, next) {
        try {
            const employ = await Employ.find().select('-updatedAt -__v')
                .sort({ _id: -1 });
            return res.json(employ);
        } catch (err) {
            next(customErrorHandler.serverError(err))
        }
    },

    async getEmployPostion(req, res, next) {
        const { position, department} = req.query;
        console.log(req.query);
        try {
            const employ = await Employ.findOne({$and: [{department},{position}]}).select('-updatedAt -__v')
            return res.json(employ);
        } catch (err) {
            console.log(err)
            next(customErrorHandler.serverError(err))
        }
    },

    async getList(req, res, next) {
        let { page, row } = req.query
        if (page < 0 || row < 1) {
            page = 0
            row = 1
        }
        try {
            const total = await Employ.countDocuments();
            const employ = await Employ.find().skip(+(+page * +row)).limit(+row).select('-updatedAt -__v')
                .sort({ _id: -1 });
            if(!employ){
                 employint = await Employ.find().skip(+(0)).limit(+row).select('-updatedAt -__v')
                .sort({ _id: -1 });
                if(!employint){
                    return next(customErrorHandler.serverError())
                }
                return res.json({data: employint, total});
            }    
            return res.json({data: employ, total});
        } catch (err) {
            next(customErrorHandler.serverError(err))
        }

    },
    async getStatus(req, res, next) {
        let { status } = req.params;
        console.log('visited',status)
        try {
            const total = await Employ.countDocuments({status});
            if(!total){
                return next(customErrorHandler.serverError());
            }
            return res.json({message: `Total Number Of ${status ==='active' ? 'Active' : 'Former'} Imployee ${total}`, total});
        } catch (err) {
            next(customErrorHandler.serverError(err))
        }
    },
    async getTotal(req, res, next) {
        try {
            const total = await Employ.countDocuments();
            if(!total){
                return next(customErrorHandler.serverError());
            }
            return res.json({message: `Total Number Of Imployee ${total}`, total});
        } catch (err) {
            next(customErrorHandler.serverError(err))
        }
    }



}
export default employController;