const LOGO='egade-business-school-logo.jpg';
function LG(h){return `<img src="${LOGO}" style="height:${h||15}px;object-fit:contain;mix-blend-mode:multiply">`}
let score=0,imgC=0,vidC=0,auC=0,xpC=0;
const viewed={};
function IM(desc,ar,sz){imgC++;const rid='img-'+imgC;return `<div class="img-slot" data-rid="${rid}" style="aspect-ratio:${ar||'16/9'};background:url('imagen-de-prueba.jpg') center/cover no-repeat" onclick="fsOpen(this,'img');markViewed(this)"><button class="fs-btn" onclick="event.stopPropagation();fsOpen(this.parentElement,'img');markViewed(this.parentElement)">&#x26F6;</button><div class="img-n" style="background:rgba(255,255,255,.85);padding:2px 8px;border-radius:4px">Imagen ${imgC}</div><div class="img-d" style="background:rgba(255,255,255,.85);padding:1px 6px;border-radius:3px">${desc||''}</div></div>`}
function VD(lbl,dur,mp4){vidC++;const rid='vid-'+vidC;return `<div class="vw" data-rid="${rid}"><button class="fs-btn" onclick="fsOpen(this.parentElement,'vid');markViewed(this.parentElement)">&#x26F6;</button><div class="vd-poster" id="vp-${vidC}" onclick="startVD(this,${vidC})"><img src="${LOGO}" style="height:48px;object-fit:contain;opacity:.8"><div style="margin-top:10px;font-size:13px;font-weight:600;color:#333">${lbl}</div><div style="margin-top:4px;font-size:10px;color:#999">${dur}</div><div class="vd-play">&#9654;</div></div><video id="vv-${vidC}" controls preload="metadata" style="width:100%;aspect-ratio:16/9;background:#fff;display:none" onplay="markViewed(this.closest('.vw'))"><source src="${mp4||'video-prueba.mp4'}" type="video/mp4"></video><div class="vl"><span>Video ${vidC} — ${lbl}</span><span>${dur}</span></div></div>`}
function AU(lbl,dur,src){auC++;const rid='au-'+auC;const id=auC;return `<div class="ap" data-rid="${rid}" data-au-id="${id}">
<audio id="aud-${id}" ${src?'src="'+src+'"':''} preload="metadata"></audio>
<div class="ap-top"><div class="ap-info"><div class="at2">${lbl}</div><div class="ad2">EGADE Business School</div></div></div>
<div class="ap-progress" onclick="seekAU(event,${id})"><div class="ap-progress-fill" id="apf-${id}"></div></div>
<div class="ap-time"><span id="apt-${id}">0:00</span><span>${dur}</span></div>
<div class="ap-controls">
<button class="ab-sm" onclick="skipAU(${id},-10)">&#9666;&#9666;</button>
<button class="ab" id="apb-${id}" onclick="playAU(this,${id});markViewed(this.closest('.ap'))">&#9654;</button>
<button class="ab-sm" onclick="skipAU(${id},10)">&#9656;&#9656;</button>
</div></div>`}
function XP(t,c){xpC++;const rid='xp-'+xpC;return `<div class="xb" data-rid="${rid}"><div class="xt" onclick="togX(this);markViewed(this.closest('.xb'))">${t}<span class="xar">&#9656;</span></div><div class="xc">${c}</div></div>`}

function DYK(text){return `<div class="dyk"><div class="dyk-ico">?</div><div class="dyk-txt">${text}</div></div>`}
function TKW(title,desc,pdf){return `<div class="tkw-pdf"><div class="tkw-pdf-ico">PDF</div><div class="tkw-pdf-info"><span class="tkw-pdf-tag">TAKEAWAY</span><h4>${title}</h4><p>${desc}</p></div><a class="tkw-pdf-btn" href="${pdf||'takeaway-prueba.pdf'}" target="_blank" download>Descargar PDF</a></div>`}
function AVT(name,initials,text){return `<div class="avatar-tip"><div class="avatar-circle">${initials}</div><div class="avatar-bubble"><span class="av-name">${name}</span>${text}</div></div>`}

function FILL(sentence,blanks,options){
  let html='<div class="fill-wrap" data-blanks=\''+JSON.stringify(blanks)+'\' data-p="10"><div class="fill-sentence">';
  let parts=sentence.split('___');
  parts.forEach((p,i)=>{html+=p;if(i<parts.length-1)html+='<span class="fill-blank" data-idx="'+i+'" onclick="pickBlank(this)">___</span>'});
  html+='</div><div class="fill-options">';
  options.forEach(o=>{html+='<div class="fill-opt" onclick="fillOpt(this)">'+o+'</div>'});
  html+='</div><button class="btn" onclick="chkFill(this)" style="margin-top:6px">Verificar</button><div class="fb"></div></div>';
  return html}
let activeFillBlank=null;
function pickBlank(el){activeFillBlank=el;document.querySelectorAll('.fill-blank').forEach(b=>b.style.background='');el.style.background='rgba(184,150,62,.15)'}
function fillOpt(el){if(!activeFillBlank)return;activeFillBlank.textContent=el.textContent;activeFillBlank.classList.add('filled');el.classList.add('used');activeFillBlank.style.background='';activeFillBlank=null}
function chkFill(btn){if(btn.disabled)return;btn.disabled=true;const w=btn.closest('.fill-wrap');const blanks=JSON.parse(w.dataset.blanks);const spans=[...w.querySelectorAll('.fill-blank')];let ok=true;spans.forEach((s,i)=>{if(s.textContent.trim()===blanks[i]){s.classList.add('filled');s.classList.remove('wrong')}else{s.classList.add('wrong');s.classList.remove('filled');ok=false}});const fb=w.querySelector('.fb');if(ok){fb.className='fb sh y';fb.textContent='Correcto! Todas las palabras estan en su lugar.'}else{fb.className='fb sh n';fb.textContent='Revisa las palabras marcadas en rojo. Respuestas: '+blanks.join(', ')}const sec=w.closest('[data-sec]');if(sec)chkSec(+sec.dataset.sec)}

// ═══ WORD SEARCH ═══
function WS(gridSize,letters,words,secNum){
  let html='<div class="ws-wrap" data-sec="'+secNum+'" data-words=\''+JSON.stringify(words)+'\'>';
  html+='<div class="ws-grid" style="grid-template-columns:repeat('+gridSize+',1fr)">';
  for(let r=0;r<gridSize;r++)for(let c=0;c<gridSize;c++){
    html+='<div class="ws-cell" data-r="'+r+'" data-c="'+c+'" onclick="wsClick(this)">'+letters[r*gridSize+c]+'</div>'}
  html+='</div><div class="ws-words">';
  words.forEach(w=>{html+='<span class="ws-word" data-w="'+w+'">'+w+'</span>'});
  html+='</div></div>';return html}
let wsSelecting=false,wsStart=null,wsSel=[];
function wsClick(cell){
  const grid=cell.closest('.ws-wrap');
  if(cell.classList.contains('ws-found'))return;
  cell.classList.toggle('ws-sel');
  const selected=[...grid.querySelectorAll('.ws-cell.ws-sel')];
  const word=selected.map(c=>c.textContent).join('');
  const words=JSON.parse(grid.dataset.words);
  const found=words.find(w=>w===word||w===[...word].reverse().join(''));
  if(found){
    selected.forEach(c=>{c.classList.remove('ws-sel');c.classList.add('ws-found')});
    const wEl=grid.querySelector('[data-w="'+found+'"]');if(wEl)wEl.classList.add('ws-struck');
    if([...grid.querySelectorAll('.ws-word')].every(w=>w.classList.contains('ws-struck'))){
      addP(15);const sec=+grid.dataset.sec;if(sec)chkSec(sec)}}
  if(selected.length>=8){selected.forEach(c=>c.classList.remove('ws-sel'))}}

// ═══ CROSSWORD ═══
function CW(grid,cluesH,cluesV,secNum){
  const rows=grid.length,cols=grid[0].length;
  let html='<div class="cw-wrap" data-sec="'+secNum+'"><div class="cw-grid" style="grid-template-columns:repeat('+cols+',1fr)">';
  let num=1;
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
    const ch=grid[r][c];
    if(ch==='#'){html+='<div class="cw-cell cw-black"></div>'}
    else{
      let showNum=false;
      if(ch!=='#'&&(c===0||grid[r][c-1]==='#'))showNum=true;
      if(ch!=='#'&&(r===0||grid[r-1][c]==='#'))showNum=true;
      html+='<div class="cw-cell">'+(showNum?'<span class="cw-num">'+(num++)+'</span>':'')+'<input maxlength="1" data-a="'+ch.toUpperCase()+'" oninput="this.value=this.value.toUpperCase()"></div>'}}
  html+='</div><div class="cw-clues"><div class="cw-clue-group"><h5>HORIZONTAL</h5>';
  cluesH.forEach(c=>{html+='<div class="cw-clue"><span>'+c[0]+'.</span>'+c[1]+'</div>'});
  html+='</div><div class="cw-clue-group"><h5>VERTICAL</h5>';
  cluesV.forEach(c=>{html+='<div class="cw-clue"><span>'+c[0]+'.</span>'+c[1]+'</div>'});
  html+='</div></div><button class="btn" onclick="chkCW(this)" style="margin-top:6px">Verificar</button><div class="fb"></div></div>';
  return html}
function chkCW(btn){
  if(btn.disabled)return;btn.disabled=true;
  const w=btn.closest('.cw-wrap');const inputs=[...w.querySelectorAll('input')];
  let ok=true;inputs.forEach(inp=>{
    if(inp.value.toUpperCase()===inp.dataset.a){inp.classList.add('cw-ok');inp.classList.remove('cw-no')}
    else{inp.classList.add('cw-no');inp.classList.remove('cw-ok');ok=false}});
  const fb=w.querySelector('.fb');
  if(ok){fb.className='fb sh y';fb.textContent='Excelente! Crucigrama completado correctamente.';addP(15);const sec=+w.dataset.sec;if(sec)chkSec(sec)}
  else{fb.className='fb sh n';fb.textContent='Algunas letras son incorrectas. Revisa las marcadas en rojo.';btn.disabled=false}}

// ═══ SENTENCE UNSCRAMBLE ═══
function SCR(correctOrder,shuffled,secNum){
  let html='<div class="scr-wrap" data-correct=\''+JSON.stringify(correctOrder)+'\' data-sec="'+secNum+'" data-p="10">';
  html+='<div class="scr-target" id="scrT'+secNum+'"></div>';
  html+='<div class="scr-bank">';
  shuffled.forEach(w=>{html+='<div class="scr-chip" onclick="scrChip(this)">'+w+'</div>'});
  html+='</div><button class="btn" onclick="chkSCR(this)" style="margin-top:6px">Verificar</button><div class="fb"></div></div>';
  return html}
function scrChip(chip){
  const wrap=chip.closest('.scr-wrap');
  const target=wrap.querySelector('.scr-target');
  const bank=wrap.querySelector('.scr-bank');
  if(chip.classList.contains('in-target')){
    chip.classList.remove('in-target');bank.appendChild(chip)
  }else{chip.classList.add('in-target');target.appendChild(chip)}}
function chkSCR(btn){
  if(btn.disabled)return;btn.disabled=true;
  const w=btn.closest('.scr-wrap');const correct=JSON.parse(w.dataset.correct);
  const chips=[...w.querySelector('.scr-target').querySelectorAll('.scr-chip')];
  const answer=chips.map(c=>c.textContent);
  const fb=w.querySelector('.fb');
  if(JSON.stringify(answer)===JSON.stringify(correct)){
    chips.forEach(c=>c.classList.add('scr-ok'));
    fb.className='fb sh y';fb.textContent='Correcto! La oracion esta en el orden correcto.';
    addP(+w.dataset.p);
  }else{
    chips.forEach(c=>c.classList.add('scr-no'));
    fb.className='fb sh n';fb.textContent='Orden incorrecto. Correcto: '+correct.join(' ');
    btn.disabled=true}
  const sec=+w.dataset.sec;if(sec)chkSec(sec)}



