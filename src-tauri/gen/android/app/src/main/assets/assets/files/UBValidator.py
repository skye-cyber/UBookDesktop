import json


def foreword_sectionTitles_validator():
    # --- Load your raw paragraphs JSON ---
    with open('foreword_structured.json') as f:
        raw_data = json.load(f)

    print("\033[1mValidating \033[1;95mForeword\033[0m")
    print('-----------------------------------------')
    missing = []
    for paper in raw_data["parts"][0]["papers"]:
        for section in paper["sections"]:
            para = section["paragraphs"][0]
            para_id = para["paragraph_number"]
            paper_no = int(para_id.split(":")[0])
            section_no = int(para_id.split(":")[1].split(".")[0])

            if not (0 <= paper_no <= 1):
                continue

            paper = next(
                (p for p in raw_data['parts'][0]["papers"] if p["paper_id"] == paper_no), None)

            # --- Find section entry ---
            section_entry = next(
                (s for s in paper["sections"] if s["section_number"] == section_no), None)
            if section_entry and not section_entry['title']:
                print(
                    f"\033[1;31mMissing:\033[1;34m SN: {section_entry['section_number']}\033[1;93m {para_id}\033[0m")
                missing.append(f"{section_no}:{paper_no}")

    if not missing:
        print("\033[32mStatus Ok\033[0m")


def central_superuniverses_sectionTitles_validator():
    # --- Load your raw paragraphs JSON ---
    with open('central_superuniverses_structured.json') as f:
        raw_data = json.load(f)

    print("\033[1mValidating \033[1;95mCentral and Superuniverse\033[0m")
    print('-----------------------------------------')
    missing = []
    for paper in raw_data["parts"][0]["papers"]:
        for section in paper["sections"]:
            para = section["paragraphs"][0]
            para_id = para["paragraph_number"]
            paper_no = int(para_id.split(":")[0])
            section_no = int(para_id.split(":")[1].split(".")[0])

            if not (1 <= paper_no <= 32):
                continue

            paper = next(
                (p for p in raw_data['parts'][0]["papers"] if p["paper_id"] == paper_no), None)

            # --- Find section entry ---
            section_entry = next(
                (s for s in paper["sections"] if s["section_number"] == section_no), None)
            if section_entry and not section_entry['title']:
                print(
                    f"\033[1;31mMissing:\033[1;34m SN: {section_entry['section_number']}\033[1;93m {para_id}\033[0m")
                missing.append(f"{section_no}:{paper_no}")

    if not missing:
        print("\033[32mStatus Ok\033[0m")


def local_universe_sectionTitles_validator():
    # --- Load your raw paragraphs JSON ---
    with open('Local_Universe_structured.json') as f:
        raw_data = json.load(f)

        print("\033[1mValidating \033[1;95mLocal Universe\033[0m")
    print('-----------------------------------------')
    missing = []
    for paper in raw_data["parts"][0]["papers"]:
        for section in paper["sections"]:
            for para in section["paragraphs"]:
                para_id = para["paragraph_number"]
                paper_no = int(para_id.split(":")[0])
                section_no = int(para_id.split(":")[1].split(".")[0])

                if not (paper_no >= 32 and paper_no <= 57):
                    continue

                # print(len(section["paragraphs"]))

                paper = next(
                    (p for p in raw_data['parts'][0]["papers"] if p["paper_id"] == paper_no), None)

                # --- Find section entry ---
                section_entry = next(
                    (s for s in paper["sections"] if s["section_number"] == section_no), None)
                if section_entry and not section_entry['title']:
                    print(
                        f"\033[1;31mMissing:\033[1;34m SN: {section_entry['section_number']}\033[1;93m {para_id}\033[0m")
                    missing.append(f"{section_no}:{paper_no}")

    if not missing:
        print("\033[32mStatus Ok\033[0m")


def history_urantia_sectionTitles_validator():
    # --- Load your raw paragraphs JSON ---
    with open('History_of_Urantia_structured.json') as f:
        raw_data = json.load(f)

    print("\033[1mValidating \033[1;95mHistory Urantia\033[0m")
    print('-----------------------------------------')
    missing = []
    for paper in raw_data["parts"][0]["papers"]:
        for section in paper["sections"]:
            para = section["paragraphs"][0]
            para_id = para["paragraph_number"]
            paper_no = int(para_id.split(":")[0])
            section_no = int(para_id.split(":")[1].split(".")[0])

            if not (57 <= paper_no <= 120):
                continue

            paper = next(
                (p for p in raw_data['parts'][0]["papers"] if p["paper_id"] == paper_no), None)

            # --- Find section entry ---
            section_entry = next(
                (s for s in paper["sections"] if s["section_number"] == section_no), None)
            if section_entry and not section_entry['title']:
                print(
                    f"\033[1;31mMissing:\033[1;34m SN: {section_entry['section_number']}\033[1;93m {para_id}\033[0m")
                missing.append(f"{section_no}:{paper_no}")

    if not missing:
        print("\033[32mStatus Ok\033[0m")


def jesus_life_teachings_sectionTitles_validator():
    # --- Load your raw paragraphs JSON ---
    with open('Life_and_Teachings_of_Jesus_structured.json') as f:
        raw_data = json.load(f)

    print("\033[1mValidating \033[1;95mLife and Teachings of Jesus\033[0m")
    print('-----------------------------------------')
    missing = []
    for paper in raw_data["parts"][0]["papers"]:
        for section in paper["sections"]:
            para = section["paragraphs"][0]
            para_id = para["paragraph_number"]
            paper_no = int(para_id.split(":")[0])
            section_no = int(para_id.split(":")[1].split(".")[0])

            if not (120 <= paper_no <= 196):
                continue

            paper = next(
                (p for p in raw_data['parts'][0]["papers"] if p["paper_id"] == paper_no), None)

            # --- Find section entry ---
            section_entry = next(
                (s for s in paper["sections"] if s["section_number"] == section_no), None)
            if section_entry and not section_entry['title']:
                print(
                    f"\033[1;31mMissing:\033[1;34m] SN: {section_entry['section_number']}\033[1;93m {para_id}\033[0m")
                missing.append(f"{section_no}:{paper_no}")

    if not missing:
        print("\033[32mStatus Ok\033[0m")


if __name__ == "__main__":
    foreword_sectionTitles_validator()
    central_superuniverses_sectionTitles_validator()
    local_universe_sectionTitles_validator()
    history_urantia_sectionTitles_validator()
    jesus_life_teachings_sectionTitles_validator()
