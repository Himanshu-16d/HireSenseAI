import type { ResumeData, JobTarget } from '@/types/resume';

interface Template1PreviewProps {
  resumeData: ResumeData;
  feedback: string;
  score: number | null;
  jobTarget: JobTarget;
  atsFeedback?: any;
}

function cleanAIText(text: string) {
  return text.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
}

export default function Template1Preview({ resumeData }: Template1PreviewProps) {
  return (
    <div className="bg-white text-black p-8 rounded-lg shadow-lg max-w-[800px] mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">{resumeData.personalInfo.name || 'Your Name'}</h1>
        <div className="text-gray-600 space-x-4">
          <span>{resumeData.personalInfo.email}</span>
          <span>•</span>
          <span>{resumeData.personalInfo.phone}</span>
          <span>•</span>
          <span>{resumeData.personalInfo.location}</span>
        </div>
      </div>

      {/* Summary */}
      {resumeData.summary && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 border-b-2 border-gray-200 pb-1">Professional Summary</h2>
          <p className="text-gray-700">{cleanAIText(resumeData.summary)}</p>
        </div>
      )}

      {/* Experience */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2 border-b-2 border-gray-200 pb-1">Experience</h2>
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
        <h2 className="text-xl font-semibold mb-2 border-b-2 border-gray-200 pb-1">Education</h2>
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
          <h2 className="text-xl font-semibold mb-2 border-b-2 border-gray-200 pb-1">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {resumeData.skills.map((skill, index) => (
              <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {resumeData.projects.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2 border-b-2 border-gray-200 pb-1">Projects</h2>
          {resumeData.projects.map((project, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-semibold">{project.name}</h3>
              <p className="text-gray-700 mt-1">{cleanAIText(project.description)}</p>
              {project.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {project.technologies.map((tech, i) => (
                    <span key={i} className="bg-gray-100 px-2 py-0.5 rounded text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 