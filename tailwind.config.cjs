module.exports = {
  content: ['./dist/{en,es}/index.html', './source/**/*.{html,js,mjs}', './build-*.mjs'],
  darkMode: 'class',
  theme: {extend: {
    colors: {alabaster:'#FAF9F6',ink:'#121212',cobalt:'#2563EB',cobaltDark:'#1D4ED8',warmSand:'#E5E2DC',cardLight:'#FFFFFF',uclNavy:'#002147'},
    fontFamily: {
      sans:['"Plus Jakarta Sans"','sans-serif'], mono:['"JetBrains Mono"','monospace'],
      display:['"Space Grotesk"','sans-serif'], serif:['"Space Grotesk"','sans-serif']
    }
  }}
};
