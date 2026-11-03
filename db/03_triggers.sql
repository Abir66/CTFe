-- Application triggers.

-- blogs_votes blogs_votes_trigger
CREATE TRIGGER blogs_votes_trigger AFTER INSERT OR DELETE OR UPDATE ON public.blogs_votes FOR EACH ROW EXECUTE FUNCTION public.update_vote_count();

-- contest_submissions on_contest_submission
CREATE TRIGGER on_contest_submission AFTER INSERT ON public.contest_submissions FOR EACH ROW EXECUTE FUNCTION public.handle_contest_submission();

-- organizers on_join_organizer
CREATE TRIGGER on_join_organizer AFTER INSERT ON public.organizers FOR EACH ROW EXECUTE FUNCTION public.handle_join_organizer();

-- teams on_team_ban_and_unban
CREATE TRIGGER on_team_ban_and_unban AFTER UPDATE OF status ON public.teams FOR EACH ROW EXECUTE FUNCTION public.handle_team_ban();

-- team_members on_team_join
CREATE TRIGGER on_team_join AFTER INSERT ON public.team_members FOR EACH ROW EXECUTE FUNCTION public.handle_join_team();

-- teams on_team_registration
CREATE TRIGGER on_team_registration AFTER INSERT ON public.teams FOR EACH ROW EXECUTE FUNCTION public.handle_register_team();

-- contest_threads_chats on_thread_chat
CREATE TRIGGER on_thread_chat AFTER INSERT ON public.contest_threads_chats FOR EACH ROW EXECUTE FUNCTION public.thread_chat_insert();

-- upsolving_submissions on_upsolve_submission
CREATE TRIGGER on_upsolve_submission AFTER INSERT ON public.upsolving_submissions FOR EACH ROW EXECUTE FUNCTION public.handle_upsolve_submission();

-- contests organizers_insert_trigger
CREATE TRIGGER organizers_insert_trigger AFTER INSERT ON public.contests FOR EACH ROW EXECUTE FUNCTION public.insert_organizers();

