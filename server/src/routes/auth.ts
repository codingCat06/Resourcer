import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../models/db';

const router = express.Router();
// Register
router.post('/register', async (req, res) => {
  try {
    console.log('[AUTH] Register request received:', { username: req.body.username, email: req.body.email });
    
    const { username, email, password, fullName } = req.body;

    if (!username || !email || !password) {
      console.log('[AUTH] Register validation failed: Missing required fields');
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    // Check if user already exists
    console.log('[AUTH] Checking for existing users...');
    console.log('[AUTH] Database query parameters:', { email, username });
    const [existingUsers] = await pool.execute(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email, username]
    );
    console.log('[AUTH] Query result:', { count: (existingUsers as any[]).length });

    if ((existingUsers as any[]).length > 0) {
      console.log('[AUTH] User already exists');
      return res.status(409).json({ message: 'User with this email or username already exists' });
    }

    // Hash password
    console.log('[AUTH] Starting password hash...');
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    console.log('[AUTH] Password hashed successfully');

    
    // Insert new user
    console.log('[AUTH] Inserting new user into database...');
    console.log('[AUTH] User data:', { username, email, fullName: fullName || null });
    const [result] = await pool.execute(
      'INSERT INTO users (username, email, password_hash, full_name) VALUES (?, ?, ?, ?)',
      [username, email, passwordHash, fullName || null]
    );

    const userId = (result as any).insertId;
    console.log('[AUTH] User created with ID:', userId);

    // Generate JWT token
    console.log('[AUTH] Generating JWT token...');
    const token = jwt.sign(
      { id: userId, email, isAdmin: false },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );
    console.log('[AUTH] JWT token generated successfully');

    console.log('[AUTH] Sending registration success response');
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: userId,
        username,
        email,
        fullName: fullName || null
      }
    });
  } catch (error) {
    console.error('[AUTH] Registration error:', error);
    if (error instanceof Error) {
      console.error('[AUTH] Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
    } else {
      console.error('[AUTH] Error details:', error);
    }
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    console.log('[AUTH] Login request received:', { email: req.body.email });
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('[AUTH] Login validation failed: Missing required fields');
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    console.log('[AUTH] Finding user in database...');
    console.log('[AUTH] Query parameter:', { email });
    const [users] = await pool.execute(
      'SELECT id, username, email, password_hash, full_name, is_admin, subscription_type FROM users WHERE email = ?',
      [email]
    );
    console.log('[AUTH] User query result:', { found: (users as any[]).length > 0 });

    if ((users as any[]).length === 0) {
      console.log('[AUTH] User not found');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = (users as any[])[0];
    console.log('[AUTH] User found:', { id: user.id, username: user.username, email: user.email });

    // Verify password
    console.log('[AUTH] Verifying password...');
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    console.log('[AUTH] Password verification result:', { isValid: isValidPassword });

    if (!isValidPassword) {
      console.log('[AUTH] Invalid password');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    console.log('[AUTH] Generating JWT token for login...');
    const token = jwt.sign(
      { id: user.id, email: user.email, isAdmin: user.is_admin },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );
    console.log('[AUTH] JWT token generated for login');

    console.log('[AUTH] Sending login success response');
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name,
        isAdmin: user.is_admin,
        subscriptionType: user.subscription_type
      }
    });
  } catch (error) {
    console.error('[AUTH] Login error:', error);
    if (error instanceof Error) {
      console.error('[AUTH] Login error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
    } else {
      console.error('[AUTH] Login error details:', error);
    }
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Verify token
router.get('/verify', async (req, res) => {
  try {
    console.log('[AUTH] Token verification request received');
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log('[AUTH] Token extraction:', { hasAuthHeader: !!authHeader, hasToken: !!token });

    if (!token) {
      console.log('[AUTH] No token provided');
      return res.status(401).json({ message: 'No token provided' });
    }

    console.log('[AUTH] Verifying JWT token...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    console.log('[AUTH] Token decoded successfully:', { userId: decoded.id, email: decoded.email });

    // Get latest user info
    console.log('[AUTH] Fetching user info from database...');
    const [users] = await pool.execute(
      'SELECT id, username, email, full_name, is_admin, subscription_type FROM users WHERE id = ?',
      [decoded.id]
    );
    console.log('[AUTH] User fetch result:', { found: (users as any[]).length > 0 });

    if ((users as any[]).length === 0) {
      console.log('[AUTH] User not found in database');
      return res.status(401).json({ message: 'User not found' });
    }

    const user = (users as any[])[0];
    console.log('[AUTH] User verification successful:', { id: user.id, username: user.username });

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name,
        isAdmin: user.is_admin,
        subscriptionType: user.subscription_type
      }
    });
  } catch (error) {
    console.error('[AUTH] Token verification error:', error);
    if (error instanceof Error) {
      console.error('[AUTH] Token verification error details:', {
        message: error.message,
        name: error.name
      });
    } else {
      console.error('[AUTH] Token verification error details:', error);
    }
    res.status(401).json({ message: 'Invalid token' });
  }
});

export default router;