# NTPC Youth Management System - Enhancement Documentation

## Overview
This document outlines the enhancements implemented for the NTPC youth management system, including admin participant display, badge generation, notifications, and payment/verification integrations.

## Database Schema Updates

### Fields Added to `ey_rounds` Table
- `from_date` (TEXT): Start date of the round
- `to_date` (TEXT): End date of the round

### Fields Added to `ey_participants` Table
- `badge_generated` (BOOLEAN, DEFAULT: false): Tracks whether a badge has been generated for the participant
- Made `coordinator_id` optional (nullable): Coordinators are auto-assigned only when available

## API Endpoints

### 1. Admin Participants Display Endpoint
**GET** `/ey-participants/admin/list`

Returns participants with joined Event and Round information for admin display.

**Query Parameters:**
- `search` (string): Search across faydaId, firstName, lastName, email, event title
- `sortBy` (string): Field to sort by (default: "roundNumber")
- `sortOrder` (string): "asc" or "desc" (default: "desc")

**Response Example:**
```json
[
  {
    "id": 1,
    "faydaId": "1234567890",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "event": {
      "id": 1,
      "title": "Summer Youth Conference",
      "description": "..."
    },
    "round": {
      "id": 1,
      "roundNumber": 1,
      "capacity": 100,
      "fromDate": "2024-06-01",
      "toDate": "2024-06-05",
      "createdAt": "2024-01-15T10:00:00Z"
    },
    "coordinatorId": 5,
    "badgeGenerated": false
  }
]
```

### 2. Round Capacity Check Endpoint
**GET** `/ey-participants/round/:roundId/capacity`

Checks available capacity for a specific round.

**Response Example:**
```json
{
  "roundId": 1,
  "capacity": 100,
  "registered": 45,
  "available": 55,
  "isFull": false,
  "message": "55 slots available"
}
```

### 3. Standard Participant Listing Endpoint
**GET** `/ey-participants`

Lists all participants with optional search and sorting.

**Query Parameters:**
- `search` (string): Search across faydaId, firstName, lastName, email, phoneNumber, registrationNumber
- `sortBy` (string): Field to sort by
- `sortOrder` (string): "asc" or "desc"

## New Services

### 1. Badge Generation Service
**File:** `artifacts/api-server/src/lib/badge-service.ts`

Generates printable HTML/PDF badges for event participants.

**Features:**
- Generates badge data from participant information
- Creates professional HTML badge templates with styling
- Includes participant name, registration number, Fayda ID, and round information
- Print-friendly CSS with proper page breaks for batch printing

**Usage:**
```typescript
import { BadgeGenerationService } from "./badge-service";

// Generate badge data
const badgeData = await BadgeGenerationService.generateBadgeData(participant);

// Generate HTML for printing
const html = BadgeGenerationService.generateBadgeHTML([badgeData]);

// Send to browser or save to file for download
```

### 2. Notification Service
**File:** `artifacts/api-server/src/lib/notification-service.ts`

Sends email and SMS notifications to participants.

**Features:**
- Send email notifications with registration confirmation
- Send SMS notifications via SMS provider
- HTML email templates with styling
- Configuration via environment variables
- Support for multiple notification channels

**Environment Variables Required:**
- `SMTP_HOST`: Email server host
- `SMTP_PORT`: Email server port
- `SMTP_USER`: Email account username
- `SMTP_PASS`: Email account password
- `SMS_PROVIDER`: SMS provider ("telebirr" or "custom")
- `SMS_API_KEY`: SMS provider API key

**Usage:**
```typescript
import { initializeNotificationService } from "./notification-service";

const notificationService = initializeNotificationService();

await notificationService.sendNotification({
  email: "participant@example.com",
  phoneNumber: "+251912345678",
  registrationNumber: "REG-2024-001",
  eventName: "Summer Youth Conference",
  roundNumber: 1,
  participantName: "John Doe",
});
```

### 3. Fayda Verification Service
**File:** `artifacts/api-server/src/lib/fayda-verification.ts`

Verifies Fayda national ID against Ethiopia's official database.

**Status:** ⚠️ TODO - Requires API Integration

**Environment Variables Needed:**
- `FAYDA_API_ENDPOINT`: Fayda API endpoint
- `FAYDA_API_KEY`: Fayda API authentication key

**Mock Verification (Testing):**
- Valid IDs: Start with 1 or 2, followed by 9 digits (e.g., "1234567890")
- Invalid IDs: All others

**Production Integration Steps:**
1. Obtain API credentials from Fayda service provider
2. Set environment variables
3. Implement actual API call in the `verifyFaydaId()` method
4. Handle API response and error cases

### 4. Telebirr Payment Service
**File:** `artifacts/api-server/src/lib/telebirr-payment.ts`

Integrates with Ethiopia's Telebirr mobile payment system.

**Status:** ⚠️ TODO - Requires API Integration

**Environment Variables Needed:**
- `TELEBIRR_API_ENDPOINT`: Telebirr API endpoint
- `TELEBIRR_API_KEY`: Telebirr API key
- `TELEBIRR_MERCHANT_ID`: Merchant ID

**Features:**
- Initiate Telebirr payments
- Verify payment status
- Mock responses for testing

**Mock Payment (Testing):**
- All payment initiation requests succeed with status "PENDING"
- Transaction IDs start with "TELE-" format

**Production Integration Steps:**
1. Register with Telebirr and obtain merchant credentials
2. Set environment variables
3. Implement actual API calls for payment initiation and verification
4. Set up callback URL for payment notifications

