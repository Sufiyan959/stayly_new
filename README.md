# Stayly

Stayly is a full-stack real estate listing platform where users can sign up, create and manage property listings, upload images, and browse listings with search and filter options.

## Features

- User authentication with JWT (cookie-based + bearer fallback)
- Protected user dashboard and routes
- Create, update, delete, and view listings
- Multi-image upload for listings using Cloudinary
- User profile updates (including avatar upload)
- Listing search with filters, sorting, and pagination
- Listing contact flow in frontend (WhatsApp link)

## Tech Stack

### Frontend
- React 19 + Vite
- React Router
- Redux Toolkit + redux-persist
- TailwindCSS
- Axios
- Swiper

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT + cookie-parser
- Multer + Cloudinary
- CORS + dotenv
- Twilio config (present in codebase, currently not wired to route handlers)

## Project Structure

```text
stayly/
├── api/
│   ├── config/          # cloudinary, twilio
│   ├── controllers/     # auth, user, listing
│   ├── models/          # user, listing schemas
│   ├── routes/          # auth, user, listing endpoints
│   └── utils/           # auth middleware, upload middleware, helpers
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── redux/
│   └── vite.config.js
├── package.json         # backend scripts/dependencies
└── README.md
```

## Environment Variables

Create a `.env` file in the project root:

```env
MONGO_URI=mongodb://127.0.0.1:27017/stayly
JWT_SECRET=replace-with-strong-secret
NODE_ENV=development

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
CLOUDINARY_FOLDER=stayly

TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone
```

## Installation

Install backend dependencies from root:

```bash
npm install
```

Install frontend dependencies:

```bash
cd client
npm install
```

## Running Locally

Start backend (from root):

```bash
npm run dev
```

Start frontend (from `client`):

```bash
npm run dev
```

Default local URLs:
- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:3000](http://localhost:3000)

## Scripts

### Root (`package.json`)
- `npm run dev` - start backend with nodemon
- `npm start` - start backend with node

### Client (`client/package.json`)
- `npm run dev` - start Vite dev server
- `npm run build` - build production bundle
- `npm run preview` - preview production build
- `npm run lint` - run ESLint

## Frontend Routes

- `/` - Home
- `/about` - About
- `/search` - Search listings
- `/listing/:listingId` - Listing details
- `/sign-in` - Sign in
- `/sign-up` - Sign up
- `/profile` - User profile (protected)
- `/create-listing` - Create listing (protected)
- `/update-listing/:listingId` - Update listing (protected)

## API Endpoints

Base URL: `http://localhost:3000`

### Auth (`/api/auth`)
- `POST /signup`
- `POST /signin`
- `GET /signout`
- `GET /me` (protected)

### User (`/api/user`)
- `GET /test`
- `POST /update/:id` (protected, accepts `avatar` file)
- `DELETE /delete/:id` (protected)
- `GET /listings/:id` (protected)
- `GET /:id` (protected)

### Listing (`/api/listing`)
- `POST /create` (protected)
- `DELETE /delete/:id` (protected)
- `POST /update/:id` (protected)
- `GET /get/:id`
- `GET /get` (search/filter/sort/pagination)
- `POST /upload` (protected, accepts `images` array up to 6)

## Notes

- Backend runs on fixed port `3000` in current code.
- Vite proxy forwards `/api` and `/uploads` to `http://localhost:3000`.
- `POST /api/listing/contact/:id` exists as a commented route in `api/routes/listing.route.js` and is currently disabled.

## Security Reminder

If your repository currently contains real secrets in `.env`, rotate them immediately and remove them from version control history.

## License

ISC
