/**
 * Sri Vidya E.M High School - Parent Portal State & Interactive Logic
 * Multi-Child Dynamic Switcher:
 *   - Child 1: Rahul Sharma (Grade 8A, Roll #1042)
 *   - Child 2: Sneha Sharma (Grade 5B, Roll #5021)
 *   - Child 3: Aditya Sharma (UKG, Roll #0214)
 */

const parentData = {
  parentName: "Mr. & Mrs. Sharma",
  contact: "+91 98491 55670",
  email: "sharma.family@gmail.com",
  address: "Plot 42, HIG Phase-II, Dwaraka Nagar, Visakhapatnam",

  children: {
    rahul: {
      id: "rahul",
      name: "Rahul Sharma",
      grade: "Grade 8A",
      rollNo: "1042",
      admissionNo: "SV/2019/0842",
      classTeacher: "Ms. Anjali",
      teacherPhone: "+91 98765 43210",
      house: "Vidyadhari (Blue House)",
      dob: "14 May 2011",
      bloodGroup: "O+ve",
      avatarIcon: "fa-user-graduate",
      avatarColor: "#1D4ED8",
      
      metrics: {
        attendanceRate: "96%",
        attendanceDays: "144 / 150 Days",
        attendanceTrend: "+1.2% this month",
        termGpa: "86.4%",
        gradeBadge: "A Grade (Distinction)",
        gpaTrend: "Rank #3 in Class",
        feeStatus: "₹4,500 Due",
        feeStatusType: "due",
        feeDueDate: "Due by Oct 15, 2025",
        behaviour: "Excellent",
        behaviourBadges: "4 Merit Stars",
        conductNote: "Respectful, proactive in classroom discussions"
      },

      timetable: [
        { period: "Period 1", time: "08:45 - 09:30 AM", subject: "Mathematics", teacher: "Ms. Anjali", room: "Room 204" },
        { period: "Period 2", time: "09:30 - 10:15 AM", subject: "Physical Science", teacher: "Sri K. Rajesh", room: "Science Lab" },
        { period: "Period 3", time: "10:30 - 11:15 AM", subject: "English Literature", teacher: "Mrs. M. Vani", room: "Room 204" },
        { period: "Period 4", time: "11:15 - 12:00 PM", subject: "Social Studies", teacher: "Sri D. Prakash", room: "Room 204" },
        { period: "Period 5", time: "12:45 - 01:30 PM", subject: "Telugu Language", teacher: "Smt. G. Sarada", room: "Room 204" },
        { period: "Period 6", time: "01:30 - 02:15 PM", subject: "Hindi", teacher: "Sri Ramesh Kumar", room: "Room 204" },
        { period: "Period 7", time: "02:30 - 03:15 PM", subject: "Computer Science & Robotics", teacher: "Ms. Priyanka", room: "STEM Lab" },
        { period: "Period 8", time: "03:15 - 04:00 PM", subject: "Sports & Physical Ed", teacher: "Sri Ch. Prasad", room: "Playground" }
      ],

      subjects: [
        { name: "Mathematics", teacher: "Ms. Anjali", fa1: 24, fa2: 23, sa1: 91, total: "91.2%", grade: "A1", remarks: "Superb analytical skills in Algebra" },
        { name: "Physical Science", teacher: "Sri K. Rajesh", fa1: 22, fa2: 24, sa1: 88, total: "88.0%", grade: "A2", remarks: "Great active participation in lab experiments" },
        { name: "Biological Science", teacher: "Mrs. Lakshmi", fa1: 23, fa2: 22, sa1: 85, total: "85.4%", grade: "A2", remarks: "Good conceptual grasp of ecosystems" },
        { name: "English", teacher: "Mrs. M. Vani", fa1: 21, fa2: 23, sa1: 84, total: "84.5%", grade: "A2", remarks: "Excellent essay writing and vocabulary" },
        { name: "Social Studies", teacher: "Sri D. Prakash", fa1: 23, fa2: 24, sa1: 87, total: "87.1%", grade: "A2", remarks: "Thorough understanding of Indian History" },
        { name: "Telugu (1st Lang)", teacher: "Smt. G. Sarada", fa1: 22, fa2: 21, sa1: 83, total: "83.2%", grade: "A2", remarks: "Good poetic recitation and handwriting" },
        { name: "Hindi (2nd Lang)", teacher: "Sri Ramesh Kumar", fa1: 20, fa2: 22, sa1: 82, total: "82.0%", grade: "A2", remarks: "Steady improvement in grammar" },
        { name: "Computer Science", teacher: "Ms. Priyanka", fa1: 25, fa2: 25, sa1: 96, total: "96.5%", grade: "A1", remarks: "Top coder in Scratch & Python fundamentals" }
      ],

      assignments: [
        { title: "Linear Equations Problem Set 4", subject: "Mathematics", dueDate: "22 Sep 2025", status: "Submitted", score: "19/20" },
        { title: "Refraction & Lenses Lab Journal", subject: "Physical Science", dueDate: "24 Sep 2025", status: "Pending", score: "--" },
        { title: "Mughal Empire Map Marking", subject: "Social Studies", dueDate: "20 Sep 2025", status: "Submitted", score: "18/20" },
        { title: "Shakespeare Poetry Recitation Prep", subject: "English", dueDate: "26 Sep 2025", status: "Pending", score: "--" }
      ],

      attendanceLog: {
        present: 144,
        absent: 4,
        late: 2,
        totalDays: 150,
        monthly: [
          { month: "June", days: 22, present: 22, pct: "100%" },
          { month: "July", days: 25, present: 24, pct: "96%" },
          { month: "August", days: 24, present: 23, pct: "95.8%" },
          { month: "September (to date)", days: 16, present: 15, pct: "93.8%" }
        ],
        recentAbsences: [
          { date: "12 Sep 2025", reason: "Viral fever (Medical leave submitted & approved)", status: "Excused" },
          { date: "05 Aug 2025", reason: "Severe rainfall / Waterlogging in locality", status: "Excused" }
        ]
      },

      fees: {
        totalAnnual: 48000,
        paid: 43500,
        due: 4500,
        dueDate: "15 Oct 2025",
        breakdown: [
          { head: "Tuition Fee (Term 1 & 2)", amount: 24000, status: "Paid", receipt: "RCP-2025-0814" },
          { head: "Special STEM & Computer Lab Fee", amount: 6500, status: "Paid", receipt: "RCP-2025-0815" },
          { head: "School Bus Transport (H1)", amount: 13000, status: "Paid", receipt: "RCP-2025-0912" },
          { head: "Tuition Fee (Term 3 Installment)", amount: 4500, status: "Due", receipt: "Pending" }
        ],
        history: [
          { receiptNo: "RCP-2025-0912", date: "10 Sep 2025", amount: "₹13,000", mode: "Online UPI (GPay)", desc: "School Bus Transport Fee (Term 1)" },
          { receiptNo: "RCP-2025-0815", date: "15 Jul 2025", amount: "₹6,500", mode: "Net Banking (SBI)", desc: "STEM & Digital Lab Annual Fee" },
          { receiptNo: "RCP-2025-0814", date: "05 Jun 2025", amount: "₹24,000", mode: "Debit Card (HDFC)", desc: "Term 1 & 2 Tuition Admission Fee" }
        ]
      },

      transport: {
        routeNo: "Route 4",
        routeName: "Dwaraka Nagar Express",
        busNo: "AP31 TJ 4821",
        busModel: "Tata Starbus 42-Seater (AC & GPS)",
        driverName: "Sri Ramana",
        driverPhone: "+91 98480 22334",
        attendantName: "Smt. Appayamma",
        pickupStop: "Dwaraka Nagar 3rd Lane Corner",
        pickupTime: "07:55 AM",
        dropStop: "Dwaraka Nagar 3rd Lane Corner",
        dropTime: "04:35 PM",
        currentStatus: "En Route to School",
        eta: "Arriving in 12 mins",
        speed: "32 km/h"
      },

      leaves: [
        { id: "LV-102", from: "12 Sep 2025", to: "13 Sep 2025", days: 2, reason: "Viral fever and doctor-advised rest", status: "Approved", approvedBy: "Vice Principal Sri Navva Anand" },
        { id: "LV-084", from: "24 Jul 2025", to: "24 Jul 2025", days: 1, reason: "Family religious ceremony at native town", status: "Approved", approvedBy: "Class Teacher Ms. Anjali" }
      ],

      documents: [
        { title: "Summative Assessment-1 (SA-1) Official Report Card", date: "14 Sep 2025", type: "Report Card", size: "1.2 MB", filename: "Rahul_SA1_ReportCard.pdf" },
        { title: "Formative Assessment-2 (FA-2) Score Sheet", date: "20 Aug 2025", type: "Score Sheet", size: "750 KB", filename: "Rahul_FA2_Scorecard.pdf" },
        { title: "Inter-School Science Fair 1st Prize Certificate", date: "28 Aug 2025", type: "Certificate", size: "1.8 MB", filename: "Science_Exhibition_Award.pdf" },
        { title: "Annual Tuition Fee Official Tax Receipt 2025-26", date: "05 Jun 2025", type: "Receipt", size: "420 KB", filename: "Fee_Receipt_RCP20250814.pdf" }
      ]
    },

    sneha: {
      id: "sneha",
      name: "Sneha Sharma",
      grade: "Grade 5B",
      rollNo: "5021",
      admissionNo: "SV/2021/1182",
      classTeacher: "Mrs. K. Sunitha",
      teacherPhone: "+91 98485 11223",
      house: "Bhavani (Red House)",
      dob: "22 Aug 2014",
      bloodGroup: "B+ve",
      avatarIcon: "fa-graduation-cap",
      avatarColor: "#8B5CF6",

      metrics: {
        attendanceRate: "98.2%",
        attendanceDays: "148 / 150 Days",
        attendanceTrend: "100% attendance in Aug & Sep",
        termGpa: "92.5%",
        gradeBadge: "A+ Grade (Class Topper)",
        gpaTrend: "Rank #1 in Section 5B",
        feeStatus: "Fully Paid (₹0 Due)",
        feeStatusType: "paid",
        feeDueDate: "All dues cleared for 2025-26",
        behaviour: "Exemplary",
        behaviourBadges: "Class Prefect & Star Badge",
        conductNote: "Role model student, helpful to peers"
      },

      timetable: [
        { period: "Period 1", time: "08:45 - 09:30 AM", subject: "English Grammar", teacher: "Mrs. K. Sunitha", room: "Room 106" },
        { period: "Period 2", time: "09:30 - 10:15 AM", subject: "Mathematics", teacher: "Sri V. Mohan", room: "Room 106" },
        { period: "Period 3", time: "10:30 - 11:15 AM", subject: "Environmental Science (EVS)", teacher: "Smt. Nirmala", room: "Room 106" },
        { period: "Period 4", time: "11:15 - 12:00 PM", subject: "Telugu", teacher: "Smt. G. Sarada", room: "Room 106" },
        { period: "Period 5", time: "12:45 - 01:30 PM", subject: "Hindi", teacher: "Mrs. Rekha Rani", room: "Room 106" },
        { period: "Period 6", time: "01:30 - 02:15 PM", subject: "Art & Craft", teacher: "Sri Someshwar", room: "Art Studio" },
        { period: "Period 7", time: "02:30 - 03:15 PM", subject: "Classical Music & Dance", teacher: "Smt. Radhika", room: "Auditorium" },
        { period: "Period 8", time: "03:15 - 04:00 PM", subject: "Library & Reading Hour", teacher: "Mrs. K. Sunitha", room: "Central Library" }
      ],

      subjects: [
        { name: "Mathematics", teacher: "Sri V. Mohan", fa1: 25, fa2: 24, sa1: 96, total: "96.4%", grade: "A1", remarks: "Brilliant numerical accuracy" },
        { name: "Environmental Science", teacher: "Smt. Nirmala", fa1: 24, fa2: 25, sa1: 94, total: "94.8%", grade: "A1", remarks: "Excellent nature notebook & project work" },
        { name: "English", teacher: "Mrs. K. Sunitha", fa1: 25, fa2: 25, sa1: 95, total: "95.2%", grade: "A1", remarks: "Outstanding reading comprehension & poetry" },
        { name: "Telugu", teacher: "Smt. G. Sarada", fa1: 23, fa2: 24, sa1: 90, total: "90.5%", grade: "A1", remarks: "Neat handwriting and clear diction" },
        { name: "Hindi", teacher: "Mrs. Rekha Rani", fa1: 24, fa2: 23, sa1: 89, total: "89.2%", grade: "A2", remarks: "Very good conversational fluency" },
        { name: "General Knowledge", teacher: "Mrs. K. Sunitha", fa1: 25, fa2: 25, sa1: 98, total: "98.0%", grade: "A1", remarks: "Always updated with current affairs" }
      ],

      assignments: [
        { title: "Plant Life Cycle Botanical Chart", subject: "EVS", dueDate: "23 Sep 2025", status: "Submitted", score: "20/20" },
        { title: "Fractions & Decimals Practice Sheet", subject: "Mathematics", dueDate: "25 Sep 2025", status: "Pending", score: "--" },
        { title: "Short Story Writing: 'The Brave Tree'", subject: "English", dueDate: "21 Sep 2025", status: "Submitted", score: "19/20" }
      ],

      attendanceLog: {
        present: 148,
        absent: 2,
        late: 0,
        totalDays: 150,
        monthly: [
          { month: "June", days: 22, present: 22, pct: "100%" },
          { month: "July", days: 25, present: 24, pct: "96.0%" },
          { month: "August", days: 24, present: 24, pct: "100%" },
          { month: "September (to date)", days: 16, present: 16, pct: "100%" }
        ],
        recentAbsences: [
          { date: "18 Jul 2025", reason: "Medical checkup & immunization", status: "Excused" }
        ]
      },

      fees: {
        totalAnnual: 42000,
        paid: 42000,
        due: 0,
        dueDate: "Cleared (No Pending Dues)",
        breakdown: [
          { head: "Primary Wing Tuition (Full Year)", amount: 26000, status: "Paid", receipt: "RCP-2025-0519" },
          { head: "Activity, Music & Library Fee", amount: 5000, status: "Paid", receipt: "RCP-2025-0520" },
          { head: "School Bus Transport (Full Year)", amount: 11000, status: "Paid", receipt: "RCP-2025-0521" }
        ],
        history: [
          { receiptNo: "RCP-2025-0521", date: "15 May 2025", amount: "₹11,000", mode: "UPI (PhonePe)", desc: "Full Session School Bus Transport" },
          { receiptNo: "RCP-2025-0520", date: "15 May 2025", amount: "₹5,000", mode: "UPI (PhonePe)", desc: "Co-curricular & Library Annual Dues" },
          { receiptNo: "RCP-2025-0519", date: "15 May 2025", amount: "₹26,000", mode: "Net Banking (SBI)", desc: "Annual Tuition Fee with Early Bird Discount" }
        ]
      },

      transport: {
        routeNo: "Route 4",
        routeName: "Dwaraka Nagar Express",
        busNo: "AP31 TJ 4821",
        busModel: "Tata Starbus 42-Seater (AC & GPS)",
        driverName: "Sri Ramana",
        driverPhone: "+91 98480 22334",
        attendantName: "Smt. Appayamma",
        pickupStop: "Dwaraka Nagar 3rd Lane Corner",
        pickupTime: "07:55 AM",
        dropStop: "Dwaraka Nagar 3rd Lane Corner",
        dropTime: "04:35 PM",
        currentStatus: "En Route to School",
        eta: "Arriving in 12 mins",
        speed: "32 km/h"
      },

      leaves: [
        { id: "LV-051", from: "18 Jul 2025", to: "18 Jul 2025", days: 1, reason: "Immunization doctor appointment", status: "Approved", approvedBy: "Class Teacher Mrs. K. Sunitha" }
      ],

      documents: [
        { title: "Summative Assessment-1 (SA-1) Full Marks Card", date: "14 Sep 2025", type: "Report Card", size: "1.1 MB", filename: "Sneha_SA1_ReportCard.pdf" },
        { title: "District Level Classical Dance 1st Prize Certificate", date: "02 Sep 2025", type: "Certificate", size: "2.1 MB", filename: "Sneha_Classical_Dance_Award.pdf" },
        { title: "Star Student of the Month Certificate (August)", date: "31 Aug 2025", type: "Certificate", size: "1.3 MB", filename: "Star_Student_Aug_2025.pdf" },
        { title: "Full Annual Fee Clearance Official Receipt", date: "15 May 2025", type: "Receipt", size: "390 KB", filename: "Fee_Receipt_RCP20250519.pdf" }
      ]
    },

    aditya: {
      id: "aditya",
      name: "Aditya Sharma",
      grade: "UKG (Primary Wing)",
      rollNo: "0214",
      admissionNo: "SV/2024/2045",
      classTeacher: "Ms. P. Lakshmi",
      teacherPhone: "+91 98661 88990",
      house: "Kaveri (Green House)",
      dob: "05 Nov 2019",
      bloodGroup: "O+ve",
      avatarIcon: "fa-child-reaching",
      avatarColor: "#10B981",

      metrics: {
        attendanceRate: "92.0%",
        attendanceDays: "138 / 150 Days",
        attendanceTrend: "Regular attendance",
        termGpa: "Grade: O",
        gradeBadge: "Outstanding (Pre-Primary)",
        gpaTrend: "Rapid phonetic & motor development",
        feeStatus: "₹3,200 Due",
        feeStatusType: "due",
        feeDueDate: "Due by Nov 01, 2025",
        behaviour: "Enthusiastic",
        behaviourBadges: "Little Explorer Star",
        conductNote: "Active, joyful, expressive in storytelling"
      },

      timetable: [
        { period: "Period 1", time: "09:00 - 09:40 AM", subject: "Phonics & Word Play", teacher: "Ms. P. Lakshmi", room: "UKG Playroom" },
        { period: "Period 2", time: "09:40 - 10:20 AM", subject: "Number Magic & Counting", teacher: "Ms. P. Lakshmi", room: "UKG Playroom" },
        { period: "Period 3", time: "10:30 - 11:10 AM", subject: "Snack & Social Etiquette", teacher: "Ms. P. Lakshmi & Ayah", room: "Dining Hall" },
        { period: "Period 4", time: "11:10 - 11:50 AM", subject: "Rhymes & Music", teacher: "Smt. Radhika", room: "Music Room" },
        { period: "Period 5", time: "12:00 - 12:45 PM", subject: "Clay Modeling & Drawing", teacher: "Sri Someshwar", room: "Art Den" },
        { period: "Period 6", time: "12:45 - 01:30 PM", subject: "Playground & Gross Motor Games", teacher: "Sri Ch. Prasad", room: "Sandpit & Playpark" }
      ],

      subjects: [
        { name: "English Phonics & Alphabet", teacher: "Ms. P. Lakshmi", fa1: 25, fa2: 24, sa1: 95, total: "95.0%", grade: "O", remarks: "Can read three-letter CVC words effortlessly" },
        { name: "Early Numeracy (1 to 100)", teacher: "Ms. P. Lakshmi", fa1: 24, fa2: 25, sa1: 92, total: "92.5%", grade: "O", remarks: "Great counting, sequencing, and basic addition" },
        { name: "General Awareness & Nature", teacher: "Ms. P. Lakshmi", fa1: 24, fa2: 24, sa1: 91, total: "91.0%", grade: "O", remarks: "Knows animals, fruits, vehicles, and community helpers" },
        { name: "Art, Craft & Color Concepts", teacher: "Sri Someshwar", fa1: 25, fa2: 25, sa1: 97, total: "97.0%", grade: "O", remarks: "Vibrant coloring within boundaries and creative clay models" }
      ],

      assignments: [
        { title: "Color the Seasons Activity Booklet", subject: "General Awareness", dueDate: "22 Sep 2025", status: "Submitted", score: "Star Badge" },
        { title: "Number Tracing (50 to 70)", subject: "Numeracy", dueDate: "25 Sep 2025", status: "Pending", score: "--" }
      ],

      attendanceLog: {
        present: 138,
        absent: 12,
        late: 0,
        totalDays: 150,
        monthly: [
          { month: "June", days: 22, present: 20, pct: "90.9%" },
          { month: "July", days: 25, present: 23, pct: "92.0%" },
          { month: "August", days: 24, present: 22, pct: "91.6%" },
          { month: "September (to date)", days: 16, present: 15, pct: "93.7%" }
        ],
        recentAbsences: [
          { date: "02 Sep 2025", reason: "Common cold and rest", status: "Excused" }
        ]
      },

      fees: {
        totalAnnual: 32000,
        paid: 28800,
        due: 3200,
        dueDate: "01 Nov 2025",
        breakdown: [
          { head: "Pre-Primary Montessori & Tuition", amount: 22000, status: "Paid", receipt: "RCP-2025-0610" },
          { head: "Play Material & Activity Kit", amount: 6800, status: "Paid", receipt: "RCP-2025-0611" },
          { head: "Term 2 Activity & Refreshment", amount: 3200, status: "Due", receipt: "Pending" }
        ],
        history: [
          { receiptNo: "RCP-2025-0611", date: "10 Jun 2025", amount: "₹6,800", mode: "UPI (Paytm)", desc: "Activity & Craft Kit Supply" },
          { receiptNo: "RCP-2025-0610", date: "10 Jun 2025", amount: "₹22,000", mode: "Net Banking (SBI)", desc: "UKG Admission & Term 1 Tuition" }
        ]
      },

      transport: {
        routeNo: "Self Drop / Private",
        routeName: "Parent Drop & Pickup",
        busNo: "Private Vehicle",
        busModel: "N/A",
        driverName: "Self / Parent Drop",
        driverPhone: "+91 98491 55670",
        attendantName: "Pre-Primary Ayah at Gate",
        pickupStop: "Main School Reception Gate",
        pickupTime: "08:50 AM",
        dropStop: "Main School Reception Gate",
        dropTime: "01:30 PM",
        currentStatus: "Class In Session",
        eta: "N/A",
        speed: "N/A"
      },

      leaves: [
        { id: "LV-039", from: "02 Sep 2025", to: "03 Sep 2025", days: 2, reason: "Seasonal cold and fever", status: "Approved", approvedBy: "Class Teacher Ms. P. Lakshmi" }
      ],

      documents: [
        { title: "UKG Term 1 Comprehensive Progress Dossier", date: "10 Sep 2025", type: "Report Card", size: "890 KB", filename: "Aditya_UKG_Progress_Report.pdf" },
        { title: "Pre-Primary Storytelling Star Certificate", date: "15 Aug 2025", type: "Certificate", size: "1.4 MB", filename: "Aditya_Storytelling_Certificate.pdf" },
        { title: "Term 1 Tuition Fee Paid Receipt", date: "10 Jun 2025", type: "Receipt", size: "380 KB", filename: "Fee_Receipt_RCP20250610.pdf" }
      ]
    }
  }
};

