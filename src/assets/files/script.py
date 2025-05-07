import json

def get_part_id(paper_number):
    if paper_number == 0:
        return 0  # Foreword
    elif 1 <= paper_number <= 31:
        return 1  # Central and Superuniverses
    elif 32 <= paper_number <= 56:
        return 2  # Local Universe
    elif 57 <= paper_number <= 119:
        return 3  # History of Urantia
    elif 120 <= paper_number <= 196:
        return 4  # Life and Teachings of Jesus
    return -1  # Not in range

# Load raw JSON
with open('/home/skye/Downloads/FirefoxDownloads/urantia.json') as f:
    raw_data = json.load(f)

# Define parts and paper ranges
parts = [
    {"id": 0, "title": "FOREWORD", "range": range(0, 1), "papers": []},
    {"id": 1, "title": "The Central and Superuniverses", "range": range(1, 32), "papers": []},
    {"id": 2, "title": "The Local Universe", "range": range(32, 57), "papers": []},
    {"id": 3, "title": "The History Of Urantia", "range": range(57, 120), "papers": []},
    {"id": 4, "title": "The Life and Teachings of Jesus", "range": range(120, 197), "papers": []},
]

# Helper: create paper if missing
def get_or_create_paper(part, paper_number):
    for paper in part["papers"]:
        if paper["paper_id"] == paper_number:
            return paper
    new_paper = {"paper_id": paper_number, "sections": []}
    part["papers"].append(new_paper)
    return new_paper

# Parse paragraphs
for paragraph in raw_data[0]['sections'][0]["paragraphs"]:
    paper_number = int(paragraph["paragraph_number"].split(":")[0])
    section_number = int(paragraph["paragraph_number"].split(":")[1].split(".")[0])
    part_id = get_part_id(paper_number)

    if part_id == -1:
        continue  # Skip unknown range

    part = parts[part_id]
    paper = get_or_create_paper(part, paper_number)

    # Find or create section
    section = next((s for s in paper["sections"] if s["section_number"] == section_number), None)
    if not section:
        section = {"section_number": section_number, "title": "", "paragraphs": []}
        paper["sections"].append(section)

    # Append paragraph
    section["paragraphs"].append({
        "paragraph_number": paragraph["paragraph_number"],
        "text": paragraph["text"]
    })

# Replace non-serializable range objects with start/stop values
for part in parts:
    part["range"] = [part["range"].start, part["range"].stop]

# Save structured file
with open('structured_urantia.json', 'w', encoding='utf-8') as f:
    json.dump({"parts": parts}, f, indent=2, ensure_ascii=False)

print("✅ Successfully structured and saved.")
