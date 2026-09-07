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

/**This is a simple obfuscation technique to prevent email harvesting by bots. 
The email address is constructed in the JavaScript code and 
set as the href of the link when the page loads, making it less likely to be 
scraped from the HTML source.*/
(function () {
  const user = "pchatman.dev";
  const domain = "outlook.com";
  const link = document.getElementById("email-link");
  if (link) {
    link.setAttribute("href", "mailto:" + user + "@" + domain);
  }
})();