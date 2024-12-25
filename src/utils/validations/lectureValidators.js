const Joi = require("joi");

const addLectureValidator = (data) => {
    const schema = Joi.object({
        week_order: Joi.number()
            .required()
            .messages({
                'number.base': 'week order number must be a number.',
                'any.required': 'week order must be provided.',
            }),

        youtube_url: Joi.string()
            .required()
            .messages({
                'string.empty': 'youtube url is required and cannot be empty.',
                'any.required': 'youtube url must be provided.',
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
    addLectureValidator
}
