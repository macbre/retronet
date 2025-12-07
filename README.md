# retronet
Repository for rendering a retro view of sites snapshots taken from Wayback Machine

## Steps

1. Pick a URL to render and go to web.archive.org.
1. Copy the URL, e.g. <https://web.archive.org/web/20061125065658/http://www.reddit.com/>.
1. Paste the URL into the `screenshot.mjs` script and run it -> the `web_archive_<domain>_<hash>.png` file will be created with a screenshot of the web-archived page.
1. Now, run the `retronet.mjs` script -> it will render the retro web UI view of the above screenshot and store it in the `retronet.png` file.
1. Done :-)