let currentChildId = "rahul";

function getActiveChild() {
  return parentData.children[currentChildId] || parentData.children.rahul;
}

/**
 * Switch Active Child and dynamically re-render all modules
 */
function switchChild(childId) {
  if (!parentData.children[childId]) return;
  currentChildId = childId;
  const child = getActiveChild();

  // Update topbar & sidebar selector labels
  const childSelectorBtn = document.getElementById("activeChildName");
  if (childSelectorBtn) childSelectorBtn.textContent = `${child.name} (${child.grade})`;

  const sidebarChildBadge = document.getElementById("sidebarChildBadge");
  if (sidebarChildBadge) {
    sidebarChildBadge.innerHTML = `
      <div class="sc-avatar" style="background: ${child.avatarColor};">
        <i class="fa-solid ${child.avatarIcon}"></i>
      </div>
      <div class="sc-info">
        <div class="sc-name">${child.name}</div>
        <div class="sc-grade">${child.grade} • Roll #${child.rollNo}</div>
      </div>
    `;
  }

  // Update Active Child Hero Banner
  const heroName = document.getElementById("heroChildName");
  if (heroName) heroName.textContent = child.name;
  const heroGrade = document.getElementById("heroChildGrade");
  if (heroGrade) heroGrade.textContent = `${child.grade} • Roll #${child.rollNo} • Class Teacher: ${child.classTeacher}`;
  const heroHouse = document.getElementById("heroChildHouse");
  if (heroHouse) heroHouse.textContent = `${child.house} • Blood Grp: ${child.bloodGroup}`;

  // Update Metric Cards
  document.getElementById("metricAttendanceVal").textContent = child.metrics.attendanceRate;
  document.getElementById("metricAttendanceSub").textContent = child.metrics.attendanceDays;
  document.getElementById("metricGpaVal").textContent = child.metrics.termGpa;
  document.getElementById("metricGpaSub").textContent = child.metrics.gradeBadge;
  document.getElementById("metricFeeVal").textContent = child.metrics.feeStatus;
  document.getElementById("metricFeeSub").textContent = child.metrics.feeDueDate;
  document.getElementById("metricBehaviourVal").textContent = child.metrics.behaviour;
  document.getElementById("metricBehaviourSub").textContent = child.metrics.behaviourBadges;

  // Render Timetable
  renderTimetable(child);

  // Render Academics Table
  renderAcademics(child);

  // Render Assignments
  renderAssignments(child);

  // Render Attendance
  renderAttendance(child);

  // Render Fees
  renderFees(child);

  // Render Transport
  renderTransport(child);

  // Render Leaves
  renderLeaves(child);

  // Render Documents
  renderDocuments(child);

  // Render Communication Contact
  renderTeacherChat(child);

  // Trigger feedback toast
  showToast(`Switched active profile to ${child.name} (${child.grade})`);
}

