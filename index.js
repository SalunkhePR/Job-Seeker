const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require("multer");

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb+srv://Prathamesh:9XG6XxJfcsriIVXk@cluster0.hsmxt.mongodb.net/Job-seeker').then(() => {
  console.log('Database Connected!!')
});

const userSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  email: String,
  address: String,
  resume: String
});
const user = mongoose.model('users', userSchema);
module.exports = user;


// to store uploded files (middleware)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
})

const upload = multer({ storage: storage })

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.set('view engine', 'ejs');



// Routes
app.get('/success', async (req, res) => {
    try {
      res.render('success');
    } catch (err) {
      res.status(500).send(err);
    }
  });

  app.get('/', async (req, res) => {
    try {
      res.render('register');
    } catch (err) {
      res.status(500).send(err);
    }
  });

  
  app.post('/register', upload.single('resume'), async (req, res) => {
    const { fname, lname, email, address } = req.body;

    try {
    const newUser = new user({ fname, lname, email, address, resume: req.file.filename, });
    await newUser.save(); 
    console.log(newUser);
    res.redirect('/success');
  } catch (err) {
    res.status(500).send(err);
  }
  })

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});