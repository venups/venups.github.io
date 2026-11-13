/**
 * content/skills.js: the toolbox on the home page and Experience page.
 * `core: true` draws the chip filled (a primary tool); otherwise it is outlined.
 */
const core = (name) => ({ name, core: true });
const also = (name) => ({ name });

export const skills = [
  {
    group: 'Analysis & modeling',
    items: [core('CSiBridge'), core('SAP2000'), core('STAAD.Pro'), also('LUSAS'), also('AASHTOWare BrR'), also('PGSuper'), also('PennDOT PSLRFD / VBent')],
  },
  {
    group: 'Design standards',
    items: [core('AASHTO LRFD'), core('AREMA'), core('AISC 360'), core('NJDOT'), core('PennDOT'), also('AASHTO MBE'), also('IDOT'), also('MassDOT'), also('TxDOT'), also('ACI 318')],
  },
  {
    group: 'BIM & drafting',
    items: [core('OpenBridge Designer / Modeler'), core('MicroStation'), also('AutoCAD Civil 3D'), also('Revit'), also('Navisworks'), also('Bluebeam')],
  },
  {
    group: 'Programming & automation',
    items: [core('Python'), core('C#'), core('Excel VBA'), core('OpenSTAAD API'), also('ASP.NET'), also('MATLAB'), also('Mathcad')],
  },
  {
    group: 'Data, AI & product',
    items: [core('AI integration'), core('Product ownership'), also('Machine learning'), also('Statistics'), also('pandas'), also('Power BI'), also('Microsoft Copilot')],
  },
  {
    group: 'Leadership',
    items: [core('Task leadership'), core('QA/QC'), also('Mentoring'), also('Proposal writing'), also('Technical training')],
  },
];
