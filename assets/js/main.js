import { initTheme, stored, cycle, icon } from './theme.js';
import { load, loadAll } from './data.js';

initTheme();
let _cachedPubs = null;

document.addEventListener('DOMContentLoaded', async () => {
  const site = await load('site');
  const path = (location.pathname.replace(/\.html$/, '').replace(/\/$/, '')) || '/';

  // Announcement
  const ann = site.announcement;
  if (ann?.visible && ann.text) {
    const link = ann.link ? `<a href="${ann.link}">${ann.linkText || '→'}</a>` : '';
    document.body.insertAdjacentHTML('afterbegin',
      `<div class="announcement"><span>${ann.text} ${link}</span><button class="ann-close" onclick="this.parentElement.remove();document.body.classList.remove('has-announcement')">✕</button></div>`
    );
    document.body.classList.add('has-announcement');
  }

  // Nav
  const header = document.getElementById('site-header');
  if (header) {
    const nav = (site.navigation || []).filter(n => n.visible);
    const current = stored();
    const items = nav.map(n => {
      const href = (n.href || '/').replace(/\.html$/, '');
      const active = path === href || (href !== '/' && path === href);
      return `<li><a href="${href}"${active ? ' class="active"' : ''}>${n.label}</a></li>`;
    }).join('');

    header.innerHTML = `
      <div class="nav-inner">
        <a href="/" class="nav-logo">${site.title || 'Portfolio'}</a>
        <ul class="nav-links">${items}</ul>
        <div class="nav-actions">
          <button class="theme-btn" id="theme-btn" title="Toggle theme">${icon(current)}</button>
          <button class="nav-toggle" id="nav-toggle">☰</button>
        </div>
      </div>
      <nav class="nav-mobile" id="nav-mobile"><ul>${items}</ul></nav>`;

    document.getElementById('theme-btn')?.addEventListener('click', () => {
      const next = cycle();
      document.getElementById('theme-btn').textContent = icon(next);
    });

    document.getElementById('nav-toggle')?.addEventListener('click', () => {
      document.getElementById('nav-mobile')?.classList.toggle('open');
    });
  }

  // Footer
  const footer = document.getElementById('site-footer');
  if (footer) {
    const f = site.footer || {};
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const now = new Date();
    const updated = f.showLastUpdated ? `<span>Last Updated: ${months[now.getMonth()]} ${now.getFullYear()}</span>` : '';
    footer.innerHTML = `<div class="footer-inner"><span class="footer-text">${f.text || ''}</span>${updated}</div>`;
  }

  // Analytics
  if (site.analytics?.enabled && site.analytics?.googleAnalyticsId) {
    const id = site.analytics.googleAnalyticsId;
    const s = document.createElement('script');
    s.async = true; s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', id);
  }

  // Page init
  const page = document.body.dataset.page;
  const pages = { home: initHome, publications: initPublications, projects: initProjects, teaching: initTeaching, talks: initTalks, awards: initAwards, gallery: initGallery, cv: initCV };
  if (pages[page]) await pages[page](site);
});

/* ─── SVG Icons ─── */
const IC = {
  email: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
  cv: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
  scholar: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 100 14 7 7 0 000-14z"/></svg>`,
  github: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>`,
  linkedin: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
  orcid: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947s-.422.947-.947.947a.95.95 0 01-.947-.947c0-.525.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.016-5.325 5.016h-3.919V7.416zm1.444 1.303v7.444h2.297c3.272 0 3.872-2.912 3.872-3.722 0-2.016-1.284-3.722-3.872-3.722h-2.297z"/></svg>`,
  researchgate: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.586 0c-.818 0-1.508.19-2.073.565-.563.377-.97.936-1.213 1.68a12.085 12.085 0 00-.16.598 7.993 7.993 0 00-.15 1.05c-.044.498-.044.984-.044 1.19v.026c0 .352.012.698.036 1.038.13 1.98.805 3.78 2.026 5.399 1.27 1.684 2.864 3.103 4.784 4.258V0h-.006c-.33 0-.66.018-.988.05C20.646.03 20.12 0 19.586 0zM0 9.5v5L8 9.5H0zm13.5 0L8 15h5.5a6 6 0 000-5.5z"/></svg>`,
  twitter: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
  facebook: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`,
  website: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>`,
  semanticScholar: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 1.5L12 0 .75 7.5v9L12 24l11.25-7.5v-9L13.5 1.5zm-1.5 18L3 13.5v-3L12 4.5 21 10.5v3L12 19.5z"/></svg>`,
};

