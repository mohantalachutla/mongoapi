import process from 'process';
export const jobPollingEndTime = () =>
  new Date(
    new Date().getTime() +
      Number.parseInt(process.env.JOB_POLLING_DURATION_IN_MIN.trim()) *
        60 *
        1000
  );

export const isUUID = (uuid) => {
  return /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(
    uuid
  );
};
export const isMongoId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};
