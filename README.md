# Trello Clone - Project Management Tool

A full-stack Kanban-style project management web application that replicates Trello's design and user experience. Built with React.js, Node.js, Express.js, and PostgreSQL.

## Features

### Core Features (Implemented)

✅ **Board Management**
- Create and view multiple boards
- Switch between boards
- View board with all lists and cards

✅ **Lists Management**
- Create, edit, and delete lists
- Drag and drop to reorder lists horizontally
- Edit list titles inline

✅ **Cards Management**
- Create cards with titles
- Edit card title and description
- Delete or archive cards
- Drag and drop cards between lists
- Drag and drop to reorder cards within a list

✅ **Card Details**
- Add and remove labels (colored tags)
- Set due dates on cards
- Add checklist with items (mark items as complete/incomplete)
- Assign members to cards
- View card details in a modal

✅ **Search & Filter**
- Search cards by title
- Real-time filtering as you type

### Bonus Features (Implemented)

✅ **Multiple Boards Support**
- Create multiple boards
- Switch between boards using dropdown
- Each board maintains its own lists and cards

✅ **Responsive Design**
- Works on desktop, tablet, and mobile devices
- Horizontal scrolling for lists on smaller screens

## Tech Stack

### Frontend
- **React.js** - UI library
- **Vite** - Build tool and dev server
- **@dnd-kit** - Drag and drop functionality
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Prisma** - ORM for database management
- **PostgreSQL** - Relational database

## Database Schema

The application uses the following main models:
- **Board** - Contains multiple lists
- **List** - Contains multiple cards, belongs to a board
- **Card** - Contains task information, belongs to a list
- **Label** - Colored tags that can be assigned to cards
- **CardLabel** - Many-to-many relationship between cards and labels
- **ChecklistItem** - Items in a card's checklist
- **Member** - Team members
- **CardMember** - Many-to-many relationship between cards and members

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/trello_clone?schema=public"
```

Replace `username`, `password`, `localhost`, `5432`, and `trello_clone` with your PostgreSQL credentials and database name.

4. Run database migrations:
```bash
npx prisma migrate dev
```

5. Seed the database with sample data:
```bash
npx prisma db seed
```

Or manually:
```bash
node prisma/seed.js
```

6. Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:5001`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or another port if 5173 is occupied)

## Usage

1. **Create a Board**: Click "+ New Board" in the header
2. **Switch Boards**: Use the dropdown in the header to switch between boards
3. **Create a List**: Click "+ Add another list" at the end of the lists
4. **Edit List Title**: Click on the list title to edit it
5. **Delete List**: Click the "×" button next to the list title
6. **Create a Card**: Click "+ Add a card" at the bottom of any list
7. **Edit Card**: Click on any card to open the card modal
8. **Drag Cards**: Click and drag cards to move them between lists or reorder within a list
9. **Drag Lists**: Click and drag list headers to reorder lists
10. **Search Cards**: Use the search bar at the top to filter cards by title

## Card Features

When you open a card modal, you can:
- Edit the card title by clicking on it
- Add/edit description
- Set a due date
- Add/remove labels (colored tags)
- Assign/remove members
- Add checklist items and mark them as complete
- Archive or delete the card

## API Endpoints

### Boards
- `GET /boards` - Get all boards
- `GET /boards/:id` - Get a specific board with all lists and cards
- `POST /boards` - Create a new board

### Lists
- `POST /lists` - Create a new list
- `PUT /lists/:id` - Update a list
- `DELETE /lists/:id` - Delete a list
- `PUT /lists/reorder` - Reorder lists

### Cards
- `POST /cards` - Create a new card
- `GET /cards/:id` - Get a specific card with all details
- `PUT /cards/:id` - Update a card
- `DELETE /cards/:id` - Delete a card
- `PUT /cards/:id/move` - Move a card to a different list/position
- `GET /cards/search` - Search cards

### Labels
- `GET /labels` - Get all labels
- `POST /labels` - Create a new label
- `POST /labels/card` - Add a label to a card
- `DELETE /labels/card` - Remove a label from a card

### Checklist
- `POST /checklist` - Add a checklist item
- `PUT /checklist/:id` - Update a checklist item
- `DELETE /checklist/:id` - Delete a checklist item

### Members
- `GET /members` - Get all members
- `POST /members` - Create a new member
- `POST /members/card` - Assign a member to a card
- `DELETE /members/card` - Remove a member from a card

## Assumptions

1. **No Authentication**: The application assumes a default user is logged in. All users can access all boards.
2. **Single User Environment**: Designed for a single user or team environment without user isolation.
3. **Sample Data**: The seed script creates sample labels, members, and a board with lists and cards for demonstration.

## Project Structure

```
trello-clone/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── routes/         # API routes
│   │   ├── index.js        # Express app setup
│   │   └── prisma.js       # Prisma client
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   ├── seed.js         # Seed script
│   │   └── migrations/     # Database migrations
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── api/            # API client
│   │   └── App.jsx         # Main app component
│   └── package.json
└── README.md
```

## Development Notes

- The frontend uses inline styles for simplicity, but the design closely matches Trello's UI
- Drag and drop is implemented using @dnd-kit library
- All API calls use Axios with error handling
- The database uses Prisma ORM for type-safe database access
- CORS is enabled on the backend to allow frontend requests

## Future Enhancements

Potential improvements that could be added:
- User authentication and authorization
- Real-time collaboration using WebSockets
- File attachments on cards
- Comments and activity log
- Card covers (images)
- Board background customization
- Advanced filtering (by labels, members, due date)
- Card templates
- Board templates

## Deployment

### Backend Deployment (Render, Railway, Heroku, etc.)

1. Set environment variables:
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `PORT` - Port number (optional, defaults to 5001)

2. Build commands:
   ```bash
   npm install
   npx prisma generate
   npx prisma migrate deploy
   npm run seed
   ```

3. Start command:
   ```bash
   npm start
   ```

### Frontend Deployment (Vercel, Netlify, etc.)

1. Set environment variables:
   - `VITE_API_URL` - Your backend API URL (e.g., `https://your-backend.railway.app`)

2. Build command:
   ```bash
   npm run build
   ```

3. Output directory: `dist`

**Important:** Make sure to update the `VITE_API_URL` environment variable in your frontend deployment platform to point to your deployed backend URL.

### Example Deployment Setup

**Backend (Railway/Render):**
- Connect your GitHub repository
- Add `DATABASE_URL` environment variable
- The platform will automatically run migrations and seed on first deploy

**Frontend (Vercel/Netlify):**
- Connect your GitHub repository
- Add `VITE_API_URL` environment variable pointing to your backend
- Build command: `npm run build`
- Output directory: `dist`

## License

This project is created as an assignment submission.

# Project-Management-Tool
# Project-Management-Tool
