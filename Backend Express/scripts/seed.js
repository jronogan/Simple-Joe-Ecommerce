import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import connectDB from "../db/db.js";
import User from "../models/User.js";
import Address from "../models/Address.js";
import Category from "../models/Category.js";
import Product from "../models/Product.js";

dotenv.config();
await connectDB();

// ── Clear existing data ────────────────────────────────────────────
await Promise.all([
  User.deleteMany(),
  Address.deleteMany(),
  Category.deleteMany(),
  Product.deleteMany(),
]);
console.log("Cleared existing data");

// ── Categories ─────────────────────────────────────────────────────
const electronics = await Category.create({ name: "Electronics", path: "electronics" });
const clothing    = await Category.create({ name: "Clothing",    path: "clothing" });

const phones  = await Category.create({ name: "Phones",   parent: electronics._id, path: "electronics>phones" });
const laptops = await Category.create({ name: "Laptops",  parent: electronics._id, path: "electronics>laptops" });
const mens    = await Category.create({ name: "Men's",    parent: clothing._id,    path: "clothing>mens" });
const womens  = await Category.create({ name: "Women's",  parent: clothing._id,    path: "clothing>womens" });

console.log("Categories seeded");

// ── Users ──────────────────────────────────────────────────────────
const hashedPassword = await bcrypt.hash("password123", 10);

const [admin, user1, user2] = await User.insertMany([
  { name: "Admin User",  email: "admin@store.com",  password: hashedPassword, role: "admin" },
  { name: "Jane Smith",  email: "jane@example.com",  password: hashedPassword, role: "user" },
  { name: "John Doe",    email: "john@example.com",  password: hashedPassword, role: "user" },
]);

console.log("Users seeded");

// ── Addresses ──────────────────────────────────────────────────────
const [addr1, addr2, addr3] = await Address.insertMany([
  {
    addressLine1: "1 Admin Road",
    city: "San Francisco",
    state: "CA",
    postalCode: "94102",
    country: "US",
    phone: "415-000-0001",
    user: admin._id,
  },
  {
    addressLine1: "42 Maple Avenue",
    addressLine2: "Apt 3B",
    city: "New York",
    state: "NY",
    postalCode: "10001",
    country: "US",
    phone: "212-000-0002",
    user: user1._id,
  },
  {
    addressLine1: "7 Oak Street",
    city: "Austin",
    state: "TX",
    postalCode: "73301",
    country: "US",
    phone: "512-000-0003",
    user: user2._id,
  },
]);

await admin.updateOne({ address: [addr1._id] });
await user1.updateOne({ address: [addr1._id] });
await user2.updateOne({ address: [addr2._id] });

console.log("Addresses seeded");

