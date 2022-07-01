import { NextApiRequest, NextApiResponse } from "next";
import pusher from "../../../pusher";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { socket_id, channel_name, username, userId } = req.body;

    const presenceData = {
        user_id: userId,
        user_name: username
    }

    try {
        const auth = pusher.authenticate(socket_id, channel_name, presenceData);
        res.send(auth);
    } catch (error) {
        console.log(error);
    }
}