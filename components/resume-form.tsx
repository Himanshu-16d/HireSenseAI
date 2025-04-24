"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Plus, Trash2 } from "lucide-react"
import type { ResumeData } from "@/types/resume"
import RealtimeFeedback from "@/components/realtime-feedback"

interface ResumeFormProps {
  resumeData: ResumeData
  onChange: (data: ResumeData) => void
}

export default function ResumeForm({ resumeData, onChange }: ResumeFormProps) {
  const updatePersonalInfo = (field: string, value: string) => {
    onChange({
      ...resumeData,
      personalInfo: {
        ...resumeData.personalInfo,
        [field]: value,
      },
    })
  }

  const updateSummary = (value: string) => {
    onChange({
      ...resumeData,
      summary: value,
    })
  }

  const updateExperience = (index: number, field: string, value: string | string[]) => {
    const updatedExperience = [...resumeData.experience]
    updatedExperience[index] = {
      ...updatedExperience[index],
      [field]: value,
    }
    onChange({
      ...resumeData,
      experience: updatedExperience,
    })
  }

  const addExperience = () => {
    onChange({
      ...resumeData,
      experience: [
        ...resumeData.experience,
        {
          title: "",
          company: "",
          location: "",
          startDate: "",
          endDate: "",
          description: "",
          achievements: [""],
        },
      ],
    })
  }

  const removeExperience = (index: number) => {
    const updatedExperience = [...resumeData.experience]
    updatedExperience.splice(index, 1)
    onChange({
      ...resumeData,
      experience: updatedExperience,
    })
  }

  const updateEducation = (index: number, field: string, value: string | string[]) => {
    const updatedEducation = [...resumeData.education]
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value,
    }
    onChange({
      ...resumeData,
      education: updatedEducation,
    })
  }

  const addEducation = () => {
    onChange({
      ...resumeData,
      education: [
        ...resumeData.education,
        {
          degree: "",
          institution: "",
          location: "",
          graduationDate: "",
          gpa: "",
          achievements: [""],
        },
      ],
    })
  }

  const removeEducation = (index: number) => {
    const updatedEducation = [...resumeData.education]
    updatedEducation.splice(index, 1)
    onChange({
      ...resumeData,
      education: updatedEducation,
    })
  }

  const updateSkills = (index: number, value: string) => {
    const updatedSkills = [...resumeData.skills]
    updatedSkills[index] = value
    onChange({
      ...resumeData,
      skills: updatedSkills,
    })
  }

  const addSkill = () => {
    onChange({
      ...resumeData,
      skills: [...resumeData.skills, ""],
    })
  }

  const removeSkill = (index: number) => {
    const updatedSkills = [...resumeData.skills]
    updatedSkills.splice(index, 1)
    onChange({
      ...resumeData,
      skills: updatedSkills,
    })
  }

  const updateProject = (index: number, field: string, value: string | string[]) => {
    const updatedProjects = [...resumeData.projects]
    updatedProjects[index] = {
      ...updatedProjects[index],
      [field]: value,
    }
    onChange({
      ...resumeData,
      projects: updatedProjects,
    })
  }

  const addProject = () => {
    onChange({
      ...resumeData,
      projects: [
        ...resumeData.projects,
        {
          name: "",
          description: "",
          technologies: [""],
          link: "",
        },
      ],
    })
  }

  const removeProject = (index: number) => {
    const updatedProjects = [...resumeData.projects]
    updatedProjects.splice(index, 1)
    onChange({
      ...resumeData,
      projects: updatedProjects,
    })
  }

  const updateAchievement = (
    section: "experience" | "education",
    sectionIndex: number,
    achievementIndex: number,
    value: string,
  ) => {
    const updatedSection = [...resumeData[section]]
    const updatedAchievements = [...updatedSection[sectionIndex].achievements]
    updatedAchievements[achievementIndex] = value
    updatedSection[sectionIndex] = {
      ...updatedSection[sectionIndex],
      achievements: updatedAchievements,
    }
    onChange({
      ...resumeData,
      [section]: updatedSection,
    })
  }

  const addAchievement = (section: "experience" | "education", sectionIndex: number) => {
    const updatedSection = [...resumeData[section]]
    updatedSection[sectionIndex] = {
      ...updatedSection[sectionIndex],
      achievements: [...updatedSection[sectionIndex].achievements, ""],
    }
    onChange({
      ...resumeData,
      [section]: updatedSection,
    })
  }

  const removeAchievement = (section: "experience" | "education", sectionIndex: number, achievementIndex: number) => {
    const updatedSection = [...resumeData[section]]
    const updatedAchievements = [...updatedSection[sectionIndex].achievements]
    updatedAchievements.splice(achievementIndex, 1)
    updatedSection[sectionIndex] = {
      ...updatedSection[sectionIndex],
      achievements: updatedAchievements,
    }
    onChange({
      ...resumeData,
      [section]: updatedSection,
    })
  }

  const updateProjectTechnology = (projectIndex: number, techIndex: number, value: string) => {
    const updatedProjects = [...resumeData.projects]
    const updatedTechnologies = [...updatedProjects[projectIndex].technologies]
    updatedTechnologies[techIndex] = value
    updatedProjects[projectIndex] = {
      ...updatedProjects[projectIndex],
      technologies: updatedTechnologies,
    }
    onChange({
      ...resumeData,
      projects: updatedProjects,
    })
  }

  const addProjectTechnology = (projectIndex: number) => {
    const updatedProjects = [...resumeData.projects]
    updatedProjects[projectIndex] = {
      ...updatedProjects[projectIndex],
      technologies: [...updatedProjects[projectIndex].technologies, ""],
    }
    onChange({
      ...resumeData,
      projects: updatedProjects,
    })
  }

  const removeProjectTechnology = (projectIndex: number, techIndex: number) => {
    const updatedProjects = [...resumeData.projects]
    const updatedTechnologies = [...updatedProjects[projectIndex].technologies]
    updatedTechnologies.splice(techIndex, 1)
    updatedProjects[projectIndex] = {
      ...updatedProjects[projectIndex],
      technologies: updatedTechnologies,
    }
    onChange({
      ...resumeData,
      projects: updatedProjects,
    })
  }

  return (
    <div className="space-y-6">
      <Accordion type="single" collapsible defaultValue="personal-info">
        <AccordionItem value="personal-info">
          <AccordionTrigger>Personal Information</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </label>
                <Input
                  id="name"
                  value={resumeData.personalInfo.name}
                  onChange={(e) => updatePersonalInfo("name", e.target.value)}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={resumeData.personalInfo.email}
                  onChange={(e) => updatePersonalInfo("email", e.target.value)}
                  placeholder="john.doe@example.com"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Phone
                </label>
                <Input
                  id="phone"
                  value={resumeData.personalInfo.phone}
                  onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                  placeholder="(123) 456-7890"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="location" className="text-sm font-medium">
                  Location
                </label>
                <Input
                  id="location"
                  value={resumeData.personalInfo.location}
                  onChange={(e) => updatePersonalInfo("location", e.target.value)}
                  placeholder="New York, NY"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="linkedin" className="text-sm font-medium">
                  LinkedIn (optional)
                </label>
                <Input
                  id="linkedin"
                  value={resumeData.personalInfo.linkedin}
                  onChange={(e) => updatePersonalInfo("linkedin", e.target.value)}
                  placeholder="linkedin.com/in/johndoe"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="website" className="text-sm font-medium">
                  Website (optional)
                </label>
                <Input
                  id="website"
                  value={resumeData.personalInfo.website}
                  onChange={(e) => updatePersonalInfo("website", e.target.value)}
                  placeholder="johndoe.com"
                />
              </div>
            </div>
            <RealtimeFeedback resumeData={resumeData} section="personal-info" />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="summary">
          <AccordionTrigger>Professional Summary</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <label htmlFor="summary" className="text-sm font-medium">
                Summary
              </label>
              <Textarea
                id="summary"
                value={resumeData.summary}
                onChange={(e) => updateSummary(e.target.value)}
                placeholder="Experienced software engineer with a passion for building scalable applications..."
                rows={4}
              />
            </div>
            <RealtimeFeedback resumeData={resumeData} section="summary" />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="experience">
          <AccordionTrigger>Work Experience</AccordionTrigger>
          <AccordionContent>
            {resumeData.experience.map((exp, index) => (
              <Card key={index} className="mb-4">
                <CardHeader className="flex flex-row items-center justify-between py-3">
                  <CardTitle className="text-md">
                    {exp.title || exp.company
                      ? `${exp.title} ${exp.company ? "at " + exp.company : ""}`
                      : `Experience ${index + 1}`}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeExperience(index)}
                    disabled={resumeData.experience.length <= 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor={`exp-title-${index}`} className="text-sm font-medium">
                        Job Title
                      </label>
                      <Input
                        id={`exp-title-${index}`}
                        value={exp.title}
                        onChange={(e) => updateExperience(index, "title", e.target.value)}
                        placeholder="Software Engineer"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor={`exp-company-${index}`} className="text-sm font-medium">
                        Company
                      </label>
                      <Input
                        id={`exp-company-${index}`}
                        value={exp.company}
                        onChange={(e) => updateExperience(index, "company", e.target.value)}
                        placeholder="Tech Company Inc."
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor={`exp-location-${index}`} className="text-sm font-medium">
                        Location
                      </label>
                      <Input
                        id={`exp-location-${index}`}
                        value={exp.location}
                        onChange={(e) => updateExperience(index, "location", e.target.value)}
                        placeholder="San Francisco, CA"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <label htmlFor={`exp-start-${index}`} className="text-sm font-medium">
                          Start Date
                        </label>
                        <Input
                          id={`exp-start-${index}`}
                          value={exp.startDate}
                          onChange={(e) => updateExperience(index, "startDate", e.target.value)}
                          placeholder="Jan 2020"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor={`exp-end-${index}`} className="text-sm font-medium">
                          End Date
                        </label>
                        <Input
                          id={`exp-end-${index}`}
                          value={exp.endDate}
                          onChange={(e) => updateExperience(index, "endDate", e.target.value)}
                          placeholder="Present"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor={`exp-desc-${index}`} className="text-sm font-medium">
                      Description
                    </label>
                    <Textarea
                      id={`exp-desc-${index}`}
                      value={exp.description}
                      onChange={(e) => updateExperience(index, "description", e.target.value)}
                      placeholder="Briefly describe your role and responsibilities..."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Key Achievements</label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addAchievement("experience", index)}
                        className="h-8"
                      >
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        Add Achievement
                      </Button>
                    </div>
                    {exp.achievements.map((achievement, achievementIndex) => (
                      <div key={achievementIndex} className="flex items-center gap-2">
                        <Input
                          value={achievement}
                          onChange={(e) => updateAchievement("experience", index, achievementIndex, e.target.value)}
                          placeholder="Increased performance by 30% through optimization"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeAchievement("experience", index, achievementIndex)}
                          disabled={exp.achievements.length <= 1}
                          className="h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button variant="outline" onClick={addExperience} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Work Experience
            </Button>
            <RealtimeFeedback resumeData={resumeData} section="experience" />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="education">
          <AccordionTrigger>Education</AccordionTrigger>
          <AccordionContent>
            {resumeData.education.map((edu, index) => (
              <Card key={index} className="mb-4">
                <CardHeader className="flex flex-row items-center justify-between py-3">
                  <CardTitle className="text-md">
                    {edu.degree || edu.institution
                      ? `${edu.degree} ${edu.institution ? "at " + edu.institution : ""}`
                      : `Education ${index + 1}`}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeEducation(index)}
                    disabled={resumeData.education.length <= 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor={`edu-degree-${index}`} className="text-sm font-medium">
                        Degree
                      </label>
                      <Input
                        id={`edu-degree-${index}`}
                        value={edu.degree}
                        onChange={(e) => updateEducation(index, "degree", e.target.value)}
                        placeholder="Bachelor of Science in Computer Science"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor={`edu-institution-${index}`} className="text-sm font-medium">
                        Institution
                      </label>
                      <Input
                        id={`edu-institution-${index}`}
                        value={edu.institution}
                        onChange={(e) => updateEducation(index, "institution", e.target.value)}
                        placeholder="University of Technology"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor={`edu-location-${index}`} className="text-sm font-medium">
                        Location
                      </label>
                      <Input
                        id={`edu-location-${index}`}
                        value={edu.location}
                        onChange={(e) => updateEducation(index, "location", e.target.value)}
                        placeholder="Boston, MA"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <label htmlFor={`edu-grad-${index}`} className="text-sm font-medium">
                          Graduation Date
                        </label>
                        <Input
                          id={`edu-grad-${index}`}
                          value={edu.graduationDate}
                          onChange={(e) => updateEducation(index, "graduationDate", e.target.value)}
                          placeholder="May 2022"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor={`edu-gpa-${index}`} className="text-sm font-medium">
                          GPA (optional)
                        </label>
                        <Input
                          id={`edu-gpa-${index}`}
                          value={edu.gpa}
                          onChange={(e) => updateEducation(index, "gpa", e.target.value)}
                          placeholder="3.8/4.0"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Achievements/Activities</label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addAchievement("education", index)}
                        className="h-8"
                      >
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        Add Achievement
                      </Button>
                    </div>
                    {edu.achievements.map((achievement, achievementIndex) => (
                      <div key={achievementIndex} className="flex items-center gap-2">
                        <Input
                          value={achievement}
                          onChange={(e) => updateAchievement("education", index, achievementIndex, e.target.value)}
                          placeholder="Dean's List, Academic Scholarship, etc."
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeAchievement("education", index, achievementIndex)}
                          disabled={edu.achievements.length <= 1}
                          className="h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button variant="outline" onClick={addEducation} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Education
            </Button>
            <RealtimeFeedback resumeData={resumeData} section="education" />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="skills">
          <AccordionTrigger>Skills</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {resumeData.skills.map((skill, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={skill}
                    onChange={(e) => updateSkills(index, e.target.value)}
                    placeholder="JavaScript, React, Node.js, etc."
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSkill(index)}
                    disabled={resumeData.skills.length <= 1}
                    className="h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" onClick={addSkill} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Skill
              </Button>
            </div>
            <RealtimeFeedback resumeData={resumeData} section="skills" />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="projects">
          <AccordionTrigger>Projects</AccordionTrigger>
          <AccordionContent>
            {resumeData.projects.map((project, index) => (
              <Card key={index} className="mb-4">
                <CardHeader className="flex flex-row items-center justify-between py-3">
                  <CardTitle className="text-md">{project.name || `Project ${index + 1}`}</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeProject(index)}
                    disabled={resumeData.projects.length <= 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor={`project-name-${index}`} className="text-sm font-medium">
                        Project Name
                      </label>
                      <Input
                        id={`project-name-${index}`}
                        value={project.name}
                        onChange={(e) => updateProject(index, "name", e.target.value)}
                        placeholder="E-commerce Platform"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor={`project-link-${index}`} className="text-sm font-medium">
                        Project Link (optional)
                      </label>
                      <Input
                        id={`project-link-${index}`}
                        value={project.link}
                        onChange={(e) => updateProject(index, "link", e.target.value)}
                        placeholder="https://github.com/username/project"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor={`project-desc-${index}`} className="text-sm font-medium">
                      Description
                    </label>
                    <Textarea
                      id={`project-desc-${index}`}
                      value={project.description}
                      onChange={(e) => updateProject(index, "description", e.target.value)}
                      placeholder="Describe the project, your role, and key features..."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Technologies Used</label>
                      <Button variant="outline" size="sm" onClick={() => addProjectTechnology(index)} className="h-8">
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        Add Technology
                      </Button>
                    </div>
                    {project.technologies.map((tech, techIndex) => (
                      <div key={techIndex} className="flex items-center gap-2">
                        <Input
                          value={tech}
                          onChange={(e) => updateProjectTechnology(index, techIndex, e.target.value)}
                          placeholder="React, Node.js, MongoDB, etc."
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeProjectTechnology(index, techIndex)}
                          disabled={project.technologies.length <= 1}
                          className="h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button variant="outline" onClick={addProject} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
            <RealtimeFeedback resumeData={resumeData} section="projects" />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
