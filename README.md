# Buena Property Dashboard

A full-stack property management dashboard for creating and managing WEG (Wohnungseigentümergemeinschaft) and MV (Mietverwaltung) properties.

## Architecture

- **Frontend**: Next.js 14 (App Router) with TypeScript, Tailwind CSS
- **Backend**: NestJS with TypeScript, TypeORM
- **Database**: PostgreSQL
- **AI Integration**: OpenAI API for PDF extraction (optional)

## Features

### Dashboard
- View all properties with search and filter functionality
- Property cards showing name, type, unique number, manager, and accountant
- **Clickable property cards** to view detailed information

### Property Details View
- **Tabbed interface** for organized information:
  - **Buildings Tab**: View all buildings associated with the property with addresses and unit counts
  - **All Units Tab**: Comprehensive table view of all units with sortable columns and details
  - **Details Tab**: Complete property information, manager, and accountant details
- **Summary Cards**: Quick stats showing total buildings, units, assigned manager, and accountant
- **Unit Details Modal**: Click any unit to view complete details (floor, entrance, size, rooms, co-ownership share, construction year)
- **Responsive Design**: Mobile-friendly layout with Material-UI components

### Property Creation Flow (3 Steps)

1. **General Info**
   - Select management type (WEG/MV)
   - Enter property name and unique number
   - Assign property manager and accountant
   - Upload Teilungserklärung (Declaration of Division) PDF
   - AI-powered PDF extraction to pre-fill data

2. **Building Data**
   - Add multiple buildings per property
   - Address details (street, house number, postal code, city, country)
   - Additional details field
   - Pre-filled from PDF if available

3. **Units**
   - Bulk unit entry with table-based editing
   - CSV import/export for efficiency (handles 60+ units)
   - Unit types: Apartment, Office, Garden, Parking
   - Fields: number, type, building, floor, entrance, size, co-ownership share, construction year, rooms
   - Pre-filled from PDF if available

## Viewing Property Details

Once a property is created, users can view comprehensive details by clicking on any property card from the dashboard:

1. **Navigate to Property Details**: Click on a property card from the dashboard
2. **Buildings Overview**: View all buildings associated with the property with full address information
3. **Units Management**: Browse all units in a table format with key information (size, floor, rooms, co-ownership share)
4. **Unit Details**: Click on any unit in the table to view complete details in a modal dialog
5. **Property Information**: Access the Details tab to see complete property info, manager, and accountant details
6. **Refresh Data**: Use the refresh button to reload property, building, and unit information

The interface provides tabs for easy navigation between Buildings, All Units, and Property Details views.

## Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose (for PostgreSQL)
- OpenAI API key (optional, for PDF extraction)

## Setup Instructions

### 1. Start PostgreSQL Database

```bash
docker-compose up -d
```

This will start a PostgreSQL container on port 5432.

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following content:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=buena_properties

# Server Configuration
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# OpenAI Configuration (Optional - for PDF extraction)
OPENAI_API_KEY=your_openai_api_key_here

# File Upload Configuration
UPLOAD_DIR=./uploads
```

Edit `.env` and add your configuration (especially `OPENAI_API_KEY` if you want PDF extraction).

Start the backend:

```bash
npm run start:dev
```

The backend will run on `http://localhost:3001`

**Note**: The backend automatically seeds the database with sample property managers and accountants on first startup.

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env.local` file in the `frontend` directory with the following content:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Start the frontend:

```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Database Schema

### Properties
- `id` (UUID)
- `name` (string)
- `type` (WEG | MV)
- `unique_number` (string, unique)
- `property_manager_id` (UUID, nullable)
- `accountant_id` (UUID, nullable)
- `created_at`, `updated_at`

### Buildings
- `id` (UUID)
- `property_id` (UUID, foreign key)
- `street`, `house_number`, `postal_code`, `city`, `country`
- `additional_details` (text, nullable)
- `created_at`

