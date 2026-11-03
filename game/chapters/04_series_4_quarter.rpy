# 04_series_4_quarter.rpy
# Сгенерировано из оригинального script.rpy; текст сюжета сохранён.

label scene37:
    window hide
    with None
    # кат - сцена
    scene seria4 with fade:
        size (1280, 720)
        fit "fill"
    $ renpy.pause(delay=6.0, hard=True)
    scene 3back1 with fade:
        size (1280, 720)
        fit "fill"
    stop music fadeout 2.0
    play music calmness fadein 2.0 loop if_changed
    if gender == "M":
        "Снова вокруг Обводного собирался туман. Словно и не было этих ярких красок заката после победы над русалкой."
        "Чем ближе [player_name] и Климент Аркадьевич подходили к рынку, тем сильнее их окутывал густой и безжалостный морок."
        "С разных сторон раздавались голоса.  Сложно было понять, о чем идет речь, но где-то словно кто-то плакал и звал на помощь, где-то кто-то  очень злобно ругался. К голосам добавлялись тени, которые мелькали то тут, то там."
        "В какой-то момент все заволокло туманом так, что казалось, будто путники потерялись. Однако вскоре [player_name] смог увидеть перед собой то, что осталось от рынка."
        scene 3back2 with fade:
            size (1280, 720)
            fit "fill"
        "Строение было разрушено, и кое-где вокруг обломков росла крапива и колючка. Новенький рынок сменился развалинами."
        show m1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Мы же не так долго шли…  Прошло всего лишь около пяти минут, как мы видели крытые, вполне ухоженные постройки. Как такое возможно?"
        show t2:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Время…"
        character "Знаю-знаю! Время здесь течет нелинейно и быстро."
        "На самом деле, быстро меняющиеся эпохи пугали даже больше, чем местные призраки."
        hide t2 with dissolve
        show t1:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Не щетинься, как кактус. Пора бы уже принять действительность."
        hide m1 with dissolve
        show m6:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Принять-то я принял, но я даже не успеваю понять, в какой временной промежуток, эпоху попадаю."
        tmrz "Это не важно, мой друг, у нас есть проблемы серьезнее."
        hide m6 with dissolve
        show m1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "А?"
        "Проследив за взглядом Тимирязева, [player_name] обернулся назад."
        show ghost_piyanica:
            zoom 1.0 xalign 0.7 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        characterpiyanica "..."
        hide t1 with dissolve
        show t2:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Если справишься, расскажу тебе про полезные свойства крапивы!"
        hide m1 with dissolve
        show m2:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Ну, спасибо! Ради этого стоит бороться! Вы бы могли стать отличным спортивным тренером с такими мотивациями!"
        hide t2 with dissolve
        show t1:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Сосредоточься!"
        stop music fadeout 2.0
        play music ghostWorld fadein 2.0 loop if_changed
        "Призрак выглядел не так пугающе, как те, что [player_name] встречал раньше. Однако от него исходила странная дымка, которая превращалась в щупальца."
        "Пьяница выглядел неустойчивым, покачивался из стороны в сторону, а его костюм был испачкан в грязи. Не было похоже на то, что он собирался нападать первым."
        hide m2 with dissolve
        show m1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Может быть, он нас просто пропустит?"
        tmrz "Даже если и так, возможно, мы упустим что-то важное…"
        hide m1 with dissolve
        show m5:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Нам все равно нужно спешить."
        tmrz "Решать тебе…"
        hide m5 with dissolve
        show m1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Я…"
        hide m1 with dissolve
        hide t1 with dissolve
        hide ghost_piyanica with dissolve
        menu:
            "Предлагаю обойти призрака и не связываться с ним":
                "+ Призрак"
                $ ghost += 1
                show m1:
                    zoom 1.0 xalign -0.3 yalign 0.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                character "Я все же обойду его…"
                show t1:
                    zoom 1.0 xalign 1.3 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                tmrz "Дело твое."
                "+ Призрак. Вы не стали сражаться с призраком, это будет иметь последствия."
                $ ghost += 1
                hide t1 with dissolve
                hide m1 with dissolve
                "Осторожно, стараясь не привлекать внимания, [player_name] держался ближе к зарослям, которые позволяли оставаться незамеченным."
                "Хотя такой меры безопасности было более чем достаточно, ведь призрак был слишком пьян, чтобы заметить [player_name]."
                "[player_name] остановился посреди улицы Лейхтенбергской и с ужасом осознал, что не знает, куда идти дальше, ведь подсказки у него нет."
                if reality > 0:
                    $ reality -= 1
                    "Благодаря прошлому выбору вы упустили кусочек мозаики и не знаете, куда стоит идти дальше.  – Явь"
                else:
                    "Благодаря прошлому выбору вы упустили кусочек мозаики и не знаете, куда стоит идти дальше."
                show t2:
                    zoom 1.0 xalign 1.3 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                tmrz "Зря, мой друг, ты испугался, мы потеряли важную подсказку. Я попробую тебе помочь сам, но в качестве аванса. Если пообещаешь, что больше не струсишь."
                show m6:
                    zoom 1.0 xalign -0.3 yalign 0.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                character "Обещаю, Климент Аркадьевич."
                "В следующем выборе вы можете выбрать любую локацию, неправильного варианта нет."
                hide m6 with dissolve
                hide t2 with dissolve
                label scene37_2_m_1:
                    menu:
                        tmrz "Предлагаю отправиться…"
                        "К заводу «Красный треугольник»" if scenered == 0:
                            jump scene_red
                        "В дом владельца плитного завода Ивана Карловича Бредаля" if scenehuse == 0:
                            jump scene_huse
            "Попробую узнать, что ему нужно":
                $ attack += 1
                $ reality += 1
                "+Явь"
                show m5:
                    zoom 1.0 xalign -0.3 yalign 0.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                character "Я уже понял, что бежать от проблемы — это не решение."
                hide m5 with dissolve
                show m1:
                    zoom 1.0 xalign -0.3 yalign 0.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                character "Кто ты и что ты хочешь, призрак?"
                "Мрачная фигура шелохнулась. Пьяница глуповато улыбнулся в ответ."
                show ghost_piyanica:
                    zoom 1.0 xalign 0.7 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                characterpiyanica  "Добро пожаловать в Везенбергский квартал…  Эх, рыночек-рыночек… Здесь, я помню… Ох… Раньше-то как жил, как мечтал. А теперь — только тени и тоска."
                "[player_name] ничего не понимал в сбивчивой речи этого призрака."
                character "Так… попробую к этому диалогу подойти конкретнее. У тебя есть книга из библиотеки? Ты вернешь мне ее?"
                characterpiyanica "Кто ты, нарушитель моего покоя? А ну пошел вон!"
                hide m1 with dissolve
                show m2:
                    zoom 1.0 xalign -0.3 yalign 0.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                character "Я ищу выход из этого мира. Я не хотел тебя беспокоить…"
                "Что-то подсказывало, что диалог совсем не клеился, и [player_name] даже пожалел, что решил поговорить с этим чудаком. Но назад уже дороги не было."
                characterpiyanica "Я ищу выход… Звучит как какая-то песня."
                character "Ты либо помоги, либо пропусти. Я пойду дальше."
                characterpiyanica "Этот рынок был моим царством, здесь моя боль и моя сила... Ты хочешь пройти — борись со мной!"
                "Не дождавшись ответа, пьяница встал в нелепую боевую стойку. Пошатываясь, он направился вперед."
                hide m2 with dissolve
                hide ghost_piyanica with dissolve
                label scene37_0_m:
                    $ return_label = "scene37_0_timeout_m"  # Куда перейти при тайм-ауте
                    show screen choice_timer(5)             # Таймер на 5 секунды
                    menu:
                        "Замах бутылкой"
                        "Замереть":
                            hide screen choice_timer
                            "Призрак замахнулся бутылкой, но его положение было на столько неустойчиво, что он упал вместе с ней вперед. [player_name] не успел среагировать, призрак свалился прямо на него."
                            if rightornot == 0:
                                $ ghost += 1
                                $ rightornot += 1
                                "+ Призрак, попробуйте еще раз."
                            else:
                                "Попробуйте еще раз."
                            jump scene37_0_m
                        "Присесть":
                            hide screen choice_timer
                            "Призрак замахнулся бутылкой, [player_name] присел, чтобы избежать столкновения, однако это только ухудшило ситуацию. Споткнувшись об него, призрак с грохотом упал сверху."
                            if rightornot == 0:
                                $ ghost += 1
                                $ rightornot += 1
                                "+ Призрак, попробуйте еще раз."
                            else:
                                "Попробуйте еще раз."
                            jump scene37_0_m
                        "Увернуться":
                            hide screen choice_timer
                            "[player_name] резко отошел в сторону и призрак пролетел мимо."
                            if rightornot == 0:
                                $ reality += 1
                                $ rightornot += 1
                                "+Явь!"
                            show ghost_piyanica:
                                zoom 1.0 xalign 0.7 yalign 1.0
                                alpha 0.0
                                easein 0.3 alpha 1.0
                            characterpiyanica "Ах ты!!! Хитер! Но я знаю технику карате!"
                            "Призрак двинулся вперед, но его все время уносило в сторону. Он попробовал замахнуться рукой справа."
                            $ rightornot = 0
                            hide ghost_piyanica with dissolve
                            jump scene37_1_m

                label scene37_0_timeout_m:
                    hide screen choice_timer
                    "Призрак замахнулся бутылкой, но его положение было на столько неустойчиво, что он упал вместе с ней вперед. [player_name] не успел среагировать, призрак свалился прямо на него."
                    if rightornot == 0:
                        $ ghost += 1
                        $ rightornot += 1
                        "+ Призрак, попробуйте еще раз."
                    else:
                        "Попробуйте еще раз."
                    jump scene37_0_m
                label scene37_1_m:
                    $ return_label = "scene37_1_timeout_m"  # Куда перейти при тайм-ауте
                    show screen choice_timer(5)             # Таймер на 5 секунды
                    menu:
                        "Уклониться вправо":
                            hide screen choice_timer
                            if rightornot == 0:
                                $ reality += 1
                                $ rightornot += 1
                                "[player_name] резко отошел в сторону, и призрак пролетел мимо. +Явь"
                            else:
                                "[player_name] резко отошел в сторону, и призрак пролетел мимо."
                            $ rightornot = 0
                            jump scene37_1_m_1
                        "Присесть":
                            hide screen choice_timer
                            "[player_name] присел, чтобы избежать столкновения, однако это только ухудшило ситуацию. Споткнувшись об него, призрак с грохотом упал сверху."
                            if rightornot == 0:
                                $ ghost += 1
                                $ rightornot += 1
                                "+ Призрак, попробуйте еще раз."
                            else:
                                "Попробуйте еще раз."
                            jump scene37_1_m
                        "Уклониться влево":
                            hide screen choice_timer
                            "[player_name] попал прямо на летящий в него кулак."
                            if rightornot == 0:
                                $ ghost += 1
                                $ rightornot += 1
                                "+ Призрак, попробуйте еще раз."
                            else:
                                "Попробуйте еще раз."
                            jump scene37_1_m
                label scene37_1_timeout_m:
                    hide screen choice_timer
                    "[player_name] присел, чтобы избежать столкновения, однако это только ухудшило ситуацию. Споткнувшись об него, призрак с грохотом упал сверху."
                    if rightornot == 0:
                        $ ghost += 1
                        $ rightornot += 1
                        "+ Призрак, попробуйте еще раз."
                    else:
                        "Попробуйте еще раз."
                    jump scene37_1_m
                label scene37_1_m_1:
                show ghost_piyanica:
                    zoom 1.0 xalign 0.7 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                characterpiyanica "Ну все! Ты меня достал!!!"
                "Едва ли не завалившись на спину, призрак попытался разбежаться, а затем, наклонившись и направив свою голову вперед, побежал."
                "В момент, когда столкновения уже практически невозможно было бы избежать,  [player_name] отошел в сторону."
                "Призрак пьяницы пронесся мимо, оставалось только проводить беднягу взглядом."
                "Не рассчитав своих сил, бедняга побежал к Обводному каналу, следом послышался всплеск. Издалека донесся голос призрака: «Ах ты хитрец»."
                hide ghost_piyanica with dissolve
                show t1:
                    zoom 1.0 xalign 1.3 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                tmrz "Молодец, мой друг. Славный бой."
                show m2:
                    zoom 1.0 xalign -0.3 yalign 0.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                character "Вы смеетесь, Климент Аркадьевич? Я ничего не делал, этот сумасшедший призрак все сделал сам."
                tmrz "Иногда отсутствие действия — это тоже действие. Не принижай своих заслуг. Лучше посмотри, что этот призрак обронил."
                character "И правда!"
                "В траве лежала небрежно брошенная книга."
                show promish with fade:
                    zoom 1.0 xalign 0 yalign 0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                $ book_promish += 1
                "Вы нашли новую книгу."
                hide promish with dissolve
                hide m2 with dissolve
                show m5:
                    zoom 1.0 xalign -0.3 yalign 0.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                character "Так… Промышленная архитектура. Здесь довольно много зданий, которые подойдут."
                tmrz "Давай посмотрим в карту."
                "Благодаря прошлым выборам ты сам отлично ориентируешься в Везенбергском квартале. + Явь"
                $ reality += 1
                hide m5 with dissolve
                show m1:
                    zoom 1.0 xalign -0.3 yalign 0.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                character "Так, можно отправиться на завод «Красный треугольник» или в дом владельца плитного завода."
                hide t1 with dissolve
                show t2:
                    zoom 1.0 xalign 1.3 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                tmrz "За твою смелость я сделаю тебе подсказку и лично от меня."
                "Далее вы можете выбрать любую локацию, неправильного варианта нет. Так как вы нашли подсказку, вы можете посетить все локации по очереди."
                hide m1 with dissolve
                hide t2 with dissolve
                label scene37_2_m_2:
                    menu:
                        tmrz "Предлагаю отправиться…"
                        "К заводу «Красный треугольник»" if scenered == 0:
                            jump scene_red
                        "В дом владельца плитного завода Ивана Карловича Бредаля" if scenehuse == 0:
                            jump scene_huse
                        "В филиал Обуховской больницы" if scenemedic == 0:
                            jump scene_medic
                        "В фотостудию Н. Ф. Агафонова" if scenepht == 0:
                            jump scene_pht
                        "Мы исследовали все, пора двигаться дальше" if sceneised == 0 and seria4vibr < 4:
                            jump scene_ised
        jump scene38
    elif gender == "G":
        "Снова вокруг Обводного собирался туман. Словно и не было этих ярких красок заката после победы над русалкой."
        "Чем ближе [player_name] и Климент Аркадьевич подходили к рынку, тем сильнее их окутывал густой и безжалостный морок."
        "С разных сторон раздавались голоса.  Сложно было понять, о чем идет речь, но где-то словно кто-то плакал и звал на помощь, где-то кто-то  очень злобно ругался. К голосам добавлялись тени, которые мелькали то тут, то там."
        "В какой-то момент все заволокло туманом так, что казалось, будто путники потерялись. Однако вскоре [player_name] смогла увидеть перед собой то, что осталось от рынка."
        scene 3back2 with fade:
            size (1280, 720)
            fit "fill"
        "Строение было разрушено, и кое-где вокруг обломков росла крапива и колючка. Новенький рынок сменился развалинами."
        show g1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Мы же не так долго шли…  Прошло всего лишь около пяти минут, как мы видели крытые, вполне ухоженные постройки. Как такое возможно?"
        show t2:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Время…"
        character "Знаю-знаю! Время здесь течет нелинейно и быстро."
        "На самом деле, быстро меняющиеся эпохи пугали даже больше, чем местные призраки."
        hide t2 with dissolve
        show t1:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Не щетинься, как кактус. Пора бы уже принять действительность."
        hide g1 with dissolve
        show g6:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Принять-то я приняла, но я даже не успеваю понять, в какой временной промежуток, эпоху попадаю."
        tmrz "Это не важно, мой друг, у нас есть проблемы серьезнее."
        hide g6 with dissolve
        show g1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "А?"
        "Проследив за взглядом Тимирязева, [player_name] обернулась назад."
        show ghost_piyanica:
            zoom 1.0 xalign 0.7 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        characterpiyanica "..."
        hide t1 with dissolve
        show t2:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Если справишься, расскажу тебе про полезные свойства крапивы!"
        hide g1 with dissolve
        show g2:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Ну, спасибо! Ради этого стоит бороться! Вы бы могли стать отличным спортивным тренером с такими мотивациями!"
        hide t2 with dissolve
        show t1:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Сосредоточься!"
        stop music fadeout 2.0
        play music ghostWorld fadein 2.0 loop if_changed
        "Призрак выглядел не так пугающе, как те, что [player_name] встречала раньше. Однако от него исходила странная дымка, которая превращалась в щупальца."
        "Пьяница выглядел неустойчивым, покачивался из стороны в сторону, а его костюм был испачкан в грязи. Не было похоже на то, что он собирался нападать первым."
        hide g2 with dissolve
        show g1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Может быть, он нас просто пропустит?"
        tmrz "Даже если и так, возможно, мы упустим что-то важное…"
        hide g1 with dissolve
        show g5:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Нам все равно нужно спешить."
        tmrz "Решать тебе…"
        hide g5 with dissolve
        show g1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Я…"
        hide g1 with dissolve
        hide t1 with dissolve
        hide ghost_piyanica with dissolve
        menu:
            "Предлагаю обойти призрака и не связываться с ним":
                "+ Призрак"
                $ ghost += 1
                show g1:
                    zoom 1.0 xalign -0.3 yalign 0.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                character "Я все же обойду его…"
                show t1:
                    zoom 1.0 xalign 1.3 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                tmrz "Дело твое."
                "+ Призрак. Вы не стали сражаться с призраком, это будет иметь последствия."
                $ ghost += 1
                hide t1 with dissolve
                hide g1 with dissolve
                "Осторожно, стараясь не привлекать внимания, [player_name] держалась ближе к зарослям, которые позволяли оставаться незамеченным."
                "Хотя такой меры безопасности было более чем достаточно, ведь призрак был слишком пьян, чтобы заметить [player_name]."
                "[player_name] остановилась посреди улицы Лейхтенбергской и с ужасом осознала, что не знает, куда идти дальше, ведь подсказки у нее нет."
                if reality > 0:
                    $ reality -= 1
                    "Благодаря прошлому выбору вы упустили кусочек мозаики и не знаете, куда стоит идти дальше.  – Явь"
                else:
                    "Благодаря прошлому выбору вы упустили кусочек мозаики и не знаете, куда стоит идти дальше."
                $ reality -= 1
                show t2:
                    zoom 1.0 xalign 1.3 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                tmrz "Зря, мой друг, ты испугалась, мы потеряли важную подсказку. Я попробую тебе помочь сам, но в качестве аванса. Если пообещаешь, что больше не струсишь."
                show g6:
                    zoom 1.0 xalign -0.3 yalign 0.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                character "Обещаю, Климент Аркадьевич."
                "В следующем выборе вы можете выбрать любую локацию, неправильного варианта нет."
                hide g6 with dissolve
                hide t2 with dissolve
                label scene37_2_g_1:
                    menu:
                        tmrz "Предлагаю отправиться…"
                        "К заводу «Красный треугольник»" if scenered == 0:
                            jump scene_red
                        "В дом владельца плитного завода Ивана Карловича Бредаля" if scenehuse == 0:
                            jump scene_huse
            "Попробую узнать, что ему нужно":
                $ attack += 1
                $ reality += 1
                "+Явь"
                show g5:
                    zoom 1.0 xalign -0.3 yalign 0.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                character "Я уже поняла, что бежать от проблемы — это не решение."
                hide g5 with dissolve
                show g1:
                    zoom 1.0 xalign -0.3 yalign 0.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                character "Кто ты и что ты хочешь, призрак?"
                "Мрачная фигура шелохнулась. Пьяница глуповато улыбнулся в ответ."
                show ghost_piyanica:
                    zoom 1.0 xalign 0.7 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                characterpiyanica  "Добро пожаловать в Везенбергский квартал…  Эх, рыночек-рыночек… Здесь, я помню… Ох… Раньше-то как жил, как мечтал. А теперь — только тени и тоска."
                "[player_name] ничего не понимала в сбивчивой речи этого призрака."
                character "Так… попробую к этому диалогу подойти конкретнее. У тебя есть книга из библиотеки? Ты вернешь мне ее?"
                characterpiyanica "Кто ты, нарушитель моего покоя? А ну пошла вон!"
                hide g1 with dissolve
                show g2:
                    zoom 1.0 xalign -0.3 yalign 0.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                character "Я ищу выход из этого мира. Я не хотела тебя беспокоить…"
                "Что-то подсказывало, что диалог совсем не клеился, и [player_name] даже пожалела, что решила поговорить с этим чудаком. Но назад уже дороги не было."
                characterpiyanica "Я ищу выход… Звучит как какая-то песня."
                character "Ты либо помоги, либо пропусти. Я пойду дальше."
                characterpiyanica "Этот рынок был моим царством, здесь моя боль и моя сила... Ты хочешь пройти — борись со мной!"
                "Не дождавшись ответа, пьяница встал в нелепую боевую стойку. Пошатываясь, он направился вперед."
                hide g2 with dissolve
                hide ghost_piyanica with dissolve
                label scene37_0_g:
                    $ return_label = "scene37_0_timeout_g"  # Куда перейти при тайм-ауте
                    show screen choice_timer(5)             # Таймер на 5 секунды
                    menu:
                        "Замах бутылкой"
                        "Замереть":
                            hide screen choice_timer
                            "Призрак замахнулся бутылкой, но его положение было настолько неустойчиво, что он упал вместе с ней вперед. [player_name] не успела среагировать, призрак свалился прямо на нее."
                            if rightornot == 0:
                                $ ghost += 1
                                $ rightornot += 1
                                "+ Призрак, попробуйте еще раз."
                            else:
                                "Попробуйте еще раз."
                            jump scene37_0_g
                        "Присесть":
                            hide screen choice_timer
                            "Призрак замахнулся бутылкой, [player_name] присела, чтобы избежать столкновения, однако это только ухудшило ситуацию. Споткнувшись об нее, призрак с грохотом упал сверху."
                            if rightornot == 0:
                                $ ghost += 1
                                $ rightornot += 1
                                "+ Призрак, попробуйте еще раз."
                            else:
                                "Попробуйте еще раз."
                            jump scene37_0_g
                        "Увернуться":
                            hide screen choice_timer
                            "[player_name] резко отошла в сторону, и призрак пролетел мимо."
                            if rightornot == 0:
                                $ reality += 1
                                $ rightornot += 1
                                "+Явь!"
                            show ghost_piyanica:
                                zoom 1.0 xalign 0.7 yalign 1.0
                                alpha 0.0
                                easein 0.3 alpha 1.0
                            characterpiyanica "Ах ты!!! Хитра! Но я знаю технику карате!"
                            "Призрак двинулся вперед, но его все время уносило в сторону. Он попробовал замахнуться рукой справа."
                            $ rightornot = 0
                            hide ghost_piyanica with dissolve
                            jump scene37_1_g

                label scene37_0_timeout_g:
                    hide screen choice_timer
                    "Призрак замахнулся бутылкой, но его положение было настолько неустойчиво, что он упал вместе с ней вперед. [player_name] не успела среагировать, призрак свалился прямо на нее."
                    if rightornot == 0:
                        $ ghost += 1
                        $ rightornot += 1
                        "+ Призрак, попробуйте еще раз."
                    else:
                        "Попробуйте еще раз."
                    jump scene37_0_g
                label scene37_1_g:
                    $ return_label = "scene37_1_timeout_g"  # Куда перейти при тайм-ауте
                    show screen choice_timer(5)             # Таймер на 5 секунды
                    menu:
                        "Уклониться вправо":
                            hide screen choice_timer
                            if rightornot == 0:
                                $ reality += 1
                                $ rightornot += 1
                                "[player_name] резко отошла в сторону, и призрак пролетел мимо. +Явь"
                            else:
                                "[player_name] резко отошла в сторону, и призрак пролетел мимо."
                            $ rightornot = 0
                            jump scene37_1_g_1
                        "Присесть":
                            hide screen choice_timer
                            "[player_name] присела, чтобы избежать столкновения, однако это только ухудшило ситуацию. Споткнувшись об нее, призрак с грохотом упал сверху."
                            if rightornot == 0:
                                $ ghost += 1
                                $ rightornot += 1
                                "+ Призрак, попробуйте еще раз."
                            else:
                                "Попробуйте еще раз."
                            jump scene37_1_g
                        "Уклониться влево":
                            hide screen choice_timer
                            "[player_name] попала прямо на летящий в нее кулак."
                            if rightornot == 0:
                                $ ghost += 1
                                $ rightornot += 1
                                "+ Призрак, попробуйте еще раз."
                            else:
                                "Попробуйте еще раз."
                            jump scene37_1_g
                label scene37_1_timeout_g:
                    hide screen choice_timer
                    "[player_name] присела, чтобы избежать столкновения, однако это только ухудшило ситуацию. Споткнувшись об нее, призрак с грохотом упал сверху."
                    if rightornot == 0:
                        $ ghost += 1
                        $ rightornot += 1
                        "+ Призрак, попробуйте еще раз."
                    else:
                        "Попробуйте еще раз."
                    jump scene37_1_g
                label scene37_1_g_1:
                show ghost_piyanica:
                    zoom 1.0 xalign 0.7 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                characterpiyanica "Ну все! Ты меня достала!!!"
                "Едва ли не завалившись на спину, призрак попытался разбежаться, а затем, наклонившись и направив свою голову вперед, побежал."
                "В момент, когда столкновения уже практически невозможно было бы избежать,  [player_name] отошла в сторону. "
                "Призрак пьяницы пронесся мимо, оставалось только проводить беднягу взглядом."
                "Не рассчитав своих сил, бедняга побежал к Обводному каналу, следом послышался всплеск. Издалека донесся голос призрака: «Ах ты хитрюга»."
                hide ghost_piyanica with dissolve
                show t1:
                    zoom 1.0 xalign 1.3 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                tmrz "Молодец, мой друг. Славный бой."
                show g2:
                    zoom 1.0 xalign -0.3 yalign 0.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                character "Вы смеетесь, Климент Аркадьевич? Я ничего не делала, этот сумасшедший призрак все сделал сам."
                tmrz "Иногда отсутствие действия — это тоже действие. Не принижай своих заслуг. Лучше посмотри, что этот призрак обронил."
                character "И правда!"
                "В траве лежала небрежно брошенная книга."
                show promish with fade:
                    zoom 1.0 xalign 0 yalign 0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                $ book_promish += 1
                "Вы нашли новую книгу."
                hide promish with dissolve
                hide g2 with dissolve
                show g5:
                    zoom 1.0 xalign -0.3 yalign 0.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                character "Так… Промышленная архитектура. Здесь довольно много зданий, которые подойдут."
                tmrz "Давай посмотрим в карту."
                "Благодаря прошлым выборам ты сама отлично ориентируешься в Везенбергском квартале. + Явь"
                $ reality += 1
                hide g5 with dissolve
                show g1:
                    zoom 1.0 xalign -0.3 yalign 0.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                character "Так, можно отправиться на завод «Красный треугольник» или в дом владельца плитного завода."
                hide t1 with dissolve
                show t2:
                    zoom 1.0 xalign 1.3 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                tmrz "За твою смелость я сделаю тебе подсказку и лично от меня."
                "Далее вы можете выбрать любую локацию, неправильного варианта нет. Так как вы нашли подсказку, вы можете посетить все локации по очереди."
                hide g1 with dissolve
                hide t2 with dissolve
                label scene37_2_g_2:
                    menu:
                        tmrz "Предлагаю отправиться…"
                        "К заводу «Красный треугольник»" if scenered == 0:
                            jump scene_red
                        "В дом владельца плитного завода Ивана Карловича Бредаля" if scenehuse == 0:
                            jump scene_huse
                        "В филиал Обуховской больницы" if scenemedic == 0:
                            jump scene_medic
                        "В фотостудию Н. Ф. Агафонова" if scenepht == 0:
                            jump scene_pht
                        "Мы исследовали все, пора двигаться дальше" if sceneised == 0 and seria4vibr < 4:
                            jump scene_ised
        jump scene38

