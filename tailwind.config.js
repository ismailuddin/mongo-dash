const colors = require('tailwindcss/colors');

module.exports = {
	purge: {
		enabled: true,
		content: [
			"./src/js/**/*.jsx",
			"./monogo_dash/templates/**/*.html"
		]
	},
	darkMode: 'class',
	theme: {
		colors: {
			...colors,
		},
		extend: {
			fontSize: {
				xxs: '.5rem'
			},
			inset: {
				'-2': '-0.5rem',
				'-4': '-1rem',
				'-8': '-2rem',
				'-12': '-3rem',
			}
		}
	},
	variants: {
		extend: {
			textColor: ['responsive', 'focus', 'hover', 'group-hover', 'dark'],
			visibility: ['responsive', 'focus', 'hover', 'group-hover'],
			backgroundColor: ['responsive', 'focus', 'hover', 'group-hover', 'dark'],
			borderColor: ['dark', 'focus', 'hover'],
			rotate: ['group-hover']
		}
	},
	plugins: []
};
