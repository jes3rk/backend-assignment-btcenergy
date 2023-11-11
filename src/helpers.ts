export function getBeginningOfDayInMillis(date: Date): number {
  const clonedDate = new Date(date.getTime());
  clonedDate.setUTCHours(0, 0, 0, 0);
  return clonedDate.getTime();
}
