import { WireframeElement, Framework, ElementType } from './types';

function indent(str: string, level: number) {
  return str.split('\n').map(l => '  '.repeat(level) + l).join('\n');
}

function toReactStyle(el: WireframeElement): string {
  const s: Record<string, string | number> = {
    position: 'absolute',
    left: el.x,
    top: el.y,
    width: el.width,
    height: el.height,
    backgroundColor: el.fillColor,
    borderRadius: el.borderRadius,
    opacity: el.opacity,
  };
  if (el.strokeColor && el.strokeColor !== 'transparent') s.border = `1px solid ${el.strokeColor}`;
  if (el.fontSize) s.fontSize = el.fontSize;
  return JSON.stringify(s, null, 2);
}

function toCSSProps(el: WireframeElement): string {
  const lines = [
    `position: absolute;`,
    `left: ${el.x}px;`,
    `top: ${el.y}px;`,
    `width: ${el.width}px;`,
    `height: ${el.height}px;`,
    `background-color: ${el.fillColor};`,
    `border-radius: ${el.borderRadius}px;`,
    `opacity: ${el.opacity};`,
  ];
  if (el.strokeColor && el.strokeColor !== 'transparent') lines.push(`border: 1px solid ${el.strokeColor};`);
  if (el.fontSize) lines.push(`font-size: ${el.fontSize}px;`);
  return lines.join('\n  ');
}

function elClassName(el: WireframeElement): string {
  return `el-${el.type}-${el.id.slice(-4)}`;
}

