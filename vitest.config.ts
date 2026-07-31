import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		globalSetup: ['tests/sv/global.js']
	}
});
