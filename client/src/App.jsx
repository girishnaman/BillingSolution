import { Navigate, Route, useLocation } from "react-router-dom";
import MenuBar from "./components/MenuBar/Menubar";
import { Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import Explore from "./pages/Explore/Explore";
import ManageCategory from "./pages/ManageCategory/ManageCategory";
import ManageItems from "./pages/ManageItems/ManageItems";
import ManageUsers from "./pages/ManageUsers/ManageUsers";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login/Login";
import OrderHistory from "./pages/OrderHistory/OrderHistory";
import { useContext } from "react";
import { AppContext } from "./context/AppContext";
import NotFound from "./pages/NotFound/NotFound";

const App = () => {

  const location = useLocation();
  const {auth} = useContext(AppContext);

  const LoginRoute = ({element}) => {
    if (auth.token) {
        return <Navigate to="/dashboard" replace />;
    }
    return element;
  }

  const ProtectedRoute = ({element, allowedRoles}) => {
    if (!auth.token) {
        return <Navigate to="/login" replace />;
    }
    if (allowedRoles && !allowedRoles.includes(auth.role)) {
        return <Navigate to="/dashboard" replace />;
    }
    return element;
  }

  return (
    <>
      {location.pathname !== "/login" && <MenuBar />}
      <Toaster/>
      <Routes>
        
        <Route path="/explore" element={<Explore />} />
        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
        {/* Admin routes */}
        <Route path="/category" element={<ProtectedRoute element={<ManageCategory />} allowedRoles={['ROLE_ADMIN']} />} />
        <Route path="/items" element={<ProtectedRoute element={<ManageItems />} allowedRoles={['ROLE_ADMIN']} />} />
        <Route path="/users" element={<ProtectedRoute element={<ManageUsers />} allowedRoles={['ROLE_ADMIN']} />} />


        <Route path="/login" element={<LoginRoute element={<Login />} />} />
        <Route path="/orders" element={<OrderHistory />} />
        <Route path="/" element={<Navigate to={auth.token ? "/dashboard" : "/login"} replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );};

export default App;
