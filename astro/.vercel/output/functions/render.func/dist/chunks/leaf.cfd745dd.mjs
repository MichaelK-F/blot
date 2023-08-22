const id = "leaf.md";
const collection = "workshops";
const slug = "leaf";
const body = '\n# How to draw a leaf\n\n> You can follow along in this editor: https://editor.haxidraw.hackclub.com/\n\n---\n\nLet\'s learn how to draw a leaf that looks likes this.\n\n<img width="389" alt="Screen Shot 2023-07-03 at 2 14 10 PM" src="https://github.com/hackclub/haxidraw/assets/27078897/9ce96217-bc5e-49cc-87b2-178681188eb3">\n\nLet\'s break it down into parts.\n\n## Outline\n\nWe\'ll start with the outline of the leaf.\n\n<img width="382" alt="Screen Shot 2023-07-03 at 2 16 33 PM" src="https://github.com/hackclub/haxidraw/assets/27078897/7027b27a-cc5f-4565-9357-2c8fd1b21e6f">\n\nFirst let\'s lay down a line which will become the top edge.\n\n```js\nconst leafLength = 5;\nconst leafW = 1.3;\n\nconst edge = createTurtle().forward(leafLength);\n\n// render the final leaf like such\nconst leaf = createTurtle().join(edge);\n\ndrawTurtles(leaf);\n```\n\n<img width="366" alt="Screen Shot 2023-07-03 at 2 17 32 PM" src="https://github.com/hackclub/haxidraw/assets/27078897/aa904051-d23a-4542-9da9-025cd658fc28">\n\nNow we can warp the line by resampling points and then using `warp` with a bezier curve.\n\n```js\nconst edge = createTurtle()\n  .forward(leafLength)\n  .resample(0.01) // we resample to have points to bend\n  .warp(bezierEasing(0, [0.4, 2.58], [0.52, 0.31], 0)); // bezierEasing takes a start y, control point, control point, end y\n```\n\n<img width="374" alt="Screen Shot 2023-07-03 at 2 19 18 PM" src="https://github.com/hackclub/haxidraw/assets/27078897/1ed396a9-41bd-42d6-bd60-95dd8eea3719">\n\nLet\'s make the bottom edge too.\n\n```js\nconst bottom = edge.copy().scale([1, -1], [0, 0]);\n\nconst leaf = createTurtle().join(edge).join(bottom);\n\ndrawTurtles(leaf);\n```\n\n<img width="378" alt="Screen Shot 2023-07-03 at 2 22 51 PM" src="https://github.com/hackclub/haxidraw/assets/27078897/88b1ccfb-0811-49bf-80f5-ce3cf7c93609">\n\nNow we can add some noise to make the leaf look a bit more organic.\n\n```js\nedge.warp(\n  (t) => noise(t * 20.4, { octaves: 2 }) * 0.09 * (t === 0 || t === 1 ? 0 : 1)\n);\nbottom.warp(\n  (t) => noise(t * 23.6, { octaves: 2 }) * -0.1 * (t === 0 || t === 1 ? 0 : 1)\n);\n```\n\nThis term `(t===0 || t === 1 ? 0 : 1)` makes sure that the endpoints stay the same on the curve.\nTry playing with the multiplication terms.\n\n<img width="358" alt="Screen Shot 2023-07-03 at 2 23 45 PM" src="https://github.com/hackclub/haxidraw/assets/27078897/d547cd78-ec67-4fbe-8c72-78363c611946">\n\nNow we have an outline let\'s do the veins of the leaf.\n\n## Veins\n\nAfter adding the veins our leaf will look like this.\n\n<img width="347" alt="Screen Shot 2023-07-03 at 2 25 44 PM" src="https://github.com/hackclub/haxidraw/assets/27078897/ad810112-ca58-48f4-8961-311cb7d44ec7">\n\nWe\'ll start with the top side by drawing some lines the follow the distribution of the edge.\nLet\'s make a veins function which will return some lines we can add to our main drawing.\n\n```js\nfunction veins() {\n  const lines = createTurtle();\n\n  let littleLinesMax = 61;\n  for (let i = 4; i < littleLinesMax - 5; i++) {\n    const t = i / (littleLinesMax - 1); // this line to get t values 0 to 1 while iterating is very common\n    const x0 = t * leafLength;\n    const y0 = 0;\n\n    // try playing with the `0.1` term\n    // interpolate returns a point and we take `[1]` to get the y value\n    y = edge.interpolate(t + 0.1)[1];\n\n    const line = createTurtle([x0, y0]);\n\n    line.right(-70 + t * 37 + randInRange(-4, 4));\n\n    let r = y * 0.7;\n\n    if (r < 0.01) continue;\n\n    line.forward(r);\n\n    lines.join(line);\n  }\n\n  return lines;\n}\n```\n\nWhich we add to the drawing like such.\n\n```js\nleaf.join(veins());\n```\n\n<img width="370" alt="Screen Shot 2023-07-03 at 2 28 37 PM" src="https://github.com/hackclub/haxidraw/assets/27078897/cfed6d56-3b16-4ecc-9daf-bc7c33045ba8">\n\nIf we add back in the randomness term `randInRange(-4, 4)` to the angle of the line we can start to make a more natural image.\n\n<img width="344" alt="Screen Shot 2023-07-03 at 2 30 53 PM" src="https://github.com/hackclub/haxidraw/assets/27078897/2a5b649d-e8ed-47f8-afae-8a3ff9e7dc12">\n\nNow let\'s bend the lines with our warping function again.\n\n```js\n// try removing the y scaling and see what happens\nconst warper = bezierEasing(0, [0.28, y / 4], [0.58, y / 8], 0);\n\nline\n  .forward(r)\n  .resample(0.01) // we resample so there are points to warp, see what happens when this is removed\n  .warp(warper);\n```\n\n<img width="363" alt="Screen Shot 2023-07-03 at 2 32 08 PM" src="https://github.com/hackclub/haxidraw/assets/27078897/03698576-c5ec-4aaf-9168-7bcaa90274bf">\n\nLet\'s randomly trim each vein with every fifth being a bite longer.\n\n```js\n// the ternary makes evey fifth line trimmed up to 0.7 to 0.9 and all the others between 0.1 and 0.7\nconst trimTo = (i % 5 === 0)\n  ? randInRange(0.7, 0.9)\n  : randInRange(0.1, 0.7);\n\nif (r < 0.01) continue;\n\nconst warper = bezierEasing(0, [0.28, y/4], [0.58, y/8], 0);\n\nline\n  .forward(r)\n  .resample(0.01)\n  .warp(warper)\n  .trim(0, trimTo);\n```\n\n<img width="350" alt="Screen Shot 2023-07-03 at 2 33 06 PM" src="https://github.com/hackclub/haxidraw/assets/27078897/46cfb081-9b3c-4e1f-bca6-336be48e1828">\n\nAnd let\'s randomly break up these lines.\n\n```js\nline.iteratePath((pt) => {\n  return Math.random() < (i % 5 === 0 ? +0.17 : 0.56) ? "BREAK" : pt;\n});\n```\n\n<img width="346" alt="Screen Shot 2023-07-03 at 2 33 49 PM" src="https://github.com/hackclub/haxidraw/assets/27078897/98c82e8e-aa3c-4d5a-a24e-74d13cd5d4a6">\n\nThen call veins again and flip it over for the bottom side.\n\n```js\nleaf.join(veins().scale([1, -1], [0, 0]));\n```\n\n<img width="352" alt="Screen Shot 2023-07-03 at 2 34 39 PM" src="https://github.com/hackclub/haxidraw/assets/27078897/b7a4bf33-5598-4ee3-9787-6b57de6cdae4">\n\n## The Stem\n\nThe stem is the easiest part.\n\nWe just need to draw a line.\n\n```js\nconst lineStem = createTurtle([-1, 0])\n  .forward(leafLength + 1)\n  .resample(0.1);\n\nleaf.join(lineStem);\n```\n\n<img width="426" alt="Screen Shot 2023-07-03 at 2 35 26 PM" src="https://github.com/hackclub/haxidraw/assets/27078897/7cf0afbc-af28-439b-a672-17e60080b8bb">\n\n## Finishing Up\n\nTo Finish our leaf let\'s go through all the points and add a little noise and a bend upwards.\n\n```js\nleaf.iteratePath((pt) => {\n  let [x, y] = pt;\n  y += x * x * 0.02;\n  y += noise([x * 0.2]) * 0.3;\n  return [x, y];\n});\n```\n\nAnd now we have a leaf!\n\n<img width="416" alt="Screen Shot 2023-07-03 at 2 37 02 PM" src="https://github.com/hackclub/haxidraw/assets/27078897/ced13771-b8e6-4eb0-a035-5528c9e38cde">\n\n## Acknowledgements\n\nThanks to [Lingdong](https://github.com/LingDong-) for drawing the first draft of the leaf with me.\n';
const data = { title: "How to draw a leaf", description: "Let's learn how to draw a leaf that looks likes this.", thumbnail: "https://github.com/hackclub/haxidraw/assets/27078897/9ce96217-bc5e-49cc-87b2-178681188eb3" };
const _internal = {
  type: "content",
  filePath: "/Users/jchen/Documents/Programming/prs/haxidraw/astro/src/content/workshops/leaf.md",
  rawData: "\ntitle: How to draw a leaf\ndescription: Let's learn how to draw a leaf that looks likes this.\nthumbnail: https://github.com/hackclub/haxidraw/assets/27078897/9ce96217-bc5e-49cc-87b2-178681188eb3"
};
export {
  _internal,
  body,
  collection,
  data,
  id,
  slug
};
