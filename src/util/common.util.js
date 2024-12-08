import process from 'process';
export const jobPollingEndTime = () =>
  new Date(
    new Date().getTime() +
      Number.parseInt(process.env.JOB_POLLING_DURATION_IN_MIN.trim()) *
        60 *
        1000
  );
