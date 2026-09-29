-- ==============================================================================
-- 004_seed_data.sql: Existing Cyberforage Public Website Content Migration
-- ==============================================================================

-- 1. Global Site Settings
INSERT INTO public.site_settings (
    site_name,
    tagline,
    short_description,
    long_description,
    logo_url,
    favicon_url,
    footer_text,
    copyright_text,
    primary_accent,
    secondary_accent
) VALUES (
    'Cyberforage',
    'Explore. Build. Defend.',
    'A technology ecosystem for cybersecurity, security research, intelligent automation and defensive engineering.',
    'Cyberforage is an independent technology and security platform bringing together security research, defensive engineering, AI automation, and hands-on laboratory environments into a unified ecosystem.',
    '/favicon.svg',
    '/favicon.svg',
    'Explore. Build. Defend.',
    '© 2026 Cyberforage. All rights reserved.',
    '#00F0C0',
    '#A855F7'
) ON CONFLICT DO NOTHING;

-- 2. Contact Information
INSERT INTO public.contact_information (
    display_name,
    email,
    website,
    description
) VALUES (
    'Cyberforage',
    'contact@cyberforage.space',
    'https://cyberforage.space',
    'Communication channel for research collaborations, security projects, and ecosystem inquiries.'
) ON CONFLICT DO NOTHING;

-- 3. Social Links
INSERT INTO public.social_links (platform, label, url, icon, enabled, display_order) VALUES
    ('github', 'GitHub', 'https://github.com/nishchaygaur', 'github', true, 1),
    ('linkedin', 'LinkedIn', 'https://linkedin.com', 'linkedin', true, 2)
ON CONFLICT DO NOTHING;

-- 4. Navigation Items
INSERT INTO public.navigation_items (location, label, url, is_external, enabled, display_order) VALUES
    ('navbar', 'Home', '#home', false, true, 1),
    ('navbar', 'Projects', '#projects', false, true, 2),
    ('navbar', 'Labs', '#labs', false, true, 3),
    ('navbar', 'Research', '#research', false, true, 4),
    ('navbar', 'Tools', '#technologies', false, true, 5),
    ('navbar', 'About', '#ecosystem', false, true, 6),
    ('navbar', 'Contact', '#contact', false, true, 7),
    ('footer', 'Projects', '#projects', false, true, 1),
    ('footer', 'Labs', '#labs', false, true, 2),
    ('footer', 'Research', '#research', false, true, 3),
    ('footer', 'Tools', '#technologies', false, true, 4),
    ('footer', 'About', '#ecosystem', false, true, 5),
    ('footer', 'Contact', '#contact', false, true, 6)
ON CONFLICT DO NOTHING;

-- 5. Technologies
INSERT INTO public.technologies (name, category, description, icon, enabled, display_order) VALUES
    ('Python', 'Core', 'Core language for cybersecurity tooling, automation, and data analysis.', 'terminal', true, 1),
    ('Linux', 'Systems', 'Primary operating environment for defense, analysis, and infrastructure.', 'cpu', true, 2),
    ('PostgreSQL', 'Database', 'Relational database for telemetry, state, and structured logs.', 'database', true, 3),
    ('Docker', 'Container', 'Isolated execution environments for sandbox simulation and tooling.', 'box', true, 4),
    ('GitHub', 'VCS', 'Open-source code repositories, version control, and CI/CD.', 'git-branch', true, 5),
    ('YARA', 'Detection', 'Pattern matching Swiss knife for malware researchers and detection.', 'shield-alert', true, 6),
    ('MITRE', 'Framework', 'MITRE ATT&CK knowledge base of adversary tactics and techniques.', 'target', true, 7),
    ('NIST', 'Standards', 'NIST Cybersecurity Framework standards and defensive baselines.', 'file-text', true, 8),
    ('Cloud', 'Infra', 'Cloud infrastructure security, IAM, and zero-trust architecture.', 'cloud', true, 9),
    ('AI', 'Intelligence', 'Machine learning and LLMs applied to security telemetry and analysis.', 'brain', true, 10)
ON CONFLICT DO NOTHING;

