/**
 * Sri Vidya E.M High School -- Full Student Roster
 * Total Students: 500 | Section A Only | Classes PP through X
 * Admission Numbers: SV-0001 to SV-0500
 */
(function () {
  'use strict';

  const MALE_FIRST = [
    'Sai Teja','Rakesh','Tarun','Karthik','Hemanth','Rohit','Akhil','Manoj',
    'Srikanth','Naveen','Vamsi','Suresh','Ravi','Aakash','Dinesh','Ganesh',
    'Harsha','Praveen','Charan','Arun','Vijay','Sunil','Raju','Pavan',
    'Lokesh','Nithin','Nithish','Sriram','Venkat','Chandu','Prasad','Arjun',
    'Balaji','Santosh','Mahesh','Naresh','Kishore','Deepak','Gopal','Sagar',
    'Abhinav','Likhit','Aarav','Nikhil','Tanuj','Yashwanth','Anand','Girish',
    'Kalyan','Ramesh','Ajay','Varun','Siddharth','Mounik','Vineeth','Bhargav',
    'Nikhilesh','Rishikesh','Satya','Gopi','Ranjith','Vinod','Surya','Durgesh',
    'Prudhvi','Karteek','Srinath','Harshit','Lahari','Kaushik','Rithik','Srujan',
    'Tarakesh','Amarnath','Bharadwaj','Santhosh'
  ];

  const FEMALE_FIRST = [
    'Hema Latha','Sravanthi','Divya Bharathi','Bhavana','Keerthi','Siri Varshini',
    'Tanvi Sree','Deepthi','Vennela','Charitha','Harini','Swapna','Kavitha',
    'Priya','Anusha','Nandini','Mounika','Sowmya','Lakshmi','Padmavathi',
    'Ramya','Sneha','Usha','Varshini','Himabindu','Pavithra','Meghana',
    'Pravalika','Sirisha','Sahithi','Sreelakshmi','Manasa','Bhavitha','Aparna',
    'Gayathri','Aruna','Malathi','Vani','Tejaswi','Jyothsna','Sindhu','Saranya',
    'Archana','Pooja','Rishitha','Spandana','Swathi','Yamini','Ambika','Jhansi',
    'Navya','Ranjitha','Vidya','Sushma','Lavanya','Rohini','Anitha','Bindhu',
    'Charishma','Dharani','Eswari','Girija','Indira','Jaya','Kusuma','Lalitha',
    'Mamatha','Nethra','Rekha','Teja','Uma','Vijayalakshmi'
  ];

  const SURNAMES = [
    'G.','P.','K.','M.','B.','V.','CH.','S.','Y.','D.','A.','T.','N.','R.',
    'J.','L.','H.','SH.','VL.','MK.','BN.','GK.','SR.','VR.','PL.','NK.','RK.'
  ];

  const PARENT_MALE = [
    'Venkata Rao','Appala Naidu','Someswara Rao','Narayana Murthy','Krishna Reddy',
    'Satish Kumar','Rambabu','Prasad','Mohan Rao','Suresh','Jagannadham',
    'Srinivasa Rao','Prasad Babu','Ramana','Anand','Venkatesh','Mohan',
    'Satyanarayana','Lakshmaiah','Rajaiah','Bhaskar','Gopal Rao','Ranga Rao',
    'Venkateswara Rao','Adinarayana','Suryanarayana','Satyam','Narasimha Rao',
    'Ramakrishna','Durga Rao','Hanumantha Rao','Subba Rao','Kondaiah',
    'Nageswara Rao','Tirupathi Rao','Veeraiah','Yellaiah','Ramanaiah','Gangaiah',
    'Chinnaiah','Obaiah','Samba Siva Rao','Nagababu','Anjaneyulu','Muralikrishna'
  ];

  const ADDRESSES = [
    'Plot 42, Sriharipuram, Visakhapatnam','Door 12-4, Gajuwaka, Visakhapatnam',
    'Flat 201, Kurmannapalem, Visakhapatnam','Sector 5, Steel Plant Township, VSP',
    'Near Rythu Bazar, Gajuwaka, Visakhapatnam','Main Road, Pedagantyada, VSP',
    'Old Post Office St, Gajuwaka, Visakhapatnam','Teachers Colony, Visakhapatnam',
    'BHPV Quarters, Visakhapatnam','BC Road, New Gajuwaka, Visakhapatnam',
    'Kanithi Road, Visakhapatnam','Sriharipuram Phase 2, Visakhapatnam',
    'Duvvada Station Road, Visakhapatnam','Scindia Colony, Visakhapatnam',
    'Mindi Village, Gajuwaka, Visakhapatnam','Kommadi, Rushikonda, VSP',
    'MVP Colony Sector-7, Visakhapatnam','NAD Junction, Visakhapatnam',
    'Maddilapalem, Visakhapatnam','PM Palem, Visakhapatnam',
    'Kancharapalem, Visakhapatnam','Simhachalam, Visakhapatnam',
    'Aganampudi, Visakhapatnam','Bheemunipatnam, Visakhapatnam',
    'Paravada, Visakhapatnam','Atchutapuram, Visakhapatnam',
    'Bheemili Beach Road, Visakhapatnam','Anandapuram, Visakhapatnam',
    'Tagarapuvalasa, Visakhapatnam','Pendurthi, Visakhapatnam',
    'Nakkavanipalem, Visakhapatnam','Lawsons Bay Colony, VSP',
    'HB Colony, Visakhapatnam','Old Town, Visakhapatnam',
    'Jagadamba Junction, Visakhapatnam','Gopalapatnam, Visakhapatnam',
    'Dondaparthy, Visakhapatnam','Yarada, Visakhapatnam'
  ];

  const BLOOD_GROUPS = ['O+','A+','B+','AB+','O-','A-','B-','AB-'];
  const FEE_DIST = ['Paid','Paid','Paid','Paid','Paid','Paid','Paid','Partial','Partial','Pending'];
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  // Seeded LCG pseudo-random (deterministic)
  function makeRand(seed) {
    let s = seed >>> 0;
    return function () {
      s = Math.imul(s, 1664525) + 1013904223 >>> 0;
      return s / 4294967295;
    };
  }

  // Class distribution totalling exactly 500 students
  // X:44, IX:44, VIII:44, VII:46, VI:46, V:44, IV:44, III:44, II:46, I:48, PP:50 = 500
  var CLASS_CONFIG = [
    { cls: 'X',    count: 44, startRoll: 1001, yrOff: 14 },
    { cls: 'IX',   count: 44, startRoll: 901,  yrOff: 13 },
    { cls: 'VIII', count: 44, startRoll: 801,  yrOff: 12 },
    { cls: 'VII',  count: 46, startRoll: 701,  yrOff: 11 },
    { cls: 'VI',   count: 46, startRoll: 601,  yrOff: 10 },
    { cls: 'V',    count: 44, startRoll: 501,  yrOff: 9  },
    { cls: 'IV',   count: 44, startRoll: 401,  yrOff: 8  },
    { cls: 'III',  count: 44, startRoll: 301,  yrOff: 7  },
    { cls: 'II',   count: 46, startRoll: 201,  yrOff: 6  },
    { cls: 'I',    count: 48, startRoll: 101,  yrOff: 5  },
    { cls: 'PP',   count: 50, startRoll: 1,    yrOff: 4  }
  ];

  var roster = [];
  var admNum = 1;

  CLASS_CONFIG.forEach(function (cfg) {
    var rand = makeRand(admNum * 7919 + cfg.count * 31);
    for (var i = 0; i < cfg.count; i++) {
      var isMale   = rand() > 0.48;
      var fName    = isMale ? MALE_FIRST[Math.floor(rand() * MALE_FIRST.length)]
                            : FEMALE_FIRST[Math.floor(rand() * FEMALE_FIRST.length)];
      var sName    = SURNAMES[Math.floor(rand() * SURNAMES.length)];
      var name     = sName + ' ' + fName;
      var pSurname = SURNAMES[Math.floor(rand() * SURNAMES.length)];
      var pFirst   = PARENT_MALE[Math.floor(rand() * PARENT_MALE.length)];
      var parent   = pSurname + ' ' + pFirst;
      var phoneNum = 9848000000 + (admNum * 11 % 900000) + Math.floor(rand() * 9999);
      var phone    = String(phoneNum);
      var attPct   = (85 + Math.floor(rand() * 151) / 10).toFixed(1);
      var gpa      = (7.0 + Math.floor(rand() * 31) / 10).toFixed(1);
      var feeStatus = FEE_DIST[Math.floor(rand() * FEE_DIST.length)];
      var bloodGroup = BLOOD_GROUPS[Math.floor(rand() * BLOOD_GROUPS.length)];
      var dobYear  = 2026 - cfg.yrOff;
      var dobMonth = MONTHS[Math.floor(rand() * 12)];
      var dobDay   = 1 + Math.floor(rand() * 28);
      var dob      = dobDay + ' ' + dobMonth + ' ' + dobYear;
      var address  = ADDRESSES[Math.floor(rand() * ADDRESSES.length)];

      roster.push({
        admNo: 'SV-' + String(admNum).padStart(4, '0'),
        name: name,
        gender: isMale ? 'male' : 'female',
        class: cfg.cls,
        section: 'A',
        rollNo: String(cfg.startRoll + i),
        parent: parent,
        phone: phone,
        attendance: attPct + '%',
        feeStatus: feeStatus,
        gpa: gpa,
        bloodGroup: bloodGroup,
        dob: dob,
        address: address
      });
      admNum++;
    }
  });

  window.STUDENT_ROSTER = roster;
  console.info('[SriVidya] Student Roster loaded: ' + roster.length + ' students (target: 500). From ' +
    roster[0].admNo + ' to ' + roster[roster.length - 1].admNo);
}());
