import _ from 'lodash';

export const isEmpty = (value) => {
  return value === undefined || value === null || _.isEmpty(value);
};
