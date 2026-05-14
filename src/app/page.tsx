import ProductGrid from "@/components/shop/ProductGrid";
import ProductFilters from "@/components/shop/ProductFilters";
import dbConnect from "@/lib/db";
import PageContent from "@/models/PageContent";
import Link from "next/link";

const defaultSchema = {
  heroTitle: "Fragmen",
  heroSubtitle: "Discover the essence of elegance. A curated collection of masterful fragrances for the modern connoisseur.",
  heroImage: "https://images.unsplash.com/photo-1615486171448-4fd1cf208462?auto=format&fit=crop&q=80",
  section1Title: "Signature Scents",
  section2Title: "Curated Collections",
  footerDesc: "A SANCTUARY FOR PURE OILS. DEDICATED TO THE ANCIENT ART OF ATTAR MAKING AND THE PRESERVATION OF ORIENTAL OLFACTORY HERITAGE.",
  reviews: [
    { name: "Elena Vassilieva", address: "Dhaka, Bangladesh", review: "Fragmen has achieved the impossible: a perfect balance of heritage and modern edge. A masterpiece.", rating: 5 },
    { name: "Marcus Thorne", address: "Chittagong, Bangladesh", review: "The scent discovery here is exceptional. Every fragrance feels bespoke, telling a story that lingers.", rating: 5 },
    { name: "Sophia Khan", address: "Sylhet, Bangladesh", review: "The texture of these scents is rich, velvety, and undeniably premium. Quality is visible in every note.", rating: 4 }
  ]
};

async function getHomeContent() {
  try {
    const conn = await dbConnect();
    if (!conn) return defaultSchema;
    
    const doc = await PageContent.findOne({ pageId: "home" }).lean();
    return doc?.content || defaultSchema;
  } catch (error) {
    console.warn("Error fetching homepage content:", error);
    return defaultSchema;
  }
}

