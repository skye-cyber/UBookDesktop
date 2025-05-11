import json


def central_superuniverses():
    # --- Section Titles Mapping for Papers 1–31 ---
    central_superuniverses_titles = {
        1: [
            "The Universal Father",
            "The Father's Name",
            "The Reality of God",
            "God is a Universal Spirit",
            "The Mystery of God",
            "Personality of the Universal Father",
            "Personality in the Universe",
            "Spiritual Value of the Personality Concept"
        ],
        2: [
            "The Nature of God",
            "The Infinity of God",
            "The Father's Eternal Perfection",
            "Justice and Righteousness",
            "The Divine Mercy",
            "The Love of God",
            "The Goodness of God",
            "Divin Truth and Beauty"
        ],
        3: [
            "The Attributes of God",
            "God's Everywhereness",
            "God's Infinite Power",
            "God's Universal Knowledge",
            "God's Limitlessness",
            "The Father's Supreme Rule",
            "The Father's Primacy"
        ],
        4: [
            "God's Relation to the Universe",
            "The Universe Attitude of the Father",
            "God and Nature",
            "God's Unchanging Character",
            "The Realization of God",
            "Erroneous Ideas of God"
        ],
        5: [
            "God's Relation to the Individual",
            "The Approach to God",
            "The Presence of God",
            "True Worship",
            "God in Religion",
            "The Consciousness of God",
            "The God of Personality"
        ],
        6: [
            "The Eternal Son",
            "Identity of the Eternal Son",
            "Nature of the Eternal Son",
            "Ministry of the Father's Love",
            "Attributes of the Eternal Son",
            "Limitations of the Eternal Son",
            "The Spirit Mindedness of the Eternal Son",
            "Personality of the Eternal Son",
            "Realization of the Eternal Son"
        ],
        7: [
            "Relation of the Eternal Son to the Universe",
            "The Spirit-Gravity Circuit",
            "The Administration of the Eternal Son",
            "Relation of the Eternal Son to the Individual",
            "The Divine Perfection Plans",
            "The Spirit of Bestowal",
            "The Paradise Sons of God",
            "The Supreme Revelation of the Father"
        ],
        8: [
            "The Infinite Spirit",
            "The God of Action",
            "Nature of the Infinite Spirit",
            "Relation of the Spirit to the Father and the Son",
            "The Spirit of Divine Ministry",
            "The Presence of God",
            "Personality of the Infinite Spirit"
        ],
        9: [
            "Relation of the Infinite Spirit to the Universe",
            "Attributes of the Third Source and Center",
            "The Omnipresent Spirit",
            "The Universal Manipulator",
            "The Absolute Mind",
            "The Ministry of Mind",
            "The Mind-Gravity Circuit",
            "Universe Reflectivity",
            "Personalities of the Infinite Spirit"
        ],
        10: [
            "The Paradise Trinity",
            "Self-Distribution of the First Source and Center",
            "Deity Personalization",
            "The Three Persons of Deity",
            "The Functions of Deity",
            "The Triunity of Deity",
            "The Stationary Sons of the Trinity",
            "The Overcontrol of Supremacy",
            "The Trinity Beyond the Finite"
        ],
        11: [
            "The Eternal Isle of Paradise",
            "The Divine Residence",
            "Nature of the Eternal Isle",
            "Upper Paradise",
            "Peripheral Paradise",
            "Nether Paradise",
            "Space Respiration",
            "Space Functions of Paradise",
            "The Paradise Gravity",
            "The Uniqueness of Paradise"
        ],
        12: [
            "The Universe of Universes",
            "Space Levels of the Master Universe",
            "The Domains of the Unqualified Absolute",
            "Universal Gravity",
            "Space and Motion",
            "Space and Time",
            "Universal Overcontrol",
            "The Part and the Whole",
            "Matter, Mind, and Spirit",
            "Personality Realities"
        ],
        13: [
            "The Sacred Spheres of Paradise",
            "The Seven Sacred Worlds of the Father",
            "Father-World Relationships",
            "The Sacred Worlds of the Eternal Son",
            "The Worlds of the Infinite Spirit"
        ],
        14: [
            "The Central and Divine Universe",
            "The Paradise-Havona System",
            "Constitution of Havona",
            "The Havona Worlds",
            "Creatures of the Central Universe",
            "Life in Havona",
            "The Purpose of the Central Universe"
        ],
        15: [
            "The Seven Superuniverses",
            "The Superuniverse Space Level",
            "Organization of the Superuniverses",
            "The Superuniverse of Orvonton",
            "Nebulae—The Ancestors of Universes",
            "The Origin of Space Bodies",
            "The Spheres of Space",
            "The Architectural Spheres",
            "Energy Control and Regulation",
            "Circuits of the Superuniverses",
            "Rulers of the Superuniverses",
            "The Deliberative Assemblies",
            "The Supreme Tribunals",
            "The Sector Governments",
            "Purposes of the Seven Superuniverses"
        ],
        16: [
            "The Seven Master Spirits",
            "Relation to Triodity Deity",
            "Relation to the Supreme Being",
            "Identity and Diversity of the Master Spirits",
            "Attributes and Functions of the Master Spirits",
            "Relation to Creatures",
            "The Cosmic Mind",
            "Morals, Virtue, and Personality",
            "Urantia Personality",
            "Reality of Human Consciousness"
        ],
        17: [
            "The Seven Supreme Spirit Groups",
            "The Seven Supreme Executives",
            "Majeston - Chief Reflectivity",
            "The Reflective Spirits",
            "The Reflective Image Aids",
            "The Seven Spirits of the Circuit",
            "The Local Universe Creative Spirits",
            "The Adjutant Mind Spirits",
            "Functions of the Supreme Spirits"
        ],
        18: [
            "The Supreme Trinity Personalities",
            "The Trinity-Origin Beings",
            "The Eternals of Days",
            "The Ancients of Days",
            "The Perfections of Days",
            "The Recents of Days",
            "The Unions of Days",
            "The Faithfuls of Days",
            "The Trinity Teacher Sons",
            "The Celestial Guardians",
            "High Commissioners"
        ],
        19: [
            "The Co-ordinate Trinity-Origin Beings",
            "The Trinity Teacher Sons",
            "The Perfectors of Wisdom",
            "The Divine Counselors",
            "The Universal Censors",
            "Inspired Trinity Spirits",
            "Havona Servitals",
            "The Paradise Companions",
            "The Son-Spirit Aids",
            "Technique of Trinity Personalization"
        ],
        20: [
            "The Paradise Sons of God",
            "The Descending Sons of God",
            "The Magisterial Sons",
            "Judicial Actions",
            "Magisterial Missions",
            "Bestowal of Paradise Sons of God",
            "The Mortal-Bestowal Carrers",
            "The Trinity Teacher Sons' Ministry to the Superuniverses",
            "Local Universe Ministry of the Dynals",
            "Planetery Service of the Daynals",
            "The United Ministry of Paradise Sons"
        ],
        21: [
            "The Paradise Creator Sons",
            "Origin and Nature of Creator Sons",
            "The Creators of Local Universes",
            "Local Universe Sovereignty",
            "The Michael Bestowals",
            "Relation of Master Sons to the Universe",
            "Destiny of the Master Michaels"
        ],
        22: [
            "The Trinitized Sons of God",
            "The Trinity-Embraced Sons",
            "The Mighty Messagers",
            "Those High in Authority",
            "Those Without Name and Number",
            "The Trinitized Custodians",
            "The Trinitized Ambassadors",
            "Technique of Trinitization",
            "The Creature-Trinitized Sons",
            "The Celestial Guardians",
            "High Son Assistants"
        ],
        23: [
            "The Solitary Messengers",
            "Nature and Origin of Solitary Messagers",
            "Assignments and Functions of Solitary Messagers",
            "Time and Space Service of Solitary Messagers",
            "Special Ministry of Solitary Messagers"
        ],
        24: [
            "Higher Personalities of the Infinite Spirit",
            "The Universe Circuit Supervisors",
            "The Census Directors",
            "Personal Aids of Infinite Spirit",
            "The Associate Inspectors",
            "The Assigned Sentinels",
            "The Graduate Guides",
            "Origin of the Graduate Guides"
        ],
        25: [
            "The Messenger Hosts of Space",
            "The Havona Servitals",
            "The Universal Conciliators",
            "The Far-Reaching Service of Conciliators",
            "The Technical Advisers",
            "The Custodians of Records on Paradise",
            "The Celestial Recorders",
            "The Morontia Companions",
            "The Paradise Companions"
        ],
        26: [
            "Ministering Spirits of the Central Universe",
            "The Ministering Spirits",
            "The Mighty Supernaphim",
            "The Tertiary Supernaphim",
            "The Secondary Supernaphim",
            "The Pilgrim Helpers",
            "The Supremacy Guides",
            "The Trinity Guides",
            "The Son Finders",
            "The Father Guides",
            "The Counselors and Advisers",
            "The Complement of Rest"
        ],
        27: [
            "Ministry of the Primary Supernaphim",
            "Instigators of Rest",
            "Chiefs of Assignment",
            "Interpreters of Ethics",
            "Directors of Conduct",
            "Custodians of Knowledge",
            "Masters of Philosophy",
            "The Conductors of Worship"
        ],
        28: [
            "Ministering Spirits of the Superuniverses",
            "The Tertiaphim",
            "The Omniaphim",
            "The Seconaphim",
            "The Primary Seconaphim",
            "The Secondary Seconaphim",
            "The Tertiary Seconaphim",
            "Ministering of the Seconaphim"
        ],
        29: [
            "The Universe Power Directors",
            "The Seven Supreme Power Directors",
            "The Supreme Power Centers",
            "The Domain of Power Centers",
            "The Master Physical Controller",
            "The Master Force Organizers"
        ],
        30: [
            "Personalities of the Grand Universe",
            "The Paradise Classification of Living Beings",
            "The Universe Personality Register",
            "The Courtesy Colonies",
            "The Ascending Mortals"
        ],
        31: [
            "The Corps of Mortal Finaliters",
            "The Havona Natives",
            'Gravity Messengers',
            "The Glorified Mortals",
            "Adopted Seraphim",
            "Glorified Material Sons",
            "Glorified Midway Creatures",
            "The Evangels of Light",
            "The Transcendentalers",
            "The Architects of the Master Universe",
            "The Ultimate Adventure"
        ]
    }

    # --- Load your raw paragraphs JSON ---
    with open('structured_urantia.json') as f:
        raw_data = json.load(f)

    # Initialize output structure for part 1
    structured = {
        "parts": [
            {
                "id": 1,
                "title": "The Central and Superuniverses",
                "range": [1, 32],
                "papers": []
            }
        ]
    }

    # Access part 1 from structured input
    central_part = structured["parts"][0]

    # Loop through all paragraphs in part 1 only (papers 1-31)
    # Paper 31 is last of part 1
    for paper in raw_data["parts"][1]["papers"]:
        for section in paper["sections"]:
            for para in section["paragraphs"]:
                para_id = para["paragraph_number"]
                paper_no = int(para_id.split(":")[0])
                section_no = int(para_id.split(":")[1].split(".")[0])

                if not (1 <= paper_no <= 31):
                    continue

                # --- Find or create paper entry ---
                paper = next(
                    (p for p in central_part["papers"] if p["paper_id"] == paper_no), None)
                if not paper:
                    title_list = central_superuniverses_titles.get(paper_no, [
                                                                   ""])
                    paper = {
                        "paper_id": paper_no,
                        "title": title_list[0] if title_list else "",
                        "sections": []
                    }
                    central_part["papers"].append(paper)

                # --- Find or create section entry ---
                section_entry = next(
                    (s for s in paper["sections"] if s["section_number"] == section_no), None)
                if not section_entry:
                    title_list = central_superuniverses_titles.get(
                        paper_no, [])
                    section_title = title_list[section_no] if section_no < len(
                        title_list) else ""
                    section_entry = {
                        "section_number": section_no,
                        "title": section_title,
                        "paragraphs": []
                    }
                    paper["sections"].append(section_entry)

                # --- Append paragraph ---
                section_entry["paragraphs"].append({
                    "paragraph_number": para_id,
                    "text": para["text"]
                })

    # --- Output the structured file for part 1 only ---
    with open('central_superuniverses_structured.json', 'w') as f:
        json.dump(structured, f, indent=2)

    print("Central and Superuniverse done ✅")


