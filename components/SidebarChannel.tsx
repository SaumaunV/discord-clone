import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaHashtag } from "react-icons/fa";
import { IoMdVolumeHigh } from "react-icons/io";
import { IoEllipsisVertical } from "react-icons/io5";
import { useStateValue } from "../context/StateProvider";
import useComponentVisible from "../customhooks";

interface Props {
  type: string;
  id: string;
  name: string;
  refreshData: () => void;
}

function SidebarChannel({ type, id, name, refreshData }: Props) {
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);
  const [dropdown, setDropdown] = useState(false);
  const [{ channel }, dispatch] = useStateValue();
  const router = useRouter();

  const toggleChannel = () => {
    dispatch({ type: "CHANGE_CHANNEL", id, name });
  };

  const toggleDropdown = () => {
    setDropdown(!dropdown);
    setIsComponentVisible(true);
  };

  const deleteChannel = async () => {
    try {
      await fetch(`/api/channel/${id}`, {
        method: "DELETE",
      });
      refreshData();
    } catch (error) {}
  };

  useEffect(() => {
    if (!isComponentVisible) {
      setDropdown(false);
    }
  }, [isComponentVisible]);

  return (
      <div
        className={`mx-2 mt-1 px-2 py-1 text-gray-sidetext font-medium flex items-center
        rounded cursor-pointer select-none group ${
          router.query.channel === id
            ? "bg-gray-channel"
            : "hover:bg-gray-channel/50 hover:text-white/[0.7]  "
        }`}
        onClick={toggleChannel}
      >
        <div className="flex flex-1 items-center">
          {type === "text" ? (
            <FaHashtag className="mr-1.5 text-lg text-gray-sidetext" />
          ) : (
            <IoMdVolumeHigh className="mr-1 text-xl" />
          )}
          <span className={`${router.query.channel === id && "text-white"}`}>{name}</span>
        </div>

        <div className="relative">
          <IoEllipsisVertical
            onClick={toggleDropdown}
            className={`text-gray-icons hover:text-white cursor-pointer ${
              router.query.channel !== id && "hidden group-hover:block"
            }`}
          />
          {dropdown && isComponentVisible && (
            <div
              ref={ref}
              className="bg-black text-red-500 text-sm absolute w-36 h-9 p-1 text-center align-middle center font-normal rounded z-10"
            >
              <li
                onClick={deleteChannel}
                className="flex list-none hover:text-white justify-center items-center hover:bg-red-500 hover:rounded-sm w-full h-full"
              >
                <a onClick={(e) => e.preventDefault()} href="">
                  Delete Channel
                </a>
              </li>
            </div>
          )}
        </div>
      </div>
  );
}

export default SidebarChannel;
