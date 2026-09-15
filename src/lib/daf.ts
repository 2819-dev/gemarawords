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
    prompt: `What does ${hebrew} mean?`,
    keywords,
  }
}

function sentence(
  id: string,
  hebrew: string,
  translation: string,
  keywords: string[],
): PackItem {
  return {
    id: `bm21b-s-${id}`,
    kind: 'sentence',
    hebrew,
    translation,
    prompt: 'What is the Gemara saying here?',
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
    'Giving up hope without knowledge',
    ['giving up hope', 'without knowledge', 'shelo midaas', 'didnt know'],
  ),
  word('abaye', 'אַבָּיֵי', 'the Amora who says לָא הָוֵי יֵאוּשׁ', [
    'abaye',
    'lo havei',
    'not yeush',
  ]),
  word('rava', 'רָבָא', 'the Amora who says הָוֵי יֵאוּשׁ', [
    'rava',
    'havei yeush',
    'is yeush',
  ]),
  word('lo-havei', 'לָא הָוֵי יֵאוּשׁ', "It's not יֵאוּשׁ", [
    'not yeush',
    'not giving up hope',
    'lo havei',
  ]),
  word('havei-yeush', 'הָוֵי יֵאוּשׁ', 'It is יֵאוּשׁ', [
    'is yeush',
    'it is',
    'havei yeush',
  ]),
  word('havei-verb', 'הָוֵי', 'it is', ['is', 'was', 'it is', 'havei']),
  word('ait', 'אִית', 'there is', ['there is', 'there are']),
  word('leit', 'לֵית', 'there is not', ['there is not', "there isn't"]),
  word('nami', 'נָמֵי', 'also', ['also', 'too']),
  word('hacha', 'הָכָא', 'here', ['here']),
  word('hatam', 'הָתָם', 'there', ['there']),
  word('amai', 'אַמַּאי', 'why', ['why']),
  word('meimar', 'מֵימָר אָמַר', 'he would say', ['would say', 'he says']),
  word('ata-lideih', 'אֲתָא לִידֵיהּ', 'it came into his hand', [
    'came into his hand',
    'came to his hand',
  ]),
  word('issura', 'בְּאִיסּוּרָא', 'in issur — while it was still אסור', [
    'issur',
    'forbidden',
    'assur',
  ]),
  word(
    'simana-leit',
    'סִימָנָא לֵית לִי בְּגַוֵּיהּ',
    'I have no סִימָן in it',
    ['no siman', 'no mark'],
  ),
  word('siman', 'סִימָן', 'a mark to identify it', ['siman', 'mark', 'sign']),
  word(
    'yes-siman',
    'דָּבָר שֶׁיֵּשׁ בּוֹ סִימָן',
    'something that has a סִימָן',
    ['has a siman', 'has a mark'],
  ),
  word(
    'no-siman',
    'דָּבָר שֶׁאֵין בּוֹ סִימָן',
    'something that has no סִימָן',
    ['no siman', 'no mark'],
  ),
  word(
    'kuli-alma-short',
    'כּוּלֵּי עָלְמָא',
    'everyone — the whole world',
    ['everyone', 'kuli alma', 'whole world'],
  ),
  word(
    'kuli-alma',
    'כּוּלֵּי עָלְמָא לָא פְּלִיגִי',
    'everyone agrees — no מחלוקת',
    ['everyone agrees', 'no machlokes', 'kuli alma'],
  ),
  word('zuto', 'זוּטוֹ שֶׁל יָם', 'the tide of the sea', ['tide', 'sea']),
  word('river', 'שְׁלוּלִיתוֹ שֶׁל נָהָר', 'the overflow of a river', [
    'overflow',
    'river',
    'flood',
  ]),
  word('rachmana', 'רַחֲמָנָא שַׁרְיֵיהּ', 'the Torah is מתיר it', [
    'matir',
    'permits',
    'mutar',
    'rachmana',
  ]),
  word('ta-shema', 'תָּא שְׁמַע', 'come and hear', ['come and hear', 'come hear']),
  word('peiros', 'פֵּירוֹת מְפוּזָּרִין', 'scattered fruit', [
    'scattered fruit',
    'scattered produce',
  ]),
  word(
    'aveidah-midaas',
    'אֲבֵידָה מִדַּעַת',
    'an אֲבֵידָה with knowledge',
    ['with knowledge', 'he knew', 'midaas'],
  ),
  word('maos', 'מָעוֹת מְפוּזָּרוֹת', 'scattered coins', ['scattered coins']),
  word(
    'pocket',
    'אָדָם עָשׂוּי לְמַשְׁמֵשׁ בְּכִיסוֹ',
    'a person is used to feeling his pocket',
    ['feeling his pocket', 'checks his pocket', 'pocket'],
  ),
  word('deveilah', 'עִיגּוּלֵי דְבֵילָה', 'rounds of dried figs', [
    'dried figs',
    'fig cakes',
  ]),
  word('loaves', 'כִּכָּרוֹת שֶׁל נַחְתּוֹם', "a baker's loaves", [
    'baker',
    'loaves',
  ]),
  word('argaman', 'לְשׁוֹנוֹת שֶׁל אַרְגָּמָן', 'strips of purple wool', [
    'purple wool',
    'argaman',
  ]),
  word(
    'shuls',
    'בָּתֵּי כְנֵסִיּוֹת וּבָתֵּי מִדְרָשׁוֹת',
    'shuls and בָּתֵּי מִדְרָשׁ',
    ['shuls', 'batei midrash', 'shul'],
  ),
  word('leket', 'לֶקֶט', 'leftover stalks left for an עני', [
    'leket',
    'gleanings',
    'ani',
  ]),
  word(
    'nemushot',
    'נָמוֹשׁוֹת',
    'the last ones through the field',
    ['last ones', 'elderly', 'leket after leket', 'nemushot'],
  ),
  word('ketziot', 'קְצִיעוֹת', 'dried figs', ['dried figs']),
  word(
    'chazuto',
    'חָזוּתוֹ מוֹכִיחַ עָלָיו',
    'its look proves whose it is',
    ['look proves', 'proves whose', 'identifies'],
  ),
  word(
    'teena',
    'תְּאֵנָה עִם נְפִילָתָהּ נִמְאֶסֶת',
    'a fig becomes repulsive when it falls',
    ['fig', 'repulsive', 'falls'],
  ),
  word('af-al-gav', 'אַף עַל גַּב', 'even though', ['even though', 'even if', 'af al gav']),
  word('ki-pligi', 'כִּי פְּלִיגִי', 'they argue — this is the מחלוקת', [
    'they argue',
    'machlokes',
    'pligi',
  ]),
  word('pligi', 'פְּלִיגִי', 'they argue', ['argue', 'machlokes', 'pligi']),
  word('askinan', 'עָסְקִינַן', 'we are dealing with', ['dealing with', 'askinan']),
  word(
    'maknishata',
    'מַכְנַשְׁתָּא דְּבֵי דָרֵי',
    'leftover kernels on the goren',
    ['leftover', 'goren', 'threshing', 'kernels'],
  ),
  word(
    'harei-shelo',
    'הֲרֵי אֵלּוּ שֶׁלּוֹ',
    'these belong to the finder',
    ['belong to the finder', 'his', 'shelo'],
  ),
  word('mida-yada', 'מִידָּע יָדַע', 'he definitely knows', [
    'he knows',
    'definitely knows',
    'mida yada',
  ]),
  word('yakirei', 'אַגַּב דְּיַקִּירֵי', 'because they are heavy', [
    'heavy',
    'yakirei',
  ]),
  word('chashivei', 'אַגַּב דַּחֲשִׁיבִי', 'because they are important', [
    'important',
    'chashivei',
  ]),
  word(
    'kava',
    'כַּבָּא דְחִטֵּי',
    'a kav of wheat',
    ['kav', 'wheat', 'kava'],
  ),
  word('ika', 'אִיכָּא', 'there is', ['there is', 'there are', 'ika']),
  word('shani', 'שָׁאנֵי', "it's different", ['different', 'shani']),
  word('nehi', 'נְהִי', 'granted — even so', ['granted', 'even so', 'nehi']),
  word('mityaashin', 'מִתְיָאֲשִׁין', 'they give up hope', [
    'give up hope',
    'mityaashin',
  ]),
  word(
    'lo-yada-nafal',
    'לָא יָדַע דִּנְפַל מִינֵּיהּ',
    "he didn't know it fell from him",
    ['didnt know', 'fell', 'lo yada'],
  ),
  word('agav', 'אַגַּב', 'because of / on account of', ['because', 'agav', 'on account']),
]

