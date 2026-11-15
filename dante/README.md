# Dante.<3 — Portfolio

A single-page personal portfolio for a Discord developer. Deep black, purple accents,
glass surfaces, subtle motion — no frameworks, no build step.

```
dante/
├── index.html       page structure + SEO metadata
├── styles.css       all styling and responsive rules
├── config.js        ← edit everything personal here
├── script.js        rendering, filters, menu, copy, scroll effects, contact form
├── server.mjs       static server + secure POST /api/contact (Resend)
├── package.json     start / check scripts (no dependencies)
├── .env.example     placeholder credentials for the contact form
├── .gitignore       keeps .env out of Git
└── assets/
    └── avatar.jpg   profile image
```

## Edit your content

Open `config.js`. Everything you'd normally want to change lives there:

| What | Where |
| --- | --- |
| Name, handle, email, avatar | `identity` |
| Availability pill / status dots | `identity.availability` (`open: false` shows the closed label) |
| Hero greeting, roles, intro, chips, facts | `hero` |
| About heading, paragraphs, facts, note | `about` |
| Skill cards (icon, title, text, tags, level 0–100) | `skills[]` |
| Services (title, text, bullet points) | `services[]` |
| Project filters and cards | `projects.categories` / `projects.items[]` |
| Journey phases | `timeline[]` |
| Discord server invite (name, invite, vanity, copy) | `community` |
| Contact copy | `contact` |
| Social links (footer + mobile menu) | `socials[]` |

Icons: skills use `server`, `bot`, `terminal`, `shield`, `layout`, `sparkles`.
Socials use `discord`, `mail`, `github`, `x`.

### Projects

Each project accepts:

```js
{
  title: "Ticket bot",
  category: "Discord Bots",     // must match one of projects.categories
  desc: "Short description.",
  tags: ["discord.js", "Tickets"],
  image: "assets/projects/ticket-bot.jpg", // optional
  link: "https://...",          // optional — hides the button when empty
  source: "https://...",        // optional
  placeholder: false            // true shows the "Template" flag
}
```

The seven starter cards are intentionally marked as templates. Replace them with real
work only — don't add clients or results you can't back up.

### Community invite

The Discord community section is driven by `community`:

```js
community: {
  serverName: "Zepto",
  description: "Join my Discord community and be part of the experience.",
  inviteUrl: "https://discord.gg/zepto",
  vanity: "discord.gg/zepto",
  cta: "Join My Discord Server"
}
```

Both the vanity URL and the **Join My Discord Server** button open `inviteUrl` in a new
tab. There are no member counts, statistics or fake online status — keep it that way.

### Contact form

The contact form posts to `POST /api/contact` on the same origin. `server.mjs` validates
the input again, then sends the message through [Resend](https://resend.com). Success is
only shown after Resend accepts the message; failures show the error state instead.

`contact` in `config.js` controls the copy and the endpoint:

```js
contact: {
  heading: "Let's Build Something Great Together.",
  blurb: "Have a project in mind…",
  formEndpoint: "/api/contact",
  successMessage: "Thank you! Your message has been sent successfully. I'll get back to you soon.",
  errorMessage: "Something went wrong while sending your message. Please try again later."
}
```

The recipient is fixed on the server (`CONTACT_TO_EMAIL`, default
`mannansonava22@gmail.com`) and cannot be changed by a visitor.

#### Email delivery setup (Resend)

1. Create a free account at <https://resend.com>.
2. Add and verify a sending domain (DNS records), or use `onboarding@resend.dev` for a
   quick test — that test sender only delivers to the email on your Resend account.
3. Create an API key with sending permission.
4. Copy `.env.example` to `.env` and fill in:

   ```bash
   RESEND_API_KEY=re_your_key_here
   CONTACT_FROM_EMAIL=Dante <contact@yourdomain.com>
   CONTACT_TO_EMAIL=mannansonava22@gmail.com
   ```

5. Start the server with `npm start` and submit the form once.

Without `RESEND_API_KEY` and `CONTACT_FROM_EMAIL` the endpoint returns
`503 not_configured` and the form shows the error message. It never reports a fake
success. The API key is only read by the server — it is never shipped to the browser.

#### Abuse protection

- Server-side validation and sanitisation of every field
- Honeypot field plus a minimum fill-time check
- Per-IP rate limit (default 5 messages / 15 minutes)
- 32 KB request body limit and JSON content-type requirement
- Same-origin check for browser requests
- Recipient locked server-side
- `TRUST_PROXY=1` only when running behind a trusted reverse proxy

### Discord button

`identity.discordUrl` is empty by default. Leave it empty and **Contact Me on Discord**
copies your username (`manii_.0`) and shows a toast. Paste a profile URL such as
`https://discord.com/users/000000000000000000` to open Discord instead. No ID or profile
link is invented.

### Avatar

Replace `assets/avatar.jpg` with a square image (736×736 or larger works well).
Keep the same filename or change `identity.avatar`.

## Run locally

Node 20+ is required for the contact form.

```bash
cd dante
npm start
# open http://127.0.0.1:5174
```

`npm run check` runs syntax checks on the server and browser scripts.

You can also open `index.html` directly for a design preview, but the form will not work
without the server (there is no static-host email endpoint).

## Deploy

Deploy the folder to a host that can run Node (Render, Railway, Fly.io, a VPS, or a
Netlify/Vercel function fronting the same endpoint):

1. Set `RESEND_API_KEY`, `CONTACT_FROM_EMAIL` and `CONTACT_TO_EMAIL` in the host's
   environment settings — never in the repo.
2. Start with `npm start` (or `node server.mjs`) and set `HOST=0.0.0.0` so the platform
   can reach the server.
3. Set `TRUST_PROXY=1` if the platform terminates TLS in front of the app.
4. Uncomment `<link rel="canonical">` in `index.html` and set your domain.
5. Make the Open Graph / Twitter image URL absolute (currently `assets/avatar.jpg`).
6. Update the JSON-LD `Person` block if your details change.
7. Replace the placeholder projects.

A plain static host (GitHub Pages) will show the site but cannot deliver form email;
keep the **Email Me** button as the fallback there.

## Notes

- Navigation, mobile menu, smooth scrolling, filters, copy-to-clipboard, email links
  and scrollspy are all wired in `script.js`.
- `prefers-reduced-motion` is respected, focus styles are visible, and the page is
  keyboard navigable (including a skip link).
- Cards use CSS-only spotlight and tilt effects on devices with a fine pointer.
