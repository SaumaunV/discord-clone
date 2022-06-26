import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma";

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
      await prisma.channel.create({
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
      res.status(200).json({ message: "submitted successfully" });
    } catch (error) {
      res.status(400).json({ error });
    }
  }
}
