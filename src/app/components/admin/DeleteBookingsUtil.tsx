import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { publicAnonKey, projectId } from '../../utils/supabase/info';

export function DeleteBookingsUtil() {
  const [jobNumbers, setJobNumbers] = useState('TRACK-007, DEMO-005, TRACK-005, DEMO-006, TRACK-003, TRACK-009');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const handleDelete = async () => {
    const jobNumberArray = jobNumbers.split(',').map(s => s.trim()).filter(Boolean);
    
    if (jobNumberArray.length === 0) {
      toast.error('Please enter at least one job number');
      return;
    }

    setLoading(true);
    setResults([]);
    const deletionResults: any[] = [];

    for (const jobNumber of jobNumberArray) {
      try {
        console.log(`🗑️ Deleting ${jobNumber}...`);
        
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-c1ef5280/bookings/${jobNumber}`,
          {
            method: 'DELETE',
            headers: { 
              'Authorization': `Bearer ${publicAnonKey}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        const data = await response.json();
        
        if (response.ok) {
          if (data.skipped) {
            console.log(`⚠️ ${jobNumber}: Already deleted`);
            toast.info(`⚠️ ${jobNumber} - Already deleted`);
            deletionResults.push({ jobNumber, success: true, message: 'Already deleted (skipped)' });
          } else {
            console.log(`✅ ${jobNumber} deleted successfully`);
            toast.success(`✅ ${jobNumber} deleted`);
            deletionResults.push({ jobNumber, success: true, message: 'Deleted successfully' });
          }
        } else {
          console.error(`❌ Failed to delete ${jobNumber}:`, data.error);
          toast.error(`❌ Failed to delete ${jobNumber}`);
          deletionResults.push({ jobNumber, success: false, error: data.error });
        }
      } catch (error) {
        console.error(`💥 Exception deleting ${jobNumber}:`, error);
        toast.error(`💥 Error deleting ${jobNumber}`);
        deletionResults.push({ jobNumber, success: false, error: String(error) });
      }
    }
    
    setResults(deletionResults);
    setLoading(false);
    
    const successCount = deletionResults.filter(r => r.success).length;
    toast.success(`🎉 Processed ${successCount}/${jobNumberArray.length} bookings`);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trash2 className="w-5 h-5 text-red-500" />
          Delete Bookings Utility
        </CardTitle>
        <CardDescription>
          Enter job numbers separated by commas to delete them from the database
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">
            Job Numbers (comma-separated)
          </label>
          <Input
            value={jobNumbers}
            onChange={(e) => setJobNumbers(e.target.value)}
            placeholder="TRACK-007, DEMO-005, TRACK-005"
            className="font-mono"
          />
          <p className="text-xs text-gray-500 mt-1">
            Example: TRACK-007, DEMO-005, TRACK-005, DEMO-006, TRACK-003, TRACK-009
          </p>
        </div>

        <Button 
          onClick={handleDelete}
          disabled={loading}
          variant="destructive"
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Deleting...
            </>
          ) : (
            <>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Bookings
            </>
          )}
        </Button>

        {results.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="font-semibold text-sm">Results:</h4>
            {results.map((result, index) => (
              <div 
                key={index}
                className={`p-2 rounded text-sm ${
                  result.success 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                <span className="font-mono font-semibold">{result.jobNumber}</span>
                {result.success ? (
                  <span className="ml-2">✅ {result.message}</span>
                ) : (
                  <span className="ml-2">❌ {result.error}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}