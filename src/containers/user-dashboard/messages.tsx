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

  /* ==================== AUTO-SCROLL EFFECT ==================== */
  useEffect(() => {
    // Only scroll into view if conversation changes, not on every render
    if (messagesEndRef.current) {
      setTimeout(() => {
        messagesEndRef.current?.parentElement?.scrollTo({
          top: messagesEndRef.current.parentElement.scrollHeight,
          behavior: "auto"
        });
      }, 0);
    }
  }, [selectedConversation?.id]);

  /* ==================== EMPTY STATE ==================== */
  if (conversations.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Card className="p-12 text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-muted-foreground opacity-50" />
          <h2 className="mb-2 text-xl font-bold text-heading">No Messages</h2>
          <p className="text-paragraph">
            Start booking services to message with workers
          </p>
        </Card>
      </div>
    );
  }

  /* ==================== SEND MESSAGE HANDLER ==================== */
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim()) {
      // In a real app, this would send the message to the backend
      setMessageText("");
    }
  };

  return (
    <div className="h-full space-y-6">
      {/* ==================== PAGE HEADER ==================== */}
      <div>
        <h1 className="mb-1 text-3xl font-bold text-heading">Messages</h1>
        <p className="text-paragraph">
          Chat with workers about your bookings
        </p>
      </div>

      {/* ==================== MAIN CONTENT ==================== */}
      <div className="grid min-h-[500px] flex-1 grid-cols-1 gap-4 lg:min-h-[600px] lg:grid-cols-5 lg:gap-6">
        {/* ==================== CONVERSATIONS LIST ==================== */}
        <div className="max-h-[250px] space-y-2 overflow-y-auto rounded-lg bg-secondary-background p-4 lg:col-span-2 lg:max-h-none">
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => setSelectedConversationId(conversation.id)}
              className={`w-full rounded-lg p-3 text-left transition-all ${
                selectedConversationId === conversation.id
                  ? "bg-tertiary text-tertiary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              <div className="relative flex items-start gap-2 md:gap-3">
                <Avatar
                  src={conversation.workerImage}
                  alt={conversation.workerName}
                  size="sm"
                />
                <div className="hidden min-w-0 flex-1 md:block">
                  <h3 className={`truncate text-sm font-semibold ${
                    selectedConversationId === conversation.id
                      ? "text-white"
                      : "text-heading"
                  }`}>
                    {conversation.workerName}
                  </h3>
                  <p className={`truncate text-xs ${
                    selectedConversationId === conversation.id
                      ? "text-tertiary-foreground/70"
                      : "text-muted-foreground"
                  }`}>
                    {conversation.lastMessage}
                  </p>
                </div>
                {conversation.unreadCount > 0 && (
                  <div className="flex-shrink-0">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                      {conversation.unreadCount}
                    </span>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* ==================== CHAT AREA ==================== */}
        <div className="flex flex-col overflow-hidden rounded-lg border border-border bg-card lg:col-span-3">
          {selectedConversation ? (
            <>
              {/* ==================== CHAT HEADER ==================== */}
              <div className="flex items-center justify-between border-b border-border bg-secondary-background p-4">
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
                    <Badge variant="default" className="mt-1 text-xs">
                      Online
                    </Badge>
                  </div>
                </div>
              </div>

              {/* ==================== MESSAGES AREA ==================== */}
              <div className="flex-1 space-y-4 overflow-y-auto p-4">
                {selectedConversation.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.senderType === "customer" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs rounded-lg px-4 py-2 ${
                        message.senderType === "customer"
                          ? "bg-tertiary text-tertiary-foreground"
                          : "bg-secondary-background text-paragraph"
                      }`}
                    >
                      <p className="text-sm">{message.message}</p>
                      <p
                        className={`mt-1 text-xs ${
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

              {/* ==================== MESSAGE INPUT ==================== */}
              <form
                onSubmit={handleSendMessage}
                className="border-t border-border bg-secondary-background p-4"
              >
                <div className="flex items-end gap-2">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 rounded-lg border border-border bg-card px-4 py-2 text-paragraph placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-tertiary"
                  />
                  <Button
                    type="submit"
                    variant="tertiary"
                    size="sm"
                    disabled={!messageText.trim()}
                  >
                    <Send className="h-4 w-4" />
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

function Messages() {
  return (
    <Suspense fallback={<div className="flex h-96 items-center justify-center"><p>Loading messages...</p></div>}>
      <MessagesContent />
    </Suspense>
  );
}

export default Messages;
