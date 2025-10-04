interface CompatGuardVitePluginOptions {
    targetBaseline?: string;
}
declare function compatGuardVitePlugin(opts?: CompatGuardVitePluginOptions): {
    name: string;
    configResolved(): Promise<void>;
};

export { compatGuardVitePlugin as default };
