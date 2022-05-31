import { FaHashtag } from "react-icons/fa";
import { IoMdAddCircle } from "react-icons/io";
import { useStateValue } from "../context/StateProvider";
import Message from "./Message";

function Chat() {
  const [{ channel }] = useStateValue();
  return (
    <div className="bg-gray-chat flex flex-col flex-[0.85]">
      <div className="flex items-center h-12 p-3 w-full text-white font-medium border-b-[1px] border-neutral-800 border-solid shadow-sm">
        <FaHashtag className="mr-2 text-gray-icons text-xl" /> {channel.name}
      </div>

      <div className="flex flex-col flex-1 justify-end">
          <Message />
      </div>

      <form className="flex m-4 mb-6 items-center bg-gray-message rounded-lg  px-4">
        <IoMdAddCircle className="text-2xl text-gray-icons" />
        <input
          type="text"
          placeholder="Message #general"
          className="w-full h-11 pl-4 rounded-lg bg-gray-message text-white select-none outline-none placeholder:text-gray-chat-text
          placeholder:text-opacity-50"
        />
      </form>
    </div>
  );
}

export default Chat;
