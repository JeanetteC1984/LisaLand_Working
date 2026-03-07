import { useState, useRef, useEffect, useCallback } from "react";
import "../cyber.css";

type Section = "dashboard" | "journal" | "profile" | "vision" | "vboard" | "goals" | "mindmap" | "mood" | "habits" | "settings" | "calendar" | "music" | "budget";

type CalendarEvent = {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  color: string;
  description: string;
  location: string;
  category: string;
  allDay: boolean;
  image?: string;
};

type JournalFile = {
  id: string;
  name: string;
  date: string;
  content: string;
};

type Sticker = {
  id: string;
  type: string;
  x: number;
  y: number;
  rotation: number;
  scale?: number;
};

type BudgetItem = {
  id: string;
  name: string;
  amount: number;
  category: string;
  type: "income" | "expense";
  date: string;
  recurring?: boolean;
};

type Goal = {
  id: string;
  name: string;
  specific: string;
  measurable: string;
  achievable: string;
  relevant: string;
  timeBound: string;
  category: string;
  progress: number;
  status: string;
  milestones?: { text: string; done: boolean }[];
};

type MindMapNode = {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
  parentId: string | null;
};

type Theme = {
  id: string;
  label: string;
  primary: string;
  light?: boolean;
};

const THEMES: Theme[] = [
  { id: "rainbow-dream",   label: "Rainbow Dream",   primary: "#e040fb" },
  { id: "sunset-glow",     label: "Sunset Glow",     primary: "#ff6d00" },
  { id: "ocean-aura",      label: "Ocean Aura",      primary: "#00e5ff" },
  { id: "cosmic-berry",    label: "Cosmic Berry",    primary: "#ff4081" },
  { id: "neon-jungle",     label: "Neon Jungle",     primary: "#69f0ae" },
  { id: "stardust",        label: "Stardust",        primary: "#b388ff" },
  { id: "electric-candy",  label: "Electric Candy",  primary: "#ffd740" },
  { id: "midnight-rose",   label: "Midnight Rose",   primary: "#f48fb1" },
  { id: "aurora",          label: "Aurora",           primary: "#64ffda" },
  { id: "galaxy",          label: "Galaxy",           primary: "#7c4dff" },
  { id: "lt-rainbow-dream",  label: "Petal Pink",      primary: "#c51ade", light: true },
  { id: "lt-sunset-glow",    label: "Marigold",        primary: "#e65100", light: true },
  { id: "lt-ocean-aura",     label: "Clear Sky",       primary: "#00acc1", light: true },
  { id: "lt-cosmic-berry",   label: "Blush Rose",      primary: "#e91e63", light: true },
  { id: "lt-neon-jungle",    label: "Meadow",          primary: "#2e7d32", light: true },
  { id: "lt-stardust",       label: "Wisteria",        primary: "#7e57c2", light: true },
  { id: "lt-electric-candy", label: "Sunshine",        primary: "#f9a825", light: true },
  { id: "lt-midnight-rose",  label: "Cherry Blossom",  primary: "#d81b60", light: true },
  { id: "lt-aurora",         label: "Seafoam",         primary: "#00897b", light: true },
  { id: "lt-galaxy",         label: "Lavender Field",  primary: "#5c35d2", light: true },
];

const INITIAL_FILES: JournalFile[] = [
  {
    id: "tutorial",
    name: "Welcome to Glow Up",
    date: "2026-03-04",
    content: `<h1 class="cy-doc-title" id="doc-title">Welcome to Glow Up</h1>
<div class="cy-case-meta" contenteditable="false">
  Your personal space to journal, dream, and grow.<br>
  Status: <span class="pulse-text" style="color:#69f0ae;">LET'S GO!</span>
</div>
<div class="cy-quote-block">"The magic you seek is already within you."</div>
<p style="max-width:600px;margin-bottom:20px;line-height:1.8;">
  Welcome to <strong>Glow Up</strong> — your cozy digital journal and life planner.
  Here's a quick tour of everything you can do:
</p>

<div class="cy-highlight-bar"><strong>Navigation</strong></div>
<p style="max-width:600px;margin-bottom:20px;line-height:1.8;">
  Use the icon bar on the left to switch between sections. Each icon takes you to a different part of the app. The sidebar on the right shows your journal entries — click any to open it, or use the <strong>+</strong> button to create a new one.
</p>

<div class="cy-highlight-bar"><strong>Journal (this section)</strong></div>
<p style="max-width:600px;margin-bottom:20px;line-height:1.8;">
  This is your rich text editor. Use the toolbar above to <strong>bold</strong>, <em>italicize</em>, change fonts, add lists, and more. Try the <strong>side bar</strong> buttons (vertical lines icon) to create callout blocks like this one. You can also add stickers from the Stickers button!
</p>

<div class="cy-highlight-bar"><strong>Profile</strong></div>
<p style="max-width:600px;margin-bottom:20px;line-height:1.8;">
  Click your avatar to upload a photo. Edit your handle, bio, and personal details. It's your digital identity — make it yours.
</p>

<div class="cy-highlight-bar"><strong>Manifest</strong></div>
<p style="max-width:600px;margin-bottom:20px;line-height:1.8;">
  Six themed cards — Self Love, Manifest, Grow, Morning Ritual, Night Reflect, and Dream Big. Click any card to see affirmations and guided journal prompts. Fill in your answers and hit <strong>"Save as Journal Entry"</strong> — it creates a beautifully formatted entry right here in your journal.
</p>

<div class="cy-highlight-bar"><strong>Vision Board</strong></div>
<p style="max-width:600px;margin-bottom:20px;line-height:1.8;">
  Upload images that inspire you — dream homes, travel destinations, quotes, aesthetics. Build a visual collage of the life you're creating.
</p>

<div class="cy-highlight-bar"><strong>Goals (SMART Tracker)</strong></div>
<p style="max-width:600px;margin-bottom:20px;line-height:1.8;">
  Add goals using the SMART framework (Specific, Measurable, Achievable, Relevant, Time-bound). Track progress with sliders, expand cards for details, and celebrate wins along the way.
</p>

<div class="cy-highlight-bar"><strong>Mind Map</strong></div>
<p style="max-width:600px;margin-bottom:20px;line-height:1.8;">
  Drag nodes around to brainstorm. Double-click a node to rename it. Click the <strong>+</strong> button on any node to add children. Great for planning and connecting ideas visually.
</p>

<div class="cy-highlight-bar"><strong>Mood Tracker</strong></div>
<p style="max-width:600px;margin-bottom:20px;line-height:1.8;">
  Check in daily with how you're feeling — pick an emoji, add an optional note. Your mood history shows up as a visual calendar so you can spot patterns over time.
</p>

<div class="cy-highlight-bar"><strong>Habit Tracker</strong></div>
<p style="max-width:600px;margin-bottom:20px;line-height:1.8;">
  Six habits to build — Meditate, Journal, Exercise, Read, Hydrate, and Gratitude. Tap to check them off each day and watch your streaks grow. The weekly chart shows your consistency.
</p>

<div class="cy-highlight-bar"><strong>Customize</strong></div>
<p style="max-width:600px;margin-bottom:20px;line-height:1.8;">
  Choose from 16 color themes, toggle the CRT screen effect, and pick a canvas + paper pattern. Access it from the gear icon at the bottom of the sidebar.
</p>

<div class="cy-quote-block">"Every page is a new beginning. Start writing your story."</div>
<p style="max-width:600px;margin-bottom:20px;line-height:1.8;">
  Everything you write, track, and upload is saved automatically in your browser. Now go explore — and have fun!
</p>`,
  },
  {
    id: "1",
    name: "My Dream Year",
    date: "2026-02-28",
    content: `<h1 class="cy-doc-title" id="doc-title">My Dream Year</h1>
<div class="cy-case-meta" contenteditable="false">
  This is the year I become <strong>unstoppable</strong>.<br>
  Status: <span class="pulse-text" style="color:#69f0ae;">IN PROGRESS</span>
</div>
<div class="cy-quote-block">"She believed she could, so she did."</div>
<p style="max-width:600px;margin-bottom:20px;line-height:1.8;">
  I'm setting intentions for the most vibrant, joyful, purposeful year of my life.
  Every single day is a chance to grow, to sparkle, and to show up as my best self.
  No dream is too big. No goal is out of reach.
</p>`,
  },
  {
    id: "2",
    name: "Daily Gratitude",
    date: "2026-02-27",
    content: `<h1 class="cy-doc-title" id="doc-title">Daily Gratitude</h1>
<div class="cy-case-meta" contenteditable="false">
  Today I am grateful for <strong>new beginnings</strong>.<br>
  Mood: <span style="color:#e040fb;">Radiant</span>
</div>
<div class="cy-quote-block">"Gratitude turns what we have into enough."</div>
<p style="max-width:600px;margin-bottom:20px;line-height:1.8;">
  Three things I'm grateful for today: the warmth of the morning sun, a kind
  word from a friend, and the courage to keep dreaming bigger than yesterday.
</p>`,
  },
  {
    id: "3",
    name: "Vision Board Notes",
    date: "2026-02-25",
    content: `<h1 class="cy-doc-title" id="doc-title">Vision Board Notes</h1>
<div class="cy-case-meta" contenteditable="false">
  Theme: <strong>Abundance & Joy</strong><br>
  Vibe: <span style="color:#ffd740;">Manifesting</span>
</div>
<div class="cy-quote-block">"The universe is conspiring in your favor."</div>
<p style="max-width:600px;margin-bottom:20px;line-height:1.8;">
  Key images for my vision board: a cozy dream home with big windows,
  a passport full of stamps, a thriving garden, and a heart full of peace.
  These aren't just wishes - they're plans.
</p>`,
  },
];

const INITIAL_GOALS: Goal[] = [
  { id: "g1", name: "Run a Half Marathon", specific: "Complete a half marathon race", measurable: "Finish 13.1 miles under 2 hours", achievable: "Following a 16-week training plan", relevant: "Improves my health and builds discipline", timeBound: "June 2026", category: "Fitness", progress: 65, status: "ON TRACK" },
  { id: "g2", name: "Read 30 Books", specific: "Read 30 books across different genres", measurable: "Track each book completed on my reading list", achievable: "2-3 books per month is doable", relevant: "Expands my knowledge and creativity", timeBound: "Dec 2026", category: "Growth", progress: 40, status: "IN PROGRESS" },
  { id: "g3", name: "Launch My Side Project", specific: "Ship my app to production with paying users", measurable: "Get 50 signups in the first month", achievable: "MVP is 80% built already", relevant: "Steps me toward financial independence", timeBound: "April 2026", category: "Career", progress: 80, status: "ALMOST THERE" },
  { id: "g4", name: "Save $10K Emergency Fund", specific: "Build a $10,000 emergency savings cushion", measurable: "Track balance monthly toward $10K target", achievable: "Saving $800/month from budget adjustments", relevant: "Financial security gives me peace of mind", timeBound: "Sept 2026", category: "Finance", progress: 55, status: "ON TRACK" },
  { id: "g5", name: "Learn to Paint", specific: "Learn watercolor painting fundamentals", measurable: "Complete 12 paintings and 1 online course", achievable: "Practice 2 sessions per week", relevant: "Creative expression brings me joy", timeBound: "Ongoing", category: "Creativity", progress: 25, status: "JUST STARTED" },
  { id: "g6", name: "Meditate Daily for 90 Days", specific: "Meditate for at least 10 minutes every day", measurable: "90 consecutive days tracked in my habit app", achievable: "Starting with guided meditations", relevant: "Mental clarity and stress reduction", timeBound: "May 2026", category: "Wellness", progress: 72, status: "CRUSHING IT" },
];

const GOAL_CATEGORIES = ["Fitness", "Growth", "Career", "Finance", "Creativity", "Wellness", "Relationships", "Health", "Travel", "Other"];

const EMPTY_GOAL_FORM = {
  name: "",
  specific: "",
  measurable: "",
  achievable: "",
  relevant: "",
  timeBound: "",
  category: "Growth",
};

const VISION_FEATURES = [
  { icon: "fa-solid fa-heart", title: "PROMPTS", desc: "Daily affirmations and self-care rituals to nurture your spirit.", status: "ACTIVE",
    affirmations: ["I am worthy of love and belonging.", "I choose to be kind to myself today.", "My imperfections make me beautifully unique.", "I deserve rest, joy, and peace.", "I am enough, exactly as I am right now.", "I release the need to be perfect."],
    prompts: ["What made you smile today?", "Write 3 things you love about yourself.", "What boundary do you need to set this week?", "How did you practice self-care today?"],
  },
  { icon: "fa-solid fa-star", title: "MANIFEST", desc: "Visualization exercises to attract your dream life.", status: "ACTIVE",
    affirmations: ["I am a powerful creator of my reality.", "Abundance flows to me effortlessly.", "I attract incredible opportunities.", "My dreams are valid and achievable.", "The universe supports my vision.", "I am aligned with my highest purpose."],
    prompts: ["Describe your ideal day 5 years from now.", "What would you do if you knew you couldn't fail?", "List 5 things you want to manifest this year.", "Visualize your dream life — what does it look like?"],
  },
  { icon: "fa-solid fa-seedling", title: "GROW", desc: "Track personal growth milestones and celebrate wins.", status: "ACTIVE",
    affirmations: ["Every day I am becoming a better version of myself.", "I embrace challenges as opportunities to grow.", "My potential is limitless.", "I am proud of how far I've come.", "Growth is not linear, and that's okay.", "I celebrate my small victories."],
    prompts: ["What skill are you developing right now?", "What's one thing you learned this week?", "Describe a challenge you overcame recently.", "What growth are you most proud of?"],
  },
  { icon: "fa-solid fa-sun", title: "MORNING RITUAL", desc: "Design your perfect morning routine for energy and clarity.", status: "ACTIVE",
    affirmations: ["Today is full of endless possibilities.", "I wake up grateful and energized.", "This morning I choose joy and purpose.", "I am ready to make today amazing.", "My morning sets the tone for greatness.", "I start each day with intention."],
    prompts: ["What are your top 3 priorities today?", "How do you want to feel by end of day?", "What's one thing you're excited about today?", "Write your morning gratitude list."],
  },
  { icon: "fa-solid fa-moon", title: "NIGHT REFLECT", desc: "Evening journaling prompts for peace and gratitude.", status: "ACTIVE",
    affirmations: ["I release today with love and gratitude.", "I did my best today, and that is enough.", "I am at peace with myself.", "Tomorrow brings new opportunities.", "I let go of what I cannot control.", "I am grateful for this day."],
    prompts: ["What went well today?", "What are 3 things you're grateful for tonight?", "What would you do differently tomorrow?", "What was the highlight of your day?"],
  },
  { icon: "fa-solid fa-wand-magic-sparkles", title: "DREAM BIG", desc: "Big picture goal mapping and life design tools.", status: "ACTIVE",
    affirmations: ["No dream is too big for me.", "I give myself permission to dream wildly.", "My ambitions are a gift to the world.", "I am building a life I love.", "Anything is possible when I believe.", "My future is bright and exciting."],
    prompts: ["What's your biggest, boldest dream?", "If money were no object, what would you do?", "Write a letter to your future self.", "What legacy do you want to leave?"],
  },
  { icon: "fa-solid fa-bolt", title: "ENERGY CHECK", desc: "Tune into your energy and recharge intentionally.", status: "ACTIVE",
    affirmations: ["I honor my energy and protect my peace.", "I am allowed to rest without guilt.", "My energy is sacred and valuable.", "I choose activities that fuel my soul.", "I listen to what my body needs.", "I am recharged and ready."],
    prompts: ["On a scale of 1–10, what's your energy level right now?", "What drained your energy this week?", "What activities make you feel most alive?", "How can you protect your energy tomorrow?"],
  },
  { icon: "fa-solid fa-handshake", title: "RELATIONSHIPS", desc: "Reflect on connections and nurture meaningful bonds.", status: "ACTIVE",
    affirmations: ["I attract loving, supportive people.", "I am worthy of deep, meaningful connections.", "I communicate with honesty and compassion.", "My relationships reflect my values.", "I give and receive love freely.", "I am grateful for the people in my life."],
    prompts: ["Who made a positive impact on you recently?", "What relationship do you want to invest more in?", "How can you show appreciation for someone you love?", "What does your ideal friendship look like?"],
  },
  { icon: "fa-solid fa-brain", title: "MINDSET RESET", desc: "Reframe negative thoughts and build mental resilience.", status: "ACTIVE",
    affirmations: ["I choose thoughts that serve my growth.", "I am in control of my mindset.", "Challenges are opportunities in disguise.", "I release limiting beliefs with ease.", "My mind is powerful and focused.", "I replace doubt with determination."],
    prompts: ["What negative thought keeps coming back? Rewrite it positively.", "What's one belief holding you back right now?", "Describe a time you surprised yourself with your strength.", "What mantra do you need to hear today?"],
  },
  { icon: "fa-solid fa-palette", title: "CREATIVE FLOW", desc: "Unlock your creative spark and explore new ideas.", status: "ACTIVE",
    affirmations: ["Creativity flows through me effortlessly.", "I trust my creative instincts.", "There are no mistakes, only experiments.", "I give myself permission to play and create.", "My creativity is unique and valuable.", "Inspiration is all around me."],
    prompts: ["What creative project excites you right now?", "Describe a color, texture, or image that inspires you today.", "If you could create anything with no limits, what would it be?", "What's one new creative skill you'd love to try?"],
  },
  { icon: "fa-solid fa-compass", title: "LIFE COMPASS", desc: "Align your daily actions with your core values.", status: "ACTIVE",
    affirmations: ["I live in alignment with my values.", "My choices reflect who I truly am.", "I trust my inner compass to guide me.", "Every step I take is purposeful.", "I am building a life of meaning.", "I stay true to myself in every decision."],
    prompts: ["What are your top 3 core values?", "Did your actions today align with what matters most to you?", "Where in your life do you feel most authentic?", "What's one change you can make to live more intentionally?"],
  },
  { icon: "fa-solid fa-trophy", title: "WIN OF THE WEEK", desc: "Celebrate your victories, big and small.", status: "ACTIVE",
    affirmations: ["I celebrate every win, no matter how small.", "I am proud of my progress.", "Success is a journey, not a destination.", "I acknowledge my hard work and dedication.", "Every achievement matters.", "I am building momentum every single day."],
    prompts: ["What's the biggest win you had this week?", "What small victory are you proud of?", "Who helped you succeed this week — have you thanked them?", "What did you learn from this week's challenges?"],
  },
];

const STICKER_CATEGORIES = {
  Vibes: [
    { type: "stamp-yougoal",    label: "YOU GOT THIS" },
    { type: "stamp-approved",   label: "GOALS MET" },
    { type: "stamp-queen",      label: "QUEEN" },
    { type: "stamp-urgent",     label: "PRIORITY" },
    { type: "stamp-void",       label: "LET IT GO" },
    { type: "stamp-slay",       label: "SLAY" },
    { type: "stamp-blessed",    label: "BLESSED" },
    { type: "stamp-manifest",   label: "MANIFEST" },
    { type: "stamp-dreamer",    label: "DREAMER" },
    { type: "stamp-iconic",     label: "ICONIC" },
    { type: "stamp-worthy",     label: "WORTHY" },
    { type: "stamp-main-char",  label: "MAIN CHARACTER" },
    { type: "stamp-goddess",    label: "GODDESS" },
    { type: "stamp-baddie",     label: "BADDIE" },
    { type: "stamp-healer",     label: "HEALER" },
    { type: "stamp-grateful",   label: "GRATEFUL" },
    { type: "stamp-rising",     label: "RISING" },
    { type: "stamp-limitless",  label: "LIMITLESS" },
  ],
  Symbols: [
    { type: "icon-heart",     label: "HEART" },
    { type: "icon-star",      label: "STAR" },
    { type: "icon-sparkle",   label: "SPARKLE" },
    { type: "tape-rainbow",   label: "RAINBOW BAR" },
    { type: "icon-moon",      label: "MOON" },
    { type: "icon-sun",       label: "SUN" },
    { type: "icon-crown",     label: "CROWN" },
    { type: "icon-fire",      label: "FIRE" },
    { type: "icon-gem",       label: "GEM" },
    { type: "icon-bolt",      label: "BOLT" },
    { type: "icon-dove",      label: "DOVE" },
    { type: "icon-infinity",  label: "INFINITY" },
    { type: "icon-eye",       label: "EYE" },
    { type: "icon-feather",   label: "FEATHER" },
    { type: "icon-clover",    label: "CLOVER" },
    { type: "icon-ribbon",    label: "RIBBON" },
    { type: "icon-wand",      label: "WAND" },
    { type: "icon-palette",   label: "PALETTE" },
    { type: "icon-seedling",  label: "SEEDLING" },
    { type: "icon-compass",   label: "COMPASS" },
  ],
  Emoji: [
    { type: "emoji-sparkles",   label: "SPARKLES" },
    { type: "emoji-rainbow",    label: "RAINBOW" },
    { type: "emoji-butterfly",  label: "BUTTERFLY" },
    { type: "emoji-star-eyes",  label: "STAR EYES" },
    { type: "emoji-fire",       label: "FIRE" },
    { type: "emoji-hearts",     label: "HEARTS" },
    { type: "emoji-crystalball",label: "CRYSTAL BALL" },
    { type: "emoji-unicorn",    label: "UNICORN" },
    { type: "emoji-crown",      label: "CROWN" },
    { type: "emoji-cherries",   label: "CHERRIES" },
    { type: "emoji-blossom",    label: "BLOSSOM" },
    { type: "emoji-shooting",   label: "SHOOTING STAR" },
    { type: "emoji-moon",       label: "MOON" },
    { type: "emoji-sun",        label: "SUN" },
    { type: "emoji-comet",      label: "COMET" },
    { type: "emoji-gem",        label: "GEM" },
    { type: "emoji-rose",       label: "ROSE" },
    { type: "emoji-dove",       label: "DOVE" },
    { type: "emoji-star2",      label: "GLOWING STAR" },
    { type: "emoji-fairy",      label: "FAIRY" },
    { type: "emoji-mermaid",    label: "MERMAID" },
    { type: "emoji-cat",        label: "CAT" },
    { type: "emoji-galaxy",     label: "GALAXY" },
    { type: "emoji-lotus",      label: "LOTUS" },
    { type: "emoji-alien",      label: "ALIEN" },
    { type: "emoji-angel",      label: "ANGEL" },
    { type: "emoji-witch",      label: "WITCH" },
    { type: "emoji-dragon",     label: "DRAGON" },
    { type: "emoji-magic-wand", label: "MAGIC WAND" },
  ],
  Art: [
    { type: "svg-butterfly", label: "BUTTERFLY" },
    { type: "svg-rainbow",   label: "RAINBOW" },
    { type: "svg-star",      label: "STAR BURST" },
    { type: "svg-flower",    label: "FLOWER" },
    { type: "svg-diamond",   label: "DIAMOND" },
    { type: "svg-cloud",     label: "CLOUD" },
    { type: "svg-dolphin",   label: "DOLPHIN" },
    { type: "svg-unicorn",   label: "UNICORN" },
    { type: "svg-heart-wings", label: "WINGED HEART" },
    { type: "svg-crescent",    label: "CRESCENT" },
    { type: "svg-lotus",       label: "LOTUS" },
    { type: "svg-cat",         label: "CAT" },
  ],
  Dividers: [
    { type: "div-sparkle",  label: "SPARKLE LINE" },
    { type: "div-hearts",   label: "HEARTS LINE" },
    { type: "div-stars",    label: "STARS LINE" },
    { type: "div-wave",     label: "WAVE LINE" },
    { type: "div-rainbow",  label: "RAINBOW LINE" },
    { type: "div-dots",     label: "DOTS LINE" },
  ],
  Weather: [
    { type: "emoji-cloud",      label: "CLOUD" },
    { type: "emoji-thunder",    label: "THUNDER" },
    { type: "emoji-snowflake",  label: "SNOWFLAKE" },
    { type: "emoji-tornado",    label: "TORNADO" },
    { type: "emoji-umbrella",   label: "UMBRELLA" },
    { type: "emoji-raindrop",   label: "RAINDROP" },
    { type: "emoji-wind",       label: "WIND" },
    { type: "emoji-fog",        label: "FOG" },
    { type: "emoji-thermometer",label: "THERMOMETER" },
    { type: "emoji-sunny",      label: "SUNNY" },
  ],
  Nature: [
    { type: "emoji-tree",       label: "TREE" },
    { type: "emoji-mushroom",   label: "MUSHROOM" },
    { type: "emoji-herb",       label: "HERB" },
    { type: "emoji-leaf",       label: "LEAF" },
    { type: "emoji-tulip",      label: "TULIP" },
    { type: "emoji-sunflower",  label: "SUNFLOWER" },
    { type: "emoji-hibiscus",   label: "HIBISCUS" },
    { type: "emoji-cactus",     label: "CACTUS" },
    { type: "emoji-shell",      label: "SHELL" },
    { type: "emoji-ocean",      label: "OCEAN" },
    { type: "emoji-mountain",   label: "MOUNTAIN" },
    { type: "emoji-volcano",    label: "VOLCANO" },
  ],
  Food: [
    { type: "emoji-strawberry", label: "STRAWBERRY" },
    { type: "emoji-peach",      label: "PEACH" },
    { type: "emoji-grapes",     label: "GRAPES" },
    { type: "emoji-watermelon", label: "WATERMELON" },
    { type: "emoji-lemon",      label: "LEMON" },
    { type: "emoji-avocado",    label: "AVOCADO" },
    { type: "emoji-cupcake",    label: "CUPCAKE" },
    { type: "emoji-donut",      label: "DONUT" },
    { type: "emoji-cookie",     label: "COOKIE" },
    { type: "emoji-icecream",   label: "ICE CREAM" },
    { type: "emoji-coffee",     label: "COFFEE" },
    { type: "emoji-boba",       label: "BOBA" },
  ],
  Zodiac: [
    { type: "emoji-aries",      label: "ARIES" },
    { type: "emoji-taurus",     label: "TAURUS" },
    { type: "emoji-gemini",     label: "GEMINI" },
    { type: "emoji-cancer",     label: "CANCER" },
    { type: "emoji-leo",        label: "LEO" },
    { type: "emoji-virgo",      label: "VIRGO" },
    { type: "emoji-libra",      label: "LIBRA" },
    { type: "emoji-scorpio",    label: "SCORPIO" },
    { type: "emoji-sagittarius",label: "SAGITTARIUS" },
    { type: "emoji-capricorn",  label: "CAPRICORN" },
    { type: "emoji-aquarius",   label: "AQUARIUS" },
    { type: "emoji-pisces",     label: "PISCES" },
  ],
  Shapes: [
    { type: "icon-circle",      label: "CIRCLE" },
    { type: "icon-square",      label: "SQUARE" },
    { type: "icon-triangle",    label: "TRIANGLE" },
    { type: "icon-hexagon",     label: "HEXAGON" },
    { type: "icon-diamond2",    label: "DIAMOND" },
    { type: "icon-yin-yang",    label: "YIN YANG" },
    { type: "icon-atom",        label: "ATOM" },
    { type: "icon-peace",       label: "PEACE" },
    { type: "icon-om",          label: "OM" },
    { type: "icon-cross-celtic",label: "CELTIC" },
  ],
  Badges: [
    { type: "stamp-done",       label: "DONE" },
    { type: "stamp-wip",        label: "IN PROGRESS" },
    { type: "stamp-love-it",    label: "LOVE IT" },
    { type: "stamp-no-cap",     label: "NO CAP" },
    { type: "stamp-vibing",     label: "VIBING" },
    { type: "stamp-growth",     label: "GROWTH" },
    { type: "stamp-self-care",  label: "SELF CARE" },
    { type: "stamp-focus",      label: "FOCUS" },
    { type: "stamp-breathe",    label: "BREATHE" },
    { type: "stamp-trust",      label: "TRUST" },
  ],
  Animals: [
    { type: "emoji-dog",        label: "DOG" },
    { type: "emoji-bunny",      label: "BUNNY" },
    { type: "emoji-bear",       label: "BEAR" },
    { type: "emoji-panda",      label: "PANDA" },
    { type: "emoji-fox",        label: "FOX" },
    { type: "emoji-owl",        label: "OWL" },
    { type: "emoji-koala",      label: "KOALA" },
    { type: "emoji-penguin",    label: "PENGUIN" },
    { type: "emoji-frog",       label: "FROG" },
    { type: "emoji-ladybug",    label: "LADYBUG" },
    { type: "emoji-octopus",    label: "OCTOPUS" },
    { type: "emoji-whale",      label: "WHALE" },
    { type: "emoji-flamingo",   label: "FLAMINGO" },
    { type: "emoji-bee",        label: "BEE" },
    { type: "emoji-snail",      label: "SNAIL" },
    { type: "emoji-hedgehog",   label: "HEDGEHOG" },
    { type: "emoji-deer",       label: "DEER" },
    { type: "emoji-duck",       label: "DUCK" },
    { type: "emoji-parrot",     label: "PARROT" },
    { type: "emoji-jellyfish",  label: "JELLYFISH" },
    { type: "emoji-turtle",     label: "TURTLE" },
  ],
  Travel: [
    { type: "emoji-airplane",   label: "AIRPLANE" },
    { type: "emoji-rocket",     label: "ROCKET" },
    { type: "emoji-globe",      label: "GLOBE" },
    { type: "emoji-compass2",   label: "COMPASS" },
    { type: "emoji-tent",       label: "TENT" },
    { type: "emoji-castle",     label: "CASTLE" },
    { type: "emoji-ferris",     label: "FERRIS WHEEL" },
    { type: "emoji-sunrise",    label: "SUNRISE" },
    { type: "emoji-train",      label: "TRAIN" },
    { type: "emoji-sailboat",   label: "SAILBOAT" },
    { type: "emoji-palm",       label: "PALM TREE" },
    { type: "emoji-beach",      label: "BEACH" },
  ],
  Celebration: [
    { type: "emoji-party",      label: "PARTY" },
    { type: "emoji-confetti",   label: "CONFETTI" },
    { type: "emoji-balloon",    label: "BALLOON" },
    { type: "emoji-cake",       label: "CAKE" },
    { type: "emoji-gift",       label: "GIFT" },
    { type: "emoji-trophy",     label: "TROPHY" },
    { type: "emoji-medal",      label: "MEDAL" },
    { type: "emoji-clap",       label: "CLAPPING" },
    { type: "emoji-tada",       label: "TADA" },
    { type: "emoji-fireworks",  label: "FIREWORKS" },
    { type: "emoji-disco",      label: "DISCO" },
    { type: "emoji-champagne",  label: "CHAMPAGNE" },
    { type: "emoji-sparkler",   label: "SPARKLER" },
    { type: "emoji-pinata",     label: "PIÑATA" },
    { type: "emoji-ribbon2",    label: "RIBBON" },
  ],
  Seasonal: [
    { type: "emoji-snowman",    label: "SNOWMAN" },
    { type: "emoji-jack",       label: "JACK-O-LANTERN" },
    { type: "emoji-ghost",      label: "GHOST" },
    { type: "emoji-xmas-tree",  label: "XMAS TREE" },
    { type: "emoji-santa",      label: "SANTA" },
    { type: "emoji-candy-cane", label: "CANDY CANE" },
    { type: "emoji-egg",        label: "EASTER EGG" },
    { type: "emoji-four-leaf",  label: "FOUR LEAF" },
    { type: "emoji-pumpkin",    label: "PUMPKIN" },
    { type: "emoji-bat",        label: "BAT" },
  ],
  Hearts: [
    { type: "emoji-heart-red",     label: "RED HEART" },
    { type: "emoji-heart-orange",  label: "ORANGE" },
    { type: "emoji-heart-yellow",  label: "YELLOW" },
    { type: "emoji-heart-green",   label: "GREEN" },
    { type: "emoji-heart-blue",    label: "BLUE" },
    { type: "emoji-heart-purple",  label: "PURPLE" },
    { type: "emoji-heart-pink",    label: "PINK" },
    { type: "emoji-heart-black",   label: "BLACK" },
    { type: "emoji-heart-white",   label: "WHITE" },
    { type: "emoji-heart-spark",   label: "SPARKLING" },
    { type: "emoji-heart-ribbon",  label: "RIBBON" },
    { type: "emoji-heart-arrow",   label: "ARROW" },
    { type: "emoji-heart-grow",    label: "GROWING" },
    { type: "emoji-heart-revolve", label: "REVOLVING" },
  ],
  Music: [
    { type: "emoji-music-note",   label: "NOTE" },
    { type: "emoji-music-notes",  label: "NOTES" },
    { type: "emoji-headphones",   label: "HEADPHONES" },
    { type: "emoji-microphone",   label: "MICROPHONE" },
    { type: "emoji-guitar",       label: "GUITAR" },
    { type: "emoji-piano",        label: "PIANO" },
    { type: "emoji-drum",         label: "DRUM" },
    { type: "emoji-violin",       label: "VIOLIN" },
    { type: "emoji-saxophone",    label: "SAXOPHONE" },
    { type: "emoji-trumpet",      label: "TRUMPET" },
  ],
  Frames: [
    { type: "frame-hearts",     label: "HEARTS FRAME" },
    { type: "frame-stars",      label: "STARS FRAME" },
    { type: "frame-rainbow",    label: "RAINBOW FRAME" },
    { type: "frame-floral",     label: "FLORAL FRAME" },
    { type: "frame-sparkle",    label: "SPARKLE FRAME" },
    { type: "frame-neon",       label: "NEON FRAME" },
    { type: "frame-cloud",      label: "CLOUD FRAME" },
    { type: "frame-gradient",   label: "GRADIENT FRAME" },
  ],
  Washi: [
    { type: "washi-pink",       label: "PINK TAPE" },
    { type: "washi-purple",     label: "PURPLE TAPE" },
    { type: "washi-mint",       label: "MINT TAPE" },
    { type: "washi-gold",       label: "GOLD TAPE" },
    { type: "washi-rainbow",    label: "RAINBOW TAPE" },
    { type: "washi-hearts",     label: "HEARTS TAPE" },
    { type: "washi-stars",      label: "STARS TAPE" },
    { type: "washi-dots",       label: "DOTS TAPE" },
    { type: "washi-stripes",    label: "STRIPES TAPE" },
    { type: "washi-floral",     label: "FLORAL TAPE" },
  ],
};

