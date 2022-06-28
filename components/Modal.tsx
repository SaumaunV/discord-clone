import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Dispatch, MouseEvent, SetStateAction, useRef, useState } from "react";
import { FaHashtag } from "react-icons/fa";
import { IoMdVolumeHigh } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";

interface Props {
  type: string;
  setModal: Dispatch<SetStateAction<boolean>>;
  refreshData: () => void
}

interface JoinServerType {
  serverId: string,
  userId: string,
}

interface ServerType {
  name: string,
  userId: string,
  //channels: Channel[];
}

interface ChannelType {
  name: string;
  type: string;
  serverId: string
}

function Modal({ type, setModal, refreshData }: Props) {
  //const [{ server }] = useStateValue();
  const { data: session } = useSession();
  const background = useRef(null);
  const [value, setValue] = useState("");
  const router = useRouter();
  //const [serverName, setServerName] = useState("");

  const closeModal = (e: MouseEvent<HTMLDivElement>) => {
    if (background.current === e.target) {
      setModal(false);
    }
  };

  const joinServer = async (data: JoinServerType) => {
    const resp = await fetch('/api/server', {
      body: JSON.stringify(data),
      method: 'PUT',
    });
    const respData = await resp.json();
    if(resp.status === 200){
      await fetch('/api/channel/userChannel', {
        body: JSON.stringify(data),
        method: 'PUT',
      })
    }
    console.log(respData);
    refreshData();
  }

  const createServer = async (data: ServerType) => {
    const resp = await fetch('/api/server', {
      body: JSON.stringify(data),
      method: 'POST',
    });
    const respData = await resp.json();
    if(resp.status === 200) {
      await fetch('/api/channel/userChannel', {
        body: JSON.stringify({...data, serverId: respData.serverId}),
        method: 'PUT',
      })
    }
    refreshData();
  }

  const createChannel = async (data: ChannelType) => {
    //console.log(JSON.stringify(data));
    await fetch("/api/channel", {
      body: JSON.stringify(data),
      method: 'POST',
    });
    refreshData();
  }

  const createButtonHandler = () => {
    if(type === 'joinServer'){
      joinServer({serverId: value, userId: session?.userId as string})
    }
    else if(type === 'createServer'){
      createServer({name: value, userId: session?.userId as string});
    }
    else {
      createChannel({ name: value, type, serverId: router.query.server as string});
    }
    
    setModal(false);
  }

  return (
    <div
      ref={background}
      onClick={closeModal}
      className="w-full h-full bg-black/80 fixed top-0 left-0 flex items-center justify-center"
    >
      <div className="bg-gray-modalbg h-auto w-3/12 rounded-xl">
        <div className="flex items-center justify-between pl-4 pr-2">
          <h1 className="text-white mb-3 font-medium text-xl pt-4">
            {type === 'createServer' ? 'Create Server': type === 'joinServer' ? 'Join Server' : 'Create Channel'}
          </h1>
          <IoCloseSharp
            onClick={() => setModal(false)}
            className="text-gray-500 text-3xl pt-1 hover:text-white cursor-pointer transition"
          />
        </div>

        <div className="px-4">
          <h5 className="uppercase text-xs font-medium text-gray-text mb-2">
            {type === 'createServer' ? 'Server Name': type === 'joinServer' ? 'Server ID' : 'Channel Name'}
          </h5>
          <div className="bg-modal-input-bg h-10 rounded-[3px] flex items-center p-2 text-gray-text">
            {type === 'text' ? <FaHashtag /> : type === 'voice' ? <IoMdVolumeHigh className="text-xl"/> : ''}
            <input
              type="text"
              placeholder={type === 'createServer' ? 'new-server': type === 'joinServer' ? 'server-id' : "new-channel"}
              onChange={(e) => setValue(e.target.value)}
              className="bg-modal-input-bg rounded-[3px] w-full h-full outline-none ml-2 placeholder:opacity-70"
            />
          </div>
        </div>

        <div className="flex items-center justify-end h-16 mt-2 bg-modal-bg-buttons p-4 rounded-b-xl text-sm text-white">
          <button
            onClick={() => setModal(false)}
            className="mr-4 hover:underline p-3 font-medium"
          >
            Cancel
          </button>
          <button
            className="bg-blue-button px-4 py-2 rounded-[3px] font-medium disabled:cursor-not-allowed
          disabled:opacity-50 disabled:bg-blue-button hover:bg-blue-button-hover transition"
            disabled={value ? false : true}
            onClick={createButtonHandler}
          >
            {type === 'createServer' ? 'Create Server': type === 'joinServer' ? 'Join Server' : 'Create Channel'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
