interface LintDiagnostic {
    severity: 'warning' | 'error' | 'info';
    message: string;
    location: {
        line: number;
    };
}
interface LintStats {
    checks: number;
}
declare class CompatGuardLinter {
    targetBaseline: string;
    options: Record<string, any>;
    stats: LintStats;
    initialized: boolean;
    constructor(targetBaseline?: string, options?: Record<string, any>);
    initialize(): Promise<void>;
    lintCode(code: string, fileType?: string, opts?: Record<string, any>): Promise<{
        diagnostics: LintDiagnostic[];
        stats: LintStats;
    }>;
    getStats(): LintStats;
}

export { CompatGuardLinter, type LintDiagnostic, type LintStats, CompatGuardLinter as default };
