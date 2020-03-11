export interface ITargetMatcherOptions {
    targetNode: string;
    candidates: string[];
}

export const targetMatcher = async ({targetNode, candidates}: ITargetMatcherOptions): Promise<boolean> => {
    const dotedTargetVersions = `${targetNode}.`;
    const relevantVersions = candidates.filter((candidate) => {
        return candidate === targetNode || candidate.startsWith(dotedTargetVersions);
    });
    return relevantVersions.length > 0;
};
