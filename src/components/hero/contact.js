import React from 'react'

import { Icon } from 'react-icons-kit'
import {
  twitterSquare,
  githubSquare,
  linkedinSquare,
} from 'react-icons-kit/fa';

export default ({
  email,
  twitterUrl,
  linkedinUrl,
  githubUrl
}) => { 
  
  return (
  <div className="flex flex-row justify-center">
    <div>
      <a href={twitterUrl}>
      <Icon icon={twitterSquare} />
      </a>
    </div>
    <div>
      <a href={linkedinUrl}>
        <Icon icon={linkedinSquare} />
      </a>
    </div>
    <div>
      <a href={githubUrl}>
        <Icon icon={githubSquare} />
      </a>
    </div>
  </div>
)}
