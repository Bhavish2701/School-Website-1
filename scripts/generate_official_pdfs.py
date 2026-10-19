import os
import pymupdf

OUTPUT_DIRS = [
    os.path.join(os.path.dirname(__file__), "..", "downloads"),
    os.path.join(os.path.dirname(__file__), "..", "assets", "docs"),
    os.path.join(os.path.dirname(__file__), "..")
]

for d in OUTPUT_DIRS:
    os.makedirs(d, exist_ok=True)

def draw_header(page, title, ref_no, date_str, category_str):
    # Top banner bar
    page.draw_rect(pymupdf.Rect(36, 36, 576, 110), color=None, fill=(0.11, 0.31, 0.85))
    
    # Gold decorative accent line
    page.draw_rect(pymupdf.Rect(36, 110, 576, 114), color=None, fill=(0.95, 0.77, 0.06))
    
    # Text in banner
    page.insert_text(pymupdf.Point(50, 62), "SRI VIDYA E.M HIGH SCHOOL", fontsize=18, fontname="helv", color=(1, 1, 1))
    page.insert_text(pymupdf.Point(50, 78), '"Vidyathe Vijayam" — Knowledge Brings Victory', fontsize=11, fontname="helv", color=(0.86, 0.92, 1))
    page.insert_text(pymupdf.Point(50, 95), "Recognized by Govt. of Andhra Pradesh • English Medium Co-Educational Institution (Est. 2017)", fontsize=9, fontname="helv", color=(0.9, 0.95, 1))
    page.insert_text(pymupdf.Point(440, 95), "Campus: Main Road, Vidyanagar, AP", fontsize=8, fontname="helv", color=(0.9, 0.95, 1))

    # Meta bar below banner
    page.draw_rect(pymupdf.Rect(36, 122, 576, 150), color=(0.85, 0.9, 0.96), fill=(0.94, 0.96, 1))
    page.insert_text(pymupdf.Point(46, 139), f"Ref: {ref_no}", fontsize=9, fontname="helv", color=(0.06, 0.1, 0.2))
    page.insert_text(pymupdf.Point(240, 139), f"Date of Issue: {date_str}", fontsize=9, fontname="helv", color=(0.06, 0.1, 0.2))
    page.insert_text(pymupdf.Point(430, 139), f"Category: {category_str}", fontsize=9, fontname="helv", color=(0.11, 0.31, 0.85))

    # Document Title
    page.insert_text(pymupdf.Point(36, 175), title, fontsize=14, fontname="helv", color=(0.06, 0.1, 0.2))
    page.draw_line(pymupdf.Point(36, 182), pymupdf.Point(576, 182), color=(0.11, 0.31, 0.85), width=1.5)

def draw_footer(page, page_num=1, total_pages=1):
    # Signature block
    y = 710
    page.draw_line(pymupdf.Point(36, y), pymupdf.Point(576, y), color=(0.85, 0.88, 0.92), width=1)
    
    # Official Seal circle
    page.draw_circle(pymupdf.Point(85, y + 42), 26, color=(0.11, 0.31, 0.85), width=1.5)
    page.insert_text(pymupdf.Point(66, y + 38), "SRI VIDYA", fontsize=7, fontname="helv", color=(0.11, 0.31, 0.85))
    page.insert_text(pymupdf.Point(68, y + 48), "HIGH SCHOOL", fontsize=6, fontname="helv", color=(0.11, 0.31, 0.85))

    # Signatures
    page.insert_text(pymupdf.Point(130, y + 36), "Verified by Administrative Secretariat", fontsize=9, fontname="helv", color=(0.3, 0.35, 0.45))
    page.insert_text(pymupdf.Point(130, y + 48), "Helpline: +91 93985 78584 / 8106636230", fontsize=8, fontname="helv", color=(0.4, 0.45, 0.55))

    page.insert_text(pymupdf.Point(430, y + 34), "Smt. Gorle Varalakshmi", fontsize=10, fontname="helv", color=(0.06, 0.1, 0.2))
    page.insert_text(pymupdf.Point(440, y + 48), "Principal / Correspondent", fontsize=8, fontname="helv", color=(0.4, 0.45, 0.55))

    # Bottom watermark line
    page.draw_rect(pymupdf.Rect(36, 770, 576, 786), color=None, fill=(0.95, 0.96, 0.98))
    page.insert_text(pymupdf.Point(46, 781), "Official Institutional Document • Sri Vidya E.M High School (2025-26) • Vidyathe Vijayam", fontsize=8, fontname="helv", color=(0.5, 0.55, 0.65))
    page.insert_text(pymupdf.Point(520, 781), f"Page {page_num} of {total_pages}", fontsize=8, fontname="helv", color=(0.5, 0.55, 0.65))

def save_to_all_targets(doc, filename):
    for d in OUTPUT_DIRS:
        target = os.path.join(d, filename)
        doc.save(target)
    print(f"Saved {filename} across output directories.")

