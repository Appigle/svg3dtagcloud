/*
    Copyright (c) 2017 Niklas Knaack
    github: https://github.com/NiklasKnaack/jquery-svg3dtagcloud-plugin

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.
    */

/**
 * @modified by: Ray Chen
 * @date: 2024-10-24
 */
const colors = [
  '#23bcfe', // Sky Blue
  '#ff6f61', // Coral
  '#6a5acd', // Slate Blue
  '#3cb371', // Medium Sea Green
  '#ffcc00', // Golden Yellow
  '#ff1493', // Deep Pink
  '#20b2aa', // Light Sea Green
  '#ff4500', // Orange Red
  '#9370db', // Medium Purple
  '#f08080', // Light Coral
];

export type FontStretch =
  | 'normal'
  | 'wider'
  | 'narrower'
  | 'ultra-condensed'
  | 'extra-condensed'
  | 'condensed'
  | 'semi-condensed'
  | 'semi-expanded'
  | 'expanded'
  | 'extra-expanded'
  | 'ultra-expanded';

// default options of the tag cloud component
const defaultOptions: SVG3DTagCloudProps = {
  children: [],
  width: 480,
  height: 480,
  radius: '70%',
  radiusMin: 75,
  isDrawSvgBg: true,
  svgBgColor: '#000',
  opacityOver: 1.0,
  opacityOut: 0.05,
  opacitySpeed: 6,
  fov: 800,
  speed: 0.5,
  fontFamily: 'Arial, sans-serif',
  fontSize: '12',
  fontColor: '#fff',
  fontWeight: 'normal', //bold
  fontStyle: 'normal', //italic
  fontStretch: 'normal', //wider, narrower, ultra-condensed, extra-condensed, condensed, semi-condensed, semi-expanded, expanded, extra-expanded, ultra-expanded
  fontToUpperCase: false,
  tooltipFontFamily: 'Arial, sans-serif',
  tooltipFontSize: '15',
  tooltipFontColor: '#fff',
  tooltipFontWeight: 'normal', //bold
  tooltipFontStyle: 'normal', //italic
  tooltipFontStretch: 'normal', //wider, narrower, ultra-condensed, extra-condensed, condensed, semi-condensed, semi-expanded, expanded, extra-expanded, ultra-expanded
  tooltipFontToUpperCase: false,
  tooltipTextAnchor: 'left',
  tooltipDiffX: 0,
  tooltipDiffY: 10,
  animatingSpeed: 0.1,
  animatingRadiusLimit: 1.3,
};

class SVG3DTagCloud {
  containerEl: HTMLElement;
  settings: SVG3DTagCloudState;
  childHolder: SVG3DTagCloudChild[] = [];
  tooltipEl: SVGTextElement | Element | null = null;
  radius: number = 0;
  diameter: number = 0;
  mouseReact = true;
  mousePos = { x: 0, y: 0 };
  center2D = { x: 0, y: 0 };
  center3D = { x: 0, y: 0, z: 0 };
  speed = { x: 0, y: 0 };
  position = { sx: 0, cx: 0, sy: 0, cy: 0 };
  MATHPI180 = Math.PI / 180;
  svgEl: SVGSVGElement | null = null;
  svgNS = 'http://www.w3.org/2000/svg';
  svgBg: SVGRectElement | null = null;
  animFrameId: number | null = null;
  radius_factor = 1;
  animOut_cb: (() => void) | null = null;
  animIn_cb: (() => void) | null = null;
  animating = false;

  constructor(container: HTMLElement, options?: SVG3DTagCloudProps) {
    this.containerEl = container;
    this.settings = { ...defaultOptions, ...options } as SVG3DTagCloudState;
    this.bindMethods();
  }

  private bindMethods() {
    this.animationLoopStart = this.animationLoopStart.bind(this);
    this._animIn = this._animIn.bind(this);
    this._animOut = this._animOut.bind(this);
  }

  private setAttributes(element: Element, attributes: Record<string, string>) {
    for (const [key, value] of Object.entries(attributes)) {
      element.setAttribute(key, value);
    }
  }

