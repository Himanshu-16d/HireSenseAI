import { NextRequest } from 'next/server';
import { streamGroqAPI } from '@/lib/groq-client';

// This API route handles streaming chat completions from Groq
export async function POST(request: NextRequest) {
  const { messages, model = "llama3-70b-8192", temperature = 0.7, max_tokens = 4096, top_p = 1, stop = null } = await request.json();

  // Create a new ReadableStream
  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Stream responses from Groq API
        for await (const chunk of streamGroqAPI(
          messages,
          model,
          { temperature, max_tokens, top_p, stop }
        )) {
          // Send each chunk to the client
          controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(chunk)}\n\n`));
        }
        
        // Send the [DONE] message to indicate the stream is complete
        controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
        controller.close();
      } catch (error) {
        console.error('Error streaming chat completion:', error);
        controller.enqueue(
          new TextEncoder().encode(
            `data: ${JSON.stringify({ error: 'An error occurred during streaming' })}\n\n`
          )
        );
        controller.close();
      }
    },
  });

  // Return the stream with appropriate headers
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
} 