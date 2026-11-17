import type { PackItem, Sugya } from '../types.ts'

/*
 * Bava Metzia 45a (פרק הזהב). Text follows the William Davidson / Koren
 * vocalized edition on Sefaria; pshat follows Rashi.
 */

export const BM45A_SUGYOS: Sugya[] = [
  {
    id: 'dinar',
    title: 'Dinar for a dinar',
    hebrew: 'אסור ללוות דינר בדינר',
    hint: 'A gold loan, gold as a commodity, and Ravin’s report',
  },
  {
    id: 'perutos',
    title: 'The proof from perutos',
    hebrew: 'הפורט סלע',
    hint: 'Beis Shammai let a sela become copper — why gold is not learned from it',
  },
  {
    id: 'kesef-sheni',
    title: 'First money, second money',
    hebrew: 'כסף ראשון ולא כסף שני',
    hint: 'Rabbi Yochanan and Reish Lakish on where Beis Shammai and Beis Hillel argue',
  },
  {
    id: 'yerushalayim',
    title: 'Yerushalayim and the gezeirah',
    hebrew: 'ירושלים קמותבת',
    hint: 'Rava’s answer, the last ta shema, and Beis Shammai’s real reason',
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
    id: `bm45a-w-${id}`,
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
  return { id: `bm45a-s-${id}`, kind: 'sentence', sugya, hebrew, translation, prompt, keywords }
}

function question(
  sugya: string,
  id: string,
  hebrew: string,
  prompt: string,
  translation: string,
  keywords: string[],
): PackItem {
  return { id: `bm45a-q-${id}`, kind: 'question', sugya, hebrew, prompt, translation, keywords }
}

const WORDS: PackItem[] = [
  // Dinar for a dinar
  word('dinar', 'lilvos', 'לִלְווֹת דִּינָר בְּדִינָר', 'To borrow a dinar and pay back a dinar', [
    'borrow a dinar',
    'pay back a dinar',
    'pay it back',
    'loan',
  ]),
  word('dinar', 'dinar-zahav', 'דִּינָר שֶׁל זָהָב', 'A gold dinar', ['gold dinar', 'gold coin']),
  word('dinar', 'dinar-kesef', 'דִּינָר שֶׁל כֶּסֶף', 'A silver dinar', [
    'silver dinar',
    'silver coin',
  ]),
  word('dinar', 'tivah', 'טִבְעָא', 'Currency — a real coin (matbea)', [
    'currency',
    'coin',
    'matbea',
    'money',
  ]),
  word('dinar', 'peira', 'פֵּירָא', 'A commodity — treated like produce, not currency', [
    'commodity',
    'peira',
    'produce',
    'merchandise',
    'fruit',
  ]),
  word('dinar', 'mechallelin', 'מְחַלְּלִין', 'We redeem (ma’aser sheni onto it)', [
    'redeem',
    'mechallel',
    'mechallelin',
    'chillul',
    'transfer the kedusha',
  ]),
  word('dinar', 'ein-mechallelin', 'אֵין מְחַלְּלִין', 'We do not redeem onto it', [
    'do not redeem',
    'cannot redeem',
    'cant redeem',
    'not redeem',
    'ein mechallelin',
  ]),
  word(
    'dinar',
    'okeir',
    'אִיהוּ נִיהוּ דְּאוֹקֵיר וְזִיל',
    'It is the one that goes up and down in value',
    ['goes up and down', 'up and down', 'rises and falls', 'changes value', 'fluctuates'],
  ),
  word('dinar', 'halvaah', 'הַלְוָאָה', 'A loan', ['loan', 'lending', 'halvaah']),
  word('dinar', 'mekach', 'מִקָּח וּמִמְכָּר', 'Buying and selling', [
    'buying and selling',
    'buying',
    'selling',
    'business',
  ]),
  word('dinar', 'shavyuhu', 'שַׁוְּיוּהּוּ רַבָּנַן כִּי פֵירָא', 'The Rabbanan made it like a commodity', [
    'made it a commodity',
    'like a commodity',
    'rabbanan',
    'commodity',
  ]),
  word('dinar', 'mistabra', 'הָכִי נָמֵי מִסְתַּבְּרָא', 'So too it makes sense — a support', [
    'makes sense',
    'reasonable',
    'mistabra',
    'support',
  ]),
  word('dinar', 'ravin', 'כִּי אֲתָא רָבִין', 'When Ravin came (from Eretz Yisrael)', [
    'ravin came',
    'when ravin came',
    'came from eretz yisrael',
  ]),
  word('dinar', 'maaser-sheni', 'מַעֲשֵׂר שֵׁנִי', 'The second tithe, eaten in Yerushalayim', [
    'second tithe',
    'maaser sheni',
    'eaten in yerushalayim',
  ]),

  // Perutos
  word('perutos', 'poret', 'הַפּוֹרֵט סֶלַע', 'One who changes a sela into small coins', [
    'changes a sela',
    'breaks a sela',
    'exchanges',
    'change',
  ]),
  word('perutos', 'sela', 'סֶלַע', 'A sela — a large silver coin (two shekels)', [
    'silver coin',
    'sela',
    'two shekels',
  ]),
  word('perutos', 'shekel', 'שֶׁקֶל', 'A shekel — half a sela', ['half a sela', 'half', 'shekel']),
  word('perutos', 'maos', 'מָעוֹת', 'Small (copper) coins', [
    'small coins',
    'copper',
    'change',
    'perutos',
  ]),
  word('perutos', 'peritei', 'פְּרִיטֵי', 'Small change — copper perutos', [
    'small change',
    'perutos',
    'copper',
    'change',
  ]),
  word('perutos', 'dahava', 'דַּהֲבָא', 'Gold', ['gold']),
  word('perutos', 'kaspa', 'כַּסְפָּא', 'Silver', ['silver']),
  word('perutos', 'sagiyin', 'בְּאַתְרָא דְּסָגַיִין', 'In a place where they circulate', [
    'where they circulate',
    'circulate',
    'are used',
    'accepted',
  ]),
  word('perutos', 'charifei', 'חֲרִיפֵי', 'They are easier to spend (more liquid)', [
    'easier to spend',
    'liquid',
    'spend',
    'sharp',
    'more accepted',
  ]),
  word('perutos', 'mibaya', 'מִיבַּעְיָא', 'Is it even a question? — all the more so', [
    'all the more',
    'even a question',
    'obviously',
    'kal vachomer',
  ]),

  // First money, second money
  word('kesef-sheni', 'lishna', 'לִישָּׁנָא אַחֲרִינָא', 'Another version', [
    'another version',
    'other version',
    'lishna acharina',
  ]),
  word(
    'kesef-sheni',
    'rishon',
    'כֶּסֶף רִאשׁוֹן וְלֹא כֶּסֶף שֵׁנִי',
    'The first money and not second money',
    ['first money', 'not second', 'rishon', 'not the second money'],
  ),
  word('kesef-sheni', 'ribah', 'רִיבָּה', 'The pasuk added — it includes more', [
    'includes',
    'added',
    'ribah',
    'ribuy',
    'extra',
  ]),
  word('kesef-sheni', 'selaim-dinarim', 'סְלָעִין עַל דִּינָרִין', 'Silver sela’im onto gold dinars', [
    'selaim onto dinars',
    'silver onto gold',
    'sela onto dinar',
    'selaim on dinarim',
  ]),
  word('kesef-sheni', 'peiros-dinarim', 'פֵּירוֹת עַל דִּינָרִין', 'Produce onto gold dinars', [
    'produce onto dinars',
    'fruit onto dinars',
    'produce onto gold',
    'peiros',
  ]),
  word('kesef-sheni', 'divrei-hakol', 'דִּבְרֵי הַכֹּל', 'Everyone agrees', [
    'everyone agrees',
    'all agree',
    'divrei hakol',
  ]),
  word('kesef-sheni', 'akati', 'דְּאַכַּתִּי כֶּסֶף רִאשׁוֹן הוּא', 'Because it is still the first money', [
    'still the first money',
    'still first',
    'first money',
  ]),
  word('kesef-sheni', 'hava-amina', 'הֲוָה אָמֵינָא', 'I would have thought', [
    'would have thought',
    'hava amina',
    'i would think',
  ]),
  word('kesef-sheni', 'kamashma', 'קָא מַשְׁמַע לַן', 'It teaches us', [
    'teaches us',
    'kamashma lan',
    'comes to teach',
  ]),
  word('kesef-sheni', 'modu', 'מוֹדוּ לְהוּ', 'They agree with them', ['agree', 'concede', 'modu']),

  // Yerushalayim
  word('yerushalayim', 'motvat', 'יְרוּשָׁלַיִם קָמוֹתְבַתְּ', 'You are asking from Yerushalayim?', [
    'asking from yerushalayim',
    'from yerushalayim',
    'from jerusalem',
    'challenge from yerushalayim',
  ]),
  word('yerushalayim', 'teaveh', 'בְּכֹל אֲשֶׁר תְּאַוֶּה נַפְשְׁךָ', 'On whatever your soul desires', [
    'whatever you desire',
    'soul desires',
    'whatever you want',
    'anything you want',
  ]),
  word('yerushalayim', 'chashiv', 'דַּחֲשִׁיב מִינֵּיהּ', 'Which is more valuable than it', [
    'more valuable',
    'worth more',
    'more important',
  ]),
  word('yerushalayim', 'gazrinan', 'גָּזְרִינַן', 'We make a gezeirah', [
    'gezeirah',
    'decree',
    'gazrinan',
    'rabbinic decree',
  ]),
  word('yerushalayim', 'kuli-alma', 'דְּכוּלֵּי עָלְמָא', 'According to everyone', [
    'everyone',
    'all agree',
    'everyone agrees',
  ]),
]

const SENTENCES: PackItem[] = [
  sentence(
    'dinar',
    'assur',
    'אָסוּר לִלְווֹת דִּינָר בְּדִינָר.',
    'It is assur to borrow a dinar and pay back a dinar — its value may change in between, so it could be ribbis.',
    ['assur', 'borrow', 'pay back', 'ribbis', 'interest'],
  ),
  sentence(
    'dinar',
    'which-dinar',
    'דִּינָר דְּמַאי? אִילֵּימָא דִּינָר שֶׁל כֶּסֶף בְּדִינָר שֶׁל כֶּסֶף... אֶלָּא פְּשִׁיטָא דִּינָר שֶׁל זָהָב בְּדִינָר שֶׁל זָהָב.',
    'Which dinar? Not silver — silver is surely currency against itself. It must mean a gold dinar paid back with a gold dinar.',
    ['gold dinar', 'not silver', 'silver is currency', 'must be gold'],
    'In English, which dinar is the Gemara talking about, and why?',
  ),
  sentence(
    'dinar',
    'proof',
    'אִי לְבֵית הִלֵּל – הָא אָמְרִי טִבְעָא הָוֵי. אֶלָּא לָאו לְבֵית שַׁמַּאי, וּשְׁמַע מִינַּהּ רַבִּי יוֹחָנָן הוּא דְּאָמַר: אֵין מְחַלְּלִין!',
    'Beis Hillel say gold is currency, so this must follow Beis Shammai — which proves Rabbi Yochanan is the one who says we do not redeem ma’aser sheni onto gold.',
    ['beis shammai', 'not currency', 'rabbi yochanan', 'do not redeem', 'ein mechallelin'],
    'In English, what is the Gemara trying to prove here?',
  ),
  sentence(
    'dinar',
    'loan-different',
    'וְשָׁאנֵי הַלְוָאָה כֵּיוָן דִּלְעִנְיַן מִקָּח וּמִמְכָּר שַׁוְּיוּהּוּ רַבָּנַן כִּי פֵירָא... לְגַבֵּי הַלְוָאָה נָמֵי פֵּירָא הָוֵי.',
    'A loan is different: for buying and selling the Rabbanan made gold like a commodity, so for a loan it is a commodity too.',
    ['loan is different', 'commodity', 'buying and selling', 'peira'],
    'In English, how does the Gemara push off the proof?',
  ),
  sentence(
    'dinar',
    'ravin',
    'אַף עַל פִּי שֶׁאָמְרוּ אָסוּר לִלְווֹת דִּינָר בְּדִינָר, אֲבָל מְחַלְּלִין מַעֲשֵׂר שֵׁנִי עָלָיו.',
    'Even though they said it is assur to borrow a dinar for a dinar, you may still redeem ma’aser sheni onto it.',
    ['redeem', 'maaser sheni', 'even though', 'mechallelin', 'still'],
  ),
  sentence(
    'perutos',
    'poret',
    'הַפּוֹרֵט סֶלַע מִמְּעוֹת מַעֲשֵׂר שֵׁנִי, בֵּית שַׁמַּאי אוֹמְרִים: בְּכׇל הַסֶּלַע מָעוֹת, וּבֵית הִלֵּל אוֹמְרִים: בְּשֶׁקֶל כֶּסֶף, בְּשֶׁקֶל מָעוֹת.',
    'Someone changing a ma’aser sheni sela into small coins: Beis Shammai say the whole sela may become small coins; Beis Hillel say a shekel stays silver and a shekel becomes small coins.',
    ['whole sela', 'half', 'small coins', 'shekel', 'beis shammai', 'beis hillel'],
  ),
  sentence(
    'perutos',
    'kal-vachomer',
    'הַשְׁתָּא לְבֵית שַׁמַּאי לְגַבֵּי פְּרִיטֵי מְחַלְּלִינַן, לְגַבֵּי דַּהֲבָא מִיבַּעְיָא?',
    'If Beis Shammai let you redeem onto copper perutos, then onto gold all the more so!',
    ['all the more', 'kal vachomer', 'copper', 'gold', 'perutos'],
    'In English, what kal vachomer is the Gemara making?',
  ),
  sentence(
    'perutos',
    'charifei',
    'שָׁאנֵי פְּרִיטֵי בְּאַתְרָא דְּסָגַיִין חֲרִיפֵי.',
    'Perutos are different: in a place where they circulate, they are easier to spend.',
    ['easier to spend', 'circulate', 'liquid', 'perutos are different'],
  ),
  sentence(
    'kesef-sheni',
    'rishon',
    'מַחְלוֹקֶת בִּסְלָעִין עַל דִּינָרִים, דְּבֵית שַׁמַּאי סָבְרִי: ״הַכֶּסֶף״ – כֶּסֶף רִאשׁוֹן וְלֹא כֶּסֶף שֵׁנִי.',
    'They argue about changing silver sela’im onto gold dinars. Beis Shammai learn that “the money” means only the first money, not second money.',
    ['first money', 'not second', 'selaim onto dinars', 'beis shammai'],
  ),
  sentence(
    'kesef-sheni',
    'ribah',
    'וּבֵית הִלֵּל סָבְרִי: ״הַכֶּסֶף״, ״כֶּסֶף״, רִיבָּה – וַאֲפִילּוּ כֶּסֶף שֵׁנִי. אֲבָל פֵּירוֹת עַל דִּינָרִין – דִּבְרֵי הַכֹּל מְחַלְּלִינַן, דְּאַכַּתִּי כֶּסֶף רִאשׁוֹן הוּא.',
    'Beis Hillel: the extra word “money” includes even second money. But produce onto gold dinars everyone allows, because the dinars are still the first money.',
    ['includes', 'second money', 'everyone agrees', 'everyone allows', 'still the first money'],
  ),
  sentence(
    'kesef-sheni',
    'even-peiros',
    'וְחַד אָמַר: אַף בְּפֵירוֹת עַל דִּינָרִין נָמֵי מַחְלוֹקֶת.',
    'The other one says: they argue even about redeeming produce onto gold dinars.',
    ['even produce', 'argue even', 'produce onto dinars', 'also a machlokes'],
  ),
  sentence(
    'kesef-sheni',
    'selaim-al-selaim',
    'לִיפְלוֹג בִּסְלָעִין עַל סְלָעִין! ...הֲוָה אָמֵינָא: ...מוֹדוּ לְהוּ בֵּית הִלֵּל לְבֵית שַׁמַּאי דְּדַהֲבָא לְגַבֵּי כַּסְפָּא פֵּירָא הָוֵי, קָא מַשְׁמַע לַן.',
    'Why not argue about sela’im onto sela’im? Because then I would think that onto gold dinars Beis Hillel agree, since gold compared to silver is a commodity. So it teaches us they argue there too.',
    ['would have thought', 'beis hillel agree', 'commodity', 'gold', 'selaim onto selaim'],
    'In English, what is the question and the answer?',
  ),
  sentence(
    'yerushalayim',
    'jer-kal-vachomer',
    'הַשְׁתָּא כַּסְפָּא לְגַבֵּי פְּרִיטֵי מְחַלְּלִינַן... לְגַבֵּי דַּהֲבָא דַּחֲשִׁיב מִינֵּיהּ, מִי אָמְרִינַן ״כֶּסֶף רִאשׁוֹן וְלֹא כֶּסֶף שֵׁנִי״?',
    'If silver may be changed onto copper perutos without saying “first money and not second money,” then onto gold, which is worth more, would we say it?',
    ['worth more', 'more valuable', 'gold', 'copper', 'first money'],
    'In English, what kal vachomer is the Gemara making?',
  ),
  sentence(
    'yerushalayim',
    'rava',
    'אָמַר רָבָא: יְרוּשָׁלַיִם קָמוֹתְבַתְּ? שָׁאנֵי יְרוּשָׁלַיִם, דִּכְתִיב בֵּיהּ ״וְנָתַתָּה הַכֶּסֶף בְּכֹל אֲשֶׁר תְּאַוֶּה נַפְשְׁךָ״.',
    'Rava: you are asking from Yerushalayim? Yerushalayim is different — the pasuk says to spend the money there on whatever you desire.',
    ['yerushalayim is different', 'jerusalem is different', 'whatever you desire', 'rava'],
  ),
  sentence(
    'yerushalayim',
    'gazrinan',
    'אֶלָּא דְּכוּלֵּי עָלְמָא ״הַכֶּסֶף״ ״כֶּסֶף״ רִיבָּה, וַאֲפִילּוּ כֶּסֶף שֵׁנִי... דְּבֵית שַׁמַּאי סָבְרִי: גָּזְרִינַן.',
    'Rather, everyone agrees the pasuk includes even second money. Beis Shammai’s reason is a gezeirah.',
    ['everyone agrees', 'includes second money', 'gezeirah', 'decree'],
    'In English, what does the Gemara conclude here?',
  ),
]

const QUESTIONS: PackItem[] = [
  question(
    'dinar',
    'which-dinar',
    'דִּינָר דְּמַאי?',
    'Which kind of dinar is assur to borrow and pay back, and why not the other kind?',
    'A gold dinar. Silver is surely currency against itself, so a silver dinar for a silver dinar is no problem.',
    ['gold', 'silver is currency', 'gold dinar'],
  ),
  question(
    'dinar',
    'why-assur',
    'אָסוּר לִלְווֹת דִּינָר בְּדִינָר',
    'In English: why is it assur to borrow a gold dinar and pay back a gold dinar?',
    'Gold is treated like a commodity that goes up and down in value. If it goes up, the lender gets back more than he lent — ribbis.',
    ['ribbis', 'interest', 'goes up', 'commodity', 'value changes', 'gets back more'],
  ),
  question(
    'dinar',
    'proof',
    'אֵין מְחַלְּלִין',
    'What did the Gemara want to prove about Rabbi Yochanan from “assur to borrow a dinar for a dinar”?',
    'That according to Beis Shammai he holds gold is not currency, so we may not redeem ma’aser sheni onto a gold dinar.',
    ['not currency', 'cannot redeem', 'do not redeem', 'ein mechallelin', 'not redeem'],
  ),
  question(
    'dinar',
    'dechiya',
    'שָׁאנֵי הַלְוָאָה',
    'How does the Gemara push off that proof?',
    'A loan is different. For buying and selling the Rabbanan made gold a commodity, so for loans too it is a commodity — but for ma’aser sheni Rabbi Yochanan can still hold we redeem onto it.',
    ['loan is different', 'commodity', 'buying and selling', 'still redeem'],
  ),
  question(
    'dinar',
    'ravin',
    'כִּי אֲתָא רָבִין',
    'What did Ravin report in the name of Rabbi Yochanan, and what does it support?',
    'Even though it is assur to borrow a dinar for a dinar, we may redeem ma’aser sheni onto it. That supports the pshat that Rabbi Yochanan says mechallelin.',
    ['redeem', 'mechallelin', 'maaser sheni', 'supports'],
  ),
  question(
    'dinar',
    'okeir',
    'אִיהוּ נִיהוּ דְּאוֹקֵיר וְזִיל',
    'In buying and selling, which coin is the one that goes up and down in value, and what does that make it?',
    'The gold coin. That makes it a commodity, not currency.',
    ['gold', 'commodity', 'peira', 'not currency'],
  ),
  question(
    'perutos',
    'poret-proof',
    'הַפּוֹרֵט סֶלַע',
    'What does the Gemara try to prove from Beis Shammai in the mishna about changing a ma’aser sheni sela?',
    'Beis Shammai let him change the whole sela into copper perutos. If you may redeem onto copper, all the more so onto gold — so Beis Shammai would say mechallelin on gold.',
    ['all the more', 'copper', 'perutos', 'whole sela', 'gold'],
  ),
  question(
    'perutos',
    'charifei',
    'חֲרִיפֵי',
    'Why does the Gemara reject the proof from perutos?',
    'Perutos are different: in a place where they circulate they are easier to spend, so gold cannot be learned from them.',
    ['easier to spend', 'circulate', 'liquid', 'different'],
  ),
  question(
    'perutos',
    'shekel',
    'בְּשֶׁקֶל כֶּסֶף, בְּשֶׁקֶל מָעוֹת',
    'What do Beis Hillel say about changing a ma’aser sheni sela into small coins?',
    'Only half: a shekel stays silver, and a shekel’s worth becomes small coins.',
    ['half', 'shekel', 'silver', 'small coins'],
  ),
  question(
    'kesef-sheni',
    'pasuk-bs',
    'כֶּסֶף רִאשׁוֹן וְלֹא כֶּסֶף שֵׁנִי',
    'In the other version, how do Beis Shammai learn the pasuk “the money”?',
    'It means only the first money — the coins the produce was redeemed onto. You may not change them into second money, like gold dinars.',
    ['first money', 'not second', 'cannot change', 'only the first'],
  ),
  question(
    'kesef-sheni',
    'pasuk-bh',
    'הַכֶּסֶף, כֶּסֶף, רִיבָּה',
    'How do Beis Hillel learn the pasuk?',
    'The pasuk says “money” twice, which includes even second money, so he may change the coins into other coins.',
    ['includes', 'twice', 'second money', 'ribah'],
  ),
  question(
    'kesef-sheni',
    'two-views',
    'חַד אָמַר... וְחַד אָמַר',
    'Rabbi Yochanan and Reish Lakish: what are the two opinions about where Beis Shammai and Beis Hillel argue?',
    'One says they only argue about changing silver sela’im onto gold dinars, but produce onto dinars everyone allows. The other says they argue even about produce onto dinars.',
    ['selaim onto dinars', 'even produce', 'everyone allows', 'produce onto dinars'],
  ),
  question(
    'kesef-sheni',
    'produce-first',
    'דְּאַכַּתִּי כֶּסֶף רִאשׁוֹן הוּא',
    'According to the first opinion, why does everyone agree you may redeem produce onto gold dinars?',
    'Because the dinars are still the first money — the produce is being redeemed onto them for the first time.',
    ['first money', 'first time', 'still first'],
  ),
  question(
    'kesef-sheni',
    'why-not-selaim',
    'לִיפְלוֹג בִּסְלָעִין עַל סְלָעִין',
    'Why didn’t they argue about sela’im onto sela’im, which would show Beis Shammai’s point more simply?',
    'I would have thought Beis Hillel only allow sela onto sela, but agree that gold compared to silver is a commodity and you cannot redeem onto it. So it teaches us they argue even onto dinars.',
    ['would have thought', 'commodity', 'agree', 'teaches us', 'hava amina'],
  ),
  question(
    'yerushalayim',
    'jer-proof',
    'הַפּוֹרֵט סֶלַע שֶׁל מַעֲשֵׂר שֵׁנִי בִּירוּשָׁלַיִם',
    'What does the Gemara try to prove from changing a ma’aser sheni sela in Yerushalayim?',
    'Beis Shammai let him change the whole sela into perutos there, without saying “first money and not second money.” So onto gold, which is worth more, all the more they should not say it.',
    ['whole sela', 'perutos', 'worth more', 'all the more', 'first money'],
  ),
  question(
    'yerushalayim',
    'rava',
    'יְרוּשָׁלַיִם קָמוֹתְבַתְּ',
    'How does Rava answer that proof?',
    'Yerushalayim is different. The pasuk says to spend the money there on whatever you desire, so there you may change it freely.',
    ['yerushalayim is different', 'jerusalem is different', 'whatever you desire', 'spend'],
  ),
  question(
    'yerushalayim',
    'last-ta-shema',
    'בְּכׇל הַסֶּלַע מָעוֹת',
    'The last ta shema is outside Yerushalayim: Beis Shammai let a sela be changed into small coins. What does that prove?',
    'Even Beis Shammai allow second money, so everyone agrees the pasuk includes second money. The first explanation of their machlokes falls.',
    ['second money', 'everyone agrees', 'includes', 'falls'],
  ),
  question(
    'yerushalayim',
    'final',
    'גָּזְרִינַן',
    'After that, what is Beis Shammai’s reason for forbidding sela’im onto gold dinars?',
    'A gezeirah — a rabbinic decree, not the pasuk. Everyone agrees the pasuk itself includes second money.',
    ['gezeirah', 'decree', 'rabbinic', 'not the pasuk'],
  ),
]

export const BM45A_ITEMS: PackItem[] = [...WORDS, ...SENTENCES, ...QUESTIONS]
