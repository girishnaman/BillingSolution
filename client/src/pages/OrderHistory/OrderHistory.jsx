import { useEffect, useState } from "react";
import "./OrderHistory.css";
import { latestOrder } from "../../Service/OrderService";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await latestOrder();
        setOrders(response.data);
      } catch (err) {
        setError("Failed to fetch order history. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const formatItems = (items) => {
    return items.map((item) => `${item.name} (x${item.quantity})`).join(", ");
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  if (loading) {
    return <div className="text-center py-4"><p>Loading order history...</p></div>;
  }

  if (orders.length === 0) {
    return <div className="text-center py-4"><p>No orders found</p></div>;
  }

  if (error) {
    return <div className="text-center py-4"><p>{error}</p></div>;
  }

  return (
    <div className="order-history-container">
        <h2 className="mb-2 text-light">Recent Orders</h2>

        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.orderId}>
                  <td>{order.orderId}</td>
                  <td>{order.customerName} <br/>
                    <small className="text-muted">{order.phoneNumber}</small>
                  </td>
                  <td>{formatItems(order.items)}</td>
                  <td>&#8377;{order.grandTotal?.toFixed(2)}</td>
                  <td>{order.paymentMethod}</td>
                  <td>
                    <span className={`badge ${order.paymentDetails?.status === "COMPLETED" ? "bg-success" : "bg-warning text-dark"}`}>
                      {order.paymentDetails?.status || "PENDING"}
                    </span>
                  </td>
                  <td>{formatDate(order.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </div>
  );
};

export default OrderHistory;
