# Maa Katyaini Dham - Hotel & Event Hall Booking System

A production-grade, scalable hotel and event-hall booking website with an admin panel for "Maa Katyaini Dham" located in Naimisharanya, Uttar Pradesh, India.

## Tech Stack

### Frontend
- **React.js** with Vite
- **React Router** for routing
- **TanStack Query** for data fetching and caching
- **react-hook-form + zod** for form validation
- **Tailwind CSS** for styling (with custom theme system)
- **Clerk** for authentication
- **react-i18next** for bilingual support (English/Hindi)
- **react-helmet-async** for SEO

### Backend
- **Node.js + Express** (ES modules)
- **MongoDB** with Mongoose
- **Clerk** for authentication
- **Cloudinary** for media storage
- **Redis** for rate limiting and caching (with graceful fallback to in-memory)
- **Zod** for validation
- **Pino** for structured logging

## Project Structure

```
/
├─ client/                 # React frontend
│  ├─ public/
│  │  ├─ robots.txt       # SEO robots file
│  │  └─ sitemap.xml     # SEO sitemap
│  ├─ src/
│  │  ├─ app/             # Router, providers, ThemeProvider
│  │  │  ├─ App.jsx
│  │  │  ├─ Router.jsx
│  │  │  └─ ThemeProvider.jsx
│  │  ├─ assets/
│  │  ├─ components/
│  │  │  ├─ ui/           # Reusable UI components
│  │  │  │  ├─ Button.jsx
│  │  │  │  ├─ Input.jsx
│  │  │  │  ├─ Modal.jsx
│  │  │  │  ├─ Card.jsx
│  │  │  │  ├─ Badge.jsx
│  │  │  │  ├─ Skeleton.jsx
│  │  │  │  ├─ Select.jsx
│  │  │  │  ├─ DatePicker.jsx
│  │  │  │  ├─ LoadingSpinner.jsx
│  │  │  │  └─ Alert.jsx
│  │  │  └─ layout/       # Header, Footer, AdminLayout
│  │  │     ├─ Header.jsx
│  │  │     ├─ Footer.jsx
│  │  │     ├─ MainLayout.jsx
│  │  │     └─ AdminLayout.jsx
│  │  ├─ features/        # Feature-based modules
│  │  │  ├─ rooms/
│  │  │  │  ├─ api.js
│  │  │  │  └─ hooks/
│  │  │  │     └─ useRooms.js
│  │  │  ├─ halls/
│  │  │  │  ├─ api.js
│  │  │  │  └─ hooks/
│  │  │  │     └─ useHalls.js
│  │  │  ├─ bookings/
│  │  │  │  └─ api.js
│  │  │  └─ admin/
│  │  │     ├─ api.js
│  │  │     └─ pages/
│  │  │        ├─ Dashboard.jsx
│  │  │        ├─ Bookings.jsx
│  │  │        ├─ Rooms.jsx
│  │  │        ├─ Halls.jsx
│  │  │        ├─ Availability.jsx
│  │  │        └─ Settings.jsx
│  │  ├─ pages/           # Public pages
│  │  │  ├─ Home.jsx
│  │  │  ├─ Rooms.jsx
│  │  │  ├─ RoomDetail.jsx
│  │  │  ├─ Halls.jsx
│  │  │  ├─ HallDetail.jsx
│  │  │  ├─ BookingSummary.jsx
│  │  │  ├─ MyBookings.jsx
│  │  │  ├─ BookingDetail.jsx
│  │  │  ├─ Gallery.jsx
│  │  │  ├─ About.jsx
│  │  │  ├─ Contact.jsx
│  │  │  ├─ Terms.jsx
│  │  │  └─ Privacy.jsx
│  │  ├─ hooks/
│  │  ├─ lib/
│  │  │  ├─ api.js
│  │  │  └─ i18n.js
│  │  ├─ utils/
│  │  ├─ locales/
│  │  │  ├─ en.json
│  │  │  └─ hi.json
│  │  ├─ constants/
│  │  ├─ styles/
│  │  │  └─ theme.css      # Single global stylesheet
│  │  └─ main.jsx
│  ├─ .env.example
│  ├─ index.html
│  ├─ package.json
│  ├─ postcss.config.js
│  ├─ tailwind.config.js
│  └─ vite.config.js
├─ server/                # Express backend
│  ├─ src/
│  │  ├─ config/          # env, db, cloudinary, redis, logger
│  │  │  ├─ env.js
│  │  │  ├─ db.js
│  │  │  ├─ redis.js
│  │  │  └─ cloudinary.js
│  │  ├─ models/          # Mongoose models
│  │  │  ├─ Room.js
│  │  │  ├─ Hall.js
│  │  │  ├─ Booking.js
│  │  │  ├─ Availability.js
│  │  │  └─ Settings.js
│  │  ├─ modules/         # Feature-based modules
│  │  │  ├─ rooms/
│  │  │  │  ├─ service.js
│  │  │  │  ├─ controller.js
│  │  │  │  ├─ routes.js
│  │  │  │  └─ validation.js
│  │  │  ├─ halls/
│  │  │  │  ├─ service.js
│  │  │  │  ├─ controller.js
│  │  │  │  ├─ routes.js
│  │  │  │  └─ validation.js
│  │  │  ├─ bookings/
│  │  │  │  ├─ service.js
│  │  │  │  ├─ controller.js
│  │  │  │  ├─ routes.js
│  │  │  │  └─ validation.js
│  │  │  ├─ availability/
│  │  │  │  ├─ service.js
│  │  │  │  ├─ controller.js
│  │  │  │  └─ routes.js
│  │  │  ├─ admin/
│  │  │  │  ├─ service.js
│  │  │  │  ├─ controller.js
│  │  │  │  └─ routes.js
│  │  │  ├─ settings/
│  │  │  │  ├─ service.js
│  │  │  │  ├─ controller.js
│  │  │  │  └─ routes.js
│  │  │  ├─ uploads/
│  │  │  │  ├─ service.js
│  │  │  │  ├─ controller.js
│  │  │  │  ├─ routes.js
│  │  │  │  └─ validation.js
│  │  │  └─ webhooks/
│  │  │     ├─ controller.js
│  │  │     └─ routes.js
│  │  ├─ middlewares/     # auth, validation, error handling
│  │  │  ├─ auth.js
│  │  │  ├─ validate.js
│  │  │  ├─ errorHandler.js
│  │  │  ├─ notFound.js
│  │  │  └─ requestId.js
│  │  ├─ jobs/            # Background jobs
│  │  │  └─ bookingExpirySweeper.js
│  │  ├─ utils/           # ApiError, ApiResponse, asyncHandler
│  │  │  ├─ ApiError.js
│  │  │  ├─ ApiResponse.js
│  │  │  ├─ asyncHandler.js
│  │  │  ├─ dateUtils.js
│  │  │  └─ logger.js
│  │  ├─ scripts/         # Database scripts
│  │  │  └─ seed.js
│  │  ├─ app.js
│  │  └─ server.js
│  ├─ tests/
│  ├─ .env.example
│  └─ package.json
├─ .env.example
└─ README.md
```

