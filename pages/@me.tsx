import { Channel, Server, User } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import NavBar from "../components/NavBar";
import StateProvider, {
  initialState,
  reducer,
} from "../context/StateProvider";
import prisma from "../prisma";

interface Props {
  user:
    | (User & {
        servers: Server[];
        selectedchannels: Channel[];
      })
    | null;
}

const User = ({ user }: Props) => {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/");
    },
  });
  const router = useRouter();

  if (status === "loading") {
    <h1>Loading...</h1>;
  }

  const refreshData = () => {
    router.replace(router.asPath);
  };

  if (status === "authenticated") {
    return (
      <StateProvider reducer={reducer} initialState={initialState}>
        <div className="flex h-screen">
          <NavBar
            servers={user!.servers}
            channels={user!.selectedchannels}
            refreshData={refreshData}
          />
          <div className=" flex flex-1 justify-center items-center bg-gray-chat text-gray-sidetext font-medium text-xl">
            {user?.servers.length === 0 && `You are not part of any servers. To add a server, use the first
             button on the left. To join a server, use the second button on the left.`}
          </div>
        </div>
      </StateProvider>
    );
  }
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);
  const user = await prisma.user.findUnique({
    where: {
      id: session?.userId as string,
    },
    include: {
      servers: true,
      selectedchannels: true,
    },
  });
  return {
    props: { user },
  };
}

export default User;
