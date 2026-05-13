import ProductGrid from "@/components/shop/ProductGrid";
import ProductFilters from "@/components/shop/ProductFilters";
import dbConnect from "@/lib/db";
import PageContent from "@/models/PageContent";

async function getHomeContent() {
  await dbConnect();
  const doc = await PageContent.findOne({ pageId: "home" }).lean();
  return doc?.content || {
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
}

export default async function Home({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await searchParams;
  const content = await getHomeContent();

  return (
    <main className="flex-1">
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center bg-black text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={content.heroImage} 
            alt="Fragmen Hero" 
            className="object-cover w-full h-full"
          />
        </div>
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
          {content.heroTitle && (
            <h1 className="text-5xl md:text-7xl font-light tracking-[0.4em] mb-6 uppercase drop-shadow-lg">{content.heroTitle}</h1>
          )}
          {content.heroSubtitle && (
            <p className="text-sm md:text-base font-light tracking-[0.2em] uppercase opacity-90 mb-10 max-w-xl leading-relaxed whitespace-pre-line drop-shadow-md">
              {content.heroSubtitle}
            </p>
          )}
          {content.heroTitle && (
            <a href="#collection" className="text-xs uppercase tracking-[0.3em] border-b border-white pb-2 hover:opacity-70 transition-opacity shadow-sm">
              Explore Collection
            </a>
          )}
        </div>
      </section>

      <section id="collection" className="max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-24 py-24">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-light tracking-[0.3em] uppercase mb-4">{content.section1Title}</h2>
          <div className="w-12 h-[1px] bg-black dark:bg-white mx-auto opacity-20"></div>
        </div>
        
        <ProductFilters />
        <ProductGrid searchParams={params} />
      </section>
      
      {/* --- PREMIUM COLLECTIONS SECTION --- */}
      <section id="collections-showcase" className="bg-[#fcfcfc] py-32 border-t border-black/5">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-24">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-light tracking-[0.3em] uppercase mb-4">{content.section2Title}</h2>
            <div className="w-12 h-[1px] bg-black dark:bg-white mx-auto opacity-20"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-10">
            {/* Main Feature */}
            <div className="md:col-span-7 group relative aspect-[16/10] overflow-hidden bg-black">
              <img 
                src="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80" 
                alt="Noir Series" 
                className="object-cover w-full h-full opacity-70 group-hover:scale-105 transition-transform duration-[3s] ease-out" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end text-white">
                <div>
                  <h3 className="text-2xl font-light tracking-[0.3em] uppercase mb-2">The Noir Series</h3>
                  <p className="text-[9px] uppercase tracking-[0.2em] opacity-60">Shadows & Silhouettes</p>
                </div>
                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500">
                  <span className="text-xs">→</span>
                </div>
              </div>
            </div>

            {/* Side Items */}
            <div className="md:col-span-5 grid grid-cols-1 gap-6 lg:gap-10">
              {[
                { name: "Fresh & Aquatic", label: "Azure Waters", img: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80" },
                { name: "Floral Essence", label: "Midnight Bloom", img: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&q=80" }
              ].map((col, i) => (
                <div key={i} className="group relative aspect-[16/7] overflow-hidden bg-black">
                  <img src={col.img} alt={col.name} className="object-cover w-full h-full opacity-60 group-hover:scale-110 transition-transform duration-[3s] ease-out" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-700" />
                  <div className="absolute inset-0 flex flex-col justify-center px-10 text-white">
                    <h3 className="text-sm font-bold tracking-[0.4em] uppercase mb-2">{col.name}</h3>
                    <p className="text-[8px] uppercase tracking-[0.2em] opacity-0 group-hover:opacity-60 transition-opacity duration-700">{col.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- EDITORIAL REVIEWS SECTION --- */}
      <section className="bg-white pt-32 pb-48 overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-24">
          <div className="text-center mb-24">
            <h2 className="text-2xl md:text-3xl font-light tracking-[0.3em] uppercase mb-4">What Our Customers Say</h2>
            <div className="w-16 h-[1px] bg-black/10 mx-auto"></div>
          </div>
          
          <div className="relative overflow-hidden group">
            <div className="flex gap-16 lg:gap-32 animate-scroll w-max pr-16 lg:pr-32">
              {[...Array(2)].map((_, idx) => (
                <div key={idx} className="flex gap-16 lg:gap-32 shrink-0">
                  {(content.reviews && content.reviews.length > 0 ? content.reviews : []).map((rev: any, i: number) => (
                    <div key={i} className="flex flex-col w-[350px] md:w-[450px]">
                      <div className="mb-8 relative">
                        <div className="flex mb-4">
                          {[...Array(5)].map((_, starIdx) => (
                            <svg key={starIdx} className={`w-3 h-3 ${starIdx < (rev.rating || 5) ? 'text-black' : 'text-black/10'}`} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        
                        <div className="mb-4">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-black">
                            <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.409-2.748-1.12zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.409-2.748-1.12z" />
                          </svg>
                        </div>

                        <p className="text-lg font-light leading-relaxed text-black/80 tracking-wide relative z-10 italic">
                          {rev.review}
                        </p>
                      </div>
                      <div className="flex items-center gap-5 mt-auto">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-black flex items-center justify-center text-white text-lg font-light tracking-widest shrink-0">
                          {(rev.name || "A")[0].toUpperCase()}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold uppercase tracking-[0.2em] mb-1">{rev.name}</h4>
                          <p className="text-[11px] uppercase tracking-[0.1em] opacity-50">{rev.address}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- LUXURY FOOTER --- */}
      <footer className="bg-black text-white pt-32 pb-16">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-24">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-24 pb-24">
            <div className="md:col-span-5">
              <h2 className="text-3xl font-light tracking-[0.5em] uppercase mb-10">{content.heroTitle}</h2>
              <p className="text-xs font-light leading-relaxed opacity-40 uppercase tracking-[0.2em] max-w-sm mb-12 whitespace-pre-line">
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
            
            <div className="md:col-span-2">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.4em] mb-10 text-white/90">Curations</h4>
              <ul className="space-y-5 text-[10px] uppercase tracking-[0.2em] opacity-40">
                {['THE OUD RESERVE', 'MUSK ANTHOLOGY', 'BOTANICAL BLENDS', "COLLECTOR'S DEHN AL OUD"].map(item => (
                  <li key={item} className="hover:opacity-100 hover:translate-x-1 transition-all cursor-pointer">{item}</li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-2">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.4em] mb-10 text-white/90">Maison</h4>
              <ul className="space-y-5 text-[10px] uppercase tracking-[0.2em] opacity-40">
                {['OUR LEGACY', 'DISTILLATION PROCESS', 'ETHICAL SOURCING', 'BESPOKE BLENDING'].map(item => (
                  <li key={item} className="hover:opacity-100 hover:translate-x-1 transition-all cursor-pointer">{item}</li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-3">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.4em] mb-10 text-white/90">Newsletter</h4>
              <p className="text-[10px] uppercase tracking-[0.2em] opacity-40 mb-8 leading-relaxed">
                JOIN OUR EXCLUSIVE CIRCLE FOR FRAGRANCE RELEASES AND HERITAGE STORIES.
              </p>
              <div className="relative border-b border-white/20 pb-4 group">
                <input 
                  type="email" 
                  placeholder="YOUR EMAIL" 
                  className="bg-transparent text-[10px] uppercase tracking-widest outline-none w-full placeholder:opacity-20" 
                />
                <button className="absolute right-0 bottom-4 text-[10px] font-bold uppercase tracking-widest hover:opacity-50 transition-opacity">
                  Subscribe
                </button>
                <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-white group-focus-within:w-full transition-all duration-700"></div>
              </div>
            </div>
          </div>

          <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex gap-12 text-[8px] uppercase tracking-[0.3em] opacity-30">
              <p>© {new Date().getFullYear()} {content.heroTitle} Maison de Parfum</p>
              <span className="hover:opacity-100 cursor-pointer transition-opacity">Global Distribution</span>
            </div>
            <div className="flex gap-10 text-[8px] uppercase tracking-[0.3em] opacity-30">
              <span className="hover:opacity-100 cursor-pointer transition-opacity">Privacy</span>
              <span className="hover:opacity-100 cursor-pointer transition-opacity">Terms</span>
              <span className="hover:opacity-100 cursor-pointer transition-opacity">Sitemap</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
