# Deployment Guide - ligam-tv with SRS Streaming

This guide covers the complete deployment setup for ligam-tv with SRS (Simple Realtime Server) streaming infrastructure.

## Table of Contents

1. [Local Development Setup](#local-development-setup)
2. [Docker Setup](#docker-setup)
3. [Environment Variables](#environment-variables)
4. [Deployment Platforms](#deployment-platforms)
5. [Testing Your Stream](#testing-your-stream)
6. [Production Deployment](#production-deployment)
7. [Troubleshooting](#troubleshooting)

## Local Development Setup

### Prerequisites

- Node.js 20+ and npm
- Docker and Docker Compose (for SRS server)
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/thiong-yuot/ligam-tv.git
   cd ligam-tv
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Start SRS server (in another terminal)**
   ```bash
   docker-compose up srs
   ```

The app will be available at `http://localhost:8080` and SRS will be running with:
- RTMP on port 1935
- HLS on port 8080
- HTTP API on port 1985

## Docker Setup

### Build and Run with Docker Compose

1. **Build all services**
   ```bash
   docker-compose build
   ```

2. **Start all services**
   ```bash
   docker-compose up -d
   ```

3. **View logs**
   ```bash
   docker-compose logs -f
   ```

4. **Stop services**
   ```bash
   docker-compose down
   ```

### Individual Service Management

**Start only SRS:**
```bash
docker-compose up -d srs
```

**Start only the app:**
```bash
docker-compose up -d app
```

**Restart a service:**
```bash
docker-compose restart srs
```

## Environment Variables

### Required Variables

Create a `.env` file based on `.env.example`:

```env
# Supabase Configuration
VITE_SUPABASE_PROJECT_ID=your-project-id
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
VITE_SUPABASE_URL=https://your-project.supabase.co

# SRS Streaming Configuration
SRS_CALLBACK_SECRET=your-secure-random-secret-here

# Streaming URLs
VITE_RTMP_URL=rtmp://localhost:1935/live
VITE_HLS_URL=http://localhost:8080/live
```

### Generating Secure Secrets

Generate a secure callback secret:

```bash
# Using OpenSSL
openssl rand -hex 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using Python
python3 -c "import secrets; print(secrets.token_hex(32))"
```

### Production Variables

For production, update the URLs to your domain:

```env
VITE_RTMP_URL=rtmp://your-domain.com:1935/live
VITE_HLS_URL=https://your-domain.com/live
```

## Deployment Platforms

### Railway Deployment

Railway provides easy deployment with TCP proxy support for RTMP.

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**
   ```bash
   railway login
   ```

3. **Initialize project**
   ```bash
   railway init
   ```

4. **Set environment variables**
   ```bash
   railway variables set SRS_CALLBACK_SECRET=your-secret
   railway variables set VITE_SUPABASE_URL=your-supabase-url
   railway variables set VITE_SUPABASE_PUBLISHABLE_KEY=your-key
   railway variables set VITE_SUPABASE_PROJECT_ID=your-project-id
   ```

5. **Enable TCP Proxy for RTMP (port 1935)**
   - Go to Railway dashboard
   - Select your SRS service
   - Enable TCP Proxy
   - Assign port 1935

6. **Deploy**
   ```bash
   railway up
   ```

### Render Deployment

1. **Create New Web Service**
   - Connect your GitHub repository
   - Use Docker deployment

2. **Configure Environment Variables**
   Add all required variables from `.env.example`

3. **Configure Health Check**
   - Path: `/health` (if implemented)
   - Port: 80

4. **For RTMP Support**
   Render doesn't natively support TCP proxies. Consider:
   - Using a separate VPS for SRS
   - Using Render for the app only
   - Connecting to external RTMP server

### AWS ECS/Fargate Deployment

1. **Build and push Docker images**
   ```bash
   # Build images
   docker build -t ligam-tv-app .
   docker build -t ligam-tv-srs ./srs

   # Tag for ECR
   docker tag ligam-tv-app:latest YOUR_ECR_URI/ligam-tv-app:latest
   docker tag ligam-tv-srs:latest YOUR_ECR_URI/ligam-tv-srs:latest

   # Push to ECR
   docker push YOUR_ECR_URI/ligam-tv-app:latest
   docker push YOUR_ECR_URI/ligam-tv-srs:latest
   ```

2. **Create ECS Task Definition**
   - Define app and SRS containers
   - Configure port mappings (1935, 8080, 1985, 80)
   - Set environment variables
   - Configure health checks

3. **Create ECS Service**
   - Use Fargate or EC2 launch type
   - Configure load balancer for HTTP/HTTPS
   - Configure security groups for RTMP (1935)

4. **Configure Application Load Balancer**
   - Target group for app (port 80)
   - Target group for HLS (port 8080)
   - Network Load Balancer for RTMP (port 1935)

### Self-Hosted Deployment

1. **Server Requirements**
   - Ubuntu 20.04+ or similar Linux distribution
   - Docker and Docker Compose installed
   - Minimum 2GB RAM, 2 CPU cores
   - Open ports: 80, 443, 1935, 8080, 1985

2. **Clone and Setup**
   ```bash
   git clone https://github.com/thiong-yuot/ligam-tv.git
   cd ligam-tv
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Configure Nginx (optional reverse proxy)**
   ```nginx
   # /etc/nginx/sites-available/ligam-tv
   server {
       listen 80;
       server_name your-domain.com;

       # App
       location / {
           proxy_pass http://localhost:80;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }

       # HLS
       location /live {
           proxy_pass http://localhost:8080;
           add_header Access-Control-Allow-Origin *;
       }
   }

   # RTMP passthrough (port 1935)
   stream {
       server {
           listen 1935;
           proxy_pass localhost:1935;
       }
   }
   ```

4. **Start Services**
   ```bash
   docker-compose up -d
   ```

5. **Setup SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

## Testing Your Stream

### Quick Test with OSSRS Public Demo

The fastest way to test streaming functionality:

1. **Publishing a Stream**
   ```bash
   # Using OBS Studio or FFmpeg
   # Server: rtmp://ossrs.net:1935/live
   # Stream Key: test_stream_123
   ```

   With FFmpeg:
   ```bash
   ffmpeg -re -i input.mp4 -c copy -f flv rtmp://ossrs.net:1935/live/test_stream_123
   ```

2. **Playing the Stream**
   Open in browser or VLC:
   ```
   http://ossrs.net:8080/live/test_stream_123.m3u8
   ```

### Testing Local SRS Server

1. **Check SRS is running**
   ```bash
   curl http://localhost:1985/api/v1/versions
   ```

2. **Publish test stream**
   ```bash
   ffmpeg -re -i test.mp4 -c copy -f flv rtmp://localhost:1935/live/mystream
   ```

3. **Play in browser**
   - Open your app at `http://localhost:8080`
   - Navigate to stream view
   - HLS URL: `http://localhost:8080/live/mystream.m3u8`

### Testing with OBS Studio

1. **Download and Install OBS**
   - Visit https://obsproject.com/

2. **Configure Streaming**
   - Settings → Stream
   - Service: Custom
   - Server: `rtmp://localhost:1935/live` (or your production URL)
   - Stream Key: your_stream_key

3. **Start Streaming**
   - Add sources (webcam, screen capture, etc.)
   - Click "Start Streaming"

4. **View Stream**
   - Open `http://localhost:8080/live/your_stream_key.m3u8`

## Production Deployment

### Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] SRS_CALLBACK_SECRET is a secure random string
- [ ] Database migrations completed (if any)
- [ ] SSL certificates configured for HTTPS
- [ ] CORS settings configured
- [ ] Health checks implemented
- [ ] Monitoring and logging setup
- [ ] Backup strategy in place

### GitHub Actions Deployment

The repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that:

1. **Runs tests** on every push and PR
2. **Builds Docker images** for main/production branches
3. **Pushes to GitHub Container Registry**
4. **Deploys to production** (configure your deployment method)

**Required GitHub Secrets:**

```
SRS_CALLBACK_SECRET
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
VITE_SUPABASE_PROJECT_ID
VITE_RTMP_URL
VITE_HLS_URL
```

Optional (based on deployment platform):
```
RAILWAY_TOKEN
DEPLOY_HOST
DEPLOY_USER
DEPLOY_KEY
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
```

### Monitoring and Health Checks

**SRS Health Check:**
```bash
curl http://your-domain.com:1985/api/v1/versions
```

**App Health Check:**
```bash
curl http://your-domain.com/
```

**Stream Status:**
```bash
curl http://your-domain.com:1985/api/v1/streams
```

### Scaling Considerations

1. **Horizontal Scaling**
   - Use load balancer for app instances
   - Use origin-edge architecture for SRS (multiple edge servers)

2. **Vertical Scaling**
   - Increase SRS server resources for more concurrent streams
   - Monitor CPU/memory usage

3. **CDN Integration**
   - Use CDN for HLS delivery
   - Reduce origin server load
   - Improve global latency

## Troubleshooting

### Common Issues

#### 1. Cannot connect to RTMP server

**Symptoms:**
- OBS shows "Failed to connect to server"
- FFmpeg connection timeout

**Solutions:**
- Verify SRS is running: `docker-compose ps`
- Check port 1935 is open: `netstat -tuln | grep 1935`
- Verify firewall rules
- Check SRS logs: `docker-compose logs srs`

#### 2. HLS stream not playing

**Symptoms:**
- Video player shows loading indefinitely
- 404 error on .m3u8 file

**Solutions:**
- Verify stream is publishing (check SRS API)
- Check CORS headers
- Verify HLS path in SRS config
- Check browser console for errors

#### 3. Callback authentication failures

**Symptoms:**
- Streams rejected immediately
- "Authentication failed" in logs

**Solutions:**
- Verify SRS_CALLBACK_SECRET matches in SRS and app
- Check callback URL is accessible from SRS container
- Review callback endpoint logs

#### 4. High latency

**Symptoms:**
- 10+ seconds delay in stream

**Solutions:**
- Reduce HLS fragment size in srs.conf
- Use HTTP-FLV instead of HLS for lower latency
- Enable low-latency HLS
- Check network conditions

### Logs and Debugging

**View all logs:**
```bash
docker-compose logs -f
```

**View SRS logs only:**
```bash
docker-compose logs -f srs
```

**View app logs only:**
```bash
docker-compose logs -f app
```

**Check SRS statistics:**
```bash
curl http://localhost:1985/api/v1/streams | jq
```

### Getting Help

1. **SRS Documentation**: https://ossrs.io/lts/en-us/
2. **GitHub Issues**: Create an issue in the repository
3. **SRS Community**: https://github.com/ossrs/srs/discussions

## Additional Resources

- [SRS Documentation](https://ossrs.io/lts/en-us/)
- [OBS Studio Guide](https://obsproject.com/wiki/)
- [FFmpeg Documentation](https://ffmpeg.org/documentation.html)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [HLS.js Documentation](https://github.com/video-dev/hls.js/)

## Security Best Practices

1. **Always use HTTPS in production** for HLS delivery
2. **Keep SRS_CALLBACK_SECRET secure** and rotate regularly
3. **Implement stream key validation** in callbacks
4. **Use firewalls** to restrict access to management ports
5. **Enable rate limiting** to prevent abuse
6. **Monitor for unusual activity**
7. **Keep SRS and dependencies updated**

## Performance Optimization

1. **Enable caching** for HLS segments
2. **Use CDN** for content delivery
3. **Optimize transcoding settings** based on target devices
4. **Monitor resource usage** and scale accordingly
5. **Enable compression** for API responses
6. **Implement connection pooling**

---

For questions or issues, please open an issue on GitHub or consult the documentation.
