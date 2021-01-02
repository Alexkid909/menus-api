import { ApiReqHeadersSchema } from "../classes/request/apiReqHeadersSchema";
import { ApiReqWithPayloadHeadersSchema } from "../classes/request/apiReqWithPayloadHeadersSchema";

const Joi = require("joi");


const schema = (tenantSpecific: boolean, hasPayload: boolean) => {
    return Joi.object().keys({
        headers: Joi.object().keys(hasPayload ?
            new ApiReqHeadersSchema(tenantSpecific) :
            new ApiReqWithPayloadHeadersSchema(tenantSpecific))
            .unknown(true),
    }).unknown(true)
};

export { schema as validation };
