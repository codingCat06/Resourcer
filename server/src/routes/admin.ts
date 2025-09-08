import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { EarningsCalculator } from '../utils/earnings';
import pool from '../models/db';
import { AuthenticatedRequest } from '../types';

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

    // Process top posts to ensure proper data types
    const processedTopPosts = (topPosts as any[]).map(post => ({
      ...post,
      click_count: Number(post.click_count || 0),
      total_earnings: Number(post.total_earnings || 0)
    }));

    res.json({
      totalUsers: (totalUsers as any[])[0].count,
      totalPosts: (totalPosts as any[])[0].count,
      publishedPosts: (publishedPosts as any[])[0].count,
      totalClicks: Number((totalClicks as any[])[0].total || 0),
      totalEarnings: Number((totalEarnings as any[])[0].total || 0),
      recentSearches,
      topPosts: processedTopPosts
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ message: 'Failed to get admin statistics' });
  }
});

// Get all users (admin only)
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { subscription_type, is_active, sortBy = 'created_at', sortOrder = 'desc', page = '1', limit = '20' } = req.query;
    
    let whereConditions: string[] = [];
    let params: any[] = [];
    
    if (subscription_type && subscription_type !== 'all') {
      whereConditions.push('subscription_type = ?');
      params.push(subscription_type);
    }
    
    if (is_active !== undefined && is_active !== 'all') {
      whereConditions.push('is_active = ?');
      params.push(is_active === 'true' ? 1 : 0);
    }
    
    const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';
    
    // Validate sortBy to prevent SQL injection
    const allowedSortFields = ['created_at', 'username', 'email', 'total_earnings', 'subscription_type'];
    const safeSortBy = allowedSortFields.includes(sortBy as string) ? sortBy : 'created_at';
    const safeSortOrder = sortOrder === 'asc' ? 'ASC' : 'DESC';
    
    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 20;
    const offset = (pageNum - 1) * limitNum;
    
    console.log('Admin users query params:', params);
    console.log('Admin users where clause:', whereClause);
    
    const query = `
      SELECT id, username, email, full_name, subscription_type, 
             COALESCE(total_earnings, 0) as total_earnings, 
             COALESCE(is_admin, 0) as is_admin, 
             COALESCE(is_active, 1) as is_active, 
             created_at, last_login
      FROM users
      ${whereClause}
      ORDER BY ${safeSortBy} ${safeSortOrder}
      LIMIT ? OFFSET ?
    `;

    
    // Add pagination parameters at the end after building the query
    params.push(limitNum, offset);

    console.log('params', params)
    
    const [users] = await pool.query(query, params);


    // Ensure numeric fields are properly typed
    const processedUsers = (users as any[]).map(user => ({
      ...user,
      total_earnings: Number(user.total_earnings || 0),
      is_admin: Boolean(user.is_admin),
      is_active: Boolean(user.is_active)
    }));

    res.json({ users: processedUsers });
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

    await pool.query('UPDATE posts SET status = ? WHERE id = ?', [status, id]);

    res.json({ message: 'Post status updated successfully' });
  } catch (error) {
    console.error('Admin update post status error:', error);
    res.status(500).json({ message: 'Failed to update post status' });
  }
});

// Get all posts (admin only)
router.get('/posts', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status, sortBy = 'created_at', sortOrder = 'desc', page = '1', limit = '20' } = req.query;
    
    let params: any[] = [];
    let whereClause = '';
    
    if (status && status !== 'all') {
      whereClause = ' WHERE p.status = ?';
      params.push(status);
    }
    
    // Validate sortBy to prevent SQL injection
    const allowedSortFields = ['created_at', 'updated_at', 'title', 'click_count', 'total_earnings'];
    const safeSortBy = allowedSortFields.includes(sortBy as string) ? sortBy : 'created_at';
    const safeSortOrder = sortOrder === 'asc' ? 'ASC' : 'DESC';
    
    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 20;
    const offset = (pageNum - 1) * limitNum;
    
    // Add pagination parameters at the end
    params.push(limitNum, offset);
    
    const query = `
      SELECT p.*, u.username, u.full_name
      FROM posts p
      JOIN users u ON p.user_id = u.id
      ${whereClause}
      ORDER BY p.${safeSortBy} ${safeSortOrder}
      LIMIT ? OFFSET ?
    `;
    
    const [posts] = await pool.query(query, params);

    // Ensure numeric fields are properly typed
    const processedPosts = (posts as any[]).map(post => ({
      ...post,
      click_count: Number(post.click_count || 0),
      total_earnings: Number(post.total_earnings || 0)
    }));

    res.json({ posts: processedPosts });
  } catch (error) {
    console.error('Get admin posts error:', error);
    res.status(500).json({ message: 'Failed to get posts' });
  }
});

// Delete post (admin only)
router.delete('/posts/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Delete related records first
    await pool.query('DELETE FROM post_clicks WHERE post_id = ?', [id]);
    await pool.query('DELETE FROM earnings WHERE post_id = ?', [id]);

    // Delete the post
    const [result] = await pool.query('DELETE FROM posts WHERE id = ?', [id]);

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Admin delete post error:', error);
    res.status(500).json({ message: 'Failed to delete post' });
  }
});

// Update user subscription (admin only)
router.put('/users/:id/subscription', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { subscription_type } = req.body;

    if (!['free', 'pro'].includes(subscription_type)) {
      return res.status(400).json({ message: 'Invalid subscription type' });
    }

    await pool.query('UPDATE users SET subscription_type = ? WHERE id = ?', [subscription_type, id]);

    res.json({ message: 'User subscription updated successfully' });
  } catch (error) {
    console.error('Admin update user subscription error:', error);
    res.status(500).json({ message: 'Failed to update user subscription' });
  }
});

// Update user status (admin only)
router.put('/users/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    // Validate input
    if (typeof is_active !== 'boolean') {
      return res.status(400).json({ message: 'is_active must be a boolean' });
    }

    const [result] = await pool.query('UPDATE users SET is_active = ? WHERE id = ?', [is_active ? 1 : 0, id]);

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User status updated successfully' });
  } catch (error) {
    console.error('Admin update user status error:', error);
    res.status(500).json({ message: 'Failed to update user status' });
  }
});

// Update user admin status (admin only)
router.put('/users/:id/admin', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const { is_admin } = req.body;

    // Validate input
    if (typeof is_admin !== 'boolean') {
      return res.status(400).json({ message: 'is_admin must be a boolean' });
    }

    // Prevent users from removing their own admin status
    if (req.user?.id === parseInt(id) && !is_admin) {
      return res.status(400).json({ message: 'Cannot remove your own admin privileges' });
    }

    const [result] = await pool.query('UPDATE users SET is_admin = ? WHERE id = ?', [is_admin ? 1 : 0, id]);

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User admin status updated successfully' });
  } catch (error) {
    console.error('Admin update user admin status error:', error);
    res.status(500).json({ message: 'Failed to update user admin status' });
  }
});

export default router;