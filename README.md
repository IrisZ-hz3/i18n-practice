# i18n Practice

This repo contains a small English storefront intentionally filled with
internationalization and localization defects for practice.

## Included bug patterns

- Hard-coded English text across the page
- U.S.-only date formats such as `04/30/2026`
- Currency forced to `en-US` and `USD`
- Fixed-width buttons that truncate longer translations
- Uppercase styling that breaks language expectations
- String concatenation in the trip planner
- U.S.-centric address and ZIP code fields
- Left-to-right layout assumptions for Arabic

## Run locally

Open `index.html` directly in a browser, or serve the folder with a static file
server such as:

```bash
python3 -m http.server 8000
```

# i18n Practice
