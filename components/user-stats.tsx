import LogoCard from "./logo-card";

export default function UserStats({data}: {data: any}) {
  const {totalGH, totalLC, lcStreak} = data;
  
  const ghPerDay = totalGH / 365;
  const lcPerDay = totalLC / 365;



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