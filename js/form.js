// Email form handling with Web3Forms
document.getElementById('emailForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const emailInput = document.getElementById('emailInput');
    const submitBtn = this.querySelector('.submit-btn');
    const formMessage = document.getElementById('formMessage');
    const formData = new FormData(this);

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
            // Success message
            formMessage.textContent = 'Merci ! Vous serez notifie du lancement.';
            formMessage.style.color = '#4CAF50';
            emailInput.value = '';

            // Also save to localStorage for backup
            let emails = JSON.parse(localStorage.getItem('rattelEmails') || '[]');
            if (!emails.includes(formData.get('email'))) {
                emails.push(formData.get('email'));
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
