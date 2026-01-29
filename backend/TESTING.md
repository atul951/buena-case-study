# Property Management Backend - Test Documentation

## Test Files Created

This document describes the test suite for the Property creation flow in the Buena backend application.

### Unit Tests

#### 1. **properties.service.spec.ts**
Unit tests for the PropertiesService covering:
- ✅ Creating a property with all fields (manager_id, accountant_id)
- ✅ Creating a property with only required fields
- ✅ Retrieving all properties (findAll)
- ✅ Retrieving a single property by ID (findOne)
- ✅ Updating property details
- ✅ Fetching property managers
- ✅ Fetching accountants
- ✅ Exception handling (NotFoundException)

**Test Cases:** 8

#### 2. **properties.controller.spec.ts**
Unit tests for the PropertiesController covering:
- ✅ POST /properties endpoint validation
- ✅ GET /properties endpoint
- ✅ GET /properties/:id endpoint
- ✅ PUT /properties/:id endpoint
- ✅ GET /properties/managers endpoint
- ✅ GET /properties/accountants endpoint

**Test Cases:** 7

### Integration Tests

#### 3. **test/properties.e2e.spec.ts**
End-to-end integration tests for the complete create property flow:
- ✅ Creating a property with all required fields
- ✅ Creating a property with optional manager and accountant IDs
- ✅ Validation error when name is missing
- ✅ Validation error when type is missing
- ✅ Validation error when unique_number is missing
- ✅ Validation error when invalid PropertyType is provided
- ✅ Unique constraint violation handling
- ✅ Retrieving all properties
- ✅ Retrieving specific property by ID
- ✅ 404 error when property not found
- ✅ Retrieving managers list
- ✅ Retrieving accountants list

**Test Cases:** 12

---

## Running the Tests

### Prerequisites
- Docker and Docker Compose running (for integration tests)
- Node.js and npm installed
- PostgreSQL database configured (for e2e tests)

### Running Unit Tests
```bash
# Run all unit tests
npm run test

# Run unit tests in watch mode
npm run test:watch

# Run unit tests with coverage report
npm run test:cov

# Run unit tests for properties module only
npm run test -- properties
```

### Running Integration Tests (E2E)
```bash
# Run integration tests
npm run test:e2e

# Run integration tests in watch mode
npm run test:e2e -- --watch

# Run integration tests with coverage
npm run test:e2e -- --coverage
```

### Running All Tests
```bash
# Run both unit and integration tests
npm run test && npm run test:e2e
```

---

## Test Coverage

The test suite covers:
- **Happy paths:** Creating properties with valid data
- **Validation:** Input validation for required fields and data types
- **Error handling:** NotFoundException, unique constraint violations
- **Integration:** Full HTTP request/response cycle with database operations
- **Business logic:** Property creation with relationships to managers and accountants

---

## Test Architecture

### Unit Tests
- **Mocking:** Repository and service dependencies are mocked using Jest
- **Isolation:** Each test focuses on a single responsibility
- **Speed:** Fast execution, no database dependency

### Integration Tests (E2E)
- **Real Database:** Tests use a real PostgreSQL connection (configured via env variables)
- **Full Stack:** Tests execute through the complete HTTP stack
- **Schema:** Database is dropped and recreated for each test run to ensure clean state
- **Validation:** Both controller-level and database-level validations are tested

---

## Environment Variables for E2E Tests

Create a `.env.test` file or set these environment variables:
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=buena_test
```

---

## Key Test Data Models

### CreatePropertyDto
```typescript
{
  name: string;                    // Required
  type: PropertyType;              // Required: WEG or MV
  unique_number: string;           // Required
  property_manager_id?: number;    // Optional
  accountant_id?: number;          // Optional
}
```

### PropertyType Enum
- `WEG` - Single Family Property
- `MV` - Multi-Unit Property

---

## Expected Test Results

All tests should pass with the following summary:
- **Unit Tests:** ~15 test cases
- **Integration Tests:** ~12 test cases
- **Total:** ~27 test cases

---

## Debugging Tests

### Debug Unit Tests
```bash
npm run test:debug -- properties
```

### Debug Integration Tests with logging
```bash
DEBUG=* npm run test:e2e
```

---

## Future Test Enhancements

- [ ] Add tests for concurrent property creation
- [ ] Add tests for property creation with related buildings and units
- [ ] Add performance tests for bulk property creation
- [ ] Add tests for PDF parsing integration
- [ ] Add tests for property deletion and cascading
