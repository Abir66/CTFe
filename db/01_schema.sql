-- Tables, identity sequences and constraints.

-- hints
CREATE TABLE public.hints (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    description text,
    has_penalty boolean,
    penalty_score bigint,
    problem_id bigint
);

-- announcements
CREATE TABLE public.announcements (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    contest_id bigint,
    title text,
    description text,
    announcer bigint
);

-- assigns_variation
CREATE TABLE public.assigns_variation (
    team_id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    variation_id bigint NOT NULL,
    problem_id bigint NOT NULL
);

-- banned_users
CREATE TABLE public.banned_users (
    user_id bigint NOT NULL,
    contest_id bigint NOT NULL
);

-- blogs
CREATE TABLE public.blogs (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    title text DEFAULT ''::text,
    user_id bigint,
    up_votes bigint DEFAULT '0'::bigint,
    down_votes bigint DEFAULT '0'::bigint
);

-- blogs_comments
CREATE TABLE public.blogs_comments (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id bigint,
    blog_id bigint,
    content text
);

-- blogs_contents
CREATE TABLE public.blogs_contents (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    type text,
    content text,
    blog_id bigint
);

-- blogs_votes
CREATE TABLE public.blogs_votes (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    type text,
    user_id bigint,
    blog_id bigint
);

-- contests
CREATE TABLE public.contests (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    description text,
    start_time timestamp with time zone,
    type text,
    memberlimit bigint DEFAULT '4'::bigint,
    contest_name text,
    end_time timestamp with time zone,
    format text DEFAULT 'Jeopardy'::text,
    registration_paused boolean DEFAULT false,
    contest_password text,
    contest_paused boolean DEFAULT false,
    created_by bigint
);

-- contest_problem_prerequisites
CREATE TABLE public.contest_problem_prerequisites (
    dependent bigint,
    depends_on bigint
);

-- contest_problems
CREATE TABLE public.contest_problems (
    id bigint NOT NULL,
    contest_id bigint NOT NULL,
    category text,
    title text,
    score bigint DEFAULT '0'::bigint NOT NULL,
    problem_hidden boolean,
    max_attempts bigint DEFAULT '10'::bigint,
    author_id bigint
);

-- contest_solves
CREATE TABLE public.contest_solves (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id bigint,
    team_id bigint,
    problem_id bigint,
    contest_id bigint,
    submission_id bigint
);

-- contest_submissions
CREATE TABLE public.contest_submissions (
    id bigint NOT NULL,
    "time" timestamp with time zone DEFAULT now() NOT NULL,
    user_id bigint,
    contest_id bigint,
    problem_id bigint,
    variation_id bigint,
    verdict text,
    flag text,
    team_id bigint
);

-- contest_threads
CREATE TABLE public.contest_threads (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    title text,
    team_id bigint,
    contest_id bigint,
    user_id bigint,
    status boolean DEFAULT false NOT NULL,
    last_updated timestamp with time zone DEFAULT now()
);

-- contest_threads_chats
CREATE TABLE public.contest_threads_chats (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id bigint,
    text text,
    image text,
    thread_id bigint
);

-- flag_mismatch
CREATE TABLE public.flag_mismatch (
    id bigint NOT NULL,
    "time" timestamp with time zone DEFAULT now() NOT NULL,
    user_id bigint,
    contest_id bigint,
    problem_id bigint,
    assigned_variation_id bigint,
    flag text,
    team_id bigint,
    submitted_variation_id bigint,
    submission_id bigint
);

