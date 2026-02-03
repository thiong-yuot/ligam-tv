

# Plan: Remove User Pictures/Avatars

## Overview
Remove all user profile pictures from the platform, replacing them with blank/placeholder icons or initials fallbacks only. This affects avatars across navigation, profiles, cards, messages, streams, freelancers, and courses.

---

## Files to Modify

### 1. Core Avatar Component
**`src/components/ui/avatar.tsx`**
- Modify `AvatarImage` to never render (always return null or skip)
- Keep `AvatarFallback` working for initials/icons

### 2. Navigation
**`src/components/Navbar.tsx`**
- Remove `<AvatarImage>` component usage (3 locations)
- Keep only `<AvatarFallback>` with initials

### 3. User Profile Pages
**`src/pages/UserProfile.tsx`**
- Remove avatar image, show only fallback with initials

**`src/pages/CreateProfile.tsx`**
- Already using a placeholder icon - no change needed

### 4. Messages
**`src/pages/Messages.tsx`**
- Remove `<AvatarImage>` from conversation list (line ~206)
- Remove from chat header (line ~267)
- Remove from message bubbles (line ~313)

### 5. Stream Components
**`src/components/StreamCard.tsx`**
- Replace `<img src={avatar}>` with a placeholder icon div

**`src/components/FeaturedStream.tsx`**
- Replace avatar image with placeholder div

**`src/components/home/LiveStreamsSection.tsx`**
- Replace streamer avatar image (line ~214) with placeholder

**`src/pages/StreamView.tsx`**
- Replace streamer avatar in header with placeholder

### 6. Freelancer Components
**`src/components/freelance/FreelancerCard.tsx`**
- Replace `<img src={freelancer.avatar_url}>` with placeholder (grid and list views)

**`src/components/home/FreelancersPreview.tsx`**
- Remove `<AvatarImage>`, keep only fallback

**`src/components/freelance/FeaturedFreelancers.tsx`**
- Replace avatar image with placeholder

**`src/pages/FreelancerProfile.tsx`**
- Replace main profile image with placeholder

**`src/components/freelance/FreelancerProfileForm.tsx`**
- Remove avatar upload functionality, show placeholder only

### 7. Course Components
**`src/components/courses/CourseCard.tsx`**
- Remove instructor `<AvatarImage>`, keep fallback initials

**`src/components/courses/InstructorCard.tsx`**
- Remove `<AvatarImage>`, keep fallback

**`src/components/courses/TeacherCard.tsx`**
- Remove avatar image display

### 8. Shop Components
**`src/components/shop/ProductCard.tsx`**
- Remove seller `<AvatarImage>`, keep fallback

### 9. Sidebar
**`src/components/Sidebar.tsx`**
- Replace streamer avatar images with placeholder divs

---

## Technical Approach

Replace all avatar images with either:
1. **For Avatar components**: Keep `<Avatar>` and `<AvatarFallback>` only, remove `<AvatarImage>`
2. **For raw `<img>` tags**: Replace with a styled div containing a User icon or initials

Example replacement pattern:
```text
Before:
<img src={user.avatar_url} className="w-10 h-10 rounded-full" />

After:
<div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
  <User className="w-5 h-5 text-muted-foreground" />
</div>
```

---

## Summary
- **18 files** will be modified
- All profile pictures replaced with icon/initials placeholders
- Maintains visual layout and sizing
- Removes avatar upload functionality from freelancer form

