(function(){'use strict';
var W={
// CBSE 10 Online — Maths & Core
'best online tuition for class 10 cbse':'Best Online Tuition for CBSE Class 10 — Small Batches in Hyderabad',
'best online classes for class 10 cbse':'Best Online Classes for CBSE Class 10 — Small Batches in Hyderabad',
'online tuition for class 10 cbse':'Online Tuition for CBSE Class 10 — Small Batches in Hyderabad',
'cbse class 10 online tuition':'CBSE Class 10 Online Tuition — Small Batches in Hyderabad',
'cbse tuition online':'CBSE Tuition Online — Small Batches of 3–5 in Hyderabad',
'online tuition classes for class 10 cbse':'Online Tuition Classes for CBSE Class 10 — Small Batches in Hyderabad',
'online classes for class 10 cbse':'Online Classes for CBSE Class 10 — Small Batches in Hyderabad',
// CBSE 10 Online — Maths Tuition
'online maths tuition for class 10':'Online Maths Tuition for Class 10 — Small Batches of 3–5 in Hyderabad',
'online maths tuition near me':'Maths Tuition in Jubilee Hills — Online + In-Person, Class 10',
'online maths and science tuition':'Online Maths and Science Tuition — Small Batches of 3–5 in Hyderabad',
'online maths tuition for class 10 cbse':'Online Maths Tuition for CBSE Class 10 — Small Batches in Hyderabad',
'maths tuition online':'Online Maths Tuition — Small Batches of 3–5 for Class 10, Hyderabad',
'best online maths tuition':'Best Online Maths Tuition — Small Batches of 3–5 in Hyderabad',
// CBSE 10 Online — Science Tuition
'online science tuition for class 10':'Online Science Tuition for Class 10 — Small Batches in Hyderabad',
'cbse science tuition online':'CBSE Science Tuition Online — Small Batches of 3–5 in Hyderabad',
'class 10 science tuition online':'Class 10 Science Tuition Online — Small Batches in Hyderabad',
'online science tuition for class 10 cbse':'Online Science Tuition for CBSE Class 10 — Small Batches in Hyderabad',
'science tutor for class 10':'Science Tutor for Class 10 — Small Batches in Hyderabad',
'online science tuition class 10':'Online Science Tuition for Class 10 — Small Batches in Hyderabad',
'science tuition for class 10':'Science Tuition for Class 10 — Small Batches in Hyderabad',
'online science tuition for class 10':'Online Science Tuition for Class 10 — Small Batches in Hyderabad',
// Broad match / Semrush high-volume variations
'tuition near me for class 10':'Class 10 Tuition in Hyderabad — Small Batches of 3–5, Jubilee Hills',
'best tuition near me for class 10':'Best Class 10 Tuition in Hyderabad — Small Batches of 3–5',
'class 10 tuition near me':'Class 10 Tuition in Hyderabad — Small Batches of 3–5, Jubilee Hills',
'tuition centre near me for class 10':'Class 10 Tuition Centre in Jubilee Hills — Small Batches of 3–5',
'tuition for class 10 near me':'Class 10 Tuition Near You in Hyderabad — Small Batches of 3–5',
'maths tuition near me class 10':'Class 10 Maths Tuition in Hyderabad — Small Batches of 3–5',
'science tuition for class 10 near me':'Class 10 Science Tuition in Hyderabad — Small Batches of 3–5',
'online tuition for class 10':'Online Tuition for Class 10 — Small Batches of 3–5 in Hyderabad',
'cbse maths tuition near me':'CBSE Maths Tuition in Jubilee Hills — Small Batches of 3–5',
'maths tuition near me':'Maths Tuition in Jubilee Hills, Hyderabad — Small Batches of 3–5',
'tuition centre near me':'Tuition Centre in Jubilee Hills, Hyderabad — Small Batches of 3–5',
'best tuition for class 10 near me':'Best Class 10 Tuition in Hyderabad — Small Batches of 3–5',
'tuition for class 10':'Class 10 Tuition — Small Batches of 3–5 in Hyderabad',
'best tuition for class 10':'Best Class 10 Tuition — Small Batches of 3–5 in Hyderabad',
'maths and science tuition near me':'Maths and Science Tuition in Jubilee Hills — Small Batches of 3–5'
};
function g(){var s=location.search;if(typeof URLSearchParams!=='undefined')try{return new URLSearchParams(s).get('utm_term')}catch(e){}var m=/[?&]utm_term=([^&]*)/.exec(s);if(!m)return null;try{return decodeURIComponent(m[1].replace(/\+/g,' '))}catch(e){return null}}
function d(){var e=document.getElementById('hero-h1');if(!e)return;var t=g();if(!t)return;var x=W[t.toLowerCase().trim()];if(x)e.textContent=x}
function b(){var L=document.querySelectorAll('a[href^="#"]'),i=0;for(;i<L.length;i++)L[i].addEventListener('click',function(ev){var id=this.getAttribute('href').slice(1),T=document.getElementById(id);if(T){ev.preventDefault();T.scrollIntoView({behavior:'smooth',block:'start'});history.replaceState(null,'','#'+id)}})}
requestAnimationFrame(d);b()})();
