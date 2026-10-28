import SiteNav from "@/components/SiteNav";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <>
      <SiteNav />
      <main className="flex-1">
        <Hero />
      </main>
    </>
  );
}
