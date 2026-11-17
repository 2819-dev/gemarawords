import type { PackItem, Sugya } from '../types.ts'

/*
 * Bava Metzia 25a (אלו מציאות). Text follows the William Davidson / Koren
 * vocalized edition on Sefaria; pshat follows Rashi.
 */

export const BM25A_SUGYOS: Sugya[] = [
  {
    id: 'mishna',
    title: 'What you must announce',
    hebrew: 'הרי אלו חייב להכריז',
    hint: 'The mishna’s list: stacked coins, bundles, loaves, wool, jugs',
  },
  {
    id: 'kli',
    title: 'A vessel with produce in front',
    hebrew: 'כלי ולפניו פירות',
    hint: 'The diyuk, the contradiction, and four answers',
  },
  {
    id: 'tziburim',
    title: 'Piles: number or place?',
    hebrew: 'צבורי פירות',
    hint: 'Is number a siman? Is place a siman?',
  },
  {
    id: 'migdalim',
    title: 'Coins stacked like towers',
    hebrew: 'עשויין כמגדלין',
    hint: 'Rabbi Yitzchak Magdala’ah, scattered vs. overlapping',
  },
  {
    id: 'melachim',
    title: 'Three kings, one king',
    hebrew: 'של שלשה מלכים',
    hint: 'Rabbi Chanina, Rabbi Yochanan, Ravina, Rabbi Yirmeya’s questions',
  },
]

const SENTENCE_PROMPT = 'In English, what is the Gemara saying here?'

function word(
  sugya: string,
  id: string,
  hebrew: string,
  translation: string,
  keywords: string[],
): PackItem {
  return {
    id: `bm25a-w-${id}`,
    kind: 'word',
    sugya,
    hebrew,
    translation,
    prompt: `In English, what does ${hebrew} mean?`,
    keywords,
  }
}

function sentence(
  sugya: string,
  id: string,
  hebrew: string,
  translation: string,
  keywords: string[],
  prompt = SENTENCE_PROMPT,
): PackItem {
  return { id: `bm25a-s-${id}`, kind: 'sentence', sugya, hebrew, translation, prompt, keywords }
}

function question(
  sugya: string,
  id: string,
  hebrew: string,
  prompt: string,
  translation: string,
  keywords: string[],
): PackItem {
  return { id: `bm25a-q-${id}`, kind: 'question', sugya, hebrew, prompt, translation, keywords }
}