const SENTENCES: PackItem[] = [
  sentence(
    'machlokes',
    'יֵאוּשׁ שֶׁלֹּא מִדַּעַת, אַבָּיֵי אָמַר: לָא הָוֵי יֵאוּשׁ. וְרָבָא אָמַר: הָוֵי יֵאוּשׁ.',
    'By יֵאוּשׁ שֶׁלֹּא מִדַּעַת: אַבָּיֵי says לָא הָוֵי יֵאוּשׁ, רָבָא says הָוֵי יֵאוּשׁ.',
    ['abaye', 'rava', 'not yeush', 'is yeush', 'without knowledge'],
  ),
  sentence(
    'yes-siman',
    'בְּדָבָר שֶׁיֵּשׁ בּוֹ סִימָן – כּוּלֵּי עָלְמָא לָא פְּלִיגִי דְּלָא הָוֵי יֵאוּשׁ.',
    'By a דָּבָר שֶׁיֵּשׁ בּוֹ סִימָן, everyone agrees it is not יֵאוּשׁ.',
    ['has a siman', 'everyone agrees', 'not yeush'],
  ),
  sentence(
    'sea',
    'בְּזוּטוֹ שֶׁל יָם וּבִשְׁלוּלִיתוֹ שֶׁל נָהָר, אַף עַל גַּב דְּאִית בֵּיהּ סִימָן, רַחֲמָנָא שַׁרְיֵיהּ.',
    'By זוּטוֹ שֶׁל יָם and שְׁלוּלִיתוֹ שֶׁל נָהָר, even if it has a סִימָן, רַחֲמָנָא שַׁרְיֵיהּ.',
    ['sea', 'river', 'siman', 'matir', 'permits'],
  ),
  sentence(
    'no-siman',
    'כִּי פְּלִיגִי בְּדָבָר שֶׁאֵין בּוֹ סִימָן. אַבָּיֵי אָמַר: לָא הָוֵי יֵאוּשׁ, דְּהָא לָא יָדַע דִּנְפַל מִינֵּיהּ. רָבָא אָמַר: הָוֵי יֵאוּשׁ.',
    'The מחלוקת is by a דָּבָר שֶׁאֵין בּוֹ סִימָן. אַבָּיֵי: he didn’t know it fell. רָבָא: it is יֵאוּשׁ.',
    ['no siman', 'didnt know', 'machlokes'],
  ),
  sentence(
    'peiros',
    'תָּא שְׁמַע: פֵּירוֹת מְפוּזָּרִין... הָכָא בְּמַכְנַשְׁתָּא דְּבֵי דָרֵי עָסְקִינַן, דַּאֲבֵידָה מִדַּעַת הִיא.',
    'תָּא שְׁמַע from פֵּירוֹת מְפוּזָּרִין — not a ראיה for רָבָא. It’s leftover on the goren, an אֲבֵידָה מִדַּעַת.',
    ['ta shema', 'scattered fruit', 'midaas', 'goren'],
  ),
  sentence(
    'coins',
    'תָּא שְׁמַע: מָעוֹת מְפוּזָּרוֹת – הֲרֵי אֵלּוּ שֶׁלּוֹ... אָדָם עָשׂוּי לְמַשְׁמֵשׁ בְּכִיסוֹ בְּכׇל שָׁעָה.',
    'מָעוֹת מְפוּזָּרוֹת are שלו of the finder. A person is used to feeling his pocket, so he knows they fell — not שֶׁלֹּא מִדַּעַת.',
    ['scattered coins', 'pocket', 'not shelo'],
  ),
  sentence(
    'figs-loaves',
    'עִיגּוּלֵי דְבֵילָה וְכִכָּרוֹת שֶׁל נַחְתּוֹם – הֲרֵי אֵלּוּ שֶׁלּוֹ... אַגַּב דְּיַקִּירֵי מִידָּע יָדַע בְּהוּ.',
    'Rounds of dried figs and a baker’s loaves are שלו — they’re heavy, so he knows when they fall.',
    ['heavy', 'figs', 'loaves', 'he knows'],
  ),
  sentence(
    'argaman',
    'לְשׁוֹנוֹת שֶׁל אַרְגָּמָן – הֲרֵי אֵלּוּ שֶׁלּוֹ... אַגַּב דַּחֲשִׁיבִי מַשְׁמוּשֵׁי מְמַשְׁמֵשׁ בְּהוּ.',
    'Strips of purple wool are שלו — they’re important, so he feels around for them.',
    ['purple', 'important', 'feels'],
  ),
  sentence(
    'shuls',
    'הַמּוֹצֵא מָעוֹת בְּבָתֵּי כְנֵסִיּוֹת וּבְבָתֵּי מִדְרָשׁוֹת... הֲרֵי אֵלּוּ שֶׁלּוֹ, מִפְּנֵי שֶׁהַבְּעָלִים מִתְיָאֲשִׁין מֵהֶן.',
    'Coins in a shul or בית מדרש are שלו, because the owners give up hope on them.',
    ['shul', 'give up hope', 'coins'],
  ),
  sentence(
    'leket',
    'מֵאֵימָתַי כׇּל אָדָם מוּתָּרִים בַּלֶּקֶט? מִשֶּׁיֵּלְכוּ בָּהּ הַנָּמוֹשׁוֹת.',
    'When is everyone מותר in the לֶקֶט? After the נָמוֹשׁוֹת have gone through the field.',
    ['leket', 'nemushot', 'mutar'],
  ),
  sentence(
    'aniyim',
    'נְהִי דַּעֲנִיִּים דְּהָכָא מִיָּאֲשִׁי – אִיכָּא עֲנִיִּים בְּדוּכְתָּא אַחְרִיתָא דְּלָא מִיָּאֲשִׁי!',
    'The עניים here already gave up hope, but there are עניים somewhere else who didn’t — so why is it מותר?',
    ['aniyim', 'give up hope', 'mutar'],
  ),
  sentence(
    'ketziot',
    'קְצִיעוֹת בַּדֶּרֶךְ... מוּתָּרוֹת מִשּׁוּם גָּזֵל... בְּזֵיתִים וּבְחָרוּבִים – אָסוּר.',
    'Dried figs on the road are מותר. Olives and carobs are אסור.',
    ['dried figs', 'mutar', 'olives', 'assur'],
  ),
  sentence(
    'olives',
    'שָׁאנֵי זַיִת, הוֹאִיל וְחָזוּתוֹ מוֹכִיחַ עָלָיו.',
    'A זית is different: חָזוּתוֹ מוֹכִיחַ עָלָיו.',
    ['olive', 'look proves', 'chazuto'],
  ),
  sentence(
    'teena',
    'אָמַר רַב פָּפָּא: תְּאֵנָה עִם נְפִילָתָהּ נִמְאֶסֶת.',
    'רב פפא: a fig becomes repulsive when it falls.',
    ['fig', 'repulsive', 'pappa'],
  ),
  sentence(
    'kava',
    'הָהוּא גַּבְרָא דְּנָפֵיל לֵיהּ כַּבָּא דְחִטֵּי לְגוֹ צִיבּוּרָא... מֵימָר אָמַר: סִימָנָא לֵית לִי בְּגַוֵּיהּ.',
    'A man whose kav of wheat fell into a pile: he’ll say סִימָנָא לֵית לִי בְּגַוֵּיהּ and give up hope. That’s רָבָא’s mashal.',
    ['kav', 'wheat', 'no siman', 'give up hope', 'rava'],
  ),
]

