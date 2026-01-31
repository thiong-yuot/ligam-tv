import { useProducts } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { ArrowRight, ShoppingBag } from "lucide-react";

const DEMO_PRODUCTS = [
  {
    id: "demo-1",
    name: "Stream Overlay Pack",
    price: 29.99,
    image_url: "/placeholder.svg",
    category: "Overlays",
  },
  {
    id: "demo-2",
    name: "Custom Emote Set",
    price: 19.99,
    image_url: "/placeholder.svg",
    category: "Emotes",
  },
  {
    id: "demo-3",
    name: "Alert Package",
    price: 24.99,
    image_url: "/placeholder.svg",
    category: "Alerts",
  },
  {
    id: "demo-4",
    name: "Sound Effects Pack",
    price: 14.99,
    image_url: "/placeholder.svg",
    category: "Audio",
  },
];

const ProductCard = ({ id, name, price, image_url, category }) => {
  return (
    <Link to={`/shop`} className="group block">
      <div className="relative rounded-xl overflow-hidden bg-card border border-border hover:border-muted-foreground/30 transition-all duration-300">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={image_url || "/placeholder.svg"}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Button size="sm" className="gap-2">
              <ShoppingBag className="w-4 h-4" />
              View
            </Button>
          </div>
          <div className="absolute top-2 left-2">
            <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs font-medium rounded">
              {category}
            </span>
          </div>
        </div>
        <div className="p-3">
          <h3 className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
            {name}
          </h3>
          <p className="text-base font-bold text-primary mt-1">${price}</p>
        </div>
      </div>
    </Link>
  );
};

const MarketplacePreview = () => {
  const { data: products, isLoading } = useProducts();

  const displayProducts = products?.length > 0 
    ? products.slice(0, 4).map(product => ({
        id: product.id,
        name: product.name,
        price: product.sale_price || product.price,
        image_url: product.image_url,
        category: product.category || "Digital",
      }))
    : DEMO_PRODUCTS;

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Shop</h2>
            <p className="text-muted-foreground mt-1">
              Digital assets for your streaming setup
            </p>
          </div>
          <Button variant="ghost" asChild className="gap-2">
            <Link to="/shop">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="aspect-[4/3] w-full rounded-xl" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
            {displayProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MarketplacePreview;
