# 03_series_3_concert.rpy
# Сгенерировано из оригинального script.rpy; текст сюжета сохранён.

label scene26:
    window hide
    with None
    # кат - сцена
    scene seria3 with fade:
        size (1280, 720)
        fit "fill"
    # call predonwload
    $ renpy.pause(delay=6.0, hard=True)
    window show
    scene 2back1 with fade:
        size (1280, 720)
        fit "fill"
    stop music fadeout 2.0
    play music ghostWorld fadein 2.0 loop if_changed
    if gender == "M":
        "[player_name] не знал, что ему делать, как себя вести. В глубине души ютилась надежда, что все это было шуткой. Внезапно Тимирязев и Лермонтов выйдут в центр зала и объявят, что все это было для того, чтобы [player_name] и правда поверил в существование призраков."
        "Но ничего подобного не происходило. Нужно было смириться с фактом, что [player_name] примет на себя весь груз ответственности. А еще необходимо было что-то ответить…"
        show ghost_ht2:
            zoom 1.0 xalign 0.7 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        characterht2 "Отвечай, чужак. Ты готов сразиться?"
        show m5:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Одну секундочку…"
        "Пришлось медлить, чтобы сообразить, как выйти из этой ситуации. Ну не сражаться же в самом деле."
        characterht2 "Так и думал, что струсишь!"
        hide m5 with dissolve
        show m2:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Я не боюсь тебя и принимаю бой! Но мы не можем его начать!"
        if journalist == 1:
            "Вы выбрали учиться на журналиста. На занятиях по литературе вы касались темы дуэли. Нужно вспомнить, без чего или без кого она не может состояться."
        characterht2 "Начнем сию секунду!"
        hide m2 with dissolve
        show m1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Нет, нам нужно выбрать…"
        hide m1 with dissolve
        hide ghost_ht2 with dissolve
        label scene26_0_m:
            menu:
                "Оружие":
                    if rightornot == 0:
                        $ ghost += 1
                        $ rightornot += 1
                        "Вряд ли вы нащупали правильный выход из ситуации. +1 Призрак"
                    else:
                        "Вряд ли вы нащупали правильный выход из ситуации."
                    show ghost_ht2:
                        zoom 1.0 xalign 0.7 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    characterht2 "Я предоставляю этот выбор тебе! Пистолеты или шпага?"
                    show m1:
                        zoom 1.0 xalign -0.3 yalign 0.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    character "Эм… Ну, пусть будет шпага. Пистолеты же опаснее."
                    "[player_name] осознал что в руках появилось острое оружие. Начался бой. Однако, вы не владеете навыком фехтования. Призрак довольно быстро вас одолел. Выберете заново."
                    hide m1 with dissolve
                    hide ghost_ht2 with dissolve
                    jump scene26_0_m
                "Секундантов":
                    if rightornot == 0:
                        $ reality += 1
                        "Вы мыслите в верном направлении. +1 Явь"
                    else:
                        "Вы мыслите в верном направлении."
                    $ rightornot = 0
                    jump scene27
                "Место":
                    if rightornot == 0:
                        $ ghost += 1
                        $ rightornot += 1
                        "Вряд ли вы нащупали правильный выход из ситуации. +1 Призрак"
                    else:
                        "Вряд ли вы нащупали правильный выход из ситуации."
                    show ghost_ht2:
                        zoom 1.0 xalign 0.7 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    characterht2 "Будем сражаться прямо здесь!"
                    "[player_name] почувствовал, как в руках из ниоткуда появился пистолет, такой же сверкал у приготовившегося к бою призрака."
                    show m6:
                        zoom 1.0 xalign -0.3 yalign 0.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    character "Похоже, я ошибся…"
                    "Раздался выстрел. [player_name] ранен. Попробуйте выбрать еще раз."
                    hide m6 with dissolve
                    hide ghost_ht2 with dissolve
                    jump scene26_0_m
                "Время":
                    if rightornot == 0:
                        $ ghost += 1
                        $ rightornot += 1
                        "Вряд ли вы нащупали правильный выход из ситуации. +1 Призрак"
                    else:
                        "Вряд ли вы нащупали правильный выход из ситуации."
                    show ghost_ht2:
                        zoom 1.0 xalign 0.7 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    characterht2 "Ты за дурака меня держишь? Где твоя честь? Сражайся сейчас!"
                    "[player_name] почувствовал, как в руках из ниоткуда появился пистолет, такой же сверкал у приготовившегося к бою призрака."
                    "[player_name] помедлил, не зная, как действовать. Да и держать в руках оружие прежде не приходилось."
                    characterht2 "Как ты жалок. Ты не достоин ни этого мира, ни своего собственного!"
                    "Раньше, чем [player_name] успел что-то понять, раздался выстрел. [player_name] ранен. Попробуйте выбрать еще раз."
                    hide ghost_ht2 with dissolve
                    jump scene26_0_m
        jump scene27
    elif gender == "G":
        "[player_name] не знала, что ей делать, как себя вести. В глубине души ютилась надежда, что все это было шуткой. Внезапно Тимирязев и Лермонтов выйдут в центр зала и объявят, что все это было для того, чтобы [player_name] и правда поверила в существование призраков."
        "Но ничего подобного не происходило. Нужно было смириться с фактом, что [player_name] примет на себя весь груз ответственности. А еще необходимо было что-то ответить…"
        show ghost_ht2:
            zoom 1.0 xalign 0.7 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        characterht2 "Отвечай, чужак. Ты готова сразиться?"
        show g5:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Одну секундочку…"
        "Пришлось медлить, чтобы сообразить, как выйти из этой ситуации. Ну не сражаться же в самом деле."
        characterht2 "Так и думал, что струсишь!"
        hide g5 with dissolve
        show g2:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Я не боюсь тебя и принимаю бой! Но мы не можем его начать!"
        if journalist == 1:
            "Вы выбрали учиться на журналиста. На занятиях по литературе вы касались темы дуэли. Нужно вспомнить, без чего или без кого она не может состояться."
        characterht2 "Начнем сию секунду!"
        hide g2 with dissolve
        show g1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Нет, нам нужно выбрать…"
        hide g1 with dissolve
        hide ghost_ht2 with dissolve
        label scene26_0_g:
            menu:
                "Оружие":
                    if rightornot == 0:
                        $ ghost += 1
                        $ rightornot += 1
                        "Вряд ли вы нащупали правильный выход из ситуации. +1 Призрак"
                    else:
                        "Вряд ли вы нащупали правильный выход из ситуации."
                    show ghost_ht2:
                        zoom 1.0 xalign 0.7 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    characterht2 "Я предоставляю этот выбор тебе! Пистолеты или шпага?"
                    show g1:
                        zoom 1.0 xalign -0.3 yalign 0.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    character "Эм… Ну, пусть будет шпага. Пистолеты же опаснее."
                    "[player_name] осознала что в руках появилось острое оружие. Начался бой. Однако, вы не владеете навыком фехтования. Призрак довольно быстро вас одолел. Выберете заново."
                    hide g1 with dissolve
                    hide ghost_ht2 with dissolve
                    jump scene26_0_g
                "Секундантов":
                    if rightornot == 0:
                        $ reality += 1
                        "Вы мыслите в верном направлении. +1 Явь"
                    else:
                        "Вы мыслите в верном направлении."
                    $ rightornot = 0
                    jump scene27
                "Место":
                    if rightornot == 0:
                        $ ghost += 1
                        $ rightornot += 1
                        "Вряд ли вы нащупали правильный выход из ситуации. +1 Призрак"
                    else:
                        "Вряд ли вы нащупали правильный выход из ситуации."
                    show ghost_ht2:
                        zoom 1.0 xalign 0.7 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    characterht2 "Будем сражаться прямо здесь!"
                    "[player_name] почувствовала, как в руках из ниоткуда появился пистолет, такой же сверкал у приготовившегося к бою призрака."
                    show g6:
                        zoom 1.0 xalign -0.3 yalign 0.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    character "Похоже, я ошиблась…"
                    "Раздался выстрел. [player_name] ранена. Попробуйте выбрать еще раз."
                    hide g6 with dissolve
                    hide ghost_ht2 with dissolve
                    jump scene26_0_g
                "Время":
                    if rightornot == 0:
                        $ ghost += 1
                        $ rightornot += 1
                        "Вряд ли вы нащупали правильный выход из ситуации. +1 Призрак"
                    else:
                        "Вряд ли вы нащупали правильный выход из ситуации."
                    show ghost_ht2:
                        zoom 1.0 xalign 0.7 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    characterht2 "Ты за дурака меня держишь? Где твоя честь? Сражайся сейчас!"
                    "[player_name] почувствовала, как в руках из ниоткуда появился пистолет, такой же сверкал у приготовившегося к бою призрака."
                    "[player_name] помедлила, не зная, как действовать. Да и держать в руках оружие прежде не приходилось."
                    characterht2 "Ты такая жалкая. Ты не достойна ни этого мира, ни своего собственного!"
                    "Раньше, чем [player_name] успела что-то понять, раздался выстрел. [player_name] ранена. Попробуйте выбрать еще раз."
                    hide ghost_ht2 with dissolve
                    jump scene26_0_g
        jump scene27

