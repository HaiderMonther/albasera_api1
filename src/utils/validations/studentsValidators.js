const Joi = require("joi");

function addStudentValidator(data) {
    const schema = Joi.object({
        name: Joi.string()
            .required()
            .messages({
                'string.empty': 'Name is required and cannot be empty.',
                'any.required': 'Name must be provided.',
            }),

        age: Joi.number()
            .required()
            .messages({
                'number.base': 'Age must be a number.',
                'any.required': 'Age is required and must be provided.',
            }),

        phone_number: Joi.string()
            .required()
            .messages({
                'string.empty': 'Phone number is required and cannot be empty.',
                'any.required': 'Phone number must be provided.',
            }),
        gender: Joi.string()
            .required()
            .messages({
                'string.empty': 'gender is required and cannot be empty.',
                'any.required': 'gender must be provided.',
            }),
        degree: Joi.string()
            .required()
            .messages({
                'string.empty': 'Degree is required and cannot be empty.',
                'any.required': 'Degree must be provided.',
            }),

        size: Joi.string()
            .required()
            .messages({
                'string.empty': 'Size is required and cannot be empty.',
                'any.required': 'Size must be provided.',
            }),

        teacher_id: Joi.string()
            .required()
            .messages({
                'string.empty': 'Teacher ID is required and cannot be empty.',
                'any.required': 'Teacher ID must be provided.',
            }),
    });


    const result = schema.validate(data);
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

function editStudentValidator(data) {
    const schema = Joi.object({
        name: Joi.string()
            .required()
            .messages({
                'string.empty': 'Name is required and cannot be empty.',
                'any.required': 'Name must be provided.',
            }),

        age: Joi.number()
            .required()
            .messages({
                'number.base': 'Age must be a number.',
                'any.required': 'Age is required and must be provided.',
            }),

        phone_number: Joi.string()
            .required()
            .messages({
                'string.empty': 'Phone number is required and cannot be empty.',
                'any.required': 'Phone number must be provided.',
            }),
        gender: Joi.string()
            .required()
            .messages({
                'string.empty': 'gender is required and cannot be empty.',
                'any.required': 'gender must be provided.',
            }),
        degree: Joi.string()
            .required()
            .messages({
                'string.empty': 'Degree is required and cannot be empty.',
                'any.required': 'Degree must be provided.',
            }),

        size: Joi.string()
            .required()
            .messages({
                'string.empty': 'Size is required and cannot be empty.',
                'any.required': 'Size must be provided.',
            })
    });


    const result = schema.validate(data);
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
module.exports = {
    addStudentValidator,
    editStudentValidator
}