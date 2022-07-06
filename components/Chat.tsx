import { Channel, Message, User } from "@prisma/client";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import { FaHashtag } from "react-icons/fa";
import { IoMdAddCircle } from "react-icons/io";
import ChatMessage from "./ChatMessage";
import ServerMembers from "./ServerMembers";
import Pusher from 'pusher-js';

interface Props {
  channel: Channel;
  messages: (Message & {
    user: User;
  })[];
  members: User[];
  refreshData: () => void;
}

type DataType = {
  message: Message & {
    user: User;
  };
};

function Chat({ channel, messages, members, refreshData }: Props) {
  const {data: session} = useSession();
  const [message, setMessage] = useState("");
  const [contextMenuMessage, setContextMenuMessage] = useState("");
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

  async function sendMessage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await fetch('/api/message', {
      body: JSON.stringify({userId: session?.userId, message, channel: router.query.channel}),
      method: 'POST'
    })
    setMessage("");
  }

  useEffect(() => {
    setMessageArray(messages);
    pusher.unsubscribe(`presence-channel-${router.query.channel}`);
    console.log('chat mounted');
    const channel = pusher.subscribe(`presence-channel-${router.query.channel}`);
    //console.log(channel);
    channel.bind("chat-update", (data: DataType) => {
        const { message } = data;
        console.log(message);
        setMessageArray((prevState) => [...prevState, message]); 
        console.log("pushed new message");
      }
    );
    channel.bind("chat-delete-message", (data: {messageId: string}) => {
      const { messageId } = data;
      setMessageArray((prevState => prevState.filter((message) => message.id !== messageId)));
    })

    return () => {
      channel.unbind('chat-update');
      channel.unbind('chat-delete-message');
      pusher.unsubscribe(`presence-channel-${router.query.channel}`);
      console.log('chat unmounted');
    };
  }, [router.asPath]);

  return (
    <div className="bg-gray-chat flex flex-col flex-1">
      <div className="flex items-center justify-between h-12 p-3 w-full text-white font-medium border-b-[1px] border-neutral-800 border-solid shadow-sm">
        <div className="flex items-center">
          <FaHashtag className="mx-2 text-gray-icons text-xl" />
          <span>{channel.name}</span>
        </div>
        <button
          className="mr-3 bg-gray-user py-1 px-2 rounded text-gray-sidetext hover:bg-gray-900 hover:text-gray-chat-text transition"
          onClick={() => signOut({ callbackUrl: `/` })}
        >
          Sign out
        </button>
      </div>

      <div className="flex flex-1">
        <div className="flex flex-col flex-1">
          <div className="flex flex-col flex-1  justify-end">
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
        <ServerMembers members={members} />
      </div>
    </div>
  );
}

export default Chat;
