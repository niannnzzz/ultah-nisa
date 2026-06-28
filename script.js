const cur=document.getElementById('cur');
const curRing=document.getElementById('cur-ring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{
  mx=e.clientX;my=e.clientY;
  cur.style.left=mx+'px';cur.style.top=my+'px';
});
(function ringFollow(){
  rx+=(mx-rx)*.14;ry+=(my-ry)*.14;
  curRing.style.left=rx+'px';curRing.style.top=ry+'px';
  requestAnimationFrame(ringFollow);
})();
document.querySelectorAll('button,.nav-card,.pol,.mini-player,.nk,.love-btn').forEach(el=>{
  el.addEventListener('mouseenter',()=>{cur.classList.add('big');curRing.classList.add('big')});
  el.addEventListener('mouseleave',()=>{cur.classList.remove('big');curRing.classList.remove('big')});
});

const v3d=document.getElementById('video3d');
if(v3d){
  document.addEventListener('mousemove',e=>{
    const rect=v3d.getBoundingClientRect();
    const cx=rect.left+rect.width/2,cy=rect.top+rect.height/2;
    const dx=(e.clientX-cx)/window.innerWidth;
    const dy=(e.clientY-cy)/window.innerHeight;
    v3d.style.transform=`rotateY(${dx*14-6}deg) rotateX(${-dy*9+3}deg)`;
    v3d.style.animation='none';
  });
  v3d.addEventListener('mouseleave',()=>{
    v3d.style.transform='';
    v3d.style.animation='hero-float 4s ease-in-out infinite';
  });
}

const cvs=document.getElementById('ptx'),pctx=cvs.getContext('2d');
let pts=[];
function rsz(){cvs.width=innerWidth;cvs.height=innerHeight}
rsz();window.addEventListener('resize',rsz);
const pc=['rgba(232,122,165,','rgba(255,176,200,','rgba(212,122,160,','rgba(255,184,208,','rgba(255,192,220,'];
function mkP(){return{x:Math.random()*cvs.width,y:Math.random()*cvs.height,r:.3+Math.random()*1.6,dx:(Math.random()-.5)*.28,dy:-.1-Math.random()*.32,a:Math.random()*.4+.08,c:pc[~~(Math.random()*pc.length)]}}
for(let i=0;i<70;i++)pts.push(mkP());
(function loop(){
  pctx.clearRect(0,0,cvs.width,cvs.height);
  pts.forEach((p,i)=>{
    pctx.beginPath();pctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    pctx.fillStyle=p.c+p.a+')';pctx.fill();
    p.x+=p.dx;p.y+=p.dy;p.a-=.00075;
    if(p.a<=0||p.y<-5)pts[i]=mkP();
  });
  requestAnimationFrame(loop);
})();

// ubah pin
const PASS='1234';let inp='';
function updateDots(){
  for(let i=0;i<4;i++){
    const d=document.getElementById('pd'+i);
    const was=d.classList.contains('filled');
    const now=i<inp.length;
    if(now!==was){
      d.classList.toggle('filled',now);
    }
  }
}
function pk(n){
  if(inp.length<4){
    inp+=n;
    updateDots();
    const d=document.getElementById('pd'+(inp.length-1));
    d.style.transform='scale(1.4)';
    setTimeout(()=>d.style.transform='',150);
    if(inp.length===4)setTimeout(chkPw,300);
  }
}
function clr(){inp='';updateDots()}
function chkPw(){
  if(inp===PASS){showPg('pg-quiz');initQuiz();}
  else{
    const e=document.getElementById('err-msg');
    e.innerHTML='<i class="fa-solid fa-xmark"></i> Salah nih! Coba lagi~';
    e.className='err do-shake';
    document.getElementById('pin-dots').classList.add('do-shake');
    for(let i=0;i<4;i++){
      const d=document.getElementById('pd'+i);
      d.style.background='var(--blush)';d.style.borderColor='var(--blush)';
      d.style.boxShadow='0 0 12px rgba(232,133,122,.6)';
    }
    setTimeout(()=>{
      e.className='err';e.innerHTML='';
      document.getElementById('pin-dots').classList.remove('do-shake');
      for(let i=0;i<4;i++){
        const d=document.getElementById('pd'+i);
        d.style.background='';d.style.borderColor='';d.style.boxShadow='';
      }
    },1800);
    clr();
  }
}

