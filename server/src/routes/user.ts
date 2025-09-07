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

// Get user profile
router.get('/profile', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;

    const [users] = await pool.execute(`
      SELECT id, username, email, full_name, subscription_type, total_earnings, created_at
      FROM users WHERE id = ?
    `, [userId]);

    if ((users as any[]).length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user: (users as any[])[0] });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user's posts
router.get('/posts', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;

    const [posts] = await pool.execute(`
      SELECT * FROM posts 
      WHERE user_id = ? 
      ORDER BY created_at DESC
    `, [userId]);

    res.json({ posts });
  } catch (error) {
    console.error('Get user posts error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user's earnings
router.get('/earnings', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;

    // Get total earnings
    const [totalResult] = await pool.execute(`
      SELECT COALESCE(SUM(amount), 0) as total_earnings
      FROM earnings WHERE user_id = ?
    `, [userId]);

    // Get monthly earnings
    const [monthlyResult] = await pool.execute(`
      SELECT 
        DATE_FORMAT(earnings_date, '%Y-%m') as month,
        SUM(amount) as earnings,
        SUM(clicks_count) as clicks
      FROM earnings 
      WHERE user_id = ? 
        AND earnings_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
      GROUP BY DATE_FORMAT(earnings_date, '%Y-%m')
      ORDER BY month DESC
    `, [userId]);

    // Get post earnings
    const [postEarnings] = await pool.execute(`
      SELECT 
        p.id, p.title, p.click_count,
        COALESCE(SUM(e.amount), 0) as total_earnings,
        MAX(e.earnings_date) as last_earning_date
      FROM posts p
      LEFT JOIN earnings e ON p.id = e.post_id
      WHERE p.user_id = ?
      GROUP BY p.id, p.title, p.click_count
      ORDER BY total_earnings DESC
    `, [userId]);

    res.json({
      totalEarnings: (totalResult as any[])[0].total_earnings,
      monthlyEarnings: monthlyResult,
      postEarnings
    });
  } catch (error) {
    console.error('Get earnings error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;