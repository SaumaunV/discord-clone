import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma";

type DataType = {
    serverId: string;
    userId: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  if (req.method === "DELETE") {
    try {
        const data = JSON.parse(req.body) as DataType;
        await prisma.user.update({
            where: {
            id: data.userId,
            },
            data: {
            servers: {
                disconnect: {
                id: data.serverId,
                },
            },
            },
        });
        res.status(200).json({ message: "submitted successfully" });
    } catch (error) {
        res.status(400).json({ error });
    }
    
  }
}
