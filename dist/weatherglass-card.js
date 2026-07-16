/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const yt = globalThis, Pt = yt.ShadowRoot && (yt.ShadyCSS === void 0 || yt.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Lt = Symbol(), Ut = /* @__PURE__ */ new WeakMap();
let ye = class {
  constructor(t, i, r) {
    if (this._$cssResult$ = !0, r !== Lt) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = i;
  }
  get styleSheet() {
    let t = this.o;
    const i = this.t;
    if (Pt && t === void 0) {
      const r = i !== void 0 && i.length === 1;
      r && (t = Ut.get(i)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), r && Ut.set(i, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Fe = (e) => new ye(typeof e == "string" ? e : e + "", void 0, Lt), _e = (e, ...t) => {
  const i = e.length === 1 ? e[0] : t.reduce((r, s, n) => r + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + e[n + 1], e[0]);
  return new ye(i, e, Lt);
}, Ce = (e, t) => {
  if (Pt) e.adoptedStyleSheets = t.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of t) {
    const r = document.createElement("style"), s = yt.litNonce;
    s !== void 0 && r.setAttribute("nonce", s), r.textContent = i.cssText, e.appendChild(r);
  }
}, Bt = Pt ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let i = "";
  for (const r of t.cssRules) i += r.cssText;
  return Fe(i);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Te, defineProperty: Re, getOwnPropertyDescriptor: De, getOwnPropertyNames: ze, getOwnPropertySymbols: Pe, getPrototypeOf: Le } = Object, U = globalThis, Gt = U.trustedTypes, Oe = Gt ? Gt.emptyScript : "", $t = U.reactiveElementPolyfillSupport, st = (e, t) => e, _t = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? Oe : null;
      break;
    case Object:
    case Array:
      e = e == null ? e : JSON.stringify(e);
  }
  return e;
}, fromAttribute(e, t) {
  let i = e;
  switch (t) {
    case Boolean:
      i = e !== null;
      break;
    case Number:
      i = e === null ? null : Number(e);
      break;
    case Object:
    case Array:
      try {
        i = JSON.parse(e);
      } catch {
        i = null;
      }
  }
  return i;
} }, Ot = (e, t) => !Te(e, t), Vt = { attribute: !0, type: String, converter: _t, reflect: !1, useDefault: !1, hasChanged: Ot };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), U.litPropertyMetadata ?? (U.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let Z = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, i = Vt) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(t, i), !i.noAccessor) {
      const r = Symbol(), s = this.getPropertyDescriptor(t, r, i);
      s !== void 0 && Re(this.prototype, t, s);
    }
  }
  static getPropertyDescriptor(t, i, r) {
    const { get: s, set: n } = De(this.prototype, t) ?? { get() {
      return this[i];
    }, set(o) {
      this[i] = o;
    } };
    return { get: s, set(o) {
      const a = s == null ? void 0 : s.call(this);
      n == null || n.call(this, o), this.requestUpdate(t, a, r);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? Vt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(st("elementProperties"))) return;
    const t = Le(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(st("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(st("properties"))) {
      const i = this.properties, r = [...ze(i), ...Pe(i)];
      for (const s of r) this.createProperty(s, i[s]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const i = litPropertyMetadata.get(t);
      if (i !== void 0) for (const [r, s] of i) this.elementProperties.set(r, s);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [i, r] of this.elementProperties) {
      const s = this._$Eu(i, r);
      s !== void 0 && this._$Eh.set(s, i);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const i = [];
    if (Array.isArray(t)) {
      const r = new Set(t.flat(1 / 0).reverse());
      for (const s of r) i.unshift(Bt(s));
    } else t !== void 0 && i.push(Bt(t));
    return i;
  }
  static _$Eu(t, i) {
    const r = i.attribute;
    return r === !1 ? void 0 : typeof r == "string" ? r : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var t;
    this._$ES = new Promise((i) => this.enableUpdating = i), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (t = this.constructor.l) == null || t.forEach((i) => i(this));
  }
  addController(t) {
    var i;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t), this.renderRoot !== void 0 && this.isConnected && ((i = t.hostConnected) == null || i.call(t));
  }
  removeController(t) {
    var i;
    (i = this._$EO) == null || i.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), i = this.constructor.elementProperties;
    for (const r of i.keys()) this.hasOwnProperty(r) && (t.set(r, this[r]), delete this[r]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Ce(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var t;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$EO) == null || t.forEach((i) => {
      var r;
      return (r = i.hostConnected) == null ? void 0 : r.call(i);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$EO) == null || t.forEach((i) => {
      var r;
      return (r = i.hostDisconnected) == null ? void 0 : r.call(i);
    });
  }
  attributeChangedCallback(t, i, r) {
    this._$AK(t, r);
  }
  _$ET(t, i) {
    var n;
    const r = this.constructor.elementProperties.get(t), s = this.constructor._$Eu(t, r);
    if (s !== void 0 && r.reflect === !0) {
      const o = (((n = r.converter) == null ? void 0 : n.toAttribute) !== void 0 ? r.converter : _t).toAttribute(i, r.type);
      this._$Em = t, o == null ? this.removeAttribute(s) : this.setAttribute(s, o), this._$Em = null;
    }
  }
  _$AK(t, i) {
    var n, o;
    const r = this.constructor, s = r._$Eh.get(t);
    if (s !== void 0 && this._$Em !== s) {
      const a = r.getPropertyOptions(s), c = typeof a.converter == "function" ? { fromAttribute: a.converter } : ((n = a.converter) == null ? void 0 : n.fromAttribute) !== void 0 ? a.converter : _t;
      this._$Em = s;
      const l = c.fromAttribute(i, a.type);
      this[s] = l ?? ((o = this._$Ej) == null ? void 0 : o.get(s)) ?? l, this._$Em = null;
    }
  }
  requestUpdate(t, i, r, s = !1, n) {
    var o;
    if (t !== void 0) {
      const a = this.constructor;
      if (s === !1 && (n = this[t]), r ?? (r = a.getPropertyOptions(t)), !((r.hasChanged ?? Ot)(n, i) || r.useDefault && r.reflect && n === ((o = this._$Ej) == null ? void 0 : o.get(t)) && !this.hasAttribute(a._$Eu(t, r)))) return;
      this.C(t, i, r);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, i, { useDefault: r, reflect: s, wrapped: n }, o) {
    r && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, o ?? i ?? this[t]), n !== !0 || o !== void 0) || (this._$AL.has(t) || (this.hasUpdated || r || (i = void 0), this._$AL.set(t, i)), s === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (i) {
      Promise.reject(i);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var r;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [n, o] of this._$Ep) this[n] = o;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [n, o] of s) {
        const { wrapped: a } = o, c = this[n];
        a !== !0 || this._$AL.has(n) || c === void 0 || this.C(n, void 0, o, c);
      }
    }
    let t = !1;
    const i = this._$AL;
    try {
      t = this.shouldUpdate(i), t ? (this.willUpdate(i), (r = this._$EO) == null || r.forEach((s) => {
        var n;
        return (n = s.hostUpdate) == null ? void 0 : n.call(s);
      }), this.update(i)) : this._$EM();
    } catch (s) {
      throw t = !1, this._$EM(), s;
    }
    t && this._$AE(i);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var i;
    (i = this._$EO) == null || i.forEach((r) => {
      var s;
      return (s = r.hostUpdated) == null ? void 0 : s.call(r);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((i) => this._$ET(i, this[i]))), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
Z.elementStyles = [], Z.shadowRootOptions = { mode: "open" }, Z[st("elementProperties")] = /* @__PURE__ */ new Map(), Z[st("finalized")] = /* @__PURE__ */ new Map(), $t == null || $t({ ReactiveElement: Z }), (U.reactiveElementVersions ?? (U.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const nt = globalThis, jt = (e) => e, bt = nt.trustedTypes, qt = bt ? bt.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, be = "$lit$", I = `lit$${Math.random().toFixed(9).slice(2)}$`, xe = "?" + I, He = `<${xe}>`, q = document, ot = () => q.createComment(""), at = (e) => e === null || typeof e != "object" && typeof e != "function", Ht = Array.isArray, We = (e) => Ht(e) || typeof (e == null ? void 0 : e[Symbol.iterator]) == "function", kt = `[ 	
\f\r]`, et = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Yt = /-->/g, Zt = />/g, G = RegExp(`>|${kt}(?:([^\\s"'>=/]+)(${kt}*=${kt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Kt = /'/g, Qt = /"/g, we = /^(?:script|style|textarea|title)$/i, ve = (e) => (t, ...i) => ({ _$litType$: e, strings: t, values: i }), u = ve(1), w = ve(2), X = Symbol.for("lit-noChange"), p = Symbol.for("lit-nothing"), Xt = /* @__PURE__ */ new WeakMap(), V = q.createTreeWalker(q, 129);
function $e(e, t) {
  if (!Ht(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return qt !== void 0 ? qt.createHTML(t) : t;
}
const Ie = (e, t) => {
  const i = e.length - 1, r = [];
  let s, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = et;
  for (let a = 0; a < i; a++) {
    const c = e[a];
    let l, h, d = -1, f = 0;
    for (; f < c.length && (o.lastIndex = f, h = o.exec(c), h !== null); ) f = o.lastIndex, o === et ? h[1] === "!--" ? o = Yt : h[1] !== void 0 ? o = Zt : h[2] !== void 0 ? (we.test(h[2]) && (s = RegExp("</" + h[2], "g")), o = G) : h[3] !== void 0 && (o = G) : o === G ? h[0] === ">" ? (o = s ?? et, d = -1) : h[1] === void 0 ? d = -2 : (d = o.lastIndex - h[2].length, l = h[1], o = h[3] === void 0 ? G : h[3] === '"' ? Qt : Kt) : o === Qt || o === Kt ? o = G : o === Yt || o === Zt ? o = et : (o = G, s = void 0);
    const y = o === G && e[a + 1].startsWith("/>") ? " " : "";
    n += o === et ? c + He : d >= 0 ? (r.push(l), c.slice(0, d) + be + c.slice(d) + I + y) : c + I + (d === -2 ? a : y);
  }
  return [$e(e, n + (e[i] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
};
class ct {
  constructor({ strings: t, _$litType$: i }, r) {
    let s;
    this.parts = [];
    let n = 0, o = 0;
    const a = t.length - 1, c = this.parts, [l, h] = Ie(t, i);
    if (this.el = ct.createElement(l, r), V.currentNode = this.el.content, i === 2 || i === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (s = V.nextNode()) !== null && c.length < a; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const d of s.getAttributeNames()) if (d.endsWith(be)) {
          const f = h[o++], y = s.getAttribute(d).split(I), _ = /([.?@])?(.*)/.exec(f);
          c.push({ type: 1, index: n, name: _[2], strings: y, ctor: _[1] === "." ? Be : _[1] === "?" ? Ge : _[1] === "@" ? Ve : wt }), s.removeAttribute(d);
        } else d.startsWith(I) && (c.push({ type: 6, index: n }), s.removeAttribute(d));
        if (we.test(s.tagName)) {
          const d = s.textContent.split(I), f = d.length - 1;
          if (f > 0) {
            s.textContent = bt ? bt.emptyScript : "";
            for (let y = 0; y < f; y++) s.append(d[y], ot()), V.nextNode(), c.push({ type: 2, index: ++n });
            s.append(d[f], ot());
          }
        }
      } else if (s.nodeType === 8) if (s.data === xe) c.push({ type: 2, index: n });
      else {
        let d = -1;
        for (; (d = s.data.indexOf(I, d + 1)) !== -1; ) c.push({ type: 7, index: n }), d += I.length - 1;
      }
      n++;
    }
  }
  static createElement(t, i) {
    const r = q.createElement("template");
    return r.innerHTML = t, r;
  }
}
function J(e, t, i = e, r) {
  var o, a;
  if (t === X) return t;
  let s = r !== void 0 ? (o = i._$Co) == null ? void 0 : o[r] : i._$Cl;
  const n = at(t) ? void 0 : t._$litDirective$;
  return (s == null ? void 0 : s.constructor) !== n && ((a = s == null ? void 0 : s._$AO) == null || a.call(s, !1), n === void 0 ? s = void 0 : (s = new n(e), s._$AT(e, i, r)), r !== void 0 ? (i._$Co ?? (i._$Co = []))[r] = s : i._$Cl = s), s !== void 0 && (t = J(e, s._$AS(e, t.values), s, r)), t;
}
class Ue {
  constructor(t, i) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = i;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: i }, parts: r } = this._$AD, s = ((t == null ? void 0 : t.creationScope) ?? q).importNode(i, !0);
    V.currentNode = s;
    let n = V.nextNode(), o = 0, a = 0, c = r[0];
    for (; c !== void 0; ) {
      if (o === c.index) {
        let l;
        c.type === 2 ? l = new lt(n, n.nextSibling, this, t) : c.type === 1 ? l = new c.ctor(n, c.name, c.strings, this, t) : c.type === 6 && (l = new je(n, this, t)), this._$AV.push(l), c = r[++a];
      }
      o !== (c == null ? void 0 : c.index) && (n = V.nextNode(), o++);
    }
    return V.currentNode = q, s;
  }
  p(t) {
    let i = 0;
    for (const r of this._$AV) r !== void 0 && (r.strings !== void 0 ? (r._$AI(t, r, i), i += r.strings.length - 2) : r._$AI(t[i])), i++;
  }
}
class lt {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, i, r, s) {
    this.type = 2, this._$AH = p, this._$AN = void 0, this._$AA = t, this._$AB = i, this._$AM = r, this.options = s, this._$Cv = (s == null ? void 0 : s.isConnected) ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const i = this._$AM;
    return i !== void 0 && (t == null ? void 0 : t.nodeType) === 11 && (t = i.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, i = this) {
    t = J(this, t, i), at(t) ? t === p || t == null || t === "" ? (this._$AH !== p && this._$AR(), this._$AH = p) : t !== this._$AH && t !== X && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : We(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== p && at(this._$AH) ? this._$AA.nextSibling.data = t : this.T(q.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var n;
    const { values: i, _$litType$: r } = t, s = typeof r == "number" ? this._$AC(t) : (r.el === void 0 && (r.el = ct.createElement($e(r.h, r.h[0]), this.options)), r);
    if (((n = this._$AH) == null ? void 0 : n._$AD) === s) this._$AH.p(i);
    else {
      const o = new Ue(s, this), a = o.u(this.options);
      o.p(i), this.T(a), this._$AH = o;
    }
  }
  _$AC(t) {
    let i = Xt.get(t.strings);
    return i === void 0 && Xt.set(t.strings, i = new ct(t)), i;
  }
  k(t) {
    Ht(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let r, s = 0;
    for (const n of t) s === i.length ? i.push(r = new lt(this.O(ot()), this.O(ot()), this, this.options)) : r = i[s], r._$AI(n), s++;
    s < i.length && (this._$AR(r && r._$AB.nextSibling, s), i.length = s);
  }
  _$AR(t = this._$AA.nextSibling, i) {
    var r;
    for ((r = this._$AP) == null ? void 0 : r.call(this, !1, !0, i); t !== this._$AB; ) {
      const s = jt(t).nextSibling;
      jt(t).remove(), t = s;
    }
  }
  setConnected(t) {
    var i;
    this._$AM === void 0 && (this._$Cv = t, (i = this._$AP) == null || i.call(this, t));
  }
}
let wt = class {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, i, r, s, n) {
    this.type = 1, this._$AH = p, this._$AN = void 0, this.element = t, this.name = i, this._$AM = s, this.options = n, r.length > 2 || r[0] !== "" || r[1] !== "" ? (this._$AH = Array(r.length - 1).fill(new String()), this.strings = r) : this._$AH = p;
  }
  _$AI(t, i = this, r, s) {
    const n = this.strings;
    let o = !1;
    if (n === void 0) t = J(this, t, i, 0), o = !at(t) || t !== this._$AH && t !== X, o && (this._$AH = t);
    else {
      const a = t;
      let c, l;
      for (t = n[0], c = 0; c < n.length - 1; c++) l = J(this, a[r + c], i, c), l === X && (l = this._$AH[c]), o || (o = !at(l) || l !== this._$AH[c]), l === p ? t = p : t !== p && (t += (l ?? "") + n[c + 1]), this._$AH[c] = l;
    }
    o && !s && this.j(t);
  }
  j(t) {
    t === p ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
};
class Be extends wt {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === p ? void 0 : t;
  }
}
class Ge extends wt {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== p);
  }
}
class Ve extends wt {
  constructor(t, i, r, s, n) {
    super(t, i, r, s, n), this.type = 5;
  }
  _$AI(t, i = this) {
    if ((t = J(this, t, i, 0) ?? p) === X) return;
    const r = this._$AH, s = t === p && r !== p || t.capture !== r.capture || t.once !== r.once || t.passive !== r.passive, n = t !== p && (r === p || s);
    s && this.element.removeEventListener(this.name, this, r), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var i;
    typeof this._$AH == "function" ? this._$AH.call(((i = this.options) == null ? void 0 : i.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class je {
  constructor(t, i, r) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = r;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    J(this, t);
  }
}
const St = nt.litHtmlPolyfillSupport;
St == null || St(ct, lt), (nt.litHtmlVersions ?? (nt.litHtmlVersions = [])).push("3.3.3");
const qe = (e, t, i) => {
  const r = (i == null ? void 0 : i.renderBefore) ?? t;
  let s = r._$litPart$;
  if (s === void 0) {
    const n = (i == null ? void 0 : i.renderBefore) ?? null;
    r._$litPart$ = s = new lt(t.insertBefore(ot(), n), n, void 0, i ?? {});
  }
  return s._$AI(e), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const j = globalThis;
class K extends Z {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var i;
    const t = super.createRenderRoot();
    return (i = this.renderOptions).renderBefore ?? (i.renderBefore = t.firstChild), t;
  }
  update(t) {
    const i = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = qe(i, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var t;
    super.connectedCallback(), (t = this._$Do) == null || t.setConnected(!0);
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), (t = this._$Do) == null || t.setConnected(!1);
  }
  render() {
    return X;
  }
}
var ge;
K._$litElement$ = !0, K.finalized = !0, (ge = j.litElementHydrateSupport) == null || ge.call(j, { LitElement: K });
const Mt = j.litElementPolyfillSupport;
Mt == null || Mt({ LitElement: K });
(j.litElementVersions ?? (j.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ke = (e) => (t, i) => {
  i !== void 0 ? i.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ye = { attribute: !0, type: String, converter: _t, reflect: !1, hasChanged: Ot }, Ze = (e = Ye, t, i) => {
  const { kind: r, metadata: s } = i;
  let n = globalThis.litPropertyMetadata.get(s);
  if (n === void 0 && globalThis.litPropertyMetadata.set(s, n = /* @__PURE__ */ new Map()), r === "setter" && ((e = Object.create(e)).wrapped = !0), n.set(i.name, e), r === "accessor") {
    const { name: o } = i;
    return { set(a) {
      const c = t.get.call(this);
      t.set.call(this, a), this.requestUpdate(o, c, e, !0, a);
    }, init(a) {
      return a !== void 0 && this.C(o, void 0, e, a), a;
    } };
  }
  if (r === "setter") {
    const { name: o } = i;
    return function(a) {
      const c = this[o];
      t.call(this, a), this.requestUpdate(o, c, e, !0, a);
    };
  }
  throw Error("Unsupported decorator location: " + r);
};
function Wt(e) {
  return (t, i) => typeof i == "object" ? Ze(e, t, i) : ((r, s, n) => {
    const o = s.hasOwnProperty(n);
    return s.constructor.createProperty(n, r), o ? Object.getOwnPropertyDescriptor(s, n) : void 0;
  })(e, t, i);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function L(e) {
  return Wt({ ...e, state: !0, attribute: !1 });
}
const zt = {
  red: "#F44336",
  pink: "#E91E63",
  purple: "#9C27B0",
  "deep-purple": "#673AB7",
  indigo: "#3F51B5",
  blue: "#2196F3",
  "light-blue": "#03A9F4",
  cyan: "#00BCD4",
  teal: "#009688",
  green: "#4CAF50",
  "light-green": "#8BC34A",
  lime: "#CDDC39",
  yellow: "#FFEB3B",
  amber: "#FFC107",
  orange: "#FF9800",
  "deep-orange": "#FF5722",
  brown: "#795548",
  grey: "#9E9E9E",
  "blue-grey": "#607D8B"
}, Jt = Object.keys(zt);
function D(e) {
  if (e)
    return e === "primary" ? "var(--primary-color)" : e === "accent" ? "var(--accent-color)" : zt[e] ? `var(--${e}-color, ${zt[e]})` : e;
}
const Q = {
  temperature: {
    icon: "mdi:thermometer",
    color: "orange",
    graph: "line",
    unit: "°C",
    aggregate: "mean",
    trend: "neutral",
    precision: 1
  },
  feels_like: {
    icon: "mdi:thermometer-lines",
    color: "deep-orange",
    graph: "line",
    unit: "°C",
    aggregate: "mean",
    trend: "neutral",
    precision: 1
  },
  wind: {
    icon: "mdi:weather-windy",
    color: "teal",
    graph: "line",
    unit: "km/h",
    aggregate: "mean",
    trend: "neutral",
    precision: 0
  },
  precipitation: {
    icon: "mdi:weather-pouring",
    color: "blue",
    graph: "bar",
    unit: "mm",
    aggregate: "sum",
    trend: "neutral",
    precision: 1
  },
  humidity: {
    icon: "mdi:water-percent",
    color: "light-blue",
    graph: "progress",
    unit: "%",
    aggregate: "mean",
    trend: "neutral",
    precision: 0
  },
  pressure: {
    icon: "mdi:gauge",
    color: "blue-grey",
    graph: "line",
    unit: "hPa",
    aggregate: "mean",
    trend: "neutral",
    precision: 0
  },
  uv: {
    icon: "mdi:weather-sunny-alert",
    color: "amber",
    graph: "progress",
    aggregate: "max",
    trend: "neutral",
    precision: 0,
    goalType: "atmost"
  },
  cloud: {
    icon: "mdi:weather-cloudy",
    color: "blue-grey",
    graph: "progress",
    unit: "%",
    aggregate: "mean",
    trend: "neutral",
    precision: 0,
    goalType: "atmost"
  },
  visibility: {
    icon: "mdi:eye",
    color: "cyan",
    graph: "line",
    unit: "km",
    aggregate: "mean",
    trend: "up_good",
    precision: 1
  },
  air_quality: {
    icon: "mdi:air-filter",
    color: "green",
    graph: "none",
    aggregate: "mean",
    trend: "down_good",
    precision: 0,
    goalType: "atmost"
  },
  sun: {
    icon: "mdi:weather-sunset",
    color: "amber",
    graph: "none",
    aggregate: "last",
    trend: "none",
    precision: 0
  },
  moon: {
    icon: "mdi:moon-waning-crescent",
    color: "blue-grey",
    graph: "none",
    aggregate: "last",
    trend: "none",
    precision: 0
  },
  tides: {
    icon: "mdi:waves",
    color: "light-blue",
    graph: "none",
    unit: "m",
    aggregate: "mean",
    trend: "neutral",
    precision: 1
  },
  pollen: {
    icon: "mdi:flower-pollen",
    color: "green",
    graph: "progress",
    aggregate: "max",
    trend: "down_good",
    precision: 0,
    goalType: "atmost"
  },
  radar: {
    icon: "mdi:radar",
    color: "blue",
    graph: "none",
    aggregate: "last",
    trend: "none",
    precision: 0
  },
  sky: {
    icon: "mdi:weather-partly-cloudy",
    color: "blue",
    graph: "none",
    aggregate: "mean",
    trend: "neutral",
    precision: 1
  },
  summary: {
    icon: "mdi:creation",
    color: "deep-purple",
    graph: "none",
    aggregate: "mean",
    trend: "none",
    precision: 0
  },
  custom: {
    icon: "mdi:chart-line",
    color: "primary",
    graph: "line",
    aggregate: "mean",
    trend: "neutral"
  }
}, te = ["teal", "amber", "deep-orange", "purple", "pink"], ut = ["teal", "orange", "pink", "cyan", "lime"], Ke = {
  "clear-night": "mdi:weather-night",
  cloudy: "mdi:weather-cloudy",
  fog: "mdi:weather-fog",
  hail: "mdi:weather-hail",
  lightning: "mdi:weather-lightning",
  "lightning-rainy": "mdi:weather-lightning-rainy",
  partlycloudy: "mdi:weather-partly-cloudy",
  pouring: "mdi:weather-pouring",
  rainy: "mdi:weather-rainy",
  snowy: "mdi:weather-snowy",
  "snowy-rainy": "mdi:weather-snowy-rainy",
  sunny: "mdi:weather-sunny",
  windy: "mdi:weather-windy",
  "windy-variant": "mdi:weather-windy-variant",
  exceptional: "mdi:weather-cloudy-alert"
};
function ee(e, t = !0) {
  if (!e) return t ? "mdi:weather-partly-cloudy" : "mdi:weather-night";
  if (!t) {
    if (e === "sunny") return "mdi:weather-night";
    if (e === "partlycloudy") return "mdi:weather-night-partly-cloudy";
  }
  return Ke[e] ?? "mdi:weather-partly-cloudy";
}
function ie(e) {
  const t = parseInt(e.slice(1), 16);
  return [t >> 16 & 255, t >> 8 & 255, t & 255];
}
function T(e, t, i) {
  const [r, s, n] = ie(e), [o, a, c] = ie(t), l = Math.max(0, Math.min(i, 1)), h = Math.round(r + (o - r) * l), d = Math.round(s + (a - s) * l), f = Math.round(n + (c - n) * l), y = (_) => _.toString(16).padStart(2, "0");
  return `#${y(h)}${y(d)}${y(f)}`;
}
function mt(e, t, i) {
  return e.map((r, s) => T(r, t[s], i));
}
const re = ["#050a20", "#101c40", "#2a4270"], se = ["#292a5e", "#8c4a7c", "#ff9d5e"], ne = ["#3572bf", "#7fb2e2", "#ffd994".slice(0, 7)], oe = ["#2f80dc", "#79b7ee", "#d4edff"], Qe = ["#64758a", "#8fa1b1", "#c4ced8"], Xe = ["#3d4857", "#5c6976", "#8a96a3"], Je = ["#0e131d", "#1e2938", "#344254"];
function ti(e) {
  const t = e.condition ?? (e.isDay ? "partlycloudy" : "clear-night"), i = ["pouring", "lightning", "lightning-rainy", "hail"].includes(t), r = ["rainy", "snowy", "snowy-rainy"].includes(t), s = ["cloudy", "fog", "exceptional"].includes(t) || i || r, n = i ? 0.85 : r ? 0.68 : s ? 0.55 : t === "partlycloudy" ? 0.14 : 0, o = e.elevation ?? (e.isDay ? 40 : -20);
  let a;
  o <= -8 ? a = re : o <= 2 ? a = mt(re, se, (o + 8) / 10) : o <= 14 ? a = mt(se, ne, (o - 2) / 12) : o <= 35 ? a = mt(ne, oe, (o - 14) / 21) : a = oe;
  const c = o <= -4, h = mt(a, c ? Je : i ? Xe : Qe, n), d = Math.max(0, 1 - Math.abs(o - 1) / 13) * (1 - n * 0.8), f = o <= 2 ? "#ff7d4a" : T("#ff9d5c", "#ffd28a", Math.min((o - 2) / 12, 1)), y = T(h[2], h[1], 0.45), _ = T(T(h[2], "#0a0f18", c ? 0.62 : 0.34), h[1], 0.12), $ = T(h[2], "#0a0f18", c ? 0.84 : 0.58), x = T(h[2], "#060a12", c ? 0.92 : 0.72), m = c ? T("#93a3c0", "#4f5c74", n) : T("#ffffff", "#a9b6c4", n), b = d > 0.15 ? T(m, f, d * 0.45) : m, g = T(b, c ? "#232e44" : "#7e91a6", 0.4), S = T(b, "#ffffff", c ? 0.22 : 0.8), M = t === "sunny" || t === "clear-night" ? 0 : t === "partlycloudy" || t === "windy" || t === "windy-variant" ? 2 : i || r ? 4 : 3;
  return {
    sky: h,
    ridgeFar: y,
    hillBack: _,
    hillFront: $,
    tree: x,
    cloudFill: b,
    cloudShade: g,
    cloudLight: S,
    cloudOpacity: c ? 0.75 : 0.95,
    isNight: c,
    sunY: o <= 0 ? 150 + Math.min(-o, 6) * 2 : 150 - Math.min(o, 55) / 55 * 112,
    // the low sun looms larger
    sunR: 15 + Math.max(0, 14 - Math.min(Math.max(o, 0), 14)) * 0.45,
    showSun: !c && o > -3 && M < 3,
    showRays: n < 0.3 && o > 10,
    sunColor: o <= 2 ? "#ff8a4b" : T("#ffb347", "#ffdf5e", Math.min((o - 2) / 13, 1)),
    horizon: d,
    horizonColor: f,
    rim: d * 0.85,
    showMoon: c && M < 3,
    clouds: M,
    rain: t === "pouring" || t === "lightning-rainy" ? 2 : t === "rainy" || t === "snowy-rainy" || t === "hail" ? 1 : 0,
    snow: t === "snowy" || t === "snowy-rainy" || t === "hail",
    lightning: t === "lightning" || t === "lightning-rainy",
    fog: t === "fog",
    stars: c && n < 0.4,
    windy: t === "windy" || t === "windy-variant" || e.wind > 0.55
  };
}
function ei(e, t) {
  return w`<g opacity=${t}>
    <g fill=${e.cloudShade} transform="translate(1 3.5)">
      <ellipse cx="0" cy="0" rx="27" ry="16"/>
      <ellipse cx="21" cy="4" rx="22" ry="13"/>
      <ellipse cx="-21" cy="5" rx="20" ry="12"/>
      <ellipse cx="2" cy="9" rx="31" ry="11"/>
    </g>
    <g fill=${e.cloudFill}>
      <ellipse cx="0" cy="0" rx="27" ry="16"/>
      <ellipse cx="21" cy="4" rx="22" ry="13"/>
      <ellipse cx="-21" cy="5" rx="20" ry="12"/>
      <ellipse cx="2" cy="9" rx="31" ry="11"/>
    </g>
    <ellipse cx="-5" cy="-8" rx="15" ry="7.5" fill=${e.cloudLight} opacity="0.75"/>
    <ellipse cx="17" cy="-3" rx="10" ry="5" fill=${e.cloudLight} opacity="0.5"/>
  </g>`;
}
function ii(e, t, i, r, s, n, o, a = !1) {
  return w`<g transform="translate(0 ${i})">
    <g class="cloud" style="animation-duration:${s}s;animation-delay:${n}s"
       filter=${a ? "url(#wc-blur-far)" : p}>
      <g class="cloudbob" style="animation-duration:${o}s">
        <g transform="scale(${r})">${ei(e, t)}</g>
      </g>
    </g>
  </g>`;
}
const ri = "M 0 152 Q 60 134 120 146 T 240 142 Q 272 138 300 145", ae = "M 0 162 Q 40 138 85 154 T 170 150 Q 215 142 250 156 T 300 152", ce = "M 0 176 Q 55 158 110 172 T 220 170 Q 260 164 300 174", At = (e) => `${e} L 300 190 L 0 190 Z`, si = [
  // x, ground y, scale
  [52, 172, 1],
  [64, 174, 0.75],
  [226, 168, 1.1],
  [243, 171, 0.8]
];
function ni(e) {
  const t = ti(e), i = 1 + e.wind * 1.6, r = 3 + e.wind * 9, s = (2.6 / (0.35 + e.wind)).toFixed(2), n = 208, o = Array.from({ length: 12 }, ($, x) => {
    const m = x / 12 * Math.PI * 2, b = t.sunR + 6, g = t.sunR + 15;
    return w`<line x1=${Math.cos(m) * b} y1=${Math.sin(m) * b}
      x2=${Math.cos(m) * g} y2=${Math.sin(m) * g} stroke="#ffe08a"
      stroke-width="3" stroke-linecap="round"/>`;
  }), a = t.stars ? Array.from({ length: 30 }, ($, x) => {
    const m = 10 + x * 61 % 280, b = 8 + x * 37 % 96, g = `${(2.2 + x % 5 * 0.8).toFixed(1)}s`, S = `${(x % 9 * 0.45).toFixed(2)}s`;
    if (x % 6 === 0) {
      const M = 2.4 + x % 3;
      return w`<path class="star" d="M ${-M} 0 H ${M} M 0 ${-M} V ${M}"
            transform="translate(${m} ${b})" stroke="#fff" stroke-width="1"
            stroke-linecap="round" style="animation-duration:${g};animation-delay:${S}"/>`;
    }
    return w`<circle class="star" cx=${m} cy=${b} r=${0.6 + x * 13 % 10 / 9}
          fill="#fff" style="animation-duration:${g};animation-delay:${S}"/>`;
  }) : [], c = ($, x, m, b) => Array.from({ length: $ }, (g, S) => {
    const M = 14 + S * 53 % 272, v = 62 + S * 29 % 96, A = 9 + S % 3 * 3;
    return w`<line class=${x} x1=${M} y1=${v} x2=${M - r} y2=${v + A}
        stroke="#cfe6ff" stroke-width=${m} stroke-linecap="round" opacity=${b}
        style="animation-delay:${S % 7 * 0.09}s"/>`;
  }), l = t.rain > 0 ? [
    ...c(t.rain === 2 ? 30 : 16, "rain-back", 1.1, 0.4),
    ...c(t.rain === 2 ? 34 : 18, "rain", 1.7, 0.85)
  ] : [], h = t.rain === 2 ? Array.from({ length: 7 }, ($, x) => {
    const m = 28 + x * 41 % 246;
    return w`<ellipse class="splash" cx=${m} cy="181" rx="5" ry="1.6"
            fill="none" stroke="#cfe6ff" stroke-width="1"
            style="animation-delay:${x % 5 * 0.24}s"/>`;
  }) : [], d = t.snow ? Array.from({ length: 32 }, ($, x) => {
    const m = 12 + x * 47 % 276, b = 56 + x * 31 % 104;
    return w`<circle class=${x % 2 ? "snow" : "snow2"} cx=${m} cy=${b}
          r=${1.3 + x % 3 * 0.7} fill="#fff" opacity="0.9"
          style="animation-delay:${x % 8 * 0.4}s;animation-duration:${3.2 + x % 5 * 0.8}s"/>`;
  }) : [], y = [
    { y: 30, s: 0.5, dur: 34, blur: !0, op: 0.55 },
    { y: 46, s: 0.9, dur: 22, blur: !1, op: 0.85 },
    { y: 64, s: 1.25, dur: 15, blur: !1, op: 1 },
    { y: 38, s: 0.7, dur: 27, blur: !1, op: 0.7 }
  ].slice(0, t.clouds).map(
    ($, x) => ii(t, t.cloudOpacity * $.op, $.y, $.s, $.dur / i, -x * 5.5, 3.4 + x * 0.9, $.blur)
  ), _ = !t.isNight && t.clouds <= 2 && !t.rain && !t.snow ? w`<g class="birds">
          <path d="M -7 0 Q -3.5 -4.5 0 0 Q 3.5 -4.5 7 0" transform="translate(0 34)"/>
          <path d="M -5 0 Q -2.5 -3.5 0 0 Q 2.5 -3.5 5 0" transform="translate(16 42)"/>
        </g>` : p;
  return u`<svg
    class="skyscene"
    viewBox="0 0 300 190"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="wc-sky-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color=${t.sky[0]} />
        <stop offset="50%" stop-color=${t.sky[1]} />
        <stop offset="82%" stop-color=${t.sky[2]} />
      </linearGradient>
      <radialGradient id="wc-sun-glow">
        <stop offset="0%" stop-color="#fff3c4" stop-opacity="0.95" />
        <stop offset="55%" stop-color=${t.sunColor} stop-opacity="0.4" />
        <stop offset="100%" stop-color=${t.sunColor} stop-opacity="0" />
      </radialGradient>
      <radialGradient id="wc-sun-disc">
        <stop offset="0%" stop-color="#fffbe6" />
        <stop offset="55%" stop-color=${T(t.sunColor, "#ffffff", 0.35)} />
        <stop offset="100%" stop-color=${t.sunColor} />
      </radialGradient>
      <radialGradient id="wc-horizon">
        <stop offset="0%" stop-color=${t.horizonColor} stop-opacity="0.9" />
        <stop offset="55%" stop-color=${t.horizonColor} stop-opacity="0.35" />
        <stop offset="100%" stop-color=${t.horizonColor} stop-opacity="0" />
      </radialGradient>
      <radialGradient id="wc-moon-halo">
        <stop offset="0%" stop-color="#e8edf8" stop-opacity="0.55" />
        <stop offset="100%" stop-color="#e8edf8" stop-opacity="0" />
      </radialGradient>
      <radialGradient id="wc-warn" cx="50%" cy="50%" r="72%">
        <stop offset="55%" stop-color=${e.glowColor} stop-opacity="0" />
        <stop offset="100%" stop-color=${e.glowColor} stop-opacity="0.55" />
      </radialGradient>
      <filter id="wc-blur-far" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="1.6" />
      </filter>
      <filter id="wc-blur-soft" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="3" />
      </filter>
      <filter id="wc-bolt-glow" x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="3.5" />
      </filter>
    </defs>
    <style>
      .skyscene .cloud { animation-name: wc-drift; animation-timing-function: linear; animation-iteration-count: infinite; }
      @keyframes wc-drift { from { transform: translateX(-85px); } to { transform: translateX(385px); } }
      .skyscene .cloudbob { animation: wc-bob ease-in-out infinite alternate; }
      @keyframes wc-bob { from { transform: translateY(-2.4px); } to { transform: translateY(2.4px); } }
      .skyscene .sunrays { animation: wc-spin 70s linear infinite; }
      @keyframes wc-spin { to { transform: rotate(360deg); } }
      .skyscene .raypulse { animation: wc-raypulse 4.2s ease-in-out infinite; }
      @keyframes wc-raypulse { 0%,100% { transform: scale(1); opacity: 0.85; } 50% { transform: scale(1.08); opacity: 1; } }
      .skyscene .sunglow { animation: wc-breathe 5s ease-in-out infinite; }
      @keyframes wc-breathe { 0%,100% { transform: scale(1); opacity: 0.9; } 50% { transform: scale(1.15); opacity: 1; } }
      .skyscene .moonhalo { animation: wc-breathe 6.5s ease-in-out infinite; }
      .skyscene .horizonpulse { animation: wc-horizonpulse 7s ease-in-out infinite; }
      @keyframes wc-horizonpulse { 0%,100% { opacity: 0.85; } 50% { opacity: 1; } }
      .skyscene .star { animation-name: wc-twinkle; animation-timing-function: ease-in-out; animation-iteration-count: infinite; }
      @keyframes wc-twinkle { 0%,100% { opacity: 0.15; } 50% { opacity: 1; } }
      .skyscene .shooting { animation: wc-shoot linear infinite; opacity: 0; }
      @keyframes wc-shoot { 0%,92% { opacity: 0; transform: translate(0,0); } 93% { opacity: 1; } 97% { opacity: 0; transform: translate(-95px,46px); } 100% { opacity: 0; } }
      .skyscene .rain { animation: wc-rain 0.55s linear infinite; }
      .skyscene .rain-back { animation: wc-rain 0.8s linear infinite; }
      @keyframes wc-rain { from { transform: translate(4px,-14px); opacity: 0; } 25% { opacity: 1; } to { transform: translate(-4px,18px); opacity: 0; } }
      .skyscene .splash { animation: wc-splash 1.1s ease-out infinite; transform-origin: center; transform-box: fill-box; }
      @keyframes wc-splash { 0% { transform: scale(0.2); opacity: 0.9; } 70% { transform: scale(1.4); opacity: 0; } 100% { opacity: 0; } }
      .skyscene .snow { animation-name: wc-snow; animation-timing-function: linear; animation-iteration-count: infinite; }
      .skyscene .snow2 { animation-name: wc-snow2; animation-timing-function: linear; animation-iteration-count: infinite; }
      @keyframes wc-snow { 0% { transform: translate(0,-14px); opacity: 0; } 15% { opacity: 1; } 100% { transform: translate(12px,26px); opacity: 0; } }
      @keyframes wc-snow2 { 0% { transform: translate(0,-14px); opacity: 0; } 15% { opacity: 1; } 100% { transform: translate(-10px,26px); opacity: 0; } }
      .skyscene .bolt { animation: wc-bolt 4.5s steps(1) infinite; opacity: 0; }
      @keyframes wc-bolt { 0%,100% { opacity: 0; } 3% { opacity: 1; } 5% { opacity: 0.25; } 6.5% { opacity: 0.95; } 9% { opacity: 0; } }
      .skyscene .flash { animation: wc-flash 4.5s steps(1) infinite; opacity: 0; }
      @keyframes wc-flash { 0%,100% { opacity: 0; } 3% { opacity: 0.32; } 5% { opacity: 0.06; } 6.5% { opacity: 0.26; } 9% { opacity: 0; } }
      .skyscene .fogband { animation: wc-fog 8s ease-in-out infinite alternate; }
      @keyframes wc-fog { from { transform: translateX(-10px); } to { transform: translateX(14px); } }
      .skyscene .gust { stroke-dasharray: 34 90; animation: wc-gust 2.8s linear infinite; }
      @keyframes wc-gust { from { stroke-dashoffset: 124; } to { stroke-dashoffset: 0; } }
      .skyscene .birds { fill: none; stroke: rgba(30,40,55,0.65); stroke-width: 1.4; stroke-linecap: round; animation: wc-birds 36s linear infinite; }
      @keyframes wc-birds { from { transform: translateX(-24px); } to { transform: translateX(330px); } }
      .skyscene .sway { animation: wc-sway ease-in-out infinite alternate; transform-box: fill-box; transform-origin: 50% 100%; }
      @keyframes wc-sway { from { transform: rotate(-1.8deg); } to { transform: rotate(1.8deg); } }
      .skyscene .warnglow { animation: wc-warnpulse 2.4s ease-in-out infinite; }
      @keyframes wc-warnpulse { 0%,100% { opacity: 0.55; } 50% { opacity: 1; } }
      .skyscene .sunglow, .skyscene .raypulse, .skyscene .moonhalo { transform-origin: center; transform-box: fill-box; }
    </style>

    <rect x="0" y="0" width="300" height="190" fill="url(#wc-sky-grad)" />

    ${a}
    ${t.stars ? w`
        <line class="shooting" x1="238" y1="26" x2="252" y2="19"
          stroke="#fff" stroke-width="1.6" stroke-linecap="round"
          style="animation-duration:13s"/>
        <line class="shooting" x1="96" y1="18" x2="109" y2="12"
          stroke="#fff" stroke-width="1.3" stroke-linecap="round"
          style="animation-duration:19s;animation-delay:-8s"/>` : p}

    ${t.horizon > 0.03 ? w`<ellipse class="horizonpulse" cx=${n} cy="152" rx="205" ry="64"
          fill="url(#wc-horizon)" opacity=${t.horizon}/>` : p}

    ${t.showSun ? w`<g transform="translate(${n} ${t.sunY})">
          <g class="sunglow"><circle r=${t.sunR * 2.9} fill="url(#wc-sun-glow)"/></g>
          ${t.showRays ? w`<g class="raypulse"><g class="sunrays">${o}</g></g>` : p}
          <circle r=${t.sunR + 6} fill=${t.sunColor} opacity="0.3" filter="url(#wc-blur-soft)"/>
          <circle r=${t.sunR} fill="url(#wc-sun-disc)"/>
        </g>` : p}
    ${t.showMoon ? w`<g transform="translate(230 42)">
          <g class="moonhalo"><circle r="32" fill="url(#wc-moon-halo)"/></g>
          <circle r="15" fill="#eef1f7"/>
          <circle cx="-6.5" cy="-4" r="13.5" fill=${t.sky[0]}/>
          <circle cx="4" cy="3" r="2.2" fill="#c9d2e4" opacity="0.8"/>
          <circle cx="8.5" cy="-3" r="1.4" fill="#c9d2e4" opacity="0.7"/>
        </g>` : p}

    ${_}
    ${y}

    ${t.windy ? w`<g fill="none" stroke="rgba(255,255,255,0.55)" stroke-width="1.6" stroke-linecap="round">
          <path class="gust" d="M 20 58 q 40 -12 86 -2 q 30 6 52 -4"/>
          <path class="gust" style="animation-delay:-1.2s" d="M 60 96 q 46 -10 92 0 q 26 5 48 -5"/>
        </g>` : p}

    <!-- layered landscape with atmospheric haze; the crests catch golden light -->
    <path d=${At(ri)} fill=${t.ridgeFar}/>
    <path d=${At(ae)} fill=${t.hillBack}/>
    ${t.rim > 0.05 ? w`<path d=${ae} fill="none" stroke=${t.horizonColor}
          stroke-width="1.6" opacity=${t.rim} stroke-linecap="round"/>` : p}
    <path d=${At(ce)} fill=${t.hillFront}/>
    ${t.rim > 0.05 ? w`<path d=${ce} fill="none" stroke=${t.horizonColor}
          stroke-width="1.2" opacity=${t.rim * 0.6} stroke-linecap="round"/>` : p}
    ${si.map(
    ([$, x, m], b) => w`<g transform="translate(${$} ${x})">
        <g class="sway" style="animation-duration:${s}s;animation-delay:${-b * 0.7}s">
          <g transform="scale(${m})" fill=${t.tree}>
            <polygon points="0,-16 6,-4 -6,-4"/>
            <polygon points="0,-10 7.5,3 -7.5,3"/>
            <rect x="-1.2" y="3" width="2.4" height="4" rx="1"/>
          </g>
        </g>
      </g>`
  )}
    ${t.horizon > 0.03 ? w`<ellipse cx=${n} cy="156" rx="150" ry="26"
          fill="url(#wc-horizon)" opacity=${t.horizon * 0.45}/>` : p}

    ${t.fog ? w`<g fill="rgba(255,255,255,0.5)">
          <rect class="fogband" x="-24" y="112" width="348" height="11" rx="5.5"/>
          <rect class="fogband" style="animation-delay:-2.5s" x="-24" y="134" width="348" height="13" rx="6.5" opacity="0.85"/>
          <rect class="fogband" style="animation-delay:-5s" x="-24" y="158" width="348" height="16" rx="8" opacity="0.7"/>
        </g>` : p}

    ${l}
    ${h}
    ${d}

    ${t.lightning ? w`
        <rect class="flash" x="0" y="0" width="300" height="190" fill="#eaf2ff"/>
        <g class="bolt">
          <polygon points="152,64 139,112 153,112 141,156 178,100 159,100 170,64"
            fill="#fff1a8" filter="url(#wc-bolt-glow)"/>
          <polygon points="152,64 139,112 153,112 141,156 178,100 159,100 170,64"
            fill="#fff8d6" stroke="#ffd83a" stroke-width="1"/>
        </g>` : p}

    ${e.glow > 0 ? w`<rect class="warnglow" x="0" y="0" width="300" height="190"
          fill="url(#wc-warn)" opacity=${Math.min(e.glow, 1)}/>` : p}
  </svg>`;
}
const le = {
  en: {
    goal: "Goal",
    rising: "rising",
    falling: "falling",
    stable: "steady",
    today: "Today",
    yesterday: "Yesterday",
    tomorrow: "Tomorrow",
    now: "Now",
    no_data: "No data",
    entity_missing: "Entity not found",
    // metric names
    temperature: "Temperature",
    feels_like: "Feels like",
    wind: "Wind",
    precipitation: "Precipitation",
    humidity: "Humidity",
    pressure: "Pressure",
    uv: "UV index",
    cloud: "Cloud cover",
    visibility: "Visibility",
    air_quality: "Air quality",
    sun: "Sun",
    moon: "Moon",
    tides: "Tides",
    pollen: "Pollen",
    radar: "Radar",
    sky: "Weather",
    summary: "Summary",
    custom: "Sensor",
    // moon phases (Home Assistant Moon integration states)
    illumination: "Illumination",
    moon_new_moon: "New moon",
    moon_waxing_crescent: "Waxing crescent",
    moon_first_quarter: "First quarter",
    moon_waxing_gibbous: "Waxing gibbous",
    moon_full_moon: "Full moon",
    moon_waning_gibbous: "Waning gibbous",
    moon_last_quarter: "Last quarter",
    moon_waning_crescent: "Waning crescent",
    // tides
    high_tide: "High tide",
    low_tide: "Low tide",
    next_high: "Next high",
    next_low: "Next low",
    // pollen levels (index 0-5)
    pollen_lvl_0: "None",
    pollen_lvl_1: "Very low",
    pollen_lvl_2: "Low",
    pollen_lvl_3: "Moderate",
    pollen_lvl_4: "High",
    pollen_lvl_5: "Very high",
    // day parts (precipitation breakdown)
    part_morning: "Morning",
    part_noon: "Midday",
    part_evening: "Evening",
    part_night: "Night",
    // sun / daylight
    sunrise: "Sunrise",
    sunset: "Sunset",
    daylength: "Daylight",
    sunset_in: "Sunset in {n}",
    sunrise_in: "Sunrise in {n}",
    high: "High",
    low: "Low",
    of: "of",
    // forecast
    forecast: "Forecast",
    forecast_hourly: "Hourly",
    forecast_daily: "Daily",
    // dialog + stats
    close: "Close",
    open_ha: "Open in Home Assistant",
    stat_min: "Min",
    stat_avg: "Avg",
    stat_max: "Max",
    stat_trend: "Trend",
    goal_left: "To goal",
    period_day: "D",
    period_week: "W",
    period_month: "M",
    period_quarter: "3M",
    period_year: "Y",
    period_max: "Max",
    event_times: "Rain events (7 days)",
    ai_note: "Auto-generated summary",
    // weather conditions
    "cond_clear-night": "Clear",
    cond_cloudy: "Cloudy",
    cond_fog: "Fog",
    cond_hail: "Hail",
    cond_lightning: "Thunderstorm",
    "cond_lightning-rainy": "Thunderstorms",
    cond_partlycloudy: "Partly cloudy",
    cond_pouring: "Heavy rain",
    cond_rainy: "Rainy",
    cond_snowy: "Snow",
    "cond_snowy-rainy": "Sleet",
    cond_sunny: "Sunny",
    cond_windy: "Windy",
    "cond_windy-variant": "Windy",
    cond_exceptional: "Exceptional"
  },
  de: {
    goal: "Ziel",
    rising: "steigend",
    falling: "fallend",
    stable: "gleichbleibend",
    today: "Heute",
    yesterday: "Gestern",
    tomorrow: "Morgen",
    now: "Jetzt",
    no_data: "Keine Daten",
    entity_missing: "Entität nicht gefunden",
    temperature: "Temperatur",
    feels_like: "Gefühlt",
    wind: "Wind",
    precipitation: "Niederschlag",
    humidity: "Luftfeuchte",
    pressure: "Luftdruck",
    uv: "UV-Index",
    cloud: "Bewölkung",
    visibility: "Sichtweite",
    air_quality: "Luftqualität",
    sun: "Sonne",
    moon: "Mond",
    tides: "Gezeiten",
    pollen: "Pollen",
    radar: "Wetterradar",
    sky: "Wetter",
    summary: "Zusammenfassung",
    custom: "Sensor",
    illumination: "Beleuchtung",
    moon_new_moon: "Neumond",
    moon_waxing_crescent: "Zunehmende Sichel",
    moon_first_quarter: "Erstes Viertel",
    moon_waxing_gibbous: "Zunehmender Mond",
    moon_full_moon: "Vollmond",
    moon_waning_gibbous: "Abnehmender Mond",
    moon_last_quarter: "Letztes Viertel",
    moon_waning_crescent: "Abnehmende Sichel",
    high_tide: "Flut",
    low_tide: "Ebbe",
    next_high: "Nächste Flut",
    next_low: "Nächste Ebbe",
    pollen_lvl_0: "Keine",
    pollen_lvl_1: "Sehr gering",
    pollen_lvl_2: "Gering",
    pollen_lvl_3: "Mäßig",
    pollen_lvl_4: "Hoch",
    pollen_lvl_5: "Sehr hoch",
    part_morning: "Morgen",
    part_noon: "Mittag",
    part_evening: "Abend",
    part_night: "Nacht",
    sunrise: "Sonnenaufgang",
    sunset: "Sonnenuntergang",
    daylength: "Tageslänge",
    sunset_in: "Untergang in {n}",
    sunrise_in: "Aufgang in {n}",
    high: "Max",
    low: "Min",
    of: "von",
    forecast: "Vorhersage",
    forecast_hourly: "Stündlich",
    forecast_daily: "Täglich",
    close: "Schließen",
    open_ha: "In Home Assistant öffnen",
    stat_min: "Min",
    stat_avg: "Ø",
    stat_max: "Max",
    stat_trend: "Trend",
    goal_left: "Bis Ziel",
    period_day: "T",
    period_week: "W",
    period_month: "M",
    period_quarter: "3M",
    period_year: "J",
    period_max: "Max",
    event_times: "Regen-Ereignisse (7 Tage)",
    ai_note: "Automatisch erzeugte Zusammenfassung",
    "cond_clear-night": "Klar",
    cond_cloudy: "Bewölkt",
    cond_fog: "Nebel",
    cond_hail: "Hagel",
    cond_lightning: "Gewitter",
    "cond_lightning-rainy": "Gewitter mit Regen",
    cond_partlycloudy: "Teils bewölkt",
    cond_pouring: "Starkregen",
    cond_rainy: "Regnerisch",
    cond_snowy: "Schnee",
    "cond_snowy-rainy": "Schneeregen",
    cond_sunny: "Sonnig",
    cond_windy: "Windig",
    "cond_windy-variant": "Windig",
    cond_exceptional: "Außergewöhnlich"
  }
}, de = {
  en: ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"],
  de: ["N", "NNO", "NO", "ONO", "O", "OSO", "SO", "SSO", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"]
};
function dt(e) {
  var i;
  return (((i = e == null ? void 0 : e.locale) == null ? void 0 : i.language) ?? (e == null ? void 0 : e.language) ?? "en").startsWith("de") ? "de" : "en";
}
function k(e, t) {
  return le[dt(e)][t] ?? le.en[t] ?? t;
}
function Nt(e, t) {
  return t ? k(e, `cond_${t}`) : "";
}
function he(e, t) {
  return t === void 0 || !Number.isFinite(t) ? "" : (de[dt(e)] ?? de.en)[Math.round(t % 360 / 22.5) % 16];
}
function P(e) {
  return dt(e) === "de" ? "de-DE" : "en-US";
}
function N(e, t, i) {
  return Number.isFinite(t) ? i === void 0 ? new Intl.NumberFormat(P(e), { maximumFractionDigits: 2 }).format(t) : new Intl.NumberFormat(P(e), {
    minimumFractionDigits: i,
    maximumFractionDigits: i
  }).format(t) : "–";
}
function E(e, t) {
  return t ? /^[%°'"]/.test(t) ? `${e}${t}` : `${e} ${t}` : e;
}
function rt(e, t) {
  if (!Number.isFinite(e)) return "–";
  let i;
  const r = (t ?? "min").toLowerCase();
  r.startsWith("h") ? i = e * 60 : r === "s" || r.startsWith("sec") ? i = e / 60 : i = e;
  const s = Math.round(i * 60), n = Math.floor(s / 3600), o = Math.floor(s % 3600 / 60), a = s % 60;
  return n > 0 ? o ? `${n} h ${o} min` : `${n} h` : o > 0 ? a && o < 10 ? `${o} min ${a} s` : `${o} min` : `${a} s`;
}
function W(e, t) {
  const i = new Date(t);
  if (isNaN(i.getTime())) return "";
  const r = /* @__PURE__ */ new Date(), s = (o, a) => o.getFullYear() === a.getFullYear() && o.getMonth() === a.getMonth() && o.getDate() === a.getDate();
  if (s(i, r))
    return i.toLocaleTimeString(P(e), { hour: "numeric", minute: "2-digit" });
  const n = new Date(r.getTime() - 864e5);
  return s(i, n) ? k(e, "yesterday") : i.toLocaleDateString(P(e), { day: "numeric", month: "short" });
}
function ft(e, t) {
  if (!t) return "";
  const i = new Date(t);
  return isNaN(i.getTime()) ? t : i.toLocaleTimeString(P(e), { hour: "2-digit", minute: "2-digit" });
}
function pe(e) {
  const t = (e.getTime() - Date.now()) / 6e4;
  return t > 0 ? rt(t, "min") : "";
}
const R = (e) => typeof e == "number" && Number.isFinite(e);
function oi(e, t) {
  const i = dt(e) === "de", r = (a, c = 0) => N(e, a, c), s = t.tempUnit ?? "°C", n = [], o = t.condition ? i ? t.condition : t.condition.toLowerCase() : void 0;
  if (o && R(t.temp)) {
    const a = R(t.feels) && Math.abs(t.feels - t.temp) >= 2 ? i ? ` (gefühlt ${E(r(t.feels), s)})` : ` (feels like ${E(r(t.feels), s)})` : "";
    n.push(
      i ? `Aktuell ${o} bei ${E(r(t.temp), s)}${a}.` : `Currently ${o} at ${E(r(t.temp), s)}${a}.`
    );
  } else o ? n.push(i ? `Aktuell ${o}.` : `Currently ${o}.`) : R(t.temp) && n.push(i ? `Aktuell ${E(r(t.temp), s)}.` : `Currently ${E(r(t.temp), s)}.`);
  if (R(t.hi) && R(t.lo) && n.push(
    i ? `Im Tagesverlauf ${E(r(t.lo), s)} bis ${E(r(t.hi), s)}.` : `Ranging from ${E(r(t.lo), s)} to ${E(r(t.hi), s)} today.`
  ), R(t.windSpeed) && t.windSpeed >= 1) {
    const a = t.windSpeed >= 40, c = t.windDir ? i ? ` aus ${t.windDir}` : ` from the ${t.windDir}` : "", l = a ? i ? "Kräftiger Wind" : "Strong winds" : "Wind";
    n.push(`${l}${c} ${i ? "mit" : "at"} ${E(r(t.windSpeed), t.windUnit ?? "km/h")}.`);
  }
  if (R(t.precipProb) && t.precipProb >= 40 ? n.push(
    i ? `${r(t.precipProb)}% Regenwahrscheinlichkeit — Schirm nicht vergessen.` : `${r(t.precipProb)}% chance of rain — take an umbrella.`
  ) : R(t.precipMm) && t.precipMm >= 1 && n.push(
    i ? `Rund ${E(r(t.precipMm, 1), "mm")} Niederschlag erwartet.` : `About ${E(r(t.precipMm, 1), "mm")} of precipitation expected.`
  ), R(t.uv) && t.uv >= 6 && n.push(
    i ? `Hoher UV-Index (${r(t.uv)}) — an Sonnenschutz denken.` : `High UV index (${r(t.uv)}) — remember sun protection.`
  ), R(t.temp) && (t.temp <= 0 ? n.push(i ? "Frostig — warm einpacken." : "Freezing — bundle up.") : t.temp >= 30 && n.push(i ? "Sehr heiß — viel trinken." : "Very hot — stay hydrated.")), t.tomorrowCondition && R(t.tomorrowHi)) {
    const a = i ? t.tomorrowCondition : t.tomorrowCondition.toLowerCase(), c = R(t.tomorrowLo) ? `${E(r(t.tomorrowLo), s)}–` : "";
    n.push(
      i ? `Morgen ${a}, ${c}${E(r(t.tomorrowHi), s)}.` : `Tomorrow ${a}, ${c}${E(r(t.tomorrowHi), s)}.`
    );
  }
  return n.join(" ");
}
async function ai(e, t, i) {
  if (!t.length) return {};
  const r = /* @__PURE__ */ new Date(), s = /* @__PURE__ */ new Date();
  s.setHours(0, 0, 0, 0), s.setDate(s.getDate() - (i - 1));
  const n = await e.callWS({
    type: "history/history_during_period",
    start_time: s.toISOString(),
    end_time: r.toISOString(),
    entity_ids: t,
    minimal_response: !0,
    no_attributes: !0
  }), o = {};
  for (const a of t)
    o[a] = ((n == null ? void 0 : n[a]) ?? []).map((c) => ({ t: c.lu * 1e3, v: parseFloat(c.s) })).filter((c) => Number.isFinite(c.v));
  return o;
}
function ci(e, t, i) {
  const r = /* @__PURE__ */ new Date();
  r.setHours(0, 0, 0, 0);
  const s = r.getTime() - (t - 1) * 864e5, n = Array.from({ length: t }, () => []);
  for (const o of e) {
    const a = Math.floor((o.t - s) / 864e5);
    a >= 0 && a < t && n[a].push(o.v);
  }
  return n.map((o) => Se(o, i));
}
function Se(e, t) {
  if (!e.length) return NaN;
  switch (t) {
    case "min":
      return Math.min(...e);
    case "max":
      return Math.max(...e);
    case "sum":
      return e.reduce((i, r) => i + r, 0);
    case "last":
      return e[e.length - 1];
    default:
      return e.reduce((i, r) => i + r, 0) / e.length;
  }
}
async function li(e, t, i, r = "day") {
  if (!t.length) return {};
  const s = /* @__PURE__ */ new Date();
  s.setHours(0, 0, 0, 0), r === "month" ? (s.setDate(1), s.setMonth(s.getMonth() - (i - 1))) : s.setDate(s.getDate() - (i - 1));
  const n = await e.callWS({
    type: "recorder/statistics_during_period",
    start_time: s.toISOString(),
    end_time: (/* @__PURE__ */ new Date()).toISOString(),
    statistic_ids: t,
    period: r,
    types: ["mean", "min", "max", "state", "sum"]
  }), o = (c) => typeof c == "number" && Number.isFinite(c) ? c : null, a = {};
  for (const c of t)
    a[c] = ((n == null ? void 0 : n[c]) ?? []).map((l) => ({
      start: typeof l.start == "number" ? l.start : new Date(l.start).getTime(),
      mean: o(l.mean),
      min: o(l.min),
      max: o(l.max),
      state: o(l.state),
      sum: o(l.sum)
    }));
  return a;
}
function ue(e, t) {
  return t === "min" ? e.min : t === "max" ? e.max ?? e.mean : t === "sum" ? e.sum ?? e.max ?? e.mean : t === "last" ? e.state ?? e.mean : e.mean;
}
function me(e, t, i, r = "day") {
  const s = new Array(t).fill(NaN);
  if (r === "month") {
    const a = /* @__PURE__ */ new Date(), c = a.getFullYear() * 12 + a.getMonth();
    for (const l of e) {
      const h = new Date(l.start), d = h.getFullYear() * 12 + h.getMonth() - (c - (t - 1));
      if (d < 0 || d >= t) continue;
      const f = ue(l, i);
      f !== null && (s[d] = f);
    }
    return s;
  }
  const n = /* @__PURE__ */ new Date();
  n.setHours(0, 0, 0, 0);
  const o = n.getTime() - (t - 1) * 864e5;
  for (const a of e) {
    const c = Math.floor((a.start - o) / 864e5);
    if (c < 0 || c >= t) continue;
    const l = ue(a, i);
    l !== null && (s[c] = l);
  }
  return s;
}
function di(e, t, i) {
  const r = /* @__PURE__ */ new Date();
  r.setMinutes(0, 0, 0);
  const s = r.getTime() - (t - 1) * 36e5, n = Array.from({ length: t }, () => []);
  for (const o of e) {
    const a = Math.floor((o.t - s) / 36e5);
    a >= 0 && a < t && n[a].push(o.v);
  }
  return n.map((o) => Se(o, i));
}
function Et(e) {
  const t = [...e];
  let i = NaN;
  for (let s = 0; s < t.length; s++)
    Number.isFinite(t[s]) ? i = t[s] : t[s] = i;
  let r = NaN;
  for (let s = t.length - 1; s >= 0; s--)
    Number.isFinite(t[s]) ? r = t[s] : t[s] = r;
  return t;
}
function Ft(e) {
  const t = e.filter(Number.isFinite);
  return t.length < 2 ? NaN : t[t.length - 1] - t[0];
}
async function hi(e, t, i) {
  var s, n, o, a, c;
  try {
    const l = await e.callWS({
      type: "execute_script",
      sequence: [
        {
          service: "weather.get_forecasts",
          data: { type: i },
          target: { entity_id: t },
          response_variable: "_wc_forecast"
        },
        { stop: "done", response_variable: "_wc_forecast" }
      ]
    }), h = (n = (s = l == null ? void 0 : l.response) == null ? void 0 : s[t]) == null ? void 0 : n.forecast;
    if (Array.isArray(h) && h.length) return h;
  } catch {
  }
  if ((o = e.connection) != null && o.subscribeMessage)
    try {
      const l = await new Promise((h) => {
        let d;
        const f = setTimeout(() => {
          d == null || d(), h([]);
        }, 4e3);
        e.connection.subscribeMessage(
          (y) => {
            clearTimeout(f), d == null || d(), h(y.forecast ?? []);
          },
          {
            type: "weather/subscribe_forecast",
            forecast_type: i,
            entity_id: t
          }
        ).then((y) => {
          d = y;
        }).catch(() => h([]));
      });
      if (l.length) return l;
    } catch {
    }
  const r = (c = (a = e.states[t]) == null ? void 0 : a.attributes) == null ? void 0 : c.forecast;
  return Array.isArray(r) && r.length ? r : [];
}
function pi(e) {
  return !!e && e.startsWith("weather.");
}
const Me = 220, Ae = 60, z = 7, xt = "color-mix(in srgb, var(--primary-text-color) 14%, transparent)";
function Ne(e, t) {
  var s;
  const i = e.yFmt ? Math.max(26, ...t.map((n) => e.yFmt(n).length * 5.6 + 10)) : z, r = (s = e.xMarks) != null && s.some((n) => n.label) ? 15 : z;
  return { padL: i, padB: r };
}
function ui(e) {
  const t = e.filter(Number.isFinite), i = Math.min(...t), r = Math.max(...t), s = r - i || Math.abs(r) * 0.1 || 1;
  return { lo: i - s * 0.18, hi: r + s * 0.18 };
}
function Ct(e, t = {}) {
  const i = t.w ?? Me, r = t.h ?? Ae, s = t.dots ?? !0, n = e.filter((m) => m.values.some(Number.isFinite));
  if (!n.length) return p;
  const { lo: o, hi: a } = ui(n.flatMap((m) => m.values)), c = Math.max(...n.map((m) => m.values.length)), l = t.yFmt ? [a - (a - o) * 0.08, (o + a) / 2, o + (a - o) * 0.08] : [], { padL: h, padB: d } = Ne(t, l), f = (m) => h + m * (i - h - z) / Math.max(c - 1, 1), y = (m) => r - d - (m - o) / (a - o) * (r - d - z), _ = l.map(
    (m) => w`
      <line x1=${h} x2=${i - z} y1=${y(m)} y2=${y(m)}
        stroke=${xt} stroke-width="1" stroke-dasharray="2 3"/>
      <text class="axis" x=${h - 5} y=${y(m)} text-anchor="end"
        dominant-baseline="middle">${t.yFmt(m)}</text>`
  ), $ = (t.xMarks ?? []).map(
    (m) => w`
      ${m.line ? w`<line x1=${f(m.i)} x2=${f(m.i)} y1=${z} y2=${r - d}
              stroke=${xt} stroke-width="1"/>` : p}
      ${m.label ? w`<text class="axis" x=${f(m.i)} y=${r - 3} text-anchor="middle">${m.label}</text>` : p}`
  ), x = n.map((m, b) => {
    const g = m.values.map((v, A) => ({ x: f(A), y: y(v), ok: Number.isFinite(v) })).filter((v) => v.ok);
    if (!g.length) return p;
    let S = `M ${g[0].x} ${g[0].y}`;
    for (let v = 1; v < g.length; v++) {
      const A = (g[v - 1].x + g[v].x) / 2;
      S += ` C ${A} ${g[v - 1].y}, ${A} ${g[v].y}, ${g[v].x} ${g[v].y}`;
    }
    const M = t.area && b === 0 ? w`<path d="${S} L ${g[g.length - 1].x} ${r - d} L ${g[0].x} ${r - d} Z"
            fill="color-mix(in srgb, ${m.color} 13%, transparent)"/>` : p;
    return w`
      ${M}
      <path d=${S} fill="none" stroke=${m.color} stroke-width="2.2"
        stroke-linecap="round" stroke-linejoin="round"
        stroke-dasharray=${m.dashed ? "4 4" : p} opacity=${m.dashed ? 0.75 : 1}/>
      ${s ? g.map(
      (v) => w`<circle cx=${v.x} cy=${v.y} r="3.1" fill="var(--wc-dot-fill)"
                stroke=${m.color} stroke-width="2"/>`
    ) : p}
      ${t.nowDot && b === 0 ? w`<circle cx=${g[0].x} cy=${g[0].y} r="3.6" fill="var(--wc-dot-fill)"
              stroke=${m.color} stroke-width="2.2"/>` : p}
    `;
  });
  return u`<svg class="chart" viewBox="0 0 ${i} ${r}" aria-hidden="true">
    ${_}${$}${x}
  </svg>`;
}
function Tt(e, t, i, r = {}) {
  const s = r.w ?? Me, n = r.h ?? Ae;
  if (!e.some((g) => Number.isFinite(g) && g > 0)) return p;
  const o = e.map((g) => Number.isFinite(g) && g > 0 ? g : 0), a = Math.max(...o, i ?? 0) || 1, c = o.length, l = r.yFmt ? [a, a / 2] : [], { padL: h, padB: d } = Ne(r, l), f = (s - h - z) / c, y = Math.min(f * 0.55, 14), _ = (g) => g / a * (n - d - z), $ = l.map(
    (g) => w`
      <line x1=${h} x2=${s - z} y1=${n - d - _(g)} y2=${n - d - _(g)}
        stroke=${xt} stroke-width="1" stroke-dasharray="2 3"/>
      <text class="axis" x=${h - 5} y=${n - d - _(g)} text-anchor="end"
        dominant-baseline="middle">${r.yFmt(g)}</text>`
  ), x = (r.xMarks ?? []).map((g) => {
    const S = h + g.i * f + f / 2;
    return w`
      ${g.line ? w`<line x1=${S} x2=${S} y1=${z} y2=${n - d}
              stroke=${xt} stroke-width="1"/>` : p}
      ${g.label ? w`<text class="axis" x=${S} y=${n - 3} text-anchor="middle">${g.label}</text>` : p}`;
  }), m = o.map((g, S) => {
    const M = Math.max(_(g), g > 0 ? 3 : 1.5), v = h + S * f + (f - y) / 2;
    return w`<rect x=${v} y=${n - d - M} width=${y} height=${M}
      rx=${Math.min(y / 2, 4)} fill=${t} opacity=${g > 0 ? 1 : 0.25}/>`;
  }), b = Number.isFinite(i) ? w`<line x1=${h} x2=${s - z} y1=${n - d - _(i)} y2=${n - d - _(i)}
        stroke=${t} stroke-width="1" stroke-dasharray="3 3" opacity="0.5"/>` : p;
  return u`<svg class="chart" viewBox="0 0 ${s} ${n}" aria-hidden="true">
    ${$}${x}${b}${m}
  </svg>`;
}
function It(e, t, i, r) {
  const s = 2 * Math.PI * e;
  return w`<circle cx="100" cy="100" r=${e} fill="none" stroke=${r}
    stroke-width=${t} stroke-linecap="round"
    stroke-dasharray="${s * Math.max(i, 0.02)} ${s}"
    transform="rotate(-90 100 100)"/>`;
}
function Rt(e, t, i = 10) {
  return u`<svg class="scorering" viewBox="0 0 200 200" aria-hidden="true">
    <circle cx="100" cy="100" r=${82} fill="none" stroke=${e} opacity="0.16"
      stroke-width=${i}/>
    ${It(82, i, t, e)}
  </svg>`;
}
function mi(e, t, i) {
  const n = 2 * Math.PI * 78, o = `${n * Math.max(t, 0.02)} ${n}`, a = 78 + 13 * 0.27, c = 2 * Math.PI * a, l = 0.18 + t * 0.5, h = t >= 0.95;
  return u`<svg class="scorering" viewBox="-14 -14 228 228" aria-hidden="true">
    <defs>
      <filter id="wc-glow" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="6" />
      </filter>
      <filter id="wc-blur-heavy" x="-90%" y="-90%" width="280%" height="280%">
        <feGaussianBlur stdDeviation="15" />
      </filter>
    </defs>
    ${h ? w`<circle cx="100" cy="100" r="93" fill="none" stroke=${e}
          stroke-width="2.5" opacity="0.4" filter="url(#wc-glow)" class="glowpulse"/>` : p}
    <circle cx="100" cy="100" r=${78} fill="none" stroke=${e}
      stroke-width=${20} stroke-linecap="round" stroke-dasharray=${o}
      transform="rotate(-90 100 100)" filter="url(#wc-glow)" opacity=${l}
      class=${h ? "glowpulse" : ""}/>
    ${i != null && i.length ? i.map((d, f) => {
    const y = f / i.length * 2 * Math.PI - Math.PI / 2;
    return w`<circle cx=${100 + Math.cos(y) * 24} cy=${100 + Math.sin(y) * 24}
            r=${16 + d.share * 26} fill=${d.color}
            filter="url(#wc-blur-heavy)" opacity="0.5"/>`;
  }) : p}
    <circle cx="100" cy="100" r=${78} fill="none" stroke-width=${13}
      stroke="color-mix(in srgb, ${e} 13%, transparent)"/>
    <circle cx="100" cy="100" r=${78 + 13 / 2 - 0.6} fill="none" stroke-width="1"
      stroke="color-mix(in srgb, #fff 30%, transparent)"/>
    <circle cx="100" cy="100" r=${78 - 13 / 2 + 0.6} fill="none" stroke-width="1"
      stroke="color-mix(in srgb, #fff 12%, transparent)"/>
    ${It(78, 13, t, e)}
    <circle cx="100" cy="100" r=${a} fill="none" stroke="rgba(255, 255, 255, 0.55)"
      stroke-width="1.6" stroke-linecap="round"
      stroke-dasharray="${c * Math.max(t, 0.02)} ${c}"
      transform="rotate(-90 100 100)"/>
  </svg>`;
}
function fi(e, t, i) {
  const r = [];
  for (let o = 0; o <= 144; o++) {
    const a = o / 144 * 2 * Math.PI, c = 72 + 7 * Math.cos(12 * a);
    r.push(
      `${o ? "L" : "M"} ${(100 + Math.cos(a) * c).toFixed(1)} ${(100 + Math.sin(a) * c).toFixed(1)}`
    );
  }
  const n = 92;
  return u`<svg class="scorering" viewBox="0 0 200 200" aria-hidden="true">
    <path d="${r.join(" ")} Z" fill="color-mix(in srgb, ${e} 22%, transparent)"/>
    <circle cx="100" cy="100" r=${n} fill="none" stroke=${t} opacity="0.18"
      stroke-width="5"/>
    ${It(n, 5, i, t)}
  </svg>`;
}
function gi(e, t, i, r, s) {
  return e === "material" ? fi(t, i, r) : e === "bubble" ? Rt(i, r, 15) : e === "mirror" ? Rt("#fff", r, 7) : e === "glass" ? mi(i, r, s) : Rt(i, r, 10);
}
function yi(e, t, i) {
  const r = Math.max(0, Math.min(e, 1)), s = 18, n = 182, o = 92, a = 20, c = `M ${s} ${o} Q 100 ${a - 40} ${n} ${o}`, l = r, h = (1 - l) ** 2 * s + 2 * (1 - l) * l * 100 + l ** 2 * n, d = (1 - l) ** 2 * o + 2 * (1 - l) * l * (a - 40) + l ** 2 * o, f = t ? o + 14 : d, y = t ? r < 0.5 ? s - 4 : n + 4 : h;
  return u`<svg class="sunarc" viewBox="0 0 200 110" aria-hidden="true">
    <defs>
      <linearGradient id="wc-sun-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color=${i} stop-opacity="0.28" />
        <stop offset="100%" stop-color=${i} stop-opacity="0" />
      </linearGradient>
    </defs>
    <path d="${c} L ${n} ${o} L ${s} ${o} Z"
      fill="url(#wc-sun-sky)" opacity=${t ? 0.25 : 1}/>
    <path d=${c} fill="none" stroke=${i} stroke-width="2"
      stroke-dasharray="3 4" opacity="0.65"/>
    <line x1="6" x2="194" y1=${o} y2=${o}
      stroke="color-mix(in srgb, var(--primary-text-color) 22%, transparent)"
      stroke-width="1.5"/>
    <circle cx=${y} cy=${f} r="9"
      fill=${t ? "color-mix(in srgb, var(--primary-text-color) 30%, transparent)" : i}
      stroke="var(--wc-card-bg)" stroke-width="2.5"/>
    ${t ? p : w`<circle cx=${y} cy=${f} r="15" fill="none" stroke=${i}
          stroke-width="1.5" opacity="0.4"/>`}
  </svg>`;
}
function _i(e, t) {
  const r = Math.max(0, Math.min(e, 1)), s = "#eef1f6", n = "#39435a", o = 1 - 2 * r, a = 62 * Math.abs(o), c = o > 0 ? 1 : 0, l = `M 0 -62 A 62 62 0 0 1 0 62 A ${a.toFixed(1)} 62 0 0 ${c} 0 -62 Z`;
  return u`<svg class="moondisc" viewBox="0 0 200 200" aria-hidden="true">
    <defs>
      <radialGradient id="wc-moon-glow">
        <stop offset="0%" stop-color="#eef1f6" stop-opacity="0.5" />
        <stop offset="70%" stop-color="#eef1f6" stop-opacity="0.1" />
        <stop offset="100%" stop-color="#eef1f6" stop-opacity="0" />
      </radialGradient>
    </defs>
    <circle cx="100" cy="100" r="88" fill="url(#wc-moon-glow)" opacity=${0.25 + r * 0.65} />
    <g transform="translate(100 100)">
      <circle r=${62} fill=${n} />
      <path d=${l} fill=${s} transform=${t ? p : "scale(-1 1)"} />
      <g fill="rgba(90,96,120,0.28)">
        <circle cx="-16" cy="-16" r="9" />
        <circle cx="15" cy="9" r="12" />
        <circle cx="26" cy="-20" r="6" />
        <circle cx="-6" cy="27" r="7" />
        <circle cx="8" cy="-30" r="4" />
      </g>
    </g>
  </svg>`;
}
function bi(e, t, i) {
  const r = e.filter(Number.isFinite);
  let s = e, n = e.length - 1;
  r.length < 3 && (s = Array.from({ length: 24 }, (b, g) => Math.sin(g / 24 * 2 * Math.PI * 2 - Math.PI / 2)), n = (/* @__PURE__ */ new Date()).getHours());
  const o = 300, a = 96, c = 8, l = Math.min(...s.filter(Number.isFinite)), d = Math.max(...s.filter(Number.isFinite)) - l || 1, f = (b) => c + b * (o - 2 * c) / Math.max(s.length - 1, 1), y = (b) => a - c - (b - l) / d * (a - 2 * c), _ = s.map((b, g) => ({ x: f(g), y: y(Number.isFinite(b) ? b : l) }));
  let $ = `M ${_[0].x} ${_[0].y}`;
  for (let b = 1; b < _.length; b++) {
    const g = (_[b - 1].x + _[b].x) / 2;
    $ += ` C ${g} ${_[b - 1].y}, ${g} ${_[b].y}, ${_[b].x} ${_[b].y}`;
  }
  const x = `${$} L ${_[_.length - 1].x} ${a} L ${_[0].x} ${a} Z`, m = Math.max(0, Math.min(Math.round(n), _.length - 1));
  return u`<svg class="tidechart" viewBox="0 0 ${o} ${a}" aria-hidden="true">
    <defs>
      <linearGradient id="wc-tide-fill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color=${t} stop-opacity="0.35" />
        <stop offset="100%" stop-color=${t} stop-opacity="0.02" />
      </linearGradient>
    </defs>
    <path d=${x} fill="url(#wc-tide-fill)" />
    <path d=${$} fill="none" stroke=${t} stroke-width="2.4" stroke-linecap="round" />
    <line x1=${_[m].x} x2=${_[m].x} y1=${_[m].y} y2=${a}
      stroke=${t} stroke-width="1" stroke-dasharray="2 3" opacity="0.5" />
    <circle cx=${_[m].x} cy=${_[m].y} r="5" fill=${t}
      stroke="var(--wc-card-bg)" stroke-width="2.5" />
  </svg>`;
}
function xi(e, t, i) {
  const r = Number.isFinite(e), s = ((r ? e : 0) - 90) * (Math.PI / 180);
  return u`<svg class="windrose" viewBox="0 0 200 200" aria-hidden="true">
    <circle cx="100" cy="100" r="82" fill="none"
      stroke="color-mix(in srgb, var(--primary-text-color) 12%, transparent)" stroke-width="2"/>
    <circle cx="100" cy="100" r="60" fill="none"
      stroke="color-mix(in srgb, var(--primary-text-color) 8%, transparent)" stroke-width="1"/>
    ${[
    { l: "N", x: 100, y: 22 },
    { l: "E", x: 178, y: 104 },
    { l: "S", x: 100, y: 184 },
    { l: "W", x: 22, y: 104 }
  ].map(
    (o) => w`<text class="rose-card" x=${o.x} y=${o.y} text-anchor="middle"
        dominant-baseline="middle">${o.l}</text>`
  )}
    ${r ? w`<g transform="translate(100 100)">
          <line x1=${Math.cos(s) * 58} y1=${Math.sin(s) * 58}
            x2=${-Math.cos(s) * 58} y2=${-Math.sin(s) * 58}
            stroke=${i} stroke-width="5" stroke-linecap="round"/>
          <polygon points="0,-9 0,9 62,0"
            transform="rotate(${e + 90})" fill=${i}/>
        </g>` : p}
    <circle cx="100" cy="100" r="6" fill=${i}/>
  </svg>`;
}
var wi = Object.defineProperty, vi = Object.getOwnPropertyDescriptor, ht = (e, t, i, r) => {
  for (var s = r > 1 ? void 0 : r ? vi(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (s = (r ? o(t, i, s) : o(s)) || s);
  return r && s && wi(t, i, s), s;
};
const $i = Object.keys(Q), ki = ["air_quality", "pollen"], Si = [
  "temperature",
  "feels_like",
  "wind",
  "precipitation",
  "humidity",
  "uv",
  "pressure",
  "cloud",
  "sky",
  "summary"
], Mi = [
  "temperature",
  "feels_like",
  "wind",
  "precipitation",
  "humidity",
  "uv",
  "pressure",
  "cloud"
], Dt = {
  en: {
    title: "Title",
    subtitle: "Subtitle",
    weather: "Weather entity (forecast + condition)",
    days: "History (days)",
    columns: "Columns",
    tiles: "Show metrics as tiles",
    layout: "Layout",
    layout_grid: "Grid",
    layout_carousel: "Carousel (scrollable)",
    background: "Card background",
    flush: "Edge to edge (no outer padding)",
    card_style: "Style",
    style_default: "Default",
    style_glass: "Liquid Glass",
    style_material: "Material You",
    style_bubble: "Bubble",
    style_mirror: "Magic Mirror",
    tab_general: "General",
    sec_display: "Appearance",
    sec_goal: "Goal & progress",
    sec_behavior: "Behavior & data",
    sec_forecast: "Forecast",
    sec_parts: "Day parts",
    sec_sky: "Sky scene",
    sec_sun: "Sun",
    sec_moon: "Moon",
    sec_tides: "Tides",
    sec_radar: "Radar",
    sec_summary: "AI summary",
    chart_source: "Tile chart shows",
    cs_forecast: "Forecast (upcoming)",
    cs_history: "History (past)",
    goal_type: "Goal direction",
    gt_atleast: "Reach at least",
    gt_atmost: "Stay at/below",
    goal_entity: "Goal sensor (overrides number)",
    start: "Start value (number)",
    start_entity: "Start sensor (overrides number)",
    tap_action: "Tap action",
    ta_popup: "Popup (detail view)",
    "ta_more-info": "More-info (HA dialog)",
    ta_link: "Link",
    ta_none: "Nothing",
    link: "Link (path or URL)",
    max: "Maximum (index)",
    forecast: "Forecast weather entity (overrides card)",
    forecast_type: "Resolution",
    ft_hourly: "Hourly",
    ft_daily: "Daily",
    ft_twice_daily: "Twice daily",
    forecast_count: "Steps to show",
    part_morning: "Morning entity",
    part_noon: "Midday entity",
    part_evening: "Evening entity",
    part_night: "Night entity",
    condition_entity: "Condition sensor (overrides weather)",
    sun_entity: "Sun entity (day/night)",
    wind_entity: "Wind entity (cloud drift)",
    night: "Force night mode",
    scene_offset_y: "Scene vertical offset %",
    label_opacity: "Label opacity",
    anchors: "Value labels on the scene",
    add_anchor: "Add label",
    anchor_x: "X %",
    anchor_y: "Y %",
    dot: "Dot position",
    dot_left: "left",
    dot_right: "right",
    dot_top: "top",
    dot_bottom: "bottom",
    sunrise_entity: "Sunrise entity (optional)",
    sunset_entity: "Sunset entity (optional)",
    moon_entity: "Moon phase entity (optional)",
    illumination_entity: "Illumination entity (0-1 or %)",
    high_tide_entity: "Next high tide entity",
    low_tide_entity: "Next low tide entity",
    image_url: "Radar image URL",
    refresh: "Refresh (seconds)",
    summary_entity: "Summary text sensor (LLM/AI)",
    summary_sources: "Source sensors (generated summary)",
    score_entity: "Warning/index sensor (badge)",
    breakdown: "Sub-indices (category colors)",
    expanded: "Expanded tile (details inline)",
    type: "Type",
    entity: "Entity",
    entity2: "Second entity (e.g. gust)",
    entities: "Entities (multiple series)",
    secondary: "Extra entities (info line)",
    name: "Name",
    icon: "Icon",
    color: "Color",
    unit: "Unit",
    graph: "Chart",
    goal: "Goal (number)",
    precision: "Decimals",
    aggregate: "Aggregation",
    trend: "Trend",
    label: "Text instead of value",
    add_metric: "Add metric",
    graph_line: "Line",
    graph_bar: "Bars",
    graph_progress: "Progress",
    graph_none: "None",
    agg_mean: "Average",
    agg_min: "Minimum",
    agg_max: "Maximum",
    agg_sum: "Sum",
    agg_last: "Last value",
    trend_up_good: "Rising is good",
    trend_down_good: "Falling is good",
    trend_neutral: "Neutral",
    trend_none: "Hide"
  },
  de: {
    title: "Titel",
    subtitle: "Untertitel",
    weather: "Wetter-Entität (Vorhersage + Lage)",
    days: "Verlauf (Tage)",
    columns: "Spalten",
    tiles: "Metriken als Kacheln anzeigen",
    layout: "Layout",
    layout_grid: "Raster",
    layout_carousel: "Slideshow (scrollbar)",
    background: "Kartenhintergrund",
    flush: "Randlos (kein Außenabstand)",
    card_style: "Stil",
    style_default: "Standard",
    style_glass: "Liquid Glass",
    style_material: "Material You",
    style_bubble: "Bubble",
    style_mirror: "Magic Mirror",
    tab_general: "Allgemein",
    sec_display: "Darstellung",
    sec_goal: "Ziel & Fortschritt",
    sec_behavior: "Verhalten & Daten",
    sec_forecast: "Vorhersage",
    sec_parts: "Tageszeiten",
    sec_sky: "Himmel-Szene",
    sec_sun: "Sonne",
    sec_moon: "Mond",
    sec_tides: "Gezeiten",
    sec_radar: "Radar",
    sec_summary: "AI-Zusammenfassung",
    chart_source: "Kachel-Diagramm zeigt",
    cs_forecast: "Vorhersage (kommend)",
    cs_history: "Verlauf (vergangen)",
    goal_type: "Zielrichtung",
    gt_atleast: "Mindestens erreichen",
    gt_atmost: "Höchstens",
    goal_entity: "Ziel-Sensor (hat Vorrang)",
    start: "Startwert (Zahl)",
    start_entity: "Start-Sensor (hat Vorrang)",
    tap_action: "Klick-Aktion",
    ta_popup: "Popup (Detailansicht)",
    "ta_more-info": "More-Info (HA-Dialog)",
    ta_link: "Link",
    ta_none: "Nichts",
    link: "Link (Pfad oder URL)",
    max: "Maximum (Index)",
    forecast: "Vorhersage-Wetter-Entität (überschreibt Karte)",
    forecast_type: "Auflösung",
    ft_hourly: "Stündlich",
    ft_daily: "Täglich",
    ft_twice_daily: "Zweimal täglich",
    forecast_count: "Anzahl Schritte",
    part_morning: "Morgen-Entität",
    part_noon: "Mittag-Entität",
    part_evening: "Abend-Entität",
    part_night: "Nacht-Entität",
    condition_entity: "Wetterlage-Sensor (überschreibt Wetter)",
    sun_entity: "Sonnen-Entität (Tag/Nacht)",
    wind_entity: "Wind-Entität (Wolken-Drift)",
    night: "Nachtmodus erzwingen",
    scene_offset_y: "Vertikaler Versatz %",
    label_opacity: "Label-Deckkraft",
    anchors: "Wert-Labels auf der Szene",
    add_anchor: "Label hinzufügen",
    anchor_x: "X %",
    anchor_y: "Y %",
    dot: "Punkt-Position",
    dot_left: "links",
    dot_right: "rechts",
    dot_top: "oben",
    dot_bottom: "unten",
    sunrise_entity: "Sonnenaufgang-Entität (optional)",
    sunset_entity: "Sonnenuntergang-Entität (optional)",
    moon_entity: "Mondphasen-Entität (optional)",
    illumination_entity: "Beleuchtungs-Entität (0-1 oder %)",
    high_tide_entity: "Nächste-Flut-Entität",
    low_tide_entity: "Nächste-Ebbe-Entität",
    image_url: "Radar-Bild-URL",
    refresh: "Aktualisierung (Sekunden)",
    summary_entity: "Zusammenfassungs-Sensor (LLM/AI)",
    summary_sources: "Quell-Sensoren (erzeugte Zusammenfassung)",
    score_entity: "Warn-/Index-Sensor (Badge)",
    breakdown: "Sub-Indizes (Kategoriefarben)",
    expanded: "Erweiterte Kachel (Details eingeblendet)",
    type: "Typ",
    entity: "Entität",
    entity2: "Zweite Entität (z. B. Böen)",
    entities: "Entitäten (mehrere Serien)",
    secondary: "Zusatz-Entitäten (Infozeile)",
    name: "Name",
    icon: "Icon",
    color: "Farbe",
    unit: "Einheit",
    graph: "Diagramm",
    goal: "Ziel (Zahl)",
    precision: "Nachkommastellen",
    aggregate: "Aggregation",
    trend: "Trend",
    label: "Text statt Wert",
    add_metric: "Metrik hinzufügen",
    graph_line: "Linie",
    graph_bar: "Balken",
    graph_progress: "Fortschritt",
    graph_none: "Kein",
    agg_mean: "Mittelwert",
    agg_min: "Minimum",
    agg_max: "Maximum",
    agg_sum: "Summe",
    agg_last: "Letzter Wert",
    trend_up_good: "Steigen ist gut",
    trend_down_good: "Fallen ist gut",
    trend_neutral: "Neutral",
    trend_none: "Ausblenden"
  }
};
let Y = class extends K {
  constructor() {
    super(...arguments), this._expanded = -1, this._tab = "general";
  }
  setConfig(e) {
    this._config = e;
  }
  _label(e) {
    return (Dt[dt(this.hass)] ?? Dt.en)[e] ?? Dt.en[e] ?? e;
  }
  _topSchema() {
    return [
      { name: "title", selector: { text: {} } },
      { name: "subtitle", selector: { text: {} } },
      { name: "weather", selector: { entity: { domain: "weather" } } },
      {
        type: "grid",
        name: "",
        schema: [
          { name: "days", selector: { number: { min: 1, max: 60, mode: "box" } } },
          { name: "columns", selector: { number: { min: 1, max: 3, mode: "box" } } },
          {
            name: "layout",
            selector: {
              select: {
                mode: "dropdown",
                options: [
                  { value: "grid", label: this._label("layout_grid") },
                  { value: "carousel", label: this._label("layout_carousel") }
                ]
              }
            }
          },
          {
            name: "card_style",
            selector: {
              select: {
                mode: "dropdown",
                options: ["default", "glass", "material", "bubble", "mirror"].map((e) => ({
                  value: e,
                  label: this._label(`style_${e}`)
                }))
              }
            }
          }
        ]
      },
      { name: "tiles", selector: { boolean: {} } },
      { name: "background", selector: { boolean: {} } },
      { name: "flush", selector: { boolean: {} } }
    ];
  }
  /** Tabs shown for a metric — pill navigation like the Health Card editor. */
  _metricTabs(e) {
    const t = [
      { id: "general", icon: "mdi:tune-variant", label: this._label("tab_general") },
      { id: "display", icon: "mdi:palette-outline", label: this._label("sec_display") }
    ];
    Si.includes(e) && t.push({
      id: "forecast",
      icon: "mdi:clock-fast",
      label: this._label("sec_forecast")
    }), t.push(
      { id: "goal", icon: "mdi:flag-checkered", label: this._label("sec_goal") },
      { id: "behavior", icon: "mdi:gesture-tap", label: this._label("sec_behavior") }
    );
    const i = {
      sky: { id: "sky", icon: "mdi:weather-partly-cloudy", label: this._label("sec_sky") },
      sun: { id: "sun", icon: "mdi:weather-sunset", label: this._label("sec_sun") },
      moon: { id: "moon", icon: "mdi:moon-waning-crescent", label: this._label("sec_moon") },
      tides: { id: "tides", icon: "mdi:waves", label: this._label("sec_tides") },
      radar: { id: "radar", icon: "mdi:radar", label: this._label("sec_radar") },
      summary: { id: "summary", icon: "mdi:creation", label: this._label("sec_summary") },
      precipitation: {
        id: "parts",
        icon: "mdi:weather-pouring",
        label: this._label("sec_parts")
      }
    };
    return i[e] && t.push(i[e]), t;
  }
  _metricSchema(e, t) {
    const i = e.type ?? "custom", r = (n, o) => n.map((a) => ({ value: a, label: this._label(`${o}_${a}`) })), s = !e.entities || e.entities.every((n) => typeof n == "string");
    switch (t) {
      case "display":
        return [
          {
            type: "grid",
            name: "",
            schema: [
              { name: "icon", selector: { icon: {} } },
              {
                name: "color",
                selector: {
                  select: {
                    mode: "dropdown",
                    custom_value: !0,
                    options: Jt.map((n) => ({ value: n, label: n }))
                  }
                }
              },
              { name: "unit", selector: { text: {} } },
              {
                name: "graph",
                selector: {
                  select: {
                    mode: "dropdown",
                    options: r(["line", "bar", "progress", "none"], "graph")
                  }
                }
              },
              ...Mi.includes(i) ? [
                {
                  name: "chart_source",
                  selector: {
                    select: {
                      mode: "dropdown",
                      options: r(["forecast", "history"], "cs")
                    }
                  }
                }
              ] : [],
              { name: "precision", selector: { number: { min: 0, max: 3, mode: "box" } } }
            ]
          },
          { name: "label", selector: { text: {} } },
          { name: "expanded", selector: { boolean: {} } }
        ];
      case "forecast":
        return [
          { name: "forecast", selector: { entity: { domain: "weather" } } },
          {
            type: "grid",
            name: "",
            schema: [
              {
                name: "forecast_type",
                selector: {
                  select: {
                    mode: "dropdown",
                    options: r(["hourly", "daily", "twice_daily"], "ft")
                  }
                }
              },
              {
                name: "forecast_count",
                selector: { number: { min: 2, max: 24, mode: "box" } }
              }
            ]
          }
        ];
      case "goal":
        return [
          {
            type: "grid",
            name: "",
            schema: [
              { name: "goal", selector: { number: { mode: "box", step: "any" } } },
              { name: "start", selector: { number: { mode: "box", step: "any" } } }
            ]
          },
          {
            type: "grid",
            name: "",
            schema: [
              { name: "goal_entity", selector: { entity: {} } },
              { name: "start_entity", selector: { entity: {} } }
            ]
          },
          {
            type: "grid",
            name: "",
            schema: [
              {
                name: "goal_type",
                selector: {
                  select: { mode: "dropdown", options: r(["atleast", "atmost"], "gt") }
                }
              },
              ...i === "air_quality" || i === "pollen" ? [{ name: "max", selector: { number: { min: 1, mode: "box" } } }] : []
            ]
          }
        ];
      case "behavior":
        return [
          {
            type: "grid",
            name: "",
            schema: [
              {
                name: "tap_action",
                selector: {
                  select: {
                    mode: "dropdown",
                    options: r(["popup", "more-info", "link", "none"], "ta")
                  }
                }
              },
              ...e.tap_action === "link" ? [{ name: "link", selector: { text: {} } }] : [],
              {
                name: "aggregate",
                selector: {
                  select: {
                    mode: "dropdown",
                    options: r(["mean", "min", "max", "sum", "last"], "agg")
                  }
                }
              },
              {
                name: "trend",
                selector: {
                  select: {
                    mode: "dropdown",
                    options: r(["up_good", "down_good", "neutral", "none"], "trend")
                  }
                }
              },
              { name: "days", selector: { number: { min: 1, max: 60, mode: "box" } } }
            ]
          },
          { name: "secondary", selector: { entity: { multiple: !0 } } },
          { name: "score_entity", selector: { entity: {} } }
        ];
      case "sky":
        return [
          {
            type: "grid",
            name: "",
            schema: [
              { name: "condition_entity", selector: { entity: {} } },
              { name: "sun_entity", selector: { entity: { domain: "sun" } } },
              { name: "wind_entity", selector: { entity: {} } },
              {
                name: "scene_offset_y",
                selector: { number: { min: -40, max: 40, mode: "slider" } }
              }
            ]
          },
          {
            name: "label_opacity",
            selector: { number: { min: 0, max: 1, step: 0.05, mode: "slider" } }
          },
          { name: "night", selector: { boolean: {} } }
        ];
      case "sun":
        return [
          { name: "sun_entity", selector: { entity: { domain: "sun" } } },
          {
            type: "grid",
            name: "",
            schema: [
              { name: "sunrise_entity", selector: { entity: {} } },
              { name: "sunset_entity", selector: { entity: {} } }
            ]
          },
          { name: "moon_entity", selector: { entity: {} } }
        ];
      case "moon":
        return [{ name: "illumination_entity", selector: { entity: {} } }];
      case "tides":
        return [
          {
            type: "grid",
            name: "",
            schema: [
              { name: "high_tide_entity", selector: { entity: {} } },
              { name: "low_tide_entity", selector: { entity: {} } }
            ]
          }
        ];
      case "radar":
        return [
          { name: "image_url", selector: { text: {} } },
          { name: "refresh", selector: { number: { min: 5, mode: "box" } } }
        ];
      case "summary":
        return [
          { name: "summary_entity", selector: { entity: {} } },
          { name: "summary_sources", selector: { entity: { multiple: !0 } } }
        ];
      case "parts":
        return [
          {
            type: "grid",
            name: "",
            schema: [
              { name: "parts_morning", selector: { entity: {} } },
              { name: "parts_noon", selector: { entity: {} } },
              { name: "parts_evening", selector: { entity: {} } },
              { name: "parts_night", selector: { entity: {} } }
            ]
          }
        ];
      default:
        return [
          {
            type: "grid",
            name: "",
            schema: [
              {
                name: "type",
                selector: {
                  select: {
                    mode: "dropdown",
                    options: $i.map((n) => ({ value: n, label: k(this.hass, n) }))
                  }
                }
              },
              { name: "name", selector: { text: {} } }
            ]
          },
          { name: "entity", selector: { entity: {} } },
          ...i === "wind" ? [{ name: "entity2", selector: { entity: {} } }] : [],
          ...ki.includes(i) && s ? [{ name: "entities", selector: { entity: { multiple: !0 } } }] : [],
          ...i === "air_quality" && (!e.breakdown || e.breakdown.every((n) => typeof n == "string")) ? [{ name: "breakdown", selector: { entity: { multiple: !0 } } }] : []
        ];
    }
  }
  render() {
    return !this.hass || !this._config ? p : u`
      <ha-form
        .hass=${this.hass}
        .data=${{
      tiles: !0,
      background: !0,
      layout: "grid",
      card_style: "default",
      ...this._config
    }}
        .schema=${this._topSchema()}
        .computeLabel=${(e) => this._label(e.name)}
        @value-changed=${this._topChanged}
      ></ha-form>

      <div class="metrics">
        ${this._config.metrics.map((e, t) => this._renderMetricEditor(e, t))}
      </div>

      <button class="add" @click=${this._addMetric}>
        <ha-icon icon="mdi:plus"></ha-icon>
        ${this._label("add_metric")}
      </button>
    `;
  }
  _renderMetricEditor(e, t) {
    const i = e.type ?? "custom", r = Q[i] ?? Q.custom, s = this._expanded === t, n = this._config.metrics.length;
    return u`
      <div class="metric ${s ? "open" : ""}">
        <div
          class="metric-head"
          @click=${() => {
      this._expanded = s ? -1 : t, this._tab = "general";
    }}
        >
          <span class="chip" style="--c:${D(e.color) ?? D(r.color)}">
            <ha-icon .icon=${e.icon ?? r.icon}></ha-icon>
          </span>
          <span class="metric-title">
            ${e.name ?? k(this.hass, i)}
            <span class="metric-entity">${e.entity ?? ""}</span>
          </span>
          <button class="icon-btn" .disabled=${t === 0} title="↑" @click=${(o) => this._move(o, t, -1)}>
            <ha-icon icon="mdi:chevron-up"></ha-icon>
          </button>
          <button class="icon-btn" .disabled=${t === n - 1} title="↓" @click=${(o) => this._move(o, t, 1)}>
            <ha-icon icon="mdi:chevron-down"></ha-icon>
          </button>
          <button class="icon-btn danger" @click=${(o) => this._remove(o, t)}>
            <ha-icon icon="mdi:delete-outline"></ha-icon>
          </button>
          <ha-icon class="expand" icon=${s ? "mdi:chevron-up" : "mdi:chevron-down"}></ha-icon>
        </div>
        ${s ? this._renderMetricBody(e, t, i) : p}
      </div>
    `;
  }
  _renderMetricBody(e, t, i) {
    var n, o, a, c;
    const r = this._metricTabs(i), s = r.some((l) => l.id === this._tab) ? this._tab : "general";
    return u`<div class="metric-body">
      <div class="tabs">
        ${r.map(
      (l) => u`<button
            class="tab ${s === l.id ? "active" : ""}"
            @click=${() => this._tab = l.id}
          >
            <ha-icon .icon=${l.icon}></ha-icon>
            <span>${l.label}</span>
          </button>`
    )}
      </div>
      <ha-form
        .hass=${this.hass}
        .data=${{
      ...e,
      goal: typeof e.goal == "number" ? e.goal : void 0,
      goal_entity: typeof e.goal == "string" ? e.goal : void 0,
      start: typeof e.start == "number" ? e.start : void 0,
      start_entity: typeof e.start == "string" ? e.start : void 0,
      parts_morning: (n = e.parts) == null ? void 0 : n.morning,
      parts_noon: (o = e.parts) == null ? void 0 : o.noon,
      parts_evening: (a = e.parts) == null ? void 0 : a.evening,
      parts_night: (c = e.parts) == null ? void 0 : c.night
    }}
        .schema=${this._metricSchema(e, s)}
        .computeLabel=${(l) => this._label(l.name)}
        @value-changed=${(l) => this._metricChanged(l, t)}
      ></ha-form>
      ${s === "sky" ? this._renderAnchorEditor(e, t) : p}
    </div>`;
  }
  _anchorSchema() {
    return [
      { name: "entity", selector: { entity: {} } },
      {
        type: "grid",
        name: "",
        schema: [
          { name: "name", selector: { text: {} } },
          {
            name: "color",
            selector: {
              select: {
                mode: "dropdown",
                custom_value: !0,
                options: Jt.map((e) => ({ value: e, label: e }))
              }
            }
          },
          { name: "anchor_x", selector: { number: { min: 0, max: 100, mode: "box" } } },
          { name: "anchor_y", selector: { number: { min: 0, max: 100, mode: "box" } } },
          {
            name: "dot",
            selector: {
              select: {
                mode: "dropdown",
                options: [
                  { value: "left", label: "← " + this._label("dot_left") },
                  { value: "right", label: "→ " + this._label("dot_right") },
                  { value: "top", label: "↑ " + this._label("dot_top") },
                  { value: "bottom", label: "↓ " + this._label("dot_bottom") },
                  { value: "top-left", label: "↖" },
                  { value: "top-right", label: "↗" },
                  { value: "bottom-left", label: "↙" },
                  { value: "bottom-right", label: "↘" }
                ]
              }
            }
          }
        ]
      },
      { name: "entity2", selector: { entity: {} } }
    ];
  }
  _renderAnchorEditor(e, t) {
    const i = e.anchors ?? [];
    return u`
      <div class="anchor-editor">
        <div class="anchor-editor-title">${this._label("anchors")}</div>
        ${i.map(
      (r, s) => u`
            <div class="anchor-row">
              <ha-form
                .hass=${this.hass}
                .data=${{ ...r, anchor_x: r.x, anchor_y: r.y }}
                .schema=${this._anchorSchema()}
                .computeLabel=${(n) => this._label(n.name)}
                @value-changed=${(n) => this._anchorChanged(n, t, s)}
              ></ha-form>
              <button class="icon-btn danger" title="✕" @click=${() => this._removeAnchor(t, s)}>
                <ha-icon icon="mdi:delete-outline"></ha-icon>
              </button>
            </div>
          `
    )}
        <button class="add small" @click=${() => this._addAnchor(t)}>
          <ha-icon icon="mdi:plus"></ha-icon>
          ${this._label("add_anchor")}
        </button>
      </div>
    `;
  }
  _anchorChanged(e, t, i) {
    if (e.stopPropagation(), !this._config) return;
    const r = { ...e.detail.value }, s = {};
    r.entity && (s.entity = r.entity), r.entity2 && (s.entity2 = r.entity2), r.name && (s.name = r.name), r.color && (s.color = r.color), r.anchor_x !== void 0 && r.anchor_x !== null && (s.x = r.anchor_x), r.anchor_y !== void 0 && r.anchor_y !== null && (s.y = r.anchor_y), r.dot && (s.dot = r.dot);
    const n = [...this._config.metrics], o = [...n[t].anchors ?? []];
    o[i] = s, n[t] = { ...n[t], anchors: o }, this._emit({ ...this._config, metrics: n });
  }
  _addAnchor(e) {
    if (!this._config) return;
    const t = [...this._config.metrics], i = [...t[e].anchors ?? [], { entity: "", x: 50, y: 20 }];
    t[e] = { ...t[e], anchors: i }, this._emit({ ...this._config, metrics: t });
  }
  _removeAnchor(e, t) {
    if (!this._config) return;
    const i = [...this._config.metrics], r = (i[e].anchors ?? []).filter((s, n) => n !== t);
    i[e] = { ...i[e], anchors: r }, this._emit({ ...this._config, metrics: i });
  }
  _emit(e) {
    this._config = e, this.dispatchEvent(
      new CustomEvent("config-changed", { detail: { config: e }, bubbles: !0, composed: !0 })
    );
  }
  _clean(e) {
    const t = {};
    for (const [i, r] of Object.entries(e))
      r === "" || r === null || r === void 0 || Array.isArray(r) && !r.length || (t[i] = r);
    return t;
  }
  _topChanged(e) {
    if (e.stopPropagation(), !this._config) return;
    const t = e.detail.value;
    this._emit(this._clean({ ...this._config, ...t, metrics: this._config.metrics }));
  }
  _metricChanged(e, t) {
    if (e.stopPropagation(), !this._config) return;
    const i = { ...e.detail.value }, r = {};
    for (const n of ["morning", "noon", "evening", "night"]) {
      const o = i[`parts_${n}`];
      delete i[`parts_${n}`], typeof o == "string" && o && (r[n] = o);
    }
    Object.keys(r).length ? i.parts = r : delete i.parts;
    for (const n of ["goal", "start"]) {
      const o = i[`${n}_entity`];
      delete i[`${n}_entity`], typeof o == "string" && o && (i[n] = o);
    }
    const s = [...this._config.metrics];
    s[t] = this._clean(i), this._emit({ ...this._config, metrics: s });
  }
  _addMetric() {
    if (!this._config) return;
    const e = [...this._config.metrics, { type: "temperature" }];
    this._expanded = e.length - 1, this._emit({ ...this._config, metrics: e });
  }
  _remove(e, t) {
    if (e.stopPropagation(), !this._config) return;
    const i = this._config.metrics.filter((r, s) => s !== t);
    this._expanded === t && (this._expanded = -1), this._emit({ ...this._config, metrics: i });
  }
  _move(e, t, i) {
    if (e.stopPropagation(), !this._config) return;
    const r = [...this._config.metrics], s = t + i;
    s < 0 || s >= r.length || ([r[t], r[s]] = [r[s], r[t]], this._expanded === t && (this._expanded = s), this._emit({ ...this._config, metrics: r }));
  }
};
Y.styles = _e`
    .metrics {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-top: 16px;
    }
    .metric {
      border: 1px solid var(--divider-color);
      border-radius: 12px;
      overflow: hidden;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }
    .metric:hover {
      border-color: color-mix(in srgb, var(--primary-color) 50%, var(--divider-color));
    }
    .metric.open {
      border-color: var(--primary-color);
      box-shadow: 0 2px 12px color-mix(in srgb, var(--primary-color) 12%, transparent);
    }
    .metric-head {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      cursor: pointer;
      color: var(--primary-text-color);
    }
    .chip {
      width: 30px;
      height: 30px;
      flex: none;
      border-radius: 9px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--c, var(--primary-color));
      background: color-mix(in srgb, var(--c, var(--primary-color)) 15%, transparent);
    }
    .chip ha-icon {
      --mdc-icon-size: 17px;
    }
    .metric-title {
      flex: 1;
      font-weight: 500;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .metric-entity {
      color: var(--secondary-text-color);
      font-size: 12px;
      margin-left: 6px;
    }
    .metric-body {
      padding: 12px;
      border-top: 1px solid var(--divider-color);
    }
    .tabs {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      margin-bottom: 14px;
      padding-bottom: 10px;
      border-bottom: 1px solid var(--divider-color);
    }
    .tab {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 6px 11px;
      border: none;
      border-radius: 999px;
      background: none;
      cursor: pointer;
      color: var(--secondary-text-color);
      font-size: 12px;
      font-weight: 500;
      font-family: inherit;
    }
    .tab ha-icon {
      --mdc-icon-size: 15px;
    }
    .tab:hover {
      background: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
    }
    .tab.active {
      background: color-mix(in srgb, var(--primary-color) 14%, transparent);
      color: var(--primary-color);
    }
    .icon-btn {
      background: none;
      border: none;
      padding: 4px;
      cursor: pointer;
      color: var(--secondary-text-color);
      display: flex;
      border-radius: 6px;
    }
    .icon-btn:hover {
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
    }
    .icon-btn[disabled] {
      opacity: 0.3;
      cursor: default;
    }
    .icon-btn.danger:hover {
      color: var(--error-color, #db4437);
    }
    .icon-btn ha-icon {
      --mdc-icon-size: 18px;
    }
    .expand {
      color: var(--secondary-text-color);
    }
    .add {
      margin-top: 12px;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      color: var(--primary-color);
      background: color-mix(in srgb, var(--primary-color) 12%, transparent);
    }
    .add ha-icon {
      --mdc-icon-size: 18px;
    }
    .add.small {
      margin-top: 8px;
      padding: 6px 12px;
      font-size: 13px;
    }
    .anchor-editor {
      margin-top: 14px;
      padding-top: 12px;
      border-top: 1px solid var(--divider-color);
    }
    .anchor-editor-title {
      font-weight: 500;
      font-size: 14px;
      margin-bottom: 8px;
      color: var(--primary-text-color);
    }
    .anchor-row {
      display: flex;
      align-items: flex-start;
      gap: 6px;
      padding: 8px;
      margin-bottom: 8px;
      border: 1px solid var(--divider-color);
      border-radius: 10px;
    }
    .anchor-row ha-form {
      flex: 1;
      min-width: 0;
    }
  `;
ht([
  Wt({ attribute: !1 })
], Y.prototype, "hass", 2);
ht([
  L()
], Y.prototype, "_config", 2);
ht([
  L()
], Y.prototype, "_expanded", 2);
ht([
  L()
], Y.prototype, "_tab", 2);
Y = ht([
  ke("weatherglass-card-editor")
], Y);
var Ai = Object.defineProperty, Ni = Object.getOwnPropertyDescriptor, H = (e, t, i, r) => {
  for (var s = r > 1 ? void 0 : r ? Ni(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (s = (r ? o(t, i, s) : o(s)) || s);
  return r && s && Ai(t, i, s), s;
};
const Ei = "0.3.1", Fi = 5 * 60 * 1e3, Ci = 15 * 60 * 1e3, Ti = 15 * 60 * 1e3, Ri = ["default", "glass", "material", "bubble", "mirror"], Di = ["air_quality"], fe = [
  "temperature",
  "feels_like",
  "wind",
  "precipitation",
  "humidity",
  "uv",
  "pressure",
  "cloud",
  "sky"
], zi = {
  temperature: "temperature",
  feels_like: "temperature",
  wind: "wind_speed",
  precipitation: "precipitation",
  humidity: "humidity",
  pressure: "pressure",
  cloud: "cloud_coverage",
  uv: "uv_index"
}, gt = [
  { key: "day", kind: "hour", count: 24 },
  { key: "week", kind: "day", count: 7 },
  { key: "month", kind: "day", count: 30 },
  { key: "quarter", kind: "day", count: 90 },
  { key: "year", kind: "day", count: 365 },
  { key: "max", kind: "month", count: 60 }
];
let C = class extends K {
  constructor() {
    super(...arguments), this._history = {}, this._popup = null, this._popupRange = null, this._tileRanges = {}, this._statsCache = {}, this._forecasts = {}, this._statsCacheTime = {}, this._statsFetching = /* @__PURE__ */ new Set(), this._forecastTime = {}, this._forecastFetching = /* @__PURE__ */ new Set(), this._onKeydown = (e) => {
      e.key === "Escape" && this._popup !== null && (this._popup = null);
    }, this._fetching = !1, this._cfgSig = "", this._stateSig = "", this._lastFetch = 0;
  }
  connectedCallback() {
    super.connectedCallback(), window.addEventListener("keydown", this._onKeydown);
  }
  disconnectedCallback() {
    window.removeEventListener("keydown", this._onKeydown), super.disconnectedCallback();
  }
  static getConfigElement() {
    return document.createElement("weatherglass-card-editor");
  }
  static getStubConfig(e) {
    const t = Object.keys(e.states).find((r) => r.startsWith("weather.")), i = [];
    return t ? (i.push({ type: "sky", entity: t }), i.push({ type: "summary" })) : i.push({ type: "temperature", entity: "" }), { title: "Wetter", weather: t, metrics: i };
  }
  setConfig(e) {
    if (!e || !Array.isArray(e.metrics) || !e.metrics.length)
      throw new Error("Please define at least one metric (metrics: [...])");
    this._config = e;
  }
  getCardSize() {
    var t, i;
    return 1 + Math.ceil(
      (((t = this._config) == null ? void 0 : t.metrics.length) ?? 1) / (((i = this._config) == null ? void 0 : i.columns) ?? 1)
    ) * 2;
  }
  getGridOptions() {
    return { columns: 12, min_columns: 6 };
  }
  updated(e) {
    var t;
    super.updated(e), (e.has("hass") || e.has("_config")) && (this._maybeFetch(), this._syncForecasts()), this._syncStats(), (e.has("_popup") || e.has("_popupRange") || e.has("_tileRanges") || e.has("_statsCache")) && ((t = this.renderRoot) == null || t.querySelectorAll(".chart-scroll").forEach((i) => i.scrollLeft = i.scrollWidth));
  }
  _activeRange() {
    return gt.find((e) => e.key === this._popupRange) ?? null;
  }
  /* ---- forecast ------------------------------------------------------- */
  _defaultForecastType(e) {
    return e === "sky" || e === "summary" ? "daily" : "hourly";
  }
  /** The weather entity a metric draws its forecast from, if any. */
  _forecastId(e) {
    var t;
    return e.forecast ? e.forecast : pi(e.entity) ? e.entity : (t = this._config) == null ? void 0 : t.weather;
  }
  _forecastFor(e, t = "daily") {
    return e ? this._forecasts[`${e}|${t}`] ?? [] : [];
  }
  _syncForecasts() {
    if (!this.hass || !this._config) return;
    const e = /* @__PURE__ */ new Set(), t = this._config.weather;
    t && this.hass.states[t] && (e.add(`${t}|daily`), e.add(`${t}|hourly`)), this._config.metrics.forEach((i) => {
      const r = i.type ?? "custom", s = this._forecastId(i);
      !s || !this.hass.states[s] || (fe.includes(r) || r === "summary" || i.forecast) && e.add(`${s}|${i.forecast_type ?? this._defaultForecastType(r)}`);
    });
    for (const i of e) {
      const [r, s] = i.split("|");
      this._ensureForecast(r, s);
    }
  }
  _ensureForecast(e, t) {
    const i = `${e}|${t}`;
    this._forecasts[i] && Date.now() - (this._forecastTime[i] ?? 0) < Ti || this._forecastFetching.has(i) || (this._forecastFetching.add(i), hi(this.hass, e, t).then((s) => {
      this._forecastTime[i] = Date.now(), this._forecasts = { ...this._forecasts, [i]: s };
    }).catch((s) => console.warn("weatherglass-card: forecast fetch failed", s)).finally(() => this._forecastFetching.delete(i)));
  }
  /* ---- statistics + history ------------------------------------------ */
  _syncStats() {
    if (!this.hass || !this._config) return;
    const e = [];
    if (this._popup !== null) {
      const t = this._activeRange();
      t && e.push(t);
    }
    this._config.metrics.forEach((t, i) => {
      if (!t.expanded) return;
      const r = gt.find((s) => s.key === this._tileRanges[i]);
      r && e.push(r);
    });
    for (const t of e) {
      const i = t.kind === "month" ? "month" : t.kind === "day" && t.count > 10 ? "day" : null;
      i && this._ensureStats(i, t.count);
    }
  }
  _ensureStats(e, t) {
    const i = `${e}|${t}`;
    if (this._statsCache[i] && Date.now() - (this._statsCacheTime[i] ?? 0) < 18e5 || this._statsFetching.has(i)) return;
    const s = this._watchedEntities();
    s.length && (this._statsFetching.add(i), li(this.hass, s, t, e).then((n) => {
      this._statsCacheTime[i] = Date.now(), this._statsCache = { ...this._statsCache, [i]: n };
    }).catch((n) => console.warn("weatherglass-card: statistics fetch failed", n)).finally(() => this._statsFetching.delete(i)));
  }
  _bucketsFor(e, t, i, r) {
    var s, n;
    if (t === "hour")
      return di(this._history[e] ?? [], i, r);
    if (t === "month") {
      const o = (s = this._statsCache[`month|${i}`]) == null ? void 0 : s[e];
      return o != null && o.length ? me(o, i, r, "month") : new Array(i).fill(NaN);
    }
    if (i > 10) {
      const o = (n = this._statsCache[`day|${i}`]) == null ? void 0 : n[e];
      if (o != null && o.length) return me(o, i, r, "day");
    }
    return ci(this._history[e] ?? [], i, r);
  }
  _watchedEntities() {
    var t;
    const e = /* @__PURE__ */ new Set();
    for (const i of ((t = this._config) == null ? void 0 : t.metrics) ?? []) {
      for (const r of this._series(i)) r.entity && e.add(r.entity);
      for (const r of i.secondary ?? []) e.add(r);
      for (const r of Object.values(i.parts ?? {})) r && e.add(r);
      i.score_entity && e.add(i.score_entity), i.wind_entity && e.add(i.wind_entity);
      for (const r of i.anchors ?? [])
        e.add(r.entity), r.entity2 && e.add(r.entity2);
      for (const r of i.breakdown ?? []) e.add(typeof r == "string" ? r : r.entity);
    }
    return [...e].filter(
      (i) => {
        var r;
        return ((r = this.hass) == null ? void 0 : r.states[i]) && !i.startsWith("weather.");
      }
    );
  }
  _resolveGoal(e) {
    if (typeof e == "number") return e;
    if (typeof e != "string" || !e) return NaN;
    const t = this.hass.states[e];
    return parseFloat(t ? t.state : e);
  }
  _handleTap(e, t, i) {
    const r = e.tap_action ?? "popup";
    if (r !== "none") {
      if (r === "link") {
        if (!e.link) return;
        if (/^https?:\/\//.test(e.link)) {
          window.open(e.link, "_blank", "noopener");
          return;
        }
        history.pushState(null, "", e.link), this.dispatchEvent(new Event("location-changed", { bubbles: !0, composed: !0 }));
        return;
      }
      if (r === "more-info") {
        this._moreInfo(i);
        return;
      }
      this._popupRange = e.type === "precipitation" ? "week" : "day", this._popup = t;
    }
  }
  _maybeFetch() {
    if (!this.hass || !this._config || this._fetching) return;
    const e = this._watchedEntities();
    if (!e.length) return;
    const t = Math.max(
      ...this._config.metrics.map((o) => o.days ?? this._config.days ?? 7)
    ), i = `${t}|${e.join(",")}`, r = e.map((o) => {
      var a;
      return ((a = this.hass.states[o]) == null ? void 0 : a.last_updated) ?? "";
    }).join("|"), s = Date.now();
    (i !== this._cfgSig || s - this._lastFetch > Ci || r !== this._stateSig && s - this._lastFetch > Fi) && (this._fetching = !0, this._cfgSig = i, this._stateSig = r, ai(this.hass, e, t).then((o) => {
      this._history = o, this._lastFetch = Date.now();
    }).catch((o) => console.warn("weatherglass-card: history fetch failed", o)).finally(() => this._fetching = !1));
  }
  _series(e) {
    var i, r;
    if ((i = e.entities) != null && i.length)
      return e.entities.map((s) => typeof s == "string" ? { entity: s } : s);
    const t = [];
    return e.entity && t.push({ entity: e.entity }), e.entity2 && t.push({ entity: e.entity2 }), !t.length && e.type === "sky" && ((r = this._config) != null && r.weather) && t.push({ entity: this._config.weather }), t;
  }
  _numeric(e, t) {
    if (!e) return NaN;
    const i = t ? e.attributes[t] : e.state;
    return typeof i == "number" ? i : parseFloat(i);
  }
  _moreInfo(e) {
    e && this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        detail: { entityId: e },
        bubbles: !0,
        composed: !0
      })
    );
  }
  _cardStyle() {
    var t;
    const e = ((t = this._config) == null ? void 0 : t.card_style) ?? "default";
    return Ri.includes(e) ? e : "default";
  }
  render() {
    if (!this.hass || !this._config) return p;
    const e = this._config, i = [
      "cardroot",
      `s-${this._cardStyle()}`,
      e.tiles === !1 ? "flat" : "tiles",
      e.flush ? "flush" : ""
    ].join(" "), r = u`
      ${e.title ? u`<div class="header">
            <div class="title">${e.title}</div>
            ${e.subtitle ? u`<div class="subtitle">${e.subtitle}</div>` : p}
          </div>` : p}
      <div
        class="metrics ${e.layout === "carousel" ? "carousel" : ""}"
        style="--wc-columns:${e.columns ?? 1}"
      >
        ${e.metrics.map((s, n) => this._renderMetric(s, n))}
      </div>
    `;
    return u`
      ${e.background === !1 ? u`<div class="${i} nobg">${r}</div>` : u`<ha-card class=${i}>${r}</ha-card>`}
      ${this._renderPopup()}
    `;
  }
  _ctx(e, t) {
    var g, S, M;
    const i = e.type && Q[e.type] ? e.type : "custom", r = Q[i], s = D(e.color) ?? D(r.color), n = e.name ?? k(this.hass, i), o = e.icon ?? r.icon;
    let a = this._series(e);
    const c = Object.values(e.parts ?? {}).filter(Boolean);
    !a.length && i === "precipitation" && c.length && (a = [{ entity: c[0] }]);
    const l = (g = a[0]) != null && g.entity ? this.hass.states[a[0].entity] : void 0, h = (t == null ? void 0 : t.kind) ?? "day", d = Math.max(1, (t == null ? void 0 : t.count) ?? e.days ?? ((S = this._config) == null ? void 0 : S.days) ?? 7), f = e.graph ?? r.graph, y = e.aggregate ?? r.aggregate, _ = e.trend ?? r.trend, $ = e.precision ?? r.precision, x = e.unit ?? ((M = a[0]) == null ? void 0 : M.unit) ?? (l == null ? void 0 : l.attributes.unit_of_measurement) ?? r.unit ?? "", m = a.map((v, A) => {
      const F = this._bucketsFor(v.entity, h, d, y);
      return {
        ...v,
        colorResolved: D(v.color) ?? (A === 0 ? s : D(ut[(A - 1) % ut.length])),
        buckets: F,
        filled: Et(F)
      };
    });
    let b;
    if (i === "precipitation" && !e.entity && e.parts && m.length) {
      const v = c, A = v.map((O) => this._bucketsFor(O, h, d, y)), F = Array.from({ length: d }, (O, B) => {
        const pt = A.map((vt) => vt[B]).filter(Number.isFinite);
        return pt.length ? pt.reduce((vt, Ee) => vt + Ee, 0) : NaN;
      });
      m[0] = { ...m[0], buckets: F, filled: Et(F) };
      const tt = v.map((O) => this._numeric(this.hass.states[O])).filter(Number.isFinite);
      tt.length && (b = tt.reduce((O, B) => O + B, 0));
    }
    return {
      m: e,
      type: i,
      preset: r,
      accent: s,
      name: n,
      icon: o,
      series: a,
      primaryState: l,
      days: d,
      kind: h,
      graph: f,
      aggregate: y,
      trendMode: _,
      precision: $,
      unit: x,
      data: m,
      valueOverride: b,
      goalType: e.goal_type ?? r.goalType ?? "atleast",
      multi: !!e.entities && a.length > 1
    };
  }
  _renderMetric(e, t) {
    var c, l;
    const i = this._ctx(e);
    if (i.type === "summary") return this._renderSummary(i, t);
    if (i.type === "sun") return this._renderSun(i, t);
    if (i.type === "moon") return this._renderMoon(i, t);
    if (i.type === "tides") return this._renderTides(i, t);
    if (i.type === "radar") return this._renderRadar(i, t);
    if (!i.series.length || !i.primaryState)
      return u`
        <div class="metric" style="--wc-accent:${i.accent}">
          <div class="head">
            <div class="iconchip"><ha-icon .icon=${i.icon}></ha-icon></div>
            <div class="name">${i.name}</div>
          </div>
          <div class="missing">
            ${(c = i.series[0]) != null && c.entity ? u`${k(this.hass, "entity_missing")}: ${i.series[0].entity}` : k(this.hass, "no_data")}
          </div>
        </div>
      `;
    if (i.type === "sky") return this._renderSky(i, t);
    if (i.type === "pollen") return this._renderPollen(i, t);
    if (Di.includes(i.type)) return this._renderScore(i, t);
    if (e.expanded) {
      const h = gt.find((y) => y.key === this._tileRanges[t]) ?? null, d = h ? this._ctx(e, h) : i, f = this._tileRanges[t] ?? (d.days === 7 && d.kind === "day" ? "week" : "");
      return u`
        <div
          class="metric expanded ${(e.tap_action ?? "popup") === "none" ? "noclick" : ""}"
          style="--wc-accent:${i.accent}"
          @click=${() => this._handleTap(e, t, i.series[0].entity)}
        >
          <div class="head">
            <div class="iconchip"><ha-icon .icon=${i.icon}></ha-icon></div>
            <div class="name">${i.name}</div>
            ${this._renderScoreBadge(e)}
            <div class="time">${W(this.hass, i.primaryState.last_updated)}</div>
          </div>
          <div class="exp-value">
            ${this._renderValue(e, d)}
            ${this._renderStatus(e, d)}
          </div>
          ${this._renderDetails(e, d, f, (y) => {
        this._tileRanges = { ...this._tileRanges, [t]: y };
      })}
        </div>
      `;
    }
    const r = !i.multi || !!e.label, s = i.multi && i.graph !== "progress", n = !i.multi, o = i.multi && i.graph === "progress", a = this._metricForecast(e);
    return u`
      <div
        class="metric ${(e.tap_action ?? "popup") === "none" ? "noclick" : ""}"
        style="--wc-accent:${i.accent}"
        @click=${() => this._handleTap(e, t, i.series[0].entity)}
      >
        <div class="head">
          <div class="iconchip"><ha-icon .icon=${i.icon}></ha-icon></div>
          <div class="name">${i.name}</div>
          ${this._renderScoreBadge(e)}
          <div class="time">${W(this.hass, i.primaryState.last_updated)}</div>
        </div>
        <div class="body ${o ? "stack" : ""}">
          ${r || s || n || (l = e.secondary) != null && l.length ? u`<div class="info">
                ${r ? this._renderValue(e, i) : p}
                ${s ? this._renderSeriesChips(i.data, i.precision, i.trendMode) : p}
                ${this._renderSecondary(e)}
                ${n ? this._renderStatus(e, i) : p}
              </div>` : p}
          <div class="chartcell">
            ${this._renderChart(e, i.graph, i.data, i.unit, i.precision)}
          </div>
        </div>
        ${i.type === "precipitation" && e.parts ? this._renderParts(e) : p}
        ${a ? this._renderForecast(a.points, a.type, e.forecast_count ?? 8) : p}
      </div>
    `;
  }
  /* ---- forecast strip ------------------------------------------------- */
  _metricForecast(e) {
    const t = e.type ?? "custom";
    if (!fe.includes(t) && !e.forecast) return;
    const i = this._forecastId(e), r = e.forecast_type ?? this._defaultForecastType(t), s = this._forecastFor(i, r);
    return s.length ? { points: s, type: r } : void 0;
  }
  /**
   * Numeric forecast series for a metric's tile chart (forecast-first view).
   * Returns undefined when the metric opted into history (`chart_source`),
   * has no matching forecast field or the forecast is too thin to plot.
   */
  _forecastChartData(e, t) {
    if ((e.chart_source ?? "forecast") === "history") return;
    const i = zi[t];
    if (!i) return;
    const r = this._metricForecast(e);
    if (!r) return;
    const s = r.type === "hourly", n = e.forecast_count ?? (s ? 18 : 7), o = r.points.slice(0, n), a = o.map((h) => {
      const d = h[i];
      return typeof d == "number" && Number.isFinite(d) ? d : NaN;
    });
    if (a.filter(Number.isFinite).length < 2) return;
    const c = P(this.hass), l = [];
    return o.forEach((h, d) => {
      const f = new Date(h.datetime);
      if (!isNaN(f.getTime()))
        if (s) {
          const y = f.getHours();
          y % 6 === 0 && l.push({ i: d, label: String(y), line: y === 0 });
        } else
          l.push({ i: d, label: f.toLocaleDateString(c, { weekday: "narrow" }) });
    }), { values: a, xMarks: l };
  }
  _fcLabel(e, t, i) {
    const r = new Date(e.datetime);
    return isNaN(r.getTime()) ? "" : t === "hourly" ? i ? k(this.hass, "now") : r.toLocaleTimeString(P(this.hass), { hour: "2-digit" }) : i ? k(this.hass, "today") : r.toLocaleDateString(P(this.hass), { weekday: "short" });
  }
  _renderForecast(e, t, i) {
    const r = e.slice(0, i);
    return u`<div class="forecast">
      ${r.map((s, n) => {
      const o = s.is_daytime ?? !0, a = s.precipitation_probability, c = typeof a == "number" && a >= 5 ? u`<span class="fc-pop">${N(this.hass, a, 0)}%</span>` : typeof s.precipitation == "number" && s.precipitation >= 0.2 ? u`<span class="fc-pop">${N(this.hass, s.precipitation, 1)}</span>` : u`<span class="fc-pop empty"></span>`;
      return u`<div class="fc-step">
          <span class="fc-when">${this._fcLabel(s, t, n === 0)}</span>
          <ha-icon class="fc-ico" .icon=${ee(s.condition, o)}></ha-icon>
          ${c}
          <span class="fc-temp">
            ${typeof s.temperature == "number" ? u`${N(this.hass, s.temperature, 0)}°` : "–"}
            ${t !== "hourly" && typeof s.templow == "number" ? u`<span class="fc-lo">${N(this.hass, s.templow, 0)}°</span>` : p}
          </span>
        </div>`;
    })}
    </div>`;
  }
  /* ---- air quality / index ring -------------------------------------- */
  _breakdown(e) {
    return (e.breakdown ?? []).map((t, i) => {
      const r = typeof t == "string" ? { entity: t } : t, s = this.hass.states[r.entity];
      return {
        ...r,
        state: s,
        value: this._numeric(s),
        name: r.name ?? (s == null ? void 0 : s.attributes.friendly_name) ?? r.entity,
        colorResolved: D(r.color) ?? D(te[i % te.length])
      };
    }).filter((t) => t.state);
  }
  _renderScore(e, t) {
    const i = e.m, r = e.primaryState, s = this._numeric(r, i.attribute), n = i.max ?? 100, o = (i.goal_type ?? e.preset.goalType) !== "atmost", a = this._breakdown(i), c = a.filter((d) => Number.isFinite(d.value) && d.value > 0), l = c.reduce((d, f) => d + f.value, 0), h = l > 0 ? c.map((d) => ({ color: d.colorResolved, share: d.value / l })) : void 0;
    return u`
      <div
        class="metric score-metric ${(i.tap_action ?? "popup") === "none" ? "noclick" : ""}"
        style="--wc-accent:${e.accent}"
        @click=${() => this._handleTap(i, t, r.entity_id)}
      >
        <div class="head">
          <div class="iconchip"><ha-icon .icon=${e.icon}></ha-icon></div>
          <div class="name">${e.name}</div>
          <div class="time">${W(this.hass, r.last_updated)}</div>
        </div>
        <div class="scorewrap">
          ${gi(
      this._cardStyle(),
      e.accent,
      this._scoreColor(s, n, o),
      Math.max(0, Math.min(Number.isFinite(s) ? s / n : 0, 1)),
      h
    )}
          <div class="scoreinner">
            <div class="scorenum">${N(this.hass, s, i.precision ?? 0)}</div>
            <div class="scoremax">${k(this.hass, "of")} ${n}</div>
          </div>
        </div>
        ${a.length ? u`<div class="score-bars">
              ${a.map((d) => {
      const f = Number.isFinite(d.value) ? Math.max(0, Math.min(d.value / n * 100, 100)) : 0;
      return u`<div class="sbar">
                  <span class="sbar-name">${d.name}</span>
                  <div class="sbar-track">
                    <div
                      class="sbar-fill"
                      style="width:${f}%;background:${d.colorResolved}"
                    ></div>
                  </div>
                  <span class="sbar-val">
                    ${Number.isFinite(d.value) ? N(this.hass, d.value, 0) : "–"}
                  </span>
                </div>`;
    })}
            </div>` : p}
        <div class="score-status">${this._renderStatus(i, e)}</div>
      </div>
    `;
  }
  /* ---- sun / daylight arc -------------------------------------------- */
  _sunTimes(e) {
    var o, a;
    const t = (c) => {
      if (!c) return;
      const l = new Date(c);
      if (!isNaN(l.getTime())) return l;
      const h = /^(\d{1,2}):(\d{2})/.exec(c);
      if (h) {
        const d = /* @__PURE__ */ new Date();
        return d.setHours(+h[1], +h[2], 0, 0), d;
      }
    };
    let i = t((o = this.hass.states[e.sunrise_entity ?? ""]) == null ? void 0 : o.state), r = t((a = this.hass.states[e.sunset_entity ?? ""]) == null ? void 0 : a.state);
    const s = this.hass.states[e.sun_entity ?? "sun.sun"], n = s ? s.state === "above_horizon" : !0;
    if (s && (!i || !r)) {
      const c = t(s.attributes.next_rising), l = t(s.attributes.next_setting);
      n ? (r = r ?? l, i = i ?? (c ? new Date(c.getTime() - 864e5) : void 0)) : (i = i ?? c, r = r ?? l);
    }
    return { sunrise: i, sunset: r, up: n };
  }
  _renderSun(e, t) {
    const i = e.m, { sunrise: r, sunset: s, up: n } = this._sunTimes(i);
    let o = 0.5;
    r && s && s > r && (o = (Date.now() - r.getTime()) / (s.getTime() - r.getTime()));
    const a = r && s && s > r ? s.getTime() - r.getTime() : NaN, c = n ? s && s > /* @__PURE__ */ new Date() ? k(this.hass, "sunset_in").replace("{n}", pe(s)) : "" : r && r > /* @__PURE__ */ new Date() ? k(this.hass, "sunrise_in").replace("{n}", pe(r)) : "", l = i.entity ?? i.sun_entity ?? "sun.sun";
    return u`
      <div
        class="metric sun-metric ${(i.tap_action ?? "more-info") === "none" ? "noclick" : ""}"
        style="--wc-accent:${e.accent}"
        @click=${() => this._handleTap({ tap_action: "more-info", ...i }, t, l)}
      >
        <div class="head">
          <div class="iconchip"><ha-icon .icon=${e.icon}></ha-icon></div>
          <div class="name">${e.name}</div>
        </div>
        <div class="sunwrap">${yi(o, !n, e.accent)}</div>
        <div class="sun-times">
          <div class="sun-end">
            <ha-icon icon="mdi:weather-sunset-up"></ha-icon>
            <span>${r ? ft(this.hass, r.toISOString()) : "–"}</span>
          </div>
          ${Number.isFinite(a) ? u`<div class="sun-daylen">
                ${rt(a / 6e4, "min")}
              </div>` : p}
          <div class="sun-end">
            <span>${s ? ft(this.hass, s.toISOString()) : "–"}</span>
            <ha-icon icon="mdi:weather-sunset-down"></ha-icon>
          </div>
        </div>
        ${c ? u`<div class="sun-note">${c}</div>` : p}
      </div>
    `;
  }
  _renderMoon(e, t) {
    const i = e.m, r = e.primaryState, s = r == null ? void 0 : r.state, n = s ? C.MOON_MAP[s] : void 0;
    let o = n ? n[0] : NaN;
    const a = n ? n[1] : !0, c = i.illumination_entity ? this._numeric(this.hass.states[i.illumination_entity]) : n ? NaN : this._numeric(r);
    Number.isFinite(c) && (o = c > 1 ? c / 100 : c), Number.isFinite(o) || (o = 0);
    const l = n ? k(this.hass, `moon_${s}`) : s ?? "", h = i.entity ?? i.moon_entity ?? i.illumination_entity;
    return u`
      <div
        class="metric moon-metric ${(i.tap_action ?? "more-info") === "none" ? "noclick" : ""}"
        style="--wc-accent:${e.accent}"
        @click=${() => this._handleTap({ tap_action: "more-info", ...i }, t, h)}
      >
        <div class="head">
          <div class="iconchip"><ha-icon .icon=${e.icon}></ha-icon></div>
          <div class="name">${e.name}</div>
          ${r ? u`<div class="time">${W(this.hass, r.last_updated)}</div>` : p}
        </div>
        <div class="moonwrap">${_i(o, a)}</div>
        <div class="moon-phase" style="color:${e.accent}">${l}</div>
        <div class="moon-note">${k(this.hass, "illumination")}: ${N(this.hass, o * 100, 0)}%</div>
      </div>
    `;
  }
  /* ---- tides ---------------------------------------------------------- */
  _parseTime(e) {
    if (!e) return;
    const t = new Date(e);
    if (!isNaN(t.getTime())) return t;
    const i = /^(\d{1,2}):(\d{2})/.exec(e);
    if (i) {
      const r = /* @__PURE__ */ new Date();
      return r.setHours(+i[1], +i[2], 0, 0), r;
    }
  }
  _renderTides(e, t) {
    var l, h, d, f;
    const i = e.m, r = e.primaryState, s = this._numeric(r, i.attribute), n = r ? Et(this._bucketsFor(r.entity_id, "hour", 24, e.aggregate)) : [], o = this._parseTime((l = this.hass.states[i.high_tide_entity ?? ""]) == null ? void 0 : l.state) ?? this._parseTime((h = r == null ? void 0 : r.attributes) == null ? void 0 : h.next_high_tide), a = this._parseTime((d = this.hass.states[i.low_tide_entity ?? ""]) == null ? void 0 : d.state) ?? this._parseTime((f = r == null ? void 0 : r.attributes) == null ? void 0 : f.next_low_tide), c = i.entity ?? i.high_tide_entity;
    return u`
      <div
        class="metric tides-metric ${(i.tap_action ?? "popup") === "none" ? "noclick" : ""}"
        style="--wc-accent:${e.accent}"
        @click=${() => this._handleTap(i, t, c)}
      >
        <div class="head">
          <div class="iconchip"><ha-icon .icon=${e.icon}></ha-icon></div>
          <div class="name">${e.name}</div>
          ${r ? u`<div class="time">${W(this.hass, r.last_updated)}</div>` : p}
        </div>
        ${Number.isFinite(s) ? u`<div class="value">
              ${N(this.hass, s, e.precision)}<span class="unit">${e.unit}</span>
            </div>` : p}
        <div class="tidewrap">${bi(n, e.accent)}</div>
        ${o || a ? u`<div class="tide-times">
              ${o ? u`<div class="tide-end">
                    <ha-icon icon="mdi:arrow-up-bold"></ha-icon>
                    <span>${k(this.hass, "high_tide")} ${ft(this.hass, o.toISOString())}</span>
                  </div>` : p}
              ${a ? u`<div class="tide-end">
                    <ha-icon icon="mdi:arrow-down-bold"></ha-icon>
                    <span>${k(this.hass, "low_tide")} ${ft(this.hass, a.toISOString())}</span>
                  </div>` : p}
            </div>` : p}
      </div>
    `;
  }
  /* ---- pollen --------------------------------------------------------- */
  _pollenValue(e, t = 5) {
    if (!e) return NaN;
    const i = this._numeric(e);
    if (Number.isFinite(i)) return i;
    const r = e.state.toLowerCase().replace(/[\s_-]/g, ""), s = {
      none: 0,
      keine: 0,
      no: 0,
      verylow: 1,
      sehrgering: 1,
      verygering: 1,
      low: 2,
      gering: 2,
      niedrig: 2,
      moderate: 3,
      mäßig: 3,
      maessig: 3,
      medium: 3,
      mittel: 3,
      high: 4,
      hoch: 4,
      veryhigh: 5,
      sehrhoch: 5,
      extreme: 5
    };
    return r in s ? s[r] / 5 * t : NaN;
  }
  _pollenColor(e, t) {
    const i = Number.isFinite(e) ? e / t : 0;
    return i <= 0.05 ? "var(--grey-color, #9E9E9E)" : i < 0.4 ? "var(--green-color, #4CAF50)" : i < 0.7 ? "var(--amber-color, #FFC107)" : "var(--red-color, #F44336)";
  }
  _renderPollen(e, t) {
    const i = e.m, r = i.max ?? 5, s = e.series.map((n) => {
      const o = this.hass.states[n.entity], a = this._pollenValue(o, r), c = Number.isFinite(a) ? Math.max(0, Math.min(Math.round(a / r * 5), 5)) : 0;
      return {
        name: n.name ?? (o == null ? void 0 : o.attributes.friendly_name) ?? n.entity,
        value: a,
        color: D(n.color) ?? this._pollenColor(a, r),
        level: k(this.hass, `pollen_lvl_${c}`)
      };
    });
    return u`
      <div
        class="metric pollen-metric ${(i.tap_action ?? "popup") === "none" ? "noclick" : ""}"
        style="--wc-accent:${e.accent}"
        @click=${() => this._handleTap(i, t, e.series[0].entity)}
      >
        <div class="head">
          <div class="iconchip"><ha-icon .icon=${e.icon}></ha-icon></div>
          <div class="name">${e.name}</div>
          ${this._renderScoreBadge(i)}
        </div>
        <div class="pbars">
          ${s.map(
      (n) => u`<div class="pbar">
              <div class="pbar-label">
                <span>${n.name}</span>
                <span style="color:${n.color};font-weight:700">${n.level}</span>
              </div>
              <div class="ptrack" style="--wc-p:${n.color}">
                <div
                  class="pfill"
                  style="width:${Number.isFinite(n.value) ? Math.max(0, Math.min(n.value / r * 100, 100)) : 0}%"
                ></div>
              </div>
            </div>`
    )}
        </div>
      </div>
    `;
  }
  /* ---- radar ---------------------------------------------------------- */
  _renderRadar(e, t) {
    const i = e.m, r = e.primaryState;
    let s = i.image_url;
    !s && r && (s = r.attributes.entity_picture);
    const n = i.entity;
    return u`
      <div
        class="metric radar-metric ${(i.tap_action ?? (i.entity ? "more-info" : "none")) === "none" ? "noclick" : ""}"
        style="--wc-accent:${e.accent}"
        @click=${() => n && this._handleTap({ tap_action: "more-info", ...i }, t, n)}
      >
        <div class="head">
          <div class="iconchip"><ha-icon .icon=${e.icon}></ha-icon></div>
          <div class="name">${e.name}</div>
          ${r ? u`<div class="time">${W(this.hass, r.last_updated)}</div>` : p}
        </div>
        ${s ? u`<div class="radarframe">
              <img class="radar-img" src=${s} alt="" />
            </div>` : u`<div class="missing">${k(this.hass, "no_data")}</div>`}
      </div>
    `;
  }
  /* ---- sky hero scene ------------------------------------------------- */
  _weatherAttr(e, t) {
    var s;
    if (!e) return NaN;
    const i = this.hass.states[e], r = (s = i == null ? void 0 : i.attributes) == null ? void 0 : s[t];
    return typeof r == "number" ? r : parseFloat(r);
  }
  _renderSky(e, t) {
    var A, F, tt, O;
    const i = e.m, r = e.primaryState, s = r.entity_id.startsWith("weather."), n = (i.condition_entity ? (A = this.hass.states[i.condition_entity]) == null ? void 0 : A.state : void 0) ?? (s ? r.state : void 0), o = this.hass.states[i.sun_entity ?? "sun.sun"], a = i.night === !0 ? !1 : o ? o.state === "above_horizon" : !0, c = (F = o == null ? void 0 : o.attributes) == null ? void 0 : F.elevation, l = i.night === !0 ? -20 : typeof c == "number" && Number.isFinite(c) ? c : void 0, h = i.wind_entity ?? (s ? r.entity_id : void 0), d = i.wind_entity ? this._numeric(this.hass.states[i.wind_entity]) : this._weatherAttr(h, "wind_speed"), f = Number.isFinite(d) ? Math.min(d / 60, 1) : 0.15, y = i.score_entity ? this._numeric(this.hass.states[i.score_entity]) : NaN, _ = Number.isFinite(y) ? Math.min(0.2 + y / 100 * 0.7, 1) : 0, $ = Number.isFinite(y) ? this._scoreColor(y, 100, !1) : "transparent", x = s ? this._weatherAttr(r.entity_id, "temperature") : this._numeric(r), m = s ? ((O = (tt = this.hass.states[r.entity_id]) == null ? void 0 : tt.attributes) == null ? void 0 : O.temperature_unit) ?? "°" : r.attributes.unit_of_measurement ?? "°", g = this._forecastFor(this._forecastId(i), "daily")[0], S = g == null ? void 0 : g.temperature, M = g == null ? void 0 : g.templow, v = (i.anchors ?? []).filter((B) => this.hass.states[B.entity]);
    return u`
      <div
        class="metric sky-metric ${(i.tap_action ?? "popup") === "none" ? "noclick" : ""}"
        style="--wc-accent:${e.accent}"
        @click=${() => this._handleTap(i, t, r.entity_id)}
      >
        <div class="head">
          <div class="iconchip"><ha-icon .icon=${ee(n, a)}></ha-icon></div>
          <div class="name">${e.name}</div>
          ${this._renderScoreBadge(i)}
          <div class="time">${W(this.hass, r.last_updated)}</div>
        </div>
        <div class="skywrap" style="--wc-oy:${i.scene_offset_y ?? 0}%">
          ${ni({ condition: n, isDay: a, elevation: l, wind: f, glow: _, glowColor: $ })}
          <div class="sky-overlay">
            <div class="sky-temp">
              ${Number.isFinite(x) ? u`${N(this.hass, x, e.precision)}<span class="sky-unit">${m}</span>` : p}
            </div>
            <div class="sky-cond">${Nt(this.hass, n) || (n ?? "")}</div>
            ${Number.isFinite(S) || Number.isFinite(M) ? u`<div class="sky-hilo">
                  ${Number.isFinite(S) ? u`<span><ha-icon icon="mdi:arrow-up-thin"></ha-icon>${N(this.hass, S, 0)}°</span>` : p}
                  ${Number.isFinite(M) ? u`<span><ha-icon icon="mdi:arrow-down-thin"></ha-icon>${N(this.hass, M, 0)}°</span>` : p}
                </div>` : p}
          </div>
          ${v.map((B, pt) => this._renderAnchor(B, pt, i))}
        </div>
        ${this._renderForecast(
      this._forecastFor(this._forecastId(i), i.forecast_type ?? "daily"),
      i.forecast_type ?? "daily",
      i.forecast_count ?? 7
    )}
      </div>
    `;
  }
  _renderAnchor(e, t, i) {
    const r = C.SKY_ANCHOR_POS[e.position ?? "top-right"], s = this.hass.states[e.entity];
    if (!r || !s) return p;
    let n;
    if (e.dot) n = e.dot;
    else {
      let f = r.dir;
      e.flip && (f = f === "right" ? "left" : f === "left" ? "right" : f), n = f;
    }
    const o = e.x ?? r.x, a = e.y ?? r.y, c = D(e.color) ?? D(ut[t % ut.length]), l = this._numeric(s);
    let h;
    if (e.entity2) {
      const f = this._numeric(this.hass.states[e.entity2]);
      h = `${N(this.hass, l, 0)}/${N(this.hass, f, 0)}`;
    } else
      h = Number.isFinite(l) ? E(N(this.hass, l), s.attributes.unit_of_measurement ?? "") : s.state;
    const d = i.label_opacity ?? 1;
    return u`<div
      class="anchor dot-${n}"
      style="left:${o}%;top:${a}%;--ac:${c};--wc-label-op:${d}"
    >
      <span class="anchor-dot"></span>
      <div class="anchor-chip">
        <span class="anchor-name">${e.name ?? s.attributes.friendly_name ?? ""}</span>
        <span class="anchor-val">${h}</span>
      </div>
    </div>`;
  }
  /* ---- AI summary ----------------------------------------------------- */
  _summarySnapshot(e) {
    var y, _, $, x, m, b, g, S, M, v;
    const t = this._forecastId(e), i = t ? this.hass.states[t] : void 0, r = this._forecastFor(t, "daily"), s = this._forecastFor(t, "hourly"), n = (A) => this._weatherAttr(t, A), o = (A) => A ? this._numeric(this.hass.states[A]) : NaN, a = e.summary_sources ?? [], c = (A) => a.map((F) => this.hass.states[F]).find((F) => (F == null ? void 0 : F.attributes.device_class) === A), l = (A) => this._numeric(c(A)), h = i != null && i.entity_id.startsWith("weather.") ? i.state : void 0, d = n("wind_bearing"), f = s.slice(0, 12).map((A) => A.precipitation_probability ?? 0);
    return {
      condition: Nt(this.hass, h),
      temp: it(n("temperature"), l("temperature")),
      tempUnit: ((y = i == null ? void 0 : i.attributes) == null ? void 0 : y.temperature_unit) ?? "°C",
      hi: (_ = r[0]) == null ? void 0 : _.temperature,
      lo: ($ = r[0]) == null ? void 0 : $.templow,
      feels: it(n("apparent_temperature"), o((x = e.summary_sources) == null ? void 0 : x[0])),
      windSpeed: it(n("wind_speed"), l("wind_speed")),
      windUnit: ((m = i == null ? void 0 : i.attributes) == null ? void 0 : m.wind_speed_unit) ?? "km/h",
      windDir: he(this.hass, d),
      precipProb: f.length ? Math.max(...f) : (b = r[0]) == null ? void 0 : b.precipitation_probability,
      precipMm: (g = r[0]) == null ? void 0 : g.precipitation,
      uv: it(n("uv_index"), l("uv_index")),
      humidity: it(n("humidity"), l("humidity")),
      tomorrowCondition: Nt(this.hass, (S = r[1]) == null ? void 0 : S.condition),
      tomorrowHi: (M = r[1]) == null ? void 0 : M.temperature,
      tomorrowLo: (v = r[1]) == null ? void 0 : v.templow
    };
  }
  _renderSummary(e, t) {
    var n;
    const i = e.m, r = i.summary_entity ? (n = this.hass.states[i.summary_entity]) == null ? void 0 : n.state : void 0, s = r && r !== "unknown" && r !== "unavailable" ? r : oi(this.hass, this._summarySnapshot(i));
    return u`
      <div
        class="metric summary-metric ${(i.tap_action ?? "none") === "none" ? "noclick" : ""}"
        style="--wc-accent:${e.accent}"
        @click=${() => i.summary_entity && this._handleTap(i, t, i.summary_entity)}
      >
        <div class="head">
          <div class="iconchip"><ha-icon .icon=${e.icon}></ha-icon></div>
          <div class="name">${e.name}</div>
        </div>
        <div class="summary-text">${s || k(this.hass, "no_data")}</div>
        ${r ? p : u`<div class="summary-note">
              <ha-icon icon="mdi:creation"></ha-icon>
              <span>${k(this.hass, "ai_note")}</span>
            </div>`}
      </div>
    `;
  }
  /* ---- shared value / status / chart rendering ----------------------- */
  _scoreColor(e, t, i = !0) {
    let r = Number.isFinite(e) ? e / t : 0;
    return i || (r = 1 - r), r >= 0.66 ? "var(--success-color, #43a047)" : r >= 0.4 ? "var(--warning-color, #fb8c00)" : "var(--error-color, #e53935)";
  }
  _renderScoreBadge(e) {
    if (!e.score_entity) return p;
    const t = this._numeric(this.hass.states[e.score_entity]);
    return Number.isFinite(t) ? u`<span class="scorebadge" style="background:${this._scoreColor(t, 100, !1)}">
      ${N(this.hass, t, 0)}
    </span>` : p;
  }
  _fmtMetricValue(e, t) {
    var i;
    return e.m.duration ?? e.preset.duration ? rt(t, e.m.unit ?? ((i = e.primaryState) == null ? void 0 : i.attributes.unit_of_measurement)) : E(N(this.hass, t, e.precision), e.unit);
  }
  _xMarks(e, t) {
    const i = P(this.hass), r = [];
    if (e === "hour") {
      const a = /* @__PURE__ */ new Date();
      a.setMinutes(0, 0, 0);
      const c = a.getTime() - (t - 1) * 36e5;
      for (let l = 0; l < t; l++) {
        const h = new Date(c + l * 36e5).getHours();
        h % 6 === 0 && r.push({ i: l, label: String(h), line: h === 0 });
      }
      return r;
    }
    if (e === "month") {
      const a = /* @__PURE__ */ new Date();
      for (let c = 0; c < t; c++) {
        const l = new Date(a.getFullYear(), a.getMonth() - (t - 1 - c), 1);
        l.getMonth() === 0 && r.push({ i: c, label: String(l.getFullYear()), line: !0 });
      }
      return r;
    }
    const s = /* @__PURE__ */ new Date();
    if (s.setHours(0, 0, 0, 0), s.setDate(s.getDate() - (t - 1)), t <= 14) {
      for (let a = 0; a < t; a++) {
        const c = new Date(s.getTime() + a * 864e5);
        r.push({ i: a, label: c.toLocaleDateString(i, { weekday: "narrow" }) });
      }
      return r;
    }
    let n = 0, o = 0;
    for (let a = 0; a < t; a++) {
      const c = new Date(s.getTime() + a * 864e5);
      t <= 45 ? c.getDay() === 1 && r.push({
        i: a,
        label: n++ % 2 === 0 ? c.toLocaleDateString(i, { day: "numeric", month: "numeric" }) : void 0,
        line: !0
      }) : c.getDate() === 1 && (r.push({
        i: a,
        label: t <= 120 || o % 2 === 0 ? c.toLocaleDateString(i, { month: "short" }) : void 0,
        line: !0
      }), o++);
    }
    return r;
  }
  _renderEventTimes(e) {
    const t = (this._history[e] ?? []).filter((o) => o.v > 0);
    if (!t.length) return p;
    const i = P(this.hass), r = /* @__PURE__ */ new Date();
    r.setHours(0, 0, 0, 0);
    const s = r.getTime() - 6 * 864e5, n = Array.from({ length: 7 }, (o, a) => {
      const c = s + a * 864e5;
      return {
        date: new Date(c),
        events: t.filter((l) => l.t >= c && l.t < c + 864e5)
      };
    });
    return u`<div class="times">
      <div class="times-title">${k(this.hass, "event_times")}</div>
      ${n.map(
      (o) => u`<div class="times-row">
          <span class="times-day">${o.date.toLocaleDateString(i, { weekday: "short" })}</span>
          <div class="times-track">
            ${o.events.map(
        (a) => u`<span
                class="times-dot"
                style="left:${(a.t - o.date.getTime()) / 864e5 * 100}%"
                title=${new Date(a.t).toLocaleTimeString(i, { hour: "2-digit", minute: "2-digit" })}
              ></span>`
      )}
          </div>
          <span class="times-count">${o.events.length}×</span>
        </div>`
    )}
      <div class="times-hours"><span>0</span><span>6</span><span>12</span><span>18</span><span>24</span></div>
    </div>`;
  }
  _renderDetails(e, t, i, r) {
    var x;
    const s = t.data[0].buckets.filter(Number.isFinite), n = Ft(t.data[0].filled), o = this._resolveGoal(e.goal), a = t.valueOverride ?? this._numeric(t.primaryState, e.attribute), c = [];
    if (s.length && (c.push(
      { label: k(this.hass, "stat_min"), value: this._fmtMetricValue(t, Math.min(...s)) },
      {
        label: k(this.hass, "stat_avg"),
        value: this._fmtMetricValue(t, s.reduce((m, b) => m + b, 0) / s.length)
      },
      { label: k(this.hass, "stat_max"), value: this._fmtMetricValue(t, Math.max(...s)) }
    ), Number.isFinite(n) && n !== 0 && c.push({
      label: k(this.hass, "stat_trend"),
      value: `${n > 0 ? "+" : ""}${this._fmtMetricValue(t, n)}`
    })), Number.isFinite(o) && Number.isFinite(a)) {
      const m = t.goalType === "atmost" ? a - o : o - a;
      c.push({
        label: k(this.hass, "goal_left"),
        value: m > 0 ? this._fmtMetricValue(t, m) : "✓"
      });
    }
    const l = t.days, h = t.kind === "month" || t.kind === "day" && l > 16, d = t.graph === "bar" || t.graph === "progress" ? "bar" : "line", f = e.duration ?? t.preset.duration, y = (m) => f ? this._fmtMetricValue(t, m) : N(this.hass, m, t.precision), _ = {
      w: h ? l * (t.kind === "month" ? 14 : 10) : 340,
      h: h ? 110 : 130,
      dots: t.kind === "day" && l <= 14,
      yFmt: y,
      xMarks: this._xMarks(t.kind, l)
    }, $ = d === "bar" ? Tt(
      t.data[0].buckets,
      t.data[0].colorResolved,
      Number.isFinite(o) ? o : void 0,
      _
    ) : Ct(
      t.data.map((m) => ({ values: m.filled, color: m.colorResolved })),
      _
    );
    return u`
      <div class="periods">
        ${gt.map(
      (m) => u`<button
            class="period ${i === m.key ? "active" : ""}"
            @click=${(b) => {
        b.stopPropagation(), r(m.key);
      }}
          >
            ${k(this.hass, `period_${m.key}`)}
          </button>`
    )}
      </div>
      ${t.graph === "progress" ? this._renderChart(e, "progress", t.data, t.unit, t.precision) : p}
      <div class="popup-chart">
        ${h ? u`<div class="chart-scroll"><div style="width:${_.w}px">${$}</div></div>` : $}
      </div>
      ${c.length ? u`<div class="stats">
            ${c.map(
      (m) => u`<div class="stat">
                <div class="stat-label">${m.label}</div>
                <div class="stat-value">${m.value}</div>
              </div>`
    )}
          </div>` : p}
      ${t.type === "wind" ? this._renderWindDetail(e, t) : p}
      ${t.type === "precipitation" && ((x = t.series[0]) != null && x.entity) ? this._renderEventTimes(t.series[0].entity) : p}
      ${t.multi ? this._renderSeriesChips(t.data, t.precision, t.trendMode) : p}
      ${t.type === "precipitation" && e.parts ? this._renderParts(e) : p}
      ${this._renderSecondary(e)}
    `;
  }
  _renderWindDetail(e, t) {
    var n;
    const i = e.entity ? this._weatherAttr(e.entity, "wind_bearing") : NaN, r = Number.isFinite(i) ? i : this._numeric(this.hass.states[((n = e.secondary) == null ? void 0 : n[0]) ?? ""]);
    if (!Number.isFinite(r)) return p;
    const s = this._numeric(t.primaryState);
    return u`<div class="windrose-wrap">
      ${xi(r, s, t.accent)}
      <div class="windrose-label">${he(this.hass, r)} · ${E(N(this.hass, s, 0), t.unit)}</div>
    </div>`;
  }
  _renderPopup() {
    if (this._popup === null || !this._config) return p;
    const e = this._config.metrics[this._popup];
    if (!e) return p;
    const t = this._ctx(e, this._activeRange());
    if (!t.primaryState) return p;
    const i = t.primaryState, r = this._popupRange ?? (t.days === 7 && t.kind === "day" ? "week" : ""), s = this._metricForecast(e);
    return u`
      <div class="backdrop s-${this._cardStyle()}" @click=${() => this._popup = null}>
        <div
          class="dialog"
          role="dialog"
          aria-modal="true"
          style="--wc-accent:${t.accent}"
          @click=${(n) => n.stopPropagation()}
        >
          <div class="dialog-head">
            <div class="iconchip"><ha-icon .icon=${t.icon}></ha-icon></div>
            <div class="dialog-title">${t.name}</div>
            ${this._renderScoreBadge(e)}
            <button
              class="close"
              aria-label=${k(this.hass, "close")}
              @click=${() => this._popup = null}
            >
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </div>
          <div class="dialog-value">
            ${this._renderValue(e, t)}
            <div class="time">${W(this.hass, i.last_updated)}</div>
          </div>
          ${this._renderStatus(e, t)}
          ${s ? u`<div class="forecast-title">${k(this.hass, "forecast")}</div>
                ${this._renderForecast(s.points, s.type, e.forecast_count ?? 12)}` : p}
          ${this._renderDetails(e, t, r, (n) => {
      this._popupRange = n;
    })}
          <button
            class="openha"
            @click=${() => {
      var n;
      this._popup = null, this._moreInfo((n = t.series[0]) == null ? void 0 : n.entity);
    }}
          >
            <ha-icon icon="mdi:chart-box-outline"></ha-icon>
            ${k(this.hass, "open_ha")}
          </button>
        </div>
      </div>
    `;
  }
  _renderParts(e) {
    const t = {
      morning: "var(--amber-color, #FFC107)",
      noon: "var(--light-blue-color, #03A9F4)",
      evening: "var(--deep-purple-color, #673AB7)",
      night: "var(--indigo-color, #3F51B5)"
    }, i = ["morning", "noon", "evening", "night"].map((s) => {
      var c;
      const n = (c = e.parts) == null ? void 0 : c[s], o = n ? this.hass.states[n] : void 0, a = this._numeric(o);
      if (Number.isFinite(a))
        return { key: s, v: a, unit: o == null ? void 0 : o.attributes.unit_of_measurement, color: t[s] };
    }).filter((s) => !!s);
    if (!i.length) return p;
    const r = i.reduce((s, n) => s + n.v, 0) || 1;
    return u`
      <div class="segbar">
        ${i.map(
      (s) => u`<div class="seg" style="flex-grow:${Math.max(s.v, r * 0.02)};background:${s.color}"></div>`
    )}
      </div>
      <div class="phases">
        ${i.map(
      (s) => u`<div class="phase">
            <span class="phasedot" style="background:${s.color}"></span>
            <span>${k(this.hass, `part_${s.key}`)}</span>
            <span class="phaseval">${E(N(this.hass, s.v, 1), s.unit ?? "mm")}</span>
          </div>`
    )}
      </div>
    `;
  }
  _renderValue(e, t) {
    const { type: i, data: r, primaryState: s, unit: n, precision: o } = t;
    if (e.label) return u`<div class="value">${e.label}</div>`;
    if (i === "wind" && r.length >= 2) {
      const c = this._numeric(s, e.attribute), l = this._numeric(this.hass.states[r[1].entity]);
      return u`<div class="value">
          ${N(this.hass, c, o)}<span class="unit">${n}</span>
        </div>
        <div class="bplabels">
          <span class="bpitem">
            <span class="bpdot" style="background:${r[0].colorResolved}"></span>WIND
            ${N(this.hass, c, 0)}
          </span>
          <span class="bpitem">
            <span class="bpdot" style="background:${r[1].colorResolved}"></span>BÖ
            ${N(this.hass, l, 0)}
          </span>
        </div>`;
    }
    const a = t.valueOverride ?? this._numeric(s, e.attribute);
    return Number.isFinite(a) ? e.duration ?? t.preset.duration ? u`<div class="value">
        ${rt(a, e.unit ?? s.attributes.unit_of_measurement)}
      </div>` : u`<div class="value">
      ${N(this.hass, a, o)}<span class="unit">${n}</span>
    </div>` : u`<div class="value">${s.state}</div>`;
  }
  _renderSeriesChips(e, t, i) {
    return u`<div class="serieslist">
      ${e.map((r) => {
      const s = this.hass.states[r.entity], n = this._numeric(s), o = r.unit ?? (s == null ? void 0 : s.attributes.unit_of_measurement) ?? "", a = r.name ?? (s == null ? void 0 : s.attributes.friendly_name) ?? r.entity, c = Ft(r.filled), l = Number.isFinite(c) ? c > 0 ? "mdi:arrow-top-right" : c < 0 ? "mdi:arrow-bottom-right" : "mdi:arrow-right" : "mdi:minus";
      return u`<div class="serieschip">
          ${i !== "none" ? u`<span class="dotarrow" style="background:${r.colorResolved}">
                <ha-icon .icon=${l}></ha-icon>
              </span>` : p}
          <span class="serieslabel">
            ${a}: ${Number.isFinite(n) ? E(N(this.hass, n, t), o) : (s == null ? void 0 : s.state) ?? "–"}
          </span>
        </div>`;
    })}
    </div>`;
  }
  _renderSecondary(e) {
    var i;
    if (!((i = e.secondary) != null && i.length)) return p;
    const t = e.secondary.map((r) => {
      const s = this.hass.states[r];
      if (!s) return;
      const n = this._numeric(s), o = s.attributes.unit_of_measurement ?? "";
      return Number.isFinite(n) ? E(N(this.hass, n), o) : s.state;
    }).filter(Boolean);
    return t.length ? u`<div class="secondary">${t.join(" • ")}</div>` : p;
  }
  _renderStatus(e, t) {
    var S;
    const { primaryState: i, unit: r, precision: s, trendMode: n, goalType: o, data: a, valueOverride: c } = t, l = a[0], h = c ?? this._numeric(i, e.attribute), d = this._resolveGoal(e.goal);
    if (Number.isFinite(d) && Number.isFinite(h)) {
      const M = this._resolveGoal(e.start);
      let v = NaN;
      if (Number.isFinite(M) && M !== d ? v = (M - h) / (M - d) * 100 : d > 0 && (v = o === "atmost" ? d / h * 100 : h / d * 100), !Number.isNaN(v)) {
        const A = Math.round(Math.min(Math.max(v, 0), 999)), F = A >= 100;
        return u`<div class="status ${F ? "good" : ""}">
          <ha-icon .icon=${F ? "mdi:check-circle" : "mdi:flag-outline"}></ha-icon>
          <span>${k(this.hass, "goal")}: ${A} %</span>
        </div>`;
      }
    }
    if (n === "none") return p;
    const f = ((S = this._forecastChartData(e, t.type)) == null ? void 0 : S.values) ?? l.filled, y = Ft(f);
    if (!Number.isFinite(y)) return p;
    const _ = f.find(Number.isFinite) ?? 0, $ = Math.abs(y) < Math.max(Math.abs(_) * 5e-3, 1e-9), x = $ || n === "neutral" ? "neutral" : y > 0 == (n === "up_good") ? "good" : "bad", m = $ ? "mdi:arrow-right" : y > 0 ? "mdi:arrow-top-right" : "mdi:arrow-bottom-right", b = e.duration ?? t.preset.duration, g = $ ? k(this.hass, "stable") : b ? rt(Math.abs(y), r || void 0) : `${N(this.hass, Math.abs(y), s)}${r ? ` ${r}` : ""}`;
    return u`<div class="status ${x}">
      <span class="dotarrow"><ha-icon .icon=${m}></ha-icon></span>
      <span>${g}</span>
    </div>`;
  }
  _renderChart(e, t, i, r, s) {
    const n = e.type && Q[e.type] ? e.type : "custom", o = t === "line" || t === "bar" ? this._forecastChartData(e, n) : void 0;
    if (t === "line")
      return o ? u`${Ct([{ values: o.values, color: i[0].colorResolved }], {
        h: 66,
        dots: !1,
        area: !0,
        nowDot: !0,
        xMarks: o.xMarks
      })}` : u`${Ct(i.map((a) => ({ values: a.filled, color: a.colorResolved })))}`;
    if (t === "bar") {
      const a = this._resolveGoal(e.goal);
      return o ? u`${Tt(o.values, i[0].colorResolved, void 0, {
        h: 66,
        xMarks: o.xMarks
      })}` : u`${Tt(
        i[0].buckets,
        i[0].colorResolved,
        Number.isFinite(a) ? a : void 0
      )}`;
    }
    if (t === "progress") {
      const a = i.map((c) => {
        const l = this.hass.states[c.entity], h = this._numeric(l), d = this._resolveGoal(c.goal ?? e.goal) || e.max || (r === "%" ? 100 : NaN);
        if (!Number.isFinite(h) || !Number.isFinite(d) || d <= 0) return p;
        const f = Math.max(0, Math.min(h / d * 100, 100)), y = c.unit ?? (l == null ? void 0 : l.attributes.unit_of_measurement) ?? r;
        return u`<div class="pbar">
          ${i.length > 1 ? u`<div class="pbar-label">
                <span>${c.name ?? (l == null ? void 0 : l.attributes.friendly_name) ?? c.entity}</span>
                <span>${E(N(this.hass, h, s), y)}</span>
              </div>` : p}
          <div class="ptrack" style="--wc-p:${c.colorResolved}">
            <div class="pfill" style="width:${f}%"></div>
          </div>
        </div>`;
      });
      return u`<div class="pbars">${a}</div>`;
    }
    return p;
  }
};
C.MOON_MAP = {
  new_moon: [0, !0],
  waxing_crescent: [0.25, !0],
  first_quarter: [0.5, !0],
  waxing_gibbous: [0.75, !0],
  full_moon: [1, !0],
  waning_gibbous: [0.75, !1],
  last_quarter: [0.5, !1],
  waning_crescent: [0.25, !1]
};
C.SKY_ANCHOR_POS = {
  top: { x: 50, y: 12, dir: "bottom" },
  "top-left": { x: 22, y: 16, dir: "right" },
  "top-right": { x: 78, y: 16, dir: "left" },
  center: { x: 50, y: 48, dir: "top" },
  "bottom-left": { x: 24, y: 78, dir: "right" },
  "bottom-right": { x: 76, y: 78, dir: "left" },
  bottom: { x: 50, y: 84, dir: "top" }
};
C.styles = _e`
    :host {
      --wc-card-bg: var(--ha-card-background, var(--card-background-color, #fff));
      --wc-tile-bg: color-mix(in srgb, var(--primary-text-color) 4%, var(--wc-card-bg));
      --wc-dot-fill: var(--wc-tile-bg);
    }
    .cardroot {
      display: block;
      padding: 16px;
    }
    .cardroot.flat {
      --wc-tile-bg: transparent;
      --wc-dot-fill: var(--wc-card-bg);
    }
    .cardroot.nobg {
      background: none;
      box-shadow: none;
      border: none;
    }
    .cardroot.flush {
      padding: 0;
    }
    .cardroot.flush .header {
      padding: 0 0 14px 0;
    }

    /* ---- card styles (default = soft tinted tiles from the base tokens) - */
    .s-glass {
      --wc-tile-bg: color-mix(in srgb, var(--wc-card-bg) 42%, transparent);
      --wc-dot-fill: var(--wc-card-bg);
      --wc-tile-radius: 22px;
    }
    ha-card.cardroot.s-glass {
      background: color-mix(in srgb, var(--wc-card-bg) 55%, transparent);
      -webkit-backdrop-filter: blur(18px) saturate(1.5);
      backdrop-filter: blur(18px) saturate(1.5);
    }
    .s-glass .metric {
      border: 1px solid color-mix(in srgb, var(--primary-text-color) 12%, transparent);
      box-shadow:
        inset 0 1px 0 color-mix(in srgb, #fff 25%, transparent),
        0 8px 24px color-mix(in srgb, #000 10%, transparent);
      -webkit-backdrop-filter: blur(18px) saturate(1.5);
      backdrop-filter: blur(18px) saturate(1.5);
    }
    .s-glass .iconchip {
      background: color-mix(in srgb, var(--wc-accent) 24%, transparent);
      border: 1px solid color-mix(in srgb, #fff 30%, transparent);
      box-shadow: inset 0 1px 0 color-mix(in srgb, #fff 40%, transparent);
      -webkit-backdrop-filter: blur(10px) saturate(1.4);
      backdrop-filter: blur(10px) saturate(1.4);
    }
    .s-glass .scorewrap::before {
      content: '';
      grid-area: 1 / 1;
      place-self: center;
      width: 58%;
      aspect-ratio: 1;
      border-radius: 50%;
      background:
        radial-gradient(
          120% 120% at 30% 18%,
          color-mix(in srgb, #fff 38%, transparent),
          transparent 62%
        ),
        color-mix(in srgb, var(--wc-card-bg) 38%, transparent);
      border: 1px solid color-mix(in srgb, #fff 45%, transparent);
      box-shadow:
        inset 0 1.5px 1px color-mix(in srgb, #fff 55%, transparent),
        inset 0 -10px 18px color-mix(in srgb, var(--wc-accent) 12%, transparent),
        0 12px 28px color-mix(in srgb, #000 20%, transparent);
      -webkit-backdrop-filter: blur(14px) saturate(1.6);
      backdrop-filter: blur(14px) saturate(1.6);
    }
    .s-glass .scorewrap::after {
      content: '';
      grid-area: 1 / 1;
      place-self: center;
      width: 58%;
      aspect-ratio: 1;
      border-radius: 50%;
      background: radial-gradient(48% 32% at 32% 16%, rgba(255, 255, 255, 0.5), transparent 72%);
      pointer-events: none;
      position: relative;
      z-index: 2;
    }
    .s-glass .scorering,
    .s-glass .scoreinner {
      position: relative;
      z-index: 1;
    }
    .s-glass .scorenum {
      text-shadow: 0 1px 3px color-mix(in srgb, #000 18%, transparent);
    }
    @keyframes wc-pulse {
      0%, 100% { opacity: 0.45; }
      50% { opacity: 0.9; }
    }
    .scorering .glowpulse {
      animation: wc-pulse 2.6s ease-in-out infinite;
    }
    .s-glass .dialog {
      background: color-mix(in srgb, var(--wc-card-bg) 55%, transparent);
      -webkit-backdrop-filter: blur(26px) saturate(1.5);
      backdrop-filter: blur(26px) saturate(1.5);
      border: 1px solid color-mix(in srgb, #fff 25%, transparent);
      box-shadow:
        inset 0 1px 0 color-mix(in srgb, #fff 30%, transparent),
        0 12px 48px rgba(0, 0, 0, 0.35);
    }
    .s-material {
      --wc-tile-radius: 24px;
    }
    ha-card.cardroot.s-material {
      border-radius: 28px;
    }
    .s-material .metric {
      position: relative;
      overflow: hidden;
      background: color-mix(in srgb, var(--wc-accent) 12%, var(--wc-card-bg));
      --wc-dot-fill: color-mix(in srgb, var(--wc-accent) 12%, var(--wc-card-bg));
    }
    .s-material .metric::before {
      content: '';
      position: absolute;
      top: -70px;
      left: -70px;
      width: 190px;
      height: 190px;
      border-radius: 50%;
      background: color-mix(in srgb, var(--wc-accent) 22%, transparent);
      pointer-events: none;
    }
    .s-material .metric > * {
      position: relative;
    }
    .s-material .iconchip {
      border-radius: 14px;
      background: var(--wc-accent);
      color: var(--wc-card-bg);
    }
    .s-material .dialog {
      border-radius: 28px;
      background:
        radial-gradient(
          circle at -30px -30px,
          color-mix(in srgb, var(--wc-accent) 24%, transparent) 0 130px,
          transparent 131px
        ),
        color-mix(in srgb, var(--wc-accent) 9%, var(--wc-card-bg));
      --wc-tile-bg: color-mix(in srgb, var(--wc-accent) 14%, var(--wc-card-bg));
      --wc-dot-fill: color-mix(in srgb, var(--wc-accent) 14%, var(--wc-card-bg));
    }
    .s-material .dialog .iconchip {
      background: var(--wc-accent);
      color: var(--wc-card-bg);
    }
    .s-bubble {
      --wc-tile-bg: var(--wc-card-bg);
      --wc-dot-fill: var(--wc-card-bg);
      --wc-tile-radius: 32px;
    }
    ha-card.cardroot.s-bubble {
      background: none;
      box-shadow: none;
      border: none;
    }
    .s-bubble .metric {
      box-shadow: var(--ha-card-box-shadow, 0 2px 8px rgba(0, 0, 0, 0.08));
      padding: 12px 16px;
    }
    .s-bubble .iconchip {
      width: 42px;
      height: 42px;
      background: color-mix(in srgb, var(--wc-accent) 20%, transparent);
    }
    .s-bubble .iconchip ha-icon {
      --mdc-icon-size: 22px;
    }
    .s-bubble .name {
      font-weight: 700;
    }
    .s-bubble .dialog {
      border-radius: 32px;
    }
    .s-mirror {
      --wc-tile-bg: #000;
      --wc-dot-fill: #000;
      --wc-tile-radius: 14px;
      color: #fff;
    }
    ha-card.cardroot.s-mirror {
      background: #000;
      box-shadow: none;
      border: none;
    }
    .s-mirror .metric {
      border: 1px solid rgba(255, 255, 255, 0.28);
    }
    .s-mirror .metric:hover {
      background: #0d0d0d;
    }
    .s-mirror .title,
    .s-mirror .name,
    .s-mirror .value,
    .s-mirror .scorenum,
    .s-mirror .dialog-title,
    .s-mirror .phaseval,
    .s-mirror .serieschip,
    .s-mirror .summary-text,
    .s-mirror .sky-temp,
    .s-mirror .stat-value {
      color: #fff;
    }
    .s-mirror .subtitle,
    .s-mirror .time,
    .s-mirror .unit,
    .s-mirror .secondary,
    .s-mirror .scoremax,
    .s-mirror .stat-label,
    .s-mirror .phase,
    .s-mirror .pbar-label,
    .s-mirror .fc-when,
    .s-mirror .fc-lo,
    .s-mirror .sun-daylen {
      color: rgba(255, 255, 255, 0.72);
    }
    .s-mirror .status {
      color: rgba(255, 255, 255, 0.85);
    }
    .s-mirror .iconchip {
      background: rgba(255, 255, 255, 0.14);
      color: #fff;
    }
    .s-mirror .chart,
    .s-mirror .segbar,
    .s-mirror .phasedot,
    .s-mirror .bpdot,
    .s-mirror .skyscene,
    .s-mirror .sunarc,
    .s-mirror .windrose,
    .s-mirror .moondisc,
    .s-mirror .tidechart,
    .s-mirror .radar-img,
    .s-mirror .fc-ico {
      filter: grayscale(1) brightness(1.6);
    }
    .s-mirror .serieschip .dotarrow {
      background: rgba(255, 255, 255, 0.2) !important;
    }
    .s-mirror .pfill { background: #fff; }
    .s-mirror .ptrack { background: rgba(255, 255, 255, 0.18); }
    .s-mirror .missing { color: rgba(255, 255, 255, 0.8); }
    .s-mirror .dialog {
      background: #000;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }
    .s-mirror .popup-chart,
    .s-mirror .stat {
      background: #000;
      border: 1px solid rgba(255, 255, 255, 0.18);
    }
    .s-mirror .close {
      background: rgba(255, 255, 255, 0.16);
      color: #fff;
    }
    .s-mirror .openha { color: #fff; }

    /* ---- header + grid ------------------------------------------------- */
    .header {
      padding: 4px 4px 16px 4px;
    }
    .title {
      font-size: 26px;
      font-weight: 700;
      letter-spacing: -0.3px;
      color: var(--primary-text-color);
    }
    .subtitle {
      font-size: 14px;
      color: var(--secondary-text-color);
      margin-top: 2px;
    }
    .metrics {
      display: grid;
      grid-template-columns: repeat(var(--wc-columns, 1), minmax(0, 1fr));
      gap: 12px;
    }
    .cardroot.flat .metrics { gap: 4px; }
    .cardroot.flat .metric {
      border: none;
      box-shadow: none;
    }
    .metrics.carousel {
      display: flex;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      scrollbar-width: none;
      -webkit-overflow-scrolling: touch;
    }
    .metrics.carousel::-webkit-scrollbar { display: none; }
    .metrics.carousel > .metric {
      flex: 0 0 min(85%, 320px);
      scroll-snap-align: center;
    }
    .metric {
      background: var(--wc-tile-bg);
      border-radius: var(--wc-tile-radius, 16px);
      box-sizing: border-box;
      padding: 14px 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      cursor: pointer;
      transition: background 0.15s ease;
    }
    .metric:hover {
      background: color-mix(in srgb, var(--primary-text-color) 7%, var(--wc-card-bg));
    }
    .metric.noclick { cursor: default; }
    .metric.noclick:hover { background: var(--wc-tile-bg); }
    .head {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
    }
    .iconchip {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      flex: none;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--wc-accent);
      background: color-mix(in srgb, var(--wc-accent) 14%, transparent);
    }
    .iconchip ha-icon { --mdc-icon-size: 18px; }
    .name {
      flex: 1;
      font-size: 15px;
      font-weight: 600;
      color: var(--primary-text-color);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .time {
      font-size: 12px;
      color: var(--secondary-text-color);
      flex: none;
    }
    .body {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr);
      gap: 14px;
      align-items: center;
    }
    .body.stack {
      grid-template-columns: minmax(0, 1fr);
      gap: 8px;
    }
    .info {
      display: flex;
      flex-direction: column;
      gap: 6px;
      min-width: 0;
    }
    .value {
      font-size: 30px;
      font-weight: 700;
      line-height: 1.1;
      letter-spacing: -0.5px;
      color: var(--primary-text-color);
    }
    .unit {
      font-size: 14px;
      font-weight: 600;
      color: var(--secondary-text-color);
      margin-left: 2px;
      letter-spacing: 0;
    }
    .secondary {
      font-size: 13px;
      color: var(--secondary-text-color);
    }
    .status {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      font-weight: 500;
      color: var(--secondary-text-color);
    }
    .status ha-icon { --mdc-icon-size: 16px; }
    .status.good { color: var(--success-color, #43a047); }
    .status.bad { color: var(--error-color, #db4437); }
    .status .dotarrow {
      background: color-mix(in srgb, currentColor 15%, transparent);
      color: inherit;
    }
    .dotarrow {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      flex: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #fff;
    }
    .dotarrow ha-icon { --mdc-icon-size: 12px; }
    .serieslist {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .serieschip {
      display: flex;
      align-items: center;
      gap: 7px;
      font-size: 13px;
      color: var(--primary-text-color);
      min-width: 0;
    }
    .serieslabel {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .chartcell { min-width: 0; }
    .chart {
      width: 100%;
      height: auto;
      display: block;
    }
    .chart .axis {
      fill: var(--secondary-text-color);
      font-size: 9px;
      font-weight: 500;
    }
    .pbars {
      display: flex;
      flex-direction: column;
      gap: 10px;
      width: 100%;
    }
    .pbar-label {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: var(--secondary-text-color);
      margin-bottom: 3px;
    }
    .ptrack {
      height: 8px;
      border-radius: 4px;
      background: color-mix(in srgb, var(--wc-p, var(--wc-accent)) 18%, transparent);
      overflow: hidden;
    }
    .pfill {
      height: 100%;
      border-radius: 4px;
      background: var(--wc-p, var(--wc-accent));
      transition: width 0.3s ease;
    }
    .missing {
      font-size: 13px;
      color: var(--error-color, #db4437);
      word-break: break-all;
    }
    .bplabels {
      display: flex;
      gap: 12px;
      margin-top: 2px;
    }
    .bpitem {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.6px;
      color: var(--secondary-text-color);
    }
    .bpdot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex: none;
    }

    /* ---- precipitation parts (segment bar) ----------------------------- */
    .segbar {
      display: flex;
      gap: 2px;
      height: 10px;
      border-radius: 5px;
      overflow: hidden;
      margin-top: 2px;
    }
    .seg {
      min-width: 4px;
      border-radius: 2px;
    }
    .phases {
      display: flex;
      flex-wrap: wrap;
      gap: 6px 14px;
      margin-top: 6px;
    }
    .phase {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .phasedot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex: none;
    }
    .phaseval {
      color: var(--primary-text-color);
      font-weight: 600;
    }

    /* ---- forecast strip ------------------------------------------------ */
    .forecast {
      display: flex;
      gap: 4px;
      overflow-x: auto;
      scrollbar-width: none;
      margin-top: 2px;
      padding-bottom: 2px;
    }
    .forecast::-webkit-scrollbar { display: none; }
    .fc-step {
      flex: 1 0 auto;
      min-width: 44px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 3px;
      padding: 6px 4px;
      border-radius: 12px;
      background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
    }
    .fc-when {
      font-size: 11px;
      font-weight: 600;
      color: var(--secondary-text-color);
    }
    .fc-ico {
      --mdc-icon-size: 22px;
      color: var(--wc-accent);
    }
    .fc-pop {
      font-size: 10px;
      font-weight: 600;
      min-height: 13px;
      color: var(--light-blue-color, #03A9F4);
    }
    .fc-pop.empty { opacity: 0; }
    .fc-temp {
      font-size: 13px;
      font-weight: 700;
      color: var(--primary-text-color);
      display: flex;
      gap: 3px;
      align-items: baseline;
    }
    .fc-lo {
      font-size: 11px;
      font-weight: 500;
      color: var(--secondary-text-color);
    }
    .forecast-title,
    .windrose-label {
      font-size: 12px;
      font-weight: 600;
      color: var(--secondary-text-color);
    }

    /* ---- score / air-quality ring -------------------------------------- */
    .scorewrap {
      display: grid;
      place-items: center;
      width: min(210px, 100%);
      margin: 0 auto;
    }
    .scorewrap > * { grid-area: 1 / 1; }
    .scorering {
      width: 100%;
      height: auto;
      display: block;
    }
    .scoreinner { text-align: center; }
    .scorenum {
      font-size: 46px;
      font-weight: 800;
      letter-spacing: -1px;
      line-height: 1;
      color: var(--primary-text-color);
    }
    .scoremax {
      font-size: 13px;
      font-weight: 600;
      color: var(--secondary-text-color);
      margin-top: 2px;
    }
    .score-status {
      display: flex;
      justify-content: center;
    }
    .score-bars {
      display: flex;
      flex-direction: column;
      gap: 6px;
      width: 100%;
      max-width: 260px;
      margin: 0 auto;
    }
    .sbar {
      display: grid;
      grid-template-columns: minmax(56px, auto) 1fr auto;
      align-items: center;
      gap: 8px;
      font-size: 12px;
    }
    .sbar-name {
      color: var(--secondary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .sbar-track {
      height: 6px;
      border-radius: 3px;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      overflow: hidden;
    }
    .sbar-fill {
      height: 100%;
      border-radius: 3px;
    }
    .sbar-val {
      font-weight: 700;
      color: var(--primary-text-color);
    }
    .s-mirror .sbar-fill { filter: grayscale(1) brightness(1.75); }
    .exp-value {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 6px 10px;
    }

    /* ---- sky hero scene ------------------------------------------------ */
    .skywrap {
      position: relative;
      width: 100%;
      aspect-ratio: 1.9;
      border-radius: 16px;
      overflow: hidden;
      background: #7fb0e6;
    }
    .skyscene {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      transform: translateY(var(--wc-oy, 0%));
      display: block;
    }
    .sky-overlay {
      position: absolute;
      left: 14px;
      top: 12px;
      right: 12px;
      pointer-events: none;
      text-shadow: 0 1px 6px rgba(0, 0, 0, 0.35);
    }
    .sky-temp {
      font-size: 40px;
      font-weight: 800;
      line-height: 1;
      letter-spacing: -1.5px;
      color: #fff;
    }
    .sky-unit {
      font-size: 18px;
      font-weight: 700;
      margin-left: 1px;
    }
    .sky-cond {
      font-size: 14px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.95);
      margin-top: 2px;
    }
    .sky-hilo {
      display: flex;
      gap: 10px;
      margin-top: 4px;
      font-size: 13px;
      font-weight: 700;
      color: #fff;
    }
    .sky-hilo span {
      display: inline-flex;
      align-items: center;
    }
    .sky-hilo ha-icon { --mdc-icon-size: 15px; }

    /* ---- sun / daylight arc -------------------------------------------- */
    .sunwrap {
      width: min(280px, 100%);
      margin: 0 auto;
    }
    .sunarc,
    .windrose {
      width: 100%;
      height: auto;
      display: block;
    }
    .sunarc .axis,
    .windrose .rose-card {
      font-size: 11px;
      font-weight: 600;
      fill: var(--secondary-text-color);
    }
    .sun-times {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      margin-top: -6px;
    }
    .sun-end {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 15px;
      font-weight: 700;
      color: var(--primary-text-color);
    }
    .sun-end ha-icon {
      --mdc-icon-size: 18px;
      color: var(--wc-accent);
    }
    .sun-daylen {
      font-size: 13px;
      font-weight: 600;
      color: var(--secondary-text-color);
    }
    .sun-note {
      text-align: center;
      font-size: 13px;
      color: var(--secondary-text-color);
    }

    /* ---- moon ---------------------------------------------------------- */
    .moonwrap {
      width: min(190px, 72%);
      margin: 0 auto;
    }
    .moondisc {
      width: 100%;
      height: auto;
      display: block;
    }
    .moon-phase {
      text-align: center;
      font-size: 16px;
      font-weight: 700;
    }
    .moon-note {
      text-align: center;
      font-size: 13px;
      color: var(--secondary-text-color);
      margin-top: -2px;
    }

    /* ---- tides --------------------------------------------------------- */
    .tidewrap {
      width: 100%;
    }
    .tidechart {
      width: 100%;
      height: auto;
      display: block;
    }
    .tide-times {
      display: flex;
      justify-content: space-between;
      gap: 8px;
      flex-wrap: wrap;
    }
    .tide-end {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 14px;
      font-weight: 600;
      color: var(--primary-text-color);
    }
    .tide-end ha-icon {
      --mdc-icon-size: 16px;
      color: var(--wc-accent);
    }

    /* ---- radar --------------------------------------------------------- */
    .radarframe {
      width: 100%;
      border-radius: 16px;
      overflow: hidden;
      background: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
      aspect-ratio: 16 / 10;
    }
    .radar-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .windrose-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
    }
    .windrose-wrap .windrose {
      width: min(180px, 70%);
    }

    /* ---- AI summary ---------------------------------------------------- */
    .summary-metric {
      background: linear-gradient(
        135deg,
        color-mix(in srgb, var(--wc-accent) 14%, var(--wc-tile-bg)),
        var(--wc-tile-bg) 70%
      );
    }
    .summary-text {
      font-size: 15px;
      line-height: 1.5;
      color: var(--primary-text-color);
    }
    .summary-note {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .summary-note ha-icon {
      --mdc-icon-size: 14px;
      color: var(--wc-accent);
    }

    /* ---- anchors (pinned values on the sky) ---------------------------- */
    .anchor {
      position: absolute;
      pointer-events: none;
      --gap: 9px;
      --dg: 2px;
    }
    .anchor-dot {
      position: absolute;
      top: 0;
      left: 0;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      background: var(--ac);
      border: 2px solid var(--wc-card-bg);
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
    }
    .anchor-chip {
      position: absolute;
      top: 0;
      left: 0;
      background: color-mix(
        in srgb,
        var(--wc-card-bg) calc(var(--wc-label-op, 1) * 100%),
        transparent
      );
      border-radius: 10px;
      padding: 4px 9px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, calc(var(--wc-label-op, 1) * 0.16));
      display: flex;
      flex-direction: column;
      line-height: 1.25;
      white-space: nowrap;
    }
    .anchor.dot-right .anchor-chip { transform: translate(calc(-100% - var(--gap)), -50%); }
    .anchor.dot-left .anchor-chip { transform: translate(var(--gap), -50%); }
    .anchor.dot-bottom .anchor-chip { transform: translate(-50%, calc(-100% - var(--gap))); }
    .anchor.dot-top .anchor-chip { transform: translate(-50%, var(--gap)); }
    .anchor.dot-bottom-right .anchor-chip { transform: translate(calc(-100% - var(--dg)), calc(-100% - var(--dg))); }
    .anchor.dot-bottom-left .anchor-chip { transform: translate(var(--dg), calc(-100% - var(--dg))); }
    .anchor.dot-top-right .anchor-chip { transform: translate(calc(-100% - var(--dg)), var(--dg)); }
    .anchor.dot-top-left .anchor-chip { transform: translate(var(--dg), var(--dg)); }
    .s-glass .anchor-chip {
      border: 1px solid color-mix(in srgb, #fff 30%, transparent);
      -webkit-backdrop-filter: blur(8px) saturate(1.4);
      backdrop-filter: blur(8px) saturate(1.4);
      box-shadow:
        inset 0 1px 0 color-mix(in srgb, #fff 30%, transparent),
        0 4px 14px rgba(0, 0, 0, 0.16);
    }
    .s-material .anchor-chip { border-radius: 14px; }
    .s-bubble .anchor-chip { border-radius: 14px; }
    .anchor-name {
      font-size: 10px;
      font-weight: 600;
      color: var(--secondary-text-color);
    }
    .anchor-val {
      font-size: 12px;
      font-weight: 700;
      color: var(--primary-text-color);
    }
    .s-mirror .anchor-chip {
      background: #000;
      border: 1px solid rgba(255, 255, 255, 0.3);
      box-shadow: none;
    }
    .s-mirror .anchor-dot { border-color: #000; }

    /* ---- detail popup -------------------------------------------------- */
    .backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      animation: wc-fadein 0.15s ease;
    }
    @keyframes wc-fadein {
      from { opacity: 0; }
    }
    .dialog {
      width: min(440px, 100%);
      max-height: 86vh;
      overflow-y: auto;
      box-sizing: border-box;
      background: var(--wc-card-bg);
      color: var(--primary-text-color);
      border-radius: 24px;
      padding: 20px;
      box-shadow: 0 12px 48px rgba(0, 0, 0, 0.3);
      display: flex;
      flex-direction: column;
      gap: 12px;
      --wc-tile-bg: color-mix(in srgb, var(--primary-text-color) 4%, var(--wc-card-bg));
      --wc-dot-fill: var(--wc-card-bg);
    }
    .dialog-head {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .dialog-title {
      flex: 1;
      font-size: 17px;
      font-weight: 700;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .close {
      width: 32px;
      height: 32px;
      flex: none;
      border: none;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--secondary-text-color);
      background: color-mix(in srgb, var(--primary-text-color) 7%, transparent);
    }
    .close ha-icon { --mdc-icon-size: 18px; }
    .dialog-value {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 10px;
      flex-wrap: wrap;
    }
    .dialog-value .value { font-size: 36px; }
    .popup-chart {
      background: var(--wc-tile-bg);
      border-radius: 16px;
      padding: 12px 10px 8px;
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(88px, 1fr));
      gap: 8px;
    }
    .stat {
      background: var(--wc-tile-bg);
      border-radius: 12px;
      padding: 8px 10px;
      text-align: center;
    }
    .stat-label {
      font-size: 11px;
      color: var(--secondary-text-color);
    }
    .stat-value {
      font-size: 14px;
      font-weight: 700;
    }
    .openha {
      align-self: center;
      display: flex;
      align-items: center;
      gap: 6px;
      border: none;
      background: none;
      color: var(--primary-color);
      font-weight: 600;
      font-size: 13px;
      cursor: pointer;
      padding: 8px 14px;
      border-radius: 10px;
    }
    .openha:hover {
      background: color-mix(in srgb, var(--primary-color) 10%, transparent);
    }
    .openha ha-icon { --mdc-icon-size: 16px; }
    .scorebadge {
      min-width: 26px;
      height: 20px;
      padding: 0 7px;
      border-radius: 10px;
      color: #fff;
      font-size: 12px;
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: none;
      box-sizing: border-box;
    }
    .periods {
      display: flex;
      gap: 6px;
    }
    .period {
      border: none;
      cursor: pointer;
      padding: 5px 14px;
      border-radius: 999px;
      font-weight: 600;
      font-size: 12px;
      color: var(--secondary-text-color);
      background: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
    }
    .period.active {
      background: var(--wc-accent);
      color: var(--wc-card-bg);
    }
    .s-mirror .period {
      background: rgba(255, 255, 255, 0.12);
      color: rgba(255, 255, 255, 0.75);
    }
    .s-mirror .period.active {
      background: #fff;
      color: #000;
    }
    .chart-scroll {
      overflow-x: auto;
      scrollbar-width: thin;
    }
    .chart-scroll > div { min-width: 100%; }
    .times {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    .times-title {
      font-size: 12px;
      font-weight: 600;
      color: var(--secondary-text-color);
      margin-bottom: 2px;
    }
    .times-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .times-day {
      width: 30px;
      flex: none;
      font-size: 11px;
      color: var(--secondary-text-color);
    }
    .times-track {
      position: relative;
      flex: 1;
      height: 14px;
      border-radius: 7px;
      background: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
    }
    .times-dot {
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background: var(--wc-accent);
    }
    .times-count {
      width: 26px;
      flex: none;
      text-align: right;
      font-size: 11px;
      font-weight: 600;
      color: var(--primary-text-color);
    }
    .times-hours {
      display: flex;
      justify-content: space-between;
      margin: 0 34px 0 38px;
      font-size: 9px;
      color: var(--secondary-text-color);
    }
    .s-mirror .times-track { background: rgba(255, 255, 255, 0.12); }
    .s-mirror .times-dot { background: #fff; }
  `;
H([
  Wt({ attribute: !1 })
], C.prototype, "hass", 2);
H([
  L()
], C.prototype, "_config", 2);
H([
  L()
], C.prototype, "_history", 2);
H([
  L()
], C.prototype, "_popup", 2);
H([
  L()
], C.prototype, "_popupRange", 2);
H([
  L()
], C.prototype, "_tileRanges", 2);
H([
  L()
], C.prototype, "_statsCache", 2);
H([
  L()
], C.prototype, "_forecasts", 2);
C = H([
  ke("weatherglass-card")
], C);
function it(...e) {
  for (const t of e) if (typeof t == "number" && Number.isFinite(t)) return t;
}
console.info(
  `%c WEATHERGLASS %c v${Ei} `,
  "color: white; background: #0d6efd; font-weight: 700; border-radius: 4px 0 0 4px; padding: 2px 6px;",
  "color: #0d6efd; background: #e7f0ff; font-weight: 700; border-radius: 0 4px 4px 0; padding: 2px 6px;"
);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "weatherglass-card",
  name: "Weatherglass",
  description: "Forecast-first weather dashboard with an animated sky scene: hourly forecast tiles, wind, precipitation, air quality, sun, moon, tides, pollen, radar and an AI summary.",
  preview: !0,
  documentationURL: "https://github.com/BobMcGlobus/Weatherglass"
});
export {
  C as WeatherCard
};
