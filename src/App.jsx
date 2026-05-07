import { useState, useEffect, useRef } from 'react';
import {
  Home, MessageCircle, BookOpen, Star, Settings,
  Send, ChevronLeft, ChevronRight, Search, Plus, X, Check,
  Crown, AlertTriangle, Heart,
} from 'lucide-react';
import {
  LANGUAGES, DENOMINATIONS, QUICK_TOPICS, BIBLE_TOPICS,
  CRISIS_LINES, getDailyVerse, t, containsCrisisKeywords,
} from './data.js';

const FREE_DAILY_LIMIT = 5;
const STORAGE_KEY = 'tyj_state';
const today = () => new Date().toDateString();
const loadState = () => { try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : null; } catch { return null; } };
const saveState = (s) => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch {} };
const greeting = (lang) => { const h = new Date().getHours(); if (h < 12) return t(lang,'greeting_morning'); if (h < 18) return t(lang,'greeting_afternoon'); return t(lang,'greeting_evening'); };

const S = {
  app: { minHeight:'100vh', background:'#f0f7ff', fontFamily:"'Inter','Segoe UI',sans-serif", color:'#1a2942', display:'flex', flexDirection:'column', maxWidth:480, margin:'0 auto', position:'relative', boxShadow:'0 0 60px rgba(0,0,0,0.12)' },
  screen: { flex:1, overflowY:'auto', paddingBottom:80 },
  header: { background:'linear-gradient(135deg,#1a6fa8 0%,#0d4d7a 100%)', color:'#fff', padding:'16px 20px', display:'flex', alignItems:'center', gap:12, boxShadow:'0 2px 12px rgba(26,111,168,0.3)', flexShrink:0 },
  headerTitle: { fontSize:18, fontWeight:700, flex:1, letterSpacing:0.3 },
  backBtn: { background:'rgba(255,255,255,0.2)', border:'none', borderRadius:8, padding:'6px 10px', color:'#fff', cursor:'pointer', display:'flex', alignItems:'center', gap:4, fontSize:14 },
  iconBtn: { background:'rgba(255,255,255,0.15)', border:'none', borderRadius:8, padding:8, color:'#fff', cursor:'pointer', display:'flex', alignItems:'center' },
  nav: { position:'fixed', bottom:0, left:'50%', transform:'translateX(-50%)', width:'100%', maxWidth:480, background:'#fff', borderTop:'1px solid #e8f0f8', display:'flex', zIndex:100, boxShadow:'0 -2px 20px rgba(0,0,0,0.08)' },
  navItem: (a) => ({ flex:1, display:'flex', flexDirection:'column', alignItems:'center', padding:'10px 4px 8px', cursor:'pointer', gap:4, color:a?'#1a6fa8':'#8a9ab0', background:'none', border:'none' }),
  navLabel: { fontSize:10, fontWeight:600, letterSpacing:0.3 },
  card: { background:'#fff', borderRadius:16, padding:20, boxShadow:'0 2px 12px rgba(0,0,0,0.06)', margin:'0 16px 16px' },
  btnP: { background:'linear-gradient(135deg,#1a6fa8,#0d4d7a)', color:'#fff', border:'none', borderRadius:12, padding:'14px 28px', fontSize:16, fontWeight:600, cursor:'pointer', width:'100%' },
  btnS: { background:'#f0f7ff', color:'#1a6fa8', border:'2px solid #1a6fa8', borderRadius:12, padding:'12px 24px', fontSize:15, fontWeight:600, cursor:'pointer', width:'100%' },
  btnG: { background:'linear-gradient(135deg,#D4A843,#B8860B)', color:'#fff', border:'none', borderRadius:12, padding:'14px 28px', fontSize:16, fontWeight:600, cursor:'pointer', width:'100%' },
  input: { width:'100%', padding:'12px 16px', borderRadius:12, border:'1.5px solid #dde8f5', background:'#f8fbff', fontSize:15, outline:'none', boxSizing:'border-box', fontFamily:'inherit' },
  ta: { width:'100%', padding:'12px 16px', borderRadius:12, border:'1.5px solid #dde8f5', background:'#f8fbff', fontSize:15, outline:'none', resize:'none', boxSizing:'border-box', fontFamily:'inherit' },
  welcomeBg: { minHeight:'100vh', background:'linear-gradient(160deg,#e8f4fd 0%,#f0f7ff 40%,#fff8e8 100%)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24 },
  logo: { width:80, height:80, background:'linear-gradient(135deg,#1a6fa8,#D4A843)', borderRadius:24, display:'flex', alignItems:'center', justifyContent:'center', fontSize:40, marginBottom:20, boxShadow:'0 8px 32px rgba(26,111,168,0.3)' },
};

const Toast = ({ message }) => (
  <div style={{ position:'fixed', top:20, left:'50%', transform:'translateX(-50%)', background:'#1a2942', color:'#fff', padding:'10px 20px', borderRadius:10, fontSize:14, zIndex:9999, boxShadow:'0 4px 20px rgba(0,0,0,0.2)' }}>{message}</div>
);

// ── Welcome Screen ────────────────────────────────────────────────────────────
const WelcomeScreen = ({ onSelect }) => (
  <div style={S.welcomeBg}>
    <div style={S.logo}>✝️</div>
    <h1 style={{ fontSize:32, fontWeight:800, color:'#1a2942', margin:'0 0 8px', textAlign:'center' }}>Thank You Jesus</h1>
    <p style={{ color:'#5a7a9a', fontSize:16, marginBottom:40, textAlign:'center' }}>Your companion for life's journey</p>
    <p style={{ fontWeight:700, color:'#1a2942', marginBottom:16, alignSelf:'flex-start', fontSize:14, textTransform:'uppercase', letterSpacing:0.5 }}>Choose your language</p>
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, width:'100%', maxWidth:400 }}>
      {LANGUAGES.map(lang => (
        <button key={lang.code} onClick={() => onSelect(lang.code)}
          style={{ background:'#fff', border:'2px solid #e8f0f8', borderRadius:12, padding:'14px 16px', cursor:'pointer', display:'flex', alignItems:'center', gap:10, fontSize:15, fontWeight:500, color:'#1a2942', textAlign:'left' }}
          onMouseOver={e => { e.currentTarget.style.borderColor='#1a6fa8'; e.currentTarget.style.background='#f0f7ff'; }}
          onMouseOut={e => { e.currentTarget.style.borderColor='#e8f0f8'; e.currentTarget.style.background='#fff'; }}>
          <span style={{ fontSize:24 }}>{lang.flag}</span>
          <div><div style={{ fontWeight:700 }}>{lang.nativeName}</div><div style={{ fontSize:12, color:'#8a9ab0' }}>{lang.name}</div></div>
        </button>
      ))}
    </div>
  </div>
);

