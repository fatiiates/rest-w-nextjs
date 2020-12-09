import { NextApiRequest, NextApiResponse } from 'next';
import { createErrorResponse } from '../../../assets/types/generators/Response';

const Controller = async (req: NextApiRequest, res: NextApiResponse) => {
    logout(req, res);
}

const logout = async (req, res) => {

    res.status(200).send({ exit: "success" });

}

export default async (req: NextApiRequest, res: NextApiResponse) => {

    try {
        await Controller(req, res);
    }
    catch (e) {
        const send = createErrorResponse();
        send.err_code = 500;
        send.description = e.message;
        return res.status(send.err_code).send(send);
    }
    
};
