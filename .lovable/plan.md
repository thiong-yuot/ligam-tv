

# SRS Streaming Integration (No Server Required Yet)

## Overview
Wire up the full SRS streaming pipeline with a configurable placeholder. Everything will work the moment you point it at a real SRS server -- no code changes needed at that point, just set one secret value.

## What Changes

### 1. Update `rtmp-webhook` edge function
- On `on_publish`: build the HLS URL using `SRS_SERVER_HOST` env var (falls back to `localhost:8080`) and save it to the `hls_url` column, plus fetch the `stream_key` from `stream_credentials` to construct the correct path
- On `on_publish_done`: clear `hls_url` and set `is_live = false`
- This means the webhook is fully automated -- SRS calls it, and viewers see the stream appear

### 2. Update `create-mux-stream` edge function
- Read `SRS_SERVER_HOST` from env to construct the real RTMP URL (`rtmp://<host>:1935/live`) instead of the placeholder
- Update log prefixes from `[CREATE-STREAM]` (cosmetic)
- Falls back to `your-srs-server` if the secret isn't set yet

### 3. Update `GoLive.tsx`
- Save `is_paid`, `access_price`, and `preview_video_url` to the stream record when creating/updating
- Add OBS/Streamlabs setup instructions below the credentials
- Show a note that the RTMP server needs to be configured if it still shows the placeholder URL

### 4. Update `useStreams.tsx`
- Add `refetchInterval: 5000` to `useStream` hook so the stream page automatically detects when a stream goes live (picks up `is_live` and `hls_url` changes from the webhook)

### 5. Update `StreamView.tsx`
- Add polling on the stream query (5s) so viewers see the stream go live without refreshing

## When You Get a Server
Later, you just need to set one secret (`SRS_SERVER_HOST`) with your server's hostname (e.g., `stream.ligam.tv`) and everything connects automatically.

---

## Technical Details

### rtmp-webhook changes

```text
on_publish handler additions:
  1. Read SRS_SERVER_HOST from Deno.env (fallback: "localhost:8080")
  2. Fetch stream_key from stream_credentials table for this stream
  3. Build HLS URL: http://<SRS_SERVER_HOST>/live/<stream_key>.m3u8
  4. UPDATE streams SET hls_url = <url>, is_live = true, started_at = now()

on_publish_done handler additions:
  1. UPDATE streams SET hls_url = NULL, is_live = false, ended_at = now()
```

### create-mux-stream changes

```text
  1. Read SRS_SERVER_HOST from Deno.env (fallback: "your-srs-server")
  2. Build RTMP URL: rtmp://<SRS_SERVER_HOST>:1935/live
  3. Use this URL when inserting/upserting stream_credentials
```

### GoLive.tsx changes
- Pass `is_paid`, `access_price`, and `preview_video_url` when calling `createStream.mutateAsync()`
- After stream creation, also update the stream record with paid settings via a direct Supabase update
- Add a help section with OBS setup steps

### useStreams.tsx changes
- `useStream` hook: add `refetchInterval: 5000` to auto-detect live status changes

### StreamView.tsx changes
- The `useStream` call already exists at line 66 -- the refetchInterval in the hook handles this automatically

### Files to modify
1. `supabase/functions/rtmp-webhook/index.ts`
2. `supabase/functions/create-mux-stream/index.ts`
3. `src/pages/GoLive.tsx`
4. `src/hooks/useStreams.tsx`

