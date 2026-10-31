import { ArrowDown, ArrowRight, Check, CircleCheck, FolderKanban, UsersRound } from "lucide-react";
import { Link } from "react-router-dom";

import { useAuthStore } from "@/stores/auth.store";
import { ThemeToggle } from "@/components/ThemeToggle";

import { WorkspacePreview } from "../components/WorkspacePreview";

const features = [
  {
    icon: UsersRound,
    number: "01",
    title: "A place for your people.",
    description:
      "Create an organization, bring in your teammates, and give everyone the right role. A shared home for the work ahead.",
  },
  {
    icon: FolderKanban,
    number: "02",
    title: "A little more direction.",
    description:
      "Keep each project in its own space. Give your ideas a name, a purpose, and a clear path from plan to progress.",
  },
  {
    icon: CircleCheck,
    number: "03",
    title: "Clarity in every task.",
    description:
      "Assign owners, set priorities and due dates, and move tasks across your board. See what needs attention and what’s already done.",
  },
];

const steps = [
  {
    title: "Make yourself at home",
    description: "Create your account and set up an organization.",
  },
  {
    title: "Bring your team along",
    description: "Add your teammates and create your first project.",
  },
  {
    title: "Find your next step",
    description: "Break work into tasks and start moving things forward.",
  },
];

const primaryActionClassName =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring";
const textLinkClassName =
  "rounded-sm transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring";

export function HomePage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const startUrl = isAuthenticated ? "/dashboard" : "/register";
  const startLabel = isAuthenticated ? "Open workspace" : "Get started";

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-selection selection:text-selection-foreground">
      <a
        href="#main-content"
        className="sr-only rounded-md bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50"
      >
        Skip to content
      </a>

      <header className="border-b border-border">
        <nav
          aria-label="Main navigation"
          className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8"
        >
          <Link
            to="/"
            aria-label="TeamSync home"
            className={`flex items-center gap-2.5 ${textLinkClassName}`}
          >
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <UsersRound className="size-4" aria-hidden="true" />
            </span>
            <span className="text-lg font-semibold tracking-tight">TeamSync</span>
          </Link>

          <div className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            <a href="#features" className={textLinkClassName}>
              Why TeamSync
            </a>
            <a href="#how-it-works" className={textLinkClassName}>
              How it works
            </a>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <ThemeToggle />
            {!isAuthenticated && (
              <Link to="/login" className={`text-sm font-medium ${textLinkClassName}`}>
                Sign in
              </Link>
            )}
            <Link
              to={startUrl}
              className="hidden min-h-10 items-center gap-2 rounded-lg border border-input px-4 text-sm font-medium transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring min-[480px]:inline-flex"
            >
              {startLabel}
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>
        </nav>
      </header>

      <main id="main-content">
        <section
          aria-labelledby="home-heading"
          className="mx-auto grid max-w-6xl items-center gap-12 px-5 pt-16 pb-20 sm:px-8 sm:pt-20 sm:pb-24 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12 lg:pt-24 lg:pb-28"
        >
          <div>
            <p className="mb-6 flex items-center gap-2.5 text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
              <span className="size-1.5 rounded-full bg-brand" aria-hidden="true" />A calmer way to
              work together
            </p>
            <h1
              id="home-heading"
              className="text-[clamp(2.75rem,6vw,4.5rem)] leading-[1.08] font-medium tracking-[-0.055em] text-balance"
            >
              Your team.
              <br />
              <span className="text-brand">On the same page.</span>
            </h1>
            <p className="mt-6 max-w-md text-base leading-7 text-pretty text-muted-foreground">
              Bring your people, projects, and tasks into one shared workspace. Less chasing
              updates. More moving forward.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <Link to={startUrl} className={primaryActionClassName}>
                {startLabel}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <a
                href="#how-it-works"
                className={`inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground ${textLinkClassName}`}
              >
                See how it works
                <ArrowDown className="size-3.5" aria-hidden="true" />
              </a>
            </div>
            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Check className="size-3.5 text-brand" aria-hidden="true" />
                One shared workspace
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="size-3.5 text-brand" aria-hidden="true" />A clearer next step
              </span>
            </div>
          </div>

          <WorkspacePreview />
        </section>

        <section
          id="features"
          aria-labelledby="features-heading"
          className="scroll-mt-8 border-y border-border bg-card/60"
        >
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
            <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="mb-3 text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
                  Less scattered. More connected.
                </p>
                <h2
                  id="features-heading"
                  className="text-3xl font-medium tracking-[-0.04em] sm:text-4xl"
                >
                  Everything in its place.
                </h2>
              </div>
              <p className="max-w-xs text-sm leading-6 text-muted-foreground">
                A simple structure for the people you work with and the work you do together.
              </p>
            </div>

            <div className="grid gap-10 md:grid-cols-3 md:gap-8">
              {features.map(({ icon: Icon, number, title, description }) => (
                <div key={number} className="border-t border-border pt-6">
                  <div className="mb-5 flex items-center justify-between">
                    <Icon className="size-5 text-brand" strokeWidth={1.5} aria-hidden="true" />
                    <span className="font-mono text-[11px] text-muted-foreground">{number}</span>
                  </div>
                  <h3 className="text-base font-medium tracking-tight">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          aria-labelledby="steps-heading"
          className="mx-auto max-w-6xl scroll-mt-8 px-5 py-16 sm:px-8 sm:py-20"
        >
          <div className="mb-10 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <h2 id="steps-heading" className="text-2xl font-medium tracking-[-0.04em] sm:text-3xl">
              From “let’s do this” to done.
            </h2>
            <p className="text-sm text-muted-foreground">
              A few small steps. A better way to work.
            </p>
          </div>
          <ol className="grid gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <li key={step.title} className="flex items-start gap-4">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border text-xs font-medium text-brand">
                  {index + 1}
                </span>
                <div className="pt-1">
                  <h3 className="text-sm font-medium">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="start-heading" className="px-5 pb-16 sm:px-8 sm:pb-20">
          <div className="mx-auto flex max-w-[1088px] flex-col items-start justify-between gap-6 rounded-2xl bg-secondary px-7 py-10 sm:flex-row sm:items-center sm:px-10">
            <div>
              <h2
                id="start-heading"
                className="text-2xl font-medium tracking-[-0.04em] sm:text-3xl"
              >
                Make room for good teamwork.
              </h2>
              <p className="mt-2 text-sm leading-6 text-secondary-foreground">
                Your next project deserves a little less chaos.
              </p>
            </div>
            <Link to={startUrl} className={`${primaryActionClassName} shrink-0`}>
              {isAuthenticated ? "Open workspace" : "Create your account"}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 px-5 py-7 text-xs text-muted-foreground sm:flex-row sm:items-center sm:px-8">
          <p>
            <span className="font-medium text-foreground">TeamSync</span>
            <span className="mx-2" aria-hidden="true">
              ·
            </span>
            A little more in sync.
          </p>
          <div className="flex gap-5">
            <a href="#features" className={textLinkClassName}>
              Explore
            </a>
            <Link to={isAuthenticated ? "/dashboard" : "/login"} className={textLinkClassName}>
              {isAuthenticated ? "Workspace" : "Sign in"}
            </Link>
            <span>© {new Date().getFullYear()} TeamSync</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
