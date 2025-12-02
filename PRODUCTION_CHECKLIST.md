# Production Deployment Checklist

## ✅ Security Improvements Completed

- [x] **CORS Configuration**: Environment-based CORS with proper origin validation
- [x] **Cookie Security**: 
  - `httpOnly` flag enabled
  - `secure` flag enabled in production
  - `sameSite` set to "none" for cross-origin in production
  - Cookie domain configuration support
- [x] **JWT Tokens**: 
  - Proper token generation and validation
  - Refresh token rotation
  - Token expiration handling
  - Redis-based token storage
- [x] **Rate Limiting**: 
  - General API rate limiting (100 req/15min)
  - Auth endpoint rate limiting (5 req/15min)
- [x] **Helmet**: Security headers configured
- [x] **Input Validation**: 
  - Email format validation
  - Password length validation
  - Order status validation
  - Price validation
- [x] **Error Handling**: 
  - Centralized error middleware
  - Proper error responses (no sensitive data in production)
  - Consistent error format
- [x] **Sensitive Data**: 
  - Removed console.logs with tokens
  - Passwords excluded from responses
  - Error messages sanitized for production

## ✅ Infrastructure Improvements

- [x] **Database Connection**: 
  - Connection pooling configured
  - Proper error handling and reconnection logic
  - Connection event handlers
- [x] **Redis Connection**: 
  - Proper error handling
  - Connection retry strategy
  - Event handlers for monitoring
- [x] **Health Check**: `/health` endpoint added
- [x] **Graceful Shutdown**: SIGTERM and unhandled rejection handlers
- [x] **Logging**: Morgan logging configured (dev vs production)
- [x] **Compression**: Response compression enabled

## ✅ API Improvements

- [x] **Consistent Response Format**: All endpoints return `{ success: boolean, ... }`
- [x] **Authorization**: 
  - Admin-only routes properly protected
  - User can only cancel own orders
  - Admin can update all order statuses
- [x] **Order Status**: Standardized to lowercase (pending, processing, shipped, delivered, cancelled)
- [x] **Public Routes**: Featured products and recommended products accessible without auth
- [x] **Error Responses**: Consistent error format across all endpoints

## ✅ Client Improvements

- [x] **Axios Configuration**: 
  - Environment-based base URL
  - Request/response interceptors
  - Automatic token refresh on 401
  - Timeout configuration
- [x] **Error Handling**: Proper error handling with redirects

## ✅ Production Configuration

- [x] **PM2 Configuration**: Ecosystem file for process management
- [x] **Build Scripts**: Production build scripts added
- [x] **Environment Variables**: Documentation for all required env vars
- [x] **Documentation**: Production deployment guide created

## 🔧 Required Environment Variables

Make sure these are set in your production environment:

```env
NODE_ENV=production
PORT=5000
MONGO_URL=your_mongodb_connection_string
UPSTASH_REDIS_URL=your_redis_url
JWT_ACCESS_SECRET=strong_random_secret_min_32_chars
JWT_REFRESH_SECRET=strong_random_secret_min_32_chars
JWT_ACCESS_EXPIREIN=15m
JWT_REFRESH_EXPIREIN=7d
ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com
COOKIE_DOMAIN=.yourdomain.com
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 📋 Pre-Deployment Steps

1. **Generate JWT Secrets**:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Set Environment Variables**: Create `.env` file in `server/` directory

3. **Build Client**:
   ```bash
   cd client
   npm run build
   ```

4. **Install Dependencies**:
   ```bash
   cd server
   npm install
   ```

5. **Test Locally**:
   ```bash
   npm run prod
   ```

6. **Deploy**:
   - Use PM2: `npm run pm2:start`
   - Or use your hosting platform's deployment method

## 🚨 Important Notes

- **HTTPS Required**: Cookies with `secure` flag require HTTPS
- **CORS Origins**: Update `ALLOWED_ORIGINS` with your production domains
- **Cookie Domain**: Set `COOKIE_DOMAIN` if using subdomains (e.g., `.yourdomain.com`)
- **Database**: Ensure MongoDB connection string includes authentication
- **Redis**: Ensure Redis URL is accessible from your server
- **Cloudinary**: Verify Cloudinary credentials are correct

## 🔍 Monitoring

- Health check: `GET /health`
- PM2 monitoring: `pm2 monit`
- Logs: `pm2 logs`
- Process status: `pm2 status`

## 🐛 Troubleshooting

- **CORS Errors**: Check `ALLOWED_ORIGINS` includes frontend domain
- **Cookie Issues**: Verify `COOKIE_DOMAIN` and HTTPS setup
- **Token Errors**: Ensure JWT secrets match and are strong enough
- **Database Errors**: Check connection string and network access
- **Redis Errors**: Verify Redis URL and credentials