const WORDS: PackItem[] = [
  // The mishna
  word('mishna', 'lehachriz', 'חַיָּיב לְהַכְרִיז', 'He must announce it (hachraza)', [
    'must announce',
    'announce',
    'hachraza',
    'proclaim',
    'has to announce',
  ]),
  word('mishna', 'harei-shelo', 'הֲרֵי אֵלּוּ שֶׁלּוֹ', 'These belong to the finder', [
    'belong to the finder',
    'finder keeps',
    'keep',
    'his',
  ]),
  word('mishna', 'shalosh', 'שְׁלֹשָׁה מַטְבְּעוֹת זֶה עַל גַּב זֶה', 'Three coins one on top of the other', [
    'three coins',
    'on top of each other',
    'stacked',
    'one on top',
  ]),
  word('mishna', 'kerichos', 'כְּרִיכוֹת בִּרְשׁוּת הַיָּחִיד', 'Bundles of grain in a private area', [
    'bundles',
    'sheaves',
    'private',
    'reshus hayachid',
  ]),
  word('mishna', 'kikaros', 'כִּכָּרוֹת שֶׁל בַּעַל הַבַּיִת', 'Loaves of a homeowner (each bakes his own way)', [
    'loaves',
    'homeowner',
    'baal habayis',
    'home baked',
  ]),
  word('mishna', 'gizei', 'גִּיזֵּי צֶמֶר הַלְּקוּחִין מִבֵּית הָאוּמָּן', 'Wool fleeces taken from a craftsman’s house', [
    'wool',
    'fleeces',
    'craftsman',
  ]),
  word('mishna', 'kadei', 'כַּדֵּי יַיִן וְכַדֵּי שֶׁמֶן', 'Jugs of wine and jugs of oil', [
    'jugs',
    'wine',
    'oil',
  ]),
  word('mishna', 'gemara-taama', 'טַעְמָא דְּ...', 'The reason is because… (a diyuk)', [
    'the reason',
    'reason is',
    'only because',
    'diyuk',
  ]),

  // Vessel with produce in front
  word('kli', 'kli-lefanav', 'כְּלִי וּלְפָנָיו פֵּירוֹת', 'A vessel with produce in front of it', [
    'vessel',
    'produce in front',
    'in front of it',
  ]),
  word('kli', 'kis', 'כִּיס וּלְפָנָיו מָעוֹת', 'A pouch with coins in front of it', [
    'pouch',
    'wallet',
    'coins in front',
  ]),
  word('kli', 'miktzasan', 'מִקְצָתָן בַּכְּלִי וּמִקְצָתָן עַל גַּבֵּי קַרְקַע', 'Some in the vessel and some on the ground', [
    'some in the vessel',
    'some on the ground',
    'part in',
    'partly',
  ]),
  word('kli', 'tneina', 'תְּנֵינָא לְהָא', 'We already learned this (in the mishna)', [
    'already learned',
    'we learned this',
    'tneina',
  ]),
  word('kli', 'rminhu', 'וּרְמִינְהוּ', 'And they contradicted it — a contradiction', [
    'contradiction',
    'contradict',
    'rminhu',
    'raised a contradiction',
  ]),
  word('kli', 'bitzad', 'דָּבָר שֶׁאֵין בּוֹ סִימָן בְּצַד דָּבָר שֶׁיֵּשׁ בּוֹ סִימָן', 'Something with no siman next to something with a siman', [
    'no siman next to',
    'next to something with a siman',
    'beside',
  ]),
  word('kli', 'zacha', 'זָכָה הַלָּה', 'The other one (the finder) acquires it', [
    'finder acquires',
    'acquires',
    'gets it',
    'zacha',
  ]),
  word('kli', 'kuba', 'כּוּבָּא וְכִיתָּנָא', 'A container and flax', ['container', 'flax', 'linen']),
  word('kli', 'tzana', 'צַנָּא וּפֵירֵי', 'A basket and produce', ['basket', 'produce', 'fruit']),
  word('kli', 'ishtayar', 'דְּאִשְׁתְּיַיר בַּהּ מִידֵּי', 'Where something was left in it', [
    'something left',
    'left in it',
    'remained',
  ]),
  word('kli', 'mehadri', 'דִּמְהַדְּרִי אַפֵּיהּ לְגַבֵּי פֵּירֵי', 'Its mouth is turned toward the produce', [
    'facing the produce',
    'mouth turned',
    'opening facing',
    'turned toward',
  ]),
  word('kli', 'ugnin', 'אוּגְנִין', 'A rim', ['rim', 'edge', 'lip', 'border']),
  word('kli', 'ibaeis', 'וְאִיבָּעֵית אֵימָא', 'And if you want, say', [
    'if you want say',
    'alternatively',
    'or say',
    'ibaeis eima',
  ]),

  // Piles
  word('tziburim', 'tzibur', 'צִבּוּרֵי פֵירוֹת', 'Piles of produce', ['piles', 'produce', 'heaps']),
  word('tziburim', 'minyan', 'מִנְיָן הָוֵי סִימָן', 'Number is a siman', [
    'number is a siman',
    'number',
    'count',
    'minyan',
  ]),
  word('tziburim', 'makom', 'מָקוֹם הָוֵי סִימָן', 'Place is a siman', [
    'place is a siman',
    'place',
    'location',
    'makom',
  ]),
  word('tziburim', 'shamat', 'שָׁמְעַתְּ מִינַּהּ', 'You learn from it', [
    'learn from it',
    'prove',
    'conclude',
    'shmaat minah',
  ]),
  word('tziburim', 'tni', 'תְּנִי', 'Read it as (change the girsa)', [
    'read it',
    'learn it as',
    'teach',
    'girsa',
  ]),

  // Towers
  word('migdalim', 'migdalin', 'עֲשׂוּיִין כְּמִגְדָּלִין', 'Arranged like towers', [
    'like towers',
    'towers',
    'stacked',
  ]),
  word('migdalim', 'mefuzaros', 'מָעוֹת מְפוּזָּרוֹת', 'Scattered coins', ['scattered coins', 'scattered']),
  word('migdalim', 'meshalchefei', 'מְשַׁלְחֲפִי שַׁלְחוֹפֵי', 'Partly overlapping', [
    'overlapping',
    'partly overlapping',
    'partly on each other',
  ]),
  word('migdalim', 'gufa', 'הָא גּוּפַהּ קַשְׁיָא', 'This itself is difficult', [
    'itself is difficult',
    'contradicts itself',
    'difficult',
  ]),
  word('migdalim', 'reisha-seifa', 'אֵימָא סֵיפָא', 'Say the end (of the braisa)', [
    'end',
    'seifa',
    'last part',
    'say the end',
  ]),
  word('migdalim', 'karei', 'מְפוּזָּרוֹת קָרֵי לְהוּ', 'He calls them “scattered”', [
    'calls them scattered',
    'called scattered',
    'counts as scattered',
  ]),

  // Kings
  word('melachim', 'shlosha-melachim', 'שֶׁל שְׁלֹשָׁה מְלָכִים', 'Of three kings (minted by three kings)', [
    'three kings',
    'three different kings',
    'minted',
  ]),
  word('melachim', 'melech-echad', 'שֶׁל מֶלֶךְ אֶחָד', 'Of one king', ['one king', 'same king']),
  word('melachim', 'revicha', 'רְוִיחָא תַּתָּאָה', 'The widest one on the bottom', [
    'widest on the bottom',
    'biggest on the bottom',
    'wide',
    'bottom',
  ]),
  word('melachim', 'mtzia', 'וּמְצִיעָא עִילָּוֵיהּ', 'And the middle one on top of it', [
    'middle',
    'medium',
    'on top',
  ]),
  word('melachim', 'zuta', 'וְזוּטָא', 'And the smallest', ['smallest', 'small']),
  word('melachim', 'anuchei', 'אַנּוֹחֵי אַנְחִינְהוּ', 'Someone placed them there on purpose', [
    'placed them',
    'put them down',
    'on purpose',
    'placed',
  ]),
  word('melachim', 'isrumei', 'אִתְרְמוֹיֵי אִתְרְמִי', 'It just happened by chance', [
    'by chance',
    'happened',
    'coincidence',
    'just happened',
  ]),
  word('melachim', 'tivah', 'טִבְעָא מַכְרֵיז', 'He announces “coins”', [
    'announces coins',
    'coins',
    'matbea',
  ]),
  word('melachim', 'kesheir', 'כְּשֵׁיר', 'Like a bracelet (in a circle)', ['bracelet', 'circle', 'ring']),
  word('melachim', 'kshura', 'כְּשׁוּרָה', 'Like a row (in a line)', ['row', 'line', 'straight']),
  word('melachim', 'chatzuva', 'כַּחֲצוּבָה', 'Like a tripod (a triangle)', ['triangle', 'tripod']),
  word('melachim', 'sulam', 'כְּסוּלָּם', 'Like a ladder (each partly on the next)', [
    'ladder',
    'steps',
    'partly on the next',
  ]),
  word('melachim', 'kisam', 'קֵיסָם', 'A wood chip', ['wood chip', 'chip', 'splinter', 'stick']),
]

