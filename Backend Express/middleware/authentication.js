import jwt from "jsonwebtoken";

// Authenticate user
export const authenticateAccessToken = (req, res, next) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return res
      .status(401)
      .json({ msg: "Unauthorized. Login with your credentials." });
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(403)
      .json({
        msg: "Forbidden. You don't have permission to access this resource.",
      });
  }
};

// Only admin can
export const adminAuthorization = (req, res, next) => {
  const user = req.user;

  if (!user || user.role !== "admin") {
    return res.status(403).json({ msg: "Access denied. Admins only." });
  }

  next();
};
