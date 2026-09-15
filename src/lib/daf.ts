import type { Card, CardKind, TranslationSource } from './types.ts'

export type DafPage = {
  id: string
  ref: string
  lookupRef: string
  label: string
  hebrewLabel: string
  chapter: string
  available: boolean
}

export const PAGES: DafPage[] = [
  {
    id: 'bava-metzia-21b',
    ref: 'Bava_Metzia.21b',
    lookupRef: 'Bava Metzia 21b',
    label: 'Bava Metzia 21b',
    hebrewLabel: 'בבא מציעא כ״א ע״ב',
    chapter: 'אלו מציאות',
    available: true,
  },
]

export const DEFAULT_SENTENCE_PROMPT = 'In English, what is the Gemara saying here?'

type PackItem = {
  id: string
  kind: CardKind
  hebrew: string
  translation: string
  prompt?: string
  keywords?: string[]
}

function cardFromItem(item: PackItem): Card {
  return {
    ...item,
    weight: 1,
    consecutiveCorrect: 0,
    source: 'sefaria' as TranslationSource,
  }
}

function word(
  id: string,
  hebrew: string,
  translation: string,
  keywords: string[],
): PackItem {
  return {
    id: `bm21b-w-${id}`,
    kind: 'word',
    hebrew,
    translation,
    prompt: `In English, what does ${hebrew} mean?`,
    keywords,
  }
}

function sentence(
  id: string,
  hebrew: string,
  translation: string,
  keywords: string[],
  prompt = DEFAULT_SENTENCE_PROMPT,
): PackItem {
  return {
    id: `bm21b-s-${id}`,
    kind: 'sentence',
    hebrew,
    translation,
    prompt,
    keywords,
  }
}

function question(
  id: string,
  hebrew: string,
  prompt: string,
  translation: string,
  keywords: string[],
): PackItem {
  return {
    id: `bm21b-q-${id}`,
    kind: 'question',
    hebrew,
    prompt,
    translation,
    keywords,
  }
}

