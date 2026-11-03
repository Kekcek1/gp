# Selected interface: cyan/glass palette (variant 3) with variant 2 layout.
# Loaded after screens.rpy, so these styles override the default theme.

init -1 python:
    gui.accent_color = "#8fe3ff"
    gui.idle_color = "#d9e9f5"
    gui.idle_small_color = "#9fb8ca"
    gui.hover_color = "#8fe3ff"
    gui.selected_color = "#ffffff"
    gui.insensitive_color = "#6d84967f"
    gui.muted_color = "#1a3a50"
    gui.hover_muted_color = "#2a5a78"
    gui.text_color = "#f2f8ff"
    gui.interface_text_color = "#f2f8ff"

    gui.text_font = "DejaVuSans.ttf"
    gui.name_text_font = "DejaVuSans-Bold.ttf"
    gui.interface_text_font = "DejaVuSans.ttf"

    gui.text_size = 26
    gui.name_text_size = 28
    gui.interface_text_size = 23
    gui.label_text_size = 26
    gui.notify_text_size = 18
    gui.title_text_size = 34
    gui.button_text_size = 23
    gui.choice_button_text_size = 25

    gui.textbox_height = 200
    gui.textbox_yalign = 1.0
    gui.name_xpos = 100
    gui.name_ypos = 10
    gui.dialogue_xpos = 120
    gui.dialogue_ypos = 52
    gui.dialogue_width = 1040

    gui.choice_button_width = 760
    gui.choice_button_borders = Borders(46, 16, 46, 16)
    gui.choice_spacing = 14
    gui.choice_button_text_idle_color = "#cfe6f4"
    gui.choice_button_text_hover_color = "#ffffff"
    gui.choice_button_text_selected_color = "#8fe3ff"

    gui.navigation_spacing = 8
    gui.pref_spacing = 16
    gui.pref_button_spacing = 8
    gui.radio_button_borders = Borders(42, 6, 10, 6)
    gui.check_button_borders = Borders(42, 6, 10, 6)
    gui.slot_spacing = 12
    gui.slot_button_text_size = 18
    gui.file_slot_cols = 3
    gui.file_slot_rows = 2

    gui.skip_ypos = 64

    gui.main_menu_background = "images/ui/main_menu.webp"
    gui.game_menu_background = "images/ui/main_menu.webp"


style window:
    xalign 0.5
    xsize 1180
    ysize 192
    yalign 1.0
    yoffset -14
    background Frame("gui/panel.png", Borders(30, 30, 30, 30), tile=False)

style namebox:
    xpos 100
    ypos 8
    background Frame("gui/namebox.png", Borders(18, 10, 18, 10), tile=False)
    padding (18, 6, 18, 6)

style say_label:
    color "#8fe3ff"
    size 27

style say_dialogue:
    xpos gui.dialogue_xpos
    xsize gui.dialogue_width
    ypos gui.dialogue_ypos
    size 26
    color "#f2f8ff"
    line_spacing 3

style choice_vbox:
    xalign 0.5
    ypos 300
    yanchor 0.5
    spacing 14

style choice_button:
    xsize 760
    padding (32, 12, 32, 12)
    background Frame("gui/button/choice_idle_background.png", Borders(24, 18, 24, 18), tile=False)
    hover_background Frame("gui/button/choice_hover_background.png", Borders(24, 18, 24, 18), tile=False)
    insensitive_background Frame("gui/button/choice_insensitive_background.png", Borders(24, 18, 24, 18), tile=False)

style choice_button_text:
    size 25
    xalign 0.5
    text_align 0.5
    color "#cfe6f4"
    hover_color "#ffffff"
    insensitive_color "#6d8496"

style quick_button:
    xsize 104
    background Frame("gui/button/quick_idle_background.png", Borders(18, 12, 18, 12), tile=False)
    hover_background Frame("gui/button/quick_hover_background.png", Borders(18, 12, 18, 12), tile=False)
    padding (14, 7, 14, 7)

style quick_button_text:
    size 21
    color "#b8d2e4"
    hover_color "#8fe3ff"

style navigation_button:
    background None
    padding (0, 3, 0, 3)

style navigation_button_text:
    size 24
    color "#c6dceb"
    hover_color "#8fe3ff"
    selected_color "#ffffff"

