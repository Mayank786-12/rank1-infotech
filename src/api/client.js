const BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
const AUTH_MODE = (import.meta.env.VITE_AUTH_MODE || 'dummy').toLowerCase();
const DUMMY_URL = 'https://dummyjson.com';

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

const seedResidents = [
  {flat:'A-102',resident:'Rohit Sharma',phone:'9876543210',email:'rohit@example.com',bill:4500,due:2100,advance:0,category:'Maintenance'},
  {flat:'B-204',resident:'Anita Verma',phone:'9876543211',email:'anita@example.com',bill:2350,due:0,advance:500,category:'Electricity'},
  {flat:'C-301',resident:'Vikram Singh',phone:'9876543212',email:'vikram@example.com',bill:1200,due:0,advance:0,category:'EV Charges'},
  {flat:'D-405',resident:'Neha Gupta',phone:'9876543213',email:'neha@example.com',bill:5100,due:0,advance:0,category:'Maintenance'},
  {flat:'E-502',resident:'Arjun Patel',phone:'9876543214',email:'arjun@example.com',bill:3000,due:0,advance:0,category:'Road Fund'},
  {flat:'F-601',resident:'Priya Mehta',phone:'9876543215',email:'priya@example.com',bill:6800,due:6800,advance:0,category:'Electricity'},
];
const seedPayments = [
  {id:'PAY-1007',date:'31 Aug 2026, 12:21 PM',flat:'A-102',resident:'Rohit Sharma',category:'Maintenance',amount:4500,mode:'UPI',status:'Success'},
  {id:'PAY-1006',date:'31 Aug 2026, 11:18 AM',flat:'B-204',resident:'Anita Verma',category:'Electricity',amount:2350,mode:'UPI',status:'Success'},
  {id:'PAY-1005',date:'30 Aug 2026, 09:47 PM',flat:'C-301',resident:'Vikram Singh',category:'EV Charges',amount:1200,mode:'Bank',status:'Success'},
  {id:'PAY-1004',date:'30 Aug 2026, 07:31 PM',flat:'D-405',resident:'Neha Gupta',category:'Maintenance',amount:5100,mode:'Card',status:'Success'},
  {id:'PAY-1003',date:'29 Aug 2026, 06:05 PM',flat:'E-502',resident:'Arjun Patel',category:'Road Fund',amount:3000,mode:'UPI',status:'Pending'},
];

function clone(v){ return JSON.parse(JSON.stringify(v)); }
function getLocal(key, fallback){
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : clone(fallback); }
  catch { return clone(fallback); }
}
function setLocal(key, value){ localStorage.setItem(key, JSON.stringify(value)); }
function localResidents(){ return getLocal('rank1-demo-residents', seedResidents); }
function localPayments(){ return getLocal('rank1-demo-payments', seedPayments); }
function localSummary(){
  const residents = localResidents();
  const payments = localPayments();
  const totalCollection = payments.filter(p=>p.status==='Success').reduce((a,p)=>a+Number(p.amount||0),0);
  const totalOutstanding = residents.reduce((a,r)=>a+Number(r.due||0),0);
  const overdueAmount = residents.filter(r=>r.due>0).reduce((a,r)=>a+Number(r.due||0),0);
  const cats = {};
  payments.filter(p=>p.status==='Success').forEach(p=>cats[p.category]=(cats[p.category]||0)+Number(p.amount||0));
  const modes = {};
  payments.filter(p=>p.status==='Success').forEach(p=>modes[p.mode]=(modes[p.mode]||0)+Number(p.amount||0));
  return {
    totalCollection,totalOutstanding,overdueAmount,
    collectionEfficiency: totalCollection+totalOutstanding ? `${((totalCollection/(totalCollection+totalOutstanding))*100).toFixed(2)}%` : '0.00%',
    categoryBreakdown:Object.entries(cats).map(([name,value])=>({name,value})),
    paymentModeBreakdown:Object.entries(modes).map(([name,value])=>({name,value}))
  };
}

async function httpRequest(base, path, options={}){
  const token = localStorage.getItem('rank1-access-token');
  const headers = {'Content-Type':'application/json', ...(options.headers||{})};
  if(token) headers.Authorization = `Bearer ${token}`;
  let response;
  try {
    response = await fetch(`${base}${path}`, {...options, headers, credentials:'include'});
  } catch (e) {
    throw new ApiError('Unable to reach the server.', 0, {message:e.message});
  }
  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await response.json() : await response.text();
  if(!response.ok){
    if(response.status===401 && !path.includes('/login')){
      localStorage.removeItem('rank1-access-token');
      localStorage.removeItem('rank1-auth');
      window.dispatchEvent(new Event('rank1-unauthorized'));
    }
    throw new ApiError(data?.message || `Request failed with status ${response.status}`, response.status, data);
  }
  return data;
}

async function dummyLogin({username,password}){
  const data = await httpRequest(DUMMY_URL, '/auth/login', {
    method:'POST',
    body:JSON.stringify({username,password,expiresInMins:30})
  });
  return data;
}
async function dummyMe(){
  return httpRequest(DUMMY_URL, '/auth/me', {method:'GET'});
}

