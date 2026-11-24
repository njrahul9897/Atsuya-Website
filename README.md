# Atsuya Technologies website

The marketing site for Atsuya Technologies and AOne, the operational intelligence platform
(AOne IoT, Vision AI and BluSquad managed services) across eight industries.

Next.js 15 (App Router) · TypeScript · Tailwind CSS 4 · GSAP + ScrollTrigger · Framer Motion · Lenis.
Every page is statically generated; the only server code is the assessment form's server action and
its stub endpoint.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static generation for every route
npm run start      # serve the production build
npm run lint
npm run typecheck
npm run tbd        # list every [TBD: …] gap still in the content (the site never shows them)
npm run build:illustrations   # redraw the detailed 2.5D illustrations from their models
```

**Content gaps.** Missing content is marked `[TBD: …]` in the content files. The site never
shows a marker: `lib/tbd.ts` strips them from text, and a block that holds only a gap is left out
(the About story and leadership, careers and partner lists, contact details, the Security card,
placeholder guides and blog posts). Legal pages show one line pointing to the contact page until
their text is in. Fill a gap in the content file and its block appears.

## Where things live

| Path | What it holds |
| --- | --- |
| `content/` | All copy and data. Pages render from these files. |
| `content/industries.ts` | The eight industries. Adding one here creates its page, tile, menu entry, estimator option, sitemap entry and OG image. |
| `content/caseStudies.ts` | The 13 case studies (text from `docs/AOne Industry Solutions with case studies.pdf`, which is kept locally and not committed). |
| `content/solutions.ts`, `content/platform.ts` | The six solutions and the three platform layers. |
| `content/home.ts`, `content/site.ts`, `content/company.ts` | Homepage copy, navigation and contact details, company/resources/legal pages. |
| `lib/seo.ts` | The route registry: metadata, breadcrumbs, JSON-LD, sitemap and OG images all come from it. |
| `app/globals.css` | Design tokens (CSS variables), type scale, grid, motion and the 2.5D scene styles. |
| `components/iso/` | The isometric kit (`kit.tsx`) and the placeholder scene data (`scenes.ts`). |
| `illustrations/` | The detailed 2.5D illustrations: their models, the exporter and the generated layers (see below). |
| `components/sections/IsoScene.tsx` | The pinned scroll scene (homepage "Sense. See. Decide. Act." and every industry's operation map). |
| `components/layout/SiteSearch.tsx`, `app/search-index.json/route.ts` | Site search: the header's search button and dialog, and the index it reads (built from the route registry, so new pages are searchable without extra work). |
| `components/hero/HeroVideo.tsx` | The hero video: poster first, video after, pause control, reduced-motion and Save-Data fallbacks. |
| `app/og/[...slug]/route.tsx` | One Open Graph image per page, generated at build time. |

## Swapping in real assets

**Hero videos.** Paths come from `content/home.ts` and `content/industries.ts`. For each video the
site expects four files with the same base name:

```
public/videos/industries/{slug}.mp4         1080p H.264, no audio, ≤ 6 MB
public/videos/industries/{slug}.webm        1080p VP9, no audio (same name as the MP4)
public/videos/industries/{slug}-720.mp4     720p for screens under 768px, ≤ 2.5 MB
public/videos/industries/{slug}.jpg         poster (first frame)
public/videos/industries/{slug}-mobile.jpg  9:16 poster crop for phones
```

The files there now are placeholders cut from the two brand films by
`scripts/make-placeholder-videos.mjs` (each industry's shot, slowed and looped). Drop the real films
in under the same names and nothing else changes.

**Brand blue.** `--brand-blue` in `app/globals.css` is `#1F77BD`, taken from the logo file. Change
the three `--brand-blue*` variables if the brand guidelines say otherwise.

**Typeface.** Schibsted Grotesk and JetBrains Mono, loaded in `app/layout.tsx` with
`next/font/local` from the WOFF2 files in `assets/fonts/`. They are self-hosted so builds never
depend on Google Fonts: `next/font/google` failed a Vercel build once, when Google returned a font
URL it could not parse. Both files were built from the variable TTFs in the google/fonts repo
(`ofl/schibstedgrotesk`, `ofl/jetbrainsmono`) with fontTools, using Google's `latin` and
`latin-ext` unicode ranges for Schibsted Grotesk (all weights, 400–900) and `latin` for JetBrains
Mono (weights 400–500). The licences sit beside them (`OFL-*.txt`). The TTFs in the same folder
are used only to render the OG images.

