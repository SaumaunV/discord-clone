import { Dispatch, MouseEvent, SetStateAction, useRef, useState } from "react";
import { FaHashtag } from "react-icons/fa";
import { IoMdVolumeHigh } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";

interface Props {
  type: string;
  setModal: Dispatch<SetStateAction<boolean>>;
  refreshData: () => void
}

interface ChannelType {
  name: string;
  type: string;
}

function Modal({ type, setModal, refreshData }: Props) {
  const background = useRef(null);
  const [channelName, setChannelName] = useState("");

  const closeModal = (e: MouseEvent<HTMLDivElement>) => {
    if (background.current === e.target) {
      setModal(false);
    }
  };

  const createChannel = async (data: ChannelType) => {
    console.log("yo")
    console.log(JSON.stringify(data));
    await fetch("/api/channel", {
      body: JSON.stringify(data),
      method: 'POST',
    });
    refreshData();
  }

  const createButtonHandler = () => {
    createChannel({name: channelName, type});
    setModal(false);
  }

  return (
    <div
      ref={background}
      onClick={closeModal}
      className="w-full h-full bg-black/80 fixed flex items-center justify-center"
    >
      <div className="bg-gray-modalbg h-auto w-3/12 rounded-xl">
        <div className="flex items-center justify-between pl-4 pr-2">
          <h1 className="text-white mb-3 font-medium text-xl pt-4">
            Create Channel
          </h1>
          <IoCloseSharp
            onClick={() => setModal(false)}
            className="text-gray-500 text-3xl pt-1 hover:text-white cursor-pointer transition"
          />
        </div>

        <div className="px-4">
          <h5 className="uppercase text-xs font-medium text-gray-text mb-2">
            Channel Name
          </h5>
          <div className="bg-modal-input-bg h-10 rounded-[3px] flex items-center p-2 text-gray-text">
            {type === 'text' ? <FaHashtag /> : <IoMdVolumeHigh className="text-xl"/>}
            <input
              type="text"
              placeholder="new-channel"
              onChange={(e) => setChannelName(e.target.value)}
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
            className="bg-blue-create-button px-4 py-2 rounded-[3px] font-medium disabled:cursor-not-allowed
          disabled:opacity-50 disabled:bg-blue-create-button hover:bg-blue-create-button-hover transition"
            disabled={channelName ? false : true}
            onClick={createButtonHandler}
          >
            Create Channel
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
