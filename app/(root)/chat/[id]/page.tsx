import { NextPage } from "next";
import ChatClient from "./ChatClient";
import getCurrentUser from "@/actions/getCurrentUser";

interface Props {}

const Page: NextPage<Props> = async ({}) => {
  const currentUser = await getCurrentUser();

  return (
    <div className="relative flex h-full flex-1 flex-col">
      <ChatClient currentUser={currentUser?.id} />
    </div>
  );
};

export default Page;
