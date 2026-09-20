const CONFIG = {
  ownerName: '김성우',
  githubUsername: 'octocat',
  projectLimit: 6,
};

const state = {
  theme: localStorage.getItem('portfolio-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),
  menuOpen: false,
  projects: [],
  projectStatus: 'idle',
  projectError: '',
  activeLanguage: 'All',
  formErrors: {},
};

const elements = {
  header: document.querySelector('.site-header'),
  menu: document.querySelector('.nav-menu'),
  menuToggle: document.querySelector('.menu-toggle'),
  themeToggle: document.querySelector('.theme-toggle'),
  themeIcon: document.querySelector('.theme-icon'),
  scrollTop: document.querySelector('.scroll-top'),
  projectGrid: document.querySelector('#project-grid'),
  projectStatus: document.querySelector('#projects-status'),
  projectFilters: document.querySelector('#project-filters'),
  contactForm: document.querySelector('#contact-form'),
  formSuccess: document.querySelector('#form-success'),
};

const escapeHTML = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const renderIdentity = () => {
  document.querySelectorAll('[data-owner-name]').forEach((element) => {
    element.textContent = CONFIG.ownerName;
  });
  document.querySelector('#github-link').href = `https://github.com/${CONFIG.githubUsername}`;
  document.querySelector('#current-year').textContent = new Date().getFullYear();
};

const renderTheme = () => {
  document.documentElement.dataset.theme = state.theme;
  const isDark = state.theme === 'dark';
  elements.themeIcon.textContent = isDark ? '☀' : '☾';
  elements.themeToggle.setAttribute('aria-label', isDark ? '라이트 모드로 전환' : '다크 모드로 전환');
};

const toggleTheme = () => {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('portfolio-theme', state.theme);
  renderTheme();
};

const renderMenu = () => {
  elements.menu.classList.toggle('active', state.menuOpen);
  elements.menuToggle.classList.toggle('active', state.menuOpen);
  elements.menuToggle.setAttribute('aria-expanded', String(state.menuOpen));
  elements.menuToggle.setAttribute('aria-label', state.menuOpen ? '메뉴 닫기' : '메뉴 열기');
  document.body.classList.toggle('menu-open', state.menuOpen);
};

const toggleMenu = () => {
  state.menuOpen = !state.menuOpen;
  renderMenu();
};

const closeMenu = () => {
  state.menuOpen = false;
  renderMenu();
};

const getLanguages = () => ['All', ...new Set(state.projects.map(({ language }) => language).filter(Boolean))];

const renderFilters = () => {
  elements.projectFilters.innerHTML = getLanguages().map((language) => `
    <button class="filter-button ${state.activeLanguage === language ? 'active' : ''}" type="button" data-language="${escapeHTML(language)}">
      ${escapeHTML(language)}
    </button>
  `).join('');
};

const getVisibleProjects = () => state.projects
  .filter(({ language }) => state.activeLanguage === 'All' || language === state.activeLanguage)
  .slice(0, CONFIG.projectLimit);

const renderProjects = () => {
  elements.projectGrid.innerHTML = '';
  elements.projectStatus.innerHTML = '';

  if (state.projectStatus === 'loading') {
    elements.projectStatus.innerHTML = '<span class="loading-spinner" aria-label="프로젝트 로딩 중"></span>';
    return;
  }

  if (state.projectStatus === 'error') {
    elements.projectStatus.innerHTML = `${escapeHTML(state.projectError)} <button class="retry-button" type="button">다시 시도</button>`;
    return;
  }

  const projects = getVisibleProjects();
  if (!projects.length) {
    elements.projectStatus.textContent = '표시할 프로젝트가 없습니다.';
    return;
  }

  elements.projectGrid.innerHTML = projects.map(({ name, description, html_url: url, language, stargazers_count: stars }) => `
    <article class="project-card">
      <div class="meta"><span>${escapeHTML(language || 'Other')}</span><span>★ ${stars}</span></div>
      <h3>${escapeHTML(name)}</h3>
      <p>${escapeHTML(description || '저장소 설명이 아직 등록되지 않았습니다.')}</p>
      <a href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHTML(name)} GitHub 저장소 열기">Repository ↗</a>
    </article>
  `).join('');
};

const loadProjects = async () => {
  state.projectStatus = 'loading';
  state.projectError = '';
  renderProjects();

  try {
    const response = await fetch(`https://api.github.com/users/${CONFIG.githubUsername}/repos?sort=updated&per_page=30`);
    if (!response.ok) throw new Error(response.status === 403 ? 'API 요청 한도에 도달했습니다.' : '프로젝트를 불러올 수 없습니다.');
    const data = await response.json();
    state.projects = data.filter(({ fork }) => !fork);
    state.projectStatus = 'success';
    renderFilters();
  } catch (error) {
    state.projectStatus = 'error';
    state.projectError = error.message || '프로젝트를 불러올 수 없습니다.';
  }

  renderProjects();
};

const validateField = (field) => {
  const value = field.value.trim();
  let message = '';
  if (!value) message = '필수 입력 항목입니다.';
  if (field.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) message = '올바른 이메일 형식을 입력해 주세요.';
  state.formErrors[field.name] = message;
  const wrapper = field.closest('.form-field');
  wrapper.classList.toggle('invalid', Boolean(message));
  wrapper.querySelector('.error-message').textContent = message;
  field.setAttribute('aria-invalid', String(Boolean(message)));
  return !message;
};

const handleSubmit = (event) => {
  event.preventDefault();
  const fields = [...elements.contactForm.querySelectorAll('input, textarea')];
  const isValid = fields.map(validateField).every(Boolean);
  elements.formSuccess.textContent = isValid ? '입력 확인이 완료되었습니다. 감사합니다!' : '';
  if (isValid) elements.contactForm.reset();
};

const handleScroll = () => {
  const y = window.scrollY;
  elements.header.classList.toggle('scrolled', y >= 60);
  elements.scrollTop.classList.toggle('visible', y >= 300);
};

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.2 });

elements.themeToggle.addEventListener('click', toggleTheme);
elements.menuToggle.addEventListener('click', toggleMenu);
elements.menu.addEventListener('click', (event) => {
  if (event.target.matches('a')) closeMenu();
});
elements.scrollTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
elements.projectStatus.addEventListener('click', (event) => {
  if (event.target.matches('.retry-button')) loadProjects();
});
elements.projectFilters.addEventListener('click', (event) => {
  const button = event.target.closest('[data-language]');
  if (!button) return;
  state.activeLanguage = button.dataset.language;
  renderFilters();
  renderProjects();
});
elements.contactForm.addEventListener('submit', handleSubmit);
elements.contactForm.addEventListener('input', (event) => {
  if (event.target.matches('input, textarea')) {
    validateField(event.target);
    elements.formSuccess.textContent = '';
  }
});
window.addEventListener('scroll', handleScroll, { passive: true });
window.addEventListener('resize', () => {
  if (window.innerWidth >= 768 && state.menuOpen) closeMenu();
});
document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

renderIdentity();
renderTheme();
renderMenu();
handleScroll();
loadProjects();
