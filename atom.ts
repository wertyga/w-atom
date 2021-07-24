const fs = require('fs');

const MAP: Record<string, string> = {
	m: 'margin',
	p: 'padding',
};
const TYPES: Record<string, string[]> = {
	b: ['bottom'],
	t: ['top'],
	l: ['left'],
	r: ['right'],
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

export type OptionsType = {
	outputFile: string;
	variablesCss: string;
	mobileResolution?: string;
};

export enum OPTIONS_VARS {
	OUTPUT_FILE = 'output',
	VARIABLES_FILE = 'variables',
	MOBILE_RESOLUTION = 'mobile',
};

class Atom {
	_outputFile: string ;
	_variablesCss: string;
	_mobileResolution: string;
	
	constructor({ outputFile, variablesCss, mobileResolution }: OptionsType) {
		this._outputFile = outputFile;
		this._variablesCss = variablesCss;
		this._mobileResolution = mobileResolution;
	}
	
	_handleCheckOptions() {
		let error;
		if (!this._outputFile) error = `Need to provide --${OPTIONS_VARS.OUTPUT_FILE} option`;
		if (!this._variablesCss) error = `Need to provide --${OPTIONS_VARS.VARIABLES_FILE} option`;
		return error;
	}
	
	_arrayConverter(attr: string, level: string, type: string, map: string, variable: string, mobile?: boolean) {
		return `${mobile ? '  ' : ''}.${attr}-${level}${mobile ? '-m' : ''} {\n  ${TYPES[type].reduce(
			(acc, side, i) =>
				`${acc}${i > 0 ? '  ' : ''}${mobile ? '  ' : ''}${MAP[map]}${
					side ? `-${side}` : ''
				}: ${variable}\n`,
			''
		)}${mobile ? '  ' : ''}}\n`;
	}
	
	_createMobileBlock(mobileStr: string) {
		return `@media screen and (max-width: ${this._mobileResolution}px) {
${mobileStr}}`
	}
	
	generate() {
		const error = this._handleCheckOptions();
		if (error) {
			console.error(error);
			process.exit(-1);
		}
		
		const result: string = fs.readFileSync(this._variablesCss, 'utf-8');
		const spaces: string[] = result.match(/--space-\w+:\s\d+(\.)?(\d)?(\w+)/g) as string[];
		spaces.unshift('--space-0: 0rem;');
		let str = '';
		let mobileStr = '';
		spaces.forEach(space => {
			const level = space.split(':')[0].replace('--', '').split('-')[1];
			const variable = Number(level) === 0
				? '0;'
				: `var(${space.split(':')[0]});`;
		
			LEVELS.forEach(attr => {
				const [map, type] = attr.split('');
				if (!TYPES[type]) {
					str += `.${attr}-${level} {\n  ${MAP[map]}: ${variable}\n}\n`;
					if (this._mobileResolution) {
						mobileStr += `  .${attr}-${level}-m {\n    ${MAP[map]}: ${variable}\n  }\n`;
					}
				} else {
					str += this._arrayConverter(attr, level, type, map, variable);
					if (this._mobileResolution) {
						mobileStr += this._arrayConverter(attr, level, type, map, variable, true);
					}
				}
			});
		});
		
		const resultStr = `${str}
${this._createMobileBlock(mobileStr)}
`;
		fs.writeFileSync(this._outputFile, resultStr, 'utf-8');
	};
}

export default Atom;
