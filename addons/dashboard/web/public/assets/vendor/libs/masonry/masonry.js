/**
 * @namespace: addons/dashboard/web/public/assets/vendor/libs/masonry/masonry.js
 * @type: Module
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.10.0-beta
 */

!((t, i) => {
	if ("object" === typeof exports && "object" === typeof module)
		module.exports = i();
	else if ("function" === typeof define && define.amd) define([], i);
	else {
		var e = i();
		for (var n in e) ("object" === typeof exports ? exports : t)[n] = e[n];
	}
})(self, () =>
	(() => {
		var t = {
				9741: (t, i, e) => {
					var n, o;
					!((_r, s) => {
						void 0 ===
							(o = "function" === typeof (n = s) ? n.call(i, e, i, t) : n) ||
							(t.exports = o);
					})(window, () => {
						var t = (() => {
							var t = window.Element.prototype;
							if (t.matches) return "matches";
							if (t.matchesSelector) return "matchesSelector";
							for (
								var i = ["webkit", "moz", "ms", "o"], e = 0;
								e < i.length;
								e++
							) {
								var n = `${i[e]}MatchesSelector`;
								if (t[n]) return n;
							}
						})();
						return (i, e) => i[t](e);
					});
				},
				7158: (t, i, e) => {
					var n, o;
					"undefined" !== typeof window && window,
						void 0 ===
							(o =
								"function" ===
								typeof (n = () => {
									function t() {}
									var i = t.prototype;
									return (
										(i.on = function (t, i) {
											if (t && i) {
												var e = (this._events = this._events || {}),
													n = (e[t] = e[t] || []);
												return -1 === n.indexOf(i) && n.push(i), this;
											}
										}),
										(i.once = function (t, i) {
											if (t && i) {
												this.on(t, i);
												var e = (this._onceEvents = this._onceEvents || {});
												return ((e[t] = e[t] || {})[i] = !0), this;
											}
										}),
										(i.off = function (t, i) {
											var e = this._events?.[t];
											if (e?.length) {
												var n = e.indexOf(i);
												return -1 !== n && e.splice(n, 1), this;
											}
										}),
										(i.emitEvent = function (t, i) {
											var e = this._events?.[t];
											if (e?.length) {
												(e = e.slice(0)), (i = i || []);
												for (
													var n = this._onceEvents?.[t], o = 0;
													o < e.length;
													o++
												) {
													var r = e[o];
													n?.[r] && (this.off(t, r), delete n[r]),
														r.apply(this, i);
												}
												return this;
											}
										}),
										(i.allOff = function () {
											delete this._events, delete this._onceEvents;
										}),
										t
									);
								})
									? n.call(i, e, i, t)
									: n) || (t.exports = o);
				},
				9047: (t, i, e) => {
					var n, o;
					!((r) => {
						(n = [e(9741)]),
							(o = ((t) =>
								((t, i) => {
									var e = {
											extend: (t, i) => {
												for (var e in i) t[e] = i[e];
												return t;
											},
											modulo: (t, i) => ((t % i) + i) % i,
										},
										n = Array.prototype.slice;
									(e.makeArray = (t) =>
										Array.isArray(t)
											? t
											: null == t
												? []
												: "object" === typeof t && "number" === typeof t.length
													? n.call(t)
													: [t]),
										(e.removeFrom = (t, i) => {
											var e = t.indexOf(i);
											-1 !== e && t.splice(e, 1);
										}),
										(e.getParent = (t, e) => {
											for (; t.parentNode && t !== document.body; )
												if (((t = t.parentNode), i(t, e))) return t;
										}),
										(e.getQueryElement = (t) =>
											"string" === typeof t ? document.querySelector(t) : t),
										(e.handleEvent = function (t) {
											var i = `on${t.type}`;
											this[i]?.(t);
										}),
										(e.filterFindElements = (t, n) => {
											t = e.makeArray(t);
											var o = [];
											return (
												t.forEach((t) => {
													if (t instanceof HTMLElement)
														if (n) {
															i(t, n) && o.push(t);
															for (
																var e = t.querySelectorAll(n), r = 0;
																r < e.length;
																r++
															)
																o.push(e[r]);
														} else o.push(t);
												}),
												o
											);
										}),
										(e.debounceMethod = (t, i, e) => {
											e = e || 100;
											var n = t.prototype[i],
												o = `${i}Timeout`;
											t.prototype[i] = function () {
												var t = this[o];
												clearTimeout(t);
												var i = arguments;
												this[o] = setTimeout(() => {
													n.apply(this, i), delete this[o];
												}, e);
											};
										}),
										(e.docReady = (t) => {
											var i = document.readyState;
											"complete" === i || "interactive" === i
												? setTimeout(t)
												: document.addEventListener("DOMContentLoaded", t);
										}),
										(e.toDashed = (t) =>
											t
												.replace(/(.)([A-Z])/g, (_t, i, e) => `${i}-${e}`)
												.toLowerCase());
									var o = t.console;
									return (
										(e.htmlInit = (i, n) => {
											e.docReady(() => {
												var r = e.toDashed(n),
													s = `data-${r}`,
													a = document.querySelectorAll(`[${s}]`),
													h = document.querySelectorAll(`.js-${r}`),
													u = e.makeArray(a).concat(e.makeArray(h)),
													l = `${s}-options`,
													c = t.jQuery;
												u.forEach((t) => {
													var e,
														r = t.getAttribute(s) || t.getAttribute(l);
													try {
														e = r && JSON.parse(r);
													} catch (i) {
														return void o?.error(
															"Error parsing " +
																s +
																" on " +
																t.className +
																": " +
																i,
														);
													}
													var a = new i(t, e);
													c?.data(t, n, a);
												});
											});
										}),
										e
									);
								})(r, t)).apply(i, n)),
							void 0 === o || (t.exports = o);
					})(window);
				},
				6131: (t, i, e) => {
					var n, o;
					window,
						void 0 ===
							(o =
								"function" ===
								typeof (n = () => {
									function t(t) {
										var i = parseFloat(t);
										return -1 === t.indexOf("%") && !Number.isNaN(i) && i;
									}
									function i() {}
									var e = "undefined" === typeof console ? i : (_t) => {},
										n = [
											"paddingLeft",
											"paddingRight",
											"paddingTop",
											"paddingBottom",
											"marginLeft",
											"marginRight",
											"marginTop",
											"marginBottom",
											"borderLeftWidth",
											"borderRightWidth",
											"borderTopWidth",
											"borderBottomWidth",
										],
										o = n.length;
									function r() {
										for (
											var t = {
													width: 0,
													height: 0,
													innerWidth: 0,
													innerHeight: 0,
													outerWidth: 0,
													outerHeight: 0,
												},
												i = 0;
											i < o;
											i++
										)
											t[n[i]] = 0;
										return t;
									}
									function s(t) {
										var i = getComputedStyle(t);
										return (
											i ||
												e(
													"Style returned " +
														i +
														". Are you running this code in a hidden iframe on Firefox? See https://bit.ly/getsizebug1",
												),
											i
										);
									}
									var a,
										h = !1;
									function u() {
										if (!h) {
											h = !0;
											var i = document.createElement("div");
											(i.style.width = "200px"),
												(i.style.padding = "1px 2px 3px 4px"),
												(i.style.borderStyle = "solid"),
												(i.style.borderWidth = "1px 2px 3px 4px"),
												(i.style.boxSizing = "border-box");
											var e = document.body || document.documentElement;
											e.appendChild(i);
											var n = s(i);
											(a = 200 === Math.round(t(n.width))),
												(l.isBoxSizeOuter = a),
												e.removeChild(i);
										}
									}
									function l(i) {
										if (
											(u(),
											"string" === typeof i && (i = document.querySelector(i)),
											i && "object" === typeof i && i.nodeType)
										) {
											var e = s(i);
											if ("none" === e.display) return r();
											var h = {};
											(h.width = i.offsetWidth), (h.height = i.offsetHeight);
											for (
												var l = (h.isBorderBox = "border-box" === e.boxSizing),
													c = 0;
												c < o;
												c++
											) {
												var d = n[c],
													f = e[d],
													p = parseFloat(f);
												h[d] = Number.isNaN(p) ? 0 : p;
											}
											var m = h.paddingLeft + h.paddingRight,
												g = h.paddingTop + h.paddingBottom,
												v = h.marginLeft + h.marginRight,
												y = h.marginTop + h.marginBottom,
												_ = h.borderLeftWidth + h.borderRightWidth,
												b = h.borderTopWidth + h.borderBottomWidth,
												E = l && a,
												x = t(e.width);
											!1 !== x && (h.width = x + (E ? 0 : m + _));
											var T = t(e.height);
											return (
												!1 !== T && (h.height = T + (E ? 0 : g + b)),
												(h.innerWidth = h.width - (m + _)),
												(h.innerHeight = h.height - (g + b)),
												(h.outerWidth = h.width + v),
												(h.outerHeight = h.height + y),
												h
											);
										}
									}
									return l;
								})
									? n.call(i, e, i, t)
									: n) || (t.exports = o);
				},
				8751: (t, i, e) => {
					var n, o, r;
					window,
						(o = [e(1794), e(6131)]),
						void 0 ===
							(r =
								"function" ===
								typeof (n = (t, i) => {
									var e = t.create("masonry");
									e.compatOptions.fitWidth = "isFitWidth";
									var n = e.prototype;
									return (
										(n._resetLayout = function () {
											this.getSize(),
												this._getMeasurement("columnWidth", "outerWidth"),
												this._getMeasurement("gutter", "outerWidth"),
												this.measureColumns(),
												(this.colYs = []);
											for (var t = 0; t < this.cols; t++) this.colYs.push(0);
											(this.maxY = 0), (this.horizontalColIndex = 0);
										}),
										(n.measureColumns = function () {
											if ((this.getContainerWidth(), !this.columnWidth)) {
												var t = this.items[0],
													e = t?.element;
												this.columnWidth =
													(e && i(e).outerWidth) || this.containerWidth;
											}
											var n = (this.columnWidth += this.gutter),
												o = this.containerWidth + this.gutter,
												r = o / n,
												s = n - (o % n);
											(r = Math[s && s < 1 ? "round" : "floor"](r)),
												(this.cols = Math.max(r, 1));
										}),
										(n.getContainerWidth = function () {
											var t = this._getOption("fitWidth")
													? this.element.parentNode
													: this.element,
												e = i(t);
											this.containerWidth = e?.innerWidth;
										}),
										(n._getItemLayoutPosition = function (t) {
											t.getSize();
											var i = t.size.outerWidth % this.columnWidth,
												e = Math[i && i < 1 ? "round" : "ceil"](
													t.size.outerWidth / this.columnWidth,
												);
											e = Math.min(e, this.cols);
											for (
												var n = this[
														this.options.horizontalOrder
															? "_getHorizontalColPosition"
															: "_getTopColPosition"
													](e, t),
													o = { x: this.columnWidth * n.col, y: n.y },
													r = n.y + t.size.outerHeight,
													s = e + n.col,
													a = n.col;
												a < s;
												a++
											)
												this.colYs[a] = r;
											return o;
										}),
										(n._getTopColPosition = function (t) {
											var i = this._getTopColGroup(t),
												e = Math.min.apply(Math, i);
											return { col: i.indexOf(e), y: e };
										}),
										(n._getTopColGroup = function (t) {
											if (t < 2) return this.colYs;
											for (var i = [], e = this.cols + 1 - t, n = 0; n < e; n++)
												i[n] = this._getColGroupY(n, t);
											return i;
										}),
										(n._getColGroupY = function (t, i) {
											if (i < 2) return this.colYs[t];
											var e = this.colYs.slice(t, t + i);
											return Math.max.apply(Math, e);
										}),
										(n._getHorizontalColPosition = function (t, i) {
											var e = this.horizontalColIndex % this.cols;
											e = t > 1 && e + t > this.cols ? 0 : e;
											var n = i.size.outerWidth && i.size.outerHeight;
											return (
												(this.horizontalColIndex = n
													? e + t
													: this.horizontalColIndex),
												{ col: e, y: this._getColGroupY(e, t) }
											);
										}),
										(n._manageStamp = function (t) {
											var e = i(t),
												n = this._getElementOffset(t),
												o = this._getOption("originLeft") ? n.left : n.right,
												r = o + e.outerWidth,
												s = Math.floor(o / this.columnWidth);
											s = Math.max(0, s);
											var a = Math.floor(r / this.columnWidth);
											(a -= r % this.columnWidth ? 0 : 1),
												(a = Math.min(this.cols - 1, a));
											for (
												var h =
														(this._getOption("originTop") ? n.top : n.bottom) +
														e.outerHeight,
													u = s;
												u <= a;
												u++
											)
												this.colYs[u] = Math.max(h, this.colYs[u]);
										}),
										(n._getContainerSize = function () {
											this.maxY = Math.max.apply(Math, this.colYs);
											var t = { height: this.maxY };
											return (
												this._getOption("fitWidth") &&
													(t.width = this._getContainerFitWidth()),
												t
											);
										}),
										(n._getContainerFitWidth = function () {
											for (
												var t = 0, i = this.cols;
												--i && 0 === this.colYs[i];
											)
												t++;
											return (this.cols - t) * this.columnWidth - this.gutter;
										}),
										(n.needsResizeLayout = function () {
											var t = this.containerWidth;
											return (
												this.getContainerWidth(), t !== this.containerWidth
											);
										}),
										e
									);
								})
									? n.apply(i, o)
									: n) || (t.exports = r);
				},
				652: (t, i, e) => {
					var n, o, r;
					window,
						(o = [e(7158), e(6131)]),
						void 0 ===
							(r =
								"function" ===
								typeof (n = (t, i) => {
									function e(t) {
										for (var _i in t) return !1;
										return !0;
									}
									var n = document.documentElement.style,
										o =
											"string" === typeof n.transition
												? "transition"
												: "WebkitTransition",
										r =
											"string" === typeof n.transform
												? "transform"
												: "WebkitTransform",
										s = {
											WebkitTransition: "webkitTransitionEnd",
											transition: "transitionend",
										}[o],
										a = {
											transform: r,
											transition: o,
											transitionDuration: `${o}Duration`,
											transitionProperty: `${o}Property`,
											transitionDelay: `${o}Delay`,
										};
									function h(t, i) {
										t &&
											((this.element = t),
											(this.layout = i),
											(this.position = { x: 0, y: 0 }),
											this._create());
									}
									var u = (h.prototype = Object.create(t.prototype));
									function l(t) {
										return t.replace(/([A-Z])/g, (t) => `-${t.toLowerCase()}`);
									}
									(u.constructor = h),
										(u._create = function () {
											(this._transn = {
												ingProperties: {},
												clean: {},
												onEnd: {},
											}),
												this.css({ position: "absolute" });
										}),
										(u.handleEvent = function (t) {
											var i = `on${t.type}`;
											this[i]?.(t);
										}),
										(u.getSize = function () {
											this.size = i(this.element);
										}),
										(u.css = function (t) {
											var i = this.element.style;
											for (var e in t) i[a[e] || e] = t[e];
										}),
										(u.getPosition = function () {
											var t = getComputedStyle(this.element),
												i = this.layout._getOption("originLeft"),
												e = this.layout._getOption("originTop"),
												n = t[i ? "left" : "right"],
												o = t[e ? "top" : "bottom"],
												r = parseFloat(n),
												s = parseFloat(o),
												a = this.layout.size;
											-1 !== n.indexOf("%") && (r = (r / 100) * a.width),
												-1 !== o.indexOf("%") && (s = (s / 100) * a.height),
												(r = Number.isNaN(r) ? 0 : r),
												(s = Number.isNaN(s) ? 0 : s),
												(r -= i ? a.paddingLeft : a.paddingRight),
												(s -= e ? a.paddingTop : a.paddingBottom),
												(this.position.x = r),
												(this.position.y = s);
										}),
										(u.layoutPosition = function () {
											var t = this.layout.size,
												i = {},
												e = this.layout._getOption("originLeft"),
												n = this.layout._getOption("originTop"),
												o = e ? "paddingLeft" : "paddingRight",
												r = e ? "left" : "right",
												s = e ? "right" : "left",
												a = this.position.x + t[o];
											(i[r] = this.getXValue(a)), (i[s] = "");
											var h = n ? "paddingTop" : "paddingBottom",
												u = n ? "top" : "bottom",
												l = n ? "bottom" : "top",
												c = this.position.y + t[h];
											(i[u] = this.getYValue(c)),
												(i[l] = ""),
												this.css(i),
												this.emitEvent("layout", [this]);
										}),
										(u.getXValue = function (t) {
											var i = this.layout._getOption("horizontal");
											return this.layout.options.percentPosition && !i
												? `${(t / this.layout.size.width) * 100}%`
												: `${t}px`;
										}),
										(u.getYValue = function (t) {
											var i = this.layout._getOption("horizontal");
											return this.layout.options.percentPosition && i
												? `${(t / this.layout.size.height) * 100}%`
												: `${t}px`;
										}),
										(u._transitionTo = function (t, i) {
											this.getPosition();
											var e = this.position.x,
												n = this.position.y,
												o = t === this.position.x && i === this.position.y;
											if (
												(this.setPosition(t, i), !o || this.isTransitioning)
											) {
												var r = t - e,
													s = i - n,
													a = {};
												(a.transform = this.getTranslate(r, s)),
													this.transition({
														to: a,
														onTransitionEnd: { transform: this.layoutPosition },
														isCleaning: !0,
													});
											} else this.layoutPosition();
										}),
										(u.getTranslate = function (t, i) {
											return (
												"translate3d(" +
												(t = this.layout._getOption("originLeft") ? t : -t) +
												"px, " +
												(i = this.layout._getOption("originTop") ? i : -i) +
												"px, 0)"
											);
										}),
										(u.goTo = function (t, i) {
											this.setPosition(t, i), this.layoutPosition();
										}),
										(u.moveTo = u._transitionTo),
										(u.setPosition = function (t, i) {
											(this.position.x = parseFloat(t)),
												(this.position.y = parseFloat(i));
										}),
										(u._nonTransition = function (t) {
											for (var i in (this.css(t.to),
											t.isCleaning && this._removeStyles(t.to),
											t.onTransitionEnd))
												t.onTransitionEnd[i].call(this);
										}),
										(u.transition = function (t) {
											if (parseFloat(this.layout.options.transitionDuration)) {
												var i = this._transn;
												for (var e in t.onTransitionEnd)
													i.onEnd[e] = t.onTransitionEnd[e];
												for (e in t.to)
													(i.ingProperties[e] = !0),
														t.isCleaning && (i.clean[e] = !0);
												t.from && (this.css(t.from), this.element.offsetHeight),
													this.enableTransition(t.to),
													this.css(t.to),
													(this.isTransitioning = !0);
											} else this._nonTransition(t);
										});
									var c = `opacity,${l(r)}`;
									(u.enableTransition = function () {
										if (!this.isTransitioning) {
											var t = this.layout.options.transitionDuration;
											(t = "number" === typeof t ? `${t}ms` : t),
												this.css({
													transitionProperty: c,
													transitionDuration: t,
													transitionDelay: this.staggerDelay || 0,
												}),
												this.element.addEventListener(s, this, !1);
										}
									}),
										(u.onwebkitTransitionEnd = function (t) {
											this.ontransitionend(t);
										}),
										(u.onotransitionend = function (t) {
											this.ontransitionend(t);
										});
									var d = { "-webkit-transform": "transform" };
									(u.ontransitionend = function (t) {
										if (t.target === this.element) {
											var i = this._transn,
												n = d[t.propertyName] || t.propertyName;
											delete i.ingProperties[n],
												e(i.ingProperties) && this.disableTransition(),
												n in i.clean &&
													((this.element.style[t.propertyName] = ""),
													delete i.clean[n]),
												n in i.onEnd &&
													(i.onEnd[n].call(this), delete i.onEnd[n]),
												this.emitEvent("transitionEnd", [this]);
										}
									}),
										(u.disableTransition = function () {
											this.removeTransitionStyles(),
												this.element.removeEventListener(s, this, !1),
												(this.isTransitioning = !1);
										}),
										(u._removeStyles = function (t) {
											var i = {};
											for (var e in t) i[e] = "";
											this.css(i);
										});
									var f = {
										transitionProperty: "",
										transitionDuration: "",
										transitionDelay: "",
									};
									return (
										(u.removeTransitionStyles = function () {
											this.css(f);
										}),
										(u.stagger = function (t) {
											(t = Number.isNaN(t) ? 0 : t),
												(this.staggerDelay = `${t}ms`);
										}),
										(u.removeElem = function () {
											this.element.parentNode.removeChild(this.element),
												this.css({ display: "" }),
												this.emitEvent("remove", [this]);
										}),
										(u.remove = function () {
											o && parseFloat(this.layout.options.transitionDuration)
												? (this.once("transitionEnd", function () {
														this.removeElem();
													}),
													this.hide())
												: this.removeElem();
										}),
										(u.reveal = function () {
											delete this.isHidden, this.css({ display: "" });
											var t = this.layout.options,
												i = {};
											(i[
												this.getHideRevealTransitionEndProperty("visibleStyle")
											] = this.onRevealTransitionEnd),
												this.transition({
													from: t.hiddenStyle,
													to: t.visibleStyle,
													isCleaning: !0,
													onTransitionEnd: i,
												});
										}),
										(u.onRevealTransitionEnd = function () {
											this.isHidden || this.emitEvent("reveal");
										}),
										(u.getHideRevealTransitionEndProperty = function (t) {
											var i = this.layout.options[t];
											if (i.opacity) return "opacity";
											for (var e in i) return e;
										}),
										(u.hide = function () {
											(this.isHidden = !0), this.css({ display: "" });
											var t = this.layout.options,
												i = {};
											(i[
												this.getHideRevealTransitionEndProperty("hiddenStyle")
											] = this.onHideTransitionEnd),
												this.transition({
													from: t.visibleStyle,
													to: t.hiddenStyle,
													isCleaning: !0,
													onTransitionEnd: i,
												});
										}),
										(u.onHideTransitionEnd = function () {
											this.isHidden &&
												(this.css({ display: "none" }), this.emitEvent("hide"));
										}),
										(u.destroy = function () {
											this.css({
												position: "",
												left: "",
												right: "",
												top: "",
												bottom: "",
												transition: "",
												transform: "",
											});
										}),
										h
									);
								})
									? n.apply(i, o)
									: n) || (t.exports = r);
				},
				1794: (t, i, e) => {
					var n, o;
					!((r) => {
						(n = [e(7158), e(6131), e(9047), e(652)]),
							(o = ((t, i, e, n) =>
								((t, i, e, n, o) => {
									var r = t.console,
										s = t.jQuery,
										a = () => {},
										h = 0,
										u = {};
									function l(t, i) {
										var e = n.getQueryElement(t);
										if (e) {
											(this.element = e),
												s && (this.$element = s(this.element)),
												(this.options = n.extend(
													{},
													this.constructor.defaults,
												)),
												this.option(i);
											var o = ++h;
											(this.element.outlayerGUID = o),
												(u[o] = this),
												this._create(),
												this._getOption("initLayout") && this.layout();
										} else
											r?.error(
												"Bad element for " +
													this.constructor.namespace +
													": " +
													(e || t),
											);
									}
									(l.namespace = "outlayer"),
										(l.Item = o),
										(l.defaults = {
											containerStyle: { position: "relative" },
											initLayout: !0,
											originLeft: !0,
											originTop: !0,
											resize: !0,
											resizeContainer: !0,
											transitionDuration: "0.4s",
											hiddenStyle: { opacity: 0, transform: "scale(0.001)" },
											visibleStyle: { opacity: 1, transform: "scale(1)" },
										});
									var c = l.prototype;
									function d(t) {
										function i() {
											t.apply(this, arguments);
										}
										return (
											(i.prototype = Object.create(t.prototype)),
											(i.prototype.constructor = i),
											i
										);
									}
									n.extend(c, i.prototype),
										(c.option = function (t) {
											n.extend(this.options, t);
										}),
										(c._getOption = function (t) {
											var i = this.constructor.compatOptions[t];
											return i && void 0 !== this.options[i]
												? this.options[i]
												: this.options[t];
										}),
										(l.compatOptions = {
											initLayout: "isInitLayout",
											horizontal: "isHorizontal",
											layoutInstant: "isLayoutInstant",
											originLeft: "isOriginLeft",
											originTop: "isOriginTop",
											resize: "isResizeBound",
											resizeContainer: "isResizingContainer",
										}),
										(c._create = function () {
											this.reloadItems(),
												(this.stamps = []),
												this.stamp(this.options.stamp),
												n.extend(
													this.element.style,
													this.options.containerStyle,
												),
												this._getOption("resize") && this.bindResize();
										}),
										(c.reloadItems = function () {
											this.items = this._itemize(this.element.children);
										}),
										(c._itemize = function (t) {
											for (
												var i = this._filterFindItemElements(t),
													e = this.constructor.Item,
													n = [],
													o = 0;
												o < i.length;
												o++
											) {
												var r = new e(i[o], this);
												n.push(r);
											}
											return n;
										}),
										(c._filterFindItemElements = function (t) {
											return n.filterFindElements(t, this.options.itemSelector);
										}),
										(c.getItemElements = function () {
											return this.items.map((t) => t.element);
										}),
										(c.layout = function () {
											this._resetLayout(), this._manageStamps();
											var t = this._getOption("layoutInstant"),
												i = void 0 !== t ? t : !this._isLayoutInited;
											this.layoutItems(this.items, i),
												(this._isLayoutInited = !0);
										}),
										(c._init = c.layout),
										(c._resetLayout = function () {
											this.getSize();
										}),
										(c.getSize = function () {
											this.size = e(this.element);
										}),
										(c._getMeasurement = function (t, i) {
											var n,
												o = this.options[t];
											o
												? ("string" === typeof o
														? (n = this.element.querySelector(o))
														: o instanceof HTMLElement && (n = o),
													(this[t] = n ? e(n)[i] : o))
												: (this[t] = 0);
										}),
										(c.layoutItems = function (t, i) {
											(t = this._getItemsForLayout(t)),
												this._layoutItems(t, i),
												this._postLayout();
										}),
										(c._getItemsForLayout = (t) =>
											t.filter((t) => !t.isIgnored)),
										(c._layoutItems = function (t, i) {
											if ((this._emitCompleteOnItems("layout", t), t?.length)) {
												var e = [];
												t.forEach(function (t) {
													var n = this._getItemLayoutPosition(t);
													(n.item = t),
														(n.isInstant = i || t.isLayoutInstant),
														e.push(n);
												}, this),
													this._processLayoutQueue(e);
											}
										}),
										(c._getItemLayoutPosition = () => ({ x: 0, y: 0 })),
										(c._processLayoutQueue = function (t) {
											this.updateStagger(),
												t.forEach(function (t, i) {
													this._positionItem(t.item, t.x, t.y, t.isInstant, i);
												}, this);
										}),
										(c.updateStagger = function () {
											var t = this.options.stagger;
											if (null != t) return (this.stagger = p(t)), this.stagger;
											this.stagger = 0;
										}),
										(c._positionItem = function (t, i, e, n, o) {
											n
												? t.goTo(i, e)
												: (t.stagger(o * this.stagger), t.moveTo(i, e));
										}),
										(c._postLayout = function () {
											this.resizeContainer();
										}),
										(c.resizeContainer = function () {
											if (this._getOption("resizeContainer")) {
												var t = this._getContainerSize();
												t &&
													(this._setContainerMeasure(t.width, !0),
													this._setContainerMeasure(t.height, !1));
											}
										}),
										(c._getContainerSize = a),
										(c._setContainerMeasure = function (t, i) {
											if (void 0 !== t) {
												var e = this.size;
												e.isBorderBox &&
													(t += i
														? e.paddingLeft +
															e.paddingRight +
															e.borderLeftWidth +
															e.borderRightWidth
														: e.paddingBottom +
															e.paddingTop +
															e.borderTopWidth +
															e.borderBottomWidth),
													(t = Math.max(t, 0)),
													(this.element.style[i ? "width" : "height"] =
														`${t}px`);
											}
										}),
										(c._emitCompleteOnItems = function (t, i) {
											var e = this;
											function n() {
												e.dispatchEvent(`${t}Complete`, null, [i]);
											}
											var o = i.length;
											if (i && o) {
												var r = 0;
												i.forEach((i) => {
													i.once(t, s);
												});
											} else n();
											function _s() {
												++r === o && n();
											}
										}),
										(c.dispatchEvent = function (t, i, e) {
											var n = i ? [i].concat(e) : e;
											if ((this.emitEvent(t, n), s))
												if (
													((this.$element = this.$element || s(this.element)),
													i)
												) {
													var o = s.Event(i);
													(o.type = t), this.$element.trigger(o, e);
												} else this.$element.trigger(t, e);
										}),
										(c.ignore = function (t) {
											var i = this.getItem(t);
											i && (i.isIgnored = !0);
										}),
										(c.unignore = function (t) {
											var i = this.getItem(t);
											i && delete i.isIgnored;
										}),
										(c.stamp = function (t) {
											(t = this._find(t)) &&
												((this.stamps = this.stamps.concat(t)),
												t.forEach(this.ignore, this));
										}),
										(c.unstamp = function (t) {
											(t = this._find(t)) &&
												t.forEach(function (t) {
													n.removeFrom(this.stamps, t), this.unignore(t);
												}, this);
										}),
										(c._find = function (t) {
											if (t)
												return (
													"string" === typeof t &&
														(t = this.element.querySelectorAll(t)),
													(t = n.makeArray(t))
												);
										}),
										(c._manageStamps = function () {
											this.stamps?.length &&
												(this._getBoundingRect(),
												this.stamps.forEach(this._manageStamp, this));
										}),
										(c._getBoundingRect = function () {
											var t = this.element.getBoundingClientRect(),
												i = this.size;
											this._boundingRect = {
												left: t.left + i.paddingLeft + i.borderLeftWidth,
												top: t.top + i.paddingTop + i.borderTopWidth,
												right: t.right - (i.paddingRight + i.borderRightWidth),
												bottom:
													t.bottom - (i.paddingBottom + i.borderBottomWidth),
											};
										}),
										(c._manageStamp = a),
										(c._getElementOffset = function (t) {
											var i = t.getBoundingClientRect(),
												n = this._boundingRect,
												o = e(t);
											return {
												left: i.left - n.left - o.marginLeft,
												top: i.top - n.top - o.marginTop,
												right: n.right - i.right - o.marginRight,
												bottom: n.bottom - i.bottom - o.marginBottom,
											};
										}),
										(c.handleEvent = n.handleEvent),
										(c.bindResize = function () {
											t.addEventListener("resize", this),
												(this.isResizeBound = !0);
										}),
										(c.unbindResize = function () {
											t.removeEventListener("resize", this),
												(this.isResizeBound = !1);
										}),
										(c.onresize = function () {
											this.resize();
										}),
										n.debounceMethod(l, "onresize", 100),
										(c.resize = function () {
											this.isResizeBound &&
												this.needsResizeLayout() &&
												this.layout();
										}),
										(c.needsResizeLayout = function () {
											var t = e(this.element);
											return (
												this.size && t && t.innerWidth !== this.size.innerWidth
											);
										}),
										(c.addItems = function (t) {
											var i = this._itemize(t);
											return i.length && (this.items = this.items.concat(i)), i;
										}),
										(c.appended = function (t) {
											var i = this.addItems(t);
											i.length && (this.layoutItems(i, !0), this.reveal(i));
										}),
										(c.prepended = function (t) {
											var i = this._itemize(t);
											if (i.length) {
												var e = this.items.slice(0);
												(this.items = i.concat(e)),
													this._resetLayout(),
													this._manageStamps(),
													this.layoutItems(i, !0),
													this.reveal(i),
													this.layoutItems(e);
											}
										}),
										(c.reveal = function (t) {
											if ((this._emitCompleteOnItems("reveal", t), t?.length)) {
												var i = this.updateStagger();
												t.forEach((t, e) => {
													t.stagger(e * i), t.reveal();
												});
											}
										}),
										(c.hide = function (t) {
											if ((this._emitCompleteOnItems("hide", t), t?.length)) {
												var i = this.updateStagger();
												t.forEach((t, e) => {
													t.stagger(e * i), t.hide();
												});
											}
										}),
										(c.revealItemElements = function (t) {
											var i = this.getItems(t);
											this.reveal(i);
										}),
										(c.hideItemElements = function (t) {
											var i = this.getItems(t);
											this.hide(i);
										}),
										(c.getItem = function (t) {
											for (var i = 0; i < this.items.length; i++) {
												var e = this.items[i];
												if (e.element === t) return e;
											}
										}),
										(c.getItems = function (t) {
											t = n.makeArray(t);
											var i = [];
											return (
												t.forEach(function (t) {
													var e = this.getItem(t);
													e && i.push(e);
												}, this),
												i
											);
										}),
										(c.remove = function (t) {
											var i = this.getItems(t);
											this._emitCompleteOnItems("remove", i),
												i?.length &&
													i.forEach(function (t) {
														t.remove(), n.removeFrom(this.items, t);
													}, this);
										}),
										(c.destroy = function () {
											var t = this.element.style;
											(t.height = ""),
												(t.position = ""),
												(t.width = ""),
												this.items.forEach((t) => {
													t.destroy();
												}),
												this.unbindResize();
											var i = this.element.outlayerGUID;
											delete u[i],
												delete this.element.outlayerGUID,
												s?.removeData(this.element, this.constructor.namespace);
										}),
										(l.data = (t) => {
											var i = (t = n.getQueryElement(t)) && t.outlayerGUID;
											return i && u[i];
										}),
										(l.create = (t, i) => {
											var e = d(l);
											return (
												(e.defaults = n.extend({}, l.defaults)),
												n.extend(e.defaults, i),
												(e.compatOptions = n.extend({}, l.compatOptions)),
												(e.namespace = t),
												(e.data = l.data),
												(e.Item = d(o)),
												n.htmlInit(e, t),
												s?.bridget?.(t, e),
												e
											);
										});
									var f = { ms: 1, s: 1e3 };
									function p(t) {
										if ("number" === typeof t) return t;
										var i = t.match(/(^\d*\.?\d*)(\w*)/),
											e = i?.[1],
											n = i?.[2];
										return e.length ? (e = parseFloat(e)) * (f[n] || 1) : 0;
									}
									return (l.Item = o), l;
								})(r, t, i, e, n)).apply(i, n)),
							void 0 === o || (t.exports = o);
					})(window);
				},
			},
			i = {};
		function e(n) {
			var o = i[n];
			if (void 0 !== o) return o.exports;
			var r = (i[n] = { exports: {} });
			return t[n].call(r.exports, r, r.exports, e), r.exports;
		}
		(e.n = (t) => {
			var i = t?.__esModule ? () => t.default : () => t;
			return e.d(i, { a: i }), i;
		}),
			(e.d = (t, i) => {
				for (var n in i)
					e.o(i, n) &&
						!e.o(t, n) &&
						Object.defineProperty(t, n, { enumerable: !0, get: i[n] });
			}),
			(e.o = (t, i) => Object.hasOwn(t, i)),
			(e.r = (t) => {
				"undefined" !== typeof Symbol &&
					Symbol.toStringTag &&
					Object.defineProperty(t, Symbol.toStringTag, { value: "Module" }),
					Object.defineProperty(t, "__esModule", { value: !0 });
			});
		var n = {};
		return (
			(() => {
				e.r(n),
					e.d(n, {
						Masonry: () => i.a,
					});
				var t = e(8751),
					i = e.n(t);
				try {
					window.Masonry = i();
				} catch (_t) {}
			})(),
			n
		);
	})(),
);
