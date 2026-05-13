import { useState, useEffect, useRef, useCallback } from “react”;

// ═══════════════════════════════════════════════════════════
//  TMDB CONFIG
// ═══════════════════════════════════════════════════════════
const KEY  = (typeof process!==“undefined” && process.env?.REACT_APP_TMDB_KEY) || “2633f71a568cf4920d47195da4b0b3e0”;
const BASE = “https://api.themoviedb.org/3”;
const IMG  = “https://image.tmdb.org/t/p/w500”;
const IMGB = “https://image.tmdb.org/t/p/w1280”;

// Drama-producing countries
const DRAMA_COUNTRIES = { “Корея”:“KR”, “Китай”:“CN”, “Япония”:“JP”, “Тайвань”:“TW”, “Таиланд”:“TH” };
const GENRES_MAP = { “Все”:null, “Романтика”:10749, “Драма”:18, “Комедия”:35, “Фэнтези”:10765, “Криминал”:80, “Исторический”:36 };

async function tmdb(path, params={}) {
const q = new URLSearchParams({ api_key:KEY, language:“ru-RU”, …params });
const r = await fetch(`${BASE}${path}?${q}`);
return r.json();
}

// Fetch popular dramas by country
async function fetchDramas(country=“KR”, genre=null, page=1) {
const params = {
with_original_language: country.toLowerCase(),
sort_by: “popularity.desc”,
“vote_count.gte”: 50,
page,
};
if (genre) params.with_genres = genre;
const data = await tmdb(”/discover/tv”, params);
return data;
}

async function searchDramas(query, page=1) {
return tmdb(”/search/tv”, { query, page });
}

async function fetchDetails(id) {
return tmdb(`/tv/${id}`, { append_to_response:“credits,similar” });
}

async function fetchTrending() {
return tmdb(”/trending/tv/week”);
}

// Format TMDB show to our format
function formatShow(show) {
return {
id: show.id,
title: show.name || show.original_name,
en: show.original_name,
rating: show.vote_average ? (show.vote_average/2).toFixed(1) : “?”,
year: show.first_air_date ? show.first_air_date.slice(0,4) : “?”,
country: show.origin_country?.[0] || “?”,
episodes: show.number_of_episodes || “?”,
genre: show.genre_ids || [],
poster: show.poster_path ? IMG+show.poster_path : null,
backdrop: show.backdrop_path ? IMGB+show.backdrop_path : null,
desc: show.overview || “Описание отсутствует.”,
tag: show.vote_average>=8?“ХИТ”: show.first_air_date>=“2025”?“НОВИНКА”:””,
tagColor: show.vote_average>=8?”#ff4e6a”:”#4e9fff”,
};
}

