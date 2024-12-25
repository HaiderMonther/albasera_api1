const Joi = require("joi");

const loginAdminValidator = (loginData) => {
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
                'any.required': 'Password is required and cannot be empty.',
            }),
    });

    const result = schema.validate(loginData);
    if (result.error) {
        return {
            valid: false,
            msg: `هنالك خطأ في اسم المستخدم او كلمة المرور`
        }
    }

    return {
        valid: true,
        msg: ``
    }

};


module.exports = {
    loginAdminValidator
}