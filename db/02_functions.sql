-- Database functions (ported as-is from the original Supabase project).
-- Phase 2 will move this logic into the backend.
SET check_function_bodies = false;

-- check_submitted_flag(integer, integer, text)
CREATE FUNCTION public.check_submitted_flag(c_id integer, p_id integer, submission text) RETURNS boolean
    LANGUAGE plpgsql
    AS $$DECLARE
    flag_verdict BOOLEAN;
BEGIN
    SELECT EXISTS (
      SELECT *
      FROM contest_problems
      WHERE contest_id = c_id
      AND id=p_id AND submission =ANY(flags)
    ) INTO flag_verdict;
    RETURN flag_verdict;
END;$$;

-- create_blog_and_contents(text, integer, json[])
CREATE FUNCTION public.create_blog_and_contents(blog_title text, user_id integer, content_array json[]) RETURNS TABLE(status text, blog_id integer)
    LANGUAGE plpgsql
    AS $$
DECLARE
    blog_id INTEGER;
    content_obj JSON;
BEGIN
    -- Insert the post title into the 'blogs' table
    INSERT INTO blogs (title, user_id) VALUES (blog_title, user_id) RETURNING id INTO blog_id;

    -- Loop through each JSON object in the array
    FOREACH content_obj IN ARRAY content_array
    LOOP
        BEGIN
            -- Insert the JSON object into the 'blogs_contents' table
            INSERT INTO blogs_contents (type, content, blog_id)
            VALUES (content_obj->>'type', content_obj->>'content', blog_id);
        EXCEPTION
            WHEN OTHERS THEN
                -- Rollback the transaction if an error occurs
                ROLLBACK;
                -- Return the error message
                RETURN QUERY SELECT 'Error: ' || SQLERRM, NULL;
        END;
    END LOOP;

    -- If no error occurred, return success along with the new blog ID
    RETURN QUERY SELECT 'Success', blog_id;
END;
$$;

