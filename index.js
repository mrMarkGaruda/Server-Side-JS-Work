require("dotenv").config(); // Loads MONGO_URI and other environment variables from .env
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");
const bcrypt = require("bcrypt");

// --- Connect to MongoDB ---
const MONGO_URI = process.env.MONGO_URI;
mongoose.set("strictQuery", true);
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("No DB connection!", err);
    process.exit(1);
  });

// --- Require Models ---
// Ensure these files exist in your models folder as per your project structure.
const User = require("./models/userModel");       // User model (with firstName, lastName, email, password, etc.)
const ArtPrint = require("./models/artPrintModel"); // ArtPrint model (with title, artist, price, description)
const Cart = require("./models/cartModel");         // Cart model (see sample below)

// --- Initialize Express app ---
const app = express();
const port = process.env.PORT || 5000;

// --- Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup sessions for user authentication
app.use(
  session({
    secret: "secret-key", // Change this secret for production!
    resave: false,
    saveUninitialized: true,
  })
);

// Serve static assets (if you have any in a public folder)
app.use(express.static(path.join(__dirname, "public")));

// --- Helper Middleware to inject user info into responses ---
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// --- Routes ---

// Home Page
app.get("/", (req, res) => {
  const user = req.session.user;
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Art Print Store</title>
      <style>
         body { font-family: Arial, sans-serif; margin: 0; padding: 0; background: #f4f4f4; }
         .header { background: #333; color: #fff; padding: 10px 20px; }
         .nav a { color: #fff; margin-right: 15px; text-decoration: none; }
         .container { padding: 20px; }
         .footer { background: #333; color: #fff; text-align: center; padding: 10px; position: fixed; bottom: 0; width: 100%; }
         .btn { background: #333; color: #fff; padding: 10px 15px; text-decoration: none; border-radius: 3px; }
      </style>
    </head>
    <body>
      <div class="header">
         <h1>Art Print Store</h1>
         <div class="nav">
           <a href="/">Home</a>
           <a href="/artprints">Art Prints</a>
           ${user ? `<a href="/cart">Cart</a> <a href="/logout">Logout (${user.firstName})</a>` 
                   : `<a href="/login">Login</a> <a href="/signup">Sign Up</a>`}
         </div>
      </div>
      <div class="container">
         <h2>Welcome to the Art Print Store</h2>
         <p>Discover unique art prints to beautify your space.</p>
      </div>
      <div class="footer">© 2025 Art Print Store</div>
    </body>
    </html>
  `);
});

// ----- USER AUTHENTICATION -----

// GET Sign Up form
app.get("/signup", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Sign Up - Art Print Store</title>
      <style>
         body { font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px; }
         form { background: #fff; padding: 20px; max-width: 400px; margin: 20px auto; border-radius: 5px; }
         input { display: block; width: 100%; padding: 10px; margin-bottom: 10px; }
         .btn { background: #333; color: #fff; padding: 10px; border: none; width: 100%; cursor: pointer; }
      </style>
    </head>
    <body>
      <h2 style="text-align:center;">Sign Up</h2>
      <form method="POST" action="/signup">
        <input type="text" name="firstName" placeholder="First Name" required />
        <input type="text" name="lastName" placeholder="Last Name" required />
        <input type="email" name="email" placeholder="Email" required />
        <input type="password" name="password" placeholder="Password" required />
        <button class="btn" type="submit">Sign Up</button>
      </form>
      <p style="text-align:center;">Already have an account? <a href="/login">Login here</a>.</p>
    </body>
    </html>
  `);
});

// POST Sign Up
app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.send("User already exists. <a href='/signup'>Try again</a>.");
    }
    // Hash password and create user
    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({ firstName, lastName, email, password: hashed });
    await newUser.save();
    req.session.user = newUser;
    res.redirect("/");
  } catch (err) {
    console.error("Error during sign up:", err);
    res.send("Error during sign up. Please try again.");
  }
});

