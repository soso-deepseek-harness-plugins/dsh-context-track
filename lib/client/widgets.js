import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { formatHitPercent } from '../shared/figures.js';
import { abbreviate, copyText } from './format.js';
export const CATEGORY_KEY = {
    system: 'catSystem',
    user: 'catUser',
    tools: 'catTools',
    'tool-results': 'catResults',
    injection: 'catInjection',
    skill: 'catSkill',
    history: 'catHistory',
};
export function FigureView({ figure, t, pending = false, unseen = false, showBasis = true, format = abbreviate, }) {
    if (figure.basis === 'absent' || figure.value === undefined) {
        const label = unseen ? t('notSeen') : pending ? t('pending') : t('absent');
        return _jsx("span", { className: "dsh-context-track-muted", "data-basis": "absent", children: label });
    }
    const shown = format(figure.value);
    const badge = figure.basis === 'usage' ? t('exact') : t('estimated');
    const body = (_jsxs(_Fragment, { children: [showBasis && figure.basis === 'estimated' ? '≈ ' : null, shown.text, showBasis ? (_jsxs(_Fragment, { children: [' ', _jsx("span", { className: "dsh-context-track-badge", "data-basis": figure.basis, children: badge })] })) : null] }));
    if (!shown.abbreviated) {
        return _jsx("span", { className: "dsh-context-track-num", "data-basis": figure.basis, children: body });
    }
    return (_jsx("button", { type: "button", className: "dsh-context-track-num", title: shown.full, "data-full": shown.full, onClick: (event) => {
            event.stopPropagation();
            void copyText(shown.full);
        }, children: body }));
}
/**
 * Prompt caching reads as good news when it is high, so the tone tracks the
 * percentage rather than one fixed accent. The pill carries its own color and
 * tint so the number reads at a glance from the header.
 */
export function hitTone(figure) {
    if (figure.basis === 'absent' || figure.value === undefined)
        return 'absent';
    if (figure.value >= 80)
        return 'high';
    if (figure.value >= 50)
        return 'mid';
    return 'low';
}
export function HitRateBadge({ figure, t, stat }) {
    const tone = hitTone(figure);
    const text = figure.basis === 'absent' || figure.value === undefined ? t('absent') : formatHitPercent(figure.value);
    return (_jsxs("span", { className: "dsh-context-track-hit", "data-hit-tone": tone, "data-stat": stat, title: t('hitHint'), children: [_jsx("span", { className: "dsh-context-track-hit-label", children: t('hitRate') }), _jsx("span", { className: "dsh-context-track-hit-value", children: text })] }));
}
//# sourceMappingURL=widgets.js.map