label scene27:
    scene 2back1 with fade:
        size (1280, 720)
        fit "fill"
    stop music fadeout 2.0
    play music ghostWorld fadein 2.0 loop if_changed
    if gender == "M":
        show ghost_ht2:
            zoom 1.0 xalign 0.7 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        characterht2 "Нам никто не нужен, мы будем сражаться один на один."
        show m1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Хитрец. Именно секунданты определяют место, время и другие условия дуэли. Именно они следят за соблюдением правил поединка. Если не будет секундантов, то это не бой, а просто-напросто убийство."
        "Призрак нахмурился и задумался."
        characterht2 "Скажи сразу, что испугался защищать свою честь!"
        hide m1 with dissolve
        show m2:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Как бы не так! Я, наоборот, слежу, чтобы дуэль была честной. Участвовать в глупой перестрелке — постыдное занятие, низкое для любого уважающего себя человека."
        "Привидение словно задумалось. Дуэлянт на несколько секунд затих."
        characterht2 "А ты не глуп. Что ж, может быть, ты и достоин пройти этот путь."
        hide m2 with dissolve
        show m1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Благодарю."
        characterht2 "Но просто отпустить тебя я не смогу. Как призрак, я желаю, чтобы этот мир поглотил вашу реальность. Но из уважения дам тебе фору, если отгадаешь загадку."
        characterht2 "А проиграешь — останешься здесь навсегда, превратившись в призрака, и будешь целую вечность снова и снова стреляться со мной на дуэли. Согласен?"
        character "А у меня есть выбор?"
        "Послышался хриплый, пугающий смех."
        characterht2 "Правда твоя. Выбора нет."
        hide m1 with dissolve
        show m2:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Что за загадка?"
        label scene27_0_m_0:
        characterht2 "Попросили как-то мудреца решить одну дилемму. После дуэли оба дуэлянта были ранены, но один из участников погиб спустя некоторое время от инфекции, попавшей в рану."
        characterht2 "А другой, не став дожидаться, когда погибнет от потери крови, прыгнул с обрыва. Кто из этих двух виновен в том, что оппонент погиб?"
        hide m2 with dissolve
        hide ghost_ht2 with dissolve
        label scene27_0_m:
        menu:
            "Оба виноваты":
                show m2:
                    zoom 1.0 xalign -0.3 yalign 0.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                character "Нечего было стреляться, оба виноваты."
                show ghost_ht2:
                    zoom 1.0 xalign 0.7 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                if rightornot == 0:
                    $ ghost += 1
                    "Ты ошибся и остаешься здесь со мной и навсегда. +1 Призрак"
                else:
                    "Ты ошибся и остаешься здесь со мной и навсегда."
                hide ghost_ht2 with dissolve
                hide m2 with dissolve
                $ rightornot += 1
                jump scene27_0_m
            "Первый":
                show m2:
                    zoom 1.0 xalign -0.3 yalign 0.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                character "Первый погиб, потому что рану неправильно лечили. А второй из-за выстрела и последующей потери крови в любом случае бы погиб. Так что мой выбор — первый."
                show ghost_ht2:
                    zoom 1.0 xalign 0.7 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                characterht2 "Что ж, и врага можно уважать. Ступай. Удачи тебе не желаю, но с интересом понаблюдаю, как ты будешь двигаться дальше. Очень жаль, что со мной не остался."
                if rightornot == 0:
                    $ reality += 1
                    "Вы справились! +1 Явь"
                else:
                    "Вы справились!"
                hide ghost_ht2 with dissolve
                $ rightornot = 0
                jump scene28
            "Второй":
                show m5:
                    zoom 1.0 xalign -0.3 yalign 0.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                character "Не знаю, ну, пусть будет второй!"
                show ghost_ht2:
                    zoom 1.0 xalign 0.7 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                if rightornot == 0:
                    $ ghost += 1
                    characterht2 "Что значит «пусть будет второй»? За свою несерьезность ты остаешься с призраками навсегда! Ответ неверный! +1 Призрак"
                else:
                    "Что значит «пусть будет второй»? За свою несерьезность ты остаешься с призраками навсегда! Ответ неверный!"
                hide ghost_ht2 with dissolve
                hide m5 with dissolve
                $ rightornot += 1
                jump scene27_0_m
            "Никто не виноват":
                show m2:
                    zoom 1.0 xalign -0.3 yalign 0.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                character "Они же договорились о дуэли. Никто не виноват, знали на что шли."
                show ghost_ht2:
                    zoom 1.0 xalign 0.7 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                if rightornot == 0:
                    $ ghost += 1
                    characterht2 "Так не бывает, чтоб никто не был виноват.  За свою безответственность ты остаешься с призраками навсегда! Ответ неверный! +1 Призрак"
                else:
                    "Так не бывает, чтоб никто не был виноват.  За свою безответственность ты остаешься с призраками навсегда! Ответ неверный!"
                hide ghost_ht2 with dissolve
                hide m2 with dissolve
                $ rightornot += 1
                jump scene27_0_m
            "Прочитать загадку еще раз":
                jump scene27_0_m_0
        jump scene28
    elif gender == "G":
        show ghost_ht2:
            zoom 1.0 xalign 0.7 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        characterht2 "Нам никто не нужен, мы будем сражаться один на один."
        show g1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Хитрец. Именно секунданты определяют место, время и другие условия дуэли. Именно они следят за соблюдением правил поединка. Если не будет секундантов, то это не бой, а просто-напросто убийство."
        "Призрак нахмурился и задумался."
        characterht2 "Скажи сразу, что испугалась защищать свою честь!"
        hide g1 with dissolve
        show g2:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Как бы не так! Я, наоборот, слежу, чтобы дуэль была честной. Участвовать в глупой перестрелке — постыдное занятие, низкое для любого уважающего себя человека."
        "Привидение словно задумалось над словами чужака. Дуэлянт на несколько секунд затих."
        characterht2 "А ты не глупа. Что ж, может быть, ты и достойна пройти этот путь."
        hide g2 with dissolve
        show g1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Благодарю."
        characterht2 "Но просто отпустить тебя я не смогу. Как призрак, я желаю, чтобы этот мир поглотил вашу реальность. Но из уважения дам тебе фору, если отгадаешь загадку."
        characterht2 "А проиграешь — останешься здесь навсегда, превратившись в призрака, и будешь целую вечность снова и снова стреляться со мной на дуэли. Согласна?"
        character "А у меня есть выбор?"
        "Послышался хриплый, пугающий смех."
        characterht2 "Правда твоя. Выбора нет."
        hide g1 with dissolve
        show g2:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Что за загадка?"
        label scene27_0_g_0:
        characterht2 "Попросили как-то мудреца решить одну дилемму. После дуэли оба дуэлянта были ранены, но один из участников погиб спустя некоторое время от инфекции, попавшей в рану."
        characterht2 "А другой, не став дожидаться, когда погибнет от потери крови, прыгнул с обрыва. Кто из этих двух виновен в том, что оппонент погиб?"
        hide g2 with dissolve
        hide ghost_ht2 with dissolve
        label scene27_0_g:
        menu:
            "Оба виноваты":
                show g2:
                    zoom 1.0 xalign -0.3 yalign 0.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                character "Нечего было стреляться, оба виноваты."
                show ghost_ht2:
                    zoom 1.0 xalign 0.7 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                if rightornot == 0:
                    $ ghost += 1
                    "Ты ошиблась и остаешься здесь со мной и навсегда. +1 Призрак"
                else:
                    "Ты ошиблась и остаешься здесь со мной и навсегда."
                hide ghost_ht2 with dissolve
                hide g2 with dissolve
                $ rightornot += 1
                jump scene27_0_g
            "Первый":
                show g2:
                    zoom 1.0 xalign -0.3 yalign 0.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                character "Первый погиб, потому что рану неправильно лечили. А второй из-за выстрела и последующей потери крови в любом случае бы погиб. Так что мой выбор — первый."
                show ghost_ht2:
                    zoom 1.0 xalign 0.7 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                characterht2 "Что ж, и врага можно уважать. Ступай. Удачи тебе не желаю, но с интересом понаблюдаю, как ты будешь двигаться дальше. Очень жаль, что со мной не осталась."
                if rightornot == 0:
                    $ reality += 1
                    "Вы справились! +1 Явь"
                else:
                    "Вы справились!"
                hide ghost_ht2 with dissolve
                $ rightornot = 0
                jump scene28
            "Второй":
                show g5:
                    zoom 1.0 xalign -0.3 yalign 0.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                character "Не знаю, ну, пусть будет второй!"
                show ghost_ht2:
                    zoom 1.0 xalign 0.7 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                if rightornot == 0:
                    $ ghost += 1
                    characterht2 "Что значит «пусть будет второй»? За свою несерьезность ты остаешься с призраками навсегда! Ответ неверный! +1 Призрак"
                else:
                    "Что значит «пусть будет второй»? За свою несерьезность ты остаешься с призраками навсегда! Ответ неверный!"
                hide ghost_ht2 with dissolve
                hide g5 with dissolve
                $ rightornot += 1
                jump scene27_0_g
            "Никто не виноват":
                show g2:
                    zoom 1.0 xalign -0.3 yalign 0.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                character "Они же договорились о дуэли. Никто не виноват, знали на что шли."
                show ghost_ht2:
                    zoom 1.0 xalign 0.7 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                if rightornot == 0:
                    $ ghost += 1
                    characterht2 "Так не бывает, чтоб никто не был виноват.  За свою безответственность ты остаешься с призраками навсегда! Ответ неверный! +1 Призрак"
                else:
                    "Так не бывает, чтоб никто не был виноват.  За свою безответственность ты остаешься с призраками навсегда! Ответ неверный!"
                hide ghost_ht2 with dissolve
                hide g2 with dissolve
                $ rightornot += 1
                jump scene27_0_g
            "Прочитать загадку еще раз":
                jump scene27_0_g_0
        jump scene28

label scene28:
    scene 2back1 with fade:
        size (1280, 720)
        fit "fill"
    stop music fadeout 2.0
    play music ball fadein 2.0 loop if_changed
    if gender == "M":
        "Призрак растворился, словно его здесь и не было. [player_name] зачарованно смотрел на то место, где он только что был."
        show t1:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Молодец, мой друг! Все лавры достаются тебе!"
        "[player_name] подпрыгнул от неожиданности на месте."
        show m7:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Климент Аркадьевич! Нельзя так подкрадываться. И эти ваши вечные ботанические ассоциации… Какие тут лавры, если я понятия не имею, что буду делать дальше."
        tmrz "Начало положено!"
        hide m7 with dissolve
        hide t1 with dissolve
        jump scene29
    elif gender == "G":
        "Призрак растворился, словно его здесь и не было. [player_name] зачарованно смотрела на то место, где он только что был."
        show t1:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Молодец, мой друг! Все лавры достаются тебе!"
        "[player_name] подпрыгнула от неожиданности на месте."
        show g7:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Климент Аркадьевич! Нельзя так подкрадываться. И эти ваши вечные ботанические ассоциации… Какие тут лавры, если я понятия не имею, что буду делать дальше."
        tmrz "Начало положено!"
        hide g7 with dissolve
        hide t1 with dissolve
        jump scene29