style button:
    background Frame("gui/button/idle_background.png", Borders(20, 14, 20, 14), tile=False)
    hover_background Frame("gui/button/hover_background.png", Borders(20, 14, 20, 14), tile=False)
    selected_idle_background Frame("gui/button/selected_idle_background.png", Borders(20, 14, 20, 14), tile=False)
    selected_hover_background Frame("gui/button/selected_hover_background.png", Borders(20, 14, 20, 14), tile=False)
    insensitive_background Frame("gui/button/insensitive_background.png", Borders(20, 14, 20, 14), tile=False)
    padding (18, 8, 18, 8)

style button_text:
    size 23
    color "#d9e9f5"
    hover_color "#8fe3ff"
    selected_color "#ffffff"
    insensitive_color "#6d8496"

# Frameless radio/check rows: the icon sits in the left border, the label
# starts after it.  This keeps "Оконный / Полный" and "Без звука" readable.
style radio_button:
    background None
    hover_background None
    selected_idle_background None
    selected_hover_background None
    insensitive_background None
    padding (42, 5, 10, 5)
    foreground "gui/button/radio_[prefix_]foreground.png"

style radio_button_text:
    size 23
    color "#c6dceb"
    hover_color "#8fe3ff"
    selected_color "#ffffff"

style check_button:
    background None
    hover_background None
    selected_idle_background None
    selected_hover_background None
    insensitive_background None
    padding (42, 5, 10, 5)
    foreground "gui/button/check_[prefix_]foreground.png"

style check_button_text:
    size 23
    color "#c6dceb"
    hover_color "#8fe3ff"
    selected_color "#ffffff"

style frame:
    background Frame("gui/panel.png", Borders(28, 28, 28, 28), tile=False)
    padding (24, 20, 24, 20)

style confirm_frame:
    background Frame("gui/panel_bright.png", Borders(28, 28, 28, 28), tile=False)
    padding (36, 28, 36, 28)

style quick_frame:
    background Frame("gui/panel.png", Borders(24, 24, 24, 24), tile=False)

style skip_frame:
    background Frame("gui/panel.png", Borders(24, 20, 24, 20), tile=False)

style notify_frame:
    background Frame("gui/panel.png", Borders(24, 20, 24, 20), tile=False)

style slot_button:
    background Frame("gui/button/slot_idle_background.png", Borders(20, 18, 20, 18), tile=False)
    hover_background Frame("gui/button/slot_hover_background.png", Borders(20, 18, 20, 18), tile=False)
    padding (10, 10, 10, 10)

style page_button:
    background None
    padding (6, 4, 6, 4)

style page_button_text:
    size 21
    color "#9fb8ca"
    hover_color "#8fe3ff"
    selected_color "#ffffff"

style return_button:
    background Frame("gui/button/idle_background.png", Borders(20, 14, 20, 14), tile=False)
    hover_background Frame("gui/button/hover_background.png", Borders(20, 14, 20, 14), tile=False)
    padding (18, 8, 18, 8)

style game_menu_outer_frame:
    background Solid("#06101bcc")
    top_padding 70
    bottom_padding 30

style game_menu_navigation_frame:
    xsize 250
    yfill True
    background Frame("gui/panel.png", Borders(28, 28, 28, 28), tile=False)
    padding (18, 24, 18, 24)
    left_margin 30

style game_menu_content_frame:
    left_margin 18
    right_margin 30
    top_margin 8
    background Frame("gui/panel.png", Borders(28, 28, 28, 28), tile=False)
    padding (28, 22, 28, 22)

style game_menu_label:
    xpos 64
    ysize 90

style game_menu_label_text:
    size 32
    color "#8fe3ff"

style main_menu_frame:
    xsize 420
    ysize 560
    xalign 1.0
    xoffset -60
    yalign 0.5
    padding (30, 28, 30, 28)
    background Frame("gui/main_menu_panel.png", Borders(30, 30, 30, 30), tile=False)

style main_menu_vbox:
    xalign 1.0
    yalign 1.0

style main_menu_text:
    color "#d9e9f5"

style main_menu_title:
    size 34
    color "#ffffff"

style main_menu_version:
    size 16
    color "#9fb8ca"

style main_menu_button is button
style main_menu_button_text is button_text

style main_menu_button:
    xsize 330
    background Frame("gui/button/idle_background.png", Borders(20, 14, 20, 14), tile=False)
    hover_background Frame("gui/button/hover_background.png", Borders(20, 14, 20, 14), tile=False)
    padding (18, 9, 18, 9)

