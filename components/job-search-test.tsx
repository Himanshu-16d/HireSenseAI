'use client';

import { useState } from 'react';

// Complete flow test for job search functionality
export default function JobSearchTest() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testJobSearch = async () => {
    setLoading(true);
    setError(null);
    setResults(null);
    
    try {
      console.log('Testing job search flow...');
      
      // Test 1: Direct API call
      const apiResponse = await fetch('/api/job-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'software engineer',
          location: 'India',
          keywords: 'JavaScript, React'
        })
      });
      
      console.log('API Response Status:', apiResponse.status);
      
      if (!apiResponse.ok) {
        throw new Error(`API call failed: ${apiResponse.status}`);
      }
      
      const apiData = await apiResponse.json();
      console.log('API Response Data:', apiData);
      
      // Test 2: Job service function
      const { searchJobs } = await import('@/lib/job-service');
      const serviceResults = await searchJobs({
        title: 'software engineer',
        location: 'India',
        keywords: 'JavaScript, React'
      });
      
      console.log('Service Results:', serviceResults);
      
      // Test 3: findJobs action
      const { findJobs } = await import('@/actions/job-actions');
      const actionResults = await findJobs({
        title: 'software engineer',
        location: 'India',
        keywords: 'JavaScript, React'
      }, null);
      
      console.log('Action Results:', actionResults);
      
      setResults({
        apiResponse: apiData,
        serviceResults,
        actionResults,
        timestamp: new Date().toISOString()
      });
      
    } catch (err) {
      console.error('Test failed:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Job Search Flow Test</h1>
      
      <button 
        onClick={testJobSearch}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test Job Search'}
      </button>
      
      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <h3 className="font-bold">Error:</h3>
          <p>{error}</p>
        </div>
      )}
      
      {results && (
        <div className="mt-4 space-y-4">
          <div className="p-4 bg-green-100 border border-green-400 rounded">
            <h3 className="font-bold">API Response:</h3>
            <pre className="text-sm overflow-x-auto">
              {JSON.stringify(results.apiResponse, null, 2)}
            </pre>
          </div>
          
          <div className="p-4 bg-blue-100 border border-blue-400 rounded">
            <h3 className="font-bold">Service Results:</h3>
            <pre className="text-sm overflow-x-auto">
              {JSON.stringify(results.serviceResults, null, 2)}
            </pre>
          </div>
          
          <div className="p-4 bg-purple-100 border border-purple-400 rounded">
            <h3 className="font-bold">Action Results:</h3>
            <pre className="text-sm overflow-x-auto">
              {JSON.stringify(results.actionResults, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
