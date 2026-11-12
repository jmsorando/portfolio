import {optimizedImage} from './optimized-image.mjs';
export function pharmaVisual(lang,deliveryWidth=1900){
const mascot=optimizedImage('pharmamiku-mascot-alpha',540,deliveryWidth);
const es=lang==='es';
return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1900 828" role="img" aria-labelledby="title desc">
<title id="title">PharmaMiku · Great Agent Hack 2025</title>
<desc id="desc">${es?'Mascota e interfaz de PharmaMiku con el premio del público del equipo.':'PharmaMiku mascot and interface with the team’s Public Choice Award.'}</desc>
<defs><linearGradient id="award"><stop stop-color="#48228c"/><stop offset=".55" stop-color="#9139ed"/><stop offset="1" stop-color="#008cfa"/></linearGradient></defs>
<g font-family="Arial, sans-serif">
<g transform="translate(90 65)"><rect width="50" height="80" rx="25" fill="#f587bd"/><path d="M0 40V25A25 25 0 0 1 50 25V40Z" fill="#03b6ac"/><path d="M25 10V30M15 20H35" stroke="white" stroke-width="7"/><text x="68" y="61" font-size="70" font-weight="700" fill="#13c6bd">pharma<tspan fill="#f587bd">miku</tspan></text></g>
<!-- Entire canvas is transparent: the shared project navy is the only backdrop. -->
<g transform="translate(-93.6 -108.14) scale(1.23)"><rect x="320" y="218" width="910" height="492" rx="24" fill="#fff"/>
<path d="M344 218H480V710H344Q320 710 320 686V242Q320 218 344 218" fill="#a9efe2"/>
<rect x="338" y="256" width="122" height="35" rx="17" fill="#12bbae"/>
<text x="350" y="280" fill="white" font-size="18">${es?'Nuevo chat':'New chat'} +</text>
<text x="535" y="278" font-size="43" font-weight="700" fill="#22b8b0">pharma<tspan fill="#ef98c0">miku</tspan></text>
<line x1="515" y1="305" x2="1190" y2="305" stroke="#e5e9ef" stroke-width="2"/>
<rect x="515" y="333" width="672" height="74" rx="24" fill="#05b8aa"/>
<text x="541" y="364" fill="white" font-size="29"><tspan x="541">${es?'Hola, soy pharmamiku.':'Hi, I am pharmamiku.'}</tspan><tspan x="541" dy="30">${es?'¿Cómo puedo ayudarte hoy?':'How can I help you today?'}</tspan></text>
<rect x="592" y="433" width="595" height="80" rx="24" fill="#f78cbe"/>
<text x="617" y="466" fill="#4a2541" font-size="28"><tspan x="617">${es?'¿Puedo tomar una bebida energética':'Can I take an energy drink'}</tspan><tspan x="617" dy="29">${es?'con este medicamento?':'with this medicine?'}</tspan></text>
<rect x="515" y="607" width="672" height="57" rx="20" fill="#f6f8fc" stroke="#cbd5e1" stroke-width="2"/>
<text x="538" y="642" fill="#64748b" font-size="28">${es?'Escribe tu pregunta…':'Type your question…'}</text>
<path d="M1129 636H1161M1149 625L1161 636L1149 647" fill="none" stroke="#64748b" stroke-width="3"/>
</g><image href="${mascot}" x="20" y="227" width="425" height="554"/>
<g transform="translate(550.4 158) scale(.7)"><rect x="1330" y="160" width="470" height="117" fill="url(#award)"/>
<text x="1565" y="245" text-anchor="middle" fill="white" font-size="91" font-weight="700">WINNER</text>
<text x="1328" y="373" fill="white" font-size="61" font-weight="700">PUBLIC CHOICE</text>
<text x="1328" y="447" fill="#ae8aff" font-size="70" font-weight="700">AWARD</text>
<text x="1330" y="582" fill="white" font-size="49" font-weight="700">GREAT AGENT</text>
<rect x="1390" y="603" width="440" height="78" fill="url(#award)"/>
<text x="1410" y="661" fill="white" font-size="57" font-weight="700">HACK 2025</text>
</g></g></svg>`;
}

