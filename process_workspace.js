const fs = require('fs');
const path = require('path');

const indexHtmlPath = path.join(__dirname, 'index.html');
const lessonsDir = path.join(__dirname, 'lessons');

const orderedLessons = [
  "1-Plugin-Basics-and-Introduction.html",
  "2-Introduction-to-Plugin-Development-and-What-is-a-Plugin.html",
  "3-Plugin-Basics-Overview-and-Getting-Started.html",
  "4-Header-Requirements-and-DocBlock.html",
  "5-Activation-and-Deactivation-Hooks.html",
  "6-Best-Practices-and-Naming-Collisions.html",
  "7-Determining-Plugin-and-Content-Directories.html",
  "8-Software-License-and-Uninstall-Methods.html",
  "9-Plugin-Security-and-User-Capabilities.html",
  "10-Data-Validation-and-Input-Protection.html",
  "11-Nonces-and-CSRF-Protection.html",
  "12-Output-Escaping-and-Context-Security.html",
  "13-Data-Sanitization-and-Input-Cleaning.html",
  "14-Hooks-Overview-Actions-vs-Filters.html",
  "15-WordPress-Actions-and-Priority-Control.html",
  "16-WordPress-Filters-and-Data-Transformation.html",
  "17-Creating-Custom-Hooks-in-Plugins.html",
  "18-Advanced-Hooks-Topics-and-Debugging.html"
];

// 1. Process index.html
let indexContent = fs.readFileSync(indexHtmlPath, 'utf8');

if (!indexContent.includes('main.js')) {
  indexContent = indexContent.replace('</body>', '  <script src="main.js"></script>\n</body>');
  fs.writeFileSync(indexHtmlPath, indexContent, 'utf8');
  console.log('Updated index.html with main.js');
}

// 2. Process all lesson files in lessons directory
const allFiles = fs.readdirSync(lessonsDir).filter(f => f.endsWith('.html'));

allFiles.forEach(file => {
  const filePath = path.join(lessonsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Link main.css in <head> if not present
  if (!content.includes('main.css')) {
    content = content.replace('</head>', '  <link rel="stylesheet" href="../main.css" />\n</head>');
  }

  // Link main.js before </body> if not present
  if (!content.includes('main.js')) {
    content = content.replace('</body>', '  <script src="../main.js"></script>\n</body>');
  }

  const index = orderedLessons.indexOf(file);
  if (index !== -1) {
    const prevFile = index > 0 ? orderedLessons[index - 1] : null;
    const nextFile = index < orderedLessons.length - 1 ? orderedLessons[index + 1] : null;

    let btns = ['<div style="display: flex; gap: 10px; align-items: center;">'];
    if (prevFile) {
      btns.push(`      <a href="${prevFile}" onclick="if(window.parent && window.parent !== window){ window.parent.postMessage({type:'WP_COURSE_NAV', filename:'${prevFile}'}, '*'); }" class="nav-btn">➡️ الدرس السابق</a>`);
    }
    if (nextFile) {
      btns.push(`      <a href="${nextFile}" onclick="if(window.parent && window.parent !== window){ window.parent.postMessage({type:'WP_COURSE_NAV', filename:'${nextFile}'}, '*'); }" class="nav-btn">الدرس التالي ⬅️</a>`);
    }
    btns.push('    </div>');

    const btnsHtml = btns.join('\n');

    // Replace Top Nav
    if (content.includes('<nav class="top-nav">')) {
      content = content.replace(
        /<nav class="top-nav">[\s\S]*?<\/nav>/i,
        `<nav class="top-nav">\n    <span class="top-nav-brand">كورس تطوير إضافات ووردبريس الشامل</span>\n    ${btnsHtml}\n  </nav>`
      );
    }

    // Replace Footer
    if (content.includes('<footer class="lesson-footer">')) {
      content = content.replace(
        /<footer class="lesson-footer">[\s\S]*?<\/footer>/i,
        `<footer class="lesson-footer">\n      <div><strong>كورس تطوير إضافات ووردبريس الشامل</strong> - جميع الحقوق محفوظة</div>\n      ${btnsHtml}\n    </footer>`
      );
    }
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Processed ${file}`);
});
