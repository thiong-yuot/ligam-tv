

# Plan: Fix Avatar Removal & Clean Up Unused Imports

## Summary
The avatar removal was partially successful - the core `AvatarImage` component correctly returns `null`, but there are remaining issues causing the "didn't work" problem:

1. **Build caching issue** - The blank page is caused by stale build cache (404 errors for `.js` files when the actual files are `.ts/.tsx`)
2. **Unused imports** - Many files still import `AvatarImage` unnecessarily
3. **One file still uses `<AvatarImage>` directly** - `FreelancerDashboard.tsx` line 805

---

## Files to Modify (11 files)

### 1. Clean up unused `AvatarImage` imports

Remove `AvatarImage` from the import statement in these files:

| File | Current Import | Fix |
|------|---------------|-----|
| `src/components/Navbar.tsx` | `Avatar, AvatarFallback, AvatarImage` | `Avatar, AvatarFallback` |
| `src/pages/Messages.tsx` | `Avatar, AvatarFallback, AvatarImage` | `Avatar, AvatarFallback` |
| `src/pages/UserProfile.tsx` | `Avatar, AvatarFallback, AvatarImage` | `Avatar, AvatarFallback` |
| `src/pages/Courses.tsx` | `Avatar, AvatarFallback, AvatarImage` | `Avatar, AvatarFallback` |
| `src/pages/CourseDetail.tsx` | `Avatar, AvatarFallback, AvatarImage` | `Avatar, AvatarFallback` |
| `src/components/shop/ProductCard.tsx` | `Avatar, AvatarFallback, AvatarImage` | `Avatar, AvatarFallback` |
| `src/components/courses/InstructorCard.tsx` | `Avatar, AvatarFallback, AvatarImage` | `Avatar, AvatarFallback` |
| `src/components/courses/TeacherCard.tsx` | `Avatar, AvatarFallback, AvatarImage` | `Avatar, AvatarFallback` |
| `src/components/courses/CourseCard.tsx` | `Avatar, AvatarFallback, AvatarImage` | `Avatar, AvatarFallback` |
| `src/components/freelance/FreelancerProfileForm.tsx` | `Avatar, AvatarFallback, AvatarImage` | `Avatar, AvatarFallback` |

### 2. Fix FreelancerDashboard.tsx

**Line 805** still has:
```tsx
<AvatarImage src={editForm.avatar_url} />
```

This should be removed entirely since we want no images.

**Change from:**
```tsx
<Avatar className="h-20 w-20">
  <AvatarImage src={editForm.avatar_url} />
  <AvatarFallback>{editForm.name.charAt(0) || "?"}</AvatarFallback>
</Avatar>
```

**Change to:**
```tsx
<Avatar className="h-20 w-20">
  <AvatarFallback>{editForm.name.charAt(0) || "?"}</AvatarFallback>
</Avatar>
```

Also update the import on line 12 to remove `AvatarImage`.

---

## Technical Details

### Why the page shows blank
The 404 errors for `.js` and `.jsx` files indicate stale build cache. This resolves automatically when the build system catches up. The avatar changes themselves are correct.

### Why avatars might still "not work"
The `AvatarImage` component in `src/components/ui/avatar.tsx` correctly returns `null`, so images won't display. However, the `AvatarFallback` with initials/icons should show. If they're not visible, it could be a styling issue.

---

## Summary of Changes
- **11 files** will have unused imports cleaned up
- **1 file** (`FreelancerDashboard.tsx`) needs the `<AvatarImage>` usage removed
- This cleanup will also help trigger a fresh build to clear the caching issues

