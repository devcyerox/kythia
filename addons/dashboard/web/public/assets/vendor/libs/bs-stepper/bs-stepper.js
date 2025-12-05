/**
 * @namespace: addons/dashboard/web/public/assets/vendor/libs/bs-stepper/bs-stepper.js
 * @type: Module
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.10.1-beta
 */

!((e, t) => {
	if ("object" === typeof exports && "object" === typeof module)
		module.exports = t();
	else if ("function" === typeof define && define.amd) define([], t);
	else {
		var n = t();
		for (var s in n) ("object" === typeof exports ? exports : e)[s] = n[s];
	}
})(self, () =>
	(() => {
		var e = {
				7082: (e) => {
					e.exports = (() => {
						function e() {
							return (
								(e =
									Object.assign ||
									function (e) {
										for (var t = 1; t < arguments.length; t++) {
											var n = arguments[t];
											for (var s in n) Object.hasOwn(n, s) && (e[s] = n[s]);
										}
										return e;
									}),
								e.apply(this, arguments)
							);
						}
						var t = window.Element.prototype.matches,
							n = (e, t) => e.closest(t),
							s = (e, t) => new window.Event(e, t),
							i = (e, t) => new window.CustomEvent(e, t);
						function r() {
							if (
								(window.Element.prototype.matches ||
									(t =
										window.Element.prototype.msMatchesSelector ||
										window.Element.prototype.webkitMatchesSelector),
								window.Element.prototype.closest ||
									(n = (e, n) => {
										if (!document.documentElement.contains(e)) return null;
										do {
											if (t.call(e, n)) return e;
											e = e.parentElement || e.parentNode;
										} while (null !== e && 1 === e.nodeType);
										return null;
									}),
								(window.Event && "function" === typeof window.Event) ||
									(s = (e, t) => {
										t = t || {};
										var n = document.createEvent("Event");
										return (
											n.initEvent(e, Boolean(t.bubbles), Boolean(t.cancelable)),
											n
										);
									}),
								"function" !== typeof window.CustomEvent)
							) {
								var e = window.Event.prototype.preventDefault;
								i = (t, n) => {
									var s = document.createEvent("CustomEvent");
									return (
										(n = n || { bubbles: !1, cancelable: !1, detail: null }),
										s.initCustomEvent(t, n.bubbles, n.cancelable, n.detail),
										(s.preventDefault = function () {
											this.cancelable &&
												(e.call(this),
												Object.defineProperty(this, "defaultPrevented", {
													get: () => !0,
												}));
										}),
										s
									);
								};
							}
						}
						r();
						var o = 1e3,
							c = {
								ACTIVE: "active",
								LINEAR: "linear",
								BLOCK: "dstepper-block",
								NONE: "dstepper-none",
								FADE: "fade",
								VERTICAL: "vertical",
							},
							a = "transitionend",
							l = "bsStepper",
							u = (e, t, n, s) => {
								var r = e[l];
								if (
									!r._steps[t].classList.contains(c.ACTIVE) &&
									!r._stepsContents[t].classList.contains(c.ACTIVE)
								) {
									var o = i("show.bs-stepper", {
										cancelable: !0,
										detail: { from: r._currentIndex, to: t, indexStep: t },
									});
									e.dispatchEvent(o);
									var a = r._steps.filter((e) =>
											e.classList.contains(c.ACTIVE),
										),
										u = r._stepsContents.filter((e) =>
											e.classList.contains(c.ACTIVE),
										);
									o.defaultPrevented ||
										(a.length && a[0].classList.remove(c.ACTIVE),
										u.length &&
											(u[0].classList.remove(c.ACTIVE),
											e.classList.contains(c.VERTICAL) ||
												r.options.animation ||
												u[0].classList.remove(c.BLOCK)),
										p(e, r._steps[t], r._steps, n),
										d(e, r._stepsContents[t], r._stepsContents, u, s));
								}
							},
							p = (e, t, n, s) => {
								n.forEach((t) => {
									var n = t.querySelector(s.selectors.trigger);
									n.setAttribute("aria-selected", "false"),
										e.classList.contains(c.LINEAR) &&
											n.setAttribute("disabled", "disabled");
								}),
									t.classList.add(c.ACTIVE);
								var i = t.querySelector(s.selectors.trigger);
								i.setAttribute("aria-selected", "true"),
									e.classList.contains(c.LINEAR) &&
										i.removeAttribute("disabled");
							},
							d = (e, t, n, s, r) => {
								var o = e[l],
									u = n.indexOf(t),
									p = i("shown.bs-stepper", {
										cancelable: !0,
										detail: { from: o._currentIndex, to: u, indexStep: u },
									});
								function d() {
									t.classList.add(c.BLOCK),
										t.removeEventListener(a, d),
										e.dispatchEvent(p),
										r();
								}
								if (t.classList.contains(c.FADE)) {
									t.classList.remove(c.NONE);
									var h = f(t);
									t.addEventListener(a, d),
										s.length && s[0].classList.add(c.NONE),
										t.classList.add(c.ACTIVE),
										v(t, h);
								} else
									t.classList.add(c.ACTIVE),
										t.classList.add(c.BLOCK),
										e.dispatchEvent(p),
										r();
							},
							f = (e) => {
								if (!e) return 0;
								var t = window.getComputedStyle(e).transitionDuration;
								return parseFloat(t)
									? ((t = t.split(",")[0]), parseFloat(t) * o)
									: 0;
							},
							v = (e, t) => {
								var n = !1,
									i = t + 5;
								function r() {
									(n = !0), e.removeEventListener(a, r);
								}
								e.addEventListener(a, r),
									window.setTimeout(() => {
										n || e.dispatchEvent(s(a)), e.removeEventListener(a, r);
									}, i);
							},
							h = (e, t) => {
								t.animation &&
									e.forEach((e) => {
										e.classList.add(c.FADE), e.classList.add(c.NONE);
									});
							},
							L = () => (e) => {
								e.preventDefault();
							},
							E = (e) => (t) => {
								t.preventDefault();
								var s = n(t.target, e.selectors.steps),
									i = n(s, e.selectors.stepper),
									r = i[l],
									o = r._steps.indexOf(s);
								u(i, o, e, () => {
									r._currentIndex = o;
								});
							},
							_ = {
								linear: !0,
								animation: !1,
								selectors: {
									steps: ".step",
									trigger: ".step-trigger",
									stepper: ".bs-stepper",
								},
							};
						return (() => {
							function t(t, n) {
								void 0 === n && (n = {}),
									(this._element = t),
									(this._currentIndex = 0),
									(this._stepsContents = []),
									(this.options = e({}, _, {}, n)),
									(this.options.selectors = e(
										{},
										_.selectors,
										{},
										this.options.selectors,
									)),
									this.options.linear && this._element.classList.add(c.LINEAR),
									(this._steps = [].slice.call(
										this._element.querySelectorAll(
											this.options.selectors.steps,
										),
									)),
									this._steps
										.filter((e) => e.hasAttribute("data-target"))
										.forEach((e) => {
											this._stepsContents.push(
												this._element.querySelector(
													e.getAttribute("data-target"),
												),
											);
										}),
									h(this._stepsContents, this.options),
									this._setLinkListeners(),
									Object.defineProperty(this._element, l, {
										value: this,
										writable: !0,
									}),
									this._steps.length &&
										u(
											this._element,
											this._currentIndex,
											this.options,
											() => {},
										);
							}
							var n = t.prototype;
							return (
								(n._setLinkListeners = function () {
									this._steps.forEach((t) => {
										var n = t.querySelector(this.options.selectors.trigger);
										this.options.linear
											? ((this._clickStepLinearListener = L(this.options)),
												n.addEventListener(
													"click",
													this._clickStepLinearListener,
												))
											: ((this._clickStepNonLinearListener = E(this.options)),
												n.addEventListener(
													"click",
													this._clickStepNonLinearListener,
												));
									});
								}),
								(n.next = function () {
									var t =
										this._currentIndex + 1 <= this._steps.length - 1
											? this._currentIndex + 1
											: this._steps.length - 1;
									u(this._element, t, this.options, () => {
										this._currentIndex = t;
									});
								}),
								(n.previous = function () {
									var t =
										this._currentIndex - 1 >= 0 ? this._currentIndex - 1 : 0;
									u(this._element, t, this.options, () => {
										this._currentIndex = t;
									});
								}),
								(n.to = function (e) {
									var n = e - 1,
										s = n >= 0 && n < this._steps.length ? n : 0;
									u(this._element, s, this.options, () => {
										this._currentIndex = s;
									});
								}),
								(n.reset = function () {
									u(this._element, 0, this.options, () => {
										this._currentIndex = 0;
									});
								}),
								(n.destroy = function () {
									this._steps.forEach((t) => {
										var n = t.querySelector(this.options.selectors.trigger);
										this.options.linear
											? n.removeEventListener(
													"click",
													this._clickStepLinearListener,
												)
											: n.removeEventListener(
													"click",
													this._clickStepNonLinearListener,
												);
									}),
										(this._element[l] = void 0),
										(this._element = void 0),
										(this._currentIndex = void 0),
										(this._steps = void 0),
										(this._stepsContents = void 0),
										(this._clickStepLinearListener = void 0),
										(this._clickStepNonLinearListener = void 0);
								}),
								t
							);
						})();
					})();
				},
			},
			t = {};
		function n(s) {
			var i = t[s];
			if (void 0 !== i) return i.exports;
			var r = (t[s] = { exports: {} });
			return e[s].call(r.exports, r, r.exports, n), r.exports;
		}
		(n.n = (e) => {
			var t = e?.__esModule ? () => e.default : () => e;
			return n.d(t, { a: t }), t;
		}),
			(n.d = (e, t) => {
				for (var s in t)
					n.o(t, s) &&
						!n.o(e, s) &&
						Object.defineProperty(e, s, { enumerable: !0, get: t[s] });
			}),
			(n.o = (e, t) => Object.hasOwn(e, t)),
			(n.r = (e) => {
				"undefined" !== typeof Symbol &&
					Symbol.toStringTag &&
					Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
					Object.defineProperty(e, "__esModule", { value: !0 });
			});
		var s = {};
		return (
			(() => {
				n.r(s),
					n.d(s, {
						Stepper: () => t.a,
					});
				var e = n(7082),
					t = n.n(e);
				document.querySelectorAll(".bs-stepper").forEach((e) => {
					e.addEventListener("show.bs-stepper", (t) => {
						for (
							var n = t.detail.indexStep,
								s = e.querySelectorAll(".line").length,
								i = e.querySelectorAll(".step"),
								r = 0;
							r < n;
							r++
						) {
							i[r].classList.add("crossed");
							for (var o = n; o < s; o++) i[o].classList.remove("crossed");
						}
						if (0 === t.detail.to) {
							for (var c = n; c < s; c++) i[c].classList.remove("crossed");
							i[0].classList.remove("crossed");
						}
					});
				});
				try {
					window.Stepper = t();
				} catch (_e) {}
			})(),
			s
		);
	})(),
);
