import { Server } from "@prisma/client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface Props {
  server: Server;
  serverids: string[];
  channelids: string[];
  refreshData: () => void;
  contextMenuServer: string;
  setContextMenuServer: Dispatch<SetStateAction<string>>;
}

type removeDataType = {
  serverId: string;
  userId: string;
}

function NavServer({ server, serverids, channelids, refreshData, contextMenuServer, setContextMenuServer }: Props) {
  const {data: session} = useSession();
  const [contextMenu, setContextMenu] = useState(false);
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const router = useRouter();
  const index = serverids.findIndex((element) => element === server.id);

  useEffect(() => {
    const handleClick = () =>  setContextMenu(false);
    window.addEventListener("click", handleClick);

    return () => window.removeEventListener("click", handleClick);
  }, []);

  const removeServer = async (data: removeDataType) => {
    if(session?.userId === server.ownerId) {
      try {
        await fetch(`/api/server/${server.id}`, {
          method: "DELETE",
        });
        if(router.query.server === server.id) {
          router.push('/@me');
        }
        else {
          refreshData();
        }
        
      } catch (error) {}
    }
    else {
      try {
        //router.push('/@me');
        await fetch("/api/server/leave", {
          body: JSON.stringify(data),
          method: "DELETE",
        });
        const resp = await fetch('/api/channel/userChannel', {
          body: JSON.stringify(data),
          method: 'DELETE'
        });
        const respdata =  await resp.json();
        console.log(respdata);
        if (router.query.server === server.id) {
          router.push('/@me');
        } else {
          refreshData();
        }       
      } catch (error) {}
      
    }
  }

  return (
    <Link
      href={`/[server]/[channel]`}
      as={`/${server.id}/${channelids[index]}`}
      key={server.id}
    >
      <button
        onContextMenu={(e) => {
          e.preventDefault();
          setContextMenu(true);
          setContextMenuServer(server.id);
          setCoordinates({ x: e.pageX, y: e.pageY });
        }}
        //onClick={() => dispatch({ type: "CHANGE_SERVER", id: s.id })}
        className={`navbar-server group ${
          router.query.server === server.id
            ? "bg-blue-button rounded-2xl"
            : "bg-gray-chat hover:bg-blue-button rounded-3xl hover:rounded-2xl transition-all"
        }`}
      >
        {server.name.substring(0, 1).toUpperCase()}
        <span className="navbar-tooltip group-hover:block">{server.name}</span>
        {contextMenu && contextMenuServer === server.id && (
          <div
            className={`bg-black text-red-500 text-sm absolute w-36 h-9 p-1 text-center align-middle center font-normal rounded z-10`}
            style={{ top: coordinates.y, left: coordinates.x }}
          >
            <li
              onClick={() => removeServer({serverId: server.id, userId: session?.userId as string})}
              className="flex list-none hover:text-white justify-center items-center hover:bg-red-500 hover:rounded-sm w-full h-full"
            >
              <a onClick={(e) => e.preventDefault()} href="">
                {session?.userId === server.ownerId ? 'Delete Server': 'Leave Server'}
              </a>
            </li>
          </div>
        )}
      </button>
    </Link>
  );
}

export default NavServer;