// ── Denomination Screen ───────────────────────────────────────────────────────
const DenominationScreen = ({ lang, onSelect, onBack }) => (
  <div style={S.welcomeBg}>
    <button onClick={onBack} style={{ ...S.backBtn, alignSelf:'flex-start', background:'rgba(26,111,168,0.1)', color:'#1a6fa8', marginBottom:24 }}>
      <ChevronLeft size={16} /> {t(lang,'back')}
    </button>
    <div style={S.logo}>⛪</div>
    <h2 style={{ fontSize:24, fontWeight:800, color:'#1a2942', margin:'0 0 8px', textAlign:'center' }}>{t(lang,'selectDenomination')}</h2>
    <div style={{ display:'flex', flexDirection:'column', gap:12, width:'100%', maxWidth:400, marginTop:24 }}>
      {DENOMINATIONS.map(d => (
        <button key={d.id} onClick={() => onSelect(d.id)}
          style={{ background:'#fff', border:'2px solid #e8f0f8', borderRadius:14, padding:'16px 20px', cursor:'pointer', display:'flex', alignItems:'center', gap:14, fontSize:15, textAlign:'left' }}
          onMouseOver={e => { e.currentTarget.style.borderColor='#1a6fa8'; e.currentTarget.style.background='#f0f7ff'; }}
          onMouseOut={e => { e.currentTarget.style.borderColor='#e8f0f8'; e.currentTarget.style.background='#fff'; }}>
          <span style={{ fontSize:28 }}>{d.icon}</span>
          <div>
            <div style={{ fontWeight:700, color:'#1a2942' }}>{t(lang,d.key)}</div>
            <div style={{ fontSize:13, color:'#8a9ab0', marginTop:2 }}>{t(lang,d.key+'Desc')}</div>
          </div>
          <ChevronRight size={16} style={{ marginLeft:'auto', color:'#c0ccd8' }} />
        </button>
      ))}
    </div>
  </div>
);

// ── Disclaimer Screen ─────────────────────────────────────────────────────────
const DisclaimerScreen = ({ lang, onAgree, onBack }) => (
  <div style={S.welcomeBg}>
    <button onClick={onBack} style={{ ...S.backBtn, alignSelf:'flex-start', background:'rgba(26,111,168,0.1)', color:'#1a6fa8', marginBottom:24 }}>
      <ChevronLeft size={16} /> {t(lang,'back')}
    </button>
    <div style={{ fontSize:48, marginBottom:16 }}>📜</div>
    <h2 style={{ fontSize:24, fontWeight:800, color:'#1a2942', margin:'0 0 20px', textAlign:'center' }}>{t(lang,'disclaimerTitle')}</h2>
    <div style={{ background:'#fff', borderRadius:16, padding:24, maxWidth:400, marginBottom:32, boxShadow:'0 4px 20px rgba(0,0,0,0.06)' }}>
      <p style={{ color:'#4a5568', lineHeight:1.7, fontSize:15, margin:0 }}>{t(lang,'disclaimerText')}</p>
    </div>
    <div style={{ width:'100%', maxWidth:400 }}>
      <button onClick={onAgree} style={S.btnP}>{t(lang,'disclaimerAgree')}</button>
    </div>
  </div>
);

