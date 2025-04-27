import type { Job, JobSearchParams } from '@/types/job';

// Mock job database with jobs from different sources and domains
const mockJobs: Job[] = [
  // Mumbai Tech Jobs
  {
    id: 'mumbai-1',
    title: 'Senior Software Engineer',
    company: 'Tata Consultancy Services',
    location: 'Mumbai, Maharashtra, India',
    description: 'Join TCS as a Senior Software Engineer working on enterprise solutions...',
    url: 'https://www.tcs.com/careers',
    postedDate: new Date().toISOString(),
    salary: '₹1,500,000 - ₹2,500,000',
    skills: ['Java', 'Spring Boot', 'Microservices', 'AWS', 'Docker'],
    matchScore: 95,
    source: 'company-website',
    commuteTime: 30,
    distance: 5
  },
  {
    id: 'mumbai-2',
    title: 'Full Stack Developer',
    company: 'Infosys',
    location: 'Mumbai, Maharashtra, India',
    description: 'Work on cutting-edge web applications using modern technologies...',
    url: 'https://www.infosys.com/careers/apply.html',
    postedDate: new Date().toISOString(),
    salary: '₹1,200,000 - ₹2,000,000',
    skills: ['React', 'Node.js', 'MongoDB', 'TypeScript', 'Express'],
    matchScore: 92,
    source: 'company-website',
    commuteTime: 25,
    distance: 4
  },
  {
    id: 'mumbai-3',
    title: 'Data Scientist',
    company: 'Morgan Stanley',
    location: 'Mumbai, Maharashtra, India',
    description: 'Join our data science team to work on financial analytics...',
    url: 'https://www.morganstanley.com/people-opportunities/students-graduates/programs/technology',
    postedDate: new Date().toISOString(),
    salary: '₹2,000,000 - ₹3,000,000',
    skills: ['Python', 'Machine Learning', 'Pandas', 'TensorFlow', 'SQL'],
    matchScore: 94,
    source: 'company-website',
    commuteTime: 35,
    distance: 8
  },
  {
    id: 'mumbai-4',
    title: 'DevOps Engineer',
    company: 'JPMorgan Chase',
    location: 'Mumbai, Maharashtra, India',
    description: 'Implement and maintain CI/CD pipelines and cloud infrastructure...',
    url: 'https://careers.jpmorgan.com/us/en/students/programs/software-engineer-summer',
    postedDate: new Date().toISOString(),
    salary: '₹1,800,000 - ₹2,800,000',
    skills: ['AWS', 'Kubernetes', 'Jenkins', 'Terraform', 'Docker'],
    matchScore: 93,
    source: 'company-website',
    commuteTime: 40,
    distance: 10
  },
  {
    id: 'mumbai-5',
    title: 'Mobile App Developer',
    company: 'Reliance Jio',
    location: 'Mumbai, Maharashtra, India',
    description: 'Develop mobile applications for Jio\'s digital ecosystem...',
    url: 'https://www.jio.com/careers',
    postedDate: new Date().toISOString(),
    salary: '₹1,400,000 - ₹2,200,000',
    skills: ['React Native', 'Flutter', 'iOS', 'Android', 'Firebase'],
    matchScore: 91,
    source: 'company-website',
    commuteTime: 20,
    distance: 3
  },
  // Tech Industry Jobs
  {
    id: 'linkedin-1',
    title: 'Senior Software Engineer',
    company: 'Microsoft',
    location: 'Redmond, WA',
    description: 'Join Microsoft\'s engineering team to work on cutting-edge cloud technologies...',
    url: 'https://www.linkedin.com/jobs/view/123456789',
    postedDate: new Date().toISOString(),
    salary: '$180,000 - $250,000',
    skills: ['C#', '.NET', 'Azure', 'Microservices', 'Docker'],
    matchScore: 95,
    source: 'linkedin',
    commuteTime: 45,
    distance: 15
  },
  {
    id: 'linkedin-2',
    title: 'Frontend Developer',
    company: 'Meta',
    location: 'Menlo Park, CA',
    description: 'Work on Facebook\'s frontend infrastructure and user interfaces...',
    url: 'https://www.linkedin.com/jobs/view/987654321',
    postedDate: new Date().toISOString(),
    salary: '$160,000 - $220,000',
    skills: ['React', 'JavaScript', 'TypeScript', 'GraphQL', 'CSS'],
    matchScore: 92,
    source: 'linkedin',
    commuteTime: 30,
    distance: 10
  },

  // Finance Industry Jobs
  {
    id: 'indeed-1',
    title: 'Financial Software Developer',
    company: 'Goldman Sachs',
    location: 'New York, NY',
    description: 'Develop financial software solutions for trading and risk management...',
    url: 'https://www.indeed.com/jobs/view/123456',
    postedDate: new Date().toISOString(),
    salary: '$170,000 - $230,000',
    skills: ['Java', 'Python', 'SQL', 'Financial Markets', 'Risk Analysis'],
    matchScore: 90,
    source: 'indeed',
    commuteTime: 40,
    distance: 12
  },
  {
    id: 'indeed-2',
    title: 'Quantitative Developer',
    company: 'JPMorgan Chase',
    location: 'New York, NY',
    description: 'Build quantitative models and trading systems...',
    url: 'https://www.indeed.com/jobs/view/654321',
    postedDate: new Date().toISOString(),
    salary: '$190,000 - $260,000',
    skills: ['Python', 'C++', 'Machine Learning', 'Statistics', 'Financial Modeling'],
    matchScore: 93,
    source: 'indeed',
    commuteTime: 35,
    distance: 8
  },

  // Healthcare Industry Jobs
  {
    id: 'company-1',
    title: 'Healthcare Software Engineer',
    company: 'Epic Systems',
    location: 'Madison, WI',
    description: 'Develop healthcare information systems and electronic medical records...',
    url: 'https://careers.epic.com/jobs/123456',
    postedDate: new Date().toISOString(),
    salary: '$120,000 - $160,000',
    skills: ['C#', 'SQL', 'Healthcare IT', 'HL7', 'FHIR'],
    matchScore: 88,
    source: 'company-website',
    commuteTime: 25,
    distance: 5
  },
  {
    id: 'company-2',
    title: 'Medical Device Software Developer',
    company: 'Medtronic',
    location: 'Minneapolis, MN',
    description: 'Develop software for medical devices and healthcare solutions...',
    url: 'https://jobs.medtronic.com/123456',
    postedDate: new Date().toISOString(),
    salary: '$130,000 - $180,000',
    skills: ['C++', 'Python', 'Medical Devices', 'FDA Regulations', 'Embedded Systems'],
    matchScore: 87,
    source: 'company-website',
    commuteTime: 20,
    distance: 3
  },

  // E-commerce Industry Jobs
  {
    id: 'remote-1',
    title: 'E-commerce Platform Developer',
    company: 'Shopify',
    location: 'Remote',
    description: 'Build and scale Shopify\'s e-commerce platform...',
    url: 'https://www.shopify.com/careers/123456',
    postedDate: new Date().toISOString(),
    salary: '$150,000 - $200,000',
    skills: ['Ruby', 'Rails', 'React', 'GraphQL', 'E-commerce'],
    matchScore: 91,
    source: 'company-website',
    commuteTime: 0,
    distance: 0
  },
  {
    id: 'remote-2',
    title: 'Payment Systems Engineer',
    company: 'Stripe',
    location: 'Remote',
    description: 'Work on Stripe\'s payment processing infrastructure...',
    url: 'https://stripe.com/jobs/123456',
    postedDate: new Date().toISOString(),
    salary: '$160,000 - $220,000',
    skills: ['Java', 'Scala', 'Payment Systems', 'Security', 'Distributed Systems'],
    matchScore: 94,
    source: 'company-website',
    commuteTime: 0,
    distance: 0
  },

  // Gaming Industry Jobs
  {
    id: 'linkedin-3',
    title: 'Game Developer',
    company: 'Electronic Arts',
    location: 'Redwood City, CA',
    description: 'Create immersive gaming experiences...',
    url: 'https://www.linkedin.com/jobs/view/123456789',
    postedDate: new Date().toISOString(),
    salary: '$140,000 - $190,000',
    skills: ['C++', 'Unity', 'Unreal Engine', 'Game Development', '3D Graphics'],
    matchScore: 89,
    source: 'linkedin',
    commuteTime: 30,
    distance: 8
  },
  {
    id: 'indeed-3',
    title: 'Mobile Game Developer',
    company: 'Zynga',
    location: 'San Francisco, CA',
    description: 'Develop mobile games for millions of players...',
    url: 'https://www.indeed.com/jobs/view/123456',
    postedDate: new Date().toISOString(),
    salary: '$130,000 - $180,000',
    skills: ['Unity', 'C#', 'Mobile Development', 'Game Design', 'iOS/Android'],
    matchScore: 88,
    source: 'indeed',
    commuteTime: 25,
    distance: 6
  }
];

