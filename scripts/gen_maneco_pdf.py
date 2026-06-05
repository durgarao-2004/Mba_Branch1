#!/usr/bin/env python3.12
"""Generate PDF for Introduction to Managerial Economics."""
import json, os
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib.colors import HexColor, white
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak,
    Table, TableStyle, HRFlowable, KeepTogether, ListFlowable, ListItem
)

BASE     = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SLUG     = "introduction-to-managerial-economics"
JSON_IN  = os.path.join(BASE, f"content/subjects/managerial-economics/lectures/{SLUG}.json")
PDF_OUT  = os.path.join(BASE, f"public/downloads/{SLUG}.pdf")

with open(JSON_IN) as f:
    d = json.load(f)

NAVY        = HexColor("#1E3A5F")
BLUE        = HexColor("#2563EB")
BLUE_LIGHT  = HexColor("#EFF6FF")
GREEN_LIGHT = HexColor("#F0FDF4")
GREEN       = HexColor("#059669")
AMBER_LIGHT = HexColor("#FFFBEB")
SLATE       = HexColor("#334155")
SLATE_MID   = HexColor("#94A3B8")
BORDER      = HexColor("#E2E8F0")

SS = getSampleStyleSheet()
def sty(name, parent="Normal", **kw):
    return ParagraphStyle(name, parent=SS[parent], **kw)

S_TITLE  = sty("T", fontSize=24, textColor=white,      alignment=TA_CENTER,  spaceAfter=6,  fontName="Helvetica-Bold")
S_META   = sty("M", fontSize=9,  textColor=SLATE_MID,  alignment=TA_CENTER,  spaceAfter=4)
S_H1     = sty("H1", fontSize=14, textColor=NAVY,      fontName="Helvetica-Bold", spaceBefore=16, spaceAfter=6)
S_H2     = sty("H2", fontSize=11, textColor=BLUE,      fontName="Helvetica-Bold", spaceBefore=12, spaceAfter=4)
S_BODY   = sty("B",  fontSize=10, textColor=SLATE,     leading=15, spaceAfter=6, alignment=TA_JUSTIFY)
S_SHADED = sty("SH", fontSize=10, textColor=SLATE,     leading=15, spaceAfter=6, alignment=TA_JUSTIFY,
               backColor=BLUE_LIGHT, borderPadding=8)
S_GREEN  = sty("GR", fontSize=10, textColor=SLATE,     leading=15, spaceAfter=6, alignment=TA_JUSTIFY,
               backColor=GREEN_LIGHT, borderPadding=8)
S_AMBER  = sty("AM", fontSize=10, textColor=SLATE,     leading=15, spaceAfter=6, alignment=TA_JUSTIFY,
               backColor=AMBER_LIGHT, borderPadding=8)
S_Q      = sty("Q",  fontSize=10.5, textColor=NAVY,    fontName="Helvetica-Bold", spaceBefore=12, spaceAfter=4)
S_OPT    = sty("O",  fontSize=10, textColor=SLATE,     leading=13, leftIndent=20, spaceAfter=2)
S_OK     = sty("OK", fontSize=10, textColor=GREEN,     fontName="Helvetica-Bold", leading=13, leftIndent=20, spaceAfter=2)
S_EXP    = sty("EX", fontSize=9.5, textColor=SLATE_MID, leading=13, leftIndent=20, spaceAfter=6,
               fontName="Helvetica-Oblique")
S_BULLET = sty("BU", fontSize=10, textColor=SLATE, leading=14, leftIndent=16, spaceAfter=3)

doc_pdf = SimpleDocTemplate(
    PDF_OUT, pagesize=A4,
    leftMargin=2*cm, rightMargin=2*cm,
    topMargin=2.2*cm, bottomMargin=2.2*cm,
    title=d["title"],
    author="MBA Learning Hub",
)

story = []

def hr(color=BORDER, t=0.5, sp=4):
    return [Spacer(1, sp), HRFlowable(width="100%", thickness=t, color=color), Spacer(1, sp)]

