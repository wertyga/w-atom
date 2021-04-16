const fs = require('fs');

const MAP: Record<string, string> = {
	m: 'margin',
	p: 'padding',
};
const TYPES: Record<string, string[]> = {
	b: ['bottom'],
	t: ['top'],
	x: ['left', 'right'],
	y: ['top', 'bottom'],
};

const LEVELS = [
	'mt',
	'mb',
	'mr',
	'ml',
	'my',
	'mx',
	'ma',
	'pt',
	'pb',
	'pr',
	'pl',
	'py',
	'px',
	'pa',
];

type OptionsType = {
	outputFile: string;
	variablesCss: string;
};

class Atom {
	_outputFile: string ;
	_variablesCss: string;
	
	constructor({ outputFile, variablesCss }: OptionsType) {
		this._outputFile = outputFile;
		this._variablesCss = variablesCss;
	}
	
	generate() {
		const result: string = fs.readFileSync(this._variablesCss, 'utf-8');
		const spaces: string[] = result.match(/--space-\w+:\s\d+(\.)?(\d)?(\w+)/g) as string[];
		let str = '';
		spaces.forEach(space => {
			const level = space.split(':')[0].replace('--', '').split('-')[1];
			const variable = `var(${space.split(':')[0]});`;
			
			LEVELS.forEach(attr => {
				const [map, type] = attr.split('');
				
				if (!TYPES[type]) {
					str += `.${attr}-${level} {\n  ${MAP[map]}: ${variable}\n}\n`;
				} else {
					str += `.${attr}-${level} {\n  ${TYPES[type].reduce(
						(acc, side, i) =>
							`${acc}${i > 0 ? '  ' : ''}${MAP[map]}${
								side ? `-${side}` : ''
							}: ${variable}\n`,
						''
					)}}\n`;
				}
			});
		});
		
		fs.writeFileSync(this._outputFile, str, 'utf-8');
	};
}

export default Atom;
