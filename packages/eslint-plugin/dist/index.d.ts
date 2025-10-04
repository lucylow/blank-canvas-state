declare const rules: {
    baseline: {
        meta: {
            type: string;
            docs: {
                description: string;
            };
        };
        create(context: any): {
            CallExpression(node: any): void;
        };
    };
};
declare const _default: {
    rules: {
        baseline: {
            meta: {
                type: string;
                docs: {
                    description: string;
                };
            };
            create(context: any): {
                CallExpression(node: any): void;
            };
        };
    };
    configs: {
        recommended: {
            plugins: string[];
            rules: {
                'compatguard/baseline': string;
            };
        };
    };
};

export { _default as default, rules };
