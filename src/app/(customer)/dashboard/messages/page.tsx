"use client";

import { Suspense, useMemo, useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, AlertCircle } from "lucide-react";
import {
  getChatConversations,
  getChatConversationById,
} from "@/lib/mock-bookings";

function MessagesContent() {
  const searchParams = useSearchParams();
  const conversations = useMemo(() => getChatConversations(), []);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(
    searchParams.get("worker") || (conversations.length > 0 ? conversations[0].id : null)
  );
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedConversation = useMemo(
    () => getChatConversationById(selectedConversationId || ""),
    [selectedConversationId]
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedConversation]);

  if (conversations.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Card className="p-12 text-center">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h2 className="text-xl font-bold text-heading mb-2">No Messages</h2>
          <p className="text-paragraph">
            Start booking services to message with workers
          </p>
        </Card>
      </div>
    );
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim()) {
      // In a real app, this would send the message to the backend
      setMessageText("");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-heading mb-1">Messages</h1>
        <p className="text-paragraph">
          Chat with workers about your bookings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
        {/* Conversations List */}
        <div className="lg:col-span-1 bg-secondary-background rounded-lg p-4 space-y-2 overflow-y-auto">
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => setSelectedConversationId(conversation.id)}
              className={`w-full text-left p-3 rounded-lg transition-all ${
                selectedConversationId === conversation.id
                  ? "bg-tertiary text-tertiary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              <div className="flex items-start gap-3 relative">
                <Avatar
                  src={conversation.workerImage}
                  alt={conversation.workerName}
                  size="sm"
                />
                <div className="flex-1 min-w-0">
                  <h3 className={`font-semibold ${
                    selectedConversationId === conversation.id
                      ? "text-white"
                      : "text-heading"
                  } truncate`}>
                    {conversation.workerName}
                  </h3>
                  <p className={`text-xs ${
                    selectedConversationId === conversation.id
                      ? "text-tertiary-foreground/70"
                      : "text-muted-foreground"
                  } truncate`}>
                    {conversation.lastMessage}
                  </p>
                </div>
                {conversation.unreadCount > 0 && (
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold text-white bg-red-500 rounded-full">
                      {conversation.unreadCount}
                    </span>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-3 flex flex-col bg-card border border-border rounded-lg overflow-hidden">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="border-b border-border p-4 flex items-center justify-between bg-secondary-background">
                <div className="flex items-center gap-3">
                  <Avatar
                    src={selectedConversation.workerImage}
                    alt={selectedConversation.workerName}
                    size="md"
                  />
                  <div>
                    <h2 className="font-bold text-heading">
                      {selectedConversation.workerName}
                    </h2>
                    <Badge variant="default" className="text-xs mt-1">
                      Online
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedConversation.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.senderType === "customer" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        message.senderType === "customer"
                          ? "bg-tertiary text-tertiary-foreground"
                          : "bg-secondary-background text-paragraph"
                      }`}
                    >
                      <p className="text-sm">{message.message}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.senderType === "customer"
                            ? "text-tertiary-foreground/70"
                            : "text-muted-foreground"
                        }`}
                      >
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form
                onSubmit={handleSendMessage}
                className="border-t border-border p-4 bg-secondary-background"
              >
                <div className="flex items-end gap-2">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 bg-card border border-border rounded-lg text-paragraph placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-tertiary"
                  />
                  <Button
                    type="submit"
                    variant="tertiary"
                    size="sm"
                    disabled={!messageText.trim()}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-96"><p>Loading messages...</p></div>}>
      <MessagesContent />
    </Suspense>
  );
}
