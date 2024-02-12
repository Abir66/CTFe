CREATE OR REPLACE FUNCTION get_contest_layout_data(p_contest_id INT8, p_user_id INT8)
RETURNS JSON AS $$
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
                'contest_name', m_contest_name
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
                'contest_name', m_contest_name
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
                'contest_name', m_contest_name
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

$$ LANGUAGE plpgsql;


SELECT get_contest_layout_data(2,9);