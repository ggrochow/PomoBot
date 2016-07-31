import { create, get } from './../postgres.js';

function Pomodoro(pomo) {
    const columnNames = Pomodoro._columnNames;
    for (const i in columnNames) {
        const columnName = columnNames[i];
        this[columnName] = pomo[columnName];
    }
}
Pomodoro._columnNames = ['id', 'slackUserId', 'startTime', 'endTime', 'duration', 'finished', 'notes'];
Pomodoro._tableName = "pomodoros";

export default Pomodoro;
export const createPomodoro = create(Pomodoro);
export const getPomodoro = get(Pomodoro);

// createPomodoro({
//     slackUserId: "123",
//     startTime: new Date(),
//     endTime: new Date(),
//     duration: new Date(),
// }, (err, pomo) => {
//     if (err) { console.log(err); return;}
//     console.log(pomo);
// });

// getPomodoro({
//     id: "3"
// }, (err, data) => {
//     console.log(data, err);
// });