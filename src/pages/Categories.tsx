import Layout from "@/components/Layout";
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
      id: "art",
      name: "Art & Creative",
      image: streamThumb3,
      viewers: 45000,
      tags: ["Digital", "Traditional"],
    },
    {
      id: "esports",
      name: "Esports",
      image: streamThumb1,
      viewers: 180000,
      tags: ["Tournament", "Pro"],
    },
    {
      id: "just-chatting",
      name: "Just Chatting",
      image: streamThumb2,
      viewers: 320000,
      tags: ["Talk Shows", "IRL"],
    },
    {
      id: "sports",
      name: "Sports",
      image: streamThumb1,
      viewers: 95000,
      tags: ["Football", "Basketball"],
    },
    {
      id: "science",
      name: "Science & Tech",
      image: streamThumb3,
      viewers: 35000,
      tags: ["Coding", "Hardware"],
    },
    {
      id: "food",
      name: "Food & Drink",
      image: streamThumb2,
      viewers: 28000,
      tags: ["Cooking", "Reviews"],
    },
  ];

  return (
    <Layout>
      <div className="min-h-screen p-4 md:p-6 lg:p-8">
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
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
    </Layout>
  );
};

export default Categories;
