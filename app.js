(() => {
 'use strict';
 const c=window.ELVIA, langs=window.ELVIA_LANG, $=s=>document.querySelector(s);
 let language='en', currentImage=0, activeLegal='site';
 try { const saved=localStorage.getItem('elvia-language'); if(langs[saved]) language=saved; } catch {}
 const text=()=>langs[language];
 document.querySelectorAll('[data-platform]').forEach(a=>{a.href=c.links[a.dataset.platform];a.target='_blank';a.rel='noopener noreferrer';});
 document.querySelectorAll('[data-email]').forEach(a=>{a.href='mailto:'+c.email;a.textContent=c.email;});
 function paragraphs(items){return items.map(value=>{const p=document.createElement('p');p.textContent=value;return p;});}
 function showImage(index){currentImage=(index+c.gallery.length)%c.gallery.length;$('#gallery-full').src=c.gallery[currentImage];$('#gallery-full').alt=text().alts[currentImage];$('#gallery-caption').textContent=text().gallery[currentImage];$('#gallery-count').textContent=(currentImage+1)+' / '+c.gallery.length;}
 function showLegal(){const t=text();$('#legal-title').textContent=activeLegal==='site'?t.legal:t.privacy;$('#legal-copy').replaceChildren(...paragraphs(activeLegal==='site'?t.rights:t.privacyText));const a=document.createElement('a');a.href='mailto:'+c.email;a.textContent=c.email;$('#legal-copy').append(a);}
 function render(){
  const t=text();document.documentElement.lang=language;document.title=t.title;document.querySelector('meta[name="description"]').content=t.description;$('#language').value=language;
  document.querySelectorAll('[data-t]').forEach(el=>{el.textContent=t[el.dataset.t];});
  $('#about-text').replaceChildren(...paragraphs(t.about));
  $('#identity').replaceChildren(...t.identity.map(([title,body])=>{const a=document.createElement('article'),h=document.createElement('h3'),p=document.createElement('p');h.textContent=title;p.textContent=body;a.append(h,p);return a;}));
  $('#gallery').replaceChildren(...c.gallery.map((src,i)=>{const f=document.createElement('figure'),b=document.createElement('button'),img=document.createElement('img'),cap=document.createElement('figcaption');img.src=src;img.alt=t.alts[i];img.loading='lazy';img.width=640;img.height=800;b.setAttribute('aria-label',t.enlarge+': '+t.gallery[i]);b.append(img);cap.textContent=t.gallery[i];b.addEventListener('click',()=>{showImage(i);$('#gallery-dialog').showModal();});f.append(b,cap);return f;}));
  $('.about-portrait').alt=t.alts[0];$('.music-image').alt=t.alts[5];$('.video-feature img').alt=t.alts[4];
  document.querySelectorAll('.dialog-close').forEach(b=>b.setAttribute('aria-label',t.close));$('#gallery-prev').setAttribute('aria-label',t.previous);$('#gallery-next').setAttribute('aria-label',t.next);$('#navigation').setAttribute('aria-label',t.menu);
  $('#copy-status').textContent='';if($('#gallery-dialog').open)showImage(currentImage);if($('#legal-dialog').open)showLegal();
 }
 $('#language').addEventListener('change',e=>{language=e.target.value;try{localStorage.setItem('elvia-language',language);}catch{}render();});
 const menu=$('.menu-toggle'),nav=$('#navigation');function closeMenu(){menu.setAttribute('aria-expanded','false');nav.classList.remove('open');}
 menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
 $('#gallery-next').addEventListener('click',()=>showImage(currentImage+1));$('#gallery-prev').addEventListener('click',()=>showImage(currentImage-1));$('#gallery-dialog').addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();showImage(currentImage+1);}if(e.key==='ArrowLeft'){e.preventDefault();showImage(currentImage-1);}});
 document.querySelectorAll('dialog').forEach(d=>{d.querySelector('.dialog-close').addEventListener('click',()=>d.close());d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}});});
 document.querySelectorAll('[data-legal]').forEach(b=>b.addEventListener('click',()=>{activeLegal=b.dataset.legal;showLegal();$('#legal-dialog').showModal();}));
 $('#copy-email').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(c.email);$('#copy-status').textContent=text().copied;}catch{$('#copy-status').textContent=text().copyFail;}});
 $('#download-kit').addEventListener('click',()=>{const t=text();const content=['ELVIA VAYNE',t.aiArtist,'',...t.about,'',...t.identity.flatMap(([a,b])=>[a,b,'']),t.pressContact,c.email,'',...Object.entries(c.links).map(([a,b])=>a+': '+b),'',t.pressAsset,'',...t.rights].join('\n');const url=URL.createObjectURL(new Blob(['\uFEFF'+content],{type:'text/plain;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download='ELVIA-VAYNE-press-notes-'+language+'.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
 render();
})();
