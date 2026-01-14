// HCAA Landing Page Logic

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Icons
    lucide.createIcons();

    // Set Date (Local YYYY-MM-DD)
    const dateField = document.getElementById('fecha');
    const setDate = () => {
        if (dateField) {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            dateField.value = `${year}-${month}-${day}`;
        }
    };
    setDate();

    // Scroll Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

    // Form Handling
    const form = document.getElementById('contactForm');
    const statusMsg = document.getElementById('formStatus');
    const submitBtn = form.querySelector('button[type="submit"]');
    const btnText = document.getElementById('btnText');

    // CONFIG - In a real build, use ENV vars.
    // Placeholder URL - User needs to provide the real one or we use the history one.
    // History ID: 287c82ec-37d2-41e8-833e-17f08785bf6c had a webhook.
    // The previously used one: https://n8n.hcaa-ia.cloud/webhook-test/99267fac-2f0a-4908-9c2d-ab6cb26ce60e
    // BUT user said "Un webhook en n8n... una vez que el usuario le de en el botón".
    // I will use a placeholder const that is easy to swap.
    const WEBHOOK_URL = 'https://n8n.hcaa-ia.cloud/webhook-test/99267fac-2f0a-4908-9c2d-ab6cb26ce60e';

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Loading State
        submitBtn.disabled = true;
        btnText.textContent = 'Enviando...';
        statusMsg.textContent = '';
        statusMsg.className = 'form-status';

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                statusMsg.textContent = '¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.';
                statusMsg.classList.add('success');
                form.reset();
                // Reset date
                if (dateField) {
                    const now = new Date();
                    dateField.value = now.toISOString().split('T')[0];
                }
            } else {
                throw new Error('Error en el servidor');
            }
        } catch (error) {
            console.error('Error:', error);
            statusMsg.textContent = 'Hubo un error al enviar el formulario. Por favor intente más tarde.';
            statusMsg.classList.add('error');
        } finally {
            submitBtn.disabled = false;
            btnText.textContent = 'Enviar Solicitud';
        }
    });
});
