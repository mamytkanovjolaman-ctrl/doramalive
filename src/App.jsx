import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════════
//  DATA
// ═══════════════════════════════════════════════════════════
const DRAMAS = [
  { id:1,  title:"Дивный новый мир",         en:"Wicked World",          rating:4.9, year:2024, country:"Корея",  episodes:16, genre:["Романтика","Фэнтези"],     tag:"ХИТ",     tagColor:"#ff4e6a", gradient:"linear-gradient(145deg,#1a0533,#6b1a6b,#c94b8a,#ff7eb3)", emoji:"🌸", desc:"Молодая девушка переносится в параллельный мир, где магия и любовь переплетаются неразрывно.", director:"Пак Сан У", cast:["Ким Джи Вон","Ан Хё Соп","Пак Со Хуй"], studio:"tvN" },
  { id:2,  title:"Благородный Чэнь",          en:"Liang Chen Mei Jin",    rating:4.7, year:2024, country:"Китай",  episodes:40, genre:["Исторический","Романтика"],tag:"НОВИНКА", tagColor:"#4e9fff", gradient:"linear-gradient(145deg,#0a1628,#1a3a5c,#c8873a,#f5c842)", emoji:"🏯", desc:"Эпическая история любви на фоне древнего Китая. Интриги двора и невозможная любовь.", director:"Чэнь Ли", cast:["Сяо Чжань","Ван И Бо","Ли Цинь"], studio:"iQIYI" },
  { id:3,  title:"Жена напрокат",             en:"Wife for Hire",         rating:4.5, year:2024, country:"Корея",  episodes:12, genre:["Комедия","Романтика"],     tag:"ОНГОИНГ", tagColor:"#00e5a0", gradient:"linear-gradient(145deg,#0d2b1a,#1a5c3a,#2ecc71,#a8ff78)", emoji:"💍", desc:"Контрактный брак между холодным CEO и весёлой флористкой превращается в настоящие чувства.", director:"Ли Чан Хун", cast:["Ли Сын Ги","О Ён Со"], studio:"MBC" },
  { id:4,  title:"Моя звёздная любовь",       en:"My Star Love",          rating:4.8, year:2025, country:"Корея",  episodes:20, genre:["Романтика","Драма"],       tag:"ХИТ",     tagColor:"#ff4e6a", gradient:"linear-gradient(145deg,#0a0a2e,#1a1a6b,#4a4acf,#a78bfa)", emoji:"⭐", desc:"Знаменитый актёр и обычная девушка-фотограф. Когда звёзды встречают простых людей, жизнь меняется навсегда.", director:"Ким Су Вон", cast:["Пак Со Джун","Пак Мин Ён"], studio:"JTBC" },
  { id:5,  title:"Тысяча лет любви",          en:"A Thousand Years",      rating:4.6, year:2024, country:"Китай",  episodes:36, genre:["Исторический","Фэнтези"],  tag:"НОВИНКА", tagColor:"#4e9fff", gradient:"linear-gradient(145deg,#1a0a00,#5c2a00,#cf6b1a,#ffd700)", emoji:"🐉", desc:"Дракон, проклятый жить среди людей, встречает единственную, кто может разрушить заклятие.", director:"Ван Лэй", cast:["Дилраба","Лэй Цзяинь"], studio:"Youku" },
  { id:6,  title:"Доктор Чха",                en:"Doctor Cha",            rating:4.4, year:2023, country:"Корея",  episodes:16, genre:["Драма","Медицина"],        tag:"",        tagColor:"", gradient:"linear-gradient(145deg,#001a1a,#003d3d,#006b6b,#00bcd4)", emoji:"🏥", desc:"Женщина-врач в 40 лет решает начать жизнь заново. История о смелости и праве на второй шанс.", director:"Пак Чи Хён", cast:["Ом Чон Хва","Ким Бён Чхоль"], studio:"JTBC" },
  { id:7,  title:"Красная нить судьбы",       en:"Red Thread of Fate",    rating:4.3, year:2024, country:"Япония", episodes:10, genre:["Романтика","Драма"],       tag:"",        tagColor:"", gradient:"linear-gradient(145deg,#1a0000,#5c0000,#cf1a1a,#ff6b6b)", emoji:"🧵", desc:"Двое незнакомцев связаны невидимой нитью судьбы через время и пространство.", director:"Ямада Кэнджи", cast:["Ямадзаки Кэнто","Хамабэ Минами"], studio:"Fuji TV" },
  { id:8,  title:"Принц из снов",             en:"Prince of Dreams",      rating:4.5, year:2025, country:"Тайвань",episodes:14, genre:["Романтика","Фэнтези"],     tag:"НОВИНКА", tagColor:"#4e9fff", gradient:"linear-gradient(145deg,#0a1a0a,#1a3d2e,#2d8a5e,#7fffd4)", emoji:"🌙", desc:"Каждую ночь она видит одного и того же таинственного принца. Пока однажды он не появляется наяву.", director:"Линь Хуэй Мин", cast:["Сян Хао Жань","Чэнь Юйци"], studio:"LINE TV" },
  { id:9,  title:"Цветок войны",              en:"Flower of War",         rating:4.7, year:2024, country:"Китай",  episodes:48, genre:["Исторический","Драма"],    tag:"ХИТ",     tagColor:"#ff4e6a", gradient:"linear-gradient(145deg,#1a0a1a,#3d1a3d,#8a2d8a,#da70d6)", emoji:"⚔️", desc:"Генерал и придворная красавица — по разные стороны войны, но по одну сторону сердца.", director:"Фэн Сяоган", cast:["Лю Ши Ши","Ван Кай"], studio:"Tencent" },
  { id:10, title:"Бог и юридическая фирма",   en:"God and the Lawyer",    rating:4.8, year:2023, country:"Корея",  episodes:16, genre:["Драма","Фэнтези"],        tag:"ХИТ",     tagColor:"#ff4e6a", gradient:"linear-gradient(145deg,#0a1628,#1a3a5c,#2a5c8a,#4a9fff)", emoji:"⚖️", desc:"Блестящий адвокат получает божественные способности и использует их для восстановления справедливости.", director:"Ким Чхоль Гю", cast:["Ли Джун Ги","Ли Со Ён"], studio:"tvN" },
  { id:11, title:"Тайный сад",                en:"Secret Garden",         rating:4.6, year:2024, country:"Корея",  episodes:20, genre:["Фэнтези","Романтика"],     tag:"",        tagColor:"", gradient:"linear-gradient(145deg,#0a1a10,#0d3320,#1a6b40,#56ff96)", emoji:"🌿", desc:"Двое обменялись телами и поняли, что значит по-настоящему видеть другого человека.", director:"Хон Сон Чхан", cast:["Хён Бин","Ха Чжи Вон"], studio:"SBS" },
  { id:12, title:"Небесный дворец",           en:"Heavenly Palace",       rating:4.5, year:2024, country:"Китай",  episodes:56, genre:["Исторический","Фэнтези"],  tag:"НОВИНКА", tagColor:"#4e9fff", gradient:"linear-gradient(145deg,#0a0520,#1a0a40,#4a1a8a,#c87eff)", emoji:"✨", desc:"Смертная девушка попадает в небесный дворец богов и становится частью их вечных интриг.", director:"Чжан Вэй", cast:["Гу Ли На Чжа","Жэнь Цзялунь"], studio:"iQIYI" },
];

const GENRES    = ["Все","Романтика","Исторический","Фэнтези","Драма","Комедия","Медицина"];
const COUNTRIES = ["Все","Корея","Китай","Япония","Тайвань"];
const SORTS     = [
  { id:"popular", label:"Популярные" },
  { id:"rating",  label:"По рейтингу" },
  { id:"new",     label:"Новинки" },
  { id:"az",      label:"А–Я" },
];

