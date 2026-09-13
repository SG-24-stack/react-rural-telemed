import React, { useEffect, useState } from "react";
import api from "../constants/api";

export default function MyOrders({ setCurrentPage }) {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError("");

      const res = await api.get("/orders/my-orders");

      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch orders error:", err);

      setError(
        err.response?.data?.error ||
        "Unable to load your orders."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) return;

    try {
      setCancellingId(orderId);

      await api.patch(`/orders/${orderId}/cancel`);

      // Refresh orders after cancellation
      await fetchOrders();

    } catch (err) {
      console.error("Cancel order error:", err);

      alert(
        err.response?.data?.error ||
        "Unable to cancel the order."
      );
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800";

      case "confirmed":
        return "bg-blue-100 text-blue-800";

      case "processing":
        return "bg-indigo-100 text-indigo-800";

      case "shipped":
        return "bg-purple-100 text-purple-800";

      case "delivered":
        return "bg-emerald-100 text-emerald-800";

      case "cancelled":
        return "bg-red-100 text-red-800";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatStatus = (status) => {
    if (!status) return "Unknown";

    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto mt-4 space-y-6 animate-fade-in font-sans">

      {/* Header */}
      <div className="bg-teal-700 text-white p-6 rounded-2xl shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">

        <div>
          <h1 className="text-2xl font-black">
            📦 My Orders
          </h1>

          <p className="text-xs text-teal-100 mt-1">
            View your medicine orders, order details and delivery status.
          </p>
        </div>

        <button
          onClick={() => setCurrentPage("medicine-order")}
          className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow cursor-pointer"
        >
          💊 Order Medicines
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 text-xs font-bold">
          ⚠ {error}
        </div>
      )}

      {/* Loading */}
      {isLoading ? (
        <div className="py-16 text-center text-gray-400 text-sm">
          Loading your orders...
        </div>
      ) : orders.length === 0 ? (

        /* Empty state */
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">

          <div className="text-5xl mb-4">
            🛒
          </div>

          <h2 className="text-lg font-black text-gray-800">
            No orders yet
          </h2>

          <p className="text-xs text-gray-500 mt-2">
            You haven't placed any medicine orders yet.
          </p>

          <button
            onClick={() => setCurrentPage("medicine-order")}
            className="mt-5 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl text-xs font-bold shadow cursor-pointer"
          >
            Browse Medicines
          </button>

        </div>

      ) : (

        /* Orders */
        <div className="space-y-5">

          {orders.map((order) => (

            <div
              key={order._id}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
            >

              {/* Order Header */}
              <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between gap-4">

                <div>
                  <p className="text-[10px] uppercase tracking-wide text-gray-400 font-bold">
                    Order ID
                  </p>

                  <p className="text-xs font-black text-gray-800 mt-1 break-all">
                    #{order._id}
                  </p>

                  <p className="text-[11px] text-gray-500 mt-1">
                    Placed on {formatDate(order.createdAt)}
                  </p>
                </div>

                <div className="flex items-center gap-3">

                  <span
                    className={`px-3 py-1.5 rounded-full text-[10px] font-black ${getStatusStyle(
                      order.status
                    )}`}
                  >
                    {formatStatus(order.status)}
                  </span>

                </div>

              </div>

              {/* Medicines */}
              <div className="p-5 space-y-3">

                <p className="text-xs font-black text-gray-700">
                  Medicines
                </p>

                {order.items?.map((item, index) => (

                  <div
                    key={index}
                    className="flex flex-col sm:flex-row justify-between gap-2 bg-gray-50 rounded-xl p-3"
                  >

                    <div>
                      <p className="text-xs font-black text-gray-800">
                        💊 {item.medicine_name}
                      </p>

                      <p className="text-[11px] text-gray-500 mt-1">
                        Quantity: {item.quantity}
                      </p>

                      {item.prescription_document_url && (
                        <p className="text-[10px] text-emerald-700 font-bold mt-1">
                          📎 Prescription attached
                        </p>
                      )}
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-black text-teal-700">
                        ₹{Number(item.price).toFixed(2)}
                      </p>

                      <p className="text-[10px] text-gray-500">
                        ₹{(
                          Number(item.price) *
                          Number(item.quantity)
                        ).toFixed(2)}{" "}
                        total
                      </p>
                    </div>

                  </div>

                ))}

              </div>

              {/* Order Footer */}
              <div className="p-5 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">

                <div>
                  <p className="text-[10px] text-gray-500 font-bold">
                    Total Amount
                  </p>

                  <p className="text-xl font-black text-teal-700">
                    ₹{Number(order.total_amount).toFixed(2)}
                  </p>
                </div>

                <div className="flex gap-2">

                  {/* Cancel */}
                  {order.status !== "cancelled" &&
                    order.status !== "shipped" &&
                    order.status !== "delivered" && (

                      <button
                        onClick={() =>
                          handleCancelOrder(order._id)
                        }
                        disabled={cancellingId === order._id}
                        className="px-4 py-2.5 rounded-xl text-xs font-bold bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 disabled:opacity-50 cursor-pointer"
                      >
                        {cancellingId === order._id
                          ? "Cancelling..."
                          : "Cancel Order"}
                      </button>

                    )}

                </div>

              </div>

            </div>

          ))}

        </div>
      )}

      <p className="text-[10px] text-gray-400 text-center px-4">
        Your order status will be updated as your medicine order is processed and delivered.
      </p>

    </div>
  );
}