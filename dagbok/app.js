// Dagboksapp - Del 3
// Funktionalitet: Skriva, läsa, dela backup, kalendervy, sökning, påminnelser & PWA

class DiaryApp {
    constructor() {
        this.currentDate = this.getTodayString();
        this.entries = this.loadEntries();
        this.saveTimeout = null;
        this.calendarDate = new Date(); // Vilken månad som visas i kalendern

        this.initElements();
        this.initEventListeners();
        this.loadEntry(this.currentDate);
        this.updateDateDisplay();
    }

    // Initiera DOM-element
    initElements() {
        this.dateInput = document.getElementById('dateInput');
        this.entryText = document.getElementById('entryText');
        this.dateDisplay = document.getElementById('dateDisplay');
        this.entryStatus = document.getElementById('entryStatus');
        this.saveIndicator = document.querySelector('.saved-text');
        this.prevDayBtn = document.getElementById('prevDay');
        this.nextDayBtn = document.getElementById('nextDay');
        this.viewListBtn = document.getElementById('viewListBtn');
        this.backToWriteBtn = document.getElementById('backToWriteBtn');
        this.shareBackupBtn = document.getElementById('shareBackupBtn');
        this.writeView = document.getElementById('writeView');
        this.listView = document.getElementById('listView');
        this.readView = document.getElementById('readView');
        this.entriesList = document.getElementById('entriesList');
        this.noEntries = document.getElementById('noEntries');
        this.backToListBtn = document.getElementById('backToListBtn');
        this.editEntryBtn = document.getElementById('editEntryBtn');
        this.readDate = document.getElementById('readDate');
        this.readContent = document.getElementById('readContent');
        this.viewCalendarBtn = document.getElementById('viewCalendarBtn');
        this.calendarView = document.getElementById('calendarView');
        this.backToWriteFromCal = document.getElementById('backToWriteFromCal');
        this.calendarMonthYear = document.getElementById('calendarMonthYear');
        this.prevMonthBtn = document.getElementById('prevMonth');
        this.nextMonthBtn = document.getElementById('nextMonth');
        this.calendarDays = document.getElementById('calendarDays');
        this.searchInput = document.getElementById('searchInput');
        this.backupReminder = document.getElementById('backupReminder');
        this.reminderBackupBtn = document.getElementById('reminderBackupBtn');
        this.dismissReminderBtn = document.getElementById('dismissReminderBtn');
        this.themeToggle = document.getElementById('themeToggle');
        this.themeIcon = document.querySelector('.theme-icon');
    }

