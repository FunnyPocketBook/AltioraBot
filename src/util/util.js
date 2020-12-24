export function humanTimeToSeconds(time) {
  let seconds = 0;
  const splitTime = time.match(/\d+[hms]/g);
  if (splitTime === null) return -1;
  for (const t of splitTime) {
    const type = t.slice(-1);
    const number = t.slice(0, -1);
    switch (type) {
      case "h":
        seconds += number * 60 * 60;
        break;
      case "m":
        seconds += number * 60;
        break;
      case "s":
        seconds += parseInt(number);
        break;
    }
  }
  return seconds;
}

export function argumentParser(args) {
  const sortedArguments = {};
  let option = '';
  for (const arg of args) {
    if (arg.startsWith('-')) {
      option = arg.slice(1);
      sortedArguments[option] = [];
      continue;
    }
    if (option !== '') {
      sortedArguments[option].push(arg);
    }
  }
  return sortedArguments;
}