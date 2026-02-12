const joi = require("joi");

const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),

});

const validateLogin = (req, res, next) => {
    const { error } = loginSchema.validate(req.body);


    if (error) {
        return res.status(400).json({
            error: error.details[0].message,
        });
    }

    next()
};


module.exports = { validateLogin }