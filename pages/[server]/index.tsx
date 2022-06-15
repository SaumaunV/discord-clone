import { Channel, Server, User } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import NavBar from "../../components/NavBar";
import Sidebar from "../../components/Sidebar";
import StateProvider, { initialState, reducer } from "../../context/StateProvider";
import prisma from "../../prisma";

interface Props {
  textChannels: Channel[];
  voiceChannels: Channel[];
  user:
    | (User & {
        servers: Server[];
        selectedchannels: Channel[]
      })
    | null;
}

const Server = ({ textChannels, voiceChannels, user }: Props) => {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/");
    },
  });
  const router = useRouter();
  const serverids = user?.servers.map(server => server.id);
  const serverName = user?.servers.find(server => server.id === router.query.server)?.name
  
  
  if(status === 'loading'){
    <h1>Loading...</h1>
  }

  if(!serverids?.includes(router.query.server as string)){
    return <h1 className="text-center font-bold">404</h1>
  }

  const refreshData = () => {
    router.replace(router.asPath);
  };

  if(status === 'authenticated'){
  return (
    <StateProvider reducer={reducer} initialState={initialState}>
      <div className="flex h-screen">
        <NavBar servers={user!.servers} channels={user!.selectedchannels} refreshData={refreshData} />
        <Sidebar
          serverName={serverName!}
          textChannels={textChannels.filter(
            (channel) => channel.serverId === router.query.server
          )}
          voiceChannels={voiceChannels.filter(
            (channel) => channel.serverId === router.query.server
          )}
          refreshData={refreshData}
        />
        <div className="flex-1 bg-gray-chat"></div>
      </div>
    </StateProvider>
  );
 };
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);
  const textChannels = await prisma.channel.findMany({
    where: {
      type: "text",
    },
  });
  const voiceChannels = await prisma.channel.findMany({
    where: {
      type: "voice",
    },
  });
  const user = await prisma.user.findUnique({
    where: {
      id: session?.userId as string
    },
    include: {
      servers: true,
      selectedchannels: true
    }
  });
  return {
    props: { textChannels, voiceChannels, user},
  };
}

export default Server;
