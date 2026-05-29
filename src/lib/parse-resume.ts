import { lexer } from 'marked';
import type { TokensList, Tokens } from 'marked';

export interface PersonalInfo {
  label: string;
  value: string;
  link: string | null;
}

export interface SkillSubsection {
  title: string;
  items: string[];
}

export interface Job {
  title: string;
  company: string;
  location: string;
  dates: string;
  responsibilities: string[];
}

export interface PodcastEpisode {
  title: string;
  link: string;
  description: string;
}

export interface Podcast {
  name: string;
  role: string;
  description: string;
  episodes: PodcastEpisode[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  location: string;
  dates: string;
}

export interface CertificationItem {
  name: string;
  date: string;
}

export interface Section {
  title: string;
  icon: string;
  type: 'simple' | 'skills' | 'employment' | 'podcasts' | 'education' | 'certifications' | 'languages';
  contentParagraphs: string[];
  subsections: SkillSubsection[];
  jobs: Job[];
  podcasts: Podcast[];
  items: (string | EducationItem | CertificationItem)[];
}

export interface ResumeData {
  name: string;
  title: string;
  personalInfo: PersonalInfo[];
  sections: Section[];
}

const SECTION_ICONS: Record<string, string> = {
  'About': 'info',
  'Skills': 'tool',
  'Employment History': 'briefcase',
  'Podcasts & Media': 'mic',
  'Education': 'book-open',
  'Certifications': 'award',
  'Languages': 'globe',
};

export function parseResume(markdown: string): ResumeData {
  const tokens: TokensList = lexer(markdown);

  const data: ResumeData = {
    name: '',
    title: '',
    personalInfo: [],
    sections: [],
  };

  let currentSection: Section | null = null;
  let currentJob: Job | null = null;
  let currentPodcast: Podcast | null = null;

  function flushCurrentJob() {
    if (!currentSection || currentSection.type !== 'employment' || !currentJob) return;
    if (currentJob.title || currentJob.company || currentJob.location || currentJob.dates || currentJob.responsibilities.length > 0) {
      currentSection.jobs.push(currentJob);
    }
    currentJob = null;
  }

  function flushCurrentPodcast() {
    if (!currentSection || currentSection.type !== 'podcasts' || !currentPodcast) return;
    if (currentPodcast.name || currentPodcast.role || currentPodcast.description || currentPodcast.episodes.length > 0) {
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
      data.name = (token as Tokens.Heading).text;
    }

    // Parse H2 (Title or Section)
    else if (token.type === 'heading' && token.depth === 2) {
      if (!data.title) {
        data.title = (token as Tokens.Heading).text;
      }
    }

    // Parse H3 (Section Headers)
    else if (token.type === 'heading' && token.depth === 3) {
      const sectionTitle = (token as Tokens.Heading).text;

      flushSectionState();

      if (currentSection) {
        data.sections.push(currentSection);
      }

      let sectionType: Section['type'] = 'simple';
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
        items: [],
      };

      // Personal Information - inline handling
      if (sectionTitle === 'Personal Information') {
        if (i + 1 < tokens.length && tokens[i + 1].type === 'list') {
          const listToken = tokens[i + 1] as Tokens.List;
          for (const item of listToken.items) {
            const text = (item as Tokens.ListItem).text;
            const match = text.match(/\*\*([^:]+):\*\*\s*(.+)/);
            if (match) {
              const label = match[1];
              let value = match[2];
              let link: string | null = null;

              // Extract HTML link
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

              if (label !== 'Name') {
                data.personalInfo.push({ label, value, link });
              }
            }
          }
          i++;
        }
        currentSection = null;
      }
    }

    // Parse H4 (Subsection headers)
    else if (token.type === 'heading' && token.depth === 4) {
      if (!currentSection) continue;

      const h4Text = (token as Tokens.Heading).text;

      if (currentSection.type === 'skills') {
        if (i + 1 < tokens.length && tokens[i + 1].type === 'list') {
          const listToken = tokens[i + 1] as Tokens.List;
          const items = listToken.items.map(item => (item as Tokens.ListItem).text);
          currentSection.subsections.push({ title: h4Text, items });
          i++;
        }
      } else if (currentSection.type === 'employment') {
        flushCurrentJob();
        currentJob = { title: h4Text, company: '', location: '', dates: '', responsibilities: [] };
      } else if (currentSection.type === 'podcasts') {
        flushCurrentPodcast();
        currentPodcast = { name: h4Text, role: '', description: '', episodes: [] };
      } else if (currentSection.type === 'education') {
        currentSection.items.push({ degree: h4Text, institution: '', location: '', dates: '' } as EducationItem);
      }
    }

    // Parse paragraphs
    else if (token.type === 'paragraph') {
      if (!currentSection) continue;

      const text = (token as Tokens.Paragraph).text;

      if (currentSection.type === 'simple') {
        currentSection.contentParagraphs.push(text);
      } else if (currentSection.type === 'employment' && currentJob) {
        const lines = text.split('\n');
        if (lines.length >= 2) {
          const companyLine = lines[0].match(/\*\*([^*]+)\*\*\s*•\s*(.+)/);
          if (companyLine) {
            currentJob.company = companyLine[1];
            currentJob.location = companyLine[2].trim();
          }
          const datesMatch = lines[1].match(/\*([^*]+)\*/);
          if (datesMatch) {
            currentJob.dates = datesMatch[1];
          }
        }
      } else if (currentSection.type === 'podcasts' && currentPodcast) {
        if (text.includes('<strong>') || /^\*\*.+\*\*$/.test(text.trim())) {
          const htmlRoleMatch = text.match(/<strong>([^<]+)<\/strong>/);
          const markdownRoleMatch = text.match(/^\*\*([^*]+)\*\*$/);
          if (htmlRoleMatch) {
            currentPodcast.role = htmlRoleMatch[1].trim();
          } else if (markdownRoleMatch) {
            currentPodcast.role = markdownRoleMatch[1].trim();
          }
        } else if (text.includes('Featured Episodes:')) {
          // skip
        } else {
          currentPodcast.description = text;
        }
      } else if (currentSection.type === 'education' && currentSection.items.length > 0) {
        const lastItem = currentSection.items[currentSection.items.length - 1] as EducationItem;
        const lines = text.split(/\s*\n\s*/);
        if (lines.length >= 2) {
          const instLine = lines[0].match(/\*\*([^*]+)\*\*\s*•\s*(.+)/);
          if (instLine) {
            lastItem.institution = instLine[1];
            lastItem.location = instLine[2];
          }
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

      const listItems = (token as Tokens.List).items;
      const itemTexts = listItems.map(item => (item as Tokens.ListItem).text);

      if (currentSection.type === 'employment' && currentJob) {
        currentJob.responsibilities = itemTexts;
        flushCurrentJob();
      } else if (currentSection.type === 'podcasts' && currentPodcast) {
        currentPodcast.episodes = itemTexts.map(text => {
          const linkMatch = text.match(/<a href="([^"]+)">([^<]+)<\/a>\s*-\s*(.+)/);
          if (linkMatch) {
            return { link: linkMatch[1], title: linkMatch[2], description: linkMatch[3] };
          }
          const mdLinkMatch = text.match(/\[([^\]]+)\]\(([^)]+)\)\s*-\s*(.+)/);
          if (mdLinkMatch) {
            return { title: mdLinkMatch[1], link: mdLinkMatch[2], description: mdLinkMatch[3] };
          }
          return { title: text, link: '', description: '' };
        });
        flushCurrentPodcast();
      } else if (currentSection.type === 'certifications') {
        currentSection.items = itemTexts.map(text => {
          const match = text.match(/\*\*([^*]+)\*\*\s*\(([^)]+)\)/);
          if (match) {
            return { name: match[1], date: match[2] } as CertificationItem;
          }
          return { name: text, date: '' } as CertificationItem;
        });
      } else if (currentSection.type === 'languages') {
        currentSection.items = itemTexts;
      }
    }
  }

  // Final flush
  flushSectionState();
  if (currentSection) {
    data.sections.push(currentSection);
  }

  return data;
}