const NOTE_STYLES: { type: string; label: string; cls: string }[] = [
  { type: "note-pink",    label: "Primary",   cls: "sn-primary" },
  { type: "note-lilac",   label: "Secondary", cls: "sn-secondary" },
  { type: "note-mint",    label: "Accent",    cls: "sn-accent" },
  { type: "note-peach",   label: "Warm",      cls: "sn-warm" },
  { type: "note-gold",    label: "Soft",      cls: "sn-soft" },
  { type: "note-sky",     label: "Bright",    cls: "sn-bright" },
  { type: "note-rose",    label: "Deep",      cls: "sn-deep" },
  { type: "note-neon",    label: "Pop",       cls: "sn-pop" },
  { type: "note-coral",   label: "Vivid",     cls: "sn-vivid" },
  { type: "note-sage",    label: "Muted",     cls: "sn-muted" },
  { type: "note-lavender",label: "Dreamy",    cls: "sn-dreamy" },
  { type: "note-sunset",  label: "Glow",      cls: "sn-glow" },
];

const AFFIRMATION_CMDS: Record<string, { response: string; cls?: string }> = {
  help:      { response: "Try: affirm, breathe, gratitude, goals, sparkle, love, clear" },
  affirm:    { response: "I am worthy, I am capable, I am becoming everything I dream of.", cls: "cy-log-success" },
  breathe:   { response: "Inhale confidence... exhale doubt... You are exactly where you need to be.", cls: "cy-log-info" },
  gratitude: { response: "What are 3 things you're grateful for right now? Write them down.", cls: "cy-log-warn" },
  goals:     { response: "You have 6 active goals and you're crushing it! Keep going.", cls: "cy-log-success" },
  sparkle:   { response: "You literally sparkle. Never dim your light for anyone.", cls: "cy-log-info" },
  love:      { response: "Sending you all the love and positive energy. You deserve the world.", cls: "cy-log-success" },
  clear:     { response: "__CLEAR__" },
};

function getStickerContent(type: string): string {
  switch (type) {
    case "stamp-yougoal":
      return `<div class="stamp-secret">YOU GOT THIS</div>`;
    case "stamp-approved":
      return `<div class="stamp-approved">GOALS MET</div>`;
    case "stamp-queen":
      return `<div class="stamp-classified">QUEEN</div>`;
    case "stamp-urgent":
      return `<div class="stamp-urgent">PRIORITY</div>`;
    case "stamp-void":
      return `<div class="stamp-void">LET GO</div>`;
    case "tape-rainbow":
      return `<div class="tape-warning">DREAM BIG ~ SHINE BRIGHT ~ STAY MAGIC</div>`;
    case "icon-heart":
      return `<i class="fa-solid fa-heart" style="font-size:3.2rem; color:#ff4081; text-shadow: 0 0 14px rgba(255,64,129,0.5);"></i>`;
    case "icon-star":
      return `<i class="fa-solid fa-star" style="font-size:3.2rem; color:#ffd740; text-shadow: 0 0 14px rgba(255,215,64,0.5);"></i>`;
    case "icon-sparkle":
      return `<i class="fa-solid fa-wand-magic-sparkles" style="font-size:3rem; color:#e040fb; text-shadow: 0 0 14px rgba(224,64,251,0.5);"></i>`;
    case "icon-moon":
      return `<i class="fa-solid fa-moon" style="font-size:3rem; color:#b388ff; text-shadow: 0 0 14px rgba(179,136,255,0.5);"></i>`;
    case "note-pink":
      return `<div class="sticky-note sn-primary"><div class="cy-note-drag-handle"><i class="fa-solid fa-grip"></i></div><div contenteditable="true" class="cy-note-body">My thoughts...</div></div>`;
    case "note-lilac":
      return `<div class="sticky-note sn-secondary"><div class="cy-note-drag-handle"><i class="fa-solid fa-grip"></i></div><div contenteditable="true" class="cy-note-body">My thoughts...</div></div>`;
    case "note-mint":
      return `<div class="sticky-note sn-accent"><div class="cy-note-drag-handle"><i class="fa-solid fa-grip"></i></div><div contenteditable="true" class="cy-note-body">My thoughts...</div></div>`;
    case "note-peach":
      return `<div class="sticky-note sn-warm"><div class="cy-note-drag-handle"><i class="fa-solid fa-grip"></i></div><div contenteditable="true" class="cy-note-body">My thoughts...</div></div>`;
    case "svg-butterfly":
      return `<svg width="80" height="60" viewBox="0 0 80 60"><ellipse cx="28" cy="22" rx="20" ry="16" fill="rgba(224,64,251,0.3)" stroke="#e040fb" stroke-width="2"/><ellipse cx="52" cy="22" rx="20" ry="16" fill="rgba(124,77,255,0.3)" stroke="#7c4dff" stroke-width="2"/><ellipse cx="30" cy="42" rx="16" ry="12" fill="rgba(255,64,129,0.25)" stroke="#ff4081" stroke-width="1.5"/><ellipse cx="50" cy="42" rx="16" ry="12" fill="rgba(0,229,255,0.25)" stroke="#00e5ff" stroke-width="1.5"/><line x1="40" y1="8" x2="40" y2="56" stroke="#e040fb" stroke-width="2.5"/><circle cx="36" cy="6" r="2" fill="#ffd740"/><circle cx="44" cy="6" r="2" fill="#ffd740"/></svg>`;
    case "svg-rainbow":
      return `<svg width="90" height="50" viewBox="0 0 90 50"><path d="M5 48 A40 40 0 0 1 85 48" fill="none" stroke="#ff4081" stroke-width="4"/><path d="M10 48 A35 35 0 0 1 80 48" fill="none" stroke="#ff6d00" stroke-width="4"/><path d="M15 48 A30 30 0 0 1 75 48" fill="none" stroke="#ffd740" stroke-width="4"/><path d="M20 48 A25 25 0 0 1 70 48" fill="none" stroke="#69f0ae" stroke-width="4"/><path d="M25 48 A20 20 0 0 1 65 48" fill="none" stroke="#00e5ff" stroke-width="4"/><path d="M30 48 A15 15 0 0 1 60 48" fill="none" stroke="#7c4dff" stroke-width="4"/><path d="M35 48 A10 10 0 0 1 55 48" fill="none" stroke="#e040fb" stroke-width="4"/></svg>`;
    case "svg-star":
      return `<svg width="70" height="70" viewBox="0 0 70 70"><polygon points="35,2 43,26 68,26 48,42 55,66 35,52 15,66 22,42 2,26 27,26" fill="rgba(255,215,64,0.15)" stroke="#ffd740" stroke-width="2"/><polygon points="35,14 40,28 54,28 43,36 47,50 35,43 23,50 27,36 16,28 30,28" fill="rgba(255,215,64,0.2)" stroke="#ffab40" stroke-width="1"/></svg>`;
    case "svg-flower":
      return `<svg width="70" height="70" viewBox="0 0 70 70"><circle cx="35" cy="18" r="12" fill="rgba(224,64,251,0.3)" stroke="#e040fb" stroke-width="1.5"/><circle cx="50" cy="30" r="12" fill="rgba(255,64,129,0.25)" stroke="#ff4081" stroke-width="1.5"/><circle cx="45" cy="48" r="12" fill="rgba(0,229,255,0.25)" stroke="#00e5ff" stroke-width="1.5"/><circle cx="25" cy="48" r="12" fill="rgba(105,240,174,0.25)" stroke="#69f0ae" stroke-width="1.5"/><circle cx="20" cy="30" r="12" fill="rgba(255,215,64,0.25)" stroke="#ffd740" stroke-width="1.5"/><circle cx="35" cy="35" r="8" fill="rgba(179,136,255,0.4)" stroke="#b388ff" stroke-width="2"/></svg>`;
    case "svg-diamond":
      return `<svg width="60" height="70" viewBox="0 0 60 70"><polygon points="30,5 55,25 45,65 15,65 5,25" fill="rgba(0,229,255,0.12)" stroke="#00e5ff" stroke-width="2"/><polygon points="30,5 45,25 30,65 15,25" fill="rgba(124,77,255,0.1)" stroke="#7c4dff" stroke-width="1"/><line x1="5" y1="25" x2="55" y2="25" stroke="#e040fb" stroke-width="1.5"/><line x1="30" y1="5" x2="30" y2="65" stroke="rgba(255,215,64,0.3)" stroke-width="1"/></svg>`;
    case "svg-cloud":
      return `<svg width="90" height="55" viewBox="0 0 90 55"><ellipse cx="45" cy="35" rx="30" ry="18" fill="rgba(179,136,255,0.2)" stroke="#b388ff" stroke-width="2"/><ellipse cx="28" cy="30" rx="20" ry="16" fill="rgba(224,64,251,0.15)" stroke="#e040fb" stroke-width="1.5"/><ellipse cx="62" cy="30" rx="20" ry="16" fill="rgba(0,229,255,0.15)" stroke="#00e5ff" stroke-width="1.5"/><ellipse cx="45" cy="22" rx="16" ry="14" fill="rgba(255,64,129,0.1)" stroke="#ff4081" stroke-width="1.5"/></svg>`;
    case "svg-dolphin":
      return `<svg width="80" height="60" viewBox="0 0 80 60"><path d="M15 35 Q25 15 45 20 Q60 22 70 35 Q65 40 55 38 Q45 42 35 40 Q25 42 15 35Z" fill="rgba(0,229,255,0.2)" stroke="#00e5ff" stroke-width="2"/><circle cx="35" cy="28" r="2" fill="#00e5ff"/><path d="M65 32 Q72 25 75 30" fill="none" stroke="#00e5ff" stroke-width="1.5"/><path d="M18 33 Q10 25 8 30 Q6 35 15 35" fill="rgba(124,77,255,0.2)" stroke="#7c4dff" stroke-width="1.5"/></svg>`;
    case "svg-unicorn":
      return `<svg width="70" height="80" viewBox="0 0 70 80"><ellipse cx="35" cy="50" rx="22" ry="25" fill="rgba(224,64,251,0.15)" stroke="#e040fb" stroke-width="2"/><ellipse cx="35" cy="35" rx="14" ry="16" fill="rgba(255,64,129,0.12)" stroke="#ff4081" stroke-width="1.5"/><polygon points="35,2 31,22 39,22" fill="rgba(255,215,64,0.3)" stroke="#ffd740" stroke-width="1.5"/><circle cx="30" cy="33" r="2" fill="#7c4dff"/><path d="M22 40 Q15 50 10 45" fill="none" stroke="#e040fb" stroke-width="2"/><path d="M48 40 Q55 50 60 45" fill="none" stroke="#00e5ff" stroke-width="2"/><path d="M20 55 Q10 70 18 72 Q25 68 22 58" fill="rgba(105,240,174,0.15)" stroke="#69f0ae" stroke-width="1.5"/><path d="M50 55 Q60 70 52 72 Q45 68 48 58" fill="rgba(179,136,255,0.15)" stroke="#b388ff" stroke-width="1.5"/></svg>`;
    case "stamp-slay":
      return `<div class="stamp-secret" style="border-color:#e040fb;color:#e040fb;">SLAY</div>`;
    case "stamp-blessed":
      return `<div class="stamp-approved" style="border-color:#ffd740;color:#ffd740;">BLESSED</div>`;
    case "stamp-manifest":
      return `<div class="stamp-urgent" style="border-color:#b388ff;color:#b388ff;background:rgba(179,136,255,0.08);">MANIFEST</div>`;
    case "icon-sun":
      return `<i class="fa-solid fa-sun" style="font-size:3rem; color:#ffab40; text-shadow: 0 0 14px rgba(255,171,64,0.5);"></i>`;
    case "icon-crown":
      return `<i class="fa-solid fa-crown" style="font-size:3rem; color:#ffd740; text-shadow: 0 0 14px rgba(255,215,64,0.5);"></i>`;
    case "icon-fire":
      return `<i class="fa-solid fa-fire" style="font-size:3rem; color:#ff6d00; text-shadow: 0 0 14px rgba(255,109,0,0.5);"></i>`;
    case "icon-gem":
      return `<i class="fa-solid fa-gem" style="font-size:3rem; color:#00e5ff; text-shadow: 0 0 14px rgba(0,229,255,0.5);"></i>`;
    case "icon-bolt":
      return `<i class="fa-solid fa-bolt" style="font-size:3rem; color:#ffd740; text-shadow: 0 0 14px rgba(255,215,64,0.5);"></i>`;
    case "note-gold":
      return `<div class="sticky-note sn-soft"><div class="cy-note-drag-handle"><i class="fa-solid fa-grip"></i></div><div contenteditable="true" class="cy-note-body">My thoughts...</div></div>`;
    case "note-sky":
      return `<div class="sticky-note sn-bright"><div class="cy-note-drag-handle"><i class="fa-solid fa-grip"></i></div><div contenteditable="true" class="cy-note-body">My thoughts...</div></div>`;
    case "note-rose":
      return `<div class="sticky-note sn-deep"><div class="cy-note-drag-handle"><i class="fa-solid fa-grip"></i></div><div contenteditable="true" class="cy-note-body">My thoughts...</div></div>`;
    case "note-neon":
      return `<div class="sticky-note sn-pop"><div class="cy-note-drag-handle"><i class="fa-solid fa-grip"></i></div><div contenteditable="true" class="cy-note-body">My thoughts...</div></div>`;
    case "stamp-dreamer":
      return `<div class="stamp-secret" style="border-color:#00e5ff;color:#00e5ff;">DREAMER</div>`;
    case "stamp-iconic":
      return `<div class="stamp-approved" style="border-color:#ff4081;color:#ff4081;">ICONIC</div>`;
    case "stamp-worthy":
      return `<div class="stamp-classified" style="border-color:#69f0ae;color:#69f0ae;">WORTHY</div>`;
    case "stamp-main-char":
      return `<div class="stamp-urgent" style="border-color:#ffab40;color:#ffab40;background:rgba(255,171,64,0.08);">MAIN CHARACTER</div>`;
    case "icon-dove":
      return `<i class="fa-solid fa-dove" style="font-size:3rem; color:#b388ff; text-shadow: 0 0 14px rgba(179,136,255,0.5);"></i>`;
    case "icon-infinity":
      return `<i class="fa-solid fa-infinity" style="font-size:3rem; color:#e040fb; text-shadow: 0 0 14px rgba(224,64,251,0.5);"></i>`;
    case "icon-eye":
      return `<i class="fa-solid fa-eye" style="font-size:3rem; color:#64ffda; text-shadow: 0 0 14px rgba(100,255,218,0.5);"></i>`;
    case "icon-feather":
      return `<i class="fa-solid fa-feather" style="font-size:3rem; color:#ff4081; text-shadow: 0 0 14px rgba(255,64,129,0.5);"></i>`;
    case "icon-clover":
      return `<i class="fa-solid fa-clover" style="font-size:3rem; color:#69f0ae; text-shadow: 0 0 14px rgba(105,240,174,0.5);"></i>`;
    case "icon-ribbon":
      return `<i class="fa-solid fa-ribbon" style="font-size:3rem; color:#f48fb1; text-shadow: 0 0 14px rgba(244,143,177,0.5);"></i>`;
    case "emoji-sparkles":
      return `<span style="font-size:3.5rem;">✨</span>`;
    case "emoji-rainbow":
      return `<span style="font-size:3.5rem;">🌈</span>`;
    case "emoji-butterfly":
      return `<span style="font-size:3.5rem;">🦋</span>`;
    case "emoji-star-eyes":
      return `<span style="font-size:3.5rem;">🤩</span>`;
    case "emoji-fire":
      return `<span style="font-size:3.5rem;">🔥</span>`;
    case "emoji-hearts":
      return `<span style="font-size:3.5rem;">💖</span>`;
    case "emoji-crystalball":
      return `<span style="font-size:3.5rem;">🔮</span>`;
    case "emoji-unicorn":
      return `<span style="font-size:3.5rem;">🦄</span>`;
    case "emoji-crown":
      return `<span style="font-size:3.5rem;">👑</span>`;
    case "emoji-cherries":
      return `<span style="font-size:3.5rem;">🍒</span>`;
    case "emoji-blossom":
      return `<span style="font-size:3.5rem;">🌸</span>`;
    case "emoji-shooting":
      return `<span style="font-size:3.5rem;">🌠</span>`;
    case "emoji-moon":
      return `<span style="font-size:3.5rem;">🌙</span>`;
    case "emoji-sun":
      return `<span style="font-size:3.5rem;">☀️</span>`;
    case "emoji-comet":
      return `<span style="font-size:3.5rem;">☄️</span>`;
    case "emoji-gem":
      return `<span style="font-size:3.5rem;">💎</span>`;
    case "emoji-rose":
      return `<span style="font-size:3.5rem;">🌹</span>`;
    case "emoji-dove":
      return `<span style="font-size:3.5rem;">🕊️</span>`;
    case "emoji-star2":
      return `<span style="font-size:3.5rem;">🌟</span>`;
    case "emoji-fairy":
      return `<span style="font-size:3.5rem;">🧚</span>`;
    case "emoji-mermaid":
      return `<span style="font-size:3.5rem;">🧜‍♀️</span>`;
    case "emoji-cat":
      return `<span style="font-size:3.5rem;">🐱</span>`;
    case "emoji-galaxy":
      return `<span style="font-size:3.5rem;">🌌</span>`;
    case "emoji-lotus":
      return `<span style="font-size:3.5rem;">🪷</span>`;
    case "stamp-goddess":
      return `<div class="stamp-secret" style="border-color:#e040fb;color:#e040fb;">GODDESS</div>`;
    case "stamp-baddie":
      return `<div class="stamp-approved" style="border-color:#ff4081;color:#ff4081;">BADDIE</div>`;
    case "stamp-healer":
      return `<div class="stamp-classified" style="border-color:#64ffda;color:#64ffda;">HEALER</div>`;
    case "stamp-grateful":
      return `<div class="stamp-secret" style="border-color:#ffd740;color:#ffd740;">GRATEFUL</div>`;
    case "stamp-rising":
      return `<div class="stamp-urgent" style="border-color:#69f0ae;color:#69f0ae;background:rgba(105,240,174,0.08);">RISING</div>`;
    case "stamp-limitless":
      return `<div class="stamp-approved" style="border-color:#00e5ff;color:#00e5ff;">LIMITLESS</div>`;
    case "icon-wand":
      return `<i class="fa-solid fa-wand-sparkles" style="font-size:3rem; color:#ffd740; text-shadow: 0 0 14px rgba(255,215,64,0.5);"></i>`;
    case "icon-palette":
      return `<i class="fa-solid fa-palette" style="font-size:3rem; color:#e040fb; text-shadow: 0 0 14px rgba(224,64,251,0.5);"></i>`;
    case "icon-seedling":
      return `<i class="fa-solid fa-seedling" style="font-size:3rem; color:#69f0ae; text-shadow: 0 0 14px rgba(105,240,174,0.5);"></i>`;
    case "icon-compass":
      return `<i class="fa-solid fa-compass" style="font-size:3rem; color:#81d4fa; text-shadow: 0 0 14px rgba(129,212,250,0.5);"></i>`;
    case "note-coral":
      return `<div class="sticky-note sn-vivid"><div class="cy-note-drag-handle"><i class="fa-solid fa-grip"></i></div><div contenteditable="true" class="cy-note-body">My thoughts...</div></div>`;
    case "note-sage":
      return `<div class="sticky-note sn-muted"><div class="cy-note-drag-handle"><i class="fa-solid fa-grip"></i></div><div contenteditable="true" class="cy-note-body">My thoughts...</div></div>`;
    case "note-lavender":
      return `<div class="sticky-note sn-dreamy"><div class="cy-note-drag-handle"><i class="fa-solid fa-grip"></i></div><div contenteditable="true" class="cy-note-body">My thoughts...</div></div>`;
    case "note-sunset":
      return `<div class="sticky-note sn-glow"><div class="cy-note-drag-handle"><i class="fa-solid fa-grip"></i></div><div contenteditable="true" class="cy-note-body">My thoughts...</div></div>`;
    case "div-sparkle":
      return `<div style="text-align:center;padding:8px 0;letter-spacing:8px;font-size:14px;opacity:0.7;">✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨</div>`;
    case "div-hearts":
      return `<div style="text-align:center;padding:8px 0;letter-spacing:6px;font-size:12px;opacity:0.7;">💖 💜 💙 💚 💛 🧡 💖 💜</div>`;
    case "div-stars":
      return `<div style="text-align:center;padding:8px 0;letter-spacing:6px;font-size:12px;opacity:0.7;">⭐ 🌟 ⭐ 🌟 ⭐ 🌟 ⭐ 🌟</div>`;
    case "div-wave":
      return `<div style="text-align:center;padding:8px 0;font-size:11px;color:var(--cy-primary);opacity:0.5;">〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️</div>`;
    case "div-rainbow":
      return `<div style="height:4px;border-radius:2px;background:linear-gradient(90deg,#ff4081,#ff6d00,#ffd740,#69f0ae,#00e5ff,#7c4dff,#e040fb);margin:12px 0;"></div>`;
    case "div-dots":
      return `<div style="text-align:center;padding:8px 0;letter-spacing:10px;font-size:8px;color:var(--cy-primary);opacity:0.4;">● ● ● ● ● ● ● ● ● ●</div>`;
    case "svg-heart-wings":
      return `<svg width="90" height="60" viewBox="0 0 90 60"><path d="M45 50 Q30 35 20 25 Q10 15 20 8 Q30 0 45 15 Q60 0 70 8 Q80 15 70 25 Q60 35 45 50Z" fill="rgba(255,64,129,0.2)" stroke="#ff4081" stroke-width="2"/><path d="M18 22 Q5 15 2 25 Q-1 35 15 30" fill="rgba(179,136,255,0.15)" stroke="#b388ff" stroke-width="1.5"/><path d="M12 18 Q2 10 0 20 Q-2 28 12 25" fill="rgba(224,64,251,0.1)" stroke="#e040fb" stroke-width="1"/><path d="M72 22 Q85 15 88 25 Q91 35 75 30" fill="rgba(179,136,255,0.15)" stroke="#b388ff" stroke-width="1.5"/><path d="M78 18 Q88 10 90 20 Q92 28 78 25" fill="rgba(224,64,251,0.1)" stroke="#e040fb" stroke-width="1"/></svg>`;
    case "svg-crescent":
      return `<svg width="60" height="70" viewBox="0 0 60 70"><path d="M40 5 A28 28 0 1 0 40 65 A22 22 0 1 1 40 5Z" fill="rgba(179,136,255,0.15)" stroke="#b388ff" stroke-width="2"/><circle cx="20" cy="18" r="1.5" fill="#ffd740"/><circle cx="12" cy="38" r="1" fill="#ffd740"/><circle cx="25" cy="52" r="1.2" fill="#ffd740"/><circle cx="38" cy="15" r="0.8" fill="#e040fb"/></svg>`;
    case "svg-lotus":
      return `<svg width="80" height="60" viewBox="0 0 80 60"><path d="M40 55 Q30 40 20 30 Q10 20 20 12 Q30 5 40 15" fill="rgba(244,143,177,0.2)" stroke="#f48fb1" stroke-width="1.5"/><path d="M40 55 Q50 40 60 30 Q70 20 60 12 Q50 5 40 15" fill="rgba(206,147,216,0.2)" stroke="#ce93d8" stroke-width="1.5"/><path d="M40 55 Q25 38 15 35 Q5 32 12 22 Q20 12 40 20" fill="rgba(255,64,129,0.12)" stroke="#ff4081" stroke-width="1"/><path d="M40 55 Q55 38 65 35 Q75 32 68 22 Q60 12 40 20" fill="rgba(124,77,255,0.12)" stroke="#7c4dff" stroke-width="1"/><ellipse cx="40" cy="30" rx="6" ry="4" fill="rgba(255,215,64,0.3)" stroke="#ffd740" stroke-width="1"/></svg>`;
    case "svg-cat":
      return `<svg width="60" height="70" viewBox="0 0 60 70"><ellipse cx="30" cy="45" rx="20" ry="22" fill="rgba(224,64,251,0.12)" stroke="#e040fb" stroke-width="2"/><ellipse cx="30" cy="32" rx="16" ry="14" fill="rgba(179,136,255,0.15)" stroke="#b388ff" stroke-width="1.5"/><polygon points="16,26 10,8 22,20" fill="rgba(255,64,129,0.15)" stroke="#ff4081" stroke-width="1.5"/><polygon points="44,26 50,8 38,20" fill="rgba(255,64,129,0.15)" stroke="#ff4081" stroke-width="1.5"/><circle cx="24" cy="30" r="2.5" fill="#00e5ff"/><circle cx="36" cy="30" r="2.5" fill="#00e5ff"/><ellipse cx="30" cy="36" rx="2" ry="1.5" fill="#ff4081"/><path d="M25 38 Q30 42 35 38" fill="none" stroke="#ff4081" stroke-width="1"/><path d="M8 58 Q20 65 30 68 Q40 65 52 58" fill="none" stroke="#e040fb" stroke-width="1.5" stroke-dasharray="3 3"/></svg>`;
    case "emoji-cloud": return `<span style="font-size:3.5rem;">☁️</span>`;
    case "emoji-thunder": return `<span style="font-size:3.5rem;">⛈️</span>`;
    case "emoji-snowflake": return `<span style="font-size:3.5rem;">❄️</span>`;
    case "emoji-tornado": return `<span style="font-size:3.5rem;">🌪️</span>`;
    case "emoji-umbrella": return `<span style="font-size:3.5rem;">☂️</span>`;
    case "emoji-raindrop": return `<span style="font-size:3.5rem;">💧</span>`;
    case "emoji-wind": return `<span style="font-size:3.5rem;">💨</span>`;
    case "emoji-fog": return `<span style="font-size:3.5rem;">🌫️</span>`;
    case "emoji-thermometer": return `<span style="font-size:3.5rem;">🌡️</span>`;
    case "emoji-sunny": return `<span style="font-size:3.5rem;">🌞</span>`;
    case "emoji-tree": return `<span style="font-size:3.5rem;">🌳</span>`;
    case "emoji-mushroom": return `<span style="font-size:3.5rem;">🍄</span>`;
    case "emoji-herb": return `<span style="font-size:3.5rem;">🌿</span>`;
    case "emoji-leaf": return `<span style="font-size:3.5rem;">🍃</span>`;
    case "emoji-tulip": return `<span style="font-size:3.5rem;">🌷</span>`;
    case "emoji-sunflower": return `<span style="font-size:3.5rem;">🌻</span>`;
    case "emoji-hibiscus": return `<span style="font-size:3.5rem;">🌺</span>`;
    case "emoji-cactus": return `<span style="font-size:3.5rem;">🌵</span>`;
    case "emoji-shell": return `<span style="font-size:3.5rem;">🐚</span>`;
    case "emoji-ocean": return `<span style="font-size:3.5rem;">🌊</span>`;
    case "emoji-mountain": return `<span style="font-size:3.5rem;">🏔️</span>`;
    case "emoji-volcano": return `<span style="font-size:3.5rem;">🌋</span>`;
    case "emoji-strawberry": return `<span style="font-size:3.5rem;">🍓</span>`;
    case "emoji-peach": return `<span style="font-size:3.5rem;">🍑</span>`;
    case "emoji-grapes": return `<span style="font-size:3.5rem;">🍇</span>`;
    case "emoji-watermelon": return `<span style="font-size:3.5rem;">🍉</span>`;
    case "emoji-lemon": return `<span style="font-size:3.5rem;">🍋</span>`;
    case "emoji-avocado": return `<span style="font-size:3.5rem;">🥑</span>`;
    case "emoji-cupcake": return `<span style="font-size:3.5rem;">🧁</span>`;
    case "emoji-donut": return `<span style="font-size:3.5rem;">🍩</span>`;
    case "emoji-cookie": return `<span style="font-size:3.5rem;">🍪</span>`;
    case "emoji-icecream": return `<span style="font-size:3.5rem;">🍦</span>`;
    case "emoji-coffee": return `<span style="font-size:3.5rem;">☕</span>`;
    case "emoji-boba": return `<span style="font-size:3.5rem;">🧋</span>`;
    case "emoji-aries": return `<span style="font-size:3.5rem;">♈</span>`;
    case "emoji-taurus": return `<span style="font-size:3.5rem;">♉</span>`;
    case "emoji-gemini": return `<span style="font-size:3.5rem;">♊</span>`;
    case "emoji-cancer": return `<span style="font-size:3.5rem;">♋</span>`;
    case "emoji-leo": return `<span style="font-size:3.5rem;">♌</span>`;
    case "emoji-virgo": return `<span style="font-size:3.5rem;">♍</span>`;
    case "emoji-libra": return `<span style="font-size:3.5rem;">♎</span>`;
    case "emoji-scorpio": return `<span style="font-size:3.5rem;">♏</span>`;
    case "emoji-sagittarius": return `<span style="font-size:3.5rem;">♐</span>`;
    case "emoji-capricorn": return `<span style="font-size:3.5rem;">♑</span>`;
    case "emoji-aquarius": return `<span style="font-size:3.5rem;">♒</span>`;
    case "emoji-pisces": return `<span style="font-size:3.5rem;">♓</span>`;
    case "icon-circle": return `<i class="fa-regular fa-circle" style="font-size:3rem; color:#e040fb; text-shadow: 0 0 14px rgba(224,64,251,0.5);"></i>`;
    case "icon-square": return `<i class="fa-regular fa-square" style="font-size:3rem; color:#00e5ff; text-shadow: 0 0 14px rgba(0,229,255,0.5);"></i>`;
    case "icon-triangle": return `<i class="fa-solid fa-play" style="font-size:3rem; color:#ffd740; text-shadow: 0 0 14px rgba(255,215,64,0.5); transform: rotate(-90deg);"></i>`;
    case "icon-hexagon": return `<i class="fa-solid fa-hexagon-xmark" style="font-size:3rem; color:#ff4081; text-shadow: 0 0 14px rgba(255,64,129,0.5);"></i>`;
    case "icon-diamond2": return `<i class="fa-regular fa-gem" style="font-size:3rem; color:#b388ff; text-shadow: 0 0 14px rgba(179,136,255,0.5);"></i>`;
    case "icon-yin-yang": return `<i class="fa-solid fa-yin-yang" style="font-size:3rem; color:#69f0ae; text-shadow: 0 0 14px rgba(105,240,174,0.5);"></i>`;
    case "icon-atom": return `<i class="fa-solid fa-atom" style="font-size:3rem; color:#00e5ff; text-shadow: 0 0 14px rgba(0,229,255,0.5);"></i>`;
    case "icon-peace": return `<i class="fa-solid fa-peace" style="font-size:3rem; color:#e040fb; text-shadow: 0 0 14px rgba(224,64,251,0.5);"></i>`;
    case "icon-om": return `<i class="fa-solid fa-om" style="font-size:3rem; color:#ffd740; text-shadow: 0 0 14px rgba(255,215,64,0.5);"></i>`;
    case "icon-cross-celtic": return `<i class="fa-solid fa-cross" style="font-size:3rem; color:#b388ff; text-shadow: 0 0 14px rgba(179,136,255,0.5);"></i>`;
    case "stamp-done": return `<div class="stamp-approved" style="border-color:#69f0ae;color:#69f0ae;">DONE ✓</div>`;
    case "stamp-wip": return `<div class="stamp-urgent" style="border-color:#ffab40;color:#ffab40;background:rgba(255,171,64,0.08);">IN PROGRESS</div>`;
    case "stamp-love-it": return `<div class="stamp-secret" style="border-color:#ff4081;color:#ff4081;">LOVE IT 💖</div>`;
    case "stamp-no-cap": return `<div class="stamp-classified" style="border-color:#00e5ff;color:#00e5ff;">NO CAP</div>`;
    case "stamp-vibing": return `<div class="stamp-approved" style="border-color:#e040fb;color:#e040fb;">VIBING ✨</div>`;
    case "stamp-growth": return `<div class="stamp-secret" style="border-color:#69f0ae;color:#69f0ae;">GROWTH 🌱</div>`;
    case "stamp-self-care": return `<div class="stamp-urgent" style="border-color:#f48fb1;color:#f48fb1;background:rgba(244,143,177,0.08);">SELF CARE</div>`;
    case "stamp-focus": return `<div class="stamp-classified" style="border-color:#ffd740;color:#ffd740;">FOCUS 🎯</div>`;
    case "stamp-breathe": return `<div class="stamp-approved" style="border-color:#81d4fa;color:#81d4fa;">BREATHE 🧘</div>`;
    case "stamp-trust": return `<div class="stamp-secret" style="border-color:#b388ff;color:#b388ff;">TRUST ∞</div>`;
    case "emoji-dog": return `<span style="font-size:3.5rem;">🐶</span>`;
    case "emoji-bunny": return `<span style="font-size:3.5rem;">🐰</span>`;
    case "emoji-bear": return `<span style="font-size:3.5rem;">🐻</span>`;
    case "emoji-panda": return `<span style="font-size:3.5rem;">🐼</span>`;
    case "emoji-fox": return `<span style="font-size:3.5rem;">🦊</span>`;
    case "emoji-owl": return `<span style="font-size:3.5rem;">🦉</span>`;
    case "emoji-koala": return `<span style="font-size:3.5rem;">🐨</span>`;
    case "emoji-penguin": return `<span style="font-size:3.5rem;">🐧</span>`;
    case "emoji-frog": return `<span style="font-size:3.5rem;">🐸</span>`;
    case "emoji-ladybug": return `<span style="font-size:3.5rem;">🐞</span>`;
    case "emoji-octopus": return `<span style="font-size:3.5rem;">🐙</span>`;
    case "emoji-whale": return `<span style="font-size:3.5rem;">🐳</span>`;
    case "emoji-flamingo": return `<span style="font-size:3.5rem;">🦩</span>`;
    case "emoji-bee": return `<span style="font-size:3.5rem;">🐝</span>`;
    case "emoji-snail": return `<span style="font-size:3.5rem;">🐌</span>`;
    case "emoji-hedgehog": return `<span style="font-size:3.5rem;">🦔</span>`;
    case "emoji-airplane": return `<span style="font-size:3.5rem;">✈️</span>`;
    case "emoji-rocket": return `<span style="font-size:3.5rem;">🚀</span>`;
    case "emoji-globe": return `<span style="font-size:3.5rem;">🌍</span>`;
    case "emoji-compass2": return `<span style="font-size:3.5rem;">🧭</span>`;
    case "emoji-tent": return `<span style="font-size:3.5rem;">⛺</span>`;
    case "emoji-castle": return `<span style="font-size:3.5rem;">🏰</span>`;
    case "emoji-ferris": return `<span style="font-size:3.5rem;">🎡</span>`;
    case "emoji-sunrise": return `<span style="font-size:3.5rem;">🌅</span>`;
    case "emoji-train": return `<span style="font-size:3.5rem;">🚂</span>`;
    case "emoji-sailboat": return `<span style="font-size:3.5rem;">⛵</span>`;
    case "emoji-palm": return `<span style="font-size:3.5rem;">🌴</span>`;
    case "emoji-beach": return `<span style="font-size:3.5rem;">🏖️</span>`;
    case "emoji-party": return `<span style="font-size:3.5rem;">🥳</span>`;
    case "emoji-confetti": return `<span style="font-size:3.5rem;">🎊</span>`;
    case "emoji-balloon": return `<span style="font-size:3.5rem;">🎈</span>`;
    case "emoji-cake": return `<span style="font-size:3.5rem;">🎂</span>`;
    case "emoji-gift": return `<span style="font-size:3.5rem;">🎁</span>`;
    case "emoji-trophy": return `<span style="font-size:3.5rem;">🏆</span>`;
    case "emoji-medal": return `<span style="font-size:3.5rem;">🏅</span>`;
    case "emoji-clap": return `<span style="font-size:3.5rem;">👏</span>`;
    case "emoji-tada": return `<span style="font-size:3.5rem;">🎉</span>`;
    case "emoji-fireworks": return `<span style="font-size:3.5rem;">🎆</span>`;
    case "emoji-disco": return `<span style="font-size:3.5rem;">🪩</span>`;
    case "emoji-champagne": return `<span style="font-size:3.5rem;">🍾</span>`;
    case "emoji-heart-red": return `<span style="font-size:3.5rem;">❤️</span>`;
    case "emoji-heart-orange": return `<span style="font-size:3.5rem;">🧡</span>`;
    case "emoji-heart-yellow": return `<span style="font-size:3.5rem;">💛</span>`;
    case "emoji-heart-green": return `<span style="font-size:3.5rem;">💚</span>`;
    case "emoji-heart-blue": return `<span style="font-size:3.5rem;">💙</span>`;
    case "emoji-heart-purple": return `<span style="font-size:3.5rem;">💜</span>`;
    case "emoji-heart-pink": return `<span style="font-size:3.5rem;">💗</span>`;
    case "emoji-heart-black": return `<span style="font-size:3.5rem;">🖤</span>`;
    case "emoji-heart-white": return `<span style="font-size:3.5rem;">🤍</span>`;
    case "emoji-heart-spark": return `<span style="font-size:3.5rem;">💖</span>`;
    case "emoji-heart-ribbon": return `<span style="font-size:3.5rem;">💝</span>`;
    case "emoji-heart-arrow": return `<span style="font-size:3.5rem;">💘</span>`;
    case "emoji-heart-grow": return `<span style="font-size:3.5rem;">💓</span>`;
    case "emoji-heart-revolve": return `<span style="font-size:3.5rem;">💞</span>`;
    case "emoji-music-note": return `<span style="font-size:3.5rem;">🎵</span>`;
    case "emoji-music-notes": return `<span style="font-size:3.5rem;">🎶</span>`;
    case "emoji-headphones": return `<span style="font-size:3.5rem;">🎧</span>`;
    case "emoji-microphone": return `<span style="font-size:3.5rem;">🎤</span>`;
    case "emoji-guitar": return `<span style="font-size:3.5rem;">🎸</span>`;
    case "emoji-piano": return `<span style="font-size:3.5rem;">🎹</span>`;
    case "emoji-drum": return `<span style="font-size:3.5rem;">🥁</span>`;
    case "emoji-violin": return `<span style="font-size:3.5rem;">🎻</span>`;
    case "emoji-saxophone": return `<span style="font-size:3.5rem;">🎷</span>`;
    case "emoji-trumpet": return `<span style="font-size:3.5rem;">🎺</span>`;
    case "frame-hearts": return `<div class="cy-frame" style="border:3px solid #ff4081;border-radius:12px;padding:20px;box-shadow:0 0 15px rgba(255,64,129,0.3),inset 0 0 15px rgba(255,64,129,0.1);position:relative;width:120px;height:80px;"><span style="position:absolute;top:-8px;left:10px;font-size:14px;">💖</span><span style="position:absolute;top:-8px;right:10px;font-size:14px;">💖</span><span style="position:absolute;bottom:-8px;left:10px;font-size:14px;">💖</span><span style="position:absolute;bottom:-8px;right:10px;font-size:14px;">💖</span></div>`;
    case "frame-stars": return `<div class="cy-frame" style="border:3px solid #ffd740;border-radius:12px;padding:20px;box-shadow:0 0 15px rgba(255,215,64,0.3),inset 0 0 15px rgba(255,215,64,0.1);width:120px;height:80px;position:relative;"><span style="position:absolute;top:-8px;left:10px;font-size:14px;">⭐</span><span style="position:absolute;top:-8px;right:10px;font-size:14px;">⭐</span><span style="position:absolute;bottom:-8px;left:10px;font-size:14px;">⭐</span><span style="position:absolute;bottom:-8px;right:10px;font-size:14px;">⭐</span></div>`;
    case "frame-rainbow": return `<div class="cy-frame" style="border:3px solid transparent;border-image:linear-gradient(90deg,#ff4081,#ff6d00,#ffd740,#69f0ae,#00e5ff,#7c4dff,#e040fb) 1;padding:20px;width:120px;height:80px;"></div>`;
    case "frame-floral": return `<div class="cy-frame" style="border:3px solid #f48fb1;border-radius:16px;padding:20px;box-shadow:0 0 15px rgba(244,143,177,0.3);width:120px;height:80px;position:relative;"><span style="position:absolute;top:-10px;left:50%;transform:translateX(-50%);font-size:16px;">🌸</span><span style="position:absolute;bottom:-10px;left:50%;transform:translateX(-50%);font-size:16px;">🌺</span><span style="position:absolute;left:-10px;top:50%;transform:translateY(-50%);font-size:16px;">🌷</span><span style="position:absolute;right:-10px;top:50%;transform:translateY(-50%);font-size:16px;">🌹</span></div>`;
    case "frame-sparkle": return `<div class="cy-frame" style="border:2px solid #e040fb;border-radius:12px;padding:20px;box-shadow:0 0 20px rgba(224,64,251,0.4),0 0 40px rgba(124,77,255,0.2);width:120px;height:80px;position:relative;"><span style="position:absolute;top:-6px;left:-6px;font-size:14px;">✨</span><span style="position:absolute;top:-6px;right:-6px;font-size:14px;">✨</span><span style="position:absolute;bottom:-6px;left:-6px;font-size:14px;">✨</span><span style="position:absolute;bottom:-6px;right:-6px;font-size:14px;">✨</span></div>`;
    case "frame-neon": return `<div class="cy-frame" style="border:2px solid #00e5ff;border-radius:8px;padding:20px;box-shadow:0 0 10px #00e5ff,0 0 20px rgba(0,229,255,0.4),0 0 30px rgba(0,229,255,0.2),inset 0 0 10px rgba(0,229,255,0.1);width:120px;height:80px;"></div>`;
    case "frame-cloud": return `<div class="cy-frame" style="border:3px solid #b388ff;border-radius:30px 30px 20px 20px;padding:20px;box-shadow:0 4px 20px rgba(179,136,255,0.3);width:120px;height:80px;position:relative;"><span style="position:absolute;top:-8px;left:20px;font-size:14px;">☁️</span><span style="position:absolute;top:-8px;right:20px;font-size:14px;">☁️</span></div>`;
    case "frame-gradient": return `<div class="cy-frame" style="border:3px solid transparent;background:linear-gradient(#1a0a2e,#1a0a2e) padding-box,linear-gradient(135deg,#ff4081,#e040fb,#7c4dff,#00e5ff) border-box;border-radius:12px;padding:20px;width:120px;height:80px;"></div>`;
    case "washi-pink": return `<div class="cy-washi" style="background:linear-gradient(90deg,rgba(255,64,129,0.5),rgba(244,143,177,0.5));height:24px;width:160px;transform:rotate(-2deg);"></div>`;
    case "washi-purple": return `<div class="cy-washi" style="background:linear-gradient(90deg,rgba(124,77,255,0.5),rgba(179,136,255,0.5));height:24px;width:160px;transform:rotate(1deg);"></div>`;
    case "washi-mint": return `<div class="cy-washi" style="background:linear-gradient(90deg,rgba(0,229,255,0.4),rgba(100,255,218,0.4));height:24px;width:160px;transform:rotate(-1deg);"></div>`;
    case "washi-gold": return `<div class="cy-washi" style="background:linear-gradient(90deg,rgba(255,215,64,0.5),rgba(255,171,64,0.5));height:24px;width:160px;transform:rotate(2deg);"></div>`;
    case "washi-rainbow": return `<div class="cy-washi" style="background:linear-gradient(90deg,rgba(255,64,129,0.4),rgba(255,109,0,0.4),rgba(255,215,64,0.4),rgba(105,240,174,0.4),rgba(0,229,255,0.4),rgba(124,77,255,0.4),rgba(224,64,251,0.4));height:24px;width:160px;transform:rotate(-1deg);"></div>`;
    case "washi-hearts": return `<div class="cy-washi" style="background:rgba(255,64,129,0.35);height:24px;width:160px;transform:rotate(1deg);font-size:10px;line-height:24px;text-align:center;letter-spacing:8px;">♥♥♥♥♥♥♥♥</div>`;
    case "washi-stars": return `<div class="cy-washi" style="background:rgba(255,215,64,0.35);height:24px;width:160px;transform:rotate(-2deg);font-size:10px;line-height:24px;text-align:center;letter-spacing:8px;">★★★★★★★★</div>`;
    case "washi-dots": return `<div class="cy-washi" style="background:rgba(179,136,255,0.35);height:24px;width:160px;transform:rotate(1deg);font-size:8px;line-height:24px;text-align:center;letter-spacing:6px;">● ● ● ● ● ● ● ●</div>`;
    case "washi-stripes": return `<div class="cy-washi" style="background:repeating-linear-gradient(45deg,rgba(224,64,251,0.3),rgba(224,64,251,0.3) 4px,rgba(0,229,255,0.3) 4px,rgba(0,229,255,0.3) 8px);height:24px;width:160px;transform:rotate(-1deg);"></div>`;
    case "washi-floral": return `<div class="cy-washi" style="background:rgba(244,143,177,0.35);height:24px;width:160px;transform:rotate(2deg);font-size:12px;line-height:24px;text-align:center;letter-spacing:4px;">🌸🌷🌺🌸🌷🌺🌸</div>`;
    case "emoji-alien": return `<span style="font-size:3.5rem;">👽</span>`;
    case "emoji-angel": return `<span style="font-size:3.5rem;">👼</span>`;
    case "emoji-witch": return `<span style="font-size:3.5rem;">🧙‍♀️</span>`;
    case "emoji-dragon": return `<span style="font-size:3.5rem;">🐉</span>`;
    case "emoji-magic-wand": return `<span style="font-size:3.5rem;">🪄</span>`;
    case "emoji-deer": return `<span style="font-size:3.5rem;">🦌</span>`;
    case "emoji-duck": return `<span style="font-size:3.5rem;">🦆</span>`;
    case "emoji-parrot": return `<span style="font-size:3.5rem;">🦜</span>`;
    case "emoji-jellyfish": return `<span style="font-size:3.5rem;">🪼</span>`;
    case "emoji-turtle": return `<span style="font-size:3.5rem;">🐢</span>`;
    case "emoji-sparkler": return `<span style="font-size:3.5rem;">🎇</span>`;
    case "emoji-pinata": return `<span style="font-size:3.5rem;">🪅</span>`;
    case "emoji-ribbon2": return `<span style="font-size:3.5rem;">🎀</span>`;
    case "emoji-snowman": return `<span style="font-size:3.5rem;">⛄</span>`;
    case "emoji-jack": return `<span style="font-size:3.5rem;">🎃</span>`;
    case "emoji-ghost": return `<span style="font-size:3.5rem;">👻</span>`;
    case "emoji-xmas-tree": return `<span style="font-size:3.5rem;">🎄</span>`;
    case "emoji-santa": return `<span style="font-size:3.5rem;">🎅</span>`;
    case "emoji-candy-cane": return `<span style="font-size:3.5rem;">🍬</span>`;
    case "emoji-egg": return `<span style="font-size:3.5rem;">🥚</span>`;
    case "emoji-four-leaf": return `<span style="font-size:3.5rem;">🍀</span>`;
    case "emoji-pumpkin": return `<span style="font-size:3.5rem;">🎃</span>`;
    case "emoji-bat": return `<span style="font-size:3.5rem;">🦇</span>`;
    default:
      if (type.startsWith("note-image-")) return `<div class="sticky-note sticky-note-media" style="background:#1a0a2e;"><div class="cy-note-drag-handle"><i class="fa-solid fa-grip"></i></div><img src="${type.replace("note-image-","")}" class="cy-note-media" /></div>`;
      if (type.startsWith("note-video-")) return `<div class="sticky-note sticky-note-media" style="background:#1a0a2e;"><div class="cy-note-drag-handle"><i class="fa-solid fa-grip"></i></div><video src="${type.replace("note-video-","")}" class="cy-note-media" controls /></div>`;
      return `<div style="color:var(--cy-primary);font-size:12px;">~</div>`;
  }
}

