/**
 * RevealManager - Handles global private project visibility, key validation, 
 * expiration, and the reveal modal UI.
 */
class RevealManager {
    constructor() {
        this.storageKey = 'alhadad_global_reveal';
        this.initModal();
    }

    /**
     * Initialize the reveal modal in the DOM if it doesn't exist.
     */
    initModal() {
        if (document.getElementById('reveal-modal')) return;

        const modalHtml = `
            <div id="reveal-modal" class="reveal-modal">
                <div class="reveal-modal-content">
                    <div class="reveal-modal-close">&times;</div>
                    <h3>Unlock Projects</h3>
                    <p>Enter the reveal key to view all private and confidential projects.</p>
                    <div class="reveal-input-group">
                        <input type="text" id="reveal-input" class="reveal-input" placeholder="Enter global key..." autocomplete="off">
                        <div id="reveal-error" class="reveal-error">Invalid or expired key.</div>
                    </div>
                    <button id="reveal-submit" class="reveal-submit-btn">Unlock All Content</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        const modal = document.getElementById('reveal-modal');
        const closeBtn = modal.querySelector('.reveal-modal-close');
        const submitBtn = document.getElementById('reveal-submit');
        const input = document.getElementById('reveal-input');

        closeBtn.onclick = () => this.hideModal();
        modal.onclick = (e) => {
            if (e.target === modal) this.hideModal();
        };

        submitBtn.onclick = () => this.handleSubmit();
        input.onkeypress = (e) => {
            if (e.key === 'Enter') this.handleSubmit();
        };
    }

    /**
     * Check if projects are globally revealed.
     */
    isRevealed() {
        return localStorage.getItem(this.storageKey) === 'true';
    }

    /**
     * Mark projects as globally revealed.
     */
    persistReveal() {
        localStorage.setItem(this.storageKey, 'true');
    }

    /**
     * Validate a key against site settings and expiration.
     */
    validateKey(settings, inputKey) {
        if (!settings || !settings.globalRevealKey) return false;
        
        const masterKey = settings.globalRevealKey.current || settings.globalRevealKey;
        const isMatch = masterKey === inputKey;
        if (!isMatch) return false;

        if (settings.globalRevealExpires) {
            const expiry = new Date(settings.globalRevealExpires);
            if (new Date() > expiry) {
                console.warn('Global reveal key has expired');
                return false;
            }
        }

        return true;
    }

    /**
     * Show the reveal modal.
     */
    showModal(settings, onUnlock) {
        this.currentSettings = settings;
        this.onUnlockCallback = onUnlock;
        
        const modal = document.getElementById('reveal-modal');
        const input = document.getElementById('reveal-input');
        const error = document.getElementById('reveal-error');
        
        input.value = '';
        error.style.display = 'none';
        modal.classList.add('active');
        input.focus();
    }

    hideModal() {
        const modal = document.getElementById('reveal-modal');
        modal.classList.remove('active');
        this.currentSettings = null;
        this.onUnlockCallback = null;
    }

    handleSubmit() {
        const input = document.getElementById('reveal-input');
        const error = document.getElementById('reveal-error');
        const key = input.value.trim();

        if (this.validateKey(this.currentSettings, key)) {
            this.persistReveal();
            if (this.onUnlockCallback) this.onUnlockCallback();
            this.hideModal();
        } else {
            error.style.display = 'block';
            input.classList.add('shake');
            setTimeout(() => input.classList.remove('shake'), 500);
        }
    }

    /**
     * Helper to create a Reveal button element.
     */
    createRevealButton(settings, onUnlock) {
        const btn = document.createElement('button');
        btn.className = 'reveal-btn';
        btn.textContent = 'Reveal Projects';
        btn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.showModal(settings, onUnlock);
        };
        return btn;
    }
}

export const revealManager = new RevealManager();