// ═══════════════════════════════════════════════════════════
//  ICONS
// ═══════════════════════════════════════════════════════════
const IPlay   = ({s=20}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><polygon points="6,3 20,12 6,21"/></svg>;
const IStar   = ({s=12}) => <svg width={s} height={s} viewBox="0 0 12 12" fill="#FFD700"><polygon points="6,1 7.5,4.5 11,5 8.5,7.5 9,11 6,9.5 3,11 3.5,7.5 1,5 4.5,4.5"/></svg>;
const IBack   = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15,18 9,12 15,6"/></svg>;
const ISearch = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>;
const IBm     = ({on}) => <svg width="18" height="18" viewBox="0 0 24 24" fill={on?"#ff4e6a":"none"} stroke={on?"#ff4e6a":"currentColor"} strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>;
const IShare  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>;
const ICheck  = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20,6 9,17 4,12"/></svg>;
const ICR     = ({s=15}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9,18 15,12 9,6"/></svg>;
const ICL     = ({s=15}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15,18 9,12 15,6"/></svg>;
const IGrid   = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>;
const IList   = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>;
const IFilter = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3"/></svg>;

// ═══════════════════════════════════════════════════════════
//  SHARED
// ═══════════════════════════════════════════════════════════
function Poster({ d, fontSize=40 }) {
  return (
    <div style={{ width:"100%", height:"100%", background:d.gradient,
      display:"flex", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden" }}>
      <div style={{ fontSize, filter:"drop-shadow(0 4px 12px rgba(0,0,0,0.5))", zIndex:1 }}>{d.emoji}</div>
      <div style={{ position:"absolute", inset:0, background:"radial-gradient(circle at 30% 25%, rgba(255,255,255,0.1) 0%, transparent 55%)" }}/>
    </div>
  );
}

function Tag({ label, color }) {
  if (!label) return null;
  return <div style={{ display:"inline-block", background:color, color:"#fff",
    fontSize:9, fontWeight:800, padding:"2px 8px", borderRadius:5,
    fontFamily:"'Bebas Neue',sans-serif", letterSpacing:"0.08em" }}>{label}</div>;
}

// ── BOTTOM NAV ────────────────────────────────────────────────────────────────
function BottomNav({ page, onNav }) {
  const items = [
    { id:"home",    icon:"🏠", label:"Главная"  },
    { id:"catalog", icon:"🎬", label:"Каталог"  },
    { id:"search",  icon:"🔍", label:"Поиск"    },
    { id:"fav",     icon:"❤️", label:"Избранное"},
  ];
  return (
    <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)",
      width:"100%", maxWidth:680, background:"rgba(8,8,20,0.97)",
      backdropFilter:"blur(16px)", borderTop:"1px solid rgba(255,255,255,0.07)",
      display:"flex", justifyContent:"space-around", padding:"8px 0 14px", zIndex:80 }}>
      {items.map(it=>(
        <div key={it.id} onClick={()=>onNav(it.id)}
          style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3,
            cursor:"pointer", opacity: page===it.id?1:0.4, transition:"opacity 0.2s" }}>
          <div style={{ fontSize:20 }}>{it.icon}</div>
          <div style={{ fontSize:9, color: page===it.id?"#ff4e6a":"#fff",
            fontWeight: page===it.id?700:500 }}>{it.label}</div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  CARD (grid)
// ═══════════════════════════════════════════════════════════
function Card({ d, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={()=>onClick(d)}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ cursor:"pointer", borderRadius:13, overflow:"hidden", position:"relative",
        aspectRatio:"2/3", flexShrink:0,
        boxShadow: hov?"0 14px 36px rgba(0,0,0,0.6)":"0 4px 14px rgba(0,0,0,0.35)",
        transform: hov?"translateY(-5px) scale(1.02)":"none",
        transition:"all 0.22s cubic-bezier(.34,1.56,.64,1)" }}>
      <Poster d={d} fontSize={30}/>
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(0,0,0,0.96) 0%,rgba(0,0,0,0.3) 45%,transparent 100%)" }}/>
      <div style={{ position:"absolute", top:7, left:7 }}><Tag label={d.tag} color={d.tagColor}/></div>
      <div style={{ position:"absolute", top:7, right:7, background:"rgba(0,0,0,0.72)",
        borderRadius:6, padding:"2px 6px", display:"flex", alignItems:"center", gap:3,
        fontSize:10, color:"#FFD700", fontWeight:700 }}><IStar s={9}/>{d.rating}</div>
      {hov && <div style={{ position:"absolute", inset:0, display:"flex",
        alignItems:"center", justifyContent:"center" }}>
        <div style={{ width:44, height:44, borderRadius:"50%", background:"rgba(255,78,106,0.9)",
          display:"flex", alignItems:"center", justifyContent:"center", color:"#fff",
          boxShadow:"0 0 24px rgba(255,78,106,0.7)" }}><IPlay s={17}/></div>
      </div>}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"9px 8px 8px" }}>
        <div style={{ color:"#fff", fontSize:10, fontWeight:700, lineHeight:1.3,
          fontFamily:"'Bebas Neue',sans-serif",
          display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{d.title}</div>
        <div style={{ color:"rgba(255,255,255,0.38)", fontSize:9, marginTop:1,
          overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{d.en}</div>
      </div>
    </div>
  );
}

// ── CARD LIST (row view) ──────────────────────────────────────────────────────
function CardRow({ d, onClick }) {
  return (
    <div onClick={()=>onClick(d)}
      style={{ display:"flex", gap:13, padding:"12px 0",
        borderBottom:"1px solid rgba(255,255,255,0.05)", cursor:"pointer" }}
      onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.03)"}
      onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
      <div style={{ width:72, height:100, borderRadius:10, overflow:"hidden", flexShrink:0,
        boxShadow:"0 4px 16px rgba(0,0,0,0.4)" }}>
        <Poster d={d} fontSize={26}/>
      </div>
      <div style={{ flex:1, minWidth:0, paddingTop:2 }}>
        <div style={{ marginBottom:5 }}><Tag label={d.tag} color={d.tagColor}/></div>
        <div style={{ fontSize:14, fontWeight:800, color:"#fff", lineHeight:1.2,
          fontFamily:"'Bebas Neue',sans-serif", letterSpacing:"0.02em", marginBottom:3 }}>{d.title}</div>
        <div style={{ fontSize:11, color:"rgba(255,255,255,0.35)", marginBottom:7 }}>{d.en}</div>
        <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
          <div style={{ display:"flex", alignItems:"center", gap:3 }}>
            <IStar s={11}/><span style={{ color:"#FFD700", fontSize:12, fontWeight:700 }}>{d.rating}</span>
          </div>
          {[d.country, d.year, `${d.episodes} сер.`].map(v=>
            <span key={v} style={{ color:"rgba(255,255,255,0.38)", fontSize:11 }}>{v}</span>)}
        </div>
        <div style={{ display:"flex", gap:5, marginTop:7, flexWrap:"wrap" }}>
          {d.genre.slice(0,2).map(g=><span key={g} style={{ background:"rgba(255,78,106,0.1)",
            color:"#ff9eaa", fontSize:9, padding:"2px 7px", borderRadius:5,
            border:"1px solid rgba(255,78,106,0.2)" }}>{g}</span>)}
        </div>
      </div>
      <div style={{ display:"flex", alignItems:"center", color:"rgba(255,255,255,0.2)", flexShrink:0 }}>
        <ICR s={16}/>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  HOME PAGE
// ═══════════════════════════════════════════════════════════
function HeroBanner({ onSelect }) {
  const hits = DRAMAS.filter(d=>d.tag==="ХИТ");
  const [idx, setIdx] = useState(0);
  const d = hits[idx];
  useEffect(()=>{ const t=setInterval(()=>setIdx(i=>(i+1)%hits.length),5000); return()=>clearInterval(t); },[]);
  return (
    <div style={{ position:"relative", height:390, overflow:"hidden", borderRadius:"0 0 22px 22px" }}>
      <div style={{ position:"absolute", inset:0, background:d.gradient, transition:"background 0.8s" }}/>
      <div style={{ position:"absolute", right:-15, bottom:-10, fontSize:170, opacity:0.09,
        filter:"blur(2px)", userSelect:"none" }}>{d.emoji}</div>
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg,rgba(0,0,0,0.72) 0%,rgba(0,0,0,0.08) 60%,rgba(0,0,0,0.5) 100%)" }}/>
      <div style={{ position:"absolute", bottom:30, left:20, right:20 }}>
        <div style={{ marginBottom:7 }}><Tag label={d.tag} color={d.tagColor}/></div>
        <div style={{ fontSize:32, fontWeight:800, color:"#fff", lineHeight:1.1,
          fontFamily:"'Bebas Neue',sans-serif", letterSpacing:"0.02em", marginBottom:7,
          textShadow:"0 2px 20px rgba(0,0,0,0.5)" }}>{d.title}</div>
        <div style={{ color:"rgba(255,255,255,0.58)", fontSize:12, lineHeight:1.6, marginBottom:14,
          maxWidth:340, display:"-webkit-box", WebkitLineClamp:2,
          WebkitBoxOrient:"vertical", overflow:"hidden" }}>{d.desc}</div>
        <div style={{ display:"flex", gap:9, alignItems:"center", flexWrap:"wrap" }}>
          <button onClick={()=>onSelect(d)} style={{ padding:"9px 20px",
            background:"linear-gradient(90deg,#ff4e6a,#ff7e42)", border:"none",
            color:"#fff", borderRadius:10, fontSize:13, fontWeight:700, cursor:"pointer",
            display:"flex", alignItems:"center", gap:6,
            fontFamily:"'Bebas Neue',sans-serif", letterSpacing:"0.06em",
            boxShadow:"0 6px 20px rgba(255,78,106,0.45)" }}>
            <IPlay s={13}/> СМОТРЕТЬ
          </button>
          <div style={{ display:"flex", alignItems:"center", gap:5,
            background:"rgba(255,255,255,0.12)", borderRadius:8, padding:"7px 11px",
            backdropFilter:"blur(8px)" }}>
            <IStar s={12}/><span style={{ color:"#FFD700", fontWeight:700, fontSize:12 }}>{d.rating}</span>
            <span style={{ color:"rgba(255,255,255,0.45)", fontSize:11 }}>• {d.country}</span>
          </div>
        </div>
      </div>
      <div style={{ position:"absolute", bottom:10, right:16, display:"flex", gap:5 }}>
        {hits.map((_,i)=><div key={i} onClick={()=>setIdx(i)}
          style={{ width:i===idx?16:5, height:5, borderRadius:3, cursor:"pointer",
            transition:"all 0.3s", background:i===idx?"#ff4e6a":"rgba(255,255,255,0.3)" }}/>)}
      </div>
    </div>
  );
}

function Section({ title, icon, dramas, onSelect }) {
  const ref = useRef(null);
  return (
    <div style={{ marginBottom:30 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
        marginBottom:11, padding:"0 16px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:7 }}>
          <span>{icon}</span>
          <span style={{ fontSize:16, fontWeight:800, color:"#fff",
            fontFamily:"'Bebas Neue',sans-serif", letterSpacing:"0.03em" }}>{title}</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:2,
          color:"#ff4e6a", fontSize:12, cursor:"pointer", fontWeight:600 }}>Все <ICR s={13}/></div>
      </div>
      <div style={{ position:"relative" }}>
        <div ref={ref} style={{ display:"flex", gap:10, overflowX:"auto",
          scrollbarWidth:"none", padding:"4px 16px 6px", scrollBehavior:"smooth" }}>
          {dramas.map(d=><div key={d.id} style={{ flexShrink:0, width:132 }}>
            <Card d={d} onClick={onSelect}/>
          </div>)}
        </div>
        <button onClick={()=>ref.current&&(ref.current.scrollLeft-=220)}
          style={{ position:"absolute", left:3, top:"37%", transform:"translateY(-50%)",
            background:"rgba(10,10,24,0.9)", border:"1px solid rgba(255,255,255,0.1)",
            color:"#fff", width:28, height:28, borderRadius:"50%", cursor:"pointer",
            display:"flex", alignItems:"center", justifyContent:"center" }}><ICL s={13}/></button>
        <button onClick={()=>ref.current&&(ref.current.scrollLeft+=220)}
          style={{ position:"absolute", right:3, top:"37%", transform:"translateY(-50%)",
            background:"rgba(10,10,24,0.9)", border:"1px solid rgba(255,255,255,0.1)",
            color:"#fff", width:28, height:28, borderRadius:"50%", cursor:"pointer",
            display:"flex", alignItems:"center", justifyContent:"center" }}><ICR s={13}/></button>
      </div>
    </div>
  );
}

function HomePage({ onSelect, onNav, user, onLoginClick }) {
  const scrollRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  useEffect(()=>{
    const el = scrollRef.current;
    if (!el) return;
    const fn=()=>setScrolled(el.scrollTop>50);
    el.addEventListener("scroll",fn);
    return()=>el.removeEventListener("scroll",fn);
  },[]);

  return (
    <div ref={scrollRef} style={{ height:"100vh", overflowY:"auto", paddingBottom:70 }}>
      <nav style={{ position:"sticky", top:0, zIndex:50,
        background: scrolled?"rgba(10,10,24,0.97)":"transparent",
        backdropFilter: scrolled?"blur(16px)":"none",
        borderBottom: scrolled?"1px solid rgba(255,255,255,0.06)":"none",
        transition:"all 0.3s", padding:"0 16px", height:54,
        display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ fontSize:21, fontFamily:"'Bebas Neue',sans-serif" }}>
          <span style={{ background:"linear-gradient(90deg,#ff4e6a,#ff7e42)",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>DORAMA</span>
          <span style={{ color:"#fff" }}>LIVE</span>
        </div>
        {user
          ? <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:32, height:32, borderRadius:"50%",
                background:"linear-gradient(135deg,#ff4e6a,#ff7e42)",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:14, fontWeight:700, color:"#fff", cursor:"pointer" }}
                onClick={()=>onNav("fav")}>
                {user.name[0].toUpperCase()}
              </div>
            </div>
          : <button onClick={onLoginClick} style={{ background:"linear-gradient(90deg,#ff4e6a,#ff7e42)",
              border:"none", color:"#fff", padding:"6px 14px", borderRadius:8,
              fontSize:12, fontWeight:700, cursor:"pointer",
              fontFamily:"'Bebas Neue',sans-serif", letterSpacing:"0.05em" }}>ВОЙТИ</button>}
      </nav>
      <div style={{ marginTop:-54 }}><HeroBanner onSelect={onSelect}/></div>
      <div style={{ height:18 }}/>
      <Section title="ПОПУЛЯРНОЕ"  icon="🔥" dramas={DRAMAS.filter(d=>d.tag==="ХИТ")}     onSelect={onSelect}/>
      <Section title="НОВИНКИ"     icon="✨" dramas={DRAMAS.filter(d=>d.tag==="НОВИНКА")} onSelect={onSelect}/>
      <Section title="ВСЕ ДОРАМЫ" icon="🎬" dramas={DRAMAS}                               onSelect={onSelect}/>
      <div style={{ padding:"0 16px 32px" }}>
        <div style={{ fontSize:16, fontWeight:800, color:"#fff",
          fontFamily:"'Bebas Neue',sans-serif", marginBottom:11 }}>🌏 ПО СТРАНАМ</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:9 }}>
          {["Корея","Китай","Япония","Тайвань"].map(c=>{
            const count=DRAMAS.filter(d=>d.country===c).length;
            const s=DRAMAS.find(d=>d.country===c);
            return <div key={c} onClick={()=>onNav("catalog",{country:c})}
              style={{ borderRadius:13, overflow:"hidden", position:"relative",
                height:82, cursor:"pointer", background:s?.gradient, transition:"transform 0.2s" }}
              onMouseEnter={e=>e.currentTarget.style.transform="scale(1.02)"}
              onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
              <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.45)" }}/>
              <div style={{ position:"absolute", bottom:10, left:12 }}>
                <div style={{ fontSize:14, fontWeight:800, color:"#fff",
                  fontFamily:"'Bebas Neue',sans-serif" }}>{c}</div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.5)" }}>{count} дорам</div>
              </div>
              <div style={{ position:"absolute", right:10, top:"50%",
                transform:"translateY(-50%)", fontSize:26, opacity:0.35 }}>{s?.emoji}</div>
            </div>;
          })}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  CATALOG PAGE
// ═══════════════════════════════════════════════════════════
function CatalogPage({ onSelect, initCountry="" }) {
  const [search,  setSearch]  = useState("");
  const [genre,   setGenre]   = useState("Все");
  const [country, setCountry] = useState(initCountry||"Все");
  const [sort,    setSort]    = useState("popular");
  const [view,    setView]    = useState("grid");   // grid | list
  const [showFilters, setShowFilters] = useState(false);

  const sorted = [...DRAMAS].sort((a,b)=>{
    if (sort==="rating")  return b.rating - a.rating;
    if (sort==="new")     return b.year - a.year;
    if (sort==="az")      return a.title.localeCompare(b.title,"ru");
    return (b.tag==="ХИТ"?1:0) - (a.tag==="ХИТ"?1:0);
  }).filter(d=>{
    const ms = !search || d.title.toLowerCase().includes(search.toLowerCase()) || d.en.toLowerCase().includes(search.toLowerCase());
    const mg = genre==="Все" || d.genre.includes(genre);
    const mc = country==="Все" || d.country===country;
    return ms && mg && mc;
  });

  const activeFilters = [genre!=="Все"&&genre, country!=="Все"&&country].filter(Boolean);

  return (
    <div style={{ height:"100vh", overflowY:"auto", paddingBottom:70 }}>
      {/* Header */}
      <div style={{ position:"sticky", top:0, zIndex:50,
        background:"rgba(10,10,24,0.97)", backdropFilter:"blur(16px)",
        borderBottom:"1px solid rgba(255,255,255,0.06)", padding:"12px 16px 0" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
          <div style={{ fontSize:21, fontFamily:"'Bebas Neue',sans-serif" }}>
            <span style={{ background:"linear-gradient(90deg,#ff4e6a,#ff7e42)",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>DORAMA</span>
            <span style={{ color:"#fff" }}>LIVE</span>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={()=>setView(v=>v==="grid"?"list":"grid")}
              style={{ background:"rgba(255,255,255,0.07)", border:"none", color:"rgba(255,255,255,0.7)",
                width:34, height:34, borderRadius:9, cursor:"pointer",
                display:"flex", alignItems:"center", justifyContent:"center" }}>
              {view==="grid"?<IList/>:<IGrid/>}
            </button>
            <button onClick={()=>setShowFilters(f=>!f)}
              style={{ background: showFilters?"rgba(255,78,106,0.2)":"rgba(255,255,255,0.07)",
                border: showFilters?"1px solid rgba(255,78,106,0.4)":"none",
                color: showFilters?"#ff4e6a":"rgba(255,255,255,0.7)",
                width:34, height:34, borderRadius:9, cursor:"pointer",
                display:"flex", alignItems:"center", justifyContent:"center" }}>
              <IFilter/>
            </button>
          </div>
        </div>
        {/* Search */}
        <div style={{ position:"relative", marginBottom:10 }}>
          <div style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)",
            color:"rgba(255,255,255,0.28)" }}><ISearch/></div>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Поиск дорам..."
            style={{ width:"100%", padding:"10px 12px 10px 40px",
              background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.08)",
              borderRadius:11, color:"#fff", fontSize:13, outline:"none",
              fontFamily:"'Manrope',sans-serif", boxSizing:"border-box" }}/>
        </div>
        {/* Sort chips */}
        <div style={{ display:"flex", gap:6, overflowX:"auto", scrollbarWidth:"none", paddingBottom:10 }}>
          {SORTS.map(s=><button key={s.id} onClick={()=>setSort(s.id)} style={{
            flexShrink:0, padding:"5px 12px", borderRadius:18,
            border: sort===s.id?"none":"1px solid rgba(255,255,255,0.1)",
            background: sort===s.id?"linear-gradient(90deg,#ff4e6a,#ff7e42)":"rgba(255,255,255,0.05)",
            color: sort===s.id?"#fff":"rgba(255,255,255,0.45)",
            fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"'Manrope',sans-serif",
            whiteSpace:"nowrap" }}>{s.label}</button>)}
        </div>
        {/* Collapsible filters */}
        {showFilters && (
          <div style={{ paddingBottom:12, borderTop:"1px solid rgba(255,255,255,0.05)", paddingTop:10 }}>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.3)", marginBottom:8,
              fontFamily:"'Bebas Neue',sans-serif", letterSpacing:"0.07em" }}>ЖАНР</div>
            <div style={{ display:"flex", gap:6, overflowX:"auto", scrollbarWidth:"none", marginBottom:10 }}>
              {GENRES.map(g=><button key={g} onClick={()=>setGenre(g)} style={{
                flexShrink:0, padding:"4px 12px", borderRadius:16,
                border: genre===g?"none":"1px solid rgba(255,255,255,0.1)",
                background: genre===g?"rgba(255,78,106,0.2)":"rgba(255,255,255,0.04)",
                color: genre===g?"#ff7e8e":"rgba(255,255,255,0.42)",
                fontSize:11, fontWeight:600, cursor:"pointer" }}>{g}</button>)}
            </div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.3)", marginBottom:8,
              fontFamily:"'Bebas Neue',sans-serif", letterSpacing:"0.07em" }}>СТРАНА</div>
            <div style={{ display:"flex", gap:6, overflowX:"auto", scrollbarWidth:"none" }}>
              {COUNTRIES.map(c=><button key={c} onClick={()=>setCountry(c)} style={{
                flexShrink:0, padding:"4px 12px", borderRadius:16,
                border: country===c?"none":"1px solid rgba(255,255,255,0.1)",
                background: country===c?"rgba(78,159,255,0.2)":"rgba(255,255,255,0.04)",
                color: country===c?"#7eb8ff":"rgba(255,255,255,0.42)",
                fontSize:11, fontWeight:600, cursor:"pointer" }}>{c}</button>)}
            </div>
          </div>
        )}
      </div>

      {/* Active filter tags */}
      {activeFilters.length>0 && (
        <div style={{ display:"flex", gap:7, padding:"10px 16px 0", flexWrap:"wrap" }}>
          {activeFilters.map(f=>(
            <div key={f} style={{ display:"flex", alignItems:"center", gap:5,
              background:"rgba(255,78,106,0.15)", border:"1px solid rgba(255,78,106,0.3)",
              borderRadius:8, padding:"3px 10px", fontSize:11, color:"#ff9eaa" }}>
              {f}
              <span onClick={()=>{ if(GENRES.includes(f))setGenre("Все"); else setCountry("Все"); }}
                style={{ cursor:"pointer", opacity:0.7, fontSize:13, lineHeight:1 }}>×</span>
            </div>
          ))}
          <div onClick={()=>{setGenre("Все");setCountry("Все");}}
            style={{ fontSize:11, color:"rgba(255,255,255,0.3)", cursor:"pointer",
              display:"flex", alignItems:"center" }}>Сбросить</div>
        </div>
      )}

      {/* Result count */}
      <div style={{ padding:"10px 16px 8px", fontSize:12, color:"rgba(255,255,255,0.3)" }}>
        Найдено: <span style={{ color:"rgba(255,255,255,0.6)", fontWeight:700 }}>{sorted.length}</span> дорам
      </div>

      {/* GRID or LIST */}
      {sorted.length===0 ? (
        <div style={{ textAlign:"center", padding:"60px 0", color:"rgba(255,255,255,0.25)" }}>
          <div style={{ fontSize:44, marginBottom:10 }}>🔍</div>
          <div style={{ fontSize:14 }}>Ничего не найдено</div>
          <div style={{ fontSize:12, marginTop:6, color:"rgba(255,255,255,0.18)" }}>Попробуй изменить фильтры</div>
        </div>
      ) : view==="grid" ? (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(120px,1fr))",
          gap:10, padding:"0 16px 16px" }}>
          {sorted.map(d=><Card key={d.id} d={d} onClick={onSelect}/>)}
        </div>
      ) : (
        <div style={{ padding:"0 16px" }}>
          {sorted.map(d=><CardRow key={d.id} d={d} onClick={onSelect}/>)}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  WATCH PAGE
// ═══════════════════════════════════════════════════════════
function WatchPage({ drama: d, onBack, isFav, onToggleFav }) {
  const [ep, setEp]         = useState(1);
  const [bm, setBm]         = useState(isFav||false);
  const [exp, setExp]       = useState(false);
  const [playing, setPlay]  = useState(false);
  const episodes = Array.from({length:d.episodes},(_,i)=>({num:i+1,dur:`${42+Math.floor(Math.random()*10)} мин`,watched:i<2}));
  const goEp = n => { setEp(n); setPlay(false); };

  return (
    <div style={{ background:"#0a0a18", minHeight:"100vh", color:"#fff",
      fontFamily:"'Manrope',sans-serif", paddingBottom:70 }}>
      {/* TOP NAV */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"11px 14px", position:"sticky", top:0, zIndex:50,
        background:"rgba(10,10,24,0.96)", backdropFilter:"blur(14px)",
        borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
        <button onClick={onBack} style={{ background:"rgba(255,255,255,0.08)", border:"none",
          color:"#fff", width:36, height:36, borderRadius:10, cursor:"pointer",
          display:"flex", alignItems:"center", justifyContent:"center" }}><IBack/></button>
        <div style={{ fontSize:11, color:"rgba(255,255,255,0.35)", display:"flex", gap:5 }}>
          <span onClick={onBack} style={{ cursor:"pointer", color:"rgba(255,255,255,0.55)" }}>Каталог</span>
          <span>/</span>
          <span style={{ color:"rgba(255,255,255,0.25)", maxWidth:160,
            overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{d.title}</span>
        </div>
        <div style={{ display:"flex", gap:7 }}>
          <button onClick={()=>{ setBm(b=>!b); onToggleFav&&onToggleFav(); }} style={{
            background:bm?"rgba(255,78,106,0.15)":"rgba(255,255,255,0.08)",
            border:bm?"1px solid rgba(255,78,106,0.4)":"1px solid transparent",
            color:"#fff", width:36, height:36, borderRadius:10, cursor:"pointer",
            display:"flex", alignItems:"center", justifyContent:"center" }}><IBm on={bm}/></button>
          <button style={{ background:"rgba(255,255,255,0.08)", border:"none", color:"#fff",
            width:36, height:36, borderRadius:10, cursor:"pointer",
            display:"flex", alignItems:"center", justifyContent:"center" }}><IShare/></button>
        </div>
      </div>
      {/* HERO */}
      <div style={{ position:"relative", height:250, overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, background:d.gradient }}/>
        <div style={{ position:"absolute", right:-15, top:-10, fontSize:190,
          opacity:0.08, userSelect:"none", filter:"blur(2px)" }}>{d.emoji}</div>
        <div style={{ position:"absolute", inset:0,
          background:"linear-gradient(to bottom,rgba(0,0,0,0.08) 0%,rgba(10,10,24,1) 100%)" }}/>
        <div style={{ position:"absolute", bottom:0, left:0, right:0,
          padding:"0 16px 18px", display:"flex", gap:13, alignItems:"flex-end" }}>
          <div style={{ width:82, height:114, borderRadius:11, overflow:"hidden", flexShrink:0,
            boxShadow:"0 8px 28px rgba(0,0,0,0.7)", border:"2px solid rgba(255,255,255,0.1)" }}>
            <Poster d={d} fontSize={30}/>
          </div>
          <div style={{ flex:1, minWidth:0, paddingBottom:3 }}>
            <div style={{ marginBottom:5 }}><Tag label={d.tag} color={d.tagColor}/></div>
            <div style={{ fontSize:19, fontWeight:800, color:"#fff", lineHeight:1.15,
              fontFamily:"'Bebas Neue',sans-serif", letterSpacing:"0.02em", marginBottom:4 }}>{d.title}</div>
            <div style={{ color:"rgba(255,255,255,0.35)", fontSize:11, marginBottom:7 }}>{d.en}</div>
            <div style={{ display:"flex", gap:6, alignItems:"center", flexWrap:"wrap" }}>
              <div style={{ display:"flex", alignItems:"center", gap:3,
                background:"rgba(0,0,0,0.45)", backdropFilter:"blur(6px)",
                borderRadius:7, padding:"3px 7px" }}>
                <IStar s={11}/><span style={{ color:"#FFD700", fontWeight:700, fontSize:12 }}>{d.rating}</span>
              </div>
              {[d.year, d.country, `${d.episodes} сер.`, d.studio].map(v=>
                <span key={v} style={{ color:"rgba(255,255,255,0.45)", fontSize:11 }}>{v}</span>)}
            </div>
          </div>
        </div>
      </div>
      {/* GENRES */}
      <div style={{ padding:"13px 16px 0", display:"flex", gap:6, flexWrap:"wrap" }}>
        {d.genre.map(g=><span key={g} style={{ background:"rgba(255,78,106,0.12)", color:"#ff7e8e",
          fontSize:11, padding:"4px 11px", borderRadius:8,
          border:"1px solid rgba(255,78,106,0.22)" }}>{g}</span>)}
      </div>
      {/* DESC */}
      <div style={{ padding:"12px 16px" }}>
        <div style={{ color:"rgba(255,255,255,0.58)", fontSize:13, lineHeight:1.8,
          overflow:"hidden", maxHeight:exp?"none":"55px",
          maskImage:exp?"none":"linear-gradient(to bottom,black 40%,transparent 100%)",
          WebkitMaskImage:exp?"none":"linear-gradient(to bottom,black 40%,transparent 100%)" }}>{d.desc}</div>
        <button onClick={()=>setExp(e=>!e)} style={{ background:"none", border:"none",
          color:"#ff4e6a", fontSize:12, fontWeight:700, cursor:"pointer",
          marginTop:4, padding:0, fontFamily:"'Manrope',sans-serif" }}>
          {exp?"Свернуть ↑":"Читать далее ↓"}</button>
      </div>
      {/* CAST */}
      <div style={{ padding:"0 16px 13px" }}>
        <div style={{ fontSize:11, color:"rgba(255,255,255,0.28)", marginBottom:9,
          fontFamily:"'Bebas Neue',sans-serif", letterSpacing:"0.08em" }}>В ГЛАВНЫХ РОЛЯХ</div>
        <div style={{ display:"flex", gap:11, overflowX:"auto", scrollbarWidth:"none" }}>
          {d.cast.map(name=><div key={name} style={{ flexShrink:0, textAlign:"center" }}>
            <div style={{ width:48, height:48, borderRadius:"50%", margin:"0 auto 5px",
              background:"linear-gradient(135deg,rgba(255,78,106,0.28),rgba(255,126,66,0.28))",
              border:"2px solid rgba(255,78,106,0.22)",
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>🎭</div>
            <div style={{ color:"rgba(255,255,255,0.58)", fontSize:10, fontWeight:600,
              maxWidth:58, textAlign:"center", lineHeight:1.3 }}>{name}</div>
          </div>)}
        </div>
      </div>
      {/* INFO TABLE */}
      <div style={{ margin:"0 16px 16px", background:"rgba(255,255,255,0.04)",
        borderRadius:13, border:"1px solid rgba(255,255,255,0.07)", overflow:"hidden" }}>
        {[["Страна",d.country],["Год",String(d.year)],["Серий",String(d.episodes)],
          ["Режиссёр",d.director],["Студия",d.studio]].map(([k,v],i,arr)=>(
          <div key={k} style={{ display:"flex", justifyContent:"space-between",
            alignItems:"center", padding:"10px 15px",
            borderBottom:i<arr.length-1?"1px solid rgba(255,255,255,0.05)":"none" }}>
            <span style={{ color:"rgba(255,255,255,0.32)", fontSize:12 }}>{k}</span>
            <span style={{ color:"rgba(255,255,255,0.76)", fontSize:12, fontWeight:600 }}>{v}</span>
          </div>
        ))}
      </div>
      <div style={{ margin:"0 16px 16px", height:1, background:"rgba(255,255,255,0.06)" }}/>
      {/* PLAYER TITLE */}
      <div style={{ padding:"0 16px 9px", display:"flex", alignItems:"center", gap:8 }}>
        <div style={{ width:3, height:17, background:"linear-gradient(180deg,#ff4e6a,#ff7e42)", borderRadius:2 }}/>
        <span style={{ fontSize:14, fontWeight:800, fontFamily:"'Bebas Neue',sans-serif",
          letterSpacing:"0.03em" }}>СМОТРЕТЬ</span>
        <span style={{ fontSize:12, color:"rgba(255,255,255,0.32)" }}>Серия {ep} из {d.episodes}</span>
      </div>
      {/* PLAYER */}
      <div style={{ position:"relative", aspectRatio:"16/9", background:"#000", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, background:d.gradient, opacity:0.62 }}/>
        <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.4)" }}/>
        <div style={{ position:"absolute", right:-8, bottom:-8, fontSize:120,
          opacity:0.07, userSelect:"none" }}>{d.emoji}</div>
        {!playing
          ? <div style={{ position:"absolute", inset:0, display:"flex",
              flexDirection:"column", alignItems:"center", justifyContent:"center", gap:11 }}>
              <button onClick={()=>setPlay(true)} style={{ width:64, height:64, borderRadius:"50%",
                background:"linear-gradient(135deg,#ff4e6a,#ff7e42)", border:"none", color:"#fff",
                cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
                boxShadow:"0 0 40px rgba(255,78,106,0.55)" }}><IPlay s={24}/></button>
              <div style={{ textAlign:"center" }}>
                <div style={{ color:"rgba(255,255,255,0.82)", fontSize:13, fontWeight:700 }}>Серия {ep}</div>
                <div style={{ color:"rgba(255,255,255,0.3)", fontSize:11, marginTop:2 }}>Нажмите для просмотра</div>
              </div>
            </div>
          : <div style={{ position:"absolute", inset:0, display:"flex",
              alignItems:"center", justifyContent:"center", flexDirection:"column", gap:9 }}>
              <div style={{ width:40, height:40, border:"3px solid rgba(255,78,106,0.28)",
                borderTop:"3px solid #ff4e6a", borderRadius:"50%", animation:"spin 0.9s linear infinite" }}/>
              <div style={{ color:"rgba(255,255,255,0.38)", fontSize:12 }}>Загружается плеер...</div>
            </div>}
        <div style={{ position:"absolute", top:9, left:9, background:"rgba(0,0,0,0.7)",
          backdropFilter:"blur(6px)", borderRadius:7, padding:"3px 9px",
          fontSize:11, color:"rgba(255,255,255,0.78)", fontWeight:600 }}>
          {d.title} · Серия {ep}
        </div>
      </div>
      {/* EP NAV */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"9px 14px", background:"rgba(255,255,255,0.03)",
        borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
        <button onClick={()=>ep>1&&goEp(ep-1)}
          style={{ background:ep>1?"rgba(255,255,255,0.08)":"rgba(255,255,255,0.03)",
            border:"none", color:ep>1?"#fff":"rgba(255,255,255,0.2)",
            padding:"7px 14px", borderRadius:9, cursor:ep>1?"pointer":"default",
            fontSize:12, fontWeight:600 }}>← {ep>1?`Серия ${ep-1}`:"Нет"}</button>
        <span style={{ fontSize:12, color:"rgba(255,255,255,0.38)", fontWeight:600 }}>{ep} / {d.episodes}</span>
        <button onClick={()=>ep<d.episodes&&goEp(ep+1)}
          style={{ background:ep<d.episodes?"linear-gradient(90deg,#ff4e6a,#ff7e42)":"rgba(255,255,255,0.03)",
            border:"none", color:ep<d.episodes?"#fff":"rgba(255,255,255,0.2)",
            padding:"7px 14px", borderRadius:9, cursor:ep<d.episodes?"pointer":"default",
            fontSize:12, fontWeight:600,
            boxShadow:ep<d.episodes?"0 2px 10px rgba(255,78,106,0.35)":"none" }}>
          {ep<d.episodes?`Серия ${ep+1}`:"Нет"} →</button>
      </div>
      {/* EPISODES */}
      <div style={{ padding:"16px 16px 32px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:11 }}>
          <div style={{ width:3, height:17, background:"linear-gradient(180deg,#ff4e6a,#ff7e42)", borderRadius:2 }}/>
          <span style={{ fontSize:14, fontWeight:800, fontFamily:"'Bebas Neue',sans-serif",
            letterSpacing:"0.03em" }}>ВСЕ СЕРИИ</span>
          <span style={{ fontSize:12, color:"rgba(255,255,255,0.28)" }}>{d.episodes} серий</span>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
          {episodes.map(e=>(
            <div key={e.num} onClick={()=>goEp(e.num)}
              style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px",
                borderRadius:11, cursor:"pointer",
                background:ep===e.num?"linear-gradient(90deg,rgba(255,78,106,0.18),rgba(255,126,66,0.08))":"rgba(255,255,255,0.04)",
                border:ep===e.num?"1px solid rgba(255,78,106,0.35)":"1px solid rgba(255,255,255,0.05)",
                transition:"all 0.18s" }}
              onMouseEnter={ev=>{if(ep!==e.num)ev.currentTarget.style.background="rgba(255,255,255,0.07)";}}
              onMouseLeave={ev=>{if(ep!==e.num)ev.currentTarget.style.background="rgba(255,255,255,0.04)";}}>
              <div style={{ width:34, height:34, borderRadius:8, flexShrink:0,
                background:ep===e.num?"linear-gradient(135deg,#ff4e6a,#ff7e42)":e.watched?"rgba(255,255,255,0.07)":"rgba(255,255,255,0.05)",
                display:"flex", alignItems:"center", justifyContent:"center",
                color:ep===e.num?"#fff":e.watched?"rgba(255,255,255,0.4)":"rgba(255,255,255,0.6)",
                fontSize:11, fontWeight:700,
                boxShadow:ep===e.num?"0 3px 10px rgba(255,78,106,0.45)":"none" }}>
                {ep===e.num?<IPlay s={12}/>:e.watched?<ICheck/>:e.num}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:12, fontWeight:700,
                  color:ep===e.num?"#fff":"rgba(255,255,255,0.68)" }}>Серия {e.num}</div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.26)", marginTop:1 }}>
                  {e.dur}{e.watched&&ep!==e.num?" · просмотрено":""}</div>
              </div>
              {ep===e.num&&<div style={{ fontSize:10, color:"#ff4e6a", fontWeight:700,
                background:"rgba(255,78,106,0.12)", padding:"3px 7px", borderRadius:5 }}>СЕЙЧАС</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  SEARCH PAGE
// ═══════════════════════════════════════════════════════════
const POPULAR_QUERIES = ["Корейская романтика","Исторический Китай","Фэнтези","Медицинская драма","Онгоинг 2025","Короткие серии"];
const TRENDING = DRAMAS.filter(d=>d.tag==="ХИТ").slice(0,4);

function SearchPage({ onSelect }) {
  const [query,   setQuery]   = useState("");
  const [history, setHistory] = useState(["Дивный новый мир","Доктор Чха"]);
  const inputRef = useRef(null);

  useEffect(()=>{ inputRef.current?.focus(); },[]);

  const results = query.trim().length > 0
    ? DRAMAS.filter(d =>
        d.title.toLowerCase().includes(query.toLowerCase()) ||
        d.en.toLowerCase().includes(query.toLowerCase()) ||
        d.genre.some(g=>g.toLowerCase().includes(query.toLowerCase())) ||
        d.country.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleSelect = d => {
    if (query.trim()) {
      setHistory(h => [query, ...h.filter(x=>x!==query)].slice(0,6));
    }
    onSelect(d);
  };

  const fillQuery = q => { setQuery(q); inputRef.current?.focus(); };
  const clearHistory = () => setHistory([]);

  return (
    <div style={{ height:"100vh", overflowY:"auto", paddingBottom:70, background:"#0a0a18",
      fontFamily:"'Manrope',sans-serif", color:"#fff" }}>

      {/* Header */}
      <div style={{ position:"sticky", top:0, zIndex:50,
        background:"rgba(10,10,24,0.97)", backdropFilter:"blur(16px)",
        borderBottom:"1px solid rgba(255,255,255,0.06)", padding:"14px 16px 12px" }}>
        <div style={{ fontSize:21, fontFamily:"'Bebas Neue',sans-serif", marginBottom:12 }}>
          <span style={{ background:"linear-gradient(90deg,#ff4e6a,#ff7e42)",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>DORAMA</span>
          <span style={{ color:"#fff" }}>LIVE</span>
        </div>
        {/* Search input */}
        <div style={{ position:"relative" }}>
          <div style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)",
            color:"rgba(255,255,255,0.3)" }}><ISearch/></div>
          <input
            ref={inputRef}
            value={query}
            onChange={e=>setQuery(e.target.value)}
            placeholder="Поиск по названию, жанру, стране..."
            style={{ width:"100%", padding:"11px 40px 11px 42px",
              background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.1)",
              borderRadius:12, color:"#fff", fontSize:14, outline:"none",
              fontFamily:"'Manrope',sans-serif", boxSizing:"border-box",
              transition:"border 0.2s" }}
            onFocus={e=>e.target.style.borderColor="rgba(255,78,106,0.5)"}
            onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.1)"}
          />
          {query && (
            <button onClick={()=>setQuery("")}
              style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)",
                background:"rgba(255,255,255,0.12)", border:"none", color:"rgba(255,255,255,0.6)",
                width:22, height:22, borderRadius:"50%", cursor:"pointer",
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:13 }}>×</button>
          )}
        </div>
      </div>

      <div style={{ padding:"16px 16px 0" }}>

        {/* ── RESULTS ── */}
        {results.length > 0 && (
          <div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.3)", marginBottom:12 }}>
              Найдено: <span style={{ color:"rgba(255,255,255,0.6)", fontWeight:700 }}>{results.length}</span>
            </div>
            <div style={{ display:"flex", flexDirection:"column" }}>
              {results.map(d=><CardRow key={d.id} d={d} onClick={handleSelect}/>)}
            </div>
          </div>
        )}

        {/* ── NO RESULTS ── */}
        {query.trim().length > 0 && results.length === 0 && (
          <div style={{ textAlign:"center", padding:"50px 0" }}>
            <div style={{ fontSize:48, marginBottom:12 }}>😔</div>
            <div style={{ fontSize:15, color:"rgba(255,255,255,0.5)", marginBottom:6 }}>Ничего не найдено</div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.25)" }}>Попробуй другой запрос</div>
          </div>
        )}

        {/* ── EMPTY STATE ── */}
        {query.trim().length === 0 && (
          <>
            {/* History */}
            {history.length > 0 && (
              <div style={{ marginBottom:24 }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:"rgba(255,255,255,0.5)",
                    fontFamily:"'Bebas Neue',sans-serif", letterSpacing:"0.07em" }}>ИСТОРИЯ</div>
                  <button onClick={clearHistory} style={{ background:"none", border:"none",
                    color:"rgba(255,255,255,0.28)", fontSize:11, cursor:"pointer",
                    fontFamily:"'Manrope',sans-serif" }}>Очистить</button>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
                  {history.map(h=>(
                    <div key={h} onClick={()=>fillQuery(h)}
                      style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 12px",
                        borderRadius:10, cursor:"pointer", transition:"background 0.15s" }}
                      onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.05)"}
                      onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      <div style={{ fontSize:14, opacity:0.35 }}>🕐</div>
                      <span style={{ fontSize:13, color:"rgba(255,255,255,0.6)", flex:1 }}>{h}</span>
                      <button onClick={e=>{ e.stopPropagation(); setHistory(prev=>prev.filter(x=>x!==h)); }}
                        style={{ background:"none", border:"none", color:"rgba(255,255,255,0.2)",
                          fontSize:16, cursor:"pointer", lineHeight:1, padding:"0 4px" }}>×</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Popular queries */}
            <div style={{ marginBottom:24 }}>
              <div style={{ fontSize:13, fontWeight:700, color:"rgba(255,255,255,0.5)",
                fontFamily:"'Bebas Neue',sans-serif", letterSpacing:"0.07em", marginBottom:12 }}>
                ПОПУЛЯРНЫЕ ЗАПРОСЫ
              </div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {POPULAR_QUERIES.map(q=>(
                  <button key={q} onClick={()=>fillQuery(q)} style={{
                    padding:"7px 14px", borderRadius:20,
                    background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
                    color:"rgba(255,255,255,0.55)", fontSize:12, fontWeight:600,
                    cursor:"pointer", fontFamily:"'Manrope',sans-serif", transition:"all 0.15s" }}
                    onMouseEnter={e=>{ e.currentTarget.style.background="rgba(255,78,106,0.15)"; e.currentTarget.style.borderColor="rgba(255,78,106,0.35)"; e.currentTarget.style.color="#ff9eaa"; }}
                    onMouseLeave={e=>{ e.currentTarget.style.background="rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.1)"; e.currentTarget.style.color="rgba(255,255,255,0.55)"; }}>
                    🔍 {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Trending */}
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:"rgba(255,255,255,0.5)",
                fontFamily:"'Bebas Neue',sans-serif", letterSpacing:"0.07em", marginBottom:12 }}>
                🔥 СЕЙЧАС СМОТРЯТ
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:10 }}>
                {TRENDING.map((d,i)=>(
                  <div key={d.id} onClick={()=>handleSelect(d)}
                    style={{ borderRadius:13, overflow:"hidden", position:"relative",
                      height:110, cursor:"pointer", background:d.gradient, transition:"transform 0.2s" }}
                    onMouseEnter={e=>e.currentTarget.style.transform="scale(1.02)"}
                    onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
                    <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.45)" }}/>
                    <div style={{ position:"absolute", top:9, left:9,
                      background:"rgba(0,0,0,0.6)", borderRadius:6, padding:"2px 7px",
                      fontSize:12, color:"#FFD700", fontWeight:700,
                      display:"flex", alignItems:"center", gap:3 }}>
                      <span style={{ fontSize:11 }}>#{i+1}</span>
                      <IStar s={10}/>{d.rating}
                    </div>
                    <div style={{ position:"absolute", right:8, top:"50%",
                      transform:"translateY(-50%)", fontSize:30, opacity:0.3 }}>{d.emoji}</div>
                    <div style={{ position:"absolute", bottom:9, left:10, right:10 }}>
                      <div style={{ fontSize:12, fontWeight:800, color:"#fff",
                        fontFamily:"'Bebas Neue',sans-serif", lineHeight:1.2,
                        display:"-webkit-box", WebkitLineClamp:2,
                        WebkitBoxOrient:"vertical", overflow:"hidden" }}>{d.title}</div>
                      <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", marginTop:2 }}>{d.country}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  AUTH PAGE (login + register)
// ═══════════════════════════════════════════════════════════
function AuthPage({ onLogin, onClose }) {
  const [mode,   setMode]   = useState("login"); // login | register
  const [email,  setEmail]  = useState("");
  const [pass,   setPass]   = useState("");
  const [name,   setName]   = useState("");
  const [loading,setLoading]= useState(false);
  const [err,    setErr]    = useState("");
  const [showPass,setShowP] = useState(false);

  const submit = () => {
    setErr("");
    if (!email.trim()) { setErr("Введите email"); return; }
    if (!email.includes("@")) { setErr("Неверный email"); return; }
    if (pass.length < 6) { setErr("Пароль минимум 6 символов"); return; }
    if (mode==="register" && !name.trim()) { setErr("Введите имя"); return; }
    setLoading(true);
    setTimeout(()=>{
      setLoading(false);
      onLogin({ name: name||email.split("@")[0], email });
    }, 1200);
  };

  return (
    <div style={{ position:"fixed", inset:0, zIndex:200,
      background:"rgba(0,0,0,0.9)", backdropFilter:"blur(10px)",
      display:"flex", alignItems:"flex-end", justifyContent:"center",
      fontFamily:"'Manrope',sans-serif" }}>
      <div style={{ background:"linear-gradient(160deg,#131325 0%,#0e0e1e 100%)",
        borderRadius:"22px 22px 0 0", width:"100%", maxWidth:680,
        border:"1px solid rgba(255,255,255,0.08)",
        boxShadow:"0 -20px 60px rgba(0,0,0,0.7)",
        padding:"20px 22px 36px", maxHeight:"92vh", overflowY:"auto" }}>

        {/* Drag handle */}
        <div style={{ width:36, height:4, background:"rgba(255,255,255,0.15)",
          borderRadius:2, margin:"0 auto 20px" }}/>

        {/* Close */}
        <button onClick={onClose} style={{ position:"absolute", top:18, right:18,
          background:"rgba(255,255,255,0.08)", border:"none", color:"#fff",
          width:32, height:32, borderRadius:"50%", cursor:"pointer",
          display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>×</button>

        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:22 }}>
          <div style={{ fontSize:28, fontFamily:"'Bebas Neue',sans-serif", letterSpacing:"0.03em" }}>
            <span style={{ background:"linear-gradient(90deg,#ff4e6a,#ff7e42)",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>DORAMA</span>
            <span style={{ color:"#fff" }}>LIVE</span>
          </div>
          <div style={{ color:"rgba(255,255,255,0.35)", fontSize:12, marginTop:4 }}>
            {mode==="login" ? "Добро пожаловать!" : "Создай аккаунт бесплатно"}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", background:"rgba(255,255,255,0.05)",
          borderRadius:12, padding:4, marginBottom:22 }}>
          {["login","register"].map(m=>(
            <button key={m} onClick={()=>{setMode(m);setErr("");}}
              style={{ flex:1, padding:"9px", borderRadius:9, border:"none",
                background: mode===m?"linear-gradient(90deg,#ff4e6a,#ff7e42)":"transparent",
                color: mode===m?"#fff":"rgba(255,255,255,0.4)",
                fontSize:13, fontWeight:700, cursor:"pointer",
                fontFamily:"'Manrope',sans-serif", transition:"all 0.2s",
                boxShadow: mode===m?"0 2px 12px rgba(255,78,106,0.35)":"none" }}>
              {m==="login" ? "Войти" : "Регистрация"}
            </button>
          ))}
        </div>

        {/* Fields */}
        <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:16 }}>
          {mode==="register" && (
            <div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginBottom:6,
                fontWeight:600 }}>ИМЯ</div>
              <input value={name} onChange={e=>setName(e.target.value)}
                placeholder="Как тебя зовут?"
                style={{ width:"100%", padding:"12px 14px",
                  background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
                  borderRadius:11, color:"#fff", fontSize:14, outline:"none",
                  fontFamily:"'Manrope',sans-serif", boxSizing:"border-box" }}
                onFocus={e=>e.target.style.borderColor="rgba(255,78,106,0.5)"}
                onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.1)"}/>
            </div>
          )}
          <div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginBottom:6, fontWeight:600 }}>EMAIL</div>
            <input value={email} onChange={e=>setEmail(e.target.value)}
              placeholder="example@email.com" type="email"
              style={{ width:"100%", padding:"12px 14px",
                background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
                borderRadius:11, color:"#fff", fontSize:14, outline:"none",
                fontFamily:"'Manrope',sans-serif", boxSizing:"border-box" }}
              onFocus={e=>e.target.style.borderColor="rgba(255,78,106,0.5)"}
              onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.1)"}/>
          </div>
          <div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginBottom:6, fontWeight:600 }}>ПАРОЛЬ</div>
            <div style={{ position:"relative" }}>
              <input value={pass} onChange={e=>setPass(e.target.value)}
                placeholder={mode==="register"?"Минимум 6 символов":"Введи пароль"}
                type={showPass?"text":"password"}
                style={{ width:"100%", padding:"12px 44px 12px 14px",
                  background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
                  borderRadius:11, color:"#fff", fontSize:14, outline:"none",
                  fontFamily:"'Manrope',sans-serif", boxSizing:"border-box" }}
                onFocus={e=>e.target.style.borderColor="rgba(255,78,106,0.5)"}
                onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.1)"}
                onKeyDown={e=>e.key==="Enter"&&submit()}/>
              <button onClick={()=>setShowP(s=>!s)}
                style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)",
                  background:"none", border:"none", color:"rgba(255,255,255,0.35)",
                  cursor:"pointer", fontSize:16 }}>{showPass?"🙈":"👁"}</button>
            </div>
          </div>
        </div>

        {/* Error */}
        {err && <div style={{ background:"rgba(255,78,106,0.12)", border:"1px solid rgba(255,78,106,0.3)",
          borderRadius:9, padding:"9px 13px", fontSize:12, color:"#ff9eaa",
          marginBottom:14 }}>⚠️ {err}</div>}

        {/* Submit */}
        <button onClick={submit} disabled={loading}
          style={{ width:"100%", padding:"14px",
            background: loading?"rgba(255,255,255,0.1)":"linear-gradient(90deg,#ff4e6a,#ff7e42)",
            border:"none", color:"#fff", borderRadius:12, fontSize:15, fontWeight:700,
            cursor: loading?"default":"pointer",
            fontFamily:"'Bebas Neue',sans-serif", letterSpacing:"0.05em",
            boxShadow: loading?"none":"0 4px 20px rgba(255,78,106,0.4)",
            display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
          {loading
            ? <><div style={{ width:16, height:16, border:"2px solid rgba(255,255,255,0.3)",
                borderTop:"2px solid #fff", borderRadius:"50%", animation:"spin 0.8s linear infinite" }}/> Загрузка...</>
            : mode==="login" ? "ВОЙТИ" : "СОЗДАТЬ АККАУНТ"}
        </button>

        {mode==="login" && (
          <div style={{ textAlign:"center", marginTop:14 }}>
            <span style={{ color:"#ff4e6a", fontSize:12, cursor:"pointer", fontWeight:600 }}>
              Забыл пароль?
            </span>
          </div>
        )}

        <div style={{ textAlign:"center", marginTop:18,
          color:"rgba(255,255,255,0.2)", fontSize:11, lineHeight:1.7 }}>
          Регистрируясь, ты соглашаешься с{" "}
          <span style={{ color:"rgba(255,255,255,0.4)", cursor:"pointer" }}>правилами сервиса</span>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  FAVORITES PAGE
// ═══════════════════════════════════════════════════════════
function FavPage({ user, favIds, onSelect, onLogin }) {
  if (!user) {
    return (
      <div style={{ height:"100vh", display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center", paddingBottom:70,
        fontFamily:"'Manrope',sans-serif", color:"#fff", padding:"0 24px 70px",
        textAlign:"center" }}>
        <div style={{ fontSize:64, marginBottom:20 }}>❤️</div>
        <div style={{ fontSize:22, fontWeight:800, fontFamily:"'Bebas Neue',sans-serif",
          letterSpacing:"0.03em", marginBottom:10 }}>ИЗБРАННОЕ</div>
        <div style={{ color:"rgba(255,255,255,0.4)", fontSize:13, lineHeight:1.7, marginBottom:28 }}>
          Войди в аккаунт, чтобы сохранять дорамы и следить за новыми сериями
        </div>
        <button onClick={onLogin} style={{ padding:"12px 32px",
          background:"linear-gradient(90deg,#ff4e6a,#ff7e42)", border:"none",
          color:"#fff", borderRadius:12, fontSize:14, fontWeight:700, cursor:"pointer",
          fontFamily:"'Bebas Neue',sans-serif", letterSpacing:"0.05em",
          boxShadow:"0 4px 20px rgba(255,78,106,0.4)" }}>
          ВОЙТИ / ЗАРЕГИСТРИРОВАТЬСЯ
        </button>
      </div>
    );
  }

  const favDramas = DRAMAS.filter(d=>favIds.includes(d.id));

  return (
    <div style={{ height:"100vh", overflowY:"auto", paddingBottom:70,
      fontFamily:"'Manrope',sans-serif", color:"#fff" }}>
      {/* Header */}
      <div style={{ position:"sticky", top:0, zIndex:50,
        background:"rgba(10,10,24,0.97)", backdropFilter:"blur(16px)",
        borderBottom:"1px solid rgba(255,255,255,0.06)", padding:"14px 16px 14px" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <div style={{ fontSize:21, fontFamily:"'Bebas Neue',sans-serif" }}>
              <span style={{ background:"linear-gradient(90deg,#ff4e6a,#ff7e42)",
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>DORAMA</span>
              <span style={{ color:"#fff" }}>LIVE</span>
            </div>
          </div>
          {/* User avatar */}
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:13, fontWeight:700, color:"#fff" }}>{user.name}</div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)" }}>{user.email}</div>
            </div>
            <div style={{ width:38, height:38, borderRadius:"50%",
              background:"linear-gradient(135deg,#ff4e6a,#ff7e42)",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:16, fontWeight:700, color:"#fff" }}>
              {user.name[0].toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding:"18px 16px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
          <div style={{ width:3, height:18, background:"linear-gradient(180deg,#ff4e6a,#ff7e42)", borderRadius:2 }}/>
          <span style={{ fontSize:16, fontWeight:800, fontFamily:"'Bebas Neue',sans-serif",
            letterSpacing:"0.03em" }}>МОЁ ИЗБРАННОЕ</span>
          <span style={{ fontSize:12, color:"rgba(255,255,255,0.3)" }}>{favDramas.length} дорам</span>
        </div>

        {favDramas.length === 0 ? (
          <div style={{ textAlign:"center", padding:"50px 0" }}>
            <div style={{ fontSize:48, marginBottom:12 }}>🔖</div>
            <div style={{ fontSize:15, color:"rgba(255,255,255,0.4)", marginBottom:8 }}>Список пуст</div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.22)" }}>
              Нажми 🔖 на странице дорамы, чтобы добавить в избранное
            </div>
          </div>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(120px,1fr))", gap:10 }}>
            {favDramas.map(d=><Card key={d.id} d={d} onClick={onSelect}/>)}
          </div>
        )}

        {/* Demo: show all dramas as "could be saved" */}
        {favDramas.length === 0 && (
          <div style={{ marginTop:28 }}>
            <div style={{ fontSize:13, color:"rgba(255,255,255,0.28)", marginBottom:12, textAlign:"center" }}>
              Популярные дорамы которые тебе могут понравиться
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(120px,1fr))", gap:10 }}>
              {DRAMAS.slice(0,6).map(d=><Card key={d.id} d={d} onClick={onSelect}/>)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  APP ROOT
// ═══════════════════════════════════════════════════════════
export default function App() {
  const [page,   setPage]   = useState("home");
  const [drama,  setDrama]  = useState(null);
  const [user,   setUser]   = useState(null);
  const [favIds, setFavIds] = useState([]);
  const [showAuth, setShowAuth] = useState(false);
  const [catalogCountry, setCatalogCountry] = useState("");

  const openDrama = d => { setDrama(d); setPage("watch"); };
  const goBack    = () => { setPage("home"); setDrama(null); };
  const login     = u  => { setUser(u); setShowAuth(false); };
  const logout    = () => setUser(null);
  const toggleFav = id => setFavIds(f=>f.includes(id)?f.filter(x=>x!==id):[...f,id]);

  const handleNav = (target, params={}) => {
    if (target==="catalog") {
      setCatalogCountry(params.country||"");
      setPage("catalog");
    } else if (target==="search") {
      setPage("search");
    } else if (target==="fav") {
      setPage("fav");
    } else {
      setPage("home");
    }
    setDrama(null);
  };

  const currentPage = drama ? "watch" : page;

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        body{background:#0a0a18;}
        ::-webkit-scrollbar{display:none;}
        input::placeholder{color:rgba(255,255,255,0.26);}
        @keyframes spin{to{transform:rotate(360deg);}}
        @keyframes slideUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}
      `}</style>
      <div style={{ background:"#0a0a18", minHeight:"100vh", maxWidth:680, margin:"0 auto" }}>
        {currentPage==="home"    && <HomePage    onSelect={openDrama} onNav={handleNav} user={user} onLoginClick={()=>setShowAuth(true)}/>}
        {currentPage==="catalog" && <CatalogPage onSelect={openDrama} initCountry={catalogCountry}/>}
        {currentPage==="search"  && <SearchPage  onSelect={openDrama}/>}
        {currentPage==="fav"     && <FavPage     user={user} favIds={favIds} onSelect={openDrama} onLogin={()=>setShowAuth(true)}/>}
        {currentPage==="watch"   && drama &&
          <WatchPage drama={drama} onBack={goBack} isFav={favIds.includes(drama.id)} onToggleFav={()=>toggleFav(drama.id)}/>}
        {currentPage!=="watch"   && <BottomNav page={page} onNav={handleNav}/>}
        {showAuth && <AuthPage onLogin={login} onClose={()=>setShowAuth(false)}/>}
      </div>
    </>
  );
}