function renderTimetable(child) {
  const container = document.getElementById("timetableContainer");
  if (!container) return;
  container.innerHTML = child.timetable.map(slot => `
    <div class="tt-slot-card">
      <div class="tt-period-badge">${slot.period}</div>
      <div class="tt-subject-name">${slot.subject}</div>
      <div class="tt-time"><i class="fa-regular fa-clock"></i> ${slot.time}</div>
      <div class="tt-teacher"><i class="fa-solid fa-chalkboard-user"></i> ${slot.teacher} • ${slot.room}</div>
    </div>
  `).join("");
}

function renderAcademics(child) {
  const tableBody = document.getElementById("academicsTableBody");
  if (!tableBody) return;
  tableBody.innerHTML = child.subjects.map(sub => `
    <tr>
      <td class="font-bold">${sub.name}</td>
      <td>${sub.teacher}</td>
      <td class="text-center">${sub.fa1}</td>
      <td class="text-center">${sub.fa2}</td>
      <td class="text-center">${sub.sa1}</td>
      <td class="text-center font-bold" style="color: var(--color-primary);">${sub.total}</td>
      <td class="text-center"><span class="badge-grade">${sub.grade}</span></td>
      <td class="text-muted text-sm">${sub.remarks}</td>
    </tr>
  `).join("");
}