label scene29:
    scene 2back1 with fade:
        size (1280, 720)
        fit "fill"
    if gender == "M":
        if book_lermnt == 1:
            show t1:
                zoom 1.0 xalign 1.3 yalign 1.0
                alpha 0.0
                easein 0.3 alpha 1.0
            tmrz "Посмотри внимательно по сторонам. В прошлый раз ты нашел одну из утерянных книг, может быть и в этот раз удача от тебя не отвернется!"
            hide t1 with dissolve
        else:
            show t1:
                zoom 1.0 xalign 1.3 yalign 1.0
                alpha 0.0
                easein 0.3 alpha 1.0
            tmrz "Но не зазнавайся, [player_name]. В прошлый раз после встречи с призраком ты не заметил книгу. Не забывай осматриваться по сторонам. Может, в этот раз получится?"
            hide t1 with dissolve
        menu:
            "За дальней колонной":
                "Пусто."
            "Под лестницей":
                $ reality += 1
                $ verno += 1
                $ book_coi += 1
                "Верно! Вы нашли книгу «Цой». + Явь"
            "За ближней колонной":
                "Пусто."
        if verno == 0:
            show t1:
                zoom 1.0 xalign 1.3 yalign 1.0
                alpha 0.0
                easein 0.3 alpha 1.0
            tmrz "Не расстраивайся, мой друг. Повезет в следующий раз. А пока нам нужно торопиться дальше. Открой карту и скажи, куда пойдем?"
            hide t1 with dissolve
        else:
            show t1:
                zoom 1.0 xalign 1.3 yalign 1.0
                alpha 0.0
                easein 0.3 alpha 1.0
            show coi with fade:
                zoom 1.0 xalign 0 yalign 0
                alpha 0.0
                easein 0.3 alpha 1.0
            tmrz "Отличная работа! А вот и подсказка… Нам нужно отправиться туда, где могли бывать участники Ленинградского рок-клуба. Как ты думаешь, куда?"
            hide t1 with dissolve
            hide coi with dissolve
        $ verno = 0
        label scene29_0_m:
            menu:
                "ДК им. А. Д. Цюрупы":
                    if rightornot == 0:
                        $ reality += 1
                        "Верно, у вас хорошая интуиция. +Явь"
                    else:
                        "Верно, у вас хорошая интуиция."
                    tmrz  "Познакомимся с бывшим Домом просветительских учреждений или Домом культуры им. А. Д. Цюрупы."
                    $ rightornot = 0
                    jump scene30
                "Рынок":
                    if rightornot == 0:
                        $ ghost += 1
                        "Неверно. Попробуйте еще раз. + Призрак"
                        $ rightornot += 1
                    else:
                        "Неверно. Попробуйте еще раз."
                    jump scene29_0_m
                "Вокзал":
                    if rightornot == 0:
                        $ ghost += 1
                        "Неверно. Попробуйте еще раз. + Призрак"
                        $ rightornot += 1
                    else:
                        "Неверно. Попробуйте еще раз."
                    jump scene29_0_m
        jump scene30
    elif gender == "G":
        if book_lermnt == 1:
            show t1:
                zoom 1.0 xalign 1.3 yalign 1.0
                alpha 0.0
                easein 0.3 alpha 1.0
            tmrz "Посмотри внимательно по сторонам. В прошлый раз ты нашла одну из утерянных книг, может быть, и в этот раз удача от тебя не отвернется!"
            hide t1 with dissolve
        else:
            show t1:
                zoom 1.0 xalign 1.3 yalign 1.0
                alpha 0.0
                easein 0.3 alpha 1.0
            tmrz "Но не зазнавайся, [player_name]. В прошлый раз после встречи с призраком ты не заметила книгу. Не забывай осматриваться по сторонам. Может, в этот раз получится?"
            hide t1 with dissolve
        menu:
            "За дальней колонной":
                "Пусто."
            "Под лестницей":
                $ reality += 1
                $ verno += 1
                $ book_coi += 1
                "Верно! Вы нашли книгу «Цой». + Явь"
            "За ближней колонной":
                "Пусто."
        if verno == 0:
            show t1:
                zoom 1.0 xalign 1.3 yalign 1.0
                alpha 0.0
                easein 0.3 alpha 1.0
            tmrz "Не расстраивайся, мой друг. Повезет в следующий раз. А пока нам нужно торопиться дальше. Открой карту и скажи, куда пойдем?"
            hide t1 with dissolve
        else:
            show t1:
                zoom 1.0 xalign 1.3 yalign 1.0
                alpha 0.0
                easein 0.3 alpha 1.0
            show coi with fade:
                zoom 1.0 xalign 0 yalign 0
                alpha 0.0
                easein 0.3 alpha 1.0
            tmrz "Отличная работа! А вот и подсказка… Нам нужно отправиться туда, где могли бывать участники Ленинградского рок-клуба. Как ты думаешь, куда?"
            hide t1 with dissolve
            hide coi with dissolve
        $ verno = 0
        label scene29_0_g:
            menu:
                "ДК им. А. Д. Цюрупы":
                    if rightornot == 0:
                        $ reality += 1
                        "Верно, у вас хорошая интуиция. +Явь"
                    else:
                        "Верно, у вас хорошая интуиция."
                    tmrz  "Познакомимся с бывшим Домом просветительских учреждений или Домом культуры им. А. Д. Цюрупы."
                    $ rightornot = 0
                    jump scene30
                "Рынок":
                    if rightornot == 0:
                        $ ghost += 1
                        "Неверно. Попробуйте еще раз. + Призрак"
                        $ rightornot += 1
                    else:
                        "Неверно. Попробуйте еще раз."
                    jump scene29_0_g
                "Вокзал":
                    if rightornot == 0:
                        $ ghost += 1
                        "Неверно. Попробуйте еще раз. + Призрак"
                        $ rightornot += 1
                    else:
                        "Неверно. Попробуйте еще раз."
                    jump scene29_0_g
        jump scene30

label scene30:
    scene 2back2 with fade:
        size (1280, 720)
        fit "fill"
    stop music fadeout 2.0
    play music dktsoy fadein 2.0 loop if_changed
    if gender == "M":
        show t2:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Добро пожаловать, [player_name]. Ты не знаешь, наверно, но с 1913 года  это был главный культурный центр Везенбергского квартала."
        hide t2 with dissolve
        if archaeologist == 1:
            show m1:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
            character "Я знаком с его историей. Он открылся в результате деятельности Общества народных университетов, которые ставили перед собой цель помогать работающим людям в получении образования, ликвидируя неграмотность."
            hide m1 with dissolve
        elif architect == 1:
            show m1:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
            character "Здание в стиле модерн. Стиль был популярен на рубеже XIX-XX веков. Знаю, что здание построил Николай Всеволодович Дмитриев для деятельности Общества народных университетов."
            hide m1 with dissolve
        elif journalist == 1:
            show m1:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
            character "Я слышал, что здесь когда-то была школа и множество различных кружков. В наше время его совсем недавно отреставрировали и снова открыли учебное заведение."
            hide m1 with dissolve
        elif botanist == 1:
            show m1:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
            character "Здесь работали так называемые вечерние школы, которые посещали рабочие этого района."
            hide m1 with dissolve
        show t1:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Молодец, мой друг! Все верно. А также здесь располагалась читальня им. Н. В. Гоголя. Сейчас ты знаешь ее как библиотеку им. К. А. Тимирязева."
        show m5:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Тогда понятно, почему нам нужно сюда. Возможно, призраки решили вернуть книги на прежнее место, где когда-то был дом библиотеки."
        tmrz "Не будем загадывать. Вряд ли нам так повезет, что все издания, которые были похищены, окажутся только здесь. Нам предстоит еще многое пройти. Ты стал немного увереннее в себе и немного освоился в битве с призраками. Готов к следующему шагу?"
        hide m5 with dissolve
        hide t1 with dissolve
        show m6:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        menu:
            character "Я..."
            "Готов":
                $ reality += 1
                "+Явь"
            "Постараюсь сделать все, что от меня зависит":
                $ ghost += 1
                $ reality += 1
                "+Явь +Призрак"
            "Не готов":
                $ ghost += 1
                "+Призрак"
        show t2:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "В любом случае времени на раздумья у нас нет.  Вперед!"
        hide t2 with dissolve
        hide m6 with dissolve
        jump scene31
    elif gender == "G":
        show t2:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Добро пожаловать, [player_name]. Ты не знаешь, наверно, но с 1913 года  это был главный культурный центр Везенбергского квартала."
        hide t2 with dissolve
        if archaeologist == 1:
            show g1:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
            character "Я знакома с его историей. Он открылся в результате деятельности Общества народных университетов, которые ставили перед собой цель помогать работающим людям в получении образования, ликвидируя неграмотность."
            hide g1 with dissolve
        elif architect == 1:
            show g1:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
            character "Здание в стиле модерн. Стиль был популярен на рубеже XIX-XX веков. Знаю, что здание построил Николай Всеволодович Дмитриев для деятельности Общества народных университетов."
            hide g1 with dissolve
        elif journalist == 1:
            show g1:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
            character "Я слышала, что здесь когда-то была школа и множество различных кружков. В наше время его совсем недавно отреставрировали и снова открыли учебное заведение."
            hide g1 with dissolve
        elif botanist == 1:
            show g1:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
            character "Здесь работали так называемые вечерние школы, которые посещали рабочие этого района."
            hide g1 with dissolve
        show t1:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Молодец, мой друг! Все верно. А также здесь располагалась читальня им. Н. В. Гоголя. Сейчас ты знаешь ее как библиотеку им. К. А. Тимирязева."
        show g5:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Тогда понятно, почему нам нужно сюда. Возможно, призраки решили вернуть книги на прежнее место, где когда-то был дом библиотеки."
        tmrz "Не будем загадывать. Вряд ли нам так повезет, что все издания, которые были похищены, окажутся только здесь. Нам предстоит еще многое пройти. Ты стала немного увереннее в себе и немного освоилась в битве с призраками. Готова к следующему шагу?"
        hide g5 with dissolve
        hide t1 with dissolve
        show g6:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        menu:
            character "Я..."
            "Готова":
                $ reality += 1
                "+Явь"
            "Постараюсь сделать все, что от меня зависит":
                $ ghost += 1
                $ reality += 1
                "+Явь +Призрак"
            "Не готова":
                $ ghost += 1
                "+Призрак"
        show t2:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "В любом случае времени на раздумья у нас нет.  Вперед!"
        hide t2 with dissolve
        hide g6 with dissolve
        jump scene31

label scene31:
    scene 2back3 with fade:
        size (1280, 720)
        fit "fill"
    if gender == "M":
        "[player_name] и Климент Аркадьевич направлялись сразу в библиотеку, однако внезапно их остановила музыка, доносящаяся из-за двери."
        show m5:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Знакомый стиль…"
        show t1:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Ты уверен, что нам стоит здесь задерживаться?"
        character "Но… Вы, кажется, говорили, что здесь репетировал кто-то из рок-клуба? Вдруг это моя любимая группа, а я пройду мимо?"
        tmrz "Пока это еще не твоя любимая группа, а просто какие-то бездельники в глазах окружающих людей."
        hide m5 with dissolve
        show m8:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Это точно они! Я хочу посмотреть!"
        tmrz "Да стой ты! Все равно это призраки, они растворятся, как только ты зайдешь сюда."
        hide m8 with dissolve
        hide t1 with dissolve
        jump scene32
    elif gender == "G":
        "[player_name] и Климент Аркадьевич направлялись сразу в библиотеку, однако внезапно их остановила музыка, доносящаяся из-за двери."
        show g5:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Знакомый стиль…"
        show t1:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Ты уверена, что нам стоит здесь задерживаться?"
        character "Но… Вы, кажется, говорили, что здесь репетировал кто-то из рок-клуба? Вдруг это моя любимая группа, а я пройду мимо?"
        tmrz "Пока это еще не твоя любимая группа, а просто какие-то бездельники в глазах окружающих людей."
        hide g5 with dissolve
        show g8:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Это точно они! Я хочу посмотреть!"
        tmrz "Да стой ты! Все равно это призраки, они растворятся, как только ты зайдешь сюда."
        hide g8 with dissolve
        hide t1 with dissolve
        jump scene32

