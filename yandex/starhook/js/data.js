// ЗВЕЗДОЛОВ — игровые данные, локации, снасти, задания.
// Тексты на русском, английском и турецком.

const T = (ru, en, tr) => ({ ru, en, tr });

export const RARITIES = {
  common: {
    id: 'common',
    label: T('Обычная', 'Common', 'Yaygın'),
    color: '#9fb7c9',
    soft: 'rgba(159,183,201,.18)',
    order: 0
  },
  uncommon: {
    id: 'uncommon',
    label: T('Необычная', 'Uncommon', 'Az bulunur'),
    color: '#79d7a8',
    soft: 'rgba(121,215,168,.18)',
    order: 1
  },
  rare: {
    id: 'rare',
    label: T('Редкая', 'Rare', 'Nadir'),
    color: '#71b7ff',
    soft: 'rgba(113,183,255,.2)',
    order: 2
  },
  epic: {
    id: 'epic',
    label: T('Эпическая', 'Epic', 'Epik'),
    color: '#c39bff',
    soft: 'rgba(195,155,255,.22)',
    order: 3
  },
  legendary: {
    id: 'legendary',
    label: T('Легендарная', 'Legendary', 'Efsanevi'),
    color: '#ffd479',
    soft: 'rgba(255,212,121,.22)',
    order: 4
  },
  mythic: {
    id: 'mythic',
    label: T('Мифическая', 'Mythic', 'Mitsel'),
    color: '#ff9bd6',
    soft: 'rgba(255,155,214,.24)',
    order: 5
  }
};

