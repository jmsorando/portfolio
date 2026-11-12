// Shared area navigation. Entries reference stable project IDs, never card positions.
export const AREAS = [
  {
    id: 'movement', projects: ['PRJ-01', 'PRJ-03'],
    visual: {
      src: '/portfolio/projects/visuals/sport-health-watch-zones.webp', width: 1400, height: 933,
      alt: {en: 'Graphite smartwatch with a closed strap, an illustrative 138 bpm heart-rate reading, five heart-rate zones with Z3 highlighted and a PPG pulse waveform.', es: 'Reloj inteligente gris grafito con correa cerrada, frecuencia cardíaca ilustrativa de 138 bpm, cinco zonas de frecuencia cardíaca con Z3 resaltada y curva de pulso PPG.'}
    },
    title: {en: 'Sport and Health Technology', es: 'Tecnología para el deporte y la salud'},
    contents: {en: 'DRESIO · ORB Sport', es: 'DRESIO · ORB Sport'}
  },
  {
    id: 'health-data', projects: ['PRJ-02', 'PRJ-04', 'PRJ-06'],
    visual: {
      src: '/portfolio/projects/visuals/health-data-analysis-monitor.webp', width: 1400, height: 738,
      alt: {en: 'Graphite desktop monitor with illustrative observed and predicted trends, a prediction scatter plot and feature-importance bars, beside five connected blue and violet nodes.', es: 'Monitor de sobremesa gris grafito con tendencias observadas y predichas, diagrama de dispersión de predicciones y barras de importancia de variables ilustrativos, junto a cinco nodos azules y violetas conectados.'}
    },
    title: {en: 'Health Data Science and AI', es: 'Ciencia de datos de salud e IA'},
    contents: {en: 'Glucose prediction · PharmaMiku · Celonis', es: 'Predicción de glucosa · PharmaMiku · Celonis'}
  },
  {
    id: 'performance-lab', projects: ['LAB-EXERCISE', 'LAB-FORCE', 'LAB-MOCAP', 'LAB-BODY', 'PRJ-05'],
    visual: {
      src: '/portfolio/projects/visuals/human-performance.webp', width: 1400, height: 1120,
      alt: {en: 'Blue VO₂ testing mask with grey headgear, red straps and a front flow sensor.', es: 'Máscara azul de pruebas de VO₂ con estructura gris, correas rojas y sensor de flujo frontal.'}
    },
    title: {en: 'Human Performance Lab', es: 'Laboratorio de rendimiento humano'},
    contents: {en: 'Exercise testing · Strength · Motion capture · Body composition · Ergogenic aids', es: 'Pruebas de esfuerzo · Fuerza · Captura de movimiento · Composición corporal · Ayudas ergogénicas'}
  }
];

export const PROJECT_LABELS = {
  'PRJ-01': {en: 'DRESIO', es: 'DRESIO'},
  'PRJ-03': {en: 'ORB Sport', es: 'ORB Sport'},
  'PRJ-02': {en: 'Glucose prediction', es: 'Predicción de glucosa'},
  'PRJ-04': {en: 'PharmaMiku', es: 'PharmaMiku'},
  'PRJ-06': {en: 'Celonis', es: 'Celonis'},
  'LAB-EXERCISE': {en: 'Exercise testing', es: 'Pruebas de esfuerzo'},
  'LAB-FORCE': {en: 'Strength and movement assessment', es: 'Fuerza y evaluación del movimiento'},
  'LAB-MOCAP': {en: 'Motion capture', es: 'Captura de movimiento'},
  'LAB-BODY': {en: 'Body composition', es: 'Composición corporal'},
  'PRJ-05': {en: 'Ergogenic Aids Study (Coursework)', es: 'Estudio de ayudas ergogénicas (trabajo de curso)'}
};

// Individual lab artwork is separate from the three area-card illustrations.
export const LAB_VISUALS = {
  'LAB-EXERCISE': {src:'/portfolio/assets/human-performance-lab.svg', alt:{en:'VO₂ mask and laboratory treadmill.',es:'Máscara de VO₂ y cinta de laboratorio.'}},
  'LAB-FORCE': {src:'/portfolio/projects/visuals/lab-force.webp', alt:{en:'Force plate and handheld grip dynamometer.',es:'Plataforma de fuerza y dinamómetro de mano.'}},
  'LAB-MOCAP': {src:'/portfolio/projects/visuals/lab-mocap-suit.webp', alt:{en:'Mannequin in a full-length motion capture suit with tracking markers between two cameras.',es:'Maniquí con traje completo de captura de movimiento y marcadores entre dos cámaras.'}},
  'LAB-BODY': {src:'/portfolio/projects/visuals/lab-body.webp', alt:{en:'Body composition analyzer and skinfold caliper.',es:'Analizador de composición corporal y plicómetro.'}},
  'PRJ-05': {src:'/portfolio/projects/visuals/lab-cherry-refined.webp', alt:{en:'Tart cherries and a stopwatch.',es:'Cerezas ácidas y cronómetro.'}}
};

