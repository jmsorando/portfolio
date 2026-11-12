const links=[...document.querySelectorAll('[data-language]')];
function destination(link, section=location.hash){
 const url=new URL(link.getAttribute('href'),location.origin);
 url.search=location.search;
 url.hash=section;
 return url.pathname+url.search+url.hash;
}
function syncLinks(){links.forEach(link=>link.href=destination(link));}
syncLinks();
addEventListener('hashchange',syncLinks);
links.forEach(link=>link.addEventListener('click',()=>{
 const sections=[...document.querySelectorAll('section[id]')];
 const current=sections.filter(s=>s.getBoundingClientRect().top<=innerHeight*.45).at(-1);
 link.href=destination(link,location.hash || (current?'#'+current.id:'#top'));
}));
