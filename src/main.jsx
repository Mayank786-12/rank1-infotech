import React,{useEffect,useMemo,useState}from'react';import{createRoot}from'react-dom/client';import{Activity,AlertCircle,ArrowRight,ArrowUpRight,Bell,Building2,CalendarDays,Check,ChevronDown,ChevronRight,CreditCard,Download,FileBarChart,FileText,IndianRupee,LayoutDashboard,Mail,MessageSquare,RefreshCw,Search,Settings,Sparkles,UserCircle2,Users,WalletCards,X,Zap}from'lucide-react';import{ResponsiveContainer,LineChart,Line,XAxis,YAxis,Tooltip,CartesianGrid,PieChart,Pie,Cell}from'recharts';import'./styles.css';import{api,ApiError}from'./api/client.js';
const menus={"Master Setup":["Entity","Department","Building/Tower","Parking","Meter Master","Property/Flat Master","Send Mail By Lease","EB Slab Master","EB_DG Rate Master","CAM Rate Master","E&M Rate Master","Tax","File Manager","Fixed Format","Deposit Type","Bank"],Billing:["Maintenance/CAM","Electricity/Utility","EV Point","Road Bill","RF/SF/ARF","Other/RECD","IBMS","Generate Payment QR","e-Invoicing (IRN)","Bill Alert","Reminder By Email","Reminder By SMS","Other Email","Other SMS"],Collection:["Receive Amount","Receipt Mail/Print Letter","Receipt SMS","Bill Received History","Download Receipt","Pay Amount","Security Deposit"],Reports:["Receipt Report","Parking Report","Property Report","Bill & Receipt","Aging Report","Tax","Grid Consumption","DG Consumption","Owner Bill History","Flat Bill History","Ledger By Flat","Ledger By Owner","Closing Balance","Owner History","Tenant History","Owner List","Tenant List","Property List"],"Photo/Circular":["Manage News/Circular","Manage Photos"],"Online Payment":["Failed Transaction History","Success Transaction History"],User:["New User","Manage User","Login History","Login By User","Tiny/Shortlink Uses","Tiny/Shortlink Uses By Ref"]};
const quick=["Electricity","Maintenance","Other/RECD","Road","EV Point","RF/SF/ARF"];const residents0=[{flat:'A-102',resident:'Rohit Sharma',phone:'9876543210',email:'rohit@example.com',bill:4500,due:2100,advance:0,category:'Maintenance'},{flat:'B-204',resident:'Anita Verma',phone:'9876543211',email:'anita@example.com',bill:2350,due:0,advance:500,category:'Electricity'},{flat:'C-301',resident:'Vikram Singh',phone:'9876543212',email:'vikram@example.com',bill:1200,due:0,advance:0,category:'EV Charges'},{flat:'D-405',resident:'Neha Gupta',phone:'9876543213',email:'neha@example.com',bill:5100,due:0,advance:0,category:'Maintenance'},{flat:'E-502',resident:'Arjun Patel',phone:'9876543214',email:'arjun@example.com',bill:3000,due:0,advance:0,category:'Road Fund'},{flat:'F-601',resident:'Priya Mehta',phone:'9876543215',email:'priya@example.com',bill:6800,due:6800,advance:0,category:'Electricity'}];const pays0=[{id:'PAY-1007',date:'31 Aug 2026, 12:21 PM',flat:'A-102',resident:'Rohit Sharma',category:'Maintenance',amount:4500,mode:'UPI',status:'Success'},{id:'PAY-1006',date:'31 Aug 2026, 11:18 AM',flat:'B-204',resident:'Anita Verma',category:'Electricity',amount:2350,mode:'UPI',status:'Success'},{id:'PAY-1005',date:'30 Aug 2026, 09:47 PM',flat:'C-301',resident:'Vikram Singh',category:'EV Charges',amount:1200,mode:'Bank',status:'Success'},{id:'PAY-1004',date:'30 Aug 2026, 07:31 PM',flat:'D-405',resident:'Neha Gupta',category:'Maintenance',amount:5100,mode:'Card',status:'Success'},{id:'PAY-1003',date:'29 Aug 2026, 06:05 PM',flat:'E-502',resident:'Arjun Patel',category:'Road Fund',amount:3000,mode:'UPI',status:'Pending'}];
const money=n=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:2}).format(n);function store(k,v){const[x,setX]=useState(()=>{try{return JSON.parse(localStorage.getItem(k))||v}catch{return v}});useEffect(()=>localStorage.setItem(k,JSON.stringify(x)),[k,x]);return[x,setX]}
function Modal({title,onClose,children,wide=false}){return <div className="back" onMouseDown={e=>e.target===e.currentTarget&&onClose()}><div className={'modal '+(wide?'wide':'')}><div className="mh"><div><small>RANK1 INFOTECH</small><h2>{title}</h2></div><button onClick={onClose}><X size={18}/></button></div><div className="mb">{children}</div></div></div>}
const sidebarMenus={
  "Master Setup":["Entity","Department","Building/Tower","Parking","Meter Master","Property/Flat Master","Send Mail By Lease","EB Slab Master","EB_DG Rate Master","CAM Rate Master","E&M Rate Master","Tax","File Manager","Fixed Format","Deposit Type","Bank"],
  Billing:["Maintenance/CAM","Electricity/Utility","EV Point","Road Bill","RF/SF/ARF","Other/RECD","IBMS","Generate Payment QR","e-Invoicing (IRN)","Bill Alert","Reminder By Email","Reminder By SMS","Other Email","Other SMS"],
  Collection:["Receive Amount","Receipt Mail/Print Letter","Receipt SMS","Bill Received History","Download Receipt","Pay Amount","Security Deposit"],
  Reports:["Receipt Report","Parking Report","Property Report","Bill & Receipt","Aging Report","Tax","Grid Consumption","DG Consumption","Owner Bill History","Flat Bill History","Ledger By Flat","Ledger By Owner","Closing Balance","Owner History","Tenant History","Owner List","Tenant List","Property List"],
  "Photo/Circular":["Manage News/Circular","Manage Photos"],
  "Online Payment":["Failed Transaction History","Success Transaction History"],
  User:["New User","Manage User","Login History","Login By User","Tiny/Shortlink Uses","Tiny/Shortlink Uses By Ref"]
};
function Side({active,setActive,go,onLogout}){
  const a=[
    ["Dashboard",LayoutDashboard,[]],
    ["Master Setup",Settings,sidebarMenus["Master Setup"]],
    ["Billing",FileText,sidebarMenus.Billing],
    ["Collection",WalletCards,sidebarMenus.Collection],
    ["Reports",FileBarChart,sidebarMenus.Reports],
    ["Photo/Circular",MessageSquare,sidebarMenus["Photo/Circular"]],
    ["Online Payment",CreditCard,sidebarMenus["Online Payment"]],
    ["User",Users,sidebarMenus.User],
    ["Change Password",Settings,[]]
  ];
  const [expanded,setExpanded]=useState(null);
  const handleMain=(name,items)=>{
    setActive(name);
    if(items.length) setExpanded(expanded===name?null:name);
    else go('module',name);
  };
  return <aside>
    <div className="brand"><Building2/><div><b>RANK1 INFOTECH</b><small>Society Management</small></div></div>
    <div className="side-scroll">
      {a.map(([n,I,items])=>{const isOpen=expanded===n;return <div className="sidegroup" key={n}>
        <button className={'side-main '+(active===n?'sel':'')} onMouseEnter={()=>items.length&&setExpanded(n)} onClick={()=>handleMain(n,items)}>
          <I size={16}/><span>{n}</span>{items.length>0&&(isOpen?<ChevronDown className="arr" size={13}/>:<ChevronRight className="arr" size={13}/>)}
        </button>
        {isOpen&&<div className="submenu">{items.map(item=><button key={item} className="subitem" onClick={()=>{setActive(n);go('module',item)}}><span>{item}</span><ChevronRight size={12}/></button>)}</div>}
      </div>})}
      <button className="side-main misc-side" onClick={()=>{setActive('Miscellaneous Bill');go('module','Miscellaneous Bill')}}><IndianRupee size={16}/><span>Miscellaneous Bill</span></button>
    </div>
    <button className="admin" onClick={()=>go('module','Profile')}><UserCircle2 size={34}/><span><b>Admin User</b><small>Super Admin</small></span><ChevronDown size={14}/></button>
    <button className="side-logout" onClick={onLogout}>Log Out</button>
  </aside>
}
function Stat({title,val,change,Icon,cls}){return <div className="stat"><div className={'sicon '+cls}><Icon size={19}/></div><small>{title}</small><strong>{val}</strong><em><ArrowUpRight size={13}/>{change}</em><div className="spark"/></div>}
function Chart(){const data=Array.from({length:16},(_,i)=>({d:`${i*2+1} Aug`,c:28+i*3.5+(i%4)*3,o:12+i*1.3+(i%3)*2}));return <section className="panel chart"><div className="pt"><h3>Collection Overview</h3><div><button>Daily</button><button>Weekly</button><button className="active">Monthly</button></div></div><div className="legend"><span>● Collected Amount</span><span>● Outstanding Amount</span></div><ResponsiveContainer width="100%"height={210}><LineChart data={data}><CartesianGrid strokeDasharray="3 3"vertical={false}/><XAxis dataKey="d"tick={{fontSize:9}}/><YAxis tick={{fontSize:9}}/><Tooltip formatter={v=>money(v*1000)}/><Line dataKey="c"stroke="#19b67b"strokeWidth={2.5}dot={false}/><Line dataKey="o"stroke="#ff961c"strokeWidth={2.5}dot={false}/></LineChart></ResponsiveContainer></section>}
function Donut({data}){const cs=['#19b77b','#3974ed','#8152d5','#ff9419','#7ba7ba'];return <ResponsiveContainer width="100%"height={205}><PieChart><Pie data={data}dataKey="value"innerRadius={57}outerRadius={84}paddingAngle={2}>{data.map((_,i)=><Cell key={i}fill={cs[i%cs.length]}/>)}</Pie><Tooltip formatter={v=>money(v)}/></PieChart></ResponsiveContainer>}
function Actions({go}){return <section className="panel qa"><h3>Quick Actions</h3>{[['Generate Bills','generate',FileText],['Receive Payment','receive',WalletCards],['Record Advance','advance',IndianRupee],['Send Reminder','reminder',Mail],['Manage Dues','dues',AlertCircle],['Download Reports','report',Download]].map(([n,k,I])=><button key={k}onClick={()=>go(k)}><I size={15}/><span>{n}</span><ChevronRight size={15}/></button>)}</section>}
function Attention({residents,go}){const od=residents.filter(r=>r.due>0),sum=od.reduce((a,r)=>a+r.due,0);return <section className="panel attention"><h3>Needs Attention</h3><Row icon={Bell}text={`${od.length} Apartments`}sub="Have overdue payments"go={()=>go('dues')}/><Row icon={Bell}text={money(sum)}sub="Total overdue amount"go={()=>go('dues')}/><Row icon={AlertCircle}text="17 Payments Failed"sub="Need to be verified"go={()=>go('failed')}/><Row icon={FileText}text="32 Bills Pending"sub="Generate bills to avoid delay"go={()=>go('pending')}/></section>};function Row({icon:I,text,sub,go}){return <div className="attrow"><i><I size={14}/></i><span><b>{text}</b><small>{sub}</small></span><button onClick={go}>View <ChevronRight size={12}/></button></div>}
function Table({residents}){return <section className="panel table"><div className="pt"><h3>Category Summary</h3><button className="link">View Details <ArrowRight size={12}/></button></div><div className="scroll"><table><thead><tr><th>CATEGORY</th><th>BILLED AMOUNT</th><th>COLLECTED</th><th>OUTSTANDING</th><th>OVERDUE</th><th>COLLECTION %</th></tr></thead><tbody>{['Electricity','Maintenance','EV Charges','Road Fund','Others / RECD'].map((c,i)=>{const rs=residents.filter(r=>r.category===c),b=rs.reduce((a,r)=>a+r.bill,0)+(i+1)*25000,d=rs.reduce((a,r)=>a+r.due,0),p=Math.max(0,Math.min(100,(b-d)/b*100));return <tr key={c}><td><span className={'cat c'+i}/> {c}</td><td>{money(b)}</td><td>{money(b-d)}</td><td>{money(d)}</td><td className="red">{money(d)}</td><td><div className="prog"><span style={{width:p+'%'}}/></div>{p.toFixed(2)}%</td></tr>})}</tbody></table></div></section>}
function Payments({payments,go}){return <section className="panel table"><div className="pt"><h3>Recent Payments</h3><button className="link"onClick={()=>go('payments')}>View All <ArrowRight size={12}/></button></div><div className="scroll"><table><thead><tr><th>DATE & TIME</th><th>APARTMENT</th><th>RESIDENT</th><th>CATEGORY</th><th>AMOUNT</th><th>MODE</th><th>STATUS</th></tr></thead><tbody>{payments.slice(0,5).map(p=><tr key={p.id}><td>{p.date}</td><td>{p.flat}</td><td>{p.resident}</td><td>{p.category}</td><td><b>{money(p.amount)}</b></td><td>{p.mode}</td><td><span className={'badge '+p.status.toLowerCase()}>{p.status}</span></td></tr>)}</tbody></table></div></section>}
function FormModal({title,residents,onClose,onSave,kind,selected}){const r0=selected||residents[0], [flat,setFlat]=useState(r0.flat),[a,setA]=useState(''),[mode,setMode]=useState('UPI'),[e,setE]=useState('0'),[m,setM]=useState('4500'),[ev,setEv]=useState('0'),[road,setRoad]=useState('0'),[other,setOther]=useState('0');const r=residents.find(x=>x.flat===flat)||r0;if(kind==='generate'){const total=+e+ +m+ +ev+ +road+ +other+(r?.due||0)-(r?.advance||0);return <Modal title="Generate Bill"onClose={onClose}wide><div className="gridform"><label>Apartment<select value={flat}onChange={x=>setFlat(x.target.value)}>{residents.map(r=><option key={r.flat}>{r.flat}</option>)}</select></label><label>Resident<input value={r.resident}readOnly/></label>{[['Electricity',e,setE],['Maintenance / CAM',m,setM],['EV Point',ev,setEv],['Road Fund',road,setRoad],['Other / RECD',other,setOther]].map(([n,v,s])=><label key={n}>{n}<input type="number"value={v}onChange={x=>s(x.target.value)}/></label>)}<label>Previous Due<input value={money(r.due)}readOnly/></label><label>Advance<input value={money(r.advance)}readOnly/></label></div><div className="total"><span>Amount Payable</span><b>{money(Math.max(0,total))}</b></div><div className="modalactions"><button onClick={onClose}>Cancel</button><button className="primary"onClick={()=>onSave({flat,e,m,ev,road,other})}>Generate & Preview Bill</button></div></Modal>};return <Modal title={kind==='advance'?'Record Advance':'Receive Payment'}onClose={onClose}><label>Apartment<select value={flat}onChange={x=>setFlat(x.target.value)}>{residents.map(r=><option key={r.flat}>{r.flat}</option>)}</select></label><div className="resident">{r.resident} · Outstanding {money(r.due)} · Advance {money(r.advance)}</div><label>{kind==='advance'?'Advance Amount':'Amount Received'}<input type="number"autoFocus value={a}onChange={x=>setA(x.target.value)}placeholder="Enter amount"/></label>{kind!=='advance'&&<label>Payment Mode<select value={mode}onChange={x=>setMode(x.target.value)}><option>UPI</option><option>Bank Transfer</option><option>Card</option><option>Cash</option></select></label>}<div className="modalactions"><button onClick={onClose}>Cancel</button><button className="primary"onClick={()=>onSave({flat,amount:a,mode})}>{kind==='advance'?'Save Advance':'Receive & Generate Receipt'}</button></div></Modal>}
function Dues({residents,onClose,onReceive,onGenerate}){const d=residents.filter(r=>r.due>0);return <Modal title="Needs Attention — Overdue Dues"onClose={onClose}wide><div className="summary"><b>{d.length} overdue apartments</b><b>{money(d.reduce((a,r)=>a+r.due,0))} total overdue</b></div><div className="scroll"><table><thead><tr><th>FLAT</th><th>RESIDENT</th><th>OVERDUE</th><th>ACTION</th></tr></thead><tbody>{d.map(r=><tr key={r.flat}><td>{r.flat}</td><td>{r.resident}</td><td className="red"><b>{money(r.due)}</b></td><td><button className="mini primary"onClick={()=>onReceive(r)}>Receive</button><button className="mini"onClick={()=>onGenerate(r)}>Generate</button></td></tr>)}</tbody></table></div></Modal>}
function Flat({r,onClose,onReceive,onGenerate}){return <Modal title={`Apartment ${r.flat}`}onClose={onClose}><div className="profile"><UserCircle2 size={38}/><div><b>{r.resident}</b><small>{r.flat} · {r.category}</small></div></div><div className="details"><div>Current Bill<b>{money(r.bill)}</b></div><div>Outstanding<b className="red">{money(r.due)}</b></div><div>Advance<b>{money(r.advance)}</b></div><div>Phone<b>{r.phone}</b></div><div>Email<b>{r.email}</b></div></div><div className="total"><span>Closing Balance</span><b>{money(Math.max(0,r.due-r.advance))}</b></div><div className="modalactions"><button onClick={onClose}>Close</button><button onClick={onGenerate}>Generate Bill</button><button className="primary"onClick={onReceive}>Receive Payment</button></div></Modal>}
function Bill({bill,onClose}){return <Modal title="Bill Preview"onClose={onClose}><div className="invoice"><b>RANK1 INFOTECH</b><h3>MONTHLY BILL</h3><p>Bill ID: <b>{bill.id}</b></p><p>Apartment: <b>{bill.flat}</b></p><p>Resident: <b>{bill.resident}</b></p><hr/><div className="total"><span>Amount Payable</span><b>{money(bill.amount)}</b></div></div><div className="modalactions"><button onClick={onClose}>Close</button><button className="primary"onClick={()=>window.print()}>Print / Save PDF</button></div></Modal>}
function ModuleModal({title,onClose,onToast}){
  const [value,setValue]=useState('');
  const [query,setQuery]=useState('');
  const [saved,setSaved]=useState(false);
  const rows=[
    {name:'Configuration',value:'Ready'},
    {name:'Last Updated',value:'02-Sep-2026'},
    {name:'Status',value:'Active'}
  ];
  const special=title==='Change Password';
  const misc=title==='Miscellaneous Bill';
  const handleSave=()=>{setSaved(true);onToast(`${title} saved successfully`);};
  return <Modal title={title} onClose={onClose} wide>
    {special?<div className="gridform">
      <label>Current Password<input type="password" placeholder="Enter current password"/></label>
      <label>New Password<input type="password" placeholder="Enter new password"/></label>
      <label>Confirm Password<input type="password" placeholder="Confirm new password"/></label>
    </div>:misc?<div className="gridform">
      <label>Apartment<input value={value} onChange={e=>setValue(e.target.value)} placeholder="e.g. A-102"/></label>
      <label>Bill Type<select><option>Miscellaneous Bill</option><option>Other Charge</option><option>Penalty</option></select></label>
      <label>Amount<input type="number" placeholder="0.00"/></label>
      <label>Remarks<input placeholder="Enter remarks"/></label>
    </div>:<>
      <div className="module-toolbar"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={`Search ${title}...`}/><button onClick={()=>{setQuery('');onToast('Search cleared')}}><RefreshCw size={13}/> Clear</button></div>
      <div className="summary"><b>Module: {title}</b><b>Records: {rows.length}</b><b>Ready for API</b></div>
      <div className="scroll"><table><thead><tr><th>FIELD</th><th>VALUE</th><th>STATUS</th><th>ACTION</th></tr></thead><tbody>{rows.filter(r=>!query||r.name.toLowerCase().includes(query.toLowerCase())).map(r=><tr key={r.name}><td>{r.name}</td><td>{r.value}</td><td><span className="badge success">Active</span></td><td><button className="mini" onClick={()=>onToast(`${r.name} opened`)}>Open</button><button className="mini primary" onClick={()=>onToast(`${r.name} edited`)}>Edit</button></td></tr>)}</tbody></table></div>
    </>}
    <div className="simple" style={{marginTop:12}}><Check size={22}/><p>{saved?'Changes saved locally for this demo.':'This screen is fully clickable now. Production CRUD/API wiring can be connected to your .NET Core endpoints later.'}</p></div>
    <div className="modalactions"><button onClick={onClose}>Close</button><button onClick={()=>{window.print()}}>Print</button><button className="primary" onClick={handleSave}>{special?'Update Password':misc?'Create Bill':'Save Changes'}</button></div>
  </Modal>
}
function DashboardApp({onLogout}){const[res,setRes]=useState([]),[payments,setPayments]=useState([]),[summary,setSummary]=useState(null),[loading,setLoading]=useState(true),[active,setActive]=useState('Dashboard'),[modal,setModal]=useState(null),[selected,setSelected]=useState(null),[toast,setToast]=useState(''),[ai,setAi]=useState(false),[msg,setMsg]=useState(''),[log,setLog]=useState([{r:'bot',t:'Hi! I’m Rank1 AI. Ask me about flats, dues, bills or payments.'}]);const overdue=res.reduce((a,r)=>a+r.due,0);const collection=summary?summary.totalCollection:0;const refreshSummary=()=>api.dashboard.summary().then(setSummary).catch(()=>{});const loadAll=()=>Promise.all([api.flats.list(),api.payments.list(),api.dashboard.summary()]).then(([r,p,s])=>{setRes(r);setPayments(p);setSummary(s)});useEffect(()=>{loadAll().catch(()=>setToast('Could not reach the API. Is the backend running on the URL in .env.local?')).finally(()=>setLoading(false))},[]);useEffect(()=>{if(toast){let t=setTimeout(()=>setToast(''),2600);return()=>clearTimeout(t)}},[toast]);const close=()=>{setModal(null);setSelected(null)};const go=(k,v)=>{if(k==='Dashboard'){setActive('Dashboard');return}if(k==='generate'){setModal('generate');return}if(k==='receive'||k==='receiveCategory'){setSelected(typeof v==='string'?res.find(r=>r.flat===v)||res.find(r=>r.category===v):null);setModal('receive');return}if(k==='advance'){setModal('advance');return}if(k==='reminder'){setSelected('Reminder By Email');setModal('module');return}if(k==='dues'||k==='Dues / Receivables'){setModal('dues');return}if(k==='payments'||k==='Payments'){setModal('payments');return}if(k==='report'){api.reports.export('billing').then(csv=>{let a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='rank1-billing-report.csv';a.click();setToast('Report downloaded')}).catch(()=>setToast('Could not generate the report'));return}if(k==='flat'||k==='search'){let r=res.find(x=>x.flat.toLowerCase()===String(v||'').toLowerCase());if(!r){setToast('Apartment not found');return}setSelected(r);setModal('flat');return}if(k==='failed'||k==='pending'||k==='module'){setSelected(v);setModal('module');return}setActive(k);setSelected(k);setModal('module')};const saveBill=async f=>{try{const{bill,resident}=await api.bills.generate({flat:f.flat,e:+f.e||0,m:+f.m||0,ev:+f.ev||0,road:+f.road||0,other:+f.other||0});setRes(x=>x.map(z=>z.flat===resident.flat?resident:z));setSelected(bill);setModal('bill');setToast('Bill generated successfully');refreshSummary()}catch(err){setToast(err?.data?.message||'Could not generate the bill')}};const receive=async f=>{const amt=+f.amount;if(!f.flat||!amt||amt<=0)return setToast('Enter a valid amount');try{const{payment,resident}=await api.payments.create({flat:f.flat,amount:amt,mode:f.mode});setRes(x=>x.map(z=>z.flat===resident.flat?resident:z));setPayments(x=>[payment,...x]);setToast(`${money(amt)} received from ${resident.flat}`);refreshSummary();close()}catch(err){setToast(err?.data?.message||'Could not record the payment')}};const advance=async f=>{const amt=+f.amount;if(!amt||amt<=0)return setToast('Enter a valid amount');try{const resident=await api.flats.advance({flat:f.flat,amount:amt});setRes(x=>x.map(r=>r.flat===resident.flat?resident:r));setToast('Advance recorded');close()}catch(err){setToast(err?.data?.message||'Could not record the advance')}};const ask=()=>{if(!msg.trim())return;let q=msg.toLowerCase(),r=res.find(x=>q.includes(x.flat.toLowerCase()));let t=r?`${r.flat} — ${r.resident}. Bill ${money(r.bill)}, outstanding ${money(r.due)}, advance ${money(r.advance)}.`:q.includes('overdue')?`${res.filter(r=>r.due>0).length} apartments are overdue for ${money(overdue)} total.`:q.includes('collection')?`Current collection is ${money(collection)}.`:'Try “A-102 details”, “show overdue” or “collection summary”.';setLog(l=>[...l,{r:'user',t:msg},{r:'bot',t}]);setMsg('')};if(loading)return <div className="login-page"><div className="login-shell"><p style={{color:'#fff',padding:'2rem'}}>Loading dashboard…</p></div></div>;if(!summary)return <div className="login-page"><div className="login-shell"><p style={{color:'#fff',padding:'2rem'}}>Could not reach the API.<br/>Check VITE_API_BASE_URL and that the backend is running.</p><div className="modalactions"><button className="primary"onClick={()=>{setLoading(true);loadAll().finally(()=>setLoading(false))}}>Retry</button></div></div></div>;return <div className="app"><Side active={active}setActive={setActive}go={go}onLogout={onLogout}/><div className="main"><main><div className="heading"><div><h1>Good Morning, Admin 👋</h1><p>Here's what's happening in DLF Park Place today.</p></div><div><button className="date"><CalendarDays size={14}/> Aug 1 — Aug 31, 2026</button><button className="refresh"onClick={()=>{setLoading(true);loadAll().finally(()=>setLoading(false))}}><RefreshCw size={14}/> Refresh</button></div></div><div className="stats"><Stat title="Total Collection"val={money(summary.totalCollection)}change="8.43% vs Jul 2026"Icon={WalletCards}cls="green"/><Stat title="Total Outstanding"val={money(summary.totalOutstanding)}change="4.21% vs Jul 2026"Icon={WalletCards}cls="orange"/><Stat title="Overdue Amount"val={money(summary.overdueAmount)}change="12.51% vs Jul 2026"Icon={AlertCircle}cls="red"/><Stat title="Collection Efficiency"val={summary.collectionEfficiency}change="2.80% vs Jul 2026"Icon={Activity}cls="blue"/></div><div className="topgrid"><Chart/><section className="panel catpanel"><div className="pt"><h3>Collection by Category</h3></div><div className="donut"><Donut data={summary.categoryBreakdown}/><b>{money(summary.totalCollection)}</b><small>Total Collected</small></div>{summary.categoryBreakdown.map((c,i)=><div className="legrow"key={c.name}><span><i className={'dot c'+i}/>{c.name}</span><b>{money(c.value)}</b></div>)}</section><Actions go={go}/></div><div className="mid"><Table residents={res}/><Attention residents={res}go={go}/></div><div className="bottom"><Payments payments={payments}go={go}/><section className="panel catpanel"><div className="pt"><h3>Payment Mode Distribution</h3></div><div className="donut"><Donut data={summary.paymentModeBreakdown}/><b>{money(summary.totalCollection)}</b><small>Total</small></div></section></div></main></div><button className="aifab"onClick={()=>setAi(!ai)}><Sparkles size={17}/> Rank1 AI</button>{ai&&<div className="aibox"><div className="aihead"><b>Rank1 AI Assistant</b><button onClick={()=>setAi(false)}><X size={15}/></button></div><div className="ailog">{log.map((m,i)=><div className={m.r}key={i}>{m.t}</div>)}</div><div className="aiinput"><input value={msg}onChange={e=>setMsg(e.target.value)}onKeyDown={e=>e.key==='Enter'&&ask()}placeholder="Ask about a flat, bill or dues..."/><button onClick={ask}><ArrowRight size={15}/></button></div></div>}{modal==='generate'&&<FormModal title="Generate Bill"residents={res}onClose={close}onSave={saveBill}kind="generate"/>}{modal==='receive'&&<FormModal title="Receive Payment"residents={res}selected={selected}onClose={close}onSave={receive}kind="receive"/>}{modal==='advance'&&<FormModal title="Record Advance"residents={res}onClose={close}onSave={advance}kind="advance"/>}{modal==='dues'&&<Dues residents={res}onClose={close}onReceive={r=>{setSelected(r);setModal('receive')}}onGenerate={r=>{setSelected(r);setModal('generate')}}/>}{modal==='flat'&&<Flat r={selected}onClose={close}onReceive={()=>setModal('receive')}onGenerate={()=>setModal('generate')}/>} {modal==='bill'&&<Bill bill={selected}onClose={close}/>} {modal==='payments'&&<Modal title="Payment History"onClose={close}wide><div className="scroll"><table><thead><tr><th>ID</th><th>DATE</th><th>FLAT</th><th>RESIDENT</th><th>AMOUNT</th><th>MODE</th><th>STATUS</th></tr></thead><tbody>{payments.map(p=><tr key={p.id}><td>{p.id}</td><td>{p.date}</td><td>{p.flat}</td><td>{p.resident}</td><td>{money(p.amount)}</td><td>{p.mode}</td><td>{p.status}</td></tr>)}</tbody></table></div></Modal>} {modal==='module'&&<ModuleModal title={String(selected||'Module')} onClose={close} onToast={setToast}/>}{toast&&<div className="toast"><Check size={15}/>{toast}</div>}</div>}
function ShieldCheck(){return <Check size={28}/>}

