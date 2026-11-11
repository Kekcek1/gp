# Черновик Яндекс Игр — тексты и настройки

Ниже — готовые значения для Консоли разработчика. Поля заполняются отдельно
для каждого языка; медиаматериалы тоже должны соответствовать языку.

## Общее (одинаково для всех языков)

| Поле | Значение |
|---|---|
| Версия | `1.0.0` |
| Архив | `dist/starhook-yandex.zip` |
| Поддерживаемые платформы | Десктоп; Мобильные — Android, iOS |
| Ориентация | Любая |
| Возрастной рейтинг | 0+ |
| Игра переведена на | русский, английский, турецкий |
| Облачные сохранения | Да |
| Инап-покупки | Нет |
| Категории | Казуальные; Симуляторы |
| Отсроченная публикация | На усмотрение разработчика |

### Ключевые слова (≤100 символов, нижний регистр)

- RU: `рыбалка, ночное небо, созвездия, коллекция рыб, уютная игра, казуальная, звёзды, озеро`
- EN: `fishing, night sky, constellations, fish collection, cozy game, casual, stars, lake`
- TR: `balıkçılık, gece göğü, takımyıldız, balık koleksiyonu, huzurlu oyun, yıldızlar, göl`

### Теги (до 20)

- RU: рыбалка, ночное небо, созвездия, коллекция, уютная игра, казуальная,
  симулятор, атмосфера, звёзды, озеро, улучшения, задания, достижения,
  облачные сохранения, рейтинг, одна рука, без насилия, фэнтези, спокойствие, исследование.
- EN: fishing, night sky, constellations, collection, cozy, casual, simulator,
  atmosphere, stars, lake, upgrades, quests, achievements, cloud saves, leaderboard,
  one hand, non-violent, fantasy, relaxing, exploration.
- TR: balıkçılık, gece göğü, takımyıldızlar, koleksiyon, huzurlu, gündelik, simülatör,
  atmosfer, yıldızlar, göl, geliştirmeler, görevler, başarımlar, bulut kaydı,
  liderlik tablosu, tek el, şiddetsiz, fantastik, sakin, keşif.

### Комментарий разработчика для модерации (≤2048)

> Игра полностью локализована на русский, английский и турецкий. Язык определяется
> через `ysdk.environment.i18n.lang` на старте, до показа меню.
> SDK инициализируется по документации; `LoadingAPI.ready()` вызывается после
> фактической готовности меню; `GameplayAPI.start()/stop()` размечены на входе
> в игру, модальных окнах, паузе, рекламе и при уходе со вкладки.
> Звук останавливается при потере фокуса, сворачивании вкладки и во время рекламы.
> Контекстное меню отключено в игровой области.
> Инап-покупок нет. Реклама: rewarded по желанию на карточке улова (удвоение искр)
> и редкий interstitial при переходе в меню после 3 минут игры; звук на паузе.
> Прогресс сохраняется локально и в облаке через `player.setData/getData`.
> Для рейтинга нужно создать лидерборд с техническим именем `starhook_score`
> (числовой, сортировка по убыванию). Если лидерборд не создан, игра корректно
> показывает локальные рекорды.
> В архиве нет внешних ассетов, сетевых запросов, сторонней авторизации и покупок.
> Чек-лист самопроверки и результаты тестов — в `QA_REPORT.md`.

## Русский (RU)

### Название (≤50)

`Звездолов`

### SEO-описание (50–160)

`Звездолов — уютная рыбалка в ночном небе: 48 видов светящихся рыб, шесть созвездий и тихие вечера. Играйте онлайн в браузере.`

Длина: 132 символа.

### Короткое описание (≤70)

`Уютная рыбалка под звёздами: 48 видов, созвездия и тихие вечера.`

### Об игре (100–1000)

`«Звездолов» — спокойная игра о рыбалке на краю ночного неба. Вы — новый смотритель озера, оставшегося без звёзд. Забрасывайте удочку, следите за поплавком и вываживайте светящихся рыб: каждая поимка возвращает в воду немного света.

В игре шесть рукотворных локаций, 48 видов рыб, 14 глав истории, 24 достижения, ежедневные задания и шесть легендарных хранителей, каждый из которых возвращает на небо своё созвездие. Улучшайте снасти, выбирайте наживку, собирайте коллекцию и открывайте новые берега.

Управление одним пальцем, без таймеров и обязательных покупок. Прогресс сохраняется автоматически, в том числе в облаке. Играйте в своём темпе — небо умеет ждать.`

### Как играть (100–1000)

`Зажмите круглую кнопку и отпустите, когда шкала силы окажется в золотой зоне. Когда поплавок уйдёт под воду, тапните по экрану или нажмите пробел. Затем удерживайте кнопку, чтобы подматывать леску, и отпускайте, когда натяжение подходит к красной зоне. Держите натяжение в зелёной зоне, чтобы получить бонус за идеальную подмотку.

Следите за знамениями: когда они сойдутся, из глубины поднимется хранитель. Выполняйте задания, улучшайте снасти, покупайте наживки и открывайте новые локации. Игра работает мышью, пальцем и клавиатурой. Звук и уменьшение движения можно настроить в меню.`