label scene32:
    scene 2back4 with fade:
        size (1280, 720)
        fit "fill"
    if gender == "M":
        "[player_name] уже не слушал Климента Аркадьевича. Резко открыв дверь, он ворвался в большой зал, напоминающий концертный. Здесь была сцена, множество кресел, не хватало только собравшихся зрителей."
        "К сожалению, как и сказал Тимирязев, призраков уже не было в зале. Но все еще была слышна музыка, словно они продолжали репетировать, правда, [player_name] этого уже никогда не увидит. "
        show m7:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Я должен был попытаться. Не упускать же такой шанс."
        hide m7 with dissolve
        "Климент Аркадьевич пожал плечами, словно бы ожидал такой развязки, но ничего не сказал."
        "[player_name] хотел уже разочарованно уйти, но задумался."
        show m5:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Не просто же меня словно завлекли в этот зал…"
        hide m5 with dissolve
        menu:
            "Мне стоит"
            "Осмотреть сцену":
                "Здесь, похоже, проходили не только репетиции и концерты, но и театральные постановки."
                "Вы, к сожалению, не нашли ничего полезного, [player_name] отправился дальше."
            "Проверить кресла":
                "[player_name] прошелся вдоль кресел и сел на одно из них. Фантазия нарисовала картину прежних лет. Большой зал со зрителями, на сцене выступают артисты. Шумная толпа народа набивается в зал, желая посмотреть, какое мероприятие в этот раз подготовили в Доме культуры."
                show m1:
                    zoom 1.0 xalign -0.3 yalign 0.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                character "Может, я сошел с ума…"
                character "Но почему бы не проверить…"
                "[player_name] нагнулся, чтобы посмотреть под кресло."
                show canal with fade:
                    zoom 1.0 xalign 0 yalign 0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                $ book_canal += 1
                $ reality += 1
                "Вы нашли новую книгу! + Явь"
                character "Книги обычно предсказывают, что будет дальше… Видимо, в следующий раз стоит искать подсказку на Обводном канале."
                hide canal with dissolve
                hide m1 with dissolve
            "Посмотреть на люстру":
                show m3:
                    zoom 1.0 xalign -0.3 yalign 0.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                character "Красивая… Правда, в мире призраков не стоит стоять прямо под ней. Вдруг кто-то из недоброжелателей решит воспользоваться ситуацией  и расправиться со мной."
                hide m3 with dissolve
                "Вы, к сожалению, не нашли ничего полезного."
        stop music fadeout 2.0
        play music untitledMaster fadein 2.0 loop if_changed
        "[player_name] рассматривал зал, желая здесь ненадолго задержаться. Он и не заметил, как Климент Аркадьевич куда-то пропал. Поэтому, когда услышал странные звуки за спиной, решил, что это Тимирязев, и обернулся."
        show m1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Климент Аркадьевич, я…"
        hide m1 with dissolve
        show m7:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "…"
        show ghost_pevica:
            zoom 1.0 xalign 0.7 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        characterpevica "Ты пришел послушать мое пение?"
        character "Я…"
        "Не дослушав, призрак разомкнула пугающую челюсть и закричала. Было похоже, что она пытается петь, но звук был невыносим для ушей обычного человека."
        character "Прекрати!!!"
        "Певица на мгновение остановилась, и ее взгляд стал злее."
        characterpevica "Тебе не нравится, как я пою? Как ты смеешь!"
        "Она злобно оскалилась и двинулась в атаку."
        hide ghost_pevica with dissolve
        hide m7 with dissolve
        label scene32_0_m:
            $ return_label = "scene32_1_timeout_m"  # Куда перейти при тайм-ауте
            show screen choice_timer(5)             # Таймер на 5 секунды
            menu:
                "Спрятаться":
                    hide screen choice_timer
                    "[player_name] заметался в поисках укрытия. Выбор пал на пространство за сценой. Резво взобравшись по ступенькам, [player_name] скользнул в проем, но почувствовал, как кто-то схватил его за шиворот."
                    show ghost_pevica:
                        zoom 1.0 xalign 0.7 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    characterpevica "Попался! Теперь  будешь слушать мои концерты вечность!"
                    if rightornot == 0:
                        $ ghost += 1
                        $ rightornot += 1
                        "Вам не удалось справиться, попробуйте еще раз! +1 Призрак"
                    else:
                        "Вам не удалось справиться, попробуйте еще раз!"
                    hide ghost_pevica with dissolve
                    jump scene32_0_m
                "Атаковать":
                    hide screen choice_timer
                    "Собрав последние силы, [player_name] с диким криком бросился на призрака, но прошел сквозь него. Певица на несколько секунд растерялась, но затем снова оскалилась. "
                    show ghost_pevica:
                        zoom 1.0 xalign 0.7 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    characterpevica "Ты ненормальный?"
                    show m7:
                        zoom 1.0 xalign -0.3 yalign 0.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    character "Я…"
                    "[player_name] тоже растерялся, испуганно замерев. Воспользовавшись этим, призрачная женщина схватила его за шиворот."
                    characterpevica "Попался! Теперь  будешь слушать мои концерты вечность!"
                    if rightornot == 0:
                        $ ghost += 1
                        $ rightornot += 1
                        "Вам не удалось справиться, попробуйте еще раз! +1 Призрак"
                    else:
                        "Вам не удалось справиться, попробуйте еще раз!"
                    hide m7 with dissolve
                    hide ghost_pevica with dissolve
                    jump scene32_0_m
                "Бежать":
                    hide screen choice_timer
                    "[player_name], недолго думая, бросился к выходу."
                    if rightornot == 0:
                        $ reality += 1
                        "+1 Явь"
                    $ rightornot = 0
                    jump scene33
                "Закричать":
                    hide screen choice_timer
                    "[player_name] замер, а затем громко закричал, пародируя призрака."
                    "Певица вздрогнула и на долю секунды растерялась."
                    show ghost_pevica:
                        zoom 1.0 xalign 0.7 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    characterpevica  "Ты что это…"
                    characterpevica "Передразнивать меня вздумал?"
                    "Призрак озлобился еще сильнее прежнего и кинулся вперед. [player_name] почувствовал, как его схватили за шиворот."
                    characterpevica "Попался! Теперь  будешь слушать мои концерты вечность!"
                    if rightornot == 0:
                        $ ghost += 1
                        $ rightornot += 1
                        "Вам не удалось справиться, попробуйте еще раз! +1 Призрак"
                    else:
                        "Вам не удалось справиться, попробуйте еще раз!"
                    hide ghost_pevica with dissolve
                    jump scene32_0_m
            label scene32_1_timeout_m:
                hide screen choice_timer
                "[player_name] заметался в поисках укрытия. Выбор пал на пространство за сценой. Резво взобравшись по ступенькам, [player_name] скользнул в проем, но почувствовал, как кто-то схватил его за шиворот."
                show ghost_pevica:
                    zoom 1.0 xalign 0.7 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                characterpevica "Попался! Теперь  будешь слушать мои концерты вечность!"
                if rightornot == 0:
                    $ ghost += 1
                    $ rightornot += 1
                    "Вам не удалось справиться, попробуйте еще раз! +1 Призрак"
                else:
                    "Вам не удалось справиться, попробуйте еще раз!"
                hide ghost_pevica with dissolve
                jump scene32_0_m
        jump scene33
    elif gender == "G":
        "[player_name] уже не слушала Климента Аркадьевича. Резко открыв дверь, она ворвалась в большой зал, напоминающий концертный. Здесь была сцена, множество кресел, не хватало только собравшихся зрителей."
        "К сожалению, как и сказал Тимирязев, призраков уже не было в зале. Но все еще была слышна музыка, словно они продолжали репетировать, правда, [player_name] этого уже никогда не увидит. "
        show g7:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Я должна была попытаться. Не упускать же такой шанс."
        hide g7 with dissolve
        "Климент Аркадьевич пожал плечами, словно бы ожидал такой развязки, но ничего не сказал."
        "[player_name] хотела уже разочарованно уйти, но задумалась."
        show g5:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Не просто же меня словно завлекли в этот зал…"
        hide g5 with dissolve
        menu:
            "Мне стоит"
            "Осмотреть сцену":
                "Здесь, похоже, проходили не только репетиции и концерты, но и театральные постановки."
                "Вы, к сожалению, не нашли ничего полезного, [player_name] отправилась дальше."
            "Проверить кресла":
                "[player_name] прошлась вдоль кресел и села на одно из них. Фантазия нарисовала картину прежних лет. Большой зал со зрителями, на сцене выступают артисты. Шумная толпа народа набивается в зал, желая посмотреть, какое мероприятие в этот раз подготовили в Доме культуры."
                show g1:
                    zoom 1.0 xalign -0.3 yalign 0.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                character "Может, я сошла с ума…"
                character "Но почему бы не проверить…"
                "[player_name] нагнулась, чтобы посмотреть под кресло."
                show canal with fade:
                    zoom 1.0 xalign 0 yalign 0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                $ book_canal += 1
                $ reality += 1
                "Вы нашли новую книгу! + Явь"
                character "Книги обычно предсказывают, что будет дальше… Видимо, в следующий раз стоит искать подсказку на Обводном канале."
                hide canal with dissolve
                hide g1 with dissolve
            "Посмотреть на люстру":
                show g3:
                    zoom 1.0 xalign -0.3 yalign 0.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                character "Красивая… Правда, в мире призраков не стоит стоять прямо под ней. Вдруг кто-то из недоброжелателей решит воспользоваться ситуацией  и расправиться со мной."
                hide g3 with dissolve
                "Вы, к сожалению, не нашли ничего полезного."
        stop music fadeout 2.0
        play music untitledMaster fadein 2.0 loop if_changed
        "[player_name] рассматривала зал, желая здесь ненадолго задержаться. Она и не заметила, как Климент Аркадьевич куда-то пропал. Поэтому, когда услышала странные звуки за спиной, решила, что это Тимирязев, и обернулась."
        show g1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Климент Аркадьевич, я…"
        hide g1 with dissolve
        show g7:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "…"
        show ghost_pevica:
            zoom 1.0 xalign 0.7 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        characterpevica "Ты пришла послушать мое пение?"
        character "Я…"
        "Не дослушав, призрак разомкнула пугающую челюсть и закричала. Было похоже, что она пытается петь, но звук был невыносим для ушей обычного человека."
        character "Прекрати!!!"
        "Певица на мгновение остановилась, и ее взгляд стал злее."
        characterpevica "Тебе не нравится, как я пою? Как ты смеешь!"
        "Она злобно оскалилась и двинулась в атаку."
        hide ghost_pevica with dissolve
        hide g7 with dissolve
        label scene32_0_g:
            $ return_label = "scene32_1_timeout_g"  # Куда перейти при тайм-ауте
            show screen choice_timer(5)             # Таймер на 5 секунды
            menu:
                "Спрятаться":
                    hide screen choice_timer
                    "[player_name] заметалась в поисках укрытия. Выбор пал на пространство за сценой. Резво взобравшись по ступенькам, [player_name] скользнула в проем, но почувствовала, как кто-то схватил ее за шиворот."
                    show ghost_pevica:
                        zoom 1.0 xalign 0.7 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    characterpevica "Попалась! Теперь  будешь слушать мои концерты вечность!"
                    if rightornot == 0:
                        $ ghost += 1
                        $ rightornot += 1
                        "Вам не удалось справиться, попробуйте еще раз! +1 Призрак"
                    else:
                        "Вам не удалось справиться, попробуйте еще раз!"
                    hide ghost_pevica with dissolve
                    jump scene32_0_g
                "Атаковать":
                    hide screen choice_timer
                    "Собрав последние силы, [player_name] с диким криком бросилась на призрака, но прошла сквозь него. Певица на несколько секунд растерялась, но затем снова оскалилась."
                    show ghost_pevica:
                        zoom 1.0 xalign 0.7 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    characterpevica "Ты ненормальная?"
                    show g7:
                        zoom 1.0 xalign -0.3 yalign 0.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    character "Я…"
                    "[player_name] тоже растерялась, испуганно замерев. Воспользовавшись этим, призрачная женщина схватила ее за шиворот."
                    characterpevica "Попалась! Теперь  будешь слушать мои концерты вечность!"
                    if rightornot == 0:
                        $ ghost += 1
                        $ rightornot += 1
                        "Вам не удалось справиться, попробуйте еще раз! +1 Призрак"
                    else:
                        "Вам не удалось справиться, попробуйте еще раз!"
                    hide g7 with dissolve
                    hide ghost_pevica with dissolve
                    jump scene32_0_g
                "Бежать":
                    hide screen choice_timer
                    "[player_name], недолго думая, бросилась к выходу."
                    if rightornot == 0:
                        $ reality += 1
                        "+1 Явь"
                    $ rightornot = 0
                    jump scene33
                "Закричать":
                    hide screen choice_timer
                    "[player_name] замерла, а затем громко закричала, пародируя призрака."
                    "Певица вздрогнула и на долю секунды растерялась."
                    show ghost_pevica:
                        zoom 1.0 xalign 0.7 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    characterpevica  "Ты что это…"
                    characterpevica "Передразнивать меня вздумала?"
                    "Призрак озлобился еще сильнее прежнего и кинулся вперед. [player_name] почувствовала, как ее схватили за шиворот."
                    characterpevica "Попалась! Теперь  будешь слушать мои концерты вечность!"
                    if rightornot == 0:
                        $ ghost += 1
                        $ rightornot += 1
                        "Вам не удалось справиться, попробуйте еще раз! +1 Призрак"
                    else:
                        "Вам не удалось справиться, попробуйте еще раз!"
                    hide ghost_pevica with dissolve
                    jump scene32_0_g
            label scene32_1_timeout_g:
                hide screen choice_timer
                "[player_name] заметалась в поисках укрытия. Выбор пал на пространство за сценой. Резво взобравшись по ступенькам, [player_name] скользнула в проем, но почувствовала, как кто-то схватил ее за шиворот."
                show ghost_pevica:
                    zoom 1.0 xalign 0.7 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                characterpevica "Попалась! Теперь  будешь слушать мои концерты вечность!"
                if rightornot == 0:
                    $ ghost += 1
                    $ rightornot += 1
                    "Вам не удалось справиться, попробуйте еще раз! +1 Призрак"
                else:
                    "Вам не удалось справиться, попробуйте еще раз!"
                hide ghost_pevica with dissolve
                jump scene32_0_g
        jump scene33

