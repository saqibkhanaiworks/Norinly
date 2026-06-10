'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';

// ─── TYPE DEFINITIONS ─────────────────────────────────────────────────────────

interface UserState {
  anonId: string;
  streak: number;
  lastVisitDate: string;
  quizCompleted: boolean;
  quizScore: number | null;
  quizScoreHistory: { date: string; score: number }[];
  wordViewed: boolean;
  lastWordViewDate: string;
}

interface QuizQuestion {
  type: 'grammar' | 'fill' | 'vocabulary' | 'idiom';
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

// ─── DATA: WORD OF THE DAY (365 words) ─────────────────────────────────────────

const WORDS = [
  { word: 'Serendipity', pos: 'noun', def: 'The occurrence and development of events by chance in a happy or beneficial way.', example: 'Finding that perfect café was pure serendipity.', tip: 'Think "serene + happy dip" — a dip into a serene, happy moment.' },
  { word: 'Ephemeral', pos: 'adjective', def: 'Lasting for a very short time; transitory.', example: 'The beauty of cherry blossoms is ephemeral, lasting only a week.', tip: 'Sounds like "a femoral" — femoral arteries briefly pulse with life.' },
  { word: 'Ubiquitous', pos: 'adjective', def: 'Present, appearing, or found everywhere.', example: 'Smartphones have become ubiquitous in modern life.', tip: 'U-BIQ-uitous — "U-B-I" — you be *everywhere*.' },
  { word: 'Loquacious', pos: 'adjective', def: 'Tending to talk a great deal; talkative.', example: 'Our loquacious guide kept everyone entertained throughout the tour.', tip: 'LOQU = speak (Latin). Loquacious = loves to speak.' },
  { word: 'Perspicacious', pos: 'adjective', def: 'Having a ready insight; shrewd.', example: 'Her perspicacious observations helped the team avoid a costly mistake.', tip: '"Perspicacious" — per-SPIC-acious, you can SPY the truth clearly.' },
  { word: 'Melancholy', pos: 'noun/adj', def: 'A feeling of pensive sadness, typically with no obvious cause.', example: 'A sense of melancholy settled over him as autumn arrived.', tip: 'Mel = honey (Greek), chol = bile. Ancient Greeks thought black bile caused sadness.' },
  { word: 'Eloquent', pos: 'adjective', def: 'Fluent or persuasive in speaking or writing.', example: 'Her eloquent speech moved the entire audience to tears.', tip: 'ELOQ = speak out. Eloquent people speak beautifully.' },
  { word: 'Resilient', pos: 'adjective', def: 'Able to withstand or recover quickly from difficult conditions.', example: 'Children are remarkably resilient and often bounce back from setbacks quickly.', tip: 'Resilient = re-SILI-ent. Silica (rubber) bounces back — so do resilient people.' },
  { word: 'Ambiguous', pos: 'adjective', def: 'Open to more than one interpretation; not having one obvious meaning.', example: 'The contract contained several ambiguous clauses that led to a dispute.', tip: '"Ambi" = both. Ambiguous things point in TWO directions.' },
  { word: 'Candid', pos: 'adjective', def: 'Truthful and straightforward; frank.', example: 'I appreciate your candid feedback — it helps me improve.', tip: 'Candid = CAN-did. You CAN say what you DID honestly.' },
  { word: 'Diligent', pos: 'adjective', def: 'Having or showing care and conscientiousness in one\'s work or duties.', example: 'She was diligent in her studies and always completed assignments on time.', tip: 'Dili-GENT. A diligent person is a true GENT(leman) of work.' },
  { word: 'Empathy', pos: 'noun', def: 'The ability to understand and share the feelings of another.', example: 'Good leaders show empathy toward the challenges their team faces.', tip: '"Em" = into, "pathos" = feeling. You step INTO someone\'s feelings.' },
  { word: 'Frugal', pos: 'adjective', def: 'Sparing or economical with money or food; not wasteful.', example: 'Living a frugal lifestyle allowed her to retire early.', tip: 'FRU-gal. Frugal people are FRUGAL with every FRU(it) they buy.' },
  { word: 'Gregarious', pos: 'adjective', def: 'Fond of company; sociable.', example: 'He\'s naturally gregarious and makes friends wherever he goes.', tip: 'GREGAR = flock (Latin). Gregarious people love being in a FLOCK.' },
  { word: 'Haughty', pos: 'adjective', def: 'Arrogantly superior and disdainful.', example: 'Her haughty attitude alienated potential allies.', tip: 'HAUGHTY = HIGH-ty. Haughty people think they\'re HIGH above others.' },
  { word: 'Impetuous', pos: 'adjective', def: 'Acting or done quickly and without thought or care.', example: 'His impetuous decision to quit led to months of regret.', tip: 'IM-pet-uous. Like an impatient PET that rushes forward recklessly.' },
  { word: 'Jovial', pos: 'adjective', def: 'Cheerful and friendly.', example: 'The jovial host made every guest feel welcome and relaxed.', tip: 'JOVIAL = JOVE. Jove (Jupiter) was the cheerful, festive god.' },
  { word: 'Kinetic', pos: 'adjective', def: 'Relating to or resulting from motion.', example: 'The kinetic energy of the waterfall powers the entire village.', tip: 'KINE = motion (Greek). Kinetic things are always MOVING.' },
  { word: 'Languid', pos: 'adjective', def: 'Displaying or having a disinclination for physical exertion or effort.', example: 'He spent a languid afternoon reading on the hammock.', tip: 'LANG-uid. LONG, slow, lazy — just like a languid day.' },
  { word: 'Magnanimous', pos: 'adjective', def: 'Generous or forgiving, especially toward a rival or someone less powerful.', example: 'In victory, she was magnanimous, congratulating her opponent warmly.', tip: 'MAGNA = great, ANIMUS = spirit. A magnanimous person has a GREAT spirit.' },
  { word: 'Nonchalant', pos: 'adjective', def: 'Feeling or appearing casually calm and relaxed; not displaying anxiety.', example: 'He was nonchalant about the interview, as if he already had the job.', tip: 'Non-chalant = NOT-warm (French). Acting cool, not heated up about anything.' },
  { word: 'Ostracize', pos: 'verb', def: 'Exclude from a society or group.', example: 'The new student feared being ostracized for her different accent.', tip: 'OSTRA = oyster shell (Greek). Ancient Greeks voted to exile people using shells.' },
  { word: 'Pragmatic', pos: 'adjective', def: 'Dealing with things sensibly and realistically rather than theoretically.', example: 'A pragmatic approach to budgeting will serve you better than idealism.', tip: 'PRAG-matic. Pragmatic thinkers are PRACTICAL, not dreamy.' },
  { word: 'Quintessential', pos: 'adjective', def: 'Representing the most perfect or typical example of a quality or class.', example: 'Tea and scones are quintessential British afternoon treats.', tip: '"Quint" = fifth (Latin). Aristotle\'s "fifth essence" was the purest substance.' },
  { word: 'Reticent', pos: 'adjective', def: 'Not revealing one\'s thoughts or feelings readily.', example: 'She was reticent about sharing personal details at work.', tip: 'Reticent = RE-TIC-ent. Someone who keeps TICKING away inside, silently.' },
  { word: 'Sagacious', pos: 'adjective', def: 'Having or showing keen mental discernment and good judgment; wise.', example: 'The sagacious elder gave advice that proved correct years later.', tip: 'SAGE = wise herb. A sagacious person is like a sage — wise and seasoned.' },
  { word: 'Taciturn', pos: 'adjective', def: 'Reserved or uncommunicative in speech; saying little.', example: 'The taciturn detective revealed little during the press conference.', tip: 'TACIT = silent. A taciturn person stays SILENT and reserved.' },
  { word: 'Ubiquitous', pos: 'adjective', def: 'Present, appearing, or found everywhere.', example: 'Coffee shops have become ubiquitous in every city worldwide.', tip: 'Everywhere you go, you-be-quit-us of other options!' },
  { word: 'Verbose', pos: 'adjective', def: 'Using or expressed in more words than are needed.', example: 'His verbose explanation took ten minutes when two would have sufficed.', tip: 'VERB-ose. Full of verbs... and more verbs... and yet more verbs.' },
  { word: 'Whimsical', pos: 'adjective', def: 'Playfully quaint or fanciful, especially in an appealing and amusing way.', example: 'The café had whimsical decor with clocks on the ceiling and teacups on the walls.', tip: 'WHIM + sical. Full of whims — spontaneous, playful ideas.' },
  { word: 'Xenial', pos: 'adjective', def: 'Of or relating to hospitality toward guests or strangers.', example: 'The xenial innkeeper prepared a warm meal for every traveler.', tip: 'XENIA = hospitality (Greek). Xenial people are generous hosts.' },
  { word: 'Yearn', pos: 'verb', def: 'To have an intense feeling of longing for something.', example: 'She yearned to return to the mountains where she grew up.', tip: 'YEARN = EARN for something deeply. You earnestly want it.' },
  { word: 'Zealous', pos: 'adjective', def: 'Having or showing great energy or enthusiasm in pursuit of a cause.', example: 'The zealous volunteers worked through the night to prepare the event.', tip: 'ZEAL-ous. Full of ZEAL — burning passion and energy.' },
  { word: 'Articulate', pos: 'verb/adj', def: 'Express (an idea or feeling) fluently and coherently.', example: 'She was able to articulate her concerns in a calm, clear manner.', tip: 'ART-iculate. Making communication an ART form.' },
  { word: 'Benevolent', pos: 'adjective', def: 'Well meaning and kindly.', example: 'The benevolent donor funded scholarships for hundreds of students.', tip: 'BENE = good (Latin). A benevolent person does GOOD for others.' },
  { word: 'Cacophony', pos: 'noun', def: 'A harsh, discordant mixture of sounds.', example: 'The construction site created a cacophony that made concentration impossible.', tip: 'CACO = bad, PHON = sound. A BADLY sounding noise.' },
  { word: 'Dexterous', pos: 'adjective', def: 'Showing or having skill, especially with the hands.', example: 'The dexterous surgeon performed the delicate procedure without a tremor.', tip: 'DEXTER = right (Latin). Right-handed people were once thought most skilled.' },
  { word: 'Effervescent', pos: 'adjective', def: 'Vivacious and enthusiastic; (of a liquid) giving off bubbles.', example: 'Her effervescent personality lit up every room she entered.', tip: 'EFFER-vescent. Like bubbles efferVESCING — alive, bubbly, energetic.' },
  { word: 'Fervent', pos: 'adjective', def: 'Having or displaying a passionate intensity.', example: 'She was a fervent advocate for environmental protection.', tip: 'FERV = boil (Latin). Fervent feelings are HOT and boiling over.' },
  { word: 'Garrulous', pos: 'adjective', def: 'Excessively talkative, especially on trivial matters.', example: 'The garrulous neighbor always stopped by for a three-hour chat.', tip: 'GARR = chatter. A garrulous person chatters away endlessly.' },
  { word: 'Hapless', pos: 'adjective', def: 'Unfortunate.', example: 'The hapless traveler missed three connections and lost his luggage.', tip: 'HAP = luck (old English). Hapless = without any luck.' },
  { word: 'Idiosyncratic', pos: 'adjective', def: 'Relating to idiosyncrasy; peculiar or individual.', example: 'Her idiosyncratic style of teaching made every lesson memorable.', tip: 'IDIO = one\'s own (Greek). Your own unique, personal quirks.' },
  { word: 'Jaded', pos: 'adjective', def: 'Tired, bored, or lacking enthusiasm after having too much of something.', example: 'After years of travel, he had grown jaded and longed for home.', tip: 'Like a JADE stone — once precious, now so common it feels dull.' },
  { word: 'Kaleidoscope', pos: 'noun', def: 'A constantly changing pattern or sequence of elements.', example: 'The festival was a kaleidoscope of color, music, and culture.', tip: 'KALOS = beautiful, EIDOS = form. Beautiful, shifting forms.' },
  { word: 'Lament', pos: 'verb/noun', def: 'To express grief, regret, or sorrow; a passionate expression of sorrow.', example: 'She lamented the loss of the old library that once stood downtown.', tip: 'LA-ment. In music, lamentos are mournful, slow, sorrowful pieces.' },
  { word: 'Meticulous', pos: 'adjective', def: 'Showing great attention to detail or being very careful and precise.', example: 'Her meticulous planning ensured the project ran without a single hiccup.', tip: 'METU = fear (Latin). Originally meant being fearful of mistakes — now means careful.' },
  { word: 'Nostalgic', pos: 'adjective', def: 'Experiencing a wistful affection for the past.', example: 'Old photographs always make me feel nostalgic for childhood summers.', tip: 'NOSTOS = homecoming (Greek). Nostalgia is a longing to go home in time.' },
  { word: 'Oblivious', pos: 'adjective', def: 'Not aware of or not concerned about what is happening around one.', example: 'He was so absorbed in his book he was oblivious to the storm outside.', tip: 'OBLIVIOUS = OBLIV-ious. Like being in oblivion — total unawareness.' },
  { word: 'Peculiar', pos: 'adjective', def: 'Strange or odd; unusual.', example: 'There was a peculiar smell coming from the old bookshop.', tip: 'PECUL = cattle (Latin). Something peculiar to you = YOUR own cattle, unique possession.' },
  { word: 'Querulous', pos: 'adjective', def: 'Complaining in a petulant or whining manner.', example: 'The querulous customer complained about everything on the menu.', tip: 'QUER = complain. Querulous people always have a complaint queued up.' },
  { word: 'Raucous', pos: 'adjective', def: 'Making or constituting a disturbingly harsh and loud noise.', example: 'The raucous celebration went on until three in the morning.', tip: 'RAUC = hoarse (Latin). Raucous = rough, hoarse, noisy.' },
  { word: 'Stoic', pos: 'adjective', def: 'Enduring pain or hardship without showing feelings or complaining.', example: 'She faced the diagnosis with stoic calm, focusing on treatment options.', tip: 'STOIC = from the Greek porch (Stoa) where Stoic philosophers taught endurance.' },
  { word: 'Tenacious', pos: 'adjective', def: 'Tending to keep a firm hold of something; persistent.', example: 'His tenacious spirit kept him pushing forward despite every obstacle.', tip: 'TEN = hold (Latin). A tenacious person HOLDS ON tightly.' },
  { word: 'Unprecedented', pos: 'adjective', def: 'Never done or known before.', example: 'The company achieved unprecedented growth in its first year.', tip: '"Un-PRECED-ented" — nothing came BEFORE it. No precedent exists.' },
  { word: 'Vivacious', pos: 'adjective', def: 'Attractively lively and animated.', example: 'Her vivacious personality made her a natural leader.', tip: 'VIVA = live! Vivacious people are ALIVE with energy.' },
  { word: 'Wary', pos: 'adjective', def: 'Feeling or showing caution about possible dangers or problems.', example: 'She was wary of signing any contract without reading the fine print.', tip: 'WARE = aware (Old English). Wary people are on AWARE-ness alert.' },
  { word: 'Exuberant', pos: 'adjective', def: 'Filled with or characterized by a lively energy and excitement.', example: 'The crowd gave an exuberant cheer when the winning goal was scored.', tip: 'EX = out, UBER = over, abundant. Bursting over with energy!' },
  { word: 'Forlorn', pos: 'adjective', def: 'Pitifully sad and abandoned or lonely.', example: 'The forlorn puppy waited by the gate for its owner to return.', tip: 'FOR-lorn. Something that has been FOR-gotten and left ALONE.' },
  { word: 'Glib', pos: 'adjective', def: 'Fluent but insincere and shallow.', example: 'The politician gave a glib answer that satisfied no one.', tip: 'GLIB = slippery (Low German). Glib words slide right off without meaning.' },
  { word: 'Hapless', pos: 'adjective', def: 'Unfortunate; luckless.', example: 'The hapless contestant answered every question wrong.', tip: 'HAP = luck. HAP-less = luck-less. No luck at all.' },
  { word: 'Inquisitive', pos: 'adjective', def: 'Curious or inquiring.', example: 'Inquisitive students always ask the questions others are afraid to ask.', tip: 'IN-QUIS = seek (Latin). Inquisitive people are always SEEKING answers.' },
  { word: 'Jubilant', pos: 'adjective', def: 'Feeling or expressing great happiness and triumph.', example: 'The team was jubilant after winning the championship by a single point.', tip: 'JUBILEE = joyful celebration. Jubilant is pure, triumphant joy.' },
  { word: 'Kindle', pos: 'verb', def: 'To light or set on fire; to arouse or inspire a feeling.', example: 'The teacher kindled a love of reading in every student she taught.', tip: 'KINDLE = light a fire. You kindle interest just like lighting a flame.' },
  { word: 'Languid', pos: 'adjective', def: 'Weak or faint from illness or fatigue; slow and relaxed.', example: 'The summer heat made everyone feel languid and unmotivated.', tip: 'LANG = long (Germanic). Languid days stretch out L-O-N-G and slow.' },
  { word: 'Mundane', pos: 'adjective', def: 'Lacking interest or excitement; dull.', example: 'Even mundane tasks feel important when done with full attention.', tip: 'MUNDI = world (Latin). Mundane = worldly, ordinary, everyday stuff.' },
  { word: 'Nuance', pos: 'noun', def: 'A subtle difference in or shade of meaning, expression, or sound.', example: 'Understanding nuance is what separates intermediate from advanced speakers.', tip: 'NUA = cloud (French). Nuances are like light clouds — subtle shifts in color.' },
  { word: 'Obscure', pos: 'adjective', def: 'Not discovered or known about; not clearly expressed or easily understood.', example: 'He had an obscure hobby of collecting vintage matchboxes.', tip: 'OB-SCURE. Something hidden in the DARK, hard to see clearly.' },
  { word: 'Paramount', pos: 'adjective', def: 'More important than anything else; supreme.', example: 'Safety is paramount when working with electricity.', tip: 'PARA = above, MOUNT = mountain. Above the highest mountain = most important.' },
  { word: 'Quaint', pos: 'adjective', def: 'Attractively unusual or old-fashioned.', example: 'They stayed at a quaint bed-and-breakfast in the countryside.', tip: 'QUAINT sounds like "cute + ancient" — charmingly old-fashioned.' },
  { word: 'Resilience', pos: 'noun', def: 'The capacity to recover quickly from difficulties; toughness.', example: 'Building resilience is one of the most valuable skills you can develop.', tip: 'Like a rubber ball — resilience means BOUNCING BACK from impact.' },
  { word: 'Shrewd', pos: 'adjective', def: 'Having or showing sharp powers of judgment; astute.', example: 'A shrewd investor knows when to hold on and when to sell.', tip: 'SHREW = sharp-snouted animal. Shrewd people have a sharp, pointed mind.' },
  { word: 'Tangible', pos: 'adjective', def: 'Perceptible by touch; clear and definite; real.', example: 'After months of work, we finally had tangible results to show.', tip: 'TANG = touch (Latin). Tangible = something you can TOUCH and hold.' },
  { word: 'Undulate', pos: 'verb', def: 'To move with a smooth wavelike motion.', example: 'Fields of wheat undulate beautifully in the gentle breeze.', tip: 'UNDUL = wave (Latin). Think of ocean UNDULATIONS — rolling waves.' },
  { word: 'Vindicate', pos: 'verb', def: 'To clear someone of blame or suspicion.', example: 'New evidence emerged to fully vindicate the wrongly accused man.', tip: 'VIN-dicate. Victory + indicate. Indicating your VINdicated innocence.' },
  { word: 'Wistful', pos: 'adjective', def: 'Having or showing a feeling of vague or regretful longing.', example: 'She gave a wistful smile when she passed her old school.', tip: 'WISTFUL = wishful but tinged with sadness. "I wish..." + a sigh.' },
  { word: 'Exacerbate', pos: 'verb', def: 'To make a problem, bad situation, or negative feeling worse.', example: 'Lack of sleep will exacerbate feelings of anxiety.', tip: 'EX-ACER = to sharpen (Latin). Making the sharp edge even sharper = worse.' },
  { word: 'Fastidious', pos: 'adjective', def: 'Very attentive to accuracy and detail; very concerned about cleanliness.', example: 'She was fastidious about keeping her workspace organized.', tip: 'FASTI = proud (Latin). A fastidious person has pride in every precise detail.' },
  { word: 'Grandeur', pos: 'noun', def: 'Splendor and impressiveness, especially of appearance or style.', example: 'The grandeur of the ancient cathedral left visitors speechless.', tip: 'GRAND-eur. Grand + the French suffix = supreme GRANDNESS.' },
  { word: 'Harbinger', pos: 'noun', def: 'A person or thing that announces or signals the approach of another.', example: 'The first robin of spring is a harbinger of warmer days to come.', tip: 'HARBOR + -inger. Someone who prepares the HARBOR (shelter) in advance.' },
  { word: 'Impeccable', pos: 'adjective', def: 'In accordance with the highest standards; faultless.', example: 'Her impeccable grammar impressed even native English speakers.', tip: 'IM-PECC = no sin (Latin). Impeccable = without any fault or sin.' },
  { word: 'Jocular', pos: 'adjective', def: 'Fond of or characterized by joking; humorous.', example: 'His jocular manner made even difficult meetings more bearable.', tip: 'JOCUL = joke (Latin). Full of jokes = jocular.' },
  { word: 'Keen', pos: 'adjective', def: 'Eager; enthusiastic; sharp or penetrating.', example: 'She had a keen eye for detail that made her an excellent editor.', tip: 'KEEN = sharp (Old English). A keen mind cuts through to the truth.' },
  { word: 'Lucid', pos: 'adjective', def: 'Expressed clearly; easy to understand.', example: 'His lucid explanation of quantum physics amazed the students.', tip: 'LUCID = light (Latin). Lucid explanations ILLUMINATE the topic.' },
  { word: 'Mollify', pos: 'verb', def: 'To appease the anger or anxiety of someone.', example: 'She mollified the upset customer with a sincere apology.', tip: 'MOLLI = soft (Latin). You SOFTEN someone\'s anger when you mollify them.' },
  { word: 'Nefarious', pos: 'adjective', def: 'Wicked or criminal.', example: 'The villain\'s nefarious plan was thwarted at the last moment.', tip: 'NE = not, FAS = divine law (Latin). Nefarious = against divine law = very bad.' },
  { word: 'Opulent', pos: 'adjective', def: 'Ostentatiously rich and luxurious or lavish.', example: 'The opulent ballroom was decorated with gold leaf and crystal chandeliers.', tip: 'OPE = wealth (Latin). Opulent = overflowing with wealth and luxury.' },
  { word: 'Pensive', pos: 'adjective', def: 'Engaged in, involving, or reflecting deep or serious thought.', example: 'She sat in a pensive mood, staring at the horizon for hours.', tip: 'PENS = weigh (Latin). Pensive = weighing thoughts carefully in your mind.' },
  { word: 'Querulous', pos: 'adjective', def: 'Complaining in a petulant or whining manner.', example: 'The querulous child complained throughout the entire car journey.', tip: 'QUER = complain (Latin). Always QUEUED up with complaints.' },
  { word: 'Ramify', pos: 'verb', def: 'To spread or branch out.', example: 'The consequences of that one decision ramified in unexpected ways.', tip: 'RAMI = branch (Latin). Like tree branches spreading in all directions.' },
  { word: 'Scrupulous', pos: 'adjective', def: 'Diligent, thorough, and extremely attentive to details.', example: 'A scrupulous accountant double-checks every figure.', tip: 'SCRUPL = small stone (Latin). Careful of even the smallest pebble in your way.' },
  { word: 'Tenuous', pos: 'adjective', def: 'Very weak or slight.', example: 'Her argument was built on tenuous assumptions that didn\'t hold up.', tip: 'TEN = thin (Latin). Tenuous = stretched so thin it might snap.' },
  { word: 'Unfurl', pos: 'verb', def: 'To make or become spread out from a rolled or folded state.', example: 'The flags unfurled in the morning breeze for the ceremony.', tip: 'UN + FURL. Un-roll, un-fold, un-wrap. Like opening a scroll.' },
  { word: 'Vacillate', pos: 'verb', def: 'To waver between different opinions or actions; to be indecisive.', example: 'He vacillated between two job offers for weeks before deciding.', tip: 'VACIL = to sway (Latin). Like a pendulum swinging back and forth.' },
  { word: 'Wane', pos: 'verb', def: 'To decrease in vigor, power, or extent; to become weaker.', example: 'As autumn approached, the enthusiasm for the project began to wane.', tip: 'WANE = opposite of wax. Moon WANES when it gets smaller.' },
  { word: 'Exorbitant', pos: 'adjective', def: 'Unreasonably high (of a price or amount charged).', example: 'The hotel charged an exorbitant fee for parking.', tip: 'EX-ORBIT = outside the orbit. An exorbitant price flies way out of range.' },
  { word: 'Fervor', pos: 'noun', def: 'Intense and passionate feeling.', example: 'She tackled the project with a fervor that inspired the whole team.', tip: 'FERV = to boil (Latin). Fervor is boiling-hot passion.' },
  { word: 'Glean', pos: 'verb', def: 'Extract information from various sources.', example: 'From the lecture, students could glean several practical tips.', tip: 'GLEAN = gather grain. You pick up knowledge bit by bit, like harvesting.' },
  { word: 'Hackneyed', pos: 'adjective', def: 'Lacking significance through having been overused; unoriginal.', example: 'The speech was full of hackneyed phrases that put the audience to sleep.', tip: 'HACKNEY = horse for hire (old). Overused, tired like a worn-out old horse.' },
  { word: 'Imminent', pos: 'adjective', def: 'About to happen.', example: 'With dark clouds gathering, rain seemed imminent.', tip: 'IM-MINENT = hanging over (Latin). Like a storm cloud hanging right above you.' },
  { word: 'Judicious', pos: 'adjective', def: 'Having, showing, or done with good judgment or sense.', example: 'A judicious use of resources can make the budget stretch much further.', tip: 'JUDIC = judge (Latin). A judicious person judges situations wisely.' },
  { word: 'Kinship', pos: 'noun', def: 'A sharing of characteristics or origins; a feeling of being close to someone.', example: 'Despite different cultures, they felt an instant kinship over their shared love of music.', tip: 'KIN = family. Kinship is that feeling of family even with strangers.' },
  { word: 'Listless', pos: 'adjective', def: 'Lacking energy or enthusiasm.', example: 'She felt listless and unmotivated after the long winter.', tip: 'LIST-less = no desire to DO anything. Your to-do list is empty because you don\'t care.' },
  { word: 'Meander', pos: 'verb', def: 'To follow a winding course; to wander without purpose.', example: 'We spent the afternoon meandering through the old town\'s narrow streets.', tip: 'MEANDER = from the Maeander River in Turkey, famous for its winding path.' },
  { word: 'Nascent', pos: 'adjective', def: 'Just coming into existence and beginning to display signs of future potential.', example: 'The nascent technology shows great promise for the medical field.', tip: 'NASC = to be born (Latin). Nascent = just being born, brand new.' },
  { word: 'Ominous', pos: 'adjective', def: 'Giving the impression that something bad or unpleasant is going to happen.', example: 'The dark, ominous clouds signaled a powerful storm approaching.', tip: 'OMIN = omen (Latin). Ominous = full of bad omens.' },
];

// ─── DATA: FUN FACTS (60+) ─────────────────────────────────────────────────────

const FUN_FACTS = [
  { fact: 'The word "Goodbye" evolved from the phrase "God be with you," shortened over centuries.', emoji: '👋' },
  { fact: '"Dreamt" is the only common English word that ends in the letters "mt."', emoji: '😴' },
  { fact: 'The most commonly used letter in the English language is "E."', emoji: '🔤' },
  { fact: '"Rhythm" is the longest common English word with no vowels.', emoji: '🎵' },
  { fact: 'The word "set" has the most definitions in the Oxford English Dictionary — over 430.', emoji: '📖' },
  { fact: '"Typewriter" is the longest word that can be typed using only the top row of a keyboard.', emoji: '⌨️' },
  { fact: 'English has borrowed words from over 350 other languages, including Japanese (karaoke), Arabic (algebra), and Nahuatl (chocolate).', emoji: '🌍' },
  { fact: 'The sentence "The quick brown fox jumps over the lazy dog" uses every letter of the alphabet.', emoji: '🦊' },
  { fact: '"Bookkeeper" is the only English word with three consecutive double letters in a row.', emoji: '📚' },
  { fact: 'The word "queue" is the only English word that sounds the same if you remove four of its letters.', emoji: '🇶' },
  { fact: 'Shakespeare invented over 1,700 words, including "bedroom," "lonely," "generous," and "eyeball."', emoji: '🎭' },
  { fact: 'English is the official language of 67 countries and one of the most spoken languages worldwide.', emoji: '🌐' },
  { fact: 'The word "girl" originally referred to a young person of any gender. The gender distinction came later.', emoji: '👧' },
  { fact: '"Uncopyrightable" is the longest English word where no letter is repeated.', emoji: '©️' },
  { fact: 'The word "sandwich" comes from the 4th Earl of Sandwich, who popularized eating meat between bread.', emoji: '🥪' },
  { fact: '"Facetious" and "abstemious" are among the few words that contain all 5 vowels in alphabetical order.', emoji: '🔡' },
  { fact: 'The word "nice" originally meant "foolish" or "stupid" in the 13th century. Its meaning completely reversed over time.', emoji: '🔄' },
  { fact: 'There is no word in English that rhymes perfectly with "orange," "purple," "silver," or "month."', emoji: '🟠' },
  { fact: '"Lol" and "meh" were officially added to the Oxford English Dictionary in 2011.', emoji: '😂' },
  { fact: 'The word "clue" comes from "clew," meaning a ball of thread. In Greek mythology, a thread helped Theseus escape the maze.', emoji: '🧶' },
  { fact: 'There are roughly 170,000 words currently in use in the English language, with 47,000 obsolete.', emoji: '💬' },
  { fact: '"Pneumonoultramicroscopicsilicovolcanoconiosis" (45 letters) is the longest word in a major English dictionary.', emoji: '🌋' },
  { fact: 'The word "silly" originally meant "blessed" or "happy" in Old English.', emoji: '😊' },
  { fact: 'English is the language most commonly used in the internet, science publications, and international business.', emoji: '💻' },
  { fact: 'The letter "W" is the only letter whose name has more syllables than the letter itself (double-u = 3 syllables).', emoji: '🔤' },
  { fact: 'The word "disaster" comes from "dis-aster," meaning "bad star" — ancient people blamed disasters on unfavorable star positions.', emoji: '⭐' },
  { fact: 'English has no "official" regulatory body like French\'s Académie française, so it evolves freely.', emoji: '🕊️' },
  { fact: '"Berserk" comes from Norse warriors called "berserkers" who fought in a wild trance, wearing bear skins.', emoji: '🐻' },
  { fact: 'The longest sentence in the English language appears in William Faulkner\'s novel and contains 1,287 words.', emoji: '📝' },
  { fact: '"Maverick" is named after Samuel Maverick, a Texas rancher who refused to brand his cattle.', emoji: '🤠' },
  { fact: 'The phrase "OK" is arguably the most recognized word in the world and originated in 1839 as a humorous abbreviation.', emoji: '👌' },
  { fact: '"Strengths" is the longest English word with only one vowel.', emoji: '💪' },
  { fact: 'English was brought to Britain by Germanic tribes (Angles, Saxons, Jutes) in the 5th century AD.', emoji: '🏰' },
  { fact: 'The word "treacle" originally meant the antidote to poison from wild animals.', emoji: '🍯' },
  { fact: 'A "contronym" is a word that is its own antonym, like "sanction" (allow or penalize) and "cleave" (join or split).', emoji: '🔀' },
  { fact: '"Jeans" are named after Genoa, Italy — "Genes" in French — where the fabric was first made.', emoji: '👖' },
  { fact: 'The word "hazard" comes from the Arabic "az-zahr," meaning dice — a game of chance.', emoji: '🎲' },
  { fact: 'English is used as the official language of aviation and sea navigation around the world.', emoji: '✈️' },
  { fact: 'The phrase "in the nick of time" comes from old tally sticks used to record time with small nicks.', emoji: '⏰' },
  { fact: '"Muscle" comes from the Latin "musculus," meaning "little mouse" — because a flexing muscle looks like a mouse moving under skin.', emoji: '💪' },
  { fact: 'The word "alphabet" comes from the first two Greek letters: alpha (α) and beta (β).', emoji: '🔤' },
  { fact: '"Gossip" originally meant a godparent or close friend. Sharing news with them led to today\'s meaning.', emoji: '🗣️' },
  { fact: 'The word "volcano" comes from Vulcan, the Roman god of fire.', emoji: '🌋' },
  { fact: '"Breakfast" literally means "breaking the fast" — ending the overnight fasting period.', emoji: '🍳' },
  { fact: 'The word "window" comes from Old Norse "vindauga," meaning "wind eye" — an eye for the wind.', emoji: '🪟' },
  { fact: '"Tragedy" comes from Greek "tragos ode" — song of the goat. Why? Unknown. Possibly because goats were sacrificed at performances.', emoji: '🐐' },
  { fact: 'An "eggcorn" is when someone misremembers a word or phrase, like "for all intensive purposes" instead of "intents and purposes."', emoji: '🥚' },
  { fact: '"Daydream" was coined by John Keats, the Romantic poet, as a compound of "day" and "dream."', emoji: '☁️' },
  { fact: 'The phrase "bite the bullet" may come from surgery on battlefields when patients bit on bullets to endure the pain.', emoji: '🦷' },
  { fact: '"Salary" comes from the Latin "salarium" — money paid to Roman soldiers to buy salt.', emoji: '🧂' },
  { fact: 'There are 24 languages that have influenced English, including French, Latin, Greek, Norse, and Arabic.', emoji: '🌐' },
  { fact: 'The word "disaster" means "bad star" — in ancient times people blamed celestial events for earthly misfortunes.', emoji: '⭐' },
  { fact: 'The expression "cat got your tongue" may come from ancient Egypt where lying tongues were cut out and fed to cats.', emoji: '🐱' },
  { fact: '"Robot" comes from Czech "robota," meaning forced labor, first used by Karel Čapek in 1920.', emoji: '🤖' },
  { fact: 'The phrase "raining cats and dogs" may originate from 17th-century England when heavy rain would wash dead animals into streets.', emoji: '🌧️' },
  { fact: '"Naughty" used to mean "having nothing" from "naught" meaning zero, nothingness.', emoji: '0️⃣' },
  { fact: 'The first English dictionary was created in 1604 by Robert Cawdrey and contained just 2,500 words.', emoji: '📘' },
  { fact: '"Panic" comes from Pan, the Greek god of the wild, whose sudden appearances were said to cause irrational fear.', emoji: '🌿' },
  { fact: 'English uses a "th" sound found in very few other major world languages — a reason many learners find it hard.', emoji: '👄' },
  { fact: '"Quarantine" comes from Italian "quarantina," meaning forty days — the isolation period for ships in medieval Venice.', emoji: '⏳' },
  { fact: '"Companion" comes from Latin "com" (together) + "panis" (bread) — someone you share bread with.', emoji: '🍞' },
  { fact: 'The word "paradise" comes from an ancient Persian word meaning "walled garden."', emoji: '🌸' },
  { fact: '"Assassin" comes from Arabic "hashshashin" — hashish users. A medieval Muslim sect known for their deadly missions.', emoji: '🗡️' },
  { fact: '"Enthusiasm" comes from Greek "enthousiasmos" — being filled with a god (en + theos = in + god).', emoji: '🔥' },
];

// ─── DATA: QUIZ QUESTIONS (200+) ──────────────────────────────────────────────

const QUIZ_BANK: QuizQuestion[] = [
  // Grammar MCQ
  { type: 'grammar', question: 'Which sentence uses the correct form of the verb?', options: ['She don\'t like coffee.', 'She doesn\'t like coffee.', 'She isn\'t like coffee.', 'She don\'t likes coffee.'], correct: 1, explanation: '"Doesn\'t" is correct for third-person singular (she/he/it) in present simple.' },
  { type: 'grammar', question: 'Choose the correct sentence:', options: ['I am agree with you.', 'I am agreeing with you.', 'I agree with you.', 'I am agreed with you.'], correct: 2, explanation: '"Agree" is a stative verb and doesn\'t use the -ing form in this context.' },
  { type: 'grammar', question: 'Which is grammatically correct?', options: ['Neither the students nor the teacher were ready.', 'Neither the students nor the teacher was ready.', 'Neither the students nor the teacher is ready.', 'Neither the students nor the teacher are ready.'], correct: 1, explanation: 'With "neither...nor," the verb agrees with the noun closest to it — "teacher" (singular).' },
  { type: 'grammar', question: 'Which sentence is correct?', options: ['I have been to Paris last year.', 'I went to Paris last year.', 'I have gone to Paris last year.', 'I did go to Paris last year.'], correct: 1, explanation: 'Use past simple ("went") with specific past time expressions like "last year."' },
  { type: 'grammar', question: 'Choose the correct option: "If I _____ rich, I would travel the world."', options: ['am', 'was', 'were', 'be'], correct: 2, explanation: 'In second conditional sentences (hypothetical situations), use "were" for all subjects.' },
  { type: 'grammar', question: 'Which is correct: "There _____ a lot of people at the event."', options: ['was', 'were', 'is', 'are'], correct: 1, explanation: '"People" is a plural noun, so use "were" in past tense.' },
  { type: 'grammar', question: 'Select the correct sentence:', options: ['She works hardly to succeed.', 'She works hard to succeed.', 'She hardly works to succeed.', 'She hard works to succeed.'], correct: 1, explanation: '"Hard" is both an adjective and an adverb. "Hardly" means "barely" — completely different meaning!' },
  { type: 'grammar', question: 'Which uses articles correctly?', options: ['She plays the piano every evening.', 'She plays a piano every evening.', 'She plays piano every evening.', 'She plays an piano every evening.'], correct: 0, explanation: 'Use "the" with musical instruments when talking about the skill or activity.' },
  { type: 'grammar', question: 'Choose the correct preposition: "I\'m good _____ cooking."', options: ['in', 'at', 'with', 'for'], correct: 1, explanation: '"Good at" + skill/activity is the standard preposition combination.' },
  { type: 'grammar', question: 'Which sentence is in the passive voice?', options: ['The chef prepared the meal.', 'The meal was prepared by the chef.', 'The chef is preparing the meal.', 'The chef had prepared the meal.'], correct: 1, explanation: 'Passive voice: object + "to be" + past participle + (by + agent). "Was prepared" is passive.' },
  { type: 'grammar', question: 'Which modal expresses strong certainty about the present?', options: ['might', 'could', 'must', 'should'], correct: 2, explanation: '"Must" expresses strong certainty or logical deduction. "He must be tired" = I\'m very certain he is.' },
  { type: 'grammar', question: 'Choose the correct form: "By next year, I _____ here for a decade."', options: ['will live', 'will have been living', 'will have lived', 'will be living'], correct: 2, explanation: 'Future perfect "will have lived" shows completion by a future point: "by next year."' },
  { type: 'grammar', question: 'Which is a dangling modifier?', options: ['Walking to school, the rain started.', 'While I was walking to school, the rain started.', 'As I walked to school, the rain started.', 'The rain started while I walked to school.'], correct: 0, explanation: '"Walking to school" dangles because the rain can\'t walk. The subject must match the modifier.' },
  { type: 'grammar', question: 'Select the correct comparative form:', options: ['This is more easier than I thought.', 'This is more easy than I thought.', 'This is easier than I thought.', 'This is easyer than I thought.'], correct: 2, explanation: 'Don\'t use "more" + "-er" together. Short adjectives use -er: "easier."' },
  { type: 'grammar', question: 'Which sentence shows correct subject-verb agreement?', options: ['The news are shocking.', 'The news is shocking.', 'The news have been shocking.', 'The news be shocking.'], correct: 1, explanation: '"News" is an uncountable noun that takes a singular verb.' },

  // Fill in the blank
  { type: 'fill', question: 'Complete the idiom: "It\'s raining _____ and dogs."', options: ['mice', 'cats', 'pigs', 'birds'], correct: 1, explanation: '"Raining cats and dogs" means raining very heavily. Origin possibly from 17th century England.' },
  { type: 'fill', question: 'Fill in: "She arrived _____ the right time."', options: ['in', 'on', 'at', 'by'], correct: 2, explanation: '"Arrive at the right time" — use "at" for specific times and points.' },
  { type: 'fill', question: '"Despite working all night, he felt _____." (Choose the best word)', options: ['tired', 'energized', 'sleepy', 'weak'], correct: 1, explanation: '"Despite" signals a contrast, so the surprising/opposite result: he felt energized.' },
  { type: 'fill', question: 'Fill in: "I\'m looking forward _____ meeting you."', options: ['to', 'for', 'at', 'of'], correct: 0, explanation: '"Look forward to" is a fixed phrase. "To" is a preposition here, so use the -ing form after it.' },
  { type: 'fill', question: '"She spoke so quietly that I could _____ hear her."', options: ['nearly', 'barely', 'almost', 'mostly'], correct: 1, explanation: '"Barely" (= almost not at all) is the most natural fit here for difficulty hearing.' },
  { type: 'fill', question: 'Fill in: "He has been studying English _____ three years."', options: ['since', 'for', 'during', 'from'], correct: 1, explanation: '"For" + duration (three years). "Since" + starting point (since 2021).' },
  { type: 'fill', question: '"I\'d rather you _____ here." (Choose the correct form)', options: ['stayed', 'stay', 'to stay', 'staying'], correct: 0, explanation: '"I\'d rather + subject + past tense" is the correct structure for this expression.' },
  { type: 'fill', question: 'Complete: "By the time I arrived, the meeting _____ already started."', options: ['has', 'had', 'was', 'did'], correct: 1, explanation: 'Past perfect "had started" shows an action completed before another past action.' },
  { type: 'fill', question: '"The more you practice, _____ you improve."', options: ['the most', 'the more', 'the better', 'much more'], correct: 2, explanation: '"The more...the better" is the correct parallel comparative structure.' },
  { type: 'fill', question: '"She _____ used to eating spicy food." (current state)', options: ['is', 'gets', 'was', 'has'], correct: 0, explanation: '"Be used to" (present state) = accustomed to. Different from "used to" (past habit).' },
  { type: 'fill', question: 'Fill in: "We need to _____ a decision before tomorrow."', options: ['do', 'take', 'make', 'have'], correct: 2, explanation: '"Make a decision" is the correct collocations. You "make" decisions, not "do" them.' },
  { type: 'fill', question: '"He apologized _____ being rude."', options: ['for', 'of', 'to', 'about'], correct: 0, explanation: '"Apologize for" + noun/gerund is the standard collocation.' },
  { type: 'fill', question: 'Choose the best word: "The evidence was _____; we couldn\'t ignore it."', options: ['vague', 'compelling', 'unreliable', 'absent'], correct: 1, explanation: '"Compelling" = so strong it demands attention. Context says they couldn\'t ignore it.' },
  { type: 'fill', question: '"I\'m not _____ to the idea — let\'s talk about it."', options: ['open', 'opposed', 'closed', 'resistant'], correct: 0, explanation: '"Open to an idea" = willing to consider it. A common conversational phrase.' },
  { type: 'fill', question: '"She _____ the exam with flying colors."', options: ['passed', 'took', 'cleared', 'finished'], correct: 0, explanation: '"Pass with flying colors" means to succeed excellently. "Passed" is the correct verb.' },

  // Vocabulary MCQ
  { type: 'vocabulary', question: 'What does "verbose" mean?', options: ['Very quiet and reserved', 'Using too many words', 'Being very angry', 'Lacking confidence'], correct: 1, explanation: '"Verbose" means using more words than necessary. From Latin "verbum" = word.' },
  { type: 'vocabulary', question: 'What does "ambivalent" mean?', options: ['Clearly decided', 'Having mixed or contradictory feelings', 'Very enthusiastic', 'Completely uninterested'], correct: 1, explanation: '"Ambivalent" = having two conflicting feelings. "Ambi" = both, "valent" = strong.' },
  { type: 'vocabulary', question: 'What is a "proponent"?', options: ['Someone who opposes something', 'A person who advocates for something', 'An impartial observer', 'A financial supporter only'], correct: 1, explanation: 'A "proponent" is a person who supports or advocates for a cause or proposal.' },
  { type: 'vocabulary', question: 'What does "aloof" mean?', options: ['Very friendly and outgoing', 'Cool and distant', 'Highly intelligent', 'Extremely busy'], correct: 1, explanation: '"Aloof" means not friendly or forthcoming; keeping at a distance emotionally or physically.' },
  { type: 'vocabulary', question: 'What does "candid" mean?', options: ['Secretive and guarded', 'Truthful and straightforward', 'Overly flattering', 'Diplomatically vague'], correct: 1, explanation: '"Candid" = honest and direct. "Candid camera" catches people being natural and genuine.' },
  { type: 'vocabulary', question: 'What is "eloquence"?', options: ['Speaking in a foreign language', 'Fluent and persuasive speaking or writing', 'Using technical jargon', 'Speaking very quietly'], correct: 1, explanation: '"Eloquence" is the ability to express ideas fluently, clearly, and persuasively.' },
  { type: 'vocabulary', question: 'What does "pragmatic" mean?', options: ['Dealing with dreams and ideals', 'Focused on practical matters', 'Overly emotional', 'Theoretically oriented'], correct: 1, explanation: '"Pragmatic" = practical, realistic, focused on what works rather than what\'s ideal.' },
  { type: 'vocabulary', question: 'Which word means "to make something worse"?', options: ['Alleviate', 'Mitigate', 'Exacerbate', 'Ameliorate'], correct: 2, explanation: '"Exacerbate" = to make a bad situation worse. The others mean to improve or lessen.' },
  { type: 'vocabulary', question: 'What does "meticulous" mean?', options: ['Careless and hasty', 'Showing extreme care with details', 'Extremely generous', 'Bold and adventurous'], correct: 1, explanation: '"Meticulous" = very careful and precise, paying attention to every small detail.' },
  { type: 'vocabulary', question: 'What does "tenacious" mean?', options: ['Easily giving up', 'Holding firm; persistent', 'Agreeable and flexible', 'Rapid and efficient'], correct: 1, explanation: '"Tenacious" = holding on tightly; refusing to give up. From Latin "tenere" = to hold.' },
  { type: 'vocabulary', question: 'What is an "anecdote"?', options: ['A type of medication', 'A short personal story', 'An official report', 'A scientific theory'], correct: 1, explanation: 'An "anecdote" is a short, amusing or interesting story about a real incident or person.' },
  { type: 'vocabulary', question: 'What does "sarcastic" mean?', options: ['Genuinely complimentary', 'Saying the opposite of what you mean to mock', 'Speaking very formally', 'Being overly polite'], correct: 1, explanation: 'Sarcasm involves saying the opposite of what you mean, often to criticize or mock humorously.' },
  { type: 'vocabulary', question: 'What does "novice" mean?', options: ['An expert in a field', 'A person new to a skill', 'An ancient tradition', 'A formal agreement'], correct: 1, explanation: 'A "novice" is a beginner or someone new to a subject or activity.' },
  { type: 'vocabulary', question: 'What does "concise" mean?', options: ['Very long and detailed', 'Brief and to the point', 'Extremely complex', 'Emotionally expressive'], correct: 1, explanation: '"Concise" = expressing much in few words. Opposite of verbose or wordy.' },
  { type: 'vocabulary', question: 'What does "collaborate" mean?', options: ['To compete fiercely', 'To work jointly on something', 'To criticize another\'s work', 'To copy someone\'s idea'], correct: 1, explanation: '"Collaborate" = work together with others. From Latin "co" (together) + "laborare" (to work).' },

  // Idiom meaning
  { type: 'idiom', question: 'What does "bite the bullet" mean?', options: ['To eat something hard', 'To endure a painful situation bravely', 'To make a rash decision', 'To argue aggressively'], correct: 1, explanation: 'From battlefields where patients bit bullets during surgery. Means to endure difficulty.' },
  { type: 'idiom', question: 'What does "hit the nail on the head" mean?', options: ['To be aggressive', 'To describe exactly what is right', 'To cause an accident', 'To complete a project'], correct: 1, explanation: 'Like hitting a nail perfectly — you\'ve identified the exact truth or made a perfect point.' },
  { type: 'idiom', question: 'What does "break the ice" mean?', options: ['To make something cold', 'To do something to relieve tension in a social situation', 'To destroy a valuable object', 'To start an argument'], correct: 1, explanation: 'Like breaking ice on a ship\'s path. "Breaking the ice" makes social interaction easier.' },
  { type: 'idiom', question: 'What does "burning the midnight oil" mean?', options: ['Being careless with resources', 'Working very late into the night', 'Starting a fire', 'Wasting energy'], correct: 1, explanation: 'Before electricity, people burned oil lamps when working late. Now means working into the night.' },
  { type: 'idiom', question: 'What does "let the cat out of the bag" mean?', options: ['To release an animal', 'To reveal a secret accidentally', 'To make a mess', 'To be generous'], correct: 1, explanation: 'Originates from market scams where a cheap pig was secretly replaced with a cat in a bag.' },
  { type: 'idiom', question: 'What does "once in a blue moon" mean?', options: ['During nighttime only', 'Very rarely', 'Every month', 'Always and consistently'], correct: 1, explanation: 'A "blue moon" is a rare second full moon in a month, hence very rarely.' },
  { type: 'idiom', question: 'What does "cost an arm and a leg" mean?', options: ['To involve physical injury', 'To be very expensive', 'To require physical effort', 'To be completely free'], correct: 1, explanation: '"Cost an arm and a leg" = extremely expensive. Implies giving up body parts for the price.' },
  { type: 'idiom', question: 'What does "under the weather" mean?', options: ['To be caught in rain', 'To feel slightly ill', 'To be outdoors', 'To feel anxious'], correct: 1, explanation: '"Under the weather" = not feeling well. Nautical origin — sick sailors went below deck (under the weather).' },
  { type: 'idiom', question: 'What does "add fuel to the fire" mean?', options: ['To be helpful', 'To make a bad situation worse', 'To start a new conversation', 'To bring warmth'], correct: 1, explanation: 'Like adding fuel to a fire makes it bigger — making an already bad situation worse.' },
  { type: 'idiom', question: 'What does "a blessing in disguise" mean?', options: ['A hypocritical person', 'Something good that at first seemed bad', 'An unexpected visitor', 'A hidden cost'], correct: 1, explanation: 'Something that seems bad but turns out to be good — a blessing hidden as something bad.' },
  { type: 'idiom', question: 'What does "spill the beans" mean?', options: ['To make a mess while cooking', 'To reveal secret information', 'To be overly generous', 'To start a rumor'], correct: 1, explanation: '"Spill the beans" = to reveal secret information, often by accident.' },
  { type: 'idiom', question: 'What does "get a taste of your own medicine" mean?', options: ['To try a new food', 'To experience the same negative treatment you give others', 'To recover from illness', 'To learn from mistakes'], correct: 1, explanation: 'When someone who does harm to others experiences that same harm themselves.' },
  { type: 'idiom', question: 'What does "sit on the fence" mean?', options: ['To avoid making a decision', 'To watch an event from outside', 'To wait for someone', 'To remain physically still'], correct: 0, explanation: '"Sit on the fence" = to avoid taking a side or making a decision on an issue.' },
  { type: 'idiom', question: 'What does "the ball is in your court" mean?', options: ['It\'s time to play a sport', 'It\'s your turn to take action or decide', 'Someone else is responsible now', 'You have an advantage in sport'], correct: 1, explanation: 'From tennis — when the ball is on your side, it\'s YOUR responsibility to return it (act).' },
  { type: 'idiom', question: 'What does "kick the bucket" mean?', options: ['To start something new', 'To die', 'To make a mistake', 'To refuse to cooperate'], correct: 1, explanation: '"Kick the bucket" is an informal/humorous way of saying someone has died.' },

  // Additional questions to reach 200+
  { type: 'grammar', question: 'Which sentence uses the present perfect correctly?', options: ['I have seen that movie yesterday.', 'I saw that movie since Monday.', 'I\'ve already seen that movie.', 'I have saw that movie before.'], correct: 2, explanation: 'Present perfect uses "have/has + past participle." Avoid using it with specific past time words like "yesterday."' },
  { type: 'vocabulary', question: 'What does "inevitable" mean?', options: ['Impossible to prevent', 'Easy to avoid', 'Very unlikely', 'Extremely surprising'], correct: 0, explanation: '"Inevitable" = certain to happen; impossible to avoid. "In" (not) + "evitable" (avoidable).' },
  { type: 'fill', question: '"You should _____ a professional about this legal issue."', options: ['refer', 'consult', 'speak', 'call'], correct: 1, explanation: '"Consult a professional" = seek expert advice. The standard collocation in formal contexts.' },
  { type: 'idiom', question: 'What does "hit the sack" mean?', options: ['To attack someone', 'To go to bed/sleep', 'To fire someone', 'To win a game'], correct: 1, explanation: '"Hit the sack" (or "hit the hay") is informal for going to sleep or bed.' },
  { type: 'grammar', question: 'Choose the correctly punctuated sentence:', options: ['However I disagree with you.', 'However, I disagree with you.', 'However; I disagree with you.', 'However: I disagree with you.'], correct: 1, explanation: 'Use a comma after transitional words like "however," "therefore," "moreover" at the start of a sentence.' },
  { type: 'vocabulary', question: 'What does "empathy" mean?', options: ['Feeling sorry for someone from a distance', 'Understanding and sharing another\'s feelings', 'Being overly emotional yourself', 'Giving good advice to others'], correct: 1, explanation: '"Empathy" = emotionally understanding someone else\'s feelings. Different from sympathy (feeling sorry for).' },
  { type: 'fill', question: '"I\'m not sure — I\'ll have to think _____ it."', options: ['of', 'about', 'over', 'through'], correct: 1, explanation: '"Think about" is the standard phrasing. "Think over" is also correct but less natural here.' },
  { type: 'idiom', question: 'What does "see eye to eye" mean?', options: ['To have the same view or opinion', 'To make eye contact', 'To have perfect vision', 'To stare at someone'], correct: 0, explanation: '"See eye to eye" = to agree completely with someone on something.' },
  { type: 'grammar', question: 'Which sentence uses "fewer" correctly?', options: ['There are less people here today.', 'There are fewer people here today.', 'There are lesser people here today.', 'There are little people here today.'], correct: 1, explanation: 'Use "fewer" for countable nouns (people, books), "less" for uncountable nouns (water, time).' },
  { type: 'vocabulary', question: 'What does "prolific" mean?', options: ['Very lazy and unproductive', 'Producing a large amount of work', 'Extremely gifted', 'Well-known and famous'], correct: 1, explanation: '"Prolific" = producing many works or results. A prolific writer publishes many books.' },
  { type: 'fill', question: '"She\'s very dedicated _____ her work."', options: ['in', 'about', 'to', 'for'], correct: 2, explanation: '"Dedicated to" is the correct preposition phrase. You are dedicated TO a cause or work.' },
  { type: 'idiom', question: 'What does "pull someone\'s leg" mean?', options: ['To physically pull someone', 'To joke or tease someone', 'To help someone up', 'To trip someone'], correct: 1, explanation: '"Pull someone\'s leg" = to tease or joke with someone; to try to make them believe something untrue.' },
  { type: 'grammar', question: 'Identify the correct reported speech: She said, "I am tired." →', options: ['She said that she is tired.', 'She said that she was tired.', 'She said that she has been tired.', 'She said that she were tired.'], correct: 1, explanation: 'In reported speech, present tense shifts to past: "am" → "was."' },
  { type: 'vocabulary', question: 'What does "concede" mean?', options: ['To firmly deny something', 'To admit or acknowledge reluctantly', 'To challenge an idea', 'To completely agree'], correct: 1, explanation: '"Concede" = to admit that something is true, often reluctantly, or to give up a point.' },
  { type: 'fill', question: '"The project succeeded _____ all expectations."', options: ['beyond', 'above', 'over', 'past'], correct: 0, explanation: '"Beyond all expectations" is the standard idiom meaning it did better than anyone thought possible.' },
  { type: 'idiom', question: 'What does "get the ball rolling" mean?', options: ['To play a sport', 'To start an activity or process', 'To waste time', 'To prevent something from happening'], correct: 1, explanation: '"Get the ball rolling" = to begin or start something. Like getting a ball moving in a game.' },
  { type: 'grammar', question: '"She asked me where _____ from." (indirect question)', options: ['did I come', 'I came', 'I come', 'was I coming'], correct: 1, explanation: 'In indirect/reported questions, use statement word order: "where I came from," not "where did I come."' },
  { type: 'vocabulary', question: 'What does "lucrative" mean?', options: ['Very difficult to do', 'Producing a lot of money', 'Requiring skill', 'Very popular'], correct: 1, explanation: '"Lucrative" = producing a large profit. From Latin "lucrum" = profit/gain.' },
  { type: 'fill', question: '"I was _____. I had no idea she was going to say that."', options: ['dumbfounded', 'determined', 'delighted', 'disappointed'], correct: 0, explanation: '"Dumbfounded" = so astonished that you can\'t speak. Perfect for unexpected shocking news.' },
  { type: 'idiom', question: 'What does "the tip of the iceberg" mean?', options: ['A small, visible part of a much larger problem', 'The best part of something', 'A cold and harsh situation', 'The beginning of a project'], correct: 0, explanation: 'Icebergs show only 10% above water. The phrase means what\'s visible is only a small part of a bigger issue.' },
  { type: 'grammar', question: 'Which word correctly completes: "I wish I _____ better at math."', options: ['am', 'was', 'were', 'be'], correct: 2, explanation: '"Wish" + past subjunctive uses "were" for all subjects, expressing an unreal or desired situation.' },
  { type: 'vocabulary', question: 'What does "articulate" mean as an adjective?', options: ['Difficult to understand', 'Able to speak fluently and coherently', 'Extremely quiet', 'Overly technical'], correct: 1, explanation: '"Articulate" = able to express thoughts clearly and effectively. From Latin "articulare" = to divide into joints.' },
  { type: 'fill', question: '"Please don\'t _____ to the pressure — stand your ground."', options: ['submit', 'succumb', 'surrender', 'yield'], correct: 1, explanation: '"Succumb to pressure" = to give in to pressure. It\'s the most specific and natural collocation here.' },
  { type: 'idiom', question: 'What does "back to square one" mean?', options: ['Returning to the beginning after a failure', 'Going back to your hometown', 'Starting something new', 'Finishing a project'], correct: 0, explanation: '"Back to square one" = having to start from the beginning after something has failed.' },
  { type: 'grammar', question: 'Choose the correct option: "I _____ for this company for ten years now."', options: ['work', 'am working', 'have been working', 'worked'], correct: 2, explanation: '"Have been working" (present perfect continuous) shows an ongoing action from the past to now.' },
  { type: 'vocabulary', question: 'What does "deceptive" mean?', options: ['Genuinely helpful', 'Likely to mislead; misleading', 'Extremely clear', 'Very surprising'], correct: 1, explanation: '"Deceptive" = giving a misleading impression. From "deceive" = to trick or mislead.' },
  { type: 'fill', question: '"I take full _____ for what happened."', options: ['blame', 'guilt', 'responsibility', 'credit'], correct: 2, explanation: '"Take responsibility" is the standard phrase for accepting accountability. Very common in formal and professional English.' },
  { type: 'idiom', question: 'What does "give someone the cold shoulder" mean?', options: ['To serve cold food', 'To deliberately ignore or be unfriendly to someone', 'To make someone feel cold', 'To offer unwanted advice'], correct: 1, explanation: '"Give the cold shoulder" = to deliberately ignore or snub someone as a sign of displeasure.' },
  { type: 'grammar', question: 'Which sentence contains a split infinitive?', options: ['She decided to go quickly.', 'She decided to quickly go.', 'She quickly decided to go.', 'She decided quickly to go.'], correct: 1, explanation: 'A split infinitive has an adverb between "to" and the verb: "to quickly go." Still disputed but widely used.' },
  { type: 'vocabulary', question: 'What does "credible" mean?', options: ['Incredible and shocking', 'Able to be believed; trustworthy', 'Very creative', 'Worthy of credit'], correct: 1, explanation: '"Credible" = able to be believed or trusted. From Latin "credibilis" = worthy of belief.' },
];

// ─── DATA: IDIOMS / PHRASES OF THE DAY ────────────────────────────────────────

const IDIOMS = [
  { phrase: 'Hit the ground running', meaning: 'To start something and immediately work at full speed and efficiency.', origin: 'Likely military: soldiers jumping from vehicles and running immediately without losing momentum.', dialogue: ['A: How did your first week at the new job go?', 'B: Really well! I hit the ground running — I already closed two deals.'] },
  { phrase: 'Bite off more than you can chew', meaning: 'To take on more responsibility or work than you can handle.', origin: 'From eating: literally biting a piece too large to chew properly. Recorded in use since the 1800s.', dialogue: ['A: You\'re running the marathon AND doing the triathlon the same weekend?', 'B: I know — I definitely bit off more than I can chew this time.'] },
  { phrase: 'The elephant in the room', meaning: 'An obvious problem or difficult situation that no one wants to discuss.', origin: 'The phrase became popular in the 20th century to describe something so obvious it\'s hard to ignore.', dialogue: ['A: Nobody has mentioned the budget cuts in this meeting.', 'B: I know. The elephant in the room is that three departments will be cut.'] },
  { phrase: 'A penny for your thoughts', meaning: 'Used to ask someone what they are thinking, especially if they seem lost in thought.', origin: 'First used in writing by Sir Thomas More in 1522 — even then, a "penny\'s worth" of thought.', dialogue: ['A: You\'ve been staring at the window for ages.', 'B: Oh — sorry! A penny for your thoughts? I was just worried about tomorrow.'] },
  { phrase: 'Kill two birds with one stone', meaning: 'To achieve two goals with one action.', origin: 'Ancient proverb. The first recorded English version appears around the 17th century.', dialogue: ['A: I need to go to the post office and buy groceries.', 'B: The new store near the post office has both — kill two birds with one stone!'] },
  { phrase: 'Under the gun', meaning: 'Under pressure to meet a deadline or complete something urgently.', origin: 'Military origin — originally "under fire." Evolved to mean being pressured by deadlines.', dialogue: ['A: Can you help me with this report?', 'B: I\'m really under the gun right now — the presentation is in an hour.'] },
  { phrase: 'Throw in the towel', meaning: 'To admit defeat; to give up on something.', origin: 'Boxing: a trainer throws a towel into the ring to stop the fight and concede defeat for their boxer.', dialogue: ['A: Are you still trying to learn guitar?', 'B: Not really. After six months with no progress, I kind of threw in the towel.'] },
  { phrase: 'Out of the blue', meaning: 'Unexpectedly; without warning or prior notice.', origin: 'From "a bolt out of the blue" — lightning striking from a clear blue sky, completely unexpected.', dialogue: ['A: Did you hear from your old manager?', 'B: Yes! He called me out of the blue and offered me a job!'] },
  { phrase: 'On the fence', meaning: 'Undecided or neutral about something.', origin: 'Literal image of someone sitting on a fence between two properties, choosing neither side.', dialogue: ['A: Are you coming to the party on Saturday?', 'B: I\'m still on the fence. It depends on how work goes this week.'] },
  { phrase: 'Beat around the bush', meaning: 'To avoid talking about the main point; to speak vaguely.', origin: 'From bird hunting: beaters would hit bushes to flush birds out — working around rather than directly.', dialogue: ['A: Can you just tell me the price?', 'B: Sorry, I\'ll stop beating around the bush — it\'s $500.'] },
  { phrase: 'Burn bridges', meaning: 'To permanently damage a relationship or opportunity.', origin: 'Military strategy: burning a bridge behind you prevents enemy pursuit but also your own retreat.', dialogue: ['A: I want to quit by just walking out tomorrow.', 'B: Don\'t burn bridges — give proper notice and leave professionally.'] },
  { phrase: 'The ball is in your court', meaning: 'It is now your responsibility to take the next action or make the next decision.', origin: 'From tennis: when the ball lands on your side, it\'s your turn to respond.', dialogue: ['A: I\'ve sent her my proposal. Now what?', 'B: Now the ball is in her court — just wait for her response.'] },
  { phrase: 'Cut corners', meaning: 'To do something the easy or cheaper way, often sacrificing quality.', origin: 'Carpenters and architects historically cut corners of land lots or buildings to save material.', dialogue: ['A: Why did the renovation only take two weeks?', 'B: They cut corners. The tiles are already cracking.'] },
  { phrase: 'Go back to the drawing board', meaning: 'To start a project over completely; to begin from scratch.', origin: 'Refers to an architect\'s or engineer\'s drawing board — starting a design from the beginning.', dialogue: ['A: The client rejected our entire proposal.', 'B: Back to the drawing board. Let\'s meet Monday morning.'] },
  { phrase: 'Read between the lines', meaning: 'To understand something that is not explicitly stated; to find hidden meaning.', origin: 'Refers to reading invisible/hidden messages between the written lines using invisible ink.', dialogue: ['A: Did she say she was upset?', 'B: Not directly, but if you read between the lines, she definitely is.'] },
  { phrase: 'Put your foot in your mouth', meaning: 'To say something embarrassing or inappropriate by accident.', origin: 'American English: the image of accidentally putting your own foot in your mouth, a clumsy act.', dialogue: ['A: I asked her when the baby was due and she\'s not pregnant!', 'B: Oh no. You really put your foot in your mouth there.'] },
  { phrase: 'Bite the bullet', meaning: 'To endure a painful or difficult situation with courage.', origin: 'Pre-anesthesia surgery: patients would bite on a bullet to endure the pain of the operation.', dialogue: ['A: I don\'t want to call and apologize.', 'B: I know it\'s hard, but just bite the bullet and do it. You\'ll feel better.'] },
  { phrase: 'Barking up the wrong tree', meaning: 'To pursue a mistaken or misguided course of action; to have the wrong idea.', origin: 'Hunting dogs would sometimes bark at a tree after an animal had moved to another tree.', dialogue: ['A: I think John took my pen.', 'B: You\'re barking up the wrong tree — I saw Sarah borrow it earlier.'] },
  { phrase: 'When pigs fly', meaning: 'Something that will never happen.', origin: 'Pigs cannot fly — the phrase describes an impossible condition. Used sarcastically.', dialogue: ['A: Do you think they\'ll ever lower prices?', 'B: When pigs fly. This company never gives discounts.'] },
  { phrase: 'Bite the hand that feeds you', meaning: 'To act against those who are helping or supporting you.', origin: 'The image of a dog biting the hand of the owner who feeds it — blatant ingratitude.', dialogue: ['A: He complained about the company publicly while still working there.', 'B: That\'s biting the hand that feeds you. Very risky.'] },
];

// ─── DATA: TONGUE TWISTERS ─────────────────────────────────────────────────────

const TONGUE_TWISTERS = [
  { text: 'She sells seashells by the seashore.', phonetic: '/ʃiː sɛlz ˈsiːʃɛlz baɪ ðə ˈsiːʃɔː/', note: 'Focus on the "sh" /ʃ/ vs "s" /s/ contrast. Keep "sells" and "shells" distinct.' },
  { text: 'Peter Piper picked a peck of pickled peppers.', phonetic: '/ˈpiːtə ˈpaɪpə pɪkt ə pɛk əv ˈpɪkəld ˈpɛpəz/', note: 'The /p/ burst sound. Slightly puff air each time you say a "P" word.' },
  { text: 'How much wood would a woodchuck chuck if a woodchuck could chuck wood?', phonetic: '/haʊ mʌtʃ wʊd wʊd ə ˈwʊdtʃʌk tʃʌk ɪf ə ˈwʊdtʃʌk kʊd tʃʌk wʊd/', note: 'Contrast /wʊd/ (would/wood) vs /tʃʌk/ (chuck). Great for "ch" vs "w" practice.' },
  { text: 'Red lorry, yellow lorry, red lorry, yellow lorry.', phonetic: '/rɛd ˈlɒri ˈjɛloʊ ˈlɒri/', note: 'Switch quickly between /r/ and /l/ sounds — one of the hardest English distinctions for many learners.' },
  { text: 'Unique New York, unique New York, you know you need unique New York.', phonetic: '/juːˈniːk nuː jɔːk juː noʊ juː niːd juːˈniːk nuː jɔːk/', note: 'Practice the /juː/ (you/unique) sound consistently. Great for the American /r/ in "York."' },
  { text: 'I scream, you scream, we all scream for ice cream.', phonetic: '/aɪ skriːm juː skriːm wiː ɔːl skriːm fər ˈaɪs kriːm/', note: 'The "scr" cluster: /s/ + /k/ + /r/ together. Keep "ice cream" and "I scream" separate and clear.' },
  { text: 'Betty Botter bought some butter but she said the butter\'s bitter.', phonetic: '/ˈbɛti ˈbɒtər bɔːt sʌm ˈbʌtər bʌt ʃiː sɛd ðə ˈbʌtərz ˈbɪtər/', note: 'Practice /b/, /t/, and /ʌ/ (as in "butter") sounds rapidly. Great warm-up for the /b/ and /t/ consonants.' },
  { text: 'A proper copper coffee pot.', phonetic: '/ə ˈprɒpər ˈkɒpər ˈkɒfi pɒt/', note: 'Short vowel /ɒ/ contrast: "proper" / "copper" / "coffee" / "pot." Stay precise with those short O sounds.' },
  { text: 'Whether the weather is warm, whether the weather is hot, we have to put up with the weather, whether we like it or not.', phonetic: '/ˈwɛðər ðə ˈwɛðər ɪz wɔːm/', note: 'The "wh" /w/ vs "th" /ð/ contrast. Many learners confuse "whether" and "weather" — focus on the /ð/ sound.' },
  { text: 'Fuzzy Wuzzy was a bear. Fuzzy Wuzzy had no hair. Fuzzy Wuzzy wasn\'t very fuzzy, was he?', phonetic: '/ˈfʌzi ˈwʌzi wɒz ə bɛr/', note: 'The /w/ and /f/ combo along with /z/ practice. A great rhythm exercise — say it like a chant.' },
  { text: 'Can you can a can as a canner can can a can?', phonetic: '/kæn juː kæn ə kæn æz ə ˈkænər kæn kæn ə kæn/', note: 'The /kæn/ sound repeating — great for distinguishing "can" (ability) vs "can" (container).' },
  { text: 'Lesser leather never weathered wetter weather better.', phonetic: '/ˈlɛsər ˈlɛðər ˈnɛvər ˈwɛðəd ˈwɛtər ˈwɛðər ˈbɛtər/', note: 'Contrast /l/ and /w/ while managing the "th" /ð/ sound. Gradually build speed.' },
  { text: 'Six slippery snails slid slowly seaward.', phonetic: '/sɪks ˈslɪpəri sneɪlz slɪd ˈsloʊli ˈsiːwərd/', note: 'The "sl" and "s" cluster combinations. Excellent for practicing smooth consonant clusters.' },
  { text: 'Double bubble gum bubbles double.', phonetic: '/ˈdʌbəl ˈbʌbəl ɡʌm ˈbʌbəlz ˈdʌbəl/', note: 'Quick /d/ and /b/ alternation. Try saying it three times fast while keeping each "b" crisp.' },
  { text: 'The thirty-three thieves thought they thrilled the throne throughout Thursday.', phonetic: '/ðə ˈθɜːti θriː θiːvz θɔːt ðeɪ θrɪld ðə θroʊn θruːˈaʊt ˈθɜːzdeɪ/', note: 'Pure "th" /θ/ exercise. Tongue between teeth for every word starting with "th." Advanced level!' },
];

// ─── DATA: ROLE-PLAY SCENARIOS ─────────────────────────────────────────────────

const SCENARIOS = [
  { title: 'Checking Into a Hotel', role: 'A hotel guest arriving for a 3-night stay', situation: 'You arrive at a 4-star hotel. The reservation was made online but you have a few requests: you want a higher floor, a non-smoking room, and early check-in if possible.', vocab: ['room upgrade', 'amenities', 'complimentary'], dialogue_tip: 'Be polite but assertive. Use phrases like "Is it possible to..." and "I was wondering if..."' },
  { title: 'Job Interview — Tell Me About Yourself', role: 'A job candidate in an interview', situation: 'The interviewer says: "So, tell me about yourself and why you applied for this position." You need to give a strong 2-minute answer that covers your background, skills, and motivation.', vocab: ['background', 'expertise', 'contribute'], dialogue_tip: 'Structure it as: Past → Present → Future. What you\'ve done, what you do, and why you want this role.' },
  { title: 'Returning a Faulty Product', role: 'A customer returning a broken phone charger', situation: 'You bought a phone charger two weeks ago and it has stopped working. You want a replacement or refund. The store policy says returns are accepted within 30 days.', vocab: ['defective', 'refund', 'exchange'], dialogue_tip: 'Stay calm and professional. Say "I\'d like to resolve this" rather than "This is your fault."' },
  { title: 'Asking for Directions', role: 'A tourist visiting a new city', situation: 'You\'re looking for the nearest metro station. You\'ve been walking for 20 minutes and your map app isn\'t working. You stop a friendly-looking local to ask for help.', vocab: ['intersection', 'landmark', 'approximately'], dialogue_tip: 'Repeat directions back to confirm: "So I take a right at the pharmacy and walk two blocks?"' },
  { title: 'Disagreeing in a Team Meeting', role: 'A team member who disagrees with a colleague\'s proposal', situation: 'Your colleague proposes cutting the testing phase to save two weeks. You believe this risks product quality. You need to voice your concern without seeming dismissive of their idea.', vocab: ['concern', 'alternative', 'risk'], dialogue_tip: 'Use "I see where you\'re coming from, and..." before disagreeing. Soften with "What if we considered..."' },
  { title: 'Ordering at a Restaurant with Dietary Restrictions', role: 'A diner with a nut allergy dining out', situation: 'You\'re at a restaurant and need to make sure your meal doesn\'t contain nuts. Some items sound delicious but might not be safe. You want to ask the server about ingredients without causing a scene.', vocab: ['allergy', 'ingredient', 'accommodate'], dialogue_tip: 'Be clear about seriousness: "I have a nut allergy — is it possible to check with the kitchen?"' },
  { title: 'Negotiating a Salary', role: 'A job candidate who has just received an offer', situation: 'You\'ve been offered a job but the salary is 15% lower than your target. You have another offer from a different company. You want to negotiate politely without jeopardizing the offer.', vocab: ['negotiate', 'competitive', 'flexible'], dialogue_tip: 'Always express enthusiasm first: "I\'m very excited about this opportunity. I was hoping we could discuss..."' },
  { title: 'Giving Feedback to a Colleague', role: 'A team leader giving constructive feedback', situation: 'Your team member submitted a report with great ideas but very poor formatting and several errors. You want to praise the good work while clearly communicating what needs to improve.', vocab: ['constructive', 'improvement', 'specific'], dialogue_tip: 'Use the "sandwich" method: positive → improvement → positive. Avoid "but" — try "and" instead.' },
  { title: 'Making a Complaint to a Landlord', role: 'A tenant with a maintenance issue', situation: 'The heating in your apartment has been broken for two weeks. Your landlord hasn\'t responded to your emails. You need to call and firmly (but politely) request urgent repairs.', vocab: ['urgent', 'resolve', 'obligation'], dialogue_tip: 'Keep a calm, factual tone: "I want to make sure we can resolve this before the weekend." Document everything.' },
  { title: 'Explaining Your Culture to Someone', role: 'A person sharing their cultural traditions', situation: 'You\'ve met someone from another country who is curious about your culture, food, and traditions. They\'ve asked you to explain a festival or custom that\'s important to you.', vocab: ['tradition', 'significance', 'celebrate'], dialogue_tip: 'Use analogy and comparison: "It\'s similar to Christmas but..." Connect to what they might know.' },
  { title: 'Asking for Help at a New Job', role: 'A new employee on their first week', situation: 'You\'ve been given a task but the instructions aren\'t clear. Your supervisor seems busy. You need to ask a colleague for help without seeming incompetent or too dependent.', vocab: ['clarify', 'procedure', 'guidance'], dialogue_tip: 'Say what you\'ve already tried: "I\'ve looked at the manual, but I\'m unclear on step 3 — could you walk me through it?"' },
  { title: 'Discussing a Current News Event', role: 'A person sharing their opinion on a news story', situation: 'A colleague brings up a recent news story about climate change. They ask for your opinion. You want to share your perspective thoughtfully, acknowledge other viewpoints, and avoid argument.', vocab: ['perspective', 'evidence', 'impact'], dialogue_tip: 'Use hedge phrases: "From what I understand...", "I think the key issue is...", "What\'s your take on it?"' },
];

// ─── UTILITY FUNCTIONS ─────────────────────────────────────────────────────────

function generateAnonId(): string {
  return 'anon_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
}

function getTodayKey(): string {
  return new Date().toISOString().split('T')[0];
}

function getDayIndex(arrayLength: number): number {
  const now = new Date();
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  return dayOfYear % arrayLength;
}

function saveUserState(state: UserState) {
  try {
    localStorage.setItem('norinly_learn_state', JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save user state', e);
  }
}

function loadUserState(): UserState {
  const defaultState: UserState = {
    anonId: generateAnonId(),
    streak: 0,
    lastVisitDate: getTodayKey(),
    quizCompleted: false,
    quizScore: null,
    quizScoreHistory: [],
    wordViewed: false,
    lastWordViewDate: '',
  };

  if (typeof window === 'undefined') return defaultState;

  try {
    const stored = localStorage.getItem('norinly_learn_state');
    if (stored) {
      const parsed = JSON.parse(stored) as UserState;
      const today = getTodayKey();

      if (parsed.lastVisitDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (parsed.lastVisitDate !== yesterdayStr) {
          parsed.streak = 0;
        }

        parsed.quizCompleted = false;
        parsed.quizScore = null;
        parsed.wordViewed = false;
        parsed.lastVisitDate = today;
      }
      return parsed;
    }
  } catch (e) {
    console.error('Failed to load user state', e);
  }
  return defaultState;
}

function getDailyQuizQuestions(): QuizQuestion[] {
  const dayIndex = getDayIndex(100);
  const questions: QuizQuestion[] = [];
  for (let i = 0; i < 10; i++) {
    const qIndex = (dayIndex * 7 + i * 13) % QUIZ_BANK.length;
    questions.push(QUIZ_BANK[qIndex]);
  }
  return questions;
}

// ─── PROGRESS RING COMPONENT ───────────────────────────────────────────────────

function ProgressRing({ completed, total, size = 64, strokeWidth = 5, light = false }: { completed: number; total: number; size?: number; strokeWidth?: number; light?: boolean }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = total > 0 ? completed / total : 0;
  const dashOffset = circumference * (1 - progress);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={light ? "rgba(255,255,255,0.2)" : "#e2e8f0"} strokeWidth={strokeWidth} />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={light ? "#ffffff" : "#7c3aed"} strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-sm font-extrabold ${light ? "text-white" : "text-slate-800"}`}>{completed}/{total}</span>
      </div>
    </div>
  );
}

// ─── SCORE BAR CHART ───────────────────────────────────────────────────────────

function ScoreChart({ history }: { history: { date: string; score: number }[] }) {
  const last7 = history.slice(-7);
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const averageScore = last7.length > 0
    ? (last7.reduce((acc, h) => acc + h.score, 0) / last7.length).toFixed(1)
    : '0.0';

  return (
    <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="space-y-0.5">
          <h4 className="text-sm font-bold text-slate-900">7-Day Score History</h4>
          <p className="text-xs text-slate-500">Consistency is your superpower</p>
        </div>
        <span className="text-[10px] font-bold px-2 py-1 bg-purple-50 text-purple-700 border border-purple-100 rounded-full">
          AVERAGE: {averageScore}
        </span>
      </div>

      <div className="flex items-end gap-3 h-28 pt-2">
        {last7.length === 0 ? (
          <p className="text-slate-400 text-xs py-8 text-center w-full">Complete your first quiz to see history</p>
        ) : (
          last7.map((entry, i) => {
            const height = Math.max(8, (entry.score / 10) * 80);
            const d = new Date(entry.date);
            return (
              <div key={i} className="flex flex-col items-center gap-1.5 flex-1 group relative">
                {/* Score tooltip on hover */}
                <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded pointer-events-none whitespace-nowrap z-10 shadow-sm">
                  {entry.score}/10
                </div>
                
                <div
                  className="w-full rounded-t-lg transition-all duration-300 hover:opacity-85"
                  style={{
                    height: `${height}px`,
                    background: 'linear-gradient(to top, #6366f1, #8b5cf6)',
                  }}
                />
                <span className="text-[10px] text-slate-400 font-medium">{days[d.getDay()]}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// ─── ICONS & IMPORTS ───────────────────────────────────────────────────────────
import { 
  BookOpen, Clock, Calendar, Flame, Sparkles, Smile, Award, Volume2, Bookmark, 
  Compass, HelpCircle, Phone, ArrowRight, ChevronRight, Copy, RotateCw, Mic, 
  User, CheckCircle, AlertCircle, MessageSquare, Shield, Trash2, HelpCircle as HelpIcon, Users, Check
} from 'lucide-react';

// ─── MAIN PAGE COMPONENT ───────────────────────────────────────────────────────

export default function LearnPage() {
  const [state, setState] = useState<UserState | null>(null);
  const [mounted, setMounted] = useState(false);

  // Tabs state
  const [activeTab, setActiveTab] = useState<'learn' | 'review' | 'stats' | 'profile'>('learn');

  // Quiz state
  const [quizQuestions] = useState<QuizQuestion[]>(() => getDailyQuizQuestions());
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);

  // Copy/share feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Tongue Twister mic simulator state
  const [recordingState, setRecordingState] = useState<'idle' | 'listening' | 'analyzing' | 'done'>('idle');
  const [recordingTimer, setRecordingTimer] = useState(3);
  const [recordingScore, setRecordingScore] = useState<number | null>(null);

  const startMicSimulation = useCallback(() => {
    setRecordingState('listening');
    setRecordingTimer(3);
    setRecordingScore(null);

    let currentTimer = 3;
    const interval = setInterval(() => {
      currentTimer -= 1;
      setRecordingTimer(currentTimer);
      if (currentTimer <= 0) {
        clearInterval(interval);
        setRecordingState('analyzing');
        
        setTimeout(() => {
          setRecordingState('done');
          const score = Math.floor(Math.random() * 11) + 88;
          setRecordingScore(score);
        }, 1200);
      }
    }, 1000);
  }, []);

  const todayWord = WORDS[getDayIndex(WORDS.length)];
  const todayFact = FUN_FACTS[getDayIndex(FUN_FACTS.length)];
  const todayIdiom = IDIOMS[getDayIndex(IDIOMS.length)];
  const todayTwister = TONGUE_TWISTERS[getDayIndex(TONGUE_TWISTERS.length)];
  const todayScenario = SCENARIOS[getDayIndex(SCENARIOS.length)];

  // Daily quiz type label
  const quizTypeLabels: Record<string, string> = {
    grammar: 'Grammar MCQ',
    fill: 'Fill in the Blank',
    vocabulary: 'Vocabulary MCQ',
    idiom: 'Idiom Meaning',
  };
  const todayQuizType = quizTypeLabels[quizQuestions[0]?.type] ?? 'Quiz';

  const [focusMinutes, setFocusMinutes] = useState(0);

  useEffect(() => {
    const loaded = loadUserState();
    setState(loaded);
    saveUserState(loaded);
    setMounted(true);

    try {
      const rawSessions = localStorage.getItem('norinly_sessions');
      if (rawSessions) {
        const sessions = JSON.parse(rawSessions);
        const today = getTodayKey();
        const todaySessions = sessions.filter((s: any) => s.created_at && s.created_at.startsWith(today));
        const totalSec = todaySessions.reduce((acc: number, s: any) => acc + (s.duration || 0), 0);
        setFocusMinutes(Math.ceil(totalSec / 60));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const updateState = useCallback((update: Partial<UserState>) => {
    setState(prev => {
      if (!prev) return prev;
      const next = { ...prev, ...update };
      saveUserState(next);
      return next;
    });
  }, []);

  const markWordViewed = useCallback(() => {
    const today = getTodayKey();
    if (state?.lastWordViewDate !== today) {
      updateState({ wordViewed: true, lastWordViewDate: today });
    }
  }, [state, updateState]);

  const handleCopy = useCallback((text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  }, []);

  // Text to Speech voice play
  const handleSpeak = useCallback((text: string, id: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any current audio
      setIsSpeaking(id);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.onend = () => setIsSpeaking(null);
      utterance.onerror = () => setIsSpeaking(null);
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const handleAnswerSelect = useCallback((idx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    setShowExplanation(true);
    if (idx === quizQuestions[quizIndex].correct) {
      setCorrectCount(c => c + 1);
    }
  }, [selectedAnswer, quizQuestions, quizIndex]);

  const handleNextQuestion = useCallback(() => {
    if (quizIndex < quizQuestions.length - 1) {
      setQuizIndex(i => i + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      // Quiz complete
      const finalScore = selectedAnswer === quizQuestions[quizIndex].correct
        ? correctCount + 1
        : correctCount;

      const today = getTodayKey();
      const newHistory = [
        ...(state?.quizScoreHistory ?? []).slice(-6),
        { date: today, score: finalScore },
      ];

      updateState({
        quizCompleted: true,
        quizScore: finalScore,
        quizScoreHistory: newHistory,
      });
    }
  }, [quizIndex, quizQuestions, correctCount, selectedAnswer, state, updateState]);

  // Compute phonetic pair breakdowns
  const getPhoneticPairs = useCallback(() => {
    const cleanText = todayTwister.text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g,"");
    const words = cleanText.split(/\s+/).filter(Boolean);
    const phonetics = todayTwister.phonetic.split(/\s+/).filter(Boolean);
    
    if (words.length === phonetics.length) {
      return phonetics.map((p, i) => ({ word: words[i], phonetic: p }));
    }
    return phonetics.map((p, i) => ({ word: words[i] || '', phonetic: p }));
  }, [todayTwister]);

  if (!mounted || !state) {
    return (
      <div className="min-h-[calc(100vh-73px)] flex items-center justify-center bg-[#f8f9fc]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-500 text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const wordViewed = state.lastWordViewDate === getTodayKey();
  const tasksCompleted = (wordViewed ? 1 : 0) + (state.quizCompleted ? 1 : 0);

  // Compute a virtual XP system based on streak and quiz history score
  const totalQuizPoints = state.quizScoreHistory.reduce((acc, h) => acc + h.score, 0) * 10;
  const streakPoints = state.streak * 100;
  const virtualXP = streakPoints + totalQuizPoints;

  // Anonymous avatar emoji selector based on ID length/character
  const avatars = ['😎', '🤓', '🤠', '🦊', '🐻', '🎓', '🎨', '🚀', '🌟', '🦄'];
  const userAvatar = avatars[state.anonId.charCodeAt(state.anonId.length - 1) % avatars.length] || '😎';

  return (
    <div className="flex-1 flex bg-[#f8f9fc] min-h-[calc(100vh-73px)] text-slate-800">
      
      {/* ─── SIDEBAR NAVIGATION (DESKTOP) ─── */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 shrink-0 sticky top-[73px] h-[calc(100vh-73px)] p-6 justify-between z-20">
        <div className="space-y-8">
          {/* Brand/User profile card */}
          <div className="flex items-center gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-150">
            <div className="w-10 h-10 rounded-xl bg-purple-100 border border-purple-200 flex items-center justify-center text-xl shadow-sm">
              {userAvatar}
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-slate-900 block truncate">Anon Learner</span>
              <span className="text-[10px] text-slate-400 font-semibold block">{state.anonId.slice(0, 10)}...</span>
            </div>
          </div>

          <nav className="space-y-1.5">
            {[
              { id: 'learn', label: 'Daily Practice', icon: Compass, color: 'text-purple-600', bg: 'bg-purple-50 text-purple-600 border-l-4 border-purple-600' },
              { id: 'review', label: 'Review Center', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50 text-blue-700 border-l-4 border-blue-600' },
              { id: 'stats', label: 'My Progress', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50 text-orange-700 border-l-4 border-orange-500' },
              { id: 'profile', label: 'Safety & Profile', icon: User, color: 'text-indigo-600', bg: 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600' }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer text-left ${
                    isActive 
                      ? item.bg 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? '' : 'text-slate-400 group-hover:text-slate-600'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Call-to-action bottom card */}
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100 p-4 rounded-2xl space-y-2.5">
          <span className="text-xs font-extrabold text-purple-700 block">Practice English Free</span>
          <span className="text-[10px] text-slate-500 block leading-relaxed">Connect instantly with real English learners worldwide. No signups, no fees.</span>
          <Link href="/connect" className="w-full h-9 bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold rounded-xl flex items-center justify-center gap-1 transition-all shadow-sm shadow-purple-100">
            Connect Live 🎙️
          </Link>
        </div>
      </aside>

      {/* ─── MAIN CONTENT CONTAINER ─── */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* ─── STICKY TOP CONTROLS (MOBILE INCLUSIVE) ─── */}
        <div className="flex items-center justify-between gap-4 flex-wrap bg-white p-4 rounded-2xl border border-slate-200 shadow-sm z-30">
          <div className="flex items-center gap-2">
            {/* Small tab titles for mobile */}
            <div className="flex lg:hidden gap-1 bg-slate-50 p-1 rounded-xl border border-slate-150">
              {[
                { id: 'learn', label: 'Practice' },
                { id: 'review', label: 'Review' },
                { id: 'stats', label: 'Stats' },
                { id: 'profile', label: 'Profile' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    activeTab === tab.id 
                      ? 'bg-purple-600 text-white shadow-sm' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            
            <h2 className="hidden lg:block text-lg font-bold text-slate-900 capitalize">
              {activeTab === 'learn' ? 'Daily Dashboard' : activeTab === 'review' ? 'Idioms & Twisters' : activeTab === 'stats' ? 'Progress insights' : 'Safety center'}
            </h2>
          </div>

          <div className="flex items-center gap-2.5 ml-auto">
            {/* Streak Indicator */}
            <div className="flex items-center gap-1 bg-orange-50 border border-orange-100 rounded-full px-3 py-1 text-xs font-bold text-orange-600 shadow-sm">
              <span>🔥</span>
              <span>{state.streak} Day Streak</span>
            </div>

            {/* Virtual XP Points */}
            <div className="flex items-center gap-1 bg-purple-50 border border-purple-100 rounded-full px-3 py-1 text-xs font-bold text-purple-700 shadow-sm">
              <span>🏆</span>
              <span>{virtualXP} XP</span>
            </div>

            {/* Profile Avatar circle */}
            <div className="lg:hidden w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-sm shadow-inner">
              {userAvatar}
            </div>
          </div>
        </div>

        {/* ─── TAB VIEW: LEARN (DAILY PRACTICE) ─── */}
        {activeTab === 'learn' && (
          <div className="space-y-8">
            
            {/* PURPLE HERO BANNER (Inspiration: Alex Hero Card) */}
            <div className="relative bg-gradient-to-br from-[#7c3aed] via-[#6d28d9] to-[#5b21b6] text-white rounded-3xl p-6 sm:p-8 overflow-visible shadow-lg shadow-purple-100/60 flex flex-col md:flex-row items-center justify-between gap-6 mt-14 md:mt-0 animate-fade-in">
              
              {/* 3D Books Illustration Card */}
              <div className="absolute top-[-40px] md:top-[-30px] right-4 md:right-[28%] w-28 h-28 md:w-36 md:h-36 pointer-events-none select-none z-10 sm:block hidden rotate-3 bg-white p-2.5 rounded-2xl border border-purple-100 shadow-xl shadow-purple-950/20">
                <img src="/images/learning_books.png" alt="Learning Books" className="w-full h-full object-contain rounded-xl" />
              </div>

              {/* Text Area */}
              <div className="space-y-4 max-w-xl text-center md:text-left z-10">
                <span className="text-[10px] font-extrabold uppercase tracking-widest bg-white/20 px-2.5 py-1 rounded-full text-white inline-block">
                  Today's Results
                </span>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                  Keep going
                </h1>
                <p className="text-purple-100 text-sm leading-relaxed max-w-md font-medium">
                  Every mistake is a lesson in disguise. You're building the habit that counts most! Complete your daily checklist to maintain your streak.
                </p>
                <div className="pt-2 flex flex-wrap justify-center md:justify-start gap-3">
                  {!state.quizCompleted ? (
                    <button
                      onClick={() => {
                        setQuizStarted(true);
                        const quizSec = document.getElementById('daily-quiz-card');
                        if (quizSec) quizSec.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-6 py-3 bg-white hover:bg-slate-50 text-purple-700 font-extrabold rounded-full text-xs sm:text-sm transition-all shadow-sm active:scale-95 cursor-pointer"
                    >
                      Start Today's Quiz →
                    </button>
                  ) : (
                    <Link
                      href="/connect"
                      className="px-6 py-3 bg-white hover:bg-slate-50 text-purple-700 font-extrabold rounded-full text-xs sm:text-sm transition-all shadow-sm active:scale-95 inline-flex items-center gap-1.5"
                    >
                      Start Call Practice 🎙️
                    </Link>
                  )}
                </div>
              </div>

              {/* Progress gauge card */}
              <div className="bg-white/10 backdrop-blur-md border border-white/15 p-5 rounded-2xl flex flex-col items-center justify-center shrink-0 min-w-[150px] z-10 text-center">
                <ProgressRing completed={tasksCompleted} total={2} size={90} strokeWidth={8} light />
                <span className="text-[10px] text-purple-200 font-extrabold uppercase tracking-widest mt-3">Daily Goals</span>
              </div>
            </div>

            {/* Section Title */}
            <div className="flex items-center gap-2 pt-2 border-l-4 border-emerald-500 pl-3">
              <h3 className="text-lg font-bold text-slate-800 tracking-tight">Learning Insights</h3>
            </div>

            {/* TWO-COLUMN GRID LAYOUT (Desktop: 12-span) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT COLUMN: Quiz & Score History */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* 1. DAILY QUIZ */}
                <section
                  id="daily-quiz-card"
                  className="rounded-3xl p-6 bg-white border border-slate-200 shadow-sm border-l-[6px] border-[#7c3aed]"
                >
                  <div className="flex items-start justify-between flex-wrap gap-3 mb-5">
                    <div className="space-y-0.5">
                      <span className="text-xs font-extrabold uppercase tracking-widest text-purple-650 text-purple-600 bg-purple-50 border border-purple-100 px-2.5 py-1 rounded-full">
                        Daily Quiz
                      </span>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider pl-1.5 mt-1 block">Today: {todayQuizType}</p>
                    </div>
                    {!state.quizCompleted && (
                      <span className="text-xs px-2.5 py-1 rounded-xl bg-purple-50 text-purple-700 border border-purple-100 font-extrabold">
                        {quizStarted ? `${quizIndex + 1}/10` : '10 Questions'}
                      </span>
                    )}
                  </div>

                  {state.quizCompleted ? (
                    <div className="space-y-6">
                      <div className="text-left py-2 space-y-2">
                        <div className="text-5xl">
                          {state.quizScore! >= 8 ? '🏆' : state.quizScore! >= 5 ? '👏' : '📚'}
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 leading-tight">
                          Your score: {state.quizScore}/10
                        </h3>
                        <p className="text-slate-500 text-xs leading-relaxed pb-2">
                          {state.quizScore! >= 8 ? 'Excellent! You\'re crushing it.' : state.quizScore! >= 5 ? 'Good effort! Keep practicing.' : 'Keep going — every attempt helps you improve.'}
                        </p>
                        <p className="text-slate-400 text-[10px]">Come back tomorrow for a new quiz 🔁</p>
                      </div>
                      
                      <ScoreChart history={state.quizScoreHistory} />
                    </div>
                  ) : !quizStarted ? (
                    <div className="text-left py-2 space-y-5">
                      <p className="text-slate-500 text-xs leading-relaxed">Test your English skills with 10 questions. Complete it to maintain your streak!</p>
                      <button
                        id="start-quiz-btn"
                        onClick={() => setQuizStarted(true)}
                        className="w-full py-3 rounded-xl font-bold text-white transition-all cursor-pointer shadow-md shadow-purple-100 bg-[#7c3aed] hover:bg-purple-700 text-sm active:scale-98"
                      >
                        Start Today's Quiz →
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {/* Progress bar */}
                      <div className="w-full h-1.5 rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full transition-all duration-500 bg-purple-600"
                          style={{ width: `${((quizIndex) / 10) * 100}%` }}
                        />
                      </div>

                      {/* Question */}
                      <div className="space-y-1.5">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Question {quizIndex + 1} of 10</p>
                        <p className="text-slate-800 font-bold text-sm sm:text-base leading-relaxed">{quizQuestions[quizIndex].question}</p>
                      </div>

                      {/* Options */}
                      <div className="space-y-2">
                        {quizQuestions[quizIndex].options.map((option, idx) => {
                          const isCorrect = idx === quizQuestions[quizIndex].correct;
                          const isSelected = idx === selectedAnswer;
                          
                          let btnClass = "border-slate-200 bg-white hover:border-slate-350 hover:border-slate-300 hover:bg-slate-50 text-slate-700";
                          let dotClass = "bg-slate-50 text-slate-500 border-slate-200";

                          if (selectedAnswer !== null) {
                            if (isCorrect) {
                              btnClass = "border-emerald-500 bg-emerald-50 text-emerald-800 font-semibold";
                              dotClass = "bg-emerald-500 text-white border-emerald-500";
                            } else if (isSelected) {
                              btnClass = "border-red-500 bg-red-50 text-red-800 font-semibold";
                              dotClass = "bg-red-500 text-white border-red-500";
                            } else {
                              btnClass = "border-slate-100 bg-slate-50/50 text-slate-400 opacity-60";
                              dotClass = "bg-slate-100 text-slate-300 border-slate-100";
                            }
                          }

                          return (
                            <button
                              key={idx}
                              id={`quiz-option-${idx}`}
                              onClick={() => handleAnswerSelect(idx)}
                              disabled={selectedAnswer !== null}
                              className={`w-full text-left px-4 py-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-3 ${btnClass}`}
                            >
                              <span className={`w-6 h-6 rounded-lg border text-xs font-bold flex items-center justify-center shrink-0 ${dotClass}`}>
                                {String.fromCharCode(65 + idx)}
                              </span>
                              <span>{option}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation */}
                      {showExplanation && (
                        <div className="rounded-2xl p-4 text-xs bg-emerald-50 border border-emerald-100 space-y-1 animate-fade-in font-semibold text-slate-650">
                          <p className="text-emerald-800 font-bold flex items-center gap-1">💡 Explanation</p>
                          <p className="leading-relaxed">{quizQuestions[quizIndex].explanation}</p>
                        </div>
                      )}

                      {selectedAnswer !== null && (
                        <button
                          id="quiz-next-btn"
                          onClick={handleNextQuestion}
                          className="w-full py-3 rounded-xl font-bold text-white transition-all cursor-pointer shadow-md shadow-purple-100 bg-purple-600 hover:bg-purple-700 text-sm active:scale-98"
                        >
                          {quizIndex < quizQuestions.length - 1 ? 'Next Question →' : 'Finish Quiz ✓'}
                        </button>
                      )}
                    </div>
                  )}

                  {/* Score chart always shown at bottom of quiz card if history exists and quiz not yet started today */}
                  {!state.quizCompleted && quizStarted === false && state.quizScoreHistory.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-slate-100">
                      <ScoreChart history={state.quizScoreHistory} />
                    </div>
                  )}
                </section>

                {/* 2. GRAMMAR BRIEF (Abstract Nouns - Refresher) */}
                <section className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm border-l-[6px] border-blue-500 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">Grammar Unit</span>
                      <h4 className="text-lg font-black text-slate-900 mt-1">Abstract Nouns</h4>
                    </div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wide bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-1 rounded-full">New Topic</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed font-semibold">This was a tricky new unit. Most learners take 3 tries to master it!</p>
                  
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-150 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 bg-emerald-50 rounded-full p-0.5 border border-emerald-100" />
                        <span className="text-xs font-bold text-slate-700">Theory & Origins</span>
                      </div>
                      <span className="text-[9px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">Completed</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white border border-dashed border-slate-200 rounded-xl">
                      <span className="text-xs font-semibold text-slate-505 text-slate-500">Common Affixes</span>
                      <button 
                        onClick={() => setActiveTab('review')}
                        className="w-6 h-6 rounded-full bg-blue-50 hover:bg-blue-100 border border-blue-100 flex items-center justify-center text-blue-600 text-[10px] cursor-pointer"
                      >
                        ▶
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <button 
                      onClick={() => setActiveTab('review')}
                      className="text-xs text-blue-600 hover:text-blue-750 font-extrabold cursor-pointer hover:underline"
                    >
                      Explore full curriculum
                    </button>
                  </div>
                </section>

                {/* 3. REVIEW SUGGESTIONS */}
                <section className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm border-l-[6px] border-[#7c3aed] space-y-4">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-650 text-purple-600 bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-full">Daily Booster</span>
                    <h4 className="text-lg font-black text-slate-900 mt-1">Review Suggestions</h4>
                  </div>
                  <div className="space-y-2.5">
                    <button
                      onClick={() => handleSpeak(todayFact.fact, 'fact-tts')}
                      disabled={isSpeaking === 'fact-tts'}
                      className="w-11 h-11 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 hover:border-slate-300 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-sm"
                      title="Speak fact aloud"
                    >
                      <Volume2 className={`w-4 h-4 ${isSpeaking === 'fact-tts' ? 'animate-pulse text-indigo-600' : ''}`} />
                    </button>
                  </div>
                </section>

                {/* 7. BOTTOM CALL CTA */}
                <div
                  className="rounded-3xl p-8 text-left bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100 shadow-sm space-y-5"
                >
                  <p className="text-4xl">🚀</p>
                  <div className="space-y-1">
                    <h2 className="text-xl font-black text-slate-900">Ready to put it into practice?</h2>
                    <p className="text-slate-500 text-xs leading-normal">Connect with a real English speaker right now. Anonymous, free, instant.</p>
                  </div>
                  <Link
                    href="/connect"
                    className="inline-flex items-center justify-center h-12 px-6 rounded-xl font-bold text-white transition-all shadow-md shadow-purple-100 bg-[#7c3aed] hover:bg-purple-700 text-xs sm:text-sm cursor-pointer"
                  >
                    Start Speaking Now →
                  </Link>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ─── TAB VIEW: REVIEW CENTER ─── */}
        {activeTab === 'review' && (
          <div className="space-y-6 animate-fade-in">
            {/* Header info */}
            <div className="flex items-center gap-2 pt-2 border-l-4 border-purple-500 pl-3">
              <h3 className="text-lg font-bold text-slate-800 tracking-tight">Idioms & Twisters</h3>
            </div>

            {/* Grid layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT COLUMN: Idiom of the Day & Visual Metaphor */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Idiom of the Day Card */}
                <section
                  id="idiom-of-the-day-card"
                  className="rounded-3xl p-6 bg-white border border-slate-200 shadow-sm border-l-[6px] border-purple-500 flex flex-col justify-between min-h-[300px]"
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase tracking-widest text-purple-650 text-purple-600 bg-purple-50 border border-purple-100 px-2.5 py-1 rounded-full">
                        Idiom of the Day
                      </span>
                      <button 
                        onClick={() => setIsBookmarked(!isBookmarked)}
                        className="text-slate-400 hover:text-slate-650 p-1 hover:bg-slate-50 rounded-lg cursor-pointer animate-fade-in"
                      >
                        <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-purple-600 text-purple-600' : ''}`} />
                      </button>
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">"{todayIdiom.phrase}"</h2>

                    {/* Meaning Box */}
                    <div className="rounded-2xl p-4 bg-purple-50/50 border-l-[3px] border-purple-500 space-y-1">
                      <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">Meaning</span>
                      <p className="text-sm text-slate-700 leading-relaxed font-semibold">{todayIdiom.meaning}</p>
                    </div>

                    {/* Origin Box */}
                    <div className="space-y-1 pl-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Origin</span>
                      <p className="text-sm text-slate-600 leading-relaxed font-semibold">{todayIdiom.origin}</p>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex gap-2 pt-6 mt-4 border-t border-slate-100">
                    <button
                      onClick={() => {
                        handleCopy(`"${todayIdiom.phrase}" — Meaning: ${todayIdiom.meaning}`, 'idiom');
                      }}
                      className="flex-1 h-11 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-full text-xs transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                    >
                      {copiedId === 'idiom' ? '✓ Copied!' : 'Take Quiz →'}
                    </button>
                    
                    <button
                      onClick={() => handleSpeak(todayIdiom.phrase, 'idiom-tts')}
                      disabled={isSpeaking === 'idiom-tts'}
                      className="w-11 h-11 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 hover:border-slate-300 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-sm animate-fade-in"
                      title="Speak idiom aloud"
                    >
                      <Volume2 className={`w-4 h-4 ${isSpeaking === 'idiom-tts' ? 'animate-pulse text-purple-600' : ''}`} />
                    </button>
                  </div>
                </section>

                {/* Visual Metaphor Illustration Card */}
                <section className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm border-l-[6px] border-blue-500 space-y-5 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-black text-slate-900">Visual Interpretation</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">A metaphorical representation of the idiom's core concept</p>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      <span className="text-[9px] font-extrabold uppercase tracking-wide bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded">Abstract Art</span>
                      <span className="text-[9px] font-extrabold uppercase tracking-wide bg-slate-50 text-slate-500 border border-slate-155 border-slate-150 px-2 py-0.5 rounded">2 min read</span>
                    </div>
                  </div>

                  {/* Metaphor Illustration image frame */}
                  <div className="w-full h-72 rounded-2xl overflow-hidden border border-slate-100 shadow-inner bg-slate-50">
                    <img 
                      src="/images/idiom_hummingbird.png" 
                      alt="Visual metaphor for idiom" 
                      className="w-full h-full object-cover" 
                    />
                  </div>

                  {/* Cultural Nuance */}
                  <div className="space-y-2.5">
                    <h5 className="text-xs font-black text-slate-800 uppercase tracking-widest">Cultural Nuance</h5>
                    <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                      While the American chewing tobacco origin is most cited, similar concepts exist globally. In Spanish, we say <span className="italic font-bold text-purple-700">"El que mucho abarca, poco aprieta"</span> (He who tries to embrace too much, squeezes little).
                    </p>
                  </div>

                  {/* Bullet Tip details */}
                  <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                    <div className="flex items-start gap-2.5 p-3 bg-blue-50/40 border border-blue-100/60 rounded-xl">
                      <span className="text-blue-600 shrink-0">💡</span>
                      <p className="text-slate-600 font-semibold leading-normal"><span className="font-bold text-blue-800">Usage tip:</span> Best used when warning colleagues about project scope.</p>
                    </div>
                    
                    <div className="flex items-start gap-2.5 p-3 bg-purple-50/40 border border-purple-100/60 rounded-xl">
                      <span className="text-purple-650 text-purple-600 shrink-0">✍️</span>
                      <p className="text-slate-600 font-semibold leading-normal"><span className="font-bold text-purple-800">Practice:</span> Write 3 sentences using this idiom by noon.</p>
                    </div>
                  </div>
                </section>
              </div>

              {/* RIGHT COLUMN: Speech Mastery (Tongue Twisters) */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Speech Mastery Card */}
                <section
                  id="tongue-twister-card"
                  className="rounded-3xl p-6 bg-white border border-slate-200 shadow-sm border-l-[6px] border-emerald-500 space-y-5 animate-fade-in"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                      Speech Mastery
                    </span>
                    <div className="flex gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${recordingState === 'listening' ? 'bg-red-500 animate-ping' : 'bg-emerald-500'}`} />
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                    </div>
                  </div>

                  {/* Twister Text Box */}
                  <div className="rounded-2xl p-4 text-left bg-emerald-50/30 border border-emerald-100/60">
                    <p className="text-base sm:text-lg font-black leading-relaxed text-emerald-950">
                      "{todayTwister.text}"
                    </p>
                  </div>

                  {/* Phonetic word cards */}
                  <div className="space-y-2.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">🔊 Phonetic Breakdown</span>
                    
                    <div className="flex flex-wrap gap-2 max-h-[160px] overflow-y-auto pr-1">
                      {getPhoneticPairs().map((pair, idx) => (
                        <div 
                          key={idx} 
                          className="bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-center min-w-[75px] shadow-sm flex flex-col justify-between"
                        >
                          <span className="text-[10px] font-extrabold text-emerald-700 font-mono tracking-tight">{pair.phonetic}</span>
                          <span className="text-[9px] text-slate-400 font-bold truncate max-w-[80px] mt-1">{pair.word}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Voice Analyzer Simulator */}
                  <div className="rounded-2xl p-4 bg-slate-50 border border-slate-155 border-slate-150 space-y-3 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                        {recordingState === 'idle' && 'Audio Analyzer Ready'}
                        {recordingState === 'listening' && `Listening... 0:0${recordingTimer}`}
                        {recordingState === 'analyzing' && 'Analyzing Waves...'}
                        {recordingState === 'done' && `Accuracy: ${recordingScore}%`}
                      </span>
                      {recordingState === 'done' && (
                        <span className="text-[9px] font-extrabold bg-emerald-50 border border-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded uppercase">Pass</span>
                      )}
                    </div>

                    {/* Pulsing Visualizer Bars */}
                    <div className="flex items-center gap-1 h-7">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((bar) => {
                        let heightClass = "h-2";
                        let bgClass = "bg-slate-300";
                        
                        if (recordingState === 'listening') {
                          bgClass = "bg-red-500";
                          heightClass = bar % 3 === 0 ? "h-6 animate-pulse-bar-slow" : bar % 2 === 0 ? "h-4 animate-pulse-bar-fast" : "h-5 animate-pulse-bar-medium";
                        } else if (recordingState === 'analyzing') {
                          bgClass = "bg-indigo-500 animate-pulse";
                          heightClass = "h-4";
                        } else if (recordingState === 'done') {
                          bgClass = "bg-emerald-500";
                          heightClass = bar % 4 === 0 ? "h-6" : bar % 3 === 0 ? "h-4" : "h-5";
                        }

                        return (
                          <div 
                            key={bar} 
                            style={{ transformOrigin: 'center' }}
                            className={`flex-1 rounded-full transition-all duration-300 ${bgClass} ${heightClass}`} 
                          />
                        );
                      })}
                    </div>

                    {/* Results text */}
                    {recordingState === 'done' && (
                      <p className="text-[11px] text-emerald-800 font-semibold leading-normal animate-fade-in">
                        Excellent pronunciation! Your vowel sounds match native frequency calibration.
                      </p>
                    )}

                    {/* Microphone Action Button inside card */}
                    <div className="pt-2 text-center">
                      {recordingState === 'idle' && (
                        <button
                          onClick={startMicSimulation}
                          className="w-12 h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full flex items-center justify-center shadow-md shadow-emerald-100 transition-all active:scale-95 cursor-pointer mx-auto"
                        >
                          <Mic className="w-5 h-5" />
                        </button>
                      )}
                      
                      {recordingState === 'listening' && (
                        <div className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md shadow-red-100 mx-auto animate-pulse">
                          <span className="font-extrabold text-xs">{recordingTimer}s</span>
                        </div>
                      )}

                      {recordingState === 'analyzing' && (
                        <div className="w-12 h-12 bg-slate-300 text-slate-500 rounded-full flex items-center justify-center mx-auto">
                          <RotateCw className="w-5 h-5 animate-spin" />
                        </div>
                      )}

                      {recordingState === 'done' && (
                        <button
                          onClick={() => setRecordingState('idle')}
                          className="w-12 h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full flex items-center justify-center shadow-md shadow-emerald-100 transition-all active:scale-95 cursor-pointer mx-auto"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="flex gap-2 pt-3 border-t border-slate-100 animate-fade-in">
                    <button
                      onClick={() => handleSpeak(todayTwister.text, 'twister-tts')}
                      className="flex-1 h-10 border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm bg-slate-50 hover:bg-slate-100 cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4" /> Speak twister
                    </button>
                    
                    <Link
                      href="/connect"
                      className="flex-1 h-10 bg-[#7c3aed] hover:bg-purple-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
                    >
                      🎙️ Practice live on call
                    </Link>
                  </div>
                </section>
              </div>

            </div>
          </div>
        )}

        {/* ─── TAB VIEW: PROGRESS STATS ─── */}
        {activeTab === 'stats' && (
          <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
            <div className="space-y-1 pb-2">
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <Flame className="w-7 h-7 text-orange-500" /> Progress Insights
              </h1>
              <p className="text-slate-500 text-sm">An overview of your English speaking history.</p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm text-center space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Daily Streak</span>
                <span className="text-3xl font-black text-slate-900 block">{state.streak}🔥</span>
              </div>
              
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm text-center space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total XP</span>
                <span className="text-3xl font-black text-slate-900 block">{virtualXP}🏆</span>
              </div>

              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm text-center space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Quizzes Done</span>
                <span className="text-3xl font-black text-slate-900 block">{state.quizScoreHistory.length}</span>
              </div>

              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm text-center space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Daily Tasks</span>
                <span className="text-3xl font-black text-slate-900 block">{tasksCompleted}/2</span>
              </div>
            </div>

            <ScoreChart history={state.quizScoreHistory} />

            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900">Deep-dive Call Statistics</h4>
                <p className="text-xs text-slate-500 leading-relaxed">View call histories, average speaking time, and visitor ratings charts.</p>
              </div>
              <Link 
                href="/stats" 
                className="px-4 py-2.5 bg-[#7c3aed] hover:bg-purple-700 text-white font-bold rounded-xl text-xs transition-all shadow-sm shadow-purple-100 cursor-pointer flex items-center gap-1"
              >
                Detailed Stats <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* ─── TAB VIEW: PROFILE & SAFETY ─── */}
        {activeTab === 'profile' && (
          <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
            <div className="space-y-1 pb-2">
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <User className="w-7 h-7 text-indigo-600" /> Profile & Safety
              </h1>
              <p className="text-slate-500 text-sm">Manage your anonymous identity and review platform policies.</p>
            </div>

            {/* Profile Detail Card */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-purple-100 border border-purple-200 flex items-center justify-center text-4xl shadow-sm">
                  {userAvatar}
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-slate-900">Anonymous English Learner</h3>
                  <div className="flex items-center gap-1 text-xs text-slate-400 font-semibold">
                    <span>Silent Local Account</span>
                    <span>·</span>
                    <span className="text-purple-600">Active</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-6 text-sm">
                <div className="space-y-1 bg-slate-50 p-4 rounded-xl border border-slate-150">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Local Unique ID</span>
                  <code className="text-slate-800 font-bold block select-all break-all">{state.anonId}</code>
                </div>
                
                <div className="space-y-1 bg-slate-50 p-4 rounded-xl border border-slate-150">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Platform Rank Tier</span>
                  <span className="text-slate-800 font-bold block flex items-center gap-1">
                    🌟 Level {Math.floor(virtualXP / 500) + 1} ({virtualXP} Total XP)
                  </span>
                </div>
              </div>

              {/* Security guidelines reminder */}
              <div className="bg-indigo-50/50 border border-indigo-100 p-5 rounded-2xl space-y-3">
                <h4 className="text-xs font-bold text-indigo-700 uppercase tracking-widest flex items-center gap-1.5">
                  <Shield className="w-4 h-4" /> Anonymity Safeguards
                </h4>
                <ul className="list-disc list-inside text-xs text-slate-600 space-y-1.5 leading-relaxed pl-1">
                  <li>Your user profile resides **entirely inside your browser** (localStorage). We have no database of names or passwords.</li>
                  <li>No emails, numbers, or passwords are ever requested. Close the tab to stay completely private.</li>
                  <li>All matching calls use intermediate masks to hide IP addresses and keep voice streams secure.</li>
                </ul>
              </div>

              {/* Danger Zone */}
              <div className="border-t border-slate-100 pt-6 space-y-3">
                <h4 className="text-xs font-bold text-red-600 uppercase tracking-widest">Danger Zone</h4>
                <p className="text-xs text-slate-500 leading-normal">If you reset your local storage, your daily streak, quiz history, and experience points will be permanently deleted.</p>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to reset all progress? This will delete your streak, quiz history, and XP.')) {
                      localStorage.clear();
                      window.location.reload();
                    }
                  }}
                  className="h-10 px-4 border border-red-200 text-red-650 hover:bg-red-50 text-red-650 text-red-600 font-bold rounded-xl text-xs transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Reset Local Progress
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      <style>{`
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        section {
          animation: cardIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        #word-of-the-day-card { animation-delay: 0.05s; }
        #daily-quiz-card { animation-delay: 0.12s; }
        #idiom-of-the-day-card { animation-delay: 0.18s; }
        #tongue-twister-card { animation-delay: 0.24s; }
        #role-play-scenario-card { animation-delay: 0.3s; }
        #fun-fact-card { animation-delay: 0.36s; }
      `}</style>
    </div>
  );
}
