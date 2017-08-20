// import {
//   UtSystem,
//   UtDebug,
//   LDTransform,
//   LDGL,
//   Live2D,
//   Live2DModelWebGL,
//   Live2DModelJS,
//   Live2DMotion,
//   MotionQueueManager,
//   PhysicsHair,
//   AMotion,
//   PartsDataID,
//   DrawDataID,
//   BaseDataID,
//   ParamID
// } from './lib/live2d';
import LAppModel from './lib/LAppModel';
import {
    Live2DFramework,
    L2DTargetPoint,
    L2DViewMatrix,
    L2DMatrix44
} from './lib/Live2DFramework';
import MatrixStack from './lib/MatrixStack';

/**
 * @class
 * @param modelDefine {object} Content of {name}.model.js file
 * @param [options] {object} The optional parameters
 * @param [options.eyeBlink=true] {boolean}
 * @param [options.lipSyncWithSound=true] {boolean}
 * @param [options.debugLog=false] {boolean}
 * @param [options.debugMouseLog=false] {boolean}
 * @param [options.randomMotion=true] {boolean}
 * @param [options.defaultMotionGroup="idle"] {string}
 * @param [options.priorityDefault=1] {number}
 * @param [options.priorityForce=3] {number}
 * @param [options.audioPlayer=3] {function} Custom audio player, pass (filename, rootPath) as parameters
 *
 */
export default class Live2DSprite {
    constructor(modelDefine, options) {
        this.interactive = true;

        this.platform = window.navigator.platform.toLowerCase();

        const fullOptions = Object.assign({
            priorityForce: 3,
            priorityDefault: 1,
            debugLog: false,
            debugMouseLog: false,
            eyeBlink: true,
            lipSyncWithSound: true,
            randomMotion: true,
            defaultMotionGroup: "idle",
            audioPlayer: null
        }, options);

        Live2D.init();
        this.model = new LAppModel(fullOptions);

        this.gl = null;
        this.canvas = null;

        this.dragMgr = null; /*new L2DTargetPoint();*/
        this.viewMatrix = null; /*new L2DViewMatrix();*/
        this.projMatrix = null; /*new L2DMatrix44()*/
        this.deviceToScreen = null; /*new L2DMatrix44();*/

        this.texture = null;

        this.modelReady = false;
        this.onModelReady = [];
        this.modelDefine = modelDefine;

    }

    init() {

        var width = this.canvas.width;
        var height = this.canvas.height;

        // this.texture = PIXI.RenderTexture.create(width, height);

        this.canvasWidth = this.canvas.width;
        this.canvasHeight = this.canvas.height;

        this.dragMgr = new L2DTargetPoint();
        this.gl = this.getWebGLContext();

        var ratio = height / width;
        var left = -1;
        var right = 1;
        var bottom = -ratio;
        var top = ratio;

        this.viewMatrix = new L2DViewMatrix();
        this.viewMatrix.setMaxScreenRect(-2, 2, -2, 2);
        this.viewMatrix.setScreenRect(left, right, bottom, top);
        // this.viewMatrix.setMaxScale(2);
        // this.viewMatrix.setMinScale(0.5);
        // this.viewMatrix.adjustScale(0, 0, 0.7);

        this.projMatrix = new L2DMatrix44();
        this.projMatrix.multScale(ratio, 1); // flip for rtt

        this.deviceToScreen = new L2DMatrix44();
        this.deviceToScreen.multTranslate(-width / 2.0, -height / 2.0);
        this.deviceToScreen.multScale(2 / width, -2 / height);

        Live2D.setGL(this.gl);

        this.x = width / 2;
        this.y = height / 2;
        // this.anchor.x = 0.5;
        // this.anchor.y = 0.5;
        // this.scale.y = -1;

        this.gl.clearColor(0.0, 0.0, 0.0, 0.0);
        this.model.load(this.gl, this.modelDefine, () => {
            this.modelReady = true;
            this.onModelReady.forEach(elem => elem());
        });
    }