function getJSXContent(el: WireframeElement): string {
  switch (el.type) {
    case 'text': return `<p>${el.text || 'Text'}</p>`;
    case 'button': return `<button>${el.text || 'Button'}</button>`;
    case 'input': return `<input placeholder="${el.text || 'Enter text...'}" />`;
    case 'image': return `<img src="/placeholder.png" alt="placeholder" />`;
    case 'navbar': return `<nav>\n  <div className="logo">Logo</div>\n  <ul>\n    <li><a href="#">Home</a></li>\n    <li><a href="#">About</a></li>\n    <li><a href="#">Contact</a></li>\n  </ul>\n</nav>`;
    case 'hero': return `<section>\n  <h1>Welcome</h1>\n  <p>Your hero description here</p>\n  <button>Get Started</button>\n</section>`;
    case 'card': return `<div className="card">\n  <h3>Card Title</h3>\n  <p>Card content goes here</p>\n</div>`;
    case 'footer': return `<footer>\n  <p>&copy; 2026 Your Company</p>\n</footer>`;
    case 'login-form': return `<form>\n  <h2>Login</h2>\n  <input type="email" placeholder="Email" />\n  <input type="password" placeholder="Password" />\n  <button type="submit">Sign In</button>\n</form>`;
    case 'signup-form': return `<form>\n  <h2>Sign Up</h2>\n  <input placeholder="Full Name" />\n  <input type="email" placeholder="Email" />\n  <input type="password" placeholder="Password" />\n  <input type="password" placeholder="Confirm Password" />\n  <button type="submit">Create Account</button>\n</form>`;
    case 'search-bar': return `<div className="search-bar">\n  <input type="search" placeholder="${el.text || 'Search...'}" />\n</div>`;
    case 'modal': return `<div className="modal">\n  <div className="modal-header">\n    <h3>${el.text || 'Modal'}</h3>\n    <button>&times;</button>\n  </div>\n  <div className="modal-body"><p>Content</p></div>\n  <div className="modal-footer">\n    <button>Cancel</button>\n    <button>Save</button>\n  </div>\n</div>`;
    case 'pricing-card': return `<div className="pricing-card">\n  <h3>Pro Plan</h3>\n  <p className="price">$29/mo</p>\n  <ul>\n    <li>Feature 1</li>\n    <li>Feature 2</li>\n    <li>Feature 3</li>\n  </ul>\n  <button>Subscribe</button>\n</div>`;
    case 'testimonial': return `<div className="testimonial">\n  <p>"Great product!"</p>\n  <div className="author">— John Doe</div>\n</div>`;
    case 'contact-form': return `<form>\n  <h2>Contact Us</h2>\n  <input placeholder="Name" />\n  <input type="email" placeholder="Email" />\n  <textarea placeholder="Message"></textarea>\n  <button type="submit">Send</button>\n</form>`;
    case 'table': return `<table>\n  <thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead>\n  <tbody>\n    <tr><td>John</td><td>john@mail.com</td><td>Admin</td></tr>\n    <tr><td>Jane</td><td>jane@mail.com</td><td>User</td></tr>\n  </tbody>\n</table>`;
    case 'tabs': return `<div className="tabs">\n  <button className="active">Tab 1</button>\n  <button>Tab 2</button>\n  <button>Tab 3</button>\n</div>`;
    case 'accordion': return `<div className="accordion">\n  <details open>\n    <summary>Section 1</summary>\n    <p>Content for section 1</p>\n  </details>\n  <details>\n    <summary>Section 2</summary>\n    <p>Content for section 2</p>\n  </details>\n</div>`;
    case 'alert': return `<div className="alert">${el.text || 'Alert message'}</div>`;
    case 'checkbox': return `<label><input type="checkbox" /> Option</label>`;
    case 'radio': return `<label><input type="radio" name="group" /> Option</label>`;
    case 'toggle': return `<label className="toggle"><input type="checkbox" /><span className="slider"></span></label>`;
    case 'progress': return `<div className="progress-bar"><div className="progress-fill" style={{width: '60%'}}></div></div>`;
    case 'badge': return `<span className="badge">${el.text || 'Badge'}</span>`;
    case 'video-player': return `<div className="video-player">\n  <div className="play-button">▶</div>\n</div>`;
    case 'cta-section': return `<section className="cta">\n  <h2>Ready to get started?</h2>\n  <p>Join thousands of users today.</p>\n  <button>Start Free Trial</button>\n</section>`;
    case 'stats-section': return `<div className="stats">\n  <div><h3>10K+</h3><p>Users</p></div>\n  <div><h3>500+</h3><p>Projects</p></div>\n  <div><h3>99%</h3><p>Uptime</p></div>\n</div>`;
    case 'faq-section': return `<div className="faq">\n  <h2>FAQ</h2>\n  <details><summary>Question 1?</summary><p>Answer 1</p></details>\n  <details><summary>Question 2?</summary><p>Answer 2</p></details>\n</div>`;
    // Mobile
    case 'mobile-status-bar': return `<div className="status-bar">\n  <span>9:41</span>\n  <span>📶 🔋</span>\n</div>`;
    case 'mobile-tab-bar': return `<div className="tab-bar">\n  <button>Home</button>\n  <button>Search</button>\n  <button>Profile</button>\n</div>`;
    case 'mobile-app-bar': return `<div className="app-bar">\n  <button>←</button>\n  <h1>${el.text || 'Title'}</h1>\n  <button>⋮</button>\n</div>`;
    case 'mobile-fab': return `<button className="fab">${el.text || '+'}</button>`;
    case 'mobile-list-item': return `<div className="list-item">\n  <div className="avatar"></div>\n  <div>\n    <p className="title">${el.text || 'List Item'}</p>\n    <p className="subtitle">Subtitle text</p>\n  </div>\n</div>`;
    case 'mobile-chip': return `<span className="chip">${el.text || 'Chip'}</span>`;
    case 'mobile-bottom-sheet': return `<div className="bottom-sheet">\n  <div className="handle"></div>\n  <div className="content"><p>Sheet content</p></div>\n</div>`;
    case 'mobile-card': return `<div className="mobile-card">\n  <div className="image-placeholder"></div>\n  <h3>Title</h3>\n  <p>Description</p>\n</div>`;
    case 'mobile-search': return `<div className="search-field">\n  <span>🔍</span>\n  <input placeholder="${el.text || 'Search...'}" />\n</div>`;
    case 'mobile-snackbar': return `<div className="snackbar">\n  <span>${el.text || 'Action completed'}</span>\n  <button>Undo</button>\n</div>`;
    default: return `<div></div>`;
  }
}

