# SSN Sandhai

A responsive English/Tamil heritage website, prepared for deployment on Vercel. Static HTML, CSS and JavaScript modules; no third-party runtime dependencies, database or admin panel.

## Run locally

Use Node.js 20 or later.

```sh
npm run dev
```

Open http://127.0.0.1:5173. Production build and checks:

```sh
npm run build
npm test
```

Tests cover bilingual content, links to local assets, the full Saaral feature, rendering every public route, the language switch, archive filtering and a complete quiz attempt. The interaction tests use a lightweight document stub; they do not replace browser visual testing.

## Deploy to Vercel

Import **Starry-Light/ssandhai** into Vercel. Choose **Other** as the framework, build command **npm run build**, and output directory **dist**. The included vercel.json supplies these settings and supports direct visits to article and other page URLs. No environment variables are required.

## Edit content

- **src/content.js**: categories, sample stories, event announcements, club descriptions, gallery, quiz, contact details and logo paths.
- **src/saaral-story.js**: the complete supplied Saaral feature, with a Tamil translation. The standalone stray word “canvas” was removed from the supplied copy.
- **styles.css**: colours, layout, typography and responsive rules.
- **assets/**: illustrations, future photographs, logos and media.

Use `bi('English text', 'தமிழ் உரை')` for visitor-facing copy. Add entries in code and redeploy. The site remembers language preference locally; no visitor data is sent to a backend.

The People section remains on hold. Team profiles and testimonials are not published. The approved mission and vision are in `purpose` in src/content.js; the homepage introduces the vision and the About page presents the full vision and six mission points. Event examples and sample editorial entries are labelled. Saaral's upcoming event has no invented date, venue or registration. Product pages are informational showcases with no checkout.

## Logos

The left SSN and right Sandhai logo positions are ready. The current SSN SVG is a temporary text approximation; the right Sandhai wordmark is a typographic placeholder, not an official logo. Replace these before public launch:

1. Save the official supplied SSN image as **assets/ssn-logo.png** and change `settings.ssnLogo` in src/content.js.
2. Save the official Sandhai logo and set `settings.sandhaiLogo` to its path.

The original SSN attachment could not be downloaded from the restricted build environment, so it is not represented as an official image in this source.

## Photos and multimedia

All current artwork is local SVG illustration. The archive explicitly labels it as a placeholder rather than historical photography. To use a photo, save it in assets and set an entry's or gallery item's `art` field to its absolute asset path, for example `/assets/saaral-performance.jpg`. Use its bilingual title as descriptive alt text.

Articles accept an optional `media` array:

```js
media: [{
  type: 'video', // or 'audio'
  src: '/assets/interview.mp4',
  poster: '/assets/interview-poster.jpg',
  caption: bi('A conversation about Saaral', 'சாரல் பற்றிய உரையாடல்'),
  transcript: bi('English transcript…', 'தமிழ் எழுத்துப்பதிவு…'),
  tracks: [
    { src: '/assets/interview-en.vtt', lang: 'en', label: 'English' },
    { src: '/assets/interview-ta.vtt', lang: 'ta', label: 'தமிழ்' }
  ]
}]
```

Publish media only with contributor permission. Include captions for video and transcripts for spoken media. Large videos can use an HTTPS media URL.

Set `settings.contactEmail`, `settings.socialLinks`, and each club's `url` when approved official details are available. Until then the site explains that contact information is forthcoming; it has no nonfunctional submission forms.

Google Fonts is an optional external enhancement; system and Tamil font fallbacks keep the site usable when it is unavailable.

## Before launch

Replace the two logo placeholders; review Tamil translations with the team; add approved contact details and photographs; replace or approve remaining sample content; check the deployed site visually at desktop and mobile sizes.
