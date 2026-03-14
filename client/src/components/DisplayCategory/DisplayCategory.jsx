import Category from "../Category/Category";
import "./DisplayCategory.css";
import { assests } from "../../assets/assests";

const DisplayCategory = ({
  categories,
  selectedCategory,
  setSelectedCategory,
}) => {
  return (
    <div>
      <div className="row g-3" style={{ width: "100%", margin: 0 }}>
        <div
          key="all-categories"
          className="col-md-3 col-sm-6"
          style={{ padding: "0 10px" }}
        >
          <Category
            categoryName="All Categories"
            imgUrl={assests.device}
            numberOfItems={categories.reduce(
              (total, category) => total + category.items,
              0,
            )}
            bgColor="#6c757d"
            isSelected={selectedCategory == ""}
            onClick={() => setSelectedCategory("")}
          />
        </div>
        {categories.map((category) => (
          <div
            key={category.categoryId}
            className="col-md-3 col-sm-6"
            style={{ padding: "0 10px" }}
          >
            <Category
              categoryName={category.name}
              imgUrl={category.imgUrl}
              numberOfItems={category.items}
              bgColor={category.bgColor}
              isSelected={selectedCategory == category.categoryId}
              onClick={() =>
                setSelectedCategory(
                  selectedCategory == category.categoryId
                    ? ""
                    : category.categoryId,
                )
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DisplayCategory;
