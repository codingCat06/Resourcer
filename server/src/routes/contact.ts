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

// Submit contact form
router.post('/submit', async (req, res) => {
  try {
    console.log('[CONTACT] Submit request received:', { body: req.body });
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      console.log('[CONTACT] Submit validation failed: Missing required fields');
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('[CONTACT] Submit validation failed: Invalid email format');
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Insert contact submission
    console.log('[CONTACT] Inserting contact submission into database...');
    const [result] = await pool.query(`
      INSERT INTO contacts (name, email, subject, message)
      VALUES (?, ?, ?, ?)
    `, [name, email, subject, message]);

    const submissionId = (result as any).insertId;
    console.log('[CONTACT] Contact submission inserted successfully:', { submissionId });

    // Log email notification (email functionality can be added later)
    console.log(`[CONTACT] 새로운 문의 접수 - ID: ${submissionId}, 이름: ${name}, 이메일: ${email}, 유형: ${subject}`);
    console.log(`[CONTACT] 문의 내용: ${message}`);

    res.status(201).json({
      message: '문의사항이 성공적으로 접수되었습니다. 빠른 시일 내에 답변드리겠습니다.',
      submissionId
    });

  } catch (error) {
    console.error('[CONTACT] Submit error:', error);
    if (error instanceof Error) {
      console.error('[CONTACT] Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
    } else {
      console.error('[CONTACT] Error details:', error);
    }
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all contact submissions (admin only)
router.get('/admin/list', authenticateToken, async (req: AuthRequest, res) => {
  try {
    if (!req.user?.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { status = 'all', page = '1', limit = '20' } = req.query;
    
    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 20;
    const offset = (pageNum - 1) * limitNum;

    console.log('[CONTACT] Query parameters:', { status, page, limit, offset });

    let whereClause = '';
    const queryParams: any[] = [];

    if (status && status !== 'all') {
      whereClause = 'WHERE status = ?';
      queryParams.push(status);
    }

    console.log('[CONTACT] SQL parameters:', { whereClause, queryParams, limitNum, offset });

    // Add pagination parameters
    const paginationParams = [...queryParams, limitNum, offset];

    const [contacts] = await pool.query(`
      SELECT c.*, u.username as admin_username
      FROM contacts c
      LEFT JOIN users u ON c.admin_id = u.id
      ${whereClause}
      ORDER BY c.created_at DESC
      LIMIT ? OFFSET ?
    `, paginationParams);

    // Get total count - use the same where conditions but without pagination
    const [countResult] = await pool.query(`
      SELECT COUNT(*) as total FROM contacts ${whereClause}
    `, queryParams);

    const total = (countResult as any[])[0].total;

    res.json({
      contacts,
      pagination: {
        current: pageNum,
        total: Math.ceil(total / limitNum),
        limit: limitNum,
        totalItems: total
      }
    });

  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update contact submission (admin only)
router.put('/admin/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    if (!req.user?.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { id } = req.params;
    const { status, admin_notes } = req.body;

    await pool.query(`
      UPDATE contacts 
      SET status = ?, admin_notes = ?, admin_id = ?, admin_username = ?, updated_at = NOW()
      WHERE id = ?
    `, [status, admin_notes || null, req.user.id, req.user.email, id]);

    res.json({ message: 'Contact submission updated successfully' });

  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get single contact submission (admin only)
router.get('/admin/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    if (!req.user?.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { id } = req.params;

    const [contact] = await pool.query(`
      SELECT c.*, u.username as admin_username
      FROM contacts c
      LEFT JOIN users u ON c.admin_id = u.id
      WHERE c.id = ?
    `, [id]);

    if ((contact as any[]).length === 0) {
      return res.status(404).json({ message: 'Contact submission not found' });
    }

    res.json({ contact: (contact as any[])[0] });

  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;