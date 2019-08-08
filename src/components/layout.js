import React from 'react';

const Layout = ({
  heroNode,
  linksNode,
  skillsNode,
  careerNode,
  educationNode
}) => (
  <div id="main-section" className="flex flex-col container mx-auto px-40 py-2 bg-blue-100">
    <div id="hero-section" className="flex w-full justify-center bg-white rounded-t-lg rounded-b-lg">{heroNode && heroNode}</div>
    <div id="links-section" className="flex justify-center">{linksNode && linksNode}</div>
    <div id="skills-section">{skillsNode && skillsNode}</div>
    <div id="career-section">{careerNode && careerNode}</div>
    <div id="education-section" className="flex flex-column w-full">{educationNode && educationNode}</div>
  </div>
);

export default Layout;