/* ─── Home ─── */
const DEFAULT_HP_SECTIONS = [
  { id:'about', visible:true }, { id:'interests', visible:true },
  { id:'pubs', visible:true }, { id:'projects', visible:true },
  { id:'awards', visible:false }, { id:'teaching', visible:false },
  { id:'news', visible:true }
];

async function initHome(site) {
  const sidebar = document.getElementById('profile-sidebar');
  const homeMain = document.getElementById('home-main');
  if (!sidebar || !homeMain) return;

  const [profile, news, pubs, projects, awards, teaching] = await loadAll('profile','news','publications','projects','awards','teaching');
  _cachedPubs = pubs;
  const hp = site.homepage || {};

  // ── Sidebar ──
  const photo = profile.profilePhoto
    ? `<img class="profile-photo" src="${profile.profilePhoto}" alt="${profile.name}">`
    : `<div class="profile-photo-ph">👤</div>`;

  const affiliLogo = profile.institutionLogo
    ? `<img class="affil-logo" src="${profile.institutionLogo}" alt="">` : '';

  const linkDefs = [
    { href: `mailto:${profile.email}`, icon: IC.email, label: 'Email', show: !!profile.email, ext: false },
    { href: profile.cvUrl, icon: IC.cv, label: 'CV / Resume', show: !!(profile.cvUrl && profile.cvVisible !== false), ext: true },
    { href: profile.links?.googleScholar, icon: IC.scholar, label: 'Google Scholar', show: !!profile.links?.googleScholar, ext: true },
    { href: profile.links?.orcid, icon: IC.orcid, label: 'ORCID', show: !!profile.links?.orcid, ext: true },
    { href: profile.links?.github, icon: IC.github, label: 'GitHub', show: !!profile.links?.github, ext: true },
    { href: profile.links?.linkedin, icon: IC.linkedin, label: 'LinkedIn', show: !!profile.links?.linkedin, ext: true },
    { href: profile.links?.researchgate, icon: IC.researchgate, label: 'ResearchGate', show: !!profile.links?.researchgate, ext: true },
    { href: profile.links?.semanticScholar, icon: IC.semanticScholar, label: 'Semantic Scholar', show: !!profile.links?.semanticScholar, ext: true },
    { href: profile.links?.twitter, icon: IC.twitter, label: 'Twitter / X', show: !!profile.links?.twitter, ext: true },
    { href: profile.links?.facebook, icon: IC.facebook, label: 'Facebook', show: !!profile.links?.facebook, ext: true },
    { href: profile.links?.website, icon: IC.website, label: 'Website', show: !!profile.links?.website, ext: true },
  ];
  (profile.customLinks || []).forEach(l => { if (l.url && l.label) linkDefs.push({ href: l.url, icon: IC.website, label: l.label, show: true, ext: true }); });

  const linksHtml = linkDefs.filter(l => l.show).map(l =>
    `<a class="profile-link" href="${l.href}"${l.ext ? ' target="_blank" rel="noopener"' : ''}>${l.icon}<span>${l.label}</span></a>`
  ).join('');

  const affils = (profile.affiliations || []).filter(a => a.logo || a.name);
  const affilLogos = affils.length ? `<div class="affil-logos">${affils.map(a => {
    const img = a.logo
      ? `<img src="${a.logo}" alt="${a.name || ''}" title="${a.name || ''}" loading="lazy">`
      : `<span class="affil-name-chip" title="${a.name || ''}">${a.name || ''}</span>`;
    return a.url ? `<a href="${a.url}" target="_blank" rel="noopener" title="${a.name || ''}">${img}</a>` : img;
  }).join('')}</div>` : '';

  sidebar.innerHTML = `
    ${photo}
    <h1 class="profile-name">${profile.name || ''}</h1>
    ${profile.title ? `<p class="profile-title-text">${[profile.title, profile.subtitle].filter(Boolean).join('<br>')}</p>` : ''}
    ${profile.institution ? `<div class="profile-affil">${affiliLogo}${profile.institutionUrl ? `<a href="${profile.institutionUrl}" target="_blank" rel="noopener">${profile.institution}</a>` : profile.institution}</div>` : ''}
    ${profile.department ? `<div class="profile-dept">${profile.department}</div>` : ''}
    ${affilLogos}
    <div class="profile-links">${linksHtml}</div>`;

  // ── Main content sections ──
  const sections = (site.homepageSections || DEFAULT_HP_SECTIONS).filter(s => s.visible !== false);

  const renderSection = {
    about: () => {
      if (!profile.bio) return '';
      return `<div class="home-section"><div class="section-header"><h2>About</h2></div><div class="home-bio">${profile.bio}</div></div>`;
    },
    interests: () => {
      const ri = (profile.researchInterests || []);
      if (!ri.length) return '';
      return `<div class="home-section"><div class="section-header"><h2>Research Interests</h2></div><div class="interest-tags">${ri.map(i => `<span class="tag">${i}</span>`).join('')}</div></div>`;
    },
    pubs: () => {
      const items = (pubs || []).filter(p => p.visible !== false && p.featured).slice(0, hp.featuredPubsCount || 4);
      if (!items.length) return '';
      return `<div class="home-section" id="hp-pubs"><div class="section-header"><h2>Selected Publications</h2><a href="/publications" class="see-all">See all →</a></div><div class="pub-list">${items.map(pubCard).join('')}</div></div>`;
    },
    projects: () => {
      const items = (projects || []).filter(p => p.visible !== false && p.featured).slice(0, hp.featuredProjectsCount || 2);
      if (!items.length) return '';
      return `<div class="home-section"><div class="section-header"><h2>Projects</h2><a href="/projects" class="see-all">See all →</a></div><div class="project-grid">${items.map(projCard).join('')}</div></div>`;
    },
    awards: () => {
      const items = (awards || []).filter(a => a.visible !== false).slice(0, 5);
      if (!items.length) return '';
      return `<div class="home-section"><div class="section-header"><h2>Awards &amp; Honors</h2></div><div class="item-list">${items.map(a => `
        <div class="item-entry">
          <div><div class="item-title">${a.title}${a.link ? ` <a href="${a.link}" target="_blank" rel="noopener" style="font-size:0.78rem">→</a>` : ''}</div><div class="item-sub">${a.organization || ''}</div></div>
          <div class="item-year">${a.year || ''}</div>
        </div>`).join('')}</div></div>`;
    },
    teaching: () => {
      const items = (teaching || []).filter(t => t.visible !== false).slice(0, 4);
      if (!items.length) return '';
      return `<div class="home-section"><div class="section-header"><h2>Teaching</h2><a href="/teaching" class="see-all">See all →</a></div><div class="item-list">${items.map(t => `
        <div class="item-entry">
          <div><div class="item-title">${t.course || ''}</div><div class="item-sub">${[t.role, t.institution].filter(Boolean).join(' · ')}</div></div>
          <div class="item-year">${[t.semester, t.year].filter(Boolean).join(' ')}</div>
        </div>`).join('')}</div></div>`;
    },
    news: () => {
      const items = (news || []).filter(n => n.visible !== false).slice(0, hp.newsCount || 8);
      if (!items.length) return '';
      return `<div class="home-section"><div class="section-header"><h2>News</h2></div><div class="news-list">${items.map(n => `
        <div class="news-item">
          <span class="news-date">${fmtDate(n.date)}</span>
          <span class="news-content">${n.content}${n.link ? ` <a href="${n.link}" target="_blank" rel="noopener">${n.linkText || '→'}</a>` : ''}</span>
        </div>`).join('')}</div></div>`;
    }
  };

  homeMain.innerHTML = sections.map(s => (renderSection[s.id] ? renderSection[s.id]() : '')).join('');
  attachPubHandlers(homeMain);
}

