import type { Metadata } from "next";
import { HOME_TITLE, SITE_META_DESCRIPTION, jsonLd, pageMetadata } from "@/lib/seo";
import { faqs } from "@/lib/faq";
import { JoinUs } from "@/components/home/join-us";
import About from "@/components/home/about";
import { Activities } from "@/components/home/activities";
import { FAQ } from "@/components/home/faq";
import Hero from "@/components/home/hero";
import MeetTheTeam from "@/components/home/meet-the-team";
import WhyUs from "@/components/home/why-us";

export const metadata: Metadata = pageMetadata({
  title: HOME_TITLE,
  description: SITE_META_DESCRIPTION,
  path: "/",
  keywords: ["Programming", "Workshops", "Projects", "Hackathons"],
});

export default async function Home() {
  return (
    <main className="w-full flex-1">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map(({ question, answer }) => ({
              "@type": "Question",
              name: question,
              acceptedAnswer: { "@type": "Answer", text: answer },
            })),
          }),
        }}
      />
      <Hero />
      <About />
      <Activities />

      <WhyUs />
      <MeetTheTeam />
      <FAQ />
      <JoinUs />
    </main>
  );
}