const Qs=[
  {icon:'fa-ghost',q:'Be real... berapa lama kamu ghosting seseorang dan pura-pura HP mati?',o:['Nggak pernah (bohong banget)','2-3 hari doang','Seminggu lebih, sori bukan sori','Sampai orangnya nyerah sendiri 💀']},
  {icon:'fa-bed',q:'Jam berapa kamu tidur kalau besok ada sesuatu yang penting?',o:['Jam 10, aku disiplin queen','Jam 12-an lah wajar','Jam 2 pagi, scroll dulu bentar','Pagi-pagi baru tidur, yolo']},
  {icon:'fa-brain',q:'Pernah typing "..." di chat tapi akhirnya delete semua dan kirim "oke" doang?',o:['Nggak pernah, aku berani','Sekali dua kali...','SANGAT sering ini healing aku','Lebih sering dari napas']},
  {icon:'fa-car',q:'"Bentar lagi sampai" — padahal masih dimana?',o:['Udah di depan pintu, jujur','Masih di jalan, 5 menit lagi (30 menit)','Masih di rumah belom mandi','Bahkan belom bangun dari kasur 💀']},
  {icon:'fa-phone',q:'Kalau ada missed call, respons pertama kamu?',o:['Langsung balik call','WhatsApp dulu "ada apa?"','Tunggu sampe ada WA masuk','Lihat siapa, terus kabur']},
  {icon:'fa-moon',q:'Scroll HP jam 2 pagi dan nemu post orang yang bikin perasaan campur aduk, kamu...',o:['Close app, tidur, dewasa','Screenshot simpan dulu','Stalking akun sampe archive 2019','Reply dengan meme biar keliatan santai']},
  {icon:'fa-heart-crack',q:'Pernah nulis paragraf curhat panjang di notes HP terus nggak dikirim ke siapapun?',o:['Nggak pernah, aku verbal','Pernah sekali (bohong)','Ada folder khusus namanya "drafts"','Aku HIDUP di notes app seriusan']}
];
const LETTERS=['A','B','C','D'];
const RC=[
  'Kamu orangnya innocent banget, jaga terus ya 🥺',
  'Relatable energy 100% certified 😭',
  'Real ones tau kamu jawab ini dengan penuh penghayatan',
  'Kamu tuh bisa jadi konten kreator "Day in My Life" 💅',
  'Selamat! Kamu lulus ujian kejujuran (hampir)',
  'Aku tau kamu skip beberapa jawaban yang paling jujur 😏',
  'Valid semua, kamu menang hidup! 🥳'
];
let cQ=0,sc=0;
function initQuiz(){cQ=0;sc=0;renderQ()}
function renderQ(){
  document.getElementById('quiz-res').style.display='none';
  document.getElementById('quiz-q-wrap').style.display='block';
  const q=Qs[cQ];
  document.getElementById('q-icon').innerHTML='<i class="fa-solid '+q.icon+'"></i>';
  document.getElementById('q-txt').textContent='Q'+(cQ+1)+'. '+q.q;
  document.getElementById('q-counter').textContent=(cQ+1)+' / '+Qs.length;
  document.getElementById('quiz-fill').style.width=((cQ/Qs.length)*100)+'%';
  const op=document.getElementById('q-opts');op.innerHTML='';
  q.o.forEach((o,i)=>{
    const b=document.createElement('button');b.className='qopt';
    b.innerHTML='<span class="qopt-letter">'+LETTERS[i]+'</span>'+o;
    b.onclick=()=>pickA(b);op.appendChild(b);
  });
}
function pickA(btn){
  document.querySelectorAll('.qopt').forEach(b=>b.disabled=true);
  btn.classList.add('picked');sc++;
  setTimeout(()=>{cQ++;cQ>=Qs.length?showRes():renderQ()},720);
}
function showRes(){
  document.getElementById('quiz-q-wrap').style.display='none';
  const r=document.getElementById('quiz-res');r.style.display='block';
  document.getElementById('quiz-fill').style.width='100%';
  document.getElementById('res-score').textContent=sc+'/'+Qs.length+' ⭐';
  document.getElementById('res-comment').textContent=RC[~~(Math.random()*RC.length)];
}

