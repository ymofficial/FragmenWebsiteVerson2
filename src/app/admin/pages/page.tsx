import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function PagesAdmin() {
  const pages = [
    { id: "home", name: "Homepage", description: "Edit hero section, titles, and main images." },
    { id: "support", name: "Support Page", description: "Edit contact info, FAQs, and support text." },
    { id: "about", name: "About Us", description: "Edit the about page content and story." },
    { id: "contact", name: "Contact", description: "Edit contact information and text." },
  ];

  return (
    <div>
      <div className="mb-10">
        <h2 className="text-2xl font-light tracking-[0.2em] uppercase">Site Pages</h2>
        <p className="text-sm text-black/40 mt-1">Select a page to edit its dynamic content.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pages.map((page) => (
          <Link key={page.id} href={`/admin/pages/${page.id}/edit`}>
            <div className="bg-white border border-black/5 p-6 hover:border-black/20 hover:shadow-sm transition-all cursor-pointer group flex flex-col h-full">
              <h3 className="text-lg font-bold tracking-widest uppercase mb-2">{page.name}</h3>
              <p className="text-xs text-black/50 mb-6 flex-1">{page.description}</p>
              <div className="flex items-center text-[10px] uppercase tracking-widest font-bold text-black/40 group-hover:text-black transition-colors">
                Edit Content <ChevronRight size={14} className="ml-1" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
