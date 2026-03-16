const test = require('node:test');
const assert = require('node:assert/strict');

const { parseMarkdown } = require('../scripts/generate-resume');

const sampleResume = `# Jane Doe
## Staff Engineer

### Personal Information

- **Name:** Jane Doe
- **Location:** Austin, TX
- **LinkedIn:** [linkedin.com/in/jane-doe](https://linkedin.com/in/jane-doe)

### About

I build reliable systems.

### Employment History

#### Principal Engineer
**Example Corp** • Austin, TX
*Jan 2024 - Present*

#### Senior Engineer
**Acme Inc** • Remote
*Jan 2020 - Dec 2023*

- Delivered platform features

### Podcasts & Media

#### Engineering Podcast
**Host**

Thoughtful conversations about software.

#### Guest Podcast
**Guest**

Guest conversation.

- [Episode 1](https://example.com/e1) - Episode details
`;

test('keeps employment entries without responsibility bullets', () => {
  const parsed = parseMarkdown(sampleResume);
  const employment = parsed.sections.find(section => section.type === 'employment');

  assert.ok(employment);
  assert.equal(employment.jobs.length, 2);
  assert.equal(employment.jobs[0].title, 'Principal Engineer');
  assert.equal(employment.jobs[0].company, 'Example Corp');
  assert.equal(employment.jobs[0].responsibilities.length, 0);
  assert.equal(employment.jobs[1].title, 'Senior Engineer');
  assert.equal(employment.jobs[1].responsibilities.length, 1);
});

test('keeps podcast entries without episode lists and parses markdown strong role', () => {
  const parsed = parseMarkdown(sampleResume);
  const podcasts = parsed.sections.find(section => section.type === 'podcasts');

  assert.ok(podcasts);
  assert.equal(podcasts.podcasts.length, 2);
  assert.equal(podcasts.podcasts[0].name, 'Engineering Podcast');
  assert.equal(podcasts.podcasts[0].role, 'Host');
  assert.equal(podcasts.podcasts[0].episodes.length, 0);
  assert.equal(podcasts.podcasts[1].name, 'Guest Podcast');
  assert.equal(podcasts.podcasts[1].role, 'Guest');
  assert.equal(podcasts.podcasts[1].episodes.length, 1);
});

test('captures simple content as escaped paragraphs for template rendering', () => {
  const parsed = parseMarkdown(sampleResume);
  const about = parsed.sections.find(section => section.title === 'About');

  assert.ok(about);
  assert.deepEqual(about.contentParagraphs, ['I build reliable systems.']);
});