def local_universe():
    # --- Section Titles Mapping for Papers 1–31 ---
    local_universe_titles = {
        32: [
            "The Evolution of the Local Universe",
            "Physical Emergence of Universes",
            "Universe Organization",
            "The Evolutionary Idea",
            "God's Relation to the Local Universe",
            "The Eternal and Divine Purpose"
        ],
        33: [
            "Administration of the Local Universe",
            "Michael of Nebadon",
            "The Sovereign of Nebadon",
            "The Universe Son and Spirit",
            "Gabriel—Chief Executive",
            "The Trinity Ambassadors",
            "General Administration",
            "The Courts of Nebadon",
            "The Legislative and Executive Functions",
        ],
        34: [
            "The Local Universe Mother Spirit",
            "Personalization of the Creative Spirit",
            "Nature of The Divine Minister",
            "The Son and Spirit in Time and Space",
            "The Local Universe Circuits",
            "The Ministry of the Spirit",
            "The Spirit in Man",
            "The Spirit and the Flesh"
        ],
        35: [
            "The Local Universe sons of God",
            "The Father Melchizedek",
            "The Melchizedek Sons",
            "The Melchizedek Worlds",
            "Special Work of the Melchizedeks",
            "The Vorondadek Sons",
            "The Constellation Fathers",
            "The Vorondadek Worlds",
            "The Lanonandek Sons",
            "The Lanonandek Rulers",
            "The Lononandek Worlds",
        ],
        36: [
            "The Life Carriers",
            "Origin and Nature of Life Carriers",
            "The Life Carrier Worlds",
            "Life Transplantation",
            "The Melchizedek Life Carriers",
            "The Seven Adjutant Mind-Spirits",
            "Living Forces"
        ],
        37: [
            "Personalities of the Local Universe",
            "The Universe Aids",
            "The Brilliant Evening Stars",
            "The Archangels",
            "Most High Assistants",
            "The High Commissioners",
            "Celestial Overseers",
            "Mansion World Teachers",
            "Higher Spirit Orders of Assignment",
            "Permanent Citizens of the Local Universe",
            "Other Local Universe Groups"
        ],
        38: [
            "Ministering Spirits of the Local Universe",
            "Origin of Seraphim",
            "Angelic Natures",
            "Unrevealed Angels",
            "The Seraphic Worlds",
            "Seraphic Training",
            "Seraphic Organization",
            "Cherubim and Sanobim",
            "Evolution of Cherubim and Sanobim",
            "The Midway Creatures"
        ],
        39: [
            "The Seraphic Hosts",
            "The Supreme Seraphim",
            "The Superior Seraphim",
            "The Supervisor Seraphim",
            "Administrator Seraphim",
            "Planetary Helpers",
            "Transition Ministers",
            "Seraphim of the Future",
            "Seraphic Destiny",
            "The Corps of Seraphic Completion"
        ],
        40: [
            "The Ascending Mortals",
            "Evolutionary Seraphim",
            "Ascending Material Sons",
            "Translated Midwayers",
            "Personalized Adjusters",
            "Mortals of Time and Space",
            "The Faith Sons of God",
            "Father-Fused Mortals",
            "Son-Fused Mortals",
            "Spirit-Fused Mortals",
            "Ascendant Destinies"
        ],
        41: [
            "Physical Aspects of the Local Universe",
            "The Nebadon Power Centers",
            "The Satania Physical Controllers",
            "Our Stationary Associates",
            "Sun Density",
            "Solar Radiation",
            "Calcium - the Wanderer of Space",
            "Sources of Solar Energy",
            "Solar-Energy-Reactions",
            "Sun Stability",
            "Origin of Inhibited Worlds"
        ],
        42: [
            "Energy - Mind and Matter",
            "Paradise Forces and Energies",
            "Universal Nonspiritual Energy Systems (Physical Energies)",
            "Classification of Matter",
            "Energy and Matter Transmutations",
            "Wave-Energy Manifestations",
            "Ultimatons, Electrons, and Atoms",
            "Atomic Matter",
            "Atomic Cohesion",
            "Natural Philosophy",
            "Universal Nonspiritual Energy Systems (Material Mind Systems)",
            "Universe Mechanisms",
            "Pattern and Form - Mind Dominance"
        ],
        43: [
            "The Constellations",
            "The Constellation Headquarters",
            "The Constellation Government",
            "The Most Highs of Norlatiadek",
            "Mount Assembly - The Faithful of Days",
            "The Edentia Fathers Since the Lucifer Rebellion",
            "The Gardens of God",
            "The Univitatia",
            "The Edentia Training Worlds",
            "Citizenship of Edentia",
        ],
        44: [
            "The Celestial Artisans",
            "The Celestial Musicians",
            "The Heavenly Reproducers",
            "The Divine Builders",
            "The Thought Recorders",
            "The Energy Manipulators",
            "The Designers and Embellishers",
            "The Harmony Workers",
            "Mortal Aspirations and Morontia Achievements"
        ],
        45: [
            "The Local System Administration",
            "Transitional Cultural Worlds",
            "The System Sovereign",
            "The System Government",
            "The Four and Twenty Counselors",
            "Material Sons",
            "Adamic Training of Ascenders",
            "The Melchizedek Schools",
        ],
        46: [
            "The Local System Capital(Headquarters)",
            "The Physical Aspects of Jerusem",
            "The Physical Features of Jerusem",
            "The Jerusem Broadcasts",
            "The Residential and Administrative Areas",
            "The Jerusem Circles",
            "The Executive Administrative Squares",
            "The Rectangles - The Spornagia",
            "The Jerusem Triangles"
        ],
        47: [
            "The Seven Mansion Worlds",
            "The Finaliters' Worlds",
            "The Probationary Nursery",
            "The First Mansion World",
            "The Second Mansion World",
            "The Third Mansion World",
            "The Fourth Mansion World",
            "The Fifth Mansion World",
            "The Sixth Mansion World",
            "The Seventh Mansion World",
            "Jerusem Citizenship"
        ],
        48: [
            "The Morontia Life",
            "Morontia Materials",
            "Morontia Power Supervisors",
            "Morontia Companions",
            "The Reversion Directors",
            "The Mansion World Teachers",
            "Morontia World Seraphim - Transition Ministers",
            "Morontia Mota",
            "Morontia Progressors"
        ],
        49: [
            "The Inhibited Worlds",
            "Planetary Life",
            "Planetary Physical Types",
            "Worlds of the Nonbreathers",
            "Evolutionary Will Creatures",
            "The Planetary Series of Mortals",
            "Terrestrial Escape"
        ],
        50: [
            "The Planetary Princes",
            "Mission of the Princes",
            "The Planetary Administration",
            "The Planetary Prince's Corporeal Staff",
            "The Planetary Headquarters and Schools",
            "Progressive Civilization",
            "Planetary Culture",
            "The Rewards of Isolation"
        ],
        51: [
            "The Planetary Adams",
            "The Origin and Nature of the Material Sons of God",
            "Transit of the Planetary Adams",
            "The Planetary Adams",
            "The Adamic Mission",
            "The Six Evolutionary Races",
            "Racia Almagamation - Bestowal of the Adamic Blood",
            "The Edenic Regime",
            "United Administration",
        ],
        52: [
            "The Planetary Mortal Epochs",
            "Primitive Man",
            "Post-Planetary Prince Man",
            "Post-Adamic Man",
            "The Post-Magisterial Son Age",
            "The Post-Bestowal Son Age",
            "Urantia's Post-Bestowal Age",
            "Post-Teacher Son Man"
        ],
        53: [
            "The Lucifer Rebellion",
            "The Leaders of Rebellion",
            "The Causes of Rebelion",
            "The Lucifer Manifesto",
            "The Outbreak of Rebellion",
            "Nature of the Conflict",
            "A Loyal Seraphic Commander",
            "History of the Rebellion",
            "The Son of Man On Urantia",
            "Present Status of the Rebellion"
        ],
        54: [
            "Problems of the Lucifer Rebellion",
            "True and False Liberty",
            "The Theft of Liberty",
            "The Time Lag of Justice",
            "The Mercy Time Lag",
            "The Wisdom of Delay",
            "The Triumph of Love"
        ],
        55: [
            "The Spheres of Light and Life",
            "The Morontia Temple",
            "Death and Translation",
            "The Golden Ages",
            "The Administrative and Readjustements",
            "The Acme of Material Development",
            "The Individual Mortal",
            "The First of Planetery Stage",
            "The Second or System Stage",
            "The Third and Constellation Stage",
            "The Fourth and Local Universe Stage",
            "The Minor and Major  Sector Stages",
            "The Seventh or Superuniverse Stage"
        ],
        56: [
            "Universe Reality",
            "Physical Co-ordination",
            "Intellectual Unity",
            "Spiritual Unification",
            "Personality Unification",
            "Diety Unity",
            "Unification of Evolutionary Diety",
            "Universal Evolutionary Repercussions",
            "The Supreme Unifier",
            "The Universal Absolute Unity",
            "Truth, Beauty, and Goodness"
        ]
    }

    # --- Load your raw paragraphs JSON ---
    with open('structured_urantia.json') as f:
        raw_data = json.load(f)

    # Initialize output structure for part 1
    structured = {
        "parts": [
            {
                "id": 2,
                "title": "The Local Universe",
                "range": [32, 57],
                "papers": []
            }
        ]
    }

    # Access part 1 from structured input
    local_part = structured["parts"][0]

    # Loop through all paragraphs in part 1 only (papers 1-31)
    # Paper 31 is last of part 1
    for paper in raw_data["parts"][2]["papers"]:
        for section in paper["sections"]:
            for para in section["paragraphs"]:
                para_id = para["paragraph_number"]
                paper_no = int(para_id.split(":")[0])
                section_no = int(para_id.split(":")[1].split(".")[0])

                if not (32 <= paper_no <= 57):
                    continue

                # --- Find or create paper entry ---
                paper = next(
                    (p for p in local_part["papers"] if p["paper_id"] == paper_no), None)
                if not paper:
                    title_list = local_universe_titles.get(paper_no, [""])
                    paper = {
                        "paper_id": paper_no,
                        "title": title_list[0] if title_list else "",
                        "sections": []
                    }
                    local_part["papers"].append(paper)

                # --- Find or create section entry ---
                section_entry = next(
                    (s for s in paper["sections"] if s["section_number"] == section_no), None)
                if not section_entry:
                    title_list = local_universe_titles.get(paper_no, [])
                    section_title = title_list[section_no] if section_no < len(
                        title_list) else ""
                    section_entry = {
                        "section_number": section_no,
                        "title": section_title,
                        "paragraphs": []
                    }
                    paper["sections"].append(section_entry)

                # --- Append paragraph ---
                section_entry["paragraphs"].append({
                    "paragraph_number": para_id,
                    "text": para["text"]
                })

    # --- Output the structured file for part 1 only ---
    with open('Local_Universe_structured.json', 'w') as f:
        json.dump(structured, f, indent=2)

    print("Local Universe done ✅")


