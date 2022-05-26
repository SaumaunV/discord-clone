function Message() {
  return (
    <div className="flex h-12 px-4 items-center mb-1">
      <img
        src="https://external-preview.redd.it/4PE-nlL_PdMD5PrFNLnjurHQ1QKPnCvg368LTDnfM-M.png?auto=webp&s=ff4c3fbc1cce1a1856cff36b5d2a40a6d02cc1c3"
        alt="user profile"
        className="h-10 mr-2 rounded-full"
      />
      <div className="ml-2 mb-1.5">
        <div className="">
          <span className="text-white font-medium leading-[22px]">SV</span>
          <span className="text-xs ml-2 leading-[22px] text-gray-chat-text font-medium">
            Today at 0:00 PM
          </span>
        </div>
        <div className="leading-[22px] text-gray-text">hello</div>
      </div>
    </div>
  );
}

export default Message;
