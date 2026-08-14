# Implementation Plan: Poultry Farm Backend

## Overview

Build a Node.js/Express REST API backend with MongoDB for FreshFlock Farms. The implementation proceeds from project setup and core infrastructure, through data models and authentication, to feature-specific endpoints, and finally integration wiring and seeding. Each task is discrete and builds on prior steps.

## Tasks

- [x] 1. Set up project structure and core infrastructure
  - [x] 1.1 Initialize backend project with package.json, install dependencies, and create directory structure
    - Create `backend/` directory with `src/`, `seeds/`, `tests/` subdirectories
    - Initialize `package.json` with scripts (start, dev, test, seed)
    - Install dependencies: express, mongoose, bcryptjs, jsonwebtoken, cors, dotenv, express-validator
    - Install dev dependencies: jest, supertest, fast-check, mongodb-memory-server, nodemon
    - Create `.env.example` with PORT, MONGO_URI, JWT_SECRET, JWT_EXPIRE
    - Create `jest.config.js` with test environment and coverage thresholds
    - _Requirements: 1.1, 1.4_

  - [x] 1.2 Create Express server entry point with CORS, JSON parsing, and error handling middleware
    - Create `src/server.js` with Express app setup, CORS config, JSON body parser
    - Create `src/config/db.js` with MongoDB connection using Mongoose (exit on failure)
    - Create `src/middleware/errorHandler.js` with centralized error handling (consistent JSON format)
    - Create `src/middleware/validate.js` for express-validator error formatting
    - _Requirements: 1.1, 1.2, 1.3, 1.5_

  - [x] 1.3 Create utility modules (trend calculation and shared validators)
    - Create `src/utils/trendCalculation.js` with `calculateTrend(current, previous)` pure function
    - Create `src/utils/validators.js` with shared validation schemas (date, positiveInt, positiveNumber, email)
    - _Requirements: 3.2_

- [x] 2. Implement data models
  - [x] 2.1 Create User and authentication-related models
    - Create `src/models/User.js` with email (unique), password (hashed), name, role, createdAt
    - Add pre-save hook for bcrypt password hashing
    - Add instance method `matchPassword(enteredPassword)` for login comparison
    - _Requirements: 2.5, 2.6_

  - [x] 2.2 Create production data models (EggProduction, BroilerGrowth, FeedConsumption, Mortality, ProductionRecord)
    - Create `src/models/EggProduction.js` with date (unique), count (min 1), timestamps
    - Create `src/models/BroilerGrowth.js` with batchId, week, weight, compound unique index
    - Create `src/models/FeedConsumption.js` with date, amount, houseId
    - Create `src/models/Mortality.js` with date, count, optional cause
    - Create `src/models/ProductionRecord.js` with date, eggsProduced, birdsAvailable, feedStockTonnes
    - _Requirements: 4.2, 4.3, 5.1, 5.2, 6.1, 6.2, 3.3_

  - [x] 2.3 Create content and order models (BlogPost, Contact, CompanyInfo, Testimonial, Order)
    - Create `src/models/BlogPost.js` with title, content, excerpt, category, readTime, published, timestamps
    - Create `src/models/Contact.js` with name, email, subject, message, read flag, createdAt
    - Create `src/models/CompanyInfo.js` as singleton pattern (name, tagline, phone, email, address, founded)
    - Create `src/models/Testimonial.js` with quote, author, role, initials, approved, timestamps
    - Create `src/models/Order.js` with customerName, productType (enum), quantity, status (enum), statusHistory array, timestamps
    - _Requirements: 7.1, 7.2, 8.1, 8.2, 9.1, 9.2, 10.1, 10.5_

