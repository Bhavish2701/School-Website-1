/**
 * Sri Vidya E.M High School - Dedicated Teacher Portal
 * Faculty: Ms. Anjali (Class Teacher – Grade 8A, Mathematics)
 */

const teacherApp = (function () {
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

    if (subKey === 'mark') {
      renderAttendanceMarkingTable();
      showToast('Switched to Daily Attendance Marking Register', 'info');
    } else if (subKey === 'history') {
      showToast('Monthly register: 24 teaching days recorded with 96% attendance', 'info');
    } else if (subKey === 'report') {
      const class8A = state.students.filter(s => s.class === '8A');
      const absentees = class8A.filter(s => s.att === 'A' || s.att === 'L');
      showToast(`Showing Absentee Summary (${absentees.length} records)`, 'warning');
    }
  }

  function renderExaminationsSubTab(subKey) {
    if (subKey === 'enter-marks') {
      renderMarksEntryTable();
      showToast('Loaded Marks Entry Grid', 'info');
    } else if (subKey === 'create') {
      showToast('Assessment form ready for new examination entry', 'info');
    } else if (subKey === 'grade' || subKey === 'results') {
      showToast('Class 8A Grade Analytics: 28 Distinction, 11 First Class, 3 Remedial', 'info');
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
    const present = class8A.filter(s => s.att === 'P').length;
    const absent = class8A.filter(s => s.att === 'A').length;
    const late = class8A.filter(s => s.att === 'L').length;

    const enrolledEl = document.getElementById('attEnrolledCount');
    const pBadge = document.getElementById('presentCountBadge');
    const aBadge = document.getElementById('absentCountBadge');
    const lBadge = document.getElementById('lateCountBadge');

    if (enrolledEl) enrolledEl.textContent = class8A.length;
    if (pBadge) pBadge.innerHTML = `<i class="fa-solid fa-check"></i> Present: ${present}`;
    if (aBadge) aBadge.innerHTML = `<i class="fa-solid fa-xmark"></i> Absent: ${absent}`;
    if (lBadge) lBadge.innerHTML = `<i class="fa-solid fa-clock"></i> Late: ${late}`;

    // Update attendance rate in metric card
    const pct = ((present + (late * 0.5)) / class8A.length * 100).toFixed(0);
    const rateEl = document.getElementById('dashboardAttRate');
    if (rateEl) rateEl.textContent = `${pct}%`;
  }

  function saveDailyAttendance() {
    const class8A = state.students.filter(s => s.class === '8A');
    const present = class8A.filter(s => s.att === 'P').length;
    const absent = class8A.filter(s => s.att === 'A').length;
    const late = class8A.filter(s => s.att === 'L').length;

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

  function handleCreateHomework(e) {
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

  function handleApplyLeave(e) {
    e.preventDefault();
    const type = document.getElementById('lvType')?.value;
    const days = document.getElementById('lvDays')?.value;
    const from = document.getElementById('lvFromDate')?.value;
    const sub = document.getElementById('lvSubstitute')?.value;
    const reason = document.getElementById('lvReason')?.value;

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

  function loadSavedProfile() {
    try {
      const raw = localStorage.getItem('sv_teacher_profile');
      const profile = raw ? JSON.parse(raw) : {
        name: 'Ms. Anjali',
        motto: 'Class Teacher – Grade 8A',
        phone: '+91 98481 23456',
        personalEmail: 'anjali.faculty@gmail.com',
        address: 'Flat 402, Sri Sai Balaji Enclave, Main Road, Guntur, AP - 522002',
        bio: 'Senior Faculty with 9+ years of experience specializing in secondary school Mathematics. Passionate about interactive problem solving and academic excellence.',
        blood: 'A+',
        emergency: '+91 98480 99887'
      };

      state.teacher.name = profile.name;
      state.teacher.role = profile.motto;

      // Update Dashboard welcome banner
      const bannerH1 = document.querySelector('.teacher-welcome-banner .tw-title');
      if (bannerH1) bannerH1.textContent = `Good Morning, ${profile.name}`;

      const bannerSub = document.querySelector('.teacher-welcome-banner .tw-subtitle');
      if (bannerSub) bannerSub.textContent = profile.motto;

      // Update Top Header active text
      const headerActiveStrong = document.querySelector('.portal-header .text-primary');
      if (headerActiveStrong && headerActiveStrong.closest('.header-right')) {
        headerActiveStrong.textContent = `${profile.name} (Mathematics)`;
      }

      // Update Sidebar user card
      const sidebarName = document.getElementById('teacherUserName');
      if (sidebarName) sidebarName.textContent = profile.name;

      // Update Profile Hero elements
      const heroName = document.getElementById('profTeacherHeroName');
      if (heroName) heroName.textContent = profile.name;

      const heroRole = document.getElementById('profTeacherHeroRole');
      if (heroRole) heroRole.innerHTML = `<i class="fa-solid fa-award"></i> ${profile.motto} • Department of Mathematics`;

      // Fill form fields if view is loaded
      const fName = document.getElementById('profTeacherName');
      if (fName) fName.value = profile.name;
      const fMotto = document.getElementById('profTeacherMotto');
      if (fMotto) fMotto.value = profile.motto;
      const fPhone = document.getElementById('profTeacherPhone');
      if (fPhone) fPhone.value = profile.phone;
      const fEmail = document.getElementById('profTeacherPersonalEmail');
      if (fEmail) fEmail.value = profile.personalEmail;
      const fAddr = document.getElementById('profTeacherAddress');
      if (fAddr) fAddr.value = profile.address;
      const fBio = document.getElementById('profTeacherBio');
      if (fBio) fBio.value = profile.bio;
      const fBlood = document.getElementById('profTeacherBlood');
      if (fBlood) fBlood.value = profile.blood;
      const fEmerg = document.getElementById('profTeacherEmergency');
      if (fEmerg) fEmerg.value = profile.emergency;
    } catch (e) {
      console.error('Error loading teacher profile:', e);
    }
  }

  function saveProfile(e) {
    if (e && e.preventDefault) e.preventDefault();
    const data = {
      name: (document.getElementById('profTeacherName')?.value || 'Ms. Anjali').trim(),
      motto: (document.getElementById('profTeacherMotto')?.value || 'Class Teacher – Grade 8A').trim(),
      phone: (document.getElementById('profTeacherPhone')?.value || '').trim(),
      personalEmail: (document.getElementById('profTeacherPersonalEmail')?.value || '').trim(),
      address: (document.getElementById('profTeacherAddress')?.value || '').trim(),
      bio: (document.getElementById('profTeacherBio')?.value || '').trim(),
      blood: document.getElementById('profTeacherBlood')?.value || 'A+',
      emergency: (document.getElementById('profTeacherEmergency')?.value || '').trim()
    };

    localStorage.setItem('sv_teacher_profile', JSON.stringify(data));
    loadSavedProfile();
    showToast('Dashboard & profile preferences saved successfully!', 'success');
  }

  function resetProfile() {
    localStorage.removeItem('sv_teacher_profile');
    loadSavedProfile();
    showToast('Reverted to default teacher profile', 'info');
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
