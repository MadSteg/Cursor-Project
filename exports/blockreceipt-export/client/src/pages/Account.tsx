import React from 'react';
import { useAuth } from '@/contexts/WalletContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Mail, Settings } from 'lucide-react';

export default function Account() {
  const { 
    isLoggedIn, 
    userEmail, 
    login, 
    logout 
  } = useAuth();

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 p-4">
        <div className="container mx-auto max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              Account Access
            </h1>
            <p className="text-xl text-purple-100">
              Please log in to access your account
            </p>
          </div>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white text-center">Login Required</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <User className="h-16 w-16 text-white/60 mx-auto mb-4" />
                <p className="text-white/80 mb-4">
                  You need to be logged in to view your account information.
                </p>
                <p className="text-white/60 text-sm">
                  Use the login button in the header to get started.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Account Dashboard
          </h1>
          <p className="text-xl text-purple-100">
            Manage your digital receipt account
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Account Info Card */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <User className="h-5 w-5 text-blue-400" />
                Account Information
              </CardTitle>
              <CardDescription className="text-purple-100">
                Your account details and settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white/80">Email:</span>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-blue-400" />
                  <span className="text-white">{userEmail}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-white/80">Status:</span>
                <Badge className="bg-green-500/20 text-green-300 border-green-400/50">
                  Active
                </Badge>
              </div>
              
              <div className="pt-4">
                <Button 
                  onClick={logout}
                  variant="outline"
                  className="w-full bg-red-500/20 border-red-400/50 text-red-300 hover:bg-red-500/30"
                >
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Account Settings Card */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Settings className="h-5 w-5 text-purple-400" />
                Account Settings
              </CardTitle>
              <CardDescription className="text-purple-100">
                Customize your account preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <span className="text-white/80 text-sm">Notification Preferences:</span>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-white/80">
                    <input type="checkbox" defaultChecked className="rounded" />
                    Receipt notifications
                  </label>
                  <label className="flex items-center gap-2 text-white/80">
                    <input type="checkbox" defaultChecked className="rounded" />
                    Reward updates
                  </label>
                  <label className="flex items-center gap-2 text-white/80">
                    <input type="checkbox" className="rounded" />
                    Marketing emails
                  </label>
                </div>
              </div>
              
              <div className="pt-4">
                <Button 
                  variant="outline"
                  className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20"
                >
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}