- [x] 3. Implement authentication system
  - [x] 3.1 Create auth middleware for JWT verification
    - Create `src/middleware/auth.js` with `protect` middleware
    - Extract token from Authorization header (Bearer scheme)
    - Verify token with jwt.verify, attach decoded user to req.user
    - Return 401 for missing, expired, or invalid tokens
    - _Requirements: 2.3, 2.4_

  - [x] 3.2 Create auth controller and routes (register, login)
    - Create `src/controllers/authController.js` with register and login handlers
    - Register: validate email uniqueness, password length >= 8, hash password, create user, return JWT
    - Login: find user by email, compare password with bcrypt, return JWT on success, 401 on failure
    - Create `src/routes/auth.js` with POST /register and POST /login
    - _Requirements: 2.1, 2.2, 2.5, 2.6_

  - [x]* 3.3 Write property tests for authentication
    - **Property 1: Password hashing round-trip**
    - **Property 2: Invalid token rejection**
    - **Property 3: Password length validation**
    - **Validates: Requirements 2.4, 2.5, 2.6**

- [x] 4. Checkpoint - Core infrastructure and auth verified
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Implement dashboard and production endpoints
  - [x] 5.1 Create dashboard controller and routes
    - Create `src/controllers/dashboardController.js` with getStats and production CRUD handlers
    - getStats: query ProductionRecord for latest, calculate trends using trendCalculation utility, include pending orders count
    - Create `src/routes/dashboard.js` with GET /stats, POST /production, GET /production (date range filter)
    - Apply auth middleware to all dashboard routes
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 10.4_

  - [x]* 5.2 Write property test for trend calculation
    - **Property 4: Trend calculation correctness**
    - **Validates: Requirements 3.2**

  - [x]* 5.3 Write property test for date-range filtering
    - **Property 5: Date-range filtering invariant**
    - **Validates: Requirements 3.4, 4.1, 6.3, 6.4**

- [x] 6. Implement egg production and broiler growth endpoints
  - [x] 6.1 Create egg production controller and routes
    - Create `src/controllers/eggProductionController.js` with get and create handlers
    - GET: return records sorted by date ascending, support date range query params
    - POST: validate positive integer count, upsert on date (update if exists)
    - Create `src/routes/eggProduction.js` with GET /eggs, POST /eggs (auth protected)
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [x] 6.2 Create broiler growth controller and routes
    - Create `src/controllers/broilerGrowthController.js` with get and create handlers
    - GET: support batchId query param, return most recent batch if no batchId specified
    - POST: validate positive weight, associate with batchId and week
    - Create `src/routes/broilerGrowth.js` with GET /broilers, POST /broilers (auth protected)
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [x] 6.3 Write property tests for validation and uniqueness
    - **Property 6: Positive number validation**
    - **Property 7: Date uniqueness (upsert idempotence)**
    - **Validates: Requirements 4.2, 4.3, 5.2**

  - [x] 6.4 Write property test for sort order
    - **Property 8: Sort order invariant**
    - **Validates: Requirements 4.4, 7.6, 8.4**

- [x] 7. Implement feed, mortality, blog, and contact endpoints
  - [x] 7.1 Create feed consumption and mortality controllers and routes
    - Create `src/controllers/feedController.js` with get (aggregated by day, date range) and create
    - Create `src/controllers/mortalityController.js` with get (aggregated by week, date range) and create
    - Create `src/routes/feed.js` and `src/routes/mortality.js` with GET/POST (auth protected)
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [x] 7.2 Create blog controller and routes (CRUD with public read)
    - Create `src/controllers/blogController.js` with getAll (public), create, update, delete (auth)
    - GET: return published posts sorted by date descending, support category filter
    - POST/PUT: validate title, content, category required; update timestamp on PUT
    - DELETE: remove post from database
    - Create `src/routes/blog.js` with GET (public), POST/PUT/DELETE (auth protected)
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

  - [x] 7.3 Create contact controller and routes (public submit, auth read)
    - Create `src/controllers/contactController.js` with submit (public), getAll (auth), markRead (auth)
    - POST: validate name, email, subject, message required; return 400 with field errors if missing
    - GET: return submissions sorted by date descending
    - PATCH /:id/read: update read flag to true
    - Create `src/routes/contact.js` with POST (public), GET/PATCH (auth protected)
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

  - [x] 7.4 Write property tests for filtering and required fields
    - **Property 9: Category/status filter correctness**
    - **Property 10: Required field validation**
    - **Validates: Requirements 5.3, 7.5, 10.3, 7.2, 8.1, 8.3**