const SENTENCES: PackItem[] = [
  sentence(
    'mishna',
    'list',
    'שְׁלֹשָׁה מַטְבְּעוֹת זֶה עַל גַּב זֶה, כְּרִיכוֹת בִּרְשׁוּת הַיָּחִיד, וְכִכָּרוֹת שֶׁל בַּעַל הַבַּיִת... הֲרֵי אֵלּוּ חַיָּיב לְהַכְרִיז.',
    'Three coins stacked on each other, bundles in a private area, a homeowner’s loaves — for these the finder must announce.',
    ['must announce', 'three coins', 'bundles', 'loaves'],
  ),
  sentence(
    'kli',
    'taama',
    'טַעְמָא דְּמָצָא פֵּירוֹת בִּכְלִי וּמָעוֹת בְּכִיס. הָא כְּלִי וּלְפָנָיו פֵּירוֹת, כִּיס וּלְפָנָיו מָעוֹת – הֲרֵי אֵלּוּ שֶׁלּוֹ.',
    'The reason he must announce is that the produce was inside the vessel and the coins inside the pouch. But a vessel with produce in front of it, or a pouch with coins in front of it — the finder keeps them.',
    ['inside the vessel', 'in front of it', 'finder keeps', 'belong to the finder'],
    'In English, what diyuk is the Gemara making here?',
  ),
  sentence(
    'kli',
    'miktzasan',
    'מִקְצָתָן בַּכְּלִי וּמִקְצָתָן עַל גַּבֵּי קַרְקַע... חַיָּיב לְהַכְרִיז.',
    'If some are in the vessel and some on the ground, he must announce.',
    ['some in the vessel', 'some on the ground', 'must announce'],
  ),
  sentence(
    'kli',
    'rminhu',
    'מָצָא דָּבָר שֶׁאֵין בּוֹ סִימָן בְּצַד דָּבָר שֶׁיֵּשׁ בּוֹ סִימָן – חַיָּיב לְהַכְרִיז. בָּא בַּעַל סִימָן וְנָטַל אֶת שֶׁלּוֹ – זָכָה הַלָּה בְּדָבָר שֶׁאֵין בּוֹ סִימָן.',
    'If he found something with no siman next to something with a siman, he must announce both. If the owner of the siman item came and took only his, the finder acquires the item with no siman.',
    ['no siman next to', 'must announce', 'finder acquires', 'took his'],
    'In English, what is this braisa, and why does it contradict the mishna?',
  ),
  sentence(
    'kli',
    'zevid',
    'הָא בְּכוּבָּא וְכִיתָּנָא, הָא בְּצַנָּא וּפֵירֵי.',
    'Rav Zevid: the braisa is a container and flax; the mishna is a basket and produce.',
    ['flax', 'container', 'basket', 'produce', 'rav zevid'],
    'In English, how does Rav Zevid answer the contradiction?',
  ),
  sentence(
    'kli',
    'pappa',
    'הָא וְהָא בְּצַנָּא וּפֵירֵי... הָא דְּאִשְׁתְּיַיר בַּהּ מִידֵּי, הָא דְּלָא אִשְׁתְּיַיר בַּהּ מִידֵּי.',
    'Rav Pappa: both are a basket and produce. The braisa is where something was left in the basket; the mishna is where nothing was left.',
    ['something left', 'nothing left', 'basket', 'rav pappa'],
    'In English, how does Rav Pappa answer the contradiction?',
  ),
  sentence(
    'kli',
    'mehadri',
    'הָא דִּמְהַדְּרִי אַפֵּיהּ לְגַבֵּי פֵּירֵי, הָא דְּלָא מְהַדְּרִי אַפֵּיהּ לְגַבֵּי פֵּירֵי.',
    'One is where the basket’s mouth faces the produce; the other is where it does not.',
    ['facing the produce', 'mouth', 'does not face', 'turned'],
  ),
  sentence(
    'kli',
    'ugnin',
    'הָא דְּאִית לֵהּ אוּגְנִין לְצַנָּא, הָא דְּלֵית לֵהּ אוּגְנִין לְצַנָּא.',
    'One is where the basket has a rim; the other is where it has no rim.',
    ['rim', 'no rim', 'basket'],
  ),
  sentence(
    'tziburim',
    'tziburim',
    'צִבּוּרֵי פֵירוֹת וְצִבּוּרֵי מָעוֹת. שָׁמְעַתְּ מִינַּהּ מִנְיָן הָוֵי סִימָן, תְּנִי: ״צִבּוּר פֵּירוֹת״. שָׁמְעַתְּ מִינַּהּ מָקוֹם הָוֵי סִימָן, תְּנִי: ״צִבּוּרֵי פֵּירוֹת״.',
    'Piles of produce: learn that number is a siman? Read it “a pile.” Then learn that place is a siman? Read it “piles.” So nothing can be proven.',
    ['number', 'place', 'pile', 'nothing proven', 'no proof'],
    'In English, what is the Gemara going back and forth about?',
  ),
  sentence(
    'migdalim',
    'magdalah',
    'אָמַר רַבִּי יִצְחָק מַגְדְּלָאָה: וְהוּא שֶׁעֲשׂוּיִין כְּמִגְדָּלִין.',
    'Rabbi Yitzchak Magdala’ah: he must announce only when the coins are arranged like towers.',
    ['like towers', 'only when', 'arranged', 'towers'],
  ),
  sentence(
    'migdalim',
    'gufa',
    'אָמְרַתְּ מָצָא מָעוֹת מְפוּזָּרוֹת הֲרֵי אֵלּוּ שֶׁלּוֹ, הָא מְשַׁלְחֲפִי שַׁלְחוֹפֵי חַיָּיב לְהַכְרִיז! אֵימָא סֵיפָא... הָא מְשַׁלְחֲפִי שַׁלְחוֹפֵי הֲרֵי אֵלּוּ שֶׁלּוֹ!',
    'The braisa contradicts itself: the beginning implies overlapping coins must be announced, and the end implies overlapping coins belong to the finder.',
    ['contradicts itself', 'overlapping', 'beginning', 'end', 'announce'],
    'In English, what is the problem in the braisa?',
  ),
  sentence(
    'migdalim',
    'karei',
    'תָּנָא כֹּל שֶׁאֵין עֲשׂוּיִין כְּמִגְדָּלִין – מְפוּזָּרוֹת קָרֵי לְהוּ.',
    'The tanna calls anything not arranged like towers “scattered,” so overlapping coins belong to the finder.',
    ['scattered', 'not like towers', 'overlapping', 'finder'],
  ),
  sentence(
    'melachim',
    'chanina',
    'אָמַר רַבִּי חֲנִינָא: לֹא שָׁנוּ אֶלָּא שֶׁל שְׁלֹשָׁה מְלָכִים, אֲבָל שֶׁל מֶלֶךְ אֶחָד אֵינוֹ חַיָּיב לְהַכְרִיז.',
    'Rabbi Chanina: he must announce only coins of three kings, but coins of one king he need not announce.',
    ['three kings', 'one king', 'need not announce', 'only'],
  ),
  sentence(
    'melachim',
    'heichi',
    'אִי דַּעֲשׂוּיִין כְּמִגְדָּלִין – אֲפִילּוּ שֶׁל מֶלֶךְ אֶחָד נָמֵי, וְאִי דְּאֵין עֲשׂוּיִין כְּמִגְדָּלִין – אֲפִילּוּ שֶׁל שְׁלֹשָׁה מְלָכִים נָמֵי לָא!',
    'If they are like towers, even one king’s coins should be announced; if not like towers, even three kings’ coins should not!',
    ['towers', 'even one king', 'even three kings', 'not like towers'],
    'In English, what is the Gemara asking on Rabbi Chanina?',
  ),
  sentence(
    'melachim',
    'revicha',
    'רְוִיחָא תַּתָּאָה וּמְצִיעָא עִילָּוֵיהּ וְזוּטָא עִילָּוֵיהּ מְצִיעָא. דְּאָמְרִינַן: אַנּוֹחֵי אַנְחִינְהוּ.',
    'The widest on the bottom, the middle on it, the smallest on top — so we say someone placed them there on purpose.',
    ['widest on the bottom', 'smallest on top', 'placed', 'on purpose'],
  ),
  sentence(
    'melachim',
    'isrumei',
    'אֲבָל שֶׁל מֶלֶךְ אֶחָד, דְּכוּלְּהוּ כִּי הֲדָדֵי נִינְהוּ... אֵימַר: אִתְרְמוֹיֵי אִתְרְמִי וּבַהֲדֵי הֲדָדֵי נְפוּל.',
    'But one king’s coins are all the same size, so we say they just happened to fall together.',
    ['same size', 'by chance', 'fell together', 'happened'],
  ),
  sentence(
    'melachim',
    'yochanan',
    'וְרַבִּי יוֹחָנָן אָמַר: אֲפִילּוּ שֶׁל מֶלֶךְ אֶחָד נָמֵי מַכְרֵיז. מַאי מַכְרֵיז? מִנְיָן.',
    'Rabbi Yochanan: even coins of one king he announces. What is the siman? The number.',
    ['even one king', 'number', 'announces', 'rabbi yochanan'],
  ),
  sentence(
    'melachim',
    'kisam',
    'כֹּל שֶׁאִילּוּ מַכְנִיס לָהֶן קֵיסָם בֵּינֵיהֶן וְנוֹטְלָם בְּבַת אַחַת, חַיָּיב לְהַכְרִיז.',
    'Any arrangement where you could slip a wood chip between them and lift them all at once must be announced.',
    ['wood chip', 'lift them all', 'at once', 'must announce'],
  ),
]

