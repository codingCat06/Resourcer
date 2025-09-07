import express from 'express';
import rateLimit from 'express-rate-limit';
import { authenticateToken, requireProSubscription } from '../middleware/auth';
import pool from '../models/db';

const router = express.Router();

interface AuthRequest extends express.Request {
  user?: {
    id: number;
    email: string;
    isAdmin: boolean;
  };
}

// Rate limiting for API endpoints
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute for free users
  message: { message: 'API rate limit exceeded' }
});

const proApiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute for pro users
  message: { message: 'API rate limit exceeded' }
});

// API endpoint for external access (requires pro subscription)
router.post('/search', authenticateToken, requireProSubscription, proApiLimiter, async (req: AuthRequest, res) => {
  try {
    const { query, workEnvironment, limit = 10 } = req.body;
    const userId = req.user!.id;

    if (!query) {
      return res.status(400).json({ message: 'Query parameter is required' });
    }

    // Track API usage
    await pool.execute(`
      INSERT INTO api_usage (user_id, endpoint, date, request_count)
      VALUES (?, 'search', CURDATE(), 1)
      ON DUPLICATE KEY UPDATE request_count = request_count + 1
    `, [userId]);

    // Search posts
    let searchSql = `
      SELECT p.id, p.title, p.summary, p.tags, p.apis_modules, p.work_environment, 
             p.click_count, u.username,
        MATCH(p.title, p.content, p.summary) AGAINST(? IN NATURAL LANGUAGE MODE) as relevance
      FROM posts p 
      JOIN users u ON p.user_id = u.id 
      WHERE p.status = 'published' 
        AND MATCH(p.title, p.content, p.summary) AGAINST(? IN NATURAL LANGUAGE MODE)
    `;
    
    const searchParams = [query, query];

    if (workEnvironment && workEnvironment.length > 0) {
      const envConditions = workEnvironment.map(() => 'JSON_SEARCH(p.work_environment, "one", ?) IS NOT NULL').join(' OR ');
      searchSql += ` AND (${envConditions})`;
      searchParams.push(...workEnvironment);
    }

    searchSql += ` ORDER BY relevance DESC, p.click_count DESC LIMIT ?`;
    searchParams.push(Math.min(limit, 50)); // Max 50 results

    const [posts] = await pool.execute(searchSql, searchParams);

    res.json({
      results: posts,
      total: (posts as any[]).length,
      query
    });
  } catch (error) {
    console.error('API search error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get API usage statistics
router.get('/usage', authenticateToken, requireProSubscription, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;

    const [usage] = await pool.execute(`
      SELECT endpoint, date, request_count
      FROM api_usage
      WHERE user_id = ? 
        AND date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
      ORDER BY date DESC
    `, [userId]);

    const [totalUsage] = await pool.execute(`
      SELECT SUM(request_count) as total_requests
      FROM api_usage
      WHERE user_id = ?
        AND date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    `, [userId]);

    res.json({
      usage,
      totalRequests: (totalUsage as any[])[0].total_requests || 0
    });
  } catch (error) {
    console.error('API usage error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;