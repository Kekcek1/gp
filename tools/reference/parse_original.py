#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Parse the original Ren'Py script into a JS-friendly scene graph.

This keeps every label, dialogue line, menu, condition, jump and stat
assignment. It intentionally does not try to be a full Ren'Py interpreter:
screen/transform/init blocks are skipped, while all story-bearing statements
inside labels are preserved.
"""
import re, json, os

SRC = r'G:\Визуальная новела 2.0\Оригинал\work_novela\2WorkNovela\renpy_project\The Ghosts of the Wesenberg Quarter\game\script.rpy'
OUT = r'G:\Визуальная новела 2.0\02_Ближе_к_новеле\js\original_story.js'

SPEAKERS = {
    'character': ('{name}', 'player'),
    'tmrz': ('Климент Аркадьевич', 't1'),
    'characterchildren': ('Призрак ребёнка', 'ghost_children'),
    'characterht1': ('Хтонь', 'ghost_ht1'),
    'characterht2': ('Призрак дуэлянта', 'ghost_ht2'),
    'characterlerm': ('Лермонтов', 'ghost_lerm'),
    'charactermagic': ('Колдун', 'ghost_magic'),
    'characterpevica': ('Певица', 'ghost_pevica'),
    'characterfish': ('Русалка', 'ghost_fish'),
    'characterpacient': ('Пациент', 'ghost_pacient'),
    'characterht3': ('Хтонь', 'ghost_ht3'),
    'characterpiyanica': ('Призрак пьяницы', 'ghost_piyanica'),
    'characterwrker': ('Призрак рабочего', 'ghost_wrker'),
    'characterwrkhe': ('Рабочий', 'ghost_wrkhe'),
    'characterwrkshe': ('Призрак рабочей', 'ghost_wrkshe'),
    'characterVoiswrk': ('Голос работающих', 'ghost_wrker'),
    'characternikolay2': ('Николай II', 'nikolay'),
    'characterpolicia': ('Полицейский', 'ghost_policia'),
    'characterdoctor': ('Врач', 'ghost_doctor'),
    'characterlena': ('Библиотекарь Елена', 'lena2'),
    'characteririnaErnestovna': ('Заведующая', 'irina_Ernestovna_2'),
    'characteririna': ('Библиотекарь Ирина', 'irina_2'),
    'characterelizaveta': ('Библиотекарь Елизавета', 'elisaveta_2'),
    'characteranastasia': ('Библиотекарь Анастасия', 'anastasia_2'),
    'characterotragenie': ('Отражение', 'ghost_m'),
    'characterghost': ('Призрак', 'ghost_g'),
    'characterPrd': ('Проводник', 't1'),
    'characterCir': ('Цирюльник', 'ghost_wrkhe'),
    'characterVois': ('Голос', 'ghost_m'),
}

def ind(t):
    return len(t) - len(t.lstrip(' '))

def clean_text(t):
    t = t.replace('[player_name]', '{name}').replace('[t_name]', '{tname}')
    t = re.sub(r'\{/?(?:i|b|u|s|color|size|font|a|alpha|k|plain|nw|cps|space|vspace)\b[^}]*\}', '', t)
    t = t.replace('\\"', '"').replace("\\'", "'")
    t = t.replace('\\n', '\n')
    return t.strip()

DIALOGUE_RE = re.compile(r'^(?:"((?:[^"\\]|\\.)*)"|([A-Za-z_][A-Za-z0-9_]*)\s+"((?:[^"\\]|\\.)*)")(?:\s+with\s+.*)?$')

def parse_value(v):
    v = v.strip()
    if re.fullmatch(r'-?\d+', v): return int(v)
    if re.fullmatch(r'-?\d+\.\d+', v): return float(v)
    if v in ('True', 'true'): return True
    if v in ('False', 'false'): return False
    if (v.startswith('"') and v.endswith('"')) or (v.startswith("'") and v.endswith("'")):
        return v[1:-1]
    return None

def parse_stat(code):
    ops = []
    for part in code.split(';'):
        part = part.strip()
        m = re.match(r'^([A-Za-z_]\w*)\s*(\+=|-=|=)\s*(.+)$', part)
        if not m:
            continue
        name, op, val = m.group(1), m.group(2), parse_value(m.group(3))
        if val is None:
            continue
        ops.append({'name': name, 'op': op, 'value': val})
    return {'type': 'stat', 'ops': ops} if ops else None

def parse_choice_caption(t):
    # "caption" [if cond]:
    m = re.match(r'^"((?:[^"\\]|\\.)*)"(?:\s+if\s+(.+?))?\s*:\s*(?:#.*)?$', t)
    if not m:
        return None
    return clean_text(m.group(1)), (m.group(2).strip() if m.group(2) else None)

SUB_LABELS = {}

def parse_block(lines, i, indent):
    nodes = []
    n = len(lines)
    while i < n:
        ln, t, ind0 = lines[i]
        if not t.strip():
            i += 1; continue
        if t.startswith('label ') and ind0 == 0:
            break
        if ind0 < indent:
            break
        if ind0 > indent:
            i += 1; continue
        s = t.strip()

        # Ren'Py labels can be nested inside conditional blocks. Treat the
        # sublabel as a jump target and also inline its body so the parent
        # branch falls through exactly as in the original.
        lm = re.match(r'^label\s+([A-Za-z0-9_]+)\s*:\s*$', s)
        if lm:
            subname = lm.group(1)
            body, i2 = parse_block(lines, i + 1, indent + 4)
            SUB_LABELS[subname] = {'nodes': body, 'next': None}
            nodes.extend(body)
            i = i2
            continue

        if s.startswith('menu'):
            node, i = parse_menu(lines, i, indent)
            if node: nodes.append(node)
            continue

        if re.match(r'^(if|elif|else)\b', s):
            node, i = parse_if(lines, i, indent)
            if node: nodes.append(node)
            continue

        if s.startswith('$ '):
            node = parse_stat(s[2:])
            if node: nodes.append(node)
            i += 1; continue

        m = re.match(r'^jump\s+([A-Za-z0-9_]+)', s)
        if m:
            nodes.append({'type': 'jump', 'label': m.group(1)})
            i += 1; continue

        if s.startswith('call screen'):
            i += 1; continue
        m = re.match(r'^call\s+([A-Za-z0-9_]+)', s)
        if m:
            nodes.append({'type': 'call', 'label': m.group(1)})
            i += 1; continue

        if re.match(r'^return\b', s):
            nodes.append({'type': 'return'})
            i += 1; continue

        m = re.match(r'^scene\s+([A-Za-z0-9_]+)', s)
        if m:
            nodes.append({'type': 'scene', 'name': m.group(1)})
            i += 1
            while i < n and lines[i][1].strip() and ind(lines[i][1]) > indent:
                i += 1
            continue

        m = re.match(r'^show\s+([A-Za-z0-9_]+)', s)
        if m:
            name = m.group(1)
            if not re.match(r'^(anim|video|screen)', name):
                nodes.append({'type': 'show', 'name': name})
            i += 1
            while i < n and lines[i][1].strip() and ind(lines[i][1]) > indent:
                i += 1
            continue

        m = re.match(r'^hide\s+([A-Za-z0-9_]+)', s)
        if m:
            nodes.append({'type': 'hide', 'name': m.group(1)})
            i += 1
            while i < n and lines[i][1].strip() and ind(lines[i][1]) > indent:
                i += 1
            continue

        m = re.match(r'^(play|stop)\s+music(?:\s+([A-Za-z0-9_]+))?', s)
        if m:
            nodes.append({'type': 'music', 'action': m.group(1), 'track': m.group(2)})
            i += 1; continue

        if re.match(r'^pause\b', s) or re.match(r'^renpy\.pause', s):
            i += 1; continue

        if s.startswith('python:'):
            i += 1
            while i < n and lines[i][1].strip() and ind(lines[i][1]) > indent:
                i += 1
            continue

        if re.match(r'^(window|with|voice|centered|nvl|init|image|define|default|transform|style|screen|layeredimage|translate)\b', s):
            i += 1
            while i < n and lines[i][1].strip() and ind(lines[i][1]) > indent:
                i += 1
            continue

        dm = DIALOGUE_RE.match(s)
        if dm:
            if dm.group(2) is not None:
                code = dm.group(2)
                text = clean_text(dm.group(3))
                who, portrait = SPEAKERS.get(code, (code, None))
                nodes.append({'type': 'say', 'who': who, 'portrait': portrait, 'text': text})
            elif dm.group(3) is not None:
                # "Name" "text"
                nodes.append({'type': 'say', 'who': clean_text(dm.group(1)), 'portrait': None, 'text': clean_text(dm.group(3))})
            else:
                nodes.append({'type': 'say', 'who': None, 'portrait': None, 'text': clean_text(dm.group(1))})
            i += 1; continue

        # unknown statement inside a label: keep it out of the story graph
        i += 1
    return nodes, i

def parse_menu(lines, i, indent):
    i += 1
    options = []
    prompt = None
    n = len(lines)
    while i < n:
        ln, t, ind0 = lines[i]
        if not t.strip():
            i += 1; continue
        if ind0 != indent + 4:
            if ind0 <= indent:
                break
            i += 1; continue
        s = t.strip()
        if s.startswith('"') and not s.endswith(':'):
            prompt = clean_text(s.strip().strip('"'))
            i += 1; continue
        pm = re.match(r'^([A-Za-z_]\w*)\s+"((?:[^"\\]|\\.)*)"\s*$', s)
        if pm:
            prompt = clean_text(pm.group(2))
            i += 1; continue
        cap = parse_choice_caption(s)
        if not cap:
            i += 1; continue
        caption, cond = cap
        j = i + 1
        # skip nested declaration lines until the block body at indent+8
        while j < n and lines[j][1].strip() and ind(lines[j][1]) == indent + 8 and lines[j][1].strip().startswith(('show ', 'scene ', 'hide ')):
            j += 1
        body, j2 = parse_block(lines, i + 1, indent + 8)
        options.append({'label': caption, 'cond': cond, 'nodes': body})
        i = j2
    return {'type': 'menu', 'prompt': prompt, 'options': options}, i

def parse_if(lines, i, indent):
    branches = []
    n = len(lines)
    s = lines[i][1].strip()
    m = re.match(r'^if\s+(.+?)\s*:\s*(?:#.*)?$', s)
    if not m:
        return None, i + 1
    cond = m.group(1).strip()
    body_indent = indent + 4
    for j in range(i + 1, n):
        if lines[j][1].strip():
            body_indent = max(indent + 4, lines[j][2])
            break
    body, i = parse_block(lines, i + 1, body_indent)
    branches.append({'cond': cond, 'nodes': body})
    while i < n:
        ln, t, ind0 = lines[i]
        if not t.strip():
            i += 1; continue
        if ind0 != indent:
            break
        s2 = t.strip()
        m2 = re.match(r'^elif\s+(.+?)\s*:\s*(?:#.*)?$', s2)
        if m2:
            bi = indent + 4
            for j in range(i + 1, n):
                if lines[j][1].strip(): bi = max(indent + 4, lines[j][2]); break
            body, i = parse_block(lines, i + 1, bi)
            branches.append({'cond': m2.group(1).strip(), 'nodes': body})
            continue
        if re.match(r'^else\s*:\s*(?:#.*)?$', s2):
            bi = indent + 4
            for j in range(i + 1, n):
                if lines[j][1].strip(): bi = max(indent + 4, lines[j][2]); break
            body, i = parse_block(lines, i + 1, bi)
            branches.append({'cond': None, 'nodes': body})
            continue
        break
    return {'type': 'if', 'branches': branches}, i

def main():
    raw = open(SRC, encoding='utf-8-sig').read().split('\n')
    lines = [(i + 1, l.replace('\t', '    '), ind(l.replace('\t', '    '))) for i, l in enumerate(raw)]
    # top-level labels
    labels_order = []
    label_starts = []
    for i, (ln, t, ind0) in enumerate(lines):
        m = re.match(r'^label\s+([A-Za-z0-9_]+)\s*:\s*(?:#.*)?$', t.strip())
        if m and ind0 == 0:
            label_starts.append((i, m.group(1)))
    for k, (i, name) in enumerate(label_starts):
        end = label_starts[k + 1][0] if k + 1 < len(label_starts) else len(lines)
        body, _ = parse_block(lines[i + 1:end], 0, 4)
        labels_order.append(name)
        # fallthrough stored after all labels built
        labels_order[-1] = name
        if k == 0:
            pass
    # rebuild with dict
    labels = {}
    for k, (i, name) in enumerate(label_starts):
        end = label_starts[k + 1][0] if k + 1 < len(label_starts) else len(lines)
        body, _ = parse_block(lines[i + 1:end], 0, 4)
        labels[name] = {'nodes': body, 'next': label_starts[k + 1][1] if k + 1 < len(label_starts) else None}
    for sn, sv in SUB_LABELS.items():
        labels.setdefault(sn, sv)
    # Continuations inside scene_red (factory quiz) in the original fall
    # through to the next sublabel and then to the house scene.
    for sn in ('scene_red_0_m', 'scene_red_0_g'):
        if sn in labels: labels[sn]['next'] = 'scene_red_1_m' if sn.endswith('_m') else 'scene_red_1_g'
    for sn in ('scene_red_1_m', 'scene_red_1_g'):
        if sn in labels: labels[sn]['next'] = 'scene_huse'
    # Fallback: labels nested deeper than the normal parser reached.
    all_label_rows = []
    for i, (ln, t, ind0) in enumerate(lines):
        m = re.match(r'^label\s+([A-Za-z0-9_]+)\s*:\s*(?:#.*)?$', t.strip())
        if m:
            all_label_rows.append((i, ind0, m.group(1)))
    for idx, (i, ind0, name) in enumerate(all_label_rows):
        if name in labels:
            continue
        end = all_label_rows[idx + 1][0] if idx + 1 < len(all_label_rows) else len(lines)
        body, _ = parse_block(lines[i + 1:end], 0, ind0 + 4)
        labels[name] = {'nodes': body, 'next': None}
    # Nested sublabels fall through to the next top-level label after their parent.
    top_rows = [(i, n) for i, ind0, n in all_label_rows if ind0 == 0]
    for i, ind0, name in all_label_rows:
        if ind0 == 0 or name not in labels or labels[name].get('next'):
            continue
        parent = None
        for ti, tn in top_rows:
            if ti < i: parent = tn
            else: break
        if parent and parent in labels:
            labels[name]['next'] = labels[parent].get('next')
    data = {'labels': labels, 'order': [n for _, n in label_starts], 'meta': {'source': 'script.rpy', 'labels': len(labels), 'say_nodes': sum(1 for v in labels.values() for n in v['nodes'] if n.get('type') == 'say')}}
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, 'w', encoding='utf-8') as f:
        f.write('/* Auto-generated from the original Ren\'Py script. Do not edit by hand. */\n')
        f.write('window.ORIGINAL_STORY = ')
        json.dump(data, f, ensure_ascii=False, separators=(',', ':'))
        f.write(';\n')
    print('labels', len(labels), 'say nodes', data['meta']['say_nodes'])
    print('menu nodes', sum(1 for v in labels.values() for n in v['nodes'] if n.get('type') == 'menu'))
    print('order first', data['order'][:8])

if __name__ == '__main__':
    main()
