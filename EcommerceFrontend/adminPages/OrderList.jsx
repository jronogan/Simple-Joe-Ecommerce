import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllOrders, updateOrderStatus } from "../src/api/crud";
import "./admin.css";

const STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

const VALID_TRANSITIONS = {
  pending: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

const STATUS_COLORS = {
  pending: "#e0a800",
  processing: "#2980b9",
  shipped: "#8e44ad",
  delivered: "#27ae60",
  cancelled: "#c0392b",
};

const OrderList = () => {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusForm, setStatusForm] = useState({
    status: "",
    trackingNumber: "",
    carrier: "",
    notes: "",
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["allOrders", statusFilter],
    queryFn: () => getAllOrders(statusFilter),
  });

  const { mutate: updateOrder, isPending, isError: updateError } = useMutation({
    mutationFn: (formData) => updateOrderStatus(selectedOrder._id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allOrders"] });
      setSelectedOrder(null);
      setStatusForm({ status: "", trackingNumber: "", carrier: "", notes: "" });
    },
  });

  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
    setStatusForm({ status: "", trackingNumber: "", carrier: "", notes: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { status: statusForm.status };
    if (statusForm.trackingNumber) payload.trackingNumber = statusForm.trackingNumber;
    if (statusForm.carrier) payload.carrier = statusForm.carrier;
    if (statusForm.notes) payload.notes = statusForm.notes;
    updateOrder(payload);
  };

  const orders = data?.orders ?? [];
  const nextStatuses = selectedOrder ? (VALID_TRANSITIONS[selectedOrder.status] ?? []) : [];

  return (
    <div className="admin-page">
      <h1 className="admin-title">Order List</h1>
      <div className="admin-container">

        {/* Status filter */}
        <div className="order-filter-row">
          <button
            className={`order-filter-btn ${statusFilter === "" ? "order-filter-btn-active" : ""}`}
            onClick={() => setStatusFilter("")}
          >
            All
          </button>
          {STATUSES.map((s) => (
            <button
              key={s}
              className={`order-filter-btn ${statusFilter === s ? "order-filter-btn-active" : ""}`}
              onClick={() => setStatusFilter(s)}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {isLoading && <p className="admin-muted">Loading orders...</p>}
        {isError && <p className="admin-error">Failed to load orders.</p>}

        {!isLoading && orders.length === 0 && (
          <p className="admin-muted">No orders found.</p>
        )}

        {/* Order cards */}
        {orders.map((order) => (
          <div
            key={order._id}
            className={`admin-order-card order-card-clickable ${selectedOrder?._id === order._id ? "order-card-selected" : ""}`}
            onClick={() => handleSelectOrder(order)}
          >
            <div className="order-card-header">
              <span className="admin-order-title">#{order.orderNumber}</span>
              <span
                className="admin-status-badge"
                style={{ backgroundColor: STATUS_COLORS[order.status] }}
              >
                {order.status}
              </span>
            </div>
            <p className="admin-order-detail">
              Customer: {order.user?.name} ({order.user?.email})
            </p>
            <p className="admin-order-detail">
              Total: ${order.priceBreakdown?.total?.toFixed(2)}
            </p>
            <p className="admin-order-detail">
              Placed: {new Date(order.createdAt).toLocaleDateString()}
            </p>

            {/* Inline update form for selected order */}
            {selectedOrder?._id === order._id && (
              <div className="order-update-panel" onClick={(e) => e.stopPropagation()}>
                {nextStatuses.length > 0 ? (
                  <form className="admin-form" onSubmit={handleSubmit}>
                    <label className="admin-form-label">
                      New Status
                      <select
                        className="admin-select"
                        value={statusForm.status}
                        onChange={(e) =>
                          setStatusForm((prev) => ({ ...prev, status: e.target.value }))
                        }
                        required
                      >
                        <option value="">— Select —</option>
                        {nextStatuses.map((s) => (
                          <option key={s} value={s}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </option>
                        ))}
                      </select>
                    </label>

                    {statusForm.status === "shipped" && (
                      <>
                        <label className="admin-form-label">
                          Tracking Number
                          <input
                            className="admin-input"
                            type="text"
                            value={statusForm.trackingNumber}
                            onChange={(e) =>
                              setStatusForm((prev) => ({ ...prev, trackingNumber: e.target.value }))
                            }
                            placeholder="e.g. 1Z999AA10123456784"
                          />
                        </label>
                        <label className="admin-form-label">
                          Carrier
                          <input
                            className="admin-input"
                            type="text"
                            value={statusForm.carrier}
                            onChange={(e) =>
                              setStatusForm((prev) => ({ ...prev, carrier: e.target.value }))
                            }
                            placeholder="e.g. UPS, FedEx"
                          />
                        </label>
                      </>
                    )}

                    <label className="admin-form-label">
                      Admin Notes
                      <input
                        className="admin-input"
                        type="text"
                        value={statusForm.notes}
                        onChange={(e) =>
                          setStatusForm((prev) => ({ ...prev, notes: e.target.value }))
                        }
                        placeholder="Optional"
                      />
                    </label>

                    {updateError && <p className="admin-error">Failed to update status.</p>}

                    <div className="order-update-actions">
                      <button
                        type="button"
                        className="admin-card-btn admin-card-btn-edit"
                        onClick={() => setSelectedOrder(null)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="admin-form-submit"
                        disabled={!statusForm.status || isPending}
                      >
                        {isPending ? "Updating..." : "Update Status"}
                      </button>
                    </div>
                  </form>
                ) : (
                  <p className="admin-muted">No further status updates available.</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderList;
