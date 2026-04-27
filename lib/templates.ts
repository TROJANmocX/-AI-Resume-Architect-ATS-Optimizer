export const RESUME_TEMPLATES = {
  indian_professional: {
    basic: {
      name: "Arjun Sharma",
      email: "arjun.sharma@techmail.in",
      phone: "+91 98765 43210",
      location: "Bengaluru, Karnataka",
      summary: "Senior Full-Stack Developer with 7+ years of experience in building scalable fintech solutions and enterprise-grade distributed systems. Expertise in performance tuning for high-concurrency environments."
    },
    academics: [{ school: "Indian Institute of Technology (IIT), Delhi", degree: "B.Tech in Computer Science", year: "2017" }],
    experience: [
      {
        company: "PayTM / Zomato",
        title: "Senior Software Engineer",
        date: "2020 - Present",
        bullets: [
          "Architected a high-concurrency wallet system handling 10k+ transactions per second.",
          "Led a cross-functional team of 12 for the successful launch of the 'Direct-to-Bank' feature.",
          "Optimized slow DB queries, reducing overall application latency by 35%."
        ]
      },
      {
        company: "Infosys / TCS",
        title: "Systems Engineer",
        date: "2017 - 2020",
        bullets: [
          "Developed core modules for an international banking client using Java and Spring Boot.",
          "Implemented automated testing suites that reduced production bugs by 20%."
        ]
      }
    ],
    projects: [{ name: "BhimPay Integration", description: "Seamless UPI integration for 500+ merchant partners across India." }],
    skills: ["React", "GoLang", "PostgreSQL", "Kafka", "AWS", "UPI Integration"],
    languages: ["English (Professional)", "Hindi (Native)", "Kannada (Fluent)"],
    certifications: [{ name: "Google Certified Professional Cloud Architect" }],
    awards: [{ name: "Star Performer of the Year", giver: "Zomato Tech Team" }]
  },
  software_engineer: {
    basic: {
      name: "Alex Rivera",
      email: "alex.rivera@tech.com",
      phone: "+1 415 555 0123",
      location: "San Francisco, CA",
      summary: "Full-stack engineer specializing in scalable distributed systems and AI integration."
    },
    academics: [{ school: "Stanford University", degree: "M.S. Computer Science", year: "2020" }],
    experience: [
      {
        company: "CloudScale Systems",
        title: "Senior Software Engineer",
        date: "2021 - Present",
        bullets: [
          "Led development of a real-time analytics engine handling 1M+ req/sec.",
          "Optimized CI/CD pipelines reducing deployment time from 15m to 4m."
        ]
      }
    ],
    projects: [{ name: "OpenAI Proxy", description: "Edge-cached gateway for LLMs built with Rust." }],
    skills: ["React", "TypeScript", "Node.js", "Rust", "AWS", "Kubernetes"],
    languages: ["English (Native)", "Spanish (Fluent)"],
    certifications: [{ name: "AWS Solutions Architect Professional" }]
  }
};