export const LOCATIONS = [
  {
    id: 'cove',
    name: T('Тихая заводь', 'Stillwater Cove', 'Sessiz Koy'),
    tagline: T('Тёплый вечер и первый заброс', 'A warm evening and the first cast', 'Ilık bir akşam ve ilk atış'),
    desc: T(
      'Маленькая заводь у старого причала. Здесь пахнет ольхой, а по воде бегут золотые дорожки заката.',
      'A small cove by an old pier. It smells of alder, and golden sunset paths run across the water.',
      'Eski iskelenin yanındaki küçük koy. Kızılağaç kokar, suyun üzerinde altın gün batımı yolları uzanır.'
    ),
    constellation: 'lyra',
    guardian: 'lyra',
    palette: {
      skyTop: '#101a3a',
      skyMid: '#314066',
      skyBottom: '#d9885f',
      waterTop: '#2c4a5e',
      waterBottom: '#0a1728',
      glow: '#ffd28a',
      accent: '#f2b56b',
      fog: 'rgba(231,171,117,.12)',
      mountain: '#18253e',
      star: '#fff1cf'
    },
    weather: T('Тихий вечер', 'Quiet evening', 'Sakin akşam'),
    difficulty: 0.9,
    starCount: 120
  },
  {
    id: 'moon',
    name: T('Лунная отмель', 'Moonlit Shoal', 'Ay Sığlığı'),
    tagline: T('Серебро на чёрной воде', 'Silver on black water', 'Kara suda gümüş'),
    desc: T(
      'Отмель, где луна отражается так ярко, что кажется — до неё можно дотронуться удочкой.',
      'A shoal where the moon reflects so brightly that it seems you could touch it with a fishing rod.',
      'Ayın o kadar parlak yansıdığı bir sığlık ki ona oltayla dokunabileceğinizi sanırsınız.'
    ),
    constellation: 'luna',
    guardian: 'crescent',
    palette: {
      skyTop: '#080f2a',
      skyMid: '#162a55',
      skyBottom: '#49648f',
      waterTop: '#203c5f',
      waterBottom: '#06101f',
      glow: '#e9f2ff',
      accent: '#a9c8ff',
      fog: 'rgba(190,214,255,.1)',
      mountain: '#101a33',
      star: '#eef5ff'
    },
    weather: T('Полнолуние', 'Full moon', 'Dolunay'),
    difficulty: 1,
    starCount: 150
  },
  {
    id: 'mist',
    name: T('Туманный плёс', 'Misty Reach', 'Sisli Koy'),
    tagline: T('Здесь туман помнит имена', 'Here the mist remembers names', 'Burada sis isimleri hatırlar'),
    desc: T(
      'Широкий плёс, укрытый тёплым туманом. Огоньки светлячков висят над водой, как маленькие фонари.',
      'A wide reach wrapped in warm mist. Firefly lights hang above the water like tiny lanterns.',
      'Sıcak sisle örtülü geniş bir koy. Ateşböceği ışıkları suyun üzerinde küçük fenerler gibi asılıdır.'
    ),
    constellation: 'cetus',
    guardian: 'mist-whale',
    palette: {
      skyTop: '#11122b',
      skyMid: '#2a2b50',
      skyBottom: '#5c5470',
      waterTop: '#343b52',
      waterBottom: '#0c1020',
      glow: '#cfc3a5',
      accent: '#c3a8e8',
      fog: 'rgba(194,184,214,.18)',
      mountain: '#191b30',
      star: '#f2e8ce'
    },
    weather: T('Тёплый туман', 'Warm mist', 'Ilık sis'),
    difficulty: 1.08,
    starCount: 90
  },
  {
    id: 'frozen',
    name: T('Ледяное зеркало', 'Frozen Mirror', 'Donmuş Ayna'),
    tagline: T('Северное сияние под ногами', 'Northern lights beneath your feet', 'Ayaklarının altında kuzey ışıkları'),
    desc: T(
      'Кромка льда на краю мира. Вода здесь такая прозрачная, что видно, как звёзды проходят под ней.',
      'The edge of the ice at the end of the world. The water is so clear you can see stars passing beneath it.',
      'Dünyanın ucundaki buz kenarı. Su o kadar berrak ki yıldızların altından geçtiğini görebilirsiniz.'
    ),
    constellation: 'draco',
    guardian: 'aurora-dragon',
    palette: {
      skyTop: '#071228',
      skyMid: '#12384d',
      skyBottom: '#3d7c86',
      waterTop: '#26596b',
      waterBottom: '#071523',
      glow: '#a7ffe0',
      accent: '#7fe7cf',
      fog: 'rgba(167,255,224,.1)',
      mountain: '#0d2431',
      star: '#e9fff8'
    },
    weather: T('Северное сияние', 'Aurora', 'Kuzey ışıkları'),
    difficulty: 1.16,
    starCount: 160
  },
  {
    id: 'abyss',
    name: T('Бездна небес', 'Sky Abyss', 'Gökyüzü Uçurumu'),
    tagline: T('Рыба здесь плавает между звёздами', 'Here fish swim between the stars', 'Burada balıklar yıldızların arasında yüzer'),
    desc: T(
      'Озеро, которое висит в пустоте. Внизу — бездна, сверху — бездна, и только поплавок знает, где верх.',
      'A lake suspended in the void. Below is the abyss, above is the abyss, and only the bobber knows which way is up.',
      'Boşlukta asılı bir göl. Aşağıda uçurum, yukarıda uçurum; yukarının nerede olduğunu yalnızca şamandıra bilir.'
    ),
    constellation: 'hydra',
    guardian: 'astral-leviathan',
    palette: {
      skyTop: '#050617',
      skyMid: '#141335',
      skyBottom: '#3e2a63',
      waterTop: '#1e1a44',
      waterBottom: '#04030d',
      glow: '#d4b8ff',
      accent: '#9f8cff',
      fog: 'rgba(159,140,255,.12)',
      mountain: '#0a081a',
      star: '#f4e9ff'
    },
    weather: T('Звёздная ночь', 'Star night', 'Yıldızlı gece'),
    difficulty: 1.26,
    starCount: 220
  },
  {
    id: 'crown',
    name: T('Корона Ночи', 'Crown of Night', 'Gecenin Tacı'),
    tagline: T('Последний берег, последняя звезда', 'The last shore, the last star', 'Son kıyı, son yıldız'),
    desc: T(
      'Место, где небо опускается к самой воде. Здесь заканчиваются все созвездия и начинается новое.',
      'A place where the sky descends to the water. Here all constellations end and a new one begins.',
      'Gökyüzünün suya indiği yer. Bütün takımyıldızlar burada biter ve yenisi başlar.'
    ),
    constellation: 'corona',
    guardian: 'astra',
    palette: {
      skyTop: '#1b1030',
      skyMid: '#4d2c56',
      skyBottom: '#d68a72',
      waterTop: '#5b3c5b',
      waterBottom: '#140d20',
      glow: '#fff0b8',
      accent: '#ffcf8a',
      fog: 'rgba(255,207,138,.12)',
      mountain: '#24142b',
      star: '#fff7dc'
    },
    weather: T('Рождение зари', 'Birth of dawn', 'Şafağın doğuşu'),
    difficulty: 1.34,
    starCount: 190
  }
];

export const LOCATION_BY_ID = Object.fromEntries(LOCATIONS.map((l) => [l.id, l]));

export const CONSTELLATIONS = {
  lyra: {
    id: 'lyra',
    name: T('Лира', 'Lyra', 'Lir'),
    stars: [
      [0.17, 0.28], [0.2, 0.17], [0.27, 0.15], [0.3, 0.25], [0.25, 0.31], [0.15, 0.38], [0.33, 0.37]
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [4, 5], [4, 6], [6, 3]]
  },
  luna: {
    id: 'luna',
    name: T('Полумесяц', 'Crescent', 'Hilal'),
    stars: [
      [0.14, 0.18], [0.19, 0.13], [0.25, 0.14], [0.3, 0.2], [0.31, 0.29], [0.27, 0.36], [0.21, 0.38]
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6]]
  },
  cetus: {
    id: 'cetus',
    name: T('Кит', 'Cetus', 'Balina'),
    stars: [
      [0.12, 0.3], [0.17, 0.24], [0.25, 0.25], [0.31, 0.31], [0.38, 0.29], [0.43, 0.34], [0.36, 0.4], [0.24, 0.4], [0.15, 0.37]
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 0]]
  },
  draco: {
    id: 'draco',
    name: T('Дракон', 'Draco', 'Ejder'),
    stars: [
      [0.12, 0.18], [0.19, 0.21], [0.23, 0.15], [0.3, 0.2], [0.33, 0.28], [0.29, 0.35], [0.22, 0.37], [0.17, 0.3]
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 1]]
  },
  hydra: {
    id: 'hydra',
    name: T('Гидра', 'Hydra', 'Hidra'),
    stars: [
      [0.1, 0.36], [0.17, 0.32], [0.24, 0.34], [0.3, 0.28], [0.36, 0.31], [0.42, 0.25], [0.46, 0.18], [0.39, 0.18], [0.33, 0.2]
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [5, 7], [7, 8]]
  },
  corona: {
    id: 'corona',
    name: T('Корона', 'Corona', 'Taç'),
    stars: [
      [0.13, 0.32], [0.16, 0.24], [0.21, 0.18], [0.28, 0.16], [0.35, 0.19], [0.4, 0.26], [0.43, 0.34], [0.38, 0.4], [0.29, 0.42], [0.2, 0.39]
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 0]]
  }
};

