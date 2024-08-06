import { NextPage } from "next";
import FriendList from "../components/Sidebar/FriendsList";
import getCurrentUser from "@/actions/getCurrentUser";
interface Props {
  children: React.ReactNode;
}

const Layout: NextPage<Props> = async ({ children }) => {
  const currentUser = await getCurrentUser();
  const userId = currentUser?.id;
  const userName = currentUser?.username;

  return (
    <section className="h-[100dvh] w-full overflow-hidden ">
      <div className="mx-auto lg:container">
        <div className="flex h-[100dvh] flex-1 bg-[#F4F4FA] lg:overflow-hidden lg:rounded-xl">
          <FriendList userId={userId} userName={userName} />
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </section>
  );
};

export default Layout;
