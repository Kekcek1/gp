default player_name = ""
default gender = ""
default architect = 0
default botanist = 0
default archaeologist = 0
default journalist = 0

default reality = 0
default ghost = 0
default t_name = "Неизвестный"

default book_lermnt = 0
default book_canal = 0
default book_coi = 0
default book_misticPeter = 0
default book_promish = 0
default book_rest = 0

default rightornot = 0
default time_menu = 0
default verno = 0

default scenered = 0
default sceneredbook = 0

default scenehuse = 0
default zagadka = 0
default scenehusebook = 0

default scenemedic = 0
default zagadkamedic = 0

default zagadkaotragenie = 0

default scenepht = 0
default sceneised = 0
default seria4vibr = 0
default attack = 0
default vstret_rab = 0

define character = DynamicCharacter("player_name", color="#ffffff")
define tmrz = DynamicCharacter("t_name", color="#ffffff")

define characterchildren = Character("Призрак ребенка", color="#ffffff")
define characterht1 = Character("Хтонь", color="#ffffff")
define characterht2 = Character("Призрак дуэлянта", color="#ffffff")
define characterlerm = Character("Лермонтов", color="#ffffff")
define charactermagic = Character("Колдун", color="#ffffff")
define characterpevica = Character("Певица", color="#ffffff")
define characterfish = Character("Русалка", color="#ffffff")
define characterpacient = Character("Пациент", color="#ffffff")
define characterht3 = Character("Хтонь", color="#ffffff")
define characterpiyanica = Character("Призрак пьяницы", color="#ffffff")
define characterwrker = Character("Призрак рабочего", color="#ffffff")
define characterwrkhe = Character("Рабочий", color="#ffffff")
define characterwrkshe = Character("Призрак рабочей", color="#ffffff")
define characterVoiswrk = Character("Голос работающих", color="#ffffff")
define characternikolay2 = Character("Император Николай II", color="#ffffff")
define characterpolicia = Character("Полицейский", color="#ffffff")
define characterdoctor = Character("Врач", color="#ffffff")

define characterlena = Character("Библиотекарь Елена", color="#ffffff")
define characteririnaErnestovna = Character("Заведующая", color="#ffffff")
define characteririna = Character("Библиотекарь Ирина", color="#ffffff")
define characterelizaveta = Character("Библиотекарь Елизавета", color="#ffffff")
define characteranastasia = Character("Библиотекарь Анастасия", color="#ffffff")

define characterotragenie = Character("Отражение", color="#ffffff")
define characterghost = Character("Призрак", color="#ffffff")
define characterPrd = Character("Продавец", color="#ffffff")
define characterCir = Character("Цирюльник", color="#ffffff")
define characterVois = Character("Голос", color="#ffffff")

screen choice_timer(duration):
    default time_left = duration
    timer 0.1 repeat True action If(time_left > 0,
        SetScreenVariable("time_left", time_left - 0.1),
        [Hide("choice_timer"), Jump(return_label)]
    )

    vbox:
        xalign 0.5
        ypos 50
        text "Осталось времени:" size 25
        text "[int(time_left)] сек" size 40 color "#f00" bold True

    if time_left <= 0:
        timer 0.01 action [Hide("choice_timer"), Jump(return_label)]

screen find_item_game_1():
    imagebutton:
        xpos 1038
        ypos 555
        xsize 91
        ysize 129
        idle Solid("#0000")
        action [Return("found")]

init python:
    def credits_transform(trans, st, at, speed, text_height):
        trans.yoffset = int(-st * speed)

        if st * speed > text_height + 720:
            return None
        return 0

    def make_credits_transform(speed, text_height):
        return lambda trans, st, at: credits_transform(trans, st, at, speed, text_height)

screen credits(text_content, scroll_speed=50, display_duration=15):
    zorder 100

    add "titri_3":
        size (1280, 720)
        fit "fill"

    add Solid("#000"):
        alpha 0.70

    $ text_height = len(text_content.split("\n")) * 40

    frame:
        background None
        xsize 1000
        ysize text_height
        xalign 0.45
        ypos 720

        text text_content:
            size 28
            color "#ffffff"
            text_align 0.5
            xalign 0.5
            yalign -0.5
            line_spacing 5

        at transform:
            function make_credits_transform(scroll_speed, text_height)

    timer display_duration action [Hide("credits", transition=dissolve), Return()]

    key "dismiss" action [Hide("credits", transition=dissolve), Return()]

default main_menu_one = False
default play_one = False
default glav_one = False

