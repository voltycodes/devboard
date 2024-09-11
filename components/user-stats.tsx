import LogoCard from "./logo-card";

export default function UserStats({data}: {data: any}) {
  const {totalGH, totalLC, lcStreak} = data;
  
  const ghPerDay = totalGH / 365;
  const lcPerDay = totalLC / 365;

  // formula = (gh per day + lc per day) * (current gh streak / longest gh streak) * (current lc streak / longest lc streak)

  const score = (ghPerDay + lcPerDay) * (lcStreak);
  return (
    <div>
      <span>Total Score: {score}</span>
      <h1>Total Contributions & Submissions</h1>
      <div className="flex gap-2 items-stretch">
        <LogoCard text={totalGH} logo="gh" />
        <LogoCard text={totalLC} logo="lc" />
      </div>
    </div>
  )
}