**Logos.** `content/site.ts` → `customers`. Add `logo: { src: "/images/clients/name.svg", width, height }`
(the file's intrinsic size; the wall sizes each mark by its proportions) to an entry and
the logo wall shows the mark instead of the name set in type. The wall is its own light band on the
homepage: 23 customers in full colour, each on a white tile. The marks come from the Atsuya brand
folder ("Client logo"), trimmed of their margins; seven are cut from the case-study PDF. Grandiose
still needs a file.

**2.5D scenes.** `components/iso/scenes.ts` holds simple placeholder blocks. Each zone is its own
`<g id="zone-{id}">`; the ids match `zones[].id` in `content/industries.ts`. Final art can replace
the scene data, or replace `SceneSvg` with illustrator SVGs that keep those ids.

**Forms.** The assessment form posts through a server action (`app/actions.ts`) to the stub at
`app/api/assessment/route.ts`. Set `ASSESSMENT_ENDPOINT` to the CRM intake URL, or replace the
stub. Search for `TODO: connect CRM`.

**Newsletter.** The sign-up at the top left of the footer (`components/layout/Footer.tsx`, form in
`components/forms/NewsletterForm.tsx`, copy in `content/site.ts` → `newsletter`) posts through `subscribeNewsletter` in `app/actions.ts` to the
stub at `app/api/newsletter/route.ts`, which stores nothing. Set `NEWSLETTER_ENDPOINT` to the email
provider's sign-up URL, or replace the stub. Search for `TODO: connect newsletter`.

## Visual system

The look follows the leaders in this space (Samsara, Augury, Motive, Tulip, Cognite): dark,
immersive surfaces alternating with light ones, real footage, and product UI shown in lit panels.
This deliberately replaces the first build's strict "minimal, no gradients, few borders" reading
of the brief.

- **Blue in every headline.** Every page and section title carries at least one word in brand
  blue. Mark the words with asterisks in the text, `Make the world run *autonomous*`, and `<Accent>`
  (`components/ui/rich.tsx`) colours them; unmarked titles fall back to their last sentence or
  clause, then their last word. `plain()` (`lib/accent.ts`) takes the markers off wherever a title
  is used as plain text, and the route registry applies it to every tab title, link preview, crumb,
  search entry and OG image. The blue is `--brand-blue` on light surfaces, sky on dark ones and
  `#9ad8ff` on the brand-blue band.

- **Surfaces.** `Section tone="paper" | "paper-2" | "dark" | "brand"`. Dark is deep navy with a
  faint grid and one soft light; brand is the full-bleed blue band. `sheet` makes a light section
  rise over the dark one above with rounded corners.
- **`.dark-vars`.** Inside it the same tokens (`--ink`, `--line`, `--paper` …) take dark values, so
  any component dropped onto a dark surface adapts without its own dark styles. The 2.5D scenes
  switch to a blueprint look there, with the live layer glowing.
- **Header.** Clear over the hero (logo, links and a search icon in white), a white floating bar
  once the page scrolls. Nav: Industries, Platform, Resources, Company. Case studies (`/customers`)
  sit in the Resources menu (and the footer's Resources column), and the Resources tab lights up on
  them. It carries no button: the call to action sits in the page and in the mobile menu.
- **Closing band.** `CTABand` runs full width, edge to edge into the footer, over footage.
- **Footer.** Opens with the newsletter (heading on the left, email field and consent line on the
  right), then the logo and link columns (Industries, Platform, Resources, Company, Contact), then
  the legal line with LinkedIn, X, YouTube and Facebook icons. Profile URLs live in
  `content/site.ts` → `social`; an icon without one shows dimmed and not linked (Facebook, for
  now). Linked profiles are also listed as `sameAs` in the organisation JSON-LD.
  Brand icons are from Font Awesome Free (CC BY 4.0), in `components/ui/icons.tsx`.
- **Homepage hero.** The headline alone, set very large at the foot of the footage, with the call
  to action beneath it as a line of type and a round arrow (`variant="statement"` on `HeroVideo`).
  Industry pages keep the fuller hero.
- **Industry tiles** are photo cards using each industry's poster frame.
- **Headlines** pick out their last phrase in the accent colour (`Accent` in `components/ui/rich.tsx`).
- **Product mock-ups** are dark panels (`components/mockups/Mock.tsx`).

## The detailed 2.5D illustrations

The homepage has two detailed isometric vector illustrations: the plant beside "Your
operation is talking. Nobody is listening. But AOne does.", and the site in "Sense. See. Decide.
Act.". They are not drawn by hand: each plant is modelled as solids and drawn as vector art by a
small exporter, so it can be changed or extended by editing the model.

| File | What it holds |
| --- | --- |
| `illustrations/model/kit.ts` | The palette (top, left and right tone per material) and the primitives. |
| `illustrations/model/props.ts` | The equipment: cold room, CNC machines, robot, conveyor, compressor, receiver, chiller, racking, truck, forklift, kitchen block, generator, transformer, switchboard, people, trees, and the AOne sensors, cameras and gateway. |
| `illustrations/model/site.ts` | The site layout and the AOne layer (devices, data lines, alert, engineer). |
| `illustrations/model/ops.ts` | The plant for the problem section: one bay with a zone per problem (office lights and AC, Compressor 2, Cold Room 2, the packing line and its Vision AI camera, the audit points), each AOne device wired to one gateway, and named anchors the page zooms to and pins labels on. |
| `illustrations/export.ts` | The exporter: isometric projection, back-to-front ordering, flat three-tone shading, shadows. |
| `scripts/build-illustrations.ts` | Runs the export. |
| `components/iso/LayeredVector.tsx`, `SiteVector.tsx`, `OpsVector.tsx` | Put the layers on the page. |
| `components/sections/home/ProblemExplorer.tsx` | The five problems as tabs, and the plant telling each one's story: the view zooms in on the zone, labels are pinned to the machine, and the dashboard card follows. Stories run 9 s each and advance on their own while on screen, until a visitor picks one (styles: `.ops` in `app/globals.css`). Copy in `content/home.ts` → `problem`. |

```bash
npm run build:illustrations   # after any change under illustrations/
```

- The output is committed: static layers in `public/illustrations/{site,ops}-*.svg` (plus
  `site.svg` and `ops.svg`, each whole picture in one file) and the animated layers in
  `illustrations/generated/{site,ops}.json`.
- The plant itself is plain SVG images, so it adds nothing to the DOM. Only the AOne layer is
  inline SVG, so CSS can drive it: the site from `data-step` ("The home scene's four states" in
  `app/globals.css`), the problem plant from its own loop. Without scripts, or with reduced motion,
  each shows its end state.
- three.js is a dev dependency used only as a scene graph at build time. Nothing 3D ships to the
  browser.
- Two modelling rules keep the drawing order sound: parts must not sit inside one another, and
  nothing static should stand in front of a device (the build prints the layer count; the homepage
  scene is four layers).
- The industry pages' operation maps are still the simpler 2.5D drawings
  (`components/iso/scenes.ts`). The same kit and equipment can redraw them at this level of detail.

## Decisions worth knowing

- `--ink-3` is `#666C7B`, not the brief's `#8A90A0`, which is 3.2:1 on white and fails WCAG AA for
  the captions it is used for. Small blue text uses `--brand-blue-ink` for the same reason.
- The hero is `100svh` at every width. The brief asks for `88svh` on phones, but the hero copy at
  the specified type scale is already taller than that, and a hero hovering around viewport height
  lets the late-starting video replace the poster as the LCP element.
- Smooth scrolling (Lenis) runs on pointer devices only, and never with `prefers-reduced-motion`.
- Blog posts are placeholders and are `noindex` and left out of the sitemap until they have content.
- The homepage's "Why Atsuya" section (brief §6) is now "Our impact": reach as one sentence, then
  food waste, CO₂ and water as large figures, on the light grey band. The figures Atsuya supplied are recorded in
  `content/home.ts` and shown rounded down in international units (e.g. 1,10,662 t → "110,000+
  tonnes"). Its old points moved or were already on the page: 2,400/hr is in the proof band. The
  homepage no longer has a customer stories section; the case studies are in the Resources menu.
