import '../src/components/d2l-activity-question-usage';
import { addToMock, mockLink } from './data/fetchMock';
import { expect, html } from '@open-wc/testing';
import { mockActivityQuestionUsage, mockActivityUsage } from './data/mockData';
import { clearStore } from '@brightspace-hmc/foundation-engine/state/HypermediaState.js';
import { createComponentAndWait } from '@brightspace-hmc/foundation-components/test/test-util';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';

async function _createComponent(path) {
	return await createComponentAndWait(html`<d2l-activity-question-usage href="${path}" token="test-token"></d2l-activity-question-usage>`);
}

describe('d2l-activity-question-usage', () => {
	const id = 13;
	const points = 20;
	const activityQuestionUsageHref = '/activity-question-usage';
	const activityUsageHref = '/activity-usage';
	const linkPlacementHref = '/link-placement';

	before(() => {
		clearStore();
		mockLink.reset();
		// add appropriate data to fetch mock
		addToMock(
			activityQuestionUsageHref,
			mockActivityQuestionUsage(
				id,
				points,
				activityUsageHref
			),
			_createComponent
		);

		addToMock(
			activityUsageHref,
			mockActivityUsage(linkPlacementHref),
			_createComponent
		);

		addToMock(
			linkPlacementHref,
			{},
			_createComponent
		);
	});

	after(() => {
		mockLink.reset();
	});

	describe('accessibility', () => {
		it('should pass all axe tests', async() => {
			const el = await _createComponent(activityQuestionUsageHref);
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

		it('should display correct data', async() => {
			const el = await _createComponent(activityQuestionUsageHref);
			const name = el.shadowRoot.querySelector('d2l-hc-name');
			const input = el.shadowRoot.querySelector(`#points_input_${id}`);

			expect(name.href).to.equal(linkPlacementHref);
			expect(input.value).to.equal(points);
		});

		it('event gets triggered', async() => {
			const newPoints = 50;

			const el = await _createComponent(activityQuestionUsageHref);
			const input = el.shadowRoot.querySelector(`#points_input_${id}`);

			el.addEventListener('d2l-activity-question-usage-input-updated', () => {
				expect(el.points).to.equal(newPoints);
			});

			input.value = newPoints;
			const updateEvent = new CustomEvent('change');
			input.dispatchEvent(updateEvent);
		});

		const invalidValues = [0, -1, null, undefined, 10000];

		invalidValues.forEach(invalidValue => {
			it(`should be invalid for ${invalidValue}`, async() => {
				const el = await _createComponent(activityQuestionUsageHref);

				el.points = invalidValue;

				expect(!el.isValid()).to.be.true;
			});
		});
	});
});
