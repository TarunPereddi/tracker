'use client';

import { useEffect, useRef } from 'react';

interface SkillMapProps {
  skills: Array<{
    _id: string;
    skill: string;
    category: string;
    timeSpent: number;
    difficulty: string;
  }>;
}

export default function SkillMap({ skills }: SkillMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 500;
    canvas.height = 500;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const maxRadius = 150;

    // Define skill categories for the spider chart
    const categories = [
      'Frontend',
      'Backend', 
      'Database',
      'DevOps',
      'Mobile',
      'AI/ML',
      'Data Science',
      'Cybersecurity',
      'System Design',
      'Algorithms',
      'Tools',
      'Soft Skills'
    ];

    const numCategories = categories.length;
    const angleStep = (2 * Math.PI) / numCategories;

    // Calculate time spent per category
    const categoryData = categories.map(category => {
      const categoryKey = category.toLowerCase().replace(' ', '-').replace('/', '-');
      const totalTime = skills
        .filter(skill => skill.category === categoryKey)
        .reduce((sum, skill) => sum + skill.timeSpent, 0);
      return {
        name: category,
        time: totalTime,
        normalized: Math.min(1, totalTime / 300) // Normalize to 0-1 (300 minutes = 1)
      };
    });

    // Draw grid circles
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    for (let i = 1; i <= 5; i++) {
      const radius = (maxRadius * i) / 5;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.stroke();
    }

    // Draw grid lines (spokes)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i < numCategories; i++) {
      const angle = i * angleStep - Math.PI / 2; // Start from top
      const x = centerX + Math.cos(angle) * maxRadius;
      const y = centerY + Math.sin(angle) * maxRadius;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    // Draw category labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = 'bold 10px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    categories.forEach((category, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const labelRadius = maxRadius + 25;
      const x = centerX + Math.cos(angle) * labelRadius;
      const y = centerY + Math.sin(angle) * labelRadius;
      
      // Check if label would go outside canvas bounds
      if (x >= 20 && x <= canvas.width - 20 && y >= 20 && y <= canvas.height - 20) {
        ctx.fillText(category, x, y);
      }
    });

    // Draw data points and lines
    ctx.strokeStyle = '#8b5cf6';
    ctx.fillStyle = '#8b5cf6';
    ctx.lineWidth = 2;

    // Draw the spider web data
    ctx.beginPath();
    categoryData.forEach((data, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const radius = data.normalized * maxRadius;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.closePath();
    ctx.stroke();

    // Fill the area
    ctx.fillStyle = 'rgba(139, 92, 246, 0.2)';
    ctx.fill();

    // Draw data points
    categoryData.forEach((data, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const radius = data.normalized * maxRadius;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = '#8b5cf6';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Draw time labels on data points (only for significant time)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '8px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    categoryData.forEach((data, i) => {
      if (data.time > 30) { // Only show labels for 30+ minutes
        const angle = i * angleStep - Math.PI / 2;
        const radius = data.normalized * maxRadius;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        // Position label slightly outside the point
        const labelRadius = data.normalized * maxRadius + 15;
        const labelX = centerX + Math.cos(angle) * labelRadius;
        const labelY = centerY + Math.sin(angle) * labelRadius;
        
        // Check if label would go outside canvas bounds
        if (labelX >= 10 && labelX <= canvas.width - 10 && labelY >= 10 && labelY <= canvas.height - 10) {
          ctx.fillText(`${Math.round(data.time / 60)}h`, labelX, labelY);
        }
      }
    });

    // Draw compact legend
    const legendX = 10;
    const legendY = 10;
    const legendWidth = 180;
    const legendHeight = 80;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(legendX, legendY, legendWidth, legendHeight);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.strokeRect(legendX, legendY, legendWidth, legendHeight);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Skill Development', legendX + 8, legendY + 18);

    ctx.font = '8px Inter, sans-serif';
    ctx.fillText('• Distance = time spent', legendX + 8, legendY + 35);
    ctx.fillText('• 5h = outer edge', legendX + 8, legendY + 50);
    ctx.fillText('• 12 skill categories', legendX + 8, legendY + 65);

  }, [skills]);

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <canvas
        ref={canvasRef}
        className="border border-gray-200 rounded-lg bg-white"
        style={{ maxWidth: '100%', maxHeight: '100%', width: '500px', height: '500px' }}
      />
    </div>
  );
}