const LAB = {
  'LAB-EXERCISE': {
    title: {en: 'Exercise testing', es: 'Pruebas de esfuerzo'},
    sections: [
      {
        label: {en: 'Context', es: 'Contexto'},
        body: {en: 'UCL laboratory sessions and a Sport Scientist Placement at ORB Sport', es: 'Sesiones de laboratorio en UCL y prácticas como científico del deporte en ORB Sport'}
      },
      {
        label: {en: 'Experience', es: 'Experiencia'},
        body: {
          en: 'Participated in exercise testing during practical laboratory sessions at UCL. During my ORB Sport placement, operated a COSMED cardiopulmonary metabolic cart with OMNIA software during treadmill VO₂max tests. Co-designed a repeated-measures validation study with a final sample of 8 participants (n=8), comparing the ORB mouthguard against Polar ECG straps. During the placement, analysed data from approximately 20 participants using Python, MAE, RMSE and Bland–Altman plots.',
          es: 'Participé en pruebas de esfuerzo durante sesiones prácticas de laboratorio en UCL. Durante mis prácticas en ORB Sport, utilicé un equipo metabólico cardiopulmonar COSMED con el software OMNIA durante pruebas de VO₂max en cinta. Codiseñé un estudio de validación de medidas repetidas con una muestra final de 8 participantes (n=8), comparando el protector bucal ORB con bandas ECG Polar. Durante las prácticas, analicé datos de aproximadamente 20 participantes con Python, MAE, RMSE y gráficos de Bland–Altman.'
        }
      }
    ]
  },
  'LAB-FORCE': {
    title: {en: 'Strength and movement assessment', es: 'Fuerza y evaluación del movimiento'},
    sections: [
      {
        label: {en: 'UCL · Laboratory sessions', es: 'UCL · Sesiones de laboratorio'},
        body: {en: 'Practical experience using force plates and dynamometry during university laboratory sessions.', es: 'Experiencia práctica utilizando plataformas de fuerza y dinamometría en sesiones de laboratorio de la universidad.'}
      },
      {
        label: {en: 'The Fighting Physiotherapist · Placement', es: 'The Fighting Physiotherapist · Prácticas'},
        body: {
          en: 'Observed the assessment and rehabilitation of athletes and patients. Used force plates, handheld dynamometers and goniometry to assess asymmetry and rehabilitation progress.',
          es: 'Observé la evaluación y rehabilitación de deportistas y pacientes. Utilicé plataformas de fuerza, dinamómetros de mano y goniometría para evaluar asimetrías y el progreso de rehabilitación.'
        }
      }
    ]
  },
  'LAB-MOCAP': {
    title: {en:'Motion capture',es:'Captura de movimiento'},
    sections: [
      {label:{en:'Context',es:'Contexto'},body:{en:'UCL · Practical laboratory sessions',es:'UCL · Sesiones prácticas de laboratorio'}},
      {label:{en:'Experience',es:'Experiencia'},body:{en:'Participated in preparing the motion capture system and recording movement during practical sessions.',es:'Participé en la preparación del sistema de captura de movimiento y en el registro de movimientos durante sesiones prácticas.'}}
    ]
  },
  'LAB-BODY': {
    title: {en:'Body composition',es:'Composición corporal'},
    sections: [
      {label:{en:'Context',es:'Contexto'},body:{en:'UCL · Practical laboratory sessions',es:'UCL · Sesiones prácticas de laboratorio'}},
      {label:{en:'Experience',es:'Experiencia'},body:{en:'Practical sessions on body composition assessment with TANITA, skinfold calipers and DXA.',es:'Sesiones prácticas sobre evaluación de la composición corporal con TANITA, pinzas de pliegues cutáneos y DXA.'}}
    ]
  }
};

export function areaProjects(projects, lang) {
  const records = new Map(projects.map(p => [p.id, {...p}]));
  const lab = records.get('PRJ-05');
  records.set(lab.id, {...lab, title: lab.labTitle, visual: LAB_VISUALS[lab.id]});
  for (const [id, record] of Object.entries(LAB)) {
    records.set(id, {
      id, visual: LAB_VISUALS[id], title: record.title[lang],
      sections: record.sections.map(s => ({label: s.label[lang], body: s.body[lang]}))
    });
  }
  return records;
}

export function parentView(mode) {
  return mode === 'material' ? 'summary' : mode === 'summary' ? 'selection' : null;
}
