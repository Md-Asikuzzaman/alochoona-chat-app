import { NextPage } from "next";
import FriendList from "../components/Sidebar/FriendsList";

interface Props {
  children: React.ReactNode;
}

const Layout: NextPage<Props> = ({ children }) => {
  return (
    <section className="h-[100dvh] w-full overflow-hidden">
      <div className="mx-auto lg:container">
        <div className="flex h-[100dvh] flex-1 bg-gray-100 lg:overflow-hidden lg:rounded-xl">
          <FriendList />
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </section>
  );
};

export default Layout;
