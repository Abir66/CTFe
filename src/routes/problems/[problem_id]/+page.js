// @ts-ignore
export const load = async (loadEvent) => {
    const { fetch } = loadEvent;
    const { params } = loadEvent;
    const response = await fetch('/dummyAPI/problems/' + params.problem_id);
    const challenge = await response.json();
    return {
        challenge,
    };
}