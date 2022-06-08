import { Server } from '@prisma/client'
import Link from 'next/link'
import { HiOutlinePlus } from 'react-icons/hi'
import { BsFillPeopleFill } from 'react-icons/bs'
import NavServer from './NavServer'
import { useStateValue } from '../context/StateProvider'
import { useState } from 'react'
import Modal from './Modal'

interface Props {
  servers: Server[],
  refreshData: () => void
}

function NavBar({ servers, refreshData }: Props) {
  const [{ server }, dispatch] = useStateValue();
  const [modal, setModal] = useState(false);
  const [modalType, setModalType] = useState("");

  return (
    <div className="w-[72px] bg-gray-navbar shadow">
      {/* {servers.map((server) => (
        //<Link href={`/[server]`} as={`/${server.id}`} key={server.id}>
        <NavServer id={server.id} key={server.id}>
          {server.name.substring(0, 1).toUpperCase()}
        </NavServer>
        //</Link>
      ))} */}
      {servers.map((s) => (
        <Link href={`/[server]`} as={`/${s.id}`} key={s.id}>
          <button
            onClick={() => dispatch({ type: "CHANGE_SERVER", id: s.id })}
            className={`navbar-server ${
              server === s.id
                ? "bg-blue-button rounded-2xl"
                : "bg-gray-chat hover:bg-blue-button rounded-3xl hover:rounded-2xl transition-all"
            }`}
          >
            {s.name.substring(0, 1).toUpperCase()}
          </button>
        </Link>
      ))}
      <button
        className="navbar-icon"
        onClick={() => {
          setModal(true);
          setModalType("createServer");
        }}
      >
        <HiOutlinePlus className="text-xl" />
      </button>
      <button
        className="navbar-icon"
        onClick={() => {
          setModal(true);
          setModalType("joinServer");
        }}
      >
        <BsFillPeopleFill className="text-xl" />
      </button>
      {modal && (
        <Modal type={modalType} setModal={setModal} refreshData={refreshData} />
      )}
    </div>
  );
}

export default NavBar