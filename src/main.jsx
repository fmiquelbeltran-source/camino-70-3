import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const STORAGE_LOG = 'camino703_log_v1';
const STORAGE_PLAN = 'camino703_plan_v1';
const STORAGE_PLAN_NAME = 'camino703_plan_name_v1';

const defaultPlanName = 'Mayo 2026';
const defaultPlan = [
  ['2026-05-04','Natación técnica + CrossFit suave/moderado',['natación','fuerza'],'60-90 min','Suave/moderada','Natación 1.600 m: 300 suave + 6x50 técnica + 6x100 suaves + 200 suave + 4x25 vivos + 100 suave. CrossFit sin buscar PR ni machacar piernas.','Hidratación normal. No hace falta ingesta específica.','Priorizar técnica, respiración relajada y piernas frescas.'],
  ['2026-05-05','Carrera suave + rectas',['carrera'],'45-50 min','Z2 / cómodo','Rodaje a 5:45-6:20/km. Al final, 6 rectas de 15 segundos, recuperando 45-60 segundos.','Agua si hace calor. Sin gel necesario.','Vigilar tobillo y cadera. Las rectas no son sprint.'],
  ['2026-05-06','Descanso real + movilidad',['descanso','movilidad'],'15-20 min opcional','Muy suave','Movilidad de cadera, tobillo, glúteo medio, espalda torácica y respiración diafragmática.','Comer normal e hidratar bien durante el día.','No convertir el descanso en otro entrenamiento.'],
  ['2026-05-07','Rodillo Z2 con cadencia alta',['bici'],'60 min','Z2 / 60-70% FTP','10 min suave + 4x5 min a 90-100 rpm cómodos, con 5 min suaves entre bloques. Resto Z2.','Agua. Electrolitos si hace calor o sudas mucho.','Debe dejarte mejor de lo que empiezas.'],
  ['2026-05-08','Natación + CrossFit tren superior/core',['natación','fuerza'],'70-100 min','Suave/moderada','Natación 1.700-1.900 m: 300 suave + 8x50 técnica + 4x200 constantes + 200 suave + 4x50 progresivos + 100 suave. CrossFit tren superior/core.','Hidratación normal.','Evitar zancadas, saltos o sentadillas pesadas antes de la tirada.'],
  ['2026-05-09','Tirada larga carrera',['carrera','nutrición'],'14-16 km','Muy cómoda','Ritmo 5:50-6:30/km. Objetivo: acabar entero, no acabar rápido.','Agua desde el inicio. 1 gel en minuto 45-50. Sorbos cada 15-20 min.','Si aparece dolor que altera la pisada, cortar o volver caminando.'],
  ['2026-05-10','Bici suave',['bici','nutrición'],'75-90 min','Z2 cómoda','Salida fácil o rodillo. Sin piques, sin bloques fuertes. Cadencia estable.','500-750 ml de líquido. Si pasas de 75 min, 30 g de hidratos. Electrolitos si hace calor.','Reintroducir bici sin prisas.'],
  ['2026-05-11','CrossFit moderado + movilidad',['fuerza','movilidad'],'45-70 min','RPE máximo 7/10','Fuerza controlada. Si hay sentadilla, peso muerto o zancadas, no ir pesado. Añadir movilidad breve.','Hidratación normal. Comer suficiente para apoyar fuerza.','No generar agujetas fuertes para la carrera del martes.'],
  ['2026-05-12','Carrera con bloques alegres',['carrera'],'55 min','Controlada','15 min suave + 3x6 min a 5:00-5:15/km + 3 min suaves + 10-15 min suave.','Agua si hace calor. Sin gel necesario.','Debes acabar con sensación de poder hacer una repetición más.'],
  ['2026-05-13','Descanso',['descanso'],'Libre','Descanso real','Día sin entrenamiento. Opcional paseo suave o 20 min movilidad.','Hidratar bien. No recortar comida por descansar.','Asimilar carga.'],
  ['2026-05-14','Rodillo tempo cómodo',['bici'],'75 min','Z2 + tempo 75-80% FTP','15 min suave + 3x8 min tempo cómodo + 5 min suave + resto Z2.','Agua. Electrolitos si hace calor.','No convertirlo en test de FTP.'],
  ['2026-05-15','Natación técnica/resistencia',['natación'],'1.900-2.100 m','Constante','400 suave + 6x50 técnica + 8x100 ritmo estable + 4x50 respirando cada 3 brazadas si puedes + 200 suave.','Hidratación normal.','Buscar relajación y continuidad.'],
  ['2026-05-16','Bici larga + mini-brick',['bici','carrera','nutrición'],'1h45-2h bici + 10 min trote','Z2 + trote muy suave','Bici estable y cómoda. Al bajar, 10 min de trote a 6:00-6:40/km.','40 g hidratos/h en bici. 500-750 ml/h. Electrolitos. Comer cada 25-30 min.','El trote es adaptación, no velocidad.'],
  ['2026-05-17','Carrera cómoda o descanso',['carrera','descanso'],'10-12 km o descanso','Muy cómoda','Opción A: 10-12 km a 5:45-6:20/km. Opción B: descanso si hay carga.','Agua si corres. Gel solo si hace calor o más de 75 min.','Elegir descanso si hay molestias.'],
  ['2026-05-18','Natación + CrossFit',['natación','fuerza'],'70-100 min','Moderada','Natación 1.800 m: 300 suave + 8x50 técnica + 5x200 ritmo constante + 100 suave. CrossFit controlado.','Hidratación normal.','Evitar reventar piernas.'],
  ['2026-05-19','Carrera Z2 + rectas',['carrera'],'50-60 min','Z2','Rodaje a 5:45-6:20/km. Al final, 8x20 segundos de rectas.','Agua si hace calor.','Rectas con zancada suelta, no sprint.'],
  ['2026-05-20','Descanso completo',['descanso'],'Libre','Descanso','Sin entrenamiento. Priorizar sueño, hidratación y descarga.','Comer normal, no recortar hidratos en exceso.','El descanso es parte del entrenamiento.'],
  ['2026-05-21','Rodillo con tempo controlado',['bici'],'80-90 min','Z2 + 75-85% FTP','15 min suave + 4x8 min tempo + 4 min suaves + resto Z2. Si hay piernas cargadas, todo Z2.','Agua. Electrolitos si hace calor.','Trabajo estable, no sufrimiento.'],
  ['2026-05-22','Natación resistencia',['natación'],'2.100-2.300 m','Constante','400 suave + 8x50 técnica + 3x400 cómodo + 4x50 progresivos + 200 suave.','Hidratación normal.','Construir cabeza y continuidad.'],
  ['2026-05-23','Tirada larga carrera',['carrera','nutrición'],'16-17 km','Muy cómoda','Ritmo 5:50-6:30/km. No acabar rápido.','Gel min 40-45. Segundo gel min 75-80 si pasas de 90 min. Agua cada 15-20 min. Electrolitos si hace calor.','Cadera y tobillo mandan.'],
  ['2026-05-24','Bici larga Z2',['bici','nutrición'],'2h-2h15','Z2','Idealmente fuera. Si no, rodillo. Cadencia estable, sin apretar.','40-50 g hidratos/h. 500-750 ml/h. Electrolitos. Comer cada 25-30 min.','Registrar qué tomas y cómo te sienta.'],
  ['2026-05-25','Descanso o movilidad',['descanso','movilidad'],'15 min opcional','Muy suave','Semana de descarga. Opcional movilidad y foam roller suave.','Hidratar bien. Mantener ingesta suficiente.','Absorber la carga.'],
  ['2026-05-26','Carrera suave',['carrera'],'40-45 min','Z2 baja','Rodaje a 5:50-6:30/km. Sin rectas si estás cansado.','Agua si hace calor.','Debe sentirse fácil.'],
  ['2026-05-27','Natación técnica',['natación'],'1.400-1.600 m','Suave','300 suave + 10x50 técnica + 6x100 suaves + 200 suave.','Hidratación normal.','Técnica por encima de volumen.'],
  ['2026-05-28','Rodillo suave',['bici'],'50-60 min','Z2 muy fácil','Cadencia cómoda. Sin bloques fuertes.','Agua. Electrolitos si hace calor.','Descarga activa.'],
  ['2026-05-29','CrossFit suave',['fuerza'],'45-60 min','Suave/moderada','Nada de buscar marcas. Evitar agujetas fuertes.','Hidratación normal.','Priorizar técnica, movilidad y core.'],
  ['2026-05-30','Carrera cómoda',['carrera'],'10-12 km','Cómoda','Ritmo 5:45-6:20/km. Rodaje cómodo de descarga.','Agua si hace calor. Gel solo si pasas de 75 min.','No convertirlo en test.'],
  ['2026-05-31','Bici suave o descanso',['bici','descanso'],'75-90 min o descanso','Muy suave','Opción A: bici muy suave. Opción B: descanso total si hay fatiga acumulada.','Si haces bici: 500-750 ml/h y electrolitos si hace calor.','Llegar fresco a junio.']
].map(([date,title,types,duration,intensity,details,nutrition,watch]) => ({date,title,types,duration,intensity,details,nutrition,watch}));

