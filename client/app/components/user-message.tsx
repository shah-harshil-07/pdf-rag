"use client";
import { UserButton } from "@clerk/nextjs";

interface IMessageBody {
  message: string;
}

const UserMessage = ({ message }: IMessageBody) => {
  return (
    <div className="flex justify-end gap-2">
      <div className="border-2 rounded-3xl p-3 bg-gray-200 text-gray-900">
        {message}
      </div>

      <UserButton />
    </div>
  );
};

export default UserMessage;
