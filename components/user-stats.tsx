import { getStreaks } from "@/lib/utils";
import LogoCard from "./logo-card";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Score from "./score";
import { Button } from "./ui/button";
import Link from "next/link";
import ShareProfileButton from "./shareProfileButton";

export default function UserStats({data}: {data: any}) {
  const {totalGH, totalLC, cal} = data;
  const { leetcode, github, meta } = getStreaks(cal ?? {});
  
  const ghPerDay = Math.round(totalGH / meta.totalDays * 100) /100;
  const lcPerDay = Math.round(totalLC / meta.totalDays * 100) /100;
  
  const ghStreakRatio = (github.currentStreak / (github.longestStreak || 1));
  const lcStreakRatio = (leetcode.currentStreak / (leetcode.longestStreak || 1));

  const score = 
    Math.round( (
      (ghPerDay + lcPerDay)
      + lcStreakRatio
      + ghStreakRatio
      + (github.currentStreak / 30 * 5)  // current streak > 30 buff
      + (leetcode.currentStreak / 30 * 5)  // current streak > 30 buff
    ) * 100 ) /10;

  const consistencyScore = Math.round(
    ((github.consistency / (meta.totalDays || 1)) * 50 +
    (leetcode.consistency / (meta.totalDays || 1)) * 50)
  );

  const activityScore = Math.round(
    Math.max(ghPerDay, lcPerDay) * 100
    + (ghStreakRatio < 1 ? -(ghStreakRatio || 1 * 10) : (ghStreakRatio * 10))
    + (lcStreakRatio < 1 ? -(lcStreakRatio || 1 * 10) : (lcStreakRatio * 10))
  );

  const rank = score > 50
    ? "CRACKED AF"
    : score > 40
    ? "GOD TIER"
    : score > 30
    ? "HARD CARRY"
    : score > 20
    ? "BUILT DIFFERENT"
    : score > 10
    ? "UNDERDOG"
    : "NEWBIE";


  const analysis = score > 50
    ? "YOU'RE ABSOLUTELY GOATED!"
    : score > 40
    ? "SHEESH! YOU'RE SLAYING IT!"
    : score > 30
    ? "NO CAP, YOU'RE POPPING OFF!"
    : score > 20
    ? "SOLID EFFORT, YOU'RE LEVELING UP!"
    : score > 10
    ? "LOWKEY FIRE, KEEP GRINDING!"
    : "EVERYONE STARTS SOMEWHERE, YOU GOT THIS!";


  const statsData = [
    { text: "Consistency", value: consistencyScore },
    { text: "Activity", value: activityScore },
    { text: "Overall", value: score }
  ]

  const metadata = [
    { text: 'Your Rank', value: rank },
    { text: 'Points', value: score * 10 },
    { text: 'Analysis', value: analysis }
  ]

  return (
    <div className="flex flex-col mt-4">
      
      <Card className="my-2">
        <CardHeader className="w-full">
          <div className="flex items-center gap-2 w-full">
            <Avatar className="border-2 border-foreground/30">
              <AvatarImage src={data.ghID && `https://github.com/${data.ghID}.png`} />
              <AvatarFallback>{data.ghID || '⬚⬚⬚⬚'}</AvatarFallback>
            </Avatar>
            <span>@{data.ghID || data.lcID}</span>
            <div className="flex items-center opacity-50 gap-2 ml-auto">
              { data.ghID &&
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              }
              { data.lcID &&
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 32 32"> <path d="M21.469 23.907l-3.595 3.473c-0.624 0.625-1.484 0.885-2.432 0.885s-1.807-0.26-2.432-0.885l-5.776-5.812c-0.62-0.625-0.937-1.537-0.937-2.485 0-0.952 0.317-1.812 0.937-2.432l5.76-5.844c0.62-0.619 1.5-0.859 2.448-0.859s1.808 0.26 2.432 0.885l3.595 3.473c0.687 0.688 1.823 0.663 2.536-0.052 0.708-0.713 0.735-1.848 0.047-2.536l-3.473-3.511c-0.901-0.891-2.032-1.505-3.261-1.787l3.287-3.333c0.688-0.687 0.667-1.823-0.047-2.536s-1.849-0.735-2.536-0.052l-13.469 13.469c-1.307 1.312-1.989 3.113-1.989 5.113 0 1.996 0.683 3.86 1.989 5.168l5.797 5.812c1.307 1.307 3.115 1.937 5.115 1.937 1.995 0 3.801-0.683 5.109-1.989l3.479-3.521c0.688-0.683 0.661-1.817-0.052-2.531s-1.849-0.74-2.531-0.052zM27.749 17.349h-13.531c-0.932 0-1.692 0.801-1.692 1.791 0 0.991 0.76 1.797 1.692 1.797h13.531c0.933 0 1.693-0.807 1.693-1.797 0-0.989-0.76-1.791-1.693-1.791z"/> </svg>
              }
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {metadata.map((stat, i) => (
            <p key={i}>
              <span className="w-full max-w-28 inline-block">{stat.text}</span>
              <span className="font-mono">{stat.value}</span>
            </p>
          ))}
        </CardContent>
      </Card>

      <Card className="my-2">
        <CardHeader>
          <CardTitle>Your Scores</CardTitle>
        </CardHeader>
        <CardContent className="-mt-4">
          {statsData.map((stat, i) => ( <Score key={i} text={stat.text} value={stat.value} /> ))}
        </CardContent>
      </Card>

      <Card className="my-2">
        <CardHeader>
          <CardTitle>Your Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          {
            data.ghID && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-center justify-center">
                <span className="col-span-2 sm:col-span-4 font-mono">GitHub Stats</span>
                <LogoCard stats={totalGH} text="Contributions" logo="gh" />
                <LogoCard stats={ghPerDay} text="Contributions Per Day" logo="gh" />
                <LogoCard stats={github.currentStreak} text="Current Streak" logo="gh" />
                <LogoCard stats={github.longestStreak} text="Longest Streak" logo="gh" />
              </div>
            )
          }
          {
            data.lcID && (
              <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 items-center justify-center ${data.ghID && "mt-8"}`}>
                <span className="col-span-2 sm:col-span-4 font-mono">Leetcode Stats</span>
                <LogoCard stats={totalLC} text="Submissions" logo="lc" />
                <LogoCard stats={lcPerDay} text="Submissions Per Day" logo="lc" />
                <LogoCard stats={leetcode.currentStreak} text="Current Streak" logo="lc" />
                <LogoCard stats={leetcode.longestStreak} text="Longest Streak" logo="lc" />
              </div>
            )
          }
        </CardContent>
      </Card>
      <ShareProfileButton ghID={data.ghID} lcID={data.lcID} />
    </div>
  )
}