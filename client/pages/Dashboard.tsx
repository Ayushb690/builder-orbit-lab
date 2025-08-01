import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  Clock,
  Users,
  TrendingUp,
  CheckCircle,
  XCircle,
  Plus,
  BookOpen,
  UserCheck,
  UserX,
  Clock3,
  Ban
} from "lucide-react";
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
  status: 'present' | 'absent' | 'extra' | 'cancelled';
}

export default function Dashboard() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [todaysSubjects, setTodaysSubjects] = useState<(Subject & { timeSlot?: TimeSlot, attendanceStatus?: string })[]>([]);

  useEffect(() => {
    // Load data from localStorage
    const savedSubjects = localStorage.getItem('attendanceApp_subjects');
    const savedTimeSlots = localStorage.getItem('attendanceApp_timeSlots');
    const savedAttendance = localStorage.getItem('attendanceApp_attendance');

    if (savedSubjects) setSubjects(JSON.parse(savedSubjects));
    if (savedTimeSlots) setTimeSlots(JSON.parse(savedTimeSlots));
    if (savedAttendance) setAttendanceRecords(JSON.parse(savedAttendance));
  }, []);

  useEffect(() => {
    // Get today's day name
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const todayStr = new Date().toISOString().split('T')[0];

    // Find today's scheduled subjects
    const todaysSlots = timeSlots.filter(slot => slot.day === today);
    const todaysSubjectsWithStatus = todaysSlots.map(slot => {
      const subject = subjects.find(s => s.id === slot.subjectId);
      const attendanceRecord = attendanceRecords.find(
        record => record.subjectId === slot.subjectId && record.date === todayStr
      );
      
      return {
        ...subject!,
        timeSlot: slot,
        attendanceStatus: attendanceRecord?.status
      };
    }).filter(Boolean);

    setTodaysSubjects(todaysSubjectsWithStatus);
  }, [subjects, timeSlots, attendanceRecords]);

  const markAttendance = (subjectId: string, status: 'present' | 'absent' | 'extra' | 'cancelled') => {
    const today = new Date().toISOString().split('T')[0];
    const newRecord: AttendanceRecord = {
      subjectId,
      date: today,
      status
    };

    const updatedRecords = attendanceRecords.filter(
      record => !(record.subjectId === subjectId && record.date === today)
    );
    updatedRecords.push(newRecord);

    setAttendanceRecords(updatedRecords);
    localStorage.setItem('attendanceApp_attendance', JSON.stringify(updatedRecords));
  };

  const getAttendanceStats = () => {
    const totalSubjects = subjects.length;
    const today = new Date().toISOString().split('T')[0];
    const todaysAttendance = attendanceRecords.filter(record => record.date === today);
    
    const present = todaysAttendance.filter(record => record.status === 'present').length;
    const absent = todaysAttendance.filter(record => record.status === 'absent').length;
    const extra = todaysAttendance.filter(record => record.status === 'extra').length;
    const cancelled = todaysAttendance.filter(record => record.status === 'cancelled').length;

    const attendancePercentage = totalSubjects > 0 ? Math.round((present / totalSubjects) * 100) : 0;

    return { present, absent, extra, cancelled, total: totalSubjects, percentage: attendancePercentage };
  };

  const getWeeklyStats = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const dayRecords = attendanceRecords.filter(record => record.date === date);
      const present = dayRecords.filter(record => record.status === 'present').length;
      const total = subjects.length;
      const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
      
      return {
        date,
        day: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        attendance: percentage
      };
    });
  };

  const stats = getAttendanceStats();
  const weeklyStats = getWeeklyStats();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'absent': return <XCircle className="h-4 w-4 text-destructive" />;
      case 'extra': return <Plus className="h-4 w-4 text-info" />;
      case 'cancelled': return <Ban className="h-4 w-4 text-muted-foreground" />;
      default: return <Clock className="h-4 w-4 text-warning" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-success hover:bg-success/90';
      case 'absent': return 'bg-destructive hover:bg-destructive/90';
      case 'extra': return 'bg-info hover:bg-info/90';
      case 'cancelled': return 'bg-muted hover:bg-muted/90';
      default: return 'bg-warning hover:bg-warning/90';
    }
  };

  if (subjects.length === 0) {
    return (
      <div className="space-y-6 pb-20 lg:pb-6">
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Welcome to AttendanceTracker!</h2>
          <p className="text-muted-foreground mb-6">
            Get started by setting up your subjects and weekly schedule
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
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Track your attendance and progress</p>
        </div>
        <Button asChild>
          <Link to="/calendar">
            <Calendar className="h-4 w-4 mr-2" />
            View Calendar
          </Link>
        </Button>
      </div>

      {/* Today's Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Attendance</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.percentage}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.present} present, {stats.absent} absent
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Configured subjects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Extra Classes</CardTitle>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-info">{stats.extra}</div>
            <p className="text-xs text-muted-foreground">
              Additional classes today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cancelled Classes</CardTitle>
            <Ban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">{stats.cancelled}</div>
            <p className="text-xs text-muted-foreground">
              Classes cancelled today
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Classes with Attendance Marking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Today's Classes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {todaysSubjects.length > 0 ? (
              todaysSubjects.map((subject) => (
                <div key={subject.id} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-4">
                    <div className={`h-4 w-4 rounded-full ${subject.color}`} />
                    <div>
                      <p className="font-medium">{subject.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {subject.timeSlot?.startTime} - {subject.timeSlot?.endTime} • {subject.instructor}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {subject.attendanceStatus && (
                      <div className="flex items-center gap-2 mr-4">
                        {getStatusIcon(subject.attendanceStatus)}
                        <Badge className={getStatusColor(subject.attendanceStatus)}>
                          {subject.attendanceStatus}
                        </Badge>
                      </div>
                    )}
                    
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant={subject.attendanceStatus === 'present' ? 'default' : 'outline'}
                        className={subject.attendanceStatus === 'present' ? 'bg-success hover:bg-success/90' : ''}
                        onClick={() => markAttendance(subject.id, 'present')}
                      >
                        <UserCheck className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant={subject.attendanceStatus === 'absent' ? 'default' : 'outline'}
                        className={subject.attendanceStatus === 'absent' ? 'bg-destructive hover:bg-destructive/90' : ''}
                        onClick={() => markAttendance(subject.id, 'absent')}
                      >
                        <UserX className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant={subject.attendanceStatus === 'extra' ? 'default' : 'outline'}
                        className={subject.attendanceStatus === 'extra' ? 'bg-info hover:bg-info/90' : ''}
                        onClick={() => markAttendance(subject.id, 'extra')}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant={subject.attendanceStatus === 'cancelled' ? 'default' : 'outline'}
                        className={subject.attendanceStatus === 'cancelled' ? 'bg-muted hover:bg-muted/90' : ''}
                        onClick={() => markAttendance(subject.id, 'cancelled')}
                      >
                        <Ban className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Clock3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No classes scheduled for today</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {weeklyStats.map((day) => (
              <div key={day.date} className="flex items-center gap-4">
                <div className="w-12 text-sm font-medium">{day.day}</div>
                <div className="flex-1">
                  <Progress value={day.attendance} className="h-2" />
                </div>
                <div className="w-12 text-sm text-right">{day.attendance}%</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <Link to="/calendar" className="block p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">View Calendar</h3>
                <p className="text-sm text-muted-foreground">Check your weekly schedule and attendance history</p>
              </div>
            </div>
          </Link>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <Link to="/analytics" className="block p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold">View Analytics</h3>
                <p className="text-sm text-muted-foreground">Detailed reports and progress insights</p>
              </div>
            </div>
          </Link>
        </Card>
      </div>
    </div>
  );
}