label scene33:
    scene 2back5 with fade:
        size (1280, 720)
        fit "fill"
    stop music fadeout 2.0
    play music office fadein 2.0 loop if_changed
    if gender == "M":
        "[player_name] забежал в учебный класс и быстро спрятался под парту."
        "Призрак певицы медленно вплыл в помещение и посмотрел по сторонам."
        show ghost_pevica:
            zoom 1.0 xalign 0.7 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        characterpevica "…"
        show m4:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "…"
        characterpevica "Где же ты?"
        "[player_name] старался не шевелиться."
        characterpevica "Я знаю, как тебя выманить…"
        "Певица снова взвыла нечеловеческим голосом."
        hide m4 with dissolve
        show m7:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Нет, пожалуйста… Это невозможно выдержать."
        hide m7 with dissolve
        hide ghost_pevica with dissolve
        label scene33_0_m:
            $ return_label = "scene33_1_timeout_m"  # Куда перейти при тайм-ауте
            show screen choice_timer(5)             # Таймер на 5 секунды
            menu:
                "Выбежать":
                    hide screen choice_timer
                    if rightornot == 0:
                        $ ghost += 1
                        $ rightornot += 1
                        "Вас поймали, попробуйте еще раз. +1 Призрак"
                    else:
                        "Вас поймали, попробуйте еще раз."
                    jump scene33_0_m
                "Выбежать":
                    hide screen choice_timer
                    if rightornot == 0:
                        $ ghost += 1
                        $ rightornot += 1
                        "Вас поймали, попробуйте еще раз. +1 Призрак"
                    else:
                        "Вас поймали, попробуйте еще раз."
                    jump scene33_0_m
                "Терпеть":
                    hide screen choice_timer
                    "Было тяжело, но [player_name], заткнув уши и зажмурившись, старался не шевелиться. Казалось, прошла целая вечность, пока призрак не замолчал."
                    $ rightornot = 0
                    show ghost_pevica:
                        zoom 1.0 xalign 0.7 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    characterpevica "Хммм…"
                    "В последний раз певица посмотрела по сторонам и, помедлив, двинулась прочь."
                    hide ghost_pevica with dissolve
                    show m4:
                        zoom 1.0 xalign -0.3 yalign 0.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    character "Нужно искать Климента Аркадьевича и уходить отсюда."
                    hide m4 with dissolve
                    jump scene34
                "Выбежать":
                    hide screen choice_timer
                    if rightornot == 0:
                        $ ghost += 1
                        $ rightornot += 1
                        "Вас поймали, попробуйте еще раз. +1 Призрак"
                    else:
                        "Вас поймали, попробуйте еще раз."
                    jump scene33_0_m
            label scene33_1_timeout_m:
                    hide screen choice_timer
                    if rightornot == 0:
                        $ ghost += 1
                        $ rightornot += 1
                        "Вас поймали, попробуйте еще раз. +1 Призрак"
                    else:
                        "Вас поймали, попробуйте еще раз."
                    jump scene33_0_m
        jump scene34
    elif gender == "G":
        "[player_name] забежала в учебный класс и быстро спряталась под парту."
        "Призрак певицы медленно вплыл в помещение и посмотрел по сторонам."
        show ghost_pevica:
            zoom 1.0 xalign 0.7 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        characterpevica "…"
        show g4:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "…"
        characterpevica "Где же ты?"
        "[player_name] старалась не шевелиться."
        characterpevica "Я знаю, как тебя выманить…"
        "Певица снова взвыла нечеловеческим голосом."
        hide g4 with dissolve
        show g7:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Нет, пожалуйста… Это невозможно выдержать."
        hide g7 with dissolve
        hide ghost_pevica with dissolve
        label scene33_0_g:
            $ return_label = "scene33_1_timeout_g"  # Куда перейти при тайм-ауте
            show screen choice_timer(5)             # Таймер на 5 секунды
            menu:
                "Выбежать":
                    hide screen choice_timer
                    if rightornot == 0:
                        $ ghost += 1
                        $ rightornot += 1
                        "Вас поймали, попробуйте еще раз. +1 Призрак"
                    else:
                        "Вас поймали, попробуйте еще раз."
                    jump scene33_0_g
                "Выбежать":
                    hide screen choice_timer
                    if rightornot == 0:
                        $ ghost += 1
                        $ rightornot += 1
                        "Вас поймали, попробуйте еще раз. +1 Призрак"
                    else:
                        "Вас поймали, попробуйте еще раз."
                    jump scene33_0_g
                "Терпеть":
                    hide screen choice_timer
                    "Было тяжело, но [player_name], заткнув уши и зажмурившись, старалась не шевелиться. Казалось, прошла целая вечность, пока призрак не замолчал."
                    $ rightornot = 0
                    show ghost_pevica:
                        zoom 1.0 xalign 0.7 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    characterpevica "Хммм…"
                    "В последний раз певица посмотрела по сторонам и, помедлив, двинулась прочь."
                    hide ghost_pevica with dissolve
                    show g4:
                        zoom 1.0 xalign -0.3 yalign 0.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    character "Нужно искать Климента Аркадьевича и уходить отсюда."
                    hide g4 with dissolve
                    jump scene34
                "Выбежать":
                    hide screen choice_timer
                    if rightornot == 0:
                        $ ghost += 1
                        $ rightornot += 1
                        "Вас поймали, попробуйте еще раз. +1 Призрак"
                    else:
                        "Вас поймали, попробуйте еще раз."
                    jump scene33_0_g
            label scene33_1_timeout_g:
                hide screen choice_timer
                if rightornot == 0:
                    $ ghost += 1
                    $ rightornot += 1
                    "Вас поймали, попробуйте еще раз. +1 Призрак"
                else:
                    "Вас поймали, попробуйте еще раз."
                jump scene33_0_g
        jump scene34