def history_urantia():
    # --- Section Titles Mapping for Papers 1–31 ---
    history_of_urantia_titles = {
        57: [
            "The Origin of Urantia",
            "The Andronover Nebula",
            "The Primary Nebular Stage",
            "The Secondary Nebular Stage",
            "Tertiary and Quartan Stages",
            "Origin of Monmatia—The Urantia Solar System",
            "The Solar System Stage",
            "The Meteoric Era",
            "The Crustal Stabilization"
        ],
        58: [
            "Life Establishment on Urantia",
            "Physical-Life Prerequisites",
            "The Urantia Atmosphere",
            "Spatial Environment",
            "The Life-Dawn Era",
            "The Continental Drift",
            "The Transition Period",
            "The Geologic History Book"
        ],
        59: [
            "Early Marine-Life Era on Urantia",
            "Eraly Marine Life in the Shallow Seas",
            "The First Continental Flood Stage",
            "The Second Great Flood Stage",
            "The Great Land-Emergence Stage",
            "The Crustal-shifting Stage",
            "The Climatic Transition Stage"
        ],
        60: [
            "Urantia During the Early Land-Life Era",
            "The Early Reptile Age",
            "The Later Reptilian Age",
            "The Cretaceous Stage",
            "The End of the Chalk Period",
        ],
        61: [
            "The Mammalian Era on Urantia",
            "The New Continental Land Stage",
            "The Recent Flood Stage",
            "The Modern Mountain Stage",
            "The Recent Continental-Elevation Stage",
            "The Early Ice Age",
            "Primitive Man in the Ice Age",
            "The Continuing Ice Age"
        ],
        62: [
            "The Dawn of Races of Early Man",
            "The Early Lemur Types",
            "The Dawn Mammals",
            "The Mid-Mammals",
            "The Primates",
            "The First Human Beings",
            "Evolution of the Human Mind",
            "Recognition as an Inhibited World"
        ],
        63: [
            "The First Human Family",
            "Andon and Fonta",
            "The Flight of the Twins",
            "Andon's Family",
            "Andonic Clans",
            "The Andonic Dispersion",
            "Onagar - The First Truth Teacher",
            "The Survival of Andon and Fonta"
        ],
        64: [
            "Evolutionary Races of Color",
            "The Andonic Aborigines",
            "The Foxhall Peoples",
            "The Badonan Tribes",
            "The Neanderthal Races",
            "Origin of the Colored Races",
            "The six Sangik Races of Urantia",
            "Dispersion of the Colored Races"
        ],
        65: [
            "The Overcontrol of Evolution",
            "Life Carrier Functions",
            "The Evolutionary Panorama",
            "The Urantia Adventure",
            "The Evolutionary Mind",
            "Life Evolution Vicissitudes",
            "Evolutionary Techniques of Life",
            "Evolutionary Mind Levels",
            "Evolution in Time and Space"
        ],
        66: [
            "The Planetary Prince or Urantia",
            "Prince Caligastia",
            "The Prince’s Staff",
            "The Prince’s Headquarters (Dalamatia)",
            "Early Days of the One Hundred",
            "Organization of the One Hundred",
            "The Prince’s Reign",
            "Life in Dalamatia",
            "Misfortunes of Caligatia"
        ],
        67: [
            "The Planetary Rebellion",
            "The Caligastia Betrayal",
            "The Outbreak of Rebellion",
            "The Seven Crucial Years",
            "The Caligastia One Hundred after Rebellion",
            "Immediate Results of Rebellion",
            "Van—The Steadfast",
            "Remote Repercussions of Sin",
            "The Human Hero of the Rebellion"
        ],
        68: [
            "The Dawn of Civilization",
            "Protective Socialization",
            "Factors in Social Progression",
            "Socializing Influence of Ghost Fear",
            "Evolution of the Mores",
            "Land Techniques—Maintenance Arts",
            "Evolution of Culture"
        ],
        69: [
            "Primitive Human Institutions",
            "Basic Human Institutions",
            "The Dawn of Industry",
            "The Specialization of Labor",
            "The Beginnings of Trade",
            "The Beginnings of Capital",
            "Fire in Relation to Civilization",
            "The Utilization of Animals",
            "Slavery as a Factor in Civilization",
            "Private Property"
        ],
        70: [
            "The Evolution of Human Government",
            "The Genesis of War",
            "The Social Value of War",
            "Early Human Associations",
            "Clans and Tribes",
            "The Beginnings of Government",
            "Monarchial Government",
            "Primitive Clubs and Secret Societies",
            "Social Classes",
            "Human Rights",
            "Evolution of Justice",
            "Laws and Courts",
            "Allocation of Civil Authority"
        ],
        71: [
            "Development of the State",
            "The Cradle of Civilization - Embryonic State",
            "The Evolution of the State(Representative Government)",
            "The Ideals of Statehood",
            "Progressive Civilization",
            "The Evolution of Competition",
            "The Profit Motive",
            "Education",
            "The Character of Statehood",
        ],
        72: [
            "Government on Neighboring Planet",
            "The Continental Nation",
            "Political Organization",
            "The Home Life",
            "The Educational System",
            "Industrial Organization",
            "Old Age Insurance",
            "Taxation",
            "The Special Colleges",
            "The Plan of Universal Suffrage",
            "Dealing With Crime",
            "Military Preparedness",
            "The Other Nations"
        ],
        73: [
            "The Garden of Eden",
            "The Nodites and the Amandonites",
            "Planning for the Garden",
            "The Garden Site",
            "Establishing the Garden",
            "The Garden Home",
            "The Tree of Life",
            "The Fate of Eden"
        ],
        74: [
            "Adam and Eve",
            "Adam and Eve on Jerusem",
            "Arrival of Adam and Eve",
            "Adam and Eve Learn About the Planet",
            "The First Upheaval",
            "Adam's Administration",
            "Home Life of Adam and Eve",
            "Life in the Garden",
            "The Legend of Creation",
        ],
        75: [
            "The Default of Adam and Eve",
            "The Urantia Problem",
            "Caligastia's Plot",
            "The Temptation of Eve",
            "The Realization of Default",
            "Repercussions of Default",
            "Adam and Eve Leave the Garden",
            "Degradation of Adam and Eve",
            "The So-Called Fall of Man",
        ],
        76: [
            "The Second Garden",
            "The Edenites Enter Mesopotamia",
            "Cain and Abel",
            "Life in Mesopotamia",
            "The Violet Race",
            "Death of Adam and Eve",
            "Survival of Adam and Eve"
        ],
        77: [
            "The Midway Creatures",
            "The Primary Midwayers",
            "The Nodite Race",
            "The Tower of Babel",
            "Nodite Centers of Civilization",
            "Adamson and Ratta",
            "The Secondary Midwayers",
            "The Rebel Midwayers",
            "The United Midwayers",
            "The permanent Citizens of Urantia"
        ],
        78: [
            "The Violet Race After the Days of Adam",
            "Racial and Cultural Distribution",
            "The Adamites in the Second Garden",
            "Early Expansions of the Adamites",
            "Andites",
            "The Andite Migrations",
            "The Last Andite Dispersion",
            "The Floods in Mesopotamia",
            "The Sumerians -- The Last of Andites"
        ],
        79: [
            "Andite Expansion in the Orient",
            "The Andites of Turkestan",
            "The Andite Conquest of India",
            "Dravidian India",
            "The Aryan Inversion of India",
            "Red Man and Yellow Man",
            "Dawn of Chines Civilization",
            "The Andites Enter China",
            "Later Chines Civilization"
        ],
        80: [
            "Andite Expansion in the Occident",
            "The Adamite Enter Europe",
            "Climatic and Geologic Changes",
            "The Cro-Magnoid Blue Man",
            "The Andite Invasion of Europe",
            "The Andite Conquest of the Northern Europe",
            "The Andites Along the Nile",
            "The Andite of The Mediterranian Isle",
            "The Danubian Andonites",
            "The three White Races"
        ],
        81: [
            "Development of Modern Civilization",
            "The Cradle of Civilization",
            "The Tools of Civilization",
            "Cities, Manufacture, and Commerce",
            "The Mixed Races",
            "Cultural Society",
            "The Maintenance of Civilization"

        ],
        82: [
            "The Evolution of Marriage",
            "The Mating Instinct",
            "Restrictive Taboos",
            "Early Marriage Mores",
            "Marriage Under the Property Mores",
            "Endogamy and Exogamy",
            "Racial Mixtures"

        ],
        83: [
            "The Marriage Institution",
            "Marriage as a Societal Institution",
            "Courtship and Betrothal",
            "Purchase and Dowry",
            "The Wedding Ceremony",
            "Plural Marriages",
            "True Monogamy - Pair Marriage",
            "The Dissolution of Wedlock",
            "The Idealization of Marriage"

        ],
        84: [
            "Marriage and Family Life",
            "Primitive Pair Associations",
            "The Early Mother Family",
            "The Family under Father Dominance",
            "Woman under the Developing Mores",
            "Woman under the Later Mores",
            "The Partnership of Man and Woman",
            "The Ideals of Family Life",
            "Dangers of Self-Gratification"
        ],
        85: [
            "The Origins of Worship",
            "Worship of Stones and Hills",
            "Worship of Plants and Trees",
            "The Worship of Animals",
            "Worship of the Elements",
            "Worship of the Heavenly Bodies",
            "Worship of Man",
            "The Adjutants of Worship and Wisdom"
        ],
        86: [
            "Early Evolution of Religion",
            "Chance: Good Luck and Bad Luck",
            "The Personification of Chance",
            "Death—The Inexplicable",
            "The Death-Survival Concept",
            "The Ghost-Soul Concept",
            "The Ghost-Spirit Environment",
            "The Function of Primitive Religion"

        ],
        87: [
            "The Ghost Cults",
            "The Ghost-Fear Concept",
            "Ghost Placation",
            "Ancestor Worship",
            "Good and Bad Spirit Ghosts",
            "The Advancing Ghost Cult",
            "Coercion and Exorcism",
            "Nature of Cultism"
        ],
        88: [
            "Fetishes, Charms, and Magic",
            "Believe In Fetishes",
            "Evolution of The Fetish",
            "Totemism",
            "Magic",
            "Magical Charms",
            "The Practise of Magic"
        ],
        89: [
            "Sin, Sacrifice, and Atonement",
            "The Taboo",
            "The Concept of Sin",
            "Renunciation and Humiliation",
            "Origins of Sacrifice",
            "Sacrifices and Canibalism",
            "Evolution of Human Sacrifice",
            "Modification of Human Sacrifice",
            "Redemption of Covenants",
            "Sacrifices and Sacraments",
            "Forgiveness of Sin"
        ],
        90: [
            "Shamanism — Medicine Men and Priests",
            "The First Shamans - The Medicine Men",
            "Shamanistic Practices",
            "The Shemanic Theory of Disease and Death",
            "Medicines Under the Shamans",
            "Priests and Rituals"
        ],
        91: [
            "The Evolution of Prayer",
            "Primitive Prayer",
            "Evolving Prayer",
            "Prayer and the Alter Ego",
            "Ethical Praying",
            "Social Repercussions of Prayer",
            "The Province of Prayer",
            "Mysticism, Ecstasy, and Inspiration",
            "Praying as a Personal Experience",
            "Conditions of Effective Prayer"
        ],
        92: [
            "The Later Evolution of Religion",
            "The Evolutionary Nature of Religion",
            "Religion and the Mores",
            "The Nature of Evolutionary Religion",
            "The Gift of Revelation",
            "The Great Religious Leaders",
            "The Composite Religions",
            "The Further Evolution of Religion"
        ],
        93: [
            "Machiventa Melchizedek",
            "The Incarnation of Machiventa Melchizedek",
            "The Sage of Salem -- The Katroite Priesthood",
            "The Teachings of Melchizedek",
            "The Salem Religion",
            "The Religion of Salem",
            "Selection of Abraham-(Melchizedek's Covenant with Abraham)",
            "The Melchizedek Missionaries",
            "Departure of Melchizedek",
            "After Melchizedek's Departure",
            "Present Status of Machiventa Melchizedek"
        ],
        94: [
            "The Melchizedek Teachings in the Orient",
            "The Salem Religion in Vedic India",
            "Brahmanism",
            "Brahmanic Philosophy",
            "The Hindu Religion",
            "The Struggle for Truth in China",
            "Lao-Tse and Confucius",
            "Gautama Siddhartha",
            "The Buddhist Faith",
            "The Spread of Buddhism",
            "Religion in Tibet",
            "Buddhist Philosophy",
            "The God Concept of Buddhism"
        ],
        95: [
            "The Melchizedek Teachings in the Levant",
            "The Salem Religion in Mesopotamia",
            "Early Egyptian Religion",
            "Evolution of Moral Concepts",
            "The Teachings of Amenemope",
            "The Remarkable Ikhnaton",
            "The Salem Doctrines in Iran",
            "The Salem Teachings in Arabia"
        ],
        96: [
            "Yahweh — God of the Hebrews",
            "Deity Concepts among the Semites",
            "The Semitic Peoples",
            "The Matchless Moses",
            "The Proclamation of Yahweh",
            "The Teachings of Moses",
            "The God Concept after Moses' Death",
            "Psalms and the Book of Job"
        ],
        97: [
            "Evolution of the God Concept Among the Hebrews",
            "Samuel—First of the Hebrew Prophets",
            "Elijah and Elisha",
            "Yahweh and Baal",
            "Amos and Hosea",
            "The First Isaiah",
            "Jeremiah the Fearless",
            "The Second Isaiah",
            "Sacred and Profane History",
            "Hebrew History",
            "The Hebrew Religion"
        ],
        98: [
            "The Melchizedek Teachings in the Occident",
            "The Salem Religion among the Greeks",
            "Greek Philosophic Thought",
            "The Melchizedek Teachings in Rome",
            "The Mystery Cults",
            "The Cult of Mithras",
            "Mithraism and Christianity",
            "The Christian Religion"
        ],
        99: [
            "The Social Problems of Religion",
            "Religion and Social Reconstruction",
            "Weakness of Institutional Religion",
            "Religion and the Religionist",
            "Transition Difficulties",
            "Social Aspects of Religion",
            "Institutional Religion",
            "Religion's Contribution"
            ],
        100: [
            "Religion in Human Experience",
            "Religious Growth",
            "Spiritual Growth",
            "Concepts of Supreme Value",
            "Problems of Growth",
            "Conversion and Mysticism",
            "Marks of Religious Living",
            "The Acme of Religious Living"
        ],
        101: [
            "The Real Nature of Religion",
            "True Religion",
            "The Fact of Religion",
            "The Characteristics of Religion",
            "The Limitations of Revelation",
            "Religion Expanded by Revelation",
            "Progressive Religious Experience",
            "A Personal Philosophy of Religion",
            "Faith and Belief",
            "Religion and Morality",
            "Religion as Man’s Liberator"
        ],
        102: [
            "The Foundations of Religious Faith",
            "Assurances of Faith",
            "Religion and Reality",
            "Knowledge, Wisdom, and Insight",
            "The Fact of Experience",
            "The Supremacy of Purposive Potential",
            "The Certainty of Religious Faith",
            "The Certitude of the Divine",
            "The Evidences of Religion"
        ],
        103: [
            "The Reality of Religious Experience",
            "Philosophy of Religion",
            "Religion and the Individual",
            "Religion and the Human Race",
            "Spiritual Communion",
            "The Origin of Ideals",
            "Philosophic Co-ordination",
            "Science and Religion",
            "Philosophy and Religion",
            "The Essence of Religion"
        ],
        104: [
            "Growth of the Trinity Concept",
            "Urantian Trinity Concepts",
            "Trinity Unity and Deity Plurality",
            "Trinities and Triunities",
            "The Seven Triunities",
            "Triodities"
        ],
        105: [
            "Deity and Reality",
            "The Philosophic Concept of I AM",
            "The I AM as Triune and as Sevenfold",
            "The Seve Absolutes of Infinity",
            "Unity, Duality, and Triunity",
            "Promulgation of Finite Reality",
            "Repercussions of Finite Reality",
            "Eventuation of Transcendentals"
        ],
        106: [
            "Universe Levels of Reality",
            "Primary Association of Finite Functionals",
            "Secondary Supreme Finite Integration",
            "Transcendental Tertiary Reality Association",
            "Ultimate Quartan Integration",
            "Coabsolute or Fifth-Phase Association",
            "Absolute or Sixth-Phase Integration",
            "Finality of Destiny",
            "The Trinity of Trinities",
            "Existential Infinite Unification"
        ],
        107: [
            "Origin and Nature of Thought Adjusters",
            "Origin of Thought Adjusters",
            "Classification of Adjusters",
            "The Divinington Home of Adjusters",
            "Nature and Presence of Adjusters",
            "Adjusters as Pure Spirits",
            "Adjusters as Personalities",
            "Adjusters and Personality"
        ],
        108: [
            "Mission and Ministry of Thought Adjusters",
            "Selection and Assignment",
            "Prerequisites of Adjuster Indwelling",
            "Organization and Administration",
            "Relation to Other Spiritual Influences",
            "The Adjuster’s Mission",
            "God In Man"
        ],
        109: [
            "Relation of Adjusters to Universe Creatures",
            "Development of Adjusters",
            "Self-Acting Adjusters",
            "Relation to Mortal Creatures",
            "Adjusters and Human Personality",
            "Material Handicaps to Adjuster Indwelling",
            "The Persistence of True Values",
            "The Destiny of Personalized Adjusters"
        ],
        110: [
            "Relation of Adjusters to Individual Mortals",
            "Indwelling the Mortal Mind",
            "Adjusters and Human Will",
            "Co-operation with the Adjuster",
            "The Adjuster’s Work in the Mind",
            "Erroneous Concepts of Adjuster Guidance",
            "The Seven Psychic Circles",
            "The Attainment of Immortality"
        ],
        111: [
            "The Adjuster and the Soul",
            "The Mind Arena of Choice",
            "Nature of the Soul",
            "The Evolving Soul",
            "The Inner Life",
            "The Consecration of Choice",
            "The Human Paradox",
            "The Adjuster’s Problem"
        ],
        112: [
            "Personality Survival",
            "Personality and Reality",
            "The Self",
            "The Phenomena of Death",
            "Adjuster After Death",
            "Survival of the Human Self",
            "The Morontia Self",
            "Adjuster Fusion",
            ],
        113: [
            "Seraphic Guardians of Destiny",
            "The Guardian Angels",
            "The Destiny Guardians",
            "Relation to Other Spirit Influences",
            "Seraphic Domains of Action",
            "Seraphic Ministry to Mortals",
            "Guardian Angels after Death",
            "Seraphim and the Ascendent Career"
        ],
        114: [
            "Seraphic Planetary Government",
            "The Sovereignty of Urantia",
            "The Board of Planetary Supervisors",
            "The Resident Governor General",
            "The Most High Observer",
            "The Planetary Government",
            "The Master Seraphim of Planetary Supervision",
            "The Reserved Corps of Destiny"
        ],
        115: [
            "The Supreme Being",
            "Relativity of Concept Frames",
            "The Absolute Basic of Supremacy",
            "Original, Actual, and Potential",
            "Sources of Supreme Reality",
            "Relation of the Supreme to the Paradise Trinity",
            "Relation of the Supreme to the Triodities",
            "The Nature of the Supreme"
        ],
        116: [
            "The Almighty Supreme",
            "The Supreme Mind",
            "The Almighty and God the Sevenfold",
            "The Almighty and Paradise Deity",
            "The Almighty and the Supreme Creators",
            "The Almighty and the Sevenfold Controllers",
            "Spirit Dominance",
            "The Living Organisms of Grand Universe"
        ],
        117: [
            "God the Supreme",
            "Nature of the Supreme Being",
            "The Source of Evolutionary Growth",
            "Significance of the Supreme to Universe Creatures",
            "The Finite God",
            "The Oversoul of Creation",
            "The Quest for the Supreme",
            "The Future of the Supreme"
        ],
        118: [
            "Supreme and Ultimate — Time and Space",
            "Time and Eternity",
            "Omnipresence and Ubiquity",
            "Time-Space Relationships",
            "Primary and Secondary Causation",
            "Omnipotence and Compossibility",
            "Omnipotence and Omniscience",
            "Reflectivity and the Universe Mind",
            "Control and Overcontrol",
            "Universe Mechanisms",
            "Functions of Providence"
        ],
        119: [
            "The Bestowals of Christ Michael",
            "The First Bestowal",
            "The Second Bestowal",
            "The Third Bestowal",
            "The Fourth Bestowal",
            "The Fifth Bestowal",
            "The Sixth Bestowal",
            "The Seventh and Final Bestowal",
            "Michael’s Postbestowal Status"
            ]
    }

    # --- Load your raw paragraphs JSON ---
    with open('structured_urantia.json') as f:
        raw_data = json.load(f)

    # Initialize output structure for part 1
    structured = {
        "parts": [
            {
                "id": 3,
                "title": "The History Of Urantia",
                "range": [57, 120],
                "papers": []
            }
        ]
    }

    # Access part 1 from structured input
    urantia_part = structured["parts"][0]

    # Loop through all paragraphs in part 1 only (papers 1-31)
    # Paper 31 is last of part 1
    for paper in raw_data["parts"][3]["papers"]:
        for section in paper["sections"]:
            for para in section["paragraphs"]:
                para_id = para["paragraph_number"]
                paper_no = int(para_id.split(":")[0])
                section_no = int(para_id.split(":")[1].split(".")[0])

                if not (57 <= paper_no <= 120):
                    continue

                # --- Find or create paper entry ---
                paper = next(
                    (p for p in urantia_part["papers"] if p["paper_id"] == paper_no), None)
                if not paper:
                    title_list = history_of_urantia_titles.get(paper_no, [""])
                    paper = {
                        "paper_id": paper_no,
                        "title": title_list[0] if title_list else "",
                        "sections": []
                    }
                    urantia_part["papers"].append(paper)

                # --- Find or create section entry ---
                section_entry = next(
                    (s for s in paper["sections"] if s["section_number"] == section_no), None)
                if not section_entry:
                    title_list = history_of_urantia_titles.get(paper_no, [])
                    section_title = title_list[section_no] if section_no < len(
                        title_list) else ""
                    section_entry = {
                        "section_number": section_no,
                        "title": section_title,
                        "paragraphs": []
                    }
                    paper["sections"].append(section_entry)

                # --- Append paragraph ---
                section_entry["paragraphs"].append({
                    "paragraph_number": para_id,
                    "text": para["text"]
                })

    # --- Output the structured file for part 1 only ---
    with open('History_of_Urantia_structured.json', 'w') as f:
        json.dump(structured, f, indent=2)

    print("History of Urantia done ✅")