/* ─── Publications ─── */
async function initPublications() {
  const [pubs, profile] = await loadAll('publications', 'profile');
  _cachedPubs = pubs;
  const el = document.getElementById('pub-content');
  if (!el) return;
  const visible = (pubs || []).filter(p => p.visible !== false);
  if (!visible.length) { el.innerHTML = empty('📄', 'No publications yet.'); return; }
  const scholarUrl = profile?.links?.googleScholar;
  const scholarNote = scholarUrl
    ? `<div class="scholar-note">For the most up-to-date publication list and citation metrics, visit my <a href="${scholarUrl}" target="_blank" rel="noopener">Google Scholar profile →</a></div>`
    : '';
  const cats = [...new Set(visible.map(p => p.category).filter(Boolean))];
  let activeF = 'all', q = '';
  const filterRow = `
    ${scholarNote}
    <div class="pub-filters">
      <button class="filter-btn active" data-f="all">All (${visible.length})</button>
      ${cats.map(c => `<button class="filter-btn" data-f="${c}">${cap(c)}</button>`).join('')}
      <div class="pub-search"><input id="pub-q" type="search" placeholder="Search…"></div>
    </div><div id="pub-list"></div>`;
  el.innerHTML = filterRow;
  const listEl = document.getElementById('pub-list');
  const render = () => {
    let f = visible;
    if (activeF !== 'all') f = f.filter(p => p.category === activeF);
    if (q) { const lq = q.toLowerCase(); f = f.filter(p => ((p.title||'')+(p.authors||[]).join(' ')+(p.venueShort||'')).toLowerCase().includes(lq)); }
    if (!f.length) { listEl.innerHTML = empty('📄', 'No results.'); return; }
    const byYear = {};
    f.forEach(p => { const y = p.year || 'Other'; (byYear[y] = byYear[y] || []).push(p); });
    listEl.innerHTML = Object.keys(byYear).sort((a,b)=>b-a).map(y =>
      `<div class="pub-year-group"><div class="pub-year-label">${y}</div>${byYear[y].map(pubCard).join('')}</div>`
    ).join('');
    attachPubHandlers(listEl);
  };
  el.querySelectorAll('.filter-btn').forEach(btn => btn.addEventListener('click', () => {
    el.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active'); activeF = btn.dataset.f; render();
  }));
  document.getElementById('pub-q')?.addEventListener('input', e => { q = e.target.value; render(); });
  render();
}

