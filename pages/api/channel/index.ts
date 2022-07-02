import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma";
import pusher from "../../../pusher";

type DataType = {
  name: string,
  type: string,
  serverId: string,
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const data = JSON.parse(req.body) as DataType;
      const channel = await prisma.channel.create({
        data: {
          name: data.name,
          type: data.type,
          server: {
            connect: {
              id: data.serverId
            }
          }
        }
      });
      await pusher.trigger(`presence-channel-${data.serverId}`, 'channel-update', {
        channel
      })
      res.status(200).json({ message: "submitted successfully" });
    } catch (error) {
      res.status(400).json({ error });
    }
  }
}