# ==============================================================================
# 1. ACADEMIC SYLLABUS 2025-26
# ==============================================================================
def create_syllabus_pdf():
    doc = pymupdf.open()
    page = doc.new_page(width=612, height=792)
    draw_header(page, "Academic Curriculum & Class-wise Syllabus 2025-26", "SVEM/ACAD/2025-26/SYL-01", "10 June 2025", "Academics")

    text = """The academic curriculum at Sri Vidya E.M High School is designed to foster conceptual clarity, scientific inquiry, ethical character, and linguistic excellence. We follow the prescribed Andhra Pradesh State Board curriculum with enhanced STEM learning and spoken English labs."""
    page.insert_textbox(pymupdf.Rect(36, 195, 576, 240), text, fontsize=9.5, fontname="helv", color=(0.2, 0.25, 0.35))

    # Table Header
    y = 250
    page.draw_rect(pymupdf.Rect(36, y, 576, y + 24), color=None, fill=(0.11, 0.31, 0.85))
    page.insert_text(pymupdf.Point(46, y + 16), "Grade Level", fontsize=9, fontname="helv", color=(1, 1, 1))
    page.insert_text(pymupdf.Point(140, y + 16), "Core Subjects", fontsize=9, fontname="helv", color=(1, 1, 1))
    page.insert_text(pymupdf.Point(340, y + 16), "Co-Curricular & Labs", fontsize=9, fontname="helv", color=(1, 1, 1))
    page.insert_text(pymupdf.Point(470, y + 16), "Assessment Pattern", fontsize=9, fontname="helv", color=(1, 1, 1))

    rows = [
        ("Pre-Primary (LKG/UKG)", "English Phonics, Numbers, EVS, Storytelling", "Drawing, Rhymes, Motor Skills, Clay Art", "Informal CCE Observation"),
        ("Primary (Class 1 to 5)", "Telugu/Hindi, English, Math, EVS (Gen. Science)", "Computer Lab, Physical Education, Moral Science", "FA 1-4 (20%) & SA 1-2 (80%)"),
        ("Middle (Class 6 to 8)", "1st/2nd Lang, English, Math, Science, Social", "Science Practicals, Vedic Math, Karate", "Term 1 & Term 2 Summative"),
        ("High School (Class 9)", "AP State Syllabus: Languages, Math, Physics, Bio", "Physics Lab, Biology Specimens, Spoken English", "State Board Preparation Exams"),
        ("Class 10 (SSC Board)", "SSC Curriculum: Languages, Math, Phys/Chem, Bio, SS", "Pre-Final Exams, Board Model Papers, Special Coaching", "SSC Public Board Examination")
    ]

    y += 24
    for i, row in enumerate(rows):
        bg = (0.97, 0.98, 1) if i % 2 == 0 else (1, 1, 1)
        h = 32
        page.draw_rect(pymupdf.Rect(36, y, 576, y + h), color=(0.85, 0.9, 0.95), fill=bg)
        page.insert_text(pymupdf.Point(46, y + 18), row[0], fontsize=8.5, fontname="helv", color=(0.1, 0.15, 0.25))
        page.insert_text(pymupdf.Point(140, y + 18), row[1][:38] + ("..." if len(row[1]) > 38 else ""), fontsize=8, fontname="helv", color=(0.2, 0.25, 0.35))
        page.insert_text(pymupdf.Point(340, y + 18), row[2][:26] + ("..." if len(row[2]) > 26 else ""), fontsize=8, fontname="helv", color=(0.2, 0.25, 0.35))
        page.insert_text(pymupdf.Point(470, y + 18), row[3][:22], fontsize=8, fontname="helv", color=(0.2, 0.25, 0.35))
        y += h

    # Key Highlights box
    y += 20
    page.draw_rect(pymupdf.Rect(36, y, 576, y + 140), color=(0.7, 0.82, 0.96), fill=(0.95, 0.98, 1))
    page.insert_text(pymupdf.Point(50, y + 25), "ACADEMIC POLICY & PEDAGOGY HIGHLIGHTS:", fontsize=10, fontname="helv", color=(0.11, 0.31, 0.85))
    bullets = [
        "1. Spoken English Mastery: Compulsory conversational drills and interactive multimedia storytelling.",
        "2. STEM Experiential Learning: Weekly hands-on sessions in our Composite Science Lab and Computer Room.",
        "3. Remedial Coaching: Complimentary afternoon support classes for students requiring extra academic reinforcement.",
        "4. Continuous Monitoring: Student academic progress cards shared during periodic Parent-Teacher Conferences.",
        "5. Moral Education: Daily morning assemblies instill Indian ethical heritage, self-discipline, and social empathy."
    ]
    for idx, b in enumerate(bullets):
        page.insert_text(pymupdf.Point(50, y + 50 + (idx * 18)), b, fontsize=8.5, fontname="helv", color=(0.15, 0.2, 0.3))

    draw_footer(page)
    save_to_all_targets(doc, "Sri_Vidya_Curriculum_Syllabus_2025.pdf")

# ==============================================================================
# 2. ADMISSION APPLICATION FORM (PRINTABLE)
# ==============================================================================
def create_admission_form_pdf():
    doc = pymupdf.open()
    page = doc.new_page(width=612, height=792)
    draw_header(page, "Student Admission Application Form (Academic Year 2025-26)", "SVEM/ADM/2025-26/FORM-02", "15 Oct 2025", "Admissions")

    page.insert_text(pymupdf.Point(36, 198), "INSTRUCTIONS: Fill this form in CAPITAL LETTERS. Attach copy of Birth Certificate, Aadhar cards & 4 photos.", fontsize=8.5, fontname="helv", color=(0.8, 0.1, 0.1))

    # Form Fields Grid
    fields = [
        ("1. Full Name of Student:", "2. Class Seeking Admission to:"),
        ("3. Date of Birth (DD/MM/YYYY):", "4. Gender (Male / Female / Other):"),
        ("5. Mother Tongue:", "6. Blood Group:"),
        ("7. Father / Guardian's Full Name:", "8. Father's Occupation & Mobile:"),
        ("9. Mother's Full Name:", "10. Mother's Occupation & Mobile:"),
        ("11. Permanent Residential Address:", "12. Emergency Contact Phone:"),
        ("13. Previous School Attended (if any):", "14. Class Last Completed & Result:"),
        ("15. Student Aadhar Card Number:", "16. Transfer Certificate (TC) Enclosed? (Yes/No):")
    ]

    y = 215
    for row in fields:
        # Field 1
        page.draw_rect(pymupdf.Rect(36, y, 300, y + 36), color=(0.8, 0.85, 0.9), fill=(0.98, 0.99, 1))
        page.insert_text(pymupdf.Point(42, y + 14), row[0], fontsize=8, fontname="helv", color=(0.3, 0.35, 0.45))
        page.draw_line(pymupdf.Point(42, y + 30), pymupdf.Point(290, y + 30), color=(0.7, 0.75, 0.8), width=0.8)

        # Field 2
        page.draw_rect(pymupdf.Rect(310, y, 576, y + 36), color=(0.8, 0.85, 0.9), fill=(0.98, 0.99, 1))
        page.insert_text(pymupdf.Point(318, y + 14), row[1], fontsize=8, fontname="helv", color=(0.3, 0.35, 0.45))
        page.draw_line(pymupdf.Point(318, y + 30), pymupdf.Point(566, y + 30), color=(0.7, 0.75, 0.8), width=0.8)
        y += 42

    # Photo box
    page.draw_rect(pymupdf.Rect(470, 218, 560, 320), color=(0.6, 0.7, 0.85), fill=(0.94, 0.96, 1))
    page.insert_text(pymupdf.Point(485, 270), "Affix Student's", fontsize=8, fontname="helv", color=(0.4, 0.5, 0.65))
    page.insert_text(pymupdf.Point(482, 282), "Recent Passport", fontsize=8, fontname="helv", color=(0.4, 0.5, 0.65))
    page.insert_text(pymupdf.Point(488, 294), "Photograph", fontsize=8, fontname="helv", color=(0.4, 0.5, 0.65))

    # Declaration Box
    y += 10
    page.draw_rect(pymupdf.Rect(36, y, 576, y + 75), color=(0.85, 0.88, 0.92), fill=(0.96, 0.97, 0.99))
    page.insert_text(pymupdf.Point(44, y + 18), "DECLARATION BY PARENT / GUARDIAN:", fontsize=8.5, fontname="helv", color=(0.11, 0.31, 0.85))
    page.insert_text(pymupdf.Point(44, y + 34), "I hereby declare that all particulars furnished above are true and complete. If admitted, I agree to abide by the", fontsize=7.8, fontname="helv", color=(0.25, 0.3, 0.38))
    page.insert_text(pymupdf.Point(44, y + 46), "school rules, discipline, fee schedules, and academic guidelines of Sri Vidya E.M High School.", fontsize=7.8, fontname="helv", color=(0.25, 0.3, 0.38))
    page.insert_text(pymupdf.Point(44, y + 64), "Date: _______________     Place: ________________________     Signature of Parent: ___________________________", fontsize=8, fontname="helv", color=(0.15, 0.2, 0.3))

    draw_footer(page)
    save_to_all_targets(doc, "Sri_Vidya_Admission_Form_Printable.pdf")

