(() => {
  // Keep content and the motion control usable without observer support.
  const Observer=window.IntersectionObserver||class {
    constructor(callback){this.callback=callback;}
    observe(target){this.callback([{target,isIntersecting:true}]);}
    unobserve(){}
    disconnect(){}
  };
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const motionButton=document.querySelector('.motion-toggle');
  const spanish=document.documentElement.lang==='es';
  let paused=false;
  try{paused=sessionStorage.getItem('portfolio-motion-paused')==='true';}catch{}
  const syncMotion=()=>{
    document.body.classList.toggle('motion-paused',paused||reduced.matches);
    if(motionButton){
      motionButton.hidden=false;
      motionButton.disabled=reduced.matches;
      motionButton.textContent=reduced.matches?(spanish?'Movimiento reducido del sistema':'System reduced motion'):
        paused?(spanish?'Reanudar animaciones':'Resume animations'):(spanish?'Pausar animaciones':'Pause animations');
    }
    syncSequence();
  };
  motionButton?.addEventListener('click',()=>{
    paused=!paused;
    try{sessionStorage.setItem('portfolio-motion-paused',String(paused));}catch{}
    syncMotion();
  });
  const hero=document.querySelector('.hero-illustration');
  const heroSvg=hero?.querySelector('.hero-runner');
  const mobile=matchMedia('(max-width:900px)');
  const frameHero=()=>heroSvg?.setAttribute('viewBox',mobile.matches?'0 0 1320 1320':'0 0 1440 1320');
  frameHero();mobile.addEventListener('change',frameHero);
  // Keep the main wave halfway between the heading and paragraph in either language.
  const heroSection=document.querySelector('.portfolio-hero');
  const heroCopy=heroSection?.querySelector('.hero-copy');
  const alignWave=()=>{
    if(!heroCopy||mobile.matches)return;
    const title=heroCopy.querySelector('h1').getBoundingClientRect();
    const paragraph=heroCopy.querySelector('p').getBoundingClientRect();
    heroSection.style.setProperty('--hero-wave-center',`${(title.bottom+paragraph.top)/2-heroSection.getBoundingClientRect().top}px`);
  };
  alignWave();
  if(heroCopy&&'ResizeObserver' in window)new ResizeObserver(alignWave).observe(heroCopy);
  mobile.addEventListener('change',alignWave);
  document.fonts?.ready.then(alignWave);
  const slides=[...document.querySelectorAll('.hero-sport-slide')];
  let slideIndex=0,timer=null,transitionTimer=null,heroVisible=false,ready=false;
  const setSlide=index=>{slideIndex=index;slides.forEach((slide,i)=>{
    slide.style.visibility=i===index?'visible':'hidden';
    slide.classList.toggle('is-active',i===index);
  });};
  function nextSlide(){
    // Fade out fully before showing the next figure; never crossfade bodies.
    slides[slideIndex].classList.remove('is-active');
    transitionTimer=setTimeout(()=>{
      transitionTimer=null;
      setSlide((slideIndex+1)%slides.length);
    },650);
  }
  function syncSequence(){
    clearInterval(timer);timer=null;
    clearTimeout(transitionTimer);transitionTimer=null;
    if(reduced.matches){setSlide(0);return;}
    setSlide(slideIndex);
    if(ready&&heroVisible&&!document.hidden&&!paused)timer=setInterval(nextSlide,7000);
  }
  if(hero&&slides.length>1){
    new Observer(entries=>{heroVisible=entries[0].isIntersecting;syncSequence();},{threshold:.15}).observe(hero);
    document.addEventListener('visibilitychange',syncSequence);
    reduced.addEventListener('change',syncMotion);
    Promise.all(slides.slice(1).map(slide=>{const image=new Image();image.src=slide.querySelector('image').getAttribute('href');return image.decode();})).then(()=>{ready=true;syncSequence();}).catch(()=>{ready=false;syncSequence();});
  }
  const headings=[...document.querySelectorAll('#projects h2,#experience h2,#contact h2')];
  const reveal=new Observer(entries=>entries.forEach(({target,isIntersecting})=>{
    if(isIntersecting){target.classList.add('in');reveal.unobserve(target);}
  }),{threshold:.4});
  if(!reduced.matches)headings.forEach(h=>{
    h.classList.add('kinetic','kinetic-ready');reveal.observe(h);
  });
  const signals=[...document.querySelectorAll('.ecg')];
  const signalObserver=new Observer(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');signalObserver.unobserve(e.target);}}),{threshold:.1});
  signals.forEach(el=>signalObserver.observe(el));
  reduced.addEventListener('change',()=>{if(reduced.matches){headings.forEach(h=>h.classList.add('in'));reveal.disconnect();}});
  syncMotion();
})();
