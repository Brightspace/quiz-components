import '../src/components/d2l-activity-question-points';
import { addToMock, mockLink } from './data/fetchMock';
import { expect, html } from '@open-wc/testing';
import { clearStore } from '@brightspace-hmc/foundation-engine/state/HypermediaState.js';
import { createComponentAndWait } from '@brightspace-hmc/foundation-components/test/test-util';
import { mockActivityCollection } from './data/mockData';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';
import { stub } from 'sinon';

async function _createComponent(path) {
	return await createComponentAndWait(html`<d2l-activity-question-points href="${path}" token="test-token"></d2l-activity-question-points>`);
}

describe('d2l-activity-question-points', () => {
	const activityCollectionHref = '/activity-collection';
	const activityCollection2Href = '/activity-collection-2';
	const activityQuestionUsageHref = '/activity-question-usage';
	const activityQuestionUsage2Href = '/activity-question-usage-2';
	const activityQuestionUsage3Href = '/activity-question-usage-3';

	before(() => {
		mockLink.reset();
		// add appropriate data to fetch mock
		addToMock(
			activityCollectionHref,
			mockActivityCollection(
				[
					{
						id: 1,
						points: 10,
						activityUsageHref: '/activity-usage',
						activityQuestionUsageHref
					},
					{
						id: 2,
						points: 20,
						activityUsageHref: '/activity-usage-2',
						activityQuestionUsageHref: activityQuestionUsage2Href
					},
					{
						id: 3,
						points: 30,
						activityUsageHref: '/activity-usage-3',
						activityQuestionUsageHref: activityQuestionUsage3Href
					}
				],
				_createComponent
			),
			_createComponent
		);

		addToMock(
			activityCollection2Href,
			mockActivityCollection(
				[
					{
						id: 1,
						points: 10,
						activityUsageHref: '/activity-usage',
						activityQuestionUsageHref
					}
				],
				_createComponent
			),
			_createComponent
		);
	});

	after(() => {
		mockLink.reset();
	});

	describe('accessibility', () => {
		it('should pass all axe tests', async() => {
			const el = await _createComponent(activityCollectionHref);
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

		it('should display a list of questions', async() => {
			const el = await _createComponent(activityCollectionHref);
			const rows = el.shadowRoot.querySelectorAll('d2l-activity-question-usage');

			expect(rows.length).to.equal(3);
		});

		it('should display a single question', async() => {
			const el = await _createComponent(activityCollection2Href);
			const rows = el.shadowRoot.querySelectorAll('d2l-activity-question-usage');

			expect(rows.length).to.equal(1);
		});

		it('on update points state gets pushed', async() => {
			const el = await _createComponent(activityCollectionHref);
			const updateButton = el.shadowRoot.querySelector('.button_group__button');

			const pushStub = stub(el._state, 'push');

			const clickEvent = new CustomEvent('click');
			updateButton.dispatchEvent(clickEvent);

			expect(pushStub).to.have.callCount(1);
		});
	});
});