const AUTH_CONFIG={
  tenant:'DLF-PARK-PLACE'
};

function Login({onLogin}){
  const[username,setUsername]=useState('');
  const[password,setPassword]=useState('');
  const[tenant,setTenant]=useState(AUTH_CONFIG.tenant);
  const[show,setShow]=useState(false);
  const[error,setError]=useState('');
  const[loading,setLoading]=useState(false);
  const submit=async e=>{
    e.preventDefault();
    setError('');
    if(!username.trim()||!password){setError('Enter your Admin ID and password.');return;}
    setLoading(true);
    try{
      // Calls your .NET Core login endpoint. Adjust the field names below
      // (adminId/password/tenantCode) to match your actual request DTO.
      const res=await api.auth.login({username:username.trim(),password,tenantCode:tenant});
      // Adjust res.accessToken / res.user below to match your actual response DTO.
      localStorage.setItem('rank1-access-token',res.accessToken);
      localStorage.setItem('rank1-auth',JSON.stringify({user:res,tenant,loginAt:new Date().toISOString()}));
      onLogin(res);
    }catch(err){
      if(err instanceof ApiError){
        setError(err.status===401?'Invalid username or password.':(err.data?.message||err.message));
      }else{
        setError('Unable to reach the server. Check your API URL and that the backend is running.');
      }
    }finally{
      setLoading(false);
    }
  };
  return <div className="login-page">
    <div className="login-shell">
      <div className="login-brand-panel">
        <div className="brand">
  <img
    src="/rank1-logo.png"
    alt="Rank1 Infotech"
    className="brand-logo"
  />

  <div>
    <b>RANK1 INFOTECH</b>
    <small>Society Management</small>
  </div>
</div>
        <div className="login-hero"><span className="eyebrow">SMART SOCIETY OPERATIONS</span><h1>Manage billing, collections & residents from one secure workspace.</h1><p>Modern finance dashboard for electricity, maintenance, EV, road fund, receipts, reports and overdue management.</p>
          <div className="login-points"><span><Check size={15}/> Billing & collection control</span><span><Check size={15}/> Role-based admin access</span><span><Check size={15}/> Rank1 AI assistant</span></div>
        </div>
        <small className="login-copy">© 2026 Rank1 Infotech · Secure Admin Portal</small>
      </div>
      <div className="login-card-wrap">
        <div className="login-card">
          <div className="mobile-login-brand"><Building2 size={27}/><b>RANK1 INFOTECH</b></div>
          <div className="login-title"><span className="lock-circle"><ShieldCheck/></span><div><h2>Welcome back</h2><p>Sign in to your admin dashboard</p></div></div><div className="demo-hint">Free demo login: <b>emilys</b> / <b>emilyspass</b></div>
          <form onSubmit={submit}>
            <label>Admin ID<input autoFocus value={username} onChange={e=>setUsername(e.target.value)} placeholder="Enter username (e.g. emilys)" autoComplete="username"/></label>
            <label>Tenant / Society Code<input value={tenant} onChange={e=>setTenant(e.target.value.toUpperCase())} placeholder="Enter tenant code" autoComplete="organization"/></label>
            <label>Password<div className="password-wrap"><input type={show?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter password" autoComplete="current-password"/><button type="button" onClick={()=>setShow(!show)}>{show?'Hide':'Show'}</button></div></label>
            <div className="login-options"><label className="remember"><input type="checkbox" defaultChecked/> Keep me signed in</label><span>Admin access only</span></div>
            {error&&<div className="login-error"><AlertCircle size={15}/>{error}</div>}
            <button className="login-submit" disabled={loading}>{loading?'Signing in...':'Sign In'}<ArrowRight size={17}/></button>
          </form>
          <div className="login-security"><ShieldCheck size={15}/><span>Private Rank1 authentication · No Google or Microsoft sign-in</span></div>
        </div>
      </div>
    </div>
  </div>;
}

function App(){
  const[authenticated,setAuthenticated]=useState(false);
  const[checking,setChecking]=useState(true);

  const clearSession=()=>{localStorage.removeItem('rank1-access-token');localStorage.removeItem('rank1-auth');setAuthenticated(false)};

  useEffect(()=>{
    const token=localStorage.getItem('rank1-access-token');
    if(!token){setChecking(false);return}
    // Re-validate the JWT with the backend on every page load/refresh
    // instead of trusting whatever is sitting in localStorage.
    api.auth.me().then(()=>setAuthenticated(true)).catch(()=>clearSession()).finally(()=>setChecking(false));
  },[]);

  useEffect(()=>{
    // client.js fires this whenever any API call comes back 401
    // (e.g. the JWT expired mid-session).
    const onUnauthorized=()=>setAuthenticated(false);
    window.addEventListener('rank1-unauthorized',onUnauthorized);
    return()=>window.removeEventListener('rank1-unauthorized',onUnauthorized);
  },[]);

  const login=()=>setAuthenticated(true);
  const logout=()=>{api.auth.logout().catch(()=>{});clearSession()};

  if(checking)return <div className="login-page"><div className="login-shell"><p style={{color:'#fff',padding:'2rem'}}>Checking session…</p></div></div>;
  return authenticated?<DashboardApp onLogout={logout}/>:<Login onLogin={login}/>;
}

createRoot(document.getElementById('root')).render(<App/>);
