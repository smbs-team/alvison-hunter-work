import { HoursObject, Brand } from '../interfaces/menuInterfaces';

interface Interval {
  start_time: string;
  end_time: string;
}

export const getHour = (hour: number) => ((hour + 11) % 12) + 1;
export const getSuffix = (hour: number) => (hour >= 12 ? 'pm' : 'am');
export const getWeekday = () =>
  new Date()
    .toLocaleString(window.navigator.language, {
      weekday: 'long',
    })
    .toLowerCase();

export const getStartTime = (brand: Brand) => {
  if (
    !brand ||
    !brand.hoursOfOperation.opening_hours[getWeekday()] ||
    (brand.hoursOfOperation.opening_hours[getWeekday()] &&
      !brand.hoursOfOperation.opening_hours[getWeekday()].length)
  ) {
    return false;
  }
  return brand.hoursOfOperation.opening_hours[getWeekday()][0].start_time;
};

export const getStartString = (brand: Brand) => {
  const startTime = getStartTime(brand);
  if (!startTime) {
    return false;
  }
  return `${brand ? getHour(parseInt(startTime!.split(':')[0], 10)) : ''}${
    parseInt(startTime!.split(':')[1], 10)
      ? `${parseInt(startTime!.split(':')[1], 10)}`
      : ''
  }${
    brand ? getSuffix(parseInt(startTime!.split(':')[0], 10)).toUpperCase() : ''
  }`;
};

function getString(interval: Interval) {
  if (!interval) {
    return false;
  }
  const splitStart = interval.start_time.split(':');
  const splitEnd = interval.end_time.split(':');
  const formattedStartHour = getHour(parseInt(splitStart[0], 10));
  const formattedEndHour = getHour(parseInt(splitEnd[0], 10));
  return `${formattedStartHour}${
    parseInt(splitStart[1], 10) ? `:${parseInt(splitStart[1], 10)}` : ''
  }${getSuffix(parseInt(splitStart[0], 10))}-${formattedEndHour}${
    parseInt(splitEnd[1], 10) ? `:${parseInt(splitEnd[1], 10)}` : ''
  }${getSuffix(parseInt(splitEnd[0], 10))}`;
}

export function translateStoreHours(hoursObj: HoursObject) {
  return [
    { day: 'Mon', dayString: getString(hoursObj['monday'][0]) },
    { day: 'Tues', dayString: getString(hoursObj['tuesday'][0]) },
    { day: 'Wed', dayString: getString(hoursObj['wednesday'][0]) },
    { day: 'Thurs', dayString: getString(hoursObj['thursday'][0]) },
    { day: 'Fri', dayString: getString(hoursObj['friday'][0]) },
    { day: 'Sat', dayString: getString(hoursObj['saturday'][0]) },
    { day: 'Sun', dayString: getString(hoursObj['sunday'][0]) },
  ];
}
