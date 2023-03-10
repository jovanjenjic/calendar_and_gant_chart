import dayjs from "dayjs";

const formateDateData = (date, currentMonth) => {
  const clonedObject = { ...date.toObject() };

  const formatedObject = {
    day: clonedObject.date,
    month: clonedObject.months,
    year: clonedObject.years,
    isCurrentMonth: clonedObject.months === currentMonth.month(),
    isCurrentDay: date.isToday(),
    utc: dayjs(date).format("YYYY-MM-DD"),
  };

  return formatedObject;
};

export default formateDateData;
