/**
 * Sri Vidya E.M High School - Dedicated Student Portal
 * Student: Rahul (Grade 10 – Section A, Roll #1042)
 */

const studentApp = (function () {
  'use strict';

  // State
  const state = {
    activeModule: 'dashboard',
    activeSubTab: {
      'academics': 'subjects',
      'attendance': 'daily',
      'examinations': 'upcoming'
    },
    student: {
      name: 'Rahul',
      fullName: 'Rahul G.',
      grade: 'Grade 10 – Section A',
      rollNo: 1042,
      admNo: 'SV-2024-082',
      house: 'Shivaji House (Green)',
      classTeacher: 'Smt. M. Sunitha',
      attendancePct: '95%',
      gpaMarks: '86%',
      feeStatus: 'Paid',
      pendingAssignments: 3
    },
    subjects: [
      { name: 'Mathematics', teacher: 'Sri P. Satyanarayana', syllabus: '85%', score: '92/100', grade: 'A1', icon: 'fa-calculator' },
      { name: 'Physical Science', teacher: 'Sri K. Rajesh / Sri Navva Anand', syllabus: '82%', score: '88/100', grade: 'A1', icon: 'fa-flask' },
      { name: 'Biological Science', teacher: 'Smt. S. Lakshmi', syllabus: '88%', score: '90/100', grade: 'A1', icon: 'fa-dna' },
      { name: 'English Language', teacher: 'Smt. M. Sunitha (Class Teacher)', syllabus: '90%', score: '91/100', grade: 'A1', icon: 'fa-book' },
      { name: 'Social Studies', teacher: 'Sri R. Venkata Ramana', syllabus: '78%', score: '84/100', grade: 'A2', icon: 'fa-earth-asia' },
      { name: 'First Language (Telugu)', teacher: 'Smt. G. Sarada', syllabus: '86%', score: '94/100', grade: 'A1', icon: 'fa-feather' }
    ],
    assignments: [
      { id: 1, subject: 'Mathematics', title: 'Chapter 4: Quadratic Curves & Graph Exercises', due: 'Monday, Sept 21', status: 'Pending', teacher: 'Sri P. Satyanarayana' },
      { id: 2, subject: 'Science', title: 'Physics Practical Apparatus & Measurement Record', due: 'Wednesday, Sept 23', status: 'Pending', teacher: 'Smt. S. Lakshmi' },
      { id: 3, subject: 'English', title: 'Essay: The Role of Science in Youth Empowerment', due: 'Thursday, Sept 24', status: 'Pending', teacher: 'Smt. M. Sunitha' },
      { id: 4, subject: 'Social Studies', title: 'Indian Independence Movement Timeline Chart', due: 'Sept 15, 2026', status: 'Submitted', score: '19/20 (A1)', teacher: 'Sri R. Venkata Ramana' }
    ],
    events: [
      { title: 'Sri Vidya Annual Inter-House Sports Championship', date: 'Oct 14 – 16, 2026', category: 'Athletics & Games', desc: 'Rahul registered for 400m sprint and Shivaji House Kho-Kho team.' },
      { title: 'Swachh Vidya Cleanliness Drive & Gandhi Jayanti', date: 'Oct 02, 2026', category: 'Community Service', desc: 'Inter-house campus cleanliness drive and social awareness pledge.' },
      { title: 'Mega Science Fair & Working Robotics Expo', date: 'Nov 14, 2026', category: 'Science Exhibition', desc: 'Demonstration of smart irrigation automated model by Grade 10-A team.' }
    ],
    announcements: [
      { title: 'Quarterly Examination Timetable Published', date: 'Yesterday • Office', body: 'Quarterly assessments start from Sept 24. Hall tickets are now available for download.' },
      { title: 'Special Maths Doubt Clearance Session', date: 'Sept 18 • Sri P. Satyanarayana', body: 'Optional session on quadratic polynomials on Monday 03:30 PM in Room 301.' },
      { title: 'Inter-House Green Campus Drive', date: 'Sept 16 • Principal Office', body: 'Shivaji House volunteers assemble on Oct 2 at 08:30 AM.' }
    ],
    messages: [
      { id: 1, sender: 'Smt. M. Sunitha (Class Teacher)', date: 'Today, 09:15 AM', text: 'Rahul, please ensure your English presentation notes are submitted by Monday morning assembly.' },
      { id: 2, sender: 'Sri P. Satyanarayana (Mathematics)', date: 'Yesterday, 04:30 PM', text: 'Great progress in the trigonometry test, Rahul! Keep up the practice for the Olympiad.' }
    ]
  };

  function init() {
    setupTheme();
    bindEvents();
    renderAll();
    setupHashRouting();
  }

  function setupTheme() {
    const saved = localStorage.getItem('sv_theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
    updateThemeIcon(saved);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('sv_theme', next);
    updateThemeIcon(next);
    showToast(`Switched to ${next === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
  }

  function updateThemeIcon(theme) {
    const icon = document.getElementById('themeIcon');
    if (icon) {
      icon.className = theme === 'dark' ? 'fa-solid fa-sun theme-icon' : 'fa-solid fa-moon theme-icon';
    }
  }

  function bindEvents() {
    // Theme toggle
    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

    // Mobile sidebar toggle
    const mobileBtn = document.getElementById('mobileSidebarToggle');
    const sidebar = document.getElementById('portalSidebar');
    if (mobileBtn && sidebar) {
      mobileBtn.addEventListener('click', function () {
        sidebar.classList.toggle('mobile-open');
      });
    }

    // Sidebar navigation
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
    });
  }

  function setupHashRouting() {
    function handleHash() {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        const parts = hash.split('-');
        const mod = parts[0];
        const sub = parts[1] || null;
        if (document.getElementById(`view-${mod}`)) {
          navigateTo(mod, sub);
        }
      }
    }
    window.addEventListener('hashchange', handleHash);
    handleHash();
  }

  function navigateTo(moduleKey, subKey) {
    const view = document.getElementById(`view-${moduleKey}`);
    if (!view) return;

    state.activeModule = moduleKey;

    // Active sidebar class
    document.querySelectorAll('.nav-item').forEach(item => {
      if (item.getAttribute('data-module') === moduleKey) {
        item.classList.add('active');
        item.classList.add('open');
      } else {
        item.classList.remove('active');
      }
    });

    // Hide other views, show target
    document.querySelectorAll('.portal-view').forEach(v => v.classList.remove('active'));
    view.classList.add('active');

    // Breadcrumb
    const crumb = document.getElementById('studentCurrentPageCrumb');
    if (crumb) {
      const titles = {
        'dashboard': 'Dashboard',
        'profile': 'My Profile',
        'academics': 'Academics & Study Desk',
        'attendance': 'My Attendance',
        'examinations': 'Examinations & Hall Ticket',
        'timetable': 'Weekly Timetable',
        'assignments': 'My Assignments',
        'events': 'Events & Competitions',
        'library': 'Library Desk',
        'announcements': 'Announcements',
        'messages': 'Teacher Messages',
        'certificates': 'My Certificates',
        'fees': 'Fee Receipt & Status'
      };
      crumb.textContent = titles[moduleKey] || moduleKey;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (subKey) switchSubTab(moduleKey, subKey);
  }

  function switchSubTab(moduleKey, subKey) {
    state.activeSubTab[moduleKey] = subKey;
    const view = document.getElementById(`view-${moduleKey}`);
    if (!view) return;

    const strip = view.querySelector('.tab-strip');
    if (strip) {
      strip.querySelectorAll('.tab-btn').forEach(btn => {
        const text = btn.textContent.toLowerCase();
        if (text.includes(subKey.toLowerCase())) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }

    if (moduleKey === 'academics') renderAcademicsSubView(subKey);
    showToast(`Switched view to ${moduleKey} → ${subKey}`, 'info');
  }

  function renderAll() {
    renderAcademicsSubView('subjects');
    renderAssignments();
    renderEvents();
    renderAnnouncements();
    renderMessages();
  }

  function renderAcademicsSubView(subKey) {
    const container = document.getElementById('academicsModuleContent');
    if (!container) return;

    if (subKey === 'subjects') {
      container.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(310px, 1fr)); gap: 1.25rem;">
          ${state.subjects.map(s => `
            <div class="card p-4">
              <div class="card-header-bar">
                <div class="d-flex align-items-center gap-2">
                  <i class="fa-solid ${s.icon} text-primary" style="font-size: 1.3rem;"></i>
                  <h4>${s.name}</h4>
                </div>
                <span class="portal-badge badge-success">${s.grade}</span>
              </div>
              <div style="font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 0.85rem;">
                Faculty: <strong>${s.teacher}</strong>
              </div>
              <div style="font-size: 0.82rem; margin-bottom: 0.4rem; display: flex; justify-content: space-between;">
                <span>Syllabus Pacing</span>
                <strong>${s.syllabus}</strong>
              </div>
              <div style="height: 6px; background: var(--color-bg-subtle); border-radius: 9999px; overflow: hidden; margin-bottom: 1rem;">
                <div style="width: ${s.syllabus}; height: 100%; background: var(--color-primary);"></div>
              </div>
              <div class="d-flex justify-content-between align-items-center">
                <span style="font-size: 0.85rem;">Term Score: <strong class="text-primary">${s.score}</strong></span>
                <button class="btn btn-secondary btn-sm" onclick="studentApp.downloadNotes('${s.name}')">
                  <i class="fa-solid fa-download"></i> Notes
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    } else if (subKey === 'materials' || subKey === 'notes') {
      container.innerHTML = `
        <div class="card p-4">
          <h3>Downloadable Chapter Study Materials & Lecture Notes</h3>
          <div class="table-container mt-3">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Chapter & Topic</th>
                  <th>Uploaded By</th>
                  <th>Format / Size</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Mathematics</strong></td>
                  <td>Chapter 4: Quadratic Equations Complete Formula Sheet</td>
                  <td>Sri P. Satyanarayana</td>
                  <td>PDF (1.8 MB)</td>
                  <td><button class="btn btn-primary btn-sm" onclick="studentApp.downloadNotes('Mathematics')"><i class="fa-solid fa-download"></i> Download</button></td>
                </tr>
                <tr>
                  <td><strong>Physical Science</strong></td>
                  <td>Refraction of Light at Curved Surfaces & Ray Diagrams</td>
                  <td>Sri Navva Anand (VP)</td>
                  <td>PDF (2.4 MB)</td>
                  <td><button class="btn btn-primary btn-sm" onclick="studentApp.downloadNotes('Science')"><i class="fa-solid fa-download"></i> Download</button></td>
                </tr>
                <tr>
                  <td><strong>Biological Science</strong></td>
                  <td>Respiration: The Energy Producing System Practice Diagrams</td>
                  <td>Smt. S. Lakshmi</td>
                  <td>PDF (3.1 MB)</td>
                  <td><button class="btn btn-primary btn-sm" onclick="studentApp.downloadNotes('Biology')"><i class="fa-solid fa-download"></i> Download</button></td>
                </tr>
                <tr>
                  <td><strong>English</strong></td>
                  <td>Prose Unit 1: Vocabulary & Comprehension Notes</td>
                  <td>Smt. M. Sunitha</td>
                  <td>PDF (1.2 MB)</td>
                  <td><button class="btn btn-primary btn-sm" onclick="studentApp.downloadNotes('English')"><i class="fa-solid fa-download"></i> Download</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      `;
    } else {
      renderAssignments();
    }
  }

  function renderAssignments() {
    const container = document.getElementById('assignmentsListContainer');
    if (!container) return;

    container.innerHTML = state.assignments.map(a => `
      <div class="card p-4 mb-3">
        <div class="card-header-bar">
          <div>
            <span class="portal-badge badge-primary">${a.subject}</span>
            <h3 class="mt-2">${a.title}</h3>
            <p class="text-muted text-sm mt-1">Assigned by: <strong>${a.teacher}</strong> • Due: <strong>${a.due}</strong></p>
          </div>
          <div>
            <span class="portal-badge ${a.status === 'Pending' ? 'badge-warning' : 'badge-success'}">${a.status}</span>
          </div>
        </div>

        <div class="d-flex justify-content-between align-items-center mt-3">
          <span style="font-size: 0.85rem; color: var(--color-text-muted);">
            ${a.score ? `Grade Awarded: <strong class="text-emerald">${a.score}</strong>` : 'Max Score: 20 Points • Late penalty applies after due date'}
          </span>
          <div>
            ${a.status === 'Pending' ? `
              <button class="btn btn-primary btn-sm" onclick="studentApp.triggerSubmitModal('${a.title}')">
                <i class="fa-solid fa-upload"></i> Submit Online
              </button>
            ` : `
              <button class="btn btn-secondary btn-sm" onclick="studentApp.showToast('Assignment verified & graded by faculty', 'info')">
                <i class="fa-solid fa-circle-check"></i> View Graded Sheet
              </button>
            `}
          </div>
        </div>
      </div>
    `).join('');

    const openCount = state.assignments.filter(a => a.status === 'Pending').length;
    const badge = document.getElementById('assignmentBadgeCount');
    const badge2 = document.getElementById('pendingAssignmentsCount');
    if (badge) badge.textContent = `${openCount} Pending Submission`;
    if (badge2) badge2.textContent = `${openCount} Pending`;
  }

  function triggerSubmitModal(title) {
    const titleInput = document.getElementById('modalAssignTitle');
    if (titleInput) titleInput.value = title;
    openModal('submitAssignmentModal');
  }

  function handleSubmitAssignment(e) {
    e.preventDefault();
    const title = document.getElementById('modalAssignTitle')?.value;

    const assign = state.assignments.find(a => a.title === title);
    if (assign) {
      assign.status = 'Submitted';
      assign.score = 'Under Faculty Review';
    }

    renderAssignments();
    closeModal('submitAssignmentModal');
    e.target.reset();
    showToast(`Assignment "${title}" uploaded and submitted to faculty for evaluation!`, 'success');
  }

  function renderEvents() {
    const container = document.getElementById('studentEventsContainer');
    if (!container) return;

    container.innerHTML = state.events.map(ev => `
      <div class="card p-4 mb-3">
        <div class="card-header-bar">
          <div>
            <span class="portal-badge badge-primary">${ev.category}</span>
            <h3 class="mt-2">${ev.title}</h3>
          </div>
          <span class="text-muted text-sm"><i class="fa-regular fa-calendar"></i> ${ev.date}</span>
        </div>
        <p class="text-muted mt-2">${ev.desc}</p>
        <div class="mt-3">
          <span class="portal-badge badge-success"><i class="fa-solid fa-circle-check"></i> Registered (Shivaji House Team)</span>
        </div>
      </div>
    `).join('');
  }

  function renderAnnouncements() {
    const container = document.getElementById('studentAnnouncementsFeed');
    if (!container) return;

    container.innerHTML = state.announcements.map(an => `
      <div class="card p-4 mb-3">
        <div class="card-header-bar">
          <h3>${an.title}</h3>
          <span class="text-muted text-sm"><i class="fa-regular fa-clock"></i> ${an.date}</span>
        </div>
        <p class="mt-2 text-main">${an.body}</p>
      </div>
    `).join('');
  }

  function renderMessages() {
    const container = document.getElementById('messagesInboxContainer');
    if (!container) return;

    container.innerHTML = state.messages.map(m => `
      <div class="p-3 mb-3" style="background: var(--color-bg-subtle); border-radius: var(--radius-md); border-left: 3px solid var(--color-primary);">
        <div class="d-flex justify-content-between align-items-center mb-1">
          <strong style="color: var(--color-primary);">${m.sender}</strong>
          <span class="text-muted text-sm">${m.date}</span>
        </div>
        <p style="margin: 0; font-size: 0.9rem;">${m.text}</p>
      </div>
    `).join('');
  }

  function handleSendQuery(e) {
    e.preventDefault();
    const teacher = document.getElementById('queryTeacher')?.value;
    const subj = document.getElementById('querySubject')?.value;

    closeModal('askTeacherModal');
    e.target.reset();
    showToast(`Question "${subj}" dispatched to ${teacher}! Response will appear in your Messages desk.`, 'success');
  }

  function downloadNotes(subj) {
    showToast(`Downloading ${subj} high-yield revision PDF guide...`, 'success');
  }

  function downloadAllNotes() {
    showToast(`Generating complete Class 10-A revision dossier PDF...`, 'success');
  }

  function handleSearch() {
    const q = (document.getElementById('studentSearchInput')?.value || '').toLowerCase().trim();
    if (!q) return;

    const matched = state.subjects.find(s => s.name.toLowerCase().includes(q));
    if (matched) {
      navigateTo('academics', 'subjects');
    }
  }

  function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('active');
  }

  function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('active');
  }

  function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `portal-toast toast-${type}`;
    let icon = 'fa-solid fa-circle-info';
    if (type === 'success') icon = 'fa-solid fa-circle-check';
    if (type === 'warning') icon = 'fa-solid fa-triangle-exclamation';

    toast.innerHTML = `<i class="${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // Auto-init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Public API
  return {
    init,
    navigateTo,
    switchSubTab,
    triggerSubmitModal,
    handleSubmitAssignment,
    handleSendQuery,
    downloadNotes,
    downloadAllNotes,
    handleSearch,
    openModal,
    closeModal,
    showToast
  };

})();
