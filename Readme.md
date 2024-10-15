# SVG-3D-TAG-CLOUD

**Create Stunning 3D Tag Clouds with SVG**

Svg3dTagCloud is a lightweight and user-friendly JavaScript library that empowers you to generate visually appealing 3D tag clouds using SVG (Scalable Vector Graphics). It offers effortless integration into your web projects, delivering an engaging way to present keyword lists or other textual data.

**Features:**

- Simple & Effective: Effortlessly create tag clouds through a well-designed API.
- Versatile Rendering: Supports both ES modules (ESM) and pure JavaScript script formats for broad compatibility.
- Customizable Appearance: Tailor the visual style of your tag cloud with a range of configuration options.

**Installation:**

1. Npm Url: https://www.npmjs.com/package/svg-3d-tag-cloud

2. **Install via NPM:**

   - `npm i svg-3d-tag-cloud`

3. **Download Svg3dTagCloud:**

   - Clone the repository from [GitHub](https://github.com/Appigle/svg3dtagcloud).
   - Alternatively, download the library files manually.

4. **Use CDN resource**

   ```js
   <script src="https://unpkg.com/svg-3d-tag-cloud/dist/SVG3DTagCloud.global.js"></script>
   ```

**Usage (HTML + JavaScript):**

1. **Create HTML Structure:**

   ```javascript
   <!DOCTYPE html>
   <html lang="en">
     <head>
       <title>SVG3DTagCloud Demo</title>
     </head>
     <body>
       <div id="container"></div>
       <script src="https://unpkg.com/svg-3d-tag-cloud/dist/SVG3DTagCloud.global.js"></script>
       <script>
         // ... your JavaScript code to create the tag cloud ...
       </script>
     </body>
   </html>
   ```

2. **Create the Tag Cloud:**

   ```javascript
   let childrenForText = [
     {
       label: 'JavaScript',
       url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
       target: '_blank',
     },
     {
       label: 'HTML',
       url: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
       target: '_blank',
     },
     // ... add more tag objects
   ];

   let childrenForImage = [
     {
       image: '/public/logo.svg', // Replace with your image path
       width: '50',
       height: '50',
       url: 'http://www.google.com',
       target: '_top',
       tooltip: 'Lorem ipsum',
     },
     // ... add more image objects
   ];

   let settings = {
     children: childrenForText || childrenForImage, // Choose between text or image tags
     width: 400, // default size
     height: 400,
     radius: '65%', // tag cloud radius percentage
     radiusMin: 75, // tag cloud min-radius px
     isDrawSvgBg: true,
     svgBgColor: 'black', // background color
     opacityOver: 1.0,
     opacityOut: 0.3,
     opacitySpeed: 6,
     fov: 800,
     speed: 0.1,
     fontFamily: 'Oswald, Arial, sans-serif',
     fontSize: '15',
     fontColor: '#fff',
     fontWeight: 'normal', // Customize font properties
     fontStyle: 'normal',
     fontStretch: 'narrower',
     fontToUpperCase: true,
     tooltipFontFamily: 'Oswald, Arial, sans-serif',
     tooltipFontSize: '12',
     tooltipFontColor: '#fff',
     tooltipFontWeight: 'normal',
     tooltipFontStyle: 'italic',
     tooltipFontStretch: 'normal',
     tooltipFontToUpperCase: false,
     tooltipTextAnchor: 'left',
     tooltipDiffX: 10,
     tooltipDiffY: 10,
     animatingSpeed: 0.01,
     animatingRadiusLimit: 1.3,
   };

   // Create and initialize the tag cloud
   new SVG3dTagCloud(document.getElementById('container'), settings).build();
   ```

**Configuration Options (Attribute Table):**

| Attribute                | Type                          | Default                     | Description                                                                              |
| ------------------------ | ----------------------------- | --------------------------- | ---------------------------------------------------------------------------------------- |
| `children`               | Array of `SVG3DTagCloudChild` | []                          | An array of objects representing the tags to be displayed.                               |
| `width`                  | Number                        | 400                         | The width of the tag cloud in pixels.                                                    |
| `height`                 | Number                        | 400                         | The height of the tag cloud in pixels.                                                   |
| `radius`                 | Number or string              | '65%'                       | The radius of the tag cloud. Can be a pixel value or a percentage of the container size. |
| `radiusMin`              | Number                        | 75                          | The minimum radius of the tag cloud in pixels.                                           |
| `isDrawSvgBg`            | Boolean                       | false                       | Whether to draw an SVG background.                                                       |
| `svgBgColor`             | String                        | '#fff'                      | The color of the SVG background.                                                         |
| `opacityOver`            | Number                        | 1.0                         | The opacity of the tag cloud when hovered over.                                          |
| `opacityOut`             | Number                        | 0.3                         | The opacity of the tag cloud when not hovered over.                                      |
| `opacitySpeed`           | Number                        | 6                           | The speed of opacity transition.                                                         |
| `fov`                    | Number                        | 800                         | The field of view of the camera.                                                         |
| `speed`                  | Number                        | 0.1                         | The rotation speed of the tag cloud.                                                     |
| `fontFamily`             | String                        | 'Oswald, Arial, sans-serif' | The font family to use for the tags.                                                     |
| `fontSize`               | String                        | '15'                        | The font size of the tags.                                                               |
| `fontColor`              | String                        | '#fff'                      | The color of the tags.                                                                   |
| `fontWeight`             | String                        | 'normal'                    | The font weight of the tags.                                                             |
| `fontStyle`              | String                        | 'normal'                    | The font style of the tags.                                                              |
| `fontStretch`            | String                        | 'narrower'                  | The font stretch of the tags.                                                            |
| `fontToUpperCase`        | Boolean                       | true                        | Whether to convert tag text to uppercase.                                                |
| `tooltipFontFamily`      | String                        | 'Oswald, Arial, sans-serif' | The font family for the tooltips.                                                        |
| `tooltipFontSize`        | String                        | '12'                        | The font size for the tooltips.                                                          |
| `tooltipFontColor`       | String                        | '#fff'                      | The color of the tooltips.                                                               |
| `tooltipFontWeight`      | String                        | 'normal'                    | The font weight for the tooltips.                                                        |
| `tooltipFontStyle`       | String                        | 'italic'                    | The font style for the tooltips.                                                         |
| `tooltipFontStretch`     | String                        | 'normal'                    | The font stretch for the tooltips.                                                       |
| `tooltipFontToUpperCase` | Boolean                       | false                       | Whether to convert tooltip text to uppercase.                                            |
| `tooltipTextAnchor`      | String                        | 'left'                      | The text anchor for the tooltips.                                                        |
| `tooltipDiffX`           | Number                        | 10                          | The horizontal offset for the tooltips.                                                  |
| `tooltipDiffY`           | Number                        | 10                          | The vertical offset for the tooltips.                                                    |
| `animatingSpeed`         | Number                        | 0.01                        | The animation speed.                                                                     |
| `animatingRadiusLimit`   | Number                        | 1.3                         | The maximum radius for the animation.                                                    |

## Project running

```bash
  git clone https://github.com/Appigle/svg3dtagcloud.git
  npm install
  npm run dev
  npm run build_cp
  npm login
  npm run lib-publish  # publish to npm
```

## License

MIT

## Thanks

[Niklas Knaack](https://github.com/NiklasKnaack/jquery-svg3dtagcloud-plugin)
