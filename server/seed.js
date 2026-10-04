import { initDatabase } from './db.js';
import db from './db.js';
import { hashPassword } from './auth.js';
import { createPcmWav } from './audioSynth.js';

console.log('[Seed] Initializing database and creating demo data...');
initDatabase();

// Clean existing data for clean seed
db.prepare('DELETE FROM evaluations').run();
db.prepare('DELETE FROM notifications').run();
db.prepare('DELETE FROM attempts').run();
db.prepare('DELETE FROM questions').run();
db.prepare('DELETE FROM passages').run();
db.prepare('DELETE FROM audio_files').run();
db.prepare('DELETE FROM writing_tasks').run();
db.prepare('DELETE FROM speaking_tasks').run();
db.prepare('DELETE FROM test_sections').run();
db.prepare('DELETE FROM scoring_rules').run();
db.prepare('DELETE FROM tests').run();
db.prepare('DELETE FROM settings').run();
db.prepare('DELETE FROM users').run();

// 1. Seed System Settings
const insertSetting = db.prepare(`
  INSERT INTO settings (key, value, description) VALUES (?, ?, ?)
`);

insertSetting.run('brand_name', 'MEGAMIND PLUS', 'Main Brand Name');
insertSetting.run('sub_brand', 'IELTS MOCK TEST', 'Sub-brand for IELTS testing portal');
insertSetting.run('tagline', 'Practice Like the Real Test. Perform With Confidence.', 'Platform Tagline');
insertSetting.run('primary_color', '#C7202D', 'Megamind Primary Brand Red');
insertSetting.run('rounding_mode', 'standard', 'IELTS rounding mode: standard (0.25/0.75 rule) or exact');
insertSetting.run('registration_enabled', 'true', 'Allow public student registrations');
insertSetting.run('maintenance_mode', 'false', 'Enable maintenance mode');
insertSetting.run('contact_email', 'support@megamindplus.com', 'Support contact email');
insertSetting.run('contact_phone', '+880 1700-000000', 'Contact Phone number');

