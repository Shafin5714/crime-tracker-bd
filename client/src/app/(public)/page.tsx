export default function PublicHomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Crime Tracker BD
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Empowering Bangladesh with real-time crime data visualization. 
          View incidents on an interactive map and report crimes in your area.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="/map"
            className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            View Crime Map
          </a>
          <a
            href="/report"
            className="inline-flex h-11 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Report a Crime
          </a>
        </div>
      </div>
    </div>
  );
}
