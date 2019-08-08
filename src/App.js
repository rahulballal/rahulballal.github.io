import React from 'react'

import content from './content'

import Layout from './components/layout'
import Hero from './components/hero'
import Education from './components/education'
import Skills from './components/skills'
import CareerHistory from './components/career-history'
import Nav from './components/navigation'

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

  const educationNode = <Education degrees={content.education} />

  const skillsNode = <Skills />

  const careerNode = <CareerHistory />

  const navigation = <Nav />
  return (
    <Layout
      heroNode={heroNode}
      educationNode={educationNode}
      skillsNode={skillsNode}
      careerNode={careerNode}
      linksNode={navigation}
    />
  )
}

export default App
