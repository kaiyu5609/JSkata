var zrender = require('./src/zrender');

// require('./src/svg/svg');

module.exports = zrender;


/**
 * @module
 *
 * 一、var zr = new zrender();
 *      this.storage = new Storage();
 *      this.painter = new Painter();
 *          1.create domRoot (this._domRoot)
 *      this.animation = new Animation();
 *          1.this.stage.update.bind(zr.flush, zr);
 *          2.this.start();
 *              this._startLoop();
 *                  step();
 *
 * 二、var circle = new zrender.Circle();
 *      Path.call()
 *          this.path = null;
 *          this.__dirtyPath = true;
 *      Displayable.call()
 *          this.shape = options.shape;
 *          this.style = new Style(options.style, this);
 *              this.extendFrom();
 *                  this.fill = style.fill;
 *                  this.stroke = style.stroke;
 *              this.host = circle(displayable)
 *              this.lineWidth = 1;
 *              this.lineDash = null
 *              this.lineDashOffset = 0;
 *      Element.call()
 *          this.position = [0, 0];
 *          this.rotation = 0;
 *          this.scale = [1, 1];
 *  三、zr.add(circle);
 *      this.storage.addRoot(circle);
 *          this.addToStorage(el);
 *              el.dirty(false);
 *                  el.__dirty = true;
 *          el.addSelfToZr(zr);// Element.addSelfToZr
 *              this.__zr = zr;
 *          this._roots.push(el);
 *      this._needsRefresh = true;
 *
 *  四、animation (next clock cycle) -> step();
 *      this._update();
 *      this.stage.update(); --> zr.flush();
 *          this.refreshImmediately();
 *              this._needsRefresh = false;
 *              this.painter.refresh();
 *                  var list = this.storage.getDisplayList(true);
 *                      this.updateDisplayList(false);
 *                          this._roots.forEach(el => {})
 *                              this._updateAndAddDisplayable(el, null, false);
 *                                  el.update();
 *                                  this._displayList = [el];
 *                  this._paintList(list);
 *                      this._updateLayerStatus(list);
 *                          list.forEach(el => {})
 *                              el.__frame = -1;
 *                      this._doPaintList(list, false);
 *                          list.forEach(el => {})
 *                              currentZLevel = 0;
 *                              currentLayer = self.getLayer(currentZLevel);
 *                                  var layer = new Layer();
 *                                      dom = this.dom = createDom();// canvas
 *                                      // setStyle 设置各种样式属性
 *                                      this.__dirty = true;
 *                                  layer.__builtin__ = true;
 *                                  self.insertLayer(zlevel, layer);
 *                                      domRoot.appendChild(layer.dom);
 *                                  layer.initContext();
 *                                      this.ctx = this.dom.getContext('2d');
 *                                      this.ctx.__currentValues = {};
 *                                      this.ctx.dpr = this.dpr;
 *
 *                              currentLayer.ctx.save();
 *                              currentLayer.clear();
 *                                  this.ctx.clearRect(0, 0, this.dom.width, this.dom.height);
 *
 *                              self._doPaintEl(el, currentLayer, false, scope = {});
 *
 *                                  el.brush(ctx, prevEl = null);// Path.brush()
 *                                      var style = this.style;
 *                                      var path = this.path = new PathProxy(true);
 *                                      style.bind(ctx, this, prevEl);
 *                                          ctx.fillStyle = this.fill;
 *                                          ctx.strokeStyle = this.stroke;
 *                                          ...
 *                                          ctx.lineWidth = 1;
 *                                      this.setTransform(ctx);
 *                                          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);// dpr = 2;
 *                                      var scale = this.getGlobalScale();// [1, 1]
 *                                      path.setScale(scale);
 *                                          path._ux = 0.5;
 *                                          path._uy = 0.5;
 *                                      path.beginPath(ctx);
 *                                      this.buildPath(path, this.shape, false);// Circle.buildPath();
 *                                          ctx.arc(shape.cx, shape.cy, shape.r, 0, Math.PI * 2, true);// ctx -> path
 *                                              this._ctx.arc(cx, cy, r, startAngle, endAngle, anticlockwise);
 *                                      path.fill(ctx);
 *                                          ctx.fill();
 *                                      path.stroke(ctx);
 *                                          ctx.stroke();
 *                                      this.restoreTransform(ctx);
 *                                          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);// dpr = 2;
 *                                  scope.prevEl = el;
 *                              el.__dirty = false;
 *                          ctx.restore();
 *                          this._furtherProgressive = false;
 *                      this.eachBuiltinlayer();
 *              this._needsRefresh = false;
 *
 */
