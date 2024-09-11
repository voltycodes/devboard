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