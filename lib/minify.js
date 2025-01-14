import {
    parse,
    transform,
} from 'putout';
import {print} from '@putout/printer';
import {
    getPlugins,
    getAfterTransform,
    getThirdPassPlugins,
} from './plugins.js';

export const minify = (source, options) => {
    const ast = parse(source, {
        printer: 'putout',
    });
    
    transform(ast, source, {
        rules: {
            'conditions/apply-if': 'off',
            'conditions/convert-equal-to-strict-equal': 'off',
        },
        plugins: getPlugins(options),
    });
    
    transform(ast, source, getAfterTransform(options));
    transform(ast, source, getThirdPassPlugins(options));
    
    const code = print(ast, {
        format: {
            newline: '',
            space: '',
            indent: '',
            splitter: ' ',
            roundBraceOpen: '',
            roundBraceClose: '',
            endOfFile: '',
        },
        semantics: {
            comments: false,
        },
    });
    
    return code
        .replaceAll(',}', '}')
        .replaceAll(',]', ']')
        .replaceAll(';}', '}');
};
