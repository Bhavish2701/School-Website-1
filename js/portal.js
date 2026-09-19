/**
 * Sri Vidya E.M High School - Management Portal Application Logic
 * Role Architecture: Principal, Vice Principal, Admin / School Office
 * Established: 2017
 */

const portalApp = (function () {
  'use strict';

  // State
  const state = {
    currentRole: 'principal', // 'principal' | 'vice-principal' | 'admin'
    activeModule: 'dashboard',
    activeSubTab: {
      students: 'all',
      teachers: 'faculty',
      academics: 'classes',
      attendance: 'student',
      fees: 'collection',
      communication: 'announcements',
      events: 'calendar',
      reports: 'academic',
      settings: 'profile'
    },
    pendingApprovalsCount: 4,
    // All 855 students are loaded from js/student-roster.js (window.STUDENT_ROSTER)
    // Fallback to empty array if roster script failed to load
    students: (window.STUDENT_ROSTER && window.STUDENT_ROSTER.length === 855)
      ? window.STUDENT_ROSTER
      : [],

    admissions: [
      { appId: 'ADM-2026-001', name: 'K. Sai Tharun', class: 'VIII', prevSchool: "St. Ann's High School", parent: 'K. Narayana', phone: '9848011223', score: '88% (Distinction)', docStatus: 'Verified', status: 'Pending Principal Review' },
      { appId: 'ADM-2026-002', name: 'B. Vennela', class: 'VI', prevSchool: 'Kendriya Vidyalaya', parent: 'B. Srinivas', phone: '9848022334', score: '92% (Top Tier)', docStatus: 'Verified', status: 'Approved - Fee Due' },
      { appId: 'ADM-2026-003', name: 'M. Dinesh Kumar', class: 'IV', prevSchool: 'Ravindra Bharathi', parent: 'M. Jagannath', phone: '9848033445', score: '78% (Pass)', docStatus: 'Pending TC Transfer', status: 'Document Review' },
      { appId: 'ADM-2026-004', name: 'CH. Charitha', class: 'I', prevSchool: 'Bright Stars Play School', parent: 'CH. Mohan', phone: '9848044556', score: 'Interview Cleared', docStatus: 'Verified', status: 'Ready for Enrolment' },
      { appId: 'ADM-2026-005', name: 'V. Aditya', class: 'IX', prevSchool: 'Bhashyam Public School', parent: 'V. Suresh Babu', phone: '9848055667', score: '84% (Distinction)', docStatus: 'Verified', status: 'Pending Interview' },
      { appId: 'ADM-2026-006', name: 'S. Harini', class: 'PP', prevSchool: 'Little Angels Play School', parent: 'S. Venkatesh', phone: '9848066778', score: 'Direct Admission', docStatus: 'Verified', status: 'Ready for Enrolment' }
    ],
    transfers: [
      { tcNo: 'TC-2026-001', name: 'P. Kiran Kumar', admNo: 'SV-0082', class: 'Class VIII-A', reason: 'Parent Job Transfer (To Hyderabad)', dues: 'Cleared (No Dues)', conduct: 'Exemplary', status: 'Issued', date: '18 Sep 2026' },
      { tcNo: 'TC-2026-002', name: 'R. Divya', admNo: 'SV-0119', class: 'Class V-A', reason: 'Relocation to Vijayawada', dues: 'Cleared (No Dues)', conduct: 'Very Good', status: 'Pending Principal Sign', date: '19 Sep 2026' },
      { tcNo: 'TC-2026-003', name: 'G. Harsha Vardhan', admNo: 'SV-0214', class: 'Class IX-A', reason: 'Enrolment in Sports Academy', dues: 'Library Book Pending', conduct: 'Good', status: 'On Hold (Library Due)', date: '17 Sep 2026' },
      { tcNo: 'TC-2026-004', name: 'A. Deepthi', admNo: 'SV-0309', class: 'Class X-A', reason: 'Course Completion (Class X)', dues: 'Cleared (No Dues)', conduct: 'Exemplary', status: 'Ready for Dispatch', date: '19 Sep 2026' }
    ],
    classGpaList: [
      { class: 'Class X-A', gpa: 9.67, pct: 96.7 },
      { class: 'Class IX-A', gpa: 9.00, pct: 90.0 },
      { class: 'Class VIII-A', gpa: 9.20, pct: 92.0 },
      { class: 'Class VII-A', gpa: 9.15, pct: 91.5 },
      { class: 'Class VI-A', gpa: 8.85, pct: 88.5 },
      { class: 'Class V-A', gpa: 9.40, pct: 94.0 },
      { class: 'Class IV-A', gpa: 8.90, pct: 89.0 },
      { class: 'Class III-A', gpa: 9.50, pct: 95.0 },
      { class: 'Class II-A', gpa: 9.30, pct: 93.0 },
      { class: 'Class I-A', gpa: 9.80, pct: 98.0 }
    ],
    topAchievers: [
      { rank: 1, name: 'P. Hema Latha', class: 'Class X-A', rollNo: '#1002', gpa: '10.0 / 10.0', distinction: 'Distinction (Maths & Sci 100%)', parent: 'P. Appala Naidu', medal: 'gold' },
      { rank: 2, name: 'T. Siri Varshini', class: 'Class III-A', rollNo: '#301', gpa: '9.9 / 10.0', distinction: 'Primary Wing 1st Ranker', parent: 'T. Srinivasa Rao', medal: 'silver' },
      { rank: 3, name: 'G. Sai Teja', class: 'Class X-A', rollNo: '#1001', gpa: '9.8 / 10.0', distinction: 'State Olympiad Silver', parent: 'G. Venkata Rao', medal: 'bronze' },
      { rank: 4, name: 'K. Tanvi Sree', class: 'Class I-A', rollNo: '#101', gpa: '9.8 / 10.0', distinction: 'Class I Topper (All A1)', parent: 'K. Ramana', medal: 'badge' },
      { rank: 5, name: 'S. Bhavana', class: 'Class VII-A', rollNo: '#701', gpa: '9.7 / 10.0', distinction: 'Best in English & Science', parent: 'S. Prasad', medal: 'badge' },
      { rank: 6, name: 'M. Sravanthi', class: 'Class IX-A', rollNo: '#901', gpa: '9.6 / 10.0', distinction: 'Class IX Topper', parent: 'M. Narayana Murthy', medal: 'badge' }
    ],
    faculty: [
      { name: 'Smt. Gorle Varalakshmi', role: 'Principal & Academic Director', qualification: 'M.Sc, M.Ed, M.Phil', exp: '22 Years', subject: 'Administration & Mathematics', status: 'Active', phone: '8106636230', email: 'srividyaschools2017@gmail.com' },
      { name: 'Sri Navva Anand', role: 'Vice Principal & Discipline Head', qualification: 'M.Sc (Physics), B.Ed', exp: '17 Years', subject: 'Physical Science & Administration', status: 'Active', phone: '9966422096', email: 'navva.anand@srividya.edu' },
      { name: 'Smt. M. Sunitha', role: 'Senior Faculty & English HOD', qualification: 'M.A (English Lit), B.Ed', exp: '14 Years', subject: 'English & Communication', status: 'Present', phone: '9848011221', email: 'sunitha.m@srividya.edu' },
      { name: 'Sri P. Satyanarayana', role: 'Senior Faculty & Maths HOD', qualification: 'M.Sc (Mathematics), B.Ed', exp: '15 Years', subject: 'High School Mathematics', status: 'Present', phone: '9848022332', email: 'satya.p@srividya.edu' },
      { name: 'Sri K. Rajesh', role: 'Faculty - Physical Science', qualification: 'M.Sc (Physics), B.Ed', exp: '9 Years', subject: 'Physics & Chemistry', status: 'On Leave', phone: '9848033443', email: 'rajesh.k@srividya.edu' },
      { name: 'Smt. S. Lakshmi', role: 'Faculty - Biological Science', qualification: 'M.Sc (Botany), B.Ed', exp: '11 Years', subject: 'Biology & Environmental Studies', status: 'Present', phone: '9848044554', email: 'lakshmi.s@srividya.edu' },
      { name: 'Sri R. Venkata Ramana', role: 'Senior Faculty - Social Studies', qualification: 'M.A (History & Pol. Sci), B.Ed', exp: '16 Years', subject: 'Social Sciences & Civics', status: 'Present', phone: '9848055665', email: 'ramana.r@srividya.edu' },
      { name: 'Sri D. Srinivas', role: 'Faculty & Computer Lab Incharge', qualification: 'MCA, B.Ed', exp: '8 Years', subject: 'Computer Applications & Coding', status: 'Present', phone: '9848066776', email: 'srinivas.d@srividya.edu' },
      { name: 'Smt. G. Sarada', role: 'Faculty - First Language (Telugu)', qualification: 'M.A (Telugu Lit), TPT', exp: '13 Years', subject: 'Telugu Language & Literature', status: 'Present', phone: '9848077887', email: 'sarada.g@srividya.edu' },
      { name: 'Smt. B. Meenakshi', role: 'Faculty - Second Language (Hindi)', qualification: 'M.A (Hindi), HPT', exp: '10 Years', subject: 'Hindi Rashtrabhasha', status: 'Present', phone: '9848088998', email: 'meenakshi.b@srividya.edu' },
      { name: 'Sri V. Ramesh Babu', role: 'Physical Education Director (PET)', qualification: 'M.P.Ed, NIS Coach', exp: '12 Years', subject: 'Sports, Athletics & Yoga', status: 'Present', phone: '9848099009', email: 'ramesh.pet@srividya.edu' },
      { name: 'Smt. K. Anitha', role: 'Primary Wing Coordinator', qualification: 'B.Sc, B.Ed', exp: '10 Years', subject: 'Primary Mathematics & EVS', status: 'Present', phone: '9848100110', email: 'anitha.k@srividya.edu' }
    ],
    feeTransactions: [
      { receiptNo: 'RCPT-2026-4891', student: 'P. Hema Latha', class: 'Class X-A', term: 'Term 2 Tuition', amount: '₹14,500', mode: 'UPI (PhonePe)', date: 'Today, 11:20 AM', cashier: 'S. Ramu' },
      { receiptNo: 'RCPT-2026-4890', student: 'M. Sravanthi', class: 'Class IX-A', term: 'Term 2 + Computer Fee', amount: '₹16,000', mode: 'Net Banking', date: 'Today, 10:45 AM', cashier: 'S. Ramu' },
      { receiptNo: 'RCPT-2026-4889', student: 'K. Tanvi Sree', class: 'Class I-A', term: 'Term 2 Tuition', amount: '₹11,000', mode: 'Cash', date: 'Today, 09:50 AM', cashier: 'B. Krishna' },
      { receiptNo: 'RCPT-2026-4888', student: 'CH. Karthik', class: 'Class VIII-A', term: 'Term 1 Balance Due', amount: '₹6,500', mode: 'UPI (GooglePay)', date: 'Yesterday, 04:15 PM', cashier: 'S. Ramu' },
      { receiptNo: 'RCPT-2026-4887', student: 'V. Divya Bharathi', class: 'Class VIII-A', term: 'Term 2 Tuition', amount: '₹13,500', mode: 'Cheque (#881023)', date: 'Yesterday, 02:30 PM', cashier: 'B. Krishna' },
      { receiptNo: 'RCPT-2026-4886', student: 'Y. Manjunath', class: 'Class VI-A', term: 'Annual Transport Fee', amount: '₹8,000', mode: 'UPI (Paytm)', date: 'Sept 17, 11:10 AM', cashier: 'S. Ramu' },
      { receiptNo: 'RCPT-2026-4885', student: 'T. Siri Varshini', class: 'Class III-A', term: 'Term 2 Tuition', amount: '₹12,000', mode: 'Cash', date: 'Sept 17, 10:00 AM', cashier: 'B. Krishna' }
    ],
    // Total Students across all classes = exactly 855 members (Section A only)
    classAttendance: [
      { class: 'Class X-A', total: 78, present: 75, absent: 3, leave: 0, pct: '96.2%', teacher: 'Smt. M. Sunitha', status: 'Submitted' },
      { class: 'Class IX-A', total: 82, present: 79, absent: 3, leave: 0, pct: '96.3%', teacher: 'Sri K. Rajesh', status: 'Submitted' },
      { class: 'Class VIII-A', total: 84, present: 81, absent: 3, leave: 0, pct: '96.4%', teacher: 'Sri R. Venkata Ramana', status: 'Submitted' },
      { class: 'Class VII-A', total: 86, present: 83, absent: 3, leave: 0, pct: '96.5%', teacher: 'Smt. G. Sarada', status: 'Submitted' },
      { class: 'Class VI-A', total: 88, present: 85, absent: 3, leave: 0, pct: '96.6%', teacher: 'Smt. B. Meenakshi', status: 'Submitted' },
      { class: 'Class V-A', total: 75, present: 72, absent: 3, leave: 0, pct: '96.0%', teacher: 'Smt. K. Anitha', status: 'Submitted' },
      { class: 'Class IV-A', total: 72, present: 69, absent: 3, leave: 0, pct: '95.8%', teacher: 'Sri P. Satyanarayana', status: 'Submitted' },
      { class: 'Class III-A', total: 70, present: 68, absent: 2, leave: 0, pct: '97.1%', teacher: 'Sri D. Srinivas', status: 'Submitted' },
      { class: 'Class II-A', total: 68, present: 66, absent: 2, leave: 0, pct: '97.1%', teacher: 'Smt. S. Lakshmi', status: 'Submitted' },
      { class: 'Class I-A', total: 66, present: 64, absent: 2, leave: 0, pct: '97.0%', teacher: 'Sri V. Ramesh Babu', status: 'Submitted' },
      { class: 'Pre-Primary-A', total: 86, present: 80, absent: 6, leave: 0, pct: '93.0%', teacher: 'Early Childhood Wing', status: 'Submitted' }
    ],
    events: [
      { title: 'Quarterly Examinations 2026', date: 'Sept 24 - Oct 01, 2026', tag: 'Exams', desc: 'Comprehensive assessments for Classes I through X as per State Board guidelines.' },
      { title: 'Gandhi Jayanti & Swachh Vidya Drive', date: 'Oct 02, 2026', tag: 'Campus Event', desc: 'Patriotic assembly, essay writing, clean campus drive and social awareness rally.' },
      { title: 'Inter-House Athletic & Sports Meet', date: 'Oct 14 - 16, 2026', tag: 'Sports', desc: 'Track & field championships, kho-kho, volleyball, badminton and chess finals.' },
      { title: 'Children’s Day & Mega Science Expo', date: 'Nov 14, 2026', tag: 'Exhibition', desc: 'Interactive robotics, working science experiments, art showcase and cultural gala.' },
      { title: 'National Mathematics Day Celebration', date: 'Dec 22, 2026', tag: 'Academic', desc: 'Srinivasa Ramanujan memorial quiz competition, mental math olympiad and puzzles.' }
    ],
    disciplineIncidents: [
      { id: 'DIS-2026-042', student: 'B. Tarun Reddy', class: 'Class IX-A', category: 'Unauthorized Device / Mobile', severity: 'Moderate', description: 'Used mobile phone during biology practical period without authorization.', action: 'Device retained in VP custody; Parent conference scheduled for Monday 10:00 AM.', status: 'Open', date: 'Today, 11:15 AM' },
      { id: 'DIS-2026-041', student: 'CH. Karthik', class: 'Class VIII-A', category: 'Late Arrival / Gate Breach', severity: 'Minor', description: 'Arrived after 08:45 AM gate closure for 3rd time this week.', action: 'Morning assembly diary note signed; Warning letter dispatched to parents.', status: 'Open', date: 'Today, 08:52 AM' },
      { id: 'DIS-2026-040', student: 'P. Hema Latha', class: 'Class X-A', category: 'Exemplary Merit / Good Deed', severity: 'Merit', description: 'Achieved 1st Rank in District Mathematics Olympiad & guided peer group.', action: 'Merit certificate awarded in morning assembly by Vice Principal; +20 points.', status: 'Resolved', date: 'Yesterday' }
    ],
    facultyLeaves: [
      { id: 1, name: 'Sri K. Rajesh', dept: 'Physical Science', type: 'Medical Leave', dates: 'Sept 21 – 22 (2 Days)', substitute: 'Sri Navva Anand & Smt. S. Lakshmi', reason: 'Viral fever & throat infection recovery.', status: 'Pending VP Recommendation' },
      { id: 2, name: 'Smt. K. Anitha', dept: 'Primary Mathematics', type: 'Casual Leave', dates: 'Sept 23 (1 Day)', substitute: 'Smt. G. Sarada', reason: 'Family ceremony attendance.', status: 'Pending VP Recommendation' },
      { id: 3, name: 'Sri V. Ramesh Babu', dept: 'Physical Education', type: 'On Duty (OD)', dates: 'Sept 25 (1 Day)', substitute: 'Sri D. Srinivas', reason: 'Accompanying district badminton team for inter-school meet.', status: 'Pending VP Recommendation' }
    ]
  };

  // Role Metadata
  const roleConfigs = {
    'principal': {
      title: 'Principal',
      holder: 'Smt. Gorle Varalakshmi',
      avatarIcon: 'fa-solid fa-user-tie',
      greeting: 'Good Morning, Principal',
      subtext: 'Overview of Sri Vidya E.M High School operations, live campus metrics, and pending executive actions for today.',
      badgeText: 'PRINCIPAL EXECUTIVE PORTAL'
    },
    'vice-principal': {
      title: 'Vice Principal',
      holder: 'Sri Navva Anand',
      avatarIcon: 'fa-solid fa-user-check',
      greeting: 'Good Morning, Vice Principal',
      subtext: 'Academic timetable monitoring, campus discipline oversight, daily faculty substitution, and student attendance tracking.',
      badgeText: 'VICE PRINCIPAL PORTAL'
    },
    'admin': {
      title: 'Office / Clerk',
      holder: 'Office Staff & Accounts',
      avatarIcon: 'fa-solid fa-id-badge',
      greeting: 'Good Morning, Office Administrator / Clerk',
      subtext: 'Daily fee counter, new admissions queue, transfer certificates, parent communication logs, and official records.',
      badgeText: 'SCHOOL OFFICE & CLERK PORTAL'
    }
  };

  // Initialization
  function init() {
    setupDate();
    setupTheme();
    renderAllTables();
    bindEvents();
    setupHashRouting();

    // Restore saved role if present
    try {
      let savedRole = sessionStorage.getItem('sv_role_management');
      if (savedRole === 'vp' || savedRole === 'viceprincipal') savedRole = 'vice-principal';
      if (savedRole === 'clerk' || savedRole === 'office') savedRole = 'admin';
      if (savedRole && roleConfigs[savedRole]) {
        switchRole(savedRole);
      }
    } catch (e) {}
  }

  function setupDate() {
    const dateEl = document.getElementById('liveDateText');
    if (dateEl) {
      const now = new Date();
      const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
      dateEl.textContent = now.toLocaleDateString('en-US', options);
    }
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
      if (theme === 'dark') {
        icon.className = 'fa-solid fa-sun theme-icon';
      } else {
        icon.className = 'fa-solid fa-moon theme-icon';
      }
    }
  }

  function bindEvents() {
    // Role switcher
    const roleSelect = document.getElementById('roleSelect');
    if (roleSelect) {
      roleSelect.addEventListener('change', function (e) {
        switchRole(e.target.value);
      });
    }

    // Theme toggle
    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) {
      themeBtn.addEventListener('click', toggleTheme);
    }

    // Mobile sidebar toggle
    const mobileToggle = document.getElementById('mobileSidebarToggle');
    const sidebar = document.getElementById('portalSidebar');
    if (mobileToggle && sidebar) {
      mobileToggle.addEventListener('click', function () {
        sidebar.classList.toggle('mobile-open');
      });
    }

    // Universal Search Shortcut
    window.addEventListener('keydown', function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('portalUniversalSearch');
        if (searchInput) searchInput.focus();
      }
    });

    // Search input handler
    const searchInput = document.getElementById('portalUniversalSearch');
    if (searchInput) {
      searchInput.addEventListener('input', function (e) {
        handleUniversalSearch(e.target.value);
      });
    }

    // Notification bell flyout toggle
    const notifBell = document.getElementById('notifBellBtn');
    const notifFlyout = document.getElementById('notifFlyout');
    if (notifBell && notifFlyout) {
      notifBell.addEventListener('click', function (e) {
        e.stopPropagation();
        notifFlyout.classList.toggle('active');
      });
      document.addEventListener('click', function (e) {
        if (!notifFlyout.contains(e.target) && e.target !== notifBell) {
          notifFlyout.classList.remove('active');
        }
      });
    }

    // Mark all read
    const markAllRead = document.getElementById('markAllRead');
    if (markAllRead) {
      markAllRead.addEventListener('click', function () {
        const unreadItems = document.querySelectorAll('.notif-item.unread');
        unreadItems.forEach(item => item.classList.remove('unread'));
        const badge = document.getElementById('headerNotifCount');
        if (badge) badge.style.display = 'none';
        showToast('All notifications marked as read', 'info');
      });
    }

    // Sidebar navigation items
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
    });
  }

  function setupHashRouting() {
    function handleHash() {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        const parts = hash.split('-');
        const module = parts[0];
        const sub = parts[1] || null;
        if (document.getElementById(`view-${module}`)) {
          navigateTo(module, sub);
        }
      }
    }
    window.addEventListener('hashchange', handleHash);
    handleHash();
  }

  function switchRole(roleKey) {
    if (roleKey === 'vp' || roleKey === 'viceprincipal') roleKey = 'vice-principal';
    if (roleKey === 'clerk' || roleKey === 'office') roleKey = 'admin';

    const config = roleConfigs[roleKey];
    if (!config) return;

    state.currentRole = roleKey;

    // Sync header dropdown if changed via button
    const roleSelect = document.getElementById('roleSelect');
    if (roleSelect && roleSelect.value !== roleKey) {
      roleSelect.value = roleKey;
    }

    // Sync dashboard pill buttons
    const pillButtons = document.querySelectorAll('.role-pill-btn');
    pillButtons.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-role') === roleKey);
    });

    // Update greeting & texts
    const greetingEl = document.getElementById('dashboardGreeting');
    if (greetingEl) greetingEl.textContent = config.greeting;

    const subtextEl = document.getElementById('dashboardSubtext');
    if (subtextEl) subtextEl.textContent = config.subtext;

    const badgeRoleEl = document.getElementById('bannerRoleBadge');
    if (badgeRoleEl) badgeRoleEl.textContent = config.badgeText;

    // Update breadcrumb if on dashboard
    const crumb = document.getElementById('currentPageCrumb');
    if (crumb && state.activeModule === 'dashboard') {
      crumb.textContent = `${config.title} Dashboard`;
    }

    // Update sidebar indicator
    const roleTitleEl = document.getElementById('sidebarRoleTitle');
    if (roleTitleEl) roleTitleEl.textContent = config.title;

    const roleHolderEl = document.getElementById('sidebarRoleHolder');
    if (roleHolderEl) roleHolderEl.textContent = config.holder;

    const roleAvatarEl = document.getElementById('sidebarRoleAvatar');
    if (roleAvatarEl) roleAvatarEl.innerHTML = `<i class="${config.avatarIcon}"></i>`;

    // Update sidebar user card
    const userDesig = document.getElementById('sidebarUserDesignation');
    if (userDesig) userDesig.textContent = config.title;

    const userName = document.getElementById('sidebarUserName');
    if (userName) userName.textContent = config.holder;

    const userAvatar = document.getElementById('sidebarUserAvatar');
    if (userAvatar) userAvatar.innerHTML = `<i class="${config.avatarIcon}"></i>`;

    // Role-specific view tweaks
    applyRolePermissions(roleKey);

    showToast(`Active Management Role: ${config.title} (${config.holder})`, 'success');
  }

  function applyRolePermissions(role) {
    if (role === 'vp' || role === 'viceprincipal') role = 'vice-principal';
    if (role === 'clerk' || role === 'office') role = 'admin';

    const approvalsCard = document.getElementById('cardPendingApprovals');
    const feesLimitedBanner = document.getElementById('feesLimitedBanner');
    const collectFeeBtn = document.getElementById('collectFeeBtn');
    const sidebarFeesBadge = document.getElementById('sidebarFeesBadge');
    const settingsLockedBanner = document.getElementById('settingsLockedBanner');
    const settingsFormCard = document.getElementById('settingsFormCard');
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');
    const navDisciplineBadge = document.getElementById('navDisciplineBadge');
    const vpPermissionsBar = document.getElementById('vpPermissionsBar');
    const officePermissionsBar = document.getElementById('officePermissionsBar');
    const metricCardFees = document.getElementById('metricCardFees');
    const metricCardVPDiscipline = document.getElementById('metricCardVPDiscipline');

    if (approvalsCard) {
      const titleBadge = approvalsCard.querySelector('.card-header-badge');
      if (role === 'admin') {
        if (titleBadge) titleBadge.textContent = 'Admin Forwarded';
      } else if (role === 'vice-principal') {
        if (titleBadge) titleBadge.textContent = `${state.pendingApprovalsCount} Actions (Academics & Discipline)`;
      } else {
        if (titleBadge) titleBadge.textContent = `${state.pendingApprovalsCount} Requiring Executive Action`;
      }
    }

    // Role-specific Metric 4 & Governance Display
    if (role === 'vice-principal') {
      // Show VP Permissions Governance Callout
      if (vpPermissionsBar) vpPermissionsBar.style.display = 'block';

      // Switch 4th Metric to Discipline & Leaves
      if (metricCardFees) metricCardFees.style.display = 'none';
      if (metricCardVPDiscipline) metricCardVPDiscipline.style.display = 'flex';

      // 1. Financial Reports & Fees -> LIMITED
      if (feesLimitedBanner) feesLimitedBanner.style.display = 'flex';
      if (sidebarFeesBadge) sidebarFeesBadge.style.display = 'inline-block';
      if (collectFeeBtn) {
        collectFeeBtn.disabled = true;
        collectFeeBtn.style.opacity = '0.5';
        collectFeeBtn.title = 'Restricted: Fee collection authorized for Principal & Accounts Office only';
      }

      // 2. School Configuration & Settings -> NO / LIMITED
      if (settingsLockedBanner) settingsLockedBanner.style.display = 'flex';
      if (settingsFormCard) settingsFormCard.classList.add('perm-locked');
      if (saveSettingsBtn) {
        saveSettingsBtn.disabled = true;
        saveSettingsBtn.style.opacity = '0.5';
        saveSettingsBtn.title = 'Institutional settings locked (Principal Authorization Required)';
      }

      // 3. Discipline & Academics -> HIGHLIGHT FOCUS
      if (navDisciplineBadge) {
        navDisciplineBadge.style.display = 'inline-block';
        navDisciplineBadge.textContent = 'VP Focus';
      }

      showToast('Vice Principal Mode Active: Full Academic & Discipline Access; Financial & System Config Limited', 'info');
    } else if (role === 'principal') {
      // Full Unrestricted Executive Access
      if (vpPermissionsBar) vpPermissionsBar.style.display = 'none';

      // Switch 4th Metric back to Fees
      if (metricCardFees) metricCardFees.style.display = 'flex';
      if (metricCardVPDiscipline) metricCardVPDiscipline.style.display = 'none';

      if (feesLimitedBanner) feesLimitedBanner.style.display = 'none';
      if (sidebarFeesBadge) sidebarFeesBadge.style.display = 'none';
      if (collectFeeBtn) {
        collectFeeBtn.disabled = false;
        collectFeeBtn.style.opacity = '1';
        collectFeeBtn.title = 'Open Fee Collection Counter';
      }

      if (settingsLockedBanner) settingsLockedBanner.style.display = 'none';
      if (settingsFormCard) settingsFormCard.classList.remove('perm-locked');
      if (saveSettingsBtn) {
        saveSettingsBtn.disabled = false;
        saveSettingsBtn.style.opacity = '1';
        saveSettingsBtn.title = 'Save Configuration';
      }

      if (navDisciplineBadge) {
        navDisciplineBadge.style.display = 'inline-block';
        navDisciplineBadge.textContent = 'Active';
      }
    } else if (role === 'admin') {
      // Admin / Office Clerk Mode
      if (vpPermissionsBar) vpPermissionsBar.style.display = 'none';
      if (officePermissionsBar) officePermissionsBar.style.display = 'block';

      if (metricCardFees) metricCardFees.style.display = 'flex';
      if (metricCardVPDiscipline) metricCardVPDiscipline.style.display = 'none';

      if (feesLimitedBanner) feesLimitedBanner.style.display = 'none';
      if (sidebarFeesBadge) sidebarFeesBadge.style.display = 'none';
      if (collectFeeBtn) {
        collectFeeBtn.disabled = false;
        collectFeeBtn.style.opacity = '1';
        collectFeeBtn.title = 'Open Fee Collection Counter';
      }

      if (settingsLockedBanner) settingsLockedBanner.style.display = 'flex';
      if (settingsFormCard) settingsFormCard.classList.add('perm-locked');
      if (saveSettingsBtn) {
        saveSettingsBtn.disabled = true;
        saveSettingsBtn.style.opacity = '0.5';
        saveSettingsBtn.title = 'Institutional settings locked (Principal Authorization Required)';
      }

      showToast('Office / Clerk Mode Active: Fee Counter, Admissions & Records Access', 'info');
    }
  }

  function navigateTo(moduleKey, subKey) {
    const targetView = document.getElementById(`view-${moduleKey}`);
    if (!targetView) return;

    state.activeModule = moduleKey;

    // Update sidebar active class
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      if (item.getAttribute('data-module') === moduleKey) {
        item.classList.add('active');
        item.classList.add('open');
      } else {
        item.classList.remove('active');
      }
    });

    // Hide all views, show targeted view
    const allViews = document.querySelectorAll('.portal-view');
    allViews.forEach(v => v.classList.remove('active'));
    targetView.classList.add('active');

    // Update breadcrumb
    const crumb = document.getElementById('currentPageCrumb');
    if (crumb) {
      const moduleName = moduleKey.charAt(0).toUpperCase() + moduleKey.slice(1);
      crumb.textContent = moduleKey === 'dashboard' ? `${roleConfigs[state.currentRole].title} Dashboard` : moduleName;
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Handle sub-tab if specified
    if (subKey) {
      switchSubTab(moduleKey, subKey);
    }
  }

  function switchSubTab(moduleKey, subKey) {
    state.activeSubTab[moduleKey] = subKey;
    const moduleSection = document.getElementById(`view-${moduleKey}`);
    if (!moduleSection) return;

    // Toggle active class on tab buttons
    const tabStrip = moduleSection.querySelector('.tab-strip');
    if (tabStrip) {
      const buttons = tabStrip.querySelectorAll('.tab-btn');
      buttons.forEach(btn => {
        const btnSub = btn.getAttribute('data-sub');
        if (btnSub === subKey || (btn.textContent && btn.textContent.toLowerCase().includes(subKey.toLowerCase()))) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }

    // Toggle subview containers for students module
    if (moduleKey === 'students') {
      const subviews = moduleSection.querySelectorAll('.student-subview');
      subviews.forEach(sv => {
        if (sv.id === `subview-students-${subKey}`) {
          sv.style.display = 'block';
          sv.classList.add('active');
        } else {
          sv.style.display = 'none';
          sv.classList.remove('active');
        }
      });

      // Render content based on selected subtab
      if (subKey === 'all') {
        renderStudentsTable(state.students);
      } else if (subKey === 'profiles') {
        renderStudentProfiles(state.students);
      } else if (subKey === 'admissions') {
        renderAdmissionsQueue(state.admissions);
      } else if (subKey === 'transfers') {
        renderTransfersTable(state.transfers);
      } else if (subKey === 'performance') {
        renderAcademicPerformance();
      }

      updateStudentTabBadges();
    }

    showToast(`Switched view to ${moduleKey} → ${subKey}`, 'info');
  }

  function updateStudentTabBadges() {
    // Dynamic counts that strictly match list length
    const allBadge = document.getElementById('allStudentsCountBadge');
    if (allBadge) allBadge.textContent = state.students.length;

    const totalCountEl = document.getElementById('studentTotalCount');
    if (totalCountEl) totalCountEl.textContent = state.students.length;

    const profilesBadge = document.getElementById('studentProfilesCountBadge');
    if (profilesBadge) profilesBadge.textContent = state.students.length;

    const admBadge = document.getElementById('admissionsCountBadge');
    if (admBadge) admBadge.textContent = state.admissions.length;

    const admStatCount = document.getElementById('admQueueStatCount');
    if (admStatCount) admStatCount.textContent = state.admissions.length;

    const tcBadge = document.getElementById('transfersCountBadge');
    if (tcBadge) tcBadge.textContent = state.transfers.length;

    const tcStatCount = document.getElementById('tcQueueStatCount');
    if (tcStatCount) tcStatCount.textContent = state.transfers.length;
  }

  function renderAllTables() {
    renderStudentsTable(state.students);
    renderStudentProfiles(state.students);
    renderAdmissionsQueue(state.admissions);
    renderTransfersTable(state.transfers);
    renderAcademicPerformance();
    updateStudentTabBadges();

    renderStaffGrid(state.faculty);
    renderFeeTransactions(state.feeTransactions);
    renderAttendanceClasses(state.classAttendance);
    renderEvents(state.events);
    renderDisciplineIncidents(state.disciplineIncidents);
    renderVPLeaves(state.facultyLeaves);
  }

  // Helpers for sequential admission numbers & Section A enforcement
  function sortStudentsByAdmNo(arr) {
    return [...arr].sort((a, b) => a.admNo.localeCompare(b.admNo, undefined, { numeric: true, sensitivity: 'base' }));
  }

  function getNextAdmissionNumber() {
    let maxNum = 0;
    state.students.forEach(s => {
      const match = s.admNo.match(/(\d+)/);
      if (match) {
        const n = parseInt(match[1], 10);
        if (n > maxNum) maxNum = n;
      }
    });
    return 'SV-' + String(maxNum + 1).padStart(4, '0');
  }

  function renderStudentsTable(list) {
    const tbody = document.getElementById('studentsTableBody');
    if (!tbody) return;

    // Strict ascending order by Admission Number
    const sortedList = sortStudentsByAdmNo(list);

    // Update Showing counter & Tab Badge to strictly match current rows
    const showingEl = document.getElementById('studentShowingCount');
    if (showingEl) showingEl.textContent = sortedList.length;

    const allBadge = document.getElementById('allStudentsCountBadge');
    if (allBadge) allBadge.textContent = sortedList.length;

    if (sortedList.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding: 2.5rem; color: var(--color-text-muted);"><i class="fa-solid fa-user-slash" style="font-size: 1.5rem; margin-bottom: 0.5rem; display:block;"></i>No student records matched your search query.</td></tr>`;
      return;
    }

    tbody.innerHTML = sortedList.map(student => {
      let badgeClass = 'badge-success';
      if (student.feeStatus === 'Pending') badgeClass = 'badge-danger';
      if (student.feeStatus === 'Partial') badgeClass = 'badge-warning';

      return `
        <tr>
          <td><strong class="text-primary">${student.admNo}</strong></td>
          <td>
            <div class="user-cell">
              <div class="cell-avatar">${student.name.charAt(0)}</div>
              <div>
                <strong>${student.name}</strong>
                <small class="d-block text-muted">GPA: ${student.gpa}</small>
              </div>
            </div>
          </td>
          <td>Class ${student.class}-${student.section}</td>
          <td>#${student.rollNo}</td>
          <td>${student.parent}</td>
          <td><a href="tel:${student.phone}" class="phone-link"><i class="fa-solid fa-phone"></i> ${student.phone}</a></td>
          <td>
            <div class="att-cell">
              <strong>${student.attendance}</strong>
              <div class="mini-track"><div class="mini-bar bg-emerald" style="width: ${student.attendance}"></div></div>
            </div>
          </td>
          <td><span class="portal-badge ${badgeClass}">${student.feeStatus}</span></td>
          <td>
            <div class="table-action-btns">
              <button class="action-icon-btn" onclick="portalApp.viewStudentProfile('${student.admNo}')" title="View Full Dossier">
                <i class="fa-regular fa-eye"></i>
              </button>
              <button class="action-icon-btn" onclick="portalApp.showToast('Generating ID card & Marks Card for ${student.name}', 'info')" title="Print Documents">
                <i class="fa-solid fa-print"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  function filterStudents() {
    const query = (document.getElementById('studentFilterInput')?.value || '').toLowerCase().trim();
    const classVal = document.getElementById('studentClassFilter')?.value || '';
    const sectionVal = document.getElementById('studentSectionFilter')?.value || '';
    const feeVal = document.getElementById('studentFeeFilter')?.value || '';

    const filtered = state.students.filter(student => {
      const matchQuery = !query ||
        student.name.toLowerCase().includes(query) ||
        student.admNo.toLowerCase().includes(query) ||
        student.parent.toLowerCase().includes(query) ||
        student.phone.includes(query) ||
        student.rollNo.includes(query);

      const matchClass = !classVal || student.class === classVal;
      const matchSection = !sectionVal || student.section === sectionVal;
      const matchFee = !feeVal || student.feeStatus === feeVal;

      return matchQuery && matchClass && matchSection && matchFee;
    });

    renderStudentsTable(filtered);
  }

  function resetStudentFilters() {
    const searchInput = document.getElementById('studentFilterInput');
    const classSelect = document.getElementById('studentClassFilter');
    const sectionSelect = document.getElementById('studentSectionFilter');
    const feeSelect = document.getElementById('studentFeeFilter');

    if (searchInput) searchInput.value = '';
    if (classSelect) classSelect.value = '';
    if (sectionSelect) sectionSelect.value = '';
    if (feeSelect) feeSelect.value = '';

    renderStudentsTable(state.students);
    showToast('Filters reset to default view', 'info');
  }

  // Student Profiles Subview
  function renderStudentProfiles(list) {
    const grid = document.getElementById('studentProfilesGrid');
    if (!grid) return;

    // Strict ascending order by Admission Number
    const sortedList = sortStudentsByAdmNo(list);

    const showingCount = document.getElementById('profilesShowingCount');
    if (showingCount) showingCount.textContent = sortedList.length;

    const profilesBadge = document.getElementById('studentProfilesCountBadge');
    if (profilesBadge) profilesBadge.textContent = sortedList.length;

    if (sortedList.length === 0) {
      grid.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: var(--color-bg-surface); border-radius: 12px; border: 1px solid var(--color-border); color: var(--color-text-muted);">
        <i class="fa-solid fa-id-card-clip" style="font-size: 2rem; margin-bottom: 0.75rem; display:block;"></i>
        No student dossiers matched your search filters.
      </div>`;
      return;
    }

    grid.innerHTML = sortedList.map(student => {
      let badgeClass = 'badge-success';
      if (student.feeStatus === 'Pending') badgeClass = 'badge-danger';
      if (student.feeStatus === 'Partial') badgeClass = 'badge-warning';

      return `
        <div class="student-profile-card">
          <div class="profile-card-top">
            <div class="profile-card-avatar">${student.name.charAt(0)}</div>
            <div class="profile-card-identity">
              <h4>${student.name}</h4>
              <div class="profile-card-tags">
                <span class="profile-tag tag-primary">Class ${student.class}-${student.section}</span>
                <span class="profile-tag">#${student.rollNo}</span>
                <span class="profile-tag tag-gpa">GPA: ${student.gpa}</span>
              </div>
            </div>
          </div>

          <div class="profile-card-stats">
            <div class="profile-stat-box">
              <span class="stat-label">Attendance Rate</span>
              <span class="stat-val text-emerald">${student.attendance}</span>
            </div>
            <div class="profile-stat-box">
              <span class="stat-label">Fee Clearance</span>
              <span class="stat-val"><span class="portal-badge ${badgeClass}">${student.feeStatus}</span></span>
            </div>
          </div>

          <div class="profile-card-details">
            <div class="profile-detail-row">
              <span class="label"><i class="fa-solid fa-id-badge"></i> Adm No:</span>
              <span class="val text-primary"><strong>${student.admNo}</strong></span>
            </div>
            <div class="profile-detail-row">
              <span class="label"><i class="fa-solid fa-user-shield"></i> Parent:</span>
              <span class="val">${student.parent}</span>
            </div>
            <div class="profile-detail-row">
              <span class="label"><i class="fa-solid fa-phone"></i> Contact:</span>
              <span class="val"><a href="tel:${student.phone}" class="phone-link"><i class="fa-solid fa-phone"></i> ${student.phone}</a></span>
            </div>
          </div>

          <div class="profile-card-actions">
            <button type="button" class="btn btn-secondary btn-sm" onclick="portalApp.viewStudentProfile('${student.admNo}')">
              <i class="fa-regular fa-eye"></i> View Full Dossier
            </button>
            <button type="button" class="btn btn-primary btn-sm" onclick="portalApp.showToast('Generating official ID Card for ${student.name}', 'success')">
              <i class="fa-solid fa-print"></i> ID Card
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  function filterStudentProfiles() {
    const query = (document.getElementById('profileSearchInput')?.value || '').toLowerCase().trim();
    const classVal = document.getElementById('profileClassFilter')?.value || '';

    const filtered = state.students.filter(s => {
      const matchQuery = !query ||
        s.name.toLowerCase().includes(query) ||
        s.admNo.toLowerCase().includes(query) ||
        s.parent.toLowerCase().includes(query) ||
        s.rollNo.includes(query);

      const matchClass = !classVal || s.class === classVal;

      return matchQuery && matchClass;
    });

    renderStudentProfiles(filtered);
  }

  // Admissions Queue Subview
  function renderAdmissionsQueue(list) {
    const tbody = document.getElementById('admissionsTableBody');
    if (!tbody) return;

    const countBadge = document.getElementById('admissionsCountBadge');
    if (countBadge) countBadge.textContent = list.length;

    const statCount = document.getElementById('admQueueStatCount');
    if (statCount) statCount.textContent = list.length;

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding: 2.5rem; color: var(--color-text-muted);"><i class="fa-solid fa-circle-check text-emerald" style="font-size: 1.5rem; margin-bottom: 0.5rem; display:block;"></i>All admissions applications have been processed and confirmed.</td></tr>`;
      return;
    }

    tbody.innerHTML = list.map(item => `
      <tr id="adm-row-${item.appId}">
        <td><strong class="text-primary">${item.appId}</strong></td>
        <td>
          <div class="user-cell">
            <div class="cell-avatar">${item.name.charAt(0)}</div>
            <div>
              <strong>${item.name}</strong>
            </div>
          </div>
        </td>
        <td><strong>Class ${item.class}</strong></td>
        <td>${item.prevSchool}</td>
        <td>
          <div>${item.parent}</div>
          <a href="tel:${item.phone}" class="phone-link"><i class="fa-solid fa-phone"></i> ${item.phone}</a>
        </td>
        <td><span class="portal-badge badge-success">${item.score}</span></td>
        <td><span class="portal-badge ${item.docStatus === 'Verified' ? 'badge-success' : 'badge-warning'}">${item.docStatus}</span></td>
        <td><span class="portal-badge ${item.status.includes('Approved') ? 'badge-success' : 'badge-warning'}">${item.status}</span></td>
        <td>
          <div class="table-action-btns">
            <button class="btn btn-primary btn-sm" onclick="portalApp.approveAdmission('${item.appId}')" title="Approve & Grant Enrolment">
              <i class="fa-solid fa-check"></i> Approve
            </button>
            <button class="action-icon-btn" onclick="portalApp.reviewAdmissionDocs('${item.appId}')" title="Review Verified Certificates">
              <i class="fa-regular fa-file-lines"></i>
            </button>
            <button class="action-icon-btn" onclick="portalApp.rejectAdmission('${item.appId}')" title="Reject Application" style="color:var(--color-accent-red);">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  function approveAdmission(appId) {
    const applicant = state.admissions.find(a => a.appId === appId);
    if (applicant) {
      applicant.status = 'Approved - Admission Confirmed';
      renderAdmissionsQueue(state.admissions);
      showToast(`Admission approved for ${applicant.name} (Class ${applicant.class}). Welcome kit triggered!`, 'success');
    }
  }

  function reviewAdmissionDocs(appId) {
    const applicant = state.admissions.find(a => a.appId === appId);
    if (applicant) {
      showToast(`Document Verification for ${applicant.name}: Birth Certificate, Previous Marks Card & TC verified successfully.`, 'info');
    }
  }

  function rejectAdmission(appId) {
    const index = state.admissions.findIndex(a => a.appId === appId);
    if (index > -1) {
      const name = state.admissions[index].name;
      state.admissions.splice(index, 1);
      renderAdmissionsQueue(state.admissions);
      updateStudentTabBadges();
      showToast(`Application ${appId} for ${name} removed from queue.`, 'warning');
    }
  }

  // Transfers (TC) Subview
  function renderTransfersTable(list) {
    const tbody = document.getElementById('transfersTableBody');
    if (!tbody) return;

    const countBadge = document.getElementById('transfersCountBadge');
    if (countBadge) countBadge.textContent = list.length;

    const statCount = document.getElementById('tcQueueStatCount');
    if (statCount) statCount.textContent = list.length;

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding: 2.5rem; color: var(--color-text-muted);">No active Transfer Certificate requests.</td></tr>`;
      return;
    }

    tbody.innerHTML = list.map(item => `
      <tr>
        <td><strong class="text-primary">${item.tcNo}</strong></td>
        <td><strong>${item.name}</strong></td>
        <td><small class="text-muted">${item.admNo}</small></td>
        <td>${item.class}</td>
        <td>${item.reason}</td>
        <td>
          <span class="portal-badge ${item.dues.includes('Cleared') ? 'badge-success' : 'badge-warning'}">
            ${item.dues}
          </span>
        </td>
        <td><strong>${item.conduct}</strong></td>
        <td>
          <span class="portal-badge ${item.status === 'Issued' ? 'badge-success' : item.status === 'On Hold (Library Due)' ? 'badge-danger' : 'badge-warning'}">
            ${item.status}
          </span>
        </td>
        <td>
          <div class="table-action-btns">
            <button class="btn btn-primary btn-sm" onclick="portalApp.printTC('${item.tcNo}')" title="Print Official TC Document">
              <i class="fa-solid fa-print"></i> Print TC
            </button>
            <button class="action-icon-btn" onclick="portalApp.downloadTCPdf('${item.tcNo}')" title="Download Signed PDF">
              <i class="fa-solid fa-file-arrow-down"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  function printTC(tcNo) {
    const tc = state.transfers.find(t => t.tcNo === tcNo);
    if (tc) {
      showToast(`Dispatching ${tc.tcNo} for ${tc.name} to Institutional Laser Printer...`, 'success');
    }
  }

  function downloadTCPdf(tcNo) {
    showToast(`Downloading certified digital TC copy for ${tcNo}...`, 'info');
  }

  // Academic Performance & Charts Subview
  function renderAcademicPerformance() {
    // 1. Render Bar Chart
    const barContainer = document.getElementById('classGpaBarChart');
    if (barContainer && state.classGpaList) {
      barContainer.innerHTML = state.classGpaList.map(item => {
        const heightPct = Math.round((item.gpa / 10.0) * 100);
        return `
          <div class="v-bar-col">
            <div class="v-bar-pillar" style="height: ${heightPct}%;" title="${item.class}: ${item.gpa} GPA (${item.pct}%)">
              <span class="v-bar-val">${item.gpa}</span>
            </div>
            <span class="v-bar-label">${item.class.replace('Class ', '')}</span>
          </div>
        `;
      }).join('');
    }

    // 2. Render Top Achievers Leaderboard
    const achieversTbody = document.getElementById('achieversTableBody');
    if (achieversTbody && state.topAchievers) {
      achieversTbody.innerHTML = state.topAchievers.map(achiever => {
        let medalIcon = '<i class="fa-solid fa-award" style="color: #64748B;"></i>';
        if (achiever.medal === 'gold') medalIcon = '<i class="fa-solid fa-medal" style="color: #EAB308; font-size: 1.15rem;"></i> Rank 1 (Gold)';
        else if (achiever.medal === 'silver') medalIcon = '<i class="fa-solid fa-medal" style="color: #94A3B8; font-size: 1.15rem;"></i> Rank 2 (Silver)';
        else if (achiever.medal === 'bronze') medalIcon = '<i class="fa-solid fa-medal" style="color: #B45309; font-size: 1.15rem;"></i> Rank 3 (Bronze)';
        else medalIcon = `<span class="portal-badge badge-primary">Rank ${achiever.rank}</span>`;

        return `
          <tr>
            <td><strong>${medalIcon}</strong></td>
            <td>
              <div class="user-cell">
                <div class="cell-avatar">${achiever.name.charAt(0)}</div>
                <strong>${achiever.name}</strong>
              </div>
            </td>
            <td><strong>${achiever.class}</strong></td>
            <td>${achiever.rollNo}</td>
            <td><strong class="text-emerald">${achiever.gpa}</strong></td>
            <td><span class="portal-badge badge-success">${achiever.distinction}</span></td>
            <td>${achiever.parent}</td>
            <td>
              <button class="btn btn-secondary btn-sm" onclick="portalApp.showToast('Generating Merit Certificate for ${achiever.name}', 'success')">
                <i class="fa-solid fa-certificate"></i> Merit Cert
              </button>
            </td>
          </tr>
        `;
      }).join('');
    }
  }

  function renderStaffGrid(list) {
    const container = document.getElementById('staffGridContainer');
    if (!container) return;

    container.innerHTML = list.map(member => {
      const initials = member.name.replace(/^(Smt\.|Sri\.)\s*/, '').split(' ').map(n => n[0]).join('').slice(0, 2);
      const isLead = member.role.includes('Principal') || member.role.includes('Vice Principal');
      return `
        <div class="staff-card ${isLead ? 'lead-card' : ''}">
          <div class="staff-card-header">
            <div class="staff-avatar">${initials}</div>
            <div class="staff-header-info">
              <h3 class="staff-name">${member.name}</h3>
              <span class="staff-role">${member.role}</span>
              <span class="portal-badge ${member.status === 'Present' || member.status === 'Active' ? 'badge-success' : 'badge-warning'}">${member.status}</span>
            </div>
          </div>
          <div class="staff-details">
            <div class="staff-detail-row">
              <span class="detail-label"><i class="fa-solid fa-graduation-cap"></i> Qualification:</span>
              <span class="detail-val">${member.qualification}</span>
            </div>
            <div class="staff-detail-row">
              <span class="detail-label"><i class="fa-solid fa-briefcase"></i> Experience:</span>
              <span class="detail-val">${member.exp}</span>
            </div>
            <div class="staff-detail-row">
              <span class="detail-label"><i class="fa-solid fa-book"></i> Primary Subject:</span>
              <span class="detail-val">${member.subject}</span>
            </div>
            <div class="staff-detail-row">
              <span class="detail-label"><i class="fa-solid fa-phone"></i> Contact:</span>
              <span class="detail-val"><a href="tel:${member.phone}">${member.phone}</a></span>
            </div>
          </div>
          <div class="staff-footer">
            <button class="btn-staff-action" onclick="portalApp.showToast('Assigning substitution schedule for ${member.name}', 'info')">
              <i class="fa-solid fa-calendar-check"></i> Assign Period
            </button>
            <button class="btn-staff-action outline" onclick="portalApp.showToast('Faculty Dossier opened for ${member.name}', 'info')">
              <i class="fa-regular fa-folder-open"></i> Dossier
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderFeeTransactions(list) {
    const tbody = document.getElementById('feeTransactionsTableBody');
    if (!tbody) return;

    tbody.innerHTML = list.map(tx => `
      <tr>
        <td><strong>${tx.receiptNo}</strong></td>
        <td><strong>${tx.student}</strong></td>
        <td>${tx.class}</td>
        <td>${tx.term}</td>
        <td><strong class="text-emerald">${tx.amount}</strong></td>
        <td><span class="portal-badge badge-primary">${tx.mode}</span></td>
        <td>${tx.date}</td>
        <td>${tx.cashier}</td>
        <td>
          <button class="btn-table-receipt" onclick="portalApp.showToast('Printing Official Fee Receipt ${tx.receiptNo}', 'success')">
            <i class="fa-solid fa-receipt"></i> Print
          </button>
        </td>
      </tr>
    `).join('');
  }

  function renderAttendanceClasses(list) {
    const tbody = document.getElementById('attendanceClassTableBody');
    if (!tbody) return;

    tbody.innerHTML = list.map(item => `
      <tr>
        <td><strong>${item.class}</strong></td>
        <td>${item.total}</td>
        <td><span class="text-emerald font-semibold">${item.present}</span></td>
        <td><span class="text-red font-semibold">${item.absent}</span></td>
        <td>${item.leave}</td>
        <td>
          <div class="att-bar-group">
            <strong>${item.pct}</strong>
            <div class="mini-track"><div class="mini-bar bg-blue" style="width: ${item.pct}"></div></div>
          </div>
        </td>
        <td>${item.teacher}</td>
        <td><span class="portal-badge badge-success"><i class="fa-solid fa-check"></i> ${item.status}</span></td>
      </tr>
    `).join('');
  }

  function renderEvents(list) {
    const container = document.getElementById('eventsContainer');
    if (!container) return;

    container.innerHTML = list.map(ev => `
      <div class="event-card-lg">
        <div class="event-card-top">
          <span class="portal-badge badge-primary">${ev.tag}</span>
          <span class="event-date-text"><i class="fa-regular fa-clock"></i> ${ev.date}</span>
        </div>
        <h3 class="event-card-title">${ev.title}</h3>
        <p class="event-card-desc">${ev.desc}</p>
        <div class="event-card-footer">
          <button class="btn btn-secondary btn-sm" onclick="portalApp.showToast('Event circular dispatched to all class teachers', 'info')">
            <i class="fa-solid fa-bullhorn"></i> Send Circular
          </button>
          <button class="btn btn-primary btn-sm" onclick="portalApp.showToast('Event details opened in editor', 'info')">
            <i class="fa-solid fa-pen-to-square"></i> Manage Event
          </button>
        </div>
      </div>
    `).join('');
  }

  // Approvals workflow
  function handleApproval(id, isApproved, message) {
    const itemEl = document.getElementById(`approval-item-${id}`);
    if (itemEl) {
      itemEl.style.transition = 'all 0.3s ease';
      itemEl.style.opacity = '0';
      itemEl.style.transform = 'translateX(20px)';
      setTimeout(() => {
        itemEl.remove();
        state.pendingApprovalsCount = Math.max(0, state.pendingApprovalsCount - 1);
        
        // Update badges
        const badge = document.getElementById('pendingCountBadge');
        if (badge) {
          badge.textContent = `${state.pendingApprovalsCount} Requiring Action`;
          if (state.pendingApprovalsCount === 0) {
            badge.className = 'card-header-badge badge-success';
            badge.textContent = 'All Actions Cleared';
          }
        }
        const notifBadge = document.getElementById('headerNotifCount');
        if (notifBadge) {
          notifBadge.textContent = state.pendingApprovalsCount;
          if (state.pendingApprovalsCount === 0) notifBadge.style.display = 'none';
        }
      }, 300);
    }

    if (isApproved) {
      showToast(message || 'Approved successfully and registered in audit log', 'success');
    } else {
      showToast(message || 'Request sent back for rectification', 'warning');
    }
  }

  // View Student Profile Modal
  function viewStudentProfile(admNo) {
    const student = state.students.find(s => s.admNo === admNo);
    if (!student) return;

    const modalBody = document.getElementById('viewStudentModalBody');
    if (!modalBody) return;

    modalBody.innerHTML = `
      <div class="student-profile-dossier">
        <div class="profile-header-strip">
          <div class="profile-avatar">${student.name.charAt(0)}</div>
          <div class="profile-title-block">
            <h2>${student.name}</h2>
            <div class="profile-meta-line">
              <span>Adm No: <strong>${student.admNo}</strong></span> • 
              <span>Class: <strong>${student.class} - ${student.section}</strong></span> • 
              <span>Roll No: <strong>#${student.rollNo}</strong></span>
            </div>
          </div>
        </div>

        <div class="profile-info-grid mt-4">
          <div class="info-group">
            <label>Parent / Guardian</label>
            <div class="info-val">${student.parent}</div>
          </div>
          <div class="info-group">
            <label>Emergency Contact</label>
            <div class="info-val"><a href="tel:${student.phone}">${student.phone}</a></div>
          </div>
          <div class="info-group">
            <label>Academic Year</label>
            <div class="info-val">2025 – 2026</div>
          </div>
          <div class="info-group">
            <label>Current Cumulative GPA</label>
            <div class="info-val text-primary font-bold">${student.gpa} / 10.0</div>
          </div>
          <div class="info-group">
            <label>Overall Attendance</label>
            <div class="info-val text-emerald font-bold">${student.attendance}</div>
          </div>
          <div class="info-group">
            <label>Tuition Fee Status</label>
            <div class="info-val"><span class="portal-badge ${student.feeStatus === 'Paid' ? 'badge-success' : 'badge-danger'}">${student.feeStatus}</span></div>
          </div>
        </div>

        <div class="profile-section-card mt-4">
          <h4>Academic Report Summary (Quarterly Exam 2026)</h4>
          <table class="data-table mt-2">
            <thead>
              <tr><th>Subject</th><th>Max Marks</th><th>Marks Scored</th><th>Grade</th></tr>
            </thead>
            <tbody>
              <tr><td>First Language (Telugu / Sanskrit)</td><td>100</td><td>96</td><td><span class="portal-badge badge-success">A1</span></td></tr>
              <tr><td>Second Language (Hindi)</td><td>100</td><td>92</td><td><span class="portal-badge badge-success">A1</span></td></tr>
              <tr><td>Third Language (English)</td><td>100</td><td>95</td><td><span class="portal-badge badge-success">A1</span></td></tr>
              <tr><td>Mathematics</td><td>100</td><td>98</td><td><span class="portal-badge badge-success">A1</span></td></tr>
              <tr><td>General Science (Physics & Biology)</td><td>100</td><td>94</td><td><span class="portal-badge badge-success">A1</span></td></tr>
              <tr><td>Social Studies</td><td>100</td><td>93</td><td><span class="portal-badge badge-success">A1</span></td></tr>
            </tbody>
          </table>
        </div>
      </div>
    `;

    openModal('viewStudentModal');
  }

  function printStudentDossier() {
    showToast('Dispatching Student Dossier to institutional print spooler...', 'success');
  }

  // New Student Admission Form Handler
  function handleNewStudent(e) {
    e.preventDefault();
    const name = document.getElementById('mStudentName')?.value;
    let admNo = (document.getElementById('mAdmNo')?.value || '').trim();
    const cls = document.getElementById('mClass')?.value || 'I';
    const parent = document.getElementById('mParentName')?.value || 'Guardian';
    const phone = document.getElementById('mParentPhone')?.value || '9848000000';
    const feeStatus = document.getElementById('mFeeStatus')?.value || 'Paid';

    if (!name) {
      showToast('Please fill all mandatory fields', 'warning');
      return;
    }

    // Format admission number cleanly if user typed unformatted digits like 1052
    if (!admNo.toUpperCase().startsWith('SV-')) {
      const num = admNo.replace(/\D/g, '');
      if (num) {
        admNo = 'SV-' + num.padStart(4, '0');
      } else {
        admNo = getNextAdmissionNumber();
      }
    } else {
      admNo = admNo.toUpperCase();
    }

    const newStudent = {
      admNo: admNo,
      name: name,
      class: cls,
      section: 'A', // Every class has only Section A
      rollNo: String(Math.floor(100 + Math.random() * 900)),
      parent: parent,
      phone: phone,
      attendance: '100%',
      feeStatus: feeStatus,
      gpa: '10.0'
    };

    state.students.push(newStudent);
    state.students.sort((a, b) => a.admNo.localeCompare(b.admNo, undefined, { numeric: true, sensitivity: 'base' }));

    renderStudentsTable(state.students);
    renderStudentProfiles(state.students);
    updateStudentTabBadges();

    closeModal('addStudentModal');
    e.target.reset();
    showToast(`Student ${name} successfully enrolled with Adm No: ${admNo} (Section A)!`, 'success');
  }

  // Universal Search
  function handleUniversalSearch(query) {
    const q = query.toLowerCase().trim();
    if (!q) return;

    // Search students
    const matchedStudent = state.students.find(s => 
      s.name.toLowerCase().includes(q) || 
      s.admNo.toLowerCase().includes(q) || 
      s.phone.includes(q)
    );

    // Search teachers
    const matchedFaculty = state.faculty.find(f => 
      f.name.toLowerCase().includes(q) || 
      f.subject.toLowerCase().includes(q)
    );

    if (matchedStudent) {
      navigateTo('students');
      const filterInput = document.getElementById('studentFilterInput');
      if (filterInput) {
        filterInput.value = q;
        filterStudents();
      }
    } else if (matchedFaculty) {
      navigateTo('teachers');
    }
  }

  // Instant Broadcast Handler
  function handleBroadcast(e) {
    e.preventDefault();
    const subject = document.getElementById('broadcastSubject')?.value;
    const body = document.getElementById('broadcastBody')?.value;
    const recGroup = document.getElementById('broadcastRecipients')?.value;

    if (!subject || !body) return;

    const feed = document.getElementById('broadcastFeed');
    if (feed) {
      const newItem = document.createElement('div');
      newItem.className = 'feed-item';
      newItem.innerHTML = `
        <div class="feed-badge sms"><i class="fa-solid fa-comment-dots"></i> SMS / Push</div>
        <div class="feed-content">
          <div class="feed-title">${subject}</div>
          <p>${body}</p>
          <div class="feed-meta">Dispatched just now to: ${recGroup} • Status: Queued for Delivery</div>
        </div>
      `;
      feed.insertBefore(newItem, feed.firstChild);
    }

    e.target.reset();
    showToast('Broadcast transmitted successfully to all selected channels!', 'success');
  }

  // Fee Reminders Simulation
  function sendFeeReminders() {
    showToast('Dispatched automated SMS & WhatsApp fee payment reminders to 38 defaulters.', 'success');
  }

  // Absentee SMS Simulation
  function triggerAbsenteeSMS() {
    showToast('Sent daily absence notifications to parents of 33 absent students.', 'success');
  }

  // Refresh Dashboard
  function refreshDashboard() {
    showToast('Refreshed live campus metrics and biometric logs.', 'info');
  }

  // Modal helpers
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      if (modalId === 'addStudentModal') {
        const admInput = document.getElementById('mAdmNo');
        if (admInput) {
          admInput.value = getNextAdmissionNumber();
        }
        const secInput = document.getElementById('mSection');
        if (secInput) {
          secInput.value = 'A';
        }
      }
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // Settings Save
  function saveSettings() {
    showToast('School profile configuration saved successfully!', 'success');
  }

  // Export to CSV utility
  function exportTableToCSV(tableId, filename) {
    const table = document.getElementById(tableId);
    if (!table) return;

    let csv = [];
    const rows = table.querySelectorAll('tr');
    for (let i = 0; i < rows.length; i++) {
      const row = [], cols = rows[i].querySelectorAll('td, th');
      for (let j = 0; j < cols.length - 1; j++) { // Exclude actions column
        let data = cols[j].innerText.replace(/(\r\n|\n|\r)/gm, '').replace(/(\s\s+)/g, ' ');
        data = data.replace(/"/g, '""');
        row.push('"' + data + '"');
      }
      csv.push(row.join(','));
    }

    const csvFile = new Blob([csv.join('\n')], { type: 'text/csv' });
    const downloadLink = document.createElement('a');
    downloadLink.download = filename || 'export.csv';
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    showToast(`Exported ${filename} successfully`, 'success');
  }

  // Toast Notification System
  function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `portal-toast toast-${type}`;
    
    let icon = 'fa-solid fa-circle-info';
    if (type === 'success') icon = 'fa-solid fa-circle-check';
    if (type === 'warning') icon = 'fa-solid fa-triangle-exclamation';
    if (type === 'error') icon = 'fa-solid fa-circle-xmark';

    toast.innerHTML = `
      <i class="${icon} toast-icon"></i>
      <div class="toast-text">${message}</div>
      <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = 'all 0.3s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // Discipline Incident Rendering & Management
  function renderDisciplineIncidents(list) {
    const container = document.getElementById('disciplineIncidentsGrid');
    if (!container) return;

    if (list.length === 0) {
      container.innerHTML = `<div class="p-4 text-center text-muted">No disciplinary incidents on record. All students in good standing!</div>`;
      return;
    }

    container.innerHTML = list.map(inc => {
      let badgeClass = 'badge-warning';
      if (inc.severity === 'High') badgeClass = 'badge-danger';
      if (inc.severity === 'Merit') badgeClass = 'badge-success';

      return `
        <div class="incident-card" id="inc-card-${inc.id}">
          <div>
            <div class="incident-header">
              <div>
                <div class="incident-student">${inc.student}</div>
                <div class="incident-class">${inc.class} • <strong class="text-primary">${inc.id}</strong></div>
              </div>
              <span class="portal-badge ${badgeClass}">${inc.severity} Severity</span>
            </div>

            <div class="incident-reason">
              <strong>Category:</strong> ${inc.category}<br>
              ${inc.description}
            </div>

            <div class="incident-meta-row">
              <span><strong>Action:</strong> ${inc.action}</span>
              <span><i class="fa-regular fa-clock"></i> ${inc.date}</span>
            </div>
          </div>

          <div class="incident-actions">
            ${inc.status === 'Open' ? `
              <button class="btn btn-secondary btn-sm" onclick="portalApp.summonParent('${inc.id}', '${inc.student}')">
                <i class="fa-solid fa-phone"></i> Summon Parent
              </button>
              <button class="btn btn-primary btn-sm" onclick="portalApp.resolveIncident('${inc.id}')">
                <i class="fa-solid fa-check-double"></i> Mark Resolved
              </button>
            ` : `
              <span class="portal-badge badge-success w-100 text-center"><i class="fa-solid fa-check"></i> Resolved & Diary Signed</span>
            `}
          </div>
        </div>
      `;
    }).join('');
  }

  function handleLogIncident(e) {
    e.preventDefault();
    const name = document.getElementById('incStudentName')?.value;
    const cls = document.getElementById('incClass')?.value;
    const cat = document.getElementById('incCategory')?.value;
    const sev = document.getElementById('incSeverity')?.value;
    const desc = document.getElementById('incDescription')?.value;
    const action = document.getElementById('incActionTaken')?.value;

    if (!name || !desc) {
      showToast('Please provide student name and details', 'warning');
      return;
    }

    const newInc = {
      id: `DIS-2026-0${Math.floor(43 + Math.random() * 50)}`,
      student: name,
      class: cls,
      category: cat,
      severity: sev,
      description: desc,
      action: action,
      status: 'Open',
      date: 'Just now'
    };

    state.disciplineIncidents.unshift(newInc);
    renderDisciplineIncidents(state.disciplineIncidents);
    closeModal('logIncidentModal');
    e.target.reset();

    const activeCountEl = document.getElementById('activeCasesCount');
    if (activeCountEl) {
      const openCases = state.disciplineIncidents.filter(i => i.status === 'Open').length;
      activeCountEl.textContent = openCases;
    }

    showToast(`Discipline record ${newInc.id} logged for ${name} under Vice Principal oversight`, 'success');
  }

  function resolveIncident(id) {
    const inc = state.disciplineIncidents.find(i => i.id === id);
    if (inc) {
      inc.status = 'Resolved';
      renderDisciplineIncidents(state.disciplineIncidents);
      const activeCountEl = document.getElementById('activeCasesCount');
      if (activeCountEl) {
        const openCases = state.disciplineIncidents.filter(i => i.status === 'Open').length;
        activeCountEl.textContent = openCases;
      }
      showToast(`Incident ${id} marked as resolved and logged in permanent student register`, 'success');
    }
  }

  function summonParent(id, studentName) {
    showToast(`SMS notice and official conference letter dispatched to parent of ${studentName} for Monday meeting with Vice Principal`, 'warning');
  }

  // Substitution Assignment Handler
  function handleAssignSubstitution(e) {
    e.preventDefault();
    const absent = document.getElementById('subAbsentTeacher')?.value;
    const period = document.getElementById('subClassPeriod')?.value;
    const substitute = document.getElementById('substituteTeacher')?.value;

    closeModal('assignSubstitutionModal');
    e.target.reset();
    showToast(`Substitution allocated: ${substitute} assigned to ${period} in place of ${absent}`, 'success');
  }

  // VP Faculty Leave Review Table Rendering
  function renderVPLeaves(list) {
    const tbody = document.getElementById('vpLeaveTableBody');
    if (!tbody) return;

    tbody.innerHTML = list.map(item => `
      <tr id="vp-leave-row-${item.id}">
        <td><strong>${item.name}</strong></td>
        <td>${item.dept}</td>
        <td><span class="portal-badge badge-warning">${item.type}</span></td>
        <td>${item.dates}</td>
        <td><strong>${item.substitute}</strong></td>
        <td>${item.reason}</td>
        <td>
          <div class="table-action-btns">
            <button class="btn btn-primary btn-sm" onclick="portalApp.handleVPLeaveAction(${item.id}, true)" title="Recommend to Principal & Approve Substitution">
              <i class="fa-solid fa-check"></i> Recommend
            </button>
            <button class="btn btn-secondary btn-sm" onclick="portalApp.handleVPLeaveAction(${item.id}, false)" title="Request Reschedule">
              <i class="fa-solid fa-xmark"></i> Reject
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  function handleVPLeaveAction(id, approved) {
    const row = document.getElementById(`vp-leave-row-${id}`);
    if (row) {
      row.style.transition = 'all 0.3s ease';
      row.style.opacity = '0';
      setTimeout(() => {
        row.remove();
        state.facultyLeaves = state.facultyLeaves.filter(l => l.id !== id);
      }, 300);
    }

    if (approved) {
      showToast('Leave recommended by Vice Principal and substitute coverage confirmed', 'success');
    } else {
      showToast('Leave request declined due to academic timetable constraints', 'warning');
    }
  }

  // Auto-init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Public API
  return {
    init,
    navigateTo,
    switchRole,
    switchSubTab,
    handleApproval,
    filterStudents,
    resetStudentFilters,
    filterStudentProfiles,
    viewStudentProfile,
    printStudentDossier,
    approveAdmission,
    reviewAdmissionDocs,
    rejectAdmission,
    printTC,
    downloadTCPdf,
    handleNewStudent,
    handleBroadcast,
    sendFeeReminders,
    triggerAbsenteeSMS,
    refreshDashboard,
    openModal,
    closeModal,
    saveSettings,
    exportTableToCSV,
    showToast,
    // Vice Principal Specialized Functions
    handleLogIncident,
    resolveIncident,
    summonParent,
    handleAssignSubstitution,
    handleVPLeaveAction
  };

})();