const S=[
// ═══ 0: PORTADA — Full-bleed left + Contents right ═══
{l:`<div class="pg-spread pg-spread-l" style="background:url('imagenes/imagen-01.jpg') 0% 0%/200% 100% no-repeat">
<div class="sp-overlay sp-grad" style="justify-content:flex-end;padding-bottom:40px">
<div class="sp-tag">EGADE Business School</div>
<h2>Booklet del<br>Profesor</h2>
<p>Guia interactiva de integracion</p>
</div>
</div>`,lc:'cv',
r:`<div class="pg-spread pg-spread-r" style="background:url('imagenes/imagen-01.jpg') 100% 0%/200% 100% no-repeat">
<div class="sp-overlay sp-grad" style="justify-content:flex-end;padding-bottom:40px">
</div>
</div>`,rc:'cv',t:'Portada'},

// ═══ 0b: CONTENIDO ═══
{l:`<div class="pg-quote">
<div>
<blockquote>"La unica escuela de negocios en America Latina con la triple corona"</blockquote>
<cite>AACSB &bull; EQUIS &bull; AMBA</cite>
</div></div>`,lc:'cv',
r:`<div class="pb" style="justify-content:center;padding:24px 30px;position:relative">
<div class="geo geo-1"></div>
${LG(54)}
<div style="height:14px"></div>
<h2 style="font-family:var(--hd);font-size:22px;color:var(--p);font-style:italic;font-weight:400">Contenido</h2>
<div style="height:10px"></div>
<div style="display:flex;flex-direction:column;gap:11px">
<div style="display:flex;align-items:center;gap:12px"><span style="font-family:var(--hd);font-size:22px;color:#C9A84C;font-weight:700;min-width:26px">01</span><span style="font-size:14px;font-weight:600;color:var(--p)">Bienvenido a EGADE</span></div>
<div style="display:flex;align-items:center;gap:12px"><span style="font-family:var(--hd);font-size:22px;color:#C9A84C;font-weight:700;min-width:26px">02</span><span style="font-size:14px;font-weight:600;color:var(--p)">Escuela y Programas</span></div>
<div style="display:flex;align-items:center;gap:12px"><span style="font-family:var(--hd);font-size:22px;color:#C9A84C;font-weight:700;min-width:26px">03</span><span style="font-size:14px;font-weight:600;color:var(--p)">Modelo Educativo</span></div>
<div style="display:flex;align-items:center;gap:12px"><span style="font-family:var(--hd);font-size:22px;color:#C9A84C;font-weight:700;min-width:26px">04</span><span style="font-size:14px;font-weight:600;color:var(--p)">Tu Curso en Canvas</span></div>
<div style="display:flex;align-items:center;gap:12px"><span style="font-family:var(--hd);font-size:22px;color:#C9A84C;font-weight:700;min-width:26px">05</span><span style="font-size:14px;font-weight:600;color:var(--p)">Evaluacion</span></div>
<div style="display:flex;align-items:center;gap:12px"><span style="font-family:var(--hd);font-size:22px;color:#C9A84C;font-weight:700;min-width:26px">06</span><span style="font-size:14px;font-weight:600;color:var(--p)">Desarrollo y Contactos</span></div>
</div>
</div>`,rc:'cv',t:'Contenido'},

// ═══ 1: SPREAD DOBLE — CAMPUS ═══
{l:`<div class="pg-spread pg-spread-l" style="background:url('imagenes/imagen-02.jpg') 0% 0%/200% 100% no-repeat">
<div style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:flex-start;padding:30px 32px;z-index:2">
<div style="font-family:var(--mn);font-size:9px;letter-spacing:.25em;text-transform:uppercase;color:#C9A84C;margin-bottom:6px">Sección 01</div>
<h2 style="font-family:var(--hd);font-size:28px;font-weight:700;color:var(--wh);line-height:1.15">Bienvenido<br>a EGADE</h2>
<p style="font-size:14px;color:rgba(255,255,255,.8);margin:4px 0 0">30 años formando líderes</p>
</div>
</div>`,lc:'cv',
r:`<div class="pg-spread pg-spread-r" style="background:url('imagenes/imagen-02.jpg') 100% 0%/200% 100% no-repeat">
</div>`,rc:'cv',t:'Campus'},

// ═══ 2: SEC 01 — Sidebar layout ═══
{lh:'SECCIÓN 01 | BIENVENIDO A EGADE',l:`<div class="pb" style="position:relative">
<div class="geo geo-4"></div><div class="geo geo-6"></div>
<h3 style="font-size:15px;margin-bottom:4px">Mensaje del Director</h3>
<p style="font-size:11px;color:var(--t2);margin:0 0 8px;line-height:1.5">Te damos la más cordial bienvenida a EGADE Business School. Este mensaje ha sido preparado especialmente para ti por la Dirección de la Escuela, con el objetivo de compartirte nuestra visión, nuestros valores y el compromiso que tenemos con cada profesor que se integra a nuestra comunidad académica. En EGADE creemos que la calidad de la educación comienza con la calidad de nuestros profesores, y por eso invertimos en tu desarrollo desde el primer día. Escucha este mensaje antes de continuar con tu proceso de integración.</p>
${VD('Mensaje de bienvenida del Director','01:45')}
<div style="height:8px"></div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
<div><p style="font-size:11px;line-height:1.5;color:var(--t2);margin:0">Este booklet interactivo es tu guía de integración durante los primeros <strong>90 días</strong> en EGADE. A lo largo de seis secciones conocerás nuestra historia, el modelo educativo, cómo configurar tu curso en Canvas, el sistema de evaluación y al equipo que te acompañará. Cada sección incluye videos, audios, infografías y actividades interactivas diseñadas para que tu incorporación sea ágil y completa.</p></div>
<div><p style="font-size:11px;line-height:1.5;color:var(--t2);margin:0">Tu proceso de onboarding contempla <strong>25 tareas</strong> organizadas en cuatro categorías: Institucional, Transformación de la Escuela, Transformación de la Enseñanza y Actualización de la Disciplina. Al final de cada sección encontrarás un <strong>Takeaway</strong> descargable con el resumen y una actividad para reforzar lo aprendido. Comencemos conociendo la historia y los campus de EGADE.</p></div>
</div>
</div>`,
r:`<div class="pg-sidebar">
<div class="pg-sidebar-img" style="background:url('imagenes/imagen-03.jpg') calc(100% + 7cm) center/cover no-repeat"></div>
<div class="pg-sidebar-content">
<h3 style="font-size:14px;margin:0 0 6px">Una comunidad de excelencia</h3>
<p style="font-size:11px;color:var(--t2);margin:0 0 8px;line-height:1.5">Como mencionó el Director en su mensaje, EGADE tiene más de tres décadas formando líderes que transforman organizaciones. En la siguiente página conocerás a detalle nuestra historia, nuestros campus y las acreditaciones que nos distinguen a nivel mundial.</p>
<div class="cds"><div class="cd"><h4>4 campus</h4><p>MTY, GDL, CDMX, QRO</p></div><div class="cd"><h4>Triple corona</h4><p>AACSB, EQUIS, AMBA</p></div></div>
${DYK('<strong>Sabias que</strong> menos del 1% de escuelas en el mundo tienen la triple corona?')}
<h3 style="font-size:13px;margin:8px 0 4px">Nuestra historia</h3>
<p style="font-size:11px;color:var(--t2);margin:0 0 6px;line-height:1.5">Escucha cómo EGADE pasó de ser un proyecto visionario a convertirse en la única escuela de negocios en América Latina con la Triple Corona. Una trayectoria de más de 30 años construida sobre la base de la excelencia académica, la investigación de impacto y la formación de profesionales que transforman sus organizaciones y comunidades.</p>
${AU('Historia de EGADE','02:15','audios/audio-01.mp3')}
<div style="height:8px"></div>
<div style="aspect-ratio:16/9;background:url('imagenes/imagen-05.jpg') center/cover no-repeat;border-radius:6px;cursor:pointer" onclick="fsOpen(this,'img')"></div>
</div></div>`,rc:'cv',t:'Bienvenida'},

// ═══ 3: SEC 01 — Quiz P1 (opcion multiple + V/F + completar) ═══
{lh:'SECCIÓN 01 | BIENVENIDO A EGADE',l:`<div class="pb" style="position:relative">
<div class="geo geo-3"></div>
<h3 style="font-size:14px;margin:0">Conoce EGADE en 2 minutos</h3>
<p style="font-size:11px;color:var(--t3);margin:0 0 6px;line-height:1.5">En este video descubrirás la historia de EGADE Business School: cómo nació hace más de tres décadas con la visión de ser la escuela de negocios líder de América Latina y cómo ha evolucionado hasta convertirse en la única institución de la región con la Triple Corona de acreditaciones internacionales. Conocerás qué significan las acreditaciones AACSB, EQUIS y AMBA para la calidad de nuestros programas, y entenderás por qué formar parte de esta comunidad académica representa un compromiso con los más altos estándares de excelencia en la educación de negocios a nivel global.</p>
${VD('Bienvenido a EGADE','2:00')}
<div style="height:8px"></div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
<div><p style="font-size:11px;line-height:1.5;color:var(--t3);margin:0">EGADE se posiciona entre la élite global gracias a sus tres acreditaciones internacionales. La <strong>AACSB</strong> evalúa la calidad del cuerpo docente, los programas académicos y el impacto institucional. La <strong>EQUIS</strong> (EFMD) reconoce la internacionalización, la gobernanza y la vinculación empresarial. La <strong>AMBA</strong> acredita específicamente la relevancia profesional del MBA y los resultados de carrera de los egresados.</p></div>
<div><p style="font-size:11px;line-height:1.5;color:var(--t3);margin:0">Como profesor, tu participación en el aula es fundamental para mantener estos estándares. EGADE tiene presencia en <strong>4 campus presenciales</strong>: Monterrey, Santa Fe, Guadalajara y Querétaro. Es importante recordar que la modalidad en línea no aplica como campus en ninguna herramienta institucional, incluyendo el Syllabus Maker. Tu Coordinación de Facultad te orientará sobre los recursos específicos de tu sede.</p></div>
</div>
</div>`,
rh:'SEC 01',r:`<div class="pb" style="position:relative">
<div class="geo geo-4"></div>
<h3 style="font-size:14px;margin:0">Campus EGADE Monterrey</h3>
<p style="font-size:11px;color:var(--t3);margin:0 0 6px;line-height:1.5">Nuestra sede principal se encuentra en Monterrey, Nuevo León, con instalaciones de vanguardia y una vista privilegiada al icónico Cerro de la Silla.</p>
<div style="aspect-ratio:16/9;background:url('imagenes/imagen-04.jpg') center/cover no-repeat;border-radius:6px;cursor:pointer" onclick="fsOpen(this,'img')"></div>
<p style="font-size:11px;color:var(--t3);margin:6px 0;line-height:1.5">Este campus alberga la mayor concentración de programas de EGADE y cuenta con aulas tecnológicas, biblioteca especializada, espacios de coworking y laboratorios de simulación empresarial. Monterrey, Santa Fe, Guadalajara y Querétaro: cuatro sedes que comparten una misma filosofía de excelencia pero que aportan cada una su propia personalidad y vinculación con el ecosistema empresarial de su región.</p>
<h3 style="font-size:13px;margin:6px 0 4px">Vida en el campus</h3>
<p style="font-size:11px;color:var(--t3);margin:0 0 6px;line-height:1.5">Tu Coordinación de Facultad te ayudará a conocer los espacios y recursos específicos del campus donde impartirás. Escucha este audio para conocer más sobre la experiencia en nuestras instalaciones.</p>
${AU('Vida en campus','01:30')}
</div>`,t:'Bienvenida'},

// ═══ 3b: SEC 01 — Quiz P1 ═══
{lh:'SECCIÓN 01 | BIENVENIDO A EGADE',l:`<div class="pb" style="position:relative">
<div class="geo geo-3"></div>
<div class="img-half-v" onclick="fsOpen(this,'img')" style="background:url('imagen-de-prueba.jpg') center/cover no-repeat"><div class="img-n">Infografia Sec 01</div><div class="img-d">Resumen visual — Bienvenida a EGADE</div></div>
</div>`,
rh:'ACTIVIDAD',r:`<div class="pb">
<div class="sq-wrap" data-sec="1"><div class="sq-hd"> Actividad — Sección 01 (1/2)</div><div class="sq-bd">
<div class="sq-q"><div class="sq-num">1 / 4 — Opción múltiple</div><div class="sq-qt">¿Cuántos años tiene EGADE Business School?</div><ul class="mc" data-ok="2" data-p="10" data-y="¡Correcto! EGADE fue fundada hace más de 30 años y hoy es la única escuela de negocios en América Latina con la Triple Corona de acreditaciones internacionales (AACSB, EQUIS, AMBA)." data-n="La respuesta correcta es 30 años. EGADE tiene más de tres décadas formando líderes con impacto global, consolidándose como referente en educación de negocios en la región."><li class="mo" onclick="sM(this)"><div class="rd"></div><span>20</span></li><li class="mo" onclick="sM(this)"><div class="rd"></div><span>25</span></li><li class="mo" onclick="sM(this)"><div class="rd"></div><span>30</span></li></ul><button class="btn" onclick="cM(this);chkSec(1)" disabled>Verificar</button><div class="fb"></div></div>
<div class="sq-q"><div class="sq-num">2 / 4 — Verdadero o Falso</div><div class="sq-qt">EGADE es la única escuela de negocios en América Latina con la Triple Corona.</div><div class="to" data-ok="1" data-p="10" data-y="¡Correcto! Ninguna otra escuela de negocios en América Latina cuenta simultáneamente con las acreditaciones AACSB, EQUIS y AMBA. Menos del 1% de las escuelas en el mundo tienen este reconocimiento." data-n="Es verdadero. EGADE es la única institución en la región que ostenta las tres acreditaciones internacionales más prestigiosas: AACSB (calidad docente), EQUIS (internacionalización) y AMBA (relevancia del MBA)."><div class="tf" onclick="sT(this)">Falso</div><div class="tf" onclick="sT(this)">Verdadero</div></div><button class="btn" onclick="cT(this);chkSec(1)" disabled>Verificar</button><div class="fb"></div></div>
</div></div></div>`,t:'Quiz 01a'},

// ═══ 4: SEC 01 — Quiz P2 ═══
{lh:'SECCIÓN 01 | BIENVENIDO A EGADE',l:`<div class="pg-full">
<div style="position:absolute;inset:0;background:url('imagenes/imagen-11.jpg') center top/contain no-repeat;background-color:#111"></div>
<div class="pg-overlay"><div class="pg-tag">Tradición</div><h2>Excelencia<br>académica</h2></div>
</div>`,
rh:'ACTIVIDAD',r:`<div class="pb">
<div class="sq-wrap" data-sec="1"><div class="sq-hd"> Actividad — Sección 01 (2/2)</div><div class="sq-bd">
<div class="sq-q"><div class="sq-num">3 / 4 — Completar oración</div><div class="sq-qt">Completa:</div>
${FILL('EGADE tiene la ___ corona: AACSB, ___ y AMBA.',['triple','EQUIS'],['EQUIS','doble','triple','CONACYT'])}
</div>
<div class="sq-q"><div class="sq-num">4 / 4 — Ordenar oración</div><div class="sq-qt">Ordena la oración correctamente:</div>
${SCR(['EGADE','tiene','4','campus','en','Mexico'],['campus','4','Mexico','EGADE','en','tiene'],1)}
</div>
<div class="sq-progress" id="sp1"></div>
${TKW('Sec 01 — Bienvenida a EGADE','4 fases del onboarding, 25 tareas, actores clave y categorias de actividades.','takeaway/Takeaway_01_Bienvenido_a_EGADE.pdf')}
<button class="sq-next" id="sn1" onclick="next()">Siguiente sección</button>
</div></div></div>`,t:'Quiz 01b'},

// ═══ SPREAD DOBLE — ESCUELA Y PROGRAMAS ═══
{l:`<div class="pg-spread pg-spread-l" style="background:url('imagenes/imagen-02.jpg') 0% 0%/200% 100% no-repeat">
<div style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:flex-start;padding:30px 32px;z-index:2">
<div style="font-family:var(--mn);font-size:9px;letter-spacing:.25em;text-transform:uppercase;color:#C9A84C;margin-bottom:6px">Sección 02</div>
<h2 style="font-family:var(--hd);font-size:28px;font-weight:700;color:var(--wh);line-height:1.15">Escuela y<br>Programas</h2>
<p style="font-size:14px;color:rgba(255,255,255,.8);margin:4px 0 0">5 programas de maestría para formar líderes globales</p>
</div>
</div>`,lc:'cv',
r:`<div class="pg-spread pg-spread-r" style="background:url('imagenes/imagen-02.jpg') 100% 0%/200% 100% no-repeat">
</div>`,rc:'cv',t:'Escuela Spread'},

// ═══ 5: SEC 02 — Quote left + Content right ═══
{l:`<div class="pg-quote">
<div>
<div style="font-family:var(--mn);font-size:9px;color:#C9A84C;letter-spacing:.25em;margin-bottom:10px">SECCIÓN 02</div>
<blockquote>"Formar profesionales que transformen organizaciones y sociedad"</blockquote>
<cite>Mision EGADE Business School</cite>
</div></div>`,lc:'cv',
rh:'SEC 02',r:`<div class="pb" style="position:relative">
<div class="geo geo-5"></div>
<h3>Escuela y Programas</h3>
<p>EGADE ofrece <strong>5 programas de maestria</strong> para formar lideres globales.</p>
<div style="display:flex;flex-direction:column;gap:4px">
<div class="pgr"><div class="bg">MAF</div><h4>Maestria en Finanzas</h4></div>
<div class="pgr"><div class="bg">MBA</div><h4>MBA</h4></div>
<div class="pgr"><div class="bg">FT</div><h4>Full-Time MBA</h4></div>
<div class="pgr"><div class="bg">MBD</div><h4>M. Direccion Negocios</h4></div>
<div class="pgr"><div class="bg">MMT</div><h4>M. Mercadotecnia</h4></div>
</div>
<h3 style="font-size:13px;margin:8px 0 4px">Estructura académica</h3>
<p style="font-size:11px;color:var(--t2);margin:0 0 6px;line-height:1.5">En este audio conocerás cómo se organizan los cinco programas de maestría, los cuatro departamentos académicos y los roles clave que te acompañarán: Director de Departamento, Director de Programa, Coordinador de Experiencia y Coordinación de Facultad. Cada uno cumple una función específica en tu proceso de integración y en el desarrollo de tu práctica docente.</p>
${AU('Estructura academica','02:00')}
<p style="font-size:11px;color:var(--t2);margin:6px 0 0;line-height:1.5">Recuerda que cada programa tiene competencias profesionales de egreso (CPE) específicas que lo distinguen. Tu Director de Programa te compartirá el plan de estudios y las metas del programa donde impartirás.</p>
</div>`,t:'Escuela'},

// ═══ 6: SEC 02 — Mosaic left + Video right ═══
{lh:'SECCIÓN 02 | ESCUELA Y PROGRAMAS',l:`<div class="pg-mosaic">
${IM('Aula EGADE','16/9','Foto 1')}
${IM('Biblioteca EGADE','16/9','Foto 2')}
${IM('Laboratorio tecnologia','16/9','Foto 3')}
${IM('Espacio coworking','16/9','Foto 4')}
</div>`,lc:'cv',
rh:'SEC 02',r:`<div class="pb" style="position:relative">
<div class="geo geo-4"></div>
<h3 style="font-size:14px;margin:0">Estructura académica de EGADE</h3>
<p style="font-size:11px;color:var(--t3);margin:0 0 6px;line-height:1.5">EGADE ofrece cinco programas de maestría diseñados para formar líderes globales: MBA, MAF, Full-Time MBA, MBD y MMT. Cada programa tiene un perfil de competencias profesionales de egreso (CPE) específico y está liderado por un Director de Programa que será uno de tus principales puntos de contacto. En este video conocerás la estructura completa, los cuatro departamentos académicos — Finanzas, Estrategia y Liderazgo, Mercadotecnia y Operaciones — y los equipos de apoyo que facilitan tu labor docente.</p>
${VD('Escuela y Programas','3:00')}
<p style="font-size:11px;color:var(--t3);margin:6px 0;line-height:1.5">Los programas de EGADE se actualizan aproximadamente cada tres años para asegurar que el contenido sea relevante y esté alineado con las tendencias del mundo de los negocios. Cada programa se distingue por sus competencias profesionales de egreso (CPE), que son los conocimientos y habilidades disciplinares que los estudiantes desarrollarán durante el programa. Como profesor, es importante que conozcas las CPE de tu programa para alinear tus actividades de enseñanza y evaluación.</p>
${DYK('<strong>Sabias que</strong> los programas se actualizan cada <strong>3 anos</strong>?')}
<div style="height:6px"></div>
${AVT('Tip','T','La escuela tiene <strong>4 departamentos</strong>: Finanzas, Estrategia, Mercadotecnia y Operaciones.')}
<div style="height:6px"></div>

</div>`,t:'Escuela'},

// ═══ 7: SEC 02 — Quiz P1 (completar + V/F + opcion multiple) ═══
{lh:'SECCIÓN 02 | ESCUELA Y PROGRAMAS',l:`<div class="pb" style="position:relative">
<div class="geo geo-2"></div>
<p style="font-size:11px;color:var(--t3);margin:0 0 4px;line-height:1.5">Esta infografía resume la estructura organizacional de EGADE: los cinco programas de maestría, los cuatro departamentos académicos y los roles clave que te acompañarán. Consúltala como referencia rápida para identificar quién es quién en la Escuela y a quién acudir según tus necesidades como profesor.</p>
<div class="img-half-v" onclick="fsOpen(this,'img')" style="background:url('imagen-de-prueba.jpg') center/cover no-repeat"><div class="img-n">Infografia Sec 02</div><div class="img-d">Programas y departamentos</div></div>
<p style="font-size:11px;color:var(--t3);margin:4px 0;line-height:1.5">Los estudiantes de EGADE son profesionales en activo con entre 3 y 10 años de experiencia laboral en posiciones de responsabilidad. Tienen un perfil ejecutivo orientado a resultados, pensamiento estratégico y visión de liderazgo. Provienen de diversas industrias, funciones y, en muchos casos, de distintos países, lo que enriquece significativamente las discusiones en el aula.</p>
${IM('Estudiantes colaborando','4/3','Foto horizontal')}
<h3 style="font-size:13px;margin:8px 0 4px">Vida estudiantil en EGADE</h3>
<p style="font-size:11px;color:var(--t3);margin:0 0 6px;line-height:1.5">Los estudiantes de EGADE son profesionales en activo con entre 3 y 10 años de experiencia laboral. Provienen de diversas industrias, funciones y nacionalidades, lo que genera discusiones de alto nivel en el aula. Tienen un perfil ejecutivo orientado a resultados y expectativas altas de rigor académico y relevancia práctica.</p>
${AU('Vida estudiantil','01:30')}
<p style="font-size:11px;color:var(--t3);margin:6px 0 0;line-height:1.5">Como profesor, tu rol es aprovechar esta diversidad: cada grupo es una oportunidad para conectar la teoría con la realidad profesional de quienes están frente a ti. Demandan metodologías activas, casos de estudio actuales y retroalimentación personalizada que les ayude a crecer como líderes en sus organizaciones.</p>
</div>`,
rh:'ACTIVIDAD',r:`<div class="pb">
<div class="sq-wrap" data-sec="2"><div class="sq-hd"> Actividad — Sección 02 (1/2)</div><div class="sq-bd">
<div class="sq-q"><div class="sq-num">1 / 4 — Completar oración</div><div class="sq-qt">Completa:</div>
${FILL('EGADE tiene ___ departamentos académicos y ___ programas de maestría.',['4','5'],['3','4','5','6'])}
</div>
<div class="sq-q"><div class="sq-num">2 / 4 — Opción múltiple</div><div class="sq-qt">¿Qué significa MBA?</div><ul class="mc" data-ok="2" data-p="10" data-y="¡Excelente! MBA significa Master of Business Administration. Es el programa insignia de EGADE, enfocado en la formación integral de directivos con competencias en estrategia empresarial, finanzas corporativas, marketing, operaciones y liderazgo para la toma de decisiones gerenciales." data-n="MBA significa Master of Business Administration. Es el programa insignia de EGADE que desarrolla habilidades directivas y de liderazgo estratégico. Se imparte en Santa Fe y Guadalajara."><li class="mo" onclick="sM(this)"><div class="rd"></div><span>Master en Banca Aplicada</span></li><li class="mo" onclick="sM(this)"><div class="rd"></div><span>Maestría en Bienes y Activos</span></li><li class="mo" onclick="sM(this)"><div class="rd"></div><span>Master of Business Administration</span></li></ul><button class="btn" onclick="cM(this);chkSec(2)" disabled>Verificar</button><div class="fb"></div></div>
</div></div></div>`,t:'Quiz 02a'},

// ═══ 8: SEC 02 — Quiz P2 ═══
{lh:'SECCIÓN 02 | ESCUELA Y PROGRAMAS',l:`<div class="pg-full">
${IM('Trabajo en equipo EGADE','16/9','Foto full')}
<div class="pg-overlay"><div class="pg-tag">Colaboración</div><h2>Trabajo en<br>equipo</h2></div>
</div>`,
rh:'ACTIVIDAD',r:`<div class="pb">
<div class="sq-wrap" data-sec="2"><div class="sq-hd"> Actividad — Sección 02 (2/2)</div><div class="sq-bd">
<div class="sq-q"><div class="sq-num">3 / 4 — Verdadero o Falso</div><div class="sq-qt">El Director de Programa te comparte el plan de estudios y las metas del programa.</div><div class="to" data-ok="1" data-p="10" data-y="¡Correcto! El Director de Programa es tu contacto principal para conocer el plan de estudios, las metas y objetivos del programa. También coordina reuniones con otros profesores del programa para alinear la experiencia académica." data-n="Es verdadero. El Director de Programa te compartirá el plan de estudios, las metas del programa y coordinará tu integración con otros profesores. Es uno de tus principales puntos de contacto en EGADE."><div class="tf" onclick="sT(this)">Falso</div><div class="tf" onclick="sT(this)">Verdadero</div></div><button class="btn" onclick="cT(this);chkSec(2)" disabled>Verificar</button><div class="fb"></div></div>
<div class="sq-q"><div class="sq-num">4 / 4 — Relacionar columnas</div><div class="sq-qt">Conecta cada equipo con su función principal:</div><div class="mg" id="m2" data-p="10"><div class="mi" data-s="L" data-x="0" onclick="mC(this)">Des. Académico</div><div class="mi" data-s="R" data-x="1" onclick="mC(this)">Procesos administrativos</div><div class="mi" data-s="L" data-x="1" onclick="mC(this)">Coord. Facultad</div><div class="mi" data-s="R" data-x="0" onclick="mC(this)">Canvas y evaluación</div></div><div class="fb"></div></div>
</div>
<div class="sq-progress" id="sp2"></div>
${TKW('Sec 02 — Escuela y Programas','5 programas (MBA, MAF, MMT, MBD, FTMBA), 4 campus, triple corona y perfil del estudiante.','takeaway/Takeaway_02_Escuela_y_Programas.pdf')}
<button class="sq-next" id="sn2" onclick="next()">Siguiente sección</button>
</div></div></div>`,t:'Quiz 02b'},

// ═══ 9: SEC 03 — Dark page left + Content right ═══
{l:`<div class="sh" style="flex:1;display:flex;flex-direction:column;justify-content:center;padding:30px;background:#0A0A0A"><div class="sn">Sección 03</div><h2 style="font-size:28px;margin-bottom:12px">Modelo<br>Educativo</h2>
<p style="color:rgba(255,255,255,.7);font-size:13px;max-width:300px">Cuatro pilares que guian la experiencia de aprendizaje en EGADE.</p>
<div style="height:8px"></div>
<h3 style="font-size:13px;margin:0 0 4px;color:var(--wh)">El modelo en profundidad</h3>
<p style="font-size:11px;color:rgba(255,255,255,.7);margin:0 0 6px;line-height:1.5">Escucha cómo los cuatro pilares — propósito formativo, competencias CPE y CT, Assurance of Learning y aprendizaje activo — se articulan en cada curso a través de las Business Questions y el Syllabus EGADE de 13 secciones.</p>
${AU('Modelo educativo','02:30')}
<p style="font-size:11px;color:rgba(255,255,255,.7);margin:6px 0 0;line-height:1.5">El Syllabus Maker te guía paso a paso para construir tu syllabus alineado a este modelo. Cada sesión debe tener una Business Question clara que conecte el tema con un problema real de negocio.</p>
</div>`,lc:'cv',
rh:'SEC 03',r:`<div class="pb" style="position:relative">
<div class="geo geo-5"></div><div class="geo geo-6"></div>
<div class="cds"><div class="cd"><h4>Proposito formativo</h4><p>Lideres eticos globales</p></div><div class="cd"><h4>Competencias</h4><p>Transversales clave</p></div><div class="cd"><h4>AoL</h4><p>Aseguramiento aprendizaje</p></div><div class="cd"><h4>Aprendizaje activo</h4><p>Casos y proyectos</p></div></div>
<div style="height:6px"></div>
<h3 style="font-size:14px;margin:0">Los 4 pilares en acción</h3>
<p style="font-size:11px;color:var(--t3);margin:0 0 6px;line-height:1.5">El Modelo Educativo de EGADE se fundamenta en cuatro pilares: el Propósito Formativo de crear líderes éticos y globales, las Competencias Profesionales de Egreso (CPE) y Transversales (CT) que cada programa desarrolla, el Assurance of Learning (AoL) que mide el aprendizaje con evidencias concretas, y el Aprendizaje Activo donde el estudiante es protagonista. En este video verás cómo estos pilares se implementan en la práctica docente diaria y cómo impactan el diseño de tu curso.</p>
${VD('Modelo Educativo','3:00')}
<p style="font-size:11px;color:var(--t3);margin:6px 0;line-height:1.5">Una herramienta clave del modelo es la Business Question: cada sesión de tu curso se articula alrededor de una pregunta de negocio real que motiva la exploración del tema y conecta la teoría con problemas concretos del mundo empresarial. Por ejemplo: '¿Cómo identifica una empresa las oportunidades de mercado más rentables?' Estas preguntas aparecen en la sección VI de tu syllabus y orientan tanto la discusión en clase como las actividades de evaluación.</p>
${DYK('<strong>Sabias que</strong> AoL mide aprendizaje con <strong>evidencias concretas</strong>?')}
</div>`,t:'Modelo'},

// ═══ 10: SEC 03 — Split horizontal ═══
{lh:'SECCIÓN 03 | MODELO EDUCATIVO',l:`<div class="pb" style="position:relative">
<div class="geo geo-3"></div>
<p style="font-size:11px;color:var(--t3);margin:0 0 4px;line-height:1.5">Esta infografía presenta de forma visual los cuatro pilares del modelo educativo y cómo se conectan entre sí. Desde el propósito formativo que guía toda la experiencia, pasando por las competencias CPE y CT que se desarrollan en cada curso, hasta el AoL que asegura que el aprendizaje se está logrando con evidencias medibles. Descárgala como referencia para el diseño de tus sesiones.</p>
<div class="img-half-v" onclick="fsOpen(this,'img')" style="background:url('imagen-de-prueba.jpg') center/cover no-repeat"><div class="img-n">Infografia Sec 03</div><div class="img-d">Pilares del modelo educativo</div></div>
<p style="font-size:11px;color:var(--t3);margin:4px 0;line-height:1.5">Para implementar estos pilares en tu práctica docente, cuentas con el apoyo del equipo de Innovación Educativa. Ellos te asesoran en el diseño de actividades de aprendizaje activo, la formulación de Business Questions efectivas, la integración de tecnología educativa y el uso de estrategias de evaluación formativa que desarrollen las competencias declaradas en tu syllabus.</p>
${AVT('IE','IE','<strong>Innovacion Educativa</strong> te apoya con metodologias activas.')}
<div style="height:6px"></div>

</div>`,
rh:'SEC 03',r:`<div class="pg-full">
${IM('Profesor facilitando caso de estudio','3/4','Vertical full')}
<div class="pg-overlay"><div class="pg-tag">Metodologia</div><h2>Aprendizaje<br>activo</h2></div>
</div>`,t:'Modelo'},

// ═══ 11: SEC 03 — Quiz P1 (V/F + ordenar + opcion multiple) ═══
{lh:'SECCIÓN 03 | MODELO EDUCATIVO',l:`<div class="pb" style="position:relative">
<div class="geo geo-1"></div>
<p style="font-size:11px;color:var(--t3);margin:0 0 4px;line-height:1.5">En EGADE el aprendizaje activo es el eje de cada sesión. Los profesores actúan como facilitadores que guían la discusión, plantean preguntas provocadoras y crean un ambiente donde los estudiantes analizan casos reales, debaten con evidencia y construyen soluciones fundamentadas. Tu rol no es dar cátedra sino crear las condiciones para que el alumno sea protagonista de su aprendizaje.</p>
${IM('Sesion colaborativa EGADE','16/9','Foto horizontal')}
<p style="font-size:11px;color:var(--t3);margin:4px 0;line-height:1.5">Los proyectos integradores son una pieza central de la evaluación en EGADE. Conectan la teoría con organizaciones reales y permiten que los estudiantes apliquen las competencias del programa en contextos profesionales auténticos. Al diseñar tu proyecto, asegúrate de que la Business Question de cada sesión contribuya a que los alumnos construyan su entregable de forma progresiva a lo largo del trimestre.</p>
${IM('Presentacion proyecto final','4/3','Foto horizontal')}
<h3 style="font-size:13px;margin:8px 0 4px">Consejos de un colega</h3>
<p style="font-size:11px;color:var(--t3);margin:0 0 6px;line-height:1.5">Un profesor experimentado de EGADE comparte tres consejos para tu primera clase: primero, conoce a tu grupo revisando el perfil que te dará tu Coordinador de Experiencia; segundo, facilita en lugar de dar cátedra — prepara preguntas que provoquen reflexión; tercero, apóyate en Innovación Educativa y Desarrollo de Facultad.</p>
${AU('Consejos para tu clase','01:45')}
<p style="font-size:11px;color:var(--t3);margin:6px 0 0;line-height:1.5">Las aulas de EGADE son espacios donde profesor y estudiantes crecen juntos. Tu Director de Departamento puede asignarte un colega mentor que te acompañe durante tus primeros meses, orientándote sobre la cultura de la escuela y la gestión de tu curso.</p>
</div>`,
rh:'ACTIVIDAD',r:`<div class="pb">
<div class="sq-wrap" data-sec="3"><div class="sq-hd"> Actividad — Sección 03 (1/2)</div><div class="sq-bd">
<div class="sq-q"><div class="sq-num">1 / 4 — Verdadero o Falso</div><div class="sq-qt">El Assurance of Learning (AoL) mide el aprendizaje con evidencias concretas.</div><div class="to" data-ok="1" data-p="10" data-y="¡Correcto! El AoL utiliza trabajos, proyectos, presentaciones y otros entregables como evidencia de que los estudiantes están alcanzando las competencias esperadas. Está integrado en las actividades regulares de tu curso y es clave para mantener las acreditaciones internacionales." data-n="Es verdadero. El AoL es un proceso sistemático que mide el aprendizaje con evidencias concretas como trabajos y proyectos. Está vinculado a las secciones VII (Evaluación) y IX (Rúbricas) de tu syllabus."><div class="tf" onclick="sT(this)">Falso</div><div class="tf" onclick="sT(this)">Verdadero</div></div><button class="btn" onclick="cT(this);chkSec(3)" disabled>Verificar</button><div class="fb"></div></div>
<div class="sq-q"><div class="sq-num">2 / 4 — Opción múltiple</div><div class="sq-qt">¿Cuál es el propósito formativo de EGADE?</div><ul class="mc" data-ok="0" data-p="10" data-y="¡Excelente! El propósito formativo de EGADE es formar líderes éticos y globales, capaces de tomar decisiones que transformen positivamente las organizaciones y la sociedad. Cada actividad, caso de estudio y evaluación que diseñes debe contribuir a este propósito." data-n="El propósito formativo de EGADE es formar líderes éticos y globales. No se trata solo de transmitir conocimiento técnico, sino de desarrollar profesionales íntegros con pensamiento crítico y conciencia social."><li class="mo" onclick="sM(this)"><div class="rd"></div><span>Líderes éticos y globales</span></li><li class="mo" onclick="sM(this)"><div class="rd"></div><span>Investigación científica</span></li><li class="mo" onclick="sM(this)"><div class="rd"></div><span>Certificaciones profesionales</span></li></ul><button class="btn" onclick="cM(this);chkSec(3)" disabled>Verificar</button><div class="fb"></div></div>
</div></div></div>`,t:'Quiz 03a'},

// ═══ 12: SEC 03 — Quiz P2 ═══
{lh:'SECCIÓN 03 | MODELO EDUCATIVO',l:`<div class="pb" style="position:relative">
<div class="geo geo-2"></div><div class="geo geo-4"></div>
<p style="font-size:11px;color:var(--t3);margin:0 0 4px;line-height:1.5">El debate académico es una de las metodologías más valoradas en EGADE. Desarrolla pensamiento crítico, comunicación efectiva y la capacidad de construir argumentos basados en evidencia.</p>
${IM('Alumnos en debate academico','1/1','Foto cuadrada')}
<p style="font-size:11px;color:var(--t3);margin:4px 0;line-height:1.5">La tecnología se integra como recurso de aprendizaje, no como sustituto del pensamiento. Las herramientas digitales y la IA se incorporan de manera ética y transparente.</p>
${IM('Tecnologia en el aula','2/3','Foto vertical rectangular')}
</div>`,
rh:'ACTIVIDAD',r:`<div class="pb">
<div class="sq-wrap" data-sec="3"><div class="sq-hd"> Actividad — Sección 03 (2/2)</div><div class="sq-bd">
<div class="sq-q"><div class="sq-num">3 / 4 — Selecciona 2</div><div class="sq-qt">Selecciona DOS componentes del aprendizaje activo:</div><div class="ms-wrap" data-ok="0,2" data-p="10" data-y="¡Correcto! La discusión de casos reales y la reflexión crítica son componentes fundamentales del aprendizaje activo en EGADE. Los exámenes escritos y las lecturas pasivas son metodologías tradicionales que no privilegian al estudiante como protagonista." data-n="Los componentes correctos son: discusión de casos y reflexión crítica. En EGADE privilegiamos metodologías donde el estudiante es protagonista, no receptores pasivos de información."><div class="ms-opt" onclick="sMS(this)"><div class="ck"></div><span>Discusión de casos</span></div><div class="ms-opt" onclick="sMS(this)"><div class="ck"></div><span>Exámenes escritos</span></div><div class="ms-opt" onclick="sMS(this)"><div class="ck"></div><span>Reflexión crítica</span></div><div class="ms-opt" onclick="sMS(this)"><div class="ck"></div><span>Lecturas pasivas</span></div></div><button class="btn" onclick="cMS(this);chkSec(3)" disabled>Verificar</button><div class="fb"></div></div>
<div class="sq-q"><div class="sq-num">4 / 4 — Ordenar oración</div><div class="sq-qt">Ordena la oración:</div>
${SCR(['Innovacion','Educativa','te','apoya','con','metodologias','activas'],['con','te','activas','Innovacion','apoya','metodologias','Educativa'],3)}
</div>
<div class="sq-progress" id="sp3"></div>
${TKW('Sec 03 — Modelo Educativo','CPE, CT con niveles, Business Questions, estructura del syllabus y enfoque metodologico.','takeaway/Takeaway_03_Modelo_Educativo.pdf')}
<button class="sq-next" id="sn3" onclick="next()">Siguiente sección</button>
</div></div></div>`,t:'Quiz 03b'},

// ═══ 13: SPREAD DOBLE — CANVAS ═══
{l:`<div class="pg-spread pg-spread-l">
${IM('Interfaz Canvas LMS — dashboard completo','32/9','Spread doble')}
<div class="sp-overlay sp-dark" style="justify-content:flex-start;padding-top:40px"><div class="sp-tag">Sección 04</div><h2>Tu Curso<br>en Canvas</h2></div>
</div>`,lc:'cv',
r:`<div class="pg-spread pg-spread-r">
${IM('Canvas LMS (continuacion)','32/9','Spread doble')}
<div class="sp-overlay sp-grad" style="justify-content:flex-end">
<p style="font-family:var(--hd);font-size:18px;color:var(--wh);font-style:italic">"Tu herramienta principal de gestion"</p>
</div></div>`,rc:'cv',t:'Canvas Spread'},

// ═══ 14: SEC 04 — Content ═══
{lh:'SECCIÓN 04 | TU CURSO EN CANVAS',l:`<div class="pb" style="position:relative">
<div class="geo geo-1"></div><div class="geo geo-6"></div>
<h3>5 pasos para tu curso</h3>
<div class="sts"><div class="st"><span>Copia contenido anterior</span></div><div class="st"><span>Organiza modulos</span></div><div class="st"><span>Agrega contenido</span></div><div class="st"><span>Configura evaluacion</span></div><div class="st"><span>Publica y verifica</span></div></div>
${DYK('<strong>Sabias que</strong> puedes exportar un curso como <strong>.imscc</strong>?')}
<h3 style="font-size:13px;margin:8px 0 4px">Tips para Canvas</h3>
<p style="font-size:11px;color:var(--t2);margin:0 0 6px;line-height:1.5">Escucha recomendaciones prácticas del equipo de Desarrollo de Facultad: no empieces de cero — usa la función de copia; organiza con módulos, encabezados y sangrías; usa el Syllabus Maker para generar tu sílabo automáticamente; y verifica que todo funcione antes del primer día de clases.</p>
${AU('Tips para Canvas','01:45')}
<p style="font-size:11px;color:var(--t2);margin:6px 0 0;line-height:1.5">Las guías CanvasProSeries incluyen más de 16 tutoriales visuales paso a paso organizados en tres series: copia y actualización de contenido, publicación y organización de módulos, y ponderación y evaluación. Escríbenos si necesitas ayuda: mariananual@tec.mx o sa.romero@tec.mx.</p>
</div>`,
rh:'SEC 04',r:`<div class="pb" style="position:relative">
<div class="geo geo-5"></div>
<h3 style="font-size:14px;margin:0">Configura tu curso paso a paso</h3>
<p style="font-size:11px;color:var(--t3);margin:0 0 6px;line-height:1.5">Canvas es tu herramienta principal de gestión docente en EGADE. Para tus alumnos, el curso en Canvas es el punto de partida de su experiencia académica, por lo que la forma en que lo configures impacta directamente en su aprendizaje. Este tutorial te guía en los cinco pasos esenciales: copiar contenido anterior, organizar módulos, agregar materiales, configurar la evaluación y publicar. No necesitas ser experto en tecnología: con las guías CanvasProSeries y el soporte del equipo de Desarrollo Académico, tendrás tu curso listo en poco tiempo.</p>
${VD('Canvas paso a paso','4:00')}
<p style="font-size:11px;color:var(--t3);margin:6px 0;line-height:1.5">El Syllabus Maker es la herramienta oficial de EGADE para generar tu syllabus. Produce automáticamente el formato estandarizado de 13 secciones que incluye datos generales, resultados de aprendizaje con competencias CPE y CT, contenido por sesión con Business Questions, estructura de evaluación, rúbricas, recursos bibliográficos y políticas institucionales. Tu Director de Programa te compartirá la información base para completarlo.</p>
${AVT('Canvas','C','Usa el <strong>Syllabus Maker</strong> integrado para generar tu silabo.')}
<div style="height:6px"></div>

</div>`,t:'Canvas'},

// ═══ 15: SEC 04 — Quiz P1 (opcion multiple + V/F + completar) ═══
{lh:'SECCIÓN 04 | TU CURSO EN CANVAS',l:`<div class="pb" style="position:relative">
<div class="geo geo-3"></div>
<p style="font-size:11px;color:var(--t3);margin:0 0 4px;line-height:1.5">Esta infografía resume los cinco pasos para tener tu curso listo: copiar contenido de cursos anteriores (módulo por módulo, archivo .imscc o curso completo), organizar módulos con encabezados y sangrías para facilitar la navegación, agregar archivos y ligas externas, configurar la evaluación con grupos de tareas ponderados, y finalmente publicar verificando que todo funcione correctamente.</p>
<div class="img-half-v" onclick="fsOpen(this,'img')" style="background:url('imagen-de-prueba.jpg') center/cover no-repeat"><div class="img-n">Infografia Sec 04</div><div class="img-d">5 pasos para tu curso en Canvas</div></div>
<p style="font-size:11px;color:var(--t3);margin:4px 0;line-height:1.5">Las guías CanvasProSeries son tutoriales visuales organizados en tres series temáticas con más de 16 instructivos paso a paso: Serie 1 para copiar y actualizar contenido, Serie 2 para publicar y organizar módulos con archivos, ligas y encabezados, y Serie 3 para crear tareas, configurar ponderaciones y habilitar la coevaluación. Cada guía incluye capturas de pantalla detalladas para que puedas replicar cada acción fácilmente.</p>
${IM('Profesor usando laptop','2/3','Foto vertical rectangular')}
</div>`,
rh:'ACTIVIDAD',r:`<div class="pb">
<div class="sq-wrap" data-sec="4"><div class="sq-hd"> Actividad — Sección 04 (1/2)</div><div class="sq-bd">
<div class="sq-q"><div class="sq-num">1 / 4 — Opción múltiple</div><div class="sq-qt">¿Qué es un archivo .imscc?</div><ul class="mc" data-ok="1" data-p="10" data-y="¡Correcto! Un archivo .imscc es un paquete de exportación de Canvas que contiene todo el contenido de un curso: módulos, tareas, archivos y configuraciones. Es la forma más eficiente de migrar un curso completo de un periodo a otro sin perder estructura ni materiales." data-n="La respuesta correcta es 'Un curso exportado'. El formato .imscc permite exportar e importar cursos completos en Canvas, incluyendo módulos, tareas y archivos. Es una herramienta clave para no empezar de cero cada periodo."><li class="mo" onclick="sM(this)"><div class="rd"></div><span>Un tipo de imagen</span></li><li class="mo" onclick="sM(this)"><div class="rd"></div><span>Un curso exportado</span></li><li class="mo" onclick="sM(this)"><div class="rd"></div><span>Un PDF</span></li></ul><button class="btn" onclick="cM(this);chkSec(4)" disabled>Verificar</button><div class="fb"></div></div>
<div class="sq-q"><div class="sq-num">2 / 4 — Verdadero o Falso</div><div class="sq-qt">El Syllabus Maker está integrado en Canvas.</div><div class="to" data-ok="1" data-p="10" data-y="¡Correcto! El Syllabus Maker es la herramienta oficial de EGADE integrada en Canvas que genera automáticamente tu sílabo en el formato estandarizado de 13 secciones. Tu Director de Programa te proporcionará la información base para completarlo." data-n="Es verdadero. El Syllabus Maker está integrado en Canvas y genera el sílabo con formato estandarizado de 13 secciones de manera automática. Incluye datos generales, competencias CPE y CT, Business Questions y estructura de evaluación."><div class="tf" onclick="sT(this)">Falso</div><div class="tf" onclick="sT(this)">Verdadero</div></div><button class="btn" onclick="cT(this);chkSec(4)" disabled>Verificar</button><div class="fb"></div></div>
</div></div></div>`,t:'Quiz 04a'},

// ═══ 16: SEC 04 — Quiz P2 (sopa de letras + seleccionar 2) ═══
{lh:'SECCIÓN 04 | TU CURSO EN CANVAS',l:`<div class="pg-full">
${IM('Configuracion de tareas Canvas','16/9','Captura full')}
<div class="pg-overlay"><div class="pg-tag">Herramientas</div><h2>Configura<br>tu curso</h2></div>
</div>`,
rh:'ACTIVIDAD',r:`<div class="pb">
<div class="sq-wrap" data-sec="4"><div class="sq-hd"> Actividad — Sección 04 (2/2)</div><div class="sq-bd">
<div class="sq-q"><div class="sq-num">3 / 4 — Completar oración</div><div class="sq-qt">Completa:</div>
${FILL('El primer paso es ___ contenido anterior. Luego ___ módulos.',['copiar','organiza'],['organiza','publica','copiar','elimina'])}
</div>
<div class="sq-q"><div class="sq-num">4 / 4 — Selecciona 2</div><div class="sq-qt">Selecciona DOS herramientas de Canvas:</div><div class="ms-wrap" data-ok="0,2" data-p="10" data-y="¡Correcto! El Syllabus Maker genera tu sílabo en formato estandarizado de 13 secciones, y las guías CanvasProSeries incluyen más de 16 tutoriales visuales organizados en tres series temáticas para configurar tu curso paso a paso. Ambas son herramientas oficiales de EGADE." data-n="Las herramientas correctas son Syllabus Maker y CanvasProSeries. PowerPoint y Google Docs son herramientas externas; las herramientas propias de EGADE para Canvas son el Syllabus Maker (genera el sílabo) y CanvasProSeries (tutoriales de configuración)."><div class="ms-opt" onclick="sMS(this)"><div class="ck"></div><span>Syllabus Maker</span></div><div class="ms-opt" onclick="sMS(this)"><div class="ck"></div><span>PowerPoint</span></div><div class="ms-opt" onclick="sMS(this)"><div class="ck"></div><span>CanvasProSeries</span></div><div class="ms-opt" onclick="sMS(this)"><div class="ck"></div><span>Google Docs</span></div></div><button class="btn" onclick="cMS(this);chkSec(4)" disabled>Verificar</button><div class="fb"></div></div>
<div class="sq-progress" id="sp4"></div>
${TKW('Sec 04 — Tu Curso en Canvas','Checklist de 9 items, 3 series CanvasProSeries (16 tutoriales) y configuración avanzada.','takeaway/Takeaway_04_Tu_Curso_en_Canvas.pdf')}
<button class="sq-next" id="sn4" onclick="next()">Siguiente sección</button>
</div></div></div>`,t:'Quiz 04b'},

// ═══ 17: SEC 05 — Sidebar image layout ═══
{l:`<div class="pg-sidebar">
<div class="pg-sidebar-img">${IM('Profesor evaluando trabajos','3/4','Vertical full')}</div>
<div class="pg-sidebar-content">
<div class="sh" style="margin:-16px -22px 8px;padding:12px 16px"><div class="sn">Sección 05</div><h2>Evaluacion</h2></div>
<table class="tb"><thead><tr><th>Campo</th><th>Descripcion</th></tr></thead><tbody><tr><td><strong>Puntos</strong></td><td>Puntaje maximo</td></tr><tr><td><strong>Grupo</strong></td><td>Ponderacion</td></tr><tr><td><strong>Entrega</strong></td><td>Archivo, texto, URL</td></tr></tbody></table>
${DYK('<strong>Sabias que</strong> Canvas permite <strong>coevaluacion</strong>?')}
<h3 style="font-size:13px;margin:8px 0 4px">Configura tu evaluación</h3>
<p style="font-size:11px;color:var(--t2);margin:0 0 6px;line-height:1.5">En este audio aprenderás el flujo completo: primero crea los grupos de tareas que reflejen los rubros de tu syllabus (examen 25%, participación 10%, tareas 15%, evidencia aplicada 10%, proyecto 30%, colaborativos 10%), luego asigna porcentajes que sumen 100%, y finalmente publica las rúbricas antes de cada entrega.</p>
${AU('Configurar evaluacion','02:00')}
<p style="font-size:11px;color:var(--t2);margin:6px 0 0;line-height:1.5">Recuerda las políticas institucionales: promedio esperado entre 85 y 89, máximo 20% de estudiantes arriba de 95, y coevaluación mínima del 20% en proyectos colaborativos. La tarea debe estar publicada aunque la fecha de disponibilidad sea posterior.</p>
</div></div>`,lc:'cv',
rh:'SEC 05',r:`<div class="pb" style="position:relative">
<div class="geo geo-4"></div>
<h3 style="font-size:14px;margin:0">Sistema de evaluación EGADE</h3>
<p style="font-size:11px;color:var(--t3);margin:0 0 6px;line-height:1.5">EGADE es una escuela de alto rigor académico y sus políticas de evaluación reflejan este estándar. En este video aprenderás a configurar los grupos de tareas en Canvas para que reflejen exactamente la ponderación de tu syllabus, a crear tareas con instrucciones claras y tipos de entrega apropiados, y a habilitar la coevaluación entre pares. La estructura estándar es 60% evaluación individual y 40% en equipo, aunque puede variar según el programa.</p>
${VD('Evaluacion en Canvas','3:00')}
<p style="font-size:11px;color:var(--t3);margin:6px 0;line-height:1.5">Las políticas institucionales de EGADE establecen lineamientos claros: al menos el 50% de la evaluación debe ser individual, el promedio esperado del grupo debe estar entre 85 y 89, no más del 20% de estudiantes puede superar 95, la coevaluación debe representar mínimo el 20% en proyectos colaborativos, y todas las rúbricas deben estar publicadas en Canvas antes de que los alumnos realicen las actividades evaluadas. Estos lineamientos garantizan equidad y rigor.</p>
${AVT('Eval','E','Los grupos de tareas deben sumar <strong>100%</strong>.')}
<div style="height:6px"></div>

</div>`,t:'Evaluacion'},

// ═══ 18: SEC 05 — Quiz P1 (seleccionar 2 + V/F + opcion multiple) ═══
{lh:'SECCIÓN 05 | EVALUACIÓN',l:`<div class="pb" style="position:relative">
<div class="geo geo-2"></div>
<p style="font-size:11px;color:var(--t3);margin:0 0 4px;line-height:1.5">Esta infografía te guía paso a paso en la configuración de la evaluación: primero creas los grupos de tareas que reflejen los rubros de tu syllabus (examen, participación, tareas individuales, evidencia aplicada, proyecto y colaborativos), luego asignas los porcentajes asegurando que sumen 100%, después creas las tareas con instrucciones claras y fechas de entrega, y finalmente publicas las rúbricas para cada actividad evaluada.</p>
<div class="img-half-v" onclick="fsOpen(this,'img')" style="background:url('imagen-de-prueba.jpg') center/cover no-repeat"><div class="img-n">Infografia Sec 05</div><div class="img-d">Configurar evaluacion paso a paso</div></div>
<p style="font-size:11px;color:var(--t3);margin:4px 0;line-height:1.5">El libro de calificaciones de Canvas permite que tus alumnos consulten su avance en tiempo real por cada rubro de evaluación. Al configurar correctamente los grupos de tareas y sus ponderaciones, Canvas calcula automáticamente la calificación final. Esto genera transparencia y reduce las consultas sobre calificaciones, ya que cada estudiante puede ver exactamente cómo va en cada componente del curso.</p>
${IM('Calificaciones en Canvas','16/9','Captura horizontal')}
</div>`,
rh:'ACTIVIDAD',r:`<div class="pb">
<div class="sq-wrap" data-sec="5"><div class="sq-hd"> Actividad — Sección 05 (1/2)</div><div class="sq-bd">
<div class="sq-q"><div class="sq-num">1 / 4 — Verdadero o Falso</div><div class="sq-qt">Los porcentajes de los grupos de tareas deben sumar 100%.</div><div class="to" data-ok="1" data-p="10" data-y="¡Correcto! En Canvas, los grupos de tareas representan los rubros de evaluación de tu sílabo (examen, participación, tareas, proyecto, etc.) y sus porcentajes deben sumar exactamente 100% para que el libro de calificaciones calcule correctamente la nota final de cada estudiante." data-n="Es verdadero. Los grupos de tareas en Canvas deben sumar 100% para reflejar fielmente la ponderación de tu sílabo. Si no suman 100%, las calificaciones finales no se calcularán correctamente y generarán confusión entre los alumnos."><div class="tf" onclick="sT(this)">Falso</div><div class="tf" onclick="sT(this)">Verdadero</div></div><button class="btn" onclick="cT(this);chkSec(5)" disabled>Verificar</button><div class="fb"></div></div>
<div class="sq-q"><div class="sq-num">2 / 4 — Opción múltiple</div><div class="sq-qt">¿Qué hacer primero al configurar la evaluación?</div><ul class="mc" data-ok="0" data-p="10" data-y="¡Correcto! El primer paso es crear los grupos de tareas con sus porcentajes, ya que estos reflejan los rubros de tu sílabo (examen 25%, participación 10%, tareas 15%, etc.). Solo después de establecer esta estructura debes crear las tareas individuales dentro de cada grupo." data-n="Lo primero es crear los grupos de tareas con sus porcentajes. Antes de crear tareas individuales, necesitas definir la estructura de evaluación (grupos con ponderaciones que sumen 100%) para que Canvas calcule las calificaciones automáticamente."><li class="mo" onclick="sM(this)"><div class="rd"></div><span>Crear grupos con %</span></li><li class="mo" onclick="sM(this)"><div class="rd"></div><span>Crear tareas</span></li><li class="mo" onclick="sM(this)"><div class="rd"></div><span>Pedir al coordinador</span></li></ul><button class="btn" onclick="cM(this);chkSec(5)" disabled>Verificar</button><div class="fb"></div></div>
</div></div></div>`,t:'Quiz 05a'},

// ═══ 19: SEC 05 — Quiz P2 (ordenar + crucigrama) ═══
{lh:'SECCIÓN 05 | EVALUACIÓN',l:`<div class="pg-full">
${IM('Rubrica evaluacion Canvas','16/9','Captura full')}
<div class="pg-overlay"><div class="pg-tag">Herramientas</div><h2>Calificaciones</h2></div>
</div>`,
rh:'ACTIVIDAD',r:`<div class="pb">
<div class="sq-wrap" data-sec="5"><div class="sq-hd"> Actividad — Sección 05 (2/2)</div><div class="sq-bd">
<div class="sq-q"><div class="sq-num">3 / 4 — Selecciona 2</div><div class="sq-qt">Selecciona DOS tipos de entrega válidos en Canvas:</div><div class="ms-wrap" data-ok="0,1" data-p="10" data-y="¡Correcto! Archivo y URL son los tipos de entrega válidos en Canvas. Los estudiantes pueden subir documentos (PDF, Word, Excel) o compartir enlaces a trabajos alojados en plataformas externas. Recuerda que las rúbricas deben estar publicadas antes de cada entrega." data-n="Los tipos válidos son Archivo y URL. Canvas permite que los alumnos suban archivos o compartan enlaces. WhatsApp y correo electrónico no son canales oficiales de entrega; toda evaluación debe gestionarse dentro de Canvas para mantener el registro académico."><div class="ms-opt" onclick="sMS(this)"><div class="ck"></div><span>Archivo</span></div><div class="ms-opt" onclick="sMS(this)"><div class="ck"></div><span>URL</span></div><div class="ms-opt" onclick="sMS(this)"><div class="ck"></div><span>WhatsApp</span></div><div class="ms-opt" onclick="sMS(this)"><div class="ck"></div><span>Correo</span></div></div><button class="btn" onclick="cMS(this);chkSec(5)" disabled>Verificar</button><div class="fb"></div></div>
<div class="sq-q"><div class="sq-num">4 / 4 — Ordenar pasos</div><div class="sq-qt">Ordena los pasos de evaluación:</div>
<div class="ord-wrap"><ul class="ol" id="o2" data-ok="Crear grupos,Asignar porcentajes,Crear tareas,Publicar" data-p="10">
<li class="oi"><span style="color:var(--t3);font-size:8px">=</span><span>Publicar</span><div class="oa"><button onclick="mv(this,-1)">&#9650;</button><button onclick="mv(this,1)">&#9660;</button></div></li>
<li class="oi"><span style="color:var(--t3);font-size:8px">=</span><span>Crear grupos</span><div class="oa"><button onclick="mv(this,-1)">&#9650;</button><button onclick="mv(this,1)">&#9660;</button></div></li>
<li class="oi"><span style="color:var(--t3);font-size:8px">=</span><span>Crear tareas</span><div class="oa"><button onclick="mv(this,-1)">&#9650;</button><button onclick="mv(this,1)">&#9660;</button></div></li>
<li class="oi"><span style="color:var(--t3);font-size:8px">=</span><span>Asignar porcentajes</span><div class="oa"><button onclick="mv(this,-1)">&#9650;</button><button onclick="mv(this,1)">&#9660;</button></div></li>
</ul><button class="btn" onclick="cO(this);chkSec(5)">Verificar</button><div class="fb"></div></div></div>
<div class="sq-progress" id="sp5"></div>
${TKW('Sec 05 — Evaluación','Políticas EGADE, estructura 60/40, coevaluación, rúbricas y compromisos del alumno.','takeaway/Takeaway_05_Evaluacion.pdf')}
<button class="sq-next" id="sn5" onclick="next()">Siguiente sección</button>
</div></div></div>`,t:'Quiz 05b'},

// ═══ 20: SEC 06 — Quote + Content ═══
{l:`<div class="pg-quote">
<div>
<div style="font-family:var(--mn);font-size:9px;color:#C9A84C;letter-spacing:.25em;margin-bottom:10px">SECCIÓN 06</div>
<blockquote>"Tu crecimiento profesional es parte integral de EGADE"</blockquote>
<cite>Desarrollo Academico</cite>
</div></div>`,lc:'cv',
rh:'SEC 06',r:`<div class="pb" style="position:relative">
<div class="geo geo-5"></div><div class="geo geo-6"></div>
<h3>Desarrollo y Contactos</h3>
<div class="tlw"><div class="tli"><h4>Profesor Asistente</h4><p>Etapa inicial</p></div><div class="tli"><h4>Profesor Asociado</h4><p>Intermedia</p></div><div class="tli gld"><h4>Profesor Titular</h4><p>Avanzada</p></div></div>
<div style="display:flex;flex-direction:column;gap:4px">
<div class="ct"><div class="av">MN</div><div><h4>Mariana Nunez</h4><a href="mailto:mariananual@tec.mx">mariananual@tec.mx</a></div></div>
<div class="ct"><div class="av">AR</div><div><h4>Angellic Romero</h4><a href="mailto:sa.romero@tec.mx">sa.romero@tec.mx</a></div></div>
</div>
<h3 style="font-size:13px;margin:8px 0 4px">Tu trayectoria profesional</h3>
<p style="font-size:11px;color:var(--t2);margin:0 0 6px;line-height:1.5">Tu desarrollo en EGADE se estructura en tres etapas: Acercamiento Inicial (0-3 meses) con onboarding, configuración de Canvas y Autodiagnóstico de Competencias; Consolidación (3-12 meses) con acompañamiento pedagógico, Clasificación Docente y observación de clase; y Desarrollo Continuo (12+ meses) con plan de desarrollo en SuccessFactors, investigación y mentoría.</p>
${AU('Tu trayectoria','02:00')}
<p style="font-size:11px;color:var(--t2);margin:6px 0 0;line-height:1.5">El esquema de Clasificación Docente tiene tres niveles: Profesor Asistente (etapa inicial), Profesor Asociado (intermedia) y Profesor Titular (avanzada). Tu Director de Departamento te explicará los requisitos y el equipo de Desarrollo de Facultad te ayudará con el Autodiagnóstico de Competencias.</p>
</div>`,t:'Desarrollo'},

// ═══ 21: SEC 06 — Video + Takeaway ═══
{lh:'SECCIÓN 06 | DESARROLLO Y CONTACTOS',l:`<div class="pb" style="position:relative">
<div class="geo geo-3"></div>
<h3 style="font-size:14px;margin:0">Tu equipo de apoyo</h3>
<p style="font-size:11px;color:var(--t3);margin:0 0 6px;line-height:1.5">Tu desarrollo profesional es una prioridad para EGADE. La Dirección de Desarrollo Académico acompaña a los profesores durante toda su trayectoria: desde el primer día hasta su consolidación como docente de excelencia. En este video conocerás al equipo que está disponible para apoyarte con la configuración de tu curso en Canvas, el diseño de evaluaciones, estrategias de aprendizaje activo, innovación educativa y el acompañamiento personalizado que necesites.</p>
${VD('Tu equipo de apoyo','2:00')}
<p style="font-size:11px;color:var(--t3);margin:6px 0;line-height:1.5">El equipo de Desarrollo Académico está conformado por Mariana Núñez Almanza (Directora), Mili Gómez (Especialista en Diseño y Evaluación del Aprendizaje) y Angellic Romero (Especialista en Prácticas de Enseñanza). Además, cuentas con el apoyo de tu Director de Departamento para temas académicos, la Coordinación de Facultad para logística y lineamientos, Innovación Educativa para metodologías activas y la Biblioteca EGADE para acceso a bases de datos e investigación.</p>
${DYK('<strong>Sabias que</strong> EGADE tiene un programa de <strong>mentores</strong>?')}
<div style="height:6px"></div>
${AVT('Apoyo','A','Contactanos para cualquier duda.')}
</div>`,
rh:'SEC 06',r:`<div class="pb" style="position:relative">
<div class="geo geo-4"></div>
<p style="font-size:11px;color:var(--t3);margin:0 0 4px;line-height:1.5">Consulta esta infografía con el directorio completo de los equipos de apoyo, sus funciones y datos de contacto para que sepas a quién acudir en cada situación.</p>
<div class="img-half-v" onclick="fsOpen(this,'img')" style="background:url('imagen-de-prueba.jpg') center/cover no-repeat"><div class="img-n">Infografia Sec 06</div><div class="img-d">Directorio de equipos y contactos</div></div>
<h3 style="font-size:13px;margin:8px 0 4px">Programa de mentores</h3>
<p style="font-size:11px;color:var(--t3);margin:0 0 6px;line-height:1.5">EGADE cuenta con un programa de mentores donde tu Director de Departamento puede asignarte un colega experimentado que te acompañe durante tus primeros meses. No es una supervisión, es un apoyo entre pares: orientación sobre la cultura de la escuela, consejos para gestionar tu curso y oportunidades de colaboración e investigación.</p>
${AU('Programa de mentores','01:45')}
<p style="font-size:11px;color:var(--t3);margin:6px 0 0;line-height:1.5">Los profesores que han pasado por el programa de mentores reportan una integración más fluida y mayor satisfacción en su primer año. Si te interesa, habla con tu Director de Departamento. Contactos directos: mariananual@tec.mx, blancaegomez@tec.mx y sa.romero@tec.mx.</p>
</div>`,t:'Desarrollo'},

// ═══ 22: SEC 06 — Quiz P1 (relacion + V/F + completar) ═══
{lh:'SECCIÓN 06 | DESARROLLO Y CONTACTOS',l:`<div class="pg-full">
${IM('Equipo academico EGADE','16/9','Foto full')}
<div class="pg-overlay"><div class="pg-tag">Tu equipo</div><h2>Siempre<br>contigo</h2></div>
</div>`,
rh:'ACTIVIDAD',r:`<div class="pb">
<div class="sq-wrap" data-sec="6"><div class="sq-hd"> Actividad — Sección 06 (1/2)</div><div class="sq-bd">
<div class="sq-q"><div class="sq-num">1 / 4 — Relacionar columnas</div><div class="sq-qt">Conecta cada equipo con su función:</div><div class="mg" id="m3" data-p="10"><div class="mi" data-s="L" data-x="0" onclick="mC(this)">Biblioteca</div><div class="mi" data-s="R" data-x="1" onclick="mC(this)">Perfil alumnos</div><div class="mi" data-s="L" data-x="1" onclick="mC(this)">Coord. Experiencia</div><div class="mi" data-s="R" data-x="0" onclick="mC(this)">Bases de datos</div></div><div class="fb"></div></div>
<div class="sq-q"><div class="sq-num">2 / 4 — Verdadero o Falso</div><div class="sq-qt">El Director de Departamento participa en tu evaluación y plan de desarrollo.</div><div class="to" data-ok="1" data-p="10" data-y="¡Correcto! El Director de Departamento es una figura clave en tu trayectoria: participa en tu evaluación docente, te orienta en el proceso de Clasificación Docente (Asistente, Asociado, Titular) y puede asignarte un colega mentor durante tus primeros meses." data-n="Es verdadero. El Director de Departamento supervisa tu evaluación docente, te acompaña en el proceso de Clasificación Docente y coordina tu plan de desarrollo profesional. También puede asignarte un mentor para facilitar tu integración."><div class="tf" onclick="sT(this)">Falso</div><div class="tf" onclick="sT(this)">Verdadero</div></div><button class="btn" onclick="cT(this);chkSec(6)" disabled>Verificar</button><div class="fb"></div></div>
</div></div></div>`,t:'Quiz 06a'},

// ═══ 23: SEC 06 — Quiz P2 (opcion multiple + ordenar oracion) ═══
{lh:'SECCIÓN 06 | DESARROLLO Y CONTACTOS',l:`<div class="pb" style="position:relative">
<div class="geo geo-1"></div><div class="geo geo-2"></div>
<p style="font-size:11px;color:var(--t3);margin:0 0 4px;line-height:1.5">EGADE cuenta con espacios diseñados para fomentar el trabajo colaborativo entre profesores. La sala de profesores es un punto de encuentro donde puedes compartir experiencias con colegas de otros departamentos, preparar materiales para tus sesiones y participar en reuniones académicas. Tu Director de Departamento puede asignarte un colega mentor que te acompañe durante tus primeros meses de integración.</p>
${IM('Sala de profesores EGADE','3/4','Foto vertical')}
<p style="font-size:11px;color:var(--t3);margin:4px 0;line-height:1.5">Tu trayectoria como profesor en EGADE se estructura en tres etapas progresivas: Acercamiento Inicial (0-3 meses) donde completas el onboarding y configuras tu primer curso; Consolidación (3-12 meses) con acompañamiento pedagógico, observación de clase y proceso de Clasificación Docente; y Desarrollo Continuo (12+ meses) con plan de desarrollo en SuccessFactors, investigación y mentoría a nuevos profesores.</p>
${IM('Oficinas equipo academico','4/3','Foto horizontal')}
</div>`,
rh:'ACTIVIDAD',r:`<div class="pb">
<div class="sq-wrap" data-sec="6"><div class="sq-hd"> Actividad — Sección 06 (2/2)</div><div class="sq-bd">
<div class="sq-q"><div class="sq-num">3 / 4 — Opción múltiple</div><div class="sq-qt">¿Quién da acceso a bases de datos de investigación?</div><ul class="mc" data-ok="1" data-p="10" data-y="¡Correcto! La Biblioteca EGADE gestiona el acceso a bases de datos académicas y de investigación como JSTOR, EBSCO, Bloomberg y otras herramientas especializadas. Puedes contactarlos directamente para solicitar acceso o capacitación sobre los recursos disponibles." data-n="La respuesta correcta es Biblioteca EGADE. La Coordinación de Facultad gestiona procesos administrativos y logísticos, y Desarrollo Académico apoya con Canvas y estrategias pedagógicas, pero el acceso a bases de datos de investigación lo gestiona la Biblioteca."><li class="mo" onclick="sM(this)"><div class="rd"></div><span>Coord. Facultad</span></li><li class="mo" onclick="sM(this)"><div class="rd"></div><span>Biblioteca EGADE</span></li><li class="mo" onclick="sM(this)"><div class="rd"></div><span>Desarrollo Académico</span></li></ul><button class="btn" onclick="cM(this);chkSec(6)" disabled>Verificar</button><div class="fb"></div></div>
<div class="sq-q"><div class="sq-num">4 / 4 — Ordenar oración</div><div class="sq-qt">Ordena la oración:</div>
${SCR(['Coordinacion','de','Facultad','gestiona','procesos'],['procesos','de','gestiona','Coordinacion','Facultad'],6)}
</div>
<div class="sq-progress" id="sp6"></div>
${TKW('Sec 06 — Desarrollo y Contactos','Equipo de Desarrollo Académico, 3 trayectorias, recursos y contactos directos.','takeaway/Takeaway_06_Desarrollo_y_Contactos.pdf')}
<button class="sq-next" id="sn6" onclick="next()">Siguiente sección</button>
</div></div></div>`,t:'Quiz 06b'},

// ═══ 24: CIERRE ═══
{l:`<div class="pg-full">
${IM('Campus EGADE atardecer','16/9','Full-bleed')}
<div class="pg-overlay"><div class="pg-tag">Felicidades</div><h2>Booklet<br>completado</h2><p>Has finalizado tu guia de integracion</p></div>
</div>`,lc:'cv',
r:`<div class="pb" style="justify-content:center;padding:24px 30px;position:relative">
<div class="geo geo-4"></div><div class="geo geo-2"></div>
${LG(28)}
<div style="height:10px"></div>
<h3 style="font-size:16px;text-align:center">Proximos pasos</h3>
<div style="height:6px"></div>
<div class="ci"><div class="cx" onclick="tg(this)"></div><div style="font-size:11px">Correo institucional activado</div></div>
<div class="ci"><div class="cx" onclick="tg(this)"></div><div style="font-size:11px">Llave digital obtenida</div></div>
<div class="ci"><div class="cx" onclick="tg(this)"></div><div style="font-size:11px">Acceso a Canvas verificado</div></div>
<div class="ci"><div class="cx" onclick="tg(this)"></div><div style="font-size:11px">Silabo publicado</div></div>
<div class="ci"><div class="cx" onclick="tg(this)"></div><div style="font-size:11px">Tour de campus realizado</div></div>
<div class="ci"><div class="cx" onclick="tg(this)"></div><div style="font-size:11px">Reunion con departamento</div></div>
<div style="text-align:center;margin-top:6px;font-size:11px"><strong id="prTxt">0 / 6</strong></div>
<div class="pbar"><div class="pfill" id="prBar"></div></div>
<div style="height:8px"></div>
<div style="font-family:var(--mn);font-size:24px;color:#C9A84C;font-weight:700;text-align:center" id="fS">0 pts</div>
<div style="font-size:10px;color:var(--t3);text-align:center">Puntaje total</div>
<div style="font-size:9px;color:var(--t3);margin-top:6px;text-align:center">mariananual@tec.mx | sa.romero@tec.mx</div>
</div>`,rc:'cv',t:'Cierre'}
]

