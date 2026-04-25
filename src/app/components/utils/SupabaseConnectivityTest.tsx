import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Wifi, WifiOff, Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { createClient } from '../../utils/supabase/client';

export function SupabaseConnectivityTest() {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<any>(null);

  const runTests = async () => {
    setTesting(true);
    const testResults: any = {
      timestamp: new Date().toISOString(),
      tests: [],
    };

    // Test 1: Check project ID and key
    testResults.tests.push({
      name: 'Configuration Check',
      status: projectId && publicAnonKey ? 'pass' : 'fail',
      details: {
        projectId: projectId || 'MISSING',
        hasAnonKey: !!publicAnonKey,
        url: `https://${projectId}.supabase.co`,
      },
    });

    // Test 2: Network connectivity to Supabase
    try {
      const url = `https://${projectId}.supabase.co`;
      const response = await fetch(url, {
        method: 'HEAD',
        mode: 'no-cors', // Avoid CORS issues for this test
      });
      
      testResults.tests.push({
        name: 'Network Connectivity',
        status: 'pass',
        details: 'Can reach Supabase URL',
      });
    } catch (error) {
      testResults.tests.push({
        name: 'Network Connectivity',
        status: 'fail',
        details: `Cannot reach Supabase: ${error.message}`,
      });
    }

    // Test 3: Supabase Auth API
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        testResults.tests.push({
          name: 'Supabase Auth API',
          status: 'fail',
          details: `Auth error: ${error.message}`,
          error: error,
        });
      } else {
        testResults.tests.push({
          name: 'Supabase Auth API',
          status: 'pass',
          details: 'Successfully connected to Supabase Auth',
          session: data.session ? 'Active session found' : 'No active session',
        });
      }
    } catch (error: any) {
      testResults.tests.push({
        name: 'Supabase Auth API',
        status: 'error',
        details: `Exception: ${error.message}`,
        error: error,
      });
    }

    // Test 4: Supabase Database API
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);
      
      if (error) {
        testResults.tests.push({
          name: 'Supabase Database API',
          status: 'fail',
          details: `Database error: ${error.message}`,
          error: error,
        });
      } else {
        testResults.tests.push({
          name: 'Supabase Database API',
          status: 'pass',
          details: 'Successfully connected to Supabase Database',
        });
      }
    } catch (error: any) {
      testResults.tests.push({
        name: 'Supabase Database API',
        status: 'error',
        details: `Exception: ${error.message}`,
        error: error,
      });
    }

    setResults(testResults);
    setTesting(false);

    // Log to console for debugging
    console.log('🧪 Supabase Connectivity Test Results:', testResults);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'fail':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      default:
        return <Wifi className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {testing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wifi className="w-5 h-5" />}
          Supabase Connectivity Test
        </CardTitle>
        <CardDescription>
          Test connection to Supabase backend services
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Button 
            onClick={runTests} 
            disabled={testing}
            className="w-full sm:w-auto"
          >
            {testing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <Wifi className="w-4 h-4 mr-2" />
                Run Tests
              </>
            )}
          </Button>
        </div>

        {results && (
          <div className="mt-6 space-y-4">
            <div className="text-sm text-muted-foreground">
              Test run: {new Date(results.timestamp).toLocaleString()}
            </div>
            
            {results.tests.map((test: any, index: number) => (
              <div 
                key={index}
                className="border rounded-lg p-4 space-y-2"
              >
                <div className="flex items-center gap-2">
                  {getStatusIcon(test.status)}
                  <h4 className="font-semibold">{test.name}</h4>
                  <span className={`ml-auto text-xs px-2 py-1 rounded ${
                    test.status === 'pass' ? 'bg-green-100 text-green-700' :
                    test.status === 'fail' ? 'bg-red-100 text-red-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {test.status.toUpperCase()}
                  </span>
                </div>
                
                <div className="text-sm text-muted-foreground pl-7">
                  {typeof test.details === 'string' ? (
                    <p>{test.details}</p>
                  ) : (
                    <pre className="text-xs bg-muted p-2 rounded overflow-auto">
                      {JSON.stringify(test.details, null, 2)}
                    </pre>
                  )}
                </div>

                {test.error && (
                  <details className="text-xs pl-7">
                    <summary className="cursor-pointer text-red-600">Error Details</summary>
                    <pre className="mt-2 bg-red-50 p-2 rounded overflow-auto">
                      {JSON.stringify(test.error, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">💡 Troubleshooting Tips:</h4>
              <ul className="text-sm text-blue-800 space-y-1 list-disc pl-5">
                <li><strong>Failed to fetch:</strong> Check if Supabase project is paused (free tier). Go to Supabase dashboard and restore it.</li>
                <li><strong>CORS errors:</strong> Check Supabase project settings and ensure your domain is allowed.</li>
                <li><strong>Auth API fails:</strong> Verify anon key is correct in Supabase dashboard → Settings → API.</li>
                <li><strong>Database API fails:</strong> Check if RLS policies allow anonymous access to profiles table.</li>
                <li><strong>All tests fail:</strong> Verify project ID ({projectId}) is correct.</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
