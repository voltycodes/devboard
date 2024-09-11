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

  const currYr = new Date().getFullYear();
  const data = await fetch('https://api.github.com/graphql', {
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
  }).then(res => res.json()).then(resObj => resObj.data)

  return data;
}

export async function lcCall(leetcodeID: string) {
  if (!leetcodeID) {
    return null;
  }

  const currYr = new Date().getFullYear();
  const data = await fetch('https://leetcode.com/graphql/', {
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
  }).then(res => res.json()).then(resObj => resObj.data);

  return data;
}