style main_menu_button_text:
    size 23
    color "#d9e9f5"
    hover_color "#071018"
    selected_color "#071018"


screen main_menu():
    tag menu

    # Phones and small browser windows get a wider, larger menu instead of
    # shrinking the desktop side panel.  The game itself still uses the same
    # 1280x720 virtual canvas, so no layout can break.
    $ physical_width, physical_height = renpy.get_physical_size()
    $ compact_menu = physical_width < 1000 or physical_height < 560

    add gui.main_menu_background:
        size (1280, 720)
        fit "fill"
    add Solid("#050d16aa")

    if not compact_menu:
        # Decorative frame line, echoing the art-nouveau variant.
        add Solid("#8fe3ff22"):
            xpos 60
            ypos 52
            xsize 1160
            ysize 1
        add Solid("#8fe3ff22"):
            xpos 60
            ypos 668
            xsize 1160
            ysize 1

        # Thin graph-line accents that echo the chosen "Модерн Обводного" layout.
        add Solid("#8fe3ff55"):
            xpos 690
            ypos 80
            xsize 110
            ysize 1
        add Solid("#8fe3ff55"):
            xpos 690
            ypos 80
            xsize 1
            ysize 54
        add Solid("#8fe3ff55"):
            xpos 690
            ypos 639
            xsize 110
            ysize 1
        add Solid("#8fe3ff55"):
            xpos 690
            ypos 586
            xsize 1
            ysize 54

    frame:
        style "main_menu_frame"
        xsize (720 if compact_menu else 420)
        ysize (640 if compact_menu else 560)
        xalign (0.5 if compact_menu else 1.0)
        xoffset (0 if compact_menu else -60)
        yalign 0.5
        padding ((40, 28, 40, 28) if compact_menu else (30, 28, 30, 28))
        vbox:
            spacing (12 if compact_menu else 9)
            text "ВИЗУАЛЬНАЯ НОВЕЛЛА" style "novel_kicker" size (20 if compact_menu else 13)
            text "Призраки\nВезенбергского\nквартала" style "novel_title" size (46 if compact_menu else 34)
            text "Санкт-Петербург · 16+" style "novel_subtitle" size (20 if compact_menu else 16)
            null height (18 if compact_menu else 16)
            textbutton _("Начать") action Start() style "main_menu_button" xsize (620 if compact_menu else 330) text_size (30 if compact_menu else 23)
            if renpy.can_load("auto-1"):
                textbutton _("Продолжить") action Function(renpy.load, "auto-1") style "main_menu_button" xsize (620 if compact_menu else 330) text_size (30 if compact_menu else 23)
            textbutton _("Загрузить") action ShowMenu("load") style "main_menu_button" xsize (620 if compact_menu else 330) text_size (30 if compact_menu else 23)
            textbutton _("Настройки") action ShowMenu("preferences") style "main_menu_button" xsize (620 if compact_menu else 330) text_size (30 if compact_menu else 23)
            textbutton _("Об игре") action ShowMenu("about") style "main_menu_button" xsize (620 if compact_menu else 330) text_size (30 if compact_menu else 23)
            if renpy.variant("pc"):
                textbutton _("Выход") action Quit(confirm=True) style "main_menu_button" xsize (620 if compact_menu else 330) text_size (30 if compact_menu else 23)
            null height (8 if compact_menu else 8)
            text "5 серий · 3 финала · 2 916 реплик" style "novel_panel_footer" size (17 if compact_menu else 12)

    if not compact_menu:
        text "59.9° N  ·  30.3° E\nСЕВЕРНАЯ СТОЛИЦА" style "novel_coords"
        text "v2.0.0" style "novel_version"


style novel_kicker:
    size 13
    color "#8fe3ff"
    kerning 2

style novel_title:
    size 34
    color "#ffffff"
    font "DejaVuSans-Bold.ttf"
    line_spacing 2

style novel_subtitle:
    size 16
    color "#9fb8ca"

style novel_panel_footer:
    size 12
    color "#6d8496"

style novel_coords:
    xalign 0.04
    yalign 0.90
    text_align 0.0
    size 14
    color "#9fb8ca"

style novel_version:
    xalign 0.04
    yalign 0.95
    text_align 0.0
    size 12
    color "#6d8496"
