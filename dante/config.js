/* ============================================================
   Dante.<3 — Portfolio configuration
   ------------------------------------------------------------
   Everything personal lives in this file. Edit the values,
   save, refresh. No build step required.

   Paths are resolved by script.js:
   - identity.*  → hero, header, contact, footer
   - hero.*      → hero copy, chips, facts
   - about.*     → about paragraphs + "at a glance" card
   - skills[]    → skills grid
   - services[]  → services list
   - projects[]  → filterable project grid
   - timeline[]  → journey timeline
   - community.* → Discord server invite section
   - contact.*   → contact section copy
   - socials[]   → footer + mobile menu links
   ============================================================ */

window.SITE = {
  /* ----------------------------------------------------------
     1. Identity
     ---------------------------------------------------------- */
  identity: {
    displayName: "Dante.<3",
    handle: "manii_.0",
    role: "Discord All-Rounder",
    professionalTitle: "Discord Developer | Server Architect | Bot Creator",
    experience: "2–3 years",
    email: "mannansonava22@gmail.com",
    avatar: "assets/avatar.jpg",

    // Optional: paste your Discord user ID link, e.g.
    // "https://discord.com/users/123456789012345678"
    // Leave empty and the "Contact on Discord" button copies your username instead.
    discordUrl: "",

    // Availability pill + status dots. Set open:false to show "Currently booked".
    availability: {
      open: true,
      label: "Available for new projects",
      short: "Open for work",
      closedLabel: "Currently booked",
      note: "Open to freelance builds, long-term collaborations and community work."
    }
  },

  /* ----------------------------------------------------------
     2. Hero
     ---------------------------------------------------------- */
  hero: {
    greeting: "Hey, I'm",
    roles: ["Discord Developer", "Server Architect", "Bot Creator"],
    intro:
      "I build Discord bots, servers and custom systems — clean architecture, careful design and the small details that make a community feel premium.",
    chips: ["Discord bots", "Server architecture", "Community design"],
    facts: [
      { label: "Experience", value: "2–3 years" },
      { label: "Working", value: "Remote · worldwide" },
      { label: "Focus", value: "Discord-first" }
    ]
  },

  /* ----------------------------------------------------------
     3. About
     ---------------------------------------------------------- */
  about: {
    heading: "I build communities that feel designed, not assembled.",
    paragraphs: [
      "I'm an independent Discord developer and designer with 2–3 years of hands-on experience across the platform. Most of my time goes into building bots, structuring servers and shaping communities that are easy to join, easy to moderate and good to look at.",
      "I care about the details other people skip — a clean permission hierarchy, a welcome flow that actually explains the server, commands that feel obvious the first time you use them. Whether it's a fresh build or a server that grew too fast, I work until it feels right.",
      "I work directly with community owners, small teams and creators. No agency layers — just a clear conversation about what you need, and a build that matches it."
    ],
    facts: [
      { label: "Role", value: "Discord All-Rounder" },
      { label: "Experience", value: "2–3 years" },
      { label: "Focus", value: "Bots · Servers · Design" },
      { label: "Status", value: "Open for projects" }
    ],
    note: "Built around your community — not a template with your logo on it."
  },

  /* ----------------------------------------------------------
     4. Skills
     icon: server | bot | terminal | shield | layout | sparkles
     level: 0–100, controls the meter only
     ---------------------------------------------------------- */
  skills: [
    {
      icon: "server",
      title: "Discord Server Setup",
      desc: "Channels, roles, permissions and onboarding flows built around how your community actually works.",
      tags: ["Structure", "Permissions", "Onboarding"],
      level: 95
    },
    {
      icon: "bot",
      title: "Discord Bot Development",
      desc: "Custom bots with slash commands, embeds, buttons and automation — built to be maintained, not just shipped.",
      tags: ["discord.js", "Slash commands", "Automation"],
      level: 92
    },
    {
      icon: "terminal",
      title: "Custom Bot Commands",
      desc: "Purpose-built commands and systems: tickets, applications, moderation, utilities and custom workflows.",
      tags: ["Tickets", "Moderation", "Utilities"],
      level: 90
    },
    {
      icon: "shield",
      title: "Server Security & Anti-Raid",
      desc: "Sensible permission hierarchies, verification gates, raid detection and moderation workflows that hold up.",
      tags: ["Anti-raid", "Verification", "Audits"],
      level: 88
    },
    {
      icon: "layout",
      title: "Discord Server Designing",
      desc: "A server identity that matches your brand — icon, banner, channel art and visuals that stay consistent.",
      tags: ["Branding", "Icons", "Channel art"],
      level: 85
    },
    {
      icon: "sparkles",
      title: "Additional Skills",
      desc: "Editable placeholder — use this slot for automation, web integrations, community management or anything else you offer.",
      tags: ["Your skill", "Your tool", "Your niche"],
      level: 70
    }
  ],

  /* ----------------------------------------------------------
     5. Services
     ---------------------------------------------------------- */
  services: [
    {
      title: "Complete Discord Server Setup",
      desc: "A full build from a blank server to a finished, polished community — structured for growth from day one.",
      points: ["Category & channel planning", "Roles & permissions", "Onboarding flow", "Handover walkthrough"]
    },
    {
      title: "Custom Discord Bot Development",
      desc: "A bot made for your community — nothing bloated, nothing missing, built around the way you actually run things.",
      points: ["Feature scoping", "Slash commands & embeds", "Buttons, menus & modals", "Deployment guidance"]
    },
    {
      title: "Custom Bot Commands & Systems",
      desc: "Single commands or complete systems that take repetitive work off your moderators' hands.",
      points: ["Ticket systems", "Application forms", "Moderation tools", "Custom workflows"]
    },
    {
      title: "Server Security & Anti-Raid Protection",
      desc: "Practical protection that keeps raids and bad actors out — without making the server annoying to join.",
      points: ["Permission audit", "Verification gates", "Raid response", "Recovery checklist"]
    },
    {
      title: "Professional Server Design",
      desc: "A visual identity for your server that looks intentional everywhere members see it.",
      points: ["Server icon & banner", "Channel icons", "Welcome screens", "Brand-consistent assets"]
    }
  ],

  /* ----------------------------------------------------------
     6. Projects
     ----------------------------------------------------------
     Replace the placeholder items below with real projects.
     - category must match one of the categories in the list
     - image: optional path, e.g. "assets/projects/ticket-bot.jpg"
     - link / source: optional URLs; omit or leave "" to hide buttons
     - placeholder: true adds a "Template" flag — remove it on real projects
     ---------------------------------------------------------- */
  projects: {
    categories: [
      "All",
      "Discord Bots",
      "Discord Servers",
      "Custom Bot Systems",
      "Security Systems",
      "Server Designs",
      "Personal Projects",
      "Client Projects"
    ],
    items: [
      {
        title: "Your bot project",
        category: "Discord Bots",
        desc: "Add your real project here — what the bot does, who it was for and what made it useful. Everything on this card is editable in config.js.",
        tags: ["discord.js", "Automation"],
        image: "",
        link: "",
        source: "",
        placeholder: true
      },
      {
        title: "Your server build",
        category: "Discord Servers",
        desc: "A complete server setup, from structure and permissions to onboarding. Swap this copy for a real build and add a screenshot.",
        tags: ["Setup", "Onboarding"],
        image: "",
        link: "",
        source: "",
        placeholder: true
      },
      {
        title: "Your command system",
        category: "Custom Bot Systems",
        desc: "Tickets, applications or a workflow you invented. Describe the system, then link the project or its source.",
        tags: ["Systems", "Workflows"],
        image: "",
        link: "",
        source: "",
        placeholder: true
      },
      {
        title: "Your security setup",
        category: "Security Systems",
        desc: "Anti-raid, verification or a full permission audit. Use this slot to show how you protect a community.",
        tags: ["Anti-raid", "Audit"],
        image: "",
        link: "",
        source: "",
        placeholder: true
      },
      {
        title: "Your server identity",
        category: "Server Designs",
        desc: "Icon, banner and channel art as one consistent set. Add the finished assets and a short story behind the design.",
        tags: ["Branding", "Visuals"],
        image: "",
        link: "",
        source: "",
        placeholder: true
      },
      {
        title: "Your personal project",
        category: "Personal Projects",
        desc: "Experiments, tools or things you built for yourself. Personal work is often the best proof of how you think.",
        tags: ["Experiment", "Tooling"],
        image: "",
        link: "",
        source: "",
        placeholder: true
      },
      {
        title: "Your client project",
        category: "Client Projects",
        desc: "Only add real client work here — with permission. Keep it honest: what you built, not results you can't prove.",
        tags: ["Freelance", "Build"],
        image: "",
        link: "",
        source: "",
        placeholder: true
      }
    ]
  },

  /* ----------------------------------------------------------
     7. Journey timeline
     No companies or exact dates needed — phases tell the story.
     ---------------------------------------------------------- */
  timeline: [
    {
      phase: "Phase 01",
      title: "Starting out with Discord",
      desc: "Learning the platform from the inside — servers, roles, permissions, channels and the small details that keep a community readable.",
      tags: ["Fundamentals", "Server structure"]
    },
    {
      phase: "Phase 02",
      title: "Bots, commands & automation",
      desc: "Moving from setup into code: slash commands, embeds, buttons, modals and automations that take repetitive work off moderators' hands.",
      tags: ["discord.js", "Automation"]
    },
    {
      phase: "Phase 03",
      title: "Architecture, security & design",
      desc: "Thinking beyond a single server — permission hierarchies, onboarding flows, anti-raid setups and a visual identity that stays consistent.",
      tags: ["Security", "Design systems"]
    },
    {
      phase: "Phase 04",
      title: "Now — building for communities",
      desc: "Working independently as a Discord all-rounder: servers, bots, systems and design, carried from the first idea to a finished build.",
      tags: ["Freelance", "End to end"]
    }
  ],

  /* ----------------------------------------------------------
     8. Community — Discord server invite
     Keep it honest: no member counts, statistics or fake status.
     ---------------------------------------------------------- */
  community: {
    serverName: "Zepto",
    label: "Discord community",
    inviteLabel: "Invite",
    description: "Join my Discord community and be part of the experience.",
    inviteUrl: "https://discord.gg/zepto",
    vanity: "discord.gg/zepto",
    cta: "Join My Discord Server",
    hint: "Opens the invite in a new tab."
  },

  /* ----------------------------------------------------------
     9. Contact
     ---------------------------------------------------------- */
  contact: {
    heading: "Let's Build Something Great Together.",
    emphasis: "Great Together.",
    blurb:
      "Have a project in mind or need help with your Discord community? Let's connect and bring your ideas to life.",
    note: "Open to freelance builds, long-term collaborations and community work.",

    // Contact form — backend endpoint (same origin) and visitor-facing messages.
    formEndpoint: "/api/contact",
    successMessage:
      "Thank you! Your message has been sent successfully. I'll get back to you soon.",
    errorMessage:
      "Something went wrong while sending your message. Please try again later.",
    privacy: "Your details are only used to reply to your message."
  },

  /* ----------------------------------------------------------
     10. Social links
     Add or remove entries freely. Icons: discord | mail | github | x
     Links with url "#" are hidden automatically.
     ---------------------------------------------------------- */
  socials: [
    { label: "Discord", icon: "discord", handle: "manii_.0", copy: true },
    { label: "Email", icon: "mail", url: "mailto:mannansonava22@gmail.com" }
    // { label: "GitHub", icon: "github", url: "https://github.com/your-handle" },
    // { label: "X", icon: "x", url: "https://x.com/your-handle" }
  ]
};
