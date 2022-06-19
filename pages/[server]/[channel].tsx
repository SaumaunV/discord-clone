import { Channel, Message, Server, User } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Chat from "../../components/Chat";
import NavBar from "../../components/NavBar";
import Sidebar from "../../components/Sidebar";
import StateProvider, {
  initialState,
  reducer,
} from "../../context/StateProvider";
import prisma from "../../prisma";


interface Props {
  textChannels: (Channel & {
    messages: Message[];
  })[];
  voiceChannels: Channel[];
  user:
    | (User & {
        selectedchannels: Channel[];
        servers: (Server & {
          users: User[];
        })[];
      })
    | null;
}

const Channel = ({ textChannels, voiceChannels, user }: Props) => {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/");
    },
  });
  const router = useRouter();
  const channelids = textChannels.filter(channel => channel.serverId === router.query.server).map(channel => channel.id);
  const currentChannel = textChannels.find(channel => channel.id === router.query.channel);
  const serverMembers = user?.servers.find(server => server.id === router.query.server)?.users;
  const serverName = user?.servers.find(
    (server) => server.id === router.query.server
  )?.name;

  if (status === "loading") {
    <h1>Loading...</h1>;
  }

  if (!channelids?.includes(router.query.channel as string)) {
    return <h1 className="text-center font-bold">404</h1>;
  }

  const refreshData = () => {
    router.replace(router.asPath);
  };

  if (status === "authenticated") {
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
          <Chat channel={currentChannel!} messages={currentChannel!.messages} refreshData={refreshData} members={serverMembers!} />
        </div>
      </StateProvider>
    );
  }
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);
  const textChannels = prisma.channel.findMany({
    where: {
      type: "text",
    },
    include: {
      messages: true
    },
  });
  const voiceChannels = prisma.channel.findMany({
    where: {
      type: "voice",
    },
  });
  const user = prisma.user.findUnique({
    where: {
      id: session?.userId as string,
    },
    include: {
      servers: {
        include: {
          users: true
        }
      },
      selectedchannels: true
    },
  });
  const props = await Promise.all([textChannels, voiceChannels, user])
  props[0].forEach(channel => channel.messages = channel.messages.map(message => { return {...message, createdAt: JSON.parse(JSON.stringify(message.createdAt))}}))
  return {
    props: {
      textChannels: props[0],
      voiceChannels: props[1],
      user: props[2],
    },
  };
}

export default Channel;