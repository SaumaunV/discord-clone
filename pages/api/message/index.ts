import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma";

type DataType = {
  userId: string;
  message: string;
  channel: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const data = JSON.parse(req.body) as DataType;
      const message = await prisma.message.create({
        data: {
          message: data.message,
          channel: {
              connect: {
                  id: data.channel
              }
          },
          user: {
            connect: {
              id: data.userId
            }
          }
        },
        include: {
          user: true,
        }
      });
      res.status(200).json({ message: message });
    } catch (error) {
      res.status(400).json({ error });
    }
  }
}
