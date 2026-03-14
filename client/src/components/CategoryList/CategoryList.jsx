import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import "./CategoryList.css";
import { deleteCategory } from "../../Service/CategoryService";
import toast from "react-hot-toast";

const CategoryList = () => {
  const { categories, setCategories, items } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const deleteByCategoryId = async (categoryId) => {
    try {
      const response = await deleteCategory(categoryId);

      if (response.status === 204) {
        const updatedCategories = categories.filter(  
          (cat) => cat.categoryId !== categoryId,
        );
        setCategories(updatedCategories);
        toast.success("Category deleted successfully");
      } else {
        toast.error("Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("An error occurred while deleting the category");
    }
  };

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
        {filteredCategories.map((category, index) => (
          <div key={index} className="col-12">
            <div
              className="card p-3"
              style={{ backgroundColor: category.bgColor || "#343a40" }}
            >
              <div className="d-flex align-items-center">
                <div style={{ marginRight: "15px" }}>
                  <img
                    className="category-image"
                    src={category.imgUrl || "https://placehold.co/64x64"}
                    alt={category.name}
                  />
                </div>

                <div className="flex-grow-1">
                  <h6 className="mb-1 text-white">{category.name}</h6>
                  <p className="mb-0 text-block badge rounded-pill text-bg-warning">
                    {
                      items.filter(
                        (item) => item.categoryId === category.categoryId,
                      ).length
                    }{" "}
                    Items
                  </p>
                </div>
                <div>
                  <button
                    className="btn btn-sm btn-danger m-2 pt-2"
                    onClick={() => deleteByCategoryId(category.categoryId)}
                  >
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

export default CategoryList;
