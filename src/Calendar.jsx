/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-plusplus */
import React from "react";
import dayjs from "dayjs";
import weekdayPlugin from "dayjs/plugin/weekday";
import objectPlugin from "dayjs/plugin/toObject";
import isTodayPlugin from "dayjs/plugin/isToday";
import PropTypes from "prop-types";
import filterDatesByMonth from "./utility/filterDatesByMonth";
import prepareData from "./utility/prepareData";
import formateDateData from "./utility/formateDateData";
import "./Calendar.css";

dayjs.extend(weekdayPlugin);
dayjs.extend(objectPlugin);
dayjs.extend(isTodayPlugin);
dayjs.extend(require("dayjs/plugin/utc"));

const now = dayjs();
const dateFormat01 = "MMMM YYYY";
const dateFormat02 = "ddd";

function Calendar({
  arrayData,
  startIntervalKey,
  endIntervalKey,
  colorByKey,
  customColors,
  defaultColor,
  createItemName,
}) {
  const [currentMonth, setCurrentMonth] = React.useState(now);
  const [arrayOfDays, setArrayOfDays] = React.useState([]);
  const [startIntervalDays, setStartIntervalDays] = React.useState();

  const nextMonth = () => {
    const plus = currentMonth.add(1, "month");
    setCurrentMonth(plus);
  };

  const prevMonth = () => {
    const minus = currentMonth.subtract(1, "month");
    setCurrentMonth(minus);
  };

  const getAllDays = React.useCallback(() => {
    let currentDate = currentMonth.startOf("month").weekday(0);
    const nextMonthValue = currentMonth.add(1, "month").month();

    const allDates = [];
    let weekDates = [];
    const startIntervalDaysUtc = [];

    let weekCounter = 1;

    while (currentDate.weekday(0).toObject().months !== nextMonthValue) {
      const formated = formateDateData(currentDate, currentMonth);

      weekDates.push(formated);

      if (weekCounter === 7) {
        allDates.push(weekDates);
        startIntervalDaysUtc.push(weekDates[0]?.utc);
        weekDates = [];
        weekCounter = 0;
      }

      weekCounter++;
      currentDate = currentDate.add(1, "day");
    }

    setStartIntervalDays(startIntervalDaysUtc);
    setArrayOfDays(allDates);
  }, [currentMonth]);

  const filteredDates = filterDatesByMonth(arrayData, currentMonth.month() + 1)
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
    .sort((a, b) => b?.guser?.firstName - a?.guser?.firstName);

  const preparedDatas = prepareData(
    filteredDates,
    startIntervalDays,
    startIntervalKey,
    endIntervalKey,
    colorByKey,
    customColors,
    defaultColor
  );

  React.useEffect(() => {
    getAllDays();
  }, [currentMonth, getAllDays]);

  return (
    <div className="calendar-wrapper">
      <div className="header-component">
        <button
          type="button"
          className="header-component__button"
          onClick={() => prevMonth()}
        >
          <i className="header-component__arrow header-component__arrow--left" />
        </button>
        <div className="header-component__month-text">
          <span>{currentMonth.format(dateFormat01)}</span>
        </div>
        <button
          type="button"
          className="header-component__button"
          onClick={() => nextMonth()}
        >
          <i className="header-component__arrow header-component__arrow--right" />
        </button>
        <button
          className="header-component__button header-component__button--padding-side header-component__button--left-margin"
          type="button"
          onClick={() => setCurrentMonth(now)}
        >
          Today
        </button>
      </div>

      <div className="days-component">
        {[0, 1, 2, 3, 4, 5, 6].map((_, i) => (
          <div className="days-component__day" key={i}>
            {now.weekday(i).format(dateFormat02)}
          </div>
        ))}
      </div>

      <div className="cells-component">
        {arrayOfDays.map((week, index) => (
          <div className="cells-component-row" key={index}>
            {week.map((weekDay, i) => (
              <div className="cells-component-column">
                {i !== 0 && <div className="border" />}
                <p
                  className="cells-component-row__number"
                  style={{ gridRow: 1 }}
                >
                  {weekDay?.day}
                </p>
                {(preparedDatas[weekDay.utc] || []).map((v) => {
                  return (
                    v?.isStart && (
                      <p
                        className="cells-component-row__cell-item"
                        style={{
                          gridRow: `${v?.depth + 1}`,
                          gridColumn: `${i + 1} / ${i + v?.length + 1}`,
                          backgroundColor: v?.color,
                        }}
                      >
                        {createItemName(v) || `${v?.time} BOO - BOO ${v?.user}`}
                      </p>
                    )
                  );
                })}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

Calendar.propTypes = {
  arrayData: PropTypes.arrayOf.isRequired,
  startIntervalKey: PropTypes.string.isRequired,
  endIntervalKey: PropTypes.string.isRequired,
  colorByKey: PropTypes.string,
  customColors: PropTypes.object,
  defaultColor: PropTypes.string,
  createItemName: PropTypes.func,
};

Calendar.defaultProps = {
  colorByKey: null,
  customColors: null,
  defaultColor: "#e9e9e9",
  createItemName: () => null,
};

export default Calendar;
