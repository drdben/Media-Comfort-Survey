# Watching Together — Media Comfort Survey

A small survey for exploring how comfortable people feel watching entertainment clips alone or with different social groups. It collects each participant's name, so responses are identifiable to the researcher.

## Prepare the survey

1. Review the 11 clips in `clips.json` before inviting participants. Add or remove clips as needed and add content notes after previewing them.
2. Use a stable, unique `id` for each clip. Add its display `title`, URL, and an optional short `note` describing sensitive content.
3. Preview every clip and its platform embed before sharing the survey. YouTube links are embedded using YouTube's privacy-enhanced player. Reddit post links are embedded where Reddit allows it; other URLs open in a new tab.
4. Make sure your consent wording matches your institution's research requirements. The included short notice is a draft for a small, voluntary survey and does not replace any required ethics review or approved consent text.

Example `clips.json`:

```json
{
  "researchTitle": "Watching Together",
  "estimatedMinutes": 7,
  "clips": [
    {
      "id": "clip-01",
      "title": "Clip 1",
      "url": "https://www.youtube.com/shorts/VIDEO_ID",
      "note": "Contains strong language."
    },
    {
      "id": "clip-02",
      "title": "Clip 2",
      "url": "https://www.reddit.com/r/SUBREDDIT/comments/POST_ID/",
      "note": ""
    }
  ]
}
```

Each clip gets four 1–5 comfort ratings: on one's own, with parents, with children under 12 (or hypothetically), and with friends. Participants may skip individual ratings or an entire clip.

## Run locally

For the current survey, you can open `index.html` directly; the provided clip list is built in, so it also works when the browser blocks local `clips.json` access. If you edit `clips.json`, use the local server below so those edits load.

From the project folder:

```bash
../.venv/bin/python -m http.server 8000
```

Open `http://localhost:8000` in a browser. The local HTTP server lets the page load `clips.json`.

## Collect and combine responses

At completion, each participant downloads a JSON file containing their name and answers. Ask them to return that file to you using a method you choose. On the survey page, open **Researcher tools**, select all returned JSON files, then download a combined CSV for a spreadsheet. Import and export happen in the browser; files are not uploaded by this app.

This is a static, local-first tool. Publishing the page alone does not create a shared response database. The participant must return their downloaded response file to the researcher for it to be collected.
