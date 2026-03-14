import "./ReceiptPopup.css";
import "./Print.css";

const ReceiptPopup = ({ orderDetails, onClose, onPrint }) => {

    console.log("Order Details in ReceiptPopup:", orderDetails); // Debugging log
  return (
    <div className="receipt-popup-overlay text-dark">
      <div className="receipt-popup">
        <div className="text-center mb-4">
          <i className="bi bi-check-circle-fill text-success fs-1"></i>
        </div>
        <h3 className="text-center mb-4">Order Receipt</h3>
        <p>
          <strong>Order ID:</strong> {orderDetails.orderId} <br />
        </p>
        <p>
          <strong>Customer Name:</strong> {orderDetails.customerName} <br />
        </p>
        <p>
          <strong>Mobile Number:</strong> {orderDetails.phoneNumber} <br />
        </p>
        <hr className="my-3"></hr>
        <h5 className="mb-3">Order Details</h5>
        <div className="cart-items-scrollable">
          {orderDetails.items.map((item) => (
            <div
              key={item.itemId}
              className="d-flex justify-content-between mb-2"
            >
              <span>
                {item.name} x {item.quantity}
              </span>
              <span>&#8377;{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <hr className="my-3"></hr>
        <div className="d-flex justify-content-between mb-2">
          <span>
            <strong>Sub Total:</strong>
          </span>
          <span>&#8377;{orderDetails.subtotal.toFixed(2)}</span>
        </div>
        <div className="d-flex justify-content-between mb-2">
          <span>
            <strong>Tax (18%):</strong>
          </span>
          <span>&#8377;{orderDetails.tax.toFixed(2)}</span>
        </div>
        <div className="d-flex justify-content-between mb-4">
          <span>
            <strong>Total Amount:</strong>
          </span>
          <span>&#8377;{orderDetails.grandTotal.toFixed(2)}</span>
        </div>
        <p>
          <strong>Payment Method:</strong> {orderDetails.paymentMethod} <br />
        </p>
        {orderDetails.paymentMethod === "UPI" && (
          <>
            <p>
              <strong>UPI Transaction ID:</strong>{" "}
              {orderDetails.razorpayPaymentId} <br />
            </p>
            <p>
              <strong>Order ID: </strong> {orderDetails.razorpayOrderId} <br />
            </p>
          </>
        )}
        <div className="d-flex justify-content-end gap-3 mt-4">
          <button className="btn btn-warning" onClick={onClose}>
            Close
          </button>
          <button className="btn btn-danger" onClick={onPrint}>
            Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptPopup;
