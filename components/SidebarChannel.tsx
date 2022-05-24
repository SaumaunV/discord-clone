import { useEffect, useState } from "react";
import { FaHashtag } from "react-icons/fa";
import { IoMdVolumeHigh } from "react-icons/io";
import { IoEllipsisVertical } from "react-icons/io5";
import { useStateValue } from "../context/StateProvider";
import useComponentVisible from "../customhooks";

interface Props {
  type: string;
  id: string;
}

function SidebarChannel({ type, id }: Props) {
  const {ref, isComponentVisible, setIsComponentVisible} = useComponentVisible(false);
  const [dropdown, setDropdown] = useState(false);
  const [{ channel }, dispatch] = useStateValue();

  const toggleChannel = () => {
    dispatch({ type: "CHANGE_CHANNEL", id });
  };

  const toggleDropdown = () => {
    setDropdown(!dropdown);
    setIsComponentVisible(true);
  }

  useEffect(() => {
    if(!isComponentVisible) {
      setDropdown(false);
    }
  }, [isComponentVisible])
  

  return (
    <>
      {type === "text" && (
        <div
          className={`mx-2 mt-1 px-2 py-1 text-gray-sidetext font-medium flex items-center
        rounded cursor-pointer select-none group ${
          channel === id
            ? "bg-gray-channel"
            : "hover:bg-gray-channel hover:text-white hover:opacity-80 "
        }`}
          onClick={toggleChannel}
        >
          <div className="flex flex-1 items-center">
            <FaHashtag className="mr-1.5 text-lg text-gray-sidetext" />
            <span className={`${channel === id && "text-white"}`}>
              general
            </span>
          </div>

          <div className="relative">
            <IoEllipsisVertical
              onClick={toggleDropdown}
              className={`text-gray-icons hover:text-white cursor-pointer ${
                channel !== id && "hidden group-hover:block"
              }`}
            />
            {dropdown && isComponentVisible && (
              <div ref={ref} className="bg-black text-red-500 text-sm absolute w-36 h-9 p-1 text-center align-middle center font-normal rounded z-10">
                <li className="flex list-none hover:text-white justify-center items-center hover:bg-red-500 hover:rounded-sm w-full h-full">
                  <a onClick={e => e.preventDefault()} href="">Delete Channel</a>
                </li>
              </div>
            )}
          </div>
        </div>
      )}
      {type === "audio" && (
        <div className="ml-4 py-2 text-gray-sidetext font-medium flex items-center">
          <IoMdVolumeHigh className="mr-1 text-xl" /> General
        </div>
      )}
    </>
  );
}

export default SidebarChannel;
