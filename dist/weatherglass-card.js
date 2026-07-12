/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const pt = globalThis, Ft = pt.ShadowRoot && (pt.ShadyCSS === void 0 || pt.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Ct = Symbol(), Ot = /* @__PURE__ */ new WeakMap();
let ce = class {
  constructor(t, e, r) {
    if (this._$cssResult$ = !0, r !== Ct) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (Ft && t === void 0) {
      const r = e !== void 0 && e.length === 1;
      r && (t = Ot.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), r && Ot.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const ve = (i) => new ce(typeof i == "string" ? i : i + "", void 0, Ct), le = (i, ...t) => {
  const e = i.length === 1 ? i[0] : t.reduce((r, n, s) => r + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + i[s + 1], i[0]);
  return new ce(e, i, Ct);
}, we = (i, t) => {
  if (Ft) i.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const r = document.createElement("style"), n = pt.litNonce;
    n !== void 0 && r.setAttribute("nonce", n), r.textContent = e.cssText, i.appendChild(r);
  }
}, Lt = Ft ? (i) => i : (i) => i instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const r of t.cssRules) e += r.cssText;
  return ve(e);
})(i) : i;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: $e, defineProperty: ke, getOwnPropertyDescriptor: Se, getOwnPropertyNames: Ae, getOwnPropertySymbols: Me, getPrototypeOf: Ne } = Object, H = globalThis, Wt = H.trustedTypes, Ee = Wt ? Wt.emptyScript : "", xt = H.reactiveElementPolyfillSupport, tt = (i, t) => i, ut = { toAttribute(i, t) {
  switch (t) {
    case Boolean:
      i = i ? Ee : null;
      break;
    case Object:
    case Array:
      i = i == null ? i : JSON.stringify(i);
  }
  return i;
}, fromAttribute(i, t) {
  let e = i;
  switch (t) {
    case Boolean:
      e = i !== null;
      break;
    case Number:
      e = i === null ? null : Number(i);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(i);
      } catch {
        e = null;
      }
  }
  return e;
} }, Tt = (i, t) => !$e(i, t), Ht = { attribute: !0, type: String, converter: ut, reflect: !1, useDefault: !1, hasChanged: Tt };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), H.litPropertyMetadata ?? (H.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let j = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = Ht) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const r = Symbol(), n = this.getPropertyDescriptor(t, r, e);
      n !== void 0 && ke(this.prototype, t, n);
    }
  }
  static getPropertyDescriptor(t, e, r) {
    const { get: n, set: s } = Se(this.prototype, t) ?? { get() {
      return this[e];
    }, set(o) {
      this[e] = o;
    } };
    return { get: n, set(o) {
      const a = n == null ? void 0 : n.call(this);
      s == null || s.call(this, o), this.requestUpdate(t, a, r);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? Ht;
  }
  static _$Ei() {
    if (this.hasOwnProperty(tt("elementProperties"))) return;
    const t = Ne(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(tt("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(tt("properties"))) {
      const e = this.properties, r = [...Ae(e), ...Me(e)];
      for (const n of r) this.createProperty(n, e[n]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [r, n] of e) this.elementProperties.set(r, n);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, r] of this.elementProperties) {
      const n = this._$Eu(e, r);
      n !== void 0 && this._$Eh.set(n, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const r = new Set(t.flat(1 / 0).reverse());
      for (const n of r) e.unshift(Lt(n));
    } else t !== void 0 && e.push(Lt(t));
    return e;
  }
  static _$Eu(t, e) {
    const r = e.attribute;
    return r === !1 ? void 0 : typeof r == "string" ? r : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var t;
    this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (t = this.constructor.l) == null || t.forEach((e) => e(this));
  }
  addController(t) {
    var e;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t), this.renderRoot !== void 0 && this.isConnected && ((e = t.hostConnected) == null || e.call(t));
  }
  removeController(t) {
    var e;
    (e = this._$EO) == null || e.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const r of e.keys()) this.hasOwnProperty(r) && (t.set(r, this[r]), delete this[r]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return we(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var t;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$EO) == null || t.forEach((e) => {
      var r;
      return (r = e.hostConnected) == null ? void 0 : r.call(e);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$EO) == null || t.forEach((e) => {
      var r;
      return (r = e.hostDisconnected) == null ? void 0 : r.call(e);
    });
  }
  attributeChangedCallback(t, e, r) {
    this._$AK(t, r);
  }
  _$ET(t, e) {
    var s;
    const r = this.constructor.elementProperties.get(t), n = this.constructor._$Eu(t, r);
    if (n !== void 0 && r.reflect === !0) {
      const o = (((s = r.converter) == null ? void 0 : s.toAttribute) !== void 0 ? r.converter : ut).toAttribute(e, r.type);
      this._$Em = t, o == null ? this.removeAttribute(n) : this.setAttribute(n, o), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var s, o;
    const r = this.constructor, n = r._$Eh.get(t);
    if (n !== void 0 && this._$Em !== n) {
      const a = r.getPropertyOptions(n), c = typeof a.converter == "function" ? { fromAttribute: a.converter } : ((s = a.converter) == null ? void 0 : s.fromAttribute) !== void 0 ? a.converter : ut;
      this._$Em = n;
      const l = c.fromAttribute(e, a.type);
      this[n] = l ?? ((o = this._$Ej) == null ? void 0 : o.get(n)) ?? l, this._$Em = null;
    }
  }
  requestUpdate(t, e, r, n = !1, s) {
    var o;
    if (t !== void 0) {
      const a = this.constructor;
      if (n === !1 && (s = this[t]), r ?? (r = a.getPropertyOptions(t)), !((r.hasChanged ?? Tt)(s, e) || r.useDefault && r.reflect && s === ((o = this._$Ej) == null ? void 0 : o.get(t)) && !this.hasAttribute(a._$Eu(t, r)))) return;
      this.C(t, e, r);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: r, reflect: n, wrapped: s }, o) {
    r && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, o ?? e ?? this[t]), s !== !0 || o !== void 0) || (this._$AL.has(t) || (this.hasUpdated || r || (e = void 0), this._$AL.set(t, e)), n === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
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
        for (const [s, o] of this._$Ep) this[s] = o;
        this._$Ep = void 0;
      }
      const n = this.constructor.elementProperties;
      if (n.size > 0) for (const [s, o] of n) {
        const { wrapped: a } = o, c = this[s];
        a !== !0 || this._$AL.has(s) || c === void 0 || this.C(s, void 0, o, c);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), (r = this._$EO) == null || r.forEach((n) => {
        var s;
        return (s = n.hostUpdate) == null ? void 0 : s.call(n);
      }), this.update(e)) : this._$EM();
    } catch (n) {
      throw t = !1, this._$EM(), n;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var e;
    (e = this._$EO) == null || e.forEach((r) => {
      var n;
      return (n = r.hostUpdated) == null ? void 0 : n.call(r);
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
    this._$Eq && (this._$Eq = this._$Eq.forEach((e) => this._$ET(e, this[e]))), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
j.elementStyles = [], j.shadowRootOptions = { mode: "open" }, j[tt("elementProperties")] = /* @__PURE__ */ new Map(), j[tt("finalized")] = /* @__PURE__ */ new Map(), xt == null || xt({ ReactiveElement: j }), (H.reactiveElementVersions ?? (H.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const et = globalThis, It = (i) => i, mt = et.trustedTypes, Ut = mt ? mt.createPolicy("lit-html", { createHTML: (i) => i }) : void 0, de = "$lit$", W = `lit$${Math.random().toFixed(9).slice(2)}$`, he = "?" + W, Fe = `<${he}>`, G = document, it = () => G.createComment(""), rt = (i) => i === null || typeof i != "object" && typeof i != "function", Rt = Array.isArray, Ce = (i) => Rt(i) || typeof (i == null ? void 0 : i[Symbol.iterator]) == "function", vt = `[ 	
\f\r]`, X = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Bt = /-->/g, Gt = />/g, I = RegExp(`>|${vt}(?:([^\\s"'>=/]+)(${vt}*=${vt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Vt = /'/g, jt = /"/g, pe = /^(?:script|style|textarea|title)$/i, ue = (i) => (t, ...e) => ({ _$litType$: i, strings: t, values: e }), p = ue(1), w = ue(2), Y = Symbol.for("lit-noChange"), u = Symbol.for("lit-nothing"), qt = /* @__PURE__ */ new WeakMap(), U = G.createTreeWalker(G, 129);
function me(i, t) {
  if (!Rt(i) || !i.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Ut !== void 0 ? Ut.createHTML(t) : t;
}
const Te = (i, t) => {
  const e = i.length - 1, r = [];
  let n, s = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = X;
  for (let a = 0; a < e; a++) {
    const c = i[a];
    let l, h, d = -1, m = 0;
    for (; m < c.length && (o.lastIndex = m, h = o.exec(c), h !== null); ) m = o.lastIndex, o === X ? h[1] === "!--" ? o = Bt : h[1] !== void 0 ? o = Gt : h[2] !== void 0 ? (pe.test(h[2]) && (n = RegExp("</" + h[2], "g")), o = I) : h[3] !== void 0 && (o = I) : o === I ? h[0] === ">" ? (o = n ?? X, d = -1) : h[1] === void 0 ? d = -2 : (d = o.lastIndex - h[2].length, l = h[1], o = h[3] === void 0 ? I : h[3] === '"' ? jt : Vt) : o === jt || o === Vt ? o = I : o === Bt || o === Gt ? o = X : (o = I, n = void 0);
    const f = o === I && i[a + 1].startsWith("/>") ? " " : "";
    s += o === X ? c + Fe : d >= 0 ? (r.push(l), c.slice(0, d) + de + c.slice(d) + W + f) : c + W + (d === -2 ? a : f);
  }
  return [me(i, s + (i[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
};
class nt {
  constructor({ strings: t, _$litType$: e }, r) {
    let n;
    this.parts = [];
    let s = 0, o = 0;
    const a = t.length - 1, c = this.parts, [l, h] = Te(t, e);
    if (this.el = nt.createElement(l, r), U.currentNode = this.el.content, e === 2 || e === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (n = U.nextNode()) !== null && c.length < a; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes()) for (const d of n.getAttributeNames()) if (d.endsWith(de)) {
          const m = h[o++], f = n.getAttribute(d).split(W), y = /([.?@])?(.*)/.exec(m);
          c.push({ type: 1, index: s, name: y[2], strings: f, ctor: y[1] === "." ? De : y[1] === "?" ? Pe : y[1] === "@" ? ze : ft }), n.removeAttribute(d);
        } else d.startsWith(W) && (c.push({ type: 6, index: s }), n.removeAttribute(d));
        if (pe.test(n.tagName)) {
          const d = n.textContent.split(W), m = d.length - 1;
          if (m > 0) {
            n.textContent = mt ? mt.emptyScript : "";
            for (let f = 0; f < m; f++) n.append(d[f], it()), U.nextNode(), c.push({ type: 2, index: ++s });
            n.append(d[m], it());
          }
        }
      } else if (n.nodeType === 8) if (n.data === he) c.push({ type: 2, index: s });
      else {
        let d = -1;
        for (; (d = n.data.indexOf(W, d + 1)) !== -1; ) c.push({ type: 7, index: s }), d += W.length - 1;
      }
      s++;
    }
  }
  static createElement(t, e) {
    const r = G.createElement("template");
    return r.innerHTML = t, r;
  }
}
function Z(i, t, e = i, r) {
  var o, a;
  if (t === Y) return t;
  let n = r !== void 0 ? (o = e._$Co) == null ? void 0 : o[r] : e._$Cl;
  const s = rt(t) ? void 0 : t._$litDirective$;
  return (n == null ? void 0 : n.constructor) !== s && ((a = n == null ? void 0 : n._$AO) == null || a.call(n, !1), s === void 0 ? n = void 0 : (n = new s(i), n._$AT(i, e, r)), r !== void 0 ? (e._$Co ?? (e._$Co = []))[r] = n : e._$Cl = n), n !== void 0 && (t = Z(i, n._$AS(i, t.values), n, r)), t;
}
class Re {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: r } = this._$AD, n = ((t == null ? void 0 : t.creationScope) ?? G).importNode(e, !0);
    U.currentNode = n;
    let s = U.nextNode(), o = 0, a = 0, c = r[0];
    for (; c !== void 0; ) {
      if (o === c.index) {
        let l;
        c.type === 2 ? l = new ot(s, s.nextSibling, this, t) : c.type === 1 ? l = new c.ctor(s, c.name, c.strings, this, t) : c.type === 6 && (l = new Oe(s, this, t)), this._$AV.push(l), c = r[++a];
      }
      o !== (c == null ? void 0 : c.index) && (s = U.nextNode(), o++);
    }
    return U.currentNode = G, n;
  }
  p(t) {
    let e = 0;
    for (const r of this._$AV) r !== void 0 && (r.strings !== void 0 ? (r._$AI(t, r, e), e += r.strings.length - 2) : r._$AI(t[e])), e++;
  }
}
class ot {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, e, r, n) {
    this.type = 2, this._$AH = u, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = r, this.options = n, this._$Cv = (n == null ? void 0 : n.isConnected) ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && (t == null ? void 0 : t.nodeType) === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = Z(this, t, e), rt(t) ? t === u || t == null || t === "" ? (this._$AH !== u && this._$AR(), this._$AH = u) : t !== this._$AH && t !== Y && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Ce(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== u && rt(this._$AH) ? this._$AA.nextSibling.data = t : this.T(G.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var s;
    const { values: e, _$litType$: r } = t, n = typeof r == "number" ? this._$AC(t) : (r.el === void 0 && (r.el = nt.createElement(me(r.h, r.h[0]), this.options)), r);
    if (((s = this._$AH) == null ? void 0 : s._$AD) === n) this._$AH.p(e);
    else {
      const o = new Re(n, this), a = o.u(this.options);
      o.p(e), this.T(a), this._$AH = o;
    }
  }
  _$AC(t) {
    let e = qt.get(t.strings);
    return e === void 0 && qt.set(t.strings, e = new nt(t)), e;
  }
  k(t) {
    Rt(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let r, n = 0;
    for (const s of t) n === e.length ? e.push(r = new ot(this.O(it()), this.O(it()), this, this.options)) : r = e[n], r._$AI(s), n++;
    n < e.length && (this._$AR(r && r._$AB.nextSibling, n), e.length = n);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var r;
    for ((r = this._$AP) == null ? void 0 : r.call(this, !1, !0, e); t !== this._$AB; ) {
      const n = It(t).nextSibling;
      It(t).remove(), t = n;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
let ft = class {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, r, n, s) {
    this.type = 1, this._$AH = u, this._$AN = void 0, this.element = t, this.name = e, this._$AM = n, this.options = s, r.length > 2 || r[0] !== "" || r[1] !== "" ? (this._$AH = Array(r.length - 1).fill(new String()), this.strings = r) : this._$AH = u;
  }
  _$AI(t, e = this, r, n) {
    const s = this.strings;
    let o = !1;
    if (s === void 0) t = Z(this, t, e, 0), o = !rt(t) || t !== this._$AH && t !== Y, o && (this._$AH = t);
    else {
      const a = t;
      let c, l;
      for (t = s[0], c = 0; c < s.length - 1; c++) l = Z(this, a[r + c], e, c), l === Y && (l = this._$AH[c]), o || (o = !rt(l) || l !== this._$AH[c]), l === u ? t = u : t !== u && (t += (l ?? "") + s[c + 1]), this._$AH[c] = l;
    }
    o && !n && this.j(t);
  }
  j(t) {
    t === u ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
};
class De extends ft {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === u ? void 0 : t;
  }
}
class Pe extends ft {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== u);
  }
}
class ze extends ft {
  constructor(t, e, r, n, s) {
    super(t, e, r, n, s), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = Z(this, t, e, 0) ?? u) === Y) return;
    const r = this._$AH, n = t === u && r !== u || t.capture !== r.capture || t.once !== r.once || t.passive !== r.passive, s = t !== u && (r === u || n);
    n && this.element.removeEventListener(this.name, this, r), s && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Oe {
  constructor(t, e, r) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = r;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    Z(this, t);
  }
}
const wt = et.litHtmlPolyfillSupport;
wt == null || wt(nt, ot), (et.litHtmlVersions ?? (et.litHtmlVersions = [])).push("3.3.3");
const Le = (i, t, e) => {
  const r = (e == null ? void 0 : e.renderBefore) ?? t;
  let n = r._$litPart$;
  if (n === void 0) {
    const s = (e == null ? void 0 : e.renderBefore) ?? null;
    r._$litPart$ = n = new ot(t.insertBefore(it(), s), s, void 0, e ?? {});
  }
  return n._$AI(i), n;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const B = globalThis;
class q extends j {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var e;
    const t = super.createRenderRoot();
    return (e = this.renderOptions).renderBefore ?? (e.renderBefore = t.firstChild), t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Le(e, this.renderRoot, this.renderOptions);
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
    return Y;
  }
}
var ae;
q._$litElement$ = !0, q.finalized = !0, (ae = B.litElementHydrateSupport) == null || ae.call(B, { LitElement: q });
const $t = B.litElementPolyfillSupport;
$t == null || $t({ LitElement: q });
(B.litElementVersions ?? (B.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ge = (i) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(i, t);
  }) : customElements.define(i, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const We = { attribute: !0, type: String, converter: ut, reflect: !1, hasChanged: Tt }, He = (i = We, t, e) => {
  const { kind: r, metadata: n } = e;
  let s = globalThis.litPropertyMetadata.get(n);
  if (s === void 0 && globalThis.litPropertyMetadata.set(n, s = /* @__PURE__ */ new Map()), r === "setter" && ((i = Object.create(i)).wrapped = !0), s.set(e.name, i), r === "accessor") {
    const { name: o } = e;
    return { set(a) {
      const c = t.get.call(this);
      t.set.call(this, a), this.requestUpdate(o, c, i, !0, a);
    }, init(a) {
      return a !== void 0 && this.C(o, void 0, i, a), a;
    } };
  }
  if (r === "setter") {
    const { name: o } = e;
    return function(a) {
      const c = this[o];
      t.call(this, a), this.requestUpdate(o, c, i, !0, a);
    };
  }
  throw Error("Unsupported decorator location: " + r);
};
function Dt(i) {
  return (t, e) => typeof e == "object" ? He(i, t, e) : ((r, n, s) => {
    const o = n.hasOwnProperty(s);
    return n.constructor.createProperty(s, r), o ? Object.getOwnPropertyDescriptor(n, s) : void 0;
  })(i, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function z(i) {
  return Dt({ ...i, state: !0, attribute: !1 });
}
const Et = {
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
}, Yt = Object.keys(Et);
function R(i) {
  if (i)
    return i === "primary" ? "var(--primary-color)" : i === "accent" ? "var(--accent-color)" : Et[i] ? `var(--${i}-color, ${Et[i]})` : i;
}
const st = {
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
}, Zt = ["teal", "amber", "deep-orange", "purple", "pink"], lt = ["teal", "orange", "pink", "cyan", "lime"], Ie = {
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
function Kt(i, t = !0) {
  if (!i) return t ? "mdi:weather-partly-cloudy" : "mdi:weather-night";
  if (!t) {
    if (i === "sunny") return "mdi:weather-night";
    if (i === "partlycloudy") return "mdi:weather-night-partly-cloudy";
  }
  return Ie[i] ?? "mdi:weather-partly-cloudy";
}
const Ue = { top: "#4a90e2", bottom: "#bfe0ff" }, Be = { top: "#0b1a3a", bottom: "#2b4a7d" }, Ge = { top: "#8095a8", bottom: "#c7d3dd" }, Ve = { top: "#2a3546", bottom: "#4a586b" }, je = { top: "#5a6775", bottom: "#93a0ac" }, qe = { top: "#20293a", bottom: "#3c485c" };
function Ye(i, t) {
  const e = i ?? (t ? "partlycloudy" : "clear-night"), r = ["rainy", "pouring", "lightning", "lightning-rainy", "snowy", "snowy-rainy", "hail"].includes(e), n = ["cloudy", "fog", "exceptional"].includes(e) || r, s = r ? t ? je : qe : n ? t ? Ge : Ve : t ? Ue : Be, o = e === "pouring" || e === "lightning-rainy" ? 2 : e === "rainy" || e === "snowy-rainy" || e === "hail" ? 1 : 0, a = e === "sunny" || e === "clear-night" ? 0 : e === "partlycloudy" || e === "windy" || e === "windy-variant" ? 1 : 3;
  return {
    top: s.top,
    bottom: s.bottom,
    luminary: n ? "none" : t ? "sun" : "moon",
    clouds: a,
    rain: o,
    snow: e === "snowy" || e === "snowy-rainy" || e === "hail",
    lightning: e === "lightning" || e === "lightning-rainy",
    fog: e === "fog",
    stars: !t && !n
  };
}
function Ze(i, t, e, r, n, s) {
  return w`<g transform="translate(0 ${t})">
    <g class="cloud" style="animation-duration:${r}s;animation-delay:${n}s">
      <g transform="translate(${i}) scale(${e})">
        <ellipse cx="0" cy="0" rx="26" ry="16" fill=${s}/>
        <ellipse cx="20" cy="4" rx="22" ry="14" fill=${s}/>
        <ellipse cx="-20" cy="5" rx="20" ry="13" fill=${s}/>
        <ellipse cx="2" cy="9" rx="30" ry="12" fill=${s}/>
      </g>
    </g>
  </g>`;
}
function Ke(i) {
  const t = Ye(i.condition, i.isDay), e = i.isDay ? "rgba(255,255,255,0.92)" : "rgba(210,220,235,0.72)", r = 1 + i.wind * 1.4, n = Array.from({ length: 12 }, (l, h) => {
    const d = h / 12 * Math.PI * 2;
    return w`<line x1=${Math.cos(d) * 20} y1=${Math.sin(d) * 20}
      x2=${Math.cos(d) * 30} y2=${Math.sin(d) * 30} stroke="#ffe08a"
      stroke-width="3" stroke-linecap="round"/>`;
  }), s = t.stars ? Array.from({ length: 22 }, (l, h) => {
    const d = 12 + h * 61 % 276, m = 12 + h * 37 % 70, f = 0.7 + h * 13 % 10 / 10;
    return w`<circle class="star" cx=${d} cy=${m} r=${f} fill="#fff"
          style="animation-delay:${h % 7 * 0.4}s"/>`;
  }) : [], o = t.rain > 0 ? Array.from({ length: t.rain === 2 ? 46 : 26 }, (l, h) => {
    const d = 18 + h * 53 % 264, m = 78 + h * 29 % 86;
    return w`<line class="rain" x1=${d} y1=${m} x2=${d - 3} y2=${m + 9}
            stroke="#cfe6ff" stroke-width="1.6" stroke-linecap="round"
            style="animation-delay:${h % 6 * 0.1}s"/>`;
  }) : [], a = t.snow ? Array.from({ length: 30 }, (l, h) => {
    const d = 16 + h * 47 % 268, m = 74 + h * 31 % 92;
    return w`<circle class="snow" cx=${d} cy=${m} r="2" fill="#fff"
          style="animation-delay:${h % 8 * 0.35}s;animation-duration:${3 + h % 4 * 0.7}s"/>`;
  }) : [], c = Array.from({ length: t.clouds }, (l, h) => {
    const d = [
      { x: 60, y: 46, s: 0.9 },
      { x: 150, y: 34, s: 1.15 },
      { x: 220, y: 58, s: 0.75 }
    ], m = d[h % d.length];
    return Ze(m.x, m.y, m.s, (16 + h * 5) / r, -h * 4, e);
  });
  return p`<svg
    class="skyscene"
    viewBox="0 0 300 190"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="wc-sky-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color=${t.top} />
        <stop offset="100%" stop-color=${t.bottom} />
      </linearGradient>
      <radialGradient id="wc-sun-glow">
        <stop offset="0%" stop-color="#fff6cf" stop-opacity="0.9" />
        <stop offset="60%" stop-color="#ffd257" stop-opacity="0.35" />
        <stop offset="100%" stop-color="#ffd257" stop-opacity="0" />
      </radialGradient>
    </defs>
    <style>
      .skyscene .cloud { animation-name: wc-drift; animation-timing-function: linear; animation-iteration-count: infinite; }
      @keyframes wc-drift { from { transform: translateX(-70px); } to { transform: translateX(360px); } }
      .skyscene .sunrays { transform-origin: 62px 52px; animation: wc-spin 90s linear infinite; }
      @keyframes wc-spin { to { transform: rotate(360deg); } }
      .skyscene .star { animation: wc-twinkle 3.2s ease-in-out infinite; }
      @keyframes wc-twinkle { 0%,100% { opacity: 0.25; } 50% { opacity: 1; } }
      .skyscene .rain { animation: wc-rain 0.62s linear infinite; }
      @keyframes wc-rain { from { transform: translateY(-12px); opacity: 0; } 20% { opacity: 0.9; } to { transform: translateY(16px); opacity: 0; } }
      .skyscene .snow { animation-name: wc-snow; animation-timing-function: linear; animation-iteration-count: infinite; }
      @keyframes wc-snow { from { transform: translateY(-10px) translateX(0); opacity: 0; } 20% { opacity: 1; } to { transform: translateY(24px) translateX(6px); opacity: 0; } }
      .skyscene .bolt { animation: wc-flash 4s steps(1) infinite; }
      @keyframes wc-flash { 0%,7%,100% { opacity: 0; } 3% { opacity: 1; } 5% { opacity: 0.3; } 6% { opacity: 0.95; } }
      .skyscene .fog { animation: wc-fog 7s ease-in-out infinite; }
      @keyframes wc-fog { 0%,100% { transform: translateX(-6px); } 50% { transform: translateX(10px); } }
    </style>

    <rect x="0" y="0" width="300" height="190" fill="url(#wc-sky-grad)" />

    ${s}

    ${t.luminary === "sun" ? w`<g>
          <circle cx="62" cy="52" r="40" fill="url(#wc-sun-glow)"/>
          <g class="sunrays">${n}</g>
          <circle cx="62" cy="52" r="17" fill="#ffdf5e"/>
        </g>` : u}
    ${t.luminary === "moon" ? w`<g>
          <circle cx="228" cy="46" r="30" fill="url(#wc-sun-glow)" opacity="0.5"/>
          <circle cx="228" cy="46" r="16" fill="#eef1f7"/>
          <circle cx="221" cy="42" r="14.5" fill=${t.top}/>
        </g>` : u}

    ${c}

    ${t.fog ? w`<g class="fog">
          <rect x="-20" y="120" width="340" height="10" rx="5" fill="rgba(255,255,255,0.5)"/>
          <rect x="-20" y="140" width="340" height="12" rx="6" fill="rgba(255,255,255,0.42)"/>
          <rect x="-20" y="160" width="340" height="14" rx="7" fill="rgba(255,255,255,0.34)"/>
        </g>` : u}

    ${o}
    ${a}

    ${t.lightning ? w`<polygon class="bolt" points="150,70 138,116 152,116 140,158 176,104 158,104 168,70"
          fill="#fff1a8" stroke="#ffd83a" stroke-width="1"/>` : u}

    ${i.glow > 0 ? w`<rect x="0" y="0" width="300" height="190"
          fill=${i.glowColor} opacity=${Math.min(i.glow * 0.35, 0.4)}
          style="mix-blend-mode:overlay"/>` : u}
  </svg>`;
}
const Xt = {
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
}, Jt = {
  en: ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"],
  de: ["N", "NNO", "NO", "ONO", "O", "OSO", "SO", "SSO", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"]
};
function at(i) {
  var e;
  return (((e = i == null ? void 0 : i.locale) == null ? void 0 : e.language) ?? (i == null ? void 0 : i.language) ?? "en").startsWith("de") ? "de" : "en";
}
function v(i, t) {
  return Xt[at(i)][t] ?? Xt.en[t] ?? t;
}
function kt(i, t) {
  return t ? v(i, `cond_${t}`) : "";
}
function Qt(i, t) {
  return t === void 0 || !Number.isFinite(t) ? "" : (Jt[at(i)] ?? Jt.en)[Math.round(t % 360 / 22.5) % 16];
}
function P(i) {
  return at(i) === "de" ? "de-DE" : "en-US";
}
function $(i, t, e) {
  return Number.isFinite(t) ? e === void 0 ? new Intl.NumberFormat(P(i), { maximumFractionDigits: 2 }).format(t) : new Intl.NumberFormat(P(i), {
    minimumFractionDigits: e,
    maximumFractionDigits: e
  }).format(t) : "–";
}
function k(i, t) {
  return t ? /^[%°'"]/.test(t) ? `${i}${t}` : `${i} ${t}` : i;
}
function Q(i, t) {
  if (!Number.isFinite(i)) return "–";
  let e;
  const r = (t ?? "min").toLowerCase();
  r.startsWith("h") ? e = i * 60 : r === "s" || r.startsWith("sec") ? e = i / 60 : e = i;
  const n = Math.round(e * 60), s = Math.floor(n / 3600), o = Math.floor(n % 3600 / 60), a = n % 60;
  return s > 0 ? o ? `${s} h ${o} min` : `${s} h` : o > 0 ? a && o < 10 ? `${o} min ${a} s` : `${o} min` : `${a} s`;
}
function L(i, t) {
  const e = new Date(t);
  if (isNaN(e.getTime())) return "";
  const r = /* @__PURE__ */ new Date(), n = (o, a) => o.getFullYear() === a.getFullYear() && o.getMonth() === a.getMonth() && o.getDate() === a.getDate();
  if (n(e, r))
    return e.toLocaleTimeString(P(i), { hour: "numeric", minute: "2-digit" });
  const s = new Date(r.getTime() - 864e5);
  return n(e, s) ? v(i, "yesterday") : e.toLocaleDateString(P(i), { day: "numeric", month: "short" });
}
function dt(i, t) {
  if (!t) return "";
  const e = new Date(t);
  return isNaN(e.getTime()) ? t : e.toLocaleTimeString(P(i), { hour: "2-digit", minute: "2-digit" });
}
function te(i) {
  const t = (i.getTime() - Date.now()) / 6e4;
  return t > 0 ? Q(t, "min") : "";
}
const T = (i) => typeof i == "number" && Number.isFinite(i);
function Xe(i, t) {
  const e = at(i) === "de", r = (o, a = 0) => $(i, o, a), n = t.tempUnit ?? "°C", s = [];
  if (t.condition && T(t.temp)) {
    const o = T(t.feels) && Math.abs(t.feels - t.temp) >= 2 ? e ? ` (gefühlt ${k(r(t.feels), n)})` : ` (feels like ${k(r(t.feels), n)})` : "";
    s.push(
      e ? `Aktuell ${t.condition.toLowerCase()} bei ${k(r(t.temp), n)}${o}.` : `Currently ${t.condition.toLowerCase()} at ${k(r(t.temp), n)}${o}.`
    );
  } else t.condition ? s.push(e ? `Aktuell ${t.condition.toLowerCase()}.` : `Currently ${t.condition.toLowerCase()}.`) : T(t.temp) && s.push(e ? `Aktuell ${k(r(t.temp), n)}.` : `Currently ${k(r(t.temp), n)}.`);
  if (T(t.hi) && T(t.lo) && s.push(
    e ? `Im Tagesverlauf ${k(r(t.lo), n)} bis ${k(r(t.hi), n)}.` : `Ranging from ${k(r(t.lo), n)} to ${k(r(t.hi), n)} today.`
  ), T(t.windSpeed) && t.windSpeed >= 1) {
    const o = t.windSpeed >= 40, a = t.windDir ? e ? ` aus ${t.windDir}` : ` from the ${t.windDir}` : "", c = o ? e ? "Kräftiger Wind" : "Strong winds" : "Wind";
    s.push(`${c}${a} ${e ? "mit" : "at"} ${k(r(t.windSpeed), t.windUnit ?? "km/h")}.`);
  }
  if (T(t.precipProb) && t.precipProb >= 40 ? s.push(
    e ? `${r(t.precipProb)}% Regenwahrscheinlichkeit — Schirm nicht vergessen.` : `${r(t.precipProb)}% chance of rain — take an umbrella.`
  ) : T(t.precipMm) && t.precipMm >= 1 && s.push(
    e ? `Rund ${k(r(t.precipMm, 1), "mm")} Niederschlag erwartet.` : `About ${k(r(t.precipMm, 1), "mm")} of precipitation expected.`
  ), T(t.uv) && t.uv >= 6 && s.push(
    e ? `Hoher UV-Index (${r(t.uv)}) — an Sonnenschutz denken.` : `High UV index (${r(t.uv)}) — remember sun protection.`
  ), T(t.temp) && (t.temp <= 0 ? s.push(e ? "Frostig — warm einpacken." : "Freezing — bundle up.") : t.temp >= 30 && s.push(e ? "Sehr heiß — viel trinken." : "Very hot — stay hydrated.")), t.tomorrowCondition && T(t.tomorrowHi)) {
    const o = T(t.tomorrowLo) ? `${k(r(t.tomorrowLo), n)}–` : "";
    s.push(
      e ? `Morgen ${t.tomorrowCondition.toLowerCase()}, ${o}${k(r(t.tomorrowHi), n)}.` : `Tomorrow ${t.tomorrowCondition.toLowerCase()}, ${o}${k(r(t.tomorrowHi), n)}.`
    );
  }
  return s.join(" ");
}
async function Je(i, t, e) {
  if (!t.length) return {};
  const r = /* @__PURE__ */ new Date(), n = /* @__PURE__ */ new Date();
  n.setHours(0, 0, 0, 0), n.setDate(n.getDate() - (e - 1));
  const s = await i.callWS({
    type: "history/history_during_period",
    start_time: n.toISOString(),
    end_time: r.toISOString(),
    entity_ids: t,
    minimal_response: !0,
    no_attributes: !0
  }), o = {};
  for (const a of t)
    o[a] = ((s == null ? void 0 : s[a]) ?? []).map((c) => ({ t: c.lu * 1e3, v: parseFloat(c.s) })).filter((c) => Number.isFinite(c.v));
  return o;
}
function Qe(i, t, e) {
  const r = /* @__PURE__ */ new Date();
  r.setHours(0, 0, 0, 0);
  const n = r.getTime() - (t - 1) * 864e5, s = Array.from({ length: t }, () => []);
  for (const o of i) {
    const a = Math.floor((o.t - n) / 864e5);
    a >= 0 && a < t && s[a].push(o.v);
  }
  return s.map((o) => fe(o, e));
}
function fe(i, t) {
  if (!i.length) return NaN;
  switch (t) {
    case "min":
      return Math.min(...i);
    case "max":
      return Math.max(...i);
    case "sum":
      return i.reduce((e, r) => e + r, 0);
    case "last":
      return i[i.length - 1];
    default:
      return i.reduce((e, r) => e + r, 0) / i.length;
  }
}
async function ti(i, t, e, r = "day") {
  if (!t.length) return {};
  const n = /* @__PURE__ */ new Date();
  n.setHours(0, 0, 0, 0), r === "month" ? (n.setDate(1), n.setMonth(n.getMonth() - (e - 1))) : n.setDate(n.getDate() - (e - 1));
  const s = await i.callWS({
    type: "recorder/statistics_during_period",
    start_time: n.toISOString(),
    end_time: (/* @__PURE__ */ new Date()).toISOString(),
    statistic_ids: t,
    period: r,
    types: ["mean", "min", "max", "state", "sum"]
  }), o = (c) => typeof c == "number" && Number.isFinite(c) ? c : null, a = {};
  for (const c of t)
    a[c] = ((s == null ? void 0 : s[c]) ?? []).map((l) => ({
      start: typeof l.start == "number" ? l.start : new Date(l.start).getTime(),
      mean: o(l.mean),
      min: o(l.min),
      max: o(l.max),
      state: o(l.state),
      sum: o(l.sum)
    }));
  return a;
}
function ee(i, t) {
  return t === "min" ? i.min : t === "max" ? i.max ?? i.mean : t === "sum" ? i.sum ?? i.max ?? i.mean : t === "last" ? i.state ?? i.mean : i.mean;
}
function ie(i, t, e, r = "day") {
  const n = new Array(t).fill(NaN);
  if (r === "month") {
    const a = /* @__PURE__ */ new Date(), c = a.getFullYear() * 12 + a.getMonth();
    for (const l of i) {
      const h = new Date(l.start), d = h.getFullYear() * 12 + h.getMonth() - (c - (t - 1));
      if (d < 0 || d >= t) continue;
      const m = ee(l, e);
      m !== null && (n[d] = m);
    }
    return n;
  }
  const s = /* @__PURE__ */ new Date();
  s.setHours(0, 0, 0, 0);
  const o = s.getTime() - (t - 1) * 864e5;
  for (const a of i) {
    const c = Math.floor((a.start - o) / 864e5);
    if (c < 0 || c >= t) continue;
    const l = ee(a, e);
    l !== null && (n[c] = l);
  }
  return n;
}
function ei(i, t, e) {
  const r = /* @__PURE__ */ new Date();
  r.setMinutes(0, 0, 0);
  const n = r.getTime() - (t - 1) * 36e5, s = Array.from({ length: t }, () => []);
  for (const o of i) {
    const a = Math.floor((o.t - n) / 36e5);
    a >= 0 && a < t && s[a].push(o.v);
  }
  return s.map((o) => fe(o, e));
}
function St(i) {
  const t = [...i];
  let e = NaN;
  for (let n = 0; n < t.length; n++)
    Number.isFinite(t[n]) ? e = t[n] : t[n] = e;
  let r = NaN;
  for (let n = t.length - 1; n >= 0; n--)
    Number.isFinite(t[n]) ? r = t[n] : t[n] = r;
  return t;
}
function At(i) {
  const t = i.filter(Number.isFinite);
  return t.length < 2 ? NaN : t[t.length - 1] - t[0];
}
async function ii(i, t, e) {
  var n, s, o, a, c;
  try {
    const l = await i.callWS({
      type: "execute_script",
      sequence: [
        {
          service: "weather.get_forecasts",
          data: { type: e },
          target: { entity_id: t },
          response_variable: "_wc_forecast"
        },
        { stop: "done", response_variable: "_wc_forecast" }
      ]
    }), h = (s = (n = l == null ? void 0 : l.response) == null ? void 0 : n[t]) == null ? void 0 : s.forecast;
    if (Array.isArray(h) && h.length) return h;
  } catch {
  }
  if ((o = i.connection) != null && o.subscribeMessage)
    try {
      const l = await new Promise((h) => {
        let d;
        const m = setTimeout(() => {
          d == null || d(), h([]);
        }, 4e3);
        i.connection.subscribeMessage(
          (f) => {
            clearTimeout(m), d == null || d(), h(f.forecast ?? []);
          },
          {
            type: "weather/subscribe_forecast",
            forecast_type: e,
            entity_id: t
          }
        ).then((f) => {
          d = f;
        }).catch(() => h([]));
      });
      if (l.length) return l;
    } catch {
    }
  const r = (c = (a = i.states[t]) == null ? void 0 : a.attributes) == null ? void 0 : c.forecast;
  return Array.isArray(r) && r.length ? r : [];
}
function ri(i, t) {
  return i.map((e) => e[t]).filter((e) => typeof e == "number" && Number.isFinite(e));
}
function ni(i) {
  return !!i && i.startsWith("weather.");
}
const ye = 220, _e = 60, D = 7, gt = "color-mix(in srgb, var(--primary-text-color) 14%, transparent)";
function be(i, t) {
  var n;
  const e = i.yFmt ? Math.max(26, ...t.map((s) => i.yFmt(s).length * 5.6 + 10)) : D, r = (n = i.xMarks) != null && n.some((s) => s.label) ? 15 : D;
  return { padL: e, padB: r };
}
function si(i) {
  const t = i.filter(Number.isFinite), e = Math.min(...t), r = Math.max(...t), n = r - e || Math.abs(r) * 0.1 || 1;
  return { lo: e - n * 0.18, hi: r + n * 0.18 };
}
function re(i, t = {}) {
  const e = t.w ?? ye, r = t.h ?? _e, n = t.dots ?? !0, s = i.filter((g) => g.values.some(Number.isFinite));
  if (!s.length) return u;
  const { lo: o, hi: a } = si(s.flatMap((g) => g.values)), c = Math.max(...s.map((g) => g.values.length)), l = t.yFmt ? [a - (a - o) * 0.08, (o + a) / 2, o + (a - o) * 0.08] : [], { padL: h, padB: d } = be(t, l), m = (g) => h + g * (e - h - D) / Math.max(c - 1, 1), f = (g) => r - d - (g - o) / (a - o) * (r - d - D), y = l.map(
    (g) => w`
      <line x1=${h} x2=${e - D} y1=${f(g)} y2=${f(g)}
        stroke=${gt} stroke-width="1" stroke-dasharray="2 3"/>
      <text class="axis" x=${h - 5} y=${f(g)} text-anchor="end"
        dominant-baseline="middle">${t.yFmt(g)}</text>`
  ), S = (t.xMarks ?? []).map(
    (g) => w`
      ${g.line ? w`<line x1=${m(g.i)} x2=${m(g.i)} y1=${D} y2=${r - d}
              stroke=${gt} stroke-width="1"/>` : u}
      ${g.label ? w`<text class="axis" x=${m(g.i)} y=${r - 3} text-anchor="middle">${g.label}</text>` : u}`
  ), E = s.map((g) => {
    const b = g.values.map((x, A) => ({ x: m(A), y: f(x), ok: Number.isFinite(x) })).filter((x) => x.ok);
    if (!b.length) return u;
    let _ = `M ${b[0].x} ${b[0].y}`;
    for (let x = 1; x < b.length; x++) {
      const A = (b[x - 1].x + b[x].x) / 2;
      _ += ` C ${A} ${b[x - 1].y}, ${A} ${b[x].y}, ${b[x].x} ${b[x].y}`;
    }
    return w`
      <path d=${_} fill="none" stroke=${g.color} stroke-width="2.2"
        stroke-linecap="round" stroke-linejoin="round"
        stroke-dasharray=${g.dashed ? "4 4" : u} opacity=${g.dashed ? 0.75 : 1}/>
      ${n ? b.map(
      (x) => w`<circle cx=${x.x} cy=${x.y} r="3.1" fill="var(--wc-dot-fill)"
                stroke=${g.color} stroke-width="2"/>`
    ) : u}
    `;
  });
  return p`<svg class="chart" viewBox="0 0 ${e} ${r}" aria-hidden="true">
    ${y}${S}${E}
  </svg>`;
}
function ne(i, t, e, r = {}) {
  const n = r.w ?? ye, s = r.h ?? _e;
  if (!i.some((_) => Number.isFinite(_) && _ > 0)) return u;
  const o = i.map((_) => Number.isFinite(_) && _ > 0 ? _ : 0), a = Math.max(...o, e ?? 0) || 1, c = o.length, l = r.yFmt ? [a, a / 2] : [], { padL: h, padB: d } = be(r, l), m = (n - h - D) / c, f = Math.min(m * 0.55, 14), y = (_) => _ / a * (s - d - D), S = l.map(
    (_) => w`
      <line x1=${h} x2=${n - D} y1=${s - d - y(_)} y2=${s - d - y(_)}
        stroke=${gt} stroke-width="1" stroke-dasharray="2 3"/>
      <text class="axis" x=${h - 5} y=${s - d - y(_)} text-anchor="end"
        dominant-baseline="middle">${r.yFmt(_)}</text>`
  ), E = (r.xMarks ?? []).map((_) => {
    const x = h + _.i * m + m / 2;
    return w`
      ${_.line ? w`<line x1=${x} x2=${x} y1=${D} y2=${s - d}
              stroke=${gt} stroke-width="1"/>` : u}
      ${_.label ? w`<text class="axis" x=${x} y=${s - 3} text-anchor="middle">${_.label}</text>` : u}`;
  }), g = o.map((_, x) => {
    const A = Math.max(y(_), _ > 0 ? 3 : 1.5), N = h + x * m + (m - f) / 2;
    return w`<rect x=${N} y=${s - d - A} width=${f} height=${A}
      rx=${Math.min(f / 2, 4)} fill=${t} opacity=${_ > 0 ? 1 : 0.25}/>`;
  }), b = Number.isFinite(e) ? w`<line x1=${h} x2=${n - D} y1=${s - d - y(e)} y2=${s - d - y(e)}
        stroke=${t} stroke-width="1" stroke-dasharray="3 3" opacity="0.5"/>` : u;
  return p`<svg class="chart" viewBox="0 0 ${n} ${s}" aria-hidden="true">
    ${S}${E}${b}${g}
  </svg>`;
}
const se = [
  "var(--teal-color, #009688)",
  "var(--light-blue-color, #03A9F4)",
  "var(--amber-color, #FFC107)"
], oi = "color-mix(in srgb, var(--primary-text-color) 16%, transparent)";
function ai(i, t, e) {
  const r = (o) => Math.abs(Math.sin(o * 127.1) * 43758.5453 % 1), n = (o) => {
    if (!(e != null && e.length))
      return se[Math.floor(r(o) * se.length)];
    const a = r(o);
    let c = 0;
    for (const l of e)
      if (c += l.share, a <= c) return l.color;
    return e[e.length - 1].color;
  }, s = [];
  for (let o = 0; o < 2; o++) {
    const a = o === 0 ? 74 : 88, c = o === 0 ? 26 : 32;
    for (let l = 0; l < c; l++) {
      const h = l / c, d = h * Math.PI * 2 - Math.PI / 2 + r(l + o * 100) * 0.12, m = a + (r(l * 3 + o * 7) - 0.5) * 6, f = 2.4 + r(l * 7 + o * 13) * 2.4, y = h < t ? n(l * 11 + o * 29) : oi;
      s.push(
        w`<circle cx=${100 + Math.cos(d) * m} cy=${100 + Math.sin(d) * m}
          r=${f} fill=${y} opacity="0.75"/>`
      );
    }
  }
  return p`<svg class="scorering" viewBox="0 0 200 200" aria-hidden="true">
    <circle cx="100" cy="100" r="62" fill="color-mix(in srgb, ${i} 10%, transparent)" />
    ${s}
  </svg>`;
}
function Pt(i, t, e, r) {
  const n = 2 * Math.PI * i;
  return w`<circle cx="100" cy="100" r=${i} fill="none" stroke=${r}
    stroke-width=${t} stroke-linecap="round"
    stroke-dasharray="${n * Math.max(e, 0.02)} ${n}"
    transform="rotate(-90 100 100)"/>`;
}
function Mt(i, t, e = 10) {
  return p`<svg class="scorering" viewBox="0 0 200 200" aria-hidden="true">
    <circle cx="100" cy="100" r=${82} fill="none" stroke=${i} opacity="0.16"
      stroke-width=${e}/>
    ${Pt(82, e, t, i)}
  </svg>`;
}
function ci(i, t, e) {
  const s = 2 * Math.PI * 78, o = `${s * Math.max(t, 0.02)} ${s}`, a = 78 + 13 * 0.27, c = 2 * Math.PI * a, l = 0.18 + t * 0.5, h = t >= 0.95;
  return p`<svg class="scorering" viewBox="-14 -14 228 228" aria-hidden="true">
    <defs>
      <filter id="wc-glow" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="6" />
      </filter>
      <filter id="wc-blur-heavy" x="-90%" y="-90%" width="280%" height="280%">
        <feGaussianBlur stdDeviation="15" />
      </filter>
    </defs>
    ${h ? w`<circle cx="100" cy="100" r="93" fill="none" stroke=${i}
          stroke-width="2.5" opacity="0.4" filter="url(#wc-glow)" class="glowpulse"/>` : u}
    <circle cx="100" cy="100" r=${78} fill="none" stroke=${i}
      stroke-width=${20} stroke-linecap="round" stroke-dasharray=${o}
      transform="rotate(-90 100 100)" filter="url(#wc-glow)" opacity=${l}
      class=${h ? "glowpulse" : ""}/>
    ${e != null && e.length ? e.map((d, m) => {
    const f = m / e.length * 2 * Math.PI - Math.PI / 2;
    return w`<circle cx=${100 + Math.cos(f) * 24} cy=${100 + Math.sin(f) * 24}
            r=${16 + d.share * 26} fill=${d.color}
            filter="url(#wc-blur-heavy)" opacity="0.5"/>`;
  }) : u}
    <circle cx="100" cy="100" r=${78} fill="none" stroke-width=${13}
      stroke="color-mix(in srgb, ${i} 13%, transparent)"/>
    <circle cx="100" cy="100" r=${78 + 13 / 2 - 0.6} fill="none" stroke-width="1"
      stroke="color-mix(in srgb, #fff 30%, transparent)"/>
    <circle cx="100" cy="100" r=${78 - 13 / 2 + 0.6} fill="none" stroke-width="1"
      stroke="color-mix(in srgb, #fff 12%, transparent)"/>
    ${Pt(78, 13, t, i)}
    <circle cx="100" cy="100" r=${a} fill="none" stroke="rgba(255, 255, 255, 0.55)"
      stroke-width="1.6" stroke-linecap="round"
      stroke-dasharray="${c * Math.max(t, 0.02)} ${c}"
      transform="rotate(-90 100 100)"/>
  </svg>`;
}
function li(i, t, e) {
  const r = [];
  for (let o = 0; o <= 144; o++) {
    const a = o / 144 * 2 * Math.PI, c = 72 + 7 * Math.cos(12 * a);
    r.push(
      `${o ? "L" : "M"} ${(100 + Math.cos(a) * c).toFixed(1)} ${(100 + Math.sin(a) * c).toFixed(1)}`
    );
  }
  const s = 92;
  return p`<svg class="scorering" viewBox="0 0 200 200" aria-hidden="true">
    <path d="${r.join(" ")} Z" fill="color-mix(in srgb, ${i} 22%, transparent)"/>
    <circle cx="100" cy="100" r=${s} fill="none" stroke=${t} opacity="0.18"
      stroke-width="5"/>
    ${Pt(s, 5, e, t)}
  </svg>`;
}
function di(i, t, e, r, n) {
  return i === "material" ? li(t, e, r) : i === "bubble" ? Mt(e, r, 15) : i === "mirror" ? Mt("#fff", r, 7) : i === "glass" ? ci(e, r, n) : i === "default" ? Mt(e, r, 10) : ai(e, r, n);
}
function hi(i, t, e) {
  const r = Math.max(0, Math.min(i, 1)), n = 18, s = 182, o = 92, a = 20, c = `M ${n} ${o} Q 100 ${a - 40} ${s} ${o}`, l = r, h = (1 - l) ** 2 * n + 2 * (1 - l) * l * 100 + l ** 2 * s, d = (1 - l) ** 2 * o + 2 * (1 - l) * l * (a - 40) + l ** 2 * o, m = t ? o + 14 : d, f = t ? r < 0.5 ? n - 4 : s + 4 : h;
  return p`<svg class="sunarc" viewBox="0 0 200 110" aria-hidden="true">
    <defs>
      <linearGradient id="wc-sun-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color=${e} stop-opacity="0.28" />
        <stop offset="100%" stop-color=${e} stop-opacity="0" />
      </linearGradient>
    </defs>
    <path d="${c} L ${s} ${o} L ${n} ${o} Z"
      fill="url(#wc-sun-sky)" opacity=${t ? 0.25 : 1}/>
    <path d=${c} fill="none" stroke=${e} stroke-width="2"
      stroke-dasharray="3 4" opacity="0.65"/>
    <line x1="6" x2="194" y1=${o} y2=${o}
      stroke="color-mix(in srgb, var(--primary-text-color) 22%, transparent)"
      stroke-width="1.5"/>
    <circle cx=${f} cy=${m} r="9"
      fill=${t ? "color-mix(in srgb, var(--primary-text-color) 30%, transparent)" : e}
      stroke="var(--wc-card-bg)" stroke-width="2.5"/>
    ${t ? u : w`<circle cx=${f} cy=${m} r="15" fill="none" stroke=${e}
          stroke-width="1.5" opacity="0.4"/>`}
  </svg>`;
}
function pi(i, t) {
  const r = Math.max(0, Math.min(i, 1)), n = "#eef1f6", s = "#39435a", o = 1 - 2 * r, a = 62 * Math.abs(o), c = o > 0 ? 1 : 0, l = `M 0 -62 A 62 62 0 0 1 0 62 A ${a.toFixed(1)} 62 0 0 ${c} 0 -62 Z`;
  return p`<svg class="moondisc" viewBox="0 0 200 200" aria-hidden="true">
    <defs>
      <radialGradient id="wc-moon-glow">
        <stop offset="0%" stop-color="#eef1f6" stop-opacity="0.5" />
        <stop offset="70%" stop-color="#eef1f6" stop-opacity="0.1" />
        <stop offset="100%" stop-color="#eef1f6" stop-opacity="0" />
      </radialGradient>
    </defs>
    <circle cx="100" cy="100" r="88" fill="url(#wc-moon-glow)" opacity=${0.25 + r * 0.65} />
    <g transform="translate(100 100)">
      <circle r=${62} fill=${s} />
      <path d=${l} fill=${n} transform=${t ? u : "scale(-1 1)"} />
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
function ui(i, t, e) {
  const r = i.filter(Number.isFinite);
  let n = i, s = i.length - 1;
  r.length < 3 && (n = Array.from({ length: 24 }, (b, _) => Math.sin(_ / 24 * 2 * Math.PI * 2 - Math.PI / 2)), s = (/* @__PURE__ */ new Date()).getHours());
  const o = 300, a = 96, c = 8, l = Math.min(...n.filter(Number.isFinite)), d = Math.max(...n.filter(Number.isFinite)) - l || 1, m = (b) => c + b * (o - 2 * c) / Math.max(n.length - 1, 1), f = (b) => a - c - (b - l) / d * (a - 2 * c), y = n.map((b, _) => ({ x: m(_), y: f(Number.isFinite(b) ? b : l) }));
  let S = `M ${y[0].x} ${y[0].y}`;
  for (let b = 1; b < y.length; b++) {
    const _ = (y[b - 1].x + y[b].x) / 2;
    S += ` C ${_} ${y[b - 1].y}, ${_} ${y[b].y}, ${y[b].x} ${y[b].y}`;
  }
  const E = `${S} L ${y[y.length - 1].x} ${a} L ${y[0].x} ${a} Z`, g = Math.max(0, Math.min(Math.round(s), y.length - 1));
  return p`<svg class="tidechart" viewBox="0 0 ${o} ${a}" aria-hidden="true">
    <defs>
      <linearGradient id="wc-tide-fill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color=${t} stop-opacity="0.35" />
        <stop offset="100%" stop-color=${t} stop-opacity="0.02" />
      </linearGradient>
    </defs>
    <path d=${E} fill="url(#wc-tide-fill)" />
    <path d=${S} fill="none" stroke=${t} stroke-width="2.4" stroke-linecap="round" />
    <line x1=${y[g].x} x2=${y[g].x} y1=${y[g].y} y2=${a}
      stroke=${t} stroke-width="1" stroke-dasharray="2 3" opacity="0.5" />
    <circle cx=${y[g].x} cy=${y[g].y} r="5" fill=${t}
      stroke="var(--wc-card-bg)" stroke-width="2.5" />
  </svg>`;
}
function mi(i, t, e) {
  const r = Number.isFinite(i), n = ((r ? i : 0) - 90) * (Math.PI / 180);
  return p`<svg class="windrose" viewBox="0 0 200 200" aria-hidden="true">
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
          <line x1=${Math.cos(n) * 58} y1=${Math.sin(n) * 58}
            x2=${-Math.cos(n) * 58} y2=${-Math.sin(n) * 58}
            stroke=${e} stroke-width="5" stroke-linecap="round"/>
          <polygon points="0,-9 0,9 62,0"
            transform="rotate(${i + 90})" fill=${e}/>
        </g>` : u}
    <circle cx="100" cy="100" r="6" fill=${e}/>
  </svg>`;
}
var gi = Object.defineProperty, fi = Object.getOwnPropertyDescriptor, yt = (i, t, e, r) => {
  for (var n = r > 1 ? void 0 : r ? fi(t, e) : t, s = i.length - 1, o; s >= 0; s--)
    (o = i[s]) && (n = (r ? o(t, e, n) : o(n)) || n);
  return r && n && gi(t, e, n), n;
};
const yi = Object.keys(st), _i = ["air_quality", "pollen"], bi = [
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
], Nt = {
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
    style_default: "HA default",
    style_withings: "Withings",
    style_glass: "Liquid Glass",
    style_material: "Material You",
    style_bubble: "Bubble",
    style_mirror: "Magic Mirror",
    sec_display: "Appearance",
    sec_goal: "Goal & progress",
    sec_behavior: "Behavior & data",
    sec_forecast: "Forecast",
    sec_parts: "Precipitation by time of day",
    sec_sky: "Sky scene",
    sec_sun: "Sun",
    sec_moon: "Moon",
    sec_tides: "Tides",
    sec_radar: "Radar",
    sec_summary: "AI summary",
    illumination_entity: "Illumination entity (0-1 or %)",
    high_tide_entity: "Next high tide entity",
    low_tide_entity: "Next low tide entity",
    image_url: "Radar image URL",
    refresh: "Refresh (seconds)",
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
    style_default: "HA-Standard",
    style_withings: "Withings",
    style_glass: "Liquid Glass",
    style_material: "Material You",
    style_bubble: "Bubble",
    style_mirror: "Magic Mirror",
    sec_display: "Darstellung",
    sec_goal: "Ziel & Fortschritt",
    sec_behavior: "Verhalten & Daten",
    sec_forecast: "Vorhersage",
    sec_parts: "Niederschlag nach Tageszeit",
    sec_sky: "Himmel-Szene",
    sec_sun: "Sonne",
    sec_moon: "Mond",
    sec_tides: "Gezeiten",
    sec_radar: "Radar",
    sec_summary: "AI-Zusammenfassung",
    illumination_entity: "Beleuchtungs-Entität (0-1 oder %)",
    high_tide_entity: "Nächste-Flut-Entität",
    low_tide_entity: "Nächste-Ebbe-Entität",
    image_url: "Radar-Bild-URL",
    refresh: "Aktualisierung (Sekunden)",
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
let K = class extends q {
  constructor() {
    super(...arguments), this._expanded = -1;
  }
  setConfig(i) {
    this._config = i;
  }
  _label(i) {
    return (Nt[at(this.hass)] ?? Nt.en)[i] ?? Nt.en[i] ?? i;
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
                options: ["default", "withings", "glass", "material", "bubble", "mirror"].map(
                  (i) => ({ value: i, label: this._label(`style_${i}`) })
                )
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
  _metricSchema(i) {
    const t = i.type ?? "custom", e = (s, o) => s.map((a) => ({ value: a, label: this._label(`${o}_${a}`) })), r = !i.entities || i.entities.every((s) => typeof s == "string"), n = (s, o, a) => ({
      type: "expandable",
      name: "",
      flatten: !0,
      title: this._label(s),
      icon: o,
      schema: a
    });
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
                options: yi.map((s) => ({ value: s, label: v(this.hass, s) }))
              }
            }
          },
          { name: "name", selector: { text: {} } }
        ]
      },
      { name: "entity", selector: { entity: {} } },
      ...t === "wind" ? [{ name: "entity2", selector: { entity: {} } }] : [],
      ..._i.includes(t) && r ? [{ name: "entities", selector: { entity: { multiple: !0 } } }] : [],
      ...t === "air_quality" && (!i.breakdown || i.breakdown.every((s) => typeof s == "string")) ? [{ name: "breakdown", selector: { entity: { multiple: !0 } } }] : [],
      n("sec_display", "mdi:palette-outline", [
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
                  options: Yt.map((s) => ({ value: s, label: s }))
                }
              }
            },
            { name: "unit", selector: { text: {} } },
            {
              name: "graph",
              selector: {
                select: {
                  mode: "dropdown",
                  options: e(["line", "bar", "progress", "none"], "graph")
                }
              }
            },
            { name: "days", selector: { number: { min: 1, max: 60, mode: "box" } } },
            { name: "precision", selector: { number: { min: 0, max: 3, mode: "box" } } }
          ]
        },
        { name: "label", selector: { text: {} } },
        { name: "expanded", selector: { boolean: {} } }
      ]),
      ...bi.includes(t) ? [
        n("sec_forecast", "mdi:weather-partly-cloudy", [
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
                    options: e(["hourly", "daily", "twice_daily"], "ft")
                  }
                }
              },
              {
                name: "forecast_count",
                selector: { number: { min: 2, max: 24, mode: "box" } }
              }
            ]
          }
        ])
      ] : [],
      n("sec_goal", "mdi:flag-checkered", [
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
              selector: { select: { mode: "dropdown", options: e(["atleast", "atmost"], "gt") } }
            },
            ...t === "air_quality" || t === "pollen" ? [{ name: "max", selector: { number: { min: 1, mode: "box" } } }] : []
          ]
        }
      ]),
      n("sec_behavior", "mdi:gesture-tap", [
        {
          type: "grid",
          name: "",
          schema: [
            {
              name: "tap_action",
              selector: {
                select: {
                  mode: "dropdown",
                  options: e(["popup", "more-info", "link", "none"], "ta")
                }
              }
            },
            ...i.tap_action === "link" ? [{ name: "link", selector: { text: {} } }] : [],
            {
              name: "aggregate",
              selector: {
                select: {
                  mode: "dropdown",
                  options: e(["mean", "min", "max", "sum", "last"], "agg")
                }
              }
            },
            {
              name: "trend",
              selector: {
                select: {
                  mode: "dropdown",
                  options: e(["up_good", "down_good", "neutral", "none"], "trend")
                }
              }
            }
          ]
        },
        { name: "secondary", selector: { entity: { multiple: !0 } } },
        { name: "score_entity", selector: { entity: {} } }
      ]),
      ...t === "sky" ? [
        n("sec_sky", "mdi:weather-partly-cloudy", [
          {
            type: "grid",
            name: "",
            schema: [
              { name: "condition_entity", selector: { entity: {} } },
              { name: "sun_entity", selector: { entity: { domain: "sun" } } },
              { name: "wind_entity", selector: { entity: {} } },
              { name: "scene_offset_y", selector: { number: { min: -40, max: 40, mode: "slider" } } }
            ]
          },
          {
            name: "label_opacity",
            selector: { number: { min: 0, max: 1, step: 0.05, mode: "slider" } }
          },
          { name: "night", selector: { boolean: {} } }
        ])
      ] : [],
      ...t === "sun" ? [
        n("sec_sun", "mdi:weather-sunset", [
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
        ])
      ] : [],
      ...t === "moon" ? [
        n("sec_moon", "mdi:moon-waning-crescent", [
          { name: "illumination_entity", selector: { entity: {} } }
        ])
      ] : [],
      ...t === "tides" ? [
        n("sec_tides", "mdi:waves", [
          {
            type: "grid",
            name: "",
            schema: [
              { name: "high_tide_entity", selector: { entity: {} } },
              { name: "low_tide_entity", selector: { entity: {} } }
            ]
          }
        ])
      ] : [],
      ...t === "radar" ? [
        n("sec_radar", "mdi:radar", [
          { name: "image_url", selector: { text: {} } },
          { name: "refresh", selector: { number: { min: 5, mode: "box" } } }
        ])
      ] : [],
      ...t === "summary" ? [
        n("sec_summary", "mdi:creation", [
          { name: "summary_entity", selector: { entity: {} } },
          { name: "summary_sources", selector: { entity: { multiple: !0 } } }
        ])
      ] : [],
      ...t === "precipitation" ? [
        n("sec_parts", "mdi:weather-pouring", [
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
        ])
      ] : []
    ];
  }
  render() {
    return !this.hass || !this._config ? u : p`
      <ha-form
        .hass=${this.hass}
        .data=${{
      tiles: !0,
      background: !0,
      layout: "grid",
      card_style: "withings",
      ...this._config
    }}
        .schema=${this._topSchema()}
        .computeLabel=${(i) => this._label(i.name)}
        @value-changed=${this._topChanged}
      ></ha-form>

      <div class="metrics">
        ${this._config.metrics.map((i, t) => this._renderMetricEditor(i, t))}
      </div>

      <button class="add" @click=${this._addMetric}>
        <ha-icon icon="mdi:plus"></ha-icon>
        ${this._label("add_metric")}
      </button>
    `;
  }
  _renderMetricEditor(i, t) {
    var o, a, c, l;
    const e = i.type ?? "custom", r = st[e] ?? st.custom, n = this._expanded === t, s = this._config.metrics.length;
    return p`
      <div class="metric ${n ? "open" : ""}">
        <div class="metric-head" @click=${() => this._expanded = n ? -1 : t}>
          <span class="chip" style="--c:${R(i.color) ?? R(r.color)}">
            <ha-icon .icon=${i.icon ?? r.icon}></ha-icon>
          </span>
          <span class="metric-title">
            ${i.name ?? v(this.hass, e)}
            <span class="metric-entity">${i.entity ?? ""}</span>
          </span>
          <button class="icon-btn" .disabled=${t === 0} title="↑" @click=${(h) => this._move(h, t, -1)}>
            <ha-icon icon="mdi:chevron-up"></ha-icon>
          </button>
          <button class="icon-btn" .disabled=${t === s - 1} title="↓" @click=${(h) => this._move(h, t, 1)}>
            <ha-icon icon="mdi:chevron-down"></ha-icon>
          </button>
          <button class="icon-btn danger" @click=${(h) => this._remove(h, t)}>
            <ha-icon icon="mdi:delete-outline"></ha-icon>
          </button>
          <ha-icon class="expand" icon=${n ? "mdi:chevron-up" : "mdi:chevron-down"}></ha-icon>
        </div>
        ${n ? p`<div class="metric-body">
              <ha-form
                .hass=${this.hass}
                .data=${{
      ...i,
      goal: typeof i.goal == "number" ? i.goal : void 0,
      goal_entity: typeof i.goal == "string" ? i.goal : void 0,
      start: typeof i.start == "number" ? i.start : void 0,
      start_entity: typeof i.start == "string" ? i.start : void 0,
      parts_morning: (o = i.parts) == null ? void 0 : o.morning,
      parts_noon: (a = i.parts) == null ? void 0 : a.noon,
      parts_evening: (c = i.parts) == null ? void 0 : c.evening,
      parts_night: (l = i.parts) == null ? void 0 : l.night
    }}
                .schema=${this._metricSchema(i)}
                .computeLabel=${(h) => this._label(h.name)}
                @value-changed=${(h) => this._metricChanged(h, t)}
              ></ha-form>
              ${e === "sky" ? this._renderAnchorEditor(i, t) : u}
            </div>` : u}
      </div>
    `;
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
                options: Yt.map((i) => ({ value: i, label: i }))
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
  _renderAnchorEditor(i, t) {
    const e = i.anchors ?? [];
    return p`
      <div class="anchor-editor">
        <div class="anchor-editor-title">${this._label("anchors")}</div>
        ${e.map(
      (r, n) => p`
            <div class="anchor-row">
              <ha-form
                .hass=${this.hass}
                .data=${{ ...r, anchor_x: r.x, anchor_y: r.y }}
                .schema=${this._anchorSchema()}
                .computeLabel=${(s) => this._label(s.name)}
                @value-changed=${(s) => this._anchorChanged(s, t, n)}
              ></ha-form>
              <button class="icon-btn danger" title="✕" @click=${() => this._removeAnchor(t, n)}>
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
  _anchorChanged(i, t, e) {
    if (i.stopPropagation(), !this._config) return;
    const r = { ...i.detail.value }, n = {};
    r.entity && (n.entity = r.entity), r.entity2 && (n.entity2 = r.entity2), r.name && (n.name = r.name), r.color && (n.color = r.color), r.anchor_x !== void 0 && r.anchor_x !== null && (n.x = r.anchor_x), r.anchor_y !== void 0 && r.anchor_y !== null && (n.y = r.anchor_y), r.dot && (n.dot = r.dot);
    const s = [...this._config.metrics], o = [...s[t].anchors ?? []];
    o[e] = n, s[t] = { ...s[t], anchors: o }, this._emit({ ...this._config, metrics: s });
  }
  _addAnchor(i) {
    if (!this._config) return;
    const t = [...this._config.metrics], e = [...t[i].anchors ?? [], { entity: "", x: 50, y: 20 }];
    t[i] = { ...t[i], anchors: e }, this._emit({ ...this._config, metrics: t });
  }
  _removeAnchor(i, t) {
    if (!this._config) return;
    const e = [...this._config.metrics], r = (e[i].anchors ?? []).filter((n, s) => s !== t);
    e[i] = { ...e[i], anchors: r }, this._emit({ ...this._config, metrics: e });
  }
  _emit(i) {
    this._config = i, this.dispatchEvent(
      new CustomEvent("config-changed", { detail: { config: i }, bubbles: !0, composed: !0 })
    );
  }
  _clean(i) {
    const t = {};
    for (const [e, r] of Object.entries(i))
      r === "" || r === null || r === void 0 || Array.isArray(r) && !r.length || (t[e] = r);
    return t;
  }
  _topChanged(i) {
    if (i.stopPropagation(), !this._config) return;
    const t = i.detail.value;
    this._emit(this._clean({ ...this._config, ...t, metrics: this._config.metrics }));
  }
  _metricChanged(i, t) {
    if (i.stopPropagation(), !this._config) return;
    const e = { ...i.detail.value }, r = {};
    for (const s of ["morning", "noon", "evening", "night"]) {
      const o = e[`parts_${s}`];
      delete e[`parts_${s}`], typeof o == "string" && o && (r[s] = o);
    }
    Object.keys(r).length ? e.parts = r : delete e.parts;
    for (const s of ["goal", "start"]) {
      const o = e[`${s}_entity`];
      delete e[`${s}_entity`], typeof o == "string" && o && (e[s] = o);
    }
    const n = [...this._config.metrics];
    n[t] = this._clean(e), this._emit({ ...this._config, metrics: n });
  }
  _addMetric() {
    if (!this._config) return;
    const i = [...this._config.metrics, { type: "temperature" }];
    this._expanded = i.length - 1, this._emit({ ...this._config, metrics: i });
  }
  _remove(i, t) {
    if (i.stopPropagation(), !this._config) return;
    const e = this._config.metrics.filter((r, n) => n !== t);
    this._expanded === t && (this._expanded = -1), this._emit({ ...this._config, metrics: e });
  }
  _move(i, t, e) {
    if (i.stopPropagation(), !this._config) return;
    const r = [...this._config.metrics], n = t + e;
    n < 0 || n >= r.length || ([r[t], r[n]] = [r[n], r[t]], this._expanded === t && (this._expanded = n), this._emit({ ...this._config, metrics: r }));
  }
};
K.styles = le`
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
    .chip ha-icon { --mdc-icon-size: 17px; }
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
    .icon-btn ha-icon { --mdc-icon-size: 18px; }
    .expand { color: var(--secondary-text-color); }
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
    .add ha-icon { --mdc-icon-size: 18px; }
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
yt([
  Dt({ attribute: !1 })
], K.prototype, "hass", 2);
yt([
  z()
], K.prototype, "_config", 2);
yt([
  z()
], K.prototype, "_expanded", 2);
K = yt([
  ge("weatherglass-card-editor")
], K);
var xi = Object.defineProperty, vi = Object.getOwnPropertyDescriptor, O = (i, t, e, r) => {
  for (var n = r > 1 ? void 0 : r ? vi(t, e) : t, s = i.length - 1, o; s >= 0; s--)
    (o = i[s]) && (n = (r ? o(t, e, n) : o(n)) || n);
  return r && n && xi(t, e, n), n;
};
const wi = "0.2.0", $i = 5 * 60 * 1e3, ki = 15 * 60 * 1e3, Si = 15 * 60 * 1e3, Ai = ["default", "withings", "glass", "material", "bubble", "mirror"], Mi = ["air_quality"], oe = [
  "temperature",
  "feels_like",
  "wind",
  "precipitation",
  "humidity",
  "uv",
  "pressure",
  "cloud",
  "sky"
], ht = [
  { key: "day", kind: "hour", count: 24 },
  { key: "week", kind: "day", count: 7 },
  { key: "month", kind: "day", count: 30 },
  { key: "quarter", kind: "day", count: 90 },
  { key: "year", kind: "day", count: 365 },
  { key: "max", kind: "month", count: 60 }
];
let C = class extends q {
  constructor() {
    super(...arguments), this._history = {}, this._popup = null, this._popupRange = null, this._tileRanges = {}, this._statsCache = {}, this._forecasts = {}, this._statsCacheTime = {}, this._statsFetching = /* @__PURE__ */ new Set(), this._forecastTime = {}, this._forecastFetching = /* @__PURE__ */ new Set(), this._onKeydown = (i) => {
      i.key === "Escape" && this._popup !== null && (this._popup = null);
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
  static getStubConfig(i) {
    const t = Object.keys(i.states).find((r) => r.startsWith("weather.")), e = [];
    return t ? (e.push({ type: "sky", entity: t }), e.push({ type: "summary" })) : e.push({ type: "temperature", entity: "" }), { title: "Wetter", weather: t, metrics: e };
  }
  setConfig(i) {
    if (!i || !Array.isArray(i.metrics) || !i.metrics.length)
      throw new Error("Please define at least one metric (metrics: [...])");
    this._config = i;
  }
  getCardSize() {
    var t, e;
    return 1 + Math.ceil(
      (((t = this._config) == null ? void 0 : t.metrics.length) ?? 1) / (((e = this._config) == null ? void 0 : e.columns) ?? 1)
    ) * 2;
  }
  getGridOptions() {
    return { columns: 12, min_columns: 6 };
  }
  updated(i) {
    var t;
    super.updated(i), (i.has("hass") || i.has("_config")) && (this._maybeFetch(), this._syncForecasts()), this._syncStats(), (i.has("_popup") || i.has("_popupRange") || i.has("_tileRanges") || i.has("_statsCache")) && ((t = this.renderRoot) == null || t.querySelectorAll(".chart-scroll").forEach((e) => e.scrollLeft = e.scrollWidth));
  }
  _activeRange() {
    return ht.find((i) => i.key === this._popupRange) ?? null;
  }
  /* ---- forecast ------------------------------------------------------- */
  _defaultForecastType(i) {
    return i === "precipitation" || i === "temperature" || i === "feels_like" || i === "wind" ? "hourly" : "daily";
  }
  /** The weather entity a metric draws its forecast from, if any. */
  _forecastId(i) {
    var t;
    return i.forecast ? i.forecast : ni(i.entity) ? i.entity : (t = this._config) == null ? void 0 : t.weather;
  }
  _forecastFor(i, t = "daily") {
    return i ? this._forecasts[`${i}|${t}`] ?? [] : [];
  }
  _syncForecasts() {
    if (!this.hass || !this._config) return;
    const i = /* @__PURE__ */ new Set(), t = this._config.weather;
    t && this.hass.states[t] && (i.add(`${t}|daily`), i.add(`${t}|hourly`)), this._config.metrics.forEach((e) => {
      const r = e.type ?? "custom", n = this._forecastId(e);
      !n || !this.hass.states[n] || (oe.includes(r) || r === "summary" || e.forecast) && i.add(`${n}|${e.forecast_type ?? this._defaultForecastType(r)}`);
    });
    for (const e of i) {
      const [r, n] = e.split("|");
      this._ensureForecast(r, n);
    }
  }
  _ensureForecast(i, t) {
    const e = `${i}|${t}`;
    this._forecasts[e] && Date.now() - (this._forecastTime[e] ?? 0) < Si || this._forecastFetching.has(e) || (this._forecastFetching.add(e), ii(this.hass, i, t).then((n) => {
      this._forecastTime[e] = Date.now(), this._forecasts = { ...this._forecasts, [e]: n };
    }).catch((n) => console.warn("weatherglass-card: forecast fetch failed", n)).finally(() => this._forecastFetching.delete(e)));
  }
  /* ---- statistics + history ------------------------------------------ */
  _syncStats() {
    if (!this.hass || !this._config) return;
    const i = [];
    if (this._popup !== null) {
      const t = this._activeRange();
      t && i.push(t);
    }
    this._config.metrics.forEach((t, e) => {
      if (!t.expanded) return;
      const r = ht.find((n) => n.key === this._tileRanges[e]);
      r && i.push(r);
    });
    for (const t of i) {
      const e = t.kind === "month" ? "month" : t.kind === "day" && t.count > 10 ? "day" : null;
      e && this._ensureStats(e, t.count);
    }
  }
  _ensureStats(i, t) {
    const e = `${i}|${t}`;
    if (this._statsCache[e] && Date.now() - (this._statsCacheTime[e] ?? 0) < 18e5 || this._statsFetching.has(e)) return;
    const n = this._watchedEntities();
    n.length && (this._statsFetching.add(e), ti(this.hass, n, t, i).then((s) => {
      this._statsCacheTime[e] = Date.now(), this._statsCache = { ...this._statsCache, [e]: s };
    }).catch((s) => console.warn("weatherglass-card: statistics fetch failed", s)).finally(() => this._statsFetching.delete(e)));
  }
  _bucketsFor(i, t, e, r) {
    var n, s;
    if (t === "hour")
      return ei(this._history[i] ?? [], e, r);
    if (t === "month") {
      const o = (n = this._statsCache[`month|${e}`]) == null ? void 0 : n[i];
      return o != null && o.length ? ie(o, e, r, "month") : new Array(e).fill(NaN);
    }
    if (e > 10) {
      const o = (s = this._statsCache[`day|${e}`]) == null ? void 0 : s[i];
      if (o != null && o.length) return ie(o, e, r, "day");
    }
    return Qe(this._history[i] ?? [], e, r);
  }
  _watchedEntities() {
    var t;
    const i = /* @__PURE__ */ new Set();
    for (const e of ((t = this._config) == null ? void 0 : t.metrics) ?? []) {
      for (const r of this._series(e)) r.entity && i.add(r.entity);
      for (const r of e.secondary ?? []) i.add(r);
      for (const r of Object.values(e.parts ?? {})) r && i.add(r);
      e.score_entity && i.add(e.score_entity), e.wind_entity && i.add(e.wind_entity);
      for (const r of e.anchors ?? [])
        i.add(r.entity), r.entity2 && i.add(r.entity2);
      for (const r of e.breakdown ?? []) i.add(typeof r == "string" ? r : r.entity);
    }
    return [...i].filter(
      (e) => {
        var r;
        return ((r = this.hass) == null ? void 0 : r.states[e]) && !e.startsWith("weather.");
      }
    );
  }
  _resolveGoal(i) {
    if (typeof i == "number") return i;
    if (typeof i != "string" || !i) return NaN;
    const t = this.hass.states[i];
    return parseFloat(t ? t.state : i);
  }
  _handleTap(i, t, e) {
    const r = i.tap_action ?? "popup";
    if (r !== "none") {
      if (r === "link") {
        if (!i.link) return;
        if (/^https?:\/\//.test(i.link)) {
          window.open(i.link, "_blank", "noopener");
          return;
        }
        history.pushState(null, "", i.link), this.dispatchEvent(new Event("location-changed", { bubbles: !0, composed: !0 }));
        return;
      }
      if (r === "more-info") {
        this._moreInfo(e);
        return;
      }
      this._popupRange = i.type === "wind" || i.type === "temperature" ? "day" : null, this._popup = t;
    }
  }
  _maybeFetch() {
    if (!this.hass || !this._config || this._fetching) return;
    const i = this._watchedEntities();
    if (!i.length) return;
    const t = Math.max(
      ...this._config.metrics.map((o) => o.days ?? this._config.days ?? 7)
    ), e = `${t}|${i.join(",")}`, r = i.map((o) => {
      var a;
      return ((a = this.hass.states[o]) == null ? void 0 : a.last_updated) ?? "";
    }).join("|"), n = Date.now();
    (e !== this._cfgSig || n - this._lastFetch > ki || r !== this._stateSig && n - this._lastFetch > $i) && (this._fetching = !0, this._cfgSig = e, this._stateSig = r, Je(this.hass, i, t).then((o) => {
      this._history = o, this._lastFetch = Date.now();
    }).catch((o) => console.warn("weatherglass-card: history fetch failed", o)).finally(() => this._fetching = !1));
  }
  _series(i) {
    var e, r;
    if ((e = i.entities) != null && e.length)
      return i.entities.map((n) => typeof n == "string" ? { entity: n } : n);
    const t = [];
    return i.entity && t.push({ entity: i.entity }), i.entity2 && t.push({ entity: i.entity2 }), !t.length && i.type === "sky" && ((r = this._config) != null && r.weather) && t.push({ entity: this._config.weather }), t;
  }
  _numeric(i, t) {
    if (!i) return NaN;
    const e = t ? i.attributes[t] : i.state;
    return typeof e == "number" ? e : parseFloat(e);
  }
  _moreInfo(i) {
    i && this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        detail: { entityId: i },
        bubbles: !0,
        composed: !0
      })
    );
  }
  _cardStyle() {
    var t;
    const i = ((t = this._config) == null ? void 0 : t.card_style) ?? "withings";
    return Ai.includes(i) ? i : "withings";
  }
  render() {
    if (!this.hass || !this._config) return u;
    const i = this._config, e = [
      "cardroot",
      `s-${this._cardStyle()}`,
      i.tiles === !1 ? "flat" : "tiles",
      i.flush ? "flush" : ""
    ].join(" "), r = p`
      ${i.title ? p`<div class="header">
            <div class="title">${i.title}</div>
            ${i.subtitle ? p`<div class="subtitle">${i.subtitle}</div>` : u}
          </div>` : u}
      <div
        class="metrics ${i.layout === "carousel" ? "carousel" : ""}"
        style="--wc-columns:${i.columns ?? 1}"
      >
        ${i.metrics.map((n, s) => this._renderMetric(n, s))}
      </div>
    `;
    return p`
      ${i.background === !1 ? p`<div class="${e} nobg">${r}</div>` : p`<ha-card class=${e}>${r}</ha-card>`}
      ${this._renderPopup()}
    `;
  }
  _ctx(i, t) {
    var _, x, A;
    const e = i.type && st[i.type] ? i.type : "custom", r = st[e], n = R(i.color) ?? R(r.color), s = i.name ?? v(this.hass, e), o = i.icon ?? r.icon;
    let a = this._series(i);
    const c = Object.values(i.parts ?? {}).filter(Boolean);
    !a.length && e === "precipitation" && c.length && (a = [{ entity: c[0] }]);
    const l = (_ = a[0]) != null && _.entity ? this.hass.states[a[0].entity] : void 0, h = (t == null ? void 0 : t.kind) ?? "day", d = Math.max(1, (t == null ? void 0 : t.count) ?? i.days ?? ((x = this._config) == null ? void 0 : x.days) ?? 7), m = i.graph ?? r.graph, f = i.aggregate ?? r.aggregate, y = i.trend ?? r.trend, S = i.precision ?? r.precision, E = i.unit ?? ((A = a[0]) == null ? void 0 : A.unit) ?? (l == null ? void 0 : l.attributes.unit_of_measurement) ?? r.unit ?? "", g = a.map((N, M) => {
      const F = this._bucketsFor(N.entity, h, d, f);
      return {
        ...N,
        colorResolved: R(N.color) ?? (M === 0 ? n : R(lt[(M - 1) % lt.length])),
        buckets: F,
        filled: St(F)
      };
    });
    let b;
    if (e === "precipitation" && !i.entity && i.parts && g.length) {
      const N = c, M = N.map((V) => this._bucketsFor(V, h, d, f)), F = Array.from({ length: d }, (V, _t) => {
        const zt = M.map((bt) => bt[_t]).filter(Number.isFinite);
        return zt.length ? zt.reduce((bt, xe) => bt + xe, 0) : NaN;
      });
      g[0] = { ...g[0], buckets: F, filled: St(F) };
      const ct = N.map((V) => this._numeric(this.hass.states[V])).filter(Number.isFinite);
      ct.length && (b = ct.reduce((V, _t) => V + _t, 0));
    }
    return {
      m: i,
      type: e,
      preset: r,
      accent: n,
      name: s,
      icon: o,
      series: a,
      primaryState: l,
      days: d,
      kind: h,
      graph: m,
      aggregate: f,
      trendMode: y,
      precision: S,
      unit: E,
      data: g,
      valueOverride: b,
      goalType: i.goal_type ?? r.goalType ?? "atleast",
      multi: !!i.entities && a.length > 1
    };
  }
  _renderMetric(i, t) {
    var c, l;
    const e = this._ctx(i);
    if (e.type === "summary") return this._renderSummary(e, t);
    if (e.type === "sun") return this._renderSun(e, t);
    if (e.type === "moon") return this._renderMoon(e, t);
    if (e.type === "tides") return this._renderTides(e, t);
    if (e.type === "radar") return this._renderRadar(e, t);
    if (!e.series.length || !e.primaryState)
      return p`
        <div class="metric" style="--wc-accent:${e.accent}">
          <div class="head">
            <div class="iconchip"><ha-icon .icon=${e.icon}></ha-icon></div>
            <div class="name">${e.name}</div>
          </div>
          <div class="missing">
            ${(c = e.series[0]) != null && c.entity ? p`${v(this.hass, "entity_missing")}: ${e.series[0].entity}` : v(this.hass, "no_data")}
          </div>
        </div>
      `;
    if (e.type === "sky") return this._renderSky(e, t);
    if (e.type === "pollen") return this._renderPollen(e, t);
    if (Mi.includes(e.type)) return this._renderScore(e, t);
    if (i.expanded) {
      const h = ht.find((f) => f.key === this._tileRanges[t]) ?? null, d = h ? this._ctx(i, h) : e, m = this._tileRanges[t] ?? (d.days === 7 && d.kind === "day" ? "week" : "");
      return p`
        <div
          class="metric expanded ${(i.tap_action ?? "popup") === "none" ? "noclick" : ""}"
          style="--wc-accent:${e.accent}"
          @click=${() => this._handleTap(i, t, e.series[0].entity)}
        >
          <div class="head">
            <div class="iconchip"><ha-icon .icon=${e.icon}></ha-icon></div>
            <div class="name">${e.name}</div>
            ${this._renderScoreBadge(i)}
            <div class="time">${L(this.hass, e.primaryState.last_updated)}</div>
          </div>
          <div class="exp-value">
            ${this._renderValue(i, d)}
            ${this._renderStatus(i, d)}
          </div>
          ${this._renderDetails(i, d, m, (f) => {
        this._tileRanges = { ...this._tileRanges, [t]: f };
      })}
        </div>
      `;
    }
    const r = !e.multi || !!i.label, n = e.multi && e.graph !== "progress", s = !e.multi, o = e.multi && e.graph === "progress", a = this._metricForecast(i);
    return p`
      <div
        class="metric ${(i.tap_action ?? "popup") === "none" ? "noclick" : ""}"
        style="--wc-accent:${e.accent}"
        @click=${() => this._handleTap(i, t, e.series[0].entity)}
      >
        <div class="head">
          <div class="iconchip"><ha-icon .icon=${e.icon}></ha-icon></div>
          <div class="name">${e.name}</div>
          ${this._renderScoreBadge(i)}
          <div class="time">${L(this.hass, e.primaryState.last_updated)}</div>
        </div>
        <div class="body ${o ? "stack" : ""}">
          ${r || n || s || (l = i.secondary) != null && l.length ? p`<div class="info">
                ${r ? this._renderValue(i, e) : u}
                ${n ? this._renderSeriesChips(e.data, e.precision, e.trendMode) : u}
                ${this._renderSecondary(i)}
                ${s ? this._renderStatus(i, e) : u}
              </div>` : u}
          <div class="chartcell">
            ${this._renderChart(i, e.graph, e.data, e.unit, e.precision)}
          </div>
        </div>
        ${e.type === "precipitation" && i.parts ? this._renderParts(i) : u}
        ${a ? this._renderForecast(a.points, a.type, i.forecast_count ?? 8) : u}
      </div>
    `;
  }
  /* ---- forecast strip ------------------------------------------------- */
  _metricForecast(i) {
    const t = i.type ?? "custom";
    if (!oe.includes(t) && !i.forecast) return;
    const e = this._forecastId(i), r = i.forecast_type ?? this._defaultForecastType(t), n = this._forecastFor(e, r);
    return n.length ? { points: n, type: r } : void 0;
  }
  _fcLabel(i, t, e) {
    const r = new Date(i.datetime);
    return isNaN(r.getTime()) ? "" : t === "hourly" ? e ? v(this.hass, "now") : r.toLocaleTimeString(P(this.hass), { hour: "2-digit" }) : e ? v(this.hass, "today") : r.toLocaleDateString(P(this.hass), { weekday: "short" });
  }
  _renderForecast(i, t, e) {
    const r = i.slice(0, e);
    return p`<div class="forecast">
      ${r.map((n, s) => {
      const o = n.is_daytime ?? !0, a = n.precipitation_probability, c = typeof a == "number" && a >= 5 ? p`<span class="fc-pop">${$(this.hass, a, 0)}%</span>` : typeof n.precipitation == "number" && n.precipitation >= 0.2 ? p`<span class="fc-pop">${$(this.hass, n.precipitation, 1)}</span>` : p`<span class="fc-pop empty"></span>`;
      return p`<div class="fc-step">
          <span class="fc-when">${this._fcLabel(n, t, s === 0)}</span>
          <ha-icon class="fc-ico" .icon=${Kt(n.condition, o)}></ha-icon>
          ${c}
          <span class="fc-temp">
            ${typeof n.temperature == "number" ? p`${$(this.hass, n.temperature, 0)}°` : "–"}
            ${t !== "hourly" && typeof n.templow == "number" ? p`<span class="fc-lo">${$(this.hass, n.templow, 0)}°</span>` : u}
          </span>
        </div>`;
    })}
    </div>`;
  }
  /* ---- air quality / index ring -------------------------------------- */
  _breakdown(i) {
    return (i.breakdown ?? []).map((t, e) => {
      const r = typeof t == "string" ? { entity: t } : t, n = this.hass.states[r.entity];
      return {
        ...r,
        state: n,
        value: this._numeric(n),
        name: r.name ?? (n == null ? void 0 : n.attributes.friendly_name) ?? r.entity,
        colorResolved: R(r.color) ?? R(Zt[e % Zt.length])
      };
    }).filter((t) => t.state);
  }
  _renderScore(i, t) {
    const e = i.m, r = i.primaryState, n = this._numeric(r, e.attribute), s = e.max ?? 100, o = (e.goal_type ?? i.preset.goalType) !== "atmost", a = this._breakdown(e), c = a.filter((d) => Number.isFinite(d.value) && d.value > 0), l = c.reduce((d, m) => d + m.value, 0), h = l > 0 ? c.map((d) => ({ color: d.colorResolved, share: d.value / l })) : void 0;
    return p`
      <div
        class="metric score-metric ${(e.tap_action ?? "popup") === "none" ? "noclick" : ""}"
        style="--wc-accent:${i.accent}"
        @click=${() => this._handleTap(e, t, r.entity_id)}
      >
        <div class="head">
          <div class="iconchip"><ha-icon .icon=${i.icon}></ha-icon></div>
          <div class="name">${i.name}</div>
          <div class="time">${L(this.hass, r.last_updated)}</div>
        </div>
        <div class="scorewrap">
          ${di(
      this._cardStyle(),
      i.accent,
      this._scoreColor(n, s, o),
      Math.max(0, Math.min(Number.isFinite(n) ? n / s : 0, 1)),
      h
    )}
          <div class="scoreinner">
            <div class="scorenum">${$(this.hass, n, e.precision ?? 0)}</div>
            <div class="scoremax">${v(this.hass, "of")} ${s}</div>
          </div>
        </div>
        ${a.length ? p`<div class="score-bars">
              ${a.map((d) => {
      const m = Number.isFinite(d.value) ? Math.max(0, Math.min(d.value / s * 100, 100)) : 0;
      return p`<div class="sbar">
                  <span class="sbar-name">${d.name}</span>
                  <div class="sbar-track">
                    <div
                      class="sbar-fill"
                      style="width:${m}%;background:${d.colorResolved}"
                    ></div>
                  </div>
                  <span class="sbar-val">
                    ${Number.isFinite(d.value) ? $(this.hass, d.value, 0) : "–"}
                  </span>
                </div>`;
    })}
            </div>` : u}
        <div class="score-status">${this._renderStatus(e, i)}</div>
      </div>
    `;
  }
  /* ---- sun / daylight arc -------------------------------------------- */
  _sunTimes(i) {
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
    let e = t((o = this.hass.states[i.sunrise_entity ?? ""]) == null ? void 0 : o.state), r = t((a = this.hass.states[i.sunset_entity ?? ""]) == null ? void 0 : a.state);
    const n = this.hass.states[i.sun_entity ?? "sun.sun"], s = n ? n.state === "above_horizon" : !0;
    if (n && (!e || !r)) {
      const c = t(n.attributes.next_rising), l = t(n.attributes.next_setting);
      s ? (r = r ?? l, e = e ?? (c ? new Date(c.getTime() - 864e5) : void 0)) : (e = e ?? c, r = r ?? l);
    }
    return { sunrise: e, sunset: r, up: s };
  }
  _renderSun(i, t) {
    const e = i.m, { sunrise: r, sunset: n, up: s } = this._sunTimes(e);
    let o = 0.5;
    r && n && n > r && (o = (Date.now() - r.getTime()) / (n.getTime() - r.getTime()));
    const a = r && n && n > r ? n.getTime() - r.getTime() : NaN, c = s ? n && n > /* @__PURE__ */ new Date() ? v(this.hass, "sunset_in").replace("{n}", te(n)) : "" : r && r > /* @__PURE__ */ new Date() ? v(this.hass, "sunrise_in").replace("{n}", te(r)) : "", l = e.entity ?? e.sun_entity ?? "sun.sun";
    return p`
      <div
        class="metric sun-metric ${(e.tap_action ?? "more-info") === "none" ? "noclick" : ""}"
        style="--wc-accent:${i.accent}"
        @click=${() => this._handleTap({ tap_action: "more-info", ...e }, t, l)}
      >
        <div class="head">
          <div class="iconchip"><ha-icon .icon=${i.icon}></ha-icon></div>
          <div class="name">${i.name}</div>
        </div>
        <div class="sunwrap">${hi(o, !s, i.accent)}</div>
        <div class="sun-times">
          <div class="sun-end">
            <ha-icon icon="mdi:weather-sunset-up"></ha-icon>
            <span>${r ? dt(this.hass, r.toISOString()) : "–"}</span>
          </div>
          ${Number.isFinite(a) ? p`<div class="sun-daylen">
                ${Q(a / 6e4, "min")}
              </div>` : u}
          <div class="sun-end">
            <span>${n ? dt(this.hass, n.toISOString()) : "–"}</span>
            <ha-icon icon="mdi:weather-sunset-down"></ha-icon>
          </div>
        </div>
        ${c ? p`<div class="sun-note">${c}</div>` : u}
      </div>
    `;
  }
  _renderMoon(i, t) {
    const e = i.m, r = i.primaryState, n = r == null ? void 0 : r.state, s = n ? C.MOON_MAP[n] : void 0;
    let o = s ? s[0] : NaN;
    const a = s ? s[1] : !0, c = e.illumination_entity ? this._numeric(this.hass.states[e.illumination_entity]) : s ? NaN : this._numeric(r);
    Number.isFinite(c) && (o = c > 1 ? c / 100 : c), Number.isFinite(o) || (o = 0);
    const l = s ? v(this.hass, `moon_${n}`) : n ?? "", h = e.entity ?? e.moon_entity ?? e.illumination_entity;
    return p`
      <div
        class="metric moon-metric ${(e.tap_action ?? "more-info") === "none" ? "noclick" : ""}"
        style="--wc-accent:${i.accent}"
        @click=${() => this._handleTap({ tap_action: "more-info", ...e }, t, h)}
      >
        <div class="head">
          <div class="iconchip"><ha-icon .icon=${i.icon}></ha-icon></div>
          <div class="name">${i.name}</div>
          ${r ? p`<div class="time">${L(this.hass, r.last_updated)}</div>` : u}
        </div>
        <div class="moonwrap">${pi(o, a)}</div>
        <div class="moon-phase" style="color:${i.accent}">${l}</div>
        <div class="moon-note">${v(this.hass, "illumination")}: ${$(this.hass, o * 100, 0)}%</div>
      </div>
    `;
  }
  /* ---- tides ---------------------------------------------------------- */
  _parseTime(i) {
    if (!i) return;
    const t = new Date(i);
    if (!isNaN(t.getTime())) return t;
    const e = /^(\d{1,2}):(\d{2})/.exec(i);
    if (e) {
      const r = /* @__PURE__ */ new Date();
      return r.setHours(+e[1], +e[2], 0, 0), r;
    }
  }
  _renderTides(i, t) {
    var l, h, d, m;
    const e = i.m, r = i.primaryState, n = this._numeric(r, e.attribute), s = r ? St(this._bucketsFor(r.entity_id, "hour", 24, i.aggregate)) : [], o = this._parseTime((l = this.hass.states[e.high_tide_entity ?? ""]) == null ? void 0 : l.state) ?? this._parseTime((h = r == null ? void 0 : r.attributes) == null ? void 0 : h.next_high_tide), a = this._parseTime((d = this.hass.states[e.low_tide_entity ?? ""]) == null ? void 0 : d.state) ?? this._parseTime((m = r == null ? void 0 : r.attributes) == null ? void 0 : m.next_low_tide), c = e.entity ?? e.high_tide_entity;
    return p`
      <div
        class="metric tides-metric ${(e.tap_action ?? "popup") === "none" ? "noclick" : ""}"
        style="--wc-accent:${i.accent}"
        @click=${() => this._handleTap(e, t, c)}
      >
        <div class="head">
          <div class="iconchip"><ha-icon .icon=${i.icon}></ha-icon></div>
          <div class="name">${i.name}</div>
          ${r ? p`<div class="time">${L(this.hass, r.last_updated)}</div>` : u}
        </div>
        ${Number.isFinite(n) ? p`<div class="value">
              ${$(this.hass, n, i.precision)}<span class="unit">${i.unit}</span>
            </div>` : u}
        <div class="tidewrap">${ui(s, i.accent)}</div>
        ${o || a ? p`<div class="tide-times">
              ${o ? p`<div class="tide-end">
                    <ha-icon icon="mdi:arrow-up-bold"></ha-icon>
                    <span>${v(this.hass, "high_tide")} ${dt(this.hass, o.toISOString())}</span>
                  </div>` : u}
              ${a ? p`<div class="tide-end">
                    <ha-icon icon="mdi:arrow-down-bold"></ha-icon>
                    <span>${v(this.hass, "low_tide")} ${dt(this.hass, a.toISOString())}</span>
                  </div>` : u}
            </div>` : u}
      </div>
    `;
  }
  /* ---- pollen --------------------------------------------------------- */
  _pollenValue(i, t = 5) {
    if (!i) return NaN;
    const e = this._numeric(i);
    if (Number.isFinite(e)) return e;
    const r = i.state.toLowerCase().replace(/[\s_-]/g, ""), n = {
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
    return r in n ? n[r] / 5 * t : NaN;
  }
  _pollenColor(i, t) {
    const e = Number.isFinite(i) ? i / t : 0;
    return e <= 0.05 ? "var(--grey-color, #9E9E9E)" : e < 0.4 ? "var(--green-color, #4CAF50)" : e < 0.7 ? "var(--amber-color, #FFC107)" : "var(--red-color, #F44336)";
  }
  _renderPollen(i, t) {
    const e = i.m, r = e.max ?? 5, n = i.series.map((s) => {
      const o = this.hass.states[s.entity], a = this._pollenValue(o, r), c = Number.isFinite(a) ? Math.max(0, Math.min(Math.round(a / r * 5), 5)) : 0;
      return {
        name: s.name ?? (o == null ? void 0 : o.attributes.friendly_name) ?? s.entity,
        value: a,
        color: R(s.color) ?? this._pollenColor(a, r),
        level: v(this.hass, `pollen_lvl_${c}`)
      };
    });
    return p`
      <div
        class="metric pollen-metric ${(e.tap_action ?? "popup") === "none" ? "noclick" : ""}"
        style="--wc-accent:${i.accent}"
        @click=${() => this._handleTap(e, t, i.series[0].entity)}
      >
        <div class="head">
          <div class="iconchip"><ha-icon .icon=${i.icon}></ha-icon></div>
          <div class="name">${i.name}</div>
          ${this._renderScoreBadge(e)}
        </div>
        <div class="pbars">
          ${n.map(
      (s) => p`<div class="pbar">
              <div class="pbar-label">
                <span>${s.name}</span>
                <span style="color:${s.color};font-weight:700">${s.level}</span>
              </div>
              <div class="ptrack" style="--wc-p:${s.color}">
                <div
                  class="pfill"
                  style="width:${Number.isFinite(s.value) ? Math.max(0, Math.min(s.value / r * 100, 100)) : 0}%"
                ></div>
              </div>
            </div>`
    )}
        </div>
      </div>
    `;
  }
  /* ---- radar ---------------------------------------------------------- */
  _renderRadar(i, t) {
    const e = i.m, r = i.primaryState;
    let n = e.image_url;
    !n && r && (n = r.attributes.entity_picture);
    const s = e.entity;
    return p`
      <div
        class="metric radar-metric ${(e.tap_action ?? (e.entity ? "more-info" : "none")) === "none" ? "noclick" : ""}"
        style="--wc-accent:${i.accent}"
        @click=${() => s && this._handleTap({ tap_action: "more-info", ...e }, t, s)}
      >
        <div class="head">
          <div class="iconchip"><ha-icon .icon=${i.icon}></ha-icon></div>
          <div class="name">${i.name}</div>
          ${r ? p`<div class="time">${L(this.hass, r.last_updated)}</div>` : u}
        </div>
        ${n ? p`<div class="radarframe">
              <img class="radar-img" src=${n} alt="" />
            </div>` : p`<div class="missing">${v(this.hass, "no_data")}</div>`}
      </div>
    `;
  }
  /* ---- sky hero scene ------------------------------------------------- */
  _weatherAttr(i, t) {
    var n;
    if (!i) return NaN;
    const e = this.hass.states[i], r = (n = e == null ? void 0 : e.attributes) == null ? void 0 : n[t];
    return typeof r == "number" ? r : parseFloat(r);
  }
  _renderSky(i, t) {
    var A, N, M;
    const e = i.m, r = i.primaryState, n = r.entity_id.startsWith("weather."), s = (e.condition_entity ? (A = this.hass.states[e.condition_entity]) == null ? void 0 : A.state : void 0) ?? (n ? r.state : void 0), o = this.hass.states[e.sun_entity ?? "sun.sun"], a = e.night === !0 ? !1 : o ? o.state === "above_horizon" : !0, c = e.wind_entity ?? (n ? r.entity_id : void 0), l = e.wind_entity ? this._numeric(this.hass.states[e.wind_entity]) : this._weatherAttr(c, "wind_speed"), h = Number.isFinite(l) ? Math.min(l / 60, 1) : 0.15, d = e.score_entity ? this._numeric(this.hass.states[e.score_entity]) : NaN, m = Number.isFinite(d) ? Math.min(0.2 + d / 100 * 0.7, 1) : 0, f = Number.isFinite(d) ? this._scoreColor(d, 100, !1) : "transparent", y = n ? this._weatherAttr(r.entity_id, "temperature") : this._numeric(r), S = n ? ((M = (N = this.hass.states[r.entity_id]) == null ? void 0 : N.attributes) == null ? void 0 : M.temperature_unit) ?? "°" : r.attributes.unit_of_measurement ?? "°", g = this._forecastFor(this._forecastId(e), "daily")[0], b = g == null ? void 0 : g.temperature, _ = g == null ? void 0 : g.templow, x = (e.anchors ?? []).filter((F) => this.hass.states[F.entity]);
    return p`
      <div
        class="metric sky-metric ${(e.tap_action ?? "popup") === "none" ? "noclick" : ""}"
        style="--wc-accent:${i.accent}"
        @click=${() => this._handleTap(e, t, r.entity_id)}
      >
        <div class="head">
          <div class="iconchip"><ha-icon .icon=${Kt(s, a)}></ha-icon></div>
          <div class="name">${i.name}</div>
          ${this._renderScoreBadge(e)}
          <div class="time">${L(this.hass, r.last_updated)}</div>
        </div>
        <div class="skywrap" style="--wc-oy:${e.scene_offset_y ?? 0}%">
          ${Ke({ condition: s, isDay: a, wind: h, glow: m, glowColor: f })}
          <div class="sky-overlay">
            <div class="sky-temp">
              ${Number.isFinite(y) ? p`${$(this.hass, y, i.precision)}<span class="sky-unit">${S}</span>` : u}
            </div>
            <div class="sky-cond">${kt(this.hass, s) || (s ?? "")}</div>
            ${Number.isFinite(b) || Number.isFinite(_) ? p`<div class="sky-hilo">
                  ${Number.isFinite(b) ? p`<span><ha-icon icon="mdi:arrow-up-thin"></ha-icon>${$(this.hass, b, 0)}°</span>` : u}
                  ${Number.isFinite(_) ? p`<span><ha-icon icon="mdi:arrow-down-thin"></ha-icon>${$(this.hass, _, 0)}°</span>` : u}
                </div>` : u}
          </div>
          ${x.map((F, ct) => this._renderAnchor(F, ct, e))}
        </div>
        ${this._renderForecast(
      this._forecastFor(this._forecastId(e), e.forecast_type ?? "daily"),
      e.forecast_type ?? "daily",
      e.forecast_count ?? 7
    )}
      </div>
    `;
  }
  _renderAnchor(i, t, e) {
    const r = C.SKY_ANCHOR_POS[i.position ?? "top-right"], n = this.hass.states[i.entity];
    if (!r || !n) return u;
    let s;
    if (i.dot) s = i.dot;
    else {
      let m = r.dir;
      i.flip && (m = m === "right" ? "left" : m === "left" ? "right" : m), s = m;
    }
    const o = i.x ?? r.x, a = i.y ?? r.y, c = R(i.color) ?? R(lt[t % lt.length]), l = this._numeric(n);
    let h;
    if (i.entity2) {
      const m = this._numeric(this.hass.states[i.entity2]);
      h = `${$(this.hass, l, 0)}/${$(this.hass, m, 0)}`;
    } else
      h = Number.isFinite(l) ? k($(this.hass, l), n.attributes.unit_of_measurement ?? "") : n.state;
    const d = e.label_opacity ?? 1;
    return p`<div
      class="anchor dot-${s}"
      style="left:${o}%;top:${a}%;--ac:${c};--wc-label-op:${d}"
    >
      <span class="anchor-dot"></span>
      <div class="anchor-chip">
        <span class="anchor-name">${i.name ?? n.attributes.friendly_name ?? ""}</span>
        <span class="anchor-val">${h}</span>
      </div>
    </div>`;
  }
  /* ---- AI summary ----------------------------------------------------- */
  _summarySnapshot(i) {
    var f, y, S, E, g, b, _, x, A, N;
    const t = this._forecastId(i), e = t ? this.hass.states[t] : void 0, r = this._forecastFor(t, "daily"), n = this._forecastFor(t, "hourly"), s = (M) => this._weatherAttr(t, M), o = (M) => M ? this._numeric(this.hass.states[M]) : NaN, a = i.summary_sources ?? [], c = (M) => a.map((F) => this.hass.states[F]).find((F) => (F == null ? void 0 : F.attributes.device_class) === M), l = (M) => this._numeric(c(M)), h = e != null && e.entity_id.startsWith("weather.") ? e.state : void 0, d = s("wind_bearing"), m = n.slice(0, 12).map((M) => M.precipitation_probability ?? 0);
    return {
      condition: kt(this.hass, h),
      temp: J(s("temperature"), l("temperature")),
      tempUnit: ((f = e == null ? void 0 : e.attributes) == null ? void 0 : f.temperature_unit) ?? "°C",
      hi: (y = r[0]) == null ? void 0 : y.temperature,
      lo: (S = r[0]) == null ? void 0 : S.templow,
      feels: J(s("apparent_temperature"), o((E = i.summary_sources) == null ? void 0 : E[0])),
      windSpeed: J(s("wind_speed"), l("wind_speed")),
      windUnit: ((g = e == null ? void 0 : e.attributes) == null ? void 0 : g.wind_speed_unit) ?? "km/h",
      windDir: Qt(this.hass, d),
      precipProb: m.length ? Math.max(...m) : (b = r[0]) == null ? void 0 : b.precipitation_probability,
      precipMm: (_ = r[0]) == null ? void 0 : _.precipitation,
      uv: J(s("uv_index"), l("uv_index")),
      humidity: J(s("humidity"), l("humidity")),
      tomorrowCondition: kt(this.hass, (x = r[1]) == null ? void 0 : x.condition),
      tomorrowHi: (A = r[1]) == null ? void 0 : A.temperature,
      tomorrowLo: (N = r[1]) == null ? void 0 : N.templow
    };
  }
  _renderSummary(i, t) {
    var s;
    const e = i.m, r = e.summary_entity ? (s = this.hass.states[e.summary_entity]) == null ? void 0 : s.state : void 0, n = r && r !== "unknown" && r !== "unavailable" ? r : Xe(this.hass, this._summarySnapshot(e));
    return p`
      <div
        class="metric summary-metric ${(e.tap_action ?? "none") === "none" ? "noclick" : ""}"
        style="--wc-accent:${i.accent}"
        @click=${() => e.summary_entity && this._handleTap(e, t, e.summary_entity)}
      >
        <div class="head">
          <div class="iconchip"><ha-icon .icon=${i.icon}></ha-icon></div>
          <div class="name">${i.name}</div>
        </div>
        <div class="summary-text">${n || v(this.hass, "no_data")}</div>
        ${r ? u : p`<div class="summary-note">
              <ha-icon icon="mdi:creation"></ha-icon>
              <span>${v(this.hass, "ai_note")}</span>
            </div>`}
      </div>
    `;
  }
  /* ---- shared value / status / chart rendering ----------------------- */
  _scoreColor(i, t, e = !0) {
    let r = Number.isFinite(i) ? i / t : 0;
    return e || (r = 1 - r), r >= 0.66 ? "var(--success-color, #43a047)" : r >= 0.4 ? "var(--warning-color, #fb8c00)" : "var(--error-color, #e53935)";
  }
  _renderScoreBadge(i) {
    if (!i.score_entity) return u;
    const t = this._numeric(this.hass.states[i.score_entity]);
    return Number.isFinite(t) ? p`<span class="scorebadge" style="background:${this._scoreColor(t, 100, !1)}">
      ${$(this.hass, t, 0)}
    </span>` : u;
  }
  _fmtMetricValue(i, t) {
    var e;
    return i.m.duration ?? i.preset.duration ? Q(t, i.m.unit ?? ((e = i.primaryState) == null ? void 0 : e.attributes.unit_of_measurement)) : k($(this.hass, t, i.precision), i.unit);
  }
  _xMarks(i, t) {
    const e = P(this.hass), r = [];
    if (i === "hour") {
      const a = /* @__PURE__ */ new Date();
      a.setMinutes(0, 0, 0);
      const c = a.getTime() - (t - 1) * 36e5;
      for (let l = 0; l < t; l++) {
        const h = new Date(c + l * 36e5).getHours();
        h % 6 === 0 && r.push({ i: l, label: String(h), line: h === 0 });
      }
      return r;
    }
    if (i === "month") {
      const a = /* @__PURE__ */ new Date();
      for (let c = 0; c < t; c++) {
        const l = new Date(a.getFullYear(), a.getMonth() - (t - 1 - c), 1);
        l.getMonth() === 0 && r.push({ i: c, label: String(l.getFullYear()), line: !0 });
      }
      return r;
    }
    const n = /* @__PURE__ */ new Date();
    if (n.setHours(0, 0, 0, 0), n.setDate(n.getDate() - (t - 1)), t <= 14) {
      for (let a = 0; a < t; a++) {
        const c = new Date(n.getTime() + a * 864e5);
        r.push({ i: a, label: c.toLocaleDateString(e, { weekday: "narrow" }) });
      }
      return r;
    }
    let s = 0, o = 0;
    for (let a = 0; a < t; a++) {
      const c = new Date(n.getTime() + a * 864e5);
      t <= 45 ? c.getDay() === 1 && r.push({
        i: a,
        label: s++ % 2 === 0 ? c.toLocaleDateString(e, { day: "numeric", month: "numeric" }) : void 0,
        line: !0
      }) : c.getDate() === 1 && (r.push({
        i: a,
        label: t <= 120 || o % 2 === 0 ? c.toLocaleDateString(e, { month: "short" }) : void 0,
        line: !0
      }), o++);
    }
    return r;
  }
  _renderEventTimes(i) {
    const t = (this._history[i] ?? []).filter((o) => o.v > 0);
    if (!t.length) return u;
    const e = P(this.hass), r = /* @__PURE__ */ new Date();
    r.setHours(0, 0, 0, 0);
    const n = r.getTime() - 6 * 864e5, s = Array.from({ length: 7 }, (o, a) => {
      const c = n + a * 864e5;
      return {
        date: new Date(c),
        events: t.filter((l) => l.t >= c && l.t < c + 864e5)
      };
    });
    return p`<div class="times">
      <div class="times-title">${v(this.hass, "event_times")}</div>
      ${s.map(
      (o) => p`<div class="times-row">
          <span class="times-day">${o.date.toLocaleDateString(e, { weekday: "short" })}</span>
          <div class="times-track">
            ${o.events.map(
        (a) => p`<span
                class="times-dot"
                style="left:${(a.t - o.date.getTime()) / 864e5 * 100}%"
                title=${new Date(a.t).toLocaleTimeString(e, { hour: "2-digit", minute: "2-digit" })}
              ></span>`
      )}
          </div>
          <span class="times-count">${o.events.length}×</span>
        </div>`
    )}
      <div class="times-hours"><span>0</span><span>6</span><span>12</span><span>18</span><span>24</span></div>
    </div>`;
  }
  _renderDetails(i, t, e, r) {
    var E;
    const n = t.data[0].buckets.filter(Number.isFinite), s = At(t.data[0].filled), o = this._resolveGoal(i.goal), a = t.valueOverride ?? this._numeric(t.primaryState, i.attribute), c = [];
    if (n.length && (c.push(
      { label: v(this.hass, "stat_min"), value: this._fmtMetricValue(t, Math.min(...n)) },
      {
        label: v(this.hass, "stat_avg"),
        value: this._fmtMetricValue(t, n.reduce((g, b) => g + b, 0) / n.length)
      },
      { label: v(this.hass, "stat_max"), value: this._fmtMetricValue(t, Math.max(...n)) }
    ), Number.isFinite(s) && s !== 0 && c.push({
      label: v(this.hass, "stat_trend"),
      value: `${s > 0 ? "+" : ""}${this._fmtMetricValue(t, s)}`
    })), Number.isFinite(o) && Number.isFinite(a)) {
      const g = t.goalType === "atmost" ? a - o : o - a;
      c.push({
        label: v(this.hass, "goal_left"),
        value: g > 0 ? this._fmtMetricValue(t, g) : "✓"
      });
    }
    const l = t.days, h = t.kind === "month" || t.kind === "day" && l > 16, d = t.graph === "bar" || t.graph === "progress" ? "bar" : "line", m = i.duration ?? t.preset.duration, f = (g) => m ? this._fmtMetricValue(t, g) : $(this.hass, g, t.precision), y = {
      w: h ? l * (t.kind === "month" ? 14 : 10) : 340,
      h: h ? 110 : 130,
      dots: t.kind === "day" && l <= 14,
      yFmt: f,
      xMarks: this._xMarks(t.kind, l)
    }, S = d === "bar" ? ne(
      t.data[0].buckets,
      t.data[0].colorResolved,
      Number.isFinite(o) ? o : void 0,
      y
    ) : re(
      t.data.map((g) => ({ values: g.filled, color: g.colorResolved })),
      y
    );
    return p`
      <div class="periods">
        ${ht.map(
      (g) => p`<button
            class="period ${e === g.key ? "active" : ""}"
            @click=${(b) => {
        b.stopPropagation(), r(g.key);
      }}
          >
            ${v(this.hass, `period_${g.key}`)}
          </button>`
    )}
      </div>
      ${t.graph === "progress" ? this._renderChart(i, "progress", t.data, t.unit, t.precision) : u}
      <div class="popup-chart">
        ${h ? p`<div class="chart-scroll"><div style="width:${y.w}px">${S}</div></div>` : S}
      </div>
      ${c.length ? p`<div class="stats">
            ${c.map(
      (g) => p`<div class="stat">
                <div class="stat-label">${g.label}</div>
                <div class="stat-value">${g.value}</div>
              </div>`
    )}
          </div>` : u}
      ${t.type === "wind" ? this._renderWindDetail(i, t) : u}
      ${t.type === "precipitation" && ((E = t.series[0]) != null && E.entity) ? this._renderEventTimes(t.series[0].entity) : u}
      ${t.multi ? this._renderSeriesChips(t.data, t.precision, t.trendMode) : u}
      ${t.type === "precipitation" && i.parts ? this._renderParts(i) : u}
      ${this._renderSecondary(i)}
    `;
  }
  _renderWindDetail(i, t) {
    var s;
    const e = i.entity ? this._weatherAttr(i.entity, "wind_bearing") : NaN, r = Number.isFinite(e) ? e : this._numeric(this.hass.states[((s = i.secondary) == null ? void 0 : s[0]) ?? ""]);
    if (!Number.isFinite(r)) return u;
    const n = this._numeric(t.primaryState);
    return p`<div class="windrose-wrap">
      ${mi(r, n, t.accent)}
      <div class="windrose-label">${Qt(this.hass, r)} · ${k($(this.hass, n, 0), t.unit)}</div>
    </div>`;
  }
  _renderPopup() {
    if (this._popup === null || !this._config) return u;
    const i = this._config.metrics[this._popup];
    if (!i) return u;
    const t = this._ctx(i, this._activeRange());
    if (!t.primaryState) return u;
    const e = t.primaryState, r = this._popupRange ?? (t.days === 7 && t.kind === "day" ? "week" : ""), n = this._metricForecast(i);
    return p`
      <div class="backdrop s-${this._cardStyle()}" @click=${() => this._popup = null}>
        <div
          class="dialog"
          role="dialog"
          aria-modal="true"
          style="--wc-accent:${t.accent}"
          @click=${(s) => s.stopPropagation()}
        >
          <div class="dialog-head">
            <div class="iconchip"><ha-icon .icon=${t.icon}></ha-icon></div>
            <div class="dialog-title">${t.name}</div>
            ${this._renderScoreBadge(i)}
            <button
              class="close"
              aria-label=${v(this.hass, "close")}
              @click=${() => this._popup = null}
            >
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </div>
          <div class="dialog-value">
            ${this._renderValue(i, t)}
            <div class="time">${L(this.hass, e.last_updated)}</div>
          </div>
          ${this._renderStatus(i, t)}
          ${n ? p`<div class="forecast-title">${v(this.hass, "forecast")}</div>
                ${this._renderForecast(n.points, n.type, i.forecast_count ?? 12)}` : u}
          ${this._renderDetails(i, t, r, (s) => {
      this._popupRange = s;
    })}
          <button
            class="openha"
            @click=${() => {
      var s;
      this._popup = null, this._moreInfo((s = t.series[0]) == null ? void 0 : s.entity);
    }}
          >
            <ha-icon icon="mdi:chart-box-outline"></ha-icon>
            ${v(this.hass, "open_ha")}
          </button>
        </div>
      </div>
    `;
  }
  _renderParts(i) {
    const t = {
      morning: "var(--amber-color, #FFC107)",
      noon: "var(--light-blue-color, #03A9F4)",
      evening: "var(--deep-purple-color, #673AB7)",
      night: "var(--indigo-color, #3F51B5)"
    }, e = ["morning", "noon", "evening", "night"].map((n) => {
      var c;
      const s = (c = i.parts) == null ? void 0 : c[n], o = s ? this.hass.states[s] : void 0, a = this._numeric(o);
      if (Number.isFinite(a))
        return { key: n, v: a, unit: o == null ? void 0 : o.attributes.unit_of_measurement, color: t[n] };
    }).filter((n) => !!n);
    if (!e.length) return u;
    const r = e.reduce((n, s) => n + s.v, 0) || 1;
    return p`
      <div class="segbar">
        ${e.map(
      (n) => p`<div class="seg" style="flex-grow:${Math.max(n.v, r * 0.02)};background:${n.color}"></div>`
    )}
      </div>
      <div class="phases">
        ${e.map(
      (n) => p`<div class="phase">
            <span class="phasedot" style="background:${n.color}"></span>
            <span>${v(this.hass, `part_${n.key}`)}</span>
            <span class="phaseval">${k($(this.hass, n.v, 1), n.unit ?? "mm")}</span>
          </div>`
    )}
      </div>
    `;
  }
  _renderValue(i, t) {
    const { type: e, data: r, primaryState: n, unit: s, precision: o } = t;
    if (i.label) return p`<div class="value">${i.label}</div>`;
    if (e === "wind" && r.length >= 2) {
      const c = this._numeric(n, i.attribute), l = this._numeric(this.hass.states[r[1].entity]);
      return p`<div class="value">
          ${$(this.hass, c, o)}<span class="unit">${s}</span>
        </div>
        <div class="bplabels">
          <span class="bpitem">
            <span class="bpdot" style="background:${r[0].colorResolved}"></span>WIND
            ${$(this.hass, c, 0)}
          </span>
          <span class="bpitem">
            <span class="bpdot" style="background:${r[1].colorResolved}"></span>BÖ
            ${$(this.hass, l, 0)}
          </span>
        </div>`;
    }
    const a = t.valueOverride ?? this._numeric(n, i.attribute);
    return Number.isFinite(a) ? i.duration ?? t.preset.duration ? p`<div class="value">
        ${Q(a, i.unit ?? n.attributes.unit_of_measurement)}
      </div>` : p`<div class="value">
      ${$(this.hass, a, o)}<span class="unit">${s}</span>
    </div>` : p`<div class="value">${n.state}</div>`;
  }
  _renderSeriesChips(i, t, e) {
    return p`<div class="serieslist">
      ${i.map((r) => {
      const n = this.hass.states[r.entity], s = this._numeric(n), o = r.unit ?? (n == null ? void 0 : n.attributes.unit_of_measurement) ?? "", a = r.name ?? (n == null ? void 0 : n.attributes.friendly_name) ?? r.entity, c = At(r.filled), l = Number.isFinite(c) ? c > 0 ? "mdi:arrow-top-right" : c < 0 ? "mdi:arrow-bottom-right" : "mdi:arrow-right" : "mdi:minus";
      return p`<div class="serieschip">
          ${e !== "none" ? p`<span class="dotarrow" style="background:${r.colorResolved}">
                <ha-icon .icon=${l}></ha-icon>
              </span>` : u}
          <span class="serieslabel">
            ${a}: ${Number.isFinite(s) ? k($(this.hass, s, t), o) : (n == null ? void 0 : n.state) ?? "–"}
          </span>
        </div>`;
    })}
    </div>`;
  }
  _renderSecondary(i) {
    var e;
    if (!((e = i.secondary) != null && e.length)) return u;
    const t = i.secondary.map((r) => {
      const n = this.hass.states[r];
      if (!n) return;
      const s = this._numeric(n), o = n.attributes.unit_of_measurement ?? "";
      return Number.isFinite(s) ? k($(this.hass, s), o) : n.state;
    }).filter(Boolean);
    return t.length ? p`<div class="secondary">${t.join(" • ")}</div>` : u;
  }
  _renderStatus(i, t) {
    const { primaryState: e, unit: r, precision: n, trendMode: s, goalType: o, data: a, valueOverride: c } = t, l = a[0], h = c ?? this._numeric(e, i.attribute), d = this._resolveGoal(i.goal);
    if (Number.isFinite(d) && Number.isFinite(h)) {
      const _ = this._resolveGoal(i.start);
      let x = NaN;
      if (Number.isFinite(_) && _ !== d ? x = (_ - h) / (_ - d) * 100 : d > 0 && (x = o === "atmost" ? d / h * 100 : h / d * 100), !Number.isNaN(x)) {
        const A = Math.round(Math.min(Math.max(x, 0), 999)), N = A >= 100;
        return p`<div class="status ${N ? "good" : ""}">
          <ha-icon .icon=${N ? "mdi:check-circle" : "mdi:flag-outline"}></ha-icon>
          <span>${v(this.hass, "goal")}: ${A} %</span>
        </div>`;
      }
    }
    if (s === "none") return u;
    const m = At(l.filled);
    if (!Number.isFinite(m)) return u;
    const f = l.filled.find(Number.isFinite) ?? 0, y = Math.abs(m) < Math.max(Math.abs(f) * 5e-3, 1e-9), S = y || s === "neutral" ? "neutral" : m > 0 == (s === "up_good") ? "good" : "bad", E = y ? "mdi:arrow-right" : m > 0 ? "mdi:arrow-top-right" : "mdi:arrow-bottom-right", g = i.duration ?? t.preset.duration, b = y ? v(this.hass, "stable") : g ? Q(Math.abs(m), r || void 0) : `${$(this.hass, Math.abs(m), n)}${r ? ` ${r}` : ""}`;
    return p`<div class="status ${S}">
      <span class="dotarrow"><ha-icon .icon=${E}></ha-icon></span>
      <span>${b}</span>
    </div>`;
  }
  _renderChart(i, t, e, r, n) {
    if (t === "line") {
      const s = e.map((a) => ({ values: a.filled, color: a.colorResolved })), o = this._metricForecast(i);
      if (o && (i.type === "temperature" || i.type === "feels_like")) {
        const a = ri(o.points.slice(0, 8), "temperature");
        if (a.length) {
          const c = e[0].filled.filter(Number.isFinite).slice(-1)[0], l = new Array(Math.max(e[0].filled.length - 1, 0)).fill(NaN);
          s.push({
            values: [...l, ...Number.isFinite(c) ? [c] : [], ...a],
            color: e[0].colorResolved,
            dashed: !0
          });
        }
      }
      return p`${re(s)}`;
    }
    if (t === "bar") {
      const s = this._resolveGoal(i.goal);
      return p`${ne(
        e[0].buckets,
        e[0].colorResolved,
        Number.isFinite(s) ? s : void 0
      )}`;
    }
    if (t === "progress") {
      const s = e.map((o) => {
        const a = this.hass.states[o.entity], c = this._numeric(a), l = this._resolveGoal(o.goal ?? i.goal) || i.max || (r === "%" ? 100 : NaN);
        if (!Number.isFinite(c) || !Number.isFinite(l) || l <= 0) return u;
        const h = Math.max(0, Math.min(c / l * 100, 100)), d = o.unit ?? (a == null ? void 0 : a.attributes.unit_of_measurement) ?? r;
        return p`<div class="pbar">
          ${e.length > 1 ? p`<div class="pbar-label">
                <span>${o.name ?? (a == null ? void 0 : a.attributes.friendly_name) ?? o.entity}</span>
                <span>${k($(this.hass, c, n), d)}</span>
              </div>` : u}
          <div class="ptrack" style="--wc-p:${o.colorResolved}">
            <div class="pfill" style="width:${h}%"></div>
          </div>
        </div>`;
      });
      return p`<div class="pbars">${s}</div>`;
    }
    return u;
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
C.styles = le`
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

    /* ---- card styles --------------------------------------------------- */
    .s-default {
      --wc-tile-bg: var(
        --secondary-background-color,
        color-mix(in srgb, var(--primary-text-color) 5%, var(--wc-card-bg))
      );
      --wc-dot-fill: var(--secondary-background-color, var(--wc-card-bg));
      --wc-tile-radius: var(--ha-card-border-radius, 12px);
    }
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
O([
  Dt({ attribute: !1 })
], C.prototype, "hass", 2);
O([
  z()
], C.prototype, "_config", 2);
O([
  z()
], C.prototype, "_history", 2);
O([
  z()
], C.prototype, "_popup", 2);
O([
  z()
], C.prototype, "_popupRange", 2);
O([
  z()
], C.prototype, "_tileRanges", 2);
O([
  z()
], C.prototype, "_statsCache", 2);
O([
  z()
], C.prototype, "_forecasts", 2);
C = O([
  ge("weatherglass-card")
], C);
function J(...i) {
  for (const t of i) if (typeof t == "number" && Number.isFinite(t)) return t;
}
console.info(
  `%c WEATHERGLASS %c v${wi} `,
  "color: white; background: #0d6efd; font-weight: 700; border-radius: 4px 0 0 4px; padding: 2px 6px;",
  "color: #0d6efd; background: #e7f0ff; font-weight: 700; border-radius: 0 4px 4px 0; padding: 2px 6px;"
);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "weatherglass-card",
  name: "Weatherglass",
  description: "Withings-style weather dashboard: forecast, temperature, wind, precipitation, humidity, UV, air quality, sun and an AI summary.",
  preview: !0,
  documentationURL: "https://github.com/BobMcGlobus/Weatherglass"
});
export {
  C as WeatherCard
};
