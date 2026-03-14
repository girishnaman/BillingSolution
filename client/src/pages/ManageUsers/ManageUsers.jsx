import { useEffect } from "react";
import UserForm from "../../components/UserForm/UserForm";
import UserList from "../../components/UserList/UserList";
import "./ManageUsers.css";
import { fetchUsers } from "../../Service/UserService";
import toast from "react-hot-toast";
import { useState } from "react";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const readUsers = async () => {
      setLoading(true);
      try {
        const response = await fetchUsers();
        setUsers(response.data);
      } catch (error) {
        toast.error("Failed to fetch users. Please try again.");
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    readUsers();
  }, []);

  return (
    <div className="users-container text-light">
      <div className="left-column">
        <UserForm setUsers = {setUsers} />
      </div>

      <div className="right-column">
        <UserList users={users} setUsers={setUsers} />
      </div>
    </div>
  );
};

export default ManageUsers;
