import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  BookOpen
} from "lucide-react";

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedSubject, setSelectedSubject] = useState("all");

  // Mock data
  const subjects = [
    { id: "all", name: "All Subjects" },
    { id: "math", name: "Mathematics" },
    { id: "physics", name: "Physics" },
    { id: "chemistry", name: "Chemistry" },
    { id: "english", name: "English" },
  ];

  const attendanceData = [
    {
      date: "2024-01-15",
      subject: "Mathematics",
      time: "09:00 AM",
      status: "present",
      students: { present: 28, total: 30 },
    },
    {
      date: "2024-01-15",
      subject: "Physics",
      time: "11:00 AM",
      status: "present",
      students: { present: 25, total: 30 },
    },
    {
      date: "2024-01-15",
      subject: "Chemistry",
      time: "02:00 PM",
      status: "absent",
      students: { present: 22, total: 30 },
    },
    {
      date: "2024-01-16",
      subject: "English",
      time: "10:00 AM",
      status: "pending",
      students: { present: 0, total: 30 },
    },
  ];

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const dayAttendance = attendanceData.filter(item => item.date === dateStr);
      days.push({ day, dateStr, attendance: dayAttendance });
    }

    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const todayClasses = attendanceData.filter(item => {
    const today = new Date().toISOString().split('T')[0];
    return item.date === today;
  });

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">Track and manage class attendance</p>
        </div>
        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select subject" />
          </SelectTrigger>
          <SelectContent>
            {subjects.map((subject) => (
              <SelectItem key={subject.id} value={subject.id}>
                {subject.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </CardTitle>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigateMonth('prev')}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigateMonth('next')}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1">
                {dayNames.map((dayName) => (
                  <div
                    key={dayName}
                    className="p-2 text-center text-sm font-medium text-muted-foreground"
                  >
                    {dayName}
                  </div>
                ))}
                {generateCalendarDays().map((dayData, index) => (
                  <div
                    key={index}
                    className={`p-2 min-h-[60px] border rounded-lg text-center ${
                      dayData
                        ? "hover:bg-muted cursor-pointer"
                        : "text-muted-foreground/30"
                    }`}
                  >
                    {dayData && (
                      <>
                        <div className="text-sm font-medium">{dayData.day}</div>
                        {dayData.attendance.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1 justify-center">
                            {dayData.attendance.slice(0, 2).map((att, i) => (
                              <div
                                key={i}
                                className={`w-2 h-2 rounded-full ${
                                  att.status === "present"
                                    ? "bg-success"
                                    : att.status === "absent"
                                    ? "bg-destructive"
                                    : "bg-warning"
                                }`}
                              />
                            ))}
                            {dayData.attendance.length > 2 && (
                              <div className="text-xs text-muted-foreground">
                                +{dayData.attendance.length - 2}
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Classes */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Today's Classes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todayClasses.length > 0 ? (
                  todayClasses.map((classItem, index) => (
                    <div key={index} className="p-3 rounded-lg border">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium">{classItem.subject}</h4>
                          <p className="text-sm text-muted-foreground">{classItem.time}</p>
                        </div>
                        <Badge
                          variant={
                            classItem.status === "present"
                              ? "default"
                              : classItem.status === "absent"
                              ? "destructive"
                              : "secondary"
                          }
                          className={
                            classItem.status === "present"
                              ? "bg-success hover:bg-success/90"
                              : ""
                          }
                        >
                          {classItem.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        {classItem.students.present}/{classItem.students.total} students
                      </div>
                      {classItem.status === "pending" && (
                        <Button className="w-full mt-3" size="sm">
                          Mark Attendance
                        </Button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <BookOpen className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No classes today</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="text-sm">Present Today</span>
                  </div>
                  <span className="font-medium">85%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-destructive" />
                    <span className="text-sm">Absent Today</span>
                  </div>
                  <span className="font-medium">15%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="text-sm">Total Students</span>
                  </div>
                  <span className="font-medium">150</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