const localApi = {
  dashboard: { summary: async()=>localSummary() },
  flats: {
    list: async()=>clone(localResidents()),
    search: async(flatNo)=>localResidents().filter(r=>r.flat.toLowerCase().includes(String(flatNo).toLowerCase())),
    closing: async(flatNo)=>localResidents().find(r=>r.flat===flatNo)||null,
    details: async(flatNo)=>localResidents().find(r=>r.flat===flatNo)||null,
    advance: async(payload)=>{
      const rows=localResidents(); const i=rows.findIndex(r=>r.flat===payload.flat);
      if(i<0) throw new ApiError('Apartment not found',404,{});
      rows[i].advance += Number(payload.amount||0); setLocal('rank1-demo-residents',rows); return clone(rows[i]);
    }
  },
  bills:{
    generate: async(payload)=>{
      const rows=localResidents(); const i=rows.findIndex(r=>r.flat===payload.flat);
      if(i<0) throw new ApiError('Apartment not found',404,{});
      const total=['e','m','ev','road','other'].reduce((s,k)=>s+Number(payload[k]||0),0);
      rows[i].bill=total; rows[i].due=total; setLocal('rank1-demo-residents',rows);
      return {bill:{id:`BILL-${Date.now()}`,flat:rows[i].flat,amount:total,date:new Date().toLocaleString('en-IN')},resident:clone(rows[i])};
    },
    list: async()=>localResidents()
  },
  payments:{
    create: async(payload)=>{
      const rows=localResidents(); const i=rows.findIndex(r=>r.flat===payload.flat);
      if(i<0) throw new ApiError('Apartment not found',404,{});
      const amount=Number(payload.amount||0); rows[i].due=Math.max(0,rows[i].due-amount); setLocal('rank1-demo-residents',rows);
      const payment={id:`PAY-${Date.now()}`,date:new Date().toLocaleString('en-IN'),flat:rows[i].flat,resident:rows[i].resident,category:rows[i].category,amount,mode:payload.mode||'UPI',status:'Success'};
      setLocal('rank1-demo-payments',[payment,...localPayments()]); return {payment,resident:clone(rows[i])};
    },
    list: async()=>clone(localPayments())
  },
  dues:{overdue:async()=>localResidents().filter(r=>r.due>0)},
  reports:{export:async()=>{
    const rows=localResidents();
    return ['Flat,Resident,Bill,Outstanding,Advance,Category',...rows.map(r=>[r.flat,r.resident,r.bill,r.due,r.advance,r.category].join(','))].join('\n');
  }}
};

export const api = {
  auth:{
    login: async(payload)=> AUTH_MODE==='dummy' ? dummyLogin(payload) : httpRequest(BASE_URL,'/auth/login',{method:'POST',body:JSON.stringify(payload)}),
    me: async()=> AUTH_MODE==='dummy' ? dummyMe() : httpRequest(BASE_URL,'/auth/me'),
    logout: async()=>{ if(AUTH_MODE!=='dummy' && BASE_URL) return httpRequest(BASE_URL,'/auth/logout',{method:'POST'}); return {success:true}; }
  },
  dashboard: {summary: async(params={})=> AUTH_MODE==='dummy' ? localApi.dashboard.summary(params) : httpRequest(BASE_URL,`/dashboard/summary${Object.keys(params).length?'?'+new URLSearchParams(params):''}`)},
  flats: {
    list:()=>AUTH_MODE==='dummy'?localApi.flats.list():httpRequest(BASE_URL,'/flats'),
    search:(flatNo)=>AUTH_MODE==='dummy'?localApi.flats.search(flatNo):httpRequest(BASE_URL,`/flats/search?flat=${encodeURIComponent(flatNo)}`),
    closing:(flatNo)=>AUTH_MODE==='dummy'?localApi.flats.closing(flatNo):httpRequest(BASE_URL,`/flats/${encodeURIComponent(flatNo)}/closing`),
    details:(flatNo)=>AUTH_MODE==='dummy'?localApi.flats.details(flatNo):httpRequest(BASE_URL,`/flats/${encodeURIComponent(flatNo)}`),
    advance:(payload)=>AUTH_MODE==='dummy'?localApi.flats.advance(payload):httpRequest(BASE_URL,'/flats/advance',{method:'POST',body:JSON.stringify(payload)})
  },
  bills:{generate:(payload)=>AUTH_MODE==='dummy'?localApi.bills.generate(payload):httpRequest(BASE_URL,'/bills/generate',{method:'POST',body:JSON.stringify(payload)}),list:()=>AUTH_MODE==='dummy'?localApi.bills.list():httpRequest(BASE_URL,'/bills')},
  payments:{create:(payload)=>AUTH_MODE==='dummy'?localApi.payments.create(payload):httpRequest(BASE_URL,'/payments',{method:'POST',body:JSON.stringify(payload)}),list:()=>AUTH_MODE==='dummy'?localApi.payments.list():httpRequest(BASE_URL,'/payments')},
  dues:{overdue:()=>AUTH_MODE==='dummy'?localApi.dues.overdue():httpRequest(BASE_URL,'/dues/overdue')},
  reports:{export:(type,params={})=>AUTH_MODE==='dummy'?localApi.reports.export(type,params):httpRequest(BASE_URL,`/reports/${type}`)}
};
