import { Channel } from "@prisma/client";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import Chat from "../components/Chat";
import Sidebar from "../components/Sidebar";
import StateProvider, { initialState, reducer } from "../context/StateProvider";
import prisma from "../prisma";

interface Props {
  textChannels: Channel[];
  voiceChannels: Channel[];
}

const Home = ({ textChannels, voiceChannels }: Props) => {

  const router = useRouter();

  const refreshData = () => {
    router.replace(router.asPath);
  }

  return (
    <StateProvider reducer={reducer} initialState={initialState}>
      <div className="flex h-screen">
        <Sidebar textChannels={textChannels} voiceChannels={voiceChannels} refreshData={refreshData} />
        <Chat />
      </div>
    </StateProvider>
  );
};

export async function getServerSideProps() {
  const textChannels = await prisma.channel.findMany({
    where: {
      type: 'text'
    }
  });
  const voiceChannels = await prisma.channel.findMany({
    where: {
      type: 'voice'
    }
  });
  return {
    props: { textChannels, voiceChannels },
  };
}

export default Home;
