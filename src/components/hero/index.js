import React from 'react'

import Face from './face'
import Location from './location'
import Contact from './contact'

const HeroTemplate = ({ faceNode, locationNode, contactNode }) => (
  <div className="flex-column">
    <div>
      {faceNode && faceNode}
    </div>
    <div className="flex-row justify-between">
      {locationNode && locationNode}
    </div>
    <div>
      {contactNode && contactNode}
    </div>
  </div>
)

export default ({
  location,
  email,
  twitterUrl,
  linkedInUrl,
  githubUrl
}) => (
  <HeroTemplate
    faceNode={<Face />}
    locationNode={<Location city={location} />}
    contactNode={
      <Contact
        email={email}
        twitter={twitterUrl}
        linkedIn={linkedInUrl}
        github={githubUrl}
      />
    }
  />
)
