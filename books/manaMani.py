const chapter1 = {
  vocab: [{ th: "คำ", en: "word" }, ...],
  exercises: [{ th: "ประโยค", en: "sentence" }, ...],
  drills: [{ th: "ฝึก", en: "practice" }, ...]
};

import pdfplumber
import json

# Define your chapters with page ranges (page numbers are 1-based)
chapters = {
    "Chapter 1": [11, 12],
    "Chapter 2": [13, 15],
    # Add the rest of your chapters here
}

# Optional: define markers or keywords for sections inside each chapter
sections = ["vocab", "exercises", "drills"]  # Adjust based on your PDF

pdf_path = "your_book.pdf"  # Replace with your PDF file

output = {}

with pdfplumber.open(pdf_path) as pdf:
    for chapter, pages in chapters.items():
        chapter_text = ""
        for p in range(pages[0]-1, pages[1]):  # pdfplumber uses 0-based index
            page = pdf.pages[p]
            chapter_text += page.extract_text() + "\n"

        # Naive split based on section keywords (you can adjust regex later)
        chapter_data = {}
        for section in sections:
            start = chapter_text.lower().find(section)
            if start != -1:
                # Take text until next section or end of chapter
                next_sections = [chapter_text.lower().find(s, start+1) for s in sections if chapter_text.lower().find(s, start+1) != -1]
                end = min(next_sections) if next_sections else len(chapter_text)
                section_text = chapter_text[start:end].strip()
                # Simple line split: first word = Thai, rest = English (adjust if needed)
                entries = []
                for line in section_text.splitlines()[1:]:  # skip section header
                    if line.strip():
                        parts = line.split(" – ")  # or "-" depending on format
                        if len(parts) == 2:
                            entries.append({"th": parts[0].strip(), "en": parts[1].strip()})
                chapter_data[section] = entries
            else:
                chapter_data[section] = []

        output[chapter] = chapter_data

# Save to JSON
with open("chapters.json", "w", encoding="utf-8") as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print("Extraction complete! JSON saved as chapters.json")
