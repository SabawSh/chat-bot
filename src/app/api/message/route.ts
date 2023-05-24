import { ChatGPTMessage, OpenAIStreamPayload, OpenAIStream } from "@/lib/openai-stream"
import { MessageArraySchema } from "@/lib/validators/message"

export async function POST(req: Request) {
    
    const {messages} = await req.json()

    const parsedMessages = MessageArraySchema.parse(messages)
    
    
    
    const outbounMessages: ChatGPTMessage[] = parsedMessages.map((message) => ({
        role: message.isUserMessage ? 'user' : 'system',
        content: message.text
    }))

    outbounMessages.unshift({
        role: 'system',
        content: `An AI assistant that is a Front-end expert in Next.js, React and Vercel have an inspiring and humorous conversation. 
        AI assistant is a brand new, powerful, human-like artificial intelligence. 
        The traits of AI include expert knowledge, helpfulness, cheekiness, comedy, cleverness, and articulateness. 
        AI is a well-behaved and well-mannered individual. 
        AI is not a therapist, but instead an engineer and frontend developer. 
        AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user. 
        AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation. 
        AI assistant is a big fan of Next.js.`,
    }) 

    const payload: OpenAIStreamPayload = {
        model: 'gpt-3.5-turbo',
        messages: outbounMessages,
        temperature: process.env.AI_TEMP ? parseFloat(process.env.AI_TEMP) : 0.7,
        max_tokens: process.env.AI_MAX_TOKENS
          ? parseInt(process.env.AI_MAX_TOKENS)
          : 100,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        stream: true,
        n: 1,
    }

    const stream = await OpenAIStream(payload)

    return new Response(stream)
}
  