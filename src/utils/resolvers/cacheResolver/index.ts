export interface ICacheResolveOptions {
    repo: {
        name: string;
        version: string;
    };
    targetNode: string;
}

export interface ICacheResolveResult {
    isMatch: boolean;
    resolverName?: string;
}

export const cacheResolve = async ({repo, targetNode}: ICacheResolveOptions): Promise<ICacheResolveResult> => {
    const reason = 'resaon';
    return {
        isMatch: true,
        resolverName: `cache - ${reason}`,
    };
};
