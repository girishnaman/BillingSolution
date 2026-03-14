import { useState } from "react";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { deleteItem } from "../../Service/ItemService";
import toast from "react-hot-toast";
import "./ItemList.css";

const ItemList = () => {
  const { items, setItems } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const removeitem = async (itemId) => {
    try {
      const response = await deleteItem(itemId);
      if (response.status === 204) {
        const updatedItems = items.filter((item) => item.itemId !== itemId);
        setItems(updatedItems);
        toast.success("Item deleted successfully!");
      } else {
        toast.error("Failed to delete item. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div
      className="category-list-container"
      style={{ overflowY: "auto", overflowX: "hidden", height: "100vh" }}
    >
      <div className="row p-2">
        <div className="col-12">
          <div className="input-group mb-3">
            <input
              type="text"
              name="keyword"
              id="keyword"
              className="form-control"
              placeholder="Search Items..."
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
      </div>

      <div className="row g-3 p-2">
        {filteredItems.map((item) => (
          <div className="col-12" key={item.itemId}>
            <div className="card p-3 bg-dark">
              <div className="d-flex align-items-center">
                <div style={{ marginRight: "15px" }}>
                  <img className="item-image" src={item.imgUrl} alt={item.name} />
                </div>
                <div className="flex-grow-1">
                  <h6 className="mb-1 text-white">{item.name}</h6>
                  <p className="mb-0 text-white">Category: {item.categoryName}</p>
                  <span className="mb-0 text-block badge rounded-pill text-bg-warning">
                    &#8377; {item.price}
                  </span>
                </div>
                <div>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => removeitem(item.itemId)}
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

export default ItemList;
