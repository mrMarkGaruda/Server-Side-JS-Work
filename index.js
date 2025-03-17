const express = require("express");
const path = require("path");
const test = require("./test");
const userRoutes = require("./routes/users");

const app = express();
const port = process.env.PORT || 4000;

// Middleware for parsing JSON request body
app.use(express.json());

// Middleware for JSON parsing
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);

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

// Middleware for calculations
app.use((req, res, next) => {
    const { expression, result } = generateCalculation();
    req.expression = expression;
    req.result = result;
    console.log(`Calculation: ${expression} = ${result}`);
    next();
});

// Serve HTML page
app.get("/", (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Random Calculation</title>
            <link rel="icon" type="image/x-icon" href="/favicon.ico"> 
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    background: linear-gradient(135deg, rgb(240, 66, 89), rgb(187, 34, 139));
                    color: white;
                    font-family: 'Arial', sans-serif;
                    text-align: center;
                }
                .result {
                    font-size: 12vw;
                    font-weight: bold;
                    text-shadow: 4px 4px 15px rgba(0, 0, 0, 0.3);
                }
                .expression {
                    font-size: 2vw;
                    margin-top: 10px;
                    opacity: 0.5;
                    text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
                }
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