/* ─── Projects ─── */
async function initProjects() {
  const [projects, pubs] = await loadAll('projects', 'publications');
  _cachedPubs = pubs;
  const el = document.getElementById('proj-content');
  if (!el) return;
  const visible = (projects || []).filter(p => p.visible !== false);
  el.innerHTML = visible.length ? `<div class="project-grid">${visible.map(projCard).join('')}</div>` : empty('🔬', 'Projects coming soon.');
}

/* ─── Teaching ─── */
async function initTeaching() {
  const data = await load('teaching');
  const el = document.getElementById('teaching-content');
  if (!el) return;
  const v = (data || []).filter(t => t.visible !== false);
  el.innerHTML = v.length ? `<div class="item-list">${v.map(t => `
    <div class="item-entry">
      <div>
        <div class="item-title">${t.course || t.title || ''}</div>
        <div class="item-sub">${[t.role, t.institution].filter(Boolean).join(' · ')}</div>
        ${t.courseUrl ? `<div style="margin-top:0.2rem"><a href="${t.courseUrl}" target="_blank" rel="noopener" style="font-size:0.78rem">Course site →</a></div>` : ''}
        ${t.description ? `<div class="item-desc">${t.description}</div>` : ''}
        ${itemImages(t)}
      </div>
      <div class="item-year">${[t.semester, t.year].filter(Boolean).join(' ')}</div>
    </div>`).join('')}</div>` : empty('🎓', 'Teaching history coming soon.');
}

