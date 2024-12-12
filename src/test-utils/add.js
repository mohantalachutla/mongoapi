export function getRandomNumber() {
  return Math.floor(Math.random() * 100);
}

export function addToRandom(num) {
  const randomNum = this.getRandomNumber();
  if (!randomNum) throw new Error('Error');
  return num + randomNum;
}
