import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  Users,
  BookOpen,
  Clock,
  Award,
  Plus,
  X,
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

interface AttendanceRecord {
  subjectId: string;
  date: string;
  status: 'present' | 'absent' | 'extra' | 'cancelled';
}

export default function Analytics() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState("30days");

  useEffect(() => {
    // Load data from localStorage
    const savedSubjects = localStorage.getItem('attendanceApp_subjects');
    const savedAttendance = localStorage.getItem('attendanceApp_attendance');

    if (savedSubjects) setSubjects(JSON.parse(savedSubjects));
    if (savedAttendance) setAttendanceRecords(JSON.parse(savedAttendance));
  }, []);

  const getDateRange = (period: string) => {
    const days = period === "7days" ? 7 : period === "30days" ? 30 : period === "90days" ? 90 : 365;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);
    return { startDate, endDate };
  };

  const getOverallStats = () => {
    const { startDate } = getDateRange(selectedPeriod);
    const periodRecords = attendanceRecords.filter(record => 
      new Date(record.date) >= startDate
    );

    const present = periodRecords.filter(record => record.status === 'present').length;
    const absent = periodRecords.filter(record => record.status === 'absent').length;
    const extra = periodRecords.filter(record => record.status === 'extra').length;
    const cancelled = periodRecords.filter(record => record.status === 'cancelled').length;
    
    const totalAttended = present + extra;
    const totalClasses = present + absent + extra;
    const averageAttendance = totalClasses > 0 ? Math.round((totalAttended / totalClasses) * 100) : 0;

    return {
      totalClasses: totalClasses + cancelled,
      averageAttendance,
      present,
      absent,
      extra,
      cancelled,
      totalAttended
    };
  };

  const getSubjectPerformance = () => {
    const { startDate } = getDateRange(selectedPeriod);

    return subjects.map(subject => {
      // Get all records for this subject (not just within date range for total calculation)
      const allSubjectRecords = attendanceRecords.filter(record => record.subjectId === subject.id);
      const totalExtraClasses = allSubjectRecords.filter(record => record.status === 'extra').length;

      // Calculate remaining required classes: original total - (extra classes * 2)
      const remainingRequired = Math.max(0, subject.totalClasses - (totalExtraClasses * 2));

      // Get records within the selected period for display
      const subjectRecords = attendanceRecords.filter(record =>
        record.subjectId === subject.id && new Date(record.date) >= startDate
      );

      const present = subjectRecords.filter(record => record.status === 'present').length;
      const absent = subjectRecords.filter(record => record.status === 'absent').length;
      const extra = subjectRecords.filter(record => record.status === 'extra').length;

      // Calculate attendance considering extra classes as double value
      const totalAttendedValue = present + (extra * 2);
      const totalClassesValue = present + absent + (extra * 2);
      const attendance = totalClassesValue > 0 ? Math.round((totalAttendedValue / totalClassesValue) * 100) : 0;

      return {
        subject: subject.name,
        code: subject.code,
        attendance,
        present,
        absent,
        extra,
        totalExtraClasses,
        remainingRequired,
        originalTotal: subject.totalClasses,
        totalAttendedValue,
        totalClassesValue,
        color: subject.color
      };
    });
  };

  const getWeeklyPattern = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const { startDate } = getDateRange(selectedPeriod);
    
    return days.map(day => {
      const dayRecords = attendanceRecords.filter(record => {
        const recordDate = new Date(record.date);
        const dayName = recordDate.toLocaleDateString('en-US', { weekday: 'long' });
        return dayName === day && recordDate >= startDate;
      });
      
      const present = dayRecords.filter(record => record.status === 'present').length;
      const extra = dayRecords.filter(record => record.status === 'extra').length;
      const total = dayRecords.filter(record => record.status !== 'cancelled').length;
      
      const attendance = total > 0 ? Math.round(((present + extra) / total) * 100) : 0;
      
      return { day, attendance, total };
    }).filter(day => day.total > 0); // Only show days with classes
  };

  const getMonthlyTrend = () => {
    const months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const monthRecords = attendanceRecords.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate >= monthStart && recordDate <= monthEnd;
      });
      
      const present = monthRecords.filter(record => record.status === 'present').length;
      const extra = monthRecords.filter(record => record.status === 'extra').length;
      const total = monthRecords.filter(record => record.status !== 'cancelled').length;
      
      const attendance = total > 0 ? Math.round(((present + extra) / total) * 100) : 0;
      
      months.push({
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        attendance,
        total
      });
    }
    
    return months.filter(month => month.total > 0);
  };

  const getTopPerformers = () => {
    return getSubjectPerformance()
      .sort((a, b) => b.attendance - a.attendance)
      .slice(0, 4);
  };

  const getInsights = () => {
    const overallStats = getOverallStats();
    const subjectPerformance = getSubjectPerformance();
    const weeklyPattern = getWeeklyPattern();
    
    const insights = [];
    
    // Attendance trend insight
    if (overallStats.averageAttendance >= 90) {
      insights.push({
        type: "positive",
        title: "Excellent Attendance",
        description: `Maintaining ${overallStats.averageAttendance}% attendance rate`,
        icon: TrendingUp,
        color: "text-success",
      });
    } else if (overallStats.averageAttendance < 75) {
      insights.push({
        type: "warning",
        title: "Attendance Below Target",
        description: `Current rate is ${overallStats.averageAttendance}%, aim for 75%+`,
        icon: TrendingDown,
        color: "text-warning",
      });
    }
    
    // Best performing subject
    const bestSubject = subjectPerformance.reduce((best, current) => 
      current.attendance > best.attendance ? current : best, subjectPerformance[0]
    );
    
    if (bestSubject) {
      insights.push({
        type: "info",
        title: "Top Performing Subject",
        description: `${bestSubject.subject} has ${bestSubject.attendance}% attendance`,
        icon: Award,
        color: "text-primary",
      });
    }
    
    // Extra classes insight
    if (overallStats.extra > 0) {
      insights.push({
        type: "positive",
        title: "Extra Classes Attended",
        description: `Attended ${overallStats.extra} additional classes`,
        icon: Plus,
        color: "text-info",
      });
    }
    
    return insights;
  };

  const overallStats = getOverallStats();
  const subjectPerformance = getSubjectPerformance();
  const weeklyPattern = getWeeklyPattern();
  const monthlyTrend = getMonthlyTrend();
  const topPerformers = getTopPerformers();
  const insights = getInsights();

  if (subjects.length === 0) {
    return (
      <div className="space-y-6 pb-20 lg:pb-6">
        <div className="text-center py-12">
          <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">No Data Available</h2>
          <p className="text-muted-foreground mb-6">
            Set up your subjects and start marking attendance to see analytics
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
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">Detailed insights and progress reports</p>
        </div>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select time period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 days</SelectItem>
            <SelectItem value="30days">Last 30 days</SelectItem>
            <SelectItem value="90days">Last 90 days</SelectItem>
            <SelectItem value="1year">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.totalClasses}</div>
            <p className="text-xs text-muted-foreground">
              {overallStats.present + overallStats.extra} attended
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{overallStats.averageAttendance}%</div>
            <p className="text-xs text-success">Average attendance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Extra Classes</CardTitle>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-info">{overallStats.extra}</div>
            <p className="text-xs text-muted-foreground">Additional classes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Missed Classes</CardTitle>
            <X className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{overallStats.absent}</div>
            <p className="text-xs text-muted-foreground">Classes missed</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Trends */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly Trend */}
        {monthlyTrend.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Monthly Attendance Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyTrend.map((month) => (
                  <div key={month.month} className="flex items-center gap-4">
                    <div className="w-12 text-sm font-medium">{month.month}</div>
                    <div className="flex-1">
                      <Progress value={month.attendance} className="h-3" />
                    </div>
                    <div className="w-12 text-sm text-right">{month.attendance}%</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Weekly Pattern */}
        {weeklyPattern.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Weekly Attendance Pattern</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyPattern.map((day) => (
                  <div key={day.day} className="flex items-center gap-4">
                    <div className="w-16 text-sm font-medium">{day.day}</div>
                    <div className="flex-1">
                      <Progress value={day.attendance} className="h-3" />
                    </div>
                    <div className="w-12 text-sm text-right">{day.attendance}%</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Subject Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Subject Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subjectPerformance.map((subject) => (
              <div key={subject.subject} className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-4">
                  <div className={`h-4 w-4 rounded-full ${subject.color}`} />
                  <div>
                    <h4 className="font-medium">{subject.subject}</h4>
                    <p className="text-sm text-muted-foreground">
                      {subject.present}P • {subject.absent}A • {subject.extra}E
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-medium">{subject.attendance}%</div>
                    <div className="text-xs text-muted-foreground">
                      {subject.present + subject.extra}/{subject.totalClasses}
                    </div>
                  </div>
                  <div className="w-20">
                    <Progress value={subject.attendance} className="h-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights and Top Performers */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Key Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Key Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insights.length > 0 ? (
                insights.map((insight, index) => {
                  const Icon = insight.icon;
                  return (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                      <Icon className={`h-5 w-5 mt-0.5 ${insight.color}`} />
                      <div>
                        <h4 className="font-medium">{insight.title}</h4>
                        <p className="text-sm text-muted-foreground">{insight.description}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6">
                  <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Mark more attendance to see insights
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Top Performing Subjects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformers.map((subject, index) => (
                <div key={subject.subject} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium">{subject.subject}</h4>
                      <p className="text-sm text-muted-foreground">{subject.code}</p>
                    </div>
                  </div>
                  <Badge className="bg-success hover:bg-success/90">
                    {subject.attendance}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