export const searchJobs = async (params: JobSearchParams): Promise<Job[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Filter jobs based on search parameters
  const matchingJobs = mockJobs.filter(job => {
    const titleMatch = !params.title || 
      job.title.toLowerCase().includes(params.title.toLowerCase());
    
    const locationMatch = !params.location || 
      job.location.toLowerCase().includes(params.location.toLowerCase());
    
    const skillsMatch = !params.keywords || 
      params.keywords.split(',').some(keyword => 
        job.skills.some(skill => 
          skill.toLowerCase().includes(keyword.trim().toLowerCase())
        )
      );

    return titleMatch && locationMatch && skillsMatch;
  });

  // If no jobs found, return a relevant mock job from our database
  if (matchingJobs.length === 0) {
    // Find the most relevant job based on title or skills
    const relevantJob = mockJobs.find(job => {
      if (params.title && job.title.toLowerCase().includes(params.title.toLowerCase())) {
        return true;
      }
      if (params.keywords) {
        const keywords = params.keywords.split(',').map(k => k.trim().toLowerCase());
        return keywords.some(keyword => 
          job.skills.some(skill => skill.toLowerCase().includes(keyword))
        );
      }
      return false;
    });

    // If we found a relevant job, return it
    if (relevantJob) {
      return [relevantJob];
    }

    // Otherwise, return the first 5 jobs from our database
    return mockJobs.slice(0, 5);
  }

  // Return all matching jobs (up to 100)
  return matchingJobs.slice(0, 100);
}; 