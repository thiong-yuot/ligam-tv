# SRS (Simple Realtime Server) Dockerfile
# Official OSSRS SRS image with RTMP and HLS support

FROM ossrs/srs:5

# Expose ports
# 1935 - RTMP ingestion
# 8080 - HLS/HTTP-FLV playback
# 1985 - HTTP API
EXPOSE 1935 8080 1985

# Copy SRS configuration
COPY srs.conf /usr/local/srs/conf/srs.conf

# Set working directory
WORKDIR /usr/local/srs

# Start SRS with the configuration file
CMD ["./objs/srs", "-c", "./conf/srs.conf"]
