import { useState, useEffect } from 'react';
import { SectionTitle } from '@/components/SectionTitle';
import { useSupabase } from '@/hooks/useSupabase';
import type { Category } from '@/types';

export function ShopByCategory() {
  const { getCategories } = useSupabase();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      const data = await getCategories();
      setCategories(data);
      setLoading(false);
    };
    loadCategories();
  }, []);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background border-t border-foreground/5">
      <div className="max-w-7xl mx-auto">
        <SectionTitle title="Shop by Category" />

        {loading ? (
          <div className="text-center py-10 italic">Loading categories...</div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <div
                key={category.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <a href={`#shop/${category.id}`} className="group block relative overflow-hidden">
                  <div className="aspect-square overflow-hidden bg-gray-100 flex items-center justify-center relative">
                    {(category.image_url || category.icon) ? (
                      <img
                        src={category.image_url || category.icon}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center p-4">
                        <span className="text-white/40 uppercase tracking-widest text-xs">{category.name}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-white text-lg uppercase tracking-[3px] font-medium">
                      {category.name}
                    </h3>
                  </div>
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