// 2. Seed Users
const insertUser = db.prepare(`
  INSERT INTO users (id, email, password_hash, full_name, phone, role, target_band, test_type, current_level, target_test_date, status)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

// Admin
insertUser.run(
  'usr_admin_01',
  'admin@megamindplus.com',
  hashPassword('admin123'),
  'Megamind Admin',
  '+880 1811-111111',
  'admin',
  8.5,
  'academic',
  'expert',
  '2026-12-31',
  'active'
);

// Teacher / Evaluator
insertUser.run(
  'usr_teacher_01',
  'evaluator@megamindplus.com',
  hashPassword('teacher123'),
  'Dr. Sarah Jenkins (Senior IELTS Evaluator)',
  '+880 1822-222222',
  'teacher',
  8.5,
  'academic',
  'expert',
  '2026-12-31',
  'active'
);

// Demo Student 1
insertUser.run(
  'usr_student_01',
  'student@megamindplus.com',
  hashPassword('student123'),
  'Tanvir Ahmed',
  '+880 1712-345678',
  'student',
  7.5,
  'academic',
  'upper-intermediate',
  '2026-11-20',
  'active'
);

// Demo Student 2
insertUser.run(
  'usr_student_02',
  'nusrat.jahan@gmail.com',
  hashPassword('student123'),
  'Nusrat Jahan',
  '+880 1799-887766',
  'student',
  7.0,
  'academic',
  'intermediate',
  '2026-12-15',
  'active'
);

console.log('[Seed] Users created: Admin (admin@megamindplus.com), Teacher (evaluator@megamindplus.com), Student (student@megamindplus.com)');

// 3. Helper functions for Tests
const insertTest = db.prepare(`
  INSERT INTO tests (id, title, test_type, category, difficulty, duration_minutes, status, description, sections_count, total_questions)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertSection = db.prepare(`
  INSERT INTO test_sections (id, test_id, section_type, title, instructions, order_index, duration_minutes, total_questions)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertPassage = db.prepare(`
  INSERT INTO passages (id, section_id, title, subtitle, content_html, passage_number, order_index)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const insertAudio = db.prepare(`
  INSERT INTO audio_files (id, section_id, title, file_url, audio_data, duration_seconds, part_number, transcript)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertQuestion = db.prepare(`
  INSERT INTO questions (id, section_id, passage_id, audio_id, part_number, question_number, question_type, prompt, instructions, options_json, correct_answer_json, explanation, marks, difficulty, order_index)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertWritingTask = db.prepare(`
  INSERT INTO writing_tasks (id, section_id, task_number, title, prompt, instructions, min_words, suggested_time_minutes, chart_image_url)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertSpeakingTask = db.prepare(`
  INSERT INTO speaking_tasks (id, section_id, part_number, title, prompt, instructions, prep_time_seconds, speak_time_seconds, cue_card_points_json)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

// Sample Audio URI
const sampleAudio1 = createPcmWav(22050, 20, 520);
const sampleAudio2 = createPcmWav(22050, 20, 580);
const sampleAudio3 = createPcmWav(22050, 20, 640);
const sampleAudio4 = createPcmWav(22050, 20, 700);

// ==========================================
// TEST 1: IELTS Academic Mock Test 01 (Full)
// ==========================================
const test1Id = 'test_acad_01';
insertTest.run(
  test1Id,
  'IELTS Academic Mock Test 01 - Full CBT Simulation',
  'academic',
  'full',
  'standard',
  165,
  'published',
  'Comprehensive 4-skill computer-based IELTS practice test simulating real examination conditions with audio, reading split screen, automated band conversion, and official timed sections.',
  4,
  40
);

// Section 1: Listening
const sec1Listen = 'sec_t1_listen';
insertSection.run(sec1Listen, test1Id, 'listening', 'Listening Test', 'The Listening test consists of 4 parts with 10 questions each. You will hear each recording ONCE only. Answer all 40 questions.', 1, 30, 40);

// Audio files for 4 parts
insertAudio.run('aud_t1_p1', sec1Listen, 'Part 1: Accommodation Inquiry & Student Services', '/audio/listen_p1.wav', sampleAudio1, 360, 1, 'Receptionist: Good morning, City Accommodation Services. How can I help you? Student: Hello, I am calling to inquire about housing options near the campus...');
insertAudio.run('aud_t1_p2', sec1Listen, 'Part 2: Local Community Center Facilities Guide', '/audio/listen_p2.wav', sampleAudio2, 380, 2, 'Speaker: Welcome everyone to the Riverside Leisure Center orientation. Today I will guide you through our newly renovated recreational facilities...');
insertAudio.run('aud_t1_p3', sec1Listen, 'Part 3: Academic Tutorial on Sustainable Energy', '/audio/listen_p3.wav', sampleAudio3, 400, 3, 'Tutor: Good afternoon Sarah and Liam. Let us review your draft research proposal on solar battery grid integration...');
insertAudio.run('aud_t1_p4', sec1Listen, 'Part 4: Lecture on Marine Ecosystem Restoration', '/audio/listen_p4.wav', sampleAudio4, 420, 4, 'Professor: In today’s environmental biology lecture, we will examine the historical decline and modern acoustic restoration techniques of coral reef biomes...');

// 40 Listening Questions
// Part 1 (1-10) Form & Note Completion
const p1Questions = [
  { q: 1, type: 'form_completion', prompt: 'Preferred accommodation type: [1]', ans: ['studio', 'studio apartment'], exp: 'The caller states she wants a quiet studio apartment.', opt: null },
  { q: 2, type: 'form_completion', prompt: 'Maximum monthly budget: £ [2]', ans: ['650', '650 pounds'], exp: 'The student explicitly mentions her upper limit is 650 pounds.', opt: null },
  { q: 3, type: 'form_completion', prompt: 'Desired move-in date: [3] September', ans: ['15th', '15', '15 September'], exp: 'She confirms her flight arrives on the 14th, so move-in is 15th.', opt: null },
  { q: 4, type: 'form_completion', prompt: 'Distance from central library: within [4] minutes walk', ans: ['20', 'twenty'], exp: 'She requests a maximum 20-minute walking distance.', opt: null },
  { q: 5, type: 'note_completion', prompt: 'Kitchen facilities must include an electric [5]', ans: ['cooker', 'stove', 'oven'], exp: 'She mentions needing an electric cooker in the kitchenette.', opt: null },
  { q: 6, type: 'multiple_choice', prompt: 'Which utility bill is included in the rent?', ans: ['Water and Wi-Fi'], exp: 'The manager notes that water rates and broadband Wi-Fi are fully inclusive.', opt: ['Electricity only', 'Water and Wi-Fi', 'Gas heating only', 'Council tax'] },
  { q: 7, type: 'multiple_choice', prompt: 'Where is the security deposit held?', ans: ['In a government protection scheme'], exp: 'Deposits are lodged in the national tenancy protection scheme.', opt: ['With the landlord directly', 'In a government protection scheme', 'At the university office', 'In a shared bank vault'] },
  { q: 8, type: 'form_completion', prompt: 'Contact telephone number: 07700 [8]', ans: ['900452', '900 452'], exp: 'The student spells out the remaining digits 9-0-0-4-5-2.', opt: null },
  { q: 9, type: 'form_completion', prompt: 'Emergency contact person: [9] (Uncle)', ans: ['Arthur Davies', 'Arthur', 'Davies'], exp: 'She gives her uncle’s full name as Arthur Davies.', opt: null },
  { q: 10, type: 'short_answer', prompt: 'What identification document must be brought to the viewing?', ans: ['passport', 'student passport'], exp: 'The agent reminds her to bring her passport.', opt: null }
];

p1Questions.forEach(item => {
  insertQuestion.run(
    `q_t1_l_${item.q}`,
    sec1Listen,
    null,
    'aud_t1_p1',
    1,
    item.q,
    item.type,
    item.prompt,
    'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
    item.opt ? JSON.stringify(item.opt) : null,
    JSON.stringify(item.ans),
    item.explanation,
    1,
    'easy',
    item.q
  );
});

// Part 2 (11-20) Multiple Choice & Map Labelling
const p2Questions = [
  { q: 11, type: 'multiple_choice', prompt: 'When was the community center originally founded?', ans: ['1984'], exp: 'The speaker states the original foundation stone was laid in 1984.', opt: ['1972', '1984', '1996', '2005'] },
  { q: 12, type: 'multiple_choice', prompt: 'What is the newest facility added during the recent expansion?', ans: ['Hydrotherapy wellness pool'], exp: 'The hydrotherapy pool was opened last month as part of Phase 2.', opt: ['Olympic running track', 'Hydrotherapy wellness pool', 'Indoor climbing wall', 'Squash court annex'] },
  { q: 13, type: 'multiple_choice', prompt: 'Junior membership is available for young people aged up to:', ans: ['17'], exp: 'Junior tier applies to everyone under 18 (up to 17 years).', opt: ['14', '16', '17', '19'] },
  { q: 14, type: 'multiple_choice', prompt: 'Members receive free parking for a maximum duration of:', ans: ['3 hours'], exp: 'The parking gate ticket gives up to 3 complimentary hours.', opt: ['1 hour', '2 hours', '3 hours', 'All day'] },
  { q: 15, type: 'matching', prompt: 'Gymnasium area on the site map is located at:', ans: ['Location B'], exp: 'Directly opposite the main reception foyer is Location B.', opt: ['Location A', 'Location B', 'Location C', 'Location D'] },
  { q: 16, type: 'matching', prompt: 'Cafe and refreshment patio is located at:', ans: ['Location D'], exp: 'Overlooking the south gardens at Location D.', opt: ['Location A', 'Location B', 'Location C', 'Location D'] },
  { q: 17, type: 'note_completion', prompt: 'Yoga classes are held every Tuesday at [17] am', ans: ['08:30', '8:30', '8.30'], exp: 'Morning yoga starts promptly at 8:30 am.', opt: null },
  { q: 18, type: 'note_completion', prompt: 'Swimmers must wear a silicone [18] at all times.', ans: ['cap', 'swimming cap'], exp: 'Hygiene rules require a silicone swimming cap.', opt: null },
  { q: 19, type: 'short_answer', prompt: 'What item must be placed in lockers for security?', ans: ['padlock', 'coin'], exp: 'Lockers require members to bring their own padlock.', opt: null },
  { q: 20, type: 'multiple_choice', prompt: 'How can members book popular weekend sessions?', ans: ['Through the mobile app up to 7 days in advance'], exp: 'App bookings open 7 days beforehand at midnight.', opt: ['Only in person at the desk', 'Through the mobile app up to 7 days in advance', 'By sending a postal voucher', 'Phone calls on Friday morning only'] }
];

p2Questions.forEach(item => {
  insertQuestion.run(
    `q_t1_l_${item.q}`,
    sec1Listen,
    null,
    'aud_t1_p2',
    2,
    item.q,
    item.type,
    item.prompt,
    'Choose the correct letter, A, B, C, or D, or write the appropriate word.',
    item.opt ? JSON.stringify(item.opt) : null,
    JSON.stringify(item.ans),
    item.explanation,
    1,
    'medium',
    item.q
  );
});

// Part 3 (21-30) Discussion / Research Analysis
const p3Questions = [
  { q: 21, type: 'multiple_choice', prompt: 'Why did Sarah select microgrid resilience for her case study?', ans: ['It addresses real-world island energy blackouts'], exp: 'She explains that island grids face severe instability during monsoon seasons.', opt: ['It was the easiest topic available', 'It addresses real-world island energy blackouts', 'Her supervisor assigned it automatically', 'Funding was already guaranteed'] },
  { q: 22, type: 'multiple_choice', prompt: 'What unexpected finding did Liam uncover in the primary data?', ans: ['Household solar battery degradation was faster than manufacturer claims'], exp: 'Liam highlights a 14% higher battery cell degradation rate.', opt: ['Energy demand dropped during winter', 'Household solar battery degradation was faster than manufacturer claims', 'Wind turbines were more popular than solar panels', 'Government subsidies were doubled'] },
  { q: 23, type: 'multiple_choice', prompt: 'What advice does the tutor give regarding the literature review chapter?', ans: ['Synthesize themes rather than listing individual author papers'], exp: 'The tutor emphasizes thematic synthesis over chronological summaries.', opt: ['Shorten it to under 500 words', 'Synthesize themes rather than listing individual author papers', 'Exclude papers published before 2024', 'Add more personal opinions'] },
  { q: 24, type: 'multiple_choice', prompt: 'Which statistical software do the students decide to use for regression analysis?', ans: ['R Studio'], exp: 'Both agree that R Studio offers superior open-source statistical packages.', opt: ['SPSS', 'Excel', 'R Studio', 'Matlab'] },
  { q: 25, type: 'matching', prompt: 'Data Collection Phase responsibility:', ans: ['Shared equally by Liam and Sarah'], exp: 'Both will conduct survey interviews in parallel.', opt: ['Liam only', 'Sarah only', 'Shared equally by Liam and Sarah', 'External research assistant'] },
  { q: 26, type: 'matching', prompt: 'Cost-Benefit Financial Modelling responsibility:', ans: ['Liam only'], exp: 'Liam has the background in financial engineering.', opt: ['Liam only', 'Sarah only', 'Shared equally by Liam and Sarah', 'External research assistant'] },
  { q: 27, type: 'sentence_completion', prompt: 'The sample size will consist of [27] local business owners.', ans: ['120', 'one hundred and twenty'], exp: 'They target exactly 120 commercial survey respondents.', opt: null },
  { q: 28, type: 'sentence_completion', prompt: 'All interview transcripts must be anonymized to protect participant [28]', ans: ['privacy', 'confidentiality'], exp: 'Ethics board rules mandate strict participant privacy.', opt: null },
  { q: 29, type: 'sentence_completion', prompt: 'The final draft deadline is the end of [29]', ans: ['November', 'Nov'], exp: 'Submission is fixed for the final Friday of November.', opt: null },
  { q: 30, type: 'multiple_choice', prompt: 'What will be the next immediate step before fieldwork starts?', ans: ['Obtain formal university ethics committee approval'], exp: 'Ethics clearance is required before any survey distribution.', opt: ['Print 500 paper survey copies', 'Obtain formal university ethics committee approval', 'Book international flights', 'Publish preliminary results on a blog'] }
];

p3Questions.forEach(item => {
  insertQuestion.run(
    `q_t1_l_${item.q}`,
    sec1Listen,
    null,
    'aud_t1_p3',
    3,
    item.q,
    item.type,
    item.prompt,
    'Answer the questions by choosing the correct option or completing the sentence.',
    item.opt ? JSON.stringify(item.opt) : null,
    JSON.stringify(item.ans),
    item.explanation,
    1,
    'medium',
    item.q
  );
});

// Part 4 (31-40) Academic Lecture
const p4Questions = [
  { q: 31, type: 'note_completion', prompt: 'Healthy coral reefs generate a distinct underwater [31] created by marine fauna.', ans: ['soundscape', 'noise', 'sound'], exp: 'The lecture highlights the biophonic soundscape produced by snapping shrimp and reef fish.', opt: null },
  { q: 32, type: 'note_completion', prompt: 'Degraded bleached reefs are dangerously [32] to young fish larvae.', ans: ['silent', 'quiet'], exp: 'Larvae fail to locate dead reefs because they lack acoustic signatures.', opt: null },
  { q: 33, type: 'note_completion', prompt: 'Researchers deployed underwater [33] to broadcast healthy sound recordings.', ans: ['loudspeakers', 'speakers', 'acoustic speakers'], exp: 'Solar-powered underwater loudspeakers were positioned around degraded patch reefs.', opt: null },
  { q: 34, type: 'note_completion', prompt: 'Acoustic enrichment increased fish settlement rates by [34] percent.', ans: ['50', 'fifty'], exp: 'The published field data confirmed a 50% boost in larval recruitment.', opt: null },
  { q: 35, type: 'note_completion', prompt: 'Grazing herbivores like [35] fish prevent suffocating algae blooms.', ans: ['parrotfish', 'parrot'], exp: 'Parrotfish are vital grazers that keep macroalgae in check.', opt: null },
  { q: 36, type: 'note_completion', prompt: 'The study was conducted across the northern region of the Great [36] Reef.', ans: ['Barrier', 'Barrier Reef'], exp: 'Field trials took place on the northern Great Barrier Reef in Australia.', opt: null },
  { q: 37, type: 'note_completion', prompt: 'Long-term monitoring showed a doubling in overall species [37]', ans: ['diversity', 'richness'], exp: 'Species diversity and richness doubled over the 18-month monitoring cycle.', opt: null },
  { q: 38, type: 'note_completion', prompt: 'Acoustic playback must be paired with reductions in global carbon [38]', ans: ['emissions', 'emission'], exp: 'The professor cautions that sound alone cannot counter warming oceans without emissions cuts.', opt: null },
  { q: 39, type: 'multiple_choice', prompt: 'What is the main limitation of acoustic restoration?', ans: ['It cannot protect corals against extreme marine heatwaves'], exp: 'Acoustics attracts fish but does not alter seawater temperature.', opt: ['Fish become deaf over time', 'It cannot protect corals against extreme marine heatwaves', 'It requires radioactive isotopes', 'The equipment is eaten by sharks'] },
  { q: 40, type: 'note_completion', prompt: 'Future trials will integrate artificial [40] 3D structures with acoustic cues.', ans: ['reef', 'reefs', 'substrate'], exp: 'Future pilots combine 3D-printed ceramic artificial reef substrates with audio beacons.', opt: null }
];

p4Questions.forEach(item => {
  insertQuestion.run(
    `q_t1_l_${item.q}`,
    sec1Listen,
    null,
    'aud_t1_p4',
    4,
    item.q,
    item.type,
    item.prompt,
    'Complete the lecture notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
    item.opt ? JSON.stringify(item.opt) : null,
    JSON.stringify(item.ans),
    item.explanation,
    1,
    'hard',
    item.q
  );
});

// Section 2: Reading
const sec1Read = 'sec_t1_read';
insertSection.run(sec1Read, test1Id, 'reading', 'Academic Reading Test', 'The Academic Reading test consists of 3 passages with a total of 40 questions. You have 60 minutes to complete the test.', 2, 60, 40);

// Passage 1
const pas1Content = `
<h3>Passage 1: The Evolutionary History of Urban Apiculture</h3>
<p><strong>Paragraph A</strong><br>
Urban beekeeping, or urban apiculture, has transformed from an eccentric rooftop hobby into a cornerstone of contemporary metropolitan biodiversity strategy. Over the past two decades, major global cities including London, Paris, Melbourne, and Tokyo have witnessed an unprecedented resurgence in managed honeybee (<em>Apis mellifera</em>) populations. While historically confined to pastoral agrarian landscapes, honeybees have demonstrated a startling adaptability to dense architectural canyons, flourishing in microclimates that provide buffered seasonal temperatures and prolonged floral blooming cycles.</p>

<p><strong>Paragraph B</strong><br>
Ecological surveys conducted by urban biodiversity researchers reveal surprising advantages inherent to city environments. Unlike industrial agricultural monocultures—frequently characterized by toxic agrochemical runoff and vast single-crop deserts that bloom for only three weeks before becoming floral voids—metropolitan green networks feature highly heterogeneous botanical resources. Municipal botanical gardens, private residential balconies, pocket parks, and neglected railway verges provide an uninterrupted succession of nectar and pollen sources from early spring through late autumn.</p>

<p><strong>Paragraph C</strong><br>
However, the rapid saturation of urban honeybees is not without controversy. Recent conservation biology studies warn of the "honeybee paradox." Because honeybees are a domesticated livestock species rather than wild wildlife, super-dense apiaries can exert overwhelming competitive foraging pressure on native solitary bees, bumblebees, and hoverflies. In dense central boroughs where hive density exceeds ten hives per square kilometer, researchers observed significant floral resource depletion, causing a 35% decline in native pollinator nesting success.</p>

<p><strong>Paragraph D</strong><br>
To reconcile these tensions, progressive municipal authorities are adopting evidence-based pollinator management zoning. In Zurich and Melbourne, new regulations require commercial hive operators to register coordinates and maintain minimum spatial buffers from designated wild insect reserves. Simultaneously, city planners are mandating the inclusion of native wildflower green roofs on all commercial developments over eight stories, expanding floral biomass to sustain both domestic and wild insect communities in harmonious coexistence.</p>
`;

insertPassage.run('pas_t1_1', sec1Read, 'The Evolutionary History of Urban Apiculture', 'How honeybees adapted to city rooftops and the emerging ecological tensions with native species', pas1Content, 1, 1);

// Passage 1 Questions (1-13)
const rPas1Questions = [
  { q: 1, type: 'matching_headings', prompt: 'Which paragraph discusses the unexpected botanical diversity of metropolitan environments compared to rural monocultures?', ans: ['Paragraph B'], exp: 'Paragraph B explicitly contrasts rural single-crop deserts with diverse city botanical gardens and balconies.', opt: ['Paragraph A', 'Paragraph B', 'Paragraph C', 'Paragraph D'] },
  { q: 2, type: 'matching_headings', prompt: 'Which paragraph outlines regulatory measures and architectural requirements to protect wild pollinators?', ans: ['Paragraph D'], exp: 'Paragraph D details municipal zoning in Zurich and Melbourne requiring green roofs and spatial buffers.', opt: ['Paragraph A', 'Paragraph B', 'Paragraph C', 'Paragraph D'] },
  { q: 3, type: 'matching_headings', prompt: 'Which paragraph explores the negative impact of hive overcrowding on native solitary species?', ans: ['Paragraph C'], exp: 'Paragraph C describes the "honeybee paradox" and resource competition.', opt: ['Paragraph A', 'Paragraph B', 'Paragraph C', 'Paragraph D'] },
  { q: 4, type: 'true_false_not_given', prompt: 'Urban microclimates generally provide longer flowering periods than rural monocultures.', ans: ['TRUE', 'True'], exp: 'Paragraph A and B confirm urban microclimates provide prolonged floral blooming cycles.', opt: ['TRUE', 'FALSE', 'NOT GIVEN'] },
  { q: 5, type: 'true_false_not_given', prompt: 'Honeybees were originally domesticated in Tokyo during the nineteenth century.', ans: ['NOT GIVEN', 'Not Given'], exp: 'The text mentions Tokyo as a modern city with apiaries, but gives no claim about where or when domestication originated.', opt: ['TRUE', 'FALSE', 'NOT GIVEN'] },
  { q: 6, type: 'true_false_not_given', prompt: 'High hive density has been shown to decrease the nesting success of native wild pollinators.', ans: ['TRUE', 'True'], exp: 'Paragraph C states that high hive density caused a 35% decline in native pollinator nesting success.', opt: ['TRUE', 'FALSE', 'NOT GIVEN'] },
  { q: 7, type: 'true_false_not_given', prompt: 'Zurich completely banned all rooftop beekeeping within city limits in 2024.', ans: ['FALSE', 'False'], exp: 'Paragraph D explains Zurich created zoning buffers and registration rules, not a complete ban.', opt: ['TRUE', 'FALSE', 'NOT GIVEN'] },
  { q: 8, type: 'sentence_completion', prompt: 'In rural monocultures, crops bloom for only about [8] weeks before leaving floral voids.', ans: ['three', '3', 'three weeks'], exp: 'Paragraph B explicitly mentions single-crop deserts blooming for three weeks.', opt: null },
  { q: 9, type: 'sentence_completion', prompt: 'The competition between domestic honeybees and wild insects is referred to by biologists as the honeybee [9]', ans: ['paradox'], exp: 'Paragraph C refers explicitly to the "honeybee paradox".', opt: null },
  { q: 10, type: 'sentence_completion', prompt: 'Native pollinator nesting success dropped by [10] percent in overcrowded zones.', ans: ['35', '35%'], exp: 'Paragraph C reports a 35% decline.', opt: null },
  { q: 11, type: 'multiple_choice', prompt: 'What is the primary scientific classification distinction highlighted in Paragraph C?', ans: ['Honeybees are domesticated livestock rather than wild fauna'], exp: 'Paragraph C emphasizes honeybees are managed livestock competing with wild species.', opt: ['Honeybees cannot survive cold winters', 'Honeybees are domesticated livestock rather than wild fauna', 'Honeybees produce toxic honey in cities', 'Honeybees only forage on ornamental roses'] },
  { q: 12, type: 'multiple_choice', prompt: 'What do new building codes in Zurich and Melbourne require for tall developments?', ans: ['Installation of native wildflower green roofs'], exp: 'Paragraph D notes green roofs are mandated on developments over eight stories.', opt: ['Installation of native wildflower green roofs', 'A maximum of two hives per tenant', 'Compulsory underground bee hives', 'Zero floral landscaping'] },
  { q: 13, type: 'short_answer', prompt: 'Name one city mentioned that adopted spatial buffer zones for hive management.', ans: ['Zurich', 'Melbourne'], exp: 'Paragraph D mentions Zurich and Melbourne.', opt: null }
];

rPas1Questions.forEach(item => {
  insertQuestion.run(
    `q_t1_r_${item.q}`,
    sec1Read,
    'pas_t1_1',
    null,
    1,
    item.q,
    item.type,
    item.prompt,
    'Answer questions 1-13 based on Passage 1 above.',
    item.opt ? JSON.stringify(item.opt) : null,
    JSON.stringify(item.ans),
    item.explanation,
    1,
    'medium',
    item.q
  );
});

// Passage 2
const pas1P2Content = `
<h3>Passage 2: Deep-Sea Bioluminescence and Biomimetic Engineering</h3>
<p><strong>Paragraph A</strong><br>
In the bathypelagic zone of the world's oceans—stretching between depths of 1,000 and 4,000 meters—sunlight is utterly absent. In this perpetual abyss, over ninety percent of macroscopic marine life has evolved the ability to produce cold biological light, a biochemical phenomenon known as bioluminescence. Unlike incandescence, where light is generated through thermal energy with immense heat loss, bioluminescence achieves an optical efficiency nearing ninety-eight percent, generating intense photons with almost zero thermal dissipation through the enzymatic oxidation of luciferin catalyzed by luciferase.</p>

<p><strong>Paragraph B</strong><br>
Marine creatures deploy this ethereal illumination for three primary evolutionary objectives: predation, defense, and intraspecific communication. The deep-sea anglerfish (<em>Melanocetus johnsonii</em>) employs a luminous dorsal photophore filled with symbiotic bioluminescent bacteria to lure unsuspecting prey directly into its cavernous jaws. Conversely, the cookiecutter shark utilizes counter-illumination; ventral photophores match the downwelling ambient light from the surface, rendering the predator invisible from below to silhouette-hunting apex predators.</p>

<p><strong>Paragraph C</strong><br>
Materials scientists and optical physicists are now reverse-engineering these abyssal adaptations to develop revolutionary biomimetic technologies. Traditional light-emitting diodes (LEDs) suffer from efficiency drop-offs caused by internal total reflection and localized heat degradation. By replicating the micro-structured nanophotonic scales found on the bioluminescent organs of deep-sea squid, researchers at MIT have synthesized bio-inspired optical diffusers that increase LED illumination output by 42% while cutting power consumption in half.</p>

<p><strong>Paragraph D</strong><br>
Furthermore, biomedical engineers are harnessing engineered luciferase assays for non-invasive real-time cancer diagnostics. Because bioluminescent reactions produce zero background autofluorescence inside human tissue, tagged antibodies emitting near-infrared wavelengths allow surgeons to delineate microscopic tumor margins during oncology surgery with sub-millimeter precision, radically reducing post-operative recurrence rates.</p>
`;

insertPassage.run('pas_t1_2', sec1Read, 'Deep-Sea Bioluminescence and Biomimetic Engineering', 'How abyssal creatures produce cold light and inspire next-generation medical and optical technologies', pas1P2Content, 2, 2);

// Passage 2 Questions (14-26)
const rPas2Questions = [
  { q: 14, type: 'multiple_choice', prompt: 'At what oceanic depth range does the bathypelagic zone exist?', ans: ['1,000 to 4,000 meters'], exp: 'Paragraph A defines the bathypelagic zone between 1,000 and 4,000 meters.', opt: ['200 to 500 meters', '1,000 to 4,000 meters', '5,000 to 8,000 meters', 'Under 500 meters only'] },
  { q: 15, type: 'multiple_choice', prompt: 'What is the primary thermodynamic difference between incandescence and bioluminescence?', ans: ['Bioluminescence converts energy into light with almost no heat loss'], exp: 'Paragraph A states bioluminescence has near 98% efficiency with zero thermal dissipation.', opt: ['Incandescence requires living cells', 'Bioluminescence converts energy into light with almost no heat loss', 'Incandescence produces only blue light', 'Bioluminescence requires radioactive elements'] },
  { q: 16, type: 'true_false_not_given', prompt: 'The cookiecutter shark uses bioluminescent light on its belly to camouflage against surface illumination.', ans: ['TRUE', 'True'], exp: 'Paragraph B describes counter-illumination on ventral photophores.', opt: ['TRUE', 'FALSE', 'NOT GIVEN'] },
  { q: 17, type: 'true_false_not_given', prompt: 'Anglerfish glow because they ingest synthetic radioactive isotopes.', ans: ['FALSE', 'False'], exp: 'Paragraph B states the dorsal lure is filled with symbiotic bioluminescent bacteria.', opt: ['TRUE', 'FALSE', 'NOT GIVEN'] },
  { q: 18, type: 'true_false_not_given', prompt: 'All deep-sea species produce light in exactly the same yellow wavelength.', ans: ['FALSE', 'False'], exp: 'The passage highlights near-infrared and various camouflage wavelengths, disproving single yellow wavelength.', opt: ['TRUE', 'FALSE', 'NOT GIVEN'] },
  { q: 19, type: 'true_false_not_given', prompt: 'MIT has already commercialized their biomimetic LED bulbs in 40 countries.', ans: ['NOT GIVEN', 'Not Given'], exp: 'The text describes research synthesis at MIT but gives no information on commercial sales in 40 countries.', opt: ['TRUE', 'FALSE', 'NOT GIVEN'] },
  { q: 20, type: 'summary_completion', prompt: 'Bioluminescence relies on the oxidation of [20] catalyzed by luciferase.', ans: ['luciferin'], exp: 'Paragraph A describes enzymatic oxidation of luciferin.', opt: null },
  { q: 21, type: 'summary_completion', prompt: 'Replicating squid nanostructures boosted LED optical output by [21] percent.', ans: ['42', '42%'], exp: 'Paragraph C states an output increase of 42%.', opt: null },
  { q: 22, type: 'summary_completion', prompt: 'In surgical oncology, tagged antibodies emit [22] wavelengths to highlight tumor edges.', ans: ['near-infrared', 'infrared'], exp: 'Paragraph D notes antibodies emitting near-infrared wavelengths.', opt: null },
  { q: 23, type: 'matching', prompt: 'Evolutionary function of Anglerfish photophore:', ans: ['Predation and luring prey'], exp: 'Paragraph B: to lure unsuspecting prey directly into cavernous jaws.', opt: ['Predation and luring prey', 'Counter-illumination camouflage', 'Mating song amplification', 'Navigational sonar'] },
  { q: 24, type: 'matching', prompt: 'Evolutionary function of Cookiecutter shark ventral organs:', ans: ['Counter-illumination camouflage'], exp: 'Paragraph B: ventral photophores match downwelling ambient light for stealth.', opt: ['Predation and luring prey', 'Counter-illumination camouflage', 'Mating song amplification', 'Navigational sonar'] },
  { q: 25, type: 'short_answer', prompt: 'What key property of bioluminescent light reactions allows zero background autofluorescence in human tissue?', ans: ['no autofluorescence', 'clean optical emission', 'near-infrared emission'], exp: 'Paragraph D explains the enzymatic reaction creates zero tissue autofluorescence.', opt: null },
  { q: 26, type: 'multiple_choice', prompt: 'What is the overarching theme of Passage 2?', ans: ['How deep-sea biological light adaptations inspire advances in energy and medicine'], exp: 'The text spans evolutionary biology, materials science (LEDs), and surgical oncology.', opt: ['The destruction of deep ocean coral reefs', 'How deep-sea biological light adaptations inspire advances in energy and medicine', 'Why deep-sea exploration should be defunded', 'The commercial fishing of anglerfish'] }
];

rPas2Questions.forEach(item => {
  insertQuestion.run(
    `q_t1_r_${item.q}`,
    sec1Read,
    'pas_t1_2',
    null,
    2,
    item.q,
    item.type,
    item.prompt,
    'Answer questions 14-26 based on Passage 2 above.',
    item.opt ? JSON.stringify(item.opt) : null,
    JSON.stringify(item.ans),
    item.explanation,
    1,
    'hard',
    item.q
  );
});

// Passage 3
const pas1P3Content = `
<h3>Passage 3: Neuroplasticity and Cognitive Resilience in Aging Populations</h3>
<p><strong>Paragraph A</strong><br>
For much of the twentieth century, conventional neuroscience held that the human central nervous system was strictly hardwired by early adulthood. The prevailing dogma posited that neuronal proliferation ceased after adolescence, and that cognitive senescence was an irreversible trajectory of structural atrophy and synapse loss. However, the advent of high-resolution functional Magnetic Resonance Imaging (fMRI) and neurogenomic tracing over the last thirty years has dismantled this static paradigm, revealing an extraordinary lifelong capacity for neuroplasticity—the brain’s dynamic ability to reorganize functional neural networks and sprout novel synaptic connections in response to experiential demands.</p>

<p><strong>Paragraph B</strong><br>
Central to modern gerontological neuroscience is the conceptual dichotomy between chronological age and biological brain age. Longitudinal studies following multi-decade cohorts demonstrate that while gray matter volume predictably contracts by approximately 0.5% annually after the age of fifty, cognitive function does not decline in lockstep. Individuals who maintain high levels of "cognitive reserve"—a neurological resilience bolstered by sustained intellectual engagement, bilingualism, and complex vocational activities—frequently exhibit minimal memory deficits despite significant biomarker pathology, such as amyloid-beta plaque accumulation.</p>

<p><strong>Paragraph C</strong><br>
Neuroimaging experiments have illuminated the neurobiological mechanisms underlying this resilience. In elderly subjects performing demanding memory tasks, fMRI scans reveal bilateral hemispheric recruitment—a phenomenon known as the HAROLD model (Hemispheric Asymmetry Reduction in Older Adults). Whereas younger individuals rely predominantly on unilateral prefrontal activation, high-performing older adults dynamically enlist contralateral homologous brain regions, compensating for localized neuronal degeneration by distributing computational workloads across expansive neural architectures.</p>

<p><strong>Paragraph D</strong><br>
The therapeutic implications of lifelong neuroplasticity are profound. Targeted aerobic exercise protocols stimulating the release of Brain-Derived Neurotrophic Factor (BDNF), combined with structured cognitive training regimens, have been shown to induce adult neurogenesis within the subgranular zone of the dentate gyrus in the hippocampus. These findings corroborate the premise that age-related cognitive deceleration is not an inescapable fate, but rather a malleable biological process modifiable through sustained lifestyle interventions.</p>
`;

insertPassage.run('pas_t1_3', sec1Read, 'Neuroplasticity and Cognitive Resilience in Aging Populations', 'How the adult brain continually rewires itself and builds cognitive reserve against neurodegeneration', pas1P3Content, 3, 3);

// Passage 3 Questions (27-40)
const rPas3Questions = [
  { q: 27, type: 'yes_no_not_given', prompt: 'Twentieth-century neuroscience correctly believed that the adult human brain cannot generate new neurons.', ans: ['NO', 'No'], exp: 'Paragraph A states this was an obsolete dogma that modern imaging dismantled.', opt: ['YES', 'NO', 'NOT GIVEN'] },
  { q: 28, type: 'yes_no_not_given', prompt: 'Gray matter volume typically decreases by approximately 0.5% per year after age 50.', ans: ['YES', 'Yes'], exp: 'Paragraph B explicitly notes gray matter contracts by approximately 0.5% annually after age 50.', opt: ['YES', 'NO', 'NOT GIVEN'] },
  { q: 29, type: 'yes_no_not_given', prompt: 'Individuals with high cognitive reserve never develop amyloid-beta plaques.', ans: ['NO', 'No'], exp: 'Paragraph B explains they maintain function despite significant biomarker pathology such as amyloid plaques.', opt: ['YES', 'NO', 'NOT GIVEN'] },
  { q: 30, type: 'yes_no_not_given', prompt: 'Aerobic exercise has been proven to trigger the synthesis of BDNF.', ans: ['YES', 'Yes'], exp: 'Paragraph D explicitly connects aerobic exercise protocols to BDNF stimulation.', opt: ['YES', 'NO', 'NOT GIVEN'] },
  { q: 31, type: 'yes_no_not_given', prompt: 'Playing chess is the only activity capable of improving adult neurogenesis.', ans: ['NO', 'No'], exp: 'Paragraph B and D mention bilingualism, complex work, aerobic exercise, and cognitive training.', opt: ['YES', 'NO', 'NOT GIVEN'] },
  { q: 32, type: 'matching_headings', prompt: 'Which paragraph introduces the HAROLD model of bilateral brain recruitment?', ans: ['Paragraph C'], exp: 'Paragraph C details fMRI scans showing bilateral hemispheric recruitment under the HAROLD model.', opt: ['Paragraph A', 'Paragraph B', 'Paragraph C', 'Paragraph D'] },
  { q: 33, type: 'matching_headings', prompt: 'Which paragraph discusses lifestyle interventions like aerobic exercise and BDNF?', ans: ['Paragraph D'], exp: 'Paragraph D details exercise, BDNF release, and hippocampal neurogenesis.', opt: ['Paragraph A', 'Paragraph B', 'Paragraph C', 'Paragraph D'] },
  { q: 34, type: 'matching_headings', prompt: 'Which paragraph challenges twentieth-century hardwired neural dogma?', ans: ['Paragraph A'], exp: 'Paragraph A outlines the historical belief in static brain wiring.', opt: ['Paragraph A', 'Paragraph B', 'Paragraph C', 'Paragraph D'] },
  { q: 35, type: 'sentence_completion', prompt: 'The HAROLD model stands for Hemispheric [35] Reduction in Older Adults.', ans: ['Asymmetry'], exp: 'Paragraph C states: Hemispheric Asymmetry Reduction in Older Adults.', opt: null },
  { q: 36, type: 'sentence_completion', prompt: 'Adult neurogenesis has been observed in the [36] of the hippocampus.', ans: ['dentate gyrus', 'subgranular zone'], exp: 'Paragraph D specifies the subgranular zone of the dentate gyrus in the hippocampus.', opt: null },
  { q: 37, type: 'sentence_completion', prompt: 'BDNF stands for Brain-Derived [37] Factor.', ans: ['Neurotrophic'], exp: 'Paragraph D defines BDNF as Brain-Derived Neurotrophic Factor.', opt: null },
  { q: 38, type: 'multiple_choice', prompt: 'How do high-performing older adults compensate for localized neural degeneration according to Paragraph C?', ans: ['By recruiting homologous regions across both brain hemispheres'], exp: 'Paragraph C explains contralateral bilateral activation.', opt: ['By sleeping 14 hours per day', 'By recruiting homologous regions across both brain hemispheres', 'By avoiding all complex problem solving', 'By shutting down the prefrontal cortex'] },
  { q: 39, type: 'multiple_choice', prompt: 'What factor is NOT mentioned in Paragraph B as contributing to cognitive reserve?', ans: ['Consuming high doses of vitamin C tablets'], exp: 'Paragraph B cites intellectual engagement, bilingualism, and complex work, but does not cite vitamin C.', opt: ['Bilingualism', 'Intellectual engagement', 'Consuming high doses of vitamin C tablets', 'Complex vocational activities'] },
  { q: 40, type: 'short_answer', prompt: 'What technology developed in the last 30 years helped disprove the static brain theory?', ans: ['fMRI', 'functional MRI', 'functional Magnetic Resonance Imaging'], exp: 'Paragraph A cites functional Magnetic Resonance Imaging (fMRI).', opt: null }
];

rPas3Questions.forEach(item => {
  insertQuestion.run(
    `q_t1_r_${item.q}`,
    sec1Read,
    'pas_t1_3',
    null,
    3,
    item.q,
    item.type,
    item.prompt,
    'Answer questions 27-40 based on Passage 3 above.',
    item.opt ? JSON.stringify(item.opt) : null,
    JSON.stringify(item.ans),
    item.explanation,
    1,
    'hard',
    item.q
  );
});

// Section 3: Writing
const sec1Write = 'sec_t1_write';
insertSection.run(sec1Write, test1Id, 'writing', 'Academic Writing Test', 'You have 60 minutes to complete both Task 1 and Task 2. Task 2 contributes twice as much to the final band score as Task 1.', 3, 60, 2);

insertWritingTask.run(
  'w_t1_task1',
  sec1Write,
  1,
  'Academic Writing Task 1: Comparative Energy Generation Mix',
  `The chart below shows the percentage of electricity generated from four different sources (Renewable Hydro/Solar/Wind, Nuclear, Coal, and Natural Gas) in three European countries (Germany, France, and Norway) in the year 2024.

Summarise the information by selecting and reporting the main features, and make comparisons where relevant.
Write at least 150 words.`,
  'Spend about 20 minutes on this task. Write in formal academic style with an overview, specific data comparisons, and no personal opinions.',
  150,
  20,
  '/images/energy_chart_task1.svg'
);

insertWritingTask.run(
  'w_t1_task2',
  sec1Write,
  2,
  'Academic Writing Task 2: Artificial Intelligence and Higher Education',
  `In recent years, the rapid proliferation of generative artificial intelligence tools has raised concerns that traditional university examinations and essay assignments are becoming obsolete. Some educators argue that universities should prohibit AI tools completely, while others believe AI literacy should be integrated into all degree curricula.

Discuss both these views and give your own opinion.
Give reasons for your answer and include any relevant examples from your own knowledge or experience.
Write at least 250 words.`,
  'Spend about 40 minutes on this task. Present a clear position throughout your essay, support arguments with developed ideas and cohesive paragraphing.',
  250,
  40,
  null
);

// Section 4: Speaking
const sec1Speak = 'sec_t1_speak';
insertSection.run(sec1Speak, test1Id, 'speaking', 'Speaking Test', 'The Speaking test comprises 3 parts. You will record your answers using your microphone. Part 2 includes a 1-minute preparation countdown and 2 minutes of speaking time.', 4, 15, 3);

insertSpeakingTask.run(
  'spk_t1_p1',
  sec1Speak,
  1,
  'Part 1: Introduction & Interview (Home, Technology & Leisure)',
  'Let us talk about your daily routines and technology habits.',
  'Answer the questions naturally and speak in complete sentences. Aim for 2-3 sentences per answer.',
  0,
  180,
  JSON.stringify([
    'Do you prefer studying in the morning or in the evening? Why?',
    'How often do you use digital applications for learning or organizing your day?',
    'What kind of leisure activities do you enjoy most on weekends?',
    'Has the way you spend your free time changed compared to when you were younger?'
  ])
);

insertSpeakingTask.run(
  'spk_t1_p2',
  sec1Speak,
  2,
  'Part 2: Individual Long Turn (Cue Card - An Inspiring Leader or Mentor)',
  `Describe a teacher, mentor, or leader who had a significant positive influence on your life.

You should say:
• Who this person is and how you met them
• What qualities or skills made them special
• What specific advice or guidance they gave you
And explain why this person’s influence was so meaningful to your personal or academic development.`,
  'You have 1 minute to prepare your notes. You will then be prompted to speak continuously for 1 to 2 minutes.',
  60,
  120,
  JSON.stringify([
    'Who this person is and your connection to them',
    'Their key personal or professional characteristics',
    'A memorable piece of advice they shared',
    'Why their guidance had a lasting impact on your life'
  ])
);

insertSpeakingTask.run(
  'spk_t1_p3',
  sec1Speak,
  3,
  'Part 3: Two-Way Discussion (Leadership, Mentorship & Society)',
  'Let us discuss broader questions related to leadership and role models in society.',
  'Develop your ideas thoroughly by providing abstract reasoning, examples, and considering multiple viewpoints.',
  0,
  240,
  JSON.stringify([
    'What qualities make an effective leader in a modern multinational organization?',
    'Do you think leadership skills are innate, or can they be cultivated through formal training?',
    'How has the definition of a "role model" changed with the rise of social media influencers?',
    'In what ways can educational institutions better prepare young people to take on leadership responsibilities?'
  ])
);

console.log('[Seed] Created Test 01: Full Academic Mock Test with 40 Listening, 40 Reading, 2 Writing tasks, 3 Speaking parts.');

// ========================================================
// 4. Seed Additional Mock Tests & Skill Practice Tests
// ========================================================

// Test 2: Academic Mock Test 02
insertTest.run(
  'test_acad_02',
  'IELTS Academic Mock Test 02 - Global Environment & Science',
  'academic',
  'full',
  'moderate',
  165,
  'published',
  'Full-length simulation focusing on global climatology, renewable smart grids, advanced biotechnology, and academic discursive essay writing.',
  4,
  40
);

// Test 3: Academic Mock Test 03
insertTest.run(
  'test_acad_03',
  'IELTS Academic Mock Test 03 - Urban Architecture & Innovation',
  'academic',
  'full',
  'hard',
  165,
  'published',
  'Rigorous full mock examination covering architectural acoustics, autonomous transportation systems, and societal ethics in digital automation.',
  4,
  40
);

// Test 4: General Training Mock Test 01
insertTest.run(
  'test_gen_01',
  'IELTS General Training Mock Test 01 - Workplace & Daily Living',
  'general',
  'full',
  'standard',
  165,
  'published',
  'Authentic General Training examination with workplace notices, job contracts, community facility guides, and informal letter writing.',
  4,
  40
);

// Test 5: General Training Mock Test 02
insertTest.run(
  'test_gen_02',
  'IELTS General Training Mock Test 02 - Community Services & Employment',
  'general',
  'full',
  'standard',
  165,
  'published',
  'Complete General Training practice covering staff training manuals, rental tenancy agreements, public transit policies, and formal letter correspondence.',
  4,
  40
);

// Skill Practice 1: Listening Practice 01
insertTest.run(
  'test_skill_l1',
  'Listening Practice 01: Campus Accommodation & Library Services',
  'academic',
  'listening',
  'standard',
  30,
  'published',
  'Dedicated 4-part Listening practice drill covering telephone inquiries, maps, academic tutorials, and environmental lectures.',
  1,
  40
);

// Skill Practice 2: Listening Practice 02
insertTest.run(
  'test_skill_l2',
  'Listening Practice 02: Marine Biology Field Trip',
  'academic',
  'listening',
  'moderate',
  30,
  'published',
  'Intensive Listening drill targeting oceanic expedition planning, equipment checklists, and ecological data analysis.',
  1,
  40
);

// Skill Practice 3: Reading Practice 01
insertTest.run(
  'test_skill_r1',
  'Reading Practice 01: The Renaissance of Vertical Farming',
  'academic',
  'reading',
  'standard',
  60,
  'published',
  'Three full academic reading texts analyzing hydroponic agriculture, soil microbiomes, and future megacity food security.',
  1,
  40
);

// Skill Practice 4: Reading Practice 02
insertTest.run(
  'test_skill_r2',
  'Reading Practice 02: Cognitive Neuroscience of Multilingualism',
  'academic',
  'reading',
  'hard',
  60,
  'published',
  'Advanced academic reading module exploring language acquisition, executive brain function, and linguistic anthropology.',
  1,
  40
);

// Skill Practice 5: Writing Practice 01
insertTest.run(
  'test_skill_w1',
  'Writing Practice 01: Global Energy Consumption & AI in Education',
  'academic',
  'writing',
  'standard',
  60,
  'published',
  'Timed Writing practice featuring Task 1 comparative bar graphs and Task 2 argumentative opinion essays with word count auto-save.',
  1,
  2
);

// Skill Practice 6: Speaking Practice 01
insertTest.run(
  'test_skill_s1',
  'Speaking Simulation 01: Hometown, Travel & An Inspiring Leader',
  'academic',
  'speaking',
  'standard',
  15,
  'published',
  'Full interactive Speaking simulation with Part 1 interview, Part 2 cue card preparation timer, and Part 3 abstract discussion recording.',
  1,
  3
);

// 5. Seed Demo Attempts for Student 1 (Tanvir Ahmed) to show rich Dashboard charts & history!
const insertAttempt = db.prepare(`
  INSERT INTO attempts (
    id, student_id, test_id, current_section, current_question, start_time, end_time, remaining_seconds,
    status, listening_raw, listening_band, reading_raw, reading_band, writing_band, speaking_band,
    overall_band, evaluation_status, answers_json, flags_json, writing_task1_text, writing_task2_text,
    tab_switches_count, created_at, updated_at
  )
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertEval = db.prepare(`
  INSERT INTO evaluations (
    id, attempt_id, section_type, evaluator_id, criterion_1_score, criterion_2_score,
    criterion_3_score, criterion_4_score, final_band, feedback, created_at
  )
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

// Past Attempt 1 (Score: 6.5)
const att1Id = 'att_tanvir_01';
const demoAnswers1 = {
  'q_t1_l_1': 'studio apartment',
  'q_t1_l_2': '650',
  'q_t1_l_3': '15th',
  'q_t1_l_4': '20',
  'q_t1_l_5': 'cooker',
  'q_t1_l_6': 'Water and Wi-Fi',
  'q_t1_l_7': 'In a government protection scheme',
  'q_t1_l_8': '900452',
  'q_t1_l_9': 'Arthur Davies',
  'q_t1_l_10': 'passport',
  'q_t1_l_11': '1984',
  'q_t1_l_12': 'Hydrotherapy wellness pool',
  'q_t1_l_13': '17',
  'q_t1_l_14': '3 hours',
  'q_t1_l_15': 'Location B',
  'q_t1_l_16': 'Location D',
  'q_t1_l_17': '8:30',
  'q_t1_l_18': 'cap',
  'q_t1_l_19': 'padlock',
  'q_t1_l_20': 'Through the mobile app up to 7 days in advance',
  'q_t1_l_21': 'It addresses real-world island energy blackouts',
  'q_t1_l_22': 'Household solar battery degradation was faster than manufacturer claims',
  'q_t1_l_23': 'Synthesize themes rather than listing individual author papers',
  'q_t1_l_24': 'R Studio',
  'q_t1_l_25': 'Shared equally by Liam and Sarah',
  'q_t1_l_26': 'Liam only',
  'q_t1_l_27': '120',
  'q_t1_l_28': 'privacy',
  'q_t1_l_29': 'November',
  'q_t1_l_30': 'Obtain formal university ethics committee approval',
  'q_t1_l_31': 'soundscape',
  'q_t1_l_32': 'silent',
  'q_t1_l_33': 'loudspeakers',
  'q_t1_l_34': '50',
  'q_t1_l_35': 'parrotfish',
  'q_t1_r_1': 'Paragraph B',
  'q_t1_r_2': 'Paragraph D',
  'q_t1_r_3': 'Paragraph C',
  'q_t1_r_4': 'TRUE',
  'q_t1_r_5': 'NOT GIVEN',
  'q_t1_r_6': 'TRUE',
  'q_t1_r_7': 'FALSE',
  'q_t1_r_8': 'three',
  'q_t1_r_9': 'paradox',
  'q_t1_r_10': '35',
  'q_t1_r_11': 'Honeybees are domesticated livestock rather than wild fauna',
  'q_t1_r_12': 'Installation of native wildflower green roofs',
  'q_t1_r_13': 'Zurich',
  'q_t1_r_14': '1,000 to 4,000 meters',
  'q_t1_r_15': 'Bioluminescence converts energy into light with almost no heat loss',
  'q_t1_r_16': 'TRUE',
  'q_t1_r_17': 'FALSE',
  'q_t1_r_18': 'FALSE',
  'q_t1_r_19': 'NOT GIVEN',
  'q_t1_r_20': 'luciferin',
  'q_t1_r_21': '42',
  'q_t1_r_22': 'near-infrared',
  'q_t1_r_27': 'NO',
  'q_t1_r_28': 'YES',
  'q_t1_r_29': 'NO',
  'q_t1_r_30': 'YES',
  'q_t1_r_32': 'Paragraph C',
  'q_t1_r_33': 'Paragraph D',
  'q_t1_r_35': 'Asymmetry',
  'q_t1_r_36': 'dentate gyrus',
  'q_t1_r_37': 'Neurotrophic',
  'q_t1_r_38': 'By recruiting homologous regions across both brain hemispheres'
};

const task1SampleText = `The provided bar chart delineates the proportion of electricity produced from four distinct energy categories—Renewables, Nuclear, Coal, and Natural Gas—across Norway, Germany, and France in 2024.

Overall, it is immediately evident that national electricity profiles diverged substantially. Norway was almost exclusively reliant on renewable power, whereas France generated the overwhelming majority of its energy through nuclear generation. In contrast, Germany maintained a more heterogeneous distribution across gas, coal, and green alternatives.

In detail, renewable sources accounted for an astounding 98% of total electrical output in Norway, whereas nuclear power and fossil fuels contributed negligible percentages under 2%. Conversely, in France, nuclear energy stood as the dominant contributor at approximately 68%, followed by renewables at 22%, with natural gas and coal occupying minor shares of 7% and 3% respectively.

Regarding Germany, renewable sources represented the single largest component at 46%, followed by natural gas at 28% and coal-fired plants at 20%. Nuclear energy in Germany accounted for 0% due to full grid phase-outs.`;

const task2SampleText = `The exponential emergence of generative artificial intelligence software in recent years has ignited fierce debate over academic integrity and the relevance of traditional higher education assessment models. While critics advocate for outright prohibitions to curb plagiarism, I firmly contend that universities must proactively integrate AI literacy into curricula to prepare graduates for contemporary workforce realities.

Proponents of banning AI argue that unchecked usage undermines critical thinking and foundational cognitive development. When students rely on algorithmic models to compose essays or solve analytical equations, they risk bypassing essential learning struggles such as synthesizing disparate literature, structuring coherent syntax, and verifying factual veracity. Furthermore, current AI detection algorithms suffer from notable false-positive rates, creating institutional friction between faculty and learners.

However, historical technological precedents demonstrate that attempting to ban ubiquitous digital tools is futile and counterproductive. Just as electronic calculators and internet search engines initially faced academic skepticism before becoming indispensable educational instruments, generative AI should be harnessed as an intellectual scaffold. By incorporating AI into degree programmes, educators can shift assessment paradigms away from rote memorization toward higher-order evaluative tasks, such as critical critique of AI-generated arguments, ethical prompt engineering, and empirical data validation.

In conclusion, while concerns surrounding academic dishonesty are legitimate, total prohibition represents a regressive approach. Higher education institutions must cultivate sophisticated AI literacy alongside robust oral examinations and supervised practical assessments, empowering students to wield these transformative technologies with ethical discernment and intellectual rigor.`;

insertAttempt.run(
  att1Id,
  'usr_student_01',
  test1Id,
  'speaking',
  40,
  '2026-09-28 10:00:00',
  '2026-09-28 12:45:00',
  0,
  'completed',
  35, // Listening Raw: 35/40 -> Band 8.0
  8.0,
  33, // Reading Raw: 33/40 -> Band 7.5
  7.5,
  6.5, // Writing Band
  7.0, // Speaking Band
  7.5, // Overall Band ((8.0+7.5+6.5+7.0)/4 = 7.25 -> rounded to 7.5)
  'evaluated',
  JSON.stringify(demoAnswers1),
  JSON.stringify(['q_t1_l_24', 'q_t1_r_19']),
  task1SampleText,
  task2SampleText,
  0,
  '2026-09-28 10:00:00',
  '2026-09-28 12:45:00'
);

// Evaluator reviews for Attempt 1
insertEval.run(
  'eval_att1_w',
  att1Id,
  'writing',
  'usr_teacher_01',
  6.5, // Task Achievement
  7.0, // Coherence & Cohesion
  6.5, // Lexical Resource
  6.0, // Grammatical Range & Accuracy
  6.5,
  'Strong Task 1 overview and clear comparative groupings. Task 2 exhibits excellent logical structure and relevant arguments. To reach Band 7.5+ in Writing, focus on minimizing minor punctuation slips in complex conditional clauses and expanding less common idiomatic collocations.',
  '2026-09-29 09:30:00'
);

insertEval.run(
  'eval_att1_s',
  att1Id,
  'speaking',
  'usr_teacher_01',
  7.0, // Fluency & Coherence
  7.5, // Lexical Resource
  7.0, // Grammatical Range
  6.5, // Pronunciation
  7.0,
  'Natural communicative flow with minimal hesitation. Part 2 cue card was sustained for a full 1 minute and 45 seconds with well-chosen descriptive vocabulary. Pronunciation is clear throughout, with minor intonation flattening during abstract Part 3 questions.',
  '2026-09-29 09:45:00'
);

// Notifications for Student 1
const insertNotification = db.prepare(`
  INSERT INTO notifications (id, user_id, title, message, type, link, is_read, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

insertNotification.run(
  'notif_01',
  'usr_student_01',
  'Writing & Speaking Evaluated',
  'Dr. Sarah Jenkins has published your Writing and Speaking evaluations for Academic Mock Test 01. Your overall score is Band 7.5!',
  'result',
  `/results/${att1Id}`,
  1,
  '2026-09-29 10:00:00'
);

insertNotification.run(
  'notif_02',
  'usr_student_01',
  'New Mock Test Available',
  'IELTS Academic Mock Test 03 - Urban Architecture & Innovation is now available in your Test Library.',
  'info',
  '/test-library',
  0,
  '2026-10-02 14:00:00'
);

console.log('[Seed] Database seeding completed successfully with all tables, mock tests, questions, and demo attempts.');
