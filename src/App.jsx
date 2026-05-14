import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════════
//  TMDB CONFIG
// ═══════════════════════════════════════════════════════════
const KEY  = (typeof process!=="undefined" && process.env?.REACT_APP_TMDB_KEY) || "2633f71a568cf4920d47195da4b0b3e0";
const BASE = "https://api.themoviedb.org/3";
const IMG  = "https://image.tmdb.org/t/p/w500";
const IMGB = "https://image.tmdb.org/t/p/w1280";
const IMGF = "https://image.tmdb.org/t/p/w185";

async function tmdb(path, params={}) {
  const q = new URLSearchParams({ api_key:KEY, language:"ru-RU", ...params });
  const r = await fetch(`${BASE}${path}?${q}`);
  return r.json();
}

async function fetchByCategory(category, page=1) {
  const endpoints = {
    "trending":  ["/trending/all/week", {}],
    "dramas":    ["/discover/tv", { with_genres:18, with_original_language:"ko|zh|ja", sort_by:"popularity.desc", "vote_count.gte":50 }],
    "korean":    ["/discover/tv", { with_original_language:"ko", sort_by:"popularity.desc", "vote_count.gte":30 }],
    "chinese":   ["/discover/tv", { with_original_language:"zh", sort_by:"popularity.desc", "vote_count.gte":30 }],
    "japanese":  ["/discover/tv", { with_original_language:"ja", sort_by:"popularity.desc", "vote_count.gte":30 }],
    "anime":     ["/discover/tv", { with_genres:16, sort_by:"popularity.desc", "vote_count.gte":50 }],
    "movies":    ["/discover/movie", { sort_by:"popularity.desc", "vote_count.gte":100 }],
    "new":       ["/discover/tv", { sort_by:"first_air_date.desc", "vote_count.gte":20, "first_air_date.gte":"2024-01-01" }],
    "top":       ["/discover/tv", { sort_by:"vote_average.desc", "vote_count.gte":200 }],
    "top_movies":["/discover/movie", { sort_by:"vote_average.desc", "vote_count.gte":500 }],
  };
  const [path, params2] = endpoints[category] || endpoints["trending"];
  return tmdb(path, { ...params2, page });
}

async function searchAll(query, page=1) {
  return tmdb("/search/multi", { query, page });
}

async function fetchDetails(id, type="tv") {
  return tmdb(`/${type}/${id}`, { append_to_response:"credits,similar,videos" });
}

function formatItem(item) {
  const isMovie = item.media_type==="movie" || item.title;
  return {
    id: item.id,
    type: isMovie ? "movie" : "tv",
    title: item.name || item.title || item.original_name || item.original_title,
    en: item.original_name || item.original_title,
    rating: item.vote_average ? (item.vote_average/2).toFixed(1) : "?",
    year: (item.first_air_date||item.release_date||"")?.slice(0,4) || "?",
    episodes: item.number_of_episodes || null,
    genre: item.genre_ids || [],
    poster: item.poster_path ? IMG+item.poster_path : null,
    backdrop: item.backdrop_path ? IMGB+item.backdrop_path : null,
    desc: item.overview || "Описание отсутствует.",
    tag: item.vote_average>=8?"ХИТ":(item.first_air_date||item.release_date||"")>="2025-01-01"?"НОВИНКА":"",
    tagColor: item.vote_average>=8?"#ff4e6a":"#4e9fff",
    isMovie,
  };
}

// ═══════════════════════════════════════════════════════════
//  ICONS
// ═══════════════════════════════════════════════════════════
const IPlay   = ({s=20}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><polygon points="6,3 20,12 6,21"/></svg>;
const IStar   = ({s=12}) => <svg width={s} height={s} viewBox="0 0 12 12" fill="#FFD700"><polygon points="6,1 7.5,4.5 11,5 8.5,7.5 9,11 6,9.5 3,11 3.5,7.5 1,5 4.5,4.5"/></svg>;
const IBack   = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15,18 9,12 15,6"/></svg>;
const ISearch = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>;
const IBm     = ({on}) => <svg width="20" height="20" viewBox="0 0 24 24" fill={on?"#ff4e6a":"none"} stroke={on?"#ff4e6a":"currentColor"} strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>;
const IShare  = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>;
const ICR     = ({s=16}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9,18 15,12 9,6"/></svg>;
const ICL     = ({s=16}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15,18 9,12 15,6"/></svg>;
const IFilter = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3"/></svg>;
const IGrid   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>;
const IList   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>;
const IFilm   = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>;

// ═══════════════════════════════════════════════════════════
//  SHARED
// ═══════════════════════════════════════════════════════════
function PosterImg({ item, style={}, fontSize=36 }) {
  const [err, setErr] = useState(false);
  if (item?.poster && !err) {
    return <img src={item.poster} alt={item?.title||""}
      style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"top center", display:"block", ...style }}
      onError={()=>setErr(true)}/>;
  }
  const colors = ["#1a0533,#c94b8a","#0a1628,#c8873a","#0d2b1a,#2ecc71","#0a0a2e,#4a4acf",
    "#1a0a00,#cf6b1a","#001a1a,#00bcd4","#1a0000,#cf1a1a","#0a1a0a,#2d8a5e","#1a0a1a,#8a2d8a",
    "#0a0520,#6b1a8a","#1a1a00,#8a8a00","#001a0a,#008a4a"];
  const idx = (item?.id||0) % colors.length;
  const emojis = ["🎬","🎥","🎞️","📽️","🎭","🌟","⭐","🏆","🎪","✨","🌸","🔥"];
  return (
    <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center",
      justifyContent:"center", position:"relative", overflow:"hidden",
      background:`linear-gradient(145deg,${colors[idx]})`, ...style }}>
      <div style={{ fontSize, filter:"drop-shadow(0 4px 12px rgba(0,0,0,0.5))" }}>
        {emojis[(item?.id||0)%emojis.length]}
      </div>
      <div style={{ position:"absolute", inset:0,
        background:"radial-gradient(circle at 30% 25%, rgba(255,255,255,0.08) 0%, transparent 55%)" }}/>
    </div>
  );
}

function ActorPhoto({ actor }) {
  const [err, setErr] = useState(false);
  if (actor.profile_path && !err) {
    return <img src={IMGF+actor.profile_path} alt={actor.name}
      style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"top" }}
      onError={()=>setErr(true)}/>;
  }
  return <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center",
    justifyContent:"center", background:"linear-gradient(135deg,rgba(255,78,106,0.3),rgba(255,126,66,0.3))",
    fontSize:24 }}>🎭</div>;
}

function Tag({ label, color }) {
  if (!label) return null;
  return <div style={{ display:"inline-block", background:color, color:"#fff",
    fontSize:10, fontWeight:800, padding:"3px 9px", borderRadius:6,
    fontFamily:"'Montserrat',sans-serif", letterSpacing:"0.06em" }}>{label}</div>;
}

function TypeBadge({ isMovie }) {
  return <div style={{ display:"inline-block",
    background: isMovie?"rgba(100,100,255,0.8)":"rgba(255,78,106,0.8)",
    color:"#fff", fontSize:9, fontWeight:700, padding:"2px 7px", borderRadius:4,
    fontFamily:"'Montserrat',sans-serif", letterSpacing:"0.05em" }}>
    {isMovie?"ФИЛЬМ":"СЕРИАЛ"}
  </div>;
}

function Spinner({ size=36 }) {
  return <div style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 0" }}>
    <div style={{ width:size, height:size, border:`3px solid rgba(255,78,106,0.2)`,
      borderTop:`3px solid #ff4e6a`, borderRadius:"50%", animation:"spin 0.8s linear infinite" }}/>
  </div>;
}

