# 06_endings.rpy
# Сгенерировано из оригинального script.rpy; текст сюжета сохранён.

label sceneplox:
    scene animcon1 with fade:
        size (1280, 720)
        fit "fill"
    stop music fadeout 0.2
    play music conec_1 fadein 2.0 loop if_changed
    $ renpy.pause(delay=6.4, hard=True)
    scene back0:
        size (1280, 720)
        fit "fill"
    if gender == "M":
        show m2:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Что происходит? Время закончилось?"
        character "Но все должно было вернуться на места!"
        "Призрачный туман не собирался никуда исчезать. Он мягко окутывал библиотеку и скользил по улочкам."
        hide m2 with dissolve
        # кат - сцена
        scene skapina with fade:
            size (1280, 720)
            fit "fill"
        $ renpy.pause(delay=3.0, hard=True)
        show m7:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Снесенные дома все еще здесь… Я в призрачном мире!"
        "[player_name] хотел посмотреть на часы, но, взглянув на свои руки, ужаснулся."
        hide m7 with dissolve

        show m_ryki0 with fade:
            size (1280, 720)
            fit "fill"
        $ renpy.pause(delay=1.0, hard=True)
        show m_ryki1 with fade:
            size (1280, 720)
            fit "fill"
        $ renpy.pause(delay=1.0, hard=True)
        show m_ryki2 with fade:
            size (1280, 720)
            fit "fill"
        $ renpy.pause(delay=1.0, hard=True)
        show m_ryki3 with fade:
            size (1280, 720)
            fit "fill"
        $ renpy.pause(delay=1.0, hard=True)

        show m7:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Что происходит?!"
        "В вас больше от призраков, и вы не сможете вернуться в реальность."
        "От резкой паники настроение растворялось, скатываясь в полную апатию."
        "Все, что беспокоило раньше, стало каким-то далеким и безразличным."
        "В последние секунды, когда внутри себя еще можно было почувствовать что-то человеческое, [player_name] вспомнил о библиотекарях, о книгах, о Клименте Аркадьевиче…"
        "А затем [player_name] растворился в тумане."
        hide m7 with dissolve
        scene m_1 with fade:
            size (1280, 720)
            fit "fill"
        $ renpy.pause(delay=3.0, hard=True)
        "Мы не слышим зов этих улиц, стараемся не замечать его, ведь что может быть интересного в неприглядных уголках окраин?"
        "Но рано или поздно мы узнаем о призраках, они заставят нас вспомнить о том, кем они были… Но бороться придется не с ними, а с собой. Ведь именно мы предали забвению историю целого квартала…"
        "И, кто знает, сможем ли все исправить? Или растворимся вместе с тайнами, которых с годами будет становиться все больше."
        "Вы шли по пути «Призрака» слишком часто, поэтому вы остались в призрачном мире."
        "Но всегда можно попробовать сразиться с призраками снова…"
        jump scenetitri
    elif gender =="G":
        show g2:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Что происходит? Время закончилось?"
        character "Но все должно было вернуться на места!"
        "Призрачный туман не собирался никуда исчезать. Он мягко окутывал библиотеку и скользил по улочкам."
        hide g2 with dissolve
        # кат - сцена
        scene skapina with fade:
            size (1280, 720)
            fit "fill"
        $ renpy.pause(delay=3.0, hard=True)
        show g7:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Снесенные дома все еще здесь… Я в призрачном мире!"
        "[player_name] хотела посмотреть на часы, но, взглянув на свои руки, ужаснулась."
        hide g7 with dissolve

        show g_ryki0 with fade:
            size (1280, 720)
            fit "fill"
        $ renpy.pause(delay=1.0, hard=True)
        show g_ryki1 with fade:
            size (1280, 720)
            fit "fill"
        $ renpy.pause(delay=1.0, hard=True)
        show g_ryki2 with fade:
            size (1280, 720)
            fit "fill"
        $ renpy.pause(delay=1.0, hard=True)
        show g_ryki3 with fade:
            size (1280, 720)
            fit "fill"
        $ renpy.pause(delay=1.0, hard=True)

        show g7:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Что происходит?!"
        "В вас больше от призраков, и вы не сможете вернуться в реальность."
        "От резкой паники настроение растворялось, скатываясь в полную апатию."
        "Все, что беспокоило раньше, стало каким-то далеким и безразличным."
        "В последние секунды, когда внутри себя еще можно было почувствовать что-то человеческое, [player_name] вспомнила о библиотекарях, о книгах, о Клименте Аркадьевиче…"
        "А затем [player_name] растворилась в тумане."
        hide g7 with dissolve
        scene g_1 with fade:
            size (1280, 720)
            fit "fill"
        $ renpy.pause(delay=3.0, hard=True)
        "Мы не слышим зов этих улиц, стараемся не замечать его, ведь что может быть интересного в неприглядных уголках окраин?"
        "Но рано или поздно мы узнаем о призраках, они заставят нас вспомнить о том, кем они были… Но бороться придется не с ними, а с собой. Ведь именно мы предали забвению историю целого квартала…"
        "И, кто знает, сможем ли все исправить? Или растворимся вместе с тайнами, которых с годами будет становиться все больше."
        "Вы шли по пути «Призрака» слишком часто, поэтому вы остались в призрачном мире."
        "Но всегда можно попробовать сразиться с призраками снова…"
        jump scenetitri