# ==============================================================================
# 3. ANNUAL ACADEMIC CALENDAR 2025-26
# ==============================================================================
def create_calendar_pdf():
    doc = pymupdf.open()
    page = doc.new_page(width=612, height=792)
    draw_header(page, "Comprehensive Annual Academic Calendar (2025-26)", "SVEM/CAL/2025-26/ANNUAL-01", "01 June 2025", "Calendar & Events")

    y = 195
    page.draw_rect(pymupdf.Rect(36, y, 576, y + 22), color=None, fill=(0.11, 0.31, 0.85))
    page.insert_text(pymupdf.Point(46, y + 15), "Month", fontsize=9, fontname="helv", color=(1, 1, 1))
    page.insert_text(pymupdf.Point(120, y + 15), "Instructional Days & Key Curricular Milestones", fontsize=9, fontname="helv", color=(1, 1, 1))
    page.insert_text(pymupdf.Point(420, y + 15), "Assessments & Major Holidays", fontsize=9, fontname="helv", color=(1, 1, 1))

    months = [
        ("June 2025", "School Reopens, Welcome Assembly, Diagnostic Assessments", "Bakrid Holiday, Teacher Workshop"),
        ("July 2025", "Foundation Courses, Formative Assessment-1 (FA-1)", "FA-1 Assessments (21-25 Jul), Moharram"),
        ("August 2025", "79th Independence Day Celebrations, Science Fair", "Varalakshmi Vratam, Rakhi, FA-2 Exam"),
        ("September 2025", "Teachers' Day Celebration, Telugu Bhasha Dinotsavam", "Vinayaka Chavithi, Milad-un-Nabi"),
        ("October 2025", "Mid-Term Review, Dasara Vacation (10 Days)", "Summative Assessment-1 (SA-1 Midterms)"),
        ("November 2025", "Children's Day Carnival & Annual Sports Meet", "PTM for SA-1 Results, Guru Nanak Jayanti"),
        ("December 2025", "Formative Assessment-3 (FA-3), Mathematics Day", "Christmas Holidays & Winter Carnival"),
        ("January 2026", "Sankranti Holidays (10-17 Jan), Republic Day Parade", "FA-4 Assessments, Science Olympiad"),
        ("February 2026", "Revision for Final Board Exams, SSC Hall Tickets", "Maha Shivaratri, High School Pre-Finals"),
        ("March/April 2026", "Summative Assessment-2 (SA-2) & SSC Public Exams", "Ugadi, Good Friday, Summer Vacation Begins")
    ]

    y += 22
    for idx, m in enumerate(months):
        bg = (0.97, 0.98, 1) if idx % 2 == 0 else (1, 1, 1)
        h = 28
        page.draw_rect(pymupdf.Rect(36, y, 576, y + h), color=(0.85, 0.9, 0.95), fill=bg)
        page.insert_text(pymupdf.Point(46, y + 17), m[0], fontsize=8.5, fontname="helv", color=(0.11, 0.31, 0.85))
        page.insert_text(pymupdf.Point(120, y + 17), m[1][:52], fontsize=8, fontname="helv", color=(0.15, 0.2, 0.3))
        page.insert_text(pymupdf.Point(420, y + 17), m[2][:32], fontsize=8, fontname="helv", color=(0.7, 0.15, 0.15))
        y += h

    # Summary box
    y += 18
    page.draw_rect(pymupdf.Rect(36, y, 576, y + 60), color=(0.8, 0.88, 0.96), fill=(0.95, 0.98, 1))
    page.insert_text(pymupdf.Point(46, y + 20), "ANNUAL SUMMARY: Total Working Days: 220 Days • Minimum Student Attendance Required: 75%", fontsize=8.5, fontname="helv", color=(0.11, 0.31, 0.85))
    page.insert_text(pymupdf.Point(46, y + 36), "Admissions Window for 2026-27 Commences: October 15, 2025. Contact: 8106636230 / +91 93985 78584.", fontsize=8, fontname="helv", color=(0.2, 0.25, 0.35))
    page.insert_text(pymupdf.Point(46, y + 50), "Official notifications regarding any weather-related emergency holidays will be issued by the District Collectorate.", fontsize=7.8, fontname="helv", color=(0.4, 0.45, 0.55))

    draw_footer(page)
    save_to_all_targets(doc, "Academic_Calendar_2025-26.pdf")

