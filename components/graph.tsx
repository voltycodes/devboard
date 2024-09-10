import { format, eachDayOfInterval, getDay, startOfYear, endOfYear, differenceInDays } from 'date-fns';
import { getTileColor } from '@/lib/utils';

export default function Graph({ data }: { data: any }) {
  const today = new Date();
  const startDate = startOfYear(today);
  const endDate = endOfYear(today);
  const dates = eachDayOfInterval({ start: startDate, end: endDate });

  const contributionLevels = [0, 1, 2, 3, 4]; // 0 is no contribution, 4 is highest

  const weeks = [];
  let currentWeek: { date: Date; ghContributions: number; lcContributions: number; }[] = [];

  dates.forEach((date, index) => {
    if (index === 0 || getDay(date) === 0) {
      if (currentWeek.length > 0) {
        weeks.push(currentWeek);
      }
      currentWeek = [];
    }
    const dateIdx = date.toISOString().split('T')[0];
    const ghContribs = (data[dateIdx] && data[dateIdx].github) ? data[dateIdx].github : 0;
    const lcSubs = (data[dateIdx] && data[dateIdx].leetcode) ? data[dateIdx].leetcode : 0;

    currentWeek.push({
      date,
      ghContributions: date > today ? -1 : ghContribs,
      lcContributions: date > today ? -1 : lcSubs,
    });
  });

  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="w-full max-w-screen-md">
      <div className="flex overflow-hidden max-w-screen-md">
        <div className="w-10 pr-2 pt-5">
          <div className="h-5"></div>
          <div className="h-5 text-xs text-gray-400 text-center leading-6">Mon</div>
          <div className="h-5"></div>
          <div className="h-5 text-xs text-gray-400 text-center leading-6">Wed</div>
          <div className="h-5"></div>
          <div className="h-5 text-xs text-gray-400 text-center leading-6">Fri</div>
        </div>
        <div
          className="flex w-full overflow-x-auto scrollbar-hide"
        >
          <div className="relative flex gap-1 mt-5">
            <div className="absolute flex w-full justify-around gap-1 text-gray-400 -mt-5">
              {monthLabels.map((month) => (
                <div key={month} className="text-xs">{month}</div>
              ))}
            </div>
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className={`w-4 ${weekIndex === 0 ? 'mt-auto' : ''}`}>
                {week.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    className={`h-4 w-4 my-1 rounded ${getTileColor(day.ghContributions, day.lcContributions)}`}
                    title={
                      (day.ghContributions == -1 || day.lcContributions == -1)
                      ? `${format(day.date, 'MMM d, yyyy')}`
                      : `${format(day.date, 'MMM d, yyyy')}: ${day.ghContributions} contributions & ${day.lcContributions} submissions`
                    }
                  ></div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center items-end mt-2 gap-2 text-xs text-gray-400">
        <div className="flex items-center">
          <span className="mr-1">GitHub</span>
          <div className="flex">
            {contributionLevels.map((level) => (
              <div
                key={level}
                className={`h-4 w-4 mx-0.5 rounded ${
                  level === 0
                    ? 'bg-gray-800'
                    : level === 1
                    ? 'bg-emerald-900'
                    : level === 2
                    ? 'bg-emerald-700'
                    : level === 3
                    ? 'bg-emerald-500'
                    : 'bg-emerald-300'
                }`}
              ></div>
            ))}
          </div>
        </div>
        <div className="flex items-center">
          <span className="mr-1">Leetcode</span>
          <div className="flex">
            {contributionLevels.map((level) => (
              <div
                key={level}
                className={`h-4 w-4 mx-0.5 rounded ${
                  level === 0
                    ? 'bg-gray-800'
                    : level === 1
                    ? 'bg-cyan-900'
                    : level === 2
                    ? 'bg-cyan-700'
                    : level === 3
                    ? 'bg-cyan-500'
                    : 'bg-cyan-300'
                }`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}