interface IJWTPayload {
    readonly id: number;
    readonly directory_id: string;
    readonly user_fullname: string;
    readonly iat?: number;
    readonly exp?: number;
};

export default IJWTPayload; 