import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma";
import pusher from "../../../pusher";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const messageId = req.query.id;

  if (req.method === "DELETE") {
    const message = await prisma.message.delete({
      where: {
        id: messageId as string,
      },
    });
    await pusher.trigger(`presence-channel-${message.channelId}`, 'chat-delete-message', {
      messageId: message.id
    })
    res.json(message);
  }
}
