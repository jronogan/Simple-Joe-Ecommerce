import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAddress,
  getUserAddress,
  getUserProfile,
  updateUserProfile,
} from "../api/crud";
import AddressCard from "../subcomponents/AddressCard";
import AddressForm from "../subcomponents/AddressForm";
import SearchBar from "../subcomponents/SearchBar";
import { useState } from "react";
import { createPortal } from "react-dom";
import { NavLink } from "react-router-dom";
import "./Profile.css";
import { useAuth } from "../authentication/Auth";

const Profile = () => {
  const queryClient = useQueryClient();
  const { logout } = useAuth();

  const [editProfileMode, setEditProfileMode] = useState(false);
  const [editUserDetails, setEditUserDetails] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
  });
  const [addAddressMode, setAddAddressMode] = useState(false);
  const [newAddress, setNewAddress] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  // User Profile Query
  const {
    data: userProfile,
    isPending: profilePending,
    isError: profileError,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
  });

  const {
    mutate: updateProfile,
    isError: updateError,
    isPending: updatePending,
  } = useMutation({
    mutationFn: (data) => updateUserProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      setEditProfileMode(false);
    },
  });

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    updateProfile(editUserDetails);
    setEditProfileMode(false);
  };

  // User Addresses Query
  const {
    data: userAddresses,
    isPending: addressesPending,
    isError: addressesError,
  } = useQuery({
    queryKey: ["userAddresses"],
    queryFn: getUserAddress,
  });

  const handleNewAddressChange = (e) => {
    setNewAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const {
    mutate: addAddress,
    isPending: addAddressPending,
    isError: addAddressError,
  } = useMutation({
    mutationFn: () => createAddress(newAddress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userAddresses"] });
      setAddAddressMode(false);
      setNewAddress({
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
        phone: "",
      });
    },
  });

  if (profilePending || addressesPending) return <div>Loading...</div>;
  if (profileError || addressesError) return <div>Failed to load profile.</div>;

  return (
    <div className="profile-page">
      <SearchBar />

      <div className="profile-content">
        <h1 className="profile-welcome">Welcome, {userProfile.user.name}!</h1>

        <div className="profile-panels">
          {/* Left panel */}
          <div className="profile-left-panel">
            <h2 className="profile-account-title">Account Home</h2>
            <NavLink to="/me" className="profile-nav-link">
              Profile
            </NavLink>
            <NavLink to="/cart" className="profile-nav-link">
              Cart
            </NavLink>
            <NavLink to="/orders" className="profile-nav-link">
              Orders
            </NavLink>
            <button className="profile-nav-logout" onClick={logout}>Logout</button>
          </div>

          {/* Right panel */}
          <div className="profile-right-panel">
            {editProfileMode ? (
              <form className="profile-form" onSubmit={handleUpdateProfile}>
                <input
                  className="profile-input"
                  type="text"
                  name="name"
                  defaultValue={userProfile.user.name}
                  placeholder="Name"
                  onChange={(e) =>
                    setEditUserDetails({
                      ...editUserDetails,
                      name: e.target.value,
                    })
                  }
                />
                <input
                  className="profile-input"
                  type="email"
                  name="email"
                  defaultValue={userProfile.user.email}
                  placeholder="Email"
                  onChange={(e) =>
                    setEditUserDetails({
                      ...editUserDetails,
                      email: e.target.value,
                    })
                  }
                />
                <input
                  className="profile-input"
                  type="password"
                  name="currentPassword"
                  placeholder="Current Password"
                  onChange={(e) =>
                    setEditUserDetails({
                      ...editUserDetails,
                      currentPassword: e.target.value,
                    })
                  }
                />
                <input
                  className="profile-input"
                  type="password"
                  name="newPassword"
                  placeholder="New Password"
                  onChange={(e) =>
                    setEditUserDetails({
                      ...editUserDetails,
                      newPassword: e.target.value,
                    })
                  }
                />
                <div className="profile-form-actions">
                  <button
                    className="profile-btn profile-btn-filled"
                    type="submit"
                    disabled={updatePending}
                  >
                    {updatePending ? "Updating..." : "Update Profile"}
                  </button>
                  <button
                    className="profile-btn profile-btn-outline"
                    type="button"
                    onClick={() => setEditProfileMode(false)}
                  >
                    Cancel
                  </button>
                </div>
                {updateError && (
                  <p className="profile-error">Error updating profile.</p>
                )}
              </form>
            ) : (
              <>
                <div>
                  <span className="profile-field-label">Name</span>
                  <span className="profile-field-value">
                    {userProfile.user.name}
                  </span>
                </div>
                <div>
                  <span className="profile-field-label">Email</span>
                  <span className="profile-field-value">
                    {userProfile.user.email}
                  </span>
                </div>
                <div>
                  <span className="profile-field-label">Address</span>
                  {userAddresses.length === 0 ? (
                    <span className="profile-field-value">
                      No address saved.
                    </span>
                  ) : (
                    <div className="profile-address-list">
                      {userAddresses.map((address) => (
                        <AddressCard key={address._id} address={address} />
                      ))}
                    </div>
                  )}
                </div>
                <div className="profile-actions">
                  <button
                    className="profile-btn profile-btn-filled"
                    onClick={() => setEditProfileMode(true)}
                  >
                    Edit Profile
                  </button>
                  <button
                    className="profile-btn profile-btn-outline"
                    onClick={() => setAddAddressMode(true)}
                  >
                    Add Address
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {addAddressMode && createPortal(
        <div className="address-edit-overlay" onClick={() => setAddAddressMode(false)}>
          <div className="address-edit-modal" onClick={(e) => e.stopPropagation()}>
            <p className="address-edit-title">Add Address</p>
            <AddressForm address={newAddress} onChange={handleNewAddressChange} />
            {addAddressError && (
              <p className="profile-error">Failed to save address.</p>
            )}
            <div className="address-edit-actions">
              <button
                className="address-edit-btn address-edit-btn-outline"
                type="button"
                onClick={() => setAddAddressMode(false)}
              >
                Cancel
              </button>
              <button
                className="address-edit-btn address-edit-btn-filled"
                onClick={() => addAddress()}
                disabled={addAddressPending}
              >
                {addAddressPending ? "Saving..." : "Save Address"}
              </button>
            </div>
          </div>
        </div>,
        document.getElementById("portal")
      )}
    </div>
  );
};

export default Profile;