// ── Products ───────────────────────────────────────────────────────
await Product.insertMany([
  // Phones
  {
    name: "iPhone 15 Pro",
    description: "Apple iPhone 15 Pro with A17 Bionic chip, titanium design, and 48MP camera system.",
    price: 999,
    stockQuantity: 50,
    category: phones._id,
    images: ["https://picsum.photos/seed/iphone15pro/400/400"],
  },
  {
    name: "Samsung Galaxy S24",
    description: "Samsung flagship with Snapdragon 8 Gen 3, 200MP camera, and 7 years of OS updates.",
    price: 849,
    stockQuantity: 40,
    category: phones._id,
    images: ["https://picsum.photos/seed/galaxys24/400/400"],
  },
  {
    name: "Google Pixel 8 Pro",
    description: "Google Tensor G3 chip, best-in-class AI photography, and 7 years of updates.",
    price: 799,
    stockQuantity: 35,
    category: phones._id,
    images: ["https://picsum.photos/seed/pixel8pro/400/400"],
  },
  {
    name: "OnePlus 12",
    description: "Snapdragon 8 Gen 3, 100W fast charging, and Hasselblad-tuned triple camera.",
    price: 699,
    stockQuantity: 45,
    category: phones._id,
    images: ["https://picsum.photos/seed/oneplus12/400/400"],
  },
  {
    name: "Sony Xperia 1 VI",
    description: "4K OLED display, professional-grade camera with variable telephoto lens.",
    price: 1299,
    stockQuantity: 20,
    category: phones._id,
    images: ["https://picsum.photos/seed/xperia1vi/400/400"],
  },
  // Laptops
  {
    name: "MacBook Pro 14\"",
    description: "Apple M3 Pro chip, 18GB unified memory, 512GB SSD, Liquid Retina XDR display.",
    price: 1999,
    stockQuantity: 20,
    category: laptops._id,
    images: ["https://picsum.photos/seed/macbookpro14/400/400"],
  },
  {
    name: "Dell XPS 15",
    description: "Intel Core i7-13700H, 16GB DDR5, 512GB SSD, OLED touch display.",
    price: 1499,
    stockQuantity: 25,
    category: laptops._id,
    images: ["https://picsum.photos/seed/dellxps15/400/400"],
  },
  {
    name: "Lenovo ThinkPad X1 Carbon",
    description: "Ultra-lightweight business laptop with Intel Core Ultra 7 and 32GB RAM.",
    price: 1799,
    stockQuantity: 18,
    category: laptops._id,
    images: ["https://picsum.photos/seed/thinkpadx1/400/400"],
  },
  {
    name: "ASUS ROG Zephyrus G14",
    description: "AMD Ryzen 9, RTX 4060, 165Hz QHD display, built for gaming and creators.",
    price: 1599,
    stockQuantity: 22,
    category: laptops._id,
    images: ["https://picsum.photos/seed/rogzephyrus/400/400"],
  },
  {
    name: "HP Spectre x360",
    description: "2-in-1 convertible with Intel Core Ultra 5, OLED touch display, and 17-hour battery.",
    price: 1399,
    stockQuantity: 30,
    category: laptops._id,
    images: ["https://picsum.photos/seed/hpspectrex360/400/400"],
  },
  // Men's
  {
    name: "Men's Classic T-Shirt",
    description: "100% organic cotton crew neck t-shirt, pre-shrunk and fade-resistant.",
    price: 29,
    stockQuantity: 200,
    category: mens._id,
    images: ["https://picsum.photos/seed/menstshirt/400/400"],
  },
  {
    name: "Men's Slim Chinos",
    description: "Stretch slim-fit chino trousers in a wrinkle-resistant cotton blend.",
    price: 59,
    stockQuantity: 150,
    category: mens._id,
    images: ["https://picsum.photos/seed/menschinos/400/400"],
  },
  {
    name: "Men's Oxford Shirt",
    description: "Classic button-down Oxford shirt in brushed cotton, tailored fit.",
    price: 49,
    stockQuantity: 130,
    category: mens._id,
    images: ["https://picsum.photos/seed/mensoxford/400/400"],
  },
  {
    name: "Men's Wool Blazer",
    description: "Single-breasted Italian wool blazer with notch lapel, slim cut.",
    price: 199,
    stockQuantity: 60,
    category: mens._id,
    images: ["https://picsum.photos/seed/mensblazer/400/400"],
  },
  {
    name: "Men's Running Shoes",
    description: "Lightweight mesh upper with responsive foam midsole, ideal for road running.",
    price: 119,
    stockQuantity: 90,
    category: mens._id,
    images: ["https://picsum.photos/seed/mensrunners/400/400"],
  },
  // Women's
  {
    name: "Women's Linen Dress",
    description: "Relaxed-fit midi dress in 100% European linen, perfect for warm weather.",
    price: 79,
    stockQuantity: 120,
    category: womens._id,
    images: ["https://picsum.photos/seed/womenslinen/400/400"],
  },
  {
    name: "Women's Running Jacket",
    description: "Windproof and water-resistant lightweight running jacket with reflective details.",
    price: 89,
    stockQuantity: 80,
    category: womens._id,
    images: ["https://picsum.photos/seed/womensrunnjacket/400/400"],
  },
  {
    name: "Women's Knit Sweater",
    description: "Merino wool crewneck sweater, ribbed cuffs and hem, available in six colours.",
    price: 99,
    stockQuantity: 110,
    category: womens._id,
    images: ["https://picsum.photos/seed/womensknit/400/400"],
  },
  {
    name: "Women's High-Waist Jeans",
    description: "Stretch denim high-waist straight-leg jeans with a classic five-pocket design.",
    price: 69,
    stockQuantity: 140,
    category: womens._id,
    images: ["https://picsum.photos/seed/womensjeans/400/400"],
  },
  {
    name: "Women's Leather Tote",
    description: "Full-grain leather tote with interior zip pocket and adjustable shoulder strap.",
    price: 149,
    stockQuantity: 50,
    category: womens._id,
    images: ["https://picsum.photos/seed/womenstote/400/400"],
  },
]);

console.log("Products seeded");

// ── Done ───────────────────────────────────────────────────────────
console.log("\nSeed complete:");
console.log("  admin@store.com  / password123  (admin)");
console.log("  jane@example.com / password123  (user)");
console.log("  john@example.com / password123  (user)");

await mongoose.disconnect();
process.exit(0);
