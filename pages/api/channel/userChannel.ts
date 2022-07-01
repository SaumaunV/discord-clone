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
      const channelIndex = channels.findIndex(channel => channel.type === 'text');
      await prisma.user.update({
        where: {
            id: data.userId
        },
        data: {
            selectedchannels: {
                connect: {
                    id: channels[channelIndex].id,
                }
            },
        },
      });
      res.status(200).json({ message: "submitted successfully" });
    } catch (error) {
      res.status(400).json({ error });
    }
  }

  if(req.method === 'DELETE') {
    try {
      const data = JSON.parse(req.body) as DataType;
      const user = await prisma.user.findUnique({
        where: {
          id: data.userId,
        },
        include: {
          selectedchannels: true
        }
      });
      const channelId = user?.selectedchannels.find(channel => channel.serverId === data.serverId)!.id;
      await prisma.user.update({
        where: {
          id: data.userId,
        },
        data: {
          selectedchannels: {
            disconnect: {
              id: channelId,
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
