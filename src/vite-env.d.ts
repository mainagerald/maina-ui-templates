/// <reference types="vite/client" />

// Allow importing PNG files
declare module '*.png' {
  const content: string;
  export default content;
}

// Allow importing JPG files
declare module '*.jpg' {
  const content: string;
  export default content;
}

// Allow importing SVG files
declare module '*.svg' {
  const content: string;
  export default content;
}

// Allow importing Rive animation files
declare module '*.riv' {
  const content: string;
  export default content;
}
