import re
import textwrap
from pathlib import Path

src = Path(r"G:\Work_Novela\game\chapters\07_finale.rpy").read_text(encoding="utf-8-sig")
match = re.search(r'credits\(\s*"""(.*?)"""', src, re.S)
text = textwrap.dedent(match.group(1)).strip() + "\n" if match else ""
out = Path(r"G:\NewWorkNovel\docs\script\CREDITS.txt")
out.write_text("Титры\n=====\n\n" + text, encoding="utf-8")
print(out, len(text))
