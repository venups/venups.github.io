/**
 * content/career.js: the career path (home page) and the detailed Experience page.
 *
 * `path`        the short six-stop timeline on the home page.
 * `experience`  the full role-by-role record on /experience.
 * `education`, `licensure` the credentials on /experience.
 *
 * To add a new role, copy one { ... } block, paste it at the TOP of the list
 * and change the text. Newest first.
 *
 * `caseStudies` (optional) lists file names from content/work, without ".md".
 * Each one becomes a link under that role on the Experience page.
 */

/** Home page timeline. Each stop has a structures line and a software line. */
export const path = [
  {
    years: '2009 – 2013',
    place: 'NIT Karnataka',
    role: 'B.Tech., Civil Engineering · CGPA 9.5 / 10',
    structures: 'Summer research at the Indian Institute of Science on seismic pounding between adjacent buildings.',
    systems: 'Dynamic-response models in MATLAB; a program that automated limit-state design of RC footings.',
  },
  {
    years: '2014 – 2016',
    place: 'Tata Consulting Engineers',
    role: 'Graduate Engineer Trainee to Senior Engineer · Chennai',
    structures: 'Industrial structures: piled tank foundations, dynamic machine foundations, pipe racks. Led four engineers.',
    systems: 'Web tools in C# and ASP.NET that automated design calculations; led five engineers building them. First OpenSTAAD + VBA pipelines.',
  },
  {
    years: '2016 – 2018',
    place: 'Texas A&M University',
    role: 'M.Eng., Structural Engineering · GPA 3.9 / 4.0',
    structures: 'Master’s project on retrofit and preservation of historic suspension bridges; TxDOT load-rating research; two internships.',
    systems: 'Mined the National Bridge Inventory for the suspension-bridge study and modeled a historic suspension bridge in CSiBridge.',
  },
  {
    years: '2019 – 2023',
    place: 'Modjeski and Masters',
    role: 'Engineer I to III, Structures · Philadelphia',
    structures: 'Lead structural engineer on a fracture-critical deck replacement; Ambassador Bridge grid deck; erection analysis of the Tobin Land Bridge, a record-size wildlife crossing.',
    systems: 'Excel VBA driving SAP2000 for erection analysis. Began the MITx program in statistics and data science; co-authored ML research.',
  },
  {
    years: '2023 – 2026',
    place: 'GFT (formerly Gannett Fleming)',
    role: 'Structural Staff Engineer to Structural Engineer · Marlton, NJ',
    structures: 'CSiBridge lead on US 20 over Fox River; structures task leader on Route 1&9 at I-278; jacking designs for about 15 interstate bridges.',
    systems: 'Automated wind-load input, STAAD post-processing and connection design. Built Steel Bridge Pal. Automation & AI Ambassador.',
  },
  {
    years: '2026 – now',
    place: 'GFT',
    role: 'Senior Project Engineer, Bridge & Technology',
    structures: 'Technical lead for complex steel bridges; BIM Manager for bridges, Northeast Transportation.',
    systems: 'Product owner and architect of the GFT Transportation application suite; member of the AI Working Group. Technology Innovation Award; presented at IBC and ASHE National.',
    current: true,
  },
];

