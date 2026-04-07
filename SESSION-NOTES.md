# YKS Session Notes

## Restarting locally

Use this when reopening the project:

```bash
cd /Users/Marky/yks
rm -rf .next
NEXT_DISABLE_WEBPACK_CACHE=1 npm run dev
```

Then open:

```text
http://localhost:3000
```

## Current status

- Main branch is the working branch.
- We had repeated local Next.js cache corruption, so the stable local workflow is to clear `.next` and run with `NEXT_DISABLE_WEBPACK_CACHE=1`.
- A custom `404` page has been added.
- The `About` section exists as a modal on the homepage, not as a standalone route.
- `robots.txt` and `sitemap.xml` are in `public/`.
- Canonical metadata is set to `https://yks.works`.

## Current brand assets

- Main YKS site asset in use: `public/yks-full.png`
- Generated favicon files:
  - `public/favicon.png`
  - `public/favicon.ico`
- Share card in use:
  - `public/share-card.png`

## Current references

- Homepage YKS mark: `app/page.tsx`
- 404 YKS mark: `app/not-found.tsx`
- Site icons/favicons: `app/layout.tsx`
- Email signature image URL:
  - `https://www.yks.works/yks-full.png`

## Content and UI changes completed

- Reordered projects so `Joined At The Chip` appears before `The Bank Built For You`.
- Updated project modal typography and colors:
  - project title purple
  - subheading blue
  - body copy black
- Added support for:
  - project subtitles
  - project credits
  - section-level media headings and credits
- Updated project copy across the site.
- Fixed broken image extensions for `The Bank Built For You`.
- Added linked credits for named collaborators.
- Added fixed `About` trigger top-right.
- Added mobile spacing/layout improvements for project titles and client names.
- Made hover previews responsive for narrower desktop widths.
- Simplified 404 copy to:
  - `Page not found.`
  - `Back to home.`
- Increased `About` and `hello@yks.works` sizing by about 20%.

## Email signature

File:

```text
email-signature-mark-day.html
```

Notes:

- Signature image points directly to:
  - `https://www.yks.works/yks-full.png`
- Phone link markup was cleaned up.

## Launch / QA reminders

- Check homepage on desktop and mobile.
- Open every project modal once and confirm all media loads.
- Test the `About` modal on desktop and mobile.
- Test a fake URL for the 404 page.
- Check favicon and share card after deploy.
- Confirm the signature image URL loads publicly.

## Useful prompt for next session

If needed, paste something like this:

```text
We are continuing work on the YKS site in /Users/Marky/yks.
Please read SESSION-NOTES.md first, assume the current local dev workflow is:
cd /Users/Marky/yks && rm -rf .next && NEXT_DISABLE_WEBPACK_CACHE=1 npm run dev
Then help me continue from the latest state.
```