/* ─── Talks ─── */
async function initTalks() {
  const data = await load('talks');
  const el = document.getElementById('talks-content');
  if (!el) return;
  const v = (data || []).filter(t => t.visible !== false);
  el.innerHTML = v.length ? `<div class="item-list">${v.map(t => `
    <div class="item-entry">
      <div>
        <div class="item-title">${t.title}</div>
        <div class="item-sub">${[t.event, t.location].filter(Boolean).join(' · ')}</div>
        <span class="badge badge-conference" style="margin-top:0.25rem">${cap(t.type || 'talk')}</span>
        ${t.abstract ? `<div class="item-desc">${t.abstract}</div>` : ''}
        <div class="pub-links" style="margin-top:0.35rem">
          ${t.links?.slides ? `<a href="${t.links.slides}" class="pub-link" target="_blank" rel="noopener">Slides</a>` : ''}
          ${t.links?.video ? `<a href="${t.links.video}" class="pub-link" target="_blank" rel="noopener">Video</a>` : ''}
        </div>
        ${itemImages(t)}
      </div>
      <div class="item-year">${fmtDate(t.date)}</div>
    </div>`).join('')}</div>` : empty('🎤', 'Talks coming soon.');
}

/* ─── Awards ─── */
async function initAwards() {
  const [awards, service] = await loadAll('awards', 'service');
  const awEl = document.getElementById('awards-content');
  const svEl = document.getElementById('service-content');
  const va = (awards || []).filter(a => a.visible !== false);
  const vs = (service || []).filter(s => s.visible !== false);
  if (awEl) awEl.innerHTML = va.length ? `<div class="item-list">${va.map(a => `
    <div class="item-entry">
      <div>
        <div class="item-title">${a.title}${a.link ? ` <a href="${a.link}" target="_blank" rel="noopener" style="font-size:0.78rem">→</a>` : ''}</div>
        <div class="item-sub">${a.organization || ''}</div>
        ${a.description ? `<div class="item-desc">${a.description}</div>` : ''}
        ${itemImages(a)}
      </div>
      <div class="item-year">${a.year || ''}</div>
    </div>`).join('')}</div>` : empty('🏆', 'Awards coming soon.');
  if (svEl) svEl.innerHTML = vs.length ? `<div class="item-list">${vs.map(s => `
    <div class="item-entry">
      <div><div class="item-title">${s.role || ''}</div><div class="item-sub">${s.venue || s.organization || ''}</div></div>
      <div class="item-year">${s.year || ''}</div>
    </div>`).join('')}</div>` : empty('📋', 'Service entries coming soon.');
}