-- hint_unlocks
CREATE TABLE public.hint_unlocks (
    team_id bigint NOT NULL,
    hint_id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- hints_duplicate
CREATE TABLE public.hints_duplicate (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    description text,
    has_penalty boolean,
    penalty_score bigint,
    problem_id bigint
);

-- organizer_invites
CREATE TABLE public.organizer_invites (
    invitee_id bigint NOT NULL,
    inviter_id bigint,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    contest_id bigint NOT NULL
);

-- organizers
CREATE TABLE public.organizers (
    user_id bigint NOT NULL,
    contest_id bigint NOT NULL
);

-- private_contest_access
CREATE TABLE public.private_contest_access (
    contest_id bigint NOT NULL,
    user_id bigint NOT NULL
);

-- problem_attachments
CREATE TABLE public.problem_attachments (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    variation_id bigint,
    link text,
    file_name text,
    saved_on_storage boolean
);

-- problem_variations
CREATE TABLE public.problem_variations (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    description text,
    flags text[],
    problem_id bigint,
    variation_name text
);

-- team_attempts
CREATE TABLE public.team_attempts (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    team_id bigint,
    problem_id bigint,
    contest_id bigint,
    attempt_count bigint DEFAULT '1'::bigint
);

-- team_invites
CREATE TABLE public.team_invites (
    invitee_id bigint NOT NULL,
    team_id bigint NOT NULL,
    inviter_id bigint,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    contest_id bigint
);

-- team_members
CREATE TABLE public.team_members (
    contest_id bigint NOT NULL,
    team_id bigint NOT NULL,
    joined_at timestamp with time zone DEFAULT now(),
    status text,
    user_id bigint NOT NULL
);

-- teams
CREATE TABLE public.teams (
    id bigint NOT NULL,
    name text,
    token uuid DEFAULT gen_random_uuid(),
    contest_id bigint,
    leader_id bigint,
    allow_join_via_password boolean DEFAULT false NOT NULL,
    team_password text,
    variation_generator bigint DEFAULT '47'::bigint,
    status text,
    created_at timestamp with time zone DEFAULT now()
);

-- upsolving_solves
CREATE TABLE public.upsolving_solves (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id bigint,
    problem_id bigint,
    submission_id bigint,
    variation_id bigint
);

-- upsolving_submissions
CREATE TABLE public.upsolving_submissions (
    id bigint NOT NULL,
    "time" timestamp with time zone DEFAULT now() NOT NULL,
    user_id bigint,
    problem_id bigint,
    variation_id bigint,
    verdict text,
    flag text
);

-- users
CREATE TABLE public.users (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    username text NOT NULL,
    email character varying NOT NULL,
    password_hash text NOT NULL
);

-- Hints_id_seq
ALTER TABLE public.hints ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public."Hints_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

-- announcements_id_seq
ALTER TABLE public.announcements ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.announcements_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

-- banned_users_user_id_seq
ALTER TABLE public.banned_users ALTER COLUMN user_id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.banned_users_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

-- blogs_comments_id_seq
ALTER TABLE public.blogs_comments ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.blogs_comments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

-- blogs_contents_id_seq
ALTER TABLE public.blogs_contents ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.blogs_contents_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

-- blogs_id_seq
ALTER TABLE public.blogs ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.blogs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

-- blogs_votes_id_seq
ALTER TABLE public.blogs_votes ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.blogs_votes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

-- contest_id_seq
ALTER TABLE public.contests ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.contest_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

-- contest_problems_id_seq
ALTER TABLE public.contest_problems ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.contest_problems_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

-- contest_threads_chats_id_seq
ALTER TABLE public.contest_threads_chats ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.contest_threads_chats_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

-- flag_mismatch_id_seq
ALTER TABLE public.flag_mismatch ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.flag_mismatch_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

-- hints_duplicate_id_seq
ALTER TABLE public.hints_duplicate ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.hints_duplicate_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

-- private_contest_access_contest_id_seq
ALTER TABLE public.private_contest_access ALTER COLUMN contest_id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.private_contest_access_contest_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

-- problem_attachments_id_seq
ALTER TABLE public.problem_attachments ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.problem_attachments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

-- problem_variations_id_seq
ALTER TABLE public.problem_variations ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.problem_variations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

-- solves_id_seq
ALTER TABLE public.contest_solves ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.solves_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

-- submissions_id_seq
ALTER TABLE public.contest_submissions ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.submissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

-- team_attempts_id_seq
ALTER TABLE public.team_attempts ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.team_attempts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

-- teams_id_seq
ALTER TABLE public.teams ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.teams_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

-- threads_id_seq
ALTER TABLE public.contest_threads ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.threads_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

-- upsolving_solves_id_seq
ALTER TABLE public.upsolving_solves ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.upsolving_solves_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

-- upsolving_submissions_id_seq
ALTER TABLE public.upsolving_submissions ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.upsolving_submissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

-- users_id_seq
ALTER TABLE public.users ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

-- hints Hints_pkey
ALTER TABLE ONLY public.hints
    ADD CONSTRAINT "Hints_pkey" PRIMARY KEY (id);

-- announcements announcements_pkey
ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT announcements_pkey PRIMARY KEY (id);

-- assigns_variation assigns_variation_pkey
ALTER TABLE ONLY public.assigns_variation
    ADD CONSTRAINT assigns_variation_pkey PRIMARY KEY (team_id, problem_id);

-- banned_users banned_users_pkey
ALTER TABLE ONLY public.banned_users
    ADD CONSTRAINT banned_users_pkey PRIMARY KEY (user_id, contest_id);

-- blogs_comments blogs_comments_pkey
ALTER TABLE ONLY public.blogs_comments
    ADD CONSTRAINT blogs_comments_pkey PRIMARY KEY (id);

-- blogs_contents blogs_contents_pkey
ALTER TABLE ONLY public.blogs_contents
    ADD CONSTRAINT blogs_contents_pkey PRIMARY KEY (id);

-- blogs blogs_pkey
ALTER TABLE ONLY public.blogs
    ADD CONSTRAINT blogs_pkey PRIMARY KEY (id);

-- blogs_votes blogs_votes_pkey
ALTER TABLE ONLY public.blogs_votes
    ADD CONSTRAINT blogs_votes_pkey PRIMARY KEY (id);

-- contests contest_pkey
ALTER TABLE ONLY public.contests
    ADD CONSTRAINT contest_pkey PRIMARY KEY (id);

-- contest_problems contest_problems_pkey
ALTER TABLE ONLY public.contest_problems
    ADD CONSTRAINT contest_problems_pkey PRIMARY KEY (id);

-- contest_threads_chats contest_threads_chats_pkey
ALTER TABLE ONLY public.contest_threads_chats
    ADD CONSTRAINT contest_threads_chats_pkey PRIMARY KEY (id);

-- flag_mismatch flag_mismatch_pkey
ALTER TABLE ONLY public.flag_mismatch
    ADD CONSTRAINT flag_mismatch_pkey PRIMARY KEY (id);

-- hints_duplicate hints_duplicate_pkey
ALTER TABLE ONLY public.hints_duplicate
    ADD CONSTRAINT hints_duplicate_pkey PRIMARY KEY (id);

-- organizer_invites organizer_invites_pkey
ALTER TABLE ONLY public.organizer_invites
    ADD CONSTRAINT organizer_invites_pkey PRIMARY KEY (invitee_id, contest_id);

-- organizers organizers_pkey
ALTER TABLE ONLY public.organizers
    ADD CONSTRAINT organizers_pkey PRIMARY KEY (user_id, contest_id);

-- private_contest_access private_contest_access_pkey
ALTER TABLE ONLY public.private_contest_access
    ADD CONSTRAINT private_contest_access_pkey PRIMARY KEY (contest_id, user_id);

-- problem_attachments problem_attachments_pkey
ALTER TABLE ONLY public.problem_attachments
    ADD CONSTRAINT problem_attachments_pkey PRIMARY KEY (id);

-- problem_variations problem_variations_pkey
ALTER TABLE ONLY public.problem_variations
    ADD CONSTRAINT problem_variations_pkey PRIMARY KEY (id);

-- contest_solves solves_pkey
ALTER TABLE ONLY public.contest_solves
    ADD CONSTRAINT solves_pkey PRIMARY KEY (id);

-- contest_submissions submissions_pkey
ALTER TABLE ONLY public.contest_submissions
    ADD CONSTRAINT submissions_pkey PRIMARY KEY (id);

-- team_attempts team_attempts_pkey
ALTER TABLE ONLY public.team_attempts
    ADD CONSTRAINT team_attempts_pkey PRIMARY KEY (id);

-- team_invites team_invites_pkey
ALTER TABLE ONLY public.team_invites
    ADD CONSTRAINT team_invites_pkey PRIMARY KEY (invitee_id, team_id);

-- team_members team_members_pkey
ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_pkey PRIMARY KEY (contest_id, team_id, user_id);

-- teams teams_pkey
ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_pkey PRIMARY KEY (id);

-- contest_threads threads_pkey
ALTER TABLE ONLY public.contest_threads
    ADD CONSTRAINT threads_pkey PRIMARY KEY (id);

-- team_members unique_team_members
ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT unique_team_members UNIQUE (user_id, contest_id);

-- teams unique_team_name_contest
ALTER TABLE ONLY public.teams
    ADD CONSTRAINT unique_team_name_contest UNIQUE (name, contest_id);

-- contest_solves unique_team_solves
ALTER TABLE ONLY public.contest_solves
    ADD CONSTRAINT unique_team_solves UNIQUE (team_id, problem_id);

-- hint_unlocks unlocks_pkey
ALTER TABLE ONLY public.hint_unlocks
    ADD CONSTRAINT unlocks_pkey PRIMARY KEY (team_id, hint_id);

-- upsolving_solves upsolving_solves_pkey
ALTER TABLE ONLY public.upsolving_solves
    ADD CONSTRAINT upsolving_solves_pkey PRIMARY KEY (id);

-- upsolving_submissions upsolving_submissions_pkey
ALTER TABLE ONLY public.upsolving_submissions
    ADD CONSTRAINT upsolving_submissions_pkey PRIMARY KEY (id);

-- users users_email_key
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);

