const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const axe = require('axe-core');

async function runA11yOnFile(filePath) {
  const html = fs.readFileSync(filePath, 'utf8');
  const dom = new JSDOM(html, { runScripts: 'dangerously' });

  // Inject axe source into the JSDOM window so window.axe is available
  try {
    dom.window.eval(axe.source);
  } catch (err) {
    console.error('Failed to inject axe into JSDOM for', filePath, err);
    throw err;
  }

  const options = {
    // keep defaults; teams can customize rules later
  };

  const results = await dom.window.axe.run(dom.window.document, options);
  return results;
}

(async () => {
  const pagesDir = path.join(__dirname, 'pages');
  const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.html'));

  let totalViolations = 0;
  for (const file of files) {
    const fullPath = path.join(pagesDir, file);
    console.log(`Running a11y checks on ${file}...`);
    try {
      const results = await runA11yOnFile(fullPath);
      if (results.violations && results.violations.length) {
        console.log(`
Accessibility violations for ${file}: ${results.violations.length}\n`);
        results.violations.forEach(v => {
          console.log(`- [${v.id}] ${v.help} (impact: ${v.impact})\n  Help: ${v.helpUrl}`);
          v.nodes.forEach((n, i) => {
            console.log(`    ${i + 1}) Target: ${n.target.join(', ')}\n       HTML: ${n.html.slice(0, 300).replace(/\n/g, '')}`);
          });
          console.log('');
        });
        totalViolations += results.violations.length;
      } else {
        console.log(`No violations found for ${file}.`);
      }
    } catch (err) {
      console.error(`Error running axe on ${file}:`, err);
      process.exitCode = 2;
      return;
    }
  }

  if (totalViolations > 0) {
    console.error(`\nA11y checks failed: ${totalViolations} violation(s) found.`);
    process.exitCode = 1;
  } else {
    console.log('\nA11y checks passed. No violations found.');
  }
})();
