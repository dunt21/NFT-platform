import { Outlet } from "react-router-dom";
import Header from "../components/shared/Header";

const MainLayout = () => (
  <div className="container mx-auto p-4">
    <Header />
    <main className="mt-8">
      <Outlet />
    </main>
  </div>
);

export default MainLayout;
