import { FaHome } from "react-icons/fa";
// import "@styles/home.css";

const Home = () => {
  return (
    <div className="h-screen grid place-items-center">
      <div className="home-banner grid place-items-center h-4">
        <h1>Home</h1>
        <FaHome className="icon" />
      </div>
    </div>
  );
};

export default Home;
