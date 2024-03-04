// @ts-ignore
export const load = async (loadEvent) => {
    const { fetch } = loadEvent;
    const response = await fetch('/dummyAPI/problems');
    const challenge = await response.json();
    return {
        challenge,
    };
}