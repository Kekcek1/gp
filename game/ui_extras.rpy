# Дополнительный интерфейс: галерея серий и компактный счётчик.
# Файл подключается после 00_definitions.rpy и переопределяет оверлей.

screen main_stats_display():
    zorder 100
    if not main_menu:
        frame:
            xpos 24
            ypos 14
            background "#00000088"
            padding (14, 8)
            hbox:
                spacing 22
                text "Призрак: [ghost]" size 24 color "#ffffff" outlines [(1, "#000000", 0, 0)]
                text "Явь: [reality]" size 24 color "#ffffff" outlines [(1, "#000000", 0, 0)]
                $ total_books = book_lermnt + book_canal + book_coi + book_misticPeter + book_promish + book_rest
                text "Книги: [total_books]" size 24 color "#ffffff" outlines [(1, "#000000", 0, 0)]


screen series_gallery():
    tag menu
    use game_menu(_("Серии"), scroll="viewport"):
        vbox:
            spacing 26
            text "Пять серий одной истории. Все материалы собраны в папке materials/series.":
                size 24
                color "#d8d8d8"

            for item in series_info:
                vbox:
                    spacing 8
                    add item["image"]:
                        size (720, 405)
                        fit "contain"
                    $ caption = "Серия %d. %s" % (item["number"], item["title"])
                    text caption:
                        size 30
                        bold True
                        color "#ffffff"
                    text "Начало: label %s" % item["label"]:
                        size 19
                        color "#9fc9d8"
