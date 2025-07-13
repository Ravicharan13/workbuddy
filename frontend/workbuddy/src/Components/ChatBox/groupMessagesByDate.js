import { isToday, isYesterday, format } from 'date-fns';

export function groupMessages(messages) {
  const grouped = {};

  messages.forEach((msg) => {
    const date = new Date(msg.timestamp);
    let label = "";

    if (isToday(date)) label = "Today";
    else if (isYesterday(date)) label = "Yesterday";
    else label = format(date, "MMMM dd, yyyy");

    if (!grouped[label]) grouped[label] = [];
    grouped[label].push(msg);
  });

  return grouped;
}
