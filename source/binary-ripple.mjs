// Illustrative ground contact shared by the approved hero and preview. Coordinates use the mirrored avatar.
export function binaryRipple(){
 const ring=(rx,ry)=>{
  // Space characters by distance along the ellipse, not by angle: fewer at the sides.
  const samples=[{a:0,length:0}];
  let length=0,previous={x:rx,y:0};
  for(let i=1;i<=2048;i++){
   const a=2*Math.PI*i/2048,x=rx*Math.cos(a),y=ry*Math.sin(a);
   length+=Math.hypot(x-previous.x,y-previous.y);
   samples.push({a,length});previous={x,y};
  }
  const count=2*Math.floor(length/64);
  let cursor=1;
  return `<g class="binary-ring">`+Array.from({length:count},(_,i)=>{
   const distance=i*length/count;
   while(samples[cursor].length<distance)cursor++;
   const lo=samples[cursor-1],hi=samples[cursor];
   const a=lo.a+(hi.a-lo.a)*(distance-lo.length)/(hi.length-lo.length);
   const x=1128+rx*Math.cos(a),y=1171+ry*Math.sin(a);
   return `<text class="${i%2?'binary-extra':'binary-core'}" x="${x.toFixed(2)}" y="${y.toFixed(2)}">${'01001101'[i%8]}</text>`;
  }).join('')+'</g>';
 };
 return `<g class="binary-ground" aria-hidden="true" pointer-events="none" transform="translate(1128 1171) scale(.85) translate(-1128 -1171)">
 <style>
 .binary-ground .binary-ring{fill:#2563eb}
 @media(forced-colors:active){.binary-ground .binary-ring{fill:CanvasText}}
 </style>
 <ellipse cx="1128" cy="1171" rx="59" ry="10" fill="#172033" opacity=".045"/>
 <ellipse cx="1128" cy="1171" rx="38" ry="6" fill="#172033" opacity=".04"/>
 <g fill="#2563eb" font-family="monospace" font-size="20" font-weight="600" text-anchor="middle" dominant-baseline="middle">${ring(270,81)}${ring(180,51)}${ring(90,21)}</g>
 </g>`;
}
