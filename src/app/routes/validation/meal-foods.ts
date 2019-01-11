const Joi = require("joi");

export default {
    // POST /api/mealFoods
    createMealFoods: {
        body : {
            name: Joi.string().required().trim(),
            measurement: Joi.string().required().trim(),
        }
    },

    // GET-PUT-DELETE /api/tasks/:taskId
    getMealFoods: {
        params: {
            mealId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
        }
    },

    // GET-PUT-DELETE /api/tasks/:taskId
    deleteMealFoods: {
        params: {
            mealFoodId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
        }
    },


    // PUT /api/mealFoods/:id
    updateMealFoods: {
        params: {
            mealFoodId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
        },
        body: {
            name: Joi.string().required(),
            measurement: Joi.string().required(),
        }
    }
};