    // Initiera event listeners
    initEventListeners() {
        // Datumväljare
        this.dateInput.addEventListener('change', (e) => {
            this.currentDate = e.target.value;
            this.loadEntry(this.currentDate);
            this.updateDateDisplay();
        });

        // Föregående/nästa dag
        this.prevDayBtn.addEventListener('click', () => this.changeDay(-1));
        this.nextDayBtn.addEventListener('click', () => this.changeDay(1));

        // Auto-save när man skriver
        this.entryText.addEventListener('input', () => {
            this.autoSave();
        });

        // Visa listvy
        this.viewListBtn.addEventListener('click', () => {
            this.showListView();
        });

        // Tillbaka till skrivvy
        this.backToWriteBtn.addEventListener('click', () => {
            this.showWriteView();
        });

        // Dela backup
        this.shareBackupBtn.addEventListener('click', () => {
            this.shareBackup();
        });

        // Tillbaka till lista från läsvy
        this.backToListBtn.addEventListener('click', () => {
            this.showListView();
        });

        // Redigera inlägg från läsvy
        this.editEntryBtn.addEventListener('click', () => {
            this.showWriteView();
        });

        // Visa kalendervy
        this.viewCalendarBtn.addEventListener('click', () => {
            this.showCalendarView();
        });

        // Tillbaka från kalender till skrivvy
        this.backToWriteFromCal.addEventListener('click', () => {
            this.showWriteView();
        });

        // Navigera månad
        this.prevMonthBtn.addEventListener('click', () => this.changeMonth(-1));
        this.nextMonthBtn.addEventListener('click', () => this.changeMonth(1));

        // Sökning
        this.searchInput.addEventListener('input', (e) => {
            this.filterEntries(e.target.value);
        });

        // Backup-påminnelse
        this.reminderBackupBtn.addEventListener('click', () => {
            this.shareBackup();
        });

        this.dismissReminderBtn.addEventListener('click', () => {
            this.dismissBackupReminder();
        });

        // Tema-växling
        this.themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });

        // Ladda sparat tema
        this.loadTheme();
    }

    // Hämta dagens datum som sträng (YYYY-MM-DD)
    getTodayString() {
        const today = new Date();
        return this.formatDate(today);
    }

    // Formatera datum till YYYY-MM-DD
    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Byt dag (±1)
    changeDay(offset) {
        const date = new Date(this.currentDate + 'T12:00:00');
        date.setDate(date.getDate() + offset);
        this.currentDate = this.formatDate(date);
        this.dateInput.value = this.currentDate;
        this.loadEntry(this.currentDate);
        this.updateDateDisplay();
    }

    // Uppdatera datumvisning
    updateDateDisplay() {
        this.dateInput.value = this.currentDate;

        const today = this.getTodayString();
        const date = new Date(this.currentDate + 'T12:00:00');

        let displayText = '';

        if (this.currentDate === today) {
            displayText = 'Idag';
        } else {
            const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
            displayText = date.toLocaleDateString('sv-SE', options);
        }

        this.dateDisplay.textContent = displayText;

        // Visa status om inlägg redan finns
        if (this.entries[this.currentDate]) {
            this.entryStatus.textContent = '(Detta datum har redan ett inlägg)';
        } else {
            this.entryStatus.textContent = '';
        }
    }

    // Ladda inlägg för ett datum
    loadEntry(date) {
        const entry = this.entries[date] || '';
        this.entryText.value = entry;
    }

    // Auto-save med fördröjning
    autoSave() {
        clearTimeout(this.saveTimeout);

        this.saveTimeout = setTimeout(() => {
            this.saveEntry();
        }, 500); // Spara 500ms efter senaste ändring
    }

    // Spara inlägg
    saveEntry() {
        const text = this.entryText.value.trim();

        if (text) {
            this.entries[this.currentDate] = text;
        } else {
            // Ta bort tomt inlägg
            delete this.entries[this.currentDate];
        }

        this.saveEntries();
        this.showSaveIndicator();
        this.updateDateDisplay(); // Uppdatera status
    }

    // Visa sparindikator
    showSaveIndicator() {
        this.saveIndicator.classList.add('show');

        setTimeout(() => {
            this.saveIndicator.classList.remove('show');
        }, 2000);
    }

    // Ladda alla inlägg från localStorage
    loadEntries() {
        const saved = localStorage.getItem('diaryEntries');
        return saved ? JSON.parse(saved) : {};
    }

    // Spara alla inlägg till localStorage
    saveEntries() {
        localStorage.setItem('diaryEntries', JSON.stringify(this.entries));
    }

    // Visa listvy med alla inlägg
    showListView() {
        this.searchInput.value = ''; // Rensa sökning
        const entriesArray = Object.entries(this.entries)
            .sort((a, b) => b[0].localeCompare(a[0])); // Senaste först

        if (entriesArray.length === 0) {
            this.noEntries.style.display = 'block';
            this.entriesList.innerHTML = '';
        } else {
            this.noEntries.style.display = 'none';
            this.renderEntriesList(entriesArray);
        }

        this.checkBackupReminder();

        this.writeView.classList.remove('active');
        this.listView.classList.add('active');
    }

    // Rendera listan med inlägg
    renderEntriesList(entriesArray) {
        this.entriesList.innerHTML = entriesArray.map(([date, text]) => {
            const displayDate = this.formatDisplayDate(date);
            const preview = text.length > 150 ? text.substring(0, 150) + '...' : text;

            return `
                <div class="entry-item" data-date="${date}">
                    <div class="entry-date">${displayDate}</div>
                    <div class="entry-preview">${this.escapeHtml(preview)}</div>
                </div>
            `;
        }).join('');

        // Lägg till click-lyssnare på alla inlägg - öppna i läsläge
        this.entriesList.querySelectorAll('.entry-item').forEach(item => {
            item.addEventListener('click', () => {
                const date = item.dataset.date;
                this.showReadView(date);
            });
        });
    }

    // Formatera datum för visning
    formatDisplayDate(dateString) {
        const date = new Date(dateString + 'T12:00:00');
        const today = this.getTodayString();

        if (dateString === today) {
            return 'Idag';
        }

        const options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
        return date.toLocaleDateString('sv-SE', options);
    }

    // Visa skrivvy
    showWriteView() {
        this.listView.classList.remove('active');
        this.readView.classList.remove('active');
        this.writeView.classList.add('active');
        this.loadEntry(this.currentDate);
        this.updateDateDisplay();
        this.entryText.focus();
    }

    // Visa läsvy för ett inlägg
    showReadView(date) {
        this.currentDate = date;
        const entry = this.entries[date];

        if (!entry) {
            // Om inget inlägg finns, gå till skrivvy istället
            this.showWriteView();
            return;
        }

        this.readDate.textContent = this.formatDisplayDate(date);
        this.readContent.textContent = entry;

        this.writeView.classList.remove('active');
        this.listView.classList.remove('active');
        this.readView.classList.add('active');
    }

    // Dela backup via Web Share API
    async shareBackup() {
        const entriesArray = Object.entries(this.entries)
            .sort((a, b) => a[0].localeCompare(b[0])); // Äldsta först för backup

        if (entriesArray.length === 0) {
            alert('Inga inlägg att säkerhetskopiera ännu!');
            return;
        }

        // Formatera som läsbar text
        const backupText = this.formatBackupText(entriesArray);

        // Skapa en blob (fil)
        const blob = new Blob([backupText], { type: 'text/plain;charset=utf-8' });
        const file = new File([blob], `dagbok-backup-${this.getTodayString()}.txt`, {
            type: 'text/plain'
        });

        // Kolla om Web Share API finns (mobil)
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
                await navigator.share({
                    title: 'Min Dagbok - Backup',
                    text: 'Säkerhetskopia av min dagbok',
                    files: [file]
                });
            } catch (err) {
                // Användaren avbröt delningen eller något gick fel
                if (err.name !== 'AbortError') {
                    console.error('Delning misslyckades:', err);
                    this.fallbackDownload(backupText);
                }
            }
        } else {
            // Fallback: Ladda ner filen direkt
            this.fallbackDownload(backupText);
        }
    }

    // Formatera backup som text
    formatBackupText(entriesArray) {
        let text = '='.repeat(50) + '\n';
        text += 'MIN DAGBOK - SÄKERHETSKOPIA\n';
        text += `Skapad: ${new Date().toLocaleString('sv-SE')}\n`;
        text += `Antal inlägg: ${entriesArray.length}\n`;
        text += '='.repeat(50) + '\n\n';

        entriesArray.forEach(([date, entry]) => {
            const displayDate = this.formatDisplayDate(date);
            text += `${displayDate} (${date})\n`;
            text += '-'.repeat(50) + '\n';
            text += entry + '\n\n';
        });

        return text;
    }

    // Fallback: Ladda ner fil
    fallbackDownload(text) {
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dagbok-backup-${this.getTodayString()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Escape HTML för säkerhet
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Visa kalendervy
    showCalendarView() {
        this.calendarDate = new Date(); // Återställ till aktuell månad
        this.renderCalendar();

        this.writeView.classList.remove('active');
        this.listView.classList.remove('active');
        this.readView.classList.remove('active');
        this.calendarView.classList.add('active');
    }

    // Ändra månad i kalendern
    changeMonth(offset) {
        this.calendarDate.setMonth(this.calendarDate.getMonth() + offset);
        this.renderCalendar();
    }

    // Rendera kalendern
    renderCalendar() {
        const year = this.calendarDate.getFullYear();
        const month = this.calendarDate.getMonth();

        // Uppdatera månad/år-rubrik
        const monthNames = ['januari', 'februari', 'mars', 'april', 'maj', 'juni',
                           'juli', 'augusti', 'september', 'oktober', 'november', 'december'];
        this.calendarMonthYear.textContent = `${monthNames[month]} ${year}`;

        // Första dagen i månaden
        const firstDay = new Date(year, month, 1);
        // Sista dagen i månaden
        const lastDay = new Date(year, month + 1, 0);

        // Veckodag för första dagen (0 = söndag, men vi vill ha måndag = 0)
        let firstWeekday = firstDay.getDay() - 1;
        if (firstWeekday === -1) firstWeekday = 6; // Söndag blir 6

        // Dagar i månaden
        const daysInMonth = lastDay.getDate();

        // Dagens datum för att markera
        const today = this.getTodayString();

        // Bygg kalendern
        let html = '';

        // Tomma rutor före första dagen
        for (let i = 0; i < firstWeekday; i++) {
            const prevMonthDate = new Date(year, month, -(firstWeekday - i - 1));
            const dateStr = this.formatDate(prevMonthDate);
            html += `<div class="calendar-day other-month" data-date="${dateStr}">${prevMonthDate.getDate()}</div>`;
        }

        // Dagar i aktuell månad
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateStr = this.formatDate(date);
            const hasEntry = this.entries[dateStr] ? 'has-entry' : '';
            const isToday = dateStr === today ? 'today' : '';

            html += `<div class="calendar-day ${hasEntry} ${isToday}" data-date="${dateStr}">${day}</div>`;
        }

        // Fyll upp med nästa månads dagar om det behövs
        const totalCells = firstWeekday + daysInMonth;
        const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);

        for (let i = 1; i <= remainingCells; i++) {
            const nextMonthDate = new Date(year, month + 1, i);
            const dateStr = this.formatDate(nextMonthDate);
            html += `<div class="calendar-day other-month" data-date="${dateStr}">${i}</div>`;
        }

        this.calendarDays.innerHTML = html;

        // Lägg till click-lyssnare på alla dagar
        this.calendarDays.querySelectorAll('.calendar-day').forEach(day => {
            day.addEventListener('click', () => {
                const date = day.dataset.date;
                this.currentDate = date;

                // Kolla om det finns ett inlägg
                if (this.entries[date]) {
                    this.showReadView(date);
                } else {
                    this.showWriteView();
                }
            });
        });
    }

    // Filtrera inlägg baserat på sökterm
    filterEntries(searchTerm) {
        const term = searchTerm.toLowerCase().trim();

        if (!term) {
            // Visa alla om sökningen är tom
            const entriesArray = Object.entries(this.entries)
                .sort((a, b) => b[0].localeCompare(a[0]));
            this.renderEntriesList(entriesArray);
            return;
        }

        // Filtrera inlägg som matchar söktermen
        const filtered = Object.entries(this.entries)
            .filter(([date, text]) => {
                return text.toLowerCase().includes(term) ||
                       this.formatDisplayDate(date).toLowerCase().includes(term);
            })
            .sort((a, b) => b[0].localeCompare(a[0]));

        if (filtered.length === 0) {
            this.entriesList.innerHTML = '<div class="no-entries">Inga inlägg hittades</div>';
        } else {
            this.renderEntriesList(filtered);
        }
    }

    // Kolla om backup-påminnelse ska visas
    checkBackupReminder() {
        const lastBackup = localStorage.getItem('lastBackupReminder');
        const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

        if (lastBackup !== currentMonth) {
            this.backupReminder.style.display = 'block';
        }
    }

    // Stäng backup-påminnelse
    dismissBackupReminder() {
        const currentMonth = new Date().toISOString().slice(0, 7);
        localStorage.setItem('lastBackupReminder', currentMonth);
        this.backupReminder.style.display = 'none';
    }

    // Ladda sparat tema
    loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme);
    }

    // Växla tema
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        this.updateThemeIcon(newTheme);
    }

    // Uppdatera tema-ikon
    updateThemeIcon(theme) {
        this.themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
    }
}

// Starta appen när sidan är laddad
document.addEventListener('DOMContentLoaded', () => {
    new DiaryApp();
});
