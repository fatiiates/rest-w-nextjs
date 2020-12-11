import { ISuccessResponse, IErrorResponse } from "../Response";

export const createSuccessResponse = (): ISuccessResponse => {
    return {
        ok: true,
        result: {}
    };
};

export const createErrorResponse = (err_code = 0, description = ""): IErrorResponse => {
    return {
        ok: false,
        err_code: err_code,
        description: description
    };
};