function getRNContent(el: WireframeElement): string {
  switch (el.type) {
    case 'text': return `<Text style={styles.text}>${el.text || 'Text'}</Text>`;
    case 'button': return `<TouchableOpacity style={styles.button}>\n  <Text style={styles.buttonText}>${el.text || 'Button'}</Text>\n</TouchableOpacity>`;
    case 'input': return `<TextInput style={styles.input} placeholder="${el.text || 'Enter text...'}" />`;
    case 'image': return `<Image source={{uri: 'https://via.placeholder.com/200'}} style={styles.image} />`;
    case 'mobile-status-bar': return `<StatusBar barStyle="dark-content" />`;
    case 'mobile-tab-bar': return `<View style={styles.tabBar}>\n  <TouchableOpacity><Text>Home</Text></TouchableOpacity>\n  <TouchableOpacity><Text>Search</Text></TouchableOpacity>\n  <TouchableOpacity><Text>Profile</Text></TouchableOpacity>\n</View>`;
    case 'mobile-app-bar': return `<View style={styles.appBar}>\n  <TouchableOpacity><Text>←</Text></TouchableOpacity>\n  <Text style={styles.title}>${el.text || 'Title'}</Text>\n  <TouchableOpacity><Text>⋮</Text></TouchableOpacity>\n</View>`;
    case 'mobile-fab': return `<TouchableOpacity style={styles.fab}>\n  <Text style={styles.fabText}>${el.text || '+'}</Text>\n</TouchableOpacity>`;
    case 'mobile-list-item': return `<View style={styles.listItem}>\n  <View style={styles.avatar} />\n  <View>\n    <Text style={styles.listTitle}>${el.text || 'List Item'}</Text>\n    <Text style={styles.listSubtitle}>Subtitle</Text>\n  </View>\n</View>`;
    case 'mobile-chip': return `<View style={styles.chip}><Text>${el.text || 'Chip'}</Text></View>`;
    case 'mobile-card': return `<View style={styles.card}>\n  <View style={styles.cardImage} />\n  <Text style={styles.cardTitle}>Title</Text>\n  <Text>Description</Text>\n</View>`;
    case 'mobile-search': return `<View style={styles.searchBar}>\n  <Text>🔍</Text>\n  <TextInput placeholder="${el.text || 'Search...'}" style={styles.searchInput} />\n</View>`;
    case 'card': return `<View style={styles.card}>\n  <Text style={styles.cardTitle}>Card</Text>\n  <Text>Content</Text>\n</View>`;
    default: return `<View style={styles.element} />`;
  }
}

export function generateReactCode(elements: WireframeElement[], projectName: string): Record<string, string> {
  const files: Record<string, string> = {};

  const componentJSX = elements.map(el => {
    return `      {/* ${el.type} */}\n      <div style={${toReactStyle(el)}}>\n${indent(getJSXContent(el), 4)}\n      </div>`;
  }).join('\n\n');

  files['src/App.tsx'] = `import React from 'react';
import './App.css';

function App() {
  return (
    <div className="app-container" style={{ position: 'relative', width: '100%', minHeight: '100vh' }}>
${componentJSX}
    </div>
  );
}

export default App;
`;

  files['src/App.css'] = `* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
.app-container { position: relative; }
button { cursor: pointer; border: none; padding: 8px 16px; border-radius: 8px; font-weight: 500; }
input, textarea { padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 8px; outline: none; }
input:focus, textarea:focus { border-color: #3b82f6; }
`;

  files['src/index.tsx'] = `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<React.StrictMode><App /></React.StrictMode>);
`;

  files['package.json'] = JSON.stringify({
    name: projectName.toLowerCase().replace(/\s+/g, '-'),
    version: '1.0.0',
    private: true,
    dependencies: {
      'react': '^18.2.0',
      'react-dom': '^18.2.0',
      'react-scripts': '5.0.1'
    },
    scripts: {
      start: 'react-scripts start',
      build: 'react-scripts build',
    }
  }, null, 2);

  files['public/index.html'] = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>${projectName}</title></head>
<body><div id="root"></div></body>
</html>`;

  files['README.md'] = `# ${projectName}\n\nGenerated by ResumeForge App Builder.\n\n## Getting Started\n\n\`\`\`bash\nnpm install\nnpm start\n\`\`\`\n`;

  return files;
}