label scene_red:
    $ seria4vibr += 1
    $ scenered += 1
    $ vstret_rab += 1
    scene 3back3 with fade:
        size (1280, 720)
        fit "fill"
    stop music fadeout 2.0
    play music factory fadein 2.0 loop if_changed
    if gender == "M":
        show t1:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Мой друг, что ты знаешь о заводе «Красный треугольник»?"
        if architect == 1:
            "Вы выбрали учиться на архитектора и расскажете про архитектуру «Красного треугольника»."
            show m2:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
            character "Большая часть исторических построек завода выполнена в характерном для промышленной архитектуры конца XIX — начала XX века стиле из неоштукатуренного красного кирпича."
            character "Это практически небольшой заводской город с внутренними улицами, трубами, металлическими лестницами, переходами."
            hide m2 with dissolve
        elif archaeologist == 1:
            "Вы выбрали учиться на археолога и расскажете про историю «Красного треугольника»."
            show m2:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
            character "Гамбургский предприниматель Фердинанд Краузкопф в середине XIX века успешно занимался продажей галош в Европе. Затем решил наладить производство резиновой обуви и в России."
            character "В 1859 году он и его компаньоны учредили «Товарищество российско-американской резиновой мануфактуры» и открыли «Фабрику галош и других резиновых и гуттаперчевых изделий в Санкт-Петербурге» на Обводном канале."
            hide m2 with dissolve
        elif journalist == 1:
            "Вы выбрали учиться на журналиста и расскажете про современную жизнь «Красного треугольника»."
            show m2:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
            character "Это самая знаменитая и масштабная заброшка нашего города. 3 февраля 2023 года 50 корпусов и 11 галерей комплекса были признаны объектами культурного наследия регионального значения."
            hide m2 with dissolve
        elif botanist == 1:
            "Вы выбрали учиться на ботаника и знаете о «Красном треугольнике» пока совсем немного. Но Тимирязев вам, как коллеге, расскажет несколько фактов о нем."
            show m2:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
            character "Знаю, что здесь производили резиновые галоши и шины."
            show t1:
                zoom 1.0 xalign 1.3 yalign 1.0
                alpha 0.0
                easein 0.3 alpha 1.0
            tmrz "Верно. Большая часть этих исторических построек завода выполнена из неоштукатуренного красного кирпича. Завод был очень масштабным с большим количеством корпусов."
            tmrz "Гамбургский предприниматель Фердинанд Краузкопф увидел большой потенциал для резиновой обуви на российском рынке и открыл завод, который изначально назывался просто «Треугольник», а после революции он стал красным."
            hide t1 with dissolve
            hide m2 with dissolve
        show m1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Что мы здесь ищем?"
        hide t1 with dissolve
        show t2:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Приключения, мой друг!"
        menu:
            character ""
            "Ну уж нет, ими я уже сыт по горло":
                "+ Призрак"
                $ ghost += 1
            "Что ж, надеюсь, мы найдем следующие подсказки!":
                "+ Явь"
                $ reality += 1
        hide t2 with dissolve
        hide m1 with dissolve
        scene 3back4 with fade:
            size (1280, 720)
            fit "fill"
        "На удивление, на заводе было шумно, словно рабочая жизнь никогда не уходила из этих мест. Вокруг было очень много женщин, увлеченно занимающихся своим делом."
        "Если бы фигуры этих людей не были прозрачными, нельзя было бы догадаться, что это призраки. С таким увлечением и энтузиазмом эти туманные фигуры были заняты своим ремеслом."
        show ghost_wrkshe:
            zoom 1.0 xalign 0.7 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        characterwrkshe "Эй вы! Что вы здесь делаете!"
        show m7:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "А я…"
        "[player_name] растерялся. Что говорить? «Я пришел вас побеждать, чтоб книжечки искать» — подойдет?"
        "Климент Аркадьевич, как назло, тоже молчал. Видимо, растерялся от напора этой женщины."
        characterwrkshe "А ну прочь, бездельники! Это закрытая территория! Нечего секреты производства разведывать!"
        characterVoiswrk "Галя! Да это ж путешественник во времени и Тимирязев. Они с призраками борются."
        "Галя тут же переменилась в лице, еще раз посмотрела на Тимирязева и схватилась за сердце."
        characterwrkshe "Батюшки! Климент Аркадьевич, не признала! Богатым будете."
        show t1:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Будет тебе, Галина. С каждым может случиться.  Лучше подскажи нам, не брал ли кто из ваших книги библиотечные? Не завалялись ли они тут?"
        characterwrkshe "Да что вы, Климент Аркадьевич. Нашим и читать-то некогда, но даже если б и взяли, то, как порядочные советские люди, вернули бы в срок. Хулиганов среди нас нет."
        tmrz "Неужели мы ошиблись и здесь нам делать нечего…"
        "[player_name] задумался. Похоже, Галина не знала, что она и сама призрак, и все ее подруги-работницы. Все выглядело так, словно бы их невольно оторвали от работы."
        hide m7 with dissolve
        show m1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "А есть ли у вас легенды о каких-нибудь призраках?"
        "Галина словно помрачнела, и ее и так грозный вид стал еще более суровым."
        characterwrkshe "Да есть тут один… Ходит-бродит, людей пугает."
        tmrz "Галенька, дорогая наша орхидея в этом темном призрачном царстве, будьте так добры, подскажите, как его найти."
        "Галя слегка засмущалась, на секунду даже растеряв свою строгость. Но затем взяла себя в руки."
        characterwrkshe "А его и не надо искать специально. Нужно взять галошу и протереть ее тряпочкой до скрипа. Этот призрак жутко не любит этот звук. Сам на вас выйдет. Только разбирайтесь с ним сами. Я же пойду работать."
        "Тимирязев и [player_name] быстро поблагодарили Галину и подошли к стеллажу с галошами."
        hide m1 with dissolve
        show m5:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Какую выбрать…"
        hide m5 with dissolve
        hide t1 with dissolve
        hide ghost_wrkshe with dissolve
        label scene_red_0_m:
            menu:
                "Синюю":
                    "Неверно, попробуйте еще раз."
                    $ rightornot += 1
                    jump scene_red_0_m
                "Зеленую":
                    "Неверно, попробуйте еще раз."
                    $ rightornot += 1
                    jump scene_red_0_m
                "Черную с красной подкладкой":
                    if rightornot == 0:
                        $ reality += 1
                        $ rightornot += 1
                        "Верно. + Явь "
                    else:
                        "Верно."
                    $ rightornot = 0
        show m2:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Именно такими галошами известен «Красный треугольник»."
        "Взяв на столе тряпку, [player_name] стал протирать до блеска галошу."
        stop music fadeout 2.0
        play music office fadein 2.0 loop if_changed
        show ghost_wrker:
            zoom 1.0 xalign 0.7 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        characterwrker  "ОПЯТЬ ЭТОТ МЕРЗКИЙ ЗВУК! Ненавижу эту резину! И так все пропахло ей! Я сам весь пропах этой резиной! Неужели нельзя хотя бы соблюдать тишину!"
        hide m2 with dissolve
        show m7:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "…"
        hide m7 with dissolve
        show m2:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "А чужие книжки воровать, значит, хорошо? Никто никому бы не мешал, если бы вы не пытались уничтожить мой мир!"
        character "Я бы сейчас пошел бы домой, заварил бы чай, включил бы кино и отдыхал бы. А я тут вас отлавливаю то в Российской империи, то в Советском Союзе, то в языческих племенах. Оно мне надо?"
        "Призрак удивленно замер и прислушался."
        character "Я просто книжку хотел сдать! А ну хватит меня запугивать!"
        "Призрак испуганно попятился назад. Климент Аркадьевич с удивлением смотрел за разворачивающимся действом."
        hide m2 with dissolve
        hide ghost_wrker with dissolve
        label scene_red_1_m:
            menu:
                character "Ты даже…"
                "Не мог здесь работать":
                    if rightornot == 0:
                        $ reality += 1
                        $ rightornot += 1
                        "Верный вариант. + Явь "
                    else:
                        "Верный вариант."
                    $ rightornot = 0
                "В дурацкой шляпе":
                    if rightornot == 0:
                        $ ghost += 1
                        $ rightornot += 1
                        "Неверный вариант. + Призрак "
                    else:
                        "Неверный вариант."
                    show t1:
                        zoom 1.0 xalign 1.3 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    tmrz "Зачем ты его так оскорбляешь?"
                    show m6:
                        zoom 1.0 xalign -0.3 yalign 0.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    character "Простите. Видимо, это усталость."
                    "Попробуйте еще раз."
                    hide m6 with dissolve
                    hide t1 with dissolve
                    jump scene_red_1_m
                "Не гражданин":
                    show m6:
                        zoom 1.0 xalign -0.3 yalign 0.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    character "Что за бред? О чем я?"
                    if rightornot == 0:
                        $ ghost += 1
                        $ rightornot += 1
                        "Неверный вариант. + Призрак "
                    else:
                        "Неверный вариант."
                    "Попробуйте еще раз."
                    hide m6 with dissolve
                    jump scene_red_1_m
        show m2:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "На заводе использовали в основном женский труд, откуда здесь взялся рабочий? Кто ты такой?!"
        hide m2 with dissolve
        stop music fadeout 2.0
        play music factory fadein 2.0 loop if_changed
        show m2:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Что за пила у тебя в руках? Что ты вообще собрался здесь пилить? Галоши?!"
        show ghost_wrker:
            zoom 1.0 xalign 0.7 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        characterwrker "Да с чего ты вообще на меня так нападаешь? Я еще ничего плохого тебе не сделал!"
        hide m2 with dissolve
        show m1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Знаю я вас!"
        "Тимирязев добродушно усмехнулся."
        show t1:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Смотрю, мой друг, ты уже осваиваешься среди призраков.  Уже опережаешь их действия."
        character "Я быстро учусь."
        hide m1 with dissolve
        if seria4vibr > 1 and book_rest > 0:
            show m2:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
            character "Тогда просто дайте нам пройти, а сами ступайте по своим делам."
            "Было сложно понять, какие эмоции испытывает призрак, но казалось, что он слегка обескуражен и сконфужен."
            characterwrker "Я не могу просто так вас отпустить. Меня все призраки квартала засмеют. Сначала ты должен угадать: Я действительно здесь существовал или я часть легенды, придуманной людьми."
            character "Опять загадки…"
            character "Я думаю, что…"
            hide m2
            hide t1
            hide ghost_wrker
            with dissolve
            menu:
                "Ты действительно был когда-то на «Красном треугольнике»":
                    $ ghost += 1
                    "+Призрак"
                    show ghost_wrker:
                        zoom 1.0 xalign 0.7 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    characterwrker "А вот и нет! Не заслужил ты книгу, уж извини!"
                    "Вам стоит доверять себе и своим наблюдениям!"
                    hide ghost_wrker with dissolve
                "Легенду о тебе придумали люди":
                    show m1:
                        zoom 1.0 xalign -0.3 yalign 0.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    character "Слишком многое не сходится… Я думаю, что ты не отсюда."
                    show ghost_wrker:
                        zoom 1.0 xalign 0.7 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    characterwrker "Что ж…"
                    characterwrker "Видимо, тебя не так просто обмануть."
                    $ reality += 1
                    "+Явь"
        elif seria4vibr == 1 and book_rest == 0:
            show m2:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
            character "А теперь просто отдай нам с Климентом Аркадьевичем книгу и ступай по своим делам."
            "Было сложно понять, какие эмоции испытывает призрак, но казалось, что он слегка обескуражен и сконфужен."
            characterwrker "Я не могу просто так вам подарить книгу. Меня все призраки квартала засмеют. Сначала ты должен угадать: я действительно существовал здесь или я часть легенды, придуманной людьми."
            character "Опять загадки…"
            character "Я думаю, что…"
            hide m2
            hide t1
            hide ghost_wrker
            with dissolve
            menu:
                "Ты действительно был когда-то на «Красном треугольнике»":
                    $ ghost += 1
                    "+Призрак"
                    show ghost_wrker:
                        zoom 1.0 xalign 0.7 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    characterwrker "А вот и нет! Не заслужил ты книгу, уж извини!"
                    "Вам стоит доверять себе и своим наблюдениям!"
                    hide ghost_wrker with dissolve
                "Легенду о тебе придумали люди":
                    show m1:
                        zoom 1.0 xalign -0.3 yalign 0.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    character "Слишком многое не сходится… Я думаю, что ты не отсюда."
                    show ghost_wrker:
                        zoom 1.0 xalign 0.7 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    characterwrker "Что ж…"
                    characterwrker "Видимо, тебя не так просто обмануть."
                    $ reality += 1
                    "+Явь"
                    $ book_rest += 1
                    $ reality += 1
                    hide ghost_wrker with dissolve
                    show rest with fade:
                        zoom 1.0 xalign 0 yalign 0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    $ sceneredbook += 1
                    "Вы нашли еще одну книгу! +Явь"
        hide rest
        hide m1
        with dissolve
        show ghost_wrker:
            zoom 1.0 xalign 0.7 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        "Призрака окутал туман, и [player_name] приготовился к нападению. Однако, когда дымка рассеялась, рабочий изменился."
        hide ghost_wrker with dissolve
        show ghost_wrkhe:
            zoom 1.0 xalign 0.7 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        characterwrkhe "Знаешь, уже долгое время я здесь пугаю ребятишек, которые залезают в заброшенные корпуса, чтобы неповадно было сюда заходить."
        characterwrkhe "Я вообще не злой на самом деле. Меня родители сорванцов придумали, чтобы их пугать и они меньше ходили по заброшенным зданиям."
        characterwrkhe "Правда, эффект это имело обратный. Всем детям еще больше хотелось на призрака посмотреть."
        "[player_name] почувствовал себя неловко.  Призрак оказался совсем незлой, даже в некоторой степени благородный.  Не стоило на него так нападать."
        show m6:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Прости, что был слишком резким."
        characterwrkhe "Я не могу тебя осуждать. Тебе со многим пришлось здесь столкнуться."
        if scenehuse == 0:
            characterwrkhe "Я не только не злюсь, но и предлагаю помощь."
            character "Какую?"
            characterwrkhe "Узнаешь позже…"
            hide ghost_wrkhe with dissolve
            "С этими словами призрак растворился."
        elif scenehuse == 1:
            characterwrkhe "Я не только не злюсь, но и дам совет."
            character "Какой?"
            characterwrkhe "Не бойся вступить в борьбу с собой."
            hide ghost_wrkhe
            "С этими словами призрак растворился."
            character "Что бы это значило?"
            show t1:
                zoom 1.0 xalign 1.3 yalign 1.0
                alpha 0.0
                easein 0.3 alpha 1.0
            tmrz "Думаю, поймешь позже, когда придет время. А сейчас, нам нужно идти дальше."
            hide t1
            hide m6
            with dissolve
            if attack == 1:
                jump scene37_2_m_2
            else:
                jump scene37_2_m_1
            jump scene38
        hide m6 with dissolve
        show m2:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "И все же… Они со своими фокусами и тайнами жутко раздражают…"
        hide m2 with dissolve
        if attack == 1:
            jump scene37_2_m_2
        else:
            jump scene37_2_m_1
        jump scene38
    elif gender == "G":
        show t1:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Мой друг, что ты знаешь о заводе «Красный треугольник»?"
        if architect == 1:
            "Вы выбрали учиться на архитектора и расскажете про архитектуру «Красного треугольника»."
            show g2:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
            character "Большая часть исторических построек завода выполнена в характерном для промышленной архитектуры конца XIX — начала XX века стиле из неоштукатуренного красного кирпича."
            character "Это практически небольшой заводской город с внутренними улицами, трубами, металлическими лестницами, переходами."
            hide g2 with dissolve
        elif archaeologist == 1:
            "Вы выбрали учиться на археолога и расскажете про историю «Красного треугольника»."
            show g2:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
            character "Гамбургский предприниматель Фердинанд Краузкопф в середине XIX века  успешно занимался продажей галош в Европе. Затем решил наладить производство резиновой обуви и в России."
            character "В 1859 году он и его компаньоны учредили «Товарищество российско-американской резиновой мануфактуры» и открыли «Фабрику галош и других резиновых и гуттаперчевых изделий в Санкт-Петербурге» на Обводном канале."
            hide g2 with dissolve
        elif journalist == 1:
            "Вы выбрали учиться на журналиста и расскажете про современную жизнь «Красного треугольника»."
            show g2:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
            character "Это самая знаменитая и масштабная заброшка нашего города. 3 февраля 2023 года 50 корпусов и 11 галерей комплекса были признаны объектами культурного наследия регионального значения."
            hide g2 with dissolve
        elif botanist == 1:
            "Вы выбрали учиться на ботаника и знаете о «Красном треугольнике» пока совсем немного. Но Тимирязев вам, как коллеге, расскажет несколько фактов о нем."
            show g2:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
            character "Знаю, что здесь производили резиновые галоши и шины."
            show t1:
                zoom 1.0 xalign 1.3 yalign 1.0
                alpha 0.0
                easein 0.3 alpha 1.0
            tmrz "Верно. Большая часть этих исторических построек завода выполнена из неоштукатуренного красного кирпича. Завод был очень масштабным с большим количеством корпусов."
            tmrz "Гамбургский предприниматель Фердинанд Краузкопф увидел большой потенциал для резиновой обуви на российском рынке и открыл завод, который изначально назывался просто «Треугольник», а после революции он стал красным."
            hide t1 with dissolve
            hide g2 with dissolve
        show g1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Что мы здесь ищем?"
        hide t1 with dissolve
        show t2:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Приключения, мой друг!"
        menu:
            character ""
            "Ну уж нет, ими я уже сыта по горло":
                "+ Призрак"
                $ ghost += 1
            "Что ж, надеюсь, мы найдем следующие подсказки!":
                "+ Явь"
                $ reality += 1
        hide t2 with dissolve
        hide g1 with dissolve
        scene 3back4 with fade:
            size (1280, 720)
            fit "fill"
        "На удивление, на заводе было шумно, словно рабочая жизнь никогда не уходила из этих мест. Вокруг было очень много женщин, увлеченно занимающихся своим делом."
        "Если бы фигуры этих людей не были прозрачными, нельзя было бы догадаться, что это призраки. С таким увлечением и энтузиазмом эти туманные фигуры были заняты своим ремеслом."
        show ghost_wrkshe:
            zoom 1.0 xalign 0.7 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        characterwrkshe "Эй вы! Что вы здесь делаете!"
        show g7:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "А я…"
        "[player_name] растерялась. Что говорить? «Я пришла вас побеждать, чтоб книжечки искать» — подойдет?"
        "Климент Аркадьевич, как назло, тоже молчал. Видимо, растерялся от напора этой женщины."
        characterwrkshe "А ну прочь, бездельники! Это закрытая территория! Нечего секреты производства разведывать!"
        characterVoiswrk "Галя! Да это ж путешественница во времени и Тимирязев. Они с призраками борются."
        "Галя тут же переменилась в лице, еще раз посмотрела на Тимирязева и схватилась за сердце."
        characterwrkshe "Батюшки! Климент Аркадьевич, не признала! Богатым будете."
        show t1:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Будет тебе, Галина. С каждым может случиться.  Лучше подскажи нам, не брал ли кто из ваших книги библиотечные? Не завалялись ли они тут?"
        characterwrkshe "Да что вы, Климент Аркадьевич. Нашим и читать-то некогда, но даже если б и взяли, то, как порядочные советские люди, вернули бы в срок. Хулиганов среди нас нет."
        tmrz "Неужели мы ошиблись и здесь нам делать нечего…"
        "[player_name] задумалась. Похоже, Галина не знала, что она и сама призрак, и все ее подруги-работницы. Все выглядело так, словно бы их невольно оторвали от работы."
        hide g7 with dissolve
        show g1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "А есть ли у вас легенды о каких-нибудь призраках?"
        "Галина словно помрачнела, и ее и так грозный вид стал еще более суровым."
        characterwrkshe "Да есть тут один… Ходит-бродит, людей пугает."
        tmrz "Галенька, дорогая наша орхидея в этом темном призрачном царстве, будьте так добры, подскажите, как его найти."
        "Галя слегка засмущалась, на секунду даже растеряв свою строгость. Но затем взяла себя в руки."
        characterwrkshe "А его и не надо искать специально. Нужно взять галошу и протереть ее тряпочкой до скрипа. Этот призрак жутко не любит этот звук. Сам на вас выйдет. Только разбирайтесь с ним сами. Я же пойду работать."
        "Тимирязев и [player_name] быстро поблагодарили Галину и подошли к стеллажу с галошами."
        hide g1 with dissolve
        show g5:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Какую выбрать…"
        hide g5 with dissolve
        hide t1 with dissolve
        hide ghost_wrkshe with dissolve
        label scene_red_0_g:
            menu:
                "Синюю":
                    "Неверно, попробуйте еще раз."
                    $ rightornot += 1
                    jump scene_red_0_g
                "Зеленую":
                    "Неверно, попробуйте еще раз."
                    $ rightornot += 1
                    jump scene_red_0_g
                "Черную с красной подкладкой":
                    if rightornot == 0:
                        $ reality += 1
                        $ rightornot += 1
                        "Верно. + Явь "
                    else:
                        "Верно."
                    $ rightornot = 0
        show g2:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Именно такими галошами известен «Красный треугольник»."
        "Взяв на столе тряпку, [player_name] стала протирать до блеска галошу."
        stop music fadeout 2.0
        play music office fadein 2.0 loop if_changed
        show ghost_wrker:
            zoom 1.0 xalign 0.7 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        characterwrker "ОПЯТЬ ЭТОТ МЕРЗКИЙ ЗВУК! Ненавижу эту резину! И так все пропахло ей! Я сам весь пропах этой резиной! Неужели нельзя хотя бы соблюдать тишину!"
        hide g2 with dissolve
        show g7:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "…"
        hide g7 with dissolve
        show g2:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "А чужие книжки воровать, значит, хорошо? Никто никому бы не мешал, если бы вы не пытались уничтожить мой мир!"
        character "Я бы сейчас пошла бы домой, заварила бы чай, включила бы кино и отдыхала бы. А я тут вас отлавливаю то в Российской империи, то в Советском Союзе, то в языческих племенах. Оно мне надо?"
        "Призрак удивленно замер и прислушался."
        character "Я просто книжку хотела сдать! А ну хватит меня запугивать!"
        "Призрак испуганно попятился назад. Климент Аркадьевич с удивлением смотрел за разворачивающимся действом."
        hide g2 with dissolve
        hide ghost_wrker with dissolve
        label scene_red_1_g:
            menu:
                character "Ты даже…"
                "Не мог здесь работать":
                    if rightornot == 0:
                        $ reality += 1
                        $ rightornot += 1
                        "Верный вариант. + Явь "
                    else:
                        "Верный вариант."
                    $ rightornot = 0
                "В дурацкой шляпе":
                    if rightornot == 0:
                        $ ghost += 1
                        $ rightornot += 1
                        "Неверный вариант. + Призрак "
                    else:
                        "Неверный вариант."
                    show t1:
                        zoom 1.0 xalign 1.3 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    tmrz "Зачем ты его так оскорбляешь?"
                    show g6:
                        zoom 1.0 xalign -0.3 yalign 0.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    character "Простите. Видимо, это усталость."
                    "Попробуйте еще раз."
                    hide g6 with dissolve
                    hide t1 with dissolve
                    jump scene_red_1_g
                "Не гражданин":
                    show g6:
                        zoom 1.0 xalign -0.3 yalign 0.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    character "Что за бред? О чем я?"
                    if rightornot == 0:
                        $ ghost += 1
                        $ rightornot += 1
                        "Неверный вариант. + Призрак "
                    else:
                        "Неверный вариант."
                    "Попробуйте еще раз."
                    hide g6 with dissolve
                    jump scene_red_1_g
        show g2:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "На заводе использовали в основном женский труд, откуда здесь взялся рабочий? Кто ты такой?!"
        hide g2 with dissolve
        stop music fadeout 2.0
        play music factory fadein 2.0 loop if_changed
        show g2:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Что за пила у тебя в руках? Что ты вообще собрался здесь пилить? Галоши?!"
        show ghost_wrker:
            zoom 1.0 xalign 0.7 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        characterwrker "Да с чего ты вообще на меня так нападаешь? Я еще ничего плохого тебе не сделал!"
        hide g2 with dissolve
        show g1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Знаю я вас!"
        "Тимирязев добродушно усмехнулся."
        show t1:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Смотрю, мой друг, ты уже осваиваешься среди призраков.  Уже опережаешь их действия."
        character "Я быстро учусь."
        hide g1 with dissolve
        if seria4vibr > 1 and book_rest > 0:
            show g2:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
            character "Тогда просто дайте нам пройти, а сами ступайте по своим делам."
            "Было сложно понять, какие эмоции испытывает призрак, но казалось, что он слегка обескуражен и сконфужен."
            characterwrker "Я не могу просто так вас отпустить. Меня все призраки квартала засмеют. Сначала ты должна угадать: Я действительно здесь существовал или я часть легенды, придуманной людьми."
            character "Опять загадки…"
            character "Я думаю, что…"
            hide g2
            hide t1
            hide ghost_wrker
            with dissolve
            menu:
                "Ты действительно был когда-то на «Красном треугольнике»":
                    $ ghost += 1
                    "+Призрак"
                    show ghost_wrker:
                        zoom 1.0 xalign 0.7 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    characterwrker "А вот и нет! Не заслужила ты книгу, уж извини!"
                    "Вам стоит доверять себе и своим наблюдениям!"
                    hide ghost_wrker with dissolve
                "Легенду о тебе придумали люди":
                    show g1:
                        zoom 1.0 xalign -0.3 yalign 0.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    character "Слишком многое не сходится… Я думаю, что ты не отсюда."
                    show ghost_wrker:
                        zoom 1.0 xalign 0.7 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    characterwrker "Что ж…"
                    characterwrker "Видимо, тебя не так просто обмануть."
                    $ reality += 1
                    "+Явь"
        elif seria4vibr == 1:
            show g2:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
            character "А теперь просто отдай нам с Климентом Аркадьевичем книгу и ступай по своим делам."
            "Было сложно понять, какие эмоции испытывает призрак, но казалось, что он слегка обескуражен и сконфужен."
            characterwrker "Я не могу просто так вам подарить книгу. Меня все призраки квартала засмеют. Сначала ты должна угадать: я действительно существовал здесь или я часть легенды, придуманной людьми."
            character "Опять загадки…"
            character "Я думаю, что…"
            hide g2
            hide t1
            hide ghost_wrker
            with dissolve
            menu:
                "Ты действительно был когда-то на «Красном треугольнике»":
                    $ ghost += 1
                    "+Призрак"
                    show ghost_wrker:
                        zoom 1.0 xalign 0.7 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    characterwrker "А вот и нет! Не заслужила ты книгу, уж извини!"
                    "Вам стоит доверять себе и своим наблюдениям!"
                    hide ghost_wrker with dissolve
                "Легенду о тебе придумали люди":
                    show g1:
                        zoom 1.0 xalign -0.3 yalign 0.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    character "Слишком многое не сходится… Я думаю, что ты не отсюда."
                    show ghost_wrker:
                        zoom 1.0 xalign 0.7 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    characterwrker "Что ж…"
                    characterwrker "Видимо, тебя не так просто обмануть."
                    $ reality += 1
                    "+Явь"
                    hide ghost_wrker with dissolve
                    $ book_rest += 1
                    $ reality += 1
                    show rest with fade:
                        zoom 1.0 xalign 0 yalign 0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    $ sceneredbook += 1
                    "Вы нашли еще одну книгу! +Явь"
        hide rest
        hide g1
        with dissolve
        show ghost_wrker:
            zoom 1.0 xalign 0.7 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        "Призрака окутал туман, и [player_name] приготовилась к нападению. Однако, когда дымка рассеялась, рабочий изменился."
        hide ghost_wrker with dissolve
        show ghost_wrkhe:
            zoom 1.0 xalign 0.7 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        characterwrkhe "Знаешь, уже долгое время я здесь пугаю ребятишек, которые залезают в заброшенные корпуса, чтобы неповадно было сюда заходить."
        characterwrkhe "Я вообще не злой на самом деле. Меня родители сорванцов придумали, чтобы их пугать и они меньше ходили по заброшенным зданиям."
        characterwrkhe "Правда, эффект это имело обратный. Всем детям еще больше хотелось на призрака посмотреть."
        "[player_name] почувствовала себя неловко.  Призрак оказался совсем незлой, даже в некоторой степени благородный.  Не стоило на него так нападать."
        show g6:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Прости, что была слишком резкой."
        characterwrkhe "Я не могу тебя осуждать. Тебе со многим пришлось здесь столкнуться."
        if scenehuse == 0:
            characterwrkhe "Я не только не злюсь, но и предлагаю помощь."
            character "Какую?"
            characterwrkhe "Узнаешь позже…"
            hide ghost_wrkhe with dissolve
            "С этими словами призрак растворился."
        elif scenehuse == 1:
            characterwrkhe "Я не только не злюсь, но и дам совет."
            character "Какой?"
            characterwrkhe "Не бойся вступить в борьбу с собой."
            "С этими словами призрак растворился."
            character "Что бы это значило?"
            show t1:
                zoom 1.0 xalign 1.3 yalign 1.0
                alpha 0.0
                easein 0.3 alpha 1.0
            tmrz "Думаю, поймешь позже, когда придет время. А сейчас, нам нужно идти дальше."
            hide t1
            hide g6
            hide ghost_wrkhe
            with dissolve
            if attack == 1:
                jump scene37_2_m_2
            else:
                jump scene37_2_m_1
            jump scene38
        hide g6 with dissolve
        show g2:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "И все же… Они со своими фокусами и тайнами жутко раздражают…"
        hide g2 with dissolve
        if attack == 1:
            jump scene37_2_m_2
        else:
            jump scene37_2_m_1
        jump scene38

