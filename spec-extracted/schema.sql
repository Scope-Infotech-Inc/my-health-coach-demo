CREATE TABLE patients (
  id TEXT PRIMARY KEY,                -- 13 demo ids: maria, robert, jim, priya, hector, linda,
                                      --   deshawn, samuel, aisha, carol, miguel, emily, sarah
  first_name TEXT NOT NULL, last_name_initial TEXT NOT NULL,
  age INTEGER NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('diabetes','obesity','comorbid')),  -- demo grouping
  featured INTEGER NOT NULL DEFAULT 0,   -- 1 = pinned "Featured" (sarah)
  plan_type TEXT NOT NULL CHECK (plan_type IN
    ('prevention','t2d_management','t1d_management','obesity_management','comorbid_management')),
  condition_detail TEXT,             -- e.g. 'Type 2 + hypertension', 'Type 2 diabetes + obesity'
  -- ===== v1.3 CMS coverage pathway (every persona has one; North Star is the Medicare beneficiary) =====
  medicare_context TEXT NOT NULL CHECK (medicare_context IN
    ('traditional_65plus','advantage_65plus','disability_under65','esrd','dual_eligible','medicaid','marketplace')),
  dual_eligible INTEGER NOT NULL DEFAULT 0,   -- 1 = enrolled in both Medicare and Medicaid
  -- ===== v1.3 representativeness fields (fictional; assigned to exercise equity/multilingual features) =====
  sex TEXT CHECK (sex IN ('female','male')),
  preferred_language TEXT NOT NULL DEFAULT 'en',  -- BCP-47, e.g. 'en','es','vi'
  race_ethnicity TEXT,               -- OMB SPD-15 minimum categories; 'Hispanic or Latino' captured as ethnicity
  rurality TEXT CHECK (rurality IN ('urban','suburban','rural')),
  allergies TEXT,                    -- JSON array, e.g. ["peanut","shellfish"]
  dietary_prefs TEXT,                -- JSON array, e.g. ["vegetarian"]
  provider_org TEXT NOT NULL, avatar_initials TEXT NOT NULL
);
CREATE TABLE social_drivers (         -- v1.3 health-related social needs (HRSN); Z-coded (illustrative, §11.1)
  id INTEGER PRIMARY KEY, patient_id TEXT NOT NULL REFERENCES patients(id),
  domain TEXT NOT NULL,               -- 'food_insecurity','transportation','social_isolation',
                                      --   'financial_strain','work_schedule','caregiver','language_access'
  status TEXT NOT NULL CHECK (status IN ('at_risk','positive','none')),
  z_code TEXT,                        -- e.g. 'Z59.41'; ILLUSTRATIVE — validate vs current ICD-10-CM (Z55–Z65)
  note TEXT,                          -- plain-language description the app can surface
  surfaces TEXT                       -- JSON array of features it influences, e.g. ["nearby","programs"]
);
CREATE TABLE lab_results (
  id INTEGER PRIMARY KEY, patient_id TEXT NOT NULL REFERENCES patients(id),
  code TEXT NOT NULL,                 -- 'a1c','glucose_fasting','cholesterol_total','bp'
  loinc TEXT,                         -- e.g. '4548-4' (HbA1c); illustrative, validate (§11.1)
  display TEXT NOT NULL, value REAL NOT NULL, value2 REAL, unit TEXT NOT NULL,
  range_flag TEXT NOT NULL CHECK (range_flag IN ('in_range','elevated','above_target','prediabetes')),
  collected_on TEXT NOT NULL, source TEXT NOT NULL
);
CREATE TABLE conditions (             -- problem list (SNOMED-coded)
  id INTEGER PRIMARY KEY, patient_id TEXT NOT NULL REFERENCES patients(id),
  display TEXT NOT NULL, snomed TEXT,   -- e.g. '44054006' (T2DM); illustrative, validate (§11.1)
  onset_date TEXT, status TEXT NOT NULL DEFAULT 'active'
);
CREATE TABLE observations (             -- patient-generated + vitals series
  id INTEGER PRIMARY KEY, patient_id TEXT NOT NULL REFERENCES patients(id),
  type TEXT NOT NULL CHECK (type IN ('glucose_fasting','weight','steps','active_minutes')),
  value REAL NOT NULL, unit TEXT NOT NULL, observed_on TEXT NOT NULL, source TEXT NOT NULL
);
CREATE TABLE medications (
  id INTEGER PRIMARY KEY, patient_id TEXT NOT NULL REFERENCES patients(id),
  name TEXT NOT NULL, rxnorm TEXT,    -- e.g. '6809' (metformin); illustrative, validate (§11.1)
  dose TEXT NOT NULL, timing TEXT NOT NULL, sort INTEGER NOT NULL
);
CREATE TABLE medication_days (          -- adherence grid
  id INTEGER PRIMARY KEY, patient_id TEXT NOT NULL REFERENCES patients(id),
  date TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('taken','partial','missed','pending'))
);
CREATE TABLE med_events_today (
  id INTEGER PRIMARY KEY, medication_id INTEGER NOT NULL REFERENCES medications(id),
  status TEXT NOT NULL CHECK (status IN ('taken','due')), at_time TEXT
);
CREATE TABLE claims_events (
  id INTEGER PRIMARY KEY, patient_id TEXT NOT NULL REFERENCES patients(id),
  kind TEXT NOT NULL,                 -- 'refill_ready'
  description TEXT NOT NULL, location TEXT, event_date TEXT NOT NULL
);
CREATE TABLE nutrition_summary (        -- one row per patient, 7-day rollup
  patient_id TEXT PRIMARY KEY REFERENCES patients(id),
  calories_avg INTEGER, calories_plan INTEGER, fiber_g REAL, fiber_goal_g REAL,
  added_sugar_g REAL, added_sugar_limit_g REAL, dinner_carbs_g REAL, dinner_carbs_target_g REAL,
  sodium_mg INTEGER, sodium_limit_mg INTEGER, days_logged INTEGER, days_total INTEGER
);
CREATE TABLE goals (
  id INTEGER PRIMARY KEY, patient_id TEXT NOT NULL REFERENCES patients(id),
  metric TEXT NOT NULL,               -- 'steps_daily','active_minutes_weekly','weight','a1c'
  target REAL NOT NULL, unit TEXT NOT NULL, label TEXT NOT NULL
);
CREATE TABLE coach_messages (
  id INTEGER PRIMARY KEY, patient_id TEXT NOT NULL REFERENCES patients(id),
  sender_name TEXT NOT NULL, sender_role TEXT NOT NULL,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('human','auto')),
  avatar TEXT NOT NULL, avatar_style TEXT NOT NULL CHECK (avatar_style IN ('navy','gold')),
  body TEXT NOT NULL, sent_label TEXT NOT NULL, action_label TEXT, sort INTEGER NOT NULL
);
CREATE TABLE programs (
  id INTEGER PRIMARY KEY, patient_id TEXT NOT NULL REFERENCES patients(id),
  name TEXT NOT NULL, detail TEXT NOT NULL,
  status_chip TEXT NOT NULL,          -- 'Active','Eligible','Suggested','Available','Near you'
  progress_current INTEGER, progress_total INTEGER,
  milestone_pct REAL, milestone_goal_pct REAL, next_session TEXT, sort INTEGER NOT NULL
);
CREATE TABLE care_team (
  id INTEGER PRIMARY KEY, patient_id TEXT NOT NULL REFERENCES patients(id),
  name TEXT NOT NULL, role TEXT NOT NULL, note TEXT NOT NULL,
  avatar TEXT NOT NULL, avatar_style TEXT NOT NULL, sort INTEGER NOT NULL
);
CREATE TABLE alerts (
  id INTEGER PRIMARY KEY, patient_id TEXT NOT NULL REFERENCES patients(id),
  severity TEXT NOT NULL CHECK (severity IN ('gold','red')),
  title TEXT NOT NULL, body TEXT NOT NULL, cta_label TEXT, created_on TEXT NOT NULL,
  care_team_notified INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE data_sources (
  id INTEGER PRIMARY KEY, patient_id TEXT NOT NULL REFERENCES patients(id),
  name TEXT NOT NULL, description TEXT NOT NULL,
  standards TEXT NOT NULL,            -- JSON array, e.g. ["FHIR R4","US Core"]
  last_sync_at TEXT, continuous INTEGER NOT NULL DEFAULT 0, sort INTEGER NOT NULL
);
CREATE TABLE consents (
  patient_id TEXT PRIMARY KEY REFERENCES patients(id),
  granted_on TEXT NOT NULL, method TEXT NOT NULL,           -- 'SMART on FHIR / OAuth 2.0'
  identity_credential TEXT NOT NULL DEFAULT 'passkey',      -- 'passkey' | 'mdl'
  ial TEXT NOT NULL DEFAULT 'IAL2', aal TEXT NOT NULL DEFAULT 'AAL2',
  access_reads_this_month INTEGER NOT NULL,                 -- summary; detail in access_log
  share_with_care_team INTEGER NOT NULL, ads_blocked INTEGER NOT NULL DEFAULT 1,
  revoked INTEGER NOT NULL DEFAULT 0
);
-- ===== v1.2 directive-alignment tables =====
CREATE TABLE access_log (               -- granular audit trail (FR-10, §11.1)
  id INTEGER PRIMARY KEY, patient_id TEXT NOT NULL REFERENCES patients(id),
  occurred_at TEXT NOT NULL, actor TEXT NOT NULL, actor_role TEXT NOT NULL,  -- org/app/clinician
  scope TEXT NOT NULL,                  -- e.g. 'labs','full_chart','medications'
  purpose_of_use TEXT NOT NULL CHECK (purpose_of_use IN
    ('treatment','individual_access','patient_share','operations'))
);
CREATE TABLE record_locator_results (   -- discovered orgs holding records (FR-13)
  id INTEGER PRIMARY KEY, patient_id TEXT NOT NULL REFERENCES patients(id),
  org_name TEXT NOT NULL, record_count INTEGER NOT NULL, last_updated TEXT
);
CREATE TABLE clinical_documents (       -- unstructured docs + returned visit summaries (FR-31, 6.7/6.8)
  id INTEGER PRIMARY KEY, patient_id TEXT NOT NULL REFERENCES patients(id),
  kind TEXT NOT NULL CHECK (kind IN
    ('radiology','outside_lab','specialist_note','visit_summary','discharge')),
  title TEXT NOT NULL, doc_date TEXT NOT NULL, source_org TEXT NOT NULL,
  mime TEXT NOT NULL,                   -- 'application/pdf' | 'image/tiff' | 'image/jpeg'
  fhir_type TEXT NOT NULL DEFAULT 'DocumentReference',
  body_text TEXT NOT NULL,              -- real DOM text (accessible); styled to look scanned
  ai_read TEXT                          -- precomputed plain-language summary
);
CREATE TABLE ai_insights (              -- proactive interpretive cards (FR-32)
  id INTEGER PRIMARY KEY, patient_id TEXT NOT NULL REFERENCES patients(id),
  kind TEXT NOT NULL CHECK (kind IN ('trend','titration','summary','referral_suggestion')),
  title TEXT NOT NULL, body TEXT NOT NULL,
  basis TEXT NOT NULL,                  -- JSON: which data points it drew on
  surfaced_on TEXT NOT NULL,           -- 'overview' | 'trends' | 'records'
  severity TEXT NOT NULL DEFAULT 'info' CHECK (severity IN ('info','attention')),
  created_on TEXT NOT NULL
);
CREATE TABLE share_sessions (           -- Kill-the-Clipboard outbound + returned summary (FR-30)
  id INTEGER PRIMARY KEY, patient_id TEXT NOT NULL REFERENCES patients(id),
  share_token TEXT NOT NULL,           -- mock token encoded in the QR (no real PHI)
  shared_with_org TEXT, bundle_contents TEXT NOT NULL,  -- JSON list of included resource types
  purpose_of_use TEXT NOT NULL DEFAULT 'treatment',
  shared_on TEXT, return_summary_doc_id INTEGER REFERENCES clinical_documents(id)
);
CREATE TABLE symptom_checkins (         -- conversational symptom/care-plan log (FR-34)
  id INTEGER PRIMARY KEY, patient_id TEXT NOT NULL REFERENCES patients(id),
  text TEXT NOT NULL, red_flag INTEGER NOT NULL DEFAULT 0, logged_on TEXT NOT NULL
);
CREATE TABLE journey_steps (            -- guided "Day in the Life" walkthrough (FR-35)
  id INTEGER PRIMARY KEY, patient_id TEXT NOT NULL REFERENCES patients(id),
  step_no INTEGER NOT NULL, title TEXT NOT NULL, route TEXT NOT NULL, narration TEXT NOT NULL
);
-- ===== v1.1 feature tables =====
CREATE TABLE gamification (             -- one row per patient
  patient_id TEXT PRIMARY KEY REFERENCES patients(id),
  points INTEGER NOT NULL, level_name TEXT NOT NULL,        -- Bronze/Silver/Gold/Platinum
  level_min INTEGER NOT NULL, level_max INTEGER NOT NULL,   -- for the progress ring
  current_streak_days INTEGER NOT NULL, best_streak_days INTEGER NOT NULL,
  streak_habit TEXT NOT NULL                                -- 'logging' | 'meds' | 'activity'
);
CREATE TABLE badges (                   -- global catalog
  id TEXT PRIMARY KEY, name TEXT NOT NULL, description TEXT NOT NULL,
  criterion TEXT NOT NULL, icon TEXT NOT NULL, sort INTEGER NOT NULL
);
CREATE TABLE patient_badges (
  patient_id TEXT NOT NULL REFERENCES patients(id),
  badge_id TEXT NOT NULL REFERENCES badges(id),
  earned INTEGER NOT NULL DEFAULT 0, earned_on TEXT,        -- NULL when locked
  PRIMARY KEY (patient_id, badge_id)
);
CREATE TABLE challenges (
  id INTEGER PRIMARY KEY, patient_id TEXT NOT NULL REFERENCES patients(id),
  title TEXT NOT NULL, progress_current INTEGER NOT NULL, progress_total INTEGER NOT NULL,
  reward_points INTEGER NOT NULL, ends_on TEXT NOT NULL, sort INTEGER NOT NULL
);
CREATE TABLE device_catalog (           -- global list of connectable devices
  id TEXT PRIMARY KEY, brand TEXT NOT NULL, model TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN
    ('watch','scale','bp_cuff','cgm','glucose_meter')),
  metrics TEXT NOT NULL                 -- JSON array, e.g. ["steps","active_minutes"]
);
CREATE TABLE patient_devices (
  id INTEGER PRIMARY KEY, patient_id TEXT NOT NULL REFERENCES patients(id),
  device_id TEXT NOT NULL REFERENCES device_catalog(id),
  connected INTEGER NOT NULL DEFAULT 0, last_sync_at TEXT
);
CREATE TABLE provider_threads (
  id INTEGER PRIMARY KEY, patient_id TEXT NOT NULL REFERENCES patients(id),
  care_team_id INTEGER NOT NULL REFERENCES care_team(id), subject TEXT NOT NULL
);
CREATE TABLE provider_messages (
  id INTEGER PRIMARY KEY, thread_id INTEGER NOT NULL REFERENCES provider_threads(id),
  sender TEXT NOT NULL CHECK (sender IN ('patient','provider','system')),
  body TEXT NOT NULL, attachment_kind TEXT,                 -- e.g. 'data_snapshot:labs'
  sent_label TEXT NOT NULL, sort INTEGER NOT NULL
);
CREATE TABLE provider_replies (         -- seeded simulated-reply bank, topic-keyed
  id INTEGER PRIMARY KEY, topic TEXT NOT NULL, body TEXT NOT NULL
);
CREATE TABLE appointment_slots (
  id INTEGER PRIMARY KEY, patient_id TEXT NOT NULL REFERENCES patients(id),
  care_team_id INTEGER REFERENCES care_team(id),
  slot_datetime TEXT NOT NULL, taken INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE assistant_intents (        -- deterministic AI assistant
  id TEXT PRIMARY KEY, sample_questions TEXT NOT NULL,      -- JSON array
  keywords TEXT NOT NULL,               -- JSON array for matching
  handler TEXT NOT NULL,                -- query key the handler runs
  response_template TEXT NOT NULL       -- with {placeholders} filled from patient data
);
CREATE TABLE assistant_suggested (      -- per-persona suggested-question chips
  id INTEGER PRIMARY KEY, patient_id TEXT NOT NULL REFERENCES patients(id),
  text TEXT NOT NULL, intent_id TEXT REFERENCES assistant_intents(id), sort INTEGER NOT NULL
);
CREATE TABLE local_services (
  id INTEGER PRIMARY KEY,
  category TEXT NOT NULL CHECK (category IN
    ('urgent_care','pharmacy','healthy_shopping','fitness','trail_park')),
  name TEXT NOT NULL, distance_mi REAL NOT NULL, address TEXT NOT NULL,
  hours TEXT NOT NULL, tags TEXT NOT NULL,                  -- JSON array
  map_x REAL NOT NULL, map_y REAL NOT NULL                  -- schematic map pin (0-100)
);
CREATE TABLE recipes (
  id TEXT PRIMARY KEY, title TEXT NOT NULL, prep_minutes INTEGER NOT NULL,
  calories INTEGER NOT NULL, carbs_g REAL, protein_g REAL, fiber_g REAL, sodium_mg INTEGER,
  condition_tags TEXT NOT NULL,         -- JSON array: ['diabetes_friendly','low_sodium',...]
  allergens TEXT NOT NULL,              -- JSON array of contained allergens
  diet TEXT NOT NULL,                   -- JSON array: ['vegetarian','vegan',...]
  ingredients TEXT NOT NULL, steps TEXT NOT NULL  -- JSON arrays
);
CREATE TABLE app_meta ( key TEXT PRIMARY KEY, value TEXT NOT NULL );  -- demo_today, seed_version
