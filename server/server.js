import cors from "cors";
import express from "express";
import pg from "pg";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import { Strategy } from "passport-local";
import passport from "passport";
import env from "dotenv";


const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
    session({
      secret: 'TOPSECRET',
      resave: false,
      saveUninitialized: true,
    })
  );

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "Userdata",
    password: "Yash",
    port: 5432,
  });

db.connect();

app.get('/home', (req,res)=> {
    res.send('Hello')
})

// Register route
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Check if email already exists
    const emailCheck = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Email already exists. Please login instead.' });
    }

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store new user
    await db.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)',
      [username, email, hashedPassword]
    );

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ error: 'Registration failed. Try again.' });
  }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
      if (result.rows.length === 0) return res.status(400).json({ error: 'User not found' });
  
      const user = result.rows[0];
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

      const { password: _, ...userData } = user;

      res.json({ id: user.id, ...userData });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
});

app.post(
    "/login",
    passport.authenticate("local", {
      successRedirect: "/home",
      failureRedirect: "/login",
    })
);
  

passport.use(
    "local",
    new Strategy(async function verify(username, password, cb) {
      try {
        const result = await db.query("SELECT * FROM users WHERE email = $1 ", [
          username,
        ]);
        if (result.rows.length > 0) {
          const user = result.rows[0];
          const storedHashedPassword = user.password;
          bcrypt.compare(password, storedHashedPassword, (err, valid) => {
            if (err) {
              console.error("Error comparing passwords:", err);
              return cb(err);
            } else {
              if (valid) {
                return cb(null, user);
              } else {
                return cb(null, false);
              }
            }
          });
        } else {
          return cb("User not found");
        }
      } catch (err) {
        console.log(err);
      }
    })
);
  
passport.serializeUser((user, cb) => {
    cb(null, user);
  });
  passport.deserializeUser((user, cb) => {
    cb(null, user);
  });


app.listen(3005, () => console.log('Server running on port 500'));
