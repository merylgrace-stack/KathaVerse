import type { Story } from './types';

export const STORIES: Story[] = [
  {
    id: 'yakshi',
    title: { en: 'Yakshi', ml: 'യക്ഷി' },
    subtitle: { en: 'Spirit of the Pala Tree', ml: 'പാല മരത്തിന്റെ ആത്മാവ്' },
    description: {
      en: 'Explore Kerala\'s most captivating feminine spirit — the Yakshi. Dwelling in the canopy of the Pala tree under the full moon, she is one of the most enduring figures in Kerala\'s folklore: beautiful, dangerous, and deeply symbolic of nature\'s dual power.',
      ml: 'കേരളത്തിലെ ഏറ്റവും ആകർഷണീയമായ സ്ത്രീ ആത്മാവിനെ — യക്ഷിയെ — അന്വേഷിക്കുക. പൗർണ്ണമിയിൽ പാല മരത്തിന്റെ കൊമ്പിൽ വസിക്കുന്ന അവൾ കേരളത്തിന്റെ നാടോടിക്കഥകളിലെ ഏറ്റവും ശക്തമായ കഥാപാത്രമാണ്.',
    },
    coverImage: '/images/yakshi.jpg',
    category: 'folklore',
    readingTime: 18,
    featured: true,
    trending: true,
    createdAt: '2024-01-01',
    tags: ['yakshi', 'folklore', 'spirit', 'pala tree', 'moonlight', 'feminine'],
    sources: [
      'Folklore Studies in Kerala — Kerala Sahitya Akademi',
      'Aithihyamala by Kottarathil Sankunni (1909)',
      'Kerala Folklore Theatre — K. Ayyappa Paniker',
    ],
    glossary: [
      { term: 'Yakshi', meaning: 'A female spirit in Hindu and Buddhist traditions, often associated with nature and fertility. In Kerala folklore, she is depicted as a beautiful woman who lures travellers.', pronunciation: 'Yakk-shi' },
      { term: 'Pala', meaning: 'The Indian Devil Tree (Alstonia scholaris). Considered sacred and supernatural in Kerala — Yakshis are said to inhabit them.', pronunciation: 'Paa-la' },
      { term: 'Pishachu', meaning: 'A class of malevolent spirits in Indian mythology, distinct from Yakshis but often mentioned alongside them in Kerala folklore.', pronunciation: 'Pi-shaa-chu' },
      { term: 'Kolam', meaning: 'Ritual drawing or figure; also refers to the costume and appearance of a deity in ritual performance.', pronunciation: 'Ko-lam' },
      { term: 'Namboodiri', meaning: 'The highest-ranking Brahmin community in Kerala, central to many folklore traditions involving Yakshis.', pronunciation: 'Namboo-diri' },
    ],
    chapters: [
      {
        id: 'yakshi-1',
        title: { en: 'The Legend of the Pala Tree', ml: 'പാല മരത്തിന്റെ ഐതിഹ്യം' },
        content: {
          en: `In the villages of Kerala, when the Pala tree blooms at night and its heavy, intoxicating fragrance drifts through the darkness, old people still lower their voices and warn the young: "Do not walk alone tonight."

The Yakshi is one of Kerala's most ancient and complex folkloric figures — a beautiful woman who appears under moonlight, fragrant as the Pala blossom, with long dark hair and eyes that hold the depth of still water. She is said to dwell in old Pala trees, emerging when the moon is full.

**What the tradition says**

In the oldest layers of the tradition, Yakshis are not simply evil. They are ambivalent spirits — powerful, territorial, and deeply connected to the natural world. The Aithihyamala, the great compendium of Kerala's oral legends compiled by Kottarathil Sankunni in the early 20th century, contains numerous Yakshi stories that show this complexity.

Some Yakshis are protectors of sacred groves. Others are spirits of women who died unfulfilled — through abandonment, injustice, or tragedy — and who linger near places of beauty and sorrow. The transformation into a predatory spirit is often explained as a consequence of a grievous wrong done to her in life.

**The Namboodiri stories**

Many of the most famous Yakshi stories centre on Namboodiri Brahmin households and the learned men who study Sanskrit at night by lamplight. The Yakshi, drawn to the lamp's glow, appears at the window. In these stories, she is not merely a monster: she is a figure who tests wisdom, courage, and moral clarity.

The scholarly Brahmin who recognises the Yakshi and knows the ritual mantras to contain her is often rewarded with knowledge or protected. The one who succumbs — drawn by desire or arrogance — meets a terrible fate.

*Note: These are traditional folklore narratives. They reflect the cultural beliefs and storytelling traditions of Kerala, not historical events.*`,
          ml: `കേരളത്തിലെ ഗ്രാമങ്ങളിൽ, രാത്രിയിൽ പാല മരം പൂക്കുകയും അതിന്റെ ഗാഢമായ സൗരഭ്യം ഇരുട്ടിലൂടെ ഒഴുകുകയും ചെയ്യുമ്പോൾ, പ്രായമായവർ ഇന്നും ശബ്ദം താഴ്ത്തി ചെറുപ്പക്കാരെ മുന്നറിയിക്കുന്നു: "ഇന്ന് രാത്രി തനിച്ചു നടക്കരുത്."

യക്ഷി കേരളത്തിലെ ഏറ്റവും പ്രാചീനവും സങ്കീർണ്ണവുമായ നാടോടിക്കഥ കഥാപാത്രങ്ങളിൽ ഒന്നാണ് — പൗർണ്ണമിയിൽ ദൃശ്യമാകുന്ന, പാല പൂവിന്റെ സൗരഭ്യമുള്ള, നീണ്ട കറുത്ത മുടിയും നിശ്ചലജലത്തിന്റെ ആഴമുള്ള കണ്ണുകളുമുള്ള ഒരു സുന്ദരി. അവൾ പഴയ പാല മരങ്ങളിൽ വസിക്കുന്നതായി പറയപ്പെടുന്നു, നിലാവ് നിറഞ്ഞ രാത്രികളിൽ പ്രത്യക്ഷപ്പെടുന്നു.`,
        },
        imageUrl: '/images/yakshi.jpg',
      },
      {
        id: 'yakshi-2',
        title: { en: 'The Nail in the Tree', ml: 'മരത്തിലെ ആണി' },
        content: {
          en: `**How a Yakshi is contained**

Across Kerala's folklore, one motif appears repeatedly: the iron nail. Driving an iron nail into the Pala tree during the Yakshi's moment of vulnerability — typically when she has momentarily resumed her spirit form — is said to trap her within the tree, ending her wandering.

This detail carries layers of meaning. Iron is a substance widely believed across many cultures to be harmful to spirits and faeries — its forged, human-made nature placing it outside the realm of wild supernatural forces. In Kerala's ritual traditions, iron implements play protective roles in many ceremonies.

**The story of the Brahmin scholar**

One of the most retold Yakshi stories from Aithihyamala involves a brilliant young Namboodiri scholar who was returning from his Sanskrit studies late one night. He was known for his sharp mind and his knowledge of protective mantras.

On the forest path, he encountered a woman of extraordinary beauty, carrying a lamp. She asked him to escort her home. He, knowing the signs — the Pala blossom fragrance, her feet that did not quite touch the ground — began silently reciting a protective mantra.

She could feel the mantra forming around her like a net. She offered him gifts, knowledge, power — anything to make him stop. He kept reciting. When they reached the Pala tree at the forest's edge, he drove an iron nail into the bark and bound her there with the completed mantra.

The tree, they say, still stands in that village. The oldest residents know not to pick its flowers at night.

*This story exists in multiple regional variations. The version presented here is a composite drawn from documented oral tradition.*`,
          ml: `**ഒരു യക്ഷിയെ എങ്ങനെ ബന്ധിക്കുന്നു**

കേരളത്തിന്റെ നാടോടിക്കഥകളിലുടനീളം ഒരു ഭാഗം ആവർത്തിച്ചു കാണുന്നു: ഇരുമ്പ് ആണി. യക്ഷി ദുർബ്ബലയായ നിമിഷത്തിൽ — സാധാരണയായി അവൾ ഒരു നിമിഷം ആത്മഭാവത്തിലേക്ക് മടങ്ങുമ്പോൾ — പാല മരത്തിൽ ഒരു ഇരുമ്പ് ആണി അടിക്കുന്നത് അവളെ മരത്തിനുള്ളിൽ ബന്ധിക്കുന്നതായി പറയപ്പെടുന്നു.`,
        },
      },
      {
        id: 'yakshi-3',
        title: { en: 'Yakshi in Art and Ritual', ml: 'കലയിലും ആചാരത്തിലും യക്ഷി' },
        content: {
          en: `**Yakshi in Kerala's visual tradition**

The Yakshi has always been a powerful presence in Kerala's artistic traditions. In the elaborate mural paintings of Kerala temples, female figures with flowering trees are a recurring motif — echoing the same symbolic association between women, nature, and spiritual power that defines the Yakshi legend.

In sculpted form, Yakshi figures appear on the walls of ancient Kerala temples. These are rarely threatening — instead they are beautiful, sensuous, and celebratory, representing nature's fertility and abundance. The most famous sculptural Yakshi in Kerala is the "Charupada Yakshi" from Guruvayur, a stunning figure carved in the Keralan tradition.

**The Mudiyettu connection**

In Mudiyettu — the ancient ritual theatre of central Kerala, recognised by UNESCO as an Intangible Cultural Heritage of Humanity — the confrontation between the goddess Kali and the demon Darika includes female spirit figures that share characteristics with Yakshi lore: the association with darkness, the night, beauty weaponised, and the power of the divine feminine to both destroy and protect.

**Regional variations**

Yakshi beliefs vary significantly across Kerala's different regions:
- In northern Kerala (Malabar), the Yakshi is more commonly associated with Theyyam tradition, where some Theyyam deities have Yakshi characteristics.
- In central Kerala, the Namboodiri stories are most prevalent.
- In southern Kerala, Yakshi narratives are often intertwined with serpent worship traditions.

*Cultural note: The Yakshi tradition is a living part of Kerala's folklore. It continues to influence literature, cinema, and visual art in the region.*`,
          ml: `**കേരളത്തിന്റെ ദൃശ്യ പരമ്പരയിൽ യക്ഷി**

കേരളത്തിന്റെ കലാ പാരമ്പര്യങ്ങളിൽ യക്ഷി എല്ലായ്‌പ്പോഴും ശക്തമായ സാന്നിധ്യമായിരുന്നു. കേരള ക്ഷേത്ര ചുവർചിത്രങ്ങളിൽ, പൂക്കുന്ന മരങ്ങളുള്ള സ്ത്രീ രൂപങ്ങൾ ആവർത്തിക്കുന്ന ഒരു ഭാഗമാണ്.`,
        },
      },
    ],
  },
  {
    id: 'mahabali',
    title: { en: 'Mahabali', ml: 'മഹാബലി' },
    subtitle: { en: 'The King Who Never Left', ml: 'പോകാതിരുന്ന രാജാവ്' },
    description: {
      en: 'The legend of Mahabali — Kerala\'s beloved king whose golden reign of justice, equality, and abundance became the foundation of Onam, one of India\'s greatest harvest festivals. A story of a kingdom where no one was hungry, no one lied, and no one was afraid.',
      ml: 'മഹാബലിയുടെ ഐതിഹ്യം — ന്യായം, സമത്വം, സമൃദ്ധി നിറഞ്ഞ ഭരണകാലം ഓണത്തിന്റെ അടിത്തറയായി മാറിയ കേരളത്തിന്റെ പ്രിയ രാജാവ്.',
    },
    coverImage: '/images/mahabali.jpg',
    category: 'mythology',
    readingTime: 22,
    featured: true,
    trending: true,
    createdAt: '2024-01-02',
    tags: ['mahabali', 'onam', 'vamana', 'vishnu', 'golden age', 'kerala'],
    sources: [
      'Bhagavata Purana — Book 8, Chapters 15–23',
      'Onam: The Harvest Festival of Kerala — Kerala Tourism Board',
      'A History of Kerala — K.V. Krishna Ayyar',
    ],
    glossary: [
      { term: 'Mahabali', meaning: 'Also called Maveli. A legendary Asura king believed to have ruled Kerala in a golden age of perfect justice and equality. His annual visit is celebrated as Onam.', pronunciation: 'Mahaa-bali' },
      { term: 'Onam', meaning: 'The major harvest festival of Kerala, celebrated to mark King Mahabali\'s annual visit to his beloved kingdom from the netherworld.', pronunciation: 'Oh-nam' },
      { term: 'Vamana', meaning: 'The fifth avatar of Vishnu, who appeared as a dwarf Brahmin boy and tricked Mahabali into granting him three steps of land.', pronunciation: 'Vaa-mana' },
      { term: 'Asura', meaning: 'A class of powerful beings in Hindu cosmology. While often translated as "demon," Mahabali is revered as a noble, just Asura king.', pronunciation: 'Aa-sura' },
      { term: 'Atham', meaning: 'The first day of the ten-day Onam festival, marked by the beginning of Pookalam (floral carpet) creation.', pronunciation: 'Aa-tham' },
      { term: 'Pookalam', meaning: 'The elaborate floral carpet created during Onam, representing the welcome mat for King Mahabali\'s return.', pronunciation: 'Poo-kalam' },
      { term: 'Thrikkakara', meaning: 'A temple in Ernakulam district, considered the most sacred Onam site and believed to be the location of Vamana\'s first step.', pronunciation: 'Thrik-ka-kara' },
    ],
    chapters: [
      {
        id: 'mahabali-1',
        title: { en: 'The Golden Kingdom', ml: 'സ്വർണ്ണ രാജ്യം' },
        content: {
          en: `Long before memory, the land we call Kerala was ruled by a king whose name means "the great and powerful" — Mahabali, also called Maveli by the people who loved him.

His kingdom was unlike any that had come before or has come since. The rain fell when it should. The earth gave without being forced. And the people — Brahmin and peasant, rich and poor, man and woman — lived in a condition so rare it became the subject of song:

*Maveli naadu vaaneedum kaalam*
*Manusharellaarum onnu pole*

*"When Maveli ruled the land,*
*All people were alike as one."*

**What the tradition remembers**

The Mahabali story comes to us from the Bhagavata Purana, one of Hinduism's eighteen major Puranas, where it occupies several chapters in the eighth book. But the story as lived in Kerala — particularly through the festival of Onam — carries a texture and a tenderness that goes beyond the Puranic telling.

In the Puranic account, Mahabali is an Asura king — a being from a class often cast as divine antagonists in Sanskrit literature. But the characterisation of Asuras in the Puranas is complex: they can be noble, learned, and righteous. Mahabali is explicitly presented as a just ruler beloved by his people, a devotee of Vishnu, and a man of absolute integrity.

His kingdom had no poverty, no injustice, no untruth. Merchants' weights were accurate. Scholars were respected. The sick were cared for. The elderly were honoured. In the Malayalam folk tradition, these qualities are remembered with aching fondness — a vision of a lost paradise.`,
          ml: `ഓർമ്മകൾക്കും മുമ്പ്, കേരളം എന്ന് നാം വിളിക്കുന്ന ഭൂമി ഒരു രാജാവ് ഭരിച്ചിരുന്നു — മഹാബലി, അദ്ദേഹത്തെ സ്നേഹിച്ചവർ മാവേലി എന്ന് വിളിച്ചു.

അദ്ദേഹത്തിന്റെ രാജ്യം അതിനു മുമ്പോ പിമ്പോ ഉണ്ടായിട്ടില്ലാത്ത ഒന്നായിരുന്നു. മഴ വേണ്ടുമ്പോൾ പെയ്തു. ഭൂമി ബലം പ്രയോഗിക്കാതെ ദാനം ചെയ്തു. ജനങ്ങൾ — ബ്രാഹ്മണനും കർഷകനും, ധനികനും ദരിദ്രനും, പുരുഷനും സ്ത്രീയും — അത്ര അപൂർവ്വമായ ഒരവസ്ഥയിൽ ജീവിച്ചു.`,
        },
        imageUrl: '/images/mahabali.jpg',
      },
      {
        id: 'mahabali-2',
        title: { en: 'The Three Steps of Vamana', ml: 'വാമനന്റെ മൂന്ന് അടികൾ' },
        content: {
          en: `**The arrival of the dwarf**

The gods in their celestial realm grew uneasy. A just Asura king whose subjects were happier than the citizens of heaven was, in the logic of the cosmos, an imbalance. They appealed to Vishnu.

Vishnu descended in his fifth avatar — Vamana, the dwarf Brahmin boy. Small, round-bellied, carrying a wooden umbrella and a water pot, he walked into Mahabali's court during the king's great charitable ceremony (yajna), when the king had sworn to grant any sincere request.

"What do you want, little Brahmin?" asked the king, amused and charmed by the child.

"Only three steps of land," said Vamana. "Measured by my own foot."

Mahabali's wise minister, Shukracharya, saw through the disguise immediately. "Your Majesty, this is no ordinary child. Do not make this promise." But Mahabali — a man of absolute integrity, incapable of breaking a word given — laughed and agreed.

**The transformation**

Vamana grew. He grew until his first step covered the entire earth. His second step covered the heavens. He paused, foot raised, and looked at Mahabali.

"Your Majesty, you promised me three steps. I have covered the earth and sky. Where shall I place my third step?"

There was nowhere left to place it — except on Mahabali himself.

The king bowed his head and offered it. "Place your foot here, Lord."

And in that moment of surrender, the tradition holds, Vishnu fully revealed himself — and was moved. This was not an enemy to be destroyed but a devotee greater than most who worshipped him openly.

**The boon**

"Ask me anything," said Vishnu to the king he had just defeated.

Mahabali asked for one thing: permission to visit his people once a year. To see that they were well. To know that the kingdom he had loved still remembered him.

Vishnu granted it.

*This is why, every year at Onam, Kerala prepares to welcome Mahabali home.*`,
          ml: `**കുള്ളൻ്റെ വരവ്**

ദേവന്മാർ തങ്ങളുടെ സ്വർഗ്ഗീയ ലോകത്ത് അസ്വസ്ഥരായി. ആകാശ വാസികളേക്കാൾ സന്തുഷ്ടരായ പ്രജകളുള്ള ഒരു നീതിമാനായ അസുര രാജാവ് പ്രപഞ്ച ക്രമത്തിൽ ഒരു അസന്തുലനാവസ്ഥ ഉണ്ടാക്കി. അവർ വിഷ്ണുവിനോട് അഭ്യർത്ഥിച്ചു.`,
        },
      },
      {
        id: 'mahabali-3',
        title: { en: 'Onam — The Annual Return', ml: 'ഓണം — വാർഷിക തിരിച്ചുവരവ്' },
        content: {
          en: `**The festival that kept a king alive**

Onam is celebrated across the ten days of the Malayalam month Chingam (falling in August–September). It is at once a harvest festival, a cultural celebration, and an act of collective remembrance — Kerala keeping its promise to a king who kept his.

**The ten days**

The festival begins with Atham and builds over ten days to its climax on Thiruvonam — the day Mahabali is believed to arrive.

On each of these days, families add new flowers to the Pookalam — the intricate floral carpet laid at the entrance to welcome the king. The flowers must be arranged in concentric circles, symmetrically, without a single petal out of place. Perfection is the offering.

**Onasadya — the feast**

The Onasadya is among the most elaborate vegetarian meals in the world. Served on a banana leaf, it includes twenty-six to thirty-four distinct dishes arranged in a specific order — rice, curries, pickles, pappadams, payasam — each representing the abundance of Mahabali's kingdom.

The meal is eaten in silence, or near-silence, with the focus entirely on the food and the company. It is an act of gratitude — to the earth, to the tradition, and to a king who wanted nothing more than to know his people were fed.

**Why this story matters**

The Mahabali legend is, at its heart, a story about what we value in a leader. Mahabali's greatness lies not in conquest or accumulation but in the quality of life his people lived. And his final act — the gift of his own head — is the ultimate expression of a leader who considers his people more important than his own power.

Every Onam, Kerala asks itself: what would it look like to live again in that kingdom?

*Cultural note: Onam was declared Kerala's official state festival in 1961. It is celebrated by Keralites of all faiths and backgrounds.*`,
          ml: `**ഒരു രാജാവിനെ ജീവനോടെ നിലനിർത്തിയ ഉത്സവം**

ഓണം ചിങ്ങ മാസത്തിലെ (ഓഗസ്റ്റ്-സെപ്റ്റംബർ) പത്ത് ദിവസം ആഘോഷിക്കപ്പെടുന്നു. ഇത് ഒരേ സമയം ഒരു വിളവെടുപ്പ് ഉത്സവവും, ഒരു സാംസ്കാരിക ആഘോഷവും, ഒരു കൂട്ടായ ഓർമ്മകൊണ്ടാടലുമാണ്.`,
        },
      },
    ],
  },
  {
    id: 'theyyam',
    title: { en: 'Theyyam', ml: 'തെയ്യം' },
    subtitle: { en: 'The God Who Walks Among Us', ml: 'നമ്മുക്കിടയിൽ നടക്കുന്ന ദൈവം' },
    description: {
      en: 'Theyyam is not theatre — it is the divine made flesh. In the ritual tradition of northern Kerala, a performer becomes a deity: the boundary between the human and the sacred dissolves, and the god speaks, blesses, and judges through a mortal body adorned in spectacular costume and sacred fire.',
      ml: 'തെയ്യം കലയല്ല — അത് ദൈവത്വം ജഡത്തിൽ ആവേശിക്കലാണ്. വടക്കൻ കേരളത്തിന്റെ ആചാര പാരമ്പര്യത്തിൽ, ഒരു കലാകാരൻ ദേവനായി മാറുന്നു.',
    },
    coverImage: '/images/theyyam.png',
    category: 'ritual',
    readingTime: 25,
    featured: true,
    trending: false,
    createdAt: '2024-01-03',
    tags: ['theyyam', 'ritual', 'north kerala', 'deity', 'costume', 'sacred fire'],
    sources: [
      'Theyyam: A Study of the Spirit Cult of Malabar — K.K.N. Kurup',
      'Gods of Flesh, Gods of Stone — Joanne Punzo Waghorne',
      'UNESCO Intangible Cultural Heritage Documentation',
    ],
    glossary: [
      { term: 'Theyyam', meaning: 'Derived from "Daivam" (god). A ritual performance art of northern Kerala in which a performer embodies a deity or deified ancestor. There are over 400 distinct Theyyam forms.', pronunciation: 'Theyyam' },
      { term: 'Kolam', meaning: 'The specific costume, makeup, and headgear combination that identifies a particular Theyyam deity. Each is unique and governed by tradition.', pronunciation: 'Ko-lam' },
      { term: 'Mutiyettu', meaning: 'The ritual headgear worn by Theyyam performers, often towering several metres high and representing the deity\'s crown.', pronunciation: 'Muti-ettu' },
      { term: 'Kavadi', meaning: 'The offerings and ceremonial items carried during the Theyyam procession.', pronunciation: 'Ka-vadi' },
      { term: 'Thozhilali', meaning: 'The hereditary community of performers who are entitled to perform specific Theyyam rituals. The right to perform is inherited.', pronunciation: 'Tho-zhil-ali' },
      { term: 'Kavu', meaning: 'The sacred grove or shrine where Theyyam rituals are performed. These are community-owned sacred spaces.', pronunciation: 'Ka-vu' },
      { term: 'Thira', meaning: 'The preliminary stage of a Theyyam performance before the full costume is applied. The performer is partially transformed.', pronunciation: 'Thi-ra' },
    ],
    chapters: [
      {
        id: 'theyyam-1',
        title: { en: 'What Is Theyyam?', ml: 'തെയ്യം എന്തെന്ന്?' },
        content: {
          en: `In most of the world, the divine is approached through intermediaries — through priests, through prayer, through scripture. In northern Kerala, it walks to you.

Theyyam is a ritual performance tradition — one of the oldest living performance traditions in India — practised primarily in the Malabar region of northern Kerala (Kannur and Kasaragod districts). It involves a performer who, through elaborate costume, makeup, and sacred ritual, becomes fully identified with a deity or a deified ancestor. Not represents. Becomes.

**Not theatre**

This distinction is fundamental. A Theyyam performance is not theatrical. The performer is not "acting." Once the full Kolam (costume) is applied — a process that can take six to eight hours — and the sacred mantras are recited, the deity is believed to have genuinely entered the performer's body.

When the Theyyam speaks, it is the deity speaking. When it touches a devotee's head, it is a divine touch. When it pronounces judgment in a community dispute, it is divine justice. The performer's own identity is submerged.

Witnesses describe this as palpably visible. The performer's posture changes. The voice changes. The eyes change. Those who have watched many Theyyams over a lifetime speak of a quality in the fully-costumed deity that cannot be explained by performance alone.

**Scale and diversity**

There are over 400 distinct Theyyam forms, each with its own story, its own ritual, its own elaborate costume specification, and its own community of hereditary performers. No two Theyyams are identical. Each is a complete theological and artistic system.

Some Theyyams depict pan-Hindu deities — Shiva, Vishnu, forms of the Goddess. Others embody deified ancestors — heroes, warriors, or ordinary people who died in exceptional circumstances (violent death, betrayal, devotion) and were elevated to divine status by their community's grief and reverence.`,
          ml: `ലോകത്തിൻ്റെ മിക്ക ഭാഗങ്ങളിലും, ദൈവത്തെ മധ്യവർത്തികൾ വഴി സമീപിക്കുന്നു — പൗരോഹിത്യം, പ്രാർത്ഥന, ഗ്രന്ഥങ്ങൾ. വടക്കൻ കേരളത്തിൽ, ദൈവം നിങ്ങളിലേക്ക് നടന്നു വരുന്നു.

തെയ്യം ഒരു ആചാര പ്രകടന പാരമ്പര്യമാണ് — ഇന്ത്യയിലെ ഏറ്റവും പഴക്കമേറിയ ജീവിത പ്രകടന പാരമ്പര്യങ്ങളിൽ ഒന്ന്.`,
        },
        imageUrl: '/images/theyyam.png',
      },
      {
        id: 'theyyam-2',
        title: { en: 'The Costume and the Sacred Fire', ml: 'കോലവും അഗ്നിയും' },
        content: {
          en: `**The Kolam — a theology in costume**

The costume of a Theyyam deity — the Kolam — is not a design. It is a sacred specification that has been transmitted without interruption for generations. Every element is precisely defined: the colours of the face painting, the shape and height of the headgear, the arrangement of the ornaments, the flowers, the weapons.

Face painting alone can take four to five hours. The colours carry meaning: red for power, black for mystery, white for purity. The patterns map the deity's attributes — solar symbols, serpent forms, weapons, flowers — across the performer's face in a living icon.

The headgear of some Theyyams — the Mutiyettu or crown — can rise three to five metres above the performer's head, a towering structure of bamboo, coconut leaf, cloth, and flowers. The performer balances and dances beneath this weight, sometimes for hours.

**Fire as sacrament**

Many Theyyam rituals involve fire in ways that seem impossible. Performers dance on burning coals, run through flames, hold fire in their hands — all while in the full costume that would otherwise be dangerously flammable.

In the tradition, this is explained not as a physical feat but as divine protection: the deity, present in the performer's body, cannot be burned. Those who have studied Theyyam extensively note that in documented performances over generations, genuine burns do not occur, and no satisfactory physical explanation has been established.

**The hereditary right**

The right to perform specific Theyyams is hereditary and belongs to specific communities — mostly communities from the middle and lower rungs of the caste hierarchy. This is one of Theyyam's most remarkable features: in a culture historically defined by caste hierarchy, the performer of the highest Theyyam — the one who becomes the divine — is often from a marginalised community.

During the Theyyam, caste hierarchy inverts. The highest-caste members of the community receive blessings, hear judgments, and prostrate before someone who in ordinary life they would have treated with contempt. This inversion is not incidental — it is the point.`,
          ml: `**കോലം — കോസ്ട്യൂമിലെ ദൈവശാസ്ത്രം**

ഒരു തെയ്യം ദേവന്റെ കോസ്ട്യൂം — കോലം — ഒരു ഡിസൈൻ അല്ല. തലമുറകളിലൂടെ തടസ്സമില്ലാതെ കൈമാറ്റം ചെയ്യപ്പെട്ട ഒരു പവിത്രമായ വിശദീകരണമാണ്. ഓരോ ഘടകവും കൃത്യമായി നിർവചിക്കപ്പെട്ടിരിക്കുന്നു.`,
        },
      },
      {
        id: 'theyyam-3',
        title: { en: 'Stories the Theyyams Tell', ml: 'തെയ്യങ്ങൾ പറയുന്ന കഥകൾ' },
        content: {
          en: `**Pottan Theyyam — the saint who humbled the Brahmin**

Among the most celebrated Theyyam narratives is the story of Pottan, a devotee of Shiva who lived in a state of deep wisdom but was born into a low-caste family.

A Brahmin scholar encountered Pottan on a forest path and, seeing his humble appearance, did not step aside — the expected gesture of deference from an untouchable. Shiva, recognising his devotee's quiet dignity and the Brahmin's arrogance, appeared in disguise and debated the Brahmin in philosophy. The Brahmin was defeated. Shiva revealed himself, and Pottan was elevated to divine status.

The Pottan Theyyam is one of the most beloved in northern Kerala. When the performer embodies Pottan, the deity's words address contemporary concerns — caste discrimination, pride, the nature of true knowledge — as if speaking about today, not an ancient myth.

**Muchilottu Bhagavathi — the faithful wife**

Not all Theyyams are about gods or heroes. Muchilottu Bhagavathi tells the story of a woman of extraordinary loyalty and devotion who was wronged in life and became a protective deity in death.

Her story — of patience, injustice, steadfastness, and ultimate vindication — is representative of a large class of Theyyam narratives in which ordinary people, particularly women and those from marginalised communities, are remembered, honoured, and elevated to the sacred through community devotion.

**The season of Theyyam**

Theyyam performances happen during the season running roughly from November to May, coinciding with the period after the monsoon. Specific Theyyams are performed at specific Kavus (sacred groves) on dates determined by the traditional calendar.

Attending a Theyyam is not a tourist activity — it is a religious and community event. Visitors are welcome but are expected to observe with respect, not to photograph without permission, and to understand that they are guests at a living sacred practice, not spectators at a show.

*Note: Theyyam has been documented by ethnographers and film-makers, but the tradition itself is highly localised and community-specific. The descriptions here draw on published ethnographic research and are intended as introduction, not comprehensive account.*`,
          ml: `**പൊട്ടൻ തെയ്യം — ബ്രാഹ്മണനെ നിഗ്രഹിച്ച സന്ത്**

ഏറ്റവും ആഘോഷിക്കപ്പെടുന്ന തെയ്യം ആഖ്യാനങ്ങളിൽ, ഒരു താഴ്ന്ന ജാതി കുടുംബത്തിൽ ജനിച്ചെങ്കിലും ആഴത്തിലുള്ള ജ്ഞാനത്തിൽ ജീവിച്ച ശിവ ഭക്തൻ പൊട്ടന്റെ കഥ ഉൾപ്പെടുന്നു.`,
        },
      },
    ],
  },
  {
    id: 'perunthachan',
    title: { en: 'Perunthachan', ml: 'പെരുന്തച്ചൻ' },
    subtitle: { en: 'The Master Craftsman of Kerala', ml: 'കേരളത്തിൻ്റെ മഹാ ശില്പി' },
    description: {
      en: 'The legend of Perunthachan — Kerala\'s mythical master carpenter and architect whose extraordinary skill was said to be divine. His story is one of genius, pride, jealousy, and the irreducible cost of extraordinary talent — and a son who learned his craft too well.',
      ml: 'പെരുന്തച്ചന്റെ ഐതിഹ്യം — കേരളത്തിൻ്റെ മഹത്തായ ആർക്കിടെക്റ്റ് ആരുടെ അദ്ഭുതകരമായ കഴിവ് ദൈവികമെന്ന് പറയപ്പെട്ടിരുന്നു.',
    },
    coverImage: '/images/perunthachan.png',
    category: 'legend',
    readingTime: 20,
    featured: true,
    trending: false,
    createdAt: '2024-01-04',
    tags: ['perunthachan', 'architecture', 'carpenter', 'legend', 'craft', 'kerala'],
    sources: [
      'Aithihyamala by Kottarathil Sankunni',
      'Traditional Architecture of Kerala — Laurie Baker Foundation',
      'Kerala Nalukettu — Architecture and Tradition, INTACH Kerala',
    ],
    glossary: [
      { term: 'Perunthachan', meaning: 'Literally "the great carpenter." A legendary master craftsman of Kerala whose skills were considered superhuman. His name is still invoked when speaking of extraordinary craftsmanship.', pronunciation: 'Peru-tha-chan' },
      { term: 'Thachu Shastra', meaning: 'The traditional science of Kerala\'s wood architecture — a highly sophisticated system of design, proportion, and construction codified in ancient texts.', pronunciation: 'Tha-chu Shaas-tra' },
      { term: 'Nalukettu', meaning: 'The traditional Kerala courtyard house — four wings arranged around a central open courtyard. Perunthachan is credited with perfecting this form.', pronunciation: 'Naalu-kettu' },
      { term: 'Ettukettu', meaning: 'A larger variant of the traditional Kerala house with eight connected wings, typically built for wealthy landowners and temples.', pronunciation: 'Ettu-kettu' },
      { term: 'Vishwakarma', meaning: 'The divine architect in Hindu cosmology. Master craftsmen like Perunthachan are sometimes said to be descendants or devotees of Vishwakarma.', pronunciation: 'Vishwa-karma' },
      { term: 'Kolumbu', meaning: 'A traditional Kerala chisel used in woodcarving. One of the primary tools of Perunthachan\'s craft.', pronunciation: 'Ko-lumbu' },
    ],
    chapters: [
      {
        id: 'perunthachan-1',
        title: { en: 'The Genius of the Chisel', ml: 'ഉളിയുടെ ജ്ഞാനം' },
        content: {
          en: `In the tradition of Kerala's crafts, there are good carpenters, and there are great carpenters, and then there is Perunthachan — the Great Carpenter — who belongs to a category occupied by only one person.

His name means exactly what it says: the great (Perum) craftsman (Thachan). No historical record has definitively established him as a single historical individual. Like Homer, or Vyasa, his name may gather together the work and legend of a tradition — many masters, known through one name. But across Kerala, from Malabar to Travancore, the name Perunthachan means the same thing: the highest possible achievement in the art of working with wood.

**The tradition he inherited and transformed**

Kerala has one of the world's great traditions of wooden architecture. The Thachu Shastra — the science of traditional Kerala architecture — is codified in ancient Sanskrit texts but has been transmitted primarily through apprenticeship, through the relationship between master and student, father and son, in the Vishwakarma community of craftsmen.

The traditional Kerala temple, the nalukettu house, the great carved pillars and brackets and eave-boards (thattuthulam) — these represent a visual language of extraordinary complexity. The carpenters who execute them must understand not just woodworking but proportion, ritual, cosmology, and symbolism.

Perunthachan, the legend holds, understood all of this and went beyond it. He could look at a tree still standing in the forest and see the temple pillar inside it. He could feel the grain of wood and know how it would move through a century of monsoons. He could carve faces in wood that people whispered came alive at night.`,
          ml: `കേരളത്തിൻ്റെ കരകൗശല പരമ്പരയിൽ, നല്ല ആശാരിമാരുണ്ട്, മഹാ ആശാരിമാരുണ്ട്, പിന്നെ പെരുന്തച്ചൻ — ഒരാൾ മാത്രം ഉൾക്കൊള്ളുന്ന ഒരു വർഗ്ഗത്തിൽ പെടുന്ന മഹാ ആശാരി.`,
        },
        imageUrl: '/images/perunthachan.png',
      },
      {
        id: 'perunthachan-2',
        title: { en: 'The Pride and the Fall', ml: 'അഹങ്കാരവും പതനവും' },
        content: {
          en: `**The most famous story**

The Perunthachan legend that is most widely known concerns his relationship with his own son — and the terrible cost of genius meeting genius.

Perunthachan had trained his son in the craft from childhood. The boy had his father's gift — perhaps exceeded it. As the son grew into mastery, the father watched with a mixture of fierce pride and something darker: the awareness that he was being overtaken.

The story exists in several versions across Kerala. In the most common telling, the two were engaged in a great project together — the construction of a major temple. Father and son worked on different parts of the building, each concealing their portion from the other until the appointed day of inspection.

When they finally revealed their work, the son's section was, by every measure, superior.

Perunthachan stared at what his son had made. Then he said: "Come up on the scaffolding. I want to show you something."

The son climbed up. When he reached the top, his father, below, kicked away the supports.

**What the legend is about**

This is a terrible story. And it is not told with approval — the tradition does not celebrate Perunthachan for this act. What it explores is the internal landscape of genius: the pride that becomes self-protective, the fear of being superseded, the way talent can become possessive of itself.

In some versions of the story, Perunthachan immediately recognises what he has done and is consumed by it. He does not survive long after. In other versions, his punishment is internal — he can no longer work, his hands having lost their skill through the weight of what they did.

The legend of Perunthachan endures not because it flatters the craftsman but because it tells an honest truth about achievement and its shadows.`,
          ml: `**ഏറ്റവും പ്രസിദ്ധമായ കഥ**

ഏറ്റവും വ്യാപകമായി അറിയപ്പെടുന്ന പെരുന്തച്ചൻ ഐതിഹ്യം അദ്ദേഹത്തിൻ്റെ സ്വന്തം മകനുമായുള്ള ബന്ധവും പ്രതിഭ പ്രതിഭയെ കണ്ടുമുട്ടുന്നതിൻ്റെ ഭയാനകമായ വിലയും ആണ്.`,
        },
      },
      {
        id: 'perunthachan-3',
        title: { en: 'The Living Legacy', ml: 'ജീവിക്കുന്ന പൈതൃകം' },
        content: {
          en: `**What Perunthachan built**

The tradition credits Perunthachan with the design or construction of numerous temples and palaces across Kerala. The great Vadakkumnathan temple in Thrissur, the Sree Padmanabhaswamy temple in Thiruvananthapuram, several major Malabar temples — these are among the buildings associated with his name.

Whether these attributions are historically verifiable is a separate question from what they mean. A community credits its highest buildings to its greatest craftsman. The attribution is a statement about aspiration: this is how good we believe a human being can be.

**Kerala's living wood tradition**

The Thachu Shastra tradition Perunthachan represents is not dead. Kerala still has master craftsmen trained in traditional methods, still building temples and renovating heritage structures using the same techniques, the same proportional systems, the same handmade tools.

The Vishwakarma community — hereditary craftsmen — continues to transmit this knowledge through apprenticeship. Government bodies like INTACH Kerala document and support the tradition. Architecture schools increasingly recognise Thachu Shastra as a sophisticated system worthy of serious study.

**Perunthachan as symbol**

His name has entered the language. When Kerala people want to describe extraordinary craftsmanship in any field — a particularly fine piece of writing, a beautifully made film, an elegantly engineered solution — they say: "This is Perunthachan's work."

He is the standard. The impossible benchmark. The reminder that in any craft, somewhere in the tradition, someone did it so well that their name became the measure of the thing itself.

*Historical note: The Thachu Shastra texts — including the Manushyalaya Chandrika and the Thantrsamuchaya — are real documented texts that codify traditional Kerala architecture. The association of Perunthachan with specific buildings is part of oral tradition rather than historical record.*`,
          ml: `**പെരുന്തച്ചൻ നിർമ്മിച്ചത്**

കേരളത്തിലെ നിരവധി ക്ഷേത്രങ്ങളുടെയും കൊട്ടാരങ്ങളുടെയും രൂപകൽപ്പനയോ നിർമ്മാണമോ പെരുന്തച്ചൻ ചെയ്തതായി പരമ്പര കൈ ഏൽക്കുന്നു.`,
        },
      },
    ],
  },
  {
    id: 'kathakali',
    title: { en: 'Kathakali', ml: 'കഥകളി' },
    subtitle: { en: 'The Story Play of Kerala', ml: 'കേരളത്തിന്റെ കഥാനാടകം' },
    description: {
      en: 'Kathakali is Kerala’s classical dance-drama — a night-long performance where stories from the epics are told through codified hand gestures, facial expressions, music, and towering costumes. Every colour on the face is a moral language.',
      ml: 'കഥകളി കേരളത്തിന്റെ ശാസ്ത്രീയ നൃത്തനാടകം — ഇതിഹാസ കഥകൾ മുദ്രകളിലൂടെയും മുഖാഭിനയത്തിലൂടെയും സംഗീതത്തിലൂടെയും അവതരിപ്പിക്കുന്ന രാത്രി നീണ്ട കലാരൂപം.',
    },
    coverImage: '/images/kathakali.png',
    category: 'art',
    readingTime: 16,
    featured: false,
    trending: true,
    createdAt: '2024-02-10',
    tags: ['kathakali', 'dance', 'theatre', 'mudra', 'epic', 'kerala'],
    sources: [
      'Kathakali: The Art of the Non-Worldly — K.P.S. Menon',
      'Kerala Kalamandalam archives',
    ],
    glossary: [
      { term: 'Mudra', meaning: 'A codified hand gesture used in Kathakali to communicate words, ideas, and emotions.', pronunciation: 'Mu-dra' },
      { term: 'Chutti', meaning: 'The white rice-paste border applied to the face that frames expression and transforms the performer.', pronunciation: 'Chut-ti' },
      { term: 'Pacha', meaning: 'The green-faced character type, usually representing noble heroes and divine figures.', pronunciation: 'Pa-cha' },
      { term: 'Kathi', meaning: 'The knife-faced character type, marked by red patches, representing proud or flawed anti-heroes.', pronunciation: 'Ka-thi' },
    ],
    chapters: [
      {
        id: 'kathakali-1',
        title: { en: 'A Language Without Words', ml: 'വാക്കില്ലാത്ത ഭാഷ' },
        content: {
          en: `Kathakali does not speak in dialogue. It speaks through the disciplined movement of hands, eyes, cheeks, and breath. A raised eyebrow can suggest a kingdom; a trembling finger can summon a storm.

**The training**

A Kathakali performer begins young, learning control before expression. The body is made flexible, the eyes are trained to move independently, and the hands learn the grammar of mudras. Only after years of discipline does the performer step into a full story.

**The all-night stage**

Traditional performances unfold through the night, lit by the warm glow of the kalivilakku (oil lamp). The audience arrives knowing the epic — the pleasure is recognition: how will this performer embody pride, longing, or devotion tonight?`,
          ml: `കഥകളി സംഭാഷണത്തിൽ സംസാരിക്കുന്നില്ല. മുദ്രകളിലൂടെയും കണ്ണുകളിലൂടെയും മുഖഭാവങ്ങളിലൂടെയും ആണ് അത് കഥ പറയുന്നത്.`,
        },
      },
      {
        id: 'kathakali-2',
        title: { en: 'Faces of Good and Evil', ml: 'നന്മയുടെയും തിന്മയുടെയും മുഖങ്ങൾ' },
        content: {
          en: `Kathakali makeup is a moral map. Green (pacha) faces mark noble heroes. Red-and-black kathi faces mark powerful, flawed figures — not simple villains, but characters driven by pride, desire, and fate.

**The transformation**

The chutti artist builds the performer’s face into a living mask. Wide skirts, layered ornaments, and towering headpieces extend the body so the smallest gesture can be read across a temple courtyard.

*Note: Kathakali draws on Sanskrit literary traditions and local performance practice; each performance interprets the epic anew.*`,
          ml: `കഥകളി മേക്കപ്പ് ഒരു ധാർമ്മിക ഭൂപടമാണ്. പച്ച മുഖം ഉദാത്തനായ നായകനെ സൂചിപ്പിക്കുന്നു; കത്തി മുഖം അഹങ്കാരവും ശക്തിയുമുള്ള കഥാപാത്രത്തെ.`,
        },
      },
      {
        id: 'kathakali-3',
        title: { en: 'The Living Tradition', ml: 'ജീവിക്കുന്ന പാരമ്പര്യം' },
        content: {
          en: `Kathakali survives because communities keep teaching it — in training centres, village stages, and temple festivals. Institutions such as Kerala Kalamandalam have helped preserve rigorous training, while local performances keep the art close to the people who shaped it.

To watch Kathakali is to accept a slower time. Meaning gathers in the space between drumbeat and glance.`,
          ml: `കഥകളി ഇന്നും ജീവിക്കുന്നത് അത് പഠിപ്പിക്കുകയും അരങ്ങിൽ അവതരിപ്പിക്കുകയും ചെയ്യുന്നതിനാലാണ്.`,
        },
      },
    ],
  },
  {
    id: 'vishu',
    title: { en: 'Vishu', ml: 'വിഷു' },
    subtitle: { en: 'The First Sight of the New Year', ml: 'പുതുവർഷത്തിന്റെ ആദ്യക്കാഴ്ച' },
    description: {
      en: 'Vishu marks the Malayalam New Year with the Vishukkani — a carefully arranged first sight of abundance, light, and hope. It is a festival of thresholds: between seasons, years, and intentions.',
      ml: 'വിഷു മലയാള പുതുവർഷത്തെ വിഷുക്കണിയോടെ വരവേൽക്കുന്നു — സമൃദ്ധിയും വെളിച്ചവും പ്രതീക്ഷയും നിറഞ്ഞ ആദ്യക്കാഴ്ച.',
    },
    coverImage: '/images/vishu.png',
    category: 'festival',
    readingTime: 14,
    featured: false,
    trending: false,
    createdAt: '2024-03-05',
    tags: ['vishu', 'festival', 'new year', 'kani', 'kerala', 'harvest'],
    sources: [
      'Festivals of Kerala — Department of Cultural Affairs, Kerala',
      'Malayalam calendar traditions (Panchangam) and household practice',
    ],
    glossary: [
      { term: 'Vishukkani', meaning: 'The auspicious arrangement viewed first on Vishu morning — flowers, fruits, grain, a lamp, and a mirror — symbolising prosperity.', pronunciation: 'Vishu-kani' },
      { term: 'Kani Konna', meaning: 'The golden shower tree (Cassia fistula), whose yellow blossoms are closely associated with Vishu.', pronunciation: 'Kani-konna' },
      { term: 'Vishukkaineettam', meaning: 'The custom of elders giving money or gifts to younger family members as a blessing of abundance.', pronunciation: 'Vishu-kaineettam' },
      { term: 'Nilavilakku', meaning: 'A traditional Kerala brass oil lamp, lit to signify auspiciousness and clarity.', pronunciation: 'Nila-vilakku' },
    ],
    chapters: [
      {
        id: 'vishu-1',
        title: { en: 'The Arrangement of Hope', ml: 'പ്രതീക്ഷയുടെ ഒരുക്കം' },
        content: {
          en: `Vishu begins before dawn, in the quiet work of arrangement. Families prepare the Vishukkani: rice or grain for sustenance, fruits and vegetables for harvest, gold or coins for prosperity, a mirror for self-knowledge, sacred texts for wisdom, and the kani konna flower for the season’s gold.

**Why the first sight matters**

The belief is simple and tender: what you see first shapes how you enter the year. So the household chooses abundance, light, and order — not as magic, but as intention.`,
          ml: `വിഷു പുലർക്കാലത്തിന് മുമ്പേ ആരംഭിക്കുന്നു. കുടുംബങ്ങൾ വിഷുക്കണി ഒരുക്കുന്നു: ധാന്യം, പഴങ്ങൾ, പൂക്കൾ, നിലവിളക്ക്, കണ്ണാടി. വർഷത്തിലേക്ക് കടക്കുമ്പോൾ ആദ്യക്കാഴ്ച സമൃദ്ധമായിരിക്കട്ടെ എന്ന ആശയമാണിത്.`,
        },
      },
      {
        id: 'vishu-2',
        title: { en: 'Morning Light', ml: 'പ്രഭാത വെളിച്ചം' },
        content: {
          en: `On Vishu morning, elders lead children to the kani with eyes half closed, so the first full sight is the arranged blessing. Lamps glow against the early dark. Yellow kani konna blossoms seem to hold the sun before sunrise.

**Vishukkaineettam**

After the viewing comes the giving. Elders offer vishukkaineettam — a small gift of money — to younger members of the family. The gesture carries a wish: may you have enough, and may you begin generously.`,
          ml: `വിഷു പ്രഭാതത്തിൽ ആദ്യ ദർശനം കഴിഞ്ഞ് മുതിർന്നവർ വിഷുക്കൈനീട്ടം നൽകുന്നു — സമൃദ്ധിയുടെ ആശീർവാദമായി.`,
        },
      },
      {
        id: 'vishu-3',
        title: { en: 'A Festival of Thresholds', ml: 'ഉത്സവത്തിന്റെ അർത്ഥം' },
        content: {
          en: `Vishu is quieter than some of Kerala’s grander festivals, but its meaning is precise. It honours the agricultural cycle, the movement of the sun, and the human need to begin again with care.

Across Kerala, details vary — the arrangement, the foods, the prayers — yet the heart remains the same: to greet the year by looking first at what is life-giving.`,
          ml: `വിഷു സൂര്യന്റെ ചലനവും കൃഷിചക്രവും മനുഷ്യന്റെ പുതിയ തുടക്കവും സ്മരിപ്പിക്കുന്നു.`,
        },
      },
    ],
  },
  {
    id: 'kalaripayattu',
    title: { en: 'Kalaripayattu', ml: 'കളരിപ്പയറ്റ്' },
    subtitle: { en: 'The Discipline of the Kalari', ml: 'കളരിയുടെ അച്ചടക്കം' },
    description: {
      en: 'Kalaripayattu is Kerala’s martial tradition — movement, breath, healing, and weaponry taught in the kalari. It treats the body as something to be trained with patience, not force alone.',
      ml: 'കളരിപ്പയറ്റ് കേരളത്തിന്റെ ആയോധന പാരമ്പര്യമാണ് — കളരിയിൽ പഠിപ്പിക്കുന്ന ചലനം, ശ്വാസം, ചികിത്സ, ആയുധാഭ്യാസം.',
    },
    coverImage: '/images/kalaripayattu.png',
    category: 'tradition',
    readingTime: 17,
    featured: false,
    trending: true,
    createdAt: '2024-04-01',
    tags: ['kalaripayattu', 'martial art', 'kalari', 'tradition', 'kerala', 'training'],
    sources: [
      'Kalarippayattu: The Complete Guide — Philip B. Zarrilli',
      'Kerala Folklore Academy: martial and ritual traditions',
    ],
    glossary: [
      { term: 'Kalari', meaning: 'The training space — traditionally a sunken earth-floored arena — where Kalaripayattu is taught. It is both gymnasium and sacred space.', pronunciation: 'Ka-lari' },
      { term: 'Gurukkal', meaning: 'The master teacher of the kalari, responsible for physical training, discipline, and often traditional treatments.', pronunciation: 'Gu-rukkal' },
      { term: 'Meythari', meaning: 'Body-conditioning exercises that develop flexibility, strength, balance, and control.', pronunciation: 'Mey-thari' },
    ],
    chapters: [
      {
        id: 'kalaripayattu-1',
        title: { en: 'Entering the Kalari', ml: 'കളരിയിലേക്ക് പ്രവേശിക്കൽ' },
        content: {
          en: `The kalari is entered with respect. Students step in with the right foot, salute the space, the teacher, and the tradition. The ground itself matters: its packed earth teaches balance and absorbs force.

**A complete discipline**

Kalaripayattu is not only combat. It includes conditioning, empty-hand sequences, weapon training, and knowledge of the body. In many lineages, the gurukkal also understands traditional treatment — the art of harm and the art of healing held in the same hands.`,
          ml: `കളരിയിലേക്ക് പ്രവേശിക്കുന്നത് ബഹുമാനത്തോടെയാണ്. ഇത് യുദ്ധക്കല മാത്രമല്ല, ശരീരപരിശീലനവും ആയുധാഭ്യാസവും ചികിത്സാ പരിജ്ഞാനവും ഉൾപ്പെടുന്ന സമ്പൂർണ്ണ അച്ചടക്കമാണ്.`,
        },
      },
      {
        id: 'kalaripayattu-2',
        title: { en: 'Body, Weapon, Breath', ml: 'ശരീരം, ആയുധം, ശ്വാസം' },
        content: {
          en: `Training moves from the body outward. Meythari builds the foundation — kicks, leaps, stances, and flowing sequences that teach the student to occupy space with awareness. Wooden weapons follow, then metal weapons in advanced stages, each demanding precision and restraint.

**Control over force**

The tradition values mastery, not aggression. A student learns when not to strike, how to read distance, and how to recover balance.`,
          ml: `പരിശീലനം ശരീരത്തിൽ നിന്ന് ആരംഭിക്കുന്നു. മെയ്ത്താരി വഴക്കം, ബാലൻസ്, നിയന്ത്രണം എന്നിവ നൽകുന്നു. ഈ പരമ്പര ആക്രോശത്തെക്കാൾ നിയന്ത്രണത്തെ വിലമതിക്കുന്നു.`,
        },
      },
      {
        id: 'kalaripayattu-3',
        title: { en: 'Memory and Revival', ml: 'ഓർമ്മയും പുനരുജ്ജീവനവും' },
        content: {
          en: `Kalaripayattu’s history includes periods of suppression, adaptation, and revival. In the twentieth century, teachers and cultural organisations helped bring the practice back into public life — not as a relic, but as a living discipline.

Today, kalaris in Kerala and beyond teach students who come for martial skill, performance, fitness, or cultural connection. The tradition endures when practised with humility and attention.`,
          ml: `കളരിപ്പയറ്റിന് അടിച്ചമർത്തലിന്റെയും പുനരുജ്ജീവനത്തിന്റെയും ചരിത്രമുണ്ട്. ഇന്നും കളരി ശ്രദ്ധയും അച്ചടക്കവും പരിശീലിപ്പിക്കുന്ന ഒരു ഇടമാണ്.`,
        },
      },
    ],
  },
];

export const CATEGORIES = [
  { id: 'folklore', label: { en: 'Folklore', ml: 'നാടോടിക്കഥകൾ' }, icon: '🌙' },
  { id: 'mythology', label: { en: 'Mythology', ml: 'പുരാണം' }, icon: '⚡' },
  { id: 'legend', label: { en: 'Legends', ml: 'ഐതിഹ്യം' }, icon: '🏛️' },
  { id: 'ritual', label: { en: 'Rituals', ml: 'ആചാരങ്ങൾ' }, icon: '🔥' },
  { id: 'art', label: { en: 'Art Forms', ml: 'കലകൾ' }, icon: '🎭' },
  { id: 'festival', label: { en: 'Festivals', ml: 'ഉത്സവങ്ങൾ' }, icon: '🌸' },
  { id: 'tradition', label: { en: 'Traditions', ml: 'പാരമ്പര്യം' }, icon: '🪔' },
] as const;
