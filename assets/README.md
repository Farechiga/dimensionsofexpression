# Assets

Drop local study images in `assets/private/`.

Those files are ignored by Git so copyrighted or private reference frames do not get pushed by accident. To make an image appear in the app, add it to `assets/manifest.json`.

Example:

```json
{
  "id": "anna-recognition",
  "title": "Anna - recognition",
  "src": "./assets/private/anna-recognition.png",
  "rightsMode": "local-study",
  "notes": "Private local reference; do not commit source frame."
}
```

Public demo images can live elsewhere under `assets/` if they are generated, public-domain, or permissively licensed.
