# wallbounce-viz

Interactive 3D viewer for MOVi-spheres wall-bounce one-step predictions —
ground truth vs. model, side by side with a shared camera. A rigid sphere is
launched at a wall inside a box (4 side walls + floor, open top); the model
(`unet_std` + nearest-wall displacement feature) sees 5 GT context frames and
predicts the single post-impact frame. Each tab is the MEDIAN-error window of
its split/category — representative, not cherry-picked; `val` scenes were
never seen in training.

Live: https://jianingnz.github.io/wallbounce-viz/

Data: `data/<window>/{gt.bin,pred.bin,meta.json}` — Float32 `[6, 128, 3]`
frames in three.js y-up order (x, height, y); frames 1–5 are shared GT
context, frame 6 is the prediction. `data/index.json` lists the windows.
