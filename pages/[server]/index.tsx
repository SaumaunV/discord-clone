import { Channel } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Chat from "../../components/Chat";
import NavBar from "../../components/NavBar";
import Sidebar from "../../components/Sidebar";
import StateProvider, { initialState, reducer } from "../../context/StateProvider";
import prisma from "../../prisma";

interface Props {
  textChannels: Channel[];
  voiceChannels: Channel[];
}

const Server = ({ textChannels, voiceChannels }: Props) => {
  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/')
    },
  });
  
  if(status === 'loading'){
    <h1>Loading...</h1>
  }

  const refreshData = () => {
    router.replace(router.asPath);
  };

  if(status === 'authenticated'){
  return (
    <StateProvider reducer={reducer} initialState={initialState}>
      <div className="flex h-screen">
        <NavBar />
        <Sidebar
          textChannels={textChannels}
          voiceChannels={voiceChannels}
          refreshData={refreshData}
        />
        <Chat />
      </div>
    </StateProvider>
  );
 };
}

export async function getServerSideProps() {
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
  return {
    props: { textChannels, voiceChannels },
  };
}

export default Server;
