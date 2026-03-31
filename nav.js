/**
 * nav.js — Feel the Room
 * Injects the shared navigation into every page automatically.
 * Replaces any existing <nav> element, or inserts one at the top of <body>.
 *
 * Usage: <script src="/path/to/nav.js" defer></script>
 *
 * Right-side CTA is controlled by data-nav-cta on <body>:
 *   data-nav-cta="book"   → "Book a call →" button (default)
 *   data-nav-cta="print"  → "Print / Save PDF" button (freebie sub-pages)
 *   data-nav-cta="none"   → no button
 */
(function () {
  // Compute base path so links resolve correctly from any subdirectory.
  // Depth = number of directories below root the current file lives in.
  // e.g. /programs.html → depth 0 → base ""
  //      /freebies/guide.html → depth 1 → base "../"
  var parts = window.location.pathname.split('/').filter(Boolean);
  // Remove the filename (last segment) to get directory parts
  var dirParts = parts.slice(0, parts.length - 1);
  // Only count parts that look like subdirectories (not the site root folder)
  // For feeltheroom.dk: pathname is /programs.html → dirParts = [] → depth 0
  // For /freebies/guide.html → dirParts = ['freebies'] → depth 1
  var depth = dirParts.length > 0 && dirParts[dirParts.length - 1] !== '' ? dirParts.length : 0;
  var base  = depth > 0 ? Array(depth).fill('..').join('/') + '/' : '';

  var path = window.location.pathname;

  function isActive(page) {
    // Free Tools is active for any page under /freebies/
    if (page === 'freebies/index.html') {
      return path.indexOf('/freebies/') !== -1;
    }
    return path.endsWith('/' + page) || path === '/' + page;
  }

  var links = [
    { page: 'programs.html',       label: 'Programs',    featured: true  },
    { page: 'about.html',          label: 'About',       featured: false },
    { page: 'testimonials.html',   label: 'Testimonials',featured: false },
    { page: 'profile-test.html',   label: 'Aura Profile',featured: true  },
    { page: 'freebies/index.html', label: 'Free Tools',  featured: false },
  ];

  var linksHTML = links.map(function (link) {
    var active = isActive(link.page);
    var cls    = active ? ' class="active"' : '';
    // Featured links (Programs, Aura Profile) always shown in gold unless active
    var style  = (!active && link.featured) ? ' style="color:var(--accent,var(--gold,#ff0800));font-weight:600;"' : '';
    return '<a href="' + base + link.page + '"' + cls + style + '>' + link.label + '</a>';
  }).join('');

  // Right-side button
  var cta = (document.body && document.body.dataset.navCta) || 'book';
  var ctaHTML = '';
  if (cta === 'print') {
    ctaHTML = '<button class="btn-print" onclick="window.print()">Print / Save PDF</button>';
  } else if (cta !== 'none') {
    ctaHTML = '<a href="' + base + 'index.html#waitlist" class="btn-nav">Book a call \u2192</a>';
  }

  var hamburger = '<button class="nav-hamburger" aria-label="Menu"'
    + ' onclick="this.closest(\'nav\').querySelector(\'.nav-links\').classList.toggle(\'open\')">'
    + '<span></span><span></span><span></span>'
    + '</button>';

  var navContent =
    '<a href="' + base + 'index.html" class="nav-logo">'
    + '<img src="' + base + 'stacked%20red.svg" alt="Feel the Room" class="nav-logo-img">'
    + '</a>'
    + '<div class="nav-links">' + linksHTML + '</div>'
    + ctaHTML
    + hamburger;

  // Replace existing nav if present, otherwise insert at top of body
  var existing = document.querySelector('nav');
  if (existing) {
    existing.innerHTML = navContent;
  } else {
    var nav = document.createElement('nav');
    nav.innerHTML = navContent;
    document.body.insertBefore(nav, document.body.firstChild);
  }
})();
