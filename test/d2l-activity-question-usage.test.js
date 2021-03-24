import '../src/components/d2l-activity-question-usage';
import { addToMock, mockLink } from './data/fetchMock';
import { expect, html } from '@open-wc/testing';
import { clearStore } from '@brightspace-hmc/foundation-engine/state/HypermediaState.js';
import { createComponentAndWait } from '@brightspace-hmc/foundation-components/test/test-util';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';

async function _createComponent(path) {
	return await createComponentAndWait(html`<d2l-activity-question-usage href="${path}" token="test-token"></d2l-activity-question-usage>`);
}

describe.only('d2l-activity-question-usage', () => {
	before(() => {
		mockLink.reset();
		// add appropriate data to fetch mock
		addToMock('/activity-question-usage', {
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
			const el = await _createComponent('/activity-question-usage');
			await expect(el).to.be.accessible();
		});
	});

	describe('construction', () => {
		it('should construct', () => {
			expect(() => runConstructor('d2l-activity-question-usage')).to.not.throw();
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

		it('should display correct question', async() => {
			const el = await _createComponent('/activity-question-usage');
			const rows = el.shadowRoot.querySelectorAll('d2l-list-item');
			expect(rows.length).to.equal(1);
		});

		it('should allow a user to change point values', async() => {
			await _createComponent('/activity-question-usage');
			//fill this in
		});
	});
});
