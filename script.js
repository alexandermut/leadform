document.addEventListener('DOMContentLoaded', () => {
    
    // --- DOM Elements ---
    const liveDateTimeEl = document.getElementById('liveDateTime');
    const statusMessage = document.getElementById('statusMessage');
    
    const salesEmailInput = document.getElementById('salesEmail');
    const assistantEmailInput = document.getElementById('assistantEmail');
    
    const btnSend = document.getElementById('btnSend');
    const btnPartialClear = document.getElementById('btnPartialClear');
    const btnFullClear = document.getElementById('btnFullClear');
    
    const toggles = document.querySelectorAll('.partial-clear-toggle');

    // Photo Elements
    const photoInput = document.getElementById('photoInput');
    const photoContainer = document.getElementById('photoContainer'); // New
    const photoPreviewOverlay = document.getElementById('photoPreviewOverlay'); // New name
    const photoPreviewImg = document.getElementById('photoPreviewImg');
    const btnRemovePhoto = document.getElementById('btnRemovePhoto');

    // --- 1. Initialization ---
    function init() {
        startClock();
        loadSettings();
        loadToggles();
        
        // Add Listeners
        salesEmailInput.addEventListener('change', saveSettings);
        assistantEmailInput.addEventListener('change', saveSettings);
        
        toggles.forEach(toggle => {
            toggle.addEventListener('change', saveToggles);
        });
        
        btnSend.addEventListener('click', handleSendLead);
        btnPartialClear.addEventListener('click', handlePartialClear);
        btnFullClear.addEventListener('click', handleFullClear);

        // Photo Listeners
        photoInput.addEventListener('change', handlePhotoSelect);
        btnRemovePhoto.addEventListener('click', clearPhoto);
    }

    // --- 2. Clock & Date Logic ---
    
    // Generates timestamp string for Email (technical format)
    function getFormattedTimestamp() {
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        const hh = String(now.getHours()).padStart(2, '0');
        const min = String(now.getMinutes()).padStart(2, '0');
        const sec = String(now.getSeconds()).padStart(2, '0');
        
        const days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
        const wochentag = days[now.getDay()];
        
        return `${yyyy}-${mm}-${dd}-${hh}-${min}-${sec} ${wochentag}`;
    }

    // Updates the header clock and date in one line
    function startClock() {
        function update() {
            const now = new Date();
            const dd = String(now.getDate()).padStart(2, '0');
            const mm = String(now.getMonth() + 1).padStart(2, '0');
            const yyyy = now.getFullYear();
            const timeStr = now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            
            liveDateTimeEl.textContent = `${dd}.${mm}.${yyyy} ${timeStr}`;
        }
        update();
        setInterval(update, 1000);
    }

    // --- 3. Storage Logic ---
    function loadSettings() {
        salesEmailInput.value = localStorage.getItem('salesEmail') || '';
        assistantEmailInput.value = localStorage.getItem('assistantEmail') || '';
    }

    function saveSettings() {
        localStorage.setItem('salesEmail', salesEmailInput.value.trim());
        localStorage.setItem('assistantEmail', assistantEmailInput.value.trim());
    }

    function loadToggles() {
        const stored = JSON.parse(localStorage.getItem('partialClearFlags') || '{}');
        toggles.forEach(toggle => {
            const id = toggle.id;
            if (stored[id] !== undefined) {
                toggle.checked = stored[id];
            } else {
                // Default behaviors if never saved:
                // Event & Settings (Emails) defaults to FALSE (safe)
                // Lead data defaults to TRUE (convenience)
                if (id === 'toggle-event' || id === 'toggle-salesEmail' || id === 'toggle-assistantEmail') {
                    toggle.checked = false;
                } else {
                    toggle.checked = true;
                }
            }
        });
    }

    function saveToggles() {
        const states = {};
        toggles.forEach(toggle => {
            states[toggle.id] = toggle.checked;
        });
        localStorage.setItem('partialClearFlags', JSON.stringify(states));
    }

    // --- 4. Photo Logic ---
    function handlePhotoSelect(e) {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(ev) {
                photoPreviewImg.src = ev.target.result;
                // Use class based toggle for nicer styling support
                photoPreviewOverlay.classList.remove('hidden');
                photoContainer.classList.add('has-image');
            }
            reader.readAsDataURL(file);
        } else {
            // Fallback if not an image or cancelled
            if(photoInput.files.length === 0) {
               // do nothing
            }
        }
    }

    function clearPhoto(e) {
        if(e) e.stopPropagation(); // Stop bubbling so we don't trigger upload again
        photoInput.value = '';
        photoPreviewImg.src = '';
        
        // Reset UI
        photoPreviewOverlay.classList.add('hidden');
        photoContainer.classList.remove('has-image');
    }

    // --- 5. Helper: Show Status ---
    function showStatus(msg, type) {
        statusMessage.textContent = msg;
        statusMessage.className = `status-message ${type}`;
        statusMessage.style.display = 'block';
        
        setTimeout(() => {
            statusMessage.style.display = 'none';
        }, 8000);
    }

    // --- 6. Send Lead Logic ---
    function handleSendLead() {
        // Validation: Only internal emails required for functionality
        if (!salesEmailInput.value && !assistantEmailInput.value) {
            alert('Fehler: Bitte mindestens eine interne E-Mail-Adresse (Vertrieb oder Assistenz) angeben.');
            return;
        }

        // Capture timestamp at the moment of sending
        const currentTimestamp = getFormattedTimestamp();

        // Gather Data
        const data = {
            event: document.getElementById('event').value,
            firstname: document.getElementById('firstname').value,
            lastname: document.getElementById('lastname').value,
            company: document.getElementById('company').value,
            position: document.getElementById('position').value,
            street: document.getElementById('street').value,
            zip: document.getElementById('zip').value,
            city: document.getElementById('city').value,
            website: document.getElementById('website').value,
            email: document.getElementById('customerEmail').value,
            phone: document.getElementById('phone').value,
            amount: document.getElementById('amount').value,
            timeline: document.getElementById('timeline').value,
            message: document.getElementById('message').value,
            timestamp: currentTimestamp
        };

        const interestValue = document.getElementById('interests').value;
        const gdprChecked = document.getElementById('gdpr').checked;

        // Construct Email
        const recipients = [salesEmailInput.value, assistantEmailInput.value].filter(Boolean).join(',');
        const cc = data.email; 
        
        // Subject
        const subjectParts = [
            data.firstname, 
            data.lastname, 
            data.company, 
            data.amount, 
            data.event, 
            data.timestamp
        ].filter(Boolean).join(' | ');
        
        // Body
        let body = `LEAD ERFASSUNG - ${data.event || 'Kein Event'}%0D%0A`;
        body += `----------------------------------------%0D%0A`;
        body += `Datum: ${data.timestamp}%0D%0A%0D%0A`;
        
        body += `KONTAKT:%0D%0A`;
        body += `Name: ${data.firstname} ${data.lastname}%0D%0A`;
        body += `Firma: ${data.company}%0D%0A`;
        body += `Position: ${data.position || '-'}%0D%0A`;
        body += `Adresse: ${data.street || ''} ${data.zip || ''} ${data.city || ''}%0D%0A`;
        body += `Web: ${data.website || '-' }%0D%0A`;
        body += `E-Mail: ${data.email}%0D%0A`;
        body += `Tel: ${data.phone || '-'}%0D%0A%0D%0A`;
        
        body += `INTERESSE:%0D%0A`;
        body += (interestValue || 'Keine') + `%0D%0A%0D%0A`;
        
        body += `DETAILS:%0D%0A`;
        body += `Volumen: ${data.amount || '-'}%0D%0A`;
        body += `Zeitraum: ${data.timeline || '-'}%0D%0A%0D%0A`;
        
        body += `NACHRICHT:%0D%0A`;
        body += (data.message || '-').replace(/\n/g, '%0D%0A');
        
        body += `%0D%0A%0D%0A----------------------------------------%0D%0A`;
        body += `DSGVO Zustimmung: ${gdprChecked ? 'JA' : 'NEIN'}`;
        
        // Note: Cannot attach photo via mailto.

        // Open Mailto
        const safeBody = encodeURIComponent(decodeURIComponent(body));
        window.location.href = `mailto:${recipients}?cc=${cc}&subject=${encodeURIComponent(subjectParts)}&body=${safeBody}`;

        showStatus(`Lead vorbereitet! Versandzeit: ${data.timestamp}`, 'success');
    }

    // --- 7. Clear Logic ---
    
    function clearFieldIfToggled(wrapperId, toggleId) {
        const toggle = document.getElementById(toggleId);
        if (toggle && toggle.checked) {
            const el = document.getElementById(wrapperId);
            if (el) {
                el.value = '';
            }
            return true; // returns true if cleared
        }
        return false;
    }

    function handlePartialClear() {
        // Internal Settings
        const salesCleared = clearFieldIfToggled('salesEmail', 'toggle-salesEmail');
        const asstCleared = clearFieldIfToggled('assistantEmail', 'toggle-assistantEmail');
        
        if (salesCleared || asstCleared) {
            saveSettings(); // Update localStorage immediately
        }

        // Inputs
        clearFieldIfToggled('event', 'toggle-event');
        clearFieldIfToggled('firstname', 'toggle-firstname');
        clearFieldIfToggled('lastname', 'toggle-lastname');
        clearFieldIfToggled('company', 'toggle-company');
        clearFieldIfToggled('position', 'toggle-position');
        clearFieldIfToggled('street', 'toggle-street');
        clearFieldIfToggled('zip', 'toggle-zip');
        clearFieldIfToggled('city', 'toggle-city');
        clearFieldIfToggled('website', 'toggle-website');
        clearFieldIfToggled('customerEmail', 'toggle-customerEmail');
        clearFieldIfToggled('phone', 'toggle-phone');
        clearFieldIfToggled('amount', 'toggle-amount');
        clearFieldIfToggled('timeline', 'toggle-timeline');
        clearFieldIfToggled('message', 'toggle-message');

        // Photo (Partial)
        const photoToggle = document.getElementById('toggle-photo');
        if (photoToggle && photoToggle.checked) {
            clearPhoto(null);
        }

        // Interests Dropdown (Special Case to reset to default)
        const intToggle = document.getElementById('toggle-interests');
        if (intToggle && intToggle.checked) {
            document.getElementById('interests').value = 'Investition';
        }

        // GDPR
        const gdprToggle = document.getElementById('toggle-gdpr');
        if (gdprToggle && gdprToggle.checked) {
            document.getElementById('gdpr').checked = false;
        }

        showStatus('Formular teilweise bereinigt.', 'warning');
    }

    function handleFullClear() {
        // Note: Internal emails are NOT cleared here regardless of toggle, 
        // unless the user uses "Partial Clear". "Full Clear" is a hard reset for lead data only.
        if (!confirm('Wirklich ALLES löschen? (Interne E-Mails bleiben erhalten, außer sie wurden via "Alles ohne x" entfernt)')) {
            return;
        }

        // Clear inputs inside lead-card but PROTECT salesEmail and assistantEmail
        // Since they are now inside .lead-card, the selector matches them. We must exclude them explicitly.
        const inputs = document.querySelectorAll('.lead-card input, .lead-card textarea, .lead-card select');
        inputs.forEach(input => {
            // Do not clear toggles, checkboxes (unless logic requires), or specific email fields
            if (input.type === 'checkbox') return; 
            if (input.type === 'file') return; // Handled separately
            if (input.id === 'salesEmail' || input.id === 'assistantEmail') return;

            input.value = '';
        });

        // Clear Photo Always on Full Clear
        clearPhoto(null);

        // Reset Interest to default manually after generic clear
        document.getElementById('interests').value = 'Investition';

        // Clear all checkboxes except toggles
        const checkboxes = document.querySelectorAll('.lead-card input[type="checkbox"]:not(.partial-clear-toggle)');
        checkboxes.forEach(cb => cb.checked = false);

        showStatus('Formular geleert.', 'error');
    }

    init();
});