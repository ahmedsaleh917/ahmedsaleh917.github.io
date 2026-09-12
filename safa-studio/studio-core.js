/*SAFA:PRO:2026.09.12-v2*/
(function(){const p=new URLSearchParams(location.search).get('theme');...
(function(){const p=new URLSearchParams(location.search).get('theme');const s=localStorage.getItem('theme');const t=p||s||'dark';if(t==='dark')document.body.classList.add('dark');})();
/* ======================================================
   🎬 نظام إعلانات AdMob — جسر المكافآت
   ====================================================== */
window.__studioPendingAction = null;
window.__studioAdTimeout = null;
window.__studioAdBusy = false;

function requestRewardAd(tag, successAction, failAction){
  if(window.__studioAdBusy){
    if(successAction) successAction();
    return;
  }
  window.__studioAdBusy = true;
  window.__studioPendingAction = {tag, successAction, failAction};
  
  clearTimeout(window.__studioAdTimeout);
  window.__studioAdTimeout = setTimeout(()=>{
    if(window.__studioPendingAction){
      const act = window.__studioPendingAction;
      window.__studioPendingAction = null;
      window.__studioAdBusy = false;
      if(act.successAction){
        try{ act.successAction(); }catch(e){ console.warn('[Ad] fallback exec failed', e); }
      }
    }
  }, 45000);
  
  try{
    if(window.AdBridge && typeof window.AdBridge.showRewarded === 'function'){
      window.AdBridge.showRewarded(tag);
      return;
    }
    if(window.SketchwareInterface && typeof window.SketchwareInterface.showRewarded === 'function'){
      window.SketchwareInterface.showRewarded(tag);
      return;
    }
    window.onAdReward(tag);
  }catch(e){
    window.onAdReward(tag);
  }
}

function requestInterstitialAd(){
  try{
    if(window.AdBridge && typeof window.AdBridge.showInterstitial === 'function'){
      window.AdBridge.showInterstitial();
      return;
    }
    if(window.SketchwareInterface && typeof window.SketchwareInterface.showInterstitial === 'function'){
      window.SketchwareInterface.showInterstitial();
      return;
    }
  }catch(e){ console.warn('[Ad] interstitial failed', e); }
}

window.onAdReward = function(tag){
  clearTimeout(window.__studioAdTimeout);
  const act = window.__studioPendingAction;
  window.__studioPendingAction = null;
  window.__studioAdBusy = false;
  if(act && act.successAction){
    try{ act.successAction(); }catch(e){ console.warn('[Ad] success exec failed', e); }
  }
};

window.onAdFailed = function(){
  clearTimeout(window.__studioAdTimeout);
  const act = window.__studioPendingAction;
  window.__studioPendingAction = null;
  window.__studioAdBusy = false;
  try{ if(typeof toast==='function') toast('🎁 الإعلان غير متوفر - تمت العملية مباشرة'); }catch(e){}
  if(act && act.successAction){
    try{ act.successAction(); }catch(e){}
  }
};

window.onAdClosed = function(){
  clearTimeout(window.__studioAdTimeout);
  const act = window.__studioPendingAction;
  window.__studioPendingAction = null;
  window.__studioAdBusy = false;
  if(act && act.failAction){
    try{ act.failAction(); }catch(e){}
  }else{
    try{ if(typeof toast==='function') toast('⚠️ لم تكتمل مشاهدة الإعلان'); }catch(e){}
  }
};
const ASSETS='file:///android_asset/';const FONTS_DIR='fonts';const MANU_DIR='studio/mkhtwtaat';const ZAKH_DIR='studio/zkharef';const TOOL_DIR='studio/tool';
const encPath=p=>p.split('/').map(s=>encodeURIComponent(s)).join('/');
const TEXT_FONTS=[['CairoR','القاهرة','Cairo-Regular.ttf'],['CairoB','القاهرة عريض','Cairo-Bold.ttf'],['Amiri','أميري','Amiri-Regular.ttf'],['Suls','ثلث','Suls.ttf'],['BFantezy','ديواني','BFantezy.ttf']];
const MANU_REG=[{label:'البسملة',files:['مخطوطات البسملة.ttf']},{label:'الجمعة',files:['مخطوطات الجمعة.ttf']},{label:'العيد',files:['مخطوطات العيد.ttf']},{label:'إسلامية',files:['مخطوطات إسلامية.ttf']}];
const ZAKH_REG=[{label:'إسلامية',files:['زخارف إسلامية @ALADWAT.ttf']},{label:'إطارات',files:['زخارف إطارات @ALADWAT.ttf']},{label:'قلوب',files:['زخارف قلوب ونجوم @ALADWAT.ttf']}];
const FONTS={};const slug=s=>String(s).replace(/\.(ttf|otf)$/i,'').replace(/[^\w\u0600-\u06FF]+/g,'_');

const MAX_IMAGE_WORKING_DIMENSION = 2560;
const MAX_CANVAS_DIMENSION = 4096;
const MAX_HISTORY = 20;
const MAX_IMAGE_OBJECTS = 30;

const STUDIO_LIMITS={
  memoryBudgetBytes:160*1024*1024,
  maxHistory:20,
  maxImageWorkingDimension:MAX_IMAGE_WORKING_DIMENSION,
  maxCanvasDimension:MAX_CANVAS_DIMENSION
};

let renderFrameId=0;
let renderPending=false;
let renderGeneration=0;
let renderShuttingDown=false;
let lastRenderAt=0;

function renderNow(){
  if(renderShuttingDown)return;
  try{
    drawScene(ctx,canvas.width,canvas.height,true);
    lastRenderAt=performance.now();
  }catch(e){
    console.error('[Studio] render error',e);
  }
}
function requestRender(){
  if(renderShuttingDown||renderPending)return;
  renderPending=true;
  try{
    renderFrameId=requestAnimationFrame(()=>{
      renderPending=false;
      renderFrameId=0;
      if(renderShuttingDown)return;
      const gen=renderGeneration;
      try{renderNow();}catch(e){console.error('[Studio] render error',e);}
      if(gen!==renderGeneration)setTimeout(requestRender,0);
    });
  }catch(e){
    renderPending=false;
    console.error('[Studio] requestRender failed',e);
  }
}
function drawImmediate(){
  if(renderShuttingDown)return;
  if(renderFrameId){try{cancelAnimationFrame(renderFrameId);}catch(e){}}
  renderFrameId=0;renderPending=false;renderNow();
}
function shutdownRenderEngine(){renderShuttingDown=true;if(renderFrameId){try{cancelAnimationFrame(renderFrameId);}catch(e){}}renderFrameId=0;renderPending=false;}
function restartRenderEngine(){renderShuttingDown=false;renderGeneration++;requestRender();}

const resourceRecords=new WeakMap();
let estimatedResourceBytes=0;
function resourceRecord(o){
  if(!o)return null;
  let r=resourceRecords.get(o);
  if(!r){r={imageBytes:0,textureBytes:0,lastUsed:0};resourceRecords.set(o,r);}
  return r;
}
function estimateImageBytes(img){
  if(!img)return 0;
  const w=Number(img.naturalWidth||img.width||0),h=Number(img.naturalHeight||img.height||0);
  if(!w||!h||!Number.isFinite(w*h))return 0;
  return w*h*4;
}
function touchResource(o){const r=resourceRecord(o);if(r)r.lastUsed=performance.now();}
function registerImageResource(o,img,kind){
  if(!o||!img)return;
  const r=resourceRecord(o);const bytes=estimateImageBytes(img);
  if(kind==='texture'){estimatedResourceBytes-=r.textureBytes;r.textureBytes=bytes;}
  else{estimatedResourceBytes-=r.imageBytes;r.imageBytes=bytes;}
  estimatedResourceBytes=Math.max(0,estimatedResourceBytes+bytes);
  r.lastUsed=performance.now();
}
function releaseManagedImage(obj,kind){
  if(!obj)return;
  const r=resourceRecord(obj);
  if(kind==='texture'){
    estimatedResourceBytes=Math.max(0,estimatedResourceBytes-r.textureBytes);r.textureBytes=0;
    if(obj.textureImg){try{if(typeof obj.textureImg.close==='function')obj.textureImg.close();}catch(e){}try{obj.textureImg.src='';}catch(e){}obj.textureImg=null;}
    clearTextureCache(obj);
  }else{
    estimatedResourceBytes=Math.max(0,estimatedResourceBytes-r.imageBytes);r.imageBytes=0;
    if(obj.img){try{if(typeof obj.img.close==='function')obj.img.close();}catch(e){}try{obj.img.src='';}catch(e){}obj.img=null;}
    clearFadeCache(obj);clearFxCache(obj);
  }
}
function loadManagedImage(obj,kind='image'){
  if(!obj)return;
  const isTexture=kind==='texture';
  const src=isTexture?obj.textureSrc:obj.src;
  if(!src)return;
  const existing=isTexture?obj.textureImg:obj.img;
  if(existing&&existing.complete&&existing.naturalWidth>0){touchResource(obj);return;}
  const key=isTexture?'_textureLoading':'_imageLoading';
  if(obj[key])return;
  obj[key]=true;
  const img=new Image();
  img.decoding='async';
  img.onload=()=>{
    obj[key]=false;
    if(isTexture)obj.textureImg=img;else obj.img=img;
    registerImageResource(obj,img,isTexture?'texture':'image');
    if(isTexture)clearTextureCache(obj);else clearFadeCache(obj);
    requestRender();
  };
  img.onerror=()=>{obj[key]=false;try{img.src='';}catch(e){}requestRender();};
  img.src=src;
}
function clearTextureCache(obj){
  if(!obj)return;
  const c=textureCanvasCache.get(obj);
  if(c&&c.canvas)cleanupCanvas(c.canvas);
  textureCanvasCache.delete(obj);
  imgTexCache.delete(obj);
}
function clearFxCache(obj){
  if(!obj||!obj._fx)return;
  if(obj._fx.canvas)cleanupCanvas(obj._fx.canvas);
  obj._fx=null;
}
function getResourceStats(){return{estimatedBytes:estimatedResourceBytes,estimatedMB:Math.round(estimatedResourceBytes/1048576*10)/10,budgetMB:STUDIO_LIMITS.memoryBudgetBytes/1048576};}


function getSafeImageSize(w, h, maxDim = MAX_IMAGE_WORKING_DIMENSION) {
    w = Math.max(1, Math.round(w || 1));
    h = Math.max(1, Math.round(h || 1));
    const maxSide = Math.max(w, h);
    if (maxSide <= maxDim) {
        return { w, h, scale: 1 };
    }
    const scale = maxDim / maxSide;
    return {
        w: Math.max(1, Math.round(w * scale)),
        h: Math.max(1, Math.round(h * scale)),
        scale
    };
}

function safeCanvasSize(w, h, maxDim = MAX_CANVAS_DIMENSION) {
    w = Math.max(1, Math.round(w));
    h = Math.max(1, Math.round(h));
    const maxSide = Math.max(w, h);
    if (maxSide <= maxDim) {
        return { w, h };
    }
    const scale = maxDim / maxSide;
    return {
        w: Math.max(1, Math.round(w * scale)),
        h: Math.max(1, Math.round(h * scale))
    };
}

function cleanupCanvas(canvas) {
    if (!canvas) return;
    try {
        canvas.width = 1;
        canvas.height = 1;
    } catch (e) {}
}

function canvasToImage(canvas, type = 'image/png', quality = 0.92) {
    return new Promise((resolve, reject) => {
        canvas.toBlob(blob => {
            if (!blob) {
                reject(new Error('Canvas toBlob failed'));
                return;
            }
            const url = URL.createObjectURL(blob);
            const img = new Image();
            img.onload = () => {
                URL.revokeObjectURL(url);
                resolve({ img, blob });
            };
            img.onerror = () => {
                URL.revokeObjectURL(url);
                reject(new Error('Image load failed'));
            };
            img.src = url;
        }, type, quality);
    });
}

function releaseObjectImages(obj){
  if(!obj)return;
  releaseManagedImage(obj,'image');
  releaseManagedImage(obj,'texture');
  obj._imageLoading=false;
  obj._textureLoading=false;
}

const fadeCache = new WeakMap();
const imgTexCache = new WeakMap();

function getFadeCache(obj, w, h) {
    let cache = fadeCache.get(obj);
    if (!cache || cache.w !== w || cache.h !== h) {
        if (cache) {
            cleanupCanvas(cache.imageCanvas);
            cleanupCanvas(cache.maskCanvas);
        }
        cache = {
            w,
            h,
            imageCanvas: document.createElement('canvas'),
            maskCanvas: document.createElement('canvas')
        };
        cache.imageCanvas.width = w;
        cache.imageCanvas.height = h;
        cache.maskCanvas.width = w;
        cache.maskCanvas.height = h;
        fadeCache.set(obj, cache);
    }
    return cache;
}


function clearFadeCache(obj) {
    if (!obj) return;
    const cache = fadeCache.get(obj);
    if (cache) {
        cleanupCanvas(cache.imageCanvas);
        cleanupCanvas(cache.maskCanvas);
        fadeCache.delete(obj);
    }
    imgTexCache.delete(obj);
}

function clearAllFadeCaches(){if(Array.isArray(objects))objects.forEach(o=>clearFadeCache(o));}

function safeSaveEditorState(state) {
    try {
        const json = JSON.stringify(state);
        const MAX_STATE_CHARS = 1000000;
        if (json.length > MAX_STATE_CHARS) {
            console.warn('Editor state too large:', json.length);
            return false;
        }
        localStorage.setItem('editorState', json);
        return true;
    } catch (e) {
        console.warn('localStorage save failed:', e);
        return false;
    }
}

const DB_NAME='StudioProFontsDB';
const DB_STORE='customFonts';
let customFontDB=null;
function openCustomFontDB(){
  return new Promise((resolve,reject)=>{
    if(customFontDB){resolve(customFontDB);return;}
    if(!window.indexedDB){resolve(null);return;}
    const req=indexedDB.open(DB_NAME,1);
    req.onupgradeneeded=e=>{const db=e.target.result;if(!db.objectStoreNames.contains(DB_STORE)){db.createObjectStore(DB_STORE,{keyPath:'id'});}};
    req.onsuccess=e=>{customFontDB=e.target.result;resolve(customFontDB);};
    req.onerror=e=>{console.warn('IDB error',e);resolve(null);};
  });
}
async function saveCustomFontToDB(id,data,label,group){
  const db=await openCustomFontDB();
  if(!db){toast('⚠️ التخزين غير متاح');return false;}
  return new Promise(resolve=>{
    try{
      const tx=db.transaction(DB_STORE,'readwrite');
      const store=tx.objectStore(DB_STORE);
      store.put({id,data,label,group,timestamp:Date.now()});
      tx.oncomplete=()=>{resolve(true);};
      tx.onerror=()=>{resolve(false);};
    }catch(e){resolve(false);}
  });
}
async function getAllCustomFontsFromDB(){
  const db=await openCustomFontDB();
  if(!db)return [];
  return new Promise(resolve=>{
    try{
      const tx=db.transaction(DB_STORE,'readonly');
      const store=tx.objectStore(DB_STORE);
      const req=store.getAll();
      req.onsuccess=()=>resolve(req.result||[]);
      req.onerror=()=>resolve([]);
    }catch(e){resolve([]);}
  });
}
async function deleteCustomFontFromDB(id){
  const db=await openCustomFontDB();
  if(!db)return;
  try{
    const tx=db.transaction(DB_STORE,'readwrite');
    tx.objectStore(DB_STORE).delete(id);
  }catch(e){}
}

function bridgeList(dir){
  try{
    if(window.AssetBridge&&AssetBridge.listFiles){const r=JSON.parse(AssetBridge.listFiles(dir)||'[]');if(r.length)return r;}
    if(window.SketchwareInterface&&SketchwareInterface.listFiles){const r=JSON.parse(SketchwareInterface.listFiles(dir)||'[]');if(r.length)return r;}
  }catch(e){}return null;
}
function fontRenders(fam){
  try{const c=document.createElement('canvas');c.width=300;c.height=60;const x=c.getContext('2d');x.font='30px sans-serif';const wBase=x.measureText('محمدمحمد').width;x.font='30px '+fam;return Math.abs(x.measureText('محمدمحمد').width-wBase)>0.5;}catch(e){return true;}
}
async function loadFontEntry(e,trusted){
  for(const f of e.files){const u=ASSETS+encPath(e.folder+'/'+f);try{const ff=new FontFace(e.fam,'url("'+u+'")');await ff.load();document.fonts.add(ff);if(trusted||fontRenders(e.fam))return true;document.fonts.delete(ff);}catch(err){}}
  return false;
}
async function loadFontFromArrayBuffer(fam,arrayBuffer){
  try{
    const blob=new Blob([arrayBuffer],{type:'font/ttf'});
    const url=URL.createObjectURL(blob);
    const ff=new FontFace(fam,'url("'+url+'")');
    await ff.load();
    document.fonts.add(ff);
    const isColor = detectColorFont(fam);
    return { ok: true, isColorFont: isColor };
  }catch(e1){
    console.warn('Blob font load failed', e1);
    try{
      const dataUrl=await new Promise((resolve,reject)=>{
        const reader=new FileReader();
        reader.onload=()=>resolve(reader.result);
        reader.onerror=reject;
        reader.readAsDataURL(new Blob([arrayBuffer],{type:'font/ttf'}));
      });
      const ff2=new FontFace(fam,'url("'+dataUrl+'")');
      await ff2.load();
      document.fonts.add(ff2);
      const isColor = detectColorFont(fam);
      return { ok: true, isColorFont: isColor };
    }catch(e2){
      console.warn('DataURL font load failed', e2);
      try{
        const dataUrl2=await new Promise((resolve,reject)=>{
          const reader=new FileReader();
          reader.onload=()=>resolve(reader.result);
          reader.onerror=reject;
          reader.readAsDataURL(new Blob([arrayBuffer],{type:'font/ttf'}));
        });
        const style=document.createElement('style');
        style.textContent=`@font-face{font-family:'${fam}';src:url('${dataUrl2}') format('truetype');}`;
        document.head.appendChild(style);
        await document.fonts.load('30px '+fam);
        const isColor = detectColorFont(fam);
        return { ok: true, isColorFont: isColor };
      }catch(e3){
        console.warn('Manual @font-face failed', e3);
        return { ok: false, isColorFont: false };
      }
    }
  }
}

function detectColorFont(fam) {
  try {
    const testCanvas = document.createElement('canvas');
    testCanvas.width = 100;
    testCanvas.height = 100;
    const testCtx = testCanvas.getContext('2d');
    testCtx.font = '80px ' + fam + ', sans-serif';
    testCtx.textAlign = 'center';
    testCtx.textBaseline = 'middle';
    testCtx.fillStyle = '#000000';
    testCtx.fillText('A', 50, 50);
    const data = testCtx.getImageData(0, 0, 100, 100).data;
    let colors = new Set();
    for (let i = 0; i < data.length; i += 4) {
      if (data[i+3] > 0) {
        const key = `${data[i]},${data[i+1]},${data[i+2]}`;
        colors.add(key);
        if (colors.size > 3) return true;
      }
    }
    return false;
  } catch(e) {
    return false;
  }
}

function loadToolXHR(path){
  return new Promise((resolve)=>{const xhr=new XMLHttpRequest();xhr.open('GET',path,true);try{xhr.overrideMimeType('text/plain');}catch(e){}xhr.onload=function(){if((xhr.status===200||xhr.status===0)&&xhr.responseText&&xhr.responseText.length>20)resolve(xhr.responseText);else resolve(null);};xhr.onerror=()=>resolve(null);xhr.onabort=()=>resolve(null);try{xhr.send();}catch(e){resolve(null);}});
}
const BASE_TOOLS=[
 {id:'text',label:'نص',ico:'i-text'},{id:'color',label:'لون',ico:'i-color'},{id:'gradient',label:'تدرج',ico:'i-gradient'},
 {id:'stroke',label:'حدود',ico:'i-stroke'},{id:'shadow',label:'ظل',ico:'i-shadow'},{id:'opacity',label:'شفافية',ico:'i-opacity'},
 {id:'shapes',label:'أشكال',ico:'i-shapes'},{id:'bgremove',label:'ممحاة',ico:'i-eraser'},{id:'layers',label:'طبقات',ico:'i-layers'},
 {id:'effects',label:'تأثيرات',ico:'i-effects'},{id:'outline',label:'إطار',ico:'i-outline'},{id:'texture',label:'تلبيس',ico:'i-texture'},
 {id:'move',label:'تحريك',ico:'i-move'},
];
const TOOL_LABELS={text:'نص',color:'لون',gradient:'تدرج',effects:'تأثيرات',stroke:'حدود',shadow:'ظل',opacity:'شفافية',shapes:'أشكال',outline:'إطار',layers:'طبقات',texture:'تلبيس',bgremove:'ممحاة',move:'تحريك',crop:'قص'};
const TOOL_ICONS={text:'i-text',color:'i-color',gradient:'i-gradient',effects:'i-effects',stroke:'i-stroke',shadow:'i-shadow',opacity:'i-opacity',shapes:'i-shapes',outline:'i-outline',layers:'i-layers',texture:'i-texture',bgremove:'i-eraser',move:'i-move',crop:'i-crop'};
let tools=[...BASE_TOOLS];

async function discoverToolFiles(){
  const files=bridgeList(TOOL_DIR);
  if(files&&files.length){files.forEach(f=>{const m=f.match(/^(.+)\.html$/i);if(m){const id=m[1].toLowerCase();if(!tools.find(t=>t.id===id))tools.push({id,label:TOOL_LABELS[id]||id,ico:TOOL_ICONS[id]||'i-shapes'});}});}
  else{['text','color','gradient','effects','stroke','shadow','opacity','shapes','outline','layers','texture','bgremove','move','crop'].forEach(id=>{if(!tools.find(t=>t.id===id))tools.push({id,label:TOOL_LABELS[id]||id,ico:TOOL_ICONS[id]||'i-shapes'});});}
}

async function loadCustomFontsFromStorage(){
  const entries=await getAllCustomFontsFromDB();
  for(const entry of entries){
    if(!entry||!entry.data||!entry.label)continue;
    const fam='CUSTOM_'+entry.id;
    const result = await loadFontFromArrayBuffer(fam,entry.data);
    if(result.ok){
      FONTS[fam]={fam,label:entry.label,group:entry.group,customId:entry.id,isColorFont:result.isColorFont};
    }
  }
}

async function bootFonts(){
  const jobs=[];
  const fl=bridgeList(FONTS_DIR);
  if(fl)fl.forEach(f=>{if(/\.(ttf|otf)$/i.test(f))jobs.push({fam:'F_'+slug(f),label:f.replace(/\.(ttf|otf)$/i,''),group:'text',folder:FONTS_DIR,files:[f],trusted:true});});
  else TEXT_FONTS.forEach(a=>jobs.push({fam:a[0],label:a[1],group:'text',folder:FONTS_DIR,files:[a[2]],trusted:true}));
  const ml=bridgeList(MANU_DIR);
  if(ml)ml.forEach(f=>{if(/\.(ttf|otf)$/i.test(f))jobs.push({fam:'M_'+slug(f),label:f.replace(/\.(ttf|otf)$/i,''),group:'manu',folder:MANU_DIR,files:[f],trusted:true});});
  else MANU_REG.forEach((e,i)=>jobs.push(Object.assign({},e,{fam:'M_'+i,folder:MANU_DIR,group:'manu',trusted:true})));
  const zl=bridgeList(ZAKH_DIR);
  if(zl)zl.forEach(f=>{if(/\.(ttf|otf)$/i.test(f))jobs.push({fam:'Z_'+slug(f),label:f.replace(/\.(ttf|otf)$/i,''),group:'zakh',folder:ZAKH_DIR,files:[f],trusted:true});});
  else ZAKH_REG.forEach((e,i)=>jobs.push(Object.assign({},e,{fam:'Z_'+i,folder:ZAKH_DIR,group:'zakh',trusted:true})));
  await Promise.all(jobs.map(async e=>{if(await loadFontEntry(e,e.trusted))FONTS[e.fam]={fam:e.fam,label:e.label,group:e.group};}));
  await loadCustomFontsFromStorage();
  renderDrawerFonts();renderChips();draw();
  try{if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>{renderDrawerFonts();renderChips();draw();});}catch(e){}
}
function toast(m){let t=document.querySelector('.toast');if(t)t.remove();t=document.createElement('div');t.className='toast';t.textContent=m;document.body.appendChild(t);setTimeout(()=>t.classList.add('show'),10);setTimeout(()=>{t.classList.remove('show');setTimeout(()=>t.remove(),320)},2400);}

const canvas=document.getElementById('c');const ctx=canvas.getContext('2d');
const bgCanvas=document.getElementById('bgCanvas');
const bgCtx=bgCanvas.getContext('2d');
let bgDirty=true;
let objects=[],selectedId=null,isDragging=false,dragOff={x:0,y:0},history=[],hIndex=-1;
let saveDebounceTimer;

function trimImages(){
  if(!Array.isArray(objects))return;
  const candidates=[];
  for(const o of objects){
    if(!o||o.type!=='img'||o.id===selectedId||!o.img)continue;
    const r=resourceRecord(o);candidates.push({o,last:r?r.lastUsed:0});
  }
  candidates.sort((a,b)=>a.last-b.last);
  let i=0;
  while(estimatedResourceBytes>STUDIO_LIMITS.memoryBudgetBytes&&i<candidates.length){
    releaseManagedImage(candidates[i].o,'image');i++;
  }
}

function getHistoryObjectsForMemory(){
  return objects.map(o=>{
    const copy = {...o};
    delete copy.img;
    delete copy.textureImg;
    return copy;
  });
}

function getHistoryObjectsForStorage(){
  return objects.map(o=>{
    const copy = {...o};
    delete copy.img;
    delete copy.textureImg;
    return copy;
  });
}
function syncAR(){
  document.getElementById('preview').style.setProperty('--ar',canvas.width+'/'+canvas.height);
  /* 🏔️ مزامنة bgCanvas مع canvas الطبقات */
  if(bgCanvas.width !== canvas.width || bgCanvas.height !== canvas.height){
    bgCanvas.width = canvas.width;
    bgCanvas.height = canvas.height;
    bgDirty = true;
  }
}

let zoomLevel = 1;
let panX = 0, panY = 0;
let pointers = new Map();
let isPinching = false;
let pinchStartDist = 0;
let pinchStartZoom = 1;
let pinchStartPanX = 0, pinchStartPanY = 0;
let pinchStartMidX = 0, pinchStartMidY = 0;

const preview = document.getElementById('preview');
const zoomResetBtn = document.getElementById('zoomResetBtn');

function updateCanvasTransform(){
  /* 🏔️ اللوحة ثابتة تماماً — لا انزلاق ولا تكبير أثناء العمل */
  canvas.style.transform = 'none';
  zoomResetBtn.classList.remove('show');
}

function resetZoom(){
  zoomLevel = 1;
  panX = 0;
  panY = 0;
  updateCanvasTransform();
}

zoomResetBtn.addEventListener('click', resetZoom);

function zoomAt(clientX, clientY, newZoom){
  /* 🏔️ معطل للحفاظ على ثبات اللوحة والخلفية */
}

preview.addEventListener('wheel', (e)=>{
  e.preventDefault();
  const delta = -e.deltaY;
  const factor = delta > 0 ? 1.1 : 1/1.1;
  const newZoom = Math.min(5, Math.max(0.2, zoomLevel * factor));
  zoomAt(e.clientX, e.clientY, newZoom);
}, {passive:false});

preview.addEventListener('pointerdown', (e)=>{
  pointers.set(e.pointerId, {x:e.clientX, y:e.clientY});
  if(pointers.size === 2){
    isPinching = true;
    const pts = Array.from(pointers.values());
    pinchStartDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
    pinchStartZoom = zoomLevel;
    pinchStartPanX = panX;
    pinchStartPanY = panY;
    pinchStartMidX = (pts[0].x + pts[1].x) / 2;
    pinchStartMidY = (pts[0].y + pts[1].y) / 2;
    e.preventDefault();
  }
});

preview.addEventListener('pointermove', (e)=>{
  if(!pointers.has(e.pointerId)) return;
  pointers.set(e.pointerId, {x:e.clientX, y:e.clientY});
  if(isPinching && pointers.size >= 2){
    const pts = Array.from(pointers.values());
    const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
    const newZoom = Math.min(5, Math.max(0.2, pinchStartZoom * (dist / pinchStartDist)));
    const midX = (pts[0].x + pts[1].x) / 2;
    const midY = (pts[0].y + pts[1].y) / 2;
    const rect = preview.getBoundingClientRect();
    const px = midX - rect.left;
    const py = midY - rect.top;
    const canvasX = (px - pinchStartPanX) / pinchStartZoom;
    const canvasY = (py - pinchStartPanY) / pinchStartZoom;
    panX = px - canvasX * newZoom;
    panY = py - canvasY * newZoom;
    zoomLevel = newZoom;
    updateCanvasTransform();
    e.preventDefault();
  }
});

preview.addEventListener('pointerup', (e)=>{
  pointers.delete(e.pointerId);
  if(pointers.size < 2){
    isPinching = false;
  }
});

preview.addEventListener('pointercancel', (e)=>{
  pointers.delete(e.pointerId);
  if(pointers.size < 2) isPinching = false;
});

function fitPreview(){
  const wrap=document.getElementById('canvasWrap');const pv=document.getElementById('preview');
  const padW=16,padH=16;
  const availW=Math.max(120,wrap.clientWidth-padW);
  const availH=Math.max(180,wrap.clientHeight-padH);
  const ratio=canvas.width/canvas.height;
  let w=availW,h=w/ratio;
  if(h>availH){h=availH;w=h*ratio;}
  pv.style.width=Math.round(w)+'px';pv.style.height=Math.round(h)+'px';
  resetZoom();
}
window.addEventListener('resize',fitPreview);window.addEventListener('orientationchange',()=>setTimeout(fitPreview,100));

function persistStateNow(){
  try{
    const forStorage = getHistoryObjectsForStorage();
    const json = JSON.stringify({
      objects: forStorage,
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
      savedAt: Date.now(),
      hIndex,
      version: 2
    });
    if(json.length < 1000000){
      localStorage.setItem('editorState', json);
      return true;
    } else {
      console.warn('[save] state too large:', json.length);
      return false;
    }
  }catch(e){ 
    console.warn('[save] localStorage failed:', e);
    return false;
  }
}

function persistStateNow(){
  try{
    const forStorage = getHistoryObjectsForStorage();
    const json = JSON.stringify({
      objects: forStorage,
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
      savedAt: Date.now(),
      hIndex,
      version: 2
    });
    if(json.length < 1000000){
      localStorage.setItem('editorState', json);
      return true;
    } else {
      console.warn('[save] state too large:', json.length);
      return false;
    }
  }catch(e){ 
    console.warn('[save] localStorage failed:', e);
    return false;
  }
}
function saveHist(){
  const forMemory = getHistoryObjectsForMemory();
  const snap = JSON.stringify(forMemory);
  if(hIndex < history.length - 1) history = history.slice(0, hIndex + 1);
  history.push(snap); hIndex++;
  if(history.length > MAX_HISTORY){ history.shift(); hIndex--; }

  persistStateNow(); // حفظ فوري

  clearTimeout(saveDebounceTimer);
  saveDebounceTimer = setTimeout(()=>{
    persistStateNow(); // حفظ إضافي بعد التأخير
  }, 800);
}

/* 🖼️ تحميل صورة بوعد (مع مهلة أمان) */
function loadImagePromise(src){
  return new Promise(res=>{
    if(!src){res(null);return;}
    const img=new Image();
    let done=false;
    const t=setTimeout(()=>{if(!done){done=true;res(null);}},6000);
    img.onload=()=>{if(!done){done=true;clearTimeout(t);res(img);}};
    img.onerror=()=>{if(!done){done=true;clearTimeout(t);res(null);}};
    img.src=src;
  });
}

/* 🗂️ استعادة شاملة ومضمونة */
async function restore(snap){
  let parsed;
  try{ parsed=JSON.parse(snap); }catch(e){ objects=[];selectedId=null;draw();return; }
  if(!Array.isArray(parsed)||!parsed.length){ objects=[];selectedId=null;draw();return; }

  /* 🧹 تنظيف القديم */
  objects.forEach(o=>{ try{releaseObjectImages(o);}catch(e){} });
  clearAllFadeCaches();

  const newObjs=parsed.map(o=>{ const c={...o}; delete c.img; delete c.textureImg; return c; });

  /* ⏳ تحميل كل الصور قبل الرسم */
  await Promise.all(newObjs.map(async o=>{
    if(o.src){ o.img=await loadImagePromise(o.src); if(o.img)try{registerImageResource(o,o.img,'image');}catch(e){} }
    if(o.textureSrc){ o.textureImg=await loadImagePromise(o.textureSrc); if(o.textureImg)try{registerImageResource(o,o.textureImg,'texture');}catch(e){} }
  }));

  objects=newObjs;
  if(selectedId && !objects.find(x=>x.id===selectedId)) selectedId=null;
  bgDirty=true;
  draw();
}

function undo(){if(hIndex>0){hIndex--;restore(history[hIndex]);}else toast('لا يوجد أقدم');}
function redo(){if(hIndex<history.length-1){hIndex++;restore(history[hIndex]);}else toast('لا يوجد أحدث');}

function initDefault(){
  objects=[{id:'bg',type:'bg',bg:['#141c2c','#0a0f1a'],isImage:false},
  {id:'t_'+Date.now(),type:'text',x:canvas.width/2,y:canvas.height/2,text:'بسم الله',font:'Suls',color:'#ffffff',size:70,scale:1,opacity:1,rot:0,shadow:{enabled:false}}];
  bgDirty = true;
  syncAR();saveHist();draw();
}



function buildGradient(g,o,cx,cy,size){
  if(!o.gradient||!o.gradient.colors||o.gradient.colors.length<2)return null;
  const gr=o.gradient;const colors=gr.colors;let gradient;
  if(gr.type==='radial')gradient=g.createRadialGradient(cx,cy,0,cx,cy,size);
  else if(gr.type==='conic')gradient=g.createLinearGradient(cx-size,cy-size,cx+size,cy+size);
  else{const angle=gr.angle!==undefined?gr.angle:45;const rad=(angle-90)*Math.PI/180;gradient=g.createLinearGradient(cx-Math.cos(rad)*size,cy-Math.sin(rad)*size,cx+Math.cos(rad)*size,cy+Math.sin(rad)*size);}
  colors.forEach((c,i)=>{if(typeof c==='object'&&c.c!==undefined)gradient.addColorStop(Math.max(0,Math.min(1,(c.s||0)/100)),c.c);else gradient.addColorStop(colors.length===1?0:i/(colors.length-1),c);});
  return gradient;
}
function applyShadow(g,o){if(o.shadow&&o.shadow.enabled!==false){const sh=o.shadow;g.shadowColor=sh.color||'#000';g.shadowBlur=sh.blur!==undefined?sh.blur:8;g.shadowOffsetX=sh.x!==undefined?sh.x:2;g.shadowOffsetY=sh.y!==undefined?sh.y:2;}}
function applyGlow(g,o){if(o.glow&&o.glow.enabled){const gl=o.glow;g.shadowColor=gl.color||'#00ffff';g.shadowBlur=gl.blur||15;g.shadowOffsetX=0;g.shadowOffsetY=0;}}
const textureCanvasCache=new WeakMap();
const texturePatternCaches=new WeakMap();
function textureCacheKey(o,tw,th){const img=o&&o.textureImg;return [Math.round(tw),Math.round(th),img?img.naturalWidth:0,img?img.naturalHeight:0,o.textureSrc||'',o.textureScale||1,o.textureX||0,o.textureY||0,o.textureRot||0].join('|');}
function makeTextureFill(g,o,tw,th){
  if(!o||!o.textureImg)return null;
  tw=Math.max(1,Math.round(tw));th=Math.max(1,Math.round(th));
  const key=textureCacheKey(o,tw,th);let c=textureCanvasCache.get(o);
  if(c&&c.key===key&&c.canvas){touchResource(o);return c.canvas;}
  if(c&&c.canvas)cleanupCanvas(c.canvas);
  const oc=document.createElement('canvas');oc.width=tw;oc.height=th;const x=oc.getContext('2d');const img=o.textureImg;const iw=img.naturalWidth||tw,ih=img.naturalHeight||th;const sc=Math.max(.01,Number(o.textureScale)||1);const cover=Math.max(tw/iw,th/ih)*sc;const dw=iw*cover,dh=ih*cover;x.save();x.translate(tw/2+(o.textureX||0),th/2+(o.textureY||0));if(o.textureRot)x.rotate(o.textureRot);x.drawImage(img,-dw/2,-dh/2,dw,dh);x.restore();textureCanvasCache.set(o,{key,canvas:oc});touchResource(o);return oc;
}
function getTexturePattern(g,o,tw,th){const oc=makeTextureFill(g,o,tw,th);if(!oc)return null;let wm=texturePatternCaches.get(g);if(!wm){wm=new WeakMap();texturePatternCaches.set(g,wm);}const key=textureCacheKey(o,tw,th);const old=wm.get(o);if(old&&old.key===key)return old.pattern;let pattern=null;try{pattern=g.createPattern(oc,'no-repeat');}catch(e){}if(pattern)wm.set(o,{key,pattern});return pattern;}

function roundRectPath(ctx,x,y,w,h,r){r=Math.min(r,Math.min(w,h)/2);ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.quadraticCurveTo(x+w,y,x+w,y+r);ctx.lineTo(x+w,y+h-r);ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);ctx.lineTo(x+r,y+h);ctx.quadraticCurveTo(x,y+h,x,y+h-r);ctx.lineTo(x,y+r);ctx.quadraticCurveTo(x,y,x+r,y);ctx.closePath();}
function starPath(ctx,cx,cy,outer,inner,points){ctx.beginPath();for(let i=0;i<points*2;i++){const r=i%2===0?outer:inner;const a=(i/(points*2))*Math.PI*2-Math.PI/2;const x=cx+r*Math.cos(a),y=cy+r*Math.sin(a);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.closePath();}
function polygonPath(ctx,cx,cy,r,sides){ctx.beginPath();for(let i=0;i<sides;i++){const a=(i/sides)*Math.PI*2-Math.PI/2;const x=cx+r*Math.cos(a),y=cy+r*Math.sin(a);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.closePath();}
function heartPath(ctx,cx,cy,s){ctx.beginPath();const topY=cy-s*.3;ctx.moveTo(cx,cy+s*.35);ctx.bezierCurveTo(cx+s*.5,cy,cx+s*.5,topY,cx,topY+s*.15);ctx.bezierCurveTo(cx-s*.5,topY,cx-s*.5,cy,cx,cy+s*.35);ctx.closePath();}
function arrowPath(ctx,cx,cy,s){ctx.beginPath();ctx.moveTo(cx+s*.4,cy);ctx.lineTo(cx+s*.1,cy-s*.25);ctx.lineTo(cx+s*.1,cy-s*.12);ctx.lineTo(cx-s*.4,cy-s*.12);ctx.lineTo(cx-s*.4,cy+s*.12);ctx.lineTo(cx+s*.1,cy+s*.12);ctx.lineTo(cx+s*.1,cy+s*.25);ctx.closePath();}
function crossPath(ctx,cx,cy,s){const t=s*.2;ctx.beginPath();ctx.moveTo(cx-t,cy-s/2);ctx.lineTo(cx+t,cy-s/2);ctx.lineTo(cx+t,cy-t);ctx.lineTo(cx+s/2,cy-t);ctx.lineTo(cx+s/2,cy+t);ctx.lineTo(cx+t,cy+t);ctx.lineTo(cx+t,cy+s/2);ctx.lineTo(cx-t,cy+s/2);ctx.lineTo(cx-t,cy+t);ctx.lineTo(cx-s/2,cy+t);ctx.lineTo(cx-s/2,cy-t);ctx.lineTo(cx-t,cy-t);ctx.closePath();}
function crescentPath(ctx,cx,cy,r){ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.arc(cx+r*.4,cy,r*.8,0,Math.PI*2,true);}
function sunPath(ctx,cx,cy,r){ctx.beginPath();ctx.arc(cx,cy,r*.5,0,Math.PI*2);for(let i=0;i<12;i++){const a=(i/12)*Math.PI*2;ctx.moveTo(cx+Math.cos(a)*r*.6,cy+Math.sin(a)*r*.6);ctx.lineTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r);}}
function dropPath(ctx,cx,cy,s){ctx.beginPath();ctx.moveTo(cx,cy-s/2);ctx.bezierCurveTo(cx+s*.4,cy-s*.1,cx+s*.4,cy+s*.3,cx,cy+s/2);ctx.bezierCurveTo(cx-s*.4,cy+s*.3,cx-s*.4,cy-s*.1,cx,cy-s/2);ctx.closePath();}
function leafPath(ctx,cx,cy,s){ctx.beginPath();ctx.moveTo(cx-s*.4,cy+s*.3);ctx.bezierCurveTo(cx-s*.4,cy-s*.3,cx+s*.4,cy-s*.3,cx+s*.4,cy-s*.3);ctx.bezierCurveTo(cx+s*.4,cy+s*.3,cx-s*.4,cy+s*.3,cx-s*.4,cy+s*.3);ctx.closePath();}
function gearPath(ctx,cx,cy,r,teeth){ctx.beginPath();for(let i=0;i<teeth*2;i++){const rad=i%2===0?r:r*.75;const a=(i/(teeth*2))*Math.PI*2;const x=cx+rad*Math.cos(a),y=cy+rad*Math.sin(a);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.closePath();}
function gemPath(ctx,cx,cy,s){ctx.beginPath();ctx.moveTo(cx-s*.3,cy-s*.2);ctx.lineTo(cx+s*.3,cy-s*.2);ctx.lineTo(cx+s*.4,cy);ctx.lineTo(cx,cy+s*.4);ctx.lineTo(cx-s*.4,cy);ctx.closePath();}
function badgePath(ctx,cx,cy,r,teeth){ctx.beginPath();for(let i=0;i<teeth*2;i++){const rad=i%2===0?r:r*.85;const a=(i/(teeth*2))*Math.PI*2-Math.PI/2;const x=cx+rad*Math.cos(a),y=cy+rad*Math.sin(a);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.closePath();}
function buildShapePath(g,o,w,h){
  g.beginPath();const st=o.shapeType||'rect';
  if(st==='circle')g.arc(0,0,w/2,0,Math.PI*2);
  else if(st==='roundrect')roundRectPath(g,-w/2,-h/2,w,h,o.radius||20);
  else if(st==='triangle'){g.moveTo(0,-h/2);g.lineTo(w/2,h/2);g.lineTo(-w/2,h/2);g.closePath();}
  else if(st==='diamond'){g.moveTo(0,-h/2);g.lineTo(w/2,0);g.lineTo(0,h/2);g.lineTo(-w/2,0);g.closePath();}
  else if(st==='oval')g.ellipse(0,0,w/2,h/2,0,0,Math.PI*2);
  else if(st==='star')starPath(g,0,0,w/2,w/4,o.points||5);
  else if(st==='heart')heartPath(g,0,0,w);
  else if(st==='hexagon')polygonPath(g,0,0,w/2,6);
  else if(st==='octagon')polygonPath(g,0,0,w/2,8);
  else if(st==='arrow')arrowPath(g,0,0,w);
  else if(st==='cross')crossPath(g,0,0,w);
  else if(st==='crescent')crescentPath(g,0,0,w/2);
  else if(st==='sun')sunPath(g,0,0,w/2);
  else if(st==='drop')dropPath(g,0,0,w);
  else if(st==='leaf')leafPath(g,0,0,w);
  else if(st==='gear')gearPath(g,0,0,w/2,10);
  else if(st==='gem')gemPath(g,0,0,w);
  else if(st==='badge')badgePath(g,0,0,w/2,12);
  else if(st==='frameRect')g.rect(-w/2,-h/2,w,h);
  else if(st==='frameCircle')g.arc(0,0,w/2,0,Math.PI*2);
  else if(st==='hexStar')starPath(g,0,0,w/2,w/4,6);
  else g.rect(-w/2,-h/2,w,h);
}

function measureTextMultiline(g,o){
  const fontSize=(o.size||70)*(o.scale||1);
  g.save();
  g.font=fontSize+'px '+(o.font||'sans-serif')+', sans-serif';
  const lines=(o.text||'').split('\n');
  const lineHeight=(o.lineHeight||1.5)*fontSize;
  let maxWidth=0;
  lines.forEach(line=>{
    const mm=g.measureText(line||' ');
    const w=Math.abs(mm.actualBoundingBoxLeft||0)+Math.abs(mm.actualBoundingBoxRight||0)||mm.width;
    if(w>maxWidth)maxWidth=w;
  });
  const totalHeight=lines.length*lineHeight;
  g.restore();
  return{width:maxWidth,height:totalHeight,lineHeight:lineHeight,linesCount:lines.length,fontSize:fontSize};
}

function drawTextObj(g,o){
  g.globalAlpha=o.opacity!==undefined?o.opacity:1;
  g.translate(o.x,o.y);
  if(o.rot)g.rotate(o.rot);
  const fontSize=(o.size||70)*(o.scale||1);
  g.font=fontSize+'px '+(o.font||'sans-serif')+', sans-serif';
  g.textBaseline='middle';
  const align=o.align||'center';
  g.textAlign=(align==='left')?'left':(align==='right')?'right':'center';

  const lines=(o.text||'').split('\n');
  const m=measureTextMultiline(g,o);
  const lineHeight=m.lineHeight;
  const startY=-m.height/2+lineHeight/2;
  const padX=m.width*0.05;
  let textX=0;
  if(align==='left')textX=-m.width/2-padX;
  else if(align==='right')textX=m.width/2+padX;
  const renderWidth=m.width+padX*2;
  const renderHeight=m.height+lineHeight*0.4;

  const each=(fn)=>{for(let i=0;i<lines.length;i++)fn(lines[i]||'',textX,startY+i*lineHeight);};

  if(o.outlineWidth&&o.outlineWidth>0){
    g.save();
    g.strokeStyle=o.outlineColor||'#ffffff';
    g.lineWidth=o.outlineWidth*2;
    g.lineJoin='round';g.miterLimit=2;
    if(o.strokeDash&&Array.isArray(o.strokeDash))g.setLineDash(o.strokeDash);
    applyShadow(g,o);
    each((t,x,y)=>g.strokeText(t,x,y));
    g.restore();
  }

  g.save();
  applyShadow(g,o);applyGlow(g,o);
  const grad=buildGradient(g,o,0,0,Math.max(fontSize,m.height/2));
  const fontInfo=FONTS[o.font];
  const isColorFont=(fontInfo&&fontInfo.isColorFont)||o.forceMonochrome;

  if(isColorFont){
    const fillColor=o.color||'#ffffff';
    const tw=Math.max(2,Math.ceil(renderWidth+fontSize*2));
    const th=Math.max(2,Math.ceil(renderHeight+fontSize*2));
    const tempCanvas=document.createElement('canvas');
    tempCanvas.width=tw;tempCanvas.height=th;
    const tempCtx=tempCanvas.getContext('2d');
    tempCtx.font=g.font;
    tempCtx.textAlign=g.textAlign;
    tempCtx.textBaseline='middle';
    tempCtx.fillStyle='#ffffff';
    for(let i=0;i<lines.length;i++)tempCtx.fillText(lines[i]||'',tw/2+textX,th/2+startY+i*lineHeight);
    tempCtx.globalCompositeOperation='source-in';
    tempCtx.fillStyle=fillColor;
    tempCtx.fillRect(0,0,tw,th);
    g.drawImage(tempCanvas,-tw/2,-th/2);
    cleanupCanvas(tempCanvas);
  }
  else if(grad){
    g.fillStyle=grad;
    each((t,x,y)=>g.fillText(t,x,y));
  }
  else if(o.textureImg&&o.textureEnabled&&o.textureImg.complete&&o.textureImg.naturalWidth>0){
    const tw=Math.max(1,renderWidth);
    const th=Math.max(1,renderHeight);
    const pattern=getTexturePattern(g,o,tw,th);
    g.save();g.translate(-tw/2,-th/2);g.fillStyle=pattern;
    if(o.textureBlend&&o.textureBlend!=='source-over')g.globalCompositeOperation=o.textureBlend;
    if(o.textureOpacity!==undefined)g.globalAlpha=g.globalAlpha*o.textureOpacity;
    for(let i=0;i<lines.length;i++)g.fillText(lines[i]||'',tw/2+textX,th/2+startY+i*lineHeight);
    g.restore();
  }
  else{
    g.fillStyle=o.color||'#000';
    if(o.blendMode&&o.blendMode!=='source-over')g.globalCompositeOperation=o.blendMode;
    each((t,x,y)=>g.fillText(t,x,y));
  }
 if(o.stroke&&typeof o.stroke==='string'&&o.stroke.length>2&&o.stroke.length<100&&o.strokeWidth&&o.strokeWidth>0){
    g.save();
    g.shadowColor='transparent';
    g.strokeStyle=o.stroke;g.lineWidth=o.strokeWidth;g.lineJoin=o.strokeJoin||'round';g.miterLimit=o.strokeMiter||2;
    if(o.strokeDash&&Array.isArray(o.strokeDash))g.setLineDash(o.strokeDash);
    each((t,x,y)=>g.strokeText(t,x,y));
    g.restore();
  }
  g.restore();
}

function drawShapeObj(g,o){
  if(o.textureEnabled&&o.textureSrc&&(!o.textureImg||!o.textureImg.complete||!o.textureImg.naturalWidth))loadManagedImage(o,'texture');
  g.globalAlpha=o.opacity!==undefined?o.opacity:1;g.translate(o.x,o.y);if(o.rot)g.rotate(o.rot);const w=(o.w||200)*(o.scale||1);const h=(o.h||200)*(o.scale||1);const isHollow=o.hollow||o.shapeType==='frameRect'||o.shapeType==='frameCircle';
  if(o.outlineWidth&&o.outlineWidth>0&&!isHollow){g.save();const off=o.outlineOffset||10;g.strokeStyle=o.outlineColor||'#ffffff';g.lineWidth=o.outlineWidth*2+off*2;g.lineJoin='round';buildShapePath(g,o,w,h);applyShadow(g,o);g.stroke();g.restore();}
  buildShapePath(g,o,w,h);applyShadow(g,o);applyGlow(g,o);
  if(!isHollow){const grad=buildGradient(g,o,0,0,Math.max(w,h)/2);g.fillStyle=grad?grad:(o.fill||'#ff7a00');g.fill();}
  if(o.textureImg&&o.textureEnabled&&o.textureImg.complete&&o.textureImg.naturalWidth>0&&!isHollow){
    g.save();
    try{
      g.shadowColor='transparent';g.shadowBlur=0;g.shadowOffsetX=0;g.shadowOffsetY=0;
      buildShapePath(g,o,w,h);g.clip();
      if(o.textureBlend&&o.textureBlend!=='source-over')g.globalCompositeOperation=o.textureBlend;
      g.globalAlpha=(o.opacity!==undefined?o.opacity:1)*(o.textureOpacity!==undefined?o.textureOpacity:1);
      g.translate(o.textureX||0,o.textureY||0);
      if(o.textureRot)g.rotate(o.textureRot);
      const sc=o.textureScale||1;
      const iw=o.textureImg.naturalWidth||w,ih=o.textureImg.naturalHeight||h;
      const cover=Math.max(w/iw,h/ih)*sc;
      const dw=iw*cover,dh=ih*cover;
      g.drawImage(o.textureImg,-dw/2,-dh/2,dw,dh);
    }catch(e){}
    g.restore();
  }
  if(o.strokeWidth&&o.strokeWidth>0){buildShapePath(g,o,w,h);g.shadowColor='transparent';g.strokeStyle=o.stroke||o.strokeColor||'#000';g.lineWidth=o.strokeWidth;g.lineJoin=o.lineJoin||'miter';if(o.strokeDash&&Array.isArray(o.strokeDash))g.setLineDash(o.strokeDash);g.stroke();}else if(isHollow){g.shadowColor='transparent';g.strokeStyle=o.stroke||o.strokeColor||o.fill||'#ff7a00';g.lineWidth=o.strokeWidth||4;g.stroke();}
}

/* 🧵 دمج الصورة مع التلبيس داخل حدود الشكل (شفافية PNG - source-atop) */
function getImgTexCanvas(o, w, h){
  w = Math.max(1, Math.round(w));
  h = Math.max(1, Math.round(h));
  const img = o.img;
  const key = [w,h,img?img.naturalWidth:0,img?img.naturalHeight:0,o.textureSrc||'',o.textureScale||1,o.textureX||0,o.textureY||0,o.textureRot||0,(o.textureOpacity!==undefined?o.textureOpacity:1)].join('|');
  let c = imgTexCache.get(o);
  if(c && c.key===key && c.canvas){ return c.canvas; }
  if(c && c.canvas){ cleanupCanvas(c.canvas); }
  const oc = document.createElement('canvas');
  oc.width = w; oc.height = h;
  const ox = oc.getContext('2d');
  ox.drawImage(img, 0, 0, w, h);
  ox.globalCompositeOperation = 'source-atop';
  ox.globalAlpha = (o.textureOpacity !== undefined ? o.textureOpacity : 1);
  ox.save();
  ox.translate(w/2 + (o.textureX||0), h/2 + (o.textureY||0));
  if(o.textureRot) ox.rotate(o.textureRot);
  const sc = o.textureScale || 1;
  const iw = o.textureImg.naturalWidth, ih = o.textureImg.naturalHeight;
  const cover = Math.max(w/iw, h/ih) * sc;
  const dw = iw*cover, dh = ih*cover;
  ox.drawImage(o.textureImg, -dw/2, -dh/2, dw, dh);
  ox.restore();
  imgTexCache.set(o, {key, canvas:oc});
  return oc;
}

function drawImgObj(g, o) {
  if (!o.img || !o.img.complete || o.img.naturalWidth === 0) {
    if(o.src)loadManagedImage(o,'image');
    return;
  }
  const opacity = o.opacity !== undefined ? Math.max(0, Math.min(1, o.opacity)) : 1;
  const w = (o.w || o.naturalW || 200) * (o.scale || 1);
  const h = (o.h || o.naturalH || 200) * (o.scale || 1);
  const hasFade = o.fadeDir && o.fadeDir !== 'none' && Number(o.fade) > 0;
  const hasTex = o.textureImg && o.textureEnabled && o.textureImg.complete && o.textureImg.naturalWidth>0;

  g.save();
  g.translate(o.x, o.y);
  if (o.rot) { g.rotate(o.rot); }
  if (o.shadow && o.shadow.enabled !== false) applyShadow(g, o);
  g.translate(-w / 2, -h / 2);

  if (!hasFade) {
    /* 🎨 تطبيق الفلاتر (brightness/contrast/sepia/etc) على الصورة */
    const filterStr = buildCssFilter(o);
    if(filterStr !== 'none'){
      try{ g.filter = filterStr; }catch(e){}
    }
    
    if (hasTex) {
      /* 🧵 التلبيس يلتزم بحدود الشكل المدمج تماماً (source-atop) */
      const oc = getImgTexCanvas(o, w, h);
      g.globalAlpha = opacity;
      g.drawImage(oc, 0, 0, w, h);
      g.globalAlpha = 1;
} else {
      g.globalAlpha = opacity;
      g.drawImage(o.img, 0, 0, w, h);
      g.globalAlpha = 1;
    }
    try{ g.filter = 'none'; }catch(e){}
    g.restore();
    return;
  }

  drawImageWithProfessionalFade(g, o, w, h, opacity);
  g.restore();
}

function drawImageWithProfessionalFade(ctx, obj, w, h, opacity) {
  if (!obj || !obj.img) return;
  const x = 0;
  const y = 0;
  const fade = Math.max(0, Math.min(100, Number(obj.fade) || 0));
  const soft = Math.max(0, Math.min(100, Number(obj.fadeSoft) || 70));
  const dir = obj.fadeDir || 'none';
  const center = Math.max(10, Math.min(90, Number(obj.fadeCenter) || 55));

  if (dir === 'none' || fade <= 0) {
    ctx.globalAlpha = opacity;
    ctx.drawImage(obj.img, x, y, w, h);
    ctx.globalAlpha = 1;
    return;
  }

  const cache = getFadeCache(obj, w, h);
  const imageCanvas = cache.imageCanvas;
  const maskCanvas = cache.maskCanvas;
  const imageCtx = imageCanvas.getContext('2d');
  const maskCtx = maskCanvas.getContext('2d');

  imageCtx.clearRect(0, 0, w, h);
  maskCtx.clearRect(0, 0, w, h);
  imageCtx.drawImage(obj.img, 0, 0, w, h);

  const fadeVal = fade / 100;
  const centerAlpha = 0.6 + (center / 100) * 0.3; 

  if (dir === 'radial' || dir === 'portrait') {
    const cx = w * 0.5;
    const cy = h * 0.5;
    const maxR = Math.max(w, h) * 0.65;
    const outerR = maxR * (1.2 - fadeVal * 0.6);

    const gradient = maskCtx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(10, outerR));
    gradient.addColorStop(0, `rgba(255,255,255,${centerAlpha})`);
    gradient.addColorStop(0.4, `rgba(255,255,255,${centerAlpha * 0.6})`);
    gradient.addColorStop(0.75, `rgba(255,255,255,${centerAlpha * 0.2})`);
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    maskCtx.fillStyle = gradient;
    maskCtx.fillRect(0, 0, w, h);

  } else if (dir === 'all') {
    const maxR = Math.sqrt((w/2)*(w/2) + (h/2)*(h/2));
    const outerR = maxR * (1.1 - fadeVal * 0.5);

    const gradient = maskCtx.createRadialGradient(w/2, h/2, 5, w/2, h/2, Math.max(10, outerR));
    gradient.addColorStop(0, `rgba(255,255,255,${centerAlpha})`);
    gradient.addColorStop(0.35, `rgba(255,255,255,${centerAlpha * 0.65})`);
    gradient.addColorStop(0.7, `rgba(255,255,255,${centerAlpha * 0.2})`);
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    maskCtx.fillStyle = gradient;
    maskCtx.fillRect(0, 0, w, h);

  } else if (dir === 'right') {
    const spread = 0.2 + fadeVal * 0.7;
    const gradient = maskCtx.createLinearGradient(0, 0, w, 0);
    gradient.addColorStop(0, `rgba(255,255,255,${centerAlpha})`);
    gradient.addColorStop(Math.max(0, 1 - spread), `rgba(255,255,255,${centerAlpha * 0.5})`);
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    maskCtx.fillStyle = gradient;
    maskCtx.fillRect(0, 0, w, h);

  } else if (dir === 'left') {
    const spread = 0.2 + fadeVal * 0.7;
    const gradient = maskCtx.createLinearGradient(0, 0, w, 0);
    gradient.addColorStop(0, 'rgba(255,255,255,0)');
    gradient.addColorStop(Math.min(1, spread), `rgba(255,255,255,${centerAlpha * 0.5})`);
    gradient.addColorStop(1, `rgba(255,255,255,${centerAlpha})`);
    maskCtx.fillStyle = gradient;
    maskCtx.fillRect(0, 0, w, h);

  } else if (dir === 'bottom') {
    const spread = 0.2 + fadeVal * 0.7;
    const gradient = maskCtx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, `rgba(255,255,255,${centerAlpha})`);
    gradient.addColorStop(Math.max(0, 1 - spread), `rgba(255,255,255,${centerAlpha * 0.5})`);
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    maskCtx.fillStyle = gradient;
    maskCtx.fillRect(0, 0, w, h);
  }

  imageCtx.globalCompositeOperation = 'destination-in';
  imageCtx.drawImage(maskCanvas, 0, 0);
  imageCtx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = opacity;
  ctx.drawImage(imageCanvas, x, y, w, h);
  ctx.globalAlpha = 1;
}

function drawBackground(g,bg,W,H){
  if(bg.isImage&&(!bg.img||!bg.img.complete||bg.img.naturalWidth===0)&&bg.src)loadManagedImage(bg,'image');
  if(bg.isImage&&bg.img&&bg.img.complete&&bg.img.naturalWidth>0){
    // 🎨 تطبيق الفلاتر اليدوية على الخلفية
    const filterStr = buildCssFilter(bg);
    g.save();
    if(filterStr !== 'none'){
      try{ g.filter = filterStr; }catch(e){}
    }
    g.drawImage(bg.img,0,0,W,H);
    try{ g.filter = 'none'; }catch(e){}
    g.restore();
    return;
  }
  if(bg.gradient){const grad=buildGradient(g,bg,W/2,H/2,Math.max(W,H)/2);if(grad){g.fillStyle=grad;g.fillRect(0,0,W,H);return;}}
  let gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,bg.bg[0]);gr.addColorStop(1,bg.bg[1]);g.fillStyle=gr;g.fillRect(0,0,W,H);
}

