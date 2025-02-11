document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('appointment-form');
    const calendarContainer = document.getElementById('calendar-container');
    const appointmentsTable = document.getElementById('appointments-table').querySelector('tbody');
    const downloadJsonBtn = document.getElementById('download-json');
    const downloadCsvBtn = document.getElementById('download-csv');
    const downloadIcalBtn = document.getElementById('download-ical');
    const syncIcloudBtn = document.getElementById('sync-icloud');
    const syncOutlookBtn = document.getElementById('sync-outlook');
    const syncGmailBtn = document.getElementById('sync-gmail');
    const fileInput = document.getElementById('file-input');
    let appointments = [];

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const date = document.getElementById('date').value;
        const label = document.getElementById('label').value;
        if (date && label) {
            appointments.push({ date, label });
            updateCalendar();
            updateTable();
        }
    });

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const content = event.target.result;
                if (file.name.endsWith('.json')) {
                    importFromJson(content);
                } else if (file.name.endsWith('.csv')) {
                    importFromCsv(content);
                } else if (file.name.endsWith('.ics')) {
                    importFromIcal(content);
                }
            };
            reader.readAsText(file);
        }
    });

    function importFromJson(content) {
        const data = JSON.parse(content);
        appointments = appointments.concat(data);
        updateCalendar();
        updateTable();
    }

    function importFromCsv(content) {
        const rows = content.split('\n');
        rows.forEach(row => {
            const [date, label] = row.split(',');
            if (date && label) {
                appointments.push({ date, label });
            }
        });
        updateCalendar();
        updateTable();
    }

    function importFromIcal(content) {
        const events = content.split('BEGIN:VEVENT').slice(1);
        events.forEach(event => {
            const dateMatch = event.match(/DTSTART:(\d{8})/);
            const summaryMatch = event.match(/SUMMARY:(.+)/);
            if (dateMatch && summaryMatch) {
                const date = `${dateMatch[1].slice(0, 4)}-${dateMatch[1].slice(4, 6)}-${dateMatch[1].slice(6, 8)}`;
                const label = summaryMatch[1];
                appointments.push({ date, label });
            }
        });
        updateCalendar();
        updateTable();
    }

    function updateCalendar() {
        calendarContainer.innerHTML = '';
        const currentDate = new Date();
        for (let monthOffset = 0; monthOffset < 12; monthOffset++) {
            const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - monthOffset, 1);
            const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
            const monthContainer = document.createElement('div');
            monthContainer.classList.add('month-container');
            const monthHeader = document.createElement('div');
            monthHeader.classList.add('month-header');
            monthHeader.textContent = monthDate.toLocaleString('fr-FR', { month: 'long', year: 'numeric' });
            monthContainer.appendChild(monthHeader);
            const monthCalendar = document.createElement('div');
            monthCalendar.classList.add('calendar');
            const daysOfWeek = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
            daysOfWeek.forEach(day => {
                const dayHeader = document.createElement('div');
                dayHeader.classList.add('day-header');
                dayHeader.textContent = day;
                monthCalendar.appendChild(dayHeader);
            });
            for (let i = 1; i <= daysInMonth; i++) {
                const day = document.createElement('div');
                day.classList.add('day');
                day.textContent = i;
                const dateStr = `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
                if (appointments.some(app => app.date === dateStr)) {
                    day.classList.add('selected');
                }
                day.addEventListener('click', () => toggleDateSelection(dateStr));
                monthCalendar.appendChild(day);
            }
            monthContainer.appendChild(monthCalendar);
            calendarContainer.appendChild(monthContainer);
        }
    }

    function toggleDateSelection(date) {
        const index = appointments.findIndex(app => app.date === date);
        if (index > -1) {
            appointments.splice(index, 1);
        } else {
            const label = prompt('Entrez le libellé pour cette date:');
            if (label) {
                appointments.push({ date, label });
            }
        }
        updateCalendar();
        updateTable();
    }

    function updateTable() {
        appointmentsTable.innerHTML = '';
        appointments.forEach(appointment => {
            const row = document.createElement('tr');
            const dateCell = document.createElement('td');
            const labelCell = document.createElement('td');
            dateCell.textContent = formatDate(appointment.date);
            labelCell.textContent = appointment.label;
            row.appendChild(dateCell);
            row.appendChild(labelCell);
            appointmentsTable.appendChild(row);
        });
    }

    function formatDate(dateStr) {
        const date = new Date(dateStr);
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        return date.toLocaleDateString('fr-FR', options);
    }

    downloadJsonBtn.addEventListener('click', () => {
        downloadFile('appointments.json', JSON.stringify(appointments));
    });

    downloadCsvBtn.addEventListener('click', () => {
        const csvContent = appointments.map(app => `${formatDate(app.date)},${app.label}`).join('\n');
        downloadFile('appointments.csv', csvContent);
    });

    downloadIcalBtn.addEventListener('click', () => {
        const icalContent = appointments.map(app => `BEGIN:VEVENT\nDTSTART:${formatIcalDate(app.date)}\nSUMMARY:${app.label}\nEND:VEVENT`).join('\n');
        const icalData = `BEGIN:VCALENDAR\nVERSION:2.0\n${icalContent}\nEND:VCALENDAR`;
        downloadFile('appointments.ics', icalData);
    });

    syncIcloudBtn.addEventListener('click', () => {
        alert('La synchronisation avec iCloud nécessite une configuration supplémentaire.');
        // Implémentation de la synchronisation avec iCloud
    });

    syncOutlookBtn.addEventListener('click', () => {
        alert('La synchronisation avec Outlook nécessite une configuration supplémentaire.');
        // Implémentation de la synchronisation avec Outlook
    });

    syncGmailBtn.addEventListener('click', () => {
        alert('La synchronisation avec Gmail nécessite une configuration supplémentaire.');
        // Implémentation de la synchronisation avec Gmail
    });

    function downloadFile(filename, content) {
        const dataStr = `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`;
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute('href', dataStr);
        downloadAnchorNode.setAttribute('download', filename);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

    function formatIcalDate(dateStr) {
        const date = new Date(dateStr);
        return date.toISOString().replace(/[-:]/g, '').split('.')[0];
    }

    updateCalendar();
});