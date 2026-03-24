import { useState } from "react";
import { createPortal } from "react-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserAddress, deleteUserAddress } from "../api/crud";
import AddressForm from "./AddressForm";
import "./AddressCard.css";

const AddressCard = ({ address }) => {
  const queryClient = useQueryClient();
  const [editMode, setEditMode] = useState(false);
  const [editedAddress, setEditedAddress] = useState({
    addressLine1: address.addressLine1,
    addressLine2: address.addressLine2 || "",
    city: address.city,
    state: address.state,
    postalCode: address.postalCode,
    country: address.country,
    phone: address.phone || "",
  });

  const handleChange = (e) => {
    setEditedAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const { mutate: update, isPending: updatePending } = useMutation({
    mutationFn: () => updateUserAddress(address._id, editedAddress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userAddresses"] });
      setEditMode(false);
    },
  });

  const { mutate: remove, isPending: deletePending } = useMutation({
    mutationFn: () => deleteUserAddress(address._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userAddresses"] });
    },
  });

  return (
    <>
      <div className="address-card">
        <p className="address-card-field">Address Line 1: {address.addressLine1}</p>
        {address.addressLine2 && (
          <p className="address-card-field">Address Line 2: {address.addressLine2}</p>
        )}
        <p className="address-card-field">
          City, State, Postal: {address.city}, {address.state} {address.postalCode}
        </p>
        <p className="address-card-field">Phone Number: {address.phone}</p>
        <div className="address-card-actions">
          <button className="address-card-btn" onClick={() => setEditMode(true)}>Edit</button>
          <button className="address-card-btn" onClick={() => remove()} disabled={deletePending}>
            {deletePending ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      {editMode && createPortal(
        <div className="address-edit-overlay" onClick={() => setEditMode(false)}>
          <div className="address-edit-modal" onClick={(e) => e.stopPropagation()}>
            <p className="address-edit-title">Edit Address</p>
            <AddressForm address={editedAddress} onChange={handleChange} />
            <div className="address-edit-actions">
              <button
                className="address-edit-btn address-edit-btn-outline"
                type="button"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </button>
              <button
                className="address-edit-btn address-edit-btn-filled"
                onClick={() => update()}
                disabled={updatePending}
              >
                {updatePending ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>,
        document.getElementById("portal")
      )}
    </>
  );
};

export default AddressCard;
