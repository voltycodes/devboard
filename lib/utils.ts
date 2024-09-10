import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getTileColor(githubCount: number, leetcodeCount: number) {
  if (githubCount === -1 || leetcodeCount === -1) {
    return "border-2 border-white/5"
  }
  const totalCount = githubCount + leetcodeCount;
  const intensity = Math.ceil(totalCount / 2);
  const intensityLevel = 
    intensity > 4 ? 300 :
    intensity >= 3 ? 500 :
    intensity >= 2 ? 700 :
    intensity >= 1 ? 900 : '900/0';

  const githubRatio = githubCount / totalCount;
  const leetcodeRatio = leetcodeCount / totalCount;

  if (totalCount === 0) return 'bg-gray-800';
  if (githubCount === 0) return `bg-cyan-${intensityLevel}`;
  if (leetcodeCount === 0) return `bg-emerald-${intensityLevel}`;

  const blendedColor = 
    githubRatio > leetcodeRatio
      ? `bg-gradient-to-br from-emerald-${intensityLevel} to-cyan-${intensityLevel}`
      : `bg-gradient-to-br from-cyan-${intensityLevel} to-emerald-${intensityLevel}`;

  return blendedColor;
}