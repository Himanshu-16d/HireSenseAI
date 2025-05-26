'use client';

import React from 'react';
import JobGlobeVisualization from './JobGlobeVisualization';
import SkillBubblesVisualization from './SkillBubblesVisualization';
import { MapPin, Lightbulb } from 'lucide-react';

export default function JobSearchVisualizations() {
  return (
    <div className="w-full max-w-6xl mx-auto my-12 px-4">
      <h2 className="text-3xl font-bold text-center mb-10 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
        Job Market Insights
      </h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-card/80 backdrop-blur-sm p-6 rounded-xl shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary/20 p-3 rounded-lg">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Global Job Opportunities</h3>
          </div>
          <p className="text-muted-foreground mb-6">
            Explore job opportunities across the globe. Our interactive map highlights regions with high demand for your skills.
          </p>
          <JobGlobeVisualization />
        </div>
        
        <div className="bg-card/80 backdrop-blur-sm p-6 rounded-xl shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary/20 p-3 rounded-lg">
              <Lightbulb className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">In-Demand Skills</h3>
          </div>
          <p className="text-muted-foreground mb-6">
            Visualize trending skills in your industry. Larger bubbles represent skills with higher market demand.
          </p>
          <SkillBubblesVisualization />
        </div>
      </div>
    </div>
  );
} 