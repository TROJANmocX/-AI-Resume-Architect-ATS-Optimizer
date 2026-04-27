export const RESUME_TEMPLATES = {
  software_engineer: {
    basic: {
      name: "Alex Rivera",
      email: "alex.rivera@tech.com",
      phone: "+1 415 555 0123",
      location: "San Francisco, CA",
      summary: "Full-stack engineer specializing in scalable distributed systems and AI integration. Passionate about developer experience and performance optimization."
    },
    academics: [{ school: "Stanford University", degree: "M.S. Computer Science", year: "2020" }],
    experience: [
      {
        company: "CloudScale Systems",
        title: "Senior Software Engineer",
        date: "2021 - Present",
        bullets: [
          "Led development of a real-time analytics engine handling 1M+ req/sec.",
          "Optimized CI/CD pipelines reducing deployment time from 15m to 4m.",
          "Mentored 6 junior engineers and established team coding standards."
        ]
      }
    ],
    projects: [{ name: "OpenAI Proxy", description: "Edge-cached gateway for LLMs built with Rust and Cloudflare Workers." }],
    skills: ["React", "TypeScript", "Node.js", "Rust", "AWS", "Kubernetes"],
    languages: ["English (Native)", "Spanish (Fluent)"],
    certifications: [{ name: "AWS Solutions Architect Professional" }]
  },
  product_manager: {
    basic: {
      name: "Sarah Chen",
      email: "sarah.chen@product.io",
      phone: "+1 206 555 9876",
      location: "Seattle, WA",
      summary: "Data-driven Product Manager with 6+ years experience in B2B SaaS. Expert in user research, A/B testing, and cross-functional leadership."
    },
    academics: [{ school: "University of Washington", degree: "B.A. Business Administration", year: "2017" }],
    experience: [
      {
        company: "GrowthFlow",
        title: "Principal Product Manager",
        date: "2019 - 2024",
        bullets: [
          "Increased MAU by 45% through strategic redesign of the onboarding flow.",
          "Launched 4 major features that accounted for $2M in new ARR within 6 months.",
          "Managed a product roadmap for 3 cross-functional development teams."
        ]
      }
    ],
    skills: ["Product Strategy", "User Research", "Mixpanel", "Jira", "SQL", "Stakeholder Management"],
    languages: ["English (Native)", "Mandarin (Professional)"]
  }
};
