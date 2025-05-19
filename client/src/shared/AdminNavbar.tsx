import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, logout } from "../redux/slices/authSlice";
import { useEffect } from "react";

const AdminNavbar = () => {

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getCurrentUser()).unwrap();
    };
    fetchData();
  }, [dispatch]);

  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/');
  };

  const getInitial = (name: string) => {
    return name?.charAt(0).toUpperCase();
  };

  return (
    <div className="w-full bg-white shadow-sm flex items-center justify-between px-6 py-3">
      <div className="text-xl font-semibold hidden sm:block ">Admin Panel</div>
      <div className="flex items-center  gap-4 ">
        {user && (
          <>
            {user?.profilePicture ? (
              <img
                src={user?.profilePicture}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
                {getInitial(user?.name)}
              </div>
            )}
            <span className="font-medium">{user?.name}</span>
            <button
              onClick={handleLogout}
            className="bg-red-500 cursor-pointer text-white px-4 py-2 rounded hover:bg-red-600 transition "
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminNavbar;
