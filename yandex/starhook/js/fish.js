// ЗВЕЗДОЛОВ — данные рыб.
// Все названия и описания написаны вручную на трёх языках.

const N = (ru, en, tr) => ({ ru, en, tr });

/**
 * @typedef {'common'|'uncommon'|'rare'|'epic'|'legendary'|'mythic'} Rarity
 * @typedef {'round'|'torpedo'|'flat'|'ribbon'|'ray'|'whale'|'catfish'|'angel'|'sturgeon'|'sword'|'dragon'|'lyre'|'narwhal'|'angler'} FishShape
 */

/** @type {Array<object>} */
export const FISH = [
  // ── Тихая заводь / Stillwater Cove ──────────────────────────────────────
  {
    id: 'firefin',
    loc: 'cove',
    name: N('Светлячок-плотвичка', 'Firefin Minnow', 'Ateşkanat'),
    rarity: 'common',
    shape: 'round',
    pattern: 'spots',
    colors: { body: '#5fbfa8', fin: '#2f7f7a', belly: '#d9fff2', glow: '#8dffdf' },
    weight: [80, 360],
    value: 9,
    xp: 7,
    aggression: 0.55,
    lore: N(
      'Стайка этих рыбок светится у самой поверхности, будто кто-то рассыпал по воде искры.',
      'Schools of these fish glow just below the surface, as if someone scattered sparks across the water.',
      'Bu balıklar su yüzeyinin hemen altında parlar; sanki biri suya kıvılcımlar saçmıştır.'
    )
  },
  {
    id: 'alder-crucian',
    loc: 'cove',
    name: N('Ольховая караска', 'Alder Crucian', 'Kızılağaç Sazanı'),
    rarity: 'common',
    shape: 'flat',
    pattern: 'scales',
    colors: { body: '#9caf6a', fin: '#5f7440', belly: '#e7ecc4', glow: '#d5e88f' },
    weight: [140, 620],
    value: 12,
    xp: 9,
    aggression: 0.62,
    lore: N(
      'Пахнет речной корой и летним вечером. Старый смотритель говорил, что такие караси приносят удачу.',
      'It smells of river bark and summer evenings. The old keeper said crucians like these bring luck.',
      'Nehir kabuğu ve yaz akşamı kokar. Yaşlı bekçi, bu sazanların şans getirdiğini söylerdi.'
    )
  },
  {
    id: 'reed-ruff',
    loc: 'cove',
    name: N('Тростниковый ёрш', 'Reed Ruff', 'Saz Balığı'),
    rarity: 'common',
    shape: 'torpedo',
    pattern: 'stripes',
    colors: { body: '#b08a58', fin: '#6d4f2f', belly: '#f0dfb8', glow: '#ffd88a' },
    weight: [60, 300],
    value: 10,
    xp: 8,
    aggression: 0.7,
    lore: N(
      'Колючий и упрямый. Прячется в тростнике, но обожает лунную пыль.',
      'Prickly and stubborn. It hides in the reeds but adores moon dust.',
      'Dikenli ve inatçı. Sazlıklarda saklanır ama ay tozuna bayılır.'
    )
  },
  {
    id: 'moon-perch',
    loc: 'cove',
    name: N('Луннопёрый окунь', 'Moonfin Perch', 'Ayyüzgeç Levrek'),
    rarity: 'uncommon',
    shape: 'round',
    pattern: 'stars',
    colors: { body: '#708cc9', fin: '#3d568f', belly: '#dce7ff', glow: '#a9c7ff' },
    weight: [220, 900],
    value: 26,
    xp: 16,
    aggression: 0.78,
    lore: N(
      'На его чешуе проступают крошечные созвездия. Каждую ночь рисунок меняется.',
      'Tiny constellations appear on its scales. The pattern changes every night.',
      'Pullarında küçük takımyıldızlar belirir. Desen her gece değişir.'
    )
  },
  {
    id: 'emerald-tench',
    loc: 'cove',
    name: N('Изумрудный линь', 'Emerald Tench', 'Zümrüt Kadife'),
    rarity: 'uncommon',
    shape: 'torpedo',
    pattern: 'scales',
    colors: { body: '#3f9b72', fin: '#1f5d4a', belly: '#c9f5d8', glow: '#65ffb4' },
    weight: [300, 1200],
    value: 30,
    xp: 19,
    aggression: 0.82,
    lore: N(
      'В его глазах отражается лес, которого здесь никогда не было.',
      'Its eyes reflect a forest that has never existed here.',
      'Gözlerinde burada hiç var olmamış bir orman yansır.'
    )
  },
  {
    id: 'dusk-catfish',
    loc: 'cove',
    name: N('Сумеречный сом', 'Dusk Catfish', 'Alacakaranlık Yayın'),
    rarity: 'rare',
    shape: 'catfish',
    pattern: 'none',
    colors: { body: '#574a7a', fin: '#2f2748', belly: '#b7a8d6', glow: '#9b7bff' },
    weight: [900, 3800],
    value: 62,
    xp: 38,
    aggression: 0.95,
    lore: N(
      'Выходит из глубины на закате. Его усы чувствуют дрожь звёзд в воде.',
      'It rises from the deep at dusk. Its whiskers sense the trembling of stars in the water.',
      'Alacakaranlıkta derinlerden çıkar. Bıyıkları sudaki yıldız titremesini hisseder.'
    )
  },
  {
    id: 'amber-taimen',
    loc: 'cove',
    name: N('Янтарный таймень', 'Amber Taimen', 'Kehribar Taimen'),
    rarity: 'epic',
    shape: 'torpedo',
    pattern: 'spots',
    colors: { body: '#c98a3c', fin: '#7d4a1f', belly: '#ffe2a6', glow: '#ffbf5e' },
    weight: [2200, 7800],
    value: 125,
    xp: 72,
    aggression: 1.12,
    lore: N(
      'В его чешуе застыли капли солнечного света. Говорят, он помнит первый рассвет этого озера.',
      'Drops of sunlight are frozen in its scales. They say it remembers the lake’s first dawn.',
      'Pullarında güneş ışığı damlaları donmuştur. Bu gölün ilk şafağını hatırladığı söylenir.'
    )
  },
  {
    id: 'lyra',
    loc: 'cove',
    name: N('Лира', 'Lyra', 'Lir'),
    rarity: 'legendary',
    shape: 'lyre',
    pattern: 'stars',
    colors: { body: '#e9d7ff', fin: '#a17dff', belly: '#fff9e6', glow: '#ffe08a' },
    weight: [9000, 16000],
    value: 520,
    xp: 260,
    aggression: 1.25,
    guardian: true,
    constellation: 'lyra',
    lore: N(
      'Хранительница первой звезды. Её плавники звучат как струны, когда касаются воды.',
      'Keeper of the first star. Her fins ring like strings when they touch the water.',
      'İlk yıldızın bekçisi. Yüzgeçleri suya değdiğinde teller gibi çınlar.'
    )
  },

  // ── Лунная отмель / Moonlit Shoal ───────────────────────────────────────
  {
    id: 'pearl-minnow',
    loc: 'moon',
    name: N('Жемчужная мальва', 'Pearl Minnow', 'İnci Balığı'),
    rarity: 'common',
    shape: 'round',
    pattern: 'scales',
    colors: { body: '#c8d8e8', fin: '#8ca3bd', belly: '#ffffff', glow: '#e8f6ff' },
    weight: [70, 320],
    value: 13,
    xp: 9,
    aggression: 0.58,
    lore: N(
      'Чешуя у неё как мелкий жемчуг. В лунном свете рыбка кажется почти прозрачной.',
      'Its scales are like tiny pearls. In moonlight the fish looks almost transparent.',
      'Pulları küçük inciler gibidir. Ay ışığında neredeyse saydam görünür.'
    )
  },
  {
    id: 'silver-bream',
    loc: 'moon',
    name: N('Серебряный лещ', 'Silver Bream', 'Gümüş Çapak'),
    rarity: 'common',
    shape: 'flat',
    pattern: 'scales',
    colors: { body: '#aebfd4', fin: '#6d809a', belly: '#f2f7ff', glow: '#d8e9ff' },
    weight: [250, 1100],
    value: 17,
    xp: 12,
    aggression: 0.65,
    lore: N(
      'Спокойный и важный. Плавает кругами, будто ведёт свой собственный лунный календарь.',
      'Calm and dignified. It circles as if keeping its own lunar calendar.',
      'Sakin ve ağırbaşlı. Kendi ay takvimini tutuyormuş gibi daireler çizer.'
    )
  },
  {
    id: 'mint-trout',
    loc: 'moon',
    name: N('Мятная форель', 'Mint Trout', 'Nane Alabalığı'),
    rarity: 'common',
    shape: 'torpedo',
    pattern: 'spots',
    colors: { body: '#8fd8c4', fin: '#3f9d8c', belly: '#f4fff9', glow: '#baffea' },
    weight: [180, 850],
    value: 18,
    xp: 13,
    aggression: 0.76,
    lore: N(
      'От неё пахнет холодной мятой. Даже вода вокруг становится чуть прохладнее.',
      'It smells of cold mint. Even the water around it turns a little cooler.',
      'Soğuk nane kokar. Etrafındaki su bile biraz serinler.'
    )
  },
  {
    id: 'moon-angel',
    loc: 'moon',
    name: N('Лунный ангел', 'Moon Angel', 'Ay Meleği'),
    rarity: 'uncommon',
    shape: 'angel',
    pattern: 'none',
    colors: { body: '#dbe9ff', fin: '#8ea9ff', belly: '#ffffff', glow: '#bcd4ff' },
    weight: [300, 1400],
    value: 38,
    xp: 24,
    aggression: 0.88,
    lore: N(
      'Его длинные плавники похожи на крылья. Появляется только в полнолуние.',
      'Its long fins look like wings. It appears only during a full moon.',
      'Uzun yüzgeçleri kanatlara benzer. Yalnızca dolunayda görünür.'
    )
  },
  {
    id: 'crystal-carp',
    loc: 'moon',
    name: N('Хрустальный карп', 'Crystal Carp', 'Kristal Sazan'),
    rarity: 'uncommon',
    shape: 'round',
    pattern: 'stars',
    colors: { body: '#a9d9ff', fin: '#5c9ad6', belly: '#effaff', glow: '#8ce6ff' },
    weight: [600, 2400],
    value: 45,
    xp: 28,
    aggression: 0.92,
    lore: N(
      'Внутри него мерцает крошечная галактика. Если прислушаться, можно услышать её вращение.',
      'A tiny galaxy flickers inside it. If you listen closely, you can hear it turning.',
      'İçinde minik bir galaksi parıldar. Dikkatle dinlerseniz döndüğünü duyabilirsiniz.'
    )
  },
  {
    id: 'night-beluga',
    loc: 'moon',
    name: N('Ночная белуга', 'Night Beluga', 'Gece Mersin Balığı'),
    rarity: 'rare',
    shape: 'whale',
    pattern: 'none',
    colors: { body: '#445d8c', fin: '#263a61', belly: '#a9bce0', glow: '#718dff' },
    weight: [1800, 6200],
    value: 88,
    xp: 52,
    aggression: 1.02,
    lore: N(
      'Огромная и молчаливая. Её спина иногда всплывает над водой, как тёмный остров.',
      'Huge and silent. Its back sometimes surfaces like a dark island.',
      'Devasa ve sessiz. Sırtı bazen karanlık bir ada gibi su yüzüne çıkar.'
    )
  },
  {
    id: 'moon-narwhal',
    loc: 'moon',
    name: N('Лунный нарвал', 'Moon Narwhal', 'Ay Narvali'),
    rarity: 'epic',
    shape: 'narwhal',
    pattern: 'stars',
    colors: { body: '#b8c8ee', fin: '#7186c9', belly: '#f2f6ff', glow: '#d6c7ff' },
    weight: [3600, 9800],
    value: 170,
    xp: 94,
    aggression: 1.16,
    lore: N(
      'Его рог — осколок лунного света. Он прорезает воду так тихо, что слышно только звёзды.',
      'Its horn is a shard of moonlight. It cuts the water so quietly that only stars can be heard.',
      'Boynuzu ay ışığının bir parçasıdır. Suyu o kadar sessizce yarar ki yalnızca yıldızlar duyulur.'
    )
  },
  {
    id: 'crescent',
    loc: 'moon',
    name: N('Полумесяц', 'Crescent', 'Hilal'),
    rarity: 'legendary',
    shape: 'ray',
    pattern: 'none',
    colors: { body: '#cdd9ff', fin: '#8f7dff', belly: '#ffffff', glow: '#fff1b0' },
    weight: [8000, 15000],
    value: 610,
    xp: 300,
    aggression: 1.34,
    guardian: true,
    constellation: 'luna',
    lore: N(
      'Хранитель лунной дорожки. Его крылья оставляют на воде серебряный след, который не гаснет до утра.',
      'Keeper of the moonpath. Its wings leave a silver trail on the water that lasts until morning.',
      'Ay yolunun bekçisi. Kanatları suda sabaha kadar sönmeyen gümüş bir iz bırakır.'
    )
  },

  // ── Туманный плёс / Misty Reach ─────────────────────────────────────────
  {
    id: 'smoky-bleak',
    loc: 'mist',
    name: N('Дымчатая уклейка', 'Smoky Bleak', 'Dumanlı İnci Balığı'),
    rarity: 'common',
    shape: 'torpedo',
    pattern: 'none',
    colors: { body: '#8b96a8', fin: '#5b687c', belly: '#d9e0ea', glow: '#c2d4e8' },
    weight: [50, 240],
    value: 14,
    xp: 10,
    aggression: 0.6,
    lore: N(
      'Стайки уклеек рисуют в тумане едва заметные круги. По ним старые рыбаки предсказывают погоду.',
      'Schools of bleaks draw faint circles in the mist. Old anglers read the weather from them.',
      'İnci balığı sürüleri siste belli belirsiz halkalar çizer. Yaşlı balıkçılar havayı bundan okur.'
    )
  },
  {
    id: 'violet-gudgeon',
    loc: 'mist',
    name: N('Фиолетовый пескарь', 'Violet Gudgeon', 'Mor Kaya Balığı'),
    rarity: 'common',
    shape: 'round',
    pattern: 'spots',
    colors: { body: '#8b6fb8', fin: '#583d80', belly: '#e0cff5', glow: '#c4a1ff' },
    weight: [90, 420],
    value: 16,
    xp: 11,
    aggression: 0.68,
    lore: N(
      'Крошечный, но гордый. Его бока переливаются всеми оттенками вечернего неба.',
      'Tiny but proud. Its sides shimmer with every shade of the evening sky.',
      'Küçücük ama gururlu. Yanları akşam göğünün her tonuyla parıldar.'
    )
  },
  {
    id: 'marsh-loach',
    loc: 'mist',
    name: N('Болотный вьюн', 'Marsh Loach', 'Bataklık Çöpçüsü'),
    rarity: 'common',
    shape: 'ribbon',
    pattern: 'stripes',
    colors: { body: '#7c8a52', fin: '#4e5a31', belly: '#d5dfb0', glow: '#c6d98a' },
    weight: [120, 560],
    value: 17,
    xp: 12,
    aggression: 0.74,
    lore: N(
      'Живёт в самых тихих заводях. Когда он проплывает, туман на воде расходится тонкой спиралью.',
      'It lives in the quietest backwaters. When it passes, the mist on the water parts in a thin spiral.',
      'En sakin koylarda yaşar. Geçerken sudaki sis ince bir sarmal şeklinde açılır.'
    )
  },
  {
    id: 'firefly-catfish',
    loc: 'mist',
    name: N('Светлячковый сом', 'Firefly Catfish', 'Ateşböceği Yayın'),
    rarity: 'uncommon',
    shape: 'catfish',
    pattern: 'spots',
    colors: { body: '#4d5f5a', fin: '#2f3d3a', belly: '#b9cfc5', glow: '#ffe38a' },
    weight: [800, 3200],
    value: 48,
    xp: 30,
    aggression: 0.95,
    lore: N(
      'На его усах живут светлячки. Рыбаки шутят, что сом носит с собой целый фонарный переулок.',
      'Fireflies live on its whiskers. Anglers joke that the catfish carries a whole lantern alley with it.',
      'Bıyıklarında ateşböcekleri yaşar. Balıkçılar, yayının yanında koca bir fener sokağı taşıdığını söyler.'
    )
  },
  {
    id: 'mist-pike',
    loc: 'mist',
    name: N('Туманная щука', 'Mist Pike', 'Sis Turnası'),
    rarity: 'uncommon',
    shape: 'torpedo',
    pattern: 'stripes',
    colors: { body: '#6c8c82', fin: '#3f5e56', belly: '#d7e8df', glow: '#a8ffd9' },
    weight: [1200, 4600],
    value: 56,
    xp: 34,
    aggression: 1.04,
    lore: N(
      'Охотится почти вслепую, полагаясь на вибрации тумана. Её зубы похожи на тонкие льдинки.',
      'It hunts almost blind, relying on the mist’s vibrations. Its teeth look like thin pieces of ice.',
      'Neredeyse kör avlanır, sisin titreşimlerine güvenir. Dişleri ince buz parçalarına benzer.'
    )
  },
  {
    id: 'ghost-eel',
    loc: 'mist',
    name: N('Призрачный угорь', 'Ghost Eel', 'Hayalet Yılan Balığı'),
    rarity: 'rare',
    shape: 'ribbon',
    pattern: 'stars',
    colors: { body: '#b9c9cf', fin: '#7e98a3', belly: '#f3ffff', glow: '#b9fff4' },
    weight: [1400, 5200],
    value: 98,
    xp: 58,
    aggression: 1.1,
    lore: N(
      'Его тело почти прозрачно. В тумане видно, как сквозь него проплывают звёзды.',
      'Its body is almost transparent. In the mist you can see stars drifting through it.',
      'Gövdesi neredeyse saydamdır. Siste içinden yıldızların geçtiğini görebilirsiniz.'
    )
  },
  {
    id: 'marsh-lantern',
    loc: 'mist',
    name: N('Болотный фонарщик', 'Marsh Lanternfish', 'Bataklık Fener Balığı'),
    rarity: 'epic',
    shape: 'angler',
    pattern: 'spots',
    colors: { body: '#3f5b4c', fin: '#263b31', belly: '#9fc4a8', glow: '#b6ff8a' },
    weight: [2600, 8200],
    value: 190,
    xp: 105,
    aggression: 1.22,
    lore: N(
      'Его огонёк загорается ровно в тот момент, когда над озером вспыхивает первая звезда.',
      'Its light switches on exactly when the first star appears above the lake.',
      'Işığı, gölün üzerinde ilk yıldız belirdiği anda yanar.'
    )
  },
  {
    id: 'mist-whale',
    loc: 'mist',
    name: N('Туманный кит', 'Mist Whale', 'Sis Balinası'),
    rarity: 'legendary',
    shape: 'whale',
    pattern: 'none',
    colors: { body: '#879db8', fin: '#5b7694', belly: '#e8f3ff', glow: '#c7e2ff' },
    weight: [14000, 24000],
    value: 720,
    xp: 350,
    aggression: 1.42,
    guardian: true,
    constellation: 'cetus',
    lore: N(
      'Хранитель тумана. Когда он поднимается со дна, весь плёс на минуту становится белым.',
      'Keeper of the mist. When it rises from the bottom, the whole reach turns white for a minute.',
      'Sisin bekçisi. Dipten yükseldiğinde bütün koy bir dakikalığına bembeyaz olur.'
    )
  },

  // ── Ледяное зеркало / Frozen Mirror ─────────────────────────────────────
  {
    id: 'ice-smelt',
    loc: 'frozen',
    name: N('Ледяная корюшка', 'Ice Smelt', 'Buz Gümüşü'),
    rarity: 'common',
    shape: 'torpedo',
    pattern: 'scales',
    colors: { body: '#b8e4f2', fin: '#6fa8bd', belly: '#ffffff', glow: '#c8f7ff' },
    weight: [40, 220],
    value: 16,
    xp: 11,
    aggression: 0.62,
    lore: N(
      'Пахнет свежим снегом. Если положить её на лёд, она на секунду становится невидимой.',
      'It smells of fresh snow. If you lay it on the ice, it turns invisible for a second.',
      'Taze kar kokar. Buzun üzerine koyarsanız bir an görünmez olur.'
    )
  },
  {
    id: 'polar-navaga',
    loc: 'frozen',
    name: N('Северная навага', 'Polar Navaga', 'Kutup Navagası'),
    rarity: 'common',
    shape: 'round',
    pattern: 'spots',
    colors: { body: '#c3d5e8', fin: '#829cb8', belly: '#f7fbff', glow: '#d6ecff' },
    weight: [110, 520],
    value: 18,
    xp: 13,
    aggression: 0.7,
    lore: N(
      'Держится у самой кромки льда. Её чешуя звенит, если провести по ней пальцем.',
      'It stays close to the ice edge. Its scales chime if you run a finger across them.',
      'Buzun hemen kenarında durur. Parmağınızı pullarında gezdirirseniz çınlarlar.'
    )
  },
  {
    id: 'blue-whitefish',
    loc: 'frozen',
    name: N('Синий сиг', 'Blue Whitefish', 'Mavi Beyaz Balık'),
    rarity: 'common',
    shape: 'torpedo',
    pattern: 'none',
    colors: { body: '#6b91c9', fin: '#3f5f96', belly: '#dbe9ff', glow: '#9fc7ff' },
    weight: [300, 1300],
    value: 22,
    xp: 15,
    aggression: 0.78,
    lore: N(
      'Плавает медленно и торжественно, как маленький ледник.',
      'It swims slowly and solemnly, like a tiny glacier.',
      'Küçük bir buzul gibi yavaş ve görkemli yüzer.'
    )
  },
  {
    id: 'aurora-trout',
    loc: 'frozen',
    name: N('Аврора-форель', 'Aurora Trout', 'Kuzey Işığı Alabalığı'),
    rarity: 'uncommon',
    shape: 'torpedo',
    pattern: 'stripes',
    colors: { body: '#7fe0c4', fin: '#4a9c8a', belly: '#f1ffff', glow: '#b4ffcf' },
    weight: [700, 2800],
    value: 58,
    xp: 36,
    aggression: 0.96,
    lore: N(
      'Её бока светятся зелёным и фиолетовым, повторяя узор северного сияния.',
      'Its sides glow green and violet, echoing the pattern of the northern lights.',
      'Yanları yeşil ve mor parlar; kuzey ışıklarının desenini yansıtır.'
    )
  },
  {
    id: 'crystal-sturgeon',
    loc: 'frozen',
    name: N('Кристальный осётр', 'Crystal Sturgeon', 'Kristal Mersin'),
    rarity: 'uncommon',
    shape: 'sturgeon',
    pattern: 'scales',
    colors: { body: '#9fcfe0', fin: '#5d93aa', belly: '#effcff', glow: '#bdf4ff' },
    weight: [1800, 6200],
    value: 70,
    xp: 42,
    aggression: 1.02,
    lore: N(
      'Древний, как само озеро. Его костяные пластины холоднее льда.',
      'Ancient as the lake itself. Its bony plates are colder than ice.',
      'Gölün kendisi kadar eski. Kemik plakaları buzdan soğuktur.'
    )
  },
  {
    id: 'mirror-halibut',
    loc: 'frozen',
    name: N('Зеркальный палтус', 'Mirror Halibut', 'Ayna Pisi Balığı'),
    rarity: 'rare',
    shape: 'flat',
    pattern: 'none',
    colors: { body: '#d3e2ef', fin: '#8fa6bb', belly: '#ffffff', glow: '#e8f8ff' },
    weight: [2600, 9400],
    value: 115,
    xp: 66,
    aggression: 1.1,
    lore: N(
      'Его гладкая спина отражает небо так точно, что рыбу легко принять за полынью.',
      'Its smooth back reflects the sky so precisely that the fish can be mistaken for a hole in the ice.',
      'Pürüzsüz sırtı gökyüzünü o kadar net yansıtır ki balık buzdel iği sanılabilir.'
    )
  },
  {
    id: 'ice-serpent',
    loc: 'frozen',
    name: N('Ледяной змей', 'Ice Serpent', 'Buz Yılanı'),
    rarity: 'epic',
    shape: 'dragon',
    pattern: 'scales',
    colors: { body: '#88cfe8', fin: '#4a8fb0', belly: '#e6fbff', glow: '#8ff0ff' },
    weight: [5000, 13000],
    value: 240,
    xp: 130,
    aggression: 1.3,
    lore: N(
      'Подо льдом он движется без единого звука. Только трещины на поверхности выдают его путь.',
      'It moves beneath the ice without a sound. Only cracks on the surface betray its path.',
      'Buzun altında tek ses çıkarmadan hareket eder. Yolunu yalnızca yüzeydeki çatlaklar ele verir.'
    )
  },
  {
    id: 'aurora-dragon',
    loc: 'frozen',
    name: N('Аврорный дракон', 'Aurora Dragon', 'Kuzey Işığı Ejderi'),
    rarity: 'legendary',
    shape: 'dragon',
    pattern: 'stars',
    colors: { body: '#9b8cff', fin: '#63e6c4', belly: '#f4eaff', glow: '#b6ffdf' },
    weight: [18000, 32000],
    value: 850,
    xp: 410,
    aggression: 1.52,
    guardian: true,
    constellation: 'draco',
    lore: N(
      'Хранитель северного сияния. Его дыхание раскрашивает небо в те цвета, которые мы видим зимой.',
      'Keeper of the northern lights. Its breath paints the sky in the colors we see in winter.',
      'Kuzey ışıklarının bekçisi. Nefesi gökyüzünü kışın gördüğümüz renklere boyar.'
    )
  },

  // ── Бездна небес / Sky Abyss ────────────────────────────────────────────
  {
    id: 'star-herring',
    loc: 'abyss',
    name: N('Звёздная сельдь', 'Star Herring', 'Yıldız Ringası'),
    rarity: 'common',
    shape: 'torpedo',
    pattern: 'stars',
    colors: { body: '#3d4f8f', fin: '#263366', belly: '#aebcff', glow: '#ffe08a' },
    weight: [60, 300],
    value: 20,
    xp: 14,
    aggression: 0.66,
    lore: N(
      'В её брюхе мерцают золотые точки. Говорят, это проглоченные звёзды, которые ещё не погасли.',
      'Golden dots shimmer in its belly. They say these are swallowed stars that have not gone out yet.',
      'Karnında altın noktalar parıldar. Bunların henüz sönmemiş yutulmuş yıldızlar olduğu söylenir.'
    )
  },
  {
    id: 'nebula-flounder',
    loc: 'abyss',
    name: N('Небула-камбала', 'Nebula Flounder', 'Bulutsu Pisi'),
    rarity: 'common',
    shape: 'flat',
    pattern: 'spots',
    colors: { body: '#a06bd6', fin: '#69409a', belly: '#f0d9ff', glow: '#ff9de2' },
    weight: [400, 1600],
    value: 26,
    xp: 17,
    aggression: 0.77,
    lore: N(
      'На её спине медленно вращаются облака фиолетового газа. Смотреть на неё слишком долго опасно.',
      'Clouds of violet gas slowly swirl on its back. Looking at it for too long is dangerous.',
      'Sırtında mor gaz bulutları yavaşça döner. Ona çok uzun bakmak tehlikelidir.'
    )
  },
  {
    id: 'meteor-ray',
    loc: 'abyss',
    name: N('Метеорный скат', 'Meteor Ray', 'Meteor Vatozu'),
    rarity: 'common',
    shape: 'ray',
    pattern: 'stripes',
    colors: { body: '#c96a52', fin: '#8f4034', belly: '#ffd2b8', glow: '#ff9a6b' },
    weight: [900, 3400],
    value: 30,
    xp: 20,
    aggression: 0.86,
    lore: N(
      'Оставляет за собой дорожку тёплых искр. В полёте над водой он похож на падающую звезду.',
      'It leaves a trail of warm sparks. Gliding above the water, it looks like a falling star.',
      'Arkasında sıcak kıvılcımlardan bir iz bırakır. Suyun üzerinde süzülürken kayan yıldıza benzer.'
    )
  },
  {
    id: 'comet-sword',
    loc: 'abyss',
    name: N('Комета-меч', 'Comet Swordfish', 'Kuyruklu Kılıç'),
    rarity: 'uncommon',
    shape: 'sword',
    pattern: 'stars',
    colors: { body: '#5c8fd6', fin: '#345c99', belly: '#e3f0ff', glow: '#a0d8ff' },
    weight: [2200, 7600],
    value: 78,
    xp: 46,
    aggression: 1.08,
    lore: N(
      'Его «меч» светится голубым и оставляет в темноте тонкий светящийся след.',
      'Its “sword” glows blue and leaves a thin luminous trail in the dark.',
      '“Kılıcı” mavi parlar ve karanlıkta ince bir ışıklı iz bırakır.'
    )
  },
  {
    id: 'gravity-eel',
    loc: 'abyss',
    name: N('Гравитационный угорь', 'Gravity Eel', 'Yerçekimi Yılan Balığı'),
    rarity: 'uncommon',
    shape: 'ribbon',
    pattern: 'none',
    colors: { body: '#5a4b9e', fin: '#352a68', belly: '#c9baff', glow: '#a98cff' },
    weight: [1600, 6200],
    value: 86,
    xp: 50,
    aggression: 1.14,
    lore: N(
      'Вокруг него вода слегка закручивается. Мелкие рыбки держатся подальше от этой воронки.',
      'The water curls slightly around it. Smaller fish keep away from this little vortex.',
      'Etrafındaki su hafifçe kıvrılır. Küçük balıklar bu küçük girdaptan uzak durur.'
    )
  },
  {
    id: 'black-star',
    loc: 'abyss',
    name: N('Чёрная звезда', 'Black Star', 'Kara Yıldız'),
    rarity: 'rare',
    shape: 'round',
    pattern: 'stars',
    colors: { body: '#1b1630', fin: '#0d0a1c', belly: '#6b5f9e', glow: '#c7b8ff' },
    weight: [3000, 11000],
    value: 150,
    xp: 84,
    aggression: 1.2,
    lore: N(
      'Поглощает свет, но её глаза светятся ярче любой звезды. Найти её — уже большая удача.',
      'It absorbs light, yet its eyes shine brighter than any star. Finding it is already great luck.',
      'Işığı yutar ama gözleri her yıldızdan parlak parlar. Onu bulmak bile büyük şanstır.'
    )
  },
  {
    id: 'quasar',
    loc: 'abyss',
    name: N('Квазар', 'Quasar', 'Kuazar'),
    rarity: 'epic',
    shape: 'angel',
    pattern: 'stars',
    colors: { body: '#ffb45e', fin: '#e06e3d', belly: '#fff3d6', glow: '#ffdf8a' },
    weight: [6000, 15000],
    value: 320,
    xp: 170,
    aggression: 1.38,
    lore: N(
      'Самый яркий житель бездны. Его плавники излучают столько света, что тени на воде исчезают.',
      'The brightest dweller of the abyss. Its fins emit so much light that shadows on the water vanish.',
      'Uçurumun en parlak sakini. Yüzgeçleri o kadar ışık saçar ki sudaki gölgeler kaybolur.'
    )
  },
  {
    id: 'astral-leviathan',
    loc: 'abyss',
    name: N('Астральный левиафан', 'Astral Leviathan', 'Astral Leviathan'),
    rarity: 'legendary',
    shape: 'whale',
    pattern: 'stars',
    colors: { body: '#3b3a74', fin: '#25234d', belly: '#a39cff', glow: '#8adfff' },
    weight: [24000, 42000],
    value: 980,
    xp: 480,
    aggression: 1.6,
    guardian: true,
    constellation: 'hydra',
    lore: N(
      'Хранитель бездны. Его тело длиннее ночи, а сердце бьётся в ритме приливов.',
      'Keeper of the abyss. Its body is longer than the night, and its heart beats to the rhythm of the tides.',
      'Uçurumun bekçisi. Gövdesi geceden uzun, kalbi gelgitlerin ritmiyle atar.'
    )
  },

  // ── Корона Ночи / Crown of Night ────────────────────────────────────────
  {
    id: 'dawn-spark',
    loc: 'crown',
    name: N('Рассветная искра', 'Dawn Spark', 'Şafak Kıvılcımı'),
    rarity: 'common',
    shape: 'round',
    pattern: 'spots',
    colors: { body: '#ffd27a', fin: '#d99a45', belly: '#fff8df', glow: '#fff0a8' },
    weight: [50, 260],
    value: 28,
    xp: 18,
    aggression: 0.7,
    lore: N(
      'Первая рыба, которая встречает рассвет. Её чешуя тёплая даже в самую холодную воду.',
      'The first fish to greet the dawn. Its scales are warm even in the coldest water.',
      'Şafağı karşılayan ilk balık. Pulları en soğuk suda bile sıcaktır.'
    )
  },
  {
    id: 'royal-minnow',
    loc: 'crown',
    name: N('Королевская минора', 'Royal Minnow', 'Kraliyet Balığı'),
    rarity: 'common',
    shape: 'torpedo',
    pattern: 'stripes',
    colors: { body: '#5367c9', fin: '#303d8f', belly: '#dbe2ff', glow: '#9fb4ff' },
    weight: [120, 540],
    value: 32,
    xp: 21,
    aggression: 0.78,
    lore: N(
      'Плавает идеально ровными рядами со своей стаей, будто на параде.',
      'It swims in perfectly even rows with its school, as if on parade.',
      'Sürüsüyle tamamen düzenli sıralar halinde, sanki bir geçit törenindeymiş gibi yüzer.'
    )
  },
  {
    id: 'golden-veiltail',
    loc: 'crown',
    name: N('Золотая вуалехвостка', 'Golden Veiltail', 'Altın Peçe'),
    rarity: 'common',
    shape: 'angel',
    pattern: 'scales',
    colors: { body: '#f2c45e', fin: '#c98b3a', belly: '#fff4cf', glow: '#ffe49a' },
    weight: [300, 1300],
    value: 38,
    xp: 24,
    aggression: 0.88,
    lore: N(
      'Её хвост струится в воде, как шёлковая лента. Ни одна сеть не может его коснуться.',
      'Its tail streams through the water like a silk ribbon. No net can touch it.',
      'Kuyruğu suda ipek bir kurdele gibi akar. Hiçbir ağ ona dokunamaz.'
    )
  },
  {
    id: 'constellation-carp',
    loc: 'crown',
    name: N('Созвездие-карп', 'Constellation Carp', 'Takımyıldız Sazanı'),
    rarity: 'uncommon',
    shape: 'round',
    pattern: 'stars',
    colors: { body: '#394a8f', fin: '#232f66', belly: '#c7d2ff', glow: '#fff0a8' },
    weight: [1500, 5600],
    value: 105,
    xp: 62,
    aggression: 1.1,
    lore: N(
      'На его чешуе живёт маленькое созвездие. Оно двигается вместе с рыбой.',
      'A small constellation lives on its scales. It moves together with the fish.',
      'Pullarında küçük bir takımyıldız yaşar. Balıkla birlikte hareket eder.'
    )
  },
  {
    id: 'galactic-sturgeon',
    loc: 'crown',
    name: N('Галактический осётр', 'Galactic Sturgeon', 'Galaktik Mersin'),
    rarity: 'uncommon',
    shape: 'sturgeon',
    pattern: 'spots',
    colors: { body: '#876bc9', fin: '#5a4396', belly: '#e6d9ff', glow: '#c9a8ff' },
    weight: [4000, 12000],
    value: 130,
    xp: 75,
    aggression: 1.18,
    lore: N(
      'Старожил короны. Его плавники помнят времена, когда небо ещё не было разделено на созвездия.',
      'An old resident of the crown. Its fins remember the time before the sky was divided into constellations.',
      'Tacın eski sakini. Yüzgeçleri gökyüzü takımyıldızlara bölünmeden önceki zamanları hatırlar.'
    )
  },
  {
    id: 'supernova',
    loc: 'crown',
    name: N('Сверхновая', 'Supernova', 'Süpernova'),
    rarity: 'rare',
    shape: 'round',
    pattern: 'none',
    colors: { body: '#fff2f8', fin: '#ff9ed4', belly: '#ffffff', glow: '#ffd6f2' },
    weight: [6000, 16000],
    value: 210,
    xp: 115,
    aggression: 1.3,
    lore: N(
      'Вспыхивает раз в сто лет. В этот миг её видно с любого берега мира.',
      'It flares once every hundred years. In that moment it can be seen from any shore in the world.',
      'Yüz yılda bir parlar. O anda dünyanın her kıyısından görülebilir.'
    )
  },
  {
    id: 'crown-ray',
    loc: 'crown',
    name: N('Корона-скат', 'Crown Ray', 'Taç Vatozu'),
    rarity: 'epic',
    shape: 'ray',
    pattern: 'stars',
    colors: { body: '#e8c66a', fin: '#b8892f', belly: '#fff6d0', glow: '#ffe98a' },
    weight: [9000, 22000],
    value: 430,
    xp: 220,
    aggression: 1.45,
    lore: N(
      'Его крылья увенчаны золотыми лучами. Он кружит над водой, будто примеряет корону.',
      'Its wings are crowned with golden rays. It circles above the water as if trying on a crown.',
      'Kanatları altın ışınlarla taçlanmıştır. Sanki bir taç deniyormuş gibi suyun üzerinde daire çizer.'
    )
  },
  {
    id: 'astra',
    loc: 'crown',
    name: N('Астра', 'Astra', 'Astra'),
    rarity: 'mythic',
    shape: 'lyre',
    pattern: 'stars',
    colors: { body: '#fff4dc', fin: '#ffca7a', belly: '#ffffff', glow: '#fff0b8' },
    weight: [30000, 50000],
    value: 1600,
    xp: 900,
    aggression: 1.75,
    guardian: true,
    constellation: 'corona',
    final: true,
    lore: N(
      'Последняя хранительница. В её плавниках собраны все звёзды, которые когда-либо отражались в этом озере.',
      'The last keeper. Her fins hold every star that has ever been reflected in this lake.',
      'Son bekçi. Yüzgeçlerinde bu gölde yansımış tüm yıldızlar toplanmıştır.'
    )
  }
];

export const FISH_BY_ID = Object.fromEntries(FISH.map((f) => [f.id, f]));

