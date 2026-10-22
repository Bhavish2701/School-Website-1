
  window.togglePortalsHub = function(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const btn = document.getElementById('btnPortalsHub');
    const flyout = document.getElementById('portalsHubFlyout');
    if (!flyout) return;
    const isOpen = flyout.classList.toggle('active');
    if (btn) btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  };

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
    // All 500 students are loaded from js/student-roster.js (window.STUDENT_ROSTER)
    // Fallback to empty array if roster script failed to load
    students: (typeof window !== 'undefined' && Array.isArray(window.STUDENT_ROSTER) && window.STUDENT_ROSTER.length > 0)
      ? window.STUDENT_ROSTER
      : [],

    admissions: [
      { appId: 'SV202600001', name: 'K. Sai Tharun', studentName: 'K. Sai Tharun', dob: '2012-04-18', gender: 'Male', class: 'VIII', grade: 'Class VIII', prevSchool: "St. Ann's High School", parent: 'K. Narayana', parentName: 'K. Narayana', phone: '9848011223', email: 'narayana.k@gmail.com', address: 'D.No 4-12, Main Road, Srikakulam', score: '88% (Distinction)', docStatus: 'Verified', status: 'Pending Principal Review', submissionDate: '12 Oct 2026', submissionTime: '10:30 AM' },
      { appId: 'SV202600002', name: 'B. Vennela', studentName: 'B. Vennela', dob: '2014-07-22', gender: 'Female', class: 'VI', grade: 'Class VI', prevSchool: 'Kendriya Vidyalaya', parent: 'B. Srinivas', parentName: 'B. Srinivas', phone: '9848022334', email: 'srinivas.b@gmail.com', address: 'Plot 45, Vidya Nagar, Rajam', score: '92% (Top Tier)', docStatus: 'Verified', status: 'Approved - Fee Due', submissionDate: '14 Oct 2026', submissionTime: '11:15 AM' },
      { appId: 'SV202600003', name: 'M. Dinesh Kumar', studentName: 'M. Dinesh Kumar', dob: '2016-11-05', gender: 'Male', class: 'IV', grade: 'Class IV', prevSchool: 'Ravindra Bharathi', parent: 'M. Jagannath', parentName: 'M. Jagannath', phone: '9848033445', email: 'jagannath.m@gmail.com', address: 'H.No 12-88, NGO Colony, Srikakulam', score: '78% (Pass)', docStatus: 'Pending TC Transfer', status: 'Document Review', submissionDate: '15 Oct 2026', submissionTime: '02:40 PM' },
      { appId: 'SV202600004', name: 'CH. Charitha', studentName: 'CH. Charitha', dob: '2019-09-14', gender: 'Female', class: '1', grade: '1 class', prevSchool: 'Bright Stars Play School', parent: 'CH. Mohan', parentName: 'CH. Mohan', phone: '9848044556', email: 'mohan.ch@gmail.com', address: 'Flat 202, Sri Sai Nilayam, Rajam', score: 'Interview Cleared', docStatus: 'Verified', status: 'Ready for Enrolment', submissionDate: '16 Oct 2026', submissionTime: '09:20 AM' },
      { appId: 'SV202600005', name: 'V. Aditya', studentName: 'V. Aditya', dob: '2011-03-30', gender: 'Male', class: 'IX', grade: 'Class IX', prevSchool: 'Bhashyam Public School', parent: 'V. Suresh Babu', parentName: 'V. Suresh Babu', phone: '9848055667', email: 'sureshbabu.v@gmail.com', address: 'Door 8-19, RTC Complex Road, Srikakulam', score: '84% (Distinction)', docStatus: 'Verified', status: 'Pending Interview', submissionDate: '18 Oct 2026', submissionTime: '04:10 PM' },
      { appId: 'SV202600006', name: 'S. Harini', studentName: 'S. Harini', dob: '2021-06-12', gender: 'Female', class: 'LKG', grade: 'LKG', prevSchool: 'Little Angels Play School', parent: 'S. Venkatesh', parentName: 'S. Venkatesh', phone: '9848066778', email: 'venkatesh.s@gmail.com', address: 'Beside Post Office, Main Road, Ponduru', score: 'Direct Admission', docStatus: 'Verified', status: 'Ready for Enrolment', submissionDate: '19 Oct 2026', submissionTime: '11:00 AM' }
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
      {
            "id": "SV200001",
            "name": "Smt. Gorle Varalakshmi",
            "role": "Principal & Academic Director",
            "qualification": "M.Sc, M.Ed, M.Phil",
            "exp": "22 Years",
            "subject": "Administration & Mathematics",
            "status": "Active",
            "phone": "8106636230",
            "email": "srividyaschools2017@gmail.com",
            "personalEmail": "srividyaschools2017@gmail.com"
      },
      {
            "id": "SV200002",
            "name": "Sri Navva Anand",
            "role": "Vice Principal & Discipline Head",
            "qualification": "M.Sc (Physics), B.Ed",
            "exp": "17 Years",
            "subject": "Physical Science & Administration",
            "status": "Active",
            "phone": "9966422096",
            "email": "navva.anand@srividya.edu",
            "personalEmail": "navva.anand.personal@gmail.com"
      },
      {
            "id": "SV200003",
            "name": "Smt. M. Sunitha",
            "role": "Senior Faculty & English HOD",
            "qualification": "M.A (English Lit), B.Ed",
            "exp": "14 Years",
            "subject": "English & Communication",
            "status": "Present",
            "phone": "9848011221",
            "email": "sunitha.m@srividya.edu",
            "personalEmail": "sunitha.m.personal@gmail.com"
      },
      {
            "id": "SV200004",
            "name": "Sri P. Satyanarayana",
            "role": "Senior Faculty & Maths HOD",
            "qualification": "M.Sc (Mathematics), B.Ed",
            "exp": "15 Years",
            "subject": "High School Mathematics",
            "status": "Present",
            "phone": "9848022332",
            "email": "satya.p@srividya.edu",
            "personalEmail": "satya.p.personal@gmail.com"
      },
      {
            "id": "SV200005",
            "name": "Sri K. Rajesh",
            "role": "Faculty - Physical Science",
            "qualification": "M.Sc (Physics), B.Ed",
            "exp": "9 Years",
            "subject": "Physics & Chemistry",
            "status": "On Leave",
            "phone": "9848033443",
            "email": "rajesh.k@srividya.edu",
            "personalEmail": "rajesh.k.personal@gmail.com"
      },
      {
            "id": "SV200006",
            "name": "Smt. S. Lakshmi",
            "role": "Faculty - Biological Science",
            "qualification": "M.Sc (Botany), B.Ed",
            "exp": "11 Years",
            "subject": "Biology & Environmental Studies",
            "status": "Present",
            "phone": "9848044554",
            "email": "lakshmi.s@srividya.edu",
            "personalEmail": "lakshmi.s.personal@gmail.com"
      },
      {
            "id": "SV200007",
            "name": "Sri R. Venkata Ramana",
            "role": "Senior Faculty - Social Studies",
            "qualification": "M.A (History & Pol. Sci), B.Ed",
            "exp": "16 Years",
            "subject": "Social Sciences & Civics",
            "status": "Present",
            "phone": "9848055665",
            "email": "ramana.r@srividya.edu",
            "personalEmail": "ramana.r.personal@gmail.com"
      },
      {
            "id": "SV200008",
            "name": "Sri D. Srinivas",
            "role": "Faculty & Computer Lab Incharge",
            "qualification": "MCA, B.Ed",
            "exp": "8 Years",
            "subject": "Computer Applications & Coding",
            "status": "Present",
            "phone": "9848066776",
            "email": "srinivas.d@srividya.edu",
            "personalEmail": "srinivas.d.personal@gmail.com"
      },
      {
            "id": "SV200009",
            "name": "Smt. G. Sarada",
            "role": "Faculty - First Language (Telugu)",
            "qualification": "M.A (Telugu Lit), TPT",
            "exp": "13 Years",
            "subject": "Telugu Language & Literature",
            "status": "Present",
            "phone": "9848077887",
            "email": "sarada.g@srividya.edu",
            "personalEmail": "sarada.g.personal@gmail.com"
      },
      {
            "id": "SV200010",
            "name": "Smt. B. Meenakshi",
            "role": "Faculty - Second Language (Hindi)",
            "qualification": "M.A (Hindi), HPT",
            "exp": "10 Years",
            "subject": "Hindi Rashtrabhasha",
            "status": "Present",
            "phone": "9848088998",
            "email": "meenakshi.b@srividya.edu",
            "personalEmail": "meenakshi.b.personal@gmail.com"
      },
      {
            "id": "SV200011",
            "name": "Sri V. Ramesh Babu",
            "role": "Physical Education Director (PET)",
            "qualification": "M.P.Ed, NIS Coach",
            "exp": "12 Years",
            "subject": "Sports, Athletics & Yoga",
            "status": "Present",
            "phone": "9848099009",
            "email": "ramesh.pet@srividya.edu",
            "personalEmail": "ramesh.pet.personal@gmail.com"
      },
      {
            "id": "SV200012",
            "name": "Smt. K. Anitha",
            "role": "Primary Wing Coordinator",
            "qualification": "B.Sc, B.Ed",
            "exp": "10 Years",
            "subject": "Primary Mathematics & EVS",
            "status": "Present",
            "phone": "9848100110",
            "email": "anitha.k@srividya.edu",
            "personalEmail": "anitha.k.personal@gmail.com"
      },
      {
            "id": "SV200013",
            "name": "Sri B. Narayana",
            "role": "Class Teacher - Class X",
            "qualification": "M.Sc (Chemistry), B.Ed",
            "exp": "11 Years",
            "subject": "Chemistry & Physical Science",
            "status": "Present",
            "phone": "9848111221",
            "email": "narayana.b@srividya.edu",
            "personalEmail": "narayana.b.personal@gmail.com"
      },
      {
            "id": "SV200014",
            "name": "Smt. T. Padmavathi",
            "role": "Class Teacher - Class IX",
            "qualification": "M.A (Telugu), B.Ed",
            "exp": "9 Years",
            "subject": "Telugu & Sanskrit",
            "status": "Present",
            "phone": "9848122332",
            "email": "padmavathi.t@srividya.edu",
            "personalEmail": "padmavathi.t.personal@gmail.com"
      },
      {
            "id": "SV200015",
            "name": "Sri M. Raju",
            "role": "Class Teacher - Class VIII",
            "qualification": "M.Sc (Maths), B.Ed",
            "exp": "7 Years",
            "subject": "Mathematics",
            "status": "Present",
            "phone": "9848133443",
            "email": "raju.m@srividya.edu",
            "personalEmail": "raju.m.personal@gmail.com"
      },
      {
            "id": "SV200016",
            "name": "Smt. V. Jyothsna",
            "role": "Class Teacher - Class VII",
            "qualification": "M.A (English), B.Ed",
            "exp": "8 Years",
            "subject": "English & Social Studies",
            "status": "Present",
            "phone": "9848144554",
            "email": "jyothsna.v@srividya.edu",
            "personalEmail": "jyothsna.v.personal@gmail.com"
      },
      {
            "id": "SV200017",
            "name": "Sri CH. Venkateswara Rao",
            "role": "Class Teacher - Class VI",
            "qualification": "M.Sc (Physics), B.Ed",
            "exp": "10 Years",
            "subject": "Science & Technology",
            "status": "Present",
            "phone": "9848155665",
            "email": "venkat.ch@srividya.edu",
            "personalEmail": "venkat.ch.personal@gmail.com"
      },
      {
            "id": "SV200018",
            "name": "Smt. N. Sirisha",
            "role": "Class Teacher - Class V",
            "qualification": "B.Sc, B.Ed",
            "exp": "6 Years",
            "subject": "EVS & Primary Science",
            "status": "Present",
            "phone": "9848166776",
            "email": "sirisha.n@srividya.edu",
            "personalEmail": "sirisha.n.personal@gmail.com"
      },
      {
            "id": "SV200019",
            "name": "Sri A. Prasad",
            "role": "Class Teacher - Class IV",
            "qualification": "B.Sc, B.Ed",
            "exp": "5 Years",
            "subject": "Maths & EVS",
            "status": "Present",
            "phone": "9848177887",
            "email": "prasad.a@srividya.edu",
            "personalEmail": "prasad.a.personal@gmail.com"
      },
      {
            "id": "SV200020",
            "name": "Smt. R. Kavitha",
            "role": "Class Teacher - Class III",
            "qualification": "B.A, B.Ed",
            "exp": "7 Years",
            "subject": "Language & Arts",
            "status": "Present",
            "phone": "9848188998",
            "email": "kavitha.r@srividya.edu",
            "personalEmail": "kavitha.r.personal@gmail.com"
      },
      {
            "id": "SV200021",
            "name": "Sri S. Gopal",
            "role": "Class Teacher - Class II",
            "qualification": "B.Sc, D.Ed",
            "exp": "8 Years",
            "subject": "Primary General Studies",
            "status": "Present",
            "phone": "9848199009",
            "email": "gopal.s@srividya.edu",
            "personalEmail": "gopal.s.personal@gmail.com"
      },
      {
            "id": "SV200022",
            "name": "Smt. Y. Anusha",
            "role": "Class Teacher - Class I",
            "qualification": "B.A, D.Ed",
            "exp": "5 Years",
            "subject": "Primary Foundations",
            "status": "Present",
            "phone": "9848200110",
            "email": "anusha.y@srividya.edu",
            "personalEmail": "anusha.y.personal@gmail.com"
      },
      {
            "id": "SV200023",
            "name": "Smt. D. Meena",
            "role": "Pre-Primary Wing Teacher",
            "qualification": "B.Ed (Early Childhood)",
            "exp": "6 Years",
            "subject": "Kindergarten & Play Activities",
            "status": "Present",
            "phone": "9848211221",
            "email": "meena.d@srividya.edu",
            "personalEmail": "meena.d.personal@gmail.com"
      },
      {
            "id": "SV200024",
            "name": "Sri K. Srinath",
            "role": "Pre-Primary Wing Teacher",
            "qualification": "B.Ed (Early Childhood)",
            "exp": "4 Years",
            "subject": "Phonics & Motor Skills",
            "status": "Present",
            "phone": "9848222332",
            "email": "srinath.k@srividya.edu",
            "personalEmail": "srinath.k.personal@gmail.com"
      },
      {
            "id": "SV200025",
            "name": "Smt. P. Swapna",
            "role": "Drawing & Arts Teacher",
            "qualification": "M.F.A (Fine Arts)",
            "exp": "9 Years",
            "subject": "Drawing, Craft & Aesthetics",
            "status": "Present",
            "phone": "9848233443",
            "email": "swapna.p@srividya.edu",
            "personalEmail": "swapna.p.personal@gmail.com"
      },
      {
            "id": "SV200026",
            "name": "Sri G. Ranga Rao",
            "role": "School Librarian",
            "qualification": "M.Lib.Sc",
            "exp": "14 Years",
            "subject": "Library Management & Reading",
            "status": "Present",
            "phone": "9848244554",
            "email": "ranga.g@srividya.edu",
            "personalEmail": "ranga.g.personal@gmail.com"
      },
      {
            "id": "SV200027",
            "name": "Smt. M. Vijaya",
            "role": "Office Administrator",
            "qualification": "B.Com",
            "exp": "12 Years",
            "subject": "Accounts & Records",
            "status": "Present",
            "phone": "9848255665",
            "email": "vijaya.m@srividya.edu",
            "personalEmail": "vijaya.m.personal@gmail.com"
      },
      {
            "id": "SV200028",
            "name": "Sri B. Kishore",
            "role": "Accounts Clerk",
            "qualification": "B.Com, Tally",
            "exp": "6 Years",
            "subject": "Fee Management & Billing",
            "status": "Present",
            "phone": "9848266776",
            "email": "kishore.b@srividya.edu",
            "personalEmail": "kishore.b.personal@gmail.com"
      },
      {
            "id": "SV200029",
            "name": "Sri V. Suresh Babu",
            "role": "Lab Assistant - Science",
            "qualification": "B.Sc (Chemistry)",
            "exp": "5 Years",
            "subject": "Lab Setup & Equipment",
            "status": "Present",
            "phone": "9848277887",
            "email": "suresh.v@srividya.edu",
            "personalEmail": "suresh.v.personal@gmail.com"
      },
      {
            "id": "SV200030",
            "name": "Smt. CH. Saranya",
            "role": "Counsellor & Welfare Officer",
            "qualification": "M.A (Psychology), B.Ed",
            "exp": "7 Years",
            "subject": "Student Welfare & Counselling",
            "status": "Present",
            "phone": "9848288998",
            "email": "saranya.ch@srividya.edu",
            "personalEmail": "saranya.ch.personal@gmail.com"
      }
],
    feeTransactions: [
      { receiptNo: 'RCPT-2026-4891', student: 'P. Hema Latha', class: 'Class X-A', term: 'Term 2 Tuition', amount: '₹14,500', mode: 'UPI (PhonePe)', date: 'Today, 11:20 AM', cashier: 'S. Ramu' },
      { receiptNo: 'RCPT-2026-4890', student: 'M. Sravanthi', class: 'Class IX-A', term: 'Term 2 + Computer Fee', amount: '₹16,000', mode: 'Net Banking', date: 'Today, 10:45 AM', cashier: 'S. Ramu' },
      { receiptNo: 'RCPT-2026-4889', student: 'K. Tanvi Sree', class: 'Class I-A', term: 'Term 2 Tuition', amount: '₹11,000', mode: 'Cash', date: 'Today, 09:50 AM', cashier: 'B. Krishna' },
      { receiptNo: 'RCPT-2026-4888', student: 'CH. Karthik', class: 'Class VIII-A', term: 'Term 1 Balance Due', amount: '₹6,500', mode: 'UPI (GooglePay)', date: 'Yesterday, 04:15 PM', cashier: 'S. Ramu' },
      { receiptNo: 'RCPT-2026-4887', student: 'V. Divya Bharathi', class: 'Class VIII-A', term: 'Term 2 Tuition', amount: '₹13,500', mode: 'Cheque (#881023)', date: 'Yesterday, 02:30 PM', cashier: 'B. Krishna' },
      { receiptNo: 'RCPT-2026-4886', student: 'B. Mohan Krishna', class: 'Class V-A', term: 'Bus Fee Q2', amount: '₹4,500', mode: 'Cash', date: 'Yesterday, 11:15 AM', cashier: 'S. Ramu' },
      { receiptNo: 'RCPT-2026-4885', student: 'G. Ananya', class: 'Class X-B', term: 'Term 2 Tuition', amount: '₹14,500', mode: 'UPI (Paytm)', date: '20 Sep 2026, 03:40 PM', cashier: 'B. Krishna' },
      { receiptNo: 'RCPT-2026-4884', student: 'T. Varun Tej', class: 'Class VII-A', term: 'Science Lab & Practical', amount: '₹3,200', mode: 'UPI (PhonePe)', date: '20 Sep 2026, 01:15 PM', cashier: 'S. Ramu' },
      { receiptNo: 'RCPT-2026-4883', student: 'S. Sneha Latha', class: 'Class VI-A', term: 'Term 2 Tuition', amount: '₹12,000', mode: 'Cash', date: '19 Sep 2026, 04:30 PM', cashier: 'B. Krishna' },
      { receiptNo: 'RCPT-2026-4882', student: 'R. Keerthi', class: 'Class III-A', term: 'Term 2 Tuition', amount: '₹10,500', mode: 'Net Banking', date: '19 Sep 2026, 02:10 PM', cashier: 'S. Ramu' },
      { receiptNo: 'RCPT-2026-4881', student: 'K. Sai Praneeth', class: 'Class IX-B', term: 'Bus Fee Q2', amount: '₹4,500', mode: 'UPI (GooglePay)', date: '19 Sep 2026, 11:00 AM', cashier: 'B. Krishna' },
      { receiptNo: 'RCPT-2026-4880', student: 'M. Rohith', class: 'Class IV-A', term: 'Term 2 Tuition', amount: '₹11,000', mode: 'Cash', date: '18 Sep 2026, 03:20 PM', cashier: 'S. Ramu' },
      { receiptNo: 'RCPT-2026-4879', student: 'P. Tejaswini', class: 'Class II-A', term: 'Term 2 Tuition', amount: '₹10,000', mode: 'UPI (PhonePe)', date: '18 Sep 2026, 10:15 AM', cashier: 'B. Krishna' },
      { receiptNo: 'RCPT-2026-4878', student: 'A. Lokesh', class: 'Class X-A', term: 'Examination & Board Fee', amount: '₹3,500', mode: 'Cash', date: '17 Sep 2026, 04:00 PM', cashier: 'S. Ramu' }
    ],
    // Total Students across all classes = exactly 855 members (Section A only)
    classAttendance: [
      { class: 'Class X-A', total: 44, present: 42, absent: 2, leave: 0, pct: '95.5%', teacher: 'Sri B. Narayana', status: 'Submitted' },
      { class: 'Class IX-A', total: 44, present: 42, absent: 2, leave: 0, pct: '95.5%', teacher: 'Smt. T. Padmavathi', status: 'Submitted' },
      { class: 'Class VIII-A', total: 44, present: 43, absent: 1, leave: 0, pct: '97.7%', teacher: 'Sri M. Raju', status: 'Submitted' },
      { class: 'Class VII-A', total: 46, present: 44, absent: 2, leave: 0, pct: '95.7%', teacher: 'Smt. V. Jyothsna', status: 'Submitted' },
      { class: 'Class VI-A', total: 46, present: 44, absent: 2, leave: 0, pct: '95.7%', teacher: 'Sri CH. Venkateswara Rao', status: 'Submitted' },
      { class: 'Class V-A', total: 44, present: 43, absent: 1, leave: 0, pct: '97.7%', teacher: 'Smt. N. Sirisha', status: 'Submitted' },
      { class: 'Class IV-A', total: 44, present: 42, absent: 2, leave: 0, pct: '95.5%', teacher: 'Sri A. Prasad', status: 'Submitted' },
      { class: 'Class III-A', total: 44, present: 43, absent: 1, leave: 0, pct: '97.7%', teacher: 'Smt. R. Kavitha', status: 'Submitted' },
      { class: 'Class II-A', total: 46, present: 44, absent: 2, leave: 0, pct: '95.7%', teacher: 'Sri S. Gopal', status: 'Submitted' },
      { class: 'Class I-A', total: 48, present: 46, absent: 2, leave: 0, pct: '95.8%', teacher: 'Smt. Y. Anusha', status: 'Submitted' },
      { class: 'Pre-Primary-A', total: 50, present: 48, absent: 2, leave: 0, pct: '96.0%', teacher: 'Smt. D. Meena', status: 'Submitted' }
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
    gateLateRecords: [
      { id: 'GL-2026-081', student: 'CH. Karthik', admNo: 'SV-0041', class: 'Class VIII-A', time: '08:52 AM', gate: 'Main Campus Gate #1', commute: 'Walking', weeklyCount: '3rd time this week', reason: 'Heavy traffic at Gajuwaka junction', action: 'Morning assembly diary note signed; Warning letter dispatched to parents', status: 'Warning Dispatched' },
      { id: 'GL-2026-082', student: 'B. Tarun Reddy', admNo: 'SV-0042', class: 'Class IX-A', time: '08:56 AM', gate: 'Main Campus Gate #1', commute: 'Bicycle', weeklyCount: '2nd time this week', reason: 'Bicycle tyre puncture near Old Post Office', action: 'Detention during zero period; Parent conference scheduled for Monday', status: 'Conference Summons' },
      { id: 'GL-2026-083', student: 'M. Jagadeesh', admNo: 'SV-0078', class: 'Class VII-A', time: '08:50 AM', gate: 'Campus Gate #2', commute: 'Auto-Rickshaw', weeklyCount: '1st time this week', reason: 'Heavy downpour at Scindia stop', action: 'Permitted with verbal caution by VP Sri Navva Anand', status: 'Counseled' },
      { id: 'GL-2026-084', student: 'K. Pravalika', admNo: 'SV-0011', class: 'Class X-A', time: '08:48 AM', gate: 'Main Campus Gate #1', commute: 'APSRTC Bus', weeklyCount: '1st time this week', reason: 'Route 400 bus arrived late at Sriharipuram junction', action: 'Admitted with morning assembly slip', status: 'Admitted' }
    ],
    meritAwards: [
      { id: 'MRT-2026-018', student: 'P. Hema Latha', class: 'Class X-A', points: '+20 Points', category: 'Exemplary Merit / Good Deed', description: 'Achieved 1st Rank in District Mathematics Olympiad & guided peer group.', authority: 'Vice Principal Sri Navva Anand', date: 'Yesterday', certificateNo: 'CERT-MERIT-2026-104' },
      { id: 'MRT-2026-017', student: 'T. Siri Varshini', class: 'Class III-A', points: '+15 Points', category: 'Honesty & Moral Integrity', description: 'Handed over misplaced gold earring found in primary library to VP office immediately.', authority: 'Principal Smt. Gorle Varalakshmi', date: 'Sept 18, 2026', certificateNo: 'CERT-MERIT-2026-103' },
      { id: 'MRT-2026-016', student: 'G. Sai Teja', class: 'Class X-A', points: '+20 Points', category: 'State Science Olympiad Silver Medalist', description: 'Selected for National Science Seminar representing Andhra Pradesh South Zone.', authority: 'Vice Principal Sri Navva Anand', date: 'Sept 15, 2026', certificateNo: 'CERT-MERIT-2026-102' }
    ],
    parentConvocations: [
      { id: 'CONV-2026-009', student: 'B. Tarun Reddy', class: 'Class IX-A', parent: 'B. Appa Rao', phone: '9848123490', date: 'Monday, Oct 05, 2026 • 10:00 AM', venue: 'Vice Principal Chamber (Room 102)', purpose: 'Review unauthorized smartphone usage in biology practical and execute conduct bond.', officer: 'Sri Navva Anand (Vice Principal)', status: 'Scheduled' },
      { id: 'CONV-2026-008', student: 'CH. Karthik', class: 'Class VIII-A', parent: 'CH. Satyanarayana', phone: '9848234501', date: 'Friday, Sept 25, 2026 • 03:30 PM', venue: 'Academic Office (Ground Floor)', purpose: 'Habitual morning gate late-arrival counseling (3rd late entry this week).', officer: 'Sri Navva Anand (Vice Principal)', status: 'Completed' }
    ],
    facultyLeaves: [
      { id: 1, name: 'Sri K. Rajesh', dept: 'Physical Science', type: 'Medical Leave', dates: 'Sept 21 – 22 (2 Days)', substitute: 'Sri Navva Anand & Smt. S. Lakshmi', reason: 'Viral fever & throat infection recovery.', status: 'Pending VP Recommendation' },
      { id: 2, name: 'Smt. K. Anitha', dept: 'Primary Mathematics', type: 'Casual Leave', dates: 'Sept 23 (1 Day)', substitute: 'Smt. G. Sarada', reason: 'Family ceremony attendance.', status: 'Pending VP Recommendation' },
      { id: 3, name: 'Sri V. Ramesh Babu', dept: 'Physical Education', type: 'On Duty (OD)', dates: 'Sept 25 (1 Day)', substitute: 'Sri D. Srinivas', reason: 'Accompanying district badminton team for inter-school meet.', status: 'Pending VP Recommendation' }
    ]
  };

  // =========================================================================
  // SRI VIDYA HIGH SCHOOL - SUBVIEW STATIC & HISTORICAL REGISTERS
  // =========================================================================
  const STUDENT_LEAVES_DATA = [
    { slipId: 'SLP-2026-014', admNo: 'SV-0082', name: 'P. Kiran Kumar', class: 'Class X-A', roll: '#1004', ground: 'Medical Grounds', dates: '24 Sep – 26 Sep (3 Days)', reason: 'Typhoid recovery • Medical Cert Verified by VP', parent: 'P. Appala Naidu', phone: '9848011223', status: 'Approved' },
    { slipId: 'SLP-2026-013', admNo: 'SV-0012', name: 'G. Sai Teja', class: 'Class X-A', roll: '#1001', ground: 'Sports / Olympiad', dates: '25 Sep (1 Day)', reason: 'AP State Athletics Meet Representation (Vizag)', parent: 'G. Venkata Rao', phone: '9848022334', status: 'Approved' },
    { slipId: 'SLP-2026-012', admNo: 'SV-0105', name: 'K. Sai Tharun', class: 'Class IX-A', roll: '#904', ground: 'Sick / Illness', dates: '25 Sep (1 Day)', reason: 'Acute migraine & fever reported by parent', parent: 'K. Narayana', phone: '9848033445', status: 'Parent Verified' },
    { slipId: 'SLP-2026-011', admNo: 'SV-0091', name: 'M. Sravanthi', class: 'Class IX-A', roll: '#901', ground: 'Family / Personal', dates: '26 Sep – 27 Sep (2 Days)', reason: 'Sister wedding ceremony at Rajahmundry', parent: 'M. Narayana Murthy', phone: '9848044556', status: 'Approved' },
    { slipId: 'SLP-2026-010', admNo: 'SV-0144', name: 'CH. Karthik', class: 'Class VIII-A', roll: '#803', ground: 'Gate Pass / Early Exit', dates: 'Today • 01:30 PM', reason: 'Dental appointment at Gajuwaka Dental Clinic', parent: 'CH. Satyanarayana', phone: '9848055667', status: 'Gate Pass Issued' },
    { slipId: 'SLP-2026-009', admNo: 'SV-0201', name: 'B. Tarun Reddy', class: 'Class VIII-A', roll: '#808', ground: 'Sick / Illness', dates: '23 Sep – 25 Sep (3 Days)', reason: 'Viral infection with medical prescription attached', parent: 'B. Appa Rao', phone: '9848066778', status: 'Approved' },
    { slipId: 'SLP-2026-008', admNo: 'SV-0255', name: 'S. Bhavana', class: 'Class VII-A', roll: '#701', ground: 'Medical Grounds', dates: '22 Sep – 24 Sep (3 Days)', reason: 'Eye surgery recovery • Ophthalmology certificate submitted', parent: 'S. Prasad', phone: '9848077889', status: 'Medical Clearance' },
    { slipId: 'SLP-2026-007', admNo: 'SV-0312', name: 'D. Manoj Kumar', class: 'Class VII-B', roll: '#715', ground: 'Family / Personal', dates: '25 Sep (1 Day)', reason: 'Grandfather 80th birthday pilgrimage to Simhachalam', parent: 'D. Rama Krishna', phone: '9848088990', status: 'Approved' },
    { slipId: 'SLP-2026-006', admNo: 'SV-0388', name: 'B. Vennela', class: 'Class VI-A', roll: '#602', ground: 'Sports / Olympiad', dates: '25 Sep – 26 Sep (2 Days)', reason: 'District Inter-School Chess Championship (Under-14)', parent: 'B. Srinivas', phone: '9848099001', status: 'Approved' },
    { slipId: 'SLP-2026-005', admNo: 'SV-0419', name: 'R. Divya', class: 'Class V-A', roll: '#505', ground: 'Gate Pass / Early Exit', dates: 'Today • 02:00 PM', reason: 'High fever in class • Escorted by mother Smt. R. Lakshmi', parent: 'R. Kameswara Rao', phone: '9848100112', status: 'Gate Pass Issued' },
    { slipId: 'SLP-2026-004', admNo: 'SV-0472', name: 'M. Dinesh Kumar', class: 'Class IV-B', roll: '#410', ground: 'Sick / Illness', dates: '24 Sep – 25 Sep (2 Days)', reason: 'Stomach flu • Home rest advised by pediatrician', parent: 'M. Jagannath', phone: '9848111223', status: 'Approved' },
    { slipId: 'SLP-2026-003', admNo: 'SV-0518', name: 'T. Siri Varshini', class: 'Class III-A', roll: '#301', ground: 'Sports / Olympiad', dates: '26 Sep (1 Day)', reason: 'State Little Master Quiz & Abacus Regional Round', parent: 'T. Srinivasa Rao', phone: '9848122334', status: 'Approved' },
    { slipId: 'SLP-2026-002', admNo: 'SV-0604', name: 'K. Tanvi Sree', class: 'Class I-A', roll: '#101', ground: 'Sick / Illness', dates: '25 Sep (1 Day)', reason: 'Seasonal cold and mild cough', parent: 'K. Ramana', phone: '9848133445', status: 'Parent Verified' },
    { slipId: 'SLP-2026-001', admNo: 'SV-0720', name: 'CH. Charitha', class: 'Class PP-1', roll: '#015', ground: 'Family / Personal', dates: '25 Sep – 26 Sep (2 Days)', reason: 'Family travel out of station', parent: 'CH. Mohan', phone: '9848144556', status: 'Approved' }
  ];

  const ACADEMIC_CLASSES_DATA = [
    { class: 'Class X-A', wing: 'High School (Senior)', hours: '08:45 AM – 04:30 PM (Special Coaching)', strength: 85, teacher: 'Sri B. Narayana (M.Sc)', room: 'Room 201 (Second Floor)', timetableStatus: 'Approved & Active' },
    { class: 'Class IX-A', wing: 'High School', hours: '08:45 AM – 04:00 PM', strength: 88, teacher: 'Smt. T. Padmavathi (M.A)', room: 'Room 202 (Second Floor)', timetableStatus: 'Approved & Active' },
    { class: 'Class VIII-A', wing: 'High School', hours: '08:45 AM – 04:00 PM', strength: 90, teacher: 'Sri M. Raju (M.Sc)', room: 'Room 203 (Second Floor)', timetableStatus: 'Approved & Active' },
    { class: 'Class VII-A', wing: 'Upper Primary', hours: '08:45 AM – 03:45 PM', strength: 92, teacher: 'Smt. V. Jyothsna (M.A)', room: 'Room 105 (First Floor)', timetableStatus: 'Approved & Active' },
    { class: 'Class VI-A', wing: 'Upper Primary', hours: '08:45 AM – 03:45 PM', strength: 95, teacher: 'Sri CH. Venkateswara Rao (M.Sc)', room: 'Room 104 (First Floor)', timetableStatus: 'Approved & Active' },
    { class: 'Class V-A', wing: 'Primary Wing', hours: '09:00 AM – 03:30 PM', strength: 86, teacher: 'Smt. N. Sirisha (B.Sc)', room: 'Room 103 (First Floor)', timetableStatus: 'Approved & Active' },
    { class: 'Class IV-A', wing: 'Primary Wing', hours: '09:00 AM – 03:30 PM', strength: 84, teacher: 'Sri A. Prasad (B.Sc)', room: 'Room 102 (First Floor)', timetableStatus: 'Approved & Active' },
    { class: 'Class III-A', wing: 'Primary Wing', hours: '09:00 AM – 03:30 PM', strength: 82, teacher: 'Smt. R. Kavitha (B.A)', room: 'Room 101 (First Floor)', timetableStatus: 'Approved & Active' },
    { class: 'Class II-A', wing: 'Foundational', hours: '09:00 AM – 03:15 PM', strength: 78, teacher: 'Sri S. Gopal (B.Sc)', room: 'Room 004 (Ground Floor)', timetableStatus: 'Approved & Active' },
    { class: 'Class I-A', wing: 'Foundational', hours: '09:00 AM – 03:15 PM', strength: 75, teacher: 'Smt. Y. Anusha (B.A)', room: 'Room 003 (Ground Floor)', timetableStatus: 'Approved & Active' }
  ];

  const ACADEMIC_SUBJECTS_DATA = [
    { code: 'MTH-101', title: 'Mathematics & Vedic Arithmetic', dept: 'Mathematics Wing', book: 'AP SCERT & NCERT Class 10 Foundation', periods: '8 Periods / Wk', hod: 'Sri P. Satyanarayana (HOD)', lab: 'Maths Lab (Room 205)', progress: '78%' },
    { code: 'PHY-102', title: 'Physical Science (Physics & Chemistry)', dept: 'Science Wing', book: 'AP Board Science Vol I & II', periods: '7 Periods / Wk', hod: 'Sri Navva Anand & Sri K. Rajesh', lab: 'Science Lab (GF)', progress: '75%' },
    { code: 'BIO-103', title: 'Biological Science & Environment', dept: 'Science Wing', book: 'SCERT Life Sciences & Lab Manual', periods: '5 Periods / Wk', hod: 'Smt. S. Lakshmi (M.Sc)', lab: 'Biology Section (GF)', progress: '80%' },
    { code: 'ENG-104', title: 'English Language, Grammar & Literature', dept: 'Languages Wing', book: 'First Flight & Words and Expressions', periods: '7 Periods / Wk', hod: 'Smt. M. Sunitha (Senior HOD)', lab: 'Digital English Language Lab', progress: '82%' },
    { code: 'SOC-105', title: 'Social Studies & Contemporary World', dept: 'Social Sciences', book: 'AP SCERT History, Civics & Geo', periods: '6 Periods / Wk', hod: 'Sri R. Venkata Ramana', lab: 'Social Science Map Room', progress: '74%' },
    { code: 'TEL-106', title: 'First Language (Telugu - Telugu Velugu)', dept: 'Vernacular Languages', book: 'Telugu Bharati & Vyakaranam SCERT', periods: '6 Periods / Wk', hod: 'Smt. G. Sarada & Smt. T. Padmavathi', lab: 'Library Vernacular Wing', progress: '85%' },
    { code: 'HIN-107', title: 'Second Language (Hindi - Rashtrabhasha)', dept: 'Languages Wing', book: 'Sparsh & Sanchayan Textbooks', periods: '4 Periods / Wk', hod: 'Smt. B. Meenakshi', lab: 'General Classroom', progress: '81%' },
    { code: 'CMP-108', title: 'Computer Science & ICT Applications', dept: 'Technology & Coding', book: 'Oxford Computer Science & Scratch 3.0', periods: '3 Periods / Wk', hod: 'Sri D. Srinivas (MCA)', lab: 'Air-Conditioned Computer Lab (35 PCs)', progress: '88%' }
  ];

  const EXAMS_SCHEDULE_DATA = [
    { title: 'Unit Test 2 (Quarterly Assessment)', class: 'Class X-A', subject: 'Mathematics', date: '28 Sep 2026', time: '09:30 AM – 12:00 PM', marks: '50 Marks', hall: 'Hall 1 (Main Auditorium)', invigilator: 'Sri Navva Anand', status: 'Scheduled' },
    { title: 'Unit Test 2 (Quarterly Assessment)', class: 'Class X-A', subject: 'Physical Science', date: '29 Sep 2026', time: '09:30 AM – 12:00 PM', marks: '50 Marks', hall: 'Hall 1 (Main Auditorium)', invigilator: 'Smt. S. Lakshmi', status: 'Scheduled' },
    { title: 'Unit Test 2 (Quarterly Assessment)', class: 'Class IX-A', subject: 'Mathematics', date: '28 Sep 2026', time: '09:30 AM – 12:00 PM', marks: '50 Marks', hall: 'Hall 2 (Secondary Wing)', invigilator: 'Sri P. Satyanarayana', status: 'Scheduled' },
    { title: 'Unit Test 2 (Quarterly Assessment)', class: 'Class VIII-A', subject: 'English', date: '28 Sep 2026', time: '01:30 PM – 04:00 PM', marks: '50 Marks', hall: 'Hall 2 (Secondary Wing)', invigilator: 'Smt. M. Sunitha', status: 'Scheduled' },
    { title: 'Unit Test 2 (Quarterly Assessment)', class: 'Class VII-A', subject: 'General Science', date: '29 Sep 2026', time: '01:30 PM – 04:00 PM', marks: '50 Marks', hall: 'Hall 3 (Primary Wing)', invigilator: 'Sri CH. Venkateswara Rao', status: 'Scheduled' },
    { title: 'Half Yearly Examination 2026', class: 'Classes I – X', subject: 'All Subjects (State Board)', date: '15 Oct – 24 Oct 2026', time: '09:30 AM – 12:30 PM', marks: '100 Marks', hall: 'All Examination Halls', invigilator: 'Full Faculty Roster', status: 'Timetable Released' }
  ];

  const ACADEMIC_RESULTS_DATA = [
    { class: 'Class X-A', appeared: 85, passed: 85, passRate: '100%', meanGpa: '9.67 / 10.0', topScorer: 'P. Hema Latha', highestMark: '100 / 100 (Maths & Sci)', distinctions: '58 Students (68.2%)' },
    { class: 'Class IX-A', appeared: 88, passed: 87, passRate: '98.9%', meanGpa: '9.00 / 10.0', topScorer: 'M. Sravanthi', highestMark: '98 / 100 (Maths)', distinctions: '42 Students (47.7%)' },
    { class: 'Class VIII-A', appeared: 90, passed: 89, passRate: '98.9%', meanGpa: '9.20 / 10.0', topScorer: 'CH. Karthik', highestMark: '99 / 100 (Science)', distinctions: '48 Students (53.3%)' },
    { class: 'Class VII-A', appeared: 92, passed: 92, passRate: '100%', meanGpa: '9.15 / 10.0', topScorer: 'S. Bhavana', highestMark: '97 / 100 (English)', distinctions: '45 Students (48.9%)' },
    { class: 'Class VI-A', appeared: 95, passed: 94, passRate: '98.9%', meanGpa: '8.85 / 10.0', topScorer: 'B. Vennela', highestMark: '96 / 100 (Social)', distinctions: '38 Students (40.0%)' },
    { class: 'Class V-A', appeared: 86, passed: 86, passRate: '100%', meanGpa: '9.40 / 10.0', topScorer: 'R. Divya', highestMark: '99 / 100 (EVS)', distinctions: '52 Students (60.5%)' },
    { class: 'Class III-A', appeared: 82, passed: 82, passRate: '100%', meanGpa: '9.50 / 10.0', topScorer: 'T. Siri Varshini', highestMark: '100 / 100 (All Subjects)', distinctions: '56 Students (68.3%)' },
    { class: 'Class I-A', appeared: 75, passed: 75, passRate: '100%', meanGpa: '9.80 / 10.0', topScorer: 'K. Tanvi Sree', highestMark: '100 / 100 (Foundations)', distinctions: '62 Students (82.7%)' }
  ];

  const ACADEMIC_REPORTS_DATA = [
    { dept: 'High School Mathematics', hod: 'Sri P. Satyanarayana', syllabus: '78% Complete (Units 1-6 Cleared)', practicals: '12 Lab Experiments Logged', status: 'On Schedule for Term 1', audit: 'Verified by Principal' },
    { dept: 'Physical & Natural Sciences', hod: 'Sri Navva Anand & Sri K. Rajesh', syllabus: '75% Complete (Mechanics & Light)', practicals: '14 Lab Practicals Completed', status: 'On Schedule for Term 1', audit: 'Verified by Principal' },
    { dept: 'English Language & Literary Wing', hod: 'Smt. M. Sunitha', syllabus: '82% Complete (Grammar, Prose & Poetry)', practicals: 'Digital Language Lab Tests Active', status: 'Exceeding Syllabus Target', audit: 'Verified by Principal' },
    { dept: 'Social Sciences & Civics', hod: 'Sri R. Venkata Ramana', syllabus: '74% Complete (Map Work & Civics)', practicals: '6 Map Pointing Sessions Logged', status: 'On Schedule for Term 1', audit: 'Verified by Principal' },
    { dept: 'First Language (Telugu)', hod: 'Smt. G. Sarada', syllabus: '85% Complete (All Units & Sandhi)', practicals: 'Poetry Recitation & Handwriting', status: 'Exceeding Syllabus Target', audit: 'Verified by Principal' },
    { dept: 'Computer Science & ICT', hod: 'Sri D. Srinivas', syllabus: '88% Complete (HTML & Scratch 3.0)', practicals: 'Hands-on Machine Tests Conducted', status: 'Exceeding Syllabus Target', audit: 'Verified by Principal' }
  ];

  const ATTENDANCE_MONTHLY_DATA = [
    { class: 'Class X-A', strength: 85, days: 24, studentDays: 2040, avgRate: '98.5%', fullAttCount: '48 Students', riskCount: '0 (None)', status: 'Register Locked & Verified' },
    { class: 'Class IX-A', strength: 88, days: 24, studentDays: 2112, avgRate: '96.8%', fullAttCount: '41 Students', riskCount: '1 (Under Observation)', status: 'Register Locked & Verified' },
    { class: 'Class VIII-A', strength: 90, days: 24, studentDays: 2160, avgRate: '97.2%', fullAttCount: '44 Students', riskCount: '0 (None)', status: 'Register Locked & Verified' },
    { class: 'Class VII-A', strength: 92, days: 24, studentDays: 2208, avgRate: '96.5%', fullAttCount: '39 Students', riskCount: '0 (None)', status: 'Register Locked & Verified' },
    { class: 'Class VI-A', strength: 95, days: 24, studentDays: 2280, avgRate: '95.9%', fullAttCount: '36 Students', riskCount: '2 (Condonation Notice)', status: 'Register Locked & Verified' },
    { class: 'Class V-A', strength: 86, days: 24, studentDays: 2064, avgRate: '98.0%', fullAttCount: '47 Students', riskCount: '0 (None)', status: 'Register Locked & Verified' },
    { class: 'Class IV-A', strength: 84, days: 24, studentDays: 2016, avgRate: '97.6%', fullAttCount: '42 Students', riskCount: '0 (None)', status: 'Register Locked & Verified' },
    { class: 'Class III-A', strength: 82, days: 24, studentDays: 1968, avgRate: '98.8%', fullAttCount: '52 Students', riskCount: '0 (None)', status: 'Register Locked & Verified' },
    { class: 'Class II-A', strength: 78, days: 24, studentDays: 1872, avgRate: '97.1%', fullAttCount: '38 Students', riskCount: '0 (None)', status: 'Register Locked & Verified' },
    { class: 'Class I-A', strength: 75, days: 24, studentDays: 1800, avgRate: '98.4%', fullAttCount: '49 Students', riskCount: '0 (None)', status: 'Register Locked & Verified' }
  ];

  const SCIENCE_LABS_DATA = [
    { facility: 'Advanced Physics Laboratory', location: 'Ground Floor, Science Block', capacity: '45 Workstations', faculty: 'Sri Navva Anand & Sri V. Suresh Babu', occupancy: 'Class X-A (Batch A)', status: 'All Apparatus Calibrated & Operational', period: 'Period 4 (11:20 AM – 12:05 PM)', activeStatus: 'Occupied' },
    { facility: 'Chemistry & Reagent Lab', location: 'Ground Floor, Science Block', capacity: '45 Workstations', faculty: 'Sri B. Narayana (M.Sc)', occupancy: 'Vacant (Scheduled for Class IX)', status: 'Fume Hoods & Safety Kits Certified', period: 'Period 6 (02:00 PM – 02:45 PM)', activeStatus: 'Ready' },
    { facility: 'Botany & Zoology Biosphere Lab', location: 'Ground Floor, Room 008', capacity: '40 Workstations', faculty: 'Smt. S. Lakshmi (M.Sc)', occupancy: 'Class VIII-A (Dissection Models)', status: 'Microscopes & Specimen Jars Logged', period: 'Period 3 (10:35 AM – 11:20 AM)', activeStatus: 'Occupied' },
    { facility: 'High-Tech Computer Science Lab', location: 'First Floor, Room 108', capacity: '35 Dell OptiPlex Core-i5 PCs', faculty: 'Sri D. Srinivas (MCA)', occupancy: 'Class VII-A (Scratch 3.0 Practical)', status: '100 Mbps Fiber & UPS Synchronized', period: 'Period 5 (01:15 PM – 02:00 PM)', activeStatus: 'Occupied' }
  ];

  const DEFAULTERS_DATA = [
    { admNo: 'SV-0045', name: 'M. Jagannath', parent: 'M. Venkata Ramana', class: 'Class X-A', head: 'Term 2 Tuition Fee', aging: '22 Days Overdue', amount: '₹14,500', reminder: 'SMS Sent Yesterday', phone: '9848033445' },
    { admNo: 'SV-0112', name: 'B. Varun', parent: 'B. Srinivasa Rao', class: 'Class IX-A', head: 'Term 2 + Science Lab Fee', aging: '18 Days Overdue', amount: '₹16,000', reminder: 'WhatsApp Notice Sent', phone: '9848044556' },
    { admNo: 'SV-0210', name: 'K. Sai Tharun', parent: 'K. Narayana', class: 'Class VIII-A', head: 'Term 2 Tuition Fee', aging: '15 Days Overdue', amount: '₹13,500', reminder: 'Parent Call Pending', phone: '9848055667' },
    { admNo: 'SV-0345', name: 'G. Harsha Vardhan', parent: 'G. Appa Rao', class: 'Class VII-A', head: 'Transport Fee (Q2)', aging: '25 Days Overdue', amount: '₹6,000', reminder: 'SMS Sent Today', phone: '9848066778' },
    { admNo: 'SV-0489', name: 'CH. Charitha', parent: 'CH. Mohan', class: 'Class IV-A', head: 'Term 2 Tuition Fee', aging: '10 Days Overdue', amount: '₹11,000', reminder: 'Automated Reminder Sent', phone: '9848077889' },
    { admNo: 'SV-0062', name: 'P. Kiran Kumar', parent: 'P. Simhachalam', class: 'Class X-B', head: 'Term 1 & 2 Tuition Balance', aging: '65 Days Overdue (Critical)', amount: '₹24,000', reminder: 'Final Notice Dispatched', phone: '9440122334' },
    { admNo: 'SV-0158', name: 'T. Akhil', parent: 'T. Govinda Rao', class: 'Class IX-B', head: 'Term 2 Tuition + Bus Fee', aging: '70 Days Overdue (Critical)', amount: '₹19,500', reminder: 'VP Conference Scheduled', phone: '9849233445' },
    { admNo: 'SV-0233', name: 'R. Sai Teja', parent: 'R. Satyanarayana', class: 'Class VIII-B', head: 'Computer Lab & Library Dues', aging: '35 Days Overdue', amount: '₹4,500', reminder: 'SMS Sent 2 Days Ago', phone: '9177344556' },
    { admNo: 'SV-0298', name: 'S. Harini', parent: 'S. Venkatesh', class: 'Class VI-A', head: 'Term 2 Tuition Fee', aging: '12 Days Overdue', amount: '₹12,000', reminder: 'WhatsApp Reminder Delivered', phone: '8978155667' },
    { admNo: 'SV-0381', name: 'M. Dinesh Kumar', parent: 'M. Jagadeesh', class: 'Class V-A', head: 'Term 2 Tuition Fee', aging: '40 Days Overdue', amount: '₹11,500', reminder: '2nd Notice Dispatched', phone: '7032566778' },
    { admNo: 'SV-0412', name: 'K. Hemanth', parent: 'K. Nageswara Rao', class: 'Class III-A', head: 'Transport & Activity Fee', aging: '14 Days Overdue', amount: '₹5,500', reminder: 'SMS Sent Today', phone: '9949077889' },
    { admNo: 'SV-0475', name: 'V. Aditya', parent: 'V. Suresh Babu', class: 'Class II-A', head: 'Term 2 Tuition Fee', aging: '8 Days Overdue', amount: '₹10,500', reminder: 'Automated Reminder Sent', phone: '9866588990' },
    { admNo: 'SV-0520', name: 'B. Vennela', parent: 'B. Srinivas', class: 'Class I-A', head: 'Term 2 Tuition Fee', aging: '16 Days Overdue', amount: '₹10,000', reminder: 'WhatsApp Notice Delivered', phone: '9848099001' },
    { admNo: 'SV-0588', name: 'CH. Sai Charan', parent: 'CH. Venkatesh', class: 'Pre-Primary', head: 'Term 2 Tuition + Activity', aging: '62 Days Overdue (Critical)', amount: '₹13,000', reminder: 'Parent Call Pending', phone: '9848100112' },
    { admNo: 'SV-0078', name: 'K. Rajesh Naidu', parent: 'K. Bangarraju', class: 'Class X-A', head: 'Term 2 Tuition Fee', aging: '28 Days Overdue', amount: '₹14,500', reminder: 'WhatsApp Notice Sent', phone: '9440233445' },
    { admNo: 'SV-0199', name: 'D. Bhavani', parent: 'D. Appala Swamy', class: 'Class VII-B', head: 'Bus Transportation Route 4', aging: '45 Days Overdue', amount: '₹5,800', reminder: 'SMS Reminder Delivered', phone: '9849344556' }
  ];

    let CIRCULARS_DATA = [
    {
      ref: 'CIR-2026-042',
      title: 'Unit Test 2 Blueprints & Hall Ticket Distribution',
      category: 'Examination',
      audience: 'All Parents & Guardians (855)',
      date: '28 Sep 2026',
      status: 'Published',
      priority: 'Important',
      content: '<p>The question paper blueprints and timetable for Unit Test 2 (Classes VI to X) are uploaded to student dossiers. Hall tickets will be issued in respective classrooms from Monday, 28 Sep 2026. All fee dues clearance required for hall ticket validation.</p>',
      signedBy: 'Smt. Gorle Varalakshmi, Principal & Correspondent'
    },
    {
      ref: 'CIR-2026-041',
      title: 'Dussehra & Bathukamma Vacation Schedule & Reopening Guidelines',
      category: 'Holiday',
      audience: 'Complete School Community (900)',
      date: '24 Sep 2026',
      status: 'Published',
      priority: 'Normal',
      content: '<p>School will observe Dussehra vacations from 25 Sep 2026 to 05 Oct 2026. The campus reopens on Monday, 06 Oct 2026 at 08:30 AM sharp. Holiday assignment workbooks must be submitted to subject teachers on day one.</p>',
      signedBy: 'Smt. Gorle Varalakshmi, Principal & Correspondent'
    },
    {
      ref: 'CIR-2026-040',
      title: 'Preventive Health Advisory on Seasonal Monsoon Fevers & Campus Sanitation',
      category: 'Advisory',
      audience: 'All Parents & Guardians (855)',
      date: '23 Sep 2026',
      status: 'Published',
      priority: 'Important',
      content: '<p>Parents are advised to ensure wards wear full-sleeve uniforms and carry boiled drinking water. School campus has been sanitized with anti-mosquito misting. Please keep students home if running temperature and notify class teacher via WhatsApp or phone.</p>',
      signedBy: 'Campus Health & Sanitation Officer'
    },
    {
      ref: 'CIR-2026-039',
      title: 'District Athletic & Badminton Squad Selection Trials (Under-14 & Under-17)',
      category: 'Activity',
      audience: 'High School Wing (Classes VI to X, 440)',
      date: '21 Sep 2026',
      status: 'Published',
      priority: 'Normal',
      content: '<p>Selection trials for District School Games Federation (SGF) sports tournaments will take place at the municipal stadium on Saturday, 26 Sep 2026 at 07:00 AM. Eligible student athletes must bring signed consent forms.</p>',
      signedBy: 'Sri P. Satish, Physical Director'
    },
    {
      ref: 'CIR-2026-038',
      title: 'Class X SSC Board Candidates: Mandatory Saturday Intensive Coaching',
      category: 'Academic',
      audience: 'Class X Parents Only (78)',
      date: '19 Sep 2026',
      status: 'Published',
      priority: 'Important',
      content: '<p>Zero-period intensive revisions in Mathematics, Physical Science and English for Class X commences every Saturday from 08:00 AM to 09:30 AM. Attendance is strictly monitored and progress updates will be shared weekly with parents.</p>',
      signedBy: 'Smt. Gorle Varalakshmi, Principal'
    }
  ];

  let SMS_LOGS_DATA = [
    {
      logId: 'SMS-849104',
      time: 'Today • 11:18 AM',
      recipient: 'All Parents & Guardians (855)',
      category: 'Exam Alert',
      snippet: 'Unit Test 2 Blueprints & Hall Ticket Distribution scheduled from Monday. Clear dues for hall tickets.',
      gateway: 'AP-EDUSMS (Airtel DLT)',
      status: 'Delivered (99.4%)'
    },
    {
      logId: 'SMS-849103',
      time: 'Yesterday • 04:32 PM',
      recipient: 'Complete School Community (900)',
      category: 'Holiday Notice',
      snippet: 'Sri Vidya High School will observe Dussehra vacations from 25 Sep to 05 Oct. Reopens 06 Oct 8:30 AM.',
      gateway: 'AP-EDUSMS (Airtel DLT)',
      status: 'Delivered (100%)'
    },
    {
      logId: 'SMS-849102',
      time: '23 Sep 2026 • 04:35 PM',
      recipient: 'All Parents & Guardians (855)',
      category: 'Health Advisory',
      snippet: 'Monsoon health advisory: Full-sleeve uniform recommended. Campus misting completed.',
      gateway: 'AP-EDUSMS (Airtel DLT)',
      status: 'Delivered (99.8%)'
    },
    {
      logId: 'SMS-849101',
      time: '21 Sep 2026 • 02:20 PM',
      recipient: 'High School Wing (440)',
      category: 'Sports Trials',
      snippet: 'District SGF Sports Selection Trials on Saturday 26 Sep at 7:00 AM. Bring signed consent forms.',
      gateway: 'AP-EDUSMS (Airtel DLT)',
      status: 'Delivered (99.1%)'
    },
    {
      logId: 'SMS-849100',
      time: '19 Sep 2026 • 05:25 PM',
      recipient: 'Class X Parents (78)',
      category: 'Academic Coaching',
      snippet: 'Mandatory Saturday intensive coaching for Class X starts 8:00 AM. Punctuality required.',
      gateway: 'AP-EDUSMS (Airtel DLT)',
      status: 'Delivered (100%)'
    }
  ];

  let EMAIL_LOGS_DATA = [
    {
      emailId: 'EML-94025',
      time: 'Today • 11:20 AM',
      recipient: 'All Registered Parents (855)',
      subject: 'Unit Test 2 Blueprints & Hall Ticket Distribution Circular',
      category: 'Examinations',
      engagement: '78.4% Opened',
      status: 'Delivered (100%)'
    },
    {
      emailId: 'EML-94024',
      time: 'Yesterday • 04:35 PM',
      recipient: 'School Community (900)',
      subject: 'Dussehra & Bathukamma Vacation Schedule & Reopening Guidelines',
      category: 'Holidays',
      engagement: '91.2% Opened',
      status: 'Delivered (100%)'
    },
    {
      emailId: 'EML-94023',
      time: '23 Sep 2026 • 04:40 PM',
      recipient: 'All Parents (855)',
      subject: 'Health & Campus Hygiene Advisory - Monsoon Season Safeguards',
      category: 'Health Advisory',
      engagement: '84.6% Opened',
      status: 'Delivered (100%)'
    },
    {
      emailId: 'EML-94022',
      time: '19 Sep 2026 • 05:30 PM',
      recipient: 'Class X Parents (78)',
      subject: 'Intensive SSC Board Revision Classes & Timetable Schedule',
      category: 'Academics',
      engagement: '96.2% Opened',
      status: 'Delivered (100%)'
    }
  ];

  let PUSH_LOGS_DATA = [
    {
      pushId: 'NOTIF-5524',
      time: 'Today • 11:16 AM',
      target: 'Parent Mobile App',
      title: 'Unit Test 2 Hall Tickets & Blueprints Ready',
      body: 'Check the portal for question paper blueprints. Hall tickets will be issued in class.',
      category: 'Examination',
      status: 'Pushed (99.4%)'
    },
    {
      pushId: 'NOTIF-5523',
      time: 'Yesterday • 04:30 PM',
      target: 'Parent Mobile App',
      title: 'Dussehra Vacation Notice (25 Sep - 05 Oct)',
      body: 'School closes for vacations. Campus reopens on Monday 06 Oct at 08:30 AM.',
      category: 'Holiday',
      status: 'Pushed (100%)'
    },
    {
      pushId: 'NOTIF-5522',
      time: '23 Sep 2026 • 04:32 PM',
      target: 'Parent Mobile App',
      title: 'Monsoon Seasonal Health Precautions',
      body: 'Please ensure students wear full sleeve uniforms and carry clean drinking water.',
      category: 'Health Advisory',
      status: 'Pushed (99.8%)'
    },
    {
      pushId: 'NOTIF-5521',
      time: '19 Sep 2026 • 05:22 PM',
      target: 'Class X Parents App',
      title: 'Class X Saturday Revision Session',
      body: 'Saturday intensive revision class begins at 08:00 AM tomorrow in Room 102.',
      category: 'Academics',
      status: 'Pushed (100%)'
    }
  ];

  let BROADCAST_FEED_DATA = [
    {
      id: 'BC-2026-114',
      ref: 'CIR-2026-042',
      title: 'Unit Test 2 Blueprints & Hall Ticket Distribution',
      body: 'The question paper blueprints and timetable for Unit Test 2 (Classes VI to X) are uploaded to student dossiers. Hall tickets will be issued in respective classrooms from Monday, 28 Sep 2026. All fee dues clearance required for hall ticket validation.',
      category: 'Examination',
      categoryClass: 'cat-exam',
      time: 'Today • 11:15 AM',
      recipients: 'All Parents & Guardians (855)',
      channels: ['SMS', 'Notice Board', 'WhatsApp'],
      status: 'Delivered (99.4%)',
      sender: 'Academic Vice Principal • Smt. K. Hemalatha'
    },
    {
      id: 'BC-2026-113',
      ref: 'CIR-2026-041',
      title: 'Dussehra & Bathukamma Vacation Schedule & Reopening Guidelines',
      body: 'School will observe Dussehra vacations from 25 Sep 2026 to 05 Oct 2026. The campus reopens on Monday, 06 Oct 2026 at 08:30 AM sharp. Holiday assignment workbooks must be submitted to subject teachers on day one.',
      category: 'Holiday',
      categoryClass: 'cat-activity',
      time: 'Yesterday • 04:30 PM',
      recipients: 'Complete School Community (900)',
      channels: ['Notice Board', 'WhatsApp', 'Email'],
      status: 'Delivered (100%)',
      sender: 'Principal & Correspondent • Smt. Gorle Varalakshmi'
    },
    {
      id: 'BC-2026-112',
      ref: 'CIR-2026-040',
      title: 'Preventive Health Advisory on Seasonal Monsoon Fevers & Campus Sanitation',
      body: 'Parents are advised to ensure wards wear full-sleeve uniforms and carry boiled drinking water. School campus has been sanitized with anti-mosquito misting. Please keep students home if running temperature and notify class teacher via WhatsApp or phone.',
      category: 'Advisory',
      categoryClass: 'cat-advisory',
      time: '23 Sep 2026 • 04:30 PM',
      recipients: 'All Parents & Guardians (855)',
      channels: ['SMS', 'WhatsApp', 'App Push'],
      status: 'Delivered (99.8%)',
      sender: 'Campus Health & Sanitation Officer'
    },
    {
      id: 'BC-2026-111',
      ref: 'CIR-2026-039',
      title: 'District Athletic & Badminton Squad Selection Trials (Under-14 & Under-17)',
      body: 'Selection trials for District School Games Federation (SGF) sports tournaments will take place at the municipal stadium on Saturday, 26 Sep 2026 at 07:00 AM. Eligible student athletes must bring signed consent forms.',
      category: 'Activity',
      categoryClass: 'cat-sports',
      time: '21 Sep 2026 • 02:15 PM',
      recipients: 'High School Wing (Classes VI to X, 440)',
      channels: ['Notice Board', 'WhatsApp', 'App Push'],
      status: 'Delivered (99.1%)',
      sender: 'Physical Director • Sri P. Satish'
    },
    {
      id: 'BC-2026-110',
      ref: 'CIR-2026-038',
      title: 'Class X SSC Board Candidates: Mandatory Saturday Intensive Coaching',
      body: 'Zero-period intensive revisions in Mathematics, Physical Science and English for Class X commences every Saturday from 08:00 AM to 09:30 AM. Attendance is strictly monitored and progress updates will be shared weekly with parents.',
      category: 'Academic',
      categoryClass: 'cat-exam',
      time: '19 Sep 2026 • 05:20 PM',
      recipients: 'Class X Parents Only (78)',
      channels: ['SMS', 'Email', 'Notice Board'],
      status: 'Delivered (100%)',
      sender: 'Principal • Smt. Gorle Varalakshmi'
    },
    {
      id: 'BC-2026-109',
      ref: 'CIR-2026-037',
      title: 'Transport Advisory: Bus Route 4 & 7 Flyover Diversion Schedule',
      body: 'Due to municipal culvert repairs on the Main Road flyover, school bus routes 4 and 7 will arrive 10 minutes earlier at pick-up stops effective tomorrow morning. Evening drop timings remain unaltered.',
      category: 'Emergency',
      categoryClass: 'cat-advisory',
      time: '18 Sep 2026 • 06:10 PM',
      recipients: 'Bus Commuters & Parents (190)',
      channels: ['SMS', 'WhatsApp'],
      status: 'Delivered (100%)',
      sender: 'Transport In-charge • Sri G. Srinivas'
    }
  ];

  const EXAM_SCHEDULE_DETAILED = [
    { date: '28 Sep 2026 (Mon)', time: '09:30 AM – 12:00 PM', code: 'X-MTH-01', subject: 'Mathematics (Paper 1)', marks: '50 Marks', status: 'Printed & Sealed in Locker', lead: 'Sri P. Satyanarayana' },
    { date: '29 Sep 2026 (Tue)', time: '09:30 AM – 12:00 PM', code: 'X-PHY-02', subject: 'Physical Science', marks: '50 Marks', status: 'Question Paper Confidential', lead: 'Sri Navva Anand' },
    { date: '30 Sep 2026 (Wed)', time: '09:30 AM – 12:00 PM', code: 'X-BIO-03', subject: 'Biological Science', marks: '50 Marks', status: 'Approved by Principal', lead: 'Smt. S. Lakshmi' },
    { date: '01 Oct 2026 (Thu)', time: '09:30 AM – 12:00 PM', code: 'X-ENG-04', subject: 'English Language', marks: '50 Marks', status: 'Approved by Principal', lead: 'Smt. M. Sunitha' },
    { date: '03 Oct 2026 (Sat)', time: '09:30 AM – 12:00 PM', code: 'X-SOC-05', subject: 'Social Studies', marks: '50 Marks', status: 'Question Paper Confidential', lead: 'Sri R. Venkata Ramana' },
    { date: '05 Oct 2026 (Mon)', time: '09:30 AM – 12:00 PM', code: 'X-TEL-06', subject: 'First Language Telugu', marks: '50 Marks', status: 'Approved by Principal', lead: 'Smt. G. Sarada' }
  ];

  const INVIGILATION_DUTIES_DATA = [
    { hall: 'Hall 1 (Main Auditorium)', classes: 'Class X-A & Class IX-A (Odd Rolls)', invig1: 'Sri Navva Anand (VP)', invig2: 'Smt. S. Lakshmi', total: '70 Students', status: 'Duty Assigned & Confirmed' },
    { hall: 'Hall 2 (Secondary Wing - 2nd Flr)', classes: 'Class X-A & Class IX-A (Even Rolls)', invig1: 'Sri B. Narayana', invig2: 'Sri M. Raju', total: '65 Students', status: 'Duty Assigned & Confirmed' },
    { hall: 'Hall 3 (Primary Wing - 1st Flr)', classes: 'Class VIII-A & Class VII-A', invig1: 'Smt. M. Sunitha', invig2: 'Sri CH. Venkateswara Rao', total: '72 Students', status: 'Duty Assigned & Confirmed' },
    { hall: 'Hall 4 (Ground Floor Seminar)', classes: 'Class VI-A & Class V-A', invig1: 'Smt. V. Jyothsna', invig2: 'Sri A. Prasad', total: '68 Students', status: 'Duty Assigned & Confirmed' }
  ];

  const FEE_CATEGORY_AUDIT_DATA = [
    { head: 'Tuition Fee (Term 1 & 2)', demand: '₹1,24,50,000', collected: '₹1,18,20,000', concession: '₹2,30,000', dues: '₹4,00,000', pct: '94.9%', status: 'Audited & Reconciled' },
    { head: 'Computer Lab & Coding Facility', demand: '₹18,50,000', collected: '₹17,80,000', concession: '₹0', dues: '₹70,000', pct: '96.2%', status: 'Audited & Reconciled' },
    { head: 'Science Lab & Practical Consumables', demand: '₹12,40,000', collected: '₹11,90,000', concession: '₹0', dues: '₹50,000', pct: '95.9%', status: 'Audited & Reconciled' },
    { head: 'School Bus Transportation Quota', demand: '₹28,60,000', collected: '₹26,90,000', concession: '₹50,000', dues: '₹1,20,000', pct: '94.0%', status: 'Audited & Reconciled' },
    { head: 'Examination & Board Registration', demand: '₹8,55,000', collected: '₹8,55,000', concession: '₹0', dues: '₹0', pct: '100%', status: 'Fully Cleared' }
  ];

  const NON_TEACHING_STAFF_DATA = [
    {
      id: 'NT-101',
      name: 'Smt. M. Vijaya',
      role: 'Office Administrator & Head Clerk',
      dept: 'Administrative Office',
      qualification: 'M.Com, PGDCA',
      exp: '12 Years',
      subject: 'Administration & Admissions',
      phone: '98480 22338',
      email: 'office.srividya@gmail.com',
      status: 'Active',
      shift: '08:00 AM - 04:30 PM (Main Office)'
    },
    {
      id: 'NT-102',
      name: 'Sri B. Kishore',
      role: 'Accounts Officer & Cashier',
      dept: 'Finance & Accounts',
      qualification: 'B.Com, Tally Prime Certified',
      exp: '8 Years',
      subject: 'Fee Collection & Payroll',
      phone: '94401 77219',
      email: 'accounts.srividya@gmail.com',
      status: 'Active',
      shift: '08:30 AM - 04:30 PM (Accounts Desk)'
    },
    {
      id: 'NT-103',
      name: 'Sri V. Suresh Babu',
      role: 'Senior Science Laboratory Assistant',
      dept: 'Science Laboratories',
      qualification: 'B.Sc (Physics & Chemistry)',
      exp: '10 Years',
      subject: 'Lab Equipment & Safety',
      phone: '98492 11045',
      email: 'lab.srividya@gmail.com',
      status: 'Active',
      shift: '08:15 AM - 04:00 PM (Science Wing)'
    },
    {
      id: 'NT-104',
      name: 'Sri G. Ranga Rao',
      role: 'Head Librarian & Media In-Charge',
      dept: 'Library & Learning Resource',
      qualification: 'M.Li.Sc',
      exp: '14 Years',
      subject: 'Library Catalog & Digital Media',
      phone: '91773 45890',
      email: 'library.srividya@gmail.com',
      status: 'Active',
      shift: '08:30 AM - 04:30 PM (Central Library)'
    },
    {
      id: 'NT-105',
      name: 'Smt. CH. Saranya',
      role: 'Student Welfare & Counseling Coordinator',
      dept: 'Student Services',
      qualification: 'MSW, Child Psychology Diploma',
      exp: '6 Years',
      subject: 'Welfare, Health & First Aid',
      phone: '89781 33420',
      email: 'welfare.srividya@gmail.com',
      status: 'Active',
      shift: '08:30 AM - 04:00 PM (Counseling Room)'
    },
    {
      id: 'NT-106',
      name: 'Sri K. Nagaraju',
      role: 'Network Administrator & Systems Tech',
      dept: 'Information Technology',
      qualification: 'B.Tech (IT), CCNA',
      exp: '5 Years',
      subject: 'Computer Lab & CCTV Support',
      phone: '70325 88910',
      email: 'techsupport.srividya@gmail.com',
      status: 'Active',
      shift: '08:00 AM - 04:30 PM (IT Cell)'
    },
    {
      id: 'NT-107',
      name: 'Sri P. Appa Rao',
      role: 'Transport & Fleet Logistics Supervisor',
      dept: 'Transport Operations',
      qualification: 'Matriculate, Heavy Vehicle License',
      exp: '15 Years',
      subject: 'School Bus Fleet & Driver Operations',
      phone: '99490 66321',
      email: 'transport.srividya@gmail.com',
      status: 'Active',
      shift: '06:45 AM - 05:30 PM (Campus Fleet)'
    },
    {
      id: 'NT-108',
      name: 'Sri K. Venkataratnam',
      role: 'Campus Estate & Safety Supervisor',
      dept: 'Facilities & Security',
      qualification: 'Higher Secondary, First Aid Trained',
      exp: '11 Years',
      subject: 'Campus Security, Sanitation & Power',
      phone: '98665 12098',
      email: 'security.srividya@gmail.com',
      status: 'Active',
      shift: '07:30 AM - 05:30 PM (Campus Security)'
    }
  ];



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
      subtext: 'Overview of Sri Vidya E.M High School operations, live campus metrics, and pending executive actions for today.',
      badgeText: 'VICE PRINCIPAL EXECUTIVE PORTAL'
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

  // Synchronization of Faculty Records from Teacher Portal to Management Dashboard
  function syncFacultyFromStorage() {
    try {
      const stored = localStorage.getItem('sv_authorized_faculty');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          state.faculty = parsed;
          if (typeof renderStaffGrid === 'function') {
            renderStaffGrid(state.faculty);
          }
          if (typeof renderTeacherRosterPermissionsTable === 'function') {
            renderTeacherRosterPermissionsTable();
          }
          if (typeof populateTeacherSelectDropdown === 'function') {
            populateTeacherSelectDropdown();
          }
          if (typeof renderStaffAttendanceTable === 'function') {
            renderStaffAttendanceTable();
          }
          if (typeof renderFacultyAppraisals === 'function') {
            renderFacultyAppraisals();
          }
          if (typeof renderStaffLeaveBalances === 'function') {
            renderStaffLeaveBalances();
          }
          if (currentActiveDossierTeacherId) {
            const modal = document.getElementById('viewFacultyDossierModal');
            if (modal && modal.classList.contains('active')) {
              openFacultyDossier(currentActiveDossierTeacherId);
            }
          }
        }
      } else {
        localStorage.setItem('sv_authorized_faculty', JSON.stringify(state.faculty));
      }
    } catch (e) {
      console.warn('Error syncing faculty data from localStorage:', e);
    }
  }

  // Initialization

  // =========================================================================
  // PERSISTENT NOTIFICATION ECOSYSTEM (Stateful across page reloads)
  // =========================================================================
  const DEFAULT_PORTAL_NOTIFICATIONS = [
    {
      id: 'notif-1',
      title: 'New Transfer Certificate Request',
      text: 'Roll #1042 (Class IX-A) pending principal signature',
      time: '12 mins ago',
      timestamp: 1729400000000,
      unread: true
    },
    {
      id: 'notif-2',
      title: 'Leave Application: Science Faculty',
      text: 'K. Rajesh (Physics) requested 2 days casual leave',
      time: '35 mins ago',
      timestamp: 1729401000000,
      unread: true
    },
    {
      id: 'notif-3',
      title: 'Online Admissions Surge',
      text: 'New student admission forms submitted for 2026-27',
      time: '2 hours ago',
      timestamp: 1729402000000,
      unread: true
    },
    {
      id: 'notif-4',
      title: 'Daily Fee Collection Target',
      text: '87% of monthly dues collected. ₹3.8L pending.',
      time: 'Yesterday',
      timestamp: 1729300000000,
      unread: false
    }
  ];

  function getPortalNotifications() {
    try {
      const stored = localStorage.getItem('sv_notifications_list');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return DEFAULT_PORTAL_NOTIFICATIONS;
  }

  function savePortalNotifications(list) {
    try {
      localStorage.setItem('sv_notifications_list', JSON.stringify(list));
    } catch (e) {}
  }

  function renderNotifications() {
    const listEl = document.querySelector('.notif-list');
    const badge = document.getElementById('headerNotifCount');
    if (!listEl) return;

    const notifs = getPortalNotifications();
    const isAllRead = localStorage.getItem('sv_notifications_all_read') === 'true';
    const lastReadTime = parseInt(localStorage.getItem('sv_notifications_last_read_time') || '0', 10);

    let unreadCount = 0;
    const html = notifs.map(n => {
      // Determine if genuinely unread
      const isUnread = Boolean(n.unread) && (!isAllRead || (n.timestamp && n.timestamp > lastReadTime));
      if (isUnread) unreadCount++;

      return `
        <div class="notif-item ${isUnread ? 'unread' : ''}" data-id="${n.id}">
          <div class="notif-dot"></div>
          <div class="notif-body">
            <strong>${n.title}</strong>
            <p>${n.text}</p>
            <small>${n.time || 'Just now'}</small>
          </div>
        </div>
      `;
    }).join('');

    listEl.innerHTML = html;

    if (badge) {
      if (unreadCount > 0) {
        badge.textContent = unreadCount;
        badge.style.display = 'inline-flex';
      } else {
        badge.textContent = '0';
        badge.style.display = 'none';
      }
    }
  }

  function markAllNotificationsAsRead() {
    const now = Date.now();
    localStorage.setItem('sv_notifications_all_read', 'true');
    localStorage.setItem('sv_notifications_last_read_time', now.toString());

    const notifs = getPortalNotifications();
    notifs.forEach(n => { n.unread = false; });
    savePortalNotifications(notifs);

    const badge = document.getElementById('headerNotifCount');
    if (badge) {
      badge.textContent = '0';
      badge.style.display = 'none';
    }

    const unreadItems = document.querySelectorAll('.notif-item.unread');
    unreadItems.forEach(item => item.classList.remove('unread'));

    showToast('All notifications marked as read', 'info');
  }

  function addNewNotification(title, text, type = 'info') {
    const notifs = getPortalNotifications();
    const newNotif = {
      id: 'notif-' + Date.now(),
      title,
      text,
      time: 'Just now',
      timestamp: Date.now(),
      unread: true,
      type
    };

    notifs.unshift(newNotif);
    savePortalNotifications(notifs);

    // New update arrived: reset all-read flag so badge appears
    localStorage.setItem('sv_notifications_all_read', 'false');

    renderNotifications();
    showToast(`🔔 New Update: ${title}`, 'info');
  }

  function init() {
    if ((!state.students || state.students.length === 0) && typeof window !== 'undefined' && Array.isArray(window.STUDENT_ROSTER) && window.STUDENT_ROSTER.length > 0) {
      state.students = [...window.STUDENT_ROSTER];
    }
    // Filter out permanently deleted students (Principal / VP sign-offs)
    const deletedAdmNos = JSON.parse(localStorage.getItem('sv_deleted_student_adm_nos') || '[]');
    if (deletedAdmNos.length > 0 && Array.isArray(state.students)) {
      state.students = state.students.filter(s => !deletedAdmNos.includes(s.admNo));
      if (typeof window !== 'undefined' && Array.isArray(window.STUDENT_ROSTER)) {
        window.STUDENT_ROSTER = window.STUDENT_ROSTER.filter(s => !deletedAdmNos.includes(s.admNo));
      }
    }
    // Clean and deduplicate state.students and stored enrolled cache
    state.students = deduplicateStudents(state.students);
    try {
      const storedEnr = JSON.parse(localStorage.getItem('sv_enrolled_students') || '[]');
      if (Array.isArray(storedEnr) && storedEnr.length > 0) {
        localStorage.setItem('sv_enrolled_students', JSON.stringify(deduplicateStudents(storedEnr)));
      }
    } catch (e) {}
    
    // Restore saved authorized faculty and sync from Teacher Portal
    syncFacultyFromStorage();
    syncAdmissionsFromStorage();

    // Listen for live updates from Teacher Portal (same browser window or multi-tab)
    window.addEventListener('storage', function(e) {
      if (e.key === 'sv_departure_notice_alert' && e.newValue) {
        try {
          const alertObj = JSON.parse(e.newValue);
          renderNotifications();
          if (typeof renderWithdrawnStudentsPage === 'function') renderWithdrawnStudentsPage();
          showToast(`🔔 Departure Notice: ${alertObj.title}`, 'warning');
        } catch (err) {}
      }
      if (e.key === 'sv_new_admission_alert') {
        try {
          const alertData = JSON.parse(e.newValue);
          if (alertData && alertData.appId) {
            addNewNotification(
              'New Admission Received',
              `${alertData.studentName} (${alertData.grade}) • Ref: ${alertData.appId}`,
              'admission'
            );
          }
        } catch (err) {}
      } else if (e.key === 'sv_notifications_all_read' || e.key === 'sv_notifications_list') {
        renderNotifications();
      } else if (e.key === 'sv_applications') {
        syncAdmissionsFromStorage();
        renderAdmissionsQueue(state.admissions);
        showToast('New online student admission registered!', 'info');
      } else if (e.key === 'sv_office_admission_permission') {
        renderOfficePermissionControls();
        renderAdmissionsQueue(state.admissions);
      } else if (e.key === 'sv_authorized_faculty' || e.key === 'sv_faculty_last_sync' || e.key === 'sv_teacher_profile') {
        syncFacultyFromStorage();
        if (e.key === 'sv_faculty_last_sync') {
          showToast('Faculty profile updates synchronized from Teacher Portal', 'info');
        }
      }
    });

    // Also sync on window focus when switching tabs
    window.addEventListener('focus', function() {
      syncFacultyFromStorage();
    });
    setupDate();
    setupTheme();
    try {
      renderAllTables();
    } catch (err) {
      console.warn("renderAllTables error:", err);
    }
    bindEvents();
    renderExecutiveRestrictionsBanner();
    updateClerkFacultyAttSummary();
    setupHashRouting();

    const pBackdrop = document.getElementById('portalBackdrop');
    const pSidebar = document.getElementById('portalSidebar');
    if (pBackdrop && pSidebar) {
      pBackdrop.addEventListener('click', function () {
        pSidebar.classList.remove('mobile-open');
        pBackdrop.classList.remove('active');
      });
    }

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

    // Mark all read (Statefully stored in localStorage across page reloads)
    const markAllRead = document.getElementById('markAllRead');
    if (markAllRead) {
      markAllRead.addEventListener('click', function () {
        markAllNotificationsAsRead();
      });
    }

    // Sidebar navigation items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      const mainLink = item.querySelector('.nav-link');
      const moduleKey = item.getAttribute('data-module');
      const arrow = item.querySelector('.nav-arrow');
      const hasSub = !!item.querySelector('.nav-sub');

      // Clicking arrow toggles the sub-menu list without navigating
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

      // Clicking main nav link
      if (mainLink) {
        mainLink.addEventListener('click', function (e) {
          if (e.target.closest('.nav-arrow')) return;
          e.preventDefault();

          const wasActive = item.classList.contains('active');
          const wasOpen = item.classList.contains('open');

          if (wasActive && hasSub) {
            // If already on this module, clicking it toggles submenu open/close
            item.classList.toggle('open', !wasOpen);
          } else {
            // Navigate to module and open its submenu
            navigateTo(moduleKey);
            navItems.forEach(other => {
              if (other !== item) other.classList.remove('open');
            });
            if (hasSub) {
              item.classList.add('open');
            }
          }

          // Close mobile sidebar if open
          const sb = document.getElementById('portalSidebar');
          const bd = document.getElementById('portalBackdrop');
          if (window.innerWidth <= 1024) {
            if (sb) sb.classList.remove('mobile-open');
            if (bd) bd.classList.remove('active');
          }
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
          item.classList.add('open');
          navigateTo(moduleKey, subKey);

          // Close mobile sidebar if open
          const sb = document.getElementById('portalSidebar');
          const bd = document.getElementById('portalBackdrop');
          if (window.innerWidth <= 1024) {
            if (sb) sb.classList.remove('mobile-open');
            if (bd) bd.classList.remove('active');
          }
        });
      });
    });
  }

  function setupHashRouting() {
    function handleHash() {
      const hash = window.location.hash.replace('#', '');
      if (!hash) return;

      const aliasMap = {
        comm: 'communication',
        exams: 'examinations',
        exam: 'examinations',
        tt: 'timetable',
        att: 'attendance'
      };

      const parts = hash.split('-');
      let rawModule = parts[0];
      let rawSub = parts.slice(1).join('-') || null;

      let module = aliasMap[rawModule] || rawModule;

      if (document.getElementById('view-' + module)) {
        navigateTo(module, rawSub);
      }
    }
    window.addEventListener('hashchange', handleHash);
    handleHash();
  }

  function switchRole(roleKey, isUserAction = false) {
    if (roleKey === 'vp' || roleKey === 'viceprincipal') roleKey = 'vice-principal';
    if (roleKey === 'clerk' || roleKey === 'office') roleKey = 'admin';

    const config = roleConfigs[roleKey];
    if (!config) return;

    state.currentRole = roleKey;
    try {
      sessionStorage.setItem('sv_role_management', roleKey);
    } catch (e) {}

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

    // Both Principal and Vice Principal share the same Leadership / Executive Dashboard!
    // Office / Clerk has the dedicated Office Administration & Records Desk Dashboard.
    const principalDash = document.getElementById('roleDashboardPrincipal');
    const adminDash = document.getElementById('roleDashboardAdmin');
    const vpPermissionsBar = document.getElementById('vpPermissionsBar');
    const officePermissionsBar = document.getElementById('officePermissionsBar');
    const metricCardFees = document.getElementById('metricCardFees');
    const metricCardVPDiscipline = document.getElementById('metricCardVPDiscipline');

    if (roleKey === 'admin') {
      if (principalDash) principalDash.style.display = 'none';
      if (adminDash) adminDash.style.display = 'block';
      if (vpPermissionsBar) vpPermissionsBar.style.display = 'none';
      if (officePermissionsBar) officePermissionsBar.style.display = 'block';
    } else if (roleKey === 'vice-principal') {
      if (principalDash) principalDash.style.display = 'block';
      if (adminDash) adminDash.style.display = 'none';
      if (vpPermissionsBar) vpPermissionsBar.style.display = 'block';
      if (officePermissionsBar) officePermissionsBar.style.display = 'none';
      if (metricCardFees) metricCardFees.style.display = 'none';
      if (metricCardVPDiscipline) metricCardVPDiscipline.style.display = 'flex';
    } else { // principal
      if (principalDash) principalDash.style.display = 'block';
      if (adminDash) adminDash.style.display = 'none';
      if (vpPermissionsBar) vpPermissionsBar.style.display = 'none';
      if (officePermissionsBar) officePermissionsBar.style.display = 'none';
      if (metricCardFees) metricCardFees.style.display = 'flex';
      if (metricCardVPDiscipline) metricCardVPDiscipline.style.display = 'none';
    }

    renderExecutiveRestrictionsBanner();

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

    // Apply role-specific navigation access permissions
    applyRolePermissions(roleKey);

    // If currently on a module restricted to the active role, route back to dashboard
    const clerkPerms = getClerkPermissions();
    if (roleKey === 'admin' && !clerkPerms[state.activeModule]) {
      navigateTo('dashboard');
    }

    if (isUserAction) { showToast(`Active Role: ${config.title} (${config.holder})`, "info"); }
  }

  function applyRolePermissions(role) {
    // Sync New Admissions sidebar navigation badge & lock status
    const admissionsNav = document.querySelector('.sidebar-menu .nav-item[data-module="admissions"]');
    const admissionsBadge = document.getElementById('navNewAdmissionBadge');
    if (admissionsNav) {
      if (role === 'admin') {
        const allowed = isOfficeAdmissionAllowed();
        if (admissionsBadge) {
          if (allowed) {
            admissionsBadge.innerHTML = 'Active';
            admissionsBadge.className = 'nav-badge badge-success';
          } else {
            admissionsBadge.innerHTML = '<i class="fa-solid fa-lock"></i> Locked';
            admissionsBadge.className = 'nav-badge warning';
          }
        }
      } else {
        if (admissionsBadge) {
          admissionsBadge.innerHTML = 'New';
          admissionsBadge.className = 'nav-badge pulse';
        }
      }
    }

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

    // Modules restricted for Office / Clerk
    const CLERK_RESTRICTED = ['teachers', 'academics', 'timetable', 'examinations', 'discipline', 'leaves', 'events', 'reports', 'settings'];

    // Granular Submenu & Module Dynamic Visibility for Navigation Bar
    const allNavItems = document.querySelectorAll('.sidebar-menu .nav-item[data-module]');
    const clerkSubPerms = getClerkSubmenuPermissions();
    const isExecutive = (role === 'principal' || role === 'vice-principal');

    allNavItems.forEach(item => {
      const mod = item.getAttribute('data-module');

      // Remove any previous lock badges
      const existingLock = item.querySelector('.nav-lock-badge');
      if (existingLock) existingLock.remove();

      if (isExecutive) {
        // Principal and Vice Principal have 100% unrestricted visibility across ALL modules and submenus
        item.style.display = '';
        item.querySelectorAll('.nav-sub-link').forEach(sub => {
          sub.style.display = '';
        });
      } else if (role === 'admin') {
        if (mod === 'dashboard') {
          item.style.display = '';
        } else if (mod === 'settings') {
          // System settings is reserved exclusively for Executive Leadership (Principal & VP)
          item.style.display = 'none';
        } else {
          const subLinks = item.querySelectorAll('.nav-sub-link');
          let visibleSubCount = 0;

          if (subLinks.length > 0) {
            subLinks.forEach(sub => {
              const subKey = sub.getAttribute('data-sub');
              const permKey = `${mod}.${subKey}`;
              const isAllowed = clerkSubPerms[permKey] === true;
              // STRICTLY HIDDEN UP TO ALLOWING PERMISSION BY PRINCIPAL OR VP!
              sub.style.display = isAllowed ? '' : 'none';
              if (isAllowed) visibleSubCount++;
            });

            // If all submenus in this module are hidden, hide parent module in navigation bar!
            item.style.display = (visibleSubCount > 0) ? '' : 'none';
          } else {
            const isAllowed = clerkSubPerms[mod] === true;
            item.style.display = isAllowed ? '' : 'none';
          }
        }
      }
    });

    // Sync tab strips across modules
    syncTabStripPermissions();

    // Cleanly toggle sidebar section titles if all child items are hidden
    const navSectionTitles = document.querySelectorAll('.sidebar-menu .nav-section-title');
    if (navSectionTitles && navSectionTitles.length >= 2) {
      if (role === 'admin') {
        navSectionTitles[0].textContent = 'OFFICE & DESK MODULES';
        navSectionTitles[1].textContent = 'COMMUNICATION & NOTICES';

        const sec1Mods = ['dashboard', 'students', 'teachers', 'academics', 'attendance', 'timetable', 'examinations', 'discipline', 'leaves', 'fees'];
        const hasSec1Visible = sec1Mods.some(m => {
          if (m === 'dashboard') return true;
          const el = document.querySelector(`.sidebar-menu .nav-item[data-module="${m}"]`);
          return el && el.style.display !== 'none';
        });
        navSectionTitles[0].style.display = hasSec1Visible ? '' : 'none';

        const sec2Mods = ['communication', 'events', 'reports', 'settings'];
        const hasSec2Visible = sec2Mods.some(m => {
          const el = document.querySelector(`.sidebar-menu .nav-item[data-module="${m}"]`);
          return el && el.style.display !== 'none';
        });
        navSectionTitles[1].style.display = hasSec2Visible ? '' : 'none';
      } else {
        navSectionTitles[0].textContent = 'CORE MODULES';
        navSectionTitles[1].textContent = 'ENGAGEMENT & ADMINISTRATION';
        navSectionTitles[0].style.display = '';
        navSectionTitles[1].style.display = '';
      }
    }

    // Filter Office/Clerk Desk Dashboard elements dynamically according to active permissions
    if (role === 'admin') {
      const adminDash = document.getElementById('roleDashboardAdmin');
      if (adminDash) {
        // Fee Counter metric & card
        const feeMetrics = adminDash.querySelectorAll('.metric-card[onclick*="fees"]');
        feeMetrics.forEach(c => c.style.display = (clerkPerms.fees !== false ? '' : 'none'));

        // Admissions & TC metrics & cards
        const studentMetrics = adminDash.querySelectorAll('.metric-card[onclick*="students"]');
        studentMetrics.forEach(c => c.style.display = (clerkPerms.students !== false ? '' : 'none'));

        // Overview stream cards
        adminDash.querySelectorAll('.overview-card').forEach(c => {
          if (c.textContent.includes('Fee Counter') || c.textContent.includes('Receipts')) {
            c.style.display = (clerkPerms.fees !== false ? '' : 'none');
          }
          if (c.textContent.includes('Admissions Processing') || c.textContent.includes('New Admissions')) {
            c.style.display = (clerkPerms.students !== false ? '' : 'none');
          }
        });
      }
    } else if (role === 'principal' || role === 'vice-principal') {
      // Render active executive restrictions banner for Executive leadership
      renderExecutiveRestrictionsBanner();
    }



    if (approvalsCard) {
      const titleBadge = approvalsCard.querySelector('.card-header-badge');
      if (role === 'admin') {
        if (titleBadge) titleBadge.textContent = 'Admin Forwarded';
      } else {
        if (titleBadge) titleBadge.textContent = `${state.pendingApprovalsCount} Requiring Executive Action`;
      }
    }

    // Role-specific Metric 4 & Governance Display
    if (role === 'vice-principal') {
      if (vpPermissionsBar) vpPermissionsBar.style.display = 'block';
      if (officePermissionsBar) officePermissionsBar.style.display = 'none';
      if (metricCardFees) metricCardFees.style.display = 'none';
      if (metricCardVPDiscipline) metricCardVPDiscipline.style.display = 'flex';

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

      if (approvalsCard) {
        const titleBadge = approvalsCard.querySelector('.card-header-badge');
        if (titleBadge) titleBadge.textContent = `${state.pendingApprovalsCount} Requiring VP Action`;
      }

      renderExecutiveRestrictionsBanner();
    } else if (role === 'principal') {
      if (vpPermissionsBar) vpPermissionsBar.style.display = 'none';
      if (officePermissionsBar) officePermissionsBar.style.display = 'none';
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

      if (approvalsCard) {
        const titleBadge = approvalsCard.querySelector('.card-header-badge');
        if (titleBadge) titleBadge.textContent = `${state.pendingApprovalsCount} Requiring Principal Action`;
      }

      renderExecutiveRestrictionsBanner();
    } else if (role === 'admin') {
      // Admin / Office Clerk Mode: Distinct Desk Dashboard & Tailored Options Access
      if (vpPermissionsBar) vpPermissionsBar.style.display = 'none';
      if (officePermissionsBar) officePermissionsBar.style.display = 'block';

      if (metricCardFees) metricCardFees.style.display = 'flex';
      if (metricCardVPDiscipline) metricCardVPDiscipline.style.display = 'none';

      // Fee Counter is fully enabled for Clerk
      if (feesLimitedBanner) feesLimitedBanner.style.display = 'none';
      if (sidebarFeesBadge) sidebarFeesBadge.style.display = 'none';
      if (collectFeeBtn) {
        collectFeeBtn.disabled = false;
        collectFeeBtn.style.opacity = '1';
        collectFeeBtn.title = 'Open Fee Collection Counter';
      }

      // Settings locked for clerk
      if (settingsLockedBanner) settingsLockedBanner.style.display = 'flex';
      if (settingsFormCard) settingsFormCard.classList.add('perm-locked');
      if (saveSettingsBtn) {
        saveSettingsBtn.disabled = true;
        saveSettingsBtn.style.opacity = '0.5';
        saveSettingsBtn.title = 'Institutional settings locked (Executive Authorization Required)';
      }
    }
  }

  function getDefaultSubTab(moduleKey) {
    const map = {
      students: 'all',
      teachers: 'faculty',
      academics: 'classes',
      attendance: 'student',
      timetable: 'master',
      examinations: 'schedule',
      examination: 'schedule',
      discipline: 'all',
      leaves: 'faculty',
      fees: 'collection',
      communication: 'announcements',
      events: 'calendar',
      reports: 'academic',
      settings: 'profile'
    };
    return map[moduleKey] || 'all';
  }

  function navigateTo(moduleKey, subKey) {
    const isClerk = (state.currentRole === 'admin');
    const clerkPerms = getClerkPermissions();
    const isRestrictedForClerk = isClerk && !clerkPerms[moduleKey];

    if (isClerk && moduleKey !== 'dashboard' && clerkPerms[moduleKey] === false) {
      showToast(`Module '${moduleKey}' is turned off for Office/Clerk by Principal & Vice Principal.`, 'error');
      if (state.activeModule !== 'dashboard') {
        navigateTo('dashboard');
      }
      return;
    }

    const targetView = document.getElementById(`view-${moduleKey}`);
    if (!targetView) return;

    state.activeModule = moduleKey;

    try {
      sessionStorage.setItem('sv_mgmt_last_module', moduleKey);
      localStorage.setItem('sv_mgmt_last_module', moduleKey);
      if (subKey) {
        sessionStorage.setItem('sv_mgmt_last_sub', subKey);
        localStorage.setItem('sv_mgmt_last_sub', subKey);
      }
      const targetHash = subKey ? `${moduleKey}-${subKey}` : moduleKey;
      if (window.location.hash.replace('#', '') !== targetHash) {
        history.replaceState(null, '', '#' + targetHash);
      }
    } catch (e) {}

    // Update sidebar active class
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      if (item.getAttribute('data-module') === moduleKey) {
        item.classList.add('active');
        if (item.querySelector('.nav-sub')) {
          item.classList.add('open');
        }
      } else {
        item.classList.remove('active');
        item.classList.remove('open');
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

    // Auto-switch to default or requested sub-tab
    const activeSub = subKey || state.activeSubTab[moduleKey] || getDefaultSubTab(moduleKey);
    handleClerkModuleAccess(moduleKey, isRestrictedForClerk);
    if (!isRestrictedForClerk) {
      switchSubTab(moduleKey, activeSub);
    }
  }

  function switchSubTab(moduleKey, subKey) {
    if (!subKey) subKey = getDefaultSubTab(moduleKey);
    state.activeSubTab[moduleKey] = subKey;
    const moduleSection = document.getElementById(`view-${moduleKey}`);
    if (!moduleSection) return;

    // 1. Toggle active class on all tab-strip buttons in this module
    const tabStrip = moduleSection.querySelector('.tab-strip');
    if (tabStrip) {
      const buttons = tabStrip.querySelectorAll('.tab-btn');
      buttons.forEach(btn => {
        const btnSub = btn.getAttribute('data-sub');
        if (btnSub === subKey || (!btnSub && btn.textContent && btn.textContent.toLowerCase().includes(subKey.toLowerCase()))) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }

    // 2. Universal subview switching across ALL modules
    const allSubviews = moduleSection.querySelectorAll(`[id^="subview-"], .${moduleKey}-subview, .${moduleKey.slice(0, -1)}-subview, .student-subview, .teacher-subview, .academic-subview, .attendance-subview, .timetable-subview, .examination-subview, .discipline-subview, .leaves-subview, .fees-subview, .communication-subview`);
    if (allSubviews.length > 0) {
      let matchedAny = false;
      allSubviews.forEach(sv => {
        const targetId = `subview-${moduleKey}-${subKey}`;
        const isMatch = (sv.id === targetId) || (sv.getAttribute('data-subview') === subKey);
        if (isMatch) {
          sv.style.display = 'block';
          sv.classList.add('active');
          matchedAny = true;
        } else {
          sv.style.display = 'none';
          sv.classList.remove('active');
        }
      });
      // Fallback: if no specific subview matched, ensure the first subview is displayed
      if (!matchedAny && allSubviews[0]) {
        allSubviews[0].style.display = 'block';
        allSubviews[0].classList.add('active');
      }
    }

    // 3. Module-specific dynamic content loaders
    if (moduleKey === 'students') {
      if ((!state.students || state.students.length === 0) && typeof window !== 'undefined' && Array.isArray(window.STUDENT_ROSTER) && window.STUDENT_ROSTER.length > 0) {
        state.students = window.STUDENT_ROSTER;
      }
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
    } else if (moduleKey === 'examinations' || moduleKey === 'examination') {
      if (subKey === 'schedule') {
        renderExamScheduleTable();
      } else if (subKey === 'duties' || subKey === 'invigilation') {
        renderInvigilationDutyTable();
      } else if (subKey === 'halls') {
        const hallVal = document.getElementById('examHallSelector')?.value || 'Hall 1';
        renderRoomSeatingArrangement(hallVal);
      } else if (subKey === 'results') {
        const clsVal = document.getElementById('tabulationClassFilter')?.value || 'Class X-A';
        renderTabulationRegisters(clsVal);
      } else if (subKey === 'papers') {
        renderOfficialQuestionPaper();
      }
    } else if (moduleKey === 'discipline') {
      if (subKey === 'all') {
        renderDisciplineIncidents(state.disciplineIncidents);
      } else if (subKey === 'late') {
        renderGateLateComing();
      } else if (subKey === 'merit') {
        renderMeritAwards();
      } else if (subKey === 'summons') {
        renderParentConvocations();
      }
    } else if (moduleKey === 'teachers') {
      if (subKey === 'faculty') {
        renderStaffGrid(state.faculty);
      } else if (subKey === 'staff') {
        renderNonTeachingStaff();
      } else if (subKey === 'attendance') {
        renderStaffAttendanceTable();
      } else if (subKey === 'leave') {
        renderTeacherLeaveRequests();
      } else if (subKey === 'performance') {
        renderFacultyAppraisals();
      } else if (subKey === 'import') {
        renderStaffImportPreview();
      }
    } else if (moduleKey === 'events') {
      if (subKey === 'calendar') {
        renderEvents(state.events);
      } else if (subKey === 'school') {
        renderSchoolEvents();
      } else if (subKey === 'competitions') {
        renderCompetitionEvents();
      } else if (subKey === 'activities') {
        renderClubActivities();
      }
    } else if (moduleKey === 'leaves') {
      if (subKey === 'faculty') {
        renderVPLeaves(state.facultyLeaves);
      } else if (subKey === 'students') {
        renderStudentLeaves();
      } else if (subKey === 'history') {
        renderStaffLeaveBalances();
      }
    } else if (moduleKey === 'academics') {
      if (subKey === 'classes') {
        renderAcademicClasses();
      } else if (subKey === 'subjects') {
        renderAcademicSubjects();
      } else if (subKey === 'timetable') {
        renderMasterTimetable();
      } else if (subKey === 'exams') {
        renderExamsSchedule();
      } else if (subKey === 'results') {
        renderResultsAndGrading();
      } else if (subKey === 'reports') {
        renderAcademicReports();
      }
    } else if (moduleKey === 'attendance') {
      if (subKey === 'student') {
        renderAttendanceClasses(state.classAttendance);
      } else if (subKey === 'teacher') {
        renderAttendanceTeachers();
      } else if (subKey === 'daily') {
        renderAttendanceAbsentees();
      } else if (subKey === 'monthly') {
        renderAttendanceMonthly();
      }
    } else if (moduleKey === 'timetable') {
      if (subKey === 'master') {
        renderMasterTimetable();
      } else if (subKey === 'substitutions') {
        renderDailySubstitution();
      } else if (subKey === 'rooms') {
        renderScienceLabs();
      }
    } else if (moduleKey === 'fees') {
      if (subKey === 'collection') {
        renderFeeTransactions(state.feeTransactions);
        initFeeCharts();
      } else if (subKey === 'pending') {
        renderDefaultersTable();
      } else if (subKey === 'reports') {
        renderFeeCategoryAuditTable();
        renderClassFeeRealizationMatrix();
        initFeeReportsCharts();
      } else if (subKey === 'transactions') {
        renderFeeLedgerTable();
      }
    } else if (moduleKey === 'communication') {
      if (subKey === 'announcements') {
        renderBroadcastFeed();
      } else if (subKey === 'notices') {
        renderCircularsTable();
      } else if (subKey === 'sms') {
        renderSmsLogsTable();
      } else if (subKey === 'email') {
        renderEmailLogsTable();
      } else if (subKey === 'push') {
        renderPushLogsTable();
      }
    } else if (moduleKey === 'settings') {
      if (subKey === 'permissions') {
        renderClerkPermissionsForm();
        renderSettingsAdmissionPermissionCard();
        initTeacherPermissionsView();
      }
    }

    // 4. Sync sidebar sub-link active state
    const sidebarSubLinks = document.querySelectorAll(`.nav-item[data-module="${moduleKey}"] .nav-sub-link`);
    sidebarSubLinks.forEach(link => {
      if (link.getAttribute('data-sub') === subKey) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // 5. Ensure parent nav-item stays open
    const parentNavItem = document.querySelector(`.nav-item[data-module="${moduleKey}"]`);
    if (parentNavItem && parentNavItem.querySelector('.nav-sub')) {
      parentNavItem.classList.add('open');
    }

    // showToast(`Switched view to ${moduleKey} → ${subKey}`, 'info');
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
    // Sri Vidya Subview Initial Pre-population
    renderStudentLeaves();
    renderStaffLeaveBalances();
    renderNonTeachingStaff();
    renderTeacherLeaveRequests();
    renderFeeTransactions(state.feeTransactions);
    renderDefaultersTable();
    renderFeeLedgerTable();
    renderFeeCategoryAuditTable();
    renderClassFeeRealizationMatrix();
    initFeeCharts();
    initFeeReportsCharts();
    renderStaffImportPreview();
    renderSchoolEvents();
    renderCompetitionEvents();
    renderClubActivities();
    renderAcademicClasses();
    renderAcademicSubjects();
    renderExamsSchedule();
    renderResultsAndGrading();
    renderAcademicReports();
    renderAttendanceTeachers();
    renderAttendanceAbsentees();
    renderAttendanceMonthly();
    renderMasterTimetable();
    renderDailySubstitution();
    renderScienceLabs();
    renderDefaultersTable();
    renderFeeLedgerTable();
    renderBroadcastFeed();
    renderCircularsTable();
    renderSmsLogsTable();
    renderEmailLogsTable();
    renderPushLogsTable();
    renderClerkPermissionsForm();
  }

  // Helpers for sequential admission numbers & Section A enforcement
    // Safe deduplication of student records by Admission Number
  function deduplicateStudents(arr) {
    if (!Array.isArray(arr)) return [];
    const seenAdm = new Set();
    const result = [];
    for (let i = 0; i < arr.length; i++) {
      const s = arr[i];
      if (!s) continue;
      const key = (s.admNo || '').trim().toUpperCase();
      if (key && seenAdm.has(key)) continue;
      if (key) seenAdm.add(key);
      result.push(s);
    }
    return result;
  }

  function sortStudentsByAdmNo(arr) {
    return deduplicateStudents([...arr]).sort((a, b) => a.admNo.localeCompare(b.admNo, undefined, { numeric: true, sensitivity: 'base' }));
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
  // ── Pagination state for All Students table ─────────────────────────────
  var studentPage = { current: 1, pageSize: 50, filteredList: [] };


  function renderStudentsTable(list) {
    // Store the full filtered list and reset to page 1
    studentPage.filteredList = sortStudentsByAdmNo(deduplicateStudents(list));
    studentPage.current = 1;
    renderStudentsPage();
  }

  function renderStudentsPage() {
    const tbody = document.getElementById('studentsTableBody');
    if (!tbody) return;

    const sorted = studentPage.filteredList;
    const total  = sorted.length;
    const ps     = studentPage.pageSize;
    const page   = studentPage.current;
    const start  = (page - 1) * ps;
    const end    = Math.min(start + ps, total);
    const slice  = sorted.slice(start, end);

    // Update counters
    const showingEl = document.getElementById('studentShowingCount');
    if (showingEl) showingEl.textContent = total;
    const totalEl = document.getElementById('studentTotalCount');
    if (totalEl) totalEl.textContent = state.students.length;
    const allBadge = document.getElementById('allStudentsCountBadge');
    if (allBadge) allBadge.textContent = total;

    if (total === 0) {
      tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding: 2.5rem; color: var(--color-text-muted);"><i class="fa-solid fa-user-slash" style="font-size: 1.5rem; margin-bottom: 0.5rem; display:block;"></i>No student records matched your search query.</td></tr>`;
      renderPaginationBar(0, 0, 0);
      return;
    }

    tbody.innerHTML = slice.map(student => {
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
              <button class="action-icon-btn" onclick="portalApp.showToast('Generating ID card for ${student.name}', 'info')" title="Print Documents">
                <i class="fa-solid fa-print"></i>
              </button>
              <button class="action-icon-btn action-icon-btn-delete" onclick="portalApp.handleStudentDeleteClick('${student.admNo}')" style="color: #ef4444;" title="Permanently Delete (Principal/VP Only)">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    renderPaginationBar(page, Math.ceil(total / ps), total);
  }

  function renderPaginationBar(currentPage, totalPages, totalRecords) {
    const bar = document.getElementById('studentPaginationBar');
    if (!bar) return;
    if (totalPages <= 1) { bar.innerHTML = ''; return; }

    const ps    = studentPage.pageSize;
    const start = (currentPage - 1) * ps + 1;
    const end   = Math.min(currentPage * ps, totalRecords);

    let html = `<div class="pag-info">Showing <strong>${start}–${end}</strong> of <strong>${totalRecords}</strong> students &nbsp;|&nbsp; Page ${currentPage} of ${totalPages}</div><div class="pag-controls">`;

    html += `<button class="pag-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="portalApp.goToStudentPage(${currentPage - 1})"><i class="fa-solid fa-chevron-left"></i> Prev</button>`;

    const windowStart = Math.max(1, currentPage - 2);
    const windowEnd   = Math.min(totalPages, currentPage + 2);
    if (windowStart > 1)  html += `<button class="pag-btn" onclick="portalApp.goToStudentPage(1)">1</button>`;
    if (windowStart > 2)  html += `<span class="pag-ellipsis">…</span>`;
    for (let p = windowStart; p <= windowEnd; p++) {
      html += `<button class="pag-btn ${p === currentPage ? 'pag-btn-active' : ''}" onclick="portalApp.goToStudentPage(${p})">${p}</button>`;
    }
    if (windowEnd < totalPages - 1) html += `<span class="pag-ellipsis">…</span>`;
    if (windowEnd < totalPages)     html += `<button class="pag-btn" onclick="portalApp.goToStudentPage(${totalPages})">${totalPages}</button>`;

    html += `<button class="pag-btn" ${currentPage === totalPages ? 'disabled' : ''} onclick="portalApp.goToStudentPage(${currentPage + 1})">Next <i class="fa-solid fa-chevron-right"></i></button>`;
    html += `</div>`;
    bar.innerHTML = html;
  }

  function goToStudentPage(page) {
    const totalPages = Math.ceil(studentPage.filteredList.length / studentPage.pageSize);
    if (page < 1 || page > totalPages) return;
    studentPage.current = page;
    renderStudentsPage();
    const tableEl = document.getElementById('studentsTable');
    if (tableEl) tableEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }



  function filterStudents() {
    state.students = deduplicateStudents(state.students);
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

    const profSearch = document.getElementById('profileSearchInput');
    const profClass = document.getElementById('profileClassFilter');
    if (profSearch) profSearch.value = '';
    if (profClass) profClass.value = '';

    renderStudentsTable(state.students);
    renderStudentProfiles(state.students);
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

  // ==========================================================================
  // Respective Class Teachers Register & Direct Student Auto-Enrollment Module
  // ==========================================================================
  const CLASS_TEACHERS = {
    'X': { name: 'Sri Ch. Ramesh', code: '10A', subject: 'Mathematics & Board Prep', phone: '9848011001', room: 'Room 301 (3rd Floor)' },
    'IX': { name: 'Sri P. Venkat', code: '9A', subject: 'Physical Science', phone: '9848011002', room: 'Room 302 (3rd Floor)' },
    'VIII': { name: 'Ms. Anjali', code: '8A', subject: 'Mathematics (Grade 8A)', phone: '9848011003', room: 'Room 204 (2nd Floor)' },
    'VII': { name: 'Smt. S. Lakshmi', code: '7A', subject: 'Social Studies', phone: '9848011004', room: 'Room 205 (2nd Floor)' },
    'VI': { name: 'Sri M. Satish', code: '6A', subject: 'General Science', phone: '9848011005', room: 'Room 206 (2nd Floor)' },
    'V': { name: 'Smt. K. Sunitha', code: '5A', subject: 'English & Primary Lang', phone: '9848011006', room: 'Room 101 (1st Floor)' },
    'IV': { name: 'Smt. P. Madhavi', code: '4A', subject: 'Mathematics', phone: '9848011007', room: 'Room 102 (1st Floor)' },
    'III': { name: 'Smt. R. Padmavathi', code: '3A', subject: 'Environmental Studies', phone: '9848011008', room: 'Room 103 (1st Floor)' },
    'II': { name: 'Smt. T. Sarada', code: '2A', subject: 'Telugu & English', phone: '9848011009', room: 'Room 104 (1st Floor)' },
    'I': { name: 'Smt. V. Durga', code: '1A', subject: 'Primary Education', phone: '9848011010', room: 'Room 105 (1st Floor)' },
    'PP': { name: 'Smt. G. Swarna', code: 'PPA', subject: 'Early Childhood Care', phone: '9848011011', room: 'Kindergarten Wing' },
  };

  function normalizeClassKey(rawClass) {
    if (!rawClass) return 'I';
    let str = String(rawClass).toUpperCase().replace(/CLASS/i, '').replace(/GRADE/i, '').replace(/TH|ST|ND|RD/g, '').trim();
    if (str === '10' || str === 'X') return 'X';
    if (str === '9' || str === 'IX') return 'IX';
    if (str === '8' || str === 'VIII') return 'VIII';
    if (str === '7' || str === 'VII') return 'VII';
    if (str === '6' || str === 'VI') return 'VI';
    if (str === '5' || str === 'V') return 'V';
    if (str === '4' || str === 'IV') return 'IV';
    if (str === '3' || str === 'III') return 'III';
    if (str === '2' || str === 'II') return 'II';
    if (str === '1' || str === 'I') return 'I';
    if (str.includes('KG') || str.includes('NURSERY') || str.includes('PP') || str.includes('PRE')) return 'PP';
    return str || 'I';
  }

  function enrollApprovedStudent(applicant) {
    if (!applicant) return null;
    const targetClass = normalizeClassKey(applicant.class || applicant.grade);
    const teacherInfo = CLASS_TEACHERS[targetClass] || { name: 'Smt. K. Sunitha', code: '5A', subject: 'General', phone: '9848011006', room: 'Staff Room' };

    // Initialize state.students if empty
    if ((!state.students || state.students.length === 0) && typeof window !== 'undefined' && Array.isArray(window.STUDENT_ROSTER)) {
      state.students = [...window.STUDENT_ROSTER];
    }
    if (!Array.isArray(state.students)) state.students = [];

    const studentName = (applicant.name || applicant.studentName || 'Student').trim();
    let existing = state.students.find(s => 
      (applicant.enrolledAdmNo && s.admNo === applicant.enrolledAdmNo) ||
      (applicant.appId && s.admissionAppId === applicant.appId) ||
      (s.name.toLowerCase().trim() === studentName.toLowerCase().trim() && s.class === targetClass)
    );

    if (existing) {
      applicant.enrolled = true;
      applicant.enrolledAdmNo = existing.admNo;
      applicant.enrolledClass = `Class ${existing.class}-${existing.section || 'A'}`;
      applicant.rollNo = existing.rollNo;
      applicant.assignedTeacher = existing.classTeacher || teacherInfo.name;
      applicant.assignedTeacherPhone = existing.classTeacherPhone || teacherInfo.phone;
      applicant.assignedTeacherRoom = existing.room || teacherInfo.room;
      return existing;
    }

    let admNo = existing ? existing.admNo : (applicant.enrolledAdmNo || null);
    if (!admNo) {
      let maxNum = 500;
      const highestStored = parseInt(localStorage.getItem('sv_highest_adm_no') || '500', 10);
      if (!isNaN(highestStored) && highestStored > maxNum) maxNum = highestStored;

      state.students.forEach(s => {
        if (s.admNo && s.admNo.startsWith('SV-')) {
          const n = parseInt(s.admNo.replace('SV-', ''), 10);
          if (!isNaN(n) && n > maxNum) maxNum = n;
        }
      });

      const deletedArchive = JSON.parse(localStorage.getItem('sv_deleted_students_archive') || '[]');
      deletedArchive.forEach(d => {
        if (d.admNo && d.admNo.startsWith('SV-')) {
          const n = parseInt(d.admNo.replace('SV-', ''), 10);
          if (!isNaN(n) && n > maxNum) maxNum = n;
        }
      });

      maxNum++;
      localStorage.setItem('sv_highest_adm_no', String(maxNum));
      admNo = 'SV-' + String(maxNum).padStart(4, '0');
    }

    let rollNo = existing ? existing.rollNo : null;
    if (!rollNo) {
      let maxRoll = 0;
      state.students.forEach(s => {
        if (s.class === targetClass) {
          const r = parseInt(s.rollNo, 10);
          if (!isNaN(r) && r > maxRoll) maxRoll = r;
        }
      });
      const baseRolls = { 'X': 1001, 'IX': 901, 'VIII': 801, 'VII': 701, 'VI': 601, 'V': 501, 'IV': 401, 'III': 301, 'II': 201, 'I': 101, 'PP': 1 };
      rollNo = String(maxRoll ? maxRoll + 1 : (baseRolls[targetClass] || 101));
    }

    if (!existing) {
      existing = {
        admNo: admNo,
        name: studentName,
        gender: (applicant.gender || 'male').toLowerCase(),
        class: targetClass,
        section: 'A',
        rollNo: rollNo,
        parent: applicant.parent || applicant.parentName || 'Parent',
        phone: applicant.phone || '—',
        email: applicant.email || '—',
        attendance: '100%',
        feeStatus: 'Pending',
        gpa: '—',
        bloodGroup: applicant.bloodGroup || 'B+',
        dob: applicant.dob || '2015-05-15',
        address: applicant.address || 'Rajam, Srikakulam',
        enrolledAt: new Date().toISOString(),
        admissionAppId: applicant.appId,
        classTeacher: teacherInfo.name,
        classTeacherPhone: teacherInfo.phone,
        room: teacherInfo.room
      };
      // Add once to state.students and deduplicate
      state.students.unshift(existing);
      if (typeof window !== 'undefined' && Array.isArray(window.STUDENT_ROSTER) && window.STUDENT_ROSTER !== state.students) {
        if (!window.STUDENT_ROSTER.some(s => s.admNo === existing.admNo)) {
          window.STUDENT_ROSTER.unshift(existing);
        }
      }
      state.students = deduplicateStudents(state.students);
    }

    // Persist enrolled students in localStorage
    try {
      const storedEnrolled = JSON.parse(localStorage.getItem('sv_enrolled_students') || '[]');
      if (!storedEnrolled.some(s => s.admNo === existing.admNo)) {
        storedEnrolled.unshift(existing);
        localStorage.setItem('sv_enrolled_students', JSON.stringify(storedEnrolled));
      }
    } catch (e) {}

    // Dispatch to Class Teacher Inbox & Roster
    try {
      const teacherAdmissions = JSON.parse(localStorage.getItem('sv_teacher_new_admissions') || '[]');
      const teacherEntry = {
        appId: applicant.appId,
        admNo: admNo,
        studentName: studentName,
        class: targetClass,
        classCode: teacherInfo.code,
        section: 'A',
        rollNo: rollNo,
        classTeacher: teacherInfo.name,
        parent: applicant.parent || applicant.parentName,
        phone: applicant.phone,
        enrolledAt: new Date().toISOString()
      };
      const tIdx = teacherAdmissions.findIndex(t => t.appId === applicant.appId);
      if (tIdx !== -1) {
        teacherAdmissions[tIdx] = teacherEntry;
      } else {
        teacherAdmissions.unshift(teacherEntry);
      }
      localStorage.setItem('sv_teacher_new_admissions', JSON.stringify(teacherAdmissions));
    } catch (e) {}

    // Attach student & teacher details to applicant admission record
    applicant.enrolled = true;
    applicant.enrolledAdmNo = admNo;
    applicant.enrolledClass = `Class ${targetClass}-A`;
    applicant.rollNo = rollNo;
    applicant.assignedTeacher = teacherInfo.name;
    applicant.assignedTeacherPhone = teacherInfo.phone;
    applicant.assignedTeacherRoom = teacherInfo.room;

    // Refresh student directory count badges
    const profileCountBadge = document.getElementById('studentProfilesCountBadge');
    if (profileCountBadge) profileCountBadge.textContent = state.students.length;
    const profilesShowingCount = document.getElementById('profilesShowingCount');
    if (profilesShowingCount) profilesShowingCount.textContent = state.students.length;
    const totalStudentsMetric = document.getElementById('dashTotalStudentsMetric');
    if (totalStudentsMetric) totalStudentsMetric.textContent = state.students.length;

    return existing;
  }

  // Sort Admissions in descending order: latest application (newest submission / highest sequence ID) at the top
  function sortAdmissionsDescending(list) {
    if (!Array.isArray(list)) return [];
    return list.slice().sort((a, b) => {
      const timeA = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
      const timeB = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
      if (timeA && timeB && timeA !== timeB) {
        return timeB - timeA;
      }
      const idA = String(a.appId || a.applicationNumber || '');
      const idB = String(b.appId || b.applicationNumber || '');
      return idB.localeCompare(idA, undefined, { numeric: true, sensitivity: 'base' });
    });
  }

  // Synchronization of Online Admissions from localStorage & shared ecosystem
  function syncAdmissionsFromStorage() {
    try {
      const stored = localStorage.getItem('sv_applications');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Self-heal: If any stored applicant mistakenly received 'SV202600001' due to early sequence reset,
          // reassign them to SV202600007 (or higher) to keep K. Sai Tharun as the legitimate base SV202600001.
          let healed = false;
          parsed.forEach(item => {
            const student = (item.studentName || item.name || '').trim();
            if ((item.appId === 'SV202600001' || item.applicationNumber === 'SV202600001') && student && !student.toLowerCase().includes('sai tharun')) {
              item.appId = 'SV202600007';
              item.applicationNumber = 'SV202600007';
              healed = true;
            }
          });
          if (healed) {
            localStorage.setItem('sv_applications', JSON.stringify(parsed));
          }

          const mapped = parsed.map(item => ({
            appId: item.appId || item.applicationNumber || 'SV202600000',
            name: item.name || item.studentName || 'Student Applicant',
            studentName: item.studentName || item.name || 'Student Applicant',
            dob: item.dob || '—',
            gender: item.gender || '—',
            class: item.class || (item.grade ? item.grade.replace(/class/i, '').trim() : 'I'),
            grade: item.grade || `Class ${item.class || 'I'}`,
            prevSchool: item.prevSchool || 'Fresh Admission',
            parent: item.parent || item.parentName || 'Parent / Guardian',
            parentName: item.parentName || item.parent || 'Parent / Guardian',
            phone: item.phone || '—',
            email: item.email || '—',
            address: item.address || '—',
            score: item.score || 'Awaiting Entrance / Direct Admission',
            docStatus: item.docStatus || 'Documents Submitted Online',
            status: item.status || 'Pending Principal / VP Verification',
            submissionDate: item.submissionDate || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            submissionTime: item.submissionTime || '',
            submittedAt: item.submittedAt || null
          }));

          // Merge without duplicate appIds
          const seen = new Set();
          const merged = [];
          mapped.forEach(item => {
            if (!seen.has(item.appId)) {
              seen.add(item.appId);
              merged.push(item);
            }
          });
          state.admissions.forEach(item => {
            if (!seen.has(item.appId)) {
              seen.add(item.appId);
              merged.push(item);
            }
          });
          state.admissions = sortAdmissionsDescending(merged);
        }
      } else {
        localStorage.setItem('sv_applications', JSON.stringify(state.admissions));
      }
    } catch (e) {
      console.warn('Error syncing admissions from storage:', e);
    }
  }

  // Permission Verification: Check if Office Members (admin/clerk) are allowed to view Admissions
  function isOfficeAdmissionAllowed() {
    try {
      const perm = localStorage.getItem('sv_office_admission_permission');
      if (perm !== null) {
        return perm === 'true';
      }
    } catch (e) {}
    return false; // Default: restricted until Principal or VP grants clearance
  }

  // Render Permission Controls Banner (Principal / VP view) and Active Clearance (Office view)
  function renderOfficePermissionControls() {
    // Permission toggle controls belong strictly in Settings -> Access Permissions!
    const container = document.getElementById('officeAdmissionPermControl');
    if (container) {
      container.style.display = 'none';
      container.innerHTML = '';
    }

    renderSettingsAdmissionPermissionCard();
  }

  function renderSettingsAdmissionPermissionCard() {
    const box = document.getElementById('settingsOfficeAdmissionPermBox');
    if (!box) return;

    const role = state.currentRole;
    const isExecutive = (role === 'principal' || role === 'vice-principal');
    const allowed = isOfficeAdmissionAllowed();

    let meta = {};
    try {
      meta = JSON.parse(localStorage.getItem('sv_office_admission_permission_meta') || '{}');
    } catch (e) {}

    box.innerHTML = `
      <div style="background: linear-gradient(135deg, rgba(30, 58, 138, 0.05) 0%, rgba(59, 130, 246, 0.08) 100%); border: 1.5px solid ${allowed ? '#10B981' : '#F59E0B'}; border-radius: 12px; padding: 1.25rem 1.5rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1.25rem; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
        <div style="display: flex; align-items: center; gap: 1.15rem; flex: 1; min-width: 290px;">
          <div style="width: 50px; height: 50px; border-radius: 12px; background: ${allowed ? '#10B981' : '#F59E0B'}; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; flex-shrink: 0; box-shadow: 0 4px 12px ${allowed ? 'rgba(16,185,129,0.35)' : 'rgba(245,158,11,0.35)'};">
            <i class="fa-solid ${allowed ? 'fa-shield-halved' : 'fa-lock'}"></i>
          </div>
          <div>
            <div style="display: flex; align-items: center; gap: 0.65rem; margin-bottom: 0.25rem; flex-wrap: wrap;">
              <h4 style="margin: 0; font-size: 1.05rem; font-weight: 800; color: var(--color-text-dark);">
                Office Members Admission Desk Permission
              </h4>
              <span class="portal-badge ${allowed ? 'badge-success' : 'badge-warning'}" style="font-size: 0.78rem; text-transform: uppercase; font-weight: 700; padding: 0.2rem 0.65rem;">
                ${allowed ? '✓ Permission Granted' : '🔒 Access Restricted'}
              </span>
            </div>
            <p style="margin: 0; font-size: 0.85rem; color: var(--color-text-muted); line-height: 1.45;">
              ${allowed 
                ? `Office Administrator & Clerk accounts currently have executive authorization to access the Admissions Queue and student applicant files. ${meta.grantedBy ? `<strong>(Authorized by ${meta.grantedBy} on ${meta.grantedAt})</strong>` : ''}`
                : 'Office Administrator and Clerk are currently blocked from viewing student admission applications. Only Principal and Vice Principal have active clearance.'}
            </p>
          </div>
        </div>
        <div>
          ${isExecutive ? `
            <button type="button" class="btn ${allowed ? 'btn-secondary' : 'btn-primary'}" onclick="portalApp.toggleOfficeAdmissionPermission()" style="font-weight: 700; font-size: 0.88rem; padding: 0.65rem 1.3rem;">
              <i class="fa-solid ${allowed ? 'fa-ban' : 'fa-key'}"></i>
              ${allowed ? 'Revoke Office Staff Access' : 'Grant Office Staff Permission'}
            </button>
          ` : `
            <span class="portal-badge badge-warning text-xs"><i class="fa-solid fa-lock"></i> Executive Authority Only (Principal / VP)</span>
          `}
        </div>
      </div>
    `;
  }

  // Toggle Office Staff Admission Permission by Principal or Vice Principal
  function toggleOfficeAdmissionPermission() {
    const current = isOfficeAdmissionAllowed();
    const next = !current;
    const role = state.currentRole;
    const roleName = role === 'vice-principal' ? 'Vice Principal Sri Navva Anand' : 'Principal Smt. Gorle Varalakshmi';

    try {
      localStorage.setItem('sv_office_admission_permission', next ? 'true' : 'false');
      const meta = {
        grantedBy: roleName,
        grantedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
      };
      localStorage.setItem('sv_office_admission_permission_meta', JSON.stringify(meta));
      
      // Update Clerk permissions dictionary
      if (typeof getClerkPermissions === 'function' && typeof saveClerkPermissions === 'function') {
        renderSettingsAdmissionPermissionCard();
    const perms = getClerkPermissions();
        perms.students = next;
        saveClerkPermissions(perms);
      }
    } catch (e) {}

    renderOfficePermissionControls();
    renderAdmissionsQueue(state.admissions);

    const actor = role === 'vice-principal' ? 'Vice Principal' : 'Principal';
    if (next) {
      showToast(`Office staff members have been GRANTED permission to view New Admissions by ${actor}!`, 'success');
    } else {
      showToast(`Office staff members permission to view New Admissions has been REVOKED by ${actor}.`, 'warning');
    }
  }

  // Request Access from Principal / Vice Principal by Office Staff
  function requestOfficeAdmissionPermission() {
    showToast('Permission request dispatched to Principal (Smt. Gorle Varalakshmi) and Vice Principal (Sri Navva Anand)!', 'info');
  }

  // Admissions Queue Subview
  function renderAdmissionsQueue(list) {
    list = list || state.admissions || [];
    list = sortAdmissionsDescending(list);

    // Update all admission count badges across the portal
    const countBadge = document.getElementById('admissionsCountBadge');
    if (countBadge) countBadge.textContent = list.length;

    const sidebarBadge = document.getElementById('navNewAdmissionBadge');
    if (sidebarBadge) sidebarBadge.textContent = `${list.length} New`;

    const navSubBadge = document.querySelector('.nav-sub-link[data-sub="admissions"] .nav-sub-badge');
    if (navSubBadge) navSubBadge.textContent = `${list.length} New`;

    const statCount = document.getElementById('admQueueStatCount');
    if (statCount) statCount.textContent = list.length;

    renderOfficePermissionControls();

    const isOffice = (state.currentRole === 'admin');
    const isAllowed = !isOffice || isOfficeAdmissionAllowed();

    const restrictedBox = document.getElementById('officeAdmissionsRestrictedCard');
    const tableContainer = document.getElementById('admissionsTableContainer') || (document.getElementById('admissionsTable') ? document.getElementById('admissionsTable').closest('.table-container') : null);
    const statsBar = document.querySelector('#subview-students-admissions .admissions-overview-bar');

    if (!isAllowed) {
      if (restrictedBox) restrictedBox.style.display = 'block';
      if (tableContainer) tableContainer.style.display = 'none';
      if (statsBar) statsBar.style.display = 'none';
      return;
    }

    if (restrictedBox) restrictedBox.style.display = 'none';
    if (tableContainer) tableContainer.style.display = 'block';
    if (statsBar) statsBar.style.display = 'grid';

    const tbody = document.getElementById('admissionsTableBody');
    if (!tbody) return;

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding: 2.5rem; color: var(--color-text-muted);"><i class="fa-solid fa-circle-check text-emerald" style="font-size: 1.5rem; margin-bottom: 0.5rem; display:block;"></i>All admissions applications have been processed and confirmed.</td></tr>`;
      return;
    }

    tbody.innerHTML = list.map(item => {
      const isApproved = (item.status || '').toLowerCase().includes('approved');
      if (isApproved && !item.enrolled) {
        enrollApprovedStudent(item);
      }
      const targetClassKey = normalizeClassKey(item.class || item.grade);
      const teacherInfo = CLASS_TEACHERS[targetClassKey] || { name: 'Smt. K. Sunitha', code: '5A', room: 'Staff Room' };

      return `
      <tr id="adm-row-${item.appId}">
        <td>
          <strong class="text-primary" style="font-family:monospace; font-size: 0.95rem; letter-spacing:0.3px;">${item.appId}</strong>
          <div style="font-size: 0.75rem; color: var(--color-text-muted); margin-top: 0.15rem;">${item.submissionDate || ''} ${item.submissionTime || ''}</div>
        </td>
        <td>
          <div class="user-cell">
            <div class="cell-avatar" style="background:var(--color-primary); color:#fff; font-weight:700;">${(item.name || item.studentName || 'S').charAt(0)}</div>
            <div>
              <strong style="color:var(--color-text-dark);">${item.name || item.studentName}</strong>
              <div style="font-size: 0.78rem; color: var(--color-text-muted);">
                ${item.gender ? `<span>${item.gender}</span> • ` : ''}DOB: ${item.dob || '—'}
              </div>
            </div>
          </div>
        </td>
        <td><strong class="portal-badge badge-primary">Class ${item.class || item.grade || '—'}</strong></td>
        <td><span style="font-size: 0.85rem;">${item.prevSchool || 'Fresh Admission'}</span></td>
        <td>
          <div style="font-weight:600; color:var(--color-text-dark);">${item.parent || item.parentName || 'Parent'}</div>
          <a href="tel:${item.phone}" class="phone-link" style="font-size:0.84rem;"><i class="fa-solid fa-phone"></i> ${item.phone}</a>
          ${item.email && item.email !== '—' ? `<br><a href="mailto:${item.email}" style="font-size:0.75rem; color:var(--color-text-muted);"><i class="fa-regular fa-envelope"></i> ${item.email}</a>` : ''}
        </td>
        <td><span class="portal-badge badge-info">${item.score || 'Awaiting Entrance / Direct'}</span></td>
        <td><span class="portal-badge ${(item.docStatus || '').includes('Verified') ? 'badge-success' : 'badge-warning'}">${item.docStatus || 'Submitted'}</span></td>
        <td>
          <span class="portal-badge ${isApproved ? 'badge-success' : 'badge-warning'}">
            ${isApproved ? '<i class="fa-solid fa-circle-check"></i> Approved & Enrolled' : (item.status || 'Under Review')}
          </span>
          ${isApproved ? `
            <div style="font-size: 0.75rem; color: #047857; font-weight: 700; margin-top: 0.3rem;">
              <i class="fa-solid fa-graduation-cap"></i> Enrolled: ${item.enrolledClass || ('Class ' + targetClassKey + '-A')} (${item.enrolledAdmNo || 'Adm No Issued'})
            </div>
            <div style="font-size: 0.72rem; color: var(--color-primary); font-weight: 600; margin-top: 0.15rem;">
              <i class="fa-solid fa-chalkboard-user"></i> Class Teacher: <strong>${item.assignedTeacher || teacherInfo.name}</strong>
            </div>
          ` : ''}
        </td>
        <td>
          <div class="table-action-btns">
            ${isApproved ? `
              <button class="btn btn-sm" style="background: rgba(16, 185, 129, 0.15); color: #059669; border: 1px solid rgba(16, 185, 129, 0.35); font-weight: 700; cursor: default; border-radius: 6px; padding: 0.35rem 0.65rem;" disabled title="Admission approved and student added to Class Teacher">
                <i class="fa-solid fa-user-check"></i> Enrolled
              </button>
              <button class="action-icon-btn" onclick="portalApp.switchModule('students', 'profiles')" title="View in Class Students Directory">
                <i class="fa-solid fa-user-graduate" style="color:var(--color-primary);"></i>
              </button>
            ` : `
              <button class="btn btn-primary btn-sm" onclick="portalApp.approveAdmission('${item.appId}')" title="Approve Admission & Enroll into Class">
                <i class="fa-solid fa-check"></i> Approve
              </button>
            `}
            <button class="action-icon-btn" onclick="portalApp.reviewAdmissionDocs('${item.appId}')" title="Review Full Application Dossier & Address">
              <i class="fa-regular fa-file-lines"></i>
            </button>
            <button class="action-icon-btn" onclick="portalApp.rejectAdmission('${item.appId}')" title="Reject / Archive Application" style="color:var(--color-accent-red);">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </td>
      </tr>
      `;
    }).join('');
  }

  function approveAdmission(appId) {
    const applicant = state.admissions.find(a => a.appId === appId);
    if (applicant) {
      const approverRole = (state.currentRole === 'vice-principal') ? 'Vice Principal' : 'Principal';
      applicant.status = 'Approved - Admission Confirmed';
      applicant.docStatus = 'Verified & Approved';
      applicant.approvedBy = approverRole;
      applicant.approvedAt = new Date().toISOString();
      applicant.statusStep = 4;
      
      // Directly add student details to respective class students roster & assign to Class Teacher
      enrollApprovedStudent(applicant);
      
      // Update in localStorage
      try {
        const stored = JSON.parse(localStorage.getItem('sv_applications') || '[]');
        const idx = stored.findIndex(a => (a.appId === appId || a.applicationNumber === appId));
        if (idx !== -1) {
          stored[idx] = { ...stored[idx], ...applicant };
          localStorage.setItem('sv_applications', JSON.stringify(stored));
        } else {
          stored.unshift({ ...applicant });
          localStorage.setItem('sv_applications', JSON.stringify(stored));
        }
        // Broadcast live storage event so website Check Status and Teacher Portal update immediately
        window.dispatchEvent(new Event('storage'));
      } catch (e) {}

      renderAdmissionsQueue(state.admissions);
      showToast(`🎉 Admission approved by ${approverRole}! ${applicant.name || applicant.studentName} has been directly added to ${applicant.enrolledClass} (Adm No: ${applicant.enrolledAdmNo}) and assigned to Class Teacher (${applicant.assignedTeacher}).`, 'success');
    }
  }

  // Open & Render Student Admission Document Verification Dossier
  function reviewAdmissionDocs(appId) {
    const applicant = state.admissions.find(a => a.appId === appId);
    if (!applicant) {
      showToast(`Application ${appId} not found.`, 'error');
      return;
    }

    const modal = document.getElementById('reviewAdmissionDocsModal');
    const body = document.getElementById('reviewAdmissionDocsBody');
    const approveBtn = document.getElementById('btnModalApproveAdmission');

    if (body) {
      body.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1.25rem; padding-bottom:1rem; border-bottom:1px solid var(--color-border); flex-wrap:wrap; gap:0.75rem;">
          <div>
            <div style="font-size:0.78rem; text-transform:uppercase; letter-spacing:0.5px; color:var(--color-text-muted); font-weight:700;">Official Application Reference</div>
            <div style="display:flex; align-items:center; gap:0.5rem; margin-top:0.25rem; flex-wrap:wrap;">
              <span style="font-family:monospace; font-size:1.35rem; font-weight:800; color:var(--color-primary); letter-spacing:0.5px;">${applicant.appId}</span>
              <span class="portal-badge badge-primary">Class ${applicant.class || applicant.grade}</span>
              <span class="portal-badge ${applicant.status.includes('Approved') ? 'badge-success' : 'badge-warning'}">${applicant.status}</span>
            </div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:0.78rem; color:var(--color-text-muted); font-weight:600;">Registration Timestamp</div>
            <strong style="color:var(--color-text-dark); font-size:0.95rem;">${applicant.submissionDate || 'Recent'} ${applicant.submissionTime || ''}</strong>
          </div>
        </div>

        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem;">
          <div style="background:var(--color-bg-subtle, #f8fafc); padding:1.1rem; border-radius:10px; border:1px solid var(--color-border);">
            <div style="font-size:0.78rem; text-transform:uppercase; color:var(--color-text-muted); font-weight:800; margin-bottom:0.6rem; letter-spacing:0.4px;">
              <i class="fa-solid fa-user-graduate text-primary"></i> Student Information
            </div>
            <div style="font-size:1.15rem; font-weight:800; color:var(--color-text-dark); margin-bottom:0.4rem;">${applicant.name || applicant.studentName}</div>
            <div style="font-size:0.88rem; color:var(--color-text-muted); margin-bottom:0.25rem;"><strong>Gender:</strong> ${applicant.gender || '—'}</div>
            <div style="font-size:0.88rem; color:var(--color-text-muted); margin-bottom:0.25rem;"><strong>Date of Birth:</strong> ${applicant.dob || '—'}</div>
            <div style="font-size:0.88rem; color:var(--color-text-muted);"><strong>Previous School:</strong> ${applicant.prevSchool || 'Fresh Admission'}</div>
          </div>

          <div style="background:var(--color-bg-subtle, #f8fafc); padding:1.1rem; border-radius:10px; border:1px solid var(--color-border);">
            <div style="font-size:0.78rem; text-transform:uppercase; color:var(--color-text-muted); font-weight:800; margin-bottom:0.6rem; letter-spacing:0.4px;">
              <i class="fa-solid fa-users text-primary"></i> Parent / Guardian Contact
            </div>
            <div style="font-size:1.15rem; font-weight:800; color:var(--color-text-dark); margin-bottom:0.4rem;">${applicant.parent || applicant.parentName}</div>
            <div style="font-size:0.88rem; margin-bottom:0.35rem;">
              <strong style="color:var(--color-text-muted);">Phone:</strong> <a href="tel:${applicant.phone}" style="color:var(--color-primary); font-weight:700;"><i class="fa-solid fa-phone"></i> ${applicant.phone}</a>
            </div>
            <div style="font-size:0.88rem;">
              <strong style="color:var(--color-text-muted);">Email:</strong> ${applicant.email && applicant.email !== '—' ? `<a href="mailto:${applicant.email}" style="color:var(--color-primary); font-weight:600;">${applicant.email}</a>` : '<span style="color:var(--color-text-muted);">Not provided</span>'}
            </div>
          </div>
        </div>

        <div style="background:var(--color-bg-subtle, #f8fafc); padding:1.1rem; border-radius:10px; border:1px solid var(--color-border); margin-bottom:1.5rem;">
          <div style="font-size:0.78rem; text-transform:uppercase; color:var(--color-text-muted); font-weight:800; margin-bottom:0.45rem; letter-spacing:0.4px;">
            <i class="fa-solid fa-location-dot text-primary"></i> Residential Address
          </div>
          <div style="font-size:0.95rem; color:var(--color-text-dark); line-height:1.55; font-weight:500;">
            ${applicant.address || 'Door No, Street, Landmark, Town/City (Awaiting offline verification)'}
          </div>
        </div>

        <div style="border-top:1px solid var(--color-border); padding-top:1.1rem;">
          <div style="font-size:0.88rem; font-weight:800; color:var(--color-text-dark); margin-bottom:0.75rem; display:flex; align-items:center; gap:0.5rem;">
            <i class="fa-solid fa-file-circle-check text-primary"></i> Official Document Verification Checklist (AP Government Recognized)
          </div>
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:0.75rem;">
            <label style="display:flex; align-items:center; gap:0.55rem; font-size:0.86rem; cursor:pointer; color:var(--color-text-dark);">
              <input type="checkbox" checked style="accent-color:var(--color-primary);"> <span>Birth Certificate (Govt / MRO)</span>
            </label>
            <label style="display:flex; align-items:center; gap:0.55rem; font-size:0.86rem; cursor:pointer; color:var(--color-text-dark);">
              <input type="checkbox" checked style="accent-color:var(--color-primary);"> <span>Previous School TC / Record Sheet</span>
            </label>
            <label style="display:flex; align-items:center; gap:0.55rem; font-size:0.86rem; cursor:pointer; color:var(--color-text-dark);">
              <input type="checkbox" checked style="accent-color:var(--color-primary);"> <span>Student & Parent Aadhar Copies</span>
            </label>
            <label style="display:flex; align-items:center; gap:0.55rem; font-size:0.86rem; cursor:pointer; color:var(--color-text-dark);">
              <input type="checkbox" checked style="accent-color:var(--color-primary);"> <span>Passport Size Photographs (4 Nos)</span>
            </label>
          </div>
        </div>
      `;
    }

    if (approveBtn) {
      approveBtn.onclick = function() {
        approveAdmission(applicant.appId);
        if (typeof closeModal === 'function') {
          closeModal('reviewAdmissionDocsModal');
        } else if (modal) {
          modal.classList.remove('active');
        }
      };
    }

    if (modal) {
      modal.classList.add('active');
    }
  }

  function printAdmissionVerification() {
    window.print();
  }

  function rejectAdmission(appId) {
    const index = state.admissions.findIndex(a => a.appId === appId);
    if (index > -1) {
      const name = state.admissions[index].name || state.admissions[index].studentName;
      state.admissions.splice(index, 1);
      
      try {
        const stored = JSON.parse(localStorage.getItem('sv_applications') || '[]');
        const updated = stored.filter(a => a.appId !== appId && a.applicationNumber !== appId);
        localStorage.setItem('sv_applications', JSON.stringify(updated));
      } catch (e) {}

      renderAdmissionsQueue(state.admissions);
      if (typeof updateStudentTabBadges === 'function') updateStudentTabBadges();
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


  // =========================================================================
  // OFFICIAL TRANSFER CERTIFICATE WORKFLOWS (APPENDIX 16)
  // =========================================================================

  const TC_OFFICIAL_RECORDS = {
    'TC-2026-001': {
      tcNo: 'V/2026/041',
      admNo: 'SV-0082',
      penNo: '12059048123',
      aadhaar: '435784109235',
      name: 'P. KIRAN KUMAR',
      father: 'P. VENKATA RAMANA',
      mother: 'P. LAKSHMI DEVI',
      guardian: 'N/A (UNDER PARENTAL CUSTODY)',
      nationalityReligion: 'INDIAN / HINDU',
      caste: 'BC-D (YADAVA) — SOCIAL & EDUCATIONALLY BACKWARD CLASS',
      dobWords: '07-04-2011 (SEVENTH APRIL TWO THOUSAND ELEVEN)',
      classLeaving: 'CLASS X (TENTH STANDARD)',
      lang1: 'TELUGU',
      lang2: 'HINDI',
      course: 'ACADEMIC (GENERAL HIGH SCHOOL STREAM)',
      motherTongueMedium: 'Mother Tongue: TELUGU • Medium of Instruction: ENGLISH',
      admPromotionDate: '12-06-2025 (TWELVE JUNE TWO THOUSAND TWENTY FIVE)',
      firstAdmClassYear: 'CLASS I (ACADEMIC YEAR 2016–2017)',
      promotion: 'YES, QUALIFIED FOR PROMOTION TO CLASS XI / INTERMEDIATE',
      feesPaid: 'YES, ALL INSTITUTIONAL DUES FULLY CLEARED (NO DUES)',
      scholarship: 'NIL',
      concession: 'NIL',
      medical: 'YES, ANNUAL INSTITUTIONAL HEALTH INSPECTION SATISFACTORY',
      mole1: 'A mole below lower jaw',
      mole2: 'A mole on right collar bone',
      dateLeft: '18-04-2026',
      appDate: '12-04-2026',
      issueDate: '18-04-2026',
      conduct: 'EXEMPLARY • SATISFACTORY IN ALL RESPECTS',
      attendance: '204 / 220 DAYS (92.7% CUMULATIVE ATTENDANCE)'
    },
    'TC-2026-002': {
      tcNo: 'V/2026/042',
      admNo: 'SV-0119',
      penNo: '12059048245',
      aadhaar: '561234908124',
      name: 'R. DIVYA',
      father: 'R. SUBBA RAO',
      mother: 'R. PADMAVATHI',
      guardian: 'N/A',
      nationalityReligion: 'INDIAN / HINDU',
      caste: 'OC (GENERAL)',
      dobWords: '22-05-2015 (TWENTY SECOND MAY TWO THOUSAND FIFTEEN)',
      classLeaving: 'CLASS V (FIFTH STANDARD)',
      lang1: 'TELUGU',
      lang2: 'HINDI',
      course: 'ACADEMIC (PRIMARY WING)',
      motherTongueMedium: 'Mother Tongue: TELUGU • Medium of Instruction: ENGLISH',
      admPromotionDate: '10-06-2025 (TENTH JUNE TWO THOUSAND TWENTY FIVE)',
      firstAdmClassYear: 'CLASS I (ACADEMIC YEAR 2021–2022)',
      promotion: 'YES, QUALIFIED FOR PROMOTION TO CLASS VI',
      feesPaid: 'YES, ALL DUES CLEARED (NO DUES)',
      scholarship: 'NIL',
      concession: 'NIL',
      medical: 'YES, ANNUAL INSPECTION COMPLETED',
      mole1: 'A small mole on left cheek',
      mole2: 'A birthmark on right forearm',
      dateLeft: '18-04-2026',
      appDate: '14-04-2026',
      issueDate: '18-04-2026',
      conduct: 'VERY GOOD • WELL-MANNERED',
      attendance: '208 / 220 DAYS (94.5% CUMULATIVE ATTENDANCE)'
    },
    'TC-2026-003': {
      tcNo: 'V/2026/043',
      admNo: 'SV-0214',
      penNo: '12059048389',
      aadhaar: '890123456789',
      name: 'G. HARSHA VARDHAN',
      father: 'G. PRASAD',
      mother: 'G. BHAVANI',
      guardian: 'N/A',
      nationalityReligion: 'INDIAN / HINDU',
      caste: 'BC-A (AGNIKULA KSHATRIYA)',
      dobWords: '09-11-2011 (NINTH NOVEMBER TWO THOUSAND ELEVEN)',
      classLeaving: 'CLASS IX (NINTH STANDARD)',
      lang1: 'TELUGU',
      lang2: 'HINDI',
      course: 'ACADEMIC (HIGH SCHOOL STREAM)',
      motherTongueMedium: 'Mother Tongue: TELUGU • Medium of Instruction: ENGLISH',
      admPromotionDate: '12-06-2025 (TWELVE JUNE TWO THOUSAND TWENTY FIVE)',
      firstAdmClassYear: 'CLASS I (ACADEMIC YEAR 2018–2019)',
      promotion: 'YES, QUALIFIED FOR PROMOTION TO CLASS X',
      feesPaid: 'YES, ALL DUES CLEARED (NO DUES)',
      scholarship: 'NIL',
      concession: 'NIL',
      medical: 'YES, ANNUAL HEALTH CHECKUP SATISFACTORY',
      mole1: 'A scar on left forehead',
      mole2: 'A mole on right shoulder blade',
      dateLeft: '17-04-2026',
      appDate: '10-04-2026',
      issueDate: '17-04-2026',
      conduct: 'GOOD • PROMPT AND OBEDIENT',
      attendance: '198 / 220 DAYS (90.0% CUMULATIVE ATTENDANCE)'
    },
    'TC-2026-004': {
      tcNo: 'V/2026/044',
      admNo: 'SV-0309',
      penNo: '12059048512',
      aadhaar: '345678901234',
      name: 'A. DEEPTHI',
      father: 'A. SATYANARAYANA',
      mother: 'A. SARADA',
      guardian: 'N/A',
      nationalityReligion: 'INDIAN / HINDU',
      caste: 'SC (SCHEDULED CASTE)',
      dobWords: '03-02-2010 (THIRD FEBRUARY TWO THOUSAND TEN)',
      classLeaving: 'CLASS X (TENTH STANDARD)',
      lang1: 'TELUGU',
      lang2: 'HINDI',
      course: 'ACADEMIC (SSC PUBLIC STREAM)',
      motherTongueMedium: 'Mother Tongue: TELUGU • Medium of Instruction: ENGLISH',
      admPromotionDate: '12-06-2025 (TWELVE JUNE TWO THOUSAND TWENTY FIVE)',
      firstAdmClassYear: 'CLASS I (ACADEMIC YEAR 2016–2017)',
      promotion: 'YES, QUALIFIED FOR HIGHER EDUCATION / INTERMEDIATE',
      feesPaid: 'YES, NO DUES REMAINING',
      scholarship: 'GOVERNMENT POST-MATRIC MERIT SCHOLARSHIP RECIPIENT',
      concession: 'FEE CONCESSION GRANTED UNDER MERIT CATEGORY',
      medical: 'YES, SATISFACTORY HEALTH STANDING',
      mole1: 'A mole on chin right side',
      mole2: 'A mole on left wrist',
      dateLeft: '19-04-2026',
      appDate: '14-04-2026',
      issueDate: '19-04-2026',
      conduct: 'EXEMPLARY • TOP MERIT SCHOLAR',
      attendance: '214 / 220 DAYS (97.3% CUMULATIVE ATTENDANCE)'
    }
  };

  let activeModalTcKey = 'TC-2026-001';
  let isModalAadhaarMasked = true;
  let activeModalCopyType = 'ORIGINAL';

  function printTC(tcNo) {
    activeModalTcKey = tcNo || 'TC-2026-001';
    renderModalTCDocument();
    openModal('viewTransferCertificateModal');

    const selectEl = document.getElementById('modalTcSelect');
    if (selectEl) selectEl.value = activeModalTcKey;

    showToast(`Official Transfer Certificate loaded for ${tcNo}`, 'info');
  }

  function downloadTCPdf(tcNo) {
    printTC(tcNo);
  }

  function onModalTCChange(val) {
    activeModalTcKey = val;
    renderModalTCDocument();
  }

  function onModalCopyTypeChange(val) {
    activeModalCopyType = val;
    renderModalTCDocument();
  }

  function toggleModalAadhaarMask(masked) {
    isModalAadhaarMasked = masked;
    renderModalTCDocument();
  }

  function openTCFullPage() {
    window.open(`transfer-certificate.html?tc=${activeModalTcKey}`, '_blank');
  }

  function renderModalTCDocument() {
    const container = document.getElementById('tcModalDocumentContainer');
    if (!container) return;

    const rec = TC_OFFICIAL_RECORDS[activeModalTcKey] || TC_OFFICIAL_RECORDS['TC-2026-001'];

    // Format 12-box Aadhaar
    const digits = (rec.aadhaar || '435784109235').replace(/\D/g, '').padEnd(12, 'X');
    let aadhaarBoxes = '';
    for (let i = 0; i < 12; i++) {
      if (i === 4 || i === 8) {
        aadhaarBoxes += '<span style="width: 4px; display:inline-block;"></span>';
      }
      let char = digits[i];
      if (isModalAadhaarMasked && i < 8) {
        char = '&bull;';
      }
      aadhaarBoxes += `<span style="width: 15px; height: 16px; border: 1px solid #222; display: inline-flex; align-items: center; justify-content: center; font-family: sans-serif; font-size: 0.76rem; font-weight: 700; background: #fafafa; margin: 0 1px;">${char}</span>`;
    }

    container.innerHTML = `
      <div class="modal-tc-sheet" id="printableTcDoc">
        <div class="modal-tc-inner">
          <!-- Authority Header -->
          <div style="text-align: center; font-size: 0.74rem; line-height: 1.3; color: #222; border-bottom: 1.5px solid #111; padding-bottom: 4px; margin-bottom: 5px;">
            <div style="font-weight: 600;">Supplied by the District Common Examination Board, Visakhapatnam.</div>
            <div style="font-weight: 700;">Proceedings of the District Educational Officer, Visakhapatnam R.C.No. 72 B1 / 79 Dt. 30-5-80</div>
            <div style="font-weight: 800; font-size: 0.8rem; letter-spacing: 1px; margin-top: 2px;">APPENDIX 16 (Rules 99, Chapter III)</div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 3px; font-size: 0.74rem; font-weight: 700;">
              <span style="color: #1e3a8a;">Recognised by RJD of School Education, VSP</span>
              <span style="border: 1px solid #111; padding: 1px 8px; border-radius: 3px; font-family: serif; font-weight: 800;">${activeModalCopyType}</span>
              <span>PC NO: <strong>28132510004 1036601</strong></span>
            </div>
          </div>

          <!-- Document Title -->
          <div style="font-family: serif; font-size: 1.15rem; font-weight: 900; text-align: center; letter-spacing: 1.5px; margin: 4px 0 2px; color: #0b1d3a; text-transform: uppercase;">
            Form of Transfer Certificate
          </div>

          <!-- Meta Reference Row -->
          <div style="display: grid; grid-template-columns: 1.4fr 1.1fr 1.3fr; align-items: center; border-bottom: 1px solid #222; padding: 3px 0 5px; margin-bottom: 6px; font-size: 0.8rem; font-weight: 700;">
            <span>Transfer Certificate No. : <strong style="color:#0b1d3a; font-family:sans-serif;">${rec.tcNo}</strong></span>
            <span>Admn. No. : <strong style="color:#0b1d3a; font-family:sans-serif;">${rec.admNo}</strong></span>
            <span>PEN No. : <strong style="color:#0b1d3a; font-family:sans-serif;">${rec.penNo}</strong></span>
          </div>

          <!-- 21 Numbered Items -->
          <div style="display: flex; flex-direction: column; gap: 3.5px; font-size: 0.825rem; line-height: 1.32;">
            <div style="display: flex; align-items: baseline;">
              <span style="font-weight: 700; flex-shrink: 0;">1. Name of the School (Place and District) &amp; UDISE Code :</span>
              <span style="flex: 1; border-bottom: 1px dotted #333; padding: 0 4px; font-weight: 700; color: #0b1d3a; font-family: sans-serif; font-size: 0.8rem;">SRI VIDYA E.M HIGH SCHOOL, SRIHARIPURAM, VISAKHAPATNAM - 530026 (UDISE: 28132510004)</span>
            </div>

            <div style="display: flex; align-items: baseline; flex-wrap: wrap;">
              <span style="font-weight: 700; flex-shrink: 0;">2. Name of the Pupil :</span>
              <span style="flex: 1; border-bottom: 1px dotted #333; padding: 0 4px; font-weight: 700; color: #0b1d3a; font-family: sans-serif; font-size: 0.8rem; min-width: 200px;">${rec.name}</span>
              <div style="display: inline-flex; align-items: baseline; margin-left: 8px;">
                <span style="font-weight: 700; font-size: 0.78rem;">AADHAAR NO. :</span>
                <div style="display: inline-flex; align-items: center; margin-left: 6px;">${aadhaarBoxes}</div>
              </div>
            </div>

            <div style="display: flex; align-items: baseline;">
              <span style="font-weight: 700; flex-shrink: 0;">3. a) Name of the Father :</span>
              <span style="flex: 1; border-bottom: 1px dotted #333; padding: 0 4px; font-weight: 700; color: #0b1d3a; font-family: sans-serif; font-size: 0.8rem;">${rec.father}</span>
            </div>
            <div style="display: flex; align-items: baseline; margin-left: 1.25rem;">
              <span style="font-weight: 700; flex-shrink: 0;">b) Name of the Mother :</span>
              <span style="flex: 1; border-bottom: 1px dotted #333; padding: 0 4px; font-weight: 700; color: #0b1d3a; font-family: sans-serif; font-size: 0.8rem;">${rec.mother}</span>
            </div>
            <div style="display: flex; align-items: baseline; margin-left: 1.25rem;">
              <span style="font-weight: 700; flex-shrink: 0;">c) Name of the Guardian :</span>
              <span style="flex: 1; border-bottom: 1px dotted #333; padding: 0 4px; font-weight: 700; color: #0b1d3a; font-family: sans-serif; font-size: 0.8rem;">${rec.guardian}</span>
            </div>

            <div style="display: flex; align-items: baseline;">
              <span style="font-weight: 700; flex-shrink: 0;">4. Nationality and Religion :</span>
              <span style="flex: 1; border-bottom: 1px dotted #333; padding: 0 4px; font-weight: 700; color: #0b1d3a; font-family: sans-serif; font-size: 0.8rem;">${rec.nationalityReligion}</span>
            </div>

            <div style="display: flex; align-items: flex-start;">
              <span style="font-weight: 700; flex-shrink: 0; max-width: 48%; line-height: 1.25;">5. Whether the candidate belongs to SCs or STs or Vimuktha Jathis or other socially and Educationally Backward classes specified in the A.P. Educational Rules :</span>
              <span style="flex: 1; border-bottom: 1px dotted #333; padding: 0 4px; font-weight: 700; color: #0b1d3a; font-family: sans-serif; font-size: 0.8rem; margin-top: 4px;">${rec.caste}</span>
            </div>

            <div style="display: flex; align-items: baseline;">
              <span style="font-weight: 700; flex-shrink: 0;">6. Date of birth (in words) as entered in the Admission Register :</span>
              <span style="flex: 1; border-bottom: 1px dotted #333; padding: 0 4px; font-weight: 700; color: #0b1d3a; font-family: sans-serif; font-size: 0.8rem;">${rec.dobWords}</span>
            </div>

            <div style="display: flex; align-items: baseline;">
              <span style="font-weight: 700; flex-shrink: 0;">7. (a) Class in which the pupil was reading at the time of leaving (in words) :</span>
              <span style="flex: 1; border-bottom: 1px dotted #333; padding: 0 4px; font-weight: 700; color: #0b1d3a; font-family: sans-serif; font-size: 0.8rem;">${rec.classLeaving}</span>
            </div>
            <div style="display: flex; align-items: baseline; margin-left: 1.25rem;">
              <span style="font-weight: 700; flex-shrink: 0;">(b) (i) First Language :</span>
              <span style="flex: 1; border-bottom: 1px dotted #333; padding: 0 4px; font-weight: 700; color: #0b1d3a; font-family: sans-serif; font-size: 0.8rem; max-width: 140px;">${rec.lang1}</span>
              <span style="font-weight: 700; margin-left: 12px; flex-shrink: 0;">(ii) Second Language :</span>
              <span style="flex: 1; border-bottom: 1px dotted #333; padding: 0 4px; font-weight: 700; color: #0b1d3a; font-family: sans-serif; font-size: 0.8rem;">${rec.lang2}</span>
            </div>
            <div style="display: flex; align-items: baseline; margin-left: 1.25rem;">
              <span style="font-weight: 700; flex-shrink: 0;">(c) Course offered i.e. whether academic or bifurcated :</span>
              <span style="flex: 1; border-bottom: 1px dotted #333; padding: 0 4px; font-weight: 700; color: #0b1d3a; font-family: sans-serif; font-size: 0.8rem;">${rec.course}</span>
            </div>

            <div style="display: flex; align-items: baseline;">
              <span style="font-weight: 700; flex-shrink: 0;">8. Mother Tongue &ndash; Medium of instruction Optional :</span>
              <span style="flex: 1; border-bottom: 1px dotted #333; padding: 0 4px; font-weight: 700; color: #0b1d3a; font-family: sans-serif; font-size: 0.8rem;">${rec.motherTongueMedium}</span>
            </div>

            <div style="display: flex; align-items: baseline;">
              <span style="font-weight: 700; flex-shrink: 0;">9. Date of admission or promotion to that class (year in words) :</span>
              <span style="flex: 1; border-bottom: 1px dotted #333; padding: 0 4px; font-weight: 700; color: #0b1d3a; font-family: sans-serif; font-size: 0.8rem;">${rec.admPromotionDate}</span>
            </div>

            <div style="display: flex; align-items: baseline;">
              <span style="font-weight: 700; flex-shrink: 0;">10. Class and year in which the pupil was first admitted into the school :</span>
              <span style="flex: 1; border-bottom: 1px dotted #333; padding: 0 4px; font-weight: 700; color: #0b1d3a; font-family: sans-serif; font-size: 0.8rem;">${rec.firstAdmClassYear}</span>
            </div>

            <div style="display: flex; align-items: baseline;">
              <span style="font-weight: 700; flex-shrink: 0;">11. Whether qualified for promotion to a Higher Class :</span>
              <span style="flex: 1; border-bottom: 1px dotted #333; padding: 0 4px; font-weight: 700; color: #0b1d3a; font-family: sans-serif; font-size: 0.8rem;">${rec.promotion}</span>
            </div>

            <div style="display: flex; align-items: baseline;">
              <span style="font-weight: 700; flex-shrink: 0;">12. Whether the pupil has paid all the fees due to the school :</span>
              <span style="flex: 1; border-bottom: 1px dotted #333; padding: 0 4px; font-weight: 700; color: #0b1d3a; font-family: sans-serif; font-size: 0.8rem;">${rec.feesPaid}</span>
            </div>

            <div style="display: flex; align-items: baseline;">
              <span style="font-weight: 700; flex-shrink: 0;">13. (a) Whether in receipt of any scholarship (Nature specified) :</span>
              <span style="flex: 1; border-bottom: 1px dotted #333; padding: 0 4px; font-weight: 700; color: #0b1d3a; font-family: sans-serif; font-size: 0.8rem;">${rec.scholarship}</span>
            </div>
            <div style="display: flex; align-items: baseline; margin-left: 1.25rem;">
              <span style="font-weight: 700; flex-shrink: 0;">(b) Whether in receipt of any concession (Nature specified) :</span>
              <span style="flex: 1; border-bottom: 1px dotted #333; padding: 0 4px; font-weight: 700; color: #0b1d3a; font-family: sans-serif; font-size: 0.8rem;">${rec.concession}</span>
            </div>

            <div style="display: flex; align-items: baseline;">
              <span style="font-weight: 700; flex-shrink: 0;">14. Whether the pupil has undergone medical inspection :</span>
              <span style="flex: 1; border-bottom: 1px dotted #333; padding: 0 4px; font-weight: 700; color: #0b1d3a; font-family: sans-serif; font-size: 0.8rem;">${rec.medical}</span>
            </div>

            <div style="display: flex; align-items: baseline;">
              <span style="font-weight: 700; flex-shrink: 0;">15. Personal marks of identification :</span>
            </div>
            <div style="display: flex; align-items: baseline; margin-left: 1.25rem;">
              <span style="font-weight: 700; flex-shrink: 0;">(i)</span>
              <span style="flex: 1; border-bottom: 1px dotted #333; padding: 0 4px; font-weight: 700; color: #0b1d3a; font-family: sans-serif; font-size: 0.8rem;">${rec.mole1}</span>
            </div>
            <div style="display: flex; align-items: baseline; margin-left: 1.25rem;">
              <span style="font-weight: 700; flex-shrink: 0;">(ii)</span>
              <span style="flex: 1; border-bottom: 1px dotted #333; padding: 0 4px; font-weight: 700; color: #0b1d3a; font-family: sans-serif; font-size: 0.8rem;">${rec.mole2}</span>
            </div>

            <div style="display: flex; align-items: baseline;">
              <span style="font-weight: 700; flex-shrink: 0;">16. Date on which the pupil actually left the School :</span>
              <span style="flex: 1; border-bottom: 1px dotted #333; padding: 0 4px; font-weight: 700; color: #0b1d3a; font-family: sans-serif; font-size: 0.8rem;">${rec.dateLeft}</span>
            </div>

            <div style="display: flex; align-items: baseline;">
              <span style="font-weight: 700; flex-shrink: 0;">17. Date on which application for TC was made by Parent/Guardian :</span>
              <span style="flex: 1; border-bottom: 1px dotted #333; padding: 0 4px; font-weight: 700; color: #0b1d3a; font-family: sans-serif; font-size: 0.8rem;">${rec.appDate}</span>
            </div>

            <div style="display: flex; align-items: baseline;">
              <span style="font-weight: 700; flex-shrink: 0;">18. Date of the Transfer Certificate :</span>
              <span style="flex: 1; border-bottom: 1px dotted #333; padding: 0 4px; font-weight: 700; color: #0b1d3a; font-family: sans-serif; font-size: 0.8rem;">${rec.issueDate}</span>
            </div>

            <div style="display: flex; align-items: baseline;">
              <span style="font-weight: 700; flex-shrink: 0;">19. CONDUCT :</span>
              <span style="flex: 1; border-bottom: 1px dotted #333; padding: 0 4px; font-weight: 800; color: #166534; font-family: sans-serif; font-size: 0.8rem;">${rec.conduct}</span>
            </div>

            <div style="display: flex; align-items: baseline;">
              <span style="font-weight: 700; flex-shrink: 0;">20. Attendance in the Class of leaving days Present / Total working days :</span>
              <span style="flex: 1; border-bottom: 1px dotted #333; padding: 0 4px; font-weight: 700; color: #0b1d3a; font-family: sans-serif; font-size: 0.8rem;">${rec.attendance}</span>
            </div>

            <div style="display: flex; align-items: baseline;">
              <span style="font-weight: 700; flex-shrink: 0;">21. Signature of the Head of the School :</span>
              <span style="flex: 1; color: #475569; font-style: italic; font-size: 0.78rem;">(Affixed Below with Institutional Seal)</span>
            </div>
          </div>

          <!-- Signatures Section -->
          <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 10px; padding-top: 8px; border-top: 1px solid #444;">
            <div style="text-align: left; font-size: 0.76rem;">
              <div style="height: 28px; display: flex; align-items: flex-end;">
                <span style="font-family: serif; font-size: 1.05rem; font-weight: 700; color: #1e3a8a;">B. Narayana</span>
              </div>
              <div style="font-family: serif; font-size: 0.82rem; font-weight: 800; color: #0b1d3a;">Prepared &amp; Verified By</div>
              <div style="font-size: 0.68rem; color: #475569;">Senior Academic In-Charge</div>
            </div>

            <div style="text-align: center;">
              <div style="width: 58px; height: 58px; border: 2px dashed #0b1d3a; border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 0.42rem; font-weight: 800; text-transform: uppercase; text-align: center; padding: 2px; color: #0b1d3a; background: #fafbfc; line-height: 1.15;">
                SRI VIDYA E.M.<br>HIGH SCHOOL<br>VISAKHAPATNAM
              </div>
              <div style="font-size: 0.68rem; color: #475569; margin-top: 3px;">Institutional Seal</div>
            </div>

            <div style="text-align: right; font-size: 0.76rem;">
              <div style="height: 28px; display: flex; align-items: flex-end; justify-content: flex-end;">
                <span style="font-family: serif; font-size: 0.95rem; font-weight: 900; color: #0b1d3a;">G. Varalakshmi</span>
              </div>
              <div style="font-family: serif; font-size: 0.82rem; font-weight: 800; color: #0b1d3a;">Head of the School</div>
              <div style="font-size: 0.68rem; color: #475569;">Principal &amp; Academic Director</div>
            </div>
          </div>

          <!-- Mandatory Statutory Notes -->
          <div style="margin-top: 8px; padding-top: 4px; border-top: 1px solid #666; font-size: 0.64rem; line-height: 1.25; color: #333;">
            <strong>Note :</strong>
            <ol style="margin-left: 1.25rem; padding-left: 0;">
              <li>Schools under private management shall have the word "Recognised under the Andhra Pradesh Educational Rules" printed in the Transfer Certificate to be issued by them.</li>
              <li>Transfer Certificate issued by Secondary Schools under private management without the words "Recognised under the Andhra Pradesh Educational Rules" shall not be considered valid for purposes of admission.</li>
              <li>In case the pupil is leaving the State of Andhra Pradesh this certificate will not be valid without the counter-signature of the Inspecting Officer concerned.</li>
            </ol>
          </div>
        </div>
      </div>
    `;
  }

  function printCurrentModalTC() {
    const content = document.getElementById('tcModalDocumentContainer')?.innerHTML;
    if (!content) return;

    const printWin = window.open('', '_blank');
    if (!printWin) {
      window.print();
      return;
    }

    printWin.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Official Form of Transfer Certificate</title>
        <link rel="stylesheet" href="css/portal.css">
        <style>
          @page { size: A4 portrait; margin: 8mm; }
          body { font-family: 'EB Garamond', serif; background: #fff; color: #000; padding: 10px; margin: 0; }
          .modal-tc-sheet { border: 2px solid #222 !important; box-shadow: none !important; width: 100% !important; }
        </style>
      </head>
      <body>
        ${content}
        <script>window.onload = function() { window.print(); window.close(); }</script>
      </body>
      </html>
    `);
    printWin.document.close();
  }

  function downloadCurrentModalTCPdf() {
    showToast('Exporting certified digital Transfer Certificate to PDF...', 'info');
    printCurrentModalTC();
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
      const initials = (member.name || '').replace(/^(Smt\.|Sri\.|Ms\.|Mr\.|Dr\.)\s*/, '').split(' ').map(n => n[0]).join('').slice(0, 2) || 'TC';
      const isLead = (member.role || '').includes('Principal');
      const isBankAadhaar = Boolean(member.bankName && member.aadhaar);
      const isUpdated = Boolean(member.lastProfileUpdate || member.profileSynced);
      return `
        <div class="staff-card ${isLead ? 'lead-card' : ''}">
          <div class="staff-card-header">
            <div class="staff-avatar">${initials}</div>
            <div class="staff-header-info">
              <div style="display:flex; align-items:center; justify-content:space-between; gap:6px;">
                <h3 class="staff-name" style="margin-bottom:0;">${member.name}</h3>
                <span class="teacher-id-badge">${member.id}</span>
              </div>
              <span class="staff-role">${member.role}</span>
              <div style="display:flex; align-items:center; gap:6px; margin-top:4px; flex-wrap:wrap;">
                <span class="portal-badge ${member.status === 'Present' || member.status === 'Active' ? 'badge-success' : 'badge-warning'}">${member.status || 'Active'}</span>
                ${isUpdated ? `<span style="font-size:0.72rem; color:#047857; background:#ecfdf5; border:1px solid #a7f3d0; padding:2px 6px; border-radius:4px; font-weight:700;"><i class="fa-solid fa-arrows-rotate"></i> Updated</span>` : ''}
                ${isBankAadhaar ? `<span style="font-size:0.72rem; color:#1d4ed8; background:#eff6ff; border:1px solid #bfdbfe; padding:2px 6px; border-radius:4px; font-weight:700;"><i class="fa-solid fa-building-columns"></i> Bank &amp; Aadhaar</span>` : ''}
              </div>
            </div>
          </div>
          <div class="staff-details">
            <div class="staff-detail-row">
              <span class="detail-label"><i class="fa-solid fa-graduation-cap"></i> Qualification:</span>
              <span class="detail-val">${member.qualification || 'B.Ed, Graduate'}</span>
            </div>
            <div class="staff-detail-row">
              <span class="detail-label"><i class="fa-solid fa-briefcase"></i> Experience:</span>
              <span class="detail-val">${member.exp || '—'}</span>
            </div>
            <div class="staff-detail-row">
              <span class="detail-label"><i class="fa-solid fa-book"></i> Primary Subject:</span>
              <span class="detail-val">${member.subject || member.department || '—'}</span>
            </div>
            <div class="staff-detail-row">
              <span class="detail-label"><i class="fa-solid fa-phone"></i> Contact:</span>
              <span class="detail-val"><a href="tel:${member.phone}">${member.phone || '—'}</a></span>
            </div>
          </div>
          <div class="staff-footer">
            <button class="btn-staff-action outline" onclick="portalApp.openTeacherPermissionsConfig('${member.id}')" title="Configure Teacher Permissions (Principal & Vice Principal)">
              <i class="fa-solid fa-shield-halved"></i> Permissions
            </button>
            <button class="btn-staff-action outline" onclick="portalApp.openFacultyDossier('${member.id}')" title="View Full Faculty Dossier, Aadhaar & Bank Details">
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

    const isPaid = (student.feeStatus || '').toLowerCase() === 'paid';
    const initial = (student.name || 'S').trim().charAt(0).toUpperCase();

    modalBody.innerHTML = `
      <div class="student-profile-dossier">
        <!-- Hero Header Card with Avatar & Metadata Chips -->
        <div class="profile-header-strip">
          <div class="profile-avatar">${initial}</div>
          <div class="profile-title-block">
            <h2>${student.name}</h2>
            <div class="profile-meta-line">
              <span class="dossier-chip chip-adm"><i class="fa-solid fa-id-badge"></i> Adm No: <strong>${student.admNo}</strong></span>
              <span class="dossier-chip"><i class="fa-solid fa-graduation-cap"></i> Class: <strong>${student.class} - ${student.section || 'A'}</strong></span>
              <span class="dossier-chip"><i class="fa-solid fa-hashtag"></i> Roll: <strong>#${student.rollNo || '1'}</strong></span>
              <span class="dossier-chip chip-active"><i class="fa-solid fa-circle-check"></i> Enrolled</span>
            </div>
          </div>
        </div>

        <!-- 3 Executive KPI Metric Cards -->
        <div class="dossier-kpi-row">
          <div class="dossier-kpi-card">
            <span class="dossier-kpi-label"><i class="fa-solid fa-star text-amber"></i> Cumulative GPA</span>
            <span class="dossier-kpi-val" style="color: #2563eb;">${student.gpa || '8.2'} <span style="font-size:0.78rem; font-weight:600; color:var(--color-text-muted);">/ 10.0</span></span>
          </div>
          <div class="dossier-kpi-card">
            <span class="dossier-kpi-label"><i class="fa-solid fa-calendar-check text-emerald"></i> Attendance</span>
            <span class="dossier-kpi-val" style="color: #10b981;">${student.attendance || '95.0%'}</span>
          </div>
          <div class="dossier-kpi-card">
            <span class="dossier-kpi-label"><i class="fa-solid fa-receipt text-primary"></i> Fee Clearance</span>
            <span class="dossier-kpi-val">
              <span class="portal-badge ${isPaid ? 'badge-success' : 'badge-danger'}" style="font-size:0.82rem; font-weight:700;">
                <i class="fa-solid ${isPaid ? 'fa-circle-check' : 'fa-clock'}"></i> ${student.feeStatus || 'Pending'}
              </span>
            </span>
          </div>
        </div>

        <!-- 4 Clean Information Cards Grid -->
        <div class="profile-info-grid">
          <div class="info-group">
            <label><i class="fa-solid fa-user-shield text-primary"></i> Parent / Guardian</label>
            <div class="info-val">${student.parent || 'Guardian'}</div>
          </div>
          <div class="info-group">
            <label><i class="fa-solid fa-phone text-emerald"></i> Emergency Contact</label>
            <div class="info-val">
              <a href="tel:${student.phone}" class="phone-link">
                <i class="fa-solid fa-phone-volume"></i> ${student.phone || '9848000000'}
              </a>
            </div>
          </div>
          <div class="info-group">
            <label><i class="fa-solid fa-calendar-days text-primary"></i> Academic Session</label>
            <div class="info-val">2025 – 2026 Academic Year</div>
          </div>
          <div class="info-group">
            <label><i class="fa-solid fa-school text-primary"></i> Campus Medium &amp; Board</label>
            <div class="info-val">English Medium (AP Recognized)</div>
          </div>
        </div>

        <!-- Academic Examination Performance Card -->
        <div class="profile-section-card">
          <div class="profile-section-card-header">
            <h4><i class="fa-solid fa-chart-line text-primary"></i> Quarterly Assessment Report (2026)</h4>
            <span class="portal-badge badge-success" style="font-size:0.75rem; font-weight:700;">Overall Distinction</span>
          </div>
          <table class="data-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Max Marks</th>
                <th>Marks Scored</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              <tr><td><i class="fa-solid fa-book text-muted"></i> First Language (Telugu / Sanskrit)</td><td>100</td><td><strong>96</strong></td><td><span class="portal-badge badge-success">A1</span></td></tr>
              <tr><td><i class="fa-solid fa-book text-muted"></i> Second Language (Hindi)</td><td>100</td><td><strong>92</strong></td><td><span class="portal-badge badge-success">A1</span></td></tr>
              <tr><td><i class="fa-solid fa-book text-muted"></i> Third Language (English)</td><td>100</td><td><strong>95</strong></td><td><span class="portal-badge badge-success">A1</span></td></tr>
              <tr><td><i class="fa-solid fa-calculator text-muted"></i> Mathematics</td><td>100</td><td><strong>98</strong></td><td><span class="portal-badge badge-success">A1</span></td></tr>
              <tr><td><i class="fa-solid fa-flask text-muted"></i> General Science (Physics &amp; Biology)</td><td>100</td><td><strong>94</strong></td><td><span class="portal-badge badge-success">A1</span></td></tr>
              <tr><td><i class="fa-solid fa-globe text-muted"></i> Social Studies</td><td>100</td><td><strong>93</strong></td><td><span class="portal-badge badge-success">A1</span></td></tr>
            </tbody>
          </table>
          <div class="profile-section-card-footer">
            <span>Aggregate Marks: <strong>568 / 600</strong></span>
            <span>Performance Index: <strong>94.7% (Grade A1)</strong></span>
          </div>
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
    if (e && e.preventDefault) e.preventDefault();
    const subject = (document.getElementById('broadcastSubject')?.value || '').trim();
    const body = (document.getElementById('broadcastBody')?.value || '').trim();
    const recGroup = document.getElementById('broadcastRecipients')?.value || 'All Parents & Guardians (855)';

    if (!subject || !body) {
      showToast('Please enter both broadcast title and message body.', 'warning');
      return;
    }

    const selectedChannels = [];
    if (document.getElementById('bcChSms')?.checked) selectedChannels.push('SMS');
    if (document.getElementById('bcChNotice')?.checked) selectedChannels.push('Notice Board');
    if (document.getElementById('bcChWa')?.checked) selectedChannels.push('WhatsApp');
    if (document.getElementById('bcChEmail')?.checked) selectedChannels.push('Email');
    if (document.getElementById('bcChPush')?.checked) selectedChannels.push('App Push');
    if (selectedChannels.length === 0) selectedChannels.push('Notice Board');

    const newBroadcast = {
      id: 'BC-2026-' + (115 + BROADCAST_FEED_DATA.length),
      ref: 'CIR-2026-0' + (43 + BROADCAST_FEED_DATA.length),
      title: subject,
      body: body,
      category: 'Broadcast Alert',
      categoryClass: 'cat-exam',
      time: 'Just now',
      recipients: recGroup,
      channels: selectedChannels,
      status: 'Delivered (100%)',
      sender: 'Principal / Administration',
      content: `<p><strong>Official Broadcast Dispatch</strong></p><p>${body}</p><p>Target: ${recGroup}</p>`,
      date: 'Today • Just now'
    };

    BROADCAST_FEED_DATA.unshift(newBroadcast);

    // Also mirror to CIRCULARS_DATA if Notice Board was selected
    if (selectedChannels.includes('Notice Board')) {
      CIRCULARS_DATA.unshift({
        ref: newBroadcast.ref,
        title: subject,
        category: 'Administrative Alert',
        audience: recGroup,
        date: 'Today',
        status: 'Published',
        priority: 'Important',
        content: `<p>${body}</p>`,
        signedBy: 'Administration, Sri Vidya High School'
      });
      renderCircularsTable();
    }

    // Mirror to SMS_LOGS_DATA if SMS selected
    if (selectedChannels.includes('SMS')) {
      SMS_LOGS_DATA.unshift({
        logId: 'SMS-' + Math.floor(849100 + Math.random() * 900),
        time: 'Just now',
        recipient: recGroup,
        category: 'Broadcast SMS',
        snippet: body.length > 85 ? body.slice(0, 85) + '...' : body,
        gateway: 'AP-EDUSMS (Airtel DLT)',
        status: 'Delivered (100%)'
      });
      renderSmsLogsTable();
    }

    renderBroadcastFeed();

    // Reset broadcast form
    document.getElementById('broadcastForm')?.reset();
    if (document.getElementById('bcChSms')) document.getElementById('bcChSms').checked = true;
    if (document.getElementById('bcChNotice')) document.getElementById('bcChNotice').checked = true;

    showToast(`Instant broadcast "${subject}" transmitted across ${selectedChannels.join(', ')}!`, 'success');
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

  // Toast Notification System (Deduplicated & Cleanly Positioned)
  function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    // Deduplicate: ignore if an identical message is already visible
    const existing = container.querySelectorAll('.portal-toast');
    for (const t of existing) {
      if (t.innerText && t.innerText.includes(message)) {
        return;
      }
    }

    // Limit maximum concurrent toasts to 2
    while (container.children.length >= 2) {
      container.firstElementChild.remove();
    }

    const toast = document.createElement('div');
    toast.className = `portal-toast toast-${type}`;
    
    let icon = 'fa-solid fa-circle-info';
    if (type === 'success') icon = 'fa-solid fa-circle-check';
    if (type === 'warning') icon = 'fa-solid fa-triangle-exclamation';
    if (type === 'error') icon = 'fa-solid fa-circle-xmark';

    toast.innerHTML = `
      <i class="${icon} toast-icon"></i>
      <div class="toast-text">${message}</div>
      <button class="toast-close" type="button" onclick="this.closest('.portal-toast').remove()" aria-label="Dismiss">&times;</button>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = 'all 0.3s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
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


  // =========================================================================
  // EXAMINATION & SEATING MATRIX DATA AND HANDLERS
  // =========================================================================

  const EXAM_HALLS_DATA = {
    'Hall 1': {
      name: 'Hall 1 (Rooms 101-102)',
      rooms: 'Rooms 101-102',
      floor: 'First Floor, Main Academic Block',
      capacityTotal: 78,
      desksCount: 39,
      strategy: 'Alternate Diagonal',
      primaryClass: 'Class X-A',
      secondaryClass: 'Class IX-A',
      invigilators: 'Smt. M. Sunitha (Room 101) • Sri K. Rajesh (Room 102)',
      reliever: 'Sri P. Satyanarayana'
    },
    'Hall 2': {
      name: 'Hall 2 (Rooms 103-104)',
      rooms: 'Rooms 103-104',
      floor: 'First Floor, Main Academic Block',
      capacityTotal: 78,
      desksCount: 39,
      strategy: 'Alternate Diagonal',
      primaryClass: 'Class VIII-A',
      secondaryClass: 'Class VII-A',
      invigilators: 'Sri B. Narayana (Room 103) • Smt. V. Jyothsna (Room 104)',
      reliever: 'Sri D. Srinivas'
    },
    'Hall 3': {
      name: 'Hall 3 (Rooms 201-202)',
      rooms: 'Rooms 201-202',
      floor: 'Second Floor, Science & Lab Wing',
      capacityTotal: 70,
      desksCount: 35,
      strategy: 'Alternate Diagonal',
      primaryClass: 'Class VI-A',
      secondaryClass: 'Class V-A',
      invigilators: 'Sri CH. Venkateswara Rao (Room 201) • Smt. N. Sirisha (Room 202)',
      reliever: 'Sri S. Gopal'
    },
    'Hall 4': {
      name: 'Hall 4 (Rooms 203-204)',
      rooms: 'Rooms 203-204',
      floor: 'Second Floor, Primary Wing',
      capacityTotal: 70,
      desksCount: 35,
      strategy: 'Alternate Diagonal',
      primaryClass: 'Class IV-A',
      secondaryClass: 'Class III-A',
      invigilators: 'Sri A. Prasad (Room 203) • Smt. R. Kavitha (Room 204)',
      reliever: 'Smt. Y. Anusha'
    }
  };

  function handleExamHallChange(hallName) {
    renderRoomSeatingArrangement(hallName);
    showToast(`Exam Hall Seating Plan loaded for ${hallName}`, 'info');
  }

  function renderRoomSeatingArrangement(hallKey) {
    const hall = EXAM_HALLS_DATA[hallKey] || EXAM_HALLS_DATA['Hall 1'];
    const metricsRow = document.getElementById('examHallMetricsRow');
    const desksContainer = document.getElementById('seatingHallDesksContainer');

    if (metricsRow) {
      metricsRow.innerHTML = `
        <div class="stat-card">
          <div class="stat-label">EXAM HALL VENUE</div>
          <div class="stat-value text-primary" style="font-size: 1.15rem; font-weight: 700; margin-top: 0.25rem;">${hall.name}</div>
          <div class="stat-sub"><i class="fa-solid fa-location-dot"></i> ${hall.floor}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">TOTAL CAPACITY</div>
          <div class="stat-value text-emerald" style="font-size: 1.15rem; font-weight: 700; margin-top: 0.25rem;">${hall.capacityTotal} Candidates</div>
          <div class="stat-sub"><i class="fa-solid fa-arrows-left-right"></i> ${hall.desksCount} Desks Dual Seating (1.2m Compliant)</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">SEATING STRATEGY</div>
          <div class="stat-value text-amber" style="font-size: 1.15rem; font-weight: 700; margin-top: 0.25rem;">${hall.strategy}</div>
          <div class="stat-sub">${hall.primaryClass} + ${hall.secondaryClass}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">SUPERVISING INVIGILATORS</div>
          <div class="stat-value" style="font-size: 0.92rem; font-weight: 600; margin-top: 0.25rem; color: var(--color-text-dark);">${hall.invigilators}</div>
          <div class="stat-sub">Reliever: ${hall.reliever}</div>
        </div>
      `;
    }

    if (desksContainer) {
      let desksHtml = '';
      const primStudents = (state.students && state.students.filter(s => s.class === hall.primaryClass)) || [];
      const secStudents = (state.students && state.students.filter(s => s.class === hall.secondaryClass)) || [];

      for (let i = 1; i <= hall.desksCount; i++) {
        const deskNum = String(i).padStart(2, '0');
        const candA = primStudents[i - 1] || { rollNo: `#10${String(i).padStart(2, '0')}`, name: `Candidate ${i}A` };
        const candB = secStudents[i - 1] || { rollNo: `#9${String(i).padStart(2, '0')}`, name: `Candidate ${i}B` };

        desksHtml += `
          <div class="seating-desk-card">
            <div class="desk-badge">Desk #${deskNum}</div>
            <div class="desk-seat">
              <span class="seat-badge seat-a">A</span>
              <strong style="color: #1e40af;">${candA.rollNo}</strong>
              <div class="cand-name" title="${candA.name}">${candA.name}</div>
            </div>
            <div class="desk-seat">
              <span class="seat-badge seat-b">B</span>
              <strong style="color: #059669;">${candB.rollNo}</strong>
              <div class="cand-name" title="${candB.name}">${candB.name}</div>
            </div>
          </div>
        `;
      }
      desksContainer.innerHTML = desksHtml;
    }
  }

  function printExamSeatingPlan() {
    const hallKey = document.getElementById('examHallSelector')?.value || 'Hall 1';
    const hall = EXAM_HALLS_DATA[hallKey] || EXAM_HALLS_DATA['Hall 1'];

    const printWin = window.open('', '_blank', 'width=950,height=700');
    if (!printWin) {
      showToast('Popup blocked. Please allow popups to print seating plan.', 'warning');
      return;
    }

    const desksContent = document.getElementById('seatingHallDesksContainer')?.innerHTML || '';

    printWin.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Seating Plan - ${hall.name}</title>
        <style>
          @page { size: landscape; margin: 12mm; }
          body { font-family: 'Segoe UI', Tahoma, Arial, sans-serif; margin: 0; padding: 20px; color: #1e293b; background: #fff; }
          .header { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 15px; }
          .school-title { font-size: 20px; font-weight: bold; text-transform: uppercase; margin: 0; color: #0f172a; }
          .sub-title { font-size: 13px; color: #475569; margin-top: 4px; }
          .meta-table { width: 100%; margin-bottom: 15px; border-collapse: collapse; font-size: 12px; }
          .meta-table td { padding: 6px 10px; border: 1px solid #cbd5e1; }
          .meta-table strong { color: #0f172a; }
          .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 8px; margin-top: 15px; }
          .seating-desk-card { border: 1px solid #cbd5e1; border-radius: 4px; padding: 6px; background: #f8fafc; font-size: 11px; }
          .desk-badge { font-weight: bold; background: #0f172a; color: #fff; padding: 2px 4px; border-radius: 3px; font-size: 10px; margin-bottom: 4px; display: inline-block; }
          .desk-seat { margin-top: 4px; padding: 2px 0; border-bottom: 1px dashed #e2e8f0; }
          .seat-badge { display: inline-block; width: 16px; height: 16px; line-height: 16px; text-align: center; border-radius: 50%; font-weight: bold; font-size: 10px; color: #fff; }
          .seat-a { background: #1e40af; }
          .seat-b { background: #059669; }
          .cand-name { font-size: 10px; color: #334155; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
          .signatures { display: flex; justify-content: space-between; margin-top: 30px; font-size: 12px; font-weight: bold; padding-top: 15px; border-top: 1px solid #cbd5e1; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="school-title">SRI VIDYA ENGLISH MEDIUM HIGH SCHOOL</div>
          <div class="sub-title">QUARTERLY EXAMINATIONS 2026 • OFFICIAL SEATING PLAN ROSTER</div>
        </div>
        <table class="meta-table">
          <tr>
            <td><strong>Exam Hall:</strong> ${hall.name}</td>
            <td><strong>Location:</strong> ${hall.floor}</td>
            <td><strong>Capacity:</strong> ${hall.capacityTotal} Candidates (${hall.desksCount} Desks)</td>
          </tr>
          <tr>
            <td><strong>Seating Strategy:</strong> ${hall.strategy}</td>
            <td><strong>Allocated Classes:</strong> ${hall.primaryClass} & ${hall.secondaryClass}</td>
            <td><strong>Invigilators:</strong> ${hall.invigilators}</td>
          </tr>
        </table>
        <div class="grid">${desksContent}</div>
        <div class="signatures">
          <div>Chief Superintendent</div>
          <div>Vice Principal (Sri Navva Anand)</div>
          <div>Principal (Smt. Gorle Varalakshmi)</div>
        </div>
        <script>window.onload = function() { window.print(); window.close(); }</script>
      </body>
      </html>
    `);
    printWin.document.close();
  }

  // =========================================================================
  // TABULATION REGISTER (QUARTERLY EXAMINATION 2026)
  // =========================================================================

  const TABULATION_CANDIDATES = [
    { roll: '#1001', name: 'P. Hema Latha', adm: 'SV-0001', t: 98, h: 96, e: 98, m: 100, sci: 99, soc: 97, gpa: 10.0, status: 'Promoted (A1)' },
    { roll: '#1002', name: 'G. Sai Teja', adm: 'SV-0002', t: 95, h: 94, e: 97, m: 99, sci: 98, soc: 96, gpa: 9.8, status: 'Promoted (A1)' },
    { roll: '#1003', name: 'K. Pravalika', adm: 'SV-0003', t: 94, h: 95, e: 96, m: 98, sci: 97, soc: 95, gpa: 9.7, status: 'Promoted (A1)' },
    { roll: '#1004', name: 'M. Sravanthi', adm: 'SV-0004', t: 92, h: 93, e: 95, m: 98, sci: 96, soc: 94, gpa: 9.6, status: 'Promoted (A1)' },
    { roll: '#1005', name: 'S. Bhavana', adm: 'SV-0005', t: 93, h: 92, e: 96, m: 97, sci: 95, soc: 93, gpa: 9.5, status: 'Promoted (A1)' },
    { roll: '#1006', name: 'B. Tarun Reddy', adm: 'SV-0006', t: 88, h: 86, e: 90, m: 92, sci: 89, soc: 87, gpa: 9.1, status: 'Promoted (A1)' },
    { roll: '#1007', name: 'CH. Karthik', adm: 'SV-0007', t: 89, h: 87, e: 91, m: 93, sci: 90, soc: 88, gpa: 9.2, status: 'Promoted (A1)' },
    { roll: '#1008', name: 'V. Divya Bharathi', adm: 'SV-0008', t: 91, h: 90, e: 93, m: 95, sci: 93, soc: 92, gpa: 9.4, status: 'Promoted (A1)' },
    { roll: '#1009', name: 'SH. Akhil', adm: 'SV-0009', t: 90, h: 88, e: 92, m: 96, sci: 94, soc: 91, gpa: 9.3, status: 'Promoted (A1)' },
    { roll: '#1010', name: 'Y. Manjunath', adm: 'SV-0010', t: 85, h: 84, e: 88, m: 90, sci: 87, soc: 86, gpa: 9.0, status: 'Promoted (A1)' }
  ];

  // Fill up to 35 candidates for Class X-A to perfectly match Screenshot 4
  while (TABULATION_CANDIDATES.length < 35) {
    const idx = TABULATION_CANDIDATES.length + 1;
    const roll = '#10' + String(idx).padStart(2, '0');
    const adm = 'SV-00' + String(idx).padStart(2, '0');
    const isA1 = idx <= 27; // 27 Achievers Distinction
    const mBase = isA1 ? 90 + (idx % 8) : 80 + (idx % 8);
    TABULATION_CANDIDATES.push({
      roll: roll,
      name: (state.students && state.students[idx] && state.students[idx].name) || `Candidate ${idx}`,
      adm: adm,
      t: mBase, h: mBase - 2, e: mBase + 1, m: mBase + 3, sci: mBase + 2, soc: mBase - 1,
      gpa: isA1 ? (9.0 + (idx % 10) * 0.1).toFixed(1) : 8.6,
      status: isA1 ? 'Promoted (A1)' : 'Promoted (A2)'
    });
  }

  function handleTabulationClassChange(classVal) {
    renderTabulationRegisters(classVal);
    showToast(`Tabulation Register loaded for ${classVal}`, 'info');
  }

  function renderTabulationRegisters(classVal) {
    const metricsRow = document.getElementById('tabulationMetricsRow');
    const tbody = document.getElementById('tabulationTableBody');

    const totalCandidates = TABULATION_CANDIDATES.length;
    const passCount = TABULATION_CANDIDATES.length; // 100% pass
    const passRate = 100;
    const distinctionsCount = TABULATION_CANDIDATES.filter(c => parseFloat(c.gpa) >= 9.0).length; // 27 Achievers

    let sumMarks = 0;
    TABULATION_CANDIDATES.forEach(c => {
      const tot = c.t + c.h + c.e + c.m + c.sci + c.soc;
      sumMarks += tot;
    });
    const avgMarks = (sumMarks / totalCandidates).toFixed(1);
    const avgPct = ((avgMarks / 600) * 100).toFixed(1);

    if (metricsRow) {
      metricsRow.innerHTML = `
        <div class="stat-card">
          <div class="stat-label">CANDIDATES APPEARED</div>
          <div class="stat-value text-primary" style="font-size: 1.45rem; font-weight: 700;">${totalCandidates} Candidates</div>
          <div class="stat-sub">100% Attendance Recorded</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">EXAM PASS RATE</div>
          <div class="stat-value text-emerald" style="font-size: 1.45rem; font-weight: 700;">${passRate}% Passed</div>
          <div class="stat-sub">${passCount} of ${totalCandidates} Promoted</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">DISTINCTIONS (A1)</div>
          <div class="stat-value text-amber" style="font-size: 1.45rem; font-weight: 700;">${distinctionsCount} Achievers</div>
          <div class="stat-sub">GPA &ge; 9.0 Rating</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">CLASS COMPOSITE AVG</div>
          <div class="stat-value text-primary" style="font-size: 1.45rem; font-weight: 700;">${avgPct}% (${avgMarks} M)</div>
          <div class="stat-sub">Verified by VP Navva Anand</div>
        </div>
      `;
    }

    if (tbody) {
      tbody.innerHTML = TABULATION_CANDIDATES.map(c => {
        const tot = c.t + c.h + c.e + c.m + c.sci + c.soc;
        const pct = ((tot / 600) * 100).toFixed(1);
        return `
          <tr>
            <td><strong>${c.roll}</strong></td>
            <td><strong>${c.name}</strong></td>
            <td><span class="portal-badge badge-primary">${c.adm}</span></td>
            <td>${c.t}</td>
            <td>${c.h}</td>
            <td>${c.e}</td>
            <td>${c.m}</td>
            <td>${c.sci}</td>
            <td>${c.soc}</td>
            <td><strong>${tot}</strong></td>
            <td>${pct}%</td>
            <td><strong>${c.gpa}</strong></td>
            <td><span class="portal-badge badge-success">${c.status}</span></td>
            <td>
              <button class="btn btn-secondary btn-sm" onclick="portalApp.printStudentMarksMemo('${c.adm}')" title="Print Marks Memo">
                <i class="fa-solid fa-file-invoice"></i> Memo
              </button>
            </td>
          </tr>
        `;
      }).join('');
    }
  }

  function printTabulationRegister() {
    window.print();
  }

  function exportTabulationCSV() {
    let csv = 'Roll Number,Candidate Name,Admission No,Telugu,Hindi,English,Mathematics,General Science,Social Studies,Total (600),Percentage,GPA,Result Status\n';
    TABULATION_CANDIDATES.forEach(c => {
      const tot = c.t + c.h + c.e + c.m + c.sci + c.soc;
      const pct = ((tot / 600) * 100).toFixed(1);
      csv += `"${c.roll}","${c.name}","${c.adm}",${c.t},${c.h},${c.e},${c.m},${c.sci},${c.soc},${tot},${pct}%,${c.gpa},"${c.status}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Tabulation_Register_Class_X-A_Quarterly_2026.csv`;
    link.click();
    showToast('Tabulation Register exported as CSV', 'success');
  }

  function printStudentMarksMemo(admNo) {
    const c = TABULATION_CANDIDATES.find(item => item.adm === admNo) || TABULATION_CANDIDATES[0];
    const tot = c.t + c.h + c.e + c.m + c.sci + c.soc;
    const pct = ((tot / 600) * 100).toFixed(1);

    const printWin = window.open('', '_blank', 'width=800,height=600');
    if (!printWin) {
      showToast('Popup blocked. Please allow popups to print Marks Memo.', 'warning');
      return;
    }

    printWin.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Marks Memo - ${c.name}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Arial, sans-serif; padding: 30px; color: #0f172a; }
          .memo-header { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 15px; margin-bottom: 20px; }
          .school-name { font-size: 22px; font-weight: bold; margin: 0; }
          .memo-title { font-size: 14px; font-weight: 600; color: #475569; margin-top: 5px; }
          .info-table { width: 100%; margin-bottom: 20px; font-size: 13px; }
          .marks-table { width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 13px; }
          .marks-table th, .marks-table td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
          .marks-table th { background: #f1f5f9; }
          .signatures { display: flex; justify-content: space-between; margin-top: 40px; font-weight: bold; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="memo-header">
          <div class="school-name">SRI VIDYA ENGLISH MEDIUM HIGH SCHOOL</div>
          <div class="memo-title">QUARTERLY EXAMINATIONS 2026 • STATEMENT OF MARKS</div>
        </div>
        <table class="info-table">
          <tr><td><strong>Candidate Name:</strong> ${c.name}</td><td><strong>Roll Number:</strong> ${c.roll}</td></tr>
          <tr><td><strong>Admission Number:</strong> ${c.adm}</td><td><strong>Class:</strong> Class X - Section A</td></tr>
        </table>
        <table class="marks-table">
          <thead>
            <tr><th>Subject</th><th>Max Marks</th><th>Marks Secured</th><th>Grade</th></tr>
          </thead>
          <tbody>
            <tr><td>First Language (Telugu)</td><td>100</td><td>${c.t}</td><td>A1</td></tr>
            <tr><td>Second Language (Hindi)</td><td>100</td><td>${c.h}</td><td>A1</td></tr>
            <tr><td>Third Language (English)</td><td>100</td><td>${c.e}</td><td>A1</td></tr>
            <tr><td>Mathematics</td><td>100</td><td>${c.m}</td><td>A1</td></tr>
            <tr><td>General Science</td><td>100</td><td>${c.sci}</td><td>A1</td></tr>
            <tr><td>Social Studies</td><td>100</td><td>${c.soc}</td><td>A1</td></tr>
            <tr style="font-weight: bold; background: #f8fafc;"><td>Total Marks</td><td>600</td><td>${tot}</td><td>GPA: ${c.gpa} (${pct}%)</td></tr>
          </tbody>
        </table>
        <div class="signatures">
          <div>Class Teacher (Sri B. Narayana)</div>
          <div>Vice Principal (Sri Navva Anand)</div>
          <div>Principal (Smt. Gorle Varalakshmi)</div>
        </div>
        <script>window.onload = function() { window.print(); window.close(); }</script>
      </body>
      </html>
    `);
    printWin.document.close();
  }

  // =========================================================================
  // HALL TICKET ISSUER (ADMIT CARDS)
  // =========================================================================

  function openIssueHallTicketsModal() {
    openModal('issueHallTicketsModal');
    const classSelect = document.getElementById('hallTicketClassSelect');
    const selectedClass = classSelect ? classSelect.value : 'Class X-A';
    handleHallTicketClassChange(selectedClass);
  }

  function handleHallTicketClassChange(classVal) {
    const studentSelect = document.getElementById('hallTicketStudentSelect');
    if (!studentSelect) return;

    const classCandidates = (state.students && state.students.filter(s => s.class === classVal)) || [];
    const candidates = classCandidates.length > 0 ? classCandidates : [
      { id: '1', rollNo: '#1009', name: 'SH. Akhil', admNo: 'SV-0009', class: classVal, fatherName: 'CH. Yellaiah', dob: '7 Mar 2012', gender: 'MALE' },
      { id: '2', rollNo: '#1001', name: 'P. Hema Latha', admNo: 'SV-0001', class: classVal, fatherName: 'P. Appala Naidu', dob: '14 May 2012', gender: 'FEMALE' },
      { id: '3', rollNo: '#1002', name: 'G. Sai Teja', admNo: 'SV-0002', class: classVal, fatherName: 'G. Venkata Rao', dob: '22 Aug 2012', gender: 'MALE' }
    ];

    studentSelect.innerHTML = candidates.map(c => `
      <option value="${c.admNo}">${c.rollNo} &bull; ${c.name} (${c.admNo})</option>
    `).join('');

    renderHallTicketDocument(candidates[0]);
  }

  function handleHallTicketCandidateChange(admNo) {
    const student = (state.students && state.students.find(s => s.admNo === admNo)) || {
      rollNo: '#1009', name: 'SH. Akhil', admNo: admNo, class: 'Class X-A', fatherName: 'CH. Yellaiah', dob: '7 Mar 2012', gender: 'MALE'
    };
    renderHallTicketDocument(student);
  }

  function renderHallTicketDocument(student) {
    const container = document.getElementById('hallTicketPrintContainer');
    if (!container) return;

    const rollNo = student.rollNo || '#1009';
    const name = (student.name || 'SH. AKHIL').toUpperCase();
    const admNo = student.admNo || 'SV-0009';
    const cls = student.class || 'Class X-A';
    const father = student.fatherName || 'CH. Yellaiah';
    const dobGender = `${student.dob || '7 Mar 2012'} (${(student.gender || 'MALE').toUpperCase()})`;

    container.innerHTML = `
      <div class="hall-ticket-preview-box">
        <div class="hall-ticket-header">
          <div class="school-name">SRI VIDYA ENGLISH MEDIUM HIGH SCHOOL</div>
          <div class="school-affiliation">
            Recognized by Govt. of Andhra Pradesh &bull; Estd. 2017 &bull; School Code: AP-VZM-0482 &bull; Affiliation: 1048291<br>
            Main Campus: Sriharipuram / Gajuwaka, Visakhapatnam - 530026 &bull; Phone: 0891-2554321
          </div>
          <div class="exam-title">QUARTERLY EXAMINATIONS - SEPTEMBER 2026 &bull; OFFICIAL HALL TICKET</div>
          <div class="board-badge">BOARD OF EXAMS &star; 2026 &star; VERIFIED</div>
        </div>

        <div class="hall-ticket-info-card">
          <div class="hall-ticket-info-grid">
            <div class="info-row">
              <span class="info-label">Candidate Name:</span>
              <span class="info-value name-highlight">${name}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Roll Number:</span>
              <span class="info-value roll-highlight">${rollNo}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Admission Number:</span>
              <span class="info-value">${admNo}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Class &amp; Section:</span>
              <span class="info-value">${cls.replace('Class ', '')} - Section A</span>
            </div>
            <div class="info-row">
              <span class="info-label">Father / Guardian Name:</span>
              <span class="info-value">${father}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Date of Birth &amp; Gender:</span>
              <span class="info-value">${dobGender}</span>
            </div>
            <div class="info-row" style="grid-column: 1 / -1;">
              <span class="info-label">Examination Centre:</span>
              <span class="info-value">Sri Vidya EM High School Main Campus (Centre Code: 4820)</span>
            </div>
            <div class="info-row" style="grid-column: 1 / -1;">
              <span class="info-label">Allotted Hall &amp; Desk:</span>
              <span class="info-value text-emerald" style="font-weight: 700;">Hall 1 (Rooms 101-102) &bull; Desk #35 (Seat A)</span>
            </div>
          </div>
          <div class="hall-ticket-photo-box">
            <i class="fa-solid fa-user-graduate"></i>
            <span>Candidate Photo<br><small>Attested</small></span>
          </div>
        </div>

        <table class="hall-ticket-table">
          <thead>
            <tr>
              <th>Date &amp; Day</th>
              <th>Session &amp; Timing</th>
              <th>Paper Code</th>
              <th>Subject Name</th>
              <th>Max Marks</th>
              <th>Invig. Initial</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>24-09-2026</strong> Thursday</td>
              <td>09:30 AM - 12:30 PM</td>
              <td>01T</td>
              <td>First Language (Telugu)</td>
              <td>100</td>
              <td>[ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ]</td>
            </tr>
            <tr>
              <td><strong>25-09-2026</strong> Friday</td>
              <td>09:30 AM - 12:30 PM</td>
              <td>02H</td>
              <td>Second Language (Hindi)</td>
              <td>100</td>
              <td>[ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ]</td>
            </tr>
            <tr>
              <td><strong>26-09-2026</strong> Saturday</td>
              <td>09:30 AM - 12:30 PM</td>
              <td>03E</td>
              <td>Third Language (English)</td>
              <td>100</td>
              <td>[ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ]</td>
            </tr>
            <tr>
              <td><strong>28-09-2026</strong> Monday</td>
              <td>09:30 AM - 12:30 PM</td>
              <td>04M</td>
              <td>Mathematics</td>
              <td>100</td>
              <td>[ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ]</td>
            </tr>
            <tr>
              <td><strong>29-09-2026</strong> Tuesday</td>
              <td>09:30 AM - 12:30 PM</td>
              <td>05S</td>
              <td>General Science</td>
              <td>100</td>
              <td>[ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ]</td>
            </tr>
            <tr>
              <td><strong>30-09-2026</strong> Wednesday</td>
              <td>09:30 AM - 12:30 PM</td>
              <td>06S</td>
              <td>Social Studies</td>
              <td>100</td>
              <td>[ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ]</td>
            </tr>
          </tbody>
        </table>

        <div class="hall-ticket-rules">
          <strong>Mandatory Examination Rules &amp; Vigilance Instructions:</strong>
          <ol>
            <li>Candidate must occupy allotted desk at least 15 minutes before the commencement of examination.</li>
            <li>Possession of mobile phones, smartwatches, or unauthorized study materials leads to immediate debarment.</li>
            <li>Hall Ticket and Student Identity Card are mandatory for verification during each examination session.</li>
          </ol>
        </div>

        <div class="hall-ticket-signatures">
          <div class="sig-block">
            <div class="sig-line"></div>
            Candidate Signature
          </div>
          <div class="sig-block">
            <div class="sig-line"></div>
            Invigilator Verification
          </div>
          <div class="sig-block">
            <div class="sig-line"></div>
            Vice Principal (Sri Navva Anand)
          </div>
          <div class="sig-block">
            <div class="sig-line"></div>
            Principal &amp; Academic Director
          </div>
        </div>
      </div>
    `;
  }

  function printCurrentCandidateHallTicket() {
    const content = document.getElementById('hallTicketPrintContainer')?.innerHTML || '';
    const printWin = window.open('', '_blank', 'width=880,height=720');
    if (!printWin) {
      showToast('Popup blocked. Please allow popups to print Hall Ticket.', 'warning');
      return;
    }

    printWin.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Official Examination Hall Ticket</title>
        <link rel="stylesheet" href="css/portal.css">
        <style>
          @page { size: portrait; margin: 10mm; }
          body { font-family: 'Segoe UI', Tahoma, Arial, sans-serif; margin: 0; padding: 20px; background: #fff; }
          .hall-ticket-preview-box { border: 2px solid #0f172a; padding: 20px; }
        </style>
      </head>
      <body>
        ${content}
        <script>window.onload = function() { window.print(); window.close(); }</script>
      </body>
      </html>
    `);
    printWin.document.close();
  }

  function batchPrintHallTickets() {
    const classVal = document.getElementById('hallTicketClassSelect')?.value || 'Class X-A';
    showToast(`Batch Print queued for all candidates of ${classVal}. Generating official print stream...`, 'info');
    setTimeout(() => {
      printCurrentCandidateHallTicket();
    }, 600);
  }

  function downloadHallTicketPDF() {
    showToast('Generating official Admit Card PDF for archive...', 'info');
    setTimeout(() => {
      printCurrentCandidateHallTicket();
    }, 400);
  }

  // =========================================================================
  // DISCIPLINE SUBVIEWS (GATE LATE, MERIT AWARDS, PARENT CONVOCATIONS)
  // =========================================================================

  function filterDisciplineIncidents(severity) {
    if (severity === 'all') {
      renderDisciplineIncidents(state.disciplineIncidents);
    } else {
      const filtered = state.disciplineIncidents.filter(i => i.severity === severity);
      renderDisciplineIncidents(filtered);
    }
  }

  function renderGateLateComing() {
    const tbody = document.getElementById('morningGateLateTableBody');
    if (!tbody) return;

    if (!state.gateLateRecords || state.gateLateRecords.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" class="text-center p-4 text-muted">No gate late arrivals recorded today. Perfect punctuality!</td></tr>`;
      return;
    }

    tbody.innerHTML = state.gateLateRecords.map(r => `
      <tr id="gate-row-${r.id}">
        <td><strong>${r.student}</strong><br><small class="text-muted">${r.admNo}</small></td>
        <td><strong>${r.class}</strong></td>
        <td><strong class="text-red"><i class="fa-regular fa-clock"></i> ${r.time}</strong></td>
        <td>${r.gate}</td>
        <td>${r.commute}</td>
        <td><span class="portal-badge badge-warning">${r.weeklyCount}</span></td>
        <td>${r.reason}</td>
        <td><small>${r.action}</small></td>
        <td style="text-align: right; white-space: nowrap;">
          <button class="btn btn-secondary btn-sm" onclick="portalApp.sendGateLateSms('${r.id}')" title="Send SMS Notice to Parent">
            <i class="fa-solid fa-paper-plane"></i> SMS
          </button>
          <button class="btn btn-secondary btn-sm" onclick="portalApp.printGateLateSlip('${r.id}')" title="Print Gate Late Slip">
            <i class="fa-solid fa-receipt"></i> Slip
          </button>
        </td>
      </tr>
    `).join('');
  }

  function sendGateLateSms(id) {
    const rec = state.gateLateRecords.find(r => r.id === id);
    if (!rec) return;
    showToast(`SMS Notice dispatched to parents of ${rec.student}: Arrival at ${rec.time} recorded under VP gate protocol.`, 'success');
  }

  function printGateLateSlip(id) {
    const rec = state.gateLateRecords.find(r => r.id === id);
    if (!rec) return;

    const printWin = window.open('', '_blank', 'width=500,height=400');
    if (!printWin) {
      showToast('Popup blocked. Please allow popups to print Gate Slip.', 'warning');
      return;
    }

    printWin.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Gate Late Slip - ${rec.student}</title>
        <style>
          body { font-family: monospace; padding: 20px; font-size: 13px; }
          .border-box { border: 2px dashed #000; padding: 15px; }
          .center { text-align: center; }
          .title { font-weight: bold; font-size: 14px; margin-bottom: 8px; }
          .row { margin: 6px 0; }
        </style>
      </head>
      <body>
        <div class="border-box">
          <div class="center title">SRI VIDYA EM HIGH SCHOOL<br>GATE LATE ADMISSION SLIP</div>
          <hr>
          <div class="row"><strong>Slip Ref:</strong> ${rec.id}</div>
          <div class="row"><strong>Student:</strong> ${rec.student} (${rec.admNo})</div>
          <div class="row"><strong>Class:</strong> ${rec.class}</div>
          <div class="row"><strong>Arrival Time:</strong> ${rec.time} (${rec.weeklyCount})</div>
          <div class="row"><strong>Reason:</strong> ${rec.reason}</div>
          <div class="row"><strong>Gate Officer:</strong> Sri G. Appa Rao (Head Security)</div>
          <div class="row"><strong>VP Authorization:</strong> Permitted to Zero Period</div>
          <br><br>
          <div style="display:flex; justify-content:space-between;">
            <span>Gate Sentry</span>
            <span>Vice Principal</span>
          </div>
        </div>
        <script>window.onload = function() { window.print(); window.close(); }</script>
      </body>
      </html>
    `);
    printWin.document.close();
  }

  function sendBulkGateLateSms() {
    showToast('Bulk SMS dispatched to all parents of late arrivals recorded today.', 'success');
  }

  function printGateLateSheet() {
    window.print();
  }

  function renderMeritAwards() {
    const grid = document.getElementById('meritAwardsGrid');
    if (!grid) return;

    if (!state.meritAwards || state.meritAwards.length === 0) {
      grid.innerHTML = `<div class="p-4 text-center text-muted">No merit awards issued yet.</div>`;
      return;
    }

    grid.innerHTML = state.meritAwards.map(m => `
      <div class="merit-card">
        <div class="merit-card-header">
          <div>
            <div class="merit-student-name">${m.student}</div>
            <div class="merit-class">${m.class} &bull; <strong class="text-primary">${m.id}</strong></div>
          </div>
          <span class="merit-points-badge">${m.points}</span>
        </div>
        <div class="merit-category"><i class="fa-solid fa-award"></i> ${m.category}</div>
        <div class="merit-desc">${m.description}</div>
        <div class="merit-footer">
          <div>
            <small class="text-muted"><i class="fa-solid fa-user-check"></i> ${m.authority}</small><br>
            <small class="text-muted"><i class="fa-regular fa-calendar"></i> ${m.date}</small>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="portalApp.printMeritCertificate('${m.id}')">
            <i class="fa-solid fa-certificate"></i> Print Certificate
          </button>
        </div>
      </div>
    `).join('');
  }

  function openAwardMeritModal() {
    openModal('awardMeritModal');
  }

  function handleAwardMeritSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('meritStudentName')?.value;
    const cls = document.getElementById('meritClass')?.value;
    const cat = document.getElementById('meritCategory')?.value;
    const pts = document.getElementById('meritPoints')?.value;
    const desc = document.getElementById('meritCitation')?.value;

    if (!name || !desc) {
      showToast('Please fill all required merit award fields', 'warning');
      return;
    }

    const newMerit = {
      id: `MRT-2026-0${Math.floor(19 + Math.random() * 50)}`,
      student: name,
      class: cls,
      points: pts,
      category: cat,
      description: desc,
      authority: 'Vice Principal Sri Navva Anand',
      date: 'Today',
      certificateNo: `CERT-MERIT-2026-${Math.floor(105 + Math.random() * 100)}`
    };

    state.meritAwards.unshift(newMerit);
    renderMeritAwards();
    closeModal('awardMeritModal');
    e.target.reset();

    const meritBadge = document.getElementById('tabBadgeDisciplineMerit');
    if (meritBadge) meritBadge.textContent = state.meritAwards.length;

    showToast(`Merit Commendation ${newMerit.id} successfully conferred to ${name}!`, 'success');
  }

  function printMeritCertificate(id) {
    const m = (state.meritAwards && state.meritAwards.find(item => item.id === id)) || state.meritAwards[0];
    const printWin = window.open('', '_blank', 'width=900,height=650');
    if (!printWin) {
      showToast('Popup blocked. Please allow popups to print Certificate.', 'warning');
      return;
    }

    printWin.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Certificate of Merit - ${m.student}</title>
        <style>
          @page { size: landscape; margin: 10mm; }
          body { font-family: 'Georgia', serif; padding: 30px; text-align: center; color: #1e293b; background: #fff; }
          .cert-border { border: 6px double #059669; padding: 30px; border-radius: 8px; }
          .school { font-size: 26px; font-weight: bold; color: #0f172a; text-transform: uppercase; letter-spacing: 1px; }
          .affil { font-size: 13px; color: #64748b; margin-top: 5px; }
          .cert-title { font-size: 22px; font-style: italic; color: #059669; margin: 25px 0 15px; font-weight: bold; }
          .cert-body { font-size: 16px; line-height: 1.8; margin: 20px 40px; }
          .student-name { font-size: 22px; font-weight: bold; color: #0f172a; text-decoration: underline; }
          .points-tag { font-size: 14px; background: #ecfdf5; border: 1px solid #10b981; color: #047857; padding: 4px 12px; border-radius: 20px; font-weight: bold; display: inline-block; margin-top: 10px; }
          .signatures { display: flex; justify-content: space-between; margin-top: 50px; font-size: 14px; font-weight: bold; padding: 0 40px; }
        </style>
      </head>
      <body>
        <div class="cert-border">
          <div class="school">Sri Vidya English Medium High School</div>
          <div class="affil">Recognized by Govt. of Andhra Pradesh &bull; Estd. 2017 &bull; Visakhapatnam</div>
          <div class="cert-title">CERTIFICATE OF CHARACTER &amp; MERIT</div>
          <div class="cert-body">
            This is proudly conferred upon <span class="student-name">${m.student}</span> of <strong>${m.class}</strong><br>
            in recognition of exemplary stewardship in <strong>${m.category}</strong>.<br>
            <em>"${m.description}"</em><br>
            <span class="points-tag">${m.points} Character Honor Credits</span>
          </div>
          <div class="signatures">
            <div>Vice Principal (Sri Navva Anand)</div>
            <div>Official Seal: Sri Vidya E.M High School</div>
            <div>Principal (Smt. Gorle Varalakshmi)</div>
          </div>
        </div>
        <script>window.onload = function() { window.print(); window.close(); }</script>
      </body>
      </html>
    `);
    printWin.document.close();
  }

  function renderParentConvocations() {
    const container = document.getElementById('parentConvocationsContainer');
    if (!container) return;

    if (!state.parentConvocations || state.parentConvocations.length === 0) {
      container.innerHTML = `<div class="p-4 text-center text-muted">No parent convocations scheduled.</div>`;
      return;
    }

    container.innerHTML = `
      <div class="convocation-grid">
        ${state.parentConvocations.map(c => `
          <div class="convocation-card">
            <div class="convocation-header">
              <div>
                <div class="convocation-student">${c.student}</div>
                <div class="convocation-parent">${c.class} &bull; Parent: <strong>${c.parent}</strong> (${c.phone})</div>
                <div class="text-muted text-xs mt-1">Ref ID: <strong class="text-primary">${c.id}</strong></div>
              </div>
              <span class="portal-badge ${c.status === 'Completed' ? 'badge-success' : 'badge-danger'}">
                ${c.status === 'Completed' ? '<i class="fa-solid fa-check"></i> Completed' : '<i class="fa-solid fa-calendar-check"></i> ' + c.status}
              </span>
            </div>

            <div class="convocation-purpose">
              <strong>Agenda:</strong> ${c.purpose}
            </div>

            <div class="convocation-meta">
              <div><i class="fa-regular fa-clock"></i> <strong>Schedule:</strong> ${c.date}</div>
              <div><i class="fa-solid fa-location-dot"></i> <strong>Venue:</strong> ${c.venue}</div>
              <div><i class="fa-solid fa-user-tie"></i> <strong>Presiding:</strong> ${c.officer}</div>
            </div>

            <div class="convocation-actions">
              <button class="btn btn-secondary btn-sm" onclick="portalApp.printSummonsNotice('${c.id}')">
                <i class="fa-solid fa-print"></i> Print Summons Notice
              </button>
              ${c.status === 'Scheduled' ? `
                <button class="btn btn-primary btn-sm" onclick="portalApp.recordConferenceCompleted('${c.id}')">
                  <i class="fa-solid fa-check-double"></i> Record Completed
                </button>
              ` : `
                <span class="portal-badge badge-success"><i class="fa-solid fa-check"></i> Conference Executed &amp; Documented</span>
              `}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  function openScheduleSummonsModal() {
    openModal('scheduleSummonsModal');
  }

  function handleScheduleSummonsSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('summonsStudentName')?.value;
    const cls = document.getElementById('summonsClass')?.value;
    const dt = document.getElementById('summonsDateTime')?.value;
    const phone = document.getElementById('summonsParentPhone')?.value;
    const purpose = document.getElementById('summonsPurpose')?.value;
    const officer = document.getElementById('summonsOfficer')?.value || 'Sri Navva Anand (Vice Principal)';

    if (!name || !purpose) {
      showToast('Please fill all required conference details', 'warning');
      return;
    }

    const newConv = {
      id: `CONV-2026-0${Math.floor(10 + Math.random() * 50)}`,
      student: name,
      class: cls,
      parent: `Guardian of ${name}`,
      phone: phone,
      date: dt,
      venue: 'Vice Principal Chamber (Room 102)',
      purpose: purpose,
      officer: officer,
      status: 'Scheduled'
    };

    state.parentConvocations.unshift(newConv);
    renderParentConvocations();
    closeModal('scheduleSummonsModal');
    e.target.reset();

    const summonsBadge = document.getElementById('tabBadgeDisciplineSummons');
    if (summonsBadge) summonsBadge.textContent = state.parentConvocations.length;

    showToast(`Formal Parent Convocation ${newConv.id} scheduled under Vice Principal docket`, 'success');
  }

  function printSummonsNotice(id) {
    const c = (state.parentConvocations && state.parentConvocations.find(item => item.id === id)) || state.parentConvocations[0];
    const printWin = window.open('', '_blank', 'width=800,height=650');
    if (!printWin) {
      showToast('Popup blocked. Please allow popups to print Summons Notice.', 'warning');
      return;
    }

    printWin.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Parent Summons Notice - ${c.student}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Arial, sans-serif; padding: 30px; color: #0f172a; line-height: 1.6; }
          .header { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 15px; margin-bottom: 20px; }
          .school { font-size: 20px; font-weight: bold; }
          .sub { font-size: 13px; color: #475569; }
          .notice-badge { text-align: center; font-size: 16px; font-weight: bold; color: #dc2626; margin: 15px 0; letter-spacing: 0.5px; }
          .details-table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px; }
          .details-table td { padding: 8px 12px; border: 1px solid #cbd5e1; }
          .signatures { display: flex; justify-content: space-between; margin-top: 40px; font-weight: bold; font-size: 13px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="school">SRI VIDYA ENGLISH MEDIUM HIGH SCHOOL</div>
          <div class="sub">Office of the Vice Principal & Discipline Committee &bull; Main Campus, Visakhapatnam</div>
        </div>
        <div class="notice-badge">FORMAL SUMMONS &bull; PARENT-VICE PRINCIPAL CONFERENCE</div>
        <p>To,<br>The Parent / Guardian of <strong>${c.student}</strong> (${c.class})<br>Contact Phone: ${c.phone}</p>
        <p>Dear Parent,</p>
        <p>You are hereby requested to attend a formal parent-officer conference at the institution regarding your ward's campus conduct and academic compliance.</p>
        <table class="details-table">
          <tr><td><strong>Reference Docket:</strong></td><td>${c.id}</td></tr>
          <tr><td><strong>Scheduled Date & Time:</strong></td><td><strong>${c.date}</strong></td></tr>
          <tr><td><strong>Venue:</strong></td><td>${c.venue}</td></tr>
          <tr><td><strong>Presiding Authority:</strong></td><td>${c.officer}</td></tr>
          <tr><td><strong>Agenda of Discussion:</strong></td><td>${c.purpose}</td></tr>
        </table>
        <p>Your presence is imperative for signing the mutual student academic and conduct compact.</p>
        <div class="signatures">
          <div>Parent / Guardian Acknowledgment</div>
          <div>Sri Navva Anand<br><small>Vice Principal & Discipline Head</small></div>
        </div>
        <script>window.onload = function() { window.print(); window.close(); }</script>
      </body>
      </html>
    `);
    printWin.document.close();
  }

  function recordConferenceCompleted(id) {
    const c = state.parentConvocations.find(item => item.id === id);
    if (c) {
      c.status = 'Completed';
      renderParentConvocations();
      showToast(`Conference ${id} recorded as Completed in Vice Principal permanent conduct docket`, 'success');
    }
  }

  // =========================================================================
  // OFFICIAL QUESTION PAPER BANK & ASSESSMENT GENERATOR (CLASS 9 MATHEMATICS)
  // =========================================================================

  function renderOfficialQuestionPaper() {
    const box = document.getElementById('questionPaperRenderBox');
    if (!box) return;

    const year = document.getElementById('qpYearSelect')?.value || '2026-27';
    const cls = document.getElementById('qpClassSelect')?.value || 'Class 9';
    const sub = document.getElementById('qpSubjectSelect')?.value || 'Maths';
    const model = document.getElementById('qpModelSelect')?.value || 'model-2';

    box.innerHTML = `
      <div class="question-paper-card" style="background:#ffffff; border: 2px solid #0f172a; border-radius: 8px; padding: 2rem 2.5rem; color: #0f172a; font-family: 'Cambria', 'Georgia', serif; box-shadow: 0 4px 16px rgba(0,0,0,0.06); max-width: 950px; margin: 0 auto;">
        
        <!-- Header -->
        <div style="text-align:center; border-bottom: 2px double #0f172a; padding-bottom: 1rem; margin-bottom: 1.25rem;">
          <div style="font-size: 0.95rem; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase;">
            SRI VIDYA ENGLISH MEDIUM HIGH SCHOOL &bull; VISAKHAPATNAM
          </div>
          <div style="font-size: 1.25rem; font-weight: 800; margin: 4px 0 2px; letter-spacing: 0.5px;">
            SELF ASSESSMENT MODEL QUESTION PAPER – 2
          </div>
          <div style="font-size: 0.9rem; font-weight: 600; color: #334155;">
            CLASS : IX &nbsp;|&nbsp; MATHEMATICS (బహురూప గణితము) &nbsp;|&nbsp; CODE : 920 &nbsp;|&nbsp; SERIES : V - 23
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 700; margin-top: 10px; border-top: 1px dashed #cbd5e1; padding-top: 6px;">
            <span>Time Allowed: 3 Hours 15 Minutes (సమయం: 3 గం. 15 ని.)</span>
            <span>Academic Session: ${year}</span>
            <span>Maximum Marks: 100 (గరిష్ట మార్కులు: 100)</span>
          </div>
        </div>

        <!-- Instructions -->
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 0.85rem 1rem; font-size: 0.82rem; line-height: 1.5; margin-bottom: 1.5rem;">
          <strong style="text-decoration: underline;">GENERAL INSTRUCTIONS (సాధారణ సూచనలు):</strong>
          <ol style="margin: 0.35rem 0 0 1.2rem; padding: 0;">
            <li>First 15 minutes is allotted for reading the question paper thoroughly (మొదటి 15 నిమిషాలు ప్రశ్నపత్రం చదవడానికి కేటాయించబడింది).</li>
            <li>Answer all questions under Part-A and Part-B on separate provided answer sheets and OMR sheet respectively.</li>
            <li>Part-A consists of Section-I (12 Marks), Section-II (16 Marks), Section-III (24 Marks), Section-IV (28 Marks).</li>
            <li>In Section-IV, internal choice is available for every question.</li>
          </ol>
        </div>

        <!-- PART - A -->
        <div style="text-align: center; font-size: 1.05rem; font-weight: 800; background: #0f172a; color: #ffffff; padding: 4px 0; border-radius: 4px; margin-bottom: 1.25rem;">
          PART – A &nbsp;(Marks: 80)
        </div>

        <!-- SECTION - I -->
        <div style="margin-bottom: 1.5rem;">
          <div style="display: flex; justify-content: space-between; font-weight: 700; border-bottom: 1px solid #0f172a; padding-bottom: 4px; margin-bottom: 0.75rem; font-size: 0.92rem;">
            <span>SECTION – I (వెరీ షార్ట్ సమాధాన ప్రశ్నలు)</span>
            <span>6 &times; 2 = 12 Marks</span>
          </div>
          <p style="font-size: 0.82rem; font-style: italic; margin-bottom: 0.75rem;">Note: Answer ALL questions. Each question carries 2 marks.</p>

          <div style="margin-bottom: 0.85rem; font-size: 0.88rem; line-height: 1.5;">
            <strong>1.</strong> Find the decimal expansion of &radic;5 and write whether it is rational or irrational.<br>
            <span style="color:#475569; font-size: 0.82rem;">&radic;5 యొక్క దశాంశ విస్తరణను కనుగొని, అది కరణీయ సంఖ్యయో లేక అకరణీయ సంఖ్యయో తెలపండి.</span>
          </div>

          <div style="margin-bottom: 0.85rem; font-size: 0.88rem; line-height: 1.5;">
            <strong>2.</strong> Factorize: <em>x</em><sup>2</sup> + 9<em>x</em> + 18 using splitting the middle term method.<br>
            <span style="color:#475569; font-size: 0.82rem;">మధ్య పదాన్ని విభజించే పద్ధతి ద్వారా <em>x</em><sup>2</sup> + 9<em>x</em> + 18 ను కారణాంకాలుగా విభజించండి.</span>
          </div>

          <div style="margin-bottom: 0.85rem; font-size: 0.88rem; line-height: 1.5;">
            <strong>3.</strong> Write the coordinates of the point that lies on both X and Y axes.<br>
            <span style="color:#475569; font-size: 0.82rem;">X మరియు Y అక్షాలు రెండింటిపై ఉండే బిందువు యొక్క నిరూపకాలను రాయండి.</span>
          </div>

          <div style="margin-bottom: 0.85rem; font-size: 0.88rem; line-height: 1.5;">
            <strong>4.</strong> In &Delta;ABC, if &ang;A = 70&deg; and &ang;B = 60&deg;, find &ang;C.<br>
            <span style="color:#475569; font-size: 0.82rem;">&Delta;ABC లో, &ang;A = 70&deg; మరియు &ang;B = 60&deg; అయితే, &ang;C విలువను కనుగొనండి.</span>
          </div>

          <div style="margin-bottom: 0.85rem; font-size: 0.88rem; line-height: 1.5;">
            <strong>5.</strong> Write Euclid's 5th Postulate in your own words.<br>
            <span style="color:#475569; font-size: 0.82rem;">యూక్లిడ్ 5వ స్వీకృతాన్ని మీ స్వంత మాటలలో రాయండి.</span>
          </div>

          <div style="margin-bottom: 0.85rem; font-size: 0.88rem; line-height: 1.5;">
            <strong>6.</strong> Find the mean of first five prime numbers.<br>
            <span style="color:#475569; font-size: 0.82rem;">మొదటి ఐదు ప్రధాన సంఖ్యల సగటును కనుగొనండి.</span>
          </div>
        </div>

        <!-- SECTION - II -->
        <div style="margin-bottom: 1.5rem;">
          <div style="display: flex; justify-content: space-between; font-weight: 700; border-bottom: 1px solid #0f172a; padding-bottom: 4px; margin-bottom: 0.75rem; font-size: 0.92rem;">
            <span>SECTION – II (షార్ట్ సమాధాన ప్రశ్నలు)</span>
            <span>4 &times; 4 = 16 Marks</span>
          </div>
          <p style="font-size: 0.82rem; font-style: italic; margin-bottom: 0.75rem;">Note: Answer ALL questions. Each question carries 4 marks.</p>

          <div style="margin-bottom: 0.85rem; font-size: 0.88rem; line-height: 1.5;">
            <strong>7.</strong> Represent &radic;3 on the Number Line using geometric construction and justify.<br>
            <span style="color:#475569; font-size: 0.82rem;">సంఖ్యా రేఖపై &radic;3 ను జ్యామితీయ నిర్మాణం ద్వారా సూచించండి మరియు సమర్థించండి.</span>
          </div>

          <div style="margin-bottom: 0.85rem; font-size: 0.88rem; line-height: 1.5;">
            <strong>8.</strong> Verify whether (<em>x</em> + 1) is a factor of polynomial <em>P(x)</em> = 2<em>x</em><sup>3</sup> + <em>x</em><sup>2</sup> - 2<em>x</em> - 1.<br>
            <span style="color:#475569; font-size: 0.82rem;"><em>P(x)</em> = 2<em>x</em><sup>3</sup> + <em>x</em><sup>2</sup> - 2<em>x</em> - 1 బహుపదికి (<em>x</em> + 1) కారణాంకమౌతుందో లేదో సరిచూడండి.</span>
          </div>

          <div style="margin-bottom: 0.85rem; font-size: 0.88rem; line-height: 1.5;">
            <strong>9.</strong> In the given figure below, line <em>AB</em> &parallel; <em>CD</em> and transversal line <em>EF</em> intersects them at <em>G</em> and <em>H</em>. If &ang;AGH = (3<em>x</em> + 15)&deg; and &ang;GHD = (2<em>x</em> + 35)&deg;, find value of <em>x</em> and all interior alternate angles.<br>
            <span style="color:#475569; font-size: 0.82rem;">క్రింది పటంలో, <em>AB</em> &parallel; <em>CD</em> మరియు తిర్యగ్రేఖ <em>EF</em> వాటిని <em>G</em> మరియు <em>H</em> ల వద్ద ఖండిస్తుంది. <em>x</em> విలువ మరియు ఏకాంతర కోణాలను కనుగొనండి.</span>
            
            <!-- Ray Diagram SVG -->
            <div style="text-align: center; margin: 10px 0;">
              <svg width="340" height="130" viewBox="0 0 340 130" style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:4px;">
                <!-- Line AB -->
                <line x1="20" y1="35" x2="320" y2="35" stroke="#0f172a" stroke-width="2.5" />
                <polygon points="15,35 25,30 25,40" fill="#0f172a" />
                <polygon points="325,35 315,30 315,40" fill="#0f172a" />
                <text x="30" y="25" font-size="12" font-weight="bold">A</text>
                <text x="305" y="25" font-size="12" font-weight="bold">B</text>
                <!-- Line CD -->
                <line x1="20" y1="95" x2="320" y2="95" stroke="#0f172a" stroke-width="2.5" />
                <polygon points="15,95 25,90 25,100" fill="#0f172a" />
                <polygon points="325,95 315,90 315,100" fill="#0f172a" />
                <text x="30" y="115" font-size="12" font-weight="bold">C</text>
                <text x="305" y="115" font-size="12" font-weight="bold">D</text>
                <!-- Transversal EF -->
                <line x1="70" y1="10" x2="270" y2="120" stroke="#2563eb" stroke-width="2" />
                <text x="60" y="15" font-size="12" font-weight="bold" fill="#2563eb">E</text>
                <text x="275" y="125" font-size="12" font-weight="bold" fill="#2563eb">F</text>
                <!-- Intersection points -->
                <circle cx="115" cy="35" r="3.5" fill="#dc2626" />
                <text x="122" y="30" font-size="11" font-weight="bold">G</text>
                <circle cx="225" cy="95" r="3.5" fill="#dc2626" />
                <text x="232" y="90" font-size="11" font-weight="bold">H</text>
                <!-- Angle arcs -->
                <path d="M 125,35 A 15 15 0 0 1 120,43" stroke="#dc2626" fill="none" stroke-width="1.5" />
                <text x="75" y="52" font-size="10" fill="#dc2626">(3x+15)&deg;</text>
                <path d="M 215,95 A 15 15 0 0 1 220,87" stroke="#dc2626" fill="none" stroke-width="1.5" />
                <text x="230" y="80" font-size="10" fill="#dc2626">(2x+35)&deg;</text>
              </svg>
            </div>
          </div>

          <div style="margin-bottom: 0.85rem; font-size: 0.88rem; line-height: 1.5;">
            <strong>10.</strong> The following are marks scored by 10 students in Class IX Mathematics test: 45, 62, 78, 89, 56, 92, 78, 85, 78, 90. Find the Mean, Median, and Mode of this data.<br>
            <span style="color:#475569; font-size: 0.82rem;">10 మంది విద్యార్థుల గణిత పరీక్ష మార్కులు ఇవ్వబడ్డాయి. ఈ దత్తాంశమునకు అంకమధ్యమము, మధ్యగతము మరియు బాహుళకములను కనుగొనండి.</span>
          </div>
        </div>

        <!-- SECTION - III & IV Summary -->
        <div style="background: #f1f5f9; padding: 0.85rem 1rem; border-radius: 6px; font-size: 0.84rem; text-align: center; color: #334155;">
          <strong>Section-III (3 &times; 8 = 24M) &amp; Section-IV (Choice Questions: 2 &times; 14 = 28M) + Part-B Objective OMR (20 &times; 1 = 20M)</strong><br>
          <span style="font-size: 0.78rem;">Full paper containing all 33 questions with complete Telugu/English bilingual translations is ready for printing.</span>
        </div>
      </div>
    `;
  }

  function printOfficialQuestionPaper() {
    window.print();
  }

  function exportQuestionPaperPDF() {
    showToast('Preparing official Class 9 Mathematics Question Paper PDF...', 'info');
    setTimeout(() => {
      window.print();
    }, 300);
  }

  function handlePaperFilterChange() {
    renderOfficialQuestionPaper();
    showToast('Question Paper preview updated for selected parameters', 'info');
  }

  function openAddQuestionModal() {
    showToast('Add Custom Examination Question modal initializing...', 'info');
  }

  // =========================================================================
  // BULK IMPORT, REGISTERS, ATTENDANCE & EXPORT UTILITIES
  // =========================================================================

  function downloadCsvFile(content, filename) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function openImportModal() {
    openModal('importStudentsModal');
  }

  function openStaffImportModal() {
    navigateTo('teachers', 'import');
    switchSubTab('teachers', 'import');
  }

  function downloadStaffSampleCsv() {
    const csvContent = 'StaffType,FullName,Designation,Department,Qualification,Experience,Phone,Email,Status\n' +
      'Teaching,Sri P. Rajesh Kumar,Faculty - Mathematics,Mathematics,M.Sc B.Ed,10 Years,9848099881,rajesh.maths@srividya.edu,Present\n' +
      'Non-Teaching,Sri K. Nagaraju,Laboratory Technician,Laboratories,B.Sc (Chemistry),4 Years,9848099882,nagaraju.lab@srividya.edu,Present\n' +
      'Teaching,Smt. V. Anuradha,Faculty - English,English,M.A B.Ed,8 Years,9848099883,anuradha.eng@srividya.edu,Present\n';
    downloadCsvFile(csvContent, 'sri_vidya_staff_import_sample.csv');
    showToast('Downloaded official Faculty & Staff Import Sample CSV', 'success');
  }

  function downloadCurrentStaffCsv() {
    let csv = 'Name,Role,Qualification,Experience,Subject,Phone,Email,Status\n';
    (state.faculty || []).forEach(f => {
      csv += `"${f.name}","${f.role}","${f.qualification}","${f.exp}","${f.subject}","${f.phone}","${f.email}","${f.status}"\n`;
    });
    downloadCsvFile(csv, 'sri_vidya_faculty_staff_roster.csv');
    showToast(`Exported ${state.faculty.length} staff records to CSV`, 'success');
  }

  function resetStaffCsvUpload() {
    const fileInput = document.getElementById('staffSubviewFileInput');
    if (fileInput) fileInput.value = '';
    const infoBox = document.getElementById('staffSubviewFileInfoBox');
    if (infoBox) infoBox.style.display = 'none';
    const pasteBox = document.getElementById('staffSubviewPasteInput');
    if (pasteBox) pasteBox.value = '';
    const preview = document.getElementById('staffSubviewPreviewSection');
    if (preview) preview.style.display = 'none';
    const btn = document.getElementById('btnConfirmStaffImportSubview');
    if (btn) btn.disabled = true;
    showToast('Staff import workspace reset', 'info');
  }

  function loadDemoStaffCsvToPaste() {
    const pasteBox = document.getElementById('staffSubviewPasteInput');
    if (pasteBox) {
      pasteBox.value = 'StaffType,FullName,Designation,Department,Qualification,Experience,Phone,Email,Status\n' +
        'Teaching,Sri P. Rajesh Kumar,Faculty - Mathematics,Mathematics,M.Sc B.Ed,10 Years,9848099881,rajesh.maths@srividya.edu,Present\n' +
        'Non-Teaching,Sri K. Nagaraju,Laboratory Technician,Laboratories,B.Sc (Chemistry),4 Years,9848099882,nagaraju.lab@srividya.edu,Present\n' +
        'Teaching,Smt. V. Anuradha,Faculty - English,English,M.A B.Ed,8 Years,9848099883,anuradha.eng@srividya.edu,Present\n' +
        'Teaching,Sri G. Murali Mohan,Faculty - Social Science,Social Studies,M.A B.Ed,12 Years,9848099884,murali.soc@srividya.edu,Present';
      parsePastedStaffCsv();
    }
  }

  function parsePastedStaffCsv() {
    const pasteBox = document.getElementById('staffSubviewPasteInput');
    const text = (pasteBox ? pasteBox.value : '').trim();
    if (!text) return;
    const lines = text.split('\n').filter(l => l.trim().length > 0);
    if (lines.length <= 1) return;

    const dataLines = lines.slice(1);
    const tbody = document.getElementById('staffSubviewPreviewTbody');
    const countEl = document.getElementById('staffSubviewParsedCount');
    const preview = document.getElementById('staffSubviewPreviewSection');
    const confirmBtn = document.getElementById('btnConfirmStaffImportSubview');

    if (tbody) {
      tbody.innerHTML = dataLines.map((line, idx) => {
        const cols = line.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
        return `
          <tr>
            <td>${idx + 1}</td>
            <td><span class="portal-badge ${cols[0] === 'Teaching' ? 'badge-primary' : 'badge-warning'}">${cols[0] || 'Staff'}</span></td>
            <td><strong>${cols[1] || 'Staff Member'}</strong></td>
            <td>${cols[2] || cols[3] || 'Staff'}</td>
            <td>${cols[4] || 'Graduate'}</td>
            <td>${cols[5] || 'Experienced'}</td>
            <td>${cols[6] || '—'}</td>
            <td>${cols[7] || '—'}</td>
          </tr>
        `;
      }).join('');
    }

    if (countEl) countEl.textContent = dataLines.length;
    if (preview) preview.style.display = 'block';
    if (confirmBtn) confirmBtn.disabled = false;
  }

  function confirmBulkStaffImport() {
    const pasteBox = document.getElementById('staffSubviewPasteInput');
    const text = (pasteBox ? pasteBox.value : '').trim();
    if (!text) {
      showToast('No staff records found to import', 'warning');
      return;
    }
    const lines = text.split('\n').filter(l => l.trim().length > 0);
    const dataLines = lines.slice(1);
    dataLines.forEach(line => {
      const cols = line.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
      if (cols[1]) {
        state.faculty.push({
          name: cols[1],
          role: cols[2] || 'Faculty',
          subject: cols[3] || 'Academics',
          qualification: cols[4] || 'B.Ed',
          exp: cols[5] || '5 Years',
          phone: cols[6] || '9848000000',
          email: cols[7] || 'faculty@srividya.edu',
          status: cols[8] || 'Present'
        });
      }
    });

    renderStaffGrid(state.faculty);
    resetStaffCsvUpload();
    showToast(`Successfully imported ${dataLines.length} staff records into institutional registry!`, 'success');
  }

  let currentActiveDossierTeacherId = null;

  function openFacultyDossier(facultyId) {
    currentActiveDossierTeacherId = facultyId;
    const list = state.faculty || [];
    const member = list.find(f => f.id === facultyId) || list.find(f => f.name === facultyId) || list[0];
    if (!member) {
      showToast('Faculty record not found', 'warning');
      return;
    }

    const container = document.getElementById('facultyDossierBody');
    if (!container) return;

    const initials = (member.name || 'Faculty').replace(/^(Smt\.|Sri\.|Ms\.|Mr\.|Dr\.)\s*/, '').split(' ').map(n => n[0]).join('').slice(0, 2) || 'TC';
    const isUpdated = Boolean(member.lastProfileUpdate || member.profileSynced);
    
    const aadhaarDisplay = member.aadhaar || '5482 1920 3847';
    const panDisplay = member.pan || 'ABCDE1234F';
    const udiseDisplay = member.udise || 'AP-FAC-2017-8821';
    const bankNameDisplay = member.bankName || 'State Bank of India (SBI)';
    const acctHolderDisplay = member.accountHolder || member.name;
    const acctNoDisplay = member.accountNumber || '309812456789';
    const ifscDisplay = member.ifsc || 'SBIN0002145';
    const branchDisplay = member.branch || 'Arundelpet Branch, Guntur';
    const acctTypeDisplay = member.accountType || 'Savings (Salary Linked)';
    const addressDisplay = member.address || 'Flat 402, Sri Sai Balaji Enclave, Main Road, Guntur, AP - 522002';
    const emergencyDisplay = member.emergency || '+91 98480 99887';
    const personalEmailDisplay = member.personalEmail || member.email || 'faculty.personal@gmail.com';
    const officialEmailDisplay = member.officialEmail || member.email || 'faculty@srividya.edu';
    const bioDisplay = member.bio || 'Dedicated educator committed to conceptual clarity, interactive student engagement, and holistic academic excellence.';
    const classesDisplay = member.allocatedClasses || `${member.subject || 'Academics'} (Assigned Classes)`;
    const updatedBadge = isUpdated 
      ? `<span style="display:inline-flex; align-items:center; gap:5px; background:#ecfdf5; color:#047857; border:1px solid #a7f3d0; padding:3px 8px; border-radius:4px; font-size:0.75rem; font-weight:700;"><i class="fa-solid fa-circle-check"></i> Profile Synced from Teacher Portal</span>`
      : `<span style="display:inline-flex; align-items:center; gap:5px; background:#f1f5f9; color:#475569; padding:3px 8px; border-radius:4px; font-size:0.75rem; font-weight:600;"><i class="fa-solid fa-clock"></i> School Record</span>`;

    container.innerHTML = `
      <div class="faculty-dossier-wrapper" style="font-size:0.88rem; color:#0f172a; line-height:1.5;">
        <!-- Top Profile Banner -->
        <div style="display:flex; align-items:center; gap:16px; background:linear-gradient(135deg, #f8fafc, #edf2f7); border:1px solid #e2e8f0; border-radius:10px; padding:16px; margin-bottom:16px;">
          <div style="width:64px; height:64px; border-radius:50%; background:linear-gradient(135deg, #1e3a8a, #2563eb); color:#fff; display:flex; align-items:center; justify-content:center; font-size:1.4rem; font-weight:800; box-shadow:0 4px 10px rgba(37,99,235,0.25); flex-shrink:0;">
            ${initials}
          </div>
          <div style="flex:1;">
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <h2 style="margin:0; font-size:1.25rem; font-weight:800; color:#0f172a;">${member.name}</h2>
              <span class="teacher-id-badge" style="font-family:monospace; font-size:0.9rem; font-weight:800; background:#eff6ff; color:#1d4ed8; border:1px solid #bfdbfe; padding:2px 10px; border-radius:4px;">${member.id}</span>
            </div>
            <div style="color:#475569; font-weight:600; margin-top:2px;">${member.role}</div>
            <div style="display:flex; align-items:center; gap:8px; margin-top:6px; flex-wrap:wrap;">
              <span class="portal-badge badge-success">${member.status || 'Active'}</span>
              ${updatedBadge}
              ${member.lastProfileUpdate ? `<span style="font-size:0.75rem; color:#64748b;"><i class="fa-solid fa-clock-rotate-left"></i> Last Profile Edit: <strong>${member.lastProfileUpdate}</strong></span>` : ''}
            </div>
          </div>
        </div>

        <!-- 2-Column Info Grid -->
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:14px; margin-bottom:14px;">
          
          <!-- Column 1: Contact & Personal -->
          <div style="background:#fff; border:1px solid #e2e8f0; border-radius:8px; padding:12px 14px;">
            <div style="font-weight:700; color:#1e293b; border-bottom:1px solid #f1f5f9; padding-bottom:6px; margin-bottom:10px; display:flex; align-items:center; gap:6px;">
              <i class="fa-solid fa-phone text-primary"></i> Personal &amp; Contact Details
            </div>
            <div style="display:grid; gap:8px; font-size:0.84rem;">
              <div><strong style="color:#64748b; display:inline-block; width:110px;">Primary Phone:</strong> <a href="tel:${member.phone}" style="color:#2563eb; font-weight:700;">${member.phone || '—'}</a></div>
              <div><strong style="color:#64748b; display:inline-block; width:110px;">Personal Email:</strong> <span>${personalEmailDisplay}</span></div>
              <div><strong style="color:#64748b; display:inline-block; width:110px;">Official Email:</strong> <span>${officialEmailDisplay}</span></div>
              <div><strong style="color:#64748b; display:inline-block; width:110px;">Emergency No:</strong> <span>${emergencyDisplay}</span></div>
              <div><strong style="color:#64748b; display:inline-block; width:110px;">Blood Group:</strong> <span class="portal-badge badge-primary" style="padding:1px 6px;">${member.blood || 'A+'}</span></div>
              <div><strong style="color:#64748b; display:inline-block; width:110px; vertical-align:top;">Address:</strong> <span style="display:inline-block; max-width:calc(100% - 115px);">${addressDisplay}</span></div>
            </div>
          </div>

          <!-- Column 2: Academic & Professional -->
          <div style="background:#fff; border:1px solid #e2e8f0; border-radius:8px; padding:12px 14px;">
            <div style="font-weight:700; color:#1e293b; border-bottom:1px solid #f1f5f9; padding-bottom:6px; margin-bottom:10px; display:flex; align-items:center; gap:6px;">
              <i class="fa-solid fa-graduation-cap text-primary"></i> Academic &amp; Teaching Profile
            </div>
            <div style="display:grid; gap:8px; font-size:0.84rem;">
              <div><strong style="color:#64748b; display:inline-block; width:110px;">Qualification:</strong> <span style="font-weight:700; color:#0f172a;">${member.qualification || '—'}</span></div>
              <div><strong style="color:#64748b; display:inline-block; width:110px;">Experience:</strong> <span>${member.exp || '—'}</span></div>
              <div><strong style="color:#64748b; display:inline-block; width:110px;">Department:</strong> <span>${member.department || member.subject || 'Academics'}</span></div>
              <div><strong style="color:#64748b; display:inline-block; width:110px;">Assigned Classes:</strong> <span style="font-weight:600;">${classesDisplay}</span></div>
              <div><strong style="color:#64748b; display:inline-block; width:110px;">Joining Date:</strong> <span>${member.joinDate || '12-June-2019'}</span></div>
              <div><strong style="color:#64748b; display:inline-block; width:110px; vertical-align:top;">Philosophy:</strong> <span style="font-size:0.8rem; color:#475569; display:inline-block; max-width:calc(100% - 115px);">${bioDisplay}</span></div>
            </div>
          </div>

        </div>

        <!-- Statutory Identity & Bank Payroll -->
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:14px;">
          
          <!-- Column 3: Aadhaar & Govt ID -->
          <div style="background:#fff; border:1px solid #e2e8f0; border-radius:8px; padding:12px 14px;">
            <div style="font-weight:700; color:#1e293b; border-bottom:1px solid #f1f5f9; padding-bottom:6px; margin-bottom:10px; display:flex; align-items:center; justify-content:space-between;">
              <span style="display:flex; align-items:center; gap:6px;"><i class="fa-solid fa-address-card" style="color:#059669;"></i> Aadhaar &amp; Govt Identity</span>
              <span style="font-size:0.75rem; color:#059669; background:#ecfdf5; padding:1px 6px; border-radius:3px; font-weight:700;">Verified</span>
            </div>
            <div style="display:grid; gap:8px; font-size:0.84rem;">
              <div><strong style="color:#64748b; display:inline-block; width:120px;">Aadhaar UID:</strong> <code style="font-weight:700; font-size:0.9rem; color:#0f172a; background:#f8fafc; padding:2px 6px; border-radius:4px; border:1px solid #cbd5e1;">${aadhaarDisplay}</code></div>
              <div><strong style="color:#64748b; display:inline-block; width:120px;">PAN Card:</strong> <code style="font-weight:700; font-size:0.88rem; color:#0f172a; background:#f8fafc; padding:2px 6px; border-radius:4px; border:1px solid #cbd5e1; text-transform:uppercase;">${panDisplay}</code></div>
              <div><strong style="color:#64748b; display:inline-block; width:120px;">U-DISE+ Code:</strong> <span style="font-weight:600; color:#334155;">${udiseDisplay}</span></div>
              <div><strong style="color:#64748b; display:inline-block; width:120px;">Aadhaar Mobile:</strong> <span>${member.aadhaarMobile || member.phone || '—'}</span></div>
            </div>
          </div>

          <!-- Column 4: Bank & Salary Details -->
          <div style="background:#fff; border:1px solid #e2e8f0; border-radius:8px; padding:12px 14px;">
            <div style="font-weight:700; color:#1e293b; border-bottom:1px solid #f1f5f9; padding-bottom:6px; margin-bottom:10px; display:flex; align-items:center; justify-content:space-between;">
              <span style="display:flex; align-items:center; gap:6px;"><i class="fa-solid fa-building-columns" style="color:#2563eb;"></i> Bank Account &amp; Payroll</span>
              <span style="font-size:0.75rem; color:#1d4ed8; background:#eff6ff; padding:1px 6px; border-radius:3px; font-weight:700;">Salary Active</span>
            </div>
            <div style="display:grid; gap:8px; font-size:0.84rem;">
              <div><strong style="color:#64748b; display:inline-block; width:120px;">Bank Name:</strong> <span style="font-weight:700; color:#0f172a;">${bankNameDisplay}</span></div>
              <div><strong style="color:#64748b; display:inline-block; width:120px;">Account Holder:</strong> <span>${acctHolderDisplay}</span></div>
              <div><strong style="color:#64748b; display:inline-block; width:120px;">Account Number:</strong> <code style="font-weight:700; font-size:0.88rem; color:#0f172a; background:#f8fafc; padding:2px 6px; border-radius:4px; border:1px solid #cbd5e1;">${acctNoDisplay}</code></div>
              <div><strong style="color:#64748b; display:inline-block; width:120px;">IFSC Code:</strong> <code style="font-weight:700; font-size:0.88rem; color:#0f172a; background:#f8fafc; padding:2px 6px; border-radius:4px; border:1px solid #cbd5e1; text-transform:uppercase;">${ifscDisplay}</code></div>
              <div><strong style="color:#64748b; display:inline-block; width:120px;">Branch:</strong> <span>${branchDisplay}</span></div>
              <div><strong style="color:#64748b; display:inline-block; width:120px;">Account Type:</strong> <span>${acctTypeDisplay}</span></div>
            </div>
          </div>

        </div>
      </div>
    `;

    openModal('viewFacultyDossierModal');
  }

  function printFacultyDossier(idOrName) {
    const list = state.faculty || [];
    const target = idOrName || currentActiveDossierTeacherId;
    const member = list.find(f => f.id === target) || list.find(f => f.name === target) || list[0];
    const printWin = window.open('', '_blank', 'width=850,height=700');
    if (!printWin) {
      window.print();
      return;
    }
    printWin.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Faculty Official Record Dossier - ${member.name} (${member.id})</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, sans-serif; padding: 25px; color: #0f172a; }
          .header { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 20px; }
          .school { font-size: 20px; font-weight: bold; }
          .sub { font-size: 13px; color: #475569; }
          .badge { text-align: center; margin: 15px 0; font-size: 15px; font-weight: bold; color: #1e3a8a; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          td { padding: 8px 12px; border: 1px solid #cbd5e1; font-size: 13px; }
          td strong { color: #0f172a; }
          .section-head { background: #f1f5f9; font-weight: bold; color: #1e293b; text-transform: uppercase; font-size: 12px; }
          .sign { display: flex; justify-content: space-between; margin-top: 45px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="school">SRI VIDYA ENGLISH MEDIUM HIGH SCHOOL</div>
          <div class="sub">Affiliated to Board of Secondary Education, A.P. &bull; Guntur / Visakhapatnam</div>
        </div>
        <div class="badge">CONFIDENTIAL FACULTY &amp; STAFF SERVICE DOSSIER</div>
        <table>
          <tr class="section-head"><td colspan="2">Personal &amp; Service Identification</td></tr>
          <tr><td width="35%"><strong>Employee School ID:</strong></td><td>${member.id}</td></tr>
          <tr><td><strong>Employee Full Name:</strong></td><td>${member.name}</td></tr>
          <tr><td><strong>Designation / Role:</strong></td><td>${member.role}</td></tr>
          <tr><td><strong>Academic Qualifications:</strong></td><td>${member.qualification}</td></tr>
          <tr><td><strong>Teaching Experience:</strong></td><td>${member.exp}</td></tr>
          <tr><td><strong>Primary Department / Subject:</strong></td><td>${member.subject || member.department || '—'}</td></tr>
          <tr><td><strong>Assigned Classes:</strong></td><td>${member.allocatedClasses || '—'}</td></tr>
          <tr><td><strong>Joining Date:</strong></td><td>${member.joinDate || '12-June-2019'}</td></tr>
          <tr><td><strong>Current Service Status:</strong></td><td>${member.status || 'Active'}</td></tr>

          <tr class="section-head"><td colspan="2">Contact &amp; Residential Information</td></tr>
          <tr><td><strong>Primary Mobile / WhatsApp:</strong></td><td>${member.phone}</td></tr>
          <tr><td><strong>Personal Email Address:</strong></td><td>${member.personalEmail || member.email || '—'}</td></tr>
          <tr><td><strong>Official Institutional Email:</strong></td><td>${member.officialEmail || member.email || '—'}</td></tr>
          <tr><td><strong>Emergency Contact:</strong></td><td>${member.emergency || '—'}</td></tr>
          <tr><td><strong>Blood Group:</strong></td><td>${member.blood || 'A+'}</td></tr>
          <tr><td><strong>Residential Address:</strong></td><td>${member.address || '—'}</td></tr>

          <tr class="section-head"><td colspan="2">Statutory Govt. Identity &amp; Bank Details</td></tr>
          <tr><td><strong>Aadhaar UID:</strong></td><td>${member.aadhaar || '5482 1920 3847'}</td></tr>
          <tr><td><strong>PAN Card:</strong></td><td>${member.pan || 'ABCDE1234F'}</td></tr>
          <tr><td><strong>U-DISE+ Teacher Code:</strong></td><td>${member.udise || 'AP-FAC-2017-8821'}</td></tr>
          <tr><td><strong>Bank Name:</strong></td><td>${member.bankName || 'State Bank of India (SBI)'}</td></tr>
          <tr><td><strong>Bank Account Number:</strong></td><td>${member.accountNumber || '309812456789'}</td></tr>
          <tr><td><strong>IFSC Code:</strong></td><td>${member.ifsc || 'SBIN0002145'}</td></tr>
          <tr><td><strong>Branch Name &amp; Type:</strong></td><td>${member.branch || 'Main Branch'} &bull; ${member.accountType || 'Savings'}</td></tr>
          <tr><td><strong>Last Profile Synchronization:</strong></td><td>${member.lastProfileUpdate || 'Official Record'}</td></tr>
        </table>
        <div class="sign">
          <div>Faculty Signature: __________________</div>
          <div>Smt. Gorle Varalakshmi<br><small>Principal &amp; Academic Director</small></div>
        </div>
        <script>window.onload = function() { window.print(); window.close(); }</script>
      </body>
      </html>
    `);
    printWin.document.close();
  }

  function getSavedFacultyAttendance(attDate) {
    try {
      const saved = localStorage.getItem('sv_faculty_attendance_' + attDate);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {};
  }

  function handleStudentDeleteClick(admNo) {
    if (!admNo) return;
    const student = state.students.find(s => s.admNo === admNo);
    if (!student) {
      showToast('Student record not found in active directory.', 'warning');
      return;
    }

    // Role check: Only Principal or Vice Principal can permanently delete student records!
    if (state.currentRole !== 'principal' && state.currentRole !== 'vice-principal') {
      openModal('deletePermissionRestrictedModal');
      return;
    }

    const nameEl = document.getElementById('delStudentName');
    const admEl = document.getElementById('delStudentAdmNo');
    const classEl = document.getElementById('delStudentClassRoll');
    const parentEl = document.getElementById('delStudentParent');
    const authEl = document.getElementById('delExecutingAuthority');
    const inputAdm = document.getElementById('delStudentAdmNoInput');
    const tcRefInput = document.getElementById('delTcReferenceInput');
    const remarksInput = document.getElementById('delExecutiveRemarks');

    if (nameEl) nameEl.textContent = student.name;
    if (admEl) admEl.textContent = student.admNo;
    if (classEl) classEl.textContent = `Class ${student.class}-${student.section || 'A'} • Roll #${student.rollNo}`;
    if (parentEl) parentEl.textContent = student.parent || '—';
    if (authEl) authEl.textContent = state.currentRole === 'vice-principal' ? 'Vice Principal Sri Navva Anand' : 'Principal Smt. Gorle Varalakshmi';
    if (inputAdm) inputAdm.value = student.admNo;
    if (tcRefInput) tcRefInput.value = `TC-2026-${student.admNo.replace('SV-', '')}`;
    if (remarksInput) {
      remarksInput.value = '';
      remarksInput.style.borderColor = '#cbd5e1';
      remarksInput.style.boxShadow = 'none';
    }

    openModal('permanentStudentDeleteModal');
  }

  function confirmPermanentStudentDelete() {
    const admNo = document.getElementById('delStudentAdmNoInput')?.value;
    if (!admNo) return;

    if (state.currentRole !== 'principal' && state.currentRole !== 'vice-principal') {
      showToast('Unauthorized: Only Principal or Vice Principal can delete student records.', 'danger');
      return;
    }

    const remarksInput = document.getElementById('delExecutiveRemarks');
    const remarks = (remarksInput?.value || '').trim();
    if (!remarks || remarks.length < 5) {
      showToast('Mandatory Remark Required: Please write a remark explaining why you are deleting this student record before proceeding.', 'danger');
      if (remarksInput) {
        remarksInput.focus();
        remarksInput.style.borderColor = '#dc2626';
        remarksInput.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.2)';
      }
      return;
    }

    const executingRoleTitle = state.currentRole === 'vice-principal' ? 'Vice Principal Sri Navva Anand' : 'Principal Smt. Gorle Varalakshmi';
    const reason = document.getElementById('delReasonSelect')?.value || 'Quit school in middle of academic year / Joined another school';
    const tcRef = (document.getElementById('delTcReferenceInput')?.value || `TC-2026-${admNo.replace('SV-', '')}`).trim();

    const sIdx = state.students.findIndex(s => s.admNo === admNo);
    if (sIdx === -1) {
      closeModal('permanentStudentDeleteModal');
      return;
    }

    const student = state.students[sIdx];
    const studentName = student.name;

    // 1. Archive permanently deleted student with audit details
    const deletedArchive = JSON.parse(localStorage.getItem('sv_deleted_students_archive') || '[]');
    deletedArchive.unshift({
      admNo: student.admNo,
      name: studentName,
      class: student.class,
      section: student.section,
      rollNo: student.rollNo,
      parent: student.parent,
      phone: student.phone,
      reason,
      tcRef,
      remarks,
      deletedBy: executingRoleTitle,
      deletedAt: new Date().toISOString(),
      dateFormatted: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    });
    localStorage.setItem('sv_deleted_students_archive', JSON.stringify(deletedArchive));

    // Also persist into dedicated deletion remarks log
    try {
      const remarksLog = JSON.parse(localStorage.getItem('sv_deletion_remarks_log') || '[]');
      remarksLog.unshift({
        id: 'DEL-' + Date.now(),
        type: 'Student Permanent Deletion',
        admNo: student.admNo,
        name: studentName,
        class: student.class,
        section: student.section || 'A',
        rollNo: student.rollNo,
        reason,
        tcRef,
        remarks,
        deletedBy: executingRoleTitle,
        timestamp: new Date().toISOString(),
        formattedDate: new Date().toLocaleString('en-IN')
      });
      localStorage.setItem('sv_deletion_remarks_log', JSON.stringify(remarksLog));
    } catch (e) {}

    // 2. Track deleted admission numbers so they are permanently retired and filtered on reloads
    const deletedAdmNos = JSON.parse(localStorage.getItem('sv_deleted_student_adm_nos') || '[]');
    if (!deletedAdmNos.includes(admNo)) {
      deletedAdmNos.push(admNo);
      localStorage.setItem('sv_deleted_student_adm_nos', JSON.stringify(deletedAdmNos));
    }

    // 3. Mark in sv_withdrawn_students as permanently purged if present
    try {
      const withdrawnList = JSON.parse(localStorage.getItem('sv_withdrawn_students') || '[]');
      let updated = false;
      withdrawnList.forEach(w => {
        if (w.admNo === admNo || w.name.toLowerCase() === studentName.toLowerCase()) {
          w.permanentlyDeleted = true;
          w.deletedBy = executingRoleTitle;
          w.deletedAt = new Date().toISOString();
          updated = true;
        }
      });
      if (updated) {
        localStorage.setItem('sv_withdrawn_students', JSON.stringify(withdrawnList));
      }
    } catch (e) {}

    // 4. Remove from sv_enrolled_students if present
    try {
      const storedEnrolled = JSON.parse(localStorage.getItem('sv_enrolled_students') || '[]');
      const updatedEnrolled = storedEnrolled.filter(s => s.admNo !== admNo);
      localStorage.setItem('sv_enrolled_students', JSON.stringify(updatedEnrolled));
    } catch (e) {}

    // 5. Purge from state.students and window.STUDENT_ROSTER
    // CRITICAL: NEVER ALTER OR SHIFT ADMISSION NUMBERS OF REMAINING STUDENTS!
    state.students.splice(sIdx, 1);
    if (typeof window !== 'undefined' && Array.isArray(window.STUDENT_ROSTER)) {
      const rIdx = window.STUDENT_ROSTER.findIndex(s => s.admNo === admNo);
      if (rIdx !== -1) window.STUDENT_ROSTER.splice(rIdx, 1);
    }

    // 6. Update badge counters
    const showingEl = document.getElementById('studentShowingCount');
    const totalEl = document.getElementById('studentTotalCount');
    const allBadge = document.getElementById('allStudentsCountBadge');
    const profileBadge = document.getElementById('studentProfilesCountBadge');
    if (showingEl) showingEl.textContent = state.students.length;
    if (totalEl) totalEl.textContent = state.students.length;
    if (allBadge) allBadge.textContent = state.students.length;
    if (profileBadge) profileBadge.textContent = state.students.length;

    // 7. Dispatch formal audit notification
    addNewNotification(
      'Student Record Permanently Deleted',
      `${studentName} (${admNo}) permanently deleted from school registers by ${executingRoleTitle}. Reason: ${reason}. All remaining students retain their fixed admission numbers.`,
      'danger'
    );

    closeModal('permanentStudentDeleteModal');
    filterStudents();
    if (typeof filterStudentProfiles === 'function') filterStudentProfiles();
    renderWithdrawnStudentsPage();

    showToast(`Record for ${studentName} (${admNo}) permanently deleted by ${executingRoleTitle}. Remaining admission numbers remain fixed.`, 'success');
  }

  function renderWithdrawnStudentsPage() {
    const noticesTbody = document.getElementById('withdrawnNoticesTableBody');
    const archiveTbody = document.getElementById('deletedArchiveTableBody');
    const pendingBadge = document.getElementById('pendingWithdrawnBadge');
    const archiveBadge = document.getElementById('deletedArchiveBadge');
    const tabCountBadge = document.getElementById('withdrawnCountBadge');

    const withdrawnList = JSON.parse(localStorage.getItem('sv_withdrawn_students') || '[]');
    const deletedArchive = JSON.parse(localStorage.getItem('sv_deleted_students_archive') || '[]');

    const activePending = withdrawnList.filter(w => !w.permanentlyDeleted);

    if (pendingBadge) pendingBadge.textContent = `${activePending.length} Notice${activePending.length === 1 ? '' : 's'}`;
    if (archiveBadge) archiveBadge.textContent = `${deletedArchive.length} Purged`;
    if (tabCountBadge) tabCountBadge.textContent = activePending.length + deletedArchive.length;

    const isExec = (state.currentRole === 'principal' || state.currentRole === 'vice-principal');

    if (noticesTbody) {
      if (activePending.length === 0) {
        noticesTbody.innerHTML = '<tr><td colspan="6" class="text-center p-4 text-muted"><i class="fa-solid fa-check-double text-emerald" style="font-size:1.3rem; display:block; margin-bottom:4px;"></i>No pending student departure notices from class teachers.</td></tr>';
      } else {
        noticesTbody.innerHTML = activePending.map(item => {
          return `
            <tr>
              <td><strong>${item.name}</strong><br><small class="text-muted">${item.phone || '—'}</small></td>
              <td>Class ${item.class} • #${item.roll}</td>
              <td>
                <span class="portal-badge badge-warning">${item.reason}</span>
                ${item.newSchool ? `<br><small class="text-muted">Target: ${item.newSchool}</small>` : ''}
              </td>
              <td>${item.reportedBy || 'Class Teacher'}</td>
              <td>${item.dateFormatted || 'Recent'}</td>
              <td class="text-center">
                ${isExec ? `
                  <button type="button" class="btn btn-danger btn-sm" onclick="portalApp.handleStudentDeleteClick('${item.admNo}')" title="Executive Authority: Permanently Delete Student Record">
                    <i class="fa-solid fa-trash-can"></i> Permanently Delete
                  </button>
                ` : `
                  <button type="button" class="btn btn-secondary btn-sm" disabled title="Only Principal / VP can delete records">
                    <i class="fa-solid fa-lock"></i> Exec Sign-off Only
                  </button>
                `}
              </td>
            </tr>
          `;
        }).join('');
      }
    }

    if (archiveTbody) {
      if (deletedArchive.length === 0) {
        archiveTbody.innerHTML = '<tr><td colspan="6" class="text-center p-4 text-muted">No students have been permanently deleted from official school records.</td></tr>';
      } else {
        archiveTbody.innerHTML = deletedArchive.map(item => {
          return `
            <tr>
              <td><strong class="text-muted" style="text-decoration: line-through;">${item.admNo}</strong> <span class="portal-badge badge-danger text-xs">Retired</span></td>
              <td><strong>${item.name}</strong><br><small class="text-muted">Parent: ${item.parent || '—'}</small></td>
              <td>Class ${item.class}-${item.section || 'A'}</td>
              <td>
                <span style="font-weight:600; color:#1e293b;">${item.reason}</span>
                ${item.tcRef ? `<br><small class="text-primary font-semibold"><i class="fa-solid fa-receipt"></i> ${item.tcRef}</small>` : ''}
                ${item.remarks ? `<div style="margin-top:5px; font-size:0.8rem; color:#475569; background:#fff1f2; padding:5px 9px; border-radius:5px; border-left:3px solid #dc2626; line-height:1.4;"><strong style="color:#991b1b;"><i class="fa-solid fa-quote-left"></i> Deletion Remark:</strong> "${item.remarks}"</div>` : ''}
              </td>
              <td><strong class="text-primary">${item.deletedBy}</strong></td>
              <td>${item.dateFormatted || 'Recorded'}</td>
            </tr>
          `;
        }).join('');
      }
    }
  }

  function populateStaffAttendanceChecklist() {
    const container = document.getElementById('staffAttendanceChecklist');
    if (!container) return;

    const list = state.faculty || [];
    const dateInput = document.getElementById('staffAttDate');
    const attDate = (dateInput && dateInput.value) ? dateInput.value : new Date().toISOString().split('T')[0];
    const savedAtt = getSavedFacultyAttendance(attDate);

    container.innerHTML = list.map((f, idx) => {
      const currentStatus = savedAtt[f.id] || f.status || (idx === 4 ? 'Leave' : (idx === 7 ? 'Late' : 'Present'));
      return `
        <div class="staff-att-row" data-id="${f.id}">
          <div style="flex:1; min-width:0;">
            <div style="display:flex; align-items:center; gap:6px;">
              <span class="teacher-id-badge" style="font-size:0.75rem; padding:1px 6px;">${f.id}</span>
              <strong style="font-size:0.88rem; color:var(--color-text-dark);">${f.name}</strong>
            </div>
            <small class="text-muted" style="font-size:0.75rem;">${f.role} &bull; ${f.subject || ''}</small>
          </div>
          <div class="staff-att-btn-group">
            <button type="button" class="btn-att-opt ${currentStatus === 'Present' ? 'active-p' : ''}" data-id="${f.id}" data-val="Present" onclick="portalApp.setIndividualStaffStatus('${f.id}', 'Present')" title="Mark Present">P</button>
            <button type="button" class="btn-att-opt ${currentStatus === 'Late' ? 'active-l' : ''}" data-id="${f.id}" data-val="Late" onclick="portalApp.setIndividualStaffStatus('${f.id}', 'Late')" title="Mark Late Arrival">L</button>
            <button type="button" class="btn-att-opt ${currentStatus === 'Leave' ? 'active-od' : ''}" data-id="${f.id}" data-val="Leave" onclick="portalApp.setIndividualStaffStatus('${f.id}', 'Leave')" title="Mark On Leave / OD">OD</button>
            <button type="button" class="btn-att-opt ${currentStatus === 'Absent' ? 'active-a' : ''}" data-id="${f.id}" data-val="Absent" onclick="portalApp.setIndividualStaffStatus('${f.id}', 'Absent')" title="Mark Unscheduled Absent">A</button>
          </div>
        </div>
      `;
    }).join('');
  }

  function setIndividualStaffStatus(facultyId, status) {
    document.querySelectorAll(`.btn-att-opt[data-id="${facultyId}"]`).forEach(btn => {
      btn.classList.remove('active-p', 'active-l', 'active-od', 'active-a');
      const val = btn.getAttribute('data-val');
      if (val === status) {
        if (status === 'Present') btn.classList.add('active-p');
        else if (status === 'Late') btn.classList.add('active-l');
        else if (status === 'Leave') btn.classList.add('active-od');
        else if (status === 'Absent') btn.classList.add('active-a');
      }
    });

    const fac = (state.faculty || []).find(f => f.id === facultyId);
    if (fac) fac.status = status;
  }

  function setAllStaffAttendance(status = 'Present') {
    (state.faculty || []).forEach(f => {
      f.status = status;
      setIndividualStaffStatus(f.id, status);
    });
    if (typeof renderStaffGrid === 'function') renderStaffGrid(state.faculty);
    showToast(`Office Checklist: All institutional staff marked as ${status}`, 'info');
  }

  function bulkMarkAllStaffPresent() {
    setAllStaffAttendance('Present');
  }

  function syncBiometricData() {
    showToast('Biometric terminal connected (IP: 192.168.1.105): Syncing punch logs...', 'info');
    setTimeout(() => {
      showToast('Biometric synchronization complete: 30 of 30 staff punches confirmed on-time.', 'success');
    }, 600);
  }

  function exportBiometricRegisterCSV() {
    let csv = 'EmpID,StaffName,Department,PunchTime,BiometricStatus,Terminal\n';
    (state.faculty || []).forEach((f, i) => {
      csv += `"EMP-${100 + i}","${f.name}","${f.subject}","08:${20 + (i % 20)} AM","${f.status}","Main Gate Biometric-01"\n`;
    });
    downloadCsvFile(csv, 'sri_vidya_biometric_punch_log.csv');
    showToast('Biometric punch log exported to CSV', 'success');
  }

  function exportAbsenteeLedgerCSV() {
    let csv = 'AdmissionNo,StudentName,Class,ParentName,ParentContact,AbsentDate,SMS_Status\n';
    csv += 'SV-0012,K. Manoj Kumar,Class X-A,K. Appa Rao,9848012345,Today,Delivered\n';
    csv += 'SV-0045,S. Deepa,Class IX-A,S. Krishna,9848023456,Today,Delivered\n';
    csv += 'SV-0112,M. Sai Charan,Class VII-A,M. Satish,9848034567,Today,Delivered\n';
    downloadCsvFile(csv, 'sri_vidya_daily_absentee_ledger.csv');
    showToast('Daily absentee ledger exported to CSV', 'success');
  }

  function downloadDailyAttendancePDF() {
    showToast('Generating official Daily Attendance Register PDF...', 'info');
    setTimeout(() => { window.print(); }, 300);
  }

  function openTeacherAttendanceModal() {
    const dateInput = document.getElementById('staffAttDate');
    if (dateInput && !dateInput.value) {
      dateInput.value = new Date().toISOString().split('T')[0];
    }
    populateStaffAttendanceChecklist();
    openModal('teacherAttendanceModal');
  }

  function openSendAbsenteeSmsModal() {
    openModal('sendAbsenteeSmsModal');
  }

  function confirmSendAbsenteeSms() {
    closeModal('sendAbsenteeSmsModal');
    showToast('Absentee automated SMS alerts dispatched to parents of 3 marked absentees.', 'success');
  }

  function printTimetable(classId) {
    showToast(`Opening institutional timetable print spooler for ${classId || 'All Classes'}...`, 'info');
    setTimeout(() => { window.print(); }, 300);
  }

  function printTimetableDaySheet() {
    showToast("Generating today's substitution and day-sheet schedule...", 'info');
    setTimeout(() => { window.print(); }, 300);
  }

  function exportVpTimetableCSV() {
    let csv = 'Class,Day,P1 (09:00-09:45),P2 (09:45-10:30),P3 (10:45-11:30),P4 (11:30-12:15),P5 (01:00-01:45),P6 (01:45-02:30),P7 (02:40-03:25),P8 (03:25-04:10)\n';
    csv += 'Class X-A,Monday,Mathematics (Satyanarayana),Physical Science (Rajesh),English (Sunitha),Telugu (Sarada),Social Studies (Venkata Ramana),Biology (Lakshmi),Computer Science (Srinivas),Sports (Ramesh Babu)\n';
    csv += 'Class IX-A,Monday,Telugu (Padmavathi),Mathematics (Raju),Social Studies (Venkata Ramana),Physical Science (Rajesh),English (Sunitha),Biology (Lakshmi),Mathematics (Satyanarayana),Library (Ranga Rao)\n';
    downloadCsvFile(csv, 'sri_vidya_master_timetable_matrix.csv');
    showToast('Master weekly timetable exported to CSV', 'success');
  }

  function exportDailySubstitutionCSV() {
    let csv = 'Period,AbsentTeacher,Class,AssignedSubstitute,SubstituteSubject,Status\n';
    csv += 'Period 2 (09:45-10:30),Sri K. Rajesh (On Leave),Class X-A,Sri Navva Anand,Physics Lab / Problem Solving,Confirmed\n';
    csv += 'Period 5 (01:00-01:45),Smt. S. Lakshmi (On Duty),Class IX-A,Smt. M. Sunitha,English Communication Lab,Confirmed\n';
    csv += 'Period 7 (02:40-03:25),Sri P. Satyanarayana (Meeting),Class VIII-A,Sri M. Raju,Mathematics Olympiad Drill,Confirmed\n';
    downloadCsvFile(csv, 'sri_vidya_daily_substitutions.csv');
    showToast("Today's substitution register exported to CSV", 'success');
  }

  function openAcademicImportModal() {
    openModal('academicImportModal');
  }

  function downloadAcademicSampleCsv() {
    const csv = 'Class,SubjectCode,SubjectName,Department,PeriodsPerWeek,SyllabusChapters,AssessmentType\n' +
      'Class X,920,Mathematics,Mathematics,8,14,Theory + Practical\n' +
      'Class X,921,Physical Science,Sciences,7,12,Theory + Practical\n' +
      'Class X,922,Social Studies,Social Sciences,6,16,Theory\n';
    downloadCsvFile(csv, 'sri_vidya_academic_curriculum_sample.csv');
    showToast('Academic curriculum sample CSV downloaded', 'success');
  }

  function confirmAcademicImport() {
    closeModal('academicImportModal');
    showToast('Academic curriculum structure updated successfully!', 'success');
  }

  function openScheduleExamModal() {
    openModal('scheduleExamModal');
  }

  function downloadTermGazettePDF() {
    showToast('Generating official Term Gazette Tabulation PDF...', 'info');
    setTimeout(() => { window.print(); }, 300);
  }

  function printExamSchedule() {
    showToast('Printing official Examination Datesheet & Guidelines...', 'info');
    setTimeout(() => { window.print(); }, 300);
  }

  function printInvigilationRoster() {
    showToast('Printing Faculty Room Invigilation Roster...', 'info');
    setTimeout(() => { window.print(); }, 300);
  }

  function openInvigilatorAttendanceModal() {
    openModal('invigilatorAttendanceModal');
  }

  function exportLeaveRegister() {
    exportStaffLeaveLedgerCSV();
  }

  function exportStaffLeaveLedgerCSV() {
    let csv = 'LeaveID,StaffName,LeaveType,FromDate,ToDate,Days,Reason,SubstituteTeacher,ApprovalStatus\n';
    (state.facultyLeaves || []).forEach(l => {
      csv += `"${l.id}","${l.name}","${l.type}","${l.from}","${l.to}","${l.days}","${l.reason}","${l.substitute}","${l.status}"\n`;
    });
    downloadCsvFile(csv, 'sri_vidya_staff_leave_register.csv');
    showToast('Staff leave register exported to CSV', 'success');
  }

  function downloadLeaveRegisterCSV() {
    exportStaffLeaveLedgerCSV();
  }

  function printStudentLeaveRegister() {
    showToast('Printing Student Leave & Medical Records Register...', 'info');
    setTimeout(() => { window.print(); }, 300);
  }

  function printStaffLeaveLedger() {
    showToast('Printing Official Staff Leave Ledger endorsed by Principal...', 'info');
    setTimeout(() => { window.print(); }, 300);
  }

  function printOfficialLeaveRegister() {
    printStaffLeaveLedger();
  }

  function openReserveLabModal() {
    openModal('reserveLabModal');
  }

  function openReserveLabModalFromLog() {
    openModal('reserveLabModal');
  }

  function printCurrentLabLog() {
    showToast('Printing Science & Computer Laboratory Utilization Log...', 'info');
    setTimeout(() => { window.print(); }, 300);
  }

  function openFeeRemindersModal() {
    openModal('feeRemindersModal');
  }

  function dispatchFeeReminders() {
    closeModal('feeRemindersModal');
    showToast('Fee dues SMS & WhatsApp broadcast triggered to 42 student parents.', 'success');
  }

  function openCollectFeeModal() {
    openModal('collectFeeModal');
  }

  function exportDefaultersList() {
    let csv = 'AdmNo,StudentName,Class,ParentName,ParentPhone,DuesAmount,DueDate,NoticeSent\n';
    csv += 'SV-0015,K. Vamsi,Class X-A,K. Prasad,9848011223,₹8,500,10-Oct-2026,Yes\n';
    csv += 'SV-0089,T. Ramya,Class IX-A,T. Ramesh,9848022334,₹12,000,10-Oct-2026,Yes\n';
    csv += 'SV-0145,G. Karthik,Class VIII-A,G. Srinivas,9848033445,₹6,000,10-Oct-2026,Yes\n';
    downloadCsvFile(csv, 'sri_vidya_fee_defaulters_list.csv');
    showToast('Fee defaulters list exported to CSV', 'success');
  }

  function exportFeeAuditReport() {
    let csv = 'ReceiptNo,StudentName,Class,Term,Amount,PaymentMode,TransactionDate,Cashier\n';
    (state.feeTransactions || []).forEach(tx => {
      csv += `"${tx.receiptNo}","${tx.student}","${tx.class}","${tx.term}","${tx.amount}","${tx.mode}","${tx.date}","${tx.cashier}"\n`;
    });
    downloadCsvFile(csv, 'sri_vidya_fee_audit_reconciliation.csv');
    showToast('Fee audit reconciliation report exported to CSV', 'success');
  }

  function printCurrentReceipt(receiptNo) {
    const tx = (state.feeTransactions || []).find(t => t.receiptNo === receiptNo) || (state.feeTransactions && state.feeTransactions[0]) || {
      receiptNo: receiptNo || 'RCPT-2026-0001',
      student: 'P. Hema Latha',
      class: 'Class X-A',
      term: 'Term 2 Tuition Fee',
      amount: '₹14,500',
      mode: 'UPI (PhonePe)',
      date: 'Today',
      cashier: 'S. Ramu'
    };

    const printWin = window.open('', '_blank', 'width=750,height=600');
    if (!printWin) {
      window.print();
      return;
    }
    printWin.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Fee Receipt - ${tx.receiptNo}</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; padding: 25px; color: #0f172a; }
          .header { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 10px; margin-bottom: 15px; }
          .title { font-size: 18px; font-weight: bold; }
          .sub { font-size: 12px; color: #475569; }
          .box { border: 1px solid #cbd5e1; border-radius: 6px; padding: 15px; margin: 15px 0; }
          .row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13.5px; }
          .total { font-size: 16px; font-weight: bold; border-top: 2px dashed #0f172a; padding-top: 10px; color: #15803d; }
          .signatures { display: flex; justify-content: space-between; margin-top: 40px; font-weight: bold; font-size: 13px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">SRI VIDYA ENGLISH MEDIUM HIGH SCHOOL</div>
          <div class="sub">Affiliated to Board of Secondary Education, A.P. &bull; Pendurthi, Visakhapatnam</div>
          <div style="font-weight: bold; margin-top: 5px; color: #1e3a8a;">OFFICIAL FEE RECEIPT</div>
        </div>
        <div class="box">
          <div class="row"><span><strong>Receipt Number:</strong> ${tx.receiptNo}</span><span><strong>Date:</strong> ${tx.date}</span></div>
          <div class="row"><span><strong>Student Name:</strong> ${tx.student}</span><span><strong>Class:</strong> ${tx.class}</span></div>
          <div class="row"><span><strong>Fee Particulars:</strong> ${tx.term}</span><span><strong>Payment Mode:</strong> ${tx.mode}</span></div>
          <div class="row"><span><strong>Authorized Cashier:</strong> ${tx.cashier}</span><span><strong>Status:</strong> <span style="color:#15803d; font-weight:bold;">CLEARED &bull; PAID</span></span></div>
          <div class="row total"><span>TOTAL AMOUNT COLLECTED:</span><span>${tx.amount}</span></div>
        </div>
        <p style="font-size: 11px; color: #64748b; text-align: center;">Computer generated institutional receipt. No physical signature required.</p>
        <div class="signatures">
          <div>Parent / Depositor Signature</div>
          <div>Authorized Accounts Officer<br><small>Sri Vidya High School</small></div>
        </div>
        <script>window.onload = function() { window.print(); window.close(); }</script>
      </body>
      </html>
    `);
    printWin.document.close();
  }

  function downloadReceiptPDF(receiptNo) {
    printCurrentReceipt(receiptNo);
  }

  function openComposeBroadcastModal(type) {
    const modalTitle = document.getElementById('newNoticeModalTitle');
    const form = document.getElementById('composeBroadcastModalForm');
    if (form) form.reset();

    const chNotice = document.getElementById('mBcChannelNotice');
    const chSms = document.getElementById('mBcChannelSms');
    const chWa = document.getElementById('mBcChannelWa');
    const chEmail = document.getElementById('mBcChannelEmail');
    const chPush = document.getElementById('mBcChannelPush');
    const catSelect = document.getElementById('mBcCategory');

    if (type === 'sms') {
      if (modalTitle) modalTitle.innerHTML = '<i class="fa-solid fa-comment-sms text-primary"></i> Compose Urgent SMS Alert';
      if (chNotice) chNotice.checked = false;
      if (chSms) chSms.checked = true;
      if (chWa) chWa.checked = true;
      if (chEmail) chEmail.checked = false;
      if (chPush) chPush.checked = false;
      if (catSelect) catSelect.value = 'Emergency';
    } else if (type === 'email') {
      if (modalTitle) modalTitle.innerHTML = '<i class="fa-solid fa-envelope-open-text text-primary"></i> Compose Campus Email Dispatch';
      if (chNotice) chNotice.checked = false;
      if (chSms) chSms.checked = false;
      if (chWa) chWa.checked = false;
      if (chEmail) chEmail.checked = true;
      if (chPush) chPush.checked = false;
      if (catSelect) catSelect.value = 'Academic';
    } else if (type === 'push') {
      if (modalTitle) modalTitle.innerHTML = '<i class="fa-solid fa-mobile-screen-button text-primary"></i> Compose Mobile App Notification';
      if (chNotice) chNotice.checked = false;
      if (chSms) chSms.checked = false;
      if (chWa) chWa.checked = false;
      if (chEmail) chEmail.checked = false;
      if (chPush) chPush.checked = true;
      if (catSelect) catSelect.value = 'Activity';
    } else if (type === 'notices') {
      if (modalTitle) modalTitle.innerHTML = '<i class="fa-solid fa-scroll text-primary"></i> Publish Official Administrative Circular';
      if (chNotice) chNotice.checked = true;
      if (chSms) chSms.checked = true;
      if (chWa) chWa.checked = true;
      if (chEmail) chEmail.checked = false;
      if (chPush) chPush.checked = false;
      if (catSelect) catSelect.value = 'Academic';
    } else {
      if (modalTitle) modalTitle.innerHTML = '<i class="fa-solid fa-bullhorn text-primary"></i> Compose Campus Broadcast';
      if (chNotice) chNotice.checked = true;
      if (chSms) chSms.checked = true;
      if (chWa) chWa.checked = true;
      if (chEmail) chEmail.checked = false;
      if (chPush) chPush.checked = false;
    }

    updateSmsCharCounter('');
    openModal('newNoticeModal');
  }

  function downloadNoticePdf(noticeId) {
    showToast(`Downloading official signed circular ${noticeId || 'CIRC-2026-04'}...`, 'info');
    setTimeout(() => { window.print(); }, 300);
  }

  function printStudentIdCard(admNo) {
    const student = (state.students || []).find(s => s.admNo === admNo) || state.students[0];
    const printWin = window.open('', '_blank', 'width=600,height=450');
    if (!printWin) {
      window.print();
      return;
    }
    printWin.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Student ID Card - ${student.name}</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #f1f5f9; }
          .id-card { width: 340px; background: #ffffff; border: 2px solid #1e3a8a; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
          .header { background: #1e3a8a; color: white; text-align: center; padding: 12px 10px; }
          .title { font-size: 14px; font-weight: bold; letter-spacing: 0.5px; }
          .sub { font-size: 10px; opacity: 0.9; }
          .body { padding: 16px; text-align: center; }
          .avatar { width: 70px; height: 70px; border-radius: 50%; background: #e2e8f0; border: 2px solid #1e3a8a; margin: 0 auto 10px; display: flex; align-items: center; justify-content: center; font-size: 26px; font-weight: bold; color: #1e3a8a; }
          .name { font-size: 16px; font-weight: bold; color: #0f172a; margin-bottom: 4px; }
          .meta { font-size: 12px; color: #2563eb; font-weight: 700; margin-bottom: 12px; }
          .details { text-align: left; font-size: 12px; line-height: 1.6; border-top: 1px solid #e2e8f0; padding-top: 10px; }
          .footer { background: #f8fafc; border-top: 1px solid #cbd5e1; padding: 8px; font-size: 10px; color: #64748b; text-align: center; }
        </style>
      </head>
      <body>
        <div class="id-card">
          <div class="header">
            <div class="title">SRI VIDYA E.M. HIGH SCHOOL</div>
            <div class="sub">Visakhapatnam &bull; Est. 2017</div>
          </div>
          <div class="body">
            <div class="avatar">${student.name.charAt(0)}</div>
            <div class="name">${student.name}</div>
            <div class="meta">Class ${student.class} - ${student.section} &bull; Roll #${student.rollNo}</div>
            <div class="details">
              <div><strong>Adm No:</strong> ${student.admNo}</div>
              <div><strong>Parent:</strong> ${student.parent}</div>
              <div><strong>Contact:</strong> ${student.phone}</div>
              <div><strong>Valid Through:</strong> Academic Year 2026–27</div>
            </div>
          </div>
          <div class="footer">
            Principal Signature &bull; Sri Vidya High School
          </div>
        </div>
        <script>window.onload = function() { window.print(); window.close(); }</script>
      </body>
      </html>
    `);
    printWin.document.close();
  }

  function printAdmissionVerification(appId) {
    showToast(`Printing admission clearance certificate for application ${appId}...`, 'info');
    setTimeout(() => { window.print(); }, 300);
  }

  function downloadSampleCsv() {
    const csv = 'AdmissionNo,StudentName,Class,Section,RollNo,ParentName,EmergencyPhone,AttendanceRate,FeeStatus,GPA\n' +
      'SV-0501,M. Sai Charan,IX,A,15,M. Venkat,9848011221,95%,Paid,9.2\n' +
      'SV-0502,K. Divya Sree,VIII,A,08,K. Narayana,9848022332,98%,Paid,9.6\n';
    downloadCsvFile(csv, 'sri_vidya_student_import_sample.csv');
    showToast('Downloaded student import template CSV', 'success');
  }

  function downloadCurrentStudentsCsv() {
    let csv = 'AdmissionNo,StudentName,Class,Section,RollNo,ParentName,Phone,Attendance,FeeStatus,GPA\n';
    (state.students || []).forEach(s => {
      csv += `"${s.admNo}","${s.name}","${s.class}","${s.section}","${s.rollNo}","${s.parent}","${s.phone}","${s.attendance}","${s.feeStatus}","${s.gpa}"\n`;
    });
    downloadCsvFile(csv, 'sri_vidya_all_students_500.csv');
    showToast(`Exported ${state.students.length} student records to CSV`, 'success');
  }

  function resetCsvUpload() {
    const input = document.getElementById('studentCsvFileInput');
    if (input) input.value = '';
    const paste = document.getElementById('studentCsvPasteInput');
    if (paste) paste.value = '';
    showToast('Student import workspace cleared', 'info');
  }

  function loadDemoCsvToPaste() {
    const paste = document.getElementById('studentCsvPasteInput');
    if (paste) {
      paste.value = 'AdmissionNo,StudentName,Class,Section,RollNo,ParentName,EmergencyPhone,AttendanceRate,FeeStatus,GPA\n' +
        'SV-0501,M. Sai Charan,IX,A,15,M. Venkat,9848011221,95%,Paid,9.2\n' +
        'SV-0502,K. Divya Sree,VIII,A,08,K. Narayana,9848022332,98%,Paid,9.6\n';
      showToast('Loaded demo student data to import box', 'info');
    }
  }

  function parsePastedCsv() {
    showToast('Parsing pasted student data...', 'info');
  }

  function confirmBulkImport() {
    closeModal('importStudentsModal');
    showToast('Student batch imported successfully into institutional master records!', 'success');
  }

  
  // ── Missing Interactive Functions for Complete Portal Operation ──────────


  // ── Sri Vidya Non-Teaching Staff & Faculty Leaves Interactive Renderers ──────

  function renderNonTeachingStaff(list) {
    const data = list || NON_TEACHING_STAFF_DATA;
    const container = document.getElementById('nonTeachingStaffContainer');
    if (!container) return;

    const countBadge = document.getElementById('staffCountBadge');
    if (countBadge) countBadge.textContent = data.length;

    container.innerHTML = data.map(staff => {
      const initials = staff.name.replace(/^(Smt\.|Sri\.)\s*/, '').split(' ').map(n => n[0]).join('').slice(0, 2);
      return `
        <div class="staff-card" data-staff-id="${staff.id}">
          <div class="staff-card-header">
            <div class="staff-avatar" style="background: linear-gradient(135deg, #0284c7, #0369a1); font-weight:700;">${initials}</div>
            <div class="staff-header-info">
              <h3 class="staff-name">${staff.name}</h3>
              <span class="staff-role">${staff.role}</span>
              <span class="portal-badge badge-success"><i class="fa-solid fa-circle-check"></i> ${staff.status}</span>
            </div>
          </div>
          <div class="staff-details">
            <div class="staff-detail-row">
              <span class="detail-label"><i class="fa-solid fa-building"></i> Department:</span>
              <span class="detail-val font-semibold">${staff.dept}</span>
            </div>
            <div class="staff-detail-row">
              <span class="detail-label"><i class="fa-solid fa-graduation-cap"></i> Qualification:</span>
              <span class="detail-val">${staff.qualification}</span>
            </div>
            <div class="staff-detail-row">
              <span class="detail-label"><i class="fa-solid fa-briefcase"></i> Experience:</span>
              <span class="detail-val">${staff.exp}</span>
            </div>
            <div class="staff-detail-row">
              <span class="detail-label"><i class="fa-solid fa-clock"></i> Duty Hours:</span>
              <span class="detail-val">${staff.shift}</span>
            </div>
            <div class="staff-detail-row">
              <span class="detail-label"><i class="fa-solid fa-phone"></i> Direct Contact:</span>
              <span class="detail-val"><a href="tel:${staff.phone}" class="text-primary font-semibold"><i class="fa-solid fa-phone-volume"></i> ${staff.phone}</a></span>
            </div>
          </div>
          <div class="staff-footer">
            <button class="btn-staff-action" onclick="portalApp.showToast('Duty roster assigned for ${staff.name}', 'success')">
              <i class="fa-solid fa-calendar-check"></i> Assign Shift
            </button>
            <button class="btn-staff-action outline" onclick="portalApp.showToast('Staff Dossier loaded for ${staff.name} (${staff.role})', 'info')">
              <i class="fa-regular fa-id-badge"></i> Dossier
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderTeacherLeaveRequests(list) {
    const container = document.getElementById('facultyLeavesContainer');
    if (!container) return;

    const data = list || (state && state.facultyLeaves) || [];
    const countBadge = document.getElementById('teacherLeaveCountBadge');
    if (countBadge) countBadge.textContent = data.length;

    if (data.length === 0) {
      container.innerHTML = `
        <div class="empty-state p-4 text-center" style="background:#f8fafc; border-radius:10px; border:1px dashed #cbd5e1; padding:2rem;">
          <i class="fa-solid fa-check-double text-emerald" style="font-size:2.2rem; margin-bottom:0.75rem;"></i>
          <h4 style="color:#0f172a; margin-bottom:0.25rem;">All Faculty Leaves Processed</h4>
          <p class="text-muted" style="margin:0;">No pending faculty leave applications requiring VP approval or substitution.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = data.map(req => `
      <div class="approval-item" id="faculty-leave-card-${req.id}" style="display:flex; justify-content:space-between; align-items:flex-start; padding:1.25rem; border:1px solid #e2e8f0; border-radius:10px; margin-bottom:1rem; background:#fff; box-shadow:0 1px 3px rgba(0,0,0,0.04);">
        <div style="flex:1;">
          <div style="display:flex; align-items:center; gap:0.6rem; margin-bottom:0.4rem; flex-wrap:wrap;">
            <strong style="font-size:1.05rem; color:#0f172a;">${req.name}</strong>
            <span class="portal-badge badge-primary">${req.dept}</span>
            <span class="portal-badge badge-warning">${req.type}</span>
          </div>
          <p style="margin:0 0 0.4rem 0; font-size:0.9rem; color:#334155;">
            <strong>Duration:</strong> ${req.dates} &bull; <strong>Reason:</strong> ${req.reason}
          </p>
          <div style="font-size:0.85rem; color:#475569; background:#f8fafc; padding:0.5rem 0.75rem; border-radius:6px; display:inline-block; border-left:3px solid #3b82f6;">
            <i class="fa-solid fa-user-clock text-primary"></i> <strong>Substitution Assigned:</strong> ${req.substitute}
          </div>
        </div>
        <div style="display:flex; gap:0.5rem; align-items:center; margin-left:1rem; flex-wrap:wrap;">
          <button class="btn btn-primary btn-sm" onclick="portalApp.handleVPLeaveAction(${req.id}, true); portalApp.showToast('Leave approved &amp; substitution activated for ${req.name}', 'success');" title="Approve Leave & Confirm Substitution">
            <i class="fa-solid fa-check"></i> Approve
          </button>
          <button class="btn btn-secondary btn-sm" onclick="portalApp.handleVPLeaveAction(${req.id}, false); portalApp.showToast('Reschedule request sent to ${req.name}', 'info');" title="Request Reschedule">
            <i class="fa-solid fa-calendar-xmark"></i> Reschedule
          </button>
        </div>
      </div>
    `).join('');
  }

  function renderStaffImportPreview() {
    const preview = document.getElementById('staffImportPreview');
    if (preview) {
      preview.innerHTML = '<div class="text-muted text-center py-2">No staff records queued for import.</div>';
    }
  }

  function renderSchoolEvents() {
    const container = document.getElementById('schoolEventsContainer');
    if (!container) return;
    const schoolEvents = [
      { title: 'Quarterly Examinations 2026', date: 'Sept 24 - Oct 01, 2026', tag: 'Board Assessments', desc: 'Comprehensive assessments for Classes I through X as per State Board guidelines.' },
      { title: 'Gandhi Jayanti & Swachh Vidya Drive', date: 'Oct 02, 2026', tag: 'Campus Event', desc: 'Patriotic assembly, essay writing, clean campus drive and social awareness rally.' },
      { title: 'Bathukamma & Dussehra Cultural Utsav', date: 'Oct 10, 2026', tag: 'Cultural Festival', desc: 'Traditional floral festival celebrations, cultural dances, and festive distribution.' },
      { title: 'Annual Day Celebrations & Prize Distribution', date: 'Jan 24, 2027', tag: 'Annual Day Gala', desc: 'Grand annual day celebration, academic achievers felicitation, and theatrical presentations.' }
    ];
    renderEventCardsInto(container, schoolEvents);
  }

  function renderCompetitionEvents() {
    const container = document.getElementById('compEventsContainer');
    if (!container) return;
    const compEvents = [
      { title: 'Inter-House Athletic & Sports Meet', date: 'Oct 14 - 16, 2026', tag: 'Sports Championship', desc: 'Track & field championships, kho-kho, volleyball, badminton and chess finals.' },
      { title: 'State Science Olympiad & Talent Search', date: 'Nov 08, 2026', tag: 'State Olympiad', desc: 'Inter-school science talent search and problem-solving competition for high school.' },
      { title: 'National Mathematics Day Celebration', date: 'Dec 22, 2026', tag: 'Math Olympiad', desc: 'Srinivasa Ramanujan memorial quiz competition, mental math olympiad and puzzles.' }
    ];
    renderEventCardsInto(container, compEvents);
  }

  function renderClubActivities() {
    const container = document.getElementById('actEventsContainer');
    if (!container) return;
    const actEvents = [
      { title: 'Children’s Day & Mega Science Expo', date: 'Nov 14, 2026', tag: 'Science & Robotics', desc: 'Interactive robotics, working science experiments, art showcase and cultural gala.' },
      { title: 'Campus Eco-Club Tree Plantation Drive', date: 'Nov 28, 2026', tag: 'Eco Club', desc: 'Environmental conservation drive, 250 sapling plantation, and organic garden launch.' },
      { title: 'Robotics & AI Hands-on Workshop', date: 'Dec 05, 2026', tag: 'Tech Club', desc: 'Hands-on Arduino coding, sensor interfacing, and automated robot demonstrations.' }
    ];
    renderEventCardsInto(container, actEvents);
  }

  function renderEventCardsInto(container, list) {
    container.innerHTML = list.map(ev => `
      <div class="event-card-lg">
        <div class="event-card-top">
          <span class="portal-badge badge-primary">${ev.tag}</span>
          <span class="event-date-text"><i class="fa-regular fa-clock"></i> ${ev.date}</span>
        </div>
        <h3 class="event-card-title">${ev.title}</h3>
        <p class="event-card-desc">${ev.desc}</p>
        <div class="event-card-footer">
          <button class="btn btn-secondary btn-sm" onclick="portalApp.showToast('Event circular dispatched to parents &amp; faculty', 'info')">
            <i class="fa-solid fa-bullhorn"></i> Send Circular
          </button>
          <button class="btn btn-primary btn-sm" onclick="portalApp.showToast('Event dossier opened for ${ev.title}', 'info')">
            <i class="fa-solid fa-pen-to-square"></i> Manage Event
          </button>
        </div>
      </div>
    `).join('');
  }

  function filterFaculty(val) {
    const q = (typeof val === 'string' ? val : (document.getElementById('facultyFilterInput')?.value || '')).toLowerCase().trim();
    const dept = (document.getElementById('facultyDeptFilter')?.value || '').toLowerCase().trim();
    const cards = document.querySelectorAll('#staffGridContainer .staff-card');
    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      const matchQ = !q || text.includes(q);
      const matchDept = !dept || text.includes(dept);
      card.style.display = (matchQ && matchDept) ? '' : 'none';
    });
  }

  function filterNonTeachingStaff(val) {
    const q = (typeof val === 'string' ? val : (document.getElementById('staffFilterInput')?.value || '')).toLowerCase().trim();
    const cards = document.querySelectorAll('#nonTeachingStaffContainer .staff-card');
    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = (!q || text.includes(q)) ? '' : 'none';
    });
  }

  function handleStaffCsvFileUpload(e) {
    const file = e && e.target && e.target.files && e.target.files[0];
    if (file) {
      const badge = document.getElementById('staffCsvFileStatus');
      if (badge) {
        badge.style.display = 'block';
        badge.innerHTML = '<i class="fa-solid fa-file-csv"></i> ' + file.name + ' (' + Math.round(file.size / 1024) + ' KB) — Ready for validation';
      }
      showToast('Staff CSV file loaded: ' + file.name, 'info');
    }
  }

  function filterAcademicClasses(val) {
    const q = (val || '').toLowerCase().trim();
    const rows = document.querySelectorAll('#subview-academics-classes .data-table tbody tr');
    rows.forEach(r => {
      const txt = r.textContent.toLowerCase();
      r.style.display = (!q || txt.includes(q)) ? '' : 'none';
    });
  }

  function renderAcademicClasses() {
    showToast('Academic classes and sections loaded', 'info');
  }

  function renderAcademicSubjects() {
    showToast('Academic subjects and syllabus loaded', 'info');
  }

  function switchTimetableClass(val) {
    const classBadge = document.getElementById('activeTimetableClassBadge');
    if (classBadge) classBadge.textContent = val || 'Class X-A';
    showToast('Switched master timetable to ' + (val || 'Class X-A'), 'info');
  }

  function filterExamsSchedule(val) {
    const q = (val || '').toLowerCase().trim();
    const rows = document.querySelectorAll('#subview-examinations-schedule .data-table tbody tr');
    rows.forEach(r => {
      const txt = r.textContent.toLowerCase();
      r.style.display = (!q || txt.includes(q)) ? '' : 'none';
    });
  }

  function renderExamsSchedule() {
    showToast('Examination schedule loaded', 'info');
  }

  function renderResultsAndGrading() {
    showToast('Academic results & grading sheet loaded', 'info');
  }

  function renderAcademicReports() {
    showToast('Academic performance reports loaded', 'info');
  }

  function filterAttendanceClasses(val) {
    const q = (val || '').toLowerCase().trim();
    const rows = document.querySelectorAll('#subview-attendance-student .data-table tbody tr, #subview-attendance-daily .data-table tbody tr');
    rows.forEach(r => {
      const txt = r.textContent.toLowerCase();
      r.style.display = (q === 'all' || !q || txt.includes(q)) ? '' : 'none';
    });
  }

  function filterTeacherAttendance(val) {
    const q = (val || '').toLowerCase().trim();
    const rows = document.querySelectorAll('#subview-attendance-teacher .data-table tbody tr, #subview-teachers-attendance .data-table tbody tr');
    rows.forEach(r => {
      const txt = r.textContent.toLowerCase();
      r.style.display = (q === 'all' || !q || txt.includes(q)) ? '' : 'none';
    });
  }

  function filterDailyAbsentees(val) {
    const q = (val || '').toLowerCase().trim();
    const rows = document.querySelectorAll('#dailyAbsenteesTableBody tr, #absenteeLedgerTableBody tr');
    rows.forEach(r => {
      const txt = r.textContent.toLowerCase();
      r.style.display = (q === 'all' || !q || txt.includes(q)) ? '' : 'none';
    });
  }

  function switchVpTimetableClass(val) {
    const titleEl = document.getElementById('vpTimetableClassTitle');
    if (titleEl) titleEl.textContent = val || 'Class X-A';
    showToast('Vice Principal timetable view set to ' + (val || 'Class X-A'), 'info');
  }

  function handleExamScheduleClassChange(val) {
    const rows = document.querySelectorAll('#subview-examinations-schedule .data-table tbody tr');
    rows.forEach(r => {
      const txt = r.textContent.toLowerCase();
      r.style.display = (!val || val === 'all' || txt.includes(val.toLowerCase())) ? '' : 'none';
    });
    showToast('Exam schedule filtered by ' + val, 'info');
  }

  function filterFacultyLeaves(val) {
    const q = (val || '').toLowerCase().trim();
    const rows = document.querySelectorAll('#subview-leaves-faculty .data-table tbody tr');
    rows.forEach(r => {
      const txt = r.textContent.toLowerCase();
      r.style.display = (q === 'all' || !q || txt.includes(q)) ? '' : 'none';
    });
  }

  function filterStudentLeaveSlips(val) {
    const q = (val || document.getElementById('studentLeaveSearchInput')?.value || '').toLowerCase().trim();
    const cls = (document.getElementById('studentLeaveClassFilter')?.value || '').toLowerCase().trim();
    const rows = document.querySelectorAll('#subview-leaves-students .data-table tbody tr');
    rows.forEach(r => {
      const txt = r.textContent.toLowerCase();
      const matchQ = !q || txt.includes(q);
      const matchCls = !cls || cls === 'all' || txt.includes(cls);
      r.style.display = (matchQ && matchCls) ? '' : 'none';
    });
  }

  function filterStaffLeaveBalances() {
    const dept = (document.getElementById('staffLeaveBalanceDeptFilter')?.value || '').toLowerCase().trim();
    const rows = document.querySelectorAll('#subview-leaves-history .data-table tbody tr');
    rows.forEach(r => {
      const txt = r.textContent.toLowerCase();
      r.style.display = (!dept || dept === 'all' || txt.includes(dept)) ? '' : 'none';
    });
  }

  // ── Sri Vidya Fee Visual Analytics & Chart Engines ──────────────────────────

  let feeMonthlyTrendChartInst = null;
  let feeStreamBreakdownChartInst = null;
  let feeTermComparisonChartInst = null;
  let feePaymentModesChartInst = null;

  function initFeeCharts() {
    initMonthlyTrendChart();
    initStreamBreakdownChart();
  }

  function initFeeReportsCharts() {
    initTermComparisonChart();
    initPaymentModesChart();
  }

  function initMonthlyTrendChart() {
    const canvas = document.getElementById('feeMonthlyTrendChart');
    if (!canvas) return;

    if (typeof Chart !== 'undefined') {
      try {
        if (feeMonthlyTrendChartInst) feeMonthlyTrendChartInst.destroy();
        const ctx = canvas.getContext('2d');
        feeMonthlyTrendChartInst = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
            datasets: [
              {
                label: 'Actual Collected (₹ Lakhs)',
                data: [4.8, 5.2, 4.9, 5.8, 3.8, 0, 0, 0, 0, 0],
                borderColor: '#0284c7',
                backgroundColor: 'rgba(2, 132, 199, 0.1)',
                borderWidth: 2.5,
                fill: true,
                tension: 0.35,
                pointBackgroundColor: '#0284c7',
                pointRadius: 4
              },
              {
                label: 'Monthly Target (₹ Lakhs)',
                data: [5.0, 5.0, 5.0, 5.0, 5.0, 4.0, 4.0, 4.0, 4.0, 4.0],
                borderColor: '#94a3b8',
                borderDash: [5, 5],
                borderWidth: 2,
                fill: false,
                tension: 0,
                pointRadius: 0
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: { callback: v => '₹' + v + 'L' }
              }
            }
          }
        });
        return;
      } catch (err) {
        console.warn('Chart.js error for feeMonthlyTrendChart:', err);
      }
    }

    const fallback = document.getElementById('feeMonthlyTrendFallback');
    if (fallback) {
      fallback.style.display = 'block';
      fallback.innerHTML = `
        <div style="padding:1rem; text-align:center; width:100%;">
          <div style="display:flex; justify-content:space-around; align-items:flex-end; height:160px; padding:0 1rem; border-bottom:2px solid #cbd5e1;">
            <div style="width:28px; background:#0284c7; height:75%; border-radius:4px 4px 0 0;" title="Jun: ₹4.8L"></div>
            <div style="width:28px; background:#0284c7; height:85%; border-radius:4px 4px 0 0;" title="Jul: ₹5.2L"></div>
            <div style="width:28px; background:#0284c7; height:80%; border-radius:4px 4px 0 0;" title="Aug: ₹4.9L"></div>
            <div style="width:28px; background:#0284c7; height:95%; border-radius:4px 4px 0 0;" title="Sep: ₹5.8L"></div>
            <div style="width:28px; background:#0284c7; height:60%; border-radius:4px 4px 0 0;" title="Oct: ₹3.8L"></div>
          </div>
          <div style="display:flex; justify-content:space-around; font-size:0.75rem; color:#64748b; margin-top:0.4rem;">
            <span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span>
          </div>
        </div>
      `;
    }
  }

  function initStreamBreakdownChart() {
    const canvas = document.getElementById('feeStreamBreakdownChart');
    if (!canvas) return;

    if (typeof Chart !== 'undefined') {
      try {
        if (feeStreamBreakdownChartInst) feeStreamBreakdownChartInst.destroy();
        const ctx = canvas.getContext('2d');
        feeStreamBreakdownChartInst = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: ['Tuition Fee (72%)', 'Transport Fleet (13%)', 'Lab & Coding (9%)', 'Exam & Assessments (6%)'],
            datasets: [{
              data: [22.4, 4.2, 2.8, 1.6],
              backgroundColor: ['#0284c7', '#10b981', '#8b5cf6', '#f59e0b'],
              borderWidth: 2,
              borderColor: '#ffffff'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
                labels: { boxWidth: 12, font: { size: 11 } }
              }
            },
            cutout: '65%'
          }
        });
        return;
      } catch (err) {
        console.warn('Chart.js error for feeStreamBreakdownChart:', err);
      }
    }

    const fallback = document.getElementById('feeStreamBreakdownFallback');
    if (fallback) {
      fallback.style.display = 'block';
      fallback.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:0.5rem; padding:1rem; width:100%;">
          <div style="display:flex; justify-content:space-between; font-size:0.85rem;"><strong>Tuition Fee</strong><span>₹22.4L (72%)</span></div>
          <div style="width:100%; height:8px; background:#e2e8f0; border-radius:4px;"><div style="width:72%; height:100%; background:#0284c7; border-radius:4px;"></div></div>
          <div style="display:flex; justify-content:space-between; font-size:0.85rem;"><strong>Transport Fleet</strong><span>₹4.2L (13%)</span></div>
          <div style="width:100%; height:8px; background:#e2e8f0; border-radius:4px;"><div style="width:13%; height:100%; background:#10b981; border-radius:4px;"></div></div>
          <div style="display:flex; justify-content:space-between; font-size:0.85rem;"><strong>Lab & Technology</strong><span>₹2.8L (9%)</span></div>
          <div style="width:100%; height:8px; background:#e2e8f0; border-radius:4px;"><div style="width:9%; height:100%; background:#8b5cf6; border-radius:4px;"></div></div>
        </div>
      `;
    }
  }

  function initTermComparisonChart() {
    const canvas = document.getElementById('feeTermComparisonChart');
    if (!canvas) return;

    if (typeof Chart !== 'undefined') {
      try {
        if (feeTermComparisonChartInst) feeTermComparisonChartInst.destroy();
        const ctx = canvas.getContext('2d');
        feeTermComparisonChartInst = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['Term 1 (Quarterly)', 'Term 2 (Half-Yearly)', 'Term 3 (Annual/SSC)'],
            datasets: [
              {
                label: 'Projected Target (₹L)',
                data: [12.0, 11.5, 9.1],
                backgroundColor: '#cbd5e1',
                borderRadius: 4
              },
              {
                label: 'Realized Inflow (₹L)',
                data: [11.8, 10.2, 6.4],
                backgroundColor: '#0284c7',
                borderRadius: 4
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } }
            },
            scales: {
              y: { beginAtZero: true, ticks: { callback: v => '₹' + v + 'L' } }
            }
          }
        });
        return;
      } catch (err) {
        console.warn('Chart.js error for feeTermComparisonChart:', err);
      }
    }
  }

  function initPaymentModesChart() {
    const canvas = document.getElementById('feePaymentModesChart');
    if (!canvas) return;

    if (typeof Chart !== 'undefined') {
      try {
        if (feePaymentModesChartInst) feePaymentModesChartInst.destroy();
        const ctx = canvas.getContext('2d');
        feePaymentModesChartInst = new Chart(ctx, {
          type: 'pie',
          data: {
            labels: ['UPI / QR Code (48%)', 'Direct Bank / NEFT (24%)', 'Cash Counter (18%)', 'Cheque (10%)'],
            datasets: [{
              data: [48, 24, 18, 10],
              backgroundColor: ['#10b981', '#0284c7', '#f59e0b', '#8b5cf6'],
              borderWidth: 2,
              borderColor: '#ffffff'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } }
            }
          }
        });
        return;
      } catch (err) {
        console.warn('Chart.js error for feePaymentModesChart:', err);
      }
    }
  }

  function renderClassFeeRealizationMatrix() {
    const container = document.getElementById('classFeeRealizationMatrix');
    if (!container) return;

    const classData = [
      { class: 'Class X (A & B)', count: '89 Students', demand: '₹3,56,000', collected: '₹3,42,000', dues: '₹14,000', pct: 96.1, color: '#10b981', status: 'Optimal' },
      { class: 'Class IX (A & B)', count: '83 Students', demand: '₹3,32,000', collected: '₹3,14,000', dues: '₹18,000', pct: 94.6, color: '#10b981', status: 'Optimal' },
      { class: 'Class VIII (A & B)', count: '94 Students', demand: '₹3,76,000', collected: '₹3,48,000', dues: '₹28,000', pct: 92.5, color: '#0284c7', status: 'On Track' },
      { class: 'Class VII (A & B)', count: '90 Students', demand: '₹3,60,000', collected: '₹3,26,000', dues: '₹34,000', pct: 90.5, color: '#0284c7', status: 'On Track' },
      { class: 'Class VI (A & B)', count: '98 Students', demand: '₹3,92,000', collected: '₹3,46,000', dues: '₹46,000', pct: 88.3, color: '#f59e0b', status: 'Follow-up' },
      { class: 'Class V (A & B)', count: '90 Students', demand: '₹3,60,000', collected: '₹3,18,000', dues: '₹42,000', pct: 88.3, color: '#f59e0b', status: 'Follow-up' },
      { class: 'Classes I – IV (8 Secs)', count: '311 Students', demand: '₹10,84,000', collected: '₹8,46,000', dues: '₹2,38,000', pct: 78.0, color: '#ef4444', status: 'Action Required' }
    ];

    container.innerHTML = `
      <div class="class-matrix-grid">
        ${classData.map(c => `
          <div class="class-matrix-card">
            <div class="class-matrix-card-header">
              <span class="class-matrix-title">${c.class}</span>
              <span class="portal-badge ${c.pct >= 90 ? 'badge-success' : (c.pct >= 85 ? 'badge-info' : 'badge-warning')}">${c.status}</span>
            </div>
            <div class="class-matrix-stats">
              <span>${c.count}</span>
              <strong style="color:${c.color};">${c.pct}% Realized</strong>
            </div>
            <div class="progress-bar-bg" style="height:6px; margin:0.3rem 0;">
              <div class="progress-bar-fill" style="width:${c.pct}%; background:${c.color};"></div>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:0.8rem; color:#64748b;">
              <span>Collected: <strong class="text-emerald">${c.collected}</strong></span>
              <span>Dues: <strong class="text-amber">${c.dues}</strong></span>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  function filterRecentFeeTransactions(val) {
    const q = (typeof val === 'string' ? val : (document.getElementById('recentTxnSearchInput')?.value || '')).toLowerCase().trim();
    const rows = document.querySelectorAll('#feeTransactionsTableBody tr');
    let visibleCount = 0;
    rows.forEach(r => {
      const txt = r.textContent.toLowerCase();
      const show = !q || txt.includes(q);
      r.style.display = show ? '' : 'none';
      if (show) visibleCount++;
    });
    const badge = document.getElementById('recentTxnCountBadge');
    if (badge) badge.textContent = visibleCount + ' Receipts Today';
  }

  function filterDefaulters() {
    const cls = (document.getElementById('defaulterClassFilter')?.value || '').toLowerCase().trim();
    const aging = (document.getElementById('defaulterAgingFilter')?.value || '').toLowerCase().trim();
    const q = (document.getElementById('defaulterSearchInput')?.value || '').toLowerCase().trim();
    const rows = document.querySelectorAll('#defaultersTableBody tr');
    let visibleCount = 0;
    rows.forEach(r => {
      const txt = r.textContent.toLowerCase();
      const matchCls = !cls || cls === 'all' || txt.includes(cls);
      let matchAging = true;
      if (aging === 'critical') matchAging = txt.includes('critical') || txt.includes('>60') || txt.includes('62') || txt.includes('65') || txt.includes('70');
      else if (aging === 'moderate') matchAging = txt.includes('35') || txt.includes('40') || txt.includes('45');
      else if (aging === 'recent') matchAging = txt.includes('8 days') || txt.includes('10 days') || txt.includes('12 days') || txt.includes('14 days') || txt.includes('15 days') || txt.includes('16 days') || txt.includes('18 days') || txt.includes('22 days') || txt.includes('25 days') || txt.includes('28 days');
      const matchQ = !q || txt.includes(q);
      const show = matchCls && matchAging && matchQ;
      r.style.display = show ? '' : 'none';
      if (show) visibleCount++;
    });
    const countEl = document.getElementById('defTotalCount');
    if (countEl) countEl.textContent = visibleCount;
  }

  function filterFeeLedger() {
    const q = (document.getElementById('ledgerSearchInput')?.value || '').toLowerCase().trim();
    const mode = (document.getElementById('ledgerModeFilter')?.value || '').toLowerCase().trim();
    const rows = document.querySelectorAll('#feeLedgerTableBody tr');
    let visibleCount = 0;
    rows.forEach(r => {
      const txt = r.textContent.toLowerCase();
      const matchQ = !q || txt.includes(q);
      const matchMode = !mode || mode === 'all' || txt.includes(mode.toLowerCase());
      const show = matchQ && matchMode;
      r.style.display = show ? '' : 'none';
      if (show) visibleCount++;
    });
    const badge = document.getElementById('ledgerCountBadge');
    if (badge) badge.textContent = visibleCount + ' Receipts';
  }

  function filterCirculars() {
    const q = (document.getElementById('circularSearchInput')?.value || '').toLowerCase().trim();
    const cat = (document.getElementById('circularCategoryFilter')?.value || 'all').toLowerCase().trim();

    const filtered = CIRCULARS_DATA.filter(c => {
      const matchQ = !q || (c.title + ' ' + c.ref + ' ' + c.audience).toLowerCase().includes(q);
      const matchCat = cat === 'all' || c.category.toLowerCase().includes(cat);
      return matchQ && matchCat;
    });

    renderCircularsTable(filtered);
  }

  function filterSmsLogs() {
    const q = (document.getElementById('smsLogSearchInput')?.value || '').toLowerCase().trim();
    const filtered = SMS_LOGS_DATA.filter(s => {
      return !q || (s.logId + ' ' + s.recipient + ' ' + s.category + ' ' + s.snippet).toLowerCase().includes(q);
    });
    renderSmsLogsTable(filtered);
  }

  function filterEmailLogs() {
    const q = (document.getElementById('emailLogSearchInput')?.value || '').toLowerCase().trim();
    const filtered = EMAIL_LOGS_DATA.filter(e => {
      return !q || (e.emailId + ' ' + e.recipient + ' ' + e.subject + ' ' + e.category).toLowerCase().includes(q);
    });
    renderEmailLogsTable(filtered);
  }

  function filterPushLogs() {
    const q = (document.getElementById('pushLogSearchInput')?.value || '').toLowerCase().trim();
    const filtered = PUSH_LOGS_DATA.filter(p => {
      return !q || (p.pushId + ' ' + p.target + ' ' + p.title + ' ' + p.body).toLowerCase().includes(q);
    });
    renderPushLogsTable(filtered);
  }

  function handleLogGateLateEntry(e) {
    if (e && e.preventDefault) e.preventDefault();
    const student = document.getElementById('gateLateStudentSelect')?.value || 'Student';
    const reason = document.getElementById('gateLateReasonInput')?.value || 'Late Arrival';
    showToast('Late arrival logged for ' + student + ' (' + reason + ')', 'success');
    closeModal('logGateLateModal');
  }

  function handleApplyStaffLeaveSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    const teacher = document.getElementById('staffLeaveTeacher')?.value || 'Faculty';
    const days = document.getElementById('staffLeaveDays')?.value || '1';
    showToast('Leave requisition submitted for ' + teacher + ' (' + days + ' days)', 'success');
    closeModal('applyStaffLeaveModal');
  }

  function handleStaffLeaveTeacherChange(val) {
    const deptInput = document.getElementById('staffLeaveDept');
    if (deptInput) {
      const facultyObj = state.faculty.find(f => f.name === val);
      deptInput.value = facultyObj ? facultyObj.subject : 'High School';
    }
  }

  function handleIssueStudentLeaveSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    const admNo = document.getElementById('issueStudentAdmNo')?.value || '';
    const reason = document.getElementById('issueStudentLeaveReason')?.value || 'Sick Leave';
    showToast('Leave slip approved and recorded for student ' + admNo + ' (' + reason + ')', 'success');
    closeModal('issueStudentLeaveModal');
  }

  function handleReserveLabSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    const lab = document.getElementById('reserveLabFacility')?.value || 'Science Lab';
    const date = document.getElementById('reserveLabDate')?.value || 'Today';
    showToast('Lab reservation confirmed: ' + lab + ' on ' + date, 'success');
    closeModal('reserveLabModal');
  }

  function handleReserveLabFacilityChange(val) {
    const incharge = document.getElementById('reserveLabIncharge');
    if (incharge) {
      if (val === 'LAB-02') incharge.value = 'Sri D. Srinivas (MCA, Computer Lab)';
      else if (val === 'LAB-03') incharge.value = 'Smt. S. Lakshmi (Biology Lab)';
      else incharge.value = 'Sri V. Suresh Babu (Physical Science)';
    }
  }

  function handleAssignStaffTask(e) {
    if (e && e.preventDefault) e.preventDefault();
    const staff = document.getElementById('taskStaffMember')?.value || 'Staff';
    const title = document.getElementById('taskTitle')?.value || 'Duty';
    showToast('Institutional assignment dispatched to ' + staff + ': ' + title, 'success');
    closeModal('assignStaffTaskModal');
  }

  function handleTaskStaffSelection(val) {
    const roleInput = document.getElementById('taskStaffRole');
    if (roleInput) {
      const f = state.faculty.find(m => m.name === val);
      roleInput.value = f ? f.role : 'Staff Member';
    }
  }

  function handleTaskCategoryPreset(val) {
    const title = document.getElementById('taskTitle');
    if (title && val) title.value = val;
  }

  function handleCsvFileUpload(e) {
    const file = e && e.target && e.target.files && e.target.files[0];
    if (file) {
      const badge = document.getElementById('csvFileStatusBadge');
      if (badge) {
        badge.style.display = 'block';
        badge.innerHTML = '<i class="fa-solid fa-file-csv"></i> ' + file.name + ' (' + Math.round(file.size / 1024) + ' KB) — Validated';
      }
      showToast('Student CSV ready for import: ' + file.name, 'info');
    }
  }

  function handleAddTeacher(e) {
    if (e && e.preventDefault) e.preventDefault();
    const name = document.getElementById('tfFullName')?.value || 'New Faculty';
    const cat = document.getElementById('tfCategory')?.value || 'Teaching';
    const role = document.getElementById('tfRole')?.value || 'Faculty Member';
    const subj = document.getElementById('tfSubject')?.value || 'General';
    const qual = document.getElementById('tfQualification')?.value || 'B.Ed, Master Degree';
    const exp = document.getElementById('tfExperience')?.value || '5 Years';
    const phone = document.getElementById('tfPhone')?.value || '9848011223';
    const personalEmail = document.getElementById('tfEmail')?.value || (name.toLowerCase().replace(/[^a-z]/g, '') + '@gmail.com');

    // Generate sequential School Teacher ID (SV200001+)
    let maxNum = 200000;
    state.faculty.forEach(f => {
      const match = f.id ? f.id.match(/SV(\d+)/) : null;
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) maxNum = num;
      }
    });
    const newId = 'SV' + (maxNum + 1);
    const defaultPassword = 'SriVidya@2026';

    const newTeacher = {
      id: newId,
      name: name,
      category: cat,
      role: role,
      qualification: qual,
      exp: exp,
      subject: subj,
      status: 'Active',
      phone: phone,
      email: personalEmail,
      personalEmail: personalEmail,
      defaultPassword: defaultPassword,
      mustChangePassword: true,
      registeredBy: state.currentRole === 'vice-principal' ? 'Vice Principal Sri Navva Anand' : 'Principal Smt. Gorle Varalakshmi',
      registeredAt: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    state.faculty.push(newTeacher);

    // Save to persistent storage for teacher verification
    try {
      localStorage.setItem('sv_authorized_faculty', JSON.stringify(state.faculty));
    } catch (e) {}

    // Dispatch email log
    if (typeof EMAIL_LOGS_DATA !== 'undefined') {
      EMAIL_LOGS_DATA.unshift({
        emailId: 'EML-' + Math.floor(94050 + Math.random() * 800),
        time: 'Just now',
        recipient: personalEmail,
        subject: `Welcome to Sri Vidya High School - Your Teacher Credentials (${newId})`,
        category: 'Staff Onboarding',
        engagement: 'Credentials Dispatched to Personal Inbox',
        status: 'Delivered (100%)'
      });
      renderEmailLogsTable();
    }

    renderStaffGrid(state.faculty);
    if (typeof renderTeacherRosterPermissionsTable === 'function') {
      renderTeacherRosterPermissionsTable();
    }
    if (typeof populateTeacherSelectDropdown === 'function') {
      populateTeacherSelectDropdown();
    }

    closeModal('addTeacherModal');

    // Show Credential Issued Receipt Modal
    const modalContent = document.getElementById('teacherCredentialIssuedContent');
    if (modalContent) {
      modalContent.innerHTML = `
        <div class="credential-receipt-card" style="padding:1rem; text-align:center;">
          <div style="width:56px; height:56px; border-radius:50%; background:rgba(16,185,129,0.15); color:#10b981; font-size:1.6rem; display:flex; align-items:center; justify-content:center; margin:0 auto 12px;">
            <i class="fa-solid fa-circle-check"></i>
          </div>
          <h3 style="font-size:1.15rem; font-weight:800; color:#0f172a; margin-bottom:4px;">${name} Officially Enrolled!</h3>
          <p style="font-size:0.85rem; color:#64748b; margin-bottom:16px;">
            Official login credentials have been generated and dispatched to the faculty member's personal email.
          </p>

          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:16px; text-align:left; margin-bottom:16px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
              <span style="font-size:0.8rem; color:#64748b;">Assigned School ID (Username):</span>
              <span class="teacher-id-badge" style="font-size:0.85rem;">${newId}</span>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
              <span style="font-size:0.8rem; color:#64748b;">Temporary Password:</span>
              <code style="font-weight:700; color:#2563eb; font-size:0.88rem;">${defaultPassword}</code>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
              <span style="font-size:0.8rem; color:#64748b;">Verified Personal Email:</span>
              <strong style="font-size:0.82rem; color:#0f172a;">${personalEmail}</strong>
            </div>
            <div style="display:flex; justify-content:space-between;">
              <span style="font-size:0.8rem; color:#64748b;">Authorization Authority:</span>
              <span style="font-size:0.8rem; font-weight:600; color:#10b981;"><i class="fa-solid fa-signature"></i> Approved by ${newTeacher.registeredBy}</span>
            </div>
          </div>

          <div style="background:rgba(37,99,235,0.08); border-radius:8px; padding:10px 12px; font-size:0.8rem; color:#1e40af; text-align:left;">
            <i class="fa-solid fa-circle-info mr-1"></i>
            When <strong>${name}</strong> visits the <strong>Teacher Portal</strong>, they can click <em>"Newly Joined Teacher? Get Login Credentials"</em> or enter their School ID <strong>${newId}</strong> directly.
          </div>
        </div>
      `;
      openModal('teacherCredentialIssuedModal');
    }

    showToast(`Faculty ${name} registered with School ID: ${newId}! Credentials dispatched to ${personalEmail}`, 'success');
  }

  function handleStaffCategoryChange() {
    const cat = document.getElementById('tfCategory')?.value || 'Teaching';
    const subjGroup = document.getElementById('tfSubjectGroup');
    if (subjGroup) subjGroup.style.display = (cat === 'Non-Teaching') ? 'none' : 'block';
  }

  function handleSaveStaffAttendance(e) {
    if (e && e.preventDefault) e.preventDefault();
    const dateInput = document.getElementById('staffAttDate');
    const attDate = (dateInput && dateInput.value) ? dateInput.value : new Date().toISOString().split('T')[0];
    const session = document.getElementById('staffAttSession')?.value || 'Full Day';
    const records = {};

    (state.faculty || []).forEach(f => {
      const activeBtn = document.querySelector(`.btn-att-opt[data-id="${f.id}"][class*="active-"]`);
      const val = activeBtn ? activeBtn.getAttribute('data-val') : (f.status || 'Present');
      records[f.id] = val;
      f.status = val;
    });

    try {
      localStorage.setItem('sv_faculty_attendance_' + attDate, JSON.stringify(records));
      localStorage.setItem('sv_faculty_attendance_last_sync', Date.now().toString());
    } catch (err) {}

    renderStaffAttendanceTable();
    if (typeof renderStaffGrid === 'function') renderStaffGrid(state.faculty);
    updateClerkFacultyAttSummary();
    closeModal('teacherAttendanceModal');
    showToast('Daily Faculty Attendance officially verified and recorded by School Office / Clerk Department!', 'success');
  }

  function updateClerkFacultyAttSummary() {
    const list = state.faculty || [];
    const present = list.filter(f => !f.status || f.status === 'Present' || f.status === 'Late').length;
    const total = list.length || 30;
    const leave = list.filter(f => f.status === 'Leave').length;
    const absent = list.filter(f => f.status === 'Absent').length;

    const sumEl = document.getElementById('clerkFacultyAttSummary');
    if (sumEl) sumEl.textContent = `${present} / ${total} Present`;

    const totEl = document.getElementById('attTotalStaff');
    if (totEl) totEl.textContent = total;

    const presEl = document.getElementById('attPresentStaff');
    if (presEl) presEl.textContent = present;

    const leaveEl = document.getElementById('attLeaveStaff');
    if (leaveEl) leaveEl.textContent = leave;

    const absEl = document.getElementById('attAbsentStaff');
    if (absEl) absEl.textContent = absent;
  }

  function handleSaveSingleStaffAttendance(e) {
    if (e && e.preventDefault) e.preventDefault();
    const name = document.getElementById('changeStaffName')?.value || 'Staff';
    const status = document.getElementById('changeStaffStatusSelect')?.value || 'Present';
    showToast('Attendance updated for ' + name + ' -> ' + status, 'success');
    closeModal('changeStaffAttendanceModal');
  }

  function handleStatusSelectChange(val) {
    const reasonBox = document.getElementById('statusChangeReasonGroup');
    if (reasonBox) {
      reasonBox.style.display = (val === 'Absent' || val === 'On Leave') ? 'block' : 'none';
    }
  }

  function handleScheduleExamSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    const exam = document.getElementById('examTitleInput')?.value || 'Assessment Exam';
    const cls = document.getElementById('examClassInput')?.value || 'Class X-A';
    showToast('Exam scheduled successfully: ' + exam + ' for ' + cls, 'success');
    closeModal('scheduleExamModal');
  }

  function handleAcademicCsvFile(file) {
    if (file) {
      const status = document.getElementById('academicCsvStatus');
      if (status) {
        status.style.display = 'block';
        status.innerHTML = '<i class="fa-solid fa-file-csv"></i> ' + file.name + ' (' + Math.round(file.size / 1024) + ' KB) — Syllabus parsed';
      }
      showToast('Academic syllabus CSV loaded: ' + file.name, 'info');
    }
  }

  function updateSmsTemplatePreview() {
    const tpl = document.getElementById('smsTemplateSelect')?.value || 'standard';
    const preview = document.getElementById('smsMessagePreview');
    if (preview) {
      if (tpl === 'urgent') {
        preview.value = "URGENT: Sri Vidya High School requests parents of [Student Name] to contact the Vice Principal's office immediately regarding today's attendance.";
      } else if (tpl === 'fee') {
        preview.value = "Sri Vidya High School Reminder: Term fee installment is pending for [Student Name]. Kindly clear dues at the fee counter or via UPI.";
      } else {
        preview.value = "Sri Vidya E.M High School: Dear Parent, [Student Name] was marked absent today without prior leave intimation. Please contact the class teacher.";
      }
    }
  }

  function handleCollectFeeSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    const student = document.getElementById('cfStudentSelect')?.value || 'Student';
    const amount = document.getElementById('cfAmountPaid')?.value || '5000';
    const mode = document.getElementById('cfPaymentMode')?.value || 'Cash';
    const receiptNo = 'RCPT-2026-' + (4892 + state.feeTransactions.length);

    state.feeTransactions.unshift({
      receiptNo: receiptNo,
      student: student,
      class: 'Class X-A',
      term: 'Term 2 Tuition',
      amount: '₹' + parseInt(amount, 10).toLocaleString('en-IN'),
      mode: mode,
      date: 'Today, Just Now',
      cashier: 'Fee Counter'
    });

    renderFeeTransactions(state.feeTransactions);
    showToast('Payment received! Official Receipt ' + receiptNo + ' generated for ₹' + amount, 'success');
    closeModal('collectFeeModal');
  }

  function handleStudentSelectForFee(val) {
    const s = state.students.find(stu => stu.name === val || stu.admNo === val);
    const admEl = document.getElementById('cfAdmissionNo');
    const classEl = document.getElementById('cfClass');
    const dueEl = document.getElementById('cfDueAmount');
    if (admEl && s) admEl.value = s.admNo;
    if (classEl && s) classEl.value = s.class + '-' + s.section;
    if (dueEl && s) dueEl.value = (s.feeStatus === 'Pending') ? '₹14,500' : (s.feeStatus === 'Partial' ? '₹6,500' : '₹0');
  }

  function handleFeeHeadChange(val) {
    const amountEl = document.getElementById('cfAmountPaid');
    if (amountEl) {
      if (val.includes('Term 1')) amountEl.value = '12000';
      else if (val.includes('Term 2')) amountEl.value = '14500';
      else if (val.includes('Transport')) amountEl.value = '8000';
      else if (val.includes('Computer')) amountEl.value = '3500';
      else amountEl.value = '5000';
    }
  }

  function handlePaymentModeChange(val) {
    const refGroup = document.getElementById('cfRefNoGroup');
    if (refGroup) refGroup.style.display = (val === 'Cash') ? 'none' : 'block';
  }

  function updateReminderStats() {
    showToast('Reminder audience scope adjusted', 'info');
  }

  function handleComposeBroadcastModalSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    const title = (document.getElementById('mBcTitle')?.value || '').trim();
    const body = (document.getElementById('mBcBody')?.value || '').trim();
    const category = document.getElementById('mBcCategory')?.value || 'Academic';
    const audience = document.getElementById('mBcAudience')?.value || 'All Parents & Guardians (855)';
    const priority = document.getElementById('mBcPriority')?.value || 'Normal';

    if (!title || !body) {
      showToast('Please provide both notice title and message body.', 'warning');
      return;
    }

    const selectedChannels = [];
    if (document.getElementById('mBcChannelNotice')?.checked) selectedChannels.push('Notice Board');
    if (document.getElementById('mBcChannelSms')?.checked) selectedChannels.push('SMS');
    if (document.getElementById('mBcChannelWa')?.checked) selectedChannels.push('WhatsApp');
    if (document.getElementById('mBcChannelEmail')?.checked) selectedChannels.push('Email');
    if (document.getElementById('mBcChannelPush')?.checked) selectedChannels.push('App Push');
    if (selectedChannels.length === 0) selectedChannels.push('Notice Board');

    const nextRef = 'CIR-2026-0' + (43 + CIRCULARS_DATA.length);
    const newCircular = {
      ref: nextRef,
      title: title,
      category: category,
      audience: audience,
      date: 'Today',
      status: 'Published',
      priority: priority,
      content: `<p><strong>Official Administrative Circular: ${title}</strong></p><p>${body}</p><p>Target Audience: ${audience}</p><p>Priority Status: ${priority}</p>`,
      signedBy: 'Smt. Gorle Varalakshmi, Principal'
    };

    CIRCULARS_DATA.unshift(newCircular);

    const newBroadcast = {
      id: 'BC-2026-' + (115 + BROADCAST_FEED_DATA.length),
      ref: nextRef,
      title: title,
      body: body,
      category: category,
      categoryClass: category === 'Examination' ? 'cat-exam' : (category === 'Advisory' || category === 'Emergency' ? 'cat-advisory' : 'cat-activity'),
      time: 'Just now',
      recipients: audience,
      channels: selectedChannels,
      status: 'Delivered (100%)',
      sender: 'Principal • Smt. Gorle Varalakshmi'
    };

    BROADCAST_FEED_DATA.unshift(newBroadcast);

    if (selectedChannels.includes('SMS')) {
      SMS_LOGS_DATA.unshift({
        logId: 'SMS-' + Math.floor(849100 + Math.random() * 900),
        time: 'Just now',
        recipient: audience,
        category: category + ' SMS',
        snippet: body.length > 85 ? body.slice(0, 85) + '...' : body,
        gateway: 'AP-EDUSMS (Airtel DLT)',
        status: 'Delivered (100%)'
      });
      renderSmsLogsTable();
    }

    if (selectedChannels.includes('Email')) {
      EMAIL_LOGS_DATA.unshift({
        emailId: 'EML-' + Math.floor(10300 + Math.random() * 500),
        time: 'Just now',
        recipient: audience,
        subject: title,
        category: category,
        engagement: '100% Dispatched',
        status: 'Delivered'
      });
      renderEmailLogsTable();
    }

    if (selectedChannels.includes('App Push')) {
      PUSH_LOGS_DATA.unshift({
        pushId: 'PUSH-' + Math.floor(5025 + Math.random() * 200),
        time: 'Just now',
        target: audience,
        title: title,
        body: body.length > 80 ? body.slice(0, 80) + '...' : body,
        deepLink: 'portal.html#communication',
        openRate: '100%',
        status: 'Active'
      });
      renderPushLogsTable();
    }

    renderBroadcastFeed();
    renderCircularsTable();

    closeModal('newNoticeModal');
    document.getElementById('composeBroadcastModalForm')?.reset();
    showToast(`Notice "${title}" dispatched across ${selectedChannels.join(', ')}!`, 'success');
  }

  function updateSmsCharCounter(val) {
    const count = (val || '').length;
    const counter = document.getElementById('mBcSmsCharCount') || document.getElementById('smsCharCountBadge');
    if (counter) {
      const smsUnits = Math.ceil(count / 160) || 1;
      counter.textContent = `${count} characters (${smsUnits} SMS segment${smsUnits > 1 ? 's' : ''})`;
    }
  }

  // =========================================================================
  // SRI VIDYA HIGH SCHOOL - DYNAMIC SUBVIEW DATASETS & RENDERERS
  // =========================================================================

  function renderStudentLeaves(data) {
    const list = data || STUDENT_LEAVES_DATA;
    const tbody = document.getElementById('studentLeavesTableBody');
    if (!tbody) return;

    tbody.innerHTML = list.map(item => {
      let badgeCls = 'badge-primary';
      if (item.ground.includes('Medical')) badgeCls = 'badge-danger';
      else if (item.ground.includes('Sick')) badgeCls = 'badge-warning';
      else if (item.ground.includes('Sports')) badgeCls = 'badge-success';
      else if (item.ground.includes('Gate Pass')) badgeCls = 'badge-info';

      return `
        <tr id="student-leave-row-${item.slipId}">
          <td><strong>${item.slipId}</strong></td>
          <td>
            <strong>${item.name}</strong><br>
            <small class="text-muted">Adm: ${item.admNo} • ${item.parent}</small>
          </td>
          <td><span class="portal-badge badge-neutral">${item.class}</span> <small>${item.roll}</small></td>
          <td><span class="portal-badge ${badgeCls}">${item.ground}</span></td>
          <td>${item.dates}</td>
          <td><small>${item.reason}</small></td>
          <td>
            <a href="tel:${item.phone}" class="text-primary font-weight-bold" style="text-decoration:none;">
              <i class="fa-solid fa-phone"></i> ${item.phone}
            </a>
          </td>
          <td><span class="portal-badge badge-success"><i class="fa-solid fa-circle-check"></i> ${item.status}</span></td>
          <td>
            <div class="table-action-btns">
              <button class="btn btn-secondary btn-sm" onclick="portalApp.printStudentSlip('${item.slipId}')" title="Print Slip">
                <i class="fa-solid fa-print"></i>
              </button>
              <button class="btn btn-primary btn-sm" onclick="portalApp.viewStudentSlipDetails('${item.slipId}')" title="View Dossier">
                <i class="fa-solid fa-eye"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    const badge = document.getElementById('studentLeaveTabBadge');
    if (badge) badge.textContent = list.length;
    const statBadge = document.getElementById('statStudentSlipsCount');
    if (statBadge) statBadge.textContent = list.length;
  }

  function renderStaffLeaveBalances(deptFilter) {
    const tbody = document.getElementById('staffLeaveBalanceTableBody');
    if (!tbody) return;

    const staffList = (state.faculty || []);
    let filtered = staffList;
    if (deptFilter && deptFilter !== 'all') {
      const q = deptFilter.toLowerCase();
      filtered = staffList.filter(s => {
        const txt = (s.role + ' ' + s.subject).toLowerCase();
        if (q === 'teaching') return !txt.includes('administrator') && !txt.includes('clerk') && !txt.includes('lab assistant');
        if (q === 'non-teaching') return txt.includes('administrator') || txt.includes('clerk') || txt.includes('lab assistant') || txt.includes('librarian');
        if (q === 'high school') return txt.includes('high school') || txt.includes('mathematics') || txt.includes('physical science') || txt.includes('biology') || txt.includes('social');
        if (q === 'primary') return txt.includes('primary') || txt.includes('kindergarten');
        return txt.includes(q);
      });
    }

    // Deterministic balanced quotas for all 30 staff members
    tbody.innerHTML = filtered.map((s, idx) => {
      const clTotal = 12;
      const mlTotal = 10;
      const clUsed = (idx % 4 === 0) ? 3 : (idx % 3 === 0) ? 2 : 1;
      const mlUsed = (idx % 5 === 0) ? 2 : 0;
      const odDays = (idx === 10 || idx === 7 || idx === 1) ? 2 : (idx % 6 === 0) ? 1 : 0;
      const presentDays = 24 - (clUsed + mlUsed > 2 ? 2 : 1);
      const remainingBalance = (clTotal - clUsed) + (mlTotal - mlUsed);
      const attRate = ((presentDays + odDays) / 24 * 100).toFixed(1);

      return `
        <tr>
          <td>
            <strong>${s.name}</strong><br>
            <small class="text-muted">${s.role}</small>
          </td>
          <td>
            <span>${s.subject}</span><br>
            <small class="text-muted">${s.qualification}</small>
          </td>
          <td><strong>${clUsed}</strong> / ${clTotal}</td>
          <td><strong>${mlUsed}</strong> / ${mlTotal}</td>
          <td><span class="portal-badge badge-neutral">${odDays} Days</span></td>
          <td><strong>${presentDays}</strong> / 24 Days</td>
          <td><span class="portal-badge badge-success" style="font-weight:700;">${remainingBalance} Days Left</span></td>
          <td>
            <div style="display:flex; align-items:center; gap:0.5rem;">
              <div style="flex:1; background:#e2e8f0; height:6px; border-radius:3px; overflow:hidden;">
                <div style="width:${attRate}%; background:var(--color-primary); height:100%;"></div>
              </div>
              <small style="font-weight:600;">${attRate}%</small>
            </div>
          </td>
          <td>
            <button class="btn btn-secondary btn-sm" onclick="portalApp.viewStaffLeaveDossier('${s.name}')" title="Audit Balance Statement">
              <i class="fa-solid fa-file-invoice"></i> Statement
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Universal Filter wrappers for Leave Desk
  function filterStudentLeaveSlips() {
    const q = (document.getElementById('studentLeaveSearch')?.value || document.getElementById('studentLeaveSearchInput')?.value || '').toLowerCase().trim();
    const cls = (document.getElementById('studentLeaveClassFilter')?.value || 'all').toLowerCase().trim();
    const ground = (document.getElementById('studentLeaveTypeFilter')?.value || 'all').toLowerCase().trim();

    const filtered = STUDENT_LEAVES_DATA.filter(item => {
      const matchQ = !q || item.name.toLowerCase().includes(q) || item.admNo.toLowerCase().includes(q) || item.roll.toLowerCase().includes(q);
      const matchCls = cls === 'all' || item.class.toLowerCase().includes(cls);
      const matchGround = ground === 'all' || item.ground.toLowerCase().includes(ground);
      return matchQ && matchCls && matchGround;
    });
    renderStudentLeaves(filtered);
  }

  function filterStaffLeaveBalances() {
    const dept = (document.getElementById('leaveBalanceDeptFilter')?.value || document.getElementById('staffLeaveBalanceDeptFilter')?.value || 'all');
    renderStaffLeaveBalances(dept);
  }

  function printStudentSlip(slipId) {
    const slip = STUDENT_LEAVES_DATA.find(s => s.slipId === slipId);
    if (!slip) return;
    showToast(`Printing Official Pass / Leave Slip for ${slip.name} (${slip.class})...`, 'info');
    setTimeout(() => { window.print(); }, 300);
  }

  function viewStudentSlipDetails(slipId) {
    const slip = STUDENT_LEAVES_DATA.find(s => s.slipId === slipId);
    if (!slip) return;
    alert(`SRI VIDYA E.M HIGH SCHOOL • LEAVE DOSSIER\n------------------------------------------------\nSlip ID: ${slip.slipId}\nStudent: ${slip.name} (${slip.admNo})\nClass: ${slip.class} • Roll: ${slip.roll}\nGrounds: ${slip.ground}\nDates: ${slip.dates}\nReason: ${slip.reason}\nParent: ${slip.parent} (Ph: ${slip.phone})\nApproval Status: ${slip.status}\nVerified By: Vice Principal Sri Navva Anand`);
  }

  function viewStaffLeaveDossier(teacherName) {
    const teacher = (state.faculty || []).find(f => f.name === teacherName);
    if (!teacher) return;
    alert(`SRI VIDYA E.M HIGH SCHOOL • STAFF ATTENDANCE & LEAVE AUDIT\n------------------------------------------------------------\nStaff Member: ${teacher.name}\nRole: ${teacher.role}\nDepartment: ${teacher.subject}\nQualifications: ${teacher.qualification} (${teacher.exp})\nContact: ${teacher.phone} • ${teacher.email}\nCasual Leave Entitlement: 12 Days (Consumed: 2, Left: 10)\nMedical Leave Entitlement: 10 Days (Consumed: 0, Left: 10)\nOn Duty Quota: 5 Days (Utilized: 1)\nAttendance Rate: 97.4% (September)\nEndorsed by: Principal Smt. Gorle Varalakshmi`);
  }

  // =========================================================================
  // ACADEMICS MODULE RENDERERS
  // =========================================================================

  

  function renderAcademicClasses() {
    const tbody = document.getElementById('academicClassesTableBody');
    if (!tbody) return;

    tbody.innerHTML = ACADEMIC_CLASSES_DATA.map(c => `
      <tr>
        <td><strong>${c.class}</strong></td>
        <td><span class="portal-badge badge-primary">${c.wing}</span></td>
        <td><small class="text-muted">${c.hours}</small></td>
        <td><span class="portal-badge badge-neutral" style="font-weight:700;">${c.strength} Students</span></td>
        <td><strong>${c.teacher}</strong></td>
        <td>${c.room}</td>
        <td><span class="portal-badge badge-success"><i class="fa-solid fa-circle-check"></i> ${c.timetableStatus}</span></td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="portalApp.switchSubTab('academics', 'timetable')" title="View Schedule">
            <i class="fa-solid fa-calendar-days"></i> Timetable
          </button>
        </td>
      </tr>
    `).join('');
  }

  

  function renderAcademicSubjects() {
    const tbody = document.getElementById('academicSubjectsTableBody');
    if (!tbody) return;

    tbody.innerHTML = ACADEMIC_SUBJECTS_DATA.map(s => `
      <tr>
        <td>
          <strong>${s.title}</strong><br>
          <small class="text-primary font-weight-bold">${s.code}</small>
        </td>
        <td><span class="portal-badge badge-neutral">${s.dept}</span></td>
        <td><small class="text-muted">${s.book}</small></td>
        <td><strong>${s.periods}</strong></td>
        <td>${s.hod}</td>
        <td><small>${s.lab}</small></td>
        <td>
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <div style="flex:1; background:#e2e8f0; height:6px; border-radius:3px; overflow:hidden;">
              <div style="width:${s.progress}; background:#10b981; height:100%;"></div>
            </div>
            <small style="font-weight:700; color:#10b981;">${s.progress}</small>
          </div>
        </td>
      </tr>
    `).join('');
  }

  

  function renderExamsSchedule() {
    const tbody = document.getElementById('examsScheduleTableBody');
    if (!tbody) return;

    tbody.innerHTML = EXAMS_SCHEDULE_DATA.map(ex => `
      <tr>
        <td><strong>${ex.title}</strong></td>
        <td><span class="portal-badge badge-primary">${ex.class}</span></td>
        <td><strong>${ex.subject}</strong></td>
        <td>${ex.date}</td>
        <td><small class="text-muted">${ex.time}</small></td>
        <td><span class="portal-badge badge-neutral" style="font-weight:700;">${ex.marks}</span></td>
        <td>${ex.hall}</td>
        <td>${ex.invigilator}</td>
        <td><span class="portal-badge badge-success"><i class="fa-solid fa-clock"></i> ${ex.status}</span></td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="portalApp.switchSubTab('examination', 'papers')" title="View Blueprint / Question Paper">
            <i class="fa-solid fa-file-lines"></i> Blueprint
          </button>
        </td>
      </tr>
    `).join('');
  }

  

  function renderResultsAndGrading() {
    const tbody = document.getElementById('academicResultsTableBody');
    if (!tbody) return;

    tbody.innerHTML = ACADEMIC_RESULTS_DATA.map(r => `
      <tr>
        <td><strong>${r.class}</strong></td>
        <td>${r.appeared}</td>
        <td><strong class="text-emerald">${r.passed}</strong></td>
        <td><span class="portal-badge badge-success font-weight-bold">${r.passRate}</span></td>
        <td><span class="portal-badge badge-primary font-weight-bold">${r.meanGpa}</span></td>
        <td><strong>${r.topScorer}</strong></td>
        <td><small class="text-primary font-weight-bold">${r.highestMark}</small></td>
        <td><small class="text-muted">${r.distinctions}</small></td>
      </tr>
    `).join('');
  }

  

  function renderAcademicReports() {
    const tbody = document.getElementById('academicReportsTableBody');
    if (!tbody) return;

    tbody.innerHTML = ACADEMIC_REPORTS_DATA.map(rp => `
      <tr>
        <td><strong>${rp.dept}</strong></td>
        <td>${rp.hod}</td>
        <td><small class="text-primary font-weight-bold">${rp.syllabus}</small></td>
        <td><small class="text-muted">${rp.practicals}</small></td>
        <td><span class="portal-badge badge-success"><i class="fa-solid fa-circle-check"></i> ${rp.status}</span></td>
        <td><span class="portal-badge badge-primary"><i class="fa-solid fa-stamp"></i> ${rp.audit}</span></td>
      </tr>
    `).join('');
  }

  // =========================================================================
  // ATTENDANCE MODULE RENDERERS
  // =========================================================================

  function renderAttendanceTeachers() {
    const tbody = document.getElementById('attendanceTeacherTableBody');
    if (!tbody) return;

    const teachers = (state.faculty || []);
    tbody.innerHTML = teachers.map((t, idx) => {
      const punchIn = (idx === 4) ? '— (On Leave)' : (idx % 7 === 0) ? '08:47 AM' : '08:32 AM';
      const isLate = punchIn === '08:47 AM';
      const isOnLeave = idx === 4;
      let badgeCls = 'badge-success';
      let statusText = 'Present (Biometric Verified)';
      if (isOnLeave) {
        badgeCls = 'badge-warning';
        statusText = 'On Leave (Medical)';
      } else if (isLate) {
        badgeCls = 'badge-amber';
        statusText = 'Late (Grace Period)';
      }

      return `
        <tr>
          <td><span class="portal-badge badge-neutral font-weight-bold">BIO-SV-${(101 + idx)}</span></td>
          <td>
            <strong>${t.name}</strong><br>
            <small class="text-muted">${t.role}</small>
          </td>
          <td>${t.subject}</td>
          <td><span class="portal-badge badge-primary">${t.qualification}</span></td>
          <td><strong>${punchIn}</strong></td>
          <td><a href="tel:${t.phone}" class="text-primary font-weight-bold" style="text-decoration:none;">${t.phone}</a></td>
          <td><span class="portal-badge ${badgeCls}">${statusText}</span></td>
          <td>
            <button class="btn btn-secondary btn-sm" onclick="portalApp.viewStaffLeaveDossier('${t.name}')" title="Attendance Log">
              <i class="fa-solid fa-clock-rotate-left"></i> History
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  function renderAttendanceAbsentees() {
    const tbody = document.getElementById('attendanceAbsenteesTableBody');
    if (!tbody) return;

    const absentees = (state.dailyAbsentees || []);
    if (absentees.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" class="text-center py-4 text-muted">No absentees logged for today. Attendance is 100%.</td></tr>';
      return;
    }

    tbody.innerHTML = absentees.map(a => `
      <tr>
        <td><strong>${a.admNo}</strong></td>
        <td><strong>${a.name}</strong></td>
        <td><span class="portal-badge badge-neutral">${a.class}</span></td>
        <td>${a.parent}</td>
        <td><a href="tel:${a.phone}" class="text-primary font-weight-bold" style="text-decoration:none;">${a.phone}</a></td>
        <td><small class="text-muted">${a.reason || 'Unreported absence'}</small></td>
        <td><span class="portal-badge badge-success"><i class="fa-solid fa-check-double"></i> ${a.smsStatus || 'Delivered'}</span></td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="portalApp.callParent('${a.phone}', '${a.parent}')" title="Call Parent">
            <i class="fa-solid fa-phone"></i> Call
          </button>
        </td>
      </tr>
    `).join('');
  }

  

  function renderAttendanceMonthly() {
    const tbody = document.getElementById('attendanceMonthlyTableBody');
    if (!tbody) return;

    tbody.innerHTML = ATTENDANCE_MONTHLY_DATA.map(m => `
      <tr>
        <td><strong>${m.class}</strong></td>
        <td>${m.strength}</td>
        <td>${m.days}</td>
        <td>${m.studentDays}</td>
        <td><span class="portal-badge badge-primary font-weight-bold">${m.avgRate}</span></td>
        <td>${m.fullAttCount}</td>
        <td><small class="text-muted">${m.riskCount}</small></td>
        <td><span class="portal-badge badge-success"><i class="fa-solid fa-circle-check"></i> ${m.status}</span></td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="portalApp.printStaffLeaveLedger()" title="Print Monthly Sheet">
            <i class="fa-solid fa-print"></i> Print
          </button>
        </td>
      </tr>
    `).join('');
  }

  // =========================================================================
  // TIMETABLE MODULE RENDERERS
  // =========================================================================

  function renderMasterTimetable() {
    // Reuse VP timetable renderer for master timetable body
    const tbody = document.getElementById('masterTimetableBody');
    if (!tbody) return;

    const schedule = (typeof getTimetableForClass === 'function')
      ? getTimetableForClass('Class X-A')
      : [];

    if (schedule.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="text-center py-4 text-muted">Timetable schedules loaded under Class schedules tab.</td></tr>';
      return;
    }

    tbody.innerHTML = schedule.map(row => {
      if (row.isBreak || row.isCoaching) {
        return `
          <tr style="background:#f8fafc; font-weight:600; text-align:center;">
            <td><strong>${row.period}</strong><br><small class="text-muted">${row.timing}</small></td>
            <td colspan="6" style="letter-spacing:1px; color:var(--color-primary);">${row.title}</td>
          </tr>
        `;
      }
      const dayCells = (row.slots || []).map(slot => `
        <td style="font-size:0.85rem;">
          <div style="font-weight:600; color:#1e293b;">${slot}</div>
        </td>
      `).join('');

      return `
        <tr>
          <td><strong>${row.period}</strong><br><small class="text-muted">${row.timing}</small></td>
          ${dayCells}
        </tr>
      `;
    }).join('');
  }

  function renderDailySubstitution() {
    const tbody = document.getElementById('dailySubstitutionTableBody');
    if (!tbody) return;

    const list = (state.dailySubstitutions || [
      { id: 'SUB-2026-001', class: 'Class X-A', period: 'Period 3 (10:35 - 11:20 AM)', absent: 'Sri K. Rajesh (Physics)', substitute: 'Sri Navva Anand', topic: 'Ray Optics Numerical Problem Set 4', status: 'Confirmed' },
      { id: 'SUB-2026-002', class: 'Class IX-A', period: 'Period 5 (01:15 - 02:00 PM)', absent: 'Sri K. Rajesh (Chemistry)', substitute: 'Smt. S. Lakshmi', topic: 'Chemical Bonding Notes & Exercise', status: 'Confirmed' },
      { id: 'SUB-2026-003', class: 'Class IV-A', period: 'Period 2 (09:45 - 10:30 AM)', absent: 'Smt. K. Anitha (Maths)', substitute: 'Smt. G. Sarada', topic: 'Multiplication Tables Drill & Worksheet', status: 'Confirmed' }
    ]);

    tbody.innerHTML = list.map(item => `
      <tr>
        <td><strong>${item.class}</strong></td>
        <td><small class="text-muted">${item.period}</small></td>
        <td><strong class="text-amber">${item.absent}</strong></td>
        <td><strong class="text-primary">${item.substitute}</strong></td>
        <td><small>${item.topic}</small></td>
        <td><span class="portal-badge badge-success"><i class="fa-solid fa-circle-check"></i> ${item.status}</span></td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="portalApp.confirmSubstitution('${item.id}')" title="Re-assign">
            <i class="fa-solid fa-arrows-rotate"></i> Sync
          </button>
        </td>
      </tr>
    `).join('');
  }

  

  function renderScienceLabs() {
    const tbody = document.getElementById('scienceLabsTableBody');
    if (!tbody) return;

    tbody.innerHTML = SCIENCE_LABS_DATA.map(lab => `
      <tr>
        <td><strong>${lab.facility}</strong></td>
        <td><small class="text-muted">${lab.location} • ${lab.capacity}</small></td>
        <td>${lab.faculty}</td>
        <td><strong>${lab.occupancy}</strong></td>
        <td><small class="text-emerald font-weight-bold">${lab.status}</small></td>
        <td><small class="text-muted">${lab.period}</small></td>
        <td><span class="portal-badge badge-primary"><i class="fa-solid fa-flask"></i> ${lab.activeStatus}</span></td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="portalApp.openReserveLabModal()" title="Reserve Slot">
            <i class="fa-solid fa-calendar-plus"></i> Reserve
          </button>
        </td>
      </tr>
    `).join('');
  }

  // =========================================================================
  // FEES MODULE RENDERERS
  // =========================================================================

  

  function renderDefaultersTable() {
    const tbody = document.getElementById('defaultersTableBody');
    if (!tbody) return;

    tbody.innerHTML = DEFAULTERS_DATA.map(d => `
      <tr>
        <td><strong>${d.admNo}</strong></td>
        <td>
          <strong>${d.name}</strong><br>
          <small class="text-muted">Parent: ${d.parent}</small>
        </td>
        <td><span class="portal-badge badge-neutral">${d.class}</span></td>
        <td>${d.head}</td>
        <td><span class="portal-badge badge-warning">${d.aging}</span></td>
        <td><strong class="text-red">${d.amount}</strong></td>
        <td><small class="text-muted">${d.reminder}</small></td>
        <td>
          <div class="table-action-btns">
            <button class="btn btn-primary btn-sm" onclick="portalApp.openModal('collectFeeModal'); portalApp.populateFeeModalStudent('${d.admNo}');" title="Collect Cash/UPI">
              <i class="fa-solid fa-receipt"></i> Collect
            </button>
            <button class="btn btn-secondary btn-sm" onclick="portalApp.callParent('${d.phone}', '${d.parent}')" title="Call Parent">
              <i class="fa-solid fa-phone"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  function renderFeeLedgerTable() {
    const tbody = document.getElementById('feeLedgerTableBody');
    if (!tbody) return;

    const transactions = (state.feeTransactions || []);
    tbody.innerHTML = transactions.map(t => `
      <tr>
        <td><strong>${t.receiptNo}</strong></td>
        <td><small class="text-muted">${t.date}</small></td>
        <td>
          <strong>${t.student}</strong><br>
          <small class="text-muted">${t.class}</small>
        </td>
        <td><span class="portal-badge badge-neutral">${t.class}</span></td>
        <td>${t.term}</td>
        <td><span class="portal-badge badge-primary">${t.mode}</span></td>
        <td><strong class="text-emerald">${t.amount}</strong></td>
        <td>${t.cashier}</td>
        <td><span class="portal-badge badge-success"><i class="fa-solid fa-circle-check"></i> Paid</span></td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="portalApp.printFeeReceiptSlip('${t.receiptNo}')" title="Print Fee Receipt">
            <i class="fa-solid fa-print"></i> Slip
          </button>
        </td>
      </tr>
    `).join('');
  }

  // =========================================================================
  // COMMUNICATION MODULE RENDERERS
  // =========================================================================

  

  function renderBroadcastFeed(data) {
    const feed = document.getElementById('broadcastFeed');
    if (!feed) return;
    const list = data || BROADCAST_FEED_DATA;

    const countBadge = document.getElementById('broadcastFeedCountBadge');
    if (countBadge) {
      countBadge.textContent = `${list.length} Dispatched`;
    }

    if (list.length === 0) {
      feed.innerHTML = `
        <div class="empty-state py-5 text-center text-muted">
          <i class="fa-solid fa-bullhorn fa-2x mb-2 text-muted"></i>
          <p>No active school broadcasts recorded.</p>
        </div>
      `;
      return;
    }

    feed.innerHTML = list.map(item => {
      const catCls = item.categoryClass || (
        item.category === 'Examination' ? 'cat-exam' :
        item.category === 'Advisory' || item.category === 'Emergency' ? 'cat-advisory' :
        item.category === 'Activity' ? 'cat-activity' :
        item.category === 'Sports' ? 'cat-sports' : ''
      );

      const channelPills = (item.channels || ['Notice Board']).map(ch => {
        if (ch === 'SMS') return '<span class="comm-ch-badge ch-sms"><i class="fa-solid fa-comment-sms"></i> SMS</span>';
        if (ch === 'Notice Board') return '<span class="comm-ch-badge ch-notice"><i class="fa-solid fa-bullhorn"></i> Notice</span>';
        if (ch === 'WhatsApp') return '<span class="comm-ch-badge ch-wa"><i class="fa-brands fa-whatsapp"></i> WhatsApp</span>';
        if (ch === 'Email') return '<span class="comm-ch-badge ch-email"><i class="fa-solid fa-envelope"></i> Email</span>';
        if (ch === 'App Push') return '<span class="comm-ch-badge ch-push"><i class="fa-solid fa-mobile-screen"></i> Push</span>';
        return `<span class="comm-ch-badge ch-notice">${ch}</span>`;
      }).join(' ');

      return `
        <div class="feed-item-card ${catCls}" id="bc-${item.id}">
          <div class="feed-item-header">
            <div class="feed-channels-row">
              ${channelPills}
            </div>
            <span class="feed-timestamp"><i class="fa-regular fa-clock"></i> ${item.time}</span>
          </div>

          <div class="feed-title-row">
            <h4 class="feed-item-title">${item.title}</h4>
            <span class="portal-badge badge-success"><i class="fa-solid fa-circle-check"></i> ${item.status || 'Delivered'}</span>
          </div>

          <p class="feed-item-body">${item.body}</p>

          <div class="feed-item-footer">
            <div class="feed-meta-info">
              <span><i class="fa-solid fa-users text-primary"></i> <strong>Audience:</strong> ${item.recipients}</span>
              <span><i class="fa-solid fa-tag text-muted"></i> Ref: <code>${item.ref || item.id}</code></span>
            </div>
            <div class="feed-item-actions">
              <button type="button" class="btn btn-secondary btn-sm" onclick="portalApp.viewBroadcast('${item.id}')" title="View Official Notice Slip">
                <i class="fa-solid fa-scroll"></i> View Notice
              </button>
              <button type="button" class="btn btn-secondary btn-sm" onclick="portalApp.resendBroadcast('${item.id}')" title="Retransmit via DLT Gateway">
                <i class="fa-solid fa-rotate-right"></i> Re-send
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderCircularsTable(data) {
    const tbody = document.getElementById('circularsTableBody');
    if (!tbody) return;
    const list = data || CIRCULARS_DATA;

    const countBadge = document.getElementById('circularsCountBadge');
    if (countBadge) {
      countBadge.textContent = `${list.length} Published`;
    }

    if (list.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="text-center py-4 text-muted">
            <i class="fa-solid fa-folder-open mb-2 fa-lg d-block"></i>
            No official circulars match current search or category filter.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = list.map(c => `
      <tr>
        <td><code>${c.ref}</code></td>
        <td><strong>${c.title}</strong></td>
        <td style="text-align: center;"><span class="portal-badge ${c.category === 'Examination' ? 'badge-amber' : (c.category === 'Holiday' ? 'badge-primary' : (c.category === 'Advisory' ? 'badge-rose' : 'badge-neutral'))}">${c.category}</span></td>
        <td><small class="text-muted"><i class="fa-solid fa-users text-primary mr-1"></i>${c.audience}</small></td>
        <td><small class="font-weight-bold text-slate">${c.date}</small></td>
        <td style="text-align: center;"><span class="portal-badge badge-success"><i class="fa-solid fa-check"></i> ${c.status}</span></td>
        <td style="text-align: center;">
          <button class="btn btn-secondary btn-sm mr-1" onclick="portalApp.viewNotice('${c.ref}')" title="View Administrative Notice Slip">
            <i class="fa-solid fa-scroll"></i> View Notice
          </button>
          <button class="btn btn-secondary btn-sm" onclick="portalApp.downloadNoticePdf('${c.ref}')" title="Download Official Circular">
            <i class="fa-solid fa-download"></i>
          </button>
        </td>
      </tr>
    `).join('');
  }

  function renderSmsLogsTable(data) {
    const tbody = document.getElementById('smsLogsTableBody');
    if (!tbody) return;
    const list = data || SMS_LOGS_DATA;

    const countBadge = document.getElementById('smsLogCountBadge');
    if (countBadge) {
      countBadge.textContent = `${list.length} Logs`;
    }

    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="text-center py-4 text-muted">No SMS logs matched.</td></tr>';
      return;
    }

    tbody.innerHTML = list.map(s => `
      <tr>
        <td><code>${s.logId}</code></td>
        <td><small class="text-muted font-weight-bold">${s.time}</small></td>
        <td><strong>${s.recipient}</strong></td>
        <td style="text-align: center;"><span class="portal-badge badge-neutral">${s.category}</span></td>
        <td><small>${s.snippet}</small></td>
        <td><small class="text-primary font-weight-bold">${s.gateway}</small></td>
        <td style="text-align: center;"><span class="portal-badge badge-success"><i class="fa-solid fa-check-double"></i> ${s.status}</span></td>
      </tr>
    `).join('');
  }

  function renderEmailLogsTable(data) {
    const tbody = document.getElementById('emailLogsTableBody');
    if (!tbody) return;
    const list = data || EMAIL_LOGS_DATA;

    const countBadge = document.getElementById('emailLogCountBadge');
    if (countBadge) {
      countBadge.textContent = `${list.length} Transmissions`;
    }

    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="text-center py-4 text-muted">No email transmissions matched.</td></tr>';
      return;
    }

    tbody.innerHTML = list.map(e => `
      <tr>
        <td><code>${e.emailId}</code></td>
        <td><small class="text-muted font-weight-bold">${e.time}</small></td>
        <td><strong>${e.recipient}</strong></td>
        <td>${e.subject}</td>
        <td style="text-align: center;"><span class="portal-badge badge-primary">${e.category}</span></td>
        <td style="text-align: center;"><small class="text-emerald font-weight-bold">${e.engagement}</small></td>
        <td style="text-align: center;"><span class="portal-badge badge-success"><i class="fa-solid fa-circle-check"></i> ${e.status}</span></td>
      </tr>
    `).join('');
  }

  function renderPushLogsTable(data) {
    const tbody = document.getElementById('pushLogsTableBody');
    if (!tbody) return;
    const list = data || PUSH_LOGS_DATA;

    const countBadge = document.getElementById('pushLogCountBadge');
    if (countBadge) {
      countBadge.textContent = `${list.length} Pushes`;
    }

    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" class="text-center py-4 text-muted">No push notifications matched.</td></tr>';
      return;
    }

    tbody.innerHTML = list.map(p => `
      <tr>
        <td><code>${p.pushId}</code></td>
        <td><small class="text-muted font-weight-bold">${p.time}</small></td>
        <td><span class="portal-badge badge-primary">${p.target}</span></td>
        <td><strong>${p.title}</strong></td>
        <td><small>${p.body}</small></td>
        <td><code>${p.deepLink}</code></td>
        <td style="text-align: center;"><small class="text-emerald font-weight-bold">${p.openRate}</small></td>
        <td style="text-align: center;"><span class="portal-badge badge-success"><i class="fa-solid fa-bolt"></i> ${p.status}</span></td>
      </tr>
    `).join('');
  }

  function viewNotice(ref) {
    const notice = (CIRCULARS_DATA || []).find(c => c.ref === ref) ||
                   (BROADCAST_FEED_DATA || []).find(b => b.ref === ref || b.id === ref) ||
                   CIRCULARS_DATA[0];
    if (!notice) return;

    if (document.getElementById('vNoticeRef')) document.getElementById('vNoticeRef').textContent = notice.ref || 'CIR-2026-042';
    if (document.getElementById('vNoticeDate')) document.getElementById('vNoticeDate').textContent = notice.date || '24 Sep 2026';
    if (document.getElementById('vNoticeCat')) document.getElementById('vNoticeCat').textContent = notice.category || 'Administrative Notice';
    if (document.getElementById('vNoticeAudience')) document.getElementById('vNoticeAudience').textContent = notice.audience || notice.recipients || 'All School Community';
    if (document.getElementById('vNoticeTitle')) document.getElementById('vNoticeTitle').textContent = notice.title || 'Official Circular';
    if (document.getElementById('vNoticeContent')) {
      document.getElementById('vNoticeContent').innerHTML = notice.content || `<p>${notice.body || 'Official administrative circular issued by order of the Principal.'}</p>`;
    }

    openModal('viewNoticeModal');
  }

  function viewBroadcast(id) {
    const item = (BROADCAST_FEED_DATA || []).find(b => b.id === id);
    if (!item) return;
    viewNotice(item.ref || item.id);
  }

  function resendBroadcast(id) {
    const item = (BROADCAST_FEED_DATA || []).find(b => b.id === id);
    if (!item) return;

    showToast(`Retransmitting "${item.title}" via DLT & WhatsApp gateway...`, 'info');
    setTimeout(() => {
      item.time = 'Retransmitted just now';
      item.status = 'Delivered (100%)';
      renderBroadcastFeed();
      showToast(`Broadcast ${item.id} re-sent successfully to ${item.recipients}!`, 'success');
    }, 600);
  }

  function printFeeReceiptSlip(rcptNo) {
    showToast(`Generating Print Slip for Fee Receipt ${rcptNo}...`, 'info');
    setTimeout(() => { window.print(); }, 300);
  }

  
  // =========================================================================
  // ADDITIONAL SUBVIEW RENDERERS (STAFF ATTENDANCE, APPRAISALS, TIMETABLE, EXAM SCHEDULE & AUDIT)
  // =========================================================================

  function renderStaffAttendanceTable() {
    const tbody = document.getElementById('staffAttendanceTableBody');
    if (!tbody) return;

    const list = (state.faculty || []);
    const dateInput = document.getElementById('staffAttDate');
    const attDate = (dateInput && dateInput.value) ? dateInput.value : new Date().toISOString().split('T')[0];
    const saved = getSavedFacultyAttendance(attDate);

    tbody.innerHTML = list.map((s, idx) => {
      const curStatus = saved[s.id] || s.status || (idx === 4 ? 'Leave' : (idx === 7 ? 'Late' : 'Present'));
      const isAbsent = (curStatus === 'Absent');
      const isLeave = (curStatus === 'Leave');
      const isLate = (curStatus === 'Late');
      const timeIn = (isAbsent || isLeave) ? '—' : (isLate ? '08:48 AM' : '08:30 AM');

      let statusBadge = '<span class="portal-badge badge-success"><i class="fa-solid fa-circle-check"></i> Present</span>';
      if (isAbsent) statusBadge = '<span class="portal-badge badge-danger"><i class="fa-solid fa-circle-xmark"></i> Absent</span>';
      else if (isLeave) statusBadge = '<span class="portal-badge badge-warning"><i class="fa-solid fa-bed"></i> On Medical Leave</span>';
      else if (isLate) statusBadge = '<span class="portal-badge badge-amber"><i class="fa-solid fa-clock"></i> Late Arrival</span>';

      return `
        <tr>
          <td>
            <div style="display:flex; align-items:center; gap:6px;">
              <span class="teacher-id-badge" style="font-size:0.75rem; padding:1px 6px;">${s.id}</span>
              <strong>${s.name}</strong>
            </div>
            <small class="text-muted">${s.phone || '8106636230'}</small>
          </td>
          <td><span class="portal-badge badge-primary">${s.qualification || 'M.Sc, B.Ed'}</span></td>
          <td>
            <strong>${s.role}</strong><br>
            <small class="text-muted">${s.subject || ''}</small>
          </td>
          <td><strong>${timeIn}</strong></td>
          <td>${statusBadge}</td>
          <td><small class="text-primary font-weight-bold"><i class="fa-solid fa-id-badge"></i> Office Verified</small></td>
          <td>
            <button class="btn btn-secondary btn-sm" onclick="portalApp.openTeacherAttendanceModal()" title="Update Attendance for Faculty">
              <i class="fa-solid fa-pen-to-square"></i> Mark Register
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  function renderFacultyAppraisals() {
    const tbody = document.getElementById('facultyAppraisalsTableBody');
    if (!tbody) return;

    const list = (state.faculty || []);
    tbody.innerHTML = list.slice(0, 15).map((s, idx) => {
      const passRate = 95 + (idx % 5);
      const rating = (4.7 + ((idx % 3) * 0.1)).toFixed(1);
      return `
        <tr>
          <td>
            <strong>${s.name}</strong><br>
            <small class="text-muted">${s.role}</small>
          </td>
          <td>${s.subject}</td>
          <td><span class="portal-badge badge-success font-weight-bold">${passRate}% Pass</span></td>
          <td><span class="portal-badge badge-primary">78% Covered</span></td>
          <td><small class="text-emerald font-weight-bold">4.9 / 5.0 (98 Positive)</small></td>
          <td><span class="portal-badge badge-warning font-weight-bold"><i class="fa-solid fa-star"></i> ${rating} / 5.0</span></td>
          <td><span class="portal-badge badge-success"><i class="fa-solid fa-award"></i> Exemplary (A+)</span></td>
        </tr>
      `;
    }).join('');
  }

  function renderVpTimetableGrid() {
    const tbody = document.getElementById('vpTimetableBody');
    if (!tbody) return;

    const schedule = (typeof getTimetableForClass === 'function')
      ? getTimetableForClass('Class X-A')
      : [];

    if (schedule.length === 0) return;

    tbody.innerHTML = schedule.map(row => {
      if (row.isBreak || row.isCoaching) {
        return `
          <tr style="background:#f8fafc; font-weight:600; text-align:center;">
            <td><strong>${row.period}</strong><br><small class="text-muted">${row.timing}</small></td>
            <td colspan="6" style="letter-spacing:1px; color:var(--color-primary);">${row.title}</td>
          </tr>
        `;
      }
      const dayCells = (row.slots || []).map(slot => `
        <td style="font-size:0.85rem;">
          <div style="font-weight:600; color:#1e293b;">${slot}</div>
        </td>
      `).join('');

      return `
        <tr>
          <td><strong>${row.period}</strong><br><small class="text-muted">${row.timing}</small></td>
          ${dayCells}
        </tr>
      `;
    }).join('');
  }

  

  function renderExamScheduleTable() {
    const tbody = document.getElementById('examScheduleTableBody');
    if (!tbody) return;

    tbody.innerHTML = EXAM_SCHEDULE_DETAILED.map(ex => `
      <tr>
        <td><strong>${ex.date}</strong></td>
        <td><small class="text-muted">${ex.time}</small></td>
        <td><span class="portal-badge badge-neutral font-weight-bold">${ex.code}</span></td>
        <td><strong>${ex.subject}</strong></td>
        <td><span class="portal-badge badge-primary font-weight-bold">${ex.marks}</span></td>
        <td><span class="portal-badge badge-success"><i class="fa-solid fa-lock"></i> ${ex.status}</span></td>
        <td>${ex.lead}</td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="portalApp.switchSubTab('examination', 'papers')" title="View Paper">
            <i class="fa-solid fa-eye"></i> View
          </button>
        </td>
      </tr>
    `).join('');
  }

  

  function renderInvigilationDutyTable() {
    const tbody = document.getElementById('invigilationDutyTableBody');
    if (!tbody) return;

    tbody.innerHTML = INVIGILATION_DUTIES_DATA.map(d => `
      <tr>
        <td><strong>${d.hall}</strong></td>
        <td><small class="text-muted">${d.classes}</small></td>
        <td><strong class="text-primary">${d.invig1}</strong></td>
        <td><strong>${d.invig2}</strong></td>
        <td><span class="portal-badge badge-neutral font-weight-bold">${d.total}</span></td>
        <td><span class="portal-badge badge-success"><i class="fa-solid fa-circle-check"></i> ${d.status}</span></td>
      </tr>
    `).join('');
  }

  

  function renderFeeCategoryAuditTable() {
    const tbody = document.getElementById('feeCategoryAuditTableBody');
    if (!tbody) return;

    tbody.innerHTML = FEE_CATEGORY_AUDIT_DATA.map(f => `
      <tr>
        <td><strong>${f.head}</strong></td>
        <td>${f.demand}</td>
        <td><strong class="text-emerald">${f.collected}</strong></td>
        <td><small class="text-muted">${f.concession}</small></td>
        <td><strong class="text-red">${f.dues}</strong></td>
        <td>
          <span class="portal-badge badge-success font-weight-bold">${f.pct}</span>
        </td>
        <td><span class="portal-badge badge-primary"><i class="fa-solid fa-stamp"></i> ${f.status}</span></td>
      </tr>
    `).join('');
  }

  
  // =========================================================================
  // GRANULAR ACCESS CONTROL & PERMISSIONS ENGINE (EXECUTIVE GOVERNANCE)
  // =========================================================================

  // EXECUTIVE OPERATIONAL RESTRICTIONS & INSTITUTIONAL SECURITY
  const DEFAULT_EXECUTIVE_RESTRICTIONS = {
    // Principal Statutory Jurisdiction
    freeze_marks: true,              // Freeze Marks Alteration after terminal exams
    dual_tc_approval: true,          // Dual-Executive Signoff for Transfer Certificates
    fee_concession_cap: true,        // Clerk Fee Concession Ceiling (Max ₹2,000 without Principal)
    cash_handover_audit: true,       // Cashier Shift Closing Physical Audit
    dossier_delete_protection: true, // Permanent Student Dossier Deletion PIN Protection
    timetable_master_lock: true,     // Master Timetable modification locked

    // Vice Principal Operational Jurisdiction
    seal_question_papers: true,      // 24-Hour Confidential Question Paper Seal
    leave_escalation_cap: true,      // Leaves >2 Days require Principal signoff (VP max 2 days)
    sms_broadcast_gate: true,        // Parent Mass SMS Executive Preview Gate
    gate_late_auto_summons: true,    // Automated Parent Summons on 3 Late Gate Passes
    sub_master_protocol: true,       // Emergency Faculty Substitution Mandatory Logging
    discipline_escalation: true      // Disciplinary Hearing & Detention VP Jurisdiction
  };

  const PRINCIPAL_RESTRICTIONS_DEFS = [
    {
      key: 'freeze_marks',
      title: 'Freeze Academic Marks & Terminal Scores',
      icon: 'fa-lock',
      desc: 'Disallow teachers and clerks from modifying or overwriting Unit Test and Terminal examination marks once finalized.',
      warning: 'Requires Principal Override Token to alter'
    },
    {
      key: 'dual_tc_approval',
      title: 'Dual Executive Signoff for Transfer Certificates (TC)',
      icon: 'fa-signature',
      desc: 'Mandates formal dual authorization: both Principal Smt. Gorle Varalakshmi and Vice Principal Sri Navva Anand must sign off before TC release.',
      warning: 'Prevents single-desk unauthorized dispatch'
    },
    {
      key: 'fee_concession_cap',
      title: 'Fee Concession Ceiling Cap (Max ₹2,000)',
      icon: 'fa-hand-holding-dollar',
      desc: 'Office and accounts staff cannot grant fee waivers or concessions exceeding ₹2,000 without Principal written approval.',
      warning: 'High-value waivers strictly escalated to Principal'
    },
    {
      key: 'cash_handover_audit',
      title: 'Cashier Shift Closing Daily Audit Verification',
      icon: 'fa-cash-register',
      desc: 'Requires end-of-day physical cash till reconciliation before fee counter batch closure and ERP sync.',
      warning: 'Enforces cash counter transparency'
    },
    {
      key: 'dossier_delete_protection',
      title: 'Permanent Student Dossier Deletion Armored PIN',
      icon: 'fa-shield-halved',
      desc: 'Prevents accidental or malicious permanent deletion of student academic records and disciplinary files.',
      warning: 'Statutory Student Records Shield'
    },
    {
      key: 'timetable_master_lock',
      title: 'Master Curriculum & Timetable Structural Lock',
      icon: 'fa-table-cells',
      desc: 'Freezes core bell timings, period durations, and room assignments against unauthorized department modifications.',
      warning: 'Principal Master Schedule Lock'
    }
  ];

  const VICE_PRINCIPAL_RESTRICTIONS_DEFS = [
    {
      key: 'seal_question_papers',
      title: 'Confidential Exam Question Paper 24-Hour Seal',
      icon: 'fa-file-shield',
      desc: 'Locks official examination blueprints and question papers from faculty portal views until exactly 24 hours prior to scheduled exam time.',
      warning: 'Confidential Exam Security Enforced'
    },
    {
      key: 'leave_escalation_cap',
      title: 'Faculty Leave Sanction Escalation (3+ Days)',
      icon: 'fa-calendar-check',
      desc: 'Vice Principal can approve short leaves up to 2 days; leaves for 3 or more days strictly escalate to Principal executive sanction.',
      warning: 'VP Scope: <= 2 Days • Principal Scope: 3+ Days'
    },
    {
      key: 'sms_broadcast_gate',
      title: 'Campus Mass SMS & Circular Dispatch Gate',
      icon: 'fa-comment-sms',
      desc: 'Blocks office desk from broadcasting bulk DLT SMS or circulars to parents without mandatory Vice Principal clearance.',
      warning: 'DLT Gate: Requires VP Preview Signoff'
    },
    {
      key: 'gate_late_auto_summons',
      title: 'Automated Gate Late-Coming Parent Summons',
      icon: 'fa-person-walking-dashed-line-arrow-right',
      desc: 'Automatically generates a Vice Principal parent summons conference when a student records 3 late arrival gate slips.',
      warning: 'Campus Discipline Rule 4A'
    },
    {
      key: 'sub_master_protocol',
      title: 'Emergency Faculty Substitution Mandatory Logging',
      icon: 'fa-user-clock',
      desc: 'Strictly mandates logging all zero-period and emergency faculty substitutions through the VP Academic Desk before period commencement.',
      warning: 'Zero-Period Academic Continuity'
    },
    {
      key: 'discipline_escalation',
      title: 'Student Conduct Disciplinary Hearing Jurisdiction',
      icon: 'fa-scale-balanced',
      desc: 'All moderate and high severity classroom conduct incidents and mobile device confiscations are referred to Vice Principal investigation.',
      warning: 'VP Disciplinary Tribunal Authority'
    }
  ];

  function getExecutiveRestrictions() {
    try {
      const saved = localStorage.getItem('sv_executive_restrictions');
      if (saved) return Object.assign({}, DEFAULT_EXECUTIVE_RESTRICTIONS, JSON.parse(saved));
    } catch (e) {}
    return Object.assign({}, DEFAULT_EXECUTIVE_RESTRICTIONS);
  }

  function saveExecutiveRestrictions(restrictions) {
    try {
      localStorage.setItem('sv_executive_restrictions', JSON.stringify(restrictions));
      renderExecutiveRestrictionsForm();
      renderExecutiveRestrictionsBanner();
      showToast('Institutional executive restrictions updated and enforced across all dashboards!', 'success');
    } catch (e) {
      console.error('Error saving executive restrictions:', e);
    }
  }

  function toggleExecutiveRestriction(key, value) {
    const current = getExecutiveRestrictions();
    current[key] = value;
    saveExecutiveRestrictions(current);
  }

  function enforceAllExecutiveRestrictions() {
    const full = {};
    Object.keys(DEFAULT_EXECUTIVE_RESTRICTIONS).forEach(k => full[k] = true);
    saveExecutiveRestrictions(full);
  }

  function resetExecutiveRestrictions() {
    saveExecutiveRestrictions(Object.assign({}, DEFAULT_EXECUTIVE_RESTRICTIONS));
  }

  function enforcePrincipalRestrictions() {
    const current = getExecutiveRestrictions();
    PRINCIPAL_RESTRICTIONS_DEFS.forEach(d => current[d.key] = true);
    saveExecutiveRestrictions(current);
    showToast('Enforced all Principal statutory governance policies!', 'success');
  }

  function resetPrincipalRestrictions() {
    const current = getExecutiveRestrictions();
    PRINCIPAL_RESTRICTIONS_DEFS.forEach(d => current[d.key] = DEFAULT_EXECUTIVE_RESTRICTIONS[d.key]);
    saveExecutiveRestrictions(current);
    showToast('Reset Principal policies to institutional defaults.', 'info');
  }

  function enforceVicePrincipalRestrictions() {
    const current = getExecutiveRestrictions();
    VICE_PRINCIPAL_RESTRICTIONS_DEFS.forEach(d => current[d.key] = true);
    saveExecutiveRestrictions(current);
    showToast('Enforced all Vice Principal operational policies!', 'success');
  }

  function resetVicePrincipalRestrictions() {
    const current = getExecutiveRestrictions();
    VICE_PRINCIPAL_RESTRICTIONS_DEFS.forEach(d => current[d.key] = DEFAULT_EXECUTIVE_RESTRICTIONS[d.key]);
    saveExecutiveRestrictions(current);
    showToast('Reset Vice Principal policies to operational defaults.', 'info');
  }

  function renderExecutiveRestrictionsBanner() {
    const banner = document.getElementById('execRestrictionsBanner');
    const container = document.getElementById('execRestrictionsBadgeRow');
    const titleEl = document.getElementById('execRestrictionsTitle');
    const badgeEl = document.getElementById('execRestrictionsRoleBadge');
    const subtitleEl = document.getElementById('execRestrictionsSubtitle');
    const iconBox = document.getElementById('execRestrictionsIconBox');
    if (!container) return;

    const restr = getExecutiveRestrictions();
    const isVP = (state.currentRole === 'vice-principal');

    if (banner) {
      banner.classList.toggle('vp-theme', isVP);
    }

    if (iconBox) {
      iconBox.innerHTML = isVP
        ? '<i class="fa-solid fa-scale-balanced"></i>'
        : '<i class="fa-solid fa-landmark"></i>';
    }

    if (titleEl) {
      titleEl.textContent = isVP
        ? 'Vice Principal Operational Restrictions & Academic Governance'
        : 'Principal Executive Restrictions & Institutional Governance';
    }

    if (badgeEl) {
      badgeEl.className = isVP ? 'portal-badge badge-purple' : 'portal-badge badge-primary';
      badgeEl.innerHTML = isVP
        ? '<i class="fa-solid fa-user-check"></i> Vice Principal Jurisdiction'
        : '<i class="fa-solid fa-user-tie"></i> Principal Jurisdiction';
    }

    if (subtitleEl) {
      subtitleEl.textContent = isVP
        ? 'Campus academic & discipline policies enforced by Vice Principal Sri Navva Anand. Examination locks and student conduct policies configured here take immediate effect.'
        : 'Campus-wide institutional policies enforced by Principal Smt. Gorle Varalakshmi. Modules restricted here are dynamically hidden from teacher & clerk dashboards.';
    }

    const activeList = isVP ? VICE_PRINCIPAL_RESTRICTIONS_DEFS : PRINCIPAL_RESTRICTIONS_DEFS;

    container.innerHTML = activeList.map(b => {
      const isEnforced = restr[b.key] !== false;
      return `
        <span class="erb-badge ${isEnforced ? 'restricted-policy' : 'neutral-policy'}" title="${b.title}: ${isEnforced ? 'Active & Enforced' : 'Unlocked / Normal'}">
          <i class="fa-solid ${b.icon}"></i> ${b.title.split(' ')[0]}: ${isEnforced ? 'ENFORCED' : 'OFF'}
        </span>
      `;
    }).join('');
  }

  function openExecutiveRestrictions() {
    navigateTo('settings');
    switchSubTab('settings', 'permissions');
    switchPermissionsSubTab('executive');
  }

  function renderPrincipalRestrictionsForm() {
    const container = document.getElementById('principalRestrictionsGrid');
    if (!container) return;
    const restr = getExecutiveRestrictions();

    container.innerHTML = PRINCIPAL_RESTRICTIONS_DEFS.map(d => {
      const isEnforced = restr[d.key] !== false;
      return `
        <div class="perm-card ${isEnforced ? 'enabled' : 'disabled'}">
          <div class="perm-card-header">
            <div class="perm-icon-wrap" style="background: rgba(37, 99, 235, 0.1); color: var(--color-primary);"><i class="fa-solid ${d.icon}"></i></div>
            <div class="perm-info">
              <h4>${d.title}</h4>
              <p>${d.desc}</p>
            </div>
            <div class="perm-switch-wrap">
              <label class="perm-switch">
                <input type="checkbox" id="exec_perm_${d.key}" ${isEnforced ? 'checked' : ''} onchange="portalApp.toggleExecutiveRestriction('${d.key}', this.checked)">
                <span class="perm-slider"></span>
              </label>
            </div>
          </div>
          <div class="perm-card-footer">
            <span class="perm-status-badge ${isEnforced ? 'badge-allowed' : 'badge-denied'}">
              <i class="fa-solid ${isEnforced ? 'fa-lock' : 'fa-lock-open'}"></i> ${isEnforced ? 'Principal Policy Enforced' : 'Restriction Lifted'}
            </span>
            <span class="text-xs text-muted" style="margin-left:auto;"><i class="fa-solid fa-circle-info"></i> ${d.warning}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderVicePrincipalRestrictionsForm() {
    const container = document.getElementById('vicePrincipalRestrictionsGrid');
    if (!container) return;
    const restr = getExecutiveRestrictions();

    container.innerHTML = VICE_PRINCIPAL_RESTRICTIONS_DEFS.map(d => {
      const isEnforced = restr[d.key] !== false;
      return `
        <div class="perm-card ${isEnforced ? 'enabled' : 'disabled'}">
          <div class="perm-card-header">
            <div class="perm-icon-wrap" style="background: rgba(99, 102, 241, 0.12); color: #6366f1;"><i class="fa-solid ${d.icon}"></i></div>
            <div class="perm-info">
              <h4>${d.title}</h4>
              <p>${d.desc}</p>
            </div>
            <div class="perm-switch-wrap">
              <label class="perm-switch">
                <input type="checkbox" id="exec_perm_${d.key}" ${isEnforced ? 'checked' : ''} onchange="portalApp.toggleExecutiveRestriction('${d.key}', this.checked)">
                <span class="perm-slider"></span>
              </label>
            </div>
          </div>
          <div class="perm-card-footer">
            <span class="perm-status-badge ${isEnforced ? 'badge-allowed' : 'badge-denied'}">
              <i class="fa-solid ${isEnforced ? 'fa-lock' : 'fa-lock-open'}"></i> ${isEnforced ? 'VP Policy Enforced' : 'Restriction Lifted'}
            </span>
            <span class="text-xs text-muted" style="margin-left:auto;"><i class="fa-solid fa-circle-info"></i> ${d.warning}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderExecutiveRestrictionsForm() {
    renderPrincipalRestrictionsForm();
    renderVicePrincipalRestrictionsForm();
  }

  // HOD (HEAD OF DEPARTMENT) PERMISSION DELEGATION SYSTEM
  const HOD_DEPARTMENTS = {
    science: {
      key: 'science',
      name: 'Physical & Biological Sciences',
      hodId: 'SV200005',
      hodName: 'Sri K. Rajesh',
      hodRole: 'Science HOD (Physics & Chemistry)',
      faculty: ['SV200005', 'SV200006', 'SV200010'] // Rajesh, Lakshmi, Venkatesh
    },
    maths: {
      key: 'maths',
      name: 'Mathematics Department',
      hodId: 'SV200004',
      hodName: 'Smt. P. Sunitha',
      hodRole: 'Mathematics HOD',
      faculty: ['SV200004', 'SV200002', 'SV200011'] // Sunitha, Anjali, Suresh
    },
    english_lang: {
      key: 'english_lang',
      name: 'English & Languages Department',
      hodId: 'SV200003',
      hodName: 'Sri D. Suresh',
      hodRole: 'English & Languages HOD',
      faculty: ['SV200003', 'SV200008', 'SV200009'] // Suresh, Ramana (Telugu), Sunitha (Hindi)
    },
    social: {
      key: 'social',
      name: 'Social Sciences & Humanities',
      hodId: 'SV200007',
      hodName: 'Smt. B. Padmavati',
      hodRole: 'Social Studies HOD',
      faculty: ['SV200007', 'SV200012'] // Padmavati, Prasad
    },
    computers: {
      key: 'computers',
      name: 'Computer Science & ICT',
      hodId: 'SV200008',
      hodName: 'Sri Ch. Ramesh',
      hodRole: 'Computer Lab & ICT Incharge',
      faculty: ['SV200008']
    }
  };

  let currentHodDeptKey = 'science';
  let currentHodTeacherId = 'SV200006'; // default Smt. M. Lakshmi under Rajesh

  function initHodDelegationView() {
    onHodDeptChange(currentHodDeptKey);
  }

  function onHodDeptChange(deptKey) {
    currentHodDeptKey = deptKey;
    const dept = HOD_DEPARTMENTS[deptKey] || HOD_DEPARTMENTS.science;

    // 1. Populate teacher dropdown with faculty under this HOD
    const select = document.getElementById('permHodTeacherSelect');
    if (select) {
      select.innerHTML = dept.faculty.map(fid => {
        const fac = state.faculty.find(f => f.id === fid) || { id: fid, name: fid, subject: dept.name, role: 'Faculty' };
        const isHod = (fid === dept.hodId);
        return `<option value="${fid}" ${fid === currentHodTeacherId ? 'selected' : ''}>${fac.id} — ${fac.name} (${fac.subject || fac.role})${isHod ? ' [DEPT HOD]' : ''}</option>`;
      }).join('');

      // If currentHodTeacherId not in this dept, pick first
      if (!dept.faculty.includes(currentHodTeacherId)) {
        currentHodTeacherId = dept.faculty[0];
        select.value = currentHodTeacherId;
      }
    }

    // 2. Render HOD Lead & Scope Card
    const cardEl = document.getElementById('hodDeptScopeCard');
    if (cardEl) {
      cardEl.innerHTML = `
        <div class="teacher-perm-profile" style="border-left: 4px solid var(--color-primary);">
          <div class="t-perm-avatar" style="background:var(--color-primary); color:#fff;"><i class="fa-solid fa-users-gear"></i></div>
          <div class="t-perm-meta">
            <div style="display:flex; align-items:center; gap:8px;">
              <h3>${dept.name}</h3>
              <span class="portal-badge badge-primary"><i class="fa-solid fa-award"></i> HOD: ${dept.hodName} (${dept.hodId})</span>
            </div>
            <div class="t-perm-sub">${dept.hodRole} &bull; Total ${dept.faculty.length} Faculty Members Reporting</div>
            <div class="t-perm-contact" style="color:var(--color-text-muted);">
              <i class="fa-solid fa-circle-info text-primary"></i> 
              <strong>HOD Authority Scope:</strong> Delegated permission authority over academic lesson plans, question paper drafts, homework, and marks tabulation for teachers in this department.
            </div>
          </div>
        </div>
      `;
    }

    // 3. Render granular capabilities grid for current teacher
    renderHodTeacherPermsGrid(currentHodTeacherId);
    renderHodDeptFacultyTable();
  }

  function onHodTeacherChange(teacherId) {
    currentHodTeacherId = teacherId;
    renderHodTeacherPermsGrid(teacherId);
  }

  function renderHodTeacherPermsGrid(teacherId) {
    const container = document.getElementById('hodPermsGrid');
    if (!container) return;
    const perms = getTeacherPermissions(teacherId);

    const capabilities = [
      { key: 'enter_marks', name: 'Marks Entry & Tabulation', icon: 'fa-pen-to-square', desc: 'Can enter Unit Test and Terminal marks for subject classes' },
      { key: 'create_exams', name: 'Create Exams & Question Papers', icon: 'fa-file-circle-plus', desc: 'Authorized to draft exam blueprints and questions under HOD supervision' },
      { key: 'homework_assignments', name: 'Homework & Assignments', icon: 'fa-book-bookmark', desc: 'Can assign daily homework and review student submissions' },
      { key: 'study_materials', name: 'Study Materials & Syllabus', icon: 'fa-file-lines', desc: 'Can upload department notes, worksheets & PDFs' },
      { key: 'mark_attendance', name: 'Daily Attendance Marking', icon: 'fa-clipboard-check', desc: 'Can mark morning class attendance for assigned periods' },
      { key: 'view_attendance', name: 'Attendance Registers & History', icon: 'fa-calendar-day', desc: 'Can inspect monthly class attendance register' },
      { key: 'class_sections', name: 'Class & Section Management', icon: 'fa-shapes', desc: 'Can manage assigned class students and seating' },
      { key: 'view_timetable', name: 'Timetable & Substitutions', icon: 'fa-calendar-week', desc: 'Can view teaching periods and log substitution acceptance' },
      { key: 'send_announcements', name: 'Class Broadcasts & Notices', icon: 'fa-bullhorn', desc: 'Can broadcast departmental announcements to parents' },
      { key: 'view_students', name: 'Class Student Roster', icon: 'fa-users', desc: 'Can access assigned student list and contact records' }
    ];

    container.innerHTML = capabilities.map(c => {
      const isChecked = perms[c.key] !== false;
      return `
        <div class="perm-card ${isChecked ? 'enabled' : 'disabled'}">
          <div class="perm-card-header">
            <div class="perm-icon-wrap"><i class="fa-solid ${c.icon}"></i></div>
            <div class="perm-info">
              <h4>${c.name}</h4>
              <p>${c.desc}</p>
            </div>
            <div class="perm-switch-wrap">
              <label class="perm-switch">
                <input type="checkbox" id="hod_perm_${c.key}" ${isChecked ? 'checked' : ''}>
                <span class="perm-slider"></span>
              </label>
            </div>
          </div>
          <div class="perm-card-footer">
            <span class="perm-status-badge ${isChecked ? 'badge-allowed' : 'badge-denied'}">
              <i class="fa-solid ${isChecked ? 'fa-check' : 'fa-ban'}"></i> ${isChecked ? 'HOD Authorized' : 'Permission Restricted'}
            </span>
          </div>
        </div>
      `;
    }).join('');
  }

  function applyHodPreset(preset) {
    const keys = ['enter_marks', 'create_exams', 'homework_assignments', 'study_materials', 'mark_attendance', 'view_attendance', 'class_sections', 'view_timetable', 'send_announcements', 'view_students'];
    const perms = getTeacherPermissions(currentHodTeacherId);

    if (preset === 'full') {
      keys.forEach(k => perms[k] = true);
      showToast('Applied Full Departmental Capabilities Preset', 'info');
    } else if (preset === 'teaching_only') {
      keys.forEach(k => {
        perms[k] = ['homework_assignments', 'study_materials', 'mark_attendance', 'view_attendance', 'view_timetable', 'view_students'].includes(k);
      });
      showToast('Applied Curriculum & Teaching Only Preset', 'info');
    } else if (preset === 'exam_restricted') {
      keys.forEach(k => {
        if (k === 'create_exams') perms[k] = false;
        else perms[k] = true;
      });
      showToast('Applied Exam Paper Restricted Preset (Drafting Disabled)', 'info');
    }

    saveTeacherPermissions(currentHodTeacherId, perms);
    renderHodTeacherPermsGrid(currentHodTeacherId);
    renderHodDeptFacultyTable();
  }

  function saveHodDelegatedPermissions() {
    const teacherId = currentHodTeacherId;
    const perms = getTeacherPermissions(teacherId);
    const keys = ['enter_marks', 'create_exams', 'homework_assignments', 'study_materials', 'mark_attendance', 'view_attendance', 'class_sections', 'view_timetable', 'send_announcements', 'view_students'];

    keys.forEach(k => {
      const cb = document.getElementById('hod_perm_' + k);
      if (cb) perms[k] = cb.checked;
    });

    const dept = HOD_DEPARTMENTS[currentHodDeptKey];
    saveTeacherPermissions(teacherId, perms);

    // Save delegation audit log
    try {
      const logs = JSON.parse(localStorage.getItem('sv_hod_delegation_audit') || '[]');
      logs.unshift({
        teacherId,
        department: dept.name,
        hodId: dept.hodId,
        hodName: dept.hodName,
        date: new Date().toLocaleString(),
        summary: Object.keys(perms).filter(k => perms[k]).length + ' permissions active'
      });
      localStorage.setItem('sv_hod_delegation_audit', JSON.stringify(logs.slice(0, 50)));
    } catch (e) {}

    renderHodTeacherPermsGrid(teacherId);
    renderHodDeptFacultyTable();
    showToast(`Department permissions for ${teacherId} authorized and saved by HOD ${dept.hodName}!`, 'success');
  }

  function renderHodDeptFacultyTable() {
    const tbody = document.getElementById('hodDeptFacultyTableBody');
    if (!tbody) return;
    const dept = HOD_DEPARTMENTS[currentHodDeptKey];

    tbody.innerHTML = dept.faculty.map(fid => {
      const fac = state.faculty.find(f => f.id === fid) || { id: fid, name: fid, subject: dept.name, role: 'Faculty Member' };
      const perms = getTeacherPermissions(fid);
      const activeCount = Object.values(perms).filter(Boolean).length;
      const isHod = (fid === dept.hodId);

      return `
        <tr>
          <td><span class="teacher-id-badge">${fac.id}</span></td>
          <td><strong>${fac.name}</strong> ${isHod ? '<span class="portal-badge badge-primary" style="font-size:0.7rem;">HOD</span>' : ''}</td>
          <td>${fac.subject || dept.name}</td>
          <td>${isHod ? 'Department Head & Lead' : 'Faculty Reporting to HOD'}</td>
          <td style="text-align:center;">
            <span class="portal-badge ${activeCount >= 9 ? 'badge-success' : (activeCount >= 5 ? 'badge-primary' : 'badge-amber')}">
              ${activeCount} / 12 Active
            </span>
          </td>
          <td style="text-align:center;">
            <span class="text-xs text-muted">${isHod ? 'Executive Scope' : 'HOD Delegated'}</span>
          </td>
          <td style="text-align:center;">
            <button type="button" class="btn btn-secondary btn-sm" onclick="portalApp.onHodTeacherChange('${fac.id}'); document.getElementById('permHodTeacherSelect').value='${fac.id}'; portalApp.showToast('Selected ' + '${fac.name}', 'info');">
              <i class="fa-solid fa-sliders"></i> Configure
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  // =========================================================================
  // GRANULAR NAVIGATION SUBMENU PERMISSIONS SYSTEM (Principal & VP Governance)
  // =========================================================================

  const MANAGEMENT_SUBMENU_SCHEMA = [
    {
      key: 'students',
      name: 'Students',
      icon: 'fa-user-graduate',
      desc: 'Admissions register, student dossier lookup, TC processing & performance',
      subs: [
        { key: 'all', label: 'All Students', desc: 'Active student roster register' },
        { key: 'profiles', label: 'Student Profiles', desc: 'Comprehensive student dossiers' },
        { key: 'admissions', label: 'Admissions', desc: 'New admission application processing' },
        { key: 'transfers', label: 'Transfers (TC)', desc: 'Transfer Certificate issuance & clearance' },
        { key: 'performance', label: 'Student Performance', desc: 'Academic grading & assessment metrics' }
      ]
    },
    {
      key: 'teachers',
      name: 'Teachers & Staff',
      icon: 'fa-chalkboard-user',
      desc: 'Staff directory, qualification records & contact lists',
      subs: [
        { key: 'faculty', label: 'Faculty (Teaching)', desc: 'Teaching faculty roster & credentials' },
        { key: 'staff', label: 'Staff (Non-Teaching)', desc: 'Administrative & non-teaching staff' },
        { key: 'attendance', label: 'Staff Attendance', desc: 'Biometric & daily staff attendance' },
        { key: 'leave', label: 'Leave Requests', desc: 'Faculty leave requests review' },
        { key: 'performance', label: 'Appraisal & Feedback', desc: 'Staff appraisal & feedback records' }
      ]
    },
    {
      key: 'academics',
      name: 'Academics',
      icon: 'fa-book-open',
      desc: 'Class sections, subjects allocation & academic syllabi',
      subs: [
        { key: 'classes', label: 'Classes & Sections', desc: 'Classroom & section allocations' },
        { key: 'subjects', label: 'Subjects & Syllabus', desc: 'Subject syllabi & lesson tracking' },
        { key: 'timetable', label: 'Master Timetable', desc: 'Master timetable class grid' },
        { key: 'exams', label: 'Exams Schedule', desc: 'Term and unit examination timetable' },
        { key: 'results', label: 'Results & Grading', desc: 'Grading scale and result sheets' },
        { key: 'reports', label: 'Academic Reports', desc: 'Comprehensive academic analytics' }
      ]
    },
    {
      key: 'attendance',
      name: 'Attendance',
      icon: 'fa-clipboard-user',
      desc: 'Class attendance overview & daily absentee rosters',
      subs: [
        { key: 'student', label: 'Student Attendance', desc: 'Classwise daily student attendance' },
        { key: 'teacher', label: 'Teacher Attendance', desc: 'Daily teacher attendance register' },
        { key: 'daily', label: 'Daily Report', desc: 'Daily attendance summary & absentees' },
        { key: 'monthly', label: 'Monthly Summary', desc: 'Monthly attendance trends & percentages' }
      ]
    },
    {
      key: 'timetable',
      name: 'Timetable',
      icon: 'fa-calendar-days',
      desc: 'Master timetable grids, period schedules & teacher substitutions',
      subs: [
        { key: 'master', label: 'Class Schedules', desc: 'Weekly timetable schedule' },
        { key: 'substitutions', label: 'Substitution Planner', desc: 'Teacher substitution arrangements' },
        { key: 'rooms', label: 'Lab & Hall Allocations', desc: 'Science lab & auditorium allocation' }
      ]
    },
    {
      key: 'examinations',
      name: 'Examinations',
      icon: 'fa-file-signature',
      desc: 'Unit tests, examination timetables & hall seating plans',
      subs: [
        { key: 'schedule', label: 'Exam Schedule', desc: 'Examination date-sheet' },
        { key: 'invigilation', label: 'Invigilation Duties', desc: 'Faculty invigilation duty rosters' },
        { key: 'halls', label: 'Room Seating Plan', desc: 'Hall-wise student seating arrangement' },
        { key: 'results', label: 'Tabulation & Marks', desc: 'Marks entry & tabulation sheets' }
      ]
    },
    {
      key: 'discipline',
      name: 'Discipline',
      icon: 'fa-scale-balanced',
      desc: 'Late register, behavioral incident records & parent summons',
      subs: [
        { key: 'all', label: 'Incident Records', desc: 'Disciplinary infractions & records' },
        { key: 'late', label: 'Late-Coming Register', desc: 'Daily late arrival log' },
        { key: 'merit', label: 'Merit & Demerit', desc: 'Student conduct points & honors' },
        { key: 'summons', label: 'Parent Convocations', desc: 'Parent meeting summons & notices' }
      ]
    },
    {
      key: 'leaves',
      name: 'Leave Management',
      icon: 'fa-calendar-minus',
      desc: 'Faculty leave review & student medical leave registers',
      subs: [
        { key: 'faculty', label: 'Faculty Leave Review', desc: 'Teacher leave applications review' },
        { key: 'students', label: 'Student Leave Requests', desc: 'Student medical & personal leave' },
        { key: 'history', label: 'Leave History Register', desc: 'Consolidated leave archive' }
      ]
    },
    {
      key: 'fees',
      name: 'Fees',
      icon: 'fa-receipt',
      desc: 'Daily fee collection counter, payment receipts & dues audit',
      subs: [
        { key: 'collection', label: 'Fee Collection', desc: 'Daily fee collection counter' },
        { key: 'pending', label: 'Pending Dues', desc: 'Class-wise student fee arrears' },
        { key: 'reports', label: 'Fee Reports', desc: 'Fee collection audit & summaries' },
        { key: 'transactions', label: 'Transactions Ledger', desc: 'Receipts & payment audit ledger' }
      ]
    },
    {
      key: 'communication',
      name: 'Communication',
      icon: 'fa-bullhorn',
      desc: 'Circulars, DLT SMS broadcasting & parent push notices',
      subs: [
        { key: 'announcements', label: 'Announcements', desc: 'General campus notices' },
        { key: 'notices', label: 'Official Circulars', desc: 'Administrative circulars' },
        { key: 'sms', label: 'SMS Broadcast', desc: 'DLT-registered SMS blasts' },
        { key: 'email', label: 'Email Dispatch', desc: 'Bulk email notifications' },
        { key: 'push', label: 'Mobile Push', desc: 'Parent app notifications' }
      ]
    },
    {
      key: 'events',
      name: 'Events',
      icon: 'fa-calendar-check',
      desc: 'School calendar, sports day & competition schedules',
      subs: [
        { key: 'calendar', label: 'Annual Calendar', desc: 'Yearly academic & holiday calendar' },
        { key: 'school', label: 'School Events', desc: 'Annual day, science fair & festivals' },
        { key: 'competitions', label: 'Competitions', desc: 'Inter-house & inter-school contests' },
        { key: 'activities', label: 'Club & Sports', desc: 'Clubs, karate, yoga & sports' }
      ]
    },
    {
      key: 'reports',
      name: 'Reports',
      icon: 'fa-chart-pie',
      desc: 'Academic benchmark curves, fee realization & demographic audits',
      subs: [
        { key: 'academic', label: 'Academic Analytics', desc: 'Pass percentage & grade distributions' },
        { key: 'attendance', label: 'Attendance Records', desc: 'Institutional attendance trends' },
        { key: 'financial', label: 'Financial Statements', desc: 'Revenue, fees & expenditure audits' },
        { key: 'staff', label: 'Staff Payroll & Audits', desc: 'Staff payroll & biometric logs' },
        { key: 'student', label: 'Student Demographics', desc: 'Enrolment & caste/gender distribution' }
      ]
    }
  ];

  const TEACHER_SUBMENU_SCHEMA = [
    {
      key: 'my-classes',
      name: 'My Classes',
      icon: 'fa-chalkboard',
      desc: 'Assigned teaching classes and class-teacher workspaces',
      subs: [
        { key: '8a', label: 'Class 8A (Class Teacher)', desc: 'Class Teacher Dossier' },
        { key: '9b', label: 'Class 9B (Maths)', desc: 'Subject Faculty Class' },
        { key: '7c', label: 'Class 7C (Maths)', desc: 'Subject Faculty Class' },
        { key: '10a', label: 'Class 10A (Remedial)', desc: 'Board Exam Remedial' }
      ]
    },
    {
      key: 'students',
      name: 'Students',
      icon: 'fa-user-graduate',
      desc: 'Class student registers, dossiers and performance profiles',
      subs: [
        { key: 'list', label: 'Student List', desc: 'Assigned class student roster' },
        { key: 'profile', label: 'Student Profile', desc: 'Detailed student profiles' },
        { key: 'att-history', label: 'Attendance', desc: 'Student attendance registers' },
        { key: 'perf', label: 'Performance', desc: 'Subject performance curves' }
      ]
    },
    {
      key: 'attendance',
      name: 'Attendance',
      icon: 'fa-clipboard-user',
      desc: 'Daily morning attendance entry and monthly logs',
      subs: [
        { key: 'mark', label: 'Mark Attendance', desc: 'Daily period/morning attendance' },
        { key: 'history', label: 'Attendance History', desc: 'Monthly class registers' },
        { key: 'report', label: 'Attendance Report', desc: 'Cumulative absentee analytics' }
      ]
    },
    {
      key: 'academics',
      name: 'Academics',
      icon: 'fa-book-open',
      desc: 'Homework assignments, lesson plans and syllabus progression',
      subs: [
        { key: 'assignments', label: 'Assignments', desc: 'Class project assignments' },
        { key: 'homework', label: 'Homework', desc: 'Daily subject homework' },
        { key: 'materials', label: 'Study Materials', desc: 'Uploaded notes and worksheets' },
        { key: 'plans', label: 'Lesson Plans', desc: 'Weekly instructional planners' },
        { key: 'syllabus', label: 'Syllabus', desc: 'Term syllabus tracker' }
      ]
    },
    {
      key: 'examinations',
      name: 'Examinations',
      icon: 'fa-file-signature',
      desc: 'Exam creation, question blueprints and marks entry',
      subs: [
        { key: 'create', label: 'Create Exam', desc: 'Draft exams and test papers' },
        { key: 'enter-marks', label: 'Enter Marks', desc: 'Unit test and term marks tabulation' },
        { key: 'grade', label: 'Grade Students', desc: 'Continuous evaluation grading' },
        { key: 'results', label: 'Results', desc: 'Published class result summaries' }
      ]
    },
    {
      key: 'timetable',
      name: 'Timetable',
      icon: 'fa-calendar-days',
      desc: 'Faculty period schedule and class timetables',
      subs: [
        { key: 'my', label: 'My Timetable', desc: 'Personal weekly teaching periods' },
        { key: 'class', label: 'Class Timetable', desc: 'Class weekly period grids' }
      ]
    },
    {
      key: 'communication',
      name: 'Communication',
      icon: 'fa-bullhorn',
      desc: 'Class notices, circulars and parent messaging',
      subs: [
        { key: 'class-announcements', label: 'Class Announcements', desc: 'Direct class announcements' },
        { key: 'parent-messages', label: 'Parent Messages', desc: 'Direct parent communications' },
        { key: 'notifications', label: 'Notifications', desc: 'Campus broadcast alerts' }
      ]
    },
    {
      key: 'leave',
      name: 'Leave',
      icon: 'fa-calendar-minus',
      desc: 'Faculty casual & medical leave applications',
      subs: [
        { key: 'apply', label: 'Apply Leave', desc: 'Submit leave request to Principal/VP' },
        { key: 'status', label: 'Leave Status', desc: 'Check executive approval status' }
      ]
    },
    {
      key: 'reports',
      name: 'Reports',
      icon: 'fa-chart-pie',
      desc: 'Class academic reports and performance analytics',
      subs: [
        { key: 'student-perf', label: 'Student Performance', desc: 'Class performance metrics' }
      ]
    }
  ];

  // Institutional default: Every submenu is hidden from Office/Clerk until allowed by Principal/VP
  const DEFAULT_CLERK_SUBMENU_PERMISSIONS = {
    // Students
    'students.all': true,
    'students.profiles': true,
    'students.admissions': false,
    'students.transfers': false,
    'students.performance': false,

    // Teachers & Staff
    'teachers.faculty': false,
    'teachers.staff': false,
    'teachers.attendance': false,
    'teachers.leave': false,
    'teachers.performance': false,

    // Academics
    'academics.classes': false,
    'academics.subjects': false,
    'academics.timetable': false,
    'academics.exams': false,
    'academics.results': false,
    'academics.reports': false,

    // Attendance
    'attendance.student': true,
    'attendance.teacher': false,
    'attendance.daily': true,
    'attendance.monthly': false,

    // Timetable
    'timetable.master': false,
    'timetable.substitutions': false,
    'timetable.rooms': false,

    // Examinations
    'examinations.schedule': false,
    'examinations.invigilation': false,
    'examinations.halls': false,
    'examinations.results': false,

    // Discipline
    'discipline.all': false,
    'discipline.late': false,
    'discipline.merit': false,
    'discipline.summons': false,

    // Leaves
    'leaves.faculty': false,
    'leaves.students': false,
    'leaves.history': false,

    // Fees
    'fees.collection': true,
    'fees.pending': true,
    'fees.reports': false,
    'fees.transactions': false,

    // Communication
    'communication.announcements': true,
    'communication.notices': true,
    'communication.sms': false,
    'communication.email': false,
    'communication.push': false,

    // Events
    'events.calendar': false,
    'events.school': false,
    'events.competitions': false,
    'events.activities': false,

    // Reports
    'reports.academic': false,
    'reports.attendance': false,
    'reports.financial': false,
    'reports.staff': false,
    'reports.student': false
  };

  const DEFAULT_TEACHER_SUBMENU_PERMISSIONS = {
    'my-classes.8a': true,
    'my-classes.9b': true,
    'my-classes.7c': true,
    'my-classes.10a': true,
    'students.list': true,
    'students.profile': true,
    'students.att-history': true,
    'students.perf': true,
    'attendance.mark': true,
    'attendance.history': true,
    'attendance.report': true,
    'academics.assignments': true,
    'academics.homework': true,
    'academics.materials': true,
    'academics.plans': false,
    'academics.syllabus': true,
    'examinations.create': false,
    'examinations.enter-marks': true,
    'examinations.grade': true,
    'examinations.results': false,
    'timetable.my': true,
    'timetable.class': true,
    'communication.class-announcements': true,
    'communication.parent-messages': true,
    'communication.notifications': true,
    'leave.apply': true,
    'leave.status': true,
    'reports.student-perf': true
  };

  const DEFAULT_CLERK_PERMISSIONS = {
    dashboard: true,
    students: true,
    teachers: false,
    academics: false,
    attendance: true,
    timetable: false,
    examinations: false,
    discipline: false,
    leaves: false,
    fees: true,
    communication: true,
    events: false,
    reports: false,
    settings: false
  };

  const DEFAULT_TEACHER_PERMISSIONS = {
    mark_attendance: true,
    view_attendance: true,
    class_sections: true,
    enter_marks: true,
    create_exams: false,
    student_profiles: true,
    homework_assignments: true,
    study_materials: true,
    view_timetable: true,
    send_announcements: true,
    apply_leave: true,
    view_students: true
  };

  function getClerkSubmenuPermissions() {
    try {
      const saved = localStorage.getItem('sv_clerk_submenu_permissions');
      if (saved) {
        const parsed = JSON.parse(saved);
        const admPerm = localStorage.getItem('sv_office_admission_permission');
        if (admPerm !== null) {
          parsed['students.admissions'] = (admPerm === 'true');
        }
        return Object.assign({}, DEFAULT_CLERK_SUBMENU_PERMISSIONS, parsed);
      }
    } catch (e) {}

    const initial = Object.assign({}, DEFAULT_CLERK_SUBMENU_PERMISSIONS);
    const admPerm = localStorage.getItem('sv_office_admission_permission');
    if (admPerm !== null) {
      initial['students.admissions'] = (admPerm === 'true');
    }
    return initial;
  }

  function saveClerkSubmenuPermissions(perms) {
    try {
      localStorage.setItem('sv_clerk_submenu_permissions', JSON.stringify(perms));
      if (typeof perms['students.admissions'] === 'boolean') {
        localStorage.setItem('sv_office_admission_permission', perms['students.admissions'] ? 'true' : 'false');
      }
      applyRolePermissions(state.currentRole);
      renderSettingsAdmissionPermissionCard();
      showToast('Office / Clerk submenu navigation permissions updated by Executive Desk!', 'success');
    } catch (e) {
      console.error('Error saving clerk submenu permissions:', e);
    }
  }

  function getClerkPermissions() {
    const subPerms = getClerkSubmenuPermissions();
    const result = { dashboard: true, settings: false };
    MANAGEMENT_SUBMENU_SCHEMA.forEach(m => {
      result[m.key] = m.subs.some(s => subPerms[`${m.key}.${s.key}`] === true);
    });
    return result;
  }

  function saveClerkPermissions(perms) {
    try {
      localStorage.setItem('sv_clerk_permissions', JSON.stringify(perms));
      applyRolePermissions(state.currentRole);
      showToast('Office / Clerk navigation permissions updated successfully!', 'success');
    } catch (e) {
      console.error('Error saving clerk permissions:', e);
    }
  }

  function getTeacherSubmenuPermissions(teacherId) {
    const tId = teacherId || currentEditingTeacherId || 'SV200005';
    try {
      const saved = localStorage.getItem('sv_teacher_submenu_permissions_' + tId);
      if (saved) return Object.assign({}, DEFAULT_TEACHER_SUBMENU_PERMISSIONS, JSON.parse(saved));
    } catch (e) {}
    return Object.assign({}, DEFAULT_TEACHER_SUBMENU_PERMISSIONS);
  }

  function saveTeacherSubmenuPermissions(teacherId, perms) {
    const tId = teacherId || currentEditingTeacherId || 'SV200005';
    try {
      localStorage.setItem('sv_teacher_submenu_permissions_' + tId, JSON.stringify(perms));
      const teacher = state.faculty.find(f => f.id === tId);
      const name = teacher ? teacher.name : tId;
      showToast(`Submenu navigation permissions for ${name} (${tId}) saved by Executive Desk!`, 'success');
    } catch (e) {
      console.error('Error saving teacher submenu permissions:', e);
    }
  }

  function getTeacherPermissions(teacherId) {
    try {
      const saved = localStorage.getItem('sv_teacher_permissions_' + teacherId);
      if (saved) return Object.assign({}, DEFAULT_TEACHER_PERMISSIONS, JSON.parse(saved));
    } catch (e) {}
    return Object.assign({}, DEFAULT_TEACHER_PERMISSIONS);
  }

  function saveTeacherPermissions(teacherId, perms) {
    try {
      localStorage.setItem('sv_teacher_permissions_' + teacherId, JSON.stringify(perms));
      renderTeacherRosterPermissionsTable();
      const teacher = state.faculty.find(f => f.id === teacherId);
      const name = teacher ? teacher.name : teacherId;
      showToast(`Permissions for ${name} (${teacherId}) updated successfully by Executive Leadership!`, 'success');
    } catch (e) {
      console.error('Error saving teacher permissions:', e);
    }
  }

  function syncTabStripPermissions() {
    const role = state.currentRole;
    const isExecutive = (role === 'principal' || role === 'vice-principal');
    const clerkSubPerms = getClerkSubmenuPermissions();

    const stripMappings = [
      { stripId: 'studentsTabStrip', mod: 'students' },
      { stripId: 'teachersTabStrip', mod: 'teachers' },
      { stripId: 'academicsTabStrip', mod: 'academics' },
      { stripId: 'attendanceTabStrip', mod: 'attendance' },
      { stripId: 'timetableTabStrip', mod: 'timetable' },
      { stripId: 'examsTabStrip', mod: 'examinations' },
      { stripId: 'disciplineTabStrip', mod: 'discipline' },
      { stripId: 'leavesTabStrip', mod: 'leaves' },
      { stripId: 'feesTabStrip', mod: 'fees' },
      { stripId: 'commTabStrip', mod: 'communication' },
      { stripId: 'eventsTabStrip', mod: 'events' },
      { stripId: 'reportsTabStrip', mod: 'reports' }
    ];

    stripMappings.forEach(mapping => {
      const strip = document.getElementById(mapping.stripId);
      if (!strip) return;
      const btns = strip.querySelectorAll('.tab-btn[data-sub]');
      btns.forEach(btn => {
        const subKey = btn.getAttribute('data-sub');
        const permKey = `${mapping.mod}.${subKey}`;
        if (isExecutive) {
          btn.style.display = '';
        } else if (role === 'admin') {
          const isAllowed = clerkSubPerms[permKey] === true;
          btn.style.display = isAllowed ? '' : 'none';
        }
      });
    });
  }

  function switchPermissionsSubTab(tab) {
    const pills = document.querySelectorAll('.perm-pill-btn');
    pills.forEach(p => p.classList.remove('active'));

    const clerkPanel = document.getElementById('permPanelClerk');
    const teacherPanel = document.getElementById('permPanelTeacher');
    const matrixPanel = document.getElementById('permPanelMatrix');

    const hodPanel = document.getElementById('permPanelHod');
    const execPanel = document.getElementById('permPanelExecutive');

    if (clerkPanel) clerkPanel.style.display = 'none';
    if (teacherPanel) teacherPanel.style.display = 'none';
    if (hodPanel) hodPanel.style.display = 'none';
    if (execPanel) execPanel.style.display = 'none';
    if (matrixPanel) matrixPanel.style.display = 'none';

    if (tab === 'clerk') {
      const btn = document.getElementById('permTabBtnClerk');
      if (btn) btn.classList.add('active');
      if (clerkPanel) clerkPanel.style.display = 'block';
      renderClerkPermissionsForm();
    } else if (tab === 'teacher') {
      const btn = document.getElementById('permTabBtnTeacher');
      if (btn) btn.classList.add('active');
      if (teacherPanel) teacherPanel.style.display = 'block';
      initTeacherPermissionsView();
    } else if (tab === 'hod') {
      const btn = document.getElementById('permTabBtnHod');
      if (btn) btn.classList.add('active');
      if (hodPanel) hodPanel.style.display = 'block';
      initHodDelegationView();
    } else if (tab === 'executive') {
      const btn = document.getElementById('permTabBtnExecutive');
      if (btn) btn.classList.add('active');
      if (execPanel) execPanel.style.display = 'block';
      renderExecutiveRestrictionsForm();
    } else if (tab === 'matrix') {
      const btn = document.getElementById('permTabBtnMatrix');
      if (btn) btn.classList.add('active');
      if (matrixPanel) matrixPanel.style.display = 'block';
    }
  }

  function renderClerkPermissionsForm() {
    const container = document.getElementById('clerkPermsGrid');
    if (!container) return;
    const subPerms = getClerkSubmenuPermissions();
    const role = state.currentRole;
    const isExecutive = (role === 'principal' || role === 'vice-principal');

    container.className = 'perm-module-grid';
    container.innerHTML = MANAGEMENT_SUBMENU_SCHEMA.map(m => {
      let allowedCount = 0;
      const subRows = m.subs.map(s => {
        const permKey = `${m.key}.${s.key}`;
        const isAllowed = subPerms[permKey] === true;
        if (isAllowed) allowedCount++;

        return `
          <div class="perm-sub-row ${isAllowed ? 'active' : ''}">
            <div class="perm-sub-info">
              <span class="perm-sub-bullet"></span>
              <div>
                <div class="perm-sub-label">${s.label}</div>
                <small class="text-muted" style="font-size: 0.72rem;">${s.desc}</small>
              </div>
            </div>
            <div class="perm-sub-ctrl">
              <span class="perm-sub-badge-tag ${isAllowed ? 'badge-tag-visible' : 'badge-tag-hidden'}">
                <i class="fa-solid ${isAllowed ? 'fa-eye' : 'fa-eye-slash'}"></i> ${isAllowed ? 'Visible' : 'Hidden'}
              </span>
              <label class="perm-switch">
                <input type="checkbox" id="perm_clerk_${m.key}_${s.key}" ${isAllowed ? 'checked' : ''} ${!isExecutive ? 'disabled' : ''} onchange="portalApp.toggleClerkSubmenuPerm('${m.key}', '${s.key}', this.checked)">
                <span class="perm-slider"></span>
              </label>
            </div>
          </div>
        `;
      }).join('');

      return `
        <div class="perm-module-card">
          <div class="perm-module-card-header">
            <div class="perm-module-meta">
              <div class="perm-module-icon"><i class="fa-solid ${m.icon}"></i></div>
              <div>
                <h4 class="perm-module-title">${m.name}</h4>
                <p class="perm-module-desc">${m.desc}</p>
              </div>
            </div>
            <div class="perm-module-actions">
              <span class="portal-badge ${allowedCount > 0 ? 'badge-primary' : 'badge-secondary'}" style="font-size:0.75rem; font-weight:700;">
                ${allowedCount} / ${m.subs.length} Allowed
              </span>
              ${isExecutive ? `
                <button type="button" class="perm-quick-btn" onclick="portalApp.toggleClerkModuleAll('${m.key}', true)" title="Allow all submenus in this module">
                  Allow All
                </button>
                <button type="button" class="perm-quick-btn" onclick="portalApp.toggleClerkModuleAll('${m.key}', false)" title="Hide all submenus in this module">
                  Hide All
                </button>
              ` : ''}
            </div>
          </div>
          <div class="perm-sub-list">
            ${subRows}
          </div>
        </div>
      `;
    }).join('');
  }

  function toggleClerkSubmenuPerm(moduleKey, subKey, isChecked) {
    const perms = getClerkSubmenuPermissions();
    perms[`${moduleKey}.${subKey}`] = isChecked;
    saveClerkSubmenuPermissions(perms);
    renderClerkPermissionsForm();
  }

  function toggleClerkModuleAll(moduleKey, isChecked) {
    const perms = getClerkSubmenuPermissions();
    const modDef = MANAGEMENT_SUBMENU_SCHEMA.find(m => m.key === moduleKey);
    if (modDef) {
      modDef.subs.forEach(s => {
        perms[`${moduleKey}.${s.key}`] = isChecked;
      });
    }
    saveClerkSubmenuPermissions(perms);
    renderClerkPermissionsForm();
  }

  function grantAllClerkSubPerms() {
    const perms = getClerkSubmenuPermissions();
    MANAGEMENT_SUBMENU_SCHEMA.forEach(m => {
      m.subs.forEach(s => {
        perms[`${m.key}.${s.key}`] = true;
      });
    });
    saveClerkSubmenuPermissions(perms);
    renderClerkPermissionsForm();
  }

  function hideAllClerkSubPerms() {
    const perms = getClerkSubmenuPermissions();
    MANAGEMENT_SUBMENU_SCHEMA.forEach(m => {
      m.subs.forEach(s => {
        perms[`${m.key}.${s.key}`] = false;
      });
    });
    saveClerkSubmenuPermissions(perms);
    renderClerkPermissionsForm();
  }

  function resetClerkSubPerms() {
    saveClerkSubmenuPermissions(Object.assign({}, DEFAULT_CLERK_SUBMENU_PERMISSIONS));
    renderClerkPermissionsForm();
  }

  function toggleClerkPerm(moduleKey, isChecked) {
    toggleClerkModuleAll(moduleKey, isChecked);
  }

  function grantAllClerkPerms() {
    grantAllClerkSubPerms();
  }

  function resetClerkPerms() {
    resetClerkSubPerms();
  }

  function renderTeacherSubmenuPermissionsForm(teacherId) {
    const container = document.getElementById('teacherSubmenuPermsGrid');
    if (!container) return;
    const tId = teacherId || currentEditingTeacherId || 'SV200005';
    const subPerms = getTeacherSubmenuPermissions(tId);
    const role = state.currentRole;
    const isExecutive = (role === 'principal' || role === 'vice-principal');

    container.className = 'perm-module-grid';
    container.innerHTML = TEACHER_SUBMENU_SCHEMA.map(m => {
      let allowedCount = 0;
      const subRows = m.subs.map(s => {
        const permKey = `${m.key}.${s.key}`;
        const isAllowed = subPerms[permKey] !== false;
        if (isAllowed) allowedCount++;

        return `
          <div class="perm-sub-row ${isAllowed ? 'active' : ''}">
            <div class="perm-sub-info">
              <span class="perm-sub-bullet"></span>
              <div>
                <div class="perm-sub-label">${s.label}</div>
                <small class="text-muted" style="font-size: 0.72rem;">${s.desc}</small>
              </div>
            </div>
            <div class="perm-sub-ctrl">
              <span class="perm-sub-badge-tag ${isAllowed ? 'badge-tag-visible' : 'badge-tag-hidden'}">
                <i class="fa-solid ${isAllowed ? 'fa-eye' : 'fa-eye-slash'}"></i> ${isAllowed ? 'Visible' : 'Hidden'}
              </span>
              <label class="perm-switch">
                <input type="checkbox" id="perm_t_${m.key}_${s.key}" ${isAllowed ? 'checked' : ''} ${!isExecutive ? 'disabled' : ''} onchange="portalApp.toggleTeacherSubmenuPerm('${tId}', '${m.key}', '${s.key}', this.checked)">
                <span class="perm-slider"></span>
              </label>
            </div>
          </div>
        `;
      }).join('');

      return `
        <div class="perm-module-card">
          <div class="perm-module-card-header">
            <div class="perm-module-meta">
              <div class="perm-module-icon"><i class="fa-solid ${m.icon}"></i></div>
              <div>
                <h4 class="perm-module-title">${m.name}</h4>
                <p class="perm-module-desc">${m.desc}</p>
              </div>
            </div>
            <div class="perm-module-actions">
              <span class="portal-badge ${allowedCount > 0 ? 'badge-primary' : 'badge-secondary'}" style="font-size:0.75rem; font-weight:700;">
                ${allowedCount} / ${m.subs.length} Allowed
              </span>
              ${isExecutive ? `
                <button type="button" class="perm-quick-btn" onclick="portalApp.toggleTeacherModuleAll('${tId}', '${m.key}', true)" title="Allow all submenus in this module">
                  Allow All
                </button>
                <button type="button" class="perm-quick-btn" onclick="portalApp.toggleTeacherModuleAll('${tId}', '${m.key}', false)" title="Hide all submenus in this module">
                  Hide All
                </button>
              ` : ''}
            </div>
          </div>
          <div class="perm-sub-list">
            ${subRows}
          </div>
        </div>
      `;
    }).join('');
  }

  function toggleTeacherSubmenuPerm(teacherId, moduleKey, subKey, isChecked) {
    const perms = getTeacherSubmenuPermissions(teacherId);
    perms[`${moduleKey}.${subKey}`] = isChecked;
    saveTeacherSubmenuPermissions(teacherId, perms);
    renderTeacherSubmenuPermissionsForm(teacherId);
  }

  function toggleTeacherModuleAll(teacherId, moduleKey, isChecked) {
    const perms = getTeacherSubmenuPermissions(teacherId);
    const modDef = TEACHER_SUBMENU_SCHEMA.find(m => m.key === moduleKey);
    if (modDef) {
      modDef.subs.forEach(s => {
        perms[`${moduleKey}.${s.key}`] = isChecked;
      });
    }
    saveTeacherSubmenuPermissions(teacherId, perms);
    renderTeacherSubmenuPermissionsForm(teacherId);
  }

  function grantAllTeacherSubPerms(teacherId) {
    const tId = teacherId || currentEditingTeacherId || 'SV200005';
    const perms = getTeacherSubmenuPermissions(tId);
    TEACHER_SUBMENU_SCHEMA.forEach(m => {
      m.subs.forEach(s => {
        perms[`${m.key}.${s.key}`] = true;
      });
    });
    saveTeacherSubmenuPermissions(tId, perms);
    renderTeacherSubmenuPermissionsForm(tId);
  }

  function hideAllTeacherSubPerms(teacherId) {
    const tId = teacherId || currentEditingTeacherId || 'SV200005';
    const perms = getTeacherSubmenuPermissions(tId);
    TEACHER_SUBMENU_SCHEMA.forEach(m => {
      m.subs.forEach(s => {
        perms[`${m.key}.${s.key}`] = false;
      });
    });
    saveTeacherSubmenuPermissions(tId, perms);
    renderTeacherSubmenuPermissionsForm(tId);
  }

  function resetTeacherSubPerms(teacherId) {
    const tId = teacherId || currentEditingTeacherId || 'SV200005';
    saveTeacherSubmenuPermissions(tId, Object.assign({}, DEFAULT_TEACHER_SUBMENU_PERMISSIONS));
    renderTeacherSubmenuPermissionsForm(tId);
  }

  // Teacher permissions functions
  let currentEditingTeacherId = 'SV200005'; // default Sri K. Rajesh

  function initTeacherPermissionsView() {
    populateTeacherSelectDropdown();
    loadTeacherPermissionsForEdit(currentEditingTeacherId);
    renderTeacherRosterPermissionsTable();
  }

  function populateTeacherSelectDropdown() {
    const select = document.getElementById('permTeacherSelect');
    if (!select) return;

    select.innerHTML = state.faculty.map(f => `
      <option value="${f.id}" ${f.id === currentEditingTeacherId ? 'selected' : ''}>
        ${f.id} — ${f.name} (${f.subject || f.role})
      </option>
    `).join('');
  }

  function openTeacherPermissionsConfig(teacherId) {
    // Switch to Settings -> Access Permissions -> Teacher tab
    navigateTo('settings');
    switchSubTab('settings', 'permissions');
    switchPermissionsSubTab('teacher');
    currentEditingTeacherId = teacherId;
    loadTeacherPermissionsForEdit(teacherId);

    const select = document.getElementById('permTeacherSelect');
    if (select) select.value = teacherId;
  }

  function loadTeacherPermissionsForEdit(teacherId) {
    currentEditingTeacherId = teacherId;
    const teacher = state.faculty.find(f => f.id === teacherId) || state.faculty[0];
    const perms = getTeacherPermissions(teacherId);

    // Update teacher card summary
    const cardEl = document.getElementById('permSelectedTeacherCard');
    if (cardEl && teacher) {
      const initials = teacher.name.replace(/^(Smt\.|Sri\.)\s*/, '').split(' ').map(n => n[0]).join('').slice(0, 2);
      cardEl.innerHTML = `
        <div class="teacher-perm-profile">
          <div class="t-perm-avatar">${initials}</div>
          <div class="t-perm-meta">
            <div style="display:flex; align-items:center; gap:8px;">
              <h3>${teacher.name}</h3>
              <span class="teacher-id-badge" style="font-size:0.85rem; padding:3px 10px;">${teacher.id}</span>
            </div>
            <div class="t-perm-sub">${teacher.role} &bull; ${teacher.subject} &bull; ${teacher.qualification}</div>
            <div class="t-perm-contact"><i class="fa-solid fa-phone"></i> ${teacher.phone} &bull; <i class="fa-solid fa-envelope"></i> ${teacher.email}</div>
          </div>
          <div class="t-perm-actions">
            <button type="button" class="btn btn-primary btn-sm" onclick="portalApp.saveCurrentTeacherPermissions()">
              <i class="fa-solid fa-floppy-disk"></i> Save Permissions for ${teacher.id}
            </button>
          </div>
        </div>
      `;
    }

    // Render submenu permissions grid
    renderTeacherSubmenuPermissionsForm(teacherId);

    // Render toggles
    const container = document.getElementById('teacherPermsGrid');
    if (!container) return;

    const teacherPermDefinitions = [
      { key: 'mark_attendance', name: 'Daily Attendance Marking', icon: 'fa-clipboard-check', desc: 'Can submit daily morning student attendance' },
      { key: 'view_attendance', name: 'Attendance Registers & History', icon: 'fa-calendar-day', desc: 'Can view class monthly attendance and absentees' },
      { key: 'class_sections', name: 'Class & Section Management', icon: 'fa-shapes', desc: 'Can manage assigned class students and seating' },
      { key: 'enter_marks', name: 'Marks Entry & Tabulation', icon: 'fa-pen-to-square', desc: 'Can enter Unit Test and Terminal marks for subjects' },
      { key: 'create_exams', name: 'Create Exams & Question Papers', icon: 'fa-file-circle-plus', desc: 'Authorized to draft exam blueprints and questions' },
      { key: 'student_profiles', name: 'Student Dossiers & Profiles', icon: 'fa-id-card', desc: 'Can view complete student demographic records' },
      { key: 'homework_assignments', name: 'Homework & Assignments', icon: 'fa-book-bookmark', desc: 'Can assign daily homework and grade submissions' },
      { key: 'study_materials', name: 'Study Materials & Syllabus', icon: 'fa-file-lines', desc: 'Can upload study notes, worksheets & PDFs' },
      { key: 'view_timetable', name: 'My Timetable & Substitutions', icon: 'fa-calendar-week', desc: 'Can view daily teaching periods and substitutions' },
      { key: 'send_announcements', name: 'Class Broadcasts & Notices', icon: 'fa-bullhorn', desc: 'Can send class-specific updates to parents' },
      { key: 'apply_leave', name: 'Leave Application & History', icon: 'fa-calendar-minus', desc: 'Can apply for casual/medical leave and check status' },
      { key: 'view_students', name: 'Class Student Roster', icon: 'fa-users', desc: 'Can access assigned class roster and contact info' }
    ];

    container.innerHTML = teacherPermDefinitions.map(p => {
      const isChecked = perms[p.key] !== false;
      return `
        <div class="perm-card ${isChecked ? 'enabled' : 'disabled'}">
          <div class="perm-card-header">
            <div class="perm-icon-wrap"><i class="fa-solid ${p.icon}"></i></div>
            <div class="perm-info">
              <h4>${p.name}</h4>
              <p>${p.desc}</p>
            </div>
            <div class="perm-switch-wrap">
              <label class="perm-switch">
                <input type="checkbox" id="tperm_${p.key}" ${isChecked ? 'checked' : ''}>
                <span class="perm-slider"></span>
              </label>
            </div>
          </div>
          <div class="perm-card-footer">
            <span class="perm-status-badge ${isChecked ? 'badge-allowed' : 'badge-denied'}">
              <i class="fa-solid ${isChecked ? 'fa-check' : 'fa-ban'}"></i> ${isChecked ? 'Permission Enabled' : 'Disabled'}
            </span>
          </div>
        </div>
      `;
    }).join('');
  }

  function saveCurrentTeacherPermissions() {
    const teacherId = currentEditingTeacherId;
    const perms = {};
    const keys = [
      'mark_attendance', 'view_attendance', 'class_sections', 'enter_marks',
      'create_exams', 'student_profiles', 'homework_assignments', 'study_materials',
      'view_timetable', 'send_announcements', 'apply_leave', 'view_students'
    ];
    keys.forEach(k => {
      const cb = document.getElementById('tperm_' + k);
      perms[k] = cb ? cb.checked : false;
    });

    saveTeacherPermissions(teacherId, perms);
    loadTeacherPermissionsForEdit(teacherId);
  }

  function applyTeacherPreset(presetType) {
    const keys = [
      'mark_attendance', 'view_attendance', 'class_sections', 'enter_marks',
      'create_exams', 'student_profiles', 'homework_assignments', 'study_materials',
      'view_timetable', 'send_announcements', 'apply_leave', 'view_students'
    ];
    const perms = {};
    const subPerms = getTeacherSubmenuPermissions(currentEditingTeacherId);

    if (presetType === 'class_teacher') {
      keys.forEach(k => perms[k] = (k !== 'create_exams'));
      TEACHER_SUBMENU_SCHEMA.forEach(m => {
        m.subs.forEach(s => {
          subPerms[`${m.key}.${s.key}`] = (m.key !== 'examinations' || s.key !== 'create');
        });
      });
    } else if (presetType === 'subject_teacher') {
      keys.forEach(k => {
        perms[k] = ['mark_attendance', 'homework_assignments', 'study_materials', 'view_timetable', 'apply_leave', 'enter_marks'].includes(k);
      });
      TEACHER_SUBMENU_SCHEMA.forEach(m => {
        m.subs.forEach(s => {
          const allowed = (m.key === 'attendance' && s.key === 'mark') ||
                          (m.key === 'academics' && ['homework', 'materials', 'syllabus'].includes(s.key)) ||
                          (m.key === 'examinations' && s.key === 'enter-marks') ||
                          (m.key === 'timetable') ||
                          (m.key === 'leave');
          subPerms[`${m.key}.${s.key}`] = allowed;
        });
      });
    } else if (presetType === 'hod') {
      keys.forEach(k => perms[k] = true);
      TEACHER_SUBMENU_SCHEMA.forEach(m => {
        m.subs.forEach(s => {
          subPerms[`${m.key}.${s.key}`] = true;
        });
      });
    }

    saveTeacherPermissions(currentEditingTeacherId, perms);
    saveTeacherSubmenuPermissions(currentEditingTeacherId, subPerms);
    loadTeacherPermissionsForEdit(currentEditingTeacherId);
    showToast(`Applied ${presetType.replace('_', ' ').toUpperCase()} preset to ${currentEditingTeacherId}`, 'info');
  }

  function renderTeacherRosterPermissionsTable() {
    const tbody = document.getElementById('teacherRosterPermsTableBody');
    if (!tbody) return;

    tbody.innerHTML = state.faculty.map(f => {
      const perms = getTeacherPermissions(f.id);
      const activeCount = Object.values(perms).filter(Boolean).length;
      const totalCount = Object.keys(DEFAULT_TEACHER_PERMISSIONS).length;
      return `
        <tr>
          <td><span class="teacher-id-badge">${f.id}</span></td>
          <td><strong>${f.name}</strong></td>
          <td>${f.role}</td>
          <td><span class="text-muted">${f.subject}</span></td>
          <td style="text-align:center;">
            <span class="portal-badge ${activeCount >= 10 ? 'badge-success' : (activeCount >= 6 ? 'badge-primary' : 'badge-amber')}">
              ${activeCount} / ${totalCount} Permissions Active
            </span>
          </td>
          <td style="text-align:center;">
            <button class="btn btn-secondary btn-sm" onclick="portalApp.openTeacherPermissionsConfig('${f.id}')" title="Configure permissions for ${f.name}">
              <i class="fa-solid fa-gear"></i> Edit Access
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  function handleClerkModuleAccess(moduleKey, isRestricted) {
    const targetView = document.getElementById(`view-${moduleKey}`);
    if (!targetView) return;

    let restrictedCard = targetView.querySelector('.clerk-module-restricted-card');

    if (isRestricted) {
      // Hide other direct children inside moduleSection and show restricted card
      Array.from(targetView.children).forEach(child => {
        if (!child.classList.contains('clerk-module-restricted-card') && !child.classList.contains('portal-view-header')) {
          child.dataset.clerkHidden = 'true';
          child.style.display = 'none';
        }
      });

      if (!restrictedCard) {
        restrictedCard = document.createElement('div');
        restrictedCard.className = 'clerk-module-restricted-card';
        const modName = moduleKey.charAt(0).toUpperCase() + moduleKey.slice(1);
        restrictedCard.innerHTML = `
          <div class="clerk-restricted-box">
            <div class="c-lock-icon"><i class="fa-solid fa-shield-halved"></i></div>
            <h2>Executive Authorization Required</h2>
            <p>Access to <strong>${modName}</strong> is currently restricted for the School Office / Clerk workspace.</p>
            <div class="c-restricted-info">
              <i class="fa-solid fa-circle-info"></i>
              <span><strong>Principal Smt. Gorle Varalakshmi</strong> or <strong>Vice Principal Sri Navva Anand</strong> can authorize access to this option from <strong>Settings &rarr; Access Permissions</strong>.</span>
            </div>
            <div class="c-restricted-actions">
              <button type="button" class="btn btn-secondary" onclick="portalApp.navigateTo('dashboard')">
                <i class="fa-solid fa-gauge-high"></i> Back to Dashboard
              </button>
              <button type="button" class="btn btn-primary" onclick="portalApp.showToast('Access request logged. Please notify Principal or Vice Principal.', 'info')">
                <i class="fa-solid fa-key"></i> Request Authorization
              </button>
            </div>
          </div>
        `;
        targetView.appendChild(restrictedCard);
      } else {
        restrictedCard.style.display = 'block';
      }
    } else {
      // Unhide children and hide restricted card
      if (restrictedCard) restrictedCard.style.display = 'none';
      Array.from(targetView.children).forEach(child => {
        if (child.dataset.clerkHidden === 'true') {
          child.style.display = '';
          delete child.dataset.clerkHidden;
        }
      });
    }
  }

  
  function togglePassVisibility(inputId, btnEl) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const isPass = input.type === 'password';
    input.type = isPass ? 'text' : 'password';
    const icon = btnEl ? btnEl.querySelector('i') : null;
    if (icon) {
      icon.classList.toggle('fa-eye', !isPass);
      icon.classList.toggle('fa-eye-slash', isPass);
    }
  }

  function saveExecutiveCreds(role) {
    const isPrincipal = role === 'principal';
    const idInput = document.getElementById(isPrincipal ? 'customPrincipalId' : 'customVicePrincipalId');
    const passInput = document.getElementById(isPrincipal ? 'customPrincipalPass' : 'customVicePrincipalPass');
    const newId = idInput ? idInput.value.trim() : '';
    const newPass = passInput ? passInput.value : '';

    if (!newId || !newPass) {
      showToast('Login ID and Password cannot be empty.', 'error');
      return;
    }

    try {
      const executiveCreds = JSON.parse(localStorage.getItem('sv_executive_creds') || '{}');
      executiveCreds[role] = { id: newId, password: newPass };
      localStorage.setItem('sv_executive_creds', JSON.stringify(executiveCreds));
      showToast(`${isPrincipal ? 'Principal' : 'Vice Principal'} credentials updated! ID: ${newId}`, 'success');
    } catch (e) {
      showToast('Saved to local storage.', 'success');
    }
  }

  return {
    togglePassVisibility,
    saveExecutiveCreds,
    printCredentialReceipt: function() { window.print(); },
    getClerkPermissions,
    saveClerkPermissions,
    toggleClerkPerm,
    grantAllClerkPerms,
    resetClerkPerms,
    getClerkSubmenuPermissions,
    saveClerkSubmenuPermissions,
    toggleClerkSubmenuPerm,
    toggleClerkModuleAll,
    grantAllClerkSubPerms,
    hideAllClerkSubPerms,
    resetClerkSubPerms,
    renderClerkPermissionsForm,
    getTeacherSubmenuPermissions,
    saveTeacherSubmenuPermissions,
    toggleTeacherSubmenuPerm,
    toggleTeacherModuleAll,
    grantAllTeacherSubPerms,
    hideAllTeacherSubPerms,
    resetTeacherSubPerms,
    renderTeacherSubmenuPermissionsForm,
    syncTabStripPermissions,
    getTeacherPermissions,
    saveTeacherPermissions,
    switchPermissionsSubTab,
    openTeacherPermissionsConfig,
    loadTeacherPermissionsForEdit,
    saveCurrentTeacherPermissions,
    applyTeacherPreset,
    renderTeacherRosterPermissionsTable,
    getExecutiveRestrictions,
    saveExecutiveRestrictions,
    toggleExecutiveRestriction,
    enforceAllExecutiveRestrictions,
    enforcePrincipalRestrictions,
    resetPrincipalRestrictions,
    enforceVicePrincipalRestrictions,
    resetVicePrincipalRestrictions,
    renderPrincipalRestrictionsForm,
    renderVicePrincipalRestrictionsForm,
    resetExecutiveRestrictions,
    renderExecutiveRestrictionsForm,
    renderExecutiveRestrictionsBanner,
    openExecutiveRestrictions,
    initHodDelegationView,
    onHodDeptChange,
    onHodTeacherChange,
    renderHodTeacherPermsGrid,
    applyHodPreset,
    saveHodDelegatedPermissions,
    renderHodDeptFacultyTable,
    populateStaffAttendanceChecklist,
    setIndividualStaffStatus,
    updateClerkFacultyAttSummary,
    getSavedFacultyAttendance,

 
    resendBroadcast,
    viewBroadcast,
    viewNotice,
    renderBroadcastFeed,   renderStaffAttendanceTable,
    renderFacultyAppraisals,
    renderVpTimetableGrid,
    renderExamScheduleTable,
    renderInvigilationDutyTable,
    renderFeeCategoryAuditTable,
    // Subview Renderers and Actions
    renderStudentLeaves,
    renderStaffLeaveBalances,
    filterStudentLeaveSlips,
    filterStaffLeaveBalances,
    printStudentSlip,
    viewStudentSlipDetails,
    viewStaffLeaveDossier,
    renderAcademicClasses,
    renderAcademicSubjects,
    renderExamsSchedule,
    renderResultsAndGrading,
    renderAcademicReports,
    renderAttendanceTeachers,
    renderAttendanceAbsentees,
    renderAttendanceMonthly,
    renderMasterTimetable,
    renderDailySubstitution,
    renderScienceLabs,
    renderDefaultersTable,
    renderFeeLedgerTable,
    renderCircularsTable,
    renderSmsLogsTable,
    renderEmailLogsTable,
    renderPushLogsTable,
    printFeeReceiptSlip,
    init,
    navigateTo,
    switchRole,
    switchSubTab,
    getDefaultSubTab,
    handleApproval,
    filterStudents,
    resetStudentFilters,
    filterStudentProfiles,
    viewStudentProfile,
    printStudentDossier,
    approveAdmission,
    reviewAdmissionDocs,
    rejectAdmission,
    isOfficeAdmissionAllowed,
    renderOfficePermissionControls,
    renderSettingsAdmissionPermissionCard,
    toggleOfficeAdmissionPermission,
    requestOfficeAdmissionPermission,
    syncAdmissionsFromStorage,
    printAdmissionVerification,
    renderNotifications,
    markAllNotificationsAsRead,
    addNewNotification,
    printTC,
    downloadTCPdf,
    onModalTCChange,
    onModalCopyTypeChange,
    toggleModalAadhaarMask,
    openTCFullPage,
    renderModalTCDocument,
    printCurrentModalTC,
    downloadCurrentModalTCPdf,
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
    handleVPLeaveAction,
    goToStudentPage,
    // Examination Management Exports
    handleExamHallChange,
    renderRoomSeatingArrangement,
    printExamSeatingPlan,
    openIssueHallTicketsModal,
    handleHallTicketClassChange,
    handleHallTicketCandidateChange,
    renderHallTicketDocument,
    printCurrentCandidateHallTicket,
    batchPrintHallTickets,
    downloadHallTicketPDF,
    handleTabulationClassChange,
    renderTabulationRegisters,
    printTabulationRegister,
    exportTabulationCSV,
    printStudentMarksMemo,
    // Discipline Management Exports
    filterDisciplineIncidents,
    renderGateLateComing,
    sendGateLateSms,
    printGateLateSlip,
    sendBulkGateLateSms,
    printGateLateSheet,
    renderMeritAwards,
    openAwardMeritModal,
    handleAwardMeritSubmit,
    printMeritCertificate,
    renderParentConvocations,
    openScheduleSummonsModal,
    handleScheduleSummonsSubmit,
    printSummonsNotice,
    recordConferenceCompleted,
    // Question Paper Exports
    renderOfficialQuestionPaper,
    printOfficialQuestionPaper,
    exportQuestionPaperPDF,
    handlePaperFilterChange,
    openAddQuestionModal,
    // Newly Added Complete Function Exports
    downloadCsvFile,
    openImportModal,
    openStaffImportModal,
    downloadStaffSampleCsv,
    downloadCurrentStaffCsv,
    resetStaffCsvUpload,
    loadDemoStaffCsvToPaste,
    parsePastedStaffCsv,
    confirmBulkStaffImport,
    openFacultyDossier,
    syncFacultyFromStorage,
    printFacultyDossier,
    setAllStaffAttendance,
    bulkMarkAllStaffPresent,
    syncBiometricData,
    exportBiometricRegisterCSV,
    exportAbsenteeLedgerCSV,
    downloadDailyAttendancePDF,
    openTeacherAttendanceModal,
    openSendAbsenteeSmsModal,
    confirmSendAbsenteeSms,
    printTimetable,
    printTimetableDaySheet,
    exportVpTimetableCSV,
    exportDailySubstitutionCSV,
    openAcademicImportModal,
    downloadAcademicSampleCsv,
    confirmAcademicImport,
    openScheduleExamModal,
    downloadTermGazettePDF,
    printExamSchedule,
    printInvigilationRoster,
    openInvigilatorAttendanceModal,
    exportLeaveRegister,
    exportStaffLeaveLedgerCSV,
    downloadLeaveRegisterCSV,
    printStudentLeaveRegister,
    printStaffLeaveLedger,
    printOfficialLeaveRegister,
    openReserveLabModal,
    openReserveLabModalFromLog,
    printCurrentLabLog,
    openFeeRemindersModal,
    dispatchFeeReminders,
    openCollectFeeModal,
    exportDefaultersList,
    exportFeeAuditReport,
    printCurrentReceipt,
    downloadReceiptPDF,
    openComposeBroadcastModal,
    downloadNoticePdf,
    handleStudentDeleteClick,
    confirmPermanentStudentDelete,
    renderWithdrawnStudentsPage,
    printStudentIdCard,
    printAdmissionVerification,
    downloadSampleCsv,
    downloadCurrentStudentsCsv,
    resetCsvUpload,
    loadDemoCsvToPaste,
    parsePastedCsv,
    confirmBulkImport,
    // Interactive Table & Form Handlers
    filterFaculty,
    filterNonTeachingStaff,
    renderNonTeachingStaff,
    renderTeacherLeaveRequests,
    renderSchoolEvents,
    renderCompetitionEvents,
    renderClubActivities,
    handleStaffCsvFileUpload,
    filterAcademicClasses,
    renderAcademicClasses,
    renderAcademicSubjects,
    switchTimetableClass,
    filterExamsSchedule,
    renderExamsSchedule,
    renderResultsAndGrading,
    renderAcademicReports,
    filterAttendanceClasses,
    filterTeacherAttendance,
    filterDailyAbsentees,
    switchVpTimetableClass,
    handleExamScheduleClassChange,
    filterFacultyLeaves,
    filterStudentLeaveSlips,
    filterStaffLeaveBalances,
    filterRecentFeeTransactions,
    filterDefaulters,
    filterFeeLedger,
    filterRecentFeeTransactions,
    filterDefaulters,
    initFeeCharts,
    initFeeReportsCharts,
    renderClassFeeRealizationMatrix,
    filterCirculars,
    filterSmsLogs,
    filterEmailLogs,
    filterPushLogs,
    handleLogGateLateEntry,
    handleApplyStaffLeaveSubmit,
    handleStaffLeaveTeacherChange,
    handleIssueStudentLeaveSubmit,
    handleReserveLabSubmit,
    handleReserveLabFacilityChange,
    handleAssignStaffTask,
    handleTaskStaffSelection,
    handleTaskCategoryPreset,
    handleCsvFileUpload,
    handleAddTeacher,
    handleStaffCategoryChange,
    handleSaveStaffAttendance,
    handleSaveSingleStaffAttendance,
    handleStatusSelectChange,
    handleScheduleExamSubmit,
    handleAcademicCsvFile,
    updateSmsTemplatePreview,
    handleCollectFeeSubmit,
    handleStudentSelectForFee,
    handleFeeHeadChange,
    handlePaymentModeChange,
    updateReminderStats,
    handleComposeBroadcastModalSubmit,
    updateSmsCharCounter
  };


})();

// Expose on global window object for HTML onclick handlers and console debugging
if (typeof window !== 'undefined') {
  window.portalApp = portalApp;
}

