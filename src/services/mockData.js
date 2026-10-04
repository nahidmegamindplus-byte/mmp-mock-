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
            title: 'Part 1: Accommodation Inquiry & Student Services',
            file_url: generateWavBase64(30, 440),
            transcript: 'Receptionist: Good morning, City Accommodation Services. How can I help you? Student: Hello, I am calling to inquire about housing options near the campus...'
          },
          {
            id: 'aud_t1_p2',
            part_number: 2,
            title: 'Part 2: Local Community Center Facilities Guide',
            file_url: generateWavBase64(30, 520),
            transcript: 'Speaker: Welcome everyone to the Riverside Leisure Center orientation. Today I will guide you through our newly renovated recreational facilities...'
          },
          {
            id: 'aud_t1_p3',
            part_number: 3,
            title: 'Part 3: Academic Tutorial on Sustainable Energy',
            file_url: generateWavBase64(30, 600),
            transcript: 'Tutor: Good afternoon Sarah and Liam. Let us review your draft research proposal on solar battery grid integration...'
          },
          {
            id: 'aud_t1_p4',
            part_number: 4,
            title: 'Part 4: Lecture on Marine Ecosystem Restoration',
            file_url: generateWavBase64(30, 680),
            transcript: 'Professor: In today’s environmental biology lecture, we will examine the historical decline and modern acoustic restoration techniques of coral reef biomes...'
          }
        ],
        passages: [],
        writing_tasks: [],
        speaking_tasks: [],
        questions: [
          { id: 'q_t1_l_1', part_number: 1, question_number: 1, question_type: 'form_completion', prompt: 'Preferred accommodation type: [1]', options_json: null, correct_answer_json: '["studio","studio apartment"]', marks: 1, explanation: 'The caller states she wants a quiet studio apartment.' },
          { id: 'q_t1_l_2', part_number: 1, question_number: 2, question_type: 'form_completion', prompt: 'Maximum monthly budget: £ [2]', options_json: null, correct_answer_json: '["650","650 pounds"]', marks: 1, explanation: 'The student explicitly mentions her upper limit is 650 pounds.' },
          { id: 'q_t1_l_3', part_number: 1, question_number: 3, question_type: 'form_completion', prompt: 'Desired move-in date: [3] September', options_json: null, correct_answer_json: '["15th","15","15 September"]', marks: 1, explanation: 'She confirms her flight arrives on the 14th, so move-in is 15th.' },
          { id: 'q_t1_l_4', part_number: 1, question_number: 4, question_type: 'form_completion', prompt: 'Distance from central library: within [4] minutes walk', options_json: null, correct_answer_json: '["20","twenty"]', marks: 1, explanation: 'She requests a maximum 20-minute walking distance.' },
          { id: 'q_t1_l_5', part_number: 1, question_number: 5, question_type: 'note_completion', prompt: 'Kitchen facilities must include an electric [5]', options_json: null, correct_answer_json: '["cooker","stove","oven"]', marks: 1, explanation: 'She mentions needing an electric cooker in the kitchenette.' },
          { id: 'q_t1_l_6', part_number: 1, question_number: 6, question_type: 'multiple_choice', prompt: 'Which utility bill is included in the rent?', options_json: '["Electricity only","Water and Wi-Fi","Gas heating only","Council tax"]', correct_answer_json: '["Water and Wi-Fi"]', marks: 1, explanation: 'The manager notes that water rates and broadband Wi-Fi are fully inclusive.' },
          { id: 'q_t1_l_7', part_number: 1, question_number: 7, question_type: 'multiple_choice', prompt: 'Where is the security deposit held?', options_json: '["With the landlord directly","In a government protection scheme","At the university office","In a shared bank vault"]', correct_answer_json: '["In a government protection scheme"]', marks: 1, explanation: 'Deposits are lodged in the national tenancy protection scheme.' },
          { id: 'q_t1_l_8', part_number: 1, question_number: 8, question_type: 'form_completion', prompt: 'Contact telephone number: 07700 [8]', options_json: null, correct_answer_json: '["900452","900 452"]', marks: 1, explanation: 'The student spells out the remaining digits 9-0-0-4-5-2.' },
          { id: 'q_t1_l_9', part_number: 1, question_number: 9, question_type: 'form_completion', prompt: 'Emergency contact person: [9] (Uncle)', options_json: null, correct_answer_json: '["Arthur Davies","Arthur","Davies"]', marks: 1, explanation: 'She gives her uncle’s full name as Arthur Davies.' },
          { id: 'q_t1_l_10', part_number: 1, question_number: 10, question_type: 'short_answer', prompt: 'What identification document must be brought to the viewing?', options_json: null, correct_answer_json: '["passport","student passport"]', marks: 1, explanation: 'The agent reminds her to bring her passport.' },
          
          { id: 'q_t1_l_11', part_number: 2, question_number: 11, question_type: 'multiple_choice', prompt: 'When was the community center originally founded?', options_json: '["1972","1984","1996","2005"]', correct_answer_json: '["1984"]', marks: 1, explanation: 'The speaker states the original foundation stone was laid in 1984.' },
          { id: 'q_t1_l_12', part_number: 2, question_number: 12, question_type: 'multiple_choice', prompt: 'What is the newest facility added during the recent expansion?', options_json: '["Olympic running track","Hydrotherapy wellness pool","Indoor climbing wall","Squash court annex"]', correct_answer_json: '["Hydrotherapy wellness pool"]', marks: 1, explanation: 'The hydrotherapy pool was opened last month as part of Phase 2.' },
          { id: 'q_t1_l_13', part_number: 2, question_number: 13, question_type: 'multiple_choice', prompt: 'Junior membership is available for young people aged up to:', options_json: '["14","16","17","19"]', correct_answer_json: '["17"]', marks: 1, explanation: 'Junior tier applies to everyone under 18 (up to 17 years).' },
          { id: 'q_t1_l_14', part_number: 2, question_number: 14, question_type: 'multiple_choice', prompt: 'Members receive free parking for a maximum duration of:', options_json: '["1 hour","2 hours","3 hours","All day"]', correct_answer_json: '["3 hours"]', marks: 1, explanation: 'The parking gate ticket gives up to 3 complimentary hours.' },
          { id: 'q_t1_l_15', part_number: 2, question_number: 15, question_type: 'matching', prompt: 'Gymnasium area on the site map is located at:', options_json: '["Location A","Location B","Location C","Location D"]', correct_answer_json: '["Location B"]', marks: 1, explanation: 'Directly opposite the main reception foyer is Location B.' },
          { id: 'q_t1_l_16', part_number: 2, question_number: 16, question_type: 'matching', prompt: 'Cafe and refreshment patio is located at:', options_json: '["Location A","Location B","Location C","Location D"]', correct_answer_json: '["Location D"]', marks: 1, explanation: 'Overlooking the south gardens at Location D.' },
          { id: 'q_t1_l_17', part_number: 2, question_number: 17, question_type: 'note_completion', prompt: 'Yoga classes are held every Tuesday at [17] am', options_json: null, correct_answer_json: '["08:30","8:30","8.30"]', marks: 1, explanation: 'Morning yoga starts promptly at 8:30 am.' },
          { id: 'q_t1_l_18', part_number: 2, question_number: 18, question_type: 'note_completion', prompt: 'Swimmers must wear a silicone [18] at all times.', options_json: null, correct_answer_json: '["cap","swimming cap"]', marks: 1, explanation: 'Hygiene rules require a silicone swimming cap.' },
          { id: 'q_t1_l_19', part_number: 2, question_number: 19, question_type: 'short_answer', prompt: 'What item must be placed in lockers for security?', options_json: null, correct_answer_json: '["padlock","coin"]', marks: 1, explanation: 'Lockers require members to bring their own padlock.' },
          { id: 'q_t1_l_20', part_number: 2, question_number: 20, question_type: 'multiple_choice', prompt: 'How can members book popular weekend sessions?', options_json: '["Only in person at the desk","Through the mobile app up to 7 days in advance","By sending a postal voucher","Phone calls on Friday morning only"]', correct_answer_json: '["Through the mobile app up to 7 days in advance"]', marks: 1, explanation: 'App bookings open 7 days beforehand at midnight.' },

          { id: 'q_t1_l_21', part_number: 3, question_number: 21, question_type: 'multiple_choice', prompt: 'Why did Sarah select microgrid resilience for her case study?', options_json: '["It was the easiest topic available","It addresses real-world island energy blackouts","Her supervisor assigned it automatically","Funding was already guaranteed"]', correct_answer_json: '["It addresses real-world island energy blackouts"]', marks: 1, explanation: 'She explains that island grids face severe instability during monsoon seasons.' },
          { id: 'q_t1_l_22', part_number: 3, question_number: 22, question_type: 'multiple_choice', prompt: 'What unexpected finding did Liam uncover in the primary data?', options_json: '["Energy demand dropped during winter","Household solar battery degradation was faster than manufacturer claims","Wind turbines were more popular than solar panels","Government subsidies were doubled"]', correct_answer_json: '["Household solar battery degradation was faster than manufacturer claims"]', marks: 1, explanation: 'Liam highlights a 14% higher battery cell degradation rate.' },
          { id: 'q_t1_l_23', part_number: 3, question_number: 23, question_type: 'multiple_choice', prompt: 'What advice does the tutor give regarding the literature review chapter?', options_json: '["Shorten it to under 500 words","Synthesize themes rather than listing individual author papers","Exclude papers published before 2024","Add more personal opinions"]', correct_answer_json: '["Synthesize themes rather than listing individual author papers"]', marks: 1, explanation: 'The tutor emphasizes thematic synthesis over chronological summaries.' },
          { id: 'q_t1_l_24', part_number: 3, question_number: 24, question_type: 'multiple_choice', prompt: 'Which statistical software do the students decide to use for regression analysis?', options_json: '["SPSS","Excel","R Studio","Matlab"]', correct_answer_json: '["R Studio"]', marks: 1, explanation: 'Both agree that R Studio offers superior open-source statistical packages.' },
          { id: 'q_t1_l_25', part_number: 3, question_number: 25, question_type: 'matching', prompt: 'Data Collection Phase responsibility:', options_json: '["Liam only","Sarah only","Shared equally by Liam and Sarah","External research assistant"]', correct_answer_json: '["Shared equally by Liam and Sarah"]', marks: 1, explanation: 'Both will conduct survey interviews in parallel.' },
          { id: 'q_t1_l_26', part_number: 3, question_number: 26, question_type: 'matching', prompt: 'Cost-Benefit Financial Modelling responsibility:', options_json: '["Liam only","Sarah only","Shared equally by Liam and Sarah","External research assistant"]', correct_answer_json: '["Liam only"]', marks: 1, explanation: 'Liam has the background in financial engineering.' },
          { id: 'q_t1_l_27', part_number: 3, question_number: 27, question_type: 'sentence_completion', prompt: 'The sample size will consist of [27] local business owners.', options_json: null, correct_answer_json: '["120","one hundred and twenty"]', marks: 1, explanation: 'They target exactly 120 commercial survey respondents.' },
          { id: 'q_t1_l_28', part_number: 3, question_number: 28, question_type: 'sentence_completion', prompt: 'All interview transcripts must be anonymized to protect participant [28]', options_json: null, correct_answer_json: '["privacy","confidentiality"]', marks: 1, explanation: 'Ethics board rules mandate strict participant privacy.' },
          { id: 'q_t1_l_29', part_number: 3, question_number: 29, question_type: 'sentence_completion', prompt: 'The final draft deadline is the end of [29]', options_json: null, correct_answer_json: '["November","Nov"]', marks: 1, explanation: 'Submission is fixed for the final Friday of November.' },
          { id: 'q_t1_l_30', part_number: 3, question_number: 30, question_type: 'multiple_choice', prompt: 'What will be the next immediate step before fieldwork starts?', options_json: '["Print 500 paper survey copies","Obtain formal university ethics committee approval","Book international flights","Publish preliminary results on a blog"]', correct_answer_json: '["Obtain formal university ethics committee approval"]', marks: 1, explanation: 'Ethics clearance is required before any survey distribution.' },

          { id: 'q_t1_l_31', part_number: 4, question_number: 31, question_type: 'note_completion', prompt: 'Healthy coral reefs generate a distinct underwater [31] created by marine fauna.', options_json: null, correct_answer_json: '["soundscape","noise","sound"]', marks: 1, explanation: 'The lecture highlights the biophonic soundscape produced by snapping shrimp and reef fish.' },
          { id: 'q_t1_l_32', part_number: 4, question_number: 32, question_type: 'note_completion', prompt: 'Degraded bleached reefs are dangerously [32] to young fish larvae.', options_json: null, correct_answer_json: '["silent","quiet"]', marks: 1, explanation: 'Larvae fail to locate dead reefs because they lack acoustic signatures.' },
          { id: 'q_t1_l_33', part_number: 4, question_number: 33, question_type: 'note_completion', prompt: 'Researchers deployed underwater [33] to broadcast healthy sound recordings.', options_json: null, correct_answer_json: '["loudspeakers","speakers","acoustic speakers"]', marks: 1, explanation: 'Solar-powered underwater loudspeakers were positioned around degraded patch reefs.' },
          { id: 'q_t1_l_34', part_number: 4, question_number: 34, question_type: 'note_completion', prompt: 'Acoustic enrichment increased fish settlement rates by [34] percent.', options_json: null, correct_answer_json: '["50","fifty"]', marks: 1, explanation: 'The published field data confirmed a 50% boost in larval recruitment.' },
          { id: 'q_t1_l_35', part_number: 4, question_number: 35, question_type: 'note_completion', prompt: 'Grazing herbivores like [35] fish prevent suffocating algae blooms.', options_json: null, correct_answer_json: '["parrotfish","parrot"]', marks: 1, explanation: 'Parrotfish are vital grazers that keep macroalgae in check.' },
          { id: 'q_t1_l_36', part_number: 4, question_number: 36, question_type: 'note_completion', prompt: 'The study was conducted across the northern region of the Great [36] Reef.', options_json: null, correct_answer_json: '["Barrier","Barrier Reef"]', marks: 1, explanation: 'Field trials took place on the northern Great Barrier Reef in Australia.' },
          { id: 'q_t1_l_37', part_number: 4, question_number: 37, question_type: 'note_completion', prompt: 'Long-term monitoring showed a doubling in overall species [37]', options_json: null, correct_answer_json: '["diversity","richness"]', marks: 1, explanation: 'Species diversity and richness doubled over the 18-month monitoring cycle.' },
          { id: 'q_t1_l_38', part_number: 4, question_number: 38, question_type: 'note_completion', prompt: 'Acoustic playback must be paired with reductions in global carbon [38]', options_json: null, correct_answer_json: '["emissions","emission"]', marks: 1, explanation: 'The professor cautions that sound alone cannot counter warming oceans without emissions cuts.' },
          { id: 'q_t1_l_39', part_number: 4, question_number: 39, question_type: 'multiple_choice', prompt: 'What is the main limitation of acoustic restoration?', options_json: '["Fish become deaf over time","It cannot protect corals against extreme marine heatwaves","It requires radioactive isotopes","The equipment is eaten by sharks"]', correct_answer_json: '["It cannot protect corals against extreme marine heatwaves"]', marks: 1, explanation: 'Acoustics attracts fish but does not alter seawater temperature.' },
          { id: 'q_t1_l_40', part_number: 4, question_number: 40, question_type: 'note_completion', prompt: 'Future trials will integrate artificial [40] 3D structures with acoustic cues.', options_json: null, correct_answer_json: '["reef","reefs","substrate"]', marks: 1, explanation: 'Future pilots combine 3D-printed ceramic artificial reef substrates with audio beacons.' }
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