    draw() {
        MatrixStack.reset();
        MatrixStack.loadIdentity();

        this.dragMgr.update();
        this.model.setDrag(this.dragMgr.getX(), this.dragMgr.getY());

        // this.viewMatrix.adjustTranslate(-this.x / this.canvasWidth, -this.y / this.canvasHeight);
        // this.viewMatrix.adjustScale(this.anchor.x, this.anchor.y, this.scale.x, this.scale.y);

        MatrixStack.multMatrix(this.projMatrix.getArray());
        MatrixStack.multMatrix(this.viewMatrix.getArray());
        // MatrixStack.multMatrix(this.deviceToScreen.getArray());
        MatrixStack.push();

        this.model.update();
        this.model.draw(this.gl);

        MatrixStack.pop();
    }

    destroy(...args) {
        console.log('destroyed')
        this.model.release(this.gl);
        var buf = this.gl.createBuffer();
    }

    containsPoint(point) {
        if (this.modelReady) {
            return this.hitTest(null, point.x, point.y);
        }
        return false;
    }

    /* Setter, Getter */
    setCanvas(canvas) {
        if (canvas) this.canvas = canvas;
    }

    getCanvas() {
        return this.canvas;
    }

    getWebGLContext() {
        var NAMES = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];

        for (var i = 0; i < NAMES.length; i++) {
            try {
                var ctx = this.canvas.getContext(NAMES[i], {
                    premultipliedAlpha: true
                });
                if (ctx) return ctx;
            } catch (e) {}
        }
        return null;
    };

    /* Live2D methods */


    /* Transforms */

    adjustScale(cx, cy, scale) {
        this.onModelReady.push(() => {
            this.viewMatrix.adjustScale(cx, cy, scale);
        });
    }
    adjustTranslate(shiftX, shiftY) {
        this.onModelReady.push(() => {
            this.viewMatrix.adjustTranslate(shiftX, -shiftY);
        });
    }

    /**
     * specify `PARAM_MOUTH_OPEN_Y` of Live2D model.
     * @param value {Number} between 0~1, set to `null` will disable it.
     */
    setLipSync(value) {
        if (value === null) {
            this.model.setLipSync(false);
        } else {
            this.model.setLipSync(true);
            this.model.setLipSyncValue(value);
        }
    }
    setRandomExpression() {
        this.onModelReady.push(() => {
            this.model.setRandomExpression();
        });
    }
    setExpression(name) {
        this.onModelReady.push(() => {
            this.model.setExpression(name);
        });
    }
    startRandomMotion(name, priority) {
        this.onModelReady.push(() => {
            this.model.startRandomMotion(name, priority);
        });
    }
    startRandomMotionOnce(name, priority) {
        this.onModelReady.push(() => {
            this.model.startRandomMotionOnce(name, priority);
        });
    }
    stopRandomMotion() {
        this.onModelReady.push(() => {
            this.model.stopRandomMotion();
        });
    }
    startMotion(name, no, priority) {
        this.onModelReady.push(() => {
            this.model.startMotion(name, no, priority);
        });
    }
    playSound(filename, host = '/') {
        this.onModelReady.push(() => {
            this.model.playSound(filename, host);
        });
    }

    /* Event methods */
    hitTest(id, x, y) {
        return this.model.hitTest(id,
            this.viewMatrix.invertTransformX(this.deviceToScreen.transformX(x)),
            this.viewMatrix.invertTransformY(this.deviceToScreen.transformY(y)));
    }
    setViewPoint(x, y) {
        this.dragMgr.setPoint(this.viewMatrix.invertTransformX(this.deviceToScreen.transformX(x)),
            this.viewMatrix.invertTransformY(this.deviceToScreen.transformY(y)));
    }


    /* Some raw methods of Live2D */
    getParamFloat(key) {
        return this.model.getLive2DModel().getParamFloat(key);
    }
    setParamFloat(key, value, weight = 1) {
        this.model.getLive2DModel().setParamFloat(key, value, weight);
    }
    addToParamFloat(key, value, weight = 1) {
        this.model.getLive2DModel().addToParamFloat(key, value, weight);
    }
    multParamFloat(key, value, weight = 1) {
        this.model.getLive2DModel().multParamFloat(key, value, weight);
    }

}