import json
import re

BASE_FILE = "foreword_structured.json"
OUTPUT_FILE = "FN-foreword_structured.json"

# Regex pattern to find paragraph numbers like 1:2.1 or 4:5.3 followed optionally by markers like (23.4)
PARAGRAPH_PATTERN = re.compile(
    r'(?P<number>\d+:\d+\.\d+)(?:\s+\(\d+\.\d+\))?\s+'
)


def flatten():
    with open(BASE_FILE, 'r', encoding='utf-8') as file:
        data = json.load(file)

    output = {"parts": []}

    for part in data["parts"]:
        part_entry = {
            "id": part["id"],
            "title": part["title"],
            "range": part["range"],
            "papers": []
        }

        for paper in part["papers"]:
            paper_entry = {
                "paper_id": paper["paper_id"],
                "title": paper["title"],
                "sections": []
            }

            for section in paper["sections"]:
                section_entry = {
                    "section_number": section["section_number"],
                    "title": section["title"],
                    "paragraphs": []
                }

                # ✅ Step 1: Prepend original paragraph numbers to their texts
                pre_texts = [
                    f"{p['paragraph_number']} {p['text']}"
                    for p in section["paragraphs"]
                    if p.get("text")
                ]
                full_text = "\n".join(pre_texts)

                # ✅ Step 2: Use regex to split paragraphs reliably
                matches = list(PARAGRAPH_PATTERN.finditer(full_text))

                if matches:
                    for i in range(len(matches)):
                        para_number = matches[i].group("number")
                        start = matches[i].end()
                        end = matches[i + 1].start() if i + \
                            1 < len(matches) else len(full_text)
                        para_text = full_text[start:end].strip()

                        section_entry["paragraphs"].append({
                            "paragraph_number": para_number,
                            "text": para_text
                        })
                else:
                    # Fallback: no recognizable paragraph markers
                    print(
                        f"[⚠️ NO MATCH] Section {section['section_number']} - '{section['title']}'")
                    if full_text.strip():
                        section_entry["paragraphs"].append({
                            "paragraph_number": f"{paper['paper_id']}:{section['section_number']}.1",
                            "text": full_text.strip()
                        })

                paper_entry["sections"].append(section_entry)

            part_entry["papers"].append(paper_entry)

        output["parts"].append(part_entry)

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print("✅ Paragraphs split and saved successfully.")


if __name__ == "__main__":
    flatten()