label scene_huse:
    $ seria4vibr += 1
    $ scenehuse += 1
    scene 3back7 with fade:
        size (1280, 720)
        fit "fill"
    stop music fadeout 2.0
    play music ball fadein 2.0 loop if_changed
    if gender == "M":
        show t1:
                zoom 1.0 xalign 1.3 yalign 1.0
                alpha 0.0
                easein 0.3 alpha 1.0
        tmrz "Здесь размещалась контора фабрики и квартира Ивана Карловича Бредаля, он владел собственным камнерезным заводом, где изготавливали плиты. Фасад здания тоже оформлен плитами светло-серого камня. Пожалуй, это самое богатое в плане декора здание Везенбергского квартала."
        show m1:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
        character "Я и забыл, как выглядит этот дом, он уже 15 лет пустует и постоянно завешан строительной сеткой. Действительно очень красивый."
        tmrz "Иван Карлович сам его спроектировал."
        character "Надеюсь, если я справлюсь с призраками и вернусь в свое время, увижу его дальнейшую судьбу. Хотелось бы, чтобы его восстановили."
        hide t1 with dissolve
        show t2:
                zoom 1.0 xalign 1.3 yalign 1.0
                alpha 0.0
                easein 0.3 alpha 1.0
        tmrz "Не «если» справишься с призраками, а «когда» с ними справишься."
        character "Вы очень оптимистичны."
        tmrz "Кстати, знаешь, что у хризантем есть такой сорт «оптимист»?"
        character "Не знаю. Это какая-то подсказка к следующему испытанию?"
        "Климент Аркадьевич тихо засмеялся."
        hide t2 with dissolve
        show t1:
                zoom 1.0 xalign 1.3 yalign 1.0
                alpha 0.0
                easein 0.3 alpha 1.0
        tmrz "Просто интересный факт. Полезно тренировать мозг занимательной информацией."
        hide t1 with dissolve
        hide m1 with dissolve
        scene 3back8 with fade:
            size (1280, 720)
            fit "fill"
        "Вход украшали изображения вакханок, по бокам красовались различные узоры с фруктами и вазами изобилия. [player_name] невольно залюбовался  деталями дома Бредаля."
        "Было немного волнительно заходить сюда."
        show m1:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
        character "Ладно, Климент Аркадьевич. Не будем тянуть. Пора действовать."
        show t1:
                zoom 1.0 xalign 1.3 yalign 1.0
                alpha 0.0
                easein 0.3 alpha 1.0
        tmrz "Удачи, мой друг."
        hide t1 with dissolve
        hide m1 with dissolve
        scene 3back9 with fade:
            size (1280, 720)
            fit "fill"
        show m1:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
        character "Здесь довольно уютно… ну, если представить, что эту комнату не тронул бы туман."
        show t1:
                zoom 1.0 xalign 1.3 yalign 1.0
                alpha 0.0
                easein 0.3 alpha 1.0
        tmrz "Да, кабинет богатый. Очень много книг…"
        hide t1 with dissolve
        hide m1 with dissolve
        if vstret_rab == 1:
            show ghost_wrkhe:
                        zoom 1.0 xalign 0.7 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
            characterwrkhe "Снова приветствую вас, друзья!"
            show m2:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
            character "А ты откуда здесь?"
            characterwrkhe "Я здесь жил. А на «Красном треугольнике» только от скуки «подрабатываю» местной легендой. Сюда-то давно никто не заходит."
            character "Прости, если говорю очень предвзято, но не похоже, чтобы ты мог жить в таком роскошном доме."
            characterwrkhe "Здесь же не только Иван Карлович проживал. Первый этаж занимала конюшня, кладовая и каретный сарай. На втором этаже жили управляющий, кучер, сторож и холостые рабочие."
            characterwrkhe "И вот только тут, на третьем и еще на четвертом этажах, располагалась восьмикомнатная квартира хозяина дома."
            hide m2 with dissolve
            show m5:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
            character "Надо же."
            hide m5 with dissolve
            hide ghost_wrkhe with dissolve
            if sceneredbook == 1:
                show ghost_wrkhe:
                    zoom 1.0 xalign 0.7 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                characterwrkhe "Спрашивай, если вдруг тебе еще что-то интересно."
                hide ghost_wrkhe with dissolve
                menu:
                    character ""
                    "Раз здесь все спокойно, то, я думаю, лучше не буду терять время":
                        $ ghost += 1
                        "+ Призрак"
                        if attack == 1:
                            jump scene37_2_m_2
                        else:
                            jump scene37_2_m_1
                        jump scene38
                    "Расскажи немного о владельце":
                        $ reality += 1
                        "Призрак рабочего оценил ваш интерес. + Явь"
                        show ghost_wrkhe:
                            zoom 1.0 xalign 0.7 yalign 1.0
                            alpha 0.0
                            easein 0.3 alpha 1.0
                        characterwrkhe "Иоганн Бредаль был инженером, выполнял чертежные работы. Спустя четыре года жизни в Санкт-Петербурге он стал Иоганном Карловичем Бредалем и переселился на Ново-Петергофский проспект."
                        characterwrkhe "Позднее, будучи уже Иваном Карловичем, Бредаль приобрел в собственность участки земли по новой на тот момент Везенбергской улице. Здесь он построил плитный завод и склад. Фабрика инженера И. К. Бредаля занималась обработкой камня, поступавшего из собственных каменоломен близ Ревеля."
                        show m5:
                            zoom 1.0 xalign -0.3 yalign 0.0
                            alpha 0.0
                            easein 0.3 alpha 1.0
                        character "Ревеля?"
                        show t1:
                            zoom 1.0 xalign 1.3 yalign 1.0
                            alpha 0.0
                            easein 0.3 alpha 1.0
                        tmrz "Современного Таллина."
                        character "Вот как…"
                        tmrz "Не хочу прерывать тебя, мой друг, но нам пора."
                        hide m5 with dissolve
                        show m1:
                            zoom 1.0 xalign -0.3 yalign 0.0
                            alpha 0.0
                            easein 0.3 alpha 1.0
                        character "Спасибо вам за небольшую экскурсию."
                        characterwrkhe "Всегда рад."
                        hide m1 with dissolve
                        hide t1 with dissolve
                        hide ghost_wrkhe with dissolve
                        if attack == 1:
                            jump scene37_2_m_2
                        else:
                            jump scene37_2_m_1
                        jump scene38
        elif scenered == 0:
            "Несмотря на красоту кабинета, здесь было очень неуютно и холодно. [player_name] чувствовал опасность."
            show ghost_ht3:
                        zoom 1.0 xalign 0.7 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
            characterht3 "..."
            show m7:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
            character "Это еще кто?!"
            show t1:
                zoom 1.0 xalign 1.3 yalign 1.0
                alpha 0.0
                easein 0.3 alpha 1.0
            tmrz "Боюсь, что это один из самых страшных призраков – чудовище запустения."
            hide m7 with dissolve
            show m1:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
            character "Это что еще такое?"
            tmrz "Когда дом долго стоит бесхозным и забытым, в нем заводится нечто ужасное."
            "Призрак тихо захрипел."
            characterghost "З…д...д…ррравссст…уй…"
            "Говорить по-человечески у призрака очень плохо получалось. Но очень радовало то, что он не спешил нападать."
            character "Что тебе нужно?"
            characterghost "За…га….д..т….ка."
            "[player_name] старался быть терпеливее."
            character "Я слушаю твою загадку."
            characterghost "Их..бу…три…"
            character "Их будет три?"
            "Призрак кивнул."
            hide m1 with dissolve
            show m2:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
            character "А не много ли для тебя?"
            "В ответ призрак покачал головой."
            "[player_name] переглянулся с Климентом Аркадьевичем и вздохнул."
            hide m2 with dissolve
            show m1:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
            character "Ладно, давай твои загадки."
            characterghost "Они…бу…о камнях…"
            character "Ну что ж, я слушаю."
            "По рукам призрака скользнул туман. В его руках появился листок, и он протянул его вперед."
            "[player_name] с опасением забрал его себе и прочел."
            character "{i}«Это ярче глаз Багиры» - сказал Маугли, с восхищением поворачивая кристалл…{/i}"
            character "{i}«Многие люди убивали бы трижды в ночь ради одного этого красного камня» - заметил Каа.{/i}"
            hide m1 with dissolve
            hide t1 with dissolve
            hide ghost_ht3 with dissolve
            menu:
                "О каком камне идет речь?"
                "Гранат":
                    $ ghost += 1
                    "Неверно. +Призрак"
                    show ghost_ht3:
                        zoom 1.0 xalign 0.7 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    characterht3 "Ты ошшш…иб..ся."
                    hide ghost_ht3 with dissolve
                "Рубин":
                    $ zagadka += 1
                    $ reality += 1
                    "Верно. +Явь"
                    show ghost_ht3:
                        zoom 1.0 xalign 0.7 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    characterht3 "Веррр…но"
                    hide ghost_ht3 with dissolve
                "Малахит":
                    $ ghost += 1
                    "Неверно. +Призрак"
                    show ghost_ht3:
                        zoom 1.0 xalign 0.7 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    characterghost "Ты ошшш…иб..ся."
                    hide ghost_ht3 with dissolve
            show ghost_ht3:
                        zoom 1.0 xalign 0.7 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
            characterghost "Еще… За…га….д..т….ка."
            "Листок в руках растворился, и вместо него [player_name] держал следующий."
            show m1:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
            character "{i}«Чудесно зелена и знаменита{/i}"
            character "{i}Та чаша из резного ...»{/i}"
            hide m1 with dissolve
            hide ghost_ht3 with dissolve
            menu:
                "О каком камне идет речь?"
                "Гранита":
                    $ ghost += 1
                    "Неверно. +Призрак"
                    show ghost_ht3:
                        zoom 1.0 xalign 0.7 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    characterht3 "Ты ошшш…иб..ся."
                    hide ghost_ht3 with dissolve
                "Малахита":
                    $ zagadka += 1
                    $ reality += 1
                    "Верно. +Явь"
                    show ghost_ht3:
                        zoom 1.0 xalign 0.7 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    characterht3 "Веррр…но"
                    hide ghost_ht3 with dissolve
                "Аконита":
                    $ ghost += 1
                    "Неверно. +Призрак"
                    show ghost_ht3:
                        zoom 1.0 xalign 0.7 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    characterghost "Ты ошшш…иб..ся."
                    hide ghost_ht3 with dissolve
            show ghost_ht3:
                        zoom 1.0 xalign 0.7 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
            characterghost "Пос…дняяяя"
            show m1:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
            character "Последняя?"
            "В руках появился листок с еще одной загадкой."
            character "{i} «Когда ж Куприн назвал им свой «Браслет…\nОн повести отдал свой дивный свет»{/i}"
            hide m1 with dissolve
            hide ghost_ht3 with dissolve
            menu:
                "О каком камне идет речь?"
                "Гранат":
                    $ zagadka += 1
                    $ reality += 1
                    "Верно. +Явь"
                    show ghost_ht3:
                        zoom 1.0 xalign 0.7 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    characterht3 "Веррр…но"
                    hide ghost_ht3 with dissolve
                "Рубин":
                    $ ghost += 1
                    "Неверно. +Призрак"
                    show ghost_ht3:
                        zoom 1.0 xalign 0.7 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    characterghost "Ты ошшш…иб..ся."
                    hide ghost_ht3 with dissolve
                "Малахит":
                    $ ghost += 1
                    "Неверно. +Призрак"
                    show ghost_ht3:
                        zoom 1.0 xalign 0.7 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    characterghost "Ты ошшш…иб..ся."
                    hide ghost_ht3 with dissolve
            if zagadka >= 2 and book_rest == 0:
                show ghost_ht3:
                            zoom 1.0 xalign 0.7 yalign 1.0
                            alpha 0.0
                            easein 0.3 alpha 1.0
                characterghost "Ты…засл…уж…л….я верн…кни..гху.."
                hide ghost_ht3 with dissolve
                "Вы нашли книгу."
                show rest with fade:
                    zoom 1.0 xalign 0 yalign 0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                $ scenehusebook += 1
                $ book_rest += 1
                hide rest with dissolve
                "Призрак растворился также внезапно, как и появился в этом доме."
                show t1:
                    zoom 1.0 xalign 1.3 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                tmrz "Молодец, мой друг! Здесь наша работа окончена."
                hide t1 with dissolve
            elif zagadka >= 2 and book_rest == 1:
                show ghost_ht3:
                            zoom 1.0 xalign 0.7 yalign 1.0
                            alpha 0.0
                            easein 0.3 alpha 1.0
                characterghost "Чт….ооож. Про…ходи. Ты от…вИл  вер…но."
                hide ghost_ht3 with dissolve
                "Призрак растворился также внезапно, как и появился в этом доме."
                show t1:
                    zoom 1.0 xalign 1.3 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                tmrz "Молодец, мой друг! Здесь наша работа окончена."
                hide t1 with dissolve
            elif zagadka <= 1 and book_rest == 0:
                show ghost_ht3:
                    zoom 1.0 xalign 0.7 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                characterghost "Ты..не смо..гх… Мы силь…ллл…ее…"
                characterghost "Книии…гху..я оста..ляю сеепе….."
                hide ghost_ht3 with dissolve
                "Призрак растворился также внезапно, как и появился в этом доме."
                show t1:
                    zoom 1.0 xalign 1.3 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                tmrz "Не расстраивайся, мой друг. Нам пора следовать далее."
                hide t1 with dissolve
            elif zagadka <= 1 and book_rest >= 1:
                show ghost_ht3:
                    zoom 1.0 xalign 0.7 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                characterghost "Ты..не смо..гх… Мы силь…ллл…ее…"
                hide ghost_ht3 with dissolve
                "Призрак растворился также внезапно, как и появился в этом доме."
                show t1:
                    zoom 1.0 xalign 1.3 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                tmrz "Не расстраивайся, мой друг. Нам пора следовать далее."
                hide t1 with dissolve
        if attack == 1:
            jump scene37_2_m_2
        else:
            jump scene37_2_m_1
        jump scene38
    elif gender == "G":
        show t1:
                zoom 1.0 xalign 1.3 yalign 1.0
                alpha 0.0
                easein 0.3 alpha 1.0
        tmrz "Здесь размещалась контора фабрики и квартира Ивана Карловича Бредаля, он владел собственным камнерезным заводом, где изготавливали плиты. Фасад здания тоже оформлен плитами светло-серого камня. Пожалуй, это самое богатое в плане декора здание Везенбергского квартала."
        show g1:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
        character "Я и забыла, как выглядит этот дом, он уже 15 лет пустует и постоянно завешан строительной сеткой. Действительно очень красивый."
        tmrz "Иван Карлович сам его спроектировал."
        character "Надеюсь, если я справлюсь с призраками и вернусь в свое время, увижу его дальнейшую судьбу. Хотелось бы, чтобы его восстановили."
        hide t1 with dissolve
        show t2:
                zoom 1.0 xalign 1.3 yalign 1.0
                alpha 0.0
                easein 0.3 alpha 1.0
        tmrz "Не «если» справишься с призраками, а «когда» с ними справишься."
        character "Вы очень оптимистичны."
        tmrz "Кстати, знаешь, что у хризантем есть такой сорт «оптимист»?"
        character "Не знаю. Это какая-то подсказка к следующему испытанию?"
        "Климент Аркадьевич тихо засмеялся."
        hide t2 with dissolve
        show t1:
                zoom 1.0 xalign 1.3 yalign 1.0
                alpha 0.0
                easein 0.3 alpha 1.0
        tmrz "Просто интересный факт. Полезно тренировать мозг занимательной информацией."
        hide t1 with dissolve
        hide g1 with dissolve
        scene 3back8 with fade:
            size (1280, 720)
            fit "fill"
        "Вход украшали изображения вакханок, по бокам красовались различные узоры с фруктами и вазами изобилия. [player_name] невольно залюбовалась  деталями дома Бредаля."
        "Было немного волнительно заходить сюда."
        show g1:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
        character "Ладно, Климент Аркадьевич. Не будем тянуть. Пора действовать."
        show t1:
                zoom 1.0 xalign 1.3 yalign 1.0
                alpha 0.0
                easein 0.3 alpha 1.0
        tmrz "Удачи, мой друг."
        hide t1 with dissolve
        hide g1 with dissolve
        scene 3back9 with fade:
            size (1280, 720)
            fit "fill"
        show g1:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
        character "Здесь довольно уютно… ну, если представить, что эту комнату не тронул бы туман."
        show t1:
                zoom 1.0 xalign 1.3 yalign 1.0
                alpha 0.0
                easein 0.3 alpha 1.0
        tmrz "Да, кабинет богатый. Очень много книг…"
        hide t1 with dissolve
        hide g1 with dissolve
        if vstret_rab == 1:
            show ghost_wrkhe:
                        zoom 1.0 xalign 0.7 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
            characterwrkhe "Снова приветствую вас, друзья!"
            show g2:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
            character "А ты откуда здесь?"
            characterwrkhe "Я здесь жил. А на «Красном треугольнике» только от скуки «подрабатываю» местной легендой. Сюда-то давно никто не заходит."
            character "Прости, если говорю очень предвзято, но не похоже, чтобы ты мог жить в таком роскошном доме."
            characterwrkhe "Здесь же не только Иван Карлович проживал. Первый этаж занимала конюшня, кладовая и каретный сарай. На втором этаже жили управляющий, кучер, сторож и холостые рабочие."
            characterwrkhe "И вот только тут, на третьем и еще на четвертом этажах, располагалась восьмикомнатная квартира хозяина дома."
            hide g2 with dissolve
            show g5:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
            character "Надо же."
            hide g5 with dissolve
            hide ghost_wrkhe with dissolve
            if sceneredbook == 1:
                show ghost_wrkhe:
                    zoom 1.0 xalign 0.7 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                characterwrkhe "Спрашивай, если вдруг тебе еще что-то интересно."
                hide ghost_wrkhe with dissolve
                menu:
                    character ""
                    "Раз здесь все спокойно, то, я думаю, лучше не буду терять время":
                        $ ghost += 1
                        "+ Призрак"
                        if attack == 1:
                            jump scene37_2_g_2
                        else:
                            jump scene37_2_g_1
                        jump scene38
                    "Расскажи немного о владельце":
                        $ reality += 1
                        "Призрак рабочего оценил ваш интерес. + Явь"
                        show ghost_wrkhe:
                            zoom 1.0 xalign 0.7 yalign 1.0
                            alpha 0.0
                            easein 0.3 alpha 1.0
                        characterwrkhe "Иоганн Бредаль был инженером, выполнял чертежные работы. Спустя четыре года жизни в Санкт-Петербурге он стал Иоганном Карловичем Бредалем и переселился на Ново-Петергофский проспект."
                        characterwrkhe "Позднее, будучи уже Иваном Карловичем, Бредаль приобрел в собственность участки земли по новой на тот момент Везенбергской улице. Здесь он построил плитный завод и склад. Фабрика инженера И. К. Бредаля занималась обработкой камня, поступавшего из собственных каменоломен близ Ревеля."
                        show g5:
                            zoom 1.0 xalign -0.3 yalign 0.0
                            alpha 0.0
                            easein 0.3 alpha 1.0
                        character "Ревеля?"
                        show t1:
                            zoom 1.0 xalign 1.3 yalign 1.0
                            alpha 0.0
                            easein 0.3 alpha 1.0
                        tmrz "Современного Таллина."
                        character "Вот как…"
                        tmrz "Не хочу прерывать тебя, мой друг, но нам пора."
                        hide g5 with dissolve
                        show g1:
                            zoom 1.0 xalign -0.3 yalign 0.0
                            alpha 0.0
                            easein 0.3 alpha 1.0
                        character "Спасибо вам за небольшую экскурсию."
                        characterwrkhe "Всегда рад."
                        hide g1 with dissolve
                        hide t1 with dissolve
                        hide ghost_wrkhe with dissolve
                        if attack == 1:
                            jump scene37_2_g_2
                        else:
                            jump scene37_2_g_1
                        jump scene38
        if scenered == 0:
            "Несмотря на красоту кабинета, здесь было очень неуютно и холодно. [player_name] чувствовала опасность."
            show ghost_ht3:
                        zoom 1.0 xalign 0.7 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
            characterht3 "..."
            show g7:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
            character "Это еще кто?!"
            show t1:
                zoom 1.0 xalign 1.3 yalign 1.0
                alpha 0.0
                easein 0.3 alpha 1.0
            tmrz "Боюсь, что это один из самых страшных призраков – чудовище запустения."
            hide g7 with dissolve
            show g1:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
            character "Это что еще такое?"
            tmrz "Когда дом долго стоит бесхозным и забытым, в нем заводится нечто ужасное."
            "Призрак тихо захрипел."
            characterghost "З…д...д…ррравссст…уй…"
            "Говорить по-человечески у призрака очень плохо получалось. Но очень радовало то, что он не спешил нападать."
            character "Что тебе нужно?"
            characterghost "За…га….д..т….ка."
            "[player_name] старалась быть терпеливее."
            character "Я слушаю твою загадку."
            characterghost "Их..бу…три…"
            character "Их будет три?"
            "Призрак кивнул."
            hide g1 with dissolve
            show g2:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
            character "А не много ли для тебя?"
            "В ответ призрак покачал головой."
            "[player_name] переглянулась с Климентом Аркадьевичем и вздохнула."
            hide g2 with dissolve
            show g1:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
            character "Ладно, давай твои загадки."
            characterghost "Они…бу…о камнях…"
            character "Ну что ж, я слушаю."
            "По рукам призрака скользнул туман. В его руках появился листок, и он протянул его вперед."
            "[player_name] с опасением забрала его себе и прочла."
            character "{i}«Это ярче глаз Багиры» - сказал Маугли, с восхищением поворачивая кристалл…{/i}"
            character "{i}«Многие люди убивали бы трижды в ночь ради одного этого красного камня» - заметил Каа.{/i}"
            hide g1 with dissolve
            hide t1 with dissolve
            hide ghost_ht3 with dissolve
            menu:
                "О каком камне идет речь?"
                "Гранат":
                    $ ghost += 1
                    "Неверно. +Призрак"
                    show ghost_ht3:
                        zoom 1.0 xalign 0.7 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    characterht3 "Ты ошшш…иб..лась."
                    hide ghost_ht3 with dissolve
                "Рубин":
                    $ zagadka += 1
                    $ reality += 1
                    "Верно. +Явь"
                    show ghost_ht3:
                        zoom 1.0 xalign 0.7 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    characterht3 "Веррр…но"
                    hide ghost_ht3 with dissolve
                "Малахит":
                    $ ghost += 1
                    "Неверно. +Призрак"
                    show ghost_ht3:
                        zoom 1.0 xalign 0.7 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    characterghost "Ты ошшш…иб..лась."
                    hide ghost_ht3 with dissolve
            show ghost_ht3:
                        zoom 1.0 xalign 0.7 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
            characterghost "Еще… За…га….д..т….ка."
            "Листок в руках растворился, и вместо него [player_name] держала следующий."
            show g1:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
            character "{i} «Чудесно зелена и знаменита\nТа чаша из резного ...»{/i}"
            hide g1 with dissolve
            hide ghost_ht3 with dissolve
            menu:
                "О каком камне идет речь?"
                "Гранита":
                    $ ghost += 1
                    "Неверно. +Призрак"
                    show ghost_ht3:
                        zoom 1.0 xalign 0.7 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    characterht3 "Ты ошшш…иб..лась."
                    hide ghost_ht3 with dissolve
                "Малахита":
                    $ zagadka += 1
                    $ reality += 1
                    "Верно. +Явь"
                    show ghost_ht3:
                        zoom 1.0 xalign 0.7 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    characterht3 "Веррр…но"
                    hide ghost_ht3 with dissolve
                "Аконита":
                    $ ghost += 1
                    "Неверно. +Призрак"
                    show ghost_ht3:
                        zoom 1.0 xalign 0.7 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    characterghost "Ты ошшш…иб..лась."
                    hide ghost_ht3 with dissolve
            show ghost_ht3:
                        zoom 1.0 xalign 0.7 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
            characterghost "Пос…дняяяя"
            show g1:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
            character "Последняя?"
            "В руках появился листок с еще одной загадкой."
            character "{i} «Когда ж Куприн назвал им свой «Браслет…\nОн повести отдал свой дивный свет»{/i}"
            hide g1 with dissolve
            hide ghost_ht3 with dissolve
            menu:
                "О каком камне идет речь?"
                "Гранат":
                    $ zagadka += 1
                    $ reality += 1
                    "Верно. +Явь"
                    show ghost_ht3:
                        zoom 1.0 xalign 0.7 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    characterht3 "Веррр…но"
                    hide ghost_ht3 with dissolve
                "Рубин":
                    $ ghost += 1
                    "Неверно. +Призрак"
                    show ghost_ht3:
                        zoom 1.0 xalign 0.7 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    characterghost "Ты ошшш…иб..лась."
                    hide ghost_ht3 with dissolve
                "Малахит":
                    $ ghost += 1
                    "Неверно. +Призрак"
                    show ghost_ht3:
                        zoom 1.0 xalign 0.7 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    characterghost "Ты ошшш…иб..лась."
                    hide ghost_ht3 with dissolve
            if zagadka >= 2 and book_rest == 0:
                show ghost_ht3:
                            zoom 1.0 xalign 0.7 yalign 1.0
                            alpha 0.0
                            easein 0.3 alpha 1.0
                characterghost "Ты…засл…уж…л….я верн…кни..гху.."
                hide ghost_ht3 with dissolve
                "Вы нашли книгу."
                show rest with fade:
                    zoom 1.0 xalign 0 yalign 0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                $ scenehusebook += 1
                $ book_rest += 1
                hide rest with dissolve
                "Призрак растворился также внезапно, как и появился в этом доме."
                show t1:
                    zoom 1.0 xalign 1.3 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                tmrz "Молодец, мой друг! Здесь наша работа окончена."
                hide t1 with dissolve
            elif zagadka >= 2 and book_rest == 1:
                show ghost_ht3:
                            zoom 1.0 xalign 0.7 yalign 1.0
                            alpha 0.0
                            easein 0.3 alpha 1.0
                characterghost "Чт….ооож. Про…ходи. Ты от…вИл  вер…но."
                hide ghost_ht3 with dissolve
                "Призрак растворился также внезапно, как и появился в этом доме."
                show t1:
                    zoom 1.0 xalign 1.3 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                tmrz "Молодец, мой друг! Здесь наша работа окончена."
                hide t1 with dissolve
            elif zagadka <= 1 and book_rest == 0:
                show ghost_ht3:
                    zoom 1.0 xalign 0.7 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                characterghost "Ты..не смо..гх… Мы силь…ллл…ее…"
                characterghost "Книии…гху..я оста..ляю сеепе….."
                hide ghost_ht3 with dissolve
                "Призрак растворился также внезапно, как и появился в этом доме."
                show t1:
                    zoom 1.0 xalign 1.3 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                tmrz "Не расстраивайся, мой друг. Нам пора следовать далее."
                hide t1 with dissolve
            elif zagadka <= 1 and book_rest >= 1:
                show ghost_ht3:
                    zoom 1.0 xalign 0.7 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                characterghost "Ты..не смо..гх… Мы силь…ллл…ее…"
                hide ghost_ht3 with dissolve
                "Призрак растворился также внезапно, как и появился в этом доме."
                show t1:
                    zoom 1.0 xalign 1.3 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                tmrz "Не расстраивайся, мой друг. Нам пора следовать далее."
                hide t1 with dissolve
        if attack == 1:
            jump scene37_2_g_2
        else:
            jump scene37_2_g_1
        jump scene38

