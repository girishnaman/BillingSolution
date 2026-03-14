import { useEffect } from "react";
import { fetchCategory } from "../Service/CategoryService";
import { createContext, useState } from "react";
import { fetchItems } from "../Service/ItemService";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [auth, setAuth] = useState(() => ({
  token: localStorage.getItem("token"),
  role: localStorage.getItem("role"),
}));

  const [items, setItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item) => {
    const existingItem = cartItems.find(
      (cartItem) => cartItem.name === item.name,
    );
    if (existingItem) {
      setCartItems(
        cartItems.map((cartItem) =>
          cartItem.name === item.name
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem,
        ),
      );
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId) => {
    setCartItems(cartItems.filter((item) => item.itemId !== itemId));
  };

  const updateQuantity = (itemId, quantity) => {
    setCartItems(
      cartItems.map((item) =>
        item.itemId === itemId ? { ...item, quantity } : item,
      ),
    );
  };

  useEffect(() => {
  const fetchData = async () => {
    if (!auth.token) return;

    try {
      const response = await fetchCategory();
      const itemsResponse = await fetchItems();

      setCategories(response.data);
      setItems(itemsResponse.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  fetchData();
}, [auth.token]);


const setAuthData = (token, role) => {
  if (token) {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
  } else {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  }

  setAuth({ token, role });
};


  const clearCart = () => {
    setCartItems([]);
  };

  const contextValue = {
    categories,
    setCategories,
    auth,
    setAuthData,
    items,
    setItems,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};