-- create_team(bigint, bigint, text, text)
CREATE FUNCTION public.create_team(p_user_id bigint, p_contest_id bigint, p_team_name text, p_password text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
    m_eligibility_result JSON;
    m_create_result TEXT;
    m_contest_type TEXT;
    m_contest_password TEXT;
BEGIN
    -- Check registration eligibility
    m_eligibility_result := registration_eligibility(p_contest_id, p_user_id);

    -- Check if user is eligible
    IF m_eligibility_result->>'status' = 'eligible' THEN

        -- check if contest public or private
        SELECT contests.type, contests.contest_password INTO m_contest_type, m_contest_password
        FROM contests
        WHERE id = p_contest_id;

        IF m_contest_type = 'private' AND m_contest_password <> p_password THEN
            m_create_result := 'invalid_password';
            RETURN m_create_result;
        END IF;

        BEGIN

            INSERT INTO teams(contest_id, leader_id, name, variation_generator )
            VALUES(p_contest_id, p_user_id, p_team_name, floor(random() * 100) + 1);
            m_create_result := 'success';

        EXCEPTION WHEN unique_violation THEN
            -- Catch unique constraint violation error
            m_create_result := 'Team "' || p_team_name || '" already exists';
        END;

    ELSE
        -- Set the error message from registration eligibility
        m_create_result := m_eligibility_result->>'status';
    END IF;
    
    RETURN m_create_result;
END;
$$;

-- delete_blog(integer, integer)
CREATE FUNCTION public.delete_blog(b_id integer, u_id integer) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
    blog_exists BOOLEAN;
BEGIN
    -- Check if there's an entry with the given blog_id and user_id
    SELECT EXISTS (SELECT 1 FROM blogs WHERE id = b_id AND user_id = u_id)
    INTO blog_exists;

    IF blog_exists THEN
        -- Delete the blog
        DELETE FROM blogs WHERE id = b_id AND user_id = u_id;
        RETURN 'success';
    ELSE
        RETURN 'Error: No entry found with the given user_id and blog_id.';
    END IF;
END;
$$;

-- does_team_exist(integer, integer)
CREATE FUNCTION public.does_team_exist(u_id integer, c_id integer) RETURNS boolean
    LANGUAGE plpgsql
    AS $$DECLARE
    team_exists BOOLEAN;
BEGIN
    SELECT EXISTS (SELECT 1 FROM team_members WHERE contest_id = c_id AND user_id = u_id) INTO team_exists;
    RETURN team_exists;
END;$$;

-- get_assigned_variant(bigint, bigint)
CREATE FUNCTION public.get_assigned_variant(p_problem_id bigint, p_team_id bigint) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    m_variation_id INT;
    m_new_variation_id INT;
    
BEGIN
    -- BEGIN
        select variation_id into m_variation_id
        from assigns_variation
        where problem_id = p_problem_id and team_id = p_team_id;

        IF m_variation_id is null then
            select id into m_new_variation_id from problem_variations where problem_id = p_problem_id
            order by random()
            limit 1;

            insert into assigns_variation(team_id, problem_id, variation_id)
            values(p_team_id, p_problem_id, m_new_variation_id);

            return m_new_variation_id;

        end if;

        return m_variation_id;

    -- EXCEPTION
    --     -- If an error occurs during insertion, return -1
    --     WHEN others THEN
    --         RETURN -1;
    -- END;
END;

$$;

-- get_blog_info(integer, bigint)
CREATE FUNCTION public.get_blog_info(b_id integer, u_id bigint) RETURNS json
    LANGUAGE plpgsql
    AS $$
DECLARE
    blog_info JSON := '{}';
    blog_content JSON;
    user_info JSON := '{}';
    vote TEXT;
    comments JSON;
BEGIN
    -- Retrieve information from the 'blogs' table
    SELECT json_build_object(
        'blog_id', b.id,
        'title', b.title,
        'user_id', b.user_id,
        'created_at', b.created_at,
        'up', b.up_votes,
        'down', b.down_votes
    )
    INTO blog_info
    FROM blogs b
    WHERE b.id = b_id;

    -- Retrieve information from the 'users' table for the blog owner
    SELECT jsonb_build_object(
        'user_id', id,
        'username', username
    ) 
    INTO user_info
    FROM users
    WHERE id = (blog_info->>'user_id')::BIGINT;

    -- Retrieve information from the 'blogs_contents' table
    SELECT json_agg(json_build_object(
        'content_id', bc.id,
        'type', bc.type,
        'content', bc.content
    ))
    INTO blog_content
    FROM blogs_contents bc
    WHERE bc.blog_id = b_id;

    -- Retrieve the vote type from the 'blogs_votes' table for the provided user and blog
    SELECT type
    INTO vote
    FROM blogs_votes
    WHERE user_id = u_id
    AND blog_id = b_id;

    -- Retrieve comments from the 'blogs_comments' table
    SELECT json_agg(json_build_object(
        'comment_id', bc.id,
        'user_id', bc.user_id,
        'content', bc.content,
        'username',users.username,
        'created_at',bc.created_at
    ))
    INTO comments
    FROM blogs_comments bc
    JOIN users ON users.id = bc.user_id
    WHERE bc.blog_id = b_id;

    -- Construct final JSON object containing blog_info, blog_content, user_info, vote, and comments
    RETURN json_build_object(
        'user_info', user_info,
        'blog_info', blog_info,
        'blog_content', blog_content,
        'vote_type', vote,
        'comments', comments
    );
END;
$$;

-- get_contest_access(bigint, bigint)
CREATE FUNCTION public.get_contest_access(p_contest_id bigint, p_user_id bigint) RETURNS json
    LANGUAGE plpgsql
    AS $$
DECLARE
    m_status JSON;
    m_team_id INT;
    contest_status TEXT;
    contest_paused boolean;
    result JSON;
BEGIN

    select get_contest_status2(p_contest_id) into m_status;

    -- contest doesn't exist --
    IF m_status->>'contest_exists' = 'false' THEN
        result := jsonb_build_object('access', 'none', 'contest_exists', false);
        RETURN result;
    END IF;


    contest_status := m_status->>'status';
    contest_paused := m_status->>'contest_paused';

    -- IF p_user_id < 1 THEN
    --     result := jsonb_build_object(
    --         'access', 'viewer', 
    --         'contest_status', contest_status,
    --         'contest_paused', contest_paused
    --     );
    --     RETURN result;
    -- END IF;



    -- check if user is contest admin
    IF EXISTS (SELECT 1 FROM organizers WHERE contest_id = p_contest_id AND user_id = p_user_id) THEN
        result := jsonb_build_object(
            'access', 'organizer',
            'contest_status', contest_status,
            'contest_paused', contest_paused
        );
        RETURN result;
    END IF;



    ------------ banned ?? ----------------------
    IF EXISTS (
        SELECT 1 FROM banned_users
        WHERE contest_id = p_contest_id AND user_id = p_user_id
    ) THEN 
        result := jsonb_build_object(
                'access', 'restricted',
                'contest_status', contest_status,
                'contest_paused', contest_paused,
                'banned', true
        );
        RETURN result;
    END IF;



    -- check if user is contest participant
    SELECT team_id INTO m_team_id FROM team_members WHERE contest_id = p_contest_id AND user_id = p_user_id;
    IF m_team_id IS NOT NULL THEN
        result := jsonb_build_object(
            'access', 'participant',
            'contest_status', contest_status,
            'contest_paused', contest_paused,
            'team_id', m_team_id
        );
        RETURN result;
    END IF;


    -- others --
    IF m_status->>'type' <> 'private' THEN
        result := jsonb_build_object(
                'access', 'viewer',
                'contest_status', contest_status,
                'contest_paused', contest_paused
        );
        RETURN result;
    END IF;

  

    IF EXISTS (
        SELECT 1 FROM private_contest_access
        WHERE contest_id = p_contest_id AND user_id = p_user_id
    ) THEN 
        result := jsonb_build_object(
                'access', 'viewer',
                'contest_status', contest_status,
                'contest_paused', contest_paused
        );
        RETURN result;

    END IF;

    result := jsonb_build_object(
            'access', 'restricted',
            'contest_status', contest_status,
            'contest_paused', contest_paused
    );
    RETURN result;

    
END;

$$;

-- get_contest_challenge_details(integer, integer)
CREATE FUNCTION public.get_contest_challenge_details(c_id integer, p_id integer) RETURNS json
    LANGUAGE plpgsql
    AS $$DECLARE
    result json;
BEGIN
    SELECT row_to_json(t)
    INTO result
    FROM (
        (SELECT id,category,title,score,hidden,max_attempts,author_id,description
        FROM contest_problems
        WHERE contest_id = c_id 
        AND id = p_id
        )
    ) t;
    
    RETURN result;
END;$$;

-- get_contest_layout_data(bigint, bigint)
CREATE FUNCTION public.get_contest_layout_data(p_contest_id bigint, p_user_id bigint) RETURNS json
    LANGUAGE plpgsql
    AS $$
DECLARE
    m_start_time TIMESTAMP;
    m_end_time TIMESTAMP;
    m_current_time TIMESTAMP;
    m_contest_paused boolean;
    m_registration_paused boolean;
    m_contest_name TEXT;
    contest_status TEXT;
    m_access TEXT;
    m_team_id INT8;
    result JSON;
BEGIN

     -- Get contest details
    SELECT start_time, end_time, contest_paused, registration_paused, contest_name
    INTO m_start_time, m_end_time, m_contest_paused, m_registration_paused, m_contest_name
    FROM contests
    WHERE contests.id = p_contest_id;

    -- Check if the contest exists
    IF m_start_time IS NOT NULL AND m_end_time IS NOT NULL THEN
        m_current_time := NOW();

        -- Determine the contest status
        IF m_current_time < m_start_time THEN
            contest_status := 'upcoming';
        ELSIF m_current_time >= m_start_time AND m_current_time <= m_end_time THEN
            contest_status := 'ongoing';
        ELSE
            contest_status := 'finished';
        END IF;


        IF EXISTS (SELECT 1 FROM organizers WHERE contest_id = p_contest_id AND user_id = p_user_id) THEN
            m_access := 'organizer';

            RETURN jsonb_build_object(
                'contest_exists', true, 
                'contest_status', contest_status, 
                'contest_paused', m_contest_paused, 
                'registration_paused', m_registration_paused, 
                'access', m_access, 
                'contest_name', m_contest_name,
                'start_time', m_start_time,
                'end_time', m_end_time
            );

        
        ELSE

            SELECT team_id INTO m_team_id FROM team_members WHERE contest_id = p_contest_id AND user_id = p_user_id;
            IF m_team_id IS NOT NULL THEN
                m_access := 'participant';
                
                RETURN jsonb_build_object(
                'contest_exists', true, 
                'contest_status', contest_status, 
                'contest_paused', m_contest_paused, 
                'registration_paused', m_registration_paused, 
                'access', m_access, 
                'contest_name', m_contest_name,
                'start_time', m_start_time,
                'end_time', m_end_time,
                'team_id', m_team_id
                );
            

            ELSE

                RETURN jsonb_build_object(
                'contest_exists', true, 
                'contest_status', contest_status, 
                'contest_paused', m_contest_paused, 
                'registration_paused', m_registration_paused, 
                'access', 'viewer', 
                'contest_name', m_contest_name,
                'start_time', m_start_time,
                'end_time', m_end_time,
                'team_id', m_team_id
                );

            END IF;
        END IF;

    ELSE
        result := jsonb_build_object('contest_exists', false, 'status', 'contest not found', 'contest_paused', true);
        RETURN result;
    END IF;
END;

$$;

-- get_contest_member_limit(integer)
CREATE FUNCTION public.get_contest_member_limit(c_id integer) RETURNS integer
    LANGUAGE plpgsql
    AS $$

DECLARE
    result integer;
BEGIN
    SELECT *
    INTO result
    FROM (
        SELECT memberlimit
        FROM contests
        WHERE id = c_id
    ) t;
    
    RETURN result;
END;
$$;

-- get_contest_status(bigint)
CREATE FUNCTION public.get_contest_status(p_contest_id bigint) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
    m_start_time TIMESTAMP;
    m_end_time TIMESTAMP;
    m_current_time TIMESTAMP;
    contest_status TEXT;
BEGIN
    -- Get contest details
    SELECT start_time, end_time
    INTO m_start_time, m_end_time
    FROM contests
    WHERE contests.id = p_contest_id;

    -- Check if the contest exists
    IF m_start_time IS NOT NULL AND m_end_time IS NOT NULL THEN
        m_current_time := NOW();

        -- Determine the contest status
        IF m_current_time < m_start_time THEN
            contest_status := 'upcoming';
        ELSIF m_current_time >= m_start_time AND m_current_time <= m_end_time THEN
            contest_status := 'ongoing';
        ELSE
            contest_status := 'finished';
        END IF;

        RETURN contest_status;
    ELSE
        RETURN 'contest not found';
    END IF;
END;
$$;

-- get_contest_status2(bigint)
CREATE FUNCTION public.get_contest_status2(p_contest_id bigint) RETURNS json
    LANGUAGE plpgsql
    AS $$
DECLARE
    m_start_time TIMESTAMP;
    m_end_time TIMESTAMP;
    m_current_time TIMESTAMP;
    m_contest_paused boolean;
    m_registration_paused boolean;
    contest_status TEXT;
    m_type TEXT;
    result JSON;
BEGIN
    -- Get contest details
    SELECT start_time, end_time, contest_paused, registration_paused, type
    INTO m_start_time, m_end_time, m_contest_paused, m_registration_paused, m_type
    FROM contests
    WHERE contests.id = p_contest_id;

    -- Check if the contest exists
    IF m_start_time IS NOT NULL AND m_end_time IS NOT NULL THEN
        m_current_time := NOW();

        -- Determine the contest status
        IF m_current_time < m_start_time THEN
            contest_status := 'upcoming';
        ELSIF m_current_time >= m_start_time AND m_current_time <= m_end_time THEN
            contest_status := 'ongoing';
        ELSE
            contest_status := 'finished';
        END IF;

        result := jsonb_build_object(
            'contest_exists', true,
            'status', contest_status,
            'contest_paused', m_contest_paused,
            'start_time', m_start_time,
            'end_time', m_end_time,
            'registration_paused', m_registration_paused,
            'type', m_type
        );
        RETURN result;
    ELSE
        result := jsonb_build_object('contest_exists', false, 'status', 'contest not found', 'contest_paused', true);
        RETURN result;
    END IF;
END;
$$;

-- get_contests(text, text, text)
CREATE FUNCTION public.get_contests(search_str text, stat text, typeof text) RETURNS TABLE(id bigint, contest_name text, start_time timestamp with time zone, duration numeric, status text, type text)
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN QUERY
    SELECT 
      contests.id,
      contests.contest_name,
      contests.start_time,
      EXTRACT(EPOCH FROM (contests.end_time - contests.start_time)) AS duration,
      
      CASE
        WHEN contests.start_time > NOW() THEN 'upcoming'
        WHEN contests.start_time <= NOW() AND contests.end_time >= NOW() THEN 'running'
        ELSE 'finished'
      END AS status,
      contests.type
    
    FROM contests 
    
    WHERE contests.contest_name ILIKE ('%' || search_str || '%')
    AND (stat = 'all' OR
         (contests.start_time > NOW() AND stat = 'upcoming') OR
         (contests.start_time <= NOW() AND contests.end_time >= NOW() AND stat = 'running') OR
         (contests.start_time <= NOW() AND contests.end_time < NOW() AND stat = 'finished'))
    AND (typeof = 'all' OR contests.type = typeof)
    ORDER BY contests.start_time DESC;
END;
$$;

-- get_hints(bigint, bigint)
CREATE FUNCTION public.get_hints(p_problem_id bigint, p_user_id bigint) RETURNS json
    LANGUAGE plpgsql
    AS $$
DECLARE
    hints_data JSON;
    m_problem_access JSON;
    m_team_id INT;
BEGIN

    
    SELECT get_problem_access(p_problem_id, p_user_id) INTO m_problem_access;

    IF m_problem_access->>'access' = 'none' THEN
        RETURN m_problem_access;
    END IF;

    IF m_problem_access->>'access' = 'organizer' OR (m_problem_access->>'contest_status' = 'finished' and  m_problem_access->>'access' <> 'none') THEN
        WITH unlocked_hints AS (
            SELECT id, description
            FROM hints 
            WHERE problem_id = p_problem_id 
            ORDER BY id
        )
        SELECT json_build_object(
            'hints', COALESCE((SELECT json_agg(unlocked_hints) FROM unlocked_hints), '[]'::JSON)
        ) INTO hints_data;
        RETURN hints_data;
    END IF;


    --  if contest_paused or problem_hidden then return empty array
    IF m_problem_access->>'contest_status' = 'upcoming' OR
      m_problem_access->>'contest_paused' = 'true' OR
      m_problem_access->>'problem_hidden' = 'true' THEN
        RETURN json_build_object('locked_hints', '[]'::JSON, 'hints', '[]'::JSON);
    END IF;


    m_team_id := 0;

    IF m_problem_access->>'access' = 'participant' THEN
        m_team_id := m_problem_access->>'team_id';
    END IF;

    IF m_problem_access->>'access' = 'participant' or m_problem_access->>'access' = 'viewer'  THEN
        WITH unlocked_hints AS (
            SELECT id, description
            FROM hints 
            LEFT JOIN hint_unlocks ON hint_id = id 
            WHERE problem_id = p_problem_id 
            AND (penalty_score = 0 OR team_id = m_team_id)
            ORDER BY id
        ), 
        locked_hints AS (
            SELECT id, penalty_score 
            FROM hints 
            WHERE problem_id = p_problem_id 
            AND id NOT IN (
                SELECT id
                FROM unlocked_hints
            )
            ORDER BY id
        )
        SELECT json_build_object(
            'locked_hints', COALESCE((SELECT json_agg(locked_hints) FROM locked_hints), '[]'::JSON),
            'hints', COALESCE((SELECT json_agg(unlocked_hints) FROM unlocked_hints), '[]'::JSON)
        ) INTO hints_data;

        RETURN hints_data;
    END IF;

    RETURN json_build_object('error', 'Unknown error');

END;
$$;

-- get_private_contest_access(bigint, bigint, text)
CREATE FUNCTION public.get_private_contest_access(p_contest_id bigint, p_user_id bigint, p_password text) RETURNS json
    LANGUAGE plpgsql
    AS $$
DECLARE
    m_status JSON;
    m_team_id INT;
    contest_status TEXT;
    contest_paused boolean;
    m_contest_password TEXT;
    m_contest_type TEXT;
    result JSON;
BEGIN

    select type FROM contests WHERE id = p_contest_id INTO m_contest_type;

    IF m_contest_type is null THEN
        result := jsonb_build_object(
            'success', false,
            'message', 'Contest not found'
        );
        RETURN result;
    END IF;

    select get_contest_access(p_contest_id, p_user_id) into m_status;
    

    IF m_contest_type = 'private'
        and m_status->>'access' = 'restricted'
        and m_status->>'contest_status' = 'finished' THEN

        

        SELECT contest_password
        INTO m_contest_password
        FROM contests
        WHERE id = p_contest_id;

        IF m_contest_password = p_password THEN

            INSERT INTO private_contest_access(contest_id, user_id)
            VALUES(p_contest_id, p_user_id);
            
            result := jsonb_build_object(
                'success', true
            );
            RETURN result;
        ELSE
            result := jsonb_build_object(
                'success', false,
                'message', 'Invalid password'
            );
            RETURN result;
        END IF;
    END IF;

    result := jsonb_build_object(
        'success', false,
        'message', 'Invalid contest access'
    );

    RETURN result;
    
END;

$$;

-- get_problem(bigint, bigint)
CREATE FUNCTION public.get_problem(p_problem_id bigint, p_user_id bigint) RETURNS json
    LANGUAGE plpgsql
    AS $$
DECLARE
    m_status JSON;
    m_team_id INT;
    m_contest_id INT;
    m_hidden BOOLEAN;
    m_problem_access JSON;
    m_problem_hidden BOOLEAN;
    m_contest_status TEXT;
    m_contest_paused BOOLEAN;
    m_prerequisites_count INT;
    m_unsolved_count INT;
    m_assigned_variation_id INT;
    result JSON;
BEGIN

BEGIN
        m_problem_access := get_problem_access(p_problem_id, p_user_id);
       

        IF m_problem_access->>'access' = 'organizer' THEN
            SELECT jsonb_build_object(
                'id', cp.id,
                'title', cp.title,
                'score', cp.score,
                'max_attempts', cp.max_attempts,
                'category', cp.category,
                'author_id', cp.author_id,
                'author_name', u.username,
                'description', v.description,
                'variation_id', v.id,
                'variation_name', v.variation_name
            ) INTO result
            FROM contest_problems cp
            LEFT JOIN users u ON cp.author_id = u.id
            LEFT Join problem_variations v ON cp.id = v.problem_id
            WHERE cp.id = p_problem_id
            ORDER BY v.id
            limit 1;        
            RETURN result;
        END IF;

               

        IF m_problem_access->>'access' = 'none' 
        or m_problem_access->>'access' = 'restricted' 
        or m_problem_access->>'contest_status' = 'upcoming'
        or ( m_problem_access->>'contest_status' = 'ongoing' and (m_problem_access->>'contest_paused')::boolean = TRUE )
        or (m_problem_access->>'problem_hidden')::boolean = TRUE  THEN

            result := jsonb_build_object();
            RETURN result;
        END IF;



        IF m_problem_access->>'access' = 'viewer' THEN
        
            SELECT jsonb_build_object(
                            'id', cp.id,
                            'title', cp.title,
                            'score', cp.score,
                            'max_attempts', cp.max_attempts,
                            'category', cp.category,
                            'author_id', cp.author_id,
                            'author_name', u.username,
                            'description', v.description,
                            'variation_id', v.id,
                            'variation_name', v.variation_name
            ) INTO result
            FROM contest_problems cp
            LEFT JOIN users u ON cp.author_id = u.id
            LEFT Join problem_variations v ON cp.id = v.problem_id
            WHERE cp.id = p_problem_id
            ORDER BY v.id
            limit 1;        
            RETURN result;
        END IF;

        IF m_problem_access->>'access' = 'participant' THEN

            m_team_id := m_problem_access->>'team_id';

           
           SELECT get_assigned_variant(p_problem_id, m_team_id) INTO m_assigned_variation_id;

           
            IF m_problem_access->>'contest_status' = 'finished' THEN

                SELECT jsonb_build_object(
                    'id', cp.id,
                    'title', cp.title,
                    'score', cp.score,
                    'max_attempts', cp.max_attempts,
                    'category', cp.category,
                    'author_id', cp.author_id,
                    'author_name', u.username,
                    'description', v.description,
                    'variation_id', v.id,
                    'variation_name', v.variation_name
                ) INTO result
                FROM contest_problems cp
                LEFT JOIN users u ON cp.author_id = u.id
                LEFT Join problem_variations v ON cp.id = v.problem_id
                WHERE cp.id = p_problem_id
                AND v.id = m_assigned_variation_id;
                            
                RETURN result;

            ELSE 
                SELECT jsonb_build_object(
                    'id', cp.id,
                    'title', cp.title,
                    'score', cp.score,
                    'max_attempts', cp.max_attempts,
                    'category', cp.category,
                    'author_id', cp.author_id,
                    'author_name', u.username,
                    'description', v.description,
                    'variation_id', v.id,
                    'variation_name', v.variation_name,
                    'attempt_count', COALESCE((
                            SELECT attempt_count
                            FROM team_attempts ta
                            WHERE ta.team_id = m_team_id
                            AND ta.problem_id = p_problem_id
                        ), 0) 
                ) INTO result
                FROM contest_problems cp
                LEFT JOIN users u ON cp.author_id = u.id
                LEFT Join problem_variations v ON cp.id = v.problem_id
                WHERE cp.id = p_problem_id
                AND v.id = m_assigned_variation_id;
                            
                RETURN result;

            END IF;
        END IF;
        
        RETURN result;
    
    EXCEPTION WHEN OTHERS THEN
        result := jsonb_build_object();
        RETURN result;

    END;

    
END;
$$;

-- get_problem2(bigint, bigint, bigint)
CREATE FUNCTION public.get_problem2(p_problem_id bigint, p_user_id bigint, p_variation_id bigint) RETURNS json
    LANGUAGE plpgsql
    AS $$
DECLARE
    m_status JSON;
    m_team_id INT;
    m_contest_id INT;
    m_hidden BOOLEAN;
    m_problem_access JSON;
    m_problem_hidden BOOLEAN;
    m_contest_status TEXT;
    m_contest_paused BOOLEAN;
    m_prerequisites_count INT;
    m_unsolved_count INT;
    m_assigned_variation_id INT;
    m_all_variations JSON;
    m_valid_variation boolean;
    result JSON;


BEGIN
        m_problem_access := get_problem_access(p_problem_id, p_user_id);

        
        SELECT jsonb_agg(jsonb_build_object('id', id, 'variation_name', variation_name)) INTO m_all_variations
        FROM (
            SELECT id, variation_name
            FROM problem_variations
            WHERE problem_id = p_problem_id
            ORDER BY id
        ) AS pv;

        
        IF m_all_variations IS NULL THEN
            result := jsonb_build_object('error' , 'problem not found');
            RETURN result;
        END IF;

        

        IF p_variation_id < 1 THEN
            
            SELECT (m_all_variations->0->>'id')::INT INTO p_variation_id;
            
        ELSE

            -- check if the variation belongs to that problem. if not then return empty json
            SELECT EXISTS(
                SELECT 1
                FROM problem_variations
                WHERE problem_id = p_problem_id AND id = p_variation_id
            ) INTO m_valid_variation;

            IF m_valid_variation = FALSE THEN
                result := jsonb_build_object('error', 'Invalid variation id');
                RETURN result;
            END IF;
           
        END IF;
        
      
        IF m_problem_access->>'access' = 'organizer' THEN
            SELECT jsonb_build_object(
                'id', cp.id,
                'title', cp.title,
                'score', cp.score,
                'max_attempts', cp.max_attempts,
                'category', cp.category,
                'author_id', cp.author_id,
                'author_name', u.username,
                'description', v.description,
                'variation_id', v.id,
                'variation_name', v.variation_name,
                'attachments', (
                    SELECT jsonb_agg(jsonb_build_object(
                        'link', pa.link,
                        'file_name', pa.file_name
                    ))
                    FROM problem_attachments pa
                    WHERE pa.variation_id = v.id
                )
            ) INTO result
            FROM contest_problems cp
            LEFT JOIN users u ON cp.author_id = u.id
            LEFT Join problem_variations v ON cp.id = v.problem_id
            WHERE cp.id = p_problem_id and v.id = p_variation_id;  
            RETURN jsonb_build_object('problem', result, 'all_variations', m_all_variations);
        END IF;

               

        IF m_problem_access->>'access' = 'none' 
        or m_problem_access->>'access' = 'restricted' 
        or m_problem_access->>'contest_status' = 'upcoming'
        or ( m_problem_access->>'contest_status' = 'ongoing' and (m_problem_access->>'contest_paused')::boolean = TRUE )
        or (m_problem_access->>'problem_hidden')::boolean = TRUE  THEN

            result := jsonb_build_object('error' , 'access denied');
            RETURN result;
        END IF;



        IF m_problem_access->>'access' = 'viewer'  THEN

            IF m_problem_access->>'contest_status' = 'finished' THEN
                SELECT jsonb_build_object(
                            'id', cp.id,
                            'title', cp.title,
                            'score', cp.score,
                            'max_attempts', cp.max_attempts,
                            'category', cp.category,
                            'author_id', cp.author_id,
                            'author_name', u.username,
                            'description', v.description,
                            'variation_id', v.id,
                            'variation_name', v.variation_name,
                            'attachments', (
                    SELECT jsonb_agg(jsonb_build_object(
                        'link', pa.link,
                        'file_name', pa.file_name
                    ))
                    FROM problem_attachments pa
                    WHERE pa.variation_id = v.id
                )
                ) INTO result
                FROM contest_problems cp
                LEFT JOIN users u ON cp.author_id = u.id
                LEFT Join problem_variations v ON cp.id = v.problem_id
                WHERE cp.id = p_problem_id and v.id = p_variation_id;  
                RETURN jsonb_build_object('problem', result, 'all_variations', m_all_variations);

            ELSE
                SELECT jsonb_build_object(
                            'id', cp.id,
                            'title', cp.title,
                            'score', cp.score,
                            'max_attempts', cp.max_attempts,
                            'category', cp.category,
                            'author_id', cp.author_id,
                            'author_name', u.username,
                            'description', v.description,
                            'variation_id', v.id,
                            'variation_name', v.variation_name,
                            'attachments', (
                    SELECT jsonb_agg(jsonb_build_object(
                        'link', pa.link,
                        'file_name', pa.file_name
                    ))
                    FROM problem_attachments pa
                    WHERE pa.variation_id = v.id
                )
                ) INTO result
                FROM contest_problems cp
                LEFT JOIN users u ON cp.author_id = u.id
                LEFT Join problem_variations v ON cp.id = v.problem_id
                WHERE cp.id = p_problem_id
                ORDER BY v.id
                limit 1;        
                RETURN jsonb_build_object('problem', result);
            END if;
        
            
        END IF;

        IF m_problem_access->>'access' = 'participant' THEN

            m_team_id := m_problem_access->>'team_id';

            -- RETURN jsonb_build_object('problem', m_team_id);

           
           SELECT get_assigned_variant(p_problem_id, m_team_id) INTO m_assigned_variation_id;

           
            IF m_problem_access->>'contest_status' = 'finished' THEN

                SELECT jsonb_build_object(
                    'id', cp.id,
                    'title', cp.title,
                    'score', cp.score,
                    'max_attempts', cp.max_attempts,
                    'category', cp.category,
                    'author_id', cp.author_id,
                    'author_name', u.username,
                    'description', v.description,
                    'variation_id', v.id,
                    'variation_name', v.variation_name,
                    'attachments', (
                    SELECT jsonb_agg(jsonb_build_object(
                        'link', pa.link,
                        'file_name', pa.file_name
                    ))
                    FROM problem_attachments pa
                    WHERE pa.variation_id = v.id
                )
                ) INTO result
                FROM contest_problems cp
                LEFT JOIN users u ON cp.author_id = u.id
                LEFT Join problem_variations v ON cp.id = v.problem_id
                WHERE cp.id = p_problem_id and v.id = p_variation_id;  
                RETURN jsonb_build_object('problem', result, 'all_variations', m_all_variations);

            ELSE 
                SELECT jsonb_build_object(
                    'id', cp.id,
                    'title', cp.title,
                    'score', cp.score,
                    'max_attempts', cp.max_attempts,
                    'category', cp.category,
                    'author_id', cp.author_id,
                    'author_name', u.username,
                    'description', v.description,
                    'variation_id', v.id,
                    'variation_name', v.variation_name,
                    'attachments', (
                    SELECT jsonb_agg(jsonb_build_object(
                        'link', pa.link,
                        'file_name', pa.file_name
                    ))
                    FROM problem_attachments pa
                    WHERE pa.variation_id = v.id
                ),
                    'attempt_count', COALESCE((
                            SELECT attempt_count
                            FROM team_attempts ta
                            WHERE ta.team_id = m_team_id
                            AND ta.problem_id = p_problem_id
                        ), 0) 
                ) INTO result
                FROM contest_problems cp
                LEFT JOIN users u ON cp.author_id = u.id
                LEFT Join problem_variations v ON cp.id = v.problem_id
                WHERE cp.id = p_problem_id
                AND v.id = m_assigned_variation_id;
                            
                RETURN jsonb_build_object('problem', result);

            END IF;
        END IF;
        
        RETURN result;
    
END;
$$;

-- get_problem_access(bigint, bigint)
CREATE FUNCTION public.get_problem_access(p_problem_id bigint, p_user_id bigint) RETURNS json
    LANGUAGE plpgsql
    AS $$
DECLARE
    m_status JSON;
    m_team_id INT;
    m_contest_id INT;
    m_hidden BOOLEAN;
    m_contest_access JSON;
    m_problem_hidden BOOLEAN;
    m_contest_status TEXT;
    m_contest_paused BOOLEAN;
    m_prerequisites_count INT;
    m_unsolved_count INT;
    result JSON;
BEGIN

    select contest_id, problem_hidden into m_contest_id, m_hidden 
    from contest_problems where id = p_problem_id;

    IF m_contest_id IS NULL THEN
        result := jsonb_build_object(
            'access', 'none',
            'problem_exists', FALSE
        );
        RETURN result;
    END IF;


    select get_contest_access(m_contest_id, p_user_id) into m_contest_access;

    m_contest_status := m_contest_access->>'contest_status';
    m_contest_paused := m_contest_access->>'contest_paused';

    IF m_contest_access->>'access' = 'organizer' THEN
        result := jsonb_build_object(
            'access', 'organizer',
            'problem_exists', TRUE,
            'problem_hidden', m_hidden,
            'contest_id', m_contest_id,
            'contest_status', m_contest_status,
            'contest_paused', m_contest_paused::boolean
        );
        RETURN result;
    END IF;

    IF m_hidden = TRUE 
    OR m_contest_status = 'upcoming'
    OR m_contest_access->>'access' = 'none'
    OR m_contest_access->>'access' = 'restricted'
    THEN
        result := jsonb_build_object(
            'access', 'restricted',
            'problem_exists', TRUE,
            'problem_hidden', TRUE,
            'contest_id', m_contest_id,
            'contest_status', m_contest_status,
            'contest_paused', m_contest_paused::boolean
        );
        RETURN result;
    END IF;


    
    
    -- ---------------------------------------------------------------------------------


    IF m_contest_access->>'access' = 'participant' and m_contest_status = 'finished' then
        m_team_id := (m_contest_access->>'team_id')::INT;
        result := jsonb_build_object(
                    'access', 'participant',
                    'problem_exists', TRUE,
                    'problem_hidden', FALSE,
                    'contest_id', m_contest_id,
                    'contest_status', m_contest_status,
                    'contest_paused', m_contest_paused::boolean,
                    'team_id', m_contest_access->>'team_id'
                );
                RETURN result;

    END IF;
    -- ---------------------------------------------------------------------------------






    IF m_contest_status = 'ongoing' THEN
        IF m_contest_access->>'access' = 'viewer' THEN

            -- select only if the problem has no dependencies
            SELECT count(*) INTO m_prerequisites_count
            FROM contest_problem_prerequisites
            WHERE dependent = p_problem_id;

            IF m_prerequisites_count = 0 THEN
                result := jsonb_build_object(
                    'access', 'viewer',
                    'problem_exists', TRUE,
                    'problem_hidden', FALSE,
                    'contest_id', m_contest_id,
                    'contest_status', m_contest_status,
                    'contest_paused', m_contest_paused::boolean
                );
                RETURN result;
            ELSE
                result := jsonb_build_object(
                    'access', 'restricted',
                    'problem_exists', TRUE,
                    'problem_hidden', FALSE,
                    'contest_id', m_contest_id,
                    'contest_status', m_contest_status,
                    'contest_paused', m_contest_paused::boolean
                );
                RETURN result;
            END IF;
        
        ELSE 
            m_team_id := (m_contest_access->>'team_id')::INT;

            select count(*) into m_unsolved_count from (
                SELECT depends_on as pid
                FROM contest_problem_prerequisites
                WHERE dependent = p_problem_id
                EXCEPT
                SELECT problem_id as pid 
                from contest_solves
                where team_id = m_team_id
            ) as unsolved;

            IF m_unsolved_count = 0 THEN
                result := jsonb_build_object(
                    'access', 'participant',
                    'problem_exists', TRUE,
                    'problem_hidden', FALSE,
                    'contest_id', m_contest_id,
                    'contest_status', m_contest_status,
                    'contest_paused', m_contest_paused::boolean,
                    'team_id', m_contest_access->>'team_id'
                );
                RETURN result;
            ELSE
                result := jsonb_build_object(
                    'access', 'restricted',
                    'problem_exists', TRUE,
                    'problem_hidden', FALSE,
                    'contest_id', m_contest_id,
                    'contest_status', m_contest_status,
                    'contest_paused', m_contest_paused::boolean
                );
                RETURN result;
            END IF;
        END IF;
    END IF;
    -- finished
    result := jsonb_build_object(
        'access', m_contest_access->>'access',
        'problem_exists', TRUE,
        'problem_hidden', FALSE,
        'contest_id', m_contest_id,
        'contest_status', m_contest_status,
        'contest_paused', m_contest_paused::boolean
    );
    RETURN result;   
END;
$$;

-- get_team_id_and_leader(integer, integer)
CREATE FUNCTION public.get_team_id_and_leader(u_id integer, c_id integer) RETURNS json
    LANGUAGE plpgsql
    AS $$DECLARE
    result json;
BEGIN
    SELECT TO_JSON(array_agg(row_to_json(t)))
    INTO result
    FROM (
        SELECT id, leader_id
        FROM teams
        INNER JOIN team_members ON teams.id = team_members.team_id
        WHERE team_members.user_id = u_id 
        AND team_members.contest_id = c_id
    ) t;
    
    RETURN result;
END;$$;

-- get_team_members(integer, integer)
CREATE FUNCTION public.get_team_members(c_id integer, t_id integer) RETURNS json
    LANGUAGE plpgsql
    AS $$DECLARE
    result json;
BEGIN
    SELECT TO_JSON(array_agg(row_to_json(t)))
    INTO result
    FROM (
        SELECT username,user_id
        FROM team_members
        INNER JOIN users ON team_members.user_id = users.id
        WHERE team_members.team_id = t_id 
        AND team_members.contest_id = c_id
    ) t;
    
    RETURN result;
END;$$;

-- handle_contest_submission()
CREATE FUNCTION public.handle_contest_submission() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
declare
  selected_row team_attempts%rowtype;
begin
  select 1 from public.team_attempts
  into selected_row
  where team_id = NEW.team_id and problem_id = NEW.problem_id;
  if not found then
    insert INTO team_attempts(team_id,problem_id)
    values(NEW.team_id,NEW.problem_id);
  else
    update public.team_attempts 
    set attempt_count = attempt_count + 1
    where team_id = NEW.team_id and problem_id = NEW.problem_id;
  end if;

  IF new.verdict = 'correct' then
    INSERT into contest_solves(user_id, team_id, contest_id, problem_id, submission_id)
    values(new.user_id, new.team_id, new.contest_id, new.problem_id, new.id);
  end IF;
  
  return new;
end;
$$;

-- handle_join_organizer()
CREATE FUNCTION public.handle_join_organizer() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
begin
  delete from public.team_invites
    where invitee_id = new.user_id 
    and team_id in (select id from public.teams where contest_id = new.contest_id);

  delete from organizer_invites
  where invitee_id = new.user_id and contest_id = new.contest_id;

  return new;
end;
$$;

-- handle_join_team()
CREATE FUNCTION public.handle_join_team() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
begin
    -- delete from public.team_invites
    -- where invitee_id = new.user_id 
    -- and team_id in (select id from public.teams where contest_id = new.contest_id);
    return new;
end;
$$;

-- handle_register_team()
CREATE FUNCTION public.handle_register_team() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
begin
  insert into public.team_members (contest_id, team_id, user_id)
  values (new.contest_id, new.id, new.leader_id);
  return new;
end;
$$;

-- handle_team_ban()
CREATE FUNCTION public.handle_team_ban() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
begin
    if new.status = 'banned' then
        insert into public.banned_users (contest_id, user_id)
        select contest_id, user_id from public.team_members where team_id = new.id;

    elsif new.status <> 'banned' or new.status is null and old.status = 'banned' then
        delete from public.banned_users where user_id in 
        (select user_id from public.team_members where team_id = new.id);
    end if;

  return new;
end;
$$;

-- handle_upsolve_submission()
CREATE FUNCTION public.handle_upsolve_submission() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
begin

  IF new.verdict = 'correct' then
    INSERT into upsolving_solves(user_id, problem_id, submission_id, variation_id)
    values(new.user_id, new.problem_id, new.id, new.variation_id);
  end IF;
  
  return new;
end;
$$;

-- insert_blog_with_contents(text, bigint, json[])
CREATE FUNCTION public.insert_blog_with_contents(blog_title text, user_id bigint, content_array json[]) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
    blog_id INTEGER;
    content_obj JSON;
BEGIN
    -- Insert the post title into the 'blogs' table
    INSERT INTO blogs (title, user_id) VALUES (blog_title, user_id) RETURNING id INTO blog_id;

    -- Loop through each JSON object in the array
    FOREACH content_obj IN ARRAY content_array
    LOOP
        BEGIN
            -- Insert the JSON object into the 'blogs_contents' table
            INSERT INTO blogs_contents (type, content, blog_id)
            VALUES (content_obj->>'type', content_obj->>'content', blog_id);
        EXCEPTION
            WHEN OTHERS THEN
                -- Rollback the transaction if an error occurs
                ROLLBACK;
                -- Return the error message
                RETURN 'Error: ' || SQLERRM;
        END;
    END LOOP;

    -- If no error occurred, return success
    RETURN 'Success';
END;
$$;

-- insert_comment(integer, integer, text)
CREATE FUNCTION public.insert_comment(user_id integer, blog_id integer, content text) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    new_comment_id INTEGER;
BEGIN
    -- Insert a new row into blogs_comments
    INSERT INTO blogs_comments (user_id, blog_id, content)
    VALUES (user_id, blog_id, content)
    RETURNING id INTO new_comment_id;

    -- Return the new comment_id
    RETURN new_comment_id;
END;
$$;

-- insert_organizers()
CREATE FUNCTION public.insert_organizers() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
  insert into organizers(contest_id, user_id)
  values (new.id, new.created_by);
  return new;
end;
$$;

-- invite_user_to_team(bigint, bigint, bigint)
CREATE FUNCTION public.invite_user_to_team(p_inviter_id bigint, p_contest_id bigint, p_invitee_id bigint) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
    m_team_id INT8;
    m_result TEXT;
    m_team_member_count INT;
    m_max_member_limit INT;
    m_eligibility_result JSON;

    m_invite_member_count INT;
BEGIN
    
    -- Check registration eligibility
    m_eligibility_result := registration_eligibility(p_contest_id, p_invitee_id);

    -- Check if user is eligible
    IF m_eligibility_result->>'status' = 'eligible' THEN
        SELECT team_id INTO m_team_id
        FROM team_members
        WHERE contest_id = p_contest_id AND user_id = p_inviter_id;
        

        IF m_team_id IS NULL THEN
            m_result := 'Team does not exist';

        ELSE
            -- Get the max_member_limit from the contests table
            SELECT memberlimit
            INTO m_max_member_limit
            FROM contests
            WHERE id = p_contest_id;

            -- Get the count of team members
            SELECT COUNT(*)
            INTO m_team_member_count
            FROM team_members
            WHERE team_id = m_team_id;

            SELECT COUNT(*)
            INTO m_invite_member_count
            FROM team_invites
            WHERE team_id = m_team_id;

            -- Check if max_member_limit is not set or team has fewer members than max_member_limit
            IF m_max_member_limit IS NULL OR m_team_member_count + m_invite_member_count < m_max_member_limit THEN
                -- Insert user into team_members table
                INSERT INTO team_invites (inviter_id, invitee_id, contest_id, team_id)
                VALUES (p_inviter_id, p_invitee_id, p_contest_id, m_team_id);

                -- Set the success message
                m_result := 'success';
            ELSE
                -- Set the error message
                m_result := 'Team is full, cannot add more members';
            END IF;
        END IF;    
    ELSE
        -- Set the error message from registration eligibility
        m_result := m_eligibility_result->>'status';
    END IF;

    RETURN m_result;
END;
$$;

-- join_team_via_invite(bigint, bigint)
CREATE FUNCTION public.join_team_via_invite(p_user_id bigint, p_team_id bigint) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
    m_eligibility_result JSON;
    m_contest_id INT8;
    m_team_member_count INT;
    m_max_member_limit INT;
    m_join_result TEXT;
BEGIN
    -- Check registration eligibility

    SELECT t.contest_id 
    from team_invites ti join teams t on ti.team_id = t.id
    INTO m_contest_id
    WHERE ti.team_id = p_team_id and invitee_id = p_user_id; 

    IF m_contest_id IS NULL THEN
        m_join_result := 'Team/Invite does not exist';
    ELSE

        m_eligibility_result := registration_eligibility(m_contest_id, p_user_id);

        IF m_eligibility_result->>'status' = 'eligible' THEN
            -- Get the max_member_limit from the contests table
            SELECT memberlimit
            INTO m_max_member_limit
            FROM contests
            WHERE id = m_contest_id;

            -- Get the count of team members
            SELECT COUNT(*)
            INTO m_team_member_count
            FROM team_members
            WHERE team_id = p_team_id;

            -- Check if max_member_limit is not set or team has fewer members than max_member_limit
            IF m_max_member_limit IS NULL OR m_team_member_count < m_max_member_limit THEN
                -- Insert user into team_members table
                INSERT INTO team_members(user_id, contest_id, team_id)
                VALUES (p_user_id, m_contest_id, p_team_id);

                -- Set the success message
                m_join_result := 'success';
            ELSE
                -- Set the error message
                m_join_result := 'Team is full, cannot join';
            END IF;

        ELSE
            -- Set the error message from registration eligibility
            m_join_result := m_eligibility_result->>'status';
        END IF;
    END IF;
    RETURN m_join_result;
END;
$$;

-- join_team_via_password(bigint, bigint, text, text)
CREATE FUNCTION public.join_team_via_password(p_user_id bigint, p_contest_id bigint, p_team_name text, p_password text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
    m_eligibility_result JSON;
    m_team_id INT8;
    m_team_member_count INT;
    m_max_member_limit INT;
    m_team_password TEXT;
    m_join_allowed BOOL;
    m_join_result TEXT;
BEGIN
    -- Check registration eligibility
    m_eligibility_result := registration_eligibility(p_contest_id, p_user_id);

    -- Check if user is eligible
    IF m_eligibility_result->>'status' = 'eligible' THEN
        -- Check if the team with the given name exists
        SELECT id, team_password, allow_join_via_password
        INTO m_team_id, m_team_password, m_join_allowed
        FROM teams
        WHERE contest_id = p_contest_id
        AND name = p_team_name;

        -- If team doesn't exist, set the error message
        IF m_team_id IS NULL THEN
            m_join_result := 'Team does not exist';
        ELSE

            IF m_join_allowed = false THEN
                m_join_result := 'Team join via password not allowed';
            -- Check if the provided password matches the team's password
            ELSEIF m_join_allowed = true and m_team_password = p_password THEN
                -- Get the max_member_limit from the contests table
                SELECT memberlimit
                INTO m_max_member_limit
                FROM contests
                WHERE id = p_contest_id;

                -- Get the count of team members
                SELECT COUNT(*)
                INTO m_team_member_count
                FROM team_members
                WHERE team_id = m_team_id;

                -- Check if max_member_limit is not set or team has fewer members than max_member_limit
                IF m_max_member_limit IS NULL OR m_team_member_count < m_max_member_limit THEN
                    -- Insert user into team_members table
                    INSERT INTO team_members(user_id, contest_id, team_id)
                    VALUES (p_user_id, p_contest_id, m_team_id);

                    -- Set the success message
                    m_join_result := 'success';
                ELSE
                    -- Set the error message
                    m_join_result := 'Team is full, cannot join';
                END IF;
            ELSE
                -- Set the error message for password mismatch
                m_join_result := 'Incorrect team password';
            END IF;
        END IF;
    ELSE
        -- Set the error message from registration eligibility
        m_join_result := m_eligibility_result->>'status';
    END IF;

    RETURN m_join_result;
END;
$$;

-- registration_eligibility(bigint, bigint)
CREATE FUNCTION public.registration_eligibility(p_contest_id bigint, p_user_id bigint) RETURNS json
    LANGUAGE plpgsql
    AS $$
DECLARE
    m_current_time TIMESTAMP;
    m_end_time TIMESTAMP;
    m_registration_paused BOOLEAN;
    m_team_id INT;
    result JSON;

BEGIN
    -- Get contest details
    SELECT end_time, registration_paused
    INTO  m_end_time, m_registration_paused
    FROM contests
    WHERE contests.id = p_contest_id;

    -- Check if the user is already registered and get the team_id
    SELECT team_id
    INTO m_team_id
    FROM team_members
    WHERE user_id = p_user_id
    AND contest_id = p_contest_id;

    -- Check eligibility conditions
    IF m_end_time IS NOT NULL THEN
        m_current_time := NOW();

        IF m_team_id IS NOT NULL THEN
            result := jsonb_build_object(
                'status', 'already registered',
                'team_id', m_team_id
            );

        ELSIF m_current_time < m_end_time AND NOT m_registration_paused THEN
            result := jsonb_build_object('status', 'eligible');
        ELSE
            result := jsonb_build_object('status', 'registration closed');
        END IF;
    ELSE
        result := jsonb_build_object('status', 'not eligible');
    END IF;
    RETURN result::JSON;
END;
$$;

-- submit_flag(bigint, bigint, text, bigint)
CREATE FUNCTION public.submit_flag(p_problem_id bigint, p_user_id bigint, flag text, p_variation_id bigint) RETURNS json
    LANGUAGE plpgsql
    AS $$
DECLARE
    m_status JSON;
    m_team_id INT;
    m_contest_id INT;
    m_problem_access JSON;
    m_assigned_variation_id INT;
    m_attempt_count INT;
    m_max_attempts INT;
    m_verdict TEXT;
    m_already_solved boolean;
    m_submission_id INT;
    m_submitted_variation_id INT;
    m_variation_id INT;
    m_all_variations JSON;
    m_valid_variation boolean;
    result JSON;
BEGIN

        m_problem_access := get_problem_access(p_problem_id, p_user_id);

       

        -- check the variation id

        SELECT jsonb_agg(jsonb_build_object('id', id, 'variation_name', variation_name)) INTO m_all_variations
        FROM (
            SELECT id, variation_name
            FROM problem_variations
            WHERE problem_id = p_problem_id
            ORDER BY id
        ) AS pv;

        
        IF m_all_variations IS NULL THEN
            result := jsonb_build_object('verdict', 'incorrect', 'submitted', false, 'error' , 'problem not found');
            RETURN result;
        END IF;

        
        IF p_variation_id < 1 THEN
            SELECT (m_all_variations->0->>'id')::INT INTO p_variation_id;
        ELSE
            -- check if the variation belongs to that problem. if not then return empty json
            SELECT EXISTS(
                SELECT 1
                FROM problem_variations
                WHERE problem_id = p_problem_id AND id = p_variation_id
            ) INTO m_valid_variation;

            IF m_valid_variation = FALSE THEN
                result := jsonb_build_object('verdict', 'incorrect', 'submitted', false, 'error', 'Invalid variation id');
                RETURN result;
            END IF;
           
        END IF;
        
        -------------------------



        IF m_problem_access->>'access' = 'organizer' THEN
            SELECT CASE 
                WHEN EXISTS (
                    SELECT 1
                    FROM problem_variations
                    WHERE id = p_variation_id
                    AND flag = ANY(flags)
                ) THEN 'correct'
                ELSE 'incorrect'
            END INTO m_verdict;


            return jsonb_build_object('verdict', m_verdict, 'submitted', true);

        END IF;


        

        IF m_problem_access->>'access' = 'none' 
        or m_problem_access->>'access' = 'restricted' 
        or m_problem_access->>'contest_status' = 'upcoming'
        or ( m_problem_access->>'contest_status' = 'ongoing' and (m_problem_access->>'contest_paused')::boolean = TRUE )
        or (m_problem_access->>'problem_hidden')::boolean = TRUE  THEN
            result := jsonb_build_object('submitted', false, 'error', 'Submission not allowed');
            RETURN result;
        END IF;


        IF m_problem_access->>'access' = 'participant' and m_problem_access->>'contest_status' = 'ongoing' THEN
            
            m_team_id := m_problem_access->>'team_id';

            SELECT CASE 
                WHEN EXISTS (
                    SELECT 1
                    FROM contest_solves
                    WHERE team_id = m_team_id
                    AND problem_id = p_problem_id
                ) THEN true
                ELSE false
            END INTO m_already_solved;

            IF m_already_solved THEN
                result := jsonb_build_object(
                  'submitted' , false,
                  'error', 'Already Solved'
                );
                RETURN result;
            END IF;
            
            SELECT get_assigned_variant(p_problem_id, m_team_id) INTO m_assigned_variation_id;

            SELECT attempt_count INTO m_attempt_count
            FROM team_attempts ta
            WHERE ta.team_id = m_team_id
            AND ta.problem_id = p_problem_id;

            IF m_attempt_count is null then m_attempt_count := 0; end if;

            SELECT max_attempts INTO m_max_attempts
            FROM contest_problems cp
            WHERE cp.id = p_problem_id;


            IF m_attempt_count >= m_max_attempts THEN
                result := jsonb_build_object(
                  'submitted' , false,
                  'error', 'Max Attempt Reached'
                );
                RETURN result;
            END IF;

            m_contest_id := m_problem_access->>'contest_id';

            SELECT CASE 
                WHEN EXISTS (
                    SELECT 1
                    FROM problem_variations
                    WHERE id = m_assigned_variation_id
                    AND flag = ANY(flags)
                ) THEN 'correct'
                ELSE 'incorrect'
            END INTO m_verdict;


            -- check if the user has submitted flag of other variation. If so then store that variation id

            SELECT id INTO m_submitted_variation_id
            from problem_variations
            where id <> m_assigned_variation_id and problem_id = p_problem_id
            AND flag = ANY(flags)
            limit 1;
            

            INSERT INTO contest_submissions(user_id, contest_id, problem_id, team_id, variation_id, verdict, flag)
            VALUES(p_user_id, m_contest_id, p_problem_id, m_team_id, m_assigned_variation_id,m_verdict, flag) returning id into m_submission_id;


            IF m_submitted_variation_id is not null then
                INSERT INTO flag_mismatch(user_id, contest_id, problem_id, flag, team_id, assigned_variation_id, submitted_variation_id, submission_id)
                VALUES(p_user_id, m_contest_id, p_problem_id, flag, m_team_id, m_assigned_variation_id, m_submitted_variation_id, m_submission_id);
            end if;

            return jsonb_build_object('verdict', m_verdict, 'submitted', true);

        ELSE
            
            IF m_problem_access->>'contest_status' = 'finished' THEN
                SELECT upsolve_submit_flag(p_problem_id, p_variation_id, p_user_id, flag) into result;
                return result;
            END if;

        
        END IF;
        
        return jsonb_build_object('verdict', 'incorrect', 'submitted', false);
    
END;
$$;

-- thread_chat_insert()
CREATE FUNCTION public.thread_chat_insert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$begin
  update public.contest_threads
  set last_updated = new.created_at, status = TRUE
  where id = new.thread_id;
  return new;
end;$$;

-- unlock_hint(bigint, bigint)
CREATE FUNCTION public.unlock_hint(p_hint_id bigint, p_user_id bigint) RETURNS json
    LANGUAGE plpgsql
    AS $$
DECLARE
    hints_data JSON;
    m_problem_id INT;
    m_penalty_score INT;   
    m_problem_access JSON;
    m_min_hint_id INT;  
    m_team_id INT;
    m_unlocked_id INT;
    m_unlocked_description TEXT;
BEGIN

    SELECT problem_id, penalty_score INTO m_problem_id, m_penalty_score
    FROM hints WHERE id = p_hint_id;


    IF m_problem_id is  null THEN
        RETURN json_build_object('error', 'Not found');
    END IF;

    SELECT get_problem_access(m_problem_id, p_user_id) INTO m_problem_access;

    IF m_problem_access->>'access' = 'participant'
        and m_problem_access->>'contest_status' = 'ongoing'
        -- and m_problem_access->>'contest_paused' <> 'true'
        and m_problem_access->>'problem_hidden' <> 'true'
        and m_penalty_score > 0 THEN
        
        m_team_id := m_problem_access->>'team_id';


        -- get the locked hint
        SELECT min(id) into m_min_hint_id
        FROM hints
        WHERE problem_id = m_problem_id
        and penalty_score > 0
        and id not in (
            SELECT hint_id
            FROM hint_unlocks
            WHERE team_id = m_team_id
        );

        IF m_min_hint_id = p_hint_id THEN
            INSERT INTO hint_unlocks (team_id, hint_id)
            VALUES (m_team_id, p_hint_id);
            
            -- SELECT id description of the hint and return as json
            SELECT id, description into m_unlocked_id, m_unlocked_description
            from hints where id = m_min_hint_id;

            RETURN json_build_object(
                'unlocked_id', m_unlocked_id,
                'unlocked_description', m_unlocked_description
            );
        
        ELSIF m_min_hint_id < p_hint_id THEN
            RETURN json_build_object('error', 'You must unlock the previous hint before this one');
        ELSE
            RETURN json_build_object('error', 'Already unlocked');
        END IF;
    
    
    END IF;

    RETURN json_build_object('error', 'You must be registered to the contest to unlock hints.');

END;
$$;

-- update_blogs_and_contents(integer, text, json[], integer)
CREATE FUNCTION public.update_blogs_and_contents(b_id integer, new_title text, content_array json[], u_id integer) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
    content_obj JSON;
    existing_entry_count INTEGER;
BEGIN
    -- Check if there's an entry with the given user_id and blog_id
    SELECT COUNT(*)
    INTO existing_entry_count
    FROM blogs
    WHERE blogs.id = b_id AND user_id = u_id;

    IF existing_entry_count = 0 THEN
        RETURN 'Error: No entry found with the given user_id and blog_id.';
    END IF;

    -- Insert the post title into the 'blogs' table
    UPDATE blogs
    SET created_at = CURRENT_TIMESTAMP,
        title = new_title
    WHERE id = b_id;

    -- delete already existing data
    DELETE FROM blogs_contents
    WHERE blog_id = b_id;

    -- Loop through each JSON object in the array
    FOREACH content_obj IN ARRAY content_array
    LOOP
        BEGIN
            -- Insert the JSON object into the 'blogs_contents' table
            INSERT INTO blogs_contents (type, content, blog_id)
            VALUES (content_obj->>'type', content_obj->>'content', b_id);
        EXCEPTION
            WHEN OTHERS THEN
                -- Rollback the transaction if an error occurs
                ROLLBACK;
                -- Return the error message
                RETURN 'Error: ' || SQLERRM;
        END;
    END LOOP;

    -- If no error occurred, return success
    RETURN 'Success';
END;
$$;

-- update_vote_count()
CREATE FUNCTION public.update_vote_count() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.type = 'up' THEN
            UPDATE blogs
            SET up_votes = up_votes + 1
            WHERE id = NEW.blog_id;
        ELSE
            UPDATE blogs
            SET down_votes = down_votes + 1
            WHERE id = NEW.blog_id;
        END IF;
    ELSIF TG_OP = 'UPDATE' THEN
        IF NEW.type <> OLD.type THEN
            IF NEW.type = 'up' THEN
                UPDATE blogs
                SET up_votes = up_votes + 1,
                    down_votes = down_votes - 1
                WHERE id = NEW.blog_id;
            ELSE
                UPDATE blogs
                SET down_votes = down_votes + 1,
                    up_votes = up_votes - 1
                WHERE id = NEW.blog_id;
            END IF;
        END IF;
    ELSIF TG_OP = 'DELETE' THEN
        IF OLD.type = 'up' THEN
            UPDATE blogs
            SET up_votes = up_votes - 1
            WHERE id = OLD.blog_id;
        ELSE
            UPDATE blogs
            SET down_votes = down_votes - 1
            WHERE id = OLD.blog_id;
        END IF;
    END IF;
    RETURN OLD;
END;
$$;

-- upsolve_submit_flag(bigint, bigint, bigint, text)
CREATE FUNCTION public.upsolve_submit_flag(p_problem_id bigint, p_variation_id bigint, p_user_id bigint, flag text) RETURNS json
    LANGUAGE plpgsql
    AS $$
DECLARE
    m_publicly_available boolean;
    m_variation_available boolean;
    m_verdict TEXT;

    m_submitted_id INT8;
    m_submitted_user_id INT8;
    m_submitted_time timestamp;


    result JSON;
BEGIN

    SELECT EXISTS(
            SELECT 1
            from contest_problems as cp
            left join contests c on c.id = cp.contest_id
            where c.type = 'public' and c.end_time < now() and cp.id = p_problem_id
    ) into m_publicly_available;
    
    m_publicly_available = true;
   
    IF m_publicly_available = false THEN return jsonb_build_object('submitted' , false, 'message', 'Problem Not Available');

    ELSE
        SELECT EXISTS(
            SELECT 1
            from problem_variations where problem_id = p_problem_id and id = p_variation_id
        ) into m_variation_available;

        IF m_variation_available = false THEN return jsonb_build_object('submitted' , false, 'message', 'Variation Not Found');

        ELSE
            SELECT CASE 
                WHEN EXISTS (
                    SELECT 1
                    FROM problem_variations
                    WHERE id = p_variation_id
                    AND flag = ANY(flags)
                ) THEN 'correct'
                ELSE 'incorrect'
            END INTO m_verdict;


        INSERT INTO upsolving_submissions(user_id, problem_id, variation_id, verdict, flag) 
        VALUES(p_user_id, p_problem_id, p_variation_id,m_verdict, flag) returning id, time  into m_submitted_id, m_submitted_time;


       return jsonb_build_object(
            'id', m_submitted_id,
            'submitted', true,
            'message', 'Submitted Successfully',
            'verdict', m_verdict,
            'time', m_submitted_time,
            'flag', flag,
            'problem_id', p_problem_id,
            'variation_id', p_variation_id
        );
        END IF;
        
    END IF;

    return jsonb_build_object('submitted' , false, 'message', 'Not submitted');

    
END;
$$;

