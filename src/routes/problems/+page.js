// @ts-ignore
export const load = async (loadEvent) => {
    const { fetch } = loadEvent;
    const response = await fetch('/dummyAPI/problems');
    const problems = await response.json();
    return {
        problems,
    };
}