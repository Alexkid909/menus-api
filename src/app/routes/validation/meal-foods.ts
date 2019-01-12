const Joi = require("joi");

export default {
    // POST /api/mealFoods
    createMealFoods: {
        params: {
          mealId: Joi.string().required().trim()
        },
        body : {
            foodId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
            qty: Joi.number().required().min(1)
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
        body : {
            foodId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
            mealId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
            qty: Joi.number().required().min(1)
        }
    }
};