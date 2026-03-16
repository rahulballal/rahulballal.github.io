const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const marked = require('marked');

const inputPath = path.join(__dirname, '..', 'raw', 'resume.md');
const templatePath = path.join(__dirname, '..', 'templates', 'resume.ejs');
const outputPath = path.join(__dirname, '..', 'index.html');

// Icon mapping for sections
const SECTION_ICONS = {
  'About': 'info',
  'Skills': 'tool',
  'Employment History': 'briefcase',
  'Podcasts & Media': 'mic',
  'Education': 'book-open',
  'Certifications': 'award',
  'Languages': 'globe'
};

/**
 * Parse markdown into structured data object
 */
function parseMarkdown(markdown) {
  const tokens = marked.lexer(markdown);
  
  const data = {
    name: '',
    title: '',
    personalInfo: [],
    sections: []
  };
  
  let currentSection = null;
  let currentJob = null;
  let currentPodcast = null;

  function flushCurrentJob() {
    if (!currentSection || currentSection.type !== 'employment' || !currentJob) {
      return;
    }

    if (
      currentJob.title ||
      currentJob.company ||
      currentJob.location ||
      currentJob.dates ||
      currentJob.responsibilities.length > 0
    ) {
      currentSection.jobs.push(currentJob);
    }

    currentJob = null;
  }

  function flushCurrentPodcast() {
    if (!currentSection || currentSection.type !== 'podcasts' || !currentPodcast) {
      return;
    }

    if (
      currentPodcast.name ||
      currentPodcast.role ||
      currentPodcast.description ||
      currentPodcast.episodes.length > 0
    ) {
      currentSection.podcasts.push(currentPodcast);
    }

    currentPodcast = null;
  }

  function flushSectionState() {
    flushCurrentJob();
    flushCurrentPodcast();
  }
  
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    
    // Parse H1 (Name)
    if (token.type === 'heading' && token.depth === 1) {
      data.name = token.text;
    }
    
    // Parse H2 (Title or Section)
    else if (token.type === 'heading' && token.depth === 2) {
      // First H2 is the title
      if (!data.title) {
        data.title = token.text;
      }
    }
    
    // Parse H3 (Section Headers)
    else if (token.type === 'heading' && token.depth === 3) {
      const sectionTitle = token.text;

      flushSectionState();
      
      // Save previous section
      if (currentSection) {
        data.sections.push(currentSection);
      }
      
      // Determine section type
      let sectionType = 'simple';
      if (sectionTitle === 'Skills') sectionType = 'skills';
      else if (sectionTitle === 'Employment History') sectionType = 'employment';
      else if (sectionTitle === 'Podcasts & Media') sectionType = 'podcasts';
      else if (sectionTitle === 'Education') sectionType = 'education';
      else if (sectionTitle === 'Certifications') sectionType = 'certifications';
      else if (sectionTitle === 'Languages') sectionType = 'languages';
      
      currentSection = {
        title: sectionTitle,
        icon: SECTION_ICONS[sectionTitle] || 'file-text',
        type: sectionType,
        contentParagraphs: [],
        subsections: [],
        jobs: [],
        podcasts: [],
        items: []
      };
      
      // Special handling for Personal Information
      if (sectionTitle === 'Personal Information') {
        // Next token should be a list
        if (i + 1 < tokens.length && tokens[i + 1].type === 'list') {
          const listToken = tokens[i + 1];
          listToken.items.forEach(item => {
            const text = item.text;
            const match = text.match(/\*\*([^:]+):\*\*\s*(.+)/);
            if (match) {
              const label = match[1];
              let value = match[2];
              let link = null;
              
              // Extract link if present
              const linkMatch = value.match(/<a href="([^"]+)">([^<]+)<\/a>/);
              if (linkMatch) {
                link = linkMatch[1];
                value = linkMatch[2];
              } else {
                // Try markdown link format
                const mdLinkMatch = value.match(/\[([^\]]+)\]\(([^)]+)\)/);
                if (mdLinkMatch) {
                  value = mdLinkMatch[1];
                  link = mdLinkMatch[2];
                }
              }
              
              // Skip "Name" field
              if (label !== 'Name') {
                data.personalInfo.push({ label, value, link });
              }
            }
          });
          i++; // Skip the list token
        }
        currentSection = null; // Don't add Personal Information as a section
      }
    }
    
    // Parse H4 (Subsection headers - Skills, Jobs, Podcasts, Education)
    else if (token.type === 'heading' && token.depth === 4) {
      if (!currentSection) continue;
      
      const h4Text = token.text;
      
      if (currentSection.type === 'skills') {
        // Check if next token is a list (for skill tags)
        if (i + 1 < tokens.length && tokens[i + 1].type === 'list') {
          const listToken = tokens[i + 1];
          const items = listToken.items.map(item => item.text);
          currentSection.subsections.push({
            title: h4Text,
            items: items
          });
          i++; // Skip the list token
        }
      }
      else if (currentSection.type === 'employment') {
        flushCurrentJob();
        // Start a new job
        currentJob = {
          title: h4Text,
          company: '',
          location: '',
          dates: '',
          responsibilities: []
        };
      }
      else if (currentSection.type === 'podcasts') {
        flushCurrentPodcast();
        // Start a new podcast
        currentPodcast = {
          name: h4Text,
          role: '',
          description: '',
          episodes: []
        };
      }
      else if (currentSection.type === 'education') {
        // Education degree
        currentSection.items.push({
          degree: h4Text,
          institution: '',
          location: '',
          dates: ''
        });
      }
    }
    
    // Parse paragraphs
    else if (token.type === 'paragraph') {
      if (!currentSection) continue;
      
      if (currentSection.type === 'simple') {
        currentSection.contentParagraphs.push(token.text);
      }
      else if (currentSection.type === 'employment' && currentJob) {
        // Parse job company/location/dates
        const text = token.text;
        const lines = text.split('\n');
        if (lines.length >= 2) {
          // First line: company • location (raw markdown format: **company** • location)
          const companyLine = lines[0].match(/\*\*([^*]+)\*\*\s*•\s*(.+)/);
          if (companyLine) {
            currentJob.company = companyLine[1];
            currentJob.location = companyLine[2].trim();
          }
          // Second line: dates (raw markdown format: *dates*)
          const datesMatch = lines[1].match(/\*([^*]+)\*/);
          if (datesMatch) {
            currentJob.dates = datesMatch[1];
          }
        }
      }
      else if (currentSection.type === 'podcasts' && currentPodcast) {
        const text = token.text;
        // Check if it's the role (strong text in either HTML or markdown form)
        if (text.includes('<strong>') || /^\*\*.+\*\*$/.test(text.trim())) {
          const htmlRoleMatch = text.match(/<strong>([^<]+)<\/strong>/);
          const markdownRoleMatch = text.match(/^\*\*([^*]+)\*\*$/);
          if (htmlRoleMatch) {
            currentPodcast.role = htmlRoleMatch[1].trim();
          } else if (markdownRoleMatch) {
            currentPodcast.role = markdownRoleMatch[1].trim();
          }
        }
        // Check if it's "Featured Episodes:"
        else if (text.includes('Featured Episodes:')) {
          // Skip, will be handled implicitly
        }
        // Otherwise it's description
        else {
          currentPodcast.description = text;
        }
      }
      else if (currentSection.type === 'education' && currentSection.items.length > 0) {
        // Parse institution/location/dates
        const lastItem = currentSection.items[currentSection.items.length - 1];
        const text = token.text;
        
        // Split by newline (markdown line break with two spaces)
        const lines = text.split(/\s*\n\s*/);
        if (lines.length >= 2) {
          // First line: institution • location
          const instLine = lines[0].match(/\*\*([^*]+)\*\*\s*•\s*(.+)/);
          if (instLine) {
            lastItem.institution = instLine[1];
            lastItem.location = instLine[2];
          }
          // Second line: dates
          const datesMatch = lines[1].match(/\*([^*]+)\*/);
          if (datesMatch) {
            lastItem.dates = datesMatch[1];
          }
        }
      }
    }
    
    // Parse lists
    else if (token.type === 'list') {
      if (!currentSection) continue;
      
      if (currentSection.type === 'employment' && currentJob) {
        // Job responsibilities
        currentJob.responsibilities = token.items.map(item => item.text);
        flushCurrentJob();
      }
      else if (currentSection.type === 'podcasts' && currentPodcast) {
        // Podcast episodes
        currentPodcast.episodes = token.items.map(item => {
          const text = item.text;
          const linkMatch = text.match(/<a href="([^"]+)">([^<]+)<\/a>\s*-\s*(.+)/);
          if (linkMatch) {
            return {
              link: linkMatch[1],
              title: linkMatch[2],
              description: linkMatch[3]
            };
          }
          // Try markdown link format
          const mdLinkMatch = text.match(/\[([^\]]+)\]\(([^)]+)\)\s*-\s*(.+)/);
          if (mdLinkMatch) {
            return {
              title: mdLinkMatch[1],
              link: mdLinkMatch[2],
              description: mdLinkMatch[3]
            };
          }
          return { title: text, link: '', description: '' };
        });
        flushCurrentPodcast();
      }
      else if (currentSection.type === 'certifications') {
        // Certifications
        currentSection.items = token.items.map(item => {
          const text = item.text;
          const match = text.match(/\*\*([^*]+)\*\*\s*\(([^)]+)\)/);
          if (match) {
            return { name: match[1], date: match[2] };
          }
          return { name: text, date: '' };
        });
      }
      else if (currentSection.type === 'languages') {
        // Languages
        currentSection.items = token.items.map(item => item.text);
      }
    }
  }
  
  // Add last section
  flushSectionState();
  if (currentSection) {
    data.sections.push(currentSection);
  }

  return data;
}

/**
 * Generate resume HTML from markdown
 */
function generate() {
  try {
    // Read markdown
    const markdown = fs.readFileSync(inputPath, 'utf8');
    
    // Parse into structured data
    const data = parseMarkdown(markdown);
    
    // Read EJS template
    const template = fs.readFileSync(templatePath, 'utf8');
    
    // Render template with data
    const html = ejs.render(template, data);
    
    // Strip trailing whitespace from each line
    const cleanHtml = html.split('\n').map(line => line.trimEnd()).join('\n');
    
    // Write output
    fs.writeFileSync(outputPath, cleanHtml);
    
    console.log('✅ Resume generated successfully!');
  } catch (error) {
    console.error('❌ Error generating resume:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  generate();
}

module.exports = { generate, parseMarkdown };
