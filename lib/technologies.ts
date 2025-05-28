export const TECHNOLOGIES = {
  programmingLanguages: [
    'Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'C#', 'Go', 'Ruby', 'Swift', 'Kotlin', 'PHP', 'Rust', 'Scala'
  ],
  webFrontend: [
    'React', 'Angular', 'Vue.js', 'Next.js', 'Svelte', 'HTML5', 'CSS3', 'Sass/SCSS', 'Tailwind CSS', 'Material-UI', 'Bootstrap'
  ],
  webBackend: [
    'Node.js', 'Express.js', 'Django', 'Flask', 'Spring Boot', 'Laravel', 'ASP.NET Core', 'FastAPI', 'NestJS'
  ],
  databases: [
    'PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'SQLite', 'DynamoDB', 'Cassandra', 'Elasticsearch', 'Firebase'
  ],
  cloud: [
    'AWS', 'Azure', 'Google Cloud', 'Heroku', 'DigitalOcean', 'Vercel', 'Netlify', 'Kubernetes', 'Docker'
  ],
  mobile: [
    'React Native', 'Flutter', 'iOS/Swift', 'Android/Kotlin', 'Xamarin', 'Ionic'
  ],
  aiMl: [
    'TensorFlow', 'PyTorch', 'scikit-learn', 'Pandas', 'NumPy', 'OpenCV', 'Keras', 'CUDA', 'Jupyter'
  ],
  devOps: [
    'Git', 'GitHub Actions', 'Jenkins', 'CircleCI', 'Terraform', 'Ansible', 'Prometheus', 'Grafana', 'ELK Stack'
  ],
  testing: [
    'Jest', 'React Testing Library', 'Cypress', 'Selenium', 'JUnit', 'PyTest', 'Mocha', 'Chai'
  ]
};

// Flattened list of all technologies for easy searching
export const ALL_TECHNOLOGIES = Object.values(TECHNOLOGIES).flat();