-- 6. Projects & Tags
DO $$
DECLARE
    p_sentinelx_id UUID;
    p_cyberforge_id UUID;
    p_pdf_id UUID;
BEGIN
    -- Project 1: SentinelX
    INSERT INTO public.projects (
        title, slug, short_description, full_description, category, status,
        featured, published, accent_color, icon, display_order
    ) VALUES (
        'SentinelX',
        'sentinelx',
        'AI-Powered SOC & Threat Intelligence Platform',
        'Collects, normalizes and analyzes logs, detects threats, enriches with intelligence and maps to MITRE ATT&CK.',
        'SOC Platform',
        'active',
        true,
        true,
        'cyan',
        'shield-check',
        1
    ) RETURNING id INTO p_sentinelx_id;

    INSERT INTO public.project_tags (project_id, tag) VALUES
        (p_sentinelx_id, 'Logs'),
        (p_sentinelx_id, 'Detect'),
        (p_sentinelx_id, 'Alert'),
        (p_sentinelx_id, 'Enrich'),
        (p_sentinelx_id, 'Risk'),
        (p_sentinelx_id, 'MITRE'),
        (p_sentinelx_id, 'Incident')
    ON CONFLICT DO NOTHING;

    -- Project 2: CyberForge
    INSERT INTO public.projects (
        title, slug, short_description, full_description, category, status,
        featured, published, accent_color, icon, display_order
    ) VALUES (
        'CyberForge',
        'cyberforge',
        'Advanced Attack Simulation & Defense Lab',
        'A controlled environment for attack simulation, defensive validation, telemetry and detection evaluation.',
        'Attack Simulation',
        'active',
        true,
        true,
        'purple',
        'box',
        2
    ) RETURNING id INTO p_cyberforge_id;

    INSERT INTO public.project_tags (project_id, tag) VALUES
        (p_cyberforge_id, 'Attack Simulation'),
        (p_cyberforge_id, 'Defense Lab'),
        (p_cyberforge_id, 'Telemetry')
    ON CONFLICT DO NOTHING;

    -- Project 3: PDF Malware Analyzer
    INSERT INTO public.projects (
        title, slug, short_description, full_description, category, status,
        featured, published, accent_color, icon, display_order
    ) VALUES (
        'PDF Malware Analyzer',
        'pdf-malware-analyzer',
        'Detects malicious behavior in PDF files.',
        'Analyzes PDF structure, behavior and indicators to identify potential threats.',
        'Malware Analysis',
        'active',
        true,
        true,
        'rose',
        'file-search',
        3
    ) RETURNING id INTO p_pdf_id;

    INSERT INTO public.project_tags (project_id, tag) VALUES
        (p_pdf_id, 'YARA'),
        (p_pdf_id, 'Static Analysis'),
        (p_pdf_id, 'Malware Detection')
    ON CONFLICT DO NOTHING;
END $$;

-- 7. Exploration Items
INSERT INTO public.exploration_items (title, description, icon, accent, link, published, display_order) VALUES
    ('Cyber Defense', 'SOC, detection engineering, SIEM, incident response.', 'shield', 'border-cyan-500/30 text-[#00F0C0]', '#projects', true, 1),
    ('Threat Intelligence', 'Threat analysis, indicators, MITRE ATT&CK, enrichment.', 'target', 'border-blue-500/30 text-blue-400', '#projects', true, 2),
    ('Security Research', 'Vulnerability research, malware analysis, DFIR.', 'flask', 'border-purple-500/30 text-purple-400', '#research', true, 3),
    ('AI × Security', 'AI-assisted analysis, security agents, ML.', 'brain', 'border-emerald-500/30 text-emerald-400', '#research', true, 4),
    ('Cloud & Enterprise', 'Identity, endpoint, Zero Trust, Microsoft security.', 'cloud', 'border-sky-500/30 text-sky-400', '#technologies', true, 5),
    ('Automation', 'Security workflows, AI automation, orchestration.', 'gear', 'border-amber-500/30 text-amber-400', '#technologies', true, 6)
ON CONFLICT DO NOTHING;

