const Joi = require("joi");

const loginTeacherValidator = (loginData) => {
    const schema = Joi.object({
        username: Joi.string()
            .required()
            .messages({
                'string.empty': 'Username is required and cannot be empty.',
                'any.required': 'Username must be provided.',
            }),

        password: Joi.string()
            .required()
            .messages({
                'string.empty': 'Password is required and cannot be empty.',
                'any.required': 'Password must be provided.',
            }),
    });

    const result = schema.validate(loginData);
    if (result.error) {
        return {
            valid: false,
            msg: result.error.details[0].message
        }
    }

    return {
        valid: true,
        msg: ``
    }

};


const registerTeacherValidator = (teacherData) => {
    const schema = Joi.object({
        teacher_id: Joi.string()
            .required()
            .messages({
                'string.empty': 'Teacher ID is required and cannot be empty.',
                'any.required': 'Teacher ID must be provided.',
            }),

        region_id: Joi.string()
            .required()
            .messages({
                'string.empty': 'Region ID is required and cannot be empty.',
                'any.required': 'Region ID must be provided.',
            }),

        governorate_id: Joi.string()
            .required()
            .messages({
                'string.empty': 'Governorate ID is required and cannot be empty.',
                'any.required': 'Governorate ID must be provided.',
            }),

        full_name: Joi.string()
            .required()
            .messages({
                'string.empty': 'Full name is required and cannot be empty.',
                'any.required': 'Full name must be provided.',
            }),
        gender: Joi.string()
            .required()
            .messages({
                'string.empty': 'gender is required and cannot be empty.',
                'any.required': 'gender must be provided.',
            }),
        birth_date: Joi.string()
            .required()
            .messages({
                'string.empty': 'Birth date is required and cannot be empty.',
                'any.required': 'Birth date must be provided.',
            }),

        phone_number: Joi.string()
            .required()
            .messages({
                'string.empty': 'Phone number is required and cannot be empty.',
                'any.required': 'Phone number must be provided.',
            }),

        work: Joi.string()
            .required()
            .messages({
                'string.empty': 'Work is required and cannot be empty.',
                'any.required': 'Work must be provided.',
            }),

        mosque_name: Joi.string()
            .required()
            .messages({
                'string.empty': 'Mosque name is required and cannot be empty.',
                'any.required': 'Mosque name must be provided.',
            }),

        degree: Joi.string()
            .required()
            .messages({
                'string.empty': 'Degree is required and cannot be empty.',
                'any.required': 'Degree must be provided.',
            }),

        previous_teacher: Joi.boolean()
            .required()
            .messages({
                'any.required': 'Previous teacher status must be provided.',
            }),
    });

    const result = schema.validate(teacherData);
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
    loginTeacherValidator,
    registerTeacherValidator
}