import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface Props {
  id: string;
  user: User;
  name: string;
  image: string;
  message: string;
  time: string;
  contextMenuMessage: string;
  setContextMenuMessage: Dispatch<SetStateAction<string>>;
  setDeletedMessage: Dispatch<SetStateAction<string>>;
}

function ChatMessage({ id, user, name, image, message, time, contextMenuMessage, setContextMenuMessage, setDeletedMessage }: Props) {
  const {data: session} = useSession();
  const currentDate = new Date();
  const messageDate = new Date(time);
  const [contextMenu, setContextMenu] = useState(false);
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleClick = () => setContextMenu(false);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  const deleteMessage = async () => {
    try {
      await fetch(`/api/message/${id}`, {
        method: "DELETE",
      });
      setDeletedMessage(id);
    } catch (error) {}
    
  }

  return (
    <div
      onContextMenu={(e) => {
        e.preventDefault();
        if(session?.userId === user.id){
          setContextMenu(true);
          setContextMenuMessage(id);
          setCoordinates({ x: e.pageX, y: e.pageY });
       }
      }}
      className="flex h-12 px-4 items-center mb-1 mt-4 group hover:bg-gray-user hover:bg-opacity-30"
    >
      <img src={image} alt="user profile" className="h-10 mr-2 rounded-full" />
      <div className="ml-2 mb-1.5 flex-1">
        <div className="">
          <span className="text-white font-medium leading-[22px]">{name}</span>
          <span className="text-xs ml-2 leading-[22px] text-gray-chat-text font-medium">
            {currentDate.getDate() === messageDate.getDate()
              ? `Today at ${messageDate.toLocaleString("en-US", {
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                })}`
              : currentDate.getDate() === messageDate.getDate() + 1
              ? `Yesterday at ${messageDate.toLocaleString("en-US", {
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                })}`
              : `${
                  messageDate.getMonth() + 1
                }/${messageDate.getDate()}/${messageDate.getFullYear()}`}
          </span>
        </div>
        <div className="leading-[22px] text-gray-text">{message}</div>
      </div>
      {contextMenu && contextMenuMessage === id && (
        <div
          className={`bg-black text-red-500 text-sm absolute w-36 h-9 p-1 text-center align-middle center font-normal rounded z-10`}
          style={{ top: coordinates.y, left: coordinates.x }}
        >
          <li
            onClick={deleteMessage}
            className="flex list-none hover:text-white justify-center items-center hover:bg-red-500 hover:rounded-sm w-full h-full"
          >
            <a onClick={(e) => e.preventDefault()} href="">
              Delete Message
            </a>
          </li>
        </div>
      )}
    </div>
  );
}

export default ChatMessage;