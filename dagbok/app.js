// Dagboksapp - MVP Del 1a
// Funktionalitet: Skriva för valfritt datum med auto-save

class DiaryApp {
    constructor() {
        this.currentDate = this.getTodayString();
        this.entries = this.loadEntries();
        this.saveTimeout = null;

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
        this.writeView = document.getElementById('writeView');
        this.listView = document.getElementById('listView');
        this.entriesList = document.getElementById('entriesList');
        this.noEntries = document.getElementById('noEntries');
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
        const entriesArray = Object.entries(this.entries)
            .sort((a, b) => b[0].localeCompare(a[0])); // Senaste först

        if (entriesArray.length === 0) {
            this.noEntries.style.display = 'block';
            this.entriesList.innerHTML = '';
        } else {
            this.noEntries.style.display = 'none';
            this.renderEntriesList(entriesArray);
        }

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

        // Lägg till click-lyssnare på alla inlägg
        this.entriesList.querySelectorAll('.entry-item').forEach(item => {
            item.addEventListener('click', () => {
                const date = item.dataset.date;
                this.currentDate = date;
                this.loadEntry(date);
                this.updateDateDisplay();
                this.showWriteView();
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
        this.writeView.classList.add('active');
        this.entryText.focus();
    }

    // Escape HTML för säkerhet
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Starta appen när sidan är laddad
document.addEventListener('DOMContentLoaded', () => {
    new DiaryApp();
});
