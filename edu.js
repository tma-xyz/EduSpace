let S=[],M=[];
let Q,QALL=[];
let st={v:'home',sub:0,mat:0,q:'',lat:{i:0,pick:null,sc:0,done:false},ku:{i:0,ans:[],t:600,over:false},tm:null};
const $=s=>document.querySelector(s);
const navs=[['home','Beranda'],['materi','Materi'],['rangkuman','Rangkuman'],['latihan','Latihan'],['kuis','Kuis'],['dash','Dashboard']];
function go(v,x={}){if(!st.me&&v!=='intro'&&v!=='auth')v='auth';st.err='';st.tip=0;clearInterval(st.tm);Object.assign(st,x);st.v=v;if(v==='latihan'&&!x.keep)st.lat={i:0,pick:null,sc:0,done:false};if(v==='kuis'&&!x.keep){st.ku={i:0,ans:[],t:600,over:false};st.tm=setInterval(tick,1000)}render();scrollTo(0,0)}
function tick(){if(st.v!=='kuis'||st.ku.over)return clearInterval(st.tm);st.ku.t--;if(st.ku.t<=0)return finishKuis();const e=$('#tm');e?e.textContent=fmt(st.ku.t):0;if(st.ku.over)render()}
const fmt=s=>String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');
const ic=(e,c)=>`<span class="ic" style="background:${c}">${e}</span>`;
function mcard(m,i){return `<div class="card item">${ic(m.e,S[m.s].c)}<div><h3>${m.t}${badge(m)}</h3><p class="mu sm">${S[m.s].n} • ${m.k}</p><button class="btn s" onclick="openMat(${i})">${locked(m)?'🔒 Buka dengan Premium':'Pelajari'}</button></div></div>`}
function sideSubj(){return `<div class="side"><button class="${st.sub<0?'on':''}" onclick="st.sub=-1;render()">Semua Mata Pelajaran</button>${S.map((s,i)=>`<button class="${st.sub===i?'on':''}" onclick="st.sub=${i};st.lat={i:0,pick:null,sc:0,done:false};render()">${s.e} ${s.n}</button>`).join('')}</div>`}
const V={
home(){const r=M.filter(m=>hit(m));return `${greet()}${trackBar()}<div class="hero"><div><h1>Belajar Lebih Mudah Bersama EduSpace</h1><p class="mu">Akses materi, rangkuman, latihan soal, dan kuis dari berbagai mata pelajaran, kapan pun dan di mana pun.</p><div class="bar"><input id="hq" value="${st.q}" placeholder="Cari materi pelajaran…" aria-label="Cari materi"><button class="btn" onclick="st.q=$('#hq').value;go('cari')">Cari</button></div></div><div class="big" role="img" aria-label="Pelajar menggendong tas">${STUDENT}</div></div>
<h2>🎨 Mata Pelajaran</h2><div class="grid g6">${S.map((s,i)=>`<button class="card subj" style="--sc:${s.c}" onclick="go('materi',{sub:${i}})">${ic(s.e,s.c)}<h3>${s.n}</h3><span class="mu sm">${s.m} materi</span></button>`).join('')}</div>
<h2>🔥 Rekomendasi Materi Terbaru</h2><div class="grid g3">${M.slice(0,3).map((m,i)=>mcard(m,i)).join('')}</div>`},
materi(){const l=M.map((m,i)=>[m,i]).filter(([m])=>(st.sub<0||m.s===st.sub)&&hit(m));return `${head('Materi Pembelajaran','Pilih mata pelajaran untuk melihat materi sesuai kelasmu.','Mau belajar apa hari ini? 🤔')}<div class="layout">${sideSubj()}<div><div class="row"><input placeholder="Cari materi…" value="${st.q}" oninput="st.q=this.value;clearTimeout(window.dt);window.dt=setTimeout(()=>{render();const e=$('.row input');e.focus();e.setSelectionRange(e.value.length,e.value.length)},300)" aria-label="Cari materi"><select aria-label="Pilih kelas" onchange="const v=this.value; if(v){setTrack(v)}"><option value="">Pilih TKA / UTBK</option><option value="sd" ${st.track==='sd'?'selected':''}>TKA SD</option><option value="smp" ${st.track==='smp'?'selected':''}>TKA SMP</option><option value="sma" ${st.track==='sma'?'selected':''}>TKA SMA</option><option value="utbk" ${st.track==='utbk'?'selected':''}>UTBK</option></select></div><div class="grid g2">${l.map(([m,i])=>mcard(m,i)).join('')||'<p class="mu">Belum ada materi yang cocok. Coba kata kunci lain.</p>'}</div></div></div>`},
detail(){const m=M[st.mat]||M[0],sb=S[m.s];const full=`<p>${m.r}</p><h3>Yang perlu dipahami</h3><ul><li>Pahami konsep utama dari topik <b>${m.t}</b>.</li><li>Perhatikan istilah, rumus, contoh, dan hubungan antaride yang muncul.</li><li>Gunakan informasi dari materi untuk menjawab latihan dan kuis.</li></ul><p><b>Tips belajar:</b> ${m.tip}</p>`;return `<button class="crumb" onclick="go('materi')">‹ Kembali ke Materi</button><div class="card item" style="align-items:center">${ic(m.e,sb.c)}<div><h3 style="font-size:18px">${m.t}</h3><span class="mu sm">${sb.n} • ${m.k}</span></div></div><div class="layout" style="margin-top:14px"><div class="side"><button class="on">Materi Lengkap</button><button onclick="go('rangkuman',{sub:${m.s}})">Rangkuman</button><button onclick="go('latihan',{sub:${m.s}})">Latihan</button><button onclick="go('kuis',{sub:${m.s}})">Kuis</button></div><div><div class="card lesson"><h2 style="margin-top:0">Materi Lengkap</h2>${full}</div><div class="keypoints"><h3>📌 Poin Penting / Ringkasan</h3><p style="margin:6px 0 0">${m.r}</p></div><div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-top:16px"><button class="btn s" onclick="go('materi')">‹ Kembali ke Materi</button><button class="btn" onclick="go('latihan',{sub:${m.s}})">Uji dengan Latihan ›</button></div></div></div>`},
rangkuman(){const l=M.filter(m=>st.sub<0||m.s===st.sub);return `${head('Rangkuman Materi','Poin penting agar materi mudah diingat.','Ringkas tapi lengkap! ⚡')}<button class="crumb" onclick="go('materi')">‹ Kembali ke Materi</button><div class="layout">${sideSubj()}<div class="grid g2">${l.map(m=>`<div class="card item">${ic(m.e,S[m.s].c)}<div><h3>${m.t}${badge(m)}</h3><p class="mu sm">${S[m.s].n} • ${m.k}</p><button class="btn s" onclick="openMat(${M.indexOf(m)})">${locked(m)?'🔒 Buka dengan Premium':'Baca Rangkuman'}</button></div></div>`).join('')}</div></div>`},
latihan(){const L=st.lat,q=Q[L.i];if(L.done)return `<div class="card" style="max-width:480px;margin:auto;text-align:center">${confetti()}<div class="pop" style="font-size:60px">🎉</div><h2>Latihan selesai</h2><div class="score">${L.sc}/${Q.length}</div><p class="mu">Jawaban benar</p>${upsell('Paket Gratis membuka 5 soal latihan. Premium: 10 soal TKA atau 15 soal UTBK.')}<button class="btn w" onclick="go('latihan')">Ulangi Latihan</button></div>`;
return `${head('Latihan Soal','Uji pemahamanmu dengan soal-soal berikut.',L.pick===null?'Ayo pilih jawabanmu! 🤗':L.pick===q.a?'Mantap, jawabanmu benar! 🎉':'Hampir! Baca lagi ya, kamu pasti bisa 💪')}<div class="layout">${sideSubj()}<div class="card"><div style="display:flex;justify-content:space-between"><span class="tag">${S[Math.max(st.sub,0)].n} • ${TRK[st.track]}</span><span class="sm mu">Soal ${L.i+1} dari ${Q.length}</span></div><div class="prog" style="margin:10px 0"><i style="width:${(L.i+1)/Q.length*100}%"></i></div><h3 style="font-size:17px;margin:14px 0">${q.q}</h3>${q.o.map((o,j)=>{let c=L.pick===null?'':j===q.a?'ok':j===L.pick?'no':'';return `<button class="opt ${c}" ${L.pick!==null?'disabled':''} onclick="pick(${j})"><b>${'ABCD'[j]}.</b> ${o}</button>`}).join('')}${L.pick!==null?`<p class="${L.pick===q.a?'':'mu'}">${L.pick===q.a?'Benar! Kerja bagus.':'Belum tepat. Jawaban yang benar: '+q.o[q.a]+'.'}</p>`:''}<div style="display:flex;justify-content:space-between;margin-top:10px"><button class="btn s" ${L.i?'':'disabled'} onclick="st.lat.i--;st.lat.pick=null;render()">‹ Sebelumnya</button><button class="btn" ${L.pick===null?'disabled':''} onclick="nextL()">${L.i===Q.length-1?'Selesai':'Berikutnya ›'}</button></div></div></div>`},
kuis(){const K=st.ku;if(K.over){const c=K.ans.filter((a,i)=>a===Q[i].a).length,sc=Math.round(c/Q.length*100);return `<div class="grid g2"><div class="card" style="text-align:center;max-width:420px;margin:auto">${confetti()}<div class="pop" style="font-size:60px">🏅</div><h2>Hasil Kuis</h2><h3>${sc>=80?'Kamu Hebat!':sc>=50?'Bagus, terus berlatih!':'Ayo coba lagi!'}</h3><div class="score">${sc}/100</div><p class="mu">${c} dari ${Q.length} soal benar</p>${upsell('Paket Gratis membuka 5 soal kuis. Premium: 10 soal TKA atau 15 soal UTBK.')}<button class="btn s w" style="margin-bottom:8px" onclick="go('rangkuman')">Lihat Pembahasan</button><button class="btn w" onclick="go('home')">Kembali ke Beranda</button></div></div>`}
const q=Q[K.i];return `${head('Kuis','Jawab dengan benar dan raih skor terbaik.',K.ans.filter(a=>a!==undefined).length?'Terus lanjut, tinggal sedikit lagi! 🚀':'Siap? Waktu mulai berjalan! ⏱️')}<div class="layout" style="grid-template-columns:1fr 220px"><div class="card"><div style="display:flex;justify-content:space-between"><select aria-label="Mata pelajaran" onchange="go('kuis',{sub:+this.value})">${S.map((x,i)=>`<option value="${i}" ${i===Math.max(st.sub,0)?'selected':''}>${x.n}</option>`).join('')}</select><b>⏱ <span id="tm">${fmt(K.t)}</span></b></div><h3 style="font-size:17px;margin:16px 0">${K.i+1}. ${q.q}</h3>${q.o.map((o,j)=>`<button class="opt ${K.ans[K.i]===j?'sel':''}" onclick="st.ku.ans[st.ku.i]=${j};render()"><b>${'ABCD'[j]}.</b> ${o}</button>`).join('')}<div style="display:flex;justify-content:space-between;margin-top:10px"><button class="btn s" ${K.i?'':'disabled'} onclick="st.ku.i--;render()">‹ Sebelumnya</button>${K.i===Q.length-1?`<button class="btn" onclick="finishKuis()">Kumpulkan</button>`:`<button class="btn" onclick="st.ku.i++;render()">Berikutnya ›</button>`}</div></div><div class="card"><h3>Nomor Soal</h3><div class="num">${Q.map((_,i)=>`<button class="${i===K.i?'cur':K.ans[i]!==undefined?'done':''}" onclick="st.ku.i=${i};render()">${i+1}</button>`).join('')}</div><p class="sm mu" style="margin-top:12px">${K.ans.filter(a=>a!==undefined).length} dari ${Q.length} terjawab</p></div></div>`},
dash(){return `${head('Dashboard','Selamat datang, '+esc(st.me.n)+'! Lanjutkan belajarmu.','Kamu keren, terus semangat! 🔥')}<div class="stats"><div class="card stat"><span class="mu sm">Progres Belajar</span><b>${pg()}%</b><div class="prog"><i style="width:${pg()}%"></i></div></div><div class="card stat"><span class="mu sm">Latihan Selesai</span><b>${st.me.s.lat}</b></div><div class="card stat"><span class="mu sm">Nilai Kuis Terakhir</span><b>${st.me.s.kuis??'-'}</b></div></div>
<div class="grid g2"><div class="card"><h3>Materi yang Sedang Dipelajari</h3>${current()}</div><div class="card"><h3>Riwayat Belajar</h3>${history()}</div></div>
${mission()}${analysis()}<h2>Alur Pengguna</h2><div class="card flow">${[['🏠','Beranda'],['📚','Materi'],['📄','Detail Materi'],['📝','Latihan / Kuis'],['✅','Hasil']].map((f,i)=>(i?'<em>›</em>':'')+`<span><div style="font-size:26px">${f[0]}</div><b class="sm">${f[1]}</b></span>`).join('')}</div>`}};