## Features

### Public Features
- **Room Booking**: Browse and book AC/Non-AC rooms, family rooms, dormitories
- **Event Hall Booking**: Book halls for weddings, ceremonies, events with morning/evening/full-day slots
- **Booking Flow**: WhatsApp-based confirmation system with advance payment
- **Gallery**: Photo gallery of the property
- **Bilingual UI**: English and Hindi language support
- **Dark/Light Mode**: Theme toggle with system preference detection
- **My Bookings**: View and manage personal bookings
- **Responsive Design**: Mobile-first, fully responsive

### Admin Features
- **Dashboard**: Overview of bookings, revenue, and statistics
- **Booking Management**: View, confirm, reject, cancel bookings with UPI reference tracking
- **Room Management**: CRUD operations for rooms with Cloudinary image uploads
- **Hall Management**: CRUD operations for halls with Cloudinary image uploads
- **Availability Calendar**: Manual blocking and availability management
- **Settings**: Configure WhatsApp number, advance percentage, hold duration

### Technical Features
- **Atomic Inventory Management**: No double-booking with MongoDB transactions
- **Rate Limiting**: Redis-backed rate limiting with graceful fallback
- **Caching**: Redis or in-memory caching for public endpoints
- **Security**: Helmet, CORS, input sanitization, Clerk authentication
- **SEO**: Meta tags, Open Graph, JSON-LD, sitemap
- **Performance**: Code splitting, lazy loading, image optimization
- **Scalability**: Stateless server ready for horizontal scaling

## Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB (local or MongoDB Atlas)
- Clerk account for authentication
- Cloudinary account for media storage
- Redis (optional, for enhanced caching)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd "Maa Katyaini Dham"
```

2. **Install dependencies**

Client:
```bash
cd client
npm install
```

Server:
```bash
cd server
npm install
```

3. **Set up environment variables**

Create `.env` files in both `client/` and `server/` directories using the provided `.env.example` files:

**Client `.env`:**
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_URL=http://localhost:5000
```

