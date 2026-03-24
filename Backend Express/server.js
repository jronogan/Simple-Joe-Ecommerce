import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import connectDB from "./db/db.js";
import categoryRoutes from "./routes/category.js";
import productRoutes from "./routes/product.js";
import userRoutes from "./routes/user.js";
import cartRoutes from "./routes/shoppingCart.js";
import orderRoutes from "./routes/orders.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: "http://localhost:5176",
  credentials: true,
}));
app.use(helmet());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ROUTES
app.use("/categories", categoryRoutes);
app.use("/products", productRoutes);
app.use("/users", userRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);

// Listening PORT
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

// error catching
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    console.error("JSON parsing error:", err.message);

    return res.status(400).json({
      status: 400,
      msg: "invalid JSON format",
    });
  } else if (
    err instanceof SyntaxError &&
    err.status === 400 &&
    err.type === "entity.parse.failed"
  ) {
    console.error("URL-encoded parsing error:", err.message);

    return res.status(400).json({
      status: 400,
      msg: "invalid form data format",
    });
  }

  next(err);
});

app.use((err, req, res, next) => {
  console.error(err.message);
  console.error(err.stack);

  res.status(err.status || 500).json({
    status: "error",
    msg: "an unknown error occurred",
  });
});
