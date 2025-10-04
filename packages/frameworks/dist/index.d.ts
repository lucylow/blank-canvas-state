declare function detectFrameworkFromFilename(filename: any, content?: string): "vue" | "svelte" | "react" | "generic";

export { detectFrameworkFromFilename };
