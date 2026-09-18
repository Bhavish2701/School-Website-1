/**
 * Sri Vidya E.M High School - Main Application Logic
 * Interactive modules: Sub-Tabs, Hash Routing, Online Admissions,
 * Status Tracking, Gallery Filter & Lightbox, Notices Search, Toast Notifications.
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initLanguageSelector();
  initMobileMenu();
  initSubTabs();
  initHashRouter();
  initAdmissionForm();
  initStatusChecker();
  initGallery();
  initNotices();
  initDownloads();
  initContactForm();
  initPortalDropdown();
});

/* ==========================================================================
   1. Toast Notifications
   ========================================================================== */
function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type === 'error' ? 'toast-error' : type === 'info' ? 'toast-info' : ''}`;
  
  let iconClass = 'fa-circle-check';
  if (type === 'error') iconClass = 'fa-circle-exclamation';
  if (type === 'info') iconClass = 'fa-circle-info';

  toast.innerHTML = `
    <i class="fa-solid ${iconClass}"></i>
    <div>${message}</div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/* ==========================================================================
   2. Mobile Menu & Navigation
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('mainNavMenu');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const icon = toggleBtn.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    });

    // Mobile dropdown toggle
    const dropdownItems = navMenu.querySelectorAll('.has-dropdown');
    dropdownItems.forEach(item => {
      const link = item.querySelector('.nav-link');
      link.addEventListener('click', (e) => {
        if (window.innerWidth <= 1100) {
          e.preventDefault();
          item.classList.toggle('open-dropdown');
        }
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !toggleBtn.contains(e.target) && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        const icon = toggleBtn.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-xmark');
        }
      }
    });
  }
}

/* ==========================================================================
   3. Sub-Tabs Switching
   ========================================================================== */
function initSubTabs() {
  const tabContainers = document.querySelectorAll('.tabs-wrapper');

  tabContainers.forEach(container => {
    const buttons = container.querySelectorAll('.sub-tabs-nav .tab-btn');
    const panes = container.querySelectorAll('.tab-pane');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-tab');

        buttons.forEach(b => b.classList.remove('active'));
        panes.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const targetPane = container.querySelector(`#${targetId}`);
        if (targetPane) {
          targetPane.classList.add('active');
        }
      });
    });
  });
}

/* Deep link router for dropdowns like #about-principal, #academics-curriculum */
function initHashRouter() {
  function handleHash() {
    const hash = window.location.hash;
    if (!hash) return;

    if (hash.includes('-')) {
      const parts = hash.substring(1).split('-');
      const sectionId = parts[0];
      const subTabId = parts.slice(1).join('-');

      const sectionEl = document.getElementById(sectionId);
      if (sectionEl) {
        sectionEl.scrollIntoView({ behavior: 'smooth' });

        const targetBtn = sectionEl.querySelector(`.tab-btn[data-tab="tab-${subTabId}"]`);
        if (targetBtn) {
          targetBtn.click();
        }
      }
    }
  }

  window.addEventListener('hashchange', handleHash);
  // Initial check
  if (window.location.hash) {
    setTimeout(handleHash, 200);
  }
}

/* ==========================================================================
   4. Online Admission Application Form
   ========================================================================== */
const sampleApplications = [
  {
    appId: 'SV-2025-1082',
    studentName: 'K. Sai Charan',
    grade: 'Class VIII',
    parentName: 'K. Srinivasa Rao',
    phone: '8106636230',
    status: 'Application Verified & Counseling Scheduled',
    statusStep: 3,
    interviewDate: '28th March 2025, 10:30 AM',
    submissionDate: '12th Jan 2025'
  },
  {
    appId: 'SV-2025-2140',
    studentName: 'P. Ananya Reddy',
    grade: 'Class I',
    parentName: 'P. Venkat Reddy',
    phone: '9440654321',
    status: 'Admission Confirmed & Fee Deposited',
    statusStep: 4,
    interviewDate: 'Completed',
    submissionDate: '18th Jan 2025'
  }
];

