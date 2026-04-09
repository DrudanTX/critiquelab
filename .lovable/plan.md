

## Plan: Add Google Analytics (gtag.js) to the Site

Add the Google Analytics tag to `index.html` right after the `<head>` tag. Since this is a single-page app, there's only one HTML file — all pages will be covered.

### Change
- **`index.html`** — Insert the gtag.js snippet immediately after `<head>`:
  ```html
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-B7NRQYHTT1"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-B7NRQYHTT1');
  </script>
  ```

One file, one edit.

