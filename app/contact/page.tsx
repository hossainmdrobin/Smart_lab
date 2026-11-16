import type { Metadata } from "next";
import SiteHeader from "@/components/public/layout/SiteHeader";
import SiteFooter from "@/components/public/layout/SiteFooter";
import Card from "@/components/ui/Card";
import ContactForm from "@/components/public/contact/ContactForm";
import { getHomepageData } from "@/src/lib/services/homepage";

export const metadata: Metadata = {
  title: "Contact | Laboratory of Algorithmic Life Sciences",
  description:
    "Get in touch with the Laboratory of Algorithmic Life Sciences in Dhaka, Bangladesh for research collaborations, academic inquiries, and prospective student opportunities.",
};

export default async function ContactPage() {
  const homepageData = await getHomepageData();
  const contactEmail = homepageData.settings.contactEmail || "contact@als.dhaka.ac.bd";

  return (
    <div className="min-h-full bg-[#F5F8FA] text-[#1E293B]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-[#10243A]"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main-content" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-12 border-b border-[#E2E8F0] pb-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-[#10243A]">
            Contact the Laboratory
          </h1>
          <p className="mt-3 max-w-3xl text-lg text-[#64748B]">
            We welcome inquiries from academic researchers, potential institutional partners, and prospective research students interested in computational life sciences.
          </p>
        </header>

        <div className="grid gap-12 lg:grid-cols-3">
          {/* Contact Information & Guidelines */}
          <div className="space-y-6 lg:col-span-1">
            <Card className="p-6 shadow-sm">
              <h2 className="text-xl font-bold tracking-tight text-[#10243A]">
                Laboratory Location
              </h2>
              <div className="mt-4 space-y-3 text-sm text-[#475569]">
                <p className="font-semibold text-[#10243A]">Laboratory of Algorithmic Life Sciences</p>
                <p>Dhaka, Bangladesh</p>
                <p className="text-xs italic text-[#64748B]">
                  Specific street address and institutional affiliation building details: <span className="rounded bg-[#F1F5F9] px-1.5 py-0.5 font-semibold text-[#64748B]">To be confirmed</span>
                </p>
              </div>
            </Card>

            <Card className="p-6 shadow-sm">
              <h2 className="text-xl font-bold tracking-tight text-[#10243A]">
                Direct Contact
              </h2>
              <div className="mt-4 space-y-3 text-sm text-[#475569]">
                <div>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-[#64748B]">Official Email</span>
                  <a href={`mailto:${contactEmail}`} className="mt-1 font-medium text-[#10243A] hover:underline">
                    {contactEmail}
                  </a>
                </div>
                <p className="text-xs text-[#64748B]">
                  For urgent administrative matters or official correspondence.
                </p>
              </div>
            </Card>

            <Card className="p-6 shadow-sm bg-[#F8FAFC] border-dashed border-[#CBD5E1]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                Data Privacy & Handling Notice
              </h3>
              <p className="mt-2 text-xs text-[#64748B] leading-relaxed">
                Inquiries submitted through this form are securely processed and reviewed solely by authorized laboratory personnel. We do not share contact details with third parties.
              </p>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <ContactForm />
          </div>
        </div>
      </main>
      <SiteFooter settings={homepageData.settings} />
    </div>
  );
}
