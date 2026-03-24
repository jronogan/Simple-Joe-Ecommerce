import Address from "../models/Address.js";
import User from "../models/User.js";

// Create address after logged in
export const createAddress = async (req, res) => {
  const { addressLine1, addressLine2, city, postalCode, country, phone } =
    req.body;

  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const address = await Address.create({
      addressLine1,
      addressLine2,
      city,
      postalCode,
      country,
      phone,
      user: user._id,
    });
    await address.save();

    // Add reference to User
    await User.findByIdAndUpdate(user._id, {
      $push: { address: address._id },
    });

    res.status(201).json(address);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get specific user address
export const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({
      user: req.user.userId,
    });
    if (!addresses) {
      return res.status(404).json({ error: "Address not found" });
    }

    res.json(addresses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update specific address
export const updateAddress = async (req, res) => {
  try {
    const address = await Address.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!address) {
      return res.status(404).json({ error: "Address not found" });
    }
    res.json(address);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete address
export const deleteAddress = async (req, res) => {
  try {
    const address = await Address.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });
    if (!address) {
      return res.status(404).json({ error: "Address not found" });
    }

    await User.findByIdAndUpdate(req.user.id, {
      $pull: { addresses: req.params.id },
    });

    res.json({ message: "Address deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
