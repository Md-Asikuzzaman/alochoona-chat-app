import getCurrentUser from "@/actions/getCurrentUser";
import React from "react";
import HomeClient from "./HomeClient";

const Home = async () => {
  const currentUser = await getCurrentUser();
  const userId = currentUser?.id;

  return (
    <>
      <HomeClient userId={userId} />
    </>
  );
};

export default Home;
