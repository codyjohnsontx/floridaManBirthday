# Florida Man Birthday

A tiny web app that lets you pick your birthday and returns a matching **Florida Man** link.

## Run locally

```bash
python3 -m http.server 4173
```

Then open <http://localhost:4173>.

## Notes

- Uses month/day dropdowns and adapts day count for each month.
- Month/day options are included directly in HTML so dropdowns remain usable in strict preview environments.
- Uses a local `birthdays.json` file with an entry for every calendar day (including Feb 29).
- Displays a source link for the selected date.