function fxMeasure(g,o){
  if(o.type==='text'){const m=measureTextMultiline(g,o);return{w:m.width,h:m.height};}
  return{w:(o.w||200)*(o.scale||1),h:(o.h||200)*(o.scale||1)};
}

function fxDilate(src,r){
 r = Math.min(r, 64); 
  var cur=src,done=0;
  while(done<r){
    var step=done===0?1:Math.min(r-done,done);
    var n=document.createElement('canvas');n.width=src.width;n.height=src.height;
    var x=n.getContext('2d');
    for(var dx=-step;dx<=step;dx+=step)for(var dy=-step;dy<=step;dy+=step)x.drawImage(cur,dx,dy);
    x.drawImage(cur,0,0);
    cur=n;done+=step;
  }
  return cur;
}
function fxBuild(o,w,h){
  var ow=o.olw|0,off=o.oloff|0,gl=o.glon?{blur:o.glw||15,color:o.glc||'#ffd700'}:null;
  var pad=Math.max(ow?off+ow:0,gl?Math.ceil(gl.blur*1.5):0)+4;
  var W=Math.ceil(w+pad*2),H=Math.ceil(h+pad*2);
  var sil=document.createElement('canvas');sil.width=W;sil.height=H;
  var s=sil.getContext('2d');s.translate(W/2,H/2);
  var c=Object.assign({},o,{x:0,y:0,rot:0,outlineWidth:0,glow:null,shadow:null});
  if(o.type==='text')drawTextObj(s,c);else if(o.type==='shape')drawShapeObj(s,c);else if(o.type==='img')drawImgObj(s,c);else return null;
  var e=document.createElement('canvas');e.width=W;e.height=H;var ex=e.getContext('2d');
  if(gl){ex.save();ex.shadowColor=gl.color;ex.shadowBlur=gl.blur;ex.drawImage(sil,0,0);ex.drawImage(sil,0,0);ex.restore();}
  if(ow){
    var outer=fxDilate(sil,off+ow);
    var ox=outer.getContext('2d');
    ox.globalCompositeOperation='source-in';ox.fillStyle=o.olc||'#ffffff';ox.fillRect(0,0,W,H);
    if(off>0){ox.globalCompositeOperation='destination-out';ox.drawImage(fxDilate(sil,off),0,0);}
    ex.drawImage(outer,0,0);
  }
  return e;
}
function drawObjectFx(g,o){
  if(o.type==='bg')return;
  if(!(o.olw|0)&&!o.glon)return;
  var m=fxMeasure(g,o);
  var key=[m.w,m.h,o.olw,o.oloff,o.olc,o.glon,o.glw,o.glc,o.text,o.font,o.shapeType,o.fill,o.strokeWidth,o.radius,(o.src||'').length].join('|');
  if(!o._fx||o._fx.key!==key){var cv=null;try{cv=fxBuild(o,m.w,m.h);}catch(e){}o._fx={key:key,canvas:cv};}
  if(!o._fx.canvas)return;
  g.save();g.translate(o.x,o.y);if(o.rot)g.rotate(o.rot);
  g.drawImage(o._fx.canvas,-o._fx.canvas.width/2,-o._fx.canvas.height/2);
  g.restore();
}