/* ─── Gallery ─── */
async function initGallery() {
  const gallery = await load('gallery');
  const el = document.getElementById('gallery-content');
  if (!el) return;
  const visible = (gallery || []).filter(g => g.visible !== false);
  if (!visible.length) { el.innerHTML = empty('📷', 'Gallery coming soon.'); return; }
  const cats = ['all', ...new Set(visible.map(g => g.category).filter(Boolean))];
  let active = 'all';
  el.innerHTML = `
    <div class="gallery-filters">${cats.map(c => `<button class="filter-btn${c==='all'?' active':''}" data-c="${c}">${c==='all'?'All':cap(c)}</button>`).join('')}</div>
    <div class="gallery-grid" id="gg"></div>
    <div class="lightbox" id="lb" onclick="if(event.target===this)closeLB()">
      <button class="lb-close" onclick="closeLB()">✕</button>
      <img id="lb-img" src="" alt="">
    </div>`;
  const gg = document.getElementById('gg');
  const render = () => {
    const items = active === 'all' ? visible : visible.filter(g => g.category === active);
    gg.innerHTML = items.map((g, i) => `
      <div class="gallery-item" onclick="openLB(${i})">
        <img src="${g.url || g.src}" alt="${g.caption || ''}" loading="lazy">
        ${g.caption ? `<div class="gallery-caption">${g.caption}</div>` : ''}
      </div>`).join('');
    window._galleryItems = items;
  };
  el.querySelectorAll('.filter-btn').forEach(btn => btn.addEventListener('click', () => {
    el.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active'); active = btn.dataset.c; render();
  }));
  window.openLB = i => { document.getElementById('lb-img').src = window._galleryItems[i].url || window._galleryItems[i].src; document.getElementById('lb').classList.add('open'); document.body.style.overflow = 'hidden'; };
  window.closeLB = () => { document.getElementById('lb').classList.remove('open'); document.body.style.overflow = ''; document.getElementById('lb-img').src = ''; };
  document.addEventListener('keydown', e => { if (e.key === 'Escape') window.closeLB?.(); });
  render();
}

/* ─── CV ─── */
async function initCV() {
  const [profile, education, experience, awards] = await loadAll('profile', 'education', 'experience', 'awards');
  const el = document.getElementById('cv-content');
  if (!el) return;
  const ve = (education || []).filter(e => e.visible !== false);
  const vx = (experience || []).filter(e => e.visible !== false);
  const va = (awards || []).filter(a => a.visible !== false);
  el.innerHTML = `
    ${profile.cvUrl && profile.cvVisible ? `<div class="cv-download-bar"><span>Download full CV as PDF</span><a href="${profile.cvUrl}" class="btn btn-primary btn-sm" target="_blank" rel="noopener">⬇ Download PDF</a></div>` : ''}
    ${ve.length ? `<div class="section"><div class="section-header"><h2>Education</h2></div><div class="edu-exp-list">${ve.map(e => `
      <div class="edu-entry">
        <div class="org-logo">${e.institutionLogo ? `<img src="${e.institutionLogo}" alt="${e.institution}">` : '🎓'}</div>
        <div>
          <div class="edu-degree">${e.degree} in ${e.field}</div>
          <div class="edu-inst">${e.institutionUrl ? `<a href="${e.institutionUrl}" target="_blank" rel="noopener">${e.institution}</a>` : e.institution}</div>
          <div class="edu-meta">${e.yearRange || [e.startYear, e.endYear].filter(Boolean).join('–')}${e.advisor ? ` · Advisor: ${e.advisorUrl ? `<a href="${e.advisorUrl}">${e.advisor}</a>` : e.advisor}` : ''}${e.gpa && e.showGpa ? ` · GPA: ${e.gpa}` : ''}</div>
          ${e.thesisTitle ? `<div style="font-size:0.78rem;color:var(--muted);margin-top:0.15rem">Thesis: ${e.thesisUrl ? `<a href="${e.thesisUrl}" target="_blank">${e.thesisTitle}</a>` : e.thesisTitle}</div>` : ''}
        </div>
      </div>`).join('')}</div></div>` : ''}
    ${vx.length ? `<div class="section"><div class="section-header"><h2>Experience</h2></div><div class="edu-exp-list">${vx.map(e => `
      <div class="exp-entry">
        <div class="org-logo">${e.organizationLogo ? `<img src="${e.organizationLogo}" alt="${e.organization}">` : '🏢'}</div>
        <div>
          <div class="exp-title">${e.title}</div>
          <div class="exp-org">${e.organizationUrl ? `<a href="${e.organizationUrl}" target="_blank" rel="noopener">${e.organization}</a>` : e.organization}</div>
          <div class="exp-meta">${e.duration || ''}${e.location ? ` · ${e.location}` : ''}</div>
          ${e.description ? `<div style="font-size:0.8rem;color:var(--muted);margin-top:0.2rem">${e.description}</div>` : ''}
        </div>
      </div>`).join('')}</div></div>` : ''}
    ${va.length ? `<div class="section"><div class="section-header"><h2>Awards &amp; Honors</h2></div><div class="item-list">${va.map(a => `
      <div class="item-entry"><div><div class="item-title">${a.title}</div><div class="item-sub">${a.organization || ''}</div></div><div class="item-year">${a.year || ''}</div></div>`).join('')}</div></div>` : ''}
    ${profile.skills && Object.keys(profile.skills).length ? `<div class="section"><div class="section-header"><h2>Skills</h2></div><div class="skills-grid">${Object.entries(profile.skills).map(([g, items]) => `
      <div class="skill-group"><div class="skill-group-title">${cap(g)}</div><div class="skill-list">${(items || []).map(s => `<span class="tag">${s}</span>`).join('')}</div></div>`).join('')}</div></div>` : ''}`;
}

