import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { addItem } from "../../Service/ItemService";
import { assests } from "../../assets/assests";

const ItemForm = () => {
  const { categories, setItems, items, setCategories } = useContext(AppContext);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    name: "",
    categoryId: "",
    price: "",
    description: "",
  });

  const onChangeHandler = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("item", JSON.stringify(data));
    formData.append("file", image);

    try {
      if (!image) {
        toast.error("Please select an image for the item.");
        return;
      }

      const response = await addItem(formData);
      if (response.status === 201) {
        toast.success("Item created successfully!");
        setItems([...items, response.data]);
        setCategories((prevCategories) => prevCategories.map((category) => 
          category.categoryId === data.categoryId ? { ...category, items: category.items + 1 } : category
        ));
        setData({
          name: "",
          categoryId: "",
          price: "",
          description: "",
        });
        setImage(null);
      } else {
        toast.error("Failed to create item. Please try again.");
      }
    } catch (error) {
      console.error("Error creating item:", error);
      toast.error("Failed to create item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx2 mt-2" style={{height:'100v', overflowY: 'auto', overflowX: 'hidden'}}>
      <div className="row">
        <div className="card col-md-12 form-container">
          <div className="card-body">
            <form onSubmit={onSubmitHandler}>
              <div className="mb-3">
                <label htmlFor="image" className="form-label">
                  <img
                    src={image ? URL.createObjectURL(image) : assests.upload}
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
                  name="image"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="itemName" className="form-label">
                  Item Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="itemName"
                  placeholder="Enter Item Name"
                  name="name"
                  onChange={onChangeHandler}
                  value={data.name}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="category">
                  Category
                </label>
                <select
                
                  id="category"
                  className="form-control"
                  name="categoryId"
                  onChange={onChangeHandler}
                  value={data.categoryId}
                  required
                >
                  <option value="">---SELECT CATEGORY---</option>
                  {categories.map((category) => (
                    <option key={category.categoryId} value={category.categoryId}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="price" className="form-label">
                  Price
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="price"
                  placeholder="&#8377;200.00"
                  name="price"
                  onChange={onChangeHandler}
                  value={data.price}
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

              <button
                type="submit"
                className="btn btn-warning w-100"
                disabled={loading}
              >
                {loading ? "Creating Item..." : "Create Item"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemForm;
