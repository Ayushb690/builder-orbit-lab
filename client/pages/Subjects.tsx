import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Users,
  Clock,
  TrendingUp,
  Plus,
  Calendar,
  MoreVertical,
  Settings,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";

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

interface AttendanceRecord {
  subjectId: string;
  date: string;
  status: "present" | "absent" | "extra" | "cancelled";
}

export default function Subjects() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<
    AttendanceRecord[]
  >([]);

  useEffect(() => {
    // Load data from localStorage
    const savedSubjects = localStorage.getItem("attendanceApp_subjects");
    const savedTimeSlots = localStorage.getItem("attendanceApp_timeSlots");
    const savedAttendance = localStorage.getItem("attendanceApp_attendance");

    if (savedSubjects) setSubjects(JSON.parse(savedSubjects));
    if (savedTimeSlots) setTimeSlots(JSON.parse(savedTimeSlots));
    if (savedAttendance) setAttendanceRecords(JSON.parse(savedAttendance));
  }, []);

  const getSubjectStats = (subjectId: string) => {
    const subjectRecords = attendanceRecords.filter(
      (record) => record.subjectId === subjectId,
    );
    const present = subjectRecords.filter(
      (record) => record.status === "present",
    ).length;
    const absent = subjectRecords.filter(
      (record) => record.status === "absent",
    ).length;
    const extra = subjectRecords.filter(
      (record) => record.status === "extra",
    ).length;
    const cancelled = subjectRecords.filter(
      (record) => record.status === "cancelled",
    ).length;

    const totalAttended = present + extra;
    const totalClasses = present + absent + extra;
    const attendancePercentage =
      totalClasses > 0 ? Math.round((totalAttended / totalClasses) * 100) : 0;

    return {
      present,
      absent,
      extra,
      cancelled,
      totalAttended,
      totalClasses,
      attendancePercentage,
    };
  };

  const getSubjectSchedule = (subjectId: string) => {
    const subjectSlots = timeSlots.filter(
      (slot) => slot.subjectId === subjectId,
    );
    return subjectSlots
      .map((slot) => `${slot.day} ${slot.startTime}-${slot.endTime}`)
      .join(", ");
  };

  const getAttendanceStatus = (percentage: number) => {
    if (percentage >= 90)
      return {
        label: "Excellent",
        variant: "default" as const,
        className: "bg-success hover:bg-success/90",
      };
    if (percentage >= 80)
      return { label: "Good", variant: "secondary" as const, className: "" };
    if (percentage >= 70)
      return { label: "Fair", variant: "outline" as const, className: "" };
    return { label: "Poor", variant: "destructive" as const, className: "" };
  };

  const overallStats = {
    totalSubjects: subjects.length,
    averageAttendance:
      subjects.length > 0
        ? Math.round(
            subjects.reduce(
              (acc, subject) =>
                acc + getSubjectStats(subject.id).attendancePercentage,
              0,
            ) / subjects.length,
          )
        : 0,
    totalClassesAttended: attendanceRecords.filter(
      (record) => record.status === "present" || record.status === "extra",
    ).length,
    totalScheduledClasses: timeSlots.length * 4, // Assuming 4 weeks for demo
  };

  if (subjects.length === 0) {
    return (
      <div className="space-y-6 pb-20 lg:pb-6">
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">No Subjects Found</h2>
          <p className="text-muted-foreground mb-6">
            Set up your subjects and schedule to get started
          </p>
          <Button asChild size="lg">
            <Link to="/setup">
              <Plus className="h-4 w-4 mr-2" />
              Setup Subjects & Schedule
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Subjects</h1>
          <p className="text-muted-foreground">
            Manage your subjects and track attendance
          </p>
        </div>
        <Button asChild>
          <Link to="/setup">
            <Settings className="h-4 w-4 mr-2" />
            Modify Setup
          </Link>
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Subjects
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overallStats.totalSubjects}
            </div>
            <p className="text-xs text-muted-foreground">Configured subjects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Attendance
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {overallStats.averageAttendance}%
            </div>
            <p className="text-xs text-success">Across all subjects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Classes Attended
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overallStats.totalClassesAttended}
            </div>
            <p className="text-xs text-muted-foreground">Total attended</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Weekly Classes
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{timeSlots.length}</div>
            <p className="text-xs text-muted-foreground">Scheduled per week</p>
          </CardContent>
        </Card>
      </div>

      {/* Subjects Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {subjects.map((subject) => {
          const stats = getSubjectStats(subject.id);
          const schedule = getSubjectSchedule(subject.id);
          const attendanceStatus = getAttendanceStatus(
            stats.attendancePercentage,
          );

          return (
            <Card
              key={subject.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div
                      className={`h-10 w-10 rounded-lg ${subject.color} flex items-center justify-center`}
                    >
                      <BookOpen className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{subject.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {subject.code}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit Subject</DropdownMenuItem>
                      <DropdownMenuItem>Export Data</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Instructor and Schedule */}
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Instructor:</span>{" "}
                      {subject.instructor}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Schedule:</span>{" "}
                      {schedule || "Not scheduled"}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Semester Limit:</span>{" "}
                      {subject.totalClasses} classes
                    </p>
                  </div>

                  {/* Attendance Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Attendance Rate
                      </span>
                      <Badge
                        variant={attendanceStatus.variant}
                        className={attendanceStatus.className}
                      >
                        {stats.attendancePercentage}% - {attendanceStatus.label}
                      </Badge>
                    </div>
                    <Progress
                      value={stats.attendancePercentage}
                      className="h-2"
                    />
                  </div>

                  {/* Detailed Stats */}
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">
                        Present
                      </div>
                      <div className="text-lg font-bold text-success">
                        {stats.present}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">
                        Absent
                      </div>
                      <div className="text-lg font-bold text-destructive">
                        {stats.absent}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Extra</div>
                      <div className="text-lg font-bold text-info">
                        {stats.extra}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">
                        Cancelled
                      </div>
                      <div className="text-lg font-bold text-muted-foreground">
                        {stats.cancelled}
                      </div>
                    </div>
                  </div>

                  {/* Progress towards semester limit */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Semester Progress
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {stats.totalAttended} / {subject.totalClasses}
                      </span>
                    </div>
                    <Progress
                      value={(stats.totalAttended / subject.totalClasses) * 100}
                      className="h-2"
                    />
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      asChild
                    >
                      <Link to="/calendar">
                        <Calendar className="h-4 w-4 mr-2" />
                        View Schedule
                      </Link>
                    </Button>
                    <Button size="sm" className="flex-1" asChild>
                      <Link to="/">
                        <Clock className="h-4 w-4 mr-2" />
                        Mark Today
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
