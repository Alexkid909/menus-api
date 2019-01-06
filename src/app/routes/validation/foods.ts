const Joi = require("joi");

export default {
    // POST /api/foods
    createFood: {
        body : {
            name: Joi.string().required().trim(),
            measurement: Joi.string().required().trim(),
        }
    },

    // GET-PUT-DELETE /api/tasks/:taskId
    getOrDeleteFood: {
        params: {
            foodId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
        }
    },

    // PUT /api/foods/:id
    updateFood: {
        params: {
            foodId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
        },
        body: {
            name: Joi.string().required(),
            measurement: Joi.string().required(),
        }
    }
};