### 5. Bank Payment Service
**File:** `artifacts/api-server/src/lib/bank-payment.ts`

Integrates with Ethiopian banking systems for online payments.

**Status:** ⚠️ TODO - Requires API Integration

**Supported Banks:**
- Dashen Bank
- Awash International Bank
- Addis International Bank
- Abyssinia Bank
- NIBE Bank
- Bunna International Bank
- Lion International Bank
- Oromia International Bank
- Commercial Bank of Ethiopia

**Environment Variables Needed:**
- `BANK_API_ENDPOINT`: Bank API gateway endpoint
- `BANK_API_KEY`: Bank API authentication key
- `BANK_MERCHANT_ID`: Merchant ID

**Production Integration Steps:**
1. Contact each bank's business development team
2. Obtain API credentials and merchant setup
3. Set environment variables
4. Implement actual API calls for payment initiation and verification
5. Handle bank-specific API response formats

## Frontend Integration - EY Register Page

**File:** `artifacts/ntpc-website/src/pages/ey-register.tsx`

**Updates Needed:**

1. **Round Dropdown Logic:**
   ```typescript
   // Show only round numbers, not full objects
   const rounds = await fetch(`/api/ey-rounds?eventId=${eventId}`).then(r => r.json());
   
   // Check capacity before allowing selection
   const capacity = await fetch(`/api/ey-participants/round/${roundId}/capacity`).then(r => r.json());
   
   if (capacity.isFull) {
     showError(capacity.message); // "This round is full"
   }
   ```

2. **Coordinator Assignment:**
   - Coordinators are now optional
   - Auto-assigned from available coordinators if any exist in database
   - Show message if no coordinators available

3. **Form Validation:**
   - Fayda ID format validation
   - Phone number format validation
   - Email validation
   - Capacity checking before form submission

## Database Migration

**File:** `lib/db/migrations/002_add_round_dates_and_badge.sql`

Run this migration to apply schema changes:
```bash
psql -d your_db_name -U postgres -f lib/db/migrations/002_add_round_dates_and_badge.sql
```

**Migration Creates:**
- `from_date` and `to_date` columns in `ey_rounds`
- `badge_generated` column in `ey_participants`
- Indexes on `fayda_id`, `event_id`, and `round_id` for performance

## Configuration Checklist

### Development Setup
- [ ] DATABASE_URL configured in `.env`
- [ ] Database migration applied
- [ ] Mock verification services working

### Production Setup - Phase 1 (Required)
- [ ] Fayda API credentials obtained and configured
- [ ] SMTP email service configured
- [ ] SMS provider configured (optional but recommended)

### Production Setup - Phase 2 (Payment Integration)
- [ ] Telebirr merchant account and API credentials
- [ ] Bank payment gateway integration (at least one bank)
- [ ] Callback URL endpoints configured

### Production Setup - Phase 3 (Notifications)
- [ ] Email templates tested with actual service
- [ ] SMS templates configured
- [ ] Notification delivery logging implemented

## Environment Variables Template

```bash
# Database
DATABASE_URL=postgres://user:password@localhost:5432/ntpc_db

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_SECURE=false

# SMS
SMS_PROVIDER=telebirr
SMS_API_KEY=your-sms-api-key
SMS_SENDER_NAME=NTPC

# Fayda Verification
FAYDA_API_ENDPOINT=https://fayda-api.gov.et/verify
FAYDA_API_KEY=your-fayda-api-key

# Telebirr Payment
TELEBIRR_API_ENDPOINT=https://api.telebirr.com
TELEBIRR_API_KEY=your-telebirr-api-key
TELEBIRR_MERCHANT_ID=your-merchant-id

# Bank Payment
BANK_API_ENDPOINT=https://bank-gateway.example.com
BANK_API_KEY=your-bank-api-key
BANK_MERCHANT_ID=your-merchant-id

# Application
APP_URL=https://ntpc-events.example.com
```

## Testing

### Mock Credentials for Testing

**Fayda ID Verification:**
- Valid test ID: "1234567890" (starts with 1)
- Invalid test ID: "9999999999"

**Telebirr Payment:**
- Test transaction: "TELE-1234567890"
- Status: Will show as "COMPLETED" if starts with "TELE-"

**Bank Payment:**
- Test transaction: "BANK-01-1234567890"
- Status: Will show as "COMPLETED" if starts with "BANK-"

## Future Enhancements

1. **Batch Operations:**
   - Generate badges for multiple participants at once
   - Send bulk notifications
   - Import participants from CSV

2. **Analytics:**
   - Participant registration trends
   - Payment success rates
   - Notification delivery statistics

3. **Advanced Features:**
   - QR code generation for badge check-in
   - Real-time capacity dashboard
   - Automated reminder notifications
   - Participant communication portal

## Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL format: `postgres://user:password@host:port/database`
- Check PostgreSQL is running: `pg_isready -h localhost`
- Test migration: `psql -U postgres -d database_name -f migration.sql`

### Email Sending Issues
- Verify SMTP credentials in environment variables
- Check firewall allows SMTP port (typically 587 or 465)
- Test with a simple SMTP client first

### Payment Verification Failures
- Verify API endpoints are correct
- Check API keys and merchant IDs
- Review payment provider documentation for callback format

### Badge Generation Issues
- Ensure badgeGenerated flag is being updated
- Check HTML template renders correctly in browser print preview
- Verify CSS for print media queries works

## Support

For issues or questions about these enhancements:
1. Check the inline code comments (marked with TODO)
2. Review the specific service file for detailed documentation
3. Check environment variables are properly configured
4. Review application logs for error messages
