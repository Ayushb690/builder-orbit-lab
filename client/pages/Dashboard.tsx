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
  BookOpen
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  // Mock data - in a real app, this would come from your backend
  const todayAttendance = {
    present: 142,
    absent: 8,
    total: 150,
    percentage: 94.7
  };

  const recentSubjects = [
    { id: 1, name: "Mathematics", time: "09:00 AM", status: "present", attendance: 85 },
    { id: 2, name: "Physics", time: "11:00 AM", status: "present", attendance: 92 },
    { id: 3, name: "Chemistry", time: "02:00 PM", status: "absent", attendance: 78 },
    { id: 4, name: "English", time: "03:30 PM", status: "pending", attendance: 88 },
  ];

  const weeklyStats = [
    { day: "Mon", attendance: 95 },
    { day: "Tue", attendance: 88 },
    { day: "Wed", attendance: 92 },
    { day: "Thu", attendance: 97 },
    { day: "Fri", attendance: 89 },
  ];

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
            <Plus className="h-4 w-4 mr-2" />
            Mark Attendance
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
            <div className="text-2xl font-bold text-success">{todayAttendance.percentage}%</div>
            <p className="text-xs text-muted-foreground">
              {todayAttendance.present} present, {todayAttendance.absent} absent
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayAttendance.total}</div>
            <p className="text-xs text-muted-foreground">
              Active students
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Average</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">92.2%</div>
            <p className="text-xs text-success">
              +2.1% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classes Today</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">
              2 completed, 2 pending
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Classes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Today's Classes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentSubjects.map((subject) => (
              <div key={subject.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {subject.status === "present" && (
                      <CheckCircle className="h-4 w-4 text-success" />
                    )}
                    {subject.status === "absent" && (
                      <XCircle className="h-4 w-4 text-destructive" />
                    )}
                    {subject.status === "pending" && (
                      <Clock className="h-4 w-4 text-warning" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{subject.name}</p>
                    <p className="text-sm text-muted-foreground">{subject.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant={
                      subject.status === "present"
                        ? "default"
                        : subject.status === "absent"
                        ? "destructive"
                        : "secondary"
                    }
                    className={
                      subject.status === "present"
                        ? "bg-success hover:bg-success/90"
                        : ""
                    }
                  >
                    {subject.status}
                  </Badge>
                  <div className="text-right">
                    <p className="text-sm font-medium">{subject.attendance}%</p>
                    <p className="text-xs text-muted-foreground">Attendance</p>
                  </div>
                </div>
              </div>
            ))}
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
              <div key={day.day} className="flex items-center gap-4">
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
                <p className="text-sm text-muted-foreground">Check upcoming classes and mark attendance</p>
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
