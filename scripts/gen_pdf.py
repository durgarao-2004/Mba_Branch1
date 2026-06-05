#!/usr/bin/env python3.12
"""Generate PDF lecture file from JSON content using ReportLab."""
import json, os
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib.colors import HexColor, white, black
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak,
    Table, TableStyle, HRFlowable, KeepTogether
)
from reportlab.platypus import ListFlowable, ListItem

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JSON_PATH = os.path.join(BASE, "content/subjects/financial-management/lectures/introduction-to-financial-management.json")
OUT_PATH  = os.path.join(BASE, "public/downloads/introduction-to-financial-management.pdf")

with open(JSON_PATH, "r") as f:
    d = json.load(f)

# ── Colours ───────────────────────────────────────────────────────────────────
NAVY        = HexColor("#1E3A5F")
BLUE        = HexColor("#2563EB")
BLUE_LIGHT  = HexColor("#EFF6FF")
BLUE_BORDER = HexColor("#BFDBFE")
GREEN       = HexColor("#059669")
GREEN_LIGHT = HexColor("#F0FDF4")
AMBER       = HexColor("#D97706")
AMBER_LIGHT = HexColor("#FFFBEB")
VIOLET      = HexColor("#7C3AED")
SLATE       = HexColor("#334155")
SLATE_LIGHT = HexColor("#F8FAFC")
SLATE_MID   = HexColor("#94A3B8")
BORDER      = HexColor("#E2E8F0")

# ── Styles ────────────────────────────────────────────────────────────────────
SS = getSampleStyleSheet()

def sty(name, parent="Normal", **kw):
    return ParagraphStyle(name, parent=SS[parent], **kw)

S_TITLE  = sty("Title2", fontSize=24, textColor=NAVY, alignment=TA_CENTER, spaceAfter=6, fontName="Helvetica-Bold")
S_META   = sty("Meta", fontSize=9, textColor=SLATE_MID, alignment=TA_CENTER, spaceAfter=4)
S_H1     = sty("H1", fontSize=14, textColor=NAVY, fontName="Helvetica-Bold", spaceBefore=16, spaceAfter=6, borderPadding=(0,0,3,0))
S_H2     = sty("H2", fontSize=11, textColor=BLUE, fontName="Helvetica-Bold", spaceBefore=12, spaceAfter=4)
S_BODY   = sty("Body2", fontSize=10, textColor=SLATE, leading=15, spaceAfter=6, alignment=TA_JUSTIFY)
S_SHADED = sty("Shaded", fontSize=10, textColor=SLATE, leading=15, spaceAfter=6, alignment=TA_JUSTIFY,
               backColor=BLUE_LIGHT, borderPadding=8)
S_GREEN  = sty("Green",  fontSize=10, textColor=SLATE, leading=15, spaceAfter=6, alignment=TA_JUSTIFY,
               backColor=GREEN_LIGHT, borderPadding=8)
S_AMBER  = sty("Amber",  fontSize=10, textColor=SLATE, leading=15, spaceAfter=6, alignment=TA_JUSTIFY,
               backColor=AMBER_LIGHT, borderPadding=8)
S_BULLET = sty("Bullet", fontSize=10, textColor=SLATE, leading=14, leftIndent=16, spaceAfter=3)
S_NUM    = sty("Num",    fontSize=10, textColor=SLATE, leading=14, leftIndent=16, spaceAfter=4)
S_Q      = sty("Q",      fontSize=10.5, textColor=NAVY,  fontName="Helvetica-Bold", spaceBefore=12, spaceAfter=4)
S_OPT    = sty("Opt",    fontSize=10, textColor=SLATE, leading=13, leftIndent=20, spaceAfter=2)
S_OPT_OK = sty("OptOK",  fontSize=10, textColor=GREEN, fontName="Helvetica-Bold", leading=13, leftIndent=20, spaceAfter=2)
S_EXP    = sty("Exp",    fontSize=9.5, textColor=SLATE_MID, leading=13, leftIndent=20, spaceAfter=6, fontName="Helvetica-Oblique")
S_LABEL  = sty("Label",  fontSize=8, textColor=SLATE_MID, fontName="Helvetica-Bold",
               spaceBefore=18, spaceAfter=4, textTransform="uppercase", letterSpacing=1.5)

# ── Document ──────────────────────────────────────────────────────────────────
doc_pdf = SimpleDocTemplate(
    OUT_PATH, pagesize=A4,
    leftMargin=2*cm, rightMargin=2*cm,
    topMargin=2.2*cm, bottomMargin=2.2*cm,
    title=d["title"],
    author="MBA AI Learning Platform",
)

story = []

def hr(color=BORDER, thickness=0.5, sp=4):
    return [Spacer(1, sp), HRFlowable(width="100%", thickness=thickness, color=color), Spacer(1, sp)]