function renderAssignments(child) {
  const container = document.getElementById("assignmentsContainer");
  if (!container) return;
  container.innerHTML = child.assignments.map(a => `
    <div class="assignment-item">
      <div class="assign-icon ${a.status === 'Submitted' ? 'icon-green' : 'icon-amber'}">
        <i class="fa-solid ${a.status === 'Submitted' ? 'fa-circle-check' : 'fa-clock'}"></i>
      </div>
      <div class="assign-details">
        <div class="assign-title">${a.title}</div>
        <div class="assign-meta">${a.subject} • Due: <strong>${a.dueDate}</strong> • Status: <span class="${a.status === 'Submitted' ? 'text-green' : 'text-amber'}">${a.status}</span></div>
      </div>
      <div class="assign-score">${a.score}</div>
    </div>
  `).join("");
}

function renderAttendance(child) {
  const att = child.attendanceLog;
  document.getElementById("attRateDisplay").textContent = child.metrics.attendanceRate;
  document.getElementById("attPresentCount").textContent = `${att.present} Days`;
  document.getElementById("attAbsentCount").textContent = `${att.absent} Days`;
  document.getElementById("attLateCount").textContent = `${att.late} Days`;

  const monthlyList = document.getElementById("attMonthlyList");
  if (monthlyList) {
    monthlyList.innerHTML = att.monthly.map(m => `
      <div class="monthly-att-row">
        <span class="font-bold">${m.month}</span>
        <span>${m.present} / ${m.days} days</span>
        <span class="badge-grade font-bold">${m.pct}</span>
      </div>
    `).join("");
  }

  const absenceList = document.getElementById("attAbsenceList");
  if (absenceList) {
    absenceList.innerHTML = att.recentAbsences.map(ab => `
      <div class="absence-item">
        <div class="text-amber font-bold"><i class="fa-solid fa-calendar-xmark"></i> ${ab.date}</div>
        <div class="text-sm">${ab.reason}</div>
        <span class="portal-badge" style="background: var(--color-accent-green-subtle); color: var(--color-accent-green);">${ab.status}</span>
      </div>
    `).join("");
  }
}

