// rollup-text-replace-plugin.js

export default function rollupTextReplacePlugin(options = []) {
  if (!options.length) {
    throw new Error(
      'Missing required options: [{placeholder:string , replacement:string}]'
    );
  }
  return {
    name: 'rollup-text-replace-plugin',
    transform(code) {
      return {
        code: (() => {
          let result = code;
          if (Array.isArray(options)) {
            options.forEach(({ placeholder, replacement }) => {
              result = result.replace(placeholder, replacement);
            });
          } else {
            result.replace(new RegExp(placeholder, 'g'), replacement);
          }
          return result;
        })(),
        map: null, // Optional: Add sourcemap support if needed
      };
    },
  };
}