const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const LS={get(k){try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
let users=(LS.get('es_users')||[]).filter(u=>u.e!=='andi@eduspace.id');LS.set('es_users',users);st.me=null;st.mode='masuk';st.err='';st.f={};st.note='';
function render(){setQ();render0();rehead();modal();mascot()}
function rehead(){const n=$('#nav'),h=$('#hs'),cur=({detail:'materi',rsum:'rangkuman'})[st.v]||st.v;
if(st.me){n.innerHTML=navs.map(x=>`<button class="${x[0]===cur?'on':''}" onclick="go('${x[0]}')">${x[1]}</button>`).join('');
h.innerHTML=`<input id="gs" value="${esc(st.q||'')}" placeholder="Cari materi…" aria-label="Cari"><button class="btn s" onclick="st.q=$('#gs').value;go('cari')">Cari</button><span class="tag ${isPro()?'pro-b':''}">${planName()}</span><button class="pf ${st.v==='profil'?'on':''}" onclick="go('profil')" aria-label="Profil saya">${avatar(32)}<b>Profil</b></button><button class="btn s logout" onclick="logout()">Logout</button>`;
$('#gs').onkeydown=e=>{if(e.key==='Enter'){st.q=e.target.value;go('cari')}}}
else{n.innerHTML='';
h.innerHTML=`<button class="btn s" onclick="st.mode='masuk';go('auth')">Masuk</button><button class="btn" onclick="st.mode='daftar';go('auth')">Daftar</button>`}}
function login(u){LS.set('es_me',u.e);u.s=u.s||{lat:0,kuis:null,seen:[]};st.me=u;st.f={};st.picked=false;st.track=trackOf(u.k)||st.track;st.sub=-1;go('home')}
function logout(){st.me=null;st.picked=false;LS.set('es_me',null);go('intro')}
function fail(m){st.err=m;render()}
function doAuth(){const g=i=>$('#'+i)?$('#'+i).value.trim():'',e=g('ae').toLowerCase(),p=$('#ap').value,n=g('an');st.f={n,e};
if(st.mode==='daftar'){if(!n||!e||p.length<6)return fail('Isi nama, email @gmail.com, dan kata sandi minimal 6 karakter.');if(!/^[A-Z0-9._%+-]+@gmail\.com$/i.test(e))return fail('Email pendaftaran wajib menggunakan @gmail.com.');if(users.some(u=>u.e===e))return fail('Email ini sudah terdaftar. Silakan masuk.');const u={n,e,p,k:'',plan:null,s:{lat:0,kuis:null,seen:[]}};users.push(u);LS.set('es_users',users);login(u)}
else{const u=users.find(u=>u.e===e&&u.p===p);if(!u)return fail('Email atau kata sandi salah. Belum punya akun? Pilih Daftar.');login(u)}}
function saveP(){st.me.n=$('#pn').value.trim()||st.me.n;st.me.k=$('#pk').value;st.track=trackOf(st.me.k)||st.track;st.sub=-1;persist();st.note='Perubahan disimpan.';render()}
Object.assign(V,{
intro(){const F=[['📚','Materi','Penjelasan singkat per mata pelajaran dan kelas.'],['📄','Rangkuman','Poin penting untuk mengulang dengan cepat.'],['📝','Latihan Soal','Soal bertahap dengan koreksi langsung.'],['⏱️','Kuis','Uji kemampuan dengan timer dan skor akhir.'],['📊','Dashboard','Pantau progres, nilai, dan riwayat belajar.'],['👤','Profil','Atur data akun dan kelasmu.']];
return `<div class="hero"><div>${LOCK(72)}<h1>Belajar Lebih Mudah Bersama EduSpace</h1><p class="mu">Platform belajar untuk persiapan TKA (SD, SMP, SMA) dan UTBK (SMA). Baca materi, rangkuman, latihan soal, dan kuis di satu tempat.</p><div class="row" style="margin:16px 0 0"><button class="btn" onclick="document.getElementById('fitur').scrollIntoView({behavior:'smooth'})">Lihat Fitur</button></div></div><div class="big" role="img" aria-label="Pelajar menggendong tas">${STUDENT}</div></div>
<div class="stats" style="margin:18px 0 0"><div class="card stat"><b>3</b><span class="mu sm">Jenjang: SD, SMP, SMA</span></div><div class="card stat"><b>TKA + UTBK</b><span class="mu sm">Materi dan latihan soal</span></div><div class="card stat"><b>24 jam</b><span class="mu sm">Bisa diakses kapan saja</span></div></div>
<h2 id="fitur">Yang bisa kamu lakukan di EduSpace</h2><div class="grid g3">${F.map((f,i)=>`<div class="card item">${ic(f[0],['#dbeafe','#e0e7ff','#cffafe','#e0f2fe','#ede9fe','#ccfbf1'][i])}<div><h3>${f[1]}</h3><p class="mu sm" style="margin:0">${f[2]}</p></div></div>`).join('')}</div>
<h2>Cara belajar di EduSpace</h2><div class="card flow">${['Daftar / Masuk','Pilih materi','Baca rangkuman','Latihan & kuis','Pantau progres'].map((t,i)=>(i?'<em>›</em>':'')+`<span><div style="font-size:24px">${['🔑','📚','📄','📝','📊'][i]}</div><b class="sm">${t}</b></span>`).join('')}</div>
<div class="card cta"><h2 style="margin-top:0">Siap mulai belajar?</h2><p class="mu">Buat akun untuk membuka semua materi, latihan, dan kuis.</p><button class="btn" onclick="st.mode='daftar';go('auth')">Buat akun</button></div><p class="foot">© 2026 EduSpace. Platform belajar untuk siswa.</p>`},
auth(){const d=st.mode==='daftar',f=st.f||{};return `<div class="auth"><div class="pan">${LOCK(96,1)}<h2 style="margin-top:0">${d?'Buat akun EduSpace':'Selamat datang kembali'}</h2><p>Masuk dulu untuk membuka beranda, materi, rangkuman, latihan, kuis, dan dashboard belajarmu.</p><div style="width:min(230px,100%);margin:0 auto" aria-hidden="true">${STUDENT}</div></div><div class="card"><div class="auth-back"><button class="crumb" onclick="go('intro')">‹ Kembali ke Beranda</button><span class="sm mu">${d?'Pendaftaran':'Login'}</span></div><div class="row"><button class="btn ${d?'s':''}" onclick="st.mode='masuk';st.err='';render()">Masuk</button><button class="btn ${d?'':'s'}" onclick="st.mode='daftar';st.err='';render()">Daftar</button></div>${st.err?`<p class="err" role="alert">${esc(st.err)}</p>`:''}${d?`<div class="fld"><label for="an">Nama lengkap</label><input id="an" value="${esc(f.n||'')}" autocomplete="name"></div>`:''}<div class="fld"><label for="ae">Email</label><input id="ae" type="email" value="${esc(f.e||'')}" autocomplete="email"></div><div class="fld"><label for="ap">Kata sandi</label><input id="ap" type="password" autocomplete="${d?'new-password':'current-password'}" onkeydown="if(event.key==='Enter')doAuth()"></div><button class="btn w" onclick="doAuth()">${d?'Daftar':'Masuk'}</button></div></div>`},
profil(){const u=st.me,n=st.note;st.note='';return `${head('Profil Pengguna','Kelola data akun dan lihat ringkasan belajarmu.','Yuk lengkapi profilmu! 😊')}<div class="layout lp"><div class="card" style="text-align:center;align-self:start">${avatar(96)}<div class="row" style="justify-content:center;margin:12px 0 0"><button class="btn s" onclick="$('#pf').click()">📷 Ganti Foto</button>${u.photo?'<button class="btn s" onclick="delPhoto()">Hapus</button>':''}<input id="pf" type="file" accept="image/*" hidden onchange="setPhoto(this)"></div><h3 style="margin-top:10px">${esc(u.n)}</h3><p class="mu sm">${esc(u.e)}</p>${u.k?`<span class="tag">${esc(u.k)}</span> `:''}<span class="tag ${isPro()?'pro-b':''}">${planName()}</span><button class="btn w" style="margin-top:16px" onclick="openPlans()">Ubah paket</button><button class="btn s w" style="margin-top:8px" onclick="logout()">Keluar</button></div><div><div class="card"><h2 style="margin-top:0">Data Akun</h2><div class="fld"><label for="pn">Nama lengkap</label><input id="pn" value="${esc(u.n)}"></div><div class="fld"><label for="pe">Email</label><input id="pe" value="${esc(u.e)}" disabled></div><div class="fld"><label for="pk">Jenjang</label><select id="pk"><option value="" disabled ${u.k?'':'selected'}>Pilih jenjang</option>${['SD','SMP','SMA'].map(k=>`<option ${k===u.k?'selected':''}>${k}</option>`).join('')}</select></div><button class="btn" onclick="saveP()">Simpan perubahan</button> <span class="okm" role="status">${n}</span></div><div class="stats" style="margin:14px 0 0"><div class="card stat"><span class="mu sm">Progres Belajar</span><b>${pg()}%</b><div class="prog"><i style="width:${pg()}%"></i></div></div><div class="card stat"><span class="mu sm">Latihan Selesai</span><b>${st.me.s.lat}</b></div><div class="card stat"><span class="mu sm">Nilai Kuis Terakhir</span><b>${st.me.s.kuis??'-'}</b></div></div></div></div>`}});

/* ============ Ilustrasi pelajar ============ */
const STUDENT=`<div class="stu"><div class="ph" role="img" aria-label="Pelajar menggendong tas"></div>
<span class="chip fl c1">Belajar seru ✨</span><span class="chip fl b c2">Kuis seru 🏆</span><span class="chip fl c c3">Nilai naik 📈</span>
<span class="emo fl e1">📚</span><span class="emo fl b e2">💡</span><span class="emo fl c e3">✏️</span></div>`;

/* ============ Foto profil ============ */
const avatar=n=>st.me.photo?`<img class="avi" style="--s:${n}px" src="${esc(st.me.photo)}" alt="Foto profil">`:`<span class="avi" style="--s:${n}px">${esc(st.me.n[0].toUpperCase())}</span>`;
function setPhoto(inp){
  const f=inp.files[0];if(!f)return;
  const r=new FileReader();
  r.onload=()=>{const im=new Image();im.onload=()=>{
    const c=document.createElement('canvas'),n=192,z=Math.min(im.width,im.height);
    c.width=c.height=n;c.getContext('2d').drawImage(im,(im.width-z)/2,(im.height-z)/2,z,z,0,0,n,n);
    st.me.photo=c.toDataURL('image/jpeg',.85);persist();st.note='Foto profil diperbarui.';render()};im.src=r.result};
  r.readAsDataURL(f);
}
function delPhoto(){st.me.photo='';persist();render()}

/* ============ Data TKA & UTBK ============ */
// Tiap mata pelajaran: m = [judul, ringkasan, tips] ; q = [soal, pilihan, indeks jawaban benar]
const TRK={sd:'TKA SD',smp:'TKA SMP',sma:'TKA SMA',utbk:'UTBK'};
const trackOf=k=>({SD:'sd',SMP:'smp',SMA:'sma',UTBK:'utbk'})[k];
const DATA={
sd:[
 {n:'Matematika',e:'🧮',c:'#dbeafe',m:[['Bilangan','Bilangan cacah, pecahan, desimal, persen, KPK, FPB, serta operasi hitung campuran.','Perhatikan urutan operasi dan samakan penyebut saat menghitung pecahan.'],['Geometri dan Pengukuran','Bangun datar dan bangun ruang, keliling, luas, volume, besar sudut, serta pengukuran panjang, berat, waktu, dan kecepatan.','Tuliskan satuan dan rumus yang digunakan sebelum menghitung.'],['Data','Penyajian data melalui diagram batang dan diagram gambar serta pembacaan dan pengambilan informasi dari data.','Baca judul, label, dan skala diagram sebelum menarik kesimpulan.']],
  q:[['12 + 3 × 4 = …',['24','27','36','48'],0],['Pecahan yang senilai dengan 1/2 adalah …',['2/3','3/6','2/5','1/4'],1],['Luas persegi panjang 8 cm × 5 cm adalah …',['13 cm²','26 cm²','40 cm²','80 cm²'],2],['Hasil 3/4 + 1/4 adalah …',['1/2','1','4/8','3/16'],1]]},
 {n:'Bahasa Indonesia',e:'📖',c:'#e0e7ff',m:[['Teks Informasi','Memahami teks nonfiksi, artikel, atau laporan sederhana dengan menemukan informasi penting di dalam bacaan.','Cari fakta utama dan detail yang mendukungnya.'],['Teks Fiksi','Memahami cerita pendek, dongeng, atau narasi fiksi beserta tokoh, peristiwa, dan pesan yang disampaikan.','Perhatikan hubungan tokoh, peristiwa, dan latar.'],['Kompetensi yang Diuji','Menentukan ide pokok, menemukan informasi tersurat dan tersirat, menyimpulkan isi bacaan, serta memahami makna kata dan pesan dalam teks.','Gunakan bukti dari teks saat menentukan simpulan atau makna kata.']],
  q:[['Antonim kata "rajin" adalah …',['giat','malas','tekun','pandai'],1],['Penulisan kalimat yang benar adalah …',['ibu pergi ke pasar.','Ibu pergi ke Pasar.','Ibu pergi ke pasar.','ibu Pergi ke pasar'],2],['Sinonim kata "indah" adalah …',['buruk','cantik','kecil','gelap'],1],['Gagasan utama paragraf biasanya ada pada …',['kalimat utama','nomor halaman','gambar saja','sampul buku'],0]]}],
smp:[
 {n:'Matematika',e:'🧮',c:'#dbeafe',m:[['Bilangan','Bilangan real meliputi bilangan bulat, rasional, dan irasional; juga bilangan berpangkat bulat, bentuk akar, notasi ilmiah, rasio, proporsi, serta perbandingan senilai dan berbalik nilai.','Sederhanakan bentuk bilangan sebelum membandingkan hasil.'],['Aljabar','Bentuk aljabar, persamaan dan pertidaksamaan linear, fungsi, serta barisan dan deret.','Kelompokkan suku sejenis dan periksa kembali hasil substitusi.'],['Geometri dan Pengukuran','Objek geometri dan transformasi geometri serta pengukuran keliling, luas, dan volume bangun datar maupun bangun ruang.','Gambarkan bentuk dan tuliskan ukuran yang diketahui.'],['Data dan Peluang','Penyajian dan interpretasi data, mean, median, modus, serta peluang kejadian tunggal.','Urutkan data sebelum menentukan median.']],
  q:[['Nilai x dari 2x + 5 = 17 adalah …',['5','6','11','12'],1],['Sisi miring segitiga siku-siku dengan sisi 6 cm dan 8 cm adalah …',['10 cm','12 cm','14 cm','48 cm'],0],['Hasil −7 + 12 adalah …',['−19','−5','5','19'],2],['Rata-rata dari 4, 6, 8, 10 adalah …',['6','7','8','28'],1]]},
 {n:'Bahasa Indonesia',e:'📖',c:'#e0e7ff',m:[['Teks Informasi','Berisi fakta, konsep, atau prosedur yang perlu dipahami melalui informasi tersurat maupun tersirat.','Bedakan informasi utama dengan detail pendukung.'],['Teks Fiksi','Mencakup cerita faktual seperti sejarah dan biografi serta karya sastra realisme.','Perhatikan konteks peristiwa dan sudut pandang teks.'],['Kompetensi yang Diukur','Menemukan informasi tersurat dan tersirat, menentukan ide pokok dan simpulan, memahami hubungan antarkalimat dan antarparagraf, serta menilai makna dan maksud penulis.','Hubungkan informasi antarparagraf sebelum membuat simpulan.']],
  q:[['Kalimat yang efektif adalah …',['Para siswa-siswa berbaris rapi.','Siswa berbaris rapi.','Banyak para siswa berbaris.','Semua para siswa berbaris.'],1],['Bagian teks eksposisi yang memuat pendapat penulis disebut …',['tesis','orientasi','resolusi','koda'],0],['Kata baku yang benar adalah …',['apotik','apotek','aphotek','apotick'],1],['Ciri teks prosedur adalah …',['langkah berurutan','tokoh dan latar','pantun bersajak','dialog drama'],0]]}],
sma:[
 {n:'Matematika',e:'🧮',c:'#dbeafe',m:[['Bilangan','Operasi hitung, pecahan, dan bentuk akar sebagai dasar numerasi.','Sederhanakan bentuk akar dan perhatikan operasi hitung.'],['Aljabar','Persamaan, pertidaksamaan, fungsi, barisan, dan deret.','Tentukan variabel dan bentuk umum sebelum menyelesaikan.'],['Geometri & Pengukuran','Bangun datar, bangun ruang, dan trigonometri.','Buat sketsa dan gunakan perbandingan trigonometri yang sesuai.'],['Data & Peluang','Statistika serta kaidah pencacahan dan peluang.','Tentukan ruang sampel sebelum menghitung peluang.']],
  q:[['Akar-akar x² − 5x + 6 = 0 adalah …',['1 dan 6','2 dan 3','−2 dan −3','−1 dan 6'],1],['Peluang muncul angka genap pada satu dadu adalah …',['1/6','1/3','1/2','2/3'],2],['Diskriminan x² + 2x + 1 = 0 adalah …',['−4','0','4','8'],1],['sin 30° = …',['1/2','√3/2','1','√2/2'],0]]},
 {n:'Bahasa Indonesia',e:'📖',c:'#e0e7ff',m:[['Pemahaman Membaca','Menemukan ide utama, informasi tersurat dan tersirat, serta simpulan teks.','Cari gagasan yang menaungi seluruh isi teks.'],['Analisis Teks','Membedakan fakta dan opini, menilai argumen, serta mengevaluasi isi teks ilmiah, editorial, atau opini.','Periksa bukti sebelum menerima suatu argumen.'],['Kebahasaan','Memahami makna kata dalam konteks, struktur teks, serta ragam sastra seperti puisi dan prosa.','Makna kata dapat berubah sesuai konteks kalimat.']],
  q:[['Pada "Adik membaca buku", predikatnya adalah …',['Adik','membaca','buku','Adik membaca'],1],['Bukti paling kuat dalam teks argumentasi adalah …',['data dan fakta','perasaan pribadi','dugaan','gosip'],0],['Kalimat yang mengandung opini adalah …',['Air mendidih pada 100°C.','Jakarta ibu kota Indonesia.','Film itu sangat membosankan.','Bumi mengelilingi matahari.'],2],['Kalimat majemuk minimal memiliki … klausa.',['satu','dua','tiga','empat'],1]]},
 {n:'Bahasa Inggris',e:'🔤',c:'#cffafe',m:[['Reading Comprehension','Memahami teks naratif, deskriptif, prosedur, recount, dan analytical exposition setingkat B1 (intermediate).','Cari ide pokok, detail, tujuan penulis, dan informasi tersirat.'],['Kebahasaan & Kosakata','Grammar meliputi tenses, passive voice, dan conditional sentences, serta pengayaan kosakata berdasarkan konteks.','Perhatikan bentuk kata kerja dan kata penghubung dalam kalimat.']],
  q:[['She ___ to school every day.',['go','goes','going','gone'],1],['Yesterday, they ___ football.',['play','plays','played','playing'],2],['A synonym of "big" is …',['huge','tiny','narrow','weak'],0],['The main idea is usually found in the …',['topic sentence','page number','last word','footnote'],0]]}],
utbk:[
 {n:'Penalaran Umum',e:'🧠',c:'#e0f2fe',m:[['Penalaran Logis','Simpulan deduktif bergerak dari premis umum ke khusus. Jika semua A adalah B dan C adalah A, maka C adalah B.','Gambar diagram lingkaran untuk memeriksa premis.'],['Penalaran Analitik','Soal analitik meminta menyusun urutan atau pengelompokan berdasarkan syarat.','Catat syarat dalam tabel kecil, mulai dari yang paling pasti.']],
  q:[['Semua siswa rajin lulus. Budi siswa rajin. Simpulannya …',['Budi lulus','Budi tidak lulus','Budi malas','Budi guru'],0],['Pola 2, 4, 8, 16, … berikutnya adalah …',['24','30','32','64'],2],['Jika P → Q dan Q → R, maka …',['R → P','P → R','Q → P','R → Q'],1],['A di depan B, B di depan C. Yang paling belakang adalah …',['A','B','C','tidak dapat ditentukan'],2]]},
 {n:'Pengetahuan Kuantitatif',e:'➗',c:'#cffafe',m:[['Aritmetika dan Aljabar','Sederhanakan bentuk aljabar dengan menggabungkan suku sejenis. Untuk perbandingan, ubah ke bentuk paling sederhana.','Cek jawaban dengan substitusi angka kecil.'],['Persentase dan Perbandingan','Persen berarti per seratus. Kenaikan p% dari N adalah N × (1 + p/100).','Ubah persen ke desimal agar mudah dihitung.']],
  q:[['20% dari 250 adalah …',['25','40','50','60'],2],['Jika 3x = 21, maka x + 2 = …',['7','9','19','23'],1],['Perbandingan 12 : 18 paling sederhana adalah …',['2 : 3','3 : 4','4 : 5','6 : 9'],0],['Harga Rp80.000 naik 10%. Harga barunya …',['Rp82.000','Rp88.000','Rp90.000','Rp98.000'],1]]},
 {n:'Literasi Bahasa Indonesia',e:'📖',c:'#e0e7ff',m:[['Ide Pokok dan Simpulan','Ide pokok adalah gagasan utama paragraf. Simpulan merangkum isi bacaan tanpa menambah informasi baru.','Kalimat utama sering diikuti kalimat penjelas.'],['Kalimat Efektif dan Tanda Baca','Kalimat efektif jelas, hemat, dan sesuai kaidah. Koma memisahkan unsur dalam perincian.','Periksa subjek dan predikat lebih dulu.']],
  q:[['Kata baku dari "analisa" adalah …',['analisa','analisis','analis','analize'],1],['Pada "Ibu membeli apel, jeruk, dan mangga", koma berfungsi …',['memisahkan perincian','mengakhiri kalimat','menandai tanya','menandai kutipan'],0],['Simpulan bacaan yang baik …',['merangkum isi bacaan','menambah data baru','mengulang judul','menyalin paragraf'],0],['Kalimat tidak efektif adalah …',['Kita harus saling tolong-menolong satu sama lain.','Kita harus saling tolong-menolong.','Kami belajar.','Ia pergi.'],0]]},
 {n:'Literasi Bahasa Inggris',e:'🔤',c:'#ede9fe',m:[['Main Idea dan Inference','The main idea covers the whole passage. An inference is a conclusion supported by clues in the text.','Eliminate options that are too narrow or too broad.'],['Vocabulary dan Grammar','Use context clues to guess word meaning. Subject and verb must agree in number.','Look at the words near the target word.']],
  q:[['The children ___ playing in the yard.',['is','are','was','be'],1],['The opposite of "ancient" is …',['old','modern','dirty','quiet'],1],['"It was pouring, so she took an umbrella." We can infer that …',['it was raining','it was sunny','she was hungry','she was late'],0],['Choose the correct sentence.',['He don’t like tea.','He doesn’t like tea.','He not likes tea.','He no like tea.'],1]]},
 {n:'Penalaran Matematika',e:'📐',c:'#ccfbf1',m:[['Fungsi dan Grafik','Fungsi memasangkan setiap input dengan tepat satu output. Grafik fungsi linear berupa garis lurus dengan gradien m.','Titik potong sumbu-y didapat saat x = 0.'],['Peluang dan Statistika','Rata-rata = jumlah data dibagi banyak data. Median adalah nilai tengah data yang sudah diurutkan.','Urutkan data sebelum mencari median.']],
  q:[['Jika f(x) = 2x + 3, maka f(4) = …',['8','10','11','14'],2],['Median dari 3, 9, 5, 7, 1 adalah …',['3','5','7','9'],1],['Gradien garis y = 3x − 2 adalah …',['−2','2','3','−3'],2],['Dua koin dilempar. Peluang keduanya angka adalah …',['1/4','1/3','1/2','3/4'],0]]},
 {n:'Pengetahuan dan Pemahaman Umum',e:'🧠',c:'#ede9fe',m:[['Makna dan Relasi Kata','Memahami makna kata, hubungan antarkata, sinonim, antonim, dan penggunaan kata sesuai konteks.','Baca kata bersama kalimat di sekitarnya.'],['Pemahaman Informasi','Menghubungkan informasi dari kalimat atau paragraf untuk menentukan maksud dan kesimpulan.','Cari hubungan sebab-akibat dan perbandingan.']],q:[['Sinonim kata “akurat” adalah …',['tepat','lambat','rumit','jauh'],0],['Antonim kata “konkret” adalah …',['nyata','abstrak','jelas','pasti'],1],['Makna kata dalam konteks ditentukan terutama oleh …',['kalimat di sekitarnya','jumlah huruf','warna teks','nomor halaman'],0],['Hubungan “dokter : pasien” mirip dengan …',['guru : siswa','buku : meja','jalan : kendaraan','rumah : pintu'],0]]},
 {n:'Pemahaman Bacaan dan Menulis',e:'✍️',c:'#fce7f3',m:[['Pemahaman Bacaan','Menemukan informasi, ide utama, hubungan gagasan, simpulan, dan tujuan penulis dalam bacaan.','Bedakan gagasan utama dengan detail pendukung.'],['Menulis','Menilai keefektifan kalimat, kepaduan paragraf, dan penggunaan kata serta tanda baca.','Periksa hubungan antarkalimat dan kejelasan makna.']],q:[['Kalimat efektif adalah …',['Para siswa-siswa belajar.','Siswa belajar dengan tekun.','Siswa-siswa para belajar.','Banyak siswa-siswa belajar.'],1],['Gagasan utama paragraf adalah …',['ide paling penting','contoh tambahan','judul buku','nama penulis'],0],['Simpulan bacaan sebaiknya …',['sesuai isi bacaan','menambah fakta baru','mengubah topik','mengabaikan bukti'],0],['Kata baku yang benar adalah …',['aktifitas','aktivitas','aktifitaz','aktivitaz'],1]]}]
};

const EXTRA_Q={
sd:[
[
['25% dari 200 adalah …',['25','40','50','75'],2],
['KPK dari 6 dan 8 adalah …',['12','18','24','48'],2],
['FPB dari 18 dan 24 adalah …',['3','6','9','12'],1],
['2,5 + 1,75 = …',['3,25','4,25','4,5','5,25'],1],
['Volume kubus dengan sisi 4 cm adalah …',['16 cm³','32 cm³','64 cm³','80 cm³'],2],
['Data 2, 4, 4, 6 memiliki modus …',['2','4','5','6'],1]
],
[
['Ide pokok adalah …',['gagasan utama','contoh tambahan','judul buku','kalimat penutup'],0],
['Informasi tersurat berarti informasi yang …',['harus ditebak','tertulis jelas dalam teks','tidak berkaitan','berupa pendapat pembaca'],1],
['Makna kata "cerdas" yang paling dekat adalah …',['pandai','malas','lambat','lemah'],0],
['Pesan dalam cerita disebut juga …',['amanat','latar','alur','tokoh'],0],
['Kesimpulan yang baik harus …',['menambah fakta baru','merangkum isi bacaan','mengubah isi teks','mengabaikan informasi penting'],1],
['Informasi tersirat perlu …',['dihafalkan','disimpulkan dari petunjuk dalam teks','diabaikan','dicari di sampul'],1]
]
],
smp:[
[
['2³ × 2² = …',['16','32','64','128'],1],
['Perbandingan 4 : 10 setara dengan …',['2 : 5','3 : 5','4 : 5','5 : 2'],0],
['Jika 3x − 4 > 8, maka …',['x > 4','x < 4','x > 12','x < 12'],0],
['Suku berikutnya dari 3, 7, 11, 15, … adalah …',['18','19','20','21'],1],
['Median dari 2, 5, 7, 9, 10 adalah …',['5','7','8','9'],1],
['Peluang muncul bilangan ganjil pada dadu adalah …',['1/6','1/3','1/2','2/3'],2]
],
[
['Teks informasi terutama menyajikan …',['fakta atau konsep','tokoh fiksi saja','dialog drama','rima'],0],
['Biografi termasuk teks yang …',['menceritakan kehidupan tokoh','selalu berupa puisi','berisi langkah memasak','hanya berisi iklan'],0],
['Hubungan antarkalimat membantu pembaca memahami …',['keterkaitan gagasan','jumlah halaman','ukuran huruf','warna sampul'],0],
['Maksud penulis dapat diketahui dari …',['isi dan cara penyampaian teks','nama penerbit saja','nomor halaman','warna kertas'],0],
['Ide pokok paragraf disebut juga …',['gagasan utama','catatan kaki','judul buku','ilustrasi'],0],
['Makna kata berdasarkan konteks ditentukan dari …',['kalimat dan paragraf di sekitarnya','huruf pertama saja','jumlah kata','nama penulis'],0]
]
],
sma:[
[
['√49 = …',['5','6','7','8'],2],
['Jika f(x)=3x−1, maka f(5)= …',['12','14','15','16'],1],
['Barisan 2, 5, 8, 11, … memiliki suku berikutnya …',['12','13','14','15'],2],
['cos 60° = …',['0','1/2','√2/2','1'],1],
['Volume balok 5 × 4 × 3 cm adalah …',['12 cm³','20 cm³','60 cm³','80 cm³'],2],
['Peluang mengambil bola merah dari 3 merah dan 2 biru adalah …',['2/5','3/5','1/2','3/2'],1]
],
[
['Ide utama teks adalah …',['gagasan yang paling penting','contoh terkecil','judul penerbit','catatan kaki'],0],
['Pernyataan yang dapat dibuktikan dengan data disebut …',['fakta','opini','dugaan','perasaan'],0],
['"Menurut saya, buku itu sangat menarik." termasuk …',['fakta','opini','data','definisi'],1],
['Argumen yang kuat sebaiknya didukung oleh …',['bukti yang relevan','rumor','perasaan saja','tebakan'],0],
['Makna kata dalam konteks dipengaruhi oleh …',['kalimat di sekitarnya','jumlah halaman','warna buku','nama percetakan'],0],
['Puisi termasuk ragam karya …',['sastra','ilmiah','prosedural','statistik'],0]
],
[
['They ___ breakfast every morning.',['eat','eats','eating','ate'],0],
['The book ___ by Rina yesterday.',['reads','read','was read','is reading'],2],
['If I study hard, I ___ the test.',['pass','passed','would passed','passing'],0],
['The word "rapid" is closest in meaning to …',['slow','quick','weak','quiet'],1],
['A recount text mainly tells about …',['past events','future plans only','definitions','instructions'],0],
['The purpose of a procedure text is to …',['explain how to do something','describe a person only','argue an opinion','tell a fictional dream'],0]
]
],
utbk:[
[
['Jika semua A adalah B dan tidak ada B yang C, maka …',['sebagian A adalah C','tidak ada A yang C','semua C adalah A','semua B adalah A'],1],
['Urutan 5, 10, 20, 40, … adalah …',['60','70','80','100'],2],
['Jika P benar dan P → Q benar, maka …',['Q benar','Q salah','P salah','R benar'],0],
['Dina lebih tinggi dari Rani. Rani lebih tinggi dari Sari. Yang paling pendek adalah …',['Dina','Rani','Sari','tidak diketahui'],2],
['Semua X adalah Y. Sebagian Y adalah Z. Kesimpulan yang pasti adalah …',['semua X adalah Z','sebagian X pasti Z','semua X adalah Y','tidak ada X yang Y'],2],
['Dalam antrean, Budi sebelum Citra dan Citra sebelum Deni. Yang berada di antara Budi dan Deni adalah …',['Budi','Citra','Deni','tidak dapat ditentukan'],1],
['Jika A > B dan B > C, maka …',['A > C','A < C','A = C','B < C'],0],
['Pernyataan "Jika hujan maka jalan basah" setara secara logis dengan …',['Jika jalan tidak basah maka tidak hujan','Jika hujan maka jalan tidak basah','Jika jalan basah maka hujan','Jika tidak hujan maka jalan basah'],0],
['Lima buku disusun dari kiri ke kanan. Buku A harus paling kiri. Posisi A adalah …',['pertama','kedua','ketiga','kelima'],0],
['Jika semua anggota klub memakai seragam dan Andi anggota klub, maka …',['Andi memakai seragam','Andi bukan anggota','seragam tidak dipakai','Andi ketua klub'],0],
['Urutan 1, 4, 9, 16, … berikutnya adalah …',['20','24','25','36'],2]
],
[
['Jika 15% dari x = 30, maka x = …',['150','180','200','250'],2],
['Nilai 3/4 + 1/8 adalah …',['5/8','7/8','1','9/8'],1],
['Jika 2x + 7 = 19, maka x = …',['5','6','7','8'],1],
['Rasio 8 : 12 dalam bentuk paling sederhana adalah …',['1 : 2','2 : 3','3 : 4','4 : 5'],1],
['Rata-rata 6, 8, 10, 12 adalah …',['8','9','10','11'],1],
['Harga Rp120.000 didiskon 25%. Harga setelah diskon …',['Rp80.000','Rp90.000','Rp95.000','Rp100.000'],1],
['Jika 5 pekerja menyelesaikan pekerjaan dalam 12 hari, dengan kecepatan sama 10 pekerja memerlukan …',['4 hari','6 hari','8 hari','10 hari'],1],
['Bentuk 0,00045 dalam notasi ilmiah adalah …',['4,5 × 10⁻²','4,5 × 10⁻³','4,5 × 10⁻⁴','45 × 10⁻⁴'],2],
['Peluang memilih angka prima dari 1 sampai 10 adalah …',['2/10','3/10','4/10','5/10'],2],
['Median dari 4, 1, 7, 3, 9 adalah …',['3','4','7','9'],1],
['Jika x² = 49 dan x positif, maka x = …',['−7','0','7','49'],2]
],
[
['Gagasan utama sebuah paragraf adalah …',['inti pembahasan','contoh tambahan','judul penulis','catatan kaki'],0],
['Pernyataan yang didukung data dapat disebut …',['fakta','opini','spekulasi','imajinasi'],0],
['Kalimat "Kebijakan itu sebaiknya ditinjau kembali" merupakan …',['fakta','opini','data','definisi'],1],
['Simpulan harus …',['sesuai isi teks','menambah fakta baru','bertentangan dengan teks','hanya mengulang judul'],0],
['Hubungan sebab-akibat menunjukkan …',['alasan dan dampak','tokoh dan latar','judul dan penulis','rima dan bait'],0],
['Makna kata "signifikan" dalam konteks akademik paling dekat dengan …',['berarti/penting','kecil','lambat','acak'],0],
['Argumen yang baik memerlukan …',['alasan dan bukti','rumor','emosi saja','judul panjang'],0],
['Teks editorial umumnya berisi …',['pandangan terhadap suatu isu','langkah memasak','cerita dongeng','daftar belanja'],0],
['Informasi tersirat diperoleh melalui …',['inferensi dari petunjuk teks','menebak tanpa dasar','melihat sampul','menghitung halaman'],0],
['Kalimat efektif harus …',['jelas dan hemat','panjang sekali','berulang-ulang','tanpa predikat'],0],
['Dalam puisi, pilihan kata disebut …',['diksi','diagram','hipotesis','prosedur'],0]
],
[
['She ___ finished her homework.',['has','have','having','had been'],0],
['The room ___ every morning.',['cleans','is cleaned','clean','cleaning'],1],
['If I were you, I ___ earlier.',['leave','left','would leave','will left'],2],
['The main idea of a passage is its …',['central point','last punctuation','page number','title font'],0],
['"Although it was raining, they continued playing." The word although shows …',['contrast','cause','time','addition'],0],
['The closest meaning of "essential" is …',['necessary','optional','ancient','distant'],0],
['A descriptive text mainly describes …',['a person, place, or thing','a sequence of instructions','an argument only','a mathematical formula'],0],
['Passive voice focuses on …',['the receiver of an action','only the subject doing an action','the question word','the time expression'],0],
['If she had studied, she ___ the exam.',['passes','passed','would have passed','will pass'],2],
['A synonym of "accurate" is …',['correct','slow','large','empty'],0],
['The writer’s purpose can often be identified from …',['the content and language used','the page color','the font size only','the book price'],0]
],
[
['Jika f(x)=x²−2x, maka f(3)= …',['1','3','6','9'],2],
['Gradien garis y=−2x+5 adalah …',['−2','−1','2','5'],0],
['Turunan sederhana dari f(x)=x² adalah …',['x','2x','x²','2'],1],
['Median data 2, 4, 6, 8, 10 adalah …',['4','5','6','8'],2],
['Peluang mendapatkan jumlah 7 dari dua dadu adalah …',['1/12','1/9','1/6','1/3'],2],
['Jika 2a+3=11, maka a= …',['3','4','5','6'],1],
['Luas lingkaran berjari-jari 7 cm dengan π=22/7 adalah …',['44 cm²','88 cm²','154 cm²','308 cm²'],2],
['Jika barisan aritmetika memiliki suku pertama 4 dan beda 3, suku ke-5 adalah …',['13','15','16','18'],2],
['Rata-rata 5, 7, 9 adalah …',['6','7','8','9'],1],
['Jika x+y=10 dan x=4, maka y= …',['4','5','6','7'],2],
['Nilai sin 90° adalah …',['0','1/2','√3/2','1'],3] ,
[
['Makna kata “implisit” paling dekat dengan …',['tersirat','terang-terangan','tertulis tebal','terpisah'],0],
['Hubungan kata “hemat” dan “boros” adalah …',['sinonim','antonim','homonim','akronim'],1],
['Pernyataan yang paling tepat berdasarkan paragraf adalah …',['sesuai informasi teks','selalu pendapat pembaca','tidak perlu bukti','harus berupa angka'],0],
['Kata yang memiliki makna paling tepat dalam konteks disebut …',['diksi','rima','tokoh','alur'],0],
['Kesimpulan harus …',['berdasarkan informasi utama','berisi fakta baru','mengabaikan paragraf','mengubah tujuan teks'],0],
['Kalimat “Harga naik karena pasokan berkurang” menunjukkan hubungan …',['sebab-akibat','perbandingan','pertentangan','urutan waktu'],0],
['Kata “namun” biasanya menandai hubungan …',['pertentangan','penambahan','sebab','tujuan'],0],
['Ide yang mendukung gagasan utama disebut …',['gagasan pendukung','judul','sampul','catatan kaki'],0],
['Makna “efisien” adalah …',['tepat guna','boros','lambat','acak'],0],
['Informasi tersirat diperoleh melalui …',['petunjuk dalam teks','warna halaman','nama penerbit','jumlah paragraf'],0],
['Tujuan penulis dapat ditentukan dari …',['isi dan cara penyampaian','ukuran huruf','nomor halaman','warna sampul'],0]
],
[
['Kalimat yang paling padu adalah …',['Hujan turun. Oleh karena itu jalan menjadi basah.','Hujan turun. Meja belajar berwarna cokelat.','Hujan turun. Buku itu tebal.','Hujan turun. Pensil itu tajam.'],0],
['Kata penghubung yang tepat untuk menunjukkan sebab adalah …',['karena','tetapi','atau','sedangkan'],0],
['Kalimat yang tidak efektif adalah …',['Ia pergi ke sekolah.','Para siswa-siswa mengikuti upacara.','Mereka membaca buku.','Kami belajar bersama.'],1],
['Paragraf yang baik memiliki …',['kesatuan dan kepaduan','banyak judul','kalimat acak','topik berbeda-beda'],0],
['Ejaan yang tepat adalah …',['di rumah','dirumah','diRumah','di-rumah'],0],
['Kalimat utama biasanya memuat …',['gagasan utama','contoh kecil','catatan kaki','daftar pustaka'],0],
['Kata “sehingga” menunjukkan hubungan …',['akibat','pilihan','pertentangan','penambahan'],0],
['Tanda baca yang tepat untuk akhir kalimat berita adalah …',['titik','koma','titik dua','tanda hubung'],0],
['Kalimat yang paling jelas adalah …',['Siswa itu membaca buku di perpustakaan.','Buku siswa itu membaca perpustakaan.','Di membaca siswa itu buku.','Perpustakaan buku membaca siswa.'],0],
['Pernyataan pendukung harus …',['berkaitan dengan gagasan utama','mengubah topik','tidak relevan','tanpa hubungan'],0],
['Tujuan utama revisi tulisan adalah …',['memperjelas dan memperbaiki tulisan','menambah kata acak','menghapus semua kalimat','mengubah semua topik'],0]
]
]
]};

// Tambahkan soal tambahan agar batas paket dapat benar-benar mencapai:
// TKA = 5 soal Gratis / 10 soal Premium, UTBK = 5 soal Gratis / 15 soal Premium.
['sd','smp','sma','utbk'].forEach(t=>{
  DATA[t].forEach((subject,i)=>{
    const add=(EXTRA_Q[t]&&EXTRA_Q[t][i])||[];
    add.forEach(q=>subject.q.push(q));
  });
});

const _bc={};
function build(tid){
  if(_bc[tid])return _bc[tid];
  const S=[],M=[];
  DATA[tid].forEach((x,si)=>{
    S.push({n:x.n,e:x.e,c:x.c,m:x.m.length,q:x.q});
    x.m.forEach((m,j)=>M.push({t:m[0],r:m[1],tip:m[2],s:si,k:TRK[tid],e:x.e,p:j>0}));   // materi ke-2 = Premium
  });
  return _bc[tid]={S,M};
}
function useTrack(){const b=build(st.track);S=b.S;M=b.M}
const trackBar=()=>`<div class="tb" role="tablist" aria-label="Jenjang dan ujian">${[['sd','🎒 TKA SD'],['smp','📘 TKA SMP'],['sma','🎓 TKA SMA'],['utbk','🚀 UTBK SMA']].map(t=>`<button role="tab" aria-selected="${st.track===t[0]}" class="${st.track===t[0]?'on':''}" onclick="setTrack('${t[0]}')">${t[1]}</button>`).join('')}</div>`;
function setTrack(t){st.track=t;st.sub=-1;st.q='';go(st.v==='detail'?'materi':st.v)}
st.track='smp';

/* ============ Maskot Rio (dipakai di semua halaman) ============ */
const head=(t,sub,msg)=>`<div class="pgh"><div><h1>${t}</h1><p class="mu" style="margin:0">${sub}</p></div><div class="mr"><div class="say">${msg}</div><span class="face" style="--s:88px"></span></div></div>${['materi','rangkuman','latihan','kuis'].includes(st.v)?trackBar():''}`;
const TIPS={
  intro:['Halo! Aku Rio, teman belajarmu 👋','Yuk daftar dan mulai belajar! 🚀'],
  auth:['Belum punya akun? Daftar dulu, gratis kok! ✨','Ayo masuk, materi seru menunggumu!'],
  home:['Pilih mata pelajaran favoritmu! 🎨','Buka satu materi baru hari ini 📚'],
  materi:['Klik "Pelajari" untuk mulai 📖','Cari materi lewat kolom pencarian 🔍'],
  detail:['Baca ringkasannya pelan-pelan ya 😊','Habis ini, coba latihan soalnya! 💪'],
  rangkuman:['Rangkuman pas untuk mengulang cepat ⚡','Baca sebelum ujian biar makin pede!'],
  latihan:['Salah itu wajar, terus mencoba ya 💙','Kerjakan pelan-pelan, kamu pasti bisa!'],
  kuis:['Fokus! Waktu terus berjalan ⏱️','Jawab yang paling kamu yakini dulu 😉'],
  dash:['Cek misi harianmu di bawah 🎯','Hebat, pertahankan semangatmu! 🔥'],
  profil:['Isi kelasmu supaya materi pas 😊','Datamu tersimpan di perangkat ini 🔒']
};
function mascot(){
  const el=$('#mc');
  if(st.plansOpen||st.premErr||needPlan()){el.innerHTML='';return}
  const a=TIPS[st.v]||TIPS.home;
  el.innerHTML=(st.toast?`<div class="toast" role="status">${st.toast}</div>`:'')+`<button id="mascot" onclick="st.tip=(st.tip||0)+1;mascot()" aria-label="Tips dari Rio"><span class="say">${a[(st.tip||0)%a.length]}</span><span class="face" style="--s:60px"></span></button>`;
}

/* ============ Elemen ceria ============ */
const greet=()=>`<div class="greet"><span>👋 Halo, ${esc(st.me.n)}! Siap belajar hari ini?</span><span class="tag pro-b">🔥 Semangat!</span></div>`;
const confetti=()=>`<div class="cf" aria-hidden="true">${Array.from({length:16},(_,i)=>`<i style="left:${i*6+2}%;animation-delay:${(i%6)*.22}s">${['🎉','⭐','✨','🎈'][i%4]}</i>`).join('')}</div>`;
const mission=()=>{
  const s=st.me.s,L=[['Buka 1 materi',s.seen.length>0],['Selesaikan 1 latihan',s.lat>0],['Ikuti 1 kuis',s.kuis!=null]];
  return `<div class="card" style="margin-top:14px"><h3>🎯 Misi Hari Ini</h3>${L.map(m=>`<div class="mi ${m[1]?'done':''}">${m[1]?'✅':'⬜'} ${m[0]}</div>`).join('')}<p class="sm mu" style="margin:8px 0 0">Selesaikan semua misi untuk jadi juara belajar! 🏆</p></div>`;
};

/* ============ Paket Gratis & Premium ============ */
const PF=[[1,'Semua materi dan rangkuman'],[1,'10 soal TKA / 15 soal UTBK per latihan & kuis'],[1,'Dashboard progres'],[1,'Analisis kemampuan per mata pelajaran']];
const PLANS=[
  {id:'gratis',n:'Gratis',price:'Rp 0',f:[[1,'1 materi dasar tiap mata pelajaran'],[1,'5 soal TKA / 5 soal UTBK'],[1,'Dashboard progres'],[0,'Materi dan rangkuman Premium'],[0,'Analisis kemampuan']]},
  {id:'trial',n:'Trial 7 Hari',price:'Gratis 7 hari',f:PF},
  {id:'premium',n:'Premium',price:'Rp 29.000 / bulan',f:PF}
];
st.plansOpen=false;st.premErr=false;st.picked=false;st.planMsg='';

const isPro=()=>!!st.me&&st.me.plan==='premium'&&(st.me.trialEnd||0)>Date.now();
const planName=()=>isPro()?`Premium • ${Math.ceil((st.me.trialEnd-Date.now())/864e5)} hari`:'Gratis';
const needPlan=()=>!!st.me&&!st.picked;   // popup wajib tiap login/daftar
const locked=m=>!!m.p&&!isPro();
const badge=m=>m.p?' <span class="tag pro-b">Premium</span>':'';
const setQ=()=>{
  useTrack();
  const b=S[Math.max(st.sub,0)]||S[0];
  const extra=(EXTRA_Q[st.track]&&EXTRA_Q[st.track][Math.max(st.sub,0)])||[];
  QALL=b.q.concat(extra).map(x=>({q:x[0],o:x[1],a:x[2]}));
  const limit=st.track==='utbk'?(isPro()?15:5):(isPro()?10:5);
  Q=QALL.slice(0,limit);
};
const upsell=t=>isPro()?'':`<p class="sm mu">${t} <button class="crumb" style="margin:0" onclick="openPlans()">Upgrade ke Premium</button></p>`;

function analysis(){
  const body=isPro()
    ?S.map((x,i)=>{const v=i===0?(st.me.s.kuis||0):0;return `<div style="margin-top:8px"><span class="sm">${x.n}: ${v?v+'%':'belum ada data'}</span><div class="prog"><i style="width:${v}%"></i></div></div>`}).join('')
    :'<p class="mu">Lihat kekuatan dan kelemahanmu di setiap mata pelajaran.</p><button class="btn" onclick="openPlans()">Upgrade ke Premium</button>';
  return `<div class="card" style="margin-top:14px"><h3>Analisis Kemampuan${isPro()?'':' <span class="tag pro-b">Premium</span>'}</h3>${body}</div>`;
}
function openMat(i){if(locked(M[i]))return openPlans('Materi ini khusus paket Premium.');see(i);go('detail',{mat:i})}
function openPlans(msg){st.plansOpen=true;st.planMsg=msg||'';render()}
function closePlans(){if(st.premErr){st.premErr=false;render();return}if(needPlan())return;st.plansOpen=false;st.planMsg='';render()}
function persist(){
  const i=users.findIndex(x=>x.e===st.me.e);
  if(i>-1){users[i]={...users[i],...st.me};LS.set('es_users',users)}
}
function see(i){const k=st.track+':'+i,a=st.me.s.seen,j=a.indexOf(k);if(j>-1)a.splice(j,1);a.push(k);persist()}
const seenKeys=()=>st.me.s.seen.filter(k=>typeof k==='string');
const ref=k=>{const [t,i]=k.split(':'),b=build(t);return {m:b.M[+i],S:b.S}};
function resume(k){const [t,i]=k.split(':');st.track=t;useTrack();openMat(+i)}
function finishKuis(){
  const K=st.ku,c=K.ans.filter((a,i)=>a===Q[i].a).length;
  K.over=true;st.me.s.kuis=Math.round(c/Q.length*100);persist();render();
}
const pg=()=>Math.round(seenKeys().filter(k=>k.startsWith(st.track+':')).length/M.length*100);
function current(){
  const a=seenKeys();
  if(!a.length)return `<p class="mu">Belum ada materi yang dibuka.</p><button class="btn" onclick="go('materi')">Pilih Materi</button>`;
  const k=a[a.length-1],r=ref(k),m=r.m;
  return `<div class="item" style="margin:12px 0">${ic(m.e,r.S[m.s].c)}<div><b>${m.t}</b><p class="mu sm">${r.S[m.s].n} • ${m.k}</p></div></div><button class="btn" onclick="resume('${k}')">Lanjutkan</button>`;
}
function history(){
  const a=seenKeys().slice(-3).reverse();
  return a.length?a.map(k=>`<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--bd)"><span>${ref(k).m.t}</span><span class="tag">Dibuka</span></div>`).join(''):'<p class="mu">Belum ada aktivitas belajar.</p>';
}
function choosePlan(id){
  if(id==='premium'){st.premErr=true;render();return}
  if(id==='trial'){if(st.me.trialUsed)return;st.me.plan='premium';st.me.trialUsed=true;st.me.trialEnd=Date.now()+7*864e5}
  else{st.me.plan='gratis';st.me.trialEnd=0}
  st.picked=true;persist();
  st.toast=id==='trial'?'🎉 Trial Premium 7 hari aktif! Semua materi terbuka.':'Paket Gratis aktif. Selamat belajar!';
  setTimeout(()=>{st.toast='';mascot()},3600);st.plansOpen=false;st.planMsg='';
  go(st.v==='auth'||st.v==='intro'?'home':st.v);
}
function modal(){
  const el=$('#md');
  if(!(st.plansOpen||needPlan()||st.premErr)){el.innerHTML='';return}
  if(st.premErr){
    el.innerHTML=`<div class="md" onclick="if(event.target===this)closePlans()"><div class="dlg" role="alertdialog" aria-modal="true" aria-labelledby="et" style="max-width:420px;text-align:center"><div style="font-size:44px" aria-hidden="true">⚠️</div><h2 id="et" style="margin:8px 0">Error</h2><p class="mu">Seri Premium masih dalam tahap pengembangan.</p><button class="btn w" onclick="closePlans()">Kembali</button></div></div>`;
    el.querySelector('button').focus();return;
  }
  const must=needPlan(),cur=isPro()?'trial':st.me.plan;
  const cards=PLANS.map(p=>{const tr=p.id==='trial',off=tr&&st.me.trialUsed;return `<div class="plan ${p.id==='premium'?'pro':''} ${tr?'tr':''}">${tr?'<span class="rib">🎁 Coba dulu, gratis!</span>':''}<h3>${p.n}${cur===p.id?' (paket saat ini)':''}</h3><div class="price">${p.price}</div><ul>${p.f.map(f=>`<li class="${f[0]?'':'no'}">${f[0]?'✓':'✕'} ${f[1]}</li>`).join('')}</ul><button class="btn ${p.id==='gratis'?'s':''} w" ${off?'disabled':''} onclick="choosePlan('${p.id}')">${tr?(off?'Trial sudah dipakai':'Mulai Trial 7 Hari'):'Pilih '+p.n}</button></div>`}).join('');
  const msg=st.planMsg||(must?'Mulai dengan Gratis atau buka semua fitur dengan Premium. Paket bisa diubah kapan saja di halaman Profil.':'Pilih paket yang sesuai dengan kebutuhan belajarmu.');
  el.innerHTML=`<div class="md" onclick="if(event.target===this)closePlans()"><div class="dlg" role="dialog" aria-modal="true" aria-labelledby="pt"><h2 id="pt" style="margin:0 0 4px">${must?'Pilih paket belajarmu':'Paket EduSpace'}</h2><p class="mu" style="margin:0">${esc(msg)}</p>${must?'':'<button class="x" onclick="closePlans()" aria-label="Tutup">×</button>'}<div class="plans">${cards}</div><p class="sm mu" style="margin:0">Langganan Premium berbayar belum tersedia. Coba Trial 7 Hari atau pakai paket Gratis.</p></div></div>`;
  el.querySelector('button.btn').focus();
}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closePlans()});

