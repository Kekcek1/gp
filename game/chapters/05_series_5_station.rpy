# 05_series_5_station.rpy
# Сгенерировано из оригинального script.rpy; текст сюжета сохранён.

label scene38:
    label scene_ised:
        if gender == "M":
            show t1:
                zoom 1.0 xalign 1.3 yalign 1.0
                alpha 0.0
                easein 0.3 alpha 1.0
            tmrz "Мой друг, крепись. Осталось совсем немного."
            show m1:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
            character "Я уже начинаю привыкать. И, если честно, даже сочувствовать призракам."
            tmrz "Твоя доброта похвальна. Но ты должен бороться за свой мир. Нельзя оглядываться назад, нужно двигаться дальше, сохраняя притом память о прошлом."
            tmrz "Думаю, настало время посетить Балтийский вокзал."
            character "Мне даже не терпится узнать, кого мы там встретим. Меня уже сложно удивить."
            tmrz "О, поверь мне, ты будешь под впечатлением."
            hide m1
            hide t1
            with dissolve
            jump scene39
        elif gender == "G":
            show t1:
                zoom 1.0 xalign 1.3 yalign 1.0
                alpha 0.0
                easein 0.3 alpha 1.0
            tmrz "Мой друг, крепись. Осталось совсем немного."
            show g1:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
            character "Я уже начинаю привыкать. И, если честно, даже сочувствовать призракам."
            tmrz "Твоя доброта похвальна. Но ты должна бороться за свой мир. Нельзя оглядываться назад, нужно двигаться дальше, сохраняя притом память о прошлом."
            tmrz "Думаю, настало время посетить Балтийский вокзал."
            character "Мне даже не терпится узнать, кого мы там встретим. Меня уже сложно удивить."
            tmrz "О, поверь мне, ты будешь под впечатлением."
            hide g1
            hide t1
            with dissolve
            jump scene39

label scene39:
    window hide
    with None
    # кат - сцена
    scene seria5 with fade:
        size (1280, 720)
        fit "fill"
    # call predonwload
    $ renpy.pause(delay=6.0, hard=True)
    scene 4back1 with fade:
        size (1280, 720)
        fit "fill"
    stop music fadeout 2.0
    play music imperator fadein 2.0 loop if_changed
    if gender == "M":
        "[player_name] и Климент Аркадьевич остановились на площади Балтийского вокзала. Как и в современности, в призрачном мире тоже было довольно людно, если так можно сказать о привидениях."
        "Тени людей вышагивали туда-сюда, имитируя какие-то дела, хотя их лица оставались безучастными."
        show t1:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Что скажешь, мой друг?"
        show m1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Мы в Петергоф поедем?"
        tmrz "О нет, не хватало нам призраков Петергофа."
        character "Там тоже есть призраки?"
        tmrz "Еще какие! Я, конечно, в тебя верю, но все-таки оно не стоит того."
        tmrz "Давай подойдем поближе к Балтийскому вокзалу."
        hide t1 with dissolve
        scene 4back2 with fade:
            size (1280, 720)
            fit "fill"
        show t2:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Видишь часы на окошке?"
        character "Ага."
        tmrz "Это часы фирмы «Павел Буре», которая в свое время была на рынке вне конкуренции. В 1899 году компания получила звание «Поставщик Двора Его Императорского Величества»."
        tmrz "В твое время они все еще работают, в ХХ веке их перевели на электрическое питание."
        character "Не знал, что они такие стар… кхем… ценные."
        hide t2 with dissolve
        show t1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Если это тебя не удивило, тогда посмотри вон туда."
        hide t1 with dissolve
        hide m1 with dissolve
        scene 4back1 with fade:
            size (1280, 720)
            fit "fill"
        "Из левого крыла Балтийского вокзала вышел человек, которого сразу можно было узнать, но поверить в то, что видишь его, было невозможно."
        show ghost_nikolai:
            zoom 1.0 xalign 0.7 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        characternikolay2 "…"
        "[player_name] потерял дар речи. Видимо, государь Российской империи вместе с семьей вернулся из Петергофа в Петроград."
        show m7:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "…"
        show t1:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Вижу, ты под впечатлением, мой друг."
        character "Не каждый день я встречаю представителей семьи Романовых."
        characternikolay2 "…"
        hide m7 with dissolve
        hide ghost_nikolai with dissolve
        show m2:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Только сейчас заметил: а где центральный вход на вокзал?"
        tmrz "Раньше входа было два:  справа — для простого люда, а тот, что слева, принадлежал императорской семье, кстати, нам туда."
        character "Климент Аркадьевич, мы же не принадлежим к «августейшим особам». Как мы туда пройдем?"
        tmrz "Подключай смекалку, мой друг."
        "Климент Аркадьевич выдвинулся в сторону Балтийского вокзала. [player_name], вздохнув, нехотя отправился за ним."
        show ghost_policia:
            zoom 1.0 xalign 0.7 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        characterpolicia "Стой! Кто тут!"
        hide ghost_policia with dissolve
        hide m2 with dissolve
        hide t1 with dissolve
        label scene39_0_m:
            menu:
                character ""
                "Мы на экскурсию":
                    if rightornot == 0:
                        $ ghost += 1
                        $ rightornot += 1
                        "+ Призрак"
                    show ghost_policia:
                        zoom 1.0 xalign 0.7 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    characterpolicia "Вы что, с ума сошли? Какая экскурсия? А ну прочь!"
                    "Вам не удалось обойти полицейского, попробуйте еще раз."
                    jump scene39_0_m
                    hide ghost_policia with dissolve
                "Мы инженеры-механики":
                    show ghost_policia:
                        zoom 1.0 xalign 0.7 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    characterpolicia "Ну наконец-то, вас уже заждались. Проходите быстрее."
                    if rightornot == 0:
                        $ reality += 1
                        $ rightornot += 1
                        "+ Явь"
                    "Вам удалось обойти полицейского."
                    hide ghost_policia with dissolve
                    $ rightornot == 0
                    "Тимирязев и [player_name] переглянулись и поспешили вперед."
                    jump scene40
                "Простите, заблудились":
                    show ghost_policia:
                        zoom 1.0 xalign 0.7 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    characterpolicia "А ну прочь отсюда! Вам нельзя здесь находиться."
                    if rightornot == 0:
                        $ ghost += 1
                        $ rightornot += 1
                        "+ Призрак"
                    "Вам не удалось обойти полицейского, попробуйте еще раз."
                    hide ghost_policia with dissolve
                    jump scene39_0_m
        jump scene40
    elif gender == "G":
        "[player_name] и Климент Аркадьевич остановились на площади Балтийского вокзала. Как и в современности, в призрачном мире тоже было довольно людно, если так можно сказать о привидениях."
        "Тени людей вышагивали туда-сюда, имитируя какие-то дела, хотя их лица оставались безучастными."
        show t1:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Что скажешь, мой друг?"
        show g1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Мы в Петергоф поедем?"
        tmrz "О нет, не хватало нам призраков Петергофа."
        character "Там тоже есть призраки?"
        tmrz "Еще какие! Я, конечно, в тебя верю, но все-таки оно не стоит того."
        tmrz "Давай подойдем поближе к Балтийскому вокзалу."
        hide t1 with dissolve
        scene 4back2 with fade:
            size (1280, 720)
            fit "fill"
        show t2:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Видишь часы на окошке?"
        character "Ага."
        tmrz "Это часы фирмы «Павел Буре», которая в свое время была на рынке вне конкуренции. В 1899 году компания получила звание «Поставщик Двора Его Императорского Величества»."
        tmrz "В твое время они все еще работают, в ХХ веке их перевели на электрическое питание."
        character "Не знала, что они такие стар… кхем… ценные."
        hide t2 with dissolve
        show t1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Если это тебя не удивило, тогда посмотри вон туда."
        hide t1 with dissolve
        hide g1 with dissolve
        scene 4back1 with fade:
            size (1280, 720)
            fit "fill"
        "Из левого крыла Балтийского вокзала вышел человек, которого сразу можно было узнать, но поверить в то, что видишь его, было невозможно."
        show ghost_nikolai:
            zoom 1.0 xalign 0.7 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        characternikolay2 "…"
        "[player_name] потеряла дар речи. Видимо, государь Российской империи вместе с семьей вернулся из Петергофа в Петроград."
        show g7:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "…"
        show t1:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Вижу, ты под впечатлением, мой друг."
        character "Не каждый день я встречаю представителей семьи Романовых."
        characternikolay2 "…"
        hide g7 with dissolve
        hide ghost_nikolai with dissolve
        show g2:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Только сейчас заметила: а где центральный вход на вокзал?"
        tmrz "Раньше входа было два:  справа — для простого люда, а тот, что слева, принадлежал императорской семье, кстати, нам туда."
        character "Климент Аркадьевич, мы же не принадлежим к «августейшим особам». Как мы туда пройдем?"
        tmrz "Подключай смекалку, мой друг."
        "Климент Аркадьевич выдвинулся в сторону Балтийского вокзала. [player_name], вздохнув, нехотя отправилась за ним."
        show ghost_policia:
            zoom 1.0 xalign 0.7 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        characterpolicia "Стой! Кто тут!"
        hide ghost_policia with dissolve
        hide g2 with dissolve
        hide t1 with dissolve
        label scene39_0_g:
            menu:
                character ""
                "Мы на экскурсию":
                    if rightornot == 0:
                        $ ghost += 1
                        $ rightornot += 1
                        "+ Призрак"
                    show ghost_policia:
                        zoom 1.0 xalign 0.7 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    characterpolicia "Вы что, с ума сошли? Какая экскурсия? А ну прочь!"
                    "Вам не удалось обойти полицейского, попробуйте еще раз."
                    jump scene39_0_g
                    hide ghost_policia with dissolve
                "Мы инженеры-механики":
                    show ghost_policia:
                        zoom 1.0 xalign 0.7 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    characterpolicia "Ну наконец-то, вас уже заждались. Проходите быстрее."
                    if rightornot == 0:
                        $ reality += 1
                        $ rightornot += 1
                        "+ Явь"
                    "Вам удалось обойти полицейского."
                    hide ghost_policia with dissolve
                    $ rightornot == 0
                    "Тимирязев и [player_name] переглянулись и поспешили вперед."
                    jump scene40
                "Простите, заблудились":
                    show ghost_policia:
                        zoom 1.0 xalign 0.7 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    characterpolicia "А ну прочь отсюда! Вам нельзя здесь находиться."
                    if rightornot == 0:
                        $ ghost += 1
                        $ rightornot += 1
                        "+ Призрак"
                    "Вам не удалось обойти полицейского, попробуйте еще раз."
                    hide ghost_policia with dissolve
                    jump scene39_0_g
        jump scene40