function renderFees(child) {
  const fees = child.fees;
  document.getElementById("feeTotalAnnual").textContent = `₹${fees.totalAnnual.toLocaleString('en-IN')}`;
  document.getElementById("feeTotalPaid").textContent = `₹${fees.paid.toLocaleString('en-IN')}`;
  document.getElementById("feeTotalDue").textContent = `₹${fees.due.toLocaleString('en-IN')}`;
  
  const payBtn = document.getElementById("payNowBtn");
  if (payBtn) {
    if (fees.due === 0) {
      payBtn.disabled = true;
      payBtn.textContent = "All Dues Cleared";
      payBtn.classList.add("btn-disabled");
    } else {
      payBtn.disabled = false;
      payBtn.textContent = `Pay Dues (₹${fees.due.toLocaleString('en-IN')})`;
      payBtn.classList.remove("btn-disabled");
    }
  }

  const breakdownBody = document.getElementById("feesBreakdownBody");
  if (breakdownBody) {
    breakdownBody.innerHTML = fees.breakdown.map(b => `
      <tr>
        <td class="font-bold">${b.head}</td>
        <td>₹${b.amount.toLocaleString('en-IN')}</td>
        <td>
          <span class="portal-badge ${b.status === 'Paid' ? 'badge-paid' : 'badge-due'}">
            ${b.status}
          </span>
        </td>
        <td>${b.receipt}</td>
      </tr>
    `).join("");
  }

  const historyBody = document.getElementById("feesHistoryBody");
  if (historyBody) {
    historyBody.innerHTML = fees.history.map(h => `
      <tr>
        <td class="font-bold">${h.receiptNo}</td>
        <td>${h.date}</td>
        <td class="font-bold" style="color: var(--color-primary);">${h.amount}</td>
        <td>${h.mode}</td>
        <td class="text-sm text-muted">${h.desc}</td>
        <td>
          <button class="btn-sm-action" onclick="printReceipt('${h.receiptNo}', '${child.name}', '${h.amount}', '${h.date}')">
            <i class="fa-solid fa-print"></i> Receipt
          </button>
        </td>
      </tr>
    `).join("");
  }
}

