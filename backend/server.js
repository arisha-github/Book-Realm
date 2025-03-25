const express = require("express");
const mongoose = require("mongoose");
const nodemailer= require("nodemailer")
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const stripe = require('stripe')('sk_test_51N0J2bIziJSDklw4hCJNIYNDGpWUBO4mn06jO5r0JQaISni6kNQapr9y3mKn95cBclrQv1aYMyK1yVooJJVCMzba006fN4udv2'); 
const { decrypt } = require("dotenv");
require("dotenv").config();
const otpGenerator = require("otp-generator");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());


const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
}));

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/mydb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));
  
  const userSchema = new mongoose.Schema({
    dob: { type: Date, required: true },
    email: { type: String, required: true, unique: true }, // Unique email
    password: { type: String, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    role: { type: String, default: "user" }, // Default role
  });
  
  const User = mongoose.model("User", userSchema);


  const orderSchema = new mongoose.Schema({
      userEmail: {
        type: String,
        required: true, 
      },
      items: [{
        book_id: String,
        title: String,
        quantity: Number,
        price: Number,
        image: String,
      }],
      totalAmount: {
        type: Number,
        required: true, 
      },
      status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending',
      },
      orderId: {
        type: String,
        required: true, 
      },
    }, { timestamps: true });

    const Order = mongoose.model('Order', orderSchema);

// registration with otp

    const otpStorage = {}; // Temporary storage for OTPs
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "arishasif2001@gmail.com", 
        pass: "gdrnrkbhjhdbzreh", 
      },
    });
// Email endpoint
app.post("/send-email", (req, res) => {
  console.log("Received data:", req.body); // Debugging
  const { name, phone, email, message } = req.body;

  // Validate request body
  if (!name || !phone || !email || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }
//sending email to gmail for contact us page
  const mailOptions = {
    from: email,
    to: "arishasif2001@gmail.com",
    subject: "New Contact Form Submission",
    html: `
      <div style="font-family: Arial, sans-serif; border: 1px solid #ddd; border-radius: 10px; padding: 20px; max-width: 600px; margin: auto; background-color: #f9f9f9;">
        <h2 style="text-align: center; color: #333;">New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <div style="border: 1px solid #ddd; padding: 10px; border-radius: 5px; background-color: #fff; color: #555;">
          ${message}
        </div>
        <footer style="text-align: center; margin-top: 20px; color: #888;">
          <small>Thank you for using our service.</small>
        </footer>
      </div>
    `,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({ error: "Failed to send email." });
    }
    res.json({ message: "Email sent successfully!" });
  });
});

