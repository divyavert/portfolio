export function Hero() {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left - Profile Card */}
          <div className="bg-card rounded-3xl p-8 shadow-2xl">
            <div className="w-48 h-48 mx-auto mb-6 rounded-2xl bg-primary/20 flex items-center justify-center text-6xl">
              🎨
            </div>
            <h2 className="text-3xl font-heading font-bold text-center mb-2">
              Divya Panchori
            </h2>
            <p className="text-center text-muted mb-6">
              🔥
            </p>
            <p className="text-center text-muted-foreground mb-6">
              A Software Engineer who has developed countless innovative solutions.
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="https://github.com/divyavert"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors"
              >
                GH
              </a>
              <a
                href="https://linkedin.com/in/divya-panchori"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors"
              >
                LI
              </a>
            </div>
          </div>

          {/* Right - Title & Stats */}
          <div>
            <h1 className="text-6xl md:text-8xl font-heading font-bold mb-6">
              <span className="text-foreground">SOFTWARE</span>
              <br />
              <span className="text-primary">ENGINEER</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-lg">
              Passionate about creating intuitive and engaging user experiences.
              Specialize in transforming ideas into beautifully crafted products.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-card rounded-2xl p-6 text-center">
                <div className="text-4xl font-heading font-bold text-primary mb-2">
                  +2
                </div>
                <div className="text-sm text-muted-foreground">
                  YEARS OF<br />EXPERIENCE
                </div>
              </div>
              <div className="bg-card rounded-2xl p-6 text-center">
                <div className="text-4xl font-heading font-bold text-primary mb-2">
                  +10
                </div>
                <div className="text-sm text-muted-foreground">
                  PROJECTS<br />COMPLETED
                </div>
              </div>
              <div className="bg-card rounded-2xl p-6 text-center">
                <div className="text-4xl font-heading font-bold text-primary mb-2">
                  +37
                </div>
                <div className="text-sm text-muted-foreground">
                  USERS<br />IMPACTED
                </div>
              </div>
            </div>

            <a
              href="/resume.pdf"
              download
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-opacity"
            >
              📥 Download Resume
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
