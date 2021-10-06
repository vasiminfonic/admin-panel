import Joi from 'joi';
import jwt from 'jsonwebtoken';

import { User } from "../../models";
import customErrorHandler from "../../services/customErrorHandler";

const loginController = {
    async login(req, res, next){
        const { email, password } = req.body;
        console.log(req.body);
        const userSchema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        })
        
        try {
            const {error} = userSchema.validate(req.body);
            if(error){
                return next(error)
            }
            const user = await User.findOne({$and: [{email},{password}]});
            if(!user){
                return next(customErrorHandler.wrongCredentials());
            }else{
                const token = jwt.sign({ _id: user._id }, 'secret', { expiresIn: '1h' });
                res.status(200).json({token});
                console.log(user)
            }
        } catch (err) {
            console.log(err)
            return next(customErrorHandler.serverError(err))
        }
    }
}
export default loginController