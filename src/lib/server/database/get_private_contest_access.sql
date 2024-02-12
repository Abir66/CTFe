CREATE OR REPLACE FUNCTION get_contest_access(p_contest_id INT8, p_user_id INT8, p_password TEXT)
RETURNS JSON AS $$
DECLARE
    m_status JSON;
    m_team_id INT;
    contest_status TEXT;
    contest_paused boolean;
    m_contest_password TEXT;
    m_contest_type TEXT;
    result JSON;
BEGIN

    select type FROM contests WHERE contest_id = p_contest_id INTO m_contest_type;

    IF m_contest_type is null THEN
        result := jsonb_build_object(
            'success', false,
            'message', 'Contest not found'
        );
        RETURN result;
    END IF;

    select get_contest_access(p_contest_id) into m_status;


    IF m_contest_type->>'type' = 'private'
        and m_status->>'access' = 'restricted'
        and m_status->>'contest_access' = 'finished' THEN

        SELECT contest_password
        INTO m_contest_password
        FROM contests
        WHERE contest_id = p_contest_id;

        IF m_contest_password = p_password THEN

            INSERT INTO private_contest_access(contest_id, user_id)
            VALUES(p_contest_id, p_user_id)
            
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

$$ LANGUAGE plpgsql;


SELECT get_contest_access(7,9);