**Server `.env`:**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/maa-katyaini-dham
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
REDIS_URL=redis://localhost:6379
CORS_ORIGIN=http://localhost:3000
BOOKING_HOLD_DURATION_MINUTES=30
ADVANCE_PAYMENT_PERCENTAGE=25
WHATSAPP_OWNER_NUMBER=+919876543210
LOG_LEVEL=info
```

4. **Start the development servers**

Server (in one terminal):
```bash
cd server
npm run dev
```

Client (in another terminal):
```bash
cd client
npm run dev
```

The frontend will be available at `http://localhost:3000` and the backend at `http://localhost:5000`.

## Deployment

### Frontend (Vercel/Netlify)
1. Build the client: `cd client && npm run build`
2. Deploy the `dist/` folder to Vercel or Netlify
3. Set environment variables in the deployment platform
4. Update CORS_ORIGIN in server `.env` to the deployed frontend URL

### Backend (Render/Railway/VPS)
1. Deploy the server to a Node.js hosting platform
2. Set all environment variables
3. Ensure MongoDB Atlas is accessible
4. Configure Redis if using a managed Redis service
5. Set up a process manager like PM2 for production

### MongoDB Atlas
1. Create a free MongoDB Atlas account
2. Create a cluster and database
3. Whitelist your IP addresses
4. Get the connection string and add to `.env`

### Clerk Setup
1. Create a Clerk account
2. Create a new application
3. Enable email/password authentication
4. Add custom metadata field `role` for admin access
5. Configure webhook for user sync
6. Add keys to `.env`

### Cloudinary Setup
1. Create a Cloudinary account
2. Get API credentials from dashboard
3. Add to `.env`

## Booking Flow

1. **Guest Signs In**: User authenticates via Clerk
2. **Selects Resource**: Chooses room type or hall with dates/slot
3. **Submits Booking**: Server creates PENDING booking with hold expiry
4. **WhatsApp Redirect**: User redirected to WhatsApp with booking details
5. **Payment**: Guest pays advance via UPI as guided on WhatsApp
6. **Admin Confirmation**: Owner verifies payment, enters UPI reference, confirms booking
7. **Status Update**: Booking becomes CONFIRMED, inventory permanently reserved

**Booking Statuses:**
- `PENDING`: Hold created, awaiting confirmation
- `CONFIRMED`: Payment verified, booking confirmed
- `REJECTED`: Booking rejected by admin
- `CANCELLED`: Booking cancelled by user or admin
- `EXPIRED`: Hold expired without confirmation

## Security Features

- Clerk session verification on all protected routes
- Role-based admin access enforced server-side
- Rate limiting on all endpoints (stricter on booking creation)
- Input validation with Zod on all endpoints
- MongoDB transaction support for atomic operations
- Helmet for security headers
- CORS configuration
- Express-mongo-sanitize for NoSQL injection prevention
- HPP for HTTP parameter pollution protection
- Body size limits
- Structured logging with request IDs

## Performance Optimizations

- Route-level code splitting with React.lazy
- TanStack Query caching with sensible staleTime
- Redis or in-memory caching for public endpoints
- MongoDB indexes on all query fields
- Field projection and lean queries
- Cursor-based pagination
- Image lazy-loading and optimization
- Gzip/brotli compression
- ETag and Cache-Control headers

## Testing

Run server tests:
```bash
cd server
npm test
```

## Seed Database

To populate the database with sample data:
```bash
cd server
npm run seed
```

This will create:
- 5 room types (Deluxe AC, Standard AC, Non-AC, Family Suite, Dormitory)
- 3 event halls (Grand Hall, Celebration Hall, Spiritual Hall)
- Default settings for WhatsApp, advance payment, and policies

## API Documentation

### Public Endpoints

**Rooms:**
- `GET /api/rooms` - List all rooms (with filtering/pagination)
- `GET /api/rooms/:id` - Get room details
- `GET /api/rooms/types` - Get room types

**Halls:**
- `GET /api/halls` - List all halls (with filtering/pagination)
- `GET /api/halls/:id` - Get hall details
- `GET /api/halls/types` - Get hall types

**Bookings:**
- `POST /api/bookings` - Create a booking (requires auth)
- `GET /api/bookings` - Get user's bookings (requires auth)
- `GET /api/bookings/:id` - Get booking details (requires auth)
- `POST /api/bookings/:id/cancel` - Cancel booking (requires auth)

**Availability:**
- `GET /api/availability` - Check availability

**Settings:**
- `GET /api/settings` - Get public settings

### Admin Endpoints (requires admin role)

