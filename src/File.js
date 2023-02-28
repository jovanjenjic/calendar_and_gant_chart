import { useEffect, useState } from "react";
import dayjs from "dayjs";
import weekdayPlugin from "dayjs/plugin/weekday";
import objectPlugin from "dayjs/plugin/toObject";
import isTodayPlugin from "dayjs/plugin/isToday";
import mockData from './mockData';

dayjs.extend(weekdayPlugin);
dayjs.extend(objectPlugin);
dayjs.extend(isTodayPlugin);
dayjs.extend(require('dayjs/plugin/utc'));

const now = dayjs();

const resolveColor = (state) => {
	console.log('state', state);
	switch(state) {
		case 'CANCELED': {
			return '#FFEEEE';
		}
		case 'SUCCESSFUL': {
			return '#EDFFF3';
		}
		case 'EXPIRED': {
			return '#FFF3D5';
		}
		default: {
			return '#E6ECF1';
		}
	}
}

const findFirstFreeNumber = (arr) => {
  const num = arr.reduce(function(max, current) {
    // Ako je trenutni broj u objektu veći od maksimalnog, postavljamo ga kao maksimalni
    if (current.depth > max) {
      return current.depth;
    }
    // Inače, vraćamo trenutni maksimalni broj
    return max;
  }, arr[0].depth);

  // Kreiraj objekat ili Set koji će sadržati brojeve iz niza objekata
  const nums = new Set(arr.map(obj => obj.depth));
  
  // Inicijalizuj prvi slobodan broj na 0
  let firstFree = 1;
  
  // Prolazi kroz sve brojeve od 0 do prosleđenog broja
  for (let i = 1; i <= num + 1; i++) {
    // Ako se broj ne nalazi u objektu ili Set-u, postavljamo ga kao prvi slobodan i izlazimo iz petlje
    if (!nums.has(i)) {
      firstFree = i;
      break;
    }
  }
  
  // Vrati prvi slobodan broj
  return firstFree;
} 

const prepareMockData = (objects = [], startIntervalDays) => {
  const sortedObjects = objects.sort((a, b) => {
    return new Date(a.startTime) - new Date(b.startTime);
  });

  const filteredDates = sortedObjects.filter(value => {
    // Kreiramo novi objekat Date za trenutni datum
    const d = new Date(value?.startTime);
    // Proveravamo da li se mesec u objektu poklapa sa ciljanim mesecom
    return d.getMonth() === 2 - 1; // month - 1 jer getMonth() vraća indeks meseca (0-11)
  });

  const result = {};
  for (let obj of filteredDates) {
    const startDate = dayjs.utc(obj?.startTime);
    const endDate = dayjs.utc(obj?.endTime);

    const numberOfDays = endDate.diff(startDate, 'day');

    const days = [];

    for (let i = 0; i <= numberOfDays; i++) {
      days.push(startDate.add(i, 'day').format('YYYY-MM-DD'));
    }

    for (let i=0; i<days.length; i++) {
      const key = days[i];
      const prevKey = days[i-1];
      const startIntervalKey = obj?.startTime.split('T')[0];

      const isNotStartInterval = key !== startIntervalKey;

			const isNextWeek = startIntervalDays.includes(key);
      if (!result?.[key]) {
        if (isNotStartInterval) {
          result[key] = [{ 
						id: obj?.id,
						isStart: !isNotStartInterval,
						depth: isNextWeek ? 1 : result[prevKey][result[prevKey].length - 1].depth,
						time: dayjs(obj?.startTime).format('HH:mm'),
						user: `${obj?.guser?.firstName} ${obj?.guser?.lastName}`,
						color: resolveColor(obj?.state),
						isNextWeek,
						count: days.length,
					}];
        } else {
          result[key] = [{ 
						id: obj?.id,
						isStart: !isNotStartInterval,
						depth: 1,
						time: dayjs(obj?.startTime).format('HH:mm'),
						user: `${obj?.guser?.firstName} ${obj?.guser?.lastName}`,
						color: resolveColor(obj?.state),
						isNextWeek,
						count: days.length,
					}];
        }
      } else {

        if (isNotStartInterval) {
          const isNextWeek = startIntervalDays.includes(key);
          result[key].push({ 
						id: obj?.id,
						isStart: !isNotStartInterval,
						depth: isNextWeek ? findFirstFreeNumber(result[key]) : result[prevKey][result[prevKey].length - 1].depth,
						time: dayjs(obj?.startTime).format('HH:mm'),
						user: `${obj?.guser?.firstName} ${obj?.guser?.lastName}`,
						color: resolveColor(obj?.state),
						isNextWeek,
						count: days.length,
					});
        } else {
          result[key].push({
						id: obj?.id,
						isStart: !isNotStartInterval, 
						depth: findFirstFreeNumber(result[key]),
						time: dayjs(obj?.startTime).format('HH:mm'),
						user: `${obj?.guser?.firstName} ${obj?.guser?.lastName}`,
						color: resolveColor(obj?.state),
						isNextWeek,
						count: days.length,
					});
        }
      }
    } 
  }
  return result;
}

