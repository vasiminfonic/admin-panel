import { ValidationError } from "joi";
import customErrorHandler from "../services/customErrorHandler";


const errorHandlers = (err, req, res, next) =>{
    let statusCode = 500;
    let data = {
        message: 'Internal server error',
        originalError: err
        // ...(DEBUG_MODE === 'true' && { originalError: err.message })
    }
    if( err instanceof ValidationError){
        data={
            message: err.message
        }
    }
    else if(err instanceof customErrorHandler){
        statusCode = err.status;
        data={
            message: err.message
        }
    }
    return res.status(statusCode).json(data);
}
export default errorHandlers;