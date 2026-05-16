PORT=4000
DATABASE_URL=postgresql://postgres:root@localhost:5432/ntpc_db
LOG_LEVEL=info
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin
MEMBERS_USERNAME=members
MEMBERS_PASSWORD=members

# Fayda ID Verification
FAYDA_BASE_URL=https://auth.fayda.et
FAYDA_CLIENT_ID=fddgd456-7890-1234-5678-90abcdef1234
FAYDA_REDIRECT_URI=http://localhost:3000/ey-register
FAYDA_AUTHORIZATION_ENDPOINT=https://auth.fayda.et/authorize
FAYDA_TOKEN_ENDPOINT=https://auth.fayda.et/token
FAYDA_USERINFO_ENDPOINT=https://auth.fayda.et/userinfo
FAYDA_MOCK_ENABLED=true
FAYDA_MOCK_ID=1234567890123456
FAYDA_MOCK_FULL_NAME=Mock Fayda User
FAYDA_MOCK_BIRTH_DATE=1998/01/01
FAYDA_MOCK_GENDER=Male
FAYDA_MOCK_PHONE=+251912345678
FAYDA_MOCK_EMAIL=mock@example.com

# Telebirr Payment Gateway
FABRIC_APP_ID=
FABRIC_APP_SECRET=
MERCHANT_APP_ID=
MERCHANT_CODE=
TELEBIRR_PRIVATE_KEY=
TELEBIRR_NOTIFY_URL=http://localhost:4000/api/telebirr/callback
TELEBIRR_REDIRECT_URL=http://localhost:3000/ey-register
TELEBIRR_BASE_URL=https://developerportal.ethiotelebirr.et:38443/apiaccess/payment/gateway
TELEBIRR_WEB_BASE_URL=https://developerportal.ethiotelebirr.et:38443/payment/web/paygate