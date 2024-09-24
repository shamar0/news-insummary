require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require("mongoose")
const News = require("./init/News")
const User = require("./init/User")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');



app.use(express.json());
app.use(cors()); 

// require('./aajTak');
// require('./hindustan_times');
// require('./inc42');
// require('./the_hindu');
// require('./medical_news');
// require('./health_line');
// require('./indian_express');
// require('./india_today');
// require('./mint');
// require('./business_standard');
// require('./times_of_india');
// require('./news18');
// require('./enviro_india_today');
// require('./ndtv');
// require('./ev');

const PORT = process.env.PORT;

async function main() {
  await mongoose.connect(process.env.MONGO_URL);
}
main().then(res => console.log("connected"));
main().catch(err => console.log(err));

app.listen(PORT , (req, res) => {
  console.log("listening");
})

app.get('/',(req,res)=>{
  res.send("hi");
})

app.get('/news', async (req, res) => {
  try {
    const data = await News.find().sort({ _id: -1 });
    res.status(200).json(data);    
  }
  catch (err) {
    res.status(403).json({ status: false, message: "Error retrieving data from database" });
  }
})

app.get('/user', async (req, res) => {
  try {
    const data = await User.find().sort({ _id: -1 });
    res.status(200).json(data);   
  }
  catch (err) {
    res.status(403).json({ status: false, message: "Error retrieving data from database" });
  }
})
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `http://localhost:8080/auth/google/callback` // or your deployed URL
);

app.post('/auth/google', async (req, res) => {
  const { code } = req.body;
  try {
    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Retrieve user information
    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: 'v2',
    });

    const userInfo = await oauth2.userinfo.get();

    // Check if the user exists or create a new user
    let user = await User.findOne({ username: userInfo.data.email });
    if (!user) {
      user = new User({
        username: userInfo.data.email,
        password: userInfo.data.email, // Store a dummy password or use a hashed token
      });
      await user.save();
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.json({ token, user });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ message: 'Authentication failed' });
  }
});


app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists', success:false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({
      username,
      password: hashedPassword
    });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });

    const { password: _, ...userWithoutPassword } = user.toObject();
    res.status(201).json({ user: userWithoutPassword, token, success:true });
  } catch (error) {
    res.status(500).json({ message: 'Error creating new user', error: error.message });
  }
});



// Login User
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    // const user = await User.findOne({ username });
    let user = await User.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
      user = await User.findOne({ username }).select('-password');
      res.json({user, token, success:true });
    } else {
      res.status(401).json({ message: 'Invalid credentials', success:false });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token is missing' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token', success:false });
    }
    req.user = user;
    next();
  });
};
app.get('/check-auth', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


app.post('/users/save-article', authenticateToken, async (req, res) => {
  const { articleId } = req.body;
  try {
    const articleExists = await News.findById(articleId);
    if (!articleExists) {
      return res.status(404).json({ message: 'Article not found' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.savedArticles.includes(articleId)) {
      user.savedArticles.push(articleId);
      await user.save();
    }

    res.status(200).json({ message: 'Article saved successfully', savedArticles: user.savedArticles, savedArticleId: articleId, success:true});
  } catch (error) {
    res.status(500).json({ message: error.message, success:false });
  }
});

app.post('/users/remove-article', authenticateToken, async (req, res) => {
  const { articleId } = req.body;
  try {
    const articleExists = await News.findById(articleId);
    if (!articleExists) {
      return res.status(404).json({ message: 'Article not found', success: false });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found', success: false });
    }

    const articleIndex = user.savedArticles.indexOf(articleId);
    if (articleIndex === -1) {
      return res.status(400).json({ message: 'Article not in saved list', success: false });
    }

    user.savedArticles.splice(articleIndex, 1); // Remove the article from the savedArticles array
    await user.save();

    res.status(200).json({ message: 'Article removed successfully', savedArticles: user.savedArticles, removedArticleId: articleId, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
});


app.get('/users/saved-articles', authenticateToken, async (req, res) => {
  console.log("Received request to /users/saved-articles");
  try {
    const userId = req.user.userId;
    console.log("User ID from token:", userId);

    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found with ID:", userId);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log("User found, retrieving saved articles");
    const articles = await News.find({
      '_id': { $in: user.savedArticles }
    });

    console.log("Articles retrieved:", articles);
    res.json(articles);
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ message: error.message });
  }
});