# ==============================================================================
# 4. PRESCRIBED BOOK & STATIONERY LIST 2025-26
# ==============================================================================
def create_booklist_pdf():
    doc = pymupdf.open()
    page = doc.new_page(width=612, height=792)
    draw_header(page, "Prescribed Textbook & Stationery List (Classes I to X)", "SVEM/BOOK/2025-26/LIST-04", "10 June 2025", "Curriculum Vault")

    page.insert_text(pymupdf.Point(36, 198), "Textbooks are strictly compliant with AP SCERT and NCERT guidelines. Procure standard durable notebooks.", fontsize=8.5, fontname="helv", color=(0.2, 0.25, 0.35))

    books = [
        ("Class 1 & 2", "AP SCERT Telugu / Hindi Reader, English Marigold, Math Magic, Environmental World", "4-Line (4), Double-Line (2), Square-Rule (2), Drawing Book (1)"),
        ("Class 3 to 5", "SCERT Languages (1st & 2nd), English Blossom, Mathematics, EVS Science & Social", "4-Line (6), Single-Line 200pg (4), Broad-Rule (2), Geometry Kit"),
        ("Class 6 & 7", "Telugu/Hindi Vachakam, English Honeycomb, Math, General Science, Social Studies", "Single-Line Long Notebooks 200pg (8), Graph Book, Science Record"),
        ("Class 8", "1st/2nd Language, English It So Happened, Math, Physical Science, Bio Science, Social", "Single-Line Long Notebooks (10), Lab Practical Records (2), Graph Book"),
        ("Class 9 & 10 (SSC)", "AP SSC Board Textbooks: Telugu, Hindi, English, Mathematics, Physical Science, Biological Science, Social Studies (Paper I & II)", "Long Ruled 200pg (12), Practical Lab Manuals (Physics & Biology), World/India Map Bundles")
    ]

    y = 215
    page.draw_rect(pymupdf.Rect(36, y, 576, y + 22), color=None, fill=(0.11, 0.31, 0.85))
    page.insert_text(pymupdf.Point(46, y + 15), "Grade Band", fontsize=9, fontname="helv", color=(1, 1, 1))
    page.insert_text(pymupdf.Point(140, y + 15), "Prescribed Textbooks & Readers", fontsize=9, fontname="helv", color=(1, 1, 1))
    page.insert_text(pymupdf.Point(420, y + 15), "Stationery & Notebooks", fontsize=9, fontname="helv", color=(1, 1, 1))

    y += 22
    for idx, b in enumerate(books):
        bg = (0.97, 0.98, 1) if idx % 2 == 0 else (1, 1, 1)
        h = 56
        page.draw_rect(pymupdf.Rect(36, y, 576, y + h), color=(0.85, 0.9, 0.95), fill=bg)
        page.insert_text(pymupdf.Point(46, y + 22), b[0], fontsize=8.5, fontname="helv", color=(0.11, 0.31, 0.85))
        page.insert_textbox(pymupdf.Rect(140, y + 6, 410, y + h - 4), b[1], fontsize=8, fontname="helv", color=(0.15, 0.2, 0.3))
        page.insert_textbox(pymupdf.Rect(420, y + 6, 570, y + h - 4), b[2], fontsize=7.8, fontname="helv", color=(0.25, 0.3, 0.4))
        y += h

    y += 20
    page.draw_rect(pymupdf.Rect(36, y, 576, y + 70), color=(0.8, 0.88, 0.96), fill=(0.95, 0.98, 1))
    page.insert_text(pymupdf.Point(46, y + 20), "GENERAL NOTE REGARDING BOOKS & UNIFORMS:", fontsize=8.5, fontname="helv", color=(0.11, 0.31, 0.85))
    page.insert_text(pymupdf.Point(46, y + 36), "1. Parents are free to purchase prescribed SCERT / NCERT textbooks and notebooks from any vendor of their choice.", fontsize=8, fontname="helv", color=(0.2, 0.25, 0.35))
    page.insert_text(pymupdf.Point(46, y + 50), "2. Brown paper covering with standardized student name tags is mandatory on all school books.", fontsize=8, fontname="helv", color=(0.2, 0.25, 0.35))

    draw_footer(page)
    save_to_all_targets(doc, "Prescribed_Book_List_2025.pdf")