def section_label(text):
    story.append(Paragraph(text, S_LABEL))

def h1(text):
    story.extend(hr(NAVY, 1.2, 2))
    story.append(Paragraph(text, S_H1))

def h2(text):
    story.append(Paragraph(text, S_H2))

def body(text, style=S_BODY):
    story.append(Paragraph(text.replace("\n", "<br/>"), style))

# ── Cover ─────────────────────────────────────────────────────────────────────
story.append(Spacer(1, 1.5*cm))

# Title box
title_table = Table(
    [[Paragraph(d["title"], S_TITLE)]],
    colWidths=["100%"]
)
title_table.setStyle(TableStyle([
    ("BACKGROUND", (0,0), (-1,-1), NAVY),
    ("TEXTCOLOR",  (0,0), (-1,-1), white),
    ("TOPPADDING",    (0,0), (-1,-1), 18),
    ("BOTTOMPADDING", (0,0), (-1,-1), 18),
    ("LEFTPADDING",   (0,0), (-1,-1), 20),
    ("RIGHTPADDING",  (0,0), (-1,-1), 20),
    ("ROUNDEDCORNERS", (0,0), (-1,-1), [6,6,6,6]),
]))
story.append(title_table)
story.append(Spacer(1, 0.3*cm))

# Meta row
story.append(Paragraph(
    f"Subject: Financial Management  &nbsp;|&nbsp;  Difficulty: {d['difficulty'].title()}  "
    f"&nbsp;|&nbsp;  Read time: {d['estimatedReadTime']}  &nbsp;|&nbsp;  Date: {d['date']}",
    S_META
))
story.append(Paragraph("Tags: " + "  •  ".join(d.get("tags", [])), S_META))
story.append(Spacer(1, 0.8*cm))

# ── 1. Summary ────────────────────────────────────────────────────────────────
h1("1. Lecture Summary")
body(d["summary"], S_SHADED)

# ── 2. Key Concepts ───────────────────────────────────────────────────────────
h1("2. Key Concepts")
items = []
for concept in d["concepts"]:
    items.append(ListItem(Paragraph(f"<b>{concept}</b>", S_BULLET), bulletColor=BLUE, leftIndent=20))
story.append(ListFlowable(items, bulletType='bullet', start='•'))
story.append(Spacer(1, 6))

# ── 3. Detailed Notes ─────────────────────────────────────────────────────────
h1("3. Detailed Notes")
for i, section in enumerate(d["notes"], 1):
    block = []
    block.append(Paragraph(f"{i}. {section['heading']}", S_H2))
    block.append(Paragraph(section["content"].replace("\n", "<br/>"), S_BODY))
    story.append(KeepTogether(block))
    story.append(Spacer(1, 4))

# ── 4. Real-World Example ─────────────────────────────────────────────────────
h1("4. Real-World Example")
body(d["example"], S_GREEN)

# ── 5. Case Study ─────────────────────────────────────────────────────────────
h1("5. Case Study")
body(d["caseStudy"], S_AMBER)

# ── 6. Key Takeaways ──────────────────────────────────────────────────────────
h1("6. Key Takeaways")
items = []
for i, t in enumerate(d["takeaways"], 1):
    items.append(ListItem(Paragraph(t, S_NUM), value=i))
story.append(ListFlowable(items, bulletType='1', start=1))
story.append(Spacer(1, 6))

# ── 7. Quiz ───────────────────────────────────────────────────────────────────
story.append(PageBreak())
h1(f"7. Knowledge Quiz  ({len(d['quiz'])} Questions)")
story.append(Paragraph(
    f"<i>Test your understanding of {d['title']}.  "
    "Correct answers are shown in green.</i>", S_META
))
story.append(Spacer(1, 8))

labels = ["A", "B", "C", "D"]
for i, q in enumerate(d["quiz"], 1):
    block = []
    block.append(Paragraph(f"Q{i}.  {q['question']}", S_Q))
    for j, opt in enumerate(q["options"]):
        sty_opt = S_OPT_OK if j == q["correct"] else S_OPT
        marker  = "✓" if j == q["correct"] else "○"
        block.append(Paragraph(f"{marker}  {labels[j]}.  {opt}", sty_opt))
    block.append(Paragraph(f"<i>Explanation: {q['explanation']}</i>", S_EXP))
    story.append(KeepTogether(block))
    story.append(HRFlowable(width="100%", thickness=0.3, color=BORDER))

# ── Footer note ───────────────────────────────────────────────────────────────
story.append(Spacer(1, 0.5*cm))
story.extend(hr(NAVY, 1))
story.append(Paragraph(
    "MBA AI Learning Platform  —  Generated from classroom transcript  —  Financial Management",
    S_META
))

doc_pdf.build(story)
print(f"PDF saved → {OUT_PATH}")
