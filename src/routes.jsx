import Home from "./pages/Home";
import CreateNFT from "./pages/CreateNFT";
import Gallery from "./pages/Gallery";
import Rewards from "./pages/Rewards";

export const routes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/create",
    element: <CreateNFT />,
  },
  {
    path: "/gallery",
    element: <Gallery />,
  },
  {
    path: "/rewards",
    element: <Rewards />,
  },
];
