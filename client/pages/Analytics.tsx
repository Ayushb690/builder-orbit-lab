import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Award
} from "lucide-react";

export default function Analytics() {
  // Mock data for analytics
  const overallStats = {
    totalClasses: 156,
    averageAttendance: 89.2,
    totalStudents: 150,
    classesThisMonth: 32,
  };

  const monthlyData = [
    { month: "Jan", attendance: 92 },
    { month: "Feb", attendance: 88 },
    { month: "Mar", attendance: 94 },
    { month: "Apr", attendance: 87 },
    { month: "May", attendance: 91 },
    { month: "Jun", attendance: 89 },
  ];

  const subjectPerformance = [
    { subject: "Mathematics", attendance: 92, trend: 5.2, students: 30 },
    { subject: "Physics", attendance: 87, trend: -2.1, students: 28 },
    { subject: "Chemistry", attendance: 78, trend: 3.4, students: 25 },
    { subject: "English", attendance: 94, trend: 1.8, students: 32 },
  ];

  const weeklyPattern = [
    { day: "Monday", attendance: 94 },
    { day: "Tuesday", attendance: 88 },
    { day: "Wednesday", attendance: 92 },
    { day: "Thursday", attendance: 85 },
    { day: "Friday", attendance: 79 },
  ];

  const topPerformers = [
    { name: "Alice Johnson", attendance: 98, subject: "Mathematics" },
    { name: "Bob Smith", attendance: 96, subject: "Physics" },
    { name: "Carol Davis", attendance: 95, subject: "English" },
    { name: "David Wilson", attendance: 94, subject: "Chemistry" },
  ];

  const insights = [
    {
      type: "positive",
      title: "Attendance Improved",
      description: "Overall attendance increased by 3.2% this month",
      icon: TrendingUp,
      color: "text-success",
    },
    {
      type: "warning",
      title: "Friday Attendance Low",
      description: "Friday classes show 15% lower attendance than average",
      icon: TrendingDown,
      color: "text-warning",
    },
    {
      type: "info",
      title: "Peak Performance",
      description: "Mathematics class has the highest attendance rate",
      icon: Award,
      color: "text-primary",
    },
  ];

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">Detailed insights and progress reports</p>
        </div>
        <Select defaultValue="30days">
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
              {overallStats.classesThisMonth} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Attendance</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{overallStats.averageAttendance}%</div>
            <p className="text-xs text-success">+3.2% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">Active students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Performance</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">94%</div>
            <p className="text-xs text-muted-foreground">English Literature</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Insights */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Attendance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyData.map((month) => (
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

        {/* Weekly Pattern */}
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
                  <div>
                    <h4 className="font-medium">{subject.subject}</h4>
                    <p className="text-sm text-muted-foreground">{subject.students} students</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-medium">{subject.attendance}%</div>
                    <div className={`text-xs flex items-center gap-1 ${
                      subject.trend > 0 ? 'text-success' : 'text-destructive'
                    }`}>
                      {subject.trend > 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {Math.abs(subject.trend)}%
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
              {insights.map((insight, index) => {
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
              })}
            </div>
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformers.map((student, index) => (
                <div key={student.name} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium">{student.name}</h4>
                      <p className="text-sm text-muted-foreground">{student.subject}</p>
                    </div>
                  </div>
                  <Badge className="bg-success hover:bg-success/90">
                    {student.attendance}%
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