- [x] 8. Checkpoint - Feature endpoints verified
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Implement company info, testimonials, and orders endpoints
  - [x] 9.1 Create company info and testimonials controllers and routes
    - Create `src/controllers/companyController.js` with get (public) and update (auth)
    - Create `src/controllers/testimonialController.js` with getApproved (public), create (auth), update (auth) — note: no separate controller file needed, can be combined in companyController or separate
    - Create `src/routes/company.js` with GET /company (public), PUT /company (auth), GET /testimonials (public), POST/PUT /testimonials (auth)
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

  - [x] 9.2 Create orders controller and routes
    - Create `src/controllers/ordersController.js` with getAll, create, updateStatus handlers
    - POST: store order with customer details, productType (enum validation), quantity, set status to "pending", initialize statusHistory
    - PATCH /:id/status: validate status enum, push to statusHistory with timestamp
    - GET: support status query param filter, return all if no filter
    - Create `src/routes/orders.js` with GET/POST/PATCH (all auth protected)
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

  - [x]* 9.3 Write property tests for orders
    - **Property 11: New order initial status invariant**
    - **Property 12: Order status transition validation**
    - **Property 13: Pending order count consistency**
    - **Validates: Requirements 10.1, 10.2, 10.4**

- [ ] 10. Wire routes into server and create seed script
  - [x] 10.1 Register all route modules in server.js
    - Import and mount all route modules at their respective paths in `src/server.js`
    - Ensure proper order: CORS → JSON parse → routes → error handler
    - Verify server starts correctly with all routes registered
    - _Requirements: 1.1, 1.2, 1.3_

  - [-] 10.2 Create database seed script
    - Create `seeds/seed.js` that connects to MongoDB and populates initial data
    - Seed company info, testimonials, blog posts, sample production records, and default admin user
    - Implement idempotence: check if data exists before seeding, log warning and skip if already populated
    - Add `seed` script to package.json
    - _Requirements: 11.1, 11.2, 11.3, 11.4_

  - [ ]* 10.3 Write property test for seed idempotence
    - **Property 14: Seed script idempotence**
    - **Validates: Requirements 11.4**

- [ ] 11. Integration tests and final verification
  - [ ]* 11.1 Write integration tests for auth flow
    - Test register → login → access protected route → reject with invalid token
    - Use mongodb-memory-server for isolated test database
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [ ]* 11.2 Write integration tests for dashboard and production endpoints
    - Test creating production records and retrieving KPI stats
    - Test date-range filtering
    - _Requirements: 3.1, 3.3, 3.4_

  - [ ]* 11.3 Write integration tests for blog and orders
    - Test full CRUD lifecycle for blog posts
    - Test order creation, status updates, and filtering
    - _Requirements: 7.1, 7.4, 10.1, 10.2, 10.3_

- [ ] 12. Final checkpoint - All tests pass and API is functional
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- All code lives in the `backend/` directory, separate from the existing React frontend
- Uses mongodb-memory-server for test isolation (no external DB needed for tests)
- The seed script must be idempotent to support repeated execution safely

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "1.3"] },
    { "id": 2, "tasks": ["2.1", "2.2", "2.3"] },
    { "id": 3, "tasks": ["3.1", "3.2"] },
    { "id": 4, "tasks": ["3.3"] },
    { "id": 5, "tasks": ["5.1", "6.1", "6.2"] },
    { "id": 6, "tasks": ["5.2", "5.3", "6.3", "6.4", "7.1", "7.2", "7.3"] },
    { "id": 7, "tasks": ["7.4", "9.1", "9.2"] },
    { "id": 8, "tasks": ["9.3", "10.1"] },
    { "id": 9, "tasks": ["10.2"] },
    { "id": 10, "tasks": ["10.3", "11.1", "11.2", "11.3"] }
  ]
}
```