# ---- Изображения (автоматически дедуплицированы по SHA-256) ----
image anastasia_2 = "images/endings/neutral/anastasia_2.png"
image elisaveta_2 = "images/endings/neutral/elisaveta_2.png"
image irina_2 = "images/endings/neutral/irina_2.png"
image irina_Ernestovna_2 = "images/endings/neutral/irina_ernestovna_2.png"
image lena2 = "images/endings/neutral/lena2.png"
image 1_1_2 = "images/endings/neutral/1_1.webp"
image 2_1_2 = "images/endings/neutral/2_1.webp"
image 3_1_2 = "images/endings/neutral/3_1.webp"
image 4_1_2 = "images/endings/neutral/4_1.webp"
image anastasia_3 = "images/endings/true/anastasia_3.png"
image elisaveta_3 = "images/endings/true/elisaveta_3.png"
image irina_3 = "images/endings/true/irina_3.png"
image irina_Ernestovna_3 = "images/endings/true/irina_ernestovna_3.png"
image lena3 = "images/endings/true/lena_3.png"
image 1_0_3 = "images/endings/neutral/1_1.webp"
image 1_1_3 = "images/endings/true/1.1.webp"
image 1_2_3 = "images/endings/true/1.2.webp"
image 1_3_3 = "images/endings/neutral/3_1.webp"
image 1_4_3 = "images/endings/neutral/4_1.webp"
image 1_5_3 = "images/endings/true/1.5.webp"
image 1_6_3 = "images/endings/true/1.6.webp"
image titri_3 = "images/endings/true/titri_3.webp"
image g_1 = "images/endings/ghost/g_1.webp"
image g_ryki0 = "images/endings/ghost/g_ryki0.webp"
image g_ryki1 = "images/endings/ghost/g_ryki1.webp"
image g_ryki2 = "images/endings/ghost/g_ryki2.webp"
image g_ryki3 = "images/endings/ghost/g_ryki3.webp"
image m_1 = "images/endings/ghost/m_1.webp"
image m_ryki0 = "images/endings/ghost/m_ryki0.webp"
image m_ryki1 = "images/endings/ghost/m_ryki1.webp"
image m_ryki2 = "images/endings/ghost/m_ryki2.webp"
image m_ryki3 = "images/endings/ghost/m_ryki3.webp"
image skapina = "images/endings/ghost/skapina.webp"
image seria1 = "images/series/1_seria.webp"
image seria2 = "images/series/2_seria.webp"
image seria3 = "images/series/3_seria.webp"
image seria4 = "images/series/4_seria.webp"
image seria5 = "images/series/5_seria.webp"
image back0 = "images/backgrounds/ch01/0.webp"
image back1 = "images/backgrounds/ch01/1.webp"
image back2 = "images/backgrounds/ch01/2.webp"
image back3 = "images/backgrounds/ch01/3.webp"
image back4 = "images/backgrounds/ch01/4.webp"
image back5 = "images/backgrounds/ch01/5.webp"
image back6 = "images/backgrounds/ch01/6.webp"
image back7 = "images/endings/neutral/1_1.webp"
image back8 = "images/endings/neutral/2_1.webp"
image back9 = "images/backgrounds/ch01/9.webp"
image back10 = "images/endings/neutral/3_1.webp"
image back11 = "images/endings/true/1.1.webp"
image back12 = "images/backgrounds/ch01/12.webp"
image back12_1 = "images/backgrounds/ch01/12.1.webp"
image back12_2 = "images/backgrounds/ch01/12.2.webp"
image back13 = "images/backgrounds/ch01/13.webp"
image back14 = "images/endings/ghost/skapina.webp"
image back15 = "images/backgrounds/ch01/15.webp"
image back16 = "images/backgrounds/ch01/16.webp"
image back17 = "images/backgrounds/ch01/17.webp"
image 1back1 = "images/backgrounds/ch02/1.webp"
image 1back2 = "images/backgrounds/ch01/15.webp"
image 1back3 = "images/backgrounds/ch02/3.webp"
image 1back4 = "images/backgrounds/ch02/4.webp"
image 1back5 = "images/backgrounds/ch02/5.webp"
image 1back6 = "images/backgrounds/ch02/6.webp"
image 1back7 = "images/backgrounds/ch02/7.webp"
image 1back8 = "images/backgrounds/ch02/8.webp"
image 1backtime1 = "images/backgrounds/ch02/time1.webp"
image 1backtime2 = "images/backgrounds/ch02/time2.webp"
image 1backtime3 = "images/backgrounds/ch02/time3.webp"
image 1backtime4 = "images/backgrounds/ch02/time4.webp"
image 1backtime5 = "images/backgrounds/ch02/time5.webp"
image 1backtimemen = "images/backgrounds/ch02/timemen.webp"
image 2back1 = "images/backgrounds/ch02/8.webp"
image 2back2 = "images/backgrounds/ch03/2.webp"
image 2back3 = "images/backgrounds/ch03/3.webp"
image 2back4 = "images/backgrounds/ch03/4.webp"
image 2back5 = "images/backgrounds/ch03/5.webp"
image 2back6 = "images/backgrounds/ch03/6.webp"
image 2back7 = "images/backgrounds/ch02/5.webp"
image 2back8 = "images/backgrounds/ch03/8.webp"
image 2back9 = "images/backgrounds/ch03/9.webp"
image 2back10 = "images/endings/true/1.5.webp"
image 2back11 = "images/backgrounds/ch03/11.webp"
image 3back1 = "images/backgrounds/ch02/5.webp"
image 3back2 = "images/backgrounds/ch04/2.webp"
image 3back3 = "images/backgrounds/ch04/3.webp"
image 3back4 = "images/backgrounds/ch04/4.webp"
image 3back5 = "images/backgrounds/ch04/5.webp"
image 3back6 = "images/backgrounds/ch04/6.webp"
image 3back7 = "images/backgrounds/ch04/7.webp"
image 3back8 = "images/backgrounds/ch04/8.webp"
image 3back9 = "images/backgrounds/ch04/9.webp"
image 3back10 = "images/backgrounds/ch04/10.webp"
image 3back11 = "images/backgrounds/ch04/11.webp"
image 4back1 = "images/backgrounds/ch05/1.webp"
image 4back2 = "images/backgrounds/ch05/2.webp"
image 4back3 = "images/backgrounds/ch05/3.webp"
image 4back4 = "images/backgrounds/ch05/4.webp"
image 4back5 = "images/backgrounds/ch05/5.webp"
image 4back6 = "images/backgrounds/ch05/6.webp"
image 4back7 = "images/backgrounds/ch05/7.webp"
image canal = "images/books/canal.webp"
image coi = "images/books/coi.webp"
image lermnt = "images/books/lermnt.webp"
image misticPeter = "images/books/mistic_peter.webp"
image promish = "images/books/promish.webp"
image rest = "images/books/rest.webp"
image m0 = "images/characters/player_m/m0.webp"
image m1 = "images/characters/player_m/m1.webp"
image m2 = "images/characters/player_m/m2.webp"
image m3 = "images/characters/player_m/m3.webp"
image m4 = "images/characters/player_m/m4.webp"
image m5 = "images/characters/player_m/m3.webp"
image m6 = "images/characters/player_m/m4.webp"
image m7 = "images/characters/player_m/m7.webp"
image m8 = "images/characters/player_m/m8.webp"
image g0 = "images/characters/player_f/g0.webp"
image g1 = "images/characters/player_f/g1.webp"
image g2 = "images/characters/player_f/g2.webp"
image g3 = "images/characters/player_f/g3.webp"
image g4 = "images/characters/player_f/g4.webp"
image g5 = "images/characters/player_f/g3.webp"
image g6 = "images/characters/player_f/g4.webp"
image g7 = "images/characters/player_f/g7.webp"
image g8 = "images/characters/player_f/g8.webp"
image t1 = "images/characters/timiryazev/t1.webp"
image t2 = "images/characters/timiryazev/t2.webp"
image ghost_children = "images/characters/ghosts/children.webp"
image ghost_pacient = "images/characters/ghosts/dntname.webp"
image ghost_fish = "images/characters/ghosts/fish.webp"
image ghost_ht1 = "images/characters/ghosts/ht1.webp"
image ghost_ht2 = "images/characters/ghosts/ht2.webp"
image ghost_ht3 = "images/characters/ghosts/ht3.webp"
image ghost_lerm = "images/characters/ghosts/lerm.webp"
image ghost_magic = "images/characters/ghosts/magic.webp"
image ghost_pevica = "images/characters/ghosts/pevica.webp"
image ghost_piyanica = "images/characters/ghosts/piyanica.webp"
image ghost_wrker = "images/characters/ghosts/wrker.webp"
image ghost_wrkhe = "images/characters/ghosts/wrkhe.webp"
image ghost_wrkshe = "images/characters/ghosts/wrkshe.webp"
image ghost_doctor = "images/characters/ghosts/doctor.png"
image ghost_g = "images/characters/ghosts/g_ghost.png"
image ghost_m = "images/characters/ghosts/m_ghost.png"
image ghost_nikolai = "images/characters/ghosts/nikolai.png"
image ghost_policia = "images/characters/ghosts/policia.png"

# ---- Анимации (MP4 для Windows/Android/iOS/Web) ----
image anim1 = Movie(play="images/animations/12.mp4", image=Null(), loop=True)
image animcon1 = Movie(play="images/animations/animcon1.mp4", image=Null(), loop=True)
image animcon23 = Movie(play="images/animations/animcon3.mp4", image=Null(), loop=True)

# ---- Музыка ----
define ball = "audio/ball.mp3"
define bany = "audio/bany.mp3"
define calmness = "audio/calmness.mp3"
define conec_1 = "audio/conec_1.mp3"
define conec_2 = "audio/conec_2.mp3"
define conec_3 = "audio/conec_3.mp3"
define dktsoy = "audio/dktsoy.mp3"
define factory = "audio/factory.mp3"
define ghostWorld = "audio/ghostworld.mp3"
define haspit = "audio/haspit.mp3"
define imperator = "audio/imperator.mp3"
define mermaiddone = "audio/mermaiddone.mp3"
define name = "audio/name.mp3"
define office = "audio/office.mp3"
define titleMaster = "audio/titlemaster.mp3"
define untitledMaster = "audio/untitledmaster.mp3"

