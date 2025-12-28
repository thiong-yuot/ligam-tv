import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ShoppingCart, Star, Filter, Heart } from "lucide-react";

const Shop = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [cart, setCart] = useState<number[]>([]);

  const categories = [
    "All",
    "Stream Overlays",
    "Alerts & Sounds",
    "Emotes",
    "Panels",
    "Merch",
    "Equipment",
  ];

  const products = [
    {
      id: 1,
      name: "Neon Gaming Overlay Pack",
      category: "Stream Overlays",
      price: 24.99,
      originalPrice: 39.99,
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop",
      rating: 4.9,
      reviews: 234,
      featured: true,
    },
    {
      id: 2,
      name: "Animated Alert Bundle",
      category: "Alerts & Sounds",
      price: 14.99,
      originalPrice: null,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
      rating: 4.8,
      reviews: 156,
      featured: false,
    },
    {
      id: 3,
      name: "Cute Emote Pack (20 Emotes)",
      category: "Emotes",
      price: 29.99,
      originalPrice: null,
      image: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=400&h=300&fit=crop",
      rating: 5.0,
      reviews: 89,
      featured: true,
    },
    {
      id: 4,
      name: "Minimal Panel Set",
      category: "Panels",
      price: 9.99,
      originalPrice: 14.99,
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop",
      rating: 4.7,
      reviews: 312,
      featured: false,
    },
    {
      id: 5,
      name: "Ligam Hoodie - Black",
      category: "Merch",
      price: 49.99,
      originalPrice: null,
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=300&fit=crop",
      rating: 4.9,
      reviews: 67,
      featured: false,
    },
    {
      id: 6,
      name: "RGB Ring Light Pro",
      category: "Equipment",
      price: 79.99,
      originalPrice: 99.99,
      image: "https://images.unsplash.com/photo-1590650516494-0c8e4a4dd67e?w=400&h=300&fit=crop",
      rating: 4.8,
      reviews: 445,
      featured: true,
    },
    {
      id: 7,
      name: "Cyberpunk Overlay Bundle",
      category: "Stream Overlays",
      price: 34.99,
      originalPrice: null,
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop",
      rating: 4.9,
      reviews: 178,
      featured: false,
    },
    {
      id: 8,
      name: "Sound Effect Pack",
      category: "Alerts & Sounds",
      price: 19.99,
      originalPrice: 29.99,
      image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=300&fit=crop",
      rating: 4.6,
      reviews: 92,
      featured: false,
    },
  ];

  const filteredProducts = products.filter((p) => {
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (id: number) => {
    setCart([...cart, id]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-12 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <ShoppingCart className="w-4 h-4" />
            Official Shop
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-foreground mb-6">
            Level Up Your <span className="text-primary">Stream</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Premium overlays, alerts, emotes, and gear to make your stream stand out.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-lg bg-card border-border"
            />
          </div>

          {/* Cart indicator */}
          {cart.length > 0 && (
            <div className="mt-6">
              <Button variant="outline" className="gap-2">
                <ShoppingCart className="w-4 h-4" />
                Cart ({cart.length})
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="py-6 px-4 border-y border-border bg-card/30">
        <div className="container mx-auto">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <Filter className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category)}
                className="flex-shrink-0"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-display font-bold text-foreground">
              {activeCategory === "All" ? "All Products" : activeCategory}
            </h2>
            <span className="text-muted-foreground">
              {filteredProducts.length} products
            </span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="rounded-2xl bg-card border border-border overflow-hidden hover:border-primary/50 transition-all duration-300 group"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.featured && (
                    <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                      Featured
                    </Badge>
                  )}
                  {product.originalPrice && (
                    <Badge className="absolute top-3 right-3 bg-destructive text-destructive-foreground">
                      Sale
                    </Badge>
                  )}
                  <button className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Heart className="w-5 h-5 text-foreground" />
                  </button>
                </div>

                <div className="p-5">
                  <p className="text-sm text-muted-foreground mb-1">
                    {product.category}
                  </p>
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1 text-primary">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-medium">{product.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({product.reviews} reviews)
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-primary">
                        ${product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => addToCart(product.id)}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No products found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your search or category filter
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-card/30 border-t border-border">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6">
            Sell Your Creations
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Are you a designer? List your overlays, emotes, and more on the Ligam marketplace.
          </p>
          <Button variant="default" size="xl" className="glow">
            Become a Seller
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Shop;