label scene_medic:
    $ seria4vibr += 1
    $ scenemedic += 1
    scene 3back5 with fade:
        size (1280, 720)
        fit "fill"
    stop music fadeout 2.0
    play music bany fadein 2.0 loop if_changed
    if gender == "M":
        "В этот раз [player_name] и Климент Аркадьевич оказались у краснокирпичного небольшого здания."
        show m6:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Здесь была больница?"
        show t1:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "У этого здания интересная история…"
        character "Расскажите."
        tmrz "Оно было построено в 1902 году на участке, принадлежавшем доктору медицины Владимиру Ивановичу Рамму."
        hide t1 with dissolve
        show t2:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Он увлекался издательским делом и мечтал открыть свой Полиграфический институт."
        hide m6 with dissolve
        show m5:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Дело неплохое."
        hide t2 with dissolve
        show t1:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Проблема была в том, что он был не самый честный человек."
        hide m5 with dissolve
        show m1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "И что случилось?"
        tmrz "Вместе со своим компаньоном Гавриловым Владимир Иванович Рамм занялся выпуском ежемесячного журнала «Живописное обозрение». Подписчикам обещали, что всего за семь рублей в год они получат, помимо самих выпусков журнала, более 300 различных книг в качестве подарков."
        hide t1 with dissolve
        show t2:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "С подписчиков было собрано более ста тысяч рублей. А в то время это были большие деньги. Вышло всего несколько номеров журнала, и на этом все. Читатели остались без журнала."
        hide m1 with dissolve
        show m5:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Хитро."
        hide t2 with dissolve
        show t1:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Эта издательская афера, которая, кстати, была не первой в жизни В. И. Рамма, вскрылась, и доктору медицины пришлось полностью менять привычный образ жизни. До этого он жил на широкую ногу."
        hide m5 with dissolve
        show m1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Надо же! А что стало с домом?"
        tmrz "В начале 1903 года имущество В. И. Рамма было конфисковано, дом продали, а сам доктор стал штатным сотрудником обычной газеты."
        hide m1 with dissolve
        show m6:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Печальная история…"
        tmrz "В 1908 году дом приобрела Обуховская больница. В здании разместилось Лейхтенбергское отделение больницы для лечения кожных заболеваний. Во время войны сюда возили раненых."
        hide m6 with dissolve
        show m1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Какая необычная судьба у дома…"
        tmrz "В Везенбергском квартале нет скучных домов."
        "Климент Аркадьевич подмигнул и кивнул в сторону дома."
        stop music fadeout 1.0
        play music haspit fadein 2.0 loop if_changed
        tmrz "Пойдем, есть предчувствие, что там нас ждет что-то зловещее."
        hide m1 with dissolve
        show m2:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Надеюсь, что это только предчувствие."
        hide m2
        hide t1
        with dissolve
        scene 3back6 with fade:#########
            size (1280, 720)
            fit "fill"
        "Из всех мест, которые [player_name] успел посетить, это оказалось самым эффектным и гнетущим."
        show m1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Ну почему мы попали именно в то время, когда здесь была больница."
        show t1:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Видимо, это самые яркие воспоминания, которые хранят эти стены."
        hide t1 with dissolve
        "[player_name] бродил по пустым палатам и старался найти хоть какую-то подсказку."
        "Постели были расправлены и по-разному смяты, словно их хозяева только-только куда-то отошли и скоро вернутся."
        "И хотя здесь никого не было, острое чувство присутствия никуда не уходило."
        "Неизвестно, как долго [player_name] и Тимирязев рассматривали пространство вокруг. Но ничего не происходило."
        "[player_name] от скуки стал залезать в ящики и смотреть, что оставили призраки. Больничные бинты, лекарства, пустые пузырьки… Но никаких книг. Тогда [player_name] решил заглянуть в шкаф."
        hide m1 with dissolve
        show ghost_pacient:
            xpos 200 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        show m7:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Ты кто?!!!!"
        "Призрак, довольный эффектом, плавно выскользнул из шкафа."
        characterpacient "Знаешь, в нашем мире все так всполошились из-за твоего появления. Ушли даже на собрание, чтоб придумать новые козни."
        hide m7 with dissolve
        show m1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "А ты почему не там?"
        characterpacient "А меня не взяли. Сказали, что я постоянно бьюсь обо все углы, спотыкаюсь и вообще ничего не могу сделать. Только рассмешить тебя могу, а не напугать."
        "[player_name] с удивлением осознал, что ему стало обидно за призрака, ведь за собой он тоже часто замечал неуклюжесть. Это же не повод сразу кого-то списывать со счетов."
        hide m1 with dissolve
        show m2:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Они не правы. В шкафу ты меня сильно напугал."
        characterpacient "Не утешай меня. Мы все равно враги."
        hide m2 with dissolve
        show m1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Как скажешь."
        "Ненадолго повисла неловкая пауза. Призрак о чем-то раздумывал."
        characterpacient "Хотя… спасибо, что оценил."
        character "Нет проблем."
        "И снова пауза. Видимо, никто не знал, что делать дальше. На помощь пришел Климент Аркадьевич."
        show t1:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Знаешь, обычно призраки придумывают загадки или испытания…"
        characterpacient "Обычно да…"
        "Снова повисла пауза."
        character "Ты странный. Ты знаешь?"
        characterpacient "Да… Мне говорили."
        character "..."
        characterpacient "..."
        tmrz "..."
        character "Может, у тебя для меня есть загадка?"
        characterpacient "Загадка? Нет-Нет… Это я не умею придумывать."
        hide m1 with dissolve
        show m2:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Испытание?"
        characterpacient "Нееее, это еще сложнее."
        character "Может быть, бой?"
        characterpacient "Ты смеешься? Я капельницу за собой везде таскаю. Как я драться буду?"
        hide m2 with dissolve
        hide t1 with dissolve
        hide ghost_pacient with dissolve
        if book_rest == 1:
            show ghost_pacient:
                xpos 200 yalign 1.0
                alpha 0.0
                easein 0.3 alpha 1.0
            characterpacient "Давай так. Ты расскажешь мне о своем мире, и, если рассказ мне понравится, я тебе дам подсказку."
            show t1:
                zoom 1.0 xalign 1.3 yalign 1.0
                alpha 0.0
                easein 0.3 alpha 1.0
            tmrz "Будь осторожен, мне кажется, его нельзя расстраивать."
            show m1:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
            character "Хорошо. Что ты хочешь знать?"
            hide m1
            hide t1
            hide ghost_pacient
            with dissolve
        elif book_rest == 0:
            show m1:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
            character "Так, а может, ты мне просто подаришь книгу?"
            show ghost_pacient:
                xpos 200 yalign 1.0
                alpha 0.0
                easein 0.3 alpha 1.0
            characterpacient "Нееет, хитрюга. Так просто я тебе ее не отдам."
            characterpacient "Давай так. Ты расскажешь мне о своем мире, и, если рассказ мне понравится, я тебе отдам книжку."
            show t1:
                zoom 1.0 xalign 1.3 yalign 1.0
                alpha 0.0
                easein 0.3 alpha 1.0
            tmrz "Будь осторожен, мне кажется, его нельзя расстраивать."
            character "Хорошо. Что ты хочешь знать?"
            hide m1
            hide t1
            hide ghost_pacient
            with dissolve
        show ghost_pacient:
            xpos 200 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        characterpacient "Расскажи, спокойно ли в вашем мире?"
        hide ghost_pacient with dissolve
        menu:
            "Люди остаются людьми":
                show m2:
                    zoom 1.0 xalign -0.3 yalign 0.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                character "Каждый старается сделать как лучше, но не всегда все сходятся во мнении."
                $ zagadkamedic += 1
                "Призраку нравится ваш ответ."
                hide m2 with dissolve
            "Ничего не меняется. Все злые и вредные. Особенно с утра":
                "Призраку не нравится ваш ответ."
                show ghost_pacient:
                    xpos 200 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                characterpacient "А может, ты просто не хочешь видеть хорошее?"
                hide ghost_pacient with dissolve
            "Относительно спокойно":
                show ghost_pacient:
                    xpos 200 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                characterpacient "Относительно чего?"
                show m2:
                    zoom 1.0 xalign -0.3 yalign 0.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                character "Не знаю."
                characterpacient "А зачем ты говоришь, если не знаешь?"
                "Призраку не нравится ваш ответ."
                hide m2
                hide ghost_pacient
                with dissolve
        show ghost_pacient:
            xpos 200 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        characterpacient "А какие технологии у вас появились?"
        hide ghost_pacient with dissolve
        menu:
            "Появилась коробка, в которой хранится информация про все и обо всем":
                show ghost_pacient:
                    xpos 200 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                characterpacient "Это как?"
                show m2:
                    zoom 1.0 xalign -0.3 yalign 0.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                character "Их называют компьютеры. Они помогают людям работать, искать информацию об окружающем мире, там можно писать и сохранять свои… книги, например. И новости теперь люди узнают через интернет, а не с помощью газет."
                characterpacient "Интернет?"
                character "Всемирная сеть. Туда заходят через компьютеры со всего мира и пишут все, что происходит."
                characterpacient "Ты выдумываешь."
                character "Не выдумываю!"
                characterpacient "Нет, это какая-то бессвязная сказка. Так не бывает."
                "Призраку не нравится ваш ответ."
                hide ghost_pacient
                hide m2
                with dissolve
            "Появились у каждого личные устройства для общения на расстоянии":
                show ghost_pacient:
                    xpos 200 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                characterpacient "Это как?"
                show m1:
                    zoom 1.0 xalign -0.3 yalign 0.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                character "Мы носим с собой прямоугольные устройства и в любой момент можем друг другу позвонить по ним."
                characterpacient "Как волшебное блюдце в сказках?"
                character "Ну почти. Используются радиоволны с определенными частотами. Эти устройства их ловят и передают связь."
                characterpacient "Наверно, это очень удобно."
                character "Пожалуй."
                $ zagadkamedic += 1
                "Призраку нравится ваш ответ."
                hide ghost_pacient
                hide m1
                with dissolve
            "Не знаю":
                show ghost_pacient:
                    xpos 200 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                characterpacient "Так это же твой мир, который ты защищаешь. Неужели ты не можешь похвалиться тем, чего вы добились."
                show m2:
                    zoom 1.0 xalign -0.3 yalign 0.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                character "Да так сразу и не вспомнишь!"
                characterpacient "Странный ты человек, совсем не интересуешься тем, что тебя окружает, а хочешь зачем-то этот мир спасти."
                "Призраку не нравится ваш ответ."
                characterpacient "Вы помните о нас? О том, что было здесь? Люди хранят память об этих местах?"
                hide ghost_pacient
                hide m2
                with dissolve
                menu:
                    "Да":
                        show m2:
                            zoom 1.0 xalign -0.3 yalign 0.0
                            alpha 0.0
                            easein 0.3 alpha 1.0
                        character "Хранят, изучают, стараются рассказывать. Когда я пришел в библиотеку, я увидел, что люди читают про Везенбергский квартал. Ищут о нем информацию, водят по нему экскурсии."
                        show ghost_pacient:
                            xpos 200 yalign 1.0
                            alpha 0.0
                            easein 0.3 alpha 1.0
                        characterpacient "Приятно знать. Значит, призраки не очень справедливы к вам."
                        character "Думаю, что да."
                        $ zagadkamedic += 1
                        "Призраку нравится ваш ответ."
                        hide ghost_pacient
                        hide m2
                        with dissolve
                    "По-разному":
                        show m2:
                            zoom 1.0 xalign -0.3 yalign 0.0
                            alpha 0.0
                            easein 0.3 alpha 1.0
                        character "Много тех, кто изучает историю, читает архивы и пишет научные работы. Однако мы потеряли много исторических домов. Не смогли их сохранить и защитить. Уничтожили своим равнодушием."
                        show ghost_pacient:
                            xpos 200 yalign 1.0
                            alpha 0.0
                            easein 0.3 alpha 1.0
                        characterpacient "Спасибо за честный ответ."
                        $ zagadkamedic += 1
                        "Призраку нравится ваш ответ."
                        hide ghost_pacient
                        hide m2
                        with dissolve
                    "Нет":
                        show m2:
                            zoom 1.0 xalign -0.3 yalign 0.0
                            alpha 0.0
                            easein 0.3 alpha 1.0
                        character "Стыдно признаться, но я мало знаю о том, как сохраняют память об этих местах. До этого дня я не знал о существовании этого квартала."
                        show ghost_pacient:
                            xpos 200 yalign 1.0
                            alpha 0.0
                            easein 0.3 alpha 1.0
                        characterpacient "Что ж, тогда я надеюсь, ты не удивляешься тому, что призраки квартала разозлились на вас."
                        character "Теперь я понимаю."
                        "Призрака разочаровал ваш ответ."
                        hide ghost_pacient
                        hide m2
                        with dissolve
        if zagadkamedic >= 1 and book_rest == 1:
            show ghost_pacient:
                xpos 200 yalign 1.0
                alpha 0.0
                easein 0.3 alpha 1.0
            characterpacient "Спасибо за эту беседу. Было очень познавательно. В благодарность я тебя предупрежу — опасайся призрачных полицейских. Уж очень они подозрительные."
            show m1:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
            character "Спасибо."
            $ reality += 1
            "+ Явь"
            hide m1
            hide ghost_pacient
            with dissolve
        elif zagadkamedic >= 1 and book_rest == 0:
            show ghost_pacient:
                xpos 200 yalign 1.0
                alpha 0.0
                easein 0.3 alpha 1.0
            characterpacient "Спасибо за эту беседу. Было очень познавательно. Как и обещал, держи свою книгу."
            $ reality += 1
            $ book_rest += 1
            show rest with fade:
                zoom 1.0 xalign 0 yalign 0
                alpha 0.0
                easein 0.3 alpha 1.0
            "+ Явь. Вы получили еще одну библиотечную книгу."
            hide rest
            hide ghost_pacient
            with dissolve
        elif zagadkamedic == 0:
            show ghost_pacient:
                xpos 200 yalign 1.0
                alpha 0.0
                easein 0.3 alpha 1.0
            characterpacient "Прости, но, кажется, я убедился, что призраки правы. Я не буду тебе помогать. Хотя и вижу, что ты человек неплохой, но этого недостаточно. Ступай своей дорогой."
            $ ghost += 1
            "+Призрак"
            hide ghost_pacient with dissolve
        show t1:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Нам пора, мой друг. Нужно спешить дальше, времени осталось совсем мало."
        hide t1 with dissolve
        if attack == 1:
            jump scene37_2_m_2
        else:
            jump scene37_2_m_1
        jump scene38
    elif gender == "G":
        "В этот раз [player_name] и Климент Аркадьевич оказались у краснокирпичного небольшого здания."
        show g6:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Здесь была больница?"
        show t1:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "У этого здания интересная история…"
        character "Расскажите."
        tmrz "Оно было построено в 1902 году на участке, принадлежавшем доктору медицины Владимиру Ивановичу Рамму."
        hide t1 with dissolve
        show t2:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Он увлекался издательским делом и мечтал открыть свой Полиграфический институт."
        hide g6 with dissolve
        show g5:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Дело неплохое."
        hide t2 with dissolve
        show t1:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Проблема была в том, что он был не самый честный человек."
        hide g5 with dissolve
        show g1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "И что случилось?"
        tmrz "Вместе со своим компаньоном Гавриловым Владимир Иванович Рамм занялся выпуском ежемесячного журнала «Живописное обозрение». Подписчикам обещали, что всего за семь рублей в год они получат, помимо самих выпусков журнала, более 300 различных книг в качестве подарков."
        hide t1 with dissolve
        show t2:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "С подписчиков было собрано более ста тысяч рублей. А в то время это были большие деньги. Вышло всего несколько номеров журнала, и на этом все. Читатели остались без журнала."
        hide g1 with dissolve
        show g5:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Хитро."
        hide t2 with dissolve
        show t1:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Эта издательская афера, которая, кстати, была не первой в жизни В. И. Рамма, вскрылась, и доктору медицины пришлось полностью менять привычный образ жизни. До этого он жил на широкую ногу."
        hide g5 with dissolve
        show g1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Надо же! А что стало с домом?"
        tmrz "В начале 1903 года имущество В. И. Рамма было конфисковано, дом продали, а сам доктор стал штатным сотрудником обычной газеты."
        hide g1 with dissolve
        show g6:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Печальная история…"
        tmrz "В 1908 году дом приобрела Обуховская больница. В здании разместилось Лейхтенбергское отделение больницы для лечения кожных заболеваний. Во время войны сюда возили раненых."
        hide g6 with dissolve
        show g1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Какая необычная судьба у дома…"
        tmrz "В Везенбергском квартале нет скучных домов."
        "Климент Аркадьевич подмигнул и кивнул в сторону дома."
        stop music fadeout 1.0
        play music haspit fadein 2.0 loop if_changed
        tmrz "Пойдем, есть предчувствие, что там нас ждет что-то зловещее."
        hide g1 with dissolve
        show g2:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Надеюсь, что это только предчувствие."
        hide g2
        hide t1
        with dissolve
        scene 3back6 with fade:
            size (1280, 720)
            fit "fill"
        "Из всех мест, которые [player_name] успела посетить, это оказалось самым эффектным и гнетущим."
        show g1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Ну почему мы попали именно в то время, когда здесь была больница."
        show t1:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Видимо, это самые яркие воспоминания, которые хранят эти стены."
        hide t1 with dissolve
        "[player_name] бродила по пустым палатам и старалась найти хоть какую-то подсказку."
        "Постели были расправлены и по-разному смяты, словно их хозяева только-только куда-то отошли и скоро вернутся."
        "И хотя здесь никого не было, острое чувство присутствия никуда не уходило."
        "Неизвестно, как долго [player_name] и Тимирязев рассматривали пространство вокруг. Но ничего не происходило."
        "[player_name] от скуки стала залезать в ящики и смотреть, что оставили призраки. Больничные бинты, лекарства, пустые пузырьки… Но никаких книг. Тогда [player_name] решила заглянуть в шкаф."
        hide g1 with dissolve
        show ghost_pacient:
                xpos 200 yalign 1.0
                alpha 0.0
                easein 0.3 alpha 1.0
        show g7:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Ты кто?!!!!"
        "Призрак, довольный эффектом, плавно выскользнул из шкафа."
        characterpacient "Знаешь, в нашем мире все так всполошились из-за твоего появления. Ушли даже на собрание, чтоб придумать новые козни."
        hide g7 with dissolve
        show g1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "А ты почему не там?"
        characterpacient "А меня не взяли. Сказали, что я постоянно бьюсь обо все углы, спотыкаюсь и вообще ничего не могу сделать. Только рассмешить тебя могу, а не напугать."
        "[player_name] с удивлением осознала, что ей стало обидно за призрака, ведь за собой она тоже часто замечала неуклюжесть. Это же не повод сразу кого-то списывать со счетов."
        hide g1 with dissolve
        show g2:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Они не правы. В шкафу ты меня сильно напугал."
        characterpacient "Не утешай меня. Мы все равно враги."
        hide g2 with dissolve
        show g1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Как скажешь."
        "Ненадолго повисла неловкая пауза. Призрак о чем-то раздумывал."
        characterpacient "Хотя… спасибо, что оценила."
        character "Нет проблем."
        "И снова пауза. Видимо, никто не знал, что делать дальше. На помощь пришел Климент Аркадьевич."
        show t1:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Знаешь, обычно призраки придумывают загадки или испытания…"
        characterpacient "Обычно да…"
        "Снова повисла пауза."
        character "Ты странный. Ты знаешь?"
        characterpacient "Да… Мне говорили."
        character "..."
        characterpacient "..."
        tmrz "..."
        character "Может, у тебя для меня есть загадка?"
        characterpacient "Загадка? Нет-Нет… Это я не умею придумывать."
        hide g1 with dissolve
        show g2:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Испытание?"
        characterpacient "Нееее, это еще сложнее."
        character "Может быть, бой?"
        characterpacient "Ты смеешься? Я капельницу за собой везде таскаю. Как я драться буду?"
        hide g2 with dissolve
        hide t1 with dissolve
        hide ghost_pacient with dissolve
        if book_rest == 1:
            show ghost_pacient:
                xpos 200 yalign 1.0
                alpha 0.0
                easein 0.3 alpha 1.0
            characterpacient "Давай так. Ты расскажешь мне о своем мире, и, если рассказ мне понравится, я тебе дам подсказку."
            show t1:
                zoom 1.0 xalign 1.3 yalign 1.0
                alpha 0.0
                easein 0.3 alpha 1.0
            tmrz "Будь осторожна, мне кажется, его нельзя расстраивать."
            show g1:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
            character "Хорошо. Что ты хочешь знать?"
            hide g1
            hide t1
            hide ghost_pacient
            with dissolve
        elif book_rest == 0:
            show g1:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
            character "Так, а может, ты мне просто подаришь книгу?"
            show ghost_pacient:
                xpos 200 yalign 1.0
                alpha 0.0
                easein 0.3 alpha 1.0
            characterpacient "Нееет, хитрюга. Так просто я тебе ее не отдам."
            characterpacient "Давай так. Ты расскажешь мне о своем мире, и, если рассказ мне понравится, я тебе отдам книжку."
            show t1:
                zoom 1.0 xalign 1.3 yalign 1.0
                alpha 0.0
                easein 0.3 alpha 1.0
            tmrz "Будь осторожна, мне кажется, его нельзя расстраивать."
            character "Хорошо. Что ты хочешь знать?"
            hide g1
            hide t1
            hide ghost_pacient
            with dissolve
        show ghost_pacient:
            xpos 200 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        characterpacient "Расскажи, спокойно ли в вашем мире?"
        hide ghost_pacient with dissolve
        menu:
            "Люди остаются людьми":
                show g2:
                    zoom 1.0 xalign -0.3 yalign 0.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                character "Каждый старается сделать как лучше, но не всегда все сходятся во мнении."
                $ zagadkamedic += 1
                "Призраку нравится ваш ответ."
                hide g2 with dissolve
            "Ничего не меняется. Все злые и вредные. Особенно с утра":
                "Призраку не нравится ваш ответ."
                show ghost_pacient:
                    xpos 200 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                characterpacient "А может, ты просто не хочешь видеть хорошее?"
                hide ghost_pacient with dissolve
            "Относительно спокойно":
                show ghost_pacient:
                    xpos 200 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                characterpacient "Относительно чего?"
                show g2:
                    zoom 1.0 xalign -0.3 yalign 0.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                character "Не знаю."
                characterpacient "А зачем ты говоришь, если не знаешь?"
                "Призраку не нравится ваш ответ."
                hide g2
                hide ghost_pacient
                with dissolve
        show ghost_pacient:
            xpos 200 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        characterpacient "А какие технологии у вас появились?"
        hide ghost_pacient with dissolve
        menu:
            "Появилась коробка, в которой хранится информация про все и обо всем":
                show ghost_pacient:
                    xpos 200 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                characterpacient "Это как?"
                show g2:
                    zoom 1.0 xalign -0.3 yalign 0.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                character "Их называют компьютеры. Они помогают людям работать, искать информацию об окружающем мире, там можно писать и сохранять свои… книги, например. И новости теперь люди узнают через интернет, а не с помощью газет."
                characterpacient "Интернет?"
                character "Всемирная сеть. Туда заходят через компьютеры со всего мира и пишут все, что происходит."
                characterpacient "Ты выдумываешь."
                character "Не выдумываю!"
                characterpacient "Нет, это какая-то бессвязная сказка. Так не бывает."
                "Призраку не нравится ваш ответ."
                hide ghost_pacient
                hide g2
                with dissolve
            "Появились у каждого личные устройства для общения на расстоянии":
                show ghost_pacient:
                    xpos 200 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                characterpacient "Это как?"
                show g1:
                    zoom 1.0 xalign -0.3 yalign 0.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                character "Мы носим с собой прямоугольные устройства и в любой момент можем друг другу позвонить по ним."
                characterpacient "Как волшебное блюдце в сказках?"
                character "Ну почти. Используются радиоволны с определенными частотами. Эти устройства их ловят и передают связь."
                characterpacient "Наверно, это очень удобно."
                character "Пожалуй."
                $ zagadkamedic += 1
                "Призраку нравится ваш ответ."
                hide ghost_pacient
                hide g1
                with dissolve
            "Не знаю":
                show ghost_pacient:
                    xpos 200 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                characterpacient "Так это же твой мир, который ты защищаешь. Неужели ты не можешь похвалиться тем, чего вы добились."
                show g2:
                    zoom 1.0 xalign -0.3 yalign 0.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                character "Да так сразу и не вспомнишь!"
                characterpacient "Странный ты человек, совсем не интересуешься тем, что тебя окружает, а хочешь зачем-то этот мир спасти."
                "Призраку не нравится ваш ответ."
                characterpacient "Вы помните о нас? О том, что было здесь? Люди хранят память об этих местах?"
                hide ghost_pacient
                hide g2
                with dissolve
                menu:
                    "Да":
                        show g2:
                            zoom 1.0 xalign -0.3 yalign 0.0
                            alpha 0.0
                            easein 0.3 alpha 1.0
                        character "Хранят, изучают, стараются рассказывать. Когда я пришла в библиотеку, я увидела, что люди читают про Везенбергский квартал. Ищут о нем информацию, водят по нему экскурсии."
                        show ghost_pacient:
                            xpos 200 yalign 1.0
                            alpha 0.0
                            easein 0.3 alpha 1.0
                        characterpacient "Приятно знать. Значит, призраки не очень справедливы к вам."
                        character "Думаю, что да."
                        $ zagadkamedic += 1
                        "Призраку нравится ваш ответ."
                        hide ghost_pacient
                        hide g2
                        with dissolve
                    "По-разному":
                        show g2:
                            zoom 1.0 xalign -0.3 yalign 0.0
                            alpha 0.0
                            easein 0.3 alpha 1.0
                        character "Много тех, кто изучает историю, читает архивы и пишет научные работы. Однако мы потеряли много исторических домов. Не смогли их сохранить и защитить. Уничтожили своим равнодушием."
                        show ghost_pacient:
                            xpos 200 yalign 1.0
                            alpha 0.0
                            easein 0.3 alpha 1.0
                        characterpacient "Спасибо за честный ответ."
                        $ zagadkamedic += 1
                        "Призраку нравится ваш ответ."
                        hide ghost_pacient
                        hide g2
                        with dissolve
                    "Нет":
                        show g2:
                            zoom 1.0 xalign -0.3 yalign 0.0
                            alpha 0.0
                            easein 0.3 alpha 1.0
                        character "Стыдно признаться, но я мало знаю о том, как сохраняют память об этих местах. До этого дня я не знала о существовании этого квартала."
                        show ghost_pacient:
                            xpos 200 yalign 1.0
                            alpha 0.0
                            easein 0.3 alpha 1.0
                        characterpacient "Что ж, тогда я надеюсь, ты не удивляешься тому, что призраки квартала разозлились на вас."
                        character "Теперь я понимаю."
                        "Призрака разочаровал ваш ответ."
                        hide ghost_pacient
                        hide g2
                        with dissolve
        if zagadkamedic >= 1 and book_rest == 1:
            show ghost_pacient:
                xpos 200 yalign 1.0
                alpha 0.0
                easein 0.3 alpha 1.0
            characterpacient "Спасибо за эту беседу. Было очень познавательно. В благодарность я тебя предупрежу — опасайся призрачных полицейских. Уж очень они подозрительные."
            show g1:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
            character "Спасибо."
            $ reality += 1
            "+ Явь"
            hide g1
            hide ghost_pacient
            with dissolve
        elif zagadkamedic >= 1 and book_rest == 0:
            show ghost_pacient:
                xpos 200 yalign 1.0
                alpha 0.0
                easein 0.3 alpha 1.0
            characterpacient "Спасибо за эту беседу. Было очень познавательно. Как и обещал, держи свою книгу."
            $ reality += 1
            "+ Явь. Вы получили еще одну библиотечную книгу."
            $ book_rest += 1
            show rest with fade:
                zoom 1.0 xalign 0 yalign 0
                alpha 0.0
                easein 0.3 alpha 1.0
            hide rest
            hide ghost_pacient
            with dissolve
        elif zagadkamedic == 0:
            show ghost_pacient:
                xpos 200 yalign 1.0
                alpha 0.0
                easein 0.3 alpha 1.0
            characterpacient "Прости, но, кажется, я убедился, что призраки правы. Я не буду тебе помогать. Хотя и вижу, что ты человек неплохой, но этого недостаточно. Ступай своей дорогой."
            $ ghost += 1
            "+Призрак"
            hide ghost_pacient with dissolve
        show t1:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Нам пора, мой друг. Нужно спешить дальше, времени осталось совсем мало."
        hide t1 with dissolve
        if attack == 1:
            jump scene37_2_g_2
        else:
            jump scene37_2_g_1
        jump scene38

