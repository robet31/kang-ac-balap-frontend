import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Zap, User, Shield, X, Wifi } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';

interface DevQuickAccessProps {
  onLoginAsAdmin: () => void;
  onLoginAsCustomer: () => void;
  onTestConnection?: () => void;
  isLoading?: boolean;
}

export function DevQuickAccess({ onLoginAsAdmin, onLoginAsCustomer, onTestConnection, isLoading = false }: DevQuickAccessProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Always show the button (remove isDev check for now to ensure it appears)
  console.log('🔧 DevQuickAccess rendered');
  console.log('Current hostname:', window.location.hostname);

  return (
    <>
      {/* Floating Button - Bottom Left */}
      <div className="fixed bottom-6 left-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300 gap-2"
          size="lg"
        >
          <Zap className="w-5 h-5" />
          Quick Access (Dev)
        </Button>
      </div>

      {/* Quick Access Dialog */}
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center justify-between">
              <AlertDialogTitle className="flex items-center gap-2 text-xl">
                <Zap className="w-6 h-6 text-purple-600" />
                Quick Access (Developer Mode)
              </AlertDialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <AlertDialogDescription>
              Langsung masuk ke dashboard untuk testing tanpa login manual
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-3 mt-4">
            {/* Admin Access */}
            <Card className="border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 hover:shadow-lg cursor-pointer group">
              <CardContent className="p-0">
                <Button
                  onClick={() => {
                    onLoginAsAdmin();
                    setIsOpen(false);
                  }}
                  variant="ghost"
                  className="w-full h-full p-5 flex items-start gap-4 hover:bg-blue-50"
                  disabled={isLoading}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-bold text-gray-900 text-lg mb-1">
                      Admin Dashboard
                    </h3>
                    <p className="text-sm text-gray-600">
                      Login sebagai: admin@demo.com
                    </p>
                  </div>
                </Button>
              </CardContent>
            </Card>

            {/* Customer Access */}
            <Card className="border-2 border-green-200 hover:border-green-400 transition-all duration-300 hover:shadow-lg cursor-pointer group">
              <CardContent className="p-0">
                <Button
                  onClick={() => {
                    onLoginAsCustomer();
                    setIsOpen(false);
                  }}
                  variant="ghost"
                  className="w-full h-full p-5 flex items-start gap-4 hover:bg-green-50"
                  disabled={isLoading}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-bold text-gray-900 text-lg mb-1">
                      Customer Dashboard
                    </h3>
                    <p className="text-sm text-gray-600">
                      Login sebagai: customer@demo.com
                    </p>
                  </div>
                </Button>
              </CardContent>
            </Card>

            {/* Test Connection */}
            {onTestConnection && (
              <Card className="border-2 border-gray-200 hover:border-gray-400 transition-all duration-300 hover:shadow-lg cursor-pointer group">
                <CardContent className="p-0">
                  <Button
                    onClick={() => {
                      onTestConnection();
                      setIsOpen(false);
                    }}
                    variant="ghost"
                    className="w-full h-full p-5 flex items-start gap-4 hover:bg-gray-50"
                    disabled={isLoading}
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-700 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                      <Wifi className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="font-bold text-gray-900 text-lg mb-1">
                        Test Connection
                      </h3>
                      <p className="text-sm text-gray-600">
                        Cek koneksi ke server
                      </p>
                    </div>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-800 flex items-center gap-2">
              <Zap className="w-3 h-3" />
              <span>Dev tool ini hanya muncul di development environment</span>
            </p>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}