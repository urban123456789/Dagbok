# 📔 Dagbok

En enkel, sober och funktionell dagboksapp för dagliga anteckningar.

## ✨ Funktioner

### Grundfunktioner
- ✍️ Skriva dagboksinlägg för vilket datum som helst
- 💾 Automatisk sparning lokalt i telefonen
- 📖 Läs gamla inlägg i säkert läsläge
- ✏️ Redigera inlägg (medveten knapp, inga oavsiktliga ändringar)

### Navigation
- 📅 Kalendervy med månadssikt
- ⚫ Dagar med inlägg markerade (svart bakgrund)
- 👆 Klicka på dag för att läsa eller skriva
- ⬅️ ➡️ Navigera mellan månader och dagar

### Användarvänlighet
- 🔍 **Sökfunktion** - Hitta gamla inlägg snabbt
- 📤 **Dela backup** - Via telefonens dela-funktion
- 🗓️ **Månadsvis påminnelse** - Kom ihåg att säkerhetskopiera
- 📲 **Installera som app** - Lägg till på hemskärmen
- ⚡ **Fungerar offline** - Efter första besöket

### Design
- Sober, professionell och avskalad design
- Ingen bling-bling eller emojis
- Stora knappar för telefon
- 19px text i inlägg (lätt att läsa)
- Mobil-optimerad

## 📱 Installation

### På iPhone

1. Öppna appen i Safari
2. Tryck på **delningsikonen** (ruta med pil uppåt)
3. Scrolla ner och välj **"Lägg till på hemskärmen"**
4. Tryck **"Lägg till"**
5. Appen finns nu på hemskärmen som en vanlig app!

### På Android

1. Öppna appen i Chrome
2. Tryck på **menyn** (tre prickar)
3. Välj **"Lägg till på startskärmen"**
4. Tryck **"Lägg till"**
5. Appen finns nu på startskärmen!

## 🚀 Användning

### Skriva ett inlägg

1. Öppna appen → du ser dagens datum
2. Skriv några rader i textfältet
3. Auto-sparar efter 0.5 sekunder
4. "Sparat" visas när det är klart

### Skriva för ett annat datum

**Metod 1 - Datumväljare:**
1. Klicka på datumfältet mitt på skärmen
2. Välj datum
3. Skriv

**Metod 2 - Föregående/nästa dag:**
1. Använd **←** / **→** knapparna
2. Skriv

**Metod 3 - Kalender:**
1. Tryck **"Visa kalender"**
2. Klicka på en dag
3. Skriv (om tomt) eller läs (om inlägg finns)

### Läsa gamla inlägg

**Via lista:**
1. Tryck **"Visa alla inlägg"**
2. Bläddra i listan (senaste först)
3. Klicka på ett inlägg för att läsa det

**Via kalender:**
1. Tryck **"Visa kalender"**
2. Dagar med inlägg har svart bakgrund
3. Klicka för att läsa

**Via sökning:**
1. Tryck **"Visa alla inlägg"**
2. Skriv i sökfältet
3. Resultat filtreras i realtid

### Redigera ett inlägg

1. Öppna inlägget (via lista eller kalender)
2. Tryck **"Redigera"**
3. Ändra texten
4. Auto-sparar automatiskt

### Säkerhetskopiera

**Manuellt:**
1. Tryck **"Visa alla inlägg"**
2. Tryck **"Säkerhetskopiera"**
3. Välj vart du vill dela (Gmail, Drive, etc.)

**Via påminnelse:**
- Första dagen varje månad visas en gul påminnelse
- Tryck **"Dela backup nu"** för att säkerhetskopiera direkt
- Tryck **×** för att stänga (kommer tillbaka nästa månad)

## 💾 Var sparas datan?

- **Lokalt i telefonen** (localStorage)
- Ingen server, ingen cloud
- Data lämnar **aldrig** telefonen (förutom när du själv delar backup)
- **Privacy först!**

### Fördelar
- ✅ Snabbt
- ✅ Fungerar offline
- ✅ Ingen kostnad
- ✅ Privacy - bara du har tillgång

### Nackdelar
- ⚠️ Om telefonen går sönder → data borta
- ⚠️ Synkar inte mellan enheter

**Lösning:** Säkerhetskopiera regelbundet via dela-funktionen!

## 🛠️ Teknisk information

### Byggd med
- Vanilla JavaScript (ingen ramverk)
- HTML5 + CSS3
- Web Share API
- Progressive Web App (PWA)
- Service Worker (offline)
- localStorage

### Filstruktur
```
dagbok/
├── index.html          # Huvudfil
├── style.css           # Design
├── app.js              # Funktionalitet
├── manifest.json       # PWA-manifest
└── service-worker.js   # Offline-support
```

### Browser-support
- ✅ iPhone Safari (iOS 11.3+)
- ✅ Android Chrome (63+)
- ✅ Android Firefox
- ✅ Desktop (fungerar men optimerad för mobil)

## 📋 Vanliga frågor

**Q: Kan jag använda på både telefon och dator?**
A: Tekniskt ja, men data synkar inte mellan enheter. Bäst att välja en enhet.

**Q: Vad händer om jag rensar cache/historik?**
A: Data i localStorage påverkas normalt inte, men säkerhetskopiera ändå regelbundet!

**Q: Kan jag ändra textstorlek?**
A: Just nu nej, men det går att lägga till om det behövs.

**Q: Kan andra se mina inlägg?**
A: Nej! Allt sparas lokalt i din telefon. Ingen server, ingen cloud.

**Q: Fungerar det utan internet?**
A: Ja! Efter första besöket fungerar det helt offline.

## 🔒 Säkerhet & Privacy

- ✅ All data lokalt i telefonen
- ✅ Ingen server
- ✅ Ingen tracking
- ✅ Ingen annonsering
- ✅ Open source (kan granska koden)
- ✅ Inga cookies
- ✅ Inga externa script

## 🤝 Support

Skapat för enkel dagboksskrivning.

**Problem eller frågor?**
Kontakta: [din kontaktinfo]

## 📄 Licens

Fri att använda för personligt bruk.

---

**Skapad med ❤️ för enkel och sober dagboksskrivning**
