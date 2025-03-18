require("dotenv").config(); // For MONGO_URI, etc.
const express = require("express");
const path = require("path");
const test = require("./test");
const connectDB = require("./utils/db");

// ROUTE IMPORTS
const userRoutes = require("./routes/users");
const artPrintRoutes = require("./routes/artPrints");
const printVariantRoutes = require("./routes/printVariants");
const cartRoutes = require("./routes/carts");
const wishlistRoutes = require("./routes/wishlists");
const orderRoutes = require("./routes/orders");
const reviewRoutes = require("./routes/reviews");
const discountRoutes = require("./routes/discounts");
const paymentRoutes = require("./routes/payments");
const shipmentRoutes = require("./routes/shipments");

const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware for JSON
app.use(express.json());

// CORS middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

// ============== YOUR ROUTES ==============
app.use("/api/users", userRoutes);
app.use("/api/artprints", artPrintRoutes);
app.use("/api/printvariants", printVariantRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/wishlists", wishlistRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/discounts", discountRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/shipments", shipmentRoutes);

// ============== RANDOM CALCULATION DEMO ==============
// Function to generate a random calculation
function generateCalculation() {
  const num1 = Math.floor(Math.random() * 50) + 1;
  const num2 = Math.floor(Math.random() * 50) + 1;
  const num3 = Math.floor(Math.random() * 10) + 1;
  const operators = ["+", "-", "*", "/"];

  const op1 = operators[Math.floor(Math.random() * operators.length)];
  const op2 = operators[Math.floor(Math.random() * operators.length)];

  const expression = `(${num1} ${op1} ${num2}) ${op2} ${num3}`;
  let result;

  try {
    result = eval(expression).toFixed(2);
  } catch (e) {
    result = "Error";
  }

  return { expression, result };
}

// Calculation middleware
app.use((req, res, next) => {
  const { expression, result } = generateCalculation();
  req.expression = expression;
  req.result = result;
  console.log(`Calculation: ${expression} = ${result}`);
  next();
});

// Root route
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Random Calculation</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          height: 100vh; background: linear-gradient(135deg, rgb(240,66,89), rgb(187,34,139));
          color: white; font-family: 'Arial', sans-serif; text-align: center;
        }
        .result { font-size: 12vw; font-weight: bold; text-shadow: 4px 4px 15px rgba(0,0,0,0.3); }
        .expression { font-size: 2vw; margin-top: 10px; opacity: 0.5; text-shadow: 2px 2px 10px rgba(0,0,0,0.2); }
      </style>
    </head>
    <body>
      <div class="result">${req.result}</div>
      <div class="expression">${req.expression}</div>
    </body>
    </html>
  `);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