function todayISO(){ const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
function formatDate(s){ return new Intl.DateTimeFormat('es-ES',{weekday:'long', day:'numeric', month:'long'}).format(new Date(`${s}T12:00:00`)); }
function safeParse(key, fallback){ try{ const raw=localStorage.getItem(key); return raw?JSON.parse(raw):fallback; }catch{return fallback;} }
function save(key, value){ try{ localStorage.setItem(key, JSON.stringify(value)); }catch{} }
function initialDate(plan){ const t=todayISO(); return plan.some(x=>x.date===t)?t:(plan[0]?.date || todayISO()); }
function normalizePlan(plan){ return Array.isArray(plan) ? plan.filter(x=>x&&x.date&&x.title).map(x=>({types:['descanso'],duration:'',intensity:'',details:'',nutrition:'',watch:'',...x})) : defaultPlan; }
function cls(type){ return ({'natación':'swim','bici':'bike','carrera':'run','fuerza':'strength','movilidad':'mobility','descanso':'rest','nutrición':'fuel'}[type]||'rest'); }

function App(){
  const [plan,setPlan]=useState(defaultPlan);
  const [planName,setPlanName]=useState(defaultPlanName);
  const [selected,setSelected]=useState(initialDate(defaultPlan));
  const [log,setLog]=useState({});
  const [tab,setTab]=useState('today');
  const [notif,setNotif]=useState(false);

  useEffect(()=>{
    const p=normalizePlan(safeParse(STORAGE_PLAN, defaultPlan));
    setPlan(p); setSelected(initialDate(p));
    setPlanName(localStorage.getItem(STORAGE_PLAN_NAME) || defaultPlanName);
    setLog(safeParse(STORAGE_LOG, {}));
    setNotif(localStorage.getItem('camino703_notif')==='true');
    if('serviceWorker' in navigator){ navigator.serviceWorker.register('/sw.js').catch(()=>{}); }
  },[]);
  useEffect(()=>save(STORAGE_LOG, log),[log]);

  const todaySession=plan.find(x=>x.date===todayISO());
  const selectedSession=plan.find(x=>x.date===selected);
  const stats=useMemo(()=>{
    const entries=Object.values(log);
    const avg=(k)=>entries.length?(entries.reduce((s,e)=>s+Number(e[k]||0),0)/entries.length).toFixed(1):'-';
    return {done:plan.filter(s=>log[s.date]?.status==='hecho').length, modified:plan.filter(s=>log[s.date]?.status==='modificado').length, missed:plan.filter(s=>log[s.date]?.status==='no_hecho').length, feeling:avg('feeling'), fatigue:avg('fatigue'), pain:entries.length?Math.max(...entries.map(e=>Number(e.pain||0))):0};
  },[plan,log]);

  const updateLog=(date, patch)=>setLog(prev=>({...prev,[date]:{...(prev[date]||{}),...patch}}));
  const jumpToday=()=>{ const target=todaySession || plan[0]; if(target) setSelected(target.date); setTab('today'); setTimeout(()=>document.getElementById('session')?.scrollIntoView({behavior:'smooth'}),50); };
  const enableNotifications=async()=>{ if(!('Notification' in window)) return alert('Este navegador no soporta notificaciones.'); const p=await Notification.requestPermission(); if(p==='granted'){ localStorage.setItem('camino703_notif','true'); setNotif(true); const s=todaySession||plan[0]; new Notification('Camino al 70.3',{body:s?`Entreno de hoy: ${s.title}`:'Sin entreno cargado'}); } };
  const exportData=()=>{ const blob=new Blob([JSON.stringify({planName,plan,log},null,2)],{type:'application/json'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=`camino_70_3_${planName.replaceAll(' ','_').toLowerCase()}.json`; a.click(); URL.revokeObjectURL(url); };
  const importData=(e)=>{ const file=e.target.files?.[0]; if(!file) return; const r=new FileReader(); r.onload=()=>{ try{ const parsed=JSON.parse(String(r.result)); if(parsed.plan){ const p=normalizePlan(parsed.plan); setPlan(p); save(STORAGE_PLAN,p); setSelected(initialDate(p)); } if(parsed.planName){ setPlanName(parsed.planName); localStorage.setItem(STORAGE_PLAN_NAME, parsed.planName); } if(parsed.log) setLog(parsed.log); alert('Datos importados correctamente.'); }catch{ alert('No se pudo importar. Revisa el JSON.'); } }; r.readAsText(file); e.target.value=''; };
  const restore=()=>{ if(confirm('¿Restaurar plan base de mayo? No borra registros.')){ setPlan(defaultPlan); setPlanName(defaultPlanName); save(STORAGE_PLAN, defaultPlan); localStorage.setItem(STORAGE_PLAN_NAME, defaultPlanName); setSelected(initialDate(defaultPlan)); } };
  const copySummary=async()=>{ const lines=[`Resumen para ChatGPT — ${planName}`,`Sesiones planificadas: ${plan.length}`,`Hechas: ${stats.done}`,`Modificadas: ${stats.modified}`,`No hechas: ${stats.missed}`,`Sensación media: ${stats.feeling}/10`,`Fatiga media: ${stats.fatigue}/10`,`Máximo dolor: ${stats.pain}/10`,'','Detalle relevante:',...plan.filter(s=>log[s.date]).map(s=>{const e=log[s.date];return `- ${s.date} (${s.title}): estado=${e.status||'-'}; sensación=${e.feeling||'-'}/10; fatiga=${e.fatigue||'-'}/10; dolor=${e.pain||0}/10; sueño=${e.sleep||'-'}; Garmin/nutrición=${e.garmin||'-'}; notas=${e.notes||'-'}`;}),'','Quiero que valores este mes y prepares el siguiente plan.']; await navigator.clipboard.writeText(lines.join('\n')).then(()=>alert('Resumen copiado.')); };

  return <main>
    <header className="hero">
      <div><p className="kicker">Preparación Ironman 70.3</p><h1>Camino al 70.3</h1><p>Versión PWA 1.0 · Plan mensual, entreno del día, registro diario, exportar/importar y resumen para ChatGPT.</p></div>
      <div className="actions"><button onClick={enableNotifications}>{notif?'🔔 Notificaciones activas':'🔕 Activar notificaciones'}</button><button onClick={exportData}>⬇️ Exportar</button><button onClick={restore}>Restaurar mayo</button><label className="file">⬆️ Importar<input type="file" accept="application/json" onChange={importData}/></label></div>
    </header>

    <section className="cards">
      <button className="card today" onClick={jumpToday}><span>Hoy</span><strong>{new Intl.DateTimeFormat('es-ES',{weekday:'long',day:'numeric',month:'long'}).format(new Date())}</strong><p>{todaySession?todaySession.title:`Fuera del plan activo (${planName}). Toca para ir al primer entreno.`}</p><small>Toca para ver el entreno del día →</small></button>
      <div className="card"><span>Plan activo</span><strong>{planName}</strong><p>{plan.length} sesiones cargadas</p></div>
      <div className="card"><span>Objetivo</span><strong>70.3 — 20/04/2027</strong><p>Terminar con buenas sensaciones.</p></div>
      <div className="card"><span>Nutrición</span><strong>30-50 g/h</strong><p>Practicar en sesiones largas.</p></div>
    </section>

    <section className="note"><strong>📱 Modo app móvil</strong><p>Cuando esté publicada, abre la URL en Safari/Chrome y pulsa “Añadir a pantalla de inicio”. Los datos se guardan en el navegador: exporta el JSON de vez en cuando.</p><p><strong>Garmin:</strong> de momento copia datos clave en el campo Garmin/nutrición: distancia, tiempo, FC media, potencia, desnivel, sueño y sensaciones.</p></section>

    <nav><button className={tab==='today'?'active':''} onClick={()=>setTab('today')}>Hoy / sesión</button><button className={tab==='calendar'?'active':''} onClick={()=>setTab('calendar')}>Calendario</button><button className={tab==='summary'?'active':''} onClick={()=>setTab('summary')}>Resumen</button></nav>

    {tab==='today' && <section className="layout"><aside><h2>📅 {planName}</h2>{plan.map(s=><button key={s.date} className={s.date===selected?'day active':'day'} onClick={()=>setSelected(s.date)}><span>{formatDate(s.date)}</span><b>{s.title}</b>{log[s.date]?.status==='hecho'&&<em>✅</em>}</button>)}</aside><Session id="session" session={selectedSession} entry={log[selected]||{}} update={updateLog}/></section>}
    {tab==='calendar' && <section className="grid">{plan.map(s=><button className="sessionMini" key={s.date} onClick={()=>{setSelected(s.date);setTab('today')}}><span>{formatDate(s.date)}</span><b>{s.title}</b><p>{s.duration}</p><div>{s.types.map(t=><i key={t} className={cls(t)}>{t}</i>)}</div></button>)}</section>}
    {tab==='summary' && <section className="summary"><div className="cards"><div className="card"><span>Hechas</span><strong>{stats.done}</strong></div><div className="card"><span>Modificadas</span><strong>{stats.modified}</strong></div><div className="card"><span>Sensación media</span><strong>{stats.feeling}</strong></div><div className="card"><span>Dolor máximo</span><strong>{stats.pain}/10</strong></div></div><button onClick={copySummary}>📋 Copiar resumen para ChatGPT</button></section>}
    <footer>Versión PWA 1.0 · Exporta tus datos a final de mes y pégame el resumen para ajustar el siguiente bloque.</footer>
  </main>;
}

function Session({session,entry,update,id}){ if(!session) return <section id={id} className="panel">No hay sesión seleccionada.</section>; const set=(field,val)=>update(session.date,{[field]:val}); return <section id={id} className="panel"><div className="sessionHead"><div><span>{formatDate(session.date)}</span><h2>{session.title}</h2></div><div>{session.types.map(t=><i key={t} className={cls(t)}>{t}</i>)}</div></div><div className="twocol"><Info label="Duración" value={session.duration}/><Info label="Intensidad" value={session.intensity}/></div><Block title="Sesión" text={session.details}/><Block title="💧 Nutrición e hidratación" text={session.nutrition}/><Block title="⚠️ Vigilar" text={session.watch}/><div className="log"><h3>📝 Registro</h3><label>Estado<select value={entry.status||'pendiente'} onChange={e=>set('status',e.target.value)}><option value="pendiente">Pendiente</option><option value="hecho">Hecho</option><option value="modificado">Modificado</option><option value="no_hecho">No hecho</option></select></label><Range label="Sensación" value={entry.feeling||5} set={v=>set('feeling',v)} min={1}/><Range label="Fatiga" value={entry.fatigue||5} set={v=>set('fatigue',v)} min={1}/><Range label="Dolor/molestias" value={entry.pain||0} set={v=>set('pain',v)} min={0}/><label>Sueño<input value={entry.sleep||''} onChange={e=>set('sleep',e.target.value)} placeholder="Ej. 6h30, bien"/></label><label>Garmin / nutrición real<input value={entry.garmin||''} onChange={e=>set('garmin',e.target.value)} placeholder="Ej. 10 km · FC 139 · 1 gel · 600 ml"/></label><label className="full">Notas<textarea value={entry.notes||''} onChange={e=>set('notes',e.target.value)} placeholder="Sensaciones, molestias, cambios, digestión..."/></label></div></section> }
function Info({label,value}){return <div className="info"><span>{label}</span><b>{value}</b></div>}
function Block({title,text}){return <div className="block"><h3>{title}</h3><p>{text}</p></div>}
function Range({label,value,set,min}){return <label>{label}: {value}/10<input type="range" min={min} max="10" value={value} onChange={e=>set(Number(e.target.value))}/></label>}

createRoot(document.getElementById('root')).render(<App />);
