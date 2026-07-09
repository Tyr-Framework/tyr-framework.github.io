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
  function wireCopyButton(btn, getText) {
    btn.addEventListener('click', () => {
      const text = getText();
      if (!text) return;
      navigator.clipboard.writeText(text).then(() => {
        const original = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(() => (btn.textContent = original), 1600);
      });
    });
  }

  document.querySelectorAll('.code__copy').forEach((btn) => {
    wireCopyButton(btn, () => {
      const block = btn.closest('.code');
      const codeEl = block?.querySelector('pre code');
      return codeEl?.innerText;
    });
  });

  /* ---------- Example tabs ---------- */
  document.querySelectorAll('.example-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-target');
      document.querySelectorAll('.example-tab').forEach((t) => t.classList.remove('is-active'));
      document.querySelectorAll('.example-panel').forEach((p) => p.classList.remove('is-active'));
      tab.classList.add('is-active');
      document.getElementById(target)?.classList.add('is-active');
    });
  });

  /* ---------- Module directory (JSON-driven) ---------- */
  const directory = document.getElementById('moduleDirectory');
  if (directory) {
    fetch('./assets/data/modules.json')
      .then((res) => res.json())
      .then((modules) => renderModuleDirectory(directory, modules))
      .catch(() => {
        directory.innerHTML = '<p class="module-directory__empty">Could not load assets/data/modules.json.</p>';
      });
  }

  function renderModuleDirectory(container, modules) {
    container.innerHTML = '';

    if (!Array.isArray(modules) || modules.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'module-directory__empty';
      empty.textContent = 'No modules listed yet — add one to assets/data/modules.json.';
      container.appendChild(empty);
      return;
    }

    modules.forEach((mod) => {
      const card = document.createElement('div');
      card.className = 'module-card reveal is-visible';

      const head = document.createElement('div');
      head.className = 'module-card__head';

      const name = document.createElement('span');
      name.className = 'module-card__name';
      name.textContent = mod.name || 'unnamed-module';
      head.appendChild(name);

      if (mod.template) {
        const badge = document.createElement('span');
        badge.className = 'module-card__badge';
        badge.textContent = 'template';
        head.appendChild(badge);
      }

      if (mod.author) {
        const author = document.createElement('span');
        author.className = 'module-card__author';
        author.textContent = '@' + mod.author;
        head.appendChild(author);
      }

      card.appendChild(head);

      if (mod.description) {
        const desc = document.createElement('p');
        desc.textContent = mod.description;
        card.appendChild(desc);
      }

      if (mod.repo || mod.manifestUrl) {
        const linksEl = document.createElement('div');
        linksEl.className = 'module-card__links';
        if (mod.repo) {
          const a = document.createElement('a');
          a.href = mod.repo;
          a.target = '_blank';
          a.rel = 'noopener';
          a.textContent = 'Repository ↗';
          linksEl.appendChild(a);
        }
        if (mod.manifestUrl) {
          const a = document.createElement('a');
          a.href = mod.manifestUrl;
          a.target = '_blank';
          a.rel = 'noopener';
          a.textContent = 'manifest.json ↗';
          linksEl.appendChild(a);
        }
        card.appendChild(linksEl);
      }

      if (mod.manifest) {
        const details = document.createElement('details');
        details.className = 'module-card__manifest';
        const summary = document.createElement('summary');
        summary.textContent = 'View manifest.json contents';
        details.appendChild(summary);
        const pre = document.createElement('pre');
        const code = document.createElement('code');
        code.textContent = JSON.stringify(mod.manifest, null, 2);
        pre.appendChild(code);
        details.appendChild(pre);
        card.appendChild(details);
      }

      if (mod.manifestUrl && mod.name) {
        const installLine = document.createElement('div');
        installLine.className = 'install-line';
        const code = document.createElement('code');
        const installCmd = `tyr --add ${mod.manifestUrl} ${mod.name}`;
        code.textContent = installCmd;
        installLine.appendChild(code);
        const copyBtn = document.createElement('button');
        copyBtn.textContent = 'Copy';
        wireCopyButton(copyBtn, () => installCmd);
        installLine.appendChild(copyBtn);
        card.appendChild(installLine);
      }

      container.appendChild(card);
    });
  }

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
