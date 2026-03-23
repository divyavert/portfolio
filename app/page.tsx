import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";

export default function HomePage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        <Hero />
        
        {/* Placeholder sections */}
        <section id="terminal" className="min-h-screen flex items-center justify-center bg-card/50">
          <div className="text-center">
            <h2 className="text-4xl font-heading font-bold mb-4">Terminal Section</h2>
            <p className="text-muted">Coming soon...</p>
          </div>
        </section>

        <section id="projects" className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-4xl font-heading font-bold mb-4">Projects</h2>
            <p className="text-muted">Coming soon...</p>
          </div>
        </section>

        <section id="skills" className="min-h-screen flex items-center justify-center bg-card/50">
          <div className="text-center">
            <h2 className="text-4xl font-heading font-bold mb-4">Skills</h2>
            <p className="text-muted">Coming soon...</p>
          </div>
        </section>

        <section id="experience" className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-4xl font-heading font-bold mb-4">Experience</h2>
            <p className="text-muted">Coming soon...</p>
          </div>
        </section>

        <section id="contact" className="min-h-screen flex items-center justify-center bg-card/50">
          <div className="text-center">
            <h2 className="text-4xl font-heading font-bold mb-4">Contact</h2>
            <p className="text-muted">Coming soon...</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
