import { NextPage } from "next";
import FriendList from "../components/Sidebar/FriendsList";
import getCurrentUser from "@/actions/getCurrentUser";
interface Props {
  children: React.ReactNode;
}

const Layout: NextPage<Props> = async ({ children }) => {
  const currentUser = await getCurrentUser();
  const userId = currentUser?.id;

  return (
    <section className="h-[100dvh] w-full overflow-hidden">
      <div className="mx-auto lg:container">
        <div className="flex h-[100dvh] flex-1 lg:overflow-hidden lg:rounded-xl">
          <FriendList userId={userId} />
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </section>
  );
};

export default Layout;
