import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  TrendingUp,
  TrendingDown,
  Target,
  Calendar,
  BarChart3,
} from "lucide-react";

interface ChatMessage {
  id: string;
  type: "user" | "bot";
  message: string;
  timestamp: Date;
}

interface Subject {
  id: string;
  name: string;
  code: string;
  instructor: string;
  color: string;
  totalClasses: number;
}

interface AttendanceRecord {
  subjectId: string;
  date: string;
  status: "present" | "absent" | "extra" | "cancelled";
}

export default function AttendanceChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Get data for insights
  const getStudentData = () => {
    const savedSubjects = localStorage.getItem("attendanceApp_subjects");
    const savedAttendance = localStorage.getItem("attendanceApp_attendance");

    const subjects: Subject[] = savedSubjects ? JSON.parse(savedSubjects) : [];
    const records: AttendanceRecord[] = savedAttendance
      ? JSON.parse(savedAttendance)
      : [];

    return { subjects, records };
  };

  // Generate AI-like insights based on user query
  const generateBotResponse = (userMessage: string): string => {
    const { subjects, records } = getStudentData();
    const lowerMessage = userMessage.toLowerCase();

    // Calculate stats
    const totalPresent = records.filter((r) => r.status === "present").length;
    const totalAbsent = records.filter((r) => r.status === "absent").length;
    const totalExtra = records.filter((r) => r.status === "extra").length;
    const totalClasses = totalPresent + totalAbsent + totalExtra;
    const attendanceRate =
      totalClasses > 0
        ? Math.round(
            ((totalPresent + totalExtra * 2) /
              (totalPresent + totalAbsent + totalExtra * 2)) *
              100,
          )
        : 0;

    // Today's data
    const today = new Date().toISOString().split("T")[0];
    const todayRecords = records.filter((r) => r.date === today);
    const todayPresent = todayRecords.filter(
      (r) => r.status === "present",
    ).length;
    const todayExtra = todayRecords.filter((r) => r.status === "extra").length;

    // Subject-specific insights
    const subjectStats = subjects.map((subject) => {
      const subjectRecords = records.filter((r) => r.subjectId === subject.id);
      const present = subjectRecords.filter(
        (r) => r.status === "present",
      ).length;
      const absent = subjectRecords.filter((r) => r.status === "absent").length;
      const extra = subjectRecords.filter((r) => r.status === "extra").length;
      const remaining = Math.max(0, subject.totalClasses - extra * 2);

      return {
        ...subject,
        present,
        absent,
        extra,
        remaining,
        rate:
          present + absent + extra > 0
            ? Math.round(
                ((present + extra * 2) / (present + absent + extra * 2)) * 100,
              )
            : 0,
      };
    });

    // Response logic based on keywords
    if (lowerMessage.includes("attendance") || lowerMessage.includes("rate")) {
      return `Your overall attendance rate is ${attendanceRate}%. You've attended ${totalPresent + totalExtra * 2} classes out of ${totalPresent + totalAbsent + totalExtra * 2} total. ${attendanceRate >= 80 ? "🎉 Great job maintaining good attendance!" : "⚠️ Consider improving attendance to reach 80%+"}`;
    }

    if (lowerMessage.includes("today")) {
      const todayTotal = todayPresent + todayExtra * 2;
      return `Today you've marked ${todayPresent} regular classes and ${todayExtra} extra classes (worth ${todayExtra * 2} classes). Total attendance value for today: ${todayTotal} classes. ${todayTotal > 0 ? "✅ Good job staying on track!" : "📅 Don't forget to mark your attendance!"}`;
    }

    if (lowerMessage.includes("extra") || lowerMessage.includes("bonus")) {
      return `You've taken ${totalExtra} extra classes worth ${totalExtra * 2} regular classes! This reduces your remaining required classes. Extra classes are a great way to get ahead. 🚀`;
    }

    if (
      lowerMessage.includes("subject") ||
      lowerMessage.includes("performance")
    ) {
      if (subjectStats.length === 0)
        return "You haven't set up any subjects yet. Go to setup to add your subjects!";

      const best = subjectStats.reduce((a, b) => (a.rate > b.rate ? a : b));
      const worst = subjectStats.reduce((a, b) => (a.rate < b.rate ? a : b));

      return `📊 Subject Performance:\n• Best: ${best.name} (${best.rate}%)\n• Needs attention: ${worst.name} (${worst.rate}%)\n• Total subjects: ${subjects.length}`;
    }

    if (lowerMessage.includes("goal") || lowerMessage.includes("target")) {
      const classesNeeded = subjectStats.reduce(
        (sum, s) => sum + s.remaining,
        0,
      );
      return `🎯 Your Goals:\n• Total remaining classes: ${classesNeeded}\n• Average attendance target: 80%+\n• Current rate: ${attendanceRate}%\n${attendanceRate >= 80 ? "You're on track! 🌟" : "Focus on consistent attendance to reach your goal! 💪"}`;
    }

    if (lowerMessage.includes("week") || lowerMessage.includes("weekly")) {
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split("T")[0];
      });

      const weekRecords = records.filter((r) => last7Days.includes(r.date));
      const weekPresent = weekRecords.filter(
        (r) => r.status === "present",
      ).length;
      const weekExtra = weekRecords.filter((r) => r.status === "extra").length;

      return `📅 This Week:\n• Regular classes: ${weekPresent}\n• Extra classes: ${weekExtra} (worth ${weekExtra * 2})\n• Total attendance value: ${weekPresent + weekExtra * 2}\nKeep up the momentum! 🔥`;
    }

    if (lowerMessage.includes("help") || lowerMessage.includes("what")) {
      return `🤖 I can help you with:\n• Overall attendance rates\n• Today's performance\n• Subject-wise analysis\n• Weekly summaries\n• Goal tracking\n• Extra class benefits\n\nJust ask me about any of these topics!`;
    }

    // Default responses
    const responses = [
      `Based on your data, you have a ${attendanceRate}% attendance rate. ${attendanceRate >= 85 ? "Excellent work! 🌟" : attendanceRate >= 75 ? "Good progress, keep it up! 📈" : "Consider taking more classes to improve your rate. 💪"}`,
      `You've taken ${totalExtra} extra classes, saving you ${totalExtra * 2} regular classes! Smart strategy! 🎯`,
      `Your attendance trend shows ${totalPresent} present classes and ${totalAbsent} missed classes. Focus on consistency! 📊`,
      `Tip: Extra classes count as 2 regular classes, helping you reach requirements faster! 🚀`,
      `You have ${subjects.length} subjects configured. Each subject has different attendance requirements. 📚`,
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      message: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(
      () => {
        const botResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: "bot",
          message: generateBotResponse(userMessage.message),
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, botResponse]);
        setIsTyping(false);
      },
      1000 + Math.random() * 1000,
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const initializeChat = () => {
    if (messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: "welcome",
        type: "bot",
        message:
          "👋 Hi! I'm your attendance assistant. I can provide insights about your attendance data, performance analysis, and help you track your goals. What would you like to know?",
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  };

  useEffect(() => {
    if (isOpen) {
      initializeChat();
    }
  }, [isOpen]);

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-primary hover:bg-primary/90"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-4">
          <div className="w-full max-w-md h-[500px] bg-background rounded-lg shadow-2xl border flex flex-col">
            {/* Header */}
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                Attendance Assistant
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === "user"
                        ? "bg-primary text-primary-foreground ml-4"
                        : "bg-muted mr-4"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {message.type === "bot" && (
                        <Bot className="h-4 w-4 mt-0.5 text-primary" />
                      )}
                      {message.type === "user" && (
                        <User className="h-4 w-4 mt-0.5" />
                      )}
                      <div className="whitespace-pre-line text-sm">
                        {message.message}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted p-3 rounded-lg mr-4">
                    <div className="flex items-center gap-2">
                      <Bot className="h-4 w-4 text-primary" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-primary rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-primary rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </CardContent>

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about your attendance..."
                  className="flex-1"
                />
                <Button onClick={sendMessage} size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              {/* Quick action buttons */}
              <div className="flex gap-2 mt-2 flex-wrap">
                <Badge
                  variant="secondary"
                  className="cursor-pointer hover:bg-secondary/80"
                  onClick={() => setInputValue("What's my attendance rate?")}
                >
                  <BarChart3 className="h-3 w-3 mr-1" />
                  Attendance Rate
                </Badge>
                <Badge
                  variant="secondary"
                  className="cursor-pointer hover:bg-secondary/80"
                  onClick={() => setInputValue("How did I do today?")}
                >
                  <Calendar className="h-3 w-3 mr-1" />
                  Today
                </Badge>
                <Badge
                  variant="secondary"
                  className="cursor-pointer hover:bg-secondary/80"
                  onClick={() => setInputValue("Show my goals")}
                >
                  <Target className="h-3 w-3 mr-1" />
                  Goals
                </Badge>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
