# Призраки Везенбергского квартала

Визуальная новелла на Ren'Py 8.5. Пять серий, 112 меток, 91 меню, 2 916
реплик и три финала. Сюжет оригинала сохранён; изменена только орфография.
Звук по умолчанию — 50%.

## Где игра

```text
G:\Work_Novela\
├─ game\                         # Ren'Py-проект
│  ├─ chapters\                  # сценарий по сериям
│  ├─ images\series\             # все пять заставок
│  ├─ images\backgrounds\        # фоны ch01…ch05
│  ├─ images\characters\         # игрок, Тимирязев, призраки
│  ├─ images\endings\            # три концовки
│  ├─ audio\                     # 17 треков
│  ├─ 00_definitions.rpy
│  ├─ screens.rpy
│  ├─ gui.rpy
│  ├─ options.rpy
│  └─ ui_extras.rpy
├─ dist\
│  ├─ android\GhostsOfWesenberg-2.0.0.apk
│  ├─ windows\GhostsOfWesenberg-win\GhostsOfWesenberg.exe
│  ├─ web\                       # PWA для GitHub Pages
│  ├─ GhostsOfWesenberg-2.0.0-web.zip
│  └─ SHA256SUMS.txt
├─ tools\                        # сборка, проверки, аудит
├─ README.md
└─ ЗАПУСТИТЬ_ИГРУ.bat / ЗАПУСТИТЬ_ВЕБ.bat
```

Материалы, DOCX-сценарий, аудит и архив старых попыток вынесены в
`G:\NewWorkNovel`. Полная документация: `G:\NewWorkNovel\docs\`.

## Запуск

### Windows

```text
dist\windows\GhostsOfWesenberg-win\GhostsOfWesenberg.exe
```

Запускать из папки целиком. Или `ЗАПУСТИТЬ_ИГРУ.bat`.

### Веб / GitHub Pages

```powershell
cd G:\Work_Novela
python -m http.server 8765 --directory dist\web
```

Открыть `http://127.0.0.1:8765/`. Публичная версия:
`https://kekcek1.github.io/gp/`.

### Android

```text
dist\android\GhostsOfWesenberg-2.0.0.apk
```

Пакет `ru.wezenberg.ghosts`, версия `2.0.0`, Android 5+, landscape.

### iPhone / iPad

Открыть `https://kekcek1.github.io/gp/` в Safari → «Поделиться» → «На экран
Домой». В портретной ориентации показывается подсказка «Поверните устройство».

## Адаптивность и оптимизация

- Ren'Py масштабирует виртуальный экран 1280×720 под любой размер окна и
  сохраняет пропорции; интерфейс не ломается на 4K, ноутбуке, планшете и
  телефоне.
- Увеличены шрифты и текстовое окно: на мобильном ландшафте текст остаётся
  читаемым.
- Портретная ориентация веба показывает отдельный экран поворота.
- Добавлены `viewport-fit`, PWA-манифест, иконки и пресплэш.
- Веб-сборка использует progressive download: изображения и музыка
  подгружаются по мере игры, `game.zip` — 6,7 МБ.
- Runtime-изображения дедуплицированы по SHA-256; одинаковые спрайты и фоны
  лежат одним файлом.
- Музыка в нижнем регистре — без проблем с регистром на Android/Web.
- Служебные дубли остались только в `game/gui/`, где они нужны Ren'Py.

## Проверки

- `renpy lint`: 2 916 реплик, 91 меню, 148 изображений, 29 экранов, без
  отсутствующих ассетов.
- Целостность: 112/112 меток, 0 потерянных переходов, 0 отсутствующих
  изображений/аудио, 0 расхождений текста.
- Web QA: 1280×720, 844×390, 390×844; 0 ошибок JS.
- APK подписан v1+v2, проверен `aapt2`/`apksigner`.
- Windows EXE запускается, снят скриншот главного меню.
- Аудит: 642 изображения, 98 групп точных дублей, 131 группа похожих;
  runtime-контент дедуплицирован. Отчёт: `G:\NewWorkNovel\docs\audit\DUPLICATES.md`.

## Интерфейс

Пять вариантов редизайна: `https://kekcek1.github.io/gp/concepts/`.
Выберите номер в чате — после выбора весь UI будет перерисован под этот стиль.

## Сценарий

- `G:\NewWorkNovel\docs\script\SCENARIO_FULL.txt` — весь сценарий одним файлом.
- `Сценарий_с_помеченными_ошибками.docx` — ошибки красным.
- `Сценарий_исправленный.docx` — чистая версия.
- Внесены 32 грамматические правки; сюжет не менялся.

## Сборка

```powershell
python tools\build_all.py --all
```

Подробно: `G:\NewWorkNovel\docs\BUILD.md`.

## GitHub

- Репозиторий: `https://github.com/Kekcek1/gp`
- Сайт: `https://kekcek1.github.io/gp/`
- Игра: `https://kekcek1.github.io/gp/play/`
- 5 стилей: `https://kekcek1.github.io/gp/concepts/`
- Релизы APK/EXE/Web: `https://github.com/Kekcek1/gp/releases/latest`
- Ветка `main` — лендинг и игра в `/play/` для GitHub Pages.
- Ветка `source` — исходники Ren'Py-проекта и инструменты.

## Ограничения

- Нативная iOS/IPA-сборка требует macOS и Xcode; iPhone работает через PWA.
- APK не проверялся на физическом Android-устройстве.
- Windows-сборка распространяется папкой, а не одним `.exe`.
