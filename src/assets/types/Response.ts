interface IResponse {
    readonly ok: boolean;
};

export interface ISuccessResponse extends IResponse {
    result: any;
};

export interface IErrorResponse extends IResponse {
    err_code: number;
    description: string;
};

type TResponse = ISuccessResponse | IErrorResponse;

export default TResponse;