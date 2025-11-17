# CS171 Project -- Dead Internet Theory?

# The Dead Internet Theory – Interactive Web Experience

An immersive, data-driven exploration of the “Dead Internet Theory” — the viral idea that much of online activity is driven by bots and AI rather than real people.  
This interactive web experience blends cinematic visuals, storytelling, and data visualization to separate fact from fiction about the state of the modern internet.

---

## Overview

This project combines narrative storytelling with dynamic, interactive data visualizations to explore the “Dead Internet Theory.”  
Through a cinematic intro sequence, smooth scrolling sections, and D3-powered visualizations, users can investigate both cultural perceptions and empirical data about online automation.

---

## Features

### Cinematic Intro
- Matrix-style binary rain animation rendered on an HTML5 `<canvas>`.
- Glitch-transition video intro revealing the site title.
- Click-to-enter interaction to begin the experience.

### Scrollable Story Sections
- Eight full-screen narrative sections with smooth scroll-snap layout.
- Fixed navigation dots highlight the reader’s position.
- Each section presents a different aspect of the theory, from user perspectives to research data.

### Interactive Data Visualizations (D3.js)
Located in Section 5, featuring:
1. **Waffle Chart** — proportion of human vs. bot accounts.  
2. **Engagement Chart** — lollipop-style comparison of total human vs. bot engagement.  
3. **Beeswarm Plot** — followers vs. influence, visualizing bot presence.  
4. **Label Distribution** — stance classification (Agree / Disagree / Unrelated) based on the `Truth_Seeker_Model_Dataset`.

These are displayed in a swipeable carousel with arrow and dot navigation.  
If CSV data files are missing, the script automatically generates demo data to maintain functionality.

### Educational Takeaways
The final section summarizes three key lessons:
- Stay curious rather than fearful of technology.  
- Practice strong digital literacy.  
- Support accountability and transparency in digital systems.

---

## Tech Stack

| Layer | Technology |
|--------|-------------|
| Frontend | HTML5, CSS3, JavaScript (ES6) |
| Data Visualization | [D3.js v7](https://d3js.org/) |
| Icons | [Font Awesome 6](https://fontawesome.com/) |
| Animations | CSS keyframes, JavaScript transitions |
| Graphics | HTML5 `<video>` and `<canvas>` APIs |

---

## File Structure

