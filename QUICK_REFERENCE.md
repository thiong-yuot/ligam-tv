# Quick Reference Guide - ligam-tv SRS Deployment

## 🚀 Quick Start Commands

### Local Development
```bash
# Start everything
docker compose up -d

# Start only SRS (use with npm run dev)
docker compose up -d srs

# View logs
docker compose logs -f

# Stop all services
docker compose down
```

### Using the Helper Script
```bash
# Make executable (first time only)
chmod +x start.sh

# Run the script
./start.sh
```

## 🔑 Essential URLs

### Local Development
- **App**: http://localhost:80
- **RTMP Publish**: rtmp://localhost:1935/live/{stream_key}
- **HLS Playback**: http://localhost:8080/live/{stream_key}.m3u8
- **SRS API**: http://localhost:1985/api/v1/versions

### Production (replace your-domain.com)
- **App**: https://your-domain.com
- **RTMP Publish**: rtmp://your-domain.com:1935/live/{stream_key}
- **HLS Playback**: https://your-domain.com/live/{stream_key}.m3u8
- **SRS API**: http://your-domain.com:1985/api/v1/versions

## 📝 Environment Setup

### Generate Secure Secret
```bash
# Using OpenSSL
openssl rand -hex 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Minimum Required Variables
```env
SRS_CALLBACK_SECRET=your-generated-secret
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-key
VITE_SUPABASE_PROJECT_ID=your-project-id
```

## 🎥 OBS Studio Setup

1. **Settings → Stream**
   - Service: Custom
   - Server: `rtmp://localhost:1935/live`
   - Stream Key: `your_unique_key`

2. **Settings → Output**
   - Output Mode: Advanced
   - Encoder: x264
   - Bitrate: 2500-6000 kbps (adjust for quality)

3. **Settings → Video**
   - Base Resolution: 1920x1080
   - Output Resolution: 1920x1080 (or 1280x720)
   - FPS: 30 or 60

## 🧪 Testing Commands

### Test with FFmpeg
```bash
# Stream a video file
ffmpeg -re -i test.mp4 -c copy -f flv rtmp://localhost:1935/live/test

# Stream with webcam (Linux)
ffmpeg -f v4l2 -i /dev/video0 -c:v libx264 -preset ultrafast -b:v 2500k -f flv rtmp://localhost:1935/live/webcam

# Generate test pattern
ffmpeg -re -f lavfi -i testsrc=duration=60:size=1280x720:rate=30 -c:v libx264 -f flv rtmp://localhost:1935/live/test
```

### Check SRS Status
```bash
# Server version
curl http://localhost:1985/api/v1/versions

# Active streams
curl http://localhost:1985/api/v1/streams

# Server stats
curl http://localhost:1985/api/v1/summaries
```

## 🐳 Docker Commands

### Build Images
```bash
# Build all
docker compose build

# Build specific service
docker compose build srs
docker compose build app
```

### View Service Status
```bash
docker compose ps
```

### Restart Services
```bash
# Restart all
docker compose restart

# Restart specific service
docker compose restart srs
```

### Clean Up
```bash
# Stop and remove containers
docker compose down

# Remove volumes too
docker compose down -v

# Remove images
docker compose down --rmi all
```

## 🔍 Troubleshooting Quick Fixes

### Stream Not Publishing
```bash
# Check SRS is running
docker compose ps srs

# Check SRS logs
docker compose logs srs

# Verify port 1935 is open
netstat -tuln | grep 1935
```

### Stream Not Playing
```bash
# Check HLS files exist
docker compose exec srs ls -la /usr/local/srs/objs/nginx/html/live/

# Check SRS API
curl http://localhost:1985/api/v1/streams

# Check browser console for errors
```

### Permission Denied
```bash
# Make start script executable
chmod +x start.sh

# Fix Docker permissions (Linux)
sudo usermod -aG docker $USER
newgrp docker
```

## 📊 Common SRS API Calls

```bash
# Get server info
curl http://localhost:1985/api/v1/versions | jq

# List all streams
curl http://localhost:1985/api/v1/streams | jq

# Get specific stream
curl http://localhost:1985/api/v1/streams/{stream_id} | jq

# Get clients
curl http://localhost:1985/api/v1/clients | jq
```

## 🌐 Deployment Platform Quick Links

### Railway
```bash
# Install CLI
npm install -g @railway/cli

# Deploy
railway login
railway init
railway up
```

### Render
- Web Service URL: https://dashboard.render.com/
- Choose "Docker" as build method
- Set environment variables in dashboard

### AWS ECS
```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ECR_URI

# Build and push
docker compose build
docker tag ligam-tv-app:latest YOUR_ECR_URI/ligam-tv-app:latest
docker push YOUR_ECR_URI/ligam-tv-app:latest
```

## 📱 Mobile Streaming Apps

### iOS
- **Larix Broadcaster** (Free, professional features)
- **Streamlabs Mobile**

### Android
- **Larix Broadcaster**
- **Prism Live Studio**

### Configuration
- RTMP URL: `rtmp://your-domain:1935/live`
- Stream Key: Your unique key

## 🔗 Useful Links

- [Full Deployment Guide](DEPLOYMENT.md)
- [SRS Documentation](srs/README.md)
- [Contributing Guide](CONTRIBUTING.md)
- [SRS Official Docs](https://ossrs.io/lts/en-us/)
- [OBS Documentation](https://obsproject.com/wiki/)

## 💡 Pro Tips

1. **Low Latency**: Use HTTP-FLV instead of HLS for ~1-2 second latency
2. **Quality**: Higher bitrate = better quality but more bandwidth
3. **Backup**: Keep SRS recordings enabled for DVR functionality
4. **Monitoring**: Set up health checks and alerts for production
5. **CDN**: Use CDN for HLS delivery in production for better performance
6. **Security**: Always use HTTPS for HLS and secure your callback endpoints

---

For detailed information, see [DEPLOYMENT.md](DEPLOYMENT.md)
