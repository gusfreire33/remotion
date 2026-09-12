const {openBrowser}=require('@remotion/renderer');
const fs=require('fs');
const path=require('path');
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
(async()=>{
  const browser=await openBrowser('chrome');
  try{
    const page=await browser.newPage({context:()=>null,logLevel:'error',indent:false,pageIndex:0,onBrowserLog:null,onLog:()=>{}});
    const errors=[];
    page.on('error',e=>errors.push(String(e)));
    await page.setViewport({width:1440,height:1100,deviceScaleFactor:1});
    await page.goto({url:'http://localhost:3005/Reels30Framework2',timeout:120000});
    let ready=false;
    for(let i=0;i<60;i++){
      ready=await page.evaluate(()=>Boolean(document.querySelector('[aria-label="Play"]:not([disabled])')));
      if(ready)break;
      await sleep(1000);
    }
    if(!ready)throw new Error('Studio player did not become ready');
    console.log('STUDIO READY');
    const client=page._client();
    const before=await page.evaluate(()=>({videos:[...document.querySelectorAll('video')].map(v=>({src:v.currentSrc,time:v.currentTime,muted:v.muted,error:v.error?.message})),buttons:[...document.querySelectorAll('button')].map(b=>({label:b.getAttribute('aria-label'),title:b.title})).filter(b=>/mute|volume/i.test(b.label+' '+b.title))}));
    console.log('BEFORE',JSON.stringify(before));
    const point=await page.evaluate(()=>{
      const unmute=document.querySelector('[aria-label="Unmute"]');if(unmute)unmute.click();
      const b=document.querySelector('[aria-label="Play"]');const r=b.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};
    });
    await client.send('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...point});
    await client.send('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...point});
    const checkpoints=[];
    for(let i=0;i<30;i++){
      await sleep(3000);
      const state=await page.evaluate(()=>({playing:Boolean(document.querySelector('[aria-label="Pause"]')),unmuted:Boolean(document.querySelector('[aria-label="Mute video"]')),videos:[...document.querySelectorAll('video')].map(v=>({src:v.currentSrc,time:v.currentTime,muted:v.muted,error:v.error?.message})),errorText:document.body.innerText.includes('Error occurred')}));
      checkpoints.push(state);
      console.log('PLAYBACK',JSON.stringify(state));
      if(state.videos.some(v=>v.time>21.2))break;
    }
    const shot=await client.send('Page.captureScreenshot',{format:'png'});
    fs.writeFileSync(path.join(process.cwd(),'out','reels30','studio-review.png'),Buffer.from(shot.value.data,'base64'));
    fs.writeFileSync(path.join(process.cwd(),'out','reels30','studio-qa.json'),JSON.stringify({errors,checkpoints},null,2));
    if(errors.length||checkpoints.some(c=>c.errorText||c.videos.some(v=>v.error)))throw new Error('Studio reported playback errors');
    // @remotion/media renders the source via canvas/WebAudio, while the
    // foreground OffthreadVideo uses a muted native <video> in Studio.
    if(!checkpoints.some(c=>c.unmuted&&c.videos.some(v=>v.time>21.2)))throw new Error('Could not confirm full playback with Studio audio enabled');
    console.log('STUDIO PLAYBACK OK');
  }finally{await browser.close({silent:true});}
})().catch(e=>{console.error(e);process.exit(1)});
