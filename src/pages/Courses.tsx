import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CourseCard from "@/components/courses/CourseCard";
import CoursesSidebar from "@/components/courses/CoursesSidebar";
import { useCourses, COURSE_CATEGORIES, COURSE_LEVELS } from "@/hooks/useCourses";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search, Filter, BookOpen, Loader2, X, GraduationCap } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const Courses = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [sortBy, setSortBy] = useState("popular");
  const [minRating, setMinRating] = useState(0);

  const { data: courses = [], isLoading } = useCourses(selectedCategory || undefined);
  const { user } = useAuth();
  const navigate = useNavigate();

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = !selectedLevel || selectedLevel === "all" || course.level === selectedLevel;
    const matchesPrice = showFreeOnly 
      ? course.price === 0 
      : course.price >= priceRange[0] && course.price <= priceRange[1];
    const matchesRating = (course.average_rating || 0) >= minRating;
    
    return matchesSearch && matchesLevel && matchesPrice && matchesRating;
  });

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case "popular": return b.total_enrollments - a.total_enrollments;
      case "rating": return b.average_rating - a.average_rating;
      case "newest": return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      case "price-low": return a.price - b.price;
      case "price-high": return b.price - a.price;
      default: return 0;
    }
  });

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedLevel("");
    setPriceRange([0, 500]);
    setShowFreeOnly(false);
    setMinRating(0);
  };

  const handleCreateCourse = () => {
    if (!user) navigate("/login");
    else navigate("/creator/courses");
  };

  const hasActiveFilters = Boolean(searchQuery || (selectedCategory && selectedCategory !== "all") || (selectedLevel && selectedLevel !== "all") || showFreeOnly || priceRange[0] > 0 || priceRange[1] < 500 || minRating > 0);

  const MobileFilterContent = () => (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground">Category</h3>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {COURSE_CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground">Level</h3>
        <Select value={selectedLevel} onValueChange={setSelectedLevel}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="All Levels" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            {COURSE_LEVELS.map((level) => (
              <SelectItem key={level} value={level} className="capitalize">
                {level.replace("-", " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground">Price Range</h3>
        <Slider value={priceRange} onValueChange={setPriceRange} min={0} max={500} step={10} className="w-full" />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}+</span>
        </div>
        <Button variant={showFreeOnly ? "default" : "outline"} size="sm" className="w-full" onClick={() => setShowFreeOnly(!showFreeOnly)}>
          Free Courses Only
        </Button>
      </div>
      {hasActiveFilters && (
        <Button variant="ghost" className="w-full" onClick={clearFilters}>
          <X className="w-4 h-4 mr-2" /> Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Simple Hero */}
      <section className="pt-24 pb-6 px-4 md:px-6 lg:px-8 bg-background border-b border-border">
        <div className="w-full max-w-[1920px] mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
              Learn
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Courses taught by working professionals.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleCreateCourse}>
            <BookOpen className="w-4 h-4 mr-2" />
            Create a Course
          </Button>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-6 px-4 md:px-6 lg:px-8">
        <div className="w-full max-w-[1920px] mx-auto">
          <div className="flex gap-8">
            <CoursesSidebar
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedLevel={selectedLevel}
              onLevelChange={setSelectedLevel}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              showFreeOnly={showFreeOnly}
              onFreeOnlyChange={setShowFreeOnly}
              minRating={minRating}
              onMinRatingChange={setMinRating}
              onClearFilters={clearFilters}
              hasActiveFilters={hasActiveFilters}
            />

            <div className="flex-1 min-w-0">
              {/* Search & Controls */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search courses..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 bg-card" />
                </div>
                <div className="flex items-center gap-3">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40 bg-card">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                    </SelectContent>
                  </Select>
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="lg:hidden">
                        <Filter className="w-4 h-4 mr-2" /> Filters
                        {hasActiveFilters && <Badge variant="secondary" className="ml-2">Active</Badge>}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-80">
                      <SheetHeader><SheetTitle>Filter Courses</SheetTitle></SheetHeader>
                      <div className="mt-6"><MobileFilterContent /></div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                Showing <span className="font-medium text-foreground">{sortedCourses.length}</span> course{sortedCourses.length !== 1 ? "s" : ""}
              </p>

              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : sortedCourses.length === 0 ? (
                <div className="text-center py-20 bg-card rounded-xl border border-border">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">No courses found</h3>
                  <p className="text-muted-foreground mb-4">
                    {courses.length === 0 ? "Be the first to create a course!" : "Try adjusting your filters"}
                  </p>
                  {courses.length === 0 && <Button onClick={handleCreateCourse}>Create a Course</Button>}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {sortedCourses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Courses;