/* ─── Helpers ─── */
const RANK_STYLE = {
  'Q1':  ['#f0fdf4','#15803d'], 'Q2': ['#f7fee7','#65a30d'],
  'Q3':  ['#fefce8','#d97706'], 'Q4': ['#fff1f2','#dc2626'],
  'A*':  ['#dbeafe','#1d4ed8'], 'A':  ['#eff6ff','#2563eb'],
  'B':   ['#f5f3ff','#7c3aed'], 'C':  ['#f8fafc','#64748b'],
};

function pubCard(p) {
  const thumb = p.thumbnail
    ? `<div class="pub-thumb"><img src="${p.thumbnail}" alt="" loading="lazy"></div>`
    : `<div class="pub-thumb"><div class="pub-thumb-ph">📄</div></div>`;

  // PDF goes to action row; other links stay in the links strip
  const linkKeys = { arxiv:'arXiv', code:'Code', project:'Project', slides:'Slides', video:'Video', poster:'Poster', doi:'DOI' };
  const links = Object.entries(p.links || {}).filter(([k,v]) => v && k !== 'pdf').map(([k,v]) =>
    `<a href="${v}" class="pub-link" target="_blank" rel="noopener">${linkKeys[k] || cap(k)}</a>`).join('');

  const authors = (p.authors || []).map(a => a === p.highlightAuthor ? `<span class="me">${a}</span>` : a).join(', ');
  const badge = { journal:'badge-journal', conference:'badge-conference', preprint:'badge-preprint', workshop:'badge-workshop', thesis:'badge-conference' }[p.category] || 'badge-conference';
  const badgeLabel = { journal:'Journal', conference:'Conf.', preprint:'Preprint', workshop:'Workshop', thesis:'Thesis', 'book chapter':'Book Ch.' }[p.category] || cap(p.category || '');
  const awardBadge = p.award ? `<span class="badge badge-award">${p.award}</span>` : '';

  const rs = p.rank && RANK_STYLE[p.rank];
  const rankBadge = rs ? `<span class="badge" style="background:${rs[0]};color:${rs[1]}">${p.rank}</span>` : '';

  const pdfUrl = p.links?.pdf;
  const pdfBtn = pdfUrl
    ? `<a href="${pdfUrl}" class="pub-toggle-btn" target="_blank" rel="noopener" style="color:var(--accent);font-weight:600">📄 Full Text</a>`
    : '';

  return `
    <div class="pub-card">
      ${thumb}
      <div class="pub-body">
        <div class="pub-meta"><span class="badge ${badge}">${badgeLabel}</span>${rankBadge}<span class="pub-venue-short">${p.venueShort || p.venue || ''}</span>${awardBadge}</div>
        <div class="pub-title">${p.title}</div>
        <div class="pub-authors">${authors}</div>
        ${links ? `<div class="pub-links">${links}</div>` : ''}
        <div style="display:flex;gap:0.6rem;flex-wrap:wrap;align-items:center;margin-top:0.1rem">
          ${pdfBtn}
          ${p.abstract ? `<button class="pub-toggle-btn" data-target="abs-${p.id}">Abstract</button>` : ''}
          ${p.bibtex ? `<button class="pub-toggle-btn" data-target="bib-${p.id}">BibTeX</button>` : ''}
        </div>
        ${p.abstract ? `<div class="pub-abstract" id="abs-${p.id}">${p.abstract}</div>` : ''}
        ${p.bibtex ? `<div class="pub-bibtex" id="bib-${p.id}"><pre>${escHtml(p.bibtex)}</pre></div>` : ''}
      </div>
    </div>`;
}