// ═══════════════════════════════════════════════════════════
//  ICONS
// ═══════════════════════════════════════════════════════════
const IPlay   = ({s=20}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><polygon points="6,3 20,12 6,21"/></svg>;
const IStar   = ({s=12}) => <svg width={s} height={s} viewBox="0 0 12 12" fill="#FFD700"><polygon points="6,1 7.5,4.5 11,5 8.5,7.5 9,11 6,9.5 3,11 3.5,7.5 1,5 4.5,4.5"/></svg>;
const IBack   = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15,18 9,12 15,6"/></svg>;
const ISearch = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>;
const IBm     = ({on}) => <svg width=“18” height=“18” viewBox=“0 0 24 24” fill={on?”#ff4e6a”:“none”} stroke={on?”#ff4e6a”:“currentColor”} strokeWidth=“2”><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>;
const IShare  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>;
const ICheck  = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20,6 9,17 4,12"/></svg>;
const ICR     = ({s=15}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9,18 15,12 9,6"/></svg>;
const ICL     = ({s=15}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15,18 9,12 15,6"/></svg>;
const IFilter = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3"/></svg>;
const IGrid   = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>;
const IList   = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>;

// ═══════════════════════════════════════════════════════════
//  SHARED COMPONENTS
// ═══════════════════════════════════════════════════════════
function PosterImg({ show, style={}, fontSize=36 }) {
const [err, setErr] = useState(false);
if (show?.poster && !err) {
return <img src={show.poster} alt={show.title}
style={{ width:“100%”, height:“100%”, objectFit:“cover”, display:“block”, …style }}
onError={()=>setErr(true)}/>;
}
// Fallback gradient
const colors = [”#1a0533,#c94b8a”,”#0a1628,#c8873a”,”#0d2b1a,#2ecc71”,”#0a0a2e,#4a4acf”,
“#1a0a00,#cf6b1a”,”#001a1a,#00bcd4”,”#1a0000,#cf1a1a”,”#0a1a0a,#2d8a5e”,”#1a0a1a,#8a2d8a”];
const idx = (show?.id||0) % colors.length;
const emojis = [“🌸”,“🏯”,“💍”,“⭐”,“🐉”,“🏥”,“🧵”,“🌙”,“⚔️”,“⚖️”,“🌿”,“✨”];
return (
<div style={{ width:“100%”, height:“100%”, display:“flex”, alignItems:“center”,
justifyContent:“center”, position:“relative”, overflow:“hidden”,
background:`linear-gradient(145deg,${colors[idx]})`, …style }}>
<div style={{ fontSize, filter:“drop-shadow(0 4px 12px rgba(0,0,0,0.5))” }}>
{emojis[(show?.id||0)%emojis.length]}
</div>
</div>
);
}

function Tag({ label, color }) {
if (!label) return null;
return <div style={{ display:“inline-block”, background:color, color:”#fff”,
fontSize:9, fontWeight:800, padding:“2px 8px”, borderRadius:5,
fontFamily:”‘Bebas Neue’,sans-serif”, letterSpacing:“0.08em” }}>{label}</div>;
}

function Spinner() {
return <div style={{ display:“flex”, alignItems:“center”, justifyContent:“center”,
padding:“40px 0” }}>
<div style={{ width:36, height:36, border:“3px solid rgba(255,78,106,0.2)”,
borderTop:“3px solid #ff4e6a”, borderRadius:“50%”, animation:“spin 0.8s linear infinite” }}/>

  </div>;
}

function BottomNav({ page, onNav }) {
const items = [
{ id:“home”,    icon:“🏠”, label:“Главная”  },
{ id:“catalog”, icon:“🎬”, label:“Каталог”  },
{ id:“search”,  icon:“🔍”, label:“Поиск”    },
{ id:“fav”,     icon:“❤️”, label:“Избранное”},
];
return (
<div className=“bottom-nav-bar” style={{ position:“fixed”, bottom:0, left:“50%”,
transform:“translateX(-50%)”, width:“100%”, maxWidth:1400,
background:“rgba(8,8,20,0.97)”, backdropFilter:“blur(16px)”,
borderTop:“1px solid rgba(255,255,255,0.07)”,
display:“flex”, justifyContent:“space-around”, padding:“8px 0 14px”, zIndex:80 }}>
{items.map(it=>(
<div key={it.id} onClick={()=>onNav(it.id)}
style={{ display:“flex”, flexDirection:“column”, alignItems:“center”, gap:3,
cursor:“pointer”, opacity:page===it.id?1:0.4, transition:“opacity 0.2s” }}>
<div style={{ fontSize:20 }}>{it.icon}</div>
<div style={{ fontSize:9, color:page===it.id?”#ff4e6a”:”#fff”,
fontWeight:page===it.id?700:500 }}>{it.label}</div>
</div>
))}
</div>
);
}

// ═══════════════════════════════════════════════════════════
//  CARD
// ═══════════════════════════════════════════════════════════
function Card({ show, onClick }) {
const [hov, setHov] = useState(false);
return (
<div onClick={()=>onClick(show)}
onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
style={{ cursor:“pointer”, borderRadius:13, overflow:“hidden”, position:“relative”,
aspectRatio:“2/3”, flexShrink:0,
boxShadow:hov?“0 14px 36px rgba(0,0,0,0.6)”:“0 4px 14px rgba(0,0,0,0.35)”,
transform:hov?“translateY(-5px) scale(1.02)”:“none”,
transition:“all 0.22s cubic-bezier(.34,1.56,.64,1)” }}>
<PosterImg show={show} fontSize={30}/>
<div style={{ position:“absolute”, inset:0,
background:“linear-gradient(to top,rgba(0,0,0,0.96) 0%,rgba(0,0,0,0.3) 45%,transparent 100%)” }}/>
<div style={{ position:“absolute”, top:7, left:7 }}><Tag label={show.tag} color={show.tagColor}/></div>
<div style={{ position:“absolute”, top:7, right:7, background:“rgba(0,0,0,0.72)”,
borderRadius:6, padding:“2px 6px”, display:“flex”, alignItems:“center”, gap:3,
fontSize:10, color:”#FFD700”, fontWeight:700 }}>
<IStar s={9}/>{show.rating}
</div>
{hov&&<div style={{ position:“absolute”, inset:0, display:“flex”,
alignItems:“center”, justifyContent:“center” }}>
<div style={{ width:44, height:44, borderRadius:“50%”, background:“rgba(255,78,106,0.9)”,
display:“flex”, alignItems:“center”, justifyContent:“center”, color:”#fff”,
boxShadow:“0 0 24px rgba(255,78,106,0.7)” }}><IPlay s={17}/></div>
</div>}
<div style={{ position:“absolute”, bottom:0, left:0, right:0, padding:“9px 8px 8px” }}>
<div style={{ color:”#fff”, fontSize:10, fontWeight:700, lineHeight:1.3,
fontFamily:”‘Bebas Neue’,sans-serif”,
display:”-webkit-box”, WebkitLineClamp:2, WebkitBoxOrient:“vertical”, overflow:“hidden” }}>
{show.title}
</div>
<div style={{ color:“rgba(255,255,255,0.38)”, fontSize:9, marginTop:1,
overflow:“hidden”, textOverflow:“ellipsis”, whiteSpace:“nowrap” }}>{show.en}</div>
</div>
</div>
);
}

// Row card for list view
function CardRow({ show, onClick }) {
return (
<div onClick={()=>onClick(show)}
style={{ display:“flex”, gap:12, padding:“11px 0”,
borderBottom:“1px solid rgba(255,255,255,0.05)”, cursor:“pointer” }}>
<div style={{ width:70, height:98, borderRadius:10, overflow:“hidden”, flexShrink:0 }}>
<PosterImg show={show} fontSize={24}/>
</div>
<div style={{ flex:1, minWidth:0, paddingTop:2 }}>
<div style={{ marginBottom:4 }}><Tag label={show.tag} color={show.tagColor}/></div>
<div style={{ fontSize:14, fontWeight:800, color:”#fff”, lineHeight:1.2,
fontFamily:”‘Bebas Neue’,sans-serif”, marginBottom:3 }}>{show.title}</div>
<div style={{ fontSize:11, color:“rgba(255,255,255,0.35)”, marginBottom:6 }}>{show.en}</div>
<div style={{ display:“flex”, gap:8, alignItems:“center” }}>
<div style={{ display:“flex”, alignItems:“center”, gap:3 }}>
<IStar s={11}/><span style={{ color:”#FFD700”, fontSize:12, fontWeight:700 }}>{show.rating}</span>
</div>
<span style={{ color:“rgba(255,255,255,0.35)”, fontSize:11 }}>{show.year}</span>
</div>
</div>
<div style={{ display:“flex”, alignItems:“center”, color:“rgba(255,255,255,0.2)”, flexShrink:0 }}>
<ICR s={16}/>
</div>
</div>
);
}

// Horizontal scroll section
function Section({ title, icon, shows, onSelect, loading }) {
const ref = useRef(null);
return (
<div style={{ marginBottom:30 }}>
<div className=“page-wrap” style={{ display:“flex”, alignItems:“center”,
justifyContent:“space-between”, marginBottom:11 }}>
<div style={{ display:“flex”, alignItems:“center”, gap:7 }}>
<span>{icon}</span>
<span style={{ fontSize:16, fontWeight:800, color:”#fff”,
fontFamily:”‘Bebas Neue’,sans-serif”, letterSpacing:“0.03em” }}>{title}</span>
</div>
<div style={{ display:“flex”, alignItems:“center”, gap:2,
color:”#ff4e6a”, fontSize:12, cursor:“pointer”, fontWeight:600 }}>
Все <ICR s={13}/>
</div>
</div>
{loading ? <Spinner/> : (
<div style={{ position:“relative” }}>
<div ref={ref} className=“section-cards” style={{ padding:“4px 18px 6px” }}>
{shows.map(s=><div key={s.id} className="card-item"><Card show={s} onClick={onSelect}/></div>)}
</div>
<button onClick={()=>ref.current&&(ref.current.scrollLeft-=300)}
style={{ position:“absolute”, left:4, top:“37%”, transform:“translateY(-50%)”,
background:“rgba(10,10,24,0.9)”, border:“1px solid rgba(255,255,255,0.1)”,
color:”#fff”, width:30, height:30, borderRadius:“50%”, cursor:“pointer”,
display:“flex”, alignItems:“center”, justifyContent:“center” }}><ICL s={13}/></button>
<button onClick={()=>ref.current&&(ref.current.scrollLeft+=300)}
style={{ position:“absolute”, right:4, top:“37%”, transform:“translateY(-50%)”,
background:“rgba(10,10,24,0.9)”, border:“1px solid rgba(255,255,255,0.1)”,
color:”#fff”, width:30, height:30, borderRadius:“50%”, cursor:“pointer”,
display:“flex”, alignItems:“center”, justifyContent:“center” }}><ICR s={13}/></button>
</div>
)}
</div>
);
}

// ═══════════════════════════════════════════════════════════
//  HOME PAGE
// ═══════════════════════════════════════════════════════════
function HomePage({ onSelect, onNav, user, onLoginClick }) {
const [trending, setTrending]   = useState([]);
const [korean,   setKorean]     = useState([]);
const [chinese,  setChinese]    = useState([]);
const [japanese, setJapanese]   = useState([]);
const [loading,  setLoading]    = useState(true);
const [heroIdx,  setHeroIdx]    = useState(0);
const scrollRef = useRef(null);
const [scrolled, setScrolled]   = useState(false);

useEffect(()=>{
const el = scrollRef.current;
if (!el) return;
const fn=()=>setScrolled(el.scrollTop>50);
el.addEventListener(“scroll”,fn);
return()=>el.removeEventListener(“scroll”,fn);
},[]);

useEffect(()=>{
Promise.all([
fetchTrending(),
fetchDramas(“ko”),
fetchDramas(“zh”),
fetchDramas(“ja”),
]).then(([tr,kr,cn,jp])=>{
setTrending((tr.results||[]).map(formatShow));
setKorean((kr.results||[]).map(formatShow));
setChinese((cn.results||[]).map(formatShow));
setJapanese((jp.results||[]).map(formatShow));
setLoading(false);
}).catch(()=>setLoading(false));
},[]);

useEffect(()=>{
if (trending.length===0) return;
const t = setInterval(()=>setHeroIdx(i=>(i+1)%Math.min(trending.length,5)),5000);
return()=>clearInterval(t);
},[trending.length]);

const hero = trending[heroIdx];

return (
<div ref={scrollRef} style={{ height:“100vh”, overflowY:“auto”, paddingBottom:70 }}>
{/* NAV */}
<nav style={{ position:“sticky”, top:0, zIndex:50, width:“100%”,
background:scrolled?“rgba(10,10,24,0.97)”:“transparent”,
backdropFilter:scrolled?“blur(16px)”:“none”,
borderBottom:scrolled?“1px solid rgba(255,255,255,0.06)”:“none”,
transition:“all 0.3s”, height:58 }}>
<div className="nav-wrap">
<div style={{ fontSize:21, fontFamily:”‘Bebas Neue’,sans-serif” }}>
<span style={{ background:“linear-gradient(90deg,#ff4e6a,#ff7e42)”,
WebkitBackgroundClip:“text”, WebkitTextFillColor:“transparent” }}>DORAMA</span>
<span style={{ color:”#fff” }}>LIVE</span>
</div>
<div className="desktop-nav">
{[“Главная”,“Каталог”,“Новинки”,“Топ”].map(l=>(
<span key={l} onClick={()=>l===“Каталог”&&onNav(“catalog”)}
style={{ color:“rgba(255,255,255,0.55)”, fontSize:13, fontWeight:600, cursor:“pointer” }}
onMouseEnter={e=>e.target.style.color=”#fff”}
onMouseLeave={e=>e.target.style.color=“rgba(255,255,255,0.55)”}>{l}</span>
))}
</div>
<div>
{user
? <div style={{ width:34, height:34, borderRadius:“50%”,
background:“linear-gradient(135deg,#ff4e6a,#ff7e42)”,
display:“flex”, alignItems:“center”, justifyContent:“center”,
fontSize:14, fontWeight:700, color:”#fff”, cursor:“pointer” }}
onClick={()=>onNav(“fav”)}>{user.name[0].toUpperCase()}</div>
: <button onClick={onLoginClick} style={{ background:“linear-gradient(90deg,#ff4e6a,#ff7e42)”,
border:“none”, color:”#fff”, padding:“7px 18px”, borderRadius:8,
fontSize:12, fontWeight:700, cursor:“pointer”,
fontFamily:”‘Bebas Neue’,sans-serif”, letterSpacing:“0.05em” }}>ВОЙТИ</button>}
</div>
</div>
</nav>

```
  {/* HERO BANNER */}
  <div style={{ position:"relative", height:420, overflow:"hidden",
    borderRadius:"0 0 24px 24px", marginTop:-58 }}>
    {hero?.backdrop
      ? <img src={hero.backdrop} alt={hero.title}
          style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover",
            transition:"opacity 0.8s" }}/>
      : hero
        ? <PosterImg show={hero} style={{ position:"absolute", inset:0 }} fontSize={120}/>
        : <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg,#1a0533,#0a1628)" }}/>}
    <div style={{ position:"absolute", inset:0,
      background:"linear-gradient(135deg,rgba(0,0,0,0.78) 0%,rgba(0,0,0,0.1) 60%,rgba(0,0,0,0.5) 100%)" }}/>
    {hero && (
      <div style={{ position:"absolute", bottom:32, left:20, right:20 }}>
        <div style={{ marginBottom:7 }}><Tag label={hero.tag} color={hero.tagColor}/></div>
        <div style={{ fontSize:32, fontWeight:800, color:"#fff", lineHeight:1.1,
          fontFamily:"'Bebas Neue',sans-serif", letterSpacing:"0.02em", marginBottom:7,
          textShadow:"0 2px 20px rgba(0,0,0,0.5)",
          display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
          {hero.title}
        </div>
        <div style={{ color:"rgba(255,255,255,0.6)", fontSize:12, lineHeight:1.6, marginBottom:14,
          maxWidth:380, display:"-webkit-box", WebkitLineClamp:2,
          WebkitBoxOrient:"vertical", overflow:"hidden" }}>{hero.desc}</div>
        <div style={{ display:"flex", gap:9, alignItems:"center", flexWrap:"wrap" }}>
          <button onClick={()=>onSelect(hero)} style={{ padding:"9px 20px",
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
            <IStar s={12}/><span style={{ color:"#FFD700", fontWeight:700, fontSize:12 }}>{hero.rating}</span>
            <span style={{ color:"rgba(255,255,255,0.45)", fontSize:11 }}>• {hero.year}</span>
          </div>
        </div>
      </div>
    )}
    {/* Dots */}
    <div style={{ position:"absolute", bottom:12, right:16, display:"flex", gap:5 }}>
      {trending.slice(0,5).map((_,i)=>(
        <div key={i} onClick={()=>setHeroIdx(i)}
          style={{ width:i===heroIdx?16:5, height:5, borderRadius:3, cursor:"pointer",
            transition:"all 0.3s", background:i===heroIdx?"#ff4e6a":"rgba(255,255,255,0.3)" }}/>
      ))}
    </div>
  </div>

  <div style={{ height:18 }}/>

  {loading ? <Spinner/> : (
    <>
      <Section title="ПОПУЛЯРНОЕ"  icon="🔥" shows={trending.slice(0,20)} onSelect={onSelect} loading={false}/>
      <Section title="КОРЕЙСКИЕ"   icon="🇰🇷" shows={korean.slice(0,20)}   onSelect={onSelect} loading={false}/>
      <Section title="КИТАЙСКИЕ"   icon="🇨🇳" shows={chinese.slice(0,20)}  onSelect={onSelect} loading={false}/>
      <Section title="ЯПОНСКИЕ"    icon="🇯🇵" shows={japanese.slice(0,20)} onSelect={onSelect} loading={false}/>
    </>
  )}

  {/* Countries */}
  <div className="page-wrap" style={{ paddingBottom:32 }}>
    <div style={{ fontSize:16, fontWeight:800, color:"#fff",
      fontFamily:"'Bebas Neue',sans-serif", marginBottom:11 }}>🌏 ПО СТРАНАМ</div>
    <div className="countries-grid">
      {Object.entries(DRAMA_COUNTRIES).map(([name])=>(
        <div key={name} onClick={()=>onNav("catalog", {country:name})}
          style={{ borderRadius:13, overflow:"hidden", position:"relative",
            height:86, cursor:"pointer",
            background:`linear-gradient(135deg,${name==="Корея"?"#1a0533,#c94b8a":name==="Китай"?"#1a0a00,#cf6b1a":name==="Япония"?"#1a0000,#cf1a1a":name==="Тайвань"?"#0a1a0a,#2d8a5e":"#0a0520,#4a1a8a"})`,
            transition:"transform 0.2s" }}
          onMouseEnter={e=>e.currentTarget.style.transform="scale(1.02)"}
          onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
          <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.4)" }}/>
          <div style={{ position:"absolute", bottom:10, left:12 }}>
            <div style={{ fontSize:14, fontWeight:800, color:"#fff",
              fontFamily:"'Bebas Neue',sans-serif" }}>{name}</div>
          </div>
          <div style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)",
            fontSize:28 }}>
            {name==="Корея"?"🇰🇷":name==="Китай"?"🇨🇳":name==="Япония"?"🇯🇵":name==="Тайвань"?"🇹🇼":"🇹🇭"}
          </div>
        </div>
      ))}
    </div>
  </div>

  {/* TMDB attribution */}
  <div style={{ textAlign:"center", padding:"10px 0 20px",
    color:"rgba(255,255,255,0.2)", fontSize:10 }}>
    Данные предоставлены <span style={{ color:"rgba(255,255,255,0.4)" }}>TMDB</span>
  </div>
</div>
```

);
}

// ═══════════════════════════════════════════════════════════
//  CATALOG PAGE
// ═══════════════════════════════════════════════════════════
function CatalogPage({ onSelect, initCountry=”” }) {
const [shows,   setShows]   = useState([]);
const [loading, setLoading] = useState(true);
const [page,    setPage]    = useState(1);
const [total,   setTotal]   = useState(0);
const [country, setCountry] = useState(initCountry||“Корея”);
const [genre,   setGenre]   = useState(“Все”);
const [view,    setView]    = useState(“grid”);
const [showF,   setShowF]   = useState(false);

const load = useCallback(async (c, g, p, reset=false) => {
setLoading(true);
const langMap = {“Корея”:“ko”,“Китай”:“zh”,“Япония”:“ja”,“Тайвань”:“zh”,“Таиланд”:“th”};
const data = await fetchDramas(langMap[c]||“ko”, GENRES_MAP[g]||null, p);
const formatted = (data.results||[]).map(formatShow);
setShows(prev => reset ? formatted : […prev, …formatted]);
setTotal(data.total_results||0);
setLoading(false);
}, []);

useEffect(()=>{ setPage(1); load(country, genre, 1, true); }, [country, genre]);

const loadMore = () => {
const next = page+1;
setPage(next);
load(country, genre, next, false);
};

return (
<div style={{ height:“100vh”, overflowY:“auto”, paddingBottom:70 }}>
{/* Header */}
<div style={{ position:“sticky”, top:0, zIndex:50,
background:“rgba(10,10,24,0.97)”, backdropFilter:“blur(16px)”,
borderBottom:“1px solid rgba(255,255,255,0.06)”, padding:“12px 16px 0” }}>
<div style={{ display:“flex”, alignItems:“center”, justifyContent:“space-between”, marginBottom:12 }}>
<div style={{ fontSize:21, fontFamily:”‘Bebas Neue’,sans-serif” }}>
<span style={{ background:“linear-gradient(90deg,#ff4e6a,#ff7e42)”,
WebkitBackgroundClip:“text”, WebkitTextFillColor:“transparent” }}>DORAMA</span>
<span style={{ color:”#fff” }}>LIVE</span>
</div>
<div style={{ display:“flex”, gap:8 }}>
<button onClick={()=>setView(v=>v===“grid”?“list”:“grid”)}
style={{ background:“rgba(255,255,255,0.07)”, border:“none”,
color:“rgba(255,255,255,0.7)”, width:34, height:34, borderRadius:9,
cursor:“pointer”, display:“flex”, alignItems:“center”, justifyContent:“center” }}>
{view===“grid”?<IList/>:<IGrid/>}
</button>
<button onClick={()=>setShowF(f=>!f)}
style={{ background:showF?“rgba(255,78,106,0.2)”:“rgba(255,255,255,0.07)”,
border:showF?“1px solid rgba(255,78,106,0.4)”:“none”,
color:showF?”#ff4e6a”:“rgba(255,255,255,0.7)”,
width:34, height:34, borderRadius:9, cursor:“pointer”,
display:“flex”, alignItems:“center”, justifyContent:“center” }}>
<IFilter/>
</button>
</div>
</div>

```
    {/* Country tabs */}
    <div style={{ display:"flex", gap:7, overflowX:"auto", scrollbarWidth:"none", paddingBottom:10 }}>
      {Object.keys(DRAMA_COUNTRIES).map(c=>(
        <button key={c} onClick={()=>setCountry(c)} style={{
          flexShrink:0, padding:"6px 14px", borderRadius:20,
          border: country===c?"none":"1px solid rgba(255,255,255,0.12)",
          background: country===c?"linear-gradient(90deg,#ff4e6a,#ff7e42)":"rgba(255,255,255,0.05)",
          color: country===c?"#fff":"rgba(255,255,255,0.5)",
          fontSize:12, fontWeight:600, cursor:"pointer" }}>{c}</button>
      ))}
    </div>

    {/* Genre filter */}
    {showF && (
      <div style={{ paddingBottom:12, borderTop:"1px solid rgba(255,255,255,0.05)", paddingTop:10 }}>
        <div style={{ display:"flex", gap:6, overflowX:"auto", scrollbarWidth:"none" }}>
          {Object.keys(GENRES_MAP).map(g=>(
            <button key={g} onClick={()=>setGenre(g)} style={{
              flexShrink:0, padding:"4px 12px", borderRadius:16,
              border: genre===g?"none":"1px solid rgba(255,255,255,0.1)",
              background: genre===g?"rgba(255,78,106,0.2)":"rgba(255,255,255,0.04)",
              color: genre===g?"#ff7e8e":"rgba(255,255,255,0.42)",
              fontSize:11, fontWeight:600, cursor:"pointer" }}>{g}</button>
          ))}
        </div>
      </div>
    )}
  </div>

  <div style={{ padding:"10px 16px 0", fontSize:12, color:"rgba(255,255,255,0.3)", marginBottom:8 }}>
    Найдено: <span style={{ color:"rgba(255,255,255,0.6)", fontWeight:700 }}>{total.toLocaleString()}</span> дорам
  </div>

  {view==="grid"
    ? <div className="catalog-grid" style={{ padding:"0 16px" }}>
        {shows.map(s=><Card key={s.id} show={s} onClick={onSelect}/>)}
      </div>
    : <div style={{ padding:"0 16px" }}>
        {shows.map(s=><CardRow key={s.id} show={s} onClick={onSelect}/>)}
      </div>}

  {loading && <Spinner/>}

  {!loading && shows.length>0 && (
    <div style={{ textAlign:"center", padding:"20px 0 10px" }}>
      <button onClick={loadMore} style={{ padding:"10px 32px",
        background:"rgba(255,78,106,0.15)", border:"1px solid rgba(255,78,106,0.3)",
        color:"#ff7e8e", borderRadius:10, fontSize:13, fontWeight:600, cursor:"pointer" }}>
        Загрузить ещё
      </button>
    </div>
  )}

  <div style={{ textAlign:"center", padding:"10px 0 20px",
    color:"rgba(255,255,255,0.15)", fontSize:10 }}>Данные предоставлены TMDB</div>
</div>
```

);
}

// ═══════════════════════════════════════════════════════════
//  SEARCH PAGE
// ═══════════════════════════════════════════════════════════
const POPULAR = [“Корейская романтика”,“Исторический Китай”,“Фэнтези”,“Медицинская драма”,“Детектив”,“Школьная дорама”];

function SearchPage({ onSelect }) {
const [query,   setQuery]   = useState(””);
const [results, setResults] = useState([]);
const [loading, setLoading] = useState(false);
const [history, setHistory] = useState([]);
const inputRef = useRef(null);
const timerRef = useRef(null);

useEffect(()=>{ inputRef.current?.focus(); },[]);

useEffect(()=>{
clearTimeout(timerRef.current);
if (!query.trim()) { setResults([]); return; }
setLoading(true);
timerRef.current = setTimeout(async()=>{
const data = await searchDramas(query);
setResults((data.results||[]).map(formatShow));
setLoading(false);
}, 500);
},[query]);

const handleSelect = s => {
if (query.trim()) setHistory(h=>[query,…h.filter(x=>x!==query)].slice(0,6));
onSelect(s);
};

return (
<div style={{ height:“100vh”, overflowY:“auto”, paddingBottom:70,
background:”#0a0a18”, fontFamily:”‘Manrope’,sans-serif”, color:”#fff” }}>
<div style={{ position:“sticky”, top:0, zIndex:50,
background:“rgba(10,10,24,0.97)”, backdropFilter:“blur(16px)”,
borderBottom:“1px solid rgba(255,255,255,0.06)”, padding:“14px 16px 12px” }}>
<div style={{ fontSize:21, fontFamily:”‘Bebas Neue’,sans-serif”, marginBottom:12 }}>
<span style={{ background:“linear-gradient(90deg,#ff4e6a,#ff7e42)”,
WebkitBackgroundClip:“text”, WebkitTextFillColor:“transparent” }}>DORAMA</span>
<span style={{ color:”#fff” }}>LIVE</span>
</div>
<div style={{ position:“relative” }}>
<div style={{ position:“absolute”, left:12, top:“50%”, transform:“translateY(-50%)”,
color:“rgba(255,255,255,0.3)” }}><ISearch/></div>
<input ref={inputRef} value={query} onChange={e=>setQuery(e.target.value)}
placeholder=“Поиск по названию…”
style={{ width:“100%”, padding:“11px 40px 11px 42px”,
background:“rgba(255,255,255,0.07)”, border:“1px solid rgba(255,255,255,0.1)”,
borderRadius:12, color:”#fff”, fontSize:14, outline:“none”,
fontFamily:”‘Manrope’,sans-serif”, boxSizing:“border-box” }}
onFocus={e=>e.target.style.borderColor=“rgba(255,78,106,0.5)”}
onBlur={e=>e.target.style.borderColor=“rgba(255,255,255,0.1)”}/>
{query&&<button onClick={()=>setQuery(””)}
style={{ position:“absolute”, right:12, top:“50%”, transform:“translateY(-50%)”,
background:“rgba(255,255,255,0.12)”, border:“none”, color:“rgba(255,255,255,0.6)”,
width:22, height:22, borderRadius:“50%”, cursor:“pointer”,
display:“flex”, alignItems:“center”, justifyContent:“center”, fontSize:13 }}>×</button>}
</div>
</div>

```
  <div style={{ padding:"16px 16px 0" }}>
    {loading && <Spinner/>}

    {!loading && results.length>0 && (
      <div>
        <div style={{ fontSize:12, color:"rgba(255,255,255,0.3)", marginBottom:12 }}>
          Найдено: <span style={{ color:"rgba(255,255,255,0.6)", fontWeight:700 }}>{results.length}</span>
        </div>
        {results.map(s=><CardRow key={s.id} show={s} onClick={handleSelect}/>)}
      </div>
    )}

    {!loading && query && results.length===0 && (
      <div style={{ textAlign:"center", padding:"50px 0" }}>
        <div style={{ fontSize:48, marginBottom:12 }}>😔</div>
        <div style={{ fontSize:15, color:"rgba(255,255,255,0.5)" }}>Ничего не найдено</div>
      </div>
    )}

    {!query && (
      <>
        {history.length>0 && (
          <div style={{ marginBottom:24 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)",
                fontFamily:"'Bebas Neue',sans-serif", letterSpacing:"0.07em" }}>ИСТОРИЯ</div>
              <button onClick={()=>setHistory([])}
                style={{ background:"none", border:"none", color:"rgba(255,255,255,0.28)",
                  fontSize:11, cursor:"pointer" }}>Очистить</button>
            </div>
            {history.map(h=>(
              <div key={h} onClick={()=>setQuery(h)}
                style={{ display:"flex", gap:12, padding:"10px 12px", borderRadius:10,
                  cursor:"pointer" }}
                onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.05)"}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <span style={{ opacity:0.35 }}>🕐</span>
                <span style={{ fontSize:13, color:"rgba(255,255,255,0.6)", flex:1 }}>{h}</span>
                <span onClick={e=>{e.stopPropagation();setHistory(p=>p.filter(x=>x!==h));}}
                  style={{ color:"rgba(255,255,255,0.2)", cursor:"pointer", fontSize:16 }}>×</span>
              </div>
            ))}
          </div>
        )}
        <div style={{ marginBottom:20 }}>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", marginBottom:12,
            fontFamily:"'Bebas Neue',sans-serif", letterSpacing:"0.07em" }}>ПОПУЛЯРНЫЕ ЗАПРОСЫ</div>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {POPULAR.map(q=>(
              <button key={q} onClick={()=>setQuery(q)} style={{
                padding:"7px 14px", borderRadius:20,
                background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
                color:"rgba(255,255,255,0.55)", fontSize:12, fontWeight:600,
                cursor:"pointer" }}>🔍 {q}</button>
            ))}
          </div>
        </div>
      </>
    )}
  </div>
</div>
```

);
}

// ═══════════════════════════════════════════════════════════
//  WATCH PAGE
// ═══════════════════════════════════════════════════════════
function WatchPage({ show: s, onBack, isFav, onToggleFav }) {
const [ep,      setEp]      = useState(1);
const [bm,      setBm]      = useState(isFav||false);
const [exp,     setExp]     = useState(false);
const [playing, setPlay]    = useState(false);
const [details, setDetails] = useState(null);

useEffect(()=>{
fetchDetails(s.id).then(setDetails).catch(()=>{});
},[s.id]);

const epCount  = details?.number_of_episodes || s.episodes || 12;
const cast     = details?.credits?.cast?.slice(0,6).map(c=>c.name) || [];
const director = details?.credits?.crew?.find(c=>c.job===“Director”)?.name || “”;
const desc     = details?.overview || s.desc;
const rating   = details?.vote_average ? (details.vote_average/2).toFixed(1) : s.rating;
const backdrop = details?.backdrop_path ? IMGB+details.backdrop_path : s.backdrop;
const genres   = details?.genres?.map(g=>g.name) || [];
const episodes = Array.from({length:Math.min(epCount,100)},(_,i)=>({num:i+1,dur:`${42+Math.floor(Math.random()*10)} мин`}));

const goEp = n => { setEp(n); setPlay(false); };

return (
<div className=“watch-container” style={{ background:”#0a0a18”, minHeight:“100vh”,
color:”#fff”, fontFamily:”‘Manrope’,sans-serif”, paddingBottom:70 }}>

```
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
        overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{s.title}</span>
    </div>
    <div style={{ display:"flex", gap:7 }}>
      <button onClick={()=>{setBm(b=>!b);onToggleFav&&onToggleFav();}}
        style={{ background:bm?"rgba(255,78,106,0.15)":"rgba(255,255,255,0.08)",
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
    {backdrop
      ? <img src={backdrop} alt={s.title}
          style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }}/>
      : <PosterImg show={s} style={{ position:"absolute", inset:0 }} fontSize={80}/>}
    <div style={{ position:"absolute", inset:0,
      background:"linear-gradient(to bottom,rgba(0,0,0,0.2) 0%,rgba(10,10,24,1) 100%)" }}/>
    <div style={{ position:"absolute", bottom:0, left:0, right:0,
      padding:"0 16px 18px", display:"flex", gap:13, alignItems:"flex-end" }}>
      <div style={{ width:82, height:114, borderRadius:11, overflow:"hidden", flexShrink:0,
        boxShadow:"0 8px 28px rgba(0,0,0,0.7)", border:"2px solid rgba(255,255,255,0.1)" }}>
        <PosterImg show={s} fontSize={28}/>
      </div>
      <div style={{ flex:1, minWidth:0, paddingBottom:3 }}>
        <div style={{ marginBottom:5 }}><Tag label={s.tag} color={s.tagColor}/></div>
        <div style={{ fontSize:19, fontWeight:800, color:"#fff", lineHeight:1.15,
          fontFamily:"'Bebas Neue',sans-serif", letterSpacing:"0.02em", marginBottom:4 }}>
          {details?.name||s.title}
        </div>
        <div style={{ color:"rgba(255,255,255,0.35)", fontSize:11, marginBottom:7 }}>{s.en}</div>
        <div style={{ display:"flex", gap:6, alignItems:"center", flexWrap:"wrap" }}>
          <div style={{ display:"flex", alignItems:"center", gap:3,
            background:"rgba(0,0,0,0.45)", backdropFilter:"blur(6px)",
            borderRadius:7, padding:"3px 7px" }}>
            <IStar s={11}/><span style={{ color:"#FFD700", fontWeight:700, fontSize:12 }}>{rating}</span>
          </div>
          {[s.year, `${epCount} сер.`].map(v=>
            <span key={v} style={{ color:"rgba(255,255,255,0.45)", fontSize:11 }}>{v}</span>)}
        </div>
      </div>
    </div>
  </div>

  {/* GENRES */}
  {genres.length>0&&<div style={{ padding:"12px 16px 0", display:"flex", gap:6, flexWrap:"wrap" }}>
    {genres.map(g=><span key={g} style={{ background:"rgba(255,78,106,0.12)", color:"#ff7e8e",
      fontSize:11, padding:"4px 11px", borderRadius:8,
      border:"1px solid rgba(255,78,106,0.22)" }}>{g}</span>)}
  </div>}

  {/* DESC */}
  <div style={{ padding:"12px 16px" }}>
    <div style={{ color:"rgba(255,255,255,0.58)", fontSize:13, lineHeight:1.8,
      overflow:"hidden", maxHeight:exp?"none":"55px",
      maskImage:exp?"none":"linear-gradient(to bottom,black 40%,transparent 100%)",
      WebkitMaskImage:exp?"none":"linear-gradient(to bottom,black 40%,transparent 100%)" }}>{desc}</div>
    <button onClick={()=>setExp(e=>!e)} style={{ background:"none", border:"none",
      color:"#ff4e6a", fontSize:12, fontWeight:700, cursor:"pointer",
      marginTop:4, padding:0 }}>{exp?"Свернуть ↑":"Читать далее ↓"}</button>
  </div>

  {/* CAST */}
  {cast.length>0&&<div style={{ padding:"0 16px 14px" }}>
    <div style={{ fontSize:11, color:"rgba(255,255,255,0.28)", marginBottom:9,
      fontFamily:"'Bebas Neue',sans-serif", letterSpacing:"0.08em" }}>В ГЛАВНЫХ РОЛЯХ</div>
    <div style={{ display:"flex", gap:12, overflowX:"auto", scrollbarWidth:"none" }}>
      {cast.map(name=>(
        <div key={name} style={{ flexShrink:0, textAlign:"center" }}>
          <div style={{ width:48, height:48, borderRadius:"50%", margin:"0 auto 5px",
            background:"linear-gradient(135deg,rgba(255,78,106,0.3),rgba(255,126,66,0.3))",
            border:"2px solid rgba(255,78,106,0.22)",
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>🎭</div>
          <div style={{ color:"rgba(255,255,255,0.58)", fontSize:10, fontWeight:600,
            maxWidth:60, textAlign:"center", lineHeight:1.3 }}>{name}</div>
        </div>
      ))}
    </div>
  </div>}

  {/* INFO */}
  <div style={{ margin:"0 16px 16px", background:"rgba(255,255,255,0.04)",
    borderRadius:13, border:"1px solid rgba(255,255,255,0.07)", overflow:"hidden" }}>
    {[
      ["Год", s.year],
      ["Серий", String(epCount)],
      director&&["Режиссёр", director],
      details?.networks?.[0]?.name&&["Канал", details.networks[0].name],
    ].filter(Boolean).map(([k,v],i,arr)=>(
      <div key={k} style={{ display:"flex", justifyContent:"space-between",
        alignItems:"center", padding:"10px 15px",
        borderBottom:i<arr.length-1?"1px solid rgba(255,255,255,0.05)":"none" }}>
        <span style={{ color:"rgba(255,255,255,0.32)", fontSize:12 }}>{k}</span>
        <span style={{ color:"rgba(255,255,255,0.76)", fontSize:12, fontWeight:600 }}>{v}</span>
      </div>
    ))}
  </div>

  <div style={{ margin:"0 16px 16px", height:1, background:"rgba(255,255,255,0.06)" }}/>

  {/* PLAYER */}
  <div style={{ padding:"0 16px 9px", display:"flex", alignItems:"center", gap:8 }}>
    <div style={{ width:3, height:17, background:"linear-gradient(180deg,#ff4e6a,#ff7e42)", borderRadius:2 }}/>
    <span style={{ fontSize:14, fontWeight:800, fontFamily:"'Bebas Neue',sans-serif",
      letterSpacing:"0.03em" }}>СМОТРЕТЬ</span>
    <span style={{ fontSize:12, color:"rgba(255,255,255,0.32)" }}>Серия {ep} из {epCount}</span>
  </div>

  <div style={{ position:"relative", aspectRatio:"16/9", background:"#000", overflow:"hidden" }}>
    {backdrop
      ? <img src={backdrop} alt="" style={{ position:"absolute", inset:0, width:"100%",
          height:"100%", objectFit:"cover", opacity:0.5 }}/>
      : <PosterImg show={s} style={{ position:"absolute", inset:0, opacity:0.4 }} fontSize={80}/>}
    <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.5)" }}/>
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
      {s.title} · Серия {ep}
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
    <span style={{ fontSize:12, color:"rgba(255,255,255,0.38)", fontWeight:600 }}>{ep} / {epCount}</span>
    <button onClick={()=>ep<epCount&&goEp(ep+1)}
      style={{ background:ep<epCount?"linear-gradient(90deg,#ff4e6a,#ff7e42)":"rgba(255,255,255,0.03)",
        border:"none", color:ep<epCount?"#fff":"rgba(255,255,255,0.2)",
        padding:"7px 14px", borderRadius:9, cursor:ep<epCount?"pointer":"default",
        fontSize:12, fontWeight:600,
        boxShadow:ep<epCount?"0 2px 10px rgba(255,78,106,0.35)":"none" }}>
      {ep<epCount?`Серия ${ep+1}`:"Нет"} →</button>
  </div>

  {/* EPISODES */}
  <div style={{ padding:"16px 16px 32px" }}>
    <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:11 }}>
      <div style={{ width:3, height:17, background:"linear-gradient(180deg,#ff4e6a,#ff7e42)", borderRadius:2 }}/>
      <span style={{ fontSize:14, fontWeight:800, fontFamily:"'Bebas Neue',sans-serif",
        letterSpacing:"0.03em" }}>ВСЕ СЕРИИ</span>
      <span style={{ fontSize:12, color:"rgba(255,255,255,0.28)" }}>{epCount} серий</span>
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
            background:ep===e.num?"linear-gradient(135deg,#ff4e6a,#ff7e42)":"rgba(255,255,255,0.05)",
            display:"flex", alignItems:"center", justifyContent:"center",
            color:ep===e.num?"#fff":"rgba(255,255,255,0.6)",
            fontSize:11, fontWeight:700,
            boxShadow:ep===e.num?"0 3px 10px rgba(255,78,106,0.45)":"none" }}>
            {ep===e.num?<IPlay s={12}/>:e.num}
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:12, fontWeight:700,
              color:ep===e.num?"#fff":"rgba(255,255,255,0.68)" }}>Серия {e.num}</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.26)", marginTop:1 }}>{e.dur}</div>
          </div>
          {ep===e.num&&<div style={{ fontSize:10, color:"#ff4e6a", fontWeight:700,
            background:"rgba(255,78,106,0.12)", padding:"3px 7px", borderRadius:5 }}>СЕЙЧАС</div>}
        </div>
      ))}
    </div>
  </div>
</div>
```

);
}

// ═══════════════════════════════════════════════════════════
//  AUTH + FAV PAGES (unchanged)
// ═══════════════════════════════════════════════════════════
function AuthPage({ onLogin, onClose }) {
const [mode,setMode]=useState(“login”);
const [email,setEmail]=useState(””);
const [pass,setPass]=useState(””);
const [name,setName]=useState(””);
const [loading,setLoading]=useState(false);
const [err,setErr]=useState(””);
const [showP,setShowP]=useState(false);

const submit=()=>{
setErr(””);
if(!email.trim()){setErr(“Введите email”);return;}
if(!email.includes(”@”)){setErr(“Неверный email”);return;}
if(pass.length<6){setErr(“Пароль минимум 6 символов”);return;}
if(mode===“register”&&!name.trim()){setErr(“Введите имя”);return;}
setLoading(true);
setTimeout(()=>{setLoading(false);onLogin({name:name||email.split(”@”)[0],email});},1200);
};

return (
<div onClick={onClose} className=“auth-overlay” style={{ position:“fixed”,inset:0,zIndex:200,
background:“rgba(0,0,0,0.9)”,backdropFilter:“blur(10px)”,
display:“flex”,alignItems:“flex-end”,justifyContent:“center”,fontFamily:”‘Manrope’,sans-serif” }}>
<div onClick={e=>e.stopPropagation()} className=“auth-box” style={{
background:“linear-gradient(160deg,#131325 0%,#0e0e1e 100%)”,
borderRadius:“22px 22px 0 0”,width:“100%”,maxWidth:680,
border:“1px solid rgba(255,255,255,0.08)”,
boxShadow:“0 -20px 60px rgba(0,0,0,0.7)”,
padding:“20px 22px 36px”,maxHeight:“92vh”,overflowY:“auto” }}>
<div style={{width:36,height:4,background:“rgba(255,255,255,0.15)”,borderRadius:2,margin:“0 auto 20px”}}/>
<button onClick={onClose} style={{position:“absolute”,top:18,right:18,
background:“rgba(255,255,255,0.08)”,border:“none”,color:”#fff”,
width:32,height:32,borderRadius:“50%”,cursor:“pointer”,
display:“flex”,alignItems:“center”,justifyContent:“center”,fontSize:16}}>×</button>
<div style={{textAlign:“center”,marginBottom:22}}>
<div style={{fontSize:28,fontFamily:”‘Bebas Neue’,sans-serif”}}>
<span style={{background:“linear-gradient(90deg,#ff4e6a,#ff7e42)”,
WebkitBackgroundClip:“text”,WebkitTextFillColor:“transparent”}}>DORAMA</span>
<span style={{color:”#fff”}}>LIVE</span>
</div>
<div style={{color:“rgba(255,255,255,0.35)”,fontSize:12,marginTop:4}}>
{mode===“login”?“Добро пожаловать!”:“Создай аккаунт бесплатно”}
</div>
</div>
<div style={{display:“flex”,background:“rgba(255,255,255,0.05)”,borderRadius:12,padding:4,marginBottom:22}}>
{[“login”,“register”].map(m=>(
<button key={m} onClick={()=>{setMode(m);setErr(””);}}
style={{flex:1,padding:“9px”,borderRadius:9,border:“none”,
background:mode===m?“linear-gradient(90deg,#ff4e6a,#ff7e42)”:“transparent”,
color:mode===m?”#fff”:“rgba(255,255,255,0.4)”,
fontSize:13,fontWeight:700,cursor:“pointer”,transition:“all 0.2s”}}>
{m===“login”?“Войти”:“Регистрация”}
</button>
))}
</div>
<div style={{display:“flex”,flexDirection:“column”,gap:12,marginBottom:16}}>
{mode===“register”&&(
<div>
<div style={{fontSize:11,color:“rgba(255,255,255,0.4)”,marginBottom:6,fontWeight:600}}>ИМЯ</div>
<input value={name} onChange={e=>setName(e.target.value)} placeholder=“Как тебя зовут?”
style={{width:“100%”,padding:“12px 14px”,background:“rgba(255,255,255,0.06)”,
border:“1px solid rgba(255,255,255,0.1)”,borderRadius:11,color:”#fff”,
fontSize:14,outline:“none”,boxSizing:“border-box”}}/>
</div>
)}
<div>
<div style={{fontSize:11,color:“rgba(255,255,255,0.4)”,marginBottom:6,fontWeight:600}}>EMAIL</div>
<input value={email} onChange={e=>setEmail(e.target.value)} placeholder=“example@email.com” type=“email”
style={{width:“100%”,padding:“12px 14px”,background:“rgba(255,255,255,0.06)”,
border:“1px solid rgba(255,255,255,0.1)”,borderRadius:11,color:”#fff”,
fontSize:14,outline:“none”,boxSizing:“border-box”}}/>
</div>
<div>
<div style={{fontSize:11,color:“rgba(255,255,255,0.4)”,marginBottom:6,fontWeight:600}}>ПАРОЛЬ</div>
<div style={{position:“relative”}}>
<input value={pass} onChange={e=>setPass(e.target.value)}
placeholder={mode===“register”?“Минимум 6 символов”:“Введи пароль”}
type={showP?“text”:“password”}
onKeyDown={e=>e.key===“Enter”&&submit()}
style={{width:“100%”,padding:“12px 44px 12px 14px”,background:“rgba(255,255,255,0.06)”,
border:“1px solid rgba(255,255,255,0.1)”,borderRadius:11,color:”#fff”,
fontSize:14,outline:“none”,boxSizing:“border-box”}}/>
<button onClick={()=>setShowP(s=>!s)}
style={{position:“absolute”,right:12,top:“50%”,transform:“translateY(-50%)”,
background:“none”,border:“none”,color:“rgba(255,255,255,0.35)”,
cursor:“pointer”,fontSize:16}}>{showP?“🙈”:“👁”}</button>
</div>
</div>
</div>
{err&&<div style={{background:“rgba(255,78,106,0.12)”,border:“1px solid rgba(255,78,106,0.3)”,
borderRadius:9,padding:“9px 13px”,fontSize:12,color:”#ff9eaa”,marginBottom:14}}>⚠️ {err}</div>}
<button onClick={submit} disabled={loading}
style={{width:“100%”,padding:“14px”,
background:loading?“rgba(255,255,255,0.1)”:“linear-gradient(90deg,#ff4e6a,#ff7e42)”,
border:“none”,color:”#fff”,borderRadius:12,fontSize:15,fontWeight:700,
cursor:loading?“default”:“pointer”,
display:“flex”,alignItems:“center”,justifyContent:“center”,gap:8}}>
{loading?<><div style={{width:16,height:16,border:“2px solid rgba(255,255,255,0.3)”,
borderTop:“2px solid #fff”,borderRadius:“50%”,animation:“spin 0.8s linear infinite”}}/>Загрузка…</>
:mode===“login”?“ВОЙТИ”:“СОЗДАТЬ АККАУНТ”}
</button>
</div>
</div>
);
}

function FavPage({ user, favIds, onSelect, onLogin }) {
if (!user) return (
<div style={{height:“100vh”,display:“flex”,flexDirection:“column”,alignItems:“center”,
justifyContent:“center”,paddingBottom:70,fontFamily:”‘Manrope’,sans-serif”,
color:”#fff”,padding:“0 24px 70px”,textAlign:“center”}}>
<div style={{fontSize:64,marginBottom:20}}>❤️</div>
<div style={{fontSize:22,fontWeight:800,fontFamily:”‘Bebas Neue’,sans-serif”,marginBottom:10}}>ИЗБРАННОЕ</div>
<div style={{color:“rgba(255,255,255,0.4)”,fontSize:13,lineHeight:1.7,marginBottom:28}}>
Войди в аккаунт, чтобы сохранять дорамы
</div>
<button onClick={onLogin} style={{padding:“12px 32px”,
background:“linear-gradient(90deg,#ff4e6a,#ff7e42)”,border:“none”,
color:”#fff”,borderRadius:12,fontSize:14,fontWeight:700,cursor:“pointer”}}>
ВОЙТИ / ЗАРЕГИСТРИРОВАТЬСЯ
</button>
</div>
);
return (
<div style={{height:“100vh”,overflowY:“auto”,paddingBottom:70,
fontFamily:”‘Manrope’,sans-serif”,color:”#fff”}}>
<div style={{padding:“18px 16px”,background:“rgba(10,10,24,0.97)”,
position:“sticky”,top:0,zIndex:50,borderBottom:“1px solid rgba(255,255,255,0.06)”}}>
<div style={{display:“flex”,alignItems:“center”,justifyContent:“space-between”}}>
<div style={{fontSize:21,fontFamily:”‘Bebas Neue’,sans-serif”}}>
<span style={{background:“linear-gradient(90deg,#ff4e6a,#ff7e42)”,
WebkitBackgroundClip:“text”,WebkitTextFillColor:“transparent”}}>DORAMA</span>
<span style={{color:”#fff”}}>LIVE</span>
</div>
<div style={{display:“flex”,alignItems:“center”,gap:10}}>
<div style={{textAlign:“right”}}>
<div style={{fontSize:13,fontWeight:700,color:”#fff”}}>{user.name}</div>
<div style={{fontSize:10,color:“rgba(255,255,255,0.35)”}}>{user.email}</div>
</div>
<div style={{width:38,height:38,borderRadius:“50%”,
background:“linear-gradient(135deg,#ff4e6a,#ff7e42)”,
display:“flex”,alignItems:“center”,justifyContent:“center”,
fontSize:16,fontWeight:700,color:”#fff”}}>
{user.name[0].toUpperCase()}
</div>
</div>
</div>
</div>
<div style={{padding:“20px 16px”,textAlign:“center”,color:“rgba(255,255,255,0.4)”}}>
<div style={{fontSize:44,marginBottom:10}}>🔖</div>
<div>Нажми ❤️ на странице дорамы чтобы добавить в избранное</div>
</div>
</div>
);
}

// ═══════════════════════════════════════════════════════════
//  APP ROOT
// ═══════════════════════════════════════════════════════════
export default function App() {
const [page,    setPage]    = useState(“home”);
const [show,    setShow]    = useState(null);
const [user,    setUser]    = useState(null);
const [favIds,  setFavIds]  = useState([]);
const [showAuth,setShowAuth]= useState(false);
const [catalogCountry, setCatalogCountry] = useState(””);

const openShow  = s => { setShow(s); setPage(“watch”); };
const goBack    = () => { setPage(“home”); setShow(null); };
const login     = u => { setUser(u); setShowAuth(false); };
const toggleFav = id=> setFavIds(f=>f.includes(id)?f.filter(x=>x!==id):[…f,id]);

const handleNav = (target, params={}) => {
if (target===“catalog”) { setCatalogCountry(params.country||””); setPage(“catalog”); }
else if (target===“search”) setPage(“search”);
else if (target===“fav”) setPage(“fav”);
else setPage(“home”);
setShow(null);
};

const currentPage = show ? “watch” : page;

return (
<>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
<style>{`*{box-sizing:border-box;margin:0;padding:0;} body{background:#0a0a18;} ::-webkit-scrollbar{display:none;} input::placeholder{color:rgba(255,255,255,0.26);} @keyframes spin{to{transform:rotate(360deg);}} .page-wrap{width:100%;max-width:1400px;margin:0 auto;padding:0 18px;} .nav-wrap{width:100%;max-width:1400px;margin:0 auto;padding:0 18px;display:flex;align-items:center;justify-content:space-between;height:100%;} .desktop-nav{display:none;} .bottom-nav-bar{display:flex;} .section-cards{display:flex;gap:11px;overflow-x:auto;scrollbar-width:none;scroll-behavior:smooth;} .card-item{flex-shrink:0;width:132px;} .catalog-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:11px;} .countries-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;} .watch-container{max-width:680px;margin:0 auto;} .auth-overlay{align-items:flex-end;} .auth-box{border-radius:22px 22px 0 0;width:100%;max-width:680px;} @media(min-width:768px){ .desktop-nav{display:flex;gap:28px;align-items:center;} .bottom-nav-bar{display:none!important;} .card-item{width:168px!important;} .catalog-grid{grid-template-columns:repeat(auto-fill,minmax(160px,1fr))!important;gap:16px!important;} .countries-grid{grid-template-columns:repeat(5,1fr)!important;} .watch-container{max-width:860px!important;} .auth-overlay{align-items:center!important;} .auth-box{border-radius:20px!important;max-width:460px!important;} } @media(min-width:1100px){ .card-item{width:190px!important;} .catalog-grid{grid-template-columns:repeat(auto-fill,minmax(180px,1fr))!important;} }`}</style>
<div style={{ background:”#0a0a18”, minHeight:“100vh” }}>
{currentPage===“home”    && <HomePage    onSelect={openShow} onNav={handleNav} user={user} onLoginClick={()=>setShowAuth(true)}/>}
{currentPage===“catalog” && <CatalogPage onSelect={openShow} initCountry={catalogCountry}/>}
{currentPage===“search”  && <SearchPage  onSelect={openShow}/>}
{currentPage===“fav”     && <FavPage     user={user} favIds={favIds} onSelect={openShow} onLogin={()=>setShowAuth(true)}/>}
{currentPage===“watch”   && show && <WatchPage show={show} onBack={goBack} isFav={favIds.includes(show.id)} onToggleFav={()=>toggleFav(show.id)}/>}
{currentPage!==“watch”   && <BottomNav page={page} onNav={handleNav}/>}
{showAuth && <AuthPage onLogin={login} onClose={()=>setShowAuth(false)}/>}
</div>
</>
);
}