import React from 'react'

import content from './content'

import Layout from './components/layout'
import Hero from './components/hero'

function App() {
  const heroNode = (
    <Hero
      email={content.personal.email}
      githubUrl={content.personal.github}
      linkedInUrl={content.personal.linkedIn}
      location={content.personal.location}
      twitterUrl={content.personal.twitter}
    />
  )

  return <Layout heroNode={heroNode} />
}

export default App