def jesus_life_teachings():
    life_and_teachings_of_jesus_titles = {
        120: [
            "The Bestowal of Michael on Urantia",
            "The Seventh Bestowal Commission",
            "Bestowal Limitations",
            "Further Council and Advice",
            "The Incarnation—Making Two One"
            ],
        121: [
            "The Times of Michael's Bestowal",
            "The Occident of the First Century After Christ",
            "The Jewish People",
            "Among the Gentiles",
            "Gentile Philosophy",
            "The Gentile Religion",
            "The Hebrew Religion",
            "Jews and Gentiles",
            "Previous Written Records"
        ],
        122: [
            "The Birth and Infancy of Jesus",
            "Joseph and Mary",
            "Gabriel Appearance to Elizabeth",
            "Gabriel's Announcement to Mary",
            "Joseph's Dream",
            "Jesus' Earth Parents",
            "The Home of Nazareth",
            "The Trip to Bethlehem",
            "The Birth of Jesus",
            "The Presentation in the Temple",
            "The Herod Acts"
        ],
        123: [
            "The Early Childhood of Jesus",
            "Back in Nazareth",
            "The Fifth Year (2 B.C)",
            "Events of the Sixth Year (1 B.C)",
            "Jesus' Seventh Year (A.D. 1)",
            "School Days in Nazareth",
            "His Eight Year (2 A.D)"
        ],
        124: [
            "The Later Childhood of Jesus",
            "His Ninth Year (A.D. 3)",
            "His Tenth Year (A.D. 4)",
            "His Eleventh Year (A.D. 5)",
            "His Twelfth Year (A.D. 6)",
            "His Thirteenth Year (A.D. 7)",
            "The Journey to Jerusalem"
        ],
        125: [
            "Jesus at Jerusalem",
            "Jesus Views the Temple",
            "Jesus and the Passover",
            "Departure of Joseph and Mary",
            "First and Second Days in the Temple",
            "The Third Day in the Temple",
            "The Fourth Day in the Temple",
        ],
        126: [
            "The Two Crucial Years",
            "His Fourteenth Year (A.D. 8)",
            "The Death of Joseph",
            "His Fifteenth Year (A.D. 9)",
            "First Sermon in the Synagogue",
            "The Financia Struggle",
        ],
        127: [
            "The Adolescent Years",
            "His Sixteenth Year (A.D. 10)",
            "His Seventeenth Year (A.D. 11)",
            "The Eighteenth Year (A.D. 12)",
            "The Nineteenth Year (A.D. 13)",
            "Rebecca, the Daughter of Ezra",
            "The Twentieth Year (A.D. 14)",

        ],
        128: [
            "Jesus' Early Manhood",
            "The Twenty-First Year (A.D. 15)",
            "The Twenty-Second Year (A.D. 16)",
            "The Twenty-Third Year (A.D. 17)",
            "The Damascus Episode",
            "The Twenty-Fourth Year (A.D. 18)",
            "The Twenty-Fifth Year (A.D. 19)",
            "The Twenty-Sixth Year (A.D. 20)"
        ],
        129: [
            "The Later Adult Life of Jesus",
            "The Twenty-Seventh Year (A.D. 21)",
            "The Twenty-Eighth Year (A.D. 22)",
            "The Twenty-Ninth Year (A.D. 23)",
            "The Human Jesus"
        ],
        130: [
            "On the Way to Rome",
            "At Joppa — Discourse on Jonah",
            "At Caesarea",
            "At Alexandria",
            "Discourse on Reality",
            "On the Island of Crete",
            "Young Man Who Was Afraid",
            "At Carthage — Discourse on Time and Space",
            "On the Way to Naples and Rome"
        ],
        131: [
            "The World's Religions",
            "Cynicism",
            "Judaism",
            "Buddhism",
            "Hinduism",
            "Zoroastriansm",
            "Suduanism (Jainism)",
            "Shinto",
            "Taoism",
            "Confucianism",
            "Our Religion"
        ],
        132: [
            "The Sojourn at Rome",
            "True Values",
            "Good and Evil",
            "Truth and Faith",
            "Personal Ministry",
            "Counseling the Rich Man",
            "Social Ministry",
            "Trips About Rome"
            ],
        133: [
            "The Return from Rome",
            "Mercy and Justice",
            "Embarking at Tarentum",
            "At Corinth",
            "Personal Work in Corinth",
            "At Athens -- Discource on the Science",
            "At Ephesus -- Discource on the Soul",
            "The Sojourn at Cyprus -- Discourse on Mind",
            "At Antioch",
            "In Mesopotamia"
        ],
        134: [
            "The Transition Years",
            "The Thirtieth Year (A.D. 24)",
            "The Caravan Trip to the Caspian",
            "The Urmia Lectures",
            "Sovereignty, Divine and Human",
            "Political Sovereignty",
            "Low, Liberty, and Sovereignty",
            "The Third-First Year (A.D 25)",
            "The Sojourn on Mount Hermon",
            "The Time of Waiting"
        ],
        135: [
            "John the Baptist",
            "John Becomes Nazarite",
            "The Death of Zacharias",
            "The Life of Shepherd",
            "The Death of Elizabeth",
            "The Kingdom of God",
            "John Becomes a Preacher",
            "John Journeys North",
            "Meeting of Jesus and John",
            "Forty Days of Preaching",
            "John Journeys South",
            "John in Prison",
            "Death of John the Baptism"
        ],
        136: [
            "Baptism and the Forty Days",
            "Concepts of the Expected Messiah",
            "The Baptism of Jesus",
            "The Forty Days",
            "Plans for Public Work",
            "The First Great Decision",
            "The Second Decision",
            "The Third Decision",
            "The Fourth Decision",
            "The Fifth Decision",
            "The Sixth Decision"
        ],
        137: [
            "Tarrying Time in Galilee",
            "Choosing the First Four Apostles",
            "Choosing Philip and Nathaniel",
            "The Visit to Capernaum",
            "The Wedding at Cana",
            "Back in Capernaum",
            "The Events of Sabbath Day",
            "Four Months of Training",
            "Sermon on the Kingdom"
        ],
        138: [
            "Training the Kingdom's Messengers",
            "The Final Instructions",
            "Choosing the Six",
            "The Call of Mathew and Simon",
            "The Call of the Twins",
            "The Call of Thomas and  Judas",
            "The Week of Intensive Training",
            "Another Dissapointment",
            "First Work of the Twelve",
            "Five Months of Testing",
            "Organization of the Twelve"
        ],
        139: [
            "The Twelve Apostles",
            "Andrew, the First Chosen",
            "Simon Peter",
            "James Zebedee",
            "John Zebedee",
            "Philip the Curious",
            "Nathaniel, the Honest",
            "Matthew Levi",
            "Thomas Didymus",
            "James the Less",
            "Judas the Son of James",
            "Simon the Zealot",
            "Judas Iscariot"
        ],
        140: [
            "The Ordination of the Twelve",
            "Preliminary Instructions",
            "The Ordination",
            "The Ordination Sermon",
            "You are the Salt of the Earth",
            "Fatherly and Brotherly Love",
            "The Evening of the Ordination",
            "The Week Following the Ordination",
            "Thursday Afternoon on the Lake",
            "The Day of Consecration",
            "The Evening After the Consecration"
        ],
        141: [
            "Beginning the Public Work",
            "Leaving Galilee",
            "God's Law and the Father's Will",
            "The Sojourn at Amathus",
            "Teachings About the Father",
            "Spititual Unity",
            "Last Week at Amathus",
            "At Bethany Beyond Jordan",
            "Working In Jericho",
            "Departing For Jerusalem"
        ],
        142: [
            "The Passover at Jerusalem",
            "Teaching in the Temple",
            "God's Wrath",
            "The Concept of God",
            "Flavius and Greek Culture",
            "The Discourse of Assurance",
            "The Visit With Nicodemus",
            "The Lesson on the Family",
            "In Southern Judea"
        ],
        143: [
            "Going Through Samaria",
            "Preaching at Archelais",
            "Lesson on Self-Mastery",
            "Diversion and Relaxation",
            "The Jews and Samaritans",
            "The Woman at Sychar",
            "The Samaritan Revival",
            "Teachings About Prayer and Worship"
        ],
        144: [
            "At Gilboa and in the Decapolis",
            "The Gilboa Encampment",
            "The Discourse on Prayer",
            "The Believers's Prayer",
            "More About Prayer",
            "Other Forms of Prayer",
            "Conference With John's Apostles",
            "The Decapolis Cities",
            "In Camp Near Pella",
            "Death of John the Baptist"
        ],
        145: [
            "Four Eventful Days at Capernaum",
            "The Draught of Fishes",
            "Afternoon at the Synagogue",
            "The Healing at Sundown",
            "The Evening After",
            "Early Sunday Morning"
        ],
        146: [
            "First Preaching Tour of Galilee",
            "Preaching at Rimmon",
            "At Jotapata",
            "The Stop at Ramah",
            "The Gospel at Iron",
            "Back In Cana",
            "Nain and the Window's Son",
            "At Endor"
        ],
        147: [
            "The Interlude Visit to Jerusalem",
            "The Centurion's Servant",
            "The Journey to Jerusalem",
            "At the Pool of Bethesda",
            "The Rule of Living",
            "Visiting Simpon the Pharisee",
            "Returning to Capernaum",
            "Back in Capernaum",
            "The Feast of Spiritual Goodness"
        ],
        148: [
            "Training Evangelists at Bethsaida",
            "A New School of the Prophets",
            "The Bethsaida Hospital",
            "The Father's Business",
            "Evil, Sin, and Iniquity",
            "The Purpose of Affliction",
            "The Misunderstanding of Suffering—Discourse on Job",
            "The Man with the Withered Hand",
            "Last Week at Bethsaida",
            "Healing the Paralytic"
        ],
        149: [
            "The Second Preaching Tour",
            "The Widespread Fame of Jesus",
            "Attitude of the People",
            "Hostility of the Religious Leaders",
            "Progress of the Preaching Tour",
            "Lesson Regarding Contentment",
            "The 'Fear of the Lord'",
            "Returning to Bethsaida"
        ],
        150: [
            "The Third Preaching Tour",
            "The Women’s Evangelistic Corps",
            "The Stop at Magdala",
            "Sabbath at Tiberias",
            "Sending the Apostles Out Two and Two",
            "What Must I Do to Be Saved?",
            "The Evening at Lessons",
            "The Sojourn at Nazareth",
            "The Sabbath Service",
            "The Nazareth Rejection"
        ],
        151: [
            "Tarrying and Teaching by the Seaside",
            "The Parable of the Sower",
            "Interpretation of the Parable",
            "More about Parables",
            "More Parables by the Sea",
            "The Visit to Kheresa",
            "The Kheresa Lunatic"
        ],
        152: [
            "Events Leading Up to the Capernaum Crisis",
            "At Jairus’s House",
            "Feeding the Five Thousand",
            "The King-Making Episode",
            "Simon Peter’s Night Vision",
            "Back in Bethsaida",
            "At Gennesaret",
            "At Jerusalem"

        ],
        153: [
            "The Crisis at Capernaum",
            "The Setting of the Stage",
            "The Epochal Sermon",
            "The After Meeting",
            "Last Words in the Synagogue",
            "The Saturday Evening"
        ],
        154: [
            "Last Days at Capernaum",
            "A Week of Counsel",
            "A Week of Rest",
            "The Second Tiberias Conference",
            "Saturday Night in Capernaum",
            "The Eventful Sunday Morning",
            "Jesus’ Family Arrives",
            "The Hasty Flight"
        ],
        155: [
            "Fleeing Through Northern Galilee",
            "Why Do the Heathen Rage?",
            "The Evangelists in Chorazin",
            "At Caesarea-Philippi",
            "On the Way to Phoenicia",
            "The Discourse on True Religion",
            "The Second Discourse on Religion"
        ],
        156: [
            "The Sojourn at Tyre and Sidon",
            "The Syrophoenician Woman",
            "Teaching in Sidon",
            "The Journey Up the Coast",
            "At Tyre",
            "Jesus’ Teaching at Tyre",
            "The Return from Phoenicia"
        ],
        157: [
            "At Caesarea-Philippi",
            "The Temple-Tax Collector",
            "At Bethsaida-Julias",
            "Peter’s Confession",
            "The Talk about the Kingdom",
            "The New Concept",
            "The Next Afternoon",
            "Andrew’s Conference"
        ],
        158: [
            "The Mount of Transfiguration",
            "The Transfiguration",
            "Coming Down the Mountain",
            "Meaning of the Transfiguration",
            "The Epileptic Boy",
            "Jesus Heals the Boy",
            "In Celsus’ Garden",
            "Peter’s Protest",
            "At Peter’s House"
        ],
        159: [
            "The Decapolis Tour",
            "The Sermon on Forgiveness",
            "The Strange Preacher",
            "Instruction for Teachers and Believers",
            "The Talk with Nathaniel",
            "The Positive Nature of Jesus’ Religion",
            "The Return to Magdan"
        ],
        160: [
            "Rodan of Alexandria",
            "Rodan’s Greek Philosophy",
            "The Art of Living",
            "The Lures of Maturity",
            "The Balance of Maturity",
            "The Religion of the Ideal"
        ],
        161: [
            "Further Discussions with Rodan",
            "The personality of God",
            "The Divine Nature of Jesus",
            "Jesus’ Human and Divine Minds"
        ],
        162: [
            "At the Feast of Tabernacles",
            "The Dangers of the Visit to Jerusalem",
            "The First Temple Talk",
            "The Woman Taken in Adultery",
            "The Feast of Tabernacles",
            "Sermon on the Light of the World",
            "Discourse on the Water of Life",
            "The Discourse on Spiritual Freedom",
            "The Visit with Martha and Mary",
            "At Bethlehem with Abner"

        ],
        163: [
            "Ordination of the Seventy",
            "Ordination of the Seventy at Magadan",
            "The Rich Young Man and Others",
            "The Discussion about Wealth",
            "Farewell to the Seventy",
            "Moving the Camp to Pella",
            "The Return of the Seventy",
            "Preparation for the Last Mission"
            ],
        164: [
            "At the Feast of Dedication",
            "Story of the Good Samaritan",
            "At Jerusalem",
            "Healing the Blind Beggar",
            "Josiah Before the Sanhedrin",
            "Teaching in Solomon’s Porch"
            ],
        165: [
            "The Perean Mission Begins",
            "At the Pellas Camp",
            "Sermon on the Good Shepherd",
            "Sabbath Sermon at Pella",
            "Dividing the Inheritance",
            "The Danger of Riches",
            "Answer to Peter’s Question"
            ],
        166: [
            "Last Visit to Northern Perea",
            "The Pharisees at Ragaba",
            "The Ten Lepers",
            "The Sermon at Gerasa",
            "Teaching about Accidents",
            "The Congregation at Philadelphia"
            ],
        167: [
            "The Visit to Philadelphia",
            "Breakfast with the Pharisees",
            "Parable of the Great Supper",
            "The Woman with the Spirit of Infirmity",
            "The Message from Bethany",
            "On the Way to Bethany",
            "Blessing the Little Children",
            "The Talk About Angels"
            ],
        168: [
            "The Resurrection of Lazarus",
            "At the Tomb of Lazarus",
            "The Resurrection of Lazarus",
            "Meeting of the Sanhedrin",
            "The Answer to Prayer",
            "What Became of Lazarus"
            ],
        169: [
            "Last Teaching at Pella",
            "Parable of the Lost Son",
            "Parable of the Shrewd Steward",
            "The Rich Man and the Beggar",
            "The Father and His Kingdom"
            ],
        170: [
            "The Kingdom of Heaven",
            "Concepts of the Kingdom of Heaven",
            "Jesus’ Concept of the Kingdom",
            "In Relation to Righteousness",
            "Jesus’ Teaching about the Kingdom",
            "Later Ideas of the Kingdom"
            ],
        171: [
            "On the Way to Jerusalem",
            "The Departure from Pella",
            "On Counting the Cost",
            "The Perean Tour",
            "Teaching at Livias",
            "The Blind Man at Jericho",
            "The Visit to Zaccheus",
            "“As Jesus Passed By”",
            "Parable of the Pounds"
            ],
        172: [
            "Going into Jerusalem",
            "Sabbath at Bethany",
            "Sunday Morning with the Apostles",
            "The Start for Jerusalem",
            "Visiting About the Temple",
            "The Apostles' Attitude"
            ],
        173: [
            "Monday in Jerusalem",
            "Cleansing the Temple",
            "Challenging the Master’s Authority",
            "Parable of the Two Sons",
            "Parable of the Absent Landlord",
            "Parable of the Marriage Feast"
            ],
        174: [
            "Tuesday Morning in the Temple",
            "Divine Forgiveness",
            "Questions by the Jewish Rulers",
            "The Sadducees and the Resurrection",
            "The Great Commandment",
            "The Inquiring Greek Jews"
            ],
        175: [
            "The Last Temple Discourse",
            "The Discourse",
            "Status of Individual Jews",
            "The Fateful Sanhedrin Meeting",
            "The Situation in Jerusalem"
            ],
        176: [
            "Tuesday Evening on Mount Olivet",
            "The Destruction of Jerusalem",
            "The Master’s Second Coming",
            "Later Discussion at the Camp",
            "The Return of Michael",
            "The Return of Michael"
            ],
        177: [
            "Wednesday, the Rest Day",
            "One Day Alone with God",
            "Early Home Life",
            "The Day at Camp",
            "Judas and the Chief Priests",
            "The Last Social Hour"
            ],
        178: [
            "Last Day at the Camp",
            "Discourse on Sonship and Citizenship",
            "After the Noontime Meal",
            "On the Way to the Supper"
            ],
        179: [
            "The Last Supper",
            "The Desire for Preference",
            "Beginning the Supper",
            "Washing the Apostles' Feet",
            "Last Words to the Betrayer",
            "Establishing the Remembrance Supper"
            ],
        180: [
            "The Farewell Discourse",
            "The New Commandment",
            "The Vine and the Branches",
            "Enmity of the World",
            "The Promised Helper",
            "The Spirit of Truth",
            "The Necessity for Leaving"
            ],
        181: [
            "Final Admonitions and Warnings",
            "Last Words of Comfort",
            "Farewell Personal Admonitions"
            ],
        182: [
            "In Gethsemane",
            "The Last Group Prayer",
            "Last Hour Before Betrayal",
            "Alone in Gethsemane"
            ],
        183: [
            "The Betrayal and Arrest of Jesus",
            "The Father's Will",
            "Judas in the City",
            "The Master's Arrest",
            "Discussion at the Olive Press",
            "On the Way to the High Priest's Palace"
            ],
        184: [
            "Before the Sanhedrin Court",
            "Examination by Annas and Caiaphas",
            "Peter in the Courtyard",
            "Before the Court of Sanhedrists",
            "The Hour of Humiliation",
            "The Second Meeting of the Court"
            ],
        185: [
            "The Trial Before Pilate",
            "Pontius Pilate",
            "Jesus Appears Before Pilate",
            "The Private Examination by Pilate",
            "Jesus Before Herod",
            "Jesus Returns to Pilate",
            "Pilate's Last Appeal",
            "The Pilate's Last Interview",
            "Pilate's Tragic Surrender"
            ],
        186: [
            "Just Before the Crucifixion",
            "The End of Judas Iscariot",
            "The Master’s Attitude",
            "The Dependable David Zebedee",
            "Preparation for the Crucifixion",
            "Jesus' Death in Relation tot the Passover"
            ],
        187: [
            "The Crucifixion",
            "On the Way to Golgotha",
            "The Crucifixion",
            "Those who Saw the Crucifixion",
            "The Chief on the Cross",
            "Last Our on the Cross",
            "After the Crucifixion"
            ],
        188: [
            "The Time of the Tomb",
            "The Burial of Jesus",
            "Safeguarding the Tomb",
            "During the Sabbath Day",
            "Meaning of the Death on the Cross",
            "Lessons from the Crucifixion"
            ],
        189: [
            "The Resurrection",
            "The Morontia Transit",
            "The Material Body of Jesus",
            "The Dispensational Resurrection",
            "Discovery of the Empty Tomb",
            "Peter and John at the Tomb"
            ],
        190: [
            "Morontia Appearances of Jesus",
            "Herald of the Resurrection",
            "Jesus’ Appearances in Jerusalem",
            "Appearances to the Apostles and Others",
            "The Tenth Appearance (Philadelphia)",
            "The Walk with Two Brothers"
            ],
        191: [
            "Appearances to the Apostles and Other Leaders",
            "Appearance to Peter",
            "First Appearance to the Apostles",
            "With the Morontia Creatures",
            "The Tenth Appearance (At Philadelphia)",
            "The Second Appearance to the Apostles",
            "The Alexandria Appearance"
            ],
        192: [
            "Appearances in Galilee",
            "Appearance by the Lake",
            "Visiting with the Apostles Two and Two",
            "On the Mount of Ordination",
            "The Lakeside Gathering"
            ],
        193: [
            "Final Appearances and Ascension",
            "The Appearance at Sychar",
            "The Phoenician Appearance",
            "Last Appearance in Jerusalem",
            "Causes of Judas’s Downfall",
            "The Master's Ascension",
            "Peter Calls a Meeting"
            ],
        194: [
            "Bestowal of the Spirit of Truth",
            "The Pentecost Sermon",
            "The Significance of Pentecost",
            "What Happened at Pentecost",
            "Beginnings of the Christian Church"
            ],
        195: [
            "After Pentecost",
            "Influence of the Greeks",
            "The Roman Influence",
            "Under the Roman Empire",
            "The European Dark Ages",
            "The Modern Problem",
            "Materialism",
            "Secular Totalitarianism",
            "The Threat of Totalitarianism",
            "Christianity’s Problem",
            "The Future"
            ],
        196: [
            "The Faith of Jesus",
            "Jesus—The Man",
            "The Religion of Jesus",
            "The Supremacy of Religion"
            ]
    }

    # --- Load your raw paragraphs JSON ---
    with open('structured_urantia.json') as f:
        raw_data = json.load(f)

    # Initialize output structure for part 1
    structured = {
        "parts": [
            {
                "id": 4,
                "title": "The Life and Teachings of Jesus",
                "range": [120, 197],
                "papers": []
            }
        ]
    }

    # Access part 1 from structured input
    teachings_part = structured["parts"][0]

    # Loop through all paragraphs in part 1 only (papers 1-31)
    # Paper 31 is last of part 1
    for paper in raw_data["parts"][4]["papers"]:
        for section in paper["sections"]:
            for para in section["paragraphs"]:
                para_id = para["paragraph_number"]
                paper_no = int(para_id.split(":")[0])
                section_no = int(para_id.split(":")[1].split(".")[0])

                if not (120 <= paper_no <= 197):
                    continue

                # --- Find or create paper entry ---
                paper = next(
                    (p for p in teachings_part["papers"] if p["paper_id"] == paper_no), None)
                if not paper:
                    title_list = life_and_teachings_of_jesus_titles.get(paper_no, [
                        ""])
                    paper = {
                        "paper_id": paper_no,
                        "title": title_list[0] if title_list else "",
                        "sections": []
                    }
                    teachings_part["papers"].append(paper)

                # --- Find or create section entry ---
                section_entry = next(
                    (s for s in paper["sections"] if s["section_number"] == section_no), None)
                if not section_entry:
                    title_list = life_and_teachings_of_jesus_titles.get(
                        paper_no, [])
                    section_title = title_list[section_no] if section_no < len(
                        title_list) else ""
                    section_entry = {
                        "section_number": section_no,
                        "title": section_title,
                        "paragraphs": []
                    }
                    paper["sections"].append(section_entry)

                # --- Append paragraph ---
                section_entry["paragraphs"].append({
                    "paragraph_number": para_id,
                    "text": para["text"]
                })

    # --- Output the structured file for part 1 only ---
    with open('Life_and_Teachings_of_Jesus_structured.json', 'w') as f:
        json.dump(structured, f, indent=2)

    print("The Life and Teachings of Jesus done ✅")


def Combine():
    full_structured = {
        "parts": []
    }
    with open('foreword_structured.json', 'r') as f:
        foreword = json.load(f)['parts']
    with open('central_superuniverses_structured.json', 'r') as c:
        central = json.load(c)['parts']
    with open('Local_Universe_structured.json', 'r') as lc:
        local = json.load(lc)['parts']
    with open('History_of_Urantia_structured.json', 'r') as u:
        urantia = json.load(u)['parts']
    with open('Life_and_Teachings_of_Jesus_structured.json', 'r') as t:
        teachings = json.load(t)['parts']

    full_structured['parts'].append(foreword[0])
    full_structured['parts'].append(central[0])
    full_structured['parts'].append(local[0])
    full_structured['parts'].append(urantia[0])
    full_structured['parts'].append(teachings[0])

    with open('Combined_Structured_UB.json', 'w') as fn:
        json.dump(full_structured, fn, indent=2)
    print("Combination \033[1;32mSuccess\033[0m✅")


if __name__ == "__main__":
    #central_superuniverses()
    #local_universe()
    #history_urantia()
    #jesus_life_teachings()
    Combine()