const bk=document.getElementById('bk');const N=S.length;
S.forEach((sp,i)=>{
  const skip=i<3||(sp.lc&&sp.rc&&!sp.lh);
  const l=document.createElement('div');l.className='pl'+(sp.lc?' '+sp.lc:'')+(i===0?' on':'');l.dataset.i=i;
  const lHead=!skip&&sp.lh?`<div class="sh"><span class="sh-sec">${sp.lh}</span></div>`:'';
  if(!sp.lc)l.innerHTML=`${lHead||'<div class="ph">'+LG()+'</div>'}${sp.l}<div class="pf"><span>EGADE Business School</span><span>${2*i}</span></div>`;
  else l.innerHTML=lHead+sp.l;
  bk.appendChild(l);
  if(i===0){const s=document.createElement('div');s.className='sp';bk.appendChild(s)}
  const r=document.createElement('div');r.className='pr'+(sp.rc?' '+sp.rc:'')+(i===0?' on':'');r.dataset.i=i;
  const rHead=!skip?`<div class="sh sh-logo">${LG(18)}</div>`:'';
  if(!sp.rc)r.innerHTML=`${rHead||'<div class="ph">'+LG()+'</div>'}${sp.r}<div class="pf"><span>EGADE Business School</span><span>${2*i+1}</span></div>`;
  else r.innerHTML=rHead+sp.r;
  bk.appendChild(r);
});
let cur=0,anim=false;
const dotsEl=document.getElementById('dots'),tocEl=document.getElementById('tocL');
for(let i=0;i<N;i++){const d=document.createElement('div');d.className='dd'+(i===0?' on':'');d.onclick=()=>go(i);dotsEl.appendChild(d);
  const t=document.createElement('div');t.className='tit';t.innerHTML=`<span class="tn">${i===0?'—':i}</span><span class="tt">${S[i].t}</span>`;t.onclick=()=>{go(i);togTOC()};tocEl.appendChild(t)}
