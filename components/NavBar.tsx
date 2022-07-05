import { Channel, Server } from "@prisma/client";
import { HiOutlinePlus } from "react-icons/hi";
import { BsFillPeopleFill } from "react-icons/bs";
import { useState } from "react";
import Modal from "./Modal";
import NavServer from "./NavServer";

interface Props {
  servers: Server[];
  channels: Channel[];
  refreshData: () => void;
}

function NavBar({ servers, channels, refreshData }: Props) {
  const [modal, setModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [contextMenuServer, setContextMenuServer] = useState("");

  const serverids = channels.map((channel) => channel.serverId);
  const channelids = channels.map((channel) => channel.id);

  return (
    <div className="w-[72px] bg-gray-navbar shadow">
      {servers.map((server) => (
        <NavServer
          server={server}
          serverids={serverids}
          channelids={channelids}
          refreshData={refreshData}
          contextMenuServer={contextMenuServer}
          setContextMenuServer={setContextMenuServer}
          key={server.id}
        />
      ))}

      <button
        className="navbar-icon group"
        onClick={() => {
          setModal(true);
          setModalType("createServer");
        }}
      >
        <HiOutlinePlus className="text-xl" />
        <span className="navbar-tooltip group-hover:block">Add Server</span>
      </button>

      <button
        className="navbar-icon group"
        onClick={() => {
          setModal(true);
          setModalType("joinServer");
        }}
      >
        <BsFillPeopleFill className="text-xl" />
        <span className="navbar-tooltip group-hover:block">Join Server</span>
      </button>
      {modal && (
        <Modal type={modalType} setModal={setModal} refreshData={refreshData} />
      )}
    </div>
  );
}

export default NavBar;
