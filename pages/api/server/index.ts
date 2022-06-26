import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma";

type CreateServerData = {
    name: string,
    userId: string,
}

type JoinServerData = {
  serverId: string,
  userId: string,
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  if (req.method === "POST") {
    try {
      const data = JSON.parse(req.body) as CreateServerData;
      const newServer = await prisma.server.create({
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
          owner: {
            connect: {
              id: data.userId
            }
          }
        },
      });
      res.status(200).json({ message: "submitted successfully", serverId: newServer.id });
    } catch (error) {
      res.status(400).json({ error });
    }
  }

  if(req.method === 'PUT') {
    try {
      const data = JSON.parse(req.body) as JoinServerData;
      const servers = await prisma.server.findMany();
      const server = servers.find(server => server.id === data.serverId);
      if(server) {
        await prisma.server.update({
          where: {
            id: data.serverId,
          },
          data: {
            users: {
              connect: {
                id: data.userId,
              },
            },
          },
        });
      } else {
        res.status(400).json({message: "could not find server"});
      }       
      res.status(200).json({ message: "submitted successfully" });
    } catch (error) {
      res.status(400).json({ error });
    }
  }
}
