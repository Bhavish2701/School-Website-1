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
    students: [
      { roll: 801, name: 'A. Naveen Kumar', class: '8A', phone: '9848123001', att: 'P', marks: 38, remarks: 'Good improvement in algebra' },
      { roll: 802, name: 'B. Sravan Reddy', class: '8A', phone: '9848123002', att: 'P', marks: 44, remarks: 'Excellent understanding' },
      { roll: 803, name: 'CH. Swathi', class: '8A', phone: '9848123003', att: 'P', marks: 47, remarks: 'Subject topper potential' },
      { roll: 804, name: 'V. Divya Bharathi', class: '8A', phone: '9848678901', att: 'P', marks: 49, remarks: 'Consistent top scorer' },
      { roll: 805, name: 'D. Manoj Kumar', class: '8A', phone: '9848123005', att: 'P', marks: 36, remarks: 'Needs help in linear equations' },
      { roll: 806, name: 'G. Harika', class: '8A', phone: '9848123006', att: 'P', marks: 42, remarks: 'Active classroom participation' },
      { roll: 807, name: 'K. Sai Krishna', class: '8A', phone: '9848123007', att: 'A', marks: 34, remarks: 'Absent today (Medical note submitted)' },
      { roll: 808, name: 'M. Tejaswi', class: '8A', phone: '9848123008', att: 'P', marks: 45, remarks: 'Very thorough solutions' },
      { roll: 809, name: 'P. Charan', class: '8A', phone: '9848123009', att: 'P', marks: 40, remarks: 'Steady progress' },
      { roll: 810, name: 'R. Ananya', class: '8A', phone: '9848123010', att: 'P', marks: 48, remarks: 'Outstanding analytical skills' },
      { roll: 842, name: 'CH. Karthik', class: '8A', phone: '9848789012', att: 'L', marks: 39, remarks: 'Arrived late today (Gate note)' },
      { roll: 843, name: 'Y. Tharun', class: '8A', phone: '9848123012', att: 'A', marks: 32, remarks: 'Absent (Uninformed)' },
      { roll: 901, name: 'G. Sai Teja', class: '9B', phone: '9848123456', att: 'P', marks: 46, remarks: 'Strong fundamentals' },
      { roll: 902, name: 'M. Sravanthi', class: '9B', phone: '9848456789', att: 'P', marks: 45, remarks: 'Polite and attentive' },
      { roll: 701, name: 'S. Bhavana', class: '7C', phone: '9848890123', att: 'P', marks: 48, remarks: 'High accuracy in fractions' }
    ],
    homework: [
      { id: 1, class: 'Class 8A', title: 'Chapter 2: Linear Equations Exercise 2.3', due: 'Sept 22, 2026', desc: 'Solve questions 1 through 8 in homework notebook. Step-by-step verification required.' },
      { id: 2, class: 'Class 9B', title: 'Polynomials Remainder Theorem Practice', due: 'Sept 23, 2026', desc: 'Complete worksheet questions 1 to 12. Bring graph sheets for plotting quadratic curves.' },
      { id: 3, class: 'Class 7C', title: 'Fractions Multiplication Drill', due: 'Sept 21, 2026', desc: 'Workbook page 34: Solve exercise 3.2 problems and verify with parent signature.' }
    ],
    parentMessages: [
      { id: 1, parent: 'Mrs. V. Sarada', student: 'V. Divya Bharathi (Roll 804)', date: 'Today, 08:30 AM', message: 'Dear Ms. Anjali, Divya will bring her math geometry set and completed assignment notebook today. Thank you for your guidance.' },
      { id: 2, parent: 'Mr. CH. Rambabu', student: 'CH. Karthik (Roll 842)', date: 'Yesterday, 06:15 PM', message: 'Respected Teacher, Karthik had fever yesterday and arrived slightly late today. He has completed Exercise 2.2.' }
    ],
    leaveHistory: [
      { id: 'LV-2026-081', type: 'Casual Leave (CL)', dates: 'Aug 14, 2026 (1 Day)', substitute: 'Sri P. Satyanarayana', reason: 'Personal family event', status: 'Approved by Principal' },
      { id: 'LV-2026-042', type: 'On Duty (OD)', dates: 'July 28, 2026 (1 Day)', substitute: 'Smt. S. Lakshmi', reason: 'District Math Teachers Training Workshop', status: 'Approved by Principal' }
    ]
  };

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

    showToast(`Switched view to ${moduleKey} → ${subKey}`, 'info');
  }

  function switchClassTab(classKey) {
    const overviewEl = document.getElementById('classOverviewContent');
    if (!overviewEl) return;

    const cls = state.classes.find(c => c.id === classKey);
    if (!cls) return;

    const classStudents = state.students.filter(s => s.class === cls.name.replace('Class ', ''));

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
    renderStudentsList(state.students);
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
      <div class="task-item ${task.done ? 'opacity-50' : ''}">
        <input type="checkbox" class="task-checkbox" ${task.done ? 'checked' : ''} onchange="teacherApp.toggleTask(${task.id})">
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
      showToast(task.done ? `Completed: "${task.title}"` : `Reopened task`, 'success');
    }
  }

  function renderStudentsList(list) {
    const tbody = document.getElementById('teacherStudentsTableBody');
    if (!tbody) return;

    tbody.innerHTML = list.map(s => {
      const grade = s.marks >= 45 ? 'A1' : (s.marks >= 40 ? 'A2' : (s.marks >= 35 ? 'B1' : 'B2'));
      const badgeClass = grade.startsWith('A') ? 'badge-success' : 'badge-primary';

      return `
        <tr>
          <td><strong>#${s.roll}</strong></td>
          <td><strong>${s.name}</strong></td>
          <td>Class ${s.class}</td>
          <td><a href="tel:${s.phone}">${s.phone}</a></td>
          <td>
            <span class="portal-badge ${s.att === 'P' ? 'badge-success' : (s.att === 'L' ? 'badge-warning' : 'badge-danger')}">
              ${s.att === 'P' ? 'Present' : (s.att === 'L' ? 'Late' : 'Absent')}
            </span>
          </td>
          <td><strong>${s.marks} / 50</strong> (${(s.marks * 2)}%)</td>
          <td><span class="portal-badge ${badgeClass}">${grade}</span></td>
          <td>
            <button class="btn btn-secondary btn-sm" onclick="teacherApp.showToast('Opened student dossier for ${s.name}', 'info')" title="View Dossier">
              <i class="fa-regular fa-id-badge"></i> Dossier
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  function filterStudentList() {
    const filterVal = document.getElementById('studentClassFilterSelect')?.value;
    if (!filterVal) {
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
        <td><strong>#${s.roll}</strong></td>
        <td><strong>${s.name}</strong></td>
        <td>
          <div class="att-marker-toggle">
            <button class="att-state-btn ${s.att === 'P' ? 'active-p' : ''}" onclick="teacherApp.setAttendance(${s.roll}, 'P')">P</button>
            <button class="att-state-btn ${s.att === 'A' ? 'active-a' : ''}" onclick="teacherApp.setAttendance(${s.roll}, 'A')">A</button>
            <button class="att-state-btn ${s.att === 'L' ? 'active-l' : ''}" onclick="teacherApp.setAttendance(${s.roll}, 'L')">L</button>
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
      renderAttendanceMarkingTable();
    }
  }

  function markAllPresent() {
    state.students.forEach(s => {
      if (s.class === '8A') s.att = 'P';
    });
    renderAttendanceMarkingTable();
    showToast('Marked all 42 students in Class 8A as Present', 'success');
  }

  function updateAttendanceBadges() {
    const class8A = state.students.filter(s => s.class === '8A');
    const present = class8A.filter(s => s.att === 'P').length;
    const absent = class8A.filter(s => s.att === 'A').length;

    const pBadge = document.getElementById('presentCountBadge');
    const aBadge = document.getElementById('absentCountBadge');
    if (pBadge) pBadge.textContent = `Present: ${present}`;
    if (aBadge) aBadge.textContent = `Absent: ${absent}`;
  }

  function saveDailyAttendance() {
    showToast('Class 8A Daily Attendance Register confirmed & logged to school attendance server!', 'success');
  }

  function confirmQuickAttendance() {
    const absentRolls = (document.getElementById('modalAbsentRolls')?.value || '').split(',').map(r => r.trim());
    state.students.forEach(s => {
      if (s.class === '8A') {
        if (absentRolls.includes(String(s.roll))) {
          s.att = 'A';
        } else {
          s.att = 'P';
        }
      }
    });
    renderAttendanceMarkingTable();
    closeModal('markAttendanceModal');
    showToast('Class 8A attendance recorded and submitted to office!', 'success');
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
          <td>#${s.roll}</td>
          <td><strong>${s.name}</strong></td>
          <td>
            <input type="number" min="0" max="50" class="marks-input" value="${s.marks}" onchange="teacherApp.updateMarks(${s.roll}, this.value)">
          </td>
          <td><span id="pct-${s.roll}">${pct.toFixed(0)}%</span></td>
          <td><span class="portal-badge badge-success" id="grade-${s.roll}">${grade}</span></td>
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
      if (gradeEl) gradeEl.textContent = grade;
    }
  }

  function saveMarks() {
    showToast('Unit Test 2 marks locked and published to student grade reports!', 'success');
  }

  function renderHomeworkFeed() {
    const container = document.getElementById('homeworkFeedContainer');
    if (!container) return;

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
          <button class="btn btn-secondary btn-sm" onclick="teacherApp.showToast('Exported homework submissions to PDF', 'info')">
            <i class="fa-solid fa-download"></i> Submissions (38/42)
          </button>
          <button class="btn btn-primary btn-sm" onclick="teacherApp.showToast('Reminder notification sent to parent group', 'success')">
            <i class="fa-solid fa-bell"></i> Send Reminder
          </button>
        </div>
      </div>
    `).join('');
  }

  function handleCreateHomework(e) {
    e.preventDefault();
    const cls = document.getElementById('hwClass')?.value;
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

    container.innerHTML = state.parentMessages.map(msg => `
      <div class="card p-4 mb-3">
        <div class="card-header-bar">
          <div>
            <h4>${msg.parent} <span class="text-muted text-sm font-normal">(${msg.student})</span></h4>
            <span class="text-muted text-sm"><i class="fa-regular fa-clock"></i> ${msg.date}</span>
          </div>
          <button class="btn btn-primary btn-sm" onclick="teacherApp.replyParent('${msg.parent}')">
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
    loadSavedProfile
  };

})();
