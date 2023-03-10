/* eslint-disable no-nested-ternary */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-plusplus */
import dayjs from "dayjs";
import findFirstFreeNumber from "./findFIrstFreeNumber";
// import resolveColor from "./resolveColor";

const prepareData = (
  objects,
  startIntervalDays,
  startIntervalKey,
  endIntervalKey,
  colorByKey,
  customColors,
  defaultColor
) => {
  const result = {};

  for (const obj of objects) {
    const startDate = dayjs.utc(obj?.[startIntervalKey]);
    const endDate = dayjs.utc(obj?.[endIntervalKey]);

    const numberOfDays = endDate.diff(startDate, "day");

    const days = [];

    for (let i = 0; i <= numberOfDays; i++) {
      days.push(startDate.add(i, "day").format("YYYY-MM-DD"));
    }

    const startInterval = obj?.[startIntervalKey].split("T")[0];
    for (let i = 0; i < days.length; i++) {
      const key = days[i];
      const prevKey = days[i - 1];

      const isStartInterval = key === startInterval;
      const isNextWeek = (startIntervalDays || []).includes(key);

      const res = {
        ...obj,
        isStart: isStartInterval || isNextWeek,
        time: dayjs(obj?.[startIntervalKey]).format("HH:mm"),
        user: `${obj?.guser?.firstName} ${obj?.guser?.lastName}`,
        color: customColors?.[obj?.[colorByKey]] || defaultColor,
        isNextWeek,
        depth:
          isNextWeek || isStartInterval
            ? findFirstFreeNumber(result[key])
            : result[prevKey][result[prevKey].length - 1].depth,
        length: isNextWeek
          ? days.length - i > 7
            ? 7
            : days.length - i
          : days.length > 7
          ? 7
          : days.length,
      };
      result[key] = [...(result[key] || []), res];
    }
  }
  return result;
};

export default prepareData;
