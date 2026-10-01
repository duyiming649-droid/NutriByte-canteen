// Camera view presets. pos/tgt in world metres.
export const VIEW_LABELS = {
  overview: 'Overview',
  entrance: 'Entrance',
  dining: 'Dining',
  kitchen: 'Open Kitchen',
  backline: 'Back Kitchen',
  pickup: 'Pick-up',
};

export const VIEWS = {
  overview: { pos: [11.0, 7.2, -9.0], tgt: [4.2, 0.2, 3.8] },
  entrance: { pos: [2.4, 2.0, -4.3], tgt: [6.6, 0.95, 0.3] },
  dining: { pos: [7.1, 1.85, 0.45], tgt: [1.2, 0.9, 2.1] },
  kitchen: { pos: [4.15, 2.1, 0.35], tgt: [2.6, 0.85, 5.2] },
  backline: { pos: [5.9, 2.15, 4.35], tgt: [1.5, 0.9, 6.85] },
  pickup: { pos: [4.6, 1.75, 1.2], tgt: [7.5, 1.05, 3.9] },
};

export function tweenCamera(camera, controls, fromPos, fromTgt, toPos, toTgt, dur, onDone) {
  const t0 = performance.now();
  function step() {
    const t = Math.min(1, (performance.now() - t0) / dur);
    const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    camera.position.set(
      fromPos[0] + (toPos[0] - fromPos[0]) * e,
      fromPos[1] + (toPos[1] - fromPos[1]) * e,
      fromPos[2] + (toPos[2] - fromPos[2]) * e,
    );
    controls.target.set(
      fromTgt[0] + (toTgt[0] - fromTgt[0]) * e,
      fromTgt[1] + (toTgt[1] - fromTgt[1]) * e,
      fromTgt[2] + (toTgt[2] - fromTgt[2]) * e,
    );
    controls.update();
    if (t < 1) requestAnimationFrame(step);
    else if (onDone) onDone();
  }
  requestAnimationFrame(step);
}
