// The homepage's "From the lab" work showcase (#show-stage), lifted verbatim
// from the ankora.html snapshot's show-script so /services shows the same
// component. Only the homepage-specific injection code (which located its spot
// by searching the snapshot's text) is replaced by mountShowcase(el).
/* eslint-disable */
// @ts-nocheck

let mounted = false;

export function mountShowcase(el) {
  if (mounted && el.getAttribute("data-built") === "1") return;
  mounted = true;
  run(el);
}

function run(el) {

  var RM=window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Projects from Salil's portfolio (saliltimalsina.com.np), done before
  // Ankora; shown as the founding team's work, with credit to their owners.
  // No outcome figures on purpose: we only state what we did and when.
  var P=[
    {n:"Telvox",cat:"AI voice platform",yr:"2026",
     d:"One command centre for teams to build their AI voice agents, audit what they said, and bill for it.",
     role:["Product Design","AI Platform"],
     img:"/images/work/telvox-card.webp",thumb:1,pos:"0% 50%",alt:"Telvox AI voice agent platform",ic:"wave",
     url:"https://telvox.ai",dom:"telvox.ai",live:1},
    {n:"OCCS",cat:"Call centre platform",yr:"2024–2026",
     d:"The screen 300+ call centre clerks work in all day, with everything needed during a live call on one screen.",
     role:["UX","Product Design","Research"],
     img:"/images/work/occs-card.webp",thumb:1,alt:"OCCS callbacks screen with an incoming call, on a laptop",ic:"srv",
     url:"#",dom:"OCCS clerk console",live:0},
    {n:"Mantra Ideas",cat:"Agency website",yr:"2026",
     d:"Mantra Ideas’ own site, designed and built down to every pixel and every line.",
     role:["Web Design","Development"],
     img:"/images/work/mantra-ideas.webp",alt:"Mantra Ideas homepage",ic:"cube",
     url:"https://mantraideas.com",dom:"mantraideas.com",live:1},
    {n:"Telvox.ai",cat:"Landing page",yr:"2026",
     d:"The site that pitches Telvox before the demo does.",
     role:["Landing Page","Web Design","Development"],
     img:"/images/work/telvox-site-card.webp",thumb:1,alt:"Telvox marketing site on a laptop",ic:"arch",
     url:"https://telvox.ai",dom:"telvox.ai",live:1},
    {n:"Hukut",cat:"E-commerce",yr:"2025",
     d:"Nepal’s gadget store, rebuilt so visitors actually become buyers.",
     role:["E-commerce","Product Design"],
     img:"/images/work/hukut-card.webp",thumb:1,alt:"Hukut gadget store on a laptop",ic:"bag",
     url:"https://hukut.com",dom:"hukut.com",live:1}
  ];

  var LOCK='<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="7" width="10" height="7" rx="1.5"/><path d="M5 7V5a3 3 0 0 1 6 0v2"/></svg>';
  var PIN='<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 14.5s5-4.4 5-8.2A5 5 0 0 0 3 6.3c0 3.8 5 8.2 5 8.2Z"/><circle cx="8" cy="6.2" r="1.8"/></svg>';
  var TREND='<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l3.4-3.4 2.4 2.4L13 5.2"/><path d="M9.6 5.2H13v3.4"/></svg>';
  var PREV='<svg viewBox="0 0 16 16"><path d="M10 3.5L5.5 8l4.5 4.5"/></svg>';
  var NEXT='<svg viewBox="0 0 16 16"><path d="M6 3.5L10.5 8 6 12.5"/></svg>';
  var CPEN='<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M11 3l2 2-7 7-3 1 1-3 7-7Z"/></svg>';
  var CCODE='<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 5L3 8l3 3M10 5l3 3-3 3"/></svg>';
  var CLAYER='<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><path d="M8 2.4l5.4 3-5.4 3-5.4-3 5.4-3Z"/><path d="M2.6 8.4l5.4 3 5.4-3M2.6 11l5.4 3 5.4-3"/></svg>';
  var CSPARK='<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><path d="M8 2.5l1.4 3.6L13 7.5l-3.6 1.4L8 12.5 6.6 8.9 3 7.5l3.6-1.4L8 2.5Z"/></svg>';
  var CHIPIC=[CPEN,CCODE,CLAYER,CSPARK];
  var ICONS={
    bag:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 6h8l-.6 8a1 1 0 0 1-1 .9H5.6a1 1 0 0 1-1-.9L4 6Z"/><path d="M6 6V5a2 2 0 0 1 4 0v1"/></svg>',
    wave:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M3 7.5v1M5.5 5.5v5M8 3v10M10.5 5.5v5M13 7v2"/></svg>',
    cube:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M8 2.6 13.5 6v4L8 13.4 2.5 10V6L8 2.6Z"/><path d="M2.5 6 8 9l5.5-3M8 9v4.4"/></svg>',
    leaf:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M13 3c0 6-3.6 9.6-9 9.6C3.4 7 7 3.4 13 3Z"/><path d="M4.5 12.4C7 9.6 9.4 7.6 11.8 6"/></svg>',
    arch:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="3" y="3" width="10" height="3" rx="1"/><path d="M4 6.5h8V12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6.5Z"/><path d="M6.5 9h3"/></svg>',
    srv:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="3" y="3.2" width="10" height="4.2" rx="1.1"/><rect x="3" y="8.6" width="10" height="4.2" rx="1.1"/><path d="M5.4 5.3h.01M5.4 10.7h.01" stroke-linecap="round"/></svg>'
  };

  function num(i){return ("0"+(i+1)).slice(-2);}
  function shot(p){return p.img;}
  function chips(a){var s="";for(var i=0;i<a.length;i++)s+='<span class="shw-chip">'+(CHIPIC[i%CHIPIC.length])+a[i]+'</span>';return s;}

  function build(el){
    el.className=el.classList.contains("is-pinned")?"shw is-pinned":"shw";
    builtMobile=mobileMode();
    el.innerHTML = builtMobile ? mobileMarkup() : desktopMarkup();
    el.setAttribute("data-built","1");
    wire(el);
  }

  function desktopMarkup(){
    var folders="";
    for(var i=0;i<P.length;i++){var p=P[i];
      folders+='<button type="button" class="shw-folder" data-i="'+i+'" aria-pressed="false">'+
        '<span class="shw-folder-main"><span class="shw-folder-idx">'+num(i)+'</span>'+
        '<span class="shw-folder-name">'+p.n+'</span>'+
        '<span class="shw-folder-cat">'+p.cat+'</span></span>'+
        '<span class="shw-folder-ic">'+ICONS[p.ic]+'</span></button>';
    }
    var vsteps='<span class="shw-vfill"></span>';
    for(var k=0;k<P.length;k++) vsteps+='<button type="button" class="shw-vstep" data-i="'+k+'" aria-label="Go to project '+num(k)+'"><span class="d"></span></button>';
    return '<div class="shw-pin"><div class="shw-wrap">'+
        '<div class="shw-cols">'+
          '<aside class="shw-right2 shw-reveal">'+
            '<span class="shw-rlabel">From our founding team</span>'+
            '<div class="shw-railrow">'+
              '<div class="shw-vtl" id="shw-steps">'+vsteps+'</div>'+
              '<div class="shw-folders" id="shw-folders">'+folders+'</div>'+
            '</div>'+
            '<p class="shw-note">Products our founding team designed and built before Ankora, at previous companies. Names and marks belong to their owners.</p>'+
          '</aside>'+
          '<div class="shw-stage shw-reveal"><div class="shw-card" id="shw-card"></div></div>'+
        '</div>'+
      '</div></div>';
  }

  function mobileMarkup(){
    var secs="";
    for(var i=0;i<P.length;i++){var p=P[i];
      var loc='<span class="shw-m-loc">'+p.yr+'</span>';
      secs+='<section class="shw-m-sec" data-i="'+i+'">'+
        '<span class="shw-m-num">'+num(i)+'</span>'+
        '<h3 class="shw-m-name">'+p.n+'</h3>'+
        '<div class="shw-m-cat">'+p.cat+'</div>'+
        loc+
        '<p class="shw-m-desc">'+p.d+'</p>'+
        '<div class="shw-chips">'+'<span class="shw-chip" style="background:none;border:0;padding-left:0;opacity:.6;font-size:11px;letter-spacing:.14em;text-transform:uppercase">Our role</span>'+chips(p.role)+'</div>'+
      '</section>';
    }
    return '<div class="shw-pin"><div class="shw-wrap shw-m">'+
        '<div class="shw-m-top">'+
          '<div class="shw-m-head">'+
            '<span class="shw-rlabel">From our founding team</span>'+
            '<div class="shw-m-prog"><span class="shw-m-bar"><i></i></span><span class="shw-m-count">1/'+P.length+'</span></div>'+
          '</div>'+
          '<div class="shw-m-card" id="shw-card"></div>'+
        '</div>'+
        '<div class="shw-m-secs">'+secs+'</div>'+
      '</div></div>';
  }

  var active=0, swapT=0, builtMobile=false, elWired=false;

  // Portfolio thumbnails are finished compositions (device mockups on their
  // own grounds), so they're shown full-bleed rather than inside a fake
  // browser window.
  // Portfolio thumbnails are finished compositions, so they fill the frame
  // with no fake browser bar, trimmed only as much as the frame needs (`pos`
  // picks which side to keep). Live-site screenshots keep the browser.
  function fillBrowser(p){
    var fr=shot(p);
    var tag=p.live?'a':'div';
    var attr=p.live?(' href="'+p.url+'" target="_blank" rel="noreferrer"'):'';
    if(p.thumb) return '<'+tag+' class="shw-browser shw-thumb"'+attr+'>'+
        '<img class="shw-bshot" src="'+fr+'" alt="'+p.alt+'"'+(p.pos?' style="object-position:'+p.pos+'"':'')+' loading="lazy" decoding="async"></'+tag+'>';
    return '<'+tag+' class="shw-browser"'+attr+'>'+
        '<div class="shw-bbar"><span class="dots"><i></i><i></i><i></i></span><span class="shw-burl">'+LOCK+p.dom+'</span></div>'+
        '<img class="shw-bshot" src="'+fr+'" alt="'+p.alt+'" loading="lazy" decoding="async"></'+tag+'>';
  }
  function fillCard(p,i){
    return fillBrowser(p)+
      '<div class="shw-meta">'+
        '<div class="shw-mhead"><span class="shw-mnum">'+num(i)+'</span>'+
          '<h2 class="shw-mname">'+p.n+'</h2>'+
          '<span class="shw-mloc">'+p.yr+'</span></div>'+
        '<p class="shw-pdesc">'+p.d+'</p>'+
        '<div class="shw-mfoot">'+
          '<div class="shw-chips">'+'<span class="shw-chip" style="background:none;border:0;padding-left:0;opacity:.6;font-size:11px;letter-spacing:.14em;text-transform:uppercase">Our role</span>'+chips(p.role)+'</div>'+
        '</div>'+
      '</div>';
  }

  function setActive(i,instant){
    if(i<0)i=0; if(i>P.length-1)i=P.length-1;
    active=i; var p=P[i];
    var root=document.getElementById("show-stage"); if(!root) return;
    var card=root.querySelector("#shw-card");
    root.querySelectorAll(".shw-folder").forEach(function(b){var bi=+b.dataset.i,on=bi===i;
      b.classList.toggle("is-active",on); b.classList.toggle("is-done",bi<i);
      b.setAttribute("aria-pressed",on?"true":"false"); b.style.zIndex=on?20:(P.length-bi);});
    root.querySelectorAll(".shw-vstep").forEach(function(d){var di=+d.dataset.i;
      d.classList.toggle("cur",di===i); d.classList.toggle("done",di<i);});
    // mobile: section highlight + progress bar + count
    root.querySelectorAll(".shw-m-sec").forEach(function(s){s.classList.toggle("is-active",+s.dataset.i===i);});
    var bar=root.querySelector(".shw-m-bar i"); if(bar) bar.style.width=Math.round((i+1)/P.length*100)+"%";
    var cnt=root.querySelector(".shw-m-count"); if(cnt) cnt.textContent=(i+1)+"/"+P.length;
    if(!card) return;
    var html=builtMobile?fillBrowser(p):fillCard(p,i);
    if(swapT){clearTimeout(swapT);swapT=0;}
    if(instant||RM){ card.classList.remove("swap"); card.innerHTML=html; return; }
    card.classList.add("swap");
    swapT=setTimeout(function(){ card.innerHTML=html;
      requestAnimationFrame(function(){ card.classList.remove("swap"); }); swapT=0; },150);
  }

  // ---- pin + scroll-driven switching ----
  function PIN_ON(){return window.innerWidth>1080 && !window.matchMedia("(pointer: coarse)").matches;}
  function mobileMode(){return !PIN_ON();}   // narrow / touch → sticky-browser mobile layout
  // Height of any fixed/sticky header pinned to the top of the viewport, so the
  // pinned stage can sit BELOW it instead of being covered (e.g. the site nav).
  function topInset(){
    var n=0,q=document.querySelectorAll('.rt-fixed.rt-top-0, header');
    for(var i=0;i<q.length;i++){ var el=q[i],cs=getComputedStyle(el);
      if(cs.position!=="fixed"&&cs.position!=="sticky") continue;
      var r=el.getBoundingClientRect();
      if(r.height>10&&r.height<240&&r.width>window.innerWidth*0.5&&r.top<8) n=Math.max(n,r.bottom);
    }
    return Math.round(n);
  }
  function layoutPin(){
    var s=document.getElementById("show-stage"); if(!s) return;
    s.style.setProperty("--shw-top",topInset()+"px"); // below any fixed nav (desktop pin top + mobile sticky offset)
    if(PIN_ON()){
      s.classList.add("is-pinned");
      s.style.setProperty("--shw-h",(100+(P.length-1)*64)+"vh");
    }
    else { s.classList.remove("is-pinned"); s.style.removeProperty("--shw-h"); }
  }
  function scrollFrac(s){
    var total=s.offsetHeight-window.innerHeight; if(total<=0) return 0;
    return Math.min(Math.max(-s.getBoundingClientRect().top,0),total)/total;
  }
  function onScroll(){
    var s=document.getElementById("show-stage"); if(!s) return;
    if(builtMobile){ onScrollMobile(s); return; }
    if(!s.classList.contains("is-pinned")) return;
    var p=scrollFrac(s);
    s.style.setProperty("--shw-prog",p.toFixed(4));   // continuous fill: motion even while pinned
    var idx=Math.round(p*(P.length-1)); if(idx!==active) setActive(idx);
  }
  // mobile: the active project is the last section whose top has crossed the reading line
  function onScrollMobile(s){
    var secs=s.querySelectorAll(".shw-m-sec"); if(!secs.length) return;
    var line=window.innerHeight*0.55, best=0;
    for(var i=0;i<secs.length;i++){ if(secs[i].getBoundingClientRect().top<=line) best=i; }
    if(best!==active) setActive(best);
    // mask the band above the pinned header (else dimmed sections ghost through the gap)
    var topEl=s.querySelector(".shw-m-top");
    if(topEl){ var off=(parseFloat(getComputedStyle(s).getPropertyValue("--shw-top"))||0)+8;
      topEl.classList.toggle("stuck", topEl.getBoundingClientRect().top<=off+1); }
  }
  function scrollToIndex(i){
    if(i<0)i=0; if(i>P.length-1)i=P.length-1;
    var s=document.getElementById("show-stage"); if(!s){ setActive(i); return; }
    if(builtMobile){
      var sec=s.querySelector('.shw-m-sec[data-i="'+i+'"]');
      if(sec){ var y=window.pageYOffset+sec.getBoundingClientRect().top-window.innerHeight*0.42;
        window.scrollTo({top:Math.round(y),behavior:RM?"auto":"smooth"}); }
      setActive(i); return;
    }
    if(!s.classList.contains("is-pinned")){ setActive(i); return; }
    var total=s.offsetHeight-window.innerHeight;
    var top=window.pageYOffset+s.getBoundingClientRect().top+(i/(P.length-1))*total;
    window.scrollTo({top:Math.round(top),behavior:RM?"auto":"smooth"});
    setActive(i);
  }
  var ticking=false;
  function sched(){ if(!ticking){ticking=true;requestAnimationFrame(function(){ticking=false;onScroll();});} }
  var boundGlobal=false;
  function bindGlobal(){ if(boundGlobal) return; boundGlobal=true;
    window.addEventListener("scroll",sched,{passive:true});
    window.addEventListener("resize",function(){
      var el=document.getElementById("show-stage");
      if(el && mobileMode()!==builtMobile){ build(el); return; }   // crossed the breakpoint → rebuild layout
      layoutPin(); sched();
    });
  }

  function wire(el){
    if(!elWired){ elWired=true;   // attach delegated listeners to the persistent element only once
      el.addEventListener("click",function(e){
        var f=e.target.closest(".shw-folder"); if(f){ scrollToIndex(+f.dataset.i); return; }
        var d=e.target.closest(".shw-vstep"); if(d){ scrollToIndex(+d.dataset.i); return; }
        var c=e.target.closest('a[href="#"]'); if(c && el.contains(c)){ e.preventDefault(); }
      });
      el.addEventListener("keydown",function(e){
        if(e.key==="ArrowRight"){ scrollToIndex(active+1); e.preventDefault(); }
        else if(e.key==="ArrowLeft"){ scrollToIndex(active-1); e.preventDefault(); }
      });
    }
    layoutPin(); bindGlobal();
    setActive(active,true);
    el.style.setProperty("--shw-prog",(P.length>1?active/(P.length-1):0).toFixed(4));
    onScroll();
    var rev=el.querySelectorAll(".shw-reveal");
    if(RM){ rev.forEach(function(n){n.classList.add("in");}); }
    else{
      var io=new IntersectionObserver(function(es){es.forEach(function(en){
        if(en.isIntersecting){ var n=en.target; setTimeout(function(){n.classList.add("in");},(+n.dataset.d||0)); io.unobserve(n);} });
      },{rootMargin:"0px 0px -8% 0px",threshold:.05});
      rev.forEach(function(n,ix){ n.dataset.d=ix*110; io.observe(n); });
    }
  }


  el.id = "show-stage";
  build(el);
}
