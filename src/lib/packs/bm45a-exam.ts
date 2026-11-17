import type { ExamQuestion } from '../exam.ts'

export const BM45A_EXAM: ExamQuestion[] = [
  {
    id: 'exam-45a-which',
    sectionId: 'dinar',
    hebrew: 'אָסוּר לִלְווֹת דִּינָר בְּדִינָר',
    prompt:
      'Which dinar is it assur to borrow and pay back with the same kind of dinar, and why is that ribbis?',
    translation:
      'A gold dinar. Gold goes up and down in value like a commodity, so if it rises the lender gets back more than he lent — ribbis. Silver is currency, so silver for silver is fine.',
    keywords: ['gold', 'commodity', 'ribbis', 'interest', 'goes up'],
  },
  {
    id: 'exam-45a-proof',
    sectionId: 'dinar',
    hebrew: 'וּשְׁמַע מִינַּהּ רַבִּי יוֹחָנָן הוּא דְּאָמַר: אֵין מְחַלְּלִין',
    prompt:
      'Why does the Gemara first think this halacha proves Rabbi Yochanan says we may not redeem ma’aser sheni onto gold?',
    translation:
      'Beis Hillel hold gold is currency, so a halacha treating gold as a commodity must follow Beis Shammai. So Rabbi Yochanan would hold that for Beis Shammai gold is not currency and you cannot redeem onto it.',
    keywords: ['beis shammai', 'not currency', 'cannot redeem', 'do not redeem', 'beis hillel'],
  },
  {
    id: 'exam-45a-loan',
    sectionId: 'dinar',
    hebrew: 'שָׁאנֵי הַלְוָאָה',
    prompt: 'How is the proof pushed off, and how does Ravin’s report support that?',
    translation:
      'A loan is different: the Rabbanan made gold a commodity for buying and selling, so for loans too. Ravin said in Rabbi Yochanan’s name that even though a dinar for a dinar is assur, we still redeem ma’aser sheni onto it.',
    keywords: ['loan is different', 'commodity', 'buying and selling', 'still redeem', 'ravin'],
  },
  {
    id: 'exam-45a-poret',
    sectionId: 'perutos',
    hebrew: 'הַפּוֹרֵט סֶלַע מִמְּעוֹת מַעֲשֵׂר שֵׁנִי',
    prompt:
      'In the mishna of changing a ma’aser sheni sela into small coins, what do Beis Shammai and Beis Hillel each say?',
    translation:
      'Beis Shammai: the whole sela may become small coins. Beis Hillel: only half — a shekel stays silver and a shekel becomes small coins.',
    keywords: ['whole sela', 'half', 'shekel', 'small coins'],
  },
  {
    id: 'exam-45a-charifei',
    sectionId: 'perutos',
    hebrew: 'שָׁאנֵי פְּרִיטֵי בְּאַתְרָא דְּסָגַיִין חֲרִיפֵי',
    prompt:
      'What kal vachomer does the Gemara try from that mishna, and why does it fail?',
    translation:
      'If Beis Shammai let you redeem onto copper perutos, all the more onto gold. It fails because perutos are different: where they circulate they are easier to spend.',
    keywords: ['all the more', 'easier to spend', 'circulate', 'perutos are different'],
  },
  {
    id: 'exam-45a-rishon',
    sectionId: 'kesef-sheni',
    hebrew: 'כֶּסֶף רִאשׁוֹן וְלֹא כֶּסֶף שֵׁנִי',
    prompt:
      'In the other version, how do Beis Shammai and Beis Hillel each learn the pasuk “the money”?',
    translation:
      'Beis Shammai: only the first money, not second money, so sela’im may not be changed onto gold dinars. Beis Hillel: the extra word “money” includes even second money.',
    keywords: ['first money', 'not second', 'includes', 'second money'],
  },
  {
    id: 'exam-45a-two-views',
    sectionId: 'kesef-sheni',
    hebrew: 'פֵּירוֹת עַל דִּינָרִין',
    prompt:
      'According to the two opinions of Rabbi Yochanan and Reish Lakish, do they argue about redeeming produce onto gold dinars?',
    translation:
      'One says no — everyone allows it, because the dinars are still the first money. The other says they argue even about produce onto dinars.',
    keywords: ['first money', 'everyone allows', 'even produce', 'argue even'],
  },
  {
    id: 'exam-45a-selaim',
    sectionId: 'kesef-sheni',
    hebrew: 'לִיפְלוֹג בִּסְלָעִין עַל סְלָעִין',
    prompt:
      'Why does the machlokes have to be taught about sela’im onto dinars and not sela’im onto sela’im?',
    translation:
      'Otherwise I would have thought Beis Hillel agree that onto gold dinars you cannot, since gold compared to silver is a commodity. It teaches us they argue even there.',
    keywords: ['would have thought', 'commodity', 'agree', 'teaches us'],
  },
  {
    id: 'exam-45a-jerusalem',
    sectionId: 'yerushalayim',
    hebrew: 'יְרוּשָׁלַיִם קָמוֹתְבַתְּ',
    prompt:
      'What proof is brought from changing a sela in Yerushalayim, and how does Rava answer it?',
    translation:
      'There even Beis Shammai let silver become copper perutos, so all the more onto gold, which is worth more. Rava: Yerushalayim is different, because the pasuk lets you spend the money there on whatever you desire.',
    keywords: ['yerushalayim is different', 'jerusalem is different', 'whatever you desire', 'worth more'],
  },
  {
    id: 'exam-45a-gazrinan',
    sectionId: 'yerushalayim',
    hebrew: 'גָּזְרִינַן',
    prompt:
      'After the last ta shema, what does the Gemara conclude about the pasuk, and what is Beis Shammai’s reason instead?',
    translation:
      'Everyone agrees the pasuk includes even second money. Beis Shammai forbid sela’im onto dinars only because of a gezeirah.',
    keywords: ['everyone agrees', 'includes second money', 'gezeirah', 'decree'],
  },
]
