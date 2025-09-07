# Resourcer - API & Module Recommendation Service

A platform where developers can share API/module recommendations and earn revenue based on engagement.

## Features

- **User Authentication**: Register/login with JWT-based authentication
- **Post Management**: Create, edit, and manage API/module recommendation posts
- **AI-Powered Search**: OpenAI-enhanced search functionality
- **Revenue Tracking**: Google Ads integration with earnings calculation
- **Click Analytics**: Track post engagement and performance
- **Pro API Access**: External API for programmatic access (subscription-based)
- **Admin Panel**: Content and user management

## Tech Stack

### Backend
- Node.js with TypeScript
- Express.js
- MySQL with mysql2
- JWT for authentication
- OpenAI API for enhanced search
- bcrypt for password hashing

### Frontend
- React with TypeScript
- React Router for navigation
- Tailwind CSS for styling
- Axios for API calls

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- OpenAI API key (optional, for enhanced search)
- Google Ads credentials (optional, for revenue tracking)

### Installation

1. **Clone and install dependencies:**
```bash
npm run install-all
```

2. **Set up the database:**
```bash
# Create MySQL database and run the schema
mysql -u root -p < server/src/models/database.sql
```

3. **Configure environment variables:**
```bash
# Copy the example env file
cp server/.env.example server/.env

# Edit server/.env with your configuration:
PORT=5000
JWT_SECRET=your-very-secure-jwt-secret-key-here
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your-mysql-password
DB_NAME=resourcer
OPENAI_API_KEY=your-openai-api-key (optional)
GOOGLE_ADS_CLIENT_ID=your-google-ads-client-id (optional)
GOOGLE_ADS_CLIENT_SECRET=your-google-ads-client-secret (optional)
GOOGLE_ADS_DEVELOPER_TOKEN=your-google-ads-developer-token (optional)
```

### Running the Application

**Start both client and server:**
```bash
npm start
```

This will run:
- Backend server on http://localhost:5000
- Frontend client on http://localhost:3000

**Or run separately:**
```bash
# Start only the server
npm run server

# Start only the client (in another terminal)
npm run client
```

## Database Schema

### Users
- User accounts with authentication
- Subscription types (free/pro)
- Total earnings tracking

### Posts
- API/module recommendations
- Tags, work environment, APIs/modules
- Click counts and earnings

### Analytics
- Post clicks tracking
- Search queries logging
- Earnings calculation

### API Usage
- Pro subscription API usage tracking
- Rate limiting per subscription tier

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Token verification

### Posts
- `GET /api/posts` - Get all published posts
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create new post (auth required)
- `PUT /api/posts/:id` - Update post (auth required)
- `DELETE /api/posts/:id` - Delete post (auth required)
- `POST /api/posts/:id/click` - Track post click

### Search
- `POST /api/search` - Search posts with OpenAI enhancement

### User
- `GET /api/user/profile` - Get user profile (auth required)
- `GET /api/user/posts` - Get user's posts (auth required)
- `GET /api/user/earnings` - Get user's earnings (auth required)

### External API (Pro Plan)
- `POST /api/external/search` - External API search (pro auth required)
- `GET /api/external/usage` - API usage statistics (pro auth required)

### Admin
- `POST /api/admin/process-earnings` - Process earnings (admin only)
- `GET /api/admin/stats` - Get admin statistics (admin only)
- `GET /api/admin/users` - Get all users (admin only)
- `PUT /api/admin/posts/:id/status` - Manage post status (admin only)

## Revenue Model

### For Content Creators
- 70% of ad revenue from their posts
- Minimum 100 clicks required for earnings
- Monthly payouts for eligible creators

### For Platform
- 30% platform fee from ad revenue
- Pro subscription fees for API access
- Google Ads integration for revenue tracking

## Development

### Project Structure
```
resourcer/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utility functions
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   └── utils/          # Utility functions
└── package.json            # Root package.json
```

### Adding New Features

1. Update database schema if needed
2. Add/update API routes in server/src/routes/
3. Update TypeScript types in client/src/types/
4. Add frontend components and pages
5. Test the complete flow

## Deployment

### Environment Setup
1. Set up production MySQL database
2. Configure environment variables for production
3. Set up Google Ads account and get credentials
4. Get OpenAI API key for search enhancement

### Build and Deploy
```bash
# Build the client
cd client && npm run build

# Deploy server with PM2 or similar
cd server && npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.# Resourcer
