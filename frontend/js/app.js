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

    // Close mobile menu when clicking any navigation link
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

      // Submit to Express REST backend
      if (window.ApiClient) {
        window.ApiClient.admissions.submitApplication({
          studentName,
          dob: dob || '2015-05-15',
          gender: gender || 'Male',
          applyingClass: grade.replace(/\D/g, '') || '1',
          academicYear: '2025-2026',
          parentName,
          phone,
          email,
          address
        }).then(res => {
          if (res && res.data) {
            const realAppNo = res.data.applicationNumber || generatedAppId;
            document.getElementById('receiptAppId').textContent = realAppNo;
            newRecord.appId = realAppNo;
            localStorage.setItem('sv_applications', JSON.stringify(sampleApplications));
            showToast(`Application successfully registered on server! Ref: ${realAppNo}`, 'success');
          }
        }).catch(err => {
          console.warn('[submitApplication API error]:', err.message);
        });
      }

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

  async function performSearch() {
    const query = searchInput.value.trim().toUpperCase();
    if (!query) {
      showToast('Please enter an Application ID (e.g. SV-2025-1082) or Phone Number.', 'error');
      return;
    }

    const match = sampleApplications.find(app => 
      app.appId.toUpperCase() === query || app.phone === query
    );

    // If ApiClient is available and we have an application id and phone from match or query
    if (window.ApiClient && match && match.appId && match.phone) {
      try {
        const liveRes = await window.ApiClient.admissions.checkStatus(match.appId, match.phone);
        if (liveRes && liveRes.data) {
          const liveData = liveRes.data;
          match.status = liveData.status || match.status;
          if (liveData.reviewerRemarks) {
            match.interviewDate = liveData.reviewerRemarks;
          }
          if (liveData.status === 'APPROVED') match.statusStep = 4;
          else if (liveData.status === 'UNDER_REVIEW' || liveData.status === 'DOCUMENT_VERIFICATION') match.statusStep = 3;
          else if (liveData.status === 'SUBMITTED') match.statusStep = 2;
        }
      } catch (err) {
        console.warn('[Admissions checkStatus API notice]:', err.message);
      }
    }

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
   8. Notice & Document Modal Viewer System
   ========================================================================== */
const NOTICE_DOCUMENTS_DATABASE = {
  'admissions-circular': {
    id: 'admissions-circular',
    fileName: 'Admissions_Notification_2025-26.pdf',
    badge: 'Official Administrative Circular',
    badgeClass: 'tag-urgent',
    ref: 'SVEM/ADM/2025-26/CIR-01',
    date: '15th October 2025',
    title: 'Notification for Pre-Primary to Class X Enrollment (Academic Year 2025-26)',
    authority: 'Office of the Principal, Sri Vidya E.M High School',
    renderHtml: () => `
      <div class="notice-doc-wrapper">
        <div class="notice-doc-header">
          <img src="assets/images/school-logo.jpg" alt="Sri Vidya Logo">
          <div class="notice-doc-header-text">
            <h3>SRI VIDYA E.M HIGH SCHOOL</h3>
            <div class="school-motto">"Vidyathe Vijayam" — Knowledge Brings Victory</div>
            <div class="school-sub">Recognized by Govt. of Andhra Pradesh • English Medium Co-Educational Institution (Est. 2017)</div>
          </div>
        </div>

        <div class="notice-doc-meta-bar">
          <div class="notice-doc-meta-item"><strong>Ref No:</strong> SVEM/ADM/2025-26/CIR-01</div>
          <div class="notice-doc-meta-item"><strong>Date:</strong> 15th October 2025</div>
          <div class="notice-doc-meta-item"><span class="notice-info-tag tag-urgent">Admissions Open 2025-26</span></div>
        </div>

        <h4 class="notice-doc-title">Notification for Pre-Primary (LKG/UKG) to Class X Admissions</h4>

        <p class="notice-doc-lead">
          Sri Vidya E.M High School cordially invites prospective parents and guardians to register their wards for the upcoming Academic Session 2025-26. Our curriculum harmoniously blends state-board academic rigor with modern digital learning, moral character cultivation, and holistic child development.
        </p>

        <div class="notice-doc-callout academic">
          <strong><i class="fa-solid fa-bullhorn"></i> Online & Walk-in Enrollment Window:</strong>
          Registration commences on <strong>15th October 2025</strong> and remains open until quota capacity is reached. Parents can apply directly through our online portal or visit the school admissions desk during working hours.
        </div>

        <h5 style="font-family: var(--font-heading); font-size: 1.05rem; margin: 1.25rem 0 0.5rem; color: var(--color-primary-dark);">1. Classes & Age Eligibility (as on 31st May 2025)</h5>
        <div class="notice-table-responsive">
          <table class="notice-table">
            <thead>
              <tr>
                <th>Class / Grade</th>
                <th>Age Requirement</th>
                <th>Admission Mode</th>
                <th>Available Seats</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>LKG & UKG</strong></td>
                <td>3+ to 4+ Years</td>
                <td>Parent Informal Interaction</td>
                <td>Limited (30 Seats/Sec)</td>
              </tr>
              <tr>
                <td><strong>Class 1 to 5 (Primary)</strong></td>
                <td>5+ to 9+ Years</td>
                <td>Diagnostic Assessment & Interview</td>
                <td>Open (Subject to vacancy)</td>
              </tr>
              <tr>
                <td><strong>Class 6 to 9 (Middle)</strong></td>
                <td>10+ to 13+ Years</td>
                <td>Academic Verification & Merit Test</td>
                <td>Open</td>
              </tr>
              <tr>
                <td><strong>Class 10 (SSC Board)</strong></td>
                <td>14+ Years</td>
                <td>TC & Prior Board Eligibility Check</td>
                <td>Restricted Selection</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h5 style="font-family: var(--font-heading); font-size: 1.05rem; margin: 1.25rem 0 0.5rem; color: var(--color-primary-dark);">2. Mandatory Documents Checklist</h5>
        <ul class="notice-doc-list">
          <li><i class="fa-solid fa-circle-check"></i> Original Birth Certificate issued by Municipal Corporation / Gram Panchayat (+ 2 self-attested copies).</li>
          <li><i class="fa-solid fa-circle-check"></i> Student's Aadhar Card and Parents' / Guardians' Aadhar Cards.</li>
          <li><i class="fa-solid fa-circle-check"></i> 4 recent colored passport-size photographs of the student.</li>
          <li><i class="fa-solid fa-circle-check"></i> Original Transfer Certificate (TC) & previous academic progress card (for Class 2 and above).</li>
          <li><i class="fa-solid fa-circle-check"></i> Caste & Income Certificate (if claiming government scholarship/welfare entitlements).</li>
        </ul>

        <div class="notice-doc-callout urgent">
          <strong><i class="fa-solid fa-headset"></i> Admissions Desk & Helpline:</strong><br>
          • <strong>Campus Walk-ins & Offline Inquiries:</strong> Sri Navva Anand (Vice Principal): <a href="tel:+919398578584" style="color: #991B1B; font-weight: 700;">+91 93985 78584</a><br>
          • <strong>School Reception & Principal's Appointments:</strong> <a href="tel:8106636230" style="color: #991B1B; font-weight: 700;">8106636230</a> / <a href="tel:9966422096" style="color: #991B1B; font-weight: 700;">9966422096</a> (Mon–Sat: 8:30 AM – 5:30 PM)<br>
          • <strong>Official Email:</strong> srividyaschools2017@gmail.com
        </div>

        <div class="notice-doc-sign-block">
          <div class="notice-doc-sign-seal">
            <div class="notice-doc-sign-seal-circle">OFFICIAL<br>SEAL<br>2025</div>
            <div>
              <strong>Sri Vidya E.M High School</strong><br>
              Administrative Secretariat
            </div>
          </div>
          <div class="notice-doc-sign-person">
            <div class="sign-title">Smt. Gorle Varalakshmi</div>
            <div class="sign-dept">Principal, Sri Vidya E.M High School</div>
          </div>
        </div>
      </div>
    `,
    extraAction: `
      <button type="button" class="btn btn-red" onclick="window.applyAdmissionFromNotice()">
        <i class="fa-solid fa-paper-plane"></i> Apply Online Now
      </button>
    `
  },

  'exam-timetable': {
    id: 'exam-timetable',
    fileName: 'SA1_Timetable_Portions_2025.pdf',
    badge: 'Examination Schedule & Syllabus Portions',
    badgeClass: 'tag-urgent',
    ref: 'SVEM/EXAM/2025-26/SA1-008',
    date: '28th October 2025',
    title: 'Summative Assessment-1 (SA-1) Timetable & Syllabus Weightage for Classes I to X',
    authority: 'Examination Cell, Sri Vidya E.M High School',
    renderHtml: () => `
      <div class="notice-doc-wrapper">
        <div class="notice-doc-header">
          <img src="assets/images/school-logo.jpg" alt="Sri Vidya Logo">
          <div class="notice-doc-header-text">
            <h3>SRI VIDYA E.M HIGH SCHOOL</h3>
            <div class="school-motto">"Vidyathe Vijayam" — Knowledge Brings Victory</div>
            <div class="school-sub">Annual Summative Assessment-1 Schedule • Academic Year 2025-26</div>
          </div>
        </div>

        <div class="notice-doc-meta-bar">
          <div class="notice-doc-meta-item"><strong>Exam Code:</strong> SA1-TERM1-2025</div>
          <div class="notice-doc-meta-item"><strong>Date:</strong> 28th October 2025</div>
          <div class="notice-doc-meta-item"><span class="notice-info-tag tag-urgent">Examinations</span></div>
        </div>

        <h4 class="notice-doc-title">Summative Assessment (SA-1) Timetable & Portions</h4>

        <p class="notice-doc-lead">
          The Summative Assessment-1 (SA-1) for Classes I to X is scheduled to be held from <strong>03rd November 2025 to 08th November 2025</strong>. All students are directed to thoroughly prepare according to the class-wise syllabus portions specified below.
        </p>

        <div class="notice-doc-callout academic">
          <strong><i class="fa-solid fa-clock"></i> Examination Timings:</strong><br>
          • <strong>Classes I to V:</strong> 09:30 AM to 12:00 PM (2 hrs 30 mins)<br>
          • <strong>Classes VI to X:</strong> 09:30 AM to 12:30 PM (Includes 15 mins reading time: 09:30 AM – 09:45 AM)
        </div>

        <div class="notice-table-responsive">
          <table class="notice-table">
            <thead>
              <tr>
                <th>Date & Day</th>
                <th>Primary (Class 1 - 5)</th>
                <th>Middle (Class 6 - 8)</th>
                <th>High School (Class 9 - 10)</th>
                <th>Portions / Topics Covered</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>03-11-2025<br>(Monday)</strong></td>
                <td>First Language (Telugu / Hindi)</td>
                <td>First Language (Telugu / Hindi)</td>
                <td>First Language (Telugu / Hindi)</td>
                <td>Lessons 1 to 4, Grammar & Vyakaranam</td>
              </tr>
              <tr>
                <td><strong>04-11-2025<br>(Tuesday)</strong></td>
                <td>Second Language (Telugu / Hindi)</td>
                <td>Second Language (Telugu / Hindi)</td>
                <td>Second Language (Telugu / Hindi)</td>
                <td>Lessons 1 to 3, Vocabulary, Creative Writing</td>
              </tr>
              <tr>
                <td><strong>05-11-2025<br>(Wednesday)</strong></td>
                <td>English (Reader & Grammar)</td>
                <td>English Paper-I (Language)</td>
                <td>English Paper-I & II (Literature & Composition)</td>
                <td>Prose, Poetry, Comprehension, Letter Writing</td>
              </tr>
              <tr>
                <td><strong>06-11-2025<br>(Thursday)</strong></td>
                <td>Mathematics</td>
                <td>Mathematics</td>
                <td>Mathematics (Paper-I & II)</td>
                <td>Numbers, Algebra, Geometry, Arithmetic Basics</td>
              </tr>
              <tr>
                <td><strong>07-11-2025<br>(Friday)</strong></td>
                <td>Environmental Studies (EVS)</td>
                <td>General Science</td>
                <td>Physical Science & Biological Science</td>
                <td>Units 1 to 5, Diagrams, Lab Experiments</td>
              </tr>
              <tr>
                <td><strong>08-11-2025<br>(Saturday)</strong></td>
                <td>Computer & General Knowledge</td>
                <td>Social Studies</td>
                <td>Social Studies (History, Civics, Geography)</td>
                <td>Term-1 Lessons & Map Pointing Skills</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h5 style="font-family: var(--font-heading); font-size: 1.05rem; margin: 1.25rem 0 0.5rem; color: var(--color-primary-dark);">Important Instructions for Candidates</h5>
        <ul class="notice-doc-list">
          <li><i class="fa-solid fa-triangle-exclamation"></i> Students must be seated in their designated examination hall by 09:15 AM sharp.</li>
          <li><i class="fa-solid fa-id-card"></i> School ID card and official Hall Ticket are strictly mandatory for entry.</li>
          <li><i class="fa-solid fa-pen-ruler"></i> Students must carry their own stationery in transparent pouches. No borrowing will be entertained.</li>
          <li><i class="fa-solid fa-circle-check"></i> Answer booklets verification will take place in the following week before marks entry.</li>
        </ul>

        <div class="notice-doc-sign-block">
          <div class="notice-doc-sign-seal">
            <div class="notice-doc-sign-seal-circle">EXAM<br>CELL<br>VERIFIED</div>
            <div>
              <strong>Controller of Examinations</strong><br>
              Academic Assessment Committee
            </div>
          </div>
          <div class="notice-doc-sign-person">
            <div class="sign-title">Sri Navva Anand</div>
            <div class="sign-dept">Vice Principal & Academic Coordinator</div>
          </div>
        </div>
      </div>
    `
  },

  'ptm-schedule': {
    id: 'ptm-schedule',
    fileName: 'PTM_Schedule_November_2025.pdf',
    badge: 'Parent-Teacher Council',
    badgeClass: 'tag-academic',
    ref: 'SVEM/PTM/2025-26/03',
    date: '05th November 2025',
    title: 'Parent-Teacher Conference (PTM) Schedule & Formative Progress Review',
    authority: 'Parent Council & Student Welfare Board',
    renderHtml: () => `
      <div class="notice-doc-wrapper">
        <div class="notice-doc-header">
          <img src="assets/images/school-logo.jpg" alt="Sri Vidya Logo">
          <div class="notice-doc-header-text">
            <h3>SRI VIDYA E.M HIGH SCHOOL</h3>
            <div class="school-motto">"Vidyathe Vijayam" — Knowledge Brings Victory</div>
            <div class="school-sub">Parent-Teacher Conference (PTM) • Collaborative Academic Review</div>
          </div>
        </div>

        <div class="notice-doc-meta-bar">
          <div class="notice-doc-meta-item"><strong>Circular Ref:</strong> SVEM/PTM/2025-26/03</div>
          <div class="notice-doc-meta-item"><strong>Date:</strong> 05th November 2025</div>
          <div class="notice-doc-meta-item"><span class="notice-info-tag tag-academic">Parent Council</span></div>
        </div>

        <h4 class="notice-doc-title">Parent-Teacher Conference (PTM) Schedule</h4>

        <p class="notice-doc-lead">
          Dear Parents and Guardians, we cordially invite you to the upcoming <strong>Parent-Teacher Conference</strong> on <strong>Saturday, 08th November 2025</strong>. This meeting offers a dedicated opportunity to review your child's formative assessments, attendance percentage, classroom engagement, and personalized growth path.
        </p>

        <div class="notice-doc-callout success">
          <strong><i class="fa-solid fa-location-dot"></i> Meeting Venue:</strong> Respective Classrooms and Smart Lecture Halls, Main Campus Building.<br>
          <strong>Date:</strong> Saturday, 08th November 2025 (Staggered class time-slots).
        </div>

        <div class="notice-table-responsive">
          <table class="notice-table">
            <thead>
              <tr>
                <th>Grade / Section</th>
                <th>Time Slot</th>
                <th>Venue / Room</th>
                <th>Faculty In-Charge</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Pre-Primary (LKG & UKG)</strong></td>
                <td>09:00 AM – 10:30 AM</td>
                <td>Kindergarten Wing (Ground Floor)</td>
                <td>Mrs. K. Swathi & Smt. V. Lakshmi</td>
              </tr>
              <tr>
                <td><strong>Primary (Class 1 to 5)</strong></td>
                <td>10:30 AM – 12:30 PM</td>
                <td>Primary Wing (First Floor)</td>
                <td>Mrs. T. Radha & Primary Teaching Roster</td>
              </tr>
              <tr>
                <td><strong>Middle School (Class 6 to 8)</strong></td>
                <td>01:30 PM – 03:00 PM</td>
                <td>Middle School Hall (Second Floor)</td>
                <td>Ms. Anjali (8A) & Science / Math Faculty</td>
              </tr>
              <tr>
                <td><strong>High School (Class 9 & 10)</strong></td>
                <td>03:00 PM – 04:30 PM</td>
                <td>Auditorium Hall #2</td>
                <td>Sri Navva Anand & Senior Board Instructors</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h5 style="font-family: var(--font-heading); font-size: 1.05rem; margin: 1.25rem 0 0.5rem; color: var(--color-primary-dark);">Discussion Agenda for Parents</h5>
        <ul class="notice-doc-list">
          <li><i class="fa-solid fa-chart-line"></i> One-on-one discussion on student formative performance cards and mid-term marks.</li>
          <li><i class="fa-solid fa-clock-rotate-left"></i> Review of attendance records and punctual arrival in morning assemblies.</li>
          <li><i class="fa-solid fa-language"></i> Spoken English confidence, handwriting neatness, and notebook completion.</li>
          <li><i class="fa-solid fa-hand-holding-heart"></i> Individual guidance on moral character, screen time balance, and homework routine.</li>
        </ul>

        <div class="notice-doc-callout urgent">
          <strong>Advisory Note for Parents:</strong>
          Please bring your ward's official School Diary. To maintain personal attention for each parent, please adhere strictly to your class time slot.
        </div>

        <div class="notice-doc-sign-block">
          <div class="notice-doc-sign-seal">
            <div class="notice-doc-sign-seal-circle">PARENT<br>COUNCIL<br>2025</div>
            <div>
              <strong>Parent-Teacher Association</strong><br>
              Sri Vidya E.M High School
            </div>
          </div>
          <div class="notice-doc-sign-person">
            <div class="sign-title">Smt. Gorle Varalakshmi</div>
            <div class="sign-dept">Principal & Academic Chair</div>
          </div>
        </div>
      </div>
    `
  },

  'sports-day': {
    id: 'sports-day',
    fileName: 'Childrens_Day_Program_Details.pdf',
    badge: 'Celebration & Annual Sports',
    badgeClass: 'tag-general',
    ref: 'SVEM/EVENT/2025-26/07',
    date: '12th November 2025',
    title: "Children's Day Carnival & Annual Sports Day Celebration Itinerary",
    authority: 'Physical Education Department & Cultural Committee',
    renderHtml: () => `
      <div class="notice-doc-wrapper">
        <div class="notice-doc-header">
          <img src="assets/images/school-logo.jpg" alt="Sri Vidya Logo">
          <div class="notice-doc-header-text">
            <h3>SRI VIDYA E.M HIGH SCHOOL</h3>
            <div class="school-motto">"Vidyathe Vijayam" — Knowledge Brings Victory</div>
            <div class="school-sub">Children's Day Carnival & Annual Athletic Meet 2025</div>
          </div>
        </div>

        <div class="notice-doc-meta-bar">
          <div class="notice-doc-meta-item"><strong>Event Notice:</strong> SVEM/EVENT/2025-26/07</div>
          <div class="notice-doc-meta-item"><strong>Date:</strong> 12th November 2025</div>
          <div class="notice-doc-meta-item"><span class="notice-info-tag tag-general">Celebration</span></div>
        </div>

        <h4 class="notice-doc-title">Children's Day & Annual Sports Day Celebration</h4>

        <p class="notice-doc-lead">
          We are pleased to celebrate <strong>Children's Day & Annual Sports Day</strong> on <strong>Friday, 14th November 2025</strong> at the school playground and open-air auditorium. The entire day is dedicated to athletics, team sports, traditional games, cultural tributes, and wholesome camaraderie.
        </p>

        <div class="notice-doc-callout success">
          <strong><i class="fa-solid fa-trophy"></i> Championship Motto:</strong> <em>"Champions in Character, Champions on the Field!"</em><br>
          <strong>Venue:</strong> Sri Vidya Main Sports Grounds & Auditorium • <strong>Dress:</strong> House Sports Uniform & Canvas Shoes.
        </div>

        <h5 style="font-family: var(--font-heading); font-size: 1.05rem; margin: 1.25rem 0 0.5rem; color: var(--color-primary-dark);">Official Event Schedule (14th November 2025)</h5>
        <div class="notice-table-responsive">
          <table class="notice-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Program / Activity</th>
                <th>Participants & Details</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>08:30 AM</strong></td>
                <td>March Past & Torch Lighting Ceremony</td>
                <td>House Captains (Tagore, Shivaji, Raman, Sarojini) & Band Contingent</td>
              </tr>
              <tr>
                <td><strong>09:00 AM</strong></td>
                <td>Sports Oath & Principal's Inaugural Flag Off</td>
                <td>Smt. Gorle Varalakshmi & Vice Principal Sri Navva Anand</td>
              </tr>
              <tr>
                <td><strong>09:30 AM</strong></td>
                <td>Athletic Track Finals (100m, 200m, 4x100m Relay)</td>
                <td>Sub-Junior (Class 4-6), Junior (Class 7-8), Senior (Class 9-10)</td>
              </tr>
              <tr>
                <td><strong>11:00 AM</strong></td>
                <td>Fun & Traditional Games</td>
                <td>Lemon & Spoon, Sack Race, Frog Jump for Pre-Primary & Primary</td>
              </tr>
              <tr>
                <td><strong>12:15 PM</strong></td>
                <td>Inter-House Tug-of-War Championship</td>
                <td>House Teams Finals & Staff vs Senior Exhibition Match</td>
              </tr>
              <tr>
                <td><strong>01:00 PM</strong></td>
                <td>Special Children's Day Festive Lunch</td>
                <td>Nutritious lunch feast arranged by School Management for all students</td>
              </tr>
              <tr>
                <td><strong>02:30 PM</strong></td>
                <td>Children's Day Cultural Skits & Dances</td>
                <td>Tribute to Chacha Nehru, group singing, musical performances</td>
              </tr>
              <tr>
                <td><strong>03:45 PM</strong></td>
                <td>Medal Distribution & Trophy Presentation</td>
                <td>Medals, merit certificates, and Overall House Championship Cup</td>
              </tr>
              <tr>
                <td><strong>04:30 PM</strong></td>
                <td>National Anthem & Dispersal</td>
                <td>All Students, Parents, and Staff Members</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h5 style="font-family: var(--font-heading); font-size: 1.05rem; margin: 1.25rem 0 0.5rem; color: var(--color-primary-dark);">Guidelines for Students & Parents</h5>
        <ul class="notice-doc-list">
          <li><i class="fa-solid fa-shirt"></i> All students must wear their neat house sports uniform and sport shoes.</li>
          <li><i class="fa-solid fa-bottle-water"></i> Water and energy glucose booths will be placed around the field. Carry personal labeled bottles.</li>
          <li><i class="fa-solid fa-heart"></i> Parents are warmly invited to attend and cheer for their children throughout the day!</li>
        </ul>

        <div class="notice-doc-sign-block">
          <div class="notice-doc-sign-seal">
            <div class="notice-doc-sign-seal-circle">SPORTS<br>COMMITTEE<br>2025</div>
            <div>
              <strong>Sports & Cultural Committee</strong><br>
              Sri Vidya E.M High School
            </div>
          </div>
          <div class="notice-doc-sign-person">
            <div class="sign-title">Physical Education Director</div>
            <div class="sign-dept">Sri Vidya E.M High School</div>
          </div>
        </div>
      </div>
    `
  },

  'Sri_Vidya_Curriculum_Syllabus_2025.pdf': {
    id: 'syllabus-doc',
    fileName: 'Sri_Vidya_Curriculum_Syllabus_2025.pdf',
    badge: 'Curriculum & Academic Blueprint',
    badgeClass: 'tag-academic',
    ref: 'SVEM/ACAD/2025-26/SYL-01',
    date: '10th June 2025',
    title: 'Academic Curriculum Blueprint & Class-wise Syllabus 2025-26',
    authority: 'Academic Council, Sri Vidya E.M High School',
    renderHtml: () => `
      <div class="notice-doc-wrapper">
        <div class="notice-doc-header">
          <img src="assets/images/school-logo.jpg" alt="Sri Vidya Logo">
          <div class="notice-doc-header-text">
            <h3>SRI VIDYA E.M HIGH SCHOOL</h3>
            <div class="school-motto">"Vidyathe Vijayam" — Knowledge Brings Victory</div>
            <div class="school-sub">Academic Curriculum Blueprint & Learning Outcomes • 2025-26</div>
          </div>
        </div>
        <div class="notice-doc-meta-bar">
          <div class="notice-doc-meta-item"><strong>Document:</strong> Academic Syllabus 2025-26</div>
          <div class="notice-doc-meta-item"><strong>Medium:</strong> English</div>
          <div class="notice-doc-meta-item"><span class="notice-info-tag tag-academic">State Board & STEM</span></div>
        </div>
        <h4 class="notice-doc-title">Class-wise Curriculum & Subject Weightage</h4>
        <p class="notice-doc-lead">Sri Vidya follows the structured curriculum mandated by the Department of School Education, Govt. of Andhra Pradesh, enhanced with modern STEM labs, spoken English coaching, and moral values education.</p>
        <div class="notice-table-responsive">
          <table class="notice-table">
            <thead>
              <tr><th>Level</th><th>Classes</th><th>Core Subjects</th><th>Assessment System</th></tr>
            </thead>
            <tbody>
              <tr><td><strong>Pre-Primary</strong></td><td>LKG, UKG</td><td>Phonics, Numbers, EVS, Rhymes, Story Telling</td><td>Continuous Informal Observation</td></tr>
              <tr><td><strong>Primary</strong></td><td>Class 1 to 5</td><td>Telugu/Hindi, English, Mathematics, EVS</td><td>Formative (FA 1-4) & Summative (SA 1-2)</td></tr>
              <tr><td><strong>Middle School</strong></td><td>Class 6 to 8</td><td>Languages, Math, General Science, Social Studies</td><td>Continuous and Comprehensive Evaluation (CCE)</td></tr>
              <tr><td><strong>High School</strong></td><td>Class 9 & 10</td><td>SSC Board Curricula + Physical & Biological Sciences</td><td>AP SSC Board Examination Pattern</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    `
  },

  'Sri_Vidya_Admission_Form_Printable.pdf': {
    id: 'admission-form-printable',
    fileName: 'Sri_Vidya_Admission_Form_Printable.pdf',
    badge: 'Official Admission Application',
    badgeClass: 'tag-urgent',
    ref: 'SVEM/ADM/2025-26/FORM-02',
    date: '15th October 2025',
    title: 'Printable Physical Admission Registration Form (2025-26)',
    authority: 'Admissions Office, Sri Vidya E.M High School',
    renderHtml: () => `
      <div class="notice-doc-wrapper">
        <div class="notice-doc-header">
          <img src="assets/images/school-logo.jpg" alt="Sri Vidya Logo">
          <div class="notice-doc-header-text">
            <h3>SRI VIDYA E.M HIGH SCHOOL</h3>
            <div class="school-motto">"Vidyathe Vijayam" — Knowledge Brings Victory</div>
            <div class="school-sub">Official Student Admission Application Form • Academic Year 2025-26</div>
          </div>
        </div>
        <div class="notice-doc-callout academic">
          Please fill out the form in capital letters. Submit the completed physical form along with self-attested copies of birth certificate, Aadhar cards, and previous marks cards at the school desk.
        </div>
        <div class="notice-table-responsive">
          <table class="notice-table">
            <tbody>
              <tr><td style="width: 35%;"><strong>Applicant's Full Name:</strong></td><td>________________________________________________</td></tr>
              <tr><td><strong>Class to Which Admission is Sought:</strong></td><td>________________________ (Medium: English)</td></tr>
              <tr><td><strong>Date of Birth & Gender:</strong></td><td>DOB: DD / MM / YYYY | Gender: [ ] Male [ ] Female</td></tr>
              <tr><td><strong>Father's / Guardian's Name:</strong></td><td>________________________ (Occ: __________________)</td></tr>
              <tr><td><strong>Mother's Name:</strong></td><td>________________________ (Occ: __________________)</td></tr>
              <tr><td><strong>Primary Mobile Phone:</strong></td><td>________________________ (Alt: __________________)</td></tr>
              <tr><td><strong>Residential Address:</strong></td><td>________________________________________________</td></tr>
              <tr><td><strong>Previous School Attended:</strong></td><td>________________________ Class Passed: __________</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    `,
    extraAction: `
      <button type="button" class="btn btn-red" onclick="window.applyAdmissionFromNotice()">
        <i class="fa-solid fa-paper-plane"></i> Fill Online Instead
      </button>
    `
  },

  'Academic_Calendar_2025-26.pdf': {
    id: 'calendar-doc',
    fileName: 'Academic_Calendar_2025-26.pdf',
    badge: 'Annual Academic Calendar',
    badgeClass: 'tag-general',
    ref: 'SVEM/CAL/2025-26/ANNUAL-01',
    date: '01st June 2025',
    title: 'Annual Academic Calendar, Examination Windows & Holidays (2025-26)',
    authority: 'Office of the Principal, Sri Vidya E.M High School',
    renderHtml: () => `
      <div class="notice-doc-wrapper">
        <div class="notice-doc-header">
          <img src="assets/images/school-logo.jpg" alt="Sri Vidya Logo">
          <div class="notice-doc-header-text">
            <h3>SRI VIDYA E.M HIGH SCHOOL</h3>
            <div class="school-motto">"Vidyathe Vijayam" — Knowledge Brings Victory</div>
            <div class="school-sub">Annual Academic Calendar & Key Dates • 2025-26</div>
          </div>
        </div>
        <div class="notice-table-responsive">
          <table class="notice-table">
            <thead>
              <tr><th>Month / Period</th><th>Key Academic Event / Activity</th><th>Examination / Holiday</th></tr>
            </thead>
            <tbody>
              <tr><td><strong>June 2025</strong></td><td>School Reopening & Orientation Assembly</td><td>Academic Session Begins</td></tr>
              <tr><td><strong>July 2025</strong></td><td>Formative Assessment 1 (FA-1)</td><td>First Term Curriculum Focus</td></tr>
              <tr><td><strong>August 2025</strong></td><td>Independence Day & Science Exhibition</td><td>FA-2 Assessments</td></tr>
              <tr><td><strong>October 2025</strong></td><td>Dasara Vacation & Mid-term Revision</td><td>Summative Assessment-1 (SA-1)</td></tr>
              <tr><td><strong>November 2025</strong></td><td>Children's Day & Annual Sports Meet</td><td>SA-1 Paper Distribution & PTM</td></tr>
              <tr><td><strong>January 2026</strong></td><td>Sankranti Holidays & Republic Day</td><td>FA-3 Assessments & Pre-Finals</td></tr>
              <tr><td><strong>March/April 2026</strong></td><td>Summative Assessment-2 (SA-2) & Board Exams</td><td>Final Results & Annual Day</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    `
  },

  'Prescribed_Book_List_2025.pdf': {
    id: 'booklist-doc',
    fileName: 'Prescribed_Book_List_2025.pdf',
    badge: 'Curriculum Textbooks & Stationery',
    badgeClass: 'tag-academic',
    ref: 'SVEM/BOOK/2025-26/LIST-04',
    date: '10th June 2025',
    title: 'Prescribed Book & Stationery Specifications (Classes I to X)',
    authority: 'Academic Resources Department',
    renderHtml: () => `
      <div class="notice-doc-wrapper">
        <div class="notice-doc-header">
          <img src="assets/images/school-logo.jpg" alt="Sri Vidya Logo">
          <div class="notice-doc-header-text">
            <h3>SRI VIDYA E.M HIGH SCHOOL</h3>
            <div class="school-motto">"Vidyathe Vijayam" — Knowledge Brings Victory</div>
            <div class="school-sub">Official Prescribed Textbooks & Stationery List 2025-26</div>
          </div>
        </div>
        <p class="notice-doc-lead">All textbooks are compliant with the Andhra Pradesh SCERT curriculum, accompanied by specialized grammar and science laboratory workbooks.</p>
        <ul class="notice-doc-list">
          <li><i class="fa-solid fa-book"></i> <strong>Classes 1 to 5:</strong> AP SCERT English Reader, Telugu / Hindi Vachakam, Mathematics Magic, Environmental Studies (EVS).</li>
          <li><i class="fa-solid fa-book"></i> <strong>Classes 6 to 8:</strong> SCERT Textbooks, NCERT Science Foundation, Spoken English Companion & Map Practice Book.</li>
          <li><i class="fa-solid fa-book"></i> <strong>Classes 9 & 10:</strong> SSC Board Books (Math, Physical Science, Biological Science, Social Studies), Lab Manuals.</li>
          <li><i class="fa-solid fa-pen-nib"></i> <strong>Notebook Specifications:</strong> Four-line (English), Double-line (Telugu/Hindi), Square-rule (Math primary), Long Single-rule (Middle/High School).</li>
        </ul>
      </div>
    `
  },

  'School_Uniform_Guidelines.pdf': {
    id: 'uniform-doc',
    fileName: 'School_Uniform_Guidelines.pdf',
    badge: 'Dress Code & Grooming',
    badgeClass: 'tag-general',
    ref: 'SVEM/ADM/2025-26/UNIFORM-06',
    date: '01st June 2025',
    title: 'School Uniform, Footwear & Grooming Standards Guidelines',
    authority: 'Discipline & Student Welfare Committee',
    renderHtml: () => `
      <div class="notice-doc-wrapper">
        <div class="notice-doc-header">
          <img src="assets/images/school-logo.jpg" alt="Sri Vidya Logo">
          <div class="notice-doc-header-text">
            <h3>SRI VIDYA E.M HIGH SCHOOL</h3>
            <div class="school-motto">"Vidyathe Vijayam" — Knowledge Brings Victory</div>
            <div class="school-sub">Student Dress Code & Grooming Standards Manual</div>
          </div>
        </div>
        <div class="notice-table-responsive">
          <table class="notice-table">
            <thead>
              <tr><th>Schedule</th><th>Boys Dress Code</th><th>Girls Dress Code</th><th>Footwear</th></tr>
            </thead>
            <tbody>
              <tr><td><strong>Mon, Tue, Thu, Fri</strong></td><td>Sky Blue Shirt, Navy Blue Trousers/Shorts, School Tie & Belt</td><td>Sky Blue Shirt, Navy Blue Pinafore/Skirt with Bloomers, School Belt</td><td>Black Polished Shoes with Navy Blue Socks</td></tr>
              <tr><td><strong>Wednesday & Saturday</strong></td><td>Assigned House T-Shirt (Red, Blue, Green, Yellow), White Trousers</td><td>Assigned House T-Shirt, White Skirt/Divided Skirt</td><td>White Canvas Shoes with White Socks</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    `
  },

  'TC_Application_Form.pdf': {
    id: 'tc-application-doc',
    fileName: 'TC_Application_Form.pdf',
    badge: 'Administrative Clearance',
    badgeClass: 'tag-urgent',
    ref: 'SVEM/ADMIN/2025-26/TC-09',
    date: '10th June 2025',
    title: 'Application for Transfer Certificate (TC) & Clearance Form',
    authority: 'Administrative Secretariate',
    renderHtml: () => `
      <div class="notice-doc-wrapper">
        <div class="notice-doc-header">
          <img src="assets/images/school-logo.jpg" alt="Sri Vidya Logo">
          <div class="notice-doc-header-text">
            <h3>SRI VIDYA E.M HIGH SCHOOL</h3>
            <div class="school-motto">"Vidyathe Vijayam" — Knowledge Brings Victory</div>
            <div class="school-sub">Official Transfer Certificate (TC) Requisition & Clearance Slip</div>
          </div>
        </div>
        <div class="notice-doc-callout urgent">
          <strong>Notice:</strong> Parents can also track, verify, and digitally validate school Transfer Certificates using our online TC portal.
        </div>
        <div class="notice-table-responsive">
          <table class="notice-table">
            <tbody>
              <tr><td><strong>Student Name & Admission No:</strong></td><td>________________________________________________</td></tr>
              <tr><td><strong>Class & Section Last Studied:</strong></td><td>Class: ________ Section: ________ Roll: ________</td></tr>
              <tr><td><strong>Reason for Leaving School:</strong></td><td>[ ] Parent Relocation [ ] Higher Education [ ] Other: ______</td></tr>
              <tr><td><strong>Departmental Clearance:</strong></td><td>Library: [ OK ] | Sports: [ OK ] | Lab: [ OK ] | Accounts: [ OK ]</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    `,
    extraAction: `
      <a href="transfer-certificate.html" class="btn btn-primary">
        <i class="fa-solid fa-arrow-up-right-from-square"></i> Open Live TC Portal
      </a>
    `
  }
};

let currentModalNoticeDoc = null;

function openNoticeModal(docKeyOrFile) {
  const modal = document.getElementById('noticeDetailModal');
  const contentBox = document.getElementById('noticeModalContent');
  const extraActionBox = document.getElementById('noticeModalExtraAction');

  if (!modal || !contentBox) {
    console.warn('[NoticeModal] Modal elements missing in DOM');
    return;
  }

  // Lookup in database
  let doc = NOTICE_DOCUMENTS_DATABASE[docKeyOrFile];
  if (!doc) {
    // Search by fileName
    const match = Object.values(NOTICE_DOCUMENTS_DATABASE).find(d => 
      d.fileName === docKeyOrFile || d.id === docKeyOrFile
    );
    if (match) doc = match;
  }

  // Fallback if not specifically in database
  if (!doc) {
    const cleanName = (docKeyOrFile || 'Document').replace(/[_-]/g, ' ').replace(/\.pdf$/i, '');
    doc = {
      id: docKeyOrFile,
      fileName: docKeyOrFile.endsWith('.pdf') ? docKeyOrFile : `${docKeyOrFile}.pdf`,
      title: cleanName,
      renderHtml: () => `
        <div class="notice-doc-wrapper">
          <div class="notice-doc-header">
            <img src="assets/images/school-logo.jpg" alt="Logo">
            <div class="notice-doc-header-text">
              <h3>SRI VIDYA E.M HIGH SCHOOL</h3>
              <div class="school-motto">"Vidyathe Vijayam" — Knowledge Brings Victory</div>
              <div class="school-sub">Official Academic Resource • Sri Vidya Educational Platform</div>
            </div>
          </div>
          <div class="notice-doc-meta-bar">
            <div class="notice-doc-meta-item"><strong>Document:</strong> ${cleanName}</div>
            <div class="notice-doc-meta-item"><strong>Date:</strong> ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
          </div>
          <h4 class="notice-doc-title">${cleanName}</h4>
          <p class="notice-doc-lead">This official publication is published by Sri Vidya E.M High School for the reference of enrolled students, parents, and faculty.</p>
        </div>
      `
    };
  }

  currentModalNoticeDoc = doc;
  contentBox.innerHTML = doc.renderHtml();

  if (extraActionBox) {
    extraActionBox.innerHTML = doc.extraAction || '';
  }

  modal.classList.add('active');
  showToast(`Viewing: ${doc.title || doc.fileName}`, 'info');
}

function downloadOfficialDocument(doc) {
  if (!doc) return;
  const fileName = doc.fileName || 'document.pdf';
  showToast(`Downloading official PDF: ${fileName}...`, 'success');

  const a = document.createElement('a');
  a.href = `downloads/${fileName}`;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

window.applyAdmissionFromNotice = function () {
  const modal = document.getElementById('noticeDetailModal');
  if (modal) modal.classList.remove('active');

  const admSection = document.getElementById('admissions');
  const applyTabBtn = document.getElementById('tabBtnAdmApply');
  if (applyTabBtn) {
    applyTabBtn.click();
  }
  if (admSection) {
    admSection.scrollIntoView({ behavior: 'smooth' });
  }
  setTimeout(() => {
    const studentInput = document.getElementById('admStudentName');
    if (studentInput) studentInput.focus();
  }, 400);
  showToast('Redirected to Online Admission Application', 'info');
};

function initDownloads() {
  const modal = document.getElementById('noticeDetailModal');
  const printBtn = document.getElementById('printNoticeModalBtn');
  const downloadBtn = document.getElementById('downloadNoticeModalBtn');

  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      if (currentModalNoticeDoc) {
        downloadOfficialDocument(currentModalNoticeDoc);
      }
    });
  }

  // Direct download buttons (Download Syllabus, Download Form, etc.)
  document.querySelectorAll('.direct-download-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const fileName = btn.getAttribute('data-file') || 'Document.pdf';
      showToast(`Downloading ${fileName} (Official PDF)...`, 'success');
    });
  });

  // Preview buttons in download cards
  document.querySelectorAll('.preview-doc-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const noticeKey = btn.getAttribute('data-notice') || btn.getAttribute('data-file');
      if (noticeKey) {
        openNoticeModal(noticeKey);
      }
    });
  });

  // Notice triggers (Circular, Timetable, View, Details)
  document.querySelectorAll('.notice-trigger-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const noticeKey = btn.getAttribute('data-notice') || 
                        btn.getAttribute('data-notice-id') || 
                        btn.getAttribute('data-file');

      if (noticeKey) {
        openNoticeModal(noticeKey);
      }
    });
  });

  // Global modal overlay close triggers
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
      }
    });
  });

  document.querySelectorAll('.modal-close-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
    }
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