function drawScene(g,W,H,withSel){
  /* 🎨 مسح + رسم الخلفية داخل اللوحة الرئيسية (تظهر في المعاينة والتأثيرات والحفظ) */
  g.clearRect(0,0,W,H);
  const bg=objects.find(o=>o.type==='bg');
  if(bg) drawBackground(g,bg,W,H);
  
  objects.forEach(o=>{
    if(o.type==='bg')return;
    try{drawObjectFx(g,o);}catch(e){}
    g.save();
    try{
      if(o.type==='text')drawTextObj(g,o);
      else if(o.type==='shape')drawShapeObj(g,o);
      else if(o.type==='img')drawImgObj(g,o);
    }catch(e){}
    g.restore();
    if(withSel&&o.id===selectedId)drawSel(g,o);
  });
}
function draw(){requestRender();}

function drawSel(g,o){
  g.save();g.strokeStyle='#ff7a00';g.lineWidth=2.5;g.setLineDash([7,4]);
  const handleSize=36;
  if(o.type==='text'){
    const m=measureTextMultiline(g,o);
    const w=m.width+18;
    const h=m.height+12;
    g.translate(o.x,o.y);if(o.rot)g.rotate(o.rot);
    g.strokeRect(-w/2,-h/2,w,h);
    g.setLineDash([]);
    g.fillStyle='#ff7a00';
    g.beginPath();
    g.arc(w/2+handleSize/2,h/2+handleSize/2,handleSize/2,0,Math.PI*2);
    g.fill();
    g.strokeStyle='#fff';g.lineWidth=3;g.stroke();
  }
  else{
    g.translate(o.x,o.y);if(o.rot)g.rotate(o.rot);
    const w=(o.w||200)*(o.scale||1);
    const h=(o.h||200)*(o.scale||1);
    g.strokeRect(-w/2-5,-h/2-5,w+10,h+10);
    g.setLineDash([]);
    g.fillStyle='#ff7a00';
    g.beginPath();
    g.arc(w/2+5+handleSize/2,h/2+5+handleSize/2,handleSize/2,0,Math.PI*2);
    g.fill();
    g.strokeStyle='#fff';g.lineWidth=3;g.stroke();
  }
  g.restore();
}