app.post("/register", async (req, res) => {
  const { dob, email, password, firstname, lastname } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // Generate a 6-digit OTP
    const otp = otpGenerator.generate(6, {
      digits: true,
      alphabets: false,
      upperCase: false,
      specialChars: false,
    });

    // Store the OTP temporarily
    otpStorage[email] = otp;

    const mailOptions = {
      from: "arishasif2001@gmail.com",
      to: email,
      subject: "Your OTP for Registration",
      text: `Your OTP for registration is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.post("/verify-otp", async (req, res) => {
  const { email, otp, dob, password, firstname, lastname } = req.body;

  try {
    if (otpStorage[email] !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      dob,
      email,
      password: hashedPassword,
      firstname,
      lastname,
      role: "user", // Default role
    });

    await newUser.save();

    delete otpStorage[email];
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//end


//login code
const jwt = require("jsonwebtoken");
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const secretKey = process.env.JWT_SECRET || "mySuperSecretKey123!"; 

    const token = jwt.sign({ email: user.email }, secretKey, { expiresIn: "1h" }); 
    res.json({
      message: "Login successful",
      user: {
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        token, // Include the JWT token
      },
    });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ error: err.message });
  }
});



//checkout code
const crypto = require('crypto'); 
const { stringify } = require("querystring");

app.post('/create-checkout-session', async (req, res) => {
  const { cartItems } = req.body;
  const token = req.headers.authorization?.split(' ')[1]; 

  if (!token) {
    return res.status(400).json({ error: 'Token is missing' });
  }

  // Decode the JWT token to get the user email
  let userEmail = null;
  try {
    const decoded = jwt.decode(token);
    if (decoded && decoded.email) {
      userEmail = decoded.email;
    } else {
      return res.status(400).json({ error: 'Invalid token' });
    }
  } catch (error) {
    return res.status(400).json({ error: 'Failed to decode token' });
  }

  // Map cart items to Stripe line items
  const lineItems = cartItems.map((item) => ({
    price_data: {
      currency: 'aed',
      product_data: {
        name: item.title,
        images: [item.imageLinks?.thumbnail || '/placeholder-image.png'],
      },
      unit_amount: Math.round(item.price * 100), 
    },
    quantity: item.quantity,
  }));

  try {
    const orderId = crypto.randomBytes(16).toString('hex'); // Random unique order ID

    // Create a Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: 'http://localhost:5173/success', // Redirect URL on success
      cancel_url: 'http://localhost:5173/cancel', // Redirect URL on cancellation
      client_reference_id: orderId, // Store the unique order ID
    });

    // Calculate total amount
    const totalAmount = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const order = new Order({
      userEmail: userEmail,
      orderId: orderId,
      items: cartItems.map((item) => ({
        book_id: item.book_id,
        title: item.title,
        quantity: item.quantity,
        price: item.price,
        image: item.imageLinks?.thumbnail || '/placeholder-image.png', // Ensure proper handling
      })),
      totalAmount: totalAmount,
      status: 'completed',
    });
    

    await order.save(); 

    res.json({ url: session.url }); // Return the session URL to the frontend
  } catch (error) {
    console.error('Error during checkout:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


//profile code for fetching user details.
app.post("/get-user-details", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({
      success: true,
      name: user.firstname,
      email: user.email,
      dob: user.dob,
      role: user.role,
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// code for getting order details of any user

app.post("/get-order-details", async (req, res) => {
  const { email } = req.body

  try {
    const orders = await Order.find({ userEmail: email })

    const orderDetails = orders.map((order) => ({
      orderId: order.orderId,
      userEmail: order.userEmail,
      items: order.items.map((item) => ({
        book_id: item.book_id,
        title: item.title,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
      })),
      totalAmount: order.totalAmount,
      status: order.status,
      createdAt: order.createdAt, // Use createdAt from the Mongoose timestamp
    }))

    res.json({
      success: true,
      orders: orderDetails,
    })
  } catch (error) {
    console.error("Error fetching Order details:", error)
    res.status(500).json({ success: false, message: "Server error" })
  }
});
  

// Change password
app.post("/change-password", async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: "Incorrect current password" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


//code to fetch all books user have purchased.
app.get("/getUserBooks", async (req, res) => {
  const { email } = req.query;
  try {
    const orders = await Order.find({ userEmail: email });
    const userBooks = [];
    orders.forEach(order => {
      const items = order.items;
      items.forEach(item => {
        userBooks.push(item.book_id);
      });
    });
    return res.json({ userBooks });
  } catch (err) {
    console.error("Error fetching user books:", err);
    return res.status(500).json({ error: "Failed to fetch user books" });
  }
});


// book reviews

const reviewSchema = new mongoose.Schema({
  bookId: { type: String, required: true },
  email: { type: String, required: true },
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Review = mongoose.model('Review', reviewSchema);

app.post('/submitreview', async (req, res) => {
  const { bookId, email, name, rating, review } = req.body;

  try {
    const newReview = new Review({
      bookId,
      email,
      name,
      rating,
      review,
      createdAt: new Date(),
    });

    await newReview.save();

    res.status(201).json({ message: 'Review submitted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to submit review.' });
  }
});



app.get("/getReviews", async (req, res) => {
  const { bookId } = req.query;
  console.log("Received bookId:", bookId); // Debugging

  try {
    const reviews = await Review.find({ bookId: bookId });
    console.log("Reviews found in DB:", reviews); // Debugging

    const bookReviews = reviews.map(review => ({
      email: review.email,
      name: review.name,
      rating: review.rating,
      review: review.review,
      createdAt: review.createdAt,
    }));

    res.json({
      success: true,
      reviews: bookReviews,
    });
  } catch (error) {
    console.error("Error fetching Review details:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


app.get("/getUsers", async (req, res) =>{

    const users = await User.find({});

    const userArray = users.map(user => ({
      firstname: user.firstname,
      lastname: user.lastname,
      role: user.role,
      email: user.role,
    }));

    res.json({
      success: true,
      users: userArray,
    });
    

});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


