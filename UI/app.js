// VU Shuttle — shared interactions

function getQueryParam(name){
  var search = window.location.search.substring(1);
  var pairs = search.split('&');
  for(var i = 0; i < pairs.length; i++){
    var kv = pairs[i].split('=');
    if(decodeURIComponent(kv[0]) === name){
      return kv[1] ? decodeURIComponent(kv[1]) : '';
    }
  }
  return null;
}

function initLoadingRedirect(successUrl, failUrl, delayMs){
  var shouldFail = getQueryParam('fail') === '1';
  window.setTimeout(function(){
    window.location.href = shouldFail ? failUrl : successUrl + (getQueryParam('demo')==='1' ? '?demo=1' : '');
  }, delayMs || 1800);
}

function initLiveClock(elId){
  var el = document.getElementById(elId);
  if(!el) return;
  function render(){
    var now = new Date();
    el.textContent = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }
  render();
  window.setInterval(render, 15000);
}

function checkLogin(mobile, password, correctMobile, correctPassword, successUrl, failUrl){
  if(mobile === correctMobile && password === correctPassword){
    window.location.href = successUrl;
  } else {
    window.location.href = failUrl;
  }
}

var TIMETABLES = {
  morning: {
    label: 'Morning Bus',
    depart: 'Departs Karjat Railway Station at 8:00 AM',
    stops: [
      ['Karjat Railway Station','8:00 AM'],
      ['Karjat Bus Stand','8:03 AM'],
      ['Karjat Phata','8:08 AM'],
      ['Halivali','8:14 AM'],
      ['Chowk Road Junction','8:20 AM'],
      ['Ambivali Naka','8:30 AM'],
      ['Ambivali Village','8:35 AM'],
      ['Solpada Dam Road','8:42 AM'],
      ['Jamrung Phata','8:50 AM'],
      ['Vijaybhoomi University (Main Gate)','8:58 AM']
    ]
  },
  evening: {
    label: 'Evening Bus',
    depart: 'Departs Vijaybhoomi University at 5:00 PM',
    stops: [
      ['Vijaybhoomi University (Main Gate)','5:00 PM'],
      ['Jamrung Phata','5:08 PM'],
      ['Solpada Dam Road','5:16 PM'],
      ['Ambivali Village','5:23 PM'],
      ['Ambivali Naka','5:28 PM'],
      ['Chowk Road Junction','5:38 PM'],
      ['Halivali','5:44 PM'],
      ['Karjat Phata','5:50 PM'],
      ['Karjat Bus Stand','5:55 PM'],
      ['Karjat Railway Station','5:58 PM']
    ]
  }
};

function renderTimetable(containerId, titleId, subId){
  var trip = getQueryParam('trip') === 'evening' ? 'evening' : 'morning';
  var data = TIMETABLES[trip];
  document.getElementById(titleId).textContent = data.label;
  document.getElementById(subId).textContent = data.depart;
  var container = document.getElementById(containerId);
  var html = '';
  data.stops.forEach(function(s, i){
    var isFirst = i === 0;
    var isLast = i === data.stops.length - 1;
    html += '<div class="timeline-item' + (isLast ? ' last' : '') + '">' +
              '<div class="tl-marker">' +
                '<span class="tl-dot' + (isFirst ? ' start' : '') + (isLast ? ' end' : '') + '"></span>' +
                (isLast ? '' : '<span class="tl-line"></span>') +
              '</div>' +
              '<div class="tl-content">' +
                '<p class="tl-name">' + s[0] + '</p>' +
                '<p class="tl-time">' + s[1] + '</p>' +
              '</div>' +
            '</div>';
  });
  container.innerHTML = html;
}

function initEtaCountdown(elId, startSeconds){
  var el = document.getElementById(elId);
  if(!el) return;
  var remaining = startSeconds;
  function render(){
    var m = Math.floor(remaining/60);
    var s = remaining%60;
    el.textContent = m + ":" + (s<10 ? "0"+s : s) + " min";
  }
  render();
  window.setInterval(function(){
    if(remaining > 15){
      remaining -= 1;
      render();
    }
  }, 1000);
}

