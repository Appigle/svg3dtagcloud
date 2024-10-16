var S = Object.defineProperty;
var C = (f, t, i) => t in f ? S(f, t, { enumerable: !0, configurable: !0, writable: !0, value: i }) : f[t] = i;
var n = (f, t, i) => C(f, typeof t != "symbol" ? t + "" : t, i);
const w = [
  "#23bcfe",
  // Sky Blue
  "#ff6f61",
  // Coral
  "#6a5acd",
  // Slate Blue
  "#3cb371",
  // Medium Sea Green
  "#ffcc00",
  // Golden Yellow
  "#ff1493",
  // Deep Pink
  "#20b2aa",
  // Light Sea Green
  "#ff4500",
  // Orange Red
  "#9370db",
  // Medium Purple
  "#f08080"
  // Light Coral
], M = {
  children: [],
  width: 480,
  height: 480,
  radius: "70%",
  radiusMin: 75,
  isDrawSvgBg: !0,
  svgBgColor: "#000",
  opacityOver: 1,
  opacityOut: 0.05,
  opacitySpeed: 6,
  fov: 800,
  speed: 0.5,
  fontFamily: "Arial, sans-serif",
  fontSize: "12",
  fontColor: "#fff",
  fontWeight: "normal",
  //bold
  fontStyle: "normal",
  //italic
  fontStretch: "normal",
  //wider, narrower, ultra-condensed, extra-condensed, condensed, semi-condensed, semi-expanded, expanded, extra-expanded, ultra-expanded
  fontToUpperCase: !1,
  tooltipFontFamily: "Arial, sans-serif",
  tooltipFontSize: "15",
  tooltipFontColor: "#fff",
  tooltipFontWeight: "normal",
  //bold
  tooltipFontStyle: "normal",
  //italic
  tooltipFontStretch: "normal",
  //wider, narrower, ultra-condensed, extra-condensed, condensed, semi-condensed, semi-expanded, expanded, extra-expanded, ultra-expanded
  tooltipFontToUpperCase: !1,
  tooltipTextAnchor: "left",
  tooltipDiffX: 0,
  tooltipDiffY: 10,
  animatingSpeed: 0.1,
  animatingRadiusLimit: 1.3
};
class p {
  constructor(t, i) {
    n(this, "containerEl");
    n(this, "settings");
    n(this, "childHolder", []);
    n(this, "tooltipEl", null);
    n(this, "radius", 0);
    n(this, "diameter", 0);
    n(this, "mouseReact", !0);
    n(this, "mousePos", { x: 0, y: 0 });
    n(this, "center2D", { x: 0, y: 0 });
    n(this, "center3D", { x: 0, y: 0, z: 0 });
    n(this, "speed", { x: 0, y: 0 });
    n(this, "position", { sx: 0, cx: 0, sy: 0, cy: 0 });
    n(this, "MATHPI180", Math.PI / 180);
    n(this, "svgEl", null);
    n(this, "svgNS", "http://www.w3.org/2000/svg");
    n(this, "svgBg", null);
    n(this, "animFrameId", null);
    n(this, "radius_factor", 1);
    n(this, "animOut_cb", null);
    n(this, "animIn_cb", null);
    n(this, "animating", !1);
    n(this, "onScreenResizeHandler", () => {
      this.setParams();
    });
    n(this, "onMouseMoveHandler", (t) => {
      this.mousePos = this.getMousePos(this.svgEl, t);
    });
    n(this, "mouseOverHandler", (t) => {
      this.mouseReact = !1;
      const i = t.target, o = this.getChildByElement(i);
      o && (this.highlightChild(o), this.showTooltip(o));
    });
    n(this, "mouseOutHandler", (t) => {
      this.mouseReact = !0;
      const i = t.target;
      this.getChildByElement(i) && this.hideTooltip();
    });
    // start to render the tag cloud component
    n(this, "build", () => {
      this.settings.children.length && (this.setSvgElAndSvgBgEl(), this.addChildren(), this.setParams(), this.animationLoopStart(), window.addEventListener("resize", this.onScreenResizeHandler));
    });
    this.containerEl = t, this.settings = { ...M, ...i }, this.bindMethods();
  }
  bindMethods() {
    this.animationLoopStart = this.animationLoopStart.bind(this), this._animIn = this._animIn.bind(this), this._animOut = this._animOut.bind(this);
  }
  setAttributes(t, i) {
    for (const [o, a] of Object.entries(i))
      t.setAttribute(o, a);
  }
  getFontColor(t = 0, i = [], o = "#fff") {
    const a = i.length;
    return a > 0 ? i[t % a] : o;
  }
  getMousePos(t, i) {
    if (!t) return { x: 0, y: 0 };
    const o = t.getBoundingClientRect();
    return { x: i.clientX - o.left, y: i.clientY - o.top };
  }
  setChildPosition(t, i) {
    if (!t.vectorPosition) return;
    const { x: o, y: a, z: h } = t.vectorPosition, r = o - this.center3D.x, l = a - this.center3D.y, c = h - this.center3D.z, s = Math.sqrt(r * r + l * l + c * c);
    Object.assign(t.vectorPosition, {
      x: o / s * i,
      y: a / s * i,
      z: h / s * i
    });
  }
  setChildPositions(t) {
    this.childHolder.forEach((i) => this.setChildPosition(i, t));
  }
  setParams() {
    var m, u;
    const { innerWidth: t, innerHeight: i } = window, { documentElement: o, body: a } = document, {
      width: h,
      height: r,
      radius: l = "65%",
      speed: c = 0,
      radiusMin: s = 1,
      isDrawSvgBg: g
    } = this.settings;
    let e = t || o.clientWidth || a.clientWidth, d = i || o.clientHeight || a.clientHeight;
    typeof h == "string" && h.includes("%") ? (e = Math.round(
      this.containerEl.offsetWidth / 100 * parseInt(h)
    ), d = Math.round(e / 100 * parseInt(r))) : (e = h, d = r), e = Math.min(e, t || 0), d = Math.min(d, i || 0), this.center2D = { x: e / 2, y: d / 2 }, this.speed = { x: c / this.center2D.x, y: c / this.center2D.y }, this.diameter = Math.min(d, e) * (parseInt(`${l}`) / 100), this.diameter = Math.max(this.diameter, 1), this.radius = Math.max(this.diameter / 2, s), this.diameter = this.radius * 2, (m = this.svgEl) == null || m.setAttribute("width", `${e}`), (u = this.svgEl) == null || u.setAttribute("height", `${d}`), g && this.svgBg && (this.svgBg.setAttribute("width", `${e}`), this.svgBg.setAttribute("height", `${d}`)), this.setChildPositions(this.radius * this.radius_factor);
  }
  addChild(t, i, o, a, h) {
    var g;
    const { settings: r, svgNS: l } = this, c = this.getFontColor(t, w, r.fontColor), s = {
      index: t,
      mouseOver: !1,
      fontColor: c,
      vectorPosition: { x: o, y: a, z: h },
      vector2D: { x: 0, y: 0 },
      ...i
    };
    if (i.label) {
      const e = {
        x: "0",
        y: "0",
        fill: s.fontColor,
        "font-family": s.fontFamily || r.fontFamily,
        "font-size": `${i.fontSize || r.fontSize}`,
        "font-weight": s.fontWeight || r.fontWeight,
        "font-style": s.fontStyle || r.fontStyle,
        "font-stretch": s.fontStretch || r.fontStretch,
        "text-anchor": "middle"
      };
      s.element = document.createElementNS(l, "text"), this.setAttributes(s.element, e), s.element.textContent = r.fontToUpperCase ? i.label.toUpperCase() : i.label;
    } else if (i.image)
      s.element = document.createElementNS(l, "image"), s.element.setAttributeNS(
        "http://www.w3.org/1999/xlink",
        "href",
        i.image
      ), this.setAttributes(s.element, {
        x: "0",
        y: "0",
        width: `${i.width || "0"}`,
        height: `${i.height || "0"}`
      }), s.diffX = i.width / 2, s.diffY = i.height / 2;
    else
      return;
    s.link = document.createElementNS(l, "a"), this.setAttributes(s.link, {
      href: i.url || "",
      target: i.target || ""
    }), s.link.appendChild(s.element), s.link.addEventListener(
      "mouseover",
      this.mouseOverHandler,
      !0
    ), s.link.addEventListener(
      "mouseout",
      this.mouseOutHandler,
      !0
    ), i.tooltip ? (s.tooltipLabel = r.tooltipFontToUpperCase ? i.tooltip.toUpperCase() : i.tooltip, s.tooltip = s.tooltipLabel) : s.tooltip = "", (g = this.svgEl) == null || g.appendChild(s.link), this.childHolder.push(s);
  }
  addTooltip() {
    var c;
    const {
      tooltipFontColor: t,
      tooltipFontFamily: i,
      tooltipFontSize: o,
      tooltipFontWeight: a,
      tooltipFontStyle: h,
      tooltipFontStretch: r,
      tooltipTextAnchor: l
    } = this.settings;
    this.tooltipEl = document.createElementNS(this.svgNS, "text"), this.setAttributes(this.tooltipEl, {
      x: "0",
      y: "0",
      fill: `${t}`,
      "font-family": `${i}`,
      "font-size": `${o}`,
      "font-weight": `${a}`,
      "font-style": `${h}`,
      "font-stretch": `${r}`,
      "text-anchor": `${l}`
    }), (c = this.svgEl) == null || c.appendChild(this.tooltipEl);
  }
  showTooltip(t) {
    if (t.tooltip && this.tooltipEl && t.vector2D) {
      const { tooltipDiffX: i, tooltipDiffY: o, tooltipFontToUpperCase: a } = this.settings;
      this.setAttributes(this.tooltipEl, {
        x: `${t.vector2D.x - (i || 0)}`,
        y: `${t.vector2D.y - (o || 0)}`,
        opacity: "1.0"
      }), this.tooltipEl.textContent = a ? (t.tooltipLabel || "").toUpperCase() : t.tooltipLabel || "";
    }
  }
  hideTooltip() {
    var t;
    (t = this.tooltipEl) == null || t.setAttribute("opacity", "0.0");
  }
  addChildren() {
    let t = !1;
    this.settings.children.forEach((i, o) => {
      const a = this.settings.children.length + 1, h = Math.acos(-1 + 2 * (o + 1) / a), r = Math.sqrt(a * Math.PI) * h, l = Math.cos(r) * Math.sin(h), c = Math.sin(r) * Math.sin(h), s = Math.cos(h);
      this.addChild(o, i, l, c, s), i.tooltip && (t = !0);
    }), t && this.addTooltip();
  }
  highlightChild(t) {
    this.childHolder.forEach((i) => i.mouseOver = i.index === t.index);
  }
  getChildByElement(t) {
    return this.childHolder.find(
      (i) => {
        var o;
        return (o = i.element) == null ? void 0 : o.isEqualNode(t);
      }
    );
  }
  render() {
    const {
      speed: t = 0,
      opacityOut: i = 0.1,
      opacityOver: o = 1,
      opacitySpeed: a = 5,
      fov: h = 0,
      animatingRadiusLimit: r = 1.3
    } = this.settings, l = this.speed.x * this.mousePos.x - t, c = t - this.speed.y * this.mousePos.y, s = l * this.MATHPI180, g = c * this.MATHPI180;
    this.position = {
      sx: Math.sin(s),
      cx: Math.cos(s),
      sy: Math.sin(g),
      cy: Math.cos(g)
    }, this.childHolder.forEach((e) => {
      if (!e.element || !e.vectorPosition || !e.vector2D) return;
      if (this.mouseReact) {
        const { x: v, y, z: x } = e.vectorPosition, E = y * this.position.sy + x * this.position.cy;
        e.vectorPosition.x = v * this.position.cx + E * this.position.sx, e.vectorPosition.y = y * this.position.cy + x * -this.position.sy, e.vectorPosition.z = v * -this.position.sx + E * this.position.cx;
      }
      const d = h / (h + e.vectorPosition.z);
      e.vector2D.x = e.vectorPosition.x * d + this.center2D.x, e.vector2D.y = e.vectorPosition.y * d + this.center2D.y, e.diffX && e.diffY && (e.vector2D.x -= e.diffX, e.vector2D.y -= e.diffY), e.element.setAttribute("x", `${e.vector2D.x}`), e.element.setAttribute("y", `${e.vector2D.y}`);
      let m = this.mouseReact ? (this.radius - e.vectorPosition.z) / this.diameter : parseFloat(e.element.getAttribute("opacity") || "1");
      m = this.mouseReact ? Math.max(m, i) : e.mouseOver ? m + (o - m) / a : m + (i - m) / a;
      const u = 1 - (this.radius_factor - 1) / (r - 1);
      e.element.setAttribute("opacity", `${m * u}`);
    }), this.childHolder.sort((e, d) => d.vectorPosition.z - e.vectorPosition.z);
  }
  animationLoopStart() {
    this.animFrameId = window.requestAnimationFrame(() => {
      this.render(), this.animationLoopStart();
    });
  }
  _animIn() {
    (this.animating = this.radius_factor > 1) ? (this.setRadiusFactor(
      this.radius_factor - (this.settings.animatingSpeed || 0.1)
    ), window.requestAnimationFrame(this._animIn)) : this.animIn_cb && (this.animIn_cb(), this.animIn_cb = null);
  }
  _animOut() {
    (this.animating = this.radius_factor < (this.settings.animatingRadiusLimit || 1.3)) ? (this.setRadiusFactor(
      this.radius_factor + (this.settings.animatingSpeed || 0.1)
    ), window.requestAnimationFrame(this._animOut)) : this.animOut_cb && (this.animOut_cb(), this.animOut_cb = null);
  }
  setRadiusFactor(t) {
    this.radius_factor = Math.min(
      Math.max(t, 1),
      this.settings.animatingRadiusLimit || 1.3
    ), this.setParams();
  }
  resetRadiusFactor() {
    this.setRadiusFactor(1);
  }
  animOut(t) {
    this.animating || (this.radius_factor = 1, this.animOut_cb = t, this._animOut());
  }
  animIn(t) {
    this.animating || (this.radius_factor = this.settings.animatingRadiusLimit || 1.3, this.animIn_cb = t, this._animIn());
  }
  setChildren(t) {
    this.destroy(), this.settings.children = t, this.build();
  }
  setSvgElAndSvgBgEl() {
    this.svgEl = document.createElementNS(this.svgNS, "svg"), this.svgEl.addEventListener("mousemove", this.onMouseMoveHandler), this.containerEl.appendChild(this.svgEl), this.settings.isDrawSvgBg && (this.svgBg = document.createElementNS(
      this.svgNS,
      "rect"
    ), this.setAttributes(this.svgBg, {
      x: "0",
      y: "0",
      fill: `${this.settings.svgBgColor}`
    }), this.svgEl.appendChild(this.svgBg));
  }
  // destroy the element when component is removed;
  destroy() {
    var t;
    this.animFrameId && window.cancelAnimationFrame(this.animFrameId), window.removeEventListener("resize", this.onScreenResizeHandler), this.svgBg && ((t = this.svgEl) == null || t.removeChild(this.svgBg)), this.svgEl && (this.containerEl.removeChild(this.svgEl), this.svgEl.removeEventListener("mousemove", this.onMouseMoveHandler), this.svgEl = null);
  }
  static __VERSION() {
    console.log(
      "%c [ __VERSION ]-573",
      "font-size:13px; background:pink; color:#bf2c9f;",
      "0.0.15_10/16/2024, 12:00:28 AM"
    );
  }
}
window && (window.SVG3DTagCloud = p, window.SVG3dTagCloud = p, window.Svg3dTagCloud = p);
export {
  p as default
};
