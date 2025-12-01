import React from 'react';

interface RiskGaugeProps {
  score: number;
}

const RiskGauge: React.FC<RiskGaugeProps> = ({ score }) => {
  const radius = 50;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let color = '#ef4444'; // Red (High Risk / Low Score)
  if (score > 39) color = '#eab308'; // Yellow
  if (score > 70) color = '#22c55e'; // Green
  if (score > 90) color = '#00E5FF'; // Cyan (Excellent)

  return (
    <div className="relative flex items-center justify-center w-40 h-40">
       <svg
        height={radius * 2}
        width={radius * 2}
        className="transform -rotate-90"
      >
        <circle
          stroke="#1e293b"
          strokeWidth={stroke}
          fill="transparent"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s ease-in-out' }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-display font-bold text-white drop-shadow-md">{score}</span>
        <span className="text-xs text-gray-400 font-mono">SECURE SCORE</span>
      </div>
    </div>
  );
};

export default RiskGauge;
