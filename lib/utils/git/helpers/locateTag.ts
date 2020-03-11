import {Repository, Reference} from 'nodegit';

export interface ILocateTagOptions {
    repo: Repository;
    tag: string;
}

export const locateTag = async ({repo, tag}: ILocateTagOptions): Promise<Reference> => {
    const refs = await repo.getReferences();
    const tagRefs = refs.filter((ref) => ref.isTag());
    const filteredTags = tagRefs.filter((currentTag) => {
        return currentTag.name().includes(tag);
    });
    if (filteredTags.length > 1) {
        throw new Error(`Too many matching tags for tag ${tag} - ${filteredTags}`);
    }
    const tagRef = filteredTags[0];
    if (!tagRef) {
        throw new Error(`Failed to locate tag ${tag}`);
    }
    return tagRef;
};
