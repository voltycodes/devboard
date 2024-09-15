import { UTCDate } from "@date-fns/utc";
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

export async function ghCall(githubID: string) {
  if (!githubID) {
    return null;
  }

  try {
    const currYr = new Date().getFullYear();
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.GH_TOKEN}`
      },
      body: JSON.stringify({
        query: `
          query ($username: String!) {
            user(login: $username) {
              contributionsCollection(from: "${currYr}-01-01T00:00:00", to: "${currYr}-12-01T00:00:00") {
                contributionCalendar {
                  totalContributions
                  weeks {
                    contributionDays {
                      contributionCount
                      date
                    }
                  }
                }
              }
            }
          }
        `,
        variables: {"username": githubID}
      })
    });

    if (!response.ok) {
      throw new Error(`GitHub API responded with status: ${response.status}`);
    }

    const resObj = await response.json();
    return resObj.data;
  } catch (error) {
    console.error('Error fetching GitHub data:', error);
    return null;
  }
}

export async function lcCall(leetcodeID: string) {
  if (!leetcodeID) {
    return null;
  }

  try {
    const currYr = new Date().getFullYear();
    const response = await fetch('https://leetcode.com/graphql/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query userProfileCalendar($username: String!, $year: Int) {
            matchedUser(username: $username) {
              userCalendar(year: $year) {
                streak
                totalActiveDays
                submissionCalendar
              }
            }
          }
        `,
        variables: {"username": leetcodeID, "year": currYr}
      })
    });

    if (!response.ok) {
      throw new Error(`Leetcode API responded with status: ${response.status}`)
    }

    const resObj = await response.json();
    return resObj.data;
  } catch (error) {
    console.error('Error fetching LeetCode API:', error);
    return null;
  }
}

export function getStreaks(cal: Record<string, { github?: number; leetcode?: number }>) {
  let lcCurrentStreak = 0;
  let lcLongestStreak = 0;
  let ghCurrentStreak = 0;
  let ghLongestStreak = 0;
  let lastLCDate: Date | null = null;
  let lastGHDate: Date | null = null;

  let topLCSubmissions: { date: string, submissions: number }[] = [];
  let topGHContributions: { date: string, contributions: number }[] = [];

  // Sort dates in ascending order
  const sortedDates = Object.keys(cal).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  // only consider dates before today
  const today = new UTCDate();
  const todayStr = today.toISOString().split('T')[0];
  const todayIndex = sortedDates.indexOf(todayStr);
  if (todayIndex !== -1) { sortedDates.splice(todayIndex + 1); }

  for (const dateStr of sortedDates) {
    const lcSubmissions = cal[dateStr]?.leetcode || 0;
    const ghContributions = cal[dateStr]?.github || 0;
    const currentDate = new UTCDate(dateStr);

    // LeetCode streak
    if (lcSubmissions > 0) {
      if (!lastLCDate || isConsecutiveDay(lastLCDate, currentDate)) {
        lcCurrentStreak++;
      } else {
        lcCurrentStreak = 1;
      }
      lastLCDate = currentDate;
      lcLongestStreak = Math.max(lcLongestStreak, lcCurrentStreak);
    } else if (lastLCDate && !isConsecutiveDay(lastLCDate, currentDate)) {
      lcCurrentStreak = 0;
    }

    // Update top LeetCode submissions
    if (lcSubmissions > 0) {
      topLCSubmissions.push({ date: dateStr, submissions: lcSubmissions });
      topLCSubmissions.sort((a, b) => b.submissions - a.submissions);
      if (topLCSubmissions.length > 3) {
        topLCSubmissions.pop();
      }
    }

    // GitHub streak
    if (ghContributions > 0) {
      if (!lastGHDate || isConsecutiveDay(lastGHDate, currentDate)) {
        ghCurrentStreak++;
      } else {
        ghCurrentStreak = 1;
      }
      lastGHDate = currentDate;
      ghLongestStreak = Math.max(ghLongestStreak, ghCurrentStreak);
    } else if (lastGHDate && !isConsecutiveDay(lastGHDate, currentDate)) {
      ghCurrentStreak = 0;
    }

    // Update top GitHub contributions
    if (ghContributions > 0) {
      topGHContributions.push({ date: dateStr, contributions: ghContributions });
      topGHContributions.sort((a, b) => b.contributions - a.contributions);
      if (topGHContributions.length > 3) {
        topGHContributions.pop();
      }
    }
  }

  return {
    leetcode: { 
      currentStreak: lcCurrentStreak, 
      longestStreak: lcLongestStreak,
      topDays: topLCSubmissions
    },
    github: { 
      currentStreak: ghCurrentStreak, 
      longestStreak: ghLongestStreak,
      topDays: topGHContributions
    }
  };
}

function isConsecutiveDay(date1: Date, date2: Date): boolean {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays === 1;
}