def section(text):
    story.extend(hr(NAVY, 1.2, 2))
    story.append(Paragraph(text, S_H1))

# Cover
story.append(Spacer(1, 1.5*cm))
ttable = Table([[Paragraph(d["title"], S_TITLE)]], colWidths=["100%"])
ttable.setStyle(TableStyle([
    ("BACKGROUND",    (0,0),(-1,-1), NAVY),
    ("TOPPADDING",    (0,0),(-1,-1), 18),
    ("BOTTOMPADDING", (0,0),(-1,-1), 18),
    ("LEFTPADDING",   (0,0),(-1,-1), 20),
    ("RIGHTPADDING",  (0,0),(-1,-1), 20),
]))
story.append(ttable)
story.append(Spacer(1, 0.3*cm))
story.append(Paragraph(
    f"Subject: Managerial Economics  &nbsp;|&nbsp;  Difficulty: {d['difficulty'].title()}  "
    f"&nbsp;|&nbsp;  Read time: {d['estimatedReadTime']}  &nbsp;|&nbsp;  Date: {d['date']}",
    S_META
))
story.append(Spacer(1, 0.8*cm))

# 1. Summary
section("1. Lecture Summary")
story.append(Paragraph(d["summary"].replace("\n", "<br/>"), S_SHADED))

# 2. Key Concepts
section("2. Key Concepts")
items = [ListItem(Paragraph(f"<b>{c}</b>", S_BULLET), bulletColor=BLUE, leftIndent=20)
         for c in d["concepts"]]
story.append(ListFlowable(items, bulletType='bullet', start='•'))
story.append(Spacer(1, 6))

# 3. Detailed Notes
section("3. Detailed Notes")
for i, s in enumerate(d["notes"], 1):
    block = [
        Paragraph(f"{i}. {s['heading']}", S_H2),
        Paragraph(s["content"].replace("\n", "<br/>"), S_BODY),
    ]
    story.append(KeepTogether(block))
    story.append(Spacer(1, 4))

# 4. Real-World Example
section("4. Real-World Example")
story.append(Paragraph(d["example"].replace("\n", "<br/>"), S_GREEN))

# 5. Case Study
section("5. Case Study")
story.append(Paragraph(d["caseStudy"].replace("\n", "<br/>"), S_AMBER))

# 6. Key Takeaways
section("6. Key Takeaways")
from reportlab.platypus import ListFlowable as LF
tk_items = [ListItem(Paragraph(t, S_BULLET), value=i) for i, t in enumerate(d["takeaways"], 1)]
story.append(LF(tk_items, bulletType='1', start=1))
story.append(Spacer(1, 6))

# 7. Quiz
story.append(PageBreak())
section(f"7. Knowledge Quiz  ({len(d['quiz'])} Questions)")
story.append(Paragraph(
    f"<i>Test your understanding of {d['title']}.  Correct answers shown in green.</i>",
    S_META
))
story.append(Spacer(1, 8))

labels = ["A", "B", "C", "D"]
for i, q in enumerate(d["quiz"], 1):
    block = [Paragraph(f"Q{i}.  {q['question']}", S_Q)]
    for j, opt in enumerate(q["options"]):
        s_ = S_OK if j == q["correct"] else S_OPT
        mk = "✓" if j == q["correct"] else "○"
        block.append(Paragraph(f"{mk}  {labels[j]}.  {opt}", s_))
    block.append(Paragraph(f"<i>Explanation: {q['explanation']}</i>", S_EXP))
    story.append(KeepTogether(block))
    story.append(HRFlowable(width="100%", thickness=0.3, color=BORDER))

story.append(Spacer(1, 0.5*cm))
story.extend(hr(NAVY, 1))
story.append(Paragraph("MBA Learning Hub  —  Classroom Notes  —  Managerial Economics", S_META))

doc_pdf.build(story)
print(f"PDF saved → {PDF_OUT}")
