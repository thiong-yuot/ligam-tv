# ligam-tv - Live Streaming Platform

A modern live streaming platform with RTMP ingestion and HLS playback powered by SRS (Simple Realtime Server).

## 🎥 Features

- **Live Streaming**: RTMP ingestion with HLS/HTTP-FLV playback
- **Low Latency**: Optimized for real-time streaming
- **Secure**: Stream authentication with callback secrets
- **Scalable**: Docker-based deployment ready for production
- **Modern UI**: Built with React, TypeScript, and Tailwind CSS

## 🚀 Quick Start

### Local Development

1. **Clone the repository**
   ```sh
   git clone https://github.com/thiong-yuot/ligam-tv.git
   cd ligam-tv
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Configure environment**
   ```sh
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development server**
   ```sh
   npm run dev
   ```

5. **Start SRS server (optional, for local streaming)**
   ```sh
   docker compose up srs
   ```

The app will be available at `http://localhost:8080`

### Docker Deployment

**Build and run all services:**
```sh
docker compose up -d
```

**View logs:**
```sh
docker compose logs -f
```

**Stop services:**
```sh
docker compose down
```

## 📡 Streaming Setup

### Publishing Streams

**RTMP URL Format:**
```
rtmp://your-domain:1935/live/{stream_key}
```

**Using OBS Studio:**
1. Settings → Stream
2. Service: Custom
3. Server: `rtmp://localhost:1935/live` (or your production URL)
4. Stream Key: your_unique_stream_key

**Using FFmpeg:**
```sh
ffmpeg -re -i input.mp4 -c copy -f flv rtmp://localhost:1935/live/mystream
```

### Watching Streams

**HLS URL Format:**
```
http://your-domain:8080/live/{stream_key}.m3u8
```

Open in any HLS-compatible player (browser, VLC, etc.)

## 🛠 Technologies

- **Frontend**: Vite, React 18, TypeScript
- **UI Framework**: shadcn-ui, Tailwind CSS
- **Streaming Server**: SRS (Simple Realtime Server)
- **Video Player**: HLS.js
- **Backend**: Supabase
- **Deployment**: Docker, Docker Compose

## 📚 Documentation

- [Deployment Guide](DEPLOYMENT.md) - Complete deployment instructions
- [SRS Configuration](srs/README.md) - SRS server documentation

## 🔧 Environment Variables

Required environment variables:

```env
# Supabase
VITE_SUPABASE_PROJECT_ID=your-project-id
VITE_SUPABASE_PUBLISHABLE_KEY=your-key
VITE_SUPABASE_URL=your-url

# SRS Streaming
SRS_CALLBACK_SECRET=your-secret
VITE_RTMP_URL=rtmp://localhost:1935/live
VITE_HLS_URL=http://localhost:8080/live
```

See `.env.example` for complete configuration.

## 🧪 Testing

**Run linter:**
```sh
npm run lint
```

**Build application:**
```sh
npm run build
```

**Test local streaming:**
See [DEPLOYMENT.md](DEPLOYMENT.md#testing-your-stream) for complete testing guide.

## 📦 Deployment

This project supports deployment to:
- Railway (recommended for RTMP support)
- Render
- AWS ECS/Fargate
- Google Cloud Run
- Self-hosted with Docker Compose

See [DEPLOYMENT.md](DEPLOYMENT.md) for platform-specific instructions.

## 🔐 Security

- Secure callback authentication with secrets
- Stream key validation
- Environment variable protection
- HTTPS for production HLS delivery
- CORS configuration

## 📄 License

This project is part of the Lovable platform.

## 🤝 Contributing

For development workflow, see the [development guide](DEPLOYMENT.md#local-development-setup).

## 📞 Support

- [GitHub Issues](https://github.com/thiong-yuot/ligam-tv/issues)
- [SRS Documentation](https://ossrs.io/lts/en-us/)

---

Built with ❤️ using [Lovable](https://lovable.dev)
