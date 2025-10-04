import { Compiler } from 'webpack';

interface CompatGuardWebpackPluginOptions {
    targetBaseline?: string;
}
declare class CompatGuardWebpackPlugin {
    private opts;
    private linter;
    constructor(opts?: CompatGuardWebpackPluginOptions);
    apply(compiler: Compiler): void;
}

export { CompatGuardWebpackPlugin, CompatGuardWebpackPlugin as default };
