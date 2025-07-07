'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function TestIndiaJobs() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testIndiaJobs = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-india-jobs');
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Test failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">India Jobs Location Filter Test</h1>
        <p className="text-gray-600">Test to verify that job searches only return jobs from India</p>
      </div>

      <Button 
        onClick={testIndiaJobs}
        disabled={loading}
        className="mb-6"
      >
        {loading ? 'Testing...' : 'Test India Job Filtering'}
      </Button>

      {results && (
        <div className="space-y-6">
          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Test Summary
                <Badge variant={results.summary.allTestsPassed ? 'default' : 'destructive'}>
                  {results.summary.successfulTests}/{results.summary.totalTests} Passed
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {results.summary.recommendations.map((rec: string, index: number) => (
                  <div key={index} className="text-sm">
                    {rec}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Individual Tests */}
          <div className="grid gap-4">
            {results.tests.map((test: any, index: number) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {test.name}
                    <Badge variant={test.success ? 'default' : 'destructive'}>
                      {test.success ? 'Success' : 'Failed'}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {test.success ? (
                      <div>
                        <p className="text-sm text-green-600">✅ {test.message}</p>
                        <p className="text-sm">Jobs found: {test.jobsFound || test.indiaJobs}</p>
                        {test.locations && test.locations.length > 0 && (
                          <div>
                            <p className="text-sm font-medium">Sample locations:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {test.locations.map((location: string, i: number) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {location}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {test.sampleLocations && test.sampleLocations.length > 0 && (
                          <div>
                            <p className="text-sm font-medium">Sample locations:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {test.sampleLocations.map((loc: any, i: number) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {loc.city}, {loc.state}, {loc.country}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-red-600">❌ {test.error}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
