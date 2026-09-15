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
}

function cardFromItem(item: PackItem): Card {
  return {
    ...item,
    weight: 1,
    consecutiveCorrect: 0,
    source: 'sefaria' as TranslationSource,
  }
}

const WORDS: PackItem[] = [
  {
    id: 'bm21b-w-yeush',
    kind: 'word',
    hebrew: 'יֵאוּשׁ',
    translation: 'Despair of recovering a lost object — the owner gives up hope of getting it back.',
  },
  {
    id: 'bm21b-w-yeush-shelo',
    kind: 'word',
    hebrew: 'יֵאוּשׁ שֶׁלֹּא מִדַּעַת',
    translation:
      'Unconscious despair: the owner does not yet know he lost it, but would despair if he knew.',
  },
  {
    id: 'bm21b-w-abaye',
    kind: 'word',
    hebrew: 'אַבָּיֵי',
    translation: 'Abaye, an Amora. Here he says ye’ush shelo mida’as is not ye’ush.',
  },
  {
    id: 'bm21b-w-rava',
    kind: 'word',
    hebrew: 'רָבָא',
    translation: 'Rava, an Amora. Here he says ye’ush shelo mida’as is ye’ush.',
  },
  {
    id: 'bm21b-w-lo-havei',
    kind: 'word',
    hebrew: 'לָא הָוֵי יֵאוּשׁ',
    translation: 'It is not (valid) despair. The owner still owns it; the finder may not keep it.',
  },
  {
    id: 'bm21b-w-havei',
    kind: 'word',
    hebrew: 'הָוֵי יֵאוּשׁ',
    translation: 'It is (valid) despair. The finder may keep it.',
  },
  {
    id: 'bm21b-w-havei-verb',
    kind: 'word',
    hebrew: 'הָוֵי',
    translation: 'Aramaic: is / was / would be. From הוי, to be.',
  },
  {
    id: 'bm21b-w-ait',
    kind: 'word',
    hebrew: 'אִית',
    translation: 'Aramaic: there is / there are.',
  },
  {
    id: 'bm21b-w-leit',
    kind: 'word',
    hebrew: 'לֵית',
    translation: 'Aramaic: there is not. From לא אית.',
  },
  {
    id: 'bm21b-w-ta',
    kind: 'word',
    hebrew: 'תָּא',
    translation: 'Aramaic: come! Imperative of אתא, to come.',
  },
  {
    id: 'bm21b-w-alma',
    kind: 'word',
    hebrew: 'עָלְמָא',
    translation: 'Aramaic: the world. כולי עלמא = everyone.',
  },
  {
    id: 'bm21b-w-nami',
    kind: 'word',
    hebrew: 'נָמֵי',
    translation: 'Aramaic: also / too.',
  },
  {
    id: 'bm21b-w-hacha',
    kind: 'word',
    hebrew: 'הָכָא',
    translation: 'Aramaic: here.',
  },
  {
    id: 'bm21b-w-hatam',
    kind: 'word',
    hebrew: 'הָתָם',
    translation: 'Aramaic: there.',
  },
  {
    id: 'bm21b-w-amai',
    kind: 'word',
    hebrew: 'אַמַּאי',
    translation: 'Aramaic: why?',
  },
  {
    id: 'bm21b-w-meimar',
    kind: 'word',
    hebrew: 'מֵימָר אָמַר',
    translation: 'Aramaic: he would say to himself.',
  },
  {
    id: 'bm21b-w-ata-lideih',
    kind: 'word',
    hebrew: 'אֲתָא לִידֵיהּ',
    translation: 'Aramaic: it came into his possession (into his hand).',
  },
  {
    id: 'bm21b-w-issura',
    kind: 'word',
    hebrew: 'בְּאִיסּוּרָא',
    translation: 'In a prohibited way — the finder already took it while it was still forbidden.',
  },
  {
    id: 'bm21b-w-simana-leit',
    kind: 'word',
    hebrew: 'סִימָנָא לֵית לִי בְּגַוֵּיהּ',
    translation: 'Aramaic: I have no distinguishing mark in it.',
  },
  {
    id: 'bm21b-w-siman',
    kind: 'word',
    hebrew: 'סִימָן',
    translation: 'A distinguishing mark the owner can use to identify and claim the object.',
  },
  {
    id: 'bm21b-w-yes-siman',
    kind: 'word',
    hebrew: 'דָּבָר שֶׁיֵּשׁ בּוֹ סִימָן',
    translation: 'An item that has a distinguishing mark.',
  },
  {
    id: 'bm21b-w-no-siman',
    kind: 'word',
    hebrew: 'דָּבָר שֶׁאֵין בּוֹ סִימָן',
    translation: 'An item with no distinguishing mark — this is where Abaye and Rava argue.',
  },
  {
    id: 'bm21b-w-kuli-alma',
    kind: 'word',
    hebrew: 'כּוּלֵּי עָלְמָא לָא פְּלִיגִי',
    translation: 'Everyone agrees. No dispute.',
  },
  {
    id: 'bm21b-w-zuto',
    kind: 'word',
    hebrew: 'זוּטוֹ שֶׁל יָם',
    translation: 'The tide of the sea. An item swept away there may be kept even with a siman.',
  },
  {
    id: 'bm21b-w-river',
    kind: 'word',
    hebrew: 'שְׁלוּלִיתוֹ שֶׁל נָהָר',
    translation: 'The flooding of a river. Same din as the tide of the sea.',
  },
  {
    id: 'bm21b-w-rachmana',
    kind: 'word',
    hebrew: 'רַחֲמָנָא שַׁרְיֵיהּ',
    translation: 'The Merciful One / the Torah permits it (the finder may keep it).',
  },
  {
    id: 'bm21b-w-ta-shema',
    kind: 'word',
    hebrew: 'תָּא שְׁמַע',
    translation: 'Come and hear — the Gemara brings a proof from a mishna or baraita.',
  },
  {
    id: 'bm21b-w-peiros',
    kind: 'word',
    hebrew: 'פֵּירוֹת מְפוּזָּרִין',
    translation: 'Scattered produce. The mishna says it belongs to the finder.',
  },
  {
    id: 'bm21b-w-aveidah-midaas',
    kind: 'word',
    hebrew: 'אֲבֵידָה מִדַּעַת',
    translation: 'A loss the owner knew about — he left it on purpose, so it is not ye’ush shelo mida’as.',
  },
  {
    id: 'bm21b-w-maos',
    kind: 'word',
    hebrew: 'מָעוֹת מְפוּזָּרוֹת',
    translation: 'Scattered coins.',
  },
  {
    id: 'bm21b-w-pocket',
    kind: 'word',
    hebrew: 'אָדָם עָשׂוּי לְמַשְׁמֵשׁ בְּכִיסוֹ',
    translation: 'A person tends to feel his money pouch all the time, so he notices quickly if coins fell.',
  },
  {
    id: 'bm21b-w-deveilah',
    kind: 'word',
    hebrew: 'עִיגּוּלֵי דְבֵילָה',
    translation: 'Round cakes of pressed figs.',
  },
  {
    id: 'bm21b-w-loaves',
    kind: 'word',
    hebrew: 'כִּכָּרוֹת שֶׁל נַחְתּוֹם',
    translation: 'Baker’s loaves. Heavy, so the owner notices when they fall.',
  },
  {
    id: 'bm21b-w-argaman',
    kind: 'word',
    hebrew: 'לְשׁוֹנוֹת שֶׁל אַרְגָּמָן',
    translation: 'Strips of purple wool — valuable, so the owner feels around for them.',
  },
  {
    id: 'bm21b-w-shuls',
    kind: 'word',
    hebrew: 'בָּתֵּי כְנֵסִיּוֹת וּבָתֵּי מִדְרָשׁוֹת',
    translation: 'Synagogues and study halls — public places where owners despair of lost coins.',
  },
  {
    id: 'bm21b-w-leket',
    kind: 'word',
    hebrew: 'לֶקֶט',
    translation: 'Gleanings left for the poor.',
  },
  {
    id: 'bm21b-w-nemushot',
    kind: 'word',
    hebrew: 'נָמוֹשׁוֹת',
    translation:
      'The last people through the field. R’ Yochanan: elderly walking on a cane. Reish Lakish: gleaners after gleaners.',
  },
  {
    id: 'bm21b-w-ketziot',
    kind: 'word',
    hebrew: 'קְצִיעוֹת',
    translation: 'Dried figs.',
  },
  {
    id: 'bm21b-w-chazuto',
    kind: 'word',
    hebrew: 'חָזוּתוֹ מוֹכִיחַ עָלָיו',
    translation: 'Its look identifies the owner — olives look like the ones still on that tree.',
  },
  {
    id: 'bm21b-w-teena',
    kind: 'word',
    hebrew: 'תְּאֵנָה עִם נְפִילָתָהּ נִמְאֶסֶת',
    translation: 'A fig becomes disgusting when it falls, so the owner does not want it back.',
  },
  {
    id: 'bm21b-w-ganav',
    kind: 'word',
    hebrew: 'גַּנָּב',
    translation: 'A thief who steals in secret.',
  },
  {
    id: 'bm21b-w-gazlan',
    kind: 'word',
    hebrew: 'גַּזְלָן',
    translation: 'A robber who takes openly.',
  },
]

