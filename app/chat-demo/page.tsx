import { StreamingChat } from "@/components/streaming-chat";

export default function ChatDemoPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Groq AI Streaming Chat Demo</h1>
      <p className="text-center mb-8 text-gray-600">
        This demo shows how to use the Groq API with streaming responses.
        <br />
        The model used is llama3-70b-8192.
      </p>
      <StreamingChat />
    </div>
  );
} 