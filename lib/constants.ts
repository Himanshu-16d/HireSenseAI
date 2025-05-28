export const TECHNOLOGIES = {
  // Programming Languages
  languages: [
    "Python", "JavaScript", "Java", "C++", "Go", "Rust", "TypeScript", "Kotlin", "Swift",
    "PHP", "Ruby", "Dart", "R", "MATLAB"
  ],

  // Frameworks & Libraries
  frameworks: [
    "React", "Angular", "Vue.js", "Svelte", "Node.js", "Express.js", "Spring Boot",
    "Django", "Flask", "Ruby on Rails", "Flutter", "React Native", "SwiftUI",
    "Kotlin Multiplatform", "TensorFlow", "PyTorch", "Scikit-learn",
    "Hugging Face Transformers", "Unity", "Unreal Engine", "Phaser.js"
  ],

  // Databases
  databases: [
    "MySQL", "PostgreSQL", "SQL Server", "Oracle", "MongoDB", "Redis", "Cassandra",
    "CouchDB", "Neo4j", "ArangoDB", "FaunaDB"
  ],

  // AI & ML
  ai_ml: [
    "Natural Language Processing", "Computer Vision", "Deep Learning",
    "Reinforcement Learning", "Generative AI", "Edge AI", "MLFlow",
    "Weights & Biases", "Kubeflow"
  ],

  // Cloud & DevOps
  cloud_devops: [
    "AWS", "Google Cloud", "Microsoft Azure", "IBM Cloud", "AWS Lambda",
    "Cloud Functions", "S3", "Blob Storage", "Docker", "Podman", "Kubernetes",
    "ECS", "Terraform", "Pulumi"
  ],

  // Web Technologies
  web: [
    "HTML", "CSS", "JavaScript", "WebAssembly", "WebSockets", "GraphQL",
    "REST APIs", "Progressive Web Apps", "Next.js", "Hugo", "Gatsby"
  ],

  // Cybersecurity
  security: [
    "Firewalls", "IDS", "IPS", "AES", "RSA", "TLS", "SSL", "OAuth2", "OpenID",
    "SAML", "Splunk", "IBM QRadar", "Metasploit", "Burp Suite", "CrowdStrike",
    "SentinelOne"
  ],

  // Mobile Development
  mobile: [
    "Swift", "Kotlin", "Flutter", "React Native", "Ionic", "Firebase", "AWS Amplify"
  ],

  // Development Tools
  dev_tools: [
    "Git", "GitHub", "GitLab", "Bitbucket", "Jenkins", "GitHub Actions", "CircleCI",
    "Docker", "Kubernetes", "Helm", "Prometheus", "Grafana", "ELK Stack", "Loki",
    "VS Code", "IntelliJ", "PyCharm", "Eclipse", "npm", "pip", "Maven", "Gradle",
    "Jest", "Mocha", "JUnit", "Selenium", "Cypress", "ESLint", "Prettier", "Black"
  ],

  // Blockchain
  blockchain: [
    "Solidity", "Vyper", "Ethereum", "Solana", "Polygon", "MetaMask",
    "WalletConnect", "Chainlink", "IPFS", "Arweave", "dApps", "DAOs", "DeFi"
  ],

  // Data Engineering
  data_engineering: [
    "Apache NiFi", "Talend", "Airbyte", "Snowflake", "BigQuery", "Redshift",
    "Tableau", "Power BI", "Looker", "Apache Kafka", "Flink", "Spark Streaming"
  ],

  // IoT & Embedded
  iot_embedded: [
    "Arduino", "ESP32", "Raspberry Pi", "MQTT", "CoAP", "Zigbee", "LoRaWAN",
    "Edge Computing Devices", "ROS", "Jetson Nano"
  ],

  // Emerging Technologies
  emerging: [
    "Qiskit", "D-Wave", "Unity XR", "WebXR", "Oculus SDK", "Digital Twins",
    "Autonomous Systems", "Drones", "Biometric Systems", "Alexa SDK",
    "Google Assistant SDK"
  ]
};

// Flattened list of all technologies for autocomplete
export const ALL_TECHNOLOGIES = Object.values(TECHNOLOGIES).flat();