label scene40:
    scene 4back3 with fade:
        size (1280, 720)
        fit "fill"
    if gender == "M":
        "Перед ними стоял темно-синий блестящий вагон императорской семьи."
        show t1:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "У тебя совсем немного времени, чтобы найти последнюю книгу. Главное, будь осторожен и не привлекай внимания полицейского."
        show m1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Я постараюсь."
        hide m1 with dissolve
        hide t1 with dissolve
        scene 4back4 with fade:
            size (1280, 720)
            fit "fill"
        stop music fadeout 2.0
        play music haspit fadein 2.0 loop if_changed
        "Тимирязев не стал заходить. Впрочем, [player_name] уже привык к тому, что все испытания придется проходить самостоятельно."
        "Но без Климента Аркадьевича стало безумно одиноко. Кроме того, непонятно, где искать книгу."
        "Богатые интерьеры невольно заставляли любоваться ими. [player_name] постоянно напоминал себе о том, что нужно сосредоточиться и не допустить ошибок, но невозможно было не отвлекаться на подобную красоту."
        "В наше время, к сожалению, императорские вагоны сохранились только за границей. Но в музеях можно еще увидеть макеты и даже VR-проекты. Однако [player_name] не успел с ними познакомиться."
        show m1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Придется действовать наугад."
        hide m1 with dissolve
        label scene40_0_m:
            $ return_label = "scene40_0_m_timeout"
            show screen choice_timer(5)
            menu:
                "Идти обычным шагом":
                    label scene40_0_m_timeout:
                        hide screen choice_timer
                        if rightornot == 0:
                            $ ghost += 1
                            $ rightornot += 1
                            "Вы выбрали неверную тактику и были замечены. +Призрак"
                        else:
                            "Вы выбрали неверную тактику и были замечены."
                        show ghost_policia:
                            zoom 1.0 xalign 0.7 yalign 1.0
                            alpha 0.0
                            easein 0.3 alpha 1.0
                        characterpolicia "А ну стой! Что ты делаешь в интерьерах? Это кем себя нужно было возомнить? Сомневаюсь, что ты инженер. Хочешь что-то украсть?"
                        "Вас арестовали. Попробуйте еще раз. + Призрак"
                        hide ghost_policia with dissolve
                        jump scene40_0_m
                "Пробежать":
                    hide screen choice_timer
                    "По вагону раздался громкий топот ног. На шум прибежал полицейский."
                    show ghost_policia:
                        zoom 1.0 xalign 0.7 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    characterpolicia "Куда бежишь? Что-то украл?"
                    show m5:
                        zoom 1.0 xalign -0.3 yalign 0.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    character "Нет, просто тороплюсь."
                    characterpolicia "Очень странно себя ведешь, лучше обыскать тебя! Пройдем со мной, ты арестован."
                    if rightornot == 0:
                        $ ghost += 1
                        $ rightornot += 1
                        "Вы выбрали неверную тактику и были замечены. +Призрак"
                    else:
                        "Вы выбрали неверную тактику и были замечены."
                    hide m5 with dissolve
                    hide ghost_policia with dissolve
                    jump scene40_0_m
                "Пройти тихо":
                    hide screen choice_timer
                    if rightornot == 0:
                        $ reality += 1
                        $ rightornot += 1
                        "Вы выбрали верную тактику. + Явь"
                    else:
                        "Вы выбрали верную тактику."
                    $ rightornot == 0
        "Пока что удавалось оставаться незамеченным."
        show m2:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Интересно, что в дореволюционные времена мне могло грозить за такую дерзость? Надеюсь, не расстрел."
        "От этой мысли стало немного не по себе. Вообще, здесь все было пропитано тяжелой атмосферой. Может быть, из-за тяжелой судьбы Романовых стены сами по себе отдавали скорбью."
        "Несмотря на то, что призраков не было, чувство какого-то присутствия не покидало бы любого, кто осмелился сюда зайти."
        hide m2 with dissolve
        scene 4back5 with fade:
            size (1280, 720)
            fit "fill"
        "Новое помещение было похоже на столовую. Здесь стояла роскошная мебель рядом с длинным обеденным столом. На нем красовались свечи с мрачным синим пламенем."
        "Захотелось коснуться огонька рукой. Почему-то он притягивал к себе."
        show m5:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Кажется, словно пламя не должно обжечь…"
        "[player_name] потянулся рукой…"
        hide m5 with dissolve
        label scene40_1_m:
            $ return_label = "scene40_1_m_timeout"
            show screen choice_timer(3)
            menu:
                "Коснуться…":
                    label scene40_1_m_timeout:
                        hide screen choice_timer
                        "[player_name] не смог сопротивляться желанию. Протянув руку, он провел ею над пламенем."
                        "Оно оказалось дико горячим. Охватив ладонь, пламя жестоко жглось."
                        show m7:
                            zoom 1.0 xalign -0.3 yalign 0.0
                            alpha 0.0
                            easein 0.3 alpha 1.0
                        character "Больно!!!"
                        "[player_name] невольно задел подсвечник и столкнул его со стола. Огонь перекинулся на стол и занавески."
                        character "Нет! Нет, пожалуйста!!!!"
                        show ghost_policia:
                            zoom 1.0 xalign 0.7 yalign 1.0
                            alpha 0.0
                            easein 0.3 alpha 1.0
                        characterpolicia "Что здесь происходит?! А ну иди сюда, вредитель!!!"
                        if rightornot == 0:
                            $ ghost += 1
                            $ rightornot += 1
                            "Вас поймали! Попробуйте еще раз! + Призрак."
                        else:
                            "Вас поймали! Попробуйте еще раз!"
                        hide ghost_policia with dissolve
                        hide m7 with dissolve
                        jump scene40_1_m
                "Отвернуться…":
                    hide screen choice_timer
                    show m1:
                        zoom 1.0 xalign -0.3 yalign 0.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    character "Не стоит поддаваться призрачному зову. Вдруг это снова какая-нибудь русалка…"
                    if rightornot == 0:
                            $ ghost += 1
                            $ rightornot += 1
                            "Вам удалось избежать ловушки. +Явь"
                    else:
                        "Вам удалось избежать ловушки."
                    $ rightornot == 0
                    hide m1 with dissolve

        "[player_name] осмотрелся. Нужно было понять, где могли спрятать книгу. Однако никаких подсказок не наблюдалось. Может быть, где-то был тайник."
        "В глубине столовой висело зеркало. Во многих фильмах за ним скрывались ниши для хранения важных документов или ценных бумаг."
        "Других вариантов не наблюдалось, и [player_name] уверенно шагнул навстречу отражению."
        "Помня про осторожность, он не спешил касаться предмета. Сосредоточившись на раме, [player_name] не сразу заметил, что с отражением что-то не так, и, присмотревшись, едва ли не вскрикнул."
        show ghost_m:
            zoom 1.0 xalign 0.7 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        show m7:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Что происходит?!"
        "Едва сдержав крик, [player_name] замер, не веря собственным глазам."
        characterotragenie "Я всего лишь то, что ты не желаешь принимать в себе."
        hide m7 with dissolve
        show m2:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Нет, ты дурацкая шутка призраков…"
        characterotragenie "О нет, поверь мне. В каждом есть сторона, которую не хочется признавать в себе."
        character "Я справлюсь и вернусь в свой мир."
        characterotragenie "Я так не думаю… Но забавы ради я даже отдам тебе последнюю книгу, и мы увидим, сможешь ли ты выбраться отсюда."
        character "Хватит болтать. Давай сюда, и я пойду."
        characterotragenie "Неужели ты думаешь, что это будет так легко."
        "Было странно вести диалог с зеркалом, в котором ты сам себе давал ответы."
        character "Хватит играть со мной! Или верни книгу, или я сейчас разобью этот поломанный телевизор."
        "[player_name] услышал свой собственный зловещий смех от пугающей копии."
        characterotragenie "Давай посмотрим, как ты усвоил урок своего путешествия. Готов держать ответ?"
        hide m2 with dissolve
        show m1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Я готов."
        characterotragenie "Тогда первый вопрос!"
        characterotragenie "Почему улицу назвали Везенбергской?"
        hide m1 with dissolve
        hide ghost_m with dissolve
        menu:
            "По городу":
                show m2:
                    zoom 1.0 xalign -0.3 yalign 0.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                character "В Нарвской части Санкт-Петербурга улицы для простоты ориентирования называли как города в  Прибалтике. Эта улица получила название по эстонскому городу Везенбергу, сейчас он называется Раквере."
                show ghost_m:
                    zoom 1.0 xalign 0.7 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                characterotragenie "Ишь ты! Подготовился."
                $ reality += 1
                $ zagadkaotragenie += 1
                "Верно. + Явь"
                hide ghost_m with dissolve
                hide m2 with dissolve
            "По замку":
                show ghost_m:
                    zoom 1.0 xalign 0.7 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                characterotragenie "По какому замку?"
                character "Откуда я знаю? По красивому."
                characterotragenie "Какой глупый ответ."
                $ ghost += 1
                "Неверно. + Призрак"
                hide ghost_m with dissolve
                hide m2 with dissolve
            "По фамилии":
                show ghost_m:
                    zoom 1.0 xalign 0.7 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                characterotragenie "По чьей фамилии?"
                character "Везенберга."
                characterotragenie "Очень смешно. Ты ошибся."
                $ ghost += 1
                "Неверно. + Призрак"
                hide ghost_m with dissolve
                hide m2 with dissolve
        show ghost_m:
            zoom 1.0 xalign 0.7 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        characterotragenie "Следующий вопрос."
        characterotragenie "Про Везенбергскую улицу поговорили, а вот соседнюю Лейхтенбергскую почему так назвали?"
        "[player_name] судорожно вспоминал, что знает. Сейчас улица называется Розенштейна. Но чем это может помочь? Ничем. Придется поразмыслить…"
        show m5:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Улицу назвали…"
        hide m5 with dissolve
        hide ghost_m with dissolve
        menu:
            "По городу":
                show ghost_m:
                    zoom 1.0 xalign 0.7 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                characterotragenie "Это что за город такой?"
                show m2:
                    zoom 1.0 xalign -0.3 yalign 0.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                character "Лейхтенберг."
                characterotragenie "Хорошая попытка, но ты ошибся."
                $ ghost += 1
                "Неверно. + Призрак"
                hide m2 with dissolve
                hide ghost_m with dissolve
            "По фамилии":
                show ghost_m:
                    zoom 1.0 xalign 0.7 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                characterotragenie "Какой такой фамилии?"
                show m2:
                    zoom 1.0 xalign -0.3 yalign 0.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                character "Максимилиана Лейхтенбергского, мужа Марии Николаевны Романовой, военного и государственного деятеля."
                $ reality += 1
                $ zagadkaotragenie += 1
                "Верно. + Явь"
                hide m2 with dissolve
                hide ghost_m with dissolve
            "По названию фабрики":
                show ghost_m:
                    zoom 1.0 xalign 0.7 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                characterotragenie "Какой фабрики?"
                show m5:
                    zoom 1.0 xalign -0.3 yalign 0.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                character "Ну одной из…"
                characterotragenie "Из чего?"
                character "Из тех, что находились тут."
                characterotragenie "Так и скажи, что не знаешь, зачем выдумывать небылицы?"
                $ ghost += 1
                "Неверно. + Призрак"
                hide m5 with dissolve
                hide ghost_m with dissolve
        show ghost_m:
            zoom 1.0 xalign 0.7 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        characterotragenie "Следующий вопрос!"
        characterotragenie "Хватит вопросов по Везенбергскому кварталу… Давай просто проверим твои знания. Раз мы находимся на железнодорожном вокзале, то и вопрос будет близкий по теме."
        show m1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Слушаю."
        characterotragenie "Какую железную дорогу проложили первой в России?"
        hide m1 with dissolve
        hide ghost_m with dissolve
        menu:
            "Царскосельскую":
                show m5:
                    zoom 1.0 xalign -0.3 yalign 0.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                character "Царскосельская железная дорога — первая железная дорога общего пользования в России."
                $ reality += 1
                $ zagadkaotragenie += 1
                "Верно. + Явь"
                show ghost_m:
                    zoom 1.0 xalign 0.7 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                characterotragenie "Ну надо же… угадал."
                hide ghost_m with dissolve
                hide m5 with dissolve
            "Николаевскую":
                show ghost_m:
                    zoom 1.0 xalign 0.7 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                characterotragenie "Это всего лишь третья по счету железная дорога в Российской империи."
                $ ghost += 1
                "Неверно. + Призрак"
                hide ghost_m with dissolve
            "Петергофскую":
                show ghost_m:
                    zoom 1.0 xalign 0.7 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                characterotragenie "Ты ошибся. Несмотря на безумно интересную и своеобразную историю своего появления, Петергофская железная дорога не была первой."
                $ ghost += 1
                "Неверно. + Призрак"
                hide ghost_m with dissolve

        if zagadkaotragenie >= 2:
            "Отражение злобно оскалилось."
            show ghost_m:
                zoom 1.0 xalign 0.7 yalign 1.0
                alpha 0.0
                easein 0.3 alpha 1.0
            characterotragenie "Наплевать на твою смелость и на правильные ответы. Ты сдашься и останешься здесь с призраками!"
            show m2:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
            character "Как бы не так! Отдавай книгу и помалкивай. Я вернусь в реальный мир!"
            if architect == 1:
                "Вы учитесь на архитектора."
                character "Стану архитектором, напишу большой труд об исчезнувших зданиях Везенбергского квартала, построю НОВЫЕ изящные дома, которые будут заселять НОВЫЕ люди. Они будут творить НОВУЮ историю! Квартал расцветет и станет ярче, благороднее."
                character "У Везенбергского квартала есть будущее! И его построим мы — люди, сохранив наследие прошлого."
            elif botanist == 1:
                "Вы учитесь на ботаника."
                character "Я стану ученым! Буду гордо нести наследие Климента Аркадьевича Тимирязева. Я не только помогу нашей библиотеке сохранить это гордое имя, но и приду сам читать в нее лекции."
                "Мы создадим центр притяжения лучших умов города. И вместе сделаем этот самобытный квартал еще лучше!"
            elif journalist == 1:
                "Вы учитесь на журналиста."
                character "Когда вернусь в реальный мир, сделаю репортаж о Везенбергском квартале. Я расскажу про его прекрасное прошлое, самобытное, порой темное, но при этом и яркое. И я расскажу о будущем. О том будущем, которое мы сможем построить здесь сами."
                character "Я расскажу о том, как важно сохранить то хорошее, что здесь есть, и приумножить его. Я не дам забыть о прошлом, но попробую сделать шаг к прекрасному будущему."
            elif archaeologist == 1:
                "Я ― будущий археолог! В моем мире я смогу стать тем, кто глубже изучит историю Везенбергского квартала и откроет все его тайны миру. Я подключу историков своего факультета, и вместе мы сделаем эти улицы и дома самым интересным краеведческим феноменом."
                "Возможно, тогда мир призраков перестанет так злиться на нас, на людей. Ведь мы сделаем так, чтобы никто не был забыт. Этот квартал уникален, и его история должна продолжаться."
            characterotragenie "Пока только обещания. Держи свою книгу и иди прочь! Это было твое последнее испытание. Ты должен был заглянуть себе в глаза и понять, достоин ли ты идти дальше своим путем."
            hide m2 with dissolve
            show m1:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
            character "И как, достоин?"
            "Призрак в зеркале зловеще усмехнулся."
            characterotragenie "Скоро поймешь все сам. А пока забери свою последнюю книгу."
            show misticPeter with fade:
                zoom 1.0 xalign 0 yalign 0
                alpha 0.0
                easein 0.3 alpha 1.0
            $ book_misticPeter += 1
            "Вы получили книгу «Мистический Петербург»."
            hide misticPeter with dissolve
            character "Прощай. Мы больше не увидимся."
            characterotragenie "Посмотрим."
            "Однако от этой встречи осталось неприятное послевкусие."
            hide m1 with dissolve
            hide ghost_m with dissolve
        elif zagadkaotragenie <= 1:
            show m1:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
            show ghost_m:
                zoom 1.0 xalign 0.7 yalign 1.0
                alpha 0.0
                easein 0.3 alpha 1.0
            characterotragenie "Надеюсь, ты убедился, что твоих знаний недостаточно, чтобы так задирать нос, выставляя себя спасителем квартала."
            characterotragenie "Как ты собираешься нести ответственность за свой мир, если сам за себя ответить не можешь?"
            character "Знаешь, важно увидеть ошибку, чтобы суметь ее избежать в будущем. Это еще не конец игры! Я вернусь в свой мир."
            "Кто знает, может быть, [player_name] и прав."
            characterotragenie "Книга останется со мной. Ступай. Еще встретимся."
            character "Надеюсь, что нет."
            "Однако уверенность, к несчастью, испарялась."
            hide ghost_m with dissolve
            hide m1 with dissolve

        scene 4back1 with fade:
            size (1280, 720)
            fit "fill"
        show t1:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Ты как, мой друг?"
        show m2:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Случилась не самая приятная встреча."
        tmrz "Что ж, есть и приятные новости. Наш путь практически окончен. У нас осталось совсем немного времени, и мы узнаем, принесут ли плоды наши усилия."
        character "И что теперь мне делать?"
        tmrz "Теперь, я думаю, ты заслужил отдых."
        hide m2 with dissolve
        show m1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Отдых? Я думал, что мы здесь не за этим."
        tmrz "Все, что мы могли сделать, уже сделано — сражение с призраками, поиск книг. Теперь осталось дождаться, чтобы время снова соединилось в одну линию. И мы увидим, что получилось."
        character "И куда же мы теперь?"
        tmrz "Ты когда-нибудь был в Балтийских банях?"
        hide m1 with dissolve
        show m5:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Нет."
        tmrz "Самое время посетить."
        hide m5 with dissolve
        hide t1 with dissolve

        scene 4back6 with fade:
            size (1280, 720)
            fit "fill"
        stop music fadeout 2.0
        play music bany fadein 2.0 loop if_changed
        show t2:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Перед тобой Балтийские бани. Здесь можно было не только попариться и поплавать в бассейне, но и пройти курс лечебных процедур, лечебный массаж, циркулярный и восходящий душ. Здесь работали квалифицированные врачи из 81-й поликлиники Октябрьского района."
        tmrz "После революции, когда доходные дома превратились в коммунальные квартиры, существовал ряд бытовых проблем, в том числе отсутствие в домах ванных. Поэтому бани были спасением."
        show m1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Не знал, что они такие интересные. Со стороны выглядят сурово."
        hide t2 with dissolve
        show t1:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Предлагаю познакомиться поближе, ступай. Тебе нужен отдых."
        character "А вы?"
        tmrz "Здесь наши пути расходятся. Спасибо тебе, это было увлекательное путешествие."
        hide m1 with dissolve
        show m7:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Что? Почему? "
        hide m7 with dissolve
        show m6:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Значит, я вас больше не увижу?"
        tmrz "Мой друг, если наш план удастся, то ты всегда можешь прийти в библиотеку им. К. А. Тимирязева. Ты не увидишь меня, но почувствуешь, что я рядом и поддерживаю все твои благие начинания."
        tmrz "Я в тебя верю!"
        "[player_name] уже успел привыкнуть к добрым советам Климента Аркадьевича. Столько еще было вопросов, которые хотелось задать. И прощаться было тяжело. Но так было правильно."
        "[player_name] точно знал, что есть злые призраки, есть добрые, а есть Климент Аркадьевич, который, несмотря ни на что, продолжает нести свет как в призрачный мир, так и в реальный."
        character "Спасибо вам. Я никогда вас не забуду."
        tmrz "Ты навсегда останешься моим хорошим другом!"
        "Больше не хотелось говорить. [player_name] смело отправился исследовать последнее призрачное пространство."
        hide m6
        hide t1
        with dissolve
        scene 4back7 with fade:
            size (1280, 720)
            fit "fill"
        show m1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Мммм… приятно пахнет деревом."
        show ghost_doctor:
            zoom 1.0 xalign 0.7 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        characterdoctor "Добрый день, скажите, что вас беспокоит, и я подберу для вас процедуры."
        character "…"
        hide ghost_doctor with dissolve
        hide m1 with dissolve
        menu:
            "Спину ломит, весь день на ногах":
                show ghost_doctor:
                    zoom 1.0 xalign 0.7 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                characterdoctor "Тогда распишу для вас курс массажей. А пока можете отправляться попариться в баню — стимуляция кровотока позволяет мышцам быстрее восстанавливаться после длительных нагрузок."
                hide ghost_doctor with dissolve
            "Мне очень тоскливо":
                show ghost_doctor:
                    zoom 1.0 xalign 0.7 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                characterdoctor "Предлагаю вам отправиться на банные процедуры. При погружении в теплую и влажную среду организм выделяет эндорфины, что вызывает ощущение радости и приятное состояние эйфории. Вам станет легче."
                hide ghost_doctor with dissolve
            "Не знаю, просто хочется наконец-то спокойствия":
                show ghost_doctor:
                    zoom 1.0 xalign 0.7 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                characterdoctor "Предлагаю вам отправиться на банные процедуры. При погружении в теплую и влажную среду организм выделяет эндорфины, что вызывает ощущение радости и приятное состояние эйфории. Вам станет легче."
                hide ghost_doctor with dissolve
        # --- ПРЕДЗАГРУЗКА ВИДЕО В ФОНЕ ---
        show anim1 onlayer background_video at Transform(alpha=0.0) zorder -10 as video1
        show animcon1 onlayer background_video at Transform(alpha=0.0) zorder -10 as video2
        show animcon23 onlayer background_video at Transform(alpha=0.0) zorder -10 as video3
        $ renpy.pause(0.2)  # дать видео "запуститься" в фоне
        show m8:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Что ж, приятное окончание длинного и тяжелого дня."
        "Работники бани выдали полотенце, халат и обувь. [player_name] принял душ и отправился в парную. Воздух наполнился приятной теплой тяжестью. Действительно казалось, что эта процедура создает какой-то волшебный эффект."
        "Очень захотелось спать. День был такой напряженный. Весь мир перевернулся с ног на голову. И так хотелось домой — в теплую постель. Хотелось выпить ароматного какао и забыться сном."
        "Глаза сами собой стали закрываться…"
        hide m8 with dissolve

        # Плохая либо Средняя
        if ghost >= 23 and book_lermnt + book_canal + book_coi + book_misticPeter + book_promish + book_rest < 6:
            jump sceneplox
        elif ghost >= 23 and book_lermnt + book_canal + book_coi + book_misticPeter + book_promish + book_rest == 6:
            jump scenegood

        # Средняя либо Отличная
        if ghost >= 10 and ghost <= 22 and book_lermnt + book_canal + book_coi + book_misticPeter + book_promish + book_rest < 3:
            jump scenegood
        elif ghost >= 10 and ghost <= 22 and book_lermnt + book_canal + book_coi + book_misticPeter + book_promish + book_rest >= 3:
            jump scenegreat

        # Отличная либо Средняя
        if ghost < 10 and  book_lermnt + book_canal + book_coi + book_misticPeter + book_promish + book_rest >= 3:
            jump scenegreat
        elif ghost < 10 and book_lermnt + book_canal + book_coi + book_misticPeter + book_promish + book_rest < 3:
            jump scenegood
        jump scenegood
    elif gender == "G":
        "Перед ними стоял темно-синий блестящий вагон императорской семьи."
        show t1:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "У тебя совсем немного времени, чтобы найти последнюю книгу. Главное, будь осторожна и не привлекай внимания полицейского."
        show g1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Я постараюсь."
        hide g1 with dissolve
        hide t1 with dissolve
        scene 4back4 with fade:
            size (1280, 720)
            fit "fill"
        stop music fadeout 2.0
        play music haspit fadein 2.0 loop if_changed
        "Тимирязев не стал заходить. Впрочем, [player_name] уже привыкла к тому, что все испытания придется проходить самостоятельно."
        "Но без Климента Аркадьевича стало безумно одиноко. Кроме того, непонятно, где искать книгу."
        "Богатые интерьеры невольно заставляли любоваться ими. [player_name] постоянно напоминала себе о том, что нужно сосредоточиться и не допустить ошибок, но невозможно было не отвлекаться на подобную красоту."
        "В наше время, к сожалению, императорские вагоны сохранились только за границей. Но в музеях можно еще увидеть макеты и даже VR-проекты. Однако [player_name] не успела с ними познакомиться."
        show g1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Придется действовать наугад."
        hide g1 with dissolve
        label scene40_0_g:
            $ return_label = "scene40_0_g_timeout"
            show screen choice_timer(5)
            menu:
                "Идти обычным шагом":
                    label scene40_0_g_timeout:
                        hide screen choice_timer
                        if rightornot == 0:
                            $ ghost += 1
                            $ rightornot += 1
                            "Вы выбрали неверную тактику и были замечены. +Призрак"
                        else:
                            "Вы выбрали неверную тактику и были замечены."
                        show ghost_policia:
                            zoom 1.0 xalign 0.7 yalign 1.0
                            alpha 0.0
                            easein 0.3 alpha 1.0
                        characterpolicia "А ну стой! Что ты делаешь в интерьерах? Это кем себя нужно было возомнить? Сомневаюсь, что ты инженер. Хочешь что-то украсть?"
                        "Вас арестовали. Попробуйте еще раз. + Призрак"
                        hide ghost_policia with dissolve
                        jump scene40_0_g
                "Пробежать":
                    hide screen choice_timer
                    "По вагону раздался громкий топот ног. На шум прибежал полицейский."
                    show ghost_policia:
                        zoom 1.0 xalign 0.7 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    characterpolicia "Куда бежишь? Что-то украла?"
                    show g5:
                        zoom 1.0 xalign -0.3 yalign 0.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    character "Нет, просто тороплюсь."
                    characterpolicia "Очень странно себя ведешь, лучше обыскать тебя! Пройдем со мной, ты арестована."
                    if rightornot == 0:
                        $ ghost += 1
                        $ rightornot += 1
                        "Вы выбрали неверную тактику и были замечены. +Призрак"
                    else:
                        "Вы выбрали неверную тактику и были замечены."
                    hide g5 with dissolve
                    hide ghost_policia with dissolve
                    jump scene40_0_g
                "Пройти тихо":
                    hide screen choice_timer
                    if rightornot == 0:
                        $ reality += 1
                        $ rightornot += 1
                        "Вы выбрали верную тактику. + Явь"
                    else:
                        "Вы выбрали верную тактику."
                    $ rightornot == 0

        "Пока что удавалось оставаться незамеченной."
        show g2:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Интересно, что в дореволюционные времена мне могло грозить за такую дерзость? Надеюсь, не расстрел."
        "От этой мысли стало немного не по себе. Вообще, здесь все было пропитано тяжелой атмосферой. Может быть, из-за тяжелой судьбы Романовых стены сами по себе отдавали скорбью."
        "Несмотря на то, что призраков не было, чувство какого-то присутствия не покидало бы любого, кто осмелился сюда зайти."
        hide g2 with dissolve
        scene 4back5 with fade:
            size (1280, 720)
            fit "fill"
        "Новое помещение было похоже на столовую. Здесь стояла роскошная мебель рядом с длинным обеденным столом. На нем красовались свечи с мрачным синим пламенем."
        "Захотелось коснуться огонька рукой. Почему-то он притягивал к себе."
        show g5:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Кажется, словно пламя не должно обжечь…"
        "[player_name] потянулась рукой…"
        hide g5 with dissolve
        label scene40_1_g:
            $ return_label = "scene40_1_g_timeout"
            show screen choice_timer(3)
            menu:
                "Коснуться…":
                    label scene40_1_g_timeout:
                        hide screen choice_timer
                        "[player_name] не смогла сопротивляться желанию. Протянув руку, она провела ею над пламенем."
                        "Оно оказалось дико горячим. Охватив ладонь, пламя жестоко жглось."
                        show g7:
                            zoom 1.0 xalign -0.3 yalign 0.0
                            alpha 0.0
                            easein 0.3 alpha 1.0
                        character "Больно!!!"
                        "[player_name] невольно задела подсвечник и столкнула его со стола. Огонь перекинулся на стол и занавески."
                        character "Нет! Нет, пожалуйста!!!!"
                        show ghost_policia:
                            zoom 1.0 xalign 0.7 yalign 1.0
                            alpha 0.0
                            easein 0.3 alpha 1.0
                        characterpolicia "Что здесь происходит?! А ну иди сюда, вредитель!!!"
                        if rightornot == 0:
                            $ ghost += 1
                            $ rightornot += 1
                            "Вас поймали! Попробуйте еще раз! + Призрак."
                        else:
                            "Вас поймали! Попробуйте еще раз!"
                        hide ghost_policia with dissolve
                        hide g7 with dissolve
                        jump scene40_1_g
                "Отвернуться…":
                    hide screen choice_timer
                    show g1:
                        zoom 1.0 xalign -0.3 yalign 0.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    character "Не стоит поддаваться призрачному зову. Вдруг это снова какая-нибудь русалка…"
                    if rightornot == 0:
                            $ ghost += 1
                            $ rightornot += 1
                            "Вам удалось избежать ловушки. +Явь"
                    else:
                        "Вам удалось избежать ловушки."
                    $ rightornot == 0
                    hide g1 with dissolve

        "[player_name] осмотрелась. Нужно было понять, где могли спрятать книгу. Однако никаких подсказок не наблюдалось. Может быть, где-то был тайник."
        "В глубине столовой висело зеркало. Во многих фильмах за ним скрывались ниши для хранения важных документов или ценных бумаг."
        "Других вариантов не наблюдалось, и [player_name] уверенно шагнула навстречу отражению."
        "Помня про осторожность, она не спешила касаться предмета. Сосредоточившись на раме, [player_name] не сразу заметила, что с отражением что-то не так, и, присмотревшись, едва ли не вскрикнула."
        show ghost_g:
            zoom 1.0 xalign 0.7 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        show g7:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Что происходит?!"
        "Едва сдержав крик, [player_name] замерла, не веря собственным глазам."
        characterotragenie "Я всего лишь то, что ты не желаешь принимать в себе."
        hide g7 with dissolve
        show g2:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Нет, ты дурацкая шутка призраков…"
        characterotragenie "О нет, поверь мне. В каждом есть сторона, которую не хочется признавать в себе."
        character "Я справлюсь и вернусь в свой мир."
        characterotragenie "Я так не думаю… Но забавы ради я даже отдам тебе последнюю книгу, и мы увидим, сможешь ли ты выбраться отсюда."
        character "Хватит болтать. Давай сюда, и я пойду."
        characterotragenie "Неужели ты думаешь, что это будет так легко."
        "Было странно вести диалог с зеркалом, в котором ты сам себе давал ответы."
        character "Хватит играть со мной! Или верни книгу, или я сейчас разобью этот поломанный телевизор."
        "[player_name] услышала свой собственный зловещий смех от пугающей копии."
        characterotragenie "Давай посмотрим, как ты усвоила урок своего путешествия. Готова держать ответ?"
        hide g2 with dissolve
        show g1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Я готова."
        characterotragenie "Тогда первый вопрос!"
        characterotragenie "Почему улицу назвали Везенбергской?"
        hide g1 with dissolve
        hide ghost_g with dissolve
        menu:
            "По городу":
                show g2:
                    zoom 1.0 xalign -0.3 yalign 0.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                character "В Нарвской части Санкт-Петербурга улицы для простоты ориентирования называли как города в  Прибалтике. Эта улица получила название по эстонскому городу Везенбергу, сейчас он называется Раквере."
                show ghost_g:
                    zoom 1.0 xalign 0.7 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                characterotragenie "Ишь ты! Подготовилась."
                $ reality += 1
                $ zagadkaotragenie += 1
                "Верно. + Явь"
                hide ghost_g with dissolve
                hide g2 with dissolve
            "По замку":
                show ghost_g:
                    zoom 1.0 xalign 0.7 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                characterotragenie "По какому замку?"
                character "Откуда я знаю? По красивому."
                characterotragenie "Какой глупый ответ."
                $ ghost += 1
                "Неверно. + Призрак"
                hide ghost_g with dissolve
                hide g2 with dissolve
            "По фамилии":
                show ghost_g:
                    zoom 1.0 xalign 0.7 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                characterotragenie "По чьей фамилии?"
                character "Везенберга."
                characterotragenie "Очень смешно. Ты ошиблась."
                $ ghost += 1
                "Неверно. + Призрак"
                hide ghost_g with dissolve
                hide g2 with dissolve
        show ghost_g:
            zoom 1.0 xalign 0.7 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        characterotragenie "Следующий вопрос."
        characterotragenie "Про Везенбергскую улицу поговорили, а вот соседнюю Лейхтенбергскую почему так назвали?"
        "[player_name] судорожно вспоминала, что знает. Сейчас улица называется Розенштейна. Но чем это может помочь? Ничем. Придется поразмыслить…"
        show g5:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Улицу назвали…"
        hide g5 with dissolve
        hide ghost_g with dissolve
        menu:
            "По городу":
                show ghost_g:
                    zoom 1.0 xalign 0.7 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                characterotragenie "Это что за город такой?"
                show g2:
                    zoom 1.0 xalign -0.3 yalign 0.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                character "Лейхтенберг."
                characterotragenie "Хорошая попытка, но ты ошиблась."
                $ ghost += 1
                "Неверно. + Призрак"
                hide g2 with dissolve
                hide ghost_g with dissolve
            "По фамилии":
                show ghost_g:
                    zoom 1.0 xalign 0.7 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                characterotragenie "Какой такой фамилии?"
                show g2:
                    zoom 1.0 xalign -0.3 yalign 0.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                character "Максимилиана Лейхтенбергского, мужа Марии Николаевны Романовой, военного и государственного деятеля."
                $ reality += 1
                $ zagadkaotragenie += 1
                "Верно. + Явь"
                hide g2 with dissolve
                hide ghost_g with dissolve
            "По названию фабрики":
                show ghost_g:
                    zoom 1.0 xalign 0.7 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                characterotragenie "Какой фабрики?"
                show g5:
                    zoom 1.0 xalign -0.3 yalign 0.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                character "Ну одной из…"
                characterotragenie "Из чего?"
                character "Из тех, что находились тут."
                characterotragenie "Так и скажи, что не знаешь, зачем выдумывать небылицы?"
                $ ghost += 1
                "Неверно. + Призрак"
                hide g5 with dissolve
                hide ghost_g with dissolve
        show ghost_g:
            zoom 1.0 xalign 0.7 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        characterotragenie "Следующий вопрос!"
        characterotragenie "Хватит вопросов по Везенбергскому кварталу… Давай просто проверим твои знания. Раз мы находимся на железнодорожном вокзале, то и вопрос будет близкий по теме."
        show g1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Слушаю."
        characterotragenie "Какую железную дорогу проложили первой в России?"
        hide g1 with dissolve
        hide ghost_g with dissolve
        menu:
            "Царскосельскую":
                show g5:
                    zoom 1.0 xalign -0.3 yalign 0.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                character "Царскосельская железная дорога — первая железная дорога общего пользования в России."
                $ reality += 1
                $ zagadkaotragenie += 1
                "Верно. + Явь"
                show ghost_g:
                    zoom 1.0 xalign 0.7 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                characterotragenie "Ну надо же… угадала."
                hide ghost_g with dissolve
                hide g5 with dissolve
            "Николаевскую":
                show ghost_g:
                    zoom 1.0 xalign 0.7 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                characterotragenie "Это всего лишь третья по счету железная дорога в Российской империи."
                $ ghost += 1
                "Неверно. + Призрак"
                hide ghost_g with dissolve
            "Петергофскую":
                show ghost_g:
                    zoom 1.0 xalign 0.7 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                characterotragenie "Ты ошиблась. Несмотря на безумно интересную и своеобразную историю своего появления, Петергофская железная дорога не была первой."
                $ ghost += 1
                "Неверно. + Призрак"
                hide ghost_g with dissolve

        if zagadkaotragenie >= 2:
            "Отражение злобно оскалилось."
            show ghost_g:
                zoom 1.0 xalign 0.7 yalign 1.0
                alpha 0.0
                easein 0.3 alpha 1.0
            characterotragenie "Наплевать на твою смелость и на правильные ответы. Ты сдашься и останешься здесь с призраками!"
            show g2:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
            character "Как бы не так! Отдавай книгу и помалкивай. Я вернусь в реальный мир!"
            if architect == 1:
                "Вы учитесь на архитектора."
                character "Стану архитектором, напишу большой труд об исчезнувших зданиях Везенбергского квартала, построю НОВЫЕ изящные дома, которые будут заселять НОВЫЕ люди. Они будут творить НОВУЮ историю! Квартал расцветет и станет ярче, благороднее."
                character "У Везенбергского квартала есть будущее! И его построим мы — люди, сохранив наследие прошлого."
            elif botanist == 1:
                "Вы учитесь на ботаника."
                character "Я стану ученым! Буду гордо нести наследие Климента Аркадьевича Тимирязева. Я не только помогу нашей библиотеке сохранить это гордое имя, но и приду сама читать в нее лекции."
                "Мы создадим центр притяжения лучших умов города. И вместе сделаем этот самобытный квартал еще лучше!"
            elif journalist == 1:
                "Вы учитесь на журналиста."
                character "Когда вернусь в реальный мир, сделаю репортаж о Везенбергском квартале. Я расскажу про его прекрасное прошлое, самобытное, порой темное, но при этом и яркое. И я расскажу о будущем. О том будущем, которое мы сможем построить здесь сами."
                character "Я расскажу о том, как важно сохранить то хорошее, что здесь есть, и приумножить его. Я не дам забыть о прошлом, но попробую сделать шаг к прекрасному будущему."
            elif archaeologist == 1:
                "Я ― будущий археолог! В моем мире я смогу стать тем, кто глубже изучит историю Везенбергского квартала и откроет все его тайны миру. Я подключу историков своего факультета, и вместе мы сделаем эти улицы и дома самым интересным краеведческим феноменом."
                "Возможно, тогда мир призраков перестанет так злиться на нас, на людей. Ведь мы сделаем так, чтобы никто не был забыт. Этот квартал уникален, и его история должна продолжаться."
            characterotragenie "Пока только обещания. Держи свою книгу и иди прочь! Это было твое последнее испытание. Ты должна была заглянуть себе в глаза и понять, достойна ли ты идти дальше своим путем."
            hide g2 with dissolve
            show g1:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
            character "И как, достойна?"
            "Призрак в зеркале зловеще усмехнулся."
            characterotragenie "Скоро поймешь все сама. А пока забери свою последнюю книгу."
            show misticPeter with fade:
                zoom 1.0 xalign 0 yalign 0
                alpha 0.0
                easein 0.3 alpha 1.0
            $ book_misticPeter += 1
            "Вы получили книгу «Мистический Петербург»."
            hide misticPeter with dissolve
            character "Прощай. Мы больше не увидимся."
            characterotragenie "Посмотрим."
            "Однако от этой встречи осталось неприятное послевкусие."
            hide g1 with dissolve
            hide ghost_g with dissolve
        elif zagadkaotragenie <= 1:
            show g1:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
            show ghost_g:
                zoom 1.0 xalign 0.7 yalign 1.0
                alpha 0.0
                easein 0.3 alpha 1.0
            characterotragenie "Надеюсь, ты убедилась, что твоих знаний недостаточно, чтобы так задирать нос, выставляя себя спасителем квартала."
            characterotragenie "Как ты собираешься нести ответственность за свой мир, если сама за себя ответить не можешь?"
            character "Знаешь, важно увидеть ошибку, чтобы суметь ее избежать в будущем. Это еще не конец игры! Я вернусь в свой мир."
            "Кто знает, может быть, [player_name] и права."
            characterotragenie "Книга останется со мной. Ступай. Еще встретимся."
            character "Надеюсь, что нет."
            "Однако уверенность, к несчастью, испарялась."
            hide ghost_g with dissolve
            hide g1 with dissolve

        scene 4back1 with fade:
            size (1280, 720)
            fit "fill"
        show t1:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Ты как, мой друг?"
        show g2:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Случилась не самая приятная встреча."
        tmrz "Что ж, есть и приятные новости. Наш путь практически окончен. У нас осталось совсем немного времени, и мы узнаем, принесут ли плоды наши усилия."
        character "И что теперь мне делать?"
        tmrz "Теперь, я думаю, ты заслужила отдых."
        hide g2 with dissolve
        show g1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Отдых? Я думала, что мы здесь не за этим."
        tmrz "Все, что мы могли сделать, уже сделано — сражение с призраками, поиск книг. Теперь осталось дождаться, чтобы время снова соединилось в одну линию. И мы увидим, что получилось."
        character "И куда же мы теперь?"
        tmrz "Ты когда-нибудь была в Балтийских банях?"
        hide g1 with dissolve
        show g5:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Нет."
        tmrz "Самое время посетить."
        hide g5 with dissolve
        hide t1 with dissolve

        scene 4back6 with fade:
            size (1280, 720)
            fit "fill"
        stop music fadeout 2.0
        play music bany fadein 2.0 loop if_changed
        show t2:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Перед тобой Балтийские бани. Здесь можно было не только попариться и поплавать в бассейне, но и пройти курс лечебных процедур, лечебный массаж, циркулярный и восходящий душ. Здесь работали квалифицированные врачи из 81-й поликлиники Октябрьского района."
        tmrz "После революции, когда доходные дома превратились в коммунальные квартиры, существовал ряд бытовых проблем, в том числе отсутствие в домах ванных. Поэтому бани были спасением."
        show g1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Не знала, что они такие интересные. Со стороны выглядят сурово."
        hide t2 with dissolve
        show t1:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Предлагаю познакомиться поближе, ступай. Тебе нужен отдых."
        character "А вы?"
        tmrz "Здесь наши пути расходятся. Спасибо тебе, это было увлекательное путешествие."
        hide g1 with dissolve
        show g7:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Что? Почему? "
        hide g7 with dissolve
        show g6:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Значит, я вас больше не увижу?"
        tmrz "Мой друг, если наш план удастся, то ты всегда можешь прийти в библиотеку им. К. А. Тимирязева. Ты не увидишь меня, но почувствуешь, что я рядом и поддерживаю все твои благие начинания."
        tmrz "Я в тебя верю!"
        "[player_name] уже успела привыкнуть к добрым советам Климента Аркадьевича. Столько еще было вопросов, которые хотелось задать. И прощаться было тяжело. Но так было правильно."
        "[player_name] точно знала, что есть злые призраки, есть добрые, а есть Климент Аркадьевич, который, несмотря ни на что, продолжает нести свет как в призрачный мир, так и в реальный."
        character "Спасибо вам. Я никогда вас не забуду."
        tmrz "Ты навсегда останешься моим хорошим другом!"
        "Больше не хотелось говорить. [player_name] смело отправилась исследовать последнее призрачное пространство."
        hide g6
        hide t1
        with dissolve
        scene 4back7 with fade:
            size (1280, 720)
            fit "fill"
        show g1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Мммм… приятно пахнет деревом."
        show ghost_doctor:
            zoom 1.0 xalign 0.7 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        characterdoctor "Добрый день, скажите, что вас беспокоит, и я подберу для вас процедуры."
        character "…"
        hide ghost_doctor with dissolve
        hide g1 with dissolve
        menu:
            "Спину ломит, весь день на ногах":
                show ghost_doctor:
                    zoom 1.0 xalign 0.7 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                characterdoctor "Тогда распишу для вас курс массажей. А пока можете отправляться попариться в баню — стимуляция кровотока позволяет мышцам быстрее восстанавливаться после длительных нагрузок."
                hide ghost_doctor with dissolve
            "Мне очень тоскливо":
                show ghost_doctor:
                    zoom 1.0 xalign 0.7 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                characterdoctor "Предлагаю вам отправиться на банные процедуры. При погружении в теплую и влажную среду организм выделяет эндорфины, что вызывает ощущение радости и приятное состояние эйфории. Вам станет легче."
                hide ghost_doctor with dissolve
            "Не знаю, просто хочется наконец-то спокойствия":
                show ghost_doctor:
                    zoom 1.0 xalign 0.7 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                characterdoctor "Предлагаю вам отправиться на банные процедуры. При погружении в теплую и влажную среду организм выделяет эндорфины, что вызывает ощущение радости и приятное состояние эйфории. Вам станет легче."
                hide ghost_doctor with dissolve
        # --- ПРЕДЗАГРУЗКА ВИДЕО В ФОНЕ ---
        show anim1 onlayer background_video at Transform(alpha=0.0) zorder -10 as video1
        show animcon1 onlayer background_video at Transform(alpha=0.0) zorder -10 as video2
        show animcon23 onlayer background_video at Transform(alpha=0.0) zorder -10 as video3
        $ renpy.pause(0.2)  # дать видео "запуститься" в фоне
        show g8:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Что ж, приятное окончание длинного и тяжелого дня."
        "Работники бани выдали полотенце, халат и обувь. [player_name] приняла душ и отправилась в парную. Воздух наполнился приятной теплой тяжестью. Действительно казалось, что эта процедура создает какой-то волшебный эффект."
        "Очень захотелось спать. День был такой напряженный. Весь мир перевернулся с ног на голову. И так хотелось домой — в теплую постель. Хотелось выпить ароматного какао и забыться сном."
        "Глаза сами собой стали закрываться…"
        hide g8 with dissolve

        # Плохая либо Средняя
        if ghost >= 23 and book_lermnt + book_canal + book_coi + book_misticPeter + book_promish + book_rest < 6:
            jump sceneplox
        elif ghost >= 23 and book_lermnt + book_canal + book_coi + book_misticPeter + book_promish + book_rest == 6:
            jump scenegood

        # Средняя либо Отличная
        if ghost >= 10 and ghost <= 22 and book_lermnt + book_canal + book_coi + book_misticPeter + book_promish + book_rest < 3:
            jump scenegood
        elif ghost >= 10 and ghost <= 22 and book_lermnt + book_canal + book_coi + book_misticPeter + book_promish + book_rest >= 3:
            jump scenegreat

        # Отличная либо Средняя
        if ghost < 10 and  book_lermnt + book_canal + book_coi + book_misticPeter + book_promish + book_rest >= 3:
            jump scenegreat
        elif ghost < 10 and book_lermnt + book_canal + book_coi + book_misticPeter + book_promish + book_rest < 3:
            jump scenegood
        jump scenegood