function renderTransport(child) {
  const t = child.transport;
  document.getElementById("transRouteNo").textContent = t.routeNo;
  document.getElementById("transRouteName").textContent = t.routeName;
  document.getElementById("transBusNo").textContent = t.busNo;
  document.getElementById("transDriverName").textContent = t.driverName;
  document.getElementById("transDriverPhone").textContent = t.driverPhone;
  document.getElementById("transDriverCallBtn").href = `tel:${t.driverPhone.replace(/\s+/g, '')}`;
  document.getElementById("transPickup").textContent = `${t.pickupStop} (${t.pickupTime})`;
  document.getElementById("transDrop").textContent = `${t.dropStop} (${t.dropTime})`;
  document.getElementById("transStatus").textContent = t.currentStatus;
  document.getElementById("transEta").textContent = t.eta;
}

function renderLeaves(child) {
  const list = document.getElementById("leavesHistoryList");
  if (!list) return;
  list.innerHTML = child.leaves.map(l => `
    <div class="leave-history-card">
      <div class="lhc-header">
        <span class="lhc-id font-bold">${l.id}</span>
        <span class="portal-badge badge-paid">${l.status}</span>
      </div>
      <div class="lhc-dates"><i class="fa-regular fa-calendar"></i> ${l.from} to ${l.to} (${l.days} Day${l.days > 1 ? 's' : ''})</div>
      <div class="lhc-reason text-muted text-sm">"${l.reason}"</div>
      <div class="lhc-auth text-sm text-green"><i class="fa-solid fa-circle-check"></i> ${l.approvedBy}</div>
    </div>
  `).join("");
}

