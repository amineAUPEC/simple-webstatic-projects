function calculateDifference() {
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);
    const resultElement = document.getElementById('result');

    if (isNaN(startDate) || isNaN(endDate)) {
        resultElement.textContent = 'Veuillez sélectionner les deux dates.';
        return;
    }

    const timeDifference = endDate - startDate;
    const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));

    // Calculer la différence en semaines et jours
    const weeksDifference = Math.floor(daysDifference / 7);
    const remainingDays = daysDifference % 7;

    // Calculer la différence en mois et jours
    let monthsDifference = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());
    let remainingDaysInMonth = endDate.getDate() - startDate.getDate();
    if (remainingDaysInMonth < 0) {
        monthsDifference -= 1;
        const previousMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0);
        remainingDaysInMonth += previousMonth.getDate();
    }

    resultElement.innerHTML = `Difference between ${startDate.toDateString()} and ${endDate.toDateString()}:<br>
    ${monthsDifference} months ${remainingDaysInMonth} days<br>
    or ${weeksDifference} weeks ${remainingDays} days<br>
    or ${daysDifference} calendar days`;
}
