

# SRS Streaming Server Integration Plan

## Overview
Complete the streaming pipeline by configuring the SRS RTMP webhook integration and updating the Go Live page with proper server URL handling. This will make streams fully functional once you deploy an SRS server.

## What Changes

### 1. Update `rtmp-webhook` edge function
- The existing function already handles `on_publish`, `on_publish_done`, `on_play`, `on_play_done` actions -- this is solid.
- **Add**: When a stream goes live (`on_publish`), automatically set the `hls_url` field on the stream record so viewers can watch. SRS generates HLS at a predictable path: `http://<srs-server>:8080/live/<stream_key>.m3u8`.
- **Add**: When a stream stops (`on_publish_done`), clear the `hls_url` field.

### 2. Update `create-mux-stream` edge function
- Rename references from "Mux" to "SRS" in log messages (cosmetic clarity).
- Keep the function name as-is for API compatibility.

### 3. Update `GoLive.tsx`
- Add an input field or environment-driven config so the RTMP URL isn't hardcoded to `your-srs-server`.
- Save `is_paid` and `access_price` to the stream record when the creator sets up a paid stream.
- After generating the key, show clearer instructions for connecting OBS/Streamlabs.

### 4. Update `StreamView.tsx`
- The HLS player already reads `stream.hls_url` -- no major changes needed.
- Add auto-refresh polling on the stream query (every 5s) so viewers see the stream go live automatically.

### 5. Update `useStreams.tsx`
- Add `refetchInterval` to `useStream` when the stream is not yet live, so it picks up the `is_live` and `hls_url` changes from the webhook.

---

## Technical Details

### rtmp-webhook changes (edge function)
```text
on_publish handler:
  - Build HLS URL from stream_key: `http://<SRS_HOST>:8080/live/<stream_key>.m3u8`
  - Update streams table: SET hls_url = <built URL>, is_live = true

on_publish_done handler:
  - Update streams table: SET hls_url = NULL, is_live = false
```

The SRS server hostname will be read from a new secret `SRS_SERVER_HOST` so it's configurable without code changes.

### GoLive.tsx changes
- When creating/updating a stream, also save `is_paid` and `access_price` fields.
- Display the RTMP URL from credentials (already done) with better copy UX.

### useStreams.tsx changes
- `useStream` hook: add `refetchInterval: 5000` when `stream.is_live === false` to auto-detect when stream goes live.

### New Secret Required
- `SRS_SERVER_HOST` -- the hostname/IP of your SRS server (e.g., `stream.ligam.tv` or `123.45.67.89`). This will be used by the webhook to construct HLS URLs and by the stream creation function to provide the correct RTMP endpoint.

### Files to modify
1. `supabase/functions/rtmp-webhook/index.ts` -- add HLS URL generation
2. `supabase/functions/create-mux-stream/index.ts` -- use SRS_SERVER_HOST secret for RTMP URL
3. `src/pages/GoLive.tsx` -- save paid stream settings to DB
4. `src/hooks/useStreams.tsx` -- add polling for live status detection

