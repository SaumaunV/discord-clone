import { IoIosArrowDown } from 'react-icons/io';
import { IoMdAdd } from 'react-icons/io';
import SidebarChannel from './SidebarChannel';
import { useState } from 'react';
import { IoMdMic } from 'react-icons/io';
import { IoMdMicOff } from "react-icons/io";
import { BsHeadphones } from 'react-icons/bs';
import { IoMdSettings } from "react-icons/io";
import Modal from './Modal';
import { Channel } from '@prisma/client';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface Props {
  serverName: string
  textChannels: Channel[];
  voiceChannels: Channel[];
  refreshData: () => void
}
//https://external-preview.redd.it/4PE-nlL_PdMD5PrFNLnjurHQ1QKPnCvg368LTDnfM-M.png?auto=webp&s=ff4c3fbc1cce1a1856cff36b5d2a40a6d02cc1c3

function Sidebar({ serverName, textChannels, voiceChannels, refreshData }: Props) {

  const [modal, setModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [mic, setMic] = useState(true);
  const {data: session} = useSession();


  return (
    <div className="bg-gray-sidebar flex flex-col w-60">
      <div className="flex justify-between items-center h-12 p-3 text-white font-medium border-b-[1px] border-neutral-800 border-solid shadow-sm">
        {serverName}
        <IoIosArrowDown />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between pr-3 text-gray-sidetext mt-4">
          <div className="flex items-center text-xs font-medium">
            <IoIosArrowDown className="mx-0.5" /> TEXT CHANNELS
          </div>
          <IoMdAdd
            onClick={() => {
              setModal(true);
              setModalType("text");
            }}
            className="text-xl hover:text-white cursor-pointer"
          />
        </div>
        {textChannels.map((channel) => (
          <Link
            href={`/[server]/[channel]`}
            as={`/${channel.serverId}/${channel.id}`}
            key={channel.id}
          >
            <a>
              <SidebarChannel
                id={channel.id}
                name={channel.name}
                refreshData={refreshData}
                type={channel.type}
                removable={textChannels.length === 1 ? false : true}
              />
            </a>
          </Link>
        ))}
        <div className="flex items-center justify-between pr-3 text-gray-sidetext mt-5">
          <div className="flex items-center text-xs font-medium">
            <IoIosArrowDown className="mx-0.5" /> VOICE CHANNELS
          </div>
          <IoMdAdd
            onClick={() => {
              setModal(true);
              setModalType("voice");
            }}
            className="text-xl hover:text-white cursor-pointer"
          />
        </div>
        {voiceChannels.map((channel) => (
          <SidebarChannel
            key={channel.id}
            id={channel.id}
            name={channel.name}
            refreshData={refreshData}
            type={channel.type}
            removable={voiceChannels.length === 1 ? false : true}
          />
        ))}
      </div>

      <div className="flex items-center bg-gray-user h-14 px-2">
        <img
          src={session?.user?.image!}
          alt="user profile"
          className="h-8 mr-2 rounded-full"
        />
        <div className="flex-1">
          <div className="text-sm leading-[18px] text-white font-semibold">
            {session?.user?.name}
          </div>
          <div className="text-xs leading-[13px] text-gray-sidetext">#8039</div>
        </div>
        <div className="flex">
          <div
            onClick={() => setMic(!mic)}
            className="flex items-center justify-center h-8 w-8 hover:bg-bg-user-icons rounded cursor-pointer group"
          >
            {mic ? (
              <IoMdMic className="text-xl text-gray-icons group-hover:text-gray-text" />
            ) : (
              <IoMdMicOff className="text-xl text-gray-icons group-hover:text-gray-text" />
            )}
          </div>
          <div className="flex items-center justify-center h-8 w-8 hover:bg-bg-user-icons rounded cursor-pointer group">
            <BsHeadphones className="text-2xl text-gray-icons group-hover:text-gray-text" />
          </div>
          <div className="flex items-center justify-center h-8 w-8 hover:bg-bg-user-icons rounded cursor-pointer group">
            <IoMdSettings className="text-xl text-gray-icons group-hover:text-gray-text" />
          </div>
        </div>
      </div>
      {modal && (
        <Modal type={modalType} setModal={setModal} refreshData={refreshData} />
      )}
    </div>
  );
}

export default Sidebar;
