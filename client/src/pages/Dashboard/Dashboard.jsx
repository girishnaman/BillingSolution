import "./Dashboard.css";
import { useEffect, useState } from "react";
import { fetchDashboardData } from "../../Service/DashboardService";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetchDashboardData();
        setData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="error">
        <p>No dashboard data available</p>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <i className="bi bi-currency-rupee"></i>
            </div>
            <div className="stat-content">
              <h3>Today's Sales</h3>
              <p>{data.todaySales.toFixed(2)}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <i className="bi bi-cart-check"></i>
            </div>
            <div className="stat-content">
              <h3>Today's Orders</h3>
              <p>{data.todayOrderCount}</p>
            </div>
          </div>
        </div>
        <div className="recent-orders-card">
          <h3 className="recent-orders-title">
            <i className="bi bi-clock-history"></i> Recent Orders
          </h3>
          <div className="orders-table-container">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {data.recentOrders.map((order) => (
                  <tr key={order.orderId}>
                    <td>{order.orderId.substring(0, 8)}...</td>
                    <td>{order.customerName}</td>
                    <td>&#8377;{order.grandTotal?.toFixed(2)}</td>
                    <td>{order.paymentMethod}</td>
                    <td>
                      <span
                        className={`badge ${
                          order.paymentDetails?.status === "COMPLETED"
                            ? "bg-success"
                            : "bg-warning text-dark"
                        }`}
                      >
                        {order.paymentDetails?.status || "PENDING"}
                      </span>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