function go(n){if(n<0||n>=N||n===cur)return;
  const oL=document.querySelector(`.pl[data-i="${cur}"]`),oR=document.querySelector(`.pr[data-i="${cur}"]`);
  const nL=document.querySelector(`.pl[data-i="${n}"]`),nR=document.querySelector(`.pr[data-i="${n}"]`);
  oL.classList.remove('on');oR.classList.remove('on');
  nL.classList.add('on');nR.classList.add('on');
  cur=n;updUI();if(cur===N-1)document.getElementById('fS').textContent=score+' pts';
}
function next(){go(cur+1)}function prev(){go(cur-1)}
function updUI(){document.getElementById('aL').classList.toggle('off',cur===0);document.getElementById('aR').classList.toggle('off',cur===N-1);document.getElementById('bpg').textContent=(cur+1)+'/'+N;document.querySelectorAll('.dd').forEach((d,i)=>d.className='dd'+(i===cur?' on':''))}
document.addEventListener('keydown',e=>{if(e.key==='ArrowRight')next();if(e.key==='ArrowLeft')prev()});
let tx=0;bk.addEventListener('touchstart',e=>{tx=e.touches[0].clientX});bk.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-tx;if(Math.abs(dx)>50){dx<0?next():prev()}});
function togTOC(){document.getElementById('tov').classList.toggle('sh')}
function addP(p){score+=p;document.getElementById('bsc').textContent=score+' pts'}
function oM(ti,tg,desc){document.getElementById('mc').innerHTML=`<button class="mdl-x" onclick="clM()">x</button><div class="mdl-top"><span class="mtg">${tg}</span><h3>${ti}</h3></div><div class="mdl-bd"><p>${desc}</p><button class="mdl-btn" onclick="clM()">Entendido</button></div>`;document.getElementById('mov').classList.add('sh')}
function clM(){document.getElementById('mov').classList.remove('sh')}
function startVD(poster,id){poster.style.display='none';const vid=document.getElementById('vv-'+id);vid.style.display='block';vid.play()}
function tA(b){playAU(b,+b.closest('.ap').dataset.auId)}
function playAU(b,id){const aud=document.getElementById('aud-'+id);if(!aud)return;
  if(aud.paused){aud.play();b.innerHTML='&#9646;&#9646;'}else{aud.pause();b.innerHTML='&#9654;'}
  aud.ontimeupdate=()=>{const pct=(aud.currentTime/aud.duration)*100;
    const fill=document.getElementById('apf-'+id);if(fill)fill.style.width=pct+'%';
    const t=document.getElementById('apt-'+id);if(t){const m=Math.floor(aud.currentTime/60);const s=Math.floor(aud.currentTime%60);t.textContent=m+':'+(s<10?'0':'')+s}};
  aud.onended=()=>{b.innerHTML='&#9654;';const fill=document.getElementById('apf-'+id);if(fill)fill.style.width='0%';const t=document.getElementById('apt-'+id);if(t)t.textContent='0:00'}}
