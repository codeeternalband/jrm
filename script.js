if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

const navigationEntry = performance.getEntriesByType('navigation')[0];
const navigationType = navigationEntry ? navigationEntry.type : '';

const views = Array.from(document.querySelectorAll('.page-view'));
const navLinks = Array.from(document.querySelectorAll('[data-view-link]'));
const menuBtn = document.getElementById('menuBtn');
const primaryNav = document.getElementById('primaryNav');

const validViews = new Set(views.map((view) => view.dataset.view));

const closeMenu = () => {
  if (!menuBtn || !primaryNav) {
    return;
  }

  primaryNav.classList.remove('open');
  menuBtn.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
};

const setActiveView = (viewName) => {
  const nextView = validViews.has(viewName) ? viewName : 'home';

  views.forEach((view) => {
    view.classList.toggle('is-active', view.dataset.view === nextView);
  });

  navLinks.forEach((link) => {
    link.classList.toggle('is-active', link.dataset.viewLink === nextView);
  });

  document.body.dataset.view = nextView;
  window.scrollTo(0, 0);
  closeMenu();
};

const syncViewFromHash = () => {
  const hashView = window.location.hash.replace('#', '') || 'home';
  setActiveView(hashView);
};

window.addEventListener('hashchange', syncViewFromHash);
window.addEventListener('load', () => {
  if (!window.location.hash && navigationType !== 'back_forward') {
    window.scrollTo(0, 0);
  }

  syncViewFromHash();
});

document.getElementById('year').textContent = new Date().getFullYear();

document.querySelectorAll('.video-launch').forEach((button) => {
  const videoId = button.dataset.videoId;

  if (!videoId) {
    return;
  }

  button.style.backgroundImage = `url("https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg")`;

  button.addEventListener('click', () => {
    const appUrl = `youtube://watch?v=${videoId}`;
    const webUrl = `https://youtu.be/${videoId}`;
    const fallbackTimer = window.setTimeout(() => {
      window.location.href = webUrl;
    }, 700);

    const clearFallback = () => {
      window.clearTimeout(fallbackTimer);
      window.removeEventListener('pagehide', clearFallback);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearFallback();
      }
    };

    window.addEventListener('pagehide', clearFallback, { once: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.location.href = appUrl;
  });
});

const ceMail = document.getElementById('ce-mail');
if (ceMail) {
  const makeText = (codes) => codes.map((code) => String.fromCharCode(code)).join('');
  const user = makeText([106, 114, 109, 103, 117, 105, 116, 97, 114, 111, 102, 102, 105, 99, 105, 97, 108]);
  const domain = makeText([103, 109, 97, 105, 108, 46, 99, 111, 109]);

  ceMail.textContent = `${user}@${domain}`;
}

const showsList = document.getElementById('showsList');
const showsStatus = document.getElementById('showsStatus');

const monthMap = {
  january: 0,
  february: 1,
  march: 2,
  april: 3,
  may: 4,
  june: 5,
  july: 6,
  august: 7,
  september: 8,
  october: 9,
  november: 10,
  december: 11,
};

const getShowSortValue = (dateText) => {
  const normalized = dateText.trim().toLowerCase();

  const fullDateMatch = normalized.match(
    /(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2})(?:-\d{1,2})?,\s*(\d{4})/
  );

  if (fullDateMatch) {
    const [, monthName, day, year] = fullDateMatch;
    return new Date(Number(year), monthMap[monthName], Number(day)).getTime();
  }

  const years = Array.from(normalized.matchAll(/\b(20\d{2}|19\d{2})\b/g)).map((match) => Number(match[1]));

  if (years.length) {
    return new Date(Math.max(...years), 11, 31).getTime();
  }

  return 0;
};

const createShowCard = ({ venue, date, city }) => {
  const card = document.createElement('li');
  card.className = 'show-card';

  const meta = document.createElement('div');
  meta.className = 'show-meta';

  const venueEl = document.createElement('span');
  venueEl.className = 'show-venue';
  venueEl.textContent = venue;

  const detailsRow = document.createElement('p');
  detailsRow.className = 'show-details';

  const dateEl = document.createElement('span');
  dateEl.className = 'show-date';
  dateEl.textContent = date;

  const separator = document.createElement('span');
  separator.className = 'show-separator';
  separator.textContent = '•';

  const cityEl = document.createElement('span');
  cityEl.className = 'show-city';
  cityEl.textContent = city;

  detailsRow.append(dateEl, separator, cityEl);
  meta.append(venueEl, detailsRow);
  card.append(meta);

  return card;
};

const renderShows = (sections) => {
  if (!showsList) {
    return;
  }

  showsList.innerHTML = '';

  sections.forEach(({ title, shows }) => {
    if (!shows.length) {
      return;
    }

    const section = document.createElement('section');
    section.className = 'shows-section';

    const heading = document.createElement('h2');
    heading.className = 'shows-section-title';
    heading.textContent = title;

    const grid = document.createElement('ul');
    grid.className = 'shows-grid';

    [...shows]
      .sort((a, b) => getShowSortValue(b.date) - getShowSortValue(a.date))
      .forEach((show) => {
      grid.append(createShowCard(show));
      });

    section.append(heading, grid);
    showsList.append(section);
  });
};

const parseShowsText = (text) => {
  const sections = [];
  let currentSection = null;

  text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .forEach((line) => {
      const sectionMatch = line.match(/^\[(.+)\]$/);

      if (sectionMatch) {
        currentSection = { title: sectionMatch[1], shows: [] };
        sections.push(currentSection);
        return;
      }

      const [venue, date, city] = line.split('|').map((part) => part.trim());
      const show = { venue, date, city };

      if (!show.venue || !show.date || !show.city) {
        return;
      }

      if (!currentSection) {
        currentSection = { title: 'Shows', shows: [] };
        sections.push(currentSection);
      }

      currentSection.shows.push(show);
    });

  return sections;
};

const loadShows = async () => {
  if (!showsList || !showsStatus) {
    return;
  }

  try {
    const response = await fetch('content/shows.txt', { cache: 'no-store' });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const text = await response.text();
    const sections = parseShowsText(text);
    const showCount = sections.reduce((total, section) => total + section.shows.length, 0);

    if (!showCount) {
      showsStatus.textContent = 'No shows listed right now.';
      return;
    }

    renderShows(sections);
    showsStatus.hidden = true;
  } catch (error) {
    showsStatus.textContent = 'Could not load shows list.';
  }
};

loadShows();

if (menuBtn && primaryNav) {
  menuBtn.addEventListener('click', () => {
    const isOpen = primaryNav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  primaryNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });
}