const WORDS: PackItem[] = [
  word('yeush', 'יֵאוּשׁ', 'Giving up hope', [
    'giving up hope',
    'give up hope',
    'yeush',
    'despair',
  ]),
  word(
    'yeush-shelo',
    'יֵאוּשׁ שֶׁלֹּא מִדַּעַת',
    'Giving up hope without knowledge — the owner does not yet know he lost it',
    ['giving up hope', 'without knowledge', 'shelo midaas', 'didnt know', 'doesnt know'],
  ),
  word(
    'aveidah-midaas',
    'אֲבֵידָה מִדַּעַת',
    'A loss he knew about — he left it on purpose',
    ['with knowledge', 'he knew', 'midaas', 'knew he was leaving'],
  ),
  word('abaye', 'אַבָּיֵי', 'The Amora who holds it is not ye’ush', [
    'abaye',
    'not yeush',
    'lo havei',
  ]),
  word('rava', 'רָבָא', 'The Amora who holds it is ye’ush', [
    'rava',
    'is yeush',
    'havei yeush',
  ]),
  word('lo-havei', 'לָא הָוֵי יֵאוּשׁ', 'It is not ye’ush', [
    'not yeush',
    'not giving up hope',
    'lo havei',
  ]),
  word('havei-yeush', 'הָוֵי יֵאוּשׁ', 'It is ye’ush', [
    'is yeush',
    'it is yeush',
    'havei yeush',
  ]),
  word('siman', 'סִימָן', 'A mark that identifies the object', [
    'siman',
    'mark',
    'sign',
    'identifying mark',
  ]),
  word(
    'yes-siman',
    'דָּבָר שֶׁיֵּשׁ בּוֹ סִימָן',
    'Something that has a siman',
    ['has a siman', 'has a mark', 'with a siman'],
  ),
  word(
    'no-siman',
    'דָּבָר שֶׁאֵין בּוֹ סִימָן',
    'Something that has no siman',
    ['no siman', 'no mark', 'without a siman'],
  ),
  word(
    'kuli-alma',
    'כּוּלֵּי עָלְמָא לָא פְּלִיגִי',
    'Everyone agrees — there is no machlokes',
    ['everyone agrees', 'no machlokes', 'kuli alma'],
  ),
  word('ki-pligi', 'כִּי פְּלִיגִי', 'This is where they argue', [
    'they argue',
    'machlokes',
    'where they argue',
  ]),
  word(
    'ata-lideih',
    'אֲתָא לִידֵיהּ',
    'It came into the finder’s hand',
    ['came into his hand', 'came to the finder', 'ata lideih'],
  ),
  word(
    'issura',
    'בְּאִיסּוּרָא',
    'In issur — while it was still forbidden',
    ['issur', 'forbidden', 'assur', 'still forbidden'],
  ),
  word(
    'simana-leit',
    'סִימָנָא לֵית לִי בְּגַוֵּיהּ',
    'I have no siman in it',
    ['no siman', 'no mark', 'cannot identify'],
  ),
  word('zuto', 'זוּטוֹ שֶׁל יָם', 'The wash of the sea', ['wash', 'tide', 'sea']),
  word('river', 'שְׁלוּלִיתוֹ שֶׁל נָהָר', 'The overflow of a river', [
    'overflow',
    'river',
    'flood',
  ]),
  word('rachmana', 'רַחֲמָנָא שַׁרְיֵיהּ', 'The Torah permits it', [
    'matir',
    'permits',
    'mutar',
    'torah permits',
  ]),
  word('ta-shema', 'תָּא שְׁמַע', 'Come and hear — the Gemara is bringing a raayah', [
    'come and hear',
    'come hear',
    'raayah',
    'proof',
  ]),
  word('peiros', 'פֵּירוֹת מְפוּזָּרִין', 'Scattered fruit', [
    'scattered fruit',
    'scattered produce',
  ]),
  word('maos', 'מָעוֹת מְפוּזָּרוֹת', 'Scattered coins', ['scattered coins']),
  word(
    'maknishata',
    'מַכְנַשְׁתָּא דְּבֵי דָרֵי',
    'Leftover grain on the threshing floor',
    ['leftover', 'threshing floor', 'grain', 'sweepings'],
  ),
  word(
    'pocket',
    'אָדָם עָשׂוּי לְמַשְׁמֵשׁ בְּכִיסוֹ',
    'A person is used to feeling his pocket',
    ['feeling his pocket', 'checks his pocket', 'pocket'],
  ),
  word('deveilah', 'עִיגּוּלֵי דְבֵילָה', 'Cakes of dried figs', [
    'dried figs',
    'fig cakes',
    'cakes of dried figs',
  ]),
  word('loaves', 'כִּכָּרוֹת שֶׁל נַחְתּוֹם', "A baker's loaves", ['baker', 'loaves']),
  word('argaman', 'לְשׁוֹנוֹת שֶׁל אַרְגָּמָן', 'Strips of purple wool', [
    'purple wool',
    'argaman',
  ]),
  word(
    'shuls',
    'בָּתֵּי כְנֵסִיּוֹת וּבָתֵּי מִדְרָשׁוֹת',
    'Shuls and batei midrash',
    ['shuls', 'batei midrash', 'shul', 'beis medrash'],
  ),
  word(
    'harei-shelo',
    'הֲרֵי אֵלּוּ שֶׁלּוֹ',
    'These belong to the finder',
    ['belong to the finder', 'finder may keep', 'shelo'],
  ),
  word('mida-yada', 'מִידָּע יָדַע', 'He definitely knows', [
    'he knows',
    'definitely knows',
    'mida yada',
  ]),
  word('yakirei', 'אַגַּב דְּיַקִּירֵי', 'Because they are heavy', ['heavy', 'yakirei']),
  word('chashivei', 'אַגַּב דַּחֲשִׁיבִי', 'Because they are important', [
    'important',
    'chashivei',
  ]),
  word('kava', 'כַּבָּא דְחִטֵּי', 'A kav of wheat', ['kav', 'wheat', 'kava']),
  word('mityaashin', 'מִתְיָאֲשִׁין', 'They give up hope', [
    'give up hope',
    'mityaashin',
    'owners give up',
  ]),
  word(
    'lo-yada-nafal',
    'לָא יָדַע דִּנְפַל מִינֵּיהּ',
    'He did not know it fell from him',
    ['didnt know', 'did not know', 'fell', 'lo yada'],
  ),
  word('leket', 'לֶקֶט', 'Leftover stalks left for a poor person', [
    'leket',
    'gleanings',
    'ani',
  ]),
  word(
    'nemushot',
    'נָמוֹשׁוֹת',
    'The last people through the field',
    ['last ones', 'elderly', 'leket after leket', 'nemushot'],
  ),
  word('ketziot', 'קְצִיעוֹת', 'Dried figs', ['dried figs']),
  word(
    'chazuto',
    'חָזוּתוֹ מוֹכִיחַ עָלָיו',
    'Its look proves whose it is',
    ['look proves', 'proves whose', 'identifies'],
  ),
  word(
    'teena',
    'תְּאֵנָה עִם נְפִילָתָהּ נִמְאֶסֶת',
    'A fig becomes repulsive when it falls',
    ['fig', 'repulsive', 'falls'],
  ),
]

