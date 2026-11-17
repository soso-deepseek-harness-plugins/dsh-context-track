/** Highlighted JSON source. Objects, arrays, and long strings fold from the gutter. */
import { type ReactNode } from 'react';
import type { TrackKey } from './locales.js';
export declare function JsonView({ value, t, chrome, }: {
    value: unknown;
    t: (key: TrackKey) => string;
    /** Copy and expand controls. Inline fragments leave them off. */
    chrome?: boolean;
}): ReactNode;
/** Object or array text embeds in a message card. Sentences and scalars stay prose. */
export declare function compositeJson(text: string): unknown | undefined;
//# sourceMappingURL=JsonView.d.ts.map