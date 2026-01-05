import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CourseCard from "@/components/courses/CourseCard";
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
  Play, Star, Users, TrendingUp, Award, Clock, ArrowRight,
  CheckCircle, Zap, Target, BarChart3
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
    
    return matchesSearch && matchesLevel && matchesPrice;
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
  };

  const handleCreateCourse = () => {
    if (!user) {
      navigate("/login");
    } else {
      navigate("/creator/courses");
    }
  };

  const hasActiveFilters = searchQuery || (selectedCategory && selectedCategory !== "all") || (selectedLevel && selectedLevel !== "all") || showFreeOnly || priceRange[0] > 0 || priceRange[1] < 500;

  const stats = [
    { icon: BookOpen, label: "Courses", value: courses.length > 0 ? courses.length.toString() : "100+" },
    { icon: Users, label: "Students", value: "14K+" },
    { icon: Star, label: "Avg Rating", value: "4.8" },
    { icon: Award, label: "Expert Instructors", value: "50+" },
  ];

  const whyLearnHere = [
    { icon: Zap, title: "Learn at Your Pace", description: "Lifetime access to all course materials" },
    { icon: Target, title: "Hands-on Projects", description: "Build real projects for your portfolio" },
    { icon: Award, title: "Certificates", description: "Earn certificates to showcase your skills" },
    { icon: BarChart3, title: "Track Progress", description: "Monitor your learning journey" },
  ];

  const FilterContent = () => (
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
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-primary/10 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.15),transparent_50%)]" />
        
        <div className="relative w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-purple-500/10 text-purple-400 px-4 py-2 rounded-full mb-6">
                <GraduationCap className="w-5 h-5" />
                <span className="font-medium">Skills Academy</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                Learn Skills That
                <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent block mt-2">
                  Transform Your Career
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Access expert-led courses in development, marketing, design, and more. 
                Join thousands of students already learning on Ligam.
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search for any course, topic, or skill..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-6 text-lg bg-card border-border rounded-xl shadow-lg"
                />
              </div>

              {/* Quick categories */}
              <div className="flex flex-wrap justify-center gap-2 mt-6">
                <span className="text-sm text-muted-foreground">Popular:</span>
                {["Development", "Marketing", "Design", "Business"].map((cat) => (
                  <Badge 
                    key={cat} 
                    variant="outline" 
                    className="cursor-pointer hover:bg-primary/10 hover:border-primary transition-colors"
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <Card key={index} className="bg-card/50 border-border backdrop-blur-sm hover:border-primary/30 transition-colors">
                  <CardContent className="p-4 text-center">
                    <stat.icon className="w-8 h-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Instructors */}
      <section className="py-12 bg-card/30 border-y border-border">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Top Instructors</h2>
                <p className="text-muted-foreground mt-1">Learn from industry experts</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredInstructors.map((instructor) => (
                <Card key={instructor.id} className="bg-card border-border hover:border-primary/50 transition-all group">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-16 h-16 border-2 border-primary/20">
                        <AvatarImage src={instructor.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary text-lg">
                          {instructor.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {instructor.name}
                          </h3>
                          <Award className="w-4 h-4 text-primary" />
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{instructor.title}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="font-medium">{instructor.rating}</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Users className="w-4 h-4" />
                            <span>{instructor.students.toLocaleString()} students</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <BookOpen className="w-4 h-4" />
                            <span>{instructor.courses} courses</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      {featuredCourses.length > 0 && (
        <section className="py-12">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">Featured Courses</h2>
                    <p className="text-muted-foreground text-sm">Hand-picked by our team</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {featuredCourses.slice(0, 4).map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Why Learn Here */}
      <section className="py-12 bg-muted/30">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Why Learn on Ligam?</h2>
              <p className="text-muted-foreground">Everything you need to succeed</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {whyLearnHere.map((item, index) => (
                <Card key={index} className="bg-card border-border text-center hover:border-primary/50 transition-all">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - All Courses */}
      <main className="py-12">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">All Courses</h2>
              <p className="text-muted-foreground">Browse our complete course catalog</p>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col lg:flex-row gap-4 mb-8">
              <div className="flex flex-wrap gap-3 flex-1">
                {/* Category Pills */}
                <div className="flex flex-wrap gap-2">
                  <Badge 
                    variant={!selectedCategory || selectedCategory === "all" ? "default" : "outline"}
                    className="cursor-pointer px-4 py-2"
                    onClick={() => setSelectedCategory("all")}
                  >
                    All
                  </Badge>
                  {COURSE_CATEGORIES.slice(0, 6).map((cat) => (
                    <Badge 
                      key={cat}
                      variant={selectedCategory === cat ? "default" : "outline"}
                      className="cursor-pointer px-4 py-2"
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Sort and Filter */}
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
                      <FilterContent />
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Desktop Filters */}
                <div className="hidden lg:flex items-center gap-3">
                  <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                    <SelectTrigger className="w-40 bg-card">
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

                  <Button
                    variant={showFreeOnly ? "default" : "outline"}
                    onClick={() => setShowFreeOnly(!showFreeOnly)}
                  >
                    Free Only
                  </Button>

                  {hasActiveFilters && (
                    <Button variant="ghost" onClick={clearFilters}>
                      <X className="w-4 h-4 mr-1" />
                      Clear
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedCategory && selectedCategory !== "all" && (
                  <Badge variant="secondary" className="gap-1 pl-3">
                    {selectedCategory}
                    <X className="w-3 h-3 cursor-pointer ml-1" onClick={() => setSelectedCategory("")} />
                  </Badge>
                )}
                {selectedLevel && selectedLevel !== "all" && (
                  <Badge variant="secondary" className="gap-1 pl-3 capitalize">
                    {selectedLevel.replace("-", " ")}
                    <X className="w-3 h-3 cursor-pointer ml-1" onClick={() => setSelectedLevel("")} />
                  </Badge>
                )}
                {showFreeOnly && (
                  <Badge variant="secondary" className="gap-1 pl-3">
                    Free Only
                    <X className="w-3 h-3 cursor-pointer ml-1" onClick={() => setShowFreeOnly(false)} />
                  </Badge>
                )}
              </div>
            )}

            {/* Course Grid */}
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : sortedCourses.length === 0 ? (
              <div className="text-center py-20">
                <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No courses found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search query
                </p>
                {hasActiveFilters && (
                  <Button variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-muted-foreground">
                    Showing <span className="font-medium text-foreground">{sortedCourses.length}</span> course{sortedCourses.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {sortedCourses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Share Your Expertise?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Create and sell courses to thousands of learners. Earn up to 85% revenue share 
              on every enrollment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={handleCreateCourse} className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Play className="w-5 h-5 mr-2" />
                Create a Course
              </Button>
              <Link to="/my-learning">
                <Button size="lg" variant="outline">
                  <BookOpen className="w-5 h-5 mr-2" />
                  My Learning
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Courses;
