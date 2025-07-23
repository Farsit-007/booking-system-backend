# Resource Booking System

A full-stack web application for booking shared resources with conflict detection and buffer time logic. Built with Next.js, TypeScript, and PostgreSQL.

## 🚀 Live Demo

- [Front-end](https://mini-booking-app-pearl.vercel.app/)
- [Back-end](https://booking-app-eight-ivory.vercel.app)

## 🚀 Github Repo 

- [Front-end](https://github.com/Farsit-007/booking-system-frontend)
- [Back-end](https://github.com/Farsit-007/booking-system-backend)

## 📋 Features

### Core Features
- **Resource Booking Form**: Book time slots for shared resources (rooms, devices, etc.)
- **Conflict Detection**: Prevents overlapping bookings with 10-minute buffer zones
- **Booking Dashboard**: View, filter, and manage all bookings
- **Real-time Status**: Shows "Upcoming", "Ongoing", or "Past" status for bookings
- **Form Validation**: Ensures proper time ranges and minimum 15-minute duration

### Buffer Time Logic
The system implements a 10-minute buffer before and after each booking to prevent back-to-back conflicts:
- If a resource is booked from 2:00 PM to 3:00 PM
- The system blocks 1:50 PM to 3:10 PM (including buffers)
- New bookings must start after 3:10 PM or end before 1:50 PM

### Advanced Features
- **Booking Cancellation**: Delete existing bookings
- **Resource Filtering**: Filter bookings by resource type and date
- **Persistent Storage**: PostgreSQL database with Prisma ORM
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Deployment**: Vercel (Frontend), Render (Database)
- **Validation**: Zod for type-safe validation

## 📁 Project Structure

```
booking-system/
├── README.md
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── booking/
│   │   │   └── page.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   └── api/
│   │       ├── bookings/
│   │       │   ├── route.ts
│   │       │   └── [id]/
│   │       │       └── route.ts
│   │       └── available-slots/
│   │           └── route.ts
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   └── card.tsx
│   │   ├── BookingForm.tsx
│   │   ├── BookingDashboard.tsx
│   │   ├── BookingCard.tsx
│   │   └── Navigation.tsx
│   ├── lib/
│   │   ├── utils.ts
│   │   ├── db.ts
│   │   └── validations.ts
│   └── types/
│       └── booking.ts
├── public/
│   └── favicon.ico
└── .env.example
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL database

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd booking-system
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Frontend Environment Variables
NEXT_PUBLIC_BASE_API=https://booking-app-eight-ivory.vercel.app/api

# Backend Environment Variables
NODE_ENV=production
PORT=5000
DATABASE_URL=""
```

### 4. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push



### 5. Development Server
```bash
npm run dev
# or
yarn dev
```

Visit [https://mini-booking-app-pearl.vercel.app/](https://mini-booking-app-pearl.vercel.app/) to view the application.

## 📖 API Documentation

### Endpoints

#### `POST /api/bookings`
Create a new booking with conflict detection.

**Request Body:**
```json
{
  "resource": "Conference Room A",
  "startTime": "2024-01-15T14:00:00.000Z",
  "endTime": "2024-01-15T15:00:00.000Z",
  "requestedBy": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "booking": {
    "id": "1",
    "resource": "Conference Room A",
    "startTime": "2024-01-15T14:00:00.000Z",
    "endTime": "2024-01-15T15:00:00.000Z",
    "requestedBy": "John Doe",
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
}
```

#### `GET /api/bookings`
Retrieve all bookings with optional filtering.

**Query Parameters:**
- `resource` (optional): Filter by resource name
- `date` (optional): Filter by date (YYYY-MM-DD)

**Response:**
```json
{
  "bookings": [
    {
      "id": "1",
      "resource": "Conference Room A",
      "startTime": "2024-01-15T14:00:00.000Z",
      "endTime": "2024-01-15T15:00:00.000Z",
      "requestedBy": "John Doe",
      "createdAt": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

#### `DELETE /api/bookings/[id]`
Cancel/delete a specific booking.

**Response:**
```json
{
  "success": true,
  "message": "Booking cancelled successfully"
}
```

#### `GET /api/available-slots`
Get available time slots for a resource on a specific date.

**Query Parameters:**
- `resource` (required): Resource name
- `date` (required): Date (YYYY-MM-DD)

## 🎯 Usage

### Creating a Booking
1. Navigate to the booking form
2. Select a resource from the dropdown
3. Choose start and end times (minimum 15 minutes)
4. Enter your name in "Requested By"
5. Submit the form

### Viewing Bookings
1. Go to the Dashboard
2. Filter by resource or date if needed
3. View booking status (Upcoming/Ongoing/Past)
4. Cancel bookings if necessary

### Conflict Detection
The system automatically prevents:
- Overlapping time slots
- Bookings within 10-minute buffer zones
- Invalid time ranges (end before start)
- Bookings shorter than 15 minutes

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Database (Render)
- PostgreSQL database hosted on Render
- Connection string provided in environment variables



## 📝 Features Breakdown

### ✅ Implemented Features
- [x] Booking form with validation
- [x] Conflict detection with buffer time
- [x] Booking dashboard with filtering
- [x] Status indicators (Upcoming/Ongoing/Past)
- [x] Booking cancellation
- [x] PostgreSQL integration
- [x] API endpoints for all operations
- [x] Responsive design
- [x] TypeScript throughout


## 📄 License

This project is created for educational purposes as part of a coding assessment.

## 👥 Contributing

This is a demo project created for assessment purposes. For production use, consider implementing additional security measures, error handling, and testing.

---

**Built with ❤️ using Next.js, TypeScript, and PostgreSQL**