const DAILY_AFFIRMATIONS = [
  "You are exactly where you need to be. Keep going.",
  "Today is going to be amazing because YOU are amazing.",
  "You have the power to create the life of your dreams.",
  "Every step forward is a step toward your best self.",
  "You are worthy of all the beauty life has to offer.",
  "Shine bright today — the world needs your light.",
  "You are stronger than you think and braver than you believe.",
  "This is your story, and it's going to be incredible.",
  "Choose joy. Choose growth. Choose YOU.",
  "The magic you seek is already within you.",
  "You deserve to take up space and be unapologetically yourself.",
  "Today's effort is tomorrow's success story.",
];

const MOOD_EMOJIS = [
  { emoji: "😢", label: "Rough", color: "#ff4081" },
  { emoji: "😔", label: "Low", color: "#ffab40" },
  { emoji: "😐", label: "Okay", color: "#ffd740" },
  { emoji: "😊", label: "Good", color: "#69f0ae" },
  { emoji: "🤩", label: "Amazing", color: "#e040fb" },
];

const DEFAULT_HABITS = [
  { id: "h1", name: "Meditate", icon: "fa-solid fa-spa", color: "#b388ff" },
  { id: "h2", name: "Journal", icon: "fa-solid fa-book-open", color: "#e040fb" },
  { id: "h3", name: "Exercise", icon: "fa-solid fa-dumbbell", color: "#69f0ae" },
  { id: "h4", name: "Read", icon: "fa-solid fa-glasses", color: "#00e5ff" },
  { id: "h5", name: "Hydrate", icon: "fa-solid fa-droplet", color: "#81d4fa" },
  { id: "h6", name: "Gratitude", icon: "fa-solid fa-heart", color: "#ff4081" },
];

const HABIT_ICONS = [
  "fa-solid fa-spa", "fa-solid fa-book-open", "fa-solid fa-dumbbell", "fa-solid fa-glasses",
  "fa-solid fa-droplet", "fa-solid fa-heart", "fa-solid fa-moon", "fa-solid fa-sun",
  "fa-solid fa-leaf", "fa-solid fa-music", "fa-solid fa-pen", "fa-solid fa-apple-whole",
  "fa-solid fa-person-walking", "fa-solid fa-bed", "fa-solid fa-face-smile", "fa-solid fa-brain",
];
const HABIT_COLORS = ["#b388ff", "#e040fb", "#69f0ae", "#00e5ff", "#81d4fa", "#ff4081", "#ffd740", "#ffab40", "#64ffda", "#f48fb1", "#7c4dff", "#ff6d00"];

type MoodEntry = { date: string; mood: number; note: string };
type HabitDay = { date: string; completed: string[] };

function getToday() { return new Date().toISOString().split("T")[0]; }

interface CyberLogProps {
  user: { id: string; username: string };
  onLogout: () => void;
}