export default async function Home({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await searchParams;
  const content = await getHomeContent();

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative h-[70vh] sm:h-[80vh] min-h-[500px] flex items-center justify-center bg-black text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={content.heroImage} 
            alt="Fragmen Hero" 
            className="object-cover w-full h-full object-center opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
        </div>
        <div className="relative z-20 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
          {content.heroTitle && (
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-light tracking-[0.2em] sm:tracking-[0.4em] mb-6 uppercase drop-shadow-lg animate-in fade-in slide-in-from-bottom-8 duration-1000">
              {content.heroTitle}
            </h1>
          )}
          {content.heroSubtitle && (
            <p className="text-[10px] sm:text-xs md:text-base font-light tracking-[0.2em] uppercase opacity-90 mb-10 max-w-xl leading-relaxed whitespace-pre-line drop-shadow-md animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
              {content.heroSubtitle}
            </p>
          )}
          {content.heroTitle && (
            <a href="#collection" className="text-[10px] sm:text-xs uppercase tracking-[0.3em] border-b border-white pb-2 hover:opacity-70 transition-opacity shadow-sm animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-500">
              Explore Collection
            </a>
          )}
        </div>
      </section>

      {/* Collection Section */}
      <section id="collection" className="max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-24 py-16 sm:py-24">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12 sm:mb-16">
          <div>
            <h2 className="text-[10px] uppercase tracking-[0.5em] font-bold text-black/20 mb-3">Handcrafted Oils</h2>
            <h3 className="text-2xl sm:text-3xl font-light tracking-widest uppercase">{content.section1Title}</h3>
          </div>
          <div className="w-full lg:w-auto">
            <ProductFilters />
          </div>
        </div>
        
        <ProductGrid searchParams={params} />
      </section>

      {/* Curation Section */}
      <section className="bg-black text-white py-24 sm:py-32 overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 items-center">
            <div className="lg:col-span-5 space-y-8 sm:space-y-12">
              <div>
                <h2 className="text-[10px] uppercase tracking-[0.5em] font-bold text-white/20 mb-4">Limited Edition</h2>
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-widest uppercase leading-tight">
                  {content.section2Title}
                </h3>
              </div>
              <p className="text-xs sm:text-sm md:text-base font-light leading-relaxed opacity-50 tracking-wide max-w-md">
                Each bottle in our reserve is a testament to the patient art of aging. Discover rare oudh and mystical blends that transcend time.
              </p>
              <div className="pt-4">
                <Link href="/#collection" className="text-[10px] font-bold uppercase tracking-[0.4em] border-b border-white/20 pb-2 hover:border-white transition-colors">
                  View All Curations
                </Link>
              </div>
            </div>
            
            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                <div className="aspect-[16/10] md:aspect-[10/14] bg-white/5 relative group overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1616948648211-09dc3e6eb646?auto=format&fit=crop&q=80" 
                    className="object-cover w-full h-full opacity-40 group-hover:scale-110 group-hover:opacity-60 transition-all duration-700" 
                  />
                  <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent">
                    <span className="text-[10px] uppercase tracking-widest opacity-60 mb-2">The Oudh Series</span>
                    <h4 className="text-base sm:text-lg font-light tracking-widest uppercase">Vintage Dehn Al Oudh</h4>
                  </div>
                </div>
                <div className="space-y-6 sm:space-y-8">
                  <div className="aspect-[16/10] bg-white/5 relative group overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1547881338-64929745b3d6?auto=format&fit=crop&q=80" 
                      className="object-cover w-full h-full opacity-40 group-hover:scale-110 group-hover:opacity-60 transition-all duration-700" 
                    />
                    <div className="absolute inset-0 p-6 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent">
                      <h4 className="text-xs sm:text-sm font-light tracking-widest uppercase">Musk Anthology</h4>
                    </div>
                  </div>
                  <div className="aspect-[16/10] bg-white/5 relative group overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1615486171448-4fd1cf208462?auto=format&fit=crop&q=80" 
                      className="object-cover w-full h-full opacity-40 group-hover:scale-110 group-hover:opacity-60 transition-all duration-700" 
                    />
                    <div className="absolute inset-0 p-6 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent">
                      <h4 className="text-xs sm:text-sm font-light tracking-widest uppercase">Floral Distillations</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 sm:py-32 bg-white text-black overflow-hidden border-b border-black/5">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-16 sm:mb-24">
            <h2 className="text-[10px] uppercase tracking-[0.6em] font-bold text-black/20 mb-4">Voices of Fragmen</h2>
            <h3 className="text-2xl sm:text-3xl font-light tracking-widest uppercase">The Connoisseur's Experience</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 sm:gap-16">
            {(content.reviews || []).map((review: any, i: number) => (
              <div key={i} className="flex flex-col items-center text-center space-y-6 sm:space-y-8">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-black flex items-center justify-center rounded-full text-white text-lg sm:text-xl font-light tracking-widest">
                  {review.name.charAt(0)}
                </div>
                <div className="space-y-4">
                  <div className="flex justify-center gap-1">
                    {[...Array(review.rating || 5)].map((_, i) => (
                      <svg key={i} className="w-3 h-3 fill-black" viewBox="0 0 24 24">
                        <path d="M12 .587l3.668 7.431 8.214 1.192-5.941 5.787 1.402 8.178-7.343-3.864-7.343 3.864 1.402-8.178-5.941-5.787 8.214-1.192z" />
                      </svg>
                    ))}
                  </div>
                  <div className="text-3xl sm:text-4xl font-serif text-black leading-none h-4">"</div>
                  <p className="text-[13px] sm:text-sm italic font-light leading-relaxed opacity-70 px-4">
                    {review.review}
                  </p>
                  <div className="pt-4">
                    <h4 className="text-[11px] sm:text-sm font-bold uppercase tracking-widest">{review.name}</h4>
                    <p className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] opacity-40 mt-1">{review.address}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white text-black py-16 sm:py-24 border-t border-black/5">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 sm:gap-16 lg:gap-24 mb-16 sm:mb-24">
            <div className="lg:col-span-4">
              <h2 className="text-2xl font-light tracking-[0.5em] uppercase mb-8">Fragmen</h2>
              <p className="text-[10px] font-light leading-relaxed opacity-40 uppercase tracking-[0.2em] max-w-sm mb-12 whitespace-pre-line">
                {content.footerDesc}
              </p>
              <div className="flex gap-8">
                {/* Instagram */}
                <a href="#" className="opacity-40 hover:opacity-100 transition-opacity">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                {/* Facebook */}
                <a href="https://www.facebook.com/profile.php?id=100090345377560" target="_blank" rel="noopener noreferrer" className="opacity-40 hover:opacity-100 transition-opacity">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                {/* WhatsApp */}
                <a href="#" className="opacity-40 hover:opacity-100 transition-opacity">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                </a>
                {/* TikTok */}
                <a href="#" className="opacity-40 hover:opacity-100 transition-opacity">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
                  </svg>
                </a>
              </div>
            </div>
            
            <div className="lg:col-span-2">
              <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold mb-8 opacity-20">Curations</h4>
              <ul className="space-y-4 text-[10px] uppercase tracking-widest font-medium opacity-60">
                <li><Link href="/#collection" className="hover:opacity-50 transition-opacity">The Oud Reserve</Link></li>
                <li><Link href="/#collection" className="hover:opacity-50 transition-opacity">Musk Anthology</Link></li>
                <li><Link href="/#collection" className="hover:opacity-50 transition-opacity">Botanical Blends</Link></li>
                <li><Link href="/#collection" className="hover:opacity-50 transition-opacity">Collector's Dehn Al Oud</Link></li>
              </ul>
            </div>
            
            <div className="lg:col-span-2">
              <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold mb-8 opacity-20">Maison</h4>
              <ul className="space-y-4 text-[10px] uppercase tracking-widest font-medium opacity-60">
                <li><Link href="/about" className="hover:opacity-50 transition-opacity">Our Legacy</Link></li>
                <li><Link href="/process" className="hover:opacity-50 transition-opacity">Distillation Process</Link></li>
                <li><Link href="/ethical" className="hover:opacity-50 transition-opacity">Ethical Sourcing</Link></li>
                <li><Link href="/bespoke" className="hover:opacity-50 transition-opacity">Bespoke Blending</Link></li>
              </ul>
            </div>
            
            <div className="lg:col-span-4">
              <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold mb-8 opacity-20">Newsletter</h4>
              <p className="text-[10px] uppercase tracking-widest leading-relaxed opacity-40 mb-8">
                Join our exclusive circle for fragrance releases and heritage stories.
              </p>
              <form className="flex border-b border-black/10 pb-2">
                <input type="email" placeholder="YOUR EMAIL" className="bg-transparent text-[10px] tracking-widest uppercase outline-none flex-1 placeholder:opacity-20" />
                <button className="text-[10px] font-bold uppercase tracking-widest">Subscribe</button>
              </form>
            </div>
          </div>
          
          <div className="pt-12 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[9px] uppercase tracking-widest opacity-30">© 2024 Fragmen Artisan Perfumery. All Rights Reserved.</p>
            <div className="flex gap-8 text-[9px] uppercase tracking-widest opacity-30">
              <Link href="/privacy" className="hover:opacity-100">Privacy</Link>
              <Link href="/terms" className="hover:opacity-100">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
