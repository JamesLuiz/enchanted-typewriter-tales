# Enchanted Tales Backend

A robust NestJS backend API for the Enchanted Tales storytelling platform, featuring MongoDB integration, file upload capabilities, and comprehensive story management.

## 🚀 Features

- **Story Management**: Full CRUD operations for stories with advanced querying
- **File Upload**: Support for uploading .txt files with automatic content processing
- **Bulk Upload**: Upload multiple story files simultaneously
- **Search & Filtering**: Advanced search with pagination, sorting, and filtering
- **Statistics**: Comprehensive story analytics and metrics
- **Validation**: Robust input validation and error handling
- **Documentation**: Auto-generated Swagger/OpenAPI documentation
- **Health Checks**: System and database health monitoring

## 🛠 Tech Stack

- **Framework**: NestJS
- **Database**: MongoDB with Mongoose ODM
- **File Upload**: Multer
- **Validation**: class-validator & class-transformer
- **Documentation**: Swagger/OpenAPI
- **Environment**: Node.js with TypeScript

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🔧 Installation

1. **Clone and navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment setup**:
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/enchanted-tales
   PORT=3001
   FRONTEND_URL=http://localhost:8080
   ```

4. **Start MongoDB** (if running locally):
   ```bash
   mongod
   ```

## 🚀 Running the Application

### Development Mode
```bash
npm run start:dev
```

### Production Mode
```bash
npm run build
npm run start:prod
```

The API will be available at:
- **API**: http://localhost:3001/api/v1
- **Documentation**: http://localhost:3001/api/docs

## 📚 API Endpoints

### Stories
- `GET /api/v1/stories` - Get all stories (with pagination & filtering)
- `GET /api/v1/stories/:id` - Get story by ID
- `POST /api/v1/stories` - Create new story
- `PATCH /api/v1/stories/:id` - Update story
- `DELETE /api/v1/stories/:id` - Delete story
- `GET /api/v1/stories/stats` - Get story statistics

### File Upload
- `POST /api/v1/upload/story` - Upload single story file
- `POST /api/v1/upload/stories/bulk` - Upload multiple story files

### Health
- `GET /api/v1/health` - System health check
- `GET /api/v1/health/database` - Database health check

## 📝 API Usage Examples

### Upload a Story File
```bash
curl -X POST \
  http://localhost:3001/api/v1/upload/story \
  -H 'Content-Type: multipart/form-data' \
  -F 'file=@story.txt' \
  -F 'author=Luna Silvermoon' \
  -F 'genre=Fantasy'
```

### Get Stories with Filtering
```bash
curl "http://localhost:3001/api/v1/stories?page=1&limit=10&search=forest&genre=Fantasy&sortBy=createdAt&sortOrder=desc"
```

### Create Story Manually
```bash
curl -X POST \
  http://localhost:3001/api/v1/stories \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "The Magical Garden",
    "author": "Sage Moonglow",
    "content": "In a hidden valley where time moved differently...",
    "genre": "Fantasy",
    "tags": ["magic", "garden", "adventure"]
  }'
```

## 🔍 Query Parameters

### Stories Endpoint
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)
- `search` - Search in title, author, content, tags
- `status` - Filter by status (draft, published, archived)
- `genre` - Filter by genre
- `author` - Filter by author
- `sortBy` - Sort field (createdAt, updatedAt, title, author, wordCount)
- `sortOrder` - Sort direction (asc, desc)

## 📊 Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "message": "Request successful",
  "data": { ... },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

Paginated responses include additional pagination metadata:

```json
{
  "success": true,
  "message": "Stories retrieved successfully",
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 🛡 File Upload Constraints

- **Supported formats**: .txt files only
- **Maximum file size**: 10MB per file
- **Bulk upload limit**: 10 files maximum
- **Content validation**: Files must contain readable text content

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/enchanted-tales` |
| `DATABASE_NAME` | Database name | `enchanted-tales` |
| `PORT` | Server port | `3001` |
| `NODE_ENV` | Environment | `development` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:8080` |
| `MAX_FILE_SIZE` | Max upload size in bytes | `10485760` (10MB) |
| `ALLOWED_FILE_TYPES` | Allowed MIME types | `text/plain` |

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📈 Monitoring

### Health Checks
- System health: `GET /api/v1/health`
- Database health: `GET /api/v1/health/database`

### Statistics
- Story statistics: `GET /api/v1/stories/stats`

## 🔒 Security Features

- Input validation and sanitization
- File type and size validation
- CORS configuration
- Error handling and logging
- Request rate limiting (configurable)

## 🚀 Deployment

### Docker (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "run", "start:prod"]
```

### Environment Setup for Production
1. Set `NODE_ENV=production`
2. Configure production MongoDB URI
3. Set secure JWT secret
4. Configure proper CORS origins
5. Set up process manager (PM2, etc.)

## 🤝 Integration with Frontend

The backend is designed to work seamlessly with the Enchanted Tales React frontend:

1. **CORS configured** for frontend URL
2. **File upload endpoints** match frontend upload functionality
3. **Story format** matches frontend story interface
4. **Pagination** supports frontend infinite scroll/pagination
5. **Search & filtering** powers frontend search functionality

## 📖 API Documentation

Visit http://localhost:3001/api/docs when the server is running to explore the interactive Swagger documentation with:

- Complete endpoint documentation
- Request/response schemas
- Try-it-out functionality
- Authentication examples

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify network connectivity

2. **File Upload Errors**
   - Check file size (max 10MB)
   - Ensure file is .txt format
   - Verify file contains readable content

3. **CORS Issues**
   - Update `FRONTEND_URL` in `.env`
   - Check frontend is running on correct port

## 📄 License

This project is part of the Enchanted Tales application suite.