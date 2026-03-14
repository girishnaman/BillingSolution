import "./CartSummary.css";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import ReceiptPopup from "../ReceiptPopup/ReceiptPopup";
import toast from "react-hot-toast";
import { useState } from "react";
import { createRazorpayOrder } from "../../Service/PaymentService";
import { AppConstants } from "../../util/constants";
import { verifyPayment } from "../../Service/PaymentService";
import { createOrder, deleteOrder } from "../../Service/OrderService";

const CartSummary = ({
  customerName,
  setCustomerName,
  mobileNumber,
  setMobileNumber,
}) => {
  const { cartItems, clearCart } = useContext(AppContext);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const taxRate = 0.18; // 18% tax
  const taxAmount = totalAmount * taxRate;
  const finalAmount = totalAmount + taxAmount;

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const deleteOrderOnFailure = async (orderId) => {
    try {
      await deleteOrder(orderId);
    } catch (error) {
      toast.error(
        "Something went wrong while deleting the order. Please contact support.",
      );
      console.error("Failed to delete order:", error);
    }
  };

  const clearAll = () => {
    setCustomerName("");
    setMobileNumber("");
    clearCart();
  };

  const placeOrder = () => {
    setShowPopup(true);
    clearAll();
  };

  const handlePrintReceipt = () => {
    window.print();
    toast.success("Receipt printed successfully!");
  };

  const completePayment = async (paymentMode) => {
    if (!customerName || !mobileNumber) {
      toast.error("Please enter customer name and mobile number.");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty. Please add items to place an order.");
      return;
    }

    setIsProcessing(true);

    const orderData = {
      customerName,
      phoneNumber: mobileNumber,
      cartItems,
      subtotal: totalAmount,
      tax: taxAmount,
      grandTotal: finalAmount,
      paymentMethod: paymentMode.toUpperCase(),
    };

    try {
      const orderResponse = await createOrder(orderData);
      const savedData = orderResponse.data;
      if (orderResponse.status === 201 && paymentMode === "cash") {
        toast.success("Order placed successfully!");
        setOrderDetails(savedData);
        return;
      } else if (orderResponse.status === 201 && paymentMode === "upi") {
        const razorpayLoaded = await loadRazorpayScript();
        if (!razorpayLoaded) {
          toast.error("Failed to load Razorpay SDK. Please try again.");
          await deleteOrderOnFailure(savedData.orderId);
          return;
        }

        const razorpayResponse = await createRazorpayOrder({
          amount: finalAmount * 100, // Convert to paise
          currency: "INR",
        });
        const razorpayOptions = {
          key: AppConstants.RAZORPAY_KEY_ID,
          amount: razorpayResponse.data.amount,
          currency: razorpayResponse.data.currency,
          order_id: razorpayResponse.data.id,
          name: "Billing Solution",
          description: "Order Transaction",
          handler: async function (response) {
            try {
              const paymentDetails = {
                orderId: savedData.orderId,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
              };
              const paymentVerificationResponse =
                await verifyPayment(paymentDetails);
              if (paymentVerificationResponse.status === 200) {
                toast.success("Payment successful!");
                setOrderDetails({
                  ...savedData,
                  paymentDetails: {
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpayOrderId: response.razorpay_order_id,
                    razorpaySignature: response.razorpay_signature,
                  },
                });
              } else {
                toast.error(
                  "Payment verification failed. Please contact support.",
                );
                await deleteOrderOnFailure(savedData.orderId);
              }
            } catch (error) {
              toast.error(
                "Payment verification failed. Please contact support.",
              );
              console.error("Payment verification error:", error);
              await deleteOrderOnFailure(savedData.orderId);
            }
          },
          prefill: {
            name: customerName,
            contact: mobileNumber,
          },
          theme: {
            color: "#3399cc",
          },
          modal: {
            ondismiss: async function () {
              toast.error("Payment cancelled. Order will be deleted.");
              await deleteOrderOnFailure(savedData.orderId);
            },
          },
        };

        const razorpay = new window.Razorpay(razorpayOptions);
        razorpay.on("payment.failed", async function (response) {
          toast.error("Payment failed. Please try again.");
          console.error("Payment failed:", response.error);
          await deleteOrderOnFailure(savedData.orderId);
        });
        razorpay.open();
        toast.success("Redirecting to payment gateway...");
        return;
      } else {
        toast.error("Failed to place order. Please try again.");
        return;
      }
    } catch (error) {
      toast.error("Failed to place order. Please try again.");
      console.error("Order placement error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="mt-2">
      <div className="cart-summary-details">
        <div className="d-flex justify-content-between mb-2">
          <span className="text-light">Item: </span>
          <span className="text-light">&#8377;{totalAmount.toFixed(2)}</span>
        </div>
        <div className="d-flex justify-content-between mb-2">
          <span className="text-light">Tax (18%): </span>
          <span className="text-light">&#8377;{taxAmount.toFixed(2)}</span>
        </div>
        <div className="d-flex justify-content-between mb-4">
          <span className="text-light">Final Amount: </span>
          <span className="text-light">&#8377;{finalAmount.toFixed(2)}</span>
        </div>
      </div>

      <div className="d-flex gap-3">
        <button
          className="btn btn-success flex-grow-1"
          onClick={() => completePayment("cash")}
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : "Cash"}
        </button>
        <button
          className="btn btn-primary flex-grow-1"
          onClick={() => completePayment("upi")}
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : "UPI"}
        </button>
      </div>

      <div className="d-flex gap-3 mt-3">
        <button
          className="btn btn-warning flex-grow-1"
          onClick={placeOrder}
          disabled={isProcessing || !orderDetails}
        >
          Place Order
        </button>
      </div>
      {showPopup && orderDetails && (
        <ReceiptPopup
          orderDetails={{
            ...orderDetails,
            razorpayOrderId: orderDetails.paymentDetails?.razorpayOrderId || "",
            razorpayPaymentId: orderDetails.paymentDetails?.razorpayPaymentId || "",
          }}
          onClose={() => setShowPopup(false)}
          onPrint={handlePrintReceipt}
        />
      )}
    </div>
  );
};

export default CartSummary;