export const BAITS = [
  {
    id: 'firefly',
    name: T('Светлячок', 'Firefly', 'Ateşböceği'),
    short: T('Надёжный и простой', 'Simple and reliable', 'Basit ve güvenilir'),
    desc: T(
      'Обычный светлячок с берега. Рыба клюёт спокойно, без сюрпризов.',
      'A common shore firefly. Fish bite calmly, without surprises.',
      'Kıyıdan bulunan sıradan bir ateşböceği. Balıklar sakin, sürprizsiz ısırır.'
    ),
    cost: 0,
    unlockLevel: 1,
    effects: { bite: 1, rare: 0, weight: 0, perfect: 0, zone: 0 }
  },
  {
    id: 'moondust',
    name: T('Лунная пыль', 'Moon Dust', 'Ay Tozu'),
    short: T('Больше редких рыб', 'More rare fish', 'Daha nadir balıklar'),
    desc: T(
      'Серебристая пыль, собранная с лунной дорожки. Приманивает необычных и редких рыб.',
      'Silver dust gathered from the moonpath. Attracts uncommon and rare fish.',
      'Ay yolundan toplanan gümüş toz. Az bulunur ve nadir balıkları çeker.'
    ),
    cost: 160,
    unlockLevel: 3,
    effects: { bite: 1.06, rare: 0.38, weight: 0.02, perfect: 0, zone: 0 }
  },
  {
    id: 'comet',
    name: T('Кометная крошка', 'Comet Crumb', 'Kuyruklu Yıldız Kırıntısı'),
    short: T('Крупные трофеи', 'Bigger trophies', 'Daha büyük trofeler'),
    desc: T(
      'Тёплая крошка с хвоста кометы. Притягивает самых тяжёлых рыб.',
      'A warm crumb from a comet’s tail. Attracts the heaviest fish.',
      'Kuyruklu yıldızın kuyruğundan sıcak bir kırıntı. En ağır balıkları çeker.'
    ),
    cost: 420,
    unlockLevel: 6,
    effects: { bite: 1, rare: 0.08, weight: 0.42, perfect: 0, zone: 0 }
  },
  {
    id: 'crystal',
    name: T('Кристальная икра', 'Crystal Roe', 'Kristal Havyar'),
    short: T('Шанс на легенду', 'A chance at legends', 'Efsanelere bir şans'),
    desc: T(
      'Икра, выдержанная в звёздном свете. Даже хранители иногда не могут устоять.',
      'Roe aged in starlight. Even the keepers sometimes cannot resist.',
      'Yıldız ışığında dinlendirilmiş havyar. Bekçiler bile bazen karşı koyamaz.'
    ),
    cost: 980,
    unlockLevel: 10,
    effects: { bite: 1.14, rare: 0.9, weight: 0.08, perfect: 0, zone: 0 }
  },
  {
    id: 'nectar',
    name: T('Звёздный нектар', 'Star Nectar', 'Yıldız Nektarı'),
    short: T('Быстрая поклёвка', 'Faster bites', 'Daha hızlı ısırıklar'),
    desc: T(
      'Капля нектара из сердца созвездия. Рыба клюёт почти сразу, а идеальный заброс становится шире.',
      'A drop of nectar from a constellation’s heart. Fish bite almost at once, and the perfect-cast zone widens.',
      'Bir takımyıldızın kalbinden bir damla nektar. Balıklar neredeyse anında ısırır ve mükemmel atış alanı genişler.'
    ),
    cost: 2100,
    unlockLevel: 14,
    effects: { bite: 0.68, rare: 0.22, weight: 0.06, perfect: 0.04, zone: 0.05 }
  }
];

export const BAIT_BY_ID = Object.fromEntries(BAITS.map((b) => [b.id, b]));

