import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma";

type DataType = {
  userId: string;
  prevChannel: string;
  selectedChannel: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    try {
      const data = JSON.parse(req.body) as DataType;
      await prisma.user.update({
        where: {
          id: data.userId,
        },
        data: {
          selectedchannels: {
            disconnect: {
              id: data.prevChannel,
            },
            connect: {
              id: data.selectedChannel,
            },
          },
        },
      });
      res.status(200).json({ message: "updated successfully"});
    } catch (error) {
      res.status(400).json({ error });
    }
  }
}