let loveProgress=0,loveHolding=false,loveDone=false,loveDraining=false;
function goToLove(){showPg('pg-love');resetLove()}
function resetLove(){loveProgress=0;loveDone=false;loveHolding=false;loveDraining=false;updateLoveVisual();document.getElementById('love-msg').textContent='Tekan & tahan buktiin sayangmu...';document.getElementById('love-svg').style.filter='drop-shadow(0 0 0px rgba(196,86,106,0))';}
function startLove(){if(loveDone)return;loveHolding=true;loveDraining=false;loveLoop();}
function stopLove(){loveHolding=false;if(loveDone)return;if(loveProgress>=95){loveComplete();}else if(loveProgress>15){document.getElementById('love-msg').textContent='Yah... kurang sayang nampaknya 😢';drainHeart();}else{drainHeart();}}
function loveLoop(){if(!loveHolding)return;loveProgress=Math.min(100,loveProgress+0.35);updateLoveVisual();updateLoveMsg();requestAnimationFrame(loveLoop);}
function drainHeart(){loveDraining=true;const drain=()=>{if(loveHolding||loveProgress<=0){loveProgress=0;loveDraining=false;updateLoveVisual();setTimeout(()=>{if(!loveDone)document.getElementById('love-msg').textContent='Tekan & tahan buktiin sayangmu...';},300);return;}loveProgress=Math.max(0,loveProgress-1.2);updateLoveVisual();requestAnimationFrame(drain);};drain();}
function updateLoveVisual(){const fill=document.getElementById('heart-fill');const y=100-loveProgress;fill.setAttribute('y',y);fill.setAttribute('height',Math.max(0,loveProgress));document.getElementById('love-pct').textContent=~~loveProgress+'%';document.getElementById('love-glow').style.opacity=loveProgress/100*0.65;document.getElementById('love-svg').style.filter='drop-shadow(0 0 '+~~(loveProgress/4.5)+'px rgba(196,86,106,'+(loveProgress/180)+'))';}
function updateLoveMsg(){if(loveDraining)return;let msg='Tekan & tahan buktiin sayangmu...';if(loveProgress>15)msg='Masih kurang nih... 😅';if(loveProgress>30)msg='Sedikit lagi sayang... 💪';if(loveProgress>50)msg='Hampir sampai! 😍';if(loveProgress>70)msg='Sekitar lagii!! 💗';if(loveProgress>85)msg='FULL! Kamu sayang bangeet! ❤️‍🔥';document.getElementById('love-msg').textContent=msg;}
function loveComplete(){loveDone=true;loveHolding=false;document.getElementById('love-msg').textContent='Aku tau kamu sayang aku banget ❤️';for(let i=0;i<28;i++)setTimeout(()=>spawnLoveHeart(),i*65);setTimeout(()=>goToSpotify(),2500);}
function spawnLoveHeart(){const h=document.createElement('div');h.textContent='❤️';const sz=12+Math.random()*24;h.style.cssText='position:fixed;font-size:'+sz+'px;left:'+(20+Math.random()*60)+'vw;bottom:-30px;pointer-events:none;z-index:30;';document.body.appendChild(h);h.animate([{transform:'translateY(0) scale(0) rotate(0deg)',opacity:1},{transform:'translateY(-'+(innerHeight+60)+'px) scale(1) rotate('+(Math.random()*50-25)+'deg)',opacity:0}],{duration:1700+Math.random()*1600,easing:'ease-out'}).onfinish=()=>h.remove();}

function goToSpotify(){
  showPg('pg-spotify');
  const eq=document.getElementById('sp-eq');eq.innerHTML='';
  ['.25s','.5s','.18s','.65s','.38s','.55s','.3s','.45s','.2s','.6s'].forEach(d=>{const b=document.createElement('div');b.className='sp-eq-b';b.style.setProperty('--d',d);eq.appendChild(b);});
  const fill=document.getElementById('sp-fill');fill.style.animation='none';
  requestAnimationFrame(()=>fill.style.animation='sp-progress 5s linear forwards');
  let sec=0;const timer=setInterval(()=>{sec++;const m=~~(sec/60),s=sec%60;document.getElementById('sp-now-time').textContent=m+':'+(s<10?'0':'')+s;},1000);
  setTimeout(()=>{clearInterval(timer);showPg('pg-bday');setTimeout(startCake,350)},5000);
}

let cakeDone=false;
function startCake(){
  if(cakeDone)return;cakeDone=true;
  document.querySelectorAll('#pg-bday .ck').forEach((l,i)=>setTimeout(()=>l.classList.add('drop'),i*550));
  setTimeout(()=>document.querySelector('.flame').style.opacity='1',document.querySelectorAll('#pg-bday .ck').length*550+200);
  const ci=setInterval(spawnCf,90);setTimeout(()=>clearInterval(ci),5500);
}
const cfC=['#e87aa0','#ff6b9d','#d46b8a','#c46888','#ff9eb5','#ffa0c0','#ffb8d0','#c4566a'];
function spawnCf(){const c=document.createElement('div');c.className='cf';const sz=5+Math.random()*7;c.style.cssText='width:'+sz+'px;height:'+(sz*1.8)+'px;background:'+cfC[~~(Math.random()*cfC.length)]+';left:'+(Math.random()*100)+'vw;top:-20px;transform:rotate('+(Math.random()*360)+'deg);border-radius:'+(Math.random()>.5?'50%':'2px');document.body.appendChild(c);c.animate([{transform:'translateY(0) rotate(0deg)',opacity:1},{transform:'translateY(105vh) rotate('+(Math.random()*720)+'deg)',opacity:.12}],{duration:1800+Math.random()*2000,easing:'ease-in'}).onfinish=()=>c.remove();}

