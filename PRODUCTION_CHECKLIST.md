# Production Deployment Checklist

Use this checklist to ensure a smooth production deployment of ligam-tv with SRS streaming.

## Pre-Deployment

### Infrastructure
- [ ] Domain name registered and DNS configured
- [ ] SSL certificates obtained (Let's Encrypt recommended)
- [ ] Server/hosting platform selected (Railway, AWS, self-hosted, etc.)
- [ ] Database setup completed (Supabase configured)
- [ ] CDN configured (optional but recommended for HLS)

### Configuration Files
- [ ] `.env` file created with production values
- [ ] `SRS_CALLBACK_SECRET` generated (secure random string)
- [ ] All Supabase credentials added to environment
- [ ] RTMP and HLS URLs updated for production domain
- [ ] Docker Compose configuration reviewed
- [ ] Nginx configuration reviewed (if applicable)

### Security
- [ ] All secrets are secure random strings (min 32 characters)
- [ ] Environment variables not committed to repository
- [ ] HTTPS enabled for all web traffic
- [ ] Firewall rules configured
  - [ ] Port 80/443 (HTTP/HTTPS) - open to public
  - [ ] Port 1935 (RTMP) - open to public or whitelisted IPs
  - [ ] Port 1985 (SRS API) - restricted or behind firewall
- [ ] Stream authentication implemented
- [ ] Rate limiting configured

### GitHub Setup
- [ ] Repository secrets configured
  - [ ] `SRS_CALLBACK_SECRET`
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SUPABASE_PUBLISHABLE_KEY`
  - [ ] `VITE_SUPABASE_PROJECT_ID`
  - [ ] `VITE_RTMP_URL`
  - [ ] `VITE_HLS_URL`
  - [ ] Platform-specific secrets (RAILWAY_TOKEN, AWS credentials, etc.)
- [ ] GitHub Actions workflow tested on a test branch
- [ ] Container registry access configured

## Deployment

### Build & Test
- [ ] Application builds successfully locally
  ```bash
  npm run build
  ```
- [ ] Docker images build successfully
  ```bash
  docker compose build
  ```
- [ ] Linter passes with no errors
  ```bash
  npm run lint
  ```
- [ ] All Docker Compose services start successfully
  ```bash
  docker compose up -d
  docker compose ps
  ```
- [ ] SRS health check passes
  ```bash
  curl http://localhost:1985/api/v1/versions
  ```

### Deployment Steps
- [ ] Images pushed to container registry
- [ ] Services deployed to production platform
- [ ] Environment variables configured on platform
- [ ] Health checks passing
- [ ] DNS records updated/verified
- [ ] SSL certificates installed and working

### Post-Deployment Verification
- [ ] Application accessible via HTTPS
- [ ] RTMP endpoint accessible (test with OBS)
- [ ] HLS playback working
- [ ] SRS API accessible (if required)
- [ ] Database connections working
- [ ] Authentication working
- [ ] All major features tested

## Testing

### Streaming Tests
- [ ] RTMP publish test
  ```bash
  ffmpeg -re -i test.mp4 -c copy -f flv rtmp://your-domain:1935/live/test
  ```
- [ ] HLS playback test
  - Open `https://your-domain.com/live/test.m3u8` in browser
- [ ] OBS Studio connection test
- [ ] Mobile app streaming test (if applicable)
- [ ] Multiple concurrent streams test
- [ ] Long-duration stream test (>1 hour)

### Performance Tests
- [ ] Load time < 3 seconds
- [ ] Stream latency acceptable (10-30s for HLS)
- [ ] No buffering under normal conditions
- [ ] CPU/memory usage within limits
- [ ] Network bandwidth adequate

### Browser Compatibility
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

## Monitoring & Observability

### Monitoring Setup
- [ ] Server monitoring configured (CPU, RAM, disk, network)
- [ ] Application logging configured
- [ ] SRS logging configured and accessible
- [ ] Error tracking setup (Sentry, etc.)
- [ ] Uptime monitoring (UptimeRobot, Pingdom, etc.)
- [ ] Stream quality monitoring

### Alerts
- [ ] CPU usage > 80%
- [ ] Memory usage > 80%
- [ ] Disk usage > 80%
- [ ] Service downtime
- [ ] High error rates
- [ ] Failed deployments

### Logging
- [ ] Application logs centralized
- [ ] SRS logs accessible
- [ ] Log rotation configured
- [ ] Sensitive data not logged

## Documentation

- [ ] Production URLs documented
- [ ] Streaming instructions for content creators
- [ ] Troubleshooting guide updated
- [ ] Team members trained on deployment process
- [ ] Rollback procedure documented
- [ ] Incident response plan created

## Backup & Recovery

- [ ] Database backup strategy in place
- [ ] Automated backups configured
- [ ] Backup restoration tested
- [ ] Stream recordings backed up (if DVR enabled)
- [ ] Configuration files backed up
- [ ] Disaster recovery plan documented

## Optimization

### Performance
- [ ] CDN configured for HLS delivery
- [ ] Image optimization (WebP, compression)
- [ ] JavaScript bundle size optimized
- [ ] CSS minification enabled
- [ ] Gzip/Brotli compression enabled
- [ ] Caching headers configured

### Scaling
- [ ] Horizontal scaling plan documented
- [ ] Auto-scaling configured (if applicable)
- [ ] Load balancer configured (if multiple instances)
- [ ] Database connection pooling configured
- [ ] Resource limits set appropriately

## Compliance & Legal

- [ ] Privacy policy updated
- [ ] Terms of service updated
- [ ] GDPR compliance verified (if applicable)
- [ ] DMCA takedown process established
- [ ] Content moderation policy in place
- [ ] Age restrictions configured (if applicable)

## Platform-Specific

### Railway
- [ ] TCP proxy enabled for port 1935
- [ ] Environment variables set in dashboard
- [ ] Auto-deploy from GitHub configured
- [ ] Custom domain connected

### AWS ECS/Fargate
- [ ] Task definition created
- [ ] Service created with desired count
- [ ] Load balancer configured
- [ ] Auto-scaling policies configured
- [ ] CloudWatch alarms set up

### Self-Hosted
- [ ] Server hardened (fail2ban, SSH keys, etc.)
- [ ] Automatic updates configured
- [ ] Nginx/reverse proxy configured
- [ ] SSL auto-renewal configured (certbot)
- [ ] Firewall rules configured (ufw/iptables)

## Post-Launch

### Week 1
- [ ] Monitor metrics closely
- [ ] Review logs daily
- [ ] Address any issues immediately
- [ ] Gather user feedback
- [ ] Fine-tune performance

### Month 1
- [ ] Review and optimize costs
- [ ] Analyze usage patterns
- [ ] Update documentation based on real usage
- [ ] Plan scaling if needed
- [ ] Review security logs

### Ongoing
- [ ] Regular security updates
- [ ] Dependency updates
- [ ] Performance optimization
- [ ] Feature improvements based on feedback
- [ ] Regular backup verification

## Emergency Contacts

- [ ] DevOps/Platform support contact info saved
- [ ] Database admin contact info saved
- [ ] DNS provider support info saved
- [ ] CDN provider support info saved

## Rollback Plan

In case of critical issues:

1. [ ] Rollback procedure documented
2. [ ] Previous working version tagged in Git
3. [ ] Database migration rollback scripts ready
4. [ ] Quick rollback command prepared
   ```bash
   # Example
   docker compose pull && docker compose up -d --force-recreate
   ```

## Success Criteria

- [ ] Application accessible with 99.9% uptime
- [ ] Stream latency < 30 seconds
- [ ] Page load time < 3 seconds
- [ ] Zero critical security vulnerabilities
- [ ] All core features working as expected
- [ ] Monitoring and alerts functional

---

**Sign-off:**

- Deployed by: _______________
- Date: _______________
- Git commit: _______________
- Review by: _______________

**Notes:**
_______________________________________________
_______________________________________________
_______________________________________________
