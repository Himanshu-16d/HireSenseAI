#!/usr/bin/env node

/**
 * This script downloads and sets up the local models for inference
 * without relying on the NVIDIA API endpoint.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

const MODEL_DIR = path.join(__dirname, '..', 'models');
const MODEL_CONFIG = {
  "deepseek-r1": {
    huggingface: "deepseek-ai/deepseek-r1",
    files: ["model.safetensors", "tokenizer.json", "config.json"]
  }
};

// Create models directory if it doesn't exist
if (!fs.existsSync(MODEL_DIR)) {
  fs.mkdirSync(MODEL_DIR, { recursive: true });
  console.log(`Created models directory at ${MODEL_DIR}`);
}

async function downloadModel(modelName) {
  const modelConfig = MODEL_CONFIG[modelName];
  if (!modelConfig) {
    console.error(`Model ${modelName} not found in configuration`);
    return false;
  }

  const modelDir = path.join(MODEL_DIR, modelName);
  if (!fs.existsSync(modelDir)) {
    fs.mkdirSync(modelDir, { recursive: true });
  }

  console.log(`Setting up ${modelName} model...`);
  
  try {
    // For this example, we're just creating placeholder files
    // In a real implementation, you would download the actual model files
    
    for (const file of modelConfig.files) {
      const filePath = path.join(modelDir, file);
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, `# This is a placeholder for ${file}\n# Download the actual model file from ${modelConfig.huggingface}`);
        console.log(`Created placeholder for ${file}`);
      }
    }

    console.log(`Model ${modelName} setup complete!`);
    console.log(`In a real implementation, you would download the model files from ${modelConfig.huggingface}`);
    console.log("For local inference, you should:");
    console.log("1. Download the model files from Hugging Face or NVIDIA");
    console.log("2. Set up a local inference server (e.g., using TensorRT-LLM or similar)");
    console.log("3. Update the runLocalInference function in lib/nvidia-client.ts to connect to your local server");
    
    return true;
  } catch (error) {
    console.error(`Error setting up model ${modelName}:`, error);
    return false;
  }
}

async function main() {
  // Set USE_LOCAL_INFERENCE to true in .env file
  const envFile = path.join(__dirname, '..', '.env');
  let envContent = '';
  
  if (fs.existsSync(envFile)) {
    envContent = fs.readFileSync(envFile, 'utf8');
    
    // Update existing USE_LOCAL_INFERENCE if it exists
    if (envContent.includes('USE_LOCAL_INFERENCE=')) {
      envContent = envContent.replace(/USE_LOCAL_INFERENCE=.*/, 'USE_LOCAL_INFERENCE=true');
    } else {
      // Add USE_LOCAL_INFERENCE if it doesn't exist
      envContent += '\nUSE_LOCAL_INFERENCE=true\n';
    }
  } else {
    // Create new .env file if it doesn't exist
    envContent = 'USE_LOCAL_INFERENCE=true\n';
  }
  
  fs.writeFileSync(envFile, envContent);
  console.log('Updated .env file with USE_LOCAL_INFERENCE=true');

  // Download models
  for (const modelName of Object.keys(MODEL_CONFIG)) {
    await downloadModel(modelName);
  }

  console.log('\nSetup complete!');
  console.log('To use local inference, ensure you:');
  console.log('1. Have downloaded the actual model files');
  console.log('2. Have set up a local inference server');
  console.log('3. Have updated the runLocalInference function in lib/nvidia-client.ts');
  console.log('\nYou can now run your application with local inference!');
}

main().catch(console.error); 