import D from"contentful-export";async function _(e){await D(e)}import*as m from"fs";import*as G from"prettier";function F(e){return e&&e[0].toUpperCase()+e.slice(1)}function C(e){return Array.isArray(e)}function K(e){typeof e=="object"&&C(e)}function P(e){return C(e)||K(e)}import*as h from"fs";var O="/api/contentful",M=`${O}/data/contentful-export.json`,U=`${O}/contentEntries.json`,x=(e,o)=>e.find(c=>c.sys.id===o)??null;function b(){let{entries:e,assets:o}=JSON.parse(h.readFileSync(__dirname+M).toString())??{},c=JSON.parse(h.readFileSync(__dirname+O+"/locales.json").toString()),i=o?JSON.parse(JSON.stringify(o).replaceAll(/\/\/images/gi,"images")):null,p=[...e,...i],y=s=>x(p,s),r=(s,t)=>{let n=y(s);if(!n)return null;let l=Object.keys(n.fields);return{...n,fields:l.reduce((a,T)=>{let d=n.fields[T];return{...a,[T]:!d[t].sys&&!C(d[t])?d:C(d[t])?d[t].map(u=>u.sys?r(u.sys.id,t)?.fields:u):d[t].sys?r(d[t].sys.id,t).fields:d[t]}},{})}},f=(s,t=!1,n)=>{let l=s;if(P(s)){if(C(s))l=s.map(a=>{let{sys:T}=a,d=T?r(T.id,n):a;return d?t&&T?d.fields:d:null}).filter(Boolean);else if(s.sys){let a=r(s.sys.id,n);a?l=t?a.fields:a:l=null}}return l};if(p){let s=p.map(({fields:t,...n})=>{let l=Object.keys(t).reduce((a,T)=>({...a,[T]:c.reduce((d,{code:u})=>{let v=t[T][u];return{...d,[u]:f(v,!0,u)}},{})}),{});return{...n,fields:l}});h.writeFileSync(__dirname+U,JSON.stringify(s,null,2))}}var $="/api/contentful",z=`${$}/data/contentful-export.json`,J=`${$}/contentTypes.json`,W=`${$}/locales.json`,q=`${$}/locales.ts`,H=`${$}/contentTypes.ts`,L=e=>{throw new Error(`Seems like file is empty or doesnt exist: ${e}`)};function j(e,o,c){let i=c.arrayTypeItems?c?.arrayTypeItems?.reduce((y,r,f,s)=>y+(r==="string"?r:`CContentTypes<L>['${r}']${f!==s.length-1?" | ":""}
`),""):!1,p=c.validationTypes?c?.validationTypes?.reduce((y,r,f,s)=>y+(r==="string"?r:`CContentTypes<L>['${r}']${f!==s.length-1?" | ":""}
`),""):!1;return{Array:i?`Array<${i}>`:o,Link:c.linkType==="Entry"?p||`CT${F(e)}<L>`:`${c.linkType}<L>`,Integer:"number"}[o]??o}function V(e,o){return`
      export type CT${e.split(" ").join("")}<L extends CTLocales> = {
        ${Object.keys(o).reduce((c,i)=>{let p=o[i],y=p.linkType==="Asset"?j(i,p.type,p):`Record<L, ${j(i,p.type,p)}>`;return c+`${i}${p.required?"":"?"}: ${y};`},"")}
          }

          

          `}function Y(e){return`
      export type CContentTypesKeys = keyof CContentTypes<CTLocales>

      export type CContentTypes<L extends CTLocales> = {${e.reduce((o,c)=>o+`${c.contentTypeId}: CT${c.name.split(" ").join("")}<L>;`,"")}}
      
      

    `}function w(){let e=JSON.parse(m.readFileSync(__dirname+z).toString()),{contentTypes:o,locales:c}=e??{};if(c){let i=c.map(({name:y,code:r})=>({name:y,code:r})),p=`export type CTLocales = ${i.reduce((y,r,f)=>y+(f===0?`'${r.code}'`:` | '${r.code}'`),"")}`;m.writeFileSync(__dirname+W,JSON.stringify(i,null,2)),m.writeFileSync(__dirname+q,p)}else L("No locales provided");if(o){let i=o.map(({sys:p,name:y,fields:r})=>({contentTypeId:p.id,name:y,fields:r.filter(f=>!f.disabled).reduce((f,{id:s,type:t,linkType:n,required:l,items:a,validations:T})=>({...f,[s]:{type:t==="Symbol"?"string":t,required:l,linkType:n,validationTypes:x(o,s)!==null?!1:T?.[0]?.linkContentType,arrayTypeItems:(t==="Array"&&a.validations?.[0]?.linkContentType)??[a?.type==="Symbol"?"string":a?.type]}}),{})}));m.writeFileSync(__dirname+J,JSON.stringify(i,null,2))}else L("No content types provided")}function k(){let e=JSON.parse(m.readFileSync(__dirname+J).toString());if(e){let o=`// WARNING! Bear in mind this file is automatically generated.
 // DO NOT make any changes manually

`,c=`import { EntryFields, Sys } from 'contentful';
                     import RichText = EntryFields.RichText;
                     import Link = EntryFields.Link;
                     import { CTLocales } from '@api/contentful/locales';
                     
`,i=`
          export type CTEntryOfTypes<E> = CTEntry<E, CContentTypes<CTLocales>[CContentTypesKeys]>;
          export type CTEntry<E, F> = Omit<E, 'fields'> & { metadata: Record<string, unknown>, fields: F, sys: Sys };

    `,p=`
      export type Asset<L extends CTLocales> =  {
        title: Record<L, string>
        description: Record<L, string>
        file: Record<L, {
          url: string,
          details: {
            size: number,
            image: {
              width: number,
              height: number
            }
          },
          fileName: string,
          contentType: string
        }>
      }
    `,y=`${e.reduce((s,t)=>{let{name:n,fields:l}=t,a=V(n,l);return s+a},"")}`,r=__dirname+H,f=G.format(o+c+p+i+Y(e)+y,{filepath:r});m.writeFileSync(r,f)}else L("No model types provided")}import*as S from"fs";import*as I from"prettier";var g="/api/contentful",Q=`${g}/contentEntries.json`,X=`${g}/contentTypes.json`,Z=`${g}/slugs.ts`;function R(){let e=JSON.parse(S.readFileSync(__dirname+g+"/locales.json").toString()),o=JSON.parse(S.readFileSync(__dirname+Q).toString()),c=JSON.parse(S.readFileSync(__dirname+X).toString()),i=e[0].code,p=`
        export type CTSlugs = ${o.reduce((t,n,l)=>n.fields.slug?t+`${l>0?" | ":""}'${n.fields.slug?.[i]??n.fields.title?.[i]?.toLowerCase()?.replaceAll(/\'/gi,"")?.split(" ").join("-")}'`:t,"")}
    `,y=`${c.reduce((t,n)=>{let l=o.filter(a=>a.sys?.contentType?.sys?.id===n.contentTypeId);return t+`

export type CT${n.name.replace(/\s/gi,"")}Slug = ${l.length===0?"''":l.reduce((a,T,d)=>{try{return a+`${d>0?" | ":""}'${T.fields.slug[i]}'`}catch(u){console.error("ERR WHILE SLUG TYPES GEN:",u,{entry:JSON.stringify(T,null,2),idx:d})}},"")};`},"")}`,r=()=>{let t=o.filter(n=>n.sys?.type==="Asset");return`

export type CTAssetSlug = ${t.length===0?"''":`${t.reduce((n,l,a)=>n+`${a>0?" | ":""}"${l.fields.title[i]}"`,"")}`};`},f=__dirname+Z,s=I.format(p+y+r(),{filepath:f});S.writeFileSync(f,s)}import*as E from"fs";import*as B from"prettier";var A=e=>e.name.replace(/\s/gi,"");function N(e){let o=JSON.parse(E.readFileSync(__dirname+e.contentTypesJSONPath).toString()),c=JSON.parse(E.readFileSync(__dirname+e.contentEntriesJSONPath).toString()),i=s=>c.filter(t=>t.sys?.contentType?.sys?.id===s.contentTypeId).length>0,p=`
    import { CContentTypes, CContentTypesKeys, CTEntryOfTypes, CTEntry, Asset } from '@api/contentful/contentTypes';
    import { CTLocales } from '@api/contentful/locales';
    import locales from '@api/contentful/locales.json';
    import entries from '@api/contentful/contentEntries.json';
    import { CTSlugs, CTAssetSlug, ${o.reduce((s,t,n)=>i(t)?s+`CT${A(t)}Slug${n<o.length-1?", ":""}`:s,"")} } from '@api/contentful/slugs';
  `,y=`
    export const CTGetLocales = () => locales as Array<Omit<typeof locales[0], 'code'> & { code: CTLocales }>;

    export const CTGetEntryBySlug = <E extends CTEntryOfTypes<typeof entries[0]>, C extends CContentTypesKeys>(
      slug: CTSlugs,
      locale: CTLocales,
      contentType?: C,
    ) =>
      (entries as (E & CTEntry<E, CContentTypes<CTLocales>[C]>)[]).find((entry) => {
        return (contentType ? entry?.sys?.contentType?.sys?.id === contentType : true) && entry?.fields?.slug?.[locale] === slug;
      });
      
    export const CTGetAsset = (slug: CTAssetSlug, locale: CTLocales) =>
      (entries as unknown as CTEntry<{}, Asset<CTLocales>>[]).find((entry) => entry?.fields?.title?.[locale] === slug);
      
    const CTGetAllEntriesByContentType = <E extends CTEntryOfTypes<typeof entries[0]>, C extends CContentTypesKeys>(
      contentType: C,
    ) =>
      (entries as (E & CTEntry<E, CContentTypes<CTLocales>[C]>)[]).filter(
        (entry) => entry?.sys?.contentType?.sys?.id === contentType,
      );
    
    export type IGetEntries = ReturnType<typeof CTGetEntries>;
    ${o.reduce((s,t)=>{let n=A(t);return i(t)?s+`export type IGet${n}s = ReturnType<IGetEntries['get${n}s']>; 
`:s},"")}
   
      
    export const CTGetEntries = (locale?: CTLocales) => ({
      ${o.reduce((s,t)=>{let n=t.contentTypeId,l=A(t);return i(t)?s+`get${l}s: (${n}s?: CT${l}Slug[]) => !${n}s
      ? CTGetAllEntriesByContentType('${n}')
      : ${n}s?.map((${n}) => CTGetEntryBySlug(${n}, locale ?? null, '${n}')), 
`:s},"")}
    });
  `,r=__dirname+e.apiTSPath,f=B.format(p+y,{filepath:r});E.writeFileSync(r,f)}function ee(e){return this.options={},this.options.basePath=e.basePath??"/api/contentful",this.options.contentFile=e.contentFile??"contentful-export.json",this.options.exportDir=e.exportDir??`${this.options.basePath}/data`,this.options.errorLogFile=e.errorLogFile??"error.log",this.options.downloadAssets=e.downloadAssets??!0,this.options.contentEntriesJSONPath=e.contentEntriesJSONPath??`${this.options.basePath}/contentEntries.json`,this.options.contentTypesJSONPath=e.contentTypesJSONPath??`${this.options.basePath}/contentTypes.json`,this.options.apiTSPath=e.apiTSPath??`${this.options.basePath}/api.ts`,Object.assign(this.options,e),this.options}async function te(e){let o=ee(e);await _(o),w(),k(),b(),R(),N(o)}export{te as default};
//# sourceMappingURL=esm.js.map