function renderDocuments(child) {
  const container = document.getElementById("documentsGrid");
  if (!container) return;
  container.innerHTML = child.documents.map(doc => `
    <div class="doc-card">
      <div class="doc-icon">
        <i class="fa-solid ${doc.type === 'Report Card' ? 'fa-file-lines' : doc.type === 'Certificate' ? 'fa-award' : 'fa-receipt'}"></i>
      </div>
      <div class="doc-info">
        <div class="doc-title">${doc.title}</div>
        <div class="doc-meta">${doc.type} • ${doc.date} • ${doc.size}</div>
      </div>
      <button class="btn btn-outline btn-sm" onclick="showToast('Downloading ${doc.filename}...')">
        <i class="fa-solid fa-download"></i> Download
      </button>
    </div>
  `).join("");
}

function renderTeacherChat(child) {
  document.getElementById("chatTeacherName").textContent = child.classTeacher;
  document.getElementById("chatTeacherRole").textContent = `Class Teacher (${child.grade})`;
}

/**
 * Switch Active View in Single-Page Navigation
 */
function navigateTo(viewId) {
  const views = document.querySelectorAll(".portal-view");
  views.forEach(v => v.classList.remove("active"));
  
  const target = document.getElementById(viewId);
  if (target) {
    target.classList.add("active");
  }

  const navLinks = document.querySelectorAll(".sidebar-menu .nav-link");
  navLinks.forEach(l => {
    l.classList.toggle("active", l.getAttribute("data-view") === viewId);
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Payment Modal Actions
 */
function openPayModal() {
  const child = getActiveChild();
  if (child.fees.due === 0) {
    showToast("No outstanding fee dues for " + child.name);
    return;
  }
  document.getElementById("payModalChildName").textContent = `${child.name} (${child.grade})`;
  document.getElementById("payModalAmount").textContent = `₹${child.fees.due.toLocaleString('en-IN')}`;
  document.getElementById("paymentModalBackdrop").classList.add("active");
}

function closePayModal() {
  document.getElementById("paymentModalBackdrop").classList.remove("active");
}

function processPayment() {
  const child = getActiveChild();
  const amt = child.fees.due;
  child.fees.paid += amt;
  child.fees.due = 0;
  child.metrics.feeStatus = "Fully Paid (₹0 Due)";
  child.metrics.feeStatusType = "paid";
  child.metrics.feeDueDate = "All dues cleared for 2025-26";

  const newReceipt = `RCP-2025-${Math.floor(1000 + Math.random() * 9000)}`;
  child.fees.history.unshift({
    receiptNo: newReceipt,
    date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    amount: `₹${amt.toLocaleString('en-IN')}`,
    mode: "Online Portal Payment",
    desc: "Online Term Dues Cleared by Parent"
  });

  closePayModal();
  switchChild(child.id);
  showToast(`Payment of ₹${amt.toLocaleString('en-IN')} successful! Receipt ${newReceipt} generated.`);
}

/**
 * Print / View Receipt Modal
 */
function printReceipt(no, student, amount, date) {
  alert(`Sri Vidya E.M High School\n============================\nOFFICIAL RECEIPT: ${no}\nStudent: ${student}\nAmount Paid: ${amount}\nDate: ${date}\nPayment Status: VERIFIED & CLEARED\nIssued by: Accounts Dept, Sri Vidya High School\n============================\nReady to print/save.`);
}

/**
 * Leave Application Submit
 */
function submitLeaveForm(e) {
  e.preventDefault();
  const child = getActiveChild();
  const from = document.getElementById("leaveFrom").value;
  const to = document.getElementById("leaveTo").value;
  const reason = document.getElementById("leaveReason").value;

  if (!from || !to || !reason) {
    showToast("Please fill all required leave fields.");
    return;
  }

  const newId = `LV-${Math.floor(100 + Math.random() * 900)}`;
  child.leaves.unshift({
    id: newId,
    from: from,
    to: to,
    days: 1,
    reason: reason,
    status: "Pending Approval",
    approvedBy: "Awaiting Vice Principal Approval"
  });

  renderLeaves(child);
  document.getElementById("leaveForm").reset();
  showToast(`Leave application ${newId} submitted for ${child.name}!`);
}

/**
 * Toast Notifications
 */
function showToast(msg) {
  const c = document.getElementById("portalToastContainer");
  if (!c) return;
  const t = document.createElement("div");
  t.className = "toast";
  t.innerHTML = `<i class="fa-solid fa-circle-check" style="color: #10B981;"></i> <span>${msg}</span>`;
  c.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}

// Toggle Dark/Light Theme
function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme") || "light";
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("sv_theme", next);
  const icon = document.getElementById("themeToggleIcon");
  if (icon) {
    icon.className = next === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
  }
}

// Mobile Sidebar Toggle
function toggleMobileSidebar() {
  const s = document.getElementById("portalSidebar");
  if (s) s.classList.toggle("mobile-open");
}

// Document Ready Initialization
document.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("sv_theme") || "light";
  document.documentElement.setAttribute("data-theme", saved);
  const icon = document.getElementById("themeToggleIcon");
  if (icon) {
    icon.className = saved === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
  }

  // Bind child switcher dropdown
  const childSelect = document.getElementById("childSelectDropdown");
  if (childSelect) {
    childSelect.addEventListener("change", (e) => {
      switchChild(e.target.value);
    });
  }

  // Bind Leave form
  const leaveForm = document.getElementById("leaveForm");
  if (leaveForm) {
    leaveForm.addEventListener("submit", submitLeaveForm);
  }

  // Load Parent Profile
  loadSavedParentProfile();

  // Initial load
  switchChild("rahul");
});

