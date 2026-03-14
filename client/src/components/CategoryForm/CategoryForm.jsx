import { useContext, useEffect, useState } from "react";
import { assests } from "../../assets/assests";
import { AppContext } from "../../context/AppContext";
import { addCategory } from "../../Service/CategoryService";
import toast from "react-hot-toast";

const CategoryForm = () => {
  const { categories, setCategories } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [data, setData] = useState({
    name: "",
    description: "",
    bgColor: "#2c2c2c",
  });

  // useEffect(() => {
  //   console.log("Data changed:", data);
  // }, [data]);

  const onChangeHandler = (e) => {
    const value = e.target.value;
    const name = e.target.name;

    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      toast.error("Please select an image");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("category", JSON.stringify(data));
    formData.append("file", imageFile);

    try {
      const response = await addCategory(formData);

      if (response.status === 201) {
        setCategories([...categories, response.data]);
        toast.success("Category added successfully");
        setData({
          name: "",
          description: "",
          bgColor: "#2c2c2c",
        });
        setImageFile(null);
      } else {
        toast.error("Failed to add category");
      }
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("An error occurred while adding the category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx2 mt-2" style={{height:'100vh', overflowY: 'auto', overflowX: 'hidden'}}>
      <div className="row">
        <div className="card col-md-12 form-container">
          <div className="card-body">
            <form onSubmit={onSubmitHandler}>
              <div className="mb-3">
                <label htmlFor="image" className="form-label">
                  <img
                    src={
                      imageFile
                        ? URL.createObjectURL(imageFile)
                        : assests.upload
                    }
                    alt=""
                    width={68}
                    // on hover highloght the image border
                    onMouseOver={(e) => {
                      e.currentTarget.style.border = "2px solid #ffc107";
                    }}

                    onMouseOut={(e) => {
                      e.currentTarget.style.border = "none";
                    }}
                        
                    style={{ cursor: "pointer" }}
                  />
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="image"
                  hidden
                  onChange={(e) => setImageFile(e.target.files[0])}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="categoryName" className="form-label">
                  Category Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="categoryName"
                  placeholder="Enter Category Name"
                  name="name"
                  onChange={onChangeHandler}
                  value={data.name}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <textarea
                  className="form-control"
                  id="description"
                  rows="5"
                  placeholder="Enter Description"
                  name="description"
                  onChange={onChangeHandler}
                  value={data.description}
                ></textarea>
              </div>
              <div className="mb-3">
                <label htmlFor="bgColor" className="form-label">
                  Background Color
                </label>
                <br />
                <input
                  type="color"
                  id="bgColor"
                  placeholder="#ffffff"
                  name="bgColor"
                  onChange={onChangeHandler}
                  value={data.bgColor}
                />
              </div>
              <button type="submit" className="btn btn-warning w-100" disabled={loading}>
                {loading ? "Adding..." : "Add Category"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryForm;