export function generateReactNativeCode(elements: WireframeElement[], projectName: string): Record<string, string> {
  const files: Record<string, string> = {};

  const imports = new Set(['View', 'Text', 'StyleSheet']);
  elements.forEach(el => {
    if (el.type === 'button' || el.type === 'mobile-fab' || el.type === 'mobile-tab-bar' || el.type === 'mobile-app-bar' || el.type === 'mobile-list-item') imports.add('TouchableOpacity');
    if (el.type === 'input' || el.type === 'mobile-search') imports.add('TextInput');
    if (el.type === 'image') imports.add('Image');
    if (el.type === 'mobile-status-bar') imports.add('StatusBar');
  });

  const rnJSX = elements.map(el => `      {/* ${el.type} */}\n${indent(getRNContent(el), 3)}`).join('\n\n');

  const stylesObj: Record<string, Record<string, string | number>> = {
    container: { flex: 1, backgroundColor: '#ffffff' },
  };
  elements.forEach(el => {
    const key = `el_${el.id.slice(-6)}`;
    stylesObj[key] = {
      position: 'absolute',
      left: el.x,
      top: el.y,
      width: el.width,
      height: el.height,
      backgroundColor: el.fillColor,
      borderRadius: el.borderRadius,
      opacity: el.opacity,
    };
  });

  files['App.js'] = `import React from 'react';
import { ${Array.from(imports).join(', ')} } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
${rnJSX}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  text: { fontSize: 16, color: '#1e293b' },
  button: { backgroundColor: '#3b82f6', padding: 12, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, padding: 12 },
  image: { width: 200, height: 160, borderRadius: 8 },
  tabBar: { flexDirection: 'row', justifyContent: 'space-around', padding: 16, borderTopWidth: 1, borderColor: '#e2e8f0' },
  appBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  title: { fontSize: 18, fontWeight: '600' },
  fab: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#3b82f6', alignItems: 'center', justifyContent: 'center', position: 'absolute', bottom: 24, right: 24 },
  fabText: { color: '#fff', fontSize: 24 },
  listItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderColor: '#f1f5f9' },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#e2e8f0', marginRight: 12 },
  listTitle: { fontSize: 16, fontWeight: '500' },
  listSubtitle: { fontSize: 13, color: '#94a3b8' },
  chip: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#eff6ff', borderRadius: 999, borderWidth: 1, borderColor: '#3b82f6' },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 },
  cardImage: { height: 120, backgroundColor: '#f1f5f9', borderRadius: 12, marginBottom: 8 },
  cardTitle: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', borderRadius: 12, padding: 12 },
  searchInput: { flex: 1, marginLeft: 8 },
  element: { backgroundColor: '#e2e8f0' },
});
`;

  files['package.json'] = JSON.stringify({
    name: projectName.toLowerCase().replace(/\s+/g, '-'),
    version: '1.0.0',
    main: 'App.js',
    dependencies: {
      'react': '^18.2.0',
      'react-native': '^0.73.0',
      'expo': '^50.0.0'
    },
    scripts: { start: 'expo start' }
  }, null, 2);

  files['app.json'] = JSON.stringify({
    expo: {
      name: projectName,
      slug: projectName.toLowerCase().replace(/\s+/g, '-'),
      version: '1.0.0',
      platforms: ['ios', 'android'],
    }
  }, null, 2);

  files['README.md'] = `# ${projectName}\n\nGenerated by ResumeForge App Builder.\n\n## Getting Started\n\n\`\`\`bash\nnpm install\nnpx expo start\n\`\`\`\n`;

  return files;
}

export function generateHTMLCode(elements: WireframeElement[], projectName: string): Record<string, string> {
  const files: Record<string, string> = {};

  const cssRules = elements.map(el => {
    const cn = elClassName(el);
    return `.${cn} {\n  ${toCSSProps(el)}\n}`;
  }).join('\n\n');

  const htmlEls = elements.map(el => {
    const cn = elClassName(el);
    const content = getJSXContent(el).replace(/className=/g, 'class=').replace(/style=\{\{[^}]+\}\}/g, '');
    return `    <div class="${cn}">\n${indent(content, 3)}\n    </div>`;
  }).join('\n\n');

  files['index.html'] = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${projectName}</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <div class="app-container">
${htmlEls}
  </div>
  <script src="script.js"></script>
</body>
</html>`;

  files['styles.css'] = `* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
.app-container { position: relative; width: 100%; min-height: 100vh; }
button { cursor: pointer; border: none; padding: 8px 16px; border-radius: 8px; font-weight: 500; }
input, textarea { padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 8px; outline: none; }
input:focus, textarea:focus { border-color: #3b82f6; }

${cssRules}
`;

  files['script.js'] = `// ${projectName} - Interactive scripts
document.addEventListener('DOMContentLoaded', () => {
  console.log('${projectName} loaded successfully!');
  
  // Add your interactive JavaScript here
});
`;

  files['README.md'] = `# ${projectName}\n\nGenerated by ResumeForge App Builder.\n\n## Getting Started\n\nOpen \`index.html\` in your browser.\n`;

  return files;
}

export function generateCode(elements: WireframeElement[], framework: Framework, projectName: string): Record<string, string> {
  switch (framework) {
    case 'react': return generateReactCode(elements, projectName);
    case 'react-native': return generateReactNativeCode(elements, projectName);
    case 'html': return generateHTMLCode(elements, projectName);
  }
}
