// Anatomical body/foot subset of MediaPipe Pose's 33-landmark topology.
// Hand-placed illustration coordinates, not model inference or measured data.
// Source: google-ai-edge/mediapipe/python/solutions/pose_connections.py
// Coordinates use the original 1254px square artwork, scaled with the image.
// Hip points sit over the pelvis rather than the waist. Heel points follow
// the posterior foot contour. Omit ankle-to-toe diagonals for an open foot chain.
// Display adaptation inspired by the reference: central head, neck, trunk
// and pelvis anchors (33–36), with paired limb branches. These central
// anchors are illustrative, not literal MediaPipe landmark IDs.
export const landmarks = {
  11:[885,350], 12:[735,250],
  13:[985,502], 14:[535,225],
  15:[1090,380], 16:[392,355],
  33:[645,570],
  34:[915,178], 35:[835,295], 36:[760,440],
  25:[925,675], 26:[460,766],
  27:[723,893], 28:[211,976],
  29:[655,912], 30:[153,978],
  31:[778,1017], 32:[225,1120]
};
export const connections = [
  [34,35],[35,36],[36,33],
  [35,11],[35,12],[11,13],[13,15],[12,14],[14,16],
  [33,25],[25,27],[33,26],[26,28],
  [27,29],[29,31],[28,30],[30,32]
];
export function heroPose(){
  const lines=connections.map(([a,b])=>`<line x1="${landmarks[a][0]}" y1="${landmarks[a][1]}" x2="${landmarks[b][0]}" y2="${landmarks[b][1]}"/>`).join('');
  const dots=Object.entries(landmarks).map(([id,[x,y]])=>`<circle data-landmark="${id}" cx="${x}" cy="${y}" r="${Number(id)>=29&&Number(id)<=32?6:9}"/>`).join('');
  return `<g class="pose-overlay" transform="scale(${1280/1254})" aria-hidden="true" pointer-events="none"><g stroke="#2563eb" stroke-width="3.5" stroke-linecap="round" fill="none">${lines}</g><g fill="#2563eb">${dots}</g></g>`;
}
