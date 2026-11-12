const base = '/projects/materials/';
export const MATERIALS = {
  'PRJ-02': [
    {id:'glucose-research-poster', type:'image', file:base+'glucose-research-poster.png', thumbnail:base+'glucose-research-poster-800.webp', thumbnailWidth:800, thumbnailHeight:1131,
      title:{en:'Glucose prediction research poster', es:'Póster de investigación sobre predicción de glucosa'},
      kind:{en:'Research poster', es:'Póster de investigación'},
      alt:{en:'Research poster on postprandial glucose prediction and feature interpretation in free-living night-shift workers.', es:'Póster sobre predicción de glucosa posprandial e interpretación de variables en trabajadores de turno nocturno en condiciones de vida libre.'}}
  ],
  'PRJ-03': [
    {id:'orb-placement-poster', type:'image', file:base+'orb-placement-poster.png', thumbnail:base+'orb-placement-poster-800.webp', thumbnailWidth:800, thumbnailHeight:1131,
      title:{en:'ORB Sport placement poster', es:'Póster de prácticas en ORB Sport'},
      kind:{en:'Research poster', es:'Póster de investigación'},
      alt:{en:'Poster on the accuracy and agreement of ORB Sport mouthguard heart-rate measurements during laboratory exercise and Muay Thai.', es:'Póster sobre precisión y concordancia de la frecuencia cardíaca medida con el protector bucal ORB Sport durante ejercicio en laboratorio y Muay Thai.'}},
    {id:'orb-placement-reference', type:'image', file:base+'orb-placement-reference-page-1.png', pages:[base+'orb-placement-reference-page-1.png',base+'orb-placement-reference-page-2.png'], thumbnail:base+'orb-placement-reference-800.webp', thumbnailWidth:800, thumbnailHeight:1131,
      title:{en:'ORB placement reference', es:'Carta de referencia de las prácticas en ORB'},
      kind:{en:'Reference letter · 2 pages', es:'Carta de referencia · 2 páginas'},
      alt:{en:'ORB Innovations placement reference for José Miguel Sorando Campillo.', es:'Carta de referencia de ORB Innovations para José Miguel Sorando Campillo.'}}
  ],
  'PRJ-04': [
    {id:'pharmamiku-poster', type:'image', file:base+'pharmamiku-poster.png', thumbnail:base+'pharmamiku-poster-480.webp',
      title:{en:'PharmaMiku project poster', es:'Póster del proyecto PharmaMiku'},
      kind:{en:'Poster', es:'Póster'},
      alt:{en:'PharmaMiku poster showing the prototype interface and multi-agent architecture.', es:'Póster de PharmaMiku con la interfaz del prototipo y su arquitectura multiagente.'}},
    {id:'pharmamiku-certificate', type:'image', file:base+'pharmamiku-certificate.png', thumbnail:base+'pharmamiku-certificate-480.webp',
      title:{en:'Public Choice Award', es:'Public Choice Award'},
      kind:{en:'Certificate · Great Agent Hack 2025', es:'Diploma · Great Agent Hack 2025'},
      alt:{en:'Certificate awarding Team PharmaMiku the Public Choice Award at Great Agent Hack 2025.', es:'Diploma del Public Choice Award otorgado al equipo PharmaMiku en Great Agent Hack 2025.'}}
  ],
  'PRJ-05': [
    {id:'ergogenic-aids-coursework-poster', type:'image', file:base+'ergogenic-aids-coursework-poster-typeset.png', thumbnail:base+'ergogenic-aids-coursework-poster-typeset-800.webp', thumbnailWidth:800, thumbnailHeight:1133,
      title:{en:'Ergogenic aids coursework poster', es:'Póster del trabajo de curso sobre ayudas ergogénicas'},
      kind:{en:'Coursework poster', es:'Póster de trabajo de curso'},
      alt:{en:'Coursework poster on tart cherry supplementation, biomarkers and performance in a 1 km running trial.', es:'Póster de trabajo de curso sobre suplementación con cereza ácida, biomarcadores y rendimiento en una carrera de 1 km.'}}
  ],
  'PRJ-06': [
    {id:'celonis-certificate', type:'image', file:base+'celonis-certificate.png', thumbnail:base+'celonis-certificate-480.webp',
      title:{en:'Process Mining in Medical Education Data Challenge', es:'Reto de minería de procesos en educación médica'},
      kind:{en:'Certificate of achievement · UCL / Celonis', es:'Certificado de logro · UCL / Celonis'},
      alt:{en:'Certificate awarded to Jose Miguel Sorando Campillo for completing the Process Mining in Medical Education Data Challenge, dated 25 June 2025.', es:'Certificado otorgado a Jose Miguel Sorando Campillo por completar el reto de minería de procesos en educación médica, con fecha del 25 de junio de 2025.'}},
    {id:'celonis-academy-fundamentals', type:'image', file:base+'celonis-academy-fundamentals.png', thumbnail:base+'celonis-academy-fundamentals-800.webp', thumbnailWidth:800, thumbnailHeight:618,
      title:{en:'Academic Process Mining Fundamentals', es:'Fundamentos académicos de minería de procesos'},
      kind:{en:'Certificate · Celonis Academy', es:'Certificado · Celonis Academy'},
      alt:{en:'Celonis Academy certificate awarded to Josemi Sorando for Academic Process Mining Fundamentals.', es:'Certificado de Celonis Academy otorgado a Josemi Sorando en fundamentos académicos de minería de procesos.'}}
  ]
};
export const EXPANDED_PROJECT_IDS = ['PRJ-01','PRJ-02','PRJ-03','PRJ-04','PRJ-06'];
export function nextZoom(current, delta) {
  return Math.max(100, Math.min(300, current + delta * 25));
}
export function imageDimensions(naturalWidth, naturalHeight, width, height, zoom = 100) {
  if (![naturalWidth,naturalHeight,width,height].every(n => Number.isFinite(n) && n > 0)) return {width:0,height:0};
  const scale = Math.min(width / naturalWidth, height / naturalHeight, 1) * zoom / 100;
  return {width:Math.round(naturalWidth * scale), height:Math.round(naturalHeight * scale)};
}
