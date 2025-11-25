/**
 * @namespace: addons/dashboard/web/public/assets/vendor/js/helpers.js
 * @type: Module
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.10.0-beta
 */

!((e, t) => {
	if ("object" === typeof exports && "object" === typeof module)
		module.exports = t();
	else if ("function" === typeof define && define.amd) define([], t);
	else {
		var n = t();
		for (var o in n) ("object" === typeof exports ? exports : e)[o] = n[o];
	}
})(self, () =>
	(() => {
		var e = {
				d: (t, n) => {
					for (var o in n)
						e.o(n, o) &&
							!e.o(t, o) &&
							Object.defineProperty(t, o, { enumerable: !0, get: n[o] });
				},
				o: (e, t) => Object.hasOwn(e, t),
				r: (e) => {
					"undefined" !== typeof Symbol &&
						Symbol.toStringTag &&
						Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
						Object.defineProperty(e, "__esModule", { value: !0 });
				},
			},
			t = {};
		function n(e) {
			return (
				s(e) ||
				((e) => {
					if (
						("undefined" !== typeof Symbol && null != e[Symbol.iterator]) ||
						null != e["@@iterator"]
					)
						return Array.from(e);
				})(e) ||
				r(e) ||
				i()
			);
		}
		function o(e, t) {
			return (
				s(e) ||
				((e, t) => {
					var n =
						null == e
							? null
							: ("undefined" !== typeof Symbol && e[Symbol.iterator]) ||
								e["@@iterator"];
					if (null != n) {
						var o,
							i,
							r,
							a,
							s = [],
							u = !0,
							l = !1;
						try {
							if (((r = (n = n.call(e)).next), 0 === t)) {
								if (Object(n) !== n) return;
								u = !1;
							} else
								for (
									;
									!(u = (o = r.call(n)).done) &&
									(s.push(o.value), s.length !== t);
									u = !0
								);
						} catch (e) {
							(l = !0), (i = e);
						} finally {
							try {
								if (
									!u &&
									null != n.return &&
									((a = n.return()), Object(a) !== a)
								)
									return;
							} finally {
								if (l) throw i;
							}
						}
						return s;
					}
				})(e, t) ||
				r(e, t) ||
				i()
			);
		}
		function i() {
			throw new TypeError(
				"Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
			);
		}
		function r(e, t) {
			if (e) {
				if ("string" === typeof e) return a(e, t);
				var n = {}.toString.call(e).slice(8, -1);
				return (
					"Object" === n && e.constructor && (n = e.constructor.name),
					"Map" === n || "Set" === n
						? Array.from(e)
						: "Arguments" === n ||
								/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
							? a(e, t)
							: void 0
				);
			}
		}
		function a(e, t) {
			(null == t || t > e.length) && (t = e.length);
			for (var n = 0, o = Array(t); n < t; n++) o[n] = e[n];
			return o;
		}
		function s(e) {
			if (Array.isArray(e)) return e;
		}
		e.r(t),
			e.d(t, {
				Helpers: () => d,
			});
		var u = ["transitionend", "webkitTransitionEnd", "oTransitionEnd"],
			l = [
				"transition",
				"MozTransition",
				"webkitTransition",
				"WebkitTransition",
				"OTransition",
			];
		function c(e) {
			throw new Error(
				"Parameter required".concat(e ? ": `".concat(e, "`") : ""),
			);
		}
		var d = {
			ROOT_EL: "undefined" !== typeof window ? document.documentElement : null,
			prefix: getComputedStyle(document.documentElement)
				.getPropertyValue("--prefix")
				.trim(),
			LAYOUT_BREAKPOINT: 1200,
			RESIZE_DELAY: 200,
			menuPsScroll: null,
			mainMenu: null,
			_curStyle: null,
			_styleEl: null,
			_resizeTimeout: null,
			_resizeCallback: null,
			_transitionCallback: null,
			_transitionCallbackTimeout: null,
			_listeners: [],
			_initialized: !1,
			_autoUpdate: !1,
			_scrollToActive: function () {
				var e = arguments.length > 0 && void 0 !== arguments[0] && arguments[0],
					t =
						arguments.length > 1 && void 0 !== arguments[1]
							? arguments[1]
							: 500,
					n = this.getLayoutMenu();
				if (n) {
					var o = n.querySelector("li.menu-item.active:not(.open)");
					if (o) {
						var i = this.getLayoutMenu().querySelector(".menu-inner");
						if (
							("string" === typeof o && (o = document.querySelector(o)),
							"number" !== typeof o &&
								(o = o.getBoundingClientRect().top + i.scrollTop),
							o < parseInt((2 * i.clientHeight) / 3, 10))
						)
							return;
						var r = i.scrollTop,
							a = o - r - parseInt(i.clientHeight / 2, 10),
							s = Date.now();
						if (!0 === e) {
							var u = () => {
								var e,
									n,
									o,
									l = Date.now() - s,
									c =
										((e = l),
										(n = r),
										(o = a),
										(e /= t / 2) < 1
											? (o / 2) * e * e + n
											: (-o / 2) * ((e -= 1) * (e - 2) - 1) + n);
								(i.scrollTop = c),
									l < t ? requestAnimationFrame(u) : (i.scrollTop = a);
							};
							u();
						} else i.scrollTop = a;
					}
				}
			},
			_swipeIn: (e, t) => {
				var n = window.Hammer;
				if (void 0 !== n && "string" === typeof e) {
					var o = document.querySelector(e);
					if (o) new n(o).on("panright", t);
				}
			},
			_swipeOut: (e, t) => {
				var n = window.Hammer;
				void 0 !== n &&
					"string" === typeof e &&
					setTimeout(() => {
						var o = document.querySelector(e);
						if (o) {
							var i = new n(o);
							i.get("pan").set({ direction: n.DIRECTION_ALL, threshold: 250 }),
								i.on("panleft", t);
						}
					}, 500);
			},
			_addClass: function (e) {
				var t =
					arguments.length > 1 && void 0 !== arguments[1]
						? arguments[1]
						: this.ROOT_EL;
				t && void 0 !== t.length
					? t.forEach((t) => {
							t && e.split(" ").forEach((e) => t.classList.add(e));
						})
					: t && e.split(" ").forEach((e) => t.classList.add(e));
			},
			_removeClass: function (e) {
				var t =
					arguments.length > 1 && void 0 !== arguments[1]
						? arguments[1]
						: this.ROOT_EL;
				t && void 0 !== t.length
					? t.forEach((t) => {
							t && e.split(" ").forEach((e) => t.classList.remove(e));
						})
					: t && e.split(" ").forEach((e) => t.classList.remove(e));
			},
			_toggleClass: function () {
				var e =
						arguments.length > 0 && void 0 !== arguments[0]
							? arguments[0]
							: this.ROOT_EL,
					t = arguments.length > 1 ? arguments[1] : void 0,
					n = arguments.length > 2 ? arguments[2] : void 0;
				e.classList.contains(t)
					? e.classList.replace(t, n)
					: e.classList.replace(n, t);
			},
			_hasClass: function (e) {
				var t =
						arguments.length > 1 && void 0 !== arguments[1]
							? arguments[1]
							: this.ROOT_EL,
					n = !1;
				return (
					e.split(" ").forEach((e) => {
						t.classList.contains(e) && (n = !0);
					}),
					n
				);
			},
			_findParent: (e, t) => {
				if (
					(e && "BODY" === e.tagName.toUpperCase()) ||
					"HTML" === e.tagName.toUpperCase()
				)
					return null;
				for (
					e = e.parentNode;
					e && "BODY" !== e.tagName.toUpperCase() && !e.classList.contains(t);
				)
					e = e.parentNode;
				return (e = e && "BODY" !== e.tagName.toUpperCase() ? e : null);
			},
			_triggerWindowEvent: (e) => {
				var t;
				"undefined" !== typeof window &&
					(document.createEvent
						? ("function" === typeof Event
								? (t = new Event(e))
								: (t = document.createEvent("Event")).initEvent(e, !1, !0),
							window.dispatchEvent(t))
						: window.fireEvent("on".concat(e), document.createEventObject()));
			},
			_triggerEvent: function (e) {
				this._triggerWindowEvent("layout".concat(e)),
					this._listeners
						.filter((t) => t.event === e)
						.forEach((e) => e.callback.call(null));
			},
			_updateInlineStyle: function () {
				var e =
						arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0,
					t =
						arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;
				this._styleEl ||
					((this._styleEl = document.createElement("style")),
					(this._styleEl.type = "text/css"),
					document.head.appendChild(this._styleEl));
				var n =
					"\n.layout-menu-fixed .layout-navbar-full .layout-menu,\n.layout-menu-fixed-offcanvas .layout-navbar-full .layout-menu {\n  top: {navbarHeight}px !important;\n}\n.layout-page {\n  padding-top: {navbarHeight}px !important;\n}\n.content-wrapper {\n  padding-bottom: {footerHeight}px !important;\n}"
						.replace(/\{navbarHeight\}/gi, e)
						.replace(/\{footerHeight\}/gi, t);
				this._curStyle !== n &&
					((this._curStyle = n), (this._styleEl.textContent = n));
			},
			_removeInlineStyle: function () {
				this._styleEl && document.head.removeChild(this._styleEl),
					(this._styleEl = null),
					(this._curStyle = null);
			},
			_redrawLayoutMenu: function () {
				var e = this.getLayoutMenu();
				if (e?.querySelector(".menu")) {
					var t = e.querySelector(".menu-inner"),
						n = t.scrollTop,
						o = document.documentElement.scrollTop;
					return (
						(e.style.display = "none"),
						(e.style.display = ""),
						(t.scrollTop = n),
						(document.documentElement.scrollTop = o),
						!0
					);
				}
				return !1;
			},
			_supportsTransitionEnd: () => {
				if (window.QUnit) return !1;
				var e = document.body || document.documentElement;
				if (!e) return !1;
				var t = !1;
				return (
					l.forEach((n) => {
						void 0 !== e.style[n] && (t = !0);
					}),
					t
				);
			},
			_getNavbarHeight: function () {
				var t = this.getLayoutNavbar();
				if (!t) return 0;
				if (!this.isSmallScreen()) return t.getBoundingClientRect().height;
				var n = t.cloneNode(!0);
				(n.id = null),
					(n.style.visibility = "hidden"),
					(n.style.position = "absolute"),
					Array.prototype.slice
						.call(n.querySelectorAll(".collapse.show"))
						.forEach((t) => this._removeClass("show", t)),
					t.parentNode.insertBefore(n, t);
				var o = n.getBoundingClientRect().height;
				return n.parentNode.removeChild(n), o;
			},
			_getFooterHeight: function () {
				var e = this.getLayoutFooter();
				return e ? e.getBoundingClientRect().height : 0;
			},
			_getAnimationDuration: (e) => {
				var t = window.getComputedStyle(e).transitionDuration;
				return parseFloat(t) * (-1 !== t.indexOf("ms") ? 1 : 1e3);
			},
			_setMenuHoverState: function (e) {
				this[e ? "_addClass" : "_removeClass"]("layout-menu-hover");
			},
			_setCollapsed: function (e) {
				this.isSmallScreen()
					? e
						? this._removeClass("layout-menu-expanded")
						: setTimeout(
								() => {
									this._addClass("layout-menu-expanded");
								},
								this._redrawLayoutMenu() ? 5 : 0,
							)
					: this[e ? "_addClass" : "_removeClass"]("layout-menu-collapsed");
			},
			_bindLayoutAnimationEndEvent: function (e, t) {
				var o = this.getMenu(),
					i = o ? this._getAnimationDuration(o) + 50 : 0;
				if (!i) return e.call(this), void t.call(this);
				(this._transitionCallback = (e) => {
					e.target === o &&
						(this._unbindLayoutAnimationEndEvent(), t.call(this));
				}),
					u.forEach((e) => {
						o.addEventListener(e, this._transitionCallback, !1);
					}),
					e.call(this),
					(this._transitionCallbackTimeout = setTimeout(() => {
						this._transitionCallback.call(this, { target: o });
					}, i));
			},
			_unbindLayoutAnimationEndEvent: function () {
				var t = this.getMenu();
				this._transitionCallbackTimeout &&
					(clearTimeout(this._transitionCallbackTimeout),
					(this._transitionCallbackTimeout = null)),
					t &&
						this._transitionCallback &&
						u.forEach((n) => {
							t.removeEventListener(n, this._transitionCallback, !1);
						}),
					this._transitionCallback && (this._transitionCallback = null);
			},
			_bindWindowResizeEvent: function () {
				this._unbindWindowResizeEvent();
				var t = () => {
					this._resizeTimeout &&
						(clearTimeout(this._resizeTimeout), (this._resizeTimeout = null)),
						this._triggerEvent("resize");
				};
				(this._resizeCallback = () => {
					this._resizeTimeout && clearTimeout(this._resizeTimeout),
						(this._resizeTimeout = setTimeout(t, this.RESIZE_DELAY));
				}),
					window.addEventListener("resize", this._resizeCallback, !1);
			},
			_unbindWindowResizeEvent: function () {
				this._resizeTimeout &&
					(clearTimeout(this._resizeTimeout), (this._resizeTimeout = null)),
					this._resizeCallback &&
						(window.removeEventListener("resize", this._resizeCallback, !1),
						(this._resizeCallback = null));
			},
			_bindMenuMouseEvents: function () {
				if (
					!(
						this._menuMouseEnter &&
						this._menuMouseLeave &&
						this._windowTouchStart
					)
				) {
					var t = this.getLayoutMenu();
					if (!t) return this._unbindMenuMouseEvents();
					this._menuMouseEnter ||
						((this._menuMouseEnter = () =>
							this.isSmallScreen() ||
							!this._hasClass("layout-menu-collapsed") ||
							this.isOffcanvas() ||
							this._hasClass("layout-transitioning")
								? this._setMenuHoverState(!1)
								: this._setMenuHoverState(!0)),
						t.addEventListener("mouseenter", this._menuMouseEnter, !1),
						t.addEventListener("touchstart", this._menuMouseEnter, !1)),
						this._menuMouseLeave ||
							((this._menuMouseLeave = () => {
								this._setMenuHoverState(!1);
							}),
							t.addEventListener("mouseleave", this._menuMouseLeave, !1)),
						this._windowTouchStart ||
							((this._windowTouchStart = (t) => {
								(t?.target && this._findParent(t.target, ".layout-menu")) ||
									this._setMenuHoverState(!1);
							}),
							window.addEventListener(
								"touchstart",
								this._windowTouchStart,
								!0,
							));
				}
			},
			_unbindMenuMouseEvents: function () {
				if (
					this._menuMouseEnter ||
					this._menuMouseLeave ||
					this._windowTouchStart
				) {
					var e = this.getLayoutMenu();
					this._menuMouseEnter &&
						(e &&
							(e.removeEventListener("mouseenter", this._menuMouseEnter, !1),
							e.removeEventListener("touchstart", this._menuMouseEnter, !1)),
						(this._menuMouseEnter = null)),
						this._menuMouseLeave &&
							(e?.removeEventListener("mouseleave", this._menuMouseLeave, !1),
							(this._menuMouseLeave = null)),
						this._windowTouchStart &&
							(e &&
								window.addEventListener(
									"touchstart",
									this._windowTouchStart,
									!0,
								),
							(this._windowTouchStart = null)),
						this._setMenuHoverState(!1);
				}
			},
			scrollToActive: function () {
				var e = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
				this._scrollToActive(e);
			},
			swipeIn: function (e, t) {
				this._swipeIn(e, t);
			},
			swipeOut: function (e, t) {
				this._swipeOut(e, t);
			},
			setCollapsed: function () {
				var t =
						arguments.length > 0 && void 0 !== arguments[0]
							? arguments[0]
							: c("collapsed"),
					n =
						!(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
				this.getLayoutMenu() &&
					(this._unbindLayoutAnimationEndEvent(),
					n && this._supportsTransitionEnd()
						? (this._addClass("layout-transitioning"),
							t && this._setMenuHoverState(!1),
							this._bindLayoutAnimationEndEvent(
								() => {
									this._setCollapsed(t);
								},
								() => {
									this._removeClass("layout-transitioning"),
										this._triggerWindowEvent("resize"),
										this._triggerEvent("toggle"),
										this._setMenuHoverState(!1);
								},
							))
						: (this._addClass("layout-no-transition"),
							t && this._setMenuHoverState(!1),
							this._setCollapsed(t),
							setTimeout(() => {
								this._removeClass("layout-no-transition"),
									this._triggerWindowEvent("resize"),
									this._triggerEvent("toggle"),
									this._setMenuHoverState(!1);
							}, 1)));
			},
			toggleCollapsed: function () {
				var e =
					!(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0];
				this.setCollapsed(!this.isCollapsed(), e);
			},
			setPosition: function () {
				var e =
						arguments.length > 0 && void 0 !== arguments[0]
							? arguments[0]
							: c("fixed"),
					t =
						arguments.length > 1 && void 0 !== arguments[1]
							? arguments[1]
							: c("offcanvas");
				this._removeClass(
					"layout-menu-offcanvas layout-menu-fixed layout-menu-fixed-offcanvas",
				),
					!e && t
						? this._addClass("layout-menu-offcanvas")
						: e && !t
							? (this._addClass("layout-menu-fixed"), this._redrawLayoutMenu())
							: e &&
								t &&
								(this._addClass("layout-menu-fixed-offcanvas"),
								this._redrawLayoutMenu()),
					this.update();
			},
			switchImage: (e) => {
				"system" === e &&
					(e = window.matchMedia("(prefers-color-scheme: dark)").matches
						? "dark"
						: "light"),
					Array.from(
						document.querySelectorAll("[data-app-".concat(e, "-img]")),
					).forEach((t) => {
						var n = t.getAttribute("data-app-".concat(e, "-img"));
						if (n) {
							var o = "".concat(assetsPath, "img/").concat(n),
								i = new Image();
							(i.src = o),
								(i.onload = () => {
									(t.src = i.src), (t.style.visibility = "visible");
								}),
								(t.style.visibility = "hidden");
						}
					});
			},
			getLayoutMenu: () => document.querySelector(".layout-menu"),
			getMenu: function () {
				var e = this.getLayoutMenu();
				return e
					? this._hasClass("menu", e)
						? e
						: e.querySelector(".menu")
					: null;
			},
			getLayoutNavbar: () => document.querySelector(".layout-navbar"),
			getLayoutFooter: () => document.querySelector(".content-footer"),
			getLayoutContainer: () => document.querySelector(".layout-page"),
			setNavbarFixed: function () {
				this[
					(
						arguments.length > 0 && void 0 !== arguments[0]
							? arguments[0]
							: c("fixed")
					)
						? "_addClass"
						: "_removeClass"
				]("layout-navbar-fixed"),
					this.update();
			},
			setNavbar: function (e) {
				"sticky" === e
					? (this._addClass("layout-navbar-fixed"),
						this._removeClass("layout-navbar-hidden"))
					: "hidden" === e
						? (this._addClass("layout-navbar-hidden"),
							this._removeClass("layout-navbar-fixed"))
						: (this._removeClass("layout-navbar-hidden"),
							this._removeClass("layout-navbar-fixed")),
					this.update();
			},
			setFooterFixed: function () {
				this[
					(
						arguments.length > 0 && void 0 !== arguments[0]
							? arguments[0]
							: c("fixed")
					)
						? "_addClass"
						: "_removeClass"
				]("layout-footer-fixed"),
					this.update();
			},
			setColor: (e, t) => {
				var n = parseInt(e.slice(1, 3), 16),
					o = parseInt(e.slice(3, 5), 16),
					i = parseInt(e.slice(5, 7), 16),
					r = document.getElementById("custom-css");
				r ||
					(((r = document.createElement("style")).id = "custom-css"),
					document.head.appendChild(r));
				var a,
					s = (299 * n + 587 * o + 114 * i) / 1e3,
					u =
						100 *
						getComputedStyle(document.documentElement)
							.getPropertyValue("--ky-min-contrast-ratio")
							.trim(),
					l = getComputedStyle(document.documentElement)
						.getPropertyValue("--ky-bg-label-tint-amount")
						.trim("%"),
					c = getComputedStyle(document.documentElement)
						.getPropertyValue("--ky-border-subtle-amount")
						.trim(),
					d = s >= u ? "#000" : "#fff";
				t &&
					(r.innerHTML =
						":root, [data-bs-theme=light], [data-bs-theme=dark] {\n    --ky-primary: "
							.concat(e, ";\n    --ky-primary-rgb: ")
							.concat(n, ", ")
							.concat(o, ", ")
							.concat(i, ";\n    --ky-primary-bg-subtle: color-mix(in sRGB, ")
							.concat(window.config.colors.cardColor, " ")
							.concat(l, ", ")
							.concat(e, ");\n    --ky-primary-border-subtle: rgba(")
							.concat(n, ", ")
							.concat(o, ", ")
							.concat(i, ", ")
							.concat(
								((a = c), (100 - parseFloat(a)) / 100),
								");\n    --ky-primary-contrast: ",
							)
							.concat(d, "\n  }"));
			},
			setContentLayout: function () {
				var t =
					arguments.length > 0 && void 0 !== arguments[0]
						? arguments[0]
						: c("contentLayout");
				setTimeout(() => {
					var n,
						o = document.querySelector(".content-wrapper > div");
					n = document.querySelector(".layout-wrapper.layout-navbar-full")
						? document.querySelector(".layout-navbar-full .layout-navbar > div")
						: document.querySelector(".layout-content-navbar .layout-navbar");
					var i,
						r = document.querySelector(".content-footer > div"),
						a = [].slice.call(document.querySelectorAll(".container-fluid")),
						s = [].slice.call(document.querySelectorAll(".container-xxl")),
						u = !1;
					document.querySelector(".content-wrapper > .menu-horizontal > div") &&
						((u = !0),
						(i = document.querySelector(
							".content-wrapper > .menu-horizontal > div",
						))),
						"compact" === t
							? (a.some((e) => [o, n, r].includes(e)) &&
									(this._removeClass("container-fluid", [o, n, r]),
									this._addClass("container-xxl", [o, n, r])),
								u &&
									(this._removeClass("container-fluid", i),
									this._addClass("container-xxl", i)))
							: (s.some((e) => [o, n, r].includes(e)) &&
									(this._removeClass("container-xxl", [o, n, r]),
									this._addClass("container-fluid", [o, n, r])),
								u &&
									(this._removeClass("container-xxl", i),
									this._addClass("container-fluid", i)));
				}, 100);
			},
			update: function () {
				((this.getLayoutNavbar() &&
					((!this.isSmallScreen() &&
						this.isLayoutNavbarFull() &&
						this.isFixed()) ||
						this.isNavbarFixed())) ||
					(this.getLayoutFooter() && this.isFooterFixed())) &&
					this._updateInlineStyle(
						this._getNavbarHeight(),
						this._getFooterHeight(),
					),
					this._bindMenuMouseEvents();
			},
			setAutoUpdate: function () {
				var t =
					arguments.length > 0 && void 0 !== arguments[0]
						? arguments[0]
						: c("enable");
				t && !this._autoUpdate
					? (this.on("resize.Helpers:autoUpdate", () => this.update()),
						(this._autoUpdate = !0))
					: !t &&
						this._autoUpdate &&
						(this.off("resize.Helpers:autoUpdate"), (this._autoUpdate = !1));
			},
			updateCustomOptionCheck: (e) => {
				if (e.checked) {
					if ("radio" === e.type)
						[].slice
							.call(e.closest(".row").querySelectorAll(".custom-option"))
							.map((e) => {
								e.closest(".custom-option").classList.remove("checked");
							});
					e.closest(".custom-option").classList.add("checked");
				} else e.closest(".custom-option").classList.remove("checked");
			},
			isRtl: () =>
				"rtl" === document.querySelector("body").getAttribute("dir") ||
				"rtl" === document.querySelector("html").getAttribute("dir"),
			isMobileDevice: () =>
				void 0 !== window.orientation ||
				-1 !== navigator.userAgent.indexOf("IEMobile"),
			isSmallScreen: function () {
				return (
					(window.innerWidth ||
						document.documentElement.clientWidth ||
						document.body.clientWidth) < this.LAYOUT_BREAKPOINT
				);
			},
			isLayoutNavbarFull: () =>
				!!document.querySelector(".layout-wrapper.layout-navbar-full"),
			isCollapsed: function () {
				return this.isSmallScreen()
					? !this._hasClass("layout-menu-expanded")
					: this._hasClass("layout-menu-collapsed");
			},
			isFixed: function () {
				return this._hasClass("layout-menu-fixed layout-menu-fixed-offcanvas");
			},
			isOffcanvas: function () {
				return this._hasClass(
					"layout-menu-offcanvas layout-menu-fixed-offcanvas",
				);
			},
			isNavbarFixed: function () {
				return (
					this._hasClass("layout-navbar-fixed") ||
					(!this.isSmallScreen() && this.isFixed() && this.isLayoutNavbarFull())
				);
			},
			isFooterFixed: function () {
				return this._hasClass("layout-footer-fixed");
			},
			isLightStyle: () =>
				"light" === document.documentElement.getAttribute("data-bs-theme"),
			isDarkStyle: () =>
				"dark" === document.documentElement.getAttribute("data-bs-theme"),
			on: function () {
				var e =
						arguments.length > 0 && void 0 !== arguments[0]
							? arguments[0]
							: c("event"),
					t =
						arguments.length > 1 && void 0 !== arguments[1]
							? arguments[1]
							: c("callback"),
					i = o(e.split("."), 1)[0],
					r = n(e.split(".")).slice(1);
				(r = r.join(".") || null),
					this._listeners.push({ event: i, namespace: r, callback: t });
			},
			off: function () {
				var t =
						arguments.length > 0 && void 0 !== arguments[0]
							? arguments[0]
							: c("event"),
					i = o(t.split("."), 1)[0],
					r = n(t.split(".")).slice(1);
				(r = r.join(".") || null),
					this._listeners
						.filter((e) => e.event === i && e.namespace === r)
						.forEach((t) =>
							this._listeners.splice(this._listeners.indexOf(t), 1),
						);
			},
			getStoredTheme: (_e) =>
				(window.templateCustomizer
					? window.templateCustomizer._getSetting("Theme")
					: document
							.getElementsByTagName("HTML")[0]
							.getAttribute("data-bs-theme")) ||
				(window.templateCustomizer.settings.defaultTheme
					? window.templateCustomizer.settings.defaultTheme
					: "light"),
			setStoredTheme: (e, t) => {
				localStorage.setItem("templateCustomizer-".concat(e, "--Theme"), t);
			},
			getPreferredTheme: (e) => {
				var t = d.getStoredTheme(e);
				return (
					t ||
					(window.matchMedia("(prefers-color-scheme: dark)").matches
						? "dark"
						: "light")
				);
			},
			setTheme: (e) => {
				"system" === e
					? document.documentElement.setAttribute(
							"data-bs-theme",
							window.matchMedia("(prefers-color-scheme: dark)").matches
								? "dark"
								: "light",
						)
					: document.documentElement.setAttribute("data-bs-theme", e);
			},
			showActiveTheme: function (e) {
				var t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
					n = document.querySelector("#nav-theme");
				if (n) {
					var o = document.querySelector("#nav-theme-text"),
						i = document.querySelector(".theme-icon-active"),
						r = document.querySelector(
							'[data-bs-theme-value="'.concat(e, '"]'),
						),
						a = r.querySelector("i").getAttribute("data-icon");
					document.querySelectorAll("[data-bs-theme-value]").forEach((e) => {
						e.classList.remove("active"),
							e.setAttribute("aria-pressed", "false");
					}),
						r.classList.add("active"),
						r.setAttribute("aria-pressed", "true");
					var s = Array.from(i.classList).filter((e) => !e.startsWith("bx-"));
					i.setAttribute("class", "bx-".concat(a, " ").concat(s.join(" ")));
					var u = ""
						.concat(o.textContent, " (")
						.concat(r.dataset.bsThemeValue, ")");
					n.setAttribute("aria-label", u), t && n.focus();
				}
			},
			syncThemeToggles: (e) => {
				document.querySelectorAll("[data-bs-theme-value]").forEach((t) => {
					t.getAttribute("data-bs-theme-value") === e && t.click();
				});
			},
			syncCustomOptions: (e) => {
				var t = document.querySelector(
					'.template-customizer-themes-options input[value="'.concat(e, '"]'),
				);
				t && ((t.checked = !0), window.Helpers.updateCustomOptionCheck(t));
			},
			syncCustomOptionsRtl: (e) => {
				var t = document.querySelector(
					'.template-customizer-directions-options input[value="'.concat(
						e,
						'"]',
					),
				);
				t && ((t.checked = !0), window.Helpers.updateCustomOptionCheck(t));
			},
			init: function () {
				this._initialized ||
					((this._initialized = !0),
					this._updateInlineStyle(0),
					this._bindWindowResizeEvent(),
					this.off("init._Helpers"),
					this.on("init._Helpers", () => {
						this.off("resize._Helpers:redrawMenu"),
							this.on("resize._Helpers:redrawMenu", () => {
								this.isSmallScreen() &&
									!this.isCollapsed() &&
									this._redrawLayoutMenu();
							}),
							"number" === typeof document.documentMode &&
								document.documentMode < 11 &&
								(this.off("resize._Helpers:ie10RepaintBody"),
								this.on("resize._Helpers:ie10RepaintBody", () => {
									if (!this.isFixed()) {
										var t = document.documentElement.scrollTop;
										(document.body.style.display = "none"),
											(document.body.style.display = "block"),
											(document.documentElement.scrollTop = t);
									}
								}));
					}),
					this._triggerEvent("init"));
			},
			destroy: function () {
				this._initialized &&
					((this._initialized = !1),
					this._removeClass("layout-transitioning"),
					this._removeInlineStyle(),
					this._unbindLayoutAnimationEndEvent(),
					this._unbindWindowResizeEvent(),
					this._unbindMenuMouseEvents(),
					this.setAutoUpdate(!1),
					this.off("init._Helpers"),
					this._listeners
						.filter((e) => "init" !== e.event)
						.forEach((t) =>
							this._listeners.splice(this._listeners.indexOf(t), 1),
						));
			},
			initPasswordToggle: () => {
				var e = document.querySelectorAll(".form-password-toggle i");
				e?.forEach((e) => {
					e.addEventListener("click", (t) => {
						t.preventDefault();
						var n = e.closest(".form-password-toggle"),
							o = n.querySelector("i"),
							i = n.querySelector("input");
						"text" === i.getAttribute("type")
							? (i.setAttribute("type", "password"),
								o.classList.replace("bx-show", "bx-hide"))
							: "password" === i.getAttribute("type") &&
								(i.setAttribute("type", "text"),
								o.classList.replace("bx-hide", "bx-show"));
					});
				});
			},
			initCustomOptionCheck: function () {
				[].slice
					.call(document.querySelectorAll(".custom-option .form-check-input"))
					.map((t) => {
						this.updateCustomOptionCheck(t),
							t.addEventListener("click", (_n) => {
								this.updateCustomOptionCheck(t);
							});
					});
			},
			initSpeechToText: () => {
				var e = window.SpeechRecognition || window.webkitSpeechRecognition,
					t = document.querySelectorAll(".speech-to-text");
				if (null != e && null != t) {
					var n = new e();
					document.querySelectorAll(".speech-to-text i").forEach((e) => {
						var t = !1;
						e.addEventListener("click", () => {
							e.closest(".input-group").querySelector(".form-control").focus(),
								(n.onspeechstart = () => {
									t = !0;
								}),
								!1 === t && n.start(),
								(n.onerror = () => {
									t = !1;
								}),
								(n.onresult = (t) => {
									e
										.closest(".input-group")
										.querySelector(".form-control").value =
										t.results[0][0].transcript;
								}),
								(n.onspeechend = () => {
									(t = !1), n.stop();
								});
						});
					});
				}
			},
			initNavbarDropdownScrollbar: () => {
				var e = document.querySelectorAll(
						".navbar-dropdown .scrollable-container",
					),
					t = window.PerfectScrollbar;
				void 0 !== t &&
					null != e &&
					e.forEach((e) => {
						new t(e, { wheelPropagation: !1, suppressScrollX: !0 });
					});
			},
			ajaxCall: (e) =>
				new Promise((t, n) => {
					var o = new XMLHttpRequest();
					o.open("GET", e),
						(o.onload = () =>
							200 === o.status ? t(o.response) : n(Error(o.statusText))),
						(o.onerror = (e) => n(Error("Network Error: ".concat(e)))),
						o.send();
				}),
			initSidebarToggle: () => {
				document.querySelectorAll('[data-bs-toggle="sidebar"]').forEach((e) => {
					e.addEventListener("click", () => {
						var t = e.getAttribute("data-target"),
							n = e.getAttribute("data-overlay"),
							o = document.querySelectorAll(".app-overlay");
						document.querySelectorAll(t).forEach((e) => {
							e.classList.toggle("show"),
								null != n &&
									!1 !== n &&
									void 0 !== o &&
									(e.classList.contains("show")
										? o[0].classList.add("show")
										: o[0].classList.remove("show"),
									o[0].addEventListener("click", (t) => {
										t.currentTarget.classList.remove("show"),
											e.classList.remove("show");
									}));
						});
					});
				});
			},
			getCssVar: function (e) {
				return !0 ===
					(arguments.length > 1 && void 0 !== arguments[1] && arguments[1])
					? getComputedStyle(document.documentElement)
							.getPropertyValue("--".concat(window.Helpers.prefix).concat(e))
							.trim()
					: "var(--".concat(window.Helpers.prefix).concat(e, ")");
			},
			maxLengthCount: (e, t, n) => {
				var o = e.value.length,
					i = n - o;
				(t.className = "maxLength label-success"),
					i >= 0 &&
						(t.textContent = "You typed "
							.concat(o, " out of ")
							.concat(n, " characters.")),
					i <= 0 &&
						((t.textContent = "You typed "
							.concat(o, " out of ")
							.concat(n, " characters.")),
						t.classList.remove("label-success"),
						t.classList.add("label-danger"));
			},
		};
		return (
			"undefined" !== typeof window &&
				(d.init(),
				d.isMobileDevice() &&
					window.chrome &&
					document.documentElement.classList.add("layout-menu-100vh"),
				"complete" === document.readyState
					? d.update()
					: document.addEventListener("DOMContentLoaded", function e() {
							d.update(), document.removeEventListener("DOMContentLoaded", e);
						})),
			(window.Helpers = d),
			t
		);
	})(),
);
