import type { ExamQuestion } from '../exam.ts'

export const BM25A_EXAM: ExamQuestion[] = [
  {
    id: 'exam-25a-mishna',
    sectionId: 'mishna',
    hebrew: 'כִּכָּרוֹת שֶׁל בַּעַל הַבַּיִת, וְגִיזֵּי צֶמֶר הַלְּקוּחִין מִבֵּית הָאוּמָּן',
    prompt:
      'Why must a finder announce a homeowner’s loaves and wool from a craftsman, when a baker’s loaves belong to the finder?',
    translation:
      'They have a siman: each homeowner bakes his own way and each craftsman works the wool his own way, so the owner can identify them.',
    keywords: ['siman', 'own way', 'identify', 'recognize'],
  },
  {
    id: 'exam-25a-diyuk',
    sectionId: 'kli',
    hebrew: 'כְּלִי וּלְפָנָיו פֵּירוֹת',
    prompt:
      'What diyuk does the Gemara make from the mishna about produce in a vessel, and what if only some is in the vessel?',
    translation:
      'Produce in front of a vessel belongs to the finder; only produce inside must be announced. If some is in the vessel and some on the ground, he must announce.',
    keywords: ['in front', 'finder', 'inside', 'some on the ground', 'must announce'],
  },
  {
    id: 'exam-25a-kashya',
    sectionId: 'kli',
    hebrew: 'דָּבָר שֶׁאֵין בּוֹ סִימָן בְּצַד דָּבָר שֶׁיֵּשׁ בּוֹ סִימָן',
    prompt: 'What contradiction does the Gemara raise from the braisa?',
    translation:
      'The braisa says something with no siman next to something with a siman must be announced, so produce next to a vessel should be announced — but the mishna lets the finder keep it.',
    keywords: ['next to', 'must announce', 'contradict', 'finder keep'],
  },
  {
    id: 'exam-25a-answers',
    sectionId: 'kli',
    hebrew: 'כּוּבָּא וְכִיתָּנָא... צַנָּא וּפֵירֵי',
    prompt: 'Give Rav Zevid’s answer and Rav Pappa’s answer.',
    translation:
      'Rav Zevid: the braisa is flax in a container, which falls out all together; the mishna is produce in a basket, which would leave some behind. Rav Pappa: both are a basket — announce if something was left in it, keep if nothing was left.',
    keywords: ['flax', 'all together', 'something left', 'nothing left'],
  },
  {
    id: 'exam-25a-more',
    sectionId: 'kli',
    hebrew: 'וְאִיבָּעֵית אֵימָא',
    prompt: 'What are the two further answers (“if you want, say”)?',
    translation:
      'It depends whether the basket’s mouth faces the produce; or, even if it does, whether the basket has a rim that would have held some back.',
    keywords: ['mouth faces', 'facing', 'rim'],
  },
  {
    id: 'exam-25a-piles',
    sectionId: 'tziburim',
    hebrew: 'צִבּוּרֵי פֵירוֹת',
    prompt: 'Can we prove from “piles of produce” that number or place is a siman?',
    translation:
      'No. If you try to prove number, read it “a pile”; if you try to prove place, read it “piles.” Nothing is proven.',
    keywords: ['no', 'nothing proven', 'read it', 'no proof'],
  },
  {
    id: 'exam-25a-towers',
    sectionId: 'migdalim',
    hebrew: 'עֲשׂוּיִין כְּמִגְדָּלִין',
    prompt:
      'When are three stacked coins announced, and what does the braisa call coins that only partly overlap?',
    translation:
      'Only when arranged like towers. Anything not like towers, even overlapping, the braisa calls scattered, so the finder keeps it.',
    keywords: ['like towers', 'scattered', 'overlapping', 'keeps'],
  },
  {
    id: 'exam-25a-chanina',
    sectionId: 'melachim',
    hebrew: 'שֶׁל מֶלֶךְ אֶחָד כְּעֵין שְׁלֹשָׁה מְלָכִים',
    prompt:
      'What does Rabbi Chanina mean by “three kings,” and why are same-size coins of one king not announced?',
    translation:
      'Coins of three sizes, widest on the bottom and smallest on top, show someone placed them. Same-size coins could have fallen on each other by chance.',
    keywords: ['three sizes', 'widest on the bottom', 'placed', 'by chance'],
  },
  {
    id: 'exam-25a-yochanan',
    sectionId: 'melachim',
    hebrew: 'טִבְעָא מַכְרֵיז',
    prompt:
      'Rabbi Yochanan: even one king’s coins are announced. What is the siman, and why does the mishna say three, not two (Ravina)?',
    translation:
      'The number is the siman. The finder announces “coins,” which already means at least two, so two is no siman; three is.',
    keywords: ['number', 'at least two', 'coins means two', 'three'],
  },
  {
    id: 'exam-25a-kisam',
    sectionId: 'melachim',
    hebrew: 'קֵיסָם',
    prompt: 'Which of Rabbi Yirmeya’s questions is answered, and by what rule?',
    translation:
      'The ladder. If a wood chip slipped between the coins would lift them all at once, he must announce.',
    keywords: ['ladder', 'wood chip', 'all at once'],
  },
]
