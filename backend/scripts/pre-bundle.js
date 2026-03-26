'use strict';

/**
 * Pre-bundle script for AdminJS components.
 * Run during Docker build (builder stage) to generate .adminjs/bundle.js
 * so the production server skips runtime rollup bundling.
 *
 * Usage: node scripts/pre-bundle.js
 */

// Must set NODE_ENV=production BEFORE requiring adminjs.
// router.js checks process.env.NODE_ENV at module load time.
// admin.initialize() also checks it to decide whether to run the bundler.
process.env.NODE_ENV = 'production';
process.env.ADMIN_JS_SKIP_BUNDLE = 'false';

const path = require('path');
const fs = require('fs');
const adminjs = require('adminjs');
const AdminJS = adminjs.default;
const { ComponentLoader } = adminjs;

// uploadFileFeature must be CALLED (not just imported) to trigger
// AdminJS.bundle() for the edit/list/show upload components.
// These calls happen inside buildFeature() in upload-file.feature.js,
// which executes only when uploadFileFeature(config) is invoked.
const uploadFileFeature = require('@adminjs/upload').default;

// LocalProvider checks that the bucket directory exists at instantiation time.
// Create it here so the script works both in Docker build and locally.
const uploadsDir = path.join(process.cwd(), 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });

uploadFileFeature({
  provider: {
    local: {
      bucket: path.join(process.cwd(), 'uploads'),
      opts: { baseUrl: '/uploads' },
    },
  },
  properties: {
    key: 'url',
    mimeType: 'mimeType',
  },
  uploadPath: (_record, filename) => `${Date.now()}-${filename}`,
});

async function run() {
  const componentLoader = new ComponentLoader();

  // Create minimal AdminJS instance (no TypeORM resources needed for bundling).
  // The upload components registered above via AdminJS.bundle() will be merged
  // from AdminJS.__unsafe_staticComponentLoader into componentLoader during
  // admin.initialize() → generateUserComponentEntry → __unsafe_merge().
  const admin = new AdminJS({
    componentLoader,
    resources: [],
  });

  console.log('[pre-bundle] Generating AdminJS bundle...');

  // Writes the bundle to .adminjs/bundle.js (ADMIN_JS_TMP_DIR, default ".adminjs")
  await admin.initialize();

  console.log('[pre-bundle] Done! .adminjs/bundle.js is ready.');
}

run().catch((err) => {
  console.error('[pre-bundle] Failed to generate bundle:', err);
  process.exit(1);
});
