
# JavaScript Conversion Plan - Remaining Files

## Overview
Continue converting the remaining TypeScript (.tsx/.ts) files to JavaScript (.jsx/.js). This will complete the migration started earlier.

## Files to Convert

### Phase 1: UI Components (48 files)
The `src/components/ui/` folder contains all Shadcn UI components. These need careful handling as they contain TypeScript type definitions.

Files: accordion, alert-dialog, alert, aspect-ratio, avatar, badge, breadcrumb, button, calendar, card, carousel, chart, checkbox, collapsible, command, context-menu, dialog, drawer, dropdown-menu, form, hover-card, input-otp, input, label, menubar, navigation-menu, pagination, popover, progress, radio-group, resizable, scroll-area, select, separator, sheet, sidebar, skeleton, slider, sonner, switch, table, tabs, textarea, toast, toaster, toggle-group, toggle, tooltip, use-toast

### Phase 2: Feature Components (25 files)
Root level and subdirectory components:

**Root components (14):**
- AddProductDialog, AddServiceDialog, BecomeFreelancerDialog, BecomeSellerDialog
- CartSheet, CategoryCard, CategoryFilter, ContactFreelancerDialog
- FeatureGate, FeaturedStream, GetFeatured, HLSVideoPlayer
- HighlightedTip, LigamLogo, NavLink, StatsBar, StreamCard
- TipDialog, VirtualGifts, WhyChooseLigam

**Channel (4):** FeaturedCoursesWidget, FeaturedGigsWidget, FeaturedProductsWidget, SubscribeWidget

**Courses (6):** AddCourseDialog, CourseCard, CourseForm, CoursesSidebar, InstructorCard, TeacherCard

**Freelance (7):** FeaturedFreelancers, FreelanceHeader, FreelanceSidebar, FreelancerCard, FreelancerProfileForm, MobileFreelanceFilters, PackageForm

**Shop (5):** FeaturedCarousel, MobileFilters, ProductCard, ShopHeader, ShopSidebar

**Stream (1):** StreamGifts

**Monetization (2):** IdentityVerificationCard, WithdrawalDialog

### Phase 3: Pages (45 files)
All page files except Index.jsx (already done):

About, Admin, Affiliates, Analytics, ApiAccess, Auth, Browse, Careers, Categories, Contact, Cookies, CourseDetail, Courses, CreateProfile, CreatorCourses, Dashboard, Discovery, FAQ, Freelance, FreelancerDashboard, FreelancerProfile, GoLive, Guidelines, Help, HelpArticle, HelpCategory, LearnCourse, Messages, Monetization, MyLearning, NotFound, Notifications, Premium, Press, Pricing, Privacy, Reels, Safety, SellerDashboard, Shop, StreamSetup, StreamView, Technology, Terms, UserProfile

## Conversion Process
For each file:
1. Remove TypeScript interfaces/types
2. Remove type annotations from function parameters and return types
3. Remove generic type parameters
4. Change file extension from .tsx to .jsx (or .ts to .js)
5. Delete the original TypeScript file

## Technical Notes
- The `src/integrations/supabase/` files (client.ts, types.ts) will remain as TypeScript since they are auto-generated
- UI components use React.forwardRef with generics - these will be simplified
- Some components use ComponentPropsWithoutRef - will use basic prop spreading instead

## Execution Order
Due to the large number of files, I'll process them in batches:
1. **Batch 1:** UI components (most foundational)
2. **Batch 2:** Feature components 
3. **Batch 3:** Pages

Each batch will include file creation and deletion of old TypeScript versions.