# ==============================================================================
# 5. SCHOOL UNIFORM GUIDELINES
# ==============================================================================
def create_uniform_pdf():
    doc = pymupdf.open()
    page = doc.new_page(width=612, height=792)
    draw_header(page, "Official Student Uniform, Footwear & Grooming Code", "SVEM/ADM/2025-26/UNIFORM-06", "01 June 2025", "Code of Conduct")

    page.insert_text(pymupdf.Point(36, 198), "Students must wear the approved school uniform neatly ironed with black polished shoes and proper grooming.", fontsize=8.5, fontname="helv", color=(0.2, 0.25, 0.35))

    y = 215
    page.draw_rect(pymupdf.Rect(36, y, 576, y + 22), color=None, fill=(0.11, 0.31, 0.85))
    page.insert_text(pymupdf.Point(46, y + 15), "Category", fontsize=9, fontname="helv", color=(1, 1, 1))
    page.insert_text(pymupdf.Point(140, y + 15), "Boys Uniform Specifications", fontsize=9, fontname="helv", color=(1, 1, 1))
    page.insert_text(pymupdf.Point(360, y + 15), "Girls Uniform Specifications", fontsize=9, fontname="helv", color=(1, 1, 1))

    specs = [
        ("Regular Uniform\n(Mon, Tue, Thu, Fri)", "Sky Blue short-sleeve shirt with school crest, Navy Blue shorts (Primary) / Trousers (High School), School Tie & Belt", "Sky Blue shirt, Navy Blue pinafore (Class 1-5) / Navy Blue pleated skirt with bloomers (Class 6-10), School Belt & Tie"),
        ("Sports House Uniform\n(Wednesday & Saturday)", "Allotted House T-Shirt (Tagore-Red, Shivaji-Blue, Raman-Green, Sarojini-Yellow), White trousers", "Allotted House T-Shirt with school logo, White pleated skirt / divided sports skirt"),
        ("Footwear &\nSocks", "Black well-polished leather shoes with navy blue socks (Mon-Fri); Pure white canvas sports shoes on Wed & Sat", "Black buckle shoes with navy blue socks (Mon-Fri); Pure white sports sneakers with white socks on Wed & Sat"),
        ("Winter &\nRainy Season", "Navy Blue V-neck knitted sweater with school embroidery crest. Umbrellas or navy blue raincoats only.", "Navy Blue V-neck knitted cardigan with school embroidery crest. Plain black hair ribbons or headbands.")
    ]

    y += 22
    for idx, s in enumerate(specs):
        bg = (0.97, 0.98, 1) if idx % 2 == 0 else (1, 1, 1)
        h = 58
        page.draw_rect(pymupdf.Rect(36, y, 576, y + h), color=(0.85, 0.9, 0.95), fill=bg)
        page.insert_textbox(pymupdf.Rect(46, y + 8, 130, y + h), s[0], fontsize=8, fontname="helv", color=(0.11, 0.31, 0.85))
        page.insert_textbox(pymupdf.Rect(140, y + 8, 350, y + h), s[1], fontsize=7.8, fontname="helv", color=(0.15, 0.2, 0.3))
        page.insert_textbox(pymupdf.Rect(360, y + 8, 570, y + h), s[2], fontsize=7.8, fontname="helv", color=(0.15, 0.2, 0.3))
        y += h

    y += 20
    page.draw_rect(pymupdf.Rect(36, y, 576, y + 70), color=(0.8, 0.88, 0.96), fill=(0.95, 0.98, 1))
    page.insert_text(pymupdf.Point(46, y + 20), "PERSONAL GROOMING & HYGIENE RULES:", fontsize=8.5, fontname="helv", color=(0.11, 0.31, 0.85))
    page.insert_text(pymupdf.Point(46, y + 36), "1. Hair: Boys must maintain a formal short crew cut. Girls with long hair must tie two neat plaits with black ribbons.", fontsize=8, fontname="helv", color=(0.2, 0.25, 0.35))
    page.insert_text(pymupdf.Point(46, y + 50), "2. Nails & Jewelry: Nails must be trimmed weekly. Gold/fancy jewelry, smartwatches, and nail paint are prohibited.", fontsize=8, fontname="helv", color=(0.2, 0.25, 0.35))

    draw_footer(page)
    save_to_all_targets(doc, "School_Uniform_Guidelines.pdf")

# ==============================================================================
# 6. TRANSFER CERTIFICATE (TC) APPLICATION FORM
# ==============================================================================
def create_tc_form_pdf():
    doc = pymupdf.open()
    page = doc.new_page(width=612, height=792)
    draw_header(page, "Application for Issue of School Transfer Certificate (TC)", "SVEM/ADMIN/2025-26/TC-09", "10 June 2025", "Official Requisition")

    page.insert_text(pymupdf.Point(36, 198), "Notice: Minimum 5 working days are required for clearance processing and Principal's endorsement.", fontsize=8.5, fontname="helv", color=(0.8, 0.1, 0.1))

    fields = [
        "1. Full Name of Student (in Block Letters): ____________________________________________________________________",
        "2. School Admission Number: _____________________________    Class & Section Last Studied: __________________",
        "3. Date of Birth (as per school records): ___________________    Aadhar Card Number: ____________________________",
        "4. Father's / Guardian's Full Name: __________________________________________________________________________",
        "5. Mother's Full Name: ______________________________________________________________________________________",
        "6. Contact Phone / Mobile Number: _________________________    Permanent Address: ______________________________",
        "7. Reason for Leaving School: [  ] Parent Relocation    [  ] Higher Studies Admission    [  ] Other: __________________",
        "8. Date of Application: _________________________________    Date TC is Required By: ________________________"
    ]

    y = 220
    for f in fields:
        page.insert_text(pymupdf.Point(42, y), f, fontsize=8.5, fontname="helv", color=(0.15, 0.2, 0.3))
        y += 26

    # Department Clearance Table
    y += 10
    page.draw_rect(pymupdf.Rect(36, y, 576, y + 22), color=None, fill=(0.11, 0.31, 0.85))
    page.insert_text(pymupdf.Point(46, y + 15), "Department", fontsize=9, fontname="helv", color=(1, 1, 1))
    page.insert_text(pymupdf.Point(180, y + 15), "Clearance Status & Remarks", fontsize=9, fontname="helv", color=(1, 1, 1))
    page.insert_text(pymupdf.Point(380, y + 15), "Signature of In-Charge", fontsize=9, fontname="helv", color=(1, 1, 1))

    depts = [
        ("School Library", "All books returned / No outstanding dues", "Librarian: ____________________"),
        ("Science & Computer Labs", "Lab apparatus & computers cleared", "Lab In-Charge: ________________"),
        ("Sports & Physical Education", "Sports gear & equipment accounted for", "P.E.D: _______________________"),
        ("Accounts & Fee Department", "Tuition & term fees cleared up to current quarter", "Accountant: ___________________")
    ]

    y += 22
    for idx, d in enumerate(depts):
        bg = (0.97, 0.98, 1) if idx % 2 == 0 else (1, 1, 1)
        page.draw_rect(pymupdf.Rect(36, y, 576, y + 26), color=(0.85, 0.9, 0.95), fill=bg)
        page.insert_text(pymupdf.Point(46, y + 17), d[0], fontsize=8.5, fontname="helv", color=(0.11, 0.31, 0.85))
        page.insert_text(pymupdf.Point(180, y + 17), d[1], fontsize=8, fontname="helv", color=(0.2, 0.25, 0.35))
        page.insert_text(pymupdf.Point(380, y + 17), d[2], fontsize=8, fontname="helv", color=(0.3, 0.35, 0.45))
        y += 26

    # Digital verification note
    y += 18
    page.draw_rect(pymupdf.Rect(36, y, 576, y + 42), color=(0.8, 0.88, 0.96), fill=(0.95, 0.98, 1))
    page.insert_text(pymupdf.Point(46, y + 18), "DIGITAL TC VERIFICATION: All issued Transfer Certificates are digitally verifiable 24x7 online on our portal at:", fontsize=8, fontname="helv", color=(0.11, 0.31, 0.85))
    page.insert_text(pymupdf.Point(46, y + 32), "http://localhost:8080/transfer-certificate.html — Parents may verify by entering Student Admission Number.", fontsize=8, fontname="helv", color=(0.15, 0.2, 0.3))

    draw_footer(page)
    save_to_all_targets(doc, "TC_Application_Form.pdf")