export const UPGRADES = [
  {
    id: 'rod',
    name: T('Удилище', 'Rod', 'Olta Kamışı'),
    label: T('Скорость подмотки', 'Reel speed', 'Sarma hızı'),
    desc: T(
      'Гибкое удилище из небесного ясеня. Быстрее подматывает леску.',
      'A flexible rod made of sky ash. Reels the line in faster.',
      'Gökyüzü dişbudak ağacından esnek bir kamış. Misinayı daha hızlı sarar.'
    ),
    baseCost: 100,
    step: 0.06,
    max: 8,
    icon: 'rod'
  },
  {
    id: 'line',
    name: T('Леска', 'Line', 'Misina'),
    label: T('Прочность лески', 'Line strength', 'Misina dayanıklılığı'),
    desc: T(
      'Плетёная нить, в которую вплавили лунный шёлк. Выдерживает больше натяжения.',
      'Braided thread with moon silk woven into it. Withstands more tension.',
      'İçine ay ipeği dokunmuş örgü ip. Daha fazla gerginliğe dayanır.'
    ),
    baseCost: 120,
    step: 0.05,
    max: 8,
    icon: 'line'
  },
  {
    id: 'lure',
    name: T('Блесна', 'Lure', 'Yem'),
    label: T('Шанс редкой рыбы', 'Rare fish chance', 'Nadir balık şansı'),
    desc: T(
      'Крошечная звезда на крючке. Чем ярче горит, тем больше редких рыб приходит.',
      'A tiny star on the hook. The brighter it glows, the more rare fish come.',
      'Kancadaki minik yıldız. Ne kadar parlak yanarsa o kadar çok nadir balık gelir.'
    ),
    baseCost: 140,
    step: 0.08,
    max: 8,
    icon: 'lure'
  },
  {
    id: 'lantern',
    name: T('Фонарь', 'Lantern', 'Fener'),
    label: T('Поклёвка и заброс', 'Bite and cast', 'Isırık ve atış'),
    desc: T(
      'Тёплый фонарь смотрителя. Освещает воду, ускоряет поклёвку и расширяет зону идеального заброса.',
      'The keeper’s warm lantern. Lights the water, speeds up bites and widens the perfect-cast zone.',
      'Bekçinin sıcak feneri. Suyu aydınlatır, ısırıkları hızlandırır ve mükemmel atış alanını genişletir.'
    ),
    baseCost: 90,
    step: 0.06,
    max: 8,
    icon: 'lantern'
  }
];

export const UPGRADE_BY_ID = Object.fromEntries(UPGRADES.map((u) => [u.id, u]));