export default function CyberLog({ user, onLogout }: CyberLogProps) {
  const [section, setSection] = useState<Section>("journal");
  const [theme, setTheme] = useState("rainbow-dream");
  const [files, setFiles] = useState<JournalFile[]>(INITIAL_FILES);
  const [activeFileId, setActiveFileId] = useState("tutorial");
  const [paperPattern, setPaperPattern] = useState("paper-stars");
  const [canvasMode, setCanvasMode] = useState("canvas-default");
  const [stickersByFile, setStickersByFile] = useState<Record<string, Sticker[]>>({});
  const [mindMapStickers, setMindMapStickers] = useState<Sticker[]>([]);
  const [calendarStickers, setCalendarStickers] = useState<Sticker[]>([]);
  const [assetOpen, setAssetOpen] = useState(false);
  const [assetTab, setAssetTab] = useState<keyof typeof STICKER_CATEGORIES>("Vibes");
  const [notesPanelOpen, setNotesPanelOpen] = useState(false);
  const noteImageRef = useRef<HTMLInputElement>(null);
  const noteVideoRef = useRef<HTMLInputElement>(null);
  const eventImageRef = useRef<HTMLInputElement>(null);
  const [goals, setGoals] = useState<Goal[]>(INITIAL_GOALS);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [goalForm, setGoalForm] = useState({ ...EMPTY_GOAL_FORM });
  const [expandedGoal, setExpandedGoal] = useState<string | null>(null);
  const [milestoneInput, setMilestoneInput] = useState("");
  const NODE_COLORS = ["#e040fb", "#7c4dff", "#00e5ff", "#69f0ae", "#ffd740", "#ff4081", "#ffab40", "#b388ff", "#64ffda", "#ff6d00"];

  const MINDMAP_THEMES: { name: string; icon: string; root: string; rootColor: string; branches: { text: string; color: string }[] }[] = [
    { name: "Dream Life", icon: "fa-sparkles", root: "My Dream Life", rootColor: "#e040fb",
      branches: [
        { text: "Career Goals", color: "#7c4dff" }, { text: "Health & Wellness", color: "#69f0ae" },
        { text: "Relationships", color: "#ff4081" }, { text: "Personal Growth", color: "#00e5ff" },
        { text: "Financial Freedom", color: "#ffd740" },
      ] },
    { name: "Business Plan", icon: "fa-briefcase", root: "My Business", rootColor: "#00e5ff",
      branches: [
        { text: "Product / Service", color: "#e040fb" }, { text: "Target Market", color: "#69f0ae" },
        { text: "Revenue Model", color: "#ffd740" }, { text: "Marketing", color: "#ff4081" },
        { text: "Operations", color: "#7c4dff" },
      ] },
    { name: "Self Care", icon: "fa-heart", root: "Self Care Plan", rootColor: "#ff4081",
      branches: [
        { text: "Mental Health", color: "#b388ff" }, { text: "Physical Health", color: "#69f0ae" },
        { text: "Social Life", color: "#00e5ff" }, { text: "Hobbies & Joy", color: "#ffd740" },
        { text: "Rest & Recovery", color: "#64ffda" },
      ] },
    { name: "Study Plan", icon: "fa-graduation-cap", root: "Study Goals", rootColor: "#7c4dff",
      branches: [
        { text: "Main Subject", color: "#e040fb" }, { text: "Side Projects", color: "#00e5ff" },
        { text: "Reading List", color: "#69f0ae" }, { text: "Skills to Learn", color: "#ffd740" },
        { text: "Deadlines", color: "#ff4081" },
      ] },
    { name: "Creative Project", icon: "fa-palette", root: "Creative Vision", rootColor: "#ffab40",
      branches: [
        { text: "Inspiration", color: "#e040fb" }, { text: "Materials & Tools", color: "#00e5ff" },
        { text: "Timeline", color: "#ff4081" }, { text: "Collaborators", color: "#69f0ae" },
        { text: "Goals & Milestones", color: "#7c4dff" },
      ] },
  ];

  const applyMindMapTheme = (themeIdx: number) => {
    const t = MINDMAP_THEMES[themeIdx];
    const cx = 400, cy = 300;
    const nodes: MindMapNode[] = [
      { id: "root", text: t.root, x: cx, y: cy, color: t.rootColor, parentId: null },
    ];
    t.branches.forEach((b, i) => {
      const angle = (i / t.branches.length) * Math.PI * 2 - Math.PI / 2;
      const dist = 200;
      nodes.push({
        id: `n${i + 1}`,
        text: b.text,
        x: cx + Math.cos(angle) * dist,
        y: cy + Math.sin(angle) * dist,
        color: b.color,
        parentId: "root",
      });
    });
    setMindMapNodes(nodes);
    setSelectedNode(null);
    setMindMapStickers([]);
  };

  const clearMindMap = () => {
    setMindMapNodes([
      { id: "root", text: "Start here...", x: 400, y: 300, color: "#e040fb", parentId: null },
    ]);
    setSelectedNode(null);
    setMindMapStickers([]);
  };

  const [mindMapNodes, setMindMapNodes] = useState<MindMapNode[]>([
    { id: "root", text: "My Dream Life", x: 400, y: 300, color: "#e040fb", parentId: null },
    { id: "n1", text: "Career Goals", x: 200, y: 150, color: "#7c4dff", parentId: "root" },
    { id: "n2", text: "Health & Wellness", x: 600, y: 150, color: "#69f0ae", parentId: "root" },
    { id: "n3", text: "Relationships", x: 200, y: 450, color: "#ff4081", parentId: "root" },
    { id: "n4", text: "Personal Growth", x: 600, y: 450, color: "#00e5ff", parentId: "root" },
    { id: "n5", text: "Financial Freedom", x: 100, y: 300, color: "#ffd740", parentId: "root" },
  ]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [editingNode, setEditingNode] = useState<string | null>(null);
  const [newNodeText, setNewNodeText] = useState("");
  const mindMapRef = useRef<HTMLDivElement>(null);
  const [terminalLines, setTerminalLines] = useState([
    { text: "Welcome to your safe space...", cls: "" },
    { text: "Today is a beautiful day to chase your dreams.", cls: "cy-log-info" },
    { text: "Type 'help' for affirmation commands.", cls: "cy-log-success" },
  ]);
  const [termCmd, setTermCmd] = useState("");
  const [glitching, setGlitching] = useState(false);
  const [crtEnabled, setCrtEnabled] = useState(true);
  const [fontChoice, setFontChoice] = useState("Nunito");
  const [textColorChoice, setTextColorChoice] = useState("#f0e0ff");
  const [highlightColorChoice, setHighlightColorChoice] = useState("#7c4dff");
  const [editorFontSize, setEditorFontSize] = useState(16);
  const [accentColor, setAccentColor] = useState("");
  const [borderStyle, setBorderStyle] = useState("default");
  const [cursorGlow, setCursorGlow] = useState(false);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [visionSubpage, setVisionSubpage] = useState<string | null>(null);
  const [visionImages, setVisionImages] = useState<Record<string, {src: string, caption: string}[]>>({});
  const visionImageRef = useRef<HTMLInputElement>(null);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [calendarView, setCalendarView] = useState<"daily" | "weekly" | "monthly">("monthly");
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [eventForm, setEventForm] = useState({ title: "", date: getToday(), startTime: "09:00", endTime: "10:00", color: "#e040fb", description: "", location: "", category: "General", allDay: false, image: "" });
  const EVENT_COLORS = ["#e040fb","#ff4081","#7c4dff","#00e5ff","#69f0ae","#ffd740","#ffab40","#f48fb1","#b388ff","#64ffda","#ff6d00","#81d4fa"];
  const EVENT_CATEGORIES = ["General","Work","Personal","Health","Social","Creative","Learning","Finance"];
  const [moodNote, setMoodNote] = useState("");
  const [habitDays, setHabitDays] = useState<HabitDay[]>([]);
  const [showAffirmation, setShowAffirmation] = useState(false);
  const [dailyAffirmation, setDailyAffirmation] = useState("");
  const [customHabits, setCustomHabits] = useState<{id: string, name: string, icon: string, color: string}[]>([]);
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [newHabitName, setNewHabitName] = useState("");
  const [newHabitIcon, setNewHabitIcon] = useState(HABIT_ICONS[0]);
  const [newHabitColor, setNewHabitColor] = useState(HABIT_COLORS[0]);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [editingBudgetItem, setEditingBudgetItem] = useState<BudgetItem | null>(null);
  const [budgetForm, setBudgetForm] = useState({ name: "", amount: "", category: "Housing", type: "expense" as "income" | "expense", recurring: false });
  const [budgetMonth, setBudgetMonth] = useState(() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`; });
  const BUDGET_CATEGORIES_EXPENSE = ["Housing","Utilities","Groceries","Transport","Insurance","Healthcare","Entertainment","Dining","Shopping","Subscriptions","Education","Savings","Debt","Pets","Personal","Other"];
  const BUDGET_CATEGORIES_INCOME = ["Salary","Freelance","Side Hustle","Investments","Gifts","Refunds","Other"];
  const BUDGET_CATEGORY_ICONS: Record<string, string> = { Housing:"fa-house", Utilities:"fa-bolt", Groceries:"fa-cart-shopping", Transport:"fa-car", Insurance:"fa-shield-halved", Healthcare:"fa-heart-pulse", Entertainment:"fa-film", Dining:"fa-utensils", Shopping:"fa-bag-shopping", Subscriptions:"fa-repeat", Education:"fa-graduation-cap", Savings:"fa-piggy-bank", Debt:"fa-credit-card", Pets:"fa-paw", Personal:"fa-user", Other:"fa-ellipsis", Salary:"fa-briefcase", Freelance:"fa-laptop", "Side Hustle":"fa-rocket", Investments:"fa-chart-line", Gifts:"fa-gift", Refunds:"fa-rotate-left" };
  const [entryTitlePrompt, setEntryTitlePrompt] = useState(false);
  const [entryTitleText, setEntryTitleText] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const profilePicRef = useRef<HTMLInputElement>(null);
  const [identity, setIdentity] = useState({
    handle: "Dreamer",
    clearance: "Unlimited",
    faction: "Self-Love Club",
    location: "Wherever my heart leads",
    bio: "Living boldly, dreaming wildly, and choosing joy every single day.",
  });

  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/data")
      .then(r => r.json())
      .then(d => {
        if (d && typeof d === "object" && !d.message) {
          if (d.theme) setTheme(d.theme);
          if (d.files) setFiles(d.files);
          if (d.goals) setGoals(d.goals);
          if (d.identity) setIdentity(d.identity);
          if (d.profilePic) setProfilePic(d.profilePic);
          if (d.moodEntries) setMoodEntries(d.moodEntries);
          if (d.calendarEvents) setCalendarEvents(d.calendarEvents);
          if (d.habitDays) setHabitDays(d.habitDays);
          if (d.mindMapNodes) setMindMapNodes(d.mindMapNodes);
          if (d.mindMapStickers) setMindMapStickers(d.mindMapStickers);
          if (d.calendarStickers) setCalendarStickers(d.calendarStickers);
          if (d.stickersByFile) setStickersByFile(d.stickersByFile);
          if (d.customHabits) setCustomHabits(d.customHabits);
          if (d.visionImages) {
            const migrated: Record<string, {src: string, caption: string}[]> = {};
            for (const [k, v] of Object.entries(d.visionImages)) {
              migrated[k] = (v as any[]).map((item: any) =>
                typeof item === "string" ? { src: item, caption: "" } : item
              );
            }
            setVisionImages(migrated);
          }
          if (d.paperPattern) setPaperPattern(d.paperPattern);
          if (d.canvasMode) setCanvasMode(d.canvasMode);
          if (d.crtEnabled !== undefined) setCrtEnabled(d.crtEnabled);
          if (d.editorFontSize) setEditorFontSize(d.editorFontSize);
          if (d.accentColor) setAccentColor(d.accentColor);
          if (d.borderStyle) setBorderStyle(d.borderStyle);
          if (d.cursorGlow !== undefined) setCursorGlow(d.cursorGlow);
          if (d.budgetItems) setBudgetItems(d.budgetItems);
        }
        setDataLoaded(true);
      })
      .catch(() => setDataLoaded(true));

    const lastShown = localStorage.getItem("dreamlog-affirmation-date");
    const today = getToday();
    if (lastShown !== today) {
      setDailyAffirmation(DAILY_AFFIRMATIONS[Math.floor(Math.random() * DAILY_AFFIRMATIONS.length)]);
      setShowAffirmation(true);
      localStorage.setItem("dreamlog-affirmation-date", today);
    }
  }, []);

  useEffect(() => {
    if (!dataLoaded) return;
    const timeout = setTimeout(() => {
      try {
        const payload = {
          theme, files, goals, identity, profilePic, moodEntries, calendarEvents, habitDays, mindMapNodes, visionImages, customHabits, paperPattern, canvasMode, crtEnabled, mindMapStickers, calendarStickers, stickersByFile, editorFontSize, accentColor, borderStyle, cursorGlow, budgetItems,
        };
        fetch("/api/data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }).catch(() => {});
      } catch {}
    }, 1000);
    return () => clearTimeout(timeout);
  }, [dataLoaded, theme, files, goals, identity, profilePic, moodEntries, calendarEvents, habitDays, mindMapNodes, visionImages, customHabits, paperPattern, canvasMode, crtEnabled, mindMapStickers, calendarStickers, stickersByFile, editorFontSize, accentColor, borderStyle, cursorGlow, budgetItems]);

  const editorRef = useRef<HTMLDivElement>(null);
  const termOutputRef = useRef<HTMLDivElement>(null);

  const activeFile = files.find(f => f.id === activeFileId) || files[0];

  const initDrag = useCallback((el: HTMLDivElement, stickerId: string, target: "journal" | "mindmap" | "calendar" = "journal", fileId?: string) => {
    let ox = 0, oy = 0, sx = 0, sy = 0;
    const onDown = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.classList.contains("cy-sticker-delete") || t.classList.contains("cy-sticker-resize")) return;
      if (t.getAttribute("contenteditable") === "true" || t.closest("[contenteditable='true']")) {
        if (!t.classList.contains("cy-note-drag-handle") && !t.closest(".cy-note-drag-handle")) return;
      }
      e.preventDefault();
      sx = e.clientX; sy = e.clientY;
      ox = el.offsetLeft; oy = el.offsetTop;
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    };
    const onMove = (e: MouseEvent) => {
      e.preventDefault();
      const nx = ox + (e.clientX - sx);
      const ny = oy + (e.clientY - sy);
      el.style.left = nx + "px";
      el.style.top  = ny + "px";
    };
    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      const nx = parseInt(el.style.left) || 0;
      const ny = parseInt(el.style.top) || 0;
      if (target === "mindmap") {
        setMindMapStickers(prev => prev.map(s => s.id === stickerId ? { ...s, x: nx, y: ny } : s));
      } else if (target === "calendar") {
        setCalendarStickers(prev => prev.map(s => s.id === stickerId ? { ...s, x: nx, y: ny } : s));
      } else if (fileId) {
        setStickersByFile(prev => ({
          ...prev,
          [fileId]: (prev[fileId] || []).map(s => s.id === stickerId ? { ...s, x: nx, y: ny } : s),
        }));
      }
    };
    el.addEventListener("mousedown", onDown);
  }, []);

  const stickers = stickersByFile[activeFileId] || [];

  const setStickers = (updater: (prev: Sticker[]) => Sticker[]) => {
    setStickersByFile(prev => ({
      ...prev,
      [activeFileId]: updater(prev[activeFileId] || []),
    }));
  };

  const addSticker = (type: string, target: "journal" | "mindmap" | "calendar" = "journal") => {
    const id = Math.random().toString(36).slice(2);
    const rx = Math.floor(Math.random() * 200) + 60;
    const ry = Math.floor(Math.random() * 200) + 100;
    const rot = type.startsWith("note") || type.startsWith("icon") ? 0 : Math.floor(Math.random() * 24) - 12;
    const newSticker = { id, type, x: rx, y: ry, rotation: rot, scale: 1 };
    if (target === "mindmap") {
      setMindMapStickers(s => [...s, newSticker]);
    } else if (target === "calendar") {
      setCalendarStickers(s => [...s, newSticker]);
    } else {
      setStickers(s => [...s, newSticker]);
    }
  };

  const removeSticker = (id: string) => setStickers(s => s.filter(st => st.id !== id));
  const removeMindMapSticker = (id: string) => setMindMapStickers(s => s.filter(st => st.id !== id));
  const removeCalendarSticker = (id: string) => setCalendarStickers(s => s.filter(st => st.id !== id));

  const resizeSticker = (id: string, delta: number, target: "journal" | "mindmap" | "calendar" = "journal") => {
    if (target === "mindmap") {
      setMindMapStickers(prev => prev.map(s => s.id === id ? { ...s, scale: Math.max(0.3, Math.min(3, (s.scale || 1) + delta)) } : s));
    } else if (target === "calendar") {
      setCalendarStickers(prev => prev.map(s => s.id === id ? { ...s, scale: Math.max(0.3, Math.min(3, (s.scale || 1) + delta)) } : s));
    } else {
      setStickers(prev => prev.map(s => s.id === id ? { ...s, scale: Math.max(0.3, Math.min(3, (s.scale || 1) + delta)) } : s));
    }
  };

  useEffect(() => {
    stickers.forEach(st => {
      const el = document.getElementById(`sticker-${st.id}`) as HTMLDivElement | null;
      if (el && !el.dataset.dragging) {
        el.dataset.dragging = "1";
        initDrag(el, st.id, "journal", activeFileId);
      }
    });
  }, [stickers, initDrag, activeFileId]);

  useEffect(() => {
    mindMapStickers.forEach(st => {
      const el = document.getElementById(`mmsticker-${st.id}`) as HTMLDivElement | null;
      if (el && !el.dataset.dragging) {
        el.dataset.dragging = "1";
        initDrag(el, st.id, "mindmap");
      }
    });
  }, [mindMapStickers, initDrag]);

  useEffect(() => {
    calendarStickers.forEach(st => {
      const el = document.getElementById(`calsticker-${st.id}`) as HTMLDivElement | null;
      if (el && !el.dataset.dragging) {
        el.dataset.dragging = "1";
        initDrag(el, st.id, "calendar");
      }
    });
  }, [calendarStickers, initDrag]);

  useEffect(() => {
    if (!cursorGlow) {
      const existing = document.getElementById("cursor-glow-orb");
      if (existing) existing.remove();
      return;
    }
    let orb = document.getElementById("cursor-glow-orb") as HTMLDivElement;
    if (!orb) {
      orb = document.createElement("div");
      orb.id = "cursor-glow-orb";
      document.body.appendChild(orb);
    }
    const onMove = (e: MouseEvent) => {
      orb.style.left = e.clientX + "px";
      orb.style.top = e.clientY + "px";
      orb.style.opacity = "1";
    };
    document.addEventListener("mousemove", onMove);
    return () => {
      document.removeEventListener("mousemove", onMove);
      orb.style.opacity = "0";
    };
  }, [cursorGlow]);

  const savedSelectionRef = useRef<Range | null>(null);

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      if (editorRef.current?.contains(range.commonAncestorContainer)) {
        savedSelectionRef.current = range.cloneRange();
      }
    }
  };

  const restoreSelection = () => {
    const range = savedSelectionRef.current;
    if (range) {
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  };

  const formatDoc = (cmd: string, value?: string) => {
    restoreSelection();
    if (cmd === "hiliteColor") {
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
        const range = sel.getRangeAt(0);
        const parent = range.commonAncestorContainer.nodeType === 3 ? range.commonAncestorContainer.parentElement : range.commonAncestorContainer as HTMLElement;
        const existingMark = parent?.closest?.("[data-highlight]") || (parent?.hasAttribute?.("data-highlight") ? parent : null);
        if (existingMark && sel.toString() === existingMark.textContent) {
          existingMark.style.backgroundColor = value || "#7c4dff";
        } else {
          const mark = document.createElement("span");
          mark.setAttribute("data-highlight", "true");
          mark.style.backgroundColor = value || "#7c4dff";
          mark.style.color = "#111";
          mark.style.borderRadius = "2px";
          mark.style.padding = "0 2px";
          try {
            range.surroundContents(mark);
          } catch {
            const frag = range.extractContents();
            mark.appendChild(frag);
            range.insertNode(mark);
          }
          sel.removeAllRanges();
          const newRange = document.createRange();
          newRange.selectNodeContents(mark);
          sel.addRange(newRange);
        }
      }
      editorRef.current?.focus();
      return;
    }
    document.execCommand(cmd, false, value ?? undefined);
    editorRef.current?.focus();
  };

  const triggerGlitch = () => {
    setGlitching(true);
    setTimeout(() => setGlitching(false), 800);
    const otherThemes = THEMES.filter(t => t.id !== theme);
    const randomTheme = otherThemes[Math.floor(Math.random() * otherThemes.length)];
    setTheme(randomTheme.id);
    const container = document.querySelector(".cyber-app");
    if (!container) return;
    const flash = document.createElement("div");
    flash.className = "sparkle-flash";
    container.appendChild(flash);
    setTimeout(() => flash.remove(), 800);

    const flash2 = document.createElement("div");
    flash2.className = "sparkle-flash sparkle-flash-delayed";
    container.appendChild(flash2);
    setTimeout(() => flash2.remove(), 1200);

    const colors = ["#ff4081","#e040fb","#7c4dff","#00e5ff","#69f0ae","#ffd740","#ffab40","#f48fb1","#b388ff","#64ffda","#ff6d00","#ea80fc","#fff","#ff69b4","#00ffcc","#ff1744","#d500f9","#651fff","#18ffff","#76ff03","#ffea00","#ff9100"];
    const shapes = ["circle", "star", "diamond", "heart", "hexagon"];

    const makeBurst = (ox: number, oy: number, count: number, delay: number) => {
      const burst = document.createElement("div");
      burst.className = "glitter-explosion";
      burst.style.left = ox + "px";
      burst.style.top = oy + "px";
      for (let i = 0; i < count; i++) {
        const p = document.createElement("span");
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        p.className = `glitter-particle glitter-${shape}`;
        const angle = Math.random() * 360;
        const dist = 40 + Math.random() * 500;
        const dx = Math.cos(angle * Math.PI / 180) * dist;
        const dy = Math.sin(angle * Math.PI / 180) * dist;
        p.style.setProperty("--dx", dx + "px");
        p.style.setProperty("--dy", dy + "px");
        p.style.setProperty("--rot", (Math.random() * 1080 - 540) + "deg");
        const c = colors[Math.floor(Math.random() * colors.length)];
        p.style.background = c;
        p.style.color = c;
        p.style.animationDelay = (delay + Math.random() * 0.4) + "s";
        p.style.animationDuration = (1.2 + Math.random() * 1.5) + "s";
        const size = 2 + Math.random() * 14;
        p.style.width = size + "px";
        p.style.height = size + "px";
        burst.appendChild(p);
      }
      container.appendChild(burst);
      setTimeout(() => burst.remove(), 3500);
    };

    makeBurst(0, 0, 150, 0);

    const w = window.innerWidth;
    const h = window.innerHeight;
    setTimeout(() => makeBurst((-w/2 + Math.random() * w) * 0.6, (-h/2 + Math.random() * h) * 0.6, 80, 0), 150);
    setTimeout(() => makeBurst((-w/2 + Math.random() * w) * 0.6, (-h/2 + Math.random() * h) * 0.6, 80, 0), 350);
    setTimeout(() => makeBurst((-w/2 + Math.random() * w) * 0.5, (-h/2 + Math.random() * h) * 0.5, 60, 0), 550);

    for (let r = 0; r < 20; r++) {
      const rain = document.createElement("div");
      rain.className = "glitter-rain";
      rain.style.left = (Math.random() * 100) + "vw";
      rain.style.animationDelay = (Math.random() * 2) + "s";
      rain.style.animationDuration = (1.5 + Math.random() * 2) + "s";
      rain.style.background = colors[Math.floor(Math.random() * colors.length)];
      rain.style.boxShadow = `0 0 6px ${rain.style.background}, 0 0 12px ${rain.style.background}`;
      const s = 3 + Math.random() * 6;
      rain.style.width = s + "px";
      rain.style.height = s + "px";
      container.appendChild(rain);
      setTimeout(() => rain.remove(), 4000);
    }
  };

  const handleTerminal = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    const cmd = termCmd.trim().toLowerCase();
    setTermCmd("");
    if (!cmd) return;
    setTerminalLines(lines => [...lines, { text: cmd, cls: "" }]);
    setTimeout(() => {
      const result = AFFIRMATION_CMDS[cmd];
      if (!result) {
        setTerminalLines(l => [...l, { text: `Try 'help' for available commands.`, cls: "cy-log-error" }]);
        return;
      }
      if (result.response === "__CLEAR__") { setTerminalLines([]); return; }
      setTerminalLines(l => [...l, { text: result.response, cls: result.cls || "" }]);
    }, 350);
  };

  useEffect(() => {
    if (termOutputRef.current) termOutputRef.current.scrollTop = termOutputRef.current.scrollHeight;
  }, [terminalLines]);

  const selectFile = (id: string) => {
    if (editorRef.current && activeFileId) {
      setFiles(fs => fs.map(f => f.id === activeFileId ? { ...f, content: editorRef.current!.innerHTML } : f));
    }
    setActiveFileId(id);
  };

  useEffect(() => {
    if (editorRef.current && activeFile) editorRef.current.innerHTML = activeFile.content;
  }, [activeFileId]);


  const addGoal = () => {
    const { name, specific, measurable, achievable, relevant, timeBound, category } = goalForm;
    if (!name.trim() || !specific.trim() || !measurable.trim() || !achievable.trim() || !relevant.trim() || !timeBound.trim()) return;
    const id = "g" + Math.random().toString(36).slice(2);
    const newGoal: Goal = {
      id,
      name: name.trim(),
      specific: specific.trim(),
      measurable: measurable.trim(),
      achievable: achievable.trim(),
      relevant: relevant.trim(),
      timeBound: timeBound.trim(),
      category,
      progress: 0,
      status: "JUST STARTED",
    };
    setGoals(g => [newGoal, ...g]);
    setGoalForm({ ...EMPTY_GOAL_FORM });
    setShowGoalForm(false);
  };

  const updateGoalProgress = (id: string, progress: number) => {
    const clamped = Math.max(0, Math.min(100, progress));
    const status = clamped === 0 ? "JUST STARTED" : clamped < 25 ? "GETTING STARTED" : clamped < 50 ? "MAKING PROGRESS" : clamped < 75 ? "HALFWAY THERE" : clamped < 100 ? "ALMOST DONE" : "COMPLETE ✨";
    setGoals(g => g.map(goal => goal.id === id ? { ...goal, progress: clamped, status } : goal));
  };

  const toggleGoalMilestone = (goalId: string, milestoneIdx: number) => {
    setGoals(g => g.map(goal => {
      if (goal.id !== goalId) return goal;
      const milestones = [...(goal.milestones || [])];
      milestones[milestoneIdx] = { ...milestones[milestoneIdx], done: !milestones[milestoneIdx].done };
      const doneCount = milestones.filter(m => m.done).length;
      const progress = milestones.length > 0 ? Math.round((doneCount / milestones.length) * 100) : goal.progress;
      const status = progress === 0 ? "JUST STARTED" : progress < 25 ? "GETTING STARTED" : progress < 50 ? "MAKING PROGRESS" : progress < 75 ? "HALFWAY THERE" : progress < 100 ? "ALMOST DONE" : "COMPLETE ✨";
      return { ...goal, milestones, progress, status };
    }));
  };

  const addGoalMilestone = (goalId: string, text: string) => {
    if (!text.trim()) return;
    setGoals(g => g.map(goal => {
      if (goal.id !== goalId) return goal;
      const milestones = [...(goal.milestones || []), { text: text.trim(), done: false }];
      return { ...goal, milestones };
    }));
  };

  const removeGoalMilestone = (goalId: string, idx: number) => {
    setGoals(g => g.map(goal => {
      if (goal.id !== goalId) return goal;
      const milestones = (goal.milestones || []).filter((_, i) => i !== idx);
      const doneCount = milestones.filter(m => m.done).length;
      const progress = milestones.length > 0 ? Math.round((doneCount / milestones.length) * 100) : goal.progress;
      const status = progress === 0 ? "JUST STARTED" : progress < 25 ? "GETTING STARTED" : progress < 50 ? "MAKING PROGRESS" : progress < 75 ? "HALFWAY THERE" : progress < 100 ? "ALMOST DONE" : "COMPLETE ✨";
      return { ...goal, milestones, progress, status };
    }));
  };

  const deleteGoal = (id: string) => {
    setGoals(g => g.filter(goal => goal.id !== id));
    if (expandedGoal === id) setExpandedGoal(null);
  };

  const addMindMapNode = (parentId: string) => {
    const parent = mindMapNodes.find(n => n.id === parentId);
    if (!parent) return;
    const id = "mm" + Math.random().toString(36).slice(2);
    const angle = Math.random() * Math.PI * 2;
    const dist = 120 + Math.random() * 60;
    const color = NODE_COLORS[Math.floor(Math.random() * NODE_COLORS.length)];
    setMindMapNodes(ns => [...ns, {
      id, text: "New idea...", x: parent.x + Math.cos(angle) * dist, y: parent.y + Math.sin(angle) * dist, color, parentId,
    }]);
    setEditingNode(id);
    setNewNodeText("New idea...");
  };

  const deleteMindMapNode = (id: string) => {
    if (id === "root") return;
    const toRemove = new Set<string>();
    const collect = (nid: string) => {
      toRemove.add(nid);
      mindMapNodes.filter(n => n.parentId === nid).forEach(n => collect(n.id));
    };
    collect(id);
    setMindMapNodes(ns => ns.filter(n => !toRemove.has(n.id)));
    if (selectedNode && toRemove.has(selectedNode)) setSelectedNode(null);
    if (editingNode && toRemove.has(editingNode)) setEditingNode(null);
  };

  const saveNodeEdit = (id: string) => {
    if (newNodeText.trim()) {
      setMindMapNodes(ns => ns.map(n => n.id === id ? { ...n, text: newNodeText.trim() } : n));
    }
    setEditingNode(null);
    setNewNodeText("");
  };

  const dragCleanups = useRef<Map<string, () => void>>(new Map());

  const initNodeDrag = useCallback((el: HTMLDivElement, nodeId: string) => {
    if (dragCleanups.current.has(nodeId)) {
      dragCleanups.current.get(nodeId)!();
    }
    let sx = 0, sy = 0, ox = 0, oy = 0, dragged = false;
    const onDown = (e: MouseEvent) => {
      const tgt = e.target as HTMLElement;
      if (tgt.tagName === "INPUT" || tgt.tagName === "BUTTON" || tgt.closest("button")) return;
      e.preventDefault();
      e.stopPropagation();
      sx = e.clientX; sy = e.clientY;
      const rect = el.getBoundingClientRect();
      const container = el.parentElement;
      const containerRect = container?.getBoundingClientRect() || { left: 0, top: 0 };
      ox = rect.left - containerRect.left;
      oy = rect.top - containerRect.top;
      dragged = false;
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    };
    const onMove = (e: MouseEvent) => {
      e.preventDefault();
      dragged = true;
      const nx = ox + (e.clientX - sx);
      const ny = oy + (e.clientY - sy);
      el.style.left = nx + "px";
      el.style.top = ny + "px";
    };
    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      if (dragged) {
        const nx = parseInt(el.style.left) || 0;
        const ny = parseInt(el.style.top) || 0;
        setMindMapNodes(ns => ns.map(n => n.id === nodeId ? { ...n, x: nx, y: ny } : n));
      }
    };
    el.addEventListener("mousedown", onDown);
    dragCleanups.current.set(nodeId, () => {
      el.removeEventListener("mousedown", onDown);
    });
  }, []);

  useEffect(() => {
    if (section !== "mindmap") return;
    const timer = setTimeout(() => {
      const currentIds = new Set(mindMapNodes.map(n => n.id));
      for (const [id, cleanup] of dragCleanups.current) {
        if (!currentIds.has(id)) {
          cleanup();
          dragCleanups.current.delete(id);
        }
      }
      mindMapNodes.forEach(n => {
        const el = document.getElementById(`mmnode-${n.id}`) as HTMLDivElement | null;
        if (el) initNodeDrag(el, n.id);
      });
    }, 50);
    return () => {
      clearTimeout(timer);
    };
  }, [mindMapNodes, initNodeDrag, section]);

  const handleProfilePic = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setProfilePic(reader.result as string);
    reader.readAsDataURL(file);
  };

  const deleteFile = (id: string) => {
    if (files.length <= 1) return;
    setFiles(fs => fs.filter(f => f.id !== id));
    if (activeFileId === id) setActiveFileId(files.find(f => f.id !== id)?.id || files[0].id);
    setStickersByFile(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const addVisionImage = (category: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;
    Array.from(fileList).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        setVisionImages(prev => ({
          ...prev,
          [category]: [...(prev[category] || []), { src: reader.result as string, caption: "" }],
        }));
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const removeVisionImage = (category: string, index: number) => {
    setVisionImages(prev => ({
      ...prev,
      [category]: (prev[category] || []).filter((_, i) => i !== index),
    }));
  };

  const updateVisionCaption = (category: string, index: number, caption: string) => {
    setVisionImages(prev => ({
      ...prev,
      [category]: (prev[category] || []).map((item, i) => i === index ? { ...item, caption } : item),
    }));
  };

  const allHabits = [...DEFAULT_HABITS, ...customHabits];

  const addCustomHabit = () => {
    if (!newHabitName.trim()) return;
    const id = "ch" + Math.random().toString(36).slice(2);
    setCustomHabits(prev => [...prev, { id, name: newHabitName.trim(), icon: newHabitIcon, color: newHabitColor }]);
    setNewHabitName("");
    setNewHabitIcon(HABIT_ICONS[0]);
    setNewHabitColor(HABIT_COLORS[0]);
    setShowAddHabit(false);
  };

  const deleteCustomHabit = (id: string) => {
    setCustomHabits(prev => prev.filter(h => h.id !== id));
    setHabitDays(prev => prev.map(day => ({
      ...day,
      completed: day.completed.filter(hid => hid !== id),
    })));
  };

  const quickNewEntry = () => {
    setEntryTitleText("");
    setEntryTitlePrompt(true);
  };

  const confirmNewEntry = () => {
    if (editorRef.current && activeFileId) {
      setFiles(fs => fs.map(f => f.id === activeFileId ? { ...f, content: editorRef.current!.innerHTML } : f));
    }
    const id = Date.now().toString();
    const now = new Date();
    const name = entryTitleText.trim() || "Entry " + now.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const date = now.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    setFiles(f => [...f, { id, name, date, content: `<h1 class="cy-doc-title" id="doc-title">${name}</h1>\n<p style="line-height:1.8;">Start writing your story here...</p>` }]);
    setActiveFileId(id);
    setSection("journal");
    setEntryTitlePrompt(false);
    setEntryTitleText("");
  };

  const calGetMonthDays = (year: number, month: number) => {
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const startDay = first.getDay();
    const totalDays = last.getDate();
    const days: (string | null)[] = [];
    for (let i = 0; i < startDay; i++) days.push(null);
    for (let d = 1; d <= totalDays; d++) {
      const mm = String(month + 1).padStart(2, "0");
      const dd = String(d).padStart(2, "0");
      days.push(`${year}-${mm}-${dd}`);
    }
    return days;
  };

  const calGetWeekDays = (dateStr: string) => {
    const d = new Date(dateStr + "T12:00:00");
    const day = d.getDay();
    const start = new Date(d);
    start.setDate(d.getDate() - day);
    const days: string[] = [];
    for (let i = 0; i < 7; i++) {
      const cur = new Date(start);
      cur.setDate(start.getDate() + i);
      days.push(cur.toISOString().split("T")[0]);
    }
    return days;
  };

  const calNavigate = (dir: number) => {
    const d = new Date(selectedDate + "T12:00:00");
    if (calendarView === "monthly") d.setMonth(d.getMonth() + dir);
    else if (calendarView === "weekly") d.setDate(d.getDate() + dir * 7);
    else d.setDate(d.getDate() + dir);
    setSelectedDate(d.toISOString().split("T")[0]);
  };

  const calEventsForDate = (date: string) => calendarEvents.filter(e => e.date === date);

  const calTimeToY = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    return ((h - 6) * 60 + m) * (60 / 60);
  };

  const openEventForm = (date?: string, startTime?: string) => {
    setEditingEvent(null);
    setEventForm({ title: "", date: date || selectedDate, startTime: startTime || "09:00", endTime: startTime ? `${String(Math.min(23, parseInt(startTime) + 1)).padStart(2, "0")}:00` : "10:00", color: "#e040fb", description: "", location: "", category: "General", allDay: false, image: "" });
    setShowEventForm(true);
  };

  const openEditEvent = (ev: CalendarEvent) => {
    setEditingEvent(ev);
    setEventForm({ title: ev.title, date: ev.date, startTime: ev.startTime, endTime: ev.endTime, color: ev.color, description: ev.description, location: ev.location, category: ev.category, allDay: ev.allDay, image: ev.image || "" });
    setShowEventForm(true);
  };

  const saveEvent = () => {
    if (!eventForm.title.trim()) return;
    if (editingEvent) {
      setCalendarEvents(prev => prev.map(e => e.id === editingEvent.id ? { ...editingEvent, ...eventForm } : e));
    } else {
      const newEv: CalendarEvent = { id: "ev" + Date.now(), ...eventForm };
      setCalendarEvents(prev => [...prev, newEv]);
    }
    setShowEventForm(false);
    setEditingEvent(null);
  };

  const deleteEvent = (id: string) => {
    setCalendarEvents(prev => prev.filter(e => e.id !== id));
    setShowEventForm(false);
  };

  const HOURS = Array.from({ length: 18 }, (_, i) => i + 6);

  const getTimeBlockColor = (time: string) => {
    const h = parseInt(time.split(":")[0]);
    if (h < 9) return "#b388ff";
    if (h < 12) return "#ffab40";
    if (h < 14) return "#ff4081";
    if (h < 17) return "#00e5ff";
    if (h < 20) return "#e040fb";
    return "#7c4dff";
  };

  const parseTimeToMinutes = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + (m || 0);
  };
  const minutesToTime = (mins: number) => {
    const clamped = Math.max(360, Math.min(1380, mins));
    const h = Math.floor(clamped / 60);
    const m = clamped % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  const handleEventDrop = (eventId: string, newDate: string, newStartTime?: string) => {
    setCalendarEvents(prev => prev.map(e => {
      if (e.id !== eventId) return e;
      if (!newStartTime) return { ...e, date: newDate };
      const durationMins = parseTimeToMinutes(e.endTime) - parseTimeToMinutes(e.startTime);
      const safeDuration = Math.max(60, durationMins);
      const startMins = parseTimeToMinutes(newStartTime);
      const clampedStart = Math.max(360, Math.min(1380 - safeDuration, startMins));
      return { ...e, date: newDate, startTime: minutesToTime(clampedStart), endTime: minutesToTime(clampedStart + safeDuration) };
    }));
  };

  const [dragEventId, setDragEventId] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);
  const [musicPlaylist, setMusicPlaylist] = useState<{ name: string; src: string; id?: number }[]>([]);
  const [musicTrackIndex, setMusicTrackIndex] = useState(0);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [musicVisualizerActive, setMusicVisualizerActive] = useState(false);
  const musicDbRef = useRef<IDBDatabase | null>(null);
  const musicFileRef = useRef<HTMLInputElement>(null);
  const musicUrlsRef = useRef<string[]>([]);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const vizFrameRef = useRef<number>(0);
  const vizCanvasRef = useRef<HTMLCanvasElement>(null);
  const [vizMode, setVizMode] = useState<"bars" | "circular" | "wave">("bars");
  const vizModeRef = useRef(vizMode);
  vizModeRef.current = vizMode;

  useEffect(() => {
    const req = indexedDB.open("DreamLogMusicDB", 1);
    req.onupgradeneeded = (e: any) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains("tracks")) {
        db.createObjectStore("tracks", { keyPath: "id", autoIncrement: true });
      }
    };
    req.onsuccess = (e: any) => {
      musicDbRef.current = e.target.result;
      loadMusicFromDB();
    };
    return () => {
      musicUrlsRef.current.forEach(u => URL.revokeObjectURL(u));
      musicUrlsRef.current = [];
      if (musicDbRef.current) musicDbRef.current.close();
      if (vizFrameRef.current) cancelAnimationFrame(vizFrameRef.current);
      if (audioCtxRef.current) audioCtxRef.current.close().catch(() => {});
    };
  }, []);

  const connectAudioAnalyser = () => {
    if (!audioRef.current) return;
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    if (!sourceRef.current) {
      sourceRef.current = audioCtxRef.current.createMediaElementSource(audioRef.current);
      analyserRef.current = audioCtxRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      analyserRef.current.smoothingTimeConstant = 0.8;
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioCtxRef.current.destination);
    }
  };

  const VIZ_COLORS = ["#e040fb","#ff00ff","#0aff0a","#00f3ff","#ffd740","#ff4081","#7c4dff","#00e5ff","#ff6d00","#76ff03"];

  const startVisualizerLoop = () => {
    if (vizFrameRef.current) return;
    const analyser = analyserRef.current;
    if (!analyser) return;
    const bufLen = analyser.frequencyBinCount;
    const freqData = new Uint8Array(bufLen);
    const waveData = new Uint8Array(bufLen);
    let hueShift = 0;

    const draw = () => {
      vizFrameRef.current = requestAnimationFrame(draw);
      const canvas = vizCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const W = canvas.width = canvas.offsetWidth * 2;
      const H = canvas.height = canvas.offsetHeight * 2;
      ctx.clearRect(0, 0, W, H);
      analyser.getByteFrequencyData(freqData);
      analyser.getByteTimeDomainData(waveData);
      hueShift += 0.5;

      const mode = vizModeRef.current;

      if (mode === "bars") {
        const barCount = 48;
        const barW = (W / barCount) * 0.7;
        const gap = (W / barCount) * 0.3;
        for (let i = 0; i < barCount; i++) {
          const idx = Math.floor((i / barCount) * bufLen * 0.7);
          const val = freqData[idx] / 255;
          const h = Math.max(2, val * H * 0.8);
          const ci = (i + Math.floor(hueShift / 20)) % VIZ_COLORS.length;
          const color = VIZ_COLORS[ci];
          const x = i * (barW + gap) + gap / 2;
          ctx.fillStyle = color;
          ctx.shadowColor = color;
          ctx.shadowBlur = 12 + val * 20;
          ctx.beginPath();
          ctx.roundRect(x, H / 2 - h / 2, barW, h / 2, [barW / 2, barW / 2, 0, 0]);
          ctx.fill();
          ctx.beginPath();
          ctx.roundRect(x, H / 2, barW, h / 2, [0, 0, barW / 2, barW / 2]);
          ctx.fill();
          ctx.globalAlpha = 0.25;
          ctx.beginPath();
          ctx.roundRect(x, H / 2 + h / 2 + 2, barW, h * 0.3, [0, 0, barW / 2, barW / 2]);
          ctx.fill();
          ctx.globalAlpha = 1;
          ctx.shadowBlur = 0;
        }
      } else if (mode === "circular") {
        const cx = W / 2, cy = H / 2;
        const baseR = Math.min(W, H) * 0.2;
        const segments = 64;
        for (let i = 0; i < segments; i++) {
          const val = freqData[Math.floor((i / segments) * bufLen * 0.6)] / 255;
          const angle = (i / segments) * Math.PI * 2 - Math.PI / 2;
          const r = baseR + val * baseR * 1.5;
          const x1 = cx + Math.cos(angle) * baseR * 0.7;
          const y1 = cy + Math.sin(angle) * baseR * 0.7;
          const x2 = cx + Math.cos(angle) * r;
          const y2 = cy + Math.sin(angle) * r;
          const ci = (i + Math.floor(hueShift / 10)) % VIZ_COLORS.length;
          ctx.strokeStyle = VIZ_COLORS[ci];
          ctx.shadowColor = VIZ_COLORS[ci];
          ctx.shadowBlur = 8 + val * 18;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
        ctx.shadowBlur = 0;
        ctx.strokeStyle = "rgba(224,64,251,0.3)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, baseR * 0.7, 0, Math.PI * 2);
        ctx.stroke();
        let avg = 0;
        for (let i = 0; i < bufLen; i++) avg += freqData[i];
        avg /= bufLen;
        const pulseR = baseR * 0.5 + (avg / 255) * baseR * 0.3;
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, pulseR);
        grad.addColorStop(0, `rgba(224,64,251,${0.1 + (avg / 255) * 0.2})`);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, pulseR, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.lineWidth = 3;
        const sliceW = W / bufLen;
        for (let pass = 0; pass < 2; pass++) {
          ctx.beginPath();
          for (let i = 0; i < bufLen; i++) {
            const v = waveData[i] / 128.0;
            const y = pass === 0 ? (v * H / 2) : H - (v * H / 2);
            const ci = (Math.floor(i / 8) + Math.floor(hueShift / 15)) % VIZ_COLORS.length;
            if (i === 0) ctx.moveTo(0, y);
            else ctx.lineTo(i * sliceW, y);
            ctx.strokeStyle = VIZ_COLORS[ci];
            ctx.shadowColor = VIZ_COLORS[ci];
            ctx.shadowBlur = 10;
          }
          ctx.stroke();
        }
        ctx.shadowBlur = 0;
        const grad = ctx.createLinearGradient(0, H * 0.3, 0, H * 0.7);
        grad.addColorStop(0, "rgba(224,64,251,0.03)");
        grad.addColorStop(0.5, "rgba(124,77,255,0.06)");
        grad.addColorStop(1, "rgba(224,64,251,0.03)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);
      }
    };
    draw();
  };

  const stopVisualizerLoop = () => {
    if (vizFrameRef.current) {
      cancelAnimationFrame(vizFrameRef.current);
      vizFrameRef.current = 0;
    }
    const canvas = vizCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const loadMusicFromDB = () => {
    const db = musicDbRef.current;
    if (!db) return;
    const tx = db.transaction(["tracks"], "readonly");
    const store = tx.objectStore("tracks");
    const req = store.getAll();
    req.onsuccess = () => {
      musicUrlsRef.current.forEach(u => URL.revokeObjectURL(u));
      const tracks = req.result;
      const newUrls: string[] = [];
      const list = tracks.map((t: any) => {
        const url = URL.createObjectURL(t.blob);
        newUrls.push(url);
        return { name: t.name, src: url, id: t.id };
      });
      musicUrlsRef.current = newUrls;
      setMusicPlaylist(list);
    };
  };

  const musicUploadFiles = (fileList: FileList) => {
    const db = musicDbRef.current;
    if (!db) return;
    const tx = db.transaction(["tracks"], "readwrite");
    const store = tx.objectStore("tracks");
    Array.from(fileList).forEach(file => {
      store.add({ name: file.name.replace(/\.[^/.]+$/, ""), blob: file });
    });
    tx.oncomplete = () => loadMusicFromDB();
  };

  const musicClearAll = () => {
    const db = musicDbRef.current;
    if (!db) return;
    const tx = db.transaction(["tracks"], "readwrite");
    const store = tx.objectStore("tracks");
    store.clear().onsuccess = () => {
      musicUrlsRef.current.forEach(u => URL.revokeObjectURL(u));
      musicUrlsRef.current = [];
      setMusicPlaylist([]);
      setMusicTrackIndex(0);
      setMusicPlaying(false);
      setMusicVisualizerActive(false);
      stopVisualizerLoop();
      if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ""; }
    };
  };

  const musicLoadTrack = (index: number, autoPlay = true) => {
    if (index < 0 || index >= musicPlaylist.length) return;
    setMusicTrackIndex(index);
    if (audioRef.current) {
      audioRef.current.src = musicPlaylist[index].src;
      if (autoPlay) {
        connectAudioAnalyser();
        if (audioCtxRef.current?.state === "suspended") audioCtxRef.current.resume();
        audioRef.current.play().catch(() => {
          setMusicPlaying(false);
          setMusicVisualizerActive(false);
          stopVisualizerLoop();
        });
      }
    }
  };

  const musicTogglePlay = () => {
    if (musicPlaylist.length === 0) return;
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      if (!audioRef.current.src || audioRef.current.src === window.location.href) {
        musicLoadTrack(0, true);
        return;
      }
      connectAudioAnalyser();
      if (audioCtxRef.current?.state === "suspended") audioCtxRef.current.resume();
      audioRef.current.play().catch(() => {
        setMusicPlaying(false);
        setMusicVisualizerActive(false);
        stopVisualizerLoop();
      });
    } else {
      audioRef.current.pause();
    }
  };

  const musicNext = () => {
    if (musicPlaylist.length === 0) return;
    musicLoadTrack((musicTrackIndex + 1) % musicPlaylist.length);
  };

  const musicPrev = () => {
    if (musicPlaylist.length === 0) return;
    musicLoadTrack((musicTrackIndex - 1 + musicPlaylist.length) % musicPlaylist.length);
  };

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onEnd = () => {
      if (musicPlaylist.length === 0) return;
      const next = (musicTrackIndex + 1) % musicPlaylist.length;
      musicLoadTrack(next);
    };
    const onPlay = () => {
      setMusicPlaying(true);
      setMusicVisualizerActive(true);
      if (audioCtxRef.current?.state === "suspended") audioCtxRef.current.resume();
      startVisualizerLoop();
    };
    const onPause = () => { setMusicPlaying(false); setMusicVisualizerActive(false); stopVisualizerLoop(); };
    const onError = () => { setMusicPlaying(false); setMusicVisualizerActive(false); stopVisualizerLoop(); };
    a.addEventListener("ended", onEnd);
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    a.addEventListener("error", onError);
    return () => {
      a.removeEventListener("ended", onEnd);
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("error", onError);
    };
  }, [musicTrackIndex, musicPlaylist.length]);

  const logMood = (mood: number) => {
    const today = getToday();
    setMoodEntries(prev => {
      const existing = prev.find(e => e.date === today);
      if (existing) return prev.map(e => e.date === today ? { ...e, mood, note: moodNote } : e);
      return [...prev, { date: today, mood, note: moodNote }];
    });
    setMoodNote("");
  };

  const toggleHabit = (habitId: string) => {
    const today = getToday();
    setHabitDays(prev => {
      const existing = prev.find(d => d.date === today);
      if (existing) {
        const has = existing.completed.includes(habitId);
        return prev.map(d => d.date === today ? {
          ...d,
          completed: has ? d.completed.filter(h => h !== habitId) : [...d.completed, habitId],
        } : d);
      }
      return [...prev, { date: today, completed: [habitId] }];
    });
  };

  const getStreak = (habitId: string) => {
    let streak = 0;
    const now = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const day = habitDays.find(h => h.date === dateStr);
      if (day && day.completed.includes(habitId)) streak++;
      else if (i > 0) break;
    }
    return streak;
  };

  const todayHabits = habitDays.find(d => d.date === getToday());
  const todayMood = moodEntries.find(e => e.date === getToday());

  const ICON_NAV: { icon: string; title: string; section: Section }[] = [
    { icon: "fa-solid fa-gauge-high",     title: "Dashboard", section: "dashboard" },
    { icon: "fa-solid fa-user-astronaut", title: "Profile",  section: "profile" },
    { icon: "fa-solid fa-wand-magic-sparkles", title: "Manifest", section: "vision" },
    { icon: "fa-solid fa-images",        title: "Board",    section: "vboard" },
    { icon: "fa-solid fa-book-open",     title: "Journal",  section: "journal" },
    { icon: "fa-solid fa-bullseye",      title: "Goals",    section: "goals" },
    { icon: "fa-solid fa-diagram-project", title: "Mind Map", section: "mindmap" },
    { icon: "fa-solid fa-face-smile",     title: "Mood",     section: "mood" },
    { icon: "fa-solid fa-fire",           title: "Habits",   section: "habits" },
    { icon: "fa-solid fa-calendar-days",  title: "Calendar", section: "calendar" },
    { icon: "fa-solid fa-wallet",         title: "Budget",   section: "budget" },
    { icon: "fa-solid fa-headphones",     title: "Music",    section: "music" },
  ];

  return (
    <div className={`cyber-app${sidebarOpen ? "" : " sidebar-collapsed"}${cursorGlow ? " cursor-glow" : ""}`} data-cyber-theme={theme}
      style={accentColor ? { "--cy-accent-custom": accentColor } as React.CSSProperties : undefined}
    >
      {crtEnabled && <div className="crt-overlay" />}

      {showAffirmation && (
        <div className="cy-affirmation-overlay" data-testid="affirmation-popup">
          <div className="cy-affirmation-card">
            <div className="cy-affirmation-sparkle">✨</div>
            <div className="cy-affirmation-title">Good Morning, Beautiful Soul</div>
            <div className="cy-affirmation-text">{dailyAffirmation}</div>
            <button className="cy-affirmation-close" onClick={() => setShowAffirmation(false)} data-testid="affirmation-close">
              <i className="fa-solid fa-heart" style={{ marginRight: 8 }} />
              Let's Go!
            </button>
          </div>
        </div>
      )}

      {entryTitlePrompt && (
        <div className="cy-affirmation-overlay" data-testid="entry-title-overlay">
          <div className="cy-affirmation-card" style={{ maxWidth: 380 }}>
            <div className="cy-affirmation-sparkle">📝</div>
            <div className="cy-affirmation-title">Name Your Entry</div>
            <input className="cy-input" placeholder="My thoughts on..." value={entryTitleText}
              onChange={e => setEntryTitleText(e.target.value)}
              onKeyDown={e => e.key === "Enter" && confirmNewEntry()}
              autoFocus style={{ marginBottom: 16, textAlign: "center" }}
              data-testid="entry-title-input" />
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button className="cy-affirmation-close" onClick={confirmNewEntry} data-testid="entry-title-confirm">
                <i className="fa-solid fa-plus" style={{ marginRight: 6 }} />Create
              </button>
              <button className="cy-back-btn" onClick={() => setEntryTitlePrompt(false)} data-testid="entry-title-cancel">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ICON BAR */}
      <div className="cy-icon-bar">
        <button className="cy-icon-btn cy-sidebar-icon-toggle" title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          onClick={() => setSidebarOpen(v => !v)} data-testid="sidebar-icon-toggle">
          <i className={`fa-solid ${sidebarOpen ? "fa-angles-left" : "fa-angles-right"}`} />
        </button>
        {ICON_NAV.map(n => (
          <button
            key={n.section}
            className={`cy-icon-btn${section === n.section ? " active" : ""}`}
            title={n.title}
            data-testid={`nav-${n.section}`}
            onClick={() => { if (n.section === "journal") { quickNewEntry(); } else { setSection(n.section); } }}
          >
            <i className={n.icon} />
          </button>
        ))}
        <div className="cy-icon-spacer" />
        <button className="cy-icon-btn" title="Print / Export" onClick={() => window.print()} data-testid="nav-print">
          <i className="fa-solid fa-print" />
        </button>
        <button
          className={`cy-icon-btn${section === "settings" ? " active" : ""}`}
          title="Settings"
          onClick={() => setSection("settings")}
          data-testid="nav-settings"
        >
          <i className="fa-solid fa-palette" />
        </button>
      </div>

      {/* FILE NAV */}
      <nav className="cy-file-nav">
        <div className="cy-brand">
          <i className="fa-solid fa-sparkles" style={{ WebkitTextFillColor: "unset" }} />
          <span>Glow Up</span>
          <span className="cy-brand-version">v2</span>
          <button className="cy-sidebar-toggle" onClick={() => setSidebarOpen(v => !v)}
            title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"} data-testid="sidebar-toggle">
            <i className={`fa-solid ${sidebarOpen ? "fa-chevron-left" : "fa-chevron-right"}`} />
          </button>
        </div>

        <div className="cy-nav-scroll">
          <div className="cy-nav-group cy-user-info">
            <div className="cy-user-row">
              <i className="fa-solid fa-circle-user" />
              <span className="cy-user-name" data-testid="text-username">{user.username}</span>
              <button className="cy-logout-btn" onClick={async () => {
                await fetch("/api/auth/logout", { method: "POST" });
                onLogout();
              }} title="Sign Out" data-testid="btn-logout">
                <i className="fa-solid fa-right-from-bracket" />
              </button>
            </div>
          </div>
          <div className="cy-nav-group">
            <label>VIBE / THEME</label>
            <select className="cy-select" value={theme} onChange={e => setTheme(e.target.value)} data-testid="select-theme">
              <optgroup label="Dark Themes">
                {THEMES.filter(t => !t.light).map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
              </optgroup>
              <optgroup label="Light Themes">
                {THEMES.filter(t => t.light).map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
              </optgroup>
            </select>
          </div>

          <div className="cy-nav-group">
            <div className="cy-section-title">
              <span>MY ENTRIES</span>
              <button className="cy-add-btn" title="New Entry" onClick={quickNewEntry} data-testid="button-add-file">
                <i className="fa-solid fa-circle-plus" />
              </button>
            </div>
            <ul className="cy-file-list">
              {files.map(f => (
                <li key={f.id} className={`cy-file-item${f.id === activeFileId ? " active" : ""}`}
                  data-testid={`file-item-${f.id}`}
                >
                  <div style={{ flex: 1, cursor: "pointer" }} onClick={() => { selectFile(f.id); setSection("journal"); }}>
                    {f.name}
                    <span className="cy-file-date">{f.date}</span>
                  </div>
                  {files.length > 1 && (
                    <button className="cy-file-delete" onClick={(e) => { e.stopPropagation(); deleteFile(f.id); }}
                      title="Delete entry" data-testid={`file-delete-${f.id}`}
                    >
                      <i className="fa-solid fa-xmark" />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="cy-nav-group">
            <label>CANVAS</label>
            <div className="cy-swatch-grid" data-testid="canvas-swatches">
              {[
                { id: "canvas-default", label: "Default", bg: "linear-gradient(135deg, #1a1a2e, #16213e)" },
                { id: "canvas-tinted", label: "Tinted", bg: "linear-gradient(135deg, #1a1028, #0d1a2d)" },
                { id: "canvas-blueprint", label: "Gradient", bg: "linear-gradient(135deg, #0d47a1, #1a237e)" },
                { id: "canvas-void", label: "Deep", bg: "linear-gradient(135deg, #000, #0a0a14)" },
                { id: "canvas-neon", label: "Glow", bg: "linear-gradient(135deg, #0a0014, #1a0028)" },
                { id: "canvas-dreamy", label: "Dreamy", bg: "linear-gradient(135deg, #1a0028, #0d1a3d)" },
                { id: "canvas-starfield", label: "Stars", bg: "linear-gradient(135deg, #000010, #0a0020)" },
                { id: "canvas-aurora", label: "Aurora", bg: "linear-gradient(135deg, #001a0a, #0a0028)" },
                { id: "canvas-soft", label: "Soft", bg: "linear-gradient(135deg, #1a1a24, #141420)" },
                { id: "canvas-minimal", label: "Minimal", bg: "linear-gradient(135deg, #121218, #1a1a22)" },
                { id: "canvas-prism", label: "Prism", bg: "linear-gradient(60deg, #1a0028, #001a2d, #1a0020)" },
                { id: "canvas-nebula", label: "Nebula", bg: "radial-gradient(ellipse at 30% 40%, #1a0040, #0a0020)" },
                { id: "canvas-ember", label: "Ember", bg: "linear-gradient(180deg, #0a0014, #1a0800)" },
                { id: "canvas-frost", label: "Frost", bg: "linear-gradient(180deg, #0a1a24, #0a0018)" },
                { id: "canvas-twilight", label: "Twilight", bg: "linear-gradient(180deg, #0a0028, #1a0830, #1a0a00)" },
              ].map(c => (
                <button key={c.id} className={`cy-swatch-btn${canvasMode === c.id ? " active" : ""}`}
                  style={{ background: c.bg }}
                  onClick={() => setCanvasMode(c.id)}
                  title={c.label} data-testid={`swatch-${c.id}`}
                >
                  {canvasMode === c.id && <i className="fa-solid fa-check" />}
                  <span className="cy-swatch-label">{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="cy-nav-group">
            <label>PAPER</label>
            <div className="cy-swatch-grid" data-testid="paper-swatches">
              {[
                { id: "paper-stars", label: "Stars", icon: "fa-solid fa-star" },
                { id: "paper-hearts", label: "Hearts", icon: "fa-solid fa-heart" },
                { id: "paper-grid", label: "Grid", icon: "fa-solid fa-border-all" },
                { id: "paper-dots", label: "Dots", icon: "fa-solid fa-braille" },
                { id: "paper-lines", label: "Lined", icon: "fa-solid fa-bars" },
                { id: "paper-blank", label: "Blank", icon: "fa-solid fa-square" },
                { id: "paper-diamonds", label: "Diamonds", icon: "fa-solid fa-diamond" },
                { id: "paper-waves", label: "Waves", icon: "fa-solid fa-water" },
                { id: "paper-confetti", label: "Confetti", icon: "fa-solid fa-burst" },
                { id: "paper-floral", label: "Floral", icon: "fa-solid fa-seedling" },
                { id: "paper-crosshatch", label: "Crosshatch", icon: "fa-solid fa-hashtag" },
                { id: "paper-hexagons", label: "Hexagons", icon: "fa-solid fa-hexagon-check" },
                { id: "paper-raindrops", label: "Raindrops", icon: "fa-solid fa-droplet" },
                { id: "paper-spirals", label: "Spirals", icon: "fa-solid fa-circle-notch" },
                { id: "paper-moonlight", label: "Moonlight", icon: "fa-solid fa-moon" },
              ].map(p => (
                <button key={p.id} className={`cy-swatch-btn cy-swatch-paper${paperPattern === p.id ? " active" : ""}`}
                  onClick={() => setPaperPattern(p.id)}
                  title={p.label} data-testid={`swatch-${p.id}`}
                >
                  <i className={p.icon} />
                  <span className="cy-swatch-label">{p.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* MAIN STAGE */}
      <main className={`cy-main-stage ${canvasMode}`}>

        {/* DASHBOARD */}
        {section === "dashboard" && (() => {
          const today = getToday();
          const todayEvents = calendarEvents.filter(e => e.date === today);
          const allHabits = [...DEFAULT_HABITS, ...customHabits];
          const todayHabitDay = habitDays.find(d => d.date === today);
          const habitsCompletedToday = todayHabitDay ? todayHabitDay.completed.length : 0;
          const totalHabits = allHabits.length;
          const goalsDone = goals.filter(g => g.progress >= 100).length;
          const goalsInProgress = goals.filter(g => g.progress > 0 && g.progress < 100).length;
          const avgGoalProgress = goals.length > 0 ? Math.round(goals.reduce((a, g) => a + g.progress, 0) / goals.length) : 0;
          const moodToday = moodEntries.find(e => e.date === today);
          const moodEmojis = ["😢", "😔", "😐", "😊", "🤩"];
          const last7 = Array.from({ length: 7 }, (_, i) => {
            const d = new Date(); d.setDate(d.getDate() - (6 - i));
            return d.toISOString().split("T")[0];
          });
          const streakDays = (() => {
            let streak = 0;
            const d = new Date();
            while (true) {
              const ds = d.toISOString().split("T")[0];
              const hd = habitDays.find(h => h.date === ds);
              if (hd && hd.completed.length > 0) { streak++; d.setDate(d.getDate() - 1); }
              else break;
            }
            return streak;
          })();
          const journalCount = files.length;
          const DASH_QUOTES = [
            "She believed she could, so she did.",
            "You are made of starlight and magic.",
            "The glow up is an inside job.",
            "Be the energy you want to attract.",
            "Your only limit is your mind.",
            "Main character energy, always.",
            "Good things are coming. Keep going.",
            "You didn't come this far to only come this far.",
            "Sparkle more, worry less.",
            "Today is a great day to glow up.",
          ];
          const quoteOfDay = DASH_QUOTES[Math.floor(new Date().getDate() % DASH_QUOTES.length)];
          const dashVisionImg = (visionImages["board"] || [])[0]?.src || null;
          return (
            <div className="cy-section">
              <div className="cy-page-header">
                <div className="cy-page-header-row">
                  <div>
                    <div className="cy-page-title"><i className="fa-solid fa-gauge-high" style={{ marginRight: 10 }} />Dashboard</div>
                    <div className="cy-page-subtitle">Your Daily Overview ~ {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</div>
                  </div>
                </div>
              </div>
              <div className="cy-page-body">

                <div className="cy-dash-hero" data-testid="dash-hero">
                  <div className="cy-dash-hero-glow" />
                  <div className="cy-dash-hero-content">
                    <div className="cy-dash-hero-greeting">
                      {new Date().getHours() < 12 ? "Good Morning" : new Date().getHours() < 17 ? "Good Afternoon" : "Good Evening"}{identity.name ? `, ${identity.name}` : ""}
                    </div>
                    <div className="cy-dash-hero-quote" data-testid="dash-quote">
                      <i className="fa-solid fa-quote-left" style={{ fontSize: 12, opacity: 0.4, marginRight: 8 }} />
                      {quoteOfDay}
                    </div>
                  </div>
                  {dashVisionImg && (
                    <div className="cy-dash-hero-vision" onClick={() => setSection("vboard")} data-testid="dash-vision-img">
                      <img src={dashVisionImg} alt="Vision Board" />
                      <div className="cy-dash-hero-vision-label"><i className="fa-solid fa-eye" style={{ marginRight: 4 }} />My Vision</div>
                    </div>
                  )}
                </div>

                <div className="cy-dash-stats-card" data-testid="dash-stats">
                  <div className="cy-dash-stats-grid">
                    <div className="cy-dash-stat-card" onClick={() => setSection("journal")} data-testid="dash-stat-journal">
                      <div className="cy-dash-stat-icon" style={{ background: "rgba(224,64,251,0.15)", color: "#e040fb" }}>
                        <i className="fa-solid fa-book-open" />
                      </div>
                      <div className="cy-dash-stat-value">{journalCount}</div>
                      <div className="cy-dash-stat-label">Journal Entries</div>
                    </div>
                    <div className="cy-dash-stat-card" onClick={() => setSection("goals")} data-testid="dash-stat-goals">
                      <div className="cy-dash-stat-icon" style={{ background: "rgba(105,240,174,0.15)", color: "#69f0ae" }}>
                        <i className="fa-solid fa-bullseye" />
                      </div>
                      <div className="cy-dash-stat-value">{goalsDone}<span className="cy-dash-stat-sub">/{goals.length}</span></div>
                      <div className="cy-dash-stat-label">Goals Complete</div>
                    </div>
                    <div className="cy-dash-stat-card" onClick={() => setSection("habits")} data-testid="dash-stat-habits">
                      <div className="cy-dash-stat-icon" style={{ background: "rgba(0,229,255,0.15)", color: "#00e5ff" }}>
                        <i className="fa-solid fa-fire" />
                      </div>
                      <div className="cy-dash-stat-value">{streakDays}</div>
                      <div className="cy-dash-stat-label">Day Streak</div>
                    </div>
                    <div className="cy-dash-stat-card" onClick={() => setSection("mood")} data-testid="dash-stat-mood">
                      <div className="cy-dash-stat-icon" style={{ background: "rgba(255,64,129,0.15)", color: "#ff4081" }}>
                        <i className="fa-solid fa-face-smile" />
                      </div>
                      <div className="cy-dash-stat-value">{moodToday ? moodEmojis[moodToday.mood - 1] : "—"}</div>
                      <div className="cy-dash-stat-label">Today's Mood</div>
                    </div>
                  </div>
                </div>

                <div className="cy-dash-grid">
                  <div className="cy-dash-card" data-testid="dash-today-events">
                    <div className="cy-dash-card-header">
                      <i className="fa-solid fa-calendar-day" style={{ marginRight: 8 }} />Today's Schedule
                      <span className="cy-badge cy-badge-online" style={{ fontSize: 9, marginLeft: "auto" }}>{todayEvents.length}</span>
                    </div>
                    <div className="cy-dash-card-body">
                      {todayEvents.length === 0 ? (
                        <div className="cy-dash-empty">No events today — enjoy a free day!</div>
                      ) : (
                        todayEvents.slice(0, 5).map(ev => (
                          <div key={ev.id} className="cy-dash-event-item"
                            onClick={() => { setSection("calendar"); setSelectedDate(today); }}
                            data-testid={`dash-event-${ev.id}`}
                          >
                            <div className="cy-dash-event-dot" style={{ background: ev.color }} />
                            <div className="cy-dash-event-info">
                              <div className="cy-dash-event-title">{ev.title}</div>
                              <div className="cy-dash-event-time">{ev.allDay ? "All Day" : `${ev.startTime} – ${ev.endTime}`}</div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="cy-dash-card" data-testid="dash-habits-today">
                    <div className="cy-dash-card-header">
                      <i className="fa-solid fa-check-double" style={{ marginRight: 8 }} />Habits Today
                      <span className="cy-badge cy-badge-online" style={{ fontSize: 9, marginLeft: "auto" }}>{habitsCompletedToday}/{totalHabits}</span>
                    </div>
                    <div className="cy-dash-card-body">
                      {allHabits.map(h => {
                        const done = todayHabitDay?.completed.includes(h.id);
                        return (
                          <div key={h.id} className={`cy-dash-habit-item${done ? " done" : ""}`} data-testid={`dash-habit-${h.id}`}>
                            <i className={h.icon} style={{ color: h.color, marginRight: 8, fontSize: 14 }} />
                            <span>{h.name}</span>
                            {done && <i className="fa-solid fa-circle-check" style={{ marginLeft: "auto", color: "#69f0ae", fontSize: 14 }} />}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="cy-dash-card" data-testid="dash-goals-progress">
                    <div className="cy-dash-card-header">
                      <i className="fa-solid fa-bullseye" style={{ marginRight: 8 }} />Goal Progress
                      <span className="cy-badge cy-badge-warn" style={{ fontSize: 9, marginLeft: "auto" }}>AVG {avgGoalProgress}%</span>
                    </div>
                    <div className="cy-dash-card-body">
                      {goals.length === 0 ? (
                        <div className="cy-dash-empty">No goals yet — set one to get started!</div>
                      ) : (
                        goals.slice(0, 5).map(g => {
                          const barColor = g.progress >= 70 ? "#69f0ae" : g.progress >= 40 ? "#ffd740" : "#ff4081";
                          return (
                            <div key={g.id} className="cy-dash-goal-item"
                              onClick={() => { setSection("goals"); setExpandedGoal(g.id); }}
                              data-testid={`dash-goal-${g.id}`}
                            >
                              <div className="cy-dash-goal-name">{g.name}</div>
                              <div className="cy-dash-goal-bar">
                                <div className="cy-dash-goal-fill" style={{ width: `${g.progress}%`, background: barColor }} />
                              </div>
                              <span className="cy-dash-goal-pct" style={{ color: barColor }}>{g.progress}%</span>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  <div className="cy-dash-card" data-testid="dash-mood-week">
                    <div className="cy-dash-card-header">
                      <i className="fa-solid fa-chart-line" style={{ marginRight: 8 }} />Mood This Week
                    </div>
                    <div className="cy-dash-card-body">
                      <div className="cy-dash-mood-week">
                        {last7.map(d => {
                          const entry = moodEntries.find(e => e.date === d);
                          const dayLabel = new Date(d + "T12:00:00").toLocaleDateString("en-US", { weekday: "short" });
                          return (
                            <div key={d} className="cy-dash-mood-day" data-testid={`dash-mood-${d}`}>
                              <div className="cy-dash-mood-emoji">{entry ? moodEmojis[entry.mood - 1] : "·"}</div>
                              <div className="cy-dash-mood-label">{dayLabel}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="cy-dash-card" data-testid="dash-recent-entries">
                    <div className="cy-dash-card-header">
                      <i className="fa-solid fa-clock-rotate-left" style={{ marginRight: 8 }} />Recent Entries
                    </div>
                    <div className="cy-dash-card-body">
                      {files.slice(0, 5).map(f => (
                        <div key={f.id} className="cy-dash-entry-item"
                          onClick={() => { selectFile(f.id); setSection("journal"); }}
                          data-testid={`dash-entry-${f.id}`}
                        >
                          <i className="fa-solid fa-file-lines" style={{ color: "var(--cy-primary)", marginRight: 8, fontSize: 12 }} />
                          <span className="cy-dash-entry-name">{f.name}</span>
                          <span className="cy-dash-entry-date">{f.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="cy-dash-card" data-testid="dash-vision-card">
                    <div className="cy-dash-card-header">
                      <i className="fa-solid fa-eye" style={{ marginRight: 8 }} />Vision Board
                    </div>
                    <div className="cy-dash-card-body">
                      {dashVisionImg ? (
                        <div className="cy-dash-vision-preview" onClick={() => setSection("vboard")} data-testid="dash-vision-link">
                          <img src={dashVisionImg} alt="Vision" />
                          <div className="cy-dash-vision-overlay">
                            <span>View Board</span>
                          </div>
                        </div>
                      ) : (
                        <div className="cy-dash-empty-vision" onClick={() => setSection("vboard")} data-testid="dash-vision-empty">
                          <i className="fa-solid fa-image" />
                          <span>Add your first vision board image</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="cy-dash-card" data-testid="dash-quick-actions">
                    <div className="cy-dash-card-header">
                      <i className="fa-solid fa-bolt" style={{ marginRight: 8 }} />Quick Actions
                    </div>
                    <div className="cy-dash-card-body">
                      <div className="cy-dash-actions">
                        <button className="cy-dash-action-btn" onClick={quickNewEntry} data-testid="dash-action-journal">
                          <i className="fa-solid fa-pen" /><span>New Entry</span>
                        </button>
                        <button className="cy-dash-action-btn" onClick={() => { setSection("goals"); setShowGoalForm(true); }} data-testid="dash-action-goal">
                          <i className="fa-solid fa-bullseye" /><span>New Goal</span>
                        </button>
                        <button className="cy-dash-action-btn" onClick={() => setSection("mood")} data-testid="dash-action-mood">
                          <i className="fa-solid fa-face-smile" /><span>Log Mood</span>
                        </button>
                        <button className="cy-dash-action-btn" onClick={() => setSection("habits")} data-testid="dash-action-habits">
                          <i className="fa-solid fa-fire" /><span>Track Habits</span>
                        </button>
                        <button className="cy-dash-action-btn" onClick={() => { setSection("calendar"); setShowEventForm(true); }} data-testid="dash-action-event">
                          <i className="fa-solid fa-calendar-plus" /><span>Add Event</span>
                        </button>
                        <button className="cy-dash-action-btn" onClick={() => setSection("mindmap")} data-testid="dash-action-mindmap">
                          <i className="fa-solid fa-diagram-project" /><span>Mind Map</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          );
        })()}

        {/* JOURNAL */}
        {section === "journal" && (
          <div className="cy-section">
            <div className="cy-print-title" data-testid="print-title">{activeFile.name}</div>
            <div className="cy-toolbar" onMouseDown={saveSelection}>
              <div className="cy-tool-group">
                {[
                  { cmd: "bold", icon: "fa-solid fa-bold", title: "Bold" },
                  { cmd: "italic", icon: "fa-solid fa-italic", title: "Italic" },
                  { cmd: "underline", icon: "fa-solid fa-underline", title: "Underline" },
                  { cmd: "strikeThrough", icon: "fa-solid fa-strikethrough", title: "Strike" },
                ].map(b => (
                  <button key={b.cmd} className="cy-tool-btn" title={b.title} onClick={() => formatDoc(b.cmd)} data-testid={`btn-format-${b.cmd}`}>
                    <i className={b.icon} />
                  </button>
                ))}
              </div>

              <select className="cy-tool-select" style={{ width: 130 }}
                onChange={e => { setFontChoice(e.target.value); formatDoc("fontName", e.target.value); }}
                value={fontChoice} data-testid="select-font"
              >
                <option value="Nunito">Nunito</option>
                <option value="Quicksand">Quicksand</option>
                <option value="Comfortaa">Comfortaa</option>
                <option value="Poppins">Poppins</option>
                <option value="Fredoka">Fredoka</option>
                <option value="Caveat">Handwritten</option>
                <option value="Dancing Script">Calligraphy</option>
                <option value="Indie Flower">Doodle</option>
                <option value="Satisfy">Script</option>
                <option value="Amatic SC">Tall</option>
                <option value="Sacramento">Elegant</option>
                <option value="Kalam">Brush</option>
                <option value="Patrick Hand">Casual</option>
                <option value="Architects Daughter">Architect</option>
                <option value="Shadows Into Light">Dreamy</option>
                <option value="Righteous">Retro</option>
                <option value="Pacifico">Pacifico</option>
                <option value="Lobster">Lobster</option>
                <option value="Gloria Hallelujah">Hallelujah</option>
                <option value="Permanent Marker">Marker</option>
                <option value="Reenie Beanie">Scribble</option>
                <option value="Josefin Sans">Josefin</option>
                <option value="Raleway">Raleway</option>
                <option value="Playfair Display">Playfair</option>
                <option value="Montserrat">Montserrat</option>
                <option value="Lora">Lora</option>
              </select>

              <select className="cy-tool-select" style={{ width: 90 }}
                onChange={e => {
                  const v = e.target.value;
                  if (v === "p") { formatDoc("formatBlock", "p"); }
                  else { formatDoc("formatBlock", v); }
                }}
                defaultValue="p" data-testid="select-heading"
              >
                <option value="p">Normal</option>
                <option value="h1">Title</option>
                <option value="h2">Heading</option>
                <option value="h3">Subheading</option>
              </select>

              <select className="cy-tool-select" style={{ width: 60 }}
                onChange={e => { formatDoc("fontSize", e.target.value); }}
                defaultValue="3" data-testid="select-fontsize"
              >
                <option value="1">8</option>
                <option value="2">10</option>
                <option value="3">12</option>
                <option value="4">14</option>
                <option value="5">18</option>
                <option value="6">24</option>
                <option value="7">32</option>
              </select>

              <div className="cy-tool-group cy-tool-color-group">
                <label className="cy-tool-btn cy-tool-color-wrap" title="Text Color" data-testid="btn-text-color">
                  <i className="fa-solid fa-font" />
                  <span className="cy-tool-color-bar" style={{ background: textColorChoice }} />
                  <input type="color" value={textColorChoice}
                    onChange={e => { setTextColorChoice(e.target.value); formatDoc("foreColor", e.target.value); }}
                    data-testid="input-text-color"
                  />
                </label>
                <label className="cy-tool-btn cy-tool-color-wrap" title="Highlight Color" data-testid="btn-highlight-color">
                  <i className="fa-solid fa-highlighter" />
                  <span className="cy-tool-color-bar" style={{ background: highlightColorChoice }} />
                  <input type="color" value={highlightColorChoice}
                    onChange={e => { setHighlightColorChoice(e.target.value); formatDoc("hiliteColor", e.target.value); }}
                    data-testid="input-highlight-color"
                  />
                </label>
              </div>

              <div className="cy-tool-group">
                {[
                  { cmd: "justifyLeft", icon: "fa-solid fa-align-left", title: "Left" },
                  { cmd: "justifyCenter", icon: "fa-solid fa-align-center", title: "Center" },
                  { cmd: "justifyRight", icon: "fa-solid fa-align-right", title: "Right" },
                ].map(b => (
                  <button key={b.cmd} className="cy-tool-btn" title={b.title} onClick={() => formatDoc(b.cmd)} data-testid={`btn-align-${b.cmd}`}>
                    <i className={b.icon} />
                  </button>
                ))}
              </div>

              <div className="cy-tool-group">
                {[
                  { cmd: "insertUnorderedList", icon: "fa-solid fa-list-ul", title: "Bullets" },
                  { cmd: "insertOrderedList", icon: "fa-solid fa-list-ol", title: "Numbers" },
                ].map(b => (
                  <button key={b.cmd} className="cy-tool-btn" title={b.title} onClick={() => formatDoc(b.cmd)} data-testid={`btn-list-${b.cmd}`}>
                    <i className={b.icon} />
                  </button>
                ))}
                <button className="cy-tool-btn" title="Quote / Side Bar" data-testid="btn-quote"
                  onClick={() => {
                    const sel = window.getSelection();
                    if (sel && sel.rangeCount > 0) {
                      const range = sel.getRangeAt(0);
                      const div = document.createElement("div");
                      div.className = "cy-quote-block";
                      if (range.toString().trim()) {
                        range.surroundContents(div);
                      } else {
                        div.innerHTML = "<br>";
                        range.insertNode(div);
                        range.selectNodeContents(div);
                        sel.removeAllRanges();
                        sel.addRange(range);
                      }
                    }
                  }}>
                  <i className="fa-solid fa-grip-lines-vertical" />
                </button>
                <button className="cy-tool-btn" title="Highlight Bar" data-testid="btn-highlight-bar"
                  onClick={() => {
                    const sel = window.getSelection();
                    if (sel && sel.rangeCount > 0) {
                      const range = sel.getRangeAt(0);
                      const div = document.createElement("div");
                      div.className = "cy-highlight-bar";
                      if (range.toString().trim()) {
                        range.surroundContents(div);
                      } else {
                        div.innerHTML = "<br>";
                        range.insertNode(div);
                        range.selectNodeContents(div);
                        sel.removeAllRanges();
                        sel.addRange(range);
                      }
                    }
                  }}>
                  <i className="fa-solid fa-minus" style={{ transform: "rotate(90deg)" }} />
                </button>
              </div>

              <button className="cy-glitch-btn" onClick={triggerGlitch} data-testid="btn-glitch">
                <i className="fa-solid fa-wand-magic-sparkles" style={{ marginRight: 5 }} />SPARKLE
              </button>

              <button className="cy-asset-toggle" onClick={() => setAssetOpen(v => !v)} data-testid="btn-assets">
                <i className="fa-solid fa-palette" /> STICKERS
              </button>
              <button className="cy-asset-toggle" onClick={() => setNotesPanelOpen(v => !v)} data-testid="btn-notes" style={{ marginLeft: 6 }}>
                <i className="fa-solid fa-note-sticky" /> NOTES
              </button>
            </div>

            {notesPanelOpen && (
              <div className="cy-notes-panel" data-testid="notes-panel">
                <div className="cy-notes-panel-title">Add a Note</div>
                <div className="cy-notes-color-grid">
                  {NOTE_STYLES.map(n => (
                    <button key={n.type} className={`cy-note-color-btn ${n.cls}`}
                      onClick={() => { addSticker(n.type); setNotesPanelOpen(false); }}
                      data-testid={`note-btn-${n.type}`}
                    >{n.label}</button>
                  ))}
                </div>
                <div className="cy-notes-media-row">
                  <button className="cy-quick-add-btn" onClick={() => noteImageRef.current?.click()} data-testid="note-upload-image">
                    <i className="fa-solid fa-image" style={{ marginRight: 4 }} />Image Note
                  </button>
                  <button className="cy-quick-add-btn" onClick={() => noteVideoRef.current?.click()} data-testid="note-upload-video">
                    <i className="fa-solid fa-video" style={{ marginRight: 4 }} />Video Note
                  </button>
                  <input type="file" accept="image/*" ref={noteImageRef} style={{ display: "none" }}
                    onChange={e => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      const reader = new FileReader();
                      const tgt: "journal" | "mindmap" | "calendar" = section === "mindmap" ? "mindmap" : section === "calendar" ? "calendar" : "journal";
                      reader.onload = () => { addSticker("note-image-" + reader.result, tgt); setNotesPanelOpen(false); };
                      reader.readAsDataURL(f);
                      e.target.value = "";
                    }}
                  />
                  <input type="file" accept="video/*" ref={noteVideoRef} style={{ display: "none" }}
                    onChange={e => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      const reader = new FileReader();
                      const tgt: "journal" | "mindmap" | "calendar" = section === "mindmap" ? "mindmap" : section === "calendar" ? "calendar" : "journal";
                      reader.onload = () => { addSticker("note-video-" + reader.result, tgt); setNotesPanelOpen(false); };
                      reader.readAsDataURL(f);
                      e.target.value = "";
                    }}
                  />
                </div>
              </div>
            )}

            <div className="cy-editor-wrap" style={{ position: "relative" }}>
              <div className="cy-sticker-layer">
                {stickers.map(st => (
                  <div key={st.id} id={`sticker-${st.id}`} className="cy-sticker"
                    style={{ left: st.x, top: st.y, transform: `rotate(${st.rotation}deg) scale(${st.scale || 1})` }}
                    data-testid={`sticker-${st.id}`}
                  >
                    <div dangerouslySetInnerHTML={{ __html: getStickerContent(st.type) }} />
                    <div className="cy-sticker-controls">
                      <button className="cy-sticker-resize" onClick={() => resizeSticker(st.id, 0.15)} title="Bigger" data-testid={`sticker-grow-${st.id}`}>
                        <i className="fa-solid fa-plus" />
                      </button>
                      <button className="cy-sticker-resize" onClick={() => resizeSticker(st.id, -0.15)} title="Smaller" data-testid={`sticker-shrink-${st.id}`}>
                        <i className="fa-solid fa-minus" />
                      </button>
                      <button className="cy-sticker-delete" onClick={() => removeSticker(st.id)} title="Remove" data-testid={`sticker-remove-${st.id}`}>
                        <i className="fa-solid fa-xmark" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div ref={editorRef} contentEditable suppressContentEditableWarning
                className={`cy-active-page ${paperPattern} ${glitching ? "glitch-anim" : ""} ${borderStyle !== "default" ? `border-${borderStyle}` : ""}`}
                style={{ fontSize: editorFontSize }}
                onMouseUp={saveSelection}
                onKeyUp={saveSelection}
                data-testid="editor-page"
              />
            </div>

            <div className="cy-terminal">
              <div className="cy-terminal-header">
                <span>AFFIRMATION BAR</span>
                <div className="cy-terminal-dots">
                  <div className="cy-terminal-dot" style={{ background: "#ff4081" }} />
                  <div className="cy-terminal-dot" style={{ background: "#ffd740" }} />
                  <div className="cy-terminal-dot" style={{ background: "#69f0ae" }} />
                </div>
              </div>
              <div className="cy-terminal-output" ref={termOutputRef}>
                {terminalLines.map((line, i) => (
                  <div key={i} className={`cy-log-line ${line.cls}`}>{line.text}</div>
                ))}
              </div>
              <div className="cy-terminal-input-row">
                <span className="cy-prompt"><i className="fa-solid fa-heart" /></span>
                <input className="cy-term-input" type="text" autoComplete="off" spellCheck={false}
                  value={termCmd} onChange={e => setTermCmd(e.target.value)} onKeyDown={handleTerminal}
                  placeholder="type a command..." data-testid="terminal-input"
                />
              </div>
            </div>
          </div>
        )}

        {/* PROFILE */}
        {section === "profile" && (
          <div className="cy-section">
            <div className="cy-page-header">
              <div className="cy-page-header-row">
                <div>
                  <div className="cy-page-title">My Profile</div>
                  <div className="cy-page-subtitle">Who I Am & Who I'm Becoming</div>
                </div>
                <button className="cy-quick-add-btn" onClick={quickNewEntry} data-testid="quick-add-profile">
                  <i className="fa-solid fa-plus" />New Entry
                </button>
              </div>
            </div>
            <div className="cy-page-body">
              <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                <div className="cy-identity-card" style={{ flex: "1", minWidth: 280 }}>
                  <input type="file" accept="image/*" ref={profilePicRef} style={{ display: "none" }}
                    onChange={handleProfilePic} data-testid="input-profile-pic" />
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 20 }}>
                    <div className="cy-identity-avatar" onClick={() => profilePicRef.current?.click()}
                      style={{ cursor: "pointer", overflow: "hidden" }} title="Click to upload photo"
                      data-testid="profile-avatar"
                    >
                      {profilePic ? (
                        <img src={profilePic} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
                      ) : (
                        <i className="fa-solid fa-user-astronaut" />
                      )}
                    </div>
                    <div>
                      <div style={{ fontFamily: "var(--cy-font-accent)", fontSize: 24, background: "var(--cy-gradient-rainbow)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                        {identity.handle}
                      </div>
                      <div className="cy-badge cy-badge-online" style={{ marginTop: 8 }}>THRIVING</div>
                    </div>
                  </div>
                  {[
                    { label: "YOUR NAME", key: "handle" },
                    { label: "POTENTIAL", key: "clearance" },
                    { label: "TRIBE", key: "faction" },
                    { label: "HAPPY PLACE", key: "location" },
                  ].map(f => (
                    <div className="cy-identity-field" key={f.key}>
                      <div className="cy-field-label">{f.label}</div>
                      <input className="cy-field-input"
                        value={identity[f.key as keyof typeof identity]}
                        onChange={e => setIdentity(id => ({ ...id, [f.key]: e.target.value }))}
                        data-testid={`identity-${f.key}`}
                      />
                    </div>
                  ))}
                  <div className="cy-identity-field">
                    <div className="cy-field-label">ABOUT ME</div>
                    <textarea className="cy-field-input" style={{ resize: "vertical", minHeight: 80 }}
                      value={identity.bio}
                      onChange={e => setIdentity(id => ({ ...id, bio: e.target.value }))}
                      data-testid="identity-bio"
                    />
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 14, minWidth: 200 }}>
                  <div className="cy-identity-card" style={{ padding: 18 }}>
                    <div className="cy-field-label" style={{ marginBottom: 12 }}>LIFE STATS</div>
                    {[
                      { label: "Energy Level", val: "HIGH", cls: "cy-badge-online" },
                      { label: "Self-Care",    val: "PRIORITY", cls: "cy-badge-online" },
                      { label: "Confidence",   val: "GROWING", cls: "cy-badge-warn" },
                      { label: "Joy",          val: "ABUNDANT", cls: "cy-badge-online" },
                    ].map(row => (
                      <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "var(--cy-border)" }}>
                        <span style={{ fontFamily: "var(--cy-font-ui)", fontSize: 12, fontWeight: 500, color: "var(--cy-text-muted)" }}>{row.label}</span>
                        <span className={`cy-badge ${row.cls}`}>{row.val}</span>
                      </div>
                    ))}
                  </div>
                  <div className="cy-identity-card" style={{ padding: 18 }}>
                    <div className="cy-field-label" style={{ marginBottom: 12 }}>QUICK STATS</div>
                    {[
                      { label: "Goals Active", val: String(goals.length) },
                      { label: "Journal Entries", val: String(files.length) },
                      { label: "Days Journaling", val: "42" },
                    ].map(row => (
                      <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: "var(--cy-border)" }}>
                        <span style={{ fontFamily: "var(--cy-font-ui)", fontSize: 12, fontWeight: 500, color: "var(--cy-text-muted)" }}>{row.label}</span>
                        <span style={{ fontFamily: "var(--cy-font-ui)", fontSize: 13, fontWeight: 700, color: "var(--cy-primary)" }}>{row.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VISION */}
        {section === "vision" && !visionSubpage && (
          <div className="cy-section">
            <div className="cy-page-header">
              <div className="cy-page-header-row">
                <div>
                  <div className="cy-page-title">Vision Board</div>
                  <div className="cy-page-subtitle">Tools for Manifesting Your Dream Life</div>
                </div>
                <button className="cy-quick-add-btn" onClick={quickNewEntry} data-testid="quick-add-vision">
                  <i className="fa-solid fa-plus" />New Entry
                </button>
              </div>
            </div>
            <div className="cy-page-body">
              <div className="cy-lab-grid">
                {VISION_FEATURES.map(lab => (
                  <div key={lab.title} className="cy-lab-card" data-testid={`vision-${lab.title.replace(/\s/g,"")}`}
                    style={{ cursor: "pointer" }} onClick={() => setVisionSubpage(lab.title)}
                  >
                    <div className="cy-lab-icon"><i className={lab.icon} /></div>
                    <div className="cy-lab-title">{lab.title}</div>
                    <div className="cy-lab-desc">{lab.desc}</div>
                    <div className="cy-lab-status">
                      <span className="cy-badge cy-badge-online">{lab.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {section === "vision" && visionSubpage && (() => {
          const feature = VISION_FEATURES.find(f => f.title === visionSubpage);
          if (!feature) return null;
          return (
            <div className="cy-section" data-testid={`vision-subpage-${visionSubpage.replace(/\s/g,"")}`}>
              <div className="cy-page-header">
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <button className="cy-back-btn" onClick={() => setVisionSubpage(null)} data-testid="vision-back">
                    <i className="fa-solid fa-arrow-left" />
                  </button>
                  <div>
                    <div className="cy-page-title"><i className={feature.icon} style={{ marginRight: 8 }} />{feature.title}</div>
                    <div className="cy-page-subtitle">{feature.desc}</div>
                  </div>
                </div>
              </div>
              <div className="cy-page-body">
                <div className="cy-vision-subpage-grid">
                  <div className="cy-vision-prompts">
                    <div className="cy-vision-section-title"><i className="fa-solid fa-pen-fancy" style={{ marginRight: 8 }} />Journal Prompts</div>
                    <div className="cy-prompt-form">
                      {feature.prompts.map((p, i) => (
                        <div key={i} className="cy-prompt-field" data-testid={`prompt-field-${i}`}>
                          <label className="cy-prompt-field-label">
                            <span className="cy-prompt-number">{i + 1}</span>
                            {p}
                          </label>
                          <textarea className="cy-prompt-textarea" rows={3} placeholder="Write your thoughts..."
                            data-testid={`prompt-input-${i}`}
                            id={`vision-prompt-${visionSubpage?.replace(/\s/g,"")}-${i}`}
                          />
                        </div>
                      ))}
                      <button className="cy-prompt-save-btn" data-testid="prompt-save-btn" onClick={() => {
                        const answers = feature.prompts.map((p, i) => {
                          const el = document.getElementById(`vision-prompt-${visionSubpage?.replace(/\s/g,"")}-${i}`) as HTMLTextAreaElement;
                          return { prompt: p, answer: el?.value?.trim() || "" };
                        }).filter(a => a.answer);
                        if (answers.length === 0) return;
                        const id = Date.now().toString();
                        const now = new Date();
                        const name = feature.title + " — " + now.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                        const date = now.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
                        const content = `<h1 class="cy-doc-title" id="doc-title">${feature.title}</h1>` +
                          `<div class="cy-case-meta" contenteditable="false"><i class="${feature.icon}"></i> ${feature.desc}<br>Date: <span style="color:var(--cy-primary);">${date}</span></div>` +
                          answers.map(a =>
                            `<div class="cy-highlight-bar"><strong>${a.prompt}</strong></div><p style="max-width:600px;margin-bottom:20px;line-height:1.8;">${a.answer.replace(/\n/g, "<br>")}</p>`
                          ).join("");
                        setFiles(f => [...f, { id, name, date, content }]);
                        setActiveFileId(id);
                        setSection("journal");
                        setVisionSubpage(null);
                      }}>
                        <i className="fa-solid fa-wand-magic-sparkles" style={{ marginRight: 8 }} />
                        Save as Journal Entry
                      </button>
                    </div>
                  </div>
                  <div className="cy-vision-affirmations-compact">
                    <div className="cy-vision-section-title"><i className="fa-solid fa-star" style={{ marginRight: 8 }} />Affirmations</div>
                    <div className="cy-affirmation-grid">
                      {feature.affirmations.map((a, i) => (
                        <div key={i} className="cy-affirmation-chip" data-testid={`affirmation-${i}`}>
                          <i className="fa-solid fa-sparkles" style={{ color: "var(--cy-primary)", marginRight: 6, fontSize: 10 }} />
                          {a}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* VISION BOARD (Images) */}
        {section === "vboard" && (
          <div className="cy-section">
            <div className="cy-page-header">
              <div className="cy-page-header-row">
                <div>
                  <div className="cy-page-title">Vision Board</div>
                  <div className="cy-page-subtitle">Visualize Your Dream Life</div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input type="file" accept="image/*" multiple ref={visionImageRef} style={{ display: "none" }}
                    onChange={e => addVisionImage("board", e)} data-testid="vboard-image-input" />
                  <button className="cy-quick-add-btn" onClick={() => visionImageRef.current?.click()} data-testid="vboard-upload-btn">
                    <i className="fa-solid fa-plus" />Add Images
                  </button>
                  <button className="cy-quick-add-btn" onClick={quickNewEntry} data-testid="quick-add-vboard">
                    <i className="fa-solid fa-pen" />New Entry
                  </button>
                </div>
              </div>
            </div>
            <div className="cy-page-body">
              {(visionImages["board"] || []).length === 0 ? (
                <div className="cy-vboard-empty" data-testid="vboard-empty">
                  <div className="cy-vboard-empty-icon"><i className="fa-solid fa-images" /></div>
                  <div className="cy-vboard-empty-title">Your Vision Board is Empty</div>
                  <div className="cy-vboard-empty-text">Upload images that inspire you — goals, places, quotes, aesthetics, anything that represents the life you're building.</div>
                  <button className="cy-vboard-empty-btn" onClick={() => visionImageRef.current?.click()} data-testid="vboard-empty-upload">
                    <i className="fa-solid fa-cloud-arrow-up" style={{ marginRight: 8 }} />Upload Your First Image
                  </button>
                </div>
              ) : (
                <div className="cy-vboard-gallery" data-testid="vboard-gallery">
                  {(visionImages["board"] || []).map((item, i) => (
                    <div key={i} className="cy-vboard-img-card" data-testid={`vboard-img-${i}`}>
                      <img src={item.src} alt={item.caption || `Vision ${i + 1}`} />
                      <button className="cy-vision-img-remove" onClick={() => removeVisionImage("board", i)}
                        data-testid={`vboard-img-remove-${i}`}>
                        <i className="fa-solid fa-xmark" />
                      </button>
                      <div className="cy-vboard-caption">
                        <input
                          type="text"
                          className="cy-vboard-caption-input"
                          placeholder="Add a caption..."
                          value={item.caption}
                          onChange={e => updateVisionCaption("board", i, e.target.value)}
                          data-testid={`vboard-caption-${i}`}
                        />
                      </div>
                    </div>
                  ))}
                  <button className="cy-vision-upload-card" onClick={() => visionImageRef.current?.click()}
                    data-testid="vboard-add-more">
                    <i className="fa-solid fa-plus" />
                    <span>Add More</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* GOALS */}
        {section === "goals" && (
          <div className="cy-section">
            <div className="cy-page-header">
              <div className="cy-page-header-row">
                <div>
                  <div className="cy-page-title">My Goals</div>
                  <div className="cy-page-subtitle">Track Your Progress ~ Celebrate Your Wins</div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <span className="cy-badge cy-badge-online" style={{ fontSize: 10 }}>
                    {goals.filter(g => g.progress >= 70).length} ALMOST THERE
                  </span>
                  <span className="cy-badge cy-badge-warn" style={{ fontSize: 10 }}>
                    {goals.filter(g => g.progress < 70).length} IN PROGRESS
                  </span>
                  <button className="cy-goal-add-btn" onClick={() => setShowGoalForm(v => !v)} data-testid="button-add-goal">
                    <i className={`fa-solid ${showGoalForm ? "fa-xmark" : "fa-plus"}`} style={{ marginRight: 6 }} />
                    {showGoalForm ? "Cancel" : "New Goal"}
                  </button>
                  <button className="cy-quick-add-btn" onClick={quickNewEntry} data-testid="quick-add-goals">
                    <i className="fa-solid fa-pen" />New Entry
                  </button>
                </div>
              </div>
            </div>
            <div className="cy-page-body">

              {showGoalForm && (
                <div className="cy-smart-form" data-testid="smart-goal-form">
                  <div className="cy-smart-form-header">
                    <i className="fa-solid fa-bullseye" style={{ marginRight: 8 }} />
                    SET A SMART GOAL
                  </div>
                  <div className="cy-smart-form-desc">
                    SMART goals are <strong>Specific</strong>, <strong>Measurable</strong>, <strong>Achievable</strong>, <strong>Relevant</strong>, and <strong>Time-bound</strong>.
                  </div>

                  <div className="cy-smart-field">
                    <div className="cy-smart-label">
                      <span className="cy-smart-letter">G</span> Goal Name
                    </div>
                    <input className="cy-field-input" placeholder="What's your goal? (e.g. Run a marathon)"
                      value={goalForm.name} onChange={e => setGoalForm(f => ({ ...f, name: e.target.value }))}
                      data-testid="goal-input-name"
                    />
                  </div>

                  <div className="cy-smart-field">
                    <div className="cy-smart-label">
                      <span className="cy-smart-letter" style={{ background: "linear-gradient(135deg, #e040fb, #ff4081)" }}>S</span> Specific
                    </div>
                    <div className="cy-smart-hint">What exactly do you want to accomplish? Be clear and detailed.</div>
                    <textarea className="cy-field-input" style={{ resize: "vertical", minHeight: 60 }}
                      placeholder="I want to..."
                      value={goalForm.specific} onChange={e => setGoalForm(f => ({ ...f, specific: e.target.value }))}
                      data-testid="goal-input-specific"
                    />
                  </div>

                  <div className="cy-smart-field">
                    <div className="cy-smart-label">
                      <span className="cy-smart-letter" style={{ background: "linear-gradient(135deg, #7c4dff, #536dfe)" }}>M</span> Measurable
                    </div>
                    <div className="cy-smart-hint">How will you track your progress and know when you've achieved it?</div>
                    <textarea className="cy-field-input" style={{ resize: "vertical", minHeight: 60 }}
                      placeholder="I'll measure success by..."
                      value={goalForm.measurable} onChange={e => setGoalForm(f => ({ ...f, measurable: e.target.value }))}
                      data-testid="goal-input-measurable"
                    />
                  </div>

                  <div className="cy-smart-field">
                    <div className="cy-smart-label">
                      <span className="cy-smart-letter" style={{ background: "linear-gradient(135deg, #00e5ff, #18ffff)" }}>A</span> Achievable
                    </div>
                    <div className="cy-smart-hint">What steps or resources make this goal realistic for you?</div>
                    <textarea className="cy-field-input" style={{ resize: "vertical", minHeight: 60 }}
                      placeholder="This is achievable because..."
                      value={goalForm.achievable} onChange={e => setGoalForm(f => ({ ...f, achievable: e.target.value }))}
                      data-testid="goal-input-achievable"
                    />
                  </div>

                  <div className="cy-smart-field">
                    <div className="cy-smart-label">
                      <span className="cy-smart-letter" style={{ background: "linear-gradient(135deg, #69f0ae, #00e676)" }}>R</span> Relevant
                    </div>
                    <div className="cy-smart-hint">Why does this matter to you? How does it fit your bigger picture?</div>
                    <textarea className="cy-field-input" style={{ resize: "vertical", minHeight: 60 }}
                      placeholder="This matters because..."
                      value={goalForm.relevant} onChange={e => setGoalForm(f => ({ ...f, relevant: e.target.value }))}
                      data-testid="goal-input-relevant"
                    />
                  </div>

                  <div className="cy-smart-field">
                    <div className="cy-smart-label">
                      <span className="cy-smart-letter" style={{ background: "linear-gradient(135deg, #ffd740, #ffab40)" }}>T</span> Time-bound
                    </div>
                    <div className="cy-smart-hint">When is your deadline? Be specific about timing.</div>
                    <input className="cy-field-input" placeholder="By when? (e.g. June 2026)"
                      value={goalForm.timeBound} onChange={e => setGoalForm(f => ({ ...f, timeBound: e.target.value }))}
                      data-testid="goal-input-timebound"
                    />
                  </div>

                  <div className="cy-smart-field">
                    <div className="cy-smart-label">
                      <span className="cy-smart-letter" style={{ background: "linear-gradient(135deg, #ff4081, #ff80ab)" }}>
                        <i className="fa-solid fa-tag" style={{ fontSize: 10 }} />
                      </span> Category
                    </div>
                    <select className="cy-select" value={goalForm.category}
                      onChange={e => setGoalForm(f => ({ ...f, category: e.target.value }))}
                      data-testid="goal-input-category"
                    >
                      {GOAL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div className="cy-smart-actions">
                    <button className="cy-smart-cancel" onClick={() => { setShowGoalForm(false); setGoalForm({ ...EMPTY_GOAL_FORM }); }} data-testid="goal-form-cancel">
                      Cancel
                    </button>
                    <button className="cy-smart-submit" onClick={addGoal} data-testid="goal-form-submit">
                      <i className="fa-solid fa-sparkles" style={{ marginRight: 6 }} />
                      Add My Goal
                    </button>
                  </div>
                </div>
              )}

              {goals.length === 0 && !showGoalForm && (
                <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--cy-text-muted)" }}>
                  <i className="fa-solid fa-bullseye" style={{ fontSize: 48, marginBottom: 16, opacity: 0.3, display: "block" }} />
                  <div style={{ fontFamily: "var(--cy-font-header)", fontSize: 18, fontWeight: 600, marginBottom: 8 }}>No goals yet</div>
                  <div style={{ fontSize: 13 }}>Click "New Goal" to set your first SMART goal and start crushing it!</div>
                </div>
              )}

              <div className="cy-target-grid">
                {goals.map(g => {
                  const barColor = g.progress >= 70 ? "#69f0ae" : g.progress >= 40 ? "#ffd740" : "#ff4081";
                  const isExpanded = expandedGoal === g.id;
                  return (
                    <div key={g.id} className={`cy-target-card ${isExpanded ? "cy-goal-expanded" : ""}`} data-testid={`goal-${g.id}`}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                        <div className="cy-target-name" style={{ cursor: "pointer", flex: 1 }}
                          onClick={() => setExpandedGoal(isExpanded ? null : g.id)}
                          data-testid={`goal-expand-${g.id}`}
                        >
                          {g.name}
                          <i className={`fa-solid fa-chevron-${isExpanded ? "up" : "down"}`} style={{ fontSize: 10, marginLeft: 8, opacity: 0.5 }} />
                        </div>
                        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                          <span className={`cy-badge ${g.progress >= 70 ? "cy-badge-online" : "cy-badge-warn"}`}>{g.status}</span>
                          <button className="cy-goal-delete-btn" onClick={() => deleteGoal(g.id)}
                            title="Delete goal" data-testid={`goal-delete-${g.id}`}
                          >
                            <i className="fa-solid fa-trash-can" />
                          </button>
                        </div>
                      </div>
                      <div className="cy-target-detail">
                        <div><span style={{ color: "var(--cy-text-muted)" }}>Category: </span>{g.category}</div>
                        <div style={{ marginTop: 4 }}><span style={{ color: "var(--cy-text-muted)" }}>Deadline: </span>{g.timeBound}</div>
                      </div>

                      {isExpanded && (
                        <div className="cy-smart-details" data-testid={`goal-details-${g.id}`}>
                          {[
                            { letter: "S", label: "Specific", value: g.specific, color: "#e040fb" },
                            { letter: "M", label: "Measurable", value: g.measurable, color: "#7c4dff" },
                            { letter: "A", label: "Achievable", value: g.achievable, color: "#00e5ff" },
                            { letter: "R", label: "Relevant", value: g.relevant, color: "#69f0ae" },
                            { letter: "T", label: "Time-bound", value: g.timeBound, color: "#ffd740" },
                          ].map(s => (
                            <div className="cy-smart-detail-row" key={s.letter}>
                              <span className="cy-smart-detail-letter" style={{ background: s.color }}>{s.letter}</span>
                              <div>
                                <div className="cy-smart-detail-label">{s.label}</div>
                                <div className="cy-smart-detail-value">{s.value}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="cy-target-threat">
                        <span style={{ fontFamily: "var(--cy-font-ui)", fontSize: 10, fontWeight: 600, color: "var(--cy-text-muted)", letterSpacing: 1 }}>
                          PROGRESS
                        </span>
                        <div className="cy-threat-bar" style={{ cursor: "pointer", position: "relative" }}
                          onClick={e => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const pct = Math.round(((e.clientX - rect.left) / rect.width) * 100);
                            updateGoalProgress(g.id, pct);
                          }}
                          data-testid={`goal-progress-bar-${g.id}`}
                        >
                          <div className="cy-threat-fill" style={{ width: `${g.progress}%`, background: `linear-gradient(90deg, ${barColor}, var(--cy-primary))`, boxShadow: `0 0 8px ${barColor}`, transition: "width 0.3s" }} />
                        </div>
                        <span style={{ fontFamily: "var(--cy-font-ui)", fontSize: 12, fontWeight: 700, color: barColor, minWidth: 32, textAlign: "right" }}>
                          {g.progress}%
                        </span>
                      </div>

                      {isExpanded && (
                        <div className="cy-goal-progress-controls" data-testid={`goal-progress-controls-${g.id}`}>
                          <div className="cy-goal-slider-row">
                            <input type="range" min="0" max="100" value={g.progress}
                              onChange={e => updateGoalProgress(g.id, parseInt(e.target.value))}
                              className="cy-goal-slider"
                              data-testid={`goal-slider-${g.id}`}
                            />
                            <div className="cy-goal-quick-btns">
                              {[0, 25, 50, 75, 100].map(v => (
                                <button key={v} className={`cy-goal-quick-btn${g.progress === v ? " active" : ""}`}
                                  onClick={() => updateGoalProgress(g.id, v)}
                                  data-testid={`goal-quick-${v}-${g.id}`}
                                >{v}%</button>
                              ))}
                            </div>
                          </div>

                          <div className="cy-goal-milestones">
                            <div className="cy-goal-milestones-header">
                              <i className="fa-solid fa-list-check" style={{ marginRight: 6 }} />
                              Milestones
                              <span className="cy-goal-milestone-count">
                                {(g.milestones || []).filter(m => m.done).length}/{(g.milestones || []).length}
                              </span>
                            </div>
                            {(g.milestones || []).map((m, idx) => (
                              <div key={idx} className={`cy-goal-milestone${m.done ? " done" : ""}`}
                                data-testid={`goal-milestone-${g.id}-${idx}`}
                              >
                                <button className="cy-goal-milestone-check"
                                  onClick={() => toggleGoalMilestone(g.id, idx)}
                                  data-testid={`goal-milestone-toggle-${g.id}-${idx}`}
                                >
                                  <i className={`fa-${m.done ? "solid fa-circle-check" : "regular fa-circle"}`} />
                                </button>
                                <span className="cy-goal-milestone-text">{m.text}</span>
                                <button className="cy-goal-milestone-remove"
                                  onClick={() => removeGoalMilestone(g.id, idx)}
                                  data-testid={`goal-milestone-remove-${g.id}-${idx}`}
                                >
                                  <i className="fa-solid fa-xmark" />
                                </button>
                              </div>
                            ))}
                            <div className="cy-goal-milestone-add">
                              <input className="cy-field-input" placeholder="Add a milestone..."
                                value={expandedGoal === g.id ? milestoneInput : ""}
                                onChange={e => setMilestoneInput(e.target.value)}
                                onKeyDown={e => {
                                  if (e.key === "Enter") {
                                    addGoalMilestone(g.id, milestoneInput);
                                    setMilestoneInput("");
                                  }
                                }}
                                data-testid={`goal-milestone-input-${g.id}`}
                              />
                              <button className="cy-goal-milestone-add-btn"
                                onClick={() => { addGoalMilestone(g.id, milestoneInput); setMilestoneInput(""); }}
                                data-testid={`goal-milestone-add-${g.id}`}
                              >
                                <i className="fa-solid fa-plus" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* MIND MAP */}
        {section === "mindmap" && (
          <div className="cy-section">
            <div className="cy-page-header">
              <div className="cy-page-header-row">
                <div>
                  <div className="cy-page-title">Mind Map</div>
                  <div className="cy-page-subtitle">Visualize Your Ideas ~ Connect the Dots</div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <span className="cy-badge cy-badge-online" style={{ fontSize: 10 }}>
                    {mindMapNodes.length} NODES
                  </span>
                  <button className="cy-goal-add-btn" onClick={() => addMindMapNode(selectedNode || "root")} data-testid="button-add-node">
                    <i className="fa-solid fa-plus" style={{ marginRight: 6 }} />
                    Add Node
                  </button>
                  <button className="cy-quick-add-btn" onClick={() => setAssetOpen(v => !v)} data-testid="btn-mindmap-stickers">
                    <i className="fa-solid fa-palette" style={{ marginRight: 4 }} />Stickers
                  </button>
                  <button className="cy-quick-add-btn" onClick={() => setNotesPanelOpen(v => !v)} data-testid="btn-mindmap-notes">
                    <i className="fa-solid fa-note-sticky" style={{ marginRight: 4 }} />Notes
                  </button>
                  <button className="cy-quick-add-btn" onClick={clearMindMap} data-testid="btn-mindmap-clear"
                    style={{ borderColor: "rgba(255,64,129,0.3)", color: "#ff4081" }}
                  >
                    <i className="fa-solid fa-trash-can" style={{ marginRight: 4 }} />Clear
                  </button>
                </div>
              </div>
            </div>
            <div className="cy-mindmap-themes" data-testid="mindmap-themes">
              <span className="cy-mindmap-themes-label">Templates:</span>
              {MINDMAP_THEMES.map((t, i) => (
                <button key={t.name} className="cy-mindmap-theme-btn" onClick={() => applyMindMapTheme(i)}
                  data-testid={`mindmap-theme-${i}`}
                >
                  <i className={`fa-solid ${t.icon}`} style={{ marginRight: 5, color: t.rootColor }} />
                  {t.name}
                </button>
              ))}
            </div>
            {notesPanelOpen && section === "mindmap" && (
              <div className="cy-notes-panel" data-testid="mindmap-notes-panel">
                <div className="cy-notes-panel-title">Add a Note</div>
                <div className="cy-notes-color-grid">
                  {NOTE_STYLES.map(n => (
                    <button key={n.type} className={`cy-note-color-btn ${n.cls}`}
                      onClick={() => { addSticker(n.type, "mindmap"); setNotesPanelOpen(false); }}
                      data-testid={`mm-note-btn-${n.type}`}
                    >{n.label}</button>
                  ))}
                </div>
                <div className="cy-notes-media-row">
                  <button className="cy-quick-add-btn" onClick={() => noteImageRef.current?.click()} data-testid="mm-note-upload-image">
                    <i className="fa-solid fa-image" style={{ marginRight: 4 }} />Image Note
                  </button>
                  <button className="cy-quick-add-btn" onClick={() => noteVideoRef.current?.click()} data-testid="mm-note-upload-video">
                    <i className="fa-solid fa-video" style={{ marginRight: 4 }} />Video Note
                  </button>
                  <input type="file" accept="image/*" style={{ display: "none" }}
                    ref={el => { if (el && section === "mindmap") (noteImageRef as any).current = el; }}
                    onChange={e => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      const reader = new FileReader();
                      reader.onload = () => { addSticker("note-image-" + reader.result, "mindmap"); setNotesPanelOpen(false); };
                      reader.readAsDataURL(f);
                      e.target.value = "";
                    }}
                  />
                  <input type="file" accept="video/*" style={{ display: "none" }}
                    ref={el => { if (el && section === "mindmap") (noteVideoRef as any).current = el; }}
                    onChange={e => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      const reader = new FileReader();
                      reader.onload = () => { addSticker("note-video-" + reader.result, "mindmap"); setNotesPanelOpen(false); };
                      reader.readAsDataURL(f);
                      e.target.value = "";
                    }}
                  />
                </div>
              </div>
            )}
            <div className="cy-mindmap-container" ref={mindMapRef} data-testid="mindmap-canvas"
              onClick={(e) => { if ((e.target as HTMLElement).classList.contains("cy-mindmap-container")) setSelectedNode(null); }}
            >
              <svg className="cy-mindmap-lines"
                width={Math.max(900, ...mindMapNodes.map(n => n.x + 220))}
                height={Math.max(700, ...mindMapNodes.map(n => n.y + 80))}
              >
                {mindMapNodes.filter(n => n.parentId).map(n => {
                  const parent = mindMapNodes.find(p => p.id === n.parentId);
                  if (!parent) return null;
                  const pIsRoot = parent.id === "root";
                  const nIsRoot = n.id === "root";
                  const px = parent.x + (pIsRoot ? 80 : 60);
                  const py = parent.y + (pIsRoot ? 26 : 22);
                  const nx = n.x + (nIsRoot ? 80 : 60);
                  const ny = n.y + (nIsRoot ? 26 : 22);
                  const mx = (px + nx) / 2;
                  return (
                    <path key={`line-${n.id}`}
                      d={`M ${px} ${py} C ${mx} ${py}, ${mx} ${ny}, ${nx} ${ny}`}
                      stroke={n.color} strokeWidth="2" strokeOpacity={selectedNode === n.id || selectedNode === n.parentId ? "0.6" : "0.25"}
                      fill="none"
                      strokeDasharray={selectedNode === n.id || selectedNode === n.parentId ? "0" : "6 4"}
                    />
                  );
                })}
              </svg>

              {mindMapStickers.map(st => (
                <div key={st.id} id={`mmsticker-${st.id}`} className="cy-sticker"
                  style={{ left: st.x, top: st.y, transform: `rotate(${st.rotation}deg) scale(${st.scale || 1})` }}
                  data-testid={`mmsticker-${st.id}`}
                >
                  <div dangerouslySetInnerHTML={{ __html: getStickerContent(st.type) }} />
                  <div className="cy-sticker-controls">
                    <button className="cy-sticker-resize" onClick={() => resizeSticker(st.id, 0.15, "mindmap")} title="Bigger">
                      <i className="fa-solid fa-plus" />
                    </button>
                    <button className="cy-sticker-resize" onClick={() => resizeSticker(st.id, -0.15, "mindmap")} title="Smaller">
                      <i className="fa-solid fa-minus" />
                    </button>
                    <button className="cy-sticker-delete" onClick={() => removeMindMapSticker(st.id)} title="Remove">
                      <i className="fa-solid fa-xmark" />
                    </button>
                  </div>
                </div>
              ))}

              {mindMapNodes.map(n => (
                <div key={n.id} id={`mmnode-${n.id}`}
                  className={`cy-mindmap-node ${n.id === "root" ? "cy-mm-root" : ""} ${selectedNode === n.id ? "cy-mm-selected" : ""}`}
                  style={{ left: n.x, top: n.y, borderColor: n.color, boxShadow: selectedNode === n.id ? `0 0 20px ${n.color}40` : undefined }}
                  onClick={(e) => { e.stopPropagation(); setSelectedNode(n.id); }}
                  data-testid={`mmnode-${n.id}`}
                >
                  {editingNode === n.id ? (
                    <input className="cy-mm-edit-input" autoFocus
                      value={newNodeText}
                      onChange={e => setNewNodeText(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") saveNodeEdit(n.id); if (e.key === "Escape") { setEditingNode(null); setNewNodeText(""); } }}
                      onBlur={() => saveNodeEdit(n.id)}
                      data-testid={`mmnode-edit-${n.id}`}
                    />
                  ) : (
                    <span className="cy-mm-text" onDoubleClick={() => { setEditingNode(n.id); setNewNodeText(n.text); }}
                      style={{ color: n.id === "root" ? undefined : n.color }}
                      data-testid={`mmnode-text-${n.id}`}
                    >
                      {n.text}
                    </span>
                  )}
                  <div className="cy-mm-actions">
                    <button className="cy-mm-action-btn" title="Add child node"
                      onClick={(e) => { e.stopPropagation(); addMindMapNode(n.id); }}
                      style={{ color: "#69f0ae" }}
                      data-testid={`mmnode-add-${n.id}`}
                    >
                      <i className="fa-solid fa-plus" />
                    </button>
                    <button className="cy-mm-action-btn" title="Edit node"
                      onClick={(e) => { e.stopPropagation(); setEditingNode(n.id); setNewNodeText(n.text); }}
                      style={{ color: "#ffd740" }}
                      data-testid={`mmnode-editbtn-${n.id}`}
                    >
                      <i className="fa-solid fa-pen" />
                    </button>
                    {n.id !== "root" && (
                      <button className="cy-mm-action-btn" title="Delete node"
                        onClick={(e) => { e.stopPropagation(); deleteMindMapNode(n.id); }}
                        style={{ color: "#ff4081" }}
                        data-testid={`mmnode-delete-${n.id}`}
                      >
                        <i className="fa-solid fa-trash-can" />
                      </button>
                    )}
                  </div>
                  <div className="cy-mm-dot" style={{ background: n.color }} />
                </div>
              ))}

              <div className="cy-mm-help">
                <i className="fa-solid fa-circle-info" style={{ marginRight: 6 }} />
                Drag nodes to reposition. Double-click to edit text. Click + to add child nodes.
              </div>
            </div>
          </div>
        )}

        {/* MOOD */}
        {section === "mood" && (() => {
          const moodStreak = (() => {
            let streak = 0;
            const today = new Date();
            for (let i = 0; i < 365; i++) {
              const d = new Date(today);
              d.setDate(d.getDate() - i);
              const ds = d.toISOString().split("T")[0];
              if (moodEntries.some(e => e.date === ds)) streak++;
              else break;
            }
            return streak;
          })();
          const avgMood = moodEntries.length > 0
            ? (moodEntries.reduce((s, e) => s + e.mood, 0) / moodEntries.length)
            : 0;
          const moodCounts = MOOD_EMOJIS.map((_, i) => moodEntries.filter(e => e.mood === i).length);
          const maxCount = Math.max(...moodCounts, 1);
          const last7Days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            const ds = d.toISOString().split("T")[0];
            const entry = moodEntries.find(e => e.date === ds);
            return { date: d, dateStr: ds, entry, dayName: d.toLocaleDateString("en-US", { weekday: "short" }) };
          });
          const deleteMoodEntry = (date: string) => {
            setMoodEntries(prev => prev.filter(e => e.date !== date));
          };
          return (
          <div className="cy-section">
            <div className="cy-page-header">
              <div className="cy-page-header-row">
                <div>
                  <div className="cy-page-title">Mood Tracker</div>
                  <div className="cy-page-subtitle">Check In With Yourself ~ How Are You Feeling?</div>
                </div>
                <button className="cy-quick-add-btn" onClick={quickNewEntry} data-testid="quick-add-mood">
                  <i className="fa-solid fa-plus" />New Entry
                </button>
              </div>
            </div>
            <div className="cy-page-body">
              <div className="cy-mood-checkin" data-testid="mood-checkin">
                <div className="cy-mood-label">How are you feeling today?</div>
                <div className="cy-mood-emojis">
                  {MOOD_EMOJIS.map((m, i) => (
                    <button key={i} className={`cy-mood-btn${todayMood?.mood === i ? " active" : ""}`}
                      style={{ "--mood-color": m.color } as React.CSSProperties}
                      onClick={() => logMood(i)} data-testid={`mood-btn-${i}`}
                    >
                      <span className="cy-mood-emoji">{m.emoji}</span>
                      <span className="cy-mood-emoji-label">{m.label}</span>
                    </button>
                  ))}
                </div>
                <input className="cy-mood-note" placeholder="Add a note about your day..."
                  value={moodNote} onChange={e => setMoodNote(e.target.value)}
                  data-testid="mood-note-input"
                />
              </div>

              {moodEntries.length > 0 && (
                <>
                  <div className="cy-mood-stats-row" data-testid="mood-stats">
                    <div className="cy-mood-stat-card">
                      <div className="cy-mood-stat-value">{moodEntries.length}</div>
                      <div className="cy-mood-stat-label">Total Check-ins</div>
                    </div>
                    <div className="cy-mood-stat-card">
                      <div className="cy-mood-stat-value">{moodStreak}🔥</div>
                      <div className="cy-mood-stat-label">Day Streak</div>
                    </div>
                    <div className="cy-mood-stat-card">
                      <div className="cy-mood-stat-value">{MOOD_EMOJIS[Math.round(avgMood)]?.emoji || "😐"}</div>
                      <div className="cy-mood-stat-label">Average Mood</div>
                    </div>
                    <div className="cy-mood-stat-card">
                      <div className="cy-mood-stat-value">{MOOD_EMOJIS[moodCounts.indexOf(Math.max(...moodCounts))]?.emoji || "?"}</div>
                      <div className="cy-mood-stat-label">Most Common</div>
                    </div>
                  </div>

                  <div className="cy-vision-section-title" style={{ marginBottom: 12 }}>
                    <i className="fa-solid fa-chart-line" style={{ marginRight: 8 }} />This Week
                  </div>
                  <div className="cy-mood-week-trend" data-testid="mood-week-trend">
                    {last7Days.map((d, i) => (
                      <div key={i} className="cy-mood-week-col">
                        {d.entry ? (
                          <div className="cy-mood-week-dot"
                            style={{ background: MOOD_EMOJIS[d.entry.mood]?.color || "var(--cy-muted)", opacity: 0.85 }}
                            title={`${d.dayName}: ${MOOD_EMOJIS[d.entry.mood]?.label} ${d.entry.note ? "— " + d.entry.note : ""}`}
                          >
                            {MOOD_EMOJIS[d.entry.mood]?.emoji}
                          </div>
                        ) : (
                          <div className="cy-mood-week-dot" style={{ background: "var(--cy-surface)", border: "1px dashed var(--cy-muted)" }} title={`${d.dayName}: No check-in`}>
                            <span style={{ fontSize: 10, color: "var(--cy-muted)" }}>—</span>
                          </div>
                        )}
                        <div className="cy-mood-week-day">{d.dayName}</div>
                      </div>
                    ))}
                  </div>

                  <div className="cy-vision-section-title" style={{ marginBottom: 12 }}>
                    <i className="fa-solid fa-chart-bar" style={{ marginRight: 8 }} />Mood Distribution
                  </div>
                  <div className="cy-mood-dist" data-testid="mood-distribution">
                    {MOOD_EMOJIS.map((m, i) => (
                      <div key={i} className="cy-mood-dist-bar">
                        <div className="cy-mood-dist-count">{moodCounts[i]}</div>
                        <div className="cy-mood-dist-fill" style={{
                          height: `${Math.max((moodCounts[i] / maxCount) * 80, 4)}px`,
                          background: m.color
                        }} />
                        <div className="cy-mood-dist-emoji">{m.emoji}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div className="cy-mood-history">
                <div className="cy-vision-section-title" style={{ marginBottom: 16 }}>
                  <i className="fa-solid fa-calendar" style={{ marginRight: 8 }} />Recent Moods
                </div>
                <div className="cy-mood-calendar">
                  {[...moodEntries].reverse().slice(0, 30).map((e, i) => (
                    <div key={i} className="cy-mood-day" data-testid={`mood-day-${i}`}>
                      <button className="cy-mood-day-delete" onClick={() => deleteMoodEntry(e.date)} title="Remove" data-testid={`mood-day-delete-${i}`}>
                        <i className="fa-solid fa-xmark" />
                      </button>
                      <div className="cy-mood-day-date">{new Date(e.date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
                      <div className="cy-mood-day-emoji">{MOOD_EMOJIS[e.mood]?.emoji || "?"}</div>
                      {e.note && <div className="cy-mood-day-note" title={e.note}>{e.note}</div>}
                    </div>
                  ))}
                  {moodEntries.length === 0 && (
                    <div style={{ color: "var(--cy-muted)", fontStyle: "italic", padding: 20 }}>
                      No mood entries yet — check in above to start tracking!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          );
        })()}

        {/* HABITS */}
        {section === "habits" && (
          <div className="cy-section">
            <div className="cy-page-header">
              <div className="cy-page-header-row">
                <div>
                  <div className="cy-page-title">Habit Tracker</div>
                  <div className="cy-page-subtitle">Build Your Streak ~ One Day at a Time</div>
                </div>
                <button className="cy-quick-add-btn" onClick={quickNewEntry} data-testid="quick-add-habits">
                  <i className="fa-solid fa-plus" />New Entry
                </button>
              </div>
            </div>
            <div className="cy-page-body">
              <div className="cy-habit-grid" data-testid="habit-grid">
                {allHabits.map(h => {
                  const done = todayHabits?.completed.includes(h.id) || false;
                  const streak = getStreak(h.id);
                  const isCustom = customHabits.some(ch => ch.id === h.id);
                  return (
                    <div key={h.id} className={`cy-habit-card${done ? " done" : ""}`}
                      style={{ "--habit-color": h.color } as React.CSSProperties}
                      onClick={() => toggleHabit(h.id)} data-testid={`habit-${h.id}`}
                    >
                      {isCustom && (
                        <button className="cy-habit-delete" onClick={(e) => { e.stopPropagation(); deleteCustomHabit(h.id); }}
                          title="Remove habit" data-testid={`habit-delete-${h.id}`}>
                          <i className="fa-solid fa-xmark" />
                        </button>
                      )}
                      <div className="cy-habit-icon"><i className={h.icon} /></div>
                      <div className="cy-habit-name">{h.name}</div>
                      <div className="cy-habit-check">
                        <i className={`fa-solid ${done ? "fa-circle-check" : "fa-circle"}`} />
                      </div>
                      {streak > 0 && (
                        <div className="cy-habit-streak" data-testid={`streak-${h.id}`}>
                          <i className="fa-solid fa-fire" style={{ marginRight: 4 }} />
                          {streak} day{streak !== 1 ? "s" : ""}
                        </div>
                      )}
                    </div>
                  );
                })}
                <div className="cy-habit-card cy-habit-add" onClick={() => setShowAddHabit(true)} data-testid="habit-add-btn">
                  <div className="cy-habit-icon"><i className="fa-solid fa-plus" /></div>
                  <div className="cy-habit-name">Add Habit</div>
                </div>
              </div>

              {showAddHabit && (
                <div className="cy-habit-form" data-testid="habit-add-form">
                  <div className="cy-field-label" style={{ marginBottom: 8 }}>NEW HABIT</div>
                  <input className="cy-input" placeholder="Habit name..." value={newHabitName}
                    onChange={e => setNewHabitName(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && addCustomHabit()}
                    autoFocus data-testid="habit-name-input" />
                  <div className="cy-field-label" style={{ marginTop: 12, marginBottom: 6 }}>ICON</div>
                  <div className="cy-habit-icon-picker">
                    {HABIT_ICONS.map(icon => (
                      <button key={icon} className={`cy-icon-pick${newHabitIcon === icon ? " active" : ""}`}
                        onClick={() => setNewHabitIcon(icon)} data-testid={`pick-icon-${icon}`}>
                        <i className={icon} />
                      </button>
                    ))}
                  </div>
                  <div className="cy-field-label" style={{ marginTop: 12, marginBottom: 6 }}>COLOR</div>
                  <div className="cy-habit-color-picker">
                    {HABIT_COLORS.map(c => (
                      <button key={c} className={`cy-color-pick${newHabitColor === c ? " active" : ""}`}
                        style={{ background: c }} onClick={() => setNewHabitColor(c)} data-testid={`pick-color-${c}`} />
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                    <button className="cy-quick-add-btn" onClick={addCustomHabit} data-testid="habit-confirm-add">
                      <i className="fa-solid fa-plus" style={{ marginRight: 6 }} />Add
                    </button>
                    <button className="cy-back-btn" onClick={() => setShowAddHabit(false)} data-testid="habit-cancel-add">Cancel</button>
                  </div>
                </div>
              )}

              <div className="cy-habit-history">
                <div className="cy-vision-section-title" style={{ marginBottom: 16 }}>
                  <i className="fa-solid fa-chart-line" style={{ marginRight: 8 }} />Weekly Overview
                </div>
                <div className="cy-habit-week">
                  {Array.from({ length: 7 }, (_, i) => {
                    const d = new Date();
                    d.setDate(d.getDate() - (6 - i));
                    const dateStr = d.toISOString().split("T")[0];
                    const dayData = habitDays.find(h => h.date === dateStr);
                    const count = dayData?.completed.length || 0;
                    return (
                      <div key={i} className="cy-habit-week-day" data-testid={`habit-week-${i}`}>
                        <div className="cy-habit-week-label">{d.toLocaleDateString("en-US", { weekday: "short" })}</div>
                        <div className="cy-habit-week-bar" style={{ height: `${Math.max(4, (count / allHabits.length) * 60)}px`, background: count > 0 ? "var(--cy-primary)" : "var(--cy-surface)" }} />
                        <div className="cy-habit-week-count">{count}/{allHabits.length}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS */}
        {section === "calendar" && (
          <div className="cy-section">
            <div className="cy-page-header">
              <div className="cy-page-header-row">
                <div>
                  <div className="cy-page-title">Calendar</div>
                  <div className="cy-page-subtitle">Plan Your Dreams ~ Own Your Time</div>
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <button className="cy-quick-add-btn" onClick={() => openEventForm()} data-testid="quick-add-event">
                    <i className="fa-solid fa-plus" style={{ marginRight: 4 }} />New Event
                  </button>
                  <button className="cy-asset-toggle" onClick={() => setAssetOpen(v => !v)} data-testid="btn-cal-stickers">
                    <i className="fa-solid fa-palette" style={{ marginRight: 4 }} />Stickers
                  </button>
                  <button className="cy-asset-toggle" onClick={() => setNotesPanelOpen(v => !v)} data-testid="btn-cal-notes">
                    <i className="fa-solid fa-note-sticky" style={{ marginRight: 4 }} />Notes
                  </button>
                </div>
              </div>
            </div>
            {notesPanelOpen && section === "calendar" && (
              <div className="cy-notes-panel" data-testid="cal-notes-panel" style={{ margin: "0 16px 10px" }}>
                <div className="cy-notes-panel-title">Add a Note</div>
                <div className="cy-notes-color-grid">
                  {NOTE_STYLES.map(n => (
                    <button key={n.type} className={`cy-note-color-btn ${n.cls}`}
                      onClick={() => { addSticker(n.type, "calendar"); setNotesPanelOpen(false); }}
                      data-testid={`cal-note-btn-${n.type}`}
                    >{n.label}</button>
                  ))}
                </div>
                <div className="cy-notes-media-row">
                  <button className="cy-quick-add-btn" onClick={() => noteImageRef.current?.click()} data-testid="cal-note-upload-image">
                    <i className="fa-solid fa-image" style={{ marginRight: 4 }} />Image Note
                  </button>
                  <button className="cy-quick-add-btn" onClick={() => noteVideoRef.current?.click()} data-testid="cal-note-upload-video">
                    <i className="fa-solid fa-video" style={{ marginRight: 4 }} />Video Note
                  </button>
                </div>
              </div>
            )}
            <div className="cy-page-body" style={{ position: "relative" }}>
              <div className="cy-sticker-layer">
                {calendarStickers.map(st => (
                  <div key={st.id} id={`calsticker-${st.id}`} className="cy-sticker"
                    style={{ left: st.x, top: st.y, transform: `rotate(${st.rotation}deg) scale(${st.scale || 1})` }}
                    data-testid={`calsticker-${st.id}`}
                  >
                    <div dangerouslySetInnerHTML={{ __html: getStickerContent(st.type) }} />
                    <div className="cy-sticker-controls">
                      <button className="cy-sticker-resize" onClick={() => resizeSticker(st.id, 0.15, "calendar")} title="Bigger">
                        <i className="fa-solid fa-plus" />
                      </button>
                      <button className="cy-sticker-resize" onClick={() => resizeSticker(st.id, -0.15, "calendar")} title="Smaller">
                        <i className="fa-solid fa-minus" />
                      </button>
                      <button className="cy-sticker-delete" onClick={() => removeCalendarSticker(st.id)} title="Remove">
                        <i className="fa-solid fa-xmark" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="cy-cal-controls">
                <div className="cy-cal-nav">
                  <button className="cy-cal-nav-btn" onClick={() => calNavigate(-1)} data-testid="cal-prev"><i className="fa-solid fa-chevron-left" /></button>
                  <div className="cy-cal-title" data-testid="cal-title">
                    {calendarView === "daily" && new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                    {calendarView === "weekly" && (() => { const wk = calGetWeekDays(selectedDate); return `${new Date(wk[0] + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${new Date(wk[6] + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`; })()}
                    {calendarView === "monthly" && new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </div>
                  <button className="cy-cal-nav-btn" onClick={() => calNavigate(1)} data-testid="cal-next"><i className="fa-solid fa-chevron-right" /></button>
                  <button className="cy-cal-nav-btn" onClick={() => setSelectedDate(getToday())} data-testid="cal-today" style={{ marginLeft: 8, fontSize: 11 }}>Today</button>
                </div>
                <div className="cy-cal-view-tabs">
                  {(["daily", "weekly", "monthly"] as const).map(v => (
                    <button key={v} className={`cy-cal-view-tab${calendarView === v ? " active" : ""}`}
                      onClick={() => setCalendarView(v)} data-testid={`cal-view-${v}`}
                    >{v.charAt(0).toUpperCase() + v.slice(1)}</button>
                  ))}
                </div>
              </div>

              {calendarView === "monthly" && (() => {
                const d = new Date(selectedDate + "T12:00:00");
                const days = calGetMonthDays(d.getFullYear(), d.getMonth());
                const today = getToday();
                return (
                  <div className="cy-cal-month">
                    <div className="cy-cal-dow-row">
                      {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(dw => (
                        <div key={dw} className="cy-cal-dow">{dw}</div>
                      ))}
                    </div>
                    <div className="cy-cal-grid">
                      {days.map((day, i) => (
                        <div key={i}
                          className={`cy-cal-cell${day === today ? " today" : ""}${day === selectedDate ? " selected" : ""}${!day ? " empty" : ""}`}
                          onClick={() => day && setSelectedDate(day)}
                          onDoubleClick={() => day && openEventForm(day)}
                          onDragOver={e => { if (day) { e.preventDefault(); e.currentTarget.classList.add("drag-over"); } }}
                          onDragLeave={e => e.currentTarget.classList.remove("drag-over")}
                          onDrop={e => { e.currentTarget.classList.remove("drag-over"); if (day && dragEventId) { handleEventDrop(dragEventId, day); setDragEventId(null); } }}
                          data-testid={day ? `cal-day-${day}` : `cal-empty-${i}`}
                        >
                          {day && (
                            <>
                              <span className="cy-cal-day-num">{parseInt(day.split("-")[2])}</span>
                              <div className="cy-cal-day-events">
                                {calEventsForDate(day).slice(0, 3).map(ev => (
                                  <div key={ev.id} className="cy-cal-event-dot"
                                    style={{ background: ev.color }}
                                    draggable
                                    onDragStart={() => setDragEventId(ev.id)}
                                    onDragEnd={() => setDragEventId(null)}
                                    onClick={e => { e.stopPropagation(); openEditEvent(ev); }}
                                    title={ev.title}
                                    data-testid={`cal-event-${ev.id}`}
                                  >{ev.title}</div>
                                ))}
                                {calEventsForDate(day).length > 3 && <div className="cy-cal-more">+{calEventsForDate(day).length - 3}</div>}
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {calendarView === "weekly" && (() => {
                const weekDays = calGetWeekDays(selectedDate);
                const today = getToday();
                return (
                  <div className="cy-cal-week">
                    <div className="cy-cal-week-header">
                      <div className="cy-cal-time-gutter" />
                      {weekDays.map(wd => (
                        <div key={wd} className={`cy-cal-week-day-header${wd === today ? " today" : ""}${wd === selectedDate ? " selected" : ""}`}
                          onClick={() => setSelectedDate(wd)}
                        >
                          <span className="cy-cal-wdh-name">{new Date(wd + "T12:00:00").toLocaleDateString("en-US", { weekday: "short" })}</span>
                          <span className="cy-cal-wdh-num">{parseInt(wd.split("-")[2])}</span>
                        </div>
                      ))}
                    </div>
                    {weekDays.some(wd => calEventsForDate(wd).some(e => e.allDay)) && (
                      <div className="cy-cal-allday-bar" style={{ marginLeft: 62 }}>
                        {weekDays.map(wd => calEventsForDate(wd).filter(e => e.allDay).map(ev => (
                          <div key={ev.id} className="cy-cal-allday-chip"
                            style={{ background: ev.color + "25", borderColor: ev.color, color: ev.color }}
                            draggable
                            onDragStart={() => setDragEventId(ev.id)}
                            onDragEnd={() => setDragEventId(null)}
                            onClick={() => openEditEvent(ev)}
                            data-testid={`cal-event-${ev.id}`}
                          >{ev.title}</div>
                        )))}
                      </div>
                    )}
                    <div className="cy-cal-week-body">
                      <div className="cy-cal-time-gutter">
                        {HOURS.map(h => (
                          <div key={h} className="cy-cal-hour-label">{h === 0 ? "12 AM" : h < 12 ? `${h} AM` : h === 12 ? "12 PM" : `${h - 12} PM`}</div>
                        ))}
                      </div>
                      {weekDays.map(wd => (
                        <div key={wd} className="cy-cal-day-col"
                          onDragOver={e => e.preventDefault()}
                          onDrop={e => {
                            if (!dragEventId) return;
                            const rect = e.currentTarget.getBoundingClientRect();
                            const relY = e.clientY - rect.top;
                            const hour = Math.floor(relY / 60) + 6;
                            handleEventDrop(dragEventId, wd, `${String(Math.min(23, hour)).padStart(2, "0")}:00`);
                            setDragEventId(null);
                          }}
                        >
                          {HOURS.map(h => (
                            <div key={h} className="cy-cal-hour-slot"
                              onClick={() => openEventForm(wd, `${String(h).padStart(2, "0")}:00`)}
                            />
                          ))}
                          {calEventsForDate(wd).filter(e => !e.allDay).map(ev => {
                            const top = calTimeToY(ev.startTime);
                            const bottom = calTimeToY(ev.endTime);
                            const height = Math.max(20, bottom - top);
                            const tbc = getTimeBlockColor(ev.startTime);
                            return (
                              <div key={ev.id} className={`cy-cal-event-block${ev.image ? " has-image" : ""}`}
                                style={{ top, height, background: ev.image ? `url(${ev.image}) center/cover` : tbc + "30", borderLeft: `3px solid ${tbc}`, color: ev.image ? "#fff" : tbc }}
                                draggable
                                onDragStart={() => setDragEventId(ev.id)}
                                onDragEnd={() => setDragEventId(null)}
                                onClick={e => { e.stopPropagation(); openEditEvent(ev); }}
                                data-testid={`cal-event-${ev.id}`}
                              >
                                {ev.image && <div className="cy-cal-ev-overlay" />}
                                <div className="cy-cal-ev-title">{ev.title}</div>
                                <div className="cy-cal-ev-time">{ev.startTime} – {ev.endTime}</div>
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {calendarView === "daily" && (() => {
                const today = getToday();
                const dayEvents = calEventsForDate(selectedDate);
                return (
                  <div className="cy-cal-daily">
                    <div className="cy-cal-daily-header">
                      <span className={`cy-cal-daily-date${selectedDate === today ? " today" : ""}`}>
                        {new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                      </span>
                      <span className="cy-badge cy-badge-online" style={{ fontSize: 10, marginLeft: 8 }}>{dayEvents.length} EVENTS</span>
                    </div>
                    {dayEvents.filter(e => e.allDay).length > 0 && (
                      <div className="cy-cal-allday-bar">
                        {dayEvents.filter(e => e.allDay).map(ev => (
                          <div key={ev.id} className="cy-cal-allday-chip"
                            style={{ background: ev.color + "25", borderColor: ev.color, color: ev.color }}
                            onClick={() => openEditEvent(ev)}
                            draggable onDragStart={() => setDragEventId(ev.id)}
                            data-testid={`cal-event-${ev.id}`}
                          >{ev.title}</div>
                        ))}
                      </div>
                    )}
                    <div className="cy-cal-daily-body"
                      onDragOver={e => e.preventDefault()}
                      onDrop={e => {
                        if (!dragEventId) return;
                        const rect = e.currentTarget.getBoundingClientRect();
                        const relY = e.clientY - rect.top;
                        const hour = Math.floor(relY / 60) + 6;
                        handleEventDrop(dragEventId, selectedDate, `${String(Math.min(23, hour)).padStart(2, "0")}:00`);
                        setDragEventId(null);
                      }}
                    >
                      <div className="cy-cal-time-gutter">
                        {HOURS.map(h => (
                          <div key={h} className="cy-cal-hour-label">{h === 0 ? "12 AM" : h < 12 ? `${h} AM` : h === 12 ? "12 PM" : `${h - 12} PM`}</div>
                        ))}
                      </div>
                      <div className="cy-cal-day-col cy-cal-day-col-single">
                        {HOURS.map(h => (
                          <div key={h} className="cy-cal-hour-slot"
                            onClick={() => openEventForm(selectedDate, `${String(h).padStart(2, "0")}:00`)}
                          />
                        ))}
                        {dayEvents.filter(e => !e.allDay).map(ev => {
                          const top = calTimeToY(ev.startTime);
                          const bottom = calTimeToY(ev.endTime);
                          const height = Math.max(30, bottom - top);
                          const tbc = getTimeBlockColor(ev.startTime);
                          return (
                            <div key={ev.id} className={`cy-cal-event-block cy-cal-event-block-daily${ev.image ? " has-image" : ""}`}
                              style={{ top, height, background: ev.image ? `url(${ev.image}) center/cover` : tbc + "25", borderLeft: `4px solid ${tbc}`, color: ev.image ? "#fff" : tbc }}
                              draggable
                              onDragStart={() => setDragEventId(ev.id)}
                              onDragEnd={() => setDragEventId(null)}
                              onClick={e => { e.stopPropagation(); openEditEvent(ev); }}
                              data-testid={`cal-event-${ev.id}`}
                            >
                              {ev.image && <div className="cy-cal-ev-overlay" />}
                              <div className="cy-cal-ev-title">{ev.title}</div>
                              <div className="cy-cal-ev-time">{ev.startTime} – {ev.endTime}</div>
                              {ev.location && <div className="cy-cal-ev-loc"><i className="fa-solid fa-location-dot" style={{ marginRight: 4 }} />{ev.location}</div>}
                              {ev.description && <div className="cy-cal-ev-desc">{ev.description}</div>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {showEventForm && (
              <div className="cy-affirmation-overlay" data-testid="event-form-overlay">
                <div className="cy-affirmation-card cy-event-form-card">
                  <div className="cy-affirmation-sparkle"><i className="fa-solid fa-calendar-days" /></div>
                  <div className="cy-affirmation-title">{editingEvent ? "Edit Event" : "New Event"}</div>
                  <div className="cy-event-form">
                    <input className="cy-input" placeholder="Event title..." value={eventForm.title}
                      onChange={e => setEventForm(f => ({ ...f, title: e.target.value }))}
                      autoFocus data-testid="event-title-input"
                    />
                    <div className="cy-event-form-row">
                      <div className="cy-event-form-field">
                        <label className="cy-field-label">DATE</label>
                        <input type="date" className="cy-input" value={eventForm.date}
                          onChange={e => setEventForm(f => ({ ...f, date: e.target.value }))}
                          data-testid="event-date-input"
                        />
                      </div>
                      <div className="cy-event-form-field">
                        <label className="cy-field-label">CATEGORY</label>
                        <select className="cy-select" value={eventForm.category}
                          onChange={e => setEventForm(f => ({ ...f, category: e.target.value }))}
                          data-testid="event-category-select"
                        >
                          {EVENT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="cy-toggle-row" style={{ padding: "8px 0" }}>
                      <div>
                        <div className="cy-toggle-label">All Day</div>
                      </div>
                      <button className={`cy-toggle-switch${eventForm.allDay ? " on" : ""}`}
                        onClick={() => setEventForm(f => ({ ...f, allDay: !f.allDay }))}
                        data-testid="event-allday-toggle"
                      />
                    </div>
                    {!eventForm.allDay && (
                      <div className="cy-event-form-row">
                        <div className="cy-event-form-field">
                          <label className="cy-field-label">START TIME</label>
                          <input type="time" className="cy-input" value={eventForm.startTime}
                            onChange={e => setEventForm(f => ({ ...f, startTime: e.target.value }))}
                            data-testid="event-start-input"
                          />
                        </div>
                        <div className="cy-event-form-field">
                          <label className="cy-field-label">END TIME</label>
                          <input type="time" className="cy-input" value={eventForm.endTime}
                            onChange={e => setEventForm(f => ({ ...f, endTime: e.target.value }))}
                            data-testid="event-end-input"
                          />
                        </div>
                      </div>
                    )}
                    <input className="cy-input" placeholder="Location (optional)" value={eventForm.location}
                      onChange={e => setEventForm(f => ({ ...f, location: e.target.value }))}
                      data-testid="event-location-input"
                    />
                    <textarea className="cy-input" placeholder="Description (optional)" value={eventForm.description}
                      onChange={e => setEventForm(f => ({ ...f, description: e.target.value }))}
                      rows={3} style={{ resize: "vertical" }}
                      data-testid="event-desc-input"
                    />
                    <div className="cy-field-label">IMAGE</div>
                    <div className="cy-event-image-row">
                      {eventForm.image ? (
                        <div className="cy-event-image-preview">
                          <img src={eventForm.image} alt="Event" />
                          <button className="cy-event-image-remove" onClick={() => setEventForm(f => ({ ...f, image: "" }))} data-testid="event-image-remove">
                            <i className="fa-solid fa-xmark" />
                          </button>
                        </div>
                      ) : (
                        <button className="cy-quick-add-btn" onClick={() => eventImageRef.current?.click()} data-testid="event-image-upload">
                          <i className="fa-solid fa-image" style={{ marginRight: 4 }} />Add Image
                        </button>
                      )}
                      <input type="file" accept="image/*" ref={eventImageRef} style={{ display: "none" }}
                        onChange={e => {
                          const f = e.target.files?.[0];
                          if (!f) return;
                          const reader = new FileReader();
                          reader.onload = () => setEventForm(prev => ({ ...prev, image: reader.result as string }));
                          reader.readAsDataURL(f);
                          e.target.value = "";
                        }}
                      />
                    </div>
                    <div className="cy-field-label">COLOR</div>
                    <div className="cy-event-color-row">
                      {EVENT_COLORS.map(c => (
                        <button key={c} className={`cy-accent-btn${eventForm.color === c ? " selected" : ""}`}
                          style={{ background: c, borderColor: eventForm.color === c ? "#fff" : "transparent", width: 28, height: 28 }}
                          onClick={() => setEventForm(f => ({ ...f, color: c }))}
                          data-testid={`event-color-${c.replace("#", "")}`}
                        />
                      ))}
                    </div>
                    <div className="cy-event-form-actions">
                      <button className="cy-affirmation-close" onClick={saveEvent} data-testid="event-save-btn">
                        <i className="fa-solid fa-check" style={{ marginRight: 6 }} />{editingEvent ? "Save" : "Create"}
                      </button>
                      {editingEvent && (
                        <button className="cy-back-btn" style={{ color: "#ff4081" }} onClick={() => deleteEvent(editingEvent.id)} data-testid="event-delete-btn">
                          <i className="fa-solid fa-trash" style={{ marginRight: 4 }} />Delete
                        </button>
                      )}
                      <button className="cy-back-btn" onClick={() => { setShowEventForm(false); setEditingEvent(null); }} data-testid="event-cancel-btn">Cancel</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {section === "budget" && (() => {
          const monthItems = budgetItems.filter(b => b.date.startsWith(budgetMonth));
          const totalIncome = monthItems.filter(b => b.type === "income").reduce((s, b) => s + b.amount, 0);
          const totalExpense = monthItems.filter(b => b.type === "expense").reduce((s, b) => s + b.amount, 0);
          const balance = totalIncome - totalExpense;
          const expenseByCategory: Record<string, number> = {};
          monthItems.filter(b => b.type === "expense").forEach(b => { expenseByCategory[b.category] = (expenseByCategory[b.category] || 0) + b.amount; });
          const topCategories = Object.entries(expenseByCategory).sort((a, b) => b[1] - a[1]);
          const maxCat = topCategories.length > 0 ? topCategories[0][1] : 1;
          const saveBudgetItem = () => {
            if (!budgetForm.name.trim() || !budgetForm.amount) return;
            const item: BudgetItem = {
              id: editingBudgetItem ? editingBudgetItem.id : Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
              name: budgetForm.name.trim(),
              amount: Math.abs(parseFloat(budgetForm.amount) || 0),
              category: budgetForm.category,
              type: budgetForm.type,
              date: budgetMonth + "-01",
              recurring: budgetForm.recurring,
            };
            if (editingBudgetItem) {
              setBudgetItems(prev => prev.map(b => b.id === editingBudgetItem.id ? item : b));
            } else {
              setBudgetItems(prev => [...prev, item]);
            }
            setShowBudgetForm(false);
            setEditingBudgetItem(null);
            setBudgetForm({ name: "", amount: "", category: "Housing", type: "expense", recurring: false });
          };
          const openEditBudget = (item: BudgetItem) => {
            setEditingBudgetItem(item);
            setBudgetForm({ name: item.name, amount: String(item.amount), category: item.category, type: item.type, recurring: item.recurring || false });
            setShowBudgetForm(true);
          };
          const monthLabel = new Date(budgetMonth + "-15").toLocaleDateString("en-US", { month: "long", year: "numeric" });
          const navMonth = (dir: number) => {
            const d = new Date(budgetMonth + "-15");
            d.setMonth(d.getMonth() + dir);
            setBudgetMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
          };
          return (
            <div className="cy-section">
              <div className="cy-page-header">
                <div className="cy-page-header-row">
                  <h2 className="cy-page-title" data-testid="budget-title"><i className="fa-solid fa-wallet" style={{ marginRight: 10 }} />Household Budget</h2>
                </div>
                <p className="cy-page-subtitle">Track income, expenses, and savings</p>
              </div>

              <div className="cy-budget-nav">
                <button className="cy-cal-nav-btn" onClick={() => navMonth(-1)} data-testid="budget-prev" aria-label="Previous month"><i className="fa-solid fa-chevron-left" /></button>
                <span className="cy-budget-month-label" data-testid="budget-month">{monthLabel}</span>
                <button className="cy-cal-nav-btn" onClick={() => navMonth(1)} data-testid="budget-next" aria-label="Next month"><i className="fa-solid fa-chevron-right" /></button>
                <button className="cy-goal-add-btn" style={{ marginLeft: "auto" }}
                  onClick={() => { setEditingBudgetItem(null); setBudgetForm({ name: "", amount: "", category: "Housing", type: "expense", recurring: false }); setShowBudgetForm(true); }}
                  data-testid="budget-add"
                >
                  <i className="fa-solid fa-plus" style={{ marginRight: 6 }} />Add Entry
                </button>
              </div>

              <div className="cy-budget-summary">
                <div className="cy-budget-stat-card income" data-testid="budget-income">
                  <div className="cy-budget-stat-icon"><i className="fa-solid fa-arrow-trend-up" /></div>
                  <div className="cy-budget-stat-label">Income</div>
                  <div className="cy-budget-stat-value">${totalIncome.toLocaleString("en-US", { minimumFractionDigits: 2 })}</div>
                </div>
                <div className="cy-budget-stat-card expense" data-testid="budget-expense">
                  <div className="cy-budget-stat-icon"><i className="fa-solid fa-arrow-trend-down" /></div>
                  <div className="cy-budget-stat-label">Expenses</div>
                  <div className="cy-budget-stat-value">${totalExpense.toLocaleString("en-US", { minimumFractionDigits: 2 })}</div>
                </div>
                <div className={`cy-budget-stat-card balance${balance >= 0 ? " positive" : " negative"}`} data-testid="budget-balance">
                  <div className="cy-budget-stat-icon"><i className={`fa-solid ${balance >= 0 ? "fa-piggy-bank" : "fa-triangle-exclamation"}`} /></div>
                  <div className="cy-budget-stat-label">Balance</div>
                  <div className="cy-budget-stat-value">{balance >= 0 ? "" : "-"}${Math.abs(balance).toLocaleString("en-US", { minimumFractionDigits: 2 })}</div>
                </div>
              </div>

              {topCategories.length > 0 && (
                <div className="cy-budget-breakdown cy-dash-card">
                  <div className="cy-dash-card-header"><i className="fa-solid fa-chart-pie" style={{ marginRight: 8 }} />Spending Breakdown</div>
                  <div className="cy-budget-bars">
                    {topCategories.map(([cat, amt]) => (
                      <div key={cat} className="cy-budget-bar-row" data-testid={`budget-cat-${cat}`}>
                        <div className="cy-budget-bar-label">
                          <i className={`fa-solid ${BUDGET_CATEGORY_ICONS[cat] || "fa-circle"}`} style={{ marginRight: 6, opacity: 0.7 }} />
                          {cat}
                        </div>
                        <div className="cy-budget-bar-track">
                          <div className="cy-budget-bar-fill" style={{ width: `${(amt / maxCat) * 100}%` }} />
                        </div>
                        <div className="cy-budget-bar-amount">${amt.toLocaleString("en-US", { minimumFractionDigits: 2 })}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {totalIncome > 0 && totalExpense > 0 && (
                <div className="cy-budget-ratio cy-dash-card">
                  <div className="cy-dash-card-header"><i className="fa-solid fa-scale-balanced" style={{ marginRight: 8 }} />Budget Ratio</div>
                  <div className="cy-budget-ratio-bar">
                    <div className="cy-budget-ratio-income" style={{ width: `${(totalIncome / (totalIncome + totalExpense)) * 100}%` }}>
                      Income {Math.round((totalIncome / (totalIncome + totalExpense)) * 100)}%
                    </div>
                    <div className="cy-budget-ratio-expense" style={{ width: `${(totalExpense / (totalIncome + totalExpense)) * 100}%` }}>
                      Expenses {Math.round((totalExpense / (totalIncome + totalExpense)) * 100)}%
                    </div>
                  </div>
                </div>
              )}

              <div className="cy-budget-lists">
                {(["income", "expense"] as const).map(btype => {
                  const items = monthItems.filter(b => b.type === btype).sort((a, b) => b.amount - a.amount);
                  return (
                    <div key={btype} className="cy-budget-list-card cy-dash-card">
                      <div className="cy-dash-card-header">
                        <i className={`fa-solid ${btype === "income" ? "fa-arrow-trend-up" : "fa-arrow-trend-down"}`} style={{ marginRight: 8 }} />
                        {btype === "income" ? "Income" : "Expenses"} ({items.length})
                      </div>
                      {items.length === 0 ? (
                        <div className="cy-budget-empty">No {btype} entries this month</div>
                      ) : (
                        <div className="cy-budget-item-list">
                          {items.map(item => (
                            <div key={item.id} className={`cy-budget-item ${btype}`} data-testid={`budget-item-${item.id}`}>
                              <div className="cy-budget-item-icon">
                                <i className={`fa-solid ${BUDGET_CATEGORY_ICONS[item.category] || "fa-circle"}`} />
                              </div>
                              <div className="cy-budget-item-info">
                                <div className="cy-budget-item-name">{item.name}{item.recurring ? <i className="fa-solid fa-repeat" style={{ fontSize: 10, marginLeft: 6, opacity: 0.5 }} /> : ""}</div>
                                <div className="cy-budget-item-cat">{item.category}</div>
                              </div>
                              <div className={`cy-budget-item-amount ${btype}`}>
                                {btype === "income" ? "+" : "-"}${item.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                              </div>
                              <div className="cy-budget-item-actions">
                                <button className="cy-budget-item-btn" onClick={() => openEditBudget(item)} data-testid={`budget-edit-${item.id}`} aria-label="Edit entry"><i className="fa-solid fa-pen" /></button>
                                <button className="cy-budget-item-btn delete" onClick={() => setBudgetItems(prev => prev.filter(b => b.id !== item.id))} data-testid={`budget-delete-${item.id}`} aria-label="Delete entry"><i className="fa-solid fa-trash" /></button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {showBudgetForm && (
                <div className="cy-affirmation-overlay" data-testid="budget-form-overlay">
                  <div className="cy-affirmation-card cy-event-form-card">
                    <div className="cy-affirmation-sparkle"><i className="fa-solid fa-wallet" /></div>
                    <div className="cy-affirmation-title">{editingBudgetItem ? "Edit Entry" : "Add Budget Entry"}</div>
                    <div className="cy-event-form">
                      <div className="cy-field-label">TYPE</div>
                      <div className="cy-cal-view-tabs" style={{ marginBottom: 4 }}>
                        {(["expense", "income"] as const).map(t => (
                          <button key={t} className={`cy-cal-view-tab${budgetForm.type === t ? " active" : ""}`}
                            onClick={() => setBudgetForm(f => ({ ...f, type: t, category: t === "income" ? "Salary" : "Housing" }))}
                            data-testid={`budget-type-${t}`}
                            style={{ flex: 1 }}
                          >{t === "income" ? "Income" : "Expense"}</button>
                        ))}
                      </div>
                      <div className="cy-event-form-field">
                        <label className="cy-field-label">NAME</label>
                        <input className="cy-input" value={budgetForm.name} onChange={e => setBudgetForm(f => ({ ...f, name: e.target.value }))}
                          placeholder={budgetForm.type === "income" ? "e.g. Monthly salary" : "e.g. Rent payment"}
                          data-testid="budget-input-name"
                        />
                      </div>
                      <div className="cy-event-form-field">
                        <label className="cy-field-label">AMOUNT ($)</label>
                        <input className="cy-input" type="number" min="0" step="0.01" value={budgetForm.amount}
                          onChange={e => setBudgetForm(f => ({ ...f, amount: e.target.value }))}
                          placeholder="0.00"
                          data-testid="budget-input-amount"
                        />
                      </div>
                      <div className="cy-event-form-field">
                        <label className="cy-field-label">CATEGORY</label>
                        <select className="cy-select" value={budgetForm.category}
                          onChange={e => setBudgetForm(f => ({ ...f, category: e.target.value }))}
                          data-testid="budget-input-category"
                        >
                          {(budgetForm.type === "income" ? BUDGET_CATEGORIES_INCOME : BUDGET_CATEGORIES_EXPENSE).map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                      <div className="cy-toggle-row" style={{ padding: "8px 0" }}>
                        <div>
                          <div className="cy-toggle-label">Recurring monthly</div>
                        </div>
                        <button className={`cy-toggle-switch${budgetForm.recurring ? " on" : ""}`}
                          onClick={() => setBudgetForm(f => ({ ...f, recurring: !f.recurring }))}
                          data-testid="budget-input-recurring"
                        />
                      </div>
                      <div className="cy-event-form-actions">
                        <button className="cy-affirmation-close" onClick={saveBudgetItem} data-testid="budget-save">
                          <i className="fa-solid fa-check" style={{ marginRight: 6 }} />{editingBudgetItem ? "Update" : "Add"}
                        </button>
                        <button className="cy-back-btn" onClick={() => { setShowBudgetForm(false); setEditingBudgetItem(null); }}
                          data-testid="budget-cancel">Cancel</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        <audio ref={audioRef} style={{ display: "none" }} />
        <input ref={musicFileRef} type="file" accept="audio/*" multiple style={{ display: "none" }}
          onChange={e => { if (e.target.files) musicUploadFiles(e.target.files); e.target.value = ""; }}
          data-testid="music-file-input"
        />

        {section === "music" && (
          <div className="cy-section">
            <div className="cy-page-header">
              <div className="cy-page-header-row">
                <h2 className="cy-page-title"><i className="fa-solid fa-headphones" style={{ marginRight: 10 }} />Music Player</h2>
              </div>
            </div>

            <div className="cy-music-layout">
              <div className="cy-music-player-card">
                <div className={`cy-music-reactor${musicPlaying ? " spinning" : ""}`} data-testid="music-reactor">
                  <div className="cy-music-reactor-ring outer" />
                  <div className="cy-music-reactor-ring inner" />
                  <div className="cy-music-reactor-label" data-testid="music-track-label">
                    {musicPlaying && musicPlaylist[musicTrackIndex]
                      ? musicPlaylist[musicTrackIndex].name.length > 18
                        ? musicPlaylist[musicTrackIndex].name.slice(0, 18) + "…"
                        : musicPlaylist[musicTrackIndex].name
                      : "IDLE"}
                  </div>
                </div>

                <div className="cy-music-controls">
                  <button className="cy-music-btn" onClick={musicPrev} data-testid="music-prev">
                    <i className="fa-solid fa-backward-step" />
                  </button>
                  <button className="cy-music-btn play" onClick={musicTogglePlay} data-testid="music-play">
                    <i className={`fa-solid ${musicPlaying ? "fa-pause" : "fa-play"}`} />
                  </button>
                  <button className="cy-music-btn" onClick={musicNext} data-testid="music-next">
                    <i className="fa-solid fa-forward-step" />
                  </button>
                </div>

                <div className="cy-music-viz-wrap" data-testid="music-visualizer">
                  <canvas ref={vizCanvasRef} className="cy-music-viz-canvas" />
                  <div className="cy-viz-mode-btns">
                    {(["bars", "circular", "wave"] as const).map(m => (
                      <button key={m} className={`cy-viz-mode-btn${vizMode === m ? " active" : ""}`}
                        onClick={() => setVizMode(m)} data-testid={`viz-mode-${m}`}
                      >
                        <i className={`fa-solid ${m === "bars" ? "fa-chart-bar" : m === "circular" ? "fa-circle-notch" : "fa-wave-square"}`} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="cy-music-playlist-card">
                <div className="cy-music-playlist-header">
                  <i className="fa-solid fa-database" style={{ marginRight: 8 }} />Audio Database
                </div>
                <div className="cy-music-playlist-scroll" data-testid="music-playlist">
                  {musicPlaylist.length === 0 ? (
                    <div className="cy-music-empty">[NO DATA FOUND]</div>
                  ) : (
                    musicPlaylist.map((track, i) => (
                      <div key={i}
                        className={`cy-music-track${i === musicTrackIndex ? " active" : ""}`}
                        onClick={() => musicLoadTrack(i)}
                        data-testid={`music-track-${i}`}
                      >
                        <span className="cy-music-track-name">{track.name}</span>
                        {i === musicTrackIndex && <span className="cy-music-track-status">{musicPlaying ? "PLAYING" : "SELECTED"}</span>}
                      </div>
                    ))
                  )}
                </div>
                <div className="cy-music-btn-group">
                  <button className="cy-music-upload-btn" onClick={() => musicFileRef.current?.click()} data-testid="music-upload">
                    <i className="fa-solid fa-plus" style={{ marginRight: 6 }} />Upload
                  </button>
                  <button className="cy-music-purge-btn" onClick={musicClearAll} data-testid="music-clear">
                    <i className="fa-solid fa-trash" style={{ marginRight: 6 }} />Purge
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {section === "settings" && (
          <div className="cy-section">
            <div className="cy-page-header">
              <div className="cy-page-header-row">
                <div>
                  <div className="cy-page-title">Customize</div>
                  <div className="cy-page-subtitle">Make It Yours ~ Make It Beautiful</div>
                </div>
                <button className="cy-quick-add-btn" onClick={quickNewEntry} data-testid="quick-add-settings">
                  <i className="fa-solid fa-plus" />New Entry
                </button>
              </div>
            </div>
            <div className="cy-page-body">
              <div className="cy-settings-grid">
                <div className="cy-settings-card" style={{ gridColumn: "1 / -1" }}>
                  <div className="cy-settings-card-title">VIBE / THEME</div>
                  <div className="cy-theme-section-label" data-testid="theme-label-dark"><i className="fa-solid fa-moon" style={{ marginRight: 6 }} />Dark Themes</div>
                  <div className="cy-theme-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
                    {THEMES.filter(t => !t.light).map(t => (
                      <div key={t.id} className={`cy-theme-option${theme === t.id ? " selected" : ""}`}
                        onClick={() => setTheme(t.id)} data-testid={`theme-option-${t.id}`}
                      >
                        <div className="cy-theme-dot" style={{ background: t.primary, color: t.primary }} />
                        <div><div style={{ fontWeight: 600, fontSize: 11 }}>{t.label}</div></div>
                      </div>
                    ))}
                  </div>
                  <div className="cy-theme-section-label" style={{ marginTop: 18 }} data-testid="theme-label-light"><i className="fa-solid fa-sun" style={{ marginRight: 6 }} />Light Themes</div>
                  <div className="cy-theme-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
                    {THEMES.filter(t => t.light).map(t => (
                      <div key={t.id} className={`cy-theme-option light${theme === t.id ? " selected" : ""}`}
                        onClick={() => setTheme(t.id)} data-testid={`theme-option-${t.id}`}
                      >
                        <div className="cy-theme-dot" style={{ background: t.primary, color: t.primary }} />
                        <div><div style={{ fontWeight: 600, fontSize: 11 }}>{t.label}</div></div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="cy-settings-card">
                  <div className="cy-settings-card-title">DISPLAY</div>
                  <div className="cy-toggle-row">
                    <div>
                      <div className="cy-toggle-label">Sparkle Overlay</div>
                      <div className="cy-toggle-sub">Dreamy floating sparkle particles</div>
                    </div>
                    <button className={`cy-toggle-switch${crtEnabled ? " on" : ""}`}
                      onClick={() => setCrtEnabled(v => !v)} data-testid="toggle-crt" />
                  </div>
                  <div className="cy-toggle-row">
                    <div>
                      <div className="cy-toggle-label">Cursor Glow</div>
                      <div className="cy-toggle-sub">Neon glow effect follows your cursor</div>
                    </div>
                    <button className={`cy-toggle-switch${cursorGlow ? " on" : ""}`}
                      onClick={() => setCursorGlow(v => !v)} data-testid="toggle-cursor-glow" />
                  </div>
                </div>

                <div className="cy-settings-card">
                  <div className="cy-settings-card-title">TYPOGRAPHY</div>
                  <div className="cy-identity-field">
                    <div className="cy-field-label">EDITOR FONT SIZE</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <input type="range" min={12} max={28} value={editorFontSize}
                        onChange={e => setEditorFontSize(Number(e.target.value))}
                        className="cy-range-input" data-testid="settings-font-size"
                        style={{ flex: 1 }}
                      />
                      <span style={{ fontFamily: "var(--cy-font-ui)", fontSize: 13, fontWeight: 700, color: "var(--cy-primary)", minWidth: 36, textAlign: "center" }}>{editorFontSize}px</span>
                    </div>
                  </div>
                </div>

                <div className="cy-settings-card">
                  <div className="cy-settings-card-title">ACCENT COLOR</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {[
                      { color: "", label: "Default" },
                      { color: "#ff4081", label: "Pink" },
                      { color: "#e040fb", label: "Purple" },
                      { color: "#7c4dff", label: "Violet" },
                      { color: "#00e5ff", label: "Cyan" },
                      { color: "#69f0ae", label: "Mint" },
                      { color: "#ffd740", label: "Gold" },
                      { color: "#ff6d00", label: "Orange" },
                      { color: "#64ffda", label: "Teal" },
                      { color: "#f48fb1", label: "Rose" },
                      { color: "#81d4fa", label: "Sky" },
                      { color: "#ea80fc", label: "Orchid" },
                    ].map(c => (
                      <button key={c.label}
                        className={`cy-accent-btn${accentColor === c.color ? " selected" : ""}`}
                        onClick={() => setAccentColor(c.color)}
                        data-testid={`accent-${c.label.toLowerCase()}`}
                        style={{ background: c.color || "var(--cy-primary)", borderColor: accentColor === c.color ? "#fff" : "transparent" }}
                        title={c.label}
                      />
                    ))}
                  </div>
                  <div className="cy-identity-field" style={{ marginTop: 10 }}>
                    <div className="cy-field-label">CUSTOM COLOR</div>
                    <input type="color" value={accentColor || "#e040fb"}
                      onChange={e => setAccentColor(e.target.value)}
                      className="cy-color-input" data-testid="settings-accent-custom"
                    />
                  </div>
                </div>

                <div className="cy-settings-card">
                  <div className="cy-settings-card-title">BORDERS</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {[
                      { id: "default", label: "Default" },
                      { id: "rounded", label: "Rounded" },
                      { id: "sharp", label: "Sharp" },
                      { id: "dashed", label: "Dashed" },
                      { id: "double", label: "Double" },
                      { id: "glow", label: "Glow" },
                    ].map(b => (
                      <button key={b.id}
                        className={`cy-border-btn${borderStyle === b.id ? " selected" : ""}`}
                        onClick={() => setBorderStyle(b.id)}
                        data-testid={`border-${b.id}`}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="cy-settings-card">
                  <div className="cy-settings-card-title">CANVAS</div>
                  <div className="cy-identity-field">
                    <div className="cy-field-label">CANVAS MODE</div>
                    <select className="cy-select" value={canvasMode}
                      onChange={e => setCanvasMode(e.target.value)} data-testid="settings-canvas"
                    >
                      <option value="canvas-default">Default</option>
                      <option value="canvas-tinted">Tinted</option>
                      <option value="canvas-blueprint">Gradient</option>
                      <option value="canvas-void">Deep Dark</option>
                      <option value="canvas-neon">Glow</option>
                      <option value="canvas-dreamy">Dreamy</option>
                      <option value="canvas-starfield">Starfield</option>
                      <option value="canvas-aurora">Aurora</option>
                      <option value="canvas-soft">Soft Focus</option>
                      <option value="canvas-minimal">Minimal</option>
                      <option value="canvas-prism">Prism</option>
                      <option value="canvas-nebula">Nebula</option>
                      <option value="canvas-ember">Ember</option>
                      <option value="canvas-frost">Frost</option>
                      <option value="canvas-twilight">Twilight</option>
                    </select>
                  </div>
                  <div className="cy-identity-field">
                    <div className="cy-field-label">PAPER PATTERN</div>
                    <select className="cy-select" value={paperPattern}
                      onChange={e => setPaperPattern(e.target.value)} data-testid="settings-paper"
                    >
                      <option value="paper-stars">Stars</option>
                      <option value="paper-hearts">Hearts</option>
                      <option value="paper-grid">Grid</option>
                      <option value="paper-dots">Dots</option>
                      <option value="paper-lines">Lined</option>
                      <option value="paper-blank">Blank</option>
                      <option value="paper-diamonds">Diamonds</option>
                      <option value="paper-waves">Waves</option>
                      <option value="paper-confetti">Confetti</option>
                      <option value="paper-floral">Floral</option>
                      <option value="paper-crosshatch">Crosshatch</option>
                      <option value="paper-hexagons">Hexagons</option>
                      <option value="paper-raindrops">Raindrops</option>
                      <option value="paper-spirals">Spirals</option>
                      <option value="paper-moonlight">Moonlight</option>
                    </select>
                  </div>
                </div>

                <div className="cy-settings-card" style={{ gridColumn: "1 / -1" }}>
                  <div className="cy-settings-card-title">TIPS</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 24px" }}>
                    {[
                      { key: "Ctrl+B", action: "Bold text" },
                      { key: "Ctrl+I", action: "Italic text" },
                      { key: "Ctrl+U", action: "Underline text" },
                      { key: "Ctrl+P", action: "Print / Export" },
                    ].map(s => (
                      <div key={s.key} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "var(--cy-border)" }}>
                        <span style={{ fontFamily: "var(--cy-font-ui)", fontSize: 12, fontWeight: 500, color: "var(--cy-text-muted)" }}>{s.action}</span>
                        <span style={{ fontFamily: "var(--cy-font-ui)", fontSize: 11, fontWeight: 600, color: "var(--cy-primary)", background: "rgba(224,64,251,0.08)", padding: "3px 10px", borderRadius: 8, border: "1px solid rgba(224,64,251,0.15)" }}>
                          {s.key}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ASSET PANEL */}
      <div className={`cy-asset-panel${assetOpen ? " open" : ""}`} data-testid="asset-panel">
        <div className="cy-asset-panel-header">
          <span><i className="fa-solid fa-palette" style={{ marginRight: 8 }} />STICKER LIBRARY</span>
          <button className="cy-asset-close" onClick={() => setAssetOpen(false)} data-testid="btn-close-assets">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>
        <div className="cy-asset-tabs">
          {(Object.keys(STICKER_CATEGORIES) as Array<keyof typeof STICKER_CATEGORIES>).map(cat => (
            <button key={cat} className={`cy-asset-tab${assetTab === cat ? " active" : ""}`}
              onClick={() => setAssetTab(cat)} data-testid={`asset-tab-${cat}`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="cy-tag-grid">
          {STICKER_CATEGORIES[assetTab].map(s => (
            <div key={s.type} className="cy-tag"
              onClick={() => {
                if (section === "mindmap") { addSticker(s.type, "mindmap"); }
                else if (section === "calendar") { addSticker(s.type, "calendar"); }
                else { addSticker(s.type); if (section !== "journal") setSection("journal"); }
              }}
              data-testid={`sticker-btn-${s.type}`}
            >
              {s.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
