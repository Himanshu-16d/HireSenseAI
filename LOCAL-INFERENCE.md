# Local Inference for HireSenseAI

This document explains how to use HireSenseAI without relying on the NVIDIA API endpoint, by running the AI models locally in your browser or on your own server.

## Why Local Inference?

Running AI models locally offers several advantages:
- No API key required
- No usage limits or costs
- Complete privacy - your data never leaves your device
- No dependency on external services
- Works offline

## Setup Instructions

### Option 1: Browser-based Inference (Easiest)

1. Toggle the "Using NVIDIA API" switch in the navbar to "Using Local Inference"
2. The application will reload and start using WebLLM to run models directly in your browser
3. The first time you use a feature, the model will be downloaded to your browser (~2-4GB)

### Option 2: Local Server Setup (Advanced)

For more powerful inference on your own machine:

1. Run the setup script:
   ```
   npm run setup-local
   ```

2. Download the model files manually:
   - Visit [Hugging Face](https://huggingface.co/deepseek-ai/deepseek-r1)
   - Download model files to the `models/deepseek-r1` directory

3. Set up a local inference server using one of these options:
   - [NVIDIA NIM](https://www.nvidia.com/en-us/ai-data-science/products/nim/) - For NVIDIA GPU users
   - [llama.cpp](https://github.com/ggerganov/llama.cpp) - CPU-based inference
   - [Ollama](https://ollama.com/) - Easy local model deployment

4. Update the `lib/local-inference.ts` file to connect to your local server

5. Toggle the "Using NVIDIA API" switch in the navbar to "Using Local Inference"

## Model Information

This project uses the following models locally:
- [Deepseek R1](https://huggingface.co/deepseek-ai/deepseek-r1) - A powerful language model for resume analysis and enhancement

## Troubleshooting

If you encounter issues with local inference:

1. Check browser console for errors
2. Ensure you have sufficient disk space (4GB minimum)
3. Modern browser required (Chrome, Firefox, Edge)
4. For WebLLM, WebGPU support helps but is not required
5. For server-based inference, ensure ports are properly configured

## Performance Considerations

Local inference performance depends on your hardware:
- Browser-based inference works best on modern machines with 8GB+ RAM
- GPU acceleration significantly improves performance
- First inference is slow due to model loading, subsequent runs are faster
- Reduce max_tokens parameter for faster responses

## Privacy and Data Usage

When using local inference:
- All data processing happens on your device
- No data is sent to external servers
- Model weights are downloaded once and cached 