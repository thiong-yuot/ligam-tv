import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon, Radio, Package, Users, BookOpen, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useStreams } from "@/hooks/useStreams";
import { useProducts } from "@/hooks/useProducts";
import { useFreelancers } from "@/hooks/useFreelancers";
import { useFeaturedCourses } from "@/hooks/useCourses";

const Search = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);

  const { data: streams = [], isLoading: streamsLoading } = useStreams(undefined, true);
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: freelancers = [], isLoading: freelancersLoading } = useFreelancers();
  const { data: courses = [], isLoading: coursesLoading } = useFeaturedCourses();

  const isLoading = streamsLoading || productsLoading || freelancersLoading || coursesLoading;
  const q = query.toLowerCase();

  const filteredStreams = streams.filter(s => s.title.toLowerCase().includes(q));
  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(q));
  const filteredFreelancers = freelancers.filter(f => f.name.toLowerCase().includes(q) || f.title.toLowerCase().includes(q));
  const filteredCourses = courses.filter(c => c.title.toLowerCase().includes(q));

  const hasResults = filteredStreams.length + filteredProducts.length + filteredFreelancers.length + filteredCourses.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16 pb-12 px-4 md:px-6 lg:px-8">
        <div className="w-full max-w-[1920px] mx-auto">
          <div className="relative max-w-md mb-6">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              autoFocus
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 h-9 text-sm bg-card border-border"
            />
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : !q ? (
            <p className="text-sm text-muted-foreground">Type to search across streams, shop, freelancers and courses.</p>
          ) : !hasResults ? (
            <p className="text-sm text-muted-foreground">No results for "{query}"</p>
          ) : (
            <div className="space-y-6">
              {filteredStreams.length > 0 && (
                <div>
                  <h2 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-1.5"><Radio className="w-3.5 h-3.5" /> Streams</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {filteredStreams.slice(0, 4).map(s => (
                      <Link key={s.id} to={`/stream/${s.id}`} className="bg-card border border-border rounded-lg p-3 hover:border-muted-foreground/30 transition-colors">
                        <p className="text-xs font-medium text-foreground truncate">{s.title}</p>
                        <p className="text-[10px] text-muted-foreground">{s.is_live ? "Live" : "Offline"}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {filteredProducts.length > 0 && (
                <div>
                  <h2 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-1.5"><Package className="w-3.5 h-3.5" /> Shop</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {filteredProducts.slice(0, 4).map(p => (
                      <Link key={p.id} to="/shop" className="bg-card border border-border rounded-lg p-3 hover:border-muted-foreground/30 transition-colors">
                        <div className="aspect-[4/3] rounded overflow-hidden mb-2 bg-muted">
                          {p.image_url ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Package className="w-5 h-5 text-muted-foreground" /></div>}
                        </div>
                        <p className="text-xs font-medium text-foreground truncate">{p.name}</p>
                        <p className="text-xs text-primary font-bold mt-0.5">${(p.sale_price ?? p.price).toFixed(2)}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {filteredFreelancers.length > 0 && (
                <div>
                  <h2 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Freelancers</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {filteredFreelancers.slice(0, 4).map(f => (
                      <Link key={f.id} to={`/freelance/${(f as any).profile_username || f.id}`} className="bg-card border border-border rounded-lg p-3 hover:border-muted-foreground/30 transition-colors">
                        <div className="flex items-center gap-2 mb-1">
                          <Avatar className="w-6 h-6"><AvatarFallback className="text-[10px]">{f.name.charAt(0)}</AvatarFallback></Avatar>
                          <p className="text-xs font-medium text-foreground truncate">{f.name}</p>
                        </div>
                        <p className="text-[10px] text-muted-foreground truncate">{f.title}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {filteredCourses.length > 0 && (
                <div>
                  <h2 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" /> Courses</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {filteredCourses.slice(0, 4).map(c => (
                      <Link key={c.id} to={`/courses/${(c as any).slug || c.id}`} className="bg-card border border-border rounded-lg p-3 hover:border-muted-foreground/30 transition-colors">
                        <p className="text-xs font-medium text-foreground truncate">{c.title}</p>
                        <p className="text-xs text-primary font-bold mt-0.5">{c.price === 0 ? "Free" : `$${c.price.toFixed(2)}`}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Search;
