import { createCanvas } from 'canvas';

Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: function () {
    return createCanvas().getContext('2d');
  },
});
