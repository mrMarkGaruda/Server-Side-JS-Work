require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const ArtPrint = require("./models/artPrintModel");
const User = require("./models/userModel");
const Cart = require("./models/cartModel");
const Order = require("./models/orderModel");
const Review = require("./models/reviewModel");

mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch((err) => {
  console.error("No DB connection!", err);
  process.exit(1);
});

const seedDatabase = async () => {
  try {
    // Drop the database to start fresh
    await mongoose.connection.dropDatabase();

    // Hash sample passwords
    const hashedPassword1 = bcrypt.hashSync("password123", 10);
    const hashedPassword2 = bcrypt.hashSync("password123", 10);

    // Users
    const users = await User.insertMany([
      { firstName: "John", lastName: "Doe", email: "john@example.com", password: hashedPassword1 },
      { firstName: "Jane", lastName: "Smith", email: "jane@example.com", password: hashedPassword2 },
    ]);

    // Art Prints
    const prints = await ArtPrint.insertMany([
      { 
        title: "Abstract Sunset", 
        artist: "John Doe", 
        price: 49.99, 
        description: "A beautiful abstract interpretation of a sunset.",
        imageUrl: "https://imgs.search.brave.com/o5H7f6I8t6DrRE5BVO814i2vP5z4MP7HHgysxGRJ0Tc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2U5LzJk/Lzg0L2U5MmQ4NGIy/NDI3NTcxODgzNDcy/MzAyZDAzMmM4YjZj/LmpwZw" 
      },
      { 
        title: "Ocean Waves", 
        artist: "Jane Smith", 
        price: 39.99, 
        description: "Capturing the dynamic motion of the ocean in this striking piece.",
        imageUrl: "https://imgs.search.brave.com/FXd1fmbL4jBDX5oCkLfziBYxiBzW1mZI6xW6BCw293A/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2EzL2Q0/LzVkL2EzZDQ1ZDMy/Njg3MDViY2Q1NTYx/ZjJiZGVjNTY0NmMy/LmpwZw" 
      },
      {
        title: "Forest Serenity",
        artist: "Emily White",
        price: 59.99,
        description: "A tranquil depiction of a dense forest enveloped in morning mist.",
        imageUrl: "https://imgs.search.brave.com/py4CykR1rSMr1A_tmKbfvExJBpTp13CW7I0BfLwAG1o/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuc3F1YXJlc3Bh/Y2UtY2RuLmNvbS9j/b250ZW50L3YxLzU2/YjRkOTIzM2M0NGQ4/ZjE0YTNkNzgyOS8x/NTg4MTcyNjE1Mzcz/LUpOU1oyS0JXTENV/VUlURzJTUFU3L21p/c3R5K2ZvcmVzdCtw/YWludGluZy5qcGc"
      },
      {
        title: "City Skyline at Dusk",
        artist: "Michael Brown",
        price: 69.99,
        description: "A vibrant city skyline illuminated by the setting sun.",
        imageUrl: "https://imgs.search.brave.com/0aXlbzgmKVzBJY1MPl7_v35sSU7MHehBfrk8z4HCt2w/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2ViLzhi/L2RmL2ViOGJkZmE4/NDVkMGIwZDgxZDI5/ODg3OTExMzk0ZWEy/LmpwZw"
      },
      {
        title: "Mountain Sunrise",
        artist: "Sarah Green",
        price: 64.99,
        description: "An inspiring view of the sun rising over majestic mountains.",
        imageUrl: "https://imgs.search.brave.com/LXDjxZ7K2IOGbjHw50OnTKW9hlTPJY7xm7y7xufUyGc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9yZW5k/ZXIuZmluZWFydGFt/ZXJpY2EuY29tL2lt/YWdlcy9yZW5kZXJl/ZC9tZWRpdW0vcHJp/bnQvOC83L2JyZWFr/L2ltYWdlcy9hcnR3/b3JraW1hZ2VzL21l/ZGl1bS8xLzEtZmly/c3QtbGlnaHQtc3Rl/dmUtaGVuZGVyc29u/LmpwZw"
      }      
    ]);

    // Reviews
    await Review.insertMany([
      { artPrint: prints[0]._id, user: users[0]._id, rating: 5, comment: "Amazing quality!" },
      { artPrint: prints[1]._id, user: users[1]._id, rating: 4, comment: "Beautiful piece, but took long to ship." },
    ]);

    console.log("Database seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("Seeding failed", error);
    process.exit(1);
  }
};

seedDatabase();
