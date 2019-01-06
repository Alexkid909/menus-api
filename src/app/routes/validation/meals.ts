const Joi = require("joi");

export default {
    // POST /api/meals
    createMeal: {
        body : {
            name: Joi.string().required().trim(),
            measurement: Joi.string().required().trim(),
        }
    },

    // GET-PUT-DELETE /api/tasks/:taskId
    getOrDeleteMeal: {
        params: {
            mealId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
        }
    },

    // PUT /api/meals/:id
    updateMeal: {
        params: {
            mealId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
        },
        body: {
            name: Joi.string().required(),
            measurement: Joi.string().required(),
        }
    }
};