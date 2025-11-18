# 📝 Lead Erfassungs App (Leasing & Factoring)

Eine **Offline-First Web App** zur schnellen Erfassung von Messe-Leads, optimiert für Mobilgeräte und dunkle Umgebungen. Die App generiert vollautomatisch vorformatierte E-Mails an den Vertrieb und den Kunden, inklusive Visitenkarten-Foto-Integration.

---

## ✨ Features

*   **100% Offline-fähig:** Funktioniert ohne Internetverbindung (nach dem ersten Laden).
*   **Datenschutz:** Keine Cookies, kein Server-Tracking. Daten bleiben auf dem Gerät.
*   **Dark Mode:** Batteriesparend und augenschonend in Messehallen.
*   **Smart Workflow:**
    *   Automatische E-Mail an Vertrieb & Assistenz.
    *   Kunde automatisch in CC (abschaltbar).
    *   Visitenkarten-Scan (Kamera) -> **Auto-Copy in Zwischenablage**.
    *   Währungsformatierung (10.000,00 €).
*   **Intelligentes Löschen:**
    *   *Markierte Felder leeren:* Löscht nur selektive Daten (konfigurierbar via Toggle).
    *   *Alles leeren:* Reset für den nächsten Kunden.

---

## 📱 Installation & Nutzung

### 1. Starten
Da es sich um eine reine Web-App handelt, einfach die `index.html` im Browser öffnen oder auf einem Webserver hosten.

**Tipp für iOS/Android:**
Öffne die Seite im Browser (Safari/Chrome), tippe auf "Teilen" und wähle **"Zum Home-Bildschirm"**. Die App wirkt dann wie eine native App (Vollbild, kein Browser-Rahmen).

### 2. Konfiguration (Einmalig)
1.  Scrolle im Formular nach ganz unten.
2.  Gib deine **Vertrieb E-Mail** und **Assistenz E-Mail** ein.
3.  Diese Adressen werden dauerhaft im Browser gespeichert.

### 3. Lead Erfassen
1.  **Foto machen:** Tippe auf das Kamera-Icon, um die Visitenkarte zu fotografieren.
2.  **Daten ergänzen:** Tippe die wichtigsten Daten ab (Vorname, Nachname, E-Mail).
3.  **Interessen wählen:** Dropdown (Investition, Factoring, etc.) und Betrag eingeben.

### 4. Absenden
1.  Tippe auf **"DATEN ABSENDEN"**.
2.  **WICHTIG:** Es erscheint ein Hinweis **"Foto kopiert!"**.
3.  Das E-Mail-Programm öffnet sich automatisch.
4.  Tippe im E-Mail-Text an die Stelle `>>> FOTO HIER EINFÜGEN <<<`.
5.  Wähle **"Einfügen"**, um das Bild der Visitenkarte einzufügen.
6.  Senden!

### 5. Nächster Lead
*   Nutze **"Markierte Felder leeren"**, wenn du z.B. das Event behalten willst, aber den Namen löschen möchtest (konfigurierbar über die kleinen Schalter neben den Feldern).
*   Nutze **"Alles leeren"**, um komplett neu zu starten.

---

## 🛠 Technische Details

*   **Stack:** Vanilla HTML5, CSS3, JavaScript (ES6).
*   **Storage:** `localStorage` für Einstellungen (E-Mails, Toggles).
*   **Design:** CSS Variables, Flexbox, Glassmorphismus, Responsive Layout.
*   **Kompatibilität:** iOS (Safari), Android (Chrome), Desktop.

---

## ⚖️ Rechtliches

*   **Impressum & Datenschutz:** Links befinden sich am unteren Rand der App.
*   **Haftung:** Die App speichert keine Daten auf einem Server. Der Nutzer ist für den Versand der E-Mails über seinen eigenen E-Mail-Client verantwortlich.
