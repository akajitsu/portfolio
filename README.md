# Portfolio

Next.js 15 · React 19 · TypeScript · Tailwind CSS 4 · Motion 12

    npm install
    npm run dev        # http://localhost:3000
    npm run build      # production build (run before deploying)

Deploys to Vercel with no extra configuration.

## Updating content — no component edits needed

All content lives in `src/data/`. Components only read from these files.

| What | Where |
| --- | --- |
| Name, headline, rotating roles, intro, about text, email, socials | `src/data/profile.ts` |
| Projects (Work section, `/projects`, `/projects/[slug]`) | `src/data/projects.ts` |
| Journey timeline (education, work, leadership, milestones) | `src/data/experience.ts` |
| Tech stack | `src/data/skills.ts` |
| Navigation items | `src/data/navigation.ts` |
| Certificates · favourite games | `src/data/certificates.ts` · `src/data/games.ts` |

### Profile photo
1. Put the image in `public/images/profile/` (portrait, around 4:5, works best).
2. In `profile.ts` set `photo.src` to e.g. `"/images/profile/jared.jpg"`.
3. Optionally set `photo.position` (e.g. `"50% 20%"`) to keep your face in frame.

### Resume
Drop the PDF at `public/documents/resume.pdf`. The site detects it automatically:
the View / Download buttons and the inline preview switch on. Set
`resume.lastUpdated` in `profile.ts` if you want a date shown.

### Project screenshots
Put images in `public/images/projects/`, then in `projects.ts`:

```ts
thumbnail: { src: "/images/projects/beanzz-home.webp", alt: "BeanZz home page" },        // browser mockup
mobileThumbnail: { src: "/images/projects/beanzz-mobile.webp", alt: "BeanZz on a phone" }, // phone mockup (optional)
previews: [{ src: "/images/projects/beanzz-reader.webp", alt: "Reading view" }],          // detail-page gallery
```

Without a thumbnail, an engraved panel with the project name is shown; without
`mobileThumbnail`, the phone mockup is hidden.

### Adding a project
Copy an entry in `projects.ts` and change the fields.
Optional links (`liveUrl`, `githubUrl`) only render when filled in. When `liveUrl`
is set, the project's preview image links to the live site.
A detail page is generated at `/projects/<slug>` for every project.

### Adding a certificate
Add an entry to `src/data/certificates.ts` (a template is in the file):
`title`, `issuer`, `date`, plus optional `image` (in `public/images/certificates/`)
and `href` (verification link). Until the first one is added, the Certificates
section shows an empty archive.

### Design system
Colors live as tokens in `src/app/globals.css` (shared names, separate light and
dark values). Decorative SVGs — stars, suns, crescents, clouds, the hero arch,
the scrolling band, the sky — are in `src/components/celestial/`.
Fonts (Cormorant Garamond, Cinzel, Manrope) are self-hosted in `src/fonts/`, so
builds don't need to reach Google Fonts. The hero motto is `motto` in `profile.ts`.
New visitors see the dark theme; the toggle remembers their choice.

### Social links
Empty `href` values (GitHub, LinkedIn) show as muted "Soon" rows — fill them in to activate.

### Open Graph
Set `siteUrl` in `profile.ts` once you have a domain. On Vercel the production URL is used automatically.
