/**
 * @namespace: addons/dashboard/web/public/assets/vendor/libs/cleave-zen/cleave-zen.js
 * @type: Module
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.10.0-beta
 */

!((e, r) => {
	if ("object" === typeof exports && "object" === typeof module)
		module.exports = r();
	else if ("function" === typeof define && define.amd) define([], r);
	else {
		var t = r();
		for (var n in t) ("object" === typeof exports ? exports : e)[n] = t[n];
	}
})(self, () =>
	(() => {
		var e = {
				d: (r, t) => {
					for (var n in t)
						e.o(t, n) &&
							!e.o(r, n) &&
							Object.defineProperty(r, n, { enumerable: !0, get: t[n] });
				},
				o: (e, r) => Object.hasOwn(e, r),
				r: (e) => {
					"undefined" !== typeof Symbol &&
						Symbol.toStringTag &&
						Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
						Object.defineProperty(e, "__esModule", { value: !0 });
				},
			},
			r = {};
		e.r(r),
			e.d(r, {
				formatCreditCard: () => g,
				formatDate: () => N,
				formatGeneral: () => d,
				formatNumeral: () => I,
				formatTime: () => P,
				getCreditCardType: () => E,
				registerCursorTracker: () => s,
			});
		var t,
			n,
			i,
			a = (e) => e.replace(/[^\d]/g, ""),
			l = (e) => e.reduce((e, r) => e + r, 0),
			u = (e, r) => e.slice(0, r),
			o = (e) => {
				var r = e.value;
				return (
					e.delimiters.forEach((e) => {
						e.split("").forEach((e) => {
							r = r.replace(
								new RegExp(e.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1"), "g"),
								"",
							);
						});
					}),
					r
				);
			},
			c = (e) => {
				var r = e.blocks,
					t = e.delimiter,
					n = void 0 === t ? "" : t,
					i = e.delimiters,
					a = void 0 === i ? [] : i,
					l = e.delimiterLazyShow,
					u = void 0 !== l && l,
					o = "",
					c = e.value,
					s = "";
				return (
					r.forEach((e, t) => {
						if (c.length > 0) {
							var i,
								l = c.slice(0, e),
								d = c.slice(e);
							(s = a.length > 0 ? (null != (i = a[u ? t - 1 : t]) ? i : s) : n),
								u
									? (t > 0 && (o += s), (o += l))
									: ((o += l), l.length === e && t < r.length - 1 && (o += s)),
								(c = d);
						}
					}),
					o
				);
			},
			s = (e) => {
				var r = e.delimiter,
					t = e.delimiters,
					n = e.prefix,
					i = void 0 === n ? "" : n,
					a = e.input;
				if (void 0 !== a.CLEAVE_ZEN_cursor_tracker)
					return () => {
						a.removeEventListener("input", a.CLEAVE_ZEN_cursor_tracker),
							(a.CLEAVE_ZEN_cursor_tracker = void 0);
					};
				var l = [void 0 === r ? "" : r].concat(void 0 === t ? [] : t);
				return (
					(a.CLEAVE_ZEN_cursor_tracker = (e) => {
						var r,
							t = e.target;
						("deleteContentBackward" === e.inputType ||
							t.value.length !== t.selectionEnd) &&
							((t.CLEAVE_ZEN_cleanCursorIndex = ((e) => {
								for (
									var r = e.value,
										t = e.dirtyCursorIndex,
										n = e.delimiters,
										i = t,
										a = 0;
									a < t;
									a++
								)
									n.includes(r[a]) && i--;
								return i;
							})({
								value: t.value,
								dirtyCursorIndex: null != (r = t.selectionEnd) ? r : 0,
								delimiters: l,
							})),
							setTimeout(() => {
								var e;
								if (o({ value: t.value, delimiters: l }) !== i) {
									var r = ((e) => {
										for (
											var r = e.value,
												t = e.delimiters,
												n = e.cleanCursorIndex,
												i = 0;
											i < r.length && (t.includes(r[i]) && n++, i !== n - 1);
											i++
										);
										return n;
									})({
										value: t.value,
										cleanCursorIndex:
											null != (e = t.CLEAVE_ZEN_cleanCursorIndex) ? e : 0,
										delimiters: l,
									});
									t.setSelectionRange(r, r);
								}
							}, 0));
					}),
					a.addEventListener("input", a.CLEAVE_ZEN_cursor_tracker),
					() => {
						a.removeEventListener("input", a.CLEAVE_ZEN_cursor_tracker),
							(a.CLEAVE_ZEN_cursor_tracker = void 0);
					}
				);
			},
			d = (e, r) => {
				var t = r.blocks,
					n = r.delimiter,
					i = void 0 === n ? "" : n,
					l = r.delimiters,
					u = void 0 === l ? [] : l,
					s = r.delimiterLazyShow,
					d = void 0 !== s && s,
					m = r.prefix,
					v = void 0 === m ? "" : m,
					f = r.numericOnly,
					p = void 0 !== f && f,
					h = r.uppercase,
					g = void 0 !== h && h,
					E = r.lowercase,
					x = void 0 !== E && E;
				return (
					i.length > 0 && u.push(i),
					(e = ((e) => {
						var r = e.value,
							t = e.prefix,
							n = e.tailPrefix,
							i = t.length;
						return 0 === i
							? r
							: r === t && "" !== r
								? ""
								: r.slice(0, i) === t || n
									? r.slice(-i) !== t && n
										? ""
										: n
											? r.slice(0, -i)
											: r.slice(i)
									: "";
					})({
						value: (e = o({ value: e, delimiters: u })),
						prefix: v,
						tailPrefix: !1,
					})),
					(e = p ? a(e) : e),
					(e = g ? e.toUpperCase() : e),
					(e = x ? e.toLowerCase() : e),
					v.length > 0 && (e = v + e),
					c({
						value: e,
						blocks: t,
						delimiter: i,
						delimiters: u,
						delimiterLazyShow: d,
					})
				);
			};
		!((e) => {
			(e.UATP = "uatp"),
				(e.AMEX = "amex"),
				(e.DINERS = "diners"),
				(e.DISCOVER = "discover"),
				(e.MASTERCARD = "mastercard"),
				(e.DANKORT = "dankort"),
				(e.INSTAPAYMENT = "instapayment"),
				(e.JCB15 = "jcb15"),
				(e.JCB = "jcb"),
				(e.MAESTRO = "maestro"),
				(e.VISA = "visa"),
				(e.MIR = "mir"),
				(e.UNIONPAY = "unionpay"),
				(e.GENERAL = "general");
		})(i || (i = {}));
		var m,
			v =
				(((t = {})[i.UATP] = [4, 5, 6]),
				(t[i.AMEX] = [4, 6, 5]),
				(t[i.DINERS] = [4, 6, 4]),
				(t[i.DISCOVER] = [4, 4, 4, 4]),
				(t[i.MASTERCARD] = [4, 4, 4, 4]),
				(t[i.DANKORT] = [4, 4, 4, 4]),
				(t[i.INSTAPAYMENT] = [4, 4, 4, 4]),
				(t[i.JCB15] = [4, 6, 5]),
				(t[i.JCB] = [4, 4, 4, 4]),
				(t[i.MAESTRO] = [4, 4, 4, 4]),
				(t[i.VISA] = [4, 4, 4, 4]),
				(t[i.MIR] = [4, 4, 4, 4]),
				(t[i.UNIONPAY] = [4, 4, 4, 4]),
				(t[i.GENERAL] = [4, 4, 4, 4]),
				t),
			f =
				(((n = {})[i.UATP] = /^(?!1800)1\d{0,14}/),
				(n[i.AMEX] = /^3[47]\d{0,13}/),
				(n[i.DISCOVER] = /^(?:6011|65\d{0,2}|64[4-9]\d?)\d{0,12}/),
				(n[i.DINERS] = /^3(?:0([0-5]|9)|[689]\d?)\d{0,11}/),
				(n[i.MASTERCARD] =
					/^(5[1-5]\d{0,2}|22[2-9]\d{0,1}|2[3-7]\d{0,2})\d{0,12}/),
				(n[i.DANKORT] = /^(5019|4175|4571)\d{0,12}/),
				(n[i.INSTAPAYMENT] = /^63[7-9]\d{0,13}/),
				(n[i.JCB15] = /^(?:2131|1800)\d{0,11}/),
				(n[i.JCB] = /^(?:35\d{0,2})\d{0,12}/),
				(n[i.MAESTRO] = /^(?:5[0678]\d{0,2}|6304|67\d{0,2})\d{0,12}/),
				(n[i.MIR] = /^220[0-4]\d{0,12}/),
				(n[i.VISA] = /^4\d{0,15}/),
				(n[i.UNIONPAY] = /^(62|81)\d{0,14}/),
				n),
			p = (e) => {
				var r = e.reduce((e, r) => e + r, 0);
				return e.concat(19 - r);
			},
			h = (e) => {
				for (
					var r = e.value, t = e.strictMode, n = 0, a = Object.keys(f);
					n < a.length;
					n++
				) {
					var l = a[n];
					if (f[l].test(r)) {
						var u = v[l];
						return { type: l, blocks: null != t && t ? p(u) : u };
					}
				}
				return {
					type: i.GENERAL,
					blocks: null != t && t ? p(v.general) : v.general,
				};
			},
			g = (e, r) => {
				var t = null != r ? r : {},
					n = t.delimiter,
					i = void 0 === n ? " " : n,
					s = t.delimiterLazyShow,
					d = void 0 !== s && s,
					m = t.strictMode,
					v = void 0 !== m && m;
				(e = a(e)), (e = o({ value: e, delimiters: [i] }));
				var f = h({ value: e, strictMode: v }).blocks,
					p = l(f);
				return (
					(e = u(e, p)),
					c({ value: e, blocks: f, delimiter: i, delimiterLazyShow: d })
				);
			},
			E = (e, r) => (
				(e = a(e)),
				(e = o({ value: e, delimiters: [null != r ? r : " "] })),
				h({ value: e }).type
			);
		!((e) => {
			(e.THOUSAND = "thousand"),
				(e.LAKH = "lakh"),
				(e.WAN = "wan"),
				(e.NONE = "none");
		})(m || (m = {}));
		var x = m.THOUSAND,
			I = (e, r) => {
				var t = null != r ? r : {},
					n = t.delimiter,
					i = t.numeralThousandsGroupStyle,
					a = t.numeralIntegerScale,
					l = t.numeralDecimalMark,
					u = t.numeralDecimalScale,
					o = t.stripLeadingZeroes,
					c = t.numeralPositiveOnly,
					s = t.tailPrefix,
					d = t.signBeforePrefix,
					v = t.prefix;
				return ((e) => {
					var r,
						t,
						n,
						i = e.delimiter,
						a = e.numeralDecimalMark,
						l = e.numeralDecimalScale,
						u = e.stripLeadingZeroes,
						o = e.numeralPositiveOnly,
						c = e.numeralIntegerScale,
						s = e.numeralThousandsGroupStyle,
						d = e.signBeforePrefix,
						v = e.tailPrefix,
						f = e.prefix,
						p = "",
						h = e.value
							.replace(/[A-Za-z]/g, "")
							.replace(a, "M")
							.replace(/[^\dM-]/g, "")
							.replace(/^-/, "N")
							.replace(/-/g, "")
							.replace("N", null != o && o ? "" : "-")
							.replace("M", a);
					u && (h = h.replace(/^(-)?0+(?=\d)/, "$1"));
					var g = "-" === h.slice(0, 1) ? "-" : "";
					switch (
						((t = d ? g + f : f + g),
						(n = h),
						h.includes(a) &&
							((n = (r = h.split(a))[0]), (p = a + r[1].slice(0, l))),
						"-" === g && (n = n.slice(1)),
						c > 0 && (n = n.slice(0, c)),
						s)
					) {
						case m.LAKH:
							n = n.replace(/(\d)(?=(\d\d)+\d$)/g, `$1${i}`);
							break;
						case m.WAN:
							n = n.replace(/(\d)(?=(\d{4})+$)/g, `$1${i}`);
							break;
						case m.THOUSAND:
							n = n.replace(/(\d)(?=(\d{3})+$)/g, `$1${i}`);
					}
					return v ? g + n + (l > 0 ? p : "") + f : t + n + (l > 0 ? p : "");
				})({
					value: e,
					delimiter: void 0 === n ? "," : n,
					numeralIntegerScale: void 0 === a ? 0 : a,
					numeralDecimalMark: void 0 === l ? "." : l,
					numeralDecimalScale: void 0 === u ? 2 : u,
					stripLeadingZeroes: void 0 === o || o,
					numeralPositiveOnly: void 0 !== c && c,
					numeralThousandsGroupStyle: void 0 === i ? x : i,
					tailPrefix: void 0 !== s && s,
					signBeforePrefix: void 0 !== d && d,
					prefix: void 0 === v ? "" : v,
				});
			},
			A = ["d", "m", "Y"],
			y = (e, r) =>
				r
					? (e < 10 ? "000" : e < 100 ? "00" : e < 1e3 ? "0" : "") + e
					: (e < 10 ? "0" : "") + e,
			M = (e) => (e < 10 ? "0" : "") + e,
			S = (e, r, t) => {
				var n;
				return (
					(e = Math.min(e, 31)),
					(t = null != (n = t) ? n : 0),
					(((r = Math.min(r, 12)) < 7 && r % 2 === 0) ||
						(r > 8 && r % 2 === 1)) &&
						(e = Math.min(
							e,
							2 === r
								? ((e) => (e % 4 === 0 && e % 100 !== 0) || e % 400 === 0)(t)
									? 29
									: 28
								: 30,
						)),
					[e, r, t]
				);
			},
			N = (e, r) => {
				var t = null != r ? r : {},
					n = t.delimiterLazyShow,
					i = void 0 !== n && n,
					s = t.delimiter,
					d = void 0 === s ? "/" : s,
					m = t.datePattern,
					v = void 0 === m ? A : m,
					f = t.dateMax,
					p = void 0 === f ? "" : f,
					h = t.dateMin,
					g = void 0 === h ? "" : h;
				e = a(e);
				var E = ((e) => {
						var r = [];
						return (
							e.forEach((e) => {
								r.push("Y" === e ? 4 : 2);
							}),
							r
						);
					})(v),
					x = ((e) => {
						var r = e.dateMax,
							t = e.dateMin
								.split("-")
								.reverse()
								.map((e) => parseInt(e, 10));
						2 === t.length && t.unshift(0);
						var n = r
							.split("-")
							.reverse()
							.map((e) => parseInt(e, 10));
						return 2 === n.length && n.unshift(0), { min: t, max: n };
					})({ dateMax: p, dateMin: g });
				(e = ((e) => {
					var r = e.value,
						t = void 0 === r ? "" : r,
						n = e.blocks,
						i = e.datePattern,
						a = e.min,
						l = e.max,
						u = "";
					return (
						(void 0 === n ? [] : n).forEach((e, r) => {
							if (t.length > 0) {
								var n = t.slice(0, e),
									a = n.slice(0, 1),
									l = t.slice(e);
								switch (i[r]) {
									case "d":
										"00" === n
											? (n = "01")
											: parseInt(a, 10) > 3
												? (n = `0${a}`)
												: parseInt(n, 10) > 31 && (n = "31");
										break;
									case "m":
										"00" === n
											? (n = "01")
											: parseInt(a, 10) > 1
												? (n = `0${a}`)
												: parseInt(n, 10) > 12 && (n = "12");
								}
								(u += n), (t = l);
							}
						}),
						((e) => {
							var r,
								t,
								n,
								i = e.value,
								a = void 0 === i ? "" : i,
								l = e.datePattern,
								u = e.min,
								o = e.max,
								c = [],
								s = 0,
								d = 0,
								m = 0,
								v = 0,
								f = 0,
								p = 0,
								h = !1;
							return (
								4 === a.length &&
									"y" !== l[0].toLowerCase() &&
									"y" !== l[1].toLowerCase() &&
									((f = 2 - (v = "d" === l[0] ? 0 : 2)),
									(r = parseInt(a.slice(v, v + 2), 10)),
									(t = parseInt(a.slice(f, f + 2), 10)),
									(c = S(r, t, 0))),
								8 === a.length &&
									(l.forEach((e, r) => {
										switch (e) {
											case "d":
												s = r;
												break;
											case "m":
												d = r;
												break;
											default:
												m = r;
										}
									}),
									(p = 2 * m),
									(v = s <= m ? 2 * s : 2 * s + 2),
									(f = d <= m ? 2 * d : 2 * d + 2),
									(r = parseInt(a.slice(v, v + 2), 10)),
									(t = parseInt(a.slice(f, f + 2), 10)),
									(n = parseInt(a.slice(p, p + 4), 10)),
									(h = 4 === a.slice(p, p + 4).length),
									(c = S(r, t, n))),
								4 !== a.length ||
									("y" !== l[0] && "y" !== l[1]) ||
									((p = 2 - (f = "m" === l[0] ? 0 : 2)),
									(t = parseInt(a.slice(f, f + 2), 10)),
									(n = parseInt(a.slice(p, p + 2), 10)),
									(h = 2 === a.slice(p, p + 2).length),
									(c = [0, t, n])),
								6 !== a.length ||
									("Y" !== l[0] && "Y" !== l[1]) ||
									((p = 2 - 0.5 * (f = "m" === l[0] ? 0 : 4)),
									(t = parseInt(a.slice(f, f + 2), 10)),
									(n = parseInt(a.slice(p, p + 4), 10)),
									(h = 4 === a.slice(p, p + 4).length),
									(c = [0, t, n])),
								0 ===
								(c = ((e) => {
									var r = e.date,
										t = void 0 === r ? [] : r,
										n = e.min,
										i = e.max;
									return 0 === t.length ||
										(n.length < 3 && i.length < 3) ||
										(e.datePattern.filter((e) => "y" === e.toLowerCase())
											.length > 0 &&
											0 === t[2])
										? t
										: i.length > 0 &&
												(i[2] < t[2] ||
													(i[2] === t[2] &&
														(i[1] < t[1] || (i[1] === t[1] && i[0] < t[0]))))
											? i
											: n.length > 0 &&
													(n[2] > t[2] ||
														(n[2] === t[2] &&
															(n[1] > t[1] || (n[1] === t[1] && n[0] > t[0]))))
												? n
												: t;
								})({ date: c, datePattern: l, min: u, max: o })).length
									? a
									: l.reduce((e, r) => {
											switch (r) {
												case "d":
													return e + (0 === c[0] ? "" : M(c[0]));
												case "m":
													return e + (0 === c[1] ? "" : M(c[1]));
												case "y":
													return e + (h ? y(c[2], !1) : "");
												case "Y":
													return e + (h ? y(c[2], !0) : "");
											}
											return e;
										}, "")
							);
						})({ value: u, datePattern: i, min: a, max: l })
					);
				})({ value: e, blocks: E, datePattern: v, min: x.min, max: x.max })),
					(e = o({ value: e, delimiters: [d] }));
				var I = l(E);
				return (
					(e = u(e, I)),
					c({ value: e, blocks: E, delimiter: d, delimiterLazyShow: i })
				);
			},
			C = ["h", "m", "s"],
			k = (e) => (e < 10 ? "0" : "") + e,
			b = (e, r, t) => (
				(t = Math.min(t, 60)),
				(r = Math.min(r, 60)),
				[(e = Math.min(e, 60)), r, t]
			),
			P = (e, r) => {
				var t = null != r ? r : {},
					n = t.delimiterLazyShow,
					i = void 0 !== n && n,
					s = t.delimiter,
					d = void 0 === s ? ":" : s,
					m = t.timePattern,
					v = void 0 === m ? C : m,
					f = t.timeFormat,
					p = void 0 === f ? "24" : f;
				e = a(e);
				var h = ((e) => {
					var r = [];
					return (
						e.forEach(() => {
							r.push(2);
						}),
						r
					);
				})(v);
				(e = ((e) => {
					var r = e.value,
						t = e.timePattern,
						n = "",
						i =
							"12" === e.timeFormat
								? {
										maxHourFirstDigit: 1,
										maxHours: 12,
										maxMinutesFirstDigit: 5,
										maxMinutes: 60,
									}
								: {
										maxHourFirstDigit: 2,
										maxHours: 23,
										maxMinutesFirstDigit: 5,
										maxMinutes: 60,
									};
					return (
						e.blocks.forEach((e, a) => {
							if (r.length > 0) {
								var l = r.slice(0, e),
									u = l.slice(0, 1),
									o = r.slice(e);
								switch (t[a]) {
									case "h":
										parseInt(u, 10) > i.maxHourFirstDigit
											? (l = `0${u}`)
											: parseInt(l, 10) > i.maxHours && (l = `${i.maxHours}`);
										break;
									case "m":
									case "s":
										parseInt(u, 10) > i.maxMinutesFirstDigit
											? (l = `0${u}`)
											: parseInt(l, 10) > i.maxMinutes &&
												(l = `${i.maxMinutes}`);
								}
								(n += l), (r = o);
							}
						}),
						((e) => {
							var r,
								t,
								n,
								i = e.value,
								a = e.timePattern,
								l = [],
								u = 0,
								o = 0,
								c = 0,
								s = 0,
								d = 0,
								m = 0;
							return (
								6 === i.length &&
									(a.forEach((e, r) => {
										switch (e) {
											case "s":
												u = 2 * r;
												break;
											case "m":
												o = 2 * r;
												break;
											case "h":
												c = 2 * r;
										}
									}),
									(m = c),
									(d = o),
									(s = u),
									(r = parseInt(i.slice(s, s + 2), 10)),
									(t = parseInt(i.slice(d, d + 2), 10)),
									(n = parseInt(i.slice(m, m + 2), 10)),
									(l = b(n, t, r))),
								4 !== i.length ||
									a.includes("s") ||
									(a.forEach((e, r) => {
										switch (e) {
											case "m":
												o = 2 * r;
												break;
											case "h":
												c = 2 * r;
										}
									}),
									(m = c),
									(d = o),
									(r = 0),
									(t = parseInt(i.slice(d, d + 2), 10)),
									(n = parseInt(i.slice(m, m + 2), 10)),
									(l = b(n, t, r))),
								0 === l.length
									? i
									: a.reduce((e, r) => {
											switch (r) {
												case "s":
													return e + k(l[2]);
												case "m":
													return e + k(l[1]);
												case "h":
													return e + k(l[0]);
											}
											return e;
										}, "")
							);
						})({ value: n, timePattern: t })
					);
				})({ value: e, blocks: h, timePattern: v, timeFormat: p })),
					(e = o({ value: e, delimiters: [d] }));
				var g = l(h);
				return (
					(e = u(e, g)),
					c({ value: e, blocks: h, delimiter: d, delimiterLazyShow: i })
				);
			};
		return r;
	})(),
);
