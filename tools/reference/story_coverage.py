import os,re,json
base=r'G:\Визуальная новела 2.0'
root=os.path.join(base,[d for d in os.listdir(base) if d.startswith('02_')][0])
src=os.path.join(base,[d for d in os.listdir(base) if d.startswith('Оригинал')][0],'work_novela','2WorkNovela','renpy_project','The Ghosts of the Wesenberg Quarter','game','script.rpy')
L=open(src,encoding='utf-8-sig').read().split('\n')
s=open(os.path.join(root,'js','original_story.js'),encoding='utf-8').read()
data=json.loads(s[s.find('{'):s.rfind(';')])
def walk(ns):
    for n in ns:
        yield n
        if n.get('type')=='if':
            for b in n['branches']: yield from walk(b['nodes'])
        elif n.get('type')=='menu':
            for o in n['options']: yield from walk(o['nodes'])
def norm(x):
    x=x.replace('{name}','[player_name]').replace('{tname}','[t_name]')
    x=re.sub(r'\{/?(?:i|b|u|s|color|size|font|a|alpha|k|plain|nw|cps|space|vspace)\b[^}]*\}','',x)
    x=x.replace('\\n',' ')
    return re.sub(r'\s+',' ',x).strip()
data_text=set()
for v in data['labels'].values():
    for n in walk(v['nodes']):
        if n.get('type')=='say': data_text.add(norm(n.get('text','')))
        elif n.get('type')=='menu':
            if n.get('prompt'): data_text.add(norm(n['prompt']))
            for o in n['options']: data_text.add(norm(o['label']))
in_label=True; skip_paren=0; total=0; unique=set(); missing=[]
for i,l in enumerate(L):
    raw=l.replace('\t','    '); st=raw.strip()
    if raw.startswith('label '): in_label=True; skip_paren=0; continue
    if raw.startswith(('screen ','init ','style ','transform ','image ','define ','default ','layeredimage ','translate ','python ')):
        in_label=False; skip_paren=0; continue
    if not in_label: continue
    if skip_paren:
        skip_paren += st.count('(') - st.count(')')
        if skip_paren < 0: skip_paren=0
        continue
    if st.startswith('$') and ('renpy.input' in st or st.rstrip().endswith('(')):
        skip_paren = st.count('(') - st.count(')')
        if skip_paren < 0: skip_paren=0
        continue
    m=re.match(r'^(?:"((?:[^"\\]|\\.)*)"|([A-Za-z_][\w]*)\s+"((?:[^"\\]|\\.)*)")',st)
    if not m: continue
    txt=m.group(1) if m.group(1) is not None else m.group(3)
    txt=txt.replace('\\"','"').strip()
    if txt in ('fill','dismiss','titri_3') or txt.startswith('#'): continue
    n=norm(txt)
    if not n: continue
    total+=1; unique.add(n)
    if n not in data_text: missing.append((i+1,n))
print('source story strings',total,'unique',len(unique))
print('missing story strings',len(missing))
for ln,x in missing[:10]: print(ln,repr(x))
print('coverage',round(100*(len(unique)-len(missing))/max(1,len(unique)),2),'%')
