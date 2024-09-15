import Graph from '@/components/graph'
import UserStats from '@/components/user-stats';
import { ghCall, lcCall } from "@/lib/utils";
interface ActivityData {
  [date: string]: {
    github?: number;
    leetcode?: number;
  };
}


export default async function Page({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
  const github = searchParams['github'] || null;
  const leetcode = searchParams['leetcode'] || null;
  const data = await fetchData(github, leetcode);

  return (
    <main className="flex flex-col min-h-screen max-w-screen-md mx-auto pt-8 px-4 mb-12">
      <h1 className='mb-12 text-xl self-center spacemono'>Showing data for @{github || '⬚⬚⬚⬚'}/{leetcode || '⬚⬚⬚⬚'}</h1>
      <h1 className='flex justify-between w-full opacity-50 mb-2'>
        <span className='flex gap-2 items-center justify-center text-sm'>
          <svg className='mt-1' xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          { github || '⬚⬚⬚⬚' }
        </span>
        <span className='flex gap-2 items-center justify-center text-sm'>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 32 32"> <path d="M21.469 23.907l-3.595 3.473c-0.624 0.625-1.484 0.885-2.432 0.885s-1.807-0.26-2.432-0.885l-5.776-5.812c-0.62-0.625-0.937-1.537-0.937-2.485 0-0.952 0.317-1.812 0.937-2.432l5.76-5.844c0.62-0.619 1.5-0.859 2.448-0.859s1.808 0.26 2.432 0.885l3.595 3.473c0.687 0.688 1.823 0.663 2.536-0.052 0.708-0.713 0.735-1.848 0.047-2.536l-3.473-3.511c-0.901-0.891-2.032-1.505-3.261-1.787l3.287-3.333c0.688-0.687 0.667-1.823-0.047-2.536s-1.849-0.735-2.536-0.052l-13.469 13.469c-1.307 1.312-1.989 3.113-1.989 5.113 0 1.996 0.683 3.86 1.989 5.168l5.797 5.812c1.307 1.307 3.115 1.937 5.115 1.937 1.995 0 3.801-0.683 5.109-1.989l3.479-3.521c0.688-0.683 0.661-1.817-0.052-2.531s-1.849-0.74-2.531-0.052zM27.749 17.349h-13.531c-0.932 0-1.692 0.801-1.692 1.791 0 0.991 0.76 1.797 1.692 1.797h13.531c0.933 0 1.693-0.807 1.693-1.797 0-0.989-0.76-1.791-1.693-1.791z"/> </svg>
          { leetcode || '⬚⬚⬚⬚' }
        </span>
      </h1>

      <Graph data={data?.cal} />

      <UserStats data={data} />
      
    </main>
  )
}

async function fetchData(githubID: string | null, leetcodeID: string | null) {
  if (!(githubID || leetcodeID)) {
    return null;
  }
  
  const ghData = await ghCall(githubID || "");
  const lcData = await lcCall(leetcodeID || "");
  
  const cal: ActivityData = {};
  let totalGH = 0, totalLC = 0;
  
  if (ghData && ghData.user && ghData.user.contributionsCollection) {
    totalGH = ghData.user.contributionsCollection.contributionCalendar.totalContributions || 0;
    const ghCalData = ghData.user.contributionsCollection.contributionCalendar.weeks || [];
    for (const week of ghCalData) {
      for (const day of week.contributionDays) {
        if (!cal[day.date]) cal[day.date] = {};
        cal[day.date].github =  day.contributionCount;
      }
    }
  }
  
  if (lcData && lcData.matchedUser && lcData.matchedUser.userCalendar) {
    const lcSubCal = JSON.parse(lcData.matchedUser.userCalendar.submissionCalendar || "{}");
    for (const [timestamp, count] of Object.entries(lcSubCal)) {
      const date = new Date(parseInt(timestamp) * 1000).toISOString().split('T')[0];
      if (!cal[date]) cal[date] = {};
      cal[date].leetcode = (cal[date].leetcode || 0) + (count as number);
      totalLC += (count as number);
    }
  }

  return {
    cal,
    totalGH,
    totalLC,
    ghID: githubID,
    lcID: leetcodeID
  };
}