import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma";
import pusher from "../../../pusher";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  
const channelId = req.query.id;

  if (req.method === "DELETE") {
      const channel = await prisma.channel.delete({
          where: {
              id: channelId as string
          }
      });
      await pusher.trigger(
        `presence-channel-${channel.serverId}`, "delete-channel", {
          channelId
        }
      );
      res.json(channel)
  }
}
