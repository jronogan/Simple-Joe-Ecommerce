import "./AddressForm.css";

const AddressForm = ({ address, onChange }) => (
  <div className="address-form">
    <input
      className="address-form-input"
      type="text"
      name="addressLine1"
      placeholder="Address Line 1"
      value={address.addressLine1}
      onChange={onChange}
    />
    <input
      className="address-form-input"
      type="text"
      name="addressLine2"
      placeholder="Address Line 2"
      value={address.addressLine2}
      onChange={onChange}
    />
    <input
      className="address-form-input"
      type="text"
      name="city"
      placeholder="City"
      value={address.city}
      onChange={onChange}
    />
    <input
      className="address-form-input"
      type="text"
      name="state"
      placeholder="State"
      value={address.state}
      onChange={onChange}
    />
    <input
      className="address-form-input"
      type="text"
      name="postalCode"
      placeholder="Postal Code"
      value={address.postalCode}
      onChange={onChange}
    />
    <input
      className="address-form-input"
      type="text"
      name="country"
      placeholder="Country"
      value={address.country}
      onChange={onChange}
    />
    <input
      className="address-form-input"
      type="tel"
      name="phone"
      placeholder="Phone"
      value={address.phone}
      onChange={onChange}
    />
  </div>
);

export default AddressForm;
