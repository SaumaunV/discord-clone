import { User } from "@prisma/client"

interface Props {
    members: User[]
}

function ServerMembers({ members }: Props) {
  return (
    <div className="w-60 bg-gray-sidebar pl-5 pt-7">
      {members.map((user) => (
        <div className="flex items-center mb-2">
          <img
            className="h-8 mr-3 rounded-full"
            src={user.image!}
            alt="user profile"
          />
          <span className="text-gray-sidetext font-medium">{user.name}</span>
        </div>
      ))}
    </div>
  );
}

export default ServerMembers