function skipAU(id,sec){const aud=document.getElementById('aud-'+id);if(aud)aud.currentTime=Math.max(0,Math.min(aud.duration||0,aud.currentTime+sec))}
function seekAU(e,id){const aud=document.getElementById('aud-'+id);if(!aud||!aud.duration)return;const rect=e.currentTarget.getBoundingClientRect();const pct=(e.clientX-rect.left)/rect.width;aud.currentTime=pct*aud.duration}
function togX(el){el.classList.toggle('open');el.nextElementSibling.classList.toggle('open')}
function sM(el){el.closest('.mc').querySelectorAll('.mo').forEach(x=>x.classList.remove('s'));el.classList.add('s');const c=el.closest('.qd')||el.closest('.sq-q');if(c)c.querySelector('.btn').disabled=false}
function cM(btn){if(btn.disabled)return;btn.disabled=true;const bd=btn.closest('.qd')||btn.closest('.sq-q'),o=bd.querySelector('.mc'),ok=+o.dataset.ok,p=+o.dataset.p,its=[...o.querySelectorAll('.mo')],sel=its.findIndex(x=>x.classList.contains('s')),fb=bd.querySelector('.fb');its[ok].classList.add('ok');if(sel===ok){addP(p);fb.className='fb sh y';fb.textContent=o.dataset.y}else{its[sel].classList.add('no');fb.className='fb sh n';fb.textContent=o.dataset.n}its.forEach(x=>x.style.pointerEvents='none')}
function sT(el){el.closest('.to').querySelectorAll('.tf').forEach(x=>x.classList.remove('s'));el.classList.add('s');const c=el.closest('.qd')||el.closest('.sq-q');if(c)c.querySelector('.btn').disabled=false}
function cT(btn){if(btn.disabled)return;btn.disabled=true;const bd=btn.closest('.qd')||btn.closest('.sq-q'),o=bd.querySelector('.to'),ok=+o.dataset.ok,p=+o.dataset.p,its=[...o.querySelectorAll('.tf')],sel=its.findIndex(x=>x.classList.contains('s')),fb=bd.querySelector('.fb');its[ok].classList.add('ok');if(sel===ok){addP(p);fb.className='fb sh y';fb.textContent=o.dataset.y}else{its[sel].classList.add('no');fb.className='fb sh n';fb.textContent=o.dataset.n}its.forEach(x=>x.style.pointerEvents='none')}
function sMS(el){el.classList.toggle('s');const c=el.closest('.qd')||el.closest('.sq-q');c.querySelector('.btn').disabled=[...el.closest('.ms-wrap').querySelectorAll('.ms-opt.s')].length<1}
function cMS(btn){if(btn.disabled)return;btn.disabled=true;const bd=btn.closest('.qd')||btn.closest('.sq-q'),w=bd.querySelector('.ms-wrap'),ok=w.dataset.ok.split(',').map(Number),p=+w.dataset.p,its=[...w.querySelectorAll('.ms-opt')],sel=[];its.forEach((x,i)=>{if(x.classList.contains('s'))sel.push(i)});const fb=bd.querySelector('.fb');const correct=sel.length===ok.length&&sel.every(s=>ok.includes(s));
its.forEach((x,i)=>{if(ok.includes(i))x.classList.add('ok');else if(x.classList.contains('s'))x.classList.add('no')});
if(correct){addP(p);fb.className='fb sh y';fb.textContent=w.dataset.y}else{fb.className='fb sh n';fb.textContent=w.dataset.n}its.forEach(x=>x.style.pointerEvents='none')}
let mS=null;function mC(el){if(el.classList.contains('mk'))return;const g=el.closest('.mg');
  if(!mS){mS=el;el.classList.add('ms2')}else{if(mS.dataset.s===el.dataset.s){mS.classList.remove('ms2');mS=el;el.classList.add('ms2');return}
    const L2=mS.dataset.s==='L'?mS:el,R=mS.dataset.s==='R'?mS:el;
    if(L2.dataset.x===R.dataset.x){L2.classList.remove('ms2');R.classList.remove('ms2');L2.classList.add('mk');R.classList.add('mk');
      if([...g.querySelectorAll('[data-s="L"]')].every(m=>m.classList.contains('mk'))){addP(+g.dataset.p);const fb=g.closest('.qd').querySelector('.fb');fb.className='fb sh y';fb.textContent='Todas las conexiones correctas.';const secW=g.closest('[data-sec]');if(secW)chkSec(+secW.dataset.sec)}}
    else{L2.classList.remove('ms2');R.classList.remove('ms2');L2.classList.add('mx');R.classList.add('mx');setTimeout(()=>{L2.classList.remove('mx');R.classList.remove('mx')},400)}
    mS=null}}
