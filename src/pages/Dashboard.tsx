import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, FileText, Activity, AlertTriangle, 
  CheckCircle, Clock, TrendingUp, Shield
} from "lucide-react";

export default function Dashboard() {
  const { user, hasPermission } = useAuth();

  const stats = [
    {
      title: "Total Users",
      value: "1,247",
      change: "+12%",
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
      visible: hasPermission('users.view')
    },
    {
      title: "Active Processes",
      value: "89",
      change: "+3%",
      icon: Activity,
      color: "text-accent",
      bgColor: "bg-accent/10",
      visible: hasPermission('processes.view')
    },
    {
      title: "Pending Reviews",
      value: "23",
      change: "-8%",
      icon: Clock,
      color: "text-warning",
      bgColor: "bg-warning/10",
      visible: hasPermission('workflows.view')
    },
    {
      title: "Compliance Score",
      value: "98.5%",
      change: "+0.5%",
      icon: Shield,
      color: "text-success",
      bgColor: "bg-success/10",
      visible: true
    }
  ];

  const recentActivities = [
    {
      id: 1,
      user: "Sarah Johnson",
      action: "approved",
      target: "Patient Safety Protocol v2.1",
      time: "2 minutes ago",
      status: "success"
    },
    {
      id: 2,
      user: "Michael Chen",
      action: "uploaded",
      target: "HIPAA Training Manual",
      time: "15 minutes ago",
      status: "info"
    },
    {
      id: 3,
      user: "Emily Rodriguez",
      action: "submitted for review",
      target: "Emergency Response Plan",
      time: "1 hour ago",
      status: "warning"
    },
    {
      id: 4,
      user: "David Kim",
      action: "created",
      target: "New Quality Assurance Process",
      time: "3 hours ago",
      status: "info"
    }
  ];

  const pendingTasks = [
    {
      id: 1,
      title: "Review Updated Privacy Policy",
      department: "Legal Compliance",
      priority: "high",
      dueDate: "Today"
    },
    {
      id: 2,
      title: "Approve Staff Training Module",
      department: "Human Resources",
      priority: "medium",
      dueDate: "Tomorrow"
    },
    {
      id: 3,
      title: "Update Risk Assessment Forms",
      department: "Quality Assurance",
      priority: "low",
      dueDate: "This week"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-success';
      case 'warning': return 'text-warning';
      case 'info': return 'text-info';
      default: return 'text-muted-foreground';
    }
  };

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'outline';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening in your healthcare management system today
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-success border-success/20 bg-success/10">
            <Shield className="w-3 h-3 mr-1" />
            HIPAA Compliant
          </Badge>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.filter(stat => stat.visible).map((stat, index) => (
          <Card key={index} className="hover:shadow-medium transition-all duration-300 animate-scale-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className={stat.change.startsWith('+') ? 'text-success' : 'text-warning'}>
                  {stat.change}
                </span>
                {" "}from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity Feed */}
        <Card className="lg:col-span-2 animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest actions and updates across the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'success' ? 'bg-success' :
                    activity.status === 'warning' ? 'bg-warning' : 'bg-info'
                  }`} />
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">
                      <span className="font-medium">{activity.user}</span>
                      {" "}{activity.action}{" "}
                      <span className="font-medium">{activity.target}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Tasks */}
        {hasPermission('workflows.view') && (
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-warning" />
                Pending Tasks
              </CardTitle>
              <CardDescription>
                Items requiring your attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingTasks.map((task) => (
                  <div key={task.id} className="p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm font-medium text-foreground leading-tight">
                        {task.title}
                      </h4>
                      <Badge variant={getPriorityVariant(task.priority)} className="text-xs">
                        {task.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{task.department}</p>
                    <p className="text-xs text-warning">Due: {task.dueDate}</p>
                  </div>
                ))}
                
                <Button variant="outline" className="w-full mt-4">
                  View All Tasks
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Compliance Overview */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-success" />
            HIPAA Compliance Overview
          </CardTitle>
          <CardDescription>
            Current compliance status across all departments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Administrative Safeguards</span>
                <span className="text-sm text-success font-medium">100%</span>
              </div>
              <Progress value={100} className="h-2" />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Physical Safeguards</span>
                <span className="text-sm text-success font-medium">96%</span>
              </div>
              <Progress value={96} className="h-2" />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Technical Safeguards</span>
                <span className="text-sm text-warning font-medium">89%</span>
              </div>
              <Progress value={89} className="h-2" />
            </div>
          </div>
          
          <div className="mt-6 flex gap-4">
            <Button className="bg-gradient-primary">
              <TrendingUp className="w-4 h-4 mr-2" />
              View Full Report
            </Button>
            <Button variant="outline">
              Schedule Audit
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}