export const QUESTS = [
  {
    id: 'first-cast',
    title: T('Первый заброс', 'First Cast', 'İlk Atış'),
    text: T(
      'Орлин оставил на причале удочку и письмо: «Начни с трёх рыб. Не спеши — небо любит терпеливых».',
      'Orin left a rod and a letter on the pier: “Start with three fish. Take your time — the sky loves the patient.”',
      'Orin iskelede bir olta ve mektup bıraktı: “Üç balıkla başla. Acele etme — gökyüzü sabırlıları sever.”'
    ),
    hint: T('Поймайте 3 рыбы', 'Catch 3 fish', '3 balık yakala'),
    goals: [{ type: 'totalCatch', count: 3 }],
    reward: { sparks: 60, xp: 25 }
  },
  {
    id: 'many-voices',
    title: T('Разные голоса', 'Many Voices', 'Farklı Sesler'),
    text: T(
      '«У каждой рыбы свой характер. Поймай четыре разных вида — и услышишь, о чём говорит заводь».',
      '“Every fish has its own character. Catch four different species and you will hear what the cove is saying.”',
      '“Her balığın kendi karakteri var. Dört farklı tür yakala ve koyun ne söylediğini duy.”'
    ),
    hint: T('Откройте 4 вида рыб', 'Discover 4 fish species', '4 balık türü keşfet'),
    goals: [{ type: 'species', count: 4 }],
    reward: { sparks: 85, xp: 35 }
  },
  {
    id: 'golden-arc',
    title: T('Золотая дуга', 'The Golden Arc', 'Altın Yay'),
    text: T(
      '«Идеальный заброс — это не сила, а момент. Поймай золотую дугу дважды».',
      '“A perfect cast is not about strength, but timing. Catch the golden arc twice.”',
      '“Mükemmel atış güçle değil, zamanlamayla ilgilidir. Altın yayı iki kez yakala.”'
    ),
    hint: T('Сделайте 2 идеальных заброса', 'Make 2 perfect casts', '2 mükemmel atış yap'),
    goals: [{ type: 'perfectCast', count: 2 }],
    reward: { sparks: 75, xp: 30 }
  },
  {
    id: 'silver-guest',
    title: T('Серебряная гостья', 'The Silver Guest', 'Gümüş Misafir'),
    text: T(
      '«В заводь пришла гостья из лунной отмели. Найди её — и я покажу тебе дорогу дальше».',
      '“A guest from the moonlit shoal has come to the cove. Find her, and I will show you the way onward.”',
      '“Ay sığlığından koya bir misafir geldi. Onu bul, sana yolu göstereyim.”'
    ),
    hint: T('Поймайте 2 редкие рыбы или лучше', 'Catch 2 rare fish or better', '2 nadir veya daha iyi balık yakala'),
    goals: [{ type: 'rareCatch', count: 2 }],
    reward: { sparks: 130, xp: 65 },
    unlock: 'moon'
  },
  {
    id: 'moon-path',
    title: T('Лунная дорожка', 'The Moonpath', 'Ay Yolu'),
    text: T(
      '«На отмели вода серебряная, а рыба — как осколки зеркала. Поймай шесть, и луна запомнит тебя».',
      '“At the shoal the water is silver, and the fish are like shards of a mirror. Catch six, and the moon will remember you.”',
      '“Sığlıkta su gümüş, balıklar ayna parçaları gibi. Altı tane yakala, ay seni hatırlasın.”'
    ),
    hint: T('Поймайте 6 рыб на Лунной отмели', 'Catch 6 fish at Moonlit Shoal', 'Ay Sığlığı’nda 6 balık yakala'),
    goals: [{ type: 'locCatch', loc: 'moon', count: 6 }],
    reward: { sparks: 150, xp: 80 }
  },
  {
    id: 'keeper-lyra',
    title: T('Хранитель Лиры', 'Keeper of Lyra', 'Lir’in Bekçisi'),
    text: T(
      '«Когда знамения сойдутся, из глубины поднимется Лира. Не рви леску — хранители проверяют не силу, а выдержку».',
      '“When the signs align, Lyra will rise from the deep. Do not snap the line — keepers test patience, not strength.”',
      '“İşaretler birleştiğinde Lir derinlerden yükselecek. Misinayı koparma — bekçiler gücü değil sabrı sınar.”'
    ),
    hint: T('Поймайте хранителя Лиру в Тихой заводи', 'Catch the keeper Lyra at Stillwater Cove', 'Sessiz Koy’da bekçi Lir’i yakala'),
    goals: [{ type: 'guardian', fish: 'lyra' }],
    guardian: 'lyra',
    constellation: 'lyra',
    reward: { sparks: 260, xp: 140, shards: 2 }
  },
  {
    id: 'keeper-crescent',
    title: T('Лунный серп', 'The Crescent Keeper', 'Hilal Bekçisi'),
    text: T(
      '«Полумесяц не любит суеты. Дождись, когда его крылья коснутся воды, и держи леску мягко».',
      '“The Crescent dislikes haste. Wait until its wings touch the water, and hold the line gently.”',
      '“Hilal aceleyi sevmez. Kanatları suya değene kadar bekle ve misinayı nazikçe tut.”'
    ),
    hint: T('Поймайте Полумесяца на Лунной отмели', 'Catch the Crescent at Moonlit Shoal', 'Ay Sığlığı’nda Hilal’i yakala'),
    goals: [{ type: 'guardian', fish: 'crescent' }],
    guardian: 'crescent',
    constellation: 'luna',
    reward: { sparks: 320, xp: 180, shards: 2 },
    unlock: 'mist'
  },
  {
    id: 'mist-trail',
    title: T('Туманный след', 'Mist Trail', 'Sis İzi'),
    text: T(
      '«Туманный плёс помнит всех, кто когда-то здесь рыбачил. Поймай десять рыб — и он вспомнит тебя».',
      '“Misty Reach remembers everyone who ever fished here. Catch ten fish, and it will remember you.”',
      '“Sisli Koy burada balık tutan herkesi hatırlar. On balık yakala, seni de hatırlasın.”'
    ),
    hint: T('Поймайте 10 рыб на Туманном плёсе', 'Catch 10 fish at Misty Reach', 'Sisli Koy’da 10 balık yakala'),
    goals: [{ type: 'locCatch', loc: 'mist', count: 10 }],
    reward: { sparks: 300, xp: 160 }
  },
  {
    id: 'keeper-mist',
    title: T('Хранитель Тумана', 'Keeper of the Mist', 'Sisin Bekçisi'),
    text: T(
      '«Кит поднимается медленно, но тянет так, будто в нём вся тяжесть неба. Дыши ровно».',
      '“The whale rises slowly, but pulls as if it carries the weight of the sky. Breathe steadily.”',
      '“Balina yavaş yükselir ama sanki gökyüzünün tüm ağırlığını taşıyormuş gibi çeker. Sakin nefes al.”'
    ),
    hint: T('Поймайте Туманного кита', 'Catch the Mist Whale', 'Sis Balinası’nı yakala'),
    goals: [{ type: 'guardian', fish: 'mist-whale' }],
    guardian: 'mist-whale',
    constellation: 'cetus',
    reward: { sparks: 380, xp: 220, shards: 3 },
    unlock: 'frozen'
  },
  {
    id: 'northern-lights',
    title: T('Северное сияние', 'Northern Lights', 'Kuzey Işıkları'),
    text: T(
      '«На льду рыба видит твоё дыхание. Поймай четырнадцать и удержи пять рыб идеально — лёд это оценит».',
      '“On the ice, fish can see your breath. Catch fourteen and land five fish perfectly — the ice will notice.”',
      '“Buzda balıklar nefesini görür. On dört balık yakala ve beşini kusursuz çıkar — buz bunu fark eder.”'
    ),
    hint: T('14 рыб на Ледяном зеркале и 5 идеальных подмоток', '14 fish at Frozen Mirror and 5 perfect reels', 'Donmuş Ayna’da 14 balık ve 5 mükemmel sarma'),
    goals: [
      { type: 'locCatch', loc: 'frozen', count: 14 },
      { type: 'perfectReel', count: 5 }
    ],
    reward: { sparks: 420, xp: 240 }
  },
  {
    id: 'keeper-dragon',
    title: T('Хранитель Дракона', 'Keeper of the Dragon', 'Ejderin Bekçisi'),
    text: T(
      '«Северный дракон раскрашивает небо, когда злится. Не зли его — просто не отпускай».',
      '“The Aurora Dragon paints the sky when it is angry. Do not anger it — just do not let go.”',
      '“Kuzey Işığı Ejderi öfkelendiğinde gökyüzünü boyar. Onu öfkelendirme — sadece bırakma.”'
    ),
    hint: T('Поймайте Аврорного дракона', 'Catch the Aurora Dragon', 'Kuzey Işığı Ejderi’ni yakala'),
    goals: [{ type: 'guardian', fish: 'aurora-dragon' }],
    guardian: 'aurora-dragon',
    constellation: 'draco',
    reward: { sparks: 520, xp: 300, shards: 3 },
    unlock: 'abyss'
  },
  {
    id: 'abyss-calls',
    title: T('Бездна зовёт', 'The Abyss Calls', 'Uçurum Çağırıyor'),
    text: T(
      '«Там, где нет дна, рыба плывёт между звёздами. Поймай восемнадцать — и бездна признает тебя своим гостем».',
      '“Where there is no bottom, fish swim between the stars. Catch eighteen, and the abyss will accept you as its guest.”',
      '“Dipsiz yerde balıklar yıldızlar arasında yüzer. On sekiz tane yakala, uçurum seni konuğu kabul etsin.”'
    ),
    hint: T('Поймайте 18 рыб в Бездне небес', 'Catch 18 fish at Sky Abyss', 'Gökyüzü Uçurumu’nda 18 balık yakala'),
    goals: [{ type: 'locCatch', loc: 'abyss', count: 18 }],
    reward: { sparks: 650, xp: 380 }
  },
  {
    id: 'keeper-leviathan',
    title: T('Хранитель Бездны', 'Keeper of the Abyss', 'Uçurumun Bekçisi'),
    text: T(
      '«Левиафан старше самого времени. Он отпустит тебя, если ты отпустишь свой страх».',
      '“The Leviathan is older than time itself. It will let you go if you let go of your fear.”',
      '“Leviathan zamanın kendisinden bile yaşlı. Korkunu bırakırsan seni bırakır.”'
    ),
    hint: T('Поймайте Астрального левиафана', 'Catch the Astral Leviathan', 'Astral Leviathan’ı yakala'),
    goals: [{ type: 'guardian', fish: 'astral-leviathan' }],
    guardian: 'astral-leviathan',
    constellation: 'hydra',
    reward: { sparks: 820, xp: 480, shards: 4 },
    unlock: 'crown'
  },
  {
    id: 'crown-night',
    title: T('Корона Ночи', 'Crown of Night', 'Gecenin Tacı'),
    text: T(
      '«Последняя хранительница ждёт на последнем берегу. Собери все звёзды, что она потеряла, — и небо снова станет целым».',
      '“The last keeper waits on the last shore. Gather all the stars she lost, and the sky will be whole again.”',
      '“Son bekçi son kıyıda bekliyor. Kaybettiği tüm yıldızları topla, gökyüzü yeniden bütün olsun.”'
    ),
    hint: T('Поймайте Астру на Короне Ночи', 'Catch Astra at the Crown of Night', 'Gecenin Tacı’nda Astra’yı yakala'),
    goals: [{ type: 'guardian', fish: 'astra' }],
    guardian: 'astra',
    constellation: 'corona',
    reward: { sparks: 1600, xp: 900, shards: 8 },
    final: true
  }
];

