const Joi = require("joi");

const addGuideValidator = (data) => {
    const schema = Joi.object({
        title: Joi.string()
            .required()
            .messages({
                'string.empty': 'title is required and cannot be empty.',
                'any.required': 'title must be provided.',
            }),

        youtube_url: Joi.string()
            .required()
            .messages({
                'string.empty': 'youtube url is required and cannot be empty.',
                'any.required': 'youtube url must be provided.',
            }),

        description: Joi.string()
            .required()
            .messages({
                'string.empty': 'description is required and cannot be empty.',
                'any.required': 'description must be provided.',
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
    addGuideValidator
}
