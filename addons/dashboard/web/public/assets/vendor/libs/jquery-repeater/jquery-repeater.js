/**
 * @namespace: addons/dashboard/web/public/assets/vendor/libs/jquery-repeater/jquery-repeater.js
 * @type: Module
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.10.0-beta
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
				9526: () => {
					!((t) => {
						var e = (t) => t,
							n = (e) => t.isArray(e),
							r = (t) => !n(t) && t instanceof Object,
							i = (e, n) => t.inArray(n, e),
							u = (t, e) => {
								for (var n in t) Object.hasOwn(t, n) && e(t[n], n, t);
							},
							a = (t) => t[t.length - 1],
							c = function () {
								var t,
									e = {};
								return (
									u(((t = arguments), Array.prototype.slice.call(t)), (t) => {
										u(t, (t, n) => {
											e[n] = t;
										});
									}),
									e
								);
							},
							o = (t, e, r) =>
								n(t)
									? ((t, e) => {
											var n = [];
											return (
												u(t, (t, r, i) => {
													n.push(e(t, r, i));
												}),
												n
											);
										})(t, e)
									: ((t, e, n) => {
											var r = {};
											return (
												u(t, (t, i, u) => {
													(i = n ? n(i, t) : i), (r[i] = e(t, i, u));
												}),
												r
											);
										})(t, e, r),
							f = (t, e, n) => o(t, (t, _r) => t[e].apply(t, n || []));
						!((t) => {
							var e = (t, e) => {
									var n,
										r,
										a,
										c =
											((r = {}),
											((n = n || {}).publish = (t, e) => {
												u(r[t], (t) => {
													t(e);
												});
											}),
											(n.subscribe = (t, e) => {
												(r[t] = r[t] || []), r[t].push(e);
											}),
											(n.unsubscribe = (t) => {
												u(r, (e) => {
													var n = i(e, t);
													-1 !== n && e.splice(n, 1);
												});
											}),
											n),
										o = t.$;
									return (
										(c.getType = () => {
											throw 'implement me (return type. "text", "radio", etc.)';
										}),
										(c.$ = (t) => (t ? o.find(t) : o)),
										(c.disable = () => {
											c.$().prop("disabled", !0), c.publish("isEnabled", !1);
										}),
										(c.enable = () => {
											c.$().prop("disabled", !1), c.publish("isEnabled", !0);
										}),
										(e.equalTo = (t, e) => t === e),
										(e.publishChange = (t, n) => {
											var r = c.get();
											e.equalTo(r, a) ||
												c.publish("change", { e: t, domElement: n }),
												(a = r);
										}),
										c
									);
								},
								c = (t, n) => {
									var r = e(t, n);
									return (
										(r.get = () => r.$().val()),
										(r.set = (t) => {
											r.$().val(t);
										}),
										(r.clear = () => {
											r.set("");
										}),
										(n.buildSetter = (t) => (e) => {
											t.call(r, e);
										}),
										r
									);
								},
								o = (t, e) => {
									(t = n(t) ? t : [t]), (e = n(e) ? e : [e]);
									var r = !0;
									return (
										t.length !== e.length
											? (r = !1)
											: u(t, (t) => {
													((t, e) => -1 !== i(t, e))(e, t) || (r = !1);
												}),
										r
									);
								},
								s = (t) => {
									var e = {},
										n = c(t, e);
									return (
										(n.getType = () => "button"),
										n.$().on("change", function (t) {
											e.publishChange(t, this);
										}),
										n
									);
								},
								p = (e) => {
									var r = {},
										i = c(e, r);
									return (
										(i.getType = () => "checkbox"),
										(i.get = () => {
											var e = [];
											return (
												i
													.$()
													.filter(":checked")
													.each(function () {
														e.push(t(this).val());
													}),
												e
											);
										}),
										(i.set = (e) => {
											(e = n(e) ? e : [e]),
												i.$().each(function () {
													t(this).prop("checked", !1);
												}),
												u(e, (t) => {
													i.$().filter(`[value="${t}"]`).prop("checked", !0);
												});
										}),
										(r.equalTo = o),
										i.$().change(function (t) {
											r.publishChange(t, this);
										}),
										i
									);
								},
								l = (t) => {
									var e = x(t, {});
									return (e.getType = () => "email"), e;
								},
								h = (n) => {
									var r = {},
										i = e(n, r);
									return (
										(i.getType = () => "file"),
										(i.get = () => a(i.$().val().split("\\"))),
										(i.clear = function () {
											this.$().each(function () {
												t(this).wrap("<form>").closest("form").get(0).reset(),
													t(this).unwrap();
											});
										}),
										i.$().change(function (t) {
											r.publishChange(t, this);
										}),
										i
									);
								},
								d = (t) => {
									var e = {},
										n = c(t, e);
									return (
										(n.getType = () => "hidden"),
										n.$().change(function (t) {
											e.publishChange(t, this);
										}),
										n
									);
								},
								v = (n) => {
									var r = {},
										i = e(n, r);
									return (
										(i.getType = () => "file[multiple]"),
										(i.get = () => {
											var t,
												e = i.$().get(0).files || [],
												n = [];
											for (t = 0; t < (e.length || 0); t += 1)
												n.push(e[t].name);
											return n;
										}),
										(i.clear = function () {
											this.$().each(function () {
												t(this).wrap("<form>").closest("form").get(0).reset(),
													t(this).unwrap();
											});
										}),
										i.$().change(function (t) {
											r.publishChange(t, this);
										}),
										i
									);
								},
								m = (t) => {
									var e = {},
										r = c(t, e);
									return (
										(r.getType = () => "select[multiple]"),
										(r.get = () => r.$().val() || []),
										(r.set = (t) => {
											r.$().val("" === t ? [] : n(t) ? t : [t]);
										}),
										(e.equalTo = o),
										r.$().change(function (t) {
											e.publishChange(t, this);
										}),
										r
									);
								},
								g = (t) => {
									var e = x(t, {});
									return (e.getType = () => "password"), e;
								},
								y = (e) => {
									var n = {},
										r = c(e, n);
									return (
										(r.getType = () => "radio"),
										(r.get = () => r.$().filter(":checked").val() || null),
										(r.set = (e) => {
											e
												? r.$().filter(`[value="${e}"]`).prop("checked", !0)
												: r.$().each(function () {
														t(this).prop("checked", !1);
													});
										}),
										r.$().change(function (t) {
											n.publishChange(t, this);
										}),
										r
									);
								},
								b = (t) => {
									var e = {},
										n = c(t, e);
									return (
										(n.getType = () => "range"),
										n.$().change(function (t) {
											e.publishChange(t, this);
										}),
										n
									);
								},
								$ = (t) => {
									var e = {},
										n = c(t, e);
									return (
										(n.getType = () => "select"),
										n.$().change(function (t) {
											e.publishChange(t, this);
										}),
										n
									);
								},
								x = (t) => {
									var e = {},
										n = c(t, e);
									return (
										(n.getType = () => "text"),
										n.$().on("change keyup keydown", function (t) {
											e.publishChange(t, this);
										}),
										n
									);
								},
								k = (t) => {
									var e = {},
										n = c(t, e);
									return (
										(n.getType = () => "textarea"),
										n.$().on("change keyup keydown", function (t) {
											e.publishChange(t, this);
										}),
										n
									);
								},
								T = (t) => {
									var e = x(t, {});
									return (e.getType = () => "url"), e;
								},
								w = (e) => {
									var n = {},
										a = e.$,
										c = e.constructorOverride || {
											button: s,
											text: x,
											url: T,
											email: l,
											password: g,
											range: b,
											textarea: k,
											select: $,
											"select[multiple]": m,
											radio: y,
											checkbox: p,
											file: h,
											"file[multiple]": v,
											hidden: d,
										},
										o = (e, i) => {
											(r(i) ? i : a.find(i)).each(function () {
												var r = t(this).attr("name");
												n[r] = c[e]({ $: t(this) });
											});
										},
										f = (e, o) => {
											var f = [],
												s = r(o) ? o : a.find(o);
											r(o)
												? (n[s.attr("name")] = c[e]({ $: s }))
												: (s.each(function () {
														-1 === i(f, t(this).attr("name")) &&
															f.push(t(this).attr("name"));
													}),
													u(f, (t) => {
														n[t] = c[e]({
															$: a.find(`input[name="${t}"]`),
														});
													}));
										};
									return (
										a.is("input, select, textarea")
											? a.is(
													'input[type="button"], button, input[type="submit"]',
												)
												? o("button", a)
												: a.is("textarea")
													? o("textarea", a)
													: a.is('input[type="text"]') ||
															(a.is("input") && !a.attr("type"))
														? o("text", a)
														: a.is('input[type="password"]')
															? o("password", a)
															: a.is('input[type="email"]')
																? o("email", a)
																: a.is('input[type="url"]')
																	? o("url", a)
																	: a.is('input[type="range"]')
																		? o("range", a)
																		: a.is("select")
																			? a.is("[multiple]")
																				? o("select[multiple]", a)
																				: o("select", a)
																			: a.is('input[type="file"]')
																				? a.is("[multiple]")
																					? o("file[multiple]", a)
																					: o("file", a)
																				: a.is('input[type="hidden"]')
																					? o("hidden", a)
																					: a.is('input[type="radio"]')
																						? f("radio", a)
																						: a.is('input[type="checkbox"]')
																							? f("checkbox", a)
																							: o("text", a)
											: (o(
													"button",
													'input[type="button"], button, input[type="submit"]',
												),
												o("text", 'input[type="text"]'),
												o("password", 'input[type="password"]'),
												o("email", 'input[type="email"]'),
												o("url", 'input[type="url"]'),
												o("range", 'input[type="range"]'),
												o("textarea", "textarea"),
												o("select", "select:not([multiple])"),
												o("select[multiple]", "select[multiple]"),
												o("file", 'input[type="file"]:not([multiple])'),
												o("file[multiple]", 'input[type="file"][multiple]'),
												o("hidden", 'input[type="hidden"]'),
												f("radio", 'input[type="radio"]'),
												f("checkbox", 'input[type="checkbox"]')),
										n
									);
								};
							(t.fn.inputVal = function (e) {
								var n = t(this),
									r = w({ $: n });
								return n.is("input, textarea, select")
									? void 0 === e
										? r[n.attr("name")].get()
										: (r[n.attr("name")].set(e), n)
									: void 0 === e
										? f(r, "get")
										: (u(e, (t, e) => {
												r[e].set(t);
											}),
											n);
							}),
								(t.fn.inputOnChange = function (e) {
									var n = t(this),
										r = w({ $: n });
									return (
										u(r, (t) => {
											t.subscribe("change", (t) => {
												e.call(t.domElement, t.e);
											});
										}),
										n
									);
								}),
								(t.fn.inputDisable = function () {
									var e = t(this);
									return f(w({ $: e }), "disable"), e;
								}),
								(t.fn.inputEnable = function () {
									var e = t(this);
									return f(w({ $: e }), "enable"), e;
								}),
								(t.fn.inputClear = function () {
									var e = t(this);
									return f(w({ $: e }), "clear"), e;
								});
						})(jQuery),
							(t.fn.repeaterVal = function () {
								var e,
									n,
									r = (t) => {
										if (
											1 === t.length &&
											(0 === t[0].key.length ||
												(1 === t[0].key.length && !t[0].key[0]))
										)
											return t[0].val;
										u(t, (t) => {
											t.head = t.key.shift();
										});
										var e,
											n = (() => {
												var e = {};
												return (
													u(t, (t) => {
														e[t.head] || (e[t.head] = []), e[t.head].push(t);
													}),
													e
												);
											})();
										return (
											/^[0-9]+$/.test(t[0].head)
												? ((e = []),
													u(n, (t) => {
														e.push(r(t));
													}))
												: ((e = {}),
													u(n, (t, n) => {
														e[n] = r(t);
													})),
											e
										);
									};
								return r(
									((e = t(this).inputVal()),
									(n = []),
									u(e, (t, e) => {
										var r = [];
										"undefined" !== e &&
											(r.push(e.match(/^[^[]*/)[0]),
											(r = r.concat(
												o(e.match(/\[[^\]]*\]/g), (t) =>
													t.replace(/[[\]]/g, ""),
												),
											)),
											n.push({ val: t, key: r }));
									}),
									n),
								);
							}),
							(t.fn.repeater = function (r) {
								var i;
								return (
									(r = r || {}),
									t(this).each(function () {
										var f = t(this),
											s =
												r.show ||
												function () {
													t(this).show();
												},
											p =
												r.hide ||
												((t) => {
													t();
												}),
											l = f.find("[data-repeater-list]").first(),
											h = (e, n) =>
												e.filter(function () {
													return (
														!n ||
														0 ===
															t(this).closest(
																((e = n),
																(_r = "selector"),
																o(e, (t) => t[r])).join(","),
															).length
													);
													var e, _r;
												}),
											d = () => h(l.find("[data-repeater-item]"), r.repeaters),
											v = l.find("[data-repeater-item]").first().clone().hide(),
											m = h(
												h(t(this).find("[data-repeater-item]"), r.repeaters)
													.first()
													.find("[data-repeater-delete]"),
												r.repeaters,
											);
										r.isFirstItemUndeletable && m && m.remove();
										var g = () => {
												var t = l.data("repeater-list");
												return r.$parent
													? `${r.$parent.data("item-name")}[${t}]`
													: t;
											},
											y = (e) => {
												r.repeaters &&
													e.each(function () {
														var e = t(this);
														u(r.repeaters, (t) => {
															e.find(t.selector).repeater(c(t, { $parent: e }));
														});
													});
											},
											b = (t, e, n) => {
												t &&
													u(t, (t) => {
														n.call(e.find(t.selector)[0], t);
													});
											},
											$ = (e, n, r) => {
												e.each(function (e) {
													var i = t(this);
													i.data("item-name", `${n}[${e}]`),
														h(i.find("[name]"), r).each(function () {
															var u = t(this),
																c = u.attr("name").match(/\[[^\]]+\]/g),
																o = c
																	? a(c).replace(/\[|\]/g, "")
																	: u.attr("name"),
																f =
																	n +
																	"[" +
																	e +
																	"][" +
																	o +
																	"]" +
																	(u.is(":checkbox") || u.attr("multiple")
																		? "[]"
																		: "");
															u.attr("name", f),
																b(r, i, function (r) {
																	var i = t(this);
																	$(
																		h(
																			i.find("[data-repeater-item]"),
																			r.repeaters || [],
																		),
																		n +
																			"[" +
																			e +
																			"][" +
																			i
																				.find("[data-repeater-list]")
																				.first()
																				.data("repeater-list") +
																			"]",
																		r.repeaters,
																	);
																});
														});
												}),
													l
														.find("input[name][checked]")
														.removeAttr("checked")
														.prop("checked", !0);
											};
										$(d(), g(), r.repeaters),
											y(d()),
											r.initEmpty && d().remove(),
											r.ready?.(() => {
												$(d(), g(), r.repeaters);
											});
										var x,
											k =
												((x = (i, a, c) => {
													if (a || r.defaultValues) {
														var f = {};
														h(i.find("[name]"), c).each(function () {
															var e = t(this)
																.attr("name")
																.match(/\[([^\]]*)(\]|\]\[\])$/)[1];
															f[e] = t(this).attr("name");
														}),
															i.inputVal(
																o(
																	((s = a || r.defaultValues),
																	(p = (_t, e) => f[e]),
																	n(s)
																		? ((l = []),
																			u(s, (t, e, n) => {
																				p(t, e, n) && l.push(t);
																			}))
																		: ((l = {}),
																			u(s, (t, e, n) => {
																				p(t, e, n) && (l[e] = t);
																			})),
																	l),
																	e,
																	(t) => f[t],
																),
															);
													}
													var _s, _p, _l;
													b(c, i, function (e) {
														var n = t(this);
														h(n.find("[data-repeater-item]"), e.repeaters).each(
															function () {
																var r = n
																	.find("[data-repeater-list]")
																	.data("repeater-list");
																if (a?.[r]) {
																	var i = t(this).clone();
																	n.find("[data-repeater-item]").remove(),
																		u(a[r], (t) => {
																			var r = i.clone();
																			x(r, t, e.repeaters || []),
																				n
																					.find("[data-repeater-list]")
																					.append(r);
																		});
																} else
																	x(
																		t(this),
																		e.defaultValues,
																		e.repeaters || [],
																	);
															},
														);
													});
												}),
												(e, n) => {
													l.append(e),
														$(d(), g(), r.repeaters),
														e.find("[name]").each(function () {
															t(this).inputClear();
														}),
														x(e, n || r.defaultValues, r.repeaters);
												}),
											T = (t) => {
												var e = v.clone();
												k(e, t), r.repeaters && y(e), s.call(e.get(0));
											};
										(i = (t) => {
											d().remove(), u(t, T);
										}),
											h(f.find("[data-repeater-create]"), r.repeaters).click(
												() => {
													T();
												},
											),
											l.on("click", "[data-repeater-delete]", function () {
												var e = t(this).closest("[data-repeater-item]").get(0);
												p.call(e, () => {
													t(e).remove(), $(d(), g(), r.repeaters);
												});
											});
									}),
									(this.setList = i),
									this
								);
							});
					})(jQuery);
				},
			},
			e = {};
		function n(r) {
			var i = e[r];
			if (void 0 !== i) return i.exports;
			var u = (e[r] = { exports: {} });
			return t[r](u, u.exports, n), u.exports;
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
				n.r(r);
				n(9526);
			})(),
			r
		);
	})(),
);
