import { User } from "@prisma/client"
import { useRouter } from "next/router";

interface Props {
    members: User[]
}

function ServerMembers({ members }: Props) {
  const router = useRouter();

  return (
    <div className="flex flex-col w-60 bg-gray-sidebar pl-5 pt-7">
      <div className="flex-1">
        {members.map((user) => (
          <div className="flex items-center mb-3" key={user.id}>
            <img
              className="h-8 mr-3 rounded-full"
              src={user.image!}
              alt="user profile"
            />
            <span className="text-gray-sidetext font-medium">{user.name}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-col min-h-[100px] text-gray-sidetext font-medium">
        <span className="">Invite Code:</span>
        <span>{router.query.server}</span>
      </div>
    </div>
  );
}

export default ServerMembers