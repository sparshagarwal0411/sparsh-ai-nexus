export type Internship = {
  id: string;
  title: string;
  company: string;
  logo: string; // emoji
  location: string;
  remote: boolean;
  duration: string;
  stipend: string;
  platform: "Internshala" | "LinkedIn" | "Indeed" | "Prosple" | "Wellfound";
  applyUrl: string;
  postedDays: number;
  description: string;
  requiredSkills: string[];
  niceToHave: string[];
  tags: string[];
};

export const INTERNSHIPS: Internship[] = [
  {
    id: "i1", title: "AI/ML Engineering Intern", company: "Nimbus AI", logo: "🧠",
    location: "Bengaluru, IN", remote: true, duration: "6 months", stipend: "₹40,000/mo",
    platform: "LinkedIn", applyUrl: "https://www.linkedin.com/jobs/", postedDays: 2,
    description: "Build and fine-tune LLM-powered features for our analytics product. Work directly with the founding team.",
    requiredSkills: ["Python", "PyTorch", "Machine Learning", "REST APIs"],
    niceToHave: ["LangChain", "Vector DBs", "Docker"],
    tags: ["AI", "Backend", "Startup"],
  },
  {
    id: "i2", title: "Frontend Developer Intern", company: "Lumen Labs", logo: "🎨",
    location: "Remote", remote: true, duration: "3 months", stipend: "₹25,000/mo",
    platform: "Internshala", applyUrl: "https://internshala.com/internships/", postedDays: 1,
    description: "Ship production React + TypeScript features for a fintech dashboard used by 20k+ users.",
    requiredSkills: ["React", "TypeScript", "Tailwind CSS", "Git"],
    niceToHave: ["Next.js", "Framer Motion", "Figma"],
    tags: ["Frontend", "Fintech"],
  },
  {
    id: "i3", title: "Data Science Intern", company: "Quanta Insights", logo: "📊",
    location: "Hyderabad, IN", remote: false, duration: "4 months", stipend: "₹35,000/mo",
    platform: "Indeed", applyUrl: "https://www.indeed.com/q-data-science-intern-jobs.html", postedDays: 5,
    description: "Mine large e-commerce datasets, build forecasting models, present insights to product teams.",
    requiredSkills: ["Python", "Pandas", "SQL", "Statistics"],
    niceToHave: ["Tableau", "scikit-learn", "Airflow"],
    tags: ["Data", "Analytics"],
  },
  {
    id: "i4", title: "Backend Engineer Intern", company: "Forge Cloud", logo: "⚙️",
    location: "Remote", remote: true, duration: "6 months", stipend: "$1,500/mo",
    platform: "Wellfound", applyUrl: "https://wellfound.com/jobs", postedDays: 3,
    description: "Design scalable APIs in Go, work on multi-tenant infra, ship to thousands of devs daily.",
    requiredSkills: ["Go", "PostgreSQL", "REST APIs", "Linux"],
    niceToHave: ["Kubernetes", "gRPC", "Redis"],
    tags: ["Backend", "DevTools"],
  },
  {
    id: "i5", title: "Product Design Intern", company: "Northwind", logo: "✨",
    location: "Mumbai, IN", remote: false, duration: "3 months", stipend: "₹30,000/mo",
    platform: "Prosple", applyUrl: "https://prosple.com/", postedDays: 7,
    description: "Own end-to-end design for new mobile features. Work with PMs and engineers in a fast loop.",
    requiredSkills: ["Figma", "User Research", "Prototyping"],
    niceToHave: ["Motion design", "Design systems"],
    tags: ["Design", "Mobile"],
  },
  {
    id: "i6", title: "Full-Stack Intern", company: "Pulse Health", logo: "🩺",
    location: "Remote", remote: true, duration: "5 months", stipend: "₹45,000/mo",
    platform: "LinkedIn", applyUrl: "https://www.linkedin.com/jobs/", postedDays: 0,
    description: "Build features across React + Node for a health platform that touches 1M+ patients.",
    requiredSkills: ["React", "Node.js", "PostgreSQL", "TypeScript"],
    niceToHave: ["AWS", "Prisma", "Testing"],
    tags: ["Full-stack", "Healthtech"],
  },
  {
    id: "i7", title: "DevOps Intern", company: "Stratus Systems", logo: "☁️",
    location: "Pune, IN", remote: true, duration: "6 months", stipend: "₹35,000/mo",
    platform: "Indeed", applyUrl: "https://www.indeed.com/", postedDays: 4,
    description: "Automate CI/CD, monitor production workloads, and harden cloud infrastructure.",
    requiredSkills: ["Linux", "Docker", "AWS", "Bash"],
    niceToHave: ["Terraform", "Kubernetes", "Prometheus"],
    tags: ["DevOps", "Cloud"],
  },
  {
    id: "i8", title: "Growth Marketing Intern", company: "Bloom", logo: "🌱",
    location: "Remote", remote: true, duration: "3 months", stipend: "₹20,000/mo",
    platform: "Internshala", applyUrl: "https://internshala.com/", postedDays: 6,
    description: "Run paid + content experiments on a creator-economy SaaS. Own metrics end-to-end.",
    requiredSkills: ["Content writing", "SEO", "Analytics"],
    niceToHave: ["Notion", "Webflow", "Canva"],
    tags: ["Marketing", "SaaS"],
  },
  {
    id: "i9", title: "Mobile (React Native) Intern", company: "Ridge Apps", logo: "📱",
    location: "Remote", remote: true, duration: "4 months", stipend: "₹32,000/mo",
    platform: "Wellfound", applyUrl: "https://wellfound.com/", postedDays: 2,
    description: "Build cross-platform mobile features, integrate native modules, ship to App Store and Play.",
    requiredSkills: ["React Native", "TypeScript", "Git"],
    niceToHave: ["iOS", "Android", "Reanimated"],
    tags: ["Mobile"],
  },
  {
    id: "i10", title: "Cybersecurity Research Intern", company: "Aegis Labs", logo: "🛡️",
    location: "Delhi, IN", remote: false, duration: "6 months", stipend: "₹38,000/mo",
    platform: "LinkedIn", applyUrl: "https://www.linkedin.com/jobs/", postedDays: 8,
    description: "Investigate emerging threats, build PoCs, contribute to a public threat-intel feed.",
    requiredSkills: ["Networking", "Linux", "Python"],
    niceToHave: ["Reverse engineering", "Burp Suite", "OWASP"],
    tags: ["Security"],
  },
  {
    id: "i11", title: "Product Management Intern", company: "Orbit", logo: "🪐",
    location: "Bengaluru, IN", remote: true, duration: "4 months", stipend: "₹40,000/mo",
    platform: "Prosple", applyUrl: "https://prosple.com/", postedDays: 3,
    description: "Drive discovery and shipping for the onboarding surface of a B2B AI tool.",
    requiredSkills: ["Product Sense", "Analytics", "Communication"],
    niceToHave: ["SQL", "Figma", "Notion"],
    tags: ["Product"],
  },
  {
    id: "i12", title: "Computer Vision Intern", company: "Vista AI", logo: "👁️",
    location: "Remote", remote: true, duration: "5 months", stipend: "₹50,000/mo",
    platform: "LinkedIn", applyUrl: "https://www.linkedin.com/", postedDays: 1,
    description: "Train and ship CV models for retail analytics. Real production datasets, real impact.",
    requiredSkills: ["Python", "PyTorch", "OpenCV", "Deep Learning"],
    niceToHave: ["ONNX", "CUDA", "Edge deployment"],
    tags: ["AI", "CV"],
  },
];
