import { create } from './../postgres.js';

export default function Pomodoro(pomo) {
    this.id = pomo.id;
    this.slackUserId = pomo.slackUserId;
    this.startTime = pomo.startTime;
    this.endTime = pomo.endTime;
    this.duration = pomo.duration;
    this.finished = pomo.finished;
    this.notes = pomo.notes;
}

export const createPomodoro = create("pomodoros", Pomodoro);