export const DAILY_POOL = [
  {
    id: 'd-catch-8',
    text: T('Поймайте 8 рыб', 'Catch 8 fish', '8 balık yakala'),
    type: 'dailyCatch',
    count: 8,
    reward: 55
  },
  {
    id: 'd-rare-2',
    text: T('Поймайте 2 редкие рыбы', 'Catch 2 rare fish', '2 nadir balık yakala'),
    type: 'dailyRare',
    count: 2,
    reward: 70
  },
  {
    id: 'd-perfect-reel-3',
    text: T('Вытащите 3 рыбы идеально', 'Land 3 fish perfectly', '3 balığı kusursuz çıkar'),
    type: 'dailyPerfectReel',
    count: 3,
    reward: 65
  },
  {
    id: 'd-perfect-cast-3',
    text: T('Сделайте 3 идеальных заброса', 'Make 3 perfect casts', '3 mükemmel atış yap'),
    type: 'dailyPerfectCast',
    count: 3,
    reward: 60
  },
  {
    id: 'd-species-4',
    text: T('Поймайте 4 разных вида', 'Catch 4 different species', '4 farklı tür yakala'),
    type: 'dailySpecies',
    count: 4,
    reward: 75
  },
  {
    id: 'd-sparks-250',
    text: T('Заработайте 250 искр', 'Earn 250 sparks', '250 kıvılcım kazan'),
    type: 'dailySparks',
    count: 250,
    reward: 60
  },
  {
    id: 'd-catch-12',
    text: T('Поймайте 12 рыб', 'Catch 12 fish', '12 balık yakala'),
    type: 'dailyCatch',
    count: 12,
    reward: 80
  },
  {
    id: 'd-rare-4',
    text: T('Поймайте 4 редкие рыбы', 'Catch 4 rare fish', '4 nadir balık yakala'),
    type: 'dailyRare',
    count: 4,
    reward: 95
  }
];