function pick(j){st.lat.pick=j;if(j===Q[st.lat.i].a)st.lat.sc++;render()}
function nextL(){if(st.lat.i===Q.length-1){st.lat.done=true;st.me.s.lat++;persist()}else{st.lat.i++;st.lat.pick=null}render()}
function render0(){const on=({detail:'materi',rsum:'rangkuman'})[st.v]||st.v;$('#nav').innerHTML=navs.map(n=>`<button class="${n[0]===on?'on':''}" onclick="go('${n[0]}')">${n[1]}</button>`).join('');$('#app').innerHTML=V[st.v]();if(st.v==='home'){$('#hq').onkeydown=e=>{if(e.key==='Enter'){st.q=e.target.value;go('cari')}}}}
/* ============ PATCH v2 ============ */
const LOCK=(s=72,st)=>`<div class="lock ${st?'st':''}"><svg class="lgi" style="width:${s}px;height:${s}px" viewBox="0 0 120 120" role="img" aria-label="Logo EduSpace"><use href="#lg"/></svg><div><b class="wm">EduSpace</b><span class="tg">Satu Tempat, Semua Jenjang</span></div></div>`;
const lsOK=(()=>{try{localStorage.setItem('_t','1');localStorage.removeItem('_t');return true}catch(e){return false}})();
const hit=m=>(m.t+' '+m.r+' '+S[m.s].n).toLowerCase().includes((st.q||'').toLowerCase());
TIPS.rsum=TIPS.rangkuman;TIPS.cari=['Ketik kata kunci lalu tekan Enter 🔍'];

