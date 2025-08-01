import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Plus,
  Trash2,
  BookOpen,
  Clock,
  Users,
  Settings,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Subject {
  id: string;
  name: string;
  code: string;
  instructor: string;
  color: string;
  totalClasses: number;
}

interface TimeSlot {
  id: string;
  subjectId: string;
  day: string;
  startTime: string;
  endTime: string;
}

export default function Setup() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [currentSubject, setCurrentSubject] = useState({
    name: "",
    code: "",
    instructor: "",
    totalClasses: 0,
  });
  const [currentTimeSlot, setCurrentTimeSlot] = useState({
    subjectId: "",
    day: "",
    startTime: "",
    endTime: "",
  });

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const timeOptions = [
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
  ];

  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-orange-500",
    "bg-red-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
  ];

  const addSubject = () => {
    if (currentSubject.name && currentSubject.code) {
      const newSubject: Subject = {
        id: Date.now().toString(),
        ...currentSubject,
        color: colors[subjects.length % colors.length],
      };
      setSubjects([...subjects, newSubject]);
      setCurrentSubject({
        name: "",
        code: "",
        instructor: "",
        totalClasses: 0,
      });
    }
  };

  const removeSubject = (id: string) => {
    setSubjects(subjects.filter((s) => s.id !== id));
    setTimeSlots(timeSlots.filter((ts) => ts.subjectId !== id));
  };

  const addTimeSlot = () => {
    if (
      currentTimeSlot.subjectId &&
      currentTimeSlot.day &&
      currentTimeSlot.startTime &&
      currentTimeSlot.endTime
    ) {
      const newTimeSlot: TimeSlot = {
        id: Date.now().toString(),
        ...currentTimeSlot,
      };
      setTimeSlots([...timeSlots, newTimeSlot]);
      setCurrentTimeSlot({
        subjectId: "",
        day: "",
        startTime: "",
        endTime: "",
      });
    }
  };

  const removeTimeSlot = (id: string) => {
    setTimeSlots(timeSlots.filter((ts) => ts.id !== id));
  };

  const getTimeSlotsByDay = (day: string) => {
    return timeSlots
      .filter((ts) => ts.day === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const getSubjectById = (id: string) => {
    return subjects.find((s) => s.id === id);
  };

  const handleSaveAndContinue = () => {
    // Save to localStorage for now (in a real app, this would go to a backend)
    localStorage.setItem("attendanceApp_subjects", JSON.stringify(subjects));
    localStorage.setItem("attendanceApp_timeSlots", JSON.stringify(timeSlots));
    localStorage.setItem("attendanceApp_setupComplete", "true");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
              <Calendar className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold">AttendanceTracker Setup</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Configure your subjects and weekly schedule to get started
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Subject Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Add Subjects
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="subjectName">Subject Name</Label>
                  <Input
                    id="subjectName"
                    placeholder="e.g., Mathematics"
                    value={currentSubject.name}
                    onChange={(e) =>
                      setCurrentSubject({
                        ...currentSubject,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="subjectCode">Subject Code</Label>
                  <Input
                    id="subjectCode"
                    placeholder="e.g., MATH101"
                    value={currentSubject.code}
                    onChange={(e) =>
                      setCurrentSubject({
                        ...currentSubject,
                        code: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="instructor">Instructor</Label>
                  <Input
                    id="instructor"
                    placeholder="e.g., Dr. Smith"
                    value={currentSubject.instructor}
                    onChange={(e) =>
                      setCurrentSubject({
                        ...currentSubject,
                        instructor: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="totalClasses">
                    Total Classes This Semester
                  </Label>
                  <Input
                    id="totalClasses"
                    type="number"
                    placeholder="e.g., 45"
                    value={currentSubject.totalClasses || ""}
                    onChange={(e) =>
                      setCurrentSubject({
                        ...currentSubject,
                        totalClasses: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <Button onClick={addSubject} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Subject
                </Button>
              </div>

              {/* Added Subjects */}
              {subjects.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Added Subjects</h4>
                  {subjects.map((subject) => (
                    <div
                      key={subject.id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-4 w-4 rounded-full ${subject.color}`}
                        />
                        <div>
                          <p className="font-medium">{subject.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {subject.code} • {subject.totalClasses} classes
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSubject(subject.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Schedule Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Weekly Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {subjects.length > 0 ? (
                <>
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="scheduleSubject">Subject</Label>
                      <Select
                        value={currentTimeSlot.subjectId}
                        onValueChange={(value) =>
                          setCurrentTimeSlot({
                            ...currentTimeSlot,
                            subjectId: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {subjects.map((subject) => (
                            <SelectItem key={subject.id} value={subject.id}>
                              {subject.name} ({subject.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="scheduleDay">Day</Label>
                      <Select
                        value={currentTimeSlot.day}
                        onValueChange={(value) =>
                          setCurrentTimeSlot({
                            ...currentTimeSlot,
                            day: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select day" />
                        </SelectTrigger>
                        <SelectContent>
                          {days.map((day) => (
                            <SelectItem key={day} value={day}>
                              {day}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="startTime">Start Time</Label>
                        <Select
                          value={currentTimeSlot.startTime}
                          onValueChange={(value) =>
                            setCurrentTimeSlot({
                              ...currentTimeSlot,
                              startTime: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Start" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeOptions.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="endTime">End Time</Label>
                        <Select
                          value={currentTimeSlot.endTime}
                          onValueChange={(value) =>
                            setCurrentTimeSlot({
                              ...currentTimeSlot,
                              endTime: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="End" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeOptions.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button onClick={addTimeSlot} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add to Schedule
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Add subjects first to create your schedule
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Weekly Calendar View */}
        {timeSlots.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Weekly Schedule Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
                {days.map((day) => (
                  <div key={day} className="space-y-2">
                    <h4 className="font-medium text-center">{day}</h4>
                    <div className="space-y-1">
                      {getTimeSlotsByDay(day).map((slot) => {
                        const subject = getSubjectById(slot.subjectId);
                        return (
                          <div
                            key={slot.id}
                            className={`p-2 rounded text-white text-xs relative group ${subject?.color || "bg-gray-500"}`}
                          >
                            <div className="font-medium">{subject?.name}</div>
                            <div className="text-xs opacity-90">
                              {slot.startTime} - {slot.endTime}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute -top-1 -right-1 h-6 w-6 bg-red-500 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeTimeSlot(slot.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Continue Button */}
        {subjects.length > 0 && timeSlots.length > 0 && (
          <div className="text-center">
            <Button onClick={handleSaveAndContinue} size="lg" className="px-8">
              Save & Continue to Dashboard
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
