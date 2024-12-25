const Joi = require("joi");


const sendAttendanceValidator = (data) => {
    const schema = Joi.object({
        teacher_id: Joi.string()
            .required()
            .messages({
                'string.empty': 'Teacher ID is required.',
                'any.required': 'Teacher ID must be provided.',
            }),

        register_location: Joi.string()
            .required()
            .messages({
                'string.empty': 'Register location is required.',
                'any.required': 'Register location must be provided.',
            }),

        register_date: Joi.string()
            .required()
            .messages({
                'string.empty': 'Register date is required.',
                'any.required': 'Register date must be provided.',
            }),

        students_number: Joi.number()
            .max(35)
            .min(15)
            .required()
            .messages({
                'number.min': 'Students number must be exactly 15.',
                'number.max': 'Students number must be exactly 35.',
                'any.required': 'Students number is required.',
            }),

        message: Joi.string() 
            .allow('')
            .messages({
                'string.empty': 'Message can be empty.',
            }),
    });


    const result = schema.validate(data);
    if (result.error) {
        return {
            valid: false,
            msg: `${result.error.details[0].message}`
        }
    }


    return {
        valid: true,
        msg: ``
    }
}


module.exports = {
    sendAttendanceValidator
}