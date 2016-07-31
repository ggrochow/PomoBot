CREATE TABLE pomodoros (
    "id" bigserial primary key,
    "slackUserId" varchar(25) NOT NULL,
    "startTime" TIMESTAMP WITH TIME ZONE NOT NULL,
    "endTime" TIMESTAMP WITH TIME ZONE NOT NULL,
    "duration" TIMESTAMP WITH TIME ZONE NOT NULL,
    "finished" BOOLEAN NOT NULL DEFAULT false,
    "notes" VARCHAR(255)
);

