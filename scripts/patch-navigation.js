const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

// Helper to normalize and replace in file
function updateFile(relPath, replacer) {
  const fullPath = path.join(root, relPath);
  if (!fs.existsSync(fullPath)) {
    console.log(`Skipping missing file: ${relPath}`);
    return;
  }
  const content = fs.readFileSync(fullPath, 'utf8');
  const isCrlf = content.includes('\r\n');
  const normalized = content.replace(/\r\n/g, '\n');
  let updated = replacer(normalized);
  if (isCrlf) {
    updated = updated.replace(/\r?\n/g, '\r\n');
  }
  if (updated !== content) {
    fs.writeFileSync(fullPath, updated, 'utf8');
    console.log(`Updated: ${relPath}`);
  } else {
    console.log(`No changes made to: ${relPath}`);
  }
}

// =========================================================================
// 1. Update js/portal.js
// =========================================================================
updateFile('js/portal.js', (c) => {
  // Replace mobile toggle setup
  const oldToggle = `    // Mobile sidebar toggle
    const mobileToggle = document.getElementById('mobileSidebarToggle');
    const sidebar = document.getElementById('portalSidebar');
    if (mobileToggle && sidebar) {
      mobileToggle.addEventListener('click', function () {
        sidebar.classList.toggle('mobile-open');
      });
    }`;

  const newToggle = `    // Mobile sidebar controller with backdrop & outside-click support
    const sidebar = document.getElementById('portalSidebar');
    const mobileToggle = document.getElementById('mobileSidebarToggle');

    window.closePortalMobileSidebar = function () {
      const sb = document.getElementById('portalSidebar');
      const bd = document.getElementById('portalBackdrop');
      if (sb) sb.classList.remove('mobile-open');
      if (bd) bd.classList.remove('active');
      document.body.classList.remove('sidebar-open');
    };

    window.openPortalMobileSidebar = function () {
      const sb = document.getElementById('portalSidebar');
      let bd = document.getElementById('portalBackdrop');
      if (!bd) {
        bd = document.createElement('div');
        bd.id = 'portalBackdrop';
        bd.className = 'portal-backdrop';
        document.body.appendChild(bd);
        bd.addEventListener('click', window.closePortalMobileSidebar);
      }
      if (sb) sb.classList.add('mobile-open');
      bd.classList.add('active');
      document.body.classList.add('sidebar-open');
    };

    if (mobileToggle && sidebar) {
      mobileToggle.addEventListener('click', function (e) {
        e.stopPropagation();
        if (sidebar.classList.contains('mobile-open')) {
          window.closePortalMobileSidebar();
        } else {
          window.openPortalMobileSidebar();
        }
      });
    }

    // Sidebar Close Button (X)
    const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');
    if (sidebarCloseBtn) {
      sidebarCloseBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        window.closePortalMobileSidebar();
      });
    }

    // Backdrop click & outside click
    document.addEventListener('click', function (e) {
      const sb = document.getElementById('portalSidebar');
      const mt = document.getElementById('mobileSidebarToggle');
      if (sb && sb.classList.contains('mobile-open')) {
        if (!sb.contains(e.target) && (!mt || !mt.contains(e.target))) {
          window.closePortalMobileSidebar();
        }
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        window.closePortalMobileSidebar();
      }
    });`;

  c = c.replace(oldToggle, newToggle);

  // Replace sidebar navigation items logic
  const oldNav = `    // Sidebar navigation items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      const mainLink = item.querySelector('.nav-link');
      const moduleKey = item.getAttribute('data-module');

      if (mainLink) {
        mainLink.addEventListener('click', function (e) {
          e.preventDefault();
          navigateTo(moduleKey);
          // Toggle subnav on click
          navItems.forEach(other => {
            if (other !== item) other.classList.remove('open');
          });
          item.classList.toggle('open');
        });
      }

      // Sub-links
      const subLinks = item.querySelectorAll('.nav-sub-link');
      subLinks.forEach(sub => {
        sub.addEventListener('click', function (e) {
          e.preventDefault();
          const subKey = sub.getAttribute('data-sub');
          subLinks.forEach(s => s.classList.remove('active'));
          sub.classList.add('active');
          navigateTo(moduleKey, subKey);
        });
      });
    });`;

  const newNav = `    // Sidebar navigation items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      const mainLink = item.querySelector('.nav-link');
      const moduleKey = item.getAttribute('data-module');
      const arrow = item.querySelector('.nav-arrow');
      const subLinks = item.querySelectorAll('.nav-sub-link');

      // Clicking chevron arrow toggles the sub-accordion without closing the drawer
      if (arrow) {
        arrow.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          const wasOpen = item.classList.contains('open');
          navItems.forEach(other => {
            if (other !== item) other.classList.remove('open');
          });
          item.classList.toggle('open', !wasOpen);
        });
      }

      if (mainLink) {
        mainLink.addEventListener('click', function (e) {
          // If clicked specifically on the arrow icon/wrapper, let arrow listener handle it
          if (e.target.closest('.nav-arrow')) return;

          e.preventDefault();
          navigateTo(moduleKey);

          // On mobile/tablet or when sidebar drawer is open, auto-close navigation bar
          const sb = document.getElementById('portalSidebar');
          if (window.innerWidth <= 1024 || (sb && sb.classList.contains('mobile-open'))) {
            if (typeof window.closePortalMobileSidebar === 'function') {
              window.closePortalMobileSidebar();
            }
          } else {
            // Desktop: toggle subnav on click
            navItems.forEach(other => {
              if (other !== item) other.classList.remove('open');
            });
            item.classList.add('open');
          }
        });
      }

      // Sub-links
      subLinks.forEach(sub => {
        sub.addEventListener('click', function (e) {
          e.preventDefault();
          const subKey = sub.getAttribute('data-sub');
          subLinks.forEach(s => s.classList.remove('active'));
          sub.classList.add('active');
          navigateTo(moduleKey, subKey);

          // Always close mobile navigation bar when clicking a sub-link
          const sb = document.getElementById('portalSidebar');
          if (window.innerWidth <= 1024 || (sb && sb.classList.contains('mobile-open'))) {
            if (typeof window.closePortalMobileSidebar === 'function') {
              window.closePortalMobileSidebar();
            }
          }
        });
      });
    });`;

  c = c.replace(oldNav, newNav);

  // In navigateTo, ensure mobile sidebar is closed
  const oldScroll = `    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });`;

  const newScroll = `    // Auto-close mobile navigation bar if open
    const sbNav = document.getElementById('portalSidebar');
    if (window.innerWidth <= 1024 || (sbNav && sbNav.classList.contains('mobile-open'))) {
      if (typeof window.closePortalMobileSidebar === 'function') {
        window.closePortalMobileSidebar();
      }
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });`;

  c = c.replace(oldScroll, newScroll);

  return c;
});

// =========================================================================
// 2. Update js/student.js
// =========================================================================
updateFile('js/student.js', (c) => {
  const oldToggle = `    // Mobile sidebar toggle
    const mobileBtn = document.getElementById('mobileSidebarToggle');
    const sidebar = document.getElementById('portalSidebar');
    if (mobileBtn && sidebar) {
      mobileBtn.addEventListener('click', function () {
        sidebar.classList.toggle('mobile-open');
      });
    }`;

  const newToggle = `    // Mobile sidebar controller with backdrop & outside-click support
    const sidebar = document.getElementById('portalSidebar');
    const mobileBtn = document.getElementById('mobileSidebarToggle');

    window.closeStudentMobileSidebar = function () {
      const sb = document.getElementById('portalSidebar');
      const bd = document.getElementById('portalBackdrop');
      if (sb) sb.classList.remove('mobile-open');
      if (bd) bd.classList.remove('active');
      document.body.classList.remove('sidebar-open');
    };

    window.openStudentMobileSidebar = function () {
      const sb = document.getElementById('portalSidebar');
      let bd = document.getElementById('portalBackdrop');
      if (!bd) {
        bd = document.createElement('div');
        bd.id = 'portalBackdrop';
        bd.className = 'portal-backdrop';
        document.body.appendChild(bd);
        bd.addEventListener('click', window.closeStudentMobileSidebar);
      }
      if (sb) sb.classList.add('mobile-open');
      bd.classList.add('active');
      document.body.classList.add('sidebar-open');
    };

    if (mobileBtn && sidebar) {
      mobileBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (sidebar.classList.contains('mobile-open')) {
          window.closeStudentMobileSidebar();
        } else {
          window.openStudentMobileSidebar();
        }
      });
    }

    const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');
    if (sidebarCloseBtn) {
      sidebarCloseBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        window.closeStudentMobileSidebar();
      });
    }

    document.addEventListener('click', function (e) {
      const sb = document.getElementById('portalSidebar');
      const mb = document.getElementById('mobileSidebarToggle');
      if (sb && sb.classList.contains('mobile-open')) {
        if (!sb.contains(e.target) && (!mb || !mb.contains(e.target))) {
          window.closeStudentMobileSidebar();
        }
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        window.closeStudentMobileSidebar();
      }
    });`;

  c = c.replace(oldToggle, newToggle);

  const oldNav = `    // Sidebar navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      const link = item.querySelector('.nav-link');
      const mod = item.getAttribute('data-module');
      if (link) {
        link.addEventListener('click', function (e) {
          e.preventDefault();
          navigateTo(mod);
          navItems.forEach(o => { if (o !== item) o.classList.remove('open'); });
          item.classList.toggle('open');
        });
      }

      const subLinks = item.querySelectorAll('.nav-sub-link');
      subLinks.forEach(sub => {
        sub.addEventListener('click', function (e) {
          e.preventDefault();
          const subKey = sub.getAttribute('data-sub');
          subLinks.forEach(s => s.classList.remove('active'));
          sub.classList.add('active');
          navigateTo(mod, subKey);
        });
      });
    });`;

  const newNav = `    // Sidebar navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      const link = item.querySelector('.nav-link');
      const mod = item.getAttribute('data-module');
      const arrow = item.querySelector('.nav-arrow');
      const subLinks = item.querySelectorAll('.nav-sub-link');

      if (arrow) {
        arrow.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          const wasOpen = item.classList.contains('open');
          navItems.forEach(o => { if (o !== item) o.classList.remove('open'); });
          item.classList.toggle('open', !wasOpen);
        });
      }

      if (link) {
        link.addEventListener('click', function (e) {
          if (e.target.closest('.nav-arrow')) return;
          e.preventDefault();
          navigateTo(mod);

          const sb = document.getElementById('portalSidebar');
          if (window.innerWidth <= 1024 || (sb && sb.classList.contains('mobile-open'))) {
            if (typeof window.closeStudentMobileSidebar === 'function') {
              window.closeStudentMobileSidebar();
            }
          } else {
            navItems.forEach(o => { if (o !== item) o.classList.remove('open'); });
            item.classList.add('open');
          }
        });
      }

      subLinks.forEach(sub => {
        sub.addEventListener('click', function (e) {
          e.preventDefault();
          const subKey = sub.getAttribute('data-sub');
          subLinks.forEach(s => s.classList.remove('active'));
          sub.classList.add('active');
          navigateTo(mod, subKey);

          const sb = document.getElementById('portalSidebar');
          if (window.innerWidth <= 1024 || (sb && sb.classList.contains('mobile-open'))) {
            if (typeof window.closeStudentMobileSidebar === 'function') {
              window.closeStudentMobileSidebar();
            }
          }
        });
      });
    });`;

  c = c.replace(oldNav, newNav);

  // student navigateTo
  const oldSScroll = `    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });`;

  const newSScroll = `    const sbSNav = document.getElementById('portalSidebar');
    if (window.innerWidth <= 1024 || (sbSNav && sbSNav.classList.contains('mobile-open'))) {
      if (typeof window.closeStudentMobileSidebar === 'function') {
        window.closeStudentMobileSidebar();
      }
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });`;

  c = c.replace(oldSScroll, newSScroll);

  return c;
});

// =========================================================================
// 3. Update js/app.js
// =========================================================================
updateFile('js/app.js', (c) => {
  const oldAppOutside = `    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {`;

  const newAppOutside = `    // Close mobile menu when clicking any navigation link
    const menuLinks = navMenu.querySelectorAll('a:not(.has-dropdown > .nav-link)');
    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 1100 && navMenu.classList.contains('open')) {
          navMenu.classList.remove('open');
          const icon = toggleBtn.querySelector('i');
          if (icon) {
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-xmark');
          }
        }
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {`;

  c = c.replace(oldAppOutside, newAppOutside);

  return c;
});

console.log('CRLF-normalized patch run completed!');
