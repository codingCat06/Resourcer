import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { EarningsCalculator } from '../utils/earnings';
import pool from '../models/db';

const router = express.Router();

// Process earnings for all eligible posts (admin only)
router.post('/process-earnings', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await EarningsCalculator.processAllEligiblePosts();
    res.json({ message: 'Earnings processing completed successfully' });
  } catch (error) {
    console.error('Admin earnings processing error:', error);
    res.status(500).json({ message: 'Failed to process earnings' });
  }
});

// Get admin dashboard statistics
router.get('/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Get total users
    const [totalUsers] = await pool.execute('SELECT COUNT(*) as count FROM users');
    
    // Get total posts
    const [totalPosts] = await pool.execute('SELECT COUNT(*) as count FROM posts');
    
    // Get published posts
    const [publishedPosts] = await pool.execute('SELECT COUNT(*) as count FROM posts WHERE status = "published"');
    
    // Get total clicks
    const [totalClicks] = await pool.execute('SELECT SUM(click_count) as total FROM posts');
    
    // Get total earnings
    const [totalEarnings] = await pool.execute('SELECT SUM(amount) as total FROM earnings');
    
    // Get recent search queries
    const [recentSearches] = await pool.execute(`
      SELECT query_text, results_count, searched_at 
      FROM search_queries 
      ORDER BY searched_at DESC 
      LIMIT 10
    `);

    // Get top earning posts
    const [topPosts] = await pool.execute(`
      SELECT p.title, p.click_count, p.total_earnings, u.username
      FROM posts p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.total_earnings DESC
      LIMIT 10
    `);

    res.json({
      totalUsers: (totalUsers as any[])[0].count,
      totalPosts: (totalPosts as any[])[0].count,
      publishedPosts: (publishedPosts as any[])[0].count,
      totalClicks: (totalClicks as any[])[0].total || 0,
      totalEarnings: (totalEarnings as any[])[0].total || 0,
      recentSearches,
      topPosts
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ message: 'Failed to get admin statistics' });
  }
});

// Get all users (admin only)
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [users] = await pool.execute(`
      SELECT id, username, email, full_name, subscription_type, total_earnings, created_at
      FROM users
      ORDER BY created_at DESC
    `);

    res.json({ users });
  } catch (error) {
    console.error('Get admin users error:', error);
    res.status(500).json({ message: 'Failed to get users' });
  }
});

// Manage post status (admin only)
router.put('/posts/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['draft', 'published', 'archived'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    await pool.execute('UPDATE posts SET status = ? WHERE id = ?', [status, id]);

    res.json({ message: 'Post status updated successfully' });
  } catch (error) {
    console.error('Admin update post status error:', error);
    res.status(500).json({ message: 'Failed to update post status' });
  }
});

export default router;