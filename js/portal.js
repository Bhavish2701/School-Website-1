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
    students: [
      { admNo: 'SV-2024-082', name: 'G. Sai Teja', class: 'X', section: 'A', rollNo: '1042', parent: 'G. Venkata Rao', phone: '9848123456', attendance: '96.4%', feeStatus: 'Paid', gpa: '9.8' },
      { admNo: 'SV-2024-091', name: 'P. Hema Latha', class: 'X', section: 'A', rollNo: '1043', parent: 'P. Appala Naidu', phone: '9848234567', attendance: '98.2%', feeStatus: 'Paid', gpa: '10.0' },
      { admNo: 'SV-2024-115', name: 'K. Rakesh Kumar', class: 'X', section: 'B', rollNo: '1088', parent: 'K. Someswara Rao', phone: '9848345678', attendance: '92.0%', feeStatus: 'Partial', gpa: '9.2' },
      { admNo: 'SV-2023-204', name: 'M. Sravanthi', class: 'IX', section: 'A', rollNo: '912', parent: 'M. Narayana Murthy', phone: '9848456789', attendance: '95.1%', feeStatus: 'Paid', gpa: '9.6' },
      { admNo: 'SV-2023-228', name: 'B. Tarun Reddy', class: 'IX', section: 'B', rollNo: '955', parent: 'B. Krishna Reddy', phone: '9848567890', attendance: '88.5%', feeStatus: 'Pending', gpa: '8.4' },
      { admNo: 'SV-2022-310', name: 'V. Divya Bharathi', class: 'VIII', section: 'A', rollNo: '804', parent: 'V. Satish Kumar', phone: '9848678901', attendance: '97.0%', feeStatus: 'Paid', gpa: '9.5' },
      { admNo: 'SV-2022-345', name: 'CH. Karthik', class: 'VIII', section: 'B', rollNo: '842', parent: 'CH. Rambabu', phone: '9848789012', attendance: '91.8%', feeStatus: 'Partial', gpa: '8.9' },
      { admNo: 'SV-2021-412', name: 'S. Bhavana', class: 'VII', section: 'A', rollNo: '715', parent: 'S. Prasad', phone: '9848890123', attendance: '96.8%', feeStatus: 'Paid', gpa: '9.7' },
      { admNo: 'SV-2020-501', name: 'Y. Manjunath', class: 'VI', section: 'A', rollNo: '601', parent: 'Y. Mohan Rao', phone: '9848901234', attendance: '93.4%', feeStatus: 'Paid', gpa: '9.1' },
      { admNo: 'SV-2019-612', name: 'D. Keerthi', class: 'V', section: 'A', rollNo: '512', parent: 'D. Suresh', phone: '9848012345', attendance: '94.2%', feeStatus: 'Paid', gpa: '9.4' },
      { admNo: 'SV-2018-709', name: 'A. Nikhilesh', class: 'IV', section: 'B', rollNo: '419', parent: 'A. Jagannadham', phone: '9848123789', attendance: '90.5%', feeStatus: 'Pending', gpa: '8.8' },
      { admNo: 'SV-2017-814', name: 'T. Siri Varshini', class: 'III', section: 'A', rollNo: '304', parent: 'T. Srinivasa Rao', phone: '9848234890', attendance: '98.5%', feeStatus: 'Paid', gpa: '9.9' },
      { admNo: 'SV-2017-902', name: 'N. Likhit Sai', class: 'II', section: 'A', rollNo: '208', parent: 'N. Prasad Babu', phone: '9848345901', attendance: '95.0%', feeStatus: 'Paid', gpa: '9.3' },
      { admNo: 'SV-2025-018', name: 'K. Tanvi Sree', class: 'I', section: 'A', rollNo: '105', parent: 'K. Ramana', phone: '9848456012', attendance: '97.2%', feeStatus: 'Paid', gpa: '9.8' },
      { admNo: 'SV-2025-045', name: 'R. Aarav Kumar', class: 'PP', section: 'A', rollNo: '042', parent: 'R. Anand', phone: '9848567123', attendance: '92.5%', feeStatus: 'Paid', gpa: '9.0' }
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
      { receiptNo: 'RCPT-2026-4888', student: 'CH. Karthik', class: 'Class VIII-B', term: 'Term 1 Balance Due', amount: '₹6,500', mode: 'UPI (GooglePay)', date: 'Yesterday, 04:15 PM', cashier: 'S. Ramu' },
      { receiptNo: 'RCPT-2026-4887', student: 'V. Divya Bharathi', class: 'Class VIII-A', term: 'Term 2 Tuition', amount: '₹13,500', mode: 'Cheque (#881023)', date: 'Yesterday, 02:30 PM', cashier: 'B. Krishna' },
      { receiptNo: 'RCPT-2026-4886', student: 'Y. Manjunath', class: 'Class VI-A', term: 'Annual Transport Fee', amount: '₹8,000', mode: 'UPI (Paytm)', date: 'Sept 17, 11:10 AM', cashier: 'S. Ramu' },
      { receiptNo: 'RCPT-2026-4885', student: 'T. Siri Varshini', class: 'Class III-A', term: 'Term 2 Tuition', amount: '₹12,000', mode: 'Cash', date: 'Sept 17, 10:00 AM', cashier: 'B. Krishna' }
    ],
    classAttendance: [
      { class: 'Class X-A', total: 42, present: 41, absent: 1, leave: 0, pct: '97.6%', teacher: 'Smt. M. Sunitha', status: 'Submitted' },
      { class: 'Class X-B', total: 40, present: 39, absent: 1, leave: 0, pct: '97.5%', teacher: 'Sri P. Satyanarayana', status: 'Submitted' },
      { class: 'Class IX-A', total: 44, present: 42, absent: 2, leave: 0, pct: '95.4%', teacher: 'Sri K. Rajesh', status: 'Submitted' },
      { class: 'Class IX-B', total: 45, present: 43, absent: 1, leave: 1, pct: '95.5%', teacher: 'Smt. S. Lakshmi', status: 'Submitted' },
      { class: 'Class VIII-A', total: 46, present: 44, absent: 2, leave: 0, pct: '95.6%', teacher: 'Sri R. Venkata Ramana', status: 'Submitted' },
      { class: 'Class VIII-B', total: 45, present: 43, absent: 1, leave: 1, pct: '95.5%', teacher: 'Sri D. Srinivas', status: 'Submitted' },
      { class: 'Class VII (A & B)', total: 88, present: 84, absent: 3, leave: 1, pct: '95.4%', teacher: 'Smt. G. Sarada', status: 'Submitted' },
      { class: 'Class VI (A & B)', total: 92, present: 88, absent: 4, leave: 0, pct: '95.6%', teacher: 'Smt. B. Meenakshi', status: 'Submitted' },
      { class: 'Classes I - V (Primary)', total: 1120, present: 1060, absent: 52, leave: 8, pct: '94.6%', teacher: 'Primary Wing Leads', status: 'Submitted' },
      { class: 'Pre-Primary (PP1 & PP2)', total: 888, present: 818, absent: 67, leave: 3, pct: '92.1%', teacher: 'Early Childhood Dept', status: 'Submitted' }
    ],
    events: [
      { title: 'Quarterly Examinations 2026', date: 'Sept 24 - Oct 01, 2026', tag: 'Exams', desc: 'Comprehensive assessments for Classes I through X as per State Board guidelines.' },
      { title: 'Gandhi Jayanti & Swachh Vidya Drive', date: 'Oct 02, 2026', tag: 'Campus Event', desc: 'Patriotic assembly, essay writing, clean campus drive and social awareness rally.' },
      { title: 'Inter-House Athletic & Sports Meet', date: 'Oct 14 - 16, 2026', tag: 'Sports', desc: 'Track & field championships, kho-kho, volleyball, badminton and chess finals.' },
      { title: 'Children’s Day & Mega Science Expo', date: 'Nov 14, 2026', tag: 'Exhibition', desc: 'Interactive robotics, working science experiments, art showcase and cultural gala.' },
      { title: 'National Mathematics Day Celebration', date: 'Dec 22, 2026', tag: 'Academic', desc: 'Srinivasa Ramanujan memorial quiz competition, mental math olympiad and puzzles.' }
    ],
    disciplineIncidents: [
      { id: 'DIS-2026-042', student: 'B. Tarun Reddy', class: 'Class IX-B', category: 'Unauthorized Device / Mobile', severity: 'Moderate', description: 'Used mobile phone during biology practical period without authorization.', action: 'Device retained in VP custody; Parent conference scheduled for Monday 10:00 AM.', status: 'Open', date: 'Today, 11:15 AM' },
      { id: 'DIS-2026-041', student: 'CH. Karthik', class: 'Class VIII-B', category: 'Late Arrival / Gate Breach', severity: 'Minor', description: 'Arrived after 08:45 AM gate closure for 3rd time this week.', action: 'Morning assembly diary note signed; Warning letter dispatched to parents.', status: 'Open', date: 'Today, 08:52 AM' },
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
      title: 'Admin / School Office',
      holder: 'Office & Accounts Staff',
      avatarIcon: 'fa-solid fa-id-badge',
      greeting: 'Good Morning, Office Administrator',
      subtext: 'Daily fee counter, new admissions queue, transfer certificates, parent communication logs, and official records.',
      badgeText: 'SCHOOL OFFICE & ACCOUNTS PORTAL'
    }
  };

  // Initialization
  function init() {
    setupDate();
    setupTheme();
    renderAllTables();
    bindEvents();
    setupHashRouting();
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
    const approvalsCard = document.getElementById('cardPendingApprovals');
    const feesLimitedBanner = document.getElementById('feesLimitedBanner');
    const collectFeeBtn = document.getElementById('collectFeeBtn');
    const sidebarFeesBadge = document.getElementById('sidebarFeesBadge');
    const settingsLockedBanner = document.getElementById('settingsLockedBanner');
    const settingsFormCard = document.getElementById('settingsFormCard');
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');
    const navDisciplineBadge = document.getElementById('navDisciplineBadge');
    const vpPermissionsBar = document.getElementById('vpPermissionsBar');
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

      if (metricCardFees) metricCardFees.style.display = 'flex';
      if (metricCardVPDiscipline) metricCardVPDiscipline.style.display = 'none';

      if (feesLimitedBanner) feesLimitedBanner.style.display = 'none';
      if (sidebarFeesBadge) sidebarFeesBadge.style.display = 'none';
      if (collectFeeBtn) {
        collectFeeBtn.disabled = false;
        collectFeeBtn.style.opacity = '1';
      }

      if (settingsLockedBanner) settingsLockedBanner.style.display = 'flex';
      if (settingsFormCard) settingsFormCard.classList.add('perm-locked');
      if (saveSettingsBtn) {
        saveSettingsBtn.disabled = true;
        saveSettingsBtn.style.opacity = '0.5';
      }
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

    const tabStrip = moduleSection.querySelector('.tab-strip');
    if (tabStrip) {
      const buttons = tabStrip.querySelectorAll('.tab-btn');
      buttons.forEach(btn => {
        const text = btn.textContent.toLowerCase();
        if (text.includes(subKey.toLowerCase())) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }

    showToast(`Switched view to ${moduleKey} → ${subKey}`, 'info');
  }

  function renderAllTables() {
    renderStudentsTable(state.students);
    renderStaffGrid(state.faculty);
    renderFeeTransactions(state.feeTransactions);
    renderAttendanceClasses(state.classAttendance);
    renderEvents(state.events);
    renderDisciplineIncidents(state.disciplineIncidents);
    renderVPLeaves(state.facultyLeaves);
  }

  function renderStudentsTable(list) {
    const tbody = document.getElementById('studentsTableBody');
    if (!tbody) return;

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding: 2.5rem; color: var(--color-text-muted);">No student records matched your search query.</td></tr>`;
      return;
    }

    tbody.innerHTML = list.map(student => {
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

  // New Student Admission Form Handler
  function handleNewStudent(e) {
    e.preventDefault();
    const name = document.getElementById('mStudentName')?.value;
    const admNo = document.getElementById('mAdmNo')?.value;
    const cls = document.getElementById('mClass')?.value;
    const section = document.getElementById('mSection')?.value;
    const parent = document.getElementById('mParentName')?.value;
    const phone = document.getElementById('mParentPhone')?.value;

    if (!name || !admNo) {
      showToast('Please fill all mandatory fields', 'warning');
      return;
    }

    const newStudent = {
      admNo: admNo,
      name: name,
      class: cls,
      section: section,
      rollNo: String(Math.floor(100 + Math.random() * 900)),
      parent: parent,
      phone: phone,
      attendance: '100%',
      feeStatus: 'Paid',
      gpa: '10.0'
    };

    state.students.unshift(newStudent);
    renderStudentsTable(state.students);
    closeModal('addStudentModal');
    e.target.reset();
    showToast(`Student ${name} successfully enrolled with Adm No: ${admNo}!`, 'success');
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
    showToast('Sent daily absence notifications to parents of 132 absent students.', 'success');
  }

  // Refresh Dashboard
  function refreshDashboard() {
    showToast('Refreshed live campus metrics and biometric logs.', 'info');
  }

  // Modal helpers
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
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
    viewStudentProfile,
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
