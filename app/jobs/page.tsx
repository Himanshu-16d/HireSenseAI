'use client';

import { JobSearch } from '@/components/JobSearch';

export default function JobsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Find Your Dream Job
        </h1>
        <JobSearch />
      </div>
    </div>
  );
} 