#!/usr/bin/env node
// Batch-converts raw image exports into the site's two-tier WebP system:
// a thumbnail (inline, page-weight-friendly) and a `-full` high-resolution
// variant (loaded only when the image viewer opens that image — see
// initImageViewer() in script.js). Run directly, no Claude Code needed:
//
//   npm install         (one-time — installs sharp, listed in package.json)
//   node scripts/build-images.js
//
// Drop raw PNG/JPG exports into raw-exports/, mirroring the folder
// structure they should land in under assets/images/ (RAW_DIR/OUTPUT_DIR
// below) — e.g. raw-exports/entries/work/star-engine/example.png produces
// assets/images/entries/work/star-engine/example.webp (thumbnail) and
// .../example-full.webp (high-res). raw-exports/ is git-ignored: raw
// exports are source material, not something the deployed site should ship.
//
// Optional argument: scope the run to one subfolder of raw-exports/ instead
// of processing everything underneath it —
//
//   node scripts/build-images.js entries/work/this-website
//
// With no argument, behavior is unchanged: every raw image under
// raw-exports/ is processed, exactly as before this argument existed.

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// ---- Config — the only place these values live ----
const CONFIG = {
    RAW_DIR: path.join(__dirname, '..', 'raw-exports'),
    OUTPUT_DIR: path.join(__dirname, '..', 'assets', 'images'),
    THUMBNAIL_WIDTH: 800,   // matches the site's existing thumbnail convention (confirmed via real file metadata)
    HIGH_RES_SCALE: 2,      // -full variant's width = THUMBNAIL_WIDTH * HIGH_RES_SCALE
    QUALITY: 80,
    RAW_EXTENSIONS: ['.png', '.jpg', '.jpeg'],
};

function formatBytes(bytes) {
    return `${(bytes / 1024).toFixed(1)} KB`;
}

function findRawImages(dir) {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir, { recursive: true, withFileTypes: true })
        .filter(entry => entry.isFile() && CONFIG.RAW_EXTENSIONS.includes(path.extname(entry.name).toLowerCase()))
        .map(entry => path.join(entry.parentPath ?? entry.path, entry.name));
}

// Resolves both the thumbnail and -full output paths for one raw input,
// and confirms neither escapes OUTPUT_DIR (defensive — a raw filename
// would have to contain "../" for this to ever trip, but a batch tool
// that writes files is worth guarding regardless of how unlikely).
function resolveOutputPaths(rawPath) {
    const relative = path.relative(CONFIG.RAW_DIR, rawPath);
    const relativeNoExt = relative.slice(0, -path.extname(relative).length);

    const thumbPath = path.resolve(CONFIG.OUTPUT_DIR, `${relativeNoExt}.webp`);
    const fullPath = path.resolve(CONFIG.OUTPUT_DIR, `${relativeNoExt}-full.webp`);
    const outputRoot = path.resolve(CONFIG.OUTPUT_DIR);

    if (!thumbPath.startsWith(outputRoot + path.sep) || !fullPath.startsWith(outputRoot + path.sep)) {
        throw new Error(`Refusing to write outside OUTPUT_DIR for: ${rawPath}`);
    }
    return { thumbPath, fullPath };
}

async function convertOne(rawPath) {
    const { thumbPath, fullPath } = resolveOutputPaths(rawPath);
    fs.mkdirSync(path.dirname(thumbPath), { recursive: true });

    const rawSize = fs.statSync(rawPath).size;

    // withoutEnlargement: a raw export smaller than the target width is
    // left at its own size rather than upscaled and softened.
    await sharp(rawPath)
        .resize({ width: CONFIG.THUMBNAIL_WIDTH, withoutEnlargement: true })
        .webp({ quality: CONFIG.QUALITY })
        .toFile(thumbPath);

    await sharp(rawPath)
        .resize({ width: CONFIG.THUMBNAIL_WIDTH * CONFIG.HIGH_RES_SCALE, withoutEnlargement: true })
        .webp({ quality: CONFIG.QUALITY })
        .toFile(fullPath);

    const thumbSize = fs.statSync(thumbPath).size;
    const fullSize = fs.statSync(fullPath).size;

    return { rawPath, thumbPath, fullPath, rawSize, thumbSize, fullSize };
}

// Resolves the optional CLI scope argument against RAW_DIR. Rejects a path
// that doesn't exist under raw-exports/ with a clear error rather than
// silently falling back to processing everything — a typo'd folder name
// should never turn into an unscoped full run.
function resolveScopeDir(scopeArg) {
    if (!scopeArg) return CONFIG.RAW_DIR;

    const scopeDir = path.resolve(CONFIG.RAW_DIR, scopeArg);
    const rawRoot = path.resolve(CONFIG.RAW_DIR);

    if (!scopeDir.startsWith(rawRoot + path.sep) && scopeDir !== rawRoot) {
        throw new Error(`Scope "${scopeArg}" resolves outside raw-exports/ — refusing to run.`);
    }
    if (!fs.existsSync(scopeDir) || !fs.statSync(scopeDir).isDirectory()) {
        throw new Error(`Scope "${scopeArg}" does not exist as a folder under ${CONFIG.RAW_DIR} — nothing was read or written.`);
    }
    return scopeDir;
}

async function main() {
    const scopeArg = process.argv[2];
    const scopeDir = resolveScopeDir(scopeArg);
    const rawImages = findRawImages(scopeDir);

    if (!rawImages.length) {
        console.log(`No raw images found in ${scopeDir}`);
        console.log(`(expects: ${CONFIG.RAW_EXTENSIONS.join(', ')})`);
        return;
    }

    console.log(`Found ${rawImages.length} raw image(s) in ${scopeDir}\n`);

    const results = [];
    for (const rawPath of rawImages) {
        const relative = path.relative(CONFIG.RAW_DIR, rawPath);
        try {
            const result = await convertOne(rawPath);
            results.push(result);
            console.log(`${relative}`);
            console.log(`  raw:   ${formatBytes(result.rawSize)}`);
            console.log(`  thumb: ${formatBytes(result.thumbSize)}  -> ${path.relative(CONFIG.OUTPUT_DIR, result.thumbPath)}`);
            console.log(`  full:  ${formatBytes(result.fullSize)}  -> ${path.relative(CONFIG.OUTPUT_DIR, result.fullPath)}`);
        } catch (err) {
            console.error(`${relative}: FAILED — ${err.message}`);
        }
    }

    const totalRaw = results.reduce((sum, r) => sum + r.rawSize, 0);
    const totalThumb = results.reduce((sum, r) => sum + r.thumbSize, 0);
    const totalFull = results.reduce((sum, r) => sum + r.fullSize, 0);

    console.log(`\n${results.length} of ${rawImages.length} converted`);
    console.log(`Total raw:   ${formatBytes(totalRaw)}`);
    console.log(`Total thumb: ${formatBytes(totalThumb)} (what every page visitor loads inline)`);
    console.log(`Total full:  ${formatBytes(totalFull)} (loaded only if/when a viewer opens that image)`);
}

main().catch(err => {
    console.error(err.message);
    process.exitCode = 1;
});