label scene34:
    scene 2back6 with fade:
        size (1280, 720)
        fit "fill"
    stop music fadeout 2.0
    play music calmness fadein 2.0 loop if_changed
    if gender == "M":
        "[player_name] сломя голову бегал по коридору в поисках Тимирязева. Повезло, что Певица куда-то запропастилась и больше не являлась. [player_name] был не уверен, что ему удастся выдержать ужасающую песню еще раз."
        "Тимирязев нашелся в библиотеке. Он задумчиво листал книги."
        show m2:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Климент Аркадьевич, что за шутки! Где вы были?"
        show t1:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Прости, мой друг. Предавался ностальгии."
        character "Вы серьезно? Я чуть не погиб!"
        "Климент Аркадьевич сочувствующе посмотрел в ответ."
        tmrz "Прости меня, но ты должен понять, что это только твой путь. Я стараюсь тебе помочь, насколько способен. Но сделать все за тебя я, к сожалению, не смогу."
        "[player_name] хотел резко ответить то, что крутилось у него в голове, но вовремя остановился."
        "Уже стало ясно, что никуда от своей внезапной миссии не деться. Придется принимать правила игры."
        "Тимирязев выглядел немного опечаленным. [player_name] задумался."
        hide m2 with dissolve
        menu:
            "Подбодрить Климента Аркадьевича":
                show m1:
                    zoom 1.0 xalign -0.3 yalign 0.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                character "Вы чем-то расстроены?"
                tmrz "Просто подумал, что здесь раньше была наша библиотека, все меняется, и мир меняется. Не знаю, хорошо ли это или плохо."
                character "Вы сами говорили, что это нормальное течение жизни. Да и теперь у библиотеки есть ваше имя, большое пространство и море возможностей."
                "Тимирязев снова добродушно улыбнулся. Ему приятно, что вам не безразлична его задумчивость."
                tmrz "Ты прав, мой друг."
                hide m1 with dissolve
            "Сделать вид, что не замечаешь":
                "Вы огорчаете своим равнодушием Климента Аркадьевича."
        "[player_name] заметил книгу в его руках."
        show m5:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "А что вы читаете?"
        "[player_name] посмотрел на страницы, но они были пусты."
        tmrz "Это книжка о магических свойствах растений. Забавная литература."
        character "Но здесь же ничего нет."
        "Тимирязев по-доброму рассмеялся."
        tmrz "Прости, совсем забыл, так как этих книг уже нет, прочитать то, что здесь написано, могут только призраки. Давай я расскажу тебе несколько фактов-шуток, описанных здесь."
        hide t1 with dissolve
        show t2:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Например, полынь издавна почитают как растение-оберег, она защищает от злых духов. А с помощью лаврового листа в древности усиливали способность к прорицанию и вызывали видения. А вот лаванда исцеляет и дает жизненную силу."
        "Эта информация вам скоро пригодится."
        hide m5 with dissolve
        show m1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        if book_canal == 1:
            character "Ммм… Я запомню. Пойдем, Климент Аркадьевич. Я получил следующую подсказку, и нам нужно отправляться дальше. Думаю, что приключения нас ждут где-то у Обводного канала."
        else:
            character "Ммм... Я запомню. Пойдем, Климент Аркадьевич."
        hide m1 with dissolve
        hide t2 with dissolve
        jump scene35
    elif gender == "G":
        "[player_name] сломя голову бегала по коридору в поисках Тимирязева. Повезло, что Певица куда-то запропастилась и больше не являлась. [player_name] была не уверена, что ей удастся выдержать ужасающую песню еще хоть раз."
        "Тимирязев нашелся в библиотеке. Он задумчиво листал книги."
        show g2:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Климент Аркадьевич, что за шутки! Где вы были?"
        show t1:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Прости, мой друг. Предавался ностальгии."
        character "Вы серьезно? Я чуть не погибла!"
        "Климент Аркадьевич сочувствующе посмотрел в ответ."
        tmrz "Прости меня, но ты должна понять, что это только твой путь. Я стараюсь тебе помочь, насколько способен. Но сделать все за тебя я, к сожалению, не смогу."
        "[player_name] хотела резко ответить то, что крутилось у нее в голове, но вовремя остановилась."
        "Уже стало ясно, что никуда от своей внезапной миссии не деться. Придется принимать правила игры."
        "Тимирязев выглядел немного опечаленным. [player_name] задумалась."
        hide g2 with dissolve
        menu:
            character ""
            "Подбодрить Климента Аркадьевича":
                show g1:
                    zoom 1.0 xalign -0.3 yalign 0.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                tmrz "Просто подумал, что здесь раньше была наша библиотека, все меняется, и мир меняется. Не знаю, хорошо ли это или плохо."
                character "Вы сами говорили, что это нормальное течение жизни. Да и теперь у библиотеки есть ваше имя, большое пространство и море возможностей."
                "Тимирязев снова добродушно улыбнулся. Ему приятно, что вам не безразлична его задумчивость."
                tmrz "Ты права, мой друг."
                hide g1 with dissolve
            "Сделать вид, что не замечаешь":
                "Вы огорчаете своим равнодушием Климента Аркадьевича."
        "[player_name] заметила книгу в его руках."
        show g5:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "А что вы читаете?"
        "[player_name] посмотрела на страницы, но они были пусты."
        tmrz "Это книжка о магических свойствах растений. Забавная литература."
        character "Но здесь же ничего нет."
        "Тимирязев по-доброму рассмеялся."
        tmrz "Прости, совсем забыл, так как этих книг уже нет, прочитать то, что здесь написано, могут только призраки. Давай я расскажу тебе несколько фактов-шуток, описанных здесь."
        hide t1 with dissolve
        show t2:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Например, полынь издавна почитают как растение-оберег, она защищает от злых духов. А с помощью лаврового листа в древности усиливали способность к прорицанию и вызывали видения. А вот лаванда исцеляет и дает жизненную силу."
        "Эта информация вам скоро пригодится."
        hide g5 with dissolve
        show g1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        if book_canal == 1:
            character "Ммм… Я запомню. Пойдем, Климент Аркадьевич. Я получила следующую подсказку, и нам нужно отправляться дальше. Думаю, что приключения нас ждут где-то у Обводного канала."
        else:
            character "Ммм… Я запомню. Пойдем, Климент Аркадьевич."
        hide g1 with dissolve
        hide t2 with dissolve
        jump scene35

