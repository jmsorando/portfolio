// Approved academic presentation shared by the main pages and review routes.
// Existing career records remain the source of dates, roles and achievements.
export const academicLogos = [
  {id:'ucl', file:'ucl.svg', name:'University College London (UCL)', width:1394, height:391},
  {id:'muay-thai', file:'muay-thai.png', name:'UCL Muay Thai Club', width:256, height:256},
  {id:'spanish-latin-american', file:'spanish-latin-american.png', name:'Spanish and Latin American Society', width:256, height:254},
  {id:'surgery-interventional', file:'surgery-interventional.png', name:'Surgery and Interventional Science Society', width:256, height:256}
];

function logoImage(logo) {
  return `<img class="academic-identity-logo${logo.id==='ucl'?' academic-identity-ucl':''}" src="/assets/academic/${logo.file}" width="${logo.width}" height="${logo.height}" alt="" loading="lazy" decoding="async">`;
}

export function addAcademicIdentity(html) {
  const boundary='<!-- Academic & Leadership -->';
  const start=html.indexOf(boundary);
  const end=html.indexOf('</section>',start);
  if(start<0 || end<0) throw new Error('Academic identity: missing academic section');
  let academic=html.slice(start,end);
  academic=academic.replace(/(<h3\b[^>]*>)University College London \(UCL\)(<\/h3>)/,'$1University College London$2');
  let degreeCount=0;
  academic=academic.replace(/(<div class="academic-card academic-degree">)\s*<span\b[^>]*>([^<]*)<\/span>/,(_,open,date)=>{
    degreeCount++;
    return `${open.replace('>',' data-academic-identity="ucl">')}
      <div class="academic-identity-degree-header"><span class="academic-identity-date">${date}</span>${logoImage(academicLogos[0])}</div>`;
  });
  const seen=new Set();
  academic=academic.replace(/<div class="academic-card">([\s\S]*?)<\/div>/g,(_,card)=>{
    const logo=academicLogos.slice(1).find(item=>card.includes(item.id==='spanish-latin-american'?'UCL Spanish and Latino American Society':item.id==='surgery-interventional'?'Surgery and Interventional Sciences Society':item.name));
    if(!logo || seen.has(logo.id)) throw new Error('Academic identity: unexpected society card');
    seen.add(logo.id);
    const date=card.match(/<span\b[^>]*>([^<]*)<\/span>/)?.[1];
    const heading=card.match(/<h3\b[^>]*>([\s\S]*?)<\/h3>/)?.[1];
    if(!date || !heading) throw new Error(`Academic identity: missing date or role for ${logo.id}`);
    let role=heading;
    let description=card.replace(/<span\b[^>]*>[^<]*<\/span>/,'').replace(/<h3\b[^>]*>[\s\S]*?<\/h3>/,'').trim();
    if(logo.id==='muay-thai') {
      const prefix=logo.name+' · ';
      if(!heading.startsWith(prefix)) throw new Error('Academic identity: missing Muay Thai role');
      role=heading.slice(prefix.length);
    } else {
      description=description.replace(/<p\b[^>]*>[^<]*<\/p>/,'').trim();
    }
    return `<div class="academic-card academic-society" data-academic-identity="${logo.id}">
      <div class="academic-identity-header">
        ${logoImage(logo)}
        <div class="academic-identity-details"><span class="academic-identity-name">${logo.name}</span><span class="academic-identity-date">${date}</span></div>
      </div>
      <h3>${role}</h3>
      ${description}
    </div>`;
  });
  if(degreeCount!==1 || seen.size!==3) throw new Error('Academic identity: expected one degree and three societies');
  return html.slice(0,start)+academic+html.slice(end);
}
