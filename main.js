// HCAA Landing Page Logic

// Modal Logic
function openModal(serviceId) {
    const overlay = document.getElementById('modal-overlay');
    const contentTemplate = document.getElementById(`modal-content-${serviceId}`);

    if (contentTemplate) {
        // Clone the content to avoid moving it from its template location
        // Actually, since they are hidden divs, we can just grab innerHTML
        const contentHtml = contentTemplate.innerHTML;

        overlay.innerHTML = `
            <div class="modal-content" onclick="event.stopPropagation()">
                <button class="modal-close" onclick="closeModal()"><i data-lucide="x"></i></button>
                ${contentHtml}
            </div>
        `;

        // Re-initialize icons inside the modal if Lucide is available
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        }

        overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
}

function closeModal() {
    const overlay = document.getElementById('modal-overlay');
    overlay.classList.remove('active');
    document.body.style.overflow = '';

    // Optional: clear content after animation
    setTimeout(() => {
        overlay.innerHTML = '';
    }, 300);
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Icons
    lucide.createIcons();

    // Mobile Menu Toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('mobile-active');
        });
    }

    // Language Preference Persistence
    const langLinks = document.querySelectorAll('.lang-switch a');
    langLinks.forEach(link => {
        link.addEventListener('click', () => {
            const lang = link.textContent.trim().toLowerCase();
            if (lang === 'en' || lang === 'es') {
                localStorage.setItem('language_pref', lang);
            }
        });
    });

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
