# Requirements Document

## Introduction

FreshFlock Farms is an existing React frontend application for a poultry farm business in Accra, Ghana. Currently all data (company info, dashboard statistics, production data, blog posts, testimonials) is hardcoded in the frontend. This backend will provide a RESTful API server with persistent database storage, user authentication for the dashboard, and CRUD operations to replace the hardcoded data and enable dynamic content management.

## Glossary

- **API_Server**: The Node.js/Express backend application that serves RESTful endpoints
- **Database**: The persistent data store (PostgreSQL or MongoDB) holding all farm operational data
- **Auth_Module**: The authentication and authorization subsystem handling user login and access control
- **Dashboard_API**: The set of endpoints serving real-time farm operational data (KPIs, charts)
- **Admin_User**: A farm staff member with credentials to access the dashboard and manage data
- **Public_Visitor**: An unauthenticated user browsing the public-facing website pages
- **Contact_Submission**: A message sent through the website contact form
- **Production_Record**: A daily entry tracking egg output, bird count, feed usage, and mortality

## Requirements

### Requirement 1: API Server Setup

**User Story:** As a developer, I want a well-structured backend server, so that the frontend can fetch data from API endpoints instead of hardcoded files.

#### Acceptance Criteria

1. THE API_Server SHALL expose RESTful endpoints on a configurable port (default 5000)
2. THE API_Server SHALL enable CORS to allow requests from the frontend origin
3. THE API_Server SHALL return JSON responses with appropriate HTTP status codes
4. THE API_Server SHALL use environment variables for configuration (port, database URL, JWT secret)
5. IF the API_Server fails to connect to the Database, THEN THE API_Server SHALL log the error and exit with a non-zero status code

### Requirement 2: User Authentication

**User Story:** As an admin user, I want to securely log in to the dashboard, so that only authorized staff can view and manage farm operations data.

#### Acceptance Criteria

1. WHEN an Admin_User provides valid credentials, THE Auth_Module SHALL return a JWT access token
2. WHEN an Admin_User provides invalid credentials, THE Auth_Module SHALL return a 401 status with an error message
3. WHILE a request carries a valid JWT token, THE API_Server SHALL grant access to protected endpoints
4. IF a request carries an expired or invalid JWT token, THEN THE API_Server SHALL return a 401 status and reject the request
5. THE Auth_Module SHALL hash passwords using bcrypt before storing them in the Database
6. WHEN an Admin_User registers, THE Auth_Module SHALL validate that the email is unique and the password meets minimum length (8 characters)

### Requirement 3: Dashboard Statistics API

**User Story:** As an admin user, I want to view real-time farm KPIs on the dashboard, so that I can monitor daily operations at a glance.

#### Acceptance Criteria

1. WHEN an authenticated request is made to the dashboard endpoint, THE Dashboard_API SHALL return current KPI data (eggs produced today, birds available, orders pending, feed stock)
2. THE Dashboard_API SHALL include trend percentages comparing current values to the previous period
3. WHEN an Admin_User submits a new Production_Record, THE Dashboard_API SHALL store the record in the Database
4. THE Dashboard_API SHALL return production records filtered by date range when requested

### Requirement 4: Egg Production Data API

**User Story:** As an admin user, I want to record and retrieve daily egg production data, so that I can track output trends over time.

#### Acceptance Criteria

1. WHEN an authenticated request is made for egg production data, THE API_Server SHALL return daily egg counts for the requested time period
2. WHEN an Admin_User submits a new daily egg count, THE API_Server SHALL validate that the count is a positive integer and store the record
3. IF a duplicate entry exists for the same date, THEN THE API_Server SHALL update the existing record instead of creating a duplicate
4. THE API_Server SHALL return egg production data sorted by date in ascending order

### Requirement 5: Broiler Growth Data API

**User Story:** As an admin user, I want to track broiler weight data week by week, so that I can monitor flock growth performance.

#### Acceptance Criteria

1. WHEN an authenticated request is made for broiler growth data, THE API_Server SHALL return weekly weight records for the specified batch
2. WHEN an Admin_User submits broiler weight data, THE API_Server SHALL validate that the weight is a positive number and associate the record with a batch identifier
3. THE API_Server SHALL support querying broiler data by batch identifier
4. IF a batch identifier is not provided in the query, THEN THE API_Server SHALL return data for the most recent batch

