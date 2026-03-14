import { addUser } from "../../Service/UserService";
import toast from "react-hot-toast";
import { useState } from "react";

const UserForm = ({ setUsers }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    role: "ROLE_USER",
  });

  const onChangeHandler = (e) => {
    const value = e.target.value;
    const name = e.target.name;

    setData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await addUser(data);
      setUsers((prevUsers) => [...prevUsers, response.data]);
      toast.success("User created successfully!");
      setData({
        name: "",
        email: "",
        password: "",
        role: "ROLE_USER",
      });
    } catch (error) {
      toast.error("Failed to create user. Please try again.");
      console.error("Error creating user:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx2 mt-2">
      <div className="row">
        <div className="card col-md-12 form-container">
          <div className="card-body">
            <form onSubmit={onSubmitHandler}>
              <div className="mb-3">
                <label htmlFor="userName" className="form-label">
                  User Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="userName"
                  placeholder="Enter User Name"
                  name="name"
                  onChange={onChangeHandler}
                  value={data.name}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="userEmail" className="form-label">
                  Email
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="userEmail"
                  placeholder="Enter User Email"
                  name="email"
                  onChange={onChangeHandler}
                  value={data.email}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="userPassword" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="userPassword"
                  placeholder="Enter User Password"
                  name="password"
                  onChange={onChangeHandler}
                  value={data.password}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-warning w-100"
                disabled={loading}
              >
                {loading ? "Creating User..." : "Create User"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserForm;
