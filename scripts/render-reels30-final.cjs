// Final 4K export, explicitly approved by the owner after the complete preview.
const path = require('path');
const fs = require('fs');
const {bundle} = require('@remotion/bundler');
const {enableTailwind} = require('@remotion/tailwind-v4');
const {openBrowser,selectComposition,renderStill,renderMedia} = require('@remotion/renderer');
const ROOT=process.cwd();
const OUT=path.join(ROOT,'out','reels30');
const ASSETS=path.join(OUT,'master-assets');
const BUNDLE=path.join(OUT,'bundle-final');
const OUTPUT=path.join(OUT,'Reels30-Framework2-FINAL-4K.mp4');
const inputProps={master4k:true};
const PORT=3406;

(async()=>{
  if(fs.existsSync(OUTPUT))throw new Error('Final already exists; inspect before replacing it.');
  fs.mkdirSync(path.join(ASSETS,'reels30'),{recursive:true});
  fs.mkdirSync(path.join(ASSETS,'sfx'),{recursive:true});
  // Bundle only this Reels' assets, not the older long VSLs in public/.
  for(const file of ['source4k.mp4','matte4k.webm']){
    fs.copyFileSync(path.join(ROOT,'public','reels30',file),path.join(ASSETS,'reels30',file));
  }
  for(const file of ['whoosh','glitch','boom','tick','click','pop','impact','ding']){
    fs.copyFileSync(path.join(ROOT,'public','sfx',file+'.wav'),path.join(ASSETS,'sfx',file+'.wav'));
  }
  await bundle({entryPoint:path.join(ROOT,'src','index.ts'),outDir:BUNDLE,publicDir:ASSETS,webpackOverride:enableTailwind});
  const browser=await openBrowser('chrome');
  try{
    const composition=await selectComposition({serveUrl:BUNDLE,id:'Reels30Framework2',inputProps,port:PORT,puppeteerInstance:browser,timeoutInMilliseconds:120000});
    for(const frame of [38,417,628]){
      await renderStill({serveUrl:BUNDLE,composition,inputProps,frame,scale:2,imageFormat:'png',output:path.join(OUT,`master-still-${frame}.png`),port:PORT,puppeteerInstance:browser,timeoutInMilliseconds:120000});
      console.log('4K STILL '+frame);
    }
    let last=-1;
    await renderMedia({serveUrl:BUNDLE,composition,inputProps,codec:'h264',outputLocation:OUTPUT,
      scale:2,crf:17,pixelFormat:'yuv420p',imageFormat:'jpeg',jpegQuality:98,
      audioBitrate:'320k',enforceAudioTrack:true,colorSpace:'bt709',concurrency:2,
      port:PORT,puppeteerInstance:browser,offthreadVideoCacheSizeInBytes:1024*1024*1024,
      timeoutInMilliseconds:120000,
      onProgress:({progress,renderedFrames})=>{const pct=Math.floor(progress*20)*5;if(pct!==last){last=pct;console.log(`FINAL 4K ${pct}% (${renderedFrames}/645)`);}}
    });
    console.log('FINAL 4K READY: '+OUTPUT);
  }finally{await browser.close({silent:true});}
})().catch(e=>{console.error(e);process.exit(1);});