label scenegood:
    stop music fadeout 0.2
    play music conec_2 fadein 2.0 loop if_changed
    scene animcon23 with fade:
        size (1280, 720)
        fit "fill"
    $ renpy.pause(delay=6.4, hard=True)
    scene 4_1_2:
        size (1280, 720)
        fit "fill"
    if gender == "M":
        "[player_name] не помнил, как оказался снова перед библиотекой."
        show m7:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Что происходит?"
        "Небо было ясное. То самое небо, которое приветливо встречало в начале дня, до того как произошла вся эта история с призраками."
        "Казалось, что все закончилось. Но почему-то все еще не отпускало легкое чувство тревожности…"
        "[player_name], вдохнув больше воздуха, отправился в библиотеку."
        hide m7 with dissolve
        scene 1_1_2 with fade:
            size (1280, 720)
            fit "fill"
        "Библиотека выглядела вполне нормально. Зловещий туман больше не прогуливался среди интерьеров."
        show m1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Здравствуйте."
        show lena2:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        characterlena "Здравствуйте…"
        "Девушка не двигалась и смотрела вперед пустым взглядом."
        hide m1 with dissolve
        show m6:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Все в порядке?"
        characterlena "Да."
        "Верилось с трудом. Что-то здесь было нечисто."
        character "Я пройду за книгой?"
        characterlena "Да."
        "Что-то здесь было не так. Но что?"
        "Нужно было разобраться, и [player_name] проследовал в читальный зал."
        hide m6 with dissolve
        hide lena2 with dissolve
        scene 3_1_2 with fade:
            size (1280, 720)
            fit "fill"
        "Повернув налево, [player_name] едва ли не столкнулся с заведующей библиотекой."
        show irina_Ernestovna_2:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        characteririnaErnestovna "…"
        "[player_name] хорошо был знаком с Ириной Эрнестовной. Она всегда была очень приветливой и много раз помогала разобраться со сложностями, если по каким-то причинам в библиотеке они возникали."
        "Сейчас было странно ее видеть такой отрешенной."
        show m6:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Ирина Эрнестовна, здравствуйте!"
        characteririnaErnestovna "Здравствуйте, проходите."
        "[player_name] не стал докучать, но в голову закралась мысль, что вернувшиеся библиотекари ведут себя странно. Настороженно он осмотрел читальный зал."
        hide irina_Ernestovna_2 with dissolve
        show irina_2:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        characteririna "…"
        hide irina_2 with dissolve
        show elisaveta_2:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        characterelizaveta "…"
        hide elisaveta_2 with dissolve
        show anastasia_2:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        characteranastasia "…"
        hide anastasia_2 with dissolve
        "Механически библиотекари ходили по залу, расставляли книжки. Но их сознание словно находилось где-то далеко. И [player_name] догадывался, где."
        character "В Везенбергском квартале…"
        "Отчего-то [player_name] произнес это вслух…"
        scene 2_1_2 with fade:
            size (1280, 720)
            fit "fill"
        "В зале абонемента было тихо. [player_name] устроился на красном диванчике, стараясь осознать, что происходит."
        character "Все вернулись, но что-то пошло не так. Они сами на себя не похожи. Словно застряли в двух реальностях одновременно…"
        "Между книжными стеллажами мелькнула тень."
        hide m6 with dissolve
        show m1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "А?"
        character "Простите…"
        hide m1 with dissolve
        show ghost_ht1:
            zoom 1.0 xpos 800 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        characterht1 "…"
        scene 2_1_2 with fade:
            size (1280, 720)
            fit "fill"
        hide ghost_ht1
        show m7:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        "Резко вскочив на ноги, [player_name] моргнул, но уже никого не увидел."
        character "Что происходит?"
        "Развернувшись к выходу, [player_name] столкнулся с другим призраком."
        show ghost_children:
            size (1280, 720)
            fit "fill"
            zoom 1.0 xpos 450 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        characterchildren "Привет!"
        hide ghost_children
        "Заливисто засмеявшись, призрак убежал и растворился."
        hide m7 with dissolve
        show m2:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Я сейчас сойду с ума…"
        show t1:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Успокойся, мой друг."
        hide m2 with dissolve
        show m7:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Климент Аркадьевич?"
        tmrz "Давай сядем и все обсудим."
        "Тимирязев со вздохом устроился на диванчике напротив. [player_name], не в силах вымолвить ни слова, безвольно сел на прежнее место."
        hide m7 with dissolve
        show m1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Вы говорили, что все закончится. Мы что-то сделали не так?"
        tmrz "Ты смог отвоевать этот мир, но не без потерь."
        character "Что это значит?"
        tmrz "Сознание библиотекарей балансирует между мирами. А ты теперь всегда будешь видеть тех призраков, что тебе не посчастливилось встретить. Но будь мужественен, навредить они тебе не смогут. Но запугивать будут."
        tmrz "Мне жаль, мой друг."
        character "Но наш мир им не удалось забрать?"
        tmrz "К счастью, нет."
        "Сложно было смириться с тем, что теперь призраки должны будут стать частью повседневности. Да и как вообще это повлияет на жизнь, не поддавалось осознанию. Но было понятно то, что теперь придется с этим как-то уживаться…"
        character "Есть и плюсы."
        tmrz "Здорово, что ты не растерял оптимизма. Какие?"
        character "Теперь у нас будет возможность с вами общаться. И мы заполним все пробелы в истории. Вы же не откажете мне в беседе?"
        tmrz "Конечно, нет. Предлагаю тебе наконец-то взять кофе, о котором ты мечтал с самого начала пути, и обсудим все, что с нами произошло."
        "Да, новые обстоятельства пугали. Но [player_name] знал, что теперь у него есть друг, который поможет со всем справиться. Вместе они найдут выход. А это уже стоило того, чтобы пройти весь путь."
        "Вы слишком часто шли по пути «Призрака», но старались оставаться в «Яви». Поэтому вы вернулись в реальность, однако призраки так и будут следовать за вами по пятам…"
        "Однако всегда можно попробовать сразиться с ними снова…"
        hide m1 with dissolve
        hide t1 with dissolve
        jump scenetitri
    elif gender =="G":
        "[player_name] не помнила, как оказалась снова перед библиотекой."
        show g7:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Что происходит?"
        "Небо было ясное. То самое небо, которое приветливо встречало в начале дня, до того как произошла вся эта история с призраками."
        "Казалось, что все закончилось. Но почему-то все еще не отпускало легкое чувство тревожности…"
        "[player_name], вдохнув больше воздуха, отправилась в библиотеку."
        hide g7 with dissolve
        scene 1_1_2 with fade:
            size (1280, 720)
            fit "fill"
        "Библиотека выглядела вполне нормально. Зловещий туман больше не прогуливался среди интерьеров."
        show g1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Здравствуйте."
        show lena2:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        characterlena "Здравствуйте…"
        "Девушка не двигалась и смотрела вперед пустым взглядом."
        hide g1 with dissolve
        show g6:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Все в порядке?"
        characterlena "Да."
        "Верилось с трудом. Что-то здесь было нечисто."
        character "Я пройду за книгой?"
        characterlena "Да."
        "Что-то здесь было не так. Но что?"
        "Нужно было разобраться, и [player_name] проследовала в читальный зал."
        hide g6 with dissolve
        hide lena2 with dissolve
        scene 3_1_2 with fade:
            size (1280, 720)
            fit "fill"
        "Повернув налево, [player_name] едва ли не столкнулась с заведующей библиотекой."
        show irina_Ernestovna_2:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        characteririnaErnestovna "…"
        "[player_name] хорошо была знакома с Ириной Эрнестовной. Она всегда была очень приветливой и много раз помогала разобраться со сложностями, если по каким-то причинам в библиотеке они возникали."
        "Сейчас было странно ее видеть такой отрешенной."
        show g6:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Ирина Эрнестовна, здравствуйте!"
        characteririnaErnestovna "Здравствуйте, проходите."
        "[player_name] не стала докучать, но в голову закралась мысль, что вернувшиеся библиотекари ведут себя странно. Настороженно она осмотрела читальный зал."
        hide irina_Ernestovna_2 with dissolve
        show irina_2:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        characteririna "…"
        hide irina_2 with dissolve
        show elisaveta_2:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        characterelizaveta "…"
        hide elisaveta_2 with dissolve
        show anastasia_2:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        characteranastasia "…"
        hide anastasia_2 with dissolve
        "Механически библиотекари ходили по залу, расставляли книжки. Но их сознание словно находилось где-то далеко. И [player_name] догадывалась, где."
        character "В Везенбергском квартале…"
        "Отчего-то [player_name] произнесла это вслух…"
        scene 2_1_2 with fade:
            size (1280, 720)
            fit "fill"
        "В зале абонемента было тихо. [player_name] устроилась на красном диванчике, стараясь осознать, что происходит."
        character "Все вернулись, но что-то пошло не так. Они сами на себя не похожи. Словно застряли в двух реальностях одновременно…"
        "Между книжными стеллажами мелькнула тень."
        hide g6 with dissolve
        show g1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "А?"
        character "Простите…"
        hide g1 with dissolve
        show ghost_ht1:
            zoom 1.0 xpos 800 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        characterht1 "…"
        scene 2_1_2 with fade:
            size (1280, 720)
            fit "fill"
        hide ghost_ht1
        show g7:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        "Резко вскочив на ноги, [player_name] моргнула, но уже никого не увидела."
        character "Что происходит?"
        "Развернувшись к выходу, [player_name] столкнулась с другим призраком."
        show ghost_children:
            size (1280, 720)
            fit "fill"
            zoom 1.0 xpos 450 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        characterchildren "Привет!"
        hide ghost_children
        "Заливисто засмеявшись, призрак убежал и растворился."
        hide g7 with dissolve
        show g2:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Я сейчас сойду с ума…"
        show t1:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Успокойся, мой друг."
        hide g2 with dissolve
        show g7:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Климент Аркадьевич?"
        tmrz "Давай сядем и все обсудим."
        "Тимирязев со вздохом устроился на диванчике напротив. [player_name], не в силах вымолвить ни слова, безвольно села на прежнее место."
        hide g7 with dissolve
        show g1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Вы говорили, что все закончится. Мы что-то сделали не так?"
        tmrz "Ты смогла отвоевать этот мир, но не без потерь."
        character "Что это значит?"
        tmrz "Сознание библиотекарей балансирует между мирами. А ты теперь всегда будешь видеть тех призраков, что тебе не посчастливилось встретить. Но будь мужественной, навредить они тебе не смогут. Но запугивать будут."
        tmrz "Мне жаль, мой друг."
        character "Но наш мир им не удалось забрать?"
        tmrz "К счастью, нет."
        "Сложно было смириться с тем, что теперь призраки должны будут стать частью повседневности. Да и как вообще это повлияет на жизнь, не поддавалось осознанию. Но было понятно то, что теперь придется с этим как-то уживаться…"
        character "Есть и плюсы."
        tmrz "Здорово, что ты не растеряла оптимизма. Какие?"
        character "Теперь у нас будет возможность с вами общаться. И мы заполним все пробелы в истории. Вы же не откажете мне в беседе?"
        tmrz "Конечно, нет. Предлагаю тебе наконец-то взять кофе, о котором ты мечтала с самого начала пути, и обсудим все, что с нами произошло."
        "Да, новые обстоятельства пугали. Но [player_name] знала, что теперь у нее есть друг, который поможет со всем справиться. Вместе они найдут выход. А это уже стоило того, чтобы пройти весь путь."
        "Вы слишком часто шли по пути «Призрака», но старались оставаться в «Яви». Поэтому вы вернулись в реальность, однако призраки так и будут следовать за вами по пятам…"
        "Однако всегда можно попробовать сразиться с ними снова…"
        hide g1 with dissolve
        hide t1 with dissolve
        jump scenetitri

