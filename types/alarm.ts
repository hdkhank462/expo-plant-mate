// type meridiem = "AM" | "PM";

// type twelveHrTime = { hour: string; minute: string; meridiem: meridiem };

// interface AlarmInterface extends twelveHrTime {
//   active: boolean;
//   key: string;
// }

// type AlarmsObject = { [x: string]: AlarmInterface };

type AlarmsObject = { [x: string]: UserPlantCareLocal };
