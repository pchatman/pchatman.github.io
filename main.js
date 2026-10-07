// Intersection-based fade-in for sections below the fold
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.about, .project-item, .contact-inner').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
  observer.observe(el);
});

// Smooth active nav link highlight based on scroll position
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const linkObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => {
        a.style.color = a.getAttribute('href') === '#' + entry.target.id
          ? 'var(--text)'
          : '';
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => linkObserver.observe(s));

// ── Contact form (Web3Forms) ──
document.addEventListener('securitypolicyviolation', (e) => {
  console.error('CSP blocked a request — blocked URI:', e.blockedURI, '| violated directive:', e.violatedDirective)
})

  ; (function () {
    const form = document.getElementById('contact-form')
    const status = document.getElementById('cf-status')
    const submitBtn = document.getElementById('cf-submit')
    if (!form || !status || !submitBtn) return

    function setStatus(message, state) {
      status.textContent = message
      status.dataset.state = state || ''
    }

    form.addEventListener('submit', async function (event) {
      event.preventDefault()

      // Honeypot field to prevent spam submissions
      const honeypot = form.querySelector('[name="botcheck"]')
      if (honeypot && honeypot.value.trim() !== '') {
        return
      }

      const accessKey = form.querySelector('[name="access_key"]').value
      if (!accessKey || accessKey === 'YOUR_WEB3FORMS_ACCESS_KEY') {
        setStatus('Contact form is not fully set up yet — the site owner still needs to add a Web3Forms access key.', 'error')
        return
      }

      submitBtn.disabled = true
      setStatus('Sending…')

      try {
        const formData = new FormData(form)
        const response = await fetch(form.action, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: formData,
        })

        // Attempt to parse the response as JSON
        let result
        try {
          result = await response.json()
        } catch (parseErr) {
          console.error('Contact form: response was not valid JSON (HTTP', response.status + ')', parseErr)
          setStatus('Something went wrong sending that. Please try again in a moment.', 'error')
          return
        }

        if (response.ok && result.success) {
          setStatus("Thanks — I will get back to you soon.", 'success')
          form.reset()
        } else {
          console.error('Contact form: submission rejected (HTTP', response.status + ')', result)
          setStatus('Something went wrong sending that. Please try again in a moment.', 'error')
        }
      } catch (err) {
        // Handle network errors or other fetch failures
        console.error('Contact form: fetch failed —', err)
        setStatus('Network error — please check your connection and try again.', 'error')
      } finally {
        submitBtn.disabled = false
      }
    })
  })()
