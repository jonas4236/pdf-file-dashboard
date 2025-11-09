import { Outlet } from "react-router";
import Footer from "./Layout/Footer";
import Navbar from "./Layout/Navbar";
import type { JSX } from "react";

const Home = (): JSX.Element => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

export default Home;
