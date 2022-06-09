import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma";

type DataType = {
    name: string,
    userId: string,
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  if (req.method === "POST") {
    try {
      const data = JSON.parse(req.body) as DataType;
      await prisma.server.create({
        data: {
          name: data.name,
          users: {
              connect: {
                  id: data.userId
              }
          },
          channels: {
            create: [
              { name: "general", type: "text" },
              { name: "General", type: "voice" },
            ],
          },
        },
      });
      res.status(200).json({ message: "submitted successfully" });
    } catch (error) {
      res.status(400).json({ error });
    }
  }
}