const Calendar = () => {
	const [currentMonth, setCurrentMonth] = useState(now);
	const [arrayOfDays, setArrayOfDays] = useState([]);
  const [startIntervalDays, setStartIntervalDays] = useState();

	const nextMonth = () => {
		const plus = currentMonth.add(1, "month");
		setCurrentMonth(plus);
	};

	const prevMonth = () => {
		const minus = currentMonth.subtract(1, "month");
		setCurrentMonth(minus);
	};

	const renderHeader = () => {
		const dateFormat = "MMMM YYYY";

		return (
			<div className="header row flex-middle">
				<div className="col col-start">
					<div className="icon" onClick={() => prevMonth()}>
						left
					</div>
				</div>
				<div className="col col-center">
					<span>{currentMonth.format(dateFormat)}</span>
				</div>
				<div className="col col-end" onClick={() => nextMonth()}>
					<div className="icon">right</div>
				</div>
			</div>
		);
	};

	const renderDays = () => {
		const dateFormat = "dddd";
		const days = [];

		for (let i = 0; i < 7; i++) {
			days.push(
				<div className="col col-center" key={i}>
					{now.weekday(i).format(dateFormat)}
				</div>
			);
		}
		return <div className="days row">{days}</div>;
	};

  const formateDateObject = date => {
		const clonedObject = { ...date.toObject() };

		const formatedObject = {
			day: clonedObject.date,
			month: clonedObject.months,
			year: clonedObject.years,
			isCurrentMonth: clonedObject.months === currentMonth.month(),
			isCurrentDay: date.isToday(),
      utc: dayjs(date).format('YYYY-MM-DD')
		};

		return formatedObject;
	};

	const getAllDays = () => {
		let currentDate = currentMonth.startOf("month").weekday(0);
		const nextMonth = currentMonth.add(1, "month").month();

		let allDates = [];
		let weekDates = [];
    let startIntervalDaysUtc = [];

		let weekCounter = 1;

		while (currentDate.weekday(0).toObject().months !== nextMonth) {
			const formated = formateDateObject(currentDate);

			weekDates.push(formated);
      
			if (weekCounter === 7) {
        allDates.push({ dates: weekDates });
        startIntervalDaysUtc.push(weekDates[0]?.utc);
				weekDates = [];
				weekCounter = 0;
			}

			weekCounter++;
			currentDate = currentDate.add(1, "day");
		}

    setStartIntervalDays(startIntervalDaysUtc);
		setArrayOfDays(allDates);
	};

	useEffect(() => {
		getAllDays();
	}, [currentMonth]);

	const renderCells = () => {
		const rows = [];
		let days = [];

    const preparedDatas = prepareMockData(mockData, startIntervalDays);
		arrayOfDays.forEach((week, index) => {
      week.dates.forEach((d, i) => {
				days.push(
					<div
						className={`col cell ${
							!d.isCurrentMonth ? "disabled" : d.isCurrentDay ? "selected" : ""
						}`}
						key={i}
					>
						<span className="number">{d.day}</span>
            <div className="grid-container">
              {(preparedDatas[d.utc] || []).map(v => {
                return (
									<p className="grid-cell" style={{ backgroundColor: v?.color, gridRow: `${v?.depth} / ${v?.depth + 1}` }}>
										{v?.isStart || v?.isNextWeek ? `${v?.time} BOO - BOO ${v?.user}` : ''}
									</p>
								);
              })}
            </div>
					</div>
				);
			});
			rows.push(
				<div className="row" key={index}>
					{days}
				</div>
			);
			days = [];
		});

		return <div className="body">{rows}</div>;
	};

	return (
		<div className="calendar">
			{renderHeader()}
			{renderDays()}
			{startIntervalDays && renderCells()}
		</div>
	);
};

export default Calendar;