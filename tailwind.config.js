/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/renderer/**/*.{js,ts,jsx,tsx}',
    // Add MDXEditor's internal classes
    './node_modules/@mdxeditor/editor/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {}
  },
  plugins: [require('@tailwindcss/typography')],
  // Important: ensure MDXEditor styles are included
  corePlugins: {
    preflight: true // keep this true
  }
}
