import { useState } from "react";
import { deleteUser } from "../../Service/UserService";
import toast from "react-hot-toast";


const UserList = ({ users, setUsers }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

    const deleteByUserId = async (userId) => {
        try {
            const response = await deleteUser(userId);
            if(response.status === 204){
                const updatedUsers = users.filter(user => user.userId !== userId);
                setUsers(updatedUsers);
                toast.success("User deleted successfully");
            } else {
                toast.error("Failed to delete user");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error("An error occurred while deleting the user");
        }
    }


  
  return (
    <div
      className="category-list-container"
      style={{ overflowY: "auto", overflowX: "hidden", height: "100vh" }}
    >
      <div className="row p-2">
        <div className="input-group mb-3">
          <input
            type="text"
            name="keyword"
            id="keyword"
            className="form-control"
            placeholder="Search Categories..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />

          <span className="input-group-text bg-warning">
            <i className="bi bi-search"></i>
          </span>
        </div>
      </div>

      <div className="row g-3 p-2">
        {filteredUsers.map((user, index) => (
          <div className="col-12" key={index}>
            <div className="card p-2 bg-dark">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h5 className="mb-1 text-white">{user.name}</h5>
                  <p className="mb-0 text-white">{user.email}</p>
                </div>
                <div>
                    <button className="btn btn-sm btn-danger m-2 pt-2" onClick={() => deleteByUserId(user.userId)}>
                        <i className="bi bi-trash"></i>
                    </button>
              </div>
            </div>
          </div>
          </div>
        ))}
        </div>
    </div>
  );
};

export default UserList;