### Units
- `id` (UUID)
- `building_id` (UUID, foreign key)
- `number` (string)
- `type` (Apartment | Office | Garden | Parking)
- `floor`, `entrance` (string, nullable)
- `size` (decimal, nullable)
- `co_ownership_share` (decimal, nullable)
- `construction_year` (integer, nullable)
- `rooms` (integer, nullable)
- `created_at`

### Supporting Tables
- `property_managers`: id, name, email
- `accountants`: id, name, email
- `property_documents`: id, property_id, file_path, file_name, uploaded_at

## API Endpoints

### Properties
- `GET /properties` - List all properties
- `GET /properties/:id` - Get property details (includes buildings and units relations)
- `POST /properties` - Create property
- `PUT /properties/:id` - Update property
- `GET /properties/managers` - Get all property managers
- `GET /properties/accountants` - Get all accountants
- `POST /properties/parse-pdf` - Upload and extract data from PDF

### Buildings
- `GET /properties/:propertyId/buildings` - Get buildings for property
- `POST /properties/:propertyId/buildings` - Create building
- `POST /properties/:propertyId/buildings/bulk` - Create multiple buildings
- `GET /buildings/:id` - Get building details

### Units
- `GET /buildings/:buildingId/units` - Get units for building
- `POST /buildings/:buildingId/units` - Create unit
- `POST /buildings/:buildingId/units/bulk` - Create multiple units

## Efficiency Features for 60+ Units

1. **Bulk Operations**: Batch API endpoints for creating multiple units
2. **CSV Import/Export**: Import units from CSV files or export for editing
3. **Table-based Entry**: Inline editing in a table format
4. **PDF Pre-filling**: Extract unit data from Teilungserklärung PDFs
5. **Template Download**: CSV template for bulk entry

## PDF Extraction

The application uses OpenAI's GPT-4 Vision API to extract structured data from Teilungserklärung PDFs. The extracted data includes:
- Property name
- Building addresses
- Unit details (number, type, floor, size, co-ownership share, etc.)

To use this feature:
1. Set `OPENAI_API_KEY` in backend `.env`
2. Upload a PDF in Step 1 of property creation
3. The extracted data will pre-fill subsequent steps

## Development

### Backend
```bash
cd backend
npm run start:dev  # Development with hot reload
npm run build      # Build for production
npm run start:prod # Run production build
```

### Frontend
```bash
cd frontend
npm run dev        # Development server
npm run build      # Build for production
npm run start      # Run production build
```

## Testing

The application includes test configurations. Run tests with:

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## Project Structure

```
buena-property-dashboard/
├── backend/
│   ├── src/
│   │   ├── properties/      # Property module
│   │   ├── buildings/       # Building module
│   │   ├── units/           # Unit module
│   │   ├── pdf-parser/      # PDF extraction service
│   │   ├── database/
│   │   │   └── entities/   # TypeORM entities
│   │   └── app.module.ts
│   └── uploads/             # PDF storage
├── frontend/
│   ├── app/
│   │   ├── page.tsx         # Dashboard with property list
│   │   └── properties/
│   │       ├── [id]/
│   │       │   └── page.tsx # Property details view
│   │       └── create/      # Multi-step form for property creation
│   ├── components/
│   │   ├── PropertyCard.tsx              # Property card component (clickable)
│   │   ├── PropertyDetailsView.tsx       # Tabbed details view for properties
│   │   ├── UnitDetailsView.tsx          # Unit details modal component
│   │   ├── UnitBulkEntry.tsx            # Bulk unit entry component
│   │   ├── FileUpload.tsx               # PDF file upload component
│   │   ├── StepIndicator.tsx            # Step indicator for creation flow
│   │   └── ThemeRegistry.tsx            # Material-UI theme configuration
│   ├── lib/                 # API client
│   ├── types/               # TypeScript types
│   └── public/              # Static assets
└── docker-compose.yml       # PostgreSQL setup
```

## Notes

- The database schema is automatically synchronized in development mode
- File uploads are stored locally in `backend/uploads/`
- CORS is enabled for `http://localhost:3000` by default
- The application uses UUIDs for all entity IDs

## License

MIT
