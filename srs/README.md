# SRS (Simple Realtime Server) Configuration

This directory contains the SRS streaming server configuration for ligam-tv.

## Files

- `Dockerfile` - Docker image definition for SRS server
- `srs.conf` - SRS server configuration file

## SRS Server Features

### Enabled Features

1. **RTMP Ingestion** (Port 1935)
   - Accepts RTMP streams from OBS, FFmpeg, etc.
   - URL format: `rtmp://your-domain:1935/live/{stream_key}`

2. **HLS Delivery** (Port 8080)
   - HTTP Live Streaming for web playback
   - URL format: `http://your-domain:8080/live/{stream_key}.m3u8`
   - 10-second fragments, 60-second window

3. **HTTP API** (Port 1985)
   - Stream statistics and management
   - API endpoint: `http://your-domain:1985/api/v1/`

4. **HTTP Callbacks**
   - Authentication on publish/unpublish
   - Viewer tracking on play/stop
   - Secured with SRS_CALLBACK_SECRET

### Disabled Features (Can be enabled)

1. **DVR (Recording)**
   - Records streams to disk
   - Enable in `srs.conf` under `dvr` section

2. **Transcoding**
   - Multiple quality streams
   - Enable in `srs.conf` under `transcode` section
   - Requires FFmpeg

3. **Stream Forwarding**
   - Forward to other RTMP servers
   - Enable in `srs.conf` under `forward` section

## Configuration

### Port Mapping

| Port | Protocol | Purpose |
|------|----------|---------|
| 1935 | RTMP | Stream ingestion |
| 8080 | HTTP | HLS playback |
| 1985 | HTTP | API access |

### Environment Variables

- `SRS_CALLBACK_SECRET` - Secret for HTTP callback authentication

## Usage

### Build SRS Docker Image

```bash
docker build -t ligam-tv-srs .
```

### Run SRS Standalone

```bash
docker run -d \
  -p 1935:1935 \
  -p 8080:8080 \
  -p 1985:1985 \
  -e SRS_CALLBACK_SECRET=your-secret \
  --name srs \
  ligam-tv-srs
```

### Run with Docker Compose

```bash
# From project root
docker-compose up srs
```

## Testing SRS

### Check Server Status

```bash
curl http://localhost:1985/api/v1/versions
```

### Publish Test Stream

```bash
ffmpeg -re -i test.mp4 -c copy -f flv rtmp://localhost:1935/live/test
```

### View Stream Info

```bash
curl http://localhost:1985/api/v1/streams
```

## Customization

### Enable DVR (Recording)

Edit `srs.conf`:

```conf
dvr {
    enabled         on;
    dvr_path        ./objs/nginx/html/[app]/[stream].[timestamp].flv;
    dvr_plan        session;
    dvr_duration    30;
    dvr_wait_keyframe   on;
}
```

### Enable Transcoding

Edit `srs.conf`:

```conf
transcode {
    enabled     on;
    ffmpeg      ./objs/ffmpeg/bin/ffmpeg;
    
    engine hd {
        enabled         on;
        vcodec          libx264;
        vbitrate        1500;
        vfps            30;
        vwidth          1280;
        vheight         720;
        # ... rest of config
    }
}
```

### Adjust HLS Settings

For lower latency:

```conf
hls {
    enabled         on;
    hls_path        ./objs/nginx/html;
    hls_fragment    2;  # Smaller fragments
    hls_window      10;  # Smaller window
    # ... rest of config
}
```

## Monitoring

### SRS API Endpoints

- `/api/v1/versions` - Server version info
- `/api/v1/streams` - Active streams
- `/api/v1/clients` - Connected clients
- `/api/v1/configs` - Server configuration

### Logs

View SRS logs:

```bash
docker logs -f srs
```

## Resources

- [SRS Documentation](https://ossrs.io/lts/en-us/)
- [SRS GitHub](https://github.com/ossrs/srs)
- [SRS Docker Hub](https://hub.docker.com/r/ossrs/srs)
- [HTTP Callbacks](https://ossrs.io/lts/en-us/docs/v5/doc/http-callback)
- [HLS Configuration](https://ossrs.io/lts/en-us/docs/v5/doc/delivery-hls)

## Troubleshooting

### Stream Not Playing

1. Check if SRS is running: `docker ps | grep srs`
2. Verify stream is active: `curl http://localhost:1985/api/v1/streams`
3. Check HLS files are generated: `docker exec srs ls -la objs/nginx/html/live/`
4. Review SRS logs: `docker logs srs`

### Callback Failures

1. Verify app service is accessible from SRS
2. Check SRS_CALLBACK_SECRET matches in both containers
3. Review callback endpoint logs

### High CPU Usage

1. Disable transcoding if not needed
2. Limit concurrent connections in config
3. Scale horizontally with multiple SRS instances