label scene35:
    scene 2back7 with fade:
        size (1280, 720)
        fit "fill"
    stop music fadeout 2.0
    play music mermaiddone fadein 2.0 loop if_changed
    if gender == "M":
        "[player_name] стоял на Ново-Петергофском мосту и вглядывался в канал. Пока было спокойно и даже ветер не создавал рябь на водной глади. Климент Аркадьевич оставил пока его одного и стоял неподалеку, изучая растения, которые прорастали рядом с этим местом."
        "Появилось время подумать о том, что происходит, проанализировать то, что никак не поддавалось осмыслению."
        "Пропавшие библиотекари, призрачный квартал, безумное течение времени — не хотелось признавать, но все это было действительно реально. В голове возникали предательские мысли о том, что этот путь — большая ответственность."
        show m6:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "…"
        hide m6 with dissolve
        "[player_name] сомневался, что справится. Конечно, ему хотелось помочь и вернуть все на места. Но нет никакой инструкции, как победить призраков."
        "Он дал себе обещание, что если все вернется на свои места, то он обязательно изучит судьбу тех, кто когда-то пребывал в Везенбергском квартале. Несмотря на все козни, что устраивали призраки, их было очень жаль."
        "История не должна забываться, иначе мы рискуем потерять что-то важное и начать ошибаться снова и снова, ничему так и не научившись."
        characterVois "Тебе не обязательно бороться с этим миром."
        show m7:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Снова этот голос!"
        characterVois "Ты же можешь остаться здесь…"
        hide m7 with dissolve
        show m2:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Ну уж нет! Спасибо. Не настолько я проникся атмосферой."
        characterVois "Ты устал и совсем не понимаешь, где находишься. А между тем время бежит, и его осталось совсем мало. Тревога в твоем сердце нарастает все больше и больше, ты боишься, что тебе не удастся все разрешить."
        characterVois "Так, может быть, лучше начать привыкать ко всему, что тебя окружает? Так, на всякий случай…"
        hide m2 with dissolve
        show m1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Я надеюсь, что смогу…"
        characterVois "Ты совсем юн для такой тяжелой ноши. Как ты можешь бороться с силой, которая копилась на этой территории веками?"
        hide m1 with dissolve
        "Неизвестный голос проник в самые потаенные мысли. Он словно обволакивал сознание. [player_name] против воли стал прислушиваться к нему."
        characterVois "Подойди поближе, не бойся. Я помогу тебе справиться."
        "Ноги сами шагали вперед, ближе к ограде моста. Водная гладь гипнотизировала, ее хотелось коснуться."
        characterVois "Я буду твоим другом на этом пути."
        show m1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "У меня уже есть друг."
        characterVois "Климент Аркадьевич очень умный… и хитрый. Он же тоже призрак, откуда ты знаешь, что он дает тебе правильные советы, а не делает так, чтобы твой мир скорее превратился в старый квартал?"
        hide m1 with dissolve
        "[player_name] посмотрел на Тимирязева, который с увлечением делал какие-то заметки в записной книжке, рассматривая заинтересовавшее его растение."
        "[player_name] ведь на самом деле не может быть уверен, что Климент Аркадьевич на его стороне. А с другой стороны, если не доверять никому, то как не сойти с ума в этом мире?"
        characterVois "Я расскажу тебе всю правду. От тебя скрыли все самое важное. Твои возможности!"
        show m5:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Возможности?"
        characterVois "Придет время, и призраки охватят весь мир, это сейчас мы проживаем только в квартале. Скоро туман охватит город и будет распространяться дальше. Если ты будешь с нами — сможешь возглавить нас. Получишь безграничную власть…"
        "Голос играл на струнках потаенных желаний. Всегда хотелось стать кем-то значимым, а тут предоставляется такой шанс. Призраки так или иначе завоюют мир, выбор только такой — сражаться и проиграть или присоединиться и возглавить."
        "Растворяясь в грезах, [player_name] тянулся к воде…"
        hide m5 with dissolve
        show m6:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Может… лучше сдаться?"
        characterVois "Конечно. Сразу можно будет расслабиться, тяжкое бремя спадет с плеч. В конце концов, это так несправедливо, что, не спросив, они втянули тебя в эту пугающую игру. Я обниму тебя и успокою. Мы вместе придумаем, что делать дальше…"
        hide m6 with dissolve
        stop music fadeout 2.0
        play music office fadein 2.0 loop if_changed
        "[player_name] почти забрался на ограду, чтобы прыгнуть вниз, в воду, как внезапно его схватили за руку."
        show t1:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Мой друг! Что ты делаешь!"
        "[player_name] очнулся от гипноза и удивленно посмотрел по сторонам."
        show m7:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Что происходит?"
        tmrz "Я, кажется, понял!"
        tmrz "Выходи!!!"
        "[player_name] замер в ожидании. Голос пропал, и никто не спешил показываться. Но Климент Аркадьевич стоял на своем."
        tmrz "А ну выйди, покажись!"
        "Туман стелился по Обводному каналу, становился плотнее. Внезапно клубы поднялись до самого моста, и в самой гуще показался силуэт. Из тумана на мост вышла русалка."
        show ghost_fish:
            zoom 1.0 xalign 0.7 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        characterfish "Хитрый вредный ученый! Почти ведь заманила к себе. Надо же было тебе влезть!"
        tmrz "Еще чего!"
        characterfish "Ну, теперь вы оба уйдете со мной под воду!!!"
        "Русалка направилась на чужаков."
        tmrz "[player_name]! Там, рядом с мостом, небольшой зеленый участок! Ты должен найти правильное растение, чтобы справиться с русалкой! Вспомни то, о чем мы говорили в библиотеке! Беги скорее, я ее задержу!"
        "[player_name] немедленно побежал искать."
        hide ghost_fish with dissolve
        hide m7 with dissolve
        hide t1 with dissolve
        label scene35_0_m:
            $ return_label = "scene35_1_timeout_m"  # Куда перейти при тайм-ауте
            show screen choice_timer(5)             # Таймер на 5 секунды
            menu:
                "Лаванда":
                    hide screen choice_timer
                    show m7:
                        zoom 1.0 xalign -0.3 yalign 0.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    character "Да как она выглядит?! Тут полно синих цветов! Лаванда вообще синяя или сиреневая?!"
                    "[player_name] быстро сорвал цветок, похожий на лаванду, и вернулся к Клименту Аркадьевичу."
                    show t1:
                        zoom 1.0 xalign 1.3 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    tmrz "Что это? Мой друг, это не то!!!"
                    show ghost_fish:
                        zoom 1.0 xalign 0.7 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    characterfish  "Вот вы и попались!!!!!!!!"
                    if rightornot == 0:
                        $ ghost += 1
                        $ rightornot += 1
                        "Попробуйте еще раз! +1 Призрак"
                    else:
                        "Попробуйте еще раз!"
                    hide ghost_fish with dissolve
                    hide t1 with dissolve
                    hide m7 with dissolve
                    jump scene35_0_m
                "Лавровый лист":
                    hide screen choice_timer
                    show m7:
                        zoom 1.0 xalign -0.3 yalign 0.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    character "Да как он выглядит?!"
                    "[player_name] быстро сорвал листы растения, похожие на лавр, и вернулся к Клименту Аркадьевичу."
                    show t1:
                        zoom 1.0 xalign 1.3 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    tmrz "Что это? Мой друг, это не то!!!"
                    show ghost_fish:
                        zoom 1.0 xalign 0.7 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    characterfish "Вот вы и попались!!!!!!!!"
                    if rightornot == 0:
                        $ ghost += 1
                        $ rightornot += 1
                        "Попробуйте еще раз! +1 Призрак"
                    else:
                        "Попробуйте еще раз!"
                    hide ghost_fish with dissolve
                    hide t1 with dissolve
                    hide m7 with dissolve
                    jump scene35_0_m
                "Полынь":
                    hide screen choice_timer
                    show m5:
                        zoom 1.0 xalign -0.3 yalign 0.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    character "У полыни специфический запах! Вроде бы это похоже на нее."
                    "[player_name] быстро сорвал растение, похожее на полынь, и вернулся к Клименту Аркадьевичу."
                    hide m5 with dissolve
                    show m7:
                        zoom 1.0 xalign -0.3 yalign 0.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    character "Что с этим делать?"
                    tmrz "У тебя есть спички? "
                    "[player_name] покопался в кармане и нашел коробку спичек."
                    tmrz "Быстро поджигай!"
                    "Руки тряслись от напряжения и быстроты действий, [player_name] поджег полынь и направил в сторону русалки, которая, недовольно шипя, пыталась напасть на ловко уворачивающегося от нее Тимирязева."
                    "Почувствовав запах, русалка резко замерла, перестав шипеть."
                    if rightornot == 0:
                        $ reality += 1
                        "Вы выбрали верно! Полынь помогает справиться со злыми духами. +1 Явь"
                    else:
                        "Вы выбрали верно! Полынь помогает справиться со злыми духами."
                    $ rightornot = 0
                    "Девушку снова окутал туман, она несколько раз попыталась лениво пошевелиться, но дым от полыни заставил ее окончательно сдаться. Когда туман рассеялся, призрак уже исчез."
                    hide m7 with dissolve
                    jump scene36
            label scene35_1_timeout_m:
                hide screen choice_timer
                show m7:
                    zoom 1.0 xalign -0.3 yalign 0.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                character "Да как она выглядит?! Тут полно синих цветов! Лаванда вообще синяя или сиреневая?!"
                "[player_name] быстро сорвал цветок похожий на лаванду и вернулся к Клименту Аркадьевичу."
                show t1:
                    zoom 1.0 xalign 1.3 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                tmrz "Что это? Мой друг, это не то!!!"
                show ghost_fish:
                    zoom 1.0 xalign 0.7 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                characterfish  "Вот вы и попались!!!!!!!!"
                if rightornot == 0:
                    $ ghost += 1
                    $ rightornot += 1
                    "Попробуйте еще раз! +1 Призрак"
                else:
                    "Попробуйте еще раз!"
                hide ghost_fish with dissolve
                hide t1 with dissolve
                hide m7 with dissolve
                jump scene35_0_m
        jump scene36
    elif gender == "G":
        "[player_name] стояла на Ново-Петергофском мосту и вглядывалась в канал. Пока было спокойно и даже ветер не создавал рябь на водной глади. Климент Аркадьевич оставил пока ее одну и стоял неподалеку, изучая растения, которые прорастали рядом с этим местом."
        "Появилось время подумать о том, что происходит, проанализировать то, что никак не поддавалось осмыслению."
        "Пропавшие библиотекари, призрачный квартал, безумное течение времени — не хотелось признавать, но все это было действительно реально. В голове возникали предательские мысли о том, что этот путь — большая ответственность."
        show g6:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "…"
        hide g6 with dissolve
        "[player_name] сомневалась, что справится. Конечно, ей хотелось помочь и вернуть все на места. Но нет никакой инструкции, как победить призраков."
        "Она дала себе обещание, что если все вернется на свои места, то она обязательно изучит судьбу тех, кто когда-то пребывал в Везенбергском квартале. Несмотря на все козни, что устраивали призраки, их было очень жаль."
        "История не должна забываться, иначе мы рискуем потерять что-то важное и начать ошибаться снова и снова, ничему так и не научившись."
        characterVois "Тебе не обязательно бороться с этим миром."
        show g7:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Снова этот голос!"
        characterVois "Ты же можешь остаться здесь…"
        hide g7 with dissolve
        show g2:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Ну уж нет! Спасибо. Не настолько я прониклась атмосферой."
        characterVois "Ты устала и совсем не понимаешь, где находишься. А между тем время бежит, и его осталось совсем мало. Тревога в твоем сердце нарастает все больше и больше, ты боишься, что тебе не удастся все разрешить."
        characterVois "Так, может быть, лучше начать привыкать ко всему, что тебя окружает? Так, на всякий случай…"
        hide g2 with dissolve
        show g1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Я надеюсь, что смогу…"
        characterVois "Ты совсем юна для такой тяжелой ноши. Как ты можешь бороться с силой, которая копилась на этой территории веками?"
        hide g1 with dissolve
        "Неизвестный голос проник в самые потаенные мысли. Он словно обволакивал сознание. [player_name] против воли стала прислушиваться к нему."
        characterVois "Подойди поближе, не бойся. Я помогу тебе справиться."
        "Ноги сами шагали вперед, ближе к ограде моста. Водная гладь гипнотизировала, ее хотелось коснуться."
        characterVois "Я буду твоим другом на этом пути."
        show g1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "У меня уже есть друг."
        characterVois "Климент Аркадьевич очень умный… и хитрый. Он же тоже призрак, откуда ты знаешь, что он дает тебе правильные советы, а не делает так, чтобы твой мир скорее превратился в старый квартал?"
        hide g1 with dissolve
        "[player_name] посмотрела на Тимирязева, который с увлечением делал какие-то заметки в записной книжке, рассматривая заинтересовавшее его растение."
        "[player_name] ведь на самом деле не может быть уверена, что Климент Аркадьевич на ее стороне. А с другой стороны, если не доверять никому, то как не сойти с ума в этом мире?"
        characterVois "Я расскажу тебе всю правду. От тебя скрыли все самое важное. Твои возможности!"
        show g5:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Возможности?"
        characterVois "Придет время, и призраки охватят весь мир, это сейчас мы проживаем только в квартале. Скоро туман охватит город и будет распространяться дальше. Если ты будешь с нами — сможешь возглавить нас. Получишь безграничную власть…"
        "Голос играл на струнках потаенных желаний. Всегда хотелось стать кем-то значимым, а тут предоставляется такой шанс. Призраки так или иначе завоюют мир, выбор только такой — сражаться и проиграть или присоединиться и возглавить."
        "Растворяясь в грезах, [player_name] тянулась к воде…"
        hide g5 with dissolve
        show g6:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Может… лучше сдаться?"
        characterVois "Конечно. Сразу можно будет расслабиться, тяжкое бремя спадет с плеч. В конце концов, это так несправедливо, что, не спросив, они втянули тебя в эту пугающую игру. Я обниму тебя и успокою. Мы вместе придумаем, что делать дальше…"
        hide g6 with dissolve
        stop music fadeout 2.0
        play music office fadein 2.0 loop if_changed
        "[player_name] почти забралась на ограду, чтобы прыгнуть вниз, в воду, как внезапно ее схватили за руку."
        show t1:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Мой друг! Что ты делаешь!"
        "[player_name] очнулась от гипноза и удивленно посмотрела по сторонам."
        show g7:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Что происходит?"
        tmrz "Я, кажется, понял!"
        tmrz "Выходи!!!"
        "[player_name] замерла в ожидании. Голос пропал, и никто не спешил показываться. Но Климент Аркадьевич стоял на своем."
        tmrz "А ну выйди, покажись!"
        "Туман стелился по Обводному каналу, становился плотнее. Внезапно клубы поднялись до самого моста, и в самой гуще показался силуэт. Из тумана на мост вышла русалка."
        show ghost_fish:
            zoom 1.0 xalign 0.7 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        characterfish "Хитрый вредный ученый! Почти ведь заманила к себе. Надо же было тебе влезть!"
        tmrz "Еще чего!"
        characterfish "Ну, теперь вы оба уйдете со мной под воду!!!"
        "Русалка направилась на чужаков."
        tmrz "[player_name]! Там, рядом с мостом, небольшой зеленый участок! Ты должна найти правильное растение, чтобы справиться с русалкой! Вспомни то, о чем мы говорили в библиотеке! Беги скорее, я ее задержу!"
        "[player_name] немедленно побежала искать."
        hide ghost_fish with dissolve
        hide g7 with dissolve
        hide t1 with dissolve
        label scene35_0_g:
            $ return_label = "scene35_1_timeout_g"  # Куда перейти при тайм-ауте
            show screen choice_timer(5)             # Таймер на 5 секунды
            menu:
                "Лаванда":
                    hide screen choice_timer
                    show g7:
                        zoom 1.0 xalign -0.3 yalign 0.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    character "Да как она выглядит?! Тут полно синих цветов! Лаванда вообще синяя или сиреневая?!"
                    "[player_name] быстро сорвала цветок, похожий на лаванду, и вернулась к Клименту Аркадьевичу."
                    show t1:
                        zoom 1.0 xalign 1.3 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    tmrz "Что это? Мой друг, это не то!!!"
                    show ghost_fish:
                        zoom 1.0 xalign 0.7 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    characterfish  "Вот вы и попались!!!!!!!!"
                    if rightornot == 0:
                        $ ghost += 1
                        $ rightornot += 1
                        "Попробуйте еще раз! +1 Призрак"
                    else:
                        "Попробуйте еще раз!"
                    hide ghost_fish with dissolve
                    hide t1 with dissolve
                    hide g7 with dissolve
                    jump scene35_0_g
                "Лавровый лист":
                    hide screen choice_timer
                    show g7:
                        zoom 1.0 xalign -0.3 yalign 0.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    character "Да как он выглядит?!"
                    "[player_name] быстро сорвала листы растения, похожие на лавр, и вернулась к Клименту Аркадьевичу."
                    show t1:
                        zoom 1.0 xalign 1.3 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    tmrz "Что это? Мой друг, это не то!!!"
                    show ghost_fish:
                        zoom 1.0 xalign 0.7 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    characterfish "Вот вы и попались!!!!!!!!"
                    if rightornot == 0:
                        $ ghost += 1
                        $ rightornot += 1
                        "Попробуйте еще раз! +1 Призрак"
                    else:
                        "Попробуйте еще раз!"
                    hide ghost_fish with dissolve
                    hide t1 with dissolve
                    hide g7 with dissolve
                    jump scene35_0_g
                "Полынь":
                    hide screen choice_timer
                    show g5:
                        zoom 1.0 xalign -0.3 yalign 0.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    character "У полыни специфический запах! Вроде бы это похоже на нее."
                    "[player_name] быстро сорвала растение, похожее на полынь, и вернулась к Клименту Аркадьевичу."
                    hide g5 with dissolve
                    show g7:
                        zoom 1.0 xalign -0.3 yalign 0.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    character "Что с этим делать?"
                    tmrz "У тебя есть спички? "
                    "[player_name] покопалась в кармане и нашла коробку спичек."
                    tmrz "Быстро поджигай!"
                    "Руки тряслись от напряжения и быстроты действий, [player_name] подожгла полынь и направила в сторону русалки, которая, недовольно шипя, пыталась напасть на ловко уворачивающегося от нее Тимирязева."
                    "Почувствовав запах, русалка резко замерла, перестав шипеть."
                    if rightornot == 0:
                        $ reality += 1
                        "Вы выбрали верно! Полынь помогает справиться со злыми духами. +1 Явь"
                    else:
                        "Вы выбрали верно! Полынь помогает справиться со злыми духами."
                    $ rightornot = 0
                    "Девушку снова окутал туман, она несколько раз попыталась лениво пошевелиться, но дым от полыни заставил ее окончательно сдаться. Когда туман рассеялся, призрак уже исчез."
                    hide g7 with dissolve
                    jump scene36
            label scene35_1_timeout_g:
                hide screen choice_timer
                show g7:
                    zoom 1.0 xalign -0.3 yalign 0.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                character "Да как она выглядит?! Тут полно синих цветов! Лаванда вообще синяя или сиреневая?!"
                "[player_name] быстро сорвала цветок похожий на лаванду и вернулась к Клименту Аркадьевичу."
                show t1:
                    zoom 1.0 xalign 1.3 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                tmrz "Что это? Мой друг, это не то!!!"
                show ghost_fish:
                    zoom 1.0 xalign 0.7 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                characterfish  "Вот вы и попались!!!!!!!!"
                if rightornot == 0:
                    $ ghost += 1
                    $ rightornot += 1
                    "Попробуйте еще раз! +1 Призрак"
                else:
                    "Попробуйте еще раз!"
                hide ghost_fish with dissolve
                hide t1 with dissolve
                hide g7 with dissolve
                jump scene35_0_g
        jump scene36