/* ---- Pencarian lintas jenjang ---- */
function openHit(t,i){st.track=t;useTrack();openMat(i)}
Object.assign(V,{cari(){const q=(st.q||'').toLowerCase().trim(),out=[];
if(q)['sd','smp','sma','utbk'].forEach(t=>{const b=build(t);b.M.forEach((m,i)=>{const h=(m.t+' '+m.r+' '+m.tip+' '+b.S[m.s].n).toLowerCase();if(q.split(/\s+/).every(w=>h.includes(w)))out.push([t,i,m,b.S])})});
return `${head('Hasil Pencarian','Kata kunci: “'+esc(st.q||'')+'” — '+out.length+' materi ditemukan','Coba kata kunci lain kalau belum ketemu 🔍')}<div class="grid g2">${out.map(([t,i,m,SS])=>`<div class="card item">${ic(m.e,SS[m.s].c)}<div><h3>${m.t}${badge(m)}</h3><p class="mu sm">${SS[m.s].n} • ${TRK[t]}</p><button class="btn s" onclick="openHit('${t}',${i})">Pelajari</button></div></div>`).join('')||'<p class="mu">Tidak ada materi yang cocok. Coba kata kunci lain.</p>'}</div>`}});

/* ---- Pembuat soal sulit (multi-langkah, kunci dihitung otomatis) ---- */
function mulb(s){let a=0;for(const c of s)a=(a*31+c.charCodeAt(0))|0;return()=>{a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const gcd=(a,b)=>b?gcd(b,a%b):a,fr=(n,d)=>{const g=gcd(n,d);n/=g;d/=g;return d===1?''+n:n+'/'+d};
const RP=n=>'Rp'+n.toLocaleString('id-ID'),DC=v=>(Math.round(v*100)/100).toString().replace('.',',');
function mk(t,ri,r){let q,c,w,e;switch(t){
case 0:{const x=ri(2,9),y=ri(2,9),p=ri(2,4),s=ri(2,4);q=`Diketahui ${p}x + ${s}y = ${p*x+s*y} dan x − y = ${x-y}. Nilai x · y adalah …`;c=x*y;w=[x+y,x*y+x,x*y-y];e=`Dari x − y = ${x-y} diperoleh x = y + (${x-y}). Substitusi: ${p}(y + (${x-y})) + ${s}y = ${p*x+s*y} → ${p+s}y = ${p*x+s*y-p*(x-y)} → y = ${y}, x = ${x}. Jadi x · y = ${c}.`;break}
case 1:{const p=ri(1,8),s=ri(p+1,9);q=`Akar-akar persamaan x² − ${p+s}x + ${p*s} = 0 adalah x₁ dan x₂. Nilai x₁² + x₂² adalah …`;c=p*p+s*s;w=[(p+s)**2,p*s,p+s];e=`x₁ + x₂ = ${p+s} dan x₁x₂ = ${p*s}. x₁² + x₂² = (x₁ + x₂)² − 2x₁x₂ = ${(p+s)**2} − ${2*p*s} = ${c}.`;break}
case 2:{const P=ri(5,20)*10000,a=[10,20,30,40][ri(0,3)],b=[10,20,25][ri(0,2)];c=RP(P*(100+a)*(100-b)/10000);w=[RP(P*(100+a-b)/100),RP(P*(100-b)/100),RP(P*(100+a)/100)];q=`Harga sebuah barang ${RP(P)} dinaikkan ${a}%, kemudian didiskon ${b}%. Harga akhir barang adalah …`;e=`Harga akhir = ${RP(P)} × ${(100+a)/100} × ${(100-b)/100} = ${c}. Kenaikan dan diskon tidak boleh dijumlahkan langsung karena basis persentasenya berbeda.`;break}
case 3:{const a=ri(2,9),d=ri(2,6);q=`Pada barisan aritmetika, suku ke-3 adalah ${a+2*d} dan suku ke-7 adalah ${a+6*d}. Jumlah 10 suku pertama adalah …`;c=5*(2*a+9*d);w=[a+9*d,10*(a+9*d),c+d];e=`Beda = (${a+6*d} − ${a+2*d})/4 = ${d}; suku pertama a = ${a+2*d} − 2(${d}) = ${a}. S₁₀ = 10/2 × (2·${a} + 9·${d}) = ${c}.`;break}
case 4:{const m=ri(3,6),b=ri(2,5),n=m+b;c=fr(m*(m-1),n*(n-1));w=[fr(m*m,n*n),fr(m,n),fr(m-1,n),fr(2*m,n*(n-1))];q=`Sebuah kotak berisi ${m} bola merah dan ${b} bola putih. Dua bola diambil satu per satu tanpa pengembalian. Peluang keduanya merah adalah …`;e=`P = ${m}/${n} × ${m-1}/${n-1} = ${c}. Tanpa pengembalian, jumlah bola berkurang pada pengambilan kedua.`;break}
case 5:{const n=ri(6,9),m=ri(60,80),x=ri(85,95),y=ri(90,100),v=(n*m+x+y)/(n+2);q=`Rata-rata nilai ${n} siswa adalah ${m}. Setelah dua siswa baru bernilai ${x} dan ${y} bergabung, rata-rata seluruh siswa menjadi …`;c=DC(v);w=[DC((m+x+y)/3),DC((m+(x+y)/2)/2),DC(v+1.5)];e=`Jumlah awal = ${n}×${m} = ${n*m}; jumlah baru = ${n*m+x+y}. Rata-rata = ${n*m+x+y}/${n+2} = ${c}.`;break}
case 6:{const B=[[12,6,4],[10,15,30],[20,30,60],[6,12,12],[8,24,12]],i=ri(0,4),k=ri(1,3),[a,b,d]=B[i].map(z=>z*k),days=[2,5,10,3,4][i]*k;q=`Pekerja A, B, dan C masing-masing dapat menyelesaikan suatu pekerjaan sendirian dalam ${a}, ${b}, dan ${d} hari. Jika ketiganya bekerja bersama, pekerjaan selesai dalam … hari.`;c=days;w=[days+1,days*2,Math.round((a+b+d)/3)];e=`Kecepatan gabungan = 1/${a} + 1/${b} + 1/${d} = 1/${days} pekerjaan per hari, sehingga selesai dalam ${days} hari.`;break}
case 7:{const va=ri(4,8)*10,vb=ri(4,8)*10,t2=ri(2,4),D=va+(va+vb)*t2,f=h=>String(h).padStart(2,'0')+'.00';q=`Kota A dan B berjarak ${D} km. Budi berangkat dari A pukul 06.00 dengan kecepatan ${va} km/jam menuju B. Satu jam kemudian Cici berangkat dari B menuju A dengan kecepatan ${vb} km/jam. Mereka berpapasan pukul …`;c=f(7+t2);w=[f(6+t2),f(8+t2),f(9+t2)];e=`Pukul 07.00 Budi sudah menempuh ${va} km, sisa jarak ${D-va} km. Kecepatan gabungan ${va+vb} km/jam → ${t2} jam. Berpapasan pukul 07.00 + ${t2} jam = ${c}.`;break}
case 8:{const a=ri(4,9),b=ri(2,5),k=ri(1,2),x=a+2*b-3*k;q=`Nilai dari 2^${a} × 4^${b} ÷ 8^${k} adalah …`;c=2**x;w=[2**(x+1),2**(x-1),2**(a+b-k)];e=`Samakan basis 2: 2^${a} × 2^${2*b} ÷ 2^${3*k} = 2^(${a}+${2*b}−${3*k}) = 2^${x} = ${c}.`;break}
case 9:{const T=[[3,4,5],[5,12,13],[8,15,17],[7,24,25]][ri(0,3)],k=ri(2,4),[p,s,h]=T.map(z=>z*k);q=`Sebuah persegi panjang memiliki diagonal ${h} cm dan lebar ${p} cm. Kelilingnya adalah … cm.`;c=2*(p+s);w=[p*s,2*(h+p),p+s];e=`Panjang = √(${h}² − ${p}²) = ${s} cm. Keliling = 2(${s} + ${p}) = ${c} cm.`;break}
case 10:{const a=ri(3,7),b=ri(2,4),k=ri(2,3);q=`Nilai dari ²log ${2**a} + ³log ${3**b} − ⁵log ${5**k} adalah …`;c=a+b-k;w=[a+b+k,a-b+k,a*b-k];e=`²log 2^${a} = ${a}; ³log 3^${b} = ${b}; ⁵log 5^${k} = ${k}. Hasil = ${a} + ${b} − ${k} = ${c}.`;break}
default:{const a=ri(2,6),b=ri(-5,8);q=`Fungsi linear f memenuhi f(2) = ${2*a+b} dan f(5) = ${5*a+b}. Nilai f(10) adalah …`;c=10*a+b;w=[10*a+2,a+b,10*a-b+1];e=`Gradien = (${5*a+b} − ${2*a+b})/3 = ${a}, sehingga f(x) = ${a}x + (${b}). f(10) = ${c}.`}}
const u=[];[c,...w].forEach(v=>{v=String(v);if(!u.includes(v))u.push(v)});let d=1;while(u.length<4&&isFinite(Number(c))){const v=String(Number(c)+d);if(!u.includes(v))u.push(v);d=d>0?-d:1-d}
const o=u.slice(0,4);for(let i=o.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[o[i],o[j]]=[o[j],o[i]]}
return {q,o,a:o.indexOf(String(c)),e}}
function G(tr,key,n){const r=mulb(tr+key),ri=(a,b)=>a+Math.floor(r()*(b-a+1)),T={sd:[5,7,9,6],smp:[0,2,3,5,6,7,8,9,11],sma:[0,1,2,3,4,5,6,7,8,9,10,11],utbk:[0,1,2,3,4,5,6,7,8,9,10,11]}[tr];return Array.from({length:n},(_,k)=>mk(T[k%T.length],ri,r))}
const LOGIC=[
{q:'Semua dokter adalah sarjana. Sebagian sarjana adalah pengusaha. Tidak ada pengusaha yang menjadi pegawai negeri. Simpulan yang PASTI benar adalah …',o:['Sebagian dokter adalah pengusaha','Sebagian sarjana bukan pegawai negeri','Semua dokter bukan pegawai negeri','Tidak ada dokter yang pengusaha'],a:1,e:'Sebagian sarjana adalah pengusaha, dan pengusaha bukan pegawai negeri, maka sebagian sarjana pasti bukan pegawai negeri. Hubungan dokter–pengusaha tidak dapat dipastikan.'},
{q:'Jika P maka Q. Jika R maka bukan Q. Diketahui P benar. Simpulan yang valid adalah …',o:['R benar','R salah','Q salah','P salah'],a:1,e:'P benar → Q benar. Kontraposisi R → ¬Q adalah Q → ¬R, sehingga R salah.'},
{q:'Lima orang A, B, C, D, E duduk berjajar. A tepat di kiri B. C tidak di ujung. D di ujung kanan. E tidak di ujung dan tidak di sebelah B. Siapa yang duduk di tengah?',o:['A','B','C','E'],a:2,e:'D di posisi 5. Pasangan AB hanya muat di posisi 1–2 (jika di 2–3 C tidak punya tempat; jika di 3–4, E harus di ujung kiri). Maka urutannya A, B, C, E, D; yang di tengah adalah C.'},
{q:'Pernyataan “Semua mahasiswa lulus ujian” tidak benar. Maka …',o:['Tidak ada mahasiswa yang lulus','Ada mahasiswa yang tidak lulus','Semua mahasiswa tidak lulus','Ada mahasiswa yang lulus'],a:1,e:'Negasi “semua” adalah “ada yang tidak”. Tidak berarti tidak ada yang lulus.'},
{q:'Barisan 2, 3, 5, 9, 17, … memiliki suku berikutnya …',o:['25','31','33','35'],a:2,e:'Selisih berurutan 1, 2, 4, 8, sehingga selisih berikutnya 16: 17 + 16 = 33.'},
{q:'Di suatu kelas, 60% siswa menyukai matematika, 50% menyukai fisika, dan 20% tidak menyukai keduanya. Persentase siswa yang menyukai keduanya adalah …',o:['10%','20%','30%','40%'],a:2,e:'Yang menyukai minimal salah satu = 80%. 60 + 50 − x = 80 → x = 30%.'}];

/* ---- Mesin Latihan & Kuis ---- */
const lim=()=>st.track==='utbk'?(isPro()?15:5):(isPro()?10:5),_pc={};
function pool(si){const k=st.track+si;if(_pc[k])return _pc[k];const sb=DATA[st.track][si],isM=/Matematika|Kuantitatif/.test(sb.n);
const old=sb.q.map(x=>({q:x[0],o:x[1],a:x[2],e:'Jawaban yang benar adalah “'+x[1][x[2]]+'”. Tinjau kembali konsep pada materi terkait.'}));
return _pc[k]=isM?G(st.track,sb.n,40):(sb.n==='Penalaran Umum'&&st.track==='utbk'?LOGIC.concat(old):old)}
function startRun(v){useTrack();clearInterval(st.tm);const L=lim();let qs=[];
if(v==='latihan'){qs=pool(Math.max(st.sub,0)).slice(0,L)}
else{const ps=S.map((_,i)=>pool(i).slice().reverse());let j=0;while(qs.length<L&&ps.some(p=>p[j])){ps.forEach((p,i)=>{if(p[j]&&qs.length<L)qs.push({...p[j],s:i})});j++}}
st.hint=false;st.R={m:v,qs,i:0,ans:[],t:L*90,over:false};if(v==='kuis')st.tm=setInterval(tickR,1000)}
function tickR(){const R=st.R;if(!R||R.over||st.v!=='kuis')return clearInterval(st.tm);R.t--;if(R.t<=0)return finishR();const e=$('#tm');if(e)e.textContent=fmt(R.t)}
function finishR(){const R=st.R;clearInterval(st.tm);R.over=true;R.c=R.ans.filter((a,i)=>a===R.qs[i].a).length;if(R.m==='kuis')st.me.s.kuis=Math.round(R.c/R.qs.length*100);else st.me.s.lat++;persist();render()}
function rans(j){st.R.ans[st.R.i]=j;render()}
function rgo(i){st.R.i=i;st.hint=false;render()}
function go(v,x={}){if(!st.me&&v!=='intro'&&v!=='auth')v='auth';st.err='';st.tip=0;clearInterval(st.tm);Object.assign(st,x);st.v=v;if((v==='latihan'||v==='kuis')&&!x.keep)startRun(v);render();scrollTo(0,0)}
function setTrack(t){st.track=t;st.sub=-1;st.q='';go(['detail','rsum'].includes(st.v)?'materi':st.v)}
function subSel(i){st.sub=i;if(st.v==='latihan')startRun('latihan');render()}
function sideSubj(){const L=st.v==='latihan';return `<div class="side">${L?'':`<button class="${st.sub<0?'on':''}" onclick="st.sub=-1;render()">Semua Mata Pelajaran</button>`}${S.map((s,i)=>`<button class="${st.sub===i||(L&&st.sub<0&&i===0)?'on':''}" onclick="subSel(${i})">${s.e} ${s.n}</button>`).join('')}</div>`}
function runV(){const R=st.R,q=R.qs[R.i],K=R.m==='kuis',n=R.qs.length,si=K?q.s:Math.max(st.sub,0),hint=(M.find(m=>m.s===si)||M[0]).tip,done=R.ans.filter(a=>a!==undefined).length;
return `${head(K?'Kuis':'Latihan Soal',K?'Simulasi ujian: soal campuran semua mata pelajaran, dibatasi waktu.':'Latihan per mata pelajaran, tanpa batas waktu.',K?'Fokus! Waktu terus berjalan ⏱️':'Santai, boleh pindah-pindah soal 🤗')}<div class="layout ${K?'l2':'l3'}">${K?'':sideSubj()}<div class="card"><div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap"><span class="tag">${S[si].n} • ${TRK[st.track]}</span>${K?`<b>⏱ <span id="tm">${fmt(R.t)}</span></b>`:`<span class="sm mu">Soal ${R.i+1} dari ${n}</span>`}</div><div class="prog" style="margin:10px 0"><i style="width:${(R.i+1)/n*100}%"></i></div><h3 style="font-size:17px;margin:14px 0">${R.i+1}. ${q.q}</h3>${q.o.map((o,j)=>`<button class="opt ${R.ans[R.i]===j?'sel':''}" onclick="rans(${j})"><b>${'ABCD'[j]}.</b> ${o}</button>`).join('')}${!K&&st.hint?`<div class="keypoints">💡 Petunjuk: ${esc(hint)}</div>`:''}<div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-top:12px"><button class="btn s" ${R.i?'':'disabled'} onclick="rgo(${R.i-1})">‹ Sebelumnya</button>${K?'':`<button class="btn s" onclick="st.hint=!st.hint;render()">💡 Petunjuk</button>`}${R.i===n-1?`<button class="btn" onclick="finishR()">${K?'Kumpulkan':'Selesai'}</button>`:`<button class="btn" onclick="rgo(${R.i+1})">Berikutnya ›</button>`}</div></div><div class="card"><h3>Nomor Soal</h3><div class="num">${R.qs.map((_,i)=>`<button class="${i===R.i?'cur':R.ans[i]!==undefined?'done':''}" onclick="rgo(${i})">${i+1}</button>`).join('')}</div><p class="sm mu" style="margin-top:12px">${done} dari ${n} terjawab</p>${K?'':`<button class="btn w" style="margin-top:8px" onclick="finishR()">Selesai &amp; lihat hasil</button>`}</div></div>`}
function resV(){const R=st.R,n=R.qs.length,c=R.c,K=R.m==='kuis',pro=isPro();
return `<div class="card" style="max-width:760px;margin:auto">${confetti()}<div style="text-align:center"><div class="pop" style="font-size:56px">${K?'🏅':'🎉'}</div><h2>${K?'Hasil Kuis':'Latihan selesai'}</h2><div class="score">${K?Math.round(c/n*100)+'/100':c+'/'+n}</div><p class="mu">${c} dari ${n} soal benar</p></div><h2>Pembahasan</h2><p class="sm mu">${pro?'Premium: semua pembahasan terbuka.':'Paket Gratis: 2 pembahasan terbuka. Premium: semua pembahasan.'}</p>${R.qs.map((q,i)=>{const a=R.ans[i],ok=a===q.a,open=pro||i<2;return `<div class="card" style="margin-bottom:10px"><div class="rv-h"><b>${i+1}. ${q.q}</b><span class="tag ${a===undefined?'st-nil':ok?'st-ok':'st-no'}">${a===undefined?'Kosong':ok?'Benar':'Salah'}</span></div>${open?`<p class="sm" style="margin:8px 0 2px">Jawabanmu: ${a===undefined?'-':'ABCD'[a]+'. '+q.o[a]} • Kunci: <b>${'ABCD'[q.a]}. ${q.o[q.a]}</b></p><p class="sm mu" style="margin:0">${q.e}</p>`:`<button class="btn s" style="margin-top:8px" onclick="openPlans('Pembahasan lengkap khusus Premium.')">🔒 Pembahasan — Premium</button>`}</div>`}).join('')}${upsell('Buka semua pembahasan dan lebih banyak soal dengan Premium.')}<button class="btn w" style="margin-top:8px" onclick="go('${R.m}')">Ulangi ${K?'Kuis':'Latihan'}</button><button class="btn s w" style="margin-top:8px" onclick="go('home')">Kembali ke Beranda</button></div>`}
Object.assign(V,{latihan(){if(!st.R||st.R.m!=='latihan')startRun('latihan');return st.R.over?resV():runV()},kuis(){if(!st.R||st.R.m!=='kuis')startRun('kuis');return st.R.over?resV():runV()}});

/* ---- Materi lengkap (rangkuman dibuat dari poin kunci tiap bab) ---- */
const mkey=m=>st.track+'|'+S[m.s].n+'|'+m.t;
const MAT={
'smp|Matematika|Aljabar':[
['Bentuk Aljabar dan Sukunya','Variabel (misal x) adalah lambang pengganti bilangan. Koefisien adalah angka di depan variabel, konstanta adalah suku tanpa variabel, dan suku sejenis memiliki variabel serta pangkat yang sama. Penjumlahan dan pengurangan hanya boleh pada suku sejenis: 3x + 5x = 8x, tetapi 3x + 5y tidak dapat disederhanakan. Perkalian memakai sifat distributif: (a + b)(c + d) = ac + ad + bc + bd.<br>Identitas penting: (a + b)² = a² + 2ab + b²; (a − b)² = a² − 2ab + b²; a² − b² = (a + b)(a − b).<br><b>Contoh:</b> (2x + 3)(x − 4) = 2x² − 8x + 3x − 12 = 2x² − 5x − 12.','Gabungkan hanya suku sejenis dan hafal tiga identitas kuadrat.'],
['Persamaan Linear Satu Variabel','Bentuk umum ax + b = c dengan a ≠ 0. Lakukan operasi yang sama pada kedua ruas: pindahkan konstanta ke satu ruas, variabel ke ruas lain, lalu bagi dengan koefisien.<br><b>Contoh:</b> 3(x − 2) = 2x + 5 → 3x − 6 = 2x + 5 → x = 11. Cek: 3(9) = 27 dan 2(11) + 5 = 27 ✓.<br>Soal cerita: ubah kalimat menjadi model, misalnya “umur ayah 3 kali umur anak, jumlahnya 48” → x + 3x = 48 → x = 12.','Operasi di kedua ruas harus sama; cek jawaban dengan substitusi.'],
['Pertidaksamaan Linear','Penyelesaiannya serupa persamaan, tetapi tanda dibalik jika kedua ruas dikali atau dibagi bilangan negatif. <b>Contoh:</b> −2x + 1 > 7 → −2x > 6 → x < −3. Pada garis bilangan, bulatan kosong untuk &lt; atau &gt;, bulatan penuh untuk ≤ atau ≥.','Tanda berbalik saat dikali atau dibagi bilangan negatif.'],
['Fungsi Linear dan Gradien','Fungsi linear f(x) = mx + c berupa garis lurus dengan gradien m dan memotong sumbu-y di (0, c). Gradien melalui dua titik: m = (y₂ − y₁)/(x₂ − x₁). Persamaan garis melalui (x₁, y₁) bergradien m: y − y₁ = m(x − x₁). Dua garis sejajar jika gradiennya sama dan tegak lurus jika m₁ · m₂ = −1.<br><b>Contoh:</b> garis melalui (1, 3) dan (3, 7): m = 4/2 = 2 → y − 3 = 2(x − 1) → y = 2x + 1.','m = Δy/Δx; sejajar: m sama; tegak lurus: m₁·m₂ = −1.'],
['Sistem Persamaan Linear Dua Variabel','Gunakan eliminasi (samakan koefisien satu variabel lalu kurangkan atau jumlahkan) atau substitusi (nyatakan satu variabel dengan variabel lain).<br><b>Contoh:</b> x + y = 10 dan 2x − y = 8. Dijumlahkan: 3x = 18 → x = 6, y = 4. Cek: 12 − 4 = 8 ✓.','Eliminasi bila koefisien mudah disamakan; substitusi bila ada koefisien 1.'],
['Barisan dan Deret','Aritmetika (beda b): Uₙ = a + (n − 1)b dan Sₙ = n/2 · (2a + (n − 1)b). Geometri (rasio r): Uₙ = a·rⁿ⁻¹ dan Sₙ = a(rⁿ − 1)/(r − 1) untuk r > 1.<br><b>Contoh:</b> 3, 7, 11, … → U₁₀ = 3 + 9·4 = 39 dan S₁₀ = 5(6 + 36) = 210. Barisan 2, 6, 18, … → r = 3 dan U₅ = 2·3⁴ = 162.','Cek dulu beda (tambah) atau rasio (kali) sebelum memilih rumus.'],
['Kesalahan Umum','(1) Menjumlahkan suku tidak sejenis. (2) Lupa membalik tanda pertidaksamaan. (3) Salah tanda saat memindah ruas. (4) Mengira (a + b)² = a² + b². (5) Memakai n, bukan (n − 1), pada Uₙ.','Waspadai: suku tidak sejenis, tanda, pindah ruas, (a+b)², dan n − 1.']],
'sma|Matematika|Aljabar':[
['Persamaan Kuadrat','Bentuk ax² + bx + c = 0 (a ≠ 0). Cara menyelesaikan: pemfaktoran, melengkapkan kuadrat, atau rumus abc: x = (−b ± √(b² − 4ac)) / 2a.<br><b>Contoh:</b> x² − 5x + 6 = 0 → (x − 2)(x − 3) = 0 → x = 2 atau x = 3.','Gunakan pemfaktoran jika bisa; rumus abc selalu berlaku.'],
['Diskriminan dan Sifat Akar','D = b² − 4ac. D > 0: dua akar real berbeda; D = 0: akar kembar; D < 0: tidak ada akar real. Jumlah akar x₁ + x₂ = −b/a dan hasil kali x₁x₂ = c/a. Bentuk simetris: x₁² + x₂² = (x₁ + x₂)² − 2x₁x₂.<br><b>Contoh:</b> x² − 6x + 4 = 0 → x₁² + x₂² = 36 − 8 = 28.','D menentukan jenis akar; hubungan akar: −b/a dan c/a.'],
['Pertidaksamaan Kuadrat','Cari akar-akarnya, gambar parabola atau garis bilangan, lalu pilih daerah sesuai tanda. Untuk a > 0: (x − p)(x − q) < 0 berarti p < x < q, dan > 0 berarti x < p atau x > q.','Cari akar dulu, lalu uji tanda tiap daerah.'],
['Fungsi, Komposisi, dan Invers','(f ∘ g)(x) = f(g(x)); urutan penting karena umumnya f∘g ≠ g∘f. Invers: tukar x dan y lalu selesaikan. Untuk f(x) = (ax + b)/(cx + d), f⁻¹(x) = (−dx + b)/(cx − a).<br><b>Contoh:</b> f(x) = 2x + 3, g(x) = x² → (f∘g)(x) = 2x² + 3 dan (g∘f)(x) = (2x + 3)².','Komposisi dikerjakan dari fungsi dalam; invers = tukar x dan y.'],
['Barisan, Deret, Eksponen, dan Logaritma','Deret geometri tak hingga konvergen jika |r| < 1 dengan S∞ = a/(1 − r). Sifat eksponen: aᵐ·aⁿ = aᵐ⁺ⁿ; (aᵐ)ⁿ = aᵐⁿ. Logaritma: ᵃlog(bc) = ᵃlog b + ᵃlog c; ᵃlog bⁿ = n·ᵃlog b; ᵃlog b = ᶜlog b / ᶜlog a.<br><b>Contoh:</b> 8 + 4 + 2 + … → S∞ = 8/(1 − ½) = 16.','S∞ = a/(1 − r) untuk |r| < 1; ubah ke basis sama dalam eksponen dan logaritma.']],
'utbk|Penalaran Umum|Penalaran Logis':[
['Dasar Penalaran Deduktif','Premis adalah pernyataan yang dianggap benar; simpulan valid jika pasti mengikuti premis. Jangan memakai pengetahuan di luar soal. Kata “pasti”, “selalu”, dan “semua” menuntut bukti kuat, sedangkan “mungkin” dan “sebagian” lebih longgar.','Gunakan hanya informasi di soal; simpulan harus pasti.'],
['Silogisme dan Diagram','Semua A adalah B + Semua B adalah C → Semua A adalah C. Jika premis memuat “sebagian”, simpulan hanya boleh memuat “sebagian”. Gambar diagram lingkaran: A di dalam B, B di dalam C. Dua premis “sebagian” umumnya tidak menghasilkan simpulan pasti.','Gambar diagram lingkaran dan uji tiap pilihan.'],
['Implikasi dan Kontraposisi','Untuk “jika P maka Q”: konvers (Q → P) dan invers (¬P → ¬Q) belum tentu benar, sedangkan kontraposisi (¬Q → ¬P) selalu setara. Modus ponens: P → Q dan P, maka Q. Modus tollens: P → Q dan ¬Q, maka ¬P. Kekeliruan umum: dari Q menyimpulkan P.','Hanya kontraposisi yang setara dengan implikasi.'],
['Negasi dan Kuantor','Negasi “semua A adalah B” adalah “ada A yang bukan B”. Negasi “ada A yang B” adalah “tidak ada A yang B”. Negasi “P dan Q” adalah “¬P atau ¬Q”, dan negasi “P atau Q” adalah “¬P dan ¬Q”.','Negasi “semua” = “ada yang tidak”; hukum De Morgan untuk dan/atau.']]};
function mHead(m,sb){return `<div class="card item" style="align-items:center">${ic(m.e,sb.c)}<div><h3 style="font-size:18px">${m.t}</h3><span class="mu sm">${sb.n} • ${m.k}</span></div></div>`}
Object.assign(V,{
detail(){const m=M[st.mat]||M[0],sb=S[m.s],F=MAT[mkey(m)];
const body=F?F.map((x,i)=>`<h2>${i+1}. ${x[0]}</h2><p>${x[1]}</p>`).join(''):`<p>${m.r}</p><p><b>Tips belajar:</b> ${m.tip}</p><p class="mu">Materi lengkap bab ini belum tersedia dan masih disusun.</p>`;
return `<button class="crumb" onclick="go('materi')">‹ Kembali ke Materi</button>${mHead(m,sb)}<div class="layout" style="margin-top:14px"><div class="side"><button class="on">Materi Lengkap</button><button onclick="go('rsum',{mat:${st.mat}})">Rangkuman</button><button onclick="go('latihan',{sub:${m.s}})">Latihan</button><button onclick="go('kuis')">Kuis</button></div><div><div class="card lesson"><h2 style="margin-top:0">Materi Lengkap: ${m.t}</h2>${body}</div><div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-top:16px"><button class="btn s" onclick="go('materi')">‹ Kembali ke Materi</button><button class="btn" onclick="go('latihan',{sub:${m.s}})">Uji dengan Latihan ›</button></div></div></div>`},
rangkuman(){const l=M.map((m,i)=>[m,i]).filter(([m])=>st.sub<0||m.s===st.sub);
return `${head('Rangkuman Materi','Intisari dari materi lengkap, untuk mengulang cepat.','Ringkas tapi lengkap! ⚡')}<div class="layout">${sideSubj()}<div class="grid g2">${l.map(([m,i])=>`<div class="card item">${ic(m.e,S[m.s].c)}<div><h3>${m.t}${badge(m)}</h3><p class="mu sm">${S[m.s].n} • ${m.k}</p><button class="btn s" onclick="openRs(${i})">${locked(m)?'🔒 Buka dengan Premium':'Baca Rangkuman'}</button></div></div>`).join('')}</div></div>`},
rsum(){const m=M[st.mat]||M[0],sb=S[m.s],F=MAT[mkey(m)];
return `<button class="crumb" onclick="go('rangkuman')">‹ Kembali ke Rangkuman</button>${mHead(m,sb)}<div class="card lesson" style="margin-top:14px"><h2 style="margin-top:0">Rangkuman: ${m.t}</h2>${F?`<ul>${F.map(x=>`<li><b>${x[0]}:</b> ${x[2]}</li>`).join('')}</ul>`:`<p>${m.r}</p><p class="mu">Rangkuman lengkap menyusul setelah materi lengkap bab ini tersedia.</p>`}</div><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:16px"><button class="btn s" onclick="go('rangkuman')">‹ Daftar Rangkuman</button><button class="btn" onclick="go('latihan',{sub:${m.s}})">Uji dengan Latihan ›</button></div>`}});
function openRs(i){if(locked(M[i]))return openPlans('Rangkuman ini khusus paket Premium.');see(i);go('rsum',{mat:i})}
Object.assign(V,{auth:(a=>()=>(lsOK?'':'<p class="err" role="alert">Penyimpanan browser (localStorage) tidak aktif. Akun tidak bisa tersimpan; buka file ini langsung di browser biasa.</p>')+a())(V.auth)});

/* ---- Mode terang / gelap ---- */
function applyTheme(t){document.documentElement.dataset.theme=t;const b=$('#tsw');if(b){b.setAttribute('aria-checked',t==='dark');b.title=t==='dark'?'Mode gelap: aktif':'Mode gelap: mati'}const m=document.querySelector('meta[name=theme-color]');if(m)m.content=t==='dark'?'#0d1526':'#2f6bff'}
function toggleTheme(){const t=document.documentElement.dataset.theme==='dark'?'light':'dark';LS.set('es_theme',t);applyTheme(t)}
applyTheme(document.documentElement.dataset.theme==='dark'?'dark':'light');

/* ---- Pulihkan sesi login dari localStorage ---- */
{const em=LS.get('es_me'),u0=em&&users.find(u=>u.e===em);
if(u0){u0.s=u0.s||{lat:0,kuis:null,seen:[]};st.me=u0;st.picked=!!u0.plan;st.track=trackOf(u0.k)||st.track;st.sub=-1;go('home')}else go('intro')}