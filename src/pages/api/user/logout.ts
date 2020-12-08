import { NextApiRequest, NextApiResponse } from 'next';

const Controller = async (req: NextApiRequest, res: NextApiResponse) => {
    logout(req, res);
}

const logout = async (req, res) => {

    res.status(200).send({ exit: "success" });

}

export default Controller;