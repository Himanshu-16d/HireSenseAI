import { NextResponse } from "next/server";

export async function GET(request: Request) {
  console.log('Received job search request');
  
  // Always return example jobs, regardless of the search query
  const jobs = [
    {
      id: "infosys-1",
      title: "Senior Software Engineer",
      company: "Infosys",
      location: "Bangalore, India",
      description: "Work on cutting-edge technology solutions for global clients. Strong Java, Spring Boot, and cloud experience preferred.",
      url: "https://career.infosys.com/jobdesc?jobReferenceCode=INFSYS-EXTERNAL-212370&sourceId=1",
      postedDate: new Date().toISOString(),
      salary: "₹15,00,000 - ₹25,00,000",
      skills: ["Java", "Spring Boot", "Cloud", "Microservices"],
      matchScore: 0,
      source: "Infosys",
      commuteTime: 0,
      distance: 0,
    },
    {
      id: "sony-1",
      title: "Senior Software Engineer - Javascript",
      company: "Sony India Software Centre (SISC)",
      location: "Bengaluru, India",
      description: "Develop end-to-end test automation scripts for web/mobile applications. Strong JavaScript, Selenium, and automation experience required.",
      url: "https://jobs.weekday.works/sony-india-software-centre-%28sisc%29-senior-software-engineer---javascript?utm_campaign=google_jobs_apply&utm_source=google_jobs_apply&utm_medium=organic",
      postedDate: new Date().toISOString(),
      salary: "₹18,00,000 - ₹28,00,000",
      skills: ["JavaScript", "Selenium", "Automation", "Appium"],
      matchScore: 0,
      source: "Sony",
      commuteTime: 0,
      distance: 0,
    },
    {
      id: "amazon-1",
      title: "Senior Software Engineer (SDE III)",
      company: "Amazon India",
      location: "Bengaluru, India",
      description: "Design, develop, and support world-class CloudSearch and Elasticsearch platforms. Strong Java, Python, AWS, and system design skills required.",
      url: "https://cutshort.io/job/Senior-Software-Engineer-SDE-III-Bengaluru-Bangalore-Amazon-ZNfonPIe?utm_campaign=google_jobs_apply&utm_source=google_jobs_apply&utm_medium=organic",
      postedDate: new Date().toISOString(),
      salary: "₹40,00,000 - ₹60,00,000",
      skills: ["Java", "Python", "AWS", "Data Structures", "Algorithms"],
      matchScore: 0,
      source: "Amazon",
      commuteTime: 0,
      distance: 0,
    },
    {
      id: "adobe-1",
      title: "Senior Design Engineer - Android",
      company: "Adobe",
      location: "Bangalore, India",
      description: "Lead Android design and development for Adobe's creative apps. Strong Android, Kotlin, and UI/UX experience required.",
      url: "https://careers.adobe.com/us/en/job/R153359/Senior-Design-Engineer-Android?utm_campaign=google_jobs_apply&utm_source=google_jobs_apply&utm_medium=organic",
      postedDate: new Date().toISOString(),
      salary: "₹30,00,000 - ₹45,00,000",
      skills: ["Android", "Kotlin", "UI/UX", "Mobile Development"],
      matchScore: 0,
      source: "Adobe",
      commuteTime: 0,
      distance: 0,
    },
    {
      id: "synopsys-1",
      title: "Senior Software Engineer - Full Stack",
      company: "Synopsys",
      location: "Bengaluru, India",
      description: "Full stack development for EDA tools. Experience with Java, React, and cloud platforms preferred.",
      url: "https://careers.synopsys.com/job/bengaluru/senior-software-engineer-full-stack/44408/76798996064?utm_campaign=google_jobs_apply&utm_source=google_jobs_apply&utm_medium=organic",
      postedDate: new Date().toISOString(),
      salary: "₹22,00,000 - ₹35,00,000",
      skills: ["Java", "React", "Full Stack", "Cloud"],
      matchScore: 0,
      source: "Synopsys",
      commuteTime: 0,
      distance: 0,
    },
  ];

  console.log('Returning jobs:', jobs.length);
  
  return NextResponse.json({
    jobs,
    total: jobs.length,
    page: 1,
    limit: 20,
  });
} 