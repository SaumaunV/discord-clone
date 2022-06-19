import { connect } from "http2";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma";

type DataType = {
  user: string;
  image: string;
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
      await prisma.message.create({
        data: {
          user: data.user,
          image: data.image,
          message: data.message,
          channel: {
              connect: {
                  id: data.channel
              }
          }
        },
      });
      res.status(200).json({ message: "submitted successfully" });
    } catch (error) {
      res.status(400).json({ error });
    }
  }
}
