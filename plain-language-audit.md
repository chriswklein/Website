# Plain Language Accessibility Audit

Prepared against [plainlanguage.gov](https://www.plainlanguage.gov/) guidelines (the federal standard, including EDD usage). Scope: all visible reader-facing copy — headings, body paragraphs, captions, button/link labels, and alt text. Code comments, meta tags, and config are excluded, as is `<title>` text (not rendered on the page itself).

**Scope note:** The site has no standalone `work.html` or `thoughts.html`. Both are served by `archive.html` via `?type=work` / `?type=thoughts` query filters, so `archive.html` stands in for both in the Static Pages section below.

Grade-level estimates use the Flesch-Kincaid formula, approximated from average sentence length and syllables-per-word for each page (not a mechanical word-by-word count) — treat them as directional, not exact. The Plain Language target for general audiences is roughly 8th grade.

---

## Static Pages

### Home — index.html

**Overall grade-level estimate:** ~10th grade

| Original text | Issue | Suggested rewrite | Severity |
|---|---|---|---|
| "Christopher Klein has 13 years within game development owning test strategy for large and small projects and features, and designing tools for development." | Sentence length (26 words), one sentence carrying two separate ideas (test strategy + tool design) | "Christopher Klein has 13 years in game development. He owns test strategy for projects of every size and designs the tools developers use." | Medium |
| "QA Analyst and UX Designer" (H1) | Jargon — unexpanded acronyms QA/UX in the page's very first words | "Quality Assurance Analyst and User Experience Designer" (spell out at least once above the fold) | Medium |
| "At Cloud Imperium Games I translated developer grievances into bug fixes and delivered improvements to their tools." | Word choice — "grievances" is an elevated/legal-sounding word for "complaints" | "...I turned developer complaints into bug fixes and better tools." | Low |
| "Chris is the kind of Senior QA every team hopes to have - passionate about UI/UX, deeply invested in tools design, and always thinking about how to make things better for the people using them." | Sentence length (36 words), three stacked clauses in one sentence (testimonial quote) | Split into two sentences: one on his QA/UX passion, one on his people-focus | High |
| "His attention to usability, combined with strong testing instincts, helped streamline test documentation, reduce inefficiencies, and increase overall quality." | Passive/nominalized construction ("helped streamline...reduce...increase") stacks three abstract outcomes in one clause | "He streamlined our test documentation, cut inefficiencies, and raised overall quality." | Medium |
| "His fast way to adapt, his always positive attitude and his growth into the UX designer position over the years was really impressive." | Sentence length (23 words) + idiom "across the board" earlier in same quote; subject-verb mismatch ("way...attitude...growth...was") | "He adapted quickly, stayed positive, and grew into the UX designer role over the years — all of it impressive." | Medium |
| "It was a pleasure working with Chris. He is always eager to learn new skills and proactively proposes major tool improvements and potential new workflows." | Jargon/adverb stacking — "proactively proposes" | "He's always eager to learn and often suggests big improvements to our tools and workflows." | Low |
| "Iteratively working together with Chris on new tools feels seamless and is a lot of fun." | Word choice — "iteratively," "seamless" are workplace jargon | "Working with Chris on new tools, round after round, feels easy and fun." | Low |

**Dominant problem pattern:** The site's own copy (hero, card excerpts) is reasonably tight; the two client testimonials are the main drag on this page's reading level — they're long, unedited quotes with stacked clauses and workplace jargon ("streamline," "iteratively," "across the board"). Since these are attributed quotes from named colleagues, consider a light editorial trim (with their approval) rather than a full rewrite.

---

### Archive — archive.html

**Overall grade-level estimate:** ~4th–5th grade (mostly UI chrome, minimal prose)

| Original text | Issue | Suggested rewrite | Severity |
|---|---|---|---|
| "Loading…" / "Latest ↑" / "Filter" / "Clear" | None — these are short, plain UI labels | No change needed | — |
| "URL copied to clipboard!" | None | No change needed | — |

**Dominant problem pattern:** None of significance. This page is almost entirely interactive controls and short labels; there's essentially no prose to flag. It's the strongest page on the site by this rubric.

---

### About — about.html

**Overall grade-level estimate:** ~9th–10th grade

| Original text | Issue | Suggested rewrite | Severity |
|---|---|---|---|
| "After graduating from DePaul University, I have worked on a variety of games on most every platform as a Senior Quality Assurance Analyst and User Experience Developer." | Buried lead — his job titles land at the very end of a 27-word sentence | "I'm a Senior Quality Assurance Analyst and User Experience Developer. Since graduating from DePaul University, I've worked on games across most platforms." | High |
| "I enjoy setting up effective QA teams and plans from scratch or working to improve established user workflows." | Jargon — "QA," "established user workflows" | "I enjoy building QA teams and plans from scratch, or improving workflows that are already in place." | Medium |
| "My aim is to continuously deliver high quality reports and improve best practices which benefit the entire development team." | Word choice — "best practices" is corporate jargon; passive "which benefit" | "My goal is to write clear reports and improve how the whole team works." | Medium |
| "I currently reside in Los Angeles, California and am open to working with good people on cool projects." | Word choice — "reside" is a formal word for "live" | "I live in Los Angeles, California, and I'm open to working with good people on cool projects." | Low |
| "I grew up playing video and board games with my family and that led to a career in game development." | Structure — run-on joining two ideas with "and that led to" | "I grew up playing video and board games with my family. That led to a career in game development." | Low |
| "You can often find me at a record store, cycling with my wife, reading comic books, and playing board games with friends." | Structure — a four-item list written as a single 21-word sentence | Fine as prose, but could become a short list if more interests are added later | Low |
| "Currently working towards Japanese N5 and working on some software tools to get me there." | Jargon — "N5" (a JLPT exam level) is unexplained | "I'm currently studying for the N5 Japanese proficiency exam, and building some software tools to help me get there." | Medium |
| "Left - a photo-real me - Right - me as a T-rex courtesy of concept pal, Bob Nelson" (figcaption) | Structure — dashes used in place of punctuation make the caption hard to parse at a glance | "Left: a photo-real portrait of me. Right: me as a T-rex, drawn by my friend and concept artist Bob Nelson." | Low |

**Dominant problem pattern:** Long compound sentences that bury the most important fact (his job title, his current city) at the end rather than the start — classic "buried lead" structure that plain-language guidance specifically calls out.

---

### Global Navigation & Footer — nav.html / footer.html

**Overall grade-level estimate:** ~1st–2nd grade

No flagged instances. "Home," "Archive," "About," and the copyright line are as plain as text gets. No action needed.

---

## Entries

### Star Engine — entries/work/star-engine.html (Work)

**Overall grade-level estimate:** ~13th–14th grade (college level)

This is the longest entry on the site and the clearest outlier — its problem is almost entirely sentence length, compounded by dense industry jargon.

| Original text | Issue | Suggested rewrite | Severity |
|---|---|---|---|
| "In the Editor, for like 10 odd years - when users pressed the Delete key or right clicked to Delete a singular game object or a selection of game objects - the Delete Modal...did not inform the user that the Big Red Square contains a reference to another game object." | Sentence length (~70 words), three nested dash-clauses in one sentence | "For about 10 years, the Editor's Delete confirmation didn't warn users of a key risk. If you pressed Delete on an object, the dialog never said that object was referenced elsewhere." | High |
| "But sustained, heavy use at this scale, nearly two years after I moved off the project, with the engineering team still actively extending the tool rather than replacing it - is real evidence that the underlying approach was sound and solved a lasting problem." | Sentence length (~55 words), heavily nested with nested dashes | "The team still uses and extends this tool nearly two years after I left the project. That's real evidence the original approach worked and solved a lasting problem." | High |
| "As much fun as I was having working on a base building tool - I became overwhelmed and it was weighing on me that I was assisting with implementation on this project as well as maintaining existing Editor Team duties which was the primary reason I was hired in the first place." | Sentence length (~50 words), run-on with 4+ ideas | "I was having fun on the base-building tool, but it became too much. I was still expected to keep up my main Editor Team duties — the reason I'd been hired — and I couldn't do both well." | High |
| "One of the most significant boondoggles a game developer can get into is data corruption." | Word choice — "boondoggle" is an esoteric, misapplied word (it means a wasteful project, not a hazard) | "One of the most serious problems a game developer can run into is data corruption." | High |
| "I used my voice to echo developer commentary when they encountered bugs or had frictions with their tools, later synthesizing those issues into action points as best I could to fit their specific needs while doing our best to afford general developers." | Sentence length (~42 words), jargon "synthesizing...into action points," unclear use of "afford" | "I passed along developer feedback about bugs and friction points, then turned those issues into concrete action items for the team." | High |
| "Json files filled with commands being passed down to teams via lead legacy knowledge that was not archived in any documentation in Confluence let alone in the Editor." | Passive voice ("being passed down"); grammatically incomplete sentence; jargon "lead legacy knowledge" | "Teams passed these config files down informally, from one lead to the next, with nothing written down in Confluence or in the Editor itself." | High |
| "Using my audit of the entire Editor Settings: from scaling, text, and viewport visualizer options - we verified every menu and sub-menu option and labeled them as functional, redundant, or bugged in a compiled a list for refactoring." | Sentence length (~38 words) + grammar error ("a compiled a list") | "I audited every Editor Settings menu — scaling, text, viewport options — and labeled each item functional, redundant, or bugged. That list became our refactor plan." | High |
| "How each engine or an engine editor handles those situations is a hit or miss when it comes to providing enough detail to the user to understand what caused the issue to appear." | Idiom "hit or miss"; sentence length (~32 words) | "Different engines handle this inconsistently — some give users enough detail to understand what went wrong, and some don't." | Medium |
| "With my team largely based in Germany - my team integrated me into their end of day meetings and now that I didn't need to commute, I could stay up later to meet developers across the pond in their early free hours." | Sentence length (~42 words), idiom "across the pond" | "My team was mostly based in Germany, so I joined their end-of-day meetings. Since I wasn't commuting anymore, I could stay up later to meet European developers during their morning hours." | High |
| "For about 30 minutes to sometimes a gracious 1 hour if a developer was chatty enough - I would gather information about the tools they used, their current deliverables, and the issues they faced as a team as it pertained to the Editor." | Sentence length (~43 words), jargon "deliverables," idiom "as it pertained to" | "Interviews ran 30 minutes to an hour. I'd ask about the tools they used, what they were working on, and the problems they faced with the Editor." | High |
| "This editor is quite alien to many of the younger and even older generations of developers who come from years with Unity, Unreal, or even Godot which offer tons of up to date docs and support." | Sentence length (~35 words), colloquialism "tons of" | "The editor feels unfamiliar to developers coming from Unity, Unreal, or Godot, which offer more modern, up-to-date documentation." | Medium |
| "As a result of this new window being implemented, our group of developers we worked with called it, "a godsend" and level decay decreased drastically once our tool branched into other streams." | Passive voice; jargon "level decay," "branched into other streams" | "Once we shipped the new window, developers called it "a godsend," and level decay dropped sharply as the tool spread to other teams." | High |
| "Outside of the affordances they provide..." → see caveat paragraph: "We don't have a number for incidents prevented, since that outcome was never instrumented and hard to address after the fact." | Jargon — "instrumented" (engineering term for "measured/logged") used without explanation | "We don't have a number for incidents prevented, since we never built tracking for that outcome." | Medium |
| "Untidy modification over the years has left it behind especially when compared to modern game engine interfaces like Unreal, Unity and Godot." | Passive voice ("has left it behind"); vague subject "untidy modification" | "Years of ad-hoc changes have left the interface looking dated next to Unreal, Unity, and Godot." | Medium |
| "The Editor Team was a small apparatus within the Core Technology Group..." | Word choice — "apparatus" is an uncommon, overly formal word for "group" or "unit" | "The Editor Team was a small group within the Core Technology Group..." | Low |
| "That was made worse because there wasn't any obvious method to triage these issues to the Editor Team's Engineers or QA." | Jargon — "triage" (medical/support-desk term) | "...because there was no clear way to route these issues to the Editor Team's engineers or QA." | Medium |
| "And later, a UX Requirement for every tool would add a 'information' buttons visible in a tool modal..." | Grammar error ("a 'information' buttons") reduces clarity | "Later, every new tool was required to include an information button linking to documentation." | Low |

**Dominant problem pattern:** Long, heavily nested run-on sentences (often 30–70 words, strung together with multiple em-dashes and relative clauses) are the single biggest issue — several sentences pack 3–4 separate ideas into one clause chain. Secondary pattern: dense, unglossed engineering/game-dev jargon ("triage," "instrumented," "level decay," "boondoggle," "fps") that would need at least a phrase of plain-language context for a general reader. This entry needs the heaviest rewrite pass on the site.

---

### This Website — entries/work/this-website.html (Work)

**Overall grade-level estimate:** ~11th–12th grade

| Original text | Issue | Suggested rewrite | Severity |
|---|---|---|---|
| "The MDs would grow over the months, adding methods to avoid the aforementioned issues, build development and process guardrails, contain best practices to avoid wasting tokens on specific tasks I could easily check myself, archive changes over time, and note design intent." | Sentence length (~43 words) written as a run-on list — should be a bulleted list | Convert to a short list: "Over time, the docs grew to: avoid repeat mistakes, set process guardrails, save effort on tasks I could check myself, track changes, and record design decisions." | High |
| "For the past 3 months, I sought to eliminate my dependency on Squarespace as a platform for my portfolio, as I've utilized the service on and off for many years but it was never what I truly wanted." | Sentence length (~38 words); word choice "utilized" for "used" | "For the past 3 months, I've worked to leave Squarespace behind. I'd used it on and off for years, but it never felt right." | High |
| "Outside of the affordances they provide in allowing me to design freely and utilize a model's software engineering capabilities to create this website..." *(see Read Me for the fuller version of this pattern)* | — | — | — |
| "Not being a web-head by trade, I knew I was going to get myself caught in the sticky webbing of setup." | Colloquialism "web-head"; confusing metaphor "sticky webbing of setup" | "I'm not a web developer by trade, so I knew setup would be complicated." | Medium |
| "I spent time inquiring about scalability, performance, and accessibility principles with Claude in order to establish specification documents and the technical stack we would use." | Wordy "in order to" → "to"; jargon "specification documents," "technical stack" | "I talked with Claude about scalability, performance, and accessibility, and used that to decide on our tech stack and write spec documents." | Medium |
| ".LANG-ing the Foundations" (heading) | Unclear pun/jargon — references the HTML `lang` attribute, but reads as a typo to most visitors | "Laying the Foundations" | Medium |
| "In earlier LLM experiments, I ran into slight hallucinations and/or the models would infer and do their own thing without guidance." | Jargon — "hallucinations" is an AI term used without explanation; "and/or" is awkward | "In earlier AI experiments, the models sometimes made things up or went off on their own without clear direction." | Medium |
| "However, when you are developing a site that reflects your principles - you get nitpicky, and you start to repeat "Not good enough" to yourself. And often push back on your own simplicity guardrails..." | Sentence fragment — the second sentence has no subject | "When you're building a site that reflects your own principles, you get nitpicky. You start telling yourself, "Not good enough," and pushing back on your own rules for keeping things simple." | Medium |
| "As I picked out a good cabbage in the vegetable aisle, its sprinkler spritzed my face with cold water, and barely managed to wash away the embarrassment I felt for forgetting something I see every single day." | Sentence length (~36 words) — vocabulary is simple, but the clause count is high | "As I picked out a cabbage, the produce sprinkler hit me with cold water. It almost washed away the embarrassment of forgetting something I see every day." | Medium |
| "Architecture and planning happened in Claude while implementation and Git operations were handled in Claude Code running in Visual Studio." | Passive voice ("were handled") | "I planned the architecture in Claude, then built it and ran Git in Claude Code inside Visual Studio." | Low |
| "Problem #1: Squarespace is an expensive recurring charge and specific features are gated behind a more expensive tier." | Jargon — "gated behind a tier" is SaaS/business jargon | "Problem #1: Squarespace costs a lot every month, and some features are locked behind a pricier plan." | Medium |

**Dominant problem pattern:** Two issues share the top spot: (1) long sentences that are really disguised lists — the strongest fix across this entry is converting run-on enumerations into actual bullet lists, and (2) light but persistent tech/SaaS jargon ("guardrails," "tech stack," "hallucinations," "gated behind a tier") that a general reader wouldn't have context for. The personal anecdotes (the cabbage story) read well and are the entry's strongest writing — length is their only issue.

---

### Read Me — entries/thoughts/read-me.html (Thoughts)

**Overall grade-level estimate:** ~10th–11th grade

| Original text | Issue | Suggested rewrite | Severity |
|---|---|---|---|
| "Outside of the affordances they provide in allowing me to design freely and utilize a model's software engineering capabilities to create this website and perhaps future tools or products - these companies are threatening the planet because world governments are not doing the bare minimum in protecting us all from their weaponization and unsustainable environmental and economic impacts brought on by datacenters." | Sentence length (~65 words) — by far the longest sentence on the site; jargon "affordances," "weaponization" | Split into 3+ sentences: "These companies let me design freely and use a model's engineering skills to build this site and maybe future tools. But I still think they're a real threat. Governments aren't doing the bare minimum to protect us from how these tools get weaponized, or from the environmental and economic cost of the datacenters behind them." | High |
| "For the past 3 months, I've been designing this website as a means to be a space to display my work as a portfolio and to also be a blog so that I can increase and improve my writing." | Sentence length (~40 words), redundant phrasing ("increase and improve") | "For the past 3 months, I've been building this website. It's a portfolio to show my work, and a blog to practice and improve my writing." | High |
| "That being said, I would be foolish to not indicate here at the beginning that this website was created with the assistance of Anthropic's Claude and Claude Code." | Wordy opener "That being said"; double negative "foolish to not indicate"; passive "was created" | "I should say upfront: I built this website with help from Anthropic's Claude and Claude Code." | High |
| "Every view is expressed by me, every word is typed by me." | Passive voice, twice in one sentence | "I express every view here, and I type every word myself." | Medium |
| "From game development where I have spent the majority of my career and hold the most knowledge - to music, art, books, politics, and technologies." | Sentence fragment continuing from the previous sentence via an em dash | Merge into the prior sentence or add a verb: "I'll write about game development, where I have the most experience, as well as music, art, books, politics, and technology." | Medium |
| "I say this as a hypocrite knowing I will likely be utilizing LLMs in the future, given the demand of agentic integration in any form of software development." | Jargon — "agentic integration" is unexplained; wordy "utilizing" | "I know that's a bit hypocritical — I'll likely keep using AI tools myself, since they're becoming standard in software development." | Medium |
| "Prior to this, I've only ever dabbled in public writing a few times most of which are sparse and on GameDeveloper.com." | Wordy "Prior to this" → "Before this" | "Before this, I'd only dabbled in public writing a few times, mostly on GameDeveloper.com." | Low |
| "My Thoughts will specifically be used to discuss various topics of interest to me." | Passive voice | "I'll use Thoughts to write about topics that interest me." | Low |
| "As it stands, I do not wish to bolster or speak highly of any of these AI companies or products." | Word choice — "bolster" is a slightly uncommon word for "promote" or "praise" | "Right now, I don't want to promote or praise any of these AI companies or products." | Low |

**Dominant problem pattern:** One extreme outlier sentence (the ~65-word "affordances...weaponization" sentence) drags the whole entry's grade level up on its own — everything else here is only moderately above target. The ethics bullet list ("I will not generate or steal art...") is a strong example of the plain, direct, active-voice style the rest of the entry should aim for.

---

### Physical and Digital Media — entries/thoughts/physical-and-digital-media.html (Thoughts, unpublished placeholder)

**Overall grade-level estimate:** ~11th–12th grade

| Original text | Issue | Suggested rewrite | Severity |
|---|---|---|---|
| "Games exist simultaneously as physical objects and digital experiences — and the relationship between those two forms shapes how they're made, sold, preserved, and remembered." | Sentence length (~24 words) and abstract phrasing ("shapes how they're...") for an opening line | "Games exist as both physical objects and digital experiences. That dual nature shapes how they're made, sold, kept, and remembered." | Medium |
| "The physical artefacts of games — cartridges, discs, manuals, boxes — carry meaning that a download licence does not." | Word choice — "artefacts" and "licence" (British spellings mixed with otherwise American copy) are slightly formal/inconsistent | "The physical parts of games — cartridges, discs, manuals, boxes — carry meaning that a digital license doesn't." | Low |
| "They decay, they wear, they can be lost. That fragility is part of what makes them valuable." | None — this is a good example of short, plain sentences | No change needed | — |
| "Whether that net change is good depends on who you ask and which part of the industry you're looking at." | Slightly abstract phrasing ("net change") | "Whether that's a good thing depends on who you ask, and which part of the industry you mean." | Low |

**Dominant problem pattern:** This placeholder is short and mostly well-written in plain, declarative sentences — its grade level comes from a handful of abstract/literary phrasings ("net change," "artefacts," "shapes how") rather than sentence length. Since it's unpublished placeholder text, it's a lower priority than the live entries, but worth a light pass before publishing.

---

### Industrializing the Industry — entries/thoughts/industrializing-the-industry.html (Thoughts, unpublished placeholder)

**Overall grade-level estimate:** ~11th–12th grade

| Original text | Issue | Suggested rewrite | Severity |
|---|---|---|---|
| "Game development has industrialized — studios have grown into large organisations with specialised disciplines, defined pipelines, and formal processes borrowed from manufacturing." | Word choice — "industrialized," "specialised disciplines," "formal processes" are abstract/academic for an opening sentence | "Game development has industrialized. Studios have grown into large organizations with specialized teams, set pipelines, and formal processes borrowed from manufacturing." | Medium |
| "When an industry industrializes, craft knowledge gets codified into repeatable process." | Word choice — "codified" is an uncommon/legal-sounding word | "When an industry industrializes, hands-on knowledge gets turned into a repeatable process." | Medium |
| "This is not an argument against process — it is an argument for noticing what process does to the things it touches." | Abstract, philosophical phrasing that may read as vague rather than precise | "This isn't an argument against process. It's a call to notice what process changes about the work it touches." | Low |
| "The pressures that drove industrialization — scale, cost, risk management — are not going away." | None — clear, well-scoped sentence | No change needed | — |

**Dominant problem pattern:** Similar to its sibling placeholder — short paragraphs, generally good sentence length, but consistently reaches for abstract/academic vocabulary ("codified," "industrialized," "specialised disciplines") that pushes the grade level up despite plain sentence structure. Lower priority since unpublished, but the pattern is worth watching as these get filled in.

---

## Top-Level Summary: Rewrite Priority Ranking

Ranked from most to least in need of a plain-language rewrite pass:

1. **Star Engine (entry)** — Longest entry, most severe offender. Multiple 40–70 word run-on sentences, heavy unglossed engineering jargon, and several outright grammar errors. Highest estimated grade level (~13th–14th).
2. **This Website (entry)** — Long entry with the same run-on-sentence and light-jargon pattern, though slightly less dense than Star Engine. Several long "list sentences" should become actual bulleted lists.
3. **Read Me (entry)** — Otherwise moderate, but contains the single longest and most jargon-dense sentence on the entire site (the ~65-word "affordances...weaponization" sentence), which by itself is a high-severity fix.
4. **About (static page)** — Buried-lead sentences that put the most important facts (job title, location) at the end of long compound sentences; moderate jargon ("QA," "best practices," "N5").
5. **Home (static page)** — Site's own copy is tight; testimonial quotes from colleagues carry most of the reading-level burden and stacked-clause structure.
6. **Physical and Digital Media (entry, unpublished)** and **Industrializing the Industry (entry, unpublished)** — Short, well-structured placeholder prose, but consistently reach for abstract/academic vocabulary. Lower urgency since unpublished, but worth a light pass before going live.
7. **Archive (static page)** — Almost entirely UI labels; negligible prose to fix.
8. **Global Navigation & Footer** — No issues; as plain as text gets.

**Overall pattern across the site:** the dominant, repeated issue is **sentence length via nested em-dash clauses** — many of the longest sentences (especially in Star Engine, This Website, and Read Me) chain 3–4 ideas together using dashes rather than periods. The second most common issue is **domain jargon used without a plain-language gloss** (QA/UX shorthand, engineering terms like "instrumented" or "triage," AI terms like "hallucinations" or "agentic"). Passive voice and buried leads appear but are secondary issues, concentrated mostly in About and a few spots in Star Engine.
