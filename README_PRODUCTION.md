# Production Deployment Guide

This guide will help you deploy the application to production.

## Prerequisites

- Node.js (v18 or higher)
- MongoDB database
- Redis instance (Upstash recommended)
- Cloudinary account (for image storage)
- PM2 (for process management)

## Environment Variables

Create a `.env` file in the `server` directory with the following variables:

```env
# Server Configuration
NODE_ENV=production
PORT=5000

# MongoDB Connection
MONGO_URL=your_mongodb_connection_string_here

# Redis Connection (Upstash)
UPSTASH_REDIS_URL=your_upstash_redis_url_here

# JWT Secrets (Generate strong random strings - minimum 32 characters)
JWT_ACCESS_SECRET=your_jwt_access_secret_here_min_32_chars
JWT_REFRESH_SECRET=your_jwt_refresh_secret_here_min_32_chars

# JWT Expiration Times
JWT_ACCESS_EXPIREIN=15m
JWT_REFRESH_EXPIREIN=7d

# CORS Configuration (comma-separated list of allowed origins)
ALLOWED_ORIGINS=https://your-production-domain.com,https://www.your-production-domain.com

# Cookie Domain (for production, e.g., .yourdomain.com)
# Leave empty if cookies should work on exact domain only
COOKIE_DOMAIN=.yourdomain.com

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email Configuration (if using nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password

# SMS Configuration (if using springedge)
SPRINGEDGE_API_KEY=your_springedge_api_key
```

## Generating Secure JWT Secrets

Use the following command to generate secure random secrets:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Run this twice to generate both `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET`.

## Installation

1. Install server dependencies:
```bash
cd server
npm install
```

2. Install client dependencies:
```bash
cd ../client
npm install
```

## Building for Production

1. Build the client:
```bash
cd client
npm run build
```

This will create a `dist` folder in the client directory.

## Running in Production

### Option 1: Using PM2 (Recommended)

1. Install PM2 globally:
```bash
npm install -g pm2
```

2. Start the application:
```bash
cd server
npm run pm2:start
```

3. Other PM2 commands:
```bash
npm run pm2:stop      # Stop the application
npm run pm2:restart    # Restart the application
npm run pm2:logs       # View logs
npm run pm2:delete     # Delete PM2 process
```

### Option 2: Using Node directly

```bash
cd server
npm run prod
```

## Security Checklist

- [ ] All environment variables are set correctly
- [ ] JWT secrets are strong and unique (32+ characters)
- [ ] CORS origins are restricted to your production domains
- [ ] Cookie domain is set correctly for your domain
- [ ] MongoDB connection uses authentication
- [ ] Redis connection is secure
- [ ] HTTPS is enabled (use a reverse proxy like Nginx)
- [ ] Rate limiting is configured appropriately
- [ ] Error messages don't expose sensitive information
- [ ] All console.log statements with sensitive data are removed

## Reverse Proxy Setup (Nginx)

Example Nginx configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Monitoring

- Health check endpoint: `GET /health`
- Monitor PM2 processes: `pm2 monit`
- View logs: `pm2 logs`

## Troubleshooting

1. **CORS errors**: Check `ALLOWED_ORIGINS` includes your frontend domain
2. **Cookie issues**: Verify `COOKIE_DOMAIN` and `secure` flag settings
3. **Database connection**: Check MongoDB connection string and network access
4. **Redis connection**: Verify Redis URL and credentials
5. **Token errors**: Ensure JWT secrets are set and match between restarts

## Client Environment Variables

Create a `.env` file in the `client` directory (optional):

```env
VITE_API_BASE_URL=https://your-api-domain.com/api/v1
```

If not set, the client will use relative paths in production (assuming same domain) or `http://localhost:5000/api/v1` in development.