// LOGO
function Logo({ size=24 }) {
  return <div style={{ fontSize:size, fontFamily:"'Montserrat',sans-serif", fontWeight:900, letterSpacing:"-0.02em" }}>
    <span style={{ background:"linear-gradient(90deg,#ff4e6a,#ff7e42)",
      WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Be</span>
    <span style={{ color:"#fff" }}>Movie</span>
  </div>;
}

function BottomNav({ page, onNav }) {
  const items = [
    { id:"home",    icon:"🏠", label:"Главная"  },
    { id:"catalog", icon:"🎬", label:"Каталог"  },
    { id:"search",  icon:"🔍", label:"Поиск"    },
    { id:"fav",     icon:"❤️", label:"Избранное"},
  ];
  return (
    <div className="bottom-nav-bar" style={{ position:"fixed", bottom:0, left:"50%",
      transform:"translateX(-50%)", width:"100%", maxWidth:1400,
      background:"rgba(6,6,18,0.98)", backdropFilter:"blur(20px)",
      borderTop:"1px solid rgba(255,255,255,0.06)",
      display:"flex", justifyContent:"space-around", padding:"8px 0 16px", zIndex:80 }}>
      {items.map(it=>(
        <div key={it.id} onClick={()=>onNav(it.id)}
          style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4,
            cursor:"pointer", opacity:page===it.id?1:0.35, transition:"all 0.2s" }}>
          <div style={{ fontSize:22 }}>{it.icon}</div>
          <div style={{ fontSize:10, color:page===it.id?"#ff4e6a":"#fff",
            fontWeight:page===it.id?700:500, fontFamily:"'Montserrat',sans-serif" }}>{it.label}</div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  CARD
// ═══════════════════════════════════════════════════════════
function Card({ item, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={()=>onClick(item)}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ cursor:"pointer", borderRadius:14, overflow:"hidden", position:"relative",
        aspectRatio:"2/3", flexShrink:0,
        boxShadow:hov?"0 20px 50px rgba(0,0,0,0.7)":"0 4px 16px rgba(0,0,0,0.4)",
        transform:hov?"translateY(-6px) scale(1.03)":"none",
        transition:"all 0.25s cubic-bezier(.34,1.56,.64,1)" }}>
      <PosterImg item={item} fontSize={32}/>
      <div style={{ position:"absolute", inset:0,
        background:"linear-gradient(to top,rgba(0,0,0,0.97) 0%,rgba(0,0,0,0.2) 50%,transparent 100%)" }}/>
      <div style={{ position:"absolute", top:8, left:8, display:"flex", flexDirection:"column", gap:4 }}>
        {item.tag&&<Tag label={item.tag} color={item.tagColor}/>}
        <TypeBadge isMovie={item.isMovie}/>
      </div>
      <div style={{ position:"absolute", top:8, right:8, background:"rgba(0,0,0,0.75)",
        borderRadius:7, padding:"3px 7px", display:"flex", alignItems:"center", gap:3,
        fontSize:11, color:"#FFD700", fontWeight:700, fontFamily:"'Montserrat',sans-serif" }}>
        <IStar s={10}/>{item.rating}
      </div>
      {hov&&<div style={{ position:"absolute", inset:0, display:"flex",
        alignItems:"center", justifyContent:"center",
        background:"rgba(0,0,0,0.2)" }}>
        <div style={{ width:50, height:50, borderRadius:"50%", background:"rgba(255,78,106,0.92)",
          display:"flex", alignItems:"center", justifyContent:"center", color:"#fff",
          boxShadow:"0 0 30px rgba(255,78,106,0.7)" }}><IPlay s={20}/></div>
      </div>}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"12px 10px 10px" }}>
        <div style={{ color:"#fff", fontSize:12, fontWeight:700, lineHeight:1.3,
          fontFamily:"'Montserrat',sans-serif",
          display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
          {item.title}
        </div>
        <div style={{ color:"rgba(255,255,255,0.4)", fontSize:10, marginTop:3,
          overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap",
          fontFamily:"'Montserrat',sans-serif" }}>{item.year}</div>
      </div>
    </div>
  );
}

function CardRow({ item, onClick }) {
  return (
    <div onClick={()=>onClick(item)}
      style={{ display:"flex", gap:14, padding:"13px 0",
        borderBottom:"1px solid rgba(255,255,255,0.05)", cursor:"pointer" }}
      onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.03)"}
      onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
      <div style={{ width:72, height:100, borderRadius:11, overflow:"hidden",
        flexShrink:0, boxShadow:"0 4px 16px rgba(0,0,0,0.4)" }}>
        <PosterImg item={item} fontSize={24}/>
      </div>
      <div style={{ flex:1, minWidth:0, paddingTop:2 }}>
        <div style={{ display:"flex", gap:6, marginBottom:6, flexWrap:"wrap" }}>
          {item.tag&&<Tag label={item.tag} color={item.tagColor}/>}
          <TypeBadge isMovie={item.isMovie}/>
        </div>
        <div style={{ fontSize:15, fontWeight:700, color:"#fff", lineHeight:1.2,
          fontFamily:"'Montserrat',sans-serif", marginBottom:4 }}>{item.title}</div>
        <div style={{ fontSize:11, color:"rgba(255,255,255,0.35)", marginBottom:8,
          fontFamily:"'Montserrat',sans-serif" }}>{item.en}</div>
        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
          <div style={{ display:"flex", alignItems:"center", gap:3 }}>
            <IStar s={12}/><span style={{ color:"#FFD700", fontSize:13, fontWeight:700,
              fontFamily:"'Montserrat',sans-serif" }}>{item.rating}</span>
          </div>
          <span style={{ color:"rgba(255,255,255,0.35)", fontSize:12,
            fontFamily:"'Montserrat',sans-serif" }}>{item.year}</span>
        </div>
      </div>
      <div style={{ display:"flex", alignItems:"center", color:"rgba(255,255,255,0.2)", flexShrink:0 }}>
        <ICR s={16}/>
      </div>
    </div>
  );
}

function Section({ title, icon, items, onSelect, loading }) {
  const ref = useRef(null);
  return (
    <div style={{ marginBottom:36 }}>
      <div className="page-wrap" style={{ display:"flex", alignItems:"center",
        justifyContent:"space-between", marginBottom:14 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:20 }}>{icon}</span>
          <span style={{ fontSize:18, fontWeight:800, color:"#fff",
            fontFamily:"'Montserrat',sans-serif", letterSpacing:"-0.01em" }}>{title}</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:3,
          color:"#ff4e6a", fontSize:13, cursor:"pointer", fontWeight:700,
          fontFamily:"'Montserrat',sans-serif" }}>
          Все <ICR s={14}/>
        </div>
      </div>
      {loading ? <Spinner/> : (
        <div style={{ position:"relative" }}>
          <div ref={ref} className="section-cards" style={{ padding:"4px 18px 8px" }}>
            {items.map(s=><div key={s.id} className="card-item"><Card item={s} onClick={onSelect}/></div>)}
          </div>
          <button onClick={()=>ref.current&&(ref.current.scrollLeft-=340)}
            style={{ position:"absolute", left:4, top:"38%", transform:"translateY(-50%)",
              background:"rgba(8,8,20,0.92)", border:"1px solid rgba(255,255,255,0.12)",
              color:"#fff", width:34, height:34, borderRadius:"50%", cursor:"pointer",
              display:"flex", alignItems:"center", justifyContent:"center",
              boxShadow:"0 4px 12px rgba(0,0,0,0.4)" }}><ICL s={14}/></button>
          <button onClick={()=>ref.current&&(ref.current.scrollLeft+=340)}
            style={{ position:"absolute", right:4, top:"38%", transform:"translateY(-50%)",
              background:"rgba(8,8,20,0.92)", border:"1px solid rgba(255,255,255,0.12)",
              color:"#fff", width:34, height:34, borderRadius:"50%", cursor:"pointer",
              display:"flex", alignItems:"center", justifyContent:"center",
              boxShadow:"0 4px 12px rgba(0,0,0,0.4)" }}><ICR s={14}/></button>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  HOME PAGE
// ═══════════════════════════════════════════════════════════
function HomePage({ onSelect, onNav, user, onLoginClick }) {
  const [trending, setTrending] = useState([]);
  const [dramas,   setDramas]   = useState([]);
  const [movies,   setMovies]   = useState([]);
  const [anime,    setAnime]    = useState([]);
  const [newItems, setNewItems] = useState([]);
  const [top,      setTop]      = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [heroIdx,  setHeroIdx]  = useState(0);
  const scrollRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(()=>{
    const el = scrollRef.current;
    if (!el) return;
    const fn=()=>setScrolled(el.scrollTop>60);
    el.addEventListener("scroll",fn);
    return()=>el.removeEventListener("scroll",fn);
  },[]);

  useEffect(()=>{
    Promise.all([
      fetchByCategory("trending"),
      fetchByCategory("dramas"),
      fetchByCategory("movies"),
      fetchByCategory("anime"),
      fetchByCategory("new"),
      fetchByCategory("top"),
    ]).then(([tr,dr,mv,an,nw,tp])=>{
      setTrending((tr.results||[]).map(formatItem));
      setDramas((dr.results||[]).map(formatItem));
      setMovies((mv.results||[]).map(formatItem));
      setAnime((an.results||[]).map(formatItem));
      setNewItems((nw.results||[]).map(formatItem));
      setTop((tp.results||[]).map(formatItem));
      setLoading(false);
    }).catch(()=>setLoading(false));
  },[]);

  useEffect(()=>{
    if (!trending.length) return;
    const t = setInterval(()=>setHeroIdx(i=>(i+1)%Math.min(trending.length,6)),5000);
    return()=>clearInterval(t);
  },[trending.length]);

  const hero = trending[heroIdx];

  return (
    <div ref={scrollRef} style={{ height:"100vh", overflowY:"auto", paddingBottom:80 }}>
      {/* NAV */}
      <nav style={{ position:"sticky", top:0, zIndex:50, width:"100%",
        background:scrolled?"rgba(6,6,18,0.98)":"transparent",
        backdropFilter:scrolled?"blur(20px)":"none",
        borderBottom:scrolled?"1px solid rgba(255,255,255,0.06)":"none",
        transition:"all 0.3s", height:62 }}>
        <div className="nav-wrap">
          <Logo size={22}/>
          <div className="desktop-nav">
            {[
              {label:"Главная", action:()=>onNav("home")},
              {label:"Каталог", action:()=>onNav("catalog")},
              {label:"Новинки", action:()=>onNav("catalog",{cat:"new"})},
              {label:"Топ",     action:()=>onNav("catalog",{cat:"top"})},
              {label:"Аниме",   action:()=>onNav("catalog",{cat:"anime"})},
              {label:"Фильмы",  action:()=>onNav("catalog",{cat:"movies"})},
            ].map(({label,action})=>(
              <span key={label} onClick={action}
                style={{ color:"rgba(255,255,255,0.55)", fontSize:14, fontWeight:600,
                  cursor:"pointer", fontFamily:"'Montserrat',sans-serif", transition:"color 0.2s" }}
                onMouseEnter={e=>e.target.style.color="#fff"}
                onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.55)"}>{label}</span>
            ))}
          </div>
          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
            <button onClick={()=>onNav("search")} className="desktop-nav"
              style={{ background:"rgba(255,255,255,0.08)", border:"none", color:"rgba(255,255,255,0.6)",
                width:38, height:38, borderRadius:10, cursor:"pointer",
                display:"flex", alignItems:"center", justifyContent:"center" }}>
              <ISearch/>
            </button>
            {user
              ? <div style={{ width:38, height:38, borderRadius:"50%",
                  background:"linear-gradient(135deg,#ff4e6a,#ff7e42)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:16, fontWeight:700, color:"#fff", cursor:"pointer",
                  fontFamily:"'Montserrat',sans-serif" }}
                  onClick={()=>onNav("fav")}>{user.name[0].toUpperCase()}</div>
              : <button onClick={onLoginClick} style={{ background:"linear-gradient(90deg,#ff4e6a,#ff7e42)",
                  border:"none", color:"#fff", padding:"8px 20px", borderRadius:10,
                  fontSize:13, fontWeight:700, cursor:"pointer",
                  fontFamily:"'Montserrat',sans-serif", letterSpacing:"0.02em",
                  boxShadow:"0 4px 16px rgba(255,78,106,0.35)" }}>Войти</button>}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ position:"relative", height:480, overflow:"hidden",
        borderRadius:"0 0 28px 28px", marginTop:-62 }}>
        {hero?.backdrop
          ? <img src={hero.backdrop} alt={hero?.title||""}
              style={{ position:"absolute", inset:0, width:"100%", height:"100%",
                objectFit:"cover", objectPosition:"center 20%", transition:"opacity 0.8s" }}/>
          : <div style={{ position:"absolute", inset:0,
              background:"linear-gradient(135deg,#1a0533 0%,#0a1628 100%)" }}/>}
        <div style={{ position:"absolute", inset:0,
          background:"linear-gradient(135deg,rgba(0,0,0,0.82) 0%,rgba(0,0,0,0.05) 55%,rgba(0,0,0,0.6) 100%)" }}/>
        {hero && (
          <div style={{ position:"absolute", bottom:36, left:0, right:0 }}>
            <div className="page-wrap">
              <div style={{ display:"flex", gap:8, marginBottom:10, flexWrap:"wrap" }}>
                {hero.tag&&<Tag label={hero.tag} color={hero.tagColor}/>}
                <TypeBadge isMovie={hero.isMovie}/>
              </div>
              <div style={{ fontSize:42, fontWeight:900, color:"#fff", lineHeight:1.05,
                fontFamily:"'Montserrat',sans-serif", letterSpacing:"-0.02em", marginBottom:10,
                textShadow:"0 2px 24px rgba(0,0,0,0.6)",
                display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden",
                maxWidth:600 }}>{hero.title}</div>
              <div style={{ color:"rgba(255,255,255,0.65)", fontSize:14, lineHeight:1.6, marginBottom:20,
                maxWidth:440, display:"-webkit-box", WebkitLineClamp:2,
                WebkitBoxOrient:"vertical", overflow:"hidden",
                fontFamily:"'Montserrat',sans-serif" }}>{hero.desc}</div>
              <div style={{ display:"flex", gap:10, alignItems:"center", flexWrap:"wrap" }}>
                <button onClick={()=>onSelect(hero)} style={{ padding:"12px 28px",
                  background:"linear-gradient(90deg,#ff4e6a,#ff7e42)", border:"none",
                  color:"#fff", borderRadius:12, fontSize:15, fontWeight:700, cursor:"pointer",
                  display:"flex", alignItems:"center", gap:8,
                  fontFamily:"'Montserrat',sans-serif",
                  boxShadow:"0 8px 24px rgba(255,78,106,0.5)" }}>
                  <IPlay s={15}/> Смотреть
                </button>
                <div style={{ display:"flex", alignItems:"center", gap:6,
                  background:"rgba(255,255,255,0.12)", borderRadius:10, padding:"10px 16px",
                  backdropFilter:"blur(10px)" }}>
                  <IStar s={14}/><span style={{ color:"#FFD700", fontWeight:700, fontSize:14,
                    fontFamily:"'Montserrat',sans-serif" }}>{hero.rating}</span>
                  <span style={{ color:"rgba(255,255,255,0.5)", fontSize:13,
                    fontFamily:"'Montserrat',sans-serif" }}>• {hero.year}</span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div style={{ position:"absolute", bottom:14, right:20, display:"flex", gap:6 }}>
          {trending.slice(0,6).map((_,i)=>(
            <div key={i} onClick={()=>setHeroIdx(i)}
              style={{ width:i===heroIdx?20:6, height:6, borderRadius:3, cursor:"pointer",
                transition:"all 0.3s", background:i===heroIdx?"#ff4e6a":"rgba(255,255,255,0.3)" }}/>
          ))}
        </div>
      </div>

      <div style={{ height:24 }}/>

      {loading ? <Spinner size={44}/> : (
        <>
          <Section title="В тренде"    icon="🔥" items={trending.slice(0,20)} onSelect={onSelect} loading={false}/>
          <Section title="Дорамы"      icon="🎎" items={dramas.slice(0,20)}   onSelect={onSelect} loading={false}/>
          <Section title="Фильмы"      icon="🎬" items={movies.slice(0,20)}   onSelect={onSelect} loading={false}/>
          <Section title="Аниме"       icon="⛩️" items={anime.slice(0,20)}    onSelect={onSelect} loading={false}/>
          <Section title="Новинки"     icon="✨" items={newItems.slice(0,20)} onSelect={onSelect} loading={false}/>
          <Section title="Топ рейтинг" icon="🏆" items={top.slice(0,20)}     onSelect={onSelect} loading={false}/>
        </>
      )}

      <div style={{ textAlign:"center", padding:"10px 0 24px",
        color:"rgba(255,255,255,0.15)", fontSize:11, fontFamily:"'Montserrat',sans-serif" }}>
        Данные предоставлены TMDB
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  CATALOG PAGE
// ═══════════════════════════════════════════════════════════
const CATS = [
  { id:"trending", label:"В тренде",    icon:"🔥" },
  { id:"dramas",   label:"Дорамы",      icon:"🎎" },
  { id:"movies",   label:"Фильмы",      icon:"🎬" },
  { id:"anime",    label:"Аниме",       icon:"⛩️" },
  { id:"new",      label:"Новинки",     icon:"✨" },
  { id:"top",      label:"Топ",         icon:"🏆" },
  { id:"korean",   label:"Корейские",   icon:"🇰🇷" },
  { id:"chinese",  label:"Китайские",   icon:"🇨🇳" },
  { id:"japanese", label:"Японские",    icon:"🇯🇵" },
];

function CatalogPage({ onSelect, initCat="trending" }) {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [page,    setPage]    = useState(1);
  const [total,   setTotal]   = useState(0);
  const [cat,     setCat]     = useState(initCat||"trending");
  const [view,    setView]    = useState("grid");

  const load = useCallback(async(c, p, reset=false)=>{
    setLoading(true);
    const data = await fetchByCategory(c, p);
    const formatted = (data.results||[]).map(formatItem);
    setItems(prev=>reset?formatted:[...prev,...formatted]);
    setTotal(data.total_results||0);
    setLoading(false);
  },[]);

  useEffect(()=>{ setPage(1); load(cat,1,true); },[cat]);

  return (
    <div style={{ height:"100vh", overflowY:"auto", paddingBottom:80 }}>
      <div style={{ position:"sticky", top:0, zIndex:50,
        background:"rgba(6,6,18,0.98)", backdropFilter:"blur(20px)",
        borderBottom:"1px solid rgba(255,255,255,0.06)", padding:"14px 16px 0" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
          <Logo size={20}/>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={()=>setView(v=>v==="grid"?"list":"grid")}
              style={{ background:"rgba(255,255,255,0.07)", border:"none",
                color:"rgba(255,255,255,0.7)", width:36, height:36, borderRadius:10,
                cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
              {view==="grid"?<IList/>:<IGrid/>}
            </button>
          </div>
        </div>
        <div style={{ display:"flex", gap:8, overflowX:"auto", scrollbarWidth:"none", paddingBottom:12 }}>
          {CATS.map(c=>(
            <button key={c.id} onClick={()=>setCat(c.id)} style={{
              flexShrink:0, padding:"7px 16px", borderRadius:22,
              border: cat===c.id?"none":"1px solid rgba(255,255,255,0.12)",
              background: cat===c.id?"linear-gradient(90deg,#ff4e6a,#ff7e42)":"rgba(255,255,255,0.05)",
              color: cat===c.id?"#fff":"rgba(255,255,255,0.5)",
              fontSize:13, fontWeight:600, cursor:"pointer",
              fontFamily:"'Montserrat',sans-serif", whiteSpace:"nowrap",
              boxShadow:cat===c.id?"0 4px 14px rgba(255,78,106,0.35)":"none" }}>
              {c.icon} {c.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding:"10px 16px 8px", fontSize:13, color:"rgba(255,255,255,0.35)",
        fontFamily:"'Montserrat',sans-serif" }}>
        Найдено: <span style={{ color:"rgba(255,255,255,0.65)", fontWeight:700 }}>{total.toLocaleString()}</span>
      </div>

      {view==="grid"
        ? <div className="catalog-grid" style={{ padding:"0 16px" }}>
            {items.map(s=><Card key={s.id} item={s} onClick={onSelect}/>)}
          </div>
        : <div style={{ padding:"0 16px" }}>
            {items.map(s=><CardRow key={s.id} item={s} onClick={onSelect}/>)}
          </div>}

      {loading && <Spinner/>}

      {!loading && items.length>0 && (
        <div style={{ textAlign:"center", padding:"24px 0 12px" }}>
          <button onClick={()=>{ const next=page+1; setPage(next); load(cat,next,false); }}
            style={{ padding:"11px 36px",
              background:"rgba(255,78,106,0.12)", border:"1px solid rgba(255,78,106,0.3)",
              color:"#ff7e8e", borderRadius:12, fontSize:14, fontWeight:600, cursor:"pointer",
              fontFamily:"'Montserrat',sans-serif" }}>
            Загрузить ещё
          </button>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  SEARCH PAGE
// ═══════════════════════════════════════════════════════════
const POPULAR_Q = ["Корейская дорама","Аниме 2024","Боевик","Комедия","Мелодрама","Фэнтези","Триллер","Исторический"];

function SearchPage({ onSelect }) {
  const [query,   setQuery]   = useState("");
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
      const data = await searchAll(query);
      setResults((data.results||[]).filter(r=>r.media_type!=="person").map(formatItem));
      setLoading(false);
    }, 500);
  },[query]);

  const handleSelect = s => {
    if (query.trim()) setHistory(h=>[query,...h.filter(x=>x!==query)].slice(0,6));
    onSelect(s);
  };

  return (
    <div style={{ height:"100vh", overflowY:"auto", paddingBottom:80,
      background:"#060612", color:"#fff" }}>
      <div style={{ position:"sticky", top:0, zIndex:50,
        background:"rgba(6,6,18,0.98)", backdropFilter:"blur(20px)",
        borderBottom:"1px solid rgba(255,255,255,0.06)", padding:"16px 16px 14px" }}>
        <div style={{ marginBottom:14 }}><Logo size={20}/></div>
        <div style={{ position:"relative" }}>
          <div style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)",
            color:"rgba(255,255,255,0.3)" }}><ISearch/></div>
          <input ref={inputRef} value={query} onChange={e=>setQuery(e.target.value)}
            placeholder="Фильмы, сериалы, аниме, дорамы..."
            style={{ width:"100%", padding:"13px 44px 13px 46px",
              background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.1)",
              borderRadius:13, color:"#fff", fontSize:15, outline:"none",
              fontFamily:"'Montserrat',sans-serif", boxSizing:"border-box" }}
            onFocus={e=>e.target.style.borderColor="rgba(255,78,106,0.5)"}
            onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.1)"}/>
          {query&&<button onClick={()=>setQuery("")}
            style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)",
              background:"rgba(255,255,255,0.12)", border:"none", color:"rgba(255,255,255,0.6)",
              width:24, height:24, borderRadius:"50%", cursor:"pointer",
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>×</button>}
        </div>
      </div>

      <div style={{ padding:"16px 16px 0" }}>
        {loading && <Spinner/>}
        {!loading && results.length>0 && (
          <div>
            <div style={{ fontSize:13, color:"rgba(255,255,255,0.35)", marginBottom:14,
              fontFamily:"'Montserrat',sans-serif" }}>
              Найдено: <span style={{ color:"rgba(255,255,255,0.65)", fontWeight:700 }}>{results.length}</span>
            </div>
            {results.map(s=><CardRow key={s.id} item={s} onClick={handleSelect}/>)}
          </div>
        )}
        {!loading && query && results.length===0 && (
          <div style={{ textAlign:"center", padding:"60px 0" }}>
            <div style={{ fontSize:52, marginBottom:14 }}>😔</div>
            <div style={{ fontSize:16, color:"rgba(255,255,255,0.5)",
              fontFamily:"'Montserrat',sans-serif" }}>Ничего не найдено</div>
          </div>
        )}
        {!query && (
          <>
            {history.length>0 && (
              <div style={{ marginBottom:28 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:"rgba(255,255,255,0.4)",
                    fontFamily:"'Montserrat',sans-serif" }}>ИСТОРИЯ</div>
                  <button onClick={()=>setHistory([])}
                    style={{ background:"none", border:"none", color:"rgba(255,255,255,0.28)",
                      fontSize:12, cursor:"pointer", fontFamily:"'Montserrat',sans-serif" }}>Очистить</button>
                </div>
                {history.map(h=>(
                  <div key={h} onClick={()=>setQuery(h)}
                    style={{ display:"flex", gap:14, padding:"11px 12px", borderRadius:11,
                      cursor:"pointer", alignItems:"center" }}
                    onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.05)"}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <span style={{ opacity:0.35, fontSize:16 }}>🕐</span>
                    <span style={{ fontSize:14, color:"rgba(255,255,255,0.65)", flex:1,
                      fontFamily:"'Montserrat',sans-serif" }}>{h}</span>
                    <span onClick={e=>{e.stopPropagation();setHistory(p=>p.filter(x=>x!==h));}}
                      style={{ color:"rgba(255,255,255,0.2)", cursor:"pointer", fontSize:18 }}>×</span>
                  </div>
                ))}
              </div>
            )}
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:"rgba(255,255,255,0.4)", marginBottom:14,
                fontFamily:"'Montserrat',sans-serif" }}>ПОПУЛЯРНЫЕ ЗАПРОСЫ</div>
              <div style={{ display:"flex", gap:9, flexWrap:"wrap" }}>
                {POPULAR_Q.map(q=>(
                  <button key={q} onClick={()=>setQuery(q)} style={{
                    padding:"8px 16px", borderRadius:22,
                    background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
                    color:"rgba(255,255,255,0.6)", fontSize:13, fontWeight:600,
                    cursor:"pointer", fontFamily:"'Montserrat',sans-serif" }}>🔍 {q}</button>
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
//  WATCH PAGE
// ═══════════════════════════════════════════════════════════
function WatchPage({ item: s, onBack, isFav, onToggleFav }) {
  const [ep,      setEp]      = useState(1);
  const [bm,      setBm]      = useState(isFav||false);
  const [exp,     setExp]     = useState(false);
  const [playing, setPlay]    = useState(false);
  const [details, setDetails] = useState(null);

  useEffect(()=>{
    fetchDetails(s.id, s.type||"tv").then(setDetails).catch(()=>{});
    window.scrollTo(0,0);
  },[s.id]);

function WatchPage({ item: s, onBack, isFav, onToggleFav }) {
  const [ep,      setEp]      = useState(1);
  const [bm,      setBm]      = useState(isFav||false);
  const [exp,     setExp]     = useState(false);
  const [playing, setPlay]    = useState(false);
  const [details, setDetails] = useState(null);

  // Fix browser back button
  useEffect(()=>{
    window.history.pushState({ page:"watch" }, "");
    const handlePop = () => onBack();
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  },[]);

  useEffect(()=>{
    fetchDetails(s.id, s.type||"tv").then(setDetails).catch(()=>{});
    window.scrollTo(0,0);
  },[s.id]);

  const epCount  = details?.number_of_episodes || (s.isMovie ? 1 : 12);
  const cast     = details?.credits?.cast?.slice(0,8) || [];
  const director = details?.credits?.crew?.find(c=>c.job==="Director");
  const desc     = details?.overview || s.desc;
  const rating   = details?.vote_average ? (details.vote_average/2).toFixed(1) : s.rating;
  const backdrop = details?.backdrop_path ? IMGB+details.backdrop_path : s.backdrop;
  const genres   = details?.genres?.map(g=>g.name) || [];
  const episodes = Array.from({length:Math.min(epCount,150)},(_,i)=>({num:i+1,dur:`${s.isMovie?120:42+Math.floor(Math.random()*15)} мин`}));
  const goEp = n => { setEp(n); setPlay(false); };

  return (
    <div style={{ background:"#060612", minHeight:"100vh", color:"#fff" }}>

      {/* TOP NAV */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"12px 20px", position:"sticky", top:0, zIndex:50,
        background:"rgba(6,6,18,0.97)", backdropFilter:"blur(16px)",
        borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <button onClick={onBack} style={{ background:"rgba(255,255,255,0.08)", border:"none",
            color:"#fff", width:40, height:40, borderRadius:11, cursor:"pointer",
            display:"flex", alignItems:"center", justifyContent:"center" }}><IBack/></button>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.35)", display:"flex", gap:6,
            fontFamily:"'Montserrat',sans-serif", alignItems:"center" }}>
            <span onClick={onBack} style={{ cursor:"pointer", color:"rgba(255,255,255,0.6)" }}>Главная</span>
            <span>/</span>
            <span style={{ color:"rgba(255,255,255,0.35)", maxWidth:300,
              overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{s.title}</span>
          </div>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={()=>{setBm(b=>!b);onToggleFav&&onToggleFav();}}
            style={{ background:bm?"rgba(255,78,106,0.15)":"rgba(255,255,255,0.08)",
              border:bm?"1px solid rgba(255,78,106,0.4)":"1px solid transparent",
              color:"#fff", width:40, height:40, borderRadius:11, cursor:"pointer",
              display:"flex", alignItems:"center", justifyContent:"center" }}><IBm on={bm}/></button>
          <button style={{ background:"rgba(255,255,255,0.08)", border:"none", color:"#fff",
            width:40, height:40, borderRadius:11, cursor:"pointer",
            display:"flex", alignItems:"center", justifyContent:"center" }}><IShare/></button>
        </div>
      </div>

      {/* BACKDROP HERO */}
      <div style={{ position:"relative", height:420, overflow:"hidden" }}>
        {backdrop
          ? <img src={backdrop} alt={s.title}
              style={{ position:"absolute", inset:0, width:"100%", height:"100%",
                objectFit:"cover", objectPosition:"center 15%" }}/>
          : <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg,#1a0533,#0a1628)" }}/>}
        <div style={{ position:"absolute", inset:0,
          background:"linear-gradient(to bottom,rgba(0,0,0,0.3) 0%,rgba(6,6,18,1) 100%)" }}/>
      </div>

      {/* MAIN CONTENT — two column on desktop */}
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 24px 60px" }}>
        <div className="watch-layout">

          {/* LEFT — poster + info */}
          <div className="watch-left">
            {/* Poster */}
            <div style={{ width:"100%", aspectRatio:"2/3", borderRadius:18, overflow:"hidden",
              boxShadow:"0 20px 60px rgba(0,0,0,0.8)", border:"2px solid rgba(255,255,255,0.1)",
              marginTop:-120, position:"relative", zIndex:2 }}>
              <PosterImg item={s} fontSize={60}/>
            </div>

            {/* Action buttons */}
            <div style={{ display:"flex", flexDirection:"column", gap:10, marginTop:16 }}>
              <button onClick={()=>setPlay(true)} style={{ width:"100%", padding:"14px",
                background:"linear-gradient(90deg,#ff4e6a,#ff7e42)", border:"none",
                color:"#fff", borderRadius:12, fontSize:15, fontWeight:700, cursor:"pointer",
                display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                fontFamily:"'Montserrat',sans-serif",
                boxShadow:"0 6px 24px rgba(255,78,106,0.45)" }}>
                <IPlay s={18}/> {s.isMovie ? "Смотреть фильм" : `Серия ${ep}`}
              </button>
              <button onClick={()=>{setBm(b=>!b);onToggleFav&&onToggleFav();}}
                style={{ width:"100%", padding:"12px",
                  background: bm?"rgba(255,78,106,0.15)":"rgba(255,255,255,0.07)",
                  border: bm?"1px solid rgba(255,78,106,0.4)":"1px solid rgba(255,255,255,0.12)",
                  color: bm?"#ff4e6a":"rgba(255,255,255,0.7)", borderRadius:12,
                  fontSize:14, fontWeight:600, cursor:"pointer",
                  display:"flex", alignItems:"center", justifyContent:"center", gap:7,
                  fontFamily:"'Montserrat',sans-serif" }}>
                <IBm on={bm}/> {bm?"В избранном":"В избранное"}
              </button>
            </div>

            {/* Info table */}
            <div style={{ marginTop:16, background:"rgba(255,255,255,0.04)",
              borderRadius:14, border:"1px solid rgba(255,255,255,0.07)", overflow:"hidden" }}>
              {[
                ["Год", s.year],
                !s.isMovie&&["Серий", String(epCount)],
                director&&["Режиссёр", director.name],
                details?.networks?.[0]&&["Канал", details.networks[0].name],
                details?.production_countries?.[0]&&["Страна", details.production_countries[0].name],
              ].filter(Boolean).map(([k,v],i,arr)=>(
                <div key={k} style={{ display:"flex", justifyContent:"space-between",
                  alignItems:"center", padding:"11px 14px",
                  borderBottom:i<arr.length-1?"1px solid rgba(255,255,255,0.05)":"none" }}>
                  <span style={{ color:"rgba(255,255,255,0.35)", fontSize:12,
                    fontFamily:"'Montserrat',sans-serif" }}>{k}</span>
                  <span style={{ color:"rgba(255,255,255,0.8)", fontSize:12, fontWeight:600,
                    fontFamily:"'Montserrat',sans-serif", textAlign:"right", maxWidth:160 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — details + player + episodes */}
          <div className="watch-right">
            {/* Title block */}
            <div style={{ marginTop:16 }}>
              <div style={{ display:"flex", gap:8, marginBottom:10, flexWrap:"wrap" }}>
                {s.tag&&<Tag label={s.tag} color={s.tagColor}/>}
                <TypeBadge isMovie={s.isMovie}/>
              </div>
              <div style={{ fontSize:36, fontWeight:900, color:"#fff", lineHeight:1.1,
                fontFamily:"'Montserrat',sans-serif", letterSpacing:"-0.02em", marginBottom:8 }}>
                {details?.name||details?.title||s.title}
              </div>
              <div style={{ color:"rgba(255,255,255,0.4)", fontSize:14, marginBottom:14,
                fontFamily:"'Montserrat',sans-serif" }}>{s.en}</div>
              <div style={{ display:"flex", gap:12, alignItems:"center", marginBottom:16, flexWrap:"wrap" }}>
                <div style={{ display:"flex", alignItems:"center", gap:5,
                  background:"rgba(255,215,0,0.1)", borderRadius:9, padding:"5px 12px",
                  border:"1px solid rgba(255,215,0,0.2)" }}>
                  <IStar s={14}/><span style={{ color:"#FFD700", fontWeight:700, fontSize:15,
                    fontFamily:"'Montserrat',sans-serif" }}>{rating}</span>
                </div>
                {[s.year, s.isMovie?null:`${epCount} сер.`].filter(Boolean).map(v=>
                  <span key={v} style={{ color:"rgba(255,255,255,0.5)", fontSize:14,
                    fontFamily:"'Montserrat',sans-serif" }}>{v}</span>)}
              </div>
              {genres.length>0&&<div style={{ display:"flex", gap:7, flexWrap:"wrap", marginBottom:16 }}>
                {genres.map(g=><span key={g} style={{ background:"rgba(255,78,106,0.1)", color:"#ff9eaa",
                  fontSize:12, padding:"5px 13px", borderRadius:9, fontFamily:"'Montserrat',sans-serif",
                  border:"1px solid rgba(255,78,106,0.2)" }}>{g}</span>)}
              </div>}
            </div>

            {/* Description */}
            <div style={{ marginBottom:20 }}>
              <div style={{ color:"rgba(255,255,255,0.65)", fontSize:14, lineHeight:1.85,
                fontFamily:"'Montserrat',sans-serif",
                overflow:"hidden", maxHeight:exp?"none":"88px",
                maskImage:exp?"none":"linear-gradient(to bottom,black 50%,transparent 100%)",
                WebkitMaskImage:exp?"none":"linear-gradient(to bottom,black 50%,transparent 100%)" }}>{desc}</div>
              <button onClick={()=>setExp(e=>!e)} style={{ background:"none", border:"none",
                color:"#ff4e6a", fontSize:13, fontWeight:700, cursor:"pointer",
                marginTop:6, padding:0, fontFamily:"'Montserrat',sans-serif" }}>
                {exp?"Свернуть ↑":"Читать далее ↓"}</button>
            </div>

            {/* Cast */}
            {cast.length>0&&<div style={{ marginBottom:24 }}>
              <div style={{ fontSize:13, fontWeight:700, color:"rgba(255,255,255,0.4)", marginBottom:14,
                fontFamily:"'Montserrat',sans-serif", letterSpacing:"0.04em" }}>В ГЛАВНЫХ РОЛЯХ</div>
              <div style={{ display:"flex", gap:14, overflowX:"auto", scrollbarWidth:"none", paddingBottom:4 }}>
                {cast.map(actor=>(
                  <div key={actor.id} style={{ flexShrink:0, textAlign:"center", width:72 }}>
                    <div style={{ width:68, height:68, borderRadius:"50%", margin:"0 auto 8px",
                      overflow:"hidden", border:"2px solid rgba(255,78,106,0.3)",
                      boxShadow:"0 4px 14px rgba(0,0,0,0.5)" }}>
                      <ActorPhoto actor={actor}/>
                    </div>
                    <div style={{ color:"rgba(255,255,255,0.75)", fontSize:11, fontWeight:600,
                      fontFamily:"'Montserrat',sans-serif", lineHeight:1.3,
                      display:"-webkit-box", WebkitLineClamp:2,
                      WebkitBoxOrient:"vertical", overflow:"hidden" }}>{actor.name}</div>
                    {actor.character&&<div style={{ color:"rgba(255,255,255,0.3)", fontSize:9.5, marginTop:2,
                      fontFamily:"'Montserrat',sans-serif", overflow:"hidden",
                      textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{actor.character}</div>}
                  </div>
                ))}
              </div>
            </div>}

            {/* PLAYER */}
            <div style={{ marginBottom:24 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                <div style={{ width:4, height:22, background:"linear-gradient(180deg,#ff4e6a,#ff7e42)", borderRadius:2 }}/>
                <span style={{ fontSize:17, fontWeight:800, fontFamily:"'Montserrat',sans-serif" }}>
                  {s.isMovie ? "Смотреть фильм" : `Серия ${ep} из ${epCount}`}
                </span>
              </div>
              <div style={{ position:"relative", aspectRatio:"16/9", background:"#000",
                borderRadius:16, overflow:"hidden", boxShadow:"0 10px 40px rgba(0,0,0,0.7)" }}>
                {backdrop
                  ? <img src={backdrop} alt="" style={{ position:"absolute", inset:0, width:"100%",
                      height:"100%", objectFit:"cover", objectPosition:"center 15%", opacity:0.5 }}/>
                  : <PosterImg item={s} style={{ position:"absolute", inset:0, opacity:0.4 }} fontSize={80}/>}
                <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.45)" }}/>
                {!playing
                  ? <div style={{ position:"absolute", inset:0, display:"flex",
                      flexDirection:"column", alignItems:"center", justifyContent:"center", gap:14 }}>
                      <button onClick={()=>setPlay(true)} style={{ width:76, height:76, borderRadius:"50%",
                        background:"linear-gradient(135deg,#ff4e6a,#ff7e42)", border:"none", color:"#fff",
                        cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
                        boxShadow:"0 0 60px rgba(255,78,106,0.7)", transition:"transform 0.2s" }}
                        onMouseEnter={e=>e.currentTarget.style.transform="scale(1.1)"}
                        onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
                        <IPlay s={30}/>
                      </button>
                      <div style={{ textAlign:"center" }}>
                        <div style={{ color:"rgba(255,255,255,0.9)", fontSize:15, fontWeight:700,
                          fontFamily:"'Montserrat',sans-serif" }}>
                          {s.isMovie?"Нажмите для просмотра":`Серия ${ep}`}
                        </div>
                        <div style={{ color:"rgba(255,255,255,0.35)", fontSize:12, marginTop:4,
                          fontFamily:"'Montserrat',sans-serif" }}>Плеер подключается...</div>
                      </div>
                    </div>
                  : <div style={{ position:"absolute", inset:0, display:"flex",
                      alignItems:"center", justifyContent:"center", flexDirection:"column", gap:12 }}>
                      <div style={{ width:48, height:48, border:"3px solid rgba(255,78,106,0.28)",
                        borderTop:"3px solid #ff4e6a", borderRadius:"50%", animation:"spin 0.9s linear infinite" }}/>
                      <div style={{ color:"rgba(255,255,255,0.4)", fontSize:13,
                        fontFamily:"'Montserrat',sans-serif" }}>Загружается плеер...</div>
                    </div>}
              </div>

              {/* Episode nav */}
              {!s.isMovie && <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                marginTop:10 }}>
                <button onClick={()=>ep>1&&goEp(ep-1)}
                  style={{ background:ep>1?"rgba(255,255,255,0.08)":"rgba(255,255,255,0.03)",
                    border:"none", color:ep>1?"#fff":"rgba(255,255,255,0.2)",
                    padding:"8px 18px", borderRadius:10, cursor:ep>1?"pointer":"default",
                    fontSize:13, fontWeight:600, fontFamily:"'Montserrat',sans-serif" }}>
                  ← {ep>1?`Серия ${ep-1}`:"Нет"}</button>
                <span style={{ fontSize:13, color:"rgba(255,255,255,0.4)", fontWeight:600,
                  fontFamily:"'Montserrat',sans-serif" }}>{ep} / {epCount}</span>
                <button onClick={()=>ep<epCount&&goEp(ep+1)}
                  style={{ background:ep<epCount?"linear-gradient(90deg,#ff4e6a,#ff7e42)":"rgba(255,255,255,0.03)",
                    border:"none", color:ep<epCount?"#fff":"rgba(255,255,255,0.2)",
                    padding:"8px 18px", borderRadius:10, cursor:ep<epCount?"pointer":"default",
                    fontSize:13, fontWeight:600, fontFamily:"'Montserrat',sans-serif",
                    boxShadow:ep<epCount?"0 3px 14px rgba(255,78,106,0.4)":"none" }}>
                  {ep<epCount?`Серия ${ep+1}`:"Нет"} →</button>
              </div>}
            </div>

            {/* EPISODES LIST */}
            {!s.isMovie && <div>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
                <div style={{ width:4, height:22, background:"linear-gradient(180deg,#ff4e6a,#ff7e42)", borderRadius:2 }}/>
                <span style={{ fontSize:17, fontWeight:800, fontFamily:"'Montserrat',sans-serif" }}>Все серии</span>
                <span style={{ fontSize:13, color:"rgba(255,255,255,0.3)",
                  fontFamily:"'Montserrat',sans-serif" }}>{epCount} серий</span>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:7,
                maxHeight:400, overflowY:"auto", scrollbarWidth:"none" }}>
                {episodes.map(e=>(
                  <div key={e.num} onClick={()=>goEp(e.num)}
                    style={{ display:"flex", alignItems:"center", gap:12, padding:"11px 14px",
                      borderRadius:12, cursor:"pointer",
                      background:ep===e.num?"linear-gradient(90deg,rgba(255,78,106,0.18),rgba(255,126,66,0.08))":"rgba(255,255,255,0.04)",
                      border:ep===e.num?"1px solid rgba(255,78,106,0.35)":"1px solid rgba(255,255,255,0.05)",
                      transition:"all 0.18s" }}
                    onMouseEnter={ev=>{if(ep!==e.num)ev.currentTarget.style.background="rgba(255,255,255,0.07)";}}
                    onMouseLeave={ev=>{if(ep!==e.num)ev.currentTarget.style.background="rgba(255,255,255,0.04)";}}>
                    <div style={{ width:38, height:38, borderRadius:10, flexShrink:0,
                      background:ep===e.num?"linear-gradient(135deg,#ff4e6a,#ff7e42)":"rgba(255,255,255,0.06)",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      color:ep===e.num?"#fff":"rgba(255,255,255,0.6)",
                      fontSize:12, fontWeight:700, fontFamily:"'Montserrat',sans-serif",
                      boxShadow:ep===e.num?"0 3px 12px rgba(255,78,106,0.45)":"none" }}>
                      {ep===e.num?<IPlay s={14}/>:e.num}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, fontWeight:700, fontFamily:"'Montserrat',sans-serif",
                        color:ep===e.num?"#fff":"rgba(255,255,255,0.7)" }}>Серия {e.num}</div>
                      <div style={{ fontSize:11, color:"rgba(255,255,255,0.28)", marginTop:2,
                        fontFamily:"'Montserrat',sans-serif" }}>{e.dur}</div>
                    </div>
                    {ep===e.num&&<div style={{ fontSize:11, color:"#ff4e6a", fontWeight:700,
                      background:"rgba(255,78,106,0.12)", padding:"3px 9px", borderRadius:6,
                      fontFamily:"'Montserrat',sans-serif" }}>СЕЙЧАС</div>}
                  </div>
                ))}
              </div>
            </div>}
          </div>
        </div>
      </div>
    </div>
  );
}

  return (
    <div className="watch-container" style={{ background:"#060612", minHeight:"100vh",
      color:"#fff", paddingBottom:80 }}>

      {/* TOP NAV */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"12px 16px", position:"sticky", top:0, zIndex:50,
        background:"rgba(6,6,18,0.97)", backdropFilter:"blur(16px)",
        borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
        <button onClick={onBack} style={{ background:"rgba(255,255,255,0.08)", border:"none",
          color:"#fff", width:40, height:40, borderRadius:11, cursor:"pointer",
          display:"flex", alignItems:"center", justifyContent:"center" }}><IBack/></button>
        <div style={{ fontSize:12, color:"rgba(255,255,255,0.35)", display:"flex", gap:6,
          fontFamily:"'Montserrat',sans-serif" }}>
          <span onClick={onBack} style={{ cursor:"pointer", color:"rgba(255,255,255,0.6)" }}>Главная</span>
          <span>/</span>
          <span style={{ color:"rgba(255,255,255,0.25)", maxWidth:180,
            overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{s.title}</span>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={()=>{setBm(b=>!b);onToggleFav&&onToggleFav();}}
            style={{ background:bm?"rgba(255,78,106,0.15)":"rgba(255,255,255,0.08)",
              border:bm?"1px solid rgba(255,78,106,0.4)":"1px solid transparent",
              color:"#fff", width:40, height:40, borderRadius:11, cursor:"pointer",
              display:"flex", alignItems:"center", justifyContent:"center" }}><IBm on={bm}/></button>
          <button style={{ background:"rgba(255,255,255,0.08)", border:"none", color:"#fff",
            width:40, height:40, borderRadius:11, cursor:"pointer",
            display:"flex", alignItems:"center", justifyContent:"center" }}><IShare/></button>
        </div>
      </div>

      {/* HERO */}
      <div style={{ position:"relative", height:280, overflow:"hidden" }}>
        {backdrop
          ? <img src={backdrop} alt={s.title}
              style={{ position:"absolute", inset:0, width:"100%", height:"100%",
                objectFit:"cover", objectPosition:"center 20%" }}/>
          : <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg,#1a0533,#0a1628)" }}/>}
        <div style={{ position:"absolute", inset:0,
          background:"linear-gradient(to bottom,rgba(0,0,0,0.15) 0%,rgba(6,6,18,1) 100%)" }}/>
        <div style={{ position:"absolute", bottom:0, left:0, right:0,
          padding:"0 18px 20px", display:"flex", gap:16, alignItems:"flex-end" }}>
          <div style={{ width:90, height:126, borderRadius:13, overflow:"hidden", flexShrink:0,
            boxShadow:"0 10px 32px rgba(0,0,0,0.8)", border:"2px solid rgba(255,255,255,0.12)" }}>
            <PosterImg item={s} fontSize={30}/>
          </div>
          <div style={{ flex:1, minWidth:0, paddingBottom:4 }}>
            <div style={{ display:"flex", gap:7, marginBottom:7, flexWrap:"wrap" }}>
              {s.tag&&<Tag label={s.tag} color={s.tagColor}/>}
              <TypeBadge isMovie={s.isMovie}/>
            </div>
            <div style={{ fontSize:22, fontWeight:800, color:"#fff", lineHeight:1.15,
              fontFamily:"'Montserrat',sans-serif", letterSpacing:"-0.01em", marginBottom:5 }}>
              {details?.name||details?.title||s.title}
            </div>
            <div style={{ color:"rgba(255,255,255,0.35)", fontSize:12, marginBottom:8,
              fontFamily:"'Montserrat',sans-serif" }}>{s.en}</div>
            <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
              <div style={{ display:"flex", alignItems:"center", gap:4,
                background:"rgba(0,0,0,0.5)", backdropFilter:"blur(6px)",
                borderRadius:8, padding:"4px 9px" }}>
                <IStar s={13}/><span style={{ color:"#FFD700", fontWeight:700, fontSize:13,
                  fontFamily:"'Montserrat',sans-serif" }}>{rating}</span>
              </div>
              {[s.year, s.isMovie?null:`${epCount} сер.`].filter(Boolean).map(v=>
                <span key={v} style={{ color:"rgba(255,255,255,0.5)", fontSize:12,
                  fontFamily:"'Montserrat',sans-serif" }}>{v}</span>)}
            </div>
          </div>
        </div>
      </div>

      {/* GENRES */}
      {genres.length>0&&<div style={{ padding:"14px 18px 0", display:"flex", gap:7, flexWrap:"wrap" }}>
        {genres.map(g=><span key={g} style={{ background:"rgba(255,78,106,0.1)", color:"#ff9eaa",
          fontSize:12, padding:"5px 13px", borderRadius:9, fontFamily:"'Montserrat',sans-serif",
          border:"1px solid rgba(255,78,106,0.2)" }}>{g}</span>)}
      </div>}

      {/* DESC */}
      <div style={{ padding:"14px 18px" }}>
        <div style={{ color:"rgba(255,255,255,0.6)", fontSize:14, lineHeight:1.8,
          fontFamily:"'Montserrat',sans-serif",
          overflow:"hidden", maxHeight:exp?"none":"62px",
          maskImage:exp?"none":"linear-gradient(to bottom,black 40%,transparent 100%)",
          WebkitMaskImage:exp?"none":"linear-gradient(to bottom,black 40%,transparent 100%)" }}>{desc}</div>
        <button onClick={()=>setExp(e=>!e)} style={{ background:"none", border:"none",
          color:"#ff4e6a", fontSize:13, fontWeight:700, cursor:"pointer",
          marginTop:6, padding:0, fontFamily:"'Montserrat',sans-serif" }}>
          {exp?"Свернуть ↑":"Читать далее ↓"}</button>
      </div>

      {/* CAST — with real photos */}
      {cast.length>0&&<div style={{ padding:"0 18px 16px" }}>
        <div style={{ fontSize:13, fontWeight:700, color:"rgba(255,255,255,0.4)", marginBottom:12,
          fontFamily:"'Montserrat',sans-serif", letterSpacing:"0.04em" }}>В ГЛАВНЫХ РОЛЯХ</div>
        <div style={{ display:"flex", gap:14, overflowX:"auto", scrollbarWidth:"none", paddingBottom:4 }}>
          {cast.map(actor=>(
            <div key={actor.id} style={{ flexShrink:0, textAlign:"center", width:68 }}>
              <div style={{ width:64, height:64, borderRadius:"50%", margin:"0 auto 7px",
                overflow:"hidden", border:"2px solid rgba(255,78,106,0.3)",
                boxShadow:"0 4px 12px rgba(0,0,0,0.4)" }}>
                <ActorPhoto actor={actor}/>
              </div>
              <div style={{ color:"rgba(255,255,255,0.7)", fontSize:10, fontWeight:600,
                fontFamily:"'Montserrat',sans-serif", lineHeight:1.3,
                display:"-webkit-box", WebkitLineClamp:2,
                WebkitBoxOrient:"vertical", overflow:"hidden" }}>{actor.name}</div>
              {actor.character&&<div style={{ color:"rgba(255,255,255,0.3)", fontSize:9, marginTop:2,
                fontFamily:"'Montserrat',sans-serif", overflow:"hidden",
                textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{actor.character}</div>}
            </div>
          ))}
        </div>
      </div>}

      {/* INFO TABLE */}
      <div style={{ margin:"0 18px 18px", background:"rgba(255,255,255,0.04)",
        borderRadius:14, border:"1px solid rgba(255,255,255,0.07)", overflow:"hidden" }}>
        {[
          ["Год", s.year],
          !s.isMovie&&["Серий", String(epCount)],
          director&&["Режиссёр", director.name],
          details?.networks?.[0]&&["Канал", details.networks[0].name],
          details?.production_countries?.[0]&&["Страна", details.production_countries[0].name],
        ].filter(Boolean).map(([k,v],i,arr)=>(
          <div key={k} style={{ display:"flex", justifyContent:"space-between",
            alignItems:"center", padding:"12px 16px",
            borderBottom:i<arr.length-1?"1px solid rgba(255,255,255,0.05)":"none" }}>
            <span style={{ color:"rgba(255,255,255,0.35)", fontSize:13,
              fontFamily:"'Montserrat',sans-serif" }}>{k}</span>
            <span style={{ color:"rgba(255,255,255,0.8)", fontSize:13, fontWeight:600,
              fontFamily:"'Montserrat',sans-serif" }}>{v}</span>
          </div>
        ))}
      </div>

      <div style={{ margin:"0 18px 18px", height:1, background:"rgba(255,255,255,0.06)" }}/>

      {/* PLAYER */}
      <div style={{ padding:"0 18px 10px", display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ width:4, height:20, background:"linear-gradient(180deg,#ff4e6a,#ff7e42)", borderRadius:2 }}/>
        <span style={{ fontSize:16, fontWeight:800, fontFamily:"'Montserrat',sans-serif" }}>
          {s.isMovie ? "Смотреть фильм" : `Смотреть · Серия ${ep} из ${epCount}`}
        </span>
      </div>

      <div style={{ position:"relative", aspectRatio:"16/9", background:"#000", overflow:"hidden" }}>
        {backdrop
          ? <img src={backdrop} alt="" style={{ position:"absolute", inset:0, width:"100%",
              height:"100%", objectFit:"cover", objectPosition:"center 20%", opacity:0.55 }}/>
          : <PosterImg item={s} style={{ position:"absolute", inset:0, opacity:0.4 }} fontSize={80}/>}
        <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.45)" }}/>
        {!playing
          ? <div style={{ position:"absolute", inset:0, display:"flex",
              flexDirection:"column", alignItems:"center", justifyContent:"center", gap:14 }}>
              <button onClick={()=>setPlay(true)} style={{ width:72, height:72, borderRadius:"50%",
                background:"linear-gradient(135deg,#ff4e6a,#ff7e42)", border:"none", color:"#fff",
                cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
                boxShadow:"0 0 50px rgba(255,78,106,0.6)", transition:"transform 0.2s" }}
                onMouseEnter={e=>e.currentTarget.style.transform="scale(1.08)"}
                onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
                <IPlay s={28}/>
              </button>
              <div style={{ textAlign:"center" }}>
                <div style={{ color:"rgba(255,255,255,0.85)", fontSize:15, fontWeight:700,
                  fontFamily:"'Montserrat',sans-serif" }}>
                  {s.isMovie ? "Нажмите для просмотра" : `Серия ${ep}`}
                </div>
                <div style={{ color:"rgba(255,255,255,0.3)", fontSize:12, marginTop:3,
                  fontFamily:"'Montserrat',sans-serif" }}>Плеер подключается...</div>
              </div>
            </div>
          : <div style={{ position:"absolute", inset:0, display:"flex",
              alignItems:"center", justifyContent:"center", flexDirection:"column", gap:10 }}>
              <div style={{ width:44, height:44, border:"3px solid rgba(255,78,106,0.28)",
                borderTop:"3px solid #ff4e6a", borderRadius:"50%", animation:"spin 0.9s linear infinite" }}/>
              <div style={{ color:"rgba(255,255,255,0.4)", fontSize:13,
                fontFamily:"'Montserrat',sans-serif" }}>Загружается плеер...</div>
            </div>}
        <div style={{ position:"absolute", top:10, left:10, background:"rgba(0,0,0,0.72)",
          backdropFilter:"blur(8px)", borderRadius:8, padding:"4px 11px",
          fontSize:12, color:"rgba(255,255,255,0.8)", fontWeight:600,
          fontFamily:"'Montserrat',sans-serif" }}>
          {s.title}{!s.isMovie&&` · Серия ${ep}`}
        </div>
      </div>

      {/* EP NAV */}
      {!s.isMovie && <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"10px 16px", background:"rgba(255,255,255,0.03)",
        borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
        <button onClick={()=>ep>1&&goEp(ep-1)}
          style={{ background:ep>1?"rgba(255,255,255,0.08)":"rgba(255,255,255,0.03)",
            border:"none", color:ep>1?"#fff":"rgba(255,255,255,0.2)",
            padding:"8px 16px", borderRadius:10, cursor:ep>1?"pointer":"default",
            fontSize:13, fontWeight:600, fontFamily:"'Montserrat',sans-serif" }}>
          ← {ep>1?`Серия ${ep-1}`:"Нет"}</button>
        <span style={{ fontSize:13, color:"rgba(255,255,255,0.4)", fontWeight:600,
          fontFamily:"'Montserrat',sans-serif" }}>{ep} / {epCount}</span>
        <button onClick={()=>ep<epCount&&goEp(ep+1)}
          style={{ background:ep<epCount?"linear-gradient(90deg,#ff4e6a,#ff7e42)":"rgba(255,255,255,0.03)",
            border:"none", color:ep<epCount?"#fff":"rgba(255,255,255,0.2)",
            padding:"8px 16px", borderRadius:10, cursor:ep<epCount?"pointer":"default",
            fontSize:13, fontWeight:600, fontFamily:"'Montserrat',sans-serif",
            boxShadow:ep<epCount?"0 3px 12px rgba(255,78,106,0.4)":"none" }}>
          {ep<epCount?`Серия ${ep+1}`:"Нет"} →</button>
      </div>}

      {/* EPISODES */}
      {!s.isMovie && <div style={{ padding:"18px 18px 36px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
          <div style={{ width:4, height:20, background:"linear-gradient(180deg,#ff4e6a,#ff7e42)", borderRadius:2 }}/>
          <span style={{ fontSize:16, fontWeight:800, fontFamily:"'Montserrat',sans-serif" }}>Все серии</span>
          <span style={{ fontSize:13, color:"rgba(255,255,255,0.3)",
            fontFamily:"'Montserrat',sans-serif" }}>{epCount} серий</span>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
          {episodes.map(e=>(
            <div key={e.num} onClick={()=>goEp(e.num)}
              style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px",
                borderRadius:13, cursor:"pointer",
                background:ep===e.num?"linear-gradient(90deg,rgba(255,78,106,0.18),rgba(255,126,66,0.08))":"rgba(255,255,255,0.04)",
                border:ep===e.num?"1px solid rgba(255,78,106,0.35)":"1px solid rgba(255,255,255,0.05)",
                transition:"all 0.18s" }}
              onMouseEnter={ev=>{if(ep!==e.num)ev.currentTarget.style.background="rgba(255,255,255,0.07)";}}
              onMouseLeave={ev=>{if(ep!==e.num)ev.currentTarget.style.background="rgba(255,255,255,0.04)";}}>
              <div style={{ width:38, height:38, borderRadius:10, flexShrink:0,
                background:ep===e.num?"linear-gradient(135deg,#ff4e6a,#ff7e42)":"rgba(255,255,255,0.06)",
                display:"flex", alignItems:"center", justifyContent:"center",
                color:ep===e.num?"#fff":"rgba(255,255,255,0.6)",
                fontSize:12, fontWeight:700, fontFamily:"'Montserrat',sans-serif",
                boxShadow:ep===e.num?"0 3px 12px rgba(255,78,106,0.45)":"none" }}>
                {ep===e.num?<IPlay s={14}/>:e.num}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:700, fontFamily:"'Montserrat',sans-serif",
                  color:ep===e.num?"#fff":"rgba(255,255,255,0.7)" }}>Серия {e.num}</div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.28)", marginTop:2,
                  fontFamily:"'Montserrat',sans-serif" }}>{e.dur}</div>
              </div>
              {ep===e.num&&<div style={{ fontSize:11, color:"#ff4e6a", fontWeight:700,
                background:"rgba(255,78,106,0.12)", padding:"3px 9px", borderRadius:6,
                fontFamily:"'Montserrat',sans-serif" }}>СЕЙЧАС</div>}
            </div>
          ))}
        </div>
      </div>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  AUTH
// ═══════════════════════════════════════════════════════════
function AuthPage({ onLogin, onClose }) {
  const [mode,setMode]=useState("login");
  const [email,setEmail]=useState("");
  const [pass,setPass]=useState("");
  const [name,setName]=useState("");
  const [loading,setLoading]=useState(false);
  const [err,setErr]=useState("");
  const [showP,setShowP]=useState(false);

  const submit=()=>{
    setErr("");
    if(!email.trim()){setErr("Введите email");return;}
    if(!email.includes("@")){setErr("Неверный email");return;}
    if(pass.length<6){setErr("Пароль минимум 6 символов");return;}
    if(mode==="register"&&!name.trim()){setErr("Введите имя");return;}
    setLoading(true);
    setTimeout(()=>{setLoading(false);onLogin({name:name||email.split("@")[0],email});},1200);
  };

  return (
    <div onClick={onClose} className="auth-overlay" style={{ position:"fixed",inset:0,zIndex:200,
      background:"rgba(0,0,0,0.92)",backdropFilter:"blur(12px)",
      display:"flex",alignItems:"flex-end",justifyContent:"center" }}>
      <div onClick={e=>e.stopPropagation()} className="auth-box" style={{
        background:"linear-gradient(160deg,#0e0e22 0%,#090918 100%)",
        borderRadius:"24px 24px 0 0",width:"100%",maxWidth:680,
        border:"1px solid rgba(255,255,255,0.08)",
        boxShadow:"0 -24px 64px rgba(0,0,0,0.8)",
        padding:"22px 24px 40px",maxHeight:"92vh",overflowY:"auto" }}>
        <div style={{width:40,height:4,background:"rgba(255,255,255,0.15)",borderRadius:2,margin:"0 auto 22px"}}/>
        <button onClick={onClose} style={{position:"absolute",top:20,right:20,
          background:"rgba(255,255,255,0.08)",border:"none",color:"#fff",
          width:34,height:34,borderRadius:"50%",cursor:"pointer",
          display:"flex",alignItems:"center",justifyContent:"center",fontSize:17}}>×</button>
        <div style={{textAlign:"center",marginBottom:24}}>
          <Logo size={26}/>
          <div style={{color:"rgba(255,255,255,0.35)",fontSize:13,marginTop:6,fontFamily:"'Montserrat',sans-serif"}}>
            {mode==="login"?"Добро пожаловать!":"Создай аккаунт бесплатно"}
          </div>
        </div>
        <div style={{display:"flex",background:"rgba(255,255,255,0.05)",borderRadius:13,padding:4,marginBottom:24}}>
          {["login","register"].map(m=>(
            <button key={m} onClick={()=>{setMode(m);setErr("");}}
              style={{flex:1,padding:"10px",borderRadius:10,border:"none",
                background:mode===m?"linear-gradient(90deg,#ff4e6a,#ff7e42)":"transparent",
                color:mode===m?"#fff":"rgba(255,255,255,0.4)",
                fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"'Montserrat',sans-serif"}}>
              {m==="login"?"Войти":"Регистрация"}
            </button>
          ))}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:14,marginBottom:18}}>
          {mode==="register"&&(
            <div>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",marginBottom:7,fontWeight:600,fontFamily:"'Montserrat',sans-serif"}}>ИМЯ</div>
              <input value={name} onChange={e=>setName(e.target.value)} placeholder="Как тебя зовут?"
                style={{width:"100%",padding:"13px 16px",background:"rgba(255,255,255,0.06)",
                  border:"1px solid rgba(255,255,255,0.1)",borderRadius:12,color:"#fff",
                  fontSize:15,outline:"none",boxSizing:"border-box",fontFamily:"'Montserrat',sans-serif"}}/>
            </div>
          )}
          <div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",marginBottom:7,fontWeight:600,fontFamily:"'Montserrat',sans-serif"}}>EMAIL</div>
            <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="example@email.com" type="email"
              style={{width:"100%",padding:"13px 16px",background:"rgba(255,255,255,0.06)",
                border:"1px solid rgba(255,255,255,0.1)",borderRadius:12,color:"#fff",
                fontSize:15,outline:"none",boxSizing:"border-box",fontFamily:"'Montserrat',sans-serif"}}/>
          </div>
          <div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",marginBottom:7,fontWeight:600,fontFamily:"'Montserrat',sans-serif"}}>ПАРОЛЬ</div>
            <div style={{position:"relative"}}>
              <input value={pass} onChange={e=>setPass(e.target.value)}
                placeholder={mode==="register"?"Минимум 6 символов":"Введи пароль"}
                type={showP?"text":"password"} onKeyDown={e=>e.key==="Enter"&&submit()}
                style={{width:"100%",padding:"13px 48px 13px 16px",background:"rgba(255,255,255,0.06)",
                  border:"1px solid rgba(255,255,255,0.1)",borderRadius:12,color:"#fff",
                  fontSize:15,outline:"none",boxSizing:"border-box",fontFamily:"'Montserrat',sans-serif"}}/>
              <button onClick={()=>setShowP(s=>!s)}
                style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",
                  background:"none",border:"none",color:"rgba(255,255,255,0.35)",
                  cursor:"pointer",fontSize:18}}>{showP?"🙈":"👁"}</button>
            </div>
          </div>
        </div>
        {err&&<div style={{background:"rgba(255,78,106,0.12)",border:"1px solid rgba(255,78,106,0.3)",
          borderRadius:10,padding:"10px 14px",fontSize:13,color:"#ff9eaa",marginBottom:16,
          fontFamily:"'Montserrat',sans-serif"}}>⚠️ {err}</div>}
        <button onClick={submit} disabled={loading}
          style={{width:"100%",padding:"15px",
            background:loading?"rgba(255,255,255,0.1)":"linear-gradient(90deg,#ff4e6a,#ff7e42)",
            border:"none",color:"#fff",borderRadius:13,fontSize:16,fontWeight:700,
            cursor:loading?"default":"pointer",fontFamily:"'Montserrat',sans-serif",
            display:"flex",alignItems:"center",justifyContent:"center",gap:8,
            boxShadow:loading?"none":"0 6px 24px rgba(255,78,106,0.4)"}}>
          {loading?<><div style={{width:18,height:18,border:"2px solid rgba(255,255,255,0.3)",
            borderTop:"2px solid #fff",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>Загрузка...</>
            :mode==="login"?"Войти":"Создать аккаунт"}
        </button>
      </div>
    </div>
  );
}

function FavPage({ user, onLogin }) {
  if (!user) return (
    <div style={{height:"100vh",display:"flex",flexDirection:"column",alignItems:"center",
      justifyContent:"center",background:"#060612",color:"#fff",padding:"0 24px 80px",textAlign:"center"}}>
      <div style={{fontSize:68,marginBottom:22}}>❤️</div>
      <div style={{fontSize:26,fontWeight:800,fontFamily:"'Montserrat',sans-serif",marginBottom:12}}>Избранное</div>
      <div style={{color:"rgba(255,255,255,0.4)",fontSize:14,lineHeight:1.7,marginBottom:32,
        fontFamily:"'Montserrat',sans-serif"}}>
        Войди чтобы сохранять фильмы и сериалы
      </div>
      <button onClick={onLogin} style={{padding:"14px 36px",
        background:"linear-gradient(90deg,#ff4e6a,#ff7e42)",border:"none",
        color:"#fff",borderRadius:13,fontSize:15,fontWeight:700,cursor:"pointer",
        fontFamily:"'Montserrat',sans-serif",boxShadow:"0 6px 24px rgba(255,78,106,0.4)"}}>
        Войти / Зарегистрироваться
      </button>
    </div>
  );
  return (
    <div style={{height:"100vh",overflowY:"auto",paddingBottom:80,background:"#060612",color:"#fff"}}>
      <div style={{padding:"20px 18px",background:"rgba(6,6,18,0.98)",
        position:"sticky",top:0,zIndex:50,borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <Logo size={20}/>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:14,fontWeight:700,color:"#fff",fontFamily:"'Montserrat',sans-serif"}}>{user.name}</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.35)",fontFamily:"'Montserrat',sans-serif"}}>{user.email}</div>
            </div>
            <div style={{width:42,height:42,borderRadius:"50%",
              background:"linear-gradient(135deg,#ff4e6a,#ff7e42)",
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:18,fontWeight:700,color:"#fff",fontFamily:"'Montserrat',sans-serif"}}>
              {user.name[0].toUpperCase()}
            </div>
          </div>
        </div>
      </div>
      <div style={{padding:"24px 18px",textAlign:"center",color:"rgba(255,255,255,0.4)"}}>
        <div style={{fontSize:52,marginBottom:12}}>🔖</div>
        <div style={{fontSize:15,fontFamily:"'Montserrat',sans-serif"}}>
          Нажми ❤️ на странице фильма чтобы добавить в избранное
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  APP ROOT
// ═══════════════════════════════════════════════════════════
export default function App() {
  const [page,     setPage]    = useState("home");
  const [item,     setItem]    = useState(null);
  const [user,     setUser]    = useState(null);
  const [favIds,   setFavIds]  = useState([]);
  const [showAuth, setShowAuth]= useState(false);
  const [initCat,  setInitCat] = useState("trending");

  const openItem  = i => { setItem(i); setPage("watch"); };
  const goBack    = () => { setPage("home"); setItem(null); };
  const login     = u => { setUser(u); setShowAuth(false); };
  const toggleFav = id=> setFavIds(f=>f.includes(id)?f.filter(x=>x!==id):[...f,id]);

  const handleNav = (target, params={}) => {
    if (target==="catalog") { setInitCat(params.cat||"trending"); setPage("catalog"); }
    else if (target==="search") setPage("search");
    else if (target==="fav")    setPage("fav");
    else                        setPage("home");
    setItem(null);
  };

  const currentPage = item ? "watch" : page;

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"/>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        body{background:#060612;font-family:'Montserrat',sans-serif;}
        ::-webkit-scrollbar{display:none;}
        input::placeholder{color:rgba(255,255,255,0.26);font-family:'Montserrat',sans-serif;}
        @keyframes spin{to{transform:rotate(360deg);}}
        .page-wrap{width:100%;max-width:1400px;margin:0 auto;padding:0 20px;}
        .nav-wrap{width:100%;max-width:1400px;margin:0 auto;padding:0 20px;display:flex;align-items:center;justify-content:space-between;height:100%;}
        .desktop-nav{display:none;}
        .bottom-nav-bar{display:flex;}
        .section-cards{display:flex;gap:12px;overflow-x:auto;scrollbar-width:none;scroll-behavior:smooth;}
        .card-item{flex-shrink:0;width:140px;}
        .catalog-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px;}
        .auth-overlay{align-items:flex-end;}
        .auth-box{border-radius:24px 24px 0 0;width:100%;max-width:720px;}
        .watch-layout{display:flex;flex-direction:column;gap:24px;}
        .watch-left{width:100%;}
        .watch-right{width:100%;}
        @media(min-width:768px){
          .desktop-nav{display:flex;gap:28px;align-items:center;}
          .bottom-nav-bar{display:none!important;}
          .card-item{width:175px!important;}
          .catalog-grid{grid-template-columns:repeat(auto-fill,minmax(170px,1fr))!important;gap:18px!important;}
          .auth-overlay{align-items:center!important;}
          .auth-box{border-radius:22px!important;max-width:480px!important;}
          .watch-layout{flex-direction:row;align-items:flex-start;gap:40px;}
          .watch-left{width:260px;flex-shrink:0;position:sticky;top:74px;}
          .watch-right{flex:1;min-width:0;}
        }
        @media(min-width:1200px){
          .card-item{width:200px!important;}
          .catalog-grid{grid-template-columns:repeat(auto-fill,minmax(190px,1fr))!important;}
          .watch-left{width:300px;}
        }
      `}</style>
      <div style={{ background:"#060612", minHeight:"100vh" }}>
        {currentPage==="home"    && <HomePage    onSelect={openItem} onNav={handleNav} user={user} onLoginClick={()=>setShowAuth(true)}/>}
        {currentPage==="catalog" && <CatalogPage onSelect={openItem} initCat={initCat}/>}
        {currentPage==="search"  && <SearchPage  onSelect={openItem}/>}
        {currentPage==="fav"     && <FavPage     user={user} onLogin={()=>setShowAuth(true)}/>}
        {currentPage==="watch"   && item && <WatchPage item={item} onBack={goBack} isFav={favIds.includes(item.id)} onToggleFav={()=>toggleFav(item.id)}/>}
        {currentPage!=="watch"   && <BottomNav page={page} onNav={handleNav}/>}
        {showAuth && <AuthPage onLogin={login} onClose={()=>setShowAuth(false)}/>}
      </div>
    </>
  );
}