/** Full record for the Experience page. Newest first. */
export const experience = [
  {
    org: 'GFT (formerly Gannett Fleming)',
    title: 'Senior Project Engineer, Bridge & Technology',
    dates: 'Jun 2023 – Present',
    location: 'Marlton, NJ',
    progression: 'Structural Staff Engineer (Jun 2023) → Structural Engineer (Apr 2025) → Senior Project Engineer, Bridge & Technology (Sep 2026)',
    // File names of case studies in content/work. They appear as links under this role.
    caseStudies: ['steel-bridge-pal', 'gft-transportation-suite', 'us-20-fox-river', 'newark-bay-hudson-county-extension', 'route-1-9-at-i-278', 'interstate-bridge-jacking', 'wmata-georgia-avenue-load-rating'],
    groups: [
      {
        label: 'Bridge engineering',
        items: [
          'Primary CSiBridge technical lead, analysis task lead, designer and checker for the US 20 over Fox River westbound and eastbound bridges in Illinois: three-span curved steel girder bridges designed for staged construction to IDOT standards.',
          'Structures Task Leader for Bridge No. 2 of the Route 1&9 at I-278 Interchange Improvements (NJDOT): alternatives matrix, cost estimate, preliminary girder design and the Structure Recommendation Report, with responsibility for schedule, budget and reporting.',
          'BIM and finite element modeling lead on the Newark Bay–Hudson County Extension (NJTA) Newark Bay Bridge Replacement: construction-stage FEM guidance, drawing-review procedures and mentoring of junior engineers.',
          'Led and delivered the 95% plan submission for the Harris County Toll Road Authority southbound toll gantry on Sam Houston Tollway East at SH 225, within budget, coordinating engineers across offices and Level 2 QA.',
          'Engineered jacking and temporary support designs for about 15 interstate steel bridges along I-76 and I-476, enabling bearing repair and replacement while minimizing temporary towers.',
          'Damage assessment, repair design and construction inspection for a fracture-critical box girder bridge, and repair of truck-impact damage on an I-76 bridge.',
          'Load rated WMATA’s Georgia Avenue Outbound Bridge, a heavily skewed floorbeam through-girder railway bridge, with a refined STAAD.Pro finite element model to AREMA standards.',
          'Prestressed spread box beam design for Route 202 over the Raritan River (NJDOT); diaphragm and deck checks for the staged Oak Tree Road Bridge; drilled-shaft foundations for NJ South Summit.',
        ],
      },
      {
        label: 'Technology and leadership',
        items: [
          'Product Owner and Architect of the GFT Transportation application, a centralized website for the firm’s transportation automation tools developed with IT, and of the GFTSteelBridgePal application.',
          'Developed Steel Bridge Pal, which turns OpenBridge information reports into standardized, validated CSiBridge models: an estimated 200 hours saved per model and about 2,000 hours across ten bridges.',
          'Automated the input of user-defined wind loads on the Fox River models, cutting manual input time by more than 80%.',
          'Built an OpenSTAAD and Excel VBA process that extracts forces from multiple STAAD.Pro models and produces automated connection designs and calculation reports (River Street Bridge over Amtrak, Boston).',
          'Member of GFT’s AI Working Group; Automation & AI Ambassador for Northeast Transportation; BIM Manager for bridges; Design & Resource Subcommittee representative.',
          'Trained junior engineers in finite element modeling, staged construction and structured review practice; recorded CSiBridge modeling procedures for reuse.',
        ],
      },
    ],
  },
  {
    org: 'Modjeski and Masters',
    title: 'Engineer I to III, Structures',
    dates: 'Feb 2019 – Jun 2023',
    location: 'Philadelphia, PA',
    progression: 'Engineer I (Feb 2019) → Engineer II (Jan 2021) → Engineer III (Aug 2021)',
    caseStudies: ['tobin-land-bridge', 'mlk-bridge-deck-replacement', 'ambassador-bridge-deck'],
    groups: [
      {
        items: [
          'Finite element erection and construction-sequence analysis of the Robert L.B. Tobin Land Bridge in San Antonio, the largest wildlife crossing in the U.S. when it opened, integrating Excel VBA macros with SAP2000 to model, load and check strength and stability.',
          'Assistant project manager and lead structural engineer on the final design PS&E package for the deck replacement of the MLK Jr. Bridge, Philadelphia: about 700 ft long, heavily skewed and fracture critical. Personally developed about 50 of the 92 structural contract drawings.',
          'Designed components and reviewed thousands of shop drawings for the grid deck replacement of the Ambassador Bridge (1,850 ft main span), identifying fabrication and installation errors that saved hundreds of thousands of dollars.',
          'Designed a skewed, wide, continuous three-span steel bridge for a staged superstructure replacement in Philadelphia, saving about 15% through value engineering.',
          'Repair plans, construction sequences and specifications for severely corroded deep steel box girders; partial rebuild of skewed historic abutments to AASHTO LRFD and PennDOT standards.',
          'Deck pour sequence analysis and reinforcement design for a three-span continuous (190 ft – 228 ft – 190 ft) deck and an approximately 800 ft deck with skew, curvature and superelevation.',
          'Assisted the project manager on technical and cost proposals for three pursuits as prime consultant.',
        ],
      },
    ],
  },
  {
    org: 'Texas A&M University',
    title: 'Graduate Teaching, Research and Student Assistant',
    dates: 'Aug 2016 – Dec 2018',
    location: 'College Station, TX',
    groups: [
      {
        items: [
          'Teaching assistant for Introduction to Graphics and Visualization Applications in Civil Engineering: two sections of about 40 students, tutoring AutoCAD Civil 3D, Revit Structure and Navisworks.',
          'Research assistant at the Texas A&M Transportation Institute on a TxDOT project on load rating of steel and concrete bridges, under Dr. Mary Beth Hueste.',
          'Grader for Theory of Structures and Mechanics of Materials, two classes of about 80 students each.',
        ],
      },
    ],
  },
  {
    org: 'Webber Construction, LLC',
    title: 'Engineering Intern',
    dates: 'Aug 2017 – Dec 2017',
    location: 'The Woodlands, TX',
    groups: [
      {
        items: [
          'Resolved construction RFEs and defects on roadway and bridge projects; optimized cost and time of precast prestressed girder designs in PGSuper.',
          'Designed and reviewed calculations for formwork, cofferdams and a temporary trestle.',
        ],
      },
    ],
  },
  {
    org: 'IHI E&C International Corporation',
    title: 'Structural Engineering Intern',
    dates: 'Jun 2017 – Aug 2017',
    location: 'Houston, TX',
    groups: [
      {
        items: [
          'Analyzed pipe rack, cable support and equipment support structures for an LNG facility; checked PDMS 3D models in Navisworks for clash-free construction.',
          'Designed isolated and combined foundations for heat exchangers and vessels.',
        ],
      },
    ],
  },
  {
    org: 'Tata Consulting Engineers Limited',
    title: 'Graduate Engineer Trainee to Senior Engineer, Civil Structural',
    dates: 'Jan 2014 – Jul 2016',
    location: 'Chennai, India',
    caseStudies: ['engineering-automation'],
    groups: [
      {
        items: [
          'Managed a team of four engineers developing steel details for a Propylene Oxide plant; coordinated with MEP disciplines on warehouses, pipe racks and equipment foundations.',
          'FEM analysis and design of the pile and pile cap foundation for a refrigerated butadiene storage tank 65 ft in diameter and 50 ft high; foundation for 13 kip rotary equipment at 3,000 rpm.',
          'Developed web-based programs in C# and ASP.NET to automate engineering calculations such as staircase and retaining wall design; led and mentored a team of five young engineers on the effort.',
          'Customized STAAD.Pro output for documentation using OpenSTAAD and Excel VBA; built a 3D Revit model of a coal handling facility with clash checks.',
        ],
      },
    ],
  },
  {
    org: 'Ballari Institute of Technology & Management',
    title: 'Lecturer',
    dates: 'Aug 2013 – Dec 2013',
    location: 'Karnataka, India',
    groups: [{ items: ['Taught Engineering Mechanics to two classes of first-year engineering students.'] }],
  },
  {
    org: 'Indian Institute of Science',
    title: 'Summer Research: Effect of Seismic Pounding on Structures',
    dates: 'May 2012 – Jun 2012',
    location: 'Bangalore, India',
    groups: [
      {
        items: [
          'Modeled in MATLAB the dynamic response of adjoining buildings under earthquake-like ground motion, with a parametric study of pounding using spring–damper models, under Dr. C. S. Manohar.',
        ],
      },
    ],
  },
];