# ==============================================================================
# 7. ADMISSIONS NOTIFICATION (CIRCULAR)
# ==============================================================================
def create_circular_pdf():
    doc = pymupdf.open()
    page = doc.new_page(width=612, height=792)
    draw_header(page, "Notification for Pre-Primary to Class X Enrollment 2025-26", "SVEM/ADM/2025-26/CIR-01", "15 Oct 2025", "Admissions")

    body = """Sri Vidya E.M High School announces admissions for the academic year 2025-26 from Pre-Primary (LKG & UKG) to Class X. We provide child-centric, value-based English medium education with modern digital classrooms, STEM laboratories, and holistic student personality grooming."""
    page.insert_textbox(pymupdf.Rect(36, 195, 576, 240), body, fontsize=9.5, fontname="helv", color=(0.2, 0.25, 0.35))

    y = 250
    page.draw_rect(pymupdf.Rect(36, y, 576, y + 22), color=None, fill=(0.11, 0.31, 0.85))
    page.insert_text(pymupdf.Point(46, y + 15), "Class", fontsize=9, fontname="helv", color=(1, 1, 1))
    page.insert_text(pymupdf.Point(120, y + 15), "Age Criteria (as of 31 May 2025)", fontsize=9, fontname="helv", color=(1, 1, 1))
    page.insert_text(pymupdf.Point(320, y + 15), "Selection & Interaction Mode", fontsize=9, fontname="helv", color=(1, 1, 1))

    c_rows = [
        ("LKG & UKG", "3+ to 4+ Years", "Parent Informal Interaction & Observation"),
        ("Classes 1 to 5", "5+ to 9+ Years", "Foundational Literacy & Numeracy Assessment"),
        ("Classes 6 to 9", "10+ to 13+ Years", "Academic Diagnostic Test & Previous Record"),
        ("Class 10 (SSC)", "14+ Years", "Strictly on Merit & Board TC Verification")
    ]
    y += 22
    for idx, r in enumerate(c_rows):
        bg = (0.97, 0.98, 1) if idx % 2 == 0 else (1, 1, 1)
        page.draw_rect(pymupdf.Rect(36, y, 576, y + 26), color=(0.85, 0.9, 0.95), fill=bg)
        page.insert_text(pymupdf.Point(46, y + 17), r[0], fontsize=8.5, fontname="helv", color=(0.11, 0.31, 0.85))
        page.insert_text(pymupdf.Point(120, y + 17), r[1], fontsize=8, fontname="helv", color=(0.2, 0.25, 0.35))
        page.insert_text(pymupdf.Point(320, y + 17), r[2], fontsize=8, fontname="helv", color=(0.2, 0.25, 0.35))
        y += 26

    y += 20
    page.draw_rect(pymupdf.Rect(36, y, 576, y + 120), color=(0.7, 0.82, 0.96), fill=(0.95, 0.98, 1))
    page.insert_text(pymupdf.Point(50, y + 22), "HOW TO APPLY FOR ADMISSION:", fontsize=9.5, fontname="helv", color=(0.11, 0.31, 0.85))
    steps = [
        "• Online Submission: Visit http://localhost:8080/#admissions and submit the interactive digital form.",
        "• Offline Campus Walk-in: Collect form & prospectus from School Admission Office (Mon-Sat: 8:30 AM - 5:30 PM).",
        "• Admissions Hotline: Contact Sri Navva Anand (Vice Principal) at +91 93985 78584.",
        "• School Reception: 8106636230 / 9966422096 | Email: srividyaschools2017@gmail.com"
    ]
    for idx, s in enumerate(steps):
        page.insert_text(pymupdf.Point(50, y + 44 + (idx * 18)), s, fontsize=8.5, fontname="helv", color=(0.15, 0.2, 0.3))

    draw_footer(page)
    save_to_all_targets(doc, "Admissions_Notification_2025-26.pdf")

