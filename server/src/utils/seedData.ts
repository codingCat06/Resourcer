import pool from '../models/db';
import bcrypt from 'bcrypt';

export const seedDatabase = async () => {
  const connection = await pool.getConnection();
  
  try {
    // Check if users already exist
    const [existingUsers] = await connection.execute('SELECT COUNT(*) as count FROM users');
    const userCount = (existingUsers as any)[0].count;
    
    if (userCount === 0) {
      console.log('Seeding database with sample data...');
      
      // Create sample users
      const hashedPassword = await bcrypt.hash('password123', 10);
      
      // Insert sample users
      await connection.execute(`
        INSERT INTO users (username, email, password_hash, full_name, is_admin) VALUES
        ('admin', 'admin@resourcer.com', ?, 'Admin User', true),
        ('john_dev', 'john@example.com', ?, 'John Developer', false),
        ('sarah_js', 'sarah@example.com', ?, 'Sarah Johnson', false),
        ('mike_react', 'mike@example.com', ?, 'Mike React', false)
      `, [hashedPassword, hashedPassword, hashedPassword, hashedPassword]);

      // Insert sample posts focused on API and module recommendations for specific actions
      await connection.execute(`
        INSERT INTO posts (user_id, title, content, summary, tags, apis_modules, work_environment, status, click_count, total_earnings) VALUES
        (2, 'API: Payment Processing for E-commerce', 
         'When building e-commerce applications that need payment processing, Stripe API is the best choice. It handles credit cards, digital wallets (Apple Pay, Google Pay), and international payments. Simple integration with webhooks for payment confirmation. Perfect for when you need reliable payment processing without PCI compliance hassles.', 
         'Stripe API provides complete payment processing solution for e-commerce applications.',
         JSON_ARRAY("payment", "e-commerce", "stripe", "api"),
         JSON_ARRAY("Stripe API", "Stripe Checkout API", "Stripe Connect API"),
         JSON_ARRAY(),
         'published', 45, 12.50),
        
        (3, 'Module: Form Handling in React Applications', 
         'When you need to handle complex forms in React with validation and error handling, use React Hook Form module. It minimizes re-renders, has built-in validation, and integrates with UI libraries like Material-UI. Perfect for user registration, contact forms, and data entry forms with real-time validation.', 
         'React Hook Form module provides efficient form handling with built-in validation for React apps.',
         JSON_ARRAY("react", "forms", "validation", "module"),
         JSON_ARRAY("react-hook-form", "yup", "@hookform/resolvers"),
         JSON_ARRAY("React", "JavaScript"),
         'published', 78, 23.40),
        
        (4, 'Module: File Upload Handling in Node.js', 
         'When building file upload functionality in Node.js applications, use Multer module for handling multipart form data and Sharp for image processing. Multer handles the upload logic while Sharp can resize and optimize images. Great for profile pictures, document uploads, and image galleries.', 
         'Multer + Sharp modules provide complete file upload and processing solution for Node.js.',
         JSON_ARRAY("file-upload", "images", "nodejs", "module"),
         JSON_ARRAY("multer", "sharp", "express-fileupload"),
         JSON_ARRAY("Node.js", "Express.js"),
         'published', 32, 8.96),
         
        (2, 'API: Real-time Communication for Chat Apps', 
         'When building real-time chat or live updates functionality, Socket.IO is the perfect solution. It provides real-time bidirectional communication between client and server with automatic fallbacks. Great for chat applications, live notifications, collaborative editing, and real-time dashboards.', 
         'Socket.IO provides real-time communication solution for chat and live update features.',
         JSON_ARRAY("realtime", "chat", "websocket", "api"),
         JSON_ARRAY("Socket.IO", "WebSocket API"),
         JSON_ARRAY(),
         'published', 56, 16.80),
         
        (3, 'Module: Date Handling in JavaScript Applications', 
         'When working with dates in JavaScript applications (formatting, parsing, timezones), use Day.js module. It is lightweight (2kB), has the same API as Moment.js but much smaller bundle size. Perfect for date formatting, relative time display, and timezone conversions in both frontend and backend.', 
         'Day.js module provides lightweight and powerful date manipulation for JavaScript applications.',
         JSON_ARRAY("date", "time", "javascript", "module"),
         JSON_ARRAY("dayjs", "date-fns", "moment"),
         JSON_ARRAY("JavaScript", "Node.js", "React"),
         'published', 89, 26.70),
         
        (4, 'API: Email Sending Service for Applications', 
         'When your application needs to send transactional emails (welcome emails, password resets, notifications), use SendGrid API. It ensures high deliverability, handles bounce management, and provides detailed analytics. Much more reliable than SMTP servers for production applications.', 
         'SendGrid API provides reliable email delivery service with analytics and management features.',
         JSON_ARRAY("email", "notifications", "communication", "api"),
         JSON_ARRAY("SendGrid API", "Mailgun API", "SES API"),
         JSON_ARRAY(),
         'published', 41, 12.30)
      `);

      console.log('Sample data seeded successfully');
    } else {
      console.log('Database already contains data, skipping seed');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    connection.release();
  }
};