function initStopSearch(inputId, listSelector, emptyHintId){
  var input = document.getElementById(inputId);
  if(!input) return;
  var emptyHint = document.getElementById(emptyHintId);
  input.addEventListener('input', function(){
    var q = input.value.trim().toLowerCase();
    var items = document.querySelectorAll(listSelector);
    var visibleCount = 0;
    Array.prototype.forEach.call(items, function(item){
      var name = item.getAttribute('data-name').toLowerCase();
      var match = name.indexOf(q) !== -1;
      item.style.display = match ? 'flex' : 'none';
      if(match) visibleCount++;
    });
    if(emptyHint){
      emptyHint.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  });
}

function initNearestStopToggle(toggleSelector, listSelector, totalKm){
  var buttons = Array.prototype.slice.call(document.querySelectorAll(toggleSelector));
  var container = document.querySelector(listSelector);
  if(!container) return;

  function apply(ref){
    var items = Array.prototype.slice.call(container.querySelectorAll('.stop-item'));
    items.forEach(function(item){
      var base = parseFloat(item.getAttribute('data-distance'));
      var value = ref === 'campus' ? (totalKm - base) : base;
      item.querySelector('.dist').textContent = value.toFixed(1) + ' km';
      item.setAttribute('data-current-dist', value.toFixed(2));
    });
    items.sort(function(a, b){
      return parseFloat(a.getAttribute('data-current-dist')) - parseFloat(b.getAttribute('data-current-dist'));
    });
    items.forEach(function(item){ container.appendChild(item); });
  }

  buttons.forEach(function(btn){
    btn.addEventListener('click', function(){
      buttons.forEach(function(b){ b.classList.remove('active'); });
      btn.classList.add('active');
      apply(btn.getAttribute('data-ref'));
    });
  });

  apply('karjat');
}

function showToast(id, duration){
  var el = document.getElementById(id);
  if(!el) return;
  el.classList.add('show');
  window.setTimeout(function(){
    el.classList.remove('show');
  }, duration || 3200);
}

/* ---------- v2: live trip engine, planner, notifications ---------- */
var STOP_KM=[0,1.2,3.4,6.1,9.8,15.2,17.0,21.5,26.3,30.0];
var STOP_XY=[[40,200],[52,196.4],[74,189.8],[101,181.7],[138,170.6],[192,154.4],[210,149],[255,135.5],[303,121.1],[340,110]];

function toMin(t){var m=t.match(/(\d+):(\d+) (AM|PM)/);return (+m[1]%12+(m[3]==='PM'?12:0))*60+ +m[2];}

// Real clock by default. With ?demo=1 a simulated morning trip loops (1 sim-minute = 2 real seconds).
function nowMin(){
  if(getQueryParam('demo')==='1'){
    if(!window._demo0) window._demo0=Date.now();
    return 480+(((Date.now()-window._demo0)/2000)%58);
  }
  var d=new Date();return d.getHours()*60+d.getMinutes()+d.getSeconds()/60;
}

function getTripState(){
  var t=nowMin();
  for(var k in TIMETABLES){
    var times=TIMETABLES[k].stops.map(function(s){return toMin(s[1]);});
    if(t>=times[0] && t<times[times.length-1]){
      var i=0; while(times[i+1]<=t) i++;
      return {key:k,times:times,i:i,next:i+1,frac:(t-times[i])/(times[i+1]-times[i]),eta:(times[i+1]-t)*60};
    }
  }
  return null;
}

function fmtEta(sec){sec=Math.max(0,Math.round(sec));var m=Math.floor(sec/60),s=sec%60;return m+':'+(s<10?'0'+s:s)+' min';}

function initHomeLive(){
  var st=getTripState();
  var t=document.getElementById('live-title'),sub=document.getElementById('live-sub'),eta=document.getElementById('live-eta');
  function render(){
    st=getTripState();
    if(st){
      var d=TIMETABLES[st.key];
      t.textContent=d.label+' is running';
      sub.textContent='Next stop: '+d.stops[st.next][0];
      eta.textContent=fmtEta(st.eta);
    } else {
      var n=nowMin(), nxt=n<480?'Morning Bus at 8:00 AM':(n<1020?'Evening Bus at 5:00 PM':'Morning Bus at 8:00 AM (tomorrow)');
      t.textContent='No bus running now';
      sub.textContent='Next: '+nxt;
      eta.textContent='--';
    }
  }
  render(); window.setInterval(render,1000);
}

function initLiveMap(){
  var NS='http://www.w3.org/2000/svg';
  var g=document.getElementById('stops'), bus=document.getElementById('bus');
  var built=null;
  function ph(j,key){return key==='evening'?9-j:j;}
  function build(key){
    var d=TIMETABLES[key], pts=[], html='';
    for(var j=0;j<10;j++) pts.push(STOP_XY[ph(j,key)]);
    document.getElementById('route').setAttribute('d','M'+pts.map(function(p){return p.join(',');}).join(' L'));
    d.stops.forEach(function(s,j){
      var p=pts[j], major=(j===0||j===9);
      html+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="'+(major?6:3.5)+'" fill="'+(j===0?'#E8A33D':(j===9?'#2F8F5B':'#1B4B66'))+'"/>';
    });
    g.innerHTML=html;
    document.getElementById('dir').innerHTML=(key==='morning'?'Karjat Railway Station &rarr; Vijaybhoomi University':'Vijaybhoomi University &rarr; Karjat Railway Station')+' &middot; ~30 km';
    document.getElementById('trip-name').textContent=d.label+' route';
    built=key;
  }
  function tick(){
    var st=getTripState();
    if(!st){window.location.replace('live-map-no-data.html');return;}
    if(built!==st.key) build(st.key);
    var d=TIMETABLES[st.key], a=STOP_XY[ph(st.i,st.key)], b=STOP_XY[ph(st.next,st.key)];
    bus.setAttribute('transform','translate('+(a[0]+(b[0]-a[0])*st.frac)+','+(a[1]+(b[1]-a[1])*st.frac)+')');
    document.getElementById('eta-label').textContent='Next arrival at '+d.stops[st.next][0];
    document.getElementById('eta').textContent=fmtEta(st.eta);
    var html='';
    d.stops.forEach(function(s,j){
      var cls=j<=st.i?'passed':(j===st.next?'next':'');
      html+='<div class="rt-item '+cls+'"><span class="rt-dot"></span><span class="rt-name">'+s[0]+'</span><span class="rt-time">'+(j<=st.i?'Departed':s[1])+'</span></div>';
    });
    document.getElementById('route-list').innerHTML=html;
  }
  tick(); window.setInterval(tick,1000);
}

function initRoutePlanner(fromId,toId,resId){
  var names=TIMETABLES.morning.stops.map(function(s){return s[0];});
  var dl=document.getElementById('stop-names');
  if(dl) dl.innerHTML=names.map(function(n){return '<option value="'+n+'">';}).join('');
  var f=document.getElementById(fromId), t=document.getElementById(toId), r=document.getElementById(resId);
  function find(v){
    v=v.trim().toLowerCase(); if(!v) return -1;
    for(var i=0;i<names.length;i++) if(names[i].toLowerCase()===v) return i;
    for(var j=0;j<names.length;j++) if(names[j].toLowerCase().indexOf(v)!==-1) return j;
    return -1;
  }
  function update(){
    var a=find(f.value), b=find(t.value);
    if(!f.value.trim()||!t.value.trim()){r.innerHTML='Choose a start and an end point to see the distance.';return;}
    if(a<0||b<0){r.innerHTML='Stop not found. Try another name.';return;}
    if(a===b){r.innerHTML='Start and end are the same stop.';return;}
    var km=Math.abs(STOP_KM[a]-STOP_KM[b]);
    var mins=Math.abs(toMin(TIMETABLES.morning.stops[a][1])-toMin(TIMETABLES.morning.stops[b][1]));
    r.innerHTML='<b class="pl-km">'+km.toFixed(1)+' km</b><span>'+names[a]+' &rarr; '+names[b]+'<br>'+Math.abs(a-b)+' stop(s) apart &middot; ~'+mins+' min by shuttle</span>';
  }
  f.addEventListener('input',update); t.addEventListener('input',update);
  f.addEventListener('change',update); t.addEventListener('change',update);
}
function swapPlanner(a,b){
  var x=document.getElementById(a), y=document.getElementById(b), v=x.value;
  x.value=y.value; y.value=v; x.dispatchEvent(new Event('input'));
}

var NOTIFS=[
  {type:'delay',title:'Morning bus running 8 min late',body:'Heavy traffic near Chowk Road Junction. Arrival at Ambivali Naka is now about 8:38 AM.',ago:4},
  {type:'problem',title:'Road work at Halivali',body:'One lane is closed. Buses may take a few extra minutes between Karjat Phata and Halivali.',ago:35},
  {type:'route',title:'Temporary stop change',body:'Solpada Dam Road stop moves about 100 m ahead until Friday due to repairs.',ago:180},
  {type:'ok',title:'Evening bus was on time',body:'The 5:00 PM trip reached Karjat Railway Station on schedule.',ago:1440}
];
var NOTIF_ICON={delay:'&#9201;',problem:'&#9888;',route:'&#8631;',ok:'&#10003;'};
function agoText(m){return m<60?m+' min ago':(m<1440?Math.round(m/60)+' hr ago':'Yesterday');}
function renderNotifications(id){
  document.getElementById(id).innerHTML=NOTIFS.map(function(n){
    return '<div class="n-item"><span class="n-ic n-'+n.type+'">'+NOTIF_ICON[n.type]+'</span><div><p class="n-title">'+n.title+'</p><p class="n-body">'+n.body+'</p><p class="n-time">'+agoText(n.ago)+'</p></div></div>';
  }).join('');
}
function initHomeNotifs(toastId,badgeId){
  var alerts=NOTIFS.filter(function(n){return n.type!=='ok';});
  var b=document.getElementById(badgeId); if(b) b.textContent=alerts.length;
  var el=document.getElementById(toastId); if(!el) return;
  el.querySelector('.tmsg').textContent=NOTIFS[0].title;
  el.onclick=function(){window.location.href='notifications.html';};
  window.setTimeout(function(){showToast(toastId,4500);},700);
}
