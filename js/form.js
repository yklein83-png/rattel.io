// Email form handling with Web3Forms + Anti-bot protection
(function() {
    'use strict';

    // Anti-bot: Track page load time
    const pageLoadTime = Date.now();
    const MIN_SUBMIT_TIME = 3000; // Minimum 3 seconds before submit allowed

    // Rate limiting
    const RATE_LIMIT_KEY = 'rattel_form_submissions';
    const MAX_SUBMISSIONS_PER_HOUR = 3;

    function isRateLimited() {
        const submissions = JSON.parse(localStorage.getItem(RATE_LIMIT_KEY) || '[]');
        const oneHourAgo = Date.now() - (60 * 60 * 1000);
        const recentSubmissions = submissions.filter(time => time > oneHourAgo);
        localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(recentSubmissions));
        return recentSubmissions.length >= MAX_SUBMISSIONS_PER_HOUR;
    }

    function recordSubmission() {
        const submissions = JSON.parse(localStorage.getItem(RATE_LIMIT_KEY) || '[]');
        submissions.push(Date.now());
        localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(submissions));
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email) && email.length < 100;
    }

    document.getElementById('emailForm').addEventListener('submit', async function(e) {
        e.preventDefault();

        const emailInput = document.getElementById('emailInput');
        const submitBtn = this.querySelector('.submit-btn');
        const formMessage = document.getElementById('formMessage');
        const formData = new FormData(this);
        const email = formData.get('email');

        // Anti-bot check 0: Cloudflare Turnstile
        const turnstileResponse = formData.get('cf-turnstile-response');
        if (!turnstileResponse) {
            formMessage.textContent = 'Veuillez completer la verification anti-robot.';
            formMessage.style.color = '#E94560';
            return;
        }

        // Anti-bot check 1: Honeypot
        if (formData.get('botcheck')) {
            console.log('Bot detected: honeypot');
            formMessage.textContent = 'Merci ! Vous serez notifie du lancement.';
            formMessage.style.color = '#4CAF50';
            return;
        }

        // Anti-bot check 2: Time-based (too fast = bot)
        if (Date.now() - pageLoadTime < MIN_SUBMIT_TIME) {
            console.log('Bot detected: too fast');
            formMessage.textContent = 'Merci ! Vous serez notifie du lancement.';
            formMessage.style.color = '#4CAF50';
            return;
        }

        // Anti-bot check 3: Rate limiting
        if (isRateLimited()) {
            formMessage.textContent = 'Trop de tentatives. Reessayez dans 1 heure.';
            formMessage.style.color = '#E94560';
            return;
        }

        // Validate email format
        if (!isValidEmail(email)) {
            formMessage.textContent = 'Veuillez entrer une adresse email valide.';
            formMessage.style.color = '#E94560';
            return;
        }

        // Block common disposable email domains
        const disposableDomains = ['tempmail', 'throwaway', 'guerrilla', 'mailinator', '10minute', 'temp-mail', 'fakeinbox'];
        const emailDomain = email.split('@')[1].toLowerCase();
        if (disposableDomains.some(d => emailDomain.includes(d))) {
            formMessage.textContent = 'Les emails temporaires ne sont pas acceptes.';
            formMessage.style.color = '#E94560';
            return;
        }

        // Disable button and show loading
        submitBtn.disabled = true;
        submitBtn.textContent = 'Envoi en cours...';
        formMessage.textContent = '';

        try {
            // Send to Web3Forms
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                // Record submission for rate limiting
                recordSubmission();

                // Success message
                formMessage.textContent = 'Merci ! Vous serez notifie du lancement.';
                formMessage.style.color = '#4CAF50';
                emailInput.value = '';

                // Also save to localStorage for backup
                let emails = JSON.parse(localStorage.getItem('rattelEmails') || '[]');
                if (!emails.includes(email)) {
                    emails.push(email);
                    localStorage.setItem('rattelEmails', JSON.stringify(emails));
                }
            } else {
                // Error message
                formMessage.textContent = 'Erreur lors de l\'inscription. Reessayez.';
                formMessage.style.color = '#E94560';
            }
        } catch (error) {
            // Network error
            formMessage.textContent = 'Erreur de connexion. Verifiez votre internet.';
            formMessage.style.color = '#E94560';
        }

        // Reset button
        submitBtn.disabled = false;
        submitBtn.textContent = 'Me prevenir du lancement';
    });
})();