const QUESTIONS: PackItem[] = [
  question(
    'abaye',
    'אַבָּיֵי',
    'What does אַבָּיֵי hold by יֵאוּשׁ שֶׁלֹּא מִדַּעַת?',
    'לָא הָוֵי יֵאוּשׁ — he never actually gave up hope',
    ['lo havei', 'not yeush', 'never', 'gave up hope'],
  ),
  question(
    'rava',
    'רָבָא',
    'What does רָבָא hold by יֵאוּשׁ שֶׁלֹּא מִדַּעַת?',
    'הָוֵי יֵאוּשׁ — at least by a דָּבָר שֶׁאֵין בּוֹ סִימָן, because when he finds out he will give up hope',
    ['havei yeush', 'is yeush', 'give up hope', 'no siman'],
  ),
  question(
    'siman-machlokes',
    'דָּבָר שֶׁיֵּשׁ בּוֹ סִימָן',
    'Is there a מחלוקת by a דָּבָר שֶׁיֵּשׁ בּוֹ סִימָן?',
    'No. כּוּלֵּי עָלְמָא לָא פְּלִיגִי that it is not יֵאוּשׁ. Even if he later gives up hope, it already אֲתָא לִידֵיהּ בְּאִיסּוּרָא.',
    ['no', 'everyone agrees', 'not yeush', 'issur'],
  ),
  question(
    'ata-lideih',
    'אֲתָא לִידֵיהּ בְּאִיסּוּרָא',
    'By a דָּבָר שֶׁיֵּשׁ בּוֹ סִימָן, why isn’t it יֵאוּשׁ even if he later gives up hope?',
    'It already אֲתָא לִידֵיהּ בְּאִיסּוּרָא — it came to the finder while it was still אסור.',
    ['issur', 'came to', 'already', 'assur'],
  ),
  question(
    'sea',
    'זוּטוֹ שֶׁל יָם',
    'If something is lost in זוּטוֹ שֶׁל יָם or שְׁלוּלִיתוֹ שֶׁל נָהָר, may you keep it?',
    'Yes. Even if it has a סִימָן, רַחֲמָנָא שַׁרְיֵיהּ.',
    ['yes', 'matir', 'permits', 'keep', 'siman'],
  ),
  question(
    'where',
    'דָּבָר שֶׁאֵין בּוֹ סִימָן',
    'Where is the מחלוקת of אַבָּיֵי and רָבָא?',
    'Only by a דָּבָר שֶׁאֵין בּוֹ סִימָן, when the owner doesn’t know yet that it fell.',
    ['no siman', 'doesnt know', 'didnt know'],
  ),
  question(
    'rava-reason',
    'סִימָנָא לֵית לִי בְּגַוֵּיהּ',
    'Why does רָבָא say it is already יֵאוּשׁ by a דָּבָר שֶׁאֵין בּוֹ סִימָן?',
    'When he finds out, he will say סִימָנָא לֵית לִי בְּגַוֵּיהּ and give up hope.',
    ['no siman', 'give up hope', 'finds out'],
  ),
  question(
    'peiros',
    'פֵּירוֹת מְפוּזָּרִין',
    'Why isn’t פֵּירוֹת מְפוּזָּרִין a ראיה for רָבָא?',
    'It’s leftover on the goren — an אֲבֵידָה מִדַּעַת, not יֵאוּשׁ שֶׁלֹּא מִדַּעַת.',
    ['midaas', 'goren', 'knew', 'not shelo'],
  ),
  question(
    'pocket',
    'מָעוֹת מְפוּזָּרוֹת',
    'Why are מָעוֹת מְפוּזָּרוֹת שלו of the finder?',
    'אָדָם עָשׂוּי לְמַשְׁמֵשׁ בְּכִיסוֹ — he knows they fell, so it is not שֶׁלֹּא מִדַּעַת.',
    ['pocket', 'knows', 'not shelo'],
  ),
  question(
    'nemushot',
    'נָמוֹשׁוֹת',
    'What are נָמוֹשׁוֹת according to רבי יוחנן, and according to ריש לקיש?',
    'רבי יוחנן: old people walking with a cane. ריש לקיש: people who do לֶקֶט after the לֶקֶט.',
    ['old', 'cane', 'leket', 'yochanan', 'reish lakish'],
  ),
  question(
    'olives',
    'חָזוּתוֹ מוֹכִיחַ עָלָיו',
    'Why are olives under the tree אסור, but a fallen תאנה מותר?',
    'By olives, חָזוּתוֹ מוֹכִיחַ עָלָיו. A תאנה עִם נְפִילָתָהּ נִמְאֶסֶת.',
    ['chazuto', 'look proves', 'fig', 'repulsive'],
  ),
  question(
    'harei',
    'הֲרֵי אֵלּוּ שֶׁלּוֹ',
    'What does הֲרֵי אֵלּוּ שֶׁלּוֹ mean?',
    'These belong to the finder — he may keep them.',
    ['finder', 'keep', 'his', 'shelo'],
  ),
  question(
    'maknishata',
    'מַכְנַשְׁתָּא דְּבֵי דָרֵי',
    'What is מַכְנַשְׁתָּא דְּבֵי דָרֵי, and why isn’t it a ראיה for רָבָא?',
    'Leftover kernels on the goren. That’s an אֲבֵידָה מִדַּעַת — he knew he was leaving them.',
    ['goren', 'leftover', 'midaas', 'knew'],
  ),
  question(
    'heavy',
    'אַגַּב דְּיַקִּירֵי',
    'Why are עִיגּוּלֵי דְבֵילָה and כִּכָּרוֹת שֶׁל נַחְתּוֹם שלו of the finder?',
    'אַגַּב דְּיַקִּירֵי — they’re heavy, so מִידָּע יָדַע when they fall. It’s not שֶׁלֹּא מִדַּעַת.',
    ['heavy', 'knows', 'not shelo'],
  ),
  question(
    'argaman',
    'אַגַּב דַּחֲשִׁיבִי',
    'Why are לְשׁוֹנוֹת שֶׁל אַרְגָּמָן שלו of the finder?',
    'אַגַּב דַּחֲשִׁיבִי — they’re important, so he feels around for them. He knows they fell.',
    ['important', 'feels', 'knows'],
  ),
  question(
    'kava',
    'כַּבָּא דְחִטֵּי',
    'What mashal does רָבָא give for why a person gives up hope on a דָּבָר שֶׁאֵין בּוֹ סִימָן?',
    'A kav of wheat that fell into a pile. He can’t pick out his own, so he says סִימָנָא לֵית לִי בְּגַוֵּיהּ and gives up hope.',
    ['kav', 'wheat', 'pile', 'no siman', 'give up hope'],
  ),
  question(
    'af-al-gav',
    'אַף עַל גַּב',
    'What does אַף עַל גַּב mean?',
    'Even though.',
    ['even though', 'even if'],
  ),
  question(
    'aniyim',
    'עֲנִיִּים בְּדוּכְתָּא אַחְרִיתָא',
    'After the נָמוֹשׁוֹת, why is the לֶקֶט מותר even though עניים somewhere else didn’t know?',
    'The עניים here already gave up hope, and the ones elsewhere assumed the local עניים would take it.',
    ['gave up hope', 'local', 'assumed', 'mutar'],
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
