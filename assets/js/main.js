// Tyr Framework — site interactions
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Mobile nav toggle ---------- */
  const toggle = document.querySelector('.nav__toggle');
  const links = document.querySelector('.nav__links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      links.style.display = open ? 'flex' : '';
    });
    links.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => {
        links.classList.remove('is-open');
        links.style.display = '';
      })
    );
  }

  /* ---------- Copy-to-clipboard for code blocks ---------- */
  document.querySelectorAll('.code__copy').forEach((btn) => {
    btn.addEventListener('click', () => {
      const block = btn.closest('.code');
      const codeEl = block?.querySelector('pre code');
      if (!codeEl) return;
      const text = codeEl.innerText;
      navigator.clipboard.writeText(text).then(() => {
        const original = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(() => (btn.textContent = original), 1600);
      });
    });
  });

  /* ---------- Example tabs ---------- */
  const exampleTabs = document.querySelectorAll('.example-tab');
  exampleTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-target');
      document.querySelectorAll('.example-tab').forEach((t) => t.classList.remove('is-active'));
      document.querySelectorAll('.example-panel').forEach((p) => p.classList.remove('is-active'));
      tab.classList.add('is-active');
      document.getElementById(target)?.classList.add('is-active');
    });
  });

  /* ---------- Module category filter ---------- */
  const moduleTabs = document.querySelectorAll('.tab[data-filter]');
  const moduleCards = document.querySelectorAll('.module-card');
  moduleTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const filter = tab.getAttribute('data-filter');
      moduleTabs.forEach((t) => t.classList.remove('is-active'));
      tab.classList.add('is-active');
      moduleCards.forEach((card) => {
        const cats = (card.getAttribute('data-cat') || '').split(' ');
        card.style.display = filter === 'all' || cats.includes(filter) ? '' : 'none';
      });
    });
  });

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav__links a[href^="#"]');
  if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
    const navIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navLinks.forEach((l) => l.classList.remove('is-current'));
            const link = document.querySelector(`.nav__links a[href="#${entry.target.id}"]`);
            link?.classList.add('is-current');
          }
        });
      },
      { rootMargin: '-40% 0px -50% 0px' }
    );
    sections.forEach((s) => navIo.observe(s));
  }

  /* ---------- Current year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
