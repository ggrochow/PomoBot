CREATE TABLE pomodoros (
    id bigserial primary key,
    slackUserId varchar(25) NOT NULL,
    startTime TIMESTAMP NOT NULL,
    endTime TIMESTAMP NOT NULL,
    duration INTERVAL MINUTE NOT NULL,
    finished BOOLEAN NOT NULL DEFAULT false,
    notes VARCHAR(255)
);