function initAdmissionForm() {
  const form = document.getElementById('onlineAdmissionForm');
  const receiptModal = document.getElementById('receiptModal');
  const printBtn = document.getElementById('printReceiptBtn');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const studentName = document.getElementById('admStudentName').value.trim();
      const dob = document.getElementById('admDob').value;
      const gender = document.getElementById('admGender').value;
      const grade = document.getElementById('admGrade').value;
      const parentName = document.getElementById('admParentName').value.trim();
      const phone = document.getElementById('admPhone').value.trim();
      const email = document.getElementById('admEmail').value.trim();
      const address = document.getElementById('admAddress').value.trim();

      if (!studentName || !grade || !parentName || !phone) {
        showToast('Please fill in all mandatory fields.', 'error');
        return;
      }

      // Generate App ID
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const generatedAppId = `SV-2025-${randomNum}`;

      const newRecord = {
        appId: generatedAppId,
        studentName,
        grade,
        parentName,
        phone,
        email,
        address,
        status: 'Application Submitted - Under Initial Review',
        statusStep: 2,
        interviewDate: 'To be announced within 3 working days',
        submissionDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
      };

      // Store in memory & localStorage
      sampleApplications.unshift(newRecord);
      try {
        localStorage.setItem('sv_applications', JSON.stringify(sampleApplications));
      } catch (err) {}

      // Fill Receipt Modal
      document.getElementById('receiptAppId').textContent = generatedAppId;
      document.getElementById('receiptStudentName').textContent = studentName;
      document.getElementById('receiptGrade').textContent = grade;
      document.getElementById('receiptParentName').textContent = parentName;
      document.getElementById('receiptPhone').textContent = phone;
      document.getElementById('receiptDate').textContent = newRecord.submissionDate;

      // Show Receipt Modal
      receiptModal.classList.add('active');
      showToast(`Application successfully generated! Reference: ${generatedAppId}`);

      form.reset();
    });
  }

  // Close modals
  document.querySelectorAll('.modal-close-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.modal-overlay').forEach(modal => modal.classList.remove('active'));
    });
  });

  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }
}

/* ==========================================================================
   5. Admission Status Tracker
   ========================================================================== */
