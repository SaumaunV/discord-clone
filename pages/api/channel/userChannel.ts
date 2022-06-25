import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma";

type DataType = {
  userId: string;
  serverId: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    try {
      const data = JSON.parse(req.body) as DataType;
      const channels = await prisma.channel.findMany({
        where: {
            serverId: data.serverId
        }
      })
      await prisma.user.update({
        where: {
            id: data.userId
        },
        data: {
            selectedchannels: {
                connect: {
                    id: channels[0].id,
                }
            },
        },
      });
      res.status(200).json({ message: "submitted successfully" });
    } catch (error) {
      res.status(400).json({ error });
    }
  }
}