function mv(btn,dir){const li=btn.closest('.oi'),ul=li.closest('.ol'),its=[...ul.children],idx=its.indexOf(li);
  if(dir===-1&&idx>0)ul.insertBefore(li,its[idx-1]);else if(dir===1&&idx<its.length-1)ul.insertBefore(its[idx+1],li)}
function cO(btn){if(btn.disabled)return;btn.disabled=true;const bd=btn.closest('.qd'),ul=bd.querySelector('.ol'),ok=ul.dataset.ok.split(','),p=+ul.dataset.p,its=[...ul.querySelectorAll('.oi')];
  let allOk=true;its.forEach((it,i)=>{const txt=it.querySelector('span:nth-child(2)').textContent.trim();if(txt===ok[i])it.classList.add('ok-pos');else{it.classList.add('no-pos');allOk=false}});
  const fb=bd.querySelector('.fb');if(allOk){addP(p);fb.className='fb sh y';fb.textContent='Orden correcto.'}else{fb.className='fb sh n';fb.textContent='Orden: '+ok.join(' > ')}
  its.forEach(it=>{it.querySelectorAll('button').forEach(b=>b.disabled=true)});const secW=bd.closest('[data-sec]');if(secW)chkSec(+secW.dataset.sec)}
function tg(el){el.classList.toggle('on');uP()}
function uP(){const t=document.querySelectorAll('.cx').length,d=document.querySelectorAll('.cx.on').length;document.getElementById('prTxt').textContent=d+' / '+t;document.getElementById('prBar').style.width=(d/t*100)+'%'}



