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
  MoreVertical
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Subjects() {
  // Mock data
  const subjects = [
    {
      id: 1,
      name: "Mathematics",
      code: "MATH101",
      instructor: "Dr. Sarah Johnson",
      totalStudents: 30,
      schedule: "Mon, Wed, Fri 9:00 AM",
      averageAttendance: 92,
      lastClass: "2024-01-15",
      nextClass: "2024-01-17",
      color: "bg-blue-500",
      recentAttendance: [95, 88, 92, 97, 89],
    },
    {
      id: 2,
      name: "Physics",
      code: "PHYS201",
      instructor: "Prof. Michael Chen",
      totalStudents: 28,
      schedule: "Tue, Thu 11:00 AM",
      averageAttendance: 87,
      lastClass: "2024-01-14",
      nextClass: "2024-01-16",
      color: "bg-green-500",
      recentAttendance: [90, 85, 89, 86, 92],
    },
    {
      id: 3,
      name: "Chemistry",
      code: "CHEM151",
      instructor: "Dr. Emily Rodriguez",
      totalStudents: 25,
      schedule: "Mon, Wed 2:00 PM",
      averageAttendance: 78,
      lastClass: "2024-01-15",
      nextClass: "2024-01-17",
      color: "bg-purple-500",
      recentAttendance: [75, 82, 79, 74, 80],
    },
    {
      id: 4,
      name: "English Literature",
      code: "ENG301",
      instructor: "Ms. Amanda Wilson",
      totalStudents: 32,
      schedule: "Tue, Fri 10:00 AM",
      averageAttendance: 94,
      lastClass: "2024-01-12",
      nextClass: "2024-01-16",
      color: "bg-orange-500",
      recentAttendance: [96, 92, 94, 95, 91],
    },
  ];

  const getAttendanceStatus = (percentage: number) => {
    if (percentage >= 90) return { label: "Excellent", variant: "default" as const, className: "bg-success hover:bg-success/90" };
    if (percentage >= 80) return { label: "Good", variant: "secondary" as const, className: "" };
    if (percentage >= 70) return { label: "Fair", variant: "outline" as const, className: "" };
    return { label: "Poor", variant: "destructive" as const, className: "" };
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Subjects</h1>
          <p className="text-muted-foreground">Manage your subjects and track attendance</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Subject
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subjects.length}</div>
            <p className="text-xs text-muted-foreground">Active subjects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Attendance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {Math.round(subjects.reduce((acc, s) => acc + s.averageAttendance, 0) / subjects.length)}%
            </div>
            <p className="text-xs text-success">+3.2% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subjects.reduce((acc, s) => acc + s.totalStudents, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Across all subjects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classes This Week</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">8 completed, 4 upcoming</p>
          </CardContent>
        </Card>
      </div>

      {/* Subjects Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {subjects.map((subject) => {
          const attendanceStatus = getAttendanceStatus(subject.averageAttendance);
          
          return (
            <Card key={subject.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`h-10 w-10 rounded-lg ${subject.color} flex items-center justify-center`}>
                      <BookOpen className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{subject.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{subject.code}</p>
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
                      <span className="font-medium">Instructor:</span> {subject.instructor}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Schedule:</span> {subject.schedule}
                    </p>
                  </div>

                  {/* Attendance Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Average Attendance</span>
                      <Badge 
                        variant={attendanceStatus.variant}
                        className={attendanceStatus.className}
                      >
                        {subject.averageAttendance}% - {attendanceStatus.label}
                      </Badge>
                    </div>
                    <Progress value={subject.averageAttendance} className="h-2" />
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{subject.totalStudents}</div>
                      <div className="text-xs text-muted-foreground">Students</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {Math.round(subject.recentAttendance.reduce((a, b) => a + b, 0) / subject.recentAttendance.length)}%
                      </div>
                      <div className="text-xs text-muted-foreground">Last 5 Classes</div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Calendar className="h-4 w-4 mr-2" />
                      View Schedule
                    </Button>
                    <Button size="sm" className="flex-1">
                      <Users className="h-4 w-4 mr-2" />
                      Mark Attendance
                    </Button>
                  </div>

                  {/* Next Class Info */}
                  <div className="bg-muted/30 rounded-lg p-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Next Class:</span>
                      <span className="text-muted-foreground">{subject.nextClass}</span>
                    </div>
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