const SENTENCES: PackItem[] = [
  {
    id: 'bm21b-s-0',
    kind: 'sentence',
    hebrew: 'יֵאוּשׁ שֶׁלֹּא מִדַּעַת, אַבָּיֵי אָמַר: לָא הָוֵי יֵאוּשׁ. וְרָבָא אָמַר: הָוֵי יֵאוּשׁ.',
    translation:
      'About ye’ush shelo mida’as: Abaye said it is not ye’ush. Rava said it is ye’ush.',
  },
  {
    id: 'bm21b-s-1',
    kind: 'sentence',
    hebrew:
      'בְּדָבָר שֶׁיֵּשׁ בּוֹ סִימָן – כּוּלֵּי עָלְמָא לָא פְּלִיגִי דְּלָא הָוֵי יֵאוּשׁ.',
    translation:
      'On an item that has a siman, everyone agrees it is not ye’ush — even if he later despairs, it already came to the finder in issur.',
  },
  {
    id: 'bm21b-s-2',
    kind: 'sentence',
    hebrew:
      'בְּזוּטוֹ שֶׁל יָם וּבִשְׁלוּלִיתוֹ שֶׁל נָהָר, אַף עַל גַּב דְּאִית בֵּיהּ סִימָן, רַחֲמָנָא שַׁרְיֵיהּ.',
    translation:
      'Swept away by the sea or a flooding river: even with a siman, the Torah lets the finder keep it.',
  },
  {
    id: 'bm21b-s-3',
    kind: 'sentence',
    hebrew:
      'כִּי פְּלִיגִי בְּדָבָר שֶׁאֵין בּוֹ סִימָן. אַבָּיֵי אָמַר: לָא הָוֵי יֵאוּשׁ, דְּהָא לָא יָדַע דִּנְפַל מִינֵּיהּ. רָבָא אָמַר: הָוֵי יֵאוּשׁ.',
    translation:
      'They argue about an item with no siman. Abaye: he did not know it fell. Rava: when he finds out, he will despair, since he has no siman.',
  },
  {
    id: 'bm21b-s-5',
    kind: 'sentence',
    hebrew:
      'תָּא שְׁמַע: פֵּירוֹת מְפוּזָּרִין... הָכָא בְּמַכְנַשְׁתָּא דְּבֵי דָרֵי עָסְקִינַן, דַּאֲבֵידָה מִדַּעַת הִיא.',
    translation:
      'Come and hear: scattered produce. Not a proof for Rava — it is leftover kernels on the threshing floor, an aveidah mida’as.',
  },
  {
    id: 'bm21b-s-6',
    kind: 'sentence',
    hebrew:
      'תָּא שְׁמַע: מָעוֹת מְפוּזָּרוֹת – הֲרֵי אֵלּוּ שֶׁלּוֹ... אָדָם עָשׂוּי לְמַשְׁמֵשׁ בְּכִיסוֹ בְּכׇל שָׁעָה.',
    translation:
      'Scattered coins belong to the finder. Not unconscious despair: a person keeps checking his pocket, so he knows they fell.',
  },
  {
    id: 'bm21b-s-7',
    kind: 'sentence',
    hebrew:
      'עִיגּוּלֵי דְבֵילָה וְכִכָּרוֹת שֶׁל נַחְתּוֹם – הֲרֵי אֵלּוּ שֶׁלּוֹ... אַגַּב דְּיַקִּירֵי מִידָּע יָדַע בְּהוּ.',
    translation:
      'Pressed-fig cakes and baker’s loaves belong to the finder because they are heavy — the owner notices when they drop.',
  },
  {
    id: 'bm21b-s-8',
    kind: 'sentence',
    hebrew:
      'לְשׁוֹנוֹת שֶׁל אַרְגָּמָן – הֲרֵי אֵלּוּ שֶׁלּוֹ... אַגַּב דַּחֲשִׁיבִי מַשְׁמוּשֵׁי מְמַשְׁמֵשׁ בְּהוּ.',
    translation:
      'Strips of purple wool belong to the finder because they are valuable, so the owner feels around for them.',
  },
  {
    id: 'bm21b-s-9',
    kind: 'sentence',
    hebrew:
      'הַמּוֹצֵא מָעוֹת בְּבָתֵּי כְנֵסִיּוֹת וּבְבָתֵּי מִדְרָשׁוֹת... הֲרֵי אֵלּוּ שֶׁלּוֹ, מִפְּנֵי שֶׁהַבְּעָלִים מִתְיָאֲשִׁין מֵהֶן.',
    translation:
      'Coins found in shuls, batei midrash, or any crowded place belong to the finder — owners despair of them (and people check their pockets).',
  },
  {
    id: 'bm21b-s-10',
    kind: 'sentence',
    hebrew:
      'מֵאֵימָתַי כׇּל אָדָם מוּתָּרִים בַּלֶּקֶט? מִשֶּׁיֵּלְכוּ בָּהּ הַנָּמוֹשׁוֹת.',
    translation:
      'When may anyone take leket? After the nemushot have gone through the field.',
  },
  {
    id: 'bm21b-s-11',
    kind: 'sentence',
    hebrew:
      'נְהִי דַּעֲנִיִּים דְּהָכָא מִיָּאֲשִׁי – אִיכָּא עֲנִיִּים בְּדוּכְתָּא אַחְרִיתָא דְּלָא מִיָּאֲשִׁי!',
    translation:
      'The poor here already despaired, but poor people elsewhere did not know — so why is it mutar? They assumed the local poor would take it.',
  },
  {
    id: 'bm21b-s-12',
    kind: 'sentence',
    hebrew:
      'קְצִיעוֹת בַּדֶּרֶךְ... מוּתָּרוֹת מִשּׁוּם גָּזֵל... בְּזֵיתִים וּבְחָרוּבִים – אָסוּר.',
    translation:
      'Dried figs on the road (and figs under a tree) are permitted. Olives and carobs are forbidden.',
  },
  {
    id: 'bm21b-s-14',
    kind: 'sentence',
    hebrew: 'שָׁאנֵי זַיִת, הוֹאִיל וְחָזוּתוֹ מוֹכִיחַ עָלָיו.',
    translation:
      'Olives are different: their look identifies the tree, so the owner still knows they are his.',
  },
  {
    id: 'bm21b-s-15',
    kind: 'sentence',
    hebrew: 'אָמַר רַב פָּפָּא: תְּאֵנָה עִם נְפִילָתָהּ נִמְאֶסֶת.',
    translation:
      'Rav Pappa: a fig becomes disgusting when it falls, so the owner does not want it.',
  },
]