label scene_pht:
    $ seria4vibr += 1
    $ scenepht += 1
    scene 3back10 with fade:
        size (1280, 720)
        fit "fill"
    stop music fadeout 2.0
    play music bany fadein 2.0 loop if_changed
    if gender == "M":
        "Фотостудия располагалась в доме на углу  Везенбергской улицы. На первом этаже находилась рюмочная, [player_name] с тоской вспомнил, что сейчас, в наше время, в этом доме есть кофейня."
        "Силы уже покидали в сражениях с призраками. И кофе бы совсем не помешал."
        show m1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Всегда нравились подобные здания, где из кирпича на фасаде выложен рисунок, словно это вышивка."
        show t1:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Да, хитрый способ украсить здания без дополнительной скульптуры."
        character "Здесь находилась фотостудия? Она имела успех?"
        hide t1 with dissolve
        show t2:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Конечно, рядом же два вокзала — места встреч и расставаний. Раньше не так просто было сделать фото, а сфотографироваться на память очень хотелось."
        character "Я помню, что вы любите фотографировать."
        hide t2 with dissolve
        show t1:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Конечно."
        character "Вам бы хотелось попасть в наше время? Теперь столько устройств для фотографии. И фотографировать теперь может буквально каждый."
        tmrz "Я всегда был убежден, что придет время, когда люди будут чаще бродить по лесам и полям не с ружьем, а с камерой фотографа за плечами."
        hide t1 with dissolve
        show t2:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "И не затем, чтобы подшибить несчастную пичужку и лишь мимоходом, урывками полюбоваться на природу, а затем именно, чтобы любоваться природой и при случае унести с собой возможно художественное ее воспроизведение."
        "Эта цитата действительно принадлежит Клименту Аркадьевичу Тимирязеву."
        character "Вы оказались правы."
        hide t2 with dissolve
        show t1:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Пойдем, мой друг. Познакомимся с фотостудией Агафонова."
        hide t1
        hide m1
        with dissolve
        scene 3back11 with fade:
            size (1280, 720)
            fit "fill"
        "Фотостудия была небольшой. Всюду стояло специальное оборудование."
        "[player_name] приблизился к столу. Здесь лежал фотоальбом с различными фотографиями."
        "[player_name] осмотрел несколько снимков, и особенно его привлекла фотография маленькой девочки."
        show m1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Такие все суровые на фото. Совсем не улыбаются."
        show ghost_children:
            size (1280, 720)
            fit "fill"
            zoom 1.0 xalign 0.7 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        characterchildren "Вот так?!"
        "Прямо перед столом появился призрак маленькой девочки. Она от уха до уха улыбнулась и, захохотав, стала бегать по комнате."
        "От неожиданности [player_name] отшатнулся от стола."
        hide ghost_children
        hide m1
        with dissolve
        if book_rest > 0: # >0
            show ghost_children:
                size (1280, 720)
                fit "fill"
                zoom 1.0 xalign 0.7 yalign 1.0
                alpha 0.0
                easein 0.3 alpha 1.0
            $ book_rest -= 1
            "[player_name] не заметил, как, воспользовавшись его смятением, девочка выхватила из рук недавно найденную книгу, которую еще не спрятали в рюкзак."
            show m2:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
            character "А ну отдай! Я ее честно отвоевал!"
            characterchildren "Не догонишь, не догонишь!"
            "Поддавшись на игру, [player_name] начал гоняться за вредным призраком."
            "Отбежав на достаточное расстояние, девочка развернулась и показала язык."
            character "А ну иди сюда, маленькая гадость!"
            show t1:
                zoom 1.0 xalign 1.3 yalign 1.0
                alpha 0.0
                easein 0.3 alpha 1.0
            tmrz "А ну стой!"
            "[player_name] почувствовал, что Климент Аркадьевич схватил его за шиворот, остановив беготню."
            tmrz "Она-то маленькая, а ты куда?"
            character "Сейчас я быстро ей ремня дам, если родители не воспитывали!"
            "Девочка стояла на безопасном расстоянии и продолжала корчить рожицы за спиной Климента Аркадьевича."
            tmrz "Остынь! Веди себя как взрослый."
            hide m2 with dissolve
            show m6:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
            character "Лаааадно."
            hide m6 with dissolve
            show m2:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
            character "Что тебе надо?"
            "Коварно усмехаясь, девочка ковыряла ножкой пол."
            characterchildren "Нууу, не знаю."
            hide m2 with dissolve
            show m1:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
            character "Давай, как взрослый призрак. Придумай загадку, и если я ее решу, оставляю книжку себе. А если нет, ее забираешь ты!"
            "Девочка заинтересованно и осторожно посмотрела в ответ."
            characterchildren "Ты поиграешь со мной?"
            character "Во что?"
            characterchildren "Хочу в прятки!!! Прятки! ПРЯТКИ!!!"
            character "Хорошо-хорошо! Прячься."
            characterchildren "Ну нет! Я большая! Ты меня тут быстро найдешь! Я спрячу твою книгу!  Отвернись."
            "[player_name], понимая, что у него нет выбора, вздохнул и отвернулся."
            characterchildren "Все! Поворачивайся!"
            "Найдите в комнате книгу и нажмите на нее."
            hide m1
            hide t1
            hide ghost_children
            with dissolve
            label scene_pht_1_m:
                window hide
                $ return_label = "scene_pht_1_timeout_m"  # Куда перейти при тайм-ауте
                show screen choice_timer(15)             # Таймер на 15 секунд
                call screen find_item_game_1
                if _return == "found":
                    hide screen choice_timer
                $ book_rest += 1
                window show
                show rest with fade:
                    zoom 1.0 xalign 0 yalign 0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                "Вы нашли книгу, теперь вы можете ее забрать."
                hide rest with dissolve
                show ghost_children:
                    size (1280, 720)
                    fit "fill"
                    zoom 1.0 xalign 0.7 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                characterchildren "Ууууууу, вредина! Я думала, не заметишь! Ну и проваливай! Не хочу больше с тобой играть. Неинтересно."
                show t1:
                    zoom 1.0 xalign 1.3 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                tmrz "Молодец, мой друг. Здесь нам больше нечего делать."
                hide t1
                hide ghost_children
                with dissolve
                if attack == 1:
                    jump scene37_2_m_2
                else:
                    jump scene37_2_m_1
                jump scene38
                label scene_pht_1_timeout_m:
                    show ghost_children:
                        size (1280, 720)
                        fit "fill"
                        zoom 1.0 xalign 0.7 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    characterchildren "Ураааа! У тебя не вышло! Я забираю ее!"
                    characterchildren "А мне говорили: «она маленькая, ни на что не годна»! А я тебя обдурила!!!!"
                    "Девочка радостно скакала вокруг. И ужасно раздражала."
                    show t1:
                        zoom 1.0 xalign 1.3 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    tmrz "Придется признать поражение."
                    "Вы потеряли одну книгу."
                    tmrz "Ничего, у нас еще есть возможность победить. Пойдем."
                    $ ghost += 1
                    "+ Призрак"
                    hide t1
                    hide ghost_children
                    with dissolve
                    if attack == 1:
                        jump scene37_2_m_2
                    else:
                        jump scene37_2_m_1
                    jump scene38
        elif book_rest == 0:
            show ghost_children:
                size (1280, 720)
                fit "fill"
                zoom 1.0 xalign 0.7 yalign 1.0
                alpha 0.0
                easein 0.3 alpha 1.0
            characterchildren "Поиграй со мной!"
            show m2:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
            character "Я тороплюсь!"
            characterchildren "А у меня есть книжка!"
            "Девочка, захохотав, продемонстрировала ее."
            characterchildren "Если поиграешь со мной, то отдам ее тебе!"
            character "Я не маленький, чтобы играться. Отдай!"
            "[player_name] попробовал схватить девчонку, но та ловко вывернулась."
            characterchildren "Не догонишь! Не догонишь!"
            "Поддавшись на игру, [player_name] начал гоняться за вредным призраком."
            "Отбежав на достаточное расстояние, девочка развернулась и показала язык."
            character "А ну иди сюда, маленькая гадость!"
            show t1:
                zoom 1.0 xalign 1.3 yalign 1.0
                alpha 0.0
                easein 0.3 alpha 1.0
            tmrz "А ну стой!"
            "[player_name] почувствовал, что Климент Аркадьевич схватил его за шиворот, остановив беготню."
            tmrz "Она-то маленькая, а ты куда?"
            character "Сейчас я быстро ей ремня дам, если родители не воспитывали!"
            "Девочка стояла на безопасном расстоянии и продолжала корчить рожицы за спиной Климента Аркадьевича."
            tmrz "Остынь! Веди себя как взрослый."
            hide m2 with dissolve
            show m6:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
            character "Лаааадно."
            hide m6 with dissolve
            show m2:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
            character "Что тебе надо?"
            "Коварно усмехаясь,  девочка ковыряла ножкой пол."
            characterchildren "Нууу не знаю."
            character "Давай, как взрослый призрак. Придумай загадку, и если я ее решу, оставляю книжку себе. А если нет, ее забираешь ты!"
            "Девочка заинтересованно и осторожно посмотрела в ответ."
            characterchildren "Ты поиграешь со мной?"
            hide m2 with dissolve
            show m1:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
            character "Во что?"
            characterchildren "Хочу в прятки!!! Прятки! ПРЯТКИ!!!"
            hide m1 with dissolve
            show m2:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
            character "Хорошо-хорошо! Прячься."
            characterchildren "Ну нет! Я большая! Ты меня тут быстро найдешь! Я спрячу твою книгу!  Отвернись."
            "[player_name], понимая, что у него нет выбора, вздохнул и отвернулся."
            characterchildren "Все! Поворачивайся!"
            "Найдите в комнате книгу и нажмите на нее."
            hide m2
            hide t1
            hide ghost_children
            with dissolve
            label scene_pht_2_m:
                window hide
                $ return_label = "scene_pht_2_timeout_m"  # Куда перейти при тайм-ауте
                show screen choice_timer(15)             # Таймер на 15 секунд
                call screen find_item_game_1
                if _return == "found":
                    hide screen choice_timer
                $ book_rest += 1
                show rest with fade:
                    zoom 1.0 xalign 0 yalign 0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                window show
                $ reality += 1
                "Вы нашли книгу, теперь вы можете ее забрать. + Явь"
                hide rest with dissolve
                show ghost_children:
                    size (1280, 720)
                    fit "fill"
                    zoom 1.0 xalign 0.7 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                characterchildren "Ууууууу, вредина! Я думала, не заметишь! Ну и проваливай! Не хочу больше с тобой играть. Неинтересно."
                show t1:
                    zoom 1.0 xalign 1.3 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                tmrz "Молодец, мой друг. Здесь нам больше нечего делать."
                hide t1
                hide ghost_children
                with dissolve
                if attack == 1:
                    jump scene37_2_m_2
                else:
                    jump scene37_2_m_1
                jump scene38
                label scene_pht_2_timeout_m:
                    show ghost_children:
                        size (1280, 720)
                        fit "fill"
                        zoom 1.0 xalign 0.7 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    window show
                    characterchildren "Ураааа! У тебя не вышло! Я забираю ее!"
                    characterchildren "А мне говорили: «она маленькая, ни на что не годна»! А я тебя обдурила!!!!"
                    "Девочка радостно скакала вокруг. И ужасно раздражала."
                    show t1:
                        zoom 1.0 xalign 1.3 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    tmrz "Придется признать поражение."
                    "Вы потеряли одну книгу."
                    tmrz "Ничего, у нас еще есть возможность победить. Пойдем."
                    hide t1
                    hide ghost_children
                    with dissolve
                    if attack == 1:
                        jump scene37_2_m_2
                    else:
                        jump scene37_2_m_1
                    jump scene38
    elif gender == "G":
        "Фотостудия располагалась в доме на углу  Везенбергской улицы. На первом этаже находилась рюмочная, [player_name] с тоской вспомнила, что сейчас, в наше время, в этом доме есть кофейня."
        "Силы уже покидали в сражениях с призраками. И кофе бы совсем не помешал."
        show g1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Всегда нравились подобные здания, где из кирпича на фасаде выложен рисунок, словно это вышивка."
        show t1:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Да, хитрый способ украсить здания без дополнительной скульптуры."
        character "Здесь находилась фотостудия? Она имела успех?"
        hide t1 with dissolve
        show t2:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Конечно, рядом же два вокзала — места встреч и расставаний. Раньше не так просто было сделать фото, а сфотографироваться на память очень хотелось."
        character "Я помню, что вы любите фотографировать."
        hide t2 with dissolve
        show t1:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Конечно."
        character "Вам бы хотелось попасть в наше время? Теперь столько устройств для фотографии. И фотографировать теперь может буквально каждый."
        tmrz "Я всегда был убежден, что придет время, когда люди будут чаще бродить по лесам и полям не с ружьем, а с камерой фотографа за плечами."
        hide t1 with dissolve
        show t2:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "И не затем, чтобы подшибить несчастную пичужку и лишь мимоходом, урывками полюбоваться на природу, а затем именно, чтобы любоваться природой и при случае унести с собой возможно художественное ее воспроизведение."
        "Эта цитата действительно принадлежит Клименту Аркадьевичу Тимирязеву."
        character "Вы оказались правы."
        hide t2 with dissolve
        show t1:
            zoom 1.0 xalign 1.3 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        tmrz "Пойдем, мой друг. Познакомимся с фотостудией Агафонова."
        hide t1
        hide g1
        with dissolve
        scene 3back11 with fade:
            size (1280, 720)
            fit "fill"
        "Фотостудия была небольшой. Всюду стояло специальное оборудование."
        "[player_name] приблизилась к столу. Здесь лежал фотоальбом с различными фотографиями."
        "[player_name] осмотрела несколько снимков, и особенно ее привлекла фотография маленькой девочки. "
        show g1:
            zoom 1.0 xalign -0.3 yalign 0.0
            alpha 0.0
            easein 0.3 alpha 1.0
        character "Такие все суровые на фото. Совсем не улыбаются."
        show ghost_children:
            size (1280, 720)
            fit "fill"
            zoom 1.0 xalign 0.7 yalign 1.0
            alpha 0.0
            easein 0.3 alpha 1.0
        characterchildren "Вот так?!"
        "Прямо перед столом появился призрак маленькой девочки. Она от уха до уха улыбнулась и, захохотав, стала бегать по комнате."
        "От неожиданности [player_name] отшатнулась от стола."
        hide ghost_children
        hide g1
        with dissolve
        if book_rest > 0: # >0
            show ghost_children:
                size (1280, 720)
                fit "fill"
                zoom 1.0 xalign 0.7 yalign 1.0
                alpha 0.0
                easein 0.3 alpha 1.0
            $ book_rest -= 1
            "[player_name] не заметила, как, воспользовавшись ее смятением, девочка выхватила из рук недавно найденную книгу, которую еще не спрятали в рюкзак."
            show g2:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
            character " А ну отдай! Я ее честно отвоевала!"
            characterchildren "Не догонишь, не догонишь!"
            "Поддавшись на игру, [player_name] начала гоняться за вредным призраком."
            "Отбежав на достаточное расстояние, девочка развернулась и показала язык."
            character "А ну иди сюда, маленькая гадость!"
            show t1:
                zoom 1.0 xalign 1.3 yalign 1.0
                alpha 0.0
                easein 0.3 alpha 1.0
            tmrz "А ну стой!"
            "[player_name] почувствовала, что Климент Аркадьевич схватил ее за шиворот, остановив беготню."
            tmrz "Она-то маленькая, а ты куда?"
            character "Сейчас я быстро ей ремня дам, если родители не воспитывали!"
            "Девочка стояла на безопасном расстоянии и продолжала корчить рожицы за спиной Климента Аркадьевича."
            tmrz "Остынь! Веди себя как взрослая."
            hide g2 with dissolve
            show g6:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
            character "Лаааадно."
            hide g6 with dissolve
            show g2:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
            character "Что тебе надо?"
            "Коварно усмехаясь, девочка ковыряла ножкой пол."
            characterchildren "Нууу, не знаю."
            hide g2 with dissolve
            show g1:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
            character "Давай, как взрослый призрак. Придумай загадку, и если я ее решу, оставляю книжку себе. А если нет, ее забираешь ты!"
            "Девочка заинтересованно и осторожно посмотрела в ответ."
            characterchildren "Ты поиграешь со мной?"
            character "Во что?"
            characterchildren "Хочу в прятки!!! Прятки! ПРЯТКИ!!!"
            character "Хорошо-хорошо! Прячься."
            characterchildren "Ну нет! Я большая! Ты меня тут быстро найдешь! Я спрячу твою книгу!  Отвернись."
            "[player_name], понимая, что у нее нет выбора, вздохнула и отвернулась."
            characterchildren "Все! Поворачивайся!"
            "Найдите в комнате книгу и нажмите на нее."
            hide g1
            hide t1
            hide ghost_children
            with dissolve
            label scene_pht_1_g:
                window hide
                $ return_label = "scene_pht_1_timeout_g"  # Куда перейти при тайм-ауте
                show screen choice_timer(15)             # Таймер на 15 секунд
                call screen find_item_game_1
                if _return == "found":
                    hide screen choice_timer
                $ book_rest += 1
                window show
                $ reality += 1
                show rest with fade:
                    zoom 1.0 xalign 0 yalign 0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                "Вы нашли книгу, теперь вы можете ее забрать. + Явь"
                hide rest with dissolve
                show ghost_children:
                    size (1280, 720)
                    fit "fill"
                    zoom 1.0 xalign 0.7 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                characterchildren "Ууууууу, вредина! Я думала, не заметишь! Ну и проваливай! Не хочу больше с тобой играть. Неинтересно."
                show t1:
                    zoom 1.0 xalign 1.3 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                tmrz "Молодец, мой друг. Здесь нам больше нечего делать."
                hide t1
                hide ghost_children
                with dissolve
                if attack == 1:
                    jump scene37_2_g_2
                else:
                    jump scene37_2_g_1
                jump scene38
                label scene_pht_1_timeout_g:
                    show ghost_children:
                        size (1280, 720)
                        fit "fill"
                        zoom 1.0 xalign 0.7 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    characterchildren "Ураааа! У тебя не вышло! Я забираю ее!"
                    characterchildren "А мне говорили: «она маленькая, ни на что не годна»! А я тебя обдурила!!!!"
                    "Девочка радостно скакала вокруг. И ужасно раздражала."
                    $ ghost += 1
                    "+ Призрак"
                    show t1:
                        zoom 1.0 xalign 1.3 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    tmrz "Придется признать поражение."
                    "Вы потеряли одну книгу."
                    tmrz "Ничего, у нас еще есть возможность победить. Пойдем."
                    hide t1
                    hide ghost_children
                    with dissolve
                    if attack == 1:
                        jump scene37_2_g_2
                    else:
                        jump scene37_2_g_1
                    jump scene38
        elif book_rest == 0:
            show ghost_children:
                size (1280, 720)
                fit "fill"
                zoom 1.0 xalign 0.7 yalign 1.0
                alpha 0.0
                easein 0.3 alpha 1.0
            characterchildren "Поиграй со мной!"
            show g2:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
            character "Я тороплюсь!"
            characterchildren "А у меня есть книжка!"
            "Девочка, захохотав, продемонстрировала ее."
            characterchildren "Если поиграешь со мной, то отдам ее тебе!"
            character "Я не маленькая, чтобы играться. Отдай!"
            "[player_name] попробовала схватить девчонку, но та ловко вывернулась."
            characterchildren "Не догонишь! Не догонишь!"
            "Поддавшись на игру, [player_name] начала гоняться за вредным призраком."
            "Отбежав на достаточное расстояние, девочка развернулась и показала язык."
            character "А ну иди сюда, маленькая гадость!"
            show t1:
                zoom 1.0 xalign 1.3 yalign 1.0
                alpha 0.0
                easein 0.3 alpha 1.0
            tmrz "А ну стой!"
            "[player_name] почувствовала, что Климент Аркадьевич схватил ее за шиворот, остановив беготню."
            tmrz "Она-то маленькая, а ты куда?"
            character "Сейчас я быстро ей ремня дам, если родители не воспитывали!"
            "Девочка стояла на безопасном расстоянии и продолжала корчить рожицы за спиной Климента Аркадьевича."
            tmrz "Остынь! Веди себя как взрослая."
            hide g2 with dissolve
            show g6:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
            character "Лаааадно."
            hide g6 with dissolve
            show g2:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
            character "Что тебе надо?"
            "Коварно усмехаясь,  девочка ковыряла ножкой пол."
            characterchildren "Нууу не знаю."
            character "Давай, как взрослый призрак. Придумай загадку, и если я ее решу, оставляю книжку себе. А если нет, ее забираешь ты!"
            "Девочка заинтересованно и осторожно посмотрела в ответ."
            characterchildren "Ты поиграешь со мной?"
            hide g2 with dissolve
            show g1:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
            character "Во что?"
            characterchildren "Хочу в прятки!!! Прятки! ПРЯТКИ!!!"
            hide g1 with dissolve
            show g2:
                zoom 1.0 xalign -0.3 yalign 0.0
                alpha 0.0
                easein 0.3 alpha 1.0
            character "Хорошо-хорошо! Прячься."
            characterchildren "Ну нет! Я большая! Ты меня тут быстро найдешь! Я спрячу твою книгу!  Отвернись."
            "[player_name], понимая, что у нее нет выбора, вздохнула и отвернулась."
            characterchildren "Все! Поворачивайся!"
            "Найдите в комнате книгу и нажмите на нее."
            hide g2
            hide t1
            hide ghost_children
            with dissolve
            label scene_pht_2_g:
                window hide
                $ return_label = "scene_pht_2_timeout_g"  # Куда перейти при тайм-ауте
                show screen choice_timer(15)             # Таймер на 15 секунд
                call screen find_item_game_1
                if _return == "found":
                    hide screen choice_timer
                $ book_rest += 1
                show rest with fade:
                    zoom 1.0 xalign 0 yalign 0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                window show
                "Вы нашли книгу, теперь вы можете ее забрать."
                hide rest with dissolve
                show ghost_children:
                    size (1280, 720)
                    fit "fill"
                    zoom 1.0 xalign 0.7 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                characterchildren "Ууууууу, вредина! Я думала, не заметишь! Ну и проваливай! Не хочу больше с тобой играть. Неинтересно."
                show t1:
                    zoom 1.0 xalign 1.3 yalign 1.0
                    alpha 0.0
                    easein 0.3 alpha 1.0
                tmrz "Молодец, мой друг. Здесь нам больше нечего делать."
                hide t1
                hide ghost_children
                with dissolve
                if attack == 1:
                    jump scene37_2_g_2
                else:
                    jump scene37_2_g_1
                jump scene38
                label scene_pht_2_timeout_g:
                    show ghost_children:
                        size (1280, 720)
                        fit "fill"
                        zoom 1.0 xalign 0.7 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    window show
                    characterchildren "Ураааа! У тебя не вышло! Я забираю ее!"
                    characterchildren "А мне говорили: «она маленькая, ни на что не годна»! А я тебя обдурила!!!!"
                    "Девочка радостно скакала вокруг. И ужасно раздражала."
                    show t1:
                        zoom 1.0 xalign 1.3 yalign 1.0
                        alpha 0.0
                        easein 0.3 alpha 1.0
                    tmrz "Придется признать поражение."
                    "Вы потеряли одну книгу."
                    tmrz "Ничего, у нас еще есть возможность победить. Пойдем."
                    hide t1
                    hide ghost_children
                    with dissolve
                    if attack == 1:
                        jump scene37_2_g_2
                    else:
                        jump scene37_2_g_1
                    jump scene38

