import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiClock,
  FiPackage,
  FiTruck,
  FiXCircle,
  FiRefreshCw,
} from "react-icons/fi";
import { IndianRupee } from "lucide-react";
import Layout from "./Layout";
import axiosInstance from "../../api/axiosConfig";

export default function UpdateOrder() {
  const { id } = useParams(); // Order ID from URL
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Fetch single order
  const fetchOrder = async () => {
    try {
      setError(null);
      setLoading(true);
      const res = await axiosInstance.get(`/manage-orders/${id}/`);
      setOrder(res.data);
      setStatus(res.data.status || "");
    } catch (err) {
      console.error("Error fetching order details", err);
      setError(err.response?.data?.message || "Failed to fetch order details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  // Update order status
  const handleUpdate = async () => {
    if (!status) return;
    try {
      setSaving(true);
      await axiosInstance.patch(`/manage-orders/${id}/`, { status });
      await fetchOrder(); // Refresh data
      alert("Order status updated successfully!");
    } catch (err) {
      console.error("Error updating order", err);
      alert("Failed to update order. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return <FiCheckCircle className="w-5 h-5 text-green-600" />;
      case "shipped":
        return <FiTruck className="w-5 h-5 text-blue-600" />;
      case "processing":
        return <FiPackage className="w-5 h-5 text-amber-600" />;
      case "cancelled":
        return <FiXCircle className="w-5 h-5 text-red-600" />;
      case "pending":
      default:
        return <FiClock className="w-5 h-5 text-orange-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-700";
      case "shipped":
        return "bg-blue-100 text-blue-700";
      case "processing":
        return "bg-amber-100 text-amber-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      case "pending":
      default:
        return "bg-orange-100 text-orange-700";
    }
  };

  const statusOptions = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[500px]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-gray-800">Loading Order Details...</h3>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[500px] text-center">
          <p className="text-red-500 font-medium text-lg mb-3">{error}</p>
          <button
            onClick={fetchOrder}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            <FiRefreshCw className="w-4 h-4 mr-2" /> Try Again
          </button>
        </div>
      </Layout>
    );
  }

  if (!order) return null;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-gray-600 hover:text-purple-600 transition"
          >
            <FiArrowLeft className="mr-2" /> Back to Orders
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Update Order</h1>
        </div>

        {/* Order Info */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">
              Order #{order.order_id || order.id}
            </h2>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                order.status
              )}`}
            >
              {getStatusIcon(order.status)}
              <span className="ml-2 capitalize">{order.status}</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
            <p>
              <span className="font-semibold">Customer:</span>{" "}
              {order.user?.username || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Email:</span>{" "}
              {order.user?.email || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Total Amount:</span> ₹
              {order.total_amount?.toLocaleString() || 0}
            </p>
            <p>
              <span className="font-semibold">Date:</span>{" "}
              {order.created_at
                ? new Date(order.created_at).toLocaleString()
                : "N/A"}
            </p>
          </div>
        </div>

        {/* Update Status Form */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Update Order Status
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleUpdate}
                disabled={saving}
                className={`w-full inline-flex justify-center items-center px-4 py-2 rounded-lg text-white font-medium transition ${
                  saving
                    ? "bg-purple-400 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700"
                }`}
              >
                {saving ? (
                  <>
                    <FiRefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <FiCheckCircle className="w-4 h-4 mr-2" />
                    Update Status
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Ordered Items */}
        {order.items && order.items.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Ordered Items
            </h3>
            <div className="divide-y divide-gray-200">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-3 text-sm"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      {item.product?.name || "Product"}
                    </p>
                    <p className="text-gray-500">
                      Qty: {item.quantity} × ₹{item.price}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900">
                    ₹{(item.quantity * item.price).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
