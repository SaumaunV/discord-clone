
interface Props {
  name: string;
  image: string;
  message: string;
  time: string;
}

function ChatMessage({ name, image, message, time }: Props) {
  const currentDate = new Date();
  const messageDate = new Date(time);

  return (
    <div className="flex h-12 px-4 items-center mb-1 mt-4">
      <img src={image} alt="user profile" className="h-10 mr-2 rounded-full" />
      <div className="ml-2 mb-1.5">
        <div className="">
          <span className="text-white font-medium leading-[22px]">{name}</span>
          <span className="text-xs ml-2 leading-[22px] text-gray-chat-text font-medium">
            {
              currentDate.getDate() === messageDate.getDate() ? 
              `Today at ${messageDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}` :
              currentDate.getDate() === messageDate.getDate() + 1 ? 
              `Yesterday at ${messageDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}` :
              `${messageDate.getMonth() + 1}/${messageDate.getDate()}/${messageDate.getFullYear()}`
            }
          </span>
        </div>
        <div className="leading-[22px] text-gray-text">{message}</div>
      </div>
    </div>
  );
}

export default ChatMessage;