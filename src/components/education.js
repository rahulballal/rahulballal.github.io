import React from 'react';

import Card from './card';

export default ({ degrees }) => (
  <Card heading="EDUCATION">
    <ol>
      { degrees.map((degree, idx) => <li key={idx} className="py-1">{degree}</li> )}
    </ol>
  </Card>
)