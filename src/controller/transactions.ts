import * as Joi from "joi";
import transferRequestRepoImpl from "../repos/transfer-request-repo-impl";

const inflows = async(req: any, res: any ) => {
    try{
        const { page = 1, limit } = req.query;
        console.log(req.params);
        const response = await transferRequestRepoImpl.getUserInflowPayments(page, req.user.id, parseInt(limit.toString()));
        res.json({
            ...response
        })
    }catch(e){
        console.log(e);
        res.status(500).json({
            errors: [
                e.message
            ]
        })
    }
}

const outflows = async(req: any, res: any ) => {
    try{
        const schema = Joi.object().keys({
            page: Joi.types().number.optional(),
        });

        const validated = schema.validate(req.params);
        const { value, error, warning } = validated;
        if(error){
            throw error;
        }

        if(warning){
            console.log(warning);
        }
        const { page = 1 } = value;
        const response = await transferRequestRepoImpl.getUserInflowPayments(page, req.user.id);
        res.json({
            data:{
                ...response
            }
        })
    }catch(e){
        res.status(500).json({
            errors: [
                e.message
            ]
        })
    }
}

export default {
    inflows,
    outflows
}