function getAt(x,y){
  for(let i=objects.length-1;i>=0;i--){
    const o=objects[i];if(o.type==='bg')continue;
    let dx=x-o.x,dy=y-o.y;const rot=o.rot||0;
    if(rot){const c=Math.cos(-rot),s=Math.sin(-rot);const nx=dx*c-dy*s;dy=dx*s+dy*c;dx=nx;}
    if(o.type==='text'){
      const m=measureTextMultiline(ctx,o);
      const w=m.width+20,h=m.height+20;
      if(Math.abs(dx)<w/2+15&&Math.abs(dy)<h/2+15)return o;
    }
    else{const w=(o.w||200)*(o.scale||1);const h=(o.h||200)*(o.scale||1);if(Math.abs(dx)<w/2&&Math.abs(dy)<h/2)return o;}
  }
  return null;
}

function isOnResizeHandle(o,p){
  if(!o)return false;
  let dx=p.x-o.x,dy=p.y-o.y;
  if(o.rot){
    const c=Math.cos(-o.rot),s=Math.sin(-o.rot);
    const nx=dx*c-dy*s;
    dy=dx*s+dy*c;
    dx=nx;
  }
  const handleSize=36;
  const handleRadius=handleSize/2+5;
  let cx,cy;
  if(o.type==='text'){
    const m=measureTextMultiline(ctx,o);
    cx=(m.width+18)/2+handleSize/2;
    cy=(m.height+12)/2+handleSize/2;
  }else{
    const w=(o.w||200)*(o.scale||1);
    const h=(o.h||200)*(o.scale||1);
    cx=w/2+5+handleSize/2;
    cy=h/2+5+handleSize/2;
  }
  return Math.hypot(dx-cx,dy-cy)<=handleRadius;
}

