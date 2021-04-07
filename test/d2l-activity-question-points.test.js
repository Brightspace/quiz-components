import '../src/components/d2l-activity-question-points';
import { activityCollection, activityCollectionSingleItem, mockActivityCollection } from './data/mockData';
import { addToMock, mockLink } from './data/fetchMock';
import { expect, html } from '@open-wc/testing';
import { clearStore } from '@brightspace-hmc/foundation-engine/state/HypermediaState.js';
import { createComponentAndWait } from '@brightspace-hmc/foundation-components/test/test-util';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';
import { stub } from 'sinon';

async function _createComponent(path) {
	return await createComponentAndWait(html`<d2l-activity-question-points href="${path}" token="test-token"></d2l-activity-question-points>`);
}

describe('d2l-activity-question-points', () => {
	const activityCollectionHref = '/activity-collection';
	const activityCollection2Href = '/activity-collection-2';

	before(() => {
		clearStore();
		mockLink.reset();
		// add appropriate data to fetch mock
		addToMock(
			activityCollectionHref,
			mockActivityCollection(
				activityCollection,
				_createComponent
			),
			_createComponent
		);

		addToMock(
			activityCollection2Href,
			mockActivityCollection(
				activityCollectionSingleItem,
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

			expect(rows.length).to.equal(activityCollection.length);
		});

		it('should display a single question', async() => {
			const el = await _createComponent(activityCollection2Href);
			const rows = el.shadowRoot.querySelectorAll('d2l-activity-question-usage');

			expect(rows.length).to.equal(activityCollectionSingleItem.length);
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
