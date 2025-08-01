import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AttendanceChatbot from "@/components/AttendanceChatbot";
import {
  BookOpen,
  UserCheck,
  UserX,
  Plus,
  Ban,
  Calendar,
  TrendingUp,
  Clock,
  BarChart3
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

interface AttendanceRecord {
  subjectId: string;
  date: string;
  status: 'present' | 'absent' | 'extra' | 'cancelled';
}

export default function Dashboard() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [todayAttendance, setTodayAttendance] = useState<{[key: string]: string}>({});

  useEffect(() => {
    // Load data from localStorage
    const savedSubjects = localStorage.getItem('attendanceApp_subjects');
    const savedAttendance = localStorage.getItem('attendanceApp_attendance');

    if (savedSubjects) setSubjects(JSON.parse(savedSubjects));
    if (savedAttendance) {
      const records = JSON.parse(savedAttendance);
      setAttendanceRecords(records);
      
      // Get today's attendance status for each subject
      const today = new Date().toISOString().split('T')[0];
      const todayRecords = records.filter((record: AttendanceRecord) => record.date === today);
      const todayStatus: {[key: string]: string} = {};
      todayRecords.forEach((record: AttendanceRecord) => {
        todayStatus[record.subjectId] = record.status;
      });
      setTodayAttendance(todayStatus);
    }
  }, []);

  const markAttendance = (subjectId: string, status: 'present' | 'absent' | 'extra' | 'cancelled') => {
    const today = new Date().toISOString().split('T')[0];
    const newRecord: AttendanceRecord = {
      subjectId,
      date: today,
      status
    };

    // Remove existing record for this subject today (if any)
    const updatedRecords = attendanceRecords.filter(
      record => !(record.subjectId === subjectId && record.date === today)
    );
    updatedRecords.push(newRecord);

    setAttendanceRecords(updatedRecords);
    localStorage.setItem('attendanceApp_attendance', JSON.stringify(updatedRecords));
    
    // Update today's attendance state
    setTodayAttendance(prev => ({
      ...prev,
      [subjectId]: status
    }));
  };

  const getOverallStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayRecords = attendanceRecords.filter(record => record.date === today);

    const present = todayRecords.filter(record => record.status === 'present').length;
    const absent = todayRecords.filter(record => record.status === 'absent').length;
    const extra = todayRecords.filter(record => record.status === 'extra').length;
    const cancelled = todayRecords.filter(record => record.status === 'cancelled').length;

    // Add 2 classes for each extra class to present count
    const totalPresentClasses = present + (extra * 2);

    const totalMarked = present + absent + extra + cancelled;
    const attendancePercentage = subjects.length > 0 ? Math.round((present / subjects.length) * 100) : 0;

    return {
      present,
      absent,
      extra,
      cancelled,
      totalMarked,
      totalSubjects: subjects.length,
      attendancePercentage,
      totalPresentClasses
    };
  };

  const getTotalStats = () => {
    const allRecords = attendanceRecords;
    const present = allRecords.filter(record => record.status === 'present').length;
    const absent = allRecords.filter(record => record.status === 'absent').length;
    const extra = allRecords.filter(record => record.status === 'extra').length;
    const cancelled = allRecords.filter(record => record.status === 'cancelled').length;
    
    const totalClasses = present + absent + extra;
    const overallAttendance = totalClasses > 0 ? Math.round(((present + extra) / totalClasses) * 100) : 0;
    
    return {
      present,
      absent,
      extra,
      cancelled,
      totalClasses,
      overallAttendance
    };
  };

  const getButtonVariant = (subjectId: string, buttonType: string) => {
    const status = todayAttendance[subjectId];
    return status === buttonType ? 'default' : 'outline';
  };

  const getButtonClassName = (subjectId: string, buttonType: string) => {
    const status = todayAttendance[subjectId];
    if (status === buttonType) {
      switch (buttonType) {
        case 'present': return 'bg-success hover:bg-success/90 text-white';
        case 'absent': return 'bg-destructive hover:bg-destructive/90 text-white';
        case 'extra': return 'bg-info hover:bg-info/90 text-white';
        case 'cancelled': return 'bg-muted hover:bg-muted/90';
        default: return '';
      }
    }
    return '';
  };

  const stats = getOverallStats();
  const totalStats = getTotalStats();

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
          <p className="text-muted-foreground">Mark attendance for your subjects</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to="/analytics">
              <BarChart3 className="h-4 w-4 mr-2" />
              View Analytics
            </Link>
          </Button>
          <Button asChild>
            <Link to="/calendar">
              <Calendar className="h-4 w-4 mr-2" />
              View Calendar
            </Link>
          </Button>
        </div>
      </div>

      {/* Today's Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Present</CardTitle>
            <UserCheck className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.totalPresentClasses}</div>
            <p className="text-xs text-muted-foreground">
              {stats.present} regular + {stats.extra * 2} from extra classes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Absent</CardTitle>
            <UserX className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.absent}</div>
            <p className="text-xs text-muted-foreground">
              Missed classes today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Extra Classes</CardTitle>
            <Plus className="h-4 w-4 text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-info">{stats.extra}</div>
            <p className="text-xs text-muted-foreground">
              Counts as {stats.extra * 2} classes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalStats.overallAttendance}%</div>
            <p className="text-xs text-muted-foreground">
              Total attendance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* All Subjects with Attendance Buttons */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Mark Attendance for Today
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Click the buttons below each subject to mark your attendance
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {subjects.map((subject) => (
              <div key={subject.id} className="p-4 rounded-lg border bg-card">
                {/* Subject Info */}
                <div className="flex items-start gap-3 mb-4">
                  <div className={`h-10 w-10 rounded-lg ${subject.color} flex items-center justify-center`}>
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{subject.name}</h3>
                    <p className="text-sm text-muted-foreground">{subject.code}</p>
                    <p className="text-xs text-muted-foreground">{subject.instructor}</p>
                  </div>
                  {todayAttendance[subject.id] && (
                    <Badge 
                      className={`${
                        todayAttendance[subject.id] === 'present' ? 'bg-success' :
                        todayAttendance[subject.id] === 'absent' ? 'bg-destructive' :
                        todayAttendance[subject.id] === 'extra' ? 'bg-info' :
                        'bg-muted'
                      } text-white`}
                    >
                      {todayAttendance[subject.id]}
                    </Badge>
                  )}
                </div>
                
                {/* Attendance Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={getButtonVariant(subject.id, 'present')}
                    className={getButtonClassName(subject.id, 'present')}
                    onClick={() => markAttendance(subject.id, 'present')}
                    size="sm"
                  >
                    <UserCheck className="h-4 w-4 mr-1" />
                    Present
                  </Button>
                  
                  <Button
                    variant={getButtonVariant(subject.id, 'absent')}
                    className={getButtonClassName(subject.id, 'absent')}
                    onClick={() => markAttendance(subject.id, 'absent')}
                    size="sm"
                  >
                    <UserX className="h-4 w-4 mr-1" />
                    Absent
                  </Button>
                  
                  <Button
                    variant={getButtonVariant(subject.id, 'extra')}
                    className={getButtonClassName(subject.id, 'extra')}
                    onClick={() => markAttendance(subject.id, 'extra')}
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Extra Class
                  </Button>
                  
                  <Button
                    variant={getButtonVariant(subject.id, 'cancelled')}
                    className={getButtonClassName(subject.id, 'cancelled')}
                    onClick={() => markAttendance(subject.id, 'cancelled')}
                    size="sm"
                  >
                    <Ban className="h-4 w-4 mr-1" />
                    No Class
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>


    </div>
  );
}