const QUESTIONS: PackItem[] = [
  {
    id: 'bm21b-q-yeush',
    kind: 'question',
    hebrew: 'יֵאוּשׁ שֶׁלֹּא מִדַּעַת',
    prompt: 'What does ye’ush shelo mida’as mean?',
    translation:
      'Despair that is not conscious: the owner does not know he lost the object yet, but would give up on it if he knew.',
  },
  {
    id: 'bm21b-q-abaye',
    kind: 'question',
    hebrew: 'אַבָּיֵי',
    prompt: 'What does Abaye hold about ye’ush shelo mida’as?',
    translation:
      'לא הוי ייאוש. It is not ye’ush, because he never actually despaired. The finder may not keep it.',
  },
  {
    id: 'bm21b-q-rava',
    kind: 'question',
    hebrew: 'רָבָא',
    prompt: 'What does Rava hold about ye’ush shelo mida’as?',
    translation:
      'הוי ייאוש — at least on an item with no siman. When the owner finds out, he will despair, so we treat it as ye’ush already.',
  },
  {
    id: 'bm21b-q-siman',
    kind: 'question',
    hebrew: 'סִימָן',
    prompt: 'Do Abaye and Rava argue about an item that has a siman?',
    translation:
      'No. Everyone agrees it is not ye’ush. Even if he later despairs, it already came to the finder in a forbidden way.',
  },
  {
    id: 'bm21b-q-sea',
    kind: 'question',
    hebrew: 'זוּטוֹ שֶׁל יָם',
    prompt: 'May you keep something lost in the tide of the sea or a flooding river?',
    translation:
      'Yes. Even if it has a siman, the Torah permits it (רחמנא שרייה).',
  },
  {
    id: 'bm21b-q-machlokes',
    kind: 'question',
    hebrew: 'דָּבָר שֶׁאֵין בּוֹ סִימָן',
    prompt: 'Where exactly is the machlokes of Abaye and Rava?',
    translation:
      'Only on an item with no siman, when the owner does not yet know it fell.',
  },
  {
    id: 'bm21b-q-produce',
    kind: 'question',
    hebrew: 'פֵּירוֹת מְפוּזָּרִין',
    prompt: 'Why isn’t “scattered produce belongs to the finder” a proof for Rava?',
    translation:
      'Rav Ukva: we are talking about leftover kernels on the threshing floor — an aveidah mida’as, not ye’ush shelo mida’as.',
  },
  {
    id: 'bm21b-q-pocket',
    kind: 'question',
    hebrew: 'אָדָם עָשׂוּי לְמַשְׁמֵשׁ בְּכִיסוֹ',
    prompt: 'Why do scattered coins belong to the finder, according to the Gemara’s answer?',
    translation:
      'R’ Yitzchak: a person constantly feels his pocket, so he knows they fell and despairs. It is not shelo mida’as.',
  },
  {
    id: 'bm21b-q-nemushot',
    kind: 'question',
    hebrew: 'נָמוֹשׁוֹת',
    prompt: 'What are nemushot, according to R’ Yochanan vs Reish Lakish?',
    translation:
      'R’ Yochanan: elderly people walking on a cane. Reish Lakish: gleaners who come after the other gleaners.',
  },
  {
    id: 'bm21b-q-olives',
    kind: 'question',
    hebrew: 'חָזוּתוֹ מוֹכִיחַ עָלָיו',
    prompt: 'Why are olives under the tree forbidden, but fallen figs permitted?',
    translation:
      'Olives look like the ones on that tree, so the owner is known. A fig becomes disgusting when it falls (Rav Pappa), so the owner does not want it.',
  },
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