// ── Home Screen ───────────────────────────────────────────────────────────────
const HomeScreen = ({ lang, isPremium, msgLeft, onNavigate, onTopicChat, onSaveVerse }) => {
  const verse = getDailyVerse();
  const [saved, setSaved] = useState(false);
  const handleSave = () => { onSaveVerse(verse); setSaved(true); setTimeout(() => setSaved(false), 2000); };
  return (
    <div style={S.screen}>
      <div style={S.header}>
        <div>
          <div style={{ fontSize:13, opacity:0.8 }}>{greeting(lang)}</div>
          <div style={S.headerTitle}>{t(lang,'appName')}</div>
        </div>
        <button onClick={() => onNavigate('settings')} style={S.iconBtn}><Settings size={20} /></button>
      </div>

      {!isPremium && (
        <div style={{ background:'linear-gradient(135deg,#fff8e8,#fff3d4)', margin:'16px 16px 0', borderRadius:12, padding:'12px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', border:'1px solid #f0d88a' }}>
          <span style={{ fontSize:13, color:'#7B5A00' }}>
            <Crown size={14} style={{ verticalAlign:'middle', marginRight:6, color:'#D4A843' }} />
            <b>{msgLeft}</b> {t(lang,'freeMessages')}
          </span>
          <button onClick={() => onNavigate('premium')} style={{ background:'linear-gradient(135deg,#D4A843,#B8860B)', color:'#fff', border:'none', borderRadius:8, padding:'6px 12px', fontSize:12, fontWeight:700, cursor:'pointer' }}>
            {t(lang,'upgradeToPremium')}
          </button>
        </div>
      )}

      <div style={{ ...S.card, marginTop:16, background:'linear-gradient(135deg,#1a6fa8,#0d4d7a)', color:'#fff', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', right:-20, top:-20, fontSize:80, opacity:0.06 }}>✝️</div>
        <div style={{ fontSize:11, fontWeight:700, letterSpacing:1, opacity:0.7, marginBottom:10, textTransform:'uppercase' }}>{t(lang,'dailyVerse')}</div>
        <p style={{ fontSize:16, lineHeight:1.7, fontStyle:'italic', margin:'0 0 12px' }}>"{verse.text}"</p>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <span style={{ fontSize:13, fontWeight:700, opacity:0.9 }}>— {verse.ref}</span>
          <button onClick={handleSave} style={{ background:'rgba(255,255,255,0.2)', border:'none', borderRadius:8, padding:'6px 10px', color:'#fff', cursor:'pointer', fontSize:13, display:'flex', alignItems:'center', gap:4 }}>
            <Star size={14} fill={saved?'#FFD700':'none'} color={saved?'#FFD700':'#fff'} /> {saved?'✓':''}
          </button>
        </div>
      </div>

      <button onClick={() => onNavigate('bible')} style={{ margin:'0 16px 16px', background:'linear-gradient(135deg,#fff8e8,#fff3d0)', border:'2px solid #e8d080', borderRadius:14, padding:'16px 20px', cursor:'pointer', display:'flex', alignItems:'center', gap:14, width:'calc(100% - 32px)', textAlign:'left' }}>
        <div style={{ width:44, height:44, background:'linear-gradient(135deg,#D4A843,#B8860B)', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <BookOpen size={22} color="#fff" />
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:700, color:'#5C3A00', fontSize:16 }}>{t(lang,'openBible')}</div>
          <div style={{ fontSize:12, color:'#8a7040', marginTop:2 }}>Search verses, topics & chapters</div>
        </div>
        <ChevronRight size={18} color="#B8860B" />
      </button>

      <div style={{ padding:'0 16px', marginBottom:16 }}>
        <h3 style={{ fontSize:14, fontWeight:700, color:'#5a7a9a', margin:'0 0 12px', textTransform:'uppercase', letterSpacing:0.8 }}>{t(lang,'quickTopics')}</h3>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          {QUICK_TOPICS.map(topic => (
            <button key={topic.id} onClick={() => onTopicChat(topic.id)}
              style={{ background:topic.bg, border:'none', borderRadius:12, padding:'14px 16px', cursor:'pointer', display:'flex', alignItems:'center', gap:10, textAlign:'left' }}>
              <span style={{ fontSize:22 }}>{topic.icon}</span>
              <span style={{ fontSize:14, fontWeight:600, color:topic.color }}>{t(lang,topic.id)}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── Chat Screen ───────────────────────────────────────────────────────────────
const ChatScreen = ({ lang, denomination, isPremium, msgLeft, onMsgSent, onNavigate, initialTopic }) => {
  const [messages, setMessages] = useState([{ role:'assistant', text:t(lang,'chatWelcome') }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCrisis, setShowCrisis] = useState(false);
  const [showPremium, setShowPremium] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    if (initialTopic) {
      const label = t(lang, initialTopic);
      setMessages([{ role:'assistant', text:`Peace be with you. I see you want to talk about ${label.toLowerCase()}. Please share what is on your heart.` }]);
    }
  }, [initialTopic]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:'smooth' }); }, [messages, loading]);

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;
    if (!isPremium && msgLeft <= 0) { setShowPremium(true); return; }
    if (containsCrisisKeywords(text)) { setMessages(p => [...p, { role:'user', text }]); setShowCrisis(true); return; }
    setMessages(p => [...p, { role:'user', text }]);
    setInput('');
    setLoading(true);
    onMsgSent();
    try {
      const history = messages.slice(-6).map(m => ({ role:m.role, content:m.text }));
      const res = await fetch('/api/chat', { method:'POST', headers:{ 'Content-Type':'application/json' }, body:JSON.stringify({ message:text, denomination, lang, history }) });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setMessages(p => [...p, { role:'assistant', text:data.reply }]);
    } catch {
      const fb = {
        en: "Peace be with you. The AI backend needs to be set up on Vercel first — see the README for instructions. Until then, explore the Bible section for wisdom. 🙏\n\n— John 14:27: Peace I leave with you; my peace I give you.",
        sk: "Pokoj s tebou. Backend AI ešte treba nastaviť na Vercel — pozri README. Dovtedy môžeš skúmať Bibliu. 🙏\n\n— Ján 14:27",
        es: "La paz sea contigo. El backend de IA necesita configurarse en Vercel. Mientras tanto, explora la Biblia. 🙏",
      };
      setMessages(p => [...p, { role:'assistant', text:fb[lang]||fb.en }]);
    }
    setLoading(false);
  };

  const cl = CRISIS_LINES[lang] || CRISIS_LINES.en;

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh' }}>
      <div style={S.header}>
        <button onClick={() => onNavigate('home')} style={S.backBtn}><ChevronLeft size={16} /> {t(lang,'back')}</button>
        <div style={{ ...S.headerTitle, textAlign:'center' }}>{t(lang,'chatTitle')}</div>
        <div style={{ width:60 }} />
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'16px 16px 8px', display:'flex', flexDirection:'column', gap:12, background:'#f0f7ff' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display:'flex', justifyContent:msg.role==='user'?'flex-end':'flex-start', gap:8, alignItems:'flex-end' }}>
            {msg.role==='assistant' && (
              <div style={{ width:36, height:36, background:'linear-gradient(135deg,#1a6fa8,#D4A843)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>✝️</div>
            )}
            <div style={{ maxWidth:'78%', background:msg.role==='user'?'linear-gradient(135deg,#1a6fa8,#0d4d7a)':'#fff', color:msg.role==='user'?'#fff':'#1a2942', borderRadius:msg.role==='user'?'18px 18px 4px 18px':'18px 18px 18px 4px', padding:'12px 16px', fontSize:15, lineHeight:1.6, boxShadow:'0 2px 8px rgba(0,0,0,0.08)', whiteSpace:'pre-wrap' }}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display:'flex', alignItems:'flex-end', gap:8 }}>
            <div style={{ width:36, height:36, background:'linear-gradient(135deg,#1a6fa8,#D4A843)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>✝️</div>
            <div style={{ background:'#fff', borderRadius:'18px 18px 18px 4px', padding:'12px 18px', boxShadow:'0 2px 8px rgba(0,0,0,0.08)', color:'#8a9ab0', fontSize:14, fontStyle:'italic' }}>
              {t(lang,'chatTyping')} ✨
            </div>
          </div>
        )}
        {showCrisis && (
          <div style={{ background:'#fff3cd', border:'2px solid #ffc107', borderRadius:16, padding:20 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
              <AlertTriangle size={20} color="#856404" /><strong style={{ color:'#856404' }}>Important</strong>
            </div>
            <p style={{ color:'#856404', fontSize:14, lineHeight:1.6, margin:'0 0 16px' }}>{t(lang,'crisisDetected')}</p>
            <div style={{ background:'#fff', borderRadius:10, padding:'14px 16px', marginBottom:12, border:'1px solid #ffc107' }}>
              <div style={{ fontWeight:700, color:'#1a2942' }}>{cl.name}</div>
              <div style={{ fontSize:24, fontWeight:800, color:'#1a6fa8', margin:'4px 0' }}>{cl.number}</div>
              <div style={{ fontSize:12, color:'#8a9ab0' }}>{cl.region}</div>
            </div>
            <a href={`tel:${cl.number.replace(/\s/g,'')}`} style={{ display:'block', background:'#1a6fa8', color:'#fff', borderRadius:10, padding:'12px', textAlign:'center', textDecoration:'none', fontWeight:700, marginBottom:8, fontSize:14 }}>
              📞 {t(lang,'crisisCall')}
            </a>
            <button onClick={() => { setShowCrisis(false); setMessages(p => [...p, { role:'assistant', text:"I am here with you. You are loved beyond measure, and you do not carry this alone. Would you like to share what is in your heart?" }]); }} style={{ background:'none', border:'none', color:'#1a6fa8', cursor:'pointer', width:'100%', padding:'8px', fontSize:14 }}>
              {t(lang,'crisisContinue')}
            </button>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {showPremium && (
        <div style={{ background:'linear-gradient(135deg,#fff8e8,#fff3d0)', padding:16, borderTop:'1px solid #e8d080', display:'flex', alignItems:'center', gap:12 }}>
          <Crown size={20} color="#D4A843" />
          <span style={{ flex:1, fontSize:13, color:'#5C3A00' }}>{t(lang,'premiumBenefits')}</span>
          <button onClick={() => onNavigate('premium')} style={{ background:'linear-gradient(135deg,#D4A843,#B8860B)', color:'#fff', border:'none', borderRadius:8, padding:'8px 14px', fontSize:12, fontWeight:700, cursor:'pointer' }}>Premium</button>
        </div>
      )}

      <div style={{ background:'#fff', padding:'12px 16px', borderTop:'1px solid #e8f0f8', display:'flex', gap:10, alignItems:'flex-end', flexShrink:0 }}>
        <textarea value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key==='Enter'&&!e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
          placeholder={t(lang,'chatPlaceholder')} rows={1}
          style={{ ...S.ta, minHeight:44, maxHeight:120, flex:1, padding:'10px 14px', resize:'none' }} />
        <button onClick={() => sendMessage(input)} disabled={!input.trim()||loading}
          style={{ background:input.trim()&&!loading?'linear-gradient(135deg,#1a6fa8,#0d4d7a)':'#c0ccd8', border:'none', borderRadius:12, width:44, height:44, cursor:input.trim()&&!loading?'pointer':'default', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <Send size={18} color="#fff" />
        </button>
      </div>
    </div>
  );
};

// ── Bible Screen ──────────────────────────────────────────────────────────────
const BibleScreen = ({ lang, onBack, onSaveVerse }) => {
  const [search, setSearch] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [results, setResults] = useState(null);
  const [toast, setToast] = useState('');

  const doSearch = () => {
    const q = search.toLowerCase().trim();
    let found = [];
    for (const topic of BIBLE_TOPICS) {
      if (selectedTopic && topic.id !== selectedTopic) continue;
      for (const v of topic.verses) {
        if (!q || v.text.toLowerCase().includes(q) || v.ref.toLowerCase().includes(q) || topic.id.includes(q))
          found.push({ ...v, topicId:topic.id, topicIcon:topic.icon, topicColor:topic.color });
      }
    }
    setResults(found);
  };

  useEffect(() => { if (selectedTopic !== null) doSearch(); }, [selectedTopic]);

  const handleSave = (v) => { onSaveVerse({ text:v.text, ref:v.ref }); setToast(`⭐ Saved: ${v.ref}`); setTimeout(() => setToast(''), 2000); };

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh' }}>
      {toast && <Toast message={toast} />}
      <div style={S.header}>
        <button onClick={onBack} style={S.backBtn}><ChevronLeft size={16} /> {t(lang,'back')}</button>
        <div style={{ ...S.headerTitle, textAlign:'center' }}>{t(lang,'bibleTitle')}</div>
        <div style={{ width:60 }} />
      </div>
      <div style={{ flex:1, overflowY:'auto', padding:16 }}>
        <div style={{ display:'flex', gap:8, marginBottom:16 }}>
          <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => { if (e.key==='Enter') doSearch(); }} placeholder={t(lang,'bibleSearchPlaceholder')} style={{ ...S.input, flex:1 }} />
          <button onClick={doSearch} style={{ background:'#1a6fa8', border:'none', borderRadius:12, padding:'0 16px', cursor:'pointer', display:'flex', alignItems:'center' }}>
            <Search size={18} color="#fff" />
          </button>
        </div>
        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:12, fontWeight:700, color:'#8a9ab0', marginBottom:8, textTransform:'uppercase', letterSpacing:0.8 }}>{t(lang,'bibleTopics')}</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
            {BIBLE_TOPICS.map(topic => (
              <button key={topic.id} onClick={() => { const n = selectedTopic===topic.id?null:topic.id; setSelectedTopic(n); if (!n) setResults(null); }}
                style={{ background:selectedTopic===topic.id?topic.color:'#f0f7ff', color:selectedTopic===topic.id?'#fff':topic.color, border:`1.5px solid ${topic.color}`, borderRadius:20, padding:'6px 14px', cursor:'pointer', fontSize:13, fontWeight:600 }}>
                {topic.icon} {topic.id.charAt(0).toUpperCase()+topic.id.slice(1)}
              </button>
            ))}
          </div>
        </div>
        {results !== null ? (
          results.length === 0
            ? <div style={{ textAlign:'center', color:'#8a9ab0', padding:'32px 0' }}>{t(lang,'noResults')}</div>
            : <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {results.map((v,i) => (
                  <div key={i} style={{ background:'#fff', borderRadius:14, padding:16, boxShadow:'0 2px 8px rgba(0,0,0,0.06)', borderLeft:`4px solid ${v.topicColor}` }}>
                    <div style={{ fontSize:12, color:'#8a9ab0', fontWeight:600, marginBottom:8 }}>{v.topicIcon} {v.topicId.toUpperCase()}</div>
                    <p style={{ fontSize:15, lineHeight:1.7, color:'#2c3e50', margin:'0 0 10px', fontStyle:'italic' }}>"{v.text}"</p>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                      <span style={{ fontWeight:700, color:'#1a6fa8', fontSize:14 }}>{v.ref}</span>
                      <button onClick={() => handleSave(v)} style={{ background:'#f0f7ff', border:'none', borderRadius:8, padding:'6px 10px', cursor:'pointer', display:'flex', alignItems:'center', gap:4, color:'#1a6fa8', fontSize:13 }}>
                        <Star size={14} /> Save
                      </button>
                    </div>
                  </div>
                ))}
              </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            {BIBLE_TOPICS.map(topic => (
              <button key={topic.id} onClick={() => setSelectedTopic(topic.id)}
                style={{ background:'#fff', border:`2px solid ${topic.color}20`, borderRadius:14, padding:'20px 16px', cursor:'pointer', textAlign:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}
                onMouseOver={e => e.currentTarget.style.background=`${topic.color}10`}
                onMouseOut={e => e.currentTarget.style.background='#fff'}>
                <div style={{ fontSize:32, marginBottom:8 }}>{topic.icon}</div>
                <div style={{ fontWeight:700, color:topic.color, fontSize:15 }}>{topic.id.charAt(0).toUpperCase()+topic.id.slice(1)}</div>
                <div style={{ fontSize:12, color:'#8a9ab0', marginTop:4 }}>{topic.verses.length} verses</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ── Prayer Screen ─────────────────────────────────────────────────────────────
const PrayerScreen = ({ lang, onBack }) => {
  const [intentions, setIntentions] = useState(() => { try { return JSON.parse(localStorage.getItem('tyj_prayers')||'[]'); } catch { return []; } });
  const [newPrayer, setNewPrayer] = useState('');
  const save = (u) => { setIntentions(u); localStorage.setItem('tyj_prayers', JSON.stringify(u)); };
  const add = () => { if (!newPrayer.trim()) return; save([{ id:Date.now(), text:newPrayer, date:new Date().toLocaleDateString(), answered:false }, ...intentions]); setNewPrayer(''); };
  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh' }}>
      <div style={S.header}>
        <button onClick={onBack} style={S.backBtn}><ChevronLeft size={16} /> {t(lang,'back')}</button>
        <div style={{ ...S.headerTitle, textAlign:'center' }}>{t(lang,'prayerTitle')}</div>
        <div style={{ width:60 }} />
      </div>
      <div style={{ flex:1, overflowY:'auto', padding:16 }}>
        <div style={S.card}>
          <textarea value={newPrayer} onChange={e => setNewPrayer(e.target.value)} placeholder={t(lang,'prayerPlaceholder')} style={{ ...S.ta, marginBottom:12 }} />
          <button onClick={add} style={S.btnP}><Plus size={16} style={{ verticalAlign:'middle', marginRight:6 }} />{t(lang,'prayerAdd')}</button>
        </div>
        {intentions.length===0
          ? <div style={{ textAlign:'center', color:'#8a9ab0', padding:'32px 0' }}>🙏 {t(lang,'prayerEmpty')}</div>
          : <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {intentions.map(p => (
                <div key={p.id} style={{ background:p.answered?'#f0fff4':'#fff', borderRadius:14, padding:'14px 16px', boxShadow:'0 2px 8px rgba(0,0,0,0.05)', borderLeft:`4px solid ${p.answered?'#27ae60':'#1a6fa8'}`, display:'flex', gap:12 }}>
                  <div style={{ flex:1 }}>
                    <p style={{ margin:'0 0 4px', fontSize:15, lineHeight:1.5, textDecoration:p.answered?'line-through':'none', color:p.answered?'#5a7a5a':'#1a2942' }}>{p.text}</p>
                    <span style={{ fontSize:12, color:'#8a9ab0' }}>{p.date}</span>
                  </div>
                  <div style={{ display:'flex', gap:6, alignItems:'flex-start' }}>
                    <button onClick={() => save(intentions.map(i => i.id===p.id?{...i,answered:!i.answered}:i))} style={{ background:p.answered?'#27ae60':'#f0f7ff', border:'none', borderRadius:8, padding:6, cursor:'pointer', color:p.answered?'#fff':'#8a9ab0' }}><Check size={14} /></button>
                    <button onClick={() => save(intentions.filter(i => i.id!==p.id))} style={{ background:'#fff0f0', border:'none', borderRadius:8, padding:6, cursor:'pointer', color:'#e74c3c' }}><X size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
        }
      </div>
    </div>
  );
};

// ── Journal Screen ────────────────────────────────────────────────────────────
const JournalScreen = ({ lang, onBack }) => {
  const [entries, setEntries] = useState(() => { try { return JSON.parse(localStorage.getItem('tyj_journal')||'[]'); } catch { return []; } });
  const [writing, setWriting] = useState(false);
  const [newEntry, setNewEntry] = useState('');
  const save = (u) => { setEntries(u); localStorage.setItem('tyj_journal', JSON.stringify(u)); };
  const add = () => { if (!newEntry.trim()) return; save([{ id:Date.now(), text:newEntry, date:new Date().toLocaleString() }, ...entries]); setNewEntry(''); setWriting(false); };
  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh' }}>
      <div style={S.header}>
        <button onClick={onBack} style={S.backBtn}><ChevronLeft size={16} /> {t(lang,'back')}</button>
        <div style={{ ...S.headerTitle, textAlign:'center' }}>{t(lang,'journalTitle')}</div>
        <button onClick={() => setWriting(true)} style={S.iconBtn}><Plus size={20} /></button>
      </div>
      <div style={{ flex:1, overflowY:'auto', padding:16 }}>
        {writing && (
          <div style={{ ...S.card, marginBottom:16 }}>
            <textarea value={newEntry} onChange={e => setNewEntry(e.target.value)} placeholder={t(lang,'journalPlaceholder')} style={{ ...S.ta, marginBottom:12 }} rows={5} />
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={add} style={{ ...S.btnP, flex:1 }}>Save</button>
              <button onClick={() => setWriting(false)} style={{ ...S.btnS, flex:1, width:'auto' }}>Cancel</button>
            </div>
          </div>
        )}
        {entries.length===0
          ? <div style={{ textAlign:'center', color:'#8a9ab0', padding:'32px 0' }}>
              📔 {t(lang,'journalEmpty')}
              {!writing && <div style={{ marginTop:16 }}><button onClick={() => setWriting(true)} style={{ ...S.btnP, width:'auto', padding:'10px 24px' }}>{t(lang,'journalAdd')}</button></div>}
            </div>
          : <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {entries.map(e => (
                <div key={e.id} style={{ background:'#fff', borderRadius:14, padding:16, boxShadow:'0 2px 8px rgba(0,0,0,0.05)' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                    <span style={{ fontSize:12, color:'#8a9ab0' }}>{e.date}</span>
                    <button onClick={() => save(entries.filter(i => i.id!==e.id))} style={{ background:'none', border:'none', cursor:'pointer', color:'#c0ccd8' }}><X size={14} /></button>
                  </div>
                  <p style={{ margin:0, fontSize:15, lineHeight:1.7, color:'#2c3e50', whiteSpace:'pre-wrap' }}>{e.text}</p>
                </div>
              ))}
            </div>
        }
      </div>
    </div>
  );
};

// ── Favorites Screen ──────────────────────────────────────────────────────────
const FavoritesScreen = ({ lang, onBack, favorites, onRemove }) => (
  <div style={{ display:'flex', flexDirection:'column', height:'100vh' }}>
    <div style={S.header}>
      <button onClick={onBack} style={S.backBtn}><ChevronLeft size={16} /> {t(lang,'back')}</button>
      <div style={{ ...S.headerTitle, textAlign:'center' }}>{t(lang,'favoritesTitle')}</div>
      <div style={{ width:60 }} />
    </div>
    <div style={{ flex:1, overflowY:'auto', padding:16 }}>
      {favorites.length===0
        ? <div style={{ textAlign:'center', color:'#8a9ab0', padding:'48px 0' }}>
            <Star size={40} style={{ color:'#D4A843', marginBottom:16 }} />
            <div>{t(lang,'favoritesEmpty')}</div>
          </div>
        : <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {favorites.map((v,i) => (
              <div key={i} style={{ background:'#fff', borderRadius:14, padding:16, boxShadow:'0 2px 8px rgba(0,0,0,0.05)', borderLeft:'4px solid #D4A843' }}>
                <p style={{ margin:'0 0 10px', fontSize:15, lineHeight:1.7, fontStyle:'italic', color:'#2c3e50' }}>"{v.text}"</p>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <span style={{ fontWeight:700, color:'#1a6fa8', fontSize:14 }}>{v.ref}</span>
                  <button onClick={() => onRemove(i)} style={{ background:'none', border:'none', cursor:'pointer', color:'#c0ccd8' }}><X size={16} /></button>
                </div>
              </div>
            ))}
          </div>
      }
    </div>
  </div>
);

// ── Premium Screen ────────────────────────────────────────────────────────────
const PremiumScreen = ({ lang, onBack, onUpgrade }) => (
  <div style={{ display:'flex', flexDirection:'column', height:'100vh' }}>
    <div style={S.header}>
      <button onClick={onBack} style={S.backBtn}><ChevronLeft size={16} /> {t(lang,'back')}</button>
      <div style={{ ...S.headerTitle, textAlign:'center' }}>Premium</div>
      <div style={{ width:60 }} />
    </div>
    <div style={{ flex:1, overflowY:'auto' }}>
      <div style={{ background:'linear-gradient(160deg,#1a2942 0%,#0d4d7a 100%)', padding:'40px 24px', textAlign:'center', color:'#fff' }}>
        <div style={{ fontSize:60, marginBottom:16 }}>👑</div>
        <h2 style={{ fontSize:26, fontWeight:800, margin:'0 0 8px' }}>{t(lang,'premiumTitle')}</h2>
        <p style={{ opacity:0.8, margin:'0 0 24px', fontSize:16 }}>{t(lang,'premiumSubtitle')}</p>
        <div style={{ background:'rgba(255,255,255,0.1)', borderRadius:12, padding:'12px 20px', display:'inline-block' }}>
          <div style={{ fontSize:28, fontWeight:800, color:'#D4A843' }}>{t(lang,'premiumPrice')}</div>
          <div style={{ fontSize:14, opacity:0.7 }}>{t(lang,'premiumYearly')}</div>
        </div>
      </div>
      <div style={{ padding:24 }}>
        {['premiumFeature1','premiumFeature2','premiumFeature3','premiumFeature4','premiumFeature5'].map(k => (
          <div key={k} style={{ background:'#f0f7ff', borderRadius:12, padding:'14px 16px', fontSize:15, fontWeight:600, color:'#1a2942', marginBottom:10 }}>{t(lang,k)}</div>
        ))}
        <button onClick={() => onUpgrade('monthly')} style={{ ...S.btnG, marginBottom:12, marginTop:8, fontSize:17, padding:16 }}>
          {t(lang,'premiumCTA')} — {t(lang,'premiumPrice')}
        </button>
        <button onClick={() => onUpgrade('yearly')} style={{ ...S.btnS, marginBottom:12 }}>Annual — {t(lang,'premiumYearly')}</button>
        <button onClick={onBack} style={{ background:'none', border:'none', color:'#8a9ab0', cursor:'pointer', width:'100%', padding:8, fontSize:14 }}>{t(lang,'premiumCancel')}</button>
        <p style={{ textAlign:'center', fontSize:11, color:'#c0ccd8', marginTop:16, lineHeight:1.5 }}>Secured by Stripe. Cancel anytime.</p>
      </div>
    </div>
  </div>
);

// ── Settings Screen ───────────────────────────────────────────────────────────
const SettingsScreen = ({ lang, denomination, onBack, onChangeLang, onChangeDenomination, onNavigate }) => (
  <div style={{ display:'flex', flexDirection:'column', height:'100vh' }}>
    <div style={S.header}>
      <button onClick={onBack} style={S.backBtn}><ChevronLeft size={16} /> {t(lang,'back')}</button>
      <div style={{ ...S.headerTitle, textAlign:'center' }}>{t(lang,'settingsTitle')}</div>
      <div style={{ width:60 }} />
    </div>
    <div style={{ flex:1, overflowY:'auto', padding:16 }}>
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:12, fontWeight:700, color:'#8a9ab0', marginBottom:10, textTransform:'uppercase', letterSpacing:0.8 }}>{t(lang,'settingsLanguage')}</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
          {LANGUAGES.map(l => (
            <button key={l.code} onClick={() => onChangeLang(l.code)} style={{ background:lang===l.code?'#1a6fa8':'#fff', color:lang===l.code?'#fff':'#1a2942', border:`2px solid ${lang===l.code?'#1a6fa8':'#e8f0f8'}`, borderRadius:10, padding:'10px 12px', cursor:'pointer', display:'flex', alignItems:'center', gap:8, fontSize:13, fontWeight:600 }}>
              {l.flag} {l.nativeName}
            </button>
          ))}
        </div>
      </div>
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:12, fontWeight:700, color:'#8a9ab0', marginBottom:10, textTransform:'uppercase', letterSpacing:0.8 }}>{t(lang,'settingsDenomination')}</div>
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {DENOMINATIONS.map(d => (
            <button key={d.id} onClick={() => onChangeDenomination(d.id)} style={{ background:denomination===d.id?'#f0f7ff':'#fff', color:'#1a2942', border:`2px solid ${denomination===d.id?'#1a6fa8':'#e8f0f8'}`, borderRadius:10, padding:'12px 16px', cursor:'pointer', display:'flex', alignItems:'center', gap:10, fontSize:14, fontWeight:600, textAlign:'left' }}>
              <span>{d.icon}</span><span style={{ flex:1 }}>{t(lang,d.key)}</span>
              {denomination===d.id && <Check size={16} color="#1a6fa8" />}
            </button>
          ))}
        </div>
      </div>
      <button onClick={() => onNavigate('premium')} style={{ ...S.card, display:'flex', alignItems:'center', gap:12, cursor:'pointer', border:'none', width:'100%', textAlign:'left', marginBottom:8 }}>
        <Crown size={24} color="#D4A843" />
        <div style={{ flex:1 }}><div style={{ fontWeight:700, color:'#1a2942' }}>{t(lang,'premiumTitle')}</div><div style={{ fontSize:12, color:'#8a9ab0' }}>{t(lang,'premiumPrice')}</div></div>
        <ChevronRight size={16} color="#c0ccd8" />
      </button>
      <div style={{ textAlign:'center', color:'#c0ccd8', fontSize:12, marginTop:24 }}>{t(lang,'settingsVersion')}</div>
    </div>
  </div>
);

// ── Bottom Nav ────────────────────────────────────────────────────────────────
function BottomNav({ lang, active, onNavigate }) {
  const items = [
    { id:'home', icon:Home, labelKey:'navHome' },
    { id:'chat', icon:MessageCircle, labelKey:'navChat' },
    { id:'bible', icon:BookOpen, labelKey:'navBible' },
    { id:'prayer', icon:Heart, labelKey:'navPrayer' },
    { id:'favorites', icon:Star, labelKey:'navMore' },
  ];
  return (
    <nav style={S.nav}>
      {items.map(({ id, icon:Icon, labelKey }) => (
        <button key={id} style={S.navItem(active===id)} onClick={() => onNavigate(id)}>
          <Icon size={22} />
          <span style={S.navLabel}>{t(lang,labelKey)}</span>
        </button>
      ))}
    </nav>
  );
}

// ── Root App ──────────────────────────────────────────────────────────────────
export default function App() {
  const saved = loadState();
  const [screen, setScreen] = useState(saved?.onboarded ? 'home' : 'welcome');
  const [lang, setLang] = useState(saved?.lang || 'en');
  const [denomination, setDenomination] = useState(saved?.denomination || null);
  const [isPremium] = useState(saved?.isPremium || false);
  const [favorites, setFavorites] = useState(saved?.favorites || []);
  const [initialTopic, setInitialTopic] = useState(null);
  const [toast, setToast] = useState('');
  const [msgLeft, setMsgLeft] = useState(() => {
    const s = loadState();
    if (s?.lastMsgDate === today()) return s.msgLeft ?? FREE_DAILY_LIMIT;
    return FREE_DAILY_LIMIT;
  });

  useEffect(() => {
    saveState({ lang, denomination, isPremium, favorites, onboarded:!['welcome','denomination','disclaimer'].includes(screen), msgLeft, lastMsgDate:today() });
  }, [lang, denomination, favorites, screen, msgLeft]);

  const addFavorite = (verse) => {
    if (!favorites.find(f => f.ref===verse.ref)) {
      setFavorites(p => [verse,...p]);
      setToast('⭐ Saved!');
      setTimeout(() => setToast(''), 2000);
    }
  };

  const handleUpgrade = async (plan) => {
    try {
      const res = await fetch('/api/create-checkout', { method:'POST', headers:{ 'Content-Type':'application/json' }, body:JSON.stringify({ plan, lang }) });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch { alert('Payment system coming soon! The app works — Stripe just needs to be connected. 🙏'); }
  };

  const navigate = (s) => setScreen(s);

  if (screen==='welcome') return <WelcomeScreen onSelect={(l) => { setLang(l); setScreen('denomination'); }} />;
  if (screen==='denomination') return <DenominationScreen lang={lang} onSelect={(d) => { setDenomination(d); setScreen('disclaimer'); }} onBack={() => setScreen('welcome')} />;
  if (screen==='disclaimer') return <DisclaimerScreen lang={lang} onAgree={() => setScreen('home')} onBack={() => setScreen('denomination')} />;
  if (screen==='settings') return <SettingsScreen lang={lang} denomination={denomination} onBack={() => setScreen('home')} onChangeLang={setLang} onChangeDenomination={setDenomination} onNavigate={navigate} />;
  if (screen==='premium') return <PremiumScreen lang={lang} onBack={() => setScreen('home')} onUpgrade={handleUpgrade} />;
  if (screen==='chat') return <ChatScreen lang={lang} denomination={denomination} isPremium={isPremium} msgLeft={msgLeft} onMsgSent={() => !isPremium && setMsgLeft(p => Math.max(0,p-1))} onNavigate={navigate} initialTopic={initialTopic} />;
  if (screen==='journal') return <JournalScreen lang={lang} onBack={() => setScreen('home')} />;

  return (
    <div style={S.app}>
      {toast && <Toast message={toast} />}
      {screen==='home' && <HomeScreen lang={lang} isPremium={isPremium} msgLeft={msgLeft} onNavigate={navigate} onTopicChat={(id) => { setInitialTopic(id); setScreen('chat'); }} onSaveVerse={addFavorite} />}
      {screen==='bible' && <BibleScreen lang={lang} onBack={() => setScreen('home')} onSaveVerse={addFavorite} />}
      {screen==='prayer' && <PrayerScreen lang={lang} onBack={() => setScreen('home')} />}
      {screen==='favorites' && <FavoritesScreen lang={lang} onBack={() => setScreen('home')} favorites={favorites} onRemove={(i) => setFavorites(p => p.filter((_,j) => j!==i))} />}
      <BottomNav lang={lang} active={screen} onNavigate={navigate} />
    </div>
  );
}
