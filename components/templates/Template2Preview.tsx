"use client";

import type { ResumeData } from '@/types/resume';

interface Template2PreviewProps {
  resumeData: ResumeData;
}

// Utility to remove <think>...</think> blocks
function cleanAIText(text: string) {
  return text.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
}

export default function Template2Preview({ resumeData }: Template2PreviewProps) {
  return (
    <div className="bg-gray-50 text-black p-8 rounded-lg shadow-lg max-w-[800px] mx-auto">
      {/* Header */}
      <div className="border-b-2 border-gray-300 pb-4 mb-6">
        <h1 className="text-3xl font-bold mb-2">{resumeData.personalInfo.name || 'Your Name'}</h1>
        <div className="grid grid-cols-2 gap-4 text-gray-600">
          <div>
            <p>Email: {resumeData.personalInfo.email}</p>
            <p>Phone: {resumeData.personalInfo.phone}</p>
          </div>
          <div>
            <p>Location: {resumeData.personalInfo.location}</p>
            {resumeData.personalInfo.linkedin && (
              <p>LinkedIn: {resumeData.personalInfo.linkedin}</p>
            )}
          </div>
        </div>
      </div>

      {/* Summary */}
      {resumeData.summary && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Professional Summary</h2>
          <p className="text-gray-700">{cleanAIText(resumeData.summary)}</p>
        </div>
      )}

      {/* Experience */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Professional Experience</h2>
        {resumeData.experience.map((exp, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{exp.title}</h3>
                <p className="text-gray-600">{exp.company}</p>
              </div>
              <div className="text-gray-600 text-sm">
                {exp.startDate} - {exp.endDate}
              </div>
            </div>
            <p className="text-gray-700 mt-1">{cleanAIText(exp.description)}</p>
            {exp.achievements.length > 0 && (
              <ul className="list-disc list-inside mt-2 text-gray-700">
                {exp.achievements.map((achievement, i) => (
                  <li key={i}>{achievement}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* Education */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Education</h2>
        {resumeData.education.map((edu, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{edu.degree}</h3>
                <p className="text-gray-600">{edu.institution}</p>
              </div>
              <div className="text-gray-600 text-sm">
                {edu.graduationDate}
              </div>
            </div>
            {edu.gpa && <p className="text-gray-700 mt-1">GPA: {edu.gpa}</p>}
          </div>
        ))}
      </div>

      {/* Skills */}
      {resumeData.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Technical Skills</h2>
          <div className="grid grid-cols-2 gap-4">
            {resumeData.skills.map((skill, index) => (
              <div key={index} className="flex items-center">
                <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                <span className="text-gray-700">{skill}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {resumeData.projects.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Projects</h2>
          {resumeData.projects.map((project, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-semibold">{project.name}</h3>
              <p className="text-gray-700 mt-1">{cleanAIText(project.description)}</p>
              {project.technologies.length > 0 && (
                <div className="mt-2">
                  <span className="text-gray-600">Technologies: </span>
                  <span className="text-gray-700">{project.technologies.join(', ')}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}