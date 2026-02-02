
# Add Products Under Live Streams Section

## Overview
Enhance the Live Streams section on the homepage to display each streamer's products directly below their stream card, creating an integrated "Streamer's Shop" experience. This implements the "Integrated Service Buffet" feature that connects live streams to a creator's store.

## Current State
- LiveStreamsSection displays 4 stream cards in a grid
- Each StreamCard shows: thumbnail, title, streamer name, viewer count, category
- Products exist in the database linked to sellers via `seller_id`
- All demo streams and products are linked to the same user (Jordan Rivera)

## Implementation Approach

### Design Pattern
Create an enhanced stream card component that includes:
1. The existing stream preview (thumbnail, live badge, viewer count)
2. A compact product showcase (2-3 products) beneath each stream
3. A "View Store" link to the creator's full store

```text
┌─────────────────────────────────┐
│     [Stream Thumbnail]          │
│  🔴 LIVE    👁 12.5K            │
│     [Gaming]                    │
├─────────────────────────────────┤
│ 👤 GamerPro                     │
│ Late Night Gaming Session       │
├─────────────────────────────────┤
│ 🛒 Shop Products                │
│ ┌─────┐ ┌─────┐                 │
│ │ 📦  │ │ 📦  │  View Store →   │
│ │$29  │ │$49  │                 │
│ └─────┘ └─────┘                 │
└─────────────────────────────────┘
```

## Files to Create/Modify

### 1. Create New Component: `src/components/home/StreamCardWithProducts.jsx`
A new component that combines the stream card with a product showcase:
- Accepts stream data including `user_id` (seller)
- Fetches products for that seller using `useProducts({ sellerId })`
- Displays 2 compact product thumbnails with prices
- Links to the creator's store page

### 2. Modify: `src/components/home/LiveStreamsSection.jsx`
- Replace `StreamCard` with `StreamCardWithProducts`
- Pass `user_id` to enable product fetching
- Update demo streams to include `userId` for product lookups

### 3. Update Demo Data
Ensure demo streams include `userId` that maps to existing products:
```javascript
const DEMO_STREAMS = [
  {
    id: "demo-1",
    title: "Late Night Gaming Session",
    streamer: "GamerPro",
    userId: "dd046583-99ec-4673-bb90-e7cc90dee21f", // Links to Jordan Rivera's products
    // ... other fields
  }
];
```

## Technical Details

### Product Fetching Strategy
- Use the existing `useProducts({ sellerId })` hook
- Limit display to 2 products per stream card
- Show skeleton loaders while fetching
- Gracefully handle empty product lists (hide section)

### Component Structure
```javascript
const StreamCardWithProducts = ({ 
  id, title, streamer, userId, thumbnail, viewers, category, isLive 
}) => {
  const { products, isLoading } = useProducts({ sellerId: userId });
  const displayProducts = products?.slice(0, 2) || [];
  
  return (
    <div className="stream-card-wrapper">
      {/* Existing stream card content */}
      <StreamThumbnail ... />
      
      {/* New products section */}
      {displayProducts.length > 0 && (
        <ProductsShowcase products={displayProducts} />
      )}
    </div>
  );
};
```

### Responsive Design
- On mobile: Stack products vertically under stream
- On tablet+: Side-by-side product thumbnails
- Product images: 48x48px thumbnails with price overlay

## Data Flow
```text
LiveStreamsSection
  └── useStreams() → fetch streams with user_id
       └── StreamCardWithProducts (for each stream)
            └── useProducts({ sellerId: stream.user_id })
                 └── Display 2 products inline
```

## Expected Outcome
- Each live stream card shows 2 featured products from that streamer
- Users can click products to view details or click "View Store" for full catalog
- Products only show if the streamer has them listed
- Demo data works out-of-the-box with existing products