function cPos(e){const r=canvas.getBoundingClientRect();const t=e.touches?e.touches[0]:e;const sx=canvas.width/r.width,sy=canvas.height/r.height;return{x:(t.clientX-r.left)*sx,y:(t.clientY-r.top)*sy};}

canvas.addEventListener('pointerdown',e=>{
  if(pointers.size>1) return;
  if(eraserMode&&eraserCanvas){
    const p=cPos(e);
    const ex=(p.x/canvas.width)*eraserCanvas.width;
    const ey=(p.y/canvas.height)*eraserCanvas.height;
    eraserDraw(ex,ey);
    canvas.setPointerCapture(e.pointerId);
    e.preventDefault();
    return;
  }
  const p=cPos(e);
  const selected = objects.find(o => o.id === selectedId);
  if(selected && isOnResizeHandle(selected, p)){
    isResizing = true;
    const startDist = Math.hypot(p.x - selected.x, p.y - selected.y);
    resizeStart = { dist: startDist, scale: selected.scale || 1, size: selected.size || 70, type: selected.type };
    e.preventDefault();
    return;
  }
  const o=getAt(p.x,p.y);
  if(o){selectedId=o.id;isDragging=true;dragOff={x:p.x-o.x,y:p.y-o.y};document.getElementById('contextBar').style.display='flex';draw();fitPreview();}
  else{selectedId=null;document.getElementById('contextBar').style.display='none';draw();fitPreview();}
});

canvas.addEventListener('pointermove',e=>{
  if(eraserMode&&eraserCanvas&&e.buttons>0){
    const p=cPos(e);
    const ex=(p.x/canvas.width)*eraserCanvas.width;
    const ey=(p.y/canvas.height)*eraserCanvas.height;
    eraserDraw(ex,ey);
    e.preventDefault();
    return;
  }
  if(isResizing){
    const p=cPos(e);
    const selected = objects.find(o => o.id === selectedId);
    if(selected){
      const newDist = Math.hypot(p.x - selected.x, p.y - selected.y);
      const factor = newDist / resizeStart.dist;
      let newScale = resizeStart.scale * factor;
      newScale = Math.max(0.05, Math.min(5, newScale));
      selected.scale = newScale;
      draw();
    }
    e.preventDefault();
    return;
  }
  if(!isDragging)return;
  const p=cPos(e);const o=objects.find(o=>o.id===selectedId);
  if(o){o.x=p.x-dragOff.x;o.y=p.y-dragOff.y;draw();}
});

canvas.addEventListener('pointerup',e=>{
  if(eraserMode)return;
  if(isResizing){isResizing=false;saveHist();}
  else if(isDragging){isDragging=false;saveHist();}
});

let isResizing = false;
let resizeStart = {dist:0, scale:1, size:70, type:''};
function doRotate(){const o=objects.find(x=>x.id===selectedId);if(!o)return;o.rot=(o.rot||0)+Math.PI/12;saveHist();draw();toast('↻ تم التدوير');}
function doCrop(){
  const o=objects.find(x=>x.id===selectedId);
  if(!o){toast('اختر عنصراً');return;}
  if(o.type==='img'){o.w=Math.round(o.w*0.7);o.h=Math.round(o.h*0.7);}
  else if(o.type==='text'){o.size=Math.round(o.size*0.8);}
  else if(o.type==='shape'){o.w=Math.round(o.w*0.7);o.h=Math.round(o.h*0.7);}
  else{toast('غير قابل للاقتصاص');return;}
  saveHist();draw();toast('️ تم الاقتصاص');
}
function doDup(){
  const o=objects.find(o=>o.id===selectedId);if(!o)return;
  const c={...o};
  delete c.img; delete c.textureImg;
  c.id='t_'+Date.now();c.x=o.x+30;c.y=o.y+30;
  if(o.src){const img=new Image();img.onload=()=>{c.img=img;registerImageResource(c,img,'image');draw();};img.src=o.src;c.img=img;}
  if(o.textureSrc){const img=new Image();img.onload=()=>{c.textureImg=img;registerImageResource(c,img,'texture');draw();};img.src=o.textureSrc;c.textureImg=img;}
  objects.push(c);selectedId=c.id;saveHist();draw();
}
function doDel(){
  if(selectedId){
    const idx=objects.findIndex(o=>o.id===selectedId);
    if(idx>-1){
      const o = objects[idx];
      clearFadeCache(o);
      clearFxCache(o);
      releaseObjectImages(o);
      objects.splice(idx,1);
    }
    selectedId=null;
    saveHist();
    draw();
  }
}
function openDrawerToFonts(){openDrawer();setTimeout(()=>{const sec=document.getElementById('fontsSec');if(sec){sec.scrollIntoView({behavior:'smooth',block:'center'});sec.classList.add('flash');setTimeout(()=>sec.classList.remove('flash'),1500);}},360);}

function getSelectedWithBackground(){
  if(selectedId){
    const selected = objects.find(o => o.id === selectedId);
    if(selected) return selected;
  }
  return objects.find(o => o.type === 'bg') || null;
}

function renderSubset(g,W,H,subset,scale){
  g.clearRect(0,0,W,H);
  if(scale&&scale!==1)g.scale(scale,scale);
  subset.forEach(function(o){
    if(o.type==='bg')return;
    g.save();
    try{
      if(o.type==='text')drawTextObj(g,o);
      else if(o.type==='shape')drawShapeObj(g,o);
      else if(o.type==='img')drawImgObj(g,o);
    }catch(e){}
    g.restore();
  });
}
function mergeLayers(ids){
  try{
    if(!Array.isArray(ids)||ids.length<2)return false;
    var subset=objects.filter(function(o){return ids.indexOf(o.id)>-1&&o.type!=='bg';});
    if(subset.length<2){toast('⚠️ اختر طبقتين على الأقل للدمج');return false;}
    var W=canvas.width,H=canvas.height;
    var s=Math.min(1,2048/Math.max(W,H));
    var addBytes=Math.round(W*s)*Math.round(H*s)*4;
    if(estimatedResourceBytes+addBytes>STUDIO_LIMITS.memoryBudgetBytes){
      toast('⚠️ رام الهاتف لا يحتمل الدمج — احذف بعض الطبقات أولاً');
      return false;
    }
    var cv=document.createElement('canvas');
    cv.width=Math.max(1,Math.round(W*s));
    cv.height=Math.max(1,Math.round(H*s));
    renderSubset(cv.getContext('2d'),W,H,subset,s);
    var url=cv.toDataURL('image/png');
    cv.width=1;cv.height=1;
    var img=new Image();
    img.onload=function(){
      try{
        var maxIdx=0;
        subset.forEach(function(x){var idx=objects.indexOf(x);if(idx>maxIdx)maxIdx=idx;});
        var merged={id:'img_'+Date.now(),type:'img',x:W/2,y:H/2,w:W,h:H,naturalW:img.naturalWidth,naturalH:img.naturalHeight,scale:1,opacity:1,src:url,img:img};
        objects=objects.filter(function(x){return ids.indexOf(x.id)===-1;});
        objects.splice(Math.max(1,Math.min(maxIdx,objects.length)),0,merged);
        selectedId=merged.id;
        saveHist();draw();trimImages();
        toast('✅ تم دمج '+subset.length+' طبقات في واحدة');
      }catch(e){toast('⚠️ فشل الدمج');}
    };
    img.onerror=function(){toast('⚠️ فشل الدمج');};
    img.src=url;
    return true;
  }catch(e){return false;}
}

window.EditorAPI={
  get objects(){return objects;},set objects(v){objects=v;},
  get selectedId(){return selectedId;},set selectedId(v){selectedId=v;},
  get canvas(){return canvas;},get ctx(){return ctx},get fonts(){return FONTS;},
  getSelected:getSelectedWithBackground,
  getBackground:()=>objects.find(o=>o.type==='bg')||null,
  saveHist,draw,toast,undo,redo,
  openFonts:openDrawerToFonts,openDrawer,closeDrawer,openCrop:openCropDialog,
  addObject:o=>{objects.push(o);selectedId=o.id;saveHist();draw();trimImages();},
  update:()=>{saveHist();draw();},
  releaseImage:releaseObjectImages,
mergeLayers:mergeLayers,
  renderFontPreview:function(fam,text,size,color){
    try{
      const fs=size||44;
      const c=document.createElement('canvas');
      let x=c.getContext('2d');
      x.font=fs+'px "'+fam+'", sans-serif';
      const w=Math.ceil(x.measureText(text).width)+24;
      c.width=Math.max(2,w);
      c.height=Math.ceil(fs*1.7);
      x=c.getContext('2d');
      x.font=fs+'px "'+fam+'", sans-serif';
      x.textAlign='center';x.textBaseline='middle';
      x.fillStyle=color||'#ffffff';
      x.fillText(text,c.width/2,c.height/2);
      return c.toDataURL('image/png');
    }catch(e){return null;}
  },
  applyEffectToAll:function(callback){
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    drawScene(tempCtx, canvas.width, canvas.height, false);
    callback(tempCtx, canvas.width, canvas.height);
    tempCanvas.toBlob(blob => {
      if (!blob) { toast('️ تعذر تطبيق التأثير'); return; }
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
        const bg = objects.find(o=>o.type==='bg');
        if(bg){
          releaseObjectImages(bg);
          bg.isImage = true;
          bg.img = img;
          bg.src = url;
          bg.naturalW = canvas.width;
          bg.naturalH = canvas.height;
        }
        bgDirty = true;
        saveHist();
        draw();
        toast('✅ تم تطبيق التأثير على الصورة كاملة');
      };
      img.onerror = () => { URL.revokeObjectURL(url); toast('⚠️ فشل تحميل الصورة'); };
      img.src = url;
    }, 'image/png');
  },
  openEffectsFilePicker:function(callback){
    const input=document.getElementById('effectsFileInput');
    input.onchange=async (e)=>{
      const file=e.target.files[0];
      e.target.value='';
      if(!file)return;
      const arrayBuffer=await file.arrayBuffer();
      callback(arrayBuffer, file.name, file.type);
    };
    input.click();
  }
};
window.__EDITOR_API=window.EditorAPI;