export const education = [
  {
    degree: 'M.Eng., Civil Engineering (Structural Engineering)',
    school: 'Texas A&M University, College Station, TX',
    detail: 'Dec 2018 · GPA 3.9 / 4.0',
    note: 'Master’s project: A Comprehensive Study on Retrofit of Suspension Bridges and Preservation of Historic Suspension Bridges.',
  },
  {
    degree: 'B.Tech., Civil Engineering',
    school: 'National Institute of Technology Karnataka, Surathkal, India',
    detail: 'May 2013 · CGPA 9.5 / 10.0',
  },
  {
    degree: 'MicroMasters program, Statistics & Data Science',
    school: 'MITx on edX, MIT Open Learning',
    detail: 'May 2020 – Present',
    note: 'Course certificates: Probability – The Science of Uncertainty and Data; Data Analysis: Statistical Modeling and Computation in Applications.',
  },
];

export const licensure = [
  { name: 'Professional Engineer (P.E.)', detail: 'Licensed' },
  { name: 'ACEC Emerging Leaders Program', detail: 'Graduate' },
  { name: 'Fundamentals of OpenBridge Modeling', detail: 'Bentley · 2024' },
  { name: 'Steel Box Girder Bridges: Relevant Practice and Approaches', detail: 'Certificate' },
  { name: 'Foundations of Project Management', detail: 'Certificate' },
  { name: 'Data Analysis with Python: Zero to Pandas', detail: 'Certificate' },
];