const SENTENCES: PackItem[] = [
  sentence(
    'machlokes',
    'יֵאוּשׁ שֶׁלֹּא מִדַּעַת, אַבָּיֵי אָמַר: לָא הָוֵי יֵאוּשׁ. וְרָבָא אָמַר: הָוֵי יֵאוּשׁ.',
    'Abaye and Rava argue about giving up hope without knowledge. Abaye says it is not ye’ush. Rava says it is ye’ush.',
    ['abaye', 'rava', 'not yeush', 'is yeush', 'without knowledge'],
  ),
  sentence(
    'yes-siman',
    'בְּדָבָר שֶׁיֵּשׁ בּוֹ סִימָן – כּוּלֵּי עָלְמָא לָא פְּלִיגִי דְּלָא הָוֵי יֵאוּשׁ.',
    'By something that has a siman, everyone agrees it is not ye’ush.',
    ['has a siman', 'everyone agrees', 'not yeush'],
    'In English, what diyuk is the Gemara making here?',
  ),
  sentence(
    'sea',
    'בְּזוּטוֹ שֶׁל יָם וּבִשְׁלוּלִיתוֹ שֶׁל נָהָר, אַף עַל גַּב דְּאִית בֵּיהּ סִימָן, רַחֲמָנָא שַׁרְיֵיהּ.',
    'By the wash of the sea and the overflow of a river, even if it has a siman, the Torah permits it.',
    ['sea', 'river', 'siman', 'torah permits', 'matir'],
  ),
  sentence(
    'no-siman',
    'כִּי פְּלִיגִי בְּדָבָר שֶׁאֵין בּוֹ סִימָן. אַבָּיֵי אָמַר: לָא הָוֵי יֵאוּשׁ, דְּהָא לָא יָדַע דִּנְפַל מִינֵּיהּ. רָבָא אָמַר: הָוֵי יֵאוּשׁ.',
    'They only argue when there is no siman. Abaye says it is not ye’ush because the owner did not know it fell. Rava says it already is ye’ush.',
    ['no siman', 'didnt know', 'did not know', 'they argue', 'machlokes'],
    'In English, where is the machlokes, and why?',
  ),
  sentence(
    'peiros',
    'תָּא שְׁמַע: פֵּירוֹת מְפוּזָּרִין... הָכָא בְּמַכְנַשְׁתָּא דְּבֵי דָרֵי עָסְקִינַן, דַּאֲבֵידָה מִדַּעַת הִיא.',
    'Scattered fruit is not a raayah for Rava. It is leftover grain on the threshing floor — a loss the owner knew about.',
    ['not a raayah', 'scattered fruit', 'midaas', 'threshing floor', 'he knew'],
    'In English, why is this not a raayah for Rava?',
  ),
  sentence(
    'coins',
    'תָּא שְׁמַע: מָעוֹת מְפוּזָּרוֹת – הֲרֵי אֵלּוּ שֶׁלּוֹ... אָדָם עָשׂוּי לְמַשְׁמֵשׁ בְּכִיסוֹ בְּכׇל שָׁעָה.',
    'Scattered coins belong to the finder, but that is not a raayah for Rava. A person keeps feeling his pocket, so he knows they fell.',
    ['scattered coins', 'pocket', 'he knows', 'not a raayah'],
    'In English, why is this not a raayah for Rava?',
  ),
  sentence(
    'figs-loaves',
    'עִיגּוּלֵי דְבֵילָה וְכִכָּרוֹת שֶׁל נַחְתּוֹם – הֲרֵי אֵלּוּ שֶׁלּוֹ... אַגַּב דְּיַקִּירֵי מִידָּע יָדַע בְּהוּ.',
    'Fig cakes and a baker’s loaves belong to the finder because they are heavy, so he knows when they fall. Not ye’ush without knowledge.',
    ['heavy', 'figs', 'loaves', 'he knows', 'not shelo'],
    'In English, why is this not a raayah for Rava?',
  ),
  sentence(
    'argaman',
    'לְשׁוֹנוֹת שֶׁל אַרְגָּמָן – הֲרֵי אֵלּוּ שֶׁלּוֹ... אַגַּב דַּחֲשִׁיבִי מַשְׁמוּשֵׁי מְמַשְׁמֵשׁ בְּהוּ.',
    'Strips of purple wool belong to the finder because they are important, so he feels around for them and knows they fell.',
    ['purple', 'important', 'feels', 'he knows'],
    'In English, why is this not a raayah for Rava?',
  ),
  sentence(
    'shuls',
    'הַמּוֹצֵא מָעוֹת בְּבָתֵּי כְנֵסִיּוֹת וּבְבָתֵּי מִדְרָשׁוֹת... הֲרֵי אֵלּוּ שֶׁלּוֹ, מִפְּנֵי שֶׁהַבְּעָלִים מִתְיָאֲשִׁין מֵהֶן.',
    'Coins in a shul or beis medrash belong to the finder because the owners give up hope on them — they know they lost them.',
    ['shul', 'give up hope', 'coins', 'owners', 'they know'],
    'In English, why is this not a raayah for Rava?',
  ),
  sentence(
    'leket',
    'מֵאֵימָתַי כׇּל אָדָם מוּתָּרִים בַּלֶּקֶט? מִשֶּׁיֵּלְכוּ בָּהּ הַנָּמוֹשׁוֹת.',
    'When is everyone mutar in the leket? After the last people through the field, the nemushot, have already gone.',
    ['leket', 'nemushot', 'mutar', 'last people'],
  ),
  sentence(
    'aniyim',
    'נְהִי דַּעֲנִיִּים דְּהָכָא מִיָּאֲשִׁי – אִיכָּא עֲנִיִּים בְּדוּכְתָּא אַחְרִיתָא דְּלָא מִיָּאֲשִׁי!',
    'The poor people here already gave up hope, but there are poor people somewhere else who did not. So why is the leket mutar?',
    ['aniyim', 'poor', 'give up hope', 'somewhere else', 'mutar'],
    'In English, what problem is the Gemara asking here?',
  ),
  sentence(
    'ketziot',
    'קְצִיעוֹת בַּדֶּרֶךְ... מוּתָּרוֹת מִשּׁוּם גָּזֵל... בְּזֵיתִים וּבְחָרוּבִים – אָסוּר.',
    'Dried figs on the road are mutar. Olives and carobs are assur.',
    ['dried figs', 'mutar', 'olives', 'assur', 'carobs'],
  ),
  sentence(
    'olives',
    'שָׁאנֵי זַיִת, הוֹאִיל וְחָזוּתוֹ מוֹכִיחַ עָלָיו.',
    'An olive is different: its look proves whose it is, so the owner does not give up hope.',
    ['olive', 'look proves', 'chazuto', 'does not give up'],
  ),
  sentence(
    'teena',
    'אָמַר רַב פָּפָּא: תְּאֵנָה עִם נְפִילָתָהּ נִמְאֶסֶת.',
    'Rav Pappa: a fig becomes repulsive when it falls, so the owner gives up hope on it.',
    ['fig', 'repulsive', 'pappa', 'gives up hope'],
  ),
  sentence(
    'kava',
    'הָהוּא גַּבְרָא דְּנָפֵיל לֵיהּ כַּבָּא דְחִטֵּי לְגוֹ צִיבּוּרָא... מֵימָר אָמַר: סִימָנָא לֵית לִי בְּגַוֵּיהּ.',
    'Rava’s mashal: a man whose kav of wheat fell into a pile will say he has no siman in it, and he gives up hope.',
    ['kav', 'wheat', 'pile', 'no siman', 'give up hope', 'rava', 'mashal'],
    'In English, what mashal is Rava giving, and what does it prove?',
  ),
]

