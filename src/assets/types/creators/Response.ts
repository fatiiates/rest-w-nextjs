import { ISuccessResponse, IErrorResponse } from "@assets/types/Response";

export const createSuccessResponse = (result: object = {}): ISuccessResponse => {
    return {
        ok: true,
        result: result
    };
};

export const createErrorResponse = (err_code: number = 0, description: string = ""): IErrorResponse => {
    return {
        ok: false,
        err_code: err_code,
        description: description
    };
};
