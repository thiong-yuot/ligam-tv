import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CourseCard from "@/components/courses/CourseCard";
import { useCourses, COURSE_CATEGORIES, COURSE_LEVELS } from "@/hooks/useCourses";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search, Filter, BookOpen, Loader2, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const Courses = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [showFreeOnly, setShowFreeOnly] = useState(false);

  const { data: courses = [], isLoading } = useCourses(selectedCategory || undefined);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = !selectedLevel || course.level === selectedLevel;
    const matchesPrice = showFreeOnly 
      ? course.price === 0 
      : course.price >= priceRange[0] && course.price <= priceRange[1];
    
    return matchesSearch && matchesLevel && matchesPrice;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedLevel("");
    setPriceRange([0, 500]);
    setShowFreeOnly(false);
  };

  const hasActiveFilters = searchQuery || selectedCategory || selectedLevel || showFreeOnly || priceRange[0] > 0 || priceRange[1] < 500;

  const FilterContent = () => (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground">Category</h3>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
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
          <SelectTrigger>
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
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-8 h-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Explore Courses
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Learn from expert creators. Master new skills with high-quality video courses.
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Mobile Filter Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="md:hidden">
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-2">Active</Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Filter Courses</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FilterContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-6 p-4 bg-card rounded-lg border border-border">
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </h2>
              <FilterContent />
            </div>
          </aside>

          {/* Course Grid */}
          <div className="flex-1">
            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedCategory && (
                  <Badge variant="secondary" className="gap-1">
                    {selectedCategory}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory("")} />
                  </Badge>
                )}
                {selectedLevel && (
                  <Badge variant="secondary" className="gap-1 capitalize">
                    {selectedLevel.replace("-", " ")}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedLevel("")} />
                  </Badge>
                )}
                {showFreeOnly && (
                  <Badge variant="secondary" className="gap-1">
                    Free Only
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setShowFreeOnly(false)} />
                  </Badge>
                )}
              </div>
            )}

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredCourses.length === 0 ? (
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
                <p className="text-sm text-muted-foreground mb-4">
                  {filteredCourses.length} course{filteredCourses.length !== 1 ? "s" : ""} found
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Courses;
