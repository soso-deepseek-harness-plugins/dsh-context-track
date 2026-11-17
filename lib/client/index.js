window.__ModuleLoader__.load({
	id: "dsh-context-track",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		//#region \0rolldown/runtime.js
		var __create = Object.create;
		var __defProp = Object.defineProperty;
		var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
		var __getOwnPropNames = Object.getOwnPropertyNames;
		var __getProtoOf = Object.getPrototypeOf;
		var __hasOwnProp = Object.prototype.hasOwnProperty;
		var __copyProps = (to, from, except, desc) => {
			if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
				key = keys[i];
				if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
					get: ((k) => from[k]).bind(null, key),
					enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
				});
			}
			return to;
		};
		var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
			value: mod,
			enumerable: true
		}) : target, mod));
		//#endregion
		let react_jsx_runtime = require("react/jsx-runtime");
		let react = require("react");
		react = __toESM(react, 1);
		//#region src/client/Icon.tsx
		/**
		* Draw a small tree mark.
		* @param props - edge length and an optional class from the guide capsule.
		* @returns the icon.
		*/
		function TraceIcon({ size = 16, className }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
				className,
				width: size,
				height: size,
				viewBox: "0 0 24 24",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("g", {
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "1.6",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M6 5h4v4H6zM14 10h4v4h-4zM6 15h4v4H6z" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M10 7h2a2 2 0 0 1 2 2v3M10 17h2a2 2 0 0 0 2-2v-3" })]
				})
			});
		}
		/**
		* Chip title: the glyph before the panel name.
		* @param props - locale seat. The registration sets the plugin namespace.
		* @returns the chip contents.
		*/
		function TraceTabTitle({ t }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(TraceIcon, { size: 16 }), t("panel")] });
		}
		/**
		* Stacked composition bars. The header disclosure uses it to look like a
		* control instead of a caption, and to echo the make-up bar inside the band.
		* @returns the icon.
		*/
		function BandIcon() {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
				className: "dsh-context-track-head-band-icon",
				width: "12",
				height: "12",
				viewBox: "0 0 16 16",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("g", {
					fill: "currentColor",
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("rect", {
							x: "1.5",
							y: "3",
							width: "8",
							height: "2.6",
							rx: "1.3"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("rect", {
							x: "10.5",
							y: "3",
							width: "4",
							height: "2.6",
							rx: "1.3",
							opacity: "0.55"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("rect", {
							x: "1.5",
							y: "6.7",
							width: "5",
							height: "2.6",
							rx: "1.3",
							opacity: "0.8"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("rect", {
							x: "7.5",
							y: "6.7",
							width: "7",
							height: "2.6",
							rx: "1.3",
							opacity: "0.5"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("rect", {
							x: "1.5",
							y: "10.4",
							width: "11",
							height: "2.6",
							rx: "1.3",
							opacity: "0.7"
						})
					]
				})
			});
		}
		/** One 14px monochrome glyph per node kind. Inline so no icon package ships with the client. */
		function NodeGlyph({ kind }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
				className: "dsh-context-track-glyph",
				width: 14,
				height: 14,
				viewBox: "0 0 16 16",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("g", {
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "1.4",
					strokeLinecap: "round",
					strokeLinejoin: "round",
					children: paths(kind)
				})
			});
		}
		function paths(kind) {
			switch (kind) {
				case "turn": return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
					cx: "8",
					cy: "8",
					r: "4.6"
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
					cx: "8",
					cy: "8",
					r: "1.1",
					fill: "currentColor",
					stroke: "none"
				})] });
				case "step": return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M8 2.8 13.2 8 8 13.2 2.8 8z" });
				case "attempt": return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M8.8 2.2 4.2 8.9h3.1l-1 4.9 4.6-6.7H7.8z" });
				case "tool": return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M10.6 2.9a3.2 3.2 0 0 0-4 4l-3.2 3.2a1.6 1.6 0 0 0 2.3 2.3l3.2-3.2a3.2 3.2 0 0 0 4-4l-2 2-1.9-.4-.4-1.9z" });
				case "child": return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M4 3v10" }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M4 8h4.2a2.4 2.4 0 0 0 2.4-2.4V3.4" }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M4 12h4.2a2.4 2.4 0 0 1 2.4 2.4v.2" })
				] });
				case "sidecar": return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M2.6 4.4h5l1.4 1.6h4.4v6.2H2.6z" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M5 8.6h6" })] });
				case "unlinked": return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M6.2 9.8 9.8 6.2" }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M5.4 11.4 4 12.8a2.3 2.3 0 0 1-3.2-3.2l1.4-1.4" }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M10.6 4.6 12 3.2a2.3 2.3 0 0 1 3.2 3.2l-1.4 1.4" })
				] });
			}
		}
		//#endregion
		//#region src/client/locales.ts
		/** Trace panel copy. Chinese is the key source of truth. */
		const zh = {
			panel: "上下文链路追踪",
			guide: "查看轮次、模型步骤、工具、子会话，以及会话命名、上下文压缩和检索。",
			empty: "没有打开的会话",
			hint: "点开左侧节点查看这次调用的输入和输出",
			missing: "这个节点已经不在会话里",
			unavailable: "子会话的上下文链路还不可用",
			round: "轮次 {n}",
			turn: "turn {n}",
			step: "step {n}",
			attempt: "llm_call {n}",
			unlinked: "未关联的子会话",
			title: "会话命名",
			titleMissing: "还没得到会话名",
			titleExcluded: "不计入轮次总消耗",
			compaction: "上下文压缩",
			reclaimed: "腾出",
			compactionCost: "摘要调用花费",
			compactionIncluded: "已在轮次总消耗里",
			watching: "正在看 {name}",
			compose: "这一窗的估算构成",
			search: "检索",
			running: "进行中",
			ok: "完成",
			error: "失败",
			aborted: "已中止",
			metadata: "元数据",
			messages: "输入消息",
			newMessages: "本次新增",
			tools: "工具",
			toolHistory: "工具历史",
			output: "输出",
			detailPane: "详情",
			arguments: "参数",
			result: "结果",
			child: "子会话",
			request: "请求",
			query: "查询词",
			trigger: "触发",
			instruction: "指令",
			instructionMissing: "未记录",
			summary: "摘要",
			rawOutput: "原始输出",
			usage: "用量",
			config: "配置",
			context: "路由",
			retry: "重试",
			expand: "展开",
			collapse: "收起",
			expandAll: "全部展开",
			collapseAll: "全部收起",
			noCalls: "尚无模型调用",
			total: "总消耗",
			input: "输入",
			reading: "阅读",
			jsonView: "JSON",
			parseJson: "按 JSON 解析",
			openInJson: "在 JSON 中打开",
			role: "角色",
			category: "分类",
			tokenLabel: "Token",
			source: "来源",
			toolName: "工具",
			call: "调用",
			remaining: "还有 {n} 个",
			showRest: "其余",
			copyJson: "复制",
			openChild: "在树中展开",
			exact: "精确",
			estimated: "估算",
			absent: "-",
			pending: "尚未结算",
			notSeen: "尚未看到",
			hitRate: "缓存命中率",
			hitHint: "缓存读取占计费输入的比例",
			attemptHit: "这次命中率",
			catSystem: "系统提示",
			catUser: "用户消息",
			catTools: "工具定义",
			catResults: "工具结果",
			catInjection: "注入内容",
			catSkill: "技能注入",
			catHistory: "历史回复",
			overhead: "定义开销",
			skillOverhead: "目录开销",
			calls: "{n} 次",
			delta: "差额",
			consistent: "一致",
			compactionLine: "压缩",
			subagentLine: "子会话另计",
			elapsed: "总耗时",
			wait: "模型等待",
			think: "模型思考",
			timingRest: "其他耗时",
			firstResponse: "首个响应",
			noThink: "这次没有思考片段",
			noUser: "没有用户消息，从轮次开始算",
			laterInput: "中途输入",
			toolUnion: "并集",
			toolSum: "累计",
			kindCompaction: "上下文压缩",
			back: "返回",
			searchTools: "搜索工具",
			searchInjection: "搜索注入内容",
			searchSkill: "搜索技能",
			sortSize: "按大小",
			sortName: "按名称",
			noToolMatch: "没有匹配的工具",
			noMatch: "没有匹配的内容",
			entries: "{n} 条",
			answer: "回答",
			reasoningBlock: "思考 token",
			sampling: "采样",
			model: "模型",
			provider: "提供方",
			temperature: "温度",
			reasoning: "推理强度",
			maxOutput: "输出上限",
			adapterDefault: "默认",
			retryDelay: "退避",
			finish: "状态",
			windowLabel: "窗口序号",
			routeLabel: "路由",
			bandTitle: "上下文详情",
			bandExpand: "展开上下文详情",
			bandCollapse: "收起上下文详情",
			blockCompose: "构成",
			blockTiming: "耗时",
			blockSide: "旁路",
			sideEmpty: "这一轮没有会话命名、压缩、子会话这类旁路调用",
			treeTitle: "调用树",
			stripLabel: "轮次",
			prevTurn: "上一轮",
			nextTurn: "下一轮",
			roundIndex: "轮次 {n} / {total}",
			summaryTurn: "{n} 个步骤",
			summaryTools: "{n} 个工具",
			summaryStep: "{calls} 次调用 · {tools} 个工具",
			closeDetail: "关闭详情",
			more: "更多",
			copied: "已复制",
			resetSplit: "恢复默认宽度",
			adjustSplit: "调整调用树宽度"
		};
		const en = {
			panel: "Context Trace",
			guide: "Inspect rounds, model steps, tools, subagents, session names, compaction, and search.",
			empty: "No open session",
			hint: "Select a node to see that call’s input and output",
			missing: "This node is no longer in the session",
			unavailable: "This subagent’s context trace is not available yet",
			round: "Round {n}",
			turn: "turn {n}",
			step: "step {n}",
			attempt: "llm_call {n}",
			unlinked: "Unlinked subagent",
			title: "Session name",
			titleMissing: "No session name yet",
			titleExcluded: "Not included in the round total",
			compaction: "Context compaction",
			reclaimed: "Freed",
			compactionCost: "Summary call",
			compactionIncluded: "Included in the round total",
			watching: "Viewing {name}",
			compose: "Estimated makeup of this window",
			search: "Search",
			running: "Running",
			ok: "Done",
			error: "Failed",
			aborted: "Aborted",
			metadata: "Metadata",
			messages: "Input messages",
			newMessages: "New this call",
			tools: "Tools",
			toolHistory: "Tool history",
			output: "Output",
			detailPane: "Detail",
			arguments: "Arguments",
			result: "Result",
			child: "Subagent",
			request: "Request",
			query: "Query",
			trigger: "Trigger",
			instruction: "Instruction",
			instructionMissing: "Not recorded",
			summary: "Summary",
			rawOutput: "Raw output",
			usage: "Usage",
			config: "Config",
			context: "Route",
			retry: "Retry",
			expand: "Expand",
			collapse: "Collapse",
			expandAll: "Expand all",
			collapseAll: "Collapse all",
			noCalls: "No model calls yet",
			total: "Total",
			input: "Input",
			reading: "Reading",
			jsonView: "JSON",
			parseJson: "Parse as JSON",
			openInJson: "Open in JSON",
			role: "Role",
			category: "Category",
			tokenLabel: "Token",
			source: "Source",
			toolName: "Tool",
			call: "Call",
			remaining: "{n} more",
			showRest: "More",
			copyJson: "Copy",
			openChild: "Expand in the tree",
			exact: "Exact",
			estimated: "Estimated",
			absent: "-",
			pending: "Not settled",
			notSeen: "Not seen yet",
			hitRate: "Cache hit rate",
			hitHint: "Cache reads as a share of billed input",
			attemptHit: "This attempt",
			catSystem: "System prompt",
			catUser: "User messages",
			catTools: "Tool definitions",
			catResults: "Tool results",
			catInjection: "Injected content",
			catSkill: "Skill injection",
			catHistory: "Earlier replies",
			overhead: "Definition overhead",
			skillOverhead: "Catalog overhead",
			calls: "{n} calls",
			delta: "Difference",
			consistent: "Matches",
			compactionLine: "Compaction",
			subagentLine: "Subagent, separate",
			elapsed: "Elapsed",
			wait: "Model wait",
			think: "Model thinking",
			timingRest: "Other time",
			firstResponse: "First response",
			noThink: "This attempt had no thinking fragment",
			noUser: "No user message; counted from the round start",
			laterInput: "Later input",
			toolUnion: "Union",
			toolSum: "Sum",
			kindCompaction: "Context compaction",
			back: "Back",
			searchTools: "Search tools",
			searchInjection: "Search injected content",
			searchSkill: "Search skills",
			sortSize: "By size",
			sortName: "By name",
			noToolMatch: "No matching tools",
			noMatch: "No matching content",
			entries: "{n} entries",
			answer: "Answer",
			reasoningBlock: "Thinking tokens",
			sampling: "Sampling",
			model: "Model",
			provider: "Provider",
			temperature: "Temperature",
			reasoning: "Reasoning",
			maxOutput: "Output cap",
			adapterDefault: "Default",
			retryDelay: "Backoff",
			finish: "Status",
			windowLabel: "Window seq",
			routeLabel: "Route",
			bandTitle: "Context details",
			bandExpand: "Expand context details",
			bandCollapse: "Collapse context details",
			blockCompose: "Makeup",
			blockTiming: "Timing",
			blockSide: "Sidecars",
			sideEmpty: "No session naming, compaction, or subagent call in this round",
			treeTitle: "Call tree",
			stripLabel: "Rounds",
			prevTurn: "Previous round",
			nextTurn: "Next round",
			roundIndex: "Round {n} / {total}",
			summaryTurn: "{n} steps",
			summaryTools: "{n} tools",
			summaryStep: "{calls} calls · {tools} tools",
			closeDetail: "Close detail",
			more: "More",
			copied: "Copied",
			resetSplit: "Reset width",
			adjustSplit: "Resize the call tree"
		};
		const NS = "dsh-context-track";
		//#endregion
		//#region src/client/remote.ts
		/** Strict boundary codec. The gateway checks the mode; parsing stays local. */
		function strictCodec(typeSymbol, parse) {
			return {
				mode: "strict",
				typeSymbol,
				create: () => ({ parse }),
				jsonSchema: { description: typeSymbol }
			};
		}
		const stringCodec = strictCodec("string", (value) => {
			if (typeof value !== "string") throw new Error("dsh-context-track: remote argument must be a string");
			return value;
		});
		/** Mount this before reading `ctx.remote.track`. Nothing else publishes the namespace. */
		const trackRemote = {
			package: "dsh-context-track",
			descriptors: [{
				id: "dsh-context-track#track/getNode",
				service: "track",
				namespace: "track",
				method: "getNode",
				invocation: { kind: "direct" },
				parameters: [{
					name: "sessionId",
					wire: "sessionId",
					source: "json",
					codec: stringCodec
				}, {
					name: "nodeId",
					wire: "nodeId",
					source: "json",
					codec: stringCodec
				}],
				cancellation: { parameter: "signal" },
				result: strictCodec("dsh-context-track#NodeDetail", (value) => value)
			}, {
				id: "dsh-context-track#track/getTurn",
				service: "track",
				namespace: "track",
				method: "getTurn",
				invocation: { kind: "direct" },
				parameters: [
					{
						name: "sessionId",
						wire: "sessionId",
						source: "json",
						codec: stringCodec
					},
					{
						name: "turnId",
						wire: "turnId",
						source: "json",
						codec: stringCodec
					},
					{
						name: "attemptId",
						wire: "attemptId",
						source: "json",
						codec: stringCodec
					}
				],
				cancellation: { parameter: "signal" },
				result: strictCodec("dsh-context-track#TurnReport", (value) => value)
			}]
		};
		//#endregion
		//#region src/shared/detail.ts
		function isMissing(detail) {
			return "missing" in detail && detail.missing === true;
		}
		//#endregion
		//#region src/shared/figures.ts
		/** Read a model usage object. Anything without both input and output counts is ignored. */
		function parseUsage(value) {
			if (value === null || typeof value !== "object") return void 0;
			const source = value;
			if (typeof source.inputTokens !== "number" || typeof source.outputTokens !== "number") return void 0;
			const usage = {
				inputTokens: source.inputTokens,
				outputTokens: source.outputTokens
			};
			for (const key of [
				"totalTokens",
				"cacheReadTokens",
				"cacheWriteTokens",
				"reasoningTokens"
			]) {
				const item = source[key];
				if (typeof item === "number") usage[key] = item;
			}
			return usage;
		}
		function usageFigure(value) {
			return {
				basis: "usage",
				value
			};
		}
		function absentFigure() {
			return { basis: "absent" };
		}
		/** One call's bill. Reasoning is reported beside output and is not added again. */
		function billOf(usage) {
			if (usage === void 0) {
				const absent = absentFigure();
				return {
					input: absent,
					output: absent,
					total: absent,
					reasoning: absent,
					cacheRead: absent,
					cacheWrite: absent
				};
			}
			const cacheRead = usage.cacheReadTokens;
			const cacheWrite = usage.cacheWriteTokens;
			const input = usage.inputTokens + (cacheRead ?? 0) + (cacheWrite ?? 0);
			const output = usage.outputTokens;
			const total = usage.totalTokens ?? input + output;
			return {
				input: usageFigure(input),
				output: usageFigure(output),
				total: usageFigure(total),
				reasoning: usage.reasoningTokens === void 0 ? absentFigure() : usageFigure(usage.reasoningTokens),
				cacheRead: cacheRead === void 0 ? absentFigure() : usageFigure(cacheRead),
				cacheWrite: cacheWrite === void 0 ? absentFigure() : usageFigure(cacheWrite)
			};
		}
		/**
		* Cache reads divided by billed input, truncated to two decimal percent points.
		* Unreported cache fields count as 0. A billed input that is not positive is absent.
		* Callers sum the attempts first; this does not average percents.
		*/
		function cacheHitRate(usages) {
			if (usages.length === 0) return absentFigure();
			let read = 0;
			let billed = 0;
			for (const usage of usages) {
				const cacheRead = usage.cacheReadTokens ?? 0;
				const cacheWrite = usage.cacheWriteTokens ?? 0;
				read += cacheRead;
				billed += usage.inputTokens + cacheRead + cacheWrite;
			}
			if (billed <= 0) return absentFigure();
			return usageFigure(Math.trunc(read / billed * 1e4) / 100);
		}
		/** Sum reported calls. A call without `totalTokens` makes the sum fall back to input plus output. */
		function sumUsage(usages) {
			if (usages.length === 0) return void 0;
			const sum = {
				inputTokens: 0,
				outputTokens: 0
			};
			let total = 0;
			let totalKnown = true;
			let cacheRead = 0;
			let cacheReadKnown = false;
			let cacheWrite = 0;
			let cacheWriteKnown = false;
			let reasoning = 0;
			let reasoningKnown = false;
			for (const usage of usages) {
				sum.inputTokens += usage.inputTokens;
				sum.outputTokens += usage.outputTokens;
				if (usage.totalTokens === void 0) totalKnown = false;
				else total += usage.totalTokens;
				if (usage.cacheReadTokens !== void 0) {
					cacheRead += usage.cacheReadTokens;
					cacheReadKnown = true;
				}
				if (usage.cacheWriteTokens !== void 0) {
					cacheWrite += usage.cacheWriteTokens;
					cacheWriteKnown = true;
				}
				if (usage.reasoningTokens !== void 0) {
					reasoning += usage.reasoningTokens;
					reasoningKnown = true;
				}
			}
			if (cacheReadKnown) sum.cacheReadTokens = cacheRead;
			if (cacheWriteKnown) sum.cacheWriteTokens = cacheWrite;
			if (reasoningKnown) sum.reasoningTokens = reasoning;
			if (totalKnown) sum.totalTokens = total;
			return sum;
		}
		/** Sum the attempts stored on a session index. Child sessions are totaled on their own. */
		function sessionUsage(root) {
			const usages = [];
			for (const node of root) {
				if (node.kind !== "turn" || !Array.isArray(node.items)) continue;
				for (const item of node.items) {
					if (item === null || typeof item !== "object" || item.kind !== "step") continue;
					const attempts = item.attempts ?? [];
					for (const attempt of attempts) if (attempt.usage !== void 0) usages.push(attempt.usage);
				}
			}
			return billOf(sumUsage(usages)).total;
		}
		/** `66.66` renders as `66.66%` without rounding up. */
		function formatHitPercent(value) {
			const truncated = Math.trunc(value * 100) / 100;
			const [whole, fraction = ""] = String(truncated).split(".");
			return `${whole}.${fraction.padEnd(2, "0")}%`;
		}
		function emptyTrack() {
			return {
				stateVersion: 4,
				root: []
			};
		}
		/** Locate one index node by the id the client sends to `getNode`. */
		function findNode(state, id) {
			for (const root of state.root) {
				const found = findInRoot(root, id);
				if (found) return found;
			}
		}
		function findInRoot(node, id) {
			if (node.kind === "sidecar") return node.id === id ? {
				kind: "sidecar",
				node
			} : void 0;
			if (node.kind === "unlinked") return node.id === id ? {
				kind: "unlinked",
				node
			} : void 0;
			if (node.id === id) return {
				kind: "turn",
				node
			};
			for (const item of node.items) {
				if (item.kind === "sidecar" && item.id === id) return {
					kind: "sidecar",
					node: item
				};
				if (item.kind === "unlinked" && item.id === id) return {
					kind: "unlinked",
					node: item
				};
				if (item.kind !== "step") continue;
				if (item.id === id) return {
					kind: "step",
					node: item
				};
				for (const search of item.searches ?? []) if (search.id === id) return {
					kind: "sidecar",
					node: search
				};
				for (const attempt of item.attempts) if (attempt.id === id) return {
					kind: "attempt",
					node: attempt,
					step: item
				};
				for (const tool of item.tools) {
					if (tool.id === id) return {
						kind: "tool",
						node: tool
					};
					for (const search of tool.searches ?? []) if (search.id === id) return {
						kind: "sidecar",
						node: search
					};
				}
			}
		}
		/**
		* Every row starts open so the whole call tree is readable at first paint.
		* The choice stays in the component; a user collapse survives until a later
		* node is opened with the chevron.
		*/
		function defaultExpanded(_kind, _status) {
			return true;
		}
		/** An external child has no local log, so the tree does not offer a chevron. */
		function childExpandable(mode) {
			return mode !== "external";
		}
		/** Toggle one id. `open` is component state; this never writes a projection. */
		function toggleExpanded(open, id, fallback) {
			const current = open[id] ?? fallback;
			return {
				...open,
				[id]: !current
			};
		}
		//#endregion
		//#region src/shared/estimate.ts
		/**
		* Fixed-density token heuristic.
		* About four characters make one token. Ordinary blocks add 4. A role adds 4.
		* System prompts skip the per-block add. Images with a size use a patch grid.
		*/
		const CHARS_PER_TOKEN = 4;
		const BLOCK_OVERHEAD = 4;
		const ROLE_OVERHEAD = 4;
		/** Vision constants: patch 14, 3× downsample, 1024 token cap, 544² minimum. */
		const PATCH = 14;
		const DOWNSAMPLE = 3;
		const MAX_IMAGE_TOKENS = 1024;
		const MIN_PIXELS = 295936;
		/** Bare character tokens for one fragment, without block or role overhead. */
		function textTokens(text) {
			return charTokens(text);
		}
		function charTokens(text) {
			return Math.ceil(text.length / CHARS_PER_TOKEN);
		}
		function jsonLength(value) {
			try {
				const json = JSON.stringify(value);
				return json === void 0 ? 0 : json.length;
			} catch {
				return 0;
			}
		}
		function density(value) {
			return Math.ceil(jsonLength(value) / CHARS_PER_TOKEN);
		}
		/**
		* LLM tokens for one image after the official resize.
		* `[IMAGE_START] + ([IMAGE] * width + newline) * height + [IMAGE_END]`, capped at 1024.
		*/
		function imagePatchTokens(width, height) {
			let w = width;
			let h = height;
			if (w > 0 && h > 0 && w * h < MIN_PIXELS) {
				const ratio = Math.sqrt(MIN_PIXELS / (w * h));
				w = Math.trunc(w * ratio);
				h = Math.trunc(h * ratio);
			}
			let bestWidth = Math.ceil(w / PATCH) * PATCH;
			let bestHeight = Math.ceil(h / PATCH) * PATCH;
			let [rows, cols] = llmGrid(bestHeight, bestWidth);
			if (numImageTokens(rows, cols) > MAX_IMAGE_TOKENS) {
				const solved = solveResize(h, w);
				bestHeight = solved.height;
				bestWidth = solved.width;
				[rows, cols] = llmGrid(bestHeight, bestWidth);
			}
			return numImageTokens(rows, cols);
		}
		function llmGrid(bestHeight, bestWidth) {
			return [Math.ceil(Math.floor(bestHeight / PATCH) / DOWNSAMPLE), Math.ceil(Math.floor(bestWidth / PATCH) / DOWNSAMPLE)];
		}
		function numImageTokens(rows, cols) {
			return rows * (cols + 1) + 2;
		}
		function solveResize(height, width) {
			const ratio = width === 0 ? 0 : height / width;
			const maxWidth = ratio === 0 ? 0 : Math.sqrt((MAX_IMAGE_TOKENS - 2) / ratio + .25) - .5;
			const maxHeight = maxWidth * ratio;
			const cell = PATCH * DOWNSAMPLE;
			if (maxWidth < 1) return {
				height: Math.floor((MAX_IMAGE_TOKENS - 2) / 2) * cell,
				width: cell
			};
			if (maxHeight < 1) return {
				height: cell,
				width: (MAX_IMAGE_TOKENS - 3) * cell
			};
			const beta = Math.min(Math.floor(maxWidth) * cell / width, Math.floor(maxHeight) * cell / height);
			return {
				height: Math.floor(height * beta / PATCH) * PATCH,
				width: Math.floor(width * beta / PATCH) * PATCH
			};
		}
		function imageSize(block) {
			if (block === null || typeof block !== "object") return void 0;
			const attachment = block.attachment;
			if (attachment === null || typeof attachment !== "object") return void 0;
			const source = attachment;
			const width = sizeField(source, ["width", "pixelWidth"]);
			const height = sizeField(source, ["height", "pixelHeight"]);
			if (width === void 0 || height === void 0) return void 0;
			return {
				width,
				height
			};
		}
		function sizeField(source, keys) {
			for (const key of keys) {
				const value = source[key];
				if (typeof value === "number" && Number.isFinite(value) && value > 0) return value;
			}
		}
		function blockPrice(block, system) {
			if (block === null || typeof block !== "object") return 0;
			const row = block;
			if (row.type === "text" || row.type === "reasoning") {
				const chars = charTokens(typeof row.text === "string" ? row.text : "");
				return system ? chars : chars + BLOCK_OVERHEAD;
			}
			if (row.type === "image") {
				const size = imageSize(row);
				if (size !== void 0) return imagePatchTokens(size.width, size.height);
			}
			const tokens = density(row);
			return system ? tokens : tokens + BLOCK_OVERHEAD;
		}
		function contentOf(message) {
			if (message === null || typeof message !== "object") return [];
			const content = message.content;
			return Array.isArray(content) ? content : [];
		}
		/** An assistant placeholder with no content is free. It does not pay the role overhead. */
		function isEmptyAssistant(message) {
			if (message === null || typeof message !== "object") return false;
			if (message.role !== "assistant") return false;
			const content = contentOf(message);
			if (content.length === 0) return true;
			return content.every((block) => {
				if (block === null || typeof block !== "object") return false;
				const row = block;
				if (row.type !== "text" && row.type !== "reasoning") return false;
				return typeof row.text !== "string" || row.text.length === 0;
			});
		}
		function isNonEmptySystem(message) {
			if (message === null || typeof message !== "object") return false;
			if (message.role !== "system") return false;
			return contentOf(message).some((block) => {
				if (block === null || typeof block !== "object") return false;
				const row = block;
				if (row.type === "text" || row.type === "reasoning") return typeof row.text === "string" && row.text.trim().length > 0;
				return true;
			});
		}
		/** Price one message. System messages skip the per-block overhead. */
		function estimateMessage(message, system = false) {
			if (isEmptyAssistant(message)) return 0;
			return contentOf(message).reduce((sum, block) => sum + blockPrice(block, system), 0) + ROLE_OVERHEAD;
		}
		/** Whole tool table, each tool, and the wrapper gap when the table is more expensive. */
		function estimateTools(tools) {
			if (!Array.isArray(tools) || tools.length === 0) return {
				table: 0,
				tools: []
			};
			const table = density(tools) + BLOCK_OVERHEAD;
			const priced = tools.map((tool) => ({
				name: toolName(tool),
				tokens: density(tool),
				definition: tool
			}));
			const overhead = table - priced.reduce((sum, tool) => sum + tool.tokens, 0);
			return {
				table,
				tools: priced,
				...overhead > 0 ? { overhead } : {}
			};
		}
		function toolName(tool) {
			if (tool !== null && typeof tool === "object" && typeof tool.name === "string") {
				const name = tool.name;
				if (name.length > 0) return name;
			}
			return "tool";
		}
		//#endregion
		//#region src/shared/classify.ts
		/**
		* Split one model window into token buckets.
		* Tool results are grouped by name. Their call count is the number of result messages.
		*/
		const EMPTY_TOTALS = () => ({
			system: 0,
			user: 0,
			tools: 0,
			"tool-results": 0,
			injection: 0,
			skill: 0,
			history: 0
		});
		/** Classify the messages and tool schemas one attempt actually saw. */
		function classifyWindow(messages, tools) {
			const list = Array.isArray(messages) ? messages : [];
			let systemIndex = -1;
			for (let index = list.length - 1; index >= 0; index -= 1) if (isNonEmptySystem(list[index])) {
				systemIndex = index;
				break;
			}
			const names = toolNames(list);
			const totals = EMPTY_TOTALS();
			const items = [];
			const resultMap = /* @__PURE__ */ new Map();
			const injectionMap = /* @__PURE__ */ new Map();
			const skillMap = /* @__PURE__ */ new Map();
			let skillOverhead = 0;
			list.forEach((message, index) => {
				const category = categoryOf(message, index === systemIndex);
				if (category === void 0) return;
				const tokens = estimateMessage(message, category === "system");
				const toolName = category === "tool-results" || category === "skill" ? resultName(message, names) : void 0;
				if (category === "tool-results" && toolName !== void 0) {
					const line = resultMap.get(toolName) ?? {
						name: toolName,
						tokens: 0,
						calls: 0
					};
					line.tokens += tokens;
					line.calls += 1;
					resultMap.set(toolName, line);
				}
				if (category === "injection") addLine(injectionMap, sourceLabel(message), tokens);
				if (category === "skill") {
					const catalog = catalogLines(message);
					if (catalog === void 0) addLine(skillMap, sourceLabel(message), tokens);
					else {
						const listed = catalog.reduce((sum, line) => sum + line.tokens, 0);
						skillOverhead += Math.max(0, tokens - listed);
						for (const line of catalog) addLine(skillMap, line.name, line.tokens);
					}
				}
				totals[category] += tokens;
				items.push({
					category,
					tokens,
					...roleOf$1(message) !== void 0 ? { role: roleOf$1(message) } : {},
					...toolName !== void 0 ? { toolName } : {},
					message
				});
			});
			const priced = estimateTools(tools);
			totals.tools = priced.table;
			const estimatedTotal = Object.values(totals).reduce((sum, value) => sum + value, 0);
			return {
				items,
				totals,
				tools: priced.tools,
				...priced.overhead !== void 0 ? { definitionOverhead: priced.overhead } : {},
				toolResults: [...resultMap.values()],
				injections: [...injectionMap.values()],
				skills: [...skillMap.values()],
				...skillOverhead > 0 ? { skillOverhead } : {},
				estimatedTotal
			};
		}
		function addLine(map, name, tokens) {
			const line = map.get(name) ?? {
				name,
				tokens: 0,
				calls: 0
			};
			line.tokens += tokens;
			line.calls += 1;
			map.set(name, line);
		}
		function categoryOf(message, isSystemPrompt) {
			if (message === null || typeof message !== "object") return void 0;
			if (isSystemPrompt) return "system";
			if (isSkillMessage(message)) return "skill";
			const role = roleOf$1(message);
			if (role === "tool") return "tool-results";
			if (isInjection(message)) return "injection";
			if (role === "assistant") return "history";
			if (role === "user" || role === "developer") return "user";
		}
		function isSkillMessage(message) {
			const kind = sourceKind(message);
			if (kind === "skill-invocation" || kind === "skill-catalog") return true;
			if (roleOf$1(message) !== "tool") return false;
			return toolText(message).includes("<skill_content>");
		}
		function isInjection(message) {
			const source = sourceOf(message);
			if (source === void 0) return false;
			const kind = typeof source.kind === "string" ? source.kind : void 0;
			if (kind === "user" || kind === "model" || kind === "tool" || kind === "system-prompt") return false;
			if (kind === "skill-invocation" || kind === "skill-catalog") return false;
			return kind !== void 0 || source.form !== void 0;
		}
		function resultName(message, names) {
			const callId = toolCallId(message);
			if (callId !== void 0 && names.has(callId)) return names.get(callId);
			return "tool";
		}
		function toolNames(messages) {
			const names = /* @__PURE__ */ new Map();
			for (const message of messages) for (const block of contentBlocks$1(message)) {
				if (block.type !== "tool-call") continue;
				if (typeof block.id !== "string" || typeof block.name !== "string" || block.name.length === 0) continue;
				names.set(block.id, block.name);
			}
			return names;
		}
		function contentBlocks$1(message) {
			if (message === null || typeof message !== "object") return [];
			const content = message.content;
			if (!Array.isArray(content)) return [];
			return content.filter((block) => block !== null && typeof block === "object");
		}
		function toolText(message) {
			return contentBlocks$1(message).map((block) => typeof block.text === "string" ? block.text : "").join("");
		}
		function roleOf$1(message) {
			if (message === null || typeof message !== "object") return void 0;
			const role = message.role;
			return typeof role === "string" ? role : void 0;
		}
		function sourceOf(message) {
			if (message === null || typeof message !== "object") return void 0;
			const source = message.source;
			return source !== null && typeof source === "object" ? source : void 0;
		}
		function sourceKind(message) {
			const kind = sourceOf(message)?.kind;
			return typeof kind === "string" ? kind : void 0;
		}
		function toolCallId(message) {
			if (message === null || typeof message !== "object") return void 0;
			const direct = message.toolCallId;
			if (typeof direct === "string" && direct.length > 0) return direct;
			const nested = sourceOf(message)?.callId;
			return typeof nested === "string" && nested.length > 0 ? nested : void 0;
		}
		/** A short source label for an injection or skill row. Bodies stay out of the label. */
		function sourceLabel(message) {
			const source = sourceOf(message);
			if (source === void 0) return "injection";
			for (const key of [
				"path",
				"file",
				"filename",
				"name",
				"label",
				"uri",
				"skill"
			]) {
				const value = source[key];
				if (typeof value === "string" && value.length > 0) return value;
			}
			return typeof source.kind === "string" ? source.kind : "injection";
		}
		/**
		* Split a skill catalog into one line per listed skill, the way tools are split.
		* The structured source carries each entry; older logs fall back to the list text.
		*/
		function catalogLines(message) {
			const source = sourceOf(message);
			if (source?.kind !== "skill-catalog") return void 0;
			const entries = source.entries;
			const lines = [];
			if (Array.isArray(entries)) for (const entry of entries) {
				if (entry === null || typeof entry !== "object") continue;
				const row = entry;
				const name = typeof row.name === "string" && row.name.length > 0 ? row.name : void 0;
				if (name === void 0) continue;
				const description = typeof row.description === "string" ? row.description : "";
				lines.push({
					name,
					tokens: textTokens(`- \`${name}\`: ${description}\n`)
				});
			}
			return lines.length > 0 ? lines : catalogTextLines(message);
		}
		function catalogTextLines(message) {
			const body = /<available_skills>([\s\S]*?)<\/available_skills>/.exec(toolText(message))?.[1];
			if (body === void 0) return void 0;
			const lines = [];
			for (const line of body.split("\n")) {
				const match = /^\s*-\s+`([^`]+)`/.exec(line);
				if (match === null) continue;
				lines.push({
					name: match[1],
					tokens: textTokens(`${line}\n`)
				});
			}
			return lines.length > 0 ? lines : void 0;
		}
		//#endregion
		//#region src/client/format.ts
		function abbreviate(value) {
			const full = String(value);
			const abs = Math.abs(value);
			if (!Number.isFinite(value) || abs < 1e4) return {
				text: full,
				full,
				abbreviated: false
			};
			for (const [unit, suffix] of [
				[0xe8d4a51000, "T"],
				[1e9, "B"],
				[1e6, "M"],
				[1e3, "k"]
			]) {
				if (abs < unit) continue;
				const scaled = abs / unit;
				const factor = 10 ** (scaled >= 100 ? 0 : scaled >= 10 ? 1 : 2);
				const truncated = Math.trunc(scaled * factor) / factor;
				return {
					text: `${value < 0 ? "-" : ""}${truncated}${suffix}`,
					full,
					abbreviated: true
				};
			}
			return {
				text: full,
				full,
				abbreviated: false
			};
		}
		function formatDuration(ms) {
			const full = String(ms);
			if (Math.abs(ms) < 1e3) return {
				text: `${full} ms`,
				full,
				abbreviated: false
			};
			return {
				text: `${Math.trunc(ms / 100) / 10} s`,
				full,
				abbreviated: true
			};
		}
		async function copyText(value) {
			const clipboard = navigator.clipboard;
			if (clipboard !== void 0 && typeof clipboard.writeText === "function") await clipboard.writeText(value);
		}
		//#endregion
		//#region src/client/JsonView.tsx
		/** Highlighted JSON source. Objects, arrays, and long strings fold from the gutter. */
		const STRING_LIMIT = 120;
		const PREVIEW_CHARS = 40;
		function JsonView({ value, t, chrome = true }) {
			const text = typeof value === "string" ? value : stringify$1(value);
			const parsed = tryParse(text);
			const [fold, setFold] = (0, react.useState)({
				text,
				bulk: "default",
				overrides: {},
				parsed: {}
			});
			const live = fold.text === text ? fold : {
				text,
				bulk: "default",
				overrides: {},
				parsed: {}
			};
			if (fold.text !== text) setFold(live);
			const copyValue = parsed === void 0 ? text : JSON.stringify(parsed, null, 2);
			const toggle = (path, open) => {
				setFold((current) => {
					const base = current.text === text ? current : live;
					return {
						...base,
						overrides: {
							...base.overrides,
							[path]: !open
						}
					};
				});
			};
			const parseString = (path) => {
				setFold((current) => {
					const base = current.text === text ? current : live;
					return {
						...base,
						parsed: {
							...base.parsed,
							[path]: base.parsed[path] !== true
						}
					};
				});
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				"data-json-view": true,
				children: [chrome ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "dsh-context-track-json-tools",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						"data-copy-json": true,
						onClick: () => {
							copyText(copyValue);
						},
						children: t("copyJson")
					}), parsed !== void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "dsh-context-track-json-bulk",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								setFold((current) => ({
									...current.text === text ? current : live,
									bulk: "open",
									overrides: {}
								}));
							},
							children: t("expandAll")
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								setFold((current) => ({
									...current.text === text ? current : live,
									bulk: "shut",
									overrides: {}
								}));
							},
							children: t("collapseAll")
						})]
					}) : null]
				}) : null, parsed === void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("pre", {
					className: "dsh-context-track-pre",
					"data-json": "plain",
					children: text
				}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "dsh-context-track-json-source",
					"data-json": "source",
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(JsonNode, {
						path: "",
						value: parsed,
						depth: 0,
						fold: live,
						t,
						onToggle: toggle,
						onParse: parseString
					})
				})]
			});
		}
		/** Object or array text embeds in a message card. Sentences and scalars stay prose. */
		function compositeJson(text) {
			const parsed = tryParse(text);
			if (parsed === void 0 || parsed === null || typeof parsed !== "object") return void 0;
			return parsed;
		}
		function JsonNode({ name, path, value, depth, fold, t, onToggle, onParse }) {
			const key = name === void 0 ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				"data-json-token": "key",
				className: "dsh-context-track-json-key",
				children: JSON.stringify(name)
			}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: ": " })] });
			if (typeof value === "string") return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(StringNode, {
				name: key,
				path,
				value,
				depth,
				fold,
				t,
				onToggle,
				onParse
			});
			if (value === null || typeof value !== "object") return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "dsh-context-track-json-line",
				children: [key, /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Scalar, { value })]
			});
			const array = Array.isArray(value);
			const entries = array ? value.map((item, index) => [String(index), item]) : Object.entries(value);
			const open = isOpen(fold, path, depth, false);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "dsh-context-track-json-line",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Arrow, {
						path,
						open,
						count: entries.length,
						onToggle
					}),
					key,
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: open ? array ? "[" : "{" : array ? `[${entries.length}]` : "{…}" })
				]
			}), open ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [entries.map(([entry, item]) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: "dsh-context-track-json-nest",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(JsonNode, {
					name: array ? void 0 : entry,
					path: childPath(path, entry),
					value: item,
					depth: depth + 1,
					fold,
					t,
					onToggle,
					onParse
				})
			}, entry)), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: "dsh-context-track-json-line",
				children: array ? "]" : "}"
			})] }) : null] });
		}
		function StringNode({ name, path, value, depth, fold, t, onToggle, onParse }) {
			const long = value.length > STRING_LIMIT || value.includes("\n");
			const nested = compositeJson(value);
			const open = long ? isOpen(fold, path, depth, true) : true;
			const showNested = open && nested !== void 0 && fold.parsed[path] === true;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "dsh-context-track-json-line",
				children: [
					long ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Arrow, {
						path,
						open,
						onToggle
					}) : null,
					name,
					showNested ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(JsonNode, {
						path: `${path}#`,
						value: nested,
						depth: 0,
						fold,
						t,
						onToggle,
						onParse
					}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						"data-json-token": "string",
						className: "dsh-context-track-json-string",
						"data-truncated": long && !open ? "true" : void 0,
						children: long && !open ? preview(value) : JSON.stringify(value)
					}),
					nested !== void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							onParse(path);
						},
						children: t("parseJson")
					}) : null
				]
			});
		}
		function Arrow({ path, open, count, onToggle }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
				type: "button",
				className: "dsh-context-track-chevron",
				"data-json-key": path,
				"data-count": count,
				"aria-expanded": open,
				onClick: () => {
					onToggle(path, open);
				},
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					"aria-hidden": "true",
					children: open ? "▾" : "▸"
				})
			});
		}
		function Scalar({ value }) {
			if (value === null) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				"data-json-token": "null",
				className: "dsh-context-track-json-null",
				children: "null"
			});
			if (typeof value === "number") return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				"data-json-token": "number",
				className: "dsh-context-track-json-number",
				children: JSON.stringify(value)
			});
			if (typeof value === "boolean") return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				"data-json-token": "boolean",
				className: "dsh-context-track-json-boolean",
				children: JSON.stringify(value)
			});
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				"data-json-token": "string",
				className: "dsh-context-track-json-string",
				children: JSON.stringify(value)
			});
		}
		function isOpen(fold, path, depth, long) {
			const override = fold.overrides[path];
			if (override !== void 0) return override;
			if (fold.bulk === "open") return true;
			if (fold.bulk === "shut") return false;
			if (long) return false;
			return depth <= 2;
		}
		function preview(value) {
			return `"${JSON.stringify(value).slice(1, -1).slice(0, PREVIEW_CHARS)}…"`;
		}
		function childPath(parent, key) {
			return parent.length === 0 ? key : `${parent}.${key}`;
		}
		function tryParse(text) {
			try {
				return JSON.parse(text);
			} catch {
				return;
			}
		}
		function stringify$1(value) {
			if (value === void 0) return "";
			try {
				return JSON.stringify(value, null, 2) ?? "";
			} catch {
				return "";
			}
		}
		//#endregion
		//#region node_modules/.pnpm/markdown-to-jsx@9.10.4_react@18.3.1/node_modules/markdown-to-jsx/dist/entities.generated.js
		var e = {
			af: "⁡",
			applyfunction: "⁡",
			ic: "⁣",
			invisiblecomma: "⁣",
			invisibletimes: "⁢",
			it: "⁢",
			lrm: "‎",
			negativemediumspace: "​",
			negativethickspace: "​",
			negativethinspace: "​",
			negativeverythinspace: "​",
			nobreak: "⁠",
			rlm: "‏",
			shy: "­",
			zerowidthspace: "​",
			zwj: "‍",
			zwnj: "‌",
			downbreve: "̑",
			tdot: "⃛",
			tripledot: "⃛",
			dotdot: "⃜",
			tab: "	",
			newline: `
`,
			emsp: " ",
			emsp13: " ",
			emsp14: " ",
			ensp: " ",
			hairsp: " ",
			mediumspace: " ",
			puncsp: " ",
			thinsp: " ",
			thinspace: " ",
			verythinspace: " ",
			nbsp: "\xA0",
			nonbreakingspace: "\xA0",
			numsp: " ",
			thickspace: "  ",
			oline: "‾",
			overbar: "‾",
			lowbar: "_",
			underbar: "_",
			dash: "‐",
			hyphen: "‐",
			ndash: "–",
			mdash: "—",
			horbar: "―",
			comma: ",",
			semi: ";",
			bsemi: "⁏",
			colon: ":",
			Colone: "⩴",
			excl: "!",
			iexcl: "¡",
			quest: "?",
			iquest: "¿",
			period: ".",
			nldr: "‥",
			hellip: "…",
			mldr: "…",
			centerdot: "·",
			middot: "·",
			apos: "'",
			lsquo: "‘",
			opencurlyquote: "‘",
			closecurlyquote: "’",
			rsquo: "’",
			rsquor: "’",
			lsquor: "‚",
			sbquo: "‚",
			lsaquo: "‹",
			rsaquo: "›",
			quot: "\"",
			ldquo: "“",
			opencurlydoublequote: "“",
			closecurlydoublequote: "”",
			rdquo: "”",
			rdquor: "”",
			bdquo: "„",
			ldquor: "„",
			laquo: "«",
			raquo: "»",
			lpar: "(",
			rpar: ")",
			lbrack: "[",
			lsqb: "[",
			rbrack: "]",
			rsqb: "]",
			lbrace: "{",
			lcub: "{",
			rbrace: "}",
			rcub: "}",
			lceil: "⌈",
			leftceiling: "⌈",
			rceil: "⌉",
			rightceiling: "⌉",
			leftfloor: "⌊",
			lfloor: "⌊",
			rfloor: "⌋",
			rightfloor: "⌋",
			lopar: "⦅",
			ropar: "⦆",
			lbrke: "⦋",
			rbrke: "⦌",
			lbrkslu: "⦍",
			rbrksld: "⦎",
			lbrksld: "⦏",
			rbrkslu: "⦐",
			langd: "⦑",
			rangd: "⦒",
			lparlt: "⦓",
			rpargt: "⦔",
			gtlpar: "⦕",
			ltrpar: "⦖",
			leftdoublebracket: "⟦",
			lobrk: "⟦",
			rightdoublebracket: "⟧",
			robrk: "⟧",
			lang: "⟨",
			langle: "⟨",
			leftanglebracket: "⟨",
			rang: "⟩",
			rangle: "⟩",
			rightanglebracket: "⟩",
			Lang: "⟪",
			Rang: "⟫",
			loang: "⟬",
			roang: "⟭",
			lbbrk: "❲",
			rbbrk: "❳",
			Verbar: "‖",
			Vert: "‖",
			sect: "§",
			para: "¶",
			commat: "@",
			ast: "*",
			midast: "*",
			sol: "/",
			bsol: "\\",
			amp: "&",
			num: "#",
			percnt: "%",
			permil: "‰",
			pertenk: "‱",
			dagger: "†",
			Dagger: "‡",
			ddagger: "‡",
			bull: "•",
			bullet: "•",
			hybull: "⁃",
			prime: "′",
			Prime: "″",
			tprime: "‴",
			qprime: "⁗",
			backprime: "‵",
			bprime: "‵",
			caret: "⁁",
			diacriticalgrave: "`",
			grave: "`",
			acute: "´",
			diacriticalacute: "´",
			diacriticaltilde: "˜",
			tilde: "˜",
			hat: "^",
			macr: "¯",
			strns: "¯",
			breve: "˘",
			diacriticaldot: "˙",
			dot: "˙",
			die: "¨",
			Dot: "¨",
			doubledot: "¨",
			uml: "¨",
			ring: "˚",
			dblac: "˝",
			diacriticaldoubleacute: "˝",
			cedil: "¸",
			cedilla: "¸",
			ogon: "˛",
			circ: "ˆ",
			caron: "ˇ",
			hacek: "ˇ",
			deg: "°",
			copy: "©",
			circledr: "®",
			reg: "®",
			copysr: "℗",
			weierp: "℘",
			wp: "℘",
			rx: "℞",
			mho: "℧",
			iiota: "℩",
			larr: "←",
			leftarrow: "←",
			shortleftarrow: "←",
			slarr: "←",
			nlarr: "↚",
			nleftarrow: "↚",
			rarr: "→",
			rightarrow: "→",
			shortrightarrow: "→",
			srarr: "→",
			nrarr: "↛",
			nrightarrow: "↛",
			shortuparrow: "↑",
			uarr: "↑",
			uparrow: "↑",
			darr: "↓",
			downarrow: "↓",
			shortdownarrow: "↓",
			harr: "↔",
			leftrightarrow: "↔",
			nharr: "↮",
			nleftrightarrow: "↮",
			updownarrow: "↕",
			varr: "↕",
			nwarr: "↖",
			nwarrow: "↖",
			upperleftarrow: "↖",
			nearr: "↗",
			nearrow: "↗",
			upperrightarrow: "↗",
			lowerrightarrow: "↘",
			searr: "↘",
			searrow: "↘",
			lowerleftarrow: "↙",
			swarr: "↙",
			swarrow: "↙",
			rarrw: "↝",
			rightsquigarrow: "↝",
			nrarrw: "↝̸",
			Larr: "↞",
			twoheadleftarrow: "↞",
			Uarr: "↟",
			Rarr: "↠",
			twoheadrightarrow: "↠",
			Darr: "↡",
			larrtl: "↢",
			leftarrowtail: "↢",
			rarrtl: "↣",
			rightarrowtail: "↣",
			leftteearrow: "↤",
			mapstoleft: "↤",
			mapstoup: "↥",
			upteearrow: "↥",
			map: "↦",
			mapsto: "↦",
			rightteearrow: "↦",
			downteearrow: "↧",
			mapstodown: "↧",
			hookleftarrow: "↩",
			larrhk: "↩",
			hookrightarrow: "↪",
			rarrhk: "↪",
			larrlp: "↫",
			looparrowleft: "↫",
			looparrowright: "↬",
			rarrlp: "↬",
			harrw: "↭",
			leftrightsquigarrow: "↭",
			lsh: "↰",
			rsh: "↱",
			ldsh: "↲",
			rdsh: "↳",
			crarr: "↵",
			cularr: "↶",
			curvearrowleft: "↶",
			curarr: "↷",
			curvearrowright: "↷",
			circlearrowleft: "↺",
			olarr: "↺",
			circlearrowright: "↻",
			orarr: "↻",
			leftharpoonup: "↼",
			leftvector: "↼",
			lharu: "↼",
			downleftvector: "↽",
			leftharpoondown: "↽",
			lhard: "↽",
			rightupvector: "↾",
			uharr: "↾",
			upharpoonright: "↾",
			leftupvector: "↿",
			uharl: "↿",
			upharpoonleft: "↿",
			rharu: "⇀",
			rightharpoonup: "⇀",
			rightvector: "⇀",
			downrightvector: "⇁",
			rhard: "⇁",
			rightharpoondown: "⇁",
			dharr: "⇂",
			downharpoonright: "⇂",
			rightdownvector: "⇂",
			dharl: "⇃",
			downharpoonleft: "⇃",
			leftdownvector: "⇃",
			rightarrowleftarrow: "⇄",
			rightleftarrows: "⇄",
			rlarr: "⇄",
			udarr: "⇅",
			uparrowdownarrow: "⇅",
			leftarrowrightarrow: "⇆",
			leftrightarrows: "⇆",
			lrarr: "⇆",
			leftleftarrows: "⇇",
			llarr: "⇇",
			upuparrows: "⇈",
			uuarr: "⇈",
			rightrightarrows: "⇉",
			rrarr: "⇉",
			ddarr: "⇊",
			downdownarrows: "⇊",
			leftrightharpoons: "⇋",
			lrhar: "⇋",
			reverseequilibrium: "⇋",
			equilibrium: "⇌",
			rightleftharpoons: "⇌",
			rlhar: "⇌",
			doubleleftarrow: "⇐",
			lArr: "⇐",
			Leftarrow: "⇐",
			nlArr: "⇍",
			nLeftarrow: "⇍",
			doubleuparrow: "⇑",
			uArr: "⇑",
			Uparrow: "⇑",
			doublerightarrow: "⇒",
			implies: "⇒",
			rArr: "⇒",
			Rightarrow: "⇒",
			nrArr: "⇏",
			nRightarrow: "⇏",
			dArr: "⇓",
			doubledownarrow: "⇓",
			Downarrow: "⇓",
			doubleleftrightarrow: "⇔",
			hArr: "⇔",
			iff: "⇔",
			Leftrightarrow: "⇔",
			nhArr: "⇎",
			nLeftrightarrow: "⇎",
			doubleupdownarrow: "⇕",
			Updownarrow: "⇕",
			vArr: "⇕",
			nwArr: "⇖",
			neArr: "⇗",
			seArr: "⇘",
			swArr: "⇙",
			laarr: "⇚",
			lleftarrow: "⇚",
			raarr: "⇛",
			rrightarrow: "⇛",
			zigrarr: "⇝",
			larrb: "⇤",
			leftarrowbar: "⇤",
			rarrb: "⇥",
			rightarrowbar: "⇥",
			downarrowuparrow: "⇵",
			duarr: "⇵",
			loarr: "⇽",
			roarr: "⇾",
			hoarr: "⇿",
			forall: "∀",
			comp: "∁",
			complement: "∁",
			part: "∂",
			partiald: "∂",
			npart: "∂̸",
			exist: "∃",
			exists: "∃",
			nexist: "∄",
			nexists: "∄",
			notexists: "∄",
			empty: "∅",
			emptyset: "∅",
			emptyv: "∅",
			varnothing: "∅",
			del: "∇",
			nabla: "∇",
			element: "∈",
			in: "∈",
			isin: "∈",
			isinv: "∈",
			notelement: "∉",
			notin: "∉",
			notinva: "∉",
			ni: "∋",
			niv: "∋",
			reverseelement: "∋",
			suchthat: "∋",
			notni: "∌",
			notniva: "∌",
			notreverseelement: "∌",
			backepsilon: "϶",
			bepsi: "϶",
			prod: "∏",
			product: "∏",
			coprod: "∐",
			coproduct: "∐",
			sum: "∑",
			plus: "+",
			plusminus: "±",
			plusmn: "±",
			pm: "±",
			div: "÷",
			divide: "÷",
			times: "×",
			lt: "<",
			nless: "≮",
			nlt: "≮",
			notless: "≮",
			nvlt: "<⃒",
			equals: "=",
			ne: "≠",
			notequal: "≠",
			bne: "=⃥",
			equal: "⩵",
			gt: ">",
			ngt: "≯",
			ngtr: "≯",
			notgreater: "≯",
			nvgt: ">⃒",
			not: "¬",
			verbar: "|",
			vert: "|",
			verticalline: "|",
			brvbar: "¦",
			minus: "−",
			minusplus: "∓",
			mnplus: "∓",
			mp: "∓",
			dotplus: "∔",
			plusdo: "∔",
			frasl: "⁄",
			backslash: "∖",
			setminus: "∖",
			setmn: "∖",
			smallsetminus: "∖",
			ssetmn: "∖",
			lowast: "∗",
			compfn: "∘",
			smallcircle: "∘",
			radic: "√",
			sqrt: "√",
			prop: "∝",
			proportional: "∝",
			propto: "∝",
			varpropto: "∝",
			vprop: "∝",
			infin: "∞",
			angrt: "∟",
			ang: "∠",
			angle: "∠",
			nang: "∠⃒",
			angmsd: "∡",
			measuredangle: "∡",
			angsph: "∢",
			mid: "∣",
			shortmid: "∣",
			smid: "∣",
			verticalbar: "∣",
			nmid: "∤",
			notverticalbar: "∤",
			nshortmid: "∤",
			nsmid: "∤",
			doubleverticalbar: "∥",
			par: "∥",
			parallel: "∥",
			shortparallel: "∥",
			spar: "∥",
			notdoubleverticalbar: "∦",
			npar: "∦",
			nparallel: "∦",
			nshortparallel: "∦",
			nspar: "∦",
			and: "∧",
			wedge: "∧",
			or: "∨",
			vee: "∨",
			cap: "∩",
			caps: "∩︀",
			cup: "∪",
			cups: "∪︀",
			int: "∫",
			integral: "∫",
			Int: "∬",
			iiint: "∭",
			tint: "∭",
			iiiint: "⨌",
			qint: "⨌",
			conint: "∮",
			contourintegral: "∮",
			oint: "∮",
			Conint: "∯",
			doublecontourintegral: "∯",
			cconint: "∰",
			cwint: "∱",
			clockwisecontourintegral: "∲",
			cwconint: "∲",
			awconint: "∳",
			counterclockwisecontourintegral: "∳",
			there4: "∴",
			therefore: "∴",
			becaus: "∵",
			because: "∵",
			ratio: "∶",
			Colon: "∷",
			proportion: "∷",
			dotminus: "∸",
			minusd: "∸",
			mddot: "∺",
			homtht: "∻",
			sim: "∼",
			thicksim: "∼",
			thksim: "∼",
			Tilde: "∼",
			nottilde: "≁",
			nsim: "≁",
			nvsim: "∼⃒",
			backsim: "∽",
			bsim: "∽",
			race: "∽̱",
			ac: "∾",
			mstpos: "∾",
			ace: "∾̳",
			acd: "∿",
			verticaltilde: "≀",
			wr: "≀",
			wreath: "≀",
			eqsim: "≂",
			equaltilde: "≂",
			esim: "≂",
			nesim: "≂̸",
			notequaltilde: "≂̸",
			sime: "≃",
			simeq: "≃",
			tildeequal: "≃",
			nottildeequal: "≄",
			nsime: "≄",
			nsimeq: "≄",
			cong: "≅",
			tildefullequal: "≅",
			ncong: "≇",
			nottildefullequal: "≇",
			simne: "≆",
			ap: "≈",
			approx: "≈",
			asymp: "≈",
			thickapprox: "≈",
			thkap: "≈",
			tildetilde: "≈",
			nap: "≉",
			napprox: "≉",
			nottildetilde: "≉",
			ape: "≊",
			approxeq: "≊",
			apid: "≋",
			napid: "≋̸",
			backcong: "≌",
			bcong: "≌",
			asympeq: "≍",
			CupCap: "≍",
			notcupcap: "≭",
			nvap: "≍⃒",
			bump: "≎",
			Bumpeq: "≎",
			humpdownhump: "≎",
			nbump: "≎̸",
			nothumpdownhump: "≎̸",
			bumpe: "≏",
			bumpeq: "≏",
			humpequal: "≏",
			nbumpe: "≏̸",
			nothumpequal: "≏̸",
			doteq: "≐",
			dotequal: "≐",
			esdot: "≐",
			nedot: "≐̸",
			doteqdot: "≑",
			eDot: "≑",
			efdot: "≒",
			fallingdotseq: "≒",
			erdot: "≓",
			risingdotseq: "≓",
			assign: "≔",
			colone: "≔",
			coloneq: "≔",
			ecolon: "≕",
			eqcolon: "≕",
			ecir: "≖",
			eqcirc: "≖",
			circeq: "≗",
			cire: "≗",
			wedgeq: "≙",
			veeeq: "≚",
			triangleq: "≜",
			trie: "≜",
			equest: "≟",
			questeq: "≟",
			congruent: "≡",
			equiv: "≡",
			nequiv: "≢",
			notcongruent: "≢",
			bnequiv: "≡⃥",
			le: "≤",
			leq: "≤",
			nle: "≰",
			nleq: "≰",
			notlessequal: "≰",
			nvle: "≤⃒",
			ge: "≥",
			geq: "≥",
			greaterequal: "≥",
			nge: "≱",
			ngeq: "≱",
			notgreaterequal: "≱",
			nvge: "≥⃒",
			lE: "≦",
			leqq: "≦",
			lessfullequal: "≦",
			nlE: "≦̸",
			nleqq: "≦̸",
			gE: "≧",
			geqq: "≧",
			greaterfullequal: "≧",
			ngE: "≧̸",
			ngeqq: "≧̸",
			notgreaterfullequal: "≧̸",
			lnE: "≨",
			lneqq: "≨",
			lvertneqq: "≨︀",
			lvne: "≨︀",
			gnE: "≩",
			gneqq: "≩",
			gvertneqq: "≩︀",
			gvne: "≩︀",
			ll: "≪",
			Lt: "≪",
			nestedlessless: "≪",
			nltv: "≪̸",
			notlessless: "≪̸",
			nLt: "≪⃒",
			gg: "≫",
			Gt: "≫",
			nestedgreatergreater: "≫",
			ngtv: "≫̸",
			notgreatergreater: "≫̸",
			nGt: "≫⃒",
			between: "≬",
			twixt: "≬",
			lesssim: "≲",
			lesstilde: "≲",
			lsim: "≲",
			nlsim: "≴",
			notlesstilde: "≴",
			greatertilde: "≳",
			gsim: "≳",
			gtrsim: "≳",
			ngsim: "≵",
			notgreatertilde: "≵",
			lessgreater: "≶",
			lessgtr: "≶",
			lg: "≶",
			notlessgreater: "≸",
			ntlg: "≸",
			gl: "≷",
			greaterless: "≷",
			gtrless: "≷",
			notgreaterless: "≹",
			ntgl: "≹",
			pr: "≺",
			prec: "≺",
			precedes: "≺",
			notprecedes: "⊀",
			npr: "⊀",
			nprec: "⊀",
			sc: "≻",
			succ: "≻",
			succeeds: "≻",
			notsucceeds: "⊁",
			nsc: "⊁",
			nsucc: "⊁",
			prcue: "≼",
			preccurlyeq: "≼",
			precedesslantequal: "≼",
			notprecedesslantequal: "⋠",
			nprcue: "⋠",
			sccue: "≽",
			succcurlyeq: "≽",
			succeedsslantequal: "≽",
			notsucceedsslantequal: "⋡",
			nsccue: "⋡",
			precedestilde: "≾",
			precsim: "≾",
			prsim: "≾",
			scsim: "≿",
			succeedstilde: "≿",
			succsim: "≿",
			notsucceedstilde: "≿̸",
			sub: "⊂",
			subset: "⊂",
			nsub: "⊄",
			notsubset: "⊂⃒",
			nsubset: "⊂⃒",
			vnsub: "⊂⃒",
			sup: "⊃",
			superset: "⊃",
			supset: "⊃",
			nsup: "⊅",
			notsuperset: "⊃⃒",
			nsupset: "⊃⃒",
			vnsup: "⊃⃒",
			sube: "⊆",
			subseteq: "⊆",
			subsetequal: "⊆",
			notsubsetequal: "⊈",
			nsube: "⊈",
			nsubseteq: "⊈",
			supe: "⊇",
			supersetequal: "⊇",
			supseteq: "⊇",
			notsupersetequal: "⊉",
			nsupe: "⊉",
			nsupseteq: "⊉",
			subne: "⊊",
			subsetneq: "⊊",
			varsubsetneq: "⊊︀",
			vsubne: "⊊︀",
			supne: "⊋",
			supsetneq: "⊋",
			varsupsetneq: "⊋︀",
			vsupne: "⊋︀",
			cupdot: "⊍",
			unionplus: "⊎",
			uplus: "⊎",
			sqsub: "⊏",
			sqsubset: "⊏",
			squaresubset: "⊏",
			notsquaresubset: "⊏̸",
			sqsup: "⊐",
			sqsupset: "⊐",
			squaresuperset: "⊐",
			notsquaresuperset: "⊐̸",
			sqsube: "⊑",
			sqsubseteq: "⊑",
			squaresubsetequal: "⊑",
			notsquaresubsetequal: "⋢",
			nsqsube: "⋢",
			sqsupe: "⊒",
			sqsupseteq: "⊒",
			squaresupersetequal: "⊒",
			notsquaresupersetequal: "⋣",
			nsqsupe: "⋣",
			sqcap: "⊓",
			sqcaps: "⊓︀",
			squareintersection: "⊓",
			sqcup: "⊔",
			sqcups: "⊔︀",
			squareunion: "⊔",
			circleplus: "⊕",
			oplus: "⊕",
			circleminus: "⊖",
			ominus: "⊖",
			circletimes: "⊗",
			otimes: "⊗",
			osol: "⊘",
			circledot: "⊙",
			odot: "⊙",
			circledcirc: "⊚",
			ocir: "⊚",
			circledast: "⊛",
			oast: "⊛",
			circleddash: "⊝",
			odash: "⊝",
			boxplus: "⊞",
			plusb: "⊞",
			boxminus: "⊟",
			minusb: "⊟",
			boxtimes: "⊠",
			timesb: "⊠",
			dotsquare: "⊡",
			sdotb: "⊡",
			righttee: "⊢",
			vdash: "⊢",
			nvdash: "⊬",
			dashv: "⊣",
			lefttee: "⊣",
			downtee: "⊤",
			top: "⊤",
			bot: "⊥",
			bottom: "⊥",
			perp: "⊥",
			uptee: "⊥",
			models: "⊧",
			doublerighttee: "⊨",
			vDash: "⊨",
			nvDash: "⊭",
			Vdash: "⊩",
			nVdash: "⊮",
			vvdash: "⊪",
			VDash: "⊫",
			nVDash: "⊯",
			prurel: "⊰",
			lefttriangle: "⊲",
			vartriangleleft: "⊲",
			vltri: "⊲",
			nltri: "⋪",
			notlefttriangle: "⋪",
			ntriangleleft: "⋪",
			righttriangle: "⊳",
			vartriangleright: "⊳",
			vrtri: "⊳",
			notrighttriangle: "⋫",
			nrtri: "⋫",
			ntriangleright: "⋫",
			lefttriangleequal: "⊴",
			ltrie: "⊴",
			trianglelefteq: "⊴",
			nltrie: "⋬",
			notlefttriangleequal: "⋬",
			ntrianglelefteq: "⋬",
			nvltrie: "⊴⃒",
			righttriangleequal: "⊵",
			rtrie: "⊵",
			trianglerighteq: "⊵",
			notrighttriangleequal: "⋭",
			nrtrie: "⋭",
			ntrianglerighteq: "⋭",
			nvrtrie: "⊵⃒",
			origof: "⊶",
			imof: "⊷",
			multimap: "⊸",
			mumap: "⊸",
			hercon: "⊹",
			intcal: "⊺",
			intercal: "⊺",
			veebar: "⊻",
			barvee: "⊽",
			angrtvb: "⊾",
			lrtri: "⊿",
			bigwedge: "⋀",
			Wedge: "⋀",
			xwedge: "⋀",
			bigvee: "⋁",
			Vee: "⋁",
			xvee: "⋁",
			bigcap: "⋂",
			intersection: "⋂",
			xcap: "⋂",
			bigcup: "⋃",
			union: "⋃",
			xcup: "⋃",
			diam: "⋄",
			diamond: "⋄",
			sdot: "⋅",
			sstarf: "⋆",
			Star: "⋆",
			divideontimes: "⋇",
			divonx: "⋇",
			bowtie: "⋈",
			ltimes: "⋉",
			rtimes: "⋊",
			leftthreetimes: "⋋",
			lthree: "⋋",
			rightthreetimes: "⋌",
			rthree: "⋌",
			backsimeq: "⋍",
			bsime: "⋍",
			curlyvee: "⋎",
			cuvee: "⋎",
			curlywedge: "⋏",
			cuwed: "⋏",
			Sub: "⋐",
			Subset: "⋐",
			Sup: "⋑",
			Supset: "⋑",
			Cap: "⋒",
			Cup: "⋓",
			fork: "⋔",
			pitchfork: "⋔",
			epar: "⋕",
			lessdot: "⋖",
			ltdot: "⋖",
			gtdot: "⋗",
			gtrdot: "⋗",
			Ll: "⋘",
			nll: "⋘̸",
			Gg: "⋙",
			ggg: "⋙",
			ngg: "⋙̸",
			leg: "⋚",
			lesg: "⋚︀",
			lesseqgtr: "⋚",
			lessequalgreater: "⋚",
			gel: "⋛",
			gesl: "⋛︀",
			greaterequalless: "⋛",
			gtreqless: "⋛",
			cuepr: "⋞",
			curlyeqprec: "⋞",
			cuesc: "⋟",
			curlyeqsucc: "⋟",
			lnsim: "⋦",
			gnsim: "⋧",
			precnsim: "⋨",
			prnsim: "⋨",
			scnsim: "⋩",
			succnsim: "⋩",
			vellip: "⋮",
			ctdot: "⋯",
			utdot: "⋰",
			dtdot: "⋱",
			disin: "⋲",
			isinsv: "⋳",
			isins: "⋴",
			isindot: "⋵",
			notindot: "⋵̸",
			notinvc: "⋶",
			notinvb: "⋷",
			isine: "⋹",
			notine: "⋹̸",
			nisd: "⋺",
			xnis: "⋻",
			nis: "⋼",
			notnivc: "⋽",
			notnivb: "⋾",
			barwed: "⌅",
			barwedge: "⌅",
			Barwed: "⌆",
			doublebarwedge: "⌆",
			drcrop: "⌌",
			dlcrop: "⌍",
			urcrop: "⌎",
			ulcrop: "⌏",
			bnot: "⌐",
			profline: "⌒",
			profsurf: "⌓",
			telrec: "⌕",
			target: "⌖",
			ulcorn: "⌜",
			ulcorner: "⌜",
			urcorn: "⌝",
			urcorner: "⌝",
			dlcorn: "⌞",
			llcorner: "⌞",
			drcorn: "⌟",
			lrcorner: "⌟",
			frown: "⌢",
			sfrown: "⌢",
			smile: "⌣",
			ssmile: "⌣",
			cylcty: "⌭",
			profalar: "⌮",
			topbot: "⌶",
			ovbar: "⌽",
			solbar: "⌿",
			angzarr: "⍼",
			lmoust: "⎰",
			lmoustache: "⎰",
			rmoust: "⎱",
			rmoustache: "⎱",
			overbracket: "⎴",
			tbrk: "⎴",
			bbrk: "⎵",
			underbracket: "⎵",
			bbrktbrk: "⎶",
			overparenthesis: "⏜",
			underparenthesis: "⏝",
			overbrace: "⏞",
			underbrace: "⏟",
			trpezium: "⏢",
			elinters: "⏧",
			blank: "␣",
			boxh: "─",
			horizontalline: "─",
			boxv: "│",
			boxdr: "┌",
			boxdl: "┐",
			boxur: "└",
			boxul: "┘",
			boxvr: "├",
			boxvl: "┤",
			boxhd: "┬",
			boxhu: "┴",
			boxvh: "┼",
			boxH: "═",
			boxV: "║",
			boxdR: "╒",
			boxDr: "╓",
			boxDR: "╔",
			boxdL: "╕",
			boxDl: "╖",
			boxDL: "╗",
			boxuR: "╘",
			boxUr: "╙",
			boxUR: "╚",
			boxuL: "╛",
			boxUl: "╜",
			boxUL: "╝",
			boxvR: "╞",
			boxVr: "╟",
			boxVR: "╠",
			boxvL: "╡",
			boxVl: "╢",
			boxVL: "╣",
			boxHd: "╤",
			boxhD: "╥",
			boxHD: "╦",
			boxHu: "╧",
			boxhU: "╨",
			boxHU: "╩",
			boxvH: "╪",
			boxVh: "╫",
			boxVH: "╬",
			uhblk: "▀",
			lhblk: "▄",
			block: "█",
			blk14: "░",
			blk12: "▒",
			blk34: "▓",
			squ: "□",
			square: "□",
			blacksquare: "▪",
			filledverysmallsquare: "▪",
			squarf: "▪",
			squf: "▪",
			emptyverysmallsquare: "▫",
			rect: "▭",
			marker: "▮",
			fltns: "▱",
			bigtriangleup: "△",
			xutri: "△",
			blacktriangle: "▴",
			utrif: "▴",
			triangle: "▵",
			utri: "▵",
			blacktriangleright: "▸",
			rtrif: "▸",
			rtri: "▹",
			triangleright: "▹",
			bigtriangledown: "▽",
			xdtri: "▽",
			blacktriangledown: "▾",
			dtrif: "▾",
			dtri: "▿",
			triangledown: "▿",
			blacktriangleleft: "◂",
			ltrif: "◂",
			ltri: "◃",
			triangleleft: "◃",
			loz: "◊",
			lozenge: "◊",
			cir: "○",
			tridot: "◬",
			bigcirc: "◯",
			xcirc: "◯",
			ultri: "◸",
			urtri: "◹",
			lltri: "◺",
			emptysmallsquare: "◻",
			filledsmallsquare: "◼",
			bigstar: "★",
			starf: "★",
			star: "☆",
			phone: "☎",
			female: "♀",
			male: "♂",
			spades: "♠",
			spadesuit: "♠",
			clubs: "♣",
			clubsuit: "♣",
			hearts: "♥",
			heartsuit: "♥",
			diamondsuit: "♦",
			diams: "♦",
			sung: "♪",
			check: "✓",
			checkmark: "✓",
			cross: "✗",
			malt: "✠",
			maltese: "✠",
			sext: "✶",
			verticalseparator: "❘",
			bsolhsub: "⟈",
			suphsol: "⟉",
			longleftarrow: "⟵",
			xlarr: "⟵",
			longrightarrow: "⟶",
			xrarr: "⟶",
			longleftrightarrow: "⟷",
			xharr: "⟷",
			doublelongleftarrow: "⟸",
			Longleftarrow: "⟸",
			xlArr: "⟸",
			doublelongrightarrow: "⟹",
			Longrightarrow: "⟹",
			xrArr: "⟹",
			doublelongleftrightarrow: "⟺",
			Longleftrightarrow: "⟺",
			xhArr: "⟺",
			longmapsto: "⟼",
			xmap: "⟼",
			dzigrarr: "⟿",
			nvlarr: "⤂",
			nvrarr: "⤃",
			nvharr: "⤄",
			Map: "⤅",
			lbarr: "⤌",
			bkarow: "⤍",
			lBarr: "⤎",
			dbkarow: "⤏",
			rBarr: "⤏",
			drbkarow: "⤐",
			rbarr: "⤐",
			RBarr: "⤐",
			ddotrahd: "⤑",
			uparrowbar: "⤒",
			downarrowbar: "⤓",
			Rarrtl: "⤖",
			latail: "⤙",
			ratail: "⤚",
			lAtail: "⤛",
			rAtail: "⤜",
			larrfs: "⤝",
			rarrfs: "⤞",
			larrbfs: "⤟",
			rarrbfs: "⤠",
			nwarhk: "⤣",
			nearhk: "⤤",
			hksearow: "⤥",
			searhk: "⤥",
			hkswarow: "⤦",
			swarhk: "⤦",
			nwnear: "⤧",
			nesear: "⤨",
			toea: "⤨",
			seswar: "⤩",
			tosa: "⤩",
			swnwar: "⤪",
			rarrc: "⤳",
			nrarrc: "⤳̸",
			cudarrr: "⤵",
			ldca: "⤶",
			rdca: "⤷",
			cudarrl: "⤸",
			larrpl: "⤹",
			curarrm: "⤼",
			cularrp: "⤽",
			rarrpl: "⥅",
			harrcir: "⥈",
			uarrocir: "⥉",
			lurdshar: "⥊",
			ldrushar: "⥋",
			leftrightvector: "⥎",
			rightupdownvector: "⥏",
			downleftrightvector: "⥐",
			leftupdownvector: "⥑",
			leftvectorbar: "⥒",
			rightvectorbar: "⥓",
			rightupvectorbar: "⥔",
			rightdownvectorbar: "⥕",
			downleftvectorbar: "⥖",
			downrightvectorbar: "⥗",
			leftupvectorbar: "⥘",
			leftdownvectorbar: "⥙",
			leftteevector: "⥚",
			rightteevector: "⥛",
			rightupteevector: "⥜",
			rightdownteevector: "⥝",
			downleftteevector: "⥞",
			downrightteevector: "⥟",
			leftupteevector: "⥠",
			leftdownteevector: "⥡",
			lhar: "⥢",
			uhar: "⥣",
			rhar: "⥤",
			dhar: "⥥",
			luruhar: "⥦",
			ldrdhar: "⥧",
			ruluhar: "⥨",
			rdldhar: "⥩",
			lharul: "⥪",
			llhard: "⥫",
			rharul: "⥬",
			lrhard: "⥭",
			udhar: "⥮",
			upequilibrium: "⥮",
			duhar: "⥯",
			reverseupequilibrium: "⥯",
			roundimplies: "⥰",
			erarr: "⥱",
			simrarr: "⥲",
			larrsim: "⥳",
			rarrsim: "⥴",
			rarrap: "⥵",
			ltlarr: "⥶",
			gtrarr: "⥸",
			subrarr: "⥹",
			suplarr: "⥻",
			lfisht: "⥼",
			rfisht: "⥽",
			ufisht: "⥾",
			dfisht: "⥿",
			vzigzag: "⦚",
			vangrt: "⦜",
			angrtvbd: "⦝",
			ange: "⦤",
			range: "⦥",
			dwangle: "⦦",
			uwangle: "⦧",
			angmsdaa: "⦨",
			angmsdab: "⦩",
			angmsdac: "⦪",
			angmsdad: "⦫",
			angmsdae: "⦬",
			angmsdaf: "⦭",
			angmsdag: "⦮",
			angmsdah: "⦯",
			bemptyv: "⦰",
			demptyv: "⦱",
			cemptyv: "⦲",
			raemptyv: "⦳",
			laemptyv: "⦴",
			ohbar: "⦵",
			omid: "⦶",
			opar: "⦷",
			operp: "⦹",
			olcross: "⦻",
			odsold: "⦼",
			olcir: "⦾",
			ofcir: "⦿",
			olt: "⧀",
			ogt: "⧁",
			cirscir: "⧂",
			cirE: "⧃",
			solb: "⧄",
			bsolb: "⧅",
			boxbox: "⧉",
			trisb: "⧍",
			rtriltri: "⧎",
			lefttrianglebar: "⧏",
			notlefttrianglebar: "⧏̸",
			righttrianglebar: "⧐",
			notrighttrianglebar: "⧐̸",
			iinfin: "⧜",
			infintie: "⧝",
			nvinfin: "⧞",
			eparsl: "⧣",
			smeparsl: "⧤",
			eqvparsl: "⧥",
			blacklozenge: "⧫",
			lozf: "⧫",
			ruledelayed: "⧴",
			dsol: "⧶",
			bigodot: "⨀",
			xodot: "⨀",
			bigoplus: "⨁",
			xoplus: "⨁",
			bigotimes: "⨂",
			xotime: "⨂",
			biguplus: "⨄",
			xuplus: "⨄",
			bigsqcup: "⨆",
			xsqcup: "⨆",
			fpartint: "⨍",
			cirfnint: "⨐",
			awint: "⨑",
			rppolint: "⨒",
			scpolint: "⨓",
			npolint: "⨔",
			pointint: "⨕",
			quatint: "⨖",
			intlarhk: "⨗",
			pluscir: "⨢",
			plusacir: "⨣",
			simplus: "⨤",
			plusdu: "⨥",
			plussim: "⨦",
			plustwo: "⨧",
			mcomma: "⨩",
			minusdu: "⨪",
			loplus: "⨭",
			roplus: "⨮",
			Cross: "⨯",
			timesd: "⨰",
			timesbar: "⨱",
			smashp: "⨳",
			lotimes: "⨴",
			rotimes: "⨵",
			otimesas: "⨶",
			Otimes: "⨷",
			odiv: "⨸",
			triplus: "⨹",
			triminus: "⨺",
			tritime: "⨻",
			intprod: "⨼",
			iprod: "⨼",
			amalg: "⨿",
			capdot: "⩀",
			ncup: "⩂",
			ncap: "⩃",
			capand: "⩄",
			cupor: "⩅",
			cupcap: "⩆",
			capcup: "⩇",
			cupbrcap: "⩈",
			capbrcup: "⩉",
			cupcup: "⩊",
			capcap: "⩋",
			ccups: "⩌",
			ccaps: "⩍",
			ccupssm: "⩐",
			And: "⩓",
			Or: "⩔",
			andand: "⩕",
			oror: "⩖",
			orslope: "⩗",
			andslope: "⩘",
			andv: "⩚",
			orv: "⩛",
			andd: "⩜",
			ord: "⩝",
			wedbar: "⩟",
			sdote: "⩦",
			simdot: "⩪",
			congdot: "⩭",
			ncongdot: "⩭̸",
			easter: "⩮",
			apacir: "⩯",
			apE: "⩰",
			nape: "⩰̸",
			eplus: "⩱",
			pluse: "⩲",
			Esim: "⩳",
			ddotseq: "⩷",
			eddot: "⩷",
			equivdd: "⩸",
			ltcir: "⩹",
			gtcir: "⩺",
			ltquest: "⩻",
			gtquest: "⩼",
			leqslant: "⩽",
			les: "⩽",
			lessslantequal: "⩽",
			nleqslant: "⩽̸",
			nles: "⩽̸",
			notlessslantequal: "⩽̸",
			geqslant: "⩾",
			ges: "⩾",
			greaterslantequal: "⩾",
			ngeqslant: "⩾̸",
			nges: "⩾̸",
			notgreaterslantequal: "⩾̸",
			lesdot: "⩿",
			gesdot: "⪀",
			lesdoto: "⪁",
			gesdoto: "⪂",
			lesdotor: "⪃",
			gesdotol: "⪄",
			lap: "⪅",
			lessapprox: "⪅",
			gap: "⪆",
			gtrapprox: "⪆",
			lne: "⪇",
			lneq: "⪇",
			gne: "⪈",
			gneq: "⪈",
			lnap: "⪉",
			lnapprox: "⪉",
			gnap: "⪊",
			gnapprox: "⪊",
			lEg: "⪋",
			lesseqqgtr: "⪋",
			gEl: "⪌",
			gtreqqless: "⪌",
			lsime: "⪍",
			gsime: "⪎",
			lsimg: "⪏",
			gsiml: "⪐",
			lge: "⪑",
			gle: "⪒",
			lesges: "⪓",
			gesles: "⪔",
			els: "⪕",
			eqslantless: "⪕",
			egs: "⪖",
			eqslantgtr: "⪖",
			elsdot: "⪗",
			egsdot: "⪘",
			el: "⪙",
			eg: "⪚",
			siml: "⪝",
			simg: "⪞",
			simle: "⪟",
			simge: "⪠",
			lessless: "⪡",
			notnestedlessless: "⪡̸",
			greatergreater: "⪢",
			notnestedgreatergreater: "⪢̸",
			glj: "⪤",
			gla: "⪥",
			ltcc: "⪦",
			gtcc: "⪧",
			lescc: "⪨",
			gescc: "⪩",
			smt: "⪪",
			lat: "⪫",
			smte: "⪬",
			smtes: "⪬︀",
			late: "⪭",
			lates: "⪭︀",
			bumpE: "⪮",
			pre: "⪯",
			precedesequal: "⪯",
			preceq: "⪯",
			notprecedesequal: "⪯̸",
			npre: "⪯̸",
			npreceq: "⪯̸",
			sce: "⪰",
			succeedsequal: "⪰",
			succeq: "⪰",
			notsucceedsequal: "⪰̸",
			nsce: "⪰̸",
			nsucceq: "⪰̸",
			prE: "⪳",
			scE: "⪴",
			precneqq: "⪵",
			prne: "⪵",
			scne: "⪶",
			succneqq: "⪶",
			prap: "⪷",
			precapprox: "⪷",
			scap: "⪸",
			succapprox: "⪸",
			precnapprox: "⪹",
			prnap: "⪹",
			scnap: "⪺",
			succnapprox: "⪺",
			Pr: "⪻",
			Sc: "⪼",
			subdot: "⪽",
			supdot: "⪾",
			subplus: "⪿",
			supplus: "⫀",
			submult: "⫁",
			supmult: "⫂",
			subedot: "⫃",
			supedot: "⫄",
			subE: "⫅",
			subseteqq: "⫅",
			nsubE: "⫅̸",
			nsubseteqq: "⫅̸",
			supE: "⫆",
			supseteqq: "⫆",
			nsupE: "⫆̸",
			nsupseteqq: "⫆̸",
			subsim: "⫇",
			supsim: "⫈",
			subnE: "⫋",
			subsetneqq: "⫋",
			varsubsetneqq: "⫋︀",
			vsubnE: "⫋︀",
			supnE: "⫌",
			supsetneqq: "⫌",
			varsupsetneqq: "⫌︀",
			vsupnE: "⫌︀",
			csub: "⫏",
			csup: "⫐",
			csube: "⫑",
			csupe: "⫒",
			subsup: "⫓",
			supsub: "⫔",
			subsub: "⫕",
			supsup: "⫖",
			suphsub: "⫗",
			supdsub: "⫘",
			forkv: "⫙",
			topfork: "⫚",
			mlcp: "⫛",
			Dashv: "⫤",
			doublelefttee: "⫤",
			vdashl: "⫦",
			barv: "⫧",
			vbar: "⫨",
			vbarv: "⫩",
			Vbar: "⫫",
			Not: "⫬",
			bNot: "⫭",
			rnmid: "⫮",
			cirmid: "⫯",
			midcir: "⫰",
			topcir: "⫱",
			nhpar: "⫲",
			parsim: "⫳",
			parsl: "⫽",
			nparsl: "⫽⃥",
			flat: "♭",
			natur: "♮",
			natural: "♮",
			sharp: "♯",
			curren: "¤",
			cent: "¢",
			dollar: "$",
			pound: "£",
			yen: "¥",
			euro: "€",
			sup1: "¹",
			frac12: "½",
			half: "½",
			frac13: "⅓",
			frac14: "¼",
			frac15: "⅕",
			frac16: "⅙",
			frac18: "⅛",
			sup2: "²",
			frac23: "⅔",
			frac25: "⅖",
			sup3: "³",
			frac34: "¾",
			frac35: "⅗",
			frac38: "⅜",
			frac45: "⅘",
			frac56: "⅚",
			frac58: "⅝",
			frac78: "⅞",
			afr: "𝔞",
			aopf: "𝕒",
			ascr: "𝒶",
			Afr: "𝔄",
			Aopf: "𝔸",
			Ascr: "𝒜",
			ordf: "ª",
			aacute: "á",
			Aacute: "Á",
			agrave: "à",
			Agrave: "À",
			abreve: "ă",
			Abreve: "Ă",
			acirc: "â",
			Acirc: "Â",
			aring: "å",
			angst: "Å",
			Aring: "Å",
			auml: "ä",
			Auml: "Ä",
			atilde: "ã",
			Atilde: "Ã",
			aogon: "ą",
			Aogon: "Ą",
			amacr: "ā",
			Amacr: "Ā",
			aelig: "Æ",
			AElig: "Æ",
			bfr: "𝔟",
			bopf: "𝕓",
			bscr: "𝒷",
			bernou: "ℬ",
			bernoullis: "ℬ",
			Bfr: "𝔅",
			Bopf: "𝔹",
			Bscr: "ℬ",
			cfr: "𝔠",
			copf: "𝕔",
			cscr: "𝒸",
			cayleys: "ℭ",
			Cfr: "ℭ",
			complexes: "ℂ",
			Copf: "ℂ",
			Cscr: "𝒞",
			cacute: "ć",
			Cacute: "Ć",
			ccirc: "ĉ",
			Ccirc: "Ĉ",
			ccaron: "č",
			Ccaron: "Č",
			cdot: "ċ",
			Cdot: "Ċ",
			ccedil: "ç",
			Ccedil: "Ç",
			incare: "℅",
			dfr: "𝔡",
			differentiald: "ⅆ",
			dopf: "𝕕",
			dscr: "𝒹",
			capitaldifferentiald: "ⅅ",
			dd: "ⅅ",
			DD: "ⅅ",
			Dfr: "𝔇",
			Dopf: "𝔻",
			Dscr: "𝒟",
			dcaron: "ď",
			Dcaron: "Ď",
			dstrok: "đ",
			Dstrok: "Đ",
			eth: "ð",
			ETH: "Ð",
			ee: "ⅇ",
			efr: "𝔢",
			eopf: "𝕖",
			escr: "ℯ",
			exponentiale: "ⅇ",
			Efr: "𝔈",
			Eopf: "𝔼",
			Escr: "ℰ",
			expectation: "ℰ",
			eacute: "é",
			Eacute: "É",
			egrave: "è",
			Egrave: "È",
			ecirc: "ê",
			Ecirc: "Ê",
			ecaron: "ě",
			Ecaron: "Ě",
			euml: "ë",
			Euml: "Ë",
			edot: "ė",
			Edot: "Ė",
			eogon: "ę",
			Eogon: "Ę",
			emacr: "ē",
			Emacr: "Ē",
			ffr: "𝔣",
			fopf: "𝕗",
			fscr: "𝒻",
			Ffr: "𝔉",
			Fopf: "𝔽",
			fouriertrf: "ℱ",
			Fscr: "ℱ",
			fflig: "ﬀ",
			ffilig: "ﬃ",
			ffllig: "ﬄ",
			filig: "ﬁ",
			fjlig: "fj",
			fllig: "ﬂ",
			fnof: "ƒ",
			gfr: "𝔤",
			gopf: "𝕘",
			gscr: "ℊ",
			Gfr: "𝔊",
			Gopf: "𝔾",
			Gscr: "𝒢",
			gacute: "ǵ",
			gbreve: "ğ",
			Gbreve: "Ğ",
			gcirc: "ĝ",
			Gcirc: "Ĝ",
			gdot: "ġ",
			Gdot: "Ġ",
			gcedil: "Ģ",
			hfr: "𝔥",
			hopf: "𝕙",
			hscr: "𝒽",
			planckh: "ℎ",
			hamilt: "ℋ",
			Hfr: "ℌ",
			hilbertspace: "ℋ",
			Hopf: "ℍ",
			Hscr: "ℋ",
			poincareplane: "ℌ",
			quaternions: "ℍ",
			hcirc: "ĥ",
			Hcirc: "Ĥ",
			hbar: "ℏ",
			hslash: "ℏ",
			hstrok: "ħ",
			planck: "ℏ",
			plankv: "ℏ",
			Hstrok: "Ħ",
			ifr: "𝔦",
			ii: "ⅈ",
			imaginaryi: "ⅈ",
			iopf: "𝕚",
			iscr: "𝒾",
			Ifr: "ℑ",
			im: "ℑ",
			image: "ℑ",
			imagline: "ℐ",
			imagpart: "ℑ",
			Iopf: "𝕀",
			Iscr: "ℐ",
			iacute: "í",
			Iacute: "Í",
			igrave: "ì",
			Igrave: "Ì",
			icirc: "î",
			Icirc: "Î",
			iuml: "ï",
			Iuml: "Ï",
			itilde: "ĩ",
			Itilde: "Ĩ",
			idot: "İ",
			iogon: "į",
			Iogon: "Į",
			imacr: "ī",
			Imacr: "Ī",
			ijlig: "Ĳ",
			IJlig: "Ĳ",
			imath: "ı",
			inodot: "ı",
			jfr: "𝔧",
			jopf: "𝕛",
			jscr: "𝒿",
			Jfr: "𝔍",
			Jopf: "𝕁",
			Jscr: "𝒥",
			jcirc: "ĵ",
			Jcirc: "Ĵ",
			jmath: "ȷ",
			kfr: "𝔨",
			kopf: "𝕜",
			kscr: "𝓀",
			Kfr: "𝔎",
			Kopf: "𝕂",
			Kscr: "𝒦",
			kcedil: "ķ",
			Kcedil: "Ķ",
			ell: "ℓ",
			lfr: "𝔩",
			lopf: "𝕝",
			lscr: "𝓁",
			lagran: "ℒ",
			laplacetrf: "ℒ",
			Lfr: "𝔏",
			Lopf: "𝕃",
			Lscr: "ℒ",
			lacute: "ĺ",
			Lacute: "Ĺ",
			lcaron: "ľ",
			Lcaron: "Ľ",
			lcedil: "ļ",
			Lcedil: "Ļ",
			lstrok: "ł",
			Lstrok: "Ł",
			lmidot: "ŀ",
			Lmidot: "Ŀ",
			mfr: "𝔪",
			mopf: "𝕞",
			mscr: "𝓂",
			mellintrf: "ℳ",
			Mfr: "𝔐",
			Mopf: "𝕄",
			Mscr: "ℳ",
			phmmat: "ℳ",
			nfr: "𝔫",
			nopf: "𝕟",
			nscr: "𝓃",
			naturals: "ℕ",
			Nfr: "𝔑",
			Nopf: "ℕ",
			Nscr: "𝒩",
			nacute: "ń",
			Nacute: "Ń",
			ncaron: "ň",
			Ncaron: "Ň",
			ntilde: "ñ",
			Ntilde: "Ñ",
			ncedil: "ņ",
			Ncedil: "Ņ",
			numero: "№",
			eng: "ŋ",
			ENG: "Ŋ",
			ofr: "𝔬",
			oopf: "𝕠",
			order: "ℴ",
			orderof: "ℴ",
			oscr: "ℴ",
			Ofr: "𝔒",
			Oopf: "𝕆",
			Oscr: "𝒪",
			ordm: "º",
			oacute: "ó",
			Oacute: "Ó",
			ograve: "ò",
			Ograve: "Ò",
			ocirc: "ô",
			Ocirc: "Ô",
			ouml: "ö",
			Ouml: "Ö",
			odblac: "ő",
			Odblac: "Ő",
			otilde: "õ",
			Otilde: "Õ",
			oslash: "ø",
			Oslash: "Ø",
			omacr: "ō",
			Omacr: "Ō",
			oelig: "Œ",
			OElig: "Œ",
			pfr: "𝔭",
			popf: "𝕡",
			pscr: "𝓅",
			Pfr: "𝔓",
			Popf: "ℙ",
			primes: "ℙ",
			Pscr: "𝒫",
			qfr: "𝔮",
			qopf: "𝕢",
			qscr: "𝓆",
			Qfr: "𝔔",
			Qopf: "ℚ",
			Qscr: "𝒬",
			rationals: "ℚ",
			kgreen: "ĸ",
			rfr: "𝔯",
			ropf: "𝕣",
			rscr: "𝓇",
			re: "ℜ",
			real: "ℜ",
			realine: "ℛ",
			realpart: "ℜ",
			reals: "ℝ",
			Rfr: "ℜ",
			Ropf: "ℝ",
			Rscr: "ℛ",
			racute: "ŕ",
			Racute: "Ŕ",
			rcaron: "ř",
			Rcaron: "Ř",
			rcedil: "ŗ",
			Rcedil: "Ŗ",
			sfr: "𝔰",
			sopf: "𝕤",
			sscr: "𝓈",
			Sfr: "𝔖",
			Sopf: "𝕊",
			Sscr: "𝒮",
			circleds: "Ⓢ",
			os: "Ⓢ",
			sacute: "ś",
			Sacute: "Ś",
			scirc: "ŝ",
			Scirc: "Ŝ",
			scaron: "š",
			Scaron: "Š",
			scedil: "ş",
			Scedil: "Ş",
			szlig: "ß",
			tfr: "𝔱",
			topf: "𝕥",
			tscr: "𝓉",
			Tfr: "𝔗",
			Topf: "𝕋",
			Tscr: "𝒯",
			tcaron: "ť",
			Tcaron: "Ť",
			tcedil: "ţ",
			Tcedil: "Ţ",
			trade: "™",
			tstrok: "ŧ",
			Tstrok: "Ŧ",
			ufr: "𝔲",
			uopf: "𝕦",
			uscr: "𝓊",
			Ufr: "𝔘",
			Uopf: "𝕌",
			Uscr: "𝒰",
			uacute: "ú",
			Uacute: "Ú",
			ugrave: "ù",
			Ugrave: "Ù",
			ubreve: "ŭ",
			Ubreve: "Ŭ",
			ucirc: "û",
			Ucirc: "Û",
			uring: "ů",
			Uring: "Ů",
			uuml: "ü",
			Uuml: "Ü",
			udblac: "ű",
			Udblac: "Ű",
			utilde: "ũ",
			Utilde: "Ũ",
			uogon: "ų",
			Uogon: "Ų",
			umacr: "ū",
			Umacr: "Ū",
			vfr: "𝔳",
			vopf: "𝕧",
			vscr: "𝓋",
			Vfr: "𝔙",
			Vopf: "𝕍",
			Vscr: "𝒱",
			wfr: "𝔴",
			wopf: "𝕨",
			wscr: "𝓌",
			Wfr: "𝔚",
			Wopf: "𝕎",
			Wscr: "𝒲",
			wcirc: "ŵ",
			Wcirc: "Ŵ",
			xfr: "𝔵",
			xopf: "𝕩",
			xscr: "𝓍",
			Xfr: "𝔛",
			Xopf: "𝕏",
			Xscr: "𝒳",
			yfr: "𝔶",
			yopf: "𝕪",
			yscr: "𝓎",
			Yfr: "𝔜",
			Yopf: "𝕐",
			Yscr: "𝒴",
			yacute: "ý",
			Yacute: "Ý",
			ycirc: "ŷ",
			Ycirc: "Ŷ",
			yuml: "ÿ",
			Yuml: "Ÿ",
			zfr: "𝔷",
			zopf: "𝕫",
			zscr: "𝓏",
			integers: "ℤ",
			zeetrf: "ℨ",
			Zfr: "ℨ",
			Zopf: "ℤ",
			Zscr: "𝒵",
			zacute: "ź",
			Zacute: "Ź",
			zcaron: "ž",
			Zcaron: "Ž",
			zdot: "ż",
			Zdot: "Ż",
			imped: "Ƶ",
			thorn: "þ",
			THORN: "Þ",
			napos: "ŉ",
			alpha: "α",
			Alpha: "Α",
			beta: "β",
			Beta: "Β",
			gamma: "γ",
			Gamma: "Γ",
			delta: "δ",
			Delta: "Δ",
			epsi: "ε",
			epsilon: "ε",
			epsiv: "ϵ",
			straightepsilon: "ϵ",
			varepsilon: "ϵ",
			Epsilon: "Ε",
			digamma: "ϝ",
			gammad: "ϝ",
			Gammad: "Ϝ",
			zeta: "ζ",
			Zeta: "Ζ",
			eta: "η",
			Eta: "Η",
			theta: "θ",
			thetasym: "ϑ",
			thetav: "ϑ",
			vartheta: "ϑ",
			Theta: "Θ",
			iota: "ι",
			Iota: "Ι",
			kappa: "κ",
			kappav: "ϰ",
			varkappa: "ϰ",
			Kappa: "Κ",
			lambda: "λ",
			Lambda: "Λ",
			mu: "μ",
			micro: "µ",
			Mu: "Μ",
			nu: "ν",
			Nu: "Ν",
			xi: "ξ",
			Xi: "Ξ",
			omicron: "ο",
			Omicron: "Ο",
			pi: "π",
			piv: "ϖ",
			varpi: "ϖ",
			Pi: "Π",
			rho: "ρ",
			rhov: "ϱ",
			varrho: "ϱ",
			Rho: "Ρ",
			sigma: "σ",
			Sigma: "Σ",
			sigmaf: "ς",
			sigmav: "ς",
			varsigma: "ς",
			tau: "τ",
			Tau: "Τ",
			upsi: "υ",
			upsilon: "υ",
			Upsilon: "Υ",
			Upsi: "ϒ",
			upsih: "ϒ",
			phi: "φ",
			phiv: "ϕ",
			straightphi: "ϕ",
			varphi: "ϕ",
			Phi: "Φ",
			chi: "χ",
			Chi: "Χ",
			psi: "ψ",
			Psi: "Ψ",
			omega: "ω",
			ohm: "Ω",
			Omega: "Ω",
			acy: "а",
			Acy: "А",
			bcy: "б",
			Bcy: "Б",
			vcy: "в",
			Vcy: "В",
			gcy: "г",
			Gcy: "Г",
			gjcy: "Ѓ",
			GJcy: "Ѓ",
			dcy: "д",
			Dcy: "Д",
			djcy: "Ђ",
			DJcy: "Ђ",
			iecy: "Е",
			IEcy: "Е",
			iocy: "Ё",
			IOcy: "Ё",
			jukcy: "є",
			Jukcy: "Є",
			zhcy: "Ж",
			ZHcy: "Ж",
			zcy: "з",
			Zcy: "З",
			dscy: "Ѕ",
			DScy: "Ѕ",
			icy: "и",
			Icy: "И",
			iukcy: "і",
			Iukcy: "І",
			yicy: "Ї",
			YIcy: "Ї",
			jcy: "й",
			Jcy: "Й",
			jsercy: "ј",
			Jsercy: "Ј",
			kcy: "к",
			Kcy: "К",
			kjcy: "Ќ",
			KJcy: "Ќ",
			lcy: "л",
			Lcy: "Л",
			ljcy: "Љ",
			LJcy: "Љ",
			mcy: "м",
			Mcy: "М",
			ncy: "н",
			Ncy: "Н",
			njcy: "Њ",
			NJcy: "Њ",
			ocy: "о",
			Ocy: "О",
			pcy: "п",
			Pcy: "П",
			rcy: "р",
			Rcy: "Р",
			scy: "с",
			Scy: "С",
			tcy: "т",
			Tcy: "Т",
			tshcy: "ћ",
			TSHcy: "Ћ",
			ucy: "у",
			Ucy: "У",
			ubrcy: "ў",
			Ubrcy: "Ў",
			fcy: "ф",
			Fcy: "Ф",
			khcy: "Х",
			KHcy: "Х",
			tscy: "Ц",
			TScy: "Ц",
			chcy: "Ч",
			CHcy: "Ч",
			dzcy: "Џ",
			DZcy: "Џ",
			shcy: "Ш",
			SHcy: "Ш",
			shchcy: "щ",
			SHCHcy: "Щ",
			hardcy: "ъ",
			HARDcy: "Ъ",
			ycy: "ы",
			Ycy: "Ы",
			softcy: "ь",
			SOFTcy: "Ь",
			ecy: "э",
			Ecy: "Э",
			yucy: "Ю",
			YUcy: "Ю",
			yacy: "Я",
			YAcy: "Я",
			alefsym: "ℵ",
			aleph: "ℵ",
			beth: "ℶ",
			gimel: "ℷ",
			daleth: "ℸ"
		};
		function a(r) {
			return e[r] || e[r.toLowerCase()];
		}
		//#endregion
		//#region node_modules/.pnpm/markdown-to-jsx@9.10.4_react@18.3.1/node_modules/markdown-to-jsx/dist/react.js
		var E = 32;
		var m = 9;
		var $r = 13;
		var O = 10;
		var re = 96;
		var be = 126;
		var _e = 91;
		var lr = 94;
		var U = 62;
		var rr = 35;
		var ht = 37;
		var F = 45;
		var tr = 61;
		var Se = 92;
		var Ee = 42;
		var He = 95;
		var ae = 60;
		var yt = 64;
		var We = 93;
		var xe = 33;
		var st = 38;
		var Oe = 58;
		var gt = 70;
		var pr = 102;
		var $t = 104;
		var Pr = 119;
		var et = 116;
		var xt = 112;
		var ln = 115;
		var Qn = 160;
		var Vn = 12;
		var Yn = 44;
		var vt = 59;
		var rt = 63;
		var ze = 46;
		var ce = 47;
		var Dr = 39;
		var Ir = 34;
		var Lr = 43;
		var pe = 124;
		var Or = 123;
		var Mt = 125;
		var nr = 40;
		var ar = 41;
		var qn = 78;
		var jn = 110;
		var ea = 79;
		var ra = 111;
		var Cn = 120;
		var fn = 88;
		var Bt = 30;
		var W = 48;
		var z = 57;
		var J = 65;
		var K = 90;
		var ie = 97;
		var le = 122;
		var Ct = 128;
		var ir = 32;
		var v = {
			blockQuote: 0,
			breakLine: 1,
			breakThematic: 2,
			codeBlock: 3,
			codeInline: 4,
			footnote: 5,
			footnoteReference: 6,
			frontmatter: 7,
			gfmTask: 8,
			heading: 9,
			htmlBlock: 10,
			htmlComment: 11,
			htmlSelfClosing: 12,
			image: 13,
			link: 14,
			orderedList: 15,
			paragraph: 16,
			ref: 17,
			refCollection: 18,
			table: 19,
			text: 20,
			textFormatted: 21,
			unorderedList: 22
		};
		function Ca(e) {
			if (!na(e, "---")) return null;
			let t = 3;
			for (; t < e.length && (e[t] === " " || e[t] === "	");) t++;
			if (t < e.length && e[t] === "\r" && t++, t >= e.length || e[t] !== `
`) return null;
			t++;
			let r = !1;
			for (; t < e.length;) {
				let n = t;
				for (; t < e.length && e[t] !== `
` && e[t] !== "\r";) t++;
				if (t >= e.length) break;
				let a = t;
				if (e[t] === "\r" && t++, t < e.length && e[t] === `
` && t++, na(e, "---", n)) return {
					endPos: t,
					hasValidYaml: r
				};
				if (!r) {
					let i = Oi(e, n, a);
					if (i < a) {
						let o = e.charCodeAt(i);
						if (o >= ie && o <= le || o >= J && o <= K || o >= W && o <= z || o === He) {
							for (i++; i < a && (o = e.charCodeAt(i), o >= ie && o <= le || o >= J && o <= K || o >= W && o <= z || o === He || o === F || o === ze);) i++;
							i < a && e.charCodeAt(i) === Oe && (i++, i >= a ? r = !0 : (o = e.charCodeAt(i), (o === E || o === m) && (r = !0)));
						}
					}
				}
			}
			return null;
		}
		var bi = /&([a-zA-Z0-9]+|#[0-9]{1,7}|#x[0-9a-fA-F]{1,6});/gi;
		var pi = {
			class: "className",
			for: "htmlFor",
			allowfullscreen: "allowFullScreen",
			allowtransparency: "allowTransparency",
			autocomplete: "autoComplete",
			autofocus: "autoFocus",
			autoplay: "autoPlay",
			cellpadding: "cellPadding",
			cellspacing: "cellSpacing",
			charset: "charSet",
			classid: "classId",
			colspan: "colSpan",
			contenteditable: "contentEditable",
			contextmenu: "contextMenu",
			crossorigin: "crossOrigin",
			enctype: "encType",
			formaction: "formAction",
			formenctype: "formEncType",
			formmethod: "formMethod",
			formnovalidate: "formNoValidate",
			formtarget: "formTarget",
			frameborder: "frameBorder",
			hreflang: "hrefLang",
			inputmode: "inputMode",
			keyparams: "keyParams",
			keytype: "keyType",
			marginheight: "marginHeight",
			marginwidth: "marginWidth",
			maxlength: "maxLength",
			mediagroup: "mediaGroup",
			minlength: "minLength",
			novalidate: "noValidate",
			radiogroup: "radioGroup",
			readonly: "readOnly",
			rowspan: "rowSpan",
			spellcheck: "spellCheck",
			srcdoc: "srcDoc",
			srclang: "srcLang",
			srcset: "srcSet",
			tabindex: "tabIndex",
			usemap: "useMap",
			viewbox: "viewBox"
		};
		var Ii = {};
		function dn(e) {
			if (!e) return Ii;
			var t = {};
			for (var r in e) {
				var a = pi[r.toLowerCase()];
				if (a) t[a] = e[r];
				else {
					var i = r.indexOf(":");
					i === -1 ? t[r] = e[r] : t[r.slice(0, i) + r[i + 1].toUpperCase() + r.slice(i + 2)] = e[r];
				}
			}
			return t;
		}
		var fa = /(\n|^[-*]\s|^#|^ {2,}|^-{2,}|^>\s|^<(div|p|h[1-6]|ul|ol|li|blockquote|pre|table|thead|tbody|tr|td|th|dl|dt|dd|hr|address|article|aside|details|dialog|figure|figcaption|footer|form|header|main|menu|nav|section|summary|textarea|fieldset|legend|center|dir|hgroup|marquee|search|output|template)\b)/i;
		function vr(e) {
			return e.indexOf("&") === -1 ? e : e.replace(bi, (t, r) => {
				var n = a(r);
				if (n) return n;
				if (r[0] === "#") {
					var a$1 = r[1] === "x" || r[1] === "X" ? Number.parseInt(r.slice(2), 16) : Number.parseInt(r.slice(1), 10);
					return a$1 === 0 || a$1 >= 55296 && a$1 <= 57343 || a$1 > 1114111 ? "�" : a$1 <= 65535 ? String.fromCharCode(a$1) : String.fromCharCode(55296 + (a$1 - 65536 >> 10), 56320 + (a$1 - 65536 & 1023));
				}
				return t;
			});
		}
		var ta = /(javascript|vbscript|data(?!:image)):/i;
		function Cr(e) {
			if (ta.test(e)) return null;
			if (e.indexOf("%") === -1) return e;
			try {
				let t = decodeURIComponent(e).replace(/[^A-Za-z0-9/:]/g, "");
				if (ta.test(t)) return null;
			} catch {
				return null;
			}
			return e;
		}
		var Be = {};
		var Ke;
		var Ie;
		for (Ke = [
			192,
			193,
			194,
			195,
			196,
			197,
			224,
			225,
			226,
			227,
			228,
			229,
			230,
			198
		], Ie = 0; Ie < Ke.length; Ie++) Be[Ke[Ie]] = "a";
		for (Be[231] = Be[199] = "c", Be[240] = Be[208] = "d", Ke = [
			200,
			201,
			202,
			203,
			233,
			232,
			234,
			235
		], Ie = 0; Ie < Ke.length; Ie++) Be[Ke[Ie]] = "e";
		for (Ke = [
			207,
			239,
			206,
			238,
			205,
			237,
			204,
			236
		], Ie = 0; Ie < Ke.length; Ie++) Be[Ke[Ie]] = "i";
		for (Be[209] = Be[241] = "n", Ke = [
			248,
			216,
			339,
			338,
			213,
			245,
			212,
			244,
			211,
			243,
			210,
			242
		], Ie = 0; Ie < Ke.length; Ie++) Be[Ke[Ie]] = "o";
		for (Ke = [
			220,
			252,
			219,
			251,
			218,
			250,
			217,
			249
		], Ie = 0; Ie < Ke.length; Ie++) Be[Ke[Ie]] = "u";
		Be[376] = Be[255] = Be[221] = Be[253] = "y";
		function Tr(e) {
			for (var t = "", r = -1, n = e.length, a = 0; a < n; a++) {
				var i = e.charCodeAt(a);
				if (i >= ie && i <= le || i >= W && i <= z) {
					r < 0 && (r = a);
					continue;
				}
				if (i >= J && i <= K) {
					r >= 0 && (t += e.slice(r, a), r = -1), t += String.fromCharCode(i + ir);
					continue;
				}
				if (i === E || i === F) {
					r >= 0 && (t += e.slice(r, a), r = -1), t += "-";
					continue;
				}
				r >= 0 && (t += e.slice(r, a), r = -1);
				var o = Be[i];
				o && (t += o);
			}
			return r >= 0 && (t += e.slice(r)), t;
		}
		function na(e, t, r) {
			return e.startsWith(t, r);
		}
		var aa = /* @__PURE__ */ new Set([
			"area",
			"base",
			"br",
			"col",
			"embed",
			"hr",
			"img",
			"input",
			"link",
			"meta",
			"param",
			"source",
			"track",
			"wbr",
			"circle",
			"ellipse",
			"line",
			"path",
			"polygon",
			"polyline",
			"rect",
			"use",
			"stop",
			"animate",
			"set"
		]);
		function Jr(e) {
			let t = e.toLowerCase();
			if (aa.has(t)) return !0;
			let r = t.indexOf(":");
			return r !== -1 ? (t = t.slice(r + 1), aa.has(t)) : !1;
		}
		var Xr = 1;
		var ia = 2;
		var nt = 4;
		var oa = 8;
		var Li = 16;
		var fr = 32;
		var yr = 64;
		var _a = (() => {
			var e = /* @__PURE__ */ new Uint8Array(128), t;
			for (e[m] = Xr, e[O] = Xr | ia, e[Vn] = Xr, e[$r] = Xr | ia, e[E] = Xr, t = xe; t <= ce; t++) e[t] = nt;
			for (t = Oe; t <= yt; t++) e[t] = nt;
			for (t = _e; t <= re; t++) e[t] = nt;
			for (t = Or; t <= be; t++) e[t] = nt;
			for (t = W; t <= z; t++) e[t] = Li;
			for (t = J; t <= K; t++) e[t] = oa;
			for (t = ie; t <= le; t++) e[t] = oa;
			return e;
		})();
		var da = /[\p{P}\p{S}]/u;
		var ca = /\p{Zs}/u;
		var tt = [];
		function ua(e) {
			var t = e.indexOf("\r"), r = e.indexOf("\0");
			if (t === -1 && r === -1) return e;
			var n = e.length;
			tt.length = 0;
			var a = 0, i = 0;
			for (t === -1 ? i = r : r === -1 ? i = t : i = t < r ? t : r; i < n; i++) {
				var o = e.charCodeAt(i);
				o === $r ? (a < i && tt.push(e.slice(a, i)), i + 1 < n && e.charCodeAt(i + 1) === O && i++, tt.push(`
`), a = i + 1) : o === 0 && (a < i && tt.push(e.slice(a, i)), tt.push("�"), a = i + 1);
			}
			return a < n && tt.push(e.slice(a)), tt.join("");
		}
		function Ra(e) {
			return e.replace(/>\s+</g, "><").replace(/\n+/g, " ").trim();
		}
		function Oi(e, t, r) {
			let n = r ?? e.length;
			for (; t < n && (e[t] === " " || e[t] === "	");) t++;
			return t;
		}
		function Dt(e) {
			if (!e) return !1;
			for (var t in e) return !0;
			return !1;
		}
		function Ha(e) {
			return {
				attrs: {},
				children: [{
					type: v.text,
					text: e
				}],
				c: !0,
				type: v.htmlBlock,
				tag: "header"
			};
		}
		var yi = /^\n+/;
		function ha(e) {
			for (var t = e.length; t > 0 && (e[t - 1] === `
` || e[t - 1] === "\r");) t--;
			return `${e.slice(0, t).replace(yi, "")}

`;
		}
		function at(e) {
			if ((e.type === v.htmlSelfClosing || e.type === v.htmlBlock) && e.a) return [];
			if (e.type === v.paragraph) {
				var t = e.children;
				return t ? t.flatMap(at) : [];
			}
			return e.type === v.text ? e.text?.trim() ? [e] : [] : e.type === v.htmlBlock && e.children ? [{
				...e,
				children: e.children?.flatMap(at)
			}] : [e];
		}
		function cn(e) {
			for (var t = 0; t < e.length; t++) {
				if (e[t].type === v.htmlBlock) {
					var r = e[t], n = !1;
					if (r.c && t === e.length - 1) {
						var a = r.j === void 0 ? r.a ? r.e || "" : (r.e || "") + (r.i || "") : r.j, i = `</${String(r.tag).toLowerCase()}>`, o = a.toLowerCase().indexOf(i);
						if (o !== -1) a.slice(o + i.length).replace(/<\/[a-z][a-z0-9-]*\s*>/gi, "").trim() && (n = !0);
					}
					n || (r.c = !1);
				}
				"children" in e[t] && e[t].children && cn(e[t].children);
			}
		}
		function sa(e, t) {
			for (var r = 0; r < e.length; r++) {
				var n = e[r];
				if (n.type === v.paragraph && n.children) for (var a = n.children, i = 0; i < a.length; i++) {
					var o = a[i];
					if (o.type === v.htmlSelfClosing && o.a && o.tag.toLowerCase() === t) {
						var A = e.slice(0, r);
						i > 0 && A.push({
							type: v.paragraph,
							children: a.slice(0, i)
						});
						var C = [];
						if (i + 1 < a.length) {
							var l = a.slice(i + 1).filter((_) => !(_.type === v.htmlSelfClosing && _.a));
							l.length > 0 && (C = l);
						}
						return C = C.concat(e.slice(r + 1)), {
							found: !0,
							beforeClose: A,
							afterClose: C
						};
					}
				}
				if ((n.type === v.htmlSelfClosing || n.type === v.htmlBlock) && n.a && n.tag.toLowerCase() === t) return {
					found: !0,
					beforeClose: e.slice(0, r),
					afterClose: e.slice(r + 1)
				};
			}
			return {
				found: !1,
				beforeClose: e,
				afterClose: []
			};
		}
		function xi(e) {
			var t = "";
			for (var r in e) {
				var n = e[r];
				n === !0 ? t += ` ${r}` : n !== void 0 && n != null && n !== !1 && (t += ` ${r}="${String(n)}"`);
			}
			return t;
		}
		function Aa(e, t, r, n) {
			var a;
			return t === void 0 ? a = xi(r) : a = t.length > 0 && t.charCodeAt(0) > E ? ` ${t}` : t, `<${e}${a}${n}`;
		}
		function un(e) {
			var t = e.tag, r = e.type === v.htmlSelfClosing, n = e, a = n.b, i = `</${t}>`;
			if (!r && n.a) return {
				kind: "literal",
				literal: (n.i || i) + (n.e || "")
			};
			if (r) {
				var o = e;
				return o.a ? {
					kind: "literal",
					literal: o.i || i
				} : o.m ? {
					kind: "literal",
					literal: o.m
				} : {
					kind: "literal",
					literal: Aa(t, a, e.attrs, " />")
				};
			}
			var A = Aa(t, a, e.attrs, ">"), C = n.children, l = C != null && C.length > 0;
			if (n.c && n.j !== void 0) return l ? {
				kind: "sandwich",
				open: A,
				close: i
			} : {
				kind: "literal",
				literal: n.j
			};
			if (n.c && !l) return {
				kind: "literal",
				literal: A + (n.e || "") + (n.i || i)
			};
			if (C != null && C.length > 0) {
				for (var _ = "", c = 0; c < C.length; c++) {
					var R = C[c];
					if (R.type !== v.text) return {
						kind: "sandwich",
						open: A,
						close: i
					};
					_ += R.text;
				}
				return {
					kind: "literal",
					literal: A + _ + i
				};
			}
			var d = n.e || "";
			return d && d.indexOf(i) !== -1 ? {
				kind: "literal",
				literal: A + d
			} : {
				kind: "literal",
				literal: A + d + i
			};
		}
		function ga(e, t, r) {
			var n = [], a = e, i = r;
			if (a && n.push(a), Array.isArray(t)) for (var o = 0; o < t.length; o++) n.push(t[o]);
			else t != null && n.push(t);
			i && n.push(i);
			for (var A = [], C = 0; C < n.length; C++) {
				var l = n[C];
				typeof l == "string" && A.length > 0 && typeof A.at(-1) == "string" ? A[A.length - 1] = A.at(-1) + l : A.push(l);
			}
			return A;
		}
		function Kr(e) {
			return e == null || e.tagfilter !== !1;
		}
		function $a(e, t, r, n) {
			var a = t(e, r, n);
			return a === null ? null : Mi(a);
		}
		function va(e) {
			var t = [];
			if (!e) return t;
			for (var r in e) r.charCodeAt(0) === 94 && t.push({
				identifier: r,
				footnote: e[r].target
			});
			return t;
		}
		function la(e) {
			for (var t = 0, r = e.length; t < r;) {
				var n = e.charCodeAt(t);
				if (n >= J && n <= K) return e.toLowerCase();
				t++;
			}
			return e;
		}
		function Xt(e, t, r) {
			if (t.indexOf(".") === -1) {
				var n = e?.[t];
				if (n) return n;
				if (e) {
					var a = la(t);
					if (a !== t) {
						var i = e[a];
						if (i) return i;
					}
				}
				return r;
			}
			for (var o = e, A = t.split("."), C = 0, l = !1; C < A.length;) {
				if (o = o?.[A[C]], o === void 0) {
					l = C === 0;
					break;
				}
				C++;
			}
			if (l && e) {
				var _ = la(A[0]);
				if (_ !== A[0]) for (o = e[_], C = 1; o !== void 0 && C < A.length;) o = o?.[A[C]], C++;
			}
			return o || r;
		}
		function Mi(e) {
			for (var t = !1, r = 0; r < e.length; r++) {
				var n = e.charCodeAt(r);
				if (n <= E || n === Ir || n === ht || n === ae || n === U || n === _e || n === Se || n === We || n === lr || n === re || n >= 123) {
					t = !0;
					break;
				}
			}
			if (!t) return e;
			for (var a = "", r = 0; r < e.length; r++) {
				var n = e.charCodeAt(r);
				if (n === ht && r + 2 < e.length) {
					var i = e.charCodeAt(r + 1), o = e.charCodeAt(r + 2);
					if ((i >= W && i <= z || i >= J && i <= gt || i >= ie && i <= pr) && (o >= W && o <= z || o >= J && o <= gt || o >= ie && o <= pr)) {
						a += e[r] + e[r + 1] + e[r + 2], r += 2;
						continue;
					}
				}
				if (n >= 55296 && n <= 57343) {
					if (n <= 56319 && r + 1 < e.length) {
						var A = e.charCodeAt(r + 1);
						if (A >= 56320 && A <= 57343) {
							a += encodeURI(e[r] + e[r + 1]), r++;
							continue;
						}
					}
					a += e[r];
					continue;
				}
				a += encodeURI(e[r]);
			}
			return a;
		}
		function Ta(...e) {
			return e.filter(Boolean).join(" ");
		}
		var Bi = /* @__PURE__ */ new Set([
			"title",
			"textarea",
			"style",
			"xmp",
			"iframe",
			"noembed",
			"noframes",
			"script",
			"plaintext"
		]);
		var Pt = /<(\/?)(title|textarea|style|xmp|iframe|noembed|noframes|script|plaintext)(\s|>|\/)/gi;
		function Rn(e) {
			return Bi.has(e.toLowerCase());
		}
		function Sa(e) {
			return Pt.lastIndex = 0, Pt.test(e);
		}
		function Hn(e) {
			return Pt.lastIndex = 0, e.replace(Pt, (t, r, n, a) => `&lt;${r}${n}${a}`);
		}
		function Et(e, t) {
			var r = e || {}, n = r.slugify, a;
			if (n) {
				var i = n;
				a = (o) => i(o, Tr);
			} else a = Tr;
			return {
				disableAutoLink: r.disableAutoLink,
				disableFrontmatter: r.disableFrontmatter,
				disableParsingRawHTML: r.disableParsingRawHTML,
				enforceAtxHeadings: r.enforceAtxHeadings,
				evalUnserializableExpressions: r.evalUnserializableExpressions,
				forceBlock: r.forceBlock,
				forceInline: t === void 0 ? r.forceInline : t,
				ignoreHTMLBlocks: r.ignoreHTMLBlocks,
				optimizeForStreaming: r.optimizeForStreaming,
				preserveFrontmatter: r.preserveFrontmatter,
				sanitizer: r.sanitizer || Cr,
				slugify: a,
				tagfilter: Kr(r)
			};
		}
		var Ga = /^<([a-zA-Z][a-zA-Z0-9-]*)\s[^>]*>/;
		var Fa = /^<[A-Z]/;
		var vn = [
			"script",
			"pre",
			"style",
			"textarea"
		];
		var Nt = new Set(vn);
		var Pi = /<(?:pre|script|style|textarea)\b/i;
		var Na = /<(?:pre|script|style|textarea)\b/iy;
		var hn = /^(\s{0,3}#[#\s]|\s{0,3}[-*+]\s|\s{0,3}\d+\.\s|\s{0,3}>\s|\s{0,3}```)/m;
		var ka = /^<([a-z][^ >/\n\r]*) ?([^>]*?)>/im;
		var Ua = /* @__PURE__ */ new Uint8Array(128);
		(() => {
			for (var e = [
				re,
				Ee,
				He,
				be,
				tr,
				_e,
				xe,
				ae,
				Se,
				st,
				O,
				$t,
				Pr,
				pr
			], t = 0; t < e.length; t++) Ua[e[t]] = 1;
		})();
		var ma = /([a-zA-Z_][a-zA-Z0-9_-]*)=(?:"([^"]*)"|'([^']*)')/g;
		function Wa(e) {
			return Nt.has(e);
		}
		function za(e) {
			return Pi.test(e);
		}
		function Za(e, t, r) {
			for (var n = t, a = r; n < a && (e.charCodeAt(n) === E || e.charCodeAt(n) === m);) n++;
			if (n >= a) return !1;
			e.charCodeAt(n) === pe && n++;
			for (var i = 0; n < a;) {
				for (; n < a && (e.charCodeAt(n) === E || e.charCodeAt(n) === m);) n++;
				if (n >= a) break;
				if (e.charCodeAt(n) === pe && i > 0) {
					for (var o = n + 1; o < a && (e.charCodeAt(o) === E || e.charCodeAt(o) === m);) o++;
					if (o >= a) return !0;
				}
				if (e.charCodeAt(n) === Oe && n++, n >= a || e.charCodeAt(n) !== F) return !1;
				for (; n < a && e.charCodeAt(n) === F;) n++;
				for (n < a && e.charCodeAt(n) === Oe && n++, i++; n < a && (e.charCodeAt(n) === E || e.charCodeAt(n) === m);) n++;
				if (n < a) if (e.charCodeAt(n) === pe) n++;
				else return !1;
			}
			return i > 0;
		}
		var Di = /[\u0000-\u001F\u007F]/g;
		var Xi = {
			action: 1,
			background: 1,
			cite: 1,
			data: 1,
			formaction: 1,
			href: 1,
			longdesc: 1,
			poster: 1,
			src: 1,
			"xlink:href": 1
		};
		var Ji = /&#(x[0-9a-f]+|[0-9]+);?/gi;
		function Ki(e) {
			return e.indexOf("&#") === -1 ? e : e.replace(Ji, (t, r) => {
				var n = r.charCodeAt(0) === Cn || r.charCodeAt(0) === fn ? Number.parseInt(r.slice(1), 16) : Number.parseInt(r, 10);
				return n > 0 && n <= 1114111 ? String.fromCodePoint(n) : t;
			});
		}
		function Gi(e, t, r) {
			if (r && t.charCodeAt(0) === Or) return !1;
			var n = e.charCodeAt(0), a = e.charCodeAt(1);
			if ((n === ra || n === ea) && (a === jn || a === qn)) return !(r && t === "");
			var i = e.toLowerCase();
			if (i === "srcdoc") return !0;
			if (i === "style") return /url\s*\(\s*(javascript|vbscript|data:(?!image\/))/i.test(t);
			if (Xi[i] === 1) {
				var o = Ki(vr(t));
				if (Cr(o) === null) return !0;
				var A = o.replace(Di, "");
				return A !== o && Cr(A) === null;
			}
			return !1;
		}
		function Tn(e) {
			return "<" + (e.g ? "/" : "") + e.tag + e.h + e.b + (e.n ? e.s ? " />" : "/>" : ">");
		}
		function wa(e, t, r, n) {
			for (var a = [], i = t, o = 0; o < n.length; o += 2) {
				var A = n[o];
				if (A > i) {
					var C = e.slice(i, A).trim();
					C && a.push(C);
				}
				i = n[o + 1];
			}
			if (i < r) {
				var l = e.slice(i, r).trim();
				l && a.push(l);
			}
			return a.join(" ");
		}
		function Er(e, t) {
			if (e.charCodeAt(t) !== ae) return null;
			let r = t + 1, n = e.length, a = !1;
			e.charCodeAt(r) === ce && (r++, a = !0);
			let i = r, o = e.charCodeAt(r);
			if (!(o >= ie && o <= le || o >= J && o <= K)) return null;
			for (; r < n && (e.charCodeAt(r) >= ie && e.charCodeAt(r) <= le || e.charCodeAt(r) >= J && e.charCodeAt(r) <= K || e.charCodeAt(r) >= W && e.charCodeAt(r) <= z || e.charCodeAt(r) === F);) r++;
			let A = e.slice(i, r);
			if (!A) return null;
			let C = A.charCodeAt(0), l = C >= J && C <= K || A.indexOf("-") !== -1, _ = r;
			for (; r < n && (e.charCodeAt(r) === E || e.charCodeAt(r) === m || e.charCodeAt(r) === O);) r++;
			let c = e.slice(_, r);
			if (r === _ && r < n) {
				var R = e.charCodeAt(r);
				if (R !== U && R !== ce) return null;
			}
			let d = r, s = {}, g = !1;
			for (var u = null; r < n;) {
				let P = e.charCodeAt(r);
				if (P === U) {
					let L = u ? wa(e, d, r, u) : e.slice(d, r);
					return {
						s: g,
						u: l,
						g: a,
						b: L,
						r: u != null,
						n: !1,
						h: c,
						attrs: s,
						end: r + 1,
						tag: A
					};
				}
				if (P === E || P === m || P === O) {
					r++;
					continue;
				}
				if (P === ce && r + 1 < n && e.charCodeAt(r + 1) === U) {
					g = r > d && e.charCodeAt(r - 1) === E;
					let L = u ? wa(e, d, r, u) : e.slice(d, r);
					return {
						s: g,
						u: l,
						g: a,
						b: L,
						r: u != null,
						n: !0,
						h: c,
						attrs: s,
						end: r + 2,
						tag: A
					};
				}
				var f = r, h = e.charCodeAt(r);
				if (!(h >= ie && h <= le || h >= J && h <= K || h === He || h === Oe)) return null;
				for (r++; r < n;) {
					var T = e.charCodeAt(r);
					if (T >= ie && T <= le || T >= J && T <= K || T >= W && T <= z || T === He || T === ze || T === Oe || T === F) r++;
					else break;
				}
				for (var S = e.slice(f, r), w = r; r < n && (e.charCodeAt(r) === E || e.charCodeAt(r) === m);) r++;
				var H, k;
				if (e.charCodeAt(r) === tr) {
					for (r++; r < n && (e.charCodeAt(r) === E || e.charCodeAt(r) === m);) r++;
					var N = e.charCodeAt(r);
					if (N === Ir || N === Dr) {
						r++;
						for (var p = r; r < n && e.charCodeAt(r) !== N;) r++;
						if (r >= n) return null;
						if (H = e.slice(p, r), r++, r < n) {
							var y = e.charCodeAt(r);
							if (y !== E && y !== m && y !== O && y !== U && y !== ce) return null;
						}
						k = r;
					} else if (N === Or) {
						var B = 1, p = r;
						for (r++; r < n && B > 0;) {
							var T = e.charCodeAt(r);
							T === Or ? B++ : T === Mt && B--, r++;
						}
						H = e.slice(p, r), k = r;
					} else {
						for (var p = r; r < n;) {
							var x = e.charCodeAt(r);
							if (x === E || x === m || x === U || x === O || x === Ir || x === Dr || x === tr || x === ae || x === re) break;
							r++;
						}
						if (r === p) return null;
						H = e.slice(p, r), k = r;
					}
				} else H = "", k = w;
				Gi(S, H, l) ? (u === null && (u = []), u.push(f, k)) : s[S] = H;
			}
			return null;
		}
		function or(e) {
			var t = e.indexOf("<");
			if (t === -1) return e;
			for (var r = "", n = 0, a = !1; t !== -1;) {
				var i = Er(e, t);
				i ? (i.r && (r += e.slice(n, t) + Tn(i), n = i.end, a = !0), t = e.indexOf("<", i.end)) : t = e.indexOf("<", t + 1);
			}
			return a ? r + e.slice(n) : e;
		}
		function Fi(e, t, r) {
			if (!r.optimizeForStreaming && e.indexOf("[") === -1) return !1;
			for (var n = 0, a = e.length, i = !1, o = !1; n < a;) {
				for (var A = e.indexOf(`
`, n), C = A < 0 ? a : A, l = n, _ = 0; l < C && _ < 4;) if (e.charCodeAt(l) === E) _++, l++;
				else if (e.charCodeAt(l) === m) _ += 4, l++;
				else break;
				if (l >= C) {
					i = !1, n = A < 0 ? a : A + 1;
					continue;
				}
				if (_ < 4) {
					var c = e.charCodeAt(l);
					if (c === re || c === be) {
						for (var R = c, d = 0, s = l; s < C && e.charCodeAt(s) === R;) d++, s++;
						if (d >= 3) {
							var g = !0;
							if (R === re) {
								for (var u = s; u < C; u++) if (e.charCodeAt(u) === re) {
									g = !1;
									break;
								}
							}
							if (g) {
								i = !1;
								for (var f = A < 0 ? a : A + 1; f < a;) {
									for (var h = f, T = 0; h < a && T < 4;) {
										var S = e.charCodeAt(h);
										if (S === E) T++, h++;
										else if (S === m) T += 4, h++;
										else break;
									}
									if (T < 4 && h < a && e.charCodeAt(h) === R) {
										for (var w = 0; h < a && e.charCodeAt(h) === R;) w++, h++;
										if (w >= d) {
											for (; h < a && (e.charCodeAt(h) === E || e.charCodeAt(h) === m);) h++;
											if (h >= a || e.charCodeAt(h) === O) {
												n = h >= a ? a : h + 1;
												break;
											}
										}
									}
									for (; f < a && e.charCodeAt(f) !== O;) f++;
									f < a && f++;
								}
								f >= a && (n = a, o = !0);
								continue;
							}
						}
					}
				}
				for (var H = l; H < C && e.charCodeAt(H) === U;) {
					H++, H < C && e.charCodeAt(H) === E && H++;
					for (var k = 0; H < C && k < 4;) if (e.charCodeAt(H) === E) k++, H++;
					else if (e.charCodeAt(H) === m) k += 4, H++;
					else break;
					if (k >= 4) break;
					i = !1;
				}
				if (!i && _ < 4 && H < C && e.charCodeAt(H) === _e && !(H + 1 < a && e.charCodeAt(H + 1) === lr)) {
					var N = Qa(e, H, t);
					if (N) {
						n = N, i = !1;
						continue;
					}
				}
				var p = e.charCodeAt(l);
				if (p === rr && _ < 4) i = !1;
				else if (_ < 4 && (p === F || p === Ee || p === He)) {
					for (var y = l, B = 0; y < C;) {
						var x = e.charCodeAt(y);
						if (x === p) B++;
						else if (x !== E && x !== m) break;
						y++;
					}
					i = !(B >= 3 && y >= C);
				} else i = !0;
				n = A < 0 ? a : A + 1;
			}
			return o;
		}
		function Qa(e, t, r) {
			let n = e.length;
			if (e.charCodeAt(t) !== _e) return null;
			let a = t + 1 < n && e.charCodeAt(t + 1) === lr, i = t + 1;
			for (; i < n;) {
				var o = e.charCodeAt(i);
				if (o === We) {
					i++;
					break;
				}
				if (o === _e) return null;
				o === Se && i + 1 < n && i++, i++;
			}
			if (i > n || e.charCodeAt(i - 1) !== We) return null;
			let A = e.slice(t + 1, i - 1);
			if (A.length > 999) return null;
			let C = Gt(A);
			if (!C || i >= n || e.charCodeAt(i) !== Oe) return null;
			i++;
			let l = !1;
			for (; i < n;) {
				let P = e.charCodeAt(i);
				if (P === E || P === m) i++;
				else if (P === O && !l) l = !0, i++;
				else break;
			}
			if (a) {
				let P = e.indexOf(`
`, i), L = P < 0 ? n : P;
				return r[C] = {
					target: e.slice(i, L).trim(),
					title: void 0
				}, P < 0 ? n : P + 1;
			}
			var _;
			if (i < n && e.charCodeAt(i) === ae) {
				i++;
				for (var c = i; i < n && e.charCodeAt(i) !== U && e.charCodeAt(i) !== O;) e.charCodeAt(i) === Se && i + 1 < n && i++, i++;
				if (i >= n || e.charCodeAt(i) !== U) return null;
				_ = e.slice(c, i), i++;
				for (var R = e.indexOf(`
`, i), d = R < 0 ? n : R, s = i; s < d && (e.charCodeAt(s) === E || e.charCodeAt(s) === m);) s++;
				if (s < d) {
					if (s === i) return null;
					var g = e.charCodeAt(s);
					if (g !== Ir && g !== Dr && g !== nr) return null;
				}
			} else {
				for (var c = i, u = 0; i < n;) {
					var o = e.charCodeAt(i);
					if (o === nr) u++;
					else if (o === ar) {
						if (u === 0) break;
						u--;
					} else {
						if (o === E || o === m || o === O) break;
						o === Se && i + 1 < n && i++;
					}
					i++;
				}
				if (_ = e.slice(c, i), !_) return null;
			}
			for (; i < n && (e.charCodeAt(i) === E || e.charCodeAt(i) === m);) i++;
			var f = e.indexOf(`
`, i), h = f < 0 ? n : f, T, S = !1, w = i, H = i;
			if (i === h && i < n) for (H = i + 1; H < n && (e.charCodeAt(H) === E || e.charCodeAt(H) === m);) H++;
			if (H < n) {
				var k = e.charCodeAt(H);
				if (k === Ir || k === Dr || k === nr) {
					for (var N = k === nr ? 41 : k, p = H + 1, y = p; p < n;) {
						var B = e.charCodeAt(p);
						if (B === N) {
							for (var x = p + 1; x < n && (e.charCodeAt(x) === E || e.charCodeAt(x) === m);) x++;
							(x >= n || e.charCodeAt(x) === O) && (T = e.slice(y, p), S = !0, w = x < n ? x + 1 : n);
							break;
						}
						if (B === Se && p + 1 < n) {
							p += 2;
							continue;
						}
						if (B === O && p + 1 < n && e.charCodeAt(p + 1) === O) break;
						p++;
					}
					if (!S && H === i) return null;
				}
			}
			if (S) return r[C] || (r[C] = {
				target: vr(dt(_)),
				title: T === void 0 ? T : vr(dt(T))
			}), w;
			for (; i < h && (e.charCodeAt(i) === E || e.charCodeAt(i) === m);) i++;
			return i < h ? null : (r[C] || (r[C] = {
				target: vr(dt(_)),
				title: T
			}), f < 0 ? n : f + 1);
		}
		var Qe = new Uint8Array(_a);
		for (Qe[rr] |= fr, Qe[U] |= fr, Qe[F] |= fr | yr, Qe[Lr] |= fr, Qe[Ee] |= fr | yr, Qe[He] |= fr | yr, Qe[re] |= fr | yr, Qe[be] |= fr | yr, Qe[ae] |= fr | yr, Qe[_e] |= yr, Qe[xe] |= yr, Qe[pe] |= fr, Tt = W; Tt <= z; Tt++) Qe[Tt] |= fr;
		var Tt;
		function ba(e) {
			if (e.indexOf("[") < 0 && e.indexOf("]") < 0) return !1;
			for (var t = 0; t < e.length; t++) {
				if (e.charCodeAt(t) === Se) {
					t++;
					continue;
				}
				if (e.charCodeAt(t) === _e || e.charCodeAt(t) === We) return !0;
			}
			return !1;
		}
		function Gt(e) {
			for (var t = e.length, r = !0, n = t > 0, a = 0; a < t; a++) {
				var i = e.charCodeAt(a);
				if (i === E) {
					if (r) {
						n = !1;
						break;
					}
					r = !0;
				} else if (i < 33 || i > 126 || i >= J && i <= K) {
					n = !1;
					break;
				} else r = !1;
			}
			if (n && !r) return e;
			var o = e.replace(/\s+/g, " ").trim();
			return o.indexOf("ẞ") !== -1 ? o.replace(/\u1E9E/g, "ss").toLowerCase() : o.toLowerCase();
		}
		function In(e) {
			return e < Ct ? Qe[e] : e === Qn ? Xr : 0;
		}
		function dt(e) {
			return e.indexOf("\\") === -1 ? e : e.replace(/\\([!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])/g, "$1");
		}
		var Sn = null;
		var En = -1;
		var Ft = -1;
		function Ae(e, t) {
			if (t >= En && t <= Ft && e === Sn) return Ft;
			var r = e.indexOf(`
`, t), n = r < 0 ? e.length : r;
			return Sn = e, En = t, Ft = n, n;
		}
		function Q(e, t) {
			let r = Ae(e, t);
			return r < e.length ? r + 1 : r;
		}
		function St(e, t, r) {
			for (; t < r;) {
				let n = e.charCodeAt(t);
				if (n !== E && n !== m) break;
				t++;
			}
			return t;
		}
		function pa(e, t) {
			let r = Q(e, t);
			for (; r < e.length;) {
				let n = Ae(e, r);
				if (Ze(e, r, n)) return r;
				r = Q(e, r);
			}
			return e.length;
		}
		function Zr(e, t, r, n) {
			let a = 0;
			for (; t + a < r && e.charCodeAt(t + a) === n;) a++;
			return a;
		}
		var oe = 0;
		var te = 0;
		function Ne(e, t, r) {
			for (oe = 0, te = 0; t + te < r;) {
				let n = e.charCodeAt(t + te);
				if (n === m) oe += 4 - oe % 4;
				else if (n === E) oe++;
				else break;
				te++;
			}
		}
		function Ze(e, t, r) {
			return St(e, t, r) >= r;
		}
		function Va(e, t, r) {
			for (; t < r;) {
				var n = e.charCodeAt(t);
				if (n !== O && n !== E && n !== m) return !1;
				t++;
			}
			return !0;
		}
		function Ui(e, t) {
			if (!e) return e;
			var r = t.v || (t.v = Object.create(null)), n = r[e];
			if (n === void 0) return r[e] = 0, e;
			for (var a = n + 1, i = `${e}-${a}`; r[i] !== void 0;) a++, i = `${e}-${a}`;
			return r[e] = a, r[i] = 0, i;
		}
		function Wi(e, t, r, n) {
			let a = Ae(e, t);
			if (Ne(e, t, a), oe > 3) return null;
			let i = t + te;
			if (e.charCodeAt(i) !== rr) return null;
			let o = Zr(e, i, a, 35);
			if (o < 1 || o > 6 || (i += o, i < a && e.charCodeAt(i) !== E && e.charCodeAt(i) !== m)) return null;
			i = St(e, i, a);
			for (var A = a; A > i && e.charCodeAt(A - 1) === E;) A--;
			for (var C = A; A > i && e.charCodeAt(A - 1) === rr;) A--;
			if (A < C) if (A === i || e.charCodeAt(A - 1) === E) for (; A > i && e.charCodeAt(A - 1) === E;) A--;
			else A = C;
			let _ = ct(e.slice(i, A), !1, r, n);
			return {
				node: {
					type: v.heading,
					level: o,
					children: _,
					id: ""
				},
				end: Q(e, a)
			};
		}
		function zi(e, t, r) {
			var n = e.charCodeAt(t);
			if (n !== tr && n !== F) return !1;
			for (var a = t; a < r && e.charCodeAt(a) === n;) a++;
			for (; a < r && (e.charCodeAt(a) === E || e.charCodeAt(a) === m);) a++;
			return a >= r;
		}
		function Wr(e, t) {
			let r = Ae(e, t);
			if (Ne(e, t, r), oe > 3) return null;
			let n = t + te, a = e.charCodeAt(n);
			if (a !== F && a !== Ee && a !== He) return null;
			let i = 0;
			for (; n < r;) {
				let o = e.charCodeAt(n);
				if (o === a) i++;
				else if (o !== E && o !== m) return null;
				n++;
			}
			return i < 3 ? null : {
				node: { type: v.breakThematic },
				end: Q(e, r)
			};
		}
		var Ia = 0;
		var La = 0;
		var Oa = "";
		function Zi(e, t, r) {
			let n = Ae(e, t);
			if (Ne(e, t, n), oe > 3) return null;
			let a = oe, o = t + te, A = e.charCodeAt(o);
			if (A !== re && A !== be) return null;
			let C = Zr(e, o, n, A);
			if (C < 3) return null;
			o += C;
			let l = St(e, o, n), _ = n;
			if (A === re) {
				for (let M = l; M < n; M++) if (e.charCodeAt(M) === re) return null;
			}
			for (; _ > l && (e.charCodeAt(_ - 1) === E || e.charCodeAt(_ - 1) === m);) _--;
			let c = e.slice(l, _), R = "", d = "", s = c.indexOf(" ");
			s === -1 ? R = c : (R = c.slice(0, s), d = c.slice(s + 1).trim()), R = dt(R);
			var g;
			if (d) {
				ma.lastIndex = 0;
				for (var u; (u = ma.exec(d)) != null;) g || (g = {}), g[u[1]] = u[2] === void 0 ? u[3] : u[2];
			}
			let f = Q(e, n), { length: h, length: T } = e;
			var S;
			A === Ia && C === La ? S = Oa : (S = String.fromCharCode(A).repeat(C), Ia = A, La = C, Oa = S);
			for (var w = f; w < e.length;) {
				var H = e.indexOf(S, w);
				if (H === -1) break;
				for (var k = H, N = 0; k > 0 && N < 4 && e.charCodeAt(k - 1) === E;) k--, N++;
				if (N <= 3 && (k === 0 || e.charCodeAt(k - 1) === O)) {
					for (var p = H + C; p < e.length && e.charCodeAt(p) === A;) p++;
					var y = Ae(e, p);
					if (Ze(e, p, y)) {
						h = k, T = Q(e, y);
						break;
					}
				}
				w = H + 1;
			}
			var B;
			if (a === 0) B = h > f && e.charCodeAt(h - 1) === O ? e.slice(f, h - 1) : e.slice(f, h);
			else {
				B = "";
				for (var x = f; x < h;) {
					var P = Ae(e, x);
					Ne(e, x, P);
					var L = Math.min(te, a);
					B += `${e.slice(x + L, P)}
`, x = Q(e, P);
				}
				B.length > 0 && B.charCodeAt(B.length - 1) === O && (B = B.slice(0, -1));
			}
			return {
				node: {
					type: v.codeBlock,
					lang: R || void 0,
					text: B,
					infoString: d || void 0,
					attrs: g
				},
				end: T
			};
		}
		function ya(e, t, r) {
			for (var n = 0, a = t; a < r && n < 4;) e.charCodeAt(a) === m ? n += 4 - n % 4 : n++, a++;
			if (n < 4) return "";
			for (var i = "", o = 4; o < n; o++) i += " ";
			return i + e.slice(a, r);
		}
		function Qi(e, t) {
			if (Ne(e, t, Ae(e, t)), oe < 4) return null;
			let n = "", a = t;
			for (; a < e.length;) {
				let R = Ae(e, a);
				if (Ne(e, a, R), Ze(e, a, R)) {
					for (var i = `${ya(e, a, R)}
`, o = Q(e, R); o < e.length;) {
						var A = Ae(e, o);
						if (Ze(e, o, A)) {
							i += `${ya(e, o, A)}
`, o = Q(e, A);
							continue;
						}
						Ne(e, o, A), oe >= 4 && (n += i, a = o);
						break;
					}
					if (a !== o) break;
					continue;
				}
				if (oe < 4) break;
				let d = 0, s = 0;
				var C = 0;
				for (let g = a; g < R && s < 4; g++) {
					if (e.charCodeAt(g) === m) {
						var l = 4 - s % 4;
						s + l > 4 && (C = s + l - 4), s += l;
					} else s++;
					d++;
				}
				var _ = "";
				if (C > 0) for (var c = 0; c < C; c++) _ += " ";
				_ += e.slice(a + d, R), n += `${_}
`, a = Q(e, R);
			}
			for (; n.length > 0 && n.charCodeAt(n.length - 1) === O;) n = n.slice(0, -1);
			return n ? {
				node: {
					type: v.codeBlock,
					lang: void 0,
					text: n,
					infoString: void 0,
					attrs: void 0
				},
				end: a
			} : null;
		}
		function Vi(e, t, r, n) {
			if (Ne(e, t, Ae(e, t)), oe > 3) return null;
			let i = t + te;
			if (e.charCodeAt(i) !== U) return null;
			let o = "", A = t, C, l = !1, _ = !1, c = !1;
			for (; A < e.length;) {
				let I = Ae(e, A);
				Ne(e, A, I);
				let Z = A + te;
				if (e.charCodeAt(Z) === U) {
					let ee = Z + 1;
					var R = oe + 1, d = !1;
					if (ee < I) {
						var s = e.charCodeAt(ee);
						s === E ? (ee++, R++, d = !0) : s === m && (d = !0);
					}
					for (var g = "", u = !1, f = ee; f < I; f++) if (e.charCodeAt(f) === m) {
						u = !0;
						break;
					}
					if (u) {
						var h = R;
						if (d && ee < I && e.charCodeAt(ee) === m) {
							for (var T = 4 - h % 4, S = 0; S < T - 1; S++) g += " ";
							h += T, ee++;
						}
						for (var w = ee; w < I; w++) if (e.charCodeAt(w) === m) {
							for (var H = 4 - h % 4, k = 0; k < H; k++) g += " ";
							h += H;
						} else g += e[w], h++;
					} else g = e.slice(ee, I);
					if (!(o || C)) {
						let ve = g.match(/^\[!([A-Za-z]+)\]\s*$/);
						if (ve) {
							C = ve[1].toUpperCase(), A = Q(e, I);
							continue;
						}
					}
					o += `${g}
`;
					var N = g.trimStart();
					N.startsWith("```") || N.startsWith("~~~") ? c = !c : (g.startsWith("    ") || g.startsWith("	")) && (c = !0), _ = N.length > 0, A = Q(e, I);
				} else if (o && !Ze(e, A, I) && _) {
					if (oe < 4) {
						var p = A + te, y = p < I ? e.charCodeAt(p) : 0;
						if (y === rr || y === U || y === re || y === be || y === ae || (y === F || y === Ee || y === He) && Wr(e, A) || (y === F || y === Ee || y === Lr) && p + 1 < I && (e.charCodeAt(p + 1) === E || e.charCodeAt(p + 1) === m)) break;
						if (y >= W && y <= z) {
							for (var B = p; B < I && e.charCodeAt(B) >= W && e.charCodeAt(B) <= z;) B++;
							if (B < I && (e.charCodeAt(B) === ze || e.charCodeAt(B) === ar)) break;
						}
					}
					if (c) break;
					o += `${e.slice(A, I)}
`, l = !0, A = Q(e, I);
				} else break;
			}
			if (!(o || C)) return null;
			var { inBlockQuote: x, l: P } = r;
			r.inBlockQuote = !0, l && (r.l = !0);
			var L = r.f;
			r.f = L || !Va(e, A, e.length);
			let M = zr(o || "", r, n);
			return r.f = L, r.inBlockQuote = x, r.l = P, {
				node: {
					type: v.blockQuote,
					children: M,
					alert: C || void 0
				},
				end: A
			};
		}
		function Ya(e, t, r) {
			for (var n = 0, a = t; a < r; a++) e.charCodeAt(a) === m ? n += 4 - n % 4 : n++;
			return n;
		}
		function Gr(e, t, r) {
			if (Ne(e, t, r), oe > 3) return null;
			var n = t + te;
			if (n >= r) return null;
			var a = e.charCodeAt(n), i = oe, o = n, A = n;
			if (a === F || a === Ee || a === Lr) {
				if (o = n + 1, o < r && e.charCodeAt(o) !== E && e.charCodeAt(o) !== m && e.charCodeAt(o) !== O) return null;
			} else if (a >= W && a <= z) {
				for (; A < r && A - n < 9;) {
					var C = e.charCodeAt(A);
					if (C < W || C > z) break;
					A++;
				}
				if (A > n && A < r) {
					var l = e.charCodeAt(A);
					if (l === ze || l === ar) {
						if (o = A + 1, o < r && e.charCodeAt(o) !== E && e.charCodeAt(o) !== m && e.charCodeAt(o) !== O) return null;
					} else return null;
				} else return null;
			} else return null;
			var _ = o, c = Ya(e, t, o), R = 0, d = _, s = c;
			if (_ >= r) return {
				ordered: a >= W && a <= z,
				marker: a >= W && a <= z ? e[A] : e[n],
				start: a >= W && a <= z ? Number.parseInt(e.slice(n, A), 10) : void 0,
				contentStart: _,
				contentCol: c + 1,
				markerCol: i,
				isEmpty: !0
			};
			for (; d < r && (e.charCodeAt(d) === E || e.charCodeAt(d) === m);) {
				if (e.charCodeAt(d) === m) {
					var g = 4 - s % 4;
					s += g;
				} else s++;
				d++, R++;
			}
			var u = d >= r, f = s - c;
			return u || f > 4 ? (s = c + 1, d = _ + 1, R = 1) : R === 0 && (s = c + 1, d = _, R = 1), {
				ordered: a >= W && a <= z,
				marker: a >= W && a <= z ? e[A] : e[n],
				start: a >= W && a <= z ? Number.parseInt(e.slice(n, A), 10) : void 0,
				contentStart: d,
				contentCol: s,
				markerCol: i,
				isEmpty: u
			};
		}
		var _t = 0;
		function xa(e, t, r, n) {
			var a = 0, i = t;
			for (_t = 0; i < r && a < n;) {
				var o = e.charCodeAt(i);
				if (o === m) {
					var A = 4 - a % 4;
					if (a + A > n) {
						_t = a + A - n, i++, a = n;
						break;
					}
					a += A;
				} else if (o === E) a++;
				else break;
				i++;
			}
			return i;
		}
		function Ma(e, t, r, n) {
			var a = Ae(e, t), i = Gr(e, t, a);
			if (!i) return null;
			var o = [], A = t, C = i.contentCol, l = "", _ = i.isEmpty, c = !1, R = !1;
			if (!i.isEmpty) {
				for (var d = !1, s = i.contentStart; s < a; s++) if (e.charCodeAt(s) === m) {
					d = !0;
					break;
				}
				if (d) {
					var g = "", u = Ya(e, t, i.contentStart), f = u - i.contentCol;
					if (f > 0) for (var h = 0; h < f; h++) g += " ";
					for (var T = i.contentStart; T < a; T++) if (e.charCodeAt(T) === m) {
						for (var S = 4 - u % 4, w = 0; w < S; w++) g += " ";
						u += S;
					} else g += e[T], u++;
					l = `${g}
`;
				} else l = `${e.slice(i.contentStart, a)}
`;
			}
			for (A = Q(e, a); A < e.length;) {
				var H = Ae(e, A);
				Ne(e, A, H);
				var k = e.charCodeAt(A + te);
				if (oe < C && (k === F || k === Ee || k === He) && oe <= 3 && Wr(e, A)) break;
				var N = Gr(e, A, H);
				if (N && N.ordered === i.ordered && N.marker === i.marker && N.markerCol < C) {
					o.push({
						contentCol: C,
						raw: l,
						hasBlankAfter: c,
						isEmpty: _
					}), c && (R = !0), C = N.contentCol, _ = N.isEmpty, c = !1, l = N.isEmpty ? "" : `${e.slice(N.contentStart, H)}
`, A = Q(e, H);
					continue;
				}
				if (Ze(e, A, H)) {
					var p = xa(e, A, H, C);
					if (_t > 0 || p < H) {
						for (var y = "", B = 0; B < _t; B++) y += " ";
						l += `${y + e.slice(p, H)}
`;
					} else l += `
`;
					A = Q(e, H);
					for (var x = !1, P = 0; P < l.length; P++) {
						var L = l.charCodeAt(P);
						if (L !== O && L !== $r && L !== E && L !== m) {
							x = !0;
							break;
						}
					}
					if (_ && !x) if (A < e.length) {
						var M = Ae(e, A), D = Gr(e, A, M);
						if (!D || D.ordered !== i.ordered || D.marker !== i.marker) break;
						c = !0;
					} else break;
					if (A < e.length) {
						var I = Ae(e, A);
						Ne(e, A, I);
						var Z = e.charCodeAt(A + te);
						if ((Z === F || Z === Ee || Z === He) && oe <= 3 && Wr(e, A)) break;
						var ee = Gr(e, A, I);
						if (ee && ee.ordered === i.ordered && ee.marker === i.marker && ee.markerCol < C) {
							c = !0;
							continue;
						}
						if (!Ze(e, A, I) && oe < C) break;
					}
					continue;
				}
				if (oe >= C) {
					var ve = xa(e, A, H, C);
					if (_t > 0) {
						for (var V = "", Le = C, Ce = 0; Ce < _t; Ce++) V += " ", Le++;
						for (var b = ve; b < H; b++) if (e.charCodeAt(b) === m) {
							for (var X = 4 - Le % 4, ke = 0; ke < X; ke++) V += " ";
							Le += X;
						} else V += e[b], Le++;
						l += `${V}
`;
					} else l += `${e.slice(ve, H)}
`;
					A = Q(e, H);
					continue;
				}
				for (var G = !1, fe = 0; fe < l.length; fe++) {
					var ue = l.charCodeAt(fe);
					if (ue !== O && ue !== $r && ue !== E && ue !== m) {
						G = !0;
						break;
					}
				}
				if (!c && G && !_) {
					var Ar = A + te, se = e.charCodeAt(Ar);
					if (!(se === rr || se === U || se === ae || se === re || se === be || (se === F || se === Ee || se === He || se === Lr) && (Wr(e, A) != null || Gr(e, A, H) != null) || se >= W && se <= z && Gr(e, A, H) != null)) {
						l += `${e.slice(Ar, H)}
`, A = Q(e, H);
						continue;
					}
				}
				break;
			}
			if (o.push({
				contentCol: C,
				raw: l,
				hasBlankAfter: c,
				isEmpty: _
			}), o.length === 0) return null;
			var Y = R;
			if (!Y) for (var me = 0; me < o.length; me++) {
				if (o[me].hasBlankAfter && me < o.length - 1) {
					Y = !0;
					break;
				}
				if (!o[me].isEmpty) {
					for (var he = o[me].raw, de = he.length, Re = 0, Ge = !1, we = !1, Xe = !1, Fe = !1, Ve = 0, q = 0, ge = -1; Re < de;) {
						var j = he.indexOf(`
`, Re);
						if (j < 0 && (j = de), Fe) {
							Ne(he, Re, j);
							for (var ye = he.slice(Re + te, j), Ye = 0; Ye < ye.length && ye.charCodeAt(Ye) === Ve;) Ye++;
							Ye >= q && ye.slice(Ye).trim() === "" && (Fe = !1), Re = j < de ? j + 1 : de;
							continue;
						}
						if (Ze(he, Re, j)) {
							ge >= 0 ? Xe = !0 : Ge && (we = !0), Re = j < de ? j + 1 : de;
							continue;
						}
						if (Ne(he, Re, j), ge >= 0) {
							if (oe >= ge) {
								Re = j < de ? j + 1 : de;
								continue;
							}
							var cr = Gr(he, Re, j);
							if (cr && cr.markerCol < ge && cr.contentCol <= ge) {
								Re = j < de ? j + 1 : de;
								continue;
							}
							if (cr) {
								Re = j < de ? j + 1 : de;
								continue;
							}
							ge = -1, Xe && (we = !0, Xe = !1);
						}
						var kr = he.slice(Re + te, j), Rr = kr.charCodeAt(0);
						if ((Rr === re || Rr === be) && oe <= 3) {
							for (var qe = 0; qe < kr.length && kr.charCodeAt(qe) === Rr;) qe++;
							if (qe >= 3) {
								if (we && Ge) {
									Y = !0;
									break;
								}
								Fe = !0, Ve = Rr, q = qe, Ge = !0, Re = j < de ? j + 1 : de;
								continue;
							}
						}
						var mr = oe <= 3 ? Gr(he, Re, j) : null;
						if (mr && Ge) {
							if (we) {
								Y = !0;
								break;
							}
							ge = mr.contentCol, Xe = !1, Re = j < de ? j + 1 : de, Ge = !0;
							continue;
						}
						if (we) {
							Y = !0;
							break;
						}
						Ge = !0, Re = j < de ? j + 1 : de;
					}
					if (Y) break;
				}
			}
			for (var wr = [], ne = 0; ne < o.length; ne++) {
				for (var Hr = o[ne], $e = Hr.raw, je = $e.length; je > 0 && $e.charCodeAt(je - 1) === O;) je--;
				var Je = je < $e.length ? $e.slice(0, je) : $e, Qr = null;
				if (Je.length >= 3 && Je.charCodeAt(0) === _e) {
					var xr = Je[1];
					(xr === " " || xr === "x" || xr === "X") && Je.charCodeAt(2) === We && (Qr = {
						type: v.gfmTask,
						completed: xr === "x" || xr === "X"
					}, Je = Je.slice(3));
				}
				var Te;
				if (Hr.isEmpty && Je.trim() === "") Te = [];
				else if (Y) {
					var Vr = r.inList;
					r.inList = !0;
					var mt = r.f;
					r.f = mt || ne !== o.length - 1, Te = zr(Je, r, n), r.f = mt, r.inList = Vr;
				} else {
					var br = r.inList;
					r.inList = !0;
					var Yr = r.f;
					if (r.f = Yr || ne !== o.length - 1, Te = zr(Je, r, n), r.f = Yr, r.inList = br, Te.length === 1 && Te[0].type === v.paragraph) Te = Te[0].children;
					else if (r.q) {
						var Mr = [];
						r.q.push({
							src: Te,
							dest: Mr,
							unwrap: !0
						}), Te = Mr;
					} else {
						for (var hr = [], Ue = 0; Ue < Te.length; Ue++) if (Te[Ue].type === v.paragraph) for (var sr = Te[Ue].children, ot = 0; ot < sr.length; ot++) hr.push(sr[ot]);
						else hr.push(Te[Ue]);
						Te = hr;
					}
				}
				if (Qr) {
					var qr = [Qr, {
						type: v.text,
						text: " "
					}];
					if (r.q) r.q.push({
						src: Te,
						dest: qr,
						unwrap: !1
					});
					else for (var ur = 0; ur < Te.length; ur++) qr.push(Te[ur]);
					wr.push(qr);
				} else wr.push(Te);
			}
			return {
				node: {
					type: i.ordered ? v.orderedList : v.unorderedList,
					start: i.ordered ? i.start : void 0,
					items: wr
				},
				end: A
			};
		}
		var Wt = /* @__PURE__ */ new Set([
			"address",
			"article",
			"aside",
			"base",
			"basefont",
			"blockquote",
			"body",
			"caption",
			"center",
			"col",
			"colgroup",
			"dd",
			"details",
			"dialog",
			"dir",
			"div",
			"dl",
			"dt",
			"fieldset",
			"figcaption",
			"figure",
			"footer",
			"form",
			"frame",
			"frameset",
			"h1",
			"h2",
			"h3",
			"h4",
			"h5",
			"h6",
			"head",
			"header",
			"hr",
			"html",
			"iframe",
			"legend",
			"li",
			"link",
			"main",
			"menu",
			"menuitem",
			"nav",
			"noframes",
			"ol",
			"optgroup",
			"option",
			"p",
			"param",
			"search",
			"section",
			"summary",
			"table",
			"tbody",
			"td",
			"tfoot",
			"th",
			"thead",
			"title",
			"tr",
			"track",
			"ul"
		]);
		function Sr(e, t, r) {
			let n = {};
			for (let [o, A] of Object.entries(e)) {
				let C = o.toLowerCase();
				if (C === "style" && typeof A == "string") {
					let l = {}, _ = [], c = 0, R = 0;
					for (let s = 0; s < A.length; s++) {
						let g = A.charCodeAt(s);
						g === nr ? c++ : g === ar ? c-- : g === vt && c === 0 && (_.push(A.slice(R, s)), R = s + 1);
					}
					R < A.length && _.push(A.slice(R));
					let d = !1;
					_.forEach((s) => {
						let g = s.indexOf(":");
						if (g === -1) return;
						let u = s.slice(0, g).trim(), f = s.slice(g + 1).trim();
						if (u && f) {
							if (/url\s*\(\s*(javascript|vbscript|data:(?!image\/))/i.test(f)) {
								d = !0;
								return;
							}
							let h = u.indexOf("-") === -1 ? u : u.replace(/-([a-z])/g, (T, S) => S.toUpperCase());
							l[h] = f;
						}
					}), !d && Object.keys(l).length > 0 && (n[o] = l);
				} else if ((C === "href" || C === "src") && r?.sanitizer) {
					let l = r.sanitizer(A, t, C);
					l != null && (n[o] = l);
				} else if (A === "") n[o] = !0;
				else if (A.length >= 2 && A.charCodeAt(0) === Or && A.charCodeAt(A.length - 1) === Mt) {
					var a = A.slice(1, -1);
					if (a.length > 0) {
						var i = a.charCodeAt(0);
						if (i === _e || i === Or) try {
							n[o] = JSON.parse(a);
							continue;
						} catch {}
					}
					if (a === "true") {
						n[o] = !0;
						continue;
					}
					if (a === "false") {
						n[o] = !1;
						continue;
					}
					if (r?.evalUnserializableExpressions) try {
						n[o] = (0, eval)(`(${a})`);
						continue;
					} catch {}
					n[o] = a;
				} else n[o] = A;
			}
			return n;
		}
		function Ur(e, t, r) {
			let n = t.length;
			if (n === 0) return r;
			var a = t.charCodeAt(0);
			if (!(a >= J && a <= K || a >= ie && a <= le)) {
				for (var o = String.fromCharCode(a), A = e.length - n, C = r; C <= A;) {
					var l = e.indexOf(o, C);
					if (l === -1 || l > A) return -1;
					for (var _ = !0, c = 1; c < n; c++) {
						var R = e.charCodeAt(l + c), d = t.charCodeAt(c);
						if (R >= J && R <= K && (R += ir), d >= J && d <= K && (d += ir), R !== d) {
							_ = !1;
							break;
						}
					}
					if (_) return l;
					C = l + 1;
				}
				return -1;
			}
			a >= J && a <= K && (a += ir);
			for (let g = r; g <= e.length - n; g++) {
				var s = e.charCodeAt(g);
				if (s >= J && s <= K && (s += ir), s !== a) continue;
				let u = !0;
				for (let f = 1; f < n; f++) {
					let h = e.charCodeAt(g + f), T = t.charCodeAt(f);
					if (h >= J && h <= K && (h += ir), T >= J && T <= K && (T += ir), h !== T) {
						u = !1;
						break;
					}
				}
				if (u) return g;
			}
			return -1;
		}
		function Yi(e, t, r) {
			let n = t.length;
			var a = t.charCodeAt(0);
			a >= J && a <= K && (a += ir);
			for (let o = Math.min(r, e.length - n); o >= 0; o--) {
				var i = e.charCodeAt(o);
				if (i >= J && i <= K && (i += ir), i !== a) continue;
				let A = !0;
				for (let C = 1; C < n; C++) {
					let l = e.charCodeAt(o + C), _ = t.charCodeAt(C);
					if (l >= J && l <= K && (l += ir), _ >= J && _ <= K && (_ += ir), l !== _) {
						A = !1;
						break;
					}
				}
				if (A) return o;
			}
			return -1;
		}
		var zt = -1;
		function Nn(e, t, r) {
			let n = r.toLowerCase(), a = `<${n}`, i = `</${n}`, o = 1, A = t, C = e.length;
			for (zt = -1; A < C && o > 0;) {
				let c = Ur(e, a, A), R = Ur(e, i, A);
				if (R === -1) return -1;
				if (c !== -1 && c < R) {
					let d = Er(e, c);
					d ? (d.tag.toLowerCase() === n && !d.g && !d.n && !Jr(d.tag) && o++, A = d.end) : A = c + 1;
				} else {
					var l = R + i.length, _ = l < C ? e.charCodeAt(l) : 62;
					if ((_ === U || _ === E || _ === m || _ === O) && (o--, o === 0)) {
						zt = R;
						let d = R + i.length;
						for (; d < C && e.charCodeAt(d) !== U;) d++;
						return d + 1;
					}
					A = R + 1;
				}
			}
			return -1;
		}
		function qa(e, t, r, n) {
			if (n.ignoreHTMLBlocks || n.disableParsingRawHTML) return null;
			var a = Ae(e, t);
			if (Ne(e, t, a), oe > 3 && !r.inHTML) return null;
			var i = t + te;
			if (e.charCodeAt(i) !== ae) return null;
			var o = e.indexOf(">", i + 1);
			if (o !== -1 && o < a) {
				var A = e.slice(i + 1, o);
				if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(A) || /^[^\s@]+@[^\s@]+$/.test(A)) return null;
			}
			var C = qi(e, i);
			if (C >= 1 && C <= 5) {
				var l = e.length;
				if (C === 1) {
					for (var _ = e.length, c = 0; c < vn.length; c++) {
						var R = Ur(e, `</${vn[c]}>`, i);
						R >= 0 && R < _ && (_ = R);
					}
					if (_ < e.length) {
						var d = e.indexOf(">", _);
						l = d >= 0 ? Q(e, d + 1) : e.length;
					}
				} else {
					var s = C === 2 ? "-->" : C === 3 ? "?>" : C === 4 ? ">" : "]]>", g = e.indexOf(s, i);
					g >= 0 && (l = Q(e, g + s.length));
				}
				var u = e.slice(i, l);
				if (C >= 2) return {
					node: {
						type: v.htmlComment,
						text: u,
						t: !1,
						raw: !0
					},
					end: l
				};
				var f = "div", h = u.match(/^<\/?([a-zA-Z][a-zA-Z0-9-]*)/);
				h && (f = h[1]);
				var T = Er(e, i), S = {}, w;
				T && !T.g && (S = Sr(T.attrs, f, n), w = T.h + T.b);
				var H = [], p = Ur(u, `</${f.toLowerCase()}`, 0), y = "", B, x, P;
				if (T?.g) {
					P = u.slice(0, T.end - i);
					for (var L = u.slice(T.end - i); L.length > 0 && L.charCodeAt(L.length - 1) === O;) L = L.slice(0, -1);
					L && (x = or(L));
				} else if (T && !T.g) {
					var M = T.end - i;
					if (p === -1) {
						for (var D = u; D.length > 0 && D.charCodeAt(D.length - 1) === O;) D = D.slice(0, -1);
						B = or(D);
					} else {
						var I = M;
						u.charCodeAt(I) === O && I++;
						for (var Z = p; Z > I;) {
							var ee = u.charCodeAt(Z - 1);
							if (ee !== E && ee !== m && ee !== O && ee !== $r) break;
							Z--;
						}
						var ve = u.slice(I, Z);
						ve && (x = or(ve));
						for (var V = u.slice(p); V.length > 0 && V.charCodeAt(V.length - 1) === O;) V = V.slice(0, -1);
						P = or(V), y = u.slice(M, p).trim();
					}
				}
				var Le = T ? T.g : !1;
				return {
					node: {
						type: v.htmlBlock,
						tag: f,
						attrs: S,
						b: w,
						children: H,
						e: x,
						i: P,
						j: B,
						text: y,
						c: !0,
						a: Le
					},
					end: l
				};
			}
			if (C === 6 || C === 7) {
				var Ce = pa(e, t), b = Ce < e.length ? Ce : e.length, X = e.slice(i, b), ke = Ce < e.length ? Q(e, Ce) : e.length, G = Er(e, i);
				if (G) {
					var fe = G.tag, ue = fe.toLowerCase();
					if (G.g) {
						var se = e.slice(G.end, b);
						return {
							node: {
								type: v.htmlBlock,
								tag: fe,
								attrs: {},
								children: [],
								i: e.slice(i, G.end),
								e: se ? or(se) : void 0,
								text: se,
								c: !0,
								a: !0
							},
							end: ke
						};
					}
					if (G.n || Jr(fe)) return {
						node: {
							type: v.htmlBlock,
							tag: fe,
							attrs: Sr(G.attrs, fe, n),
							b: G.h + G.b,
							children: [],
							text: "",
							c: !1,
							a: !1
						},
						end: G.end < e.length && e.charCodeAt(G.end) === O ? G.end + 1 : G.end
					};
					var De = r.d || 0, Y = e.slice(i, b), me = -1, he = -1, de = !1;
					if (De < 10) {
						for (var Re = `</${ue}`, Ge = G.end - i, we = 1, Xe = Ge; Xe < Y.length && we > 0;) {
							var Fe = Ur(Y, `<${ue}`, Xe), Ve = Ur(Y, Re, Xe);
							if (Ve === -1) break;
							if (Fe !== -1 && Fe < Ve) {
								var q = Fe + ue.length + 1;
								if (q < Y.length) {
									var ge = Y.charCodeAt(q);
									(ge === E || ge === m || ge === O || ge === U || ge === ce) && we++;
								}
								Xe = Fe + 1;
							} else {
								var j = Ve + Re.length;
								if (j < Y.length) {
									var ye = Y.charCodeAt(j);
									if ((ye === U || ye === E || ye === m || ye === O) && (we--, we === 0)) {
										me = Ve;
										for (var Ye = j; Ye < Y.length && Y.charCodeAt(Ye) !== U;) Ye++;
										he = Ye + 1;
										break;
									}
								} else if (we--, we === 0) {
									me = Ve, he = Y.length;
									break;
								}
								Xe = Ve + 1;
							}
						}
						if (me === -1 && !G.g && (C === 6 || G.u)) {
							var cr = Nn(e, G.end, ue);
							if (cr !== -1) {
								for (var kr = zt, Rr = G.end, qe = !1, mr = !1, wr = !1, ne = 0, Hr = !1, $e = !1, je = Rr; je < kr;) {
									var Je = e.charCodeAt(je);
									if (Je === O) $e && (qe = !0), Hr || ne++, $e = !0, je++;
									else if (Je === E || Je === m) je++;
									else {
										if (!Hr && (Hr = !0, ne >= 2 && Je === ae)) {
											wr = !0;
											break;
										}
										if ($e = !1, Je === ae) {
											var Qr = e.charCodeAt(je + 1) | 32;
											if ((Qr === xt || Qr === ln || Qr === et) && (Na.lastIndex = je, Na.test(e))) {
												mr = !0;
												break;
											}
										}
										je++;
									}
								}
								if (qe && !wr && !mr) {
									var xr = Ae(e, cr);
									b = xr, ke = Q(e, xr), Y = e.slice(i, b), X = e.slice(i, b), me = kr - i, he = cr - i, de = !0;
								}
							}
						}
					}
					var Te = G.b.indexOf(`
`) !== -1 || G.h.indexOf(`
`) !== -1, Vr = !1;
					if (me !== -1) Vr = Y.slice(he).trim().length === 0;
					var br = !1, Yr = b, Mr = ke;
					if (me !== -1) {
						var hr = i + he, Ue = Ae(e, hr - 1);
						if (hr < Ue) {
							for (var sr = hr; sr < Ue && (e.charCodeAt(sr) === E || e.charCodeAt(sr) === m);) sr++;
							if (sr < Ue && e.charCodeAt(sr) === ae) {
								var ot = Er(e, sr);
								ot && !ot.g && (br = !0, Yr = hr, Mr = hr, Vr = !0);
							}
						}
						if (!br) {
							var qr = Q(e, Ue);
							if (qr < b) {
								for (var ur = qr; ur < b && (e.charCodeAt(ur) === E || e.charCodeAt(ur) === m);) ur++;
								if (ur < b && e.charCodeAt(ur) === ae) Er(e, ur) && (br = !0, Yr = Ue, Mr = qr, Vr = !0);
							}
						}
						if (!br && r.inHTML) {
							br = !0, Yr = Ue, Mr = Q(e, Ue);
							Vr = e.slice(hr, Ue).trim().length === 0;
						}
					}
					var At = [], er = "";
					if (me !== -1) {
						er = Y.slice(G.end - i, me);
						var lt = er.trim();
						if (lt) {
							var { inline: ni, inHTML: ai, d: ii } = r;
							r.inHTML = !0, r.d = De + 1;
							if (ue === "p") r.inline = !0, At = ct(lt, !1, r, n);
							else {
								var Bn = er.indexOf(`

`) !== -1, Pn = hn.test(lt), qt = ka.test(lt), Ai = Bn || Pn || r.inHTML && qt;
								er.length >= 2 && er.charCodeAt(0) === O && er.charCodeAt(er.length - 1) === O && !Bn && !Pn && !qt ? At = [{
									type: v.text,
									text: lt
								}] : Ai || qt ? (r.inline = !1, At = zr(er, r, n)) : (r.inline = !0, At = ct(lt, !1, r, n));
							}
							r.inline = ni, r.inHTML = ai, r.d = ii;
						}
					}
					var Dn = !1;
					if (C === 6 && me !== -1 && !r.inHTML && !Te) {
						var Ci = /<[a-zA-Z][^>]*>/.test(er), fi = er.indexOf(`

`) !== -1 || hn.test(er);
						Ci && !fi && (Dn = !0);
					}
					if (!de && (r.inHTML || C === 7 || Te || !Vr || Dn)) {
						var ut, gr, Xn = !1;
						if (me !== -1 && br) {
							var Jn = !1;
							if (r.inHTML && he < Y.length) {
								for (var wt = he; wt < Y.length && Y.charCodeAt(wt) !== O;) wt++;
								var jt = Y.slice(he, wt).trim();
								Jn = jt.length > 1 && jt.charCodeAt(0) === ae && jt.charCodeAt(1) !== ce;
							}
							gr = Jn ? Y.slice(G.end - i) : er, Xn = !0;
						} else (C === 7 || r.inHTML) && me !== -1 ? (gr = Y.slice(G.end - i), gr.charCodeAt(0) === O && (gr = gr.slice(1))) : br ? ut = e.slice(i, Yr) : Te ? ut = X : (gr = Y.slice(G.end - i), gr.charCodeAt(0) === O && (gr = gr.slice(1)));
						var Kn = ut !== void 0, en = or(ut === void 0 ? gr || "" : ut), Gn = {
							type: v.htmlBlock,
							tag: fe,
							attrs: Sr(G.attrs, fe, n),
							b: G.h + G.b,
							children: At,
							e: Kn ? void 0 : en,
							j: Kn ? en : void 0,
							text: en,
							c: !0,
							a: !1
						};
						return Xn && (Gn.x = !0), {
							node: Gn,
							end: Mr
						};
					}
					var Fn = or(er);
					return {
						node: {
							type: v.htmlBlock,
							tag: fe,
							attrs: Sr(G.attrs, fe, n),
							b: G.h + G.b,
							children: At,
							e: de ? void 0 : Fn,
							text: Fn,
							c: !1,
							a: !1
						},
						end: Mr
					};
				}
				var bt = X.match(/^<(\/?)([a-zA-Z][a-zA-Z0-9-]*)/), di = bt ? bt[2] : "div", rn = bt ? bt[1] === "/" : !1, tn, Un, Wn, pt = "";
				if (rn) {
					var nn = X.indexOf(">");
					nn === -1 ? tn = X : (tn = X.slice(0, nn + 1), pt = X.slice(nn + 1), pt && (Un = or(pt)));
				} else Wn = or(X);
				return {
					node: {
						type: v.htmlBlock,
						tag: di,
						attrs: {},
						children: [],
						e: Un,
						i: tn,
						j: Wn,
						text: rn ? pt : X,
						c: !0,
						a: rn
					},
					end: ke
				};
			}
			var Me = Er(e, i);
			if (!Me) return null;
			var Br = Me.tag, an = Br.toLowerCase(), zn = Br.charCodeAt(0), It = zn >= J && zn <= K;
			if (!(It || Wt.has(an) || Nt.has(an) || an.includes("-"))) return null;
			if (Me.g) return {
				node: {
					type: v.htmlSelfClosing,
					tag: Br,
					attrs: {},
					i: e.slice(i, Me.end),
					a: !0
				},
				end: Me.end
			};
			var jr = Nn(e, Me.end, Br), Rt = [];
			if (jr !== -1) {
				var ci = zt, Lt = e.slice(Me.end, ci), Ot = Lt.trim();
				if (Ot) {
					var ui = Lt.indexOf(`

`) !== -1, Ri = hn.test(Ot), Hi = ka.test(Ot), { inline: hi, inHTML: si, d: gi } = r;
					r.inHTML = !0, r.d = (r.d || 0) + 1, ui || Ri || Hi ? (r.inline = !1, Rt = zr(Lt, r, n)) : (r.inline = !0, Rt = ct(Ot, !1, r, n)), r.inline = hi, r.inHTML = si, r.d = gi;
				}
				var $i = Ae(e, jr), on = e.slice(jr, $i).trim() ? jr : Q(e, jr), Zn = It ? e.slice(i, jr) : e.slice(i, on);
				return {
					node: {
						type: v.htmlBlock,
						tag: Br,
						attrs: Sr(Me.attrs, Br, n),
						b: Me.h + Me.b,
						children: Rt,
						j: or(Zn),
						text: It ? Lt : Zn,
						c: !0,
						a: !1
					},
					end: on
				};
			}
			var Ht = pa(e, Me.end), Ti = Ht < e.length ? Q(e, Ht) : Ht, An = e.slice(Me.end, Ht);
			if (An.trim()) {
				var { inline: Si, inHTML: Ei, d: Ni } = r;
				r.inline = !1, r.inHTML = !0, r.d = (r.d || 0) + 1, Rt = zr(An, r, n), r.inline = Si, r.inHTML = Ei, r.d = Ni;
			}
			var ki = e.slice(Me.end, Ht);
			return {
				node: {
					type: v.htmlBlock,
					tag: Br,
					attrs: Sr(Me.attrs, Br, n),
					b: Me.h + Me.b,
					children: Rt,
					e: or(ki),
					text: An,
					c: !0,
					a: !1
				},
				end: Ti
			};
		}
		function qi(e, t) {
			if (e.charCodeAt(t) !== ae) return 0;
			var r = t + 1, n = e.length;
			if (e.charCodeAt(r) === xe && e.charCodeAt(r + 1) === F && e.charCodeAt(r + 2) === F) return 2;
			if (e.charCodeAt(r) === rt) return 3;
			if (e.charCodeAt(r) === xe) {
				var a = e.charCodeAt(r + 1);
				if (a >= J && a <= K) return 4;
				if (e.slice(r + 1, r + 8) === "[CDATA[") return 5;
			}
			for (var i = e.charCodeAt(r) === ce, o = i ? r + 1 : r, A = o; A < n;) {
				var C = e.charCodeAt(A);
				if (C >= J && C <= K || C >= ie && C <= le || C >= W && C <= z || C === F) A++;
				else break;
			}
			if (A === o) return 0;
			var l = e.slice(o, A);
			if (Nt.has(l.toLowerCase())) {
				if (i) return 0;
				var _ = e.charCodeAt(A);
				return _ === E || _ === m || _ === U || _ === O || A >= n ? 1 : 0;
			}
			if (Wt.has(l.toLowerCase())) {
				if (i) {
					for (var c = A; c < n && (e.charCodeAt(c) === E || e.charCodeAt(c) === m);) c++;
					return c < n && e.charCodeAt(c) === U ? 6 : 0;
				}
				var R = A < n ? e.charCodeAt(A) : -1;
				return R === E || R === m || R === U || R === O || R === ce || R === -1 ? 6 : 0;
			}
			if (i) {
				for (var d = A; d < n && (e.charCodeAt(d) === E || e.charCodeAt(d) === m);) d++;
				if (d < n && e.charCodeAt(d) === U) {
					var s = Ae(e, t);
					if (e.slice(d + 1, s).trim() === "") return 7;
				}
			} else {
				var u = Ae(e, t), f = Er(e, t);
				if (f && f.end <= u) {
					if (e.slice(f.end, u).trim() === "") return 7;
				}
			}
			return 0;
		}
		function Ba(e, t, r) {
			for (var n = 0, a = e.length; n < a && (e.charCodeAt(n) === E || e.charCodeAt(n) === m);) n++;
			for (; a > n && (e.charCodeAt(a - 1) === E || e.charCodeAt(a - 1) === m);) a--;
			n < a && e.charCodeAt(n) === pe && n++, a > n && e.charCodeAt(a - 1) === pe && (a - 2 < n || e.charCodeAt(a - 2) !== Se) && a--;
			for (var i = [], o = n, A = !1, C = [], l = n; l < a;) {
				var _ = e.charCodeAt(l);
				if (_ === Se && l + 1 < a) {
					e.charCodeAt(l + 1) === pe ? (A || (A = !0, C = []), C.push(e.slice(o, l)), C.push("|"), l += 2, o = l) : l += 2;
					continue;
				}
				if (_ === re) {
					for (var c = 0; l < a && e.charCodeAt(l) === re;) c++, l++;
					for (var R = !1; l < a && !R;) {
						for (var d = 0; l < a && e.charCodeAt(l) === re;) d++, l++;
						d === c ? R = !0 : d === 0 && l++;
					}
					continue;
				}
				if (_ === pe) {
					var s = A ? (C.push(e.slice(o, l)), C.join("")) : e.slice(o, l);
					i.push(s.trim()), l++, o = l, A = !1, C = [];
					continue;
				}
				l++;
			}
			var g = A ? (C.push(e.slice(o, a)), C.join("")) : e.slice(o, a);
			return i.push(g.trim()), i.map((u) => {
				var f = u.indexOf("\\|") === -1 ? u : u.replace(/\\\|/g, "|");
				return f ? ct(f, !1, t, r) : [];
			});
		}
		function Pa(e, t, r, n) {
			let a = Ae(e, t);
			var i = e.indexOf("|", t);
			if (i < 0 || i >= a) return null;
			let o = Q(e, a);
			if (o >= e.length) return null;
			let A = Ae(e, o);
			if (!Za(e, o, A)) return null;
			let C = e.slice(t, a), l = e.slice(o, A);
			for (var _ = [], c = 0, R = l.length; c < R && (l.charCodeAt(c) === E || l.charCodeAt(c) === m);) c++;
			for (c < R && l.charCodeAt(c) === pe && c++; c < R;) {
				for (; c < R && (l.charCodeAt(c) === E || l.charCodeAt(c) === m);) c++;
				if (c >= R || l.charCodeAt(c) === pe) break;
				var d = l.charCodeAt(c) === Oe;
				for (d && c++; c < R && l.charCodeAt(c) === F;) c++;
				var s = c < R && l.charCodeAt(c) === Oe;
				for (s && c++, _.push(d && s ? "center" : s ? "right" : d ? "left" : null); c < R && (l.charCodeAt(c) === E || l.charCodeAt(c) === m);) c++;
				c < R && l.charCodeAt(c) === pe && c++;
			}
			let g = Ba(C, r, n);
			if (_.length !== g.length) return null;
			let u = [], f = Q(e, A);
			for (; f < e.length;) {
				let k = Ae(e, f), N = e.slice(f, k);
				if (Ze(e, f, k)) break;
				if (Ne(e, f, k), oe < 4) {
					var h = e.charCodeAt(f + te);
					if (h === U || h === rr || (h === F || h === Ee || h === He) && Wr(e, f)) break;
					if (h === re || h === be) {
						for (var T = f + te, S = 0; T < k && e.charCodeAt(T) === h;) S++, T++;
						if (S >= 3) break;
					}
				}
				u.push(Ba(N, r, n)), f = Q(e, k);
			}
			if (n.optimizeForStreaming && u.length === 0) return null;
			for (var w = g.length, H = 0; H < u.length; H++) if (u[H].length < w) for (; u[H].length < w;) u[H].push([]);
			else u[H].length > w && (u[H].length = w);
			return {
				node: {
					type: v.table,
					header: g,
					cells: u,
					align: _
				},
				end: f
			};
		}
		function ji(e, t, r) {
			if (Ne(e, t, Ae(e, t)), oe > 3) return null;
			var a = t + te;
			if (e.charCodeAt(a) !== _e) return null;
			if (a + 1 < e.length && e.charCodeAt(a + 1) === lr) return eo(e, a, r) || null;
			r.refs || (r.refs = Object.create(null));
			var o = Qa(e, a, r.refs);
			return o === null ? null : {
				node: { type: v.refCollection },
				end: o
			};
		}
		function eo(e, t, r) {
			var n = e.length;
			if (e.charCodeAt(t) !== _e || t + 1 >= n || e.charCodeAt(t + 1) !== lr) return null;
			for (var a = t + 2, i = a; a < n && e.charCodeAt(a) !== We;) {
				if (e.charCodeAt(a) === O) return null;
				a++;
			}
			if (a >= n) return null;
			var o = `^${e.slice(i, a)}`.toLowerCase();
			if (a++, a >= n || e.charCodeAt(a) !== Oe) return null;
			for (a++; a < n && (e.charCodeAt(a) === E || e.charCodeAt(a) === m);) a++;
			if (a < n && e.charCodeAt(a) === O) for (a++; a < n && (e.charCodeAt(a) === E || e.charCodeAt(a) === m);) a++;
			var A = e.indexOf(`
`, a);
			A < 0 && (A = n);
			for (var C = e.slice(a, A).trim(), l = A < n ? A + 1 : n; l < n;) {
				var _ = Ae(e, l);
				if (Ne(e, l, _), oe >= 2 && !Ze(e, l, _)) C += `
${e.slice(l, _)}`, l = Q(e, _);
				else if (Ze(e, l, _)) {
					var c = Q(e, _);
					if (c < n) {
						if (Ne(e, c, Ae(e, c)), oe >= 2) {
							C += `
`, l = Q(e, _);
							continue;
						}
					}
					break;
				} else break;
			}
			var d = r.refs;
			return d && !d[o] && (d[o] = {
				target: C,
				title: void 0
			}), {
				node: { type: v.footnote },
				end: l
			};
		}
		function ro(e, t, r, n) {
			let a = t, i = 0, o = 0, A = -1;
			for (; a < e.length;) {
				let P = A >= 0 ? A : Ae(e, a);
				if (A = -1, Ze(e, a, P)) break;
				if (Ne(e, a, P), oe < 4 && o > 0 && !r.l) {
					let M = e.charCodeAt(a + te);
					if (M === tr || M === F) {
						let D = a + te;
						for (; D < P && e.charCodeAt(D) === M;) D++;
						for (; D < P && (e.charCodeAt(D) === E || e.charCodeAt(D) === m);) D++;
						if (D >= P) {
							i = M === tr ? 1 : 2, a = Q(e, P);
							break;
						}
					}
				}
				o = P;
				let L = Q(e, P);
				if (L < e.length) {
					if (e.charCodeAt(L) === Bt) {
						var C = Ae(e, L);
						a = Q(e, C), o = C;
						continue;
					}
					let M = Ae(e, L);
					if (A = M, Ne(e, L, M), oe < 4) {
						let D = e.charCodeAt(L + te);
						if (D === U) {
							a = L;
							break;
						}
						if (D === rr) {
							for (var l = L + te, _ = 0; l < M && e.charCodeAt(l) === rr && _ <= 6;) _++, l++;
							if (_ >= 1 && _ <= 6 && (l >= M || e.charCodeAt(l) === E || e.charCodeAt(l) === m)) {
								a = L;
								break;
							}
						}
						if (D === re || D === be) {
							for (var c = L + te, R = 0; c < M && e.charCodeAt(c) === D;) R++, c++;
							if (R >= 3) {
								a = L;
								break;
							}
						}
						if (D === ae) {
							var d = L + te + 1, s = d < M ? e.charCodeAt(d) : 0, g = s === xe || s === rt;
							if (!g && s === ce) {
								for (var u = d + 1, f = u; f < M && (e.charCodeAt(f) >= J && e.charCodeAt(f) <= K || e.charCodeAt(f) >= ie && e.charCodeAt(f) <= le || e.charCodeAt(f) >= W && e.charCodeAt(f) <= z || e.charCodeAt(f) === F);) f++;
								f > u && (g = Wt.has(e.slice(u, f).toLowerCase()));
							} else if (!g) {
								for (var h = d; h < M && (e.charCodeAt(h) >= J && e.charCodeAt(h) <= K || e.charCodeAt(h) >= ie && e.charCodeAt(h) <= le || e.charCodeAt(h) >= W && e.charCodeAt(h) <= z || e.charCodeAt(h) === F);) h++;
								if (h > d) {
									var T = e.slice(d, h).toLowerCase();
									g = Wt.has(T) || Nt.has(T);
								}
							}
							if (g && qa(e, L, r, n)) {
								a = L;
								break;
							}
						}
						if (D === F || D === Ee || D === Lr) {
							let I = L + te + 1;
							if (I < M && (e.charCodeAt(I) === E || e.charCodeAt(I) === m)) {
								if (St(e, I, M) < M && !Wr(e, L)) {
									a = L;
									break;
								}
							}
						}
						if (D >= W && D <= z) {
							let I = L + te;
							for (; I < M && e.charCodeAt(I) >= W && e.charCodeAt(I) <= z;) I++;
							if (I < M && (e.charCodeAt(I) === ze || e.charCodeAt(I) === ar) && I - (L + te) === 1 && e.charCodeAt(L + te) === 49) {
								var w = I + 1;
								if (w < M && (e.charCodeAt(w) === E || e.charCodeAt(w) === m)) {
									if (St(e, w, M) < M) {
										a = L;
										break;
									}
								}
							}
						}
						if (D === pe) {
							let I = Q(e, M);
							if (I < e.length) {
								if (Za(e, I, Ae(e, I))) {
									a = L;
									break;
								}
							}
						}
						if ((D === F || D === Ee || D === He) && Wr(e, L)) {
							if (D !== F) {
								a = L;
								break;
							}
							let I = 0, Z = L + te;
							for (; Z < M && e.charCodeAt(Z) === F;) I++, Z++;
							for (; Z < M && (e.charCodeAt(Z) === E || e.charCodeAt(Z) === m);) Z++;
							if (Z < M) {
								a = L;
								break;
							}
						}
					}
				}
				a = Q(e, P);
			}
			for (var k = i ? o : a; k > t && (e.charCodeAt(k - 1) === O || e.charCodeAt(k - 1) === $r || e.charCodeAt(k - 1) === E || e.charCodeAt(k - 1) === m);) k--;
			for (var N = t; N < k && (e.charCodeAt(N) === E || e.charCodeAt(N) === m);) N++;
			if (N >= k) return null;
			for (var p = !1, y = N; y < k; y++) if (e.charCodeAt(y) === Bt) {
				p = !0;
				break;
			}
			var B = p ? e.slice(N, k).replace(/\u001E/g, "") : e.slice(N, k);
			if (!B) return null;
			let x = ct(B, !0, r, n);
			return i ? {
				node: {
					type: v.heading,
					level: i,
					children: x,
					id: ""
				},
				end: a
			} : {
				node: {
					type: v.paragraph,
					children: x
				},
				end: a
			};
		}
		function ct(e, t, r, n) {
			var a = r.o;
			if (!a) {
				var i = r.k;
				r.k = t;
				var o = Nr(e, 0, e.length, r, n);
				return r.k = i, o;
			}
			var A = [];
			return a.push({
				dest: A,
				text: e,
				breaks: t,
				inline: r.inline,
				inAnchor: r.inAnchor,
				inHTML: r.inHTML,
				htmlDepth: r.d,
				inList: r.inList,
				inBlockQuote: r.inBlockQuote,
				noSetext: r.l,
				depth: r.p,
				notAtEdge: r.f
			}), A;
		}
		function to(e, t, r) {
			if (e.charCodeAt(t) !== re) return null;
			let n = Zr(e, t, r, 96), a = t + n;
			for (; a < r;) {
				let i = e.indexOf("`", a);
				if (i < 0 || i >= r) return null;
				let o = Zr(e, i, r, 96);
				if (o === n) {
					let A = e.slice(t + n, i);
					return A.indexOf(`
`) !== -1 && (A = A.replace(/\n/g, " ")), A.length > 0 && A[0] === " " && A.at(-1) === " " && A.trim().length > 0 && (A = A.slice(1, -1)), {
						node: {
							type: v.codeInline,
							text: A
						},
						end: i + o
					};
				}
				a = i + o;
			}
			return null;
		}
		function Ln(e, t, r) {
			if (e.charCodeAt(t) !== re) return t;
			let n = Zr(e, t, r, 96), a = t + n;
			for (; a < r;) {
				let i = e.indexOf("`", a);
				if (i < 0 || i >= r) return t;
				let o = Zr(e, i, r, 96);
				if (o === n) return i + o;
				a = i + o;
			}
			return t;
		}
		function no(e, t, r) {
			if (e.charCodeAt(t) !== ae) return t;
			if (t + 1 < r && e.charCodeAt(t + 1) === ce) {
				let l = t + 2;
				for (; l < r && e.charCodeAt(l) !== U;) l++;
				return l < r ? l + 1 : t;
			}
			if (t + 3 < r && e.charCodeAt(t + 1) === xe && e.charCodeAt(t + 2) === F && e.charCodeAt(t + 3) === F) {
				let l = e.indexOf("-->", t + 4);
				return l >= 0 ? l + 3 : t;
			}
			let n = t + 1, a = n;
			for (; n < r;) {
				let l = e.charCodeAt(n);
				if (l >= J && l <= K || l >= ie && l <= le || l >= W && l <= z || l === F) n++;
				else break;
			}
			if (n === a) return t;
			let i = e.slice(a, n).toLowerCase(), o = !1;
			for (; n < r;) {
				let l = e.charCodeAt(n);
				if (l === U) {
					n++;
					break;
				}
				if (l === ce && n + 1 < r && e.charCodeAt(n + 1) === U) {
					n += 2, o = !0;
					break;
				}
				if (l === Ir || l === Dr) {
					var A = l;
					for (n++; n < r && e.charCodeAt(n) !== A;) n++;
					n < r && n++;
					continue;
				}
				if (l === O) return t;
				n++;
			}
			if (o || Jr(i)) return n;
			let C = 1;
			for (; n < r && C > 0;) if (e.charCodeAt(n) === ae) if (n + 1 < r && e.charCodeAt(n + 1) === ce) {
				let l = n + 2, _ = l;
				for (; _ < r && (e.charCodeAt(_) >= J && e.charCodeAt(_) <= K || e.charCodeAt(_) >= ie && e.charCodeAt(_) <= le);) _++;
				if (e.slice(l, _).toLowerCase() === i) {
					for (; _ < r && e.charCodeAt(_) !== U;) _++;
					if (_ < r && _++, C--, C === 0) return _;
				}
				n = _;
			} else {
				let l = n + 1, _ = l;
				for (; _ < r && (e.charCodeAt(_) >= J && e.charCodeAt(_) <= K || e.charCodeAt(_) >= ie && e.charCodeAt(_) <= le);) _++;
				e.slice(l, _).toLowerCase() === i && C++, n++;
			}
			else n++;
			return n;
		}
		function ao(e, t, r, n, a) {
			if (e.charCodeAt(t) !== be || t + 1 >= r || e.charCodeAt(t + 1) !== be) return null;
			let i = t + 2;
			for (; i + 1 < r;) {
				let o = e.charCodeAt(i);
				if (o === re) {
					let A = Ln(e, i, r);
					if (A > i) {
						i = A;
						continue;
					}
				}
				if (o === be && e.charCodeAt(i + 1) === be) {
					let A = e.slice(t + 2, i), C = Nr(A, 0, A.length, n, a);
					return {
						node: {
							type: v.textFormatted,
							tag: "del",
							children: C
						},
						end: i + 2
					};
				}
				o === Se && i + 1 < r && i++, i++;
			}
			return null;
		}
		function io(e, t, r, n, a) {
			if (e.charCodeAt(t) !== tr || t + 1 >= r || e.charCodeAt(t + 1) !== tr) return null;
			let i = t + 2;
			for (; i + 1 < r;) {
				let o = e.charCodeAt(i);
				if (o === re) {
					let A = Ln(e, i, r);
					if (A > i) {
						i = A;
						continue;
					}
				}
				if (o === tr && e.charCodeAt(i + 1) === tr && i > t + 2) {
					let A = e.slice(t + 2, i), C = Nr(A, 0, A.length, n, a);
					return {
						node: {
							type: v.textFormatted,
							tag: "mark",
							children: C
						},
						end: i + 2
					};
				}
				o === Se && i + 1 < r && i++, i++;
			}
			return null;
		}
		function Zt(e, t, r) {
			return e < Ct ? !!(In(e) & nt) : da.test(t[r]);
		}
		function Qt(e, t, r) {
			return e < Ct ? !!(In(e) & Xr) : ca.test(t[r]);
		}
		function oo(e, t, r) {
			var n = e.charCodeAt(t);
			if (n !== Ee && n !== He) return null;
			var a = Zr(e, t, r, n);
			if (a === 0) return null;
			var i = t > 0 ? e.charCodeAt(t - 1) : 32, o = t + a < r ? e.charCodeAt(t + a) : 32, A = Qt(i, e, t - 1), C = Qt(o, e, t + a), l = t > 0 ? Zt(i, e, t - 1) : !1, _ = t + a < r ? Zt(o, e, t + a) : !1, c = !C && (!_ || A || l), R = !A && (!l || C || _), d, s;
			return n === Ee ? (d = c, s = R) : (d = c && (!R || l), s = R && (!c || _)), {
				len: a,
				canOpen: d,
				canClose: s
			};
		}
		function Ao(e, t, r, n, a) {
			if (t.length !== 0) {
				for (var i = e.length, o = Array(i), A = null, C = null, l = 0; l < i; l++) {
					var _ = {
						node: e[l],
						prev: C,
						next: null
					};
					C ? C.next = _ : A = _, o[l] = _, C = _;
				}
				for (var c = Array(t.length), R = 0; R < t.length; R++) c[R] = o[t[R].idx];
				for (var d = [], s = 0; s < 12; s++) d[s] = -1;
				for (var g = 0; g < t.length;) {
					var u = t[g];
					if (!(u.active && u.canClose)) {
						g++;
						continue;
					}
					for (var h = (u.ch === Ee ? 0 : 1) * 6 + u.len % 3 * 2 + (u.canOpen ? 1 : 0), T = d[h] === void 0 ? -1 : d[h], S = -1, w = g - 1; w > T; w--) {
						var H = t[w];
						if (!(!H.active || H.ch !== u.ch || !H.canOpen) && !((u.canOpen || H.canClose) && (H.len + u.len) % 3 === 0 && H.len % 3 !== 0)) {
							S = w;
							break;
						}
					}
					if (S < 0) {
						d[h] = g - 1, !u.canOpen && (u.active = !1), g++;
						continue;
					}
					var k = t[S], N = k.len >= 2 && u.len >= 2, p = N ? 2 : 1;
					k.len -= p, u.len -= p;
					var y = c[S], B = c[g], x = y.node, P = B.node;
					x.text = x.text.slice(0, x.text.length - p), P.text = P.text.slice(p);
					for (var L = [], M = y.next; M && M !== B;) L.push(M.node), M = M.next;
					var I = {
						node: {
							type: v.textFormatted,
							tag: N ? "strong" : "em",
							children: L
						},
						prev: y,
						next: B
					};
					y.next = I, B.prev = I;
					for (var Z = S + 1; Z < g; Z++) t[Z].active = !1;
					if (k.len === 0 && (k.active = !1, x.text === "")) {
						var ee = y.prev;
						I.prev = ee, ee ? ee.next = I : A = I;
					}
					if (u.len === 0) {
						if (u.active = !1, P.text === "") {
							var ve = B.next;
							I.next = ve, ve && (ve.prev = I);
						}
					} else continue;
					g++;
				}
				if (r) for (var V = 0; V < r.length; V++) {
					var Le = t[r[V]];
					Le.active && Le.len > 0 && (c[r[V]].node.text = "");
				}
				for (var Ce = 0, b = A; b;) {
					var X = b.node;
					if (X.type === v.text) {
						var ke = X;
						if (ke.text === "") {
							b = b.next;
							continue;
						}
						if (Ce > 0 && e[Ce - 1].type === v.text) {
							e[Ce - 1].text += ke.text, b = b.next;
							continue;
						}
					}
					e[Ce++] = X, b = b.next;
				}
				e.length = Ce;
			}
		}
		function Jt(e, t, r, n) {
			return t(e, r, n) === null ? null : e;
		}
		var Da = 0;
		var kn = 0;
		var Xa = 0;
		var mn = 0;
		var Ja = 0;
		var wn = 0;
		var sn = 0;
		var _r = 0;
		function lo() {
			return sn === 2147483647 && (kn = 0, mn = 0, wn = 0, Ut = 0, sn = 0), ++sn;
		}
		var gn = null;
		var Ut = 0;
		var Kt = [];
		var $n = 256;
		function Ka(e, t, r, n, a) {
			let i = e.charCodeAt(t) === xe, o = i ? t + 1 : t;
			if (e.charCodeAt(o) !== _e || mn === _r && o >= Xa) return null;
			var A = Ut === _r ? gn : null, C = A === null ? 0 : A[o];
			if (C < 0) return null;
			var l = C;
			if (C === 0) {
				var _ = e.indexOf("]", o + 1);
				if (_ < 0 || _ >= r) return Xa = o, mn = _r, null;
				l = o + 1;
				var c = 0;
				Kt[c++] = o;
				for (var R = r - o >= $n; l < r && c > 0;) {
					var d = e.charCodeAt(l);
					if (d === Se && l + 1 < r) {
						l += 2;
						continue;
					}
					if (d === re) {
						var s = Ln(e, l, r);
						if (s > l) {
							l = s;
							continue;
						}
					}
					if (d === ae) {
						var g = On(e, l, r);
						if (g) {
							l = g.end;
							continue;
						}
						var u = no(e, l, r);
						if (u > l) {
							l = u;
							continue;
						}
					}
					if (d === _e) Kt[c++] = l;
					else if (d === We) {
						var f = Kt[--c];
						A === null && R && l - o >= $n && (A = gn = new Int32Array(r), Ut = _r), A !== null && (A[f] = l + 1);
					}
					l++;
				}
				if (c > 0) {
					if (A === null && R && l - o >= $n && (A = gn = new Int32Array(r), Ut = _r), A !== null) for (; c > 0;) A[Kt[--c]] = -1;
					return null;
				}
			}
			var h = l - 1, T = e.slice(o + 1, h), S = l < r ? e.charCodeAt(l) : 0, w = !1;
			if (S === nr) {
				var H = !0;
				for (l++; l < r && (e.charCodeAt(l) === E || e.charCodeAt(l) === O);) l++;
				var k = "", N = l;
				if (l < r && e.charCodeAt(l) === ae) {
					for (l++, N = l; N < r && e.charCodeAt(N) !== U;) {
						if (e.charCodeAt(N) === Se && N + 1 < r) {
							N += 2;
							continue;
						}
						if (e.charCodeAt(N) === O) {
							H = !1;
							break;
						}
						N++;
					}
					H && (N >= r || e.charCodeAt(N) !== U) && (H = !1), H && (k = e.slice(l, N), N++);
				} else if (H) {
					var p = kn === _r ? Da : -1;
					if (p >= 0 && l >= p) H = !1;
					else {
						for (var y = 0, B = !1; N < r;) {
							var x = e.charCodeAt(N);
							if (x === Se && N + 1 < r) {
								N += 2;
								continue;
							}
							if (x === nr) y++;
							else if (x === ar) {
								if (B = !0, y === 0) break;
								y--;
							} else if (x === E || x === O) break;
							N++;
						}
						N >= r && !B && (p < 0 || l < p) && (Da = l, kn = _r), k = e.slice(l, N);
					}
				}
				if (H) {
					for (l = N; l < r && (e.charCodeAt(l) === E || e.charCodeAt(l) === O);) l++;
					var P;
					if (l < r) {
						var L = e.charCodeAt(l);
						if (L === Ir || L === Dr || L === nr) {
							var M = L === nr ? 41 : L;
							l++;
							for (var D = l; l < r && e.charCodeAt(l) !== M;) e.charCodeAt(l) === Se && l + 1 < r && l++, l++;
							l >= r ? H = !1 : (P = e.slice(D, l), l++);
						}
					}
					if (H) {
						for (; l < r && (e.charCodeAt(l) === E || e.charCodeAt(l) === O);) l++;
						(l >= r || e.charCodeAt(l) !== ar) && (H = !1);
					}
				}
				if (H) {
					if (l++, k = vr(dt(k)), P !== void 0 && (P = vr(dt(P))), i) {
						var Z = Vt(Nr(T, 0, T.length, n, a));
						return {
							node: {
								type: v.image,
								target: Jt(k, a?.sanitizer || Cr, "img", "src"),
								alt: Z,
								title: P
							},
							end: l
						};
					}
					var ee = n.inAnchor;
					n.inAnchor = !0;
					var G = ee ? [{
						type: v.text,
						text: T
					}] : Nr(T, 0, T.length, n, a);
					return n.inAnchor = ee, !n.inAnchor && bn(G) ? null : {
						node: {
							type: v.link,
							target: Jt(k, a?.sanitizer || Cr, "a", "href"),
							title: P,
							children: G
						},
						end: l
					};
				}
				l = h + 1, w = !0;
			}
			var ve = "", V = l;
			if (!w && S === _e) {
				var Le = l + 1;
				V = Le;
				for (var Ce = !1; V < r && e.charCodeAt(V) !== We;) {
					if (e.charCodeAt(V) === Se && V + 1 < r) {
						V += 2;
						continue;
					}
					if (e.charCodeAt(V) === _e) {
						Ce = !0;
						break;
					}
					V++;
				}
				if (Ce || V >= r) return null;
				var b = e.slice(Le, V);
				if (b.trim()) ve = Gt(b);
				else {
					if (ba(T)) return null;
					ve = Gt(T);
				}
				V += 1;
			} else {
				if (ba(T)) return null;
				ve = Gt(T);
			}
			var X = n.refs?.[ve];
			if (!X) return null;
			if (i) return {
				node: {
					type: v.image,
					target: Jt(X.target, a?.sanitizer || Cr, "img", "src"),
					alt: Vt(Nr(T, 0, T.length, n, a)),
					title: X.title
				},
				end: V
			};
			var ke = n.inAnchor;
			n.inAnchor = !0;
			var G = ke ? [{
				type: v.text,
				text: T
			}] : Nr(T, 0, T.length, n, a);
			return n.inAnchor = ke, !n.inAnchor && bn(G) ? null : {
				node: {
					type: v.link,
					target: Jt(X.target, a?.sanitizer || Cr, "a", "href"),
					title: X.title,
					children: G
				},
				end: V
			};
		}
		function On(e, t, r) {
			if (e.charCodeAt(t) !== ae) return null;
			for (var n = t + 1; n < r;) {
				var a = e.charCodeAt(n);
				if (a === U) break;
				if (a === E || a === O || a === $r || a === ae) return null;
				n++;
			}
			if (n >= r || e.charCodeAt(n) !== U) return null;
			var i = e.slice(t + 1, n);
			return i.match(/^([a-zA-Z][a-zA-Z0-9+.-]{1,31}):([^\x00-\x20]*)$/) ? {
				node: {
					type: v.link,
					target: i,
					title: void 0,
					children: [{
						type: v.text,
						text: i
					}]
				},
				end: n + 1
			} : i.indexOf("@") !== -1 && /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(i) ? {
				node: {
					type: v.link,
					target: `mailto:${i}`,
					title: void 0,
					children: [{
						type: v.text,
						text: i
					}]
				},
				end: n + 1
			} : null;
		}
		function Co(e, t, r, n) {
			if (e.charCodeAt(t) !== _e || t + 1 >= r || e.charCodeAt(t + 1) !== lr || wn === _r && t >= Ja) return null;
			let a = t + 2;
			for (; a < r && e.charCodeAt(a) !== We && e.charCodeAt(a) !== O;) a++;
			if (a >= r) return Ja = t, wn = _r, null;
			if (e.charCodeAt(a) !== We) return null;
			let i = e.slice(t + 2, a);
			return i ? {
				node: {
					type: v.footnoteReference,
					target: `#${Tr(i)}`,
					text: i
				},
				end: a + 1
			} : null;
		}
		function fo(e, t, r, n) {
			if (n.disableBareUrls) return null;
			var a = "", i = !1, o = e.charCodeAt(t);
			if (o === $t || o === 72 ? t + 8 <= r && e.charCodeAt(t + 1) === et && e.charCodeAt(t + 2) === et && e.charCodeAt(t + 3) === xt && (e.charCodeAt(t + 4) === ln && e.charCodeAt(t + 5) === Oe && e.charCodeAt(t + 6) === ce && e.charCodeAt(t + 7) === ce ? a = "https://" : e.charCodeAt(t + 4) === Oe && e.charCodeAt(t + 5) === ce && e.charCodeAt(t + 6) === ce && (a = "http://")) : o === pr || o === 70 ? t + 6 <= r && e.charCodeAt(t + 1) === et && e.charCodeAt(t + 2) === xt && e.charCodeAt(t + 3) === Oe && e.charCodeAt(t + 4) === ce && e.charCodeAt(t + 5) === ce && (a = "ftp://") : (o === Pr || o === 87) && t + 4 <= r && e.charCodeAt(t + 1) === Pr && e.charCodeAt(t + 2) === Pr && e.charCodeAt(t + 3) === ze && (a = "www.", i = !0), !a) return null;
			let A = t + a.length;
			for (; A < r;) {
				let H = e.charCodeAt(A);
				if (H === E || H === O || H === m || H === $r || H === ae || H === U) break;
				A++;
			}
			for (var C = 0, l = 0, _ = t; _ < A; _++) {
				var c = e.charCodeAt(_);
				c === nr ? C++ : c === ar && l++;
			}
			let R = A;
			for (; R > t + a.length;) {
				let H = e.charCodeAt(R - 1);
				if (H === ze || H === Yn || H === Oe || H === xe || H === rt || H === ar || H === Ee || H === He || H === be) {
					if (H === ar) {
						if (C >= l) break;
						l--;
					}
					R--;
				} else if (H === vt) {
					for (var d = R - 2; d > t && (e.charCodeAt(d) >= J && e.charCodeAt(d) <= K || e.charCodeAt(d) >= ie && e.charCodeAt(d) <= le || e.charCodeAt(d) >= W && e.charCodeAt(d) <= z);) d--;
					d >= t && e.charCodeAt(d) === st ? R = d : R--;
				} else break;
			}
			if (R <= t + a.length) return null;
			var s = t + (i ? 4 : a.length), g = e.indexOf("/", s);
			if ((g < 0 || g > R) && (g = R), i && e.indexOf(".", s) === -1) return null;
			for (var u = -1, f = -1, h = g - 1; h >= s; h--) if (e.charCodeAt(h) === ze) if (u < 0) u = h;
			else {
				f = h;
				break;
			}
			for (var h = f >= 0 ? f + 1 : s; h < g; h++) if (e.charCodeAt(h) === He) return null;
			var S = e.slice(t, R), w = i ? `http://${S}` : S;
			return {
				node: {
					type: v.link,
					target: w,
					title: void 0,
					children: [{
						type: v.text,
						text: S
					}]
				},
				end: R
			};
		}
		function _o(e, t, r, n) {
			if (n.disableBareUrls) return null;
			for (var a = t, i = a; a < r;) {
				var o = e.charCodeAt(a);
				if (o >= J && o <= K || o >= ie && o <= le || o >= W && o <= z || o === ze || o === xe || o === rr || o === 36 || o === ht || o === st || o === Dr || o === Ee || o === Lr || o === ce || o === tr || o === rt || o === lr || o === He || o === re || o === Or || o === pe || o === Mt || o === be || o === F) a++;
				else break;
			}
			if (a === i || a >= r || e.charCodeAt(a) !== yt) return null;
			a++;
			for (var A = a, C = -1, l = a; a < r;) {
				var o = e.charCodeAt(a);
				if (o >= J && o <= K || o >= ie && o <= le || o >= W && o <= z) a++;
				else if ((o === F || o === He) && a > A) a++;
				else if (o === ze) {
					if (a === A) break;
					var _ = e.charCodeAt(a - 1);
					if (_ === F || _ === He || a - l > 63) break;
					if (a + 1 < r) {
						var c = e.charCodeAt(a + 1);
						if (c >= J && c <= K || c >= ie && c <= le || c >= W && c <= z) C = a, l = a + 1, a++;
						else break;
					} else break;
				} else break;
			}
			if (a - l > 63 || C < 0) return null;
			var R = e.charCodeAt(a - 1);
			if (!(R >= J && R <= K || R >= ie && R <= le || R >= W && R <= z) || a <= C + 1) return null;
			for (var d = -1, s = C - 1; s >= A; s--) if (e.charCodeAt(s) === ze) {
				d = s;
				break;
			}
			for (var s = d >= 0 ? d + 1 : A; s < a; s++) if (e.charCodeAt(s) === He) return null;
			var u = e.slice(t, a);
			return {
				node: {
					type: v.link,
					target: `mailto:${u}`,
					title: void 0,
					children: [{
						type: v.text,
						text: u
					}]
				},
				end: a
			};
		}
		function bn(e) {
			for (var t = 0; t < e.length; t++) if (e[t].type === v.link || "children" in e[t] && Array.isArray(e[t].children) && bn(e[t].children)) return !0;
			return !1;
		}
		function Vt(e, t) {
			for (var r = "", n = 0; n < e.length; n++) {
				var a = e[n];
				a.type === v.text ? r += a.text : a.type === v.breakLine ? r += " " : a.type === v.codeInline || a.type === v.footnoteReference ? r += a.text : "children" in a && Array.isArray(a.children) ? r += Vt(a.children, t) : !t && a.type === v.image && (r += a.alt || "");
			}
			return r;
		}
		function pn(e, t, r) {
			for (var n = 0; n < e.length; n++) {
				var a = e[n];
				if (a.type === v.heading) {
					var i = a;
					i.id = Ui(r(Vt(i.children, !0)), t);
				}
				if ("children" in a) {
					var o = a.children;
					Array.isArray(o) && pn(o, t, r);
				}
				if ((a.type === v.orderedList || a.type === v.unorderedList) && Array.isArray(a.items)) for (var A = a.items, C = 0; C < A.length; C++) pn(A[C], t, r);
			}
		}
		function Fr(e) {
			return {
				type: v.text,
				text: e
			};
		}
		function co(e, t, r) {
			var n = t + 1;
			if (n >= r) return -1;
			if (e.charCodeAt(n) === rr) {
				n++;
				var a = n < r && (e.charCodeAt(n) === Cn || e.charCodeAt(n) === fn);
				a && n++;
				for (var i = n, o = a ? 6 : 7; n < r && n - i <= o;) {
					var A = e.charCodeAt(n);
					if (!(A >= W && A <= z || a && (A >= J && A <= gt || A >= ie && A <= pr))) break;
					n++;
				}
				return n === i || n - i > o ? -1 : n < r && e.charCodeAt(n) === vt ? n + 1 : -1;
			}
			for (var l = n; n < r && n - l < 48;) {
				var _ = e.charCodeAt(n);
				if (_ >= J && _ <= K || _ >= ie && _ <= le || _ >= W && _ <= z) {
					n++;
					continue;
				}
				break;
			}
			return n === l ? -1 : n < r && e.charCodeAt(n) === vt ? n + 1 : -1;
		}
		function uo(e, t, r, n, a) {
			if (e.charCodeAt(t) !== ae) return null;
			var i = t + 1;
			if (i >= r) return null;
			var o = e.charCodeAt(i);
			if (o === xe && i + 1 < r && e.charCodeAt(i + 1) === F && i + 2 < r && e.charCodeAt(i + 2) === F) {
				var A = i + 3;
				if (A < r && e.charCodeAt(A) === U) return {
					node: {
						type: v.htmlComment,
						text: "",
						t: !0
					},
					end: A + 1
				};
				if (A + 1 < r && e.charCodeAt(A) === F && e.charCodeAt(A + 1) === U) return {
					node: {
						type: v.htmlComment,
						text: "-",
						t: !0
					},
					end: A + 2
				};
				var C = e.indexOf("-->", A);
				return C !== -1 && C <= r - 3 ? {
					node: {
						type: v.htmlComment,
						text: e.slice(t + 4, C),
						t: !1
					},
					end: C + 3
				} : null;
			}
			if (o === rt) {
				var l = e.indexOf("?>", i + 1);
				return l !== -1 && l < r ? {
					node: {
						type: v.htmlSelfClosing,
						tag: "?",
						attrs: {},
						m: e.slice(t, l + 2),
						a: !1
					},
					end: l + 2
				} : null;
			}
			if (o === xe && i + 1 < r) {
				var _ = e.charCodeAt(i + 1);
				if (_ === _e && e.slice(i + 1, i + 8) === "[CDATA[") {
					var c = e.indexOf("]]>", i + 8);
					return c !== -1 && c < r ? {
						node: {
							type: v.htmlSelfClosing,
							tag: "![CDATA[",
							attrs: {},
							m: e.slice(t, c + 3),
							a: !1
						},
						end: c + 3
					} : null;
				}
				if (_ >= J && _ <= K) {
					var R = e.indexOf(">", i + 2);
					return R !== -1 && R < r ? {
						node: {
							type: v.htmlSelfClosing,
							tag: `!${e.slice(i + 1, R)}`,
							attrs: {},
							m: e.slice(t, R + 1),
							a: !1
						},
						end: R + 1
					} : null;
				}
			}
			if (o === ce) {
				var d = i + 1;
				if (d >= r) return null;
				var s = e.charCodeAt(d);
				if (!(s >= J && s <= K || s >= ie && s <= le)) return null;
				for (d++; d < r;) {
					var g = e.charCodeAt(d);
					if (g >= J && g <= K || g >= ie && g <= le || g >= W && g <= z || g === F) d++;
					else break;
				}
				for (; d < r && (e.charCodeAt(d) === E || e.charCodeAt(d) === m || e.charCodeAt(d) === O);) d++;
				if (d < r && e.charCodeAt(d) === U) {
					var u = e.slice(i + 1, d).trim();
					return {
						node: {
							type: v.htmlSelfClosing,
							tag: u,
							attrs: {},
							i: e.slice(t, d + 1),
							a: !0
						},
						end: d + 1
					};
				}
				return null;
			}
			if (!(o >= J && o <= K || o >= ie && o <= le)) return null;
			var f = Er(e, t);
			if (!f) return null;
			var h = f.tag, T = h.toLowerCase();
			if (f.n || Jr(h)) return {
				node: {
					type: v.htmlSelfClosing,
					tag: h,
					attrs: Sr(f.attrs, h, a),
					m: f.r ? Tn(f) : e.slice(t, f.end),
					a: !1
				},
				end: f.end
			};
			var w = Nt.has(T), H = Nn(e.slice(0, r), f.end, h);
			if (H === -1) return {
				node: {
					type: v.htmlSelfClosing,
					tag: h,
					attrs: Sr(f.attrs, h, a),
					m: f.r ? Tn(f) : e.slice(t, f.end),
					a: !1
				},
				end: f.end
			};
			var k = Yi(e, `</${T}`, H), N = e.slice(f.end, k);
			if (w) {
				var p = or(N);
				return {
					node: {
						type: v.htmlBlock,
						tag: h,
						attrs: Sr(f.attrs, h, a),
						b: f.h + f.b,
						children: [],
						e: p || void 0,
						i: e.slice(k, H),
						text: p,
						c: !0,
						a: !1
					},
					end: H
				};
			}
			var y = [], B = N.trim();
			if (B) {
				var { inAnchor: x, inline: P, k: L } = n;
				T === "a" && (n.inAnchor = !0), n.k = !1;
				B.indexOf(`

`) !== -1 || /^#{1,6}\s/.test(B) ? (n.inline = !1, y = zr(B, n, a)) : y = Nr(B, 0, B.length, n, a), n.inAnchor = x, n.inline = P, n.k = L;
			}
			return {
				node: {
					type: v.htmlBlock,
					tag: h,
					attrs: Sr(f.attrs, h, a),
					b: f.b,
					children: y,
					text: or(N),
					c: !1,
					a: !1
				},
				end: H
			};
		}
		function Ro(e) {
			if (e.indexOf("[") === -1) return e;
			for (var t = e.length, r = new Int32Array(t).fill(-1), n = [], a = 0; a < t; a++) {
				var i = e.charCodeAt(a);
				if ((i === _e || i === We) && (a === 0 || e.charCodeAt(a - 1) !== Se)) if (i === _e) n.push(a);
				else {
					var o = n.pop();
					o !== void 0 && (r[o] = a);
				}
			}
			var A = [], C = t;
			for (a = 0; a < C; a++) if (!(e.charCodeAt(a) !== _e || a > 0 && e.charCodeAt(a - 1) === Se)) {
				var l = a > 0 && e.charCodeAt(a - 1) === xe, _ = r[a];
				if (_ >= 0) {
					var c = _ + 1;
					if (c < C) {
						var R = e.charCodeAt(c);
						if (R !== nr && R !== _e) {
							A.push(a), a = _;
							continue;
						}
						for (var d = R === nr ? ar : We, s = c + 1; s < C && e.charCodeAt(s) !== d;) s++;
						if (s < C) {
							a = s;
							continue;
						}
					}
				}
				if (l) {
					C = a - 1;
					var g = A.pop();
					if (g !== void 0 && r[g] === C - 1) {
						a = g - 1;
						continue;
					}
					break;
				}
				r[a] = -2, _ >= 0 && (C = _);
			}
			var u = "", f = 0;
			for (a = 0; a < C; a++) r[a] === -2 && (u += e.slice(f, a), f = a + 1);
			return u + e.slice(f, C);
		}
		var Ho = 200;
		var ft = 0;
		function Nr(e, t, r, n, a) {
			if (ft++, ft > Ho) return ft--, [{
				type: v.text,
				text: e.slice(t, r)
			}];
			var i = _r;
			_r = lo();
			let o = n;
			var A = a.optimizeForStreaming === !0 && ft === 1 && !n.f;
			if (A) {
				let b = e.slice(t, r), X = b, ke = 0, G = -1;
				for (let ue = 0; ue < b.length; ue++) b.charCodeAt(ue) === re && (ke++, G = ue);
				if (ke % 2 === 1 && G !== -1) {
					let ue = !1, Ar = -1, se = 0;
					for (; se < b.length;) b.charCodeAt(se) === re && (ue ? (ue = !1, Ar = -1) : (Ar = se, ue = !0)), se++;
					ue && Ar !== -1 && (b = b.slice(0, Ar));
				}
				b = Ro(b);
				let fe = b.match(/<([A-Z][A-Za-z0-9]*)(?:\s[^>]*)?>([^<]*)$/);
				if (fe && fe.index !== void 0) {
					var C = fe[0].length - fe[2].length;
					if (!(C >= 2 && fe[0].charCodeAt(C - 2) === ce)) {
						for (var _ = !1, c = 0, R = 0; R < fe.index; R++) b.charCodeAt(R) === re && c++;
						if (_ = c % 2 === 1, !_) {
							let ue = fe[1];
							Ur(b, `</${ue}`, 0) === -1 && (b = b.slice(0, fe.index) + fe[2]);
						}
					}
				}
				b !== X && (e = e.slice(0, t) + b, r = t + b.length);
			}
			let d = [];
			var s = [], g = null;
			let u = t;
			var f = "", h = a.disableAutoLink || a.disableBareUrls || o.inAnchor ? -1 : e.indexOf("@", t);
			for (h >= r && (h = -1); t < r;) {
				let b = e.charCodeAt(t), X = null;
				if (b === re) {
					if (X = to(e, t, r), !X) {
						var T = Zr(e, t, r, re);
						t += T - 1;
					}
				} else if (b === Ee || b === He) {
					var S = oo(e, t, r);
					if (S) {
						var w = !1;
						if (A) {
							var H = t + S.len, k = t > 0 ? e.charCodeAt(t - 1) : E, N = t === 0 || Qt(k, e, t - 1);
							if (S.canOpen) {
								var p = e.charCodeAt(H);
								w = N || Zt(k, e, t - 1) || Qt(p, e, H) || Zt(p, e, H);
							} else w = H === r && N;
						}
						if (w && (g === null && (g = []), g.push(s.length)), S.canOpen || S.canClose || w) {
							(f || t > u) && (d.push(Fr(f + e.slice(u, t))), f = "");
							var B = Fr(e.slice(t, t + S.len));
							s.push({
								idx: d.length,
								ch: b,
								len: S.len,
								canOpen: S.canOpen,
								canClose: S.canClose,
								active: !0
							}), d.push(B), t += S.len, u = t;
							continue;
						}
						t += S.len - 1;
					}
				} else if (b === be) {
					if (X = ao(e, t, r, o, a), !X && A && t + 1 < r && e.charCodeAt(t + 1) === be) {
						(f || t > u) && (d.push(Fr(f + e.slice(u, t))), f = ""), t += 2, u = t;
						continue;
					}
				} else if (b === tr) X = io(e, t, r, o, a);
				else if (b === _e) t + 1 < r && e.charCodeAt(t + 1) === lr && (X = Co(e, t, r, o)), X || (X = Ka(e, t, r, o, a));
				else if (b === xe && t + 1 < r && e.charCodeAt(t + 1) === _e) X = Ka(e, t, r, o, a);
				else if (b === ae) X = On(e, t, r), !(X || a.disableParsingRawHTML || a.ignoreHTMLBlocks) && (X = uo(e, t, r, o, a));
				else if (b === st) {
					var x = co(e, t, r);
					if (x !== -1) {
						var P = e.slice(t, x), L = vr(P);
						if (L !== P) {
							f = f + e.slice(u, t) + L, t = x, u = x;
							continue;
						}
					}
				} else if ((b === $t || b === Pr || b === pr) && !o.inAnchor && !a.disableAutoLink && (t === 0 || e.charCodeAt(t - 1) !== ae)) {
					var M = t + 1 < r ? e.charCodeAt(t + 1) : 0;
					(b === $t && M === et || b === pr && M === et || b === Pr && M === Pr) && (X = fo(e, t, r, a));
				}
				if (!X && h >= 0 && h - t <= 64 && !o.inAnchor && !a.disableAutoLink && !a.disableBareUrls && (b >= J && b <= K || b >= ie && b <= le || b >= W && b <= z) && (X = _o(e, t, r, a), !X && t >= h && (h = e.indexOf("@", t + 1), h >= r && (h = -1))), b === O && o.k) {
					var D = !1, I = 0;
					if (t > u && e.charCodeAt(t - 1) === Se) D = !0, I = 1;
					else {
						for (var Z = 0, ee = t - 1; ee >= u && e.charCodeAt(ee) === E;) Z++, ee--;
						Z >= 2 && (D = !0, I = Z);
					}
					if (D) {
						for ((f || t - I > u) && (d.push(Fr(f + e.slice(u, t - I))), f = ""), d.push({ type: v.breakLine }), t++; t < r && e.charCodeAt(t) === E;) t++;
						u = t;
						continue;
					}
					var ve = t > u && e.charCodeAt(t - 1) === E, V = t + 1 < r && e.charCodeAt(t + 1) === E;
					if (ve || V) {
						for (var Le = t; Le > u && e.charCodeAt(Le - 1) === E;) Le--;
						for (f += `${e.slice(u, Le)}
`, t++; t < r && e.charCodeAt(t) === E;) t++;
						u = t;
						continue;
					}
				}
				if (X) (f || t > u) && (d.push(Fr(f + e.slice(u, t))), f = ""), d.push(X.node), t = X.end, u = t;
				else {
					if (b === Se && t + 1 < r) {
						if (In(e.charCodeAt(t + 1)) & nt) {
							(f || t > u) && (d.push(Fr(f + e.slice(u, t))), f = ""), d.push(Fr(e[t + 1])), t += 2, u = t;
							continue;
						}
					}
					if (t++, h < 0 || h - t > 64) for (; t < r && !(h >= 0 && h - t <= 64);) {
						var Ce = e.charCodeAt(t);
						if (Ce < Ct && !Ua[Ce]) t++;
						else break;
					}
				}
			}
			return (f || r > u) && (d.push(Fr(f + e.slice(u, r))), f = ""), s.length > 0 && Ao(d, s, g, n, a), _r = i, ft--, d;
		}
		var ho = 500;
		function zr(e, t, r) {
			var n = t.p || 0;
			if (n > ho) return [{
				type: v.text,
				text: e
			}];
			t.p = n + 1;
			if (r.optimizeForStreaming && !(t.f || t.w)) {
				for (var i = e.length; i > 0 && e.charCodeAt(i - 1) === O;) i--;
				for (var o = i; o > 0 && e.charCodeAt(o - 1) !== O;) o--;
				if (i > o && e.charCodeAt(o) === pe) {
					for (var A = !1, C = o + 1; C < i; C++) {
						var l = e.charCodeAt(C);
						if (l !== E && l !== m && l !== pe && l !== Oe && l !== F) {
							A = !0;
							break;
						}
					}
					for (var _ = !1, c = !1, R = 0, d = o, s = o - 1; s > 0;) {
						for (var g = s; g > 0 && e.charCodeAt(g - 1) !== O;) g--;
						if (e.charCodeAt(g) !== pe) break;
						d = g;
						for (var u = !0, f = !1, h = g; h < s; h++) {
							var T = e.charCodeAt(h);
							if (T === F) f = !0;
							else if (T !== E && T !== m && T !== Oe && T !== pe) {
								u = !1;
								break;
							}
						}
						u && f ? (_ = !0, c = !0) : c || R++, s = g - 1;
					}
					A ? _ || (e = e.slice(0, o).trimEnd()) : e = _ && R > 0 ? e.slice(0, o).trimEnd() : e.slice(0, d).trimEnd();
				}
				for (var S = -1, w = -1, H = -1, k = !1, N = e.length - 1; N >= 0; N--) if (e.charCodeAt(N) === ae) {
					for (var p = N + 1 < e.length ? e.charCodeAt(N + 1) : 0, y = p >= J && p <= K || p >= ie && p <= le, B = p === ce && N + 2 < e.length && (e.charCodeAt(N + 2) >= J && e.charCodeAt(N + 2) <= K || e.charCodeAt(N + 2) >= ie && e.charCodeAt(N + 2) <= le), x = p === xe || p === rt, P = e.length; P > N + 1 && e.charCodeAt(P - 1) === O;) P--;
					var L = N + 1 >= P;
					if ((y || B || x || L) && !(y && On(e, N, e.length))) {
						var M = N + 1;
						if ((B || y) && (M = N + 2), y || B) for (; M < e.length;) {
							var D = e.charCodeAt(M);
							if (D >= J && D <= K || D >= ie && D <= le || D >= W && D <= z) M++;
							else break;
						}
						for (var I = y || B ? M : N + 2; I < e.length && e.charCodeAt(I) !== U;) I++;
						if (I >= e.length) S = N, k = !0;
						else if (y && e.charCodeAt(I - 1) !== ce && !Jr(e.slice(N + 1, M))) {
							for (var Z = !1, ee = I + 1; ee < e.length; ee++) if (e.charCodeAt(ee) === ae) {
								Z = !0;
								break;
							}
							Z || (S = N, w = M, H = I + 1);
						}
					}
					break;
				}
				if (S >= 0) {
					for (var ve = 0, V = 0; V < S; V++) e.charCodeAt(V) === re && ve++;
					if (ve % 2 === 0) if (k) e = e.slice(0, S);
					else {
						var Le = e.slice(S + 1, w);
						Ur(e, `</${Le}`, 0) === -1 && (e = e.slice(0, S) + e.slice(H));
					}
				}
				for (var Ce = e.length; Ce > 0 && e.charCodeAt(Ce - 1) === O;) Ce--;
				if (Ce > 0) {
					for (var b = Ce; b > 0 && e.charCodeAt(b - 1) !== O;) b--;
					for (var X = b, ke = 0; X < Ce && e.charCodeAt(X) === E && ke < 3;) X++, ke++;
					if (b > 0 && X < Ce && zi(e, X, Ce)) {
						for (var G = b - 1, fe = G; fe > 0 && e.charCodeAt(fe - 1) !== O;) fe--;
						Ze(e, fe, G) || (e = e.slice(0, b).trimEnd());
					}
				}
				var ue = e.length;
				if (ue > 0) {
					for (var Ar = e.lastIndexOf(`
`), se = Ar === -1 ? 0 : Ar + 1, De = ue, Y = se, me = 0; Y < De && e.charCodeAt(Y) === E && me < 3;) Y++, me++;
					if (Y < De) {
						var he = e.charCodeAt(Y), de = !1;
						if (he === Ee || he === F || he === Lr) {
							var Re = Y + 1;
							if (Re >= De || e.charCodeAt(Re) === E || e.charCodeAt(Re) === m) {
								for (var Ge = Re; Ge < De && (e.charCodeAt(Ge) === E || e.charCodeAt(Ge) === m);) Ge++;
								Ge >= De && (de = !0);
							}
						} else if (he >= W && he <= z) {
							for (var we = Y; we < De && e.charCodeAt(we) >= W && e.charCodeAt(we) <= z;) we++;
							if (we < De && (e.charCodeAt(we) === ze || e.charCodeAt(we) === ar)) {
								var Xe = we + 1;
								if (Xe >= De || e.charCodeAt(Xe) === E || e.charCodeAt(Xe) === m) {
									for (var Fe = Xe; Fe < De && (e.charCodeAt(Fe) === E || e.charCodeAt(Fe) === m);) Fe++;
									Fe >= De && (de = !0);
								}
							}
						}
						de && (e = e.slice(0, se).trimEnd());
					}
				}
			}
			if (t.inline) return Nr(e, 0, e.length, t, r);
			let Ve = [], q = 0, ge = e.length;
			if (q === 0 && !r.disableFrontmatter && e.startsWith("---")) {
				let ne = Ca(e);
				if (ne?.hasValidYaml) {
					if (r.preserveFrontmatter !== !1) {
						let Hr = e.slice(0, ne.endPos).trimEnd();
						Ve.push({
							type: v.frontmatter,
							text: Hr
						});
					}
					q = ne.endPos;
				}
			}
			for (; q < ge;) {
				for (var j = e.indexOf(`
`, q), ye = j < 0 ? ge : j; q < ge && Ze(e, q, ye);) q = ye < ge ? ye + 1 : ye, q < ge && (j = e.indexOf(`
`, q), ye = j < 0 ? ge : j);
				if (q >= ge) break;
				var Ye = e.charCodeAt(q) === Bt;
				Ne(e, q, ye);
				let ne = null;
				var cr = t.o ? t.o.length : 0;
				if (Sn = e, En = q, Ft = ye, !Ye && oe >= 4 && !t.inHTML) ne = Qi(e, q);
				else if (!Ye) {
					let Hr = q + te, $e = e.charCodeAt(Hr);
					$e === rr ? ne = Wi(e, q, t, r) : $e === U ? ne = Vi(e, q, t, r) : $e === re || $e === be ? ne = Zi(e, q, t) : $e === F || $e === Ee || $e === He ? (ne = Wr(e, q), !ne && (ne = Ma(e, q, t, r))) : $e === Lr || $e >= W && $e <= z ? ne = Ma(e, q, t, r) : $e === ae ? ne = qa(e, q, t, r) : $e === pe ? ne = Pa(e, q, t, r) : $e === _e && (ne = ji(e, q, t));
				}
				if (!ne) {
					for (var kr = !1, Rr = q; Rr < ye; Rr++) if (e.charCodeAt(Rr) === pe) {
						kr = !0;
						break;
					}
					kr && (ne = Pa(e, q, t, r));
				}
				if (ne || (ne = ro(e, q, t, r)), ne) {
					ne.node.type !== v.refCollection && Ve.push(ne.node);
					var qe = t.o;
					if (r.optimizeForStreaming && qe && qe.length > cr && !Va(e, ne.end, ge)) for (var mr = cr; mr < qe.length; mr++) qe[mr].notAtEdge = !0;
					q = ne.end;
				} else {
					var wr = e.indexOf(`
`, q);
					q = wr < 0 ? ge : wr + 1;
				}
			}
			return t.p = n, Ve;
		}
		function ja(e, t, r, n) {
			var a = Er(e, t);
			return a ? {
				tagName: a.tag,
				tagLower: a.tag.toLowerCase(),
				attrs: a.b,
				whitespaceBeforeAttrs: a.h,
				isSelfClosing: a.n,
				hasSpaceBeforeSlash: a.s,
				isClosing: a.g,
				hasNewline: a.h.includes(`
`) || a.b.includes(`
`),
				endPos: a.end
			} : null;
		}
		function kt(e, t, r) {
			ft = 0, e = ua(e), !t.refs && (t.refs = Object.create(null)), (r.optimizeForStreaming || t.inline) && (t.w = Fi(e, t.refs, r));
			var n, a;
			t.o || (t.o = n = [], t.q = a = []);
			let i = zr(e, t, r);
			if (n && a) {
				for (var o = n, A = {
					inline: t.inline,
					inAnchor: t.inAnchor,
					inHTML: t.inHTML,
					htmlDepth: t.d,
					inList: t.inList,
					inBlockQuote: t.inBlockQuote,
					noSetext: t.l,
					depth: t.p,
					notAtEdge: t.f
				}, C = 0; C < o.length; C++) {
					var l = o[C];
					t.inline = l.inline, t.inAnchor = l.inAnchor, t.inHTML = l.inHTML, t.d = l.htmlDepth, t.inList = l.inList, t.inBlockQuote = l.inBlockQuote, t.l = l.noSetext, t.p = l.depth, t.f = l.notAtEdge, t.k = l.breaks;
					var _ = Nr(l.text, 0, l.text.length, t, r);
					t.k = !1;
					for (var c = 0; c < _.length; c++) l.dest.push(_[c]);
				}
				t.inline = A.inline, t.inAnchor = A.inAnchor, t.inHTML = A.inHTML, t.d = A.htmlDepth, t.inList = A.inList, t.inBlockQuote = A.inBlockQuote, t.l = A.noSetext, t.p = A.depth, t.f = A.notAtEdge;
				for (var R = a, d = 0; d < R.length; d++) for (var s = R[d], g = 0; g < s.src.length; g++) {
					var u = s.src[g];
					if (s.unwrap && u.type === v.paragraph) for (var f = u.children, h = 0; h < f.length; h++) s.dest.push(f[h]);
					else s.dest.push(u);
				}
				t.o = void 0, t.q = void 0, pn(i, t, r.slugify);
			}
			return Dt(t.refs) ? [{
				type: v.refCollection,
				refs: t.refs
			}, ...i] : i;
		}
		var yn;
		try {
			it = react.createElement("div"), yn = it != null && typeof it == "object" && "$$typeof" in it && typeof it.$$typeof == "symbol" ? it.$$typeof : Symbol.for("react.transitional.element");
		} catch {
			yn = Symbol.for("react.transitional.element");
		}
		var it;
		function xn(e, t, r) {
			return {
				$$typeof: yn,
				type: e,
				key: r == null ? null : String(r),
				ref: null,
				props: t,
				_owner: null,
				_store: {},
				_debugStack: null,
				_debugTask: null
			};
		}
		function dr(e, t) {
			var r = { key: e };
			if (t) {
				var n = dn(t);
				for (var a in n) r[a] = n[a];
			}
			return r;
		}
		var Yt = typeof react.createContext > "u" ? void 0 : react.createContext(void 0);
		function ei(e, t, r, n, a, i, o, A, C) {
			switch (e.type) {
				case v.blockQuote: {
					let f = { key: r.key };
					return e.alert && (f.className = `markdown-alert-${i(e.alert.toLowerCase(), Tr)}`, e.children.unshift(Ha(e.alert))), n("blockquote", f, t(e.children, r));
				}
				case v.breakLine: return n("br", { key: r.key });
				case v.breakThematic: return n("hr", { key: r.key });
				case v.frontmatter: return A.preserveFrontmatter ? n("pre", { key: r.key }, e.text) : null;
				case v.codeBlock: {
					let f = e.lang ? vr(e.lang) : "";
					var l = e.attrs ? dn(e.attrs) : {};
					return l.className = f ? `language-${f} lang-${f}` : "", n("pre", { key: r.key }, n("code", l, e.text));
				}
				case v.codeInline: return n("code", { key: r.key }, e.text);
				case v.footnoteReference: return n("a", {
					key: r.key,
					href: a(e.target, "a", "href") || void 0
				}, n("sup", null, e.text));
				case v.gfmTask: return n("input", {
					checked: e.completed,
					key: r.key,
					readOnly: !0,
					type: "checkbox"
				});
				case v.heading: return n(`h${e.level}`, {
					id: e.id,
					key: r.key
				}, t(e.children, r));
				case v.htmlBlock: {
					let f = e;
					if (Kr(A) && Rn(f.tag)) {
						var _ = un(f);
						return _.kind === "literal" ? n("span", { key: r.key }, _.literal) : n("span", { key: r.key }, ...ga(_.open, f.children ? t(f.children, r) : null, _.close));
					}
					let h = f.j, T = h !== void 0, S = T ? h : f.a ? f.e || "" : (f.e || "") + (f.i || "");
					if (S && f.c) {
						let H = Wa(f.tag.toLowerCase()), k = f.children, N = k != null && k.length > 0;
						if (H) {
							let I = T ? h : f.e || "", Z = Kr(A) ? Hn(I) : I;
							if (/<[a-z][^>]{0,100}>/i.test(S)) {
								var c = dr(r.key, e.attrs);
								return c.dangerouslySetInnerHTML = { __html: Z }, C(e.tag, c);
							}
							return C(e.tag, dr(r.key, e.attrs), Z);
						}
						let p = new RegExp(`^<${f.tag}(\\s|>)`, "i");
						if (N && !p.test(S) && Kr(A) && Sa(S)) return C(e.tag, dr(r.key, e.attrs), t(k, r));
						if (za(S)) {
							let I = Kr(A) ? Hn(S) : S;
							var R = dr(r.key, e.attrs);
							return R.dangerouslySetInnerHTML = { __html: I }, C(e.tag, R);
						}
						let B = Et({
							slugify: A.slugify,
							sanitizer: a,
							tagfilter: !0
						}), x = Ra(S);
						if (new RegExp(`^<${f.tag}(\\s[^>]*)?>(\\s*</${f.tag}>)?$`, "i").test(x)) return f.children && f.children.length > 0 ? C(e.tag, dr(r.key, e.attrs), t(f.children, r)) : C(e.tag, dr(r.key, e.attrs));
						let L = kt(x, {
							inline: !1,
							refs: o,
							inHTML: !1
						}, B);
						cn(L);
						let M = f.tag.toLowerCase(), D = T;
						if (D && N) return C(e.tag, dr(r.key, e.attrs), t(k, r));
						if (D) return t(L.flatMap(at), r);
						var d = sa(L, M);
						if (d.found && d.afterClose.length > 0) {
							var s = d.beforeClose.flatMap(at), g = d.afterClose.flatMap(at);
							return xn(react.Fragment, { children: [C(e.tag, dr(r.key, e.attrs), t(s, r)), t(g, r)] }, r.key);
						}
						return C(e.tag, dr(r.key, e.attrs), t(L.flatMap(at), r));
					}
					return Jr(e.tag) ? C(e.tag, dr(r.key, e.attrs)) : C(e.tag, dr(r.key, e.attrs), e.children ? t(e.children, r) : "");
				}
				case v.htmlSelfClosing: {
					let f = e;
					if (Kr(A) && Rn(f.tag)) {
						var u = un(f);
						return n("span", { key: r.key }, u.kind === "literal" ? u.literal : u.open + (u.close || ""));
					}
					return C(e.tag, dr(r.key, e.attrs));
				}
				case v.image: {
					let f = e.target === null ? null : a(e.target, "img", "src");
					return n("img", {
						key: r.key,
						alt: e.alt && e.alt.length > 0 ? e.alt : void 0,
						title: e.title || void 0,
						src: f || void 0
					});
				}
				case v.link: {
					let f = { key: r.key };
					if (e.target != null) {
						let h = $a(e.target, a, "a", "href");
						h != null && (f.href = h);
					}
					return e.title && (f.title = e.title), n("a", f, t(e.children, r));
				}
				case v.table: {
					let f = e;
					return n("table", { key: r.key }, n("thead", { key: "thead" }, n("tr", null, f.header.map(function(T, S) {
						return n("th", {
							key: S,
							style: f.align[S] === null ? {} : { textAlign: f.align[S] }
						}, t(T, r));
					}))), f.cells.length > 0 && n("tbody", { key: "tbody" }, f.cells.map(function(T, S) {
						return n("tr", { key: S }, T.map(function(H, k) {
							return n("td", {
								key: k,
								style: f.align[k] === null ? {} : { textAlign: f.align[k] }
							}, t(H, r));
						}));
					})));
				}
				case v.text: return e.text;
				case v.textFormatted: return n(e.tag, { key: r.key }, t(e.children, r));
				case v.orderedList:
				case v.unorderedList: return n(e.type === v.orderedList ? "ol" : "ul", {
					key: r.key,
					start: e.type === v.orderedList ? e.start : void 0
				}, e.items.map(function(T, S) {
					return n("li", { key: S }, t(T, r));
				}));
				case v.paragraph: return n("p", { key: r.key }, t(e.children, r));
				case v.ref: return null;
				default: return null;
			}
		}
		var $o = (e, t, r, n, a, i, o) => {
			var A = (l) => l.map((_) => "text" in _ ? _.text : ""), C = (l, _ = {}) => {
				var c = Array.isArray(l) ? l : [l], R = (_.renderDepth || 0) + 1;
				if (R > 2500) return A(c);
				_.renderDepth = R;
				for (var d = _.key, s = [], g = !1, u = 0; u < c.length; u++) {
					_.key = u;
					var f;
					if (e) f = e(ei.bind(null, c[u], C, _, t, r, n, a, i, o), c[u], C, _);
					else f = ei(c[u], C, _, t, r, n, a, i, o);
					var T = typeof f == "string";
					if (g && typeof f == "string") {
						var S = s.at(-1);
						s[s.length - 1] = (typeof S == "string" ? S : "") + f;
					} else if (f != null) if (Array.isArray(f)) for (var w = 0; w < f.length; w++) s.push(f[w]);
					else s.push(f);
					g = T;
				}
				return _.key = d, _.renderDepth = R - 1, s;
			};
			return C;
		};
		var vo = (e, t) => {
			let r = Xt(t, e, void 0);
			return r ? typeof r == "function" || typeof r == "object" && "render" in r ? r : Xt(t, `${e}.component`, e) : e;
		};
		function To(e, t) {
			let r = { ...t || {} };
			r.overrides = r.overrides || {};
			let n = r.slugify || Tr, a = r.sanitizer || Cr, i = r.createElement, o = Dt(r.overrides), A = (T) => Mn(T, {
				...r,
				wrapper: null
			});
			function C(T) {
				for (var S in T) {
					var w = T[S];
					if (typeof w == "string" && w.length > 0 && w.charCodeAt(0) === ae && (Ga.test(w) || Fa.test(w) || ja(w, 0))) {
						var H = A(w.trim());
						T[S] = S === "innerHTML" && Array.isArray(H) ? H[0] : H;
					}
				}
			}
			function l(T, S, ...w) {
				var H = S || {}, k = T;
				if (o) {
					var N = Xt(r.overrides, `${T}.props`, {});
					k = vo(T, r.overrides), H = {
						...H,
						...N,
						className: Ta(H.className, N.className) || void 0
					};
				}
				if (!i) {
					var p = H.key;
					return p != null && delete H.key, w.length === 1 ? H.children = w[0] : w.length > 1 && (H.children = w), xn(k, H, p);
				}
				return i(k, H, ...w);
			}
			function _(T, S, ...w) {
				return S && C(S), l(T, S, ...w);
			}
			let c = Et(r, r.forceInline), R = e[0] && e[0].type === v.refCollection ? e[0].refs : Object.create(null), d = $o(r.renderRule, l, a, n, R, r, _), s = d(e, {
				inline: r.forceInline,
				refs: R
			}), g = va(R);
			if (g.length > 0 && s.push(l("footer", { key: "footer" }, g.map(function(S) {
				let w = S.identifier.charCodeAt(0) === lr ? S.identifier.slice(1) : S.identifier, H = kt(S.footnote, {
					inline: !0,
					refs: R
				}, c);
				return l("div", {
					id: n(w, Tr),
					key: S.identifier
				}, `${w}: `, d(H, {
					inline: !0,
					refs: R
				}));
			}))), r.wrapper === null) return s;
			let u = r.wrapper || (r.forceInline ? "span" : "div"), f;
			if (s.length > 1 || r.forceWrapper) f = s;
			else return s.length === 1 ? s[0] : null;
			var h = r.wrapperProps ? { ...r.wrapperProps } : {};
			return h.children = f, xn(u, h, "outer");
		}
		function Mn(e = "", t = {}) {
			let r = { ...t || {} };
			r.overrides = r.overrides || {};
			r.slugify;
			r.sanitizer;
			function i(A) {
				let C = r.forceInline || !(r.forceBlock || fa.test(A)), l = Et(r, C);
				return To(kt(C ? A : ha(A), {
					inline: C,
					refs: o
				}, l), {
					...r,
					forceInline: C
				});
			}
			let o = Object.create(null);
			return i(e);
		}
		function So(e) {
			let t = react.useRef(e), r = t.current;
			if (r !== e) {
				var n = !0, a = 0;
				for (var i in e) if (a++, !Object.is(r[i], e[i])) {
					n = !1;
					break;
				}
				if (n) {
					var o = 0;
					for (var A in r) o++;
					n = o === a;
				}
				n || (t.current = e);
			}
			return t.current;
		}
		var Eo = ({ children: e, options: t, ...r }) => {
			if (!(typeof react.useContext < "u")) {
				let l = {
					...t,
					overrides: { ...t?.overrides },
					wrapperProps: {
						...t?.wrapperProps,
						...r
					}
				};
				return Mn(e ?? "", l);
			}
			let a = Yt ? react.useContext(Yt) : void 0, i = So(r), o = react.useMemo(() => ({
				...a,
				...t,
				overrides: {
					...a?.overrides,
					...t?.overrides
				},
				wrapperProps: {
					...a?.wrapperProps,
					...t?.wrapperProps,
					...i
				}
			}), [
				a,
				t,
				i
			]), A = e ?? "";
			return react.useMemo(() => Mn(A, o), [A, o]);
		};
		var Po = Eo;
		//#endregion
		//#region src/client/MarkdownView.tsx
		function MarkdownView({ text }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Po, {
				options: {
					disableParsingRawHTML: true,
					ignoreHTMLBlocks: true,
					renderRule(next, node, renderChildren, state) {
						if (node.type === v.paragraph && !state.inList && !state.inBlockQuote) return paragraphs(node, renderChildren, state);
						if (node.type === v.text) return breakLines(node.text, state.key);
						return next();
					},
					overrides: {
						a: { component: Link },
						img: { component: ImageText }
					}
				},
				children: text
			});
		}
		/**
		* One paragraph of the source, split at its single newlines. Each line becomes
		* its own paragraph so the reading view shows the breaks; a first line carries
		* `data-line="first"` so CSS can space source blocks apart wider than lines.
		*/
		function paragraphs(node, renderChildren, state) {
			return (splitLines(node.children) ?? [node.children]).map((line, index) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
				"data-line": index === 0 ? "first" : void 0,
				children: renderChildren(line, state)
			}, `${state.key ?? "para"}:${index}`));
		}
		/** Split a paragraph's inline nodes at newlines. `undefined` means no break. */
		function splitLines(children) {
			const lines = [[]];
			let broken = false;
			for (const child of children) {
				if (child.type !== v.text) {
					lines[lines.length - 1].push(child);
					continue;
				}
				const pieces = child.text.split("\n");
				if (pieces.length === 1) {
					lines[lines.length - 1].push(child);
					continue;
				}
				broken = true;
				pieces.forEach((piece, index) => {
					if (index > 0) lines.push([]);
					if (piece.length > 0) lines[lines.length - 1].push({
						...child,
						text: piece
					});
				});
			}
			return broken ? lines.filter((line) => line.length > 0) : void 0;
		}
		/** Newlines outside a paragraph keep their own line as a bare break. */
		function breakLines(text, key) {
			if (!text.includes("\n")) return text;
			const parts = [];
			text.split("\n").forEach((line, index) => {
				if (index > 0) parts.push(/* @__PURE__ */ (0, react_jsx_runtime.jsx)("br", {}, `${key ?? "text"}:break:${index}`));
				if (line.length > 0) parts.push(line);
			});
			return parts;
		}
		function Link({ href, children }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("a", {
				href,
				target: "_blank",
				rel: "noreferrer noopener",
				children
			});
		}
		/** Images are outside the supported subset, so the alt text stays words. */
		function ImageText({ alt, children }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: children ?? alt });
		}
		//#endregion
		//#region src/client/widgets.tsx
		const CATEGORY_KEY = {
			system: "catSystem",
			user: "catUser",
			tools: "catTools",
			"tool-results": "catResults",
			injection: "catInjection",
			skill: "catSkill",
			history: "catHistory"
		};
		function FigureView({ figure, t, pending = false, unseen = false, showBasis = true, format = abbreviate }) {
			if (figure.basis === "absent" || figure.value === void 0) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: "dsh-context-track-muted",
				"data-basis": "absent",
				children: unseen ? t("notSeen") : pending ? t("pending") : t("absent")
			});
			const shown = format(figure.value);
			const badge = figure.basis === "usage" ? t("exact") : t("estimated");
			const body = /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
				showBasis && figure.basis === "estimated" ? "≈ " : null,
				shown.text,
				showBasis ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [" ", /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: "dsh-context-track-badge",
					"data-basis": figure.basis,
					children: badge
				})] }) : null
			] });
			if (!shown.abbreviated) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: "dsh-context-track-num",
				"data-basis": figure.basis,
				children: body
			});
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
				type: "button",
				className: "dsh-context-track-num",
				title: shown.full,
				"data-full": shown.full,
				onClick: (event) => {
					event.stopPropagation();
					copyText(shown.full);
				},
				children: body
			});
		}
		/**
		* Prompt caching reads as good news when it is high, so the tone tracks the
		* percentage rather than one fixed accent. The pill carries its own color and
		* tint so the number reads at a glance from the header.
		*/
		function hitTone(figure) {
			if (figure.basis === "absent" || figure.value === void 0) return "absent";
			if (figure.value >= 80) return "high";
			if (figure.value >= 50) return "mid";
			return "low";
		}
		function HitRateBadge({ figure, t, stat }) {
			const tone = hitTone(figure);
			const text = figure.basis === "absent" || figure.value === void 0 ? t("absent") : formatHitPercent(figure.value);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
				className: "dsh-context-track-hit",
				"data-hit-tone": tone,
				"data-stat": stat,
				title: t("hitHint"),
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: "dsh-context-track-hit-label",
					children: t("hitRate")
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: "dsh-context-track-hit-value",
					children: text
				})]
			});
		}
		//#endregion
		//#region src/client/Detail.tsx
		/** Reading view of one node, or the same node as JSON. The call result sits after the input. */
		const PREVIEW_LINES = 8;
		/** One node. A visited view stays mounted, so its folds and scroll survive the round trip. */
		function Detail({ detail, nodeKey, t, scrollerRef, onOpenChild, crumbs, onCrumb, onClose, onBack, focusCategory }) {
			const [view, setView] = (0, react.useState)("reading");
			const [slice, setSlice] = (0, react.useState)(void 0);
			const [visited, setVisited] = (0, react.useState)({
				reading: true,
				json: false
			});
			const [copied, setCopied] = (0, react.useState)(false);
			const memory = (0, react.useRef)({
				reading: 0,
				json: 0
			});
			const viewRef = (0, react.useRef)(view);
			viewRef.current = view;
			(0, react.useLayoutEffect)(() => {
				const scroller = scrollerRef.current;
				if (scroller !== null) scroller.scrollTop = memory.current[view];
			}, [
				view,
				nodeKey,
				scrollerRef
			]);
			(0, react.useLayoutEffect)(() => {
				if (focusCategory === void 0) return;
				const card = scrollerRef.current?.querySelector(`[data-focus="true"]`);
				if (card instanceof HTMLElement) card.scrollIntoView?.({ block: "nearest" });
			}, [focusCategory, scrollerRef]);
			const rememberScroll = () => {
				const scroller = scrollerRef.current;
				if (scroller !== null) memory.current[viewRef.current] = scroller.scrollTop;
			};
			const choose = (next) => {
				rememberScroll();
				setSlice(void 0);
				setVisited((current) => ({
					...current,
					[next]: true
				}));
				setView(next);
			};
			const openSlice = (value) => {
				rememberScroll();
				setSlice(value);
				setVisited((current) => ({
					...current,
					json: true
				}));
				setView("json");
			};
			const copyNode = () => {
				if (detail === void 0) return;
				copyText(JSON.stringify(detail, null, 2));
				setCopied(true);
				setTimeout(() => {
					setCopied(false);
				}, 1200);
			};
			const failed = detail !== void 0 && isMissing(detail);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				"data-view": view,
				"data-node": nodeKey,
				className: "dsh-context-track-detail-inner",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("header", {
						className: "dsh-context-track-detail-head",
						"data-detail-head": true,
						children: [
							onBack !== void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
								type: "button",
								"data-detail-back": true,
								onClick: onBack,
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										"aria-hidden": "true",
										children: "←"
									}),
									" ",
									t("back")
								]
							}) : null,
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("nav", {
								className: "dsh-context-track-crumbs",
								"data-crumbs": true,
								"aria-label": t("detailPane"),
								children: (crumbs ?? []).map((crumb, index) => {
									const crumbId = crumb.id;
									return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
										className: "dsh-context-track-crumb",
										children: [index > 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											"aria-hidden": "true",
											className: "dsh-context-track-crumb-sep",
											children: "/"
										}) : null, crumbId === void 0 || onCrumb === void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											"data-crumb-current": true,
											children: crumb.label
										}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
											type: "button",
											"data-crumb": crumbId,
											onClick: () => {
												onCrumb(crumbId);
											},
											children: crumb.label
										})]
									}, `${crumbId ?? "self"}-${index}`);
								})
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "dsh-context-track-views",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									"data-view-toggle": "reading",
									"aria-pressed": view === "reading",
									onClick: () => {
										choose("reading");
									},
									children: t("reading")
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									"data-view-toggle": "json",
									"aria-pressed": view === "json",
									onClick: () => {
										choose("json");
									},
									children: t("jsonView")
								})]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								"data-copy-node": true,
								"aria-live": "polite",
								onClick: copyNode,
								children: copied ? t("copied") : t("copyJson")
							}),
							onClose !== void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								"data-detail-close": true,
								"aria-label": t("closeDetail"),
								onClick: onClose,
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									"aria-hidden": "true",
									children: "✕"
								})
							}) : null
						]
					}),
					detail === void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "dsh-context-track-muted",
						children: t("hint")
					}) : null,
					failed ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "dsh-context-track-muted",
						children: t("missing")
					}) : null,
					detail === void 0 || failed ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [visited.json ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						"data-view-pane": "json",
						hidden: view !== "json",
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(JsonPane, {
							detail,
							slice,
							t
						})
					}) : null, /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						"data-view-pane": "reading",
						hidden: view !== "reading",
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Structured, {
							detail,
							t,
							onOpenChild,
							onSlice: openSlice,
							focusCategory
						})
					})] })
				]
			});
		}
		function Structured({ detail, t, onOpenChild, onSlice, focusCategory }) {
			if (detail.kind === "attempt" || detail.kind === "step") return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				"data-io": true,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Facts, {
						detail,
						t
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(InputCards, {
						messages: detail.messages,
						tools: detail.tools,
						newFrom: detail.newFrom,
						t,
						onSlice,
						focusCategory
					}),
					detail.kind === "attempt" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(OutputCards, {
						output: detail.output,
						usage: detail.usage,
						t,
						onSlice
					}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						"data-output": "unseen",
						className: "dsh-context-track-block",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: t("output") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							className: "dsh-context-track-muted",
							children: t("notSeen")
						})]
					})
				]
			});
			if (detail.kind === "tool") return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ToolBody, {
				detail,
				t,
				onOpenChild,
				onSlice
			});
			if (detail.kind === "sidecar") {
				if (detail.purpose === "session-title") return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(TitleBody, {
					detail,
					t,
					onSlice
				});
				if (detail.purpose === "web-search") return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SearchBody, {
					detail,
					t
				});
				return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "dsh-context-track-prose",
					"data-sidecar-body": true,
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(MarkdownView, { text: typeof detail.summary === "string" ? detail.summary : stringify(detail.summary) })
				});
			}
			if (detail.kind === "turn") return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: detail.status === "ok" ? null : detail.status });
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("pre", {
				className: "dsh-context-track-pre",
				children: stringify(detail)
			});
		}
		function Facts({ detail, t }) {
			const config = record(detail.config);
			const defaults = record(detail.adapterDefaults);
			const facts = [];
			pushFact(facts, "model", t("model"), text(config.model));
			pushFact(facts, "provider", t("provider"), text(config.provider));
			pushFact(facts, "temperature", t("temperature"), text(config.temperature));
			pushFact(facts, "reasoning", t("reasoning"), text(config.reasoningEffort), defaults.reasoningEffort === true ? t("adapterDefault") : void 0);
			if (text(config.maxTokens) !== void 0) facts.push({
				key: "maxTokens",
				label: t("maxOutput"),
				value: `${formatCount(config.maxTokens)} token`,
				...defaults.maxTokens === true ? { note: t("adapterDefault") } : {}
			});
			facts.push({
				key: "window",
				label: t("windowLabel"),
				value: String(detail.inputSeq)
			});
			facts.push({
				key: "status",
				label: t("finish"),
				value: labelStatus(detail.status, t),
				status: detail.status
			});
			if (detail.kind === "attempt" && detail.retry !== void 0) {
				pushFact(facts, "retry", t("retry"), summarize(detail.retry.failure));
				facts.push({
					key: "delay",
					label: t("retryDelay"),
					value: `${detail.retry.delayMs} ms`
				});
			}
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(FactList, { facts });
		}
		/** Session naming uses the same reading shape as a model call: facts, input, then output. */
		function TitleBody({ detail, t, onSlice }) {
			const named = typeof detail.output === "string" && detail.output.length > 0;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				"data-io": true,
				"data-title-body": true,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(TitleFacts, {
						detail,
						t
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(InputCards, {
						messages: titleMessages(detail),
						tools: void 0,
						t,
						onSlice
					}),
					named ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(OutputCards, {
						output: detail.output,
						t,
						onSlice
					}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						"data-output": "unseen",
						className: "dsh-context-track-block",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: t("output") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							"data-session-name": true,
							className: "dsh-context-track-muted",
							children: t("titleMissing")
						})]
					})
				]
			});
		}
		function TitleFacts({ detail, t }) {
			const route = record(detail.route);
			const facts = [];
			if (typeof detail.route === "string") pushFact(facts, "route", t("routeLabel"), text(detail.route));
			else {
				pushFact(facts, "model", t("model"), text(route.model));
				pushFact(facts, "provider", t("provider"), text(route.provider));
			}
			pushFact(facts, "reasoning", t("reasoning"), text(detail.reasoningEffort));
			if (text(detail.maxTokens) !== void 0) facts.push({
				key: "maxTokens",
				label: t("maxOutput"),
				value: `${formatCount(detail.maxTokens)} token`
			});
			facts.push({
				key: "status",
				label: t("finish"),
				value: labelStatus(detail.status, t),
				status: detail.status
			});
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(FactList, { facts });
		}
		function titleMessages(detail) {
			const list = Array.isArray(detail.messages) ? detail.messages : [];
			const system = systemMessage(detail.system);
			return system === void 0 ? list : [system, ...list];
		}
		function systemMessage(system) {
			if (typeof system === "string") {
				if (system.trim().length === 0) return void 0;
				return {
					role: "system",
					content: [{
						type: "text",
						text: system
					}]
				};
			}
			if (system === null || typeof system !== "object") return void 0;
			const row = system;
			if (row.role === void 0 && row.content === void 0 && typeof row.text !== "string") return void 0;
			return system;
		}
		function FactList({ facts }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: "dsh-context-track-facts",
				"data-facts": true,
				children: facts.map((fact) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					"data-fact": fact.key,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: "dsh-context-track-fact-label",
						children: fact.label
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
						className: "dsh-context-track-fact-value",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							"data-fact-value": true,
							"data-status": fact.status,
							children: fact.value
						}), fact.note !== void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: "dsh-context-track-fact-note",
							children: fact.note
						}) : null]
					})]
				}, fact.key))
			});
		}
		function pushFact(facts, key, label, value, note) {
			if (value === void 0) return;
			facts.push({
				key,
				label,
				value,
				...note !== void 0 ? { note } : {}
			});
		}
		function text(value) {
			if (typeof value === "number" && Number.isFinite(value)) return formatCount(value);
			if (typeof value === "string" && value.length > 0) return value;
		}
		function formatCount(value) {
			if (typeof value !== "number" || !Number.isFinite(value)) return "";
			if (!Number.isInteger(value) || Math.abs(value) < 1e3) return String(value);
			return (value < 0 ? "-" : "") + String(Math.abs(value)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		}
		function InputCards({ messages, tools, newFrom, t, onSlice, focusCategory }) {
			const list = Array.isArray(messages) ? messages : [];
			const classified = (0, react.useMemo)(() => classifyWindow(list, tools), [list, tools]);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				"data-input": true,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", {
					className: "dsh-context-track-section",
					children: t("messages")
				}), list.map((message, index) => {
					const item = classified.items.find((entry) => entry.message === message);
					return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(MessageCard, {
						message,
						item,
						t,
						onSlice,
						focused: focusCategory !== void 0 && item?.category === focusCategory,
						isNew: newFrom !== void 0 && index === newFrom
					}, index);
				})]
			});
		}
		/** Thinking sits in its own card. The result card keeps the written answer, tool calls, and output tokens. */
		function OutputCards({ output, usage, t, onSlice }) {
			if (output === void 0) return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
				"data-output": "unseen",
				className: "dsh-context-track-block",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: t("output") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
					className: "dsh-context-track-muted",
					children: t("pending")
				})]
			});
			const answer = outputAnswer(output);
			const thought = outputThought(output);
			const calls = outputCalls(output);
			const outputTokens = parseUsage(usage)?.outputTokens;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				"data-output": true,
				children: [thought.length > 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
					"data-reasoning": true,
					className: "dsh-context-track-block dsh-context-track-reasoning",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("header", {
						className: "dsh-context-track-output-meta",
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: t("think") })
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ReadingBody, {
						text: thought,
						faint: true,
						t
					})]
				}) : null, /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
					className: "dsh-context-track-block dsh-context-track-output",
					"data-category": "history",
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("header", {
							className: "dsh-context-track-output-meta",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: t("output") }),
								outputTokens !== void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									"data-output-tokens": true,
									className: "dsh-context-track-output-tokens",
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(TokenMark, {
										basis: "usage",
										value: outputTokens
									})
								}) : null,
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									"data-open-json": true,
									onClick: () => {
										onSlice(output);
									},
									children: t("openInJson")
								})
							]
						}),
						answer.length > 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ReadingBody, {
							text: answer,
							t
						}) : null,
						calls.map((block, index) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(OutputCall, {
							block,
							t
						}, callKey(block, index)))
					]
				})]
			});
		}
		/** A tool call the model wrote: its name, then the arguments as highlighted JSON. */
		function OutputCall({ block, t }) {
			const name = typeof block.name === "string" && block.name.length > 0 ? block.name : t("tools");
			const args = block.arguments;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				"data-output-call": true,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
					className: "dsh-context-track-output-call-name",
					children: name
				}), args !== void 0 && args !== null && args !== "" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(JsonView, {
					value: args,
					t,
					chrome: false
				}) : null]
			});
		}
		/** Exact usage is `token=n`. A character estimate is `token≈n`. No exact or estimated caption. */
		function TokenMark({ basis, value }) {
			const shown = abbreviate(value);
			const mark = basis === "usage" ? `token=${shown.text}` : `token≈${shown.text}`;
			if (!shown.abbreviated) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: "dsh-context-track-num",
				"data-basis": basis,
				children: mark
			});
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
				type: "button",
				className: "dsh-context-track-num",
				title: basis === "usage" ? `token=${shown.full}` : `token≈${shown.full}`,
				"data-full": shown.full,
				onClick: (event) => {
					event.stopPropagation();
					copyText(shown.full);
				},
				children: mark
			});
		}
		function callKey(block, index) {
			return typeof block.id === "string" && block.id.length > 0 ? block.id : `${index}`;
		}
		function outputCalls(output) {
			return contentBlocks(output).filter((block) => block.type === "tool-call");
		}
		/** Written answer. A plain string is the whole output. Reasoning never fills this card. */
		function outputAnswer(output) {
			if (typeof output === "string") return output;
			const blocks = contentBlocks(output);
			const answer = blockText(blocks, "text");
			if (answer.length > 0) return answer;
			return blocks.length === 0 ? messageText(output) : "";
		}
		function outputThought(output) {
			if (typeof output === "string") return "";
			return blockText(contentBlocks(output), "reasoning");
		}
		function blockText(blocks, type) {
			return blocks.filter((block) => block.type === type && typeof block.text === "string" && block.text.trim().length > 0).map((block) => String(block.text)).join("\n\n");
		}
		/** Full-node JSON is two documents. A sliced message stays a single document. */
		function JsonPane({ detail, slice, t }) {
			if (slice !== void 0) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(JsonView, {
				value: slice,
				t
			});
			const parts = jsonParts(detail);
			if (parts === void 0) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(JsonView, {
				value: detail,
				t
			});
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				"data-json-split": true,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
					"data-json-part": "input",
					className: "dsh-context-track-block",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: t("input") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(JsonView, {
						value: parts.input,
						t
					})]
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
					"data-json-part": "output",
					className: "dsh-context-track-block",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: t("output") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(JsonView, {
						value: parts.output,
						t
					})]
				})]
			});
		}
		function jsonParts(detail) {
			if (detail.kind === "attempt" || detail.kind === "step") return {
				input: pick(detail, [
					"inputSeq",
					"messages",
					"tools",
					"toolHistory",
					"config",
					"adapterDefaults",
					"context"
				]),
				output: detail.kind === "step" ? { status: detail.status } : pick(detail, [
					"status",
					"output",
					"usage",
					"firstTokenTime",
					"streamDuration",
					"interrupted",
					"retry"
				])
			};
			if (detail.kind === "tool") return {
				input: pick(detail, [
					"name",
					"callId",
					"arguments",
					"childSessionId",
					"childLabel",
					"childMode"
				]),
				output: pick(detail, ["status", "result"])
			};
			if (detail.kind === "sidecar" && detail.purpose === "compaction") return {
				input: pick(detail, [
					"messages",
					"tools",
					"toolHistory",
					"config",
					"instruction",
					"provider",
					"model",
					"maxTokens"
				]),
				output: pick(detail, [
					"status",
					"summary",
					"rawOutput",
					"usage",
					"error"
				])
			};
			if (detail.kind === "sidecar" && detail.purpose === "session-title") return {
				input: pick(detail, [
					"system",
					"messages",
					"route",
					"maxTokens",
					"reasoningEffort"
				]),
				output: pick(detail, ["status", "output"])
			};
		}
		function pick(source, keys) {
			const row = source;
			const out = {};
			for (const key of keys) if (row[key] !== void 0) out[key] = row[key];
			return out;
		}
		/** Markdown, or foldable JSON when the whole block is an object or array. */
		function ReadingBody({ text, faint = false, t }) {
			const embedded = faint ? void 0 : compositeJson(text);
			const [open, setOpen] = (0, react.useState)(false);
			const lines = text.split("\n");
			const clampable = embedded === void 0 && lines.length > PREVIEW_LINES;
			const clamped = clampable && !open;
			const shown = clamped ? lines.slice(0, PREVIEW_LINES).join("\n") : text;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: faint ? "dsh-context-track-reasoning" : void 0,
				"data-folded": faint && !open ? "true" : void 0,
				"data-clamped": clamped ? "true" : void 0,
				children: [embedded !== void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(JsonView, {
					value: embedded,
					t
				}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "dsh-context-track-prose",
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(MarkdownView, { text: shown })
				}), clampable ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
					type: "button",
					"data-more": true,
					onClick: () => {
						setOpen((value) => !value);
					},
					children: open ? t("collapse") : t("showRest")
				}) : null]
			});
		}
		function MessageCard({ message, item, t, onSlice, faint = false, focused = false, isNew = false }) {
			const text = messageText(message);
			const embedded = faint ? void 0 : compositeJson(text);
			const [open, setOpen] = (0, react.useState)(false);
			const lines = text.split("\n");
			const clampable = embedded === void 0 && lines.length > PREVIEW_LINES;
			const clamped = clampable && !open;
			const shown = clamped ? lines.slice(0, PREVIEW_LINES).join("\n") : text;
			const role = item?.role ?? roleOf(message) ?? "";
			const category = item?.category;
			const folded = category === "system" || faint;
			const tokens = item?.tokens ?? estimateMessage(message, category === "system");
			const source = sourceCell(message, category);
			const tool = category === "tool-results" || category === "skill" ? item?.toolName : void 0;
			const callId = callIdOf(message);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
				className: faint ? "dsh-context-track-block dsh-context-track-reasoning" : "dsh-context-track-block",
				"data-category": category,
				"data-folded": folded && !open ? "true" : void 0,
				"data-clamped": clamped ? "true" : void 0,
				"data-focus": focused ? "true" : void 0,
				"data-new": isNew ? "true" : void 0,
				children: [
					isNew ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("header", {
						className: "dsh-context-track-new",
						"data-new-mark": true,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: "dsh-context-track-new-badge",
							children: t("newMessages")
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: "dsh-context-track-new-rule",
							"aria-hidden": "true"
						})]
					}) : null,
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("table", {
						className: "dsh-context-track-meta",
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("tbody", { children: [
							role.length > 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(MetaRow, {
								label: t("role"),
								value: role
							}) : null,
							category !== void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(MetaRow, {
								label: t("category"),
								value: t(CATEGORY_KEY[category])
							}) : null,
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("td", {
								colSpan: 2,
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(TokenMark, {
									basis: "estimated",
									value: tokens
								})
							}) }),
							source !== void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(MetaRow, {
								label: t("source"),
								value: source
							}) : null,
							tool !== void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(MetaRow, {
								label: t("toolName"),
								value: tool
							}) : null,
							callId !== void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(MetaRow, {
								label: t("call"),
								value: callId
							}) : null
						] })
					}),
					embedded !== void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(JsonView, {
						value: embedded,
						t
					}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "dsh-context-track-prose",
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(MarkdownView, { text: shown })
					}),
					clampable ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						"data-more": true,
						onClick: () => {
							setOpen((value) => !value);
						},
						children: open ? t("collapse") : t("showRest")
					}) : null,
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						"data-open-json": true,
						onClick: () => {
							onSlice(message);
						},
						children: t("openInJson")
					})
				]
			});
		}
		function MetaRow({ label, value }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("th", {
				scope: "row",
				children: label
			}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("td", { children: value })] });
		}
		function ToolBody({ detail, t, onOpenChild, onSlice }) {
			const local = detail.childSessionId !== void 0 && childExpandable(detail.childMode);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				"data-tool-view": true,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						"data-pane": "arguments",
						className: "dsh-context-track-block",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: t("arguments") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(JsonView, {
							value: detail.arguments,
							t
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						"data-pane": "result",
						className: "dsh-context-track-block",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: t("result") }),
							detail.result === void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								className: "dsh-context-track-muted",
								children: t("pending")
							}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(JsonView, {
								value: detail.result,
								t
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								"data-slice": "result",
								onClick: () => {
									onSlice(detail.result === void 0 ? "" : detail.result);
								},
								children: t("openInJson")
							})
						]
					}),
					local ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						"data-open-child": true,
						onClick: onOpenChild,
						children: t("openChild")
					}) : null
				]
			});
		}
		/** Search sidecar: who triggered it, then the query and the scrubbed request. */
		function SearchBody({ detail, t }) {
			const query = record(detail.request).query;
			const source = detail.source;
			const trigger = source?.kind === "tool" ? source.name : source?.kind === "attempt" ? source.attempt !== void 0 ? `${t("step").replace("{n}", String(source.step))} · ${t("attempt").replace("{n}", String(source.attempt))}` : t("step").replace("{n}", String(source.step)) : void 0;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				"data-search-body": true,
				children: [source !== void 0 && trigger !== void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
					"data-pane": "source",
					className: "dsh-context-track-block",
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: t("trigger") }),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							"data-search-trigger": true,
							children: trigger
						}),
						source.kind === "tool" && source.arguments !== void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: t("arguments") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(JsonView, {
							value: source.arguments,
							t
						})] }) : null,
						source.kind === "attempt" && source.output !== void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(JsonView, {
							value: source.output,
							t
						}) : null
					]
				}) : null, /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
					"data-pane": "request",
					className: "dsh-context-track-block",
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: t("request") }),
						typeof query === "string" && query.length > 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("table", {
							className: "dsh-context-track-meta",
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("tbody", { children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(MetaRow, {
								label: t("query"),
								value: query
							}) })
						}) : null,
						detail.request === void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							className: "dsh-context-track-muted",
							children: t("notSeen")
						}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(JsonView, {
							value: detail.request,
							t
						})
					]
				})]
			});
		}
		function contentBlocks(value) {
			if (value === null || typeof value !== "object") return [];
			const content = value.content;
			if (!Array.isArray(content)) return [];
			return content.filter((block) => block !== null && typeof block === "object");
		}
		function messageText(message) {
			if (typeof message === "string") return message;
			if (message === null || typeof message !== "object") return stringify(message);
			const row = message;
			if (typeof row.text === "string") return row.text;
			if (typeof row.content === "string") return row.content;
			const blocks = contentBlocks(message);
			if (blocks.length === 0) return stringify(message);
			return blocks.map((block) => typeof block.text === "string" ? block.text : "").join("");
		}
		function roleOf(message) {
			if (message === null || typeof message !== "object") return void 0;
			const role = message.role;
			return typeof role === "string" ? role : void 0;
		}
		function callIdOf(message) {
			if (message === null || typeof message !== "object") return void 0;
			const direct = message.toolCallId;
			if (typeof direct === "string" && direct.length > 0) return direct;
			const source = message.source;
			if (source === null || typeof source !== "object") return void 0;
			const nested = source.callId;
			return typeof nested === "string" && nested.length > 0 ? nested : void 0;
		}
		function sourceCell(message, category) {
			if (category !== "injection" && category !== "skill") return void 0;
			if (message === null || typeof message !== "object") return void 0;
			const source = message.source;
			if (source === null || typeof source !== "object") return void 0;
			return sourceLabel(message);
		}
		function summarize(value) {
			const flat = (typeof value === "string" ? value : value === void 0 ? "" : stringify(value)).replace(/\s+/g, " ").trim();
			return flat.length > 80 ? `${flat.slice(0, 80)}…` : flat;
		}
		function labelStatus(status, t) {
			if (status === "ok" || status === "running" || status === "error" || status === "aborted") return t(status);
			return status;
		}
		function record(value) {
			return value !== null && typeof value === "object" ? value : {};
		}
		function stringify(value) {
			if (typeof value === "string") return value;
			if (value === void 0) return "";
			try {
				return JSON.stringify(value, null, 2);
			} catch {
				return "";
			}
		}
		/** Default share of the split that the tree keeps. */
		const DEFAULT_TREE_RATIO = .38;
		/**
		* Pick a tier from the trace panel's own width.
		* @param width - measured panel width in CSS pixels.
		* @returns the arrangement tier.
		*/
		function layoutForWidth(width) {
			if (width >= 960) return "wide";
			if (width >= 640) return "compact";
			if (width >= 440) return "narrow";
			return "dense";
		}
		/** Two columns share the panel in the wide and compact tiers. */
		function isSideBySide(tier) {
			return tier === "wide" || tier === "compact";
		}
		/**
		* Clamp a tree ratio so neither column drops below its minimum.
		* A panel too narrow to hold both minimums keeps the tree at its minimum share.
		* @param ratio - desired tree fraction between 0 and 1.
		* @param width - measured split width in CSS pixels.
		* @returns the tree fraction to apply.
		*/
		function clampTreeRatio(ratio, width) {
			if (!Number.isFinite(width) || width <= 0) return DEFAULT_TREE_RATIO;
			const lowest = width > 560 ? 240 / width : DEFAULT_TREE_RATIO;
			const highest = width > 560 ? 1 - 320 / width : DEFAULT_TREE_RATIO;
			return Math.min(Math.max(ratio, lowest), highest);
		}
		//#endregion
		//#region src/client/styles.ts
		/**
		* Panel chrome. Status colors come from the host alias tokens. Category bars
		* and JSON tokens use the small palette below. The shell is a header, a
		* horizontal round strip, a collapsible context band, and a tree beside a
		* detail pane. Narrow panels keep the tree full width and slide the detail over it.
		*/
		const traceCss = `
.dsh-context-track {
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  align-items: stretch;
  min-width: 0;
  /* The centre column clips overflow. A content-sized panel is cut off and cannot scroll. */
  min-height: 0;
  height: 100%;
  overflow: hidden;
  background: var(--dsw-alias-bg-base);
  color: var(--dsw-alias-label-primary);
  /* palette */
  --dsh-cat-tools: light-dark(#c2410c, #fb923c);
  --dsh-cat-results: light-dark(#1d4ed8, #60a5fa);
  --dsh-cat-system: light-dark(#7e22ce, #c084fc);
  --dsh-cat-skill: light-dark(#15803d, #4ade80);
  --dsh-cat-history: light-dark(#a16207, #facc15);
  --dsh-cat-injection: light-dark(#92400e, #d6a06a);
  --dsh-cat-neutral: var(--dsw-alias-label-tertiary);
  /* hit rate reads high-good, so the tones are their own scale, not category hues */
  --dsh-hit-high: light-dark(#15803d, #4ade80);
  --dsh-hit-mid: light-dark(#a16207, #facc15);
  --dsh-hit-low: light-dark(#b91c1c, #f87171);
  /* The timing bar is its own scale: wait, think, and the remainder. */
  --dsh-time-wait: light-dark(#a16207, #facc15);
  --dsh-time-think: light-dark(#7e22ce, #c084fc);
  --dsh-time-rest: color-mix(in srgb, var(--dsw-alias-label-tertiary) 45%, transparent);
  --dsh-json-key: light-dark(#0451a5, #9cdcfe);
  --dsh-json-string: light-dark(#a31515, #ce9178);
  --dsh-json-number: light-dark(#098658, #b5cea8);
  --dsh-json-boolean: light-dark(#0000ff, #569cd6);
  --dsh-tree-bar: 2rem;
  /* /palette */
}
/* The centre column reaches the window edge when the left sidebar is collapsed. */
[data-platform='darwin'] .dsh-context-track-main {
  padding-top: var(--dsh-frame-top-clearance, 0px);
}
.dsh-context-track-empty,
.dsh-context-track-muted {
  color: var(--dsw-alias-label-secondary);
}
.dsh-context-track button {
  margin: 0;
  padding: 0;
  font: inherit;
  /* Author color: the user-agent button color is canvas black and disappears on the dark panel. */
  color: var(--dsw-alias-label-primary);
  background: transparent;
  border: 0;
  cursor: pointer;
}
.dsh-context-track button:focus-visible,
.dsh-context-track [role="separator"]:focus-visible {
  outline: 2px solid var(--dsw-alias-label-tertiary);
  outline-offset: 1px;
}
.dsh-context-track-num {
  font-family: ui-monospace, monospace;
  font-variant-numeric: tabular-nums;
}

/* ---------- header ---------- */
.dsh-context-track-head {
  box-sizing: border-box;
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
  min-height: 2.5rem;
  padding: 0.25rem 0.75rem;
  border-bottom: 1px solid var(--dsw-alias-border-l2);
  /* The More menu is an absolutely positioned child, so this box must not clip it. */
  position: relative;
  z-index: 7;
}
.dsh-context-track-head-title {
  flex: 0 0 auto;
  font-size: 0.82rem;
  font-weight: 650;
  white-space: nowrap;
}
.dsh-context-track-head-watching {
  flex: 0 1 auto;
  min-width: 0;
  overflow: hidden;
  color: var(--dsw-alias-label-tertiary);
  font-size: 0.72rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dsh-context-track-head-spacer {
  flex: 1 1 auto;
  min-width: 0.25rem;
}
.dsh-context-track-head-stat {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: baseline;
  gap: 0.3rem;
  color: var(--dsw-alias-label-primary);
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.dsh-context-track-head-label {
  color: var(--dsw-alias-label-tertiary);
  font-size: 0.68rem;
}
/* Cache hit rate: a tinted pill so the percentage is the first figure the eye lands on. */
.dsh-context-track-hit {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: baseline;
  gap: 0.3rem;
  padding: 0.06rem 0.45rem;
  border: 1px solid color-mix(in srgb, currentColor 42%, transparent);
  border-radius: 999px;
  background: color-mix(in srgb, currentColor 12%, transparent);
  line-height: 1.25;
  white-space: nowrap;
}
.dsh-context-track-hit-label {
  color: var(--dsw-alias-label-secondary);
  font-size: 0.66rem;
}
.dsh-context-track-hit-value {
  color: inherit;
  font-family: ui-monospace, monospace;
  font-size: 0.76rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}
.dsh-context-track-hit[data-hit-tone="high"] { color: var(--dsh-hit-high); }
.dsh-context-track-hit[data-hit-tone="mid"] { color: var(--dsh-hit-mid); }
.dsh-context-track-hit[data-hit-tone="low"] { color: var(--dsh-hit-low); }
.dsh-context-track-hit[data-hit-tone="absent"] {
  color: var(--dsw-alias-label-tertiary);
  border-color: var(--dsw-alias-border-l2);
  background: transparent;
}
.dsh-context-track-head-band,
.dsh-context-track-more-button {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 0.22rem;
  padding: 0.1rem 0.5rem;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 999px;
  color: var(--dsw-alias-label-secondary);
  font-size: 0.72rem;
  white-space: nowrap;
  cursor: pointer;
}
/* Filled, bordered, and caret-marked: the band disclosure must read as a
   control among the header's plain figures, not as another caption. */
.dsh-context-track-head-band {
  gap: 0.28rem;
  padding: 0.14rem 0.45rem 0.14rem 0.4rem;
  border-color: color-mix(in srgb, var(--dsw-alias-label-tertiary) 45%, transparent);
  background: var(--dsw-alias-bg-layer-2);
  color: var(--dsw-alias-label-primary);
  font-weight: 550;
  transition: background 140ms ease, border-color 140ms ease;
}
.dsh-context-track-head-band:hover,
.dsh-context-track-more-button:hover,
.dsh-context-track-more-button[aria-expanded="true"] {
  color: var(--dsw-alias-label-primary);
  border-color: var(--dsw-alias-label-tertiary);
  background: var(--dsw-alias-interactive-bg-hover);
}
.dsh-context-track-head-band[aria-expanded="true"] {
  border-color: color-mix(in srgb, var(--dsw-alias-label-secondary) 70%, transparent);
  background: var(--dsw-alias-interactive-bg-hover);
}
.dsh-context-track-head-band-icon {
  flex: 0 0 auto;
  width: 0.72rem;
  height: 0.72rem;
  color: var(--dsw-alias-label-secondary);
}
.dsh-context-track-head-band:hover .dsh-context-track-head-band-icon,
.dsh-context-track-head-band[aria-expanded="true"] .dsh-context-track-head-band-icon {
  color: var(--dsw-alias-label-primary);
}
.dsh-context-track-head-band-caret {
  font-size: 0.56rem;
  line-height: 1;
  transition: transform 140ms ease;
}
.dsh-context-track-head-band[aria-expanded="true"] .dsh-context-track-head-band-caret {
  transform: rotate(180deg);
}
.dsh-context-track-more-caret {
  font-size: 0.58rem;
  line-height: 1;
  transition: transform 140ms ease;
}
.dsh-context-track-more-button[aria-expanded="true"] .dsh-context-track-more-caret {
  transform: rotate(180deg);
}
.dsh-context-track-more {
  position: relative;
  flex: 0 0 auto;
}
.dsh-context-track-more-menu {
  position: absolute;
  /* Clear the header's bottom border, not just the trigger's box. */
  top: calc(100% + 0.6rem);
  right: 0;
  z-index: 30;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  min-width: 10rem;
  padding: 0.3rem;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 0.55rem;
  background: var(--dsw-alias-bg-layer-2);
  box-shadow: 0 10px 26px color-mix(in srgb, currentColor 20%, transparent);
  animation: dsh-context-track-menu-in 120ms ease-out;
}
.dsh-context-track-more-menu button {
  padding: 0.32rem 0.55rem;
  border-radius: 0.35rem;
  color: var(--dsw-alias-label-primary);
  font-size: 0.75rem;
  text-align: start;
  white-space: nowrap;
}
.dsh-context-track-more-menu button:hover,
.dsh-context-track-more-menu button:focus-visible {
  background: var(--dsw-alias-interactive-bg-hover);
}
.dsh-context-track-more-divider {
  display: block;
  height: 1px;
  margin: 0.15rem 0.2rem;
  background: var(--dsw-alias-border-l2);
}
@keyframes dsh-context-track-menu-in {
  from { opacity: 0; transform: translateY(-3px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ---------- round strip ---------- */
/* A tab rail: each round reads as a tab, the current one sits on the pane
   border with an ink bar, and the arrows switch rounds without hunting for a
   click target in a long, scrolled strip. */
.dsh-context-track-strip {
  box-sizing: border-box;
  display: flex;
  flex: 0 0 auto;
  align-items: stretch;
  gap: 0.35rem;
  min-width: 0;
  min-height: 2rem;
  padding: 0.2rem 0.45rem 0 0.6rem;
  border-bottom: 1px solid var(--dsw-alias-border-l2);
  background: var(--dsw-alias-bg-base);
}
.dsh-context-track-tabs {
  display: flex;
  flex: 1 1 auto;
  align-items: flex-end;
  gap: 0.25rem;
  min-width: 0;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  scroll-snap-type: x proximity;
}
.dsh-context-track-tabs::-webkit-scrollbar {
  display: none;
}
.dsh-context-track button.dsh-context-track-turn {
  display: inline-flex;
  flex: 0 0 auto;
  flex-direction: column;
  align-items: stretch;
  gap: 0.14rem;
  min-width: 0;
  padding: 0.26rem 0.6rem 0.32rem;
  border: 1px solid transparent;
  border-radius: 0.5rem 0.5rem 0.3rem 0.3rem;
  font-size: 0.75rem;
  line-height: 1.25;
  white-space: nowrap;
  scroll-snap-align: start;
  transition: background 140ms ease, border-color 140ms ease, color 140ms ease;
}
.dsh-context-track button.dsh-context-track-turn[data-hover="true"],
.dsh-context-track button.dsh-context-track-turn:hover {
  background: var(--dsw-alias-interactive-bg-hover);
  border-color: var(--dsw-alias-border-l2);
}
/* The current tab owns a filled surface and an ink bar, so a mouse hover never
   looks selected and a selected tab never looks merely hovered. */
.dsh-context-track button.dsh-context-track-turn[aria-current="true"] {
  border-color: var(--dsw-alias-border-l2);
  background: var(--dsw-alias-bg-layer-2);
  box-shadow: inset 0 -2px 0 var(--dsw-alias-label-primary);
}
.dsh-context-track button.dsh-context-track-turn[aria-current="true"]:hover {
  background: var(--dsw-alias-interactive-bg-hover);
}
.dsh-context-track-turn-top {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  min-width: 0;
}
.dsh-context-track-turn-name {
  color: var(--dsw-alias-label-secondary);
  font-weight: 650;
  font-variant-numeric: tabular-nums;
  transition: color 140ms ease;
}
.dsh-context-track button.dsh-context-track-turn:hover .dsh-context-track-turn-name,
.dsh-context-track button.dsh-context-track-turn[data-hover="true"] .dsh-context-track-turn-name,
.dsh-context-track button.dsh-context-track-turn[aria-current="true"] .dsh-context-track-turn-name {
  color: var(--dsw-alias-label-primary);
}
.dsh-context-track-turn-flag {
  font-size: 0.68rem;
}
.dsh-context-track-turn-summary {
  color: var(--dsw-alias-label-tertiary);
  font-size: 0.7rem;
  font-weight: 400;
}
.dsh-context-track-turn-meta {
  display: inline-flex;
  align-items: baseline;
  gap: 0.28rem;
  color: var(--dsw-alias-label-secondary);
  font-size: 0.7rem;
  font-variant-numeric: tabular-nums;
}
.dsh-context-track-turn-stat {
  display: inline-flex;
  align-items: baseline;
  gap: 0.2rem;
}
.dsh-context-track-turn-stat-label {
  color: var(--dsw-alias-label-tertiary);
}
.dsh-context-track-turn-sep {
  color: var(--dsw-alias-label-tertiary);
}
.dsh-context-track button.dsh-context-track-mark {
  flex: 0 0 auto;
  padding: 0.08rem 0.4rem;
  border: 1px dashed var(--dsw-alias-border-l2);
  border-radius: 999px;
  color: var(--dsw-alias-label-tertiary);
  font-size: 0.68rem;
  white-space: nowrap;
}
.dsh-context-track button.dsh-context-track-mark:hover {
  color: var(--dsw-alias-label-primary);
  border-color: var(--dsw-alias-label-tertiary);
}
.dsh-context-track-strip-nav {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 0.15rem;
  padding-inline-start: 0.35rem;
  border-inline-start: 1px solid var(--dsw-alias-border-l2);
}
.dsh-context-track-strip-nav button {
  display: inline-grid;
  place-items: center;
  width: 1.35rem;
  height: 1.35rem;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 0.35rem;
  color: var(--dsw-alias-label-secondary);
  transition: background 140ms ease, border-color 140ms ease, color 140ms ease;
}
.dsh-context-track-strip-nav button:hover:not(:disabled) {
  color: var(--dsw-alias-label-primary);
  border-color: var(--dsw-alias-label-tertiary);
  background: var(--dsw-alias-interactive-bg-hover);
}
.dsh-context-track-strip-nav button:disabled {
  opacity: 0.35;
  cursor: default;
}
.dsh-context-track-strip-nav svg {
  width: 0.72rem;
  height: 0.72rem;
}
.dsh-context-track-strip-count {
  flex: 0 0 auto;
  margin-inline-end: 0.1rem;
  color: var(--dsw-alias-label-tertiary);
  font-size: 0.68rem;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
/* A dense panel needs the room for tabs more than it needs a counter. */
.dsh-context-track[data-tier="dense"] .dsh-context-track-strip-count {
  display: none;
}

/* ---------- context band ---------- */
.dsh-context-track-band-wrap {
  position: relative;
  flex: 0 0 auto;
  min-width: 0;
}
.dsh-context-track-band {
  position: relative;
  box-sizing: border-box;
  min-width: 0;
}
.dsh-context-track-band-line {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
  min-height: 1.75rem;
  padding: 0.1rem 0.75rem;
  border-bottom: 1px solid var(--dsw-alias-border-l2);
  font-size: 0.72rem;
}
.dsh-context-track-band-caption {
  flex: 0 0 auto;
  color: var(--dsw-alias-label-tertiary);
  font-size: 0.68rem;
}
.dsh-context-track-band-bar {
  display: flex;
  flex: 1 1 6rem;
  align-items: stretch;
  gap: 2px;
  min-width: 3rem;
  max-width: 22rem;
  height: 0.4rem;
  padding: 0;
  overflow: hidden;
  border-radius: 999px;
  background: var(--dsw-alias-bg-layer-2);
}
.dsh-context-track-band-bar[data-empty="true"] {
  opacity: 0.4;
}
.dsh-context-track-band-seg {
  flex: 0 1 auto;
  min-width: 3px;
  height: 100%;
  border-radius: 999px;
  background: var(--dsh-cat-neutral);
  --cat: var(--dsh-cat-neutral);
}
.dsh-context-track-band-seg[data-hue="tools"] { background: var(--dsh-cat-tools); }
.dsh-context-track-band-seg[data-hue="results"] { background: var(--dsh-cat-results); }
.dsh-context-track-band-seg[data-hue="system"] { background: var(--dsh-cat-system); }
.dsh-context-track-band-seg[data-hue="skill"] { background: var(--dsh-cat-skill); }
.dsh-context-track-band-seg[data-hue="history"] { background: var(--dsh-cat-history); }
.dsh-context-track-band-seg[data-hue="injection"] { background: var(--dsh-cat-injection); }
.dsh-context-track-band-seg[data-hue="neutral"] { background: var(--dsh-cat-neutral); }
.dsh-context-track-band-gap {
  flex: 0 0 3px;
  height: 100%;
  border-radius: 2px;
  background: repeating-linear-gradient(135deg, var(--dsw-alias-label-tertiary) 0 1px, transparent 1px 3px);
}
.dsh-context-track-band-gap[data-active="true"] {
  outline: 1px solid var(--dsw-alias-state-error-primary);
  outline-offset: 1px;
}
.dsh-context-track-legend {
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  gap: 0.1rem 0.55rem;
  min-width: 0;
  overflow: hidden;
}
.dsh-context-track-legend-item {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 0.25rem;
  color: var(--dsw-alias-label-secondary);
  font-size: 0.68rem;
  white-space: nowrap;
}
.dsh-context-track-legend-item:hover {
  color: var(--dsw-alias-label-primary);
}
.dsh-context-track-legend-item i {
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 2px;
  background: var(--dsh-cat-neutral);
}
.dsh-context-track-legend-item[data-hue="tools"] i { background: var(--dsh-cat-tools); }
.dsh-context-track-legend-item[data-hue="results"] i { background: var(--dsh-cat-results); }
.dsh-context-track-legend-item[data-hue="system"] i { background: var(--dsh-cat-system); }
.dsh-context-track-legend-item[data-hue="skill"] i { background: var(--dsh-cat-skill); }
.dsh-context-track-legend-item[data-hue="history"] i { background: var(--dsh-cat-history); }
.dsh-context-track-legend-item[data-hue="injection"] i { background: var(--dsh-cat-injection); }
.dsh-context-track-legend-item[data-hue="neutral"] i { background: var(--dsh-cat-neutral); }
.dsh-context-track-legend-item b {
  font-weight: 550;
}
.dsh-context-track-legend-more {
  flex: 0 0 auto;
  padding: 0 0.35rem;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 999px;
  color: var(--dsw-alias-label-tertiary);
  font-size: 0.66rem;
}
.dsh-context-track-band-panel {
  box-sizing: border-box;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr));
  gap: 0.5rem;
  width: 100%;
  max-height: 40vh;
  padding: 0.5rem 0.75rem 0.65rem;
  border-bottom: 1px solid var(--dsw-alias-border-l2);
  background: var(--dsw-alias-bg-base);
  overflow: auto;
  animation: dsh-context-track-band-in 150ms ease-out;
}
.dsh-context-track-band-block {
  min-width: 0;
  padding: 0.45rem 0.55rem;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 0.5rem;
  background: var(--dsw-alias-bg-layer-2);
}
.dsh-context-track-band-block h3 {
  margin: 0 0 0.35rem;
  color: var(--dsw-alias-label-tertiary);
  font-size: 0.68rem;
  font-weight: 650;
}
.dsh-context-track-band-figures {
  display: flex;
  flex-wrap: wrap;
  gap: 0.15rem 0.6rem;
  margin: 0.4rem 0 0;
  color: var(--dsw-alias-label-secondary);
  font-size: 0.7rem;
}
.dsh-context-track-band-figures span {
  white-space: nowrap;
}
.dsh-context-track-band-block > .dsh-context-track-band-figures:first-child {
  margin-top: 0;
}

/* ---------- timing card ---------- */
.dsh-context-track-timing {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 0;
}
.dsh-context-track-timing-bar {
  display: flex;
  align-items: stretch;
  gap: 2px;
  height: 0.42rem;
  overflow: hidden;
  border-radius: 999px;
  background: var(--dsw-alias-bg-base);
}
.dsh-context-track-timing-bar span {
  display: block;
  flex-basis: 0;
  min-width: 2px;
  height: 100%;
  border-radius: 999px;
}
.dsh-context-track-timing-bar [data-time-seg="wait"] { background: var(--dsh-time-wait); }
.dsh-context-track-timing-bar [data-time-seg="think"] { background: var(--dsh-time-think); }
.dsh-context-track-timing-bar [data-time-seg="rest"] { background: var(--dsh-time-rest); }
.dsh-context-track-timing-legend {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.15rem 0.7rem;
  min-width: 0;
  color: var(--dsw-alias-label-secondary);
  font-size: 0.68rem;
}
.dsh-context-track-timing-legend-item {
  display: inline-flex;
  align-items: center;
  gap: 0.28rem;
  white-space: nowrap;
}
.dsh-context-track-timing-legend-item i {
  flex: 0 0 auto;
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 2px;
  background: var(--dsh-time-rest);
}
.dsh-context-track-timing-legend-item[data-time-key="wait"] i { background: var(--dsh-time-wait); }
.dsh-context-track-timing-legend-item[data-time-key="think"] i { background: var(--dsh-time-think); }
.dsh-context-track-timing-legend-item b {
  color: var(--dsw-alias-label-primary);
  font-weight: 550;
  font-variant-numeric: tabular-nums;
}
.dsh-context-track-timing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 6.25rem), 1fr));
  gap: 0.4rem;
  min-width: 0;
}
.dsh-context-track-timing-cell {
  display: flex;
  flex-direction: column;
  gap: 0.12rem;
  min-width: 0;
  padding: 0.35rem 0.5rem;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 0.45rem;
  background: var(--dsw-alias-bg-base);
}
.dsh-context-track-timing-label {
  color: var(--dsw-alias-label-tertiary);
  font-size: 0.66rem;
  white-space: nowrap;
}
.dsh-context-track-timing-value {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.28rem;
  min-width: 0;
  font-size: 0.95rem;
  font-weight: 650;
  font-variant-numeric: tabular-nums;
  line-height: 1.25;
}
.dsh-context-track-timing-value .dsh-context-track-muted {
  font-size: 0.8rem;
  font-weight: 500;
}
.dsh-context-track-timing-note {
  color: var(--dsw-alias-label-tertiary);
  font-size: 0.66rem;
  font-weight: 500;
}
.dsh-context-track-timing-later {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding-top: 0.35rem;
  border-top: 1px dashed var(--dsw-alias-border-l2);
}
.dsh-context-track-timing-later-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem;
  min-width: 0;
}
.dsh-context-track-timing-later-row .dsh-context-track-timing-label { font-size: 0.7rem; }
.dsh-context-track-timing-later-row .dsh-context-track-timing-value { font-size: 0.8rem; }

/* ---------- sidecar card ---------- */
.dsh-context-track-side-group {
  display: flex;
  flex-direction: column;
  gap: 0.28rem;
  min-width: 0;
}
.dsh-context-track-side-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem;
  min-width: 0;
  font-size: 0.74rem;
}
.dsh-context-track-side-group + .dsh-context-track-side-group {
  margin-top: 0.55rem;
  padding-top: 0.5rem;
  border-top: 1px dashed var(--dsw-alias-border-l2);
}
.dsh-context-track-side-group + .dsh-context-track-side-row,
.dsh-context-track-side-row + .dsh-context-track-side-row {
  margin-top: 0.32rem;
}
.dsh-context-track-side-label {
  min-width: 0;
  overflow: hidden;
  color: var(--dsw-alias-label-secondary);
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dsh-context-track-side-value {
  flex: 0 0 auto;
  color: var(--dsw-alias-label-primary);
  font-variant-numeric: tabular-nums;
}
.dsh-context-track-side-note {
  margin: 0.1rem 0 0;
  color: var(--dsw-alias-label-tertiary);
  font-size: 0.66rem;
}
.dsh-context-track-side-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}
.dsh-context-track-side-empty {
  margin: 0;
  padding: 0.55rem 0.6rem;
  border: 1px dashed var(--dsw-alias-border-l2);
  border-radius: 0.45rem;
  background: var(--dsw-alias-bg-base);
  color: var(--dsw-alias-label-tertiary);
  font-size: 0.72rem;
  line-height: 1.5;
}
@keyframes dsh-context-track-band-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* ---------- split ---------- */
.dsh-context-track-split {
  position: relative;
  display: flex;
  flex: 1 1 auto;
  flex-direction: row;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}
.dsh-context-track-tree,
.dsh-context-track-detail {
  box-sizing: border-box;
  min-width: 0;
  /* auto would keep each column as tall as its text, so overflow never starts. */
  min-height: 0;
  overflow: auto;
  /* A scrollbar popping in would otherwise shove the wrapped text sideways. */
  scrollbar-gutter: stable;
  padding: 0.6rem 0.75rem;
}
.dsh-context-track-tree {
  container-type: inline-size;
  container-name: tree;
  min-width: 240px;
  border-inline-end: 1px solid var(--dsw-alias-border-l2);
}
.dsh-context-track-detail {
  /* Zero basis keeps the column width on the split ratio. An auto basis grows
     to the JSON pane's max-content and shoves the call tree sideways whenever
     the reading/JSON switch changes the widest line. */
  flex: 1 1 0;
  min-width: 320px;
  background: var(--dsw-alias-bg-base);
}
/* The edge is an 8px hit area with a single hairline down the middle. */
.dsh-context-track-grip {
  box-sizing: border-box;
  flex: 0 0 8px;
  align-self: stretch;
  position: relative;
  z-index: 2;
  margin-inline: -4px;
  cursor: col-resize;
  touch-action: none;
}
.dsh-context-track-grip::before {
  content: "";
  position: absolute;
  inset-block: 0;
  left: 50%;
  width: 1px;
  transform: translateX(-50%);
  background: var(--dsw-alias-border-l2);
}
.dsh-context-track-grip:hover::before,
.dsh-context-track-grip:focus-visible::before,
.dsh-context-track-grip[data-active="true"]::before {
  width: 2px;
  background: var(--dsw-alias-label-tertiary);
}

/* ---------- call tree ---------- */
.dsh-context-track-tree-bar {
  position: sticky;
  top: 0;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  min-height: var(--dsh-tree-bar);
  padding: 0 0.15rem;
  background: var(--dsw-alias-bg-base);
}
.dsh-context-track-tree-title {
  color: var(--dsw-alias-label-tertiary);
  font-size: 0.68rem;
  font-weight: 650;
}
.dsh-context-track-tree-actions {
  display: inline-flex;
  gap: 0.3rem;
}
.dsh-context-track-tree-actions button {
  padding: 0.05rem 0.4rem;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 999px;
  color: var(--dsw-alias-label-tertiary);
  font-size: 0.66rem;
}
.dsh-context-track-tree-actions button:hover {
  color: var(--dsw-alias-label-primary);
}
.dsh-context-track-row {
  position: relative;
  display: grid;
  grid-template-columns: 1rem 1rem minmax(0, 1fr) 3.5rem 6.5rem;
  align-items: center;
  column-gap: 0.25rem;
  min-width: 0;
  min-height: 1.75rem;
  padding-inline: 0.15rem;
  border-radius: 0.375rem;
  color: inherit;
  text-align: start;
  transition: background 120ms ease;
}
.dsh-context-track-row[data-row-kind="turn"] {
  position: sticky;
  top: var(--dsh-tree-bar);
  z-index: 2;
  min-height: 2rem;
  background: var(--dsw-alias-bg-base);
}
.dsh-context-track-row:hover {
  background: var(--dsw-alias-bg-layer-2);
}
.dsh-context-track-row[data-current="true"] {
  background: var(--dsw-alias-interactive-bg-hover);
  box-shadow: inset 2px 0 0 var(--dsw-alias-label-secondary);
}
.dsh-context-track-row[data-status="error"]::before,
.dsh-context-track-row[data-status="aborted"]::before {
  content: "";
  position: absolute;
  inset-block: 0.2rem;
  inset-inline-start: 0;
  width: 2px;
  border-radius: 2px;
  background: var(--dsw-alias-state-error-primary);
}
.dsh-context-track-row-rail {
  display: none;
}
.dsh-context-track-children {
  min-width: 0;
  border-inline-start: 1px solid var(--dsw-alias-border-l2);
  padding-inline-start: 0.25rem;
}
.dsh-context-track-turn-block + .dsh-context-track-turn-block {
  margin-top: 0.6rem;
}
.dsh-context-track-chevron {
  display: inline-grid;
  flex: 0 0 auto;
  place-items: center;
  width: 1rem;
  color: var(--dsw-alias-label-tertiary);
  font-size: 0.65rem;
}
.dsh-context-track-row .dsh-context-track-chevron:hover {
  color: var(--dsw-alias-label-primary);
}
.dsh-context-track-glyph {
  display: inline-grid;
  flex: 0 0 auto;
  place-items: center;
  width: 1rem;
  color: var(--dsw-alias-label-tertiary);
}
.dsh-context-track-row[data-status="error"] .dsh-context-track-glyph,
.dsh-context-track-row[data-status="aborted"] .dsh-context-track-glyph {
  color: var(--dsw-alias-state-error-primary);
}
.dsh-context-track-label {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  min-width: 0;
  overflow: hidden;
  text-align: start;
}
.dsh-context-track-label-text {
  flex: 0 1 auto;
  min-width: 0;
  overflow: hidden;
  font-size: 0.8rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dsh-context-track-label-extra {
  flex: 0 1 auto;
  min-width: 0;
  overflow: hidden;
  font-size: 0.7rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dsh-context-track-summary {
  flex: 0 1 auto;
  min-width: 0;
  overflow: hidden;
  color: var(--dsw-alias-label-tertiary);
  font-size: 0.68rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dsh-context-track-label-status {
  flex: 0 0 auto;
  font-size: 0.68rem;
}
.dsh-context-track-status-ok { color: var(--dsw-alias-state-success-primary); }
.dsh-context-track-status-error,
.dsh-context-track-status-aborted { color: var(--dsw-alias-state-error-primary); }
.dsh-context-track-status-running { color: var(--dsw-alias-label-tertiary); }
.dsh-context-track-dot {
  flex: 0 0 auto;
  width: 0.375rem;
  height: 0.375rem;
  border-radius: 999px;
  background: currentColor;
}
.dsh-context-track-dot[data-status="running"] {
  animation: dsh-context-track-breathe 1600ms ease-in-out infinite;
}
@keyframes dsh-context-track-breathe {
  0%, 100% { box-shadow: 0 0 0 0 color-mix(in srgb, currentColor 45%, transparent); }
  50% { box-shadow: 0 0 0 3px color-mix(in srgb, currentColor 0%, transparent); }
}
.dsh-context-track-col {
  justify-self: end;
  min-width: 0;
  overflow: hidden;
  color: var(--dsw-alias-label-secondary);
  font-size: 0.7rem;
  font-variant-numeric: tabular-nums;
  text-align: end;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/* Number columns shrink with the tree, never with the window. */
@container tree (max-width: 359px) {
  .dsh-context-track-row { grid-template-columns: 1rem 1rem minmax(0, 1fr) 6.5rem; }
  .dsh-context-track-row > [data-column="duration"] { display: none; }
}
@container tree (max-width: 299px) {
  .dsh-context-track-row { grid-template-columns: 1rem 1rem minmax(0, 1fr); }
  .dsh-context-track-row > [data-column="tokens"] { display: none; }
}
/* Tighter rows in the compact and dense tiers. */
.dsh-context-track[data-tier="compact"] .dsh-context-track-row { min-height: 1.625rem; }
.dsh-context-track[data-tier="narrow"] .dsh-context-track-row { min-height: 1.6rem; }
.dsh-context-track[data-tier="dense"] .dsh-context-track-row { min-height: 1.5rem; }
.dsh-context-track[data-tier="dense"] .dsh-context-track-label-text { font-size: 0.75rem; }
.dsh-context-track[data-tier="dense"] .dsh-context-track-head-stat[data-head="elapsed"],
.dsh-context-track[data-tier="dense"] .dsh-context-track-head-watching { display: none; }
/* Narrow headers keep the colored number but drop its label so the chrome still fits. */
.dsh-context-track:not([data-tier="wide"]):not([data-tier="compact"]) .dsh-context-track-head .dsh-context-track-hit-label { display: none; }
.dsh-context-track[data-tier="dense"] .dsh-context-track-head { padding: 0.2rem 0.5rem; gap: 0.35rem; }
/* The dense header keeps the label and the caret; the mark yields the space. */
.dsh-context-track[data-tier="dense"] .dsh-context-track-head-band-icon { display: none; }

/* Narrow panels: the tree is full width and the detail is an overlay. */
.dsh-context-track:not([data-tier="wide"]):not([data-tier="compact"]) .dsh-context-track-tree {
  flex: 1 1 auto;
  min-width: 0;
  border-inline-end: 0;
}
.dsh-context-track-detail[data-overlay="true"] {
  position: absolute;
  inset: 0;
  z-index: 6;
  min-width: 0;
  background: var(--dsw-alias-bg-base);
  animation: dsh-context-track-slide-in 160ms ease-out;
}
@keyframes dsh-context-track-slide-in {
  from { opacity: 0; transform: translateX(8px); }
  to { opacity: 1; transform: translateX(0); }
}
/* Narrow panels expand the band downward as an overlay, never pushing the tree. */
.dsh-context-track:not([data-tier="wide"]):not([data-tier="compact"]) .dsh-context-track-band[data-band="open"] .dsh-context-track-band-panel {
  position: absolute;
  top: 100%;
  inset-inline: 0;
  z-index: 5;
  max-height: 60vh;
  box-shadow: 0 10px 24px color-mix(in srgb, currentColor 18%, transparent);
}

/* ---------- detail header ---------- */
.dsh-context-track-detail-inner {
  min-width: 0;
}
.dsh-context-track-detail-head {
  position: sticky;
  top: 0;
  z-index: 4;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  min-width: 0;
  min-height: 2rem;
  margin: -0.1rem 0 0.55rem;
  padding: 0.2rem 0;
  border-bottom: 1px solid var(--dsw-alias-border-l2);
  background: var(--dsw-alias-bg-base);
}
.dsh-context-track-crumbs {
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  gap: 0.1rem;
  min-width: 0;
  overflow: hidden;
  font-size: 0.72rem;
  white-space: nowrap;
}
.dsh-context-track-crumb {
  display: inline-flex;
  align-items: center;
  min-width: 0;
}
.dsh-context-track-crumb button {
  overflow: hidden;
  color: var(--dsw-alias-label-secondary);
  font-size: 0.72rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dsh-context-track-crumb button:hover {
  color: var(--dsw-alias-label-primary);
  text-decoration: underline;
  text-underline-offset: 0.15em;
}
.dsh-context-track-crumb-sep {
  margin: 0 0.22rem;
  color: var(--dsw-alias-label-tertiary);
}
.dsh-context-track [data-crumb-current] {
  overflow: hidden;
  color: var(--dsw-alias-label-primary);
  font-weight: 600;
  text-overflow: ellipsis;
}
.dsh-context-track-detail-head .dsh-context-track-views {
  flex: 0 0 auto;
  margin: 0;
}
.dsh-context-track-detail-head [data-copy-node],
.dsh-context-track-detail-head [data-detail-close],
.dsh-context-track-detail-head [data-detail-back] {
  flex: 0 0 auto;
  padding: 0.1rem 0.45rem;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 999px;
  color: var(--dsw-alias-label-secondary);
  font-size: 0.7rem;
  white-space: nowrap;
}
.dsh-context-track-detail-head [data-copy-node]:hover,
.dsh-context-track-detail-head [data-detail-close]:hover,
.dsh-context-track-detail-head [data-detail-back]:hover {
  color: var(--dsw-alias-label-primary);
  background: var(--dsw-alias-interactive-bg-hover);
}
.dsh-context-track-detail-body {
  min-width: 0;
  min-height: 0;
}

/* ---------- detail reading ---------- */
.dsh-context-track-card,
.dsh-context-track-block {
  background: var(--dsw-alias-bg-layer-2);
  border: 1px solid var(--dsw-alias-border-l2);
}
.dsh-context-track-block {
  margin: 0 0 0.55rem;
  padding: 0.65rem 0.8rem 0.6rem;
  border-radius: 0.5rem;
}
.dsh-context-track-block[data-category="system"] { border-inline-start: 3px solid var(--dsh-cat-system); }
.dsh-context-track-block[data-category="user"] { border-inline-start: 3px solid var(--dsw-alias-label-secondary); }
.dsh-context-track-block[data-category="injection"] { border-inline-start: 3px solid var(--dsh-cat-injection); }
.dsh-context-track-block[data-category="skill"] { border-inline-start: 3px solid var(--dsh-cat-skill); }
.dsh-context-track-block[data-category="tool-results"] { border-inline-start: 3px solid var(--dsh-cat-results); }
.dsh-context-track-block[data-category="history"] { border-inline-start: 3px solid var(--dsh-cat-history); }
.dsh-context-track-block[data-focus="true"] {
  outline: 1px solid var(--dsw-alias-label-tertiary);
  outline-offset: 1px;
}
/* The first card a call added over the previous call's window: a marked seam
   with a filled badge, so a cumulative window shows where new context starts. */
.dsh-context-track-block[data-new="true"] {
  border-color: color-mix(in srgb, var(--dsw-alias-label-primary) 38%, var(--dsw-alias-border-l2));
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--dsw-alias-label-primary) 10%, transparent);
}
.dsh-context-track-new {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 0.55rem;
}
.dsh-context-track-new-badge {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  padding: 0.08rem 0.5rem;
  border-radius: 999px;
  background: var(--dsw-alias-label-primary);
  color: var(--dsw-alias-bg-base);
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  line-height: 1.4;
}
.dsh-context-track-new-rule {
  flex: 1 1 auto;
  min-width: 1rem;
  height: 1px;
  background: color-mix(in srgb, var(--dsw-alias-label-primary) 34%, transparent);
}
.dsh-context-track-block h3,
.dsh-context-track-section {
  margin: 0 0 0.4rem;
  color: var(--dsw-alias-label-tertiary);
  font-size: 0.7rem;
  font-weight: 650;
}
.dsh-context-track [data-facts] {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 10rem), 1fr));
  gap: 0.6rem 1.1rem;
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  margin: 0 0 0.6rem;
  padding: 0.6rem 0.75rem;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 0.5rem;
  background: var(--dsw-alias-bg-layer-2);
}
.dsh-context-track [data-facts] [data-fact] {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.18rem;
  min-width: 0;
}
.dsh-context-track [data-facts] [data-fact="retry"] {
  grid-column: 1 / -1;
}
.dsh-context-track-fact-label {
  color: var(--dsw-alias-label-tertiary);
  font-size: 0.66rem;
  font-weight: 550;
  line-height: 1.3;
}
.dsh-context-track-fact-value {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem;
  min-width: 0;
  color: var(--dsw-alias-label-primary);
  font-size: 0.8rem;
  font-weight: 620;
  font-variant-numeric: tabular-nums;
  line-height: 1.35;
  overflow-wrap: anywhere;
}
.dsh-context-track-fact-note {
  padding: 0.02rem 0.38rem;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 999px;
  color: var(--dsw-alias-label-tertiary);
  font-size: 0.64rem;
  font-weight: 550;
  line-height: 1.45;
}
.dsh-context-track [data-facts] [data-status="ok"] { color: var(--dsw-alias-state-success-primary); }
.dsh-context-track [data-facts] [data-status="error"],
.dsh-context-track [data-facts] [data-status="aborted"] { color: var(--dsw-alias-state-error-primary); }
.dsh-context-track [data-facts] [data-status="running"] { color: var(--dsw-alias-label-tertiary); }
.dsh-context-track-views {
  display: inline-flex;
  gap: 0.12rem;
  padding: 0.12rem;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 999px;
  background: var(--dsw-alias-bg-layer-2);
}
.dsh-context-track-views button {
  padding: 0.1rem 0.55rem;
  border-radius: 999px;
  font-size: 0.7rem;
  color: var(--dsw-alias-label-secondary);
}
.dsh-context-track-views button[aria-pressed="true"] {
  color: var(--dsw-alias-label-primary);
  background: var(--dsw-alias-interactive-bg-hover);
}
.dsh-context-track-pre {
  margin: 0;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  font-family: ui-monospace, monospace;
}
.dsh-context-track-badge {
  color: var(--dsw-alias-label-secondary);
  font-size: 0.72rem;
}
.dsh-context-track-hero {
  display: none;
}

/* ---------- category list (expanded band) ---------- */
.dsh-context-track-cats {
  display: grid;
  grid-template-columns: max-content minmax(0, 1fr) max-content;
  column-gap: 0.45rem;
  row-gap: 0.3rem;
  margin: 0.35rem 0 0;
  padding: 0;
  list-style: none;
  min-width: 0;
}
.dsh-context-track-cats > li {
  display: grid;
  grid-column: 1 / -1;
  grid-template-columns: subgrid;
  align-items: center;
  min-width: 0;
  row-gap: 0.2rem;
}
.dsh-context-track-cat-line {
  display: grid;
  grid-column: 1 / -1;
  grid-template-columns: subgrid;
  align-items: center;
  min-width: 0;
  min-height: 1.25rem;
  padding-block: 0.08rem;
  border-radius: 0.3rem;
}
.dsh-context-track-cat-line[data-fold="true"] {
  cursor: pointer;
}
.dsh-context-track-cat-line[data-fold="true"]:hover {
  background: var(--dsw-alias-interactive-bg-hover);
}
.dsh-context-track-cat-name {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.25rem;
  min-width: 0;
}
.dsh-context-track-cat-name > span:first-child {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dsh-context-track button.dsh-context-track-cat-toggle {
  display: inline-grid;
  box-sizing: border-box;
  flex: 0 0 auto;
  place-items: center;
  width: 1.05rem;
  height: 1.05rem;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 999px;
  background: var(--dsw-alias-bg-layer-2);
  color: var(--dsw-alias-label-secondary);
}
.dsh-context-track-cat-line[data-fold="true"]:hover button.dsh-context-track-cat-toggle,
.dsh-context-track-cats > li[data-open="true"] button.dsh-context-track-cat-toggle,
.dsh-context-track button.dsh-context-track-cat-toggle:focus-visible {
  color: var(--dsw-alias-label-primary);
  border-color: var(--dsw-alias-label-tertiary);
  background: var(--dsw-alias-bg-layer-2);
}
.dsh-context-track button.dsh-context-track-cat-toggle:focus-visible {
  outline: 1px solid var(--dsw-alias-label-tertiary);
  outline-offset: 1px;
}
.dsh-context-track-cat-caret {
  width: 0.65rem;
  height: 0.65rem;
  transition: transform 160ms ease;
}
.dsh-context-track-cats > li[data-open="true"] .dsh-context-track-cat-caret {
  transform: rotate(90deg);
}
.dsh-context-track-cat-line > .dsh-context-track-num {
  justify-self: end;
}
.dsh-context-track-cat {
  display: block;
  height: 0.35rem;
  border-radius: 999px;
  background: var(--dsw-alias-bg-base);
}
.dsh-context-track-cat i {
  display: block;
  height: 100%;
  border-radius: inherit;
}
.dsh-context-track-cats [data-hue="tools"] i { background: var(--dsh-cat-tools); }
.dsh-context-track-cats [data-hue="results"] i { background: var(--dsh-cat-results); }
.dsh-context-track-cats [data-hue="system"] i { background: var(--dsh-cat-system); }
.dsh-context-track-cats [data-hue="skill"] i { background: var(--dsh-cat-skill); }
.dsh-context-track-cats [data-hue="history"] i { background: var(--dsh-cat-history); }
.dsh-context-track-cats [data-hue="injection"] i { background: var(--dsh-cat-injection); }
.dsh-context-track-cats [data-hue="neutral"] i { background: var(--dsh-cat-neutral); }
.dsh-context-track-tools {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-width: 0;
  margin: 0.1rem 0 0.3rem;
}
.dsh-context-track-cats li > .dsh-context-track-tools {
  grid-column: 1 / -1;
  box-sizing: border-box;
  margin: 0.1rem 0 0.25rem 0.45rem;
  padding: 0.25rem 0 0.1rem 0.55rem;
  border-left: 1px solid var(--dsw-alias-border-l2);
}
.dsh-context-track-cats > li[data-open="true"] {
  row-gap: 0.3rem;
}
.dsh-context-track-tools-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem;
}
.dsh-context-track-tools-head h3 {
  margin: 0;
  color: var(--dsw-alias-label-tertiary);
  font-size: 0.7rem;
  font-weight: 650;
}
.dsh-context-track-tools-count {
  color: var(--dsw-alias-label-tertiary);
  font-size: 0.7rem;
  font-variant-numeric: tabular-nums;
}
.dsh-context-track-tools-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.3rem;
}
.dsh-context-track-tools-bar input {
  flex: 1 1 6rem;
  min-width: 0;
  box-sizing: border-box;
  margin: 0;
  padding: 0.18rem 0.5rem;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 999px;
  background: var(--dsw-alias-bg-layer-2);
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: 0.72rem;
}
.dsh-context-track-tools-bar input::placeholder {
  color: var(--dsw-alias-label-tertiary);
}
.dsh-context-track-tools-bar input:focus {
  outline: 1px solid var(--dsw-alias-label-tertiary);
  outline-offset: 1px;
}
.dsh-context-track-tools-sort {
  display: inline-flex;
  flex: 0 0 auto;
  padding: 0.08rem;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 999px;
  background: var(--dsw-alias-bg-layer-2);
}
.dsh-context-track-tools-sort button {
  padding: 0.06rem 0.4rem;
  border-radius: 999px;
  font-size: 0.7rem;
  color: var(--dsw-alias-label-secondary);
}
.dsh-context-track-tools-sort button[aria-pressed="true"] {
  color: var(--dsw-alias-label-primary);
  background: var(--dsw-alias-interactive-bg-hover);
}
.dsh-context-track-tool-chart {
  display: flex;
  flex-direction: column;
  gap: 0.22rem;
  margin: 0;
  padding: 0;
  list-style: none;
}
.dsh-context-track-tool-chart li {
  display: grid;
  grid-template-columns: minmax(4.25rem, 7rem) minmax(2rem, 1fr) auto;
  gap: 0.35rem;
  align-items: center;
  min-width: 0;
}
.dsh-context-track-tool-name {
  overflow: hidden;
  color: var(--dsw-alias-label-primary);
  font-size: 0.72rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dsh-context-track-tool-calls {
  margin-left: 0.25rem;
  color: var(--dsw-alias-label-tertiary);
  font-size: 0.66rem;
}
.dsh-context-track-tool-meter {
  display: block;
  height: 0.35rem;
  overflow: hidden;
  border-radius: 999px;
  background: var(--dsw-alias-bg-base);
}
.dsh-context-track-tool-meter i {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: var(--dsh-cat-tools);
}
.dsh-context-track-tools[data-hue="injection"] .dsh-context-track-tool-meter i { background: var(--dsh-cat-injection); }
.dsh-context-track-tools[data-hue="skill"] .dsh-context-track-tool-meter i { background: var(--dsh-cat-skill); }
.dsh-context-track-tools button[data-remaining] {
  align-self: flex-start;
  padding: 0.06rem 0.4rem;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 999px;
  font-size: 0.7rem;
  color: var(--dsw-alias-label-secondary);
}
.dsh-context-track-tools button[data-remaining]:hover {
  color: var(--dsw-alias-label-primary);
  background: var(--dsw-alias-interactive-bg-hover);
}
.dsh-context-track-tools-overhead {
  margin: 0;
  color: var(--dsw-alias-label-secondary);
  font-size: 0.72rem;
}
.dsh-context-track button.dsh-context-track-gap {
  margin-top: 0.3rem;
  padding: 0.06rem 0.4rem;
  background: transparent;
  border: 1px dashed var(--dsw-alias-border-l2);
  border-radius: 999px;
  color: var(--dsw-alias-label-secondary);
  font-size: 0.7rem;
}
.dsh-context-track button.dsh-context-track-gap[data-active="true"] {
  border-color: var(--dsw-alias-state-error-primary);
  color: var(--dsw-alias-state-error-primary);
}
.dsh-context-track-output-meta {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 0.3rem;
}
.dsh-context-track-output-meta h3 {
  margin: 0;
  color: var(--dsw-alias-label-tertiary);
  font-size: 0.7rem;
  font-weight: 650;
}
.dsh-context-track-output-meta .dsh-context-track-num {
  font-size: 0.72rem;
}
.dsh-context-track-output-tokens {
  display: inline-flex;
  align-items: baseline;
  gap: 0.3rem;
  color: var(--dsw-alias-label-secondary);
  font-size: 0.72rem;
}
.dsh-context-track-output-call {
  margin-top: 0.55rem;
  padding-top: 0.45rem;
  border-top: 1px solid var(--dsw-alias-border-l2);
}
.dsh-context-track-output-call-name {
  margin: 0 0 0.2rem;
  font-size: 0.75rem;
  font-weight: 650;
}
.dsh-context-track-output-call [data-json-view] {
  margin: 0;
}
.dsh-context-track-detail .dsh-context-track-output-meta button[data-open-json] {
  margin: 0 0 0 auto;
}
.dsh-context-track-reasoning {
  color: var(--dsw-alias-label-tertiary);
}
.dsh-context-track-detail button[data-more],
.dsh-context-track-detail button[data-open-json] {
  margin-top: 0.35rem;
  margin-inline-end: 0.3rem;
  padding: 0.08rem 0.45rem;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 999px;
  font-size: 0.7rem;
  color: var(--dsw-alias-label-secondary);
}
.dsh-context-track-detail button[data-more]:hover,
.dsh-context-track-detail button[data-open-json]:hover {
  color: var(--dsw-alias-label-primary);
  background: var(--dsw-alias-interactive-bg-hover);
}
.dsh-context-track-meta {
  display: block;
  margin: 0 0 0.45rem;
  padding-bottom: 0.4rem;
  border-bottom: 1px solid var(--dsw-alias-border-l2);
}
.dsh-context-track-meta tbody {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.15rem 0.8rem;
}
.dsh-context-track-meta tr {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
}
.dsh-context-track-meta th,
.dsh-context-track-meta td {
  padding: 0;
  text-align: start;
  vertical-align: baseline;
}
.dsh-context-track-meta th {
  color: var(--dsw-alias-label-tertiary);
  font-size: 0.66rem;
  font-weight: 550;
}
.dsh-context-track-meta td {
  font-size: 0.77rem;
}
/* The body follows the card's width, so a wide pane is not half empty; the
   card's own padding is the only inset. */
.dsh-context-track-prose {
  min-width: 0;
  line-height: 1.62;
  font-size: 0.84rem;
  overflow-wrap: break-word;
  text-wrap: pretty;
}
.dsh-context-track-prose :is(h1, h2, h3, h4) {
  margin: 1.1rem 0 0.45rem;
  color: var(--dsw-alias-label-primary);
  font-size: 0.95rem;
  font-weight: 650;
  line-height: 1.35;
}
.dsh-context-track-prose :is(ul, ol, blockquote, pre) {
  margin: 0.7rem 0;
}
/* Reading keeps one line per source line, so a single newline stays visible:
   lines in one source paragraph sit closer than blank-line separated blocks. */
.dsh-context-track-prose p {
  margin: 0.5rem 0;
}
.dsh-context-track-prose > * + p[data-line="first"] {
  margin-top: 1rem;
}
.dsh-context-track-prose > :first-child {
  margin-top: 0;
}
.dsh-context-track-prose > :last-child {
  margin-bottom: 0;
}
.dsh-context-track-prose :is(ul, ol) {
  padding-inline-start: 1.1rem;
}
.dsh-context-track-prose li + li {
  margin-top: 0.3rem;
}
.dsh-context-track-prose li p {
  margin: 0.15rem 0;
}
.dsh-context-track-prose blockquote p {
  margin: 0.2rem 0;
}
.dsh-context-track-prose blockquote {
  padding-inline-start: 0.65rem;
  border-inline-start: 2px solid var(--dsw-alias-border-l2);
  color: var(--dsw-alias-label-secondary);
}
.dsh-context-track-prose pre {
  padding: 0.4rem 0.55rem;
  overflow-x: auto;
  border-radius: 0.3rem;
  background: var(--dsw-alias-bg-base);
}
.dsh-context-track-prose :not(pre) > code {
  padding: 0.04rem 0.25rem;
  border-radius: 0.2rem;
  background: var(--dsw-alias-bg-base);
}
.dsh-context-track-prose :is(pre, code) {
  font-family: ui-monospace, monospace;
  font-size: 0.82em;
}
.dsh-context-track-prose a {
  color: var(--dsw-alias-label-primary);
  text-decoration: underline;
  text-underline-offset: 0.15em;
}
.dsh-context-track-json-tools {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.4rem;
  margin: 0 0 0.55rem;
  padding: 0.2rem;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 999px;
  background: var(--dsw-alias-bg-layer-2);
}
.dsh-context-track-json-tools button {
  padding: 0.15rem 0.6rem;
  border: 0;
  border-radius: 999px;
  font-size: 0.72rem;
  color: var(--dsw-alias-label-secondary);
}
.dsh-context-track-json-tools button:hover {
  color: var(--dsw-alias-label-primary);
  background: var(--dsw-alias-interactive-bg-hover);
}
.dsh-context-track-json-tools button[data-copy-json] {
  color: var(--dsw-alias-label-primary);
  background: var(--dsw-alias-interactive-bg-hover);
}
.dsh-context-track-json-bulk {
  display: inline-flex;
  gap: 0.1rem;
  padding: 0.08rem;
  border-radius: 999px;
  background: var(--dsw-alias-bg-base);
}
.dsh-context-track-json-source {
  font-family: ui-monospace, monospace;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
.dsh-context-track-json-line {
  display: block;
}
.dsh-context-track-json-line > .dsh-context-track-chevron {
  display: inline-grid;
  width: 1ch;
  height: auto;
  min-height: 0;
  vertical-align: baseline;
}
.dsh-context-track-json-nest {
  padding-inline-start: 2ch;
}
.dsh-context-track-json-string[data-truncated="true"] {
  display: inline-block;
  max-width: 24rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
}
.dsh-context-track-json-key { color: var(--dsh-json-key); }
.dsh-context-track-json-string { color: var(--dsh-json-string); }
.dsh-context-track-json-number { color: var(--dsh-json-number); }
.dsh-context-track-json-boolean { color: var(--dsh-json-boolean); }
.dsh-context-track-json-null { color: var(--dsh-json-boolean); font-style: italic; }
.dsh-context-track-facts {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 0.2rem 0.7rem;
  margin: 0;
}
.dsh-context-track-facts dt {
  color: var(--dsw-alias-label-secondary);
}

/* Motion is short and always skippable. */
.dsh-context-track-cat-caret,
.dsh-context-track-row,
.dsh-context-track button.dsh-context-track-turn {
  transition-duration: 140ms;
}
@media (prefers-reduced-motion: reduce) {
  .dsh-context-track * {
    transition: none !important;
    animation: none !important;
  }
}
/*
 * Conversation tab: the chat composer is a sticky sibling of this full-height
 * pane and paints over it. Hide that seat while the pane is mounted, and leave
 * it when it is holding an approval, a
 * question, or a plan review. Width handles are following siblings of the
 * scroller, so a descendant combinator would match nothing.
 */
[data-conversation-scroll]:has(.dsh-context-track) > [data-composer-seat]:not(:has([data-approval-key], [data-question-key], [data-plan-review-key])) {
  display: none;
}
[data-conversation-scroll]:has(.dsh-context-track) ~ [data-width-handle] {
  display: none;
}
`;
		let installed = false;
		/** Inject the panel stylesheet once. A later bundle replaces the text in place. */
		function ensureStyles() {
			if (installed || typeof document === "undefined") return;
			const current = document.querySelector("style[data-dsh-context-track]");
			if (current !== null) {
				if (current.textContent !== traceCss) current.textContent = traceCss;
				installed = true;
				return;
			}
			const style = document.createElement("style");
			style.dataset.dshContextTrack = "";
			style.textContent = traceCss;
			document.head.appendChild(style);
			installed = true;
		}
		//#endregion
		//#region src/client/TimingCard.tsx
		function TimingCard({ report, t }) {
			const { timing } = report;
			const opening = timing.firstResponses.find((item) => item.opening);
			const later = timing.firstResponses.filter((item) => !item.opening);
			const total = timing.elapsed.basis === "absent" ? void 0 : timing.elapsed.value;
			const wait = timing.wait.value;
			const think = timing.think.value;
			const segments = total !== void 0 && total > 0 ? [
				{
					key: "wait",
					value: Math.max(wait ?? 0, 0)
				},
				{
					key: "think",
					value: Math.max(think ?? 0, 0)
				},
				{
					key: "rest",
					value: Math.max(total - (wait ?? 0) - (think ?? 0), 0)
				}
			].filter((segment) => segment.value > 0) : [];
			const summary = segments.map((segment) => `${segmentLabel(segment.key, t)} ${formatDuration(segment.value).text}`).join(" · ");
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "dsh-context-track-timing",
				"data-card": "timing",
				children: [
					segments.length > 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "dsh-context-track-timing-bar",
						"data-time-bar": true,
						role: "img",
						"aria-label": summary,
						children: segments.map((segment) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							"data-time-seg": segment.key,
							title: `${segmentLabel(segment.key, t)} ${formatDuration(segment.value).text}`,
							style: { flexGrow: segment.value }
						}, segment.key))
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "dsh-context-track-timing-legend",
						"data-time-legend": true,
						children: segments.map((segment) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							className: "dsh-context-track-timing-legend-item",
							"data-time-key": segment.key,
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("i", { "aria-hidden": "true" }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: segmentLabel(segment.key, t) }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("b", {
									className: "dsh-context-track-num",
									children: formatDuration(segment.value).text
								})
							]
						}, segment.key))
					})] }) : null,
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "dsh-context-track-timing-grid",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(TimeCell, {
								name: "elapsed",
								label: t("elapsed"),
								figure: timing.elapsed,
								note: timing.elapsedRunning ? t("running") : void 0,
								t
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(TimeCell, {
								name: "wait",
								label: t("wait"),
								figure: timing.wait,
								t
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(TimeCell, {
								name: "think",
								label: t("think"),
								figure: timing.think,
								t
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "dsh-context-track-timing-cell",
								"data-first": "title",
								"data-time": "first",
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: "dsh-context-track-timing-label",
										children: t("firstResponse")
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: "dsh-context-track-timing-value",
										children: opening === void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(FigureView, {
											figure: { basis: "absent" },
											t
										}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(FigureView, {
											figure: opening.duration,
											t,
											showBasis: false,
											unseen: opening.pending,
											format: durationFormat
										})
									}),
									opening?.noUserMessage ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: "dsh-context-track-timing-note",
										children: t("noUser")
									}) : null
								]
							})
						]
					}),
					later.length > 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "dsh-context-track-timing-later",
						"data-time-later": true,
						children: later.map((item) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "dsh-context-track-timing-later-row",
							"data-first": "later",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "dsh-context-track-timing-label",
								children: t("laterInput")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "dsh-context-track-timing-value",
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(FigureView, {
									figure: item.duration,
									t,
									showBasis: false,
									unseen: item.pending,
									format: durationFormat
								})
							})]
						}, item.seq))
					}) : null
				]
			});
		}
		/** Every bar segment and its legend entry share one name. */
		function segmentLabel(key, t) {
			if (key === "wait") return t("wait");
			if (key === "think") return t("think");
			return t("timingRest");
		}
		function TimeCell({ name, label, figure, note, t }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "dsh-context-track-timing-cell",
				"data-time": name,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: "dsh-context-track-timing-label",
					children: label
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
					className: "dsh-context-track-timing-value",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(FigureView, {
						figure,
						t,
						showBasis: false,
						format: durationFormat
					}), note !== void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: "dsh-context-track-timing-note",
						"data-running": true,
						children: note
					}) : null]
				})]
			});
		}
		function durationFormat(value) {
			return formatDuration(value);
		}
		/** Largest entries first. Search runs before the preview cut. */
		function ToolList({ tools, overhead, category = "tools", t, nested = false }) {
			const [query, setQuery] = (0, react.useState)("");
			const [sort, setSort] = (0, react.useState)("size");
			const [showAll, setShowAll] = (0, react.useState)(false);
			if (tools.length === 0 && overhead === void 0) return null;
			const nameKey = category === "tools" ? "catTools" : category === "skill" ? "catSkill" : "catInjection";
			const searchKey = category === "tools" ? "searchTools" : category === "skill" ? "searchSkill" : "searchInjection";
			const overheadKey = category === "skill" ? "skillOverhead" : "overhead";
			const needle = query.trim().toLowerCase();
			const ordered = [...needle.length === 0 ? [...tools] : tools.filter((tool) => tool.name.toLowerCase().includes(needle))].sort((left, right) => compareTools(left, right, sort));
			const shown = showAll ? ordered : ordered.slice(0, 5);
			const rest = ordered.length - shown.length;
			const peak = Math.max(1, ...tools.map((tool) => tool.tokens));
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
				"data-category": category,
				"data-breakdown": true,
				className: "dsh-context-track-tools",
				"data-sort": sort,
				"data-hue": category,
				"data-nested": nested ? "true" : void 0,
				children: [
					nested ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "dsh-context-track-tools-head",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: t(nameKey) }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: "dsh-context-track-tools-count",
							children: ordered.length
						})]
					}),
					tools.length > 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "dsh-context-track-tools-bar",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
								"aria-label": t(searchKey),
								placeholder: t(searchKey),
								value: query,
								onChange: (event) => {
									setQuery(event.target.value);
								}
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "dsh-context-track-tools-sort",
								role: "group",
								"aria-label": t(nameKey),
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-pressed": sort === "size",
									onClick: () => {
										setSort("size");
									},
									children: t("sortSize")
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-pressed": sort === "name",
									onClick: () => {
										setSort("name");
									},
									children: t("sortName")
								})]
							}),
							nested ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "dsh-context-track-tools-count",
								children: ordered.length
							}) : null
						]
					}) : null,
					shown.length > 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ol", {
						className: "dsh-context-track-tool-chart",
						children: shown.map((tool) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", {
							"data-tool": tool.name,
							...tool.calls !== void 0 ? { "data-calls": tool.calls } : {},
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
									className: "dsh-context-track-tool-name",
									title: tool.name,
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: tool.name }), category !== "tools" && tool.calls !== void 0 && (category !== "skill" || tool.calls > 1) ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("small", {
										className: "dsh-context-track-tool-calls",
										children: t("entries").replace("{n}", String(tool.calls))
									}) : null]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: "dsh-context-track-tool-meter",
									"aria-hidden": "true",
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("i", { style: {
										width: `${tool.tokens / peak * 100}%`,
										...tool.tokens > 0 ? { minWidth: "2px" } : {}
									} })
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)(FigureView, {
									figure: {
										basis: "estimated",
										value: tool.tokens
									},
									t,
									showBasis: false
								})
							]
						}, tool.name))
					}) : needle.length > 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "dsh-context-track-muted",
						children: t(category === "tools" ? "noToolMatch" : "noMatch")
					}) : null,
					rest > 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						"data-remaining": rest,
						onClick: () => {
							setShowAll(true);
						},
						children: t("remaining").replace("{n}", String(rest))
					}) : null,
					overhead !== void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
						className: "dsh-context-track-tools-overhead",
						"data-overhead": true,
						children: [
							t(overheadKey),
							" ",
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(FigureView, {
								figure: {
									basis: "estimated",
									value: overhead
								},
								t,
								showBasis: false
							})
						]
					}) : null
				]
			});
		}
		function compareTools(left, right, sort) {
			if (sort === "name") return left.name.localeCompare(right.name) || right.tokens - left.tokens;
			return right.tokens - left.tokens || left.name.localeCompare(right.name);
		}
		//#endregion
		//#region src/client/TokenCard.tsx
		/**
		* Context summary band. Collapsed it is one line: a stacked make-up bar, a
		* legend, and the expand control. Expanded it is a grid of make-up, timing,
		* and sidecars that scrolls on its own.
		*/
		/** Identity, not rank. A seventh category keeps its name and a neutral bar. */
		const HUE = {
			tools: "tools",
			"tool-results": "results",
			system: "system",
			skill: "skill",
			history: "history",
			injection: "injection",
			user: "neutral"
		};
		/** Tool rows follow the user row. The rest of the window stays ranked by size. */
		const AFTER_USER = /* @__PURE__ */ new Set(["tool-results", "tools"]);
		/** Only four legend entries before the rest fold into `+N`. */
		const LEGEND_PREVIEW = 4;
		function bySize(left, right) {
			return right.tokens - left.tokens || left.id.localeCompare(right.id);
		}
		function composeRows(categories) {
			const head = categories.filter((category) => !AFTER_USER.has(category.id)).sort(bySize);
			const tail = categories.filter((category) => AFTER_USER.has(category.id)).sort(bySize);
			const userAt = head.findIndex((category) => category.id === "user");
			if (userAt < 0) return [...head, ...tail];
			return [
				...head.slice(0, userAt + 1),
				...tail,
				...head.slice(userAt + 1)
			];
		}
		function reclaimedOf(events) {
			const parts = events.filter((event) => event.kind === "compaction" && event.tokens?.value !== void 0);
			if (parts.length === 0) return void 0;
			return {
				basis: parts.every((event) => event.tokens?.basis === "estimated") ? "estimated" : "usage",
				value: parts.reduce((sum, event) => sum + (event.tokens?.value ?? 0), 0)
			};
		}
		function compactionPresent(report) {
			return report.consumption.compaction.basis !== "absent" || report.events.some((event) => event.kind === "compaction");
		}
		function titlePresent(report) {
			return report.consumption.title !== void 0 || report.events.some((event) => event.kind === "title");
		}
		function ContextBand({ report, open, activeSeq, titleName, trackOf, t, onCategory, onGap }) {
			const { consumption, window } = report;
			const ranked = composeRows(window.categories);
			const [allLegend, setAllLegend] = (0, react.useState)(false);
			const [detailOpen, setDetailOpen] = (0, react.useState)({});
			const details = {
				tools: window.toolDefinitions,
				injection: window.injections ?? [],
				skill: window.skills ?? []
			};
			const overheadOf = (id) => id === "tools" ? window.definitionOverhead : id === "skill" ? window.skillOverhead : void 0;
			const hasDetail = (id) => (details[id]?.length ?? 0) > 0 || overheadOf(id) !== void 0;
			const toggleDetail = (id) => {
				setDetailOpen((current) => ({
					...current,
					[id]: current[id] !== true
				}));
			};
			const reclaimed = reclaimedOf(report.events);
			const gaps = report.events.filter((event) => event.kind === "compaction" && event.inWindow);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "dsh-context-track-band",
				"data-band": open ? "open" : "closed",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "dsh-context-track-band-line",
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: "dsh-context-track-band-caption",
							children: t("blockCompose")
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(StackedBar, {
							ranked,
							gaps,
							activeSeq,
							t,
							onCategory,
							onGap
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Legend, {
							ranked,
							all: allLegend,
							t,
							onMore: () => {
								setAllLegend((value) => !value);
							},
							onCategory
						})
					]
				}), open ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "dsh-context-track-band-panel",
					"data-band-panel": true,
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
							"data-block": "compose",
							className: "dsh-context-track-band-block",
							"aria-label": t("blockCompose"),
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
									className: "dsh-context-track-band-figures",
									"data-figures": true,
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
											"data-stat": "input",
											children: [
												t("input"),
												" ",
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)(FigureView, {
													figure: consumption.input,
													t,
													showBasis: false
												})
											]
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
											"data-stat": "output",
											children: [
												t("output"),
												" ",
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)(FigureView, {
													figure: consumption.output,
													t,
													showBasis: false,
													pending: report.outputPending
												})
											]
										}),
										consumption.reasoning.basis === "absent" ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
											"data-stat": "reasoning",
											children: [
												t("reasoningBlock"),
												" ",
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)(FigureView, {
													figure: consumption.reasoning,
													t,
													showBasis: false
												})
											]
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)(HitRateBadge, {
											figure: consumption.hitRate,
											t,
											stat: "hit"
										})
									]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("ol", {
									className: "dsh-context-track-cats",
									"data-compose": true,
									children: ranked.map((category) => {
										const detailCategory = category.id === "tools" || category.id === "injection" || category.id === "skill" ? category.id : void 0;
										const fold = detailCategory !== void 0 && hasDetail(detailCategory);
										const expanded = fold && detailOpen[detailCategory] === true;
										const name = t(CATEGORY_KEY[category.id]);
										return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", {
											"data-category": category.id,
											"data-hue": HUE[category.id],
											"data-open": fold ? expanded ? "true" : "false" : void 0,
											children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
												className: "dsh-context-track-cat-line",
												"data-fold": fold ? "true" : void 0,
												onClick: fold ? () => {
													toggleDetail(detailCategory);
												} : void 0,
												children: [
													/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
														className: "dsh-context-track-cat-name",
														children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: name }), fold ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
															type: "button",
															className: "dsh-context-track-cat-toggle",
															"aria-expanded": expanded,
															"aria-label": name,
															onClick: (event) => {
																event.stopPropagation();
																toggleDetail(detailCategory);
															},
															children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Caret, {})
														}) : null]
													}),
													/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
														className: `dsh-context-track-cat dsh-context-track-cat-${HUE[category.id]}`,
														children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("i", { style: { width: `${barShare(ranked, category)}%` } })
													}),
													/* @__PURE__ */ (0, react_jsx_runtime.jsx)(FigureView, {
														figure: {
															basis: "estimated",
															value: category.tokens
														},
														t,
														showBasis: false
													})
												]
											}), expanded ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ToolList, {
												tools: details[detailCategory] ?? [],
												overhead: overheadOf(detailCategory),
												category: detailCategory,
												t,
												nested: true
											}) : null]
										}, category.id);
									})
								}),
								hasDetail("tools") && !ranked.some((category) => category.id === "tools") ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ToolList, {
									tools: window.toolDefinitions,
									overhead: window.definitionOverhead,
									t
								}) : null
							]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
							"data-block": "timing",
							className: "dsh-context-track-band-block",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: t("blockTiming") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(TimingCard, {
								report,
								t
							})]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
							"data-block": "side",
							className: "dsh-context-track-band-block",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: t("blockSide") }),
								!compactionPresent(report) && !titlePresent(report) && report.subagents.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
									className: "dsh-context-track-side-empty",
									"data-side-empty": true,
									children: t("sideEmpty")
								}) : null,
								titlePresent(report) ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "dsh-context-track-side-group",
									"data-title": true,
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
											className: "dsh-context-track-side-row",
											children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: "dsh-context-track-side-label",
												children: t("title")
											}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: "dsh-context-track-side-value",
												"data-session-name": true,
												children: titleName !== void 0 && titleName.length > 0 ? titleName : t("titleMissing")
											})]
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
											className: "dsh-context-track-side-note",
											children: t("titleExcluded")
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
											className: "dsh-context-track-side-links",
											children: report.events.filter((event) => event.kind === "title").map((event) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
												type: "button",
												className: "dsh-context-track-gap",
												"data-seq": event.seq,
												"data-active": activeSeq === event.seq ? "true" : void 0,
												onClick: () => {
													onGap(event.seq);
												},
												children: t("title")
											}, event.seq))
										})
									]
								}) : null,
								compactionPresent(report) ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "dsh-context-track-side-group",
									"data-compaction": true,
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
											className: "dsh-context-track-side-row",
											children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: "dsh-context-track-side-label",
												children: t("reclaimed")
											}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: "dsh-context-track-side-value",
												children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(FigureView, {
													figure: reclaimed ?? { basis: "absent" },
													t
												})
											})]
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
											className: "dsh-context-track-side-row",
											children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: "dsh-context-track-side-label",
												children: t("compactionCost")
											}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: "dsh-context-track-side-value",
												children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(FigureView, {
													figure: consumption.compaction,
													t
												})
											})]
										}),
										consumption.compaction.basis !== "absent" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
											className: "dsh-context-track-side-note",
											children: t("compactionIncluded")
										}) : null,
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
											className: "dsh-context-track-side-links",
											children: report.events.filter((event) => event.kind === "compaction").map((event) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
												type: "button",
												className: "dsh-context-track-gap",
												"data-seq": event.seq,
												"data-active": activeSeq === event.seq ? "true" : void 0,
												onClick: () => {
													onGap(event.seq);
												},
												children: t("kindCompaction")
											}, event.seq))
										})
									]
								}) : null,
								report.subagents.map((child) => {
									const usage = sessionUsage(trackOf(child.sessionId)?.root ?? []);
									return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: "dsh-context-track-side-row",
										"data-subagent": child.sessionId,
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
											className: "dsh-context-track-side-label",
											children: [
												t("subagentLine"),
												" ",
												child.label ?? child.sessionId
											]
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: "dsh-context-track-side-value",
											children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(FigureView, {
												figure: usage,
												t,
												showBasis: false
											})
										})]
									}, child.sessionId);
								})
							]
						})
					]
				}) : null]
			});
		}
		function barShare(ranked, category) {
			const peak = ranked.reduce((max, item) => Math.max(max, item.tokens), 0);
			return peak > 0 ? category.tokens / peak * 100 : 0;
		}
		function StackedBar({ ranked, gaps, activeSeq, t, onCategory, onGap }) {
			const visible = ranked.filter((category) => category.tokens > 0);
			if (visible.length === 0 && gaps.length === 0) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: "dsh-context-track-band-bar",
				"data-compose-bar": true,
				"data-empty": "true"
			});
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
				className: "dsh-context-track-band-bar",
				"data-compose-bar": true,
				role: "group",
				"aria-label": t("compose"),
				children: [visible.map((category) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
					type: "button",
					className: "dsh-context-track-band-seg",
					"data-category": category.id,
					"data-hue": HUE[category.id],
					style: { flexGrow: category.tokens },
					title: `${t(CATEGORY_KEY[category.id])} ${abbreviate(category.tokens).text}`,
					onClick: () => {
						onCategory(category.id);
					}
				}, category.id)), gaps.map((event) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
					type: "button",
					className: "dsh-context-track-band-gap",
					"data-gap-seq": event.seq,
					"data-active": activeSeq === event.seq ? "true" : void 0,
					title: t("compaction"),
					onClick: () => {
						onGap(event.seq);
					}
				}, `gap-${event.seq}`))]
			});
		}
		function Legend({ ranked, all, t, onMore, onCategory }) {
			if (ranked.length === 0) return null;
			const order = [...ranked].sort(bySize);
			const shown = all ? order : order.slice(0, LEGEND_PREVIEW);
			const rest = order.length - shown.length;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
				className: "dsh-context-track-legend",
				"data-legend-list": true,
				children: [shown.map((category) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "dsh-context-track-legend-item",
					"data-legend": category.id,
					"data-hue": HUE[category.id],
					onClick: () => {
						onCategory(category.id);
					},
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("i", { "aria-hidden": "true" }),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t(CATEGORY_KEY[category.id]) }),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("b", {
							className: "dsh-context-track-num",
							children: abbreviate(category.tokens).text
						})
					]
				}, category.id)), rest > 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
					type: "button",
					className: "dsh-context-track-legend-more",
					"data-legend-more": true,
					onClick: onMore,
					children: `+${rest}`
				}) : null]
			});
		}
		/** Same glyph either way; the row rotates it, so open and closed stay the same width. */
		function Caret() {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
				className: "dsh-context-track-cat-caret",
				viewBox: "0 0 16 16",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
					d: "M6 4.25 10.25 8 6 11.75",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "1.6",
					strokeLinecap: "round",
					strokeLinejoin: "round"
				})
			});
		}
		//#endregion
		//#region src/client/Tree.tsx
		/** Render one session's index, nesting a child session's own index under its tool. */
		function Tree(props) {
			const { track, t } = props;
			const depth = props.depth ?? 0;
			if (track === void 0) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
				className: "dsh-context-track-muted",
				children: t("unavailable")
			});
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				role: depth === 0 ? "tree" : "group",
				"aria-label": depth === 0 ? t("treeTitle") : void 0,
				"data-tree": depth === 0 ? "root" : void 0,
				children: [depth === 0 && props.onBulk !== void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "dsh-context-track-tree-bar",
					"data-tree-bar": true,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: "dsh-context-track-tree-title",
						children: t("treeTitle")
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
						className: "dsh-context-track-tree-actions",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							"data-bulk": "expand",
							onClick: () => {
								props.onBulk?.(true, collectKeys(props.sessionId, track, props.trackOf));
							},
							children: t("expandAll")
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							"data-bulk": "collapse",
							onClick: () => {
								props.onBulk?.(false, collectKeys(props.sessionId, track, props.trackOf));
							},
							children: t("collapseAll")
						})]
					})]
				}) : null, track.root.map((node) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(RootRow, {
					...props,
					node
				}, `${props.sessionId}:${node.id}`))]
			});
		}
		function RootRow(props) {
			const { node } = props;
			if (node.kind === "turn") return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(TurnRow, {
				...props,
				node
			});
			if (node.kind === "sidecar") return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SidecarRow, {
				...props,
				node
			});
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(UnlinkedRow, {
				...props,
				node
			});
		}
		function TurnRow({ node, ...props }) {
			const key = rowKey(props.sessionId, node.id);
			const expanded = props.open[key] ?? defaultExpanded("turn", node.status);
			const origin = node.startTime;
			const end = node.endTime ?? props.now;
			const steps = node.items.filter((item) => item.kind === "step").length;
			const cursor = {
				sessionId: props.sessionId,
				nodeId: node.id,
				key,
				kind: "turn",
				status: node.status,
				expandable: node.items.length > 0,
				activateId: node.id
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "dsh-context-track-turn-block",
				"data-turn-block": node.id,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Row, {
					kind: "turn",
					nodeId: node.id,
					glyph: "turn",
					label: props.t("turn").replace("{n}", String(node.turn)),
					status: node.status,
					expanded,
					canExpand: node.items.length > 0,
					summary: steps > 0 ? props.t("summaryTurn").replace("{n}", String(steps)) : void 0,
					current: isCurrent(props, node.id),
					duration: origin !== void 0 && end !== void 0 ? end - origin : void 0,
					depth: nest(props),
					t: props.t,
					onToggle: () => {
						props.onToggle(key, "turn", node.status);
					},
					onSelect: () => {
						activate(props, cursor);
					}
				}), expanded ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "dsh-context-track-children",
					style: guideStyle(nest(props)),
					children: node.items.map((item) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ItemRow, {
						...props,
						item,
						origin,
						depth: nest(props) + 1,
						parentTurnId: node.id
					}, item.id))
				}) : null]
			});
		}
		function ItemRow(props) {
			const { item } = props;
			if (item.kind === "step") return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(StepRow, {
				...props,
				node: item
			});
			if (item.kind === "sidecar") return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SidecarRow, {
				...props,
				node: item
			});
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(UnlinkedRow, {
				...props,
				node: item
			});
		}
		function StepRow({ node, origin, ...props }) {
			if (!rowVisible("step", void 0, props.filter)) return null;
			const key = rowKey(props.sessionId, node.id);
			const expanded = props.open[key] ?? defaultExpanded("step", node.status);
			const depth = nest(props);
			const latest = node.attempts[node.attempts.length - 1];
			const target = latest?.id ?? node.id;
			const canExpand = node.attempts.length > 0 || node.tools.length > 0 || (node.searches?.length ?? 0) > 0;
			const start = node.startTime ?? origin;
			const end = node.endTime ?? props.now;
			const cursor = {
				sessionId: props.sessionId,
				nodeId: node.id,
				key,
				kind: "step",
				status: node.status,
				expandable: canExpand,
				activateId: target,
				...latest !== void 0 ? { attemptId: latest.id } : {}
			};
			const tools = node.tools.length + (node.searches?.length ?? 0);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Row, {
				kind: "step",
				nodeId: node.id,
				glyph: "step",
				label: props.t("step").replace("{n}", String(node.step)),
				secondary: node.model,
				status: node.status,
				expanded,
				canExpand,
				summary: canExpand ? props.t("summaryStep").replace("{calls}", String(node.attempts.length)).replace("{tools}", String(tools)) : void 0,
				current: isCurrent(props, target) || isCurrent(props, node.id),
				usage: node.usage,
				duration: start !== void 0 && end !== void 0 ? end - start : void 0,
				depth,
				t: props.t,
				onToggle: () => {
					props.onToggle(key, "step", node.status);
				},
				onSelect: () => {
					activate(props, cursor);
				}
			}), expanded ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: "dsh-context-track-children",
				style: guideStyle(depth),
				children: stepEntries(node).map((entry) => {
					if (entry.kind === "attempt") {
						if (!rowVisible("attempt", void 0, props.filter)) return null;
						return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(AttemptRow, {
							...props,
							attempt: entry.attempt,
							depth: depth + 1
						}, entry.attempt.id);
					}
					if (entry.kind === "search") {
						if (!rowVisible("sidecar", entry.search.purpose, props.filter)) return null;
						return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SidecarRow, {
							...props,
							node: entry.search,
							depth: depth + 1
						}, entry.search.id);
					}
					if (!rowVisible("tool", void 0, props.filter)) return null;
					const tool = entry.tool;
					const childKey = rowKey(props.sessionId, tool.id);
					const childOpen = props.open[childKey] ?? defaultExpanded("tool", tool.status);
					const expandable = tool.childSessionId !== void 0 && childExpandable(tool.childMode);
					const childTrack = expandable && tool.childSessionId !== void 0 ? props.trackOf(tool.childSessionId) : void 0;
					const shown = displayStatus(tool.status, childTrack);
					const cursor = {
						sessionId: props.sessionId,
						nodeId: tool.id,
						key: childKey,
						kind: "tool",
						status: shown,
						expandable,
						activateId: tool.id
					};
					return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Row, {
							kind: "tool",
							nodeId: tool.id,
							glyph: tool.childSessionId !== void 0 ? "child" : "tool",
							label: tool.name,
							status: shown,
							expanded: childOpen,
							canExpand: expandable,
							current: isCurrent(props, tool.id),
							duration: tool.startTime !== void 0 && tool.endTime !== void 0 ? tool.endTime - tool.startTime : void 0,
							depth: depth + 1,
							t: props.t,
							onToggle: () => {
								props.onToggle(childKey, "tool", shown);
							},
							onSelect: () => {
								activate(props, cursor);
							}
						}),
						(tool.searches ?? []).some((search) => rowVisible("sidecar", search.purpose, props.filter)) ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "dsh-context-track-children",
							style: guideStyle(depth + 1),
							children: (tool.searches ?? []).map((search) => rowVisible("sidecar", search.purpose, props.filter) ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SidecarRow, {
								...props,
								node: search,
								depth: depth + 2
							}, search.id) : null)
						}) : null,
						childOpen && expandable && tool.childSessionId !== void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "dsh-context-track-children",
							style: guideStyle(depth + 1),
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Tree, {
								...props,
								sessionId: tool.childSessionId,
								track: childTrack,
								depth: depth + 2
							})
						}) : null
					] }, tool.id);
				})
			}) : null] });
		}
		function AttemptRow({ attempt, ...props }) {
			const end = attempt.endTime;
			const start = attempt.streamStart ?? end;
			const key = rowKey(props.sessionId, attempt.id);
			const cursor = {
				sessionId: props.sessionId,
				nodeId: attempt.id,
				key,
				kind: "attempt",
				status: attempt.status,
				expandable: false,
				activateId: attempt.id,
				attemptId: attempt.id
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Row, {
				kind: "attempt",
				nodeId: attempt.id,
				glyph: "attempt",
				label: props.t("attempt").replace("{n}", String(attempt.attempt)),
				status: attempt.status,
				expanded: false,
				canExpand: false,
				current: isCurrent(props, attempt.id),
				usage: attempt.usage,
				duration: start !== void 0 && end !== void 0 ? end - start : void 0,
				depth: nest(props),
				t: props.t,
				onToggle: () => void 0,
				onSelect: () => {
					activate(props, cursor);
				}
			});
		}
		function figureText(figure, t) {
			if (figure === void 0 || figure.basis === "absent" || figure.value === void 0) return "-";
			const basis = figure.basis === "usage" ? t("exact") : t("estimated");
			return `${String(figure.value)} ${basis}`;
		}
		function SidecarRow(props) {
			if (!rowVisible("sidecar", props.node.purpose, props.filter)) return null;
			const bill = props.turnBill?.turnId === props.parentTurnId ? props.turnBill : void 0;
			const label = props.node.purpose === "session-title" ? `${props.t("title")} -` : props.node.purpose === "compaction" ? bill === void 0 ? props.t("compaction") : `${props.t("compaction")} ${props.t("reclaimed")} ${figureText(bill.reclaimed, props.t)} · ${props.t("compactionCost")} ${figureText(bill.cost, props.t)}` : props.t("search");
			const key = rowKey(props.sessionId, props.node.id);
			const cursor = {
				sessionId: props.sessionId,
				nodeId: props.node.id,
				key,
				kind: "sidecar",
				status: props.node.status,
				expandable: false,
				activateId: props.node.id
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Row, {
				kind: "sidecar",
				nodeId: props.node.id,
				glyph: "sidecar",
				label,
				status: props.node.status,
				expanded: false,
				canExpand: false,
				current: isCurrent(props, props.node.id),
				depth: nest(props),
				t: props.t,
				onToggle: () => void 0,
				onSelect: () => {
					activate(props, cursor);
				}
			});
		}
		function UnlinkedRow(props) {
			const key = rowKey(props.sessionId, props.node.id);
			const expanded = props.open[key] ?? defaultExpanded("unlinked", "ok");
			const expandable = childExpandable(props.node.childMode);
			const childTrack = expandable ? props.trackOf(props.node.childSessionId) : void 0;
			const cursor = {
				sessionId: props.sessionId,
				nodeId: props.node.id,
				key,
				kind: "unlinked",
				status: "ok",
				expandable,
				activateId: props.node.id
			};
			if (!rowVisible("unlinked", void 0, props.filter)) return null;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Row, {
				kind: "unlinked",
				nodeId: props.node.id,
				glyph: "unlinked",
				label: props.node.childLabel ?? props.t("unlinked"),
				status: "ok",
				expanded,
				canExpand: expandable,
				current: isCurrent(props, props.node.id),
				depth: nest(props),
				t: props.t,
				onToggle: () => {
					props.onToggle(key, "unlinked", "ok");
				},
				onSelect: () => {
					activate(props, cursor);
				}
			}), expanded && expandable ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: "dsh-context-track-children",
				style: guideStyle(nest(props)),
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Tree, {
					...props,
					sessionId: props.node.childSessionId,
					track: childTrack,
					depth: nest(props) + 1
				})
			}) : null] });
		}
		function Row({ kind, nodeId, glyph, label, secondary, status, expanded, canExpand, summary, current, usage, duration, depth, t, onToggle, onSelect }) {
			const bill = usage === void 0 ? void 0 : billOf(usage);
			const tokenText = bill === void 0 ? void 0 : `${String(bill.input.value ?? "")} → ${String(bill.output.value ?? "")}`;
			const tip = [
				label,
				secondary,
				duration === void 0 ? void 0 : `${String(duration)} ms`,
				tokenText
			].filter((part) => part !== void 0 && part.length > 0).join(" · ");
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "dsh-context-track-row",
				"data-row-kind": kind,
				"data-node-id": nodeId,
				"data-depth": depth,
				"data-status": status,
				"data-current": current ? "true" : void 0,
				role: "treeitem",
				"aria-level": depth + 1,
				"aria-expanded": canExpand ? expanded : void 0,
				"aria-selected": current,
				title: tip,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: "dsh-context-track-row-rail",
						"aria-hidden": "true"
					}),
					canExpand ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: "dsh-context-track-chevron",
						"aria-expanded": expanded,
						"aria-label": expanded ? t("collapse") : t("expand"),
						onClick: onToggle,
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							"aria-hidden": "true",
							children: expanded ? "▾" : "▸"
						})
					}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: "dsh-context-track-chevron",
						"aria-hidden": "true"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: "dsh-context-track-glyph",
						"aria-hidden": "true",
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(NodeGlyph, { kind: glyph })
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "dsh-context-track-label",
						onClick: onSelect,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: `dsh-context-track-dot dsh-context-track-status-${status}`,
								"data-status": status,
								"aria-hidden": "true"
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "dsh-context-track-label-text",
								children: label
							}),
							secondary !== void 0 && secondary.length > 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "dsh-context-track-muted dsh-context-track-label-extra",
								children: secondary
							}) : null,
							summary !== void 0 && !expanded ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "dsh-context-track-summary",
								"data-summary": true,
								children: summary
							}) : null,
							status === "ok" ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: `dsh-context-track-status-${status} dsh-context-track-label-status`,
								children: t(status)
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						"data-column": "duration",
						className: "dsh-context-track-col",
						children: duration !== void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(DurationView, { ms: duration }) : null
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						"data-column": "tokens",
						className: "dsh-context-track-col",
						children: bill !== void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							className: "dsh-context-track-num",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)(FigureView, {
									figure: bill.input,
									t,
									showBasis: false
								}),
								" → ",
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)(FigureView, {
									figure: bill.output,
									t,
									showBasis: false
								})
							]
						}) : null
					})
				]
			});
		}
		function DurationView({ ms }) {
			const shown = formatDuration(ms);
			if (!shown.abbreviated) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: "dsh-context-track-num",
				children: shown.text
			});
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
				type: "button",
				className: "dsh-context-track-num",
				title: shown.full,
				"data-full": shown.full,
				onClick: (event) => {
					event.stopPropagation();
					copyText(shown.full);
				},
				children: shown.text
			});
		}
		/** 12px per level, 6px past the sixth, so a deep subagent never loses its label. */
		function guideStyle(depth) {
			return { marginInlineStart: depth < 6 ? "12px" : "6px" };
		}
		function rowKey(sessionId, nodeId) {
			return `${sessionId}:${nodeId}`;
		}
		function isCurrent(props, nodeId) {
			return props.selected?.sessionId === props.sessionId && props.selected.nodeId === nodeId;
		}
		/** A parent tool stays "running" in the tree while the child still has an open turn. */
		function displayStatus(status, child) {
			if (child?.root.some((node) => node.kind === "turn" && node.status === "running")) return "running";
			return status;
		}
		function activate(props, cursor) {
			props.onSelect(cursor);
		}
		function nest(props) {
			return props.depth ?? 0;
		}
		/** Every expandable key in a session tree, whether or not it is open now. */
		function collectKeys(sessionId, track, trackOf) {
			const keys = [];
			if (track === void 0) return keys;
			const walk = (owner, state) => {
				if (state === void 0) return;
				for (const node of state.root) {
					if (node.kind === "turn") {
						keys.push(rowKey(owner, node.id));
						for (const item of node.items) walkItem(owner, item);
						continue;
					}
					if (node.kind === "unlinked") {
						keys.push(rowKey(owner, node.id));
						if (childExpandable(node.childMode)) walk(node.childSessionId, trackOf(node.childSessionId));
						continue;
					}
				}
			};
			const walkItem = (owner, item) => {
				if (item.kind === "step") {
					keys.push(rowKey(owner, item.id));
					if (item.tools.length > 0) {
						for (const tool of item.tools) if (tool.childSessionId !== void 0 && childExpandable(tool.childMode)) {
							keys.push(rowKey(owner, tool.id));
							walk(tool.childSessionId, trackOf(tool.childSessionId));
						}
					}
					return;
				}
				if (item.kind === "unlinked") {
					keys.push(rowKey(owner, item.id));
					if (childExpandable(item.childMode)) walk(item.childSessionId, trackOf(item.childSessionId));
				}
			};
			walk(sessionId, trackOf(sessionId) ?? track);
			return keys;
		}
		/** Attempts, tools, and step-level searches in log order. Tool-owned searches stay on the tool. */
		function stepEntries(step) {
			return [
				...step.attempts.map((attempt) => ({
					seq: attempt.outputSeq ?? attempt.inputSeq,
					kind: "attempt",
					attempt
				})),
				...step.tools.map((tool) => ({
					seq: tool.callSeq,
					kind: "tool",
					tool
				})),
				...(step.searches ?? []).map((search) => ({
					seq: search.requestSeq,
					kind: "search",
					search
				}))
			].sort((left, right) => left.seq - right.seq);
		}
		/** Kind filter for the tree. Turns always stay so the rail of the loop is still there. */
		function rowVisible(kind, purpose, filter) {
			if (filter === void 0) return true;
			if (kind === "turn") return true;
			if (kind === "step") return filter === "model" || filter === "tool";
			if (kind === "attempt") return filter === "model";
			if (kind === "tool") return filter === "tool";
			if (kind === "sidecar") {
				if (filter === "compaction") return purpose === "compaction";
				if (filter === "title") return purpose === "session-title";
				return false;
			}
			return false;
		}
		/** Visible rows in paint order. Keyboard moves through this list. */
		function visibleTargets(sessionId, track, open, trackOf, filter) {
			const rows = [];
			walk(sessionId, track, open, trackOf, filter, rows);
			return rows;
		}
		function walk(sessionId, track, open, trackOf, filter, rows) {
			if (track === void 0) return;
			for (const node of track.root) {
				if (node.kind === "turn") {
					const key = rowKey(sessionId, node.id);
					const expanded = open[key] ?? defaultExpanded("turn", node.status);
					rows.push({
						sessionId,
						nodeId: node.id,
						key,
						kind: "turn",
						status: node.status,
						expandable: node.items.length > 0,
						activateId: node.id
					});
					if (!expanded) continue;
					for (const item of node.items) pushItem(sessionId, item, open, trackOf, filter, rows);
					continue;
				}
				if (node.kind === "sidecar" || node.kind === "unlinked") pushItem(sessionId, node, open, trackOf, filter, rows);
			}
		}
		function pushItem(sessionId, item, open, trackOf, filter, rows) {
			if (item.kind === "sidecar") {
				if (!rowVisible("sidecar", item.purpose, filter)) return;
				const key = rowKey(sessionId, item.id);
				rows.push({
					sessionId,
					nodeId: item.id,
					key,
					kind: "sidecar",
					status: item.status,
					expandable: false,
					activateId: item.id
				});
				return;
			}
			if (item.kind === "unlinked") {
				if (!rowVisible("unlinked", void 0, filter)) return;
				const key = rowKey(sessionId, item.id);
				const expandable = childExpandable(item.childMode);
				const expanded = open[key] ?? defaultExpanded("unlinked", "ok");
				rows.push({
					sessionId,
					nodeId: item.id,
					key,
					kind: "unlinked",
					status: "ok",
					expandable,
					activateId: item.id
				});
				if (expanded && expandable) walk(item.childSessionId, trackOf(item.childSessionId), open, trackOf, filter, rows);
				return;
			}
			if (!rowVisible("step", void 0, filter)) return;
			const key = rowKey(sessionId, item.id);
			const expanded = open[key] ?? defaultExpanded("step", item.status);
			const latest = item.attempts[item.attempts.length - 1];
			const canExpand = item.attempts.length > 0 || item.tools.length > 0 || (item.searches?.length ?? 0) > 0;
			rows.push({
				sessionId,
				nodeId: item.id,
				key,
				kind: "step",
				status: item.status,
				expandable: canExpand,
				activateId: latest?.id ?? item.id,
				...latest !== void 0 ? { attemptId: latest.id } : {}
			});
			if (!expanded) return;
			for (const entry of stepEntries(item)) {
				if (entry.kind === "attempt") {
					if (!rowVisible("attempt", void 0, filter)) continue;
					rows.push({
						sessionId,
						nodeId: entry.attempt.id,
						key: rowKey(sessionId, entry.attempt.id),
						kind: "attempt",
						status: entry.attempt.status,
						expandable: false,
						activateId: entry.attempt.id,
						attemptId: entry.attempt.id
					});
					continue;
				}
				if (entry.kind === "search") {
					if (!rowVisible("sidecar", entry.search.purpose, filter)) continue;
					rows.push({
						sessionId,
						nodeId: entry.search.id,
						key: rowKey(sessionId, entry.search.id),
						kind: "sidecar",
						status: entry.search.status,
						expandable: false,
						activateId: entry.search.id
					});
					continue;
				}
				if (!rowVisible("tool", void 0, filter)) continue;
				const childKey = rowKey(sessionId, entry.tool.id);
				const expandable = entry.tool.childSessionId !== void 0 && childExpandable(entry.tool.childMode);
				const childOpen = open[childKey] ?? defaultExpanded("tool", entry.tool.status);
				rows.push({
					sessionId,
					nodeId: entry.tool.id,
					key: childKey,
					kind: "tool",
					status: entry.tool.status,
					expandable,
					activateId: entry.tool.id
				});
				for (const search of entry.tool.searches ?? []) {
					if (!rowVisible("sidecar", search.purpose, filter)) continue;
					rows.push({
						sessionId,
						nodeId: search.id,
						key: rowKey(sessionId, search.id),
						kind: "sidecar",
						status: search.status,
						expandable: false,
						activateId: search.id
					});
				}
				if (childOpen && expandable && entry.tool.childSessionId !== void 0) walk(entry.tool.childSessionId, trackOf(entry.tool.childSessionId), open, trackOf, filter, rows);
			}
		}
		//#endregion
		//#region src/client/TracePage.tsx
		/**
		* Context-trace console. The conversation tab and the right sidebar are both
		* session-scoped. The left-sidebar centre page follows the session the shell
		* retains for the main view. Detail reads committed logs. It does not
		* subscribe to the token stream.
		*
		* The panel is a shell: a header, a horizontal round strip, a collapsible
		* context band, and a tree beside a detail pane. Narrow panels keep the tree
		* full width and slide the detail over it.
		*/
		/** Content reappears once the drawer slide has landed, never mid-animation. */
		const DETAIL_REVEAL_MS = 190;
		/** Guarded storage: a blocked localStorage must never stop the first paint. */
		const STORE_PREFIX = "dsh-context-track:";
		function readStore(key, fallback) {
			try {
				if (typeof localStorage === "undefined") return fallback;
				const raw = localStorage.getItem(STORE_PREFIX + key);
				return raw === null ? fallback : JSON.parse(raw);
			} catch {
				return fallback;
			}
		}
		function writeStore(key, value) {
			try {
				if (typeof localStorage === "undefined") return;
				localStorage.setItem(STORE_PREFIX + key, JSON.stringify(value));
			} catch {}
		}
		/** The session the shell is showing. Opening this panel does not change it. */
		function mainSessionId(byId) {
			for (const value of Object.values(byId)) {
				if (value === null || typeof value !== "object") continue;
				const row = value;
				const weight = row.retainedBy?.mainView;
				if (typeof row.id === "string" && typeof weight === "number" && weight > 0) return row.id;
			}
		}
		/**
		* Centre-column page for the left-sidebar row. The row's panel has no session
		* binding, so the console follows the retained main session.
		*/
		function TraceMain(props) {
			const sessionId = props.useSessions((state) => mainSessionId(state.byId));
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(TracePage, {
				...props,
				host: "main",
				sessionId
			});
		}
		/** Header, round strip, context band, and the selected turn's tree and detail. */
		function TracePage({ sessionId, useSessions, t, getNode, getTurn, host }) {
			ensureStyles();
			const rootRef = (0, react.useRef)(null);
			const detailRef = (0, react.useRef)(null);
			const splitRef = (0, react.useRef)(null);
			const selectedChipRef = (0, react.useRef)(null);
			const lastTrigger = (0, react.useRef)(void 0);
			const tier = usePanelTier(rootRef);
			const rootClass = host === "main" ? "dsh-context-track dsh-context-track-main" : "dsh-context-track";
			const list = useSessions((state) => state);
			const track = sessionId === void 0 ? void 0 : readTrack(list.projectionsBySession, sessionId) ?? emptyTrack();
			const turns = (track?.root ?? []).filter((node) => node.kind === "turn");
			const [open, setOpen] = (0, react.useState)({});
			const [picked, setPicked] = (0, react.useState)(void 0);
			const [node, setNode] = (0, react.useState)(void 0);
			const [pinned, setPinned] = (0, react.useState)(false);
			const [hover, setHover] = (0, react.useState)(void 0);
			const [marker, setMarker] = (0, react.useState)(void 0);
			const [activeKey, setActiveKey] = (0, react.useState)(void 0);
			const [attemptId, setAttemptId] = (0, react.useState)("");
			const [eventSeq, setEventSeq] = (0, react.useState)(void 0);
			const [detail, setDetail] = (0, react.useState)(void 0);
			const [report, setReport] = (0, react.useState)(void 0);
			const [title, setTitle] = (0, react.useState)(void 0);
			const [detailOpen, setDetailOpen] = (0, react.useState)(true);
			const [detailShown, setDetailShown] = (0, react.useState)(true);
			const [overlayOpen, setOverlayOpen] = (0, react.useState)(false);
			const [bandOpen, setBandOpen] = (0, react.useState)(() => readStore("band", false));
			const [ratio, setRatio] = (0, react.useState)(() => {
				const stored = readStore("split", DEFAULT_TREE_RATIO);
				return Number.isFinite(stored) ? stored : DEFAULT_TREE_RATIO;
			});
			const [focusCategory, setFocusCategory] = (0, react.useState)(void 0);
			const revealTimer = (0, react.useRef)(void 0);
			const autoSelected = (0, react.useRef)(void 0);
			const marks = (0, react.useRef)({});
			const narrow = !isSideBySide(tier);
			const pickedTurn = turns.find((turn) => turn.id === picked);
			const selectedTurn = marker !== void 0 ? void 0 : pickedTurn ?? turns.find((turn) => turn.status === "running") ?? turns[turns.length - 1];
			const translate = (key) => t(key);
			(0, react.useEffect)(() => {
				setPicked(void 0);
				setNode(void 0);
				setDetail(void 0);
				setReport(void 0);
				setMarker(void 0);
				setPinned(false);
				setAttemptId("");
				setEventSeq(void 0);
				setActiveKey(void 0);
				setFocusCategory(void 0);
				marks.current = {};
			}, [sessionId]);
			(0, react.useEffect)(() => () => {
				clearTimeout(revealTimer.current);
			}, []);
			(0, react.useEffect)(() => {
				writeStore("band", bandOpen);
			}, [bandOpen]);
			(0, react.useEffect)(() => {
				writeStore("split", ratio);
			}, [ratio]);
			const selectedTurnId = selectedTurn?.id;
			(0, react.useEffect)(() => {
				const chip = selectedChipRef.current;
				if (chip !== null) chip.scrollIntoView?.({
					block: "nearest",
					inline: "nearest"
				});
			}, [selectedTurnId]);
			const collapseDetail = () => {
				clearTimeout(revealTimer.current);
				setDetailShown(false);
				setDetailOpen(false);
				setOverlayOpen(false);
				returnFocus();
			};
			const openDetail = () => {
				setOverlayOpen(true);
				if (detailOpen && detailShown) return;
				setDetailOpen(true);
				clearTimeout(revealTimer.current);
				revealTimer.current = setTimeout(() => {
					setDetailShown(true);
				}, DETAIL_REVEAL_MS);
			};
			const returnFocus = () => {
				const trigger = lastTrigger.current;
				if (trigger === void 0) return;
				const root = rootRef.current;
				if (root === null) return;
				const selector = trigger.kind === "turn" ? `[data-turn-id="${trigger.id}"]` : `[data-node-id="${trigger.id}"] .dsh-context-track-label`;
				root.querySelector(selector)?.focus();
			};
			(0, react.useEffect)(() => {
				if (sessionId === void 0 || node === void 0) return void 0;
				let cancelled = false;
				const showMissing = () => {
					if (!cancelled) setDetail({ missing: true });
				};
				let pending;
				try {
					pending = Promise.resolve(getNode(node.sessionId, node.nodeId));
				} catch {
					showMissing();
					return () => {
						cancelled = true;
					};
				}
				pending.then((result) => {
					if (cancelled) return;
					if (result == null || typeof result !== "object" || !("ok" in result) || result.ok !== true) {
						setDetail({ missing: true });
						return;
					}
					setDetail(result.value);
				}, showMissing);
				return () => {
					cancelled = true;
				};
			}, [
				sessionId,
				node,
				track,
				openRevision(list.projectionsBySession, node),
				getNode
			]);
			const turnId = selectedTurn?.id;
			(0, react.useEffect)(() => {
				if (sessionId === void 0 || turnId === void 0 || getTurn === void 0) return void 0;
				let cancelled = false;
				const showMissing = () => {
					if (!cancelled) setReport({
						missing: true,
						target: "turn"
					});
				};
				let pending;
				try {
					pending = Promise.resolve(getTurn(sessionId, turnId, attemptId));
				} catch {
					showMissing();
					return () => {
						cancelled = true;
					};
				}
				pending.then((result) => {
					if (cancelled) return;
					setReport(result.ok ? result.value : {
						missing: true,
						target: "turn"
					});
				}, showMissing);
				return () => {
					cancelled = true;
				};
			}, [
				sessionId,
				turnId,
				attemptId,
				track,
				getTurn
			]);
			const titleSidecar = selectedTurn?.items.find((item) => item.kind === "sidecar" && item.purpose === "session-title");
			const titleSidecarId = titleSidecar?.id;
			const titleRevision = titleSidecar === void 0 ? "" : `${titleSidecar.status}|${titleSidecar.outputSeq ?? ""}|${titleSidecar.endSeq ?? ""}`;
			const titleName = title !== void 0 && title.id === titleSidecarId ? title.name : void 0;
			(0, react.useEffect)(() => {
				if (sessionId === void 0 || titleSidecarId === void 0) return void 0;
				let cancelled = false;
				let pending;
				try {
					pending = Promise.resolve(getNode(sessionId, titleSidecarId));
				} catch {
					return () => {
						cancelled = true;
					};
				}
				pending.then((result) => {
					if (cancelled) return;
					if (result == null || typeof result !== "object" || !("ok" in result) || result.ok !== true) return;
					const value = result.value;
					if (!isMissing(value) && value.kind === "sidecar" && value.purpose === "session-title" && typeof value.output === "string" && value.output.length > 0) setTitle({
						id: titleSidecarId,
						name: value.output
					});
				}, () => void 0);
				return () => {
					cancelled = true;
				};
			}, [
				sessionId,
				titleSidecarId,
				titleRevision,
				getNode
			]);
			const cursors = sessionId === void 0 ? [] : visibleTargets(sessionId, track, open, (id) => readTrack(list.projectionsBySession, id));
			const onKeyDown = (event) => {
				if (event.key === "Escape") {
					if (showDetail && hasSelection) {
						event.preventDefault();
						collapseDetail();
					}
					return;
				}
				if (sessionId === void 0 || turns.length === 0) return;
				const target = event.target;
				if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) return;
				if (target instanceof HTMLElement && target.getAttribute("role") === "separator") return;
				const index = cursorIndex(cursors, activeKey, selectedTurn?.id);
				if (event.key === "ArrowDown" || event.key === "ArrowUp") {
					event.preventDefault();
					const next = cursors[index + (event.key === "ArrowDown" ? 1 : -1)];
					if (next !== void 0) selectCursor(next, false);
					return;
				}
				const current = cursors[index];
				if (current === void 0) return;
				if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
					event.preventDefault();
					if (!current.expandable) return;
					setOpen((state) => ({
						...state,
						[current.key]: event.key === "ArrowRight"
					}));
					return;
				}
				if (event.key === "Enter") {
					event.preventDefault();
					setPinned(true);
					if (current.kind === "turn") setPicked(current.nodeId);
				}
			};
			/** Remember what a round was left on. A tab switch comes back to this row. */
			const markRow = (turnId, mark) => {
				if (turnId !== void 0 && mark !== void 0) marks.current[turnId] = mark;
			};
			/** Point the tree cursor and the inspector at one row. */
			const showRow = (mark) => {
				setMarker(void 0);
				setNode({
					sessionId: mark.sessionId,
					nodeId: mark.nodeId
				});
				setActiveKey(mark.key);
				setAttemptId(mark.attemptId);
			};
			const selectCursor = (cursor, pin) => {
				if (sessionId === void 0) return;
				if (pin) {
					setPinned(true);
					setOverlayOpen(true);
				}
				const owner = turnContaining(turns, cursor.activateId) ?? turnContaining(turns, cursor.nodeId);
				if (owner !== void 0) setPicked(owner);
				if (cursor.kind === "turn") {
					lastTrigger.current = {
						kind: "turn",
						id: cursor.nodeId
					};
					showRow({
						sessionId,
						nodeId: cursor.nodeId,
						key: cursor.key,
						attemptId: ""
					});
					setDetail(void 0);
					markRow(owner, {
						sessionId,
						nodeId: cursor.nodeId,
						key: cursor.key,
						attemptId: ""
					});
					return;
				}
				lastTrigger.current = {
					kind: "node",
					id: cursor.nodeId
				};
				const mark = {
					sessionId: cursor.sessionId,
					nodeId: cursor.activateId,
					key: cursor.key,
					attemptId: cursor.attemptId ?? ""
				};
				showRow(mark);
				markRow(owner, mark);
			};
			(0, react.useEffect)(() => {
				if (sessionId === void 0) {
					autoSelected.current = void 0;
					return;
				}
				if (autoSelected.current === sessionId) return;
				if (picked !== void 0 || node !== void 0 || marker !== void 0) return;
				const round = turns.find((turn) => turn.items.length > 0);
				if (round === void 0) return;
				const entry = openingRow(sessionId, round);
				if (entry === void 0) return;
				autoSelected.current = sessionId;
				setPicked(round.id);
				showRow(entry);
			}, [
				sessionId,
				picked,
				node,
				marker,
				turns
			]);
			if (sessionId === void 0) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: rootClass,
				"data-tier": tier,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
					className: "dsh-context-track-empty",
					children: t("empty")
				})
			});
			const shownReport = isTurnReport(report) ? report : void 0;
			const watching = watchLabel(translate, selectedTurn, node?.nodeId, marker, track);
			const trackOf = (id) => readTrack(list.projectionsBySession, id);
			const nodeKey = `${sessionId}:${node?.nodeId ?? marker ?? "turn"}`;
			const failed = node !== void 0 && detail !== void 0 && isMissing(detail);
			const hasSelection = node !== void 0 || marker !== void 0;
			const sideBySide = isSideBySide(tier);
			const showDetail = sideBySide ? detailOpen : overlayOpen && hasSelection;
			const bandAvailable = marker === void 0 && shownReport !== void 0;
			const headTotal = shownReport?.consumption.total ?? (selectedTurn !== void 0 ? totalFigure(selectedTurn) : { basis: "absent" });
			const headClock = shownReport?.timing.elapsed ?? (selectedTurn !== void 0 ? clockFigure(selectedTurn) : { basis: "absent" });
			const headHit = shownReport?.consumption.hitRate ?? (selectedTurn !== void 0 ? hitFigure(selectedTurn) : { basis: "absent" });
			const crumbs = crumbTrail(track, turns, node?.nodeId, marker, translate);
			/** A remembered row survives while its node is still in that session's index. */
			const stillThere = (mark) => {
				const index = trackOf(mark.sessionId);
				return index !== void 0 && findNode(index, mark.nodeId) !== void 0;
			};
			/** A tab switch returns to the row the round was left on, else its first call. */
			const pinTurn = (id) => {
				lastTrigger.current = {
					kind: "turn",
					id
				};
				setMarker(void 0);
				setPicked(id);
				setPinned(true);
				const turn = turns.find((item) => item.id === id);
				const kept = turn === void 0 ? void 0 : marks.current[id];
				const entry = turn === void 0 ? void 0 : (kept !== void 0 && stillThere(kept) ? kept : void 0) ?? openingRow(sessionId, turn);
				if (entry !== void 0) showRow(entry);
				else {
					setNode({
						sessionId,
						nodeId: id
					});
					setActiveKey(`${sessionId}:${id}`);
					setAttemptId("");
				}
				if (sideBySide) openDetail();
			};
			const selectNode = (cursor) => {
				lastTrigger.current = {
					kind: "node",
					id: cursor.nodeId
				};
				const mark = {
					sessionId: cursor.sessionId,
					nodeId: cursor.activateId,
					key: cursor.key,
					attemptId: cursor.attemptId ?? ""
				};
				showRow(mark);
				setPinned(true);
				setDetailOpen(true);
				setDetailShown(true);
				setOverlayOpen(true);
				const owner = turnContaining(turns, cursor.activateId) ?? turnContaining(turns, cursor.nodeId);
				if (owner !== void 0) {
					setPicked(owner);
					markRow(owner, mark);
				}
			};
			const chooseCrumb = (nodeId) => {
				const mark = {
					sessionId,
					nodeId,
					key: `${sessionId}:${nodeId}`,
					attemptId: ""
				};
				const turn = turns.some((item) => item.id === nodeId);
				lastTrigger.current = {
					kind: turn ? "turn" : "node",
					id: nodeId
				};
				showRow(mark);
				const owner = turnContaining(turns, nodeId);
				if (owner !== void 0) markRow(owner, mark);
				if (turn) return;
				setPinned(true);
				setDetailOpen(true);
				setDetailShown(true);
				setOverlayOpen(true);
				if (owner !== void 0) setPicked(owner);
			};
			const moveTurn = (delta) => {
				if (turns.length === 0) return;
				const current = selectedTurn === void 0 ? turns.length - 1 : turns.findIndex((turn) => turn.id === selectedTurn.id);
				const next = turns[Math.min(Math.max(current + delta, 0), turns.length - 1)];
				if (next !== void 0 && next.id !== selectedTurn?.id) pinTurn(next.id);
			};
			const bandCategory = (category) => {
				setFocusCategory(category);
				setDetailOpen(true);
				setDetailShown(true);
				setOverlayOpen(true);
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				ref: rootRef,
				className: rootClass,
				"data-tier": tier,
				"data-band": bandOpen ? "open" : "closed",
				"data-detail": showDetail ? "open" : "closed",
				tabIndex: 0,
				onKeyDown,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("header", {
					className: "dsh-context-track-head",
					"data-pane": "header",
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: "dsh-context-track-head-title",
							"data-head": "turn",
							children: selectedTurn !== void 0 ? t("turn").replace("{n}", String(selectedTurn.turn)) : t("panel")
						}),
						selectedTurn !== void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: `dsh-context-track-status-${selectedTurn.status}`,
							"data-head": "status",
							"data-status": selectedTurn.status,
							children: selectedTurn.status === "ok" ? null : t(selectedTurn.status)
						}) : null,
						watching.length > 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: "dsh-context-track-head-watching",
							"data-watching": true,
							children: t("watching").replace("{name}", watching)
						}) : null,
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { className: "dsh-context-track-head-spacer" }),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							className: "dsh-context-track-head-stat",
							"data-head": "total",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "dsh-context-track-head-label",
								children: t("total")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(FigureView, {
								figure: headTotal,
								t: translate
							})]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: "dsh-context-track-head-stat",
							"data-head": "hit",
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(HitRateBadge, {
								figure: headHit,
								t: translate
							})
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							className: "dsh-context-track-head-stat",
							"data-head": "elapsed",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "dsh-context-track-head-label",
								children: t("elapsed")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(FigureView, {
								figure: headClock,
								t: translate,
								showBasis: false,
								format: formatDuration
							})]
						}),
						bandAvailable ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "dsh-context-track-head-band",
							"data-head-band": true,
							"data-band-toggle": true,
							"aria-expanded": bandOpen,
							"aria-label": bandOpen ? t("bandCollapse") : t("bandExpand"),
							title: bandOpen ? t("bandCollapse") : t("bandExpand"),
							onClick: () => {
								setBandOpen((value) => !value);
							},
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)(BandIcon, {}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: "dsh-context-track-head-band-label",
									children: t("bandTitle")
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: "dsh-context-track-head-band-caret",
									"aria-hidden": "true",
									children: "▾"
								})
							]
						}) : null,
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(MoreMenu, {
							t: translate,
							onExpandAll: () => {
								bulk(true);
							},
							onCollapseAll: () => {
								bulk(false);
							},
							onResetSplit: () => {
								setRatio(DEFAULT_TREE_RATIO);
							}
						})
					]
				}), turns.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
					className: "dsh-context-track-empty",
					children: t("noCalls")
				}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(TurnStrip, {
						entries: railEntries(track?.root ?? []),
						selectedId: selectedTurn?.id,
						hoverId: hover,
						pinned,
						total: turns.length,
						selectedRef: selectedChipRef,
						t: translate,
						onHover: setHover,
						onTurn: pinTurn,
						onMove: moveTurn,
						onMark: (id) => {
							lastTrigger.current = {
								kind: "node",
								id
							};
							setMarker(id);
							setNode({
								sessionId,
								nodeId: id
							});
							setPinned(true);
							setActiveKey(`${sessionId}:${id}`);
							setDetailOpen(true);
							setDetailShown(true);
							setOverlayOpen(true);
						}
					}),
					marker === void 0 && shownReport !== void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "dsh-context-track-band-wrap",
						"data-pane": "band",
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ContextBand, {
							report: shownReport,
							open: bandOpen,
							activeSeq: eventSeq,
							titleName,
							trackOf,
							t: translate,
							onCategory: bandCategory,
							onGap: (seq) => {
								setEventSeq(seq);
								const match = shownReport.events.find((item) => item.seq === seq);
								if (match?.nodeId !== void 0) {
									lastTrigger.current = {
										kind: "node",
										id: match.nodeId
									};
									setNode({
										sessionId,
										nodeId: match.nodeId
									});
									setPinned(true);
									setDetailOpen(true);
									setDetailShown(true);
									setOverlayOpen(true);
									const owner = turnContaining(turns, match.nodeId);
									if (owner !== void 0) markRow(owner, {
										sessionId,
										nodeId: match.nodeId,
										key: `${sessionId}:${match.nodeId}`,
										attemptId: ""
									});
								}
							}
						})
					}) : null,
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "dsh-context-track-split",
						"data-pane": "split",
						ref: splitRef,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: "dsh-context-track-tree",
								"data-pane": "tree",
								style: sideBySide && showDetail ? { flex: `0 1 ${ratio * 100}%` } : { flex: "1 1 auto" },
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Tree, {
									sessionId,
									track,
									trackOf,
									open,
									onToggle: (key, kind, status) => {
										setOpen((current) => toggleExpanded(current, key, defaultExpanded(kind, status)));
									},
									selected: node,
									onSelect: selectNode,
									onBulk: (expand, keys) => {
										bulk(expand, keys);
									},
									t: translate,
									now: Date.now(),
									turnBill: shownReport !== void 0 && compactionPresent(shownReport) ? {
										turnId: shownReport.id,
										reclaimed: reclaimedOf(shownReport.events),
										cost: shownReport.consumption.compaction
									} : void 0
								})
							}),
							sideBySide && showDetail ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Grip, {
								label: t("adjustSplit"),
								onRatio: (next) => {
									setRatio(next);
								},
								onStep: (delta) => {
									const room = splitRef.current?.getBoundingClientRect().width ?? 0;
									setRatio((current) => {
										if (room <= 0) return current;
										return clampTreeRatio((current * room + delta) / room, room);
									});
								},
								onReset: () => {
									setRatio(DEFAULT_TREE_RATIO);
								}
							}) : null,
							showDetail ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: "dsh-context-track-detail",
								"data-pane": "detail",
								"data-overlay": narrow ? "true" : void 0,
								"data-collapsed": detailShown ? void 0 : "true",
								ref: detailRef,
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: "dsh-context-track-detail-body",
									hidden: !detailShown,
									children: failed ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
										className: "dsh-context-track-muted",
										children: t("missing")
									}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Detail, {
										detail: node === void 0 && marker === void 0 ? void 0 : detail,
										nodeKey,
										t: translate,
										scrollerRef: detailRef,
										crumbs,
										onCrumb: chooseCrumb,
										onClose: collapseDetail,
										onBack: narrow ? collapseDetail : void 0,
										focusCategory,
										onOpenChild: () => {
											if (node === void 0) return;
											revealTool(sessionId, node.nodeId, turns, setOpen);
										}
									}, nodeKey)
								})
							}) : null
						]
					})
				] })]
			});
			function bulk(expand, keys) {
				const all = keys ?? collectKeys(sessionId, track, trackOf);
				setOpen((current) => {
					const next = { ...current };
					for (const key of all) next[key] = expand;
					return next;
				});
			}
		}
		/**
		* Header actions. The list is painted inside the header's stacking context, so
		* opening it must not be clipped by the header's own box. It stays mounted only
		* while open; Escape and an outside press dismiss it.
		*/
		function MoreMenu({ t, onExpandAll, onCollapseAll, onResetSplit }) {
			const [open, setOpen] = (0, react.useState)(false);
			const ref = (0, react.useRef)(null);
			(0, react.useEffect)(() => {
				if (!open) return void 0;
				const dismiss = (event) => {
					if (event.target instanceof Node && ref.current?.contains(event.target) === true) return;
					setOpen(false);
				};
				const onEscape = (event) => {
					if (event.key !== "Escape") return;
					event.stopPropagation();
					setOpen(false);
				};
				document.addEventListener("pointerdown", dismiss, true);
				document.addEventListener("keydown", onEscape, true);
				return () => {
					document.removeEventListener("pointerdown", dismiss, true);
					document.removeEventListener("keydown", onEscape, true);
				};
			}, [open]);
			const run = (action) => () => {
				setOpen(false);
				action();
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "dsh-context-track-more",
				"data-more-menu": true,
				"data-open": open ? "true" : void 0,
				ref,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "dsh-context-track-more-button",
					"aria-haspopup": "menu",
					"aria-expanded": open,
					onClick: () => {
						setOpen((value) => !value);
					},
					children: [t("more"), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: "dsh-context-track-more-caret",
						"aria-hidden": "true",
						children: "▾"
					})]
				}), open ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "dsh-context-track-more-menu",
					role: "menu",
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							role: "menuitem",
							onClick: run(onExpandAll),
							children: t("expandAll")
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							role: "menuitem",
							onClick: run(onCollapseAll),
							children: t("collapseAll")
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: "dsh-context-track-more-divider",
							role: "separator",
							"aria-hidden": "true"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							role: "menuitem",
							onClick: run(onResetSplit),
							children: t("resetSplit")
						})
					]
				}) : null]
			});
		}
		/**
		* One row per round, or a thin label for a sidecar that sat between rounds.
		* The tabs scroll on their own and the arrows beside them switch rounds, so
		* neither a long session nor a narrow panel hides the way to the next one.
		*/
		function TurnStrip({ entries, selectedId, hoverId, pinned, total, selectedRef, t, onHover, onTurn, onMove, onMark }) {
			const rounds = entries.filter((entry) => entry.kind === "turn");
			const at = rounds.findIndex((entry) => entry.node.id === selectedId);
			const position = at >= 0 ? rounds[at].node.turn : void 0;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "dsh-context-track-strip",
				"data-pane": "strip",
				onMouseLeave: () => {
					onHover(void 0);
				},
				onKeyDown: (event) => {
					if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
					event.preventDefault();
					event.stopPropagation();
					onMove(event.key === "ArrowRight" ? 1 : -1);
				},
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "dsh-context-track-tabs",
					role: "tablist",
					"aria-label": t("stripLabel"),
					children: entries.map((entry) => entry.kind === "turn" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(TurnChip, {
						node: entry.node,
						selected: selectedId === entry.node.id,
						hovered: hoverId === entry.node.id,
						pinned: pinned && selectedId === entry.node.id,
						selectedRef,
						t,
						onHover,
						onTurn
					}, entry.node.id) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: "dsh-context-track-mark",
						"data-mark": entry.node.id,
						title: sidecarName(entry.node.purpose, t),
						onClick: () => {
							onMark(entry.node.id);
						},
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: sidecarName(entry.node.purpose, t) })
					}, entry.node.id))
				}), rounds.length > 1 ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "dsh-context-track-strip-nav",
					"data-strip-nav": true,
					children: [
						total > 6 && position !== void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: "dsh-context-track-strip-count",
							"data-strip-count": true,
							children: t("roundIndex").replace("{n}", String(position)).replace("{total}", String(total))
						}) : null,
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: "dsh-context-track-strip-step",
							"data-strip-step": "prev",
							"aria-label": t("prevTurn"),
							title: t("prevTurn"),
							disabled: at <= 0,
							onClick: () => {
								onMove(-1);
							},
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(StripArrow, { direction: "prev" })
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: "dsh-context-track-strip-step",
							"data-strip-step": "next",
							"aria-label": t("nextTurn"),
							title: t("nextTurn"),
							disabled: at < 0 || at >= rounds.length - 1,
							onClick: () => {
								onMove(1);
							},
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(StripArrow, { direction: "next" })
						})
					]
				}) : null]
			});
		}
		function StripArrow({ direction }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
				viewBox: "0 0 16 16",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
					d: direction === "prev" ? "M9.75 3.5 5.25 8l4.5 4.5" : "M6.25 3.5 10.75 8l-4.5 4.5",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "1.6",
					strokeLinecap: "round",
					strokeLinejoin: "round"
				})
			});
		}
		/**
		* One round tab: identity and scale on the first line, the two numbers that
		* matter on the second. A bare turn number beside a duration and a total read
		* as a run of numbers, so every value now carries its own label.
		*/
		function TurnChip({ node, selected, hovered, pinned, selectedRef, t, onHover, onTurn }) {
			const elapsed = turnClock(node);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "dsh-context-track-turn",
				role: "tab",
				"aria-selected": selected,
				"aria-current": selected ? "true" : void 0,
				"data-turn-id": node.id,
				"data-turn": node.turn,
				"data-hover": hovered ? "true" : void 0,
				"data-pinned": pinned ? "true" : void 0,
				ref: selected ? selectedRef : void 0,
				onMouseEnter: () => {
					onHover(node.id);
				},
				onClick: () => {
					onTurn(node.id);
				},
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
					className: "dsh-context-track-turn-top",
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: `dsh-context-track-dot dsh-context-track-status-${node.status}`,
							"data-status": node.status
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: "dsh-context-track-turn-name",
							children: t("turn").replace("{n}", String(node.turn))
						}),
						node.status === "ok" ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: `dsh-context-track-status-${node.status} dsh-context-track-turn-flag`,
							children: t(node.status)
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(TurnSummary, {
							node,
							t
						})
					]
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
					className: "dsh-context-track-turn-meta",
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							className: "dsh-context-track-turn-stat",
							"data-chip-stat": "elapsed",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "dsh-context-track-turn-stat-label",
								children: t("elapsed")
							}), elapsed === void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "dsh-context-track-muted",
								children: t("absent")
							}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ChipNumber, { shown: formatDuration(elapsed) })]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: "dsh-context-track-turn-sep",
							"aria-hidden": "true",
							children: "·"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							className: "dsh-context-track-turn-stat",
							"data-chip-stat": "total",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "dsh-context-track-turn-stat-label",
								children: t("total")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(TurnTotal, {
								node,
								t
							})]
						})
					]
				})]
			});
		}
		/** How much happened in this round, so the tabs differ by more than a number. */
		function TurnSummary({ node, t }) {
			const steps = node.items.filter((item) => item.kind === "step").length;
			if (steps === 0) return null;
			const tools = node.items.reduce((sum, item) => item.kind === "step" ? sum + item.tools.length + (item.searches?.length ?? 0) : sum, 0);
			const parts = [t("summaryTurn").replace("{n}", String(steps))];
			if (tools > 0) parts.push(t("summaryTools").replace("{n}", String(tools)));
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: "dsh-context-track-turn-summary",
				"data-chip-summary": true,
				children: parts.join(" · ")
			});
		}
		/** Every tab carries its round total, labelled, so cost can be compared without clicking. */
		function TurnTotal({ node, t }) {
			const total = turnTotal(node);
			if (total === void 0) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: "dsh-context-track-muted",
				children: t("absent")
			});
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				"data-turn-total": true,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ChipNumber, { shown: abbreviate(total) })
			});
		}
		/** Drag the tree edge. The detail keeps the leftover space. */
		function Grip({ label, onRatio, onStep, onReset }) {
			const onPointerDown = (event) => {
				if (event.button !== 0) return;
				const handle = event.currentTarget;
				const column = handle.previousElementSibling;
				const parent = handle.parentElement;
				if (!(column instanceof HTMLElement) || parent === null) return;
				event.preventDefault();
				const columnBox = column.getBoundingClientRect();
				const parentBox = parent.getBoundingClientRect();
				const origin = columnBox.width;
				const room = parentBox.width;
				const start = event.clientX;
				try {
					handle.setPointerCapture(event.pointerId);
				} catch {}
				handle.dataset.active = "true";
				const move = (ev) => {
					if (room <= 0) return;
					onRatio(clampTreeRatio((origin + (ev.clientX - start)) / room, room));
				};
				const stop = () => {
					delete handle.dataset.active;
					handle.removeEventListener("pointermove", move);
					handle.removeEventListener("pointerup", stop);
					handle.removeEventListener("pointercancel", stop);
				};
				handle.addEventListener("pointermove", move);
				handle.addEventListener("pointerup", stop);
				handle.addEventListener("pointercancel", stop);
			};
			const onKeyDown = (event) => {
				if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
				event.preventDefault();
				event.stopPropagation();
				onStep(event.key === "ArrowRight" ? 24 : -24);
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: "dsh-context-track-grip",
				"data-pane": "splitter",
				role: "separator",
				tabIndex: 0,
				"aria-orientation": "vertical",
				"aria-label": label,
				title: label,
				onPointerDown,
				onKeyDown,
				onDoubleClick: onReset
			});
		}
		function railEntries(root) {
			const entries = [];
			for (const node of root) if (node.kind === "turn") entries.push({
				kind: "turn",
				node
			});
			else if (node.kind === "sidecar") entries.push({
				kind: "mark",
				node
			});
			return entries;
		}
		function isTurnReport(value) {
			return value !== void 0 && !("missing" in value && value.missing === true);
		}
		/** Tracks the panel's own width, not the window. Starts narrow so the first frame never flashes wide. */
		function usePanelTier(ref) {
			const [tier, setTier] = (0, react.useState)("narrow");
			(0, react.useEffect)(() => {
				const element = ref.current;
				if (element === null) return void 0;
				const apply = () => {
					const width = element.getBoundingClientRect().width;
					if (width > 0) setTier(layoutForWidth(width));
				};
				apply();
				if (typeof ResizeObserver === "undefined") return void 0;
				const observer = new ResizeObserver(() => {
					apply();
				});
				observer.observe(element);
				return () => {
					observer.disconnect();
				};
			}, [ref]);
			return tier;
		}
		/**
		* A round's number, read-only. Copy-on-click lives in the detail pane; inside a
		* tab it would turn part of the switch target into a dead zone.
		*/
		function ChipNumber({ shown }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: "dsh-context-track-num",
				title: shown.abbreviated ? shown.full : void 0,
				children: shown.text
			});
		}
		function turnClock(node) {
			if (node.startTime === void 0 || node.endTime === void 0) return void 0;
			return Math.max(0, node.endTime - node.startTime);
		}
		function turnTotal(node) {
			let total = 0;
			let seen = false;
			for (const item of node.items) {
				if (item.kind !== "step") continue;
				for (const attempt of item.attempts) {
					if (attempt.usage?.totalTokens === void 0) continue;
					total += attempt.usage.totalTokens;
					seen = true;
				}
			}
			return seen ? total : void 0;
		}
		function totalFigure(node) {
			const total = turnTotal(node);
			return total === void 0 ? { basis: "absent" } : usageFigure(total);
		}
		/** Same roll-up the host report uses, for the header while the report is still loading. */
		function hitFigure(node) {
			return cacheHitRate(node.items.flatMap((item) => item.kind === "step" ? item.attempts.flatMap((attempt) => attempt.usage === void 0 ? [] : [attempt.usage]) : []));
		}
		function clockFigure(node) {
			const clock = turnClock(node);
			return clock === void 0 ? { basis: "absent" } : usageFigure(clock);
		}
		function cursorIndex(cursors, activeKey, turnId) {
			if (activeKey !== void 0) {
				const byKey = cursors.findIndex((cursor) => cursor.key === activeKey);
				if (byKey >= 0) return byKey;
			}
			const byTurn = cursors.findIndex((cursor) => cursor.kind === "turn" && cursor.nodeId === turnId);
			return byTurn >= 0 ? byTurn : 0;
		}
		function sidecarName(purpose, t) {
			if (purpose === "session-title") return t("title");
			if (purpose === "compaction") return t("compaction");
			return t("search");
		}
		function watchLabel(t, turn, nodeId, marker, track) {
			if (marker !== void 0 && track !== void 0) {
				const side = track.root.find((item) => item.kind === "sidecar" && item.id === marker);
				if (side?.kind === "sidecar") return sidecarName(side.purpose, t);
			}
			if (turn === void 0) return "";
			if (nodeId === void 0 || nodeId === turn.id) return t("turn").replace("{n}", String(turn.turn));
			for (const item of turn.items) if (item.kind === "step") {
				if (item.id === nodeId) return t("step").replace("{n}", String(item.step));
				const attempt = item.attempts.find((entry) => entry.id === nodeId);
				if (attempt !== void 0) {
					const name = t("attempt").replace("{n}", String(attempt.attempt));
					return item.model !== void 0 && item.model.length > 0 ? `${name} · ${item.model}` : name;
				}
				const tool = item.tools.find((entry) => entry.id === nodeId);
				if (tool !== void 0) return tool.name;
			} else if (item.id === nodeId && item.kind === "sidecar") return sidecarName(item.purpose, t);
			else if (item.id === nodeId && item.kind === "unlinked") return item.childLabel ?? item.id;
			return nodeId ?? "";
		}
		/** `turn 2 / step 1 / llm_call 1`, each level clickable except the current one. */
		function crumbTrail(track, turns, nodeId, marker, t) {
			if (marker !== void 0 && track !== void 0) {
				const side = track.root.find((item) => item.kind === "sidecar" && item.id === marker);
				if (side?.kind === "sidecar") return [{ label: sidecarName(side.purpose, t) }];
				return [{ label: sidecarName("web-search", t) }];
			}
			const turn = turns.find((item) => item.id === nodeId) ?? turnFor(turns, nodeId);
			const trail = [];
			if (turn === void 0) return trail;
			trail.push({
				label: t("turn").replace("{n}", String(turn.turn)),
				id: nodeId === turn.id ? void 0 : turn.id
			});
			if (nodeId === void 0 || nodeId === turn.id) return trail;
			for (const item of turn.items) {
				if (item.kind !== "step") continue;
				if (item.id === nodeId) {
					trail.push({ label: t("step").replace("{n}", String(item.step)) });
					return trail;
				}
				const attempt = item.attempts.find((entry) => entry.id === nodeId);
				const tool = item.tools.find((entry) => entry.id === nodeId);
				if (attempt === void 0 && tool === void 0) continue;
				trail.push({
					label: t("step").replace("{n}", String(item.step)),
					id: item.id
				});
				if (attempt !== void 0) trail.push({ label: t("attempt").replace("{n}", String(attempt.attempt)) });
				else if (tool !== void 0) trail.push({ label: tool.name });
				return trail;
			}
			const side = turn.items.find((item) => item.id === nodeId && item.kind === "sidecar");
			if (side?.kind === "sidecar") trail.push({ label: sidecarName(side.purpose, t) });
			return trail;
		}
		/**
		* The row a round opens on until the user picks one: the first model call of
		* its first step, so a retried step still lands on call 1. A step that has not
		* called yet opens on itself, and a round of sidecars opens on the first one.
		*/
		function openingRow(sessionId, turn) {
			const step = turn.items.find((item) => item.kind === "step");
			if (step !== void 0) {
				const first = step.attempts[0];
				if (first !== void 0) return {
					sessionId,
					nodeId: first.id,
					key: `${sessionId}:${first.id}`,
					attemptId: first.id
				};
				return {
					sessionId,
					nodeId: step.id,
					key: `${sessionId}:${step.id}`,
					attemptId: ""
				};
			}
			const aside = turn.items.find((item) => item.kind === "sidecar" || item.kind === "unlinked");
			if (aside !== void 0) return {
				sessionId,
				nodeId: aside.id,
				key: `${sessionId}:${aside.id}`,
				attemptId: ""
			};
		}
		function turnFor(turns, nodeId) {
			if (nodeId === void 0) return void 0;
			return turns.find((turn) => turnContaining([turn], nodeId) !== void 0);
		}
		function turnContaining(turns, nodeId) {
			for (const turn of turns) {
				if (turn.id === nodeId) return turn.id;
				for (const item of turn.items) {
					if (item.id === nodeId) return turn.id;
					if (item.kind !== "step") continue;
					if (item.attempts.some((attempt) => attempt.id === nodeId)) return turn.id;
					if (item.tools.some((tool) => tool.id === nodeId)) return turn.id;
				}
			}
		}
		function revealTool(sessionId, toolId, turns, setOpen) {
			for (const turn of turns) for (const item of turn.items) {
				if (item.kind !== "step") continue;
				if (!item.tools.some((tool) => tool.id === toolId)) continue;
				setOpen((state) => ({
					...state,
					[`${sessionId}:${turn.id}`]: true,
					[`${sessionId}:${item.id}`]: true,
					[`${sessionId}:${toolId}`]: true
				}));
				return;
			}
		}
		function readTrack(projections, sessionId) {
			return projections[sessionId]?.values.track;
		}
		/**
		* Facts that change when the open node's call settles.
		* The projection may keep the same track object, so the detail reload cannot
		* key off that object's identity. A child step uses its own session's track.
		*/
		function openRevision(projections, node) {
			if (node === void 0) return "";
			const track = readTrack(projections, node.sessionId);
			if (track === void 0) return `absent:${node.sessionId}:${node.nodeId}`;
			const found = findNode(track, node.nodeId);
			if (found === void 0) return `missing:${node.nodeId}`;
			switch (found.kind) {
				case "step": return [
					"step",
					found.node.status,
					found.node.inputSeq,
					found.node.endSeq ?? "",
					found.node.attempts.map((item) => `${item.id}:${item.status}:${item.outputSeq ?? ""}:${item.retrySeq ?? ""}`).join(",")
				].join("|");
				case "attempt": return `attempt|${found.node.status}|${found.node.outputSeq ?? ""}|${found.node.retrySeq ?? ""}`;
				case "tool": return `tool|${found.node.status}|${found.node.resultSeq ?? ""}|${found.node.childLabel ?? ""}|${found.node.childMode ?? ""}`;
				case "sidecar": return `side|${found.node.status}|${found.node.outputSeq ?? ""}|${found.node.endSeq ?? ""}`;
				case "turn": return `turn|${found.node.status}|${found.node.endSeq ?? ""}`;
				case "unlinked": return `unlinked|${found.node.childLabel ?? ""}|${found.node.childMode ?? ""}`;
				default: return "unknown";
			}
		}
		//#endregion
		//#region src/client/index.ts
		/** Conversation tab id. Registered at order 30, after the tab at order 20. */
		const VIEW_ID = "context-track";
		/** Right-sidebar type id and kind. A bare name could collide with another plugin. */
		const TAB_ID = "dsh-context-track";
		/**
		* Left-sidebar row and the centre panel it opens.
		* Order 30, after the rows at 0, 10, and 20.
		*/
		const PANEL_ID = "dsh-context-track";
		/**
		* Cordis services this plugin waits for before `apply`.
		* `remote.track` is not in this list: nothing else mounts it, so waiting here
		* would leave the plugin pending. `apply` mounts it, then a child context
		* injects it. Cordis only allows reading a service from a context that injects it.
		* `sidebarRightTabs` is also deferred: the conversation tab still registers
		* when a host has no right sidebar.
		*/
		const inject = [
			"slots",
			"locale",
			"remote"
		];
		/**
		* Register the three entries. They share one panel and one remote.
		* @param ctx - browser plugin context.
		*/
		async function apply(ctx) {
			await ctx.remote.$mount(trackRemote);
			ctx.effect(() => ctx.locale.register(NS, {
				zh,
				en
			}), "dsh-context-track: dictionaries");
			const t = ctx.locale.bind(NS);
			ctx.inject(["remote.track"], (trackCtx) => {
				const getNode = (sessionId, nodeId) => trackCtx.remote.track.getNode(sessionId, nodeId);
				const getTurn = (sessionId, turnId, attemptId) => trackCtx.remote.track.getTurn(sessionId, turnId, attemptId);
				trackCtx.slots.inject("conversation.view", () => trackCtx.slots.register({
					name: "conversation.view",
					id: VIEW_ID,
					order: 30,
					locale: NS,
					label: () => t("panel"),
					inject: () => ({
						getNode,
						getTurn
					})
				}, TracePage));
				trackCtx.inject(["sidebarRightTabs"], (sideCtx) => {
					sideCtx.effect(() => sideCtx.sidebarRightTabs.register({
						id: TAB_ID,
						kind: TAB_ID,
						title: () => t("panel"),
						guide: [{
							id: VIEW_ID,
							order: 30,
							title: () => t("panel"),
							description: () => t("guide"),
							icon: TraceIcon
						}]
					}), "dsh-context-track: sidebar type");
					sideCtx.slots.inject("sidebar.right.pane.tab", () => sideCtx.slots.register({
						name: "sidebar.right.pane.tab",
						key: TAB_ID,
						locale: NS,
						inject: () => ({
							getNode,
							getTurn
						})
					}, TracePage));
					sideCtx.slots.inject("sidebar.right.pane.tab.title", () => sideCtx.slots.register({
						name: "sidebar.right.pane.tab.title",
						key: TAB_ID,
						locale: NS
					}, TraceTabTitle));
				});
				trackCtx.slots.inject("sidebar.panellist", () => trackCtx.slots.register({
					name: "sidebar.panellist",
					id: PANEL_ID,
					order: 30,
					locale: NS,
					label: () => t("panel")
				}, TraceIcon));
				trackCtx.slots.inject("main", () => trackCtx.slots.register({
					name: "main",
					key: PANEL_ID,
					locale: NS,
					inject: () => ({
						getNode,
						getTurn
					})
				}, TraceMain));
			});
		}
		//#endregion
		exports.PANEL_ID = PANEL_ID;
		exports.TAB_ID = TAB_ID;
		exports.VIEW_ID = VIEW_ID;
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=index.js.map