import React from 'react';

const Layout = ({
  heroNode,
  linksNode,
  skillsNode,
  careerNode,
  educationNode
}) => (
  <div id="main-section" className="flex flex-column container mx-auto px-10 py-2">
    <div id="hero-section" className="flex w-full">{heroNode && heroNode}</div>
    <div id="links-section">{linksNode && linksNode}</div>
    <div id="skills-section">{skillsNode && skillsNode}</div>
    <div id="career-section">{careerNode && careerNode}</div>
    <div id="education-section">{educationNode && educationNode}</div>
  </div>
);

export default Layout;