### Медиа

- Иконка: `store/icon-512.png`
- Maskable: `store/icon-maskable-512.png`
- Обложка: `store/cover-ru-800x470.png`
- Витрина: `store/hero-ru-1560x520.png`
- Скриншоты: `store/screenshot-desktop-*-ru.png`, `store/screenshot-mobile-*-ru.png`
- Видео: `store/starhook-trailer-1920x1080-ru.mp4`

## English (EN)

### Title (≤50)

`Starhook`

### SEO description (50–160)

`Starhook is a cozy night-sky fishing game: 48 glowing species, six lost constellations and quiet evenings. Play online in your browser.`

### Short description (≤70)

`Cozy night-sky fishing: 48 species and six lost constellations.`

### About (100–1000)

`Starhook is a calm fishing game at the edge of the night sky. You are the new keeper of a lake that has lost its stars. Cast the line, watch the bobber and reel in glowing fish — every catch brings a little light back to the water.

Explore six handcrafted locations, discover 48 fish species, follow a 14-chapter story, unlock 24 achievements and meet six legendary keepers, each restoring a constellation to the sky. Upgrade your tackle, choose bait, fill your collection and open new shores.

One-finger controls, no timers and no mandatory purchases. Progress saves automatically, including in the cloud. Play at your own pace — the sky can wait.`

### How to play (100–1000)

`Hold the round button and release it when the power meter reaches the golden zone. When the bobber goes underwater, tap the screen or press Space. Then hold the button to reel in and release when the tension approaches the red zone. Keep tension in the green zone for a perfect-reel bonus.

Watch the signs: when they align, a keeper will rise from the deep. Complete quests, upgrade your tackle, buy bait and unlock new locations. The game works with a mouse, touch and keyboard. Sound and reduced motion can be adjusted in settings.`

### Media

- Icon: `store/icon-512.png`
- Maskable: `store/icon-maskable-512.png`
- Cover: `store/cover-en-800x470.png`
- Hero: `store/hero-en-1560x520.png`
- Screenshots: `store/screenshot-desktop-*-en.png`, `store/screenshot-mobile-*-en.png`
- Video: `store/starhook-trailer-1920x1080-en.mp4`

Categories: Casual; Simulators.

## Türkçe (TR)

### Başlık (≤50)

`Yıldız Oltası`

### SEO açıklaması (50–160)

`Yıldız Oltası, gece göğünde geçen huzurlu bir balıkçılık oyunu: 48 parlayan tür, altı kayıp takımyıldız ve sakin akşamlar. Tarayıcında oyna.`

### Kısa açıklama (≤70)

`Gece göğünde huzurlu balıkçılık: 48 tür ve altı kayıp takımyıldız.`

### Oyun hakkında (100–1000)

`Yıldız Oltası, gece göğünün ucunda geçen sakin bir balıkçılık oyunu. Yıldızlarını kaybetmiş bir gölün yeni bekçisisiniz. Oltayı atın, şamandırayı izleyin ve parlayan balıkları çekin — her av suya biraz ışık geri getirir.

Altı özenle hazırlanmış bölge, 48 balık türü, 14 bölümlük bir hikâye, 24 başarım, günlük görevler ve her biri gökyüzüne bir takımyıldız geri getiren altı efsanevi bekçi sizi bekliyor. Takımınızı geliştirin, yem seçin, koleksiyonunuzu doldurun ve yeni kıyıları açın.

Tek parmakla kontrol, zamanlayıcı yok ve zorunlu satın alma yok. İlerleme otomatik olarak, bulutta da kaydedilir. Kendi hızınızda oynayın — gökyüzü bekleyebilir.`

### Nasıl oynanır (100–1000)

`Yuvarlak düğmeyi basılı tutun ve güç göstergesi altın bölgeye geldiğinde bırakın. Şamandıra suyun altına indiğinde ekrana dokunun veya boşluk tuşuna basın. Ardından balığı çekmek için düğmeyi basılı tutun; gerginlik kırmızı bölgeye yaklaşınca bırakın. Kusursuz sarma bonusu için gerginliği yeşil bölgede tutun.

İşaretleri izleyin: birleştiklerinde derinlerden bir bekçi yükselecek. Görevleri tamamlayın, takımınızı geliştirin, yem satın alın ve yeni bölgeler açın. Oyun fare, dokunma ve klavyeyle çalışır. Ses ve hareket azaltma ayarlardan değiştirilebilir.`

### Medya

- Simge: `store/icon-512.png`
- Maskable: `store/icon-maskable-512.png`
- Kapak: `store/cover-tr-800x470.png`
- Vitrin: `store/hero-tr-1560x520.png`
- Ekran görüntüleri: `store/screenshot-desktop-*-tr.png`, `store/screenshot-mobile-*-tr.png`
- Video: `store/starhook-trailer-1920x1080-tr.mp4`

Kategoriler: Gündelik; Simülatörler.
