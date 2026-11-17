/** Named breakdowns for tool definitions, injected content, and skills. */
import { type ReactNode } from 'react';
import type { TrackKey } from './locales.js';
export declare const TOOL_PREVIEW = 5;
export type ToolListCategory = 'tools' | 'injection' | 'skill';
/** Largest entries first. Search runs before the preview cut. */
export declare function ToolList({ tools, overhead, category, t, nested, }: {
    tools: readonly {
        name: string;
        tokens: number;
        calls?: number;
    }[];
    overhead?: number;
    category?: ToolListCategory;
    t: (key: TrackKey) => string;
    /** Sit under the category row. The row already names the group. */
    nested?: boolean;
}): ReactNode;
//# sourceMappingURL=Inspector.d.ts.map