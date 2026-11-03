define config.has_autosave = True
define config.has_quicksave = False
define config.autosave_slots = 1
init python:
    config.keymap['toggle_skip'] = []
    config.keymap['skip'] = []
    config.keymap['rollback'] = []
    config.keymap['rollforward'] = []
    config.keymap['self_voicing'] = []
    config.keymap['accessibility'] = []
define config.autosave_on_choice = True   
define config.autosave_on_quit = True  
define config.layers = [ 'background_video', 'master', 'transient', 'screens', 'overlay' ] 
define config.name = _("Призраки Везенбергского квартала")
define config.version = "2.0.0"
define build.version = "2.0.0"
define build.directory_name = "GhostsOfWesenberg"
define build.executable_name = "GhostsOfWesenberg"

define build.include_update = False
define build.web_cache_size = 0
init python:
    config.hw_video = True

define gui.show_name = False
define gui.about = _p("""
Визуальная новелла по мотивам истории Везенбергского квартала.
Санкт-Петербург, улица Шкапина и окрестности.
""")
define build.name = "Ghosts_of_Wesenberg_Quarter"
define config.has_sound = True
define config.has_music = True
define config.has_voice = True
define config.main_menu_music = "audio/name.mp3"
define config.default_music_volume = 0.5
define config.default_sfx_volume = 0.5
define config.default_voice_volume = 0.5
define config.enter_transition = dissolve
define config.exit_transition = dissolve
define config.intra_transition = dissolve
define config.after_load_transition = None
define config.end_game_transition = None
define config.window = "auto"
define config.window_show_transition = Dissolve(.2)
define config.window_hide_transition = Dissolve(.2)
default preferences.text_cps = 35
default preferences.afm_time = 15
define config.save_directory = "GhostsOfWesenbergQuarter-2"
define config.window_icon = "gui/window_icon.png"
init python:
    build.classify('**~', None)
    build.classify('**.bak', None)
    build.classify('**/.**', None)
    build.classify('**/#**', None)
    build.classify('**/thumbs.db', None)
    # Source archive and tooling are not part of the game build.
    build.classify('materials/**', None)
    build.classify('docs/**', None)
    build.classify('tools/**', None)
    build.classify('dist/**', None)
    build.documentation('*.html')
    build.documentation('*.txt')