export const ACHIEVEMENTS = [
  { id: 'first-star', title: T('Первая звезда', 'First Star', 'İlk Yıldız'), desc: T('Поймайте первую рыбу', 'Catch your first fish', 'İlk balığını yakala'), icon: 'star', shards: 1, check: { type: 'catches', count: 1 } },
  { id: 'angler-10', title: T('Рыбак', 'Angler', 'Balıkçı'), desc: T('Поймайте 10 рыб', 'Catch 10 fish', '10 balık yakala'), icon: 'rod', shards: 1, check: { type: 'catches', count: 10 } },
  { id: 'angler-50', title: T('Звездолов', 'Starhook', 'Yıldız Avcısı'), desc: T('Поймайте 50 рыб', 'Catch 50 fish', '50 balık yakala'), icon: 'hook', shards: 2, check: { type: 'catches', count: 50 } },
  { id: 'angler-200', title: T('Легенда озера', 'Lake Legend', 'Göl Efsanesi'), desc: T('Поймайте 200 рыб', 'Catch 200 fish', '200 balık yakala'), icon: 'crown', shards: 3, check: { type: 'catches', count: 200 } },
  { id: 'species-10', title: T('Коллекционер I', 'Collector I', 'Koleksiyoncu I'), desc: T('Откройте 10 видов', 'Discover 10 species', '10 tür keşfet'), icon: 'book', shards: 1, check: { type: 'species', count: 10 } },
  { id: 'species-25', title: T('Коллекционер II', 'Collector II', 'Koleksiyoncu II'), desc: T('Откройте 25 видов', 'Discover 25 species', '25 tür keşfet'), icon: 'book', shards: 2, check: { type: 'species', count: 25 } },
  { id: 'species-48', title: T('Коллекционер III', 'Collector III', 'Koleksiyoncu III'), desc: T('Откройте все 48 видов', 'Discover all 48 species', '48 türün tamamını keşfet'), icon: 'book', shards: 5, check: { type: 'species', count: 48 } },
  { id: 'weight-1', title: T('Тяжеловес', 'Heavyweight', 'Ağır Sıklet'), desc: T('Поймайте рыбу тяжелее 1 кг', 'Catch a fish heavier than 1 kg', '1 kilodan ağır bir balık yakala'), icon: 'weight', shards: 1, check: { type: 'bestWeight', count: 1000 } },
  { id: 'weight-5', title: T('Великан', 'Giant', 'Dev'), desc: T('Поймайте рыбу тяжелее 5 кг', 'Catch a fish heavier than 5 kg', '5 kilodan ağır bir balık yakala'), icon: 'weight', shards: 2, check: { type: 'bestWeight', count: 5000 } },
  { id: 'weight-20', title: T('Левиафан', 'Leviathan', 'Leviathan'), desc: T('Поймайте рыбу тяжелее 20 кг', 'Catch a fish heavier than 20 kg', '20 kilodan ağır bir balık yakala'), icon: 'weight', shards: 3, check: { type: 'bestWeight', count: 20000 } },
  { id: 'perfect-cast-10', title: T('Идеальный заброс', 'Perfect Cast', 'Mükemmel Atış'), desc: T('Сделайте 10 идеальных забросов', 'Make 10 perfect casts', '10 mükemmel atış yap'), icon: 'arc', shards: 1, check: { type: 'perfectCasts', count: 10 } },
  { id: 'perfect-cast-50', title: T('Мастер дуги', 'Arc Master', 'Yay Ustası'), desc: T('Сделайте 50 идеальных забросов', 'Make 50 perfect casts', '50 mükemmel atış yap'), icon: 'arc', shards: 2, check: { type: 'perfectCasts', count: 50 } },
  { id: 'perfect-reel-25', title: T('Твёрдая рука', 'Steady Hand', 'Sağlam El'), desc: T('Вытащите 25 рыб идеально', 'Land 25 fish perfectly', '25 balığı kusursuz çıkar'), icon: 'tension', shards: 1, check: { type: 'perfectReels', count: 25 } },
  { id: 'perfect-reel-100', title: T('Нервы из стали', 'Nerves of Steel', 'Çelik Sinirler'), desc: T('Вытащите 100 рыб идеально', 'Land 100 fish perfectly', '100 balığı kusursuz çıkar'), icon: 'tension', shards: 3, check: { type: 'perfectReels', count: 100 } },
  { id: 'keeper-lyra', title: T('Хранитель Лиры', 'Keeper of Lyra', 'Lir’in Bekçisi'), desc: T('Поймайте Лиру', 'Catch Lyra', 'Lir’i yakala'), icon: 'constellation', shards: 2, check: { type: 'guardian', fish: 'lyra' } },
  { id: 'keeper-crescent', title: T('Хранитель Луны', 'Keeper of the Moon', 'Ay’ın Bekçisi'), desc: T('Поймайте Полумесяца', 'Catch the Crescent', 'Hilal’i yakala'), icon: 'constellation', shards: 2, check: { type: 'guardian', fish: 'crescent' } },
  { id: 'keeper-mist', title: T('Хранитель Тумана', 'Keeper of the Mist', 'Sisin Bekçisi'), desc: T('Поймайте Туманного кита', 'Catch the Mist Whale', 'Sis Balinası’nı yakala'), icon: 'constellation', shards: 3, check: { type: 'guardian', fish: 'mist-whale' } },
  { id: 'keeper-dragon', title: T('Хранитель Севера', 'Keeper of the North', 'Kuzeyin Bekçisi'), desc: T('Поймайте Аврорного дракона', 'Catch the Aurora Dragon', 'Kuzey Işığı Ejderi’ni yakala'), icon: 'constellation', shards: 3, check: { type: 'guardian', fish: 'aurora-dragon' } },
  { id: 'keeper-leviathan', title: T('Хранитель Бездны', 'Keeper of the Abyss', 'Uçurumun Bekçisi'), desc: T('Поймайте Астрального левиафана', 'Catch the Astral Leviathan', 'Astral Leviathan’ı yakala'), icon: 'constellation', shards: 4, check: { type: 'guardian', fish: 'astral-leviathan' } },
  { id: 'keeper-astra', title: T('Корона собрана', 'Crown Restored', 'Taç Yeniden'), desc: T('Поймайте Астру', 'Catch Astra', 'Astra’yı yakala'), icon: 'crown', shards: 6, check: { type: 'guardian', fish: 'astra' } },
  { id: 'all-locations', title: T('Весь горизонт', 'Whole Horizon', 'Tüm Ufuk'), desc: T('Откройте все локации', 'Unlock every location', 'Tüm bölgelerin kilidini aç'), icon: 'map', shards: 3, check: { type: 'locations', count: 6 } },
  { id: 'rich-10k', title: T('Богач', 'Wealthy', 'Zengin'), desc: T('Заработайте 10 000 искр за всё время', 'Earn 10,000 sparks in total', 'Toplam 10.000 kıvılcım kazan'), icon: 'spark', shards: 2, check: { type: 'earnedSparks', count: 10000 } },
  { id: 'streak-7', title: T('Целая неделя', 'A Full Week', 'Tam Bir Hafta'), desc: T('Заходите 7 дней подряд', 'Visit 7 days in a row', '7 gün üst üste gel'), icon: 'calendar', shards: 3, check: { type: 'streak', count: 7 } },
  { id: 'all-guardians', title: T('Небо целое', 'Sky Made Whole', 'Gökyüzü Bütün'), desc: T('Верните все шесть созвездий', 'Restore all six constellations', 'Altı takımyıldızın tamamını geri getir'), icon: 'constellation', shards: 8, check: { type: 'guardians', count: 6 } }
];

