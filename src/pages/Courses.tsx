import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CourseCard from "@/components/courses/CourseCard";
import CoursesSidebar from "@/components/courses/CoursesSidebar";
import { useCourses, useFeaturedCourses, COURSE_CATEGORIES, COURSE_LEVELS } from "@/hooks/useCourses";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Search, Filter, BookOpen, Loader2, X, GraduationCap, 
  Play, Star, Users, TrendingUp, Award
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

// Featured instructors
const featuredInstructors = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    name: "Sarah Chen",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face",
    title: "Full-Stack Developer",
    students: 8543,
    courses: 3,
    rating: 4.8
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    name: "Marcus Thompson",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    title: "Marketing Expert",
    students: 5621,
    courses: 2,
    rating: 4.7
  }
];

const Courses = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [sortBy, setSortBy] = useState("popular");
  const [minRating, setMinRating] = useState(0);

  const { data: courses = [], isLoading } = useCourses(selectedCategory || undefined);
  const { data: featuredCourses = [] } = useFeaturedCourses();
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

  // Sort courses
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return b.total_enrollments - a.total_enrollments;
      case "rating":
        return b.average_rating - a.average_rating;
      case "newest":
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      default:
        return 0;
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
    if (!user) {
      navigate("/login");
    } else {
      navigate("/creator/courses");
    }
  };

  const hasActiveFilters = Boolean(searchQuery || (selectedCategory && selectedCategory !== "all") || (selectedLevel && selectedLevel !== "all") || showFreeOnly || priceRange[0] > 0 || priceRange[1] < 500 || minRating > 0);

  const stats = [
    { icon: Users, label: "Students", value: "14K+" },
    { icon: Star, label: "Avg Rating", value: "4.8" },
    { icon: Award, label: "Expert Instructors", value: "50+" },
    { icon: TrendingUp, label: "Completion Rate", value: "94%" },
  ];

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
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          min={0}
          max={500}
          step={10}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}+</span>
        </div>
        <Button
          variant={showFreeOnly ? "default" : "outline"}
          size="sm"
          className="w-full"
          onClick={() => setShowFreeOnly(!showFreeOnly)}
        >
          Free Courses Only
        </Button>
      </div>

      {hasActiveFilters && (
        <Button variant="ghost" className="w-full" onClick={clearFilters}>
          <X className="w-4 h-4 mr-2" />
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Banner - Like Freelance */}
      <section className="pt-24 pb-8 px-4 bg-gradient-to-b from-purple-500/5 to-background border-b border-border">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 text-purple-400 text-sm font-medium mb-4">
                <GraduationCap className="w-4 h-4" />
                Skills Academy
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
                Level Up <span className="text-purple-400">Your Skills</span>
              </h1>
              <p className="text-muted-foreground max-w-lg">
                Courses taught by working professionals in dev, design, marketing, and beyond.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleCreateCourse}>
                <BookOpen className="w-4 h-4 mr-2" />
                Create a Course
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-card/50 rounded-xl p-4 border border-border">
                <stat.icon className="w-5 h-5 text-purple-400 mb-2" />
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="flex gap-8">
            {/* Sidebar */}
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

            {/* Main Content Area */}
            <div className="flex-1 min-w-0">
              {/* Featured Instructors */}
              {!searchQuery && (!selectedCategory || selectedCategory === "all") && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Award className="w-5 h-5 text-purple-400" />
                    <h2 className="text-lg font-semibold text-foreground">Top Instructors</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {featuredInstructors.map((instructor) => (
                      <Card key={instructor.id} className="bg-card border-border hover:border-purple-500/50 transition-all group">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Avatar className="w-12 h-12 border-2 border-purple-500/20">
                              <AvatarImage src={instructor.avatar} />
                              <AvatarFallback className="bg-purple-500/10 text-purple-400">
                                {instructor.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-foreground group-hover:text-purple-400 transition-colors">
                                  {instructor.name}
                                </h3>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{instructor.title}</p>
                              <div className="flex items-center gap-3 text-xs">
                                <div className="flex items-center gap-1">
                                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                  <span>{instructor.rating}</span>
                                </div>
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <Users className="w-3 h-3" />
                                  <span>{instructor.students.toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Featured Courses */}
              {featuredCourses.length > 0 && !searchQuery && (!selectedCategory || selectedCategory === "all") && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                    <h2 className="text-lg font-semibold text-foreground">Featured Courses</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {featuredCourses.slice(0, 3).map((course) => (
                      <CourseCard key={course.id} course={course} />
                    ))}
                  </div>
                </div>
              )}

              {/* Search & Controls Header */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-card"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40 bg-card">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Filter Button (Mobile) */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="lg:hidden">
                        <Filter className="w-4 h-4 mr-2" />
                        Filters
                        {hasActiveFilters && (
                          <Badge variant="secondary" className="ml-2">Active</Badge>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-80">
                      <SheetHeader>
                        <SheetTitle>Filter Courses</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6">
                        <MobileFilterContent />
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>

              {/* Results count */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">
                  Showing <span className="font-medium text-foreground">{sortedCourses.length}</span> course{sortedCourses.length !== 1 ? "s" : ""}
                </p>
              </div>

              {/* Course Grid */}
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
                </div>
              ) : sortedCourses.length === 0 ? (
                <div className="text-center py-20 bg-card/50 rounded-xl border border-border">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">No courses found</h3>
                  <p className="text-muted-foreground mb-6">
                    {courses.length === 0 
                      ? "Be the first to create a course!"
                      : "Try adjusting your search or filters"
                    }
                  </p>
                  {courses.length === 0 && (
                    <Button onClick={handleCreateCourse}>
                      Create a Course
                    </Button>
                  )}
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

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-t from-purple-500/5 to-background border-t border-border">
        <div className="container mx-auto">
          <div className="bg-card rounded-2xl border border-border p-8 md:p-12 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 text-purple-400 text-sm font-medium mb-4">
              <GraduationCap className="w-4 h-4" />
              Share Your Knowledge
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
              Ready to Teach Your Skills?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Create and sell courses to thousands of learners. Earn up to 85% revenue share on every enrollment.
            </p>
            <Button size="lg" className="glow" onClick={handleCreateCourse}>
              <Play className="w-4 h-4 mr-2" />
              Create Your Course
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Courses;