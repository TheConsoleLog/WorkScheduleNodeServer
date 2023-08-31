exports.getNextWeekDates = () => {
  const currentDate = new Date();
  const currentDay = currentDate.getDay(); // 0 (Sonntag) bis 6 (Samstag)
  
  // Ermittle den Tag für den übernächsten Freitag (aktueller Tag + Differenz bis Freitag + 7 Tage)
  const daysUntilNextFriday = (5 + 7 - currentDay) % 7;
  const nextFriday = new Date(currentDate);
  nextFriday.setDate(currentDate.getDate() + daysUntilNextFriday + 7);

  // Erstelle ein leeres Array für die Datumsangaben der übernächsten Woche
  const weekAfterNextDates = [];

  // Wochentagskürzel
  const dayAbbreviations = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

  // Füge die Datumsangaben mit Wochentagskürzeln in das Array ein
  for (let i = 0; i < 7; i++) {
    const nextDate = new Date(nextFriday);
    nextDate.setDate(nextFriday.getDate() + i);
    const dayAbbreviation = dayAbbreviations[nextDate.getDay()];
    const formattedDate = `${dayAbbreviation}, ${nextDate.toLocaleDateString('de-DE')}`;
    weekAfterNextDates.push({
      real: nextDate,
      display: formattedDate,
      isActive: false
    })
  }

  return weekAfterNextDates;
}

exports.getCw = (date) => {
  const firstOfJanuary = new Date(Number(date.getFullYear()), 0, 1);
  let numberOfDays = Math.floor(
    (date.getTime() - firstOfJanuary.getTime()) / (1000 * 60 * 60 * 24)
  );
  //check if January First is before or behind thursday
  if (0 < firstOfJanuary.getDay() && firstOfJanuary.getDay() <= 4) {
    numberOfDays += firstOfJanuary.getDay() - 1;
  } else if (firstOfJanuary.getDay() === 0) {
    numberOfDays--;
  } else {
    numberOfDays -= 7 - firstOfJanuary.getDay() - 1;
  }
  return Math.ceil(numberOfDays / 7);
}
