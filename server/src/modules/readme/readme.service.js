/**
 * Template-based README generator.
 * No AI required — creates a professional README from user-provided form data.
 */
function generateReadme(data) {
  const {
    projectName = 'My Project',
    tagline = '',
    description = '',
    features = [],
    techStack = [],
    installation = '',
    usage = '',
    author = '',
    githubUsername = '',
    license = 'MIT',
    demo = '',
    screenshots = false,
  } = data;

  const repoSlug = projectName.toLowerCase().replace(/\s+/g, '-');
  const ghUser = githubUsername || 'yourusername';

  // ── Badges ──
  const licenseBadge = `[![License: ${license}](https://img.shields.io/badge/License-${encodeURIComponent(license)}-blue.svg)](https://opensource.org/licenses/${license.replace(/ /g, '-')})`;
  const starsBadge = githubUsername
    ? `[![GitHub stars](https://img.shields.io/github/stars/${ghUser}/${repoSlug}?style=social)](https://github.com/${ghUser}/${repoSlug})`
    : '';
  const forksBadge = githubUsername
    ? `[![GitHub forks](https://img.shields.io/github/forks/${ghUser}/${repoSlug}?style=social)](https://github.com/${ghUser}/${repoSlug})`
    : '';

  const badgesLine = [licenseBadge, starsBadge, forksBadge].filter(Boolean).join(' ');

  // ── Section builders ──
  const header = [
    `<div align="center">`,
    ``,
    `# ${projectName}`,
    ``,
    tagline ? `### *${tagline}*` : null,
    ``,
    badgesLine,
    ``,
    demo ? `[View Demo](${demo}) · ` : null,
    `[Report Bug](https://github.com/${ghUser}/${repoSlug}/issues) · [Request Feature](https://github.com/${ghUser}/${repoSlug}/issues)`,
    ``,
    `</div>`,
  ]
    .filter((l) => l !== null)
    .join('\n');

  const aboutSection = description
    ? `## 📖 About The Project\n\n${description}`
    : '';

  const demoSection = demo
    ? `## 🔗 Live Demo\n\n**[${demo}](${demo})**`
    : '';

  const screenshotSection = screenshots
    ? `## 📸 Screenshots\n\n<!-- Add your screenshots here -->\n![App Screenshot](./screenshots/app.png)\n\n> Add screenshots to a \`screenshots/\` folder in your repo root.`
    : '';

  const featuresSection =
    features.length > 0
      ? `## ✨ Features\n\n${features.map((f) => `- ✅ ${f}`).join('\n')}`
      : '';

  const techSection =
    techStack.length > 0
      ? `## 🛠️ Built With\n\n${techStack.map((t) => `- **${t}**`).join('\n')}`
      : '';

  const gettingStarted = `## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. Clone the repository

   \`\`\`bash
   git clone https://github.com/${ghUser}/${repoSlug}.git
   \`\`\`

2. Navigate to the project directory

   \`\`\`bash
   cd ${repoSlug}
   \`\`\`

3. Install dependencies

   \`\`\`bash
   npm install
   \`\`\`
${
  installation
    ? `\n4. Additional setup\n\n   \`\`\`bash\n   ${installation
        .split('\n')
        .join('\n   ')}\n   \`\`\``
    : ''
}`;

  const usageSection = `## 💻 Usage

\`\`\`bash
${usage || '# Start the development server\nnpm run dev\n\n# Build for production\nnpm run build'}
\`\`\``;

  const contributingSection = `## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the project
2. Create your feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'feat: add amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

Please make sure to update tests as appropriate.`;

  const licenseSection = `## 📄 License

Distributed under the **${license} License**. See \`LICENSE\` for more information.`;

  const authorSection = author
    ? `## 👤 Author

**${author}**
${githubUsername ? `\n- GitHub: [@${githubUsername}](https://github.com/${githubUsername})` : ''}
${data.twitterUsername ? `- Twitter: [@${data.twitterUsername}](https://twitter.com/${data.twitterUsername})` : ''}
${data.portfolio ? `- Portfolio: [${data.portfolio}](${data.portfolio})` : ''}`
    : '';

  const footer = `---

<div align="center">

Made with ❤️ by ${author || 'the author'}

⭐ **If this project helped you, please give it a star!** ⭐

</div>`;

  // ── Assemble all sections ──
  const sections = [
    header,
    aboutSection,
    demoSection,
    screenshotSection,
    featuresSection,
    techSection,
    gettingStarted,
    usageSection,
    contributingSection,
    licenseSection,
    authorSection,
    footer,
  ]
    .filter(Boolean)
    .join('\n\n---\n\n');

  return sections;
}

module.exports = { generateReadme };
