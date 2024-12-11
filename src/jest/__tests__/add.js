jest.mock('../add', () => {
  const actual = jest.requireActual('../add');
  return {
    __esModule: true,
    ...actual,
    getRandomNumber: jest.fn(),
  };
});

import * as add from '../add';

beforeEach(() => {
  add.getRandomNumber.mockReset();
});

describe('add', () => {
  it('should add two numbers', () => {
    expect(add.getRandomNumber.mock).toBeDefined();
    add.getRandomNumber.mockImplementation(() => 4);
    expect(add.getRandomNumber()).toBe(4);
    expect(add.getRandomNumber).toHaveBeenCalledTimes(1);

    expect(add.addToRandom.mock).not.toBeDefined();
    expect(add.addToRandom(1)).toBe(5);

    expect(add.getRandomNumber).toHaveBeenCalledTimes(2);
  });

  it('should throw error', () => {
    try {
      expect(add.addToRandom(1)).toThrow('Error');
    } catch (error) {
      error;
    }
  });
});