label scenegreat:
    stop music fadeout 0.2
    play music conec_3 fadein 2.0 loop if_changed
    scene animcon23 with fade:
        size (1280, 720)
        fit "fill"
    $ renpy.pause(delay=6.4, hard=True)
    scene back5:
        size (1280, 720)
        fit "fill"
    if gender == "M":
        "[player_name] не помнил, как оказался снова перед библиотекой."
        show m7:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Что происходит?"
        "Небо было ясное. То самое небо, которое приветливо встречало в начале дня, до того как произошла вся эта история с призраками."
        "Сердце подсказывало, что все закончилось, но не хотелось радоваться заранее. Вдруг это очередная уловка?"
        "[player_name], вдохнув больше воздуха, отправился в библиотеку."
        hide m7 with dissolve
        scene 1_0_3 with fade:
            size (1280, 720)
            fit "fill"
        show irina_Ernestovna_3:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        characteririnaErnestovna "Добро пожаловать! Рада вас снова видеть у нас."
        "[player_name] от удивления на несколько секунд застыл. В библиотеке снова кипела жизнь, сюда вернулись краски, исчез туман. По помещениям суетливо бегали библиотекари."
        show m1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Здравствуйте. Я пройду?"
        characteririnaErnestovna "Конечно, проходите."
        "[player_name] решил все тщательно осмотреть, прежде чем делать выводы."
        hide m1 with dissolve
        hide irina_Ernestovna_3 with dissolve
        scene 1_3_3 with fade:
            size (1280, 720)
            fit "fill"
        "В читальном зале тоже кипела работа. Библиотекари к чему-то готовились."
        show irina_3:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        characteririna "Добрый день! Вы за книжками или хотите посетить наши мероприятия?"
        show m1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "А какие у вас сегодня мероприятия проходят?"
        "[player_name] выглядел немного тревожным, напряжение все еще не хотело испаряться. Всюду чудился подвох."
        characteririna "У нас начинается фестиваль «Японская осень», поэтому проходит множество различных лекций, мастер-классов. Но об этом лучше спросить у Анастасии."
        hide irina_3 with dissolve
        show anastasia_3:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        characteranastasia "Добрый день. Уже скоро начнем играть в тосэнке — традиционную японскую игру. Если хотите, присоединяйтесь."
        hide anastasia_3 with dissolve
        show irina_3:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        characteririna "Еще сегодня пройдет занятие по оригами, будем складывать бумажных журавликов. Хотите записаться?"
        character "Может быть, в другой раз."
        characteririna "Держите, это наш буклет с мероприятиями."
        character "Большое спасибо."
        hide irina_3 with dissolve
        show anastasia_3:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        characteranastasia "Хорошего дня, рады помочь. Если надумаете, заходите."
        "Все выглядело абсолютно нормально. Словно и не было этих приключений. [player_name] невольно подумал, что все это приснилось. Прижимая буклет к себе, он решил еще немного пройтись по библиотеке."
        hide anastasia_3 with dissolve
        hide m1 with dissolve
        scene 1_2_3 with fade:
            size (1280, 720)
            fit "fill"
        "В зале было спокойно. За рабочим компьютером сидела девушка и сосредоточенно что-то рисовала."
        show m1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Вы пишете картину?"
        "Девушка приветливо улыбнулась в ответ."
        show elisaveta_3:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        characterelizaveta "Завтра провожу занятие по правополушарному рисованию. Готовлюсь."
        hide m1 with dissolve
        show m8:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Очень красиво!"
        characterelizaveta "Спасибо."
        "Устроившись на красном диванчике за столиком, [player_name] пробежался глазами по буклету, который выдали библиотекари."
        "Кажется, все вернулось на свои места. В библиотеку понемногу приходили другие люди. Кто-то сдавал книжки, кто-то ждал лекцию, кто-то просто сидел со своим ноутбуком и решал рабочие вопросы."
        "От призраков не осталось и следа."
        "Пробежавшись глазами по буклету, [player_name] едва ли не поперхнулся, увидев название библиотечной экскурсии."
        hide m8 with dissolve
        hide elisaveta_3 with dissolve
        show m5:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "«Тайны Везенбергского квартала»…"
        show t2:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Да-да. Это история о том самом квартале, в котором тебе посчастливилось побывать в призрачном мире."
        "От неожиданности [player_name] подпрыгнул на месте. Перед ним сидел Тимирязев, появившийся из ниоткуда."
        hide m5 with dissolve
        show m7:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Климент Аркадьевич?!! Вы же сказали, что я больше вас не увижу."
        hide t2 with dissolve
        show t1:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Не пугайся, мой друг, я не знал, что будет в конце нашего пути и сможем ли мы увидеться снова. Я прихожу к тебе в последний раз, дальше остатки тумана полностью уйдут с этих улиц и люди больше не увидят привидений."
        tmrz "А пока я просто обязан поблагодарить тебя за спасение библиотеки и поздравить с успешным окончанием миссии."
        "Спасибо, я уже думал, что это все мне снилось. "
        tmrz "Нет, мой друг. Все было более чем реально. Я лично очень благодарен тебе."
        hide m7 with dissolve
        show m1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "А что теперь?"
        tmrz "Ты победил призраков, теперь никто из них больше никогда не потревожит тебя. Но обещай мне кое-что."
        character "Что?"
        tmrz "Никогда не забывай о том, что произошло."
        hide m1 with dissolve
        show m6:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Не забуду."
        tmrz "Прощай! Буду радоваться твоим новым успехам."
        character "Прощайте! И, если так уж выйдет, буду рад встретиться вновь."
        hide t1 with dissolve
        "Климент Аркадьевич исчез, но [player_name] чувствовал, что его добрый дух где-то рядом и еще много лет будет охранять библиотеку от бед."
        hide m6 with dissolve
        "Только сейчас ушла эта жуткая тревожность — и стало бесконечно легко."
        "[player_name] посмотрел на часы и с улыбкой направился к библиотекарю."
        show m1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Извините, не подскажете, а я могу попасть на сегодняшнюю экскурсию по Везенбергскому кварталу?"
        show elisaveta_3:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        characterelizaveta "Конечно, поторопитесь. Группа уже внизу и скоро отправляется в путь."
        character "Спасибо!!!"
        hide elisaveta_3 with dissolve
        hide m1 with dissolve
        scene 1_0_3 with fade:
            size (1280, 720)
            fit "fill"
        show lena3:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        characterlena "Добрый день, меня зовут Елена, я ваш экскурсовод. И сегодня мы с вами отправимся в путешествие по  кварталу-призраку."
        characterlena "Везенбергским кварталом принято называть территорию, очерченную улицами Шкапина, Розенштейна, Обводным каналом и железной дорогой завода «Красный треугольник»…"
        hide lena3 with dissolve
        scene 1_5_3 with fade:
            size (1280, 720)
            fit "fill"
        "Время снова бежало линейно, потусторонние миры успокоились и ушли в спячку. Они поняли, что бесполезно бороться с законами природы."
        "За летом всегда идет осень, за зимой — весна… Жизнь не стоит на месте, и надо смириться с этим бесконечным течением."
        "Старое уходит, приходит новое. Это не всегда плохо. Призраки увидели, что у квартала есть будущее. Один смелый человек показал, что не все потеряно."
        "Несмотря на заблуждение множества людей, призраки точно знают, что даже один человек способен изменить весь мир."
        "И призраки поверили в него…"
        "Вы смогли спасти свой мир и вернуть библиотекарей. Мы гордимся вами. Спасибо за ваше смелое прохождение!"
        jump scenetitri
    elif gender =="G":
        "[player_name] не помнила, как оказалась снова перед библиотекой."
        show g7:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Что происходит?"
        "Небо было ясное. То самое небо, которое приветливо встречало в начале дня, до того как произошла вся эта история с призраками."
        "Сердце подсказывало, что все закончилось, но не хотелось радоваться заранее. Вдруг это очередная уловка?"
        "[player_name], вдохнув больше воздуха, отправилась в библиотеку."
        hide g7 with dissolve
        scene 1_0_3 with fade:
            size (1280, 720)
            fit "fill"
        show irina_Ernestovna_3:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        characteririnaErnestovna "Добро пожаловать! Рада вас снова видеть у нас."
        "[player_name] от удивления на несколько секунд застыла. В библиотеке снова кипела жизнь, сюда вернулись краски, исчез туман. По помещениям суетливо бегали библиотекари."
        show g1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Здравствуйте. Я пройду?"
        characteririnaErnestovna "Конечно, проходите."
        "[player_name] решила все тщательно осмотреть, прежде чем делать выводы."
        hide g1 with dissolve
        hide irina_Ernestovna_3 with dissolve
        scene 1_3_3 with fade:
            size (1280, 720)
            fit "fill"
        "В читальном зале тоже кипела работа. Библиотекари к чему-то готовились."
        show irina_3:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        characteririna "Добрый день! Вы за книжками или хотите посетить наши мероприятия?"
        show g1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "А какие у вас сегодня мероприятия проходят?"
        "[player_name] выглядела немного тревожной, напряжение все еще не хотело испаряться. Всюду чудился подвох."
        characteririna "У нас начинается фестиваль «Японская осень», поэтому проходит множество различных лекций, мастер-классов. Но об этом лучше спросить у Анастасии."
        hide irina_3 with dissolve
        show anastasia_3:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        characteranastasia "Добрый день. Уже скоро начнем играть в тосэнке — традиционную японскую игру. Если хотите, присоединяйтесь."
        hide anastasia_3 with dissolve
        show irina_3:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        characteririna "Еще сегодня пройдет занятие по оригами, будем складывать бумажных журавликов. Хотите записаться?"
        character "Может быть, в другой раз."
        characteririna "Держите, это наш буклет с мероприятиями."
        character "Большое спасибо."
        hide irina_3 with dissolve
        show anastasia_3:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        characteranastasia "Хорошего дня, рады помочь. Если надумаете, заходите."
        "Все выглядело абсолютно нормально. Словно и не было этих приключений. [player_name] невольно подумала, что все это приснилось. Прижимая буклет к себе, она решила еще немного пройтись по библиотеке."
        hide anastasia_3 with dissolve
        hide g1 with dissolve
        scene 1_2_3 with fade:
            size (1280, 720)
            fit "fill"
        "В зале было спокойно. За рабочим компьютером сидела девушка и сосредоточенно что-то рисовала."
        show g1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Вы пишете картину?"
        "Девушка приветливо улыбнулась в ответ."
        show elisaveta_3:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        characterelizaveta "Завтра провожу занятие по правополушарному рисованию. Готовлюсь."
        hide g1 with dissolve
        show g8:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Очень красиво!"
        characterelizaveta "Спасибо."
        "Устроившись на красном диванчике за столиком, [player_name] пробежалась глазами по буклету, который выдали библиотекари."
        "Кажется, все вернулось на свои места. В библиотеку понемногу приходили другие люди. Кто-то сдавал книжки, кто-то ждал лекцию, кто-то просто сидел со своим ноутбуком и решал рабочие вопросы."
        "От призраков не осталось и следа."
        "Пробежавшись глазами по буклету, [player_name] едва ли не поперхнулась, увидев название библиотечной экскурсии."
        hide g8 with dissolve
        hide elisaveta_3 with dissolve
        show g5:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "«Тайны Везенбергского квартала»…"
        show t2:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Да-да. Это история о том самом квартале, в котором тебе посчастливилось побывать в призрачном мире."
        "От неожиданности [player_name] подпрыгнула на месте. Перед ней сидел Тимирязев, появившийся из ниоткуда."
        hide g5 with dissolve
        show g7:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Климент Аркадьевич?!! Вы же сказали, что я больше вас не увижу."
        hide t2 with dissolve
        show t1:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Не пугайся, мой друг, я не знал, что будет в конце нашего пути и сможем ли мы увидеться снова. Я прихожу к тебе в последний раз, дальше остатки тумана полностью уйдут с этих улиц и люди больше не увидят привидений."
        tmrz "А пока я просто обязан поблагодарить тебя за спасение библиотеки и поздравить с успешным окончанием миссии."
        "Спасибо, я уже думала, что это все мне снилось."
        tmrz "Нет, мой друг. Все было более чем реально. Я лично очень благодарен тебе."
        hide g7 with dissolve
        show g1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "А что теперь?"
        tmrz "Ты победила призраков, теперь никто из них больше никогда не потревожит тебя. Но обещай мне кое-что."
        character "Что?"
        tmrz "Никогда не забывай о том, что произошло."
        hide g1 with dissolve
        show g6:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Не забуду."
        tmrz "Прощай! Буду радоваться твоим новым успехам."
        character "Прощайте! И, если так уж выйдет, буду рада встретиться вновь."
        hide t1 with dissolve
        "Климент Аркадьевич исчез, но [player_name] чувствовала, что его добрый дух где-то рядом и еще много лет будет охранять библиотеку от бед."
        hide g6 with dissolve
        "Только сейчас ушла эта жуткая тревожность — и стало бесконечно легко."
        "[player_name] посмотрела на часы и с улыбкой направилась к библиотекарю."
        show g1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Извините, не подскажете, а я могу попасть на сегодняшнюю экскурсию по Везенбергскому кварталу?"
        show elisaveta_3:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        characterelizaveta "Конечно, поторопитесь. Группа уже внизу и скоро отправляется в путь."
        character "Спасибо!!!"
        hide elisaveta_3 with dissolve
        hide g1 with dissolve
        scene 1_0_3 with fade:
            size (1280, 720)
            fit "fill"
        show lena3:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        characterlena "Добрый день, меня зовут Елена, я ваш экскурсовод. И сегодня мы с вами отправимся в путешествие по  кварталу-призраку."
        characterlena "Везенбергским кварталом принято называть территорию, очерченную улицами Шкапина, Розенштейна, Обводным каналом и железной дорогой завода «Красный треугольник»…"
        hide lena3 with dissolve
        scene 1_5_3 with fade:
            size (1280, 720)
            fit "fill"
        "Время снова бежало линейно, потусторонние миры успокоились и ушли в спячку. Они поняли, что бесполезно бороться с законами природы."
        "За летом всегда идет осень, за зимой — весна… Жизнь не стоит на месте, и надо смириться с этим бесконечным течением."
        "Старое уходит, приходит новое. Это не всегда плохо. Призраки увидели, что у квартала есть будущее. Один смелый человек показал, что не все потеряно."
        "Несмотря на заблуждение множества людей, призраки точно знают, что даже один человек способен изменить весь мир."
        "И призраки поверили в него…"
        "Вы смогли спасти свой мир и вернуть библиотекарей. Мы гордимся вами. Спасибо за ваше смелое прохождение!"
        jump scenetitri