# ==============================================================================
# 8. SA-1 TIMETABLE & PORTIONS
# ==============================================================================
def create_timetable_pdf():
    doc = pymupdf.open()
    page = doc.new_page(width=612, height=792)
    draw_header(page, "Summative Assessment (SA-1) Timetable & Portions", "SVEM/EXAM/2025-26/SA1-008", "28 Oct 2025", "Examinations")

    page.insert_text(pymupdf.Point(36, 198), "Summative Assessment-1 (Midterms) will be held from 03 Nov to 08 Nov 2025. Timing: 09:30 AM – 12:30 PM.", fontsize=8.5, fontname="helv", color=(0.2, 0.25, 0.35))

    y = 215
    page.draw_rect(pymupdf.Rect(36, y, 576, y + 22), color=None, fill=(0.11, 0.31, 0.85))
    page.insert_text(pymupdf.Point(46, y + 15), "Date & Day", fontsize=8.5, fontname="helv", color=(1, 1, 1))
    page.insert_text(pymupdf.Point(120, y + 15), "Primary (Class 1-5)", fontsize=8.5, fontname="helv", color=(1, 1, 1))
    page.insert_text(pymupdf.Point(240, y + 15), "Middle (Class 6-8)", fontsize=8.5, fontname="helv", color=(1, 1, 1))
    page.insert_text(pymupdf.Point(360, y + 15), "High School (Class 9-10)", fontsize=8.5, fontname="helv", color=(1, 1, 1))
    page.insert_text(pymupdf.Point(490, y + 15), "Portions Scope", fontsize=8.5, fontname="helv", color=(1, 1, 1))

    tt = [
        ("03-11-2025 (Mon)", "1st Language (Tel/Hin)", "1st Language (Tel/Hin)", "1st Language (Tel/Hin)", "Units 1-4 & Vyakaranam"),
        ("04-11-2025 (Tue)", "2nd Language (Tel/Hin)", "2nd Language (Tel/Hin)", "2nd Language (Tel/Hin)", "Units 1-3 & Composition"),
        ("05-11-2025 (Wed)", "English Reader", "English Paper 1", "English Paper 1 & 2", "Prose, Poetry, Letter"),
        ("06-11-2025 (Thu)", "Mathematics", "Mathematics", "Mathematics (Paper 1 & 2)", "Ch 1-6 Term-1 Chapters"),
        ("07-11-2025 (Fri)", "EVS (Science)", "General Science", "Physical & Biological Science", "Lessons 1-5 + Practical"),
        ("08-11-2025 (Sat)", "Computer & GK", "Social Studies", "Social Studies (Paper 1 & 2)", "History, Civics, Geography")
    ]
    y += 22
    for idx, t in enumerate(tt):
        bg = (0.97, 0.98, 1) if idx % 2 == 0 else (1, 1, 1)
        h = 28
        page.draw_rect(pymupdf.Rect(36, y, 576, y + h), color=(0.85, 0.9, 0.95), fill=bg)
        page.insert_text(pymupdf.Point(46, y + 17), t[0], fontsize=7.8, fontname="helv", color=(0.11, 0.31, 0.85))
        page.insert_text(pymupdf.Point(120, y + 17), t[1], fontsize=7.8, fontname="helv", color=(0.15, 0.2, 0.3))
        page.insert_text(pymupdf.Point(240, y + 17), t[2], fontsize=7.8, fontname="helv", color=(0.15, 0.2, 0.3))
        page.insert_text(pymupdf.Point(360, y + 17), t[3], fontsize=7.8, fontname="helv", color=(0.15, 0.2, 0.3))
        page.insert_text(pymupdf.Point(490, y + 17), t[4], fontsize=7.5, fontname="helv", color=(0.7, 0.15, 0.15))
        y += h

    y += 20
    page.draw_rect(pymupdf.Rect(36, y, 576, y + 60), color=(0.8, 0.88, 0.96), fill=(0.95, 0.98, 1))
    page.insert_text(pymupdf.Point(46, y + 18), "EXAM PROTOCOL: Hall Ticket and ID card are mandatory. Reporting time: 09:00 AM.", fontsize=8.5, fontname="helv", color=(0.11, 0.31, 0.85))
    page.insert_text(pymupdf.Point(46, y + 34), "Answer script verification and Parent-Teacher Meeting will be held on Saturday, 08th November 2025.", fontsize=8, fontname="helv", color=(0.2, 0.25, 0.35))
    page.insert_text(pymupdf.Point(46, y + 48), "No re-examination will be conducted except under certified medical emergencies verified by the Principal.", fontsize=7.8, fontname="helv", color=(0.4, 0.45, 0.55))

    draw_footer(page)
    save_to_all_targets(doc, "SA1_Timetable_Portions_2025.pdf")

# ==============================================================================
# 9. PTM SCHEDULE
# ==============================================================================
def create_ptm_pdf():
    doc = pymupdf.open()
    page = doc.new_page(width=612, height=792)
    draw_header(page, "Parent-Teacher Conference (PTM) Schedule", "SVEM/PTM/2025-26/03", "05 Nov 2025", "Parent Council")

    body = """Dear Parents & Guardians, you are cordially invited to the Mid-Term Parent-Teacher Meeting on Saturday, 08th November 2025 to review student progress cards, attendance records, and personal growth plans with class teachers."""
    page.insert_textbox(pymupdf.Rect(36, 195, 576, 235), body, fontsize=9.5, fontname="helv", color=(0.2, 0.25, 0.35))

    y = 245
    page.draw_rect(pymupdf.Rect(36, y, 576, y + 22), color=None, fill=(0.11, 0.31, 0.85))
    page.insert_text(pymupdf.Point(46, y + 15), "Classes", fontsize=9, fontname="helv", color=(1, 1, 1))
    page.insert_text(pymupdf.Point(180, y + 15), "Time Slot", fontsize=9, fontname="helv", color=(1, 1, 1))
    page.insert_text(pymupdf.Point(320, y + 15), "Designated Venue", fontsize=9, fontname="helv", color=(1, 1, 1))
    page.insert_text(pymupdf.Point(460, y + 15), "Faculty In-Charge", fontsize=9, fontname="helv", color=(1, 1, 1))

    ptm_rows = [
        ("Pre-Primary (LKG & UKG)", "09:00 AM – 10:30 AM", "Kindergarten Wing (Ground Floor)", "Mrs. K. Swathi"),
        ("Primary (Class 1 to 5)", "10:30 AM – 12:30 PM", "Primary Block (First Floor)", "Mrs. T. Radha & Staff"),
        ("Middle School (Class 6-8)", "01:30 PM – 03:00 PM", "Middle School Hall (Second Floor)", "Ms. Anjali & Science Faculty"),
        ("High School (Class 9 & 10)", "03:00 PM – 04:30 PM", "Auditorium Hall #2", "Sri Navva Anand (VP)")
    ]
    y += 22
    for idx, r in enumerate(ptm_rows):
        bg = (0.97, 0.98, 1) if idx % 2 == 0 else (1, 1, 1)
        page.draw_rect(pymupdf.Rect(36, y, 576, y + 30), color=(0.85, 0.9, 0.95), fill=bg)
        page.insert_text(pymupdf.Point(46, y + 19), r[0], fontsize=8.5, fontname="helv", color=(0.11, 0.31, 0.85))
        page.insert_text(pymupdf.Point(180, y + 19), r[1], fontsize=8.5, fontname="helv", color=(0.2, 0.25, 0.35))
        page.insert_text(pymupdf.Point(320, y + 19), r[2], fontsize=8, fontname="helv", color=(0.2, 0.25, 0.35))
        page.insert_text(pymupdf.Point(460, y + 19), r[3], fontsize=8, fontname="helv", color=(0.2, 0.25, 0.35))
        y += 30

    y += 20
    page.draw_rect(pymupdf.Rect(36, y, 576, y + 80), color=(0.8, 0.88, 0.96), fill=(0.95, 0.98, 1))
    page.insert_text(pymupdf.Point(46, y + 20), "IMPORTANT GUIDELINES FOR ATTENDING PARENTS:", fontsize=8.5, fontname="helv", color=(0.11, 0.31, 0.85))
    page.insert_text(pymupdf.Point(46, y + 36), "1. Bring your child's School Diary and Mid-term Hall Ticket for teacher verification.", fontsize=8, fontname="helv", color=(0.2, 0.25, 0.35))
    page.insert_text(pymupdf.Point(46, y + 50), "2. Students accompanying parents must be dressed in full school uniform.", fontsize=8, fontname="helv", color=(0.2, 0.25, 0.35))
    page.insert_text(pymupdf.Point(46, y + 64), "3. Kindly adhere strictly to your assigned time window to avoid classroom crowding.", fontsize=8, fontname="helv", color=(0.2, 0.25, 0.35))

    draw_footer(page)
    save_to_all_targets(doc, "PTM_Schedule_November_2025.pdf")

