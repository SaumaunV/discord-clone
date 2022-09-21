import { Channel, Message, User } from "@prisma/client";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Dispatch, FormEvent, SetStateAction, useEffect, useState } from "react";
import { FaHashtag } from "react-icons/fa";
import { IoMdAddCircle, IoIosPeople } from "react-icons/io";
import { GiHamburgerMenu } from 'react-icons/gi';
import ChatMessage from "./ChatMessage";
import ServerMembers from "./ServerMembers";
import Pusher from 'pusher-js';
import io from 'socket.io-client';

const socket = io("https://discord-node-backend.onrender.com");

interface Props {
  channel: Channel;
  messages: (Message & {
    user: User;
  })[];
  members: User[];
  refreshData: () => void;
  setMenu: Dispatch<SetStateAction<boolean>>;
}

type DataType = {
  message: Message & {
    user: User;
  };
};

function Chat({ channel, messages, members, setMenu }: Props) {
  const {data: session} = useSession();
  const [message, setMessage] = useState("");
  const [deletedMessage, setDeletedMessage] = useState("");
  const [serverMembers, setMembers] = useState(false);
  const [contextMenuMessage, setContextMenuMessage] = useState("");
  let reversed = false;
  const router = useRouter();
  const [messageArray, setMessageArray] = useState<
    (Message & {
      user: User;
    })[]
  >([]);

  const pusher = new Pusher(process.env.NEXT_PUBLIC_key!, {
    cluster: "us2",
    authEndpoint: "/api/pusher",
    auth: { params: {userId: session?.userId ,username: session?.user?.name} },
  });

  function toggleServerMembers(){
    setMembers((prevState) => !prevState);
  }

  async function sendMessage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const respMessage = await fetch('/api/message', {
      body: JSON.stringify({userId: session?.userId, message, channel: router.query.channel}),
      method: 'POST'
    })
    const sentMessage: DataType = await respMessage.json();
    //console.log(respMessage);
    //console.log(sentMessage);
    socket.emit("send_message", {message: sentMessage, channel: router.query.channel});
    setMessageArray((prevState) => [sentMessage.message, ...prevState]);
    setMessage("");
  }

  useEffect(() => {
    if(deletedMessage !== ""){
      console.log("yo yo")
      socket.emit("send_deleted_message", {messageId: deletedMessage, channel: router.query.channel});
      setMessageArray((prevState) => prevState.filter((message) => message.id !== deletedMessage));
    }
  }, [deletedMessage])

  useEffect(() => {
    console.log("socket changed")
    socket.on("receive_message", (data: DataType) => {
      console.log(data);
      setMessageArray(prevState => [data.message, ...prevState]);
    });
    socket.on("delete_message", (data: string) => {
      setMessageArray((prevState) => prevState.filter((message) => message.id !== data));
    });
  }, [socket]);

  useEffect(() => {
    if (!reversed) {
      const messagesReversed = messages.reverse();
      reversed = true;
      setMessageArray(messagesReversed);
    }

    socket.emit("join-channel", router.query.channel)
    
    // pusher.unsubscribe(`presence-channel-${router.query.channel}`);
    // let channel = pusher.subscribe(`presence-channel-${router.query.channel}`);
    // channel.bind('pusher:subscription_error', (status: any) => {
    //   if(status == 408 || status == 503) {
    //     channel = pusher.subscribe(`presence-channel-${router.query.channel}`);
    //   }
    // });
    // channel.bind("chat-update", (data: DataType) => {
    //     const { message } = data;
    //     setMessageArray((prevState) => [message, ...prevState]); 
    //   }
    // );
    // channel.bind("chat-delete-message", (data: {messageId: string}) => {
    //   const { messageId } = data;
    //   setMessageArray((prevState => prevState.filter((message) => message.id !== messageId)));
    // })

    // return () => {
    //   channel.unbind('chat-update');
    //   channel.unbind('chat-delete-message');
    //   pusher.unsubscribe(`presence-channel-${router.query.channel}`);
    // };
  }, [router.asPath]);

  return (
    <div className="bg-gray-chat flex flex-col flex-1 overflow-hidden">
      <div className="flex items-center justify-between h-12 p-3 w-full text-white font-medium border-b-[1px] border-neutral-800 border-solid shadow-sm">
        <div className="flex items-center">
          <GiHamburgerMenu onClick={() => setMenu((prevState) => !prevState)} className="hidden sm:block" />
          <FaHashtag className="mx-2 text-gray-icons text-xl" />
          <span>{channel.name}</span>
        </div>
        <div className="flex items-center">
          <IoIosPeople
            onClick={toggleServerMembers}
            className="text-2xl mr-2 hidden md:block"
          />
          <button
            className="mr-3 bg-gray-user py-1 px-2 rounded text-gray-sidetext hover:bg-gray-900 hover:text-gray-chat-text transition"
            onClick={() => signOut({ callbackUrl: `/` })}
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-col flex-1 justify-end overflow-hidden">
          <div className="flex flex-col-reverse overflow-scroll no-scrollbar ">
            {messageArray.map((message) => (
              <ChatMessage
                id={message.id}
                user={message.user}
                name={message.user.name!}
                image={message.user.image!}
                message={message.message}
                time={message.createdAt.toString()}
                contextMenuMessage={contextMenuMessage}
                setContextMenuMessage={setContextMenuMessage}
                key={message.id}
                setDeletedMessage={setDeletedMessage}
              />
            ))}
          </div>

          <form
            onSubmit={sendMessage}
            className="flex m-4 mb-6 items-center bg-gray-message rounded-lg  px-4"
          >
            <button type="submit">
              <IoMdAddCircle className="text-2xl text-gray-icons hover:text-white transition" />
            </button>
            <input
              type="text"
              placeholder={`Message #${channel.name}`}
              className="w-full h-11 pl-4 rounded-lg bg-gray-message text-white select-none outline-none placeholder:text-gray-chat-text
          placeholder:text-opacity-50"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </form>
        </div>
        <div className={`flex ${serverMembers ? "md:flex" : "md:hidden"}`}>
          <ServerMembers members={members} />
        </div>
      </div>
    </div>
  );
}

export default Chat;