### Requirement 6: Feed and Mortality Tracking API

**User Story:** As an admin user, I want to log feed consumption and mortality rates, so that I can optimize operations and detect health issues early.

#### Acceptance Criteria

1. WHEN an Admin_User submits daily feed consumption data, THE API_Server SHALL store the record with the date, amount in tonnes, and house identifier
2. WHEN an Admin_User submits mortality data, THE API_Server SHALL store the record with the date, count, and cause if provided
3. THE API_Server SHALL return feed consumption data aggregated by day for a requested time period
4. THE API_Server SHALL return mortality rate data aggregated by week for a requested time period

### Requirement 7: Blog Posts API

**User Story:** As an admin user, I want to create and manage blog posts, so that the website content stays fresh and relevant for visitors.

#### Acceptance Criteria

1. THE API_Server SHALL expose a public endpoint that returns published blog posts with title, excerpt, category, date, and read time
2. WHEN an Admin_User creates a blog post, THE API_Server SHALL validate that title, content, and category are provided
3. WHEN an Admin_User updates a blog post, THE API_Server SHALL update the modified timestamp
4. WHEN an Admin_User deletes a blog post, THE API_Server SHALL remove the post from the Database
5. THE API_Server SHALL support filtering blog posts by category
6. THE API_Server SHALL return blog posts sorted by date in descending order (newest first)

### Requirement 8: Contact Form Submissions API

**User Story:** As a public visitor, I want to submit a contact form, so that I can reach the farm team with inquiries or orders.

#### Acceptance Criteria

1. WHEN a Public_Visitor submits a contact form, THE API_Server SHALL validate that name, email, subject, and message fields are present
2. WHEN a valid Contact_Submission is received, THE API_Server SHALL store the submission in the Database with a timestamp
3. IF required fields are missing from a Contact_Submission, THEN THE API_Server SHALL return a 400 status with field-level error messages
4. WHEN an Admin_User requests contact submissions, THE API_Server SHALL return submissions sorted by date descending
5. WHEN an Admin_User marks a Contact_Submission as read, THE API_Server SHALL update the submission status

### Requirement 9: Company Information and Testimonials API

**User Story:** As a developer, I want company info and testimonials served from the backend, so that the content can be updated without redeploying the frontend.

#### Acceptance Criteria

1. THE API_Server SHALL expose a public endpoint returning company information (name, tagline, phone, email, address, founded year)
2. THE API_Server SHALL expose a public endpoint returning approved testimonials with quote, author, role, and initials
3. WHEN an Admin_User creates or updates a testimonial, THE API_Server SHALL store the change in the Database
4. WHEN an Admin_User updates company information, THE API_Server SHALL store the updated values in the Database

### Requirement 10: Orders Management API

**User Story:** As an admin user, I want to manage customer orders, so that I can track pending, confirmed, and completed orders.

#### Acceptance Criteria

1. WHEN an Admin_User creates an order, THE API_Server SHALL store the order with customer details, product type (eggs or broilers), quantity, and status (pending)
2. WHEN an Admin_User updates an order status, THE API_Server SHALL validate that the new status is one of: pending, confirmed, processing, completed, or cancelled
3. THE API_Server SHALL return orders filtered by status when requested
4. THE API_Server SHALL return a count of pending orders for the dashboard KPI
5. WHEN an order status changes, THE API_Server SHALL record the timestamp of the status change

### Requirement 11: Database Seeding

**User Story:** As a developer, I want a seeding script that populates the database with initial data, so that the application works immediately after setup.

#### Acceptance Criteria

1. WHEN the seed script is executed, THE Database SHALL be populated with initial company information matching the current frontend data
2. WHEN the seed script is executed, THE Database SHALL be populated with sample testimonials, blog posts, and dashboard data
3. WHEN the seed script is executed, THE Database SHALL create a default Admin_User account
4. IF the Database already contains data, THEN the seed script SHALL skip seeding and log a warning message
