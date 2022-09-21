import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma";

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
    res.json(message);
  }
}