const TOOL_THEME_CSS=`:root{--p:#ff7a00;--pl:#ff9f43;--bg:#0a0f1a;--card:#141c2c;--card2:#1a2234;--text:#ffffff;--dim:#94a3b8;--border:#2d3a52}body.dark{--bg:#060a12;--card:#0d1523;--card2:#111b2b;--text:#f8fafc;--dim:#8ba3c7;--border:#26334d}*{box-sizing:border-box;-webkit-tap-highlight-color:transparent;margin:0}html,body{background:var(--card);color:var(--text);font-family:'Tajawal','Amiri',system-ui;font-size:11px}body{padding:8px;display:flex;flex-direction:column;gap:6px;overflow-x:hidden}h1,h2,h3,h4,h5{color:var(--p);font-size:11px;font-weight:700;flex:0 0 auto;display:flex;align-items:center;gap:4px}label,span,p,small{color:var(--text);font-size:10px}button,input[type=button],input[type=submit]{background:linear-gradient(135deg,var(--p),var(--pl));color:#fff;border:none;border-radius:9px;padding:7px 12px;font-family:inherit;font-size:10px;font-weight:700;cursor:pointer;white-space:nowrap;flex:0 0 auto;box-shadow:0 2px 8px rgba(255,122,0,.25)}button:active{transform:scale(.96)}input[type=text],input[type=number],select{background:var(--card2);color:var(--text);border:1px solid var(--border);border-radius:8px;padding:7px 9px;font-family:inherit;font-size:11px;outline:none;flex:0 0 auto;min-width:90px}input[type=text]:focus,select:focus,textarea:focus{border-color:var(--p)}textarea{width:100%;background:var(--card2);color:var(--text);border:1px solid var(--border);border-radius:8px;padding:7px;font-family:inherit;font-size:11px;min-height:38px;resize:vertical}input[type=range]{accent-color:var(--p);height:24px;background:transparent;flex:1 1 120px;min-width:100px}input[type=color]{border:1px solid var(--border);border-radius:8px;background:var(--card2);width:36px;height:28px;padding:2px;flex:0 0 auto}input[type=checkbox]{accent-color:var(--p);width:14px;height:14px;flex:0 0 auto}hr{border:none;border-top:1px solid var(--border);margin:4px 0;width:100%}::-webkit-scrollbar{width:3px;height:3px}::-webkit-scrollbar-thumb{background:var(--border);border-radius:4px}`;
function themeToolHtml(html){
  try{
    const doc=new DOMParser().parseFromString(html,'text/html');
    const st=doc.createElement('style');st.textContent=TOOL_THEME_CSS;
    if(!doc.head){const h=doc.createElement('head');doc.documentElement.insertBefore(h,doc.body);}
    doc.head.insertBefore(st,doc.head.firstChild);
    doc.documentElement.setAttribute('dir','rtl');doc.documentElement.setAttribute('lang','ar');
    if(doc.body)doc.body.setAttribute('dir','rtl');
    return '<!DOCTYPE html>'+doc.documentElement.outerHTML;
  }catch(e){
    return '<!DOCTYPE html><html dir="rtl"><head><style>'+TOOL_THEME_CSS+'</style></head><body>'+html+'</body></html>';
  }
}
function horizontalizeTool(win){
try{
const doc=win.document;doc.body.style.display='flex';doc.body.style.flexDirection='column';doc.body.style.gap='6px';
const containers=doc.querySelectorAll('div,section,form,fieldset,ul');
containers.forEach(el=>{
const kids=Array.prototype.slice.call(el.children);
if(kids.length<2)return;
const interactive=kids.filter(k=>{
if(!k.tagName)return false;
if(k.tagName==='BUTTON'||k.tagName==='INPUT'||k.tagName==='SELECT'||k.tagName==='TEXTAREA'||k.tagName==='LABEL')return true;
const cn=String(k.className||'');
return /btn|button|chip|item|swatch|color|tool|opt/i.test(cn);
});
if(interactive.length>=2){
el.style.display='flex';el.style.flexDirection='row';el.style.flexWrap='nowrap';
el.style.overflowX='auto';el.style.overflowY='hidden';el.style.gap='6px';
el.style.alignItems='center';el.style.paddingBottom='4px';el.style.minWidth='0';
kids.forEach(k=>{k.style.flexShrink='0';});
}
});
}catch(e){}
}
const sheetHost=document.getElementById('sheetHost');
const sheetBody=document.getElementById('sheetBody');
const primaryRow=document.getElementById('primaryRow');
const secondaryRow=document.getElementById('secondaryRow');
let activeTool=null;

function renderPrimaryBar(){
primaryRow.innerHTML='';
const save=document.createElement('button');
save.className='pbtn saveBtn';
save.innerHTML='<span class="ico"><svg><use href="#i-save"/></svg></span><span>حفظ</span>';
save.onclick=()=>showSaveDialog();
primaryRow.appendChild(save);
tools.forEach(t=>{
const b=document.createElement('button');
b.className='pbtn'+(activeTool===t.id?' active':'')+(t.id==='bgremove'?' eraser':'');
b.innerHTML='<span class="ico"><svg><use href="#'+t.ico+'"/></svg></span><span>'+t.label+'</span>';
b.onclick=()=>openTool(t.id);
primaryRow.appendChild(b);
});
}
function openTool(id){
const t=tools.find(x=>x.id===id);if(!t)return;
activeTool=id;
primaryRow.style.display='none';secondaryRow.style.display='none';
document.getElementById('secTitle').textContent=t.label;
document.getElementById('secIco').innerHTML='<use href="#'+t.ico+'"/>';
sheetHost.classList.add('open');
document.body.classList.add('tool-open');
loadToolIntoSheet(id);
}
function closeTool(){
activeTool=null;
try{ saveHist(); }catch(e){}
sheetHost.classList.remove('open');
document.body.classList.remove('tool-open');
secondaryRow.style.display='none';primaryRow.style.display='';
setTimeout(fitPreview, 120);
renderPrimaryBar();
}
window.closeTool=closeTool;
/* ===== 🚪 حماية الخروج من المحرر ===== */

/* ===== 🚪 حماية الخروج من المحرر + زر الرجوع الذكي ===== */
(function(){
  if(window.__studioBackInstalled) return;
  window.__studioBackInstalled = true;

  // إنشاء نافذة تأكيد الخروج
  var dlg = document.createElement('div');
  dlg.id = 'leaveConfirmDlg';
  dlg.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.7);backdrop-filter:blur(8px);display:none;align-items:center;justify-content:center;z-index:400;';
  dlg.innerHTML = '<div style="background:var(--card);border:1px solid var(--border);border-radius:22px;padding:24px 20px;width:86%;max-width:340px;text-align:center;box-shadow:0 25px 70px rgba(0,0,0,.5)">' +
    '<div style="font-size:32px;margin-bottom:10px">🚪</div>' +
    '<div style="font-family:TajawalBold;font-size:16px;color:var(--p);margin-bottom:6px">مغادرة المحرر؟</div>' +
    '<div style="font-size:11.5px;color:var(--dim);margin-bottom:20px;line-height:1.6">تصميمك محفوظ تلقائياً ✓<br>هل تريد العودة للصفحة الرئيسية؟</div>' +
    '<div style="display:flex;gap:10px">' +
    '<button id="leaveStay" style="flex:1;padding:13px;border-radius:13px;border:1.5px solid var(--border);background:var(--card2);color:var(--text);font-family:TajawalBold;font-size:13px">البقاء ✋</button>' +
    '<button id="leaveGo" style="flex:1;padding:13px;border-radius:13px;border:none;background:linear-gradient(135deg,var(--p),var(--pl));color:#fff;font-family:TajawalBold;font-size:13px;box-shadow:0 6px 18px rgba(255,122,0,.35)">مغادرة 🚪</button>' +
    '</div></div>';
  document.body.appendChild(dlg);

  window.showLeaveDialog = function(){ dlg.style.display = 'flex'; };
  window.hideLeaveDialog = function(){ dlg.style.display = 'none'; };

  dlg.addEventListener('click', function(e){
    if(e.target && e.target.id === 'leaveStay'){ window.hideLeaveDialog(); }
    else if(e.target && e.target.id === 'leaveGo'){
      window.hideLeaveDialog();
      try{ window.location.href = 'index.html?theme=' + (localStorage.getItem('theme') || 'light'); }catch(err){}
    }
  });

  // زر الرجوع الذكي
  window.onAndroidBack = function(){
    try {
      // 1) إذا كانت أداة مفتوحة (iframe) → أغلقها وابق في المحرر
      const iframe = document.querySelector('#sheetBody iframe.toolFrame');
      if(iframe && sheetHost && sheetHost.classList.contains('open')){
        try{
          if(iframe.contentWindow && iframe.contentWindow.STUDIO_TOOL && typeof iframe.contentWindow.STUDIO_TOOL.back === 'function'){
            iframe.contentWindow.STUDIO_TOOL.back();
            return true;
          }
          if(iframe.contentWindow && iframe.contentWindow.q && typeof iframe.contentWindow.q.back === 'function'){
            iframe.contentWindow.q.back();
            return true;
          }
          const backBtn = iframe.contentDocument && iframe.contentDocument.getElementById('back');
          if(backBtn){ backBtn.click(); return true; }
        }catch(e){}
        try{ closeTool(); }catch(e){}
        return true;
      }

      // 2) دولاج مفتوح → أغلقه
      const dialogs = ['saveDialogOverlay','restoreDialogOverlay','cropDialogOverlay','eraserDialogOverlay','fontUploadDialogOverlay'];
      for(const id of dialogs){
        const dlg = document.getElementById(id);
        if(dlg && dlg.classList.contains('show')){
          dlg.classList.remove('show');
          return true;
        }
      }

      // 3) Drawer مفتوح → أغلقه
      if(drawer && drawer.classList.contains('show')){
        closeDrawer();
        return true;
      }

      // 4) لا شيء مفتوح → اسأل قبل الخروج
      window.showLeaveDialog();
      return true;
    } catch(e){ 
      return false; 
    }
  };
})();






(function installStabilityGuard(){
  try{
    window.addEventListener('error',function(e){
      try{ console.error('[Studio] runtime error:', e && (e.error || e.message || e)); }catch(_){}
      try{ renderShuttingDown=false; }catch(_){}
    },true);
    window.addEventListener('unhandledrejection',function(e){
      try{ console.error('[Studio] unhandled rejection:', e && e.reason); }catch(_){}
      try{ if(e && typeof e.preventDefault==='function') e.preventDefault(); }catch(_){}
    });
  }catch(e){}
})();

async function loadToolIntoSheet(id){
sheetBody.innerHTML='<div class="tool-loading">جاري التحميل...</div>';
const html=await loadToolXHR(ASSETS+TOOL_DIR+'/'+id+'.html');
if(html){
sheetBody.innerHTML='';
const iframe=document.createElement('iframe');
iframe.className='toolFrame';
sheetBody.appendChild(iframe);
iframe.srcdoc=themeToolHtml(html);
const hasOwnStyle=/<style[\s>]/i.test(html);
iframe.onload=()=>{
try{
iframe.contentWindow.__EDITOR_API=window.EditorAPI;
iframe.contentWindow.EditorAPI=window.EditorAPI;
iframe.contentWindow.closeTool=window.closeTool;
iframe.contentWindow.openDrawer=openDrawer;
iframe.contentWindow.closeDrawer=closeDrawer;
if(!hasOwnStyle){horizontalizeTool(iframe.contentWindow);setTimeout(()=>horizontalizeTool(iframe.contentWindow),350);}
}catch(e){}
};
}
else renderFallbackPanel(id);
}

let eraserMode=false;
let eraserCanvas=null;
let eraserCtx=null;
let eraserBrushSize=20;
let eraserTargetId=null;

function initEraserForSelected(){
const o=objects.find(x=>x.id===selectedId);
if(!o){toast('اختر صورة أولاً');return;}
if(o.type!=='img'){toast('الممحاة تعمل على الصور فقط');return;}

eraserTargetId=o.id;
const originalW = o.img.naturalWidth || o.naturalW || o.w;
const originalH = o.img.naturalHeight || o.naturalH || o.h;
const safe = getSafeImageSize(originalW, originalH, MAX_IMAGE_WORKING_DIMENSION);
const w = safe.w;
const h = safe.h;

eraserCanvas=document.createElement('canvas');
eraserCanvas.width=w;
eraserCanvas.height=h;
eraserCtx=eraserCanvas.getContext('2d');
eraserCtx.drawImage(o.img,0,0,w,h);
eraserMode=true;

document.getElementById('eraserDialogOverlay').classList.add('show');
document.getElementById('eraserSizeRange').value=eraserBrushSize;
}

async function applyEraserResult(){
if(!eraserMode||!eraserCanvas)return;
const o=objects.find(x=>x.id===eraserTargetId);
if(!o){cancelEraser();return;}

try{
  const newDataUrl = eraserCanvas.toDataURL('image/png');
  clearFadeCache(o);
  releaseObjectImages(o);
  
  o.src = newDataUrl;
  const newImg = new Image();
  newImg.onload = () => {
    o.img = newImg;
    saveHist();
    draw();
    toast('✅ تم تطبيق الممحاة');
  };
  newImg.src = newDataUrl;

}catch(e){
  console.error('applyEraserResult error:', e);
  toast('⚠️ تعذر تطبيق الممحاة');
}finally{
  cancelEraser();
  closeTool();
}
}

function cancelEraser(){
eraserMode=false;
if(eraserCanvas){
  cleanupCanvas(eraserCanvas);
}
eraserCanvas=null;
eraserCtx=null;
eraserTargetId=null;
document.getElementById('eraserDialogOverlay').classList.remove('show');
}
function eraserDraw(x,y){
if(!eraserMode||!eraserCtx)return;
eraserCtx.save();
eraserCtx.globalCompositeOperation='destination-out';
eraserCtx.beginPath();
eraserCtx.arc(x,y,eraserBrushSize,0,Math.PI*2);
eraserCtx.fill();
eraserCtx.restore();
}

function renderFallbackPanel(type){
const o=objects.find(x=>x.id===selectedId);
if(type==='text'){
sheetBody.innerHTML='<div style="padding:10px;display:flex;flex-direction:column;gap:8px"><input id="pText" placeholder="اكتب النص" style="padding:8px;border:1px solid var(--border);border-radius:8px;background:var(--card2);color:var(--text)" value="'+(o&&o.text?o.text:'')+'"><div style="display:flex;gap:8px;align-items:center"><span style="font-size:10px">حجم</span><input type="range" id="pSize" min="15" max="400" value="'+(o?o.size:70)+'" style="flex:1;accent-color:var(--p)"></div></div>';
document.getElementById('pText').oninput=e=>{if(o){o.text=e.target.value;draw();}};
document.getElementById('pSize').oninput=e=>{if(o){o.size=parseInt(e.target.value);draw();}};
document.getElementById('pSize').onchange=saveHist;
}
else if(type==='color'){
sheetBody.innerHTML='<div class="colors" style="padding:10px">'+['#ff7a00','#ff9f43','#ffffff','#141c2c','#0a0f1a','#e2e8f0','#64748b'].map(c=>'<div class="cdot" style="background:'+c+'" data-c="'+c+'"></div>').join('')+'</div>';
sheetBody.querySelectorAll('.cdot').forEach(d=>d.onclick=()=>{if(o){o.color=d.dataset.c;o.fill=d.dataset.c;draw();saveHist();}});
}
else if(type==='layers'){
const rows=[...objects].filter(x=>x.type!=='bg').reverse();
sheetBody.innerHTML='<div style="padding:10px">'+(rows.length?rows.map(obj=>{
const label=obj.type==='text'?(obj.text||'نص').substring(0,12):'صورة';
const sel=obj.id===selectedId?'border-color:var(--p);background:rgba(255,122,0,.12);':'';
return '<div data-id="'+obj.id+'" style="'+sel+'display:flex;justify-content:space-between;align-items:center;padding:6px 8px;border:1px solid var(--border);border-radius:8px;margin-bottom:4px;cursor:pointer"><span>'+label+'</span></div>';
}).join(''):'<div style="text-align:center;color:var(--dim)">لا توجد طبقات</div>')+'</div>';
sheetBody.querySelectorAll('[data-id]').forEach(el=>el.onclick=()=>{selectedId=el.dataset.id;draw();renderFallbackPanel('layers');});
}
else if(type==='shapes'){
sheetBody.innerHTML='<div style="display:flex;gap:6px;overflow-x:auto;padding:10px;flex-wrap:nowrap"><button data-shape="rect" style="flex:0 0 auto">مربع</button><button data-shape="circle" style="flex:0 0 auto">دائرة</button><button data-shape="triangle" style="flex:0 0 auto">مثلث</button><button data-shape="diamond" style="flex:0 0 auto">معين</button></div>';
sheetBody.querySelectorAll('[data-shape]').forEach(b=>b.onclick=()=>{
const id='s_'+Date.now();
objects.push({id,type:'shape',x:canvas.width/2,y:canvas.height/2,w:200,h:200,shapeType:b.dataset.shape,fill:'#ff7a00',scale:1});
selectedId=id;saveHist();draw();
});
}
else if(type==='bgremove'){
initEraserForSelected();
}
else sheetBody.innerHTML='<div style="font-size:11px;color:var(--dim);text-align:center;padding:16px">هذه الأداة غير متوفرة حالياً</div>';
}