export const DAILY_GIFTS = [
  { day: 1, sparks: 45, shards: 0 },
  { day: 2, sparks: 70, shards: 0 },
  { day: 3, sparks: 90, shards: 1 },
  { day: 4, sparks: 120, shards: 0 },
  { day: 5, sparks: 150, shards: 1 },
  { day: 6, sparks: 190, shards: 0 },
  { day: 7, sparks: 300, shards: 3 }
];

export const RANKS = [
  { level: 1, title: T('Ученик смотрителя', 'Keeper’s Apprentice', 'Bekçi Çırağı') },
  { level: 5, title: T('Ночной рыбак', 'Night Angler', 'Gece Balıkçısı'), shards: 1 },
  { level: 8, title: T('Ловец звёзд', 'Star Catcher', 'Yıldız Yakalayıcı'), shards: 1 },
  { level: 12, title: T('Хранитель берега', 'Shore Keeper', 'Kıyı Bekçisi'), shards: 2 },
  { level: 16, title: T('Проводник созвездий', 'Guide of Constellations', 'Takımyıldız Rehberi'), shards: 2 },
  { level: 20, title: T('Голос озера', 'Voice of the Lake', 'Gölün Sesi'), shards: 3 },
  { level: 25, title: T('Наследник Орлина', 'Orin’s Heir', 'Orin’in Mirasçısı'), shards: 4 },
  { level: 30, title: T('Корона Ночи', 'Crown of Night', 'Gecenin Tacı'), shards: 6 }
];

export const TIPS = [
  T('Идеальный заброс даёт больше редкой рыбы.', 'A perfect cast brings more rare fish.', 'Mükemmel atış daha çok nadir balık getirir.'),
  T('Отпускайте кнопку, когда натяжение подходит к красной зоне.', 'Release when the tension approaches the red zone.', 'Gerginlik kırmızı bölgeye yaklaşınca bırak.'),
  T('Каждый новый вид приносит двойной опыт.', 'Every new species gives double experience.', 'Her yeni tür iki kat deneyim verir.'),
  T('Знамения показывают, сколько рыб осталось до встречи с хранителем.', 'Signs show how many fish remain before meeting a keeper.', 'İşaretler bir bekçiyle buluşmaya kaç balık kaldığını gösterir.'),
  T('Ежедневные задания обновляются каждый день.', 'Daily tasks refresh every day.', 'Günlük görevler her gün yenilenir.'),
  T('Смените наживку, если хотите поймать редкий вид.', 'Change bait if you are hunting a rare species.', 'Nadir bir tür arıyorsan yemi değiştir.')
];
