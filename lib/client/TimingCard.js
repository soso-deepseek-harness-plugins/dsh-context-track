import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { formatDuration } from './format.js';
import { FigureView } from './widgets.js';
export function TimingCard({ report, t }) {
    const { timing } = report;
    const opening = timing.firstResponses.find(item => item.opening);
    const later = timing.firstResponses.filter(item => !item.opening);
    const total = timing.elapsed.basis === 'absent' ? undefined : timing.elapsed.value;
    const wait = timing.wait.value;
    const think = timing.think.value;
    /* Wait and think are slices of the wall clock, never a second total. */
    const segments = total !== undefined && total > 0
        ? [
            { key: 'wait', value: Math.max(wait ?? 0, 0) },
            { key: 'think', value: Math.max(think ?? 0, 0) },
            { key: 'rest', value: Math.max(total - (wait ?? 0) - (think ?? 0), 0) },
        ].filter(segment => segment.value > 0)
        : [];
    const summary = segments.map(segment => `${segmentLabel(segment.key, t)} ${formatDuration(segment.value).text}`).join(' · ');
    return (_jsxs("div", { className: "dsh-context-track-timing", "data-card": "timing", children: [segments.length > 0 ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "dsh-context-track-timing-bar", "data-time-bar": true, role: "img", "aria-label": summary, children: segments.map(segment => (_jsx("span", { "data-time-seg": segment.key, title: `${segmentLabel(segment.key, t)} ${formatDuration(segment.value).text}`, style: { flexGrow: segment.value } }, segment.key))) }), _jsx("div", { className: "dsh-context-track-timing-legend", "data-time-legend": true, children: segments.map(segment => (_jsxs("span", { className: "dsh-context-track-timing-legend-item", "data-time-key": segment.key, children: [_jsx("i", { "aria-hidden": "true" }), _jsx("span", { children: segmentLabel(segment.key, t) }), _jsx("b", { className: "dsh-context-track-num", children: formatDuration(segment.value).text })] }, segment.key))) })] })) : null, _jsxs("div", { className: "dsh-context-track-timing-grid", children: [_jsx(TimeCell, { name: "elapsed", label: t('elapsed'), figure: timing.elapsed, note: timing.elapsedRunning ? t('running') : undefined, t: t }), _jsx(TimeCell, { name: "wait", label: t('wait'), figure: timing.wait, t: t }), _jsx(TimeCell, { name: "think", label: t('think'), figure: timing.think, t: t }), _jsxs("div", { className: "dsh-context-track-timing-cell", "data-first": "title", "data-time": "first", children: [_jsx("span", { className: "dsh-context-track-timing-label", children: t('firstResponse') }), _jsx("span", { className: "dsh-context-track-timing-value", children: opening === undefined ? (_jsx(FigureView, { figure: { basis: 'absent' }, t: t })) : (_jsx(FigureView, { figure: opening.duration, t: t, showBasis: false, unseen: opening.pending, format: durationFormat })) }), opening?.noUserMessage ? _jsx("span", { className: "dsh-context-track-timing-note", children: t('noUser') }) : null] })] }), later.length > 0 ? (_jsx("div", { className: "dsh-context-track-timing-later", "data-time-later": true, children: later.map(item => (_jsxs("div", { className: "dsh-context-track-timing-later-row", "data-first": "later", children: [_jsx("span", { className: "dsh-context-track-timing-label", children: t('laterInput') }), _jsx("span", { className: "dsh-context-track-timing-value", children: _jsx(FigureView, { figure: item.duration, t: t, showBasis: false, unseen: item.pending, format: durationFormat }) })] }, item.seq))) })) : null] }));
}
/** Every bar segment and its legend entry share one name. */
function segmentLabel(key, t) {
    if (key === 'wait')
        return t('wait');
    if (key === 'think')
        return t('think');
    return t('timingRest');
}
function TimeCell({ name, label, figure, note, t, }) {
    return (_jsxs("div", { className: "dsh-context-track-timing-cell", "data-time": name, children: [_jsx("span", { className: "dsh-context-track-timing-label", children: label }), _jsxs("span", { className: "dsh-context-track-timing-value", children: [_jsx(FigureView, { figure: figure, t: t, showBasis: false, format: durationFormat }), note !== undefined ? _jsx("span", { className: "dsh-context-track-timing-note", "data-running": true, children: note }) : null] })] }));
}
function durationFormat(value) {
    return formatDuration(value);
}
//# sourceMappingURL=TimingCard.js.map