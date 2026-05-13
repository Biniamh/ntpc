const fs = require('fs');
const path = require('path');

for (const file of ['package-lock.json', 'yarn.lock']) {
  const fullPath = path.resolve(__dirname, '..', file);
  if (fs.existsSync(fullPath)) {
    try {
      fs.unlinkSync(fullPath);
    } catch (err) {
      // ignore failures
    }
  }
}

const ua = process.env.npm_config_user_agent || '';
if (!/^pnpm\//.test(ua)) {
  console.error('Use pnpm instead');
  process.exit(1);
}