label scene36:
    scene 2back10 with fade:
        size (1280, 720)
        fit "fill"
    stop music fadeout 2.0
    play music mermaiddone fadein 2.0 loop if_changed
    if gender == "M":
        "Ненадолго Обводный канал словно опять приобрел краски, а призрачный сумрак затих."
        show m2:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Что это было?"
        "Тимирязев недовольно отряхивал костюм."
        show t1:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Есть два типа призраков. Одни — реально существовавшие когда-то люди, а другие — существа из городских легенд. Так вот, последние — самые опасные!"
        hide m2 with dissolve
        show m5:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Почему?"
        tmrz "Никогда не знаешь, какими свойствами их наделят люди. Повезло, что это просто русалка. А вот встретился бы нам кто-то более ловкий, кто знает, чем бы закончилось это противостояние."
        hide m5 with dissolve
        show m1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "А что за легенда о русалке?"
        tmrz "А легенда и не совсем про нее."
        hide m1 with dissolve
        hide t1 with dissolve
        scene 2back8 with fade:
            size (1280, 720)
            fit "fill"
        show t2:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "По преданию, еще задолго до того, как проложили Обводный канал, в 1300 году на этих территориях находились поселения. Сюда прибыли шведы, которые пытались искоренить языческую веру среди местного населения. Они разрушали святилища и казнили всех, кто был непокорен."
        show ghost_magic:
            zoom 1.0 xalign 0.2 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        charactermagic "Будьте вы прокляты!"
        tmrz "Колдун наслал на шведские войска страшные проклятия. В их рядах появились раздоры, ужасные болезни, которые приводили к гибели. Среди людей поселился страх."
        tmrz "Один из местных смилостивился над сходящими с ума чужаками. И рассказал, как снять проклятие. Нужно было похоронить погибших вместе с колдуном и запечатать их захоронение круглой плитой с магическими письменами."
        hide ghost_magic with dissolve
        hide t2 with dissolve
        scene 2back9 with fade:
            size (1280, 720)
            fit "fill"
        show t2:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Так и поступили."
        hide t2 with dissolve
        show t1:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Проклятие не исчезло, но было остановлено на очень долгое время."
        hide t1 with dissolve
        scene 2back10 with fade:
            size (1280, 720)
            fit "fill"
        show m2:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Но это же было слишком давно."
        show t1:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "У этой истории есть продолжение. В 1923 году, когда вдоль Обводного канала прокладывали теплотрассу, захоронение снова было обнаружено. К сожалению, рабочие отнеслись к нему халатно, разбив плиту на части."
        hide t1 with dissolve
        show t2:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Заклинание, сдерживающее проклятие колдуна, было разрушено и снова вырвалось на свободу. И с тех пор Обводный канал притягивает к себе всех, кто решил по нему прогуляться. Как-то поймали одного из тех, кто прислушался к манящему голосу и упал в воду."
        tmrz "Товарища опросили, уточнили, почему он прыгнул в Обводный."
        character "И что же он ответил?"
        hide t2 with dissolve
        show t1:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "«Не знаю, что нашло. Русалки к себе позвали»."
        tmrz "С тех пор и говорят о колдуне и русалках, которые витают над водами Обводного канала."
        hide m2 with dissolve
        show m5:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Какая… пугающая легенда."
        tmrz "Будь осторожен. Призраки становятся сильнее, так как времени остается все меньше. Придется снова пройти через рынок, он уже успел поменяться, оказавшись в новой точке временной петли."
        "[player_name] посмотрел в сторону рынка."
        hide m5 with dissolve
        hide t1 with dissolve
        # кат - сцена
        scene 2back11 with fade:
            size (1280, 720)
            fit "fill"
        $ renpy.pause(delay=5.0, hard=True)
        scene 2back10 with fade:
            size (1280, 720)
            fit "fill"
        show m1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Да, больше нет палаток и лавочек… Выглядит современнее."
        show t1:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Нужно спешить, пока мы не попали в худший период его существования."
        character "Тогда вперед! Я уже хочу скорее расправиться со всеми этими призраками!"
        tmrz "Отличный настрой, мой друг!"
        hide t1 with dissolve
        hide m1 with dissolve
        jump scene37
    elif gender == "G":
        "Ненадолго Обводный канал словно опять приобрел краски, а призрачный сумрак затих."
        show g2:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Что это было?"
        "Тимирязев недовольно отряхивал костюм."
        show t1:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Есть два типа призраков. Одни — реально существовавшие когда-то люди, а другие — существа из городских легенд. Так вот, последние — самые опасные!"
        hide g2 with dissolve
        show g5:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Почему?"
        tmrz "Никогда не знаешь, какими свойствами их наделят люди. Повезло, что это просто русалка. А вот встретился бы нам кто-то более ловкий, кто знает, чем бы закончилось это противостояние."
        hide g5 with dissolve
        show g1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "А что за легенда о русалке?"
        tmrz "А легенда и не совсем про нее."
        hide g1 with dissolve
        hide t1 with dissolve
        scene 2back8 with fade:
            size (1280, 720)
            fit "fill"
        show t2:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "По преданию, еще задолго до того, как проложили Обводный канал, в 1300 году на этих территориях находились поселения. Сюда прибыли шведы, которые пытались искоренить языческую веру среди местного населения. Они разрушали святилища и казнили всех, кто был непокорен."
        show ghost_magic:
            zoom 1.0 xalign 0.2 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        charactermagic "Будьте вы прокляты!"
        tmrz "Колдун наслал на шведские войска страшные проклятия. В их рядах появились раздоры, ужасные болезни, которые приводили к гибели. Среди людей поселился страх."
        tmrz "Один из местных смилостивился над сходящими с ума чужаками. И рассказал, как снять проклятие. Нужно было похоронить погибших вместе с колдуном и запечатать их захоронение круглой плитой с магическими письменами."
        hide ghost_magic with dissolve
        hide t2 with dissolve
        scene 2back9 with fade:
            size (1280, 720)
            fit "fill"
        show t2:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Так и поступили."
        hide t2 with dissolve
        show t1:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Проклятие не исчезло, но было остановлено на очень долгое время."
        hide t1 with dissolve
        scene 2back10 with fade:
            size (1280, 720)
            fit "fill"
        show g2:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Но это же было слишком давно."
        show t1:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "У этой истории есть продолжение. В 1923 году, когда вдоль Обводного канала прокладывали теплотрассу, захоронение снова было обнаружено. К сожалению, рабочие отнеслись к нему халатно, разбив плиту на части."
        hide t1 with dissolve
        show t2:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Заклинание, сдерживающее проклятие колдуна, было разрушено и снова вырвалось на свободу. И с тех пор Обводный канал притягивает к себе всех, кто решил по нему прогуляться. Как-то поймали одного из тех, кто прислушался к манящему голосу и упал в воду."
        tmrz "Товарища опросили, уточнили, почему он прыгнул в Обводный."
        character "И что же он ответил?"
        hide t2 with dissolve
        show t1:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "«Не знаю, что нашло. Русалки к себе позвали»."
        tmrz "С тех пор и говорят о колдуне и русалках, которые витают над водами Обводного канала."
        hide g2 with dissolve
        show g5:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Какая… пугающая легенда."
        tmrz "Будь осторожна. Призраки становятся сильнее, так как времени остается все меньше. Придется снова пройти через рынок, он уже успел поменяться, оказавшись в новой точке временной петли."
        "[player_name] посмотрела в сторону рынка."
        hide g5 with dissolve
        hide t1 with dissolve
        # кат - сцена
        scene 2back11 with fade:
            size (1280, 720)
            fit "fill"
        $ renpy.pause(delay=5.0, hard=True)
        scene 2back10 with fade:
            size (1280, 720)
            fit "fill"
        show g1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Да, больше нет палаток и лавочек… Выглядит современнее."
        show t1:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Нужно спешить, пока мы не попали в худший период его существования."
        character "Тогда вперед! Я уже хочу скорее расправиться со всеми этими призраками!"
        tmrz "Отличный настрой, мой друг!"
        hide t1 with dissolve
        hide g1 with dissolve
        jump scene37

