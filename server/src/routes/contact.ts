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
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Insert contact submission
    const [result] = await pool.execute(`
      INSERT INTO contact_submissions (name, email, subject, message)
      VALUES (?, ?, ?, ?)
    `, [name, email, subject, message]);

    const submissionId = (result as any).insertId;

    // Log email notification (email functionality can be added later)
    console.log(`새로운 문의 접수 - ID: ${submissionId}, 이름: ${name}, 이메일: ${email}, 유형: ${subject}`);
    console.log(`문의 내용: ${message}`);

    res.status(201).json({
      message: '문의사항이 성공적으로 접수되었습니다. 빠른 시일 내에 답변드리겠습니다.',
      submissionId
    });

  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all contact submissions (admin only)
router.get('/admin/list', authenticateToken, async (req: AuthRequest, res) => {
  try {
    if (!req.user?.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { status, page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let whereClause = '';
    let queryParams: any[] = [];

    if (status && status !== 'all') {
      whereClause = 'WHERE status = ?';
      queryParams.push(status);
    }

    const [contacts] = await pool.execute(`
      SELECT cs.*, u.username as admin_username
      FROM contact_submissions cs
      LEFT JOIN users u ON cs.admin_user_id = u.id
      ${whereClause}
      ORDER BY cs.created_at DESC
      LIMIT ? OFFSET ?
    `, [...queryParams, Number(limit), offset]);

    // Get total count
    const [countResult] = await pool.execute(`
      SELECT COUNT(*) as total FROM contact_submissions ${whereClause}
    `, queryParams);

    const total = (countResult as any[])[0].total;

    res.json({
      contacts,
      pagination: {
        current: Number(page),
        total: Math.ceil(total / Number(limit)),
        limit: Number(limit),
        totalItems: total
      }
    });

  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update contact submission status (admin only)
router.put('/admin/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    if (!req.user?.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { id } = req.params;
    const { status, admin_notes } = req.body;

    await pool.execute(`
      UPDATE contact_submissions 
      SET status = ?, admin_notes = ?, admin_user_id = ?, updated_at = NOW()
      WHERE id = ?
    `, [status, admin_notes || null, req.user.id, id]);

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

    const [contacts] = await pool.execute(`
      SELECT cs.*, u.username as admin_username
      FROM contact_submissions cs
      LEFT JOIN users u ON cs.admin_user_id = u.id
      WHERE cs.id = ?
    `, [id]);

    if ((contacts as any[]).length === 0) {
      return res.status(404).json({ message: 'Contact submission not found' });
    }

    res.json({ contact: (contacts as any[])[0] });

  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;