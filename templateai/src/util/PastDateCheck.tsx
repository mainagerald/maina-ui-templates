export const isPast = (date: string) => {
  const eventDate = new Date(date);
  const today = new Date();
  const todayWithoutTime=new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return eventDate < todayWithoutTime;
};