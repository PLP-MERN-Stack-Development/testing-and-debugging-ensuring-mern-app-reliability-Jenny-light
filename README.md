# 🐛 MERN Bug Tracker

A full-stack bug tracking application built with MongoDB, Express, React, and Node.js. Features comprehensive testing, error handling, and debugging capabilities.

## 📋 Features

- ✨ Create, read, update, and delete bug reports
- 🔄 Real-time status updates (Open, In Progress, Resolved)
- 🎯 Priority levels (Low, Medium, High, Critical)
- 🔍 Filter bugs by status
- 🎨 Modern, responsive UI
- 🧪 Comprehensive test coverage
- 🐳 Docker support
- 🔒 Error boundaries and error handling
- 📊 Debugging tools integration

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB 6.0+
- Docker (optional)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/PLP-MERN-Stack-Development/testing-and-debugging-ensuring-mern-app-reliability-Jenny-light.git
cd mern-bug-tracker
```

2. Install dependencies:
```bash
npm run install:all
```

3. Set up environment variables:
```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

4. Start MongoDB:
```bash
mongod --dbpath /path/to/data
```

5. Run the application:
```bash
npm run dev
```

- Backend: http://localhost:5000
- Frontend: http://localhost:5173

## 🐳 Docker Setup

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🧪 Testing

### Run all tests:
```bash
npm test
```

### Backend tests only:
```bash
npm run test:backend
```

### Frontend tests only:
```bash
npm run test:frontend
```

### Coverage reports:
```bash
npm run test:coverage
```

## 🐛 Debugging

### Backend Debugging

**Using Node Inspector:**
```bash
cd backend
node --inspect src/server.js
```
Then open `chrome://inspect` in Chrome.

**Using VS Code:**
Press F5 or use the Debug panel with provided launch configurations.

### Frontend Debugging

- Install React DevTools browser extension
- Use Chrome DevTools Network tab for API inspection
- Check Console for logs and errors
- Set breakpoints in Sources tab

### Common Issues

**Port already in use:**
```bash
npx kill-port 5000
```

**MongoDB connection failed:**
```bash
mongod --dbpath /data/db
```

**CORS errors:**
Check backend CORS configuration and frontend API URL.

## 📁 Project Structure

```
mern-bug-tracker/
├── backend/
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Express middleware
│   │   ├── utils/          # Helper functions
│   │   └── server.js       # Entry point
│   └── tests/              # Backend tests
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API services
│   │   ├── tests/          # Component tests
│   │   └── App.jsx         # Main component
│   └── public/             # Static assets
└── docker-compose.yml      # Docker configuration
```

## 🔧 API Endpoints

### Bugs

- `GET /api/bugs` - Get all bugs
- `GET /api/bugs/:id` - Get bug by ID
- `POST /api/bugs` - Create new bug
- `PUT /api/bugs/:id` - Update bug
- `DELETE /api/bugs/:id` - Delete bug

### Health Check

- `GET /api/health` - Server health status

## 🎨 Technology Stack

**Backend:**
- Node.js & Express
- MongoDB & Mongoose
- Jest & Supertest (testing)

**Frontend:**
- React 18
- Axios
- Vitest & React Testing Library

**DevOps:**
- Docker & Docker Compose
- GitHub Actions (CI/CD)
- ESLint (linting)

## 📝 Testing Best Practices Implemented

1. **Unit Tests**: Individual function testing with mocking
2. **Integration Tests**: API endpoint testing with test database
3. **Component Tests**: React component testing with user interactions
4. **Error Handling**: Comprehensive error boundaries and middleware
5. **Code Coverage**: Aim for 80%+ coverage

## 🚨 Debugging Features

- Console logging throughout the application
- Error boundaries for React components
- Express error handling middleware
- Request/Response interceptors
- Chrome DevTools integration
- Node.js inspector support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for new features
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

MIT License

## 👥 Authors

Jennifer

## 🙏 Acknowledgments

- MERN Stack documentation
- Jest and Vitest communities
- React Testing Library
