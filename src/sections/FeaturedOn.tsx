import { SectionTitle } from '@/components/SectionTitle';
import { articles } from '@/data/articles';

export function FeaturedOn() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <SectionTitle title="From the Journal" subtitle="TIPS, GUIDES & INSPIRATION" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <article
              key={article.id}
              className="group animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <a href={article.href}>
                <div className="aspect-video overflow-hidden mb-4">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    {article.date} <span className="mx-2">•</span> {article.source}
                  </p>
                  <h3 className="font-serif text-lg leading-tight group-hover:text-gold transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {article.excerpt}
                  </p>
                  <span className="text-sm underline hover:no-underline inline-block mt-2">
                    Read more
                  </span>
                </div>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
