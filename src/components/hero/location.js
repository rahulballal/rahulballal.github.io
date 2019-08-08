import React from 'react'
import { Icon } from 'react-icons-kit'
import { locationArrow } from 'react-icons-kit/fa/'

export default ({ city }) => (
  <div className="flex flex-row content-between">
    <div>
      <Icon icon={locationArrow} />
    </div>
    <div>{city}</div>
  </div>
)
