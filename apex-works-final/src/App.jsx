import { useState, useEffect, useCallback, useRef } from "react";

// ── Theme ─────────────────────────────────────────────────────────────────────
const C = {
  bg:"#080810", surface:"#0F0F1A", surfaceAlt:"#141428", border:"#1E1E3A",
  gold:"#C9A84C", goldLight:"#E8C56A",
  text:"#F0EEE8", textMuted:"#888", textDim:"#333",
  green:"#2ECC71", blue:"#3B82F6", purple:"#8B5CF6",
  red:"#EF4444", orange:"#F97316",
};

// ── Auth Users ────────────────────────────────────────────────────────────────
const USERS = [
  { id:"admin",   email:"admin@apexworks.io",      password:"apex2025",   name:"Alex Morgan",      role:"admin",   avatar:"AM", clientId:null },
  { id:"nova",    email:"nova@sevenmgmt.com",       password:"nova2025",   name:"Nova Carter",      role:"artist",  avatar:"NC", clientId:1 },
  { id:"bprism",  email:"releases@blackprism.com", password:"prism2025",  name:"Black Prism",      role:"label",   avatar:"BP", clientId:2 },
  { id:"ade",     email:"ade@ayitamgmt.com",        password:"ade2025",    name:"Ade Osei",         role:"artist",  avatar:"AO", clientId:3 },
  { id:"helix",   email:"team@helixmusic.com",      password:"helix2025",  name:"Helix Music Group",role:"label",   avatar:"HM", clientId:4 },
  { id:"zara",    email:"zara@circuitmgmt.com",     password:"zara2025",   name:"Zara Flynn",       role:"artist",  avatar:"ZF", clientId:5 },
];

// ── Data ──────────────────────────────────────────────────────────────────────
const DEFAULT_CLIENTS = [
  {id:1,name:"Nova Carter",type:"Artist",manager:"Seven20 Mgmt",stage:"Mid-Tier",tier:"Full Suite",status:"Active",streams:2400000,joined:"Jan 2025",genre:"R&B / Soul",avatar:"NC",country:"UK",monthlyListeners:84000,email:"nova@sevenmgmt.com"},
  {id:2,name:"Black Prism Records",type:"Label",manager:"Direct",stage:"Established",tier:"Full Suite",status:"Active",streams:12100000,joined:"Feb 2025",genre:"Electronic",avatar:"BP",country:"UK",monthlyListeners:340000,email:"releases@blackprism.com"},
  {id:3,name:"Ade Osei",type:"Artist",manager:"Ayita Mgmt",stage:"Emerging",tier:"Amplify",status:"Active",streams:340000,joined:"Mar 2025",genre:"Afrobeats",avatar:"AO",country:"GH",monthlyListeners:22000,email:"ade@ayitamgmt.com"},
  {id:4,name:"Helix Music Group",type:"Label",manager:"Direct",stage:"Mid-Tier",tier:"Amplify",status:"Active",streams:5700000,joined:"Mar 2025",genre:"Hip-Hop",avatar:"HM",country:"UK",monthlyListeners:180000,email:"team@helixmusic.com"},
  {id:5,name:"Zara Flynn",type:"Artist",manager:"Circuit Mgmt",stage:"Emerging",tier:"Distribute",status:"Onboarding",streams:89000,joined:"Apr 2025",genre:"Indie Pop",avatar:"ZF",country:"IE",monthlyListeners:6200,email:"zara@circuitmgmt.com"},
];

const PIPELINE_STAGES = ["awaiting_upload","mastering","master_review","qc","dsp_delivery","live"];
const PIPELINE_LABELS = {awaiting_upload:"Awaiting Upload",mastering:"In Mastering",master_review:"Master Review",qc:"QC",dsp_delivery:"DSP Delivery",live:"Live"};

const DEFAULT_RELEASES = [
  {id:1,clientId:1,client:"Nova Carter",title:"Afterglow",type:"EP",date:"2025-05-16",status:"In Progress",dsp:"Delivered",playlist:"Pitched",pr:"Live",ads:"Active",masteringTier:"human",pipelineStage:"master_review",masterFile:"afterglow_master.wav",masterApproved:null,explicit:false,splits:[{name:"Nova Carter",role:"Artist",percentage:80},{name:"James Reid",role:"Producer",percentage:20}],uploadedFiles:["afterglow_premaster.wav"],notes:"4-track EP.",artwork:"afterglow_cover.jpg",artworkApproved:false,metadataApproved:true,upc:"5059123456781",isrc:"GBUM72504321"},
  {id:2,clientId:2,client:"Black Prism Records",title:"Solstice Vol. 2",type:"Album",date:"2025-06-01",status:"Planning",dsp:"Pending",playlist:"Drafting",pr:"Pending",ads:"Pending",masteringTier:null,pipelineStage:"awaiting_upload",masterFile:null,masterApproved:null,explicit:false,splits:[],uploadedFiles:[],notes:"",artwork:null,artworkApproved:false,metadataApproved:false,upc:"",isrc:""},
  {id:3,clientId:2,client:"Black Prism Records",title:"Fractures EP",type:"EP",date:"2025-04-12",status:"Live",dsp:"Live",playlist:"Live",pr:"Live",ads:"Complete",masteringTier:"automated",pipelineStage:"live",masterFile:"fractures_master.wav",masterApproved:true,explicit:false,splits:[{name:"Black Prism Records",role:"Label",percentage:100}],uploadedFiles:["fractures_premaster.wav"],notes:"",artwork:"fractures_cover.jpg",artworkApproved:true,metadataApproved:true,upc:"5059123456782",isrc:"GBUM72504322"},
  {id:4,clientId:3,client:"Ade Osei",title:"Lagos Nights",type:"Single",date:"2025-05-09",status:"Live",dsp:"Live",playlist:"Live",pr:"Live",ads:"Complete",masteringTier:"automated",pipelineStage:"live",masterFile:"lagos_nights_master.wav",masterApproved:true,explicit:true,splits:[{name:"Ade Osei",role:"Artist",percentage:70},{name:"Kwame B",role:"Co-writer",percentage:30}],uploadedFiles:["lagos_nights_premaster.wav"],notes:"",artwork:"lagos_nights_cover.jpg",artworkApproved:true,metadataApproved:true,upc:"5059123456783",isrc:"GBUM72504323"},
  {id:5,clientId:4,client:"Helix Music Group",title:"Street Gospel",type:"Single",date:"2025-05-23",status:"In Progress",dsp:"Pending",playlist:"Pending",pr:"Drafting",ads:"Pending",masteringTier:"human",pipelineStage:"mastering",masterFile:null,masterApproved:null,explicit:true,splits:[{name:"Helix Music Group",role:"Label",percentage:60},{name:"MC Verse",role:"Artist",percentage:40}],uploadedFiles:["street_gospel_premaster.wav"],notes:"",artwork:null,artworkApproved:false,metadataApproved:false,upc:"5059123456784",isrc:"GBUM72504324"},
  {id:6,clientId:4,client:"Helix Music Group",title:"Midnight Protocol",type:"Album",date:"2025-07-15",status:"Planning",dsp:"Pending",playlist:"Pending",pr:"Pending",ads:"Pending",masteringTier:null,pipelineStage:"awaiting_upload",masterFile:null,masterApproved:null,explicit:false,splits:[],uploadedFiles:[],notes:"",artwork:null,artworkApproved:false,metadataApproved:false,upc:"",isrc:""},
  {id:7,clientId:5,client:"Zara Flynn",title:"Silver Static",type:"Single",date:"2025-05-30",status:"In Progress",dsp:"Pending",playlist:"Pending",pr:"Drafting",ads:"Pending",masteringTier:"automated",pipelineStage:"mastering",masterFile:null,masterApproved:null,explicit:false,splits:[{name:"Zara Flynn",role:"Artist",percentage:100}],uploadedFiles:["silver_static_premaster.wav"],notes:"",artwork:null,artworkApproved:false,metadataApproved:false,upc:"",isrc:""},
  {id:8,clientId:1,client:"Nova Carter",title:"Velvet Hour",type:"Single",date:"2025-06-20",status:"Planning",dsp:"Pending",playlist:"Pending",pr:"Pending",ads:"Pending",masteringTier:null,pipelineStage:"awaiting_upload",masterFile:null,masterApproved:null,explicit:false,splits:[],uploadedFiles:[],notes:"Lead single.",artwork:null,artworkApproved:false,metadataApproved:false,upc:"",isrc:""},
  {id:9,clientId:1,client:"Nova Carter",title:"Midnight Blue",type:"Single",date:"2024-11-03",status:"Live",dsp:"Live",playlist:"Live",pr:"Live",ads:"Complete",masteringTier:"human",pipelineStage:"live",masterFile:"midnight_blue_master.wav",masterApproved:true,explicit:false,splits:[{name:"Nova Carter",role:"Artist",percentage:100}],uploadedFiles:["midnight_blue_premaster.wav"],notes:"",artwork:"midnight_blue_cover.jpg",artworkApproved:true,metadataApproved:true,upc:"5059123456785",isrc:"GBUM72504325"},
];

const DEFAULT_ROYALTIES = [
  {id:1,clientId:1,release:"Afterglow",platform:"Spotify",period:"Q1 2025",amount:1240.50,status:"Paid"},
  {id:2,clientId:1,release:"Afterglow",platform:"Apple Music",period:"Q1 2025",amount:620.00,status:"Paid"},
  {id:3,clientId:1,release:"Midnight Blue",platform:"Spotify",period:"Q4 2024",amount:890.00,status:"Paid"},
  {id:4,clientId:2,release:"Fractures EP",platform:"Spotify",period:"Q1 2025",amount:5800.00,status:"Paid"},
  {id:5,clientId:2,release:"Fractures EP",platform:"TIDAL",period:"Q1 2025",amount:890.00,status:"Disputed"},
  {id:6,clientId:3,release:"Lagos Nights",platform:"Spotify",period:"Q1 2025",amount:340.00,status:"Paid"},
  {id:7,clientId:4,release:"Street Gospel",platform:"Apple Music",period:"Q1 2025",amount:2100.00,status:"Pending"},
  {id:8,clientId:4,release:"Street Gospel",platform:"YouTube Music",period:"Q1 2025",amount:480.00,status:"Pending"},
  {id:9,clientId:5,release:"Silver Static",platform:"Spotify",period:"Q1 2025",amount:89.00,status:"Paid"},
];

const DEFAULT_TASKS = [
  {id:1,releaseId:1,clientId:1,title:"Finalise Spotify editorial pitch deck",agent:"Playlist Agent",priority:"High",status:"In Progress",due:"2025-05-10",assignee:"Playlist Agent"},
  {id:2,releaseId:1,clientId:1,title:"Schedule Instagram content rollout",agent:"Social Media Agent",priority:"Medium",status:"Todo",due:"2025-05-12",assignee:"Social Media Agent"},
  {id:3,releaseId:2,clientId:2,title:"Request stems from artist for mastering",agent:"Release Manager",priority:"High",status:"Todo",due:"2025-05-08",assignee:"Release Manager"},
  {id:4,releaseId:3,clientId:2,title:"Dispute TIDAL Q1 royalty discrepancy",agent:"Royalty Agent",priority:"High",status:"In Progress",due:"2025-05-15",assignee:"Royalty Agent"},
  {id:5,releaseId:4,clientId:3,title:"Register Lagos Nights with PRS",agent:"Sync & Publishing Agent",priority:"Medium",status:"Done",due:"2025-04-30",assignee:"Sync & Publishing Agent"},
  {id:6,releaseId:5,clientId:4,title:"Launch Meta ads for Street Gospel",agent:"Paid Ads Agent",priority:"High",status:"Todo",due:"2025-05-20",assignee:"Paid Ads Agent"},
  {id:7,releaseId:7,clientId:5,title:"Brief artwork designer for Silver Static",agent:"Creative Director Agent",priority:"Medium",status:"In Progress",due:"2025-05-18",assignee:"Creative Director Agent"},
];

const AGENTS = [
  {id:1,name:"Release Manager",pillar:"Distribution",status:"Active",tasksToday:4,lastAction:"Delivered metadata to Spotify for 'Afterglow'",load:72,color:C.blue,description:"Coordinates end-to-end release logistics across all DSPs.",actions:["Submit metadata to DSPs","Register ISRC/UPC codes","Schedule release date","Confirm delivery receipts"]},
  {id:2,name:"Royalty Agent",pillar:"Distribution",status:"Active",tasksToday:2,lastAction:"Flagged Q1 discrepancy — Black Prism TIDAL",load:45,color:C.blue,description:"Monitors royalty statements and flags discrepancies.",actions:["Parse DSP statements","Flag discrepancies","Track split disbursements","Generate royalty summaries"]},
  {id:3,name:"Sync & Publishing Agent",pillar:"Distribution",status:"Idle",tasksToday:1,lastAction:"Registered 'Lagos Nights' with PRS",load:20,color:C.blue,description:"Handles publishing registration and sync licensing.",actions:["Register with PRS/ASCAP","Identify sync opportunities","Submit to music supervisors","Manage neighbouring rights"]},
  {id:4,name:"Social Media Agent",pillar:"Marketing",status:"Active",tasksToday:11,lastAction:"Scheduled 6 posts across Nova Carter accounts",load:88,color:C.purple,description:"Manages organic social across Instagram, TikTok, X, and YouTube.",actions:["Schedule social posts","Draft captions & hashtags","Generate content calendars","Track engagement metrics"]},
  {id:5,name:"Playlist Agent",pillar:"Marketing",status:"Active",tasksToday:7,lastAction:"Pitched 'Afterglow' to 14 Spotify curators",load:65,color:C.purple,description:"Pitches releases to editorial and independent curators.",actions:["Pitch to Spotify editorial","Contact independent curators","Track playlist placements","Monitor listener adds"]},
  {id:6,name:"PR Agent",pillar:"Marketing",status:"Active",tasksToday:3,lastAction:"Drafted press release — 'Afterglow' EP",load:55,color:C.purple,description:"Drafts and distributes press releases.",actions:["Draft press releases","Target music publications","Submit to radio pluggers","Track media coverage"]},
  {id:7,name:"Paid Ads Agent",pillar:"Marketing",status:"Active",tasksToday:6,lastAction:"Optimised Nova Carter Meta campaign — CTR +12%",load:79,color:C.purple,description:"Runs and optimises paid campaigns across Meta, TikTok, and YouTube.",actions:["Launch Meta campaigns","Create TikTok Ads","Optimise ad creative","Report on ROAS"]},
  {id:8,name:"Analytics Agent",pillar:"Marketing",status:"Active",tasksToday:5,lastAction:"Generated weekly report — all clients",load:60,color:C.purple,description:"Aggregates streaming, social, and ad performance.",actions:["Pull DSP stream data","Aggregate social stats","Generate weekly reports","Flag performance anomalies"]},
  {id:9,name:"Creative Director Agent",pillar:"Creative",status:"Idle",tasksToday:2,lastAction:"Briefed designer for 'Street Gospel' artwork",load:30,color:C.gold,description:"Oversees creative direction and artwork.",actions:["Brief artwork designers","Review visual identity","Approve campaign assets","Coordinate design deadlines"]},
  {id:10,name:"Content Agent",pillar:"Creative",status:"Active",tasksToday:8,lastAction:"Scripted 4 TikTok reels for Ade Osei",load:82,color:C.gold,description:"Scripts short-form video content for social platforms.",actions:["Script TikTok reels","Produce Instagram content","Create YouTube Shorts","Write artist bio copy"]},
  {id:11,name:"Merch Agent",pillar:"Creative",status:"Idle",tasksToday:1,lastAction:"Confirmed Zara Flynn merch supplier quote",load:15,color:C.gold,description:"Manages merchandise production and fulfilment.",actions:["Source merch suppliers","Coordinate production runs","Align drops with releases","Track inventory levels"]},
];

const EMAIL_TEMPLATES = {
  upload_request:{subject:"Action Required: Upload your pre-master for [TITLE]",body:`Hi [ARTIST],\n\nYour release "[TITLE]" is scheduled for [DATE]. We need your pre-master audio, artwork, UPC/ISRC, and contributor splits before we can proceed.\n\nPlease log in to your Apex Works portal to submit your files:\nhttps://portal.apexworks.io\n\nDeadline: [DEADLINE]\n\nApex Works Distribution`},
  master_ready:{subject:"Your master is ready for review — [TITLE]",body:`Hi [ARTIST],\n\nYour mastered file for "[TITLE]" is now ready for your review and sign-off.\n\nLog in to listen and approve:\nhttps://portal.apexworks.io\n\nWe need your sign-off within 48 hours.\n\nApex Works Distribution`},
  artwork_required:{subject:"Action Required: Artwork sign-off needed for [TITLE]",body:`Hi [ARTIST],\n\nPlease review and approve artwork for "[TITLE]" via your portal.\n\nhttps://portal.apexworks.io\n\nApex Works Distribution`},
  going_live:{subject:"🎉 [TITLE] is going live on [DATE]",body:`Hi [ARTIST],\n\n"[TITLE]" has been delivered to all DSPs and goes live on [DATE].\n\nApex Works Distribution`},
  royalty_statement:{subject:"Your Q[QUARTER] [YEAR] royalty statement is ready",body:`Hi [ARTIST],\n\nYour royalty statement for Q[QUARTER] [YEAR] is now available.\n\nTotal earnings: £[AMOUNT]\n\nhttps://portal.apexworks.io\n\nApex Works Distribution`},
  dispute_raised:{subject:"Royalty discrepancy raised — action may be required",body:`Hi [ARTIST],\n\nWe've identified a discrepancy in your Q[QUARTER] royalty payment from [PLATFORM].\n\nOur Royalty Agent is investigating. We'll keep you updated.\n\nApex Works Distribution`},
};

const LOG_POOL = [
  "Scraped Spotify New Music Friday — 847 tracks analysed",
  "Identified 3 editorial curators matching client genre profile",
  "Queued metadata validation for upcoming release",
  "Detected royalty underpayment — TIDAL Q1 delta £890",
  "Generated social content calendar for next 30 days",
  "Submitted press release to 12 music publications",
  "Optimised Meta ad creative — paused underperforming variant",
  "Registered 2 new works with PRS for Music",
  "Pulled Spotify for Artists data — streams up 18% WoW",
  "Sent master review notification to Nova Carter",
  "Drafted 4 TikTok video scripts for upcoming single",
  "Dispatched royalty statement to Black Prism Records",
  "Confirmed ISRC registration with PPL",
  "Pitched to 8 independent playlist curators",
  "Flagged artwork missing for Street Gospel — email sent",
];

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const WDAYS  = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

