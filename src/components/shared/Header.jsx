import { Link } from "react-router-dom";
import { ConnectKitButton } from "@0xfamily/connectkit";
import { FaHome, FaPlus, FaImages, FaCoins } from "react-icons/fa";

const Header = () => (
  <header className="flex justify-between items-center p-4 bg-gray-800 text-white">
    <h1 className="text-2xl font-bold">NFT Platform</h1>
    <nav className="flex space-x-4">
      <Link to="/" className="flex items-center space-x-1 hover:text-gray-300">
        <FaHome />
        <span>Home</span>
      </Link>
      <Link
        to="/create"
        className="flex items-center space-x-1 hover:text-gray-300"
      >
        <FaPlus />
        <span>Create</span>
      </Link>
      <Link
        to="/gallery"
        className="flex items-center space-x-1 hover:text-gray-300"
      >
        <FaImages />
        <span>Gallery</span>
      </Link>
      <Link
        to="/rewards"
        className="flex items-center space-x-1 hover:text-gray-300"
      >
        <FaCoins />
        <span>Rewards</span>
      </Link>
    </nav>
    <ConnectKitButton />
  </header>
);

export default Header;