// GET Login form
app.get("/login", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Login - Art Print Store</title>
      <style>
         body { font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px; }
         form { background: #fff; padding: 20px; max-width: 400px; margin: 20px auto; border-radius: 5px; }
         input { display: block; width: 100%; padding: 10px; margin-bottom: 10px; }
         .btn { background: #333; color: #fff; padding: 10px; border: none; width: 100%; cursor: pointer; }
      </style>
    </head>
    <body>
      <h2 style="text-align:center;">Login</h2>
      <form method="POST" action="/login">
        <input type="email" name="email" placeholder="Email" required />
        <input type="password" name="password" placeholder="Password" required />
        <button class="btn" type="submit">Login</button>
      </form>
      <p style="text-align:center;">Don't have an account? <a href="/signup">Sign up here</a>.</p>
    </body>
    </html>
  `);
});

// POST Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.send("Invalid credentials. <a href='/login'>Try again</a>.");
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.send("Invalid credentials. <a href='/login'>Try again</a>.");
    req.session.user = user;
    res.redirect("/");
  } catch (err) {
    console.error("Error during login:", err);
    res.send("Error during login. Please try again.");
  }
});

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

// ----- ART PRINTS -----

// List all Art Prints
app.get("/artprints", async (req, res) => {
  try {
    const prints = await ArtPrint.find();
    const printsHtml = prints
      .map(
        (print) => `
      <div style="border: 1px solid #ddd; padding: 10px; margin-bottom: 10px; background: #fff;">
        <h3>${print.title}</h3>
        <p>Artist: ${print.artist}</p>
        <p>Price: $${print.price.toFixed(2)}</p>
        <p>${print.description}</p>
        <a class="btn" href="/artprints/${print._id}">View Details</a>
      </div>
    `
      )
      .join("");
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Art Prints - Art Print Store</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; background: #f4f4f4; }
          .btn { background: #333; color: #fff; padding: 8px 12px; text-decoration: none; border-radius: 3px; }
        </style>
      </head>
      <body>
        <h2>Art Prints</h2>
        ${printsHtml}
        <a class="btn" href="/">Back to Home</a>
      </body>
      </html>
    `);
  } catch (err) {
    console.error("Error fetching art prints:", err);
    res.send("Error fetching art prints.");
  }
});

// Art Print Details with Add-to-Cart form
app.get("/artprints/:id", async (req, res) => {
  try {
    const print = await ArtPrint.findById(req.params.id);
    if (!print) return res.send("Art Print not found.");
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${print.title} - Art Print Store</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; background: #f4f4f4; }
          .btn { background: #333; color: #fff; padding: 8px 12px; text-decoration: none; border-radius: 3px; }
          form { margin-top: 20px; }
          input { padding: 10px; margin-right: 10px; }
        </style>
      </head>
      <body>
        <h2>${print.title}</h2>
        <p><strong>Artist:</strong> ${print.artist}</p>
        <p><strong>Price:</strong> $${print.price.toFixed(2)}</p>
        <p>${print.description}</p>
        <form method="POST" action="/cart/add">
          <input type="hidden" name="printId" value="${print._id}" />
          <input type="number" name="quantity" value="1" min="1" required />
          <button class="btn" type="submit">Add to Cart</button>
        </form>
        <a class="btn" href="/artprints">Back to Art Prints</a>
      </body>
      </html>
    `);
  } catch (err) {
    console.error("Error fetching art print details:", err);
    res.send("Error fetching art print details.");
  }
});

// ----- CART -----

// Add to Cart (POST)
app.post("/cart/add", async (req, res) => {
  try {
    if (!req.session.user)
      return res.send("You need to log in to add items to your cart. <a href='/login'>Login</a>");
    const userId = req.session.user._id;
    const { printId, quantity } = req.body;
    const print = await ArtPrint.findById(printId);
    if (!print) return res.send("Art Print not found.");
    // Find or create cart for user
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, cartItems: [] });
    }
    // Check if item is already in the cart
    const existingItem = cart.cartItems.find(
      (item) => item.print.toString() === printId
    );
    if (existingItem) {
      existingItem.quantity += parseInt(quantity);
    } else {
      cart.cartItems.push({ print: printId, quantity: parseInt(quantity), price: print.price });
    }
    await cart.save();
    res.redirect("/cart");
  } catch (err) {
    console.error("Error adding to cart:", err);
    res.send("Error adding to cart.");
  }
});

// View Cart
app.get("/cart", async (req, res) => {
  try {
    if (!req.session.user)
      return res.send("You need to log in to view your cart. <a href='/login'>Login</a>");
    const userId = req.session.user._id;
    const cart = await Cart.findOne({ user: userId }).populate("cartItems.print");
    let itemsHtml = "";
    if (cart && cart.cartItems.length > 0) {
      itemsHtml = cart.cartItems
        .map(
          (item) => `
        <div style="border: 1px solid #ddd; padding: 10px; margin-bottom: 10px; background: #fff;">
          <h3>${item.print.title}</h3>
          <p>Quantity: ${item.quantity}</p>
          <p>Total Price: $${(item.price * item.quantity).toFixed(2)}</p>
        </div>
      `
        )
        .join("");
    } else {
      itemsHtml = "<p>Your cart is empty.</p>";
    }
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Your Cart - Art Print Store</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; background: #f4f4f4; }
          .btn { background: #333; color: #fff; padding: 8px 12px; text-decoration: none; border-radius: 3px; }
        </style>
      </head>
      <body>
        <h2>Your Cart</h2>
        ${itemsHtml}
        <a class="btn" href="/artprints">Continue Shopping</a>
      </body>
      </html>
    `);
  } catch (err) {
    console.error("Error viewing cart:", err);
    res.send("Error viewing cart.");
  }
});

// --- Start the Server ---
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