-- users users_pkey
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);

-- users users_username_key
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);

-- contest_problem_prerequisites contest_problem_prerequisites_dependent_fkey
ALTER TABLE ONLY public.contest_problem_prerequisites
    ADD CONSTRAINT contest_problem_prerequisites_dependent_fkey FOREIGN KEY (dependent) REFERENCES public.contest_problems(id) ON DELETE CASCADE;

-- contest_problem_prerequisites contest_problem_prerequisites_depends_on_fkey
ALTER TABLE ONLY public.contest_problem_prerequisites
    ADD CONSTRAINT contest_problem_prerequisites_depends_on_fkey FOREIGN KEY (depends_on) REFERENCES public.contest_problems(id) ON DELETE CASCADE;

-- contest_problems contest_problems_contest_id_fkey
ALTER TABLE ONLY public.contest_problems
    ADD CONSTRAINT contest_problems_contest_id_fkey FOREIGN KEY (contest_id) REFERENCES public.contests(id) ON DELETE CASCADE;

-- contest_solves contest_solves_submission_id_fkey
ALTER TABLE ONLY public.contest_solves
    ADD CONSTRAINT contest_solves_submission_id_fkey FOREIGN KEY (submission_id) REFERENCES public.contest_submissions(id) ON DELETE CASCADE;

