import express from 'express';
import { authenticateToken } from '../middleware/auth';
import pool from '../models/db';

const router = express.Router();

interface AuthRequest extends express.Request {
  user?: {
    id: number;
    email: string;
    isAdmin: boolean;
  };
}

// Get all published posts
router.get('/', async (req, res) => {
  try {
    const [posts] = await pool.execute(`
      SELECT p.*, u.username, u.full_name 
      FROM posts p 
      JOIN users u ON p.user_id = u.id 
      WHERE p.status = 'published' 
      ORDER BY p.created_at DESC
    `);

    res.json({ posts });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get single post
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [posts] = await pool.execute(`
      SELECT p.*, u.username, u.full_name 
      FROM posts p 
      JOIN users u ON p.user_id = u.id 
      WHERE p.id = ? AND p.status = 'published'
    `, [id]);

    if ((posts as any[]).length === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json({ post: (posts as any[])[0] });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create new post
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { title, content, summary, tags, apis_modules, work_environment, status = 'draft' } = req.body;
    const userId = req.user!.id;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const [result] = await pool.execute(`
      INSERT INTO posts (user_id, title, content, summary, tags, apis_modules, work_environment, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      userId,
      title,
      content,
      summary || null,
      JSON.stringify(tags || []),
      JSON.stringify(apis_modules || []),
      JSON.stringify(work_environment || []),
      status
    ]);

    const postId = (result as any).insertId;

    res.status(201).json({
      message: 'Post created successfully',
      postId
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update post
router.put('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { title, content, summary, tags, apis_modules, work_environment, status } = req.body;
    const userId = req.user!.id;

    // Check if post exists and belongs to user
    const [posts] = await pool.execute(
      'SELECT * FROM posts WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if ((posts as any[]).length === 0) {
      return res.status(404).json({ message: 'Post not found or unauthorized' });
    }

    await pool.execute(`
      UPDATE posts SET 
        title = ?, content = ?, summary = ?, tags = ?, 
        apis_modules = ?, work_environment = ?, status = ?
      WHERE id = ? AND user_id = ?
    `, [
      title,
      content,
      summary || null,
      JSON.stringify(tags || []),
      JSON.stringify(apis_modules || []),
      JSON.stringify(work_environment || []),
      status,
      id,
      userId
    ]);

    res.json({ message: 'Post updated successfully' });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete post
router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const [result] = await pool.execute(
      'DELETE FROM posts WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ message: 'Post not found or unauthorized' });
    }

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Track post click
router.post('/:id/click', async (req, res) => {
  try {
    const { id } = req.params;
    const userIP = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');
    const referrer = req.get('Referer');

    // Get post info to check if user is the author
    const [posts] = await pool.execute(`
      SELECT user_id FROM posts WHERE id = ?
    `, [id]);

    if ((posts as any[]).length === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const post = (posts as any[])[0];
    
    // Check if user is logged in and is the post author
    const token = req.headers.authorization?.split(' ')[1];
    let isOwnPost = false;

    if (token) {
      try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
        isOwnPost = decoded.id === post.user_id;
      } catch (jwtError) {
        // Token invalid, continue as anonymous user
      }
    }

    // Only track clicks if it's not the author's own post
    if (!isOwnPost) {
      // Insert click record
      await pool.execute(`
        INSERT INTO post_clicks (post_id, user_ip, user_agent, referrer)
        VALUES (?, ?, ?, ?)
      `, [id, userIP, userAgent, referrer]);

      // Update post click count
      await pool.execute(`
        UPDATE posts SET click_count = click_count + 1 WHERE id = ?
      `, [id]);
    }

    res.json({ message: 'Click tracked successfully', tracked: !isOwnPost });
  } catch (error) {
    console.error('Track click error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;