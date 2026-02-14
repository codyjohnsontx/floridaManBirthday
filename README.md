# Florida Man Birthday

A tiny web app that lets you pick your birthday and returns a matching **Florida Man** headline.

## Run locally

```bash
python3 -m http.server 4173
```

Then open <http://localhost:4173>.

## Notes

- Uses month/day dropdowns and adapts day count for each month.
- Month/day options are included directly in HTML so dropdowns remain usable in strict preview environments.
- Attempts multiple known Florida Man API endpoints for compatibility.
- Displays a source link when the API returns one.