function loadSavedParentProfile() {
  try {
    const raw = localStorage.getItem('sv_parent_profile');
    const profile = raw ? JSON.parse(raw) : {
      name: 'Mr. & Mrs. Sharma',
      phone: '+91 98491 55670',
      email: 'sharma.family@gmail.com',
      occupation: 'Senior Technical Manager / Homemaker',
      address: 'Plot 42, HIG Phase-II, Dwaraka Nagar, Visakhapatnam, AP - 530016',
      emergency: 'Sri K. Ramamurthy (Grandparent) - +91 98480 55443'
    };

    parentData.parentName = profile.name;
    parentData.contact = profile.phone;
    parentData.email = profile.email;
    parentData.address = profile.address;

    // Update Dashboard greeting banner
    const greetingEl = document.getElementById('heroParentGreeting');
    if (greetingEl) greetingEl.textContent = profile.name;

    // Update Sidebar user card
    const sidebarName = document.getElementById('parentUserName');
    if (sidebarName) sidebarName.textContent = profile.name;

    // Update Profile Hero elements
    const heroName = document.getElementById('profParentHeroName');
    if (heroName) heroName.textContent = profile.name;

    // Fill form inputs if present
    const fName = document.getElementById('profParentName');
    if (fName) fName.value = profile.name;
    const fPhone = document.getElementById('profParentPhone');
    if (fPhone) fPhone.value = profile.phone;
    const fEmail = document.getElementById('profParentEmail');
    if (fEmail) fEmail.value = profile.email;
    const fOcc = document.getElementById('profParentOccupation');
    if (fOcc) fOcc.value = profile.occupation;
    const fAddr = document.getElementById('profParentAddress');
    if (fAddr) fAddr.value = profile.address;
    const fEmerg = document.getElementById('profParentEmergency');
    if (fEmerg) fEmerg.value = profile.emergency;
  } catch (e) {
    console.error('Error loading parent profile:', e);
  }
}

function saveParentProfile(e) {
  if (e && e.preventDefault) e.preventDefault();
  const data = {
    name: (document.getElementById('profParentName')?.value || 'Mr. & Mrs. Sharma').trim(),
    phone: (document.getElementById('profParentPhone')?.value || '').trim(),
    email: (document.getElementById('profParentEmail')?.value || '').trim(),
    occupation: (document.getElementById('profParentOccupation')?.value || '').trim(),
    address: (document.getElementById('profParentAddress')?.value || '').trim(),
    emergency: (document.getElementById('profParentEmergency')?.value || '').trim()
  };

  localStorage.setItem('sv_parent_profile', JSON.stringify(data));
  loadSavedParentProfile();
  showToast('Parent profile and dashboard preferences saved successfully!');
}

function resetParentProfile() {
  localStorage.removeItem('sv_parent_profile');
  loadSavedParentProfile();
  showToast('Reverted to default parent profile preferences');
}