# ==============================================================================
# 10. CHILDREN'S DAY & SPORTS DAY PROGRAM
# ==============================================================================
def create_sports_pdf():
    doc = pymupdf.open()
    page = doc.new_page(width=612, height=792)
    draw_header(page, "Children's Day & Annual Sports Day Celebration Itinerary", "SVEM/EVENT/2025-26/07", "12 Nov 2025", "Celebration")

    page.insert_text(pymupdf.Point(36, 198), "Program Itinerary for Friday, 14th November 2025 at Sri Vidya High School Main Sports Grounds.", fontsize=8.5, fontname="helv", color=(0.2, 0.25, 0.35))

    events = [
        ("08:30 AM", "Guard of Honour & March Past", "Four School Houses (Tagore, Shivaji, Raman, Sarojini)"),
        ("08:50 AM", "Sports Torch Lighting & Oath", "Sports Captains & Vice Principal Sri Navva Anand"),
        ("09:15 AM", "Track Heats (100m, 200m, Relay)", "Sub-Junior, Junior, and Senior Athletes"),
        ("11:00 AM", "Traditional & Primary Games", "Lemon & Spoon, Sack Race, Frog Jump for Class 1-5"),
        ("12:15 PM", "Inter-House Tug-of-War Finals", "House Teams & Faculty Exhibition Championship"),
        ("01:00 PM", "Special Festive Lunch", "Wholesome lunch feast provided for all students & staff"),
        ("02:15 PM", "Children's Day Cultural Skits", "Tribute to Pandit Nehru, Group Dances, Choral Singing"),
        ("03:30 PM", "Medal & Trophy Distribution", "Awarding Champions & Best House Championship Cup"),
        ("04:30 PM", "National Anthem & Dispersal", "All Students, Parents, and Faculty")
    ]

    y = 215
    page.draw_rect(pymupdf.Rect(36, y, 576, y + 22), color=None, fill=(0.11, 0.31, 0.85))
    page.insert_text(pymupdf.Point(46, y + 15), "Time", fontsize=9, fontname="helv", color=(1, 1, 1))
    page.insert_text(pymupdf.Point(140, y + 15), "Event / Activity", fontsize=9, fontname="helv", color=(1, 1, 1))
    page.insert_text(pymupdf.Point(340, y + 15), "Participants & Details", fontsize=9, fontname="helv", color=(1, 1, 1))

    y += 22
    for idx, e in enumerate(events):
        bg = (0.97, 0.98, 1) if idx % 2 == 0 else (1, 1, 1)
        h = 25
        page.draw_rect(pymupdf.Rect(36, y, 576, y + h), color=(0.85, 0.9, 0.95), fill=bg)
        page.insert_text(pymupdf.Point(46, y + 16), e[0], fontsize=8.5, fontname="helv", color=(0.11, 0.31, 0.85))
        page.insert_text(pymupdf.Point(140, y + 16), e[1], fontsize=8, fontname="helv", color=(0.15, 0.2, 0.3))
        page.insert_text(pymupdf.Point(340, y + 16), e[2], fontsize=8, fontname="helv", color=(0.2, 0.25, 0.35))
        y += h

    y += 20
    page.draw_rect(pymupdf.Rect(36, y, 576, y + 50), color=(0.8, 0.88, 0.96), fill=(0.95, 0.98, 1))
    page.insert_text(pymupdf.Point(46, y + 18), "DRESS CODE: All students must wear neat house sports uniforms with canvas sports sneakers.", fontsize=8.5, fontname="helv", color=(0.11, 0.31, 0.85))
    page.insert_text(pymupdf.Point(46, y + 34), "Parents are warmly invited to attend and witness the athletic events. Entry gates open at 08:15 AM.", fontsize=8, fontname="helv", color=(0.2, 0.25, 0.35))

    draw_footer(page)
    save_to_all_targets(doc, "Childrens_Day_Program_Details.pdf")

if __name__ == "__main__":
    print("Generating all 10 official school PDFs...")
    create_syllabus_pdf()
    create_admission_form_pdf()
    create_calendar_pdf()
    create_booklist_pdf()
    create_uniform_pdf()
    create_tc_form_pdf()
    create_circular_pdf()
    create_timetable_pdf()
    create_ptm_pdf()
    create_sports_pdf()
    print("All 10 official PDFs generated successfully!")