function goToMain(){showPg('pg-main');document.getElementById('bgm').play().catch(()=>{});buildMiniEq();startCountdown();document.getElementById('mp-vinyl').classList.add('spinning');}
let musicOn=true;
function buildMiniEq(){const eq=document.getElementById('mp-eq');eq.innerHTML='';['.2s','.45s','.15s','.5s','.3s'].forEach(d=>{const b=document.createElement('div');b.className='mp-eqb on';b.style.cssText='--d:'+d+';height:5px';eq.appendChild(b);});}
function toggleMusic(){const bgm=document.getElementById('bgm');musicOn=!musicOn;musicOn?bgm.play():bgm.pause();document.querySelectorAll('.mp-eqb').forEach(b=>b.classList.toggle('on',musicOn));document.getElementById('vol-ico').className=musicOn?'fa-solid fa-volume-high mp-vol':'fa-solid fa-volume-xmark mp-vol';document.getElementById('mp-vinyl').classList.toggle('spinning',musicOn);}

function startCountdown(){
  const el=document.getElementById('countdown');
  const t=new Date('2025-10-30T00:00:00').getTime();
  function tick(){
    const d=t-Date.now();
    if(d<0){el.innerHTML='<i class="fa-solid fa-cake-candles"></i> Happy Birthday!';return}
    const dd=~~(d/86400000),hh=~~((d%86400000)/3600000),mm=~~((d%3600000)/60000),ss=~~((d%60000)/1000);
    el.innerHTML='<b>'+dd+'</b>d <b>'+hh+'</b>h <b>'+mm+'</b>m <b>'+ss+'</b>s';
  }
  tick();setInterval(tick,1000);
}

function showPg(id){document.querySelectorAll('.pg').forEach(p=>p.classList.remove('on'));document.getElementById(id).classList.add('on')}

function openSlide(id){
  document.getElementById('slide-overlay').classList.add('on');
  document.querySelectorAll('.slide-pg').forEach(s=>s.classList.remove('on'));
  const s=document.getElementById(id);s.classList.add('on');s.scrollTop=0;
  if(id==='sl-letter')startTyping();
}
function closeSlide(){
  document.getElementById('slide-overlay').classList.remove('on');
  setTimeout(()=>{document.querySelectorAll('.slide-pg').forEach(s=>s.classList.remove('on'))},350);
}
function goToBday(){showPg('pg-bday');setTimeout(startCake,350)}

const LTR=`"Sayang, selamat ulang tahun! Hari ini tuh hari yang selalu aku tunggu, karna hari ini hari dimana orang yang paling aku sayang lahir ke dunia. Aku bener-bener bersyukur bisa ketemu kamu, bisa kenal kamu, dan akhirnya bisa bareng sama kamu sampai sekarang.

Rasanya tuh aku beruntung banget punya kamu di hidupku. Kamu yang selalu bikin aku ketawa, bikin aku semangat, bahkan pas hari-hari aku lagi capek banget.

Aku cuma mau bilang terima kasih karena kamu selalu ada buat aku, selalu ngerti aku, dan nggak pernah ninggalin aku walaupun kadang aku bikin kamu kesel. Kamu tuh rumah buat aku, tempat aku bisa jadi diri sendiri tanpa takut dihakimin.

Semoga di umurmu yang sekarang ini, semua yang kamu harapin pelan-pelan bisa tercapai. Aku doain kamu sehat selalu, makin bahagia, makin kuat, dan makin yakin sama jalan hidupmu.

Aku nggak bisa janji apa-apa yang besar, tapi aku janji bakal terus nemenin kamu, dukung kamu, dan sayang sama kamu tanpa alasan. Aku pengen kita terus bareng-bareng sampai nanti.

Selamat ulang tahun sekali lagi ya cintaku, aku sayang kamu lebih dari yang bisa aku ucapin ❤"`;
let ti=0,tt=null;
function startTyping(){clearTimeout(tt);ti=0;document.getElementById('typed-txt').textContent='';document.getElementById('bcur').style.display='inline-block';step()}
function step(){if(ti<LTR.length){document.getElementById('typed-txt').textContent+=LTR[ti++];tt=setTimeout(step,22)}else document.getElementById('bcur').style.display='none'}

function openLB(el){document.getElementById('lbimg').src=el.querySelector('img').src;document.getElementById('lbox').classList.add('on')}
function closeLB(){document.getElementById('lbox').classList.remove('on')}

document.querySelectorAll('.nav-card').forEach(el=>{
  el.addEventListener('click',function(e){
    const r=document.createElement('span');
    r.style.cssText='position:absolute;border-radius:50%;width:100px;height:100px;background:rgba(196,115,58,.2);left:'+(e.offsetX-50)+'px;top:'+(e.offsetY-50)+'px;transform:scale(0);pointer-events:none';
    this.appendChild(r);
    r.animate([{transform:'scale(0)',opacity:1},{transform:'scale(4)',opacity:0}],{duration:600}).onfinish=()=>r.remove();
  });
});
