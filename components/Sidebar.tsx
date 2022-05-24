import { IoIosArrowDown } from 'react-icons/io';
import { IoMdAdd } from 'react-icons/io';
import SidebarChannel from './SidebarChannel';
import { useState } from 'react';
import { IoMdMic } from 'react-icons/io';
import { IoMdMicOff } from "react-icons/io";
import { BsHeadphones } from 'react-icons/bs';
import { IoMdSettings } from "react-icons/io";
import Modal from './Modal';

interface Channel {
  id: string,
  name: string,
}


function Sidebar() {
  const [textChannels, setTextChannel] = useState<Channel[]>([
    { id: "1", name: "general" },
    { id: "2", name: "test" },
  ]);
  const [voiceChannels, setVoiceChannel] = useState<Channel[]>([]);

  const [modal, setModal] = useState(false);
  const [mic, setMic] = useState(true);

  return (
    <div className="bg-gray-sidebar flex flex-col flex-[0.15]">
      <div className="flex justify-between items-center h-12 p-3 text-white font-medium border-b-[1px] border-neutral-800 border-solid shadow-sm">
        Test
        <IoIosArrowDown />
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between pr-3 text-gray-sidetext mt-4">
          <div className="flex items-center text-xs font-medium">
            <IoIosArrowDown className="mr-0.5" /> TEXT CHANNELS
          </div>
          <IoMdAdd
            onClick={() => setModal(true)}
            className="text-xl hover:text-white cursor-pointer"
          />
        </div>
        {textChannels.map((channel) => (
          <SidebarChannel key={channel.id} id={channel.id} type="text" />
        ))}
        <div className="flex items-center justify-between pr-3 text-gray-sidetext mt-5">
          <div className="flex items-center text-xs font-medium">
            <IoIosArrowDown className="mr-0.5" /> VOICE CHANNELS
          </div>
          <IoMdAdd className="text-xl" />
        </div>
        <SidebarChannel type="audio" id="3" />
      </div>

      <div className="flex items-center bg-gray-user h-14 px-2">
        <img
          src="https://external-preview.redd.it/4PE-nlL_PdMD5PrFNLnjurHQ1QKPnCvg368LTDnfM-M.png?auto=webp&s=ff4c3fbc1cce1a1856cff36b5d2a40a6d02cc1c3"
          alt="user profile"
          className="h-8 mr-2 rounded-full"
        />
        <div className="flex-1">
          <div className="text-sm leading-[18px] text-white font-semibold">
            SV
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

      {modal && <Modal setModal={setModal} />}
    </div>
  );
}

export default Sidebar;
