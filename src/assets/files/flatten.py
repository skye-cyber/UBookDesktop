import json
import re

BASE_FILE = "Combined_Structured_UB.json"
OUTPUT_FILE = "search_optimized_ubook.json"

# This regex finds paragraph numbers and splits the text using them
PARAGRAPH_PATTERN = re.compile(r'(?P<number>\d+:\d+\.\d+)\s+\(\d+\.\d+\)\s+')


def flatten():
    with open(BASE_FILE, 'r') as file:
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

                # Combine all text from section paragraphs
                full_text = "\n".join(
                    p["text"] for p in section["paragraphs"] if p.get("text"))

                # Find all paragraph starts
                matches = list(PARAGRAPH_PATTERN.finditer(full_text))

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

                paper_entry["sections"].append(section_entry)

            part_entry["papers"].append(paper_entry)

        output["parts"].append(part_entry)

    with open(OUTPUT_FILE, 'w') as f:
        json.dump(output, f, indent=2)

    print("✅ Paragraphs split and saved successfully.")


if __name__ == "__main__":
    flatten()
