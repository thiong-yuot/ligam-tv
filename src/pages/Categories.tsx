import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CategoryCard from "@/components/CategoryCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

import categoryGaming from "@/assets/category-gaming.jpg";
import categoryMusic from "@/assets/category-music.jpg";
import streamThumb1 from "@/assets/stream-thumb-1.jpg";
import streamThumb2 from "@/assets/stream-thumb-2.jpg";
import streamThumb3 from "@/assets/stream-thumb-3.jpg";

const Categories = () => {
  const categories = [
    {
      id: "gaming",
      name: "Gaming",
      image: categoryGaming,
      viewers: 285000,
      tags: ["Action", "RPG", "FPS"],
    },
    {
      id: "music",
      name: "Music",
      image: categoryMusic,
      viewers: 125000,
      tags: ["Live DJ", "Production"],
    },
    {
      id: "creative",
      name: "Creative",
      image: streamThumb3,
      viewers: 45000,
      tags: ["Digital Art", "Design"],
    },
    {
      id: "talk-shows",
      name: "Talk Shows",
      image: streamThumb2,
      viewers: 320000,
      tags: ["Podcast", "Interview"],
    },
    {
      id: "coding",
      name: "Coding",
      image: streamThumb1,
      viewers: 55000,
      tags: ["Programming", "Tech"],
    },
    {
      id: "fitness",
      name: "Fitness",
      image: streamThumb2,
      viewers: 38000,
      tags: ["Workout", "Health"],
    },
    {
      id: "lifestyle",
      name: "Lifestyle",
      image: streamThumb3,
      viewers: 62000,
      tags: ["Vlog", "Travel"],
    },
    {
      id: "entertainment",
      name: "Entertainment",
      image: streamThumb1,
      viewers: 180000,
      tags: ["Comedy", "Shows"],
    },
    {
      id: "education",
      name: "Education",
      image: streamThumb2,
      viewers: 42000,
      tags: ["Tutorials", "Learning"],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-12 px-4 md:px-6 lg:px-8">
        <div className="w-full max-w-[1920px] mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
              Categories
            </h1>
            <p className="text-muted-foreground">
              Explore streams by category
            </p>
          </div>

          {/* Search */}
          <div className="relative max-w-md mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search categories..."
              className="pl-10 bg-secondary border-border"
            />
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {categories.map((category, index) => (
              <div
                key={category.id}
                className="animate-fadeIn"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CategoryCard {...category} />
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Categories;