document.getElementById('backBtn').onclick=closeTool;
document.getElementById('sheetToggle').onclick=()=>sheetHost.classList.toggle('open');
document.getElementById('secRotate').onclick=doRotate;
document.getElementById('secCrop').onclick=doCrop;
document.getElementById('secCopy').onclick=doDup;
document.getElementById('secDel').onclick=doDel;
document.getElementById('secUndo').onclick=undo;
document.getElementById('secRedo').onclick=redo;

document.getElementById('eraserApplyBtn').onclick=()=>{applyEraserResult();};
document.getElementById('eraserCancelBtn').onclick=cancelEraser;
document.getElementById('eraserSizeRange').oninput=e=>{eraserBrushSize=parseInt(e.target.value);};

function showSaveDialog(){
document.getElementById('saveDialogOverlay').classList.add('show');
}
function hideSaveDialog(){
document.getElementById('saveDialogOverlay').classList.remove('show');
}
document.getElementById('saveCancelBtn').onclick=hideSaveDialog;
document.querySelectorAll('#saveDialogOverlay .dialogBtn[data-fmt]').forEach(btn=>{
btn.onclick=()=>{
const fmt=btn.dataset.fmt;
const quality=parseFloat(btn.dataset.quality||'1');
hideSaveDialog();
saveDesign(fmt,quality);
};
});

function saveDesign(fmt, quality){
  const isHighQuality = (fmt==='png') || (fmt==='jpeg' && quality >= 0.9);
  
  const doSave = ()=>{
    /* 🖼️ دمج الخلفية + الطبقات قبل التصدير */
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = canvas.width;
    exportCanvas.height = canvas.height;
    const ex = exportCanvas.getContext('2d');
    ex.drawImage(bgCanvas, 0, 0, exportCanvas.width, exportCanvas.height);
    ex.drawImage(canvas, 0, 0);
    exportCanvas.toBlob(blob=>{
      if(!blob){ toast('⚠️ فشل الحفظ'); return; }
    const url = URL.createObjectURL(blob);
    const filename = 'design-'+Date.now()+(fmt==='png'?'.png':'.jpg');

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      let savedNatively=false;
      try{ if(window.AssetBridge&&typeof AssetBridge.saveImage==='function'){ AssetBridge.saveImage(dataUrl,filename); savedNatively=true; } }catch(e){}
      if(!savedNatively){ try{ if(window.SketchwareInterface&&typeof SketchwareInterface.saveImage==='function'){ SketchwareInterface.saveImage(dataUrl,filename); savedNatively=true; } }catch(e){} }
      if(!savedNatively){ try{ if(window.Android&&typeof window.Android.saveImage==='function'){ window.Android.saveImage(dataUrl,filename); savedNatively=true; } }catch(e){} }
      if(!savedNatively){ try{ if(window.JSInterface&&typeof JSInterface.saveImage==='function'){ JSInterface.saveImage(dataUrl,filename); savedNatively=true; } }catch(e){} }

      if(!savedNatively){
        const a=document.createElement('a');
        a.download=filename;
        a.href=dataUrl;
        a.click();
      }
      URL.revokeObjectURL(url);
      if(savedNatively){ toast('✅ تم الحفظ في المعرض'); }else{ toast('✅ تم التحميل: '+filename); }
    };
    reader.readAsDataURL(blob);
}, fmt==='png'?'image/png':'image/jpeg', quality);
  };
  
  if(isHighQuality){
    requestRewardAd('save_hd', doSave, ()=>{ toast('↩ تم إلغاء الحفظ'); });
  }else{
    doSave();
  }
}
document.getElementById('saveBtnDrawer').onclick=()=>{closeDrawer();showSaveDialog();};

const fontFileInput=document.getElementById('fontFileInput');
let pendingFontGroup='text';

document.getElementById('addFontBtn').onclick=()=>{
document.getElementById('fontUploadDialogOverlay').classList.add('show');
};
document.getElementById('fontUploadCancelBtn').onclick=()=>{
document.getElementById('fontUploadDialogOverlay').classList.remove('show');
};
document.querySelectorAll('#fontUploadDialogOverlay [data-font-group]').forEach(btn=>{
btn.onclick=()=>{
pendingFontGroup=btn.dataset.fontGroup;
document.getElementById('fontUploadDialogOverlay').classList.remove('show');
fontFileInput.click();
};
});
fontFileInput.addEventListener('change',async e=>{
const file=e.target.files[0];
e.target.value='';
if(!file)return;
if(!/\.(ttf|otf)$/i.test(file.name)){
    toast('️ يرجى اختيار ملف خط TTF أو OTF');
    return;
  }
  toast('⏳ جاري تحميل الخط...');
  try{
    const arrayBuffer=await file.arrayBuffer();
    const baseLabel=file.name.replace(/\.(ttf|otf)$/i,'').replace(/[-]+/g,' ');
const id='custom'+Date.now()+''+Math.random().toString(36).substr(2,6);
const fam='CUSTOM'+id;
const result=await loadFontFromArrayBuffer(fam,arrayBuffer);
if(!result.ok){
toast('⚠️ تعذر تحميل هذا الخط. تأكد من الملف.');
return;
}
const saved=await saveCustomFontToDB(id,arrayBuffer,baseLabel,pendingFontGroup);
if(!saved){
toast('⚠️ تم التحميل لكن التخزين فشل');
}
FONTS[fam]={fam,label:baseLabel,group:pendingFontGroup,customId:id,isColorFont:result.isColorFont};
renderDrawerFonts();
renderChips();
draw();
toast('✅ تمت إضافة: '+baseLabel);
}catch(err){
console.error('Font upload error:', err);
toast('⚠️ فشل قراءة الملف');
}
});

const FULL_CHARS='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzابتثجحخدذرزسشصضطظعغفقكلمنهويءآأؤإة';
const GLYPH_CACHE={};
function charKind(ch,fam,cA,cB){
const S=48;const x=cA.getContext('2d');x.clearRect(0,0,S,S);x.font='36px '+fam+', sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillStyle='#fff';x.fillText(ch,S/2,S/2);
const da=x.getImageData(0,0,S,S).data;let has=false;
for(let i=3;i<da.length;i+=4){if(da[i]>8){has=true;break;}}
if(!has)return 0;
const y=cB.getContext('2d');y.clearRect(0,0,S,S);y.font='36px sans-serif';y.textAlign='center';y.textBaseline='middle';y.fillStyle='#fff';y.fillText(ch,S/2,S/2);
const db=y.getImageData(0,0,S,S).data;let diff=0;
for(let i=0;i<da.length;i+=4){if(Math.abs(da[i]-db[i])>25){diff++;if(diff>6)return 2;}}
return 1;
}
function analyzeFont(fam){
if(GLYPH_CACHE[fam])return GLYPH_CACHE[fam];
const cA=document.createElement('canvas'),cB=document.createElement('canvas');
cA.width=cA.height=cB.width=cB.height=48;
const real=[],fb=[];
for(const ch of FULL_CHARS){
const k=charKind(ch,fam,cA,cB);
if(k===2)real.push(ch);else if(k===1)fb.push(ch);
}
GLYPH_CACHE[fam]={real,fb};return GLYPH_CACHE[fam];
}
function setupGlyph(group,chipsId,gridId,prevId,addId,rewardTag){
const chips=document.getElementById(chipsId),grid=document.getElementById(gridId),prev=document.getElementById(prevId),add=document.getElementById(addId);
let st={fam:null,ch:null,showAll:false};
function renderChips(){
chips.innerHTML='';
const list=Object.values(FONTS).filter(f=>f.group===group);
if(!list.length){chips.innerHTML='<span style="font-size:9px;color:var(--dim)">لا توجد خطوط</span>';return;}
if(!list.find(f=>f.fam===st.fam))st.fam=list[0].fam;
list.forEach(f=>{
const b=document.createElement('button');
b.className='sub-btn'+(f.fam===st.fam?' active':'');
b.textContent=f.label;
b.onclick=()=>{st.fam=f.fam;st.ch=null;prev.textContent='؟';renderChips();renderGrid();setTimeout(()=>{const target=grid.querySelector('[data-fam-start="'+f.fam+'"]');if(target)target.scrollIntoView({behavior:'smooth',inline:'start',block:'nearest'});},150);};
chips.appendChild(b);
});
renderGrid();
}
function renderGrid(){
grid.innerHTML='';
const allFams=Object.values(FONTS).filter(f=>f.group===group);
allFams.forEach((fam,famIdx)=>{
const a=analyzeFont(fam.fam);
const chars=st.showAll?FULL_CHARS.split(''):a.real.concat(a.fb);
if(famIdx>0){
const sep=document.createElement('div');
sep.className='manu-divider';
sep.setAttribute('data-label',fam.label);
grid.appendChild(sep);
}
const anchor=document.createElement('div');
anchor.style.cssText='width:1px;flex-shrink:0;margin:0';
anchor.setAttribute('data-fam-start',fam.fam);
grid.appendChild(anchor);
const COLS=6;
const numRows=Math.ceil(chars.length/COLS);
for(let c=0;c<COLS;c++){
const col=document.createElement('div');col.className='manu-col';
for(let r=0;r<numRows;r++){
const idx=c+r*COLS;
if(idx>=chars.length)break;
const ch=chars[idx];
const d=document.createElement('div');
d.className='manu-item'+(a.real.indexOf(ch)<0?' dim':'')+(st.ch===ch&&st.fam===fam.fam?' picked':'');
d.style.fontFamily=fam.fam+', sans-serif';
d.style.color='var(--text)';
d.textContent=ch;
d.onclick=()=>{st.ch=ch;st.fam=fam.fam;prev.textContent=ch;prev.style.fontFamily=fam.fam+', sans-serif';renderChips();renderGrid();};
col.appendChild(d);
}
grid.appendChild(col);
}
});
}
add.onclick=()=>{
if(!st.ch){toast('اختر رمزاً');return;}
const doAdd = ()=>{
  const id='t_'+Date.now();
  objects.push({id,type:'text',x:canvas.width/2,y:canvas.height/2,text:st.ch,font:st.fam,color:'#ffffff',size:group==='manu'?130:190,scale:1,opacity:1,rot:0});
  selectedId=id;saveHist();draw();toast('✅ أُضيف');
};
if(rewardTag){
  requestRewardAd(rewardTag, doAdd, ()=>{ toast('↩ تم الإلغاء'); });
}else{
  doAdd();
}
};
return{renderChips,renderGrid,getSt:()=>st,setShowAll:v=>st.showAll=v};
}
const manuAPI=setupGlyph('manu','manuChips','manuGrid','manuPrev','manuAddBtn','manuscript');
const zakhAPI=setupGlyph('zakh','zakhChips','zakhGrid','zakhPrev','zakhAddBtn','zakhrafa');
document.getElementById('manuAllToggle').onclick=()=>{
const st=manuAPI.getSt();
manuAPI.setShowAll(!st.showAll);
document.getElementById('manuAllToggle').textContent=st.showAll?'🔤 الحقيقية فقط':'🔤 كل الرموز';
manuAPI.renderGrid();
};
function renderChips(){manuAPI.renderChips();zakhAPI.renderChips();}
function renderDrawerFonts(){
const c=document.getElementById('drawerFonts');c.innerHTML='';
const list=Object.values(FONTS).filter(f=>f.group==='text');
if(!list.length)c.innerHTML='<span style="font-size:9px;color:var(--dim)">لا توجد خطوط</span>';
list.forEach(f=>{
const d=document.createElement('button');
d.className='fontRow';
d.innerHTML='<span class="fname" style="font-family:\''+f.fam+'\',sans-serif">صفاء الروح</span><span class="flabel">'+f.label+'</span>';
d.onclick=()=>{
const o=objects.find(o=>o.id===selectedId);
if(o){o.font=f.fam;o.forceMonochrome = f.isColorFont || false;draw();saveHist();toast('✅ '+f.label);}
};
c.appendChild(d);
});
const t=document.getElementById('drawerTools');t.innerHTML='';
tools.forEach(tt=>{
const b=document.createElement('button');
b.className='pbtn';
b.innerHTML='<span class="ico"><svg><use href="#'+tt.ico+'"/></svg></span><span>'+tt.label+'</span>';
b.onclick=()=>{closeDrawer();openTool(tt.id);};
t.appendChild(b);
});
}

const fileInput=document.getElementById('fileInput'),layerFileInput=document.getElementById('layerFileInput');
document.getElementById('uploadBgBtn').onclick=()=>fileInput.click();
document.getElementById('uploadLayerBtn').onclick=()=>layerFileInput.click();

fileInput.addEventListener('change',e=>{
  const file=e.target.files[0];if(!file)return;
  if(file.size > 15*1024*1024){ toast('⚠️ الصورة كبيرة جداً - الحد 15MB'); e.target.value=''; return; }
  const r=new FileReader();
  r.onload=ev=>{
    const originalDataUrl = ev.target.result;
    
    const tempImg = new Image();
    tempImg.onload = ()=>{
      let bg=objects.find(o=>o.type==='bg');
      if(!bg){ bg={id:'bg',type:'bg',bg:['#141c2c','#0a0f1a'],isImage:false}; objects.unshift(bg); }
      {
        releaseObjectImages(bg);
        
        const safe = safeCanvasSize(tempImg.naturalWidth, tempImg.naturalHeight, 2560);
        const off = document.createElement('canvas');
        off.width = safe.w;
        off.height = safe.h;
        off.getContext('2d').drawImage(tempImg, 0, 0, safe.w, safe.h);
        const smallDataUrl = off.toDataURL('image/jpeg', 0.92);
        cleanupCanvas(off);
        
        const finalImg = new Image();
        finalImg.onload = ()=>{
          bg.isImage = true;
          bg.img = finalImg;
          bg.src = smallDataUrl;
          canvas.width = safe.w;
          canvas.height = safe.h;
          bg.naturalW = safe.w;
          bg.naturalH = safe.h;
          bgDirty = true;
          /* 🏔️ رسم الخلفية مباشرة على bgCanvas (ضمان الظهور الفوري) */
          try{
            if(typeof bgCanvas!=='undefined'){
              bgCanvas.width = safe.w;
              bgCanvas.height = safe.h;
              const bx = bgCanvas.getContext('2d');
              bx.clearRect(0,0,safe.w,safe.h);
              bx.drawImage(finalImg,0,0,safe.w,safe.h);
            }
          }catch(e){}
          syncAR();saveHist();draw();fitPreview();
          toast('✅ خلفية: '+safe.w+'×'+safe.h+'px');
        };
        finalImg.src = smallDataUrl;
      }
    };
    tempImg.src = originalDataUrl;
  };
  r.readAsDataURL(file);e.target.value='';
});