-- contest_solves contest_solves_team_id_fkey
ALTER TABLE ONLY public.contest_solves
    ADD CONSTRAINT contest_solves_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE;

-- contest_submissions contest_submissions_team_id_fkey
ALTER TABLE ONLY public.contest_submissions
    ADD CONSTRAINT contest_submissions_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE;

-- contest_threads_chats contest_threads_chats_thread_id_fkey
ALTER TABLE ONLY public.contest_threads_chats
    ADD CONSTRAINT contest_threads_chats_thread_id_fkey FOREIGN KEY (thread_id) REFERENCES public.contest_threads(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- contest_threads contest_threads_team_id_fkey
ALTER TABLE ONLY public.contest_threads
    ADD CONSTRAINT contest_threads_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE;

-- hint_unlocks hint_unlocks_hint_id_fkey
ALTER TABLE ONLY public.hint_unlocks
    ADD CONSTRAINT hint_unlocks_hint_id_fkey FOREIGN KEY (hint_id) REFERENCES public.hints(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- hint_unlocks hint_unlocks_team_id_fkey
ALTER TABLE ONLY public.hint_unlocks
    ADD CONSTRAINT hint_unlocks_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- hints_duplicate hints_duplicate_problem_id_fkey
ALTER TABLE ONLY public.hints_duplicate
    ADD CONSTRAINT hints_duplicate_problem_id_fkey FOREIGN KEY (problem_id) REFERENCES public.contest_problems(id) ON DELETE CASCADE;

-- private_contest_access private_contest_access_contest_id_fkey
ALTER TABLE ONLY public.private_contest_access
    ADD CONSTRAINT private_contest_access_contest_id_fkey FOREIGN KEY (contest_id) REFERENCES public.contests(id) ON DELETE CASCADE;

-- private_contest_access private_contest_access_user_id_fkey
ALTER TABLE ONLY public.private_contest_access
    ADD CONSTRAINT private_contest_access_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- problem_attachments problem_attachments_variation_id_fkey
ALTER TABLE ONLY public.problem_attachments
    ADD CONSTRAINT problem_attachments_variation_id_fkey FOREIGN KEY (variation_id) REFERENCES public.problem_variations(id) ON DELETE CASCADE;

-- problem_variations problem_variations_problem_id_fkey
ALTER TABLE ONLY public.problem_variations
    ADD CONSTRAINT problem_variations_problem_id_fkey FOREIGN KEY (problem_id) REFERENCES public.contest_problems(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- announcements public_announcements_announcer_fkey
ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT public_announcements_announcer_fkey FOREIGN KEY (announcer) REFERENCES public.users(id) ON DELETE CASCADE;

-- announcements public_announcements_contest_id_fkey
ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT public_announcements_contest_id_fkey FOREIGN KEY (contest_id) REFERENCES public.contests(id) ON DELETE CASCADE;

-- assigns_variation public_assigns_variation_problem_id_fkey
ALTER TABLE ONLY public.assigns_variation
    ADD CONSTRAINT public_assigns_variation_problem_id_fkey FOREIGN KEY (problem_id) REFERENCES public.contest_problems(id) ON DELETE CASCADE;

-- assigns_variation public_assigns_variation_team_id_fkey
ALTER TABLE ONLY public.assigns_variation
    ADD CONSTRAINT public_assigns_variation_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE;

-- assigns_variation public_assigns_variation_variation_id_fkey
ALTER TABLE ONLY public.assigns_variation
    ADD CONSTRAINT public_assigns_variation_variation_id_fkey FOREIGN KEY (variation_id) REFERENCES public.problem_variations(id) ON DELETE CASCADE;

-- banned_users public_banned_users_contest_id_fkey
ALTER TABLE ONLY public.banned_users
    ADD CONSTRAINT public_banned_users_contest_id_fkey FOREIGN KEY (contest_id) REFERENCES public.contests(id) ON DELETE CASCADE;

-- banned_users public_banned_users_user_id_fkey
ALTER TABLE ONLY public.banned_users
    ADD CONSTRAINT public_banned_users_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- blogs_comments public_blogs_comments_user_id_fkey
ALTER TABLE ONLY public.blogs_comments
    ADD CONSTRAINT public_blogs_comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- blogs_contents public_blogs_contents_blog_id_fkey
ALTER TABLE ONLY public.blogs_contents
    ADD CONSTRAINT public_blogs_contents_blog_id_fkey FOREIGN KEY (blog_id) REFERENCES public.blogs(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- blogs public_blogs_user_id_fkey
ALTER TABLE ONLY public.blogs
    ADD CONSTRAINT public_blogs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- blogs_votes public_blogs_votes_blog_id_fkey
ALTER TABLE ONLY public.blogs_votes
    ADD CONSTRAINT public_blogs_votes_blog_id_fkey FOREIGN KEY (blog_id) REFERENCES public.blogs(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- blogs_votes public_blogs_votes_user_id_fkey
ALTER TABLE ONLY public.blogs_votes
    ADD CONSTRAINT public_blogs_votes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- contest_problems public_contest_problems_author_id_fkey
ALTER TABLE ONLY public.contest_problems
    ADD CONSTRAINT public_contest_problems_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- contest_solves public_contest_solves_contest_id_fkey
ALTER TABLE ONLY public.contest_solves
    ADD CONSTRAINT public_contest_solves_contest_id_fkey FOREIGN KEY (contest_id) REFERENCES public.contests(id) ON DELETE CASCADE;

-- contest_solves public_contest_solves_problem_id_fkey
ALTER TABLE ONLY public.contest_solves
    ADD CONSTRAINT public_contest_solves_problem_id_fkey FOREIGN KEY (problem_id) REFERENCES public.contest_problems(id) ON DELETE CASCADE;

-- contest_solves public_contest_solves_user_id_fkey
ALTER TABLE ONLY public.contest_solves
    ADD CONSTRAINT public_contest_solves_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- contest_submissions public_contest_submissions_contest_id_fkey
ALTER TABLE ONLY public.contest_submissions
    ADD CONSTRAINT public_contest_submissions_contest_id_fkey FOREIGN KEY (contest_id) REFERENCES public.contests(id) ON DELETE CASCADE;

-- contest_submissions public_contest_submissions_problem_id_fkey
ALTER TABLE ONLY public.contest_submissions
    ADD CONSTRAINT public_contest_submissions_problem_id_fkey FOREIGN KEY (problem_id) REFERENCES public.contest_problems(id) ON DELETE CASCADE;

-- contest_submissions public_contest_submissions_user_id_fkey
ALTER TABLE ONLY public.contest_submissions
    ADD CONSTRAINT public_contest_submissions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- contest_submissions public_contest_submissions_variation_id_fkey
ALTER TABLE ONLY public.contest_submissions
    ADD CONSTRAINT public_contest_submissions_variation_id_fkey FOREIGN KEY (variation_id) REFERENCES public.problem_variations(id) ON DELETE CASCADE;

-- contest_threads_chats public_contest_threads_chats_user_id_fkey
ALTER TABLE ONLY public.contest_threads_chats
    ADD CONSTRAINT public_contest_threads_chats_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- contest_threads public_contest_threads_contest_id_fkey
ALTER TABLE ONLY public.contest_threads
    ADD CONSTRAINT public_contest_threads_contest_id_fkey FOREIGN KEY (contest_id) REFERENCES public.contests(id) ON DELETE CASCADE;

-- contest_threads public_contest_threads_user_id_fkey
ALTER TABLE ONLY public.contest_threads
    ADD CONSTRAINT public_contest_threads_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- contests public_contests_created_by_fkey
ALTER TABLE ONLY public.contests
    ADD CONSTRAINT public_contests_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- flag_mismatch public_flag_mismatch_assigned_variation_id_fkey
ALTER TABLE ONLY public.flag_mismatch
    ADD CONSTRAINT public_flag_mismatch_assigned_variation_id_fkey FOREIGN KEY (assigned_variation_id) REFERENCES public.problem_variations(id) ON DELETE CASCADE;

-- flag_mismatch public_flag_mismatch_contest_id_fkey
ALTER TABLE ONLY public.flag_mismatch
    ADD CONSTRAINT public_flag_mismatch_contest_id_fkey FOREIGN KEY (contest_id) REFERENCES public.contests(id) ON DELETE CASCADE;

-- flag_mismatch public_flag_mismatch_problem_id_fkey
ALTER TABLE ONLY public.flag_mismatch
    ADD CONSTRAINT public_flag_mismatch_problem_id_fkey FOREIGN KEY (problem_id) REFERENCES public.contest_problems(id) ON DELETE CASCADE;

-- flag_mismatch public_flag_mismatch_submitted_variation_id_fkey
ALTER TABLE ONLY public.flag_mismatch
    ADD CONSTRAINT public_flag_mismatch_submitted_variation_id_fkey FOREIGN KEY (submitted_variation_id) REFERENCES public.problem_variations(id) ON DELETE CASCADE;

-- flag_mismatch public_flag_mismatch_team_id_fkey
ALTER TABLE ONLY public.flag_mismatch
    ADD CONSTRAINT public_flag_mismatch_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE;

-- flag_mismatch public_flag_mismatch_user_id_fkey
ALTER TABLE ONLY public.flag_mismatch
    ADD CONSTRAINT public_flag_mismatch_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- hints public_hints_problem_id_fkey
ALTER TABLE ONLY public.hints
    ADD CONSTRAINT public_hints_problem_id_fkey FOREIGN KEY (problem_id) REFERENCES public.contest_problems(id) ON DELETE CASCADE;

-- organizer_invites public_organizer_invites_contest_id_fkey
ALTER TABLE ONLY public.organizer_invites
    ADD CONSTRAINT public_organizer_invites_contest_id_fkey FOREIGN KEY (contest_id) REFERENCES public.contests(id) ON DELETE CASCADE;

-- organizer_invites public_organizer_invites_invitee_id_fkey
ALTER TABLE ONLY public.organizer_invites
    ADD CONSTRAINT public_organizer_invites_invitee_id_fkey FOREIGN KEY (invitee_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- organizer_invites public_organizer_invites_inviter_id_fkey
ALTER TABLE ONLY public.organizer_invites
    ADD CONSTRAINT public_organizer_invites_inviter_id_fkey FOREIGN KEY (inviter_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- organizers public_organizers_contest_id_fkey
ALTER TABLE ONLY public.organizers
    ADD CONSTRAINT public_organizers_contest_id_fkey FOREIGN KEY (contest_id) REFERENCES public.contests(id) ON DELETE CASCADE;

-- organizers public_organizers_user_id_fkey
ALTER TABLE ONLY public.organizers
    ADD CONSTRAINT public_organizers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- team_attempts public_team_attempts_contest_id_fkey
ALTER TABLE ONLY public.team_attempts
    ADD CONSTRAINT public_team_attempts_contest_id_fkey FOREIGN KEY (contest_id) REFERENCES public.contests(id) ON DELETE CASCADE;

-- team_attempts public_team_attempts_problem_id_fkey
ALTER TABLE ONLY public.team_attempts
    ADD CONSTRAINT public_team_attempts_problem_id_fkey FOREIGN KEY (problem_id) REFERENCES public.contest_problems(id) ON DELETE CASCADE;

-- teams public_teams_leader_id_fkey
ALTER TABLE ONLY public.teams
    ADD CONSTRAINT public_teams_leader_id_fkey FOREIGN KEY (leader_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- upsolving_solves public_upsolving_solves_problem_id_fkey
ALTER TABLE ONLY public.upsolving_solves
    ADD CONSTRAINT public_upsolving_solves_problem_id_fkey FOREIGN KEY (problem_id) REFERENCES public.contest_problems(id) ON DELETE CASCADE;

-- upsolving_solves public_upsolving_solves_submission_id_fkey
ALTER TABLE ONLY public.upsolving_solves
    ADD CONSTRAINT public_upsolving_solves_submission_id_fkey FOREIGN KEY (submission_id) REFERENCES public.upsolving_submissions(id) ON DELETE CASCADE;

-- upsolving_solves public_upsolving_solves_user_id_fkey
ALTER TABLE ONLY public.upsolving_solves
    ADD CONSTRAINT public_upsolving_solves_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- upsolving_solves public_upsolving_solves_variation_id_fkey
ALTER TABLE ONLY public.upsolving_solves
    ADD CONSTRAINT public_upsolving_solves_variation_id_fkey FOREIGN KEY (variation_id) REFERENCES public.problem_variations(id) ON DELETE CASCADE;

-- upsolving_submissions public_upsolving_submissions_problem_id_fkey
ALTER TABLE ONLY public.upsolving_submissions
    ADD CONSTRAINT public_upsolving_submissions_problem_id_fkey FOREIGN KEY (problem_id) REFERENCES public.contest_problems(id) ON DELETE CASCADE;

-- upsolving_submissions public_upsolving_submissions_user_id_fkey
ALTER TABLE ONLY public.upsolving_submissions
    ADD CONSTRAINT public_upsolving_submissions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- upsolving_submissions public_upsolving_submissions_variation_id_fkey
ALTER TABLE ONLY public.upsolving_submissions
    ADD CONSTRAINT public_upsolving_submissions_variation_id_fkey FOREIGN KEY (variation_id) REFERENCES public.problem_variations(id) ON DELETE CASCADE;

-- team_attempts team_attempts_team_id_fkey
ALTER TABLE ONLY public.team_attempts
    ADD CONSTRAINT team_attempts_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE;

-- team_invites team_invites_contest_id_fkey
ALTER TABLE ONLY public.team_invites
    ADD CONSTRAINT team_invites_contest_id_fkey FOREIGN KEY (contest_id) REFERENCES public.contests(id) ON DELETE CASCADE;

-- team_invites team_invites_invitee_id_fkey
ALTER TABLE ONLY public.team_invites
    ADD CONSTRAINT team_invites_invitee_id_fkey FOREIGN KEY (invitee_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- team_invites team_invites_inviter_id_fkey
ALTER TABLE ONLY public.team_invites
    ADD CONSTRAINT team_invites_inviter_id_fkey FOREIGN KEY (inviter_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- team_invites team_invites_team_id_fkey
ALTER TABLE ONLY public.team_invites
    ADD CONSTRAINT team_invites_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE;

-- team_members team_members_contest_id_fkey
ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_contest_id_fkey FOREIGN KEY (contest_id) REFERENCES public.contests(id) ON DELETE CASCADE;

-- team_members team_members_team_id_fkey
ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE;

-- team_members team_members_user_id_fkey
ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- teams teams_contest_id_fkey
ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_contest_id_fkey FOREIGN KEY (contest_id) REFERENCES public.contests(id) ON DELETE CASCADE;

-- sessions (server-side login sessions; replaces Supabase Auth)
CREATE TABLE public.sessions (
    id text PRIMARY KEY,               -- SHA-256 hex of the session token stored in the cookie
    user_id bigint NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone NOT NULL
);

CREATE INDEX sessions_user_id_idx ON public.sessions (user_id);
CREATE INDEX sessions_expires_at_idx ON public.sessions (expires_at);
