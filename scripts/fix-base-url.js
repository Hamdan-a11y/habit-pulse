const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '../dist');

function fixHtmlFiles(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      fixHtmlFiles(fullPath);
    } else if (file.endsWith('.html')) {
      let content = fs.readFileSync(fullPath, 'utf8');

      // Prefix absolute root paths with /habit-pulse
      content = content.replace(/href="\/_expo/g, 'href="/habit-pulse/_expo');
      content = content.replace(/src="\/_expo/g, 'src="/habit-pulse/_expo');
      content = content.replace(/href="\/favicon/g, 'href="/habit-pulse/favicon');

      fs.writeFileSync(fullPath, content);
      console.log('Fixed asset subpaths in:', fullPath);
    }
  }
}

fixHtmlFiles(distDir);
