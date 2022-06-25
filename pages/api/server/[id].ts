import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const serverId = req.query.id;

  if (req.method === "DELETE") {
    const server = await prisma.server.delete({
      where: {
        id: serverId as string,
      },
    });
    res.json(server);
  }
}