layerFileInput.addEventListener('change',e=>{
  const file=e.target.files[0];if(!file)return;
  if(file.size > 15*1024*1024){ toast('⚠️ الصورة كبيرة جداً - الحد 15MB'); e.target.value=''; return; }
  const r=new FileReader();
  r.onload=ev=>{
    const originalDataUrl = ev.target.result;
    
    const tempImg = new Image();
    tempImg.onload = ()=>{
      const id='img_'+Date.now();
      const nw=tempImg.naturalWidth, nh=tempImg.naturalHeight;
      
      const safeLayer = getSafeImageSize(nw, nh, 2560);
      const off = document.createElement('canvas');
      off.width = safeLayer.w;
      off.height = safeLayer.h;
      off.getContext('2d').drawImage(tempImg, 0, 0, safeLayer.w, safeLayer.h);
      const smallDataUrl = off.toDataURL('image/jpeg', 0.92);
      cleanupCanvas(off);
      
      const finalImg = new Image();
      finalImg.onload = ()=>{
        const maxDim=Math.min(canvas.width,canvas.height)*0.6;
        let initScale=1;
        if(Math.max(safeLayer.w, safeLayer.h)>maxDim) initScale=maxDim/Math.max(safeLayer.w, safeLayer.h);
        objects.push({
          id, type:'img', x:canvas.width/2, y:canvas.height/2,
          w: safeLayer.w, h: safeLayer.h,
          naturalW: safeLayer.w, naturalH: safeLayer.h,
          scale:initScale, originalScale:initScale, opacity:1, src:smallDataUrl, img: finalImg
        });
        selectedId=id;saveHist();draw();trimImages();fitPreview();
        toast('✅ طبقة: '+safeLayer.w+'×'+safeLayer.h+'px');
      };
      finalImg.src = smallDataUrl;
    };
    tempImg.src = originalDataUrl;
  };
  r.readAsDataURL(file);e.target.value='';
});

function cropImage(obj, top, bottom, right, left){
  if(!obj || !obj.img || !obj.img.complete) return false;
  
  const w = obj.img.naturalWidth;
  const h = obj.img.naturalHeight;
  
  const cropLeft = Math.floor(w * (left / 100));
  const cropRight = Math.floor(w * (right / 100));
  const cropTop = Math.floor(h * (top / 100));
  const cropBottom = Math.floor(h * (bottom / 100));
  
  const newW = w - cropLeft - cropRight;
  const newH = h - cropTop - cropBottom;
  
  if(newW <= 0 || newH <= 0){
    toast('⚠️ نسبة القص كبيرة جداً');
    return false;
  }
  
  const off = document.createElement('canvas');
  off.width = newW;
  off.height = newH;
  const octx = off.getContext('2d');
  octx.drawImage(obj.img, cropLeft, cropTop, newW, newH, 0, 0, newW, newH);
  
  const newDataUrl = off.toDataURL('image/png');
  cleanupCanvas(off);
  
  const newImg = new Image();
  newImg.onload = ()=>{
    releaseObjectImages(obj);
    obj.img = newImg;
    obj.src = newDataUrl;
    obj.naturalW = newW;
    obj.naturalH = newH;
    obj.w = newW;
    obj.h = newH;
    saveHist();
    draw();
    toast('✅ تم القص بنجاح');
  };
  newImg.src = newDataUrl;
  
  return true;
}

let cropTargetObj = null;
let cropPreviewImage = document.getElementById('cropPreviewImage');
let cropOverlay = document.getElementById('cropOverlay');
let cropRegion = document.getElementById('cropRegion');
let cropHandles = {
  top: document.getElementById('cropHandleTop'),
  bottom: document.getElementById('cropHandleBottom'),
  left: document.getElementById('cropHandleLeft'),
  right: document.getElementById('cropHandleRight')
};
let currentCrop = { top: 0, bottom: 0, left: 0, right: 0 };
let cropContainer = document.getElementById('cropPreviewContainer');
let cropScale = 1;


function openCropDialog(){
  const selected = objects.find(o => o.id === selectedId);
  if(!selected || (selected.type !== 'img' && selected.type !== 'bg')){
    toast('اختر صورة أو خلفية أولاً');
    return;
  }
  cropTargetObj = selected;
  const src = selected.src || (selected.img && selected.img.src) || '';
  if(!src){
    toast('لا توجد صورة للقص');
    return;
  }
  cropPreviewImage.src = src;
  cropPreviewImage.onload = function(){
    currentCrop = { top: 0, bottom: 0, left: 0, right: 0 };
    updateCropVisual();
    document.getElementById('cropDialogOverlay').classList.add('show');
  };
  cropPreviewImage.onerror = function(){
    toast('تعذر تحميل الصورة للمعاينة');
  };
}

function updateCropVisual(){
  const img = cropPreviewImage;
  if(!img.naturalWidth) return;
  
  const containerWidth = cropContainer.clientWidth;
  const containerHeight = cropContainer.clientHeight;
  if(containerWidth === 0 || containerHeight === 0) return;
  
  const imgRatio = img.naturalWidth / img.naturalHeight;
  const containerRatio = containerWidth / containerHeight;
  let renderW, renderH;
  if(imgRatio > containerRatio){
    renderW = containerWidth;
    renderH = containerWidth / imgRatio;
  } else {
    renderH = containerHeight;
    renderW = containerHeight * imgRatio;
  }
  
  cropScale = img.naturalWidth / renderW;
  
  img.style.width = renderW + 'px';
  img.style.height = renderH + 'px';
  
  const offsetX = (containerWidth - renderW) / 2;
  const offsetY = (containerHeight - renderH) / 2;
  img.style.marginLeft = offsetX + 'px';
  img.style.marginTop = offsetY + 'px';
  
  const region = cropRegion;
  const topPx = (currentCrop.top / 100) * renderH;
  const bottomPx = (currentCrop.bottom / 100) * renderH;
  const leftPx = (currentCrop.left / 100) * renderW;
  const rightPx = (currentCrop.right / 100) * renderW;
  
  region.style.left = (offsetX + leftPx) + 'px';
  region.style.top = (offsetY + topPx) + 'px';
  region.style.width = (renderW - leftPx - rightPx) + 'px';
  region.style.height = (renderH - topPx - bottomPx) + 'px';
  
  cropHandles.top.style.top = (offsetY + topPx - 10) + 'px';
  cropHandles.top.style.left = (offsetX + renderW/2) + 'px';
  
  cropHandles.bottom.style.top = (offsetY + renderH - bottomPx - 10) + 'px';
  cropHandles.bottom.style.left = (offsetX + renderW/2) + 'px';
  
  cropHandles.left.style.left = (offsetX + leftPx - 10) + 'px';
  cropHandles.left.style.top = (offsetY + renderH/2) + 'px';
  
  cropHandles.right.style.left = (offsetX + renderW - rightPx - 10) + 'px';
  cropHandles.right.style.top = (offsetY + renderH/2) + 'px';
}

let activeCropEdge = null;
function startCropDrag(e, edge){
  e.preventDefault();
  activeCropEdge = edge;
  document.addEventListener('pointermove', onCropDrag);
  document.addEventListener('pointerup', stopCropDrag);
}
function onCropDrag(e){
  if(!activeCropEdge) return;
  const containerRect = cropContainer.getBoundingClientRect();
  const imgRect = cropPreviewImage.getBoundingClientRect();
  const renderW = imgRect.width;
  const renderH = imgRect.height;
  const offsetX = imgRect.left - containerRect.left;
  const offsetY = imgRect.top - containerRect.top;
  
  const x = e.clientX - containerRect.left - offsetX;
  const y = e.clientY - containerRect.top - offsetY;
  
  if(x < 0 || x > renderW || y < 0 || y > renderH) return;
  
  const newX = (x / renderW) * 100;
  const newY = (y / renderH) * 100;
  
  switch(activeCropEdge){
    case 'top':
      currentCrop.top = Math.max(0, Math.min(100 - currentCrop.bottom - 5, newY));
      break;
    case 'bottom':
      currentCrop.bottom = Math.max(0, Math.min(100 - currentCrop.top - 5, 100 - newY));
      break;
    case 'left':
      currentCrop.left = Math.max(0, Math.min(100 - currentCrop.right - 5, newX));
      break;
    case 'right':
      currentCrop.right = Math.max(0, Math.min(100 - currentCrop.left - 5, 100 - newX));
      break;
  }
  updateCropVisual();
}
function stopCropDrag(){
  activeCropEdge = null;
  document.removeEventListener('pointermove', onCropDrag);
  document.removeEventListener('pointerup', stopCropDrag);
}

cropHandles.top.addEventListener('pointerdown', e => startCropDrag(e, 'top'));
cropHandles.bottom.addEventListener('pointerdown', e => startCropDrag(e, 'bottom'));
cropHandles.left.addEventListener('pointerdown', e => startCropDrag(e, 'left'));
cropHandles.right.addEventListener('pointerdown', e => startCropDrag(e, 'right'));

document.getElementById('cropBtn').onclick = openCropDialog;
document.getElementById('cropApplyBtn').onclick = function(){
  if(!cropTargetObj) return;
  const top = currentCrop.top;
  const bottom = currentCrop.bottom;
  const left = currentCrop.left;
  const right = currentCrop.right;
  if(cropImage(cropTargetObj, top, bottom, right, left)){
    document.getElementById('cropDialogOverlay').classList.remove('show');
  }
};
document.getElementById('cropCancelBtn').onclick = function(){
  document.getElementById('cropDialogOverlay').classList.remove('show');
};
window.addEventListener('resize', ()=>{
  if(document.getElementById('cropDialogOverlay').classList.contains('show')){
    updateCropVisual();
  }
});

document.getElementById('ctxOriginal').onclick=()=>{
const o=objects.find(x=>x.id===selectedId);
if(!o){toast('اختر عنصراً');return;}
if(o.type==='img'){o.scale=1;o.w=o.naturalW||o.w;o.h=o.naturalH||o.h;saveHist();draw();toast('✅ أصلي: '+(o.w)+'×'+(o.h)+'px');}
else if(o.type==='text'){o.size=70;o.scale=1;saveHist();draw();toast('✅ افتراضي');}
else if(o.type==='shape'){o.w=200;o.h=200;o.scale=1;saveHist();draw();toast('✅ افتراضي');}
else toast('غير مدعوم');
};

const overlay=document.getElementById('overlay'),drawer=document.getElementById('drawer');
function openDrawer(){overlay.classList.add('show');drawer.classList.add('show');}
function closeDrawer(){overlay.classList.remove('show');drawer.classList.remove('show');}
document.getElementById('menuBtn').onclick=openDrawer;
document.getElementById('closeDrawer').onclick=closeDrawer;
overlay.onclick=closeDrawer;
document.getElementById('undoBtn').onclick=undo;
document.getElementById('redoBtn').onclick=redo;
document.getElementById('dupBtn').onclick=doDup;
document.getElementById('delBtn').onclick=doDel;
document.getElementById('ctxBack').onclick=()=>{selectedId=null;document.getElementById('contextBar').style.display='none';draw();fitPreview();};
document.getElementById('ctxRotate').onclick=doRotate;
document.getElementById('ctxCrop').onclick=doCrop;
document.getElementById('ctxCopy').onclick=doDup;
document.querySelectorAll('[data-act]').forEach(b=>b.onclick=()=>openTool(b.dataset.act));

document.querySelectorAll('.dialogOverlay').forEach(dlg=>{
dlg.addEventListener('click',e=>{
if(e.target===dlg)dlg.classList.remove('show');
});
});

document.addEventListener('visibilitychange', ()=>{
  if(document.visibilityState === 'hidden') {
    persistStateNow();
  }
});
window.addEventListener('pagehide', ()=>{ persistStateNow(); });
window.addEventListener('beforeunload', ()=>{ persistStateNow(); });

requestRender();
(async()=>{
  await discoverToolFiles();
  renderPrimaryBar();
  initDefault();
  fitPreview();

  await bootFonts();
  fitPreview();
})();

function getDngBridge(){
if(window.DngBridge) return window.DngBridge;
try{ if(window.parent && window.parent.DngBridge) return window.parent.DngBridge; }catch(e){}
try{ if(window.parent && window.parent.parent && window.parent.parent.DngBridge) return window.parent.parent.DngBridge; }catch(e){}
return null;
}

function base64ToArrayBuffer(b64){
const bin=atob(b64);
const u8=new Uint8Array(bin.length);
for(let i=0;i<bin.length;i++)u8[i]=bin.charCodeAt(i);
return u8.buffer;
}

function pullPendingDNG(){
try{
const bridge=getDngBridge();
if(!bridge) return false;
}catch(e){
console.error('pullPendingDNG error:',e);
return false;
}
}

window.onExternalDNG=pullPendingDNG;

window.addEventListener('load',()=>{
setTimeout(pullPendingDNG,500);
setTimeout(pullPendingDNG,1500);

});
/* 🎨 بناء سلسلة CSS filter من خصائص الكائن */
function buildCssFilter(o){
  if(!o) return 'none';
  let s = '';
  if(o.brightness) s += 'brightness('+(100+(o.brightness||0))+'%) ';
  if(o.contrast) s += 'contrast('+(100+(o.contrast||0))+'%) ';
  if(o.saturate) s += 'saturate('+(100+(o.saturate||0))+'%) ';
  if(o.sepia) s += 'sepia('+(o.sepia||0)+'%) ';
  if(o.grayscale) s += 'grayscale('+(o.grayscale||0)+'%) ';
  if(o.hue) s += 'hue-rotate('+(o.hue||0)+'deg) ';
  if(o.blur) s += 'blur('+(o.blur||0)+'px) ';
  if(o.invert) s += 'invert('+(o.invert||0)+'%) ';
  return s.trim() || 'none';
}



(function () {

    // إنشاء نقطة حماية خاصة باستوديو المحترفين فقط
    history.pushState({ toolActive: true }, '', window.location.href);

    let exitConfirmed = false;

    window.addEventListener('popstate', function () {

        // إذا تم تأكيد الخروج، لا نعيد الحماية
        if (exitConfirmed) return;

        const stay = window.confirm(
            'تأكيد الخروج\n\nهل تريد الخروج من استوديو المحترفين؟'
        );

        if (stay) {

            // المستخدم اختار البقاء
            history.pushState(
                { toolActive: true },
                '',
                window.location.href
            );

        } else {

            // المستخدم اختار الخروج
            exitConfirmed = true;

            try {
                const pDoc = window.parent.document;

                // إغلاق نافذة استوديو المحترفين
                const sheetHost = pDoc.getElementById('sheetHost');
                if (sheetHost) {
                    sheetHost.classList.remove('open');
                }

                // إعادة شريط الأزرار السفلي إلى وضعه الطبيعي
                const primaryRow = pDoc.getElementById('primaryRow');
                if (primaryRow) {

                    primaryRow.style.display = '';
                    primaryRow.style.width = '';
                    primaryRow.style.height = '';
                    primaryRow.style.flex = '';
                    primaryRow.style.flexGrow = '';
                    primaryRow.style.gridTemplateColumns = '';
                    primaryRow.style.justifyContent = '';
                    primaryRow.style.alignItems = '';

                    const buttons = primaryRow.querySelectorAll(
                        'button, .toolBtn, .tool-btn'
                    );

                    buttons.forEach(function (btn) {
                        btn.style.width = '';
                        btn.style.height = '';
                        btn.style.flex = '';
                        btn.style.flexGrow = '';
                        btn.style.gridColumn = '';
                        btn.style.display = '';
                    });
                }

            } catch (err) {

                // في حالة عدم وجود parent
                const sheetHost = document.getElementById('sheetHost');
                if (sheetHost) {
                    sheetHost.classList.remove('open');
                }

                const primaryRow = document.getElementById('primaryRow');
                if (primaryRow) {
                    primaryRow.style.display = '';
                    primaryRow.style.width = '';
                    primaryRow.style.height = '';
                    primaryRow.style.flex = '';
                    primaryRow.style.flexGrow = '';
                }
            }
        }
    });

})();
