"use client"

import { useState, useRef, useEffect, type FormEvent } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SendHorizonal, Bot, User } from "lucide-react"
import { healthChatbot } from "@/ai/flows/health-chatbot"

interface Message {
  role: "user" | "assistant"
  content: string
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm Mama's Helper AI. How can I assist you today with your pregnancy or infant health questions?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await healthChatbot({ question: input })
      const assistantMessage: Message = { role: "assistant", content: response.answer }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: Message = {
        role: "assistant",
        content: "I'm sorry, I encountered an error. Please try again.",
      }
      setMessages((prev) => [...prev, errorMessage])
      console.error("Chatbot error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
       <div>
            <h1 className="text-3xl font-bold tracking-tight">AI Health Chatbot</h1>
            <p className="text-muted-foreground">Ask any questions about pregnancy and infant health.</p>
        </div>
      <ScrollArea className="flex-1 my-4 pr-4" ref={scrollAreaRef}>
        <div className="space-y-6">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${
                message.role === "user" ? "justify-end" : ""
              }`}
            >
              {message.role === "assistant" && (
                <Avatar className="h-9 w-9">
                  <AvatarFallback><Bot /></AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-md rounded-lg p-3 text-sm ${
                  message.role === "user"
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted"
                }`}
              >
                {message.content}
              </div>
               {message.role === "user" && (
                <Avatar className="h-9 w-9">
                  <AvatarFallback><User /></AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3">
              <Avatar className="h-9 w-9">
                <AvatarFallback><Bot /></AvatarFallback>
              </Avatar>
              <div className="max-w-md rounded-lg p-3 text-sm bg-muted">
                <div className="flex items-center gap-2">
                    <span className="h-2 w-2 bg-foreground rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                    <span className="h-2 w-2 bg-foreground rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                    <span className="h-2 w-2 bg-foreground rounded-full animate-pulse"></span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="mt-auto">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            <SendHorizonal className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  )
}
