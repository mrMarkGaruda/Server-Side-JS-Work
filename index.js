require("dotenv").config(); // Loads environment variables from .env
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
const User = require("./models/userModel");       // User model (with timestamps, unique email, etc.)
const ArtPrint = require("./models/artPrintModel"); // Art Print model (including imageUrl field)
const Cart = require("./models/cartModel");         // Cart model

// --- Initialize Express app ---
const app = express();
const port = process.env.PORT || 5000;

// --- Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup sessions for user authentication
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

// Serve static assets from the public folder and uploaded images
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Helper middleware: inject user info into res.locals
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

/**
 * Helper function to render a full HTML page.
 * It uses the session data from req to display the proper header links.
 */
function renderPage(req, res, title, bodyContent) {
  // Use req.session.user directly
  const user = req.session.user;
  return res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title} - Art Print Store</title>
      <link rel="stylesheet" href="/styles.css">
    </head>
    <body>
      <header class="header">
        <div class="container header-container">
          <h1 class="logo">Art Print Store</h1>
          <nav class="nav">
            <a href="/">Home</a>
            <a href="/artprints">Art Prints</a>
            ${user 
              ? `<a href="/cart" class="btn">Cart</a>
                 <a href="/logout" class="btn">Logout (${user.firstName})</a>`
              : `<a href="/login" class="btn">Login</a>
                 <a href="/signup" class="btn">Sign Up</a>`
            }
          </nav>
        </div>
      </header>
      <main class="container">
        ${bodyContent}
      </main>
      <footer class="footer">
        <div class="container">
          <p>© 2025 Art Print Store. All rights reserved.</p>
        </div>
      </footer>
    </body>
    </html>
  `);
}

// --- Routes ---

// Home Page
app.get("/", (req, res) => {
  const content = `
    <section class="hero">
      <h2>Discover Unique Art Prints</h2>
      <p>Bring creativity and inspiration to your space.</p>
    </section>
    <section class="intro">
      <p>Welcome to our Art Print Store. Browse our curated collection and find the perfect art for your home or office.</p>
    </section>
  `;
  renderPage(req, res, "Home", content);
});

// ----- USER AUTHENTICATION ROUTES -----

// GET Sign Up form
app.get("/signup", (req, res) => {
  const content = `
    <form class="auth-form" method="POST" action="/signup">
      <h2>Sign Up</h2>
      <input type="text" name="firstName" placeholder="First Name" required />
      <input type="text" name="lastName" placeholder="Last Name" required />
      <input type="email" name="email" placeholder="Email" required />
      <input type="password" name="password" placeholder="Password" required />
      <button class="btn" type="submit">Sign Up</button>
      <p>Already have an account? <a href="/login">Login here</a>.</p>
    </form>
  `;
  renderPage(req, res, "Sign Up", content);
});

// POST Sign Up
app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).send("All fields are required. <a href='/signup'>Go back</a>.");
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).send("User already exists. <a href='/signup'>Try again</a>.");
    }
    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({ firstName, lastName, email, password: hashed });
    await newUser.save();
    req.session.user = newUser;
    res.redirect("/");
  } catch (err) {
    console.error("Error during sign up:", err);
    res.status(500).send("Error during sign up. Please try again.");
  }
});

// GET Login form
app.get("/login", (req, res) => {
  const content = `
    <form class="auth-form" method="POST" action="/login">
      <h2>Login</h2>
      <input type="email" name="email" placeholder="Email" required />
      <input type="password" name="password" placeholder="Password" required />
      <button class="btn" type="submit">Login</button>
      <p>Don't have an account? <a href="/signup">Sign up here</a>.</p>
    </form>
  `;
  renderPage(req, res, "Login", content);
});

// POST Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).send("Email and password are required. <a href='/login'>Try again</a>.");
    const user = await User.findOne({ email });
    if (!user) return res.status(401).send("Invalid credentials. <a href='/login'>Try again</a>.");
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).send("Invalid credentials. <a href='/login'>Try again</a>.");
    req.session.user = user;
    res.redirect("/");
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).send("Error during login. Please try again.");
  }
});

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

// ----- ART PRINTS ROUTES -----

// List all Art Prints
app.get("/artprints", async (req, res) => {
  try {
    const prints = await ArtPrint.find();
    const printsHtml = prints.map(print => `
      <div class="print-card">
        <img src="${print.imageUrl}" alt="${print.title}">
        <div class="card-content">
          <h3>${print.title}</h3>
          <p>Artist: ${print.artist}</p>
          <p>Price: $${print.price.toFixed(2)}</p>
          <p>${print.description}</p>
          <a class="btn" href="/artprints/${print._id}">View Details</a>
        </div>
      </div>
    `).join("");
    const content = `
      <h2>Art Prints</h2>
      <div class="artprints-list">${printsHtml}</div>
      <a class="btn" href="/">Back to Home</a>
    `;
    renderPage(req, res, "Art Prints", content);
  } catch (err) {
    console.error("Error fetching art prints:", err);
    res.status(500).send("Error fetching art prints.");
  }
});

// Art Print Details with Add-to-Cart form
app.get("/artprints/:id", async (req, res) => {
  try {
    const print = await ArtPrint.findById(req.params.id);
    if (!print) return res.status(404).send("Art Print not found.");
    const content = `
      <div class="print-detail">
        <img src="${print.imageUrl}" alt="${print.title}">
        <h2>${print.title}</h2>
        <p><strong>Artist:</strong> ${print.artist}</p>
        <p><strong>Price:</strong> $${print.price.toFixed(2)}</p>
        <p>${print.description}</p>
        <form method="POST" action="/cart/add">
          <input type="hidden" name="printId" value="${print._id}">
          <input type="number" name="quantity" value="1" min="1" required>
          <button class="btn" type="submit">Add to Cart</button>
        </form>
        <a class="btn" href="/artprints">Back to Art Prints</a>
      </div>
    `;
    renderPage(req, res, print.title, content);
  } catch (err) {
    console.error("Error fetching art print details:", err);
    res.status(500).send("Error fetching art print details.");
  }
});

// ----- CART ROUTES -----

// Add to Cart (POST)
app.post("/cart/add", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).send("You need to log in to add items to your cart. <a href='/login'>Login</a>");
    }
    const userId = req.session.user._id;
    const { printId, quantity } = req.body;
    const print = await ArtPrint.findById(printId);
    if (!print) return res.status(404).send("Art Print not found.");
    
    // Find or create a cart for the user
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, cartItems: [] });
    }
    // Check if item already exists in the cart
    const existingItem = cart.cartItems.find(item => item.print.toString() === printId);
    if (existingItem) {
      existingItem.quantity += parseInt(quantity);
    } else {
      cart.cartItems.push({ print: printId, quantity: parseInt(quantity), price: print.price });
    }
    await cart.save();
    res.redirect("/cart");
  } catch (err) {
    console.error("Error adding to cart:", err);
    res.status(500).send("Error adding to cart.");
  }
});

// View Cart
app.get("/cart", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).send("You need to log in to view your cart. <a href='/login'>Login</a>");
    }
    const userId = req.session.user._id;
    const cart = await Cart.findOne({ user: userId }).populate("cartItems.print");
    let itemsHtml = "";
    if (cart && cart.cartItems.length > 0) {
      itemsHtml = cart.cartItems.map(item => `
        <div class="cart-item">
          <h3>${item.print.title}</h3>
          <p>Quantity: ${item.quantity}</p>
          <p>Total Price: $${(item.price * item.quantity).toFixed(2)}</p>
        </div>
      `).join("");
    } else {
      itemsHtml = "<p>Your cart is empty.</p>";
    }
    const content = `
      <h2>Your Cart</h2>
      ${itemsHtml}
      <a class="btn" href="/artprints">Continue Shopping</a>
    `;
    renderPage(req, res, "Cart", content);
  } catch (err) {
    console.error("Error viewing cart:", err);
    res.status(500).send("Error viewing cart.");
  }
});

// --- Start the Server ---
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