**Admin:**
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/booking-stats` - Booking statistics with date range

**Bookings:**
- `GET /api/bookings/admin/all` - List all bookings
- `POST /api/bookings/:id/confirm` - Confirm booking with UPI reference
- `POST /api/bookings/:id/reject` - Reject booking
- `POST /api/bookings/:id/cancel/admin` - Cancel booking (admin)

**Rooms:**
- `POST /api/rooms` - Create room
- `PUT /api/rooms/:id` - Update room
- `DELETE /api/rooms/:id` - Delete room (soft delete)

**Halls:**
- `POST /api/halls` - Create hall
- `PUT /api/halls/:id` - Update hall
- `DELETE /api/halls/:id` - Delete hall (soft delete)

**Settings:**
- `GET /api/settings/admin` - Get all settings
- `PUT /api/settings` - Update settings

**Availability:**
- `GET /api/availability/calendar` - Get availability calendar
- `POST /api/availability/block` - Block dates manually
- `POST /api/availability/unblock` - Unblock dates

**Uploads:**
- `POST /api/uploads` - Upload image to Cloudinary
- `DELETE /api/uploads` - Delete image from Cloudinary
- `GET /api/uploads/signature` - Generate upload signature

## Load Testing

Load testing script (to be implemented):
```bash
cd server
npm run load-test
```

## Theme Customization

The application uses a custom "Naimisha Sage" theme defined in `client/src/styles/theme.css`. Theme colors are mapped to Tailwind semantic classes:

### Light Theme
- `bg-bg`: #F7F5F0 (Background)
- `bg-surface`: #FFFFFF (Surface)
- `bg-surface-alt`: #EFECE4 (Alternate Surface)
- `bg-primary`: #1F4D3F (Primary Forest Green)
- `bg-primary-hover`: #163A2F (Primary Hover)
- `text-primary-fg`: #ECEFEA (Primary Foreground)
- `bg-accent`: #C9702F (Accent Terracotta)
- `bg-accent-soft`: #F3E3D0 (Accent Soft)
- `text-text`: #1B1F1D (Text)
- `text-muted`: #6B716D (Muted)
- `border-border`: #E4E0D6 (Border)
- `text-success`: #2F8F5B (Success)
- `text-warning`: #C98A1B (Warning)
- `text-danger`: #B5483F (Danger)
- `text-neutral`: #8A8F8B (Neutral)

### Dark Theme
- `bg-bg`: #0F1412 (Background)
- `bg-surface`: #161D1A (Surface)
- `bg-surface-alt`: #1E2723 (Alternate Surface)
- `bg-primary`: #5FB08F (Primary Sage)
- `bg-primary-hover`: #7CC4A5 (Primary Hover)
- `text-primary-fg`: #0B1210 (Primary Foreground)
- `bg-accent`: #E39A57 (Accent)
- `bg-accent-soft`: #2B2118 (Accent Soft)
- `text-text`: #ECEFEA (Text)
- `text-muted`: #9AA39D (Muted)
- `border-border`: #2A3430 (Border)

To customize colors, edit the CSS variables in `client/src/styles/theme.css`.

## Troubleshooting

### Common Issues

**Clerk Authentication Issues:**
- Ensure `CLERK_SECRET_KEY` and `CLERK_PUBLISHABLE_KEY` are correctly set in server `.env`
- Verify webhook secret matches Clerk dashboard
- Check CORS_ORIGIN includes your frontend URL

**MongoDB Connection Errors:**
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas IP whitelist includes your IP
- Ensure database user has correct permissions

**Cloudinary Upload Errors:**
- Verify Cloudinary API credentials are correct
- Check upload limits and file size restrictions
- Ensure `CLOUDINARY_CLOUD_NAME` is set

**Redis Connection Errors:**
- If Redis is not available, the system gracefully falls back to in-memory caching
- To use Redis, ensure `REDIS_URL` is set correctly
- Check Redis server is running and accessible

**Theme Not Applying:**
- Ensure `client/src/styles/theme.css` is imported in `main.jsx`
- Check Tailwind v4 configuration in `tailwind.config.js`
- Verify CSS variables are defined in `:root` and `.dark` classes

## Development Workflow

1. **Feature Development:**
   - Create feature folders in `client/src/features/` and `server/src/modules/`
   - Follow the established pattern: api/hooks/components (frontend) or service/controller/routes (backend)
   - Use existing UI components from `client/src/components/ui/`

2. **Adding New Pages:**
   - Add page component to `client/src/pages/`
   - Update `client/src/app/Router.jsx` with new route
   - Add navigation link in `client/src/components/layout/Header.jsx`

3. **Database Changes:**
   - Update models in `server/src/models/`
   - Run seed script to test: `npm run seed`
   - Update API controllers/services accordingly

4. **Environment Variables:**
   - Add new variables to `.env.example`
   - Update `server/src/config/env.js` with validation schema
   - Document in README

## License

ISC

## Support

For support, please contact info@maakatyainidham.com
