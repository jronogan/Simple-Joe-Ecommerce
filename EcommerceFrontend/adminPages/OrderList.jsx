import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getOneOrder, updateOrderStatus } from "../src/api/crud";

const VALID_TRANSITIONS = {
  pending: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

const OrderList = () => {
  const queryClient = useQueryClient();
  const [inputId, setInputId] = useState("");
  const [searchOrderId, setSearchOrderId] = useState("");
  const [statusForm, setStatusForm] = useState({
    status: "",
    trackingNumber: "",
    carrier: "",
    notes: "",
  });

  const {
    data: order,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["order", searchOrderId],
    queryFn: () => getOneOrder(searchOrderId),
    enabled: !!searchOrderId,
  });

  const { mutate: updateOrder, isPending, isError: updateError } = useMutation({
    mutationFn: (data) => updateOrderStatus(searchOrderId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", searchOrderId] });
      setStatusForm({ status: "", trackingNumber: "", carrier: "", notes: "" });
    },
  });

  const handleSearch = () => {
    if (inputId.trim()) setSearchOrderId(inputId.trim());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { status: statusForm.status };
    if (statusForm.trackingNumber) payload.trackingNumber = statusForm.trackingNumber;
    if (statusForm.carrier) payload.carrier = statusForm.carrier;
    if (statusForm.notes) payload.notes = statusForm.notes;
    updateOrder(payload);
  };

  const nextStatuses = order ? VALID_TRANSITIONS[order.status] ?? [] : [];

  return (
    <div>
      <h2>Order Lookup</h2>
      <div>
        <input
          type="text"
          value={inputId}
          onChange={(e) => setInputId(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Enter Order ID"
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {isLoading && <p>Loading order...</p>}
      {isError && <p>Order not found.</p>}

      {order && (
        <div>
          <h3>Order #{order.orderNumber}</h3>
          <p>Status: <strong>{order.status}</strong></p>
          {order.trackingNumber && <p>Tracking: {order.trackingNumber} ({order.carrier})</p>}
          {order.adminNotes && <p>Notes: {order.adminNotes}</p>}

          {nextStatuses.length > 0 && (
            <form onSubmit={handleSubmit}>
              <label>
                New Status
                <select
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
                  <label>
                    Tracking Number
                    <input
                      type="text"
                      value={statusForm.trackingNumber}
                      onChange={(e) =>
                        setStatusForm((prev) => ({ ...prev, trackingNumber: e.target.value }))
                      }
                      placeholder="e.g. 1Z999AA10123456784"
                    />
                  </label>
                  <label>
                    Carrier
                    <input
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

              <label>
                Admin Notes
                <input
                  type="text"
                  value={statusForm.notes}
                  onChange={(e) =>
                    setStatusForm((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  placeholder="Optional"
                />
              </label>

              {updateError && <p>Failed to update order status.</p>}

              <button type="submit" disabled={!statusForm.status || isPending}>
                {isPending ? "Updating..." : "Update Status"}
              </button>
            </form>
          )}

          {nextStatuses.length === 0 && (
            <p>No further status updates available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderList;
