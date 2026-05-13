import dbConnect from "@/lib/db";
import PageContent from "@/models/PageContent";
import SupportForm from "@/components/support/SupportForm";

const defaultSupportContent = {
  title: "Customer Support",
  subtitle: "We are here to assist you with your olfactory journey. Feel free to reach out to our artisans.",
  email: "care@fragmen.com",
  phone: "+880 1XXX-XXXXXX",
  whatsapp: "+880 1XXX-XXXXXX",
  address: "House 12, Road 4, Dhanmondi, Dhaka, Bangladesh",
  faqs: [
    { q: "How long does the scent last?", a: "Our pure attars typically last 8-12 hours on skin and up to 48 hours on clothing." },
    { q: "Do you ship internationally?", a: "Yes, we ship our artisanal oils globally via express courier services." },
    { q: "Are these oils pure?", a: "Every drop is guaranteed pure, undiluted, and free from any synthetic extenders." }
  ]
};

async function getSupportContent() {
  try {
    await dbConnect();
    const doc = await PageContent.findOne({ pageId: "support" }).lean();
    return doc?.content || defaultSupportContent;
  } catch (error) {
    console.warn("DB Connection failed during build for support page, using defaults");
    return defaultSupportContent;
  }
}

export default async function SupportPage() {
  const content = await getSupportContent();

  return (
    <main className="min-h-screen bg-white text-black py-24">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-24">
          <h1 className="text-4xl md:text-6xl font-light tracking-[0.3em] uppercase mb-6">{content.title}</h1>
          <p className="text-sm md:text-base font-light tracking-[0.2em] uppercase opacity-40 max-w-2xl mx-auto leading-relaxed">
            {content.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-start">
          {/* Contact Methods */}
          <div className="space-y-16">
            <h2 className="text-xs uppercase tracking-[0.5em] font-bold border-b border-black/5 pb-4">Contact Channels</h2>
            
            <div className="grid grid-cols-1 gap-12">
              {[
                { label: "Email Address", val: content.email, type: "Email" },
                { label: "Phone Number", val: content.phone, type: "Phone" },
                { label: "WhatsApp", val: content.whatsapp, type: "WhatsApp" },
                { label: "Office Address", val: content.address, type: "Address" }
              ].map((item, i) => (
                <div key={i} className="group">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-black/30 mb-2">{item.label}</p>
                  <p className="text-lg font-light tracking-wide group-hover:translate-x-1 transition-transform cursor-default">
                    {item.val}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQs */}
          <div className="space-y-16">
            <h2 className="text-xs uppercase tracking-[0.5em] font-bold border-b border-black/5 pb-4">Frequently Asked</h2>
            
            <div className="space-y-10">
              {content.faqs.map((faq: any, i: number) => (
                <div key={i} className="space-y-3">
                  <h4 className="text-[13px] font-bold uppercase tracking-wider">{faq.q}</h4>
                  <p className="text-sm font-light leading-relaxed opacity-60">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Support Form Section */}
        <div className="mt-40 pt-24 border-t border-black/5 max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-xl font-light tracking-[0.3em] uppercase mb-4">Send us a message</h3>
            <p className="text-[10px] uppercase tracking-[0.2em] opacity-40">Our concierge team will respond within 24 hours.</p>
          </div>
          
          <SupportForm />
        </div>
      </div>
    </main>
  );
}
