from pathlib import Path
import re
base=Path(r'G:\Визуальная новела 2.0')
comb=base/'02_Ближе_к_новеле'
top=base/'03_Вид_сверху'
orig=base/'Оригинал'
print('=== ORIGINAL ===')
orig_script=orig/'work_novela'/'2WorkNovela'/'renpy_project'/'The Ghosts of the Wesenberg Quarter'/'game'/'script.rpy'
print('script exists',orig_script.exists(),'size',orig_script.stat().st_size if orig_script.exists() else 0)
print('=== COMBINED ===')
text='\n'.join((comb/'js'/f).read_text(encoding='utf-8') for f in ['content.js','story.js','game.js'])
for k in ['Ирина','Тимирязев','Лермонтов','Певица','Русалка','Хтонь','Бредаль','Галина','Пациент','Девочка','дверь XIX','шесть книг','три финала','khonya','singer','duel','market','canal','hospital','photo','station']:
    print(f'{k}:', text.lower().count(k.lower()))
print('books refs',len(set(re.findall(r"book[A-Z][A-Za-z]+", text))))
print('endings', all(x in text for x in ['great','good','bad']))
print('avatars user', len(list((comb/'assets'/'portraits').glob('*.webp'))))
print('cutscenes', len(list((comb/'assets'/'cutscenes').glob('*.webp'))))
print('rooms', len(list((comb/'assets'/'rooms').glob('*.png'))))
print('=== TOPDOWN ===')
tt=(top/'js'/'game.js').read_text(encoding='utf-8')
for k in ['library','market','hospital','photo','canal','station','bookGreen','bookMarket','bookHospital','bookPhoto','bookCanal','bookFinal','finish','great','good','bad','Хтонь','Лермонтов']:
    print(f'{k}:', tt.lower().count(k.lower()))
print('=== ASSETS ===')
for name,root in [('combined',comb),('topdown',top)]:
    files=[]
    for f in ['index.html','css/game.css','css/style.css','js/content.js','js/story.js','js/game.js']:
        p=root/f
        if p.exists(): files.append(p)
    refs=set()
    for p in files:
        s=p.read_text(encoding='utf-8')
        refs.update(re.findall(r"assets/[A-Za-z0-9_./-]+",s))
    missing=[]
    for r in sorted(refs):
        r=r.rstrip('.,;')
        if r.endswith('/') or '${' in r: continue
        if not (root/r).exists(): missing.append(r)
    print(name,'missing refs',missing[:20], 'count',len(missing))
