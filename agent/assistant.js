'use strict';
(() => {
  const root = document.querySelector('[data-portfolio-agent]');
  if (!root) return;
  const endpoint = root.dataset.endpoint || '';
  const preview = root.dataset.preview === 'true';
  const active = Boolean(endpoint && new URL(endpoint,location.href).protocol === 'https:');
  const dialog = document.querySelector('#portfolio-agent');
  const log = document.querySelector('#agent-log');
  const form = document.querySelector('#agent-form');
  const input = document.querySelector('#agent-question');
  const send = form.querySelector('button[type="submit"]');
  const status = document.querySelector('#agent-status');
  let trigger, pending=false, chatController;
  const history=[];
  const setBusy = value => {pending=value;input.disabled=value;send.disabled=value||!active;form.setAttribute('aria-busy',String(value));};
  setBusy(false);
  const node = (tag,text,className) => {const el=document.createElement(tag);if(text)el.textContent=text;if(className)el.className=className;return el;};
  const allowedURL = value => {
    try {const u=new URL(value);return u.protocol==='https:' && ['nagoor06.github.io','github.com','ieeexplore.ieee.org','logic-lens-five.vercel.app'].includes(u.hostname)?u.href:null;}catch{return null;}
  };
  const append = (role,text,sources=[]) => {
    const bubble=node('div',text,`agent-bubble ${role}`);
    bubble.setAttribute('aria-label',role==='user'?'Your question':'Portfolio assistant');
    if(sources.length){const list=node('div','', 'agent-sources');for(const source of sources){const url=allowedURL(source.url);if(!url)continue;const a=node('a',source.title);a.href=url;a.target='_blank';a.rel='noopener noreferrer';list.append(a);}bubble.append(list);}
    log.append(bubble);log.scrollTop=log.scrollHeight;
    return bubble;
  };
  async function request(mode,message,previous=[]) {
    const controller=new AbortController();if(mode==='ask')chatController=controller;const timeout=setTimeout(()=>controller.abort(),30000);
    try {
      const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({mode,message,history:previous}),credentials:'omit',signal:controller.signal});
      const data=await response.json();
      if(!response.ok)throw new Error(data.error||'The assistant could not answer. Please try again.');
      if(typeof data.answer!=='string'||!Array.isArray(data.sources))throw new Error('An incomplete answer was returned. Please retry.');
      return data;
    } finally {clearTimeout(timeout);}
  }
  document.querySelectorAll('[data-open-agent]').forEach(button=>button.addEventListener('click',()=>{trigger=button;dialog.showModal();document.body.classList.add('modal-open');input.focus();}));
  dialog.querySelector('.agent-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>{chatController?.abort();document.body.classList.remove('modal-open');trigger?.focus({preventScroll:true});});
  document.querySelectorAll('[data-agent-question]').forEach(button=>button.addEventListener('click',()=>{input.value=button.dataset.agentQuestion;input.focus();}));
  form.addEventListener('submit',async event=>{
    event.preventDefault();if(pending||!active||!form.reportValidity())return;
    const message=input.value.trim();if(message.length<2)return;
    setBusy(true);status.textContent='Looking through Nagoor’s published work…';
    append('user',message);
    try{
      const data=await request('ask',message,history.slice(-6));
      const bubble=append('assistant',data.answer,data.sources);
      if(data.action && allowedURL(data.action.url)){const link=node('a',data.action.title);link.href=allowedURL(data.action.url);link.className='text-link';link.target='_blank';link.rel='noopener noreferrer';bubble.append(document.createElement('br'),link);}
      history.push({role:'user',content:message},{role:'assistant',content:data.answer.slice(0,1800)});
      input.value='';status.textContent='Answer ready. Source links are included.';
    }catch(error){status.textContent=error.name==='AbortError'?'The request stopped. Your question is still here.':error.message;}finally{setBusy(false);}
  });
  const fitForm=document.querySelector('#role-fit-form');
  const fitButton=fitForm.querySelector('button[type="submit"]');
  fitButton.disabled=!active;
  const fitStatus=document.querySelector('#fit-status');
  const fitResults=document.querySelector('#fit-results');
  const showFit=data=>{
    fitResults.replaceChildren(node('p',data.answer));
    if(data.matches?.length){fitResults.append(node('h3','Relevant evidence'));for(const match of data.matches){const card=node('div','','fit-match');card.append(node('strong',match.requirement),node('p',match.evidence));const source=data.sources.find(s=>s.id===match.source_id);if(source&&allowedURL(source.url)){const a=node('a',`View ${source.title}`);a.href=source.url;a.target='_blank';a.rel='noopener noreferrer';card.append(a);}fitResults.append(card);}}
    if(data.gaps?.length){fitResults.append(node('h3','What still needs confirming'));for(const gap of data.gaps)fitResults.append(node('p',gap,'fit-gap'));}
  };
  fitForm.addEventListener('submit',async event=>{
    event.preventDefault();if(!active||fitButton.disabled||!fitForm.reportValidity())return;
    fitButton.disabled=true;fitStatus.textContent='Matching requirements to published evidence…';fitForm.setAttribute('aria-busy','true');
    try{const data=await request('fit',document.querySelector('#role-description').value);showFit(data);fitStatus.textContent='Evidence summary ready. This is not a hiring score.';}catch(error){fitStatus.textContent=error.message;}finally{fitButton.disabled=false;fitForm.setAttribute('aria-busy','false');}
  });
  if(preview){
    status.textContent='Design preview: the AI backend is not connected.';
    fitStatus.textContent='AI matching becomes available after backend activation.';
    document.querySelector('#preview-example')?.addEventListener('click',()=>{
      append('user','What Python and AI work has Nagoor built?');
      append('assistant','Example answer — design preview\n\nLogic Lens combines a Python FastAPI backend with a React interface for LLM-powered code reviews. Its optional retrieval implementation uses document embeddings and PostgreSQL with pgvector. CommuteCircle also uses FastAPI, with its core ride-listing flow still in development.',[{title:'Logic Lens build notes',url:'https://nagoor06.github.io/#logic-lens'},{title:'CommuteCircle progress',url:'https://nagoor06.github.io/#commutecircle'}]);
      dialog.showModal();document.body.classList.add('modal-open');log.scrollTop=log.scrollHeight;
    });
  }
})();
