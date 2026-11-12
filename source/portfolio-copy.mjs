// Editorial choices for the approved portfolio. Technical names, compound words,
// asset paths and original supporting documents retain their punctuation.
const replacements = [
  ['UCL laboratory sessions and ORB Sport — Sport Scientist Placement', 'UCL laboratory sessions and a Sport Scientist Placement at ORB Sport'],
  ['Sesiones de laboratorio en UCL y ORB Sport — Prácticas como científico del deporte', 'Sesiones de laboratorio en UCL y prácticas como científico del deporte en ORB Sport'],
  ['Exercise AI Scientist — R&D Intern', 'Exercise AI Scientist (R&D Intern)'],
  ['Científico de IA para el Ejercicio — Prácticas de I+D', 'Científico de IA para el Ejercicio (prácticas de I+D)'],
  ['Ergogenic Aids Study — Coursework', 'Ergogenic Aids Study (Coursework)'],
  ['Estudio de ayudas ergogénicas — Trabajo de curso', 'Estudio de ayudas ergogénicas (trabajo de curso)'],
  ['Celonis — Minería de Procesos en Informática de la Salud', 'Celonis: minería de procesos en informática de la salud'],
  ['UCL Muay Thai Club — ', 'UCL Muay Thai Club · '],
  ['ORB Sport — ', 'ORB Sport · '],
  ['The Fighting Physiotherapist — ', 'The Fighting Physiotherapist · '],
  ['UCL — ', 'UCL · ']
];

export function naturalCopy(value) {
  for (const [original, replacement] of replacements) value = value.replaceAll(original, replacement);
  return value;
}

export function naturalDateRanges(value, lang) {
  return value.replace(/\b([A-Z]{3} \d{4}) [–-] ([A-Z]{3} \d{4})\b/g,
    (_, start, end) => lang === 'es' ? `de ${start} a ${end}` : `${start} to ${end}`);
}