// ── Hooks ─────────────────────────────────────────────────────────────────────
function usePersistedState(key, def) {
  const [s, set] = useState(def);
  useEffect(()=>{ (async()=>{ try{ const r=await window.storage.get(key); if(r?.value) set(JSON.parse(r.value)); }catch{} })(); },[key]);
  const save = useCallback(u=>{ set(p=>{ const n=typeof u==="function"?u(p):u; window.storage.set(key,JSON.stringify(n)).catch(()=>{}); return n; }); },[key]);
  return [s, save];
}

function nid() { return Date.now()+Math.floor(Math.random()*9999); }
function fmtN(n) { if(n>=1e6) return (n/1e6).toFixed(1)+"M"; if(n>=1e3) return Math.round(n/1e3)+"K"; return String(n||0); }
function daysUntil(dateStr) { return Math.ceil((new Date(dateStr)-new Date())/86400000); }
function fmtTime(s) { const m=Math.floor(s/60); return `${m}:${String(Math.floor(s%60)).padStart(2,"0")}` }

// ── Shared UI ─────────────────────────────────────────────────────────────────
function Avatar({initials,size=36,color=C.gold}){return <div style={{width:size,height:size,borderRadius:"50%",background:`${color}22`,border:`1.5px solid ${color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.33,fontWeight:700,color,fontFamily:"monospace",flexShrink:0}}>{initials}</div>;}
const BC={Active:C.green,Idle:"#888",Onboarding:C.orange,Live:C.green,"In Progress":C.blue,Planning:C.purple,Pending:"#888",Delivered:C.green,Pitched:C.blue,Drafting:C.orange,Complete:C.green,Paid:C.green,Disputed:C.red,Todo:"#888",Done:C.green,High:C.red,Medium:C.orange,Low:"#888","Pending Approval":C.orange,Approved:C.green,Rejected:C.red,"Awaiting Upload":C.orange,Mastering:C.gold,"Master Review":C.purple,QC:C.blue,"DSP Delivery":C.green,Admin:"#7C3AED",Artist:C.gold,Label:C.blue};
function Badge({status}){const c=BC[status]||"#888";return <span style={{background:`${c}18`,color:c,border:`1px solid ${c}40`,padding:"2px 10px",borderRadius:20,fontSize:11,fontWeight:600,whiteSpace:"nowrap"}}>{status}</span>;}
function Bar({value,color,h=4}){return <div style={{width:"100%",height:h,background:"#1E1E3A",borderRadius:h/2,overflow:"hidden"}}><div style={{width:`${Math.min(Math.max(value,0),100)}%`,height:"100%",background:color,borderRadius:h/2}}/></div>;}
function Btn({children,onClick,variant="primary",small,disabled}){const s={primary:{background:C.gold,color:"#000",border:"none"},ghost:{background:"transparent",color:C.textMuted,border:`1px solid ${C.border}`},danger:{background:`${C.red}18`,color:C.red,border:`1px solid ${C.red}40`},success:{background:`${C.green}18`,color:C.green,border:`1px solid ${C.green}40`}};return <button onClick={onClick} disabled={!!disabled} style={{...s[variant],padding:small?"5px 12px":"9px 18px",borderRadius:8,fontSize:small?12:13,fontWeight:700,cursor:disabled?"not-allowed":"pointer",fontFamily:"inherit",opacity:disabled?0.5:1}}>{children}</button>;}
function Inp({label,value,onChange,type="text",options,placeholder}){const base={width:"100%",background:C.surfaceAlt,border:`1px solid ${C.border}`,borderRadius:6,padding:"8px 12px",color:C.text,fontSize:13,boxSizing:"border-box",outline:"none",fontFamily:"inherit"};return <div>{label&&<div style={{fontSize:11,color:C.textMuted,marginBottom:4,textTransform:"uppercase",letterSpacing:1}}>{label}</div>}{options?<select value={value} onChange={e=>onChange(e.target.value)} style={base}>{options.map(o=><option key={o}>{o}</option>)}</select>:<input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={base}/>}</div>;}
function Card({children,style}){return <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:24,...style}}>{children}</div>;}
function CH({children}){return <div style={{fontSize:11,fontWeight:700,color:C.textMuted,textTransform:"uppercase",letterSpacing:1}}>{children}</div>;}
function Back({onClick,label="Back"}){return <button onClick={onClick} style={{background:"transparent",border:"none",color:C.textMuted,fontSize:13,cursor:"pointer",marginBottom:20,padding:0}}>← {label}</button>;}
function SH({title,sub,action}){return <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}><div><div style={{fontSize:22,fontWeight:800,color:C.text}}>{title}</div>{sub&&<div style={{fontSize:13,color:C.textMuted,marginTop:2}}>{sub}</div>}</div>{action}</div>;}

// ── Charts ─────────────────────────────────────────────────────────────────────
function Spark({data,color,w=80,h=28}){if(!data||data.length<2) return <div style={{width:w,height:h}}/>;const mn=Math.min(...data),rng=(Math.max(...data)-mn)||1;const pts=data.map((v,i)=>`${(i/(data.length-1))*w},${h-((v-mn)/rng)*(h-4)-2}`).join(" ");const last=pts.split(" ").pop().split(",");return <svg width={w} height={h} style={{overflow:"visible"}}><polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/><circle cx={last[0]} cy={last[1]} r="2.5" fill={color}/></svg>;}
function Donut({segs,size=100,thick=14}){const r=(size-thick)/2,cx=size/2,cy=size/2,total=segs.reduce((s,g)=>s+g.v,0)||1;let a=-Math.PI/2;return <svg width={size} height={size}>{segs.map((g,i)=>{const sw=(g.v/total)*2*Math.PI,x1=cx+r*Math.cos(a),y1=cy+r*Math.sin(a);a+=sw;const x2=cx+r*Math.cos(a),y2=cy+r*Math.sin(a);return <path key={i} d={`M${x1},${y1} A${r},${r} 0 ${sw>Math.PI?1:0},1 ${x2},${y2}`} fill="none" stroke={g.color} strokeWidth={thick}/>; })}<circle cx={cx} cy={cy} r={r-thick/2} fill={C.surfaceAlt}/></svg>;}
function Bars({data,h=120,color=C.gold}){const max=Math.max(...data.map(d=>d.v),1);return <div style={{display:"flex",alignItems:"flex-end",gap:6,height:h}}>{data.map((d,i)=><div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4,height:"100%"}}><div style={{flex:1,width:"100%",display:"flex",alignItems:"flex-end"}}><div style={{width:"100%",minHeight:2,height:`${(d.v/max)*100}%`,background:`${color}22`,border:`1px solid ${color}40`,borderBottom:"none",borderRadius:"3px 3px 0 0",position:"relative"}}><div style={{position:"absolute",inset:0,background:`linear-gradient(180deg,${color}60,${color}20)`,borderRadius:"3px 3px 0 0"}}/></div></div><div style={{fontSize:9,color:C.textMuted,whiteSpace:"nowrap"}}>{d.label}</div></div>)}</div>;}

// ── Login Screen ──────────────────────────────────────────────────────────────
function LoginScreen({onLogin}){
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(false);
  const [showPw,setShowPw]=useState(false);

  function attempt(){
    setError("");setLoading(true);
    setTimeout(()=>{
      const user=USERS.find(u=>u.email.toLowerCase()===email.toLowerCase()&&u.password===password);
      if(user){onLogin(user);}
      else{setError("Invalid email or password. Please try again.");}
      setLoading(false);
    },600);
  }

  const demoUsers=[
    {label:"Admin / Distributor",email:"admin@apexworks.io",pw:"apex2025",color:C.purple},
    {label:"Nova Carter (Artist)",email:"nova@sevenmgmt.com",pw:"nova2025",color:C.gold},
    {label:"Black Prism (Label)",email:"releases@blackprism.com",pw:"prism2025",color:C.blue},
    {label:"Ade Osei (Artist)",email:"ade@ayitamgmt.com",pw:"ade2025",color:C.green},
    {label:"Helix Music (Label)",email:"team@helixmusic.com",pw:"helix2025",color:C.orange},
    {label:"Zara Flynn (Artist)",email:"zara@circuitmgmt.com",pw:"zara2025",color:C.blue},
  ];

  return(
    <div style={{display:"flex",height:"100vh",background:C.bg,fontFamily:"'DM Sans','Segoe UI',sans-serif",overflow:"hidden"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap'); *{box-sizing:border-box;}`}</style>

      {/* Left panel */}
      <div style={{width:480,background:C.surface,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",justifyContent:"center",padding:"60px 52px",flexShrink:0}}>
        {/* Logo */}
        <div style={{marginBottom:48}}>
          <div style={{fontSize:28,fontWeight:900,color:C.gold,letterSpacing:4,fontFamily:"monospace"}}>APEX</div>
          <div style={{fontSize:10,color:C.textDim,letterSpacing:5,fontWeight:600,marginTop:2}}>WORKS</div>
          <div style={{width:40,height:2,background:C.gold,marginTop:14,borderRadius:1}}/>
        </div>

        <div style={{fontSize:26,fontWeight:800,color:C.text,marginBottom:6}}>Welcome back</div>
        <div style={{fontSize:14,color:C.textMuted,marginBottom:36}}>Sign in to your Apex Works account</div>

        <div style={{display:"flex",flexDirection:"column",gap:16,marginBottom:8}}>
          <Inp label="Email address" value={email} onChange={setEmail} type="email" placeholder="you@example.com"/>
          <div>
            <div style={{fontSize:11,color:C.textMuted,marginBottom:4,textTransform:"uppercase",letterSpacing:1}}>Password</div>
            <div style={{position:"relative"}}>
              <input type={showPw?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&attempt()} placeholder="••••••••" style={{width:"100%",background:C.surfaceAlt,border:`1px solid ${error?C.red:C.border}`,borderRadius:6,padding:"8px 40px 8px 12px",color:C.text,fontSize:13,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
              <button onClick={()=>setShowPw(p=>!p)} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"transparent",border:"none",color:C.textMuted,cursor:"pointer",fontSize:14}}>{showPw?"🙈":"👁"}</button>
            </div>
          </div>
        </div>

        {error&&<div style={{background:`${C.red}12`,border:`1px solid ${C.red}40`,borderRadius:8,padding:"10px 14px",fontSize:12,color:C.red,marginBottom:12}}>⚠ {error}</div>}

        <button onClick={attempt} disabled={!email||!password||loading} style={{width:"100%",background:C.gold,color:"#000",border:"none",borderRadius:10,padding:"13px",fontSize:14,fontWeight:800,cursor:(!email||!password||loading)?"not-allowed":"pointer",opacity:(!email||!password||loading)?0.6:1,letterSpacing:0.5,marginBottom:24}}>
          {loading?"Signing in…":"Sign In →"}
        </button>

        <div style={{fontSize:11,color:C.textDim,textAlign:"center"}}>
          Your data is encrypted and stored securely.<br/>
          <span style={{color:C.textMuted}}>Powered by Apex Works Distribution Platform</span>
        </div>
      </div>

      {/* Right panel — demo credentials */}
      <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",padding:"60px 52px"}}>
        <div style={{maxWidth:480}}>
          <div style={{fontSize:11,fontWeight:700,color:C.gold,letterSpacing:3,textTransform:"uppercase",marginBottom:6}}>Demo Access</div>
          <div style={{fontSize:18,fontWeight:800,color:C.text,marginBottom:4}}>Click any account to log in</div>
          <div style={{fontSize:13,color:C.textMuted,marginBottom:28}}>Each role sees a tailored view — admin sees everything, artists & labels see only their own content.</div>

          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {demoUsers.map(u=>(
              <button key={u.email} onClick={()=>{setEmail(u.email);setPassword(u.pw);setTimeout(()=>{const user=USERS.find(x=>x.email===u.email);if(user) onLogin(user);},100);}} style={{display:"flex",alignItems:"center",gap:14,background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 16px",cursor:"pointer",textAlign:"left",fontFamily:"inherit",transition:"border-color 0.2s"}} onMouseEnter={e=>e.currentTarget.style.borderColor=u.color+"60"} onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
                <div style={{width:36,height:36,borderRadius:"50%",background:`${u.color}20`,border:`1.5px solid ${u.color}50`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:u.color,fontFamily:"monospace",flexShrink:0}}>{u.email.slice(0,2).toUpperCase()}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:700,color:C.text}}>{u.label}</div>
                  <div style={{fontSize:11,color:C.textMuted}}>{u.email}</div>
                </div>
                <div style={{fontSize:11,color:C.textDim,fontFamily:"monospace"}}>{u.pw}</div>
                <span style={{color:u.color,fontSize:14}}>→</span>
              </button>
            ))}
          </div>

          <div style={{marginTop:28,padding:16,background:`${C.gold}08`,border:`1px solid ${C.gold}20`,borderRadius:10}}>
            <div style={{fontSize:11,fontWeight:700,color:C.gold,marginBottom:6}}>ROLE PERMISSIONS</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
              {[["Admin",C.purple,"Full access to all clients, releases, agents & admin tools"],["Artist / Label",C.gold,"View own releases, listen & approve masters, sign off artwork"],["Portal",C.blue,"Client-facing view of pipeline progress, royalties & sign-offs"]].map(([r,col,d])=>(
                <div key={r} style={{background:C.surfaceAlt,borderRadius:8,padding:10}}>
                  <div style={{fontSize:11,fontWeight:700,color:col,marginBottom:4}}>{r}</div>
                  <div style={{fontSize:11,color:C.textMuted,lineHeight:1.5}}>{d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Music Player (Simulated Waveform) ─────────────────────────────────────────
function MusicPlayer({filename,title,style}){
  const [playing,setPlaying]=useState(false);
  const [progress,setProgress]=useState(0);  // 0–1
  const [duration] = useState(Math.floor(180+Math.random()*120)); // fake duration 3–5min
  const [hoverPos,setHoverPos]=useState(null);
  const timerRef=useRef(null);
  const barRef=useRef(null);

  // Generate stable fake waveform bars
  const bars=useRef(Array.from({length:80},(_,i)=>{
    const env=Math.sin((i/80)*Math.PI)*0.7+0.3;
    return Math.max(0.08,env*(0.4+Math.random()*0.6));
  })).current;

  useEffect(()=>{
    if(playing){
      timerRef.current=setInterval(()=>{
        setProgress(p=>{
          if(p>=1){setPlaying(false);return 0;}
          return p+1/(duration*4);
        });
      },250);
    } else {
      clearInterval(timerRef.current);
    }
    return()=>clearInterval(timerRef.current);
  },[playing,duration]);

  function seek(e){
    const rect=barRef.current.getBoundingClientRect();
    const pct=Math.max(0,Math.min(1,(e.clientX-rect.left)/rect.width));
    setProgress(pct);
  }

  const elapsed=Math.floor(progress*duration);
  const filled=Math.floor(progress*bars.length);

  return(
    <div style={{background:C.surfaceAlt,border:`1px solid ${C.border}`,borderRadius:12,padding:"16px 18px",...style}}>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
        {/* Play/Pause button */}
        <button onClick={()=>setPlaying(p=>!p)} style={{width:40,height:40,borderRadius:"50%",background:C.gold,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:14}}>
          {playing?"⏸":"▶"}
        </button>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:13,fontWeight:700,color:C.text,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{title||filename}</div>
          <div style={{fontSize:11,color:C.textMuted,fontFamily:"monospace"}}>{filename}</div>
        </div>
        <div style={{fontSize:12,color:C.textMuted,fontFamily:"monospace",flexShrink:0}}>
          {fmtTime(elapsed)} / {fmtTime(duration)}
        </div>
      </div>

      {/* Waveform */}
      <div ref={barRef} onClick={seek} onMouseMove={e=>{const rect=barRef.current.getBoundingClientRect();setHoverPos((e.clientX-rect.left)/rect.width);}} onMouseLeave={()=>setHoverPos(null)} style={{display:"flex",alignItems:"center",gap:1.5,height:48,cursor:"pointer",position:"relative",paddingBottom:4}}>
        {bars.map((h,i)=>{
          const pct=i/bars.length;
          const isPlayed=pct<progress;
          const isHovered=hoverPos!==null&&pct<hoverPos&&!isPlayed;
          return(
            <div key={i} style={{flex:1,height:`${h*100}%`,borderRadius:2,background:isPlayed?C.gold:isHovered?`${C.gold}55`:`${C.gold}18`,transition:"background 0.1s"}}/>
          );
        })}
        {/* Progress needle */}
        <div style={{position:"absolute",left:`${progress*100}%`,top:0,bottom:4,width:2,background:C.goldLight,borderRadius:1,transform:"translateX(-50%)",pointerEvents:"none"}}/>
      </div>

      {/* Checklist notice */}
      <div style={{display:"flex",alignItems:"center",gap:8,marginTop:10,padding:"8px 12px",background:`${C.blue}0A`,border:`1px solid ${C.blue}20`,borderRadius:8}}>
        <span style={{fontSize:12,color:C.blue}}>ℹ</span>
        <span style={{fontSize:11,color:C.textMuted}}>Demo audio player — listen carefully and check levels, version, running time and any artefacts before approving.</span>
      </div>
    </div>
  );
}

// ── Email Composer ─────────────────────────────────────────────────────────────
function EmailComposer({template,client,release,onClose,onSent}){
  const fill=(str)=>str.replace(/\[ARTIST\]/g,client?.name||"").replace(/\[TITLE\]/g,release?.title||"").replace(/\[DATE\]/g,release?.date||"TBC").replace(/\[DEADLINE\]/g,release?.date?new Date(new Date(release.date)-14*86400000).toLocaleDateString("en-GB"):"TBC").replace(/\[AMOUNT\]/g,"0").replace(/\[QUARTER\]/g,"1").replace(/\[YEAR\]/g,"2025").replace(/\[PLATFORM\]/g,"TIDAL").replace(/\[EXPECTED\]/g,"0").replace(/\[RECEIVED\]/g,"0").replace(/\[DIFF\]/g,"0");
  const [to,setTo]=useState(client?.email||"");
  const [subject,setSubject]=useState(fill(template?.subject||""));
  const [body,setBody]=useState(fill(template?.body||""));
  const [sent,setSent]=useState(false);
  function send(){setSent(true);setTimeout(()=>{onSent&&onSent({to,subject,sentAt:new Date(),release:release?.title,client:client?.name});onClose();},1000);}
  return(
    <div style={{position:"fixed",inset:0,background:"#000d",zIndex:600,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:16,width:640,maxHeight:"88vh",overflow:"hidden",display:"flex",flexDirection:"column"}}>
        <div style={{padding:"20px 24px 16px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><div style={{fontSize:11,color:C.gold,fontWeight:700,letterSpacing:3,textTransform:"uppercase",marginBottom:4}}>Automated Email</div><div style={{fontSize:18,fontWeight:800,color:C.text}}>Compose & Send</div></div>
          <button onClick={onClose} style={{background:"transparent",border:"none",color:C.textMuted,fontSize:22,cursor:"pointer"}}>×</button>
        </div>
        {sent?<div style={{padding:48,textAlign:"center"}}><div style={{fontSize:40,marginBottom:12}}>✓</div><div style={{fontSize:16,fontWeight:800,color:C.green}}>Email sent to {to}</div></div>:(
          <div style={{padding:24,overflowY:"auto",display:"flex",flexDirection:"column",gap:14}}>
            <Inp label="To" value={to} onChange={setTo} placeholder="recipient@example.com"/>
            <Inp label="Subject" value={subject} onChange={setSubject}/>
            <div>
              <div style={{fontSize:11,color:C.textMuted,marginBottom:4,textTransform:"uppercase",letterSpacing:1}}>Body</div>
              <textarea value={body} onChange={e=>setBody(e.target.value)} style={{width:"100%",background:C.surfaceAlt,border:`1px solid ${C.border}`,borderRadius:6,padding:"10px 12px",color:C.text,fontSize:13,fontFamily:"monospace",resize:"vertical",minHeight:180,outline:"none",boxSizing:"border-box",lineHeight:1.6}}/>
            </div>
            <div style={{display:"flex",justifyContent:"space-between"}}><Btn onClick={onClose} variant="ghost">Cancel</Btn><Btn onClick={send}>Send Email →</Btn></div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Agent Feed ────────────────────────────────────────────────────────────────
function Feed(){const active=AGENTS.filter(a=>a.status==="Active");const [feed,setFeed]=useState(()=>active.map(a=>({id:a.id,agent:a.name,color:a.color,msg:a.lastAction,time:new Date()})));useEffect(()=>{const iv=setInterval(()=>{const a=active[Math.floor(Math.random()*active.length)];setFeed(f=>[{id:Date.now(),agent:a.name,color:a.color,msg:LOG_POOL[Math.floor(Math.random()*LOG_POOL.length)],time:new Date()},...f.slice(0,29)]);},2800);return()=>clearInterval(iv);},[]);
const fmt=d=>`${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}:${String(d.getSeconds()).padStart(2,"0")}`;
return <div style={{height:"100%",overflowY:"auto"}}>{feed.map((item,i)=><div key={item.id} style={{display:"flex",gap:10,padding:"10px 16px",borderBottom:`1px solid ${C.border}`,background:i===0?`${item.color}08`:"transparent"}}><div style={{width:6,height:6,borderRadius:"50%",background:item.color,flexShrink:0,marginTop:5,boxShadow:i===0?`0 0 8px ${item.color}`:"none"}}/><div style={{flex:1}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}><span style={{fontSize:11,fontWeight:700,color:item.color}}>{item.agent}</span><span style={{fontSize:10,color:C.textDim,fontFamily:"monospace"}}>{fmt(item.time)}</span></div><div style={{fontSize:12,color:C.textMuted,lineHeight:1.5}}>{item.msg}</div></div></div>)}</div>;}

// ── Agent Modal ───────────────────────────────────────────────────────────────
function AgentModal({agent,release,onClose}){const [log,setLog]=useState([{time:"09:14",msg:`Initialised${release?` for ${release.title}`:""}`},{time:"09:15",msg:agent.lastAction}]);const [running,setRunning]=useState(false);function run(action){setRunning(true);setTimeout(()=>{const t=new Date();setLog(l=>[...l,{time:`${String(t.getHours()).padStart(2,"0")}:${String(t.getMinutes()).padStart(2,"0")}`,msg:`✓ ${action}${release?` — ${release.title}`:""}`}]);setRunning(false);},900);}
return <div style={{position:"fixed",inset:0,background:"#000c",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{background:C.bg,border:`1px solid ${agent.color}40`,borderRadius:16,width:660,maxHeight:"88vh",overflow:"hidden",display:"flex",flexDirection:"column"}}><div style={{padding:"22px 26px 16px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between"}}><div><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}><div style={{width:7,height:7,borderRadius:"50%",background:agent.status==="Active"?C.green:C.textMuted}}/><span style={{fontSize:11,color:agent.color,fontWeight:700,letterSpacing:2,textTransform:"uppercase"}}>{agent.pillar}</span></div><div style={{fontSize:20,fontWeight:800,color:C.text}}>{agent.name}</div>{release&&<div style={{fontSize:12,color:C.textMuted}}>Context: {release.title}</div>}</div><button onClick={onClose} style={{background:"transparent",border:"none",color:C.textMuted,fontSize:22,cursor:"pointer"}}>×</button></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",flex:1,overflow:"hidden"}}><div style={{padding:22,borderRight:`1px solid ${C.border}`,overflowY:"auto"}}><p style={{fontSize:13,color:C.text,lineHeight:1.7,marginBottom:18}}>{agent.description}</p><div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:18}}>{agent.actions.map((a,i)=><button key={i} onClick={()=>run(a)} disabled={running} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 12px",color:C.text,fontSize:13,cursor:running?"not-allowed":"pointer",textAlign:"left",fontFamily:"inherit",display:"flex",justifyContent:"space-between"}}>{a}<span style={{color:agent.color}}>→</span></button>)}</div><div style={{display:"flex",alignItems:"center",gap:10}}><div style={{flex:1}}><Bar value={agent.load} color={agent.color}/></div><span style={{fontSize:11,color:C.textMuted,fontFamily:"monospace"}}>{agent.load}%</span></div></div><div style={{padding:22,display:"flex",flexDirection:"column"}}><div style={{fontSize:12,fontWeight:700,color:C.textMuted,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Activity Log</div><div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:7}}>{log.map((l,i)=><div key={i} style={{display:"flex",gap:10,padding:"9px 12px",background:C.surface,borderRadius:8,border:`1px solid ${C.border}`}}><span style={{fontSize:11,color:C.textDim,fontFamily:"monospace",flexShrink:0}}>{l.time}</span><span style={{fontSize:12,color:C.text,lineHeight:1.5}}>{l.msg}</span></div>)}{running&&<div style={{padding:"9px 12px",background:C.surface,borderRadius:8,border:`1px solid ${C.border}`,fontSize:12,color:C.textMuted}}>⟳ Running...</div>}</div></div></div></div></div>;}

// ── Pipeline Visual ───────────────────────────────────────────────────────────
function Pipeline({stage,compact=false}){
  const idx=PIPELINE_STAGES.indexOf(stage);
  const stageColor={awaiting_upload:C.orange,mastering:C.gold,master_review:C.purple,qc:C.blue,dsp_delivery:C.green,live:C.green};
  if(compact){return <div style={{display:"flex",alignItems:"center",gap:4}}>{PIPELINE_STAGES.map((s,i)=><div key={s} style={{width:i===idx?20:8,height:8,borderRadius:4,background:i<idx?C.green:i===idx?stageColor[s]:C.border,transition:"all 0.3s"}} title={PIPELINE_LABELS[s]}/>)}</div>;}
  return(
    <div style={{display:"flex",alignItems:"flex-start"}}>
      {PIPELINE_STAGES.map((s,i)=>(
        <div key={s} style={{display:"flex",alignItems:"flex-start",flex:i<PIPELINE_STAGES.length-1?1:0}}>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
            <div style={{width:30,height:30,borderRadius:"50%",background:i<idx?`${C.green}22`:i===idx?`${stageColor[s]}22`:C.surfaceAlt,border:`2px solid ${i<idx?C.green:i===idx?stageColor[s]:C.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:i<idx?C.green:i===idx?stageColor[s]:C.textDim,fontWeight:700}}>{i<idx?"✓":i+1}</div>
            <div style={{fontSize:9,color:i<idx?C.green:i===idx?stageColor[s]:C.textMuted,whiteSpace:"nowrap",textAlign:"center",maxWidth:60,lineHeight:1.2}}>{PIPELINE_LABELS[s]}</div>
          </div>
          {i<PIPELINE_STAGES.length-1&&<div style={{flex:1,height:2,background:i<idx?C.green:C.border,margin:"14px 4px 0"}}/>}
        </div>
      ))}
    </div>
  );
}

// ── Gantt ─────────────────────────────────────────────────────────────────────
function Gantt({releases}){const today=new Date(),t0=new Date(today.getFullYear(),today.getMonth()-1,1),W=14,DAYS=120;const phC={Upload:C.blue,Mastering:C.gold,"M.Review":C.purple,Delivery:C.green};const off=d=>Math.floor((new Date(d)-t0)/86400000);const todOff=off(today);const mons=Array.from({length:4},(_,i)=>{const d=new Date(t0.getFullYear(),t0.getMonth()+i,1);return{label:`${MONTHS[d.getMonth()]} ${d.getFullYear()}`,x:off(d)};});const sorted=[...releases].filter(r=>r.date).sort((a,b)=>new Date(a.date)-new Date(b.date));
return <div style={{overflowX:"auto"}}><div style={{minWidth:DAYS*W+200}}><div style={{display:"flex",borderBottom:`1px solid ${C.border}`,paddingBottom:6,marginBottom:4}}><div style={{width:180,flexShrink:0}}/><div style={{position:"relative",width:DAYS*W,height:18,flexShrink:0}}>{mons.map((m,i)=><div key={i} style={{position:"absolute",left:m.x*W,fontSize:10,color:C.textMuted,fontWeight:700,textTransform:"uppercase"}}>{m.label}</div>)}</div></div><div style={{position:"relative"}}>{todOff>=0&&todOff<=DAYS&&<div style={{position:"absolute",left:180+todOff*W,top:0,bottom:0,width:1,background:C.gold,opacity:0.5,zIndex:1,pointerEvents:"none"}}><div style={{position:"absolute",top:-14,left:-14,fontSize:9,color:C.gold,fontWeight:700}}>TODAY</div></div>}{sorted.map(r=>{const o=off(r.date),idx=PIPELINE_STAGES.indexOf(r.pipelineStage);const phases=[{s:Math.max(0,o-16),e:Math.max(0,o-12),c:phC.Upload,done:idx>0},{s:Math.max(0,o-12),e:Math.max(0,o-7),c:phC.Mastering,done:idx>1},{s:Math.max(0,o-7),e:Math.max(0,o-3),c:phC["M.Review"],done:idx>2},{s:Math.max(0,o-3),e:o,c:phC.Delivery,done:idx>3}];return(<div key={r.id} style={{display:"flex",alignItems:"center",height:38,borderBottom:`1px solid ${C.border}`}}><div style={{width:180,flexShrink:0,padding:"0 12px"}}><div style={{fontSize:12,fontWeight:700,color:C.text,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{r.title}</div><div style={{fontSize:10,color:C.textMuted}}>{r.client}</div></div><div style={{width:DAYS*W,flexShrink:0,position:"relative",height:24}}>{phases.map((ph,j)=>{if(ph.s>DAYS||ph.e<0) return null;return <div key={j} style={{position:"absolute",left:Math.max(0,ph.s)*W,width:Math.max(2,(ph.e-ph.s))*W,height:8,top:8,background:ph.done?ph.c:`${ph.c}33`,border:`1px solid ${ph.c}60`,borderRadius:j===0?"4px 0 0 4px":j===3?"0 4px 4px 0":0}}/>;})}{o>=0&&o<=DAYS&&<div style={{position:"absolute",left:o*W-1,top:2,width:2,height:20,background:r.pipelineStage==="live"?C.green:C.orange,borderRadius:1}}/>}</div></div>);})}</div><div style={{display:"flex",gap:16,marginTop:12,paddingLeft:180}}>{Object.entries(phC).map(([l,col])=><div key={l} style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:14,height:4,background:col,borderRadius:2}}/><span style={{fontSize:10,color:C.textMuted}}>{l}</span></div>)}</div></div></div>;}

// ── Upload Portal ─────────────────────────────────────────────────────────────
function UploadPortal({release,onClose,onUpdate}){
  const [tier,setTier]=useState(release.masteringTier||null);
  const [explicit,setExplicit]=useState(release.explicit||false);
  const [splits,setSplits]=useState(release.splits?.length?release.splits:[{name:"",role:"Artist",percentage:100}]);
  const [upc,setUpc]=useState(release.upc||"");
  const [isrc,setIsrc]=useState(release.isrc||"");
  const [artwork,setArtwork]=useState(release.artwork||null);
  const [fileUploaded,setFile]=useState(!!release.uploadedFiles?.length);
  const [fakeFile,setFakeFile]=useState(release.uploadedFiles?.[0]||null);
  const [notes,setNotes]=useState(release.notes||"");
  const [step,setStep]=useState(0);
  const [submitting,setSub]=useState(false);
  const [done,setDone]=useState(false);
  const totalSplit=splits.reduce((s,sp)=>s+Number(sp.percentage||0),0);
  const canFinish=tier&&fileUploaded&&totalSplit===100&&upc.trim()&&isrc.trim();
  const STEPS=["Audio","Metadata","Splits","Artwork","Submit"];
  function fakeUpload(){setFakeFile(release.title.toLowerCase().replace(/ /g,"_")+"_premaster.wav");setFile(true);}
  function fakeArt(){setArtwork(release.title.toLowerCase().replace(/ /g,"_")+"_cover.jpg");}
  function submit(){setSub(true);setTimeout(()=>{onUpdate(release.id,{pipelineStage:"mastering",masteringTier:tier,explicit,splits,upc:upc.trim(),isrc:isrc.trim(),artwork,uploadedFiles:fakeFile?[fakeFile]:[],notes,status:"In Progress"});setSub(false);setDone(true);},1200);}
  return(
    <div style={{position:"fixed",inset:0,background:"#000c",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:16,width:700,maxHeight:"92vh",overflow:"hidden",display:"flex",flexDirection:"column"}}>
        <div style={{padding:"22px 28px 14px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between"}}>
          <div><div style={{fontSize:11,color:C.gold,letterSpacing:3,fontWeight:700,textTransform:"uppercase",marginBottom:4}}>Upload Portal</div><div style={{fontSize:19,fontWeight:800,color:C.text}}>{release.title}</div></div>
          <button onClick={onClose} style={{background:"transparent",border:"none",color:C.textMuted,fontSize:22,cursor:"pointer"}}>×</button>
        </div>
        {done?(<div style={{padding:40,textAlign:"center"}}><div style={{fontSize:44,marginBottom:10}}>✓</div><div style={{fontSize:17,fontWeight:800,color:C.green,marginBottom:6}}>Submitted to Apex Works</div><Btn onClick={onClose} variant="ghost">Close</Btn></div>):(
          <div style={{display:"flex",flexDirection:"column",flex:1,overflow:"hidden"}}>
            <div style={{display:"flex",borderBottom:`1px solid ${C.border}`,padding:"0 28px"}}>
              {STEPS.map((s,i)=><button key={s} onClick={()=>{if(i<step)setStep(i);}} style={{background:"transparent",border:"none",borderBottom:`2px solid ${i===step?C.gold:i<step?C.green:"transparent"}`,color:i===step?C.gold:i<step?C.green:C.textMuted,padding:"10px 14px",fontSize:12,fontWeight:700,cursor:i<step?"pointer":"default",fontFamily:"inherit"}}>{i<step?"✓ ":""}{s}</button>)}
            </div>
            <div style={{flex:1,overflowY:"auto",padding:"22px 28px"}}>
              {step===0&&<div><div style={{fontSize:15,fontWeight:700,color:C.text,marginBottom:4}}>Upload Pre-Master Audio</div><div style={{fontSize:13,color:C.textMuted,marginBottom:16}}>WAV or FLAC · 24-bit minimum · No limiting, no clipping</div>{fileUploaded?<div style={{background:`${C.green}0A`,border:`1px solid ${C.green}40`,borderRadius:10,padding:14,display:"flex",alignItems:"center",gap:12,marginBottom:16}}><span style={{color:C.green}}>✓</span><div style={{fontSize:13,fontWeight:700,color:C.green}}>{fakeFile}</div><button onClick={()=>{setFile(false);setFakeFile(null);}} style={{marginLeft:"auto",background:"transparent",border:"none",color:C.textMuted,cursor:"pointer",fontSize:18}}>×</button></div>:<div onClick={fakeUpload} style={{border:`1.5px dashed ${C.border}`,borderRadius:10,padding:32,textAlign:"center",cursor:"pointer",marginBottom:16}} onMouseEnter={e=>e.currentTarget.style.borderColor=C.gold} onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}><div style={{fontSize:26,marginBottom:6}}>↑</div><div style={{fontSize:14,fontWeight:600,color:C.text,marginBottom:4}}>Click to upload pre-master</div><div style={{fontSize:12,color:C.textMuted}}>WAV / FLAC · 24-bit+ · Max 2GB</div></div>}<div style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:10}}>Mastering Tier</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>{[{k:"automated",title:"Automated (LANDR)",sub:"~24hr turnaround"},{k:"human",title:"Human Engineer",sub:"3–5 business days"}].map(opt=><div key={opt.k} onClick={()=>setTier(opt.k)} style={{border:`1.5px solid ${tier===opt.k?C.gold:C.border}`,background:tier===opt.k?`${C.gold}0A`:C.surface,borderRadius:10,padding:14,cursor:"pointer"}}><div style={{fontSize:13,fontWeight:700,color:tier===opt.k?C.gold:C.text,marginBottom:3}}>{opt.title}</div><div style={{fontSize:12,color:C.textMuted}}>{opt.sub}</div></div>)}</div></div>}
              {step===1&&<div><Inp label="UPC (Barcode)" value={upc} onChange={setUpc} placeholder="e.g. 5059123456789"/><div style={{height:12}}/><Inp label="ISRC" value={isrc} onChange={setIsrc} placeholder="e.g. GBUM72505001"/><div style={{marginTop:14}}><div style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:10}}>Content Flag</div><div style={{display:"flex",gap:8}}>{[{v:false,l:"Clean"},{v:true,l:"Explicit"}].map(o=><div key={String(o.v)} onClick={()=>setExplicit(o.v)} style={{border:`1.5px solid ${explicit===o.v?C.gold:C.border}`,background:explicit===o.v?`${C.gold}0A`:C.surface,borderRadius:8,padding:"8px 18px",cursor:"pointer",fontSize:13,fontWeight:600,color:explicit===o.v?C.gold:C.textMuted}}>{o.l}</div>)}</div></div></div>}
              {step===2&&<div><div style={{fontSize:15,fontWeight:700,color:C.text,marginBottom:4}}>Contributor Splits</div><div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:12}}>{splits.map((sp,i)=><div key={i} style={{display:"grid",gridTemplateColumns:"1fr 1fr 90px 28px",gap:8,alignItems:"center"}}><input placeholder="Full name" value={sp.name} onChange={e=>setSplits(s=>s.map((x,j)=>j===i?{...x,name:e.target.value}:x))} style={{background:C.surfaceAlt,border:`1px solid ${C.border}`,borderRadius:6,padding:"8px 10px",color:C.text,fontSize:13,outline:"none",fontFamily:"inherit"}}/><select value={sp.role} onChange={e=>setSplits(s=>s.map((x,j)=>j===i?{...x,role:e.target.value}:x))} style={{background:C.surfaceAlt,border:`1px solid ${C.border}`,borderRadius:6,padding:"8px 10px",color:C.text,fontSize:13,outline:"none",fontFamily:"inherit"}}>{["Artist","Co-artist","Producer","Co-writer","Publisher","Label"].map(r=><option key={r}>{r}</option>)}</select><div style={{display:"flex",alignItems:"center",gap:4}}><input type="number" min="0" max="100" value={sp.percentage} onChange={e=>setSplits(s=>s.map((x,j)=>j===i?{...x,percentage:Number(e.target.value)}:x))} style={{width:"100%",background:C.surfaceAlt,border:`1px solid ${C.border}`,borderRadius:6,padding:"8px",color:C.text,fontSize:13,outline:"none",fontFamily:"inherit"}}/><span style={{fontSize:12,color:C.textMuted}}>%</span></div><button onClick={()=>setSplits(s=>s.filter((_,j)=>j!==i))} style={{background:"transparent",border:"none",color:C.textDim,cursor:"pointer",fontSize:18}}>×</button></div>)}</div><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><Btn onClick={()=>setSplits(s=>[...s,{name:"",role:"Co-writer",percentage:0}])} variant="ghost" small>+ Add Contributor</Btn><div style={{fontSize:13,color:totalSplit===100?C.green:C.orange,fontWeight:700}}>Total: {totalSplit}% {totalSplit===100?"✓":`(${100-totalSplit}% remaining)`}</div></div></div>}
              {step===3&&<div>{artwork?<div style={{background:`${C.green}0A`,border:`1px solid ${C.green}40`,borderRadius:10,padding:14,display:"flex",alignItems:"center",gap:12,marginBottom:16}}><span style={{fontSize:18}}>🖼</span><div style={{fontSize:13,fontWeight:700,color:C.green}}>{artwork}</div><button onClick={()=>setArtwork(null)} style={{marginLeft:"auto",background:"transparent",border:"none",color:C.textMuted,cursor:"pointer",fontSize:18}}>×</button></div>:<div onClick={fakeArt} style={{border:`1.5px dashed ${C.border}`,borderRadius:10,padding:32,textAlign:"center",cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.borderColor=C.gold} onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}><div style={{fontSize:26,marginBottom:6}}>🖼</div><div style={{fontSize:14,fontWeight:600,color:C.text,marginBottom:3}}>Click to upload artwork</div><div style={{fontSize:12,color:C.textMuted}}>JPEG / PNG · 3000×3000px min</div></div>}</div>}
              {step===4&&<div><div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:18,marginBottom:14}}>{[["Release",release.title],["Audio",fakeFile||"⚠ Not uploaded"],["Artwork",artwork||"⚠ Not uploaded"],["UPC",upc||"⚠ Missing"],["ISRC",isrc||"⚠ Missing"],["Mastering",tier==="human"?"👤 Human":tier==="automated"?"⚡ LANDR":"⚠ Not selected"]].map(([l,v])=><div key={l} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${C.border}`}}><span style={{fontSize:12,color:C.textMuted}}>{l}</span><span style={{fontSize:12,color:String(v).startsWith("⚠")?C.orange:C.text,fontWeight:600}}>{v}</span></div>)}</div>{canFinish?<div style={{background:`${C.green}08`,border:`1px solid ${C.green}30`,borderRadius:8,padding:12,fontSize:12,color:C.green}}>✓ All checks passed. Ready to submit.</div>:<div style={{background:`${C.orange}10`,border:`1px solid ${C.orange}30`,borderRadius:8,padding:12,fontSize:12,color:C.orange}}>⚠ Please complete all required fields before submitting.</div>}</div>}
            </div>
            <div style={{padding:"14px 28px",borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between"}}>
              <Btn onClick={()=>setStep(s=>Math.max(0,s-1))} variant="ghost" disabled={step===0}>← Back</Btn>
              {step<4?<Btn onClick={()=>setStep(s=>s+1)}>Continue →</Btn>:<Btn onClick={submit} disabled={!canFinish||submitting}>{submitting?"Submitting...":"Submit to Apex Works →"}</Btn>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Master Sign-off (with Music Player) ───────────────────────────────────────
function MasterSignoff({release,onClose,onUpdate,currentUser}){
  const [decision,setDecision]=useState(null);
  const [notes,setNotes]=useState("");
  const [submitting,setSub]=useState(false);
  const [done,setDone]=useState(false);
  const [listenedEnough,setListenedEnough]=useState(false);

  function submit(){if(!decision) return;setSub(true);setTimeout(()=>{if(decision==="approve"){onUpdate(release.id,{pipelineStage:"qc",masterApproved:true,masterApprovedBy:currentUser?.name,masterApprovedAt:new Date().toISOString()});}else{onUpdate(release.id,{pipelineStage:"mastering",masterApproved:false,masterFile:null});}setSub(false);setDone(true);},900);}

  const masterFile=release.masterFile||release.title.toLowerCase().replace(/ /g,"_")+"_master.wav";

  return(
    <div style={{position:"fixed",inset:0,background:"#000c",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:16,width:660,maxHeight:"92vh",overflow:"hidden",display:"flex",flexDirection:"column"}}>
        <div style={{padding:"22px 26px 14px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between"}}>
          <div><div style={{fontSize:11,color:C.gold,letterSpacing:3,fontWeight:700,textTransform:"uppercase",marginBottom:4}}>Master Sign-off</div><div style={{fontSize:19,fontWeight:800,color:C.text}}>{release.title}</div><div style={{fontSize:12,color:C.textMuted}}>{release.client} · {release.masteringTier==="human"?"Human Engineer":"LANDR Automated"}</div></div>
          <button onClick={onClose} style={{background:"transparent",border:"none",color:C.textMuted,fontSize:22,cursor:"pointer"}}>×</button>
        </div>

        {done?(
          <div style={{padding:40,textAlign:"center"}}>
            <div style={{fontSize:44,marginBottom:10}}>{decision==="approve"?"✓":"↩"}</div>
            <div style={{fontSize:16,fontWeight:800,color:decision==="approve"?C.green:C.orange,marginBottom:8}}>{decision==="approve"?"Master approved — moving to QC":"Master sent back for revision"}</div>
            {decision==="approve"&&<div style={{fontSize:13,color:C.textMuted,marginBottom:8}}>Approved by {currentUser?.name}</div>}
            <Btn onClick={onClose} variant="ghost">Close</Btn>
          </div>
        ):(
          <div style={{padding:24,overflowY:"auto"}}>
            {/* Music Player — prominent */}
            <div style={{marginBottom:20}}>
              <div style={{fontSize:12,fontWeight:700,color:C.text,textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>🎵 Master Recording — Listen Before Approving</div>
              <MusicPlayer
                filename={masterFile}
                title={release.title}
                style={{}}
              />
              {!listenedEnough&&(
                <div style={{marginTop:10,display:"flex",gap:10,alignItems:"center"}}>
                  <div style={{flex:1,height:2,background:C.border,borderRadius:1}}/>
                  <button onClick={()=>setListenedEnough(true)} style={{background:`${C.gold}18`,border:`1px solid ${C.gold}40`,borderRadius:8,padding:"6px 16px",color:C.gold,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}}>✓ I have listened to this master</button>
                </div>
              )}
              {listenedEnough&&<div style={{marginTop:8,fontSize:12,color:C.green,textAlign:"center"}}>✓ Listening confirmed by {currentUser?.name}</div>}
            </div>

            {/* Checklist */}
            <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:18,marginBottom:18}}>
              <div style={{fontSize:12,fontWeight:700,color:C.textMuted,textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>Review Checklist</div>
              {[["Overall sound and levels are correct",true],["No clipping or digital artefacts",true],["Correct version and running time",true],["Clean version is actually clean (if applicable)",!release.explicit],["Fade in / fade out as specified",true]].map(([item,ok],i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 0",borderBottom:i<4?`1px solid ${C.border}`:"none"}}>
                  <span style={{fontSize:13,color:C.textMuted}}>○</span>
                  <span style={{fontSize:13,color:ok?C.textMuted:C.orange}}>{item}</span>
                  {!ok&&<span style={{fontSize:11,color:C.orange,marginLeft:"auto"}}>⚠ Check this carefully</span>}
                </div>
              ))}
            </div>

            {/* Decision */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
              <div onClick={()=>setDecision("approve")} style={{border:`2px solid ${decision==="approve"?C.green:C.border}`,background:decision==="approve"?`${C.green}0A`:C.surface,borderRadius:12,padding:18,cursor:"pointer",textAlign:"center"}}>
                <div style={{fontSize:24,marginBottom:6}}>✓</div>
                <div style={{fontSize:14,fontWeight:700,color:decision==="approve"?C.green:C.text}}>Approve Master</div>
                <div style={{fontSize:11,color:C.textMuted,marginTop:3}}>Move to QC & DSP delivery</div>
              </div>
              <div onClick={()=>setDecision("reject")} style={{border:`2px solid ${decision==="reject"?C.orange:C.border}`,background:decision==="reject"?`${C.orange}0A`:C.surface,borderRadius:12,padding:18,cursor:"pointer",textAlign:"center"}}>
                <div style={{fontSize:24,marginBottom:6}}>↩</div>
                <div style={{fontSize:14,fontWeight:700,color:decision==="reject"?C.orange:C.text}}>Request Revision</div>
                <div style={{fontSize:11,color:C.textMuted,marginTop:3}}>Send back to mastering</div>
              </div>
            </div>

            {decision&&<div style={{marginBottom:14}}><Inp label={decision==="approve"?"Notes for team (optional)":"Revision notes (required)"} value={notes} onChange={setNotes} placeholder={decision==="approve"?"Any final notes...":"Describe what needs to change..."}/></div>}

            {decision==="approve"&&!listenedEnough&&(
              <div style={{background:`${C.orange}10`,border:`1px solid ${C.orange}30`,borderRadius:8,padding:12,fontSize:12,color:C.orange,marginBottom:12}}>
                ⚠ Please confirm you have listened to the master before approving.
              </div>
            )}

            <div style={{display:"flex",justifyContent:"space-between"}}>
              <Btn onClick={onClose} variant="ghost">Cancel</Btn>
              <Btn onClick={submit} disabled={!decision||(decision==="reject"&&!notes.trim())||(decision==="approve"&&!listenedEnough)||submitting}>
                {submitting?"Submitting...":decision==="approve"?"Approve & Continue →":"Send for Revision →"}
              </Btn>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Oversight ─────────────────────────────────────────────────────────────────
function Oversight({releases,clients,royalties,tasks,onEmailCompose}){
  const cMap={};clients.forEach(c=>{cMap[c.id]=c;});
  const today=new Date();
  const blocked=releases.filter(r=>r.pipelineStage==="awaiting_upload"&&r.date&&daysUntil(r.date)<21);
  const needsMasterReview=releases.filter(r=>r.pipelineStage==="master_review");
  const needsArtwork=releases.filter(r=>!r.artworkApproved&&r.pipelineStage!=="awaiting_upload"&&r.pipelineStage!=="live");
  const disputedRoyalties=royalties.filter(r=>r.status==="Disputed");
  const overdueTasks=tasks.filter(t=>t.due&&new Date(t.due)<today&&t.status!=="Done");
  const upcomingReleases=releases.filter(r=>r.date&&daysUntil(r.date)>0&&daysUntil(r.date)<=14&&r.pipelineStage!=="live");
  const section=(title,color,items,renderItem)=>items.length>0&&(<div style={{marginBottom:20}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}><div style={{width:8,height:8,borderRadius:"50%",background:color,boxShadow:`0 0 6px ${color}`}}/><span style={{fontSize:12,fontWeight:700,color,textTransform:"uppercase",letterSpacing:1.5}}>{title}</span><span style={{background:`${color}22`,color,fontSize:11,fontWeight:700,padding:"1px 8px",borderRadius:10}}>{items.length}</span></div><div style={{display:"flex",flexDirection:"column",gap:8}}>{items.map(renderItem)}</div></div>);
  return(
    <div style={{padding:32,overflowY:"auto",height:"100%"}}>
      <div style={{marginBottom:24}}><div style={{fontSize:22,fontWeight:800,color:C.text}}>Distributor Oversight</div><div style={{fontSize:13,color:C.textMuted,marginTop:3}}>Everything that needs your attention right now</div></div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:28}}>{[[blocked.length,"Blocked Releases",C.red],[needsMasterReview.length,"Awaiting Sign-off",C.purple],[upcomingReleases.length,"Due This Fortnight",C.orange],[overdueTasks.length,"Overdue Tasks",C.red]].map(([v,l,col])=>(<div key={l} style={{background:C.surface,border:`1px solid ${v>0?col+"40":C.border}`,borderRadius:12,padding:"16px 20px"}}><div style={{fontSize:10,color:C.textMuted,textTransform:"uppercase",letterSpacing:1.5,marginBottom:6}}>{l}</div><div style={{fontSize:28,fontWeight:800,color:v>0?col:C.textMuted,fontFamily:"monospace"}}>{v}</div></div>))}</div>
      {section("Releases blocked — awaiting upload",C.red,blocked,r=>(<div key={r.id} style={{background:C.surface,border:`1px solid ${C.red}30`,borderRadius:10,padding:"14px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:13,fontWeight:700,color:C.text}}>{r.title} <span style={{color:C.red,fontWeight:400,fontSize:12}}>— {daysUntil(r.date)}d until release</span></div><div style={{fontSize:12,color:C.textMuted}}>{r.client} · {r.date}</div></div><Btn onClick={()=>onEmailCompose("upload_request",cMap[r.clientId],r)} small>📧 Chase Upload</Btn></div>))}
      {section("Master sign-off required",C.purple,needsMasterReview,r=>(<div key={r.id} style={{background:C.surface,border:`1px solid ${C.purple}30`,borderRadius:10,padding:"14px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:13,fontWeight:700,color:C.text}}>{r.title}</div><div style={{fontSize:12,color:C.textMuted}}>{r.client} · Master ready — awaiting artist approval</div>{r.masterApprovedBy&&<div style={{fontSize:11,color:C.green,marginTop:2}}>✓ Approved by {r.masterApprovedBy}</div>}</div><Btn onClick={()=>onEmailCompose("master_ready",cMap[r.clientId],r)} small>📧 Notify Artist</Btn></div>))}
      {section("Artwork sign-off needed",C.orange,needsArtwork,r=>(<div key={r.id} style={{background:C.surface,border:`1px solid ${C.orange}30`,borderRadius:10,padding:"14px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:13,fontWeight:700,color:C.text}}>{r.title}</div><div style={{fontSize:12,color:C.textMuted}}>{r.client} · Artwork not approved</div></div><Btn onClick={()=>onEmailCompose("artwork_required",cMap[r.clientId],r)} small>📧 Chase Approval</Btn></div>))}
      {section("Upcoming releases",C.gold,upcomingReleases,r=>(<div key={r.id} style={{background:C.surface,border:`1px solid ${C.gold}30`,borderRadius:10,padding:"14px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:13,fontWeight:700,color:C.text}}>{r.title} <span style={{color:C.gold,fontSize:12}}>— {daysUntil(r.date)}d away</span></div><div style={{fontSize:12,color:C.textMuted,marginBottom:8}}>{r.client} · {r.date}</div><Pipeline stage={r.pipelineStage} compact/></div><Btn onClick={()=>onEmailCompose("going_live",cMap[r.clientId],r)} small>📧 Going Live</Btn></div>))}
      {section("Royalty disputes",C.red,disputedRoyalties,r=>(<div key={r.id} style={{background:C.surface,border:`1px solid ${C.red}30`,borderRadius:10,padding:"14px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:13,fontWeight:700,color:C.text}}>{r.release} — {r.platform}</div><div style={{fontSize:12,color:C.textMuted}}>{cMap[r.clientId]?.name} · {r.period} · <span style={{color:C.red}}>£{r.amount.toLocaleString()}</span></div></div><Btn onClick={()=>onEmailCompose("dispute_raised",cMap[r.clientId],r)} small>📧 Notify Client</Btn></div>))}
      {section("Overdue tasks",C.red,overdueTasks,t=>(<div key={t.id} style={{background:C.surface,border:`1px solid ${C.red}30`,borderRadius:10,padding:"14px 16px"}}><div style={{fontSize:13,fontWeight:700,color:C.text}}>{t.title}</div><div style={{fontSize:12,color:C.textMuted}}>{t.assignee} · Due {t.due} · <span style={{color:C.red}}>overdue by {Math.abs(daysUntil(t.due))}d</span></div></div>))}
      {blocked.length===0&&needsMasterReview.length===0&&needsArtwork.length===0&&upcomingReleases.length===0&&disputedRoyalties.length===0&&overdueTasks.length===0&&(<div style={{padding:48,textAlign:"center",color:C.textMuted}}><div style={{fontSize:32,marginBottom:12}}>✓</div><div style={{fontSize:16,fontWeight:700,color:C.green,marginBottom:6}}>All clear</div><div style={{fontSize:13}}>Nothing needs your attention right now.</div></div>)}
    </div>
  );
}

// ── Release Detail ─────────────────────────────────────────────────────────────
function ReleaseDetail({release,onBack,backLabel,setReleases,clients,onEmailCompose,currentUser}){
  const [showUpload,setUpload]=useState(false);
  const [showMaster,setMaster]=useState(false);
  const [agentModal,setAM]=useState(null);
  const client=clients.find(c=>c.id===release.clientId);
  const pc={Distribution:C.blue,Marketing:C.purple,Creative:C.gold};
  const isAdmin=currentUser?.role==="admin";
  function advancePipeline(){const stages=PIPELINE_STAGES;const idx=stages.indexOf(release.pipelineStage);if(idx<stages.length-1) setReleases(p=>p.map(r=>r.id===release.id?{...r,pipelineStage:stages[idx+1]}:r));}
  const stageActions={awaiting_upload:{label:"Open Upload Portal",action:()=>setUpload(true),color:C.orange},mastering:{label:"Mark Mastering Complete",action:()=>{setReleases(p=>p.map(r=>r.id===release.id?{...r,pipelineStage:"master_review",masterFile:r.title.toLowerCase().replace(/ /g,"_")+"_master.wav"}:r));onEmailCompose&&onEmailCompose("master_ready",client,release);},color:C.gold},master_review:{label:"Open Master Sign-off",action:()=>setMaster(true),color:C.purple},qc:{label:"Mark QC Passed",action:advancePipeline,color:C.blue},dsp_delivery:{label:"Confirm DSP Delivery",action:()=>{setReleases(p=>p.map(r=>r.id===release.id?{...r,pipelineStage:"live",dsp:"Live",status:"Live"}:r));onEmailCompose&&onEmailCompose("going_live",client,release);},color:C.green},live:null};
  const action=stageActions[release.pipelineStage];
  return(
    <div style={{padding:32,overflowY:"auto",height:"100%"}}>
      {showUpload&&<UploadPortal release={release} onClose={()=>setUpload(false)} onUpdate={(id,patch)=>setReleases(p=>p.map(r=>r.id===id?{...r,...patch}:r))}/>}
      {showMaster&&<MasterSignoff release={release} onClose={()=>setMaster(false)} onUpdate={(id,patch)=>setReleases(p=>p.map(r=>r.id===id?{...r,...patch}:r))} currentUser={currentUser}/>}
      {agentModal&&<AgentModal agent={agentModal} release={release} onClose={()=>setAM(null)}/>}
      <Back onClick={onBack} label={backLabel||"Back to Releases"}/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24}}>
        <div><div style={{fontSize:24,fontWeight:800,color:C.text}}>{release.title}</div><div style={{fontSize:13,color:C.textMuted}}>{release.client} · {release.type} · {release.date||"TBC"}</div></div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}><Badge status={release.status}/>{isAdmin&&action&&<Btn onClick={action.action}>{action.label} →</Btn>}</div>
      </div>

      {/* Master preview if available */}
      {(release.masterFile||release.pipelineStage==="master_review")&&(
        <div style={{marginBottom:20}}>
          <div style={{fontSize:12,fontWeight:700,color:C.text,textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>🎵 Master Preview</div>
          <MusicPlayer filename={release.masterFile||release.title.toLowerCase().replace(/ /g,"_")+"_master.wav"} title={release.title}/>
          {release.pipelineStage==="master_review"&&!release.masterApproved&&(
            <div style={{marginTop:10,display:"flex",justifyContent:"flex-end",gap:8}}>
              {isAdmin&&<Btn onClick={()=>onEmailCompose&&onEmailCompose("master_ready",client,release)} variant="ghost" small>📧 Notify Artist</Btn>}
              <Btn onClick={()=>setMaster(true)} small>Open Sign-off →</Btn>
            </div>
          )}
          {release.masterApproved&&<div style={{marginTop:8,padding:"8px 12px",background:`${C.green}08`,border:`1px solid ${C.green}30`,borderRadius:8,fontSize:12,color:C.green}}>✓ Master approved{release.masterApprovedBy?` by ${release.masterApprovedBy}`:""}</div>}
        </div>
      )}

      <Card style={{marginBottom:20}}><div style={{fontSize:12,fontWeight:700,color:C.text,textTransform:"uppercase",letterSpacing:1,marginBottom:18}}>Release Pipeline</div><Pipeline stage={release.pipelineStage}/>{release.pipelineStage==="awaiting_upload"&&(<div style={{marginTop:18,background:`${C.orange}0A`,border:`1px solid ${C.orange}30`,borderRadius:8,padding:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:13,fontWeight:700,color:C.orange}}>⚠ Awaiting artist upload</div><div style={{fontSize:12,color:C.textMuted}}>Pre-master audio, artwork, metadata and splits required.</div></div><div style={{display:"flex",gap:8}}>{isAdmin&&<Btn onClick={()=>onEmailCompose&&onEmailCompose("upload_request",client,release)} variant="ghost" small>📧 Chase</Btn>}<Btn onClick={()=>setUpload(true)} small>Open Portal →</Btn></div></div>)}</Card>

      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>{[["DSP",release.dsp,C.blue],["Playlist",release.playlist,C.green],["PR",release.pr,C.purple],["Ads",release.ads,C.orange]].map(([l,v,col])=>(<div key={l} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"14px 16px"}}><div style={{fontSize:10,color:C.textMuted,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>{l}</div><Badge status={v}/></div>))}</div>

      {isAdmin&&<Card style={{marginBottom:20}}><div style={{fontSize:12,fontWeight:700,color:C.text,textTransform:"uppercase",letterSpacing:1,marginBottom:16}}>AI Agents</div>{["Distribution","Marketing","Creative"].map(pillar=>(<div key={pillar} style={{marginBottom:14}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><div style={{width:5,height:5,borderRadius:"50%",background:pc[pillar]}}/><span style={{fontSize:10,fontWeight:700,color:pc[pillar],textTransform:"uppercase",letterSpacing:2}}>{pillar}</span></div><div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>{AGENTS.filter(a=>a.pillar===pillar).map(agent=>(<div key={agent.id} onClick={()=>setAM(agent)} style={{background:C.surfaceAlt,border:`1px solid ${C.border}`,borderRadius:9,padding:"11px 13px",cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.borderColor=agent.color+"80"} onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}><div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><div style={{fontSize:11,fontWeight:700,color:C.text}}>{agent.name}</div><div style={{width:5,height:5,borderRadius:"50%",background:agent.status==="Active"?C.green:C.textMuted}}/></div><div style={{fontSize:10,color:C.textMuted,marginBottom:6,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{agent.lastAction}</div><Bar value={agent.load} color={agent.color}/></div>))}</div></div>))}</Card>}

      {(release.uploadedFiles?.length>0||release.splits?.length>0)&&(<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20}}><Card><CH>Files & Metadata</CH><div style={{marginTop:10}}>{(release.uploadedFiles||[]).map((f,i)=><div key={i} style={{fontSize:12,color:C.green,fontFamily:"monospace",marginTop:6}}>✓ {f}</div>)}{release.masterFile&&<div style={{fontSize:12,color:release.masterApproved?C.green:C.purple,fontFamily:"monospace",marginTop:4}}>{release.masterApproved?"✓":"⏳"} {release.masterFile}</div>}{release.artwork&&<div style={{fontSize:12,color:release.artworkApproved?C.green:C.orange,fontFamily:"monospace",marginTop:4}}>🖼 {release.artwork}</div>}</div></Card>{release.splits?.length>0&&<Card><CH>Contributor Splits</CH><div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:10}}>{release.splits.map((sp,i)=><div key={i} style={{background:C.surfaceAlt,borderRadius:8,padding:"9px 13px",minWidth:100}}><div style={{fontSize:15,fontWeight:800,color:C.gold,fontFamily:"monospace"}}>{sp.percentage}%</div><div style={{fontSize:12,color:C.text}}>{sp.name}</div><div style={{fontSize:10,color:C.textMuted}}>{sp.role}</div></div>)}</div></Card>}</div>)}

      {isAdmin&&<div style={{display:"flex",justifyContent:"flex-end"}}><Btn onClick={()=>{if(window.confirm("Delete this release?")){setReleases(p=>p.filter(r=>r.id!==release.id));onBack();}}} variant="danger" small>Delete Release</Btn></div>}
    </div>
  );
}

// ── Releases List ─────────────────────────────────────────────────────────────
function Releases({releases,setReleases,clients,onEmailCompose,currentUser}){
  const [detail,setDetail]=useState(null);
  const [showAdd,setShowAdd]=useState(false);
  const [form,setForm]=useState({client:clients[0]?.name||"",title:"",type:"Single",date:""});
  const isAdmin=currentUser?.role==="admin";
  const visibleReleases=isAdmin?releases:releases.filter(r=>r.clientId===currentUser?.clientId);
  if(detail){const live=releases.find(r=>r.id===detail.id)||detail;return <ReleaseDetail release={live} onBack={()=>setDetail(null)} setReleases={setReleases} clients={clients} onEmailCompose={onEmailCompose} currentUser={currentUser}/>;}
  return(
    <div style={{padding:32,display:"flex",flexDirection:"column",gap:16,overflowY:"auto"}}>
      <SH title="All Releases" sub={`${visibleReleases.length} releases`} action={isAdmin&&<Btn onClick={()=>setShowAdd(s=>!s)}>{showAdd?"Cancel":"+ New Release"}</Btn>}/>
      {showAdd&&isAdmin&&<Card><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:12}}><Inp label="Client" value={form.client} onChange={v=>setForm(p=>({...p,client:v}))} options={clients.map(c=>c.name)}/><Inp label="Title" value={form.title} onChange={v=>setForm(p=>({...p,title:v}))}/><Inp label="Type" value={form.type} onChange={v=>setForm(p=>({...p,type:v}))} options={["Single","EP","Album","Remix","Compilation"]}/><Inp label="Date" type="date" value={form.date} onChange={v=>setForm(p=>({...p,date:v}))}/></div><div style={{marginTop:12}}><Btn small onClick={()=>{if(!form.title.trim()) return;const c=clients.find(x=>x.name===form.client);setReleases(p=>[...p,{id:nid(),clientId:c?.id||0,...form,title:form.title.trim(),status:"Planning",dsp:"Pending",playlist:"Pending",pr:"Pending",ads:"Pending",masteringTier:null,pipelineStage:"awaiting_upload",masterFile:null,masterApproved:null,explicit:false,splits:[],uploadedFiles:[],notes:"",artwork:null,artworkApproved:false,metadataApproved:false,upc:"",isrc:""}]);setShowAdd(false);}}>Create</Btn></div></Card>}
      <Card style={{padding:0,overflow:"hidden"}}><div style={{display:"grid",gridTemplateColumns:"2fr 1.5fr 2fr 1fr 1fr",padding:"12px 20px",borderBottom:`1px solid ${C.border}`,background:C.surfaceAlt}}>{["Release","Client","Pipeline","DSP","Status"].map(h=><CH key={h}>{h}</CH>)}</div>{visibleReleases.length===0&&<div style={{padding:32,textAlign:"center",color:C.textMuted}}>No releases yet.</div>}{visibleReleases.map((r,i)=>(<div key={r.id} onClick={()=>setDetail(r)} style={{display:"grid",gridTemplateColumns:"2fr 1.5fr 2fr 1fr 1fr",padding:"14px 20px",borderBottom:i<visibleReleases.length-1?`1px solid ${C.border}`:"none",alignItems:"center",cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.background=C.surfaceAlt} onMouseLeave={e=>e.currentTarget.style.background="transparent"}><div><div style={{fontSize:13,fontWeight:700,color:C.text}}>{r.title}</div><div style={{fontSize:10,color:C.textMuted}}>{r.type} · {r.date||"TBC"}</div></div><div style={{fontSize:12,color:C.textMuted}}>{r.client}</div><Pipeline stage={r.pipelineStage} compact/><Badge status={r.dsp}/><Badge status={r.status}/></div>))}</Card>
    </div>
  );
}

// ── Clients ───────────────────────────────────────────────────────────────────
function ClientDetail({client,releases,setReleases,royalties,setClients,onBack,clients,onEmailCompose,currentUser}){
  const [showAddRelease,setShowAddRelease]=useState(false);
  const [relForm,setRelForm]=useState({title:"",type:"Single",date:""});
  const [relDetail,setRelDetail]=useState(null);
  const cRel=releases.filter(r=>r.clientId===client.id);
  const cRoy=royalties.filter(r=>r.clientId===client.id);
  const isAdmin=currentUser?.role==="admin";
  if(relDetail){const liveR=releases.find(r=>r.id===relDetail.id)||relDetail;return <ReleaseDetail release={liveR} onBack={()=>setRelDetail(null)} backLabel={`Back to ${client.name}`} setReleases={setReleases} clients={clients} onEmailCompose={onEmailCompose} currentUser={currentUser}/>;}
  return(
    <div style={{padding:32,overflowY:"auto",height:"100%"}}>
      <Back onClick={onBack} label="Back to Clients"/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:22}}><div style={{display:"flex",alignItems:"center",gap:16}}><Avatar initials={client.avatar} size={54}/><div><div style={{fontSize:24,fontWeight:800,color:C.text}}>{client.name}</div><div style={{fontSize:13,color:C.textMuted}}>{client.type}{client.genre?` · ${client.genre}`:""}{client.manager?` · ${client.manager}`:""}</div></div></div><div style={{display:"flex",gap:10,alignItems:"center"}}><Badge status={client.status}/><span style={{fontSize:12,fontWeight:700,color:C.goldLight,background:`${C.gold}18`,border:`1px solid ${C.gold}40`,padding:"4px 12px",borderRadius:8}}>{client.tier}</span></div></div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:12,marginBottom:22}}>{[["Releases",cRel.length,C.gold],["Live",cRel.filter(r=>r.status==="Live").length,C.green],["Streams",fmtN(client.streams||0),C.blue],["Royalties",`£${cRoy.reduce((s,r)=>s+r.amount,0).toLocaleString()}`,C.goldLight],["Listeners",fmtN(client.monthlyListeners||0),C.purple]].map(([l,v,col])=>(<div key={l} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 16px"}}><div style={{fontSize:10,color:C.textMuted,textTransform:"uppercase",letterSpacing:1,marginBottom:5}}>{l}</div><div style={{fontSize:20,fontWeight:800,color:col,fontFamily:"monospace"}}>{v}</div></div>))}</div>
      {isAdmin&&<div style={{display:"flex",gap:8,marginBottom:16}}>{Object.entries(EMAIL_TEMPLATES).map(([key,tmpl])=>(<Btn key={key} onClick={()=>onEmailCompose(key,client,cRel[0])} variant="ghost" small>📧 {tmpl.subject.split("—")[0].replace("Action Required: ","").replace("Your ","").trim().slice(0,26)}…</Btn>)).slice(0,3)}</div>}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><div style={{fontSize:14,fontWeight:700,color:C.text}}>Releases ({cRel.length})</div>{isAdmin&&<Btn onClick={()=>setShowAddRelease(s=>!s)} small>{showAddRelease?"Cancel":"+ New Release"}</Btn>}</div>
      {showAddRelease&&isAdmin&&<div style={{background:C.surface,border:`1px solid ${C.gold}40`,borderRadius:12,padding:18,marginBottom:14}}><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}><Inp label="Title" value={relForm.title} onChange={v=>setRelForm(p=>({...p,title:v}))}/><Inp label="Type" value={relForm.type} onChange={v=>setRelForm(p=>({...p,type:v}))} options={["Single","EP","Album","Remix","Compilation"]}/><Inp label="Date" type="date" value={relForm.date} onChange={v=>setRelForm(p=>({...p,date:v}))}/></div><div style={{marginTop:12}}><Btn small onClick={()=>{if(!relForm.title.trim()) return;setReleases(p=>[...p,{id:nid(),clientId:client.id,client:client.name,title:relForm.title.trim(),type:relForm.type,date:relForm.date,status:"Planning",dsp:"Pending",playlist:"Pending",pr:"Pending",ads:"Pending",masteringTier:null,pipelineStage:"awaiting_upload",masterFile:null,masterApproved:null,explicit:false,splits:[],uploadedFiles:[],notes:"",artwork:null,artworkApproved:false,metadataApproved:false,upc:"",isrc:""}]);setShowAddRelease(false);setRelForm({title:"",type:"Single",date:""});}}>Create Release</Btn></div></div>}
      <Card style={{padding:0,overflow:"hidden",marginBottom:18}}>{cRel.length===0?<div style={{padding:24,textAlign:"center",color:C.textMuted}}>No releases yet.</div>:<><div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1.5fr 1fr",padding:"11px 18px",borderBottom:`1px solid ${C.border}`,background:C.surfaceAlt}}>{["Release","Date","Pipeline","Status"].map(h=><CH key={h}>{h}</CH>)}</div>{cRel.map((r,i)=>(<div key={r.id} onClick={()=>setRelDetail(r)} style={{display:"grid",gridTemplateColumns:"2fr 1fr 1.5fr 1fr",padding:"12px 18px",borderBottom:i<cRel.length-1?`1px solid ${C.border}`:"none",alignItems:"center",cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.background=C.surfaceAlt} onMouseLeave={e=>e.currentTarget.style.background="transparent"}><div style={{fontSize:13,fontWeight:700,color:C.text}}>{r.title}</div><div style={{fontSize:11,color:C.textMuted}}>{r.date||"—"}</div><Pipeline stage={r.pipelineStage} compact/><Badge status={r.status}/></div>))}</>}</Card>
      <div style={{fontSize:14,fontWeight:700,color:C.text,marginBottom:10}}>Royalties</div>
      <Card style={{padding:0,overflow:"hidden",marginBottom:18}}>{cRoy.length===0?<div style={{padding:20,color:C.textMuted,fontSize:13}}>No records.</div>:<><div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr",padding:"11px 18px",borderBottom:`1px solid ${C.border}`,background:C.surfaceAlt}}>{["Release","Platform","Period","Amount","Status"].map(h=><CH key={h}>{h}</CH>)}</div>{cRoy.map((r,i)=><div key={r.id} style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr",padding:"11px 18px",borderBottom:i<cRoy.length-1?`1px solid ${C.border}`:"none",alignItems:"center"}}><div style={{fontSize:12,color:C.text}}>{r.release}</div><div style={{fontSize:11,color:C.textMuted}}>{r.platform}</div><div style={{fontSize:11,color:C.textMuted}}>{r.period}</div><div style={{fontSize:12,fontWeight:700,color:r.status==="Paid"?C.green:r.status==="Disputed"?C.red:C.orange,fontFamily:"monospace"}}>£{r.amount.toLocaleString()}</div><Badge status={r.status}/></div>)}</>}</Card>
      {isAdmin&&<div style={{display:"flex",justifyContent:"flex-end"}}><Btn onClick={()=>{if(window.confirm(`Remove ${client.name}?`)){setClients(p=>p.filter(c=>c.id!==client.id));onBack();}}} variant="danger" small>Remove Client</Btn></div>}
    </div>
  );
}

function Clients({clients,setClients,releases,setReleases,royalties,onEmailCompose,currentUser}){
  const [onboarding,setOnboarding]=useState(false);
  const [detail,setDetail]=useState(null);
  const isAdmin=currentUser?.role==="admin";
  function completeOnboarding(f){const initials=f.name.trim().split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2);setClients(p=>[...p,{id:nid(),name:f.name.trim(),type:f.type,genre:f.genre,manager:f.manager,stage:f.stage,tier:f.tier,country:f.country,status:"Onboarding",streams:0,monthlyListeners:0,joined:new Date().toLocaleString("en-GB",{month:"short",year:"numeric"}),avatar:initials,email:f.email}]);setOnboarding(false);}
  if(detail){const live=clients.find(c=>c.id===detail.id)||detail;return <ClientDetail client={live} releases={releases} setReleases={setReleases} royalties={royalties} setClients={setClients} onBack={()=>setDetail(null)} clients={clients} onEmailCompose={onEmailCompose} currentUser={currentUser}/>;}
  const visible=isAdmin?clients:clients.filter(c=>c.id===currentUser?.clientId);
  return(
    <div style={{padding:32,display:"flex",flexDirection:"column",gap:14,overflowY:"auto"}}>
      {onboarding&&<Onboarding onComplete={completeOnboarding} onCancel={()=>setOnboarding(false)}/>}
      <SH title="Clients" sub={`${visible.length} accounts`} action={isAdmin&&<Btn onClick={()=>setOnboarding(true)}>+ Add Client</Btn>}/>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {visible.length===0&&<Card><div style={{textAlign:"center",color:C.textMuted}}>No clients.</div></Card>}
        {visible.map(c=>{const cr=releases.filter(r=>r.clientId===c.id);const sp=[0.6,0.7,0.8,0.9,1].map(x=>(c.streams||0)*x/1e6);return(<div key={c.id} onClick={()=>setDetail(c)} style={{background:C.surface,border:`1.5px solid ${C.border}`,borderRadius:12,padding:"15px 18px",cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.borderColor=C.gold+"60"} onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{display:"flex",alignItems:"center",gap:12}}><Avatar initials={c.avatar}/><div><div style={{fontSize:14,fontWeight:700,color:C.text}}>{c.name}</div><div style={{fontSize:11,color:C.textMuted}}>{c.type}{c.genre?` · ${c.genre}`:""}</div></div></div><div style={{display:"flex",alignItems:"center",gap:18}}><Spark data={sp} color={C.gold} w={60} h={22}/><div style={{textAlign:"right"}}><div style={{fontSize:12,fontWeight:700,color:C.goldLight}}>{fmtN(c.streams||0)}</div><div style={{fontSize:10,color:C.textMuted}}>streams</div></div><div style={{textAlign:"right"}}><div style={{fontSize:12,fontWeight:700,color:C.text}}>{cr.length}</div><div style={{fontSize:10,color:C.textMuted}}>releases</div></div><Badge status={c.status}/><span style={{color:C.textDim,fontSize:16}}>›</span></div></div></div>);})}
      </div>
    </div>
  );
}

// ── Onboarding ─────────────────────────────────────────────────────────────────
function Onboarding({onComplete,onCancel}){
  const [step,setStep]=useState(0);const [f,setF]=useState({name:"",type:"Artist",genre:"",manager:"",stage:"Emerging",tier:"Distribute",country:"UK",email:"",bio:""});const set=k=>v=>setF(p=>({...p,[k]:v}));const STEPS=["Identity","Service","Contact","Review"];
  return(
    <div style={{position:"fixed",inset:0,background:"#000d",zIndex:400,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:20,width:560,overflow:"hidden"}}>
        <div style={{height:3,background:C.border}}><div style={{height:"100%",width:`${((step+1)/STEPS.length)*100}%`,background:C.gold,transition:"width 0.4s"}}/></div>
        <div style={{padding:"26px 30px"}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><div style={{fontSize:11,color:C.gold,fontWeight:700,letterSpacing:3,textTransform:"uppercase"}}>New Client Onboarding</div><div style={{fontSize:11,color:C.textMuted}}>Step {step+1} of {STEPS.length}</div></div>
          <div style={{display:"flex",gap:6,marginBottom:24}}>{STEPS.map((_,i)=><div key={i} style={{flex:1,height:2,background:i<=step?C.gold:C.border,borderRadius:1}}/>)}</div>
          {step===0&&<div style={{display:"flex",flexDirection:"column",gap:13}}><Inp label="Full Name / Act Name" value={f.name} onChange={set("name")} placeholder="e.g. Kira Waves"/><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:13}}><Inp label="Type" value={f.type} onChange={set("type")} options={["Artist","Label","Manager","Publisher"]}/><Inp label="Genre" value={f.genre} onChange={set("genre")} placeholder="e.g. Indie Electronic"/></div><Inp label="Country" value={f.country} onChange={set("country")} options={["UK","US","DE","FR","GH","NG","IE","CA","AU"]}/></div>}
          {step===1&&<div style={{display:"flex",flexDirection:"column",gap:13}}><div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>{[{k:"Distribute",d:"DSP delivery & royalties"},{k:"Amplify",d:"+ Marketing & playlists"},{k:"Full Suite",d:"+ PR, sync & full AI"}].map(o=><div key={o.k} onClick={()=>set("tier")(o.k)} style={{border:`1.5px solid ${f.tier===o.k?C.gold:C.border}`,background:f.tier===o.k?`${C.gold}0A`:C.surface,borderRadius:10,padding:13,cursor:"pointer"}}><div style={{fontSize:12,fontWeight:700,color:f.tier===o.k?C.gold:C.text,marginBottom:3}}>{o.k}</div><div style={{fontSize:11,color:C.textMuted}}>{o.d}</div></div>)}</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:13}}><Inp label="Stage" value={f.stage} onChange={set("stage")} options={["Emerging","Mid-Tier","Established"]}/><Inp label="Manager" value={f.manager} onChange={set("manager")} placeholder="e.g. Seven20 Mgmt"/></div></div>}
          {step===2&&<div style={{display:"flex",flexDirection:"column",gap:13}}><Inp label="Email Address" value={f.email} type="email" onChange={set("email")} placeholder="artist@example.com"/><div><div style={{fontSize:11,color:C.textMuted,textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>Bio / Notes</div><textarea value={f.bio} onChange={e=>set("bio")(e.target.value)} placeholder="A brief description..." style={{width:"100%",background:C.surfaceAlt,border:`1px solid ${C.border}`,borderRadius:6,padding:"9px 12px",color:C.text,fontSize:13,fontFamily:"inherit",resize:"vertical",minHeight:60,outline:"none",boxSizing:"border-box"}}/></div></div>}
          {step===3&&<div><div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:18,marginBottom:12}}><div style={{display:"flex",alignItems:"center",gap:14,marginBottom:12}}><Avatar initials={f.name.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2)||"??"} size={42}/><div><div style={{fontSize:16,fontWeight:800,color:C.text}}>{f.name||"Unnamed"}</div><div style={{fontSize:12,color:C.textMuted}}>{f.type}{f.genre?` · ${f.genre}`:""}</div></div></div>{[["Tier",f.tier],["Stage",f.stage],["Email",f.email||"—"]].map(([l,v])=><div key={l} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${C.border}`}}><div style={{fontSize:12,color:C.textMuted}}>{l}</div><div style={{fontSize:12,color:C.text,fontWeight:600}}>{v}</div></div>)}</div></div>}
          <div style={{display:"flex",justifyContent:"space-between",marginTop:24}}><Btn onClick={step===0?onCancel:()=>setStep(s=>s-1)} variant="ghost">{step===0?"Cancel":"← Back"}</Btn>{step<STEPS.length-1?<Btn onClick={()=>setStep(s=>s+1)} disabled={step===0&&!f.name.trim()}>Continue →</Btn>:<Btn onClick={()=>onComplete(f)}>Confirm & Activate →</Btn>}</div>
        </div>
      </div>
    </div>
  );
}

// ── Client Portal (with Music Preview) ───────────────────────────────────────
function Portal({clients,releases,royalties,setReleases,onClose,currentUser}){
  const [sel,setSel]=useState(currentUser?.clientId||null);
  const [tab,setTab]=useState("releases");
  const [approving,setApp]=useState({});
  const [showMaster,setShowMaster]=useState(null);
  const client=sel?clients.find(c=>c.id===sel):null;
  const cRel=client?releases.filter(r=>r.clientId===client.id):[];
  const cRoy=client?royalties.filter(r=>r.clientId===client.id):[];
  function approve(rid,field,val){const k=`${rid}-${field}`;setApp(p=>({...p,[k]:true}));setTimeout(()=>{setReleases(p=>p.map(r=>r.id===rid?{...r,[field]:val}:r));setApp(p=>({...p,[k]:false}));},600);}
  return(
    <div style={{position:"fixed",inset:0,background:"#000000ee",zIndex:400,display:"flex",flexDirection:"column"}}>
      {showMaster&&<MasterSignoff release={showMaster} onClose={()=>setShowMaster(null)} onUpdate={(id,patch)=>{setReleases(p=>p.map(r=>r.id===id?{...r,...patch}:r));setShowMaster(null);}} currentUser={currentUser}/>}
      <div style={{background:"#05050E",borderBottom:`1px solid ${C.border}`,padding:"14px 28px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:16}}><div style={{fontSize:16,fontWeight:900,color:C.gold,letterSpacing:3,fontFamily:"monospace"}}>APEX</div><div style={{width:1,height:18,background:C.border}}/><div style={{fontSize:12,color:C.textMuted}}>Client Portal</div></div>
        <div style={{display:"flex",alignItems:"center",gap:14}}>{client&&<div style={{display:"flex",alignItems:"center",gap:10}}><Avatar initials={client.avatar} size={26}/><span style={{fontSize:13,fontWeight:700,color:C.text}}>{client.name}</span>{currentUser?.role==="admin"&&<button onClick={()=>setSel(null)} style={{background:"transparent",border:"none",color:C.textMuted,cursor:"pointer",fontSize:11}}>Switch ›</button>}</div>}<button onClick={onClose} style={{background:"transparent",border:`1px solid ${C.border}`,color:C.textMuted,fontSize:12,cursor:"pointer",padding:"5px 12px",borderRadius:6,fontFamily:"inherit"}}>Exit Portal</button></div>
      </div>
      {!sel?(
        <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{width:460}}>
            <div style={{textAlign:"center",marginBottom:26}}><div style={{fontSize:28,fontWeight:900,color:C.gold,letterSpacing:3,fontFamily:"monospace",marginBottom:6}}>APEX</div><div style={{fontSize:16,fontWeight:700,color:C.text,marginBottom:3}}>Welcome to your client portal</div><div style={{fontSize:13,color:C.textMuted}}>Select your account to continue</div></div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>{clients.map(c=>{const p2=releases.filter(r=>r.clientId===c.id&&(r.pipelineStage==="master_review"||!r.artworkApproved||!r.metadataApproved)).length;return(<div key={c.id} onClick={()=>{setSel(c.id);setTab("releases");}} style={{background:C.surface,border:`1.5px solid ${C.border}`,borderRadius:12,padding:"14px 18px",cursor:"pointer",display:"flex",alignItems:"center",gap:14}} onMouseEnter={e=>e.currentTarget.style.borderColor=C.gold+"60"} onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}><Avatar initials={c.avatar}/><div style={{flex:1}}><div style={{fontSize:14,fontWeight:700,color:C.text}}>{c.name}</div><div style={{fontSize:11,color:C.textMuted}}>{c.type}{c.genre?` · ${c.genre}`:""}</div></div>{p2>0&&<span style={{background:`${C.orange}22`,color:C.orange,fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:12}}>{p2} action{p2>1?"s":""} needed</span>}<Badge status={c.status}/><span style={{color:C.textDim}}>›</span></div>);})}</div>
          </div>
        </div>
      ):(
        <div style={{flex:1,overflowY:"auto"}}><div style={{maxWidth:920,margin:"0 auto",padding:32}}>
          <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:24}}><Avatar initials={client.avatar} size={50}/><div><div style={{fontSize:22,fontWeight:800,color:C.text}}>{client.name}</div><div style={{fontSize:13,color:C.textMuted}}>{client.tier} · Since {client.joined}</div></div></div>
          <div style={{display:"flex",gap:2,marginBottom:22,borderBottom:`1px solid ${C.border}`}}>{["releases","sign-offs","royalties"].map(t=>{const badge=t==="sign-offs"?releases.filter(r=>r.clientId===client.id&&(r.pipelineStage==="master_review"||!r.artworkApproved||!r.metadataApproved)).length:0;return(<button key={t} onClick={()=>setTab(t)} style={{background:"transparent",border:"none",borderBottom:`2px solid ${tab===t?C.gold:"transparent"}`,color:tab===t?C.gold:C.textMuted,padding:"10px 18px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",textTransform:"capitalize",marginBottom:-1,display:"flex",alignItems:"center",gap:7}}>{t}{badge>0&&<span style={{background:`${C.orange}22`,color:C.orange,fontSize:10,fontWeight:700,padding:"1px 7px",borderRadius:10}}>{badge}</span>}</button>);})}</div>

          {tab==="releases"&&<div style={{display:"flex",flexDirection:"column",gap:14}}>{cRel.map(r=><Card key={r.id}><div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}><div><div style={{fontSize:17,fontWeight:800,color:C.text}}>{r.title}</div><div style={{fontSize:12,color:C.textMuted}}>{r.type}{r.date?` · ${r.date}`:""}</div></div><Badge status={r.status}/></div><div style={{marginBottom:14}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{fontSize:11,color:C.textMuted}}>Pipeline</span><span style={{fontSize:11,fontWeight:700,color:C.gold}}>{PIPELINE_LABELS[r.pipelineStage]}</span></div><Pipeline stage={r.pipelineStage}/></div>
            {/* Music player in portal for master_review or live */}
            {(r.masterFile&&(r.pipelineStage==="master_review"||r.pipelineStage==="live"||r.masterApproved))&&(
              <div style={{marginBottom:14}}>
                <div style={{fontSize:11,fontWeight:700,color:C.textMuted,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>🎵 Master Preview</div>
                <MusicPlayer filename={r.masterFile} title={r.title}/>
              </div>
            )}
            {r.pipelineStage==="master_review"&&<div style={{background:`${C.purple}0A`,border:`1px solid ${C.purple}30`,borderRadius:8,padding:12,display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{fontSize:13,color:C.purple,fontWeight:600}}>🎵 Listen above and sign off your master</div><Btn onClick={()=>setShowMaster(r)} small>Open Sign-off →</Btn></div>}
            {r.pipelineStage==="awaiting_upload"&&<div style={{background:`${C.orange}0A`,border:`1px solid ${C.orange}30`,borderRadius:8,padding:12,fontSize:13,color:C.orange}}>⚠ Your team is waiting for your pre-master, artwork, and metadata.</div>}
          </Card>)}</div>}

          {tab==="sign-offs"&&<div><div style={{fontSize:13,color:C.textMuted,marginBottom:16}}>Review and approve your master recordings, artwork, and metadata before release.</div><div style={{display:"flex",flexDirection:"column",gap:14}}>{cRel.map(r=>{const needsMaster=r.pipelineStage==="master_review"&&r.masterApproved===null;const needsArt=!r.artworkApproved&&r.pipelineStage!=="awaiting_upload"&&r.pipelineStage!=="live";const needsMeta=!r.metadataApproved&&r.pipelineStage!=="awaiting_upload"&&r.pipelineStage!=="live";if(!needsMaster&&!needsArt&&!needsMeta) return <Card key={r.id} style={{opacity:0.6}}><div style={{display:"flex",justifyContent:"space-between"}}><div style={{fontSize:14,fontWeight:700,color:C.text}}>{r.title}</div><span style={{fontSize:12,color:C.green,fontWeight:700}}>✓ All clear</span></div></Card>;
          return(<Card key={r.id} style={{borderColor:`${C.orange}30`}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}><div style={{fontSize:15,fontWeight:800,color:C.text}}>{r.title}</div><Badge status="Pending Approval"/></div>
            {needsMaster&&<div style={{background:C.surfaceAlt,borderRadius:10,padding:"14px 16px",marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><div><div style={{fontSize:13,fontWeight:700,color:C.text}}>Master Recording</div><div style={{fontSize:11,color:C.textMuted}}>{r.masterFile} · {r.masteringTier==="human"?"Human Engineer":"LANDR Automated"}</div></div><Badge status="Pending Approval"/></div>
              {/* Embedded music player in sign-offs tab */}
              <MusicPlayer filename={r.masterFile} title={r.title} style={{marginBottom:12}}/>
              <Btn onClick={()=>setShowMaster(r)} small>Open Full Sign-off →</Btn>
            </div>}
            {needsArt&&r.artwork&&<div style={{background:C.surfaceAlt,borderRadius:10,padding:"14px 16px",marginBottom:10}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><div style={{fontSize:13,fontWeight:700,color:C.text}}>Artwork</div><Badge status="Pending Approval"/></div><div style={{height:64,background:`${C.gold}08`,border:`1px solid ${C.gold}20`,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:C.textMuted,marginBottom:10}}>🖼 {r.artwork}</div><div style={{display:"flex",gap:8}}><Btn onClick={()=>approve(r.id,"artworkApproved",true)} variant="success" small disabled={approving[`${r.id}-artworkApproved`]}>✓ Approve</Btn><Btn onClick={()=>approve(r.id,"artworkApproved",false)} variant="danger" small>✗ Request Changes</Btn></div></div>}
            {needsMeta&&<div style={{background:C.surfaceAlt,borderRadius:10,padding:"14px 16px",marginBottom:10}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><div style={{fontSize:13,fontWeight:700,color:C.text}}>Metadata</div><Badge status="Pending Approval"/></div><div style={{background:C.bg,borderRadius:8,padding:12,marginBottom:10,fontFamily:"monospace",fontSize:11,color:C.textMuted,lineHeight:1.8}}><div><span style={{color:C.gold}}>Title</span>: {r.title}</div><div><span style={{color:C.gold}}>Date</span>: {r.date||"TBC"}</div><div><span style={{color:C.gold}}>Explicit</span>: {r.explicit?"Yes":"No"}</div></div><div style={{display:"flex",gap:8}}><Btn onClick={()=>approve(r.id,"metadataApproved",true)} variant="success" small>✓ Approve</Btn><Btn onClick={()=>approve(r.id,"metadataApproved",false)} variant="danger" small>✗ Request Changes</Btn></div></div>}
          </Card>);})}</div></div>}

          {tab==="royalties"&&<div><div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:18}}>{[["Total",`£${cRoy.reduce((s,r)=>s+r.amount,0).toLocaleString()}`,C.gold],["Paid",`£${cRoy.filter(r=>r.status==="Paid").reduce((s,r)=>s+r.amount,0).toLocaleString()}`,C.green],["Pending",`£${cRoy.filter(r=>r.status==="Pending").reduce((s,r)=>s+r.amount,0).toLocaleString()}`,C.orange]].map(([l,v,col])=><div key={l} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"14px 18px"}}><div style={{fontSize:10,color:C.textMuted,textTransform:"uppercase",letterSpacing:1,marginBottom:5}}>{l}</div><div style={{fontSize:22,fontWeight:800,color:col,fontFamily:"monospace"}}>{v}</div></div>)}</div><Card style={{padding:0,overflow:"hidden"}}><div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr",padding:"12px 20px",borderBottom:`1px solid ${C.border}`,background:C.surfaceAlt}}>{["Release","Platform","Period","Amount","Status"].map(h=><CH key={h}>{h}</CH>)}</div>{cRoy.map((r,i)=><div key={r.id} style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr",padding:"12px 20px",borderBottom:i<cRoy.length-1?`1px solid ${C.border}`:"none",alignItems:"center"}}><div style={{fontSize:13,color:C.text}}>{r.release}</div><div style={{fontSize:12,color:C.textMuted}}>{r.platform}</div><div style={{fontSize:12,color:C.textMuted}}>{r.period}</div><div style={{fontSize:13,fontWeight:700,color:r.status==="Paid"?C.green:r.status==="Disputed"?C.red:C.orange,fontFamily:"monospace"}}>£{r.amount.toLocaleString()}</div><Badge status={r.status}/></div>)}</Card></div>}
        </div></div>
      )}
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function Dashboard({clients,releases,tasks,royalties,alerts,onDismiss,setSection}){
  const ts=clients.reduce((s,c)=>s+(c.streams||0),0),tr=royalties.reduce((s,r)=>s+r.amount,0);
  const mD=MONTHS.slice(0,5).map((m,i)=>({label:m,v:Math.floor(ts*(0.55+i*0.12))}));
  const ds=[{v:royalties.filter(r=>r.status==="Paid").reduce((s,r)=>s+r.amount,0)||1,color:C.green},{v:royalties.filter(r=>r.status==="Pending").reduce((s,r)=>s+r.amount,0)||1,color:C.orange},{v:royalties.filter(r=>r.status==="Disputed").reduce((s,r)=>s+r.amount,0)||1,color:C.red}];
  const tC={warning:C.orange,opportunity:C.green,financial:C.red,approval:C.gold,info:C.blue};
  return(
    <div style={{padding:32,display:"flex",flexDirection:"column",gap:20,overflowY:"auto"}}>
      <div><div style={{fontSize:24,fontWeight:800,color:C.text}}>Good morning, Apex Works</div><div style={{fontSize:14,color:C.textMuted,marginTop:3}}>{AGENTS.filter(a=>a.status==="Active").length} agents active · {releases.length} releases · {clients.length} clients</div></div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>{[[fmtN(ts),"Total Streams","▲ 18% WoW",C.gold],[clients.length,"Active Clients",`${clients.filter(c=>c.status==="Onboarding").length} onboarding`,C.blue],[`${AGENTS.filter(a=>a.status==="Active").length}/11`,"Agents Running","All systems nominal",C.green],[releases.length,"Releases",`${releases.filter(r=>r.pipelineStage==="live").length} live`,C.purple],[`£${tr.toLocaleString()}`,"Royalties","Q1-Q2 2025",C.goldLight],[releases.filter(r=>r.pipelineStage==="awaiting_upload").length,"Awaiting Upload","Blocked releases",C.orange]].map(([v,l,s,col])=>(<div key={l} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:"18px 22px"}}><div style={{fontSize:11,color:C.textMuted,textTransform:"uppercase",letterSpacing:1.5,marginBottom:6}}>{l}</div><div style={{fontSize:26,fontWeight:800,color:col,fontFamily:"monospace"}}>{v}</div><div style={{fontSize:11,color:C.textMuted,marginTop:4}}>{s}</div></div>))}</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
        <Card><div style={{fontSize:12,fontWeight:700,color:C.text,textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>Stream Volume</div><div style={{fontSize:11,color:C.textMuted,marginBottom:14}}>Jan – May 2025</div><Bars data={mD} h={100} color={C.gold}/></Card>
        <Card style={{display:"flex",gap:20,alignItems:"center"}}><div><div style={{fontSize:12,fontWeight:700,color:C.text,textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>Royalty Status</div><div style={{fontSize:11,color:C.textMuted,marginBottom:16}}>Q1–Q2 2025</div><Donut segs={ds} size={100} thick={14}/></div><div style={{display:"flex",flexDirection:"column",gap:10}}>{[["Paid",ds[0].v,C.green],["Pending",ds[1].v,C.orange],["Disputed",ds[2].v,C.red]].map(([l,v,col])=><div key={l} style={{display:"flex",alignItems:"center",gap:10}}><div style={{width:9,height:9,borderRadius:"50%",background:col,flexShrink:0}}/><div><div style={{fontSize:13,fontWeight:700,color:C.text,fontFamily:"monospace"}}>£{v.toLocaleString()}</div><div style={{fontSize:10,color:C.textMuted}}>{l}</div></div></div>)}</div></Card>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
        <div><div style={{fontSize:12,fontWeight:700,color:C.text,textTransform:"uppercase",letterSpacing:1,marginBottom:12}}>Intelligence Alerts <span style={{background:`${C.orange}22`,color:C.orange,borderRadius:12,padding:"2px 8px",fontSize:11,marginLeft:8}}>{alerts.length}</span></div><div style={{display:"flex",flexDirection:"column",gap:8}}>{alerts.length===0&&<div style={{padding:20,textAlign:"center",color:C.textMuted,fontSize:13}}>No active alerts.</div>}{alerts.slice(0,3).map(a=><div key={a.id} style={{background:C.surface,borderLeft:`3px solid ${tC[a.type]||C.gold}`,border:`1px solid ${C.border}`,borderRadius:"0 10px 10px 0",padding:"12px 14px",display:"flex",gap:10}}><span style={{fontSize:16,flexShrink:0}}>{a.icon}</span><div style={{flex:1}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><div style={{fontSize:13,fontWeight:700,color:C.text}}>{a.title}</div><Badge status={a.priority}/></div><div style={{fontSize:12,color:C.textMuted,lineHeight:1.5,marginBottom:8}}>{a.body}</div><div style={{display:"flex",gap:6}}><Btn onClick={()=>setSection(a.action==="royalties"?"royalties":a.action==="oversight"?"oversight":"dashboard")} variant="ghost" small>View</Btn><Btn onClick={()=>onDismiss(a.id)} variant="ghost" small>Dismiss</Btn></div></div></div>)}</div></div>
        <div><div style={{fontSize:12,fontWeight:700,color:C.text,textTransform:"uppercase",letterSpacing:1,marginBottom:12}}>Live Agent Feed <span style={{background:`${C.green}22`,color:C.green,borderRadius:12,padding:"2px 8px",fontSize:11,marginLeft:8}}>LIVE</span></div><div style={{height:300,background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}}><Feed/></div></div>
      </div>
      <Card><div style={{fontSize:12,fontWeight:700,color:C.text,textTransform:"uppercase",letterSpacing:1,marginBottom:14}}>Release Timeline</div><Gantt releases={releases}/></Card>
    </div>
  );
}

// ── Royalties, Tasks, Catalogue, Calendar, Agents ──────────────────────────────
function Royalties({royalties,clients}){
  const [filter,setFilter]=useState("All");const cMap={};clients.forEach(c=>{cMap[c.id]=c;});const total=royalties.reduce((s,r)=>s+r.amount,0),paid=royalties.filter(r=>r.status==="Paid").reduce((s,r)=>s+r.amount,0),pending=royalties.filter(r=>r.status==="Pending").reduce((s,r)=>s+r.amount,0),disputed=royalties.filter(r=>r.status==="Disputed").reduce((s,r)=>s+r.amount,0);const fil=filter==="All"?royalties:royalties.filter(r=>r.status===filter);
  return(<div style={{padding:32,display:"flex",flexDirection:"column",gap:18,overflowY:"auto"}}><SH title="Royalties & Finance" sub="Statements · Tracking · Dispatch"/><div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14}}>{[["Total",`£${total.toLocaleString()}`,C.gold],["Paid",`£${paid.toLocaleString()}`,C.green],["Pending",`£${pending.toLocaleString()}`,C.orange],["Disputed",`£${disputed.toLocaleString()}`,C.red]].map(([l,v,col])=><div key={l} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:"18px 22px"}}><div style={{fontSize:11,color:C.textMuted,textTransform:"uppercase",letterSpacing:1.5,marginBottom:6}}>{l}</div><div style={{fontSize:24,fontWeight:800,color:col,fontFamily:"monospace"}}>{v}</div></div>)}</div><div style={{display:"flex",gap:6}}>{["All","Paid","Pending","Disputed"].map(f=><button key={f} onClick={()=>setFilter(f)} style={{background:filter===f?`${C.gold}18`:"transparent",border:`1px solid ${filter===f?C.gold:C.border}`,color:filter===f?C.gold:C.textMuted,padding:"5px 13px",borderRadius:20,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{f}</button>)}</div><Card style={{padding:0,overflow:"hidden"}}><div style={{display:"grid",gridTemplateColumns:"2fr 1.5fr 1fr 1fr 1fr 1fr",padding:"12px 20px",borderBottom:`1px solid ${C.border}`,background:C.surfaceAlt}}>{["Release","Client","Platform","Period","Amount","Status"].map(h=><CH key={h}>{h}</CH>)}</div>{fil.map((r,i)=><div key={r.id} style={{display:"grid",gridTemplateColumns:"2fr 1.5fr 1fr 1fr 1fr 1fr",padding:"12px 20px",borderBottom:i<fil.length-1?`1px solid ${C.border}`:"none",alignItems:"center"}}><div style={{fontSize:13,color:C.text}}>{r.release}</div><div style={{fontSize:12,color:C.textMuted}}>{cMap[r.clientId]?.name||"—"}</div><div style={{fontSize:12,color:C.textMuted}}>{r.platform}</div><div style={{fontSize:12,color:C.textMuted}}>{r.period}</div><div style={{fontSize:13,fontWeight:700,color:r.status==="Paid"?C.green:r.status==="Disputed"?C.red:C.orange,fontFamily:"monospace"}}>£{r.amount.toLocaleString()}</div><Badge status={r.status}/></div>)}</Card></div>);
}

function Tasks({tasks,setTasks,releases}){
  const [filter,setFilter]=useState("All");const [showAdd,setShowAdd]=useState(false);const [form,setForm]=useState({title:"",agent:AGENTS[0].name,priority:"Medium",due:""});const fil=filter==="All"?tasks:tasks.filter(t=>t.status===filter);const cycle=id=>{const c={Todo:"In Progress","In Progress":"Done",Done:"Todo"};setTasks(p=>p.map(t=>t.id===id?{...t,status:c[t.status]}:t));};
  return(<div style={{padding:32,display:"flex",flexDirection:"column",gap:16,overflowY:"auto"}}><SH title="Tasks" sub={`${tasks.length} total`} action={<Btn onClick={()=>setShowAdd(s=>!s)}>{showAdd?"Cancel":"+ New Task"}</Btn>}/><div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>{[["Todo",tasks.filter(t=>t.status==="Todo").length,C.textMuted],["In Progress",tasks.filter(t=>t.status==="In Progress").length,C.blue],["Done",tasks.filter(t=>t.status==="Done").length,C.green]].map(([l,v,col])=><div key={l} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"13px 16px"}}><div style={{fontSize:11,color:C.textMuted,textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>{l}</div><div style={{fontSize:22,fontWeight:800,color:col,fontFamily:"monospace"}}>{v}</div></div>)}</div>{showAdd&&<Card><div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:12,marginBottom:12}}><Inp label="Title" value={form.title} onChange={v=>setForm(p=>({...p,title:v}))} placeholder="Task..."/><Inp label="Priority" value={form.priority} onChange={v=>setForm(p=>({...p,priority:v}))} options={["High","Medium","Low"]}/><Inp label="Agent" value={form.agent} onChange={v=>setForm(p=>({...p,agent:v}))} options={AGENTS.map(a=>a.name)}/><Inp label="Due" type="date" value={form.due} onChange={v=>setForm(p=>({...p,due:v}))}/></div><Btn small onClick={()=>{if(!form.title.trim()) return;setTasks(p=>[...p,{id:nid(),...form,title:form.title.trim(),releaseId:0,clientId:0,status:"Todo",assignee:form.agent}]);setShowAdd(false);}}>Create</Btn></Card>}<div style={{display:"flex",gap:6}}>{["All","Todo","In Progress","Done"].map(f=><button key={f} onClick={()=>setFilter(f)} style={{background:filter===f?`${C.gold}18`:"transparent",border:`1px solid ${filter===f?C.gold:C.border}`,color:filter===f?C.gold:C.textMuted,padding:"5px 13px",borderRadius:20,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{f}</button>)}</div><div style={{display:"flex",flexDirection:"column",gap:8}}>{fil.map(t=>{const rel=releases.find(r=>r.id===t.releaseId);return(<div key={t.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",background:C.surface,border:`1px solid ${C.border}`,borderRadius:10}}><div onClick={()=>cycle(t.id)} style={{width:18,height:18,borderRadius:"50%",border:`2px solid ${t.status==="Done"?C.green:t.status==="In Progress"?C.blue:C.border}`,background:t.status==="Done"?`${C.green}22`:"transparent",cursor:"pointer",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:C.green}}>{t.status==="Done"?"✓":""}</div><div style={{flex:1}}><div style={{fontSize:13,color:t.status==="Done"?C.textMuted:C.text,textDecoration:t.status==="Done"?"line-through":"none"}}>{t.title}</div><div style={{fontSize:11,color:C.textMuted}}>{t.assignee}{rel?` · ${rel.title}`:""}{t.due?` · ${t.due}`:""}</div></div><Badge status={t.priority}/><Badge status={t.status}/><button onClick={()=>setTasks(p=>p.filter(x=>x.id!==t.id))} style={{background:"transparent",border:"none",color:C.textDim,cursor:"pointer",fontSize:16}}>×</button></div>);})}</div></div>);
}

function Catalogue({releases,clients}){
  const [search,setSearch]=useState(""),[ft,setFt]=useState("All"),[view,setView]=useState("grid");const types=["All",...Array.from(new Set(releases.map(r=>r.type)))];const stC={live:C.green,dsp_delivery:C.green,qc:C.blue,master_review:C.purple,mastering:C.gold,awaiting_upload:C.orange};const fil=[...releases].filter(r=>(!search||r.title.toLowerCase().includes(search.toLowerCase())||r.client.toLowerCase().includes(search.toLowerCase()))&&(ft==="All"||r.type===ft));
  return(<div style={{padding:32,display:"flex",flexDirection:"column",gap:18,overflowY:"auto"}}><SH title="Catalogue" sub={`${releases.length} releases · ${releases.filter(r=>r.pipelineStage==="live").length} live`}/><div style={{display:"flex",gap:10,flexWrap:"wrap"}}><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 14px",color:C.text,fontSize:13,outline:"none",fontFamily:"inherit",minWidth:200}}/><div style={{display:"flex",gap:6}}>{types.map(t=><button key={t} onClick={()=>setFt(t)} style={{background:ft===t?`${C.gold}18`:"transparent",border:`1px solid ${ft===t?C.gold:C.border}`,color:ft===t?C.gold:C.textMuted,padding:"5px 12px",borderRadius:20,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{t}</button>)}</div><div style={{marginLeft:"auto",display:"flex",gap:6}}>{["grid","list"].map(v=><button key={v} onClick={()=>setView(v)} style={{background:view===v?C.surfaceAlt:"transparent",border:`1px solid ${C.border}`,color:view===v?C.text:C.textMuted,width:32,height:32,borderRadius:6,fontSize:14,cursor:"pointer"}}>{v==="grid"?"▦":"≡"}</button>)}</div></div>{view==="grid"?<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:14}}>{fil.map(r=>{const col=stC[r.pipelineStage]||C.textMuted;return(<div key={r.id} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}} onMouseEnter={e=>e.currentTarget.style.borderColor=col+"60"} onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}><div style={{height:76,background:`linear-gradient(135deg,${col}15,${col}05)`,borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,color:col,fontWeight:900,opacity:0.6}}>{r.title.slice(0,2).toUpperCase()}</div><div style={{padding:"12px 14px"}}><div style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:2,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{r.title}</div><div style={{fontSize:11,color:C.textMuted,marginBottom:6}}>{r.client} · {r.type}</div><Pipeline stage={r.pipelineStage} compact/></div></div>);})}</div>:<Card style={{padding:0,overflow:"hidden"}}><div style={{display:"grid",gridTemplateColumns:"2fr 1.5fr 1fr 1.5fr 1fr 1fr",padding:"12px 20px",borderBottom:`1px solid ${C.border}`,background:C.surfaceAlt}}>{["Title","Client","Type","Pipeline","UPC","ISRC"].map(h=><CH key={h}>{h}</CH>)}</div>{fil.map((r,i)=><div key={r.id} style={{display:"grid",gridTemplateColumns:"2fr 1.5fr 1fr 1.5fr 1fr 1fr",padding:"12px 20px",borderBottom:i<fil.length-1?`1px solid ${C.border}`:"none",alignItems:"center"}}><div style={{fontSize:13,fontWeight:700,color:C.text}}>{r.title}</div><div style={{fontSize:12,color:C.textMuted}}>{r.client}</div><div style={{fontSize:12,color:C.textMuted}}>{r.type}</div><Pipeline stage={r.pipelineStage} compact/><div style={{fontSize:11,color:C.textDim,fontFamily:"monospace"}}>{r.upc||"—"}</div><div style={{fontSize:11,color:C.textDim,fontFamily:"monospace"}}>{r.isrc||"—"}</div></div>)}</Card>}</div>);
}

function CalendarPage({releases}){
  const today=new Date();const [year,setYear]=useState(today.getFullYear());const [month,setMonth]=useState(today.getMonth());const [sel,setSel]=useState(null);const offset=(new Date(year,month,1).getDay()+6)%7,dim=new Date(year,month+1,0).getDate();const cells=Array.from({length:offset+dim},(_,i)=>i<offset?null:i-offset+1);while(cells.length%7!==0) cells.push(null);const byDay={};releases.forEach(r=>{if(!r.date) return;const d=new Date(r.date);if(d.getFullYear()===year&&d.getMonth()===month){const day=d.getDate();if(!byDay[day]) byDay[day]=[];byDay[day].push(r);}});const sc={live:C.green,dsp_delivery:C.green,qc:C.blue,master_review:C.purple,mastering:C.gold,awaiting_upload:C.orange};const upcoming=releases.filter(r=>r.date&&new Date(r.date)>=today).sort((a,b)=>new Date(a.date)-new Date(b.date)).slice(0,8);
  return(<div style={{padding:32,display:"flex",gap:20,height:"100%",overflow:"hidden"}}><div style={{flex:1,display:"flex",flexDirection:"column",gap:16,overflowY:"auto"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{fontSize:22,fontWeight:800,color:C.text}}>Release Calendar</div><div style={{display:"flex",alignItems:"center",gap:10}}><button onClick={()=>{if(month===0){setMonth(11);setYear(y=>y-1);}else setMonth(m=>m-1);}} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,width:30,height:30,color:C.text,cursor:"pointer",fontSize:14}}>‹</button><span style={{fontSize:14,fontWeight:700,color:C.text,width:120,textAlign:"center"}}>{MONTHS[month]} {year}</span><button onClick={()=>{if(month===11){setMonth(0);setYear(y=>y+1);}else setMonth(m=>m+1);}} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,width:30,height:30,color:C.text,cursor:"pointer",fontSize:14}}>›</button></div></div><Card style={{padding:0,overflow:"hidden"}}><div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",borderBottom:`1px solid ${C.border}`}}>{WDAYS.map(d=><div key={d} style={{padding:"8px 0",textAlign:"center",fontSize:10,fontWeight:700,color:C.textMuted,letterSpacing:1}}>{d}</div>)}</div><div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)"}}>{cells.map((day,i)=>{const dr=day?(byDay[day]||[]):[];const isT=day===today.getDate()&&month===today.getMonth()&&year===today.getFullYear();return(<div key={i} onClick={()=>day&&dr.length>0&&setSel(dr)} style={{minHeight:70,padding:"6px 7px",borderRight:(i+1)%7!==0?`1px solid ${C.border}`:"none",borderBottom:i<cells.length-7?`1px solid ${C.border}`:"none",background:isT?`${C.gold}08`:"transparent",cursor:dr.length>0?"pointer":"default"}}>{day&&<><div style={{fontSize:10,fontWeight:isT?800:400,color:isT?C.gold:C.textMuted,marginBottom:3}}>{day}</div>{dr.map((r,j)=><div key={j} style={{background:`${sc[r.pipelineStage]||C.textDim}22`,border:`1px solid ${sc[r.pipelineStage]||C.textDim}44`,borderRadius:3,padding:"2px 5px",fontSize:10,fontWeight:600,color:sc[r.pipelineStage]||C.textDim,marginBottom:2,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{r.title}</div>)}</>}</div>);})}</div></Card></div><div style={{width:260,display:"flex",flexDirection:"column",gap:12,overflowY:"auto",flexShrink:0}}>{sel&&<Card><div style={{fontSize:11,fontWeight:700,color:C.gold,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Selected</div>{sel.map((r,i)=><div key={i} style={{marginBottom:8,paddingBottom:8,borderBottom:i<sel.length-1?`1px solid ${C.border}`:"none"}}><div style={{fontSize:13,fontWeight:700,color:C.text}}>{r.title}</div><div style={{fontSize:11,color:C.textMuted,marginBottom:4}}>{r.client}</div><Pipeline stage={r.pipelineStage} compact/></div>)}<button onClick={()=>setSel(null)} style={{fontSize:11,color:C.textMuted,background:"transparent",border:"none",cursor:"pointer",padding:0,marginTop:4}}>Clear ×</button></Card>}<Card><div style={{fontSize:11,fontWeight:700,color:C.textMuted,textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>Upcoming</div>{upcoming.map((r,i)=>{const d=new Date(r.date),da=Math.ceil((d-today)/86400000);return(<div key={i} style={{display:"flex",gap:10,marginBottom:10,paddingBottom:10,borderBottom:i<upcoming.length-1?`1px solid ${C.border}`:"none"}}><div style={{background:C.surfaceAlt,borderRadius:6,padding:"4px 7px",textAlign:"center",minWidth:34,flexShrink:0}}><div style={{fontSize:13,fontWeight:800,color:C.gold,fontFamily:"monospace"}}>{d.getDate()}</div><div style={{fontSize:9,color:C.textMuted,textTransform:"uppercase"}}>{MONTHS[d.getMonth()]}</div></div><div style={{flex:1}}><div style={{fontSize:12,fontWeight:700,color:C.text}}>{r.title}</div><div style={{fontSize:10,color:C.textMuted,marginBottom:4}}>{r.client}</div><div style={{fontSize:10,color:da<7?C.orange:C.textMuted}}>{da===0?"Today":da===1?"Tomorrow":`${da}d away`}</div></div></div>);})}</Card></div></div>);
}

function AgentsPage(){
  const [sel,setSel]=useState(null);const pc={Distribution:C.blue,Marketing:C.purple,Creative:C.gold};
  return(<div style={{display:"grid",gridTemplateColumns:"1fr 340px",height:"100%",overflow:"hidden"}}><div style={{padding:32,display:"flex",flexDirection:"column",gap:18,overflowY:"auto"}}>{sel&&<AgentModal agent={sel} release={null} onClose={()=>setSel(null)}/>}<SH title="AI Agents" sub="11 agents · Click any to manage"/><div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>{[["Active",AGENTS.filter(a=>a.status==="Active").length,C.green],["Idle",AGENTS.filter(a=>a.status==="Idle").length,C.textMuted],["Tasks Today",AGENTS.reduce((s,a)=>s+a.tasksToday,0),C.gold]].map(([l,v,col])=><div key={l} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"13px 16px"}}><div style={{fontSize:11,color:C.textMuted,textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>{l}</div><div style={{fontSize:22,fontWeight:800,color:col,fontFamily:"monospace"}}>{v}</div></div>)}</div>{["Distribution","Marketing","Creative"].map(pillar=><div key={pillar}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}><div style={{width:6,height:6,borderRadius:"50%",background:pc[pillar]}}/><span style={{fontSize:11,fontWeight:700,color:pc[pillar],textTransform:"uppercase",letterSpacing:2}}>{pillar}</span></div><div style={{display:"flex",flexDirection:"column",gap:8}}>{AGENTS.filter(a=>a.pillar===pillar).map(agent=><div key={agent.id} onClick={()=>setSel(agent)} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"13px 16px",cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.borderColor=agent.color+"60"} onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}><div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><div><div style={{fontSize:13,fontWeight:700,color:C.text}}>{agent.name}</div><div style={{fontSize:11,color:C.textMuted,marginTop:2}}>{agent.lastAction}</div></div><div style={{display:"flex",gap:10,alignItems:"center"}}><span style={{fontSize:11,color:C.textMuted}}>{agent.tasksToday}t</span><Badge status={agent.status}/></div></div><div style={{display:"flex",alignItems:"center",gap:8}}><div style={{flex:1}}><Bar value={agent.load} color={agent.color}/></div><span style={{fontSize:11,color:C.textMuted,fontFamily:"monospace",width:30,textAlign:"right"}}>{agent.load}%</span></div></div>)}</div></div>)}</div><div style={{borderLeft:`1px solid ${C.border}`,display:"flex",flexDirection:"column"}}><div style={{padding:"16px 18px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:10}}><div style={{width:7,height:7,borderRadius:"50%",background:C.green,boxShadow:`0 0 6px ${C.green}`}}/><span style={{fontSize:12,fontWeight:700,color:C.text,textTransform:"uppercase",letterSpacing:1}}>Live Agent Feed</span><span style={{marginLeft:"auto",fontSize:10,color:C.green,fontWeight:700}}>LIVE</span></div><div style={{flex:1,overflow:"hidden"}}><Feed/></div></div></div>);
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar({active,setActive,onPortal,alertCount,oversightCount,currentUser,onLogout}){
  const isAdmin=currentUser?.role==="admin";
  const items=[{key:"dashboard",label:"Dashboard",icon:"◈"},{key:"oversight",label:"Oversight",icon:"◉",badge:oversightCount,adminOnly:true},{key:"clients",label:"Clients",icon:"◎"},{key:"releases",label:"Releases",icon:"▦"},{key:"catalogue",label:"Catalogue",icon:"≡",adminOnly:true},{key:"calendar",label:"Calendar",icon:"◻",adminOnly:true},{key:"tasks",label:"Tasks",icon:"◷",adminOnly:true},{key:"royalties",label:"Royalties",icon:"£"},{key:"agents",label:"AI Agents",icon:"◆",adminOnly:true}].filter(i=>!i.adminOnly||isAdmin);
  return(
    <div style={{width:216,background:C.surface,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",flexShrink:0}}>
      <div style={{padding:"22px 20px 14px"}}><div style={{fontSize:17,fontWeight:900,color:C.gold,letterSpacing:3,fontFamily:"monospace"}}>APEX</div><div style={{fontSize:9,color:C.textDim,letterSpacing:4,fontWeight:600,marginTop:2}}>WORKS</div></div>
      <div style={{height:1,background:C.border,margin:"0 12px"}}/>

      {/* User pill */}
      <div style={{margin:"10px 8px",background:C.surfaceAlt,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 12px",display:"flex",alignItems:"center",gap:8}}>
        <Avatar initials={currentUser?.avatar||"??"} size={28} color={currentUser?.role==="admin"?C.purple:C.gold}/>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:12,fontWeight:700,color:C.text,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{currentUser?.name}</div>
          <div style={{fontSize:10,color:currentUser?.role==="admin"?C.purple:C.gold,textTransform:"capitalize"}}>{currentUser?.role}</div>
        </div>
      </div>

      <nav style={{padding:"6px 8px",flex:1,display:"flex",flexDirection:"column",gap:2}}>
        {items.map(item=><button key={item.key} onClick={()=>setActive(item.key)} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:7,background:active===item.key?`${C.gold}18`:"transparent",border:active===item.key?`1px solid ${C.gold}40`:"1px solid transparent",color:active===item.key?C.gold:C.textMuted,fontSize:12,fontWeight:active===item.key?700:500,cursor:"pointer",textAlign:"left",fontFamily:"inherit"}}><span style={{fontSize:13,width:16,textAlign:"center"}}>{item.icon}</span>{item.label}{item.key==="dashboard"&&alertCount>0&&<span style={{marginLeft:"auto",background:`${C.orange}22`,color:C.orange,fontSize:10,fontWeight:700,padding:"1px 7px",borderRadius:10}}>{alertCount}</span>}{item.badge>0&&item.key!=="dashboard"&&<span style={{marginLeft:"auto",background:`${C.red}22`,color:C.red,fontSize:10,fontWeight:700,padding:"1px 7px",borderRadius:10}}>{item.badge}</span>}</button>)}
      </nav>

      <div style={{padding:"10px 8px",borderTop:`1px solid ${C.border}`}}>
        <button onClick={onPortal} style={{width:"100%",display:"flex",alignItems:"center",gap:8,padding:"9px 12px",borderRadius:7,background:`${C.gold}10`,border:`1px solid ${C.gold}30`,color:C.gold,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit",marginBottom:6}}>⬡ Client Portal</button>
        <button onClick={onLogout} style={{width:"100%",display:"flex",alignItems:"center",gap:8,padding:"8px 12px",borderRadius:7,background:"transparent",border:`1px solid ${C.border}`,color:C.textMuted,fontSize:12,cursor:"pointer",fontFamily:"inherit",marginBottom:8}}>⎋ Sign Out</button>
        <div style={{paddingLeft:4}}><div style={{fontSize:10,color:C.textDim,marginBottom:5}}>System Status</div><div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:6,height:6,borderRadius:"50%",background:C.green,boxShadow:`0 0 6px ${C.green}`}}/><span style={{fontSize:11,color:C.green,fontWeight:600}}>8 agents running</span></div></div>
      </div>
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function ApexWorks(){
  const [currentUser,setCurrentUser]=useState(USERS[0]); // auto-login as admin
  const [active,setActive]=useState("dashboard");
  const [showPortal,setShowPortal]=useState(false);
  const [emailComposer,setEmailComposer]=useState(null);
  const [emailLog,setEmailLog]=useState([]);
  const [clients,setClients]=usePersistedState("apex12-clients",DEFAULT_CLIENTS);
  const [releases,setReleases]=usePersistedState("apex12-releases",DEFAULT_RELEASES);
  const [royalties]=usePersistedState("apex12-royalties",DEFAULT_ROYALTIES);
  const [tasks,setTasks]=usePersistedState("apex12-tasks",DEFAULT_TASKS);
  const [alerts,setAlerts]=usePersistedState("apex12-alerts",[
    {id:1,type:"warning",icon:"⚡",title:"3 releases blocked — awaiting upload",body:"Solstice Vol.2, Midnight Protocol and Velvet Hour are due within 3 weeks with no files submitted.",action:"oversight",priority:"High"},
    {id:2,type:"approval",icon:"🎵",title:"Master sign-off required — Afterglow EP",body:"Nova Carter's master is ready. Artist has not yet reviewed or approved the mastered file.",action:"oversight",priority:"High"},
    {id:3,type:"financial",icon:"💷",title:"Royalty discrepancy — Black Prism",body:"TIDAL Q1 discrepancy of £890 has been open for 14 days.",action:"royalties",priority:"Medium"},
    {id:4,type:"info",icon:"📈",title:"Helix Music Group — streams +34% MoM",body:"Street Gospel outperforming comparable releases at day 7.",action:"dashboard",priority:"Low"},
  ]);

  const oversightCount = releases.filter(r=>r.pipelineStage==="awaiting_upload"&&r.date&&daysUntil(r.date)<21).length + releases.filter(r=>r.pipelineStage==="master_review").length;

  function handleLogin(user){
    setCurrentUser(user);
    // Non-admin users go straight to their own view
    if(user.role!=="admin") setActive("releases");
    else setActive("dashboard");
  }

  function handleLogout(){
    setCurrentUser(null);
    setShowPortal(false);
    setEmailComposer(null);
  }

  return(
    <div style={{display:"flex",height:"100vh",background:C.bg,fontFamily:"'DM Sans','Segoe UI',sans-serif",color:C.text,overflow:"hidden"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap'); *{box-sizing:border-box;} ::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-thumb{background:#1E1E3A;border-radius:2px;} button,input,select,textarea{font-family:inherit;}`}</style>
      {showPortal&&<Portal clients={clients} releases={releases} royalties={royalties} setReleases={setReleases} onClose={()=>setShowPortal(false)} currentUser={currentUser}/>}
      {emailComposer&&<EmailComposer template={EMAIL_TEMPLATES[emailComposer.templateKey]} client={emailComposer.client} release={emailComposer.release} onClose={()=>setEmailComposer(null)} onSent={log=>{setEmailLog(p=>[...p,log]);setEmailComposer(null);}}/>}
      <Sidebar active={active} setActive={setActive} onPortal={()=>setShowPortal(true)} alertCount={alerts.length} oversightCount={oversightCount} currentUser={currentUser} onLogout={handleLogout}/>
      <div style={{flex:1,overflow:"hidden"}}>
        {active==="dashboard"  && <Dashboard  clients={clients} releases={releases} tasks={tasks} royalties={royalties} alerts={alerts} onDismiss={id=>setAlerts(p=>p.filter(a=>a.id!==id))} setSection={setActive}/>}
        {active==="oversight"  && <Oversight  releases={releases} clients={clients} royalties={royalties} tasks={tasks} onEmailCompose={(k,c,r)=>setEmailComposer({templateKey:k,client:c,release:r})}/>}
        {active==="clients"    && <Clients    clients={clients} setClients={setClients} releases={releases} setReleases={setReleases} royalties={royalties} onEmailCompose={(k,c,r)=>setEmailComposer({templateKey:k,client:c,release:r})} currentUser={currentUser}/>}
        {active==="releases"   && <Releases   releases={releases} setReleases={setReleases} clients={clients} onEmailCompose={(k,c,r)=>setEmailComposer({templateKey:k,client:c,release:r})} currentUser={currentUser}/>}
        {active==="catalogue"  && <Catalogue  releases={releases} clients={clients}/>}
        {active==="calendar"   && <CalendarPage releases={releases}/>}
        {active==="tasks"      && <Tasks      tasks={tasks} setTasks={setTasks} releases={releases}/>}
        {active==="royalties"  && <Royalties  royalties={royalties} clients={clients}/>}
        {active==="agents"     && <AgentsPage/>}
      </div>
    </div>
  );
}