function attachPubHandlers(el) {
  el.querySelectorAll('.pub-toggle-btn').forEach(btn => btn.addEventListener('click', () => {
    const t = document.getElementById(btn.dataset.target);
    if (!t) return;
    t.classList.toggle('open');
    btn.textContent = t.classList.contains('open') ? 'Hide ' + (btn.textContent.replace('Hide ','')) : btn.textContent.replace('Hide ','');
  }));
}

function projCard(p) {
  const stMap = { ongoing:'st-ongoing', completed:'st-completed', paused:'st-paused' };
  const lMap = { paper:'Paper', code:'Code', demo:'Demo', website:'Site', video:'Video' };
  const links = Object.entries(p.links || {}).filter(([,v]) => v).map(([k,v]) => `<a href="${v}" class="pub-link" target="_blank" rel="noopener">${lMap[k] || cap(k)}</a>`).join('');
  const linkedPubs = (_cachedPubs || []).filter(pub => (p.publicationIds || []).includes(pub.id));
  const linkedHtml = linkedPubs.length ? `
    <div class="proj-pubs">
      <div class="proj-pubs-label">Publications</div>
      ${linkedPubs.map(pub => `<div class="proj-pub-item">· <a href="/publications">${pub.title}</a>${pub.venueShort ? ` <span class="proj-pub-venue">(${pub.venueShort})</span>` : ''}</div>`).join('')}
    </div>` : '';
  return `
    <div class="project-card">
      ${p.thumbnail ? `<div class="project-thumb"><img src="${p.thumbnail}" alt="${p.title}" loading="lazy"></div>` : ''}
      <div class="project-body">
        <div class="project-title">${p.title}</div>
        ${p.status ? `<span class="proj-status ${stMap[p.status] || ''}">${p.status}</span>` : ''}
        <div class="project-desc">${p.description || ''}</div>
        ${p.tags?.length ? `<div class="project-tags">${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>` : ''}
        ${links ? `<div class="project-links">${links}</div>` : ''}
        ${linkedHtml}
      </div>
    </div>`;
}

function fmtDate(s) {
  if (!s) return '';
  try { return new Date(s + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }); }
  catch { return s; }
}

// Image strip for talks/awards/teaching entries; click opens the shared lightbox
function itemImages(item) {
  const imgs = item.images || [];
  if (!imgs.length) return '';
  return `<div class="item-imgs">${imgs.map(u =>
    `<img src="${u}" alt="" loading="lazy" onclick="showImgLB('${u}')">`).join('')}</div>`;
}

window.showImgLB = (url) => {
  let lb = document.getElementById('img-lb');
  if (!lb) {
    document.body.insertAdjacentHTML('beforeend',
      `<div class="lightbox" id="img-lb" onclick="if(event.target===this)this.classList.remove('open')">
        <button class="lb-close" onclick="document.getElementById('img-lb').classList.remove('open')">✕</button>
        <img id="img-lb-img" src="" alt="">
      </div>`);
    lb = document.getElementById('img-lb');
    document.addEventListener('keydown', e => { if (e.key === 'Escape') lb.classList.remove('open'); });
  }
  document.getElementById('img-lb-img').src = url;
  lb.classList.add('open');
};

function cap(s) { return s ? s[0].toUpperCase() + s.slice(1) : ''; }
function empty(ico, msg) { return `<div class="empty-state"><div class="ico">${ico}</div>${msg}</div>`; }
function escHtml(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
