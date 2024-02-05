import { defineConfig } from 'unocss';
import presetUno from '@unocss/preset-uno';
import { presetWebFonts, presetIcons } from 'unocss';
import transformerDirectives from '@unocss/transformer-directives';

export default defineConfig({
	presets: [
		presetUno(),
		presetWebFonts({
			fonts: { sans: 'Zen Maru Gothic', serif: 'Noto Serif Japanese' }
		}),
		presetIcons()
	],
	transformers: [transformerDirectives()]
});
