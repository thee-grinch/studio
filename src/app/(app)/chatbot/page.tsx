
"use client"

import { useState, useRef, useEffect, type FormEvent } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SendHorizonal, Bot, User, Lightbulb, Link as LinkIcon, BookOpen, Stethoscope, Weight } from "lucide-react"
import Link from "next/link"
import { fetchBackend } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface Message {
  role: "user" | "assistant"
  content: string
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [historyLoading, setHistoryLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await fetchBackend("/chat", "GET");
        // Map backend data to frontend Message interface
        const formattedHistory: Message[] = history.map((msg: any) => ({
          role: msg.sender === "user" ? "user" : "assistant",
          content: msg.message_text,
        }));
        setMessages(formattedHistory);
      } catch (error) {
        console.error("Failed to fetch chat history:", error); // Log error for debugging
        toast({
          title: "Error",
          description: "Failed to load chat history. Please try again.",
        });
      } finally {
        setHistoryLoading(false);
      }
    };
    fetchHistory();
  }, []); // Fetch history only on component mount

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

    // Add user message to UI immediately
 setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Save user message to backend
      await fetchBackend("/chat", "POST", {
        message_text: userMessage.content,
        sender: "user",
      });

      // Call backend AI endpoint for response
      const aiResponse = await fetchBackend("/ai/chat", "POST", {
 message: userMessage.content,
      });

      const assistantMessage: Message = {
        role: "assistant",
 content: aiResponse.response
 };

      // Save AI message to backend
      await fetchBackend("/chat", "POST", {
        sender: "assistant",
 content: assistantMessage.content,
      });

      // Add AI message to UI after saving
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
 console.error("Chatbot error:", error); // Log error for debugging
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
    <div className="grid lg:grid-cols-3 gap-8 h-full">
      {historyLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 border-4 border-t-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <div className="mt-4 text-xl font-semibold">Loading chat history...</div>
              <p className="text-muted-foreground text-sm">This may take a moment.</p>
            </div>
            </div>
        )}


      {/* Main Chat Area */}
      <div className="lg:col-span-2 flex flex-col h-[calc(100vh-12rem)] sm:h-[calc(100vh-10rem)]">
        <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Support Chat</h1>
            <p className="text-muted-foreground">Your AI companion for support and information.</p>
        </div>
        <ScrollArea className="flex-1 my-4 pr-4" ref={scrollAreaRef}>
          <div className="space-y-6">
             {!historyLoading && messages.length === 0 && (
              <div className="text-center text-muted-foreground italic">
                Start the conversation by typing a message below!
                <div className="mt-2 text-sm">Example questions: "What's typical for Week 14?", "Ask about second trimester nutrition", "How's my weight trend?"</div>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 ${
                  message.role === "user" ? "justify-end" : ""
                }`}
              >
                {message.role === "assistant" && (
                  <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
                    <AvatarFallback><Bot /></AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-xs sm:max-w-md rounded-lg p-3 text-sm ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {message.content}
                </div>
                {message.role === "user" && (
                  <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
                    <AvatarImage src="https://placehold.co/100x100.png" alt="@user" data-ai-hint="woman face" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && messages[messages.length -1]?.role === "user" && (
              <div className="flex items-start gap-3 ">
 <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
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

      {/* Right Side Panel */}
      <aside className="hidden lg:block">
        <div className="sticky top-20 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                Assistant Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start text-left h-auto">What's typical for Week 14?</Button>
              <Button variant="outline" className="w-full justify-start text-left h-auto">Ask about second trimester nutrition</Button>
              <Button variant="outline" className="w-full justify-start text-left h-auto">How's my weight trend?</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LinkIcon className="w-5 h-5" />
                Quick Links
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/appointments" passHref>
                <Button variant="secondary" className="w-full justify-start">
                  <Stethoscope className="mr-2" /> View Appointments
                </Button>
              </Link>
              <Link href="/pregnancy" passHref>
                <Button variant="secondary" className="w-full justify-start">
                  <Weight className="mr-2" /> Log Symptom/Weight
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Trusted Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <a href="#" className="block text-sm text-primary hover:underline">Understanding Second Trimester Changes</a>
              <a href="#" className="block text-sm text-primary hover:underline">Healthy Eating During Pregnancy</a>
            </CardContent>
          </Card>
        </div>
      </aside>
    </div>
  )
}