const QUESTIONS: PackItem[] = [
  question(
    'abaye',
    'אַבָּיֵי',
    'In English: what does Abaye hold by ye’ush without knowledge?',
    'It is not ye’ush. The owner never actually gave up hope, because he does not even know he lost it.',
    ['not yeush', 'lo havei', 'never', 'gave up hope', 'does not know', 'didnt know'],
  ),
  question(
    'rava',
    'רָבָא',
    'In English: what does Rava hold by ye’ush without knowledge?',
    'It is ye’ush — at least when there is no siman — because when the owner finds out, he will give up hope.',
    ['is yeush', 'havei yeush', 'give up hope', 'no siman', 'finds out'],
  ),
  question(
    'siman-machlokes',
    'דָּבָר שֶׁיֵּשׁ בּוֹ סִימָן',
    'Do Abaye and Rava argue about an item that has a siman?',
    'No. Everyone agrees it is not ye’ush. The diyuk is that they only argue when there is no siman.',
    ['no', 'everyone agrees', 'not yeush', 'no siman', 'diyuk'],
  ),
  question(
    'ata-lideih',
    'אֲתָא לִידֵיהּ בְּאִיסּוּרָא',
    'If the owner later gives up hope on something that has a siman, why still can’t the finder keep it?',
    'It already came to the finder in issur. Once it reached him while still forbidden, later ye’ush does not help.',
    ['issur', 'came to', 'already', 'assur', 'later', 'does not help'],
  ),
  question(
    'where',
    'דָּבָר שֶׁאֵין בּוֹ סִימָן',
    'Where is the actual machlokes of Abaye and Rava?',
    'Only by something with no siman, when the owner does not yet know that it fell.',
    ['no siman', 'doesnt know', 'didnt know', 'does not know'],
  ),
  question(
    'rava-reason',
    'סִימָנָא לֵית לִי בְּגַוֵּיהּ',
    'In English: why does Rava say it is already ye’ush when there is no siman?',
    'When the owner finds out, he will say he has no siman in it, so he will give up hope. Rava counts that future ye’ush now.',
    ['no siman', 'give up hope', 'finds out', 'future'],
  ),
  question(
    'kava',
    'כַּבָּא דְחִטֵּי',
    'What mashal does Rava give for why a person gives up hope on something with no siman?',
    'A kav of wheat that fell into a pile. He cannot pick out his own, so he says he has no siman and gives up hope.',
    ['kav', 'wheat', 'pile', 'no siman', 'give up hope', 'mashal'],
  ),
  question(
    'ta-shema-goal',
    'תָּא שְׁמַע',
    'Each mishna that says the finder may keep the object looks like a raayah for Rava. What is the Gemara doing with those proofs?',
    'It is trying them as raayos for Rava, then rejecting each one: in those cases the owner already knew, so it is not ye’ush without knowledge.',
    ['raayah', 'rejecting', 'already knew', 'not shelo', 'midaas'],
  ),
  question(
    'peiros',
    'פֵּירוֹת מְפוּזָּרִין',
    'Why isn’t scattered fruit a raayah for Rava?',
    'It is leftover grain on the threshing floor — a loss he knew about, not ye’ush without knowledge.',
    ['midaas', 'threshing floor', 'knew', 'not shelo', 'not a raayah'],
  ),
  question(
    'maknishata',
    'מַכְנַשְׁתָּא דְּבֵי דָרֵי',
    'What is leftover grain on the threshing floor, and why isn’t it a raayah for Rava?',
    'The owner knew he was leaving it. That is a loss with knowledge, not ye’ush without knowledge.',
    ['threshing floor', 'leftover', 'grain', 'midaas', 'knew'],
  ),
  question(
    'pocket',
    'מָעוֹת מְפוּזָּרוֹת',
    'Why are scattered coins the finder’s, and why is that still not a raayah for Rava?',
    'A person is used to feeling his pocket, so he knows they fell. It is not ye’ush without knowledge.',
    ['pocket', 'knows', 'not shelo', 'not a raayah'],
  ),
  question(
    'heavy',
    'אַגַּב דְּיַקִּירֵי',
    'Why may the finder keep fig cakes and baker’s loaves, and why is that not a raayah for Rava?',
    'They are heavy, so the owner knows when they fall. Not ye’ush without knowledge.',
    ['heavy', 'knows', 'not shelo', 'not a raayah'],
  ),
  question(
    'argaman',
    'אַגַּב דַּחֲשִׁיבִי',
    'Why may the finder keep strips of purple wool, and why is that not a raayah for Rava?',
    'They are important, so he feels around for them and knows they fell. Not ye’ush without knowledge.',
    ['important', 'feels', 'knows', 'not shelo'],
  ),
  question(
    'shul-coins',
    'מָעוֹת בְּבָתֵּי כְנֵסִיּוֹת',
    'Why may the finder keep coins left in a shul or beis medrash? Is that a raayah for Rava?',
    'No. The owners give up hope because they know they lost them there. It is ordinary ye’ush, not without knowledge.',
    ['no', 'give up hope', 'they know', 'shul', 'not a raayah'],
  ),
  question(
    'sea',
    'זוּטוֹ שֶׁל יָם',
    'If something is lost in the wash of the sea or the overflow of a river, may you keep it — even with a siman?',
    'Yes. The Torah itself is matir it. This is not a stam ye’ush case, so it is not a raayah for Rava.',
    ['yes', 'matir', 'permits', 'torah', 'not a raayah', 'stam'],
  ),
  question(
    'harei',
    'הֲרֵי אֵלּוּ שֶׁלּוֹ',
    'In English: what does it mean that these belong to the finder?',
    'The finder may keep them. He does not have to announce them.',
    ['finder', 'keep', 'announce', 'shelo'],
  ),
  question(
    'nemushot',
    'נָמוֹשׁוֹת',
    'Who are the nemushot according to Rabbi Yochanan, and according to Reish Lakish?',
    'Rabbi Yochanan: old people walking with a cane. Reish Lakish: people who do leket after the leket.',
    ['old', 'cane', 'leket', 'yochanan', 'reish lakish'],
  ),
  question(
    'aniyim',
    'עֲנִיִּים בְּדוּכְתָּא אַחְרִיתָא',
    'After the nemushot, why is the leket mutar even though poor people somewhere else did not know?',
    'The poor people here already gave up hope, and the ones elsewhere assumed the local poor would take it.',
    ['gave up hope', 'local', 'assumed', 'mutar', 'somewhere else'],
  ),
  question(
    'olives',
    'חָזוּתוֹ מוֹכִיחַ עָלָיו',
    'Why are olives under the tree assur, but a fallen fig mutar?',
    'An olive’s look proves whose it is, so the owner does not give up. A fig becomes repulsive when it falls, so he does.',
    ['look proves', 'fig', 'repulsive', 'olive', 'assur', 'mutar'],
  ),
]

export function buildDafPack(pageId: string): Card[] {
  if (pageId !== 'bava-metzia-21b') {
    return []
  }
  return [...WORDS, ...SENTENCES, ...QUESTIONS].map(cardFromItem)
}

export function mergeDafPack(existing: Card[], pack: Card[]): Card[] {
  const previous = new Map(existing.map((card) => [card.id, card]))
  return pack.map((card) => {
    const old = previous.get(card.id)
    if (!old) {
      return card
    }
    return {
      ...card,
      weight: old.weight,
      consecutiveCorrect: old.consecutiveCorrect,
    }
  })
}

export function refreshLoadedDeck(existing: Card[]): Card[] {
  const pack = buildDafPack('bava-metzia-21b')
  const packById = new Map(pack.map((card) => [card.id, card]))
  const kept = existing
    .filter((card) => !card.id.startsWith('bm21b-') || packById.has(card.id))
    .map((card) => {
      const fresh = packById.get(card.id)
      if (!fresh) {
        return card
      }
      return {
        ...fresh,
        weight: card.weight,
        consecutiveCorrect: card.consecutiveCorrect,
      }
    })
  const keptIds = new Set(kept.map((card) => card.id))
  return [...kept, ...pack.filter((card) => !keptIds.has(card.id))]
}
