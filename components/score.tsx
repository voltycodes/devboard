import { Progress } from "./ui/progress";

export default function Score({text, value}: {text: string, value: number}) {
  return (
    <div className="my-4">
      <div className="flex items-center justify-between mb-1">
        <div>{text}</div>
        <div>{value}</div>
      </div>
      <Progress value={value} />
    </div>
  )
}