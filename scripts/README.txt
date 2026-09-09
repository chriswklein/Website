IMAGE BUILD TOOL
================

Converts raw PNG/JPG image exports into the site's WebP images: a
thumbnail (what every page visitor loads) and a "-full" high-resolution
version (only loaded when a visitor opens the image viewer).


EXPORTING FROM FIGMA
---------------------

Export as PNG, not JPG, at 2x scale. PNG avoids Figma's own JPG
compression stacking with this tool's WebP compression, which shows up
as extra artifacts on text and UI edges.


WHERE TO PUT RAW EXPORTS
-------------------------

Drop exports into:

    raw-exports/

...mirroring the folder path they should land in under assets/images/.

Example:
    raw-exports/entries/work/star-engine/example.png
  becomes:
    assets/images/entries/work/star-engine/example.webp
    assets/images/entries/work/star-engine/example-full.webp

The path has to match, because the tool derives the output location
directly from where the raw file sits under raw-exports/ — it does not
read or ask for a destination.

raw-exports/ is git-ignored. Raw exports are source material, not part
of the deployed site.


FILENAME MUST MATCH THE EXISTING <img> TAG
--------------------------------------------

This tool only overwrites images already referenced by an entry's HTML
<img> tag — it does not create new <img> tags. Name your raw export
exactly what the existing image file is already called (same name,
different extension), or the site's HTML will keep pointing at the old
file.


RUNNING IT
-----------

One-time setup (only if you haven't already):

    npm install

Then, every time you have new raw exports to convert:

    node scripts/build-images.js


WHAT YOU GET
-------------

For every raw-exports/path/to/name.png (or .jpg/.jpeg), you get two
files in assets/images/path/to/:

    name.webp       <- thumbnail, quality 80, max width 800px
    name-full.webp  <- high-res, quality 80, max width 1600px (2x thumbnail)

Smaller sources are left at their own size, never upscaled.


CHANGING THE DEFAULTS
-----------------------

All of the above (widths, quality, raw-exports location, output
location, accepted file extensions) live in one CONFIG object at the
top of build-images.js: RAW_DIR, OUTPUT_DIR, THUMBNAIL_WIDTH,
HIGH_RES_SCALE, QUALITY, RAW_EXTENSIONS.
