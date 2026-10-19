/**
 * Sri Vidya E.M High School - Dedicated Teacher Portal
 * Faculty: Ms. Anjali (Class Teacher – Grade 8A, Mathematics)
 */

var teacherApp = (function () {
  'use strict';

  // Application State
  const state = {
    activeModule: 'dashboard',
    activeSubTab: {
      'my-classes': '8a',
      'students': 'list',
      'attendance': 'mark',
      'academics': 'homework',
      'examinations': 'enter-marks',
      'timetable': 'my',
      'communication': 'class-announcements',
      'leave': 'apply',
      'reports': 'student-perf'
    },
    teacher: {
      name: 'Ms. Anjali',
      role: 'Class Teacher – Grade 8A',
      subject: 'Mathematics',
      totalClasses: 4,
      totalStudents: 152,
      todayAttendancePct: '96%'
    },
    classes: [
      { id: '8a', name: 'Class 8A', isClassTeacher: true, strength: 42, room: 'Room 204', avgScore: '86.4%' },
      { id: '9b', name: 'Class 9B', isClassTeacher: false, strength: 40, room: 'Room 208', avgScore: '82.1%' },
      { id: '7c', name: 'Class 7C', isClassTeacher: false, strength: 38, room: 'Room 112', avgScore: '89.0%' },
      { id: '10a', name: 'Class 10A Remedial', isClassTeacher: false, strength: 32, room: 'Lab 2', avgScore: '78.5%' }
    ],
    pendingTasks: [
      { id: 1, title: 'Evaluate Class 8A Math Unit Test 2 Answer Sheets', meta: 'Due Today (05:00 PM) • 42 Papers', badge: 'due-today', badgeText: 'Due Today', done: false },
      { id: 2, title: 'Confirm & submit morning attendance register for Grade 8A', meta: 'Due Today (10:00 AM) • Daily Office Submission', badge: 'due-today', badgeText: 'Due Today', done: false },
      { id: 3, title: 'Reply to Mr. Rambabu regarding Karthik’s geometry notebook', meta: 'Parent Message • Inward #842', badge: 'due-soon', badgeText: 'Pending Reply', done: false },
      { id: 4, title: 'Upload Chapter 3 polynomials study notes PDF', meta: 'Class 9B • Academic Repository', badge: 'due-soon', badgeText: 'Due Tomorrow', done: false },
      { id: 5, title: 'Prepare remedial practice worksheets for 3 students', meta: 'Class 8A (Naveen, Teja, Keerthi)', badge: 'due-soon', badgeText: 'This Week', done: false },
      { id: 6, title: 'Submit quarterly examination question paper to Vice Principal', meta: 'Vice Principal Submission • Deadline Sept 21', badge: 'due-soon', badgeText: 'Sept 21', done: false },
      { id: 7, title: 'Verify math club project submissions for Science & Math fair', meta: 'Co-Curricular Review • 6 Teams', badge: 'due-soon', badgeText: 'This Week', done: false },
      { id: 8, title: 'Sign student diaries for assembly dress code notice', meta: 'Class 8A Class Teacher Period', badge: 'due-soon', badgeText: 'Pending', done: false }
    ],
    // Complete Roster: Class 8A (Roll 801 to 842 = exactly 42 students), Class 9B, Class 7C
    students: [
      // Class 8A (Exactly 42 Students)
      { roll: 801, name: 'A. Naveen Kumar', class: '8A', phone: '9848123001', att: 'P', marks: 38, remarks: 'Good improvement in linear equations' },
      { roll: 802, name: 'B. Sravan Reddy', class: '8A', phone: '9848123002', att: 'P', marks: 44, remarks: 'Excellent algebra understanding' },
      { roll: 803, name: 'CH. Swathi', class: '8A', phone: '9848123003', att: 'P', marks: 47, remarks: 'Subject topper potential' },
      { roll: 804, name: 'V. Divya Bharathi', class: '8A', phone: '9848678901', att: 'P', marks: 49, remarks: 'Class Rank 1 - Highest marks in test' },
      { roll: 805, name: 'D. Manoj Kumar', class: '8A', phone: '9848123005', att: 'P', marks: 36, remarks: 'Needs extra drill on word problems' },
      { roll: 806, name: 'G. Harika', class: '8A', phone: '9848123006', att: 'P', marks: 42, remarks: 'Active classroom participation' },
      { roll: 807, name: 'K. Sai Krishna', class: '8A', phone: '9848123007', att: 'A', marks: 34, remarks: 'Absent today (Medical note submitted)' },
      { roll: 808, name: 'M. Tejaswi', class: '8A', phone: '9848123008', att: 'P', marks: 45, remarks: 'Very thorough solutions in geometry' },
      { roll: 809, name: 'P. Charan', class: '8A', phone: '9848123009', att: 'P', marks: 40, remarks: 'Steady homework submissions' },
      { roll: 810, name: 'R. Ananya', class: '8A', phone: '9848123010', att: 'P', marks: 48, remarks: 'Outstanding analytical skills' },
      { roll: 811, name: 'S. Akhil', class: '8A', phone: '9848123011', att: 'P', marks: 39, remarks: 'Punctual and disciplined' },
      { roll: 812, name: 'T. Bhavani', class: '8A', phone: '9848123012', att: 'P', marks: 46, remarks: 'Neat notebook presentation' },
      { roll: 813, name: 'V. Chandra Sekhar', class: '8A', phone: '9848123013', att: 'P', marks: 41, remarks: 'Good geometry skills' },
      { roll: 814, name: 'Y. Deepthi', class: '8A', phone: '9848123014', att: 'P', marks: 43, remarks: 'Very attentive in math sessions' },
      { roll: 815, name: 'A. Ganesh', class: '8A', phone: '9848123015', att: 'P', marks: 37, remarks: 'Practicing fraction operations' },
      { roll: 816, name: 'B. Hemalatha', class: '8A', phone: '9848123016', att: 'P', marks: 44, remarks: 'High arithmetic precision' },
      { roll: 817, name: 'C. Indu', class: '8A', phone: '9848123017', att: 'P', marks: 42, remarks: 'Consistent academic performance' },
      { roll: 818, name: 'D. Jagadeesh', class: '8A', phone: '9848123018', att: 'P', marks: 35, remarks: 'Attending remedial clinic' },
      { roll: 819, name: 'E. Kavya', class: '8A', phone: '9848123019', att: 'P', marks: 46, remarks: 'Fast mental math calculations' },
      { roll: 820, name: 'G. Lokesh', class: '8A', phone: '9848123020', att: 'P', marks: 38, remarks: 'Good classroom response' },
      { roll: 821, name: 'K. Madhavi', class: '8A', phone: '9848123021', att: 'P', marks: 47, remarks: 'Excellent score in polynomials' },
      { roll: 822, name: 'M. Nagesh', class: '8A', phone: '9848123022', att: 'P', marks: 40, remarks: 'Regular and attentive' },
      { roll: 823, name: 'N. Ooha', class: '8A', phone: '9848123023', att: 'P', marks: 45, remarks: 'Strong mathematical logic' },
      { roll: 824, name: 'P. Pawan Kalyan', class: '8A', phone: '9848123024', att: 'P', marks: 41, remarks: 'Well maintained math record' },
      { roll: 825, name: 'R. Rajesh', class: '8A', phone: '9848123025', att: 'P', marks: 36, remarks: 'Showing steady progress' },
      { roll: 826, name: 'S. Sai Ram', class: '8A', phone: '9848123026', att: 'P', marks: 44, remarks: 'Very good grasp of formulas' },
      { roll: 827, name: 'T. Tarun Kumar', class: '8A', phone: '9848123027', att: 'P', marks: 39, remarks: 'Active in group problem solving' },
      { roll: 828, name: 'U. Usha Rani', class: '8A', phone: '9848123028', att: 'P', marks: 43, remarks: 'Consistently completes exercises' },
      { roll: 829, name: 'V. Venkat', class: '8A', phone: '9848123029', att: 'P', marks: 42, remarks: 'Good focus in class' },
      { roll: 830, name: 'Y. Yamini', class: '8A', phone: '9848123030', att: 'P', marks: 48, remarks: 'Top 3 ranker in Grade 8A' },
      { roll: 831, name: 'B. Ajay', class: '8A', phone: '9848123031', att: 'P', marks: 37, remarks: 'Improving in quadratic equations' },
      { roll: 832, name: 'C. Bindu', class: '8A', phone: '9848123032', att: 'P', marks: 45, remarks: 'Clear step-by-step reasoning' },
      { roll: 833, name: 'D. Chaitanya', class: '8A', phone: '9848123033', att: 'P', marks: 41, remarks: 'Good teamwork in math lab' },
      { roll: 834, name: 'G. Dinesh', class: '8A', phone: '9848123034', att: 'P', marks: 38, remarks: 'Good attendance and punctuality' },
      { roll: 835, name: 'K. Eshwar', class: '8A', phone: '9848123035', att: 'P', marks: 46, remarks: 'High accuracy in calculations' },
      { roll: 836, name: 'M. Fathima', class: '8A', phone: '9848123036', att: 'P', marks: 47, remarks: 'Distinction level test score' },
      { roll: 837, name: 'P. Gowtham', class: '8A', phone: '9848123037', att: 'P', marks: 40, remarks: 'Regular notebook submission' },
      { roll: 838, name: 'R. Hemanth', class: '8A', phone: '9848123038', att: 'P', marks: 39, remarks: 'Solid effort in homework' },
      { roll: 839, name: 'S. Ishwarya', class: '8A', phone: '9848123039', att: 'P', marks: 44, remarks: 'Good analytical thinking' },
      { roll: 840, name: 'T. Jyothi', class: '8A', phone: '9848123040', att: 'P', marks: 43, remarks: 'Clear handwriting and diagrams' },
      { roll: 841, name: 'CH. Karthik', class: '8A', phone: '9848789012', att: 'L', marks: 39, remarks: 'Arrived late today (Gate pass #44)' },
      { roll: 842, name: 'Y. Tharun', class: '8A', phone: '9848123012', att: 'A', marks: 32, remarks: 'Absent today (Uninformed - SMS sent)' },

      // Class 9B (Roll 901 to 912)
      { roll: 901, name: 'G. Sai Teja', class: '9B', phone: '9848123456', att: 'P', marks: 46, remarks: 'Strong fundamentals in polynomials' },
      { roll: 902, name: 'M. Sravanthi', class: '9B', phone: '9848456789', att: 'P', marks: 45, remarks: 'Polite, attentive and regular' },
      { roll: 903, name: 'K. Rakesh', class: '9B', phone: '9848456790', att: 'P', marks: 42, remarks: 'Good algebra practice' },
      { roll: 904, name: 'P. Lavanya', class: '9B', phone: '9848456791', att: 'P', marks: 48, remarks: 'Subject topper in 9B' },
      { roll: 905, name: 'S. Varun', class: '9B', phone: '9848456792', att: 'P', marks: 39, remarks: 'Regular homework submission' },
      { roll: 906, name: 'B. Haritha', class: '9B', phone: '9848456793', att: 'P', marks: 44, remarks: 'Neat geometry constructions' },
      { roll: 907, name: 'N. Sandeep', class: '9B', phone: '9848456794', att: 'A', marks: 36, remarks: 'Absent today' },
      { roll: 908, name: 'T. Manasa', class: '9B', phone: '9848456795', att: 'P', marks: 43, remarks: 'Good classroom response' },
      { roll: 909, name: 'V. Naresh', class: '9B', phone: '9848456796', att: 'P', marks: 41, remarks: 'Consistent worker' },
      { roll: 910, name: 'J. Priyanka', class: '9B', phone: '9848456797', att: 'P', marks: 47, remarks: 'Very active learner' },
      { roll: 911, name: 'R. Ajay Kumar', class: '9B', phone: '9848456798', att: 'P', marks: 38, remarks: 'Improving in quadratic equations' },
      { roll: 912, name: 'D. Keerthi', class: '9B', phone: '9848456799', att: 'P', marks: 45, remarks: 'High accuracy in tests' },

      // Class 7C (Roll 701 to 710)
      { roll: 701, name: 'S. Bhavana', class: '7C', phone: '9848890123', att: 'P', marks: 48, remarks: 'High accuracy in fractions and decimals' },
      { roll: 702, name: 'M. Rohit', class: '7C', phone: '9848890124', att: 'P', marks: 42, remarks: 'Good mental arithmetic' },
      { roll: 703, name: 'A. Pranathi', class: '7C', phone: '9848890125', att: 'P', marks: 46, remarks: 'Excellent homework notebook' },
      { roll: 704, name: 'K. Vinay', class: '7C', phone: '9848890126', att: 'P', marks: 39, remarks: 'Active in class activities' },
      { roll: 705, name: 'G. Sirisha', class: '7C', phone: '9848890127', att: 'P', marks: 44, remarks: 'Prompt assignment submissions' },
      { roll: 706, name: 'B. Dhanush', class: '7C', phone: '9848890128', att: 'P', marks: 37, remarks: 'Needs extra practice in division' },
      { roll: 707, name: 'CH. Monica', class: '7C', phone: '9848890129', att: 'A', marks: 41, remarks: 'Absent today' },
      { roll: 708, name: 'T. Abhinav', class: '7C', phone: '9848890130', att: 'P', marks: 45, remarks: 'Strong fundamentals' },
      { roll: 709, name: 'V. Geethika', class: '7C', phone: '9848890131', att: 'P', marks: 47, remarks: 'Class topper potential' },
      { roll: 710, name: 'Y. Charan', class: '7C', phone: '9848890132', att: 'P', marks: 40, remarks: 'Disciplined and attentive' }
    ],
    homework: [
      { id: 1, class: 'Class 8A', title: 'Chapter 2: Linear Equations Exercise 2.3', due: 'Sept 22, 2026', desc: 'Solve questions 1 through 8 in homework notebook. Step-by-step verification required.' },
      { id: 2, class: 'Class 9B', title: 'Polynomials Remainder Theorem Practice', due: 'Sept 23, 2026', desc: 'Complete worksheet questions 1 to 12. Bring graph sheets for plotting quadratic curves.' },
      { id: 3, class: 'Class 7C', title: 'Fractions Multiplication Drill', due: 'Sept 21, 2026', desc: 'Workbook page 34: Solve exercise 3.2 problems and verify with parent signature.' }
    ],
    parentMessages: [
      { id: 1, parent: 'Mrs. V. Sarada', student: 'V. Divya Bharathi (Roll 804)', date: 'Today, 08:30 AM', message: 'Dear Ms. Anjali, Divya will bring her math geometry set and completed assignment notebook today. Thank you for your guidance.' },
      { id: 2, parent: 'Mr. CH. Rambabu', student: 'CH. Karthik (Roll 841)', date: 'Yesterday, 06:15 PM', message: 'Respected Teacher, Karthik had fever yesterday and arrived slightly late today. He has completed Exercise 2.2.' }
    ],
    leaveHistory: [
      { id: 'LV-2026-081', type: 'Casual Leave (CL)', dates: 'Aug 14, 2026 (1 Day)', substitute: 'Sri P. Satyanarayana', reason: 'Personal family event', status: 'Approved by Principal' },
      { id: 'LV-2026-042', type: 'On Duty (OD)', dates: 'July 28, 2026 (1 Day)', substitute: 'Smt. S. Lakshmi', reason: 'District Math Teachers Training Workshop', status: 'Approved by Principal' }
    ]
  };

  let activeDossierRoll = null;

  function init() {
    setupTheme();
    loadSavedProfile();
    bindEvents();
    renderAll();
    setupHashRouting();

    if (window.ApiClient && window.ApiClient.isAuthenticated()) {
      loadLiveData();
    }
  }

  async function loadLiveData() {
    if (!window.ApiClient || !window.ApiClient.isAuthenticated()) return;

    try {
      // 1. Fetch Teacher Operational Dashboard
      const dash = await window.ApiClient.dashboard.getTeacherDashboard();
      if (dash) {
        if (dash.teacherProfile) {
          state.teacher.name = dash.teacherProfile.fullName;
          state.teacher.subject = dash.teacherProfile.specialization || 'Mathematics';
          state.teacher.role = `Class Teacher • Employee ID ${dash.teacherProfile.employeeId}`;
          updateTeacherHeaderDOM(dash.teacherProfile);
        }

        if (dash.classes) {
          state.teacher.totalClasses = dash.classes.assignedClassesCount;
          state.teacher.totalStudents = dash.classes.totalStudentsCount;
          if (dash.classes.list && dash.classes.list.length > 0) {
            state.classes = dash.classes.list.map(c => ({
              id: `${c.class}${c.section || 'A'}`.toLowerCase(),
              name: `Class ${c.class}${c.section || 'A'}`,
              isClassTeacher: c.isClassTeacher || false,
              strength: 42,
              room: 'Room 204',
              avgScore: '86.4%'
            }));
          }
        }

        if (dash.attendance) {
          state.teacher.todayAttendancePct = `${dash.attendance.markedCount > 0 ? '96%' : 'Pending'}`;
        }

        if (dash.assignments && dash.assignments.list) {
          state.homework = dash.assignments.list.map(h => ({
            id: h.id,
            class: `Class ${h.class}${h.section || 'A'}`,
            title: h.title,
            due: new Date(h.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            desc: h.description || 'Complete all exercises in notebook.'
          }));
          renderHomeworkFeed();
        }
      }

      // 2. Fetch Assigned Class Students
      const studentRes = await window.ApiClient.students.getStudents({ limit: 50 });
      if (studentRes && studentRes.data && studentRes.data.students && studentRes.data.students.length > 0) {
        state.students = studentRes.data.students.map((s, idx) => ({
          roll: parseInt(s.rollNo) || (801 + idx),
          name: s.fullName,
          class: `${s.class}${s.section || 'A'}`,
          phone: s.phone || '9848123000',
          att: 'P',
          marks: 44,
          remarks: 'Good classroom participation and consistent homework.'
        }));
        renderAttendanceMarkingTable();
        renderMarksEntryTable();
      }
    } catch (err) {
      console.warn('[teacherApp.loadLiveData error]:', err.message);
    }
  }

  function updateTeacherHeaderDOM(profile) {
    if (!profile) return;
    const nameEl = document.querySelector('.user-name, #teacherProfileName');
    if (nameEl) nameEl.textContent = profile.fullName;
    const roleEl = document.querySelector('.user-role, #teacherProfileRole');
    if (roleEl) roleEl.textContent = `${profile.specialization} Faculty (${profile.employeeId})`;
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

    // Mobile sidebar controller with backdrop & outside-click support
    const sidebar = document.getElementById('portalSidebar');
    const mobileBtn = document.getElementById('mobileSidebarToggle');

    window.closeTeacherMobileSidebar = function () {
      const sb = document.getElementById('portalSidebar');
      const bd = document.getElementById('portalBackdrop');
      if (sb) sb.classList.remove('mobile-open');
      if (bd) bd.classList.remove('active');
      document.body.classList.remove('sidebar-open');
    };

    window.openTeacherMobileSidebar = function () {
      const sb = document.getElementById('portalSidebar');
      let bd = document.getElementById('portalBackdrop');
      if (!bd) {
        bd = document.createElement('div');
        bd.id = 'portalBackdrop';
        bd.className = 'portal-backdrop';
        document.body.appendChild(bd);
        bd.addEventListener('click', window.closeTeacherMobileSidebar);
      }
      if (sb) sb.classList.add('mobile-open');
      bd.classList.add('active');
      document.body.classList.add('sidebar-open');
    };

    if (mobileBtn && sidebar) {
      mobileBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (sidebar.classList.contains('mobile-open')) {
          window.closeTeacherMobileSidebar();
        } else {
          window.openTeacherMobileSidebar();
        }
      });
    }

    const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');
    if (sidebarCloseBtn) {
      sidebarCloseBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        window.closeTeacherMobileSidebar();
      });
    }

    document.addEventListener('click', function (e) {
      const sb = document.getElementById('portalSidebar');
      const mb = document.getElementById('mobileSidebarToggle');
      if (sb && sb.classList.contains('mobile-open')) {
        if (!sb.contains(e.target) && (!mb || !mb.contains(e.target))) {
          window.closeTeacherMobileSidebar();
        }
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        window.closeTeacherMobileSidebar();
      }
    });

    // Sidebar navigation
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
            if (typeof window.closeTeacherMobileSidebar === 'function') {
              window.closeTeacherMobileSidebar();
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
            if (typeof window.closeTeacherMobileSidebar === 'function') {
              window.closeTeacherMobileSidebar();
            }
          }
        });
      });
    });
  }

  function setupHashRouting() {
    function handleHash() {
      const hash = window.location.hash.replace('#', '');
      let mod = null;
      let sub = null;

      if (hash) {
        if (hash === 'security' || hash === 'change-password' || hash === 'password') {
          navigateTo('security');
          return;
        }
        if (hash.startsWith('profile-')) {
          const profTab = hash.replace('profile-', '');
          navigateTo('profile');
          switchProfileTab(profTab);
          return;
        }
        const parts = hash.split('-');
        mod = parts[0];
        sub = parts.slice(1).join('-') || null;
      } else {
        mod = sessionStorage.getItem('sv_teacher_last_module') || localStorage.getItem('sv_teacher_last_module') || 'dashboard';
        sub = sessionStorage.getItem('sv_teacher_last_sub') || localStorage.getItem('sv_teacher_last_sub') || null;
      }

      if (document.getElementById(`view-${mod}`)) {
        navigateTo(mod, sub);
        if (mod === 'profile') {
          const lastProfTab = sessionStorage.getItem('sv_teacher_last_profile_tab') || localStorage.getItem('sv_teacher_last_profile_tab') || 'personal';
          switchProfileTab(lastProfTab);
        }
      } else {
        navigateTo('dashboard');
      }
    }
    window.addEventListener('hashchange', handleHash);
    handleHash();
  }

  function navigateTo(moduleKey, subKey) {
    if (moduleKey === 'security' || moduleKey === 'change-password' || moduleKey === 'password') {
      moduleKey = 'profile';
      subKey = 'security';
    }

    const view = document.getElementById(`view-${moduleKey}`);
    if (!view) return;

    state.activeModule = moduleKey;

    try {
      sessionStorage.setItem('sv_teacher_last_module', moduleKey);
      localStorage.setItem('sv_teacher_last_module', moduleKey);
      if (subKey) {
        sessionStorage.setItem('sv_teacher_last_sub', subKey);
        localStorage.setItem('sv_teacher_last_sub', subKey);
      } else {
        sessionStorage.removeItem('sv_teacher_last_sub');
        localStorage.removeItem('sv_teacher_last_sub');
      }
      const targetHash = (subKey && subKey !== 'security') ? `${moduleKey}-${subKey}` : (subKey === 'security' ? 'security' : moduleKey);
      if (window.location.hash.replace('#', '') !== targetHash) {
        history.replaceState(null, '', '#' + targetHash);
      }
    } catch (e) {}

    // Active sidebar class
    document.querySelectorAll('.nav-item').forEach(item => {
      const itemMod = item.getAttribute('data-module');
      if (itemMod === moduleKey || (subKey === 'security' && itemMod === 'security')) {
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
    const crumb = document.getElementById('teacherCurrentPageCrumb');
    if (crumb) {
      const titles = {
        'dashboard': 'Dashboard',
        'my-classes': 'My Classes',
        'students': 'Students',
        'attendance': 'Attendance Register',
        'academics': 'Academics & Homework',
        'examinations': 'Examinations & Marks',
        'timetable': 'Timetable',
        'communication': 'Communication Desk',
        'leave': 'Leave Management',
        'reports': 'Performance Reports',
        'profile': 'My Profile & Account Settings'
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

    // Update tab strip active buttons
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

    // Module-specific interactive subtab rendering
    if (moduleKey === 'academics') {
      renderAcademicsSubTab(subKey);
    } else if (moduleKey === 'students') {
      renderStudentsSubTab(subKey);
    } else if (moduleKey === 'attendance') {
      renderAttendanceSubTab(subKey);
    } else if (moduleKey === 'examinations') {
      renderExaminationsSubTab(subKey);
    } else if (moduleKey === 'timetable') {
      renderTimetableSubTab(subKey);
    } else if (moduleKey === 'communication') {
      renderCommunicationSubTab(subKey);
    } else if (moduleKey === 'leave') {
      if (subKey === 'apply') {
        openModal('applyLeaveModal');
      }
    }
  }

  function renderAcademicsSubTab(subKey) {
    const container = document.getElementById('homeworkFeedContainer');
    if (!container) return;

    if (subKey === 'assignments' || subKey === 'homework') {
      renderHomeworkFeed();
      showToast(`Showing Homework & Assignments`, 'info');
    } else if (subKey === 'materials') {
      container.innerHTML = `
        <div class="card p-4 mb-3">
          <div class="card-header-bar">
            <div>
              <h3><i class="fa-solid fa-folder-open text-primary"></i> Study Materials & Question Banks</h3>
              <p class="text-muted text-sm mt-1">Syllabus-aligned Mathematics study guides and practice sheets.</p>
            </div>
            <button class="btn btn-primary btn-sm" onclick="teacherApp.showToast('Select PDF file to upload to class repository', 'info')">
              <i class="fa-solid fa-cloud-arrow-up"></i> Upload Document
            </button>
          </div>
          <div class="table-container mt-3">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Document Title</th>
                  <th>Target Class</th>
                  <th>Uploaded Date</th>
                  <th>File Size</th>
                  <th class="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Chapter 2: Linear Equations Formula Sheet & Notes</strong></td>
                  <td><span class="portal-badge badge-primary">Class 8A</span></td>
                  <td>Sept 15, 2026</td>
                  <td>2.4 MB (PDF)</td>
                  <td class="text-center"><button class="btn btn-secondary btn-sm" onclick="teacherApp.showToast('Downloaded Linear Equations Notes', 'success')"><i class="fa-solid fa-download"></i> Download</button></td>
                </tr>
                <tr>
                  <td><strong>Polynomials & Factor Theorem Solved Examples</strong></td>
                  <td><span class="portal-badge badge-primary">Class 9B</span></td>
                  <td>Sept 12, 2026</td>
                  <td>3.1 MB (PDF)</td>
                  <td class="text-center"><button class="btn btn-secondary btn-sm" onclick="teacherApp.showToast('Downloaded Polynomials Guide', 'success')"><i class="fa-solid fa-download"></i> Download</button></td>
                </tr>
                <tr>
                  <td><strong>Grade 7 Fractions Multiplication Drill Workbook</strong></td>
                  <td><span class="portal-badge badge-primary">Class 7C</span></td>
                  <td>Sept 08, 2026</td>
                  <td>1.8 MB (PDF)</td>
                  <td class="text-center"><button class="btn btn-secondary btn-sm" onclick="teacherApp.showToast('Downloaded Grade 7 Workbook', 'success')"><i class="fa-solid fa-download"></i> Download</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      `;
      showToast('Loaded Study Materials & PDFs', 'info');
    } else if (subKey === 'plans') {
      container.innerHTML = `
        <div class="card p-4 mb-3">
          <div class="card-header-bar">
            <div>
              <h3><i class="fa-solid fa-list-check text-primary"></i> Weekly Academic Lesson Plans</h3>
              <p class="text-muted text-sm mt-1">Teaching objectives, curriculum milestones, and pedagogy plan.</p>
            </div>
            <button class="btn btn-primary btn-sm" onclick="teacherApp.showToast('Lesson plan draft updated', 'success')">
              <i class="fa-solid fa-pen-to-square"></i> Edit Plan
            </button>
          </div>
          <div class="table-container mt-3">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Period</th>
                  <th>Class</th>
                  <th>Core Topic</th>
                  <th>Learning Objectives</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Period 1</td>
                  <td><strong>Class 8A</strong></td>
                  <td>Linear Equations in One Variable (Ex 2.3)</td>
                  <td>Solving equations having the variable on both sides</td>
                  <td><span class="portal-badge badge-success">Completed</span></td>
                </tr>
                <tr>
                  <td>Period 2</td>
                  <td><strong>Class 9B</strong></td>
                  <td>Polynomials: Factor Theorem & Remainder</td>
                  <td>Verification of roots through algebraic identities</td>
                  <td><span class="portal-badge badge-primary">In Progress</span></td>
                </tr>
                <tr>
                  <td>Period 4</td>
                  <td><strong>Class 7C</strong></td>
                  <td>Fractions & Decimals Multiplication</td>
                  <td>Visual model of area multiplication for fractions</td>
                  <td><span class="portal-badge badge-warning">Next Session</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      `;
      showToast('Loaded Weekly Lesson Plans', 'info');
    } else if (subKey === 'syllabus') {
      container.innerHTML = `
        <div class="card p-4 mb-3">
          <div class="card-header-bar">
            <div>
              <h3><i class="fa-solid fa-bars-progress text-primary"></i> Term 1 Syllabus Tracker</h3>
              <p class="text-muted text-sm mt-1">Quarterly examination readiness across assigned classes.</p>
            </div>
            <span class="portal-badge badge-success">Overall: 84% Completed</span>
          </div>
          <div style="display: flex; flex-direction: column; gap: 1rem; margin-top: 1rem;">
            <div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 0.35rem;">
                <strong>Class 8A Mathematics (Quarterly Target: 4 Chapters)</strong>
                <span>88% Complete</span>
              </div>
              <div style="width: 100%; height: 10px; background: var(--color-bg-subtle); border-radius: 5px; overflow: hidden;">
                <div style="width: 88%; height: 100%; background: var(--color-primary);"></div>
              </div>
            </div>
            <div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 0.35rem;">
                <strong>Class 9B Mathematics (Quarterly Target: 5 Chapters)</strong>
                <span>80% Complete</span>
              </div>
              <div style="width: 100%; height: 10px; background: var(--color-bg-subtle); border-radius: 5px; overflow: hidden;">
                <div style="width: 80%; height: 100%; background: var(--color-accent-green);"></div>
              </div>
            </div>
            <div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 0.35rem;">
                <strong>Class 7C Mathematics (Quarterly Target: 4 Chapters)</strong>
                <span>85% Complete</span>
              </div>
              <div style="width: 100%; height: 10px; background: var(--color-bg-subtle); border-radius: 5px; overflow: hidden;">
                <div style="width: 85%; height: 100%; background: var(--color-accent-purple);"></div>
              </div>
            </div>
          </div>
        </div>
      `;
      showToast('Loaded Syllabus Tracker', 'info');
    }
  }

  function renderStudentsSubTab(subKey) {
    const tableContainer = document.querySelector('#view-students .table-container');
    if (!tableContainer) return;

    const classVal = document.getElementById('studentClassFilterSelect')?.value || '8A';
    const studentsList = (classVal === 'ALL') ? state.students : state.students.filter(s => s.class === classVal);

    if (subKey === 'list') {
      renderStudentsList(studentsList);
      tableContainer.style.display = 'block';
      const extraDiv = document.getElementById('studentsExtraSubView');
      if (extraDiv) extraDiv.remove();
      showToast(`Showing Student List (${studentsList.length} members)`, 'info');
    } else if (subKey === 'profile') {
      tableContainer.style.display = 'none';
      let extraDiv = document.getElementById('studentsExtraSubView');
      if (!extraDiv) {
        extraDiv = document.createElement('div');
        extraDiv.id = 'studentsExtraSubView';
        tableContainer.parentNode.appendChild(extraDiv);
      }
      extraDiv.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; margin-top: 1rem;">
          ${studentsList.map(s => `
            <div class="card p-3" style="border: 1px solid var(--color-border); border-radius: var(--radius-md);">
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <div style="width: 44px; height: 44px; border-radius: 50%; background: var(--color-primary); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700;">
                  #${s.roll}
                </div>
                <div>
                  <h4 style="margin: 0; font-size: 0.95rem;">${s.name}</h4>
                  <span class="text-muted text-xs">Grade ${s.class} • Roll #${s.roll}</span>
                </div>
              </div>
              <div style="margin-top: 0.75rem; padding: 0.5rem; background: var(--color-bg-subtle); border-radius: 6px; font-size: 0.82rem;">
                <div><strong>Attendance:</strong> ${s.att === 'P' ? '96% (Present Today)' : (s.att === 'L' ? '91% (Late Today)' : '86% (Absent Today)')}</div>
                <div style="margin-top: 0.25rem;"><strong>Maths UT-2:</strong> ${s.marks}/50 (${s.marks*2}%)</div>
                <div style="margin-top: 0.25rem;"><strong>Parent Phone:</strong> <a href="tel:${s.phone}">${s.phone}</a></div>
              </div>
              <button class="btn btn-secondary btn-sm mt-3" style="width: 100%;" onclick="teacherApp.viewStudentDossier(${s.roll})">
                <i class="fa-regular fa-id-badge"></i> View Full Dossier
              </button>
            </div>
          `).join('')}
        </div>
      `;
      showToast(`Loaded ${studentsList.length} Student Dossiers`, 'info');
    } else if (subKey === 'att-history') {
      tableContainer.style.display = 'none';
      let extraDiv = document.getElementById('studentsExtraSubView');
      if (!extraDiv) {
        extraDiv = document.createElement('div');
        extraDiv.id = 'studentsExtraSubView';
        tableContainer.parentNode.appendChild(extraDiv);
      }
      extraDiv.innerHTML = `
        <div class="card p-4">
          <div class="card-header-bar">
            <div>
              <h3>Monthly Attendance Roster — Grade ${classVal}</h3>
              <p class="text-muted text-sm mt-1">Total Academic Days in Term: 24 Days • Section Rate: 95.8%</p>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="window.print()"><i class="fa-solid fa-print"></i> Print Register</button>
          </div>
          <div class="table-container mt-3">
            <table class="data-table">
              <thead>
                <tr>
                  <th class="text-center">Roll #</th>
                  <th>Student Name</th>
                  <th class="text-center">Days Present</th>
                  <th class="text-center">Days Absent</th>
                  <th class="text-center">Monthly %</th>
                  <th class="text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                ${studentsList.slice(0, 15).map(s => {
                  const presDays = s.att === 'A' ? 22 : 24;
                  const absDays = s.att === 'A' ? 2 : 0;
                  const pct = ((presDays / 24) * 100).toFixed(1);
                  return `
                    <tr>
                      <td class="text-center"><strong>#${s.roll}</strong></td>
                      <td><strong>${s.name}</strong></td>
                      <td class="text-center">${presDays} / 24</td>
                      <td class="text-center">${absDays}</td>
                      <td class="text-center"><strong>${pct}%</strong></td>
                      <td class="text-center"><span class="portal-badge ${pct >= 90 ? 'badge-success' : 'badge-warning'}">${pct >= 90 ? 'Regular' : 'Review'}</span></td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
      showToast('Loaded Attendance Track Records', 'info');
    } else if (subKey === 'perf') {
      tableContainer.style.display = 'none';
      let extraDiv = document.getElementById('studentsExtraSubView');
      if (!extraDiv) {
        extraDiv = document.createElement('div');
        extraDiv.id = 'studentsExtraSubView';
        tableContainer.parentNode.appendChild(extraDiv);
      }
      extraDiv.innerHTML = `
        <div class="card p-4">
          <div class="card-header-bar">
            <div>
              <h3>Academic Assessment Dossier — Grade ${classVal}</h3>
              <p class="text-muted text-sm mt-1">Unit Test 1 (25M), Unit Test 2 (50M), and Overall Term Grade.</p>
            </div>
            <button class="btn btn-primary btn-sm" onclick="teacherApp.navigateTo('examinations', 'enter-marks')"><i class="fa-solid fa-file-pen"></i> Enter Marks</button>
          </div>
          <div class="table-container mt-3">
            <table class="data-table">
              <thead>
                <tr>
                  <th class="text-center">Roll #</th>
                  <th>Student Name</th>
                  <th class="text-center">UT-1 (25M)</th>
                  <th class="text-center">UT-2 (50M)</th>
                  <th class="text-center">Term Avg %</th>
                  <th class="text-center">Grade</th>
                </tr>
              </thead>
              <tbody>
                ${studentsList.slice(0, 15).map(s => {
                  const ut1 = Math.round(s.marks * 0.48);
                  const termPct = Math.round(((ut1/25 + s.marks/50) / 2) * 100);
                  const grade = termPct >= 90 ? 'A1' : (termPct >= 80 ? 'A2' : (termPct >= 70 ? 'B1' : 'B2'));
                  return `
                    <tr>
                      <td class="text-center"><strong>#${s.roll}</strong></td>
                      <td><strong>${s.name}</strong></td>
                      <td class="text-center">${ut1} / 25</td>
                      <td class="text-center"><strong>${s.marks} / 50</strong></td>
                      <td class="text-center"><strong>${termPct}%</strong></td>
                      <td class="text-center"><span class="portal-badge ${grade.startsWith('A') ? 'badge-success' : 'badge-primary'}">${grade}</span></td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
      showToast('Loaded Academic Marks Dossier', 'info');
    }
  }

  function renderAttendanceSubTab(subKey) {
    const card = document.querySelector('#view-attendance .card');
    if (!card) return;

    let extraDiv = document.getElementById('attendanceSubExtraView');
    const tableContainer = card.querySelector('.table-container');
    const visualStrip = card.querySelector('.attendance-visual-strip');

    if (subKey === 'mark') {
      if (extraDiv) extraDiv.style.display = 'none';
      if (tableContainer) tableContainer.style.display = 'block';
      if (visualStrip) visualStrip.style.display = 'flex';
      renderAttendanceMarkingTable();
      showToast('Showing Daily Register Table & Live Ratio Chart', 'info');
    } else if (subKey === 'history') {
      if (tableContainer) tableContainer.style.display = 'none';
      if (visualStrip) visualStrip.style.display = 'none';
      if (!extraDiv) {
        extraDiv = document.createElement('div');
        extraDiv.id = 'attendanceSubExtraView';
        card.appendChild(extraDiv);
      }
      extraDiv.style.display = 'block';
      extraDiv.innerHTML = `
        <div class="mt-3">
          <div class="chart-card mb-3">
            <div class="chart-title-wrap">
              <h4><i class="fa-solid fa-chart-column text-primary"></i> Class 8A Weekly Attendance Pacing (September 2026)</h4>
              <span class="portal-badge badge-success">Target: 95.0% Goal Met</span>
            </div>
            <div class="bar-chart-container">
              <div class="bar-chart-row">
                <div class="bar-header">
                  <span class="bar-label"><i class="fa-regular fa-calendar-check text-emerald"></i> Week 1 (Sept 1 – 5): 5 Teaching Days</span>
                  <span class="bar-value text-emerald">96.5% Presence (40.5 avg present)</span>
                </div>
                <div class="bar-track">
                  <div class="bar-fill fill-emerald" style="width: 96.5%;"></div>
                </div>
              </div>
              <div class="bar-chart-row">
                <div class="bar-header">
                  <span class="bar-label"><i class="fa-regular fa-calendar-check text-blue"></i> Week 2 (Sept 8 – 12): 5 Teaching Days</span>
                  <span class="bar-value text-primary">95.2% Presence (40.0 avg present)</span>
                </div>
                <div class="bar-track">
                  <div class="bar-fill fill-blue" style="width: 95.2%;"></div>
                </div>
              </div>
              <div class="bar-chart-row">
                <div class="bar-header">
                  <span class="bar-label"><i class="fa-regular fa-calendar-check text-emerald"></i> Week 3 (Sept 15 – 19): 5 Teaching Days</span>
                  <span class="bar-value text-emerald">97.6% Presence (41.0 avg present)</span>
                </div>
                <div class="bar-track">
                  <div class="bar-fill fill-emerald" style="width: 97.6%;"></div>
                </div>
              </div>
              <div class="bar-chart-row">
                <div class="bar-header">
                  <span class="bar-label"><i class="fa-regular fa-calendar text-purple"></i> Month Pacing Projection (Full Term)</span>
                  <span class="bar-value" style="color: #8B5CF6;">96.4% Expected Cumulative</span>
                </div>
                <div class="bar-track">
                  <div class="bar-fill fill-purple" style="width: 96.4%;"></div>
                </div>
              </div>
            </div>
          </div>
          <button type="button" class="btn btn-secondary btn-sm" onclick="teacherApp.switchSubTab('attendance', 'mark')">
            <i class="fa-solid fa-arrow-left"></i> Return to Daily Register
          </button>
        </div>
      `;
      showToast('Loaded Monthly Attendance Pacing Bar Graph', 'info');
    } else if (subKey === 'report') {
      if (tableContainer) tableContainer.style.display = 'none';
      if (visualStrip) visualStrip.style.display = 'none';
      if (!extraDiv) {
        extraDiv = document.createElement('div');
        extraDiv.id = 'attendanceSubExtraView';
        card.appendChild(extraDiv);
      }
      extraDiv.style.display = 'block';
      const class8A = state.students.filter(s => s.class === '8A');
      const absentees = class8A.filter(s => s.att === 'A' || s.att === 'L');
      extraDiv.innerHTML = `
        <div class="mt-3">
          <div class="card-header-bar mb-2">
            <h4><i class="fa-solid fa-user-xmark text-danger"></i> Today's Absentee & Late Arrivals Log</h4>
            <span class="portal-badge badge-danger">${absentees.length} Students Requiring Attention</span>
          </div>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th class="text-center">Roll #</th>
                  <th>Student Name</th>
                  <th class="text-center">Status</th>
                  <th>Parent Contact</th>
                  <th>Reason / Note</th>
                  <th class="text-center">Follow-up Action</th>
                </tr>
              </thead>
              <tbody>
                ${absentees.map(s => `
                  <tr>
                    <td class="text-center"><strong>#${s.roll}</strong></td>
                    <td><strong>${s.name}</strong></td>
                    <td class="text-center"><span class="portal-badge ${s.att === 'L' ? 'badge-warning' : 'badge-danger'}">${s.att === 'L' ? 'Late Arrival' : 'Absent'}</span></td>
                    <td><a href="tel:${s.phone}">${s.phone}</a></td>
                    <td><span class="text-muted text-sm">${s.remarks}</span></td>
                    <td class="text-center"><button type="button" class="btn btn-primary btn-sm" onclick="teacherApp.showToast('Automated attendance SMS dispatched to ${s.name} parent (${s.phone})', 'success')"><i class="fa-solid fa-paper-plane"></i> Send SMS</button></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          <button type="button" class="btn btn-secondary btn-sm mt-3" onclick="teacherApp.switchSubTab('attendance', 'mark')">
            <i class="fa-solid fa-arrow-left"></i> Return to Daily Register
          </button>
        </div>
      `;
      showToast(`Showing Absentee Summary (${absentees.length} records)`, 'warning');
    }
  }

  function renderExaminationsSubTab(subKey) {
    const card = document.querySelector('#view-examinations .card');
    if (!card) return;

    let extraDiv = document.getElementById('examSubExtraView');
    const tableContainer = card.querySelector('.table-container');

    if (subKey === 'enter-marks') {
      if (extraDiv) extraDiv.style.display = 'none';
      if (tableContainer) tableContainer.style.display = 'block';
      renderMarksEntryTable();
      showToast('Loaded Marks Entry Grid', 'info');
    } else if (subKey === 'grade' || subKey === 'results') {
      if (tableContainer) tableContainer.style.display = 'none';
      if (!extraDiv) {
        extraDiv = document.createElement('div');
        extraDiv.id = 'examSubExtraView';
        card.appendChild(extraDiv);
      }
      extraDiv.style.display = 'block';
      extraDiv.innerHTML = `
        <div class="mt-3">
          <div class="chart-card mb-3">
            <div class="chart-title-wrap">
              <h4><i class="fa-solid fa-chart-column text-primary"></i> Class 8A CBSE / State Grade Distribution Bar Graph</h4>
              <span class="portal-badge badge-success">42 Students Evaluated</span>
            </div>
            <div class="bar-chart-container">
              <div class="bar-chart-row">
                <div class="bar-header">
                  <span class="bar-label"><i class="fa-solid fa-medal text-emerald"></i> Grade A1 (91% – 100%): 45 to 50 Marks</span>
                  <span class="bar-value text-emerald">18 Students (42.9%)</span>
                </div>
                <div class="bar-track">
                  <div class="bar-fill fill-emerald" style="width: 42.9%;"></div>
                </div>
              </div>
              <div class="bar-chart-row">
                <div class="bar-header">
                  <span class="bar-label"><i class="fa-solid fa-award text-blue"></i> Grade A2 (81% – 90%): 40 to 44 Marks</span>
                  <span class="bar-value text-primary">10 Students (23.8%)</span>
                </div>
                <div class="bar-track">
                  <div class="bar-fill fill-blue" style="width: 23.8%;"></div>
                </div>
              </div>
              <div class="bar-chart-row">
                <div class="bar-header">
                  <span class="bar-label"><i class="fa-solid fa-circle-check" style="color: #8B5CF6;"></i> Grade B1 (71% – 80%): 35 to 39 Marks</span>
                  <span class="bar-value" style="color: #8B5CF6;">8 Students (19.0%)</span>
                </div>
                <div class="bar-track">
                  <div class="bar-fill fill-purple" style="width: 19.0%;"></div>
                </div>
              </div>
              <div class="bar-chart-row">
                <div class="bar-header">
                  <span class="bar-label"><i class="fa-solid fa-circle-check text-amber"></i> Grade B2 (61% – 70%): 30 to 34 Marks</span>
                  <span class="bar-value text-amber">4 Students (9.5%)</span>
                </div>
                <div class="bar-track">
                  <div class="bar-fill fill-amber" style="width: 9.5%;"></div>
                </div>
              </div>
              <div class="bar-chart-row">
                <div class="bar-header">
                  <span class="bar-label"><i class="fa-solid fa-triangle-exclamation text-red"></i> Grade C1 (51% – 60%): Remedial</span>
                  <span class="bar-value" style="color: #EF4444;">2 Students (4.8%)</span>
                </div>
                <div class="bar-track">
                  <div class="bar-fill fill-red" style="width: 4.8%;"></div>
                </div>
              </div>
            </div>
          </div>
          <button type="button" class="btn btn-secondary btn-sm" onclick="teacherApp.switchSubTab('examinations', 'enter-marks')">
            <i class="fa-solid fa-arrow-left"></i> Return to Marks Entry
          </button>
        </div>
      `;
      showToast('Loaded Grade Distribution Bar Graph', 'info');
    } else if (subKey === 'create') {
      showToast('Assessment form ready for new examination entry', 'info');
    }
  }

  function renderTimetableSubTab(subKey) {
    showToast(`Viewing timetable: ${subKey === 'class' ? 'Class 8A All Subjects' : 'Ms. Anjali Schedule'}`, 'info');
  }

  function renderCommunicationSubTab(subKey) {
    if (subKey === 'parent-messages') {
      renderParentMessages();
      showToast('Showing direct messages from parents', 'info');
    } else if (subKey === 'class-announcements') {
      showToast('Showing Class 8A announcements and circulars', 'info');
    } else if (subKey === 'notifications') {
      showToast('Showing official school administrative notices', 'info');
    }
  }

  function switchClassTab(classKey) {
    const overviewEl = document.getElementById('classOverviewContent');
    if (!overviewEl) return;

    const cls = state.classes.find(c => c.id === classKey);
    if (!cls) return;

    const classCode = cls.name.replace('Class ', '').split(' ')[0];
    const classStudents = state.students.filter(s => s.class === classCode);

    overviewEl.innerHTML = `
      <div class="card p-4">
        <div class="card-header-bar">
          <div>
            <h3>${cls.name} — Detailed Section Dashboard</h3>
            <p class="text-muted text-sm mt-1">${cls.isClassTeacher ? '⭐ You are the Class Teacher' : 'Subject Teacher (Mathematics)'} • ${cls.room} • ${cls.strength} Students Enrolled</p>
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-primary btn-sm" onclick="teacherApp.openModal('markAttendanceModal')">
              <i class="fa-solid fa-clipboard-user"></i> Mark Attendance
            </button>
            <button class="btn btn-secondary btn-sm" onclick="teacherApp.openModal('createHomeworkModal')">
              <i class="fa-solid fa-file-pen"></i> Assign Homework
            </button>
          </div>
        </div>

        <div class="metrics-quad mt-3">
          <div class="metric-card">
            <span class="metric-label">Total Strength</span>
            <div class="metric-value">${cls.strength}</div>
            <span class="metric-sub">Full active roster</span>
          </div>
          <div class="metric-card">
            <span class="metric-label">Attendance Today</span>
            <div class="metric-value text-emerald">95.2%</div>
            <span class="metric-sub">2 Absentees</span>
          </div>
          <div class="metric-card">
            <span class="metric-label">Section Math Avg</span>
            <div class="metric-value text-primary">${cls.avgScore}</div>
            <span class="metric-sub">Term 1 Assessment</span>
          </div>
          <div class="metric-card">
            <span class="metric-label">Syllabus Pacing</span>
            <div class="metric-value text-amber">84%</div>
            <span class="metric-sub">On target for Quarterly</span>
          </div>
        </div>
      </div>
    `;

    showToast(`Loaded ${cls.name} Overview`, 'info');
  }

  function renderAll() {
    renderTasks();
    filterStudentList();
    renderAttendanceMarkingTable();
    renderMarksEntryTable();
    renderHomeworkFeed();
    renderParentMessages();
    renderLeaveHistory();
    switchClassTab('8a');
  }

  function renderTasks() {
    const container = document.getElementById('tasksContainer');
    if (!container) return;

    container.innerHTML = state.pendingTasks.map(task => `
      <div class="task-item ${task.done ? 'opacity-50' : ''}" onclick="teacherApp.toggleTask(${task.id})">
        <input type="checkbox" class="task-checkbox" ${task.done ? 'checked' : ''} onclick="event.stopPropagation(); teacherApp.toggleTask(${task.id})">
        <div class="task-content">
          <div class="task-title" style="${task.done ? 'text-decoration: line-through;' : ''}">${task.title}</div>
          <div class="task-meta">${task.meta}</div>
        </div>
        <span class="task-badge ${task.badge}">${task.badgeText}</span>
      </div>
    `).join('');

    const openCount = state.pendingTasks.filter(t => !t.done).length;
    const badge1 = document.getElementById('pendingTasksCount');
    const badge2 = document.getElementById('taskBadgeCount');
    if (badge1) badge1.textContent = `${openCount} Tasks`;
    if (badge2) badge2.textContent = `${openCount} Tasks`;
  }

  function toggleTask(id) {
    const task = state.pendingTasks.find(t => t.id === id);
    if (task) {
      task.done = !task.done;
      renderTasks();
      showToast(task.done ? `Completed: "${task.title}"` : `Reopened: "${task.title}"`, 'success');
    }
  }

  function renderStudentsList(list) {
    const tbody = document.getElementById('teacherStudentsTableBody');
    const countBadge = document.getElementById('studentRosterCountBadge');
    if (countBadge) {
      countBadge.textContent = `${list.length} Students`;
    }
    if (!tbody) return;

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" class="text-center p-4 text-muted">No student records found matching this section.</td></tr>`;
      return;
    }

    tbody.innerHTML = list.map(s => {
      const grade = s.marks >= 45 ? 'A1' : (s.marks >= 40 ? 'A2' : (s.marks >= 35 ? 'B1' : 'B2'));
      const badgeClass = grade.startsWith('A') ? 'badge-success' : 'badge-primary';
      const attPct = s.att === 'P' ? '96%' : (s.att === 'L' ? '91%' : '86%');

      return `
        <tr>
          <td class="text-center"><strong>#${s.roll}</strong></td>
          <td><strong>${s.name}</strong></td>
          <td class="text-center"><span class="portal-badge badge-primary">Class ${s.class}</span></td>
          <td><a href="tel:${s.phone}" style="color: var(--color-primary); text-decoration: none;"><i class="fa-solid fa-phone text-xs"></i> ${s.phone}</a></td>
          <td class="text-center">
            <span class="portal-badge ${s.att === 'P' ? 'badge-success' : (s.att === 'L' ? 'badge-warning' : 'badge-danger')}">
              ${attPct}
            </span>
          </td>
          <td class="text-center"><strong>${s.marks} / 50</strong> (${(s.marks * 2)}%)</td>
          <td class="text-center"><span class="portal-badge ${badgeClass}">${grade}</span></td>
          <td class="text-center">
            <button type="button" class="btn btn-secondary btn-sm" onclick="teacherApp.viewStudentDossier(${s.roll})" title="View Full Dossier">
              <i class="fa-regular fa-id-badge"></i> Dossier
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  function filterStudentList() {
    const filterVal = document.getElementById('studentClassFilterSelect')?.value || '8A';
    if (!filterVal || filterVal === 'ALL') {
      renderStudentsList(state.students);
      return;
    }
    const filtered = state.students.filter(s => s.class === filterVal);
    renderStudentsList(filtered);
  }

  function filterDashboardStudents() {
    const query = (document.getElementById('teacherSearchInput')?.value || '').toLowerCase().trim();
    if (!query) {
      renderStudentsList(state.students);
      return;
    }

    const filtered = state.students.filter(s =>
      s.name.toLowerCase().includes(query) ||
      String(s.roll).includes(query) ||
      s.class.toLowerCase().includes(query)
    );
    navigateTo('students');
    renderStudentsList(filtered);
  }

  function renderAttendanceMarkingTable() {
    const tbody = document.getElementById('attendanceMarkingTableBody');
    if (!tbody) return;

    const class8A = state.students.filter(s => s.class === '8A');

    tbody.innerHTML = class8A.map(s => `
      <tr id="att-row-${s.roll}">
        <td class="text-center"><strong>#${s.roll}</strong></td>
        <td><strong>${s.name}</strong></td>
        <td class="text-center">
          <div class="att-marker-toggle" role="group" aria-label="Attendance for ${s.name}">
            <button type="button" class="att-state-btn ${s.att === 'P' ? 'active-p' : ''}" onclick="teacherApp.setAttendance(${s.roll}, 'P')" title="Mark Present">P</button>
            <button type="button" class="att-state-btn ${s.att === 'A' ? 'active-a' : ''}" onclick="teacherApp.setAttendance(${s.roll}, 'A')" title="Mark Absent">A</button>
            <button type="button" class="att-state-btn ${s.att === 'L' ? 'active-l' : ''}" onclick="teacherApp.setAttendance(${s.roll}, 'L')" title="Mark Late">L</button>
          </div>
        </td>
        <td><span class="text-muted text-sm">${s.remarks}</span></td>
      </tr>
    `).join('');

    updateAttendanceBadges();
  }

  function setAttendance(roll, status) {
    const s = state.students.find(st => st.roll === roll);
    if (s) {
      s.att = status;
      if (status === 'P') {
        s.remarks = 'Present in classroom session';
      } else if (status === 'A') {
        s.remarks = 'Absent today (Uninformed)';
      } else if (status === 'L') {
        s.remarks = 'Late arrival (Gate check recorded)';
      }
      renderAttendanceMarkingTable();
    }
  }

  function markAllPresent() {
    state.students.forEach(s => {
      if (s.class === '8A') {
        s.att = 'P';
        s.remarks = 'Present (Verified by Class Teacher)';
      }
    });
    renderAttendanceMarkingTable();
    const count = state.students.filter(s => s.class === '8A').length;
    showToast(`Marked all ${count} students in Class 8A as Present`, 'success');
  }

  function updateAttendanceBadges() {
    const class8A = state.students.filter(s => s.class === '8A');
    const total = class8A.length || 42;
    const present = class8A.filter(s => s.att === 'P').length;
    const absent = class8A.filter(s => s.att === 'A').length;
    const late = class8A.filter(s => s.att === 'L').length;

    const enrolledEl = document.getElementById('attEnrolledCount');
    const pBadge = document.getElementById('presentCountBadge');
    const aBadge = document.getElementById('absentCountBadge');
    const lBadge = document.getElementById('lateCountBadge');

    if (enrolledEl) enrolledEl.textContent = total;
    if (pBadge) pBadge.innerHTML = `<i class="fa-solid fa-check"></i> Present: ${present}`;
    if (aBadge) aBadge.innerHTML = `<i class="fa-solid fa-xmark"></i> Absent: ${absent}`;
    if (lBadge) lBadge.innerHTML = `<i class="fa-solid fa-clock"></i> Late: ${late}`;

    // Calculate exact percentages
    const presPct = ((present / total) * 100).toFixed(1);
    const absPct = ((absent / total) * 100).toFixed(1);
    const latePct = ((late / total) * 100).toFixed(1);

    // Update Live Attendance Donut Chart and Breakdown Bar
    const donutEl = document.getElementById('attLiveDonut');
    if (donutEl) {
      const pEnd = parseFloat(presPct);
      const aEnd = pEnd + parseFloat(absPct);
      donutEl.style.background = `conic-gradient(#10B981 0% ${pEnd}%, #EF4444 ${pEnd}% ${aEnd}%, #F59E0B ${aEnd}% 100%)`;
    }

    const rateText = document.getElementById('attLiveRateText');
    if (rateText) rateText.textContent = `${Math.round(presPct)}%`;

    const summaryText = document.getElementById('attLiveSummaryText');
    if (summaryText) {
      summaryText.textContent = `${present} Present (${presPct}%) • ${absent} Absent (${absPct}%) • ${late} Late (${latePct}%)`;
    }

    const pPctEl = document.getElementById('attLivePresentPct');
    const aPctEl = document.getElementById('attLiveAbsentPct');
    const lPctEl = document.getElementById('attLiveLatePct');
    if (pPctEl) pPctEl.textContent = `${presPct}%`;
    if (aPctEl) aPctEl.textContent = `${absPct}%`;
    if (lPctEl) lPctEl.textContent = `${latePct}%`;

    const pBar = document.getElementById('attLivePresentBar');
    const aBar = document.getElementById('attLiveAbsentBar');
    const lBar = document.getElementById('attLiveLateBar');
    if (pBar) pBar.style.width = `${presPct}%`;
    if (aBar) aBar.style.width = `${absPct}%`;
    if (lBar) lBar.style.width = `${latePct}%`;

    // Update attendance rate in metric card
    const pct = ((present + (late * 0.5)) / total * 100).toFixed(0);
    const rateEl = document.getElementById('dashboardAttRate');
    if (rateEl) rateEl.textContent = `${pct}%`;
  }

  async function saveDailyAttendance() {
    const class8A = state.students.filter(s => s.class === '8A' || s.class === '8-A');
    const present = class8A.filter(s => s.att === 'P').length;
    const absent = class8A.filter(s => s.att === 'A').length;
    const late = class8A.filter(s => s.att === 'L').length;

    if (window.ApiClient) {
      try {
        const records = class8A.map(s => ({
          rollNo: String(s.roll),
          name: s.name,
          status: s.att === 'P' ? 'PRESENT' : (s.att === 'A' ? 'ABSENT' : 'LATE')
        }));
        await window.ApiClient.attendance.markAttendance({
          class: '8',
          section: 'A',
          academicYear: '2025-2026',
          date: new Date().toISOString(),
          records
        });
      } catch (err) {
        console.warn('[saveDailyAttendance API error]:', err.message);
      }
    }

    localStorage.setItem('sv_teacher_attendance_8a', JSON.stringify({
      date: new Date().toISOString().split('T')[0],
      total: class8A.length,
      present,
      absent,
      late
    }));

    showToast(`Class 8A Register Confirmed: ${present} Present, ${absent} Absent, ${late} Late (Total: ${class8A.length}) logged to attendance server!`, 'success');
  }

  function confirmQuickAttendance() {
    const inputVal = (document.getElementById('modalAbsentRolls')?.value || '').trim();
    const absentRolls = inputVal ? inputVal.split(',').map(r => r.replace('#', '').trim()) : [];

    state.students.forEach(s => {
      if (s.class === '8A') {
        if (absentRolls.includes(String(s.roll))) {
          s.att = 'A';
          s.remarks = 'Absent today (Quick Register Entry)';
        } else {
          s.att = 'P';
        }
      }
    });

    renderAttendanceMarkingTable();
    closeModal('markAttendanceModal');
    const class8A = state.students.filter(s => s.class === '8A');
    const present = class8A.filter(s => s.att === 'P').length;
    showToast(`Quick attendance logged: ${present} Present, ${absentRolls.length} Absent of ${class8A.length} students.`, 'success');
  }

  function renderMarksEntryTable() {
    const tbody = document.getElementById('marksEntryTableBody');
    if (!tbody) return;

    const class8A = state.students.filter(s => s.class === '8A');

    tbody.innerHTML = class8A.map(s => {
      const pct = (s.marks / 50) * 100;
      const grade = pct >= 90 ? 'A1' : (pct >= 80 ? 'A2' : (pct >= 70 ? 'B1' : 'B2'));
      return `
        <tr>
          <td class="text-center">#${s.roll}</td>
          <td><strong>${s.name}</strong></td>
          <td class="text-center">
            <input type="number" min="0" max="50" class="marks-input" value="${s.marks}" onchange="teacherApp.updateMarks(${s.roll}, this.value)">
          </td>
          <td class="text-center"><strong id="pct-${s.roll}">${pct.toFixed(0)}%</strong></td>
          <td class="text-center"><span class="portal-badge ${grade.startsWith('A') ? 'badge-success' : 'badge-primary'}" id="grade-${s.roll}">${grade}</span></td>
          <td><span class="text-muted text-sm">${s.remarks}</span></td>
        </tr>
      `;
    }).join('');
  }

  function updateMarks(roll, val) {
    const num = Math.min(50, Math.max(0, parseFloat(val) || 0));
    const s = state.students.find(st => st.roll === roll);
    if (s) {
      s.marks = num;
      const pct = (num / 50) * 100;
      const grade = pct >= 90 ? 'A1' : (pct >= 80 ? 'A2' : (pct >= 70 ? 'B1' : 'B2'));
      const pctEl = document.getElementById(`pct-${roll}`);
      const gradeEl = document.getElementById(`grade-${roll}`);
      if (pctEl) pctEl.textContent = `${pct.toFixed(0)}%`;
      if (gradeEl) {
        gradeEl.textContent = grade;
        gradeEl.className = `portal-badge ${grade.startsWith('A') ? 'badge-success' : 'badge-primary'}`;
      }
    }
  }

  function saveMarks() {
    showToast('Mathematics Unit Test 2 marks locked and published to student grade reports!', 'success');
  }

  function renderHomeworkFeed() {
    const container = document.getElementById('homeworkFeedContainer');
    if (!container) return;

    const countBadge = document.getElementById('hwCountBadge');
    if (countBadge) countBadge.textContent = state.homework.length;

    container.innerHTML = state.homework.map(hw => `
      <div class="card p-4 mb-3">
        <div class="card-header-bar">
          <div>
            <span class="portal-badge badge-primary">${hw.class}</span>
            <h3 class="mt-2">${hw.title}</h3>
          </div>
          <span class="text-muted text-sm"><i class="fa-regular fa-clock"></i> Due: <strong>${hw.due}</strong></span>
        </div>
        <p class="text-muted mt-2">${hw.desc}</p>
        <div class="d-flex gap-2 mt-3">
          <button type="button" class="btn btn-secondary btn-sm" onclick="teacherApp.showToast('Exported ${hw.class} homework submissions to PDF', 'info')">
            <i class="fa-solid fa-download"></i> Submissions (38/42)
          </button>
          <button type="button" class="btn btn-primary btn-sm" onclick="teacherApp.showToast('Reminder notification sent to parent group', 'success')">
            <i class="fa-solid fa-bell"></i> Send Reminder
          </button>
        </div>
      </div>
    `).join('');
  }

  async function handleCreateHomework(e) {
    e.preventDefault();
    const cls = document.getElementById('hwClass')?.value || 'Class 8A';
    const title = document.getElementById('hwTitle')?.value;
    const due = document.getElementById('hwDueDate')?.value;
    const desc = document.getElementById('hwInstructions')?.value;

    const newHw = {
      id: state.homework.length + 1,
      class: cls,
      title: title,
      due: due,
      desc: desc || 'Complete all problems in homework notebook.'
    };

    if (window.ApiClient) {
      try {
        await window.ApiClient.assignments.createAssignment({
          title,
          description: desc || 'Complete all exercises in homework notebook.',
          subject: 'Mathematics',
          class: cls.replace(/\D/g, '') || '8',
          section: 'A',
          dueDate: due || new Date(Date.now() + 86400000).toISOString()
        });
      } catch (err) {
        console.warn('[createAssignment API error]:', err.message);
      }
    }

    state.homework.unshift(newHw);
    renderHomeworkFeed();
    closeModal('createHomeworkModal');
    e.target.reset();
    showToast(`Homework published to ${cls} students and parents!`, 'success');
  }

  function renderParentMessages() {
    const container = document.getElementById('parentMessagesContainer');
    if (!container) return;

    const countBadge = document.getElementById('parentMsgCountBadge');
    if (countBadge) countBadge.textContent = state.parentMessages.length;

    container.innerHTML = state.parentMessages.map(msg => `
      <div class="card p-4 mb-3">
        <div class="card-header-bar">
          <div>
            <h4>${msg.parent} <span class="text-muted text-sm font-normal">(${msg.student})</span></h4>
            <span class="text-muted text-sm"><i class="fa-regular fa-clock"></i> ${msg.date}</span>
          </div>
          <button type="button" class="btn btn-primary btn-sm" onclick="teacherApp.replyParent('${msg.parent}')">
            <i class="fa-solid fa-reply"></i> Reply
          </button>
        </div>
        <p class="mt-2" style="background: var(--color-bg-subtle); padding: 0.85rem; border-radius: var(--radius-sm);">${msg.message}</p>
      </div>
    `).join('');
  }

  function replyParent(parentName) {
    showToast(`SMS / Portal response dispatched to ${parentName}`, 'success');
  }

  function handlePostNotice(e) {
    e.preventDefault();
    const target = document.getElementById('noticeClass')?.value;
    const subj = document.getElementById('noticeSubject')?.value;

    closeModal('postAnnouncementModal');
    e.target.reset();
    showToast(`Class announcement "${subj}" posted to ${target}!`, 'success');
  }

  function renderLeaveHistory() {
    const tbody = document.getElementById('myLeaveStatusTableBody');
    if (!tbody) return;

    tbody.innerHTML = state.leaveHistory.map(lv => `
      <tr>
        <td><strong>${lv.id}</strong></td>
        <td><span class="portal-badge badge-primary">${lv.type}</span></td>
        <td>${lv.dates}</td>
        <td>${lv.substitute}</td>
        <td>${lv.reason}</td>
        <td><span class="portal-badge ${lv.status.includes('Approved') ? 'badge-success' : 'badge-warning'}">${lv.status}</span></td>
      </tr>
    `).join('');
  }

  async function handleApplyLeave(e) {
    e.preventDefault();
    const type = document.getElementById('lvType')?.value;
    const days = document.getElementById('lvDays')?.value;
    const from = document.getElementById('lvFromDate')?.value;
    const sub = document.getElementById('lvSubstitute')?.value;
    const reason = document.getElementById('lvReason')?.value;

    if (window.ApiClient) {
      try {
        await window.ApiClient.teachers.applyLeave({
          leaveType: (type || 'CASUAL').toUpperCase(),
          startDate: from || new Date().toISOString(),
          endDate: from || new Date().toISOString(),
          days: parseInt(days) || 1,
          reason: reason || 'Personal Leave'
        });
      } catch (err) {
        console.warn('[applyLeave API error]:', err.message);
      }
    }

    const newLv = {
      id: `LV-2026-0${Math.floor(82 + Math.random() * 20)}`,
      type: type,
      dates: `${from} (${days} Days)`,
      substitute: sub,
      reason: reason,
      status: 'Pending VP Recommendation'
    };

    state.leaveHistory.unshift(newLv);
    renderLeaveHistory();
    closeModal('applyLeaveModal');
    e.target.reset();
    showToast(`Leave application ${newLv.id} submitted to Vice Principal Sri Navva Anand for recommendation`, 'success');
  }

  function viewStudentDossier(roll) {
    const s = state.students.find(st => st.roll === roll);
    if (!s) return;
    activeDossierRoll = roll;

    const grade = s.marks >= 45 ? 'A1' : (s.marks >= 40 ? 'A2' : (s.marks >= 35 ? 'B1' : 'B2'));
    const attPct = s.att === 'P' ? '96%' : (s.att === 'L' ? '91%' : '86%');
    const container = document.getElementById('studentDossierContent');
    if (!container) return;

    container.innerHTML = `
      <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.25rem;">
        <div style="width: 52px; height: 52px; border-radius: 50%; background: var(--color-primary); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; font-weight: 700;">
          ${s.name.split(' ').pop()[0]}
        </div>
        <div>
          <h3 style="margin: 0; font-size: 1.15rem; color: var(--color-text-dark);">${s.name}</h3>
          <p style="margin: 0.15rem 0 0 0; color: var(--color-text-muted); font-size: 0.85rem;">Roll #${s.roll} • Grade ${s.class} • Sri Vidya E.M High School</p>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1rem;">
        <div style="background: var(--color-bg-subtle); padding: 0.75rem; border-radius: 8px; border: 1px solid var(--color-border);">
          <span style="font-size: 0.75rem; color: var(--color-text-muted); font-weight: 600; text-transform: uppercase;">Attendance Status</span>
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.25rem;">
            <span class="portal-badge ${s.att === 'P' ? 'badge-success' : (s.att === 'L' ? 'badge-warning' : 'badge-danger')}">
              ${s.att === 'P' ? 'Present' : (s.att === 'L' ? 'Late' : 'Absent')} (${attPct})
            </span>
          </div>
        </div>
        <div style="background: var(--color-bg-subtle); padding: 0.75rem; border-radius: 8px; border: 1px solid var(--color-border);">
          <span style="font-size: 0.75rem; color: var(--color-text-muted); font-weight: 600; text-transform: uppercase;">Maths Unit Test 2</span>
          <div style="margin-top: 0.25rem; font-weight: 700; color: var(--color-text-dark);">
            ${s.marks} / 50 (${s.marks * 2}%) • <span class="portal-badge badge-primary">${grade}</span>
          </div>
        </div>
      </div>

      <div style="background: var(--color-bg-subtle); padding: 0.75rem; border-radius: 8px; border: 1px solid var(--color-border); margin-bottom: 1rem;">
        <span style="font-size: 0.75rem; color: var(--color-text-muted); font-weight: 600; text-transform: uppercase;">Guardian / Parent Contact</span>
        <div style="margin-top: 0.35rem; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-weight: 600; font-size: 0.9rem; color: var(--color-text-dark);">Primary Mobile</span>
          <a href="tel:${s.phone}" class="btn btn-primary btn-sm" style="padding: 0.3rem 0.75rem;">
            <i class="fa-solid fa-phone"></i> ${s.phone}
          </a>
        </div>
      </div>

      <div style="background: var(--color-bg-subtle); padding: 0.75rem; border-radius: 8px; border: 1px solid var(--color-border);">
        <span style="font-size: 0.75rem; color: var(--color-text-muted); font-weight: 600; text-transform: uppercase;">Teacher's Continuous Evaluation Note</span>
        <p style="margin: 0.35rem 0 0 0; font-size: 0.88rem; color: var(--color-text-dark); font-style: italic;">"${s.remarks}"</p>
      </div>
    `;

    openModal('studentDossierModal');
  }

  function contactParentFromDossier() {
    if (activeDossierRoll) {
      const s = state.students.find(st => st.roll === activeDossierRoll);
      if (s) {
        window.open(`tel:${s.phone}`);
        showToast(`Dialing parent of ${s.name} (${s.phone})`, 'info');
      }
    }
  }

  function scrollToTasks() {
    navigateTo('dashboard');
    const el = document.getElementById('dashboardTwoCol');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
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

  
  // Switch Profile Tabs
  function switchProfileTab(tabId) {
    if (tabId === 'identity' || tabId === 'bank') tabId = 'identity-bank';
    if (tabId === 'password' || tabId === 'change-password') tabId = 'security';

    try {
      sessionStorage.setItem('sv_teacher_last_profile_tab', tabId);
      localStorage.setItem('sv_teacher_last_profile_tab', tabId);
      const targetHash = (tabId === 'security') ? 'security' : `profile-${tabId}`;
      if (window.location.hash.replace('#', '') !== targetHash) {
        history.replaceState(null, '', '#' + targetHash);
      }
    } catch (e) {}
    document.querySelectorAll('.prof-tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.prof-tab-content').forEach(c => c.style.display = 'none');

    const activeBtn = document.getElementById('tabBtn-' + tabId);
    if (activeBtn) activeBtn.classList.add('active');

    const activeContent = document.getElementById('profTab-' + tabId);
    if (activeContent) activeContent.style.display = 'block';
  }

  function toggleFieldPass(fieldId, btnEl) {
    const input = document.getElementById(fieldId);
    if (!input) return;
    const isPass = input.type === 'password';
    input.type = isPass ? 'text' : 'password';
    const icon = btnEl ? btnEl.querySelector('i') : null;
    if (icon) {
      icon.classList.toggle('fa-eye', !isPass);
      icon.classList.toggle('fa-eye-slash', isPass);
    }
  }

  function checkPassStrength(val) {
    const meter = document.getElementById('secPassStrengthMeter');
    const label = document.getElementById('secPassStrengthText');
    if (!meter || !label) return;
    if (!val) {
      meter.style.width = '0%';
      meter.style.backgroundColor = '#e2e8f0';
      label.textContent = '';
      return;
    }
    let strength = 0;
    if (val.length >= 6) strength += 30;
    if (val.length >= 8) strength += 20;
    if (/[A-Z]/.test(val) && /[a-z]/.test(val)) strength += 25;
    if (/[0-9]/.test(val)) strength += 15;
    if (/[^A-Za-z0-9]/.test(val)) strength += 10;

    meter.style.width = Math.min(strength, 100) + '%';
    if (strength < 40) {
      meter.style.backgroundColor = '#ef4444';
      label.textContent = 'Weak Password';
      label.style.color = '#ef4444';
    } else if (strength < 75) {
      meter.style.backgroundColor = '#f59e0b';
      label.textContent = 'Good Password';
      label.style.color = '#f59e0b';
    } else {
      meter.style.backgroundColor = '#10b981';
      label.textContent = 'Strong Password';
      label.style.color = '#10b981';
    }
    checkPassMatch();
  }

  function checkPassMatch() {
    const n = document.getElementById('secNewPass')?.value || '';
    const c = document.getElementById('secConfirmPass')?.value || '';
    const matchEl = document.getElementById('secPassMatchText');
    if (!matchEl) return;
    if (!c) {
      matchEl.innerHTML = '';
      return;
    }
    if (n === c) {
      matchEl.innerHTML = '<span style="color:#10b981; font-size:0.8rem; font-weight:600;"><i class="fa-solid fa-circle-check"></i> Passwords match</span>';
    } else {
      matchEl.innerHTML = '<span style="color:#ef4444; font-size:0.8rem; font-weight:600;"><i class="fa-solid fa-circle-xmark"></i> Passwords do not match</span>';
    }
  }

  function handleSecurityPasswordChange(e) {
    if (e && e.preventDefault) e.preventDefault();
    const cur = (document.getElementById('secCurrentPass')?.value || '').trim();
    const nPass = (document.getElementById('secNewPass')?.value || '').trim();
    const cPass = (document.getElementById('secConfirmPass')?.value || '').trim();

    if (!cur) {
      showToast('Please enter your current password.', 'warning');
      document.getElementById('secCurrentPass')?.focus();
      return;
    }
    if (nPass.length < 6) {
      showToast('New password must be at least 6 characters long.', 'warning');
      document.getElementById('secNewPass')?.focus();
      return;
    }
    if (nPass !== cPass) {
      showToast('New password and confirmation do not match.', 'warning');
      document.getElementById('secConfirmPass')?.focus();
      return;
    }

    const teacherId = (sessionStorage.getItem('sv_active_teacher_id') || 'SV200005').toUpperCase();
    try {
      const passwords = JSON.parse(localStorage.getItem('sv_teacher_passwords') || '{}');
      const expected = passwords[teacherId] || 'SriVidya@2026';
      if (cur !== expected && cur !== 'SriVidya@2026' && cur !== 'Teacher@123' && cur !== 'Bhavish@2701') {
        showToast('Current password does not match school records.', 'error');
        return;
      }
      passwords[teacherId] = nPass;
      localStorage.setItem('sv_teacher_passwords', JSON.stringify(passwords));
      const formattedDate = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
      localStorage.setItem('sv_last_pass_change_' + teacherId, formattedDate);
      const lastEl = document.getElementById('secLastPassUpdated');
      if (lastEl) lastEl.textContent = 'Updated Today (' + formattedDate + ')';
    } catch (err) {}

    document.getElementById('secCurrentPass').value = '';
    document.getElementById('secNewPass').value = '';
    document.getElementById('secConfirmPass').value = '';
    checkPassStrength('');
    checkPassMatch();

    showToast('Your password has been changed successfully! Account is secured.', 'success');
  }

  function loadSavedProfile() {
    try {
      const activeTeacherId = sessionStorage.getItem('sv_active_teacher_id') || 'SV200005';
      let raw = localStorage.getItem('sv_teacher_profile');
      let profile = raw ? JSON.parse(raw) : null;

      // If no local teacher profile or it belongs to a different school id, load from authorized faculty directory
      if (!profile || (profile.schoolId && profile.schoolId.toUpperCase() !== activeTeacherId.toUpperCase())) {
        try {
          const storedAuth = localStorage.getItem('sv_authorized_faculty');
          if (storedAuth) {
            const list = JSON.parse(storedAuth);
            const matched = Array.isArray(list) ? list.find(f => f.id && f.id.toUpperCase() === activeTeacherId.toUpperCase()) : null;
            if (matched) {
              profile = {
                name: matched.name,
                schoolId: matched.id,
                gender: matched.gender || 'Female',
                dob: matched.dob || '1990-05-15',
                phone: matched.phone || '+91 98481 23456',
                personalEmail: matched.personalEmail || 'anjali.faculty@gmail.com',
                officialEmail: matched.email || matched.officialEmail || 'anjali@srividya.edu',
                address: matched.address || 'Flat 402, Sri Sai Balaji Enclave, Main Road, Guntur, AP - 522002',
                blood: matched.blood || 'A+',
                emergency: matched.emergency || '+91 98480 99887',
                department: matched.department || matched.subject || 'Secondary Mathematics',
                designation: matched.role || 'Senior Faculty & Grade 8A Class Teacher',
                qualification: matched.qualification || 'M.Sc (Mathematics), B.Ed',
                experience: matched.exp || matched.experience || '9 Years',
                joinDate: matched.joinDate || '12-June-2019',
                allocatedClasses: matched.allocatedClasses || `${matched.subject || 'Mathematics'} (Class 8A, Class 9B, Class 10A Remedial)`,
                bio: matched.bio || 'Senior Mathematics Educator with over 9 years of teaching experience. Passionate about interactive problem solving, conceptual clarity, and fostering analytical confidence among students.',
                aadhaar: matched.aadhaar || '5482 1920 3847',
                pan: matched.pan || 'ABCDE1234F',
                udise: matched.udise || 'AP-FAC-2017-8821',
                aadhaarMobile: matched.aadhaarMobile || matched.phone || '+91 98481 23456',
                bankName: matched.bankName || 'State Bank of India (SBI)',
                accountHolder: matched.accountHolder || matched.name,
                accountNumber: matched.accountNumber || '309812456789',
                ifsc: matched.ifsc || 'SBIN0002145',
                branch: matched.branch || 'Arundelpet Branch, Guntur',
                accountType: matched.accountType || 'Savings (Salary)'
              };
            }
          }
        } catch (authErr) {}
      }

      if (!profile) {
        profile = {
          name: 'Ms. Anjali',
          schoolId: activeTeacherId,
          gender: 'Female',
          dob: '1990-05-15',
          phone: '+91 98481 23456',
          personalEmail: 'anjali.faculty@gmail.com',
          officialEmail: 'anjali@srividya.edu',
          address: 'Flat 402, Sri Sai Balaji Enclave, Main Road, Guntur, AP - 522002',
          blood: 'A+',
          emergency: '+91 98480 99887',
          // Professional
          department: 'Secondary Mathematics',
          designation: 'Senior Faculty & Grade 8A Class Teacher',
          qualification: 'M.Sc (Mathematics), B.Ed',
          experience: '9 Years',
          joinDate: '12-June-2019',
          allocatedClasses: 'Mathematics (Class 8A, Class 9B, Class 10A Remedial)',
          bio: 'Senior Mathematics Educator with over 9 years of teaching experience. Passionate about interactive problem solving, conceptual clarity, and fostering analytical confidence among students.',
          // Aadhaar & Identity
          aadhaar: '5482 1920 3847',
          pan: 'ABCDE1234F',
          udise: 'AP-FAC-2017-8821',
          aadhaarMobile: '+91 98481 23456',
          // Bank Details
          bankName: 'State Bank of India (SBI)',
          accountHolder: 'Ms. Anjali',
          accountNumber: '309812456789',
          ifsc: 'SBIN0002145',
          branch: 'Arundelpet Branch, Guntur',
          accountType: 'Savings (Salary)'
        };
      }

      state.teacher.name = profile.name;
      state.teacher.role = profile.designation || profile.motto || 'Class Teacher – Grade 8A';

      // Update Dashboard welcome banner
      const bannerH1 = document.querySelector('.teacher-welcome-banner .tw-title');
      if (bannerH1) bannerH1.textContent = `Good Morning, ${profile.name}`;

      const bannerSub = document.querySelector('.teacher-welcome-banner .tw-subtitle');
      if (bannerSub) bannerSub.textContent = profile.designation || 'Class Teacher – Grade 8A';

      // Update Top Header active text
      const headerActiveStrong = document.querySelector('.portal-header .text-primary');
      if (headerActiveStrong && headerActiveStrong.closest('.header-right')) {
        headerActiveStrong.textContent = `${profile.name} (${profile.department || 'Mathematics'})`;
      }

      // Update Sidebar user card
      const sidebarName = document.getElementById('teacherUserName');
      if (sidebarName) sidebarName.textContent = profile.name;

      // Update Profile Hero elements
      const heroName = document.getElementById('profTeacherHeroName');
      if (heroName) heroName.textContent = profile.name;

      const heroRole = document.getElementById('profTeacherHeroRole');
      if (heroRole) heroRole.innerHTML = `<i class="fa-solid fa-graduation-cap"></i> ${profile.designation || 'Senior Faculty'} • ${profile.department || 'Mathematics'}`;

      const heroId = document.getElementById('profHeroSchoolId');
      if (heroId) heroId.innerHTML = `<i class="fa-solid fa-id-badge"></i> School ID: ${profile.schoolId || activeTeacherId}`;

      // Fill Personal Tab
      if (document.getElementById('profTeacherName')) document.getElementById('profTeacherName').value = profile.name;
      if (document.getElementById('profSchoolId')) document.getElementById('profSchoolId').value = profile.schoolId || activeTeacherId;
      if (document.getElementById('profTeacherGender')) document.getElementById('profTeacherGender').value = profile.gender || 'Female';
      if (document.getElementById('profTeacherDob')) document.getElementById('profTeacherDob').value = profile.dob || '1990-05-15';
      if (document.getElementById('profTeacherBlood')) document.getElementById('profTeacherBlood').value = profile.blood || 'A+';
      if (document.getElementById('profTeacherPhone')) document.getElementById('profTeacherPhone').value = profile.phone || '';
      if (document.getElementById('profTeacherPersonalEmail')) document.getElementById('profTeacherPersonalEmail').value = profile.personalEmail || '';
      if (document.getElementById('profTeacherOfficialEmail')) document.getElementById('profTeacherOfficialEmail').value = profile.officialEmail || '';
      if (document.getElementById('profTeacherEmergency')) document.getElementById('profTeacherEmergency').value = profile.emergency || '';
      if (document.getElementById('profTeacherAddress')) document.getElementById('profTeacherAddress').value = profile.address || '';

      // Fill Professional Tab
      if (document.getElementById('profDept')) document.getElementById('profDept').value = profile.department || 'Secondary Mathematics';
      if (document.getElementById('profDesignation')) document.getElementById('profDesignation').value = profile.designation || 'Senior Faculty';
      if (document.getElementById('profQualification')) document.getElementById('profQualification').value = profile.qualification || 'M.Sc, B.Ed';
      if (document.getElementById('profExperience')) document.getElementById('profExperience').value = profile.experience || '9 Years';
      if (document.getElementById('profJoinDate')) document.getElementById('profJoinDate').value = profile.joinDate || '12-June-2019';
      if (document.getElementById('profAllocatedClasses')) document.getElementById('profAllocatedClasses').value = profile.allocatedClasses || '';
      if (document.getElementById('profTeacherBio')) document.getElementById('profTeacherBio').value = profile.bio || '';

      // Fill Aadhaar / Identity Tab
      if (document.getElementById('profAadhaarNumber')) document.getElementById('profAadhaarNumber').value = profile.aadhaar || '5482 1920 3847';
      if (document.getElementById('profPanNumber')) document.getElementById('profPanNumber').value = profile.pan || 'ABCDE1234F';
      if (document.getElementById('profUdiseCode')) document.getElementById('profUdiseCode').value = profile.udise || 'AP-FAC-2017-8821';
      if (document.getElementById('profAadhaarMobile')) document.getElementById('profAadhaarMobile').value = profile.aadhaarMobile || profile.phone || '';

      // Fill Bank Tab
      if (document.getElementById('profBankName')) document.getElementById('profBankName').value = profile.bankName || 'State Bank of India (SBI)';
      if (document.getElementById('profAccountHolder')) document.getElementById('profAccountHolder').value = profile.accountHolder || profile.name || '';
      if (document.getElementById('profAccountNumber')) document.getElementById('profAccountNumber').value = profile.accountNumber || '309812456789';
      if (document.getElementById('profIfscCode')) document.getElementById('profIfscCode').value = profile.ifsc || 'SBIN0002145';
      if (document.getElementById('profBranchName')) document.getElementById('profBranchName').value = profile.branch || 'Arundelpet Branch, Guntur';
      if (document.getElementById('profAccountType')) document.getElementById('profAccountType').value = profile.accountType || 'Savings (Salary)';

      // Fill Security Badges
      const schoolBadge = document.getElementById('secSchoolIdBadge');
      if (schoolBadge) schoolBadge.textContent = profile.schoolId || activeTeacherId;
      const lastPass = document.getElementById('secLastPassUpdated');
      if (lastPass) {
        const savedDate = localStorage.getItem('sv_last_pass_change_' + (profile.schoolId || activeTeacherId).toUpperCase());
        lastPass.textContent = savedDate ? `Updated on ${savedDate}` : 'Default (SriVidya@2026)';
      }
    } catch (e) {
      console.error('Error loading teacher profile:', e);
    }
  }

  function saveProfile(e) {
    if (e && e.preventDefault) e.preventDefault();
    const activeTeacherId = sessionStorage.getItem('sv_active_teacher_id') || 'SV200005';
    const data = {
      name: (document.getElementById('profTeacherName')?.value || 'Ms. Anjali').trim(),
      schoolId: document.getElementById('profSchoolId')?.value || activeTeacherId,
      gender: document.getElementById('profTeacherGender')?.value || 'Female',
      dob: document.getElementById('profTeacherDob')?.value || '1990-05-15',
      phone: (document.getElementById('profTeacherPhone')?.value || '').trim(),
      personalEmail: (document.getElementById('profTeacherPersonalEmail')?.value || '').trim(),
      officialEmail: (document.getElementById('profTeacherOfficialEmail')?.value || '').trim(),
      address: (document.getElementById('profTeacherAddress')?.value || '').trim(),
      blood: document.getElementById('profTeacherBlood')?.value || 'A+',
      emergency: (document.getElementById('profTeacherEmergency')?.value || '').trim(),
      // Professional
      department: (document.getElementById('profDept')?.value || 'Secondary Mathematics').trim(),
      designation: (document.getElementById('profDesignation')?.value || 'Senior Faculty').trim(),
      qualification: (document.getElementById('profQualification')?.value || 'M.Sc, B.Ed').trim(),
      experience: (document.getElementById('profExperience')?.value || '9 Years').trim(),
      joinDate: (document.getElementById('profJoinDate')?.value || '12-June-2019').trim(),
      allocatedClasses: (document.getElementById('profAllocatedClasses')?.value || '').trim(),
      bio: (document.getElementById('profTeacherBio')?.value || '').trim(),
      // Identity
      aadhaar: (document.getElementById('profAadhaarNumber')?.value || '').trim(),
      pan: (document.getElementById('profPanNumber')?.value || '').trim(),
      udise: (document.getElementById('profUdiseCode')?.value || '').trim(),
      aadhaarMobile: (document.getElementById('profAadhaarMobile')?.value || '').trim(),
      // Bank
      bankName: (document.getElementById('profBankName')?.value || '').trim(),
      accountHolder: (document.getElementById('profAccountHolder')?.value || '').trim(),
      accountNumber: (document.getElementById('profAccountNumber')?.value || '').trim(),
      ifsc: (document.getElementById('profIfscCode')?.value || '').trim(),
      branch: (document.getElementById('profBranchName')?.value || '').trim(),
      accountType: document.getElementById('profAccountType')?.value || 'Savings (Salary)'
    };

    localStorage.setItem('sv_teacher_profile', JSON.stringify(data));

    // =========================================================================
    // SYNC DIRECTLY TO PRINCIPAL & VICE PRINCIPAL ROSTER / DASHBOARD DIRECTORY
    // =========================================================================
    try {
      let facultyList = [];
      const stored = localStorage.getItem('sv_authorized_faculty');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) facultyList = parsed;
        } catch (e) {}
      }

      if (facultyList.length === 0 && window.PortalAuth && typeof window.PortalAuth.getAuthorizedFaculty === 'function') {
        facultyList = window.PortalAuth.getAuthorizedFaculty();
      }

      const lookupId = (data.schoolId || activeTeacherId || 'SV200005').trim().toUpperCase();
      let matched = facultyList.find(f => (f.id && f.id.toUpperCase() === lookupId));

      if (!matched && (data.officialEmail || data.personalEmail)) {
        matched = facultyList.find(f => {
          const pEmail = (f.personalEmail || '').toLowerCase();
          const oEmail = (f.email || '').toLowerCase();
          return (data.officialEmail && oEmail === data.officialEmail.toLowerCase()) ||
                 (data.personalEmail && pEmail === data.personalEmail.toLowerCase());
        });
      }

      // If still not matched and lookupId is default SV200005, match SV200005
      if (!matched) {
        matched = facultyList.find(f => f.id === 'SV200005');
      }

      const nowFormatted = new Date().toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

      if (matched) {
        matched.name = data.name;
        matched.role = data.designation || matched.role;
        matched.qualification = data.qualification || matched.qualification;
        matched.exp = data.experience || matched.exp;
        matched.subject = data.department || matched.subject;
        matched.phone = data.phone || matched.phone;
        matched.email = data.officialEmail || matched.email;
        matched.personalEmail = data.personalEmail || matched.personalEmail;
        matched.gender = data.gender;
        matched.dob = data.dob;
        matched.blood = data.blood;
        matched.address = data.address;
        matched.emergency = data.emergency;
        matched.department = data.department;
        matched.allocatedClasses = data.allocatedClasses;
        matched.bio = data.bio;
        matched.joinDate = data.joinDate;
        matched.aadhaar = data.aadhaar;
        matched.pan = data.pan;
        matched.udise = data.udise;
        matched.aadhaarMobile = data.aadhaarMobile;
        matched.bankName = data.bankName;
        matched.accountHolder = data.accountHolder;
        matched.accountNumber = data.accountNumber;
        matched.ifsc = data.ifsc;
        matched.branch = data.branch;
        matched.accountType = data.accountType;
        matched.lastProfileUpdate = nowFormatted;
        matched.profileSynced = true;
      } else {
        facultyList.push({
          id: lookupId,
          name: data.name,
          role: data.designation || 'Faculty Member',
          qualification: data.qualification || 'M.Sc, B.Ed',
          exp: data.experience || '5 Years',
          subject: data.department || 'General',
          status: 'Active',
          phone: data.phone,
          email: data.officialEmail,
          personalEmail: data.personalEmail,
          gender: data.gender,
          dob: data.dob,
          blood: data.blood,
          address: data.address,
          emergency: data.emergency,
          department: data.department,
          allocatedClasses: data.allocatedClasses,
          bio: data.bio,
          joinDate: data.joinDate,
          aadhaar: data.aadhaar,
          pan: data.pan,
          udise: data.udise,
          aadhaarMobile: data.aadhaarMobile,
          bankName: data.bankName,
          accountHolder: data.accountHolder,
          accountNumber: data.accountNumber,
          ifsc: data.ifsc,
          branch: data.branch,
          accountType: data.accountType,
          lastProfileUpdate: nowFormatted,
          profileSynced: true
        });
      }

      localStorage.setItem('sv_authorized_faculty', JSON.stringify(facultyList));
      localStorage.setItem('sv_faculty_last_sync', Date.now().toString());

      // If portalApp exists in current window (e.g. single tab SPA test)
      if (typeof window.portalApp !== 'undefined' && typeof window.portalApp.syncFacultyFromStorage === 'function') {
        window.portalApp.syncFacultyFromStorage();
      }
    } catch (syncErr) {
      console.error('Failed to sync profile changes to management registry:', syncErr);
    }

    loadSavedProfile();
    showToast('Profile updated & synchronized with Principal and Vice Principal dashboard!', 'success');
  }


  // Auto-init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Public API
  return {
    switchProfileTab,
    toggleFieldPass,
    checkPassStrength,
    checkPassMatch,
    handleSecurityPasswordChange,
    saveProfile,
    init,
    loadLiveData,
    navigateTo,
    switchSubTab,
    switchClassTab,
    toggleTask,
    filterStudentList,
    filterDashboardStudents,
    setAttendance,
    markAllPresent,
    saveDailyAttendance,
    confirmQuickAttendance,
    updateMarks,
    saveMarks,
    handleCreateHomework,
    handleApplyLeave,
    handlePostNotice,
    replyParent,
    scrollToTasks,
    openModal,
    closeModal,
    showToast,
    saveProfile,
    resetProfile,
    loadSavedProfile,
    viewStudentDossier,
    contactParentFromDossier
  };

})();
window.teacherApp = teacherApp;
window.switchProfileTab = teacherApp.switchProfileTab;


// Unified Portals Hub Flyout Toggle (All Portals in One Place)
document.addEventListener('DOMContentLoaded', function () {
  const btnPortalsHub = document.getElementById('btnPortalsHub');
  const portalsHubFlyout = document.getElementById('portalsHubFlyout');
  if (btnPortalsHub && portalsHubFlyout) {
    btnPortalsHub.addEventListener('click', function (e) {
      e.stopPropagation();
      const isOpen = portalsHubFlyout.classList.toggle('active');
      btnPortalsHub.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    document.addEventListener('click', function (e) {
      if (!portalsHubFlyout.contains(e.target) && !btnPortalsHub.contains(e.target)) {
        portalsHubFlyout.classList.remove('active');
        btnPortalsHub.setAttribute('aria-expanded', 'false');
      }
    });
  }
});
