import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import pg from 'pg';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config(); 
const app = express();

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true, 
  }));

app.use(
    session({
      secret: 'MySecret', 
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false }, 
    })
);

app.use(passport.initialize());
app.use(passport.session());
  
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "Userdata",
    password: "Yash",
    port: 5432,
  });

db.connect();



app.get('/api/user', (req, res) => {
    if (req.isAuthenticated()) {
      res.json({ user: req.user }); 
    } else {
      res.status(401).json({ message: 'Unauthorized' }); 
    }
});

app.post('/logout', (req, res) => {
    req.logout(err => {
      if (err) {
        return res.status(500).json({ message: 'Failed to log out' });
      }
      req.session.destroy(() => {
        res.clearCookie('connect.sid'); // Clear the session cookie
        res.status(200).json({ message: 'Logged out' });
      });
    });
});  


app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {

    const emailCheck = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Email already exists. Please login instead.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

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

app.post('/login', passport.authenticate('local'), (req, res) => {
    res.status(200).json({ message: 'Logged in successfully' });
});

app.delete('/delete-subject/:id', ensureAuthenticated, async (req, res) => {
  const subjectId = req.params.id;
  const userId = req.user.id;

  try {
      const result = await db.query(
          `DELETE FROM subjects WHERE subject_id = $1 AND user_id = $2 RETURNING *`,
          [subjectId, userId]
      );

      if (result.rowCount === 0) {
          return res.status(404).json({ error: 'Subject not found or unauthorized' });
      }

      res.json({ message: 'Subject deleted successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete subject' });
  }
});


app.post('/add-subject', ensureAuthenticated, async (req, res) => {
  const { subjectCode, subjectName } = req.body;
  const userId = req.user.id;


  try {
      const result = await db.query(
          `INSERT INTO Subjects (user_id, subject_code, subject_name)
           VALUES ($1, $2, $3) RETURNING *`,
          [userId, subjectCode, subjectName]
      );
      res.status(201).json({ message: 'Subject added successfully', subject: result.rows[0] });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to add subject' });
  }
})

app.get('/home', ensureAuthenticated, async (req, res) => {
  const userId = req.user.id;
  try {

      const subjects = await db.query(
          `SELECT * 
           FROM subjects 
           WHERE user_id = $1`,
          [userId]
      );

      res.json({
          subjects: subjects.rows
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to retrieve subjects' });
  }
});

app.post('/api/attendance', async (req, res) => {
  const { userId, subjectId, day, month, year, status } = req.body;

  if (!userId || !subjectId || !status) {
    return res.status(400).send({ message: "Missing required fields" });
  }

  try {

    const existingRecord = await db.query(
      "SELECT * FROM attendance WHERE user_id = $1 AND subject_id = $2 AND day = $3 AND month = $4 AND year = $5",
      [userId, subjectId, day, month, year]
    );

    if (existingRecord.rows.length > 0) {

      await db.query(
        "UPDATE attendance SET status = $6 WHERE user_id = $1 AND subject_id = $2 AND day = $3 AND month = $4 AND year = $5",
        [userId, subjectId, day, month, year, status]
      );
      res.status(200).send({ message: "Attendance status updated successfully" });
    } else {

      await db.query(
        "INSERT INTO attendance (user_id, subject_id, day, month, year, status) VALUES ($1, $2, $3, $4, $5, $6)",
        [userId, subjectId, day, month, year, status]
      );
      res.status(200).send({ message: "Attendance added successfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error updating attendance" });
  }
});

app.get('/attendance/:userId/:subjectId', async (req, res) => {
  const { userId, subjectId } = req.params;
  try {
      const result = await db.query(
          'SELECT day, month, year, status FROM attendance WHERE user_id = $1 AND subject_id = $2',
          [userId, subjectId]
      );

      res.json(result.rows);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to retrieve attendance' });
  }
});



function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
      return next();
  }
  res.status(401).json({ error: 'Unauthorized' });
}


passport.use(
    new LocalStrategy(
      { usernameField: 'email' },
      async (email, password, done) => {
        try {
          const userCheck = await db.query('SELECT * FROM users WHERE email = $1', [email]);
          const user = userCheck.rows[0];
          
          if (!user) {
            return done(null, false, { message: 'Incorrect email or password.' });
          }
  
          const isValid = await bcrypt.compare(password, user.password);
          if (!isValid) {
            return done(null, false, { message: 'Incorrect email or password.' });
          }
  
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  
  
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id, done) => {
    try {
      const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
      done(null, result.rows[0]);
    } catch (error) {
      done(error);
    }
  });

  app.get('/api/auth/status', (req, res) => {
    if (req.isAuthenticated()) {
      res.json({ isAuthenticated: true });
    } else {
      res.json({ isAuthenticated: false });
    }
  });

app.listen(3005, () => console.log('Server running on port 500'));