-- 8. Labs
INSERT INTO public.labs (name, slug, description, category, status, difficulty, icon, featured, published, display_order) VALUES
    ('CyberForge', 'cyberforge-lab', 'Controlled attack simulation, defensive validation and telemetry evaluation.', 'Attack Simulation', 'available', 'Intermediate', 'cube', true, true, 1),
    ('Detection Engineering', 'detection-engineering', 'Hands-on detection engineering, SIEM rules and threat detection pipelines.', 'SOC', 'available', 'Intermediate', 'shield', true, true, 2),
    ('DFIR', 'dfir-lab', 'Digital forensics and incident response scenario investigation.', 'Forensics', 'available', 'Advanced', 'search', true, true, 3),
    ('Malware Analysis', 'malware-analysis-lab', 'Static and dynamic analysis of suspicious binaries and documents.', 'Analysis', 'available', 'Advanced', 'bug', true, true, 4),
    ('Network Security', 'network-security-lab', 'Network traffic analysis, packet inspection and intrusion detection.', 'Networking', 'available', 'Beginner', 'network', true, true, 5)
ON CONFLICT DO NOTHING;

-- 9. Research Articles
INSERT INTO public.research_articles (
    title, slug, excerpt, content, author, publication_date, category, reading_time, featured, published
) VALUES
    (
        'Understanding Modern Phishing Tactics',
        'understanding-modern-phishing-tactics',
        'A deep dive into current phishing techniques, indicators and detection strategies.',
        'An in-depth analysis of modern phishing execution tactics, credential harvesting schemes, and automated detection methodologies utilizing behavioral heuristics and telemetry.',
        'Cyberforage Research',
        '2025-05-28',
        'Threat Intelligence',
        '6 min read',
        true,
        true
    ),
    (
        'The Rise of Stealer Malware',
        'the-rise-of-stealer-malware',
        'Analyzing the latest trends in information stealers and their impact.',
        'Comprehensive breakdown of contemporary information stealer families, memory extraction techniques, and defensive hardening strategies against browser and credential vaults compromise.',
        'Cyberforage Research',
        '2025-05-19',
        'Security Research',
        '8 min read',
        true,
        true
    ),
    (
        'LLMs in Cybersecurity Operations',
        'llms-in-cybersecurity-operations',
        'How large language models are changing threat detection and response.',
        'Exploration of machine intelligence and LLM integration in Security Operations Centers (SOC), incident summarization, triage acceleration, and false-positive reduction.',
        'Cyberforage Research',
        '2025-05-12',
        'AI & Security',
        '5 min read',
        true,
        true
    )
ON CONFLICT DO NOTHING;

-- 10. SEO Settings
INSERT INTO public.seo_settings (
    meta_title,
    meta_description,
    keywords,
    og_title,
    og_description,
    og_image_url,
    twitter_title,
    twitter_description,
    canonical_url,
    robots_index,
    robots_follow
) VALUES (
    'Cyberforage — Explore. Build. Defend.',
    'Cyberforage is a technology ecosystem exploring cybersecurity, security research, AI, intelligent automation and defensive engineering.',
    ARRAY['Cybersecurity', 'Security Research', 'AI', 'Intelligent Automation', 'Defensive Engineering', 'SOC', 'Threat Intelligence', 'DFIR', 'Open Source Security'],
    'Cyberforage — Explore. Build. Defend.',
    'Cyberforage is a technology ecosystem exploring cybersecurity, security research, AI, intelligent automation and defensive engineering.',
    '/og-image.png',
    'Cyberforage — Explore. Build. Defend.',
    'Cyberforage is a technology ecosystem exploring cybersecurity, security research, AI, intelligent automation and defensive engineering.',
    'https://cyberforage.space',
    true,
    true
) ON CONFLICT DO NOTHING;

-- 11. Appearance Settings
INSERT INTO public.appearance_settings (
    primary_accent,
    secondary_accent,
    background_color,
    text_color,
    card_background,
    border_color,
    glow_intensity,
    border_radius
) VALUES (
    '#00F0C0',
    '#A855F7',
    '#040812',
    '#F8FAFC',
    '#081220',
    'rgba(255,255,255,0.08)',
    'medium',
    'rounded-xl'
) ON CONFLICT DO NOTHING;
