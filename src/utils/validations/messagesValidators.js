const Joi = require("joi");


const addMessageValidator = (data) => {
    const schema = Joi.object({
        sender: Joi.string()
            .required()
            .messages({
                'string.empty': 'sender is required and cannot be empty.',
                'any.required': 'sender must be provided.',
            }),

        body: Joi.string()
            .required()
            .messages({
                'string.empty': 'body is required and cannot be empty.',
                'any.required': 'body must be provided.',
            }),

        title: Joi.string()
            .required()
            .messages({
                'string.empty': 'title is required and cannot be empty.',
                'any.required': 'title must be provided.',
            }),

        governorate_id: Joi.string()
            .required()
            .messages({
                'string.empty': 'governorate id is required and cannot be empty.',
                'any.required': 'governorate id must be provided.',
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


module.exports = {
    addMessageValidator
}