// ═══ FULLSCREEN OVERLAY ═══
(function(){
  const ov=document.createElement('div');ov.className='fs-ov';ov.id='fsOv';
  ov.innerHTML='<button class="fs-close" onclick="fsClose()">&#x2715;</button><div id="fsCont"></div>';
  document.body.appendChild(ov);
  ov.addEventListener('click',e=>{if(e.target===ov)fsClose()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')fsClose()});
})();
function fsOpen(el,type){
  const cont=document.getElementById('fsCont');cont.innerHTML='';
  if(type==='vid'){const v=el.querySelector('video');if(v){const c=v.cloneNode(true);c.style.cssText='max-width:90vw;max-height:85vh;border-radius:6px';c.controls=true;c.removeAttribute('onplay');cont.appendChild(c);c.play().catch(()=>{})}}
  else{const img=document.createElement('img');img.src='imagen-de-prueba.jpg';img.style.cssText='max-width:90vw;max-height:85vh;border-radius:8px;object-fit:contain';
    cont.appendChild(img)}
  document.getElementById('fsOv').classList.add('sh');
}
function fsClose(){const ov=document.getElementById('fsOv');ov.classList.remove('sh');const v=ov.querySelector('video');if(v)v.pause();document.getElementById('fsCont').innerHTML=''}

// ═══ RESOURCE TRACKING ═══
function initViewed(){
  for(let i=0;i<N;i++){viewed[i]={};
    const pl=document.querySelector('.pl[data-i="'+i+'"]'),pr=document.querySelector('.pr[data-i="'+i+'"]');
    [pl,pr].forEach(p=>{if(!p)return;p.querySelectorAll('[data-rid]').forEach(el=>{viewed[i][el.dataset.rid]=false})})}}
function markViewed(el){if(!el||!el.dataset.rid)return;
  const page=el.closest('[data-i]');if(!page)return;
  const idx=+page.dataset.i,rid=el.dataset.rid;
  if(viewed[idx]&&viewed[idx][rid]===false){viewed[idx][rid]=true;
    const chk=el.querySelector('.res-chk');if(chk)chk.classList.add('done')}}
function getUnviewed(pageIdx){
  const missing=[];if(!viewed[pageIdx])return missing;
  for(const rid in viewed[pageIdx]){if(!viewed[pageIdx][rid]){
    const el=document.querySelector('[data-rid="'+rid+'"]');if(!el)continue;
    let label=rid;
    if(rid.startsWith('vid')){const s=el.querySelector('.vl span');if(s)label=s.textContent}
    else if(rid.startsWith('au')){const s=el.querySelector('.at2');if(s)label=s.textContent}
    else if(rid.startsWith('img')){const s=el.querySelector('.img-n');if(s)label=s.textContent}
    else if(rid.startsWith('xp')){const s=el.querySelector('.xt');if(s)label=s.textContent.replace(/[\u25B6\u25BA]/g,'').trim()}
    missing.push(label)}}
  return missing}
initViewed();

// ═══ SECTION QUIZ LOGIC ═══
const secDone={};
function sectionLocked(pageIdx){
  if(pageIdx<3||pageIdx>=N-1)return false;
  const hasNext=document.querySelector('.pl[data-i="'+pageIdx+'"] .sq-next, .pr[data-i="'+pageIdx+'"] .sq-next');
  if(!hasNext)return false;
  const wrap=document.querySelector('.pl[data-i="'+pageIdx+'"] .sq-wrap, .pr[data-i="'+pageIdx+'"] .sq-wrap');
  if(!wrap)return false;
  const sec=wrap.dataset.sec;
  return !secDone[sec];
}
function chkSec(sec){
  const wraps=document.querySelectorAll('[data-sec="'+sec+'"]');if(!wraps.length)return;
  let allQs=[];
  wraps.forEach(w=>{allQs=allQs.concat([...w.querySelectorAll('.sq-q')])});
  const answered=allQs.filter(q=>q.querySelector('.fb.sh')).length;
  // Update progress dots
  const prog=document.getElementById('sp'+sec);
  if(prog){prog.innerHTML='';allQs.forEach((q,i)=>{const dot=document.createElement('span');dot.className='sq-dot';
    const fb=q.querySelector('.fb.sh');if(fb){dot.classList.add(fb.classList.contains('y')?'ok':'no')}
    prog.appendChild(dot)})}
  if(answered>=allQs.length){secDone[sec]=true;
    const btn=document.getElementById('sn'+sec);if(btn)btn.classList.add('sh')}}
function showQuizBlockPopup(){
  const wrap=document.querySelector('.pr[data-i="'+cur+'"] .sq-wrap, .pl[data-i="'+cur+'"] .sq-wrap');
  if(wrap){wrap.scrollIntoView({behavior:'smooth',block:'center'})}
  // Show popup
  document.getElementById('mc').innerHTML='<button class="mdl-x" onclick="clM()">x</button><div class="mdl-top"><span class="mtg">ACTIVIDAD PENDIENTE</span><h3>Completa las preguntas</h3></div><div class="mdl-bd"><p>Responde las 4 preguntas de esta sección para continuar.</p><button class="mdl-btn" onclick="clM()">Entendido</button></div>';
  document.getElementById('mov').classList.add('sh');
}

// ═══ BLOCK NAV POPUP ═══
(function(){
  const ov=document.createElement('div');ov.className='blk-ov';ov.id='blkOv';
  ov.innerHTML='<div class="blk-box"><div class="blk-hd"><div class="blk-ico">!</div><h3>Recursos pendientes</h3></div><div class="blk-bd"><p>Revisa todos los recursos de esta pagina antes de continuar.</p><ul class="blk-list" id="blkList"></ul><div class="blk-btns"><button class="blk-skip" onclick="closeBlock(true)">Continuar</button><button class="blk-back" onclick="closeBlock(false)">Volver</button></div></div></div>';
  document.body.appendChild(ov);
  ov.addEventListener('click',e=>{if(e.target===ov)closeBlock(false)});
})();
function showBlockPopup(missing){
  const ul=document.getElementById('blkList');ul.innerHTML='';
  missing.forEach(m=>{const li=document.createElement('li');li.textContent=m;ul.appendChild(li)});
  document.getElementById('blkOv').classList.add('sh')}
function closeBlock(skip){document.getElementById('blkOv').classList.remove('sh');if(skip)go(cur+1)}
