/**
 * @namespace: addons/dashboard/web/public/assets/vendor/libs/clipboard/clipboard.js
 * @type: Module
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.10.1-beta
 */

!((t, e) => {
	if ("object" === typeof exports && "object" === typeof module)
		module.exports = e();
	else if ("function" === typeof define && define.amd) define([], e);
	else {
		var n = e();
		for (var r in n) ("object" === typeof exports ? exports : t)[r] = n[r];
	}
})(self, () =>
	(() => {
		var t = {
				2152: (t) => {
					var e;
					(e = () =>
						(() => {
							var t = {
									686: (_t, e, n) => {
										n.d(e, {
											default: () => w,
										});
										var r = n(279),
											o = n.n(r),
											i = n(370),
											u = n.n(i),
											c = n(817),
											a = n.n(c);
										function f(t) {
											try {
												return document.execCommand(t);
											} catch (_t) {
												return !1;
											}
										}
										var l = (t) => {
												var e = a()(t);
												return f("cut"), e;
											},
											s = (t, e) => {
												var n = ((t) => {
													var e =
															"rtl" ===
															document.documentElement.getAttribute("dir"),
														n = document.createElement("textarea");
													(n.style.fontSize = "12pt"),
														(n.style.border = "0"),
														(n.style.padding = "0"),
														(n.style.margin = "0"),
														(n.style.position = "absolute"),
														(n.style[e ? "right" : "left"] = "-9999px");
													var r =
														window.pageYOffset ||
														document.documentElement.scrollTop;
													return (
														(n.style.top = "".concat(r, "px")),
														n.setAttribute("readonly", ""),
														(n.value = t),
														n
													);
												})(t);
												e.container.appendChild(n);
												var r = a()(n);
												return f("copy"), n.remove(), r;
											},
											p = function (t) {
												var e =
														arguments.length > 1 && void 0 !== arguments[1]
															? arguments[1]
															: { container: document.body },
													n = "";
												return (
													"string" === typeof t
														? (n = s(t, e))
														: t instanceof HTMLInputElement &&
																![
																	"text",
																	"search",
																	"url",
																	"tel",
																	"password",
																].includes(null == t ? void 0 : t.type)
															? (n = s(t.value, e))
															: ((n = a()(t)), f("copy")),
													n
												);
											};
										function d(t) {
											return (
												(d =
													"function" === typeof Symbol &&
													"symbol" === typeof Symbol.iterator
														? (t) => typeof t
														: (t) =>
																t &&
																"function" === typeof Symbol &&
																t.constructor === Symbol &&
																t !== Symbol.prototype
																	? "symbol"
																	: typeof t),
												d(t)
											);
										}
										var y = function () {
											var t =
													arguments.length > 0 && void 0 !== arguments[0]
														? arguments[0]
														: {},
												e = t.action,
												n = void 0 === e ? "copy" : e,
												r = t.container,
												o = t.target,
												i = t.text;
											if ("copy" !== n && "cut" !== n)
												throw new Error(
													'Invalid "action" value, use either "copy" or "cut"',
												);
											if (void 0 !== o) {
												if (!o || "object" !== d(o) || 1 !== o.nodeType)
													throw new Error(
														'Invalid "target" value, use a valid Element',
													);
												if ("copy" === n && o.hasAttribute("disabled"))
													throw new Error(
														'Invalid "target" attribute. Please use "readonly" instead of "disabled" attribute',
													);
												if (
													"cut" === n &&
													(o.hasAttribute("readonly") ||
														o.hasAttribute("disabled"))
												)
													throw new Error(
														'Invalid "target" attribute. You can\'t cut text from elements with "readonly" or "disabled" attributes',
													);
											}
											return i
												? p(i, { container: r })
												: o
													? "cut" === n
														? l(o)
														: p(o, { container: r })
													: void 0;
										};
										function v(t) {
											return (
												(v =
													"function" === typeof Symbol &&
													"symbol" === typeof Symbol.iterator
														? (t) => typeof t
														: (t) =>
																t &&
																"function" === typeof Symbol &&
																t.constructor === Symbol &&
																t !== Symbol.prototype
																	? "symbol"
																	: typeof t),
												v(t)
											);
										}
										function h(t, e) {
											for (var n = 0; n < e.length; n++) {
												var r = e[n];
												(r.enumerable = r.enumerable || !1),
													(r.configurable = !0),
													"value" in r && (r.writable = !0),
													Object.defineProperty(t, r.key, r);
											}
										}
										function m(t, e) {
											return (
												(m =
													Object.setPrototypeOf ||
													((t, e) => ((t.__proto__ = e), t))),
												m(t, e)
											);
										}
										function b(t) {
											var e = (() => {
												if (
													"undefined" === typeof Reflect ||
													!Reflect.construct
												)
													return !1;
												if (Reflect.construct.sham) return !1;
												if ("function" === typeof Proxy) return !0;
												try {
													return (
														Date.prototype.toString.call(
															Reflect.construct(Date, [], () => {}),
														),
														!0
													);
												} catch (_t) {
													return !1;
												}
											})();
											return function () {
												var n,
													r = g(t);
												if (e) {
													var o = g(this).constructor;
													n = Reflect.construct(r, arguments, o);
												} else n = r.apply(this, arguments);
												return ((t, e) =>
													!e || ("object" !== v(e) && "function" !== typeof e)
														? ((t) => {
																if (void 0 === t)
																	throw new ReferenceError(
																		"this hasn't been initialised - super() hasn't been called",
																	);
																return t;
															})(t)
														: e)(this, n);
											};
										}
										function g(t) {
											return (
												(g = Object.setPrototypeOf
													? Object.getPrototypeOf
													: (t) => t.__proto__ || Object.getPrototypeOf(t)),
												g(t)
											);
										}
										function S(t, e) {
											var n = "data-clipboard-".concat(t);
											if (e.hasAttribute(n)) return e.getAttribute(n);
										}
										var x = ((t) => {
												!((t, e) => {
													if ("function" !== typeof e && null !== e)
														throw new TypeError(
															"Super expression must either be null or a function",
														);
													(t.prototype = Object.create(e?.prototype, {
														constructor: {
															value: t,
															writable: !0,
															configurable: !0,
														},
													})),
														e && m(t, e);
												})(i, t);
												var e,
													n,
													r,
													o = b(i);
												function i(t, e) {
													var n;
													return (
														((t, e) => {
															if (!(t instanceof e))
																throw new TypeError(
																	"Cannot call a class as a function",
																);
														})(this, i),
														(n = o.call(this)).resolveOptions(e),
														n.listenClick(t),
														n
													);
												}
												return (
													(e = i),
													(n = [
														{
															key: "resolveOptions",
															value: function () {
																var t =
																	arguments.length > 0 &&
																	void 0 !== arguments[0]
																		? arguments[0]
																		: {};
																(this.action =
																	"function" === typeof t.action
																		? t.action
																		: this.defaultAction),
																	(this.target =
																		"function" === typeof t.target
																			? t.target
																			: this.defaultTarget),
																	(this.text =
																		"function" === typeof t.text
																			? t.text
																			: this.defaultText),
																	(this.container =
																		"object" === v(t.container)
																			? t.container
																			: document.body);
															},
														},
														{
															key: "listenClick",
															value: function (t) {
																this.listener = u()(t, "click", (t) =>
																	this.onClick(t),
																);
															},
														},
														{
															key: "onClick",
															value: function (t) {
																var e = t.delegateTarget || t.currentTarget,
																	n = this.action(e) || "copy",
																	r = y({
																		action: n,
																		container: this.container,
																		target: this.target(e),
																		text: this.text(e),
																	});
																this.emit(r ? "success" : "error", {
																	action: n,
																	text: r,
																	trigger: e,
																	clearSelection: () => {
																		e?.focus(),
																			window.getSelection().removeAllRanges();
																	},
																});
															},
														},
														{
															key: "defaultAction",
															value: (t) => S("action", t),
														},
														{
															key: "defaultTarget",
															value: (t) => {
																var e = S("target", t);
																if (e) return document.querySelector(e);
															},
														},
														{
															key: "defaultText",
															value: (t) => S("text", t),
														},
														{
															key: "destroy",
															value: function () {
																this.listener.destroy();
															},
														},
													]),
													(r = [
														{
															key: "copy",
															value: function (t) {
																var e =
																	arguments.length > 1 &&
																	void 0 !== arguments[1]
																		? arguments[1]
																		: { container: document.body };
																return p(t, e);
															},
														},
														{
															key: "cut",
															value: (t) => l(t),
														},
														{
															key: "isSupported",
															value: function () {
																var t =
																		arguments.length > 0 &&
																		void 0 !== arguments[0]
																			? arguments[0]
																			: ["copy", "cut"],
																	e = "string" === typeof t ? [t] : t,
																	n = !!document.queryCommandSupported;
																return (
																	e.forEach((t) => {
																		n =
																			n && !!document.queryCommandSupported(t);
																	}),
																	n
																);
															},
														},
													]),
													n && h(e.prototype, n),
													r && h(e, r),
													i
												);
											})(o()),
											w = x;
									},
									828: (t) => {
										if (
											"undefined" !== typeof Element &&
											!Element.prototype.matches
										) {
											var e = Element.prototype;
											e.matches =
												e.matchesSelector ||
												e.mozMatchesSelector ||
												e.msMatchesSelector ||
												e.oMatchesSelector ||
												e.webkitMatchesSelector;
										}
										t.exports = (t, e) => {
											for (; t && 9 !== t.nodeType; ) {
												if ("function" === typeof t.matches && t.matches(e))
													return t;
												t = t.parentNode;
											}
										};
									},
									438: (t, _e, n) => {
										var r = n(828);
										function o(t, _e, n, _r, o) {
											var u = i.apply(this, arguments);
											return (
												t.addEventListener(n, u, o),
												{
													destroy: () => {
														t.removeEventListener(n, u, o);
													},
												}
											);
										}
										function i(t, e, _n, o) {
											return (n) => {
												(n.delegateTarget = r(n.target, e)),
													n.delegateTarget && o.call(t, n);
											};
										}
										t.exports = function (t, e, n, r, i) {
											return "function" === typeof t.addEventListener
												? o.apply(null, arguments)
												: "function" === typeof n
													? o.bind(null, document).apply(null, arguments)
													: ("string" === typeof t &&
															(t = document.querySelectorAll(t)),
														Array.prototype.map.call(t, (t) =>
															o(t, e, n, r, i),
														));
										};
									},
									879: (_t, e) => {
										(e.node = (t) =>
											void 0 !== t &&
											t instanceof HTMLElement &&
											1 === t.nodeType),
											(e.nodeList = (t) => {
												var n = Object.prototype.toString.call(t);
												return (
													void 0 !== t &&
													("[object NodeList]" === n ||
														"[object HTMLCollection]" === n) &&
													"length" in t &&
													(0 === t.length || e.node(t[0]))
												);
											}),
											(e.string = (t) =>
												"string" === typeof t || t instanceof String),
											(e.fn = (t) =>
												"[object Function]" ===
												Object.prototype.toString.call(t));
									},
									370: (t, _e, n) => {
										var r = n(879),
											o = n(438);
										t.exports = (t, e, n) => {
											if (!t && !e && !n)
												throw new Error("Missing required arguments");
											if (!r.string(e))
												throw new TypeError("Second argument must be a String");
											if (!r.fn(n))
												throw new TypeError(
													"Third argument must be a Function",
												);
											if (r.node(t))
												return ((t, e, n) => (
													t.addEventListener(e, n),
													{
														destroy: () => {
															t.removeEventListener(e, n);
														},
													}
												))(t, e, n);
											if (r.nodeList(t))
												return ((t, e, n) => (
													Array.prototype.forEach.call(t, (t) => {
														t.addEventListener(e, n);
													}),
													{
														destroy: () => {
															Array.prototype.forEach.call(t, (t) => {
																t.removeEventListener(e, n);
															});
														},
													}
												))(t, e, n);
											if (r.string(t))
												return ((t, e, n) => o(document.body, t, e, n))(
													t,
													e,
													n,
												);
											throw new TypeError(
												"First argument must be a String, HTMLElement, HTMLCollection, or NodeList",
											);
										};
									},
									817: (t) => {
										t.exports = (t) => {
											var e;
											if ("SELECT" === t.nodeName) t.focus(), (e = t.value);
											else if (
												"INPUT" === t.nodeName ||
												"TEXTAREA" === t.nodeName
											) {
												var n = t.hasAttribute("readonly");
												n || t.setAttribute("readonly", ""),
													t.select(),
													t.setSelectionRange(0, t.value.length),
													n || t.removeAttribute("readonly"),
													(e = t.value);
											} else {
												t.hasAttribute("contenteditable") && t.focus();
												var r = window.getSelection(),
													o = document.createRange();
												o.selectNodeContents(t),
													r.removeAllRanges(),
													r.addRange(o),
													(e = r.toString());
											}
											return e;
										};
									},
									279: (t) => {
										function e() {}
										(e.prototype = {
											on: function (t, e, n) {
												var r = this.e || (this.e = {});
												return (
													(r[t] || (r[t] = [])).push({ fn: e, ctx: n }), this
												);
											},
											once: function (t, e, n) {
												var r = this;
												function o() {
													r.off(t, o), e.apply(n, arguments);
												}
												return (o._ = e), this.on(t, o, n);
											},
											emit: function (t) {
												for (
													var e = [].slice.call(arguments, 1),
														n = ((this.e || (this.e = {}))[t] || []).slice(),
														r = 0,
														o = n.length;
													r < o;
													r++
												)
													n[r].fn.apply(n[r].ctx, e);
												return this;
											},
											off: function (t, e) {
												var n = this.e || (this.e = {}),
													r = n[t],
													o = [];
												if (r && e)
													for (var i = 0, u = r.length; i < u; i++)
														r[i].fn !== e && r[i].fn._ !== e && o.push(r[i]);
												return o.length ? (n[t] = o) : delete n[t], this;
											},
										}),
											(t.exports = e),
											(t.exports.TinyEmitter = e);
									},
								},
								e = {};
							function n(r) {
								if (e[r]) return e[r].exports;
								var o = (e[r] = { exports: {} });
								return t[r](o, o.exports, n), o.exports;
							}
							return (
								(n.n = (t) => {
									var e = t?.__esModule ? () => t.default : () => t;
									return n.d(e, { a: e }), e;
								}),
								(n.d = (t, e) => {
									for (var r in e)
										n.o(e, r) &&
											!n.o(t, r) &&
											Object.defineProperty(t, r, {
												enumerable: !0,
												get: e[r],
											});
								}),
								(n.o = (t, e) => Object.hasOwn(t, e)),
								n(686)
							);
						})().default),
						(t.exports = e());
				},
			},
			e = {};
		function n(r) {
			var o = e[r];
			if (void 0 !== o) return o.exports;
			var i = (e[r] = { exports: {} });
			return t[r].call(i.exports, i, i.exports, n), i.exports;
		}
		(n.n = (t) => {
			var e = t?.__esModule ? () => t.default : () => t;
			return n.d(e, { a: e }), e;
		}),
			(n.d = (t, e) => {
				for (var r in e)
					n.o(e, r) &&
						!n.o(t, r) &&
						Object.defineProperty(t, r, { enumerable: !0, get: e[r] });
			}),
			(n.o = (t, e) => Object.hasOwn(t, e)),
			(n.r = (t) => {
				"undefined" !== typeof Symbol &&
					Symbol.toStringTag &&
					Object.defineProperty(t, Symbol.toStringTag, { value: "Module" }),
					Object.defineProperty(t, "__esModule", { value: !0 });
			});
		var r = {};
		return (
			(() => {
				n.r(r),
					n.d(r, {
						ClipboardJS: () => e.a,
					});
				var t = n(2152),
					e = n.n(t);
				try {
					window.ClipboardJS = e();
				} catch (_t) {}
			})(),
			r
		);
	})(),
);