  private getFontColor(
    index: number = 0,
    colorsArr: string[] = [],
    defaultColor: string = '#fff'
  ): string {
    const len = colorsArr.length;
    return len > 0 ? colorsArr[index % len] : defaultColor;
  }

  private getMousePos(svgEl: Element | null, event: MouseEvent) {
    if (!svgEl) return { x: 0, y: 0 };
    const rect = svgEl.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  private setChildPosition(child: SVG3DTagCloudChild, _radius: number) {
    if (!child.vectorPosition) return;
    const { x, y, z } = child.vectorPosition;
    const dx = x - this.center3D.x;
    const dy = y - this.center3D.y;
    const dz = z - this.center3D.z;
    const length = Math.sqrt(dx * dx + dy * dy + dz * dz);

    Object.assign(child.vectorPosition, {
      x: (x / length) * _radius,
      y: (y / length) * _radius,
      z: (z / length) * _radius,
    });
  }

  private setChildPositions(radius: number) {
    this.childHolder.forEach((child) => this.setChildPosition(child, radius));
  }

  private setParams() {
    const { innerWidth, innerHeight } = window;
    const { documentElement, body } = document;
    const {
      width,
      height,
      radius = '65%',
      speed = 0,
      radiusMin = 1,
      isDrawSvgBg,
    } = this.settings;

    let svgWidth =
      innerWidth || documentElement.clientWidth || body.clientWidth;
    let svgHeight =
      innerHeight || documentElement.clientHeight || body.clientHeight;

    if (typeof width === 'string' && width.includes('%')) {
      svgWidth = Math.round(
        (this.containerEl.offsetWidth / 100) * parseInt(width)
      );
      svgHeight = Math.round((svgWidth / 100) * parseInt(height as string));
    } else {
      svgWidth = width as number;
      svgHeight = height as number;
    }

    svgWidth = Math.min(svgWidth, innerWidth || 0);
    svgHeight = Math.min(svgHeight, innerHeight || 0);

    this.center2D = { x: svgWidth / 2, y: svgHeight / 2 };
    this.speed = { x: speed / this.center2D.x, y: speed / this.center2D.y };

    this.diameter =
      Math.min(svgHeight, svgWidth) * (parseInt(`${radius}`) / 100);
    this.diameter = Math.max(this.diameter, 1);
    this.radius = Math.max(this.diameter / 2, radiusMin);
    this.diameter = this.radius * 2;

    this.svgEl?.setAttribute('width', `${svgWidth}`);
    this.svgEl?.setAttribute('height', `${svgHeight}`);

    if (isDrawSvgBg && this.svgBg) {
      this.svgBg.setAttribute('width', `${svgWidth}`);
      this.svgBg.setAttribute('height', `${svgHeight}`);
    }

    this.setChildPositions(this.radius * this.radius_factor);
  }

  private onScreenResizeHandler = () => {
    this.setParams();
  };

  private onMouseMoveHandler = (event: MouseEvent) => {
    this.mousePos = this.getMousePos(this.svgEl, event);
  };

  private addChild(
    index: number,
    childObj: SVG3DTagCloudChild,
    x: number,
    y: number,
    z: number
  ) {
    const { settings, svgNS } = this;
    const fontColor = this.getFontColor(index, colors, settings.fontColor);
    const child: SVG3DTagCloudChild = {
      index,
      mouseOver: false,
      fontColor,
      vectorPosition: { x, y, z },
      vector2D: { x: 0, y: 0 },
      ...childObj,
    };

    if (childObj.label) {
      const attributes = {
        x: '0',
        y: '0',
        fill: child.fontColor,
        'font-family': child.fontFamily || settings.fontFamily,
        'font-size': `${childObj.fontSize || settings.fontSize}`,
        'font-weight': child.fontWeight || settings.fontWeight,
        'font-style': child.fontStyle || settings.fontStyle,
        'font-stretch': child.fontStretch || settings.fontStretch,
        'text-anchor': 'middle',
      } as Record<string, string>;
      child.element = document.createElementNS(svgNS, 'text');
      this.setAttributes(child.element, attributes);
      child.element.textContent = settings.fontToUpperCase
        ? childObj.label.toUpperCase()
        : childObj.label;
    } else if (childObj.image) {
      child.element = document.createElementNS(svgNS, 'image');
      child.element.setAttributeNS(
        'http://www.w3.org/1999/xlink',
        'href',
        childObj.image
      );
      this.setAttributes(child.element, {
        x: '0',
        y: '0',
        width: `${childObj.width || '0'}`,
        height: `${childObj.height || '0'}`,
      });
      child.diffX = (childObj.width as number) / 2;
      child.diffY = (childObj.height as number) / 2;
    } else {
      return;
    }

    child.link = document.createElementNS(svgNS, 'a');
    this.setAttributes(child.link, {
      href: childObj.url || '',
      target: childObj.target || '',
    });
    child.link.appendChild(child.element);
    child.link.addEventListener(
      'mouseover',
      this.mouseOverHandler as EventListener,
      true
    );
    child.link.addEventListener(
      'mouseout',
      this.mouseOutHandler as EventListener,
      true
    );

    if (childObj.tooltip) {
      child.tooltipLabel = settings.tooltipFontToUpperCase
        ? childObj.tooltip.toUpperCase()
        : childObj.tooltip;
      child.tooltip = child.tooltipLabel;
    } else {
      child.tooltip = '';
    }

    this.svgEl?.appendChild(child.link);
    this.childHolder.push(child);
  }

  private addTooltip() {
    const {
      tooltipFontColor,
      tooltipFontFamily,
      tooltipFontSize,
      tooltipFontWeight,
      tooltipFontStyle,
      tooltipFontStretch,
      tooltipTextAnchor,
    } = this.settings;
    this.tooltipEl = document.createElementNS(this.svgNS, 'text');
    this.setAttributes(this.tooltipEl, {
      x: '0',
      y: '0',
      fill: `${tooltipFontColor}`,
      'font-family': `${tooltipFontFamily}`,
      'font-size': `${tooltipFontSize}`,
      'font-weight': `${tooltipFontWeight}`,
      'font-style': `${tooltipFontStyle}`,
      'font-stretch': `${tooltipFontStretch}`,
      'text-anchor': `${tooltipTextAnchor}`,
    });
    this.svgEl?.appendChild(this.tooltipEl);
  }

  private showTooltip(child: SVG3DTagCloudChild) {
    if (child.tooltip && this.tooltipEl && child.vector2D) {
      const { tooltipDiffX, tooltipDiffY, tooltipFontToUpperCase } =
        this.settings;
      this.setAttributes(this.tooltipEl, {
        x: `${child.vector2D.x - (tooltipDiffX || 0)}`,
        y: `${child.vector2D.y - (tooltipDiffY || 0)}`,
        opacity: '1.0',
      });
      this.tooltipEl.textContent = tooltipFontToUpperCase
        ? (child.tooltipLabel || '').toUpperCase()
        : child.tooltipLabel || '';
    }
  }

  private hideTooltip() {
    this.tooltipEl?.setAttribute('opacity', '0.0');
  }

  private addChildren() {
    let isShowTooltip = false;
    this.settings.children.forEach((child, index) => {
      const len1 = this.settings.children.length + 1;
      const phi = Math.acos(-1 + (2 * (index + 1)) / len1);
      const theta = Math.sqrt(len1 * Math.PI) * phi;
      const x = Math.cos(theta) * Math.sin(phi);
      const y = Math.sin(theta) * Math.sin(phi);
      const z = Math.cos(phi);
      this.addChild(index, child, x, y, z);
      if (child.tooltip) {
        isShowTooltip = true;
      }
    });

    if (isShowTooltip) {
      this.addTooltip();
    }
  }

  private mouseOverHandler = (event: MouseEvent) => {
    this.mouseReact = false;
    const target = event.target as HTMLElement;
    const child = this.getChildByElement(target);
    if (child) {
      this.highlightChild(child);
      this.showTooltip(child);
    }
  };

  private mouseOutHandler = (event: MouseEvent) => {
    this.mouseReact = true;
    const target = event.target as HTMLElement;
    const child = this.getChildByElement(target);
    if (child) {
      this.hideTooltip();
    }
  };

  private highlightChild(child: SVG3DTagCloudChild) {
    this.childHolder.forEach((e) => (e.mouseOver = e.index === child.index));
  }

  private getChildByElement(
    element: HTMLElement
  ): SVG3DTagCloudChild | undefined {
    return this.childHolder.find((child) =>
      child.element?.isEqualNode(element)
    );
  }

  private render() {
    const {
      speed = 0,
      opacityOut = 0.1,
      opacityOver = 1,
      opacitySpeed = 5,
      fov = 0,
      animatingRadiusLimit = 1.3,
    } = this.settings;
    const fx = this.speed.x * this.mousePos.x - speed;
    const fy = speed - this.speed.y * this.mousePos.y;

    const angleX = fx * this.MATHPI180;
    const angleY = fy * this.MATHPI180;

    this.position = {
      sx: Math.sin(angleX),
      cx: Math.cos(angleX),
      sy: Math.sin(angleY),
      cy: Math.cos(angleY),
    };

    this.childHolder.forEach((child) => {
      if (!child.element || !child.vectorPosition || !child.vector2D) return;

      if (this.mouseReact) {
        const { x, y, z } = child.vectorPosition;
        const rz = y * this.position.sy + z * this.position.cy;
        child.vectorPosition.x = x * this.position.cx + rz * this.position.sx;
        child.vectorPosition.y = y * this.position.cy + z * -this.position.sy;
        child.vectorPosition.z = x * -this.position.sx + rz * this.position.cx;
      }

      const scale = fov / (fov + child.vectorPosition.z);
      child.vector2D.x = child.vectorPosition.x * scale + this.center2D.x;
      child.vector2D.y = child.vectorPosition.y * scale + this.center2D.y;

      if (child.diffX && child.diffY) {
        child.vector2D.x -= child.diffX;
        child.vector2D.y -= child.diffY;
      }

      child.element.setAttribute('x', `${child.vector2D.x}`);
      child.element.setAttribute('y', `${child.vector2D.y}`);

      let opacity = this.mouseReact
        ? (this.radius - child.vectorPosition.z) / this.diameter
        : parseFloat(child.element.getAttribute('opacity') || '1');
      opacity = this.mouseReact
        ? Math.max(opacity, opacityOut)
        : child.mouseOver
        ? opacity + (opacityOver - opacity) / opacitySpeed
        : opacity + (opacityOut - opacity) / opacitySpeed;

      const opacityMultiplier =
        1 - (this.radius_factor - 1) / (animatingRadiusLimit - 1);
      child.element.setAttribute('opacity', `${opacity * opacityMultiplier}`);
    });

    this.childHolder.sort((a, b) => b.vectorPosition!.z - a.vectorPosition!.z);
  }

  private animationLoopStart() {
    this.animFrameId = window.requestAnimationFrame(() => {
      this.render();
      this.animationLoopStart();
    });
  }

  private _animIn() {
    if ((this.animating = this.radius_factor > 1)) {
      this.setRadiusFactor(
        this.radius_factor - (this.settings.animatingSpeed || 0.1)
      );
      window.requestAnimationFrame(this._animIn);
    } else if (this.animIn_cb) {
      this.animIn_cb();
      this.animIn_cb = null;
    }
  }

  private _animOut() {
    if (
      (this.animating =
        this.radius_factor < (this.settings.animatingRadiusLimit || 1.3))
    ) {
      this.setRadiusFactor(
        this.radius_factor + (this.settings.animatingSpeed || 0.1)
      );
      window.requestAnimationFrame(this._animOut);
    } else if (this.animOut_cb) {
      this.animOut_cb();
      this.animOut_cb = null;
    }
  }

  private setRadiusFactor(factor: number) {
    this.radius_factor = Math.min(
      Math.max(factor, 1),
      this.settings.animatingRadiusLimit || 1.3
    );
    this.setParams();
  }

  resetRadiusFactor() {
    this.setRadiusFactor(1);
  }

  animOut(callback: () => void) {
    if (!this.animating) {
      this.radius_factor = 1;
      this.animOut_cb = callback;
      this._animOut();
    }
  }

  animIn(callback: () => void) {
    if (!this.animating) {
      this.radius_factor = this.settings.animatingRadiusLimit || 1.3;
      this.animIn_cb = callback;
      this._animIn();
    }
  }

  setChildren(children: SVG3DTagCloudChild[]) {
    this.destroy();
    this.settings.children = children;
    this.build();
  }

  private setSvgElAndSvgBgEl() {
    this.svgEl = document.createElementNS(this.svgNS, 'svg') as SVGSVGElement;
    this.svgEl.addEventListener('mousemove', this.onMouseMoveHandler);
    this.containerEl.appendChild(this.svgEl);

    if (this.settings.isDrawSvgBg) {
      this.svgBg = document.createElementNS(
        this.svgNS,
        'rect'
      ) as SVGRectElement;
      this.setAttributes(this.svgBg, {
        x: '0',
        y: '0',
        fill: `${this.settings.svgBgColor}`,
      });
      this.svgEl.appendChild(this.svgBg);
    }
  }

  // start to render the tag cloud component
  build = () => {
    if (!this.settings.children.length) return;
    this.setSvgElAndSvgBgEl();
    this.addChildren();
    this.setParams();
    this.animationLoopStart();
    window.addEventListener('resize', this.onScreenResizeHandler);
  };

  // destroy the element when component is removed;
  destroy() {
    if (this.animFrameId) window.cancelAnimationFrame(this.animFrameId);
    window.removeEventListener('resize', this.onScreenResizeHandler);
    if (this.svgBg) this.svgEl?.removeChild(this.svgBg);
    if (this.svgEl) {
      this.containerEl.removeChild(this.svgEl);
      this.svgEl.removeEventListener('mousemove', this.onMouseMoveHandler);
      this.svgEl = null;
    }
  }

  static __VERSION() {
    console.log(
      '%c [ __VERSION ]-573',
      'font-size:13px; background:pink; color:#bf2c9f;',
      '__VERSION__'
    );
  }
}

export default SVG3DTagCloud;

if (window) {
  // @ts-ignore
  window.SVG3DTagCloud = SVG3DTagCloud;
  // @ts-ignore
  window.SVG3dTagCloud = SVG3DTagCloud;
  // @ts-ignore
  window.Svg3dTagCloud = SVG3DTagCloud;
}

interface SVG3DTagCloudChild {
  element?: Element;
  link?: Element;
  vectorPosition?: { x: number; y: number; z: number };
  vector2D?: { x: number; y: number };
  diffX?: number;
  diffY?: number;
  mouseOver?: boolean;
  index?: number;
  tooltipLabel?: string;
  label?: string;
  image?: string;
  url?: string;
  target?: string;
  width?: number | string;
  height?: number | string;
  fontColor?: string;
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  fontStyle?: string;
  fontStretch?: FontStretch;
  tooltip?: string;
}

interface SVG3DTagCloudProps {
  children: SVG3DTagCloudChild[];
  width?: number | string;
  height?: number | string;
  radius?: number | string;
  radiusMin?: number;
  isDrawSvgBg?: boolean;
  svgBgColor?: string;
  opacityOver?: number;
  opacityOut?: number;
  opacitySpeed?: number;
  fov?: number;
  speed?: number;
  fontFamily?: string;
  fontSize?: string;
  fontColor?: string;
  fontWeight?: string;
  fontStyle?: string;
  fontStretch?: FontStretch;
  fontToUpperCase?: boolean;
  tooltipFontFamily?: string;
  tooltipFontSize?: string;
  tooltipFontColor?: string;
  tooltipFontWeight?: string;
  tooltipFontStyle?: string;
  tooltipFontStretch?: FontStretch;
  tooltipFontToUpperCase?: boolean;
  tooltipTextAnchor?: string;
  tooltipDiffX?: number;
  tooltipDiffY?: number;
  animatingSpeed?: number;
  animatingRadiusLimit?: number;
}

interface SVG3DTagCloudState extends SVG3DTagCloudProps {
  children: SVG3DTagCloudChild[];
}

export type { SVG3DTagCloudChild, SVG3DTagCloudProps, SVG3DTagCloudState };
