// Production test dataset
// Contains official CBT IELTS test blueprints with 0 dummy attempts

function generateWavBase64(duration = 5, freq = 440) {
  return 'data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YRAAAAAAAAAAAAAAAAAAAAAA';
}

export const initialUsers = [
  {
    id: 'usr_admin_01',
    email: 'admin@megamindplus.com',
    password: 'admin123',
    full_name: 'Megamind Admin',
    phone: '+880 1811-111111',
    role: 'admin',
    target_band: 8.5,
    test_type: 'academic',
    current_level: 'expert',
    target_test_date: '2026-12-31',
    status: 'active',
    created_at: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'usr_teacher_01',
    email: 'evaluator@megamindplus.com',
    password: 'teacher123',
    full_name: 'IELTS Senior Evaluator',
    phone: '+880 1822-222222',
    role: 'teacher',
    target_band: 8.5,
    test_type: 'academic',
    current_level: 'expert',
    target_test_date: '2026-12-31',
    status: 'active',
    created_at: '2026-01-01T00:00:00.000Z'
  }
];

export const initialSettings = {
  brand_name: 'MEGAMIND PLUS',
  sub_brand: 'IELTS MOCK TEST',
  tagline: 'Practice Like the Real Test. Perform With Confidence.',
  primary_color: '#C7202D',
  rounding_mode: 'standard',
  registration_enabled: 'true',
  maintenance_mode: 'false',
  contact_email: 'support@megamindplus.com',
  contact_phone: '+880 1700-000000'
};

export const initialTests = [
  {
    id: 'test_acad_01',
    title: 'IELTS Academic Mock Test 01 - Full CBT Simulation',
    test_type: 'academic',
    category: 'full',
    difficulty: 'standard',
    duration_minutes: 165,
    status: 'published',
    description: 'Comprehensive 4-skill computer-based IELTS practice test simulating real examination conditions with audio, reading split screen, automated band conversion, and official timed sections.',
    sections_count: 4,
    total_questions: 40,
    created_at: '2026-01-10T10:00:00.000Z'
  },
  {
    id: 'test_acad_02',
    title: 'IELTS Academic Mock Test 02 - Advanced Mastery',
    test_type: 'academic',
    category: 'full',
    difficulty: 'hard',
    duration_minutes: 165,
    status: 'published',
    description: 'Challenging academic mock test featuring high-level vocabulary, speed-reading passages, scientific data analysis, and academic argumentative writing.',
    sections_count: 4,
    total_questions: 40,
    created_at: '2026-01-12T10:00:00.000Z'
  },
  {
    id: 'test_gen_01',
    title: 'IELTS General Training Mock Test 01',
    test_type: 'general',
    category: 'full',
    difficulty: 'standard',
    duration_minutes: 165,
    status: 'published',
    description: 'Official General Training simulation covering workplace notices, social survival reading, formal/informal letter writing, and general discussion.',
    sections_count: 4,
    total_questions: 40,
    created_at: '2026-01-15T10:00:00.000Z'
  },
  {
    id: 'test_skill_l1',
    title: 'Listening Practice Sprint 01 (Part 1 & 2)',
    test_type: 'academic',
    category: 'listening',
    difficulty: 'easy',
    duration_minutes: 20,
    status: 'published',
    description: 'Focused sprint targeting note completion, telephone booking, numbers, and multiple choice questions.',
    sections_count: 1,
    total_questions: 20,
    created_at: '2026-01-18T10:00:00.000Z'
  },
  {
    id: 'test_skill_r1',
    title: 'Academic Reading Speed Drill 01 (Passage 1 & 2)',
    test_type: 'academic',
    category: 'reading',
    difficulty: 'medium',
    duration_minutes: 40,
    status: 'published',
    description: 'Develop skimming and scanning techniques for True/False/Not Given, Heading Matching, and summary completion.',
    sections_count: 1,
    total_questions: 26,
    created_at: '2026-01-20T10:00:00.000Z'
  },
  {
    id: 'test_skill_w1',
    title: 'Writing Task 2 Masterclass: Technology & Society',
    test_type: 'academic',
    category: 'writing',
    difficulty: 'standard',
    duration_minutes: 40,
    status: 'published',
    description: 'Sharpen your 250-word essay writing with live word count, paragraph structuring, and examiner feedback criteria.',
    sections_count: 1,
    total_questions: 1,
    created_at: '2026-01-22T10:00:00.000Z'
  },
  {
    id: 'test_skill_s1',
    title: 'Speaking Part 2 Cue Card Interactive Practice',
    test_type: 'academic',
    category: 'speaking',
    difficulty: 'medium',
    duration_minutes: 15,
    status: 'published',
    description: 'Master the 1-minute cue card preparation timer and 2-minute uninterrupted speech delivery with audio recording.',
    sections_count: 1,
    total_questions: 3,
    created_at: '2026-01-25T10:00:00.000Z'
  }
];

