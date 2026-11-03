# Дополнительный интерфейс: компактный счётчик ресурсов.
# Файл подключается после 00_definitions.rpy и переопределяет оверлей.

init python:
    config.overlay_screens.append("main_stats_display")


screen main_stats_display():
    zorder 100
    if not main_menu:
        frame:
            xpos 24
            ypos 14
            background Frame("gui/panel.png", Borders(20, 20, 20, 20), tile=False)
            padding (18, 8, 22, 8)
            hbox:
                spacing 10
                text "{color=#8fe3ff}ПРИЗРАК{/color} [ghost]" size 19 color "#f2f8ff" kerning 1
                text "·" size 19 color "#5f8ba3"
                text "{color=#8fe3ff}ЯВЬ{/color} [reality]" size 19 color "#f2f8ff" kerning 1
                $ total_books = book_lermnt + book_canal + book_coi + book_misticPeter + book_promish + book_rest
                text "·" size 19 color "#5f8ba3"
                text "{color=#8fe3ff}КНИГИ{/color} [total_books]" size 19 color "#f2f8ff" kerning 1
