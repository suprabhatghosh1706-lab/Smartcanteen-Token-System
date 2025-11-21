import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { User, ShieldCheck, Coffee, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Welcome() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    id: "",
    email: "",
    password: "",
    rememberMe: false
  });

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Store user info in localStorage
    const userData = {
      name: formData.name,
      id: formData.id,
      email: formData.email,
      userType: userType,
      rememberMe: formData.rememberMe
    };
    
    localStorage.setItem("canteenUser", JSON.stringify(userData));
    
    // Navigate based on user type
    if (userType === "student") {
      navigate(createPageUrl("StudentDashboard"));
    } else {
      navigate(createPageUrl("StaffDashboard"));
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!userType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-white flex items-center justify-center p-6">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-600 rounded-2xl flex items-center justify-center">
                <Coffee className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Welcome to Smart Canteen
            </h1>
            <p className="text-xl text-gray-600">
              Choose your login type to continue
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card 
              className="cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:border-teal-500 group"
              onClick={() => setUserType("student")}
            >
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-teal-100 to-teal-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <User className="w-10 h-10 text-teal-600" />
                </div>
                <CardTitle className="text-2xl">Student Login</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-6">
                  Browse menu, place orders, and track your tokens in real-time
                </p>
                <Button className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700">
                  Continue as Student
                </Button>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-500 group"
              onClick={() => setUserType("staff")}
            >
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-10 h-10 text-blue-600" />
                </div>
                <CardTitle className="text-2xl">Canteen Staff Login</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-6">
                  Manage orders, update status, and control menu availability
                </p>
                <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                  Continue as Staff
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate(createPageUrl("LandingPage"))}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-white flex items-center justify-center p-6">
      <Card className="max-w-md w-full shadow-2xl">
        <CardHeader className="text-center">
          <div className={`w-16 h-16 bg-gradient-to-br ${userType === 'student' ? 'from-teal-100 to-teal-200' : 'from-blue-100 to-blue-200'} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
            {userType === "student" ? (
              <User className="w-8 h-8 text-teal-600" />
            ) : (
              <ShieldCheck className="w-8 h-8 text-blue-600" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {userType === "student" ? "Student Login" : "Canteen Staff Login"}
          </CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            Enter your credentials to continue
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="id">{userType === "student" ? "Student ID" : "Staff ID"}</Label>
              <Input
                id="id"
                placeholder={`Enter your ${userType === "student" ? "student" : "staff"} ID`}
                value={formData.id}
                onChange={(e) => handleInputChange("id", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={formData.rememberMe}
                  onCheckedChange={(checked) => handleInputChange("rememberMe", checked)}
                />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm text-teal-600 hover:text-teal-700">
                Forgot Password?
              </a>
            </div>

            <Button 
              type="submit" 
              className={`w-full ${userType === 'student' ? 'bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700' : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'}`}
            >
              Login
            </Button>

            <Button 
              type="button"
              variant="ghost" 
              className="w-full"
              onClick={() => setUserType(null)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Change Login Type
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}