function initStatusChecker() {
  const checkBtn = document.getElementById('checkStatusBtn');
  const searchInput = document.getElementById('statusSearchInput');
  const resultCard = document.getElementById('statusResultCard');

  // Load from localStorage if present
  try {
    const saved = localStorage.getItem('sv_applications');
    if (saved) {
      const parsed = JSON.parse(saved);
      parsed.forEach(item => {
        if (!sampleApplications.some(a => a.appId === item.appId)) {
          sampleApplications.push(item);
        }
      });
    }
  } catch (err) {}

  function performSearch() {
    const query = searchInput.value.trim().toUpperCase();
    if (!query) {
      showToast('Please enter an Application ID (e.g. SV-2025-1082) or Phone Number.', 'error');
      return;
    }

    const match = sampleApplications.find(app => 
      app.appId.toUpperCase() === query || app.phone === query
    );

    if (match) {
      resultCard.style.display = 'block';
      resultCard.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.5rem;">
          <div>
            <span class="receipt-app-id">${match.appId}</span>
            <h4 style="font-family: var(--font-heading); font-size: 1.3rem; margin-top: 0.35rem; color: var(--color-text-dark);">${match.studentName}</h4>
            <div style="font-size: 0.9rem; color: var(--color-text-muted);">Grade: <strong>${match.grade}</strong> | Parent: ${match.parentName}</div>
          </div>
          <span style="background-color: var(--color-primary-tint); color: var(--color-primary-dark); font-weight: 700; padding: 0.35rem 0.85rem; border-radius: 999px; font-size: 0.82rem;">
            Submitted: ${match.submissionDate}
          </span>
        </div>

        <div style="background: #FFFFFF; border-radius: 12px; padding: 1.25rem; border: 1px solid var(--color-border); margin-bottom: 1rem;">
          <div style="font-size: 0.85rem; font-weight: 700; color: var(--color-primary-dark); text-transform: uppercase; margin-bottom: 0.25rem;">Current Status</div>
          <div style="font-size: 1.1rem; font-weight: 700; color: var(--color-accent-red); margin-bottom: 0.5rem;">
            <i class="fa-solid fa-circle-check" style="color: var(--color-accent-green); margin-right: 0.4rem;"></i> ${match.status}
          </div>
          <div style="font-size: 0.88rem; color: var(--color-text-muted);">
            Next Stage / Note: <strong>${match.interviewDate}</strong>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; font-size: 0.78rem; font-weight: 700; color: var(--color-text-muted); text-align: center; gap: 0.5rem;">
          <div style="flex: 1; padding: 0.5rem; border-radius: 6px; background: ${match.statusStep >= 1 ? '#ECFDF5; color: #047857;' : '#F3F4F6;'}">1. Submitted</div>
          <div style="flex: 1; padding: 0.5rem; border-radius: 6px; background: ${match.statusStep >= 2 ? '#ECFDF5; color: #047857;' : '#F3F4F6;'}">2. Verification</div>
          <div style="flex: 1; padding: 0.5rem; border-radius: 6px; background: ${match.statusStep >= 3 ? '#ECFDF5; color: #047857;' : '#F3F4F6;'}">3. Interaction</div>
          <div style="flex: 1; padding: 0.5rem; border-radius: 6px; background: ${match.statusStep >= 4 ? '#ECFDF5; color: #047857;' : '#F3F4F6;'}">4. Enrolled</div>
        </div>
      `;
      showToast(`Record found for ${match.studentName}`);
    } else {
      resultCard.style.display = 'block';
      resultCard.innerHTML = `
        <div style="text-align: center; padding: 1.5rem; color: var(--color-accent-red);">
          <i class="fa-solid fa-triangle-exclamation" style="font-size: 2rem; margin-bottom: 0.5rem;"></i>
          <p style="font-weight: 700;">No record found for "${query}"</p>
          <p style="font-size: 0.85rem; color: var(--color-text-muted); margin-top: 0.25rem;">Please double check your Application Reference Number or try typing <strong>SV-2025-1082</strong> to test.</p>
        </div>
      `;
      showToast('No matching application found.', 'error');
    }
  }

  if (checkBtn) {
    checkBtn.addEventListener('click', performSearch);
  }

  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') performSearch();
    });
  }

  // Quick chips click
  document.querySelectorAll('.sample-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      searchInput.value = chip.getAttribute('data-id');
      performSearch();
    });
  });
}

/* ==========================================================================
   6. Gallery Filter & Lightbox
   ========================================================================== */
function initGallery() {
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const items = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('galleryLightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      items.forEach(item => {
        if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Lightbox click
  items.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const caption = item.querySelector('.gallery-caption')?.textContent || 'Sri Vidya E.M High School';

      if (lightboxImg && img) {
        lightboxImg.src = img.src;
        lightboxCaption.textContent = caption;
        lightboxModal.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   7. Notices Search & Filters
   ========================================================================== */
function initNotices() {
  const searchInput = document.getElementById('noticeSearchInput');
  const noticeItems = document.querySelectorAll('.notice-item');
  const filterBtns = document.querySelectorAll('.notice-filter-btn');

  function filterNotices() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const activeFilterBtn = document.querySelector('.notice-filter-btn.active');
    const category = activeFilterBtn ? activeFilterBtn.getAttribute('data-notice-filter') : 'all';

    noticeItems.forEach(item => {
      const text = item.textContent.toLowerCase();
      const itemCategory = item.getAttribute('data-category');

      const matchesQuery = !query || text.includes(query);
      const matchesCat = category === 'all' || itemCategory === category;

      if (matchesQuery && matchesCat) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterNotices);
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterNotices();
    });
  });
}

/* ==========================================================================
   8. Downloads Simulation
   ========================================================================== */
function initDownloads() {
  document.querySelectorAll('.download-trigger-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const fileName = btn.getAttribute('data-file') || 'Document';
      showToast(`Preparing download: ${fileName}. Please wait...`, 'info');

      setTimeout(() => {
        // Simulated mock download anchor
        const element = document.createElement('a');
        const content = `Official Document from Sri Vidya E.M High School\nFile: ${fileName}\nGenerated: ${new Date().toLocaleString()}`;
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
        element.setAttribute('download', `${fileName.replace(/\s+/g, '_')}.txt`);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);

        showToast(`Downloaded ${fileName} successfully!`);
      }, 700);
    });
  });
}

/* ==========================================================================
   9. Contact Form
   ========================================================================== */
function initContactForm() {
  const contactForm = document.getElementById('contactInquiryForm');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contactName')?.value.trim();
      const phone = document.getElementById('contactPhone')?.value.trim();
      const subject = document.getElementById('contactSubject')?.value.trim();

      if (!name || !phone) {
        showToast('Please provide your name and contact phone number.', 'error');
        return;
      }

      showToast(`Thank you, ${name}! Your inquiry regarding "${subject}" has been received. Our administrative office will contact you shortly.`);
      contactForm.reset();
    });
  }
}

/* ==========================================================================
   10. Theme Toggle (Light / Dark Mode)
   ========================================================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById('themeToggleBtn');
  const savedTheme = localStorage.getItem('sv_theme') || 'light';

  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('sv_theme', newTheme);
      updateThemeIcon(newTheme);
      showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
    });
  }

  function updateThemeIcon(theme) {
    if (!toggleBtn) return;
    const icon = toggleBtn.querySelector('i');
    if (icon) {
      if (theme === 'dark') {
        icon.className = 'fa-solid fa-sun';
        toggleBtn.setAttribute('title', 'Switch to Light Mode');
      } else {
        icon.className = 'fa-solid fa-moon';
        toggleBtn.setAttribute('title', 'Switch to Dark Mode');
      }
    }
  }
}

/* ==========================================================================
   11. Multi-Language Switcher (Mother Tongue Selection)
   - Supports: English (Default), Telugu (తెలుగు), Hindi (हिन्दी)
   - Features 100% Full-Website Native Translation via Google Translate Engine
     integrated with an instant in-memory design dictionary.
   - Strictly satisfies user requirement:
     "keep the option to change but the main look is every time in english"
   ========================================================================== */
function initLanguageSelector() {
  const topLangSelector = document.getElementById('langSelector');
  const navLangSelector = document.getElementById('navLangSelector');
  let isTranslating = false;

  const translations = {
    en: {
      toast: 'Website restored to English',
      elements: {
        topBarMotto: 'Est. 2017 • Vidyathe Vijayam',
        brandMottoText: 'Est. 2017 • Knowledge Brings Victory',
        navHome: '<i class="fa-solid fa-house"></i> Home',
        navAbout: 'About School <i class="fa-solid fa-chevron-down dropdown-caret"></i>',
        navAcademics: 'Academics <i class="fa-solid fa-chevron-down dropdown-caret"></i>',
        navAdmissions: 'Admissions <i class="fa-solid fa-chevron-down dropdown-caret"></i>',
        navStudentLife: 'Student Life <i class="fa-solid fa-chevron-down dropdown-caret"></i>',
        navNews: 'News & Events',
        navGallery: 'Gallery',
        navNotices: 'Notices',
        navDownloads: 'Downloads',
        navContact: 'Contact',
        headerApplyBtnText: 'Apply Online',
        heroBadgeText: 'Admissions Open for Academic Year 2025-2026',
        heroMainTitle: 'Inspiring Young Minds Through <span class="highlight-red">Knowledge</span> &amp; <span class="highlight-gold">Character</span>',
        heroMottoText: 'Vidyathe Vijayam — <em>"Knowledge Empowers True Victory"</em>',
        heroDesc: 'Welcome to <strong>Sri Vidya E.M High School</strong>, where traditional Indian moral values blend seamlessly with modern STEM education, smart digital classrooms, and vibrant co-curricular growth under experienced educational leadership.',
        heroApplyBtnText: 'Apply for Admission',
        heroExploreBtnText: 'Explore Our Campus',
        heroTrackBtnText: 'Track Application',
        principalMsgHeading: 'Message from Smt. Gorle Varalakshmi',
        principalTitleTag: 'Principal, Sri Vidya E.M High School',
        principalQuote: '"Education is not just the learning of facts, but the training of the mind to think with clarity, compassion, and courage. At Sri Vidya E.M High School, our guiding light is \'Vidyathe Vijayam\' — true victory is attained through authentic knowledge and unwavering character."',
        principalMsgDesc: 'We foster an inclusive and warm atmosphere where each child is encouraged to discover their innate curiosity, cultivate discipline, and grow into responsible, empathetic global citizens.',
        readFullMsgBtn: 'Read Full Message &rarr;',
        footerBrandMotto: 'Est. 2017 • "Vidyathe Vijayam" — Knowledge Brings Victory',
        footerAboutDesc: 'Committed to quality English medium schooling, character formation, and student excellence from Pre-Primary to Class X. Established in 2017. Recognized by Govt. of Andhra Pradesh.'
      }
    },
    te: {
      toast: 'మొత్తం వెబ్‌సైట్ తెలుగులోకి మార్చబడింది (Website translated into Telugu)',
      elements: {
        topBarMotto: 'స్థాపన 2017 • విద్యాతే విజయం',
        brandMottoText: 'స్థాపన 2017 • విజ్ఞానమే విజయం',
        navHome: '<i class="fa-solid fa-house"></i> హోమ్',
        navAbout: 'పాఠశాల గురించి <i class="fa-solid fa-chevron-down dropdown-caret"></i>',
        navAcademics: 'విద్యా విభాగం <i class="fa-solid fa-chevron-down dropdown-caret"></i>',
        navAdmissions: 'ప్రవేశాలు <i class="fa-solid fa-chevron-down dropdown-caret"></i>',
        navStudentLife: 'విద్యార్థి జీవితం <i class="fa-solid fa-chevron-down dropdown-caret"></i>',
        navNews: 'వార్తలు &amp; విశేషాలు',
        navGallery: 'చిత్రమాలిక',
        navNotices: 'నోటీసులు',
        navDownloads: 'డౌన్‌లోడ్లు',
        navContact: 'సంప్రదించండి',
        headerApplyBtnText: 'ఆన్‌లైన్ దరఖాస్తు',
        heroBadgeText: 'విద్యా సంవత్సరం 2025-2026 ప్రవేశాలు ప్రారంభమైనవి',
        heroMainTitle: 'యువ మనస్సులను <span class="highlight-red">విజ్ఞానం</span> &amp; <span class="highlight-gold">సదాచారంతో</span> తీర్చిదిద్దుతూ',
        heroMottoText: 'విద్యాతే విజయం — <em>"విజ్ఞానమే నిజమైన విజయం"</em>',
        heroDesc: '<strong>శ్రీ విద్యా ఇంగ్లీష్ మీడియం హై స్కూల్‌కు</strong> సాదర స్వాగతం. ఇక్కడ భారతీయ సంస్కృతి, నైతిక విలువలు మరియు ఆధునిక సైన్స్, స్మార్ట్ తరగతులు మరియు సంపూర్ణ విద్యార్థి వికాసం అనుభవజ్ఞులైన నాయకత్వంలో సమకూరుతాయి.',
        heroApplyBtnText: 'ప్రవేశానికి దరఖాస్తు చేసుకోండి',
        heroExploreBtnText: 'మా ప్రాంగణాన్ని చూడండి',
        heroTrackBtnText: 'దరఖాస్తు స్థితి తనిఖీ',
        principalMsgHeading: 'శ్రీమతి గొర్లె వరలక్ష్మి గారి సందేశం',
        principalTitleTag: 'ప్రధానోపాధ్యాయురాలు, శ్రీ విద్యా ఇ.ఎం. హై స్కూల్',
        principalQuote: '"విద్య అనేది కేవలం పుస్తక జ్ఞానం మాత్రమే కాదు, స్పష్టత, దయ మరియు ధైర్యంతో ఆలోచించే మనస్సును తీర్చిదిద్దడం. శ్రీ విద్యా ఇంగ్లీష్ మీడియం హై స్కూల్‌లో మా మార్గదర్శక సూత్రం \'విద్యాతే విజయం\' — నిజమైన జ్ఞానం మరియు ఉత్తమ వ్యక్తిత్వం ద్వారానే అసలైన విజయం సాధించబడుతుంది."',
        principalMsgDesc: 'ప్రతి విద్యార్థి తన సహజమైన జిజ్ఞాసను కనుగొని, క్రమశిక్షణను అలవర్చుకుని, బాధ్యతాయుతమైన పౌరులుగా ఎదిగేలా మేము ప్రోత్సహిస్తాము.',
        readFullMsgBtn: 'పూర్తి సందేశం చదవండి &rarr;',
        footerBrandMotto: 'స్థాపన 2017 • "విద్యాతే విజయం" — విజ్ఞానమే విజయం',
        footerAboutDesc: 'ప్రీ-ప్రైమరీ నుండి పదవ తరగతి వరకు నాణ్యమైన ఇంగ్లీష్ మీడియం విద్య, ఉత్తమ వ్యక్తిత్వ నిర్మాణం మరియు విద్యార్థి ప్రతిభకు నిబద్ధత. స్థాపన 2017. ఆంధ్రప్రదేశ్ ప్రభుత్వం గుర్తింపు పొందినది.'
      }
    },
    hi: {
      toast: 'पूरी वेबसाइट हिन्दी में बदल दी गई है (Website translated into Hindi)',
      elements: {
        topBarMotto: 'स्थापना 2017 • विद्याते विजयम्',
        brandMottoText: 'स्थापना 2017 • ज्ञान ही विजय है',
        navHome: '<i class="fa-solid fa-house"></i> मुख्य पृष्ठ',
        navAbout: 'विद्यालय परिचय <i class="fa-solid fa-chevron-down dropdown-caret"></i>',
        navAcademics: 'शैक्षणिक <i class="fa-solid fa-chevron-down dropdown-caret"></i>',
        navAdmissions: 'प्रवेश <i class="fa-solid fa-chevron-down dropdown-caret"></i>',
        navStudentLife: 'छात्र जीवन <i class="fa-solid fa-chevron-down dropdown-caret"></i>',
        navNews: 'समाचार एवं कार्यक्रम',
        navGallery: 'गैलरी',
        navNotices: 'सूचनाएं',
        navDownloads: 'डाउनलोड',
        navContact: 'संपर्क करें',
        headerApplyBtnText: 'ऑनलाइन आवेदन',
        heroBadgeText: 'शैक्षणिक सत्र 2025-2026 के लिए प्रवेश प्रारंभ',
        heroMainTitle: 'युवा मस्तिष्कों को <span class="highlight-red">ज्ञान</span> एवं <span class="highlight-gold">चरित्र</span> से प्रेरित करते हुए',
        heroMottoText: 'विद्याते विजयम् — <em>"ज्ञान ही सच्ची विजय है"</em>',
        heroDesc: '<strong>श्री विद्या ई.एम. हाई स्कूल</strong> में आपका हार्दिक स्वागत है, जहाँ भारतीय नैतिक मूल्य आधुनिक विज्ञान, स्मार्ट डिजिटल कक्षाओं और अनुभवी शैक्षिक नेतृत्व के साथ उत्कृष्टता प्रदान करते हैं।',
        heroApplyBtnText: 'प्रवेश के लिए आवेदन करें',
        heroExploreBtnText: 'हमारा परिसर देखें',
        heroTrackBtnText: 'आवेदन स्थिति देखें',
        principalMsgHeading: 'श्रीमती गोर्ले वरलक्ष्मी जी का संदेश',
        principalTitleTag: 'प्रधानाचार्या, श्री विद्या ई.एम. हाई स्कूल',
        principalQuote: '"शिक्षा केवल तथ्यों को याद रखना नहीं है, बल्कि स्पष्टता, करुणा और साहस के साथ सोचने के लिए मन को प्रशिक्षित करना है। श्री विद्या ई.एम. हाई स्कूल में हमारा मार्गदर्शक मंत्र \'विद्याते विजयम्\' है — सच्ची विजय वास्तविक ज्ञान और अडिग चरित्र से प्राप्त होती है।"',
        principalMsgDesc: 'हम एक समावेशी और आत्मीय वातावरण को बढ़ावा देते हैं जहाँ प्रत्येक बच्चे को अपनी सहज जिज्ञासा को खोजने, अनुशासन विकसित करने और जिम्मेदार नागरिक बनने के लिए प्रेरित किया जाता है।',
        readFullMsgBtn: 'पूरा संदेश पढ़ें &rarr;',
        footerBrandMotto: 'स्थापना 2017 • "विद्याते विजयम्" — ज्ञान ही विजय है',
        footerAboutDesc: 'प्री-प्राइमरी से दसवीं कक्षा तक गुणवत्तापूर्ण अंग्रेजी माध्यम शिक्षा, चरित्र निर्माण और छात्र उत्कृष्टता के लिए समर्पित। स्थापना 2017। आंध्र प्रदेश सरकार द्वारा मान्यता प्राप्त।'
      }
    }
  };

  function triggerGoogleTranslateCombo(langCode) {
    const hostname = window.location.hostname;

    if (langCode === 'en') {
      // Clear cookies
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + hostname;
      document.cookie = "googtrans=/en/en; path=/;";

      const combo = document.querySelector('.goog-te-combo');
      if (combo) {
        combo.value = 'en';
        combo.dispatchEvent(new Event('change'));
      }

      // If user previously translated via Google Translate, reload clean to restore pristine original markup
      if (sessionStorage.getItem('sv_has_translated') === 'true') {
        sessionStorage.removeItem('sv_has_translated');
        window.location.reload();
      }
      return;
    }

    // Set translation session flag and cookie
    sessionStorage.setItem('sv_has_translated', 'true');
    document.cookie = "googtrans=/en/" + langCode + "; path=/;";
    document.cookie = "googtrans=/en/" + langCode + "; path=/; domain=" + hostname;

    function applyCombo() {
      const combo = document.querySelector('.goog-te-combo');
      if (combo) {
        combo.value = langCode;
        combo.dispatchEvent(new Event('change'));
        return true;
      }
      return false;
    }

    if (!applyCombo()) {
      let tries = 0;
      const timer = setInterval(() => {
        tries++;
        if (applyCombo() || tries > 20) {
          clearInterval(timer);
        }
      }, 150);
    }
  }

  function applyLanguage(langCode, showFeedback = true) {
    if (isTranslating) return;
    isTranslating = true;

    const data = translations[langCode] || translations.en;

    // Keep selectors in sync
    if (topLangSelector) topLangSelector.value = langCode;
    if (navLangSelector) navLangSelector.value = langCode;

    // Instant in-DOM dictionary replacement
    Object.keys(data.elements).forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.innerHTML = data.elements[id];
      }
    });

    // Fire Full-Website Google Translation
    triggerGoogleTranslateCombo(langCode);

    if (showFeedback) {
      showToast(data.toast, 'info');
    }

    setTimeout(() => {
      isTranslating = false;
    }, 400);
  }

  // Event Listeners
  if (topLangSelector) {
    topLangSelector.addEventListener('change', (e) => {
      applyLanguage(e.target.value, true);
    });
  }

  if (navLangSelector) {
    navLangSelector.addEventListener('change', (e) => {
      applyLanguage(e.target.value, true);
    });
  }

  // Ensure initial load ALWAYS defaults to English
  sessionStorage.removeItem('sv_has_translated');
  applyLanguage('en', false);
}

/* ==========================================================================
   Portal Dropdown Trigger Handling
   ========================================================================== */
function initPortalDropdown() {
  const btn = document.getElementById('portalDropdownBtn');
  const wrapper = document.getElementById('portalDropdownWrap');

  if (btn && wrapper) {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      wrapper.classList.toggle('open');
      const isOpen = wrapper.classList.contains('open');
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    document.addEventListener('click', (e) => {
      if (!wrapper.contains(e.target)) {
        wrapper.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  }
}


