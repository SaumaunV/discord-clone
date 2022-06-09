import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // if (req.method === "GET") {
  //   try {
  //     //const data = JSON.parse(req.body);
  //     const channels = await prisma.channel.findMany();
  //     res.status(200).json({ channels });
  //   } catch (error) {
  //     res.status(400).json({ error });
  //   }
  // }

  if (req.method === "POST") {
    try {
      const data = JSON.parse(req.body);
      await prisma.channel.create({
        data,
      });
      res.status(200).json({ message: "submitted successfully" });
    } catch (error) {
      res.status(400).json({ error });
    }
  }
}
