import '../src/components/d2l-activity-question-points';
import { addToMock, mockLink } from './data/fetchMock';
import { expect, html } from '@open-wc/testing';
import { clearStore } from '@brightspace-hmc/foundation-engine/state/HypermediaState.js';
import { createComponentAndWait } from '@brightspace-hmc/foundation-components/test/test-util';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';

async function _createComponent(path) {
	return await createComponentAndWait(html`<d2l-activity-question-points href="${path}" token="test-token"></d2l-activity-question-points>`);
}

describe('d2l-activity-question-points', () => {
	before(() => {
		mockLink.reset();
		// add appropriate data to fetch mock
		addToMock('/activity-collection', {
			rel: [
				'item'
			],
			properties: {
				id: '1',
				points: 10
			}},
		_createComponent
		);
	});

	after(() => {
		mockLink.reset();
	});

	describe('accessibility', () => {
		it('should pass all axe tests', async() => {
			const el = await _createComponent('/activity-collection');
			await expect(el).to.be.accessible();
		});
	});

	describe('construction', () => {
		it('should construct', () => {
			expect(() => runConstructor('d2l-activity-question-points')).to.not.throw();
		});
	});

	describe('functionality', () => {
		// tests to ensure component is functioning as desired
		beforeEach(() => {
			clearStore();
		});

		afterEach(() => {
			mockLink.resetHistory();
		});

		// Renders right number of questions
		// button gets disabled
		//update event triggers validation
		// state gets pushed and postmessaged messaged
	});
});