const QUESTIONS: PackItem[] = [
  question(
    'mishna',
    'why-announce',
    'הֲרֵי אֵלּוּ חַיָּיב לְהַכְרִיז',
    'Why must the finder announce a homeowner’s loaves or wool from a craftsman?',
    'They have a siman: each homeowner bakes his own way and each craftsman works wool his own way, so the owner can identify them.',
    ['siman', 'own way', 'identify', 'recognize'],
  ),
  question(
    'mishna',
    'list',
    'הֲרֵי אֵלּוּ חַיָּיב לְהַכְרִיז',
    'Name three things in the mishna that the finder must announce.',
    'Three stacked coins, bundles in a private area, a homeowner’s loaves, wool from a craftsman, jugs of wine and oil.',
    ['three coins', 'bundles', 'loaves', 'wool', 'jugs'],
  ),
  question(
    'kli',
    'diyuk',
    'טַעְמָא דְּמָצָא פֵּירוֹת בִּכְלִי',
    'What diyuk does the Gemara make from “produce in a vessel”?',
    'Only produce inside the vessel must be announced. If the produce is in front of the vessel, the finder keeps it.',
    ['in front', 'finder keeps', 'inside the vessel', 'only inside'],
  ),
  question(
    'kli',
    'miktzasan',
    'מִקְצָתָן בַּכְּלִי וּמִקְצָתָן עַל גַּבֵּי קַרְקַע',
    'What if some of the produce is in the vessel and some is on the ground?',
    'He must announce, since it clearly fell out of the vessel.',
    ['must announce', 'fell out', 'announce'],
  ),
  question(
    'kli',
    'kashya',
    'בְּצַד דָּבָר שֶׁיֵּשׁ בּוֹ סִימָן',
    'Why does the braisa about something with no siman next to something with a siman contradict the mishna?',
    'The braisa says he must announce both, so produce next to a vessel should be announced too — but the mishna says produce in front of a vessel is the finder’s.',
    ['announce both', 'next to', 'contradict', 'in front', 'finders'],
  ),
  question(
    'kli',
    'zevid',
    'כּוּבָּא וְכִיתָּנָא',
    'Rav Zevid: why is flax next to a container announced, but produce next to a basket kept?',
    'Flax strands hold together, so all of it can fall out at once. Loose produce would leave some in the basket, so if nothing is left it never came from there.',
    ['hold together', 'all falls', 'some left', 'never came from'],
  ),
  question(
    'kli',
    'pappa',
    'דְּאִשְׁתְּיַיר בַּהּ מִידֵּי',
    'How does Rav Pappa answer the contradiction?',
    'Both are a basket and produce. If something was left in the basket, announce; if nothing was left, the finder keeps it.',
    ['something left', 'nothing left', 'announce', 'keeps'],
  ),
  question(
    'kli',
    'two-more',
    'וְאִיבָּעֵית אֵימָא',
    'What are the two “if you want, say” answers?',
    'One: it depends whether the basket’s mouth faces the produce. Two: even if it faces it, it depends whether the basket has a rim, which would have held some produce back.',
    ['mouth faces', 'facing', 'rim', 'held back'],
  ),
  question(
    'tziburim',
    'minyan',
    'צִבּוּרֵי פֵירוֹת',
    'From “piles of produce,” what does the Gemara try to prove, and what is the answer?',
    'That number is a siman. Answer: read it “a pile” — then try to prove place is a siman; answer: read it “piles.” Nothing is proven.',
    ['number', 'place', 'nothing proven', 'no proof', 'read it'],
  ),
  question(
    'migdalim',
    'towers',
    'עֲשׂוּיִין כְּמִגְדָּלִין',
    'According to Rabbi Yitzchak Magdala’ah, when must three stacked coins be announced?',
    'Only when they are arranged like towers, one neatly on top of the other.',
    ['like towers', 'neatly', 'on top'],
  ),
  question(
    'migdalim',
    'overlapping',
    'מְשַׁלְחֲפִי שַׁלְחוֹפֵי',
    'What about coins that partly overlap — announce or keep? How does the Gemara settle the braisa?',
    'Keep them. The tanna calls anything not arranged like towers “scattered.”',
    ['keep', 'scattered', 'not like towers', 'finder'],
  ),
  question(
    'melachim',
    'chanina-kashya',
    'לֹא שָׁנוּ אֶלָּא שֶׁל שְׁלֹשָׁה מְלָכִים',
    'What is the problem with Rabbi Chanina’s first version about three kings?',
    'If the coins are like towers, even one king’s coins should be announced; if they are not, even three kings’ coins should not. Which king minted them should not matter.',
    ['towers', 'should not matter', 'even one king', 'even three kings'],
  ),
  question(
    'melachim',
    'chanina-answer',
    'כְּעֵין שְׁלֹשָׁה מְלָכִים',
    'How is Rabbi Chanina’s statement restated?',
    'One king’s coins in three sizes, like three kings’ coins: widest on the bottom, middle, smallest on top — someone placed them. Same-size coins could have fallen that way by chance, so the finder keeps them.',
    ['three sizes', 'widest on the bottom', 'placed', 'by chance', 'same size'],
  ),
  question(
    'melachim',
    'yochanan',
    'אֲפִילּוּ שֶׁל מֶלֶךְ אֶחָד נָמֵי מַכְרֵיז',
    'Rabbi Yochanan says even one king’s coins are announced. What is the siman?',
    'The number of coins.',
    ['number', 'how many', 'count'],
  ),
  question(
    'melachim',
    'ravina',
    'טִבְעָא מַכְרֵיז',
    'If the siman is the number, why does the mishna need three coins and not two? What does Ravina answer?',
    'The finder announces “coins,” which already means at least two. So saying “two” is no siman; three is.',
    ['coins means two', 'at least two', 'no siman', 'three'],
  ),
  question(
    'melachim',
    'yirmeya',
    'כְּשֵׁיר, כְּשׁוּרָה, כַּחֲצוּבָה, כְּסוּלָּם',
    'What are Rabbi Yirmeya’s four questions, and which one gets answered?',
    'Coins in a circle, a row, a triangle, or a ladder. The ladder is answered: if a wood chip slipped between them could lift them all at once, he must announce.',
    ['circle', 'row', 'triangle', 'ladder', 'wood chip'],
  ),
]

export const BM25A_ITEMS: PackItem[] = [...WORDS, ...SENTENCES, ...QUESTIONS]