export const initialTestPayloads = {
  test_acad_01: {
    test: initialTests[0],
    sections: [
      {
        id: 'sec_t1_listen',
        test_id: 'test_acad_01',
        section_type: 'listening',
        title: 'Listening Test',
        instructions: 'The Listening test consists of 4 parts with 10 questions each. You will hear each recording ONCE only. Answer all 40 questions.',
        order_index: 1,
        duration_minutes: 30,
        total_questions: 40,
        audio_files: [
          {
            id: 'aud_t1_p1',
            part_number: 1,
            title: 'Part 1: University Clubs & Societies',
            file_url: 'https://portal.megamindplus.com/wp-content/uploads/2026/07/Test-1-Section-1.mp3',
            transcript: 'Part 1: University Clubs and Societies conversation.'
          },
          {
            id: 'aud_t1_p2',
            part_number: 2,
            title: 'Part 2: Halls of Residence',
            file_url: 'https://portal.megamindplus.com/wp-content/uploads/2026/07/Test-1-Section-2.mp3',
            transcript: 'Part 2: Features and Map of Halls of Residence.'
          },
          {
            id: 'aud_t1_p3',
            part_number: 3,
            title: "Part 3: Jenna & Marco's Project",
            file_url: 'https://portal.megamindplus.com/wp-content/uploads/2026/07/Test-1-Section-3.mp3',
            transcript: "Part 3: Discussion on Jenna and Marco's university project."
          },
          {
            id: 'aud_t1_p4',
            part_number: 4,
            title: 'Part 4: News and the Media in the USA',
            file_url: 'https://portal.megamindplus.com/wp-content/uploads/2026/07/Test-1-Section-4.mp3',
            transcript: 'Part 4: Lecture on US news media, advertising and industry trends.'
          }
        ],
        passages: [],
        writing_tasks: [],
        speaking_tasks: [],
        questions: [
          { id: 'q_t1_l_1', part_number: 1, question_number: 1, question_type: 'table_completion', prompt: 'Tuesday (climbing club) — extra activities: [1]', options_json: null, correct_answer_json: '["weekend trips"]', marks: 1, explanation: 'Climbing club extra activities include weekend trips.' },
          { id: 'q_t1_l_2', part_number: 1, question_number: 2, question_type: 'table_completion', prompt: 'Wednesday (chess club) — extra activities: [2]', options_json: null, correct_answer_json: '["competitions"]', marks: 1, explanation: 'Chess club extra activities include competitions.' },
          { id: 'q_t1_l_3', part_number: 1, question_number: 3, question_type: 'table_completion', prompt: 'Monday (film club) — current number of members: [3]', options_json: null, correct_answer_json: '["125"]', marks: 1, explanation: 'Film club current member count is 125.' },
          { id: 'q_t1_l_4', part_number: 1, question_number: 4, question_type: 'table_completion', prompt: 'Tuesday (climbing club) — contact: [4]', options_json: null, correct_answer_json: '["club secretary"]', marks: 1, explanation: 'Contact person is the club secretary.' },
          { id: 'q_t1_l_5', part_number: 1, question_number: 5, question_type: 'note_completion', prompt: 'Details of climbing club: meets [5]', options_json: null, correct_answer_json: '["twice a month","twice per month"]', marks: 1, explanation: 'The club meets twice a month.' },
          { id: 'q_t1_l_6', part_number: 1, question_number: 6, question_type: 'note_completion', prompt: 'Details of climbing club: excursion to France in the [6]', options_json: null, correct_answer_json: '["spring"]', marks: 1, explanation: 'Annual excursion to France happens in the spring.' },
          { id: 'q_t1_l_7', part_number: 1, question_number: 7, question_type: 'note_completion', prompt: 'Details of climbing club: subscriptions paid [7]', options_json: null, correct_answer_json: '["weekly"]', marks: 1, explanation: 'Subscriptions are paid weekly.' },
          { id: 'q_t1_l_8', part_number: 1, question_number: 8, question_type: 'note_completion', prompt: 'Benefits: discounts on [8]', options_json: null, correct_answer_json: '["equipment"]', marks: 1, explanation: 'Members get discounts on equipment.' },
          { id: 'q_t1_l_9', part_number: 1, question_number: 9, question_type: 'note_completion', prompt: 'Benefits: annual [9]', options_json: null, correct_answer_json: '["magazine"]', marks: 1, explanation: 'Members receive an annual magazine.' },
          { id: 'q_t1_l_10', part_number: 1, question_number: 10, question_type: 'note_completion', prompt: 'Benefits: free entrance to climbing [10] in Cardiff', options_json: null, correct_answer_json: '["exhibition"]', marks: 1, explanation: 'Free entrance to climbing exhibition in Cardiff.' },

          { id: 'q_t1_l_11', part_number: 2, question_number: 11, question_type: 'matching', prompt: 'Which features are available at Brown Hall?', options_json: '["A. cleaning included","B. all meals included","C. private showers","D. modern building","E. parking spaces","F. single sex","G. sports facilities"]', correct_answer_json: '["G"]', marks: 1, explanation: 'Brown Hall has sports facilities (G).' },
          { id: 'q_t1_l_12', part_number: 2, question_number: 12, question_type: 'matching', prompt: 'Which features are available at Blake Residence?', options_json: '["A. cleaning included","B. all meals included","C. private showers","D. modern building","E. parking spaces","F. single sex","G. sports facilities"]', correct_answer_json: '["F"]', marks: 1, explanation: 'Blake Residence is single sex (F).' },
          { id: 'q_t1_l_13', part_number: 2, question_number: 13, question_type: 'matching', prompt: 'Which features are available at Queens Building?', options_json: '["A. cleaning included","B. all meals included","C. private showers","D. modern building","E. parking spaces","F. single sex","G. sports facilities"]', correct_answer_json: '["C"]', marks: 1, explanation: 'Queens Building provides private showers (C).' },
          { id: 'q_t1_l_14', part_number: 2, question_number: 14, question_type: 'matching', prompt: 'Which features are available at Parkway Flats?', options_json: '["A. cleaning included","B. all meals included","C. private showers","D. modern building","E. parking spaces","F. single sex","G. sports facilities"]', correct_answer_json: '["B"]', marks: 1, explanation: 'Parkway Flats has all meals included (B).' },
          { id: 'q_t1_l_15', part_number: 2, question_number: 15, question_type: 'matching', prompt: 'Which features are available at Temple Rise?', options_json: '["A. cleaning included","B. all meals included","C. private showers","D. modern building","E. parking spaces","F. single sex","G. sports facilities"]', correct_answer_json: '["A"]', marks: 1, explanation: 'Temple Rise has cleaning included (A).' },
          { id: 'q_t1_l_16', part_number: 2, question_number: 16, question_type: 'map_label', prompt: 'Label the map: 16. Brown Hall', options_json: '["A","B","C","D","E","F","G"]', correct_answer_json: '["B"]', marks: 1, explanation: 'Brown Hall is located at B on the map.' },
          { id: 'q_t1_l_17', part_number: 2, question_number: 17, question_type: 'map_label', prompt: 'Label the map: 17. Blake Residence', options_json: '["A","B","C","D","E","F","G"]', correct_answer_json: '["A"]', marks: 1, explanation: 'Blake Residence is located at A on the map.' },
          { id: 'q_t1_l_18', part_number: 2, question_number: 18, question_type: 'map_label', prompt: 'Label the map: 18. Queens Building', options_json: '["A","B","C","D","E","F","G"]', correct_answer_json: '["C"]', marks: 1, explanation: 'Queens Building is located at C on the map.' },
          { id: 'q_t1_l_19', part_number: 2, question_number: 19, question_type: 'map_label', prompt: 'Label the map: 19. Parkway Flats', options_json: '["A","B","C","D","E","F","G"]', correct_answer_json: '["E"]', marks: 1, explanation: 'Parkway Flats is located at E on the map.' },
          { id: 'q_t1_l_20', part_number: 2, question_number: 20, question_type: 'map_label', prompt: 'Label the map: 20. Temple Rise', options_json: '["A","B","C","D","E","F","G"]', correct_answer_json: '["D"]', marks: 1, explanation: 'Temple Rise is located at D on the map.' },

          { id: 'q_t1_l_21', part_number: 3, question_number: 21, question_type: 'sentence_completion', prompt: 'Jenna and Marco must complete their project by [21].', options_json: null, correct_answer_json: '["March 25th","25 March","March 25"]', marks: 1, explanation: 'The deadline is March 25th.' },
          { id: 'q_t1_l_22', part_number: 3, question_number: 22, question_type: 'sentence_completion', prompt: 'The project will be a study of the increase in [22].', options_json: null, correct_answer_json: '["older workers"]', marks: 1, explanation: 'The topic is the increase in older workers.' },
          { id: 'q_t1_l_23', part_number: 3, question_number: 23, question_type: 'sentence_completion', prompt: 'The project will be assessed by [23].', options_json: null, correct_answer_json: '["senior lecturer","a senior lecturer"]', marks: 1, explanation: 'Assessed by a senior lecturer.' },
          { id: 'q_t1_l_24', part_number: 3, question_number: 24, question_type: 'sentence_completion', prompt: 'Jenna and Marco agree they need a [24] for the project.', options_json: null, correct_answer_json: '["timetable"]', marks: 1, explanation: 'They agree on establishing a timetable.' },
          { id: 'q_t1_l_25', part_number: 3, question_number: 25, question_type: 'multiple_select', prompt: 'What THREE things do Marco and Jenna have to do NOW for the project? (Choice 1)', options_json: '["A. interview some people","B. hand out questionnaires","C. choose their subjects","D. take photographs","E. use statistical software","F. do some work in the library","G. contact some local companies"]', correct_answer_json: '["B"]', marks: 1, explanation: 'B. hand out questionnaires' },
          { id: 'q_t1_l_26', part_number: 3, question_number: 26, question_type: 'multiple_select', prompt: 'What THREE things do Marco and Jenna have to do NOW for the project? (Choice 2)', options_json: '["A. interview some people","B. hand out questionnaires","C. choose their subjects","D. take photographs","E. use statistical software","F. do some work in the library","G. contact some local companies"]', correct_answer_json: '["D"]', marks: 1, explanation: 'D. take photographs' },
          { id: 'q_t1_l_27', part_number: 3, question_number: 27, question_type: 'multiple_select', prompt: 'What THREE things do Marco and Jenna have to do NOW for the project? (Choice 3)', options_json: '["A. interview some people","B. hand out questionnaires","C. choose their subjects","D. take photographs","E. use statistical software","F. do some work in the library","G. contact some local companies"]', correct_answer_json: '["G"]', marks: 1, explanation: 'G. contact some local companies' },
          { id: 'q_t1_l_28', part_number: 3, question_number: 28, question_type: 'multiple_choice', prompt: 'Why did Jenna and Marco agree to work together?', options_json: '["A. because they both wanted to work with someone else","B. because they each have different skills","C. because they have worked together before"]', correct_answer_json: '["B"]', marks: 1, explanation: 'B. because they each have different skills' },
          { id: 'q_t1_l_29', part_number: 3, question_number: 29, question_type: 'multiple_choice', prompt: 'Why does Marco suggest that he writes the analysis?', options_json: '["A. He needs more practice with this kind of writing.","B. He is better at English than Jenna.","C. He has more experience of this than Jenna."]', correct_answer_json: '["C"]', marks: 1, explanation: 'C. He has more experience of this than Jenna.' },
          { id: 'q_t1_l_30', part_number: 3, question_number: 30, question_type: 'multiple_choice', prompt: 'Why does Jenna offer to do the presentation?', options_json: '["A. Her tutor wants her to do the presentation.","B. Marco is very nervous about giving presentations.","C. She wants to divide the work on the project fairly."]', correct_answer_json: '["A"]', marks: 1, explanation: 'A. Her tutor wants her to do the presentation.' },

          { id: 'q_t1_l_31', part_number: 4, question_number: 31, question_type: 'matching', prompt: '31. It is more popular at the weekend than during the week.', options_json: '["A","B","C"]', correct_answer_json: '["C"]', marks: 1, explanation: 'C (the press) is more popular at the weekend.' },
          { id: 'q_t1_l_32', part_number: 4, question_number: 32, question_type: 'matching', prompt: '32. It has affected the popularity of local radio.', options_json: '["A","B","C"]', correct_answer_json: '["B"]', marks: 1, explanation: 'B (internet) affected local radio popularity.' },
          { id: 'q_t1_l_33', part_number: 4, question_number: 33, question_type: 'matching', prompt: '33. It has recently been able to expand internationally.', options_json: '["A","B","C"]', correct_answer_json: '["C"]', marks: 1, explanation: 'C (the press) expanded internationally.' },
          { id: 'q_t1_l_34', part_number: 4, question_number: 34, question_type: 'matching', prompt: '34. It is offering more varied reporting than previously.', options_json: '["A","B","C"]', correct_answer_json: '["A"]', marks: 1, explanation: 'A (television) offers more varied reporting.' },
          { id: 'q_t1_l_35', part_number: 4, question_number: 35, question_type: 'matching', prompt: '35. It has suffered from government intervention.', options_json: '["A","B","C"]', correct_answer_json: '["A"]', marks: 1, explanation: 'A (television) suffered from government intervention.' },
          { id: 'q_t1_l_36', part_number: 4, question_number: 36, question_type: 'summary_completion', prompt: '...and their [36] now exceeds that of other industries.', options_json: null, correct_answer_json: '["profit margin"]', marks: 1, explanation: 'Newspaper profit margin exceeds other industries.' },
          { id: 'q_t1_l_37', part_number: 4, question_number: 37, question_type: 'summary_completion', prompt: 'Advertising has increased because of a good relationship with the [37] sector.', options_json: null, correct_answer_json: '["retail"]', marks: 1, explanation: 'Relationship with the retail sector.' },
          { id: 'q_t1_l_38', part_number: 4, question_number: 38, question_type: 'summary_completion', prompt: 'Newspapers now run more adverts which include [38].', options_json: null, correct_answer_json: '["vouchers"]', marks: 1, explanation: 'Adverts including vouchers.' },
          { id: 'q_t1_l_39', part_number: 4, question_number: 39, question_type: 'summary_completion', prompt: 'These have been found to raise readership of the papers and create more sales for the [39].', options_json: null, correct_answer_json: '["clients"]', marks: 1, explanation: 'Create more sales for the clients.' },
          { id: 'q_t1_l_40', part_number: 4, question_number: 40, question_type: 'summary_completion', prompt: 'There are also an increasing number of more expensive [40] adverts.', options_json: null, correct_answer_json: '["full-page","full page"]', marks: 1, explanation: 'More expensive full-page adverts.' }
        ]
      },
      {
        id: 'sec_t1_read',
        test_id: 'test_acad_01',
        section_type: 'reading',
        title: 'Academic Reading Test',
        instructions: 'The Academic Reading test consists of 3 passages with a total of 40 questions. You have 60 minutes to complete the test.',
        order_index: 2,
        duration_minutes: 60,
        total_questions: 40,
        audio_files: [],
        writing_tasks: [],
        speaking_tasks: [],
        passages: [
          {
            id: 'pas_t1_1',
            passage_number: 1,
            title: 'The Evolutionary History of Urban Apiculture',
            subtitle: 'How honeybees adapted to city rooftops and the emerging ecological tensions with native species',
            content_html: `<h3>Passage 1: The Evolutionary History of Urban Apiculture</h3>
<p><strong>Paragraph A</strong><br>Urban beekeeping, or urban apiculture, has transformed from an eccentric rooftop hobby into a cornerstone of contemporary metropolitan biodiversity strategy. Over the past two decades, major global cities including London, Paris, Melbourne, and Tokyo have witnessed an unprecedented resurgence in managed honeybee (<em>Apis mellifera</em>) populations. While historically confined to pastoral agrarian landscapes, honeybees have demonstrated a startling adaptability to dense architectural canyons, flourishing in microclimates that provide buffered seasonal temperatures and prolonged floral blooming cycles.</p>
<p><strong>Paragraph B</strong><br>Ecological surveys conducted by urban biodiversity researchers reveal surprising advantages inherent to city environments. Unlike industrial agricultural monocultures—frequently characterized by toxic agrochemical runoff and vast single-crop deserts that bloom for only three weeks before becoming floral voids—metropolitan green networks feature highly heterogeneous botanical resources. Municipal botanical gardens, private residential balconies, pocket parks, and neglected railway verges provide an uninterrupted succession of nectar and pollen sources from early spring through late autumn.</p>
<p><strong>Paragraph C</strong><br>However, the rapid saturation of urban honeybees is not without controversy. Recent conservation biology studies warn of the "honeybee paradox." Because honeybees are a domesticated livestock species rather than wild wildlife, super-dense apiaries can exert overwhelming competitive foraging pressure on native solitary bees, bumblebees, and hoverflies. In dense central boroughs where hive density exceeds ten hives per square kilometer, researchers observed significant floral resource depletion, causing a 35% decline in native pollinator nesting success.</p>
<p><strong>Paragraph D</strong><br>To reconcile these tensions, progressive municipal authorities are adopting evidence-based pollinator management zoning. In Zurich and Melbourne, new regulations require commercial hive operators to register coordinates and maintain minimum spatial buffers from designated wild insect reserves. Simultaneously, city planners are mandating the inclusion of native wildflower green roofs on all commercial developments over eight stories, expanding floral biomass to sustain both domestic and wild insect communities in harmonious coexistence.</p>`
          },
          {
            id: 'pas_t1_2',
            passage_number: 2,
            title: 'Deep-Sea Bioluminescence and Biomimetic Engineering',
            subtitle: 'How abyssal creatures produce cold light and inspire next-generation medical and optical technologies',
            content_html: `<h3>Passage 2: Deep-Sea Bioluminescence and Biomimetic Engineering</h3>
<p><strong>Paragraph A</strong><br>In the bathypelagic zone of the world's oceans—stretching between depths of 1,000 and 4,000 meters—sunlight is utterly absent. In this perpetual abyss, over ninety percent of macroscopic marine life has evolved the ability to produce cold biological light, a biochemical phenomenon known as bioluminescence. Unlike incandescence, where light is generated through thermal energy with immense heat loss, bioluminescence achieves an optical efficiency nearing ninety-eight percent, generating intense photons with almost zero thermal dissipation through the enzymatic oxidation of luciferin catalyzed by luciferase.</p>
<p><strong>Paragraph B</strong><br>Marine creatures deploy this ethereal illumination for three primary evolutionary objectives: predation, defense, and intraspecific communication. The deep-sea anglerfish (<em>Melanocetus johnsonii</em>) employs a luminous dorsal photophore filled with symbiotic bioluminescent bacteria to lure unsuspecting prey directly into its cavernous jaws. Conversely, the cookiecutter shark utilizes counter-illumination; ventral photophores match the downwelling ambient light from the surface, rendering the predator invisible from below to silhouette-hunting apex predators.</p>
<p><strong>Paragraph C</strong><br>Materials scientists and optical physicists are now reverse-engineering these abyssal adaptations to develop revolutionary biomimetic technologies. Traditional light-emitting diodes (LEDs) suffer from efficiency drop-offs caused by internal total reflection and localized heat degradation. By replicating the micro-structured nanophotonic scales found on the bioluminescent organs of deep-sea squid, researchers at MIT have synthesized bio-inspired optical diffusers that increase LED illumination output by 42% while cutting power consumption in half.</p>
<p><strong>Paragraph D</strong><br>Furthermore, biomedical engineers are harnessing engineered luciferase assays for non-invasive real-time cancer diagnostics. Because bioluminescent reactions produce zero background autofluorescence inside human tissue, tagged antibodies emitting near-infrared wavelengths allow surgeons to delineate microscopic tumor margins during oncology surgery with sub-millimeter precision, radically reducing post-operative recurrence rates.</p>`
          },
          {
            id: 'pas_t1_3',
            passage_number: 3,
            title: 'Cognitive Archaeology and the Origin of Symbolic Thought',
            subtitle: 'Unravelling early human abstraction through Pleistocene cave art and geometric ochre engravings',
            content_html: `<h3>Passage 3: Cognitive Archaeology and the Origin of Symbolic Thought</h3>
<p><strong>Paragraph A</strong><br>The emergence of behavioral modernity—the suite of cognitive traits including syntactic language, abstract conceptualization, and symbolic material culture—remains one of paleoanthropology's most fiercely contested frontiers. For decades, the dominant Eurocentric paradigm held that a sudden neurological "creative explosion" occurred roughly 40,000 years ago during the Upper Paleolithic in Western Europe, evidenced by the magnificent figurative cave paintings of Chauvet and Lascaux.</p>
<p><strong>Paragraph B</strong><br>However, spectacular archaeological discoveries across Southern Africa and Southeast Asia have dismantled the sudden mutation hypothesis. At Blombos Cave on South Africa's southern Cape coast, excavations led by Professor Christopher Henshilwood recovered cross-hatched geometric engravings on silcrete ochre plaques dating back over 73,000 years. Similarly, limestone karst caves in Maros-Pangkep, Sulawesi, yielded figurative babirusa paintings securely dated using uranium-series isotopic analysis to at least 45,500 years ago, demonstrating that symbolic capacities evolved far earlier within African <em>Homo sapiens</em> populations before modern human dispersals.</p>
<p><strong>Paragraph C</strong><br>Cognitive archaeologists argue that material symbols functioned not merely as artistic expressions, but as vital scaffolding for collective memory and social networks. In volatile Pleistocene environments characterized by abrupt glacial cycles, groups with shared symbolic iconography could establish reciprocal alliances and exchange networks across vast geographical territories, providing crucial demographic buffers during severe ecological downturns.</p>`
          }
        ],
        questions: [
          { id: 'q_t1_r_1', passage_id: 'pas_t1_1', question_number: 1, question_type: 'matching_headings', prompt: 'Which paragraph discusses the unexpected botanical diversity of metropolitan environments compared to rural monocultures?', options_json: '["Paragraph A","Paragraph B","Paragraph C","Paragraph D"]', correct_answer_json: '["Paragraph B"]', marks: 1, explanation: 'Paragraph B explicitly contrasts rural single-crop deserts with diverse city botanical gardens and balconies.' },
          { id: 'q_t1_r_2', passage_id: 'pas_t1_1', question_number: 2, question_type: 'matching_headings', prompt: 'Which paragraph outlines regulatory measures and architectural requirements to protect wild pollinators?', options_json: '["Paragraph A","Paragraph B","Paragraph C","Paragraph D"]', correct_answer_json: '["Paragraph D"]', marks: 1, explanation: 'Paragraph D details municipal zoning in Zurich and Melbourne requiring green roofs and spatial buffers.' },
          { id: 'q_t1_r_3', passage_id: 'pas_t1_1', question_number: 3, question_type: 'matching_headings', prompt: 'Which paragraph explores the negative impact of hive overcrowding on native solitary species?', options_json: '["Paragraph A","Paragraph B","Paragraph C","Paragraph D"]', correct_answer_json: '["Paragraph C"]', marks: 1, explanation: 'Paragraph C describes the "honeybee paradox" and resource competition.' },
          { id: 'q_t1_r_4', passage_id: 'pas_t1_1', question_number: 4, question_type: 'true_false_not_given', prompt: 'Urban microclimates generally provide longer flowering periods than rural monocultures.', options_json: '["TRUE","FALSE","NOT GIVEN"]', correct_answer_json: '["TRUE","True"]', marks: 1, explanation: 'Paragraph A and B confirm urban microclimates provide prolonged floral blooming cycles.' },
          { id: 'q_t1_r_5', passage_id: 'pas_t1_1', question_number: 5, question_type: 'true_false_not_given', prompt: 'Honeybees were originally domesticated in Tokyo during the nineteenth century.', options_json: '["TRUE","FALSE","NOT GIVEN"]', correct_answer_json: '["NOT GIVEN","Not Given"]', marks: 1, explanation: 'The text mentions Tokyo as a modern city with apiaries, but gives no claim about where or when domestication originated.' },
          { id: 'q_t1_r_6', passage_id: 'pas_t1_1', question_number: 6, question_type: 'true_false_not_given', prompt: 'High hive density has been shown to decrease the nesting success of native wild pollinators.', options_json: '["TRUE","FALSE","NOT GIVEN"]', correct_answer_json: '["TRUE","True"]', marks: 1, explanation: 'Paragraph C states that high hive density caused a 35% decline in native pollinator nesting success.' },
          { id: 'q_t1_r_7', passage_id: 'pas_t1_1', question_number: 7, question_type: 'true_false_not_given', prompt: 'Zurich completely banned all rooftop beekeeping within city limits in 2024.', options_json: '["TRUE","FALSE","NOT GIVEN"]', correct_answer_json: '["FALSE","False"]', marks: 1, explanation: 'Paragraph D explains Zurich created zoning buffers and registration rules, not a complete ban.' },
          { id: 'q_t1_r_8', passage_id: 'pas_t1_1', question_number: 8, question_type: 'sentence_completion', prompt: 'In rural monocultures, crops bloom for only about [8] weeks before leaving floral voids.', options_json: null, correct_answer_json: '["three","3","three weeks"]', marks: 1, explanation: 'Paragraph B explicitly mentions single-crop deserts blooming for three weeks.' },
          { id: 'q_t1_r_9', passage_id: 'pas_t1_1', question_number: 9, question_type: 'sentence_completion', prompt: 'The competition between domestic honeybees and wild insects is referred to by biologists as the honeybee [9]', options_json: null, correct_answer_json: '["paradox"]', marks: 1, explanation: 'Paragraph C refers explicitly to the "honeybee paradox".' },
          { id: 'q_t1_r_10', passage_id: 'pas_t1_1', question_number: 10, question_type: 'sentence_completion', prompt: 'Native pollinator nesting success dropped by [10] percent in overcrowded zones.', options_json: null, correct_answer_json: '["35","35%"]', marks: 1, explanation: 'Paragraph C reports a 35% decline.' },
          { id: 'q_t1_r_11', passage_id: 'pas_t1_1', question_number: 11, question_type: 'multiple_choice', prompt: 'What is the primary scientific classification distinction highlighted in Paragraph C?', options_json: '["Honeybees cannot survive cold winters","Honeybees are domesticated livestock rather than wild fauna","Honeybees produce toxic honey in cities","Honeybees only forage on ornamental roses"]', correct_answer_json: '["Honeybees are domesticated livestock rather than wild fauna"]', marks: 1, explanation: 'Paragraph C emphasizes honeybees are managed livestock competing with wild species.' },
          { id: 'q_t1_r_12', passage_id: 'pas_t1_1', question_number: 12, question_type: 'multiple_choice', prompt: 'What do new building codes in Zurich and Melbourne require for tall developments?', options_json: '["Installation of native wildflower green roofs","A maximum of two hives per tenant","Compulsory underground bee hives","Zero floral landscaping"]', correct_answer_json: '["Installation of native wildflower green roofs"]', marks: 1, explanation: 'Paragraph D notes green roofs are mandated on developments over eight stories.' },
          { id: 'q_t1_r_13', passage_id: 'pas_t1_1', question_number: 13, question_type: 'short_answer', prompt: 'Name one city mentioned that adopted spatial buffer zones for hive management.', options_json: null, correct_answer_json: '["Zurich","Melbourne"]', marks: 1, explanation: 'Paragraph D mentions Zurich and Melbourne.' },

          { id: 'q_t1_r_14', passage_id: 'pas_t1_2', question_number: 14, question_type: 'multiple_choice', prompt: 'At what oceanic depth range does the bathypelagic zone exist?', options_json: '["200 to 500 meters","1,000 to 4,000 meters","5,000 to 8,000 meters","Under 500 meters only"]', correct_answer_json: '["1,000 to 4,000 meters"]', marks: 1, explanation: 'Paragraph A defines the bathypelagic zone between 1,000 and 4,000 meters.' },
          { id: 'q_t1_r_15', passage_id: 'pas_t1_2', question_number: 15, question_type: 'multiple_choice', prompt: 'What is the primary thermodynamic difference between incandescence and bioluminescence?', options_json: '["Incandescence requires living cells","Bioluminescence converts energy into light with almost no heat loss","Incandescence produces only blue light","Bioluminescence requires radioactive elements"]', correct_answer_json: '["Bioluminescence converts energy into light with almost no heat loss"]', marks: 1, explanation: 'Paragraph A states bioluminescence has near 98% efficiency with zero thermal dissipation.' },
          { id: 'q_t1_r_16', passage_id: 'pas_t1_2', question_number: 16, question_type: 'true_false_not_given', prompt: 'The cookiecutter shark uses bioluminescent light on its belly to camouflage against surface illumination.', options_json: '["TRUE","FALSE","NOT GIVEN"]', correct_answer_json: '["TRUE","True"]', marks: 1, explanation: 'Paragraph B describes counter-illumination on ventral photophores.' },
          { id: 'q_t1_r_17', passage_id: 'pas_t1_2', question_number: 17, question_type: 'true_false_not_given', prompt: 'Anglerfish glow because they ingest synthetic radioactive isotopes.', options_json: '["TRUE","FALSE","NOT GIVEN"]', correct_answer_json: '["FALSE","False"]', marks: 1, explanation: 'Paragraph B states the dorsal lure is filled with symbiotic bioluminescent bacteria.' },
          { id: 'q_t1_r_18', passage_id: 'pas_t1_2', question_number: 18, question_type: 'true_false_not_given', prompt: 'All deep-sea species produce light in exactly the same yellow wavelength.', options_json: '["TRUE","FALSE","NOT GIVEN"]', correct_answer_json: '["FALSE","False"]', marks: 1, explanation: 'The passage highlights near-infrared and various camouflage wavelengths, disproving single yellow wavelength.' },
          { id: 'q_t1_r_19', passage_id: 'pas_t1_2', question_number: 19, question_type: 'true_false_not_given', prompt: 'MIT has already commercialized their biomimetic LED bulbs in 40 countries.', options_json: '["TRUE","FALSE","NOT GIVEN"]', correct_answer_json: '["NOT GIVEN","Not Given"]', marks: 1, explanation: 'The text describes research synthesis at MIT but gives no information on commercial sales in 40 countries.' },
          { id: 'q_t1_r_20', passage_id: 'pas_t1_2', question_number: 20, question_type: 'summary_completion', prompt: 'Bioluminescence relies on the oxidation of [20] catalyzed by luciferase.', options_json: null, correct_answer_json: '["luciferin"]', marks: 1, explanation: 'Paragraph A describes enzymatic oxidation of luciferin.' },
          { id: 'q_t1_r_21', passage_id: 'pas_t1_2', question_number: 21, question_type: 'summary_completion', prompt: 'Replicating squid nanostructures boosted LED optical output by [21] percent.', options_json: null, correct_answer_json: '["42","42%"]', marks: 1, explanation: 'Paragraph C states an output increase of 42%.' },
          { id: 'q_t1_r_22', passage_id: 'pas_t1_2', question_number: 22, question_type: 'summary_completion', prompt: 'In surgical oncology, tagged antibodies emit [22] wavelengths to highlight tumor edges.', options_json: null, correct_answer_json: '["near-infrared","infrared"]', marks: 1, explanation: 'Paragraph D notes antibodies emitting near-infrared wavelengths.' },
          { id: 'q_t1_r_23', passage_id: 'pas_t1_2', question_number: 23, question_type: 'multiple_choice', prompt: 'What organ does the deep-sea anglerfish use for bioluminescence?', options_json: '["Ventral fins","Dorsal photophore","Caudal spine","Gills"]', correct_answer_json: '["Dorsal photophore"]', marks: 1, explanation: 'Paragraph B explicitly mentions a luminous dorsal photophore.' },
          { id: 'q_t1_r_24', passage_id: 'pas_t1_2', question_number: 24, question_type: 'matching', prompt: 'Anglerfish light organ purpose:', options_json: '["Luring prey into jaws","Camouflage from surface predators","Emitting near-infrared signals","Heating deep water"]', correct_answer_json: '["Luring prey into jaws"]', marks: 1, explanation: 'Paragraph B states anglerfish lure prey into cavernous jaws.' },
          { id: 'q_t1_r_25', passage_id: 'pas_t1_2', question_number: 25, question_type: 'matching', prompt: 'Cookiecutter shark belly lighting purpose:', options_json: '["Luring prey into jaws","Camouflage from surface predators","Emitting near-infrared signals","Heating deep water"]', correct_answer_json: '["Camouflage from surface predators"]', marks: 1, explanation: 'Paragraph B states ventral photophores match downwelling surface light.' },
          { id: 'q_t1_r_26', passage_id: 'pas_t1_2', question_number: 26, question_type: 'short_answer', prompt: 'What enzyme catalyzes the oxidation of luciferin?', options_json: null, correct_answer_json: '["luciferase"]', marks: 1, explanation: 'Paragraph A specifies the enzyme luciferase.' },

          { id: 'q_t1_r_27', passage_id: 'pas_t1_3', question_number: 27, question_type: 'matching_headings', prompt: 'Which paragraph discusses discoveries in South Africa and Southeast Asia that disproved the Eurocentric timeline?', options_json: '["Paragraph A","Paragraph B","Paragraph C"]', correct_answer_json: '["Paragraph B"]', marks: 1, explanation: 'Paragraph B describes Blombos Cave (73,000 BP) and Sulawesi cave art (45,500 BP).' },
          { id: 'q_t1_r_28', passage_id: 'pas_t1_3', question_number: 28, question_type: 'matching_headings', prompt: 'Which paragraph explains how symbolic artifacts functioned as social networks and survival buffers?', options_json: '["Paragraph A","Paragraph B","Paragraph C"]', correct_answer_json: '["Paragraph C"]', marks: 1, explanation: 'Paragraph C details demographic buffers and reciprocal alliances.' },
          { id: 'q_t1_r_29', passage_id: 'pas_t1_3', question_number: 29, question_type: 'true_false_not_given', prompt: 'The Eurocentric paradigm claimed symbolic abstraction began suddenly 40,000 years ago in Europe.', options_json: '["TRUE","FALSE","NOT GIVEN"]', correct_answer_json: '["TRUE","True"]', marks: 1, explanation: 'Paragraph A outlines the 40,000-year Upper Paleolithic Eurocentric creative explosion hypothesis.' },
          { id: 'q_t1_r_30', passage_id: 'pas_t1_3', question_number: 30, question_type: 'true_false_not_given', prompt: 'Engravings found at Blombos Cave were dated to over 73,000 years old.', options_json: '["TRUE","FALSE","NOT GIVEN"]', correct_answer_json: '["TRUE","True"]', marks: 1, explanation: 'Paragraph B states engravings on silcrete ochre date back over 73,000 years.' },
          { id: 'q_t1_r_31', passage_id: 'pas_t1_3', question_number: 31, question_type: 'true_false_not_given', prompt: 'Sulawesi cave paintings were dated using radiocarbon methods on animal bones only.', options_json: '["FALSE","False"]', correct_answer_json: '["FALSE","False"]', marks: 1, explanation: 'Paragraph B specifies uranium-series isotopic analysis was used.' },
          { id: 'q_t1_r_32', passage_id: 'pas_t1_3', question_number: 32, question_type: 'true_false_not_given', prompt: 'Neanderthals were proven to have painted the Chauvet cave panels.', options_json: '["NOT GIVEN","Not Given"]', correct_answer_json: '["NOT GIVEN","Not Given"]', marks: 1, explanation: 'The text mentions Chauvet cave paintings but makes no statement regarding Neanderthal authorship.' },
          { id: 'q_t1_r_33', passage_id: 'pas_t1_3', question_number: 33, question_type: 'sentence_completion', prompt: 'Engravings at Blombos Cave were carved into plaques made of [33]', options_json: null, correct_answer_json: '["silcrete ochre","ochre","silcrete"]', marks: 1, explanation: 'Paragraph B refers to cross-hatched geometric engravings on silcrete ochre.' },
          { id: 'q_t1_r_34', passage_id: 'pas_t1_3', question_number: 34, question_type: 'sentence_completion', prompt: 'Sulawesi rock art depicted an animal known as a [34]', options_json: null, correct_answer_json: '["babirusa"]', marks: 1, explanation: 'Paragraph B states figurative babirusa paintings.' },
          { id: 'q_t1_r_35', passage_id: 'pas_t1_3', question_number: 35, question_type: 'sentence_completion', prompt: 'Shared symbolic iconography enabled early humans to form reciprocal [35] across wide regions.', options_json: null, correct_answer_json: '["alliances","networks"]', marks: 1, explanation: 'Paragraph C describes reciprocal alliances.' },
          { id: 'q_t1_r_36', passage_id: 'pas_t1_3', question_number: 36, question_type: 'multiple_choice', prompt: 'Who led the excavations at Blombos Cave?', options_json: '["Professor Christopher Henshilwood","Dr. Sarah Jenkins","Professor David Lewis","Dr. Richard Leakey"]', correct_answer_json: '["Professor Christopher Henshilwood"]', marks: 1, explanation: 'Paragraph B mentions Professor Christopher Henshilwood.' },
          { id: 'q_t1_r_37', passage_id: 'pas_t1_3', question_number: 37, question_type: 'multiple_choice', prompt: 'In which region are the Maros-Pangkep limestone karst caves located?', options_json: '["Sulawesi","South Africa","Western France","Tasmania"]', correct_answer_json: '["Sulawesi"]', marks: 1, explanation: 'Paragraph B names Sulawesi, Southeast Asia.' },
          { id: 'q_t1_r_38', passage_id: 'pas_t1_3', question_number: 38, question_type: 'short_answer', prompt: 'What isotopic dating technique was applied to the Sulawesi rock paintings?', options_json: null, correct_answer_json: '["uranium-series","uranium series"]', marks: 1, explanation: 'Paragraph B mentions uranium-series isotopic analysis.' },
          { id: 'q_t1_r_39', passage_id: 'pas_t1_3', question_number: 39, question_type: 'multiple_choice', prompt: 'According to cognitive archaeologists, what did material symbols function as?', options_json: '["Vital cognitive scaffolding and social network buffers","Currency for trading food","Decorative religious icons only","Maps for oceanic navigation"]', correct_answer_json: '["Vital cognitive scaffolding and social network buffers"]', marks: 1, explanation: 'Paragraph C details scaffolding for collective memory and social networks.' },
          { id: 'q_t1_r_40', passage_id: 'pas_t1_3', question_number: 40, question_type: 'short_answer', prompt: 'What species of human developed early symbolic capacities in Africa before dispersals?', options_json: null, correct_answer_json: '["Homo sapiens","Homo Sapiens"]', marks: 1, explanation: 'Paragraph B explicitly names African Homo sapiens.' }
        ]
      },
      {
        id: 'sec_t1_write',
        test_id: 'test_acad_01',
        section_type: 'writing',
        title: 'Academic Writing Test',
        instructions: 'You have 60 minutes to complete both Task 1 and Task 2. Write at least 150 words for Task 1 and 250 words for Task 2.',
        order_index: 3,
        duration_minutes: 60,
        total_questions: 2,
        audio_files: [],
        passages: [],
        speaking_tasks: [],
        questions: [],
        writing_tasks: [
          {
            id: 'wt_t1_1',
            task_number: 1,
            title: 'Academic Writing Task 1: Renewable Energy Generation Comparison',
            prompt: 'The chart below shows the proportion of electricity generated by four different renewable energy sources (Solar, Wind, Hydro, and Biomass) in three European nations in 2024.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.',
            instructions: 'Write at least 150 words. You should spend about 20 minutes on this task.',
            min_words: 150,
            suggested_time_minutes: 20,
            chart_image_url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 300"><rect width="600" height="300" fill="%230F172A" rx="8"/><text x="300" y="35" fill="%23FFFFFF" font-family="sans-serif" font-size="16" font-weight="bold" text-anchor="middle">Renewable Electricity Generation by Source (2024)</text><g transform="translate(60, 60)"><rect x="40" y="50" width="30" height="150" fill="%23C7202D"/><rect x="80" y="70" width="30" height="130" fill="%233B82F6"/><rect x="120" y="110" width="30" height="90" fill="%2310B981"/><text x="95" y="220" fill="%2394A3B8" font-size="13" text-anchor="middle">Germany</text><rect x="200" y="30" width="30" height="170" fill="%23C7202D"/><rect x="240" y="100" width="30" height="100" fill="%233B82F6"/><rect x="280" y="130" width="30" height="70" fill="%2310B981"/><text x="255" y="220" fill="%2394A3B8" font-size="13" text-anchor="middle">Spain</text><rect x="360" y="90" width="30" height="110" fill="%23C7202D"/><rect x="400" y="40" width="30" height="160" fill="%233B82F6"/><rect x="440" y="80" width="30" height="120" fill="%2310B981"/><text x="415" y="220" fill="%2394A3B8" font-size="13" text-anchor="middle">Denmark</text></g></svg>'
          },
          {
            id: 'wt_t1_2',
            task_number: 2,
            title: 'Academic Writing Task 2: Artificial Intelligence in Higher Education',
            prompt: 'Some people argue that artificial intelligence tools such as automated tutors and language models will soon replace human university professors. Others believe that human instructors remain indispensable for higher education.\n\nDiscuss both views and give your own opinion. Give reasons for your answer and include any relevant examples from your own knowledge or experience.',
            instructions: 'Write at least 250 words. You should spend about 40 minutes on this task.',
            min_words: 250,
            suggested_time_minutes: 40,
            chart_image_url: null
          }
        ]
      },
      {
        id: 'sec_t1_speak',
        test_id: 'test_acad_01',
        section_type: 'speaking',
        title: 'Speaking Test Simulation',
        instructions: 'The Speaking test consists of 3 parts. Follow the interactive prompts and record your verbal responses for examiner evaluation.',
        order_index: 4,
        duration_minutes: 15,
        total_questions: 3,
        audio_files: [],
        passages: [],
        writing_tasks: [],
        questions: [],
        speaking_tasks: [
          {
            id: 'st_t1_1',
            part_number: 1,
            title: 'Part 1: Introduction & Everyday Topics (Hometown & Studies)',
            prompt: 'Let us talk about your hometown.\n1. Where is your hometown located?\n2. What do you like most about living there?\n3. Has your hometown changed much over the past ten years?\n4. What kind of jobs do people do in your area?',
            instructions: 'Answer each question naturally in 2-3 sentences. Speak clearly into your microphone.',
            prep_time_seconds: 10,
            speak_time_seconds: 180,
            cue_card_points_json: null
          },
          {
            id: 'st_t1_2',
            part_number: 2,
            title: 'Part 2: Long Turn Cue Card (A Memorable Journey)',
            prompt: 'Describe a memorable journey or trip you took that did not go according to plan.\n\nYou should say:\n- Where you were going and who you were with\n- What unexpected problem happened during the trip\n- How you resolved or dealt with the situation\nAnd explain what you learned from this experience.',
            instructions: 'You have 1 minute to read the cue card and prepare your notes. Then speak for 1 to 2 minutes.',
            prep_time_seconds: 60,
            speak_time_seconds: 120,
            cue_card_points_json: '["Where you went and who was with you","What unexpected problem arose","How you managed the issue","What lessons you gained from the trip"]'
          },
          {
            id: 'st_t1_3',
            part_number: 3,
            title: 'Part 3: Two-Way Discussion (Tourism, Travel & Globalization)',
            prompt: '1. How has international travel changed compared to twenty years ago?\n2. What are the negative environmental impacts of mass tourism on fragile heritage sites?\n3. Do you think virtual reality tours will ever replace physical vacations?\n4. How can governments encourage sustainable eco-tourism?',
            instructions: 'Provide in-depth, structured arguments with supporting reasoning and examples.',
            prep_time_seconds: 15,
            speak_time_seconds: 240,
            cue_card_points_json: null
          }
        ]
      }
    ]
  }
};
