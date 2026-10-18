/* =====================================================================
   SITE CONTENT — the only file to update.
   Used by index.html and itinerary.html
   ===================================================================== */
window.SITE = {
  name: "Pierre Emery",

  // Intro at the top of the home page.
  intro: "I’m a master’s student in machine learning at Mila, in Montréal, interested in computer vision and reinforcement learning. What I love about the field is how broad its applications are, and I’m drawn to projects across very different areas, like robotics, climate change and sports analytics.",

  // One line under the "Projects" heading.
  projectsIntro: "This topographic map is generated at random on every visit, and each mountain is one of my projects. The trail links them in the order I did them. Click a summit to explore it.",

  // "Today" on the itinerary page.
  now: "First semester of my master's in machine learning at Mila.",

  // Planned steps, drawn on the dashed part of the trail. text + contact: true adds the "Let's get in touch" link there.
  upcoming: [
    { date: "2027-05", label: "Looking for an internship", short: "Internship", contact: true,
      text: "I'm looking for a 6-month internship starting in summer 2027, or a part-time internship or research assistant position during the winter 2027 semester." }
  ],

  links: [
    { label: "GitHub",   href: "https://github.com/pierre-emery" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/pierre-emery-" },
    { label: "CV (PDF)", href: "cv.pdf" },
    { label: "Email",    href: "mailto:pierre.emery@mila.quebec" }
  ],

  /* ---- Hobbies: cards + photo gallery (bottom of the home page).
     interests: image is optional (shown as a banner on the card).
     photos: put the files in assets/photos/. category drives the filter buttons
             (only shown when there are 2+ categories). Missing files show a placeholder. ---- */
  outside: {
    title: "Off the Map",
    intro: "When I'm not training models, I'm usually in the mountains, with a camera not far away.",
    interests: [
      { name: "Hiking",
        text: "Day hikes and multi-day treks, mostly in the Adirondacks and the White Mountains, and in the Alps whenever I'm back in Europe." },          // TODO adjust
      { name: "Wildlife & landscape photography",
        text: "Most of my photos are taken on the trail. A few favorites are below." },
      { name: "Sports",
        text: "I'm heavily into bouldering and used to paddle in different dragon boat clubs." }
    ],
    photos: [   // any size; landscape and portrait both work
      { src: "assets/photos/wildlife1.jpg", title: "Bearded Vulture", place: "Haut Val de Bagnes", year: 2026, category: "Wildlife" },
      { src: "assets/photos/wildlife2.jpg", title: "Eurasian Kestrel", place: "Col du Saint-Bernard", year: 2026, category: "Wildlife" },
      { src: "assets/photos/wildlife3.jpg", title: "Alpine Ibex", place: "Col des Otanes", year: 2026, category: "Wildlife" },
      { src: "assets/photos/wildlife4.jpg", title: "European Sparrowhawk", place: "Salève", year: 2026, category: "Wildlife" },
      { src: "assets/photos/wildlife5.jpg", title: "Eurasian Kestrel", place: "Col du Saint-Bernard", year: 2026, category: "Wildlife" },
      { src: "assets/photos/landscape1.jpg", title: "Aiguille du Midi", place: "French Alps", year: 2026, category: "Landscape" },
      { src: "assets/photos/landscape2.jpg", title: "Lac Blanc", place: "Aiguilles Rouges", year: 2026, category: "Landscape" },
      { src: "assets/photos/landscape3.jpg", title: "Shepherd at work", place: "Val d'Aoste", year: 2026, category: "Landscape" },
      { src: "assets/photos/landscape4.jpg", title: "Misty Forest", place: "Col de Mille", year: 2026, category: "Landscape" },
      { src: "assets/photos/landscape5.jpg", title: "Panorama", place: "French Alps", year: 2026, category: "Landscape" },
      { src: "assets/photos/dboat1.jpg", title: "Nationals", place: "Olympic Pool, Montreal", year: 2024, category: "Sports" },
      { src: "assets/photos/dboat2.jpg", title: "Montreal Challenge", place: "Olympic Pool, Montreal", year: 2025, category: "Sports" }
    ]
  },

  /* ---- Projects: summits on the map; clicking one opens its page on the right.
     weight 0–1 = summit height. short = label on the map (falls back to title).
     date "YYYY-MM" sets the order of the trail (it isn't shown).
     status: "in-progress" draws a hollow summit.
     Page: context (one small line), goal (Objective), work (Approach and results — or workTitle), contribution (My role) — each a string or a list of paragraphs.
     media: { img: "assets/projects/x.jpg", caption, after: "goal" | "work" }
     links: shown at the very bottom.                                                         ---- */
  projects: [
    { title: "Glacier Segmentation from Satellite Imagery", short: "Glacier Segmentation", date: "2026-04", weight: 1.0,
      context: "Course project · Advanced Projects in Machine Learning (IFT3710/IFT6759) · Team of 3",
      goal: "Glaciers are retreating fast, and tracking them matters for drinking water, irrigation and hydropower downstream. The goal was to map glacier extent automatically from Sentinel-2 satellite images, and to see whether a model trained on one mountain range still works on others.",
      work: [
        "Most raw satellite scenes were unusable because of clouds, shadows or seasonal snow. We scored each scene with Sentinel-2's scene classification layer, kept late-summer images, and merged the three best ones into a median composite. GLIMS glacier outlines were then turned into pixel masks and checked by hand, giving 582 image–mask pairs.",
        "We trained only on the Caucasus and tested on the Alps and the Andes. An Attention U-Net trained from scratch on five spectral bands reached an IoU of 0.83 on these unseen ranges, better than a DeepLabV3+ pretrained on ImageNet with five times more parameters. An ablation showed that data augmentation brought most of the gain."
      ],
      contribution: "I built the whole dataset pipeline, implemented and trained the U-Net models, adapted and trained DeepLabV3+, ran the ablations and the final evaluation, did the manual quality control, and wrote the reports.",
      media: [
        { img: "assets/projects/glacier-unet.png", after: "goal", caption: "The Attention U-Net: an encoder–decoder with skip connections, where attention gates help the decoder focus on glacier pixels." },
        { img: "assets/projects/glacier-predictions.jpg", after: "work", caption: "Predictions on test ranges: composite, GLIMS mask, U-Net prediction, and the difference (green: ice found, red: ice missed, blue: false alarm)." }
      ],
      links: [{ label: "Repository", href: "https://github.com/pierre-emery/projet_glacier" }] },

    { title: "NHL Expected Goals (xG)", short: "NHL Expected Goals", date: "2026-01", weight: 0.8,
      context: "Course project · Data Science (IFT6758, graduate level) · With a friend, as undergraduates",
      goal: "Build an expected-goals (xG) model: the probability that a given NHL shot becomes a goal. It's how analysts judge the quality of scoring chances, so what matters is a good probability, not a yes/no answer.",
      work: [
        "We pulled full seasons of play-by-play data from the NHL API and turned them into one row per shot. The data doesn't say which net a team attacks, so we inferred it from where each team's shots cluster in a period, then computed shot distance and angle. On top of that we added features about what happened just before the shot: previous event, time and distance since it, rebounds, speed of play and players on the ice.",
        "Simple logistic regressions reached 90.6% accuracy by predicting that no shot is ever a goal, so we judged the models on their probabilities instead (ROC-AUC, calibration). A tuned XGBoost model raised the AUC from 0.72 to 0.78. We also made shot maps comparing each team to the league average, shown below."
      ],
      contribution: "",   // TODO: what you did yourself
      media: [
        { img: "assets/projects/xg-shotmap.jpg", after: "work", caption: "Colorado Avalanche, 2020–21: where the team shot more (red) or less (blue) than the league average in the offensive zone. Colorado finished first in its division that season, and it shows right in front of the net." }
      ],
      links: [{ label: "Repository", href: "https://github.com/Stephanope/Project-Hockey" },
              { label: "Blog", href: "https://github.com/Stephanope/Blogpost-Hockey" }] },

    { title: "Montréal Road Collisions", short: "Montréal Road Collisions", date: "2026-03", weight: 0.6,
      context: "Course project · Theoretical Foundations of Data Science (STT3795) · Team of 3",
      goal: "Using the City of Montréal's open data on 218,000 road collisions (2012–2021), find out whether crashes form natural groups, and whether their severity can be predicted from where, when and in what conditions they happened.",
      work: [
        "We cleaned the data and filled in missing speed limits and hours by sampling from their observed distributions, using only the training set so that no information leaked from the test set.",
        "Clustering (K-means and DBSCAN after PCA) found no structure related to severity. Classifiers reached 84% accuracy, but mostly because fewer than 1% of crashes are severe and the models never predicted them. Rebalancing with SMOTE let a linear SVM catch 144 of 205 severe crashes, at the cost of many false alarms. Our conclusion: severity depends on things the data doesn't record, such as impact speed or seatbelt use."
      ],
      contribution: "I sourced the dataset, built the cleaning, preprocessing and imputation with a teammate, and implemented the class-imbalance strategies.",
      media: [
        { img: "assets/projects/collisions-map.jpg", after: "goal", caption: "200,000 collisions plotted by location." }
      ],
      links: [{ label: "Repository", href: "https://github.com/pierre-emery/classification_accidents" }] },

    { title: "Bird Song Classification", short: "Bird Song Classification", date: "2026-10", weight: 0.55, status: "in-progress",
      context: "Personal project",
      goal: "Train my own bird-sound classifier and compare it with BirdNET, the reference model from the Cornell Lab of Ornithology. The end goal is a Raspberry Pi with a microphone that listens to the birds in my neighbourhood, identifies them, and shares the detections with Cornell.",
      workTitle: "Status",
      work: "Just getting started: first the classifier and the comparison with BirdNET, then the Raspberry Pi station. More here soon.",
      links: [] },   // TODO: add the repository once it exists

    { title: "Premier League Match Predictions", short: "Premier League Predictions", date: "2026-10", weight: 0.5, status: "in-progress",
      context: "Personal project",
      goal: "Predict the outcome of every Premier League match, and compare two families of models: Bayesian models fitted with MCMC, and the gradient-boosted and tree-based models usually used for this task (XGBoost, CatBoost, random forests).",
      workTitle: "Status",
      work: "Just getting started. More here soon.",
      links: [] }   // TODO: add the repository once it exists
  ],


  /* ---- Itinerary: checkpoints along the 3D ridge trail (one per entry, at its start date).
     type: "education" | "experience"
     start / end: "YYYY-MM" (end: null = ongoing; expected: true adds "(expected)")
     short: label shown on the 3D trail (falls back to org).
     courses (education) and bullets (experience) are optional.          ---- */
  itinerary: [
    { type: "education",
      title: "Professional M.Sc. in Machine Learning",
      org: "Mila · Université de Montréal", place: "Montréal", short: "MSc · Mila",
      start: "2026-09", end: "2028-05", expected: true,
      summary: "Graduate training in machine learning with a 6-month industry internship. Focus on probabilistic modelling, deep learning and reinforcement learning.",
      courses: [
        { code: "IFT6135", name: "Representation Learning", note: "in progress" },
        { code: "IFT6269", name: "Probabilistic Graphical Models", note: "in progress" }
      ] },

    { type: "experience",
      title: "Software Development Intern",
      org: "CERIU — Centre d'expertise et de recherche en infrastructures urbaines", place: "Montréal", short: "CERIU internship",
      start: "2026-05", end: "2026-08",
      summary: "Turned an inherited two-source prototype into a maintained data platform for a non-technical team.",
      bullets: [
        "Extended the prototype into a FastAPI backend deployed on Render, integrating five external APIs (GA4, Mailchimp, Vimeo, Facebook, LinkedIn); packaged the connectors as CanalPy, a pip-installable library published on TestPyPI.",
        "Diagnosed that per-item API calls exceeded Power BI's refresh window even when parallelized; offloaded them to a standalone tool writing CSVs to SharePoint via Microsoft Graph.",
        "Designed for handoff: credentials moved to Power BI parameters, 50+ Power Query queries refactored around reusable M functions, MkDocs maintenance guide."
      ] },

    { type: "education",
      title: "Exchange semester",
      org: "EPFL", place: "Lausanne", short: "EPFL exchange",
      start: "2025-02", end: "2025-07",
      courses: [
        { code: "CS-233", name: "Introduction to Machine Learning", note: "credited as IFT3395" },
        { code: "MATH-332", name: "Stochastic Processes" },                      // TODO check code (MAT-332 vs MATH-332)
        { code: "CS-250", name: "Algorithms I" }
      ] },

    { type: "education",
      title: "B.Sc. in Mathematics and Computer Science — Data Science profile",
      org: "Université de Montréal", place: "Montréal", short: "BSc · UdeM",
      start: "2023-09", end: "2026-08",
      courses: [
        { code: "IFT3710/IFT6759", name: "Advanced Projects in Machine Learning", note: "glacier segmentation" },
        { code: "STT3790", name: "Statistical Learning" },
        { code: "STT2105", name: "Bayesian Statistics" },
        { code: "STT3795", name: "Theoretical Foundations of Data Science" },
        { code: "IFT3700/IFT6758", name: "Introduction to Data Science" },
        { code: "IFT2505", name: "Linear Optimization" }
      ] }
  ]
};