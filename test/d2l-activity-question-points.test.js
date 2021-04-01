import '../src/components/d2l-activity-question-points';
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
	const activityQuestionUsageHref = '/activity-question-usage';
	const activityQuestionUsage2Href = '/activity-question-usage-2';
	const activityQuestionUsage3Href = '/activity-question-usage-3';

	before(() => {
		mockLink.reset();
		// add appropriate data to fetch mock
		addToMock(activityCollectionHref, {
			entities: [
				{
					rel: [
						'item'
					],
					properties: {
						id: 1,
						points: 10
					},
					links: [
						{
							rel: ['self'],
							href: activityQuestionUsageHref
						}
					]
				},
				{
					rel: [
						'item'
					],
					properties: {
						id: 2,
						points: 20
					},
					links: [
						{
							rel: ['self'],
							href: activityQuestionUsage2Href
						}
					]
				},
				{
					rel: [
						'item'
					],
					properties: {
						id: 3,
						points: 30
					},
					links: [
						{
							rel: ['self'],
							href: activityQuestionUsage3Href
						}
					]
				}
			]
		},
		_createComponent
		);

		addToMock(activityCollection2Href, {
			entities: [
				{
					rel: [
						'item'
					],
					properties: {
						id: 1,
						points: 10
					},
					links: [
						{
							rel: ['self'],
							href: activityQuestionUsageHref
						}
					]
				}
			]
		},
		_createComponent
		);

		addToMock(activityQuestionUsageHref, {
			rel: [
				'item'
			],
			properties: {
				id: 1,
				points: 10
			}
		},
		_createComponent
		);

		addToMock(activityQuestionUsage2Href, {
			rel: [
				'item'
			],
			properties: {
				id: 2,
				points: 20
			}
		},
		_createComponent
		);

		addToMock(activityQuestionUsage3Href, {
			rel: [
				'item'
			],
			properties: {
				id: 3,
				points: 30
			}
		},
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

		it('should display correct data', async() => {
			const el = await _createComponent(activityCollectionHref);
			const rows = el.shadowRoot.querySelectorAll('d2l-activity-question-usage');

			expect(rows.length).to.equal(3);

			const el2 = await _createComponent(activityCollection2Href);
			const rows2 = el2.shadowRoot.querySelectorAll('d2l-activity-question-usage');

			expect(rows2.length).to.equal(1);
		});

		const invalidValues = [0, -1, null, undefined];

		invalidValues.forEach(invalidValue => {
			it(`should disable update button for ${invalidValue}`, async() => {
				const el = await _createComponent(activityCollectionHref);
				const activityQuestionUsage = el.shadowRoot.querySelector('d2l-activity-question-usage');

				expect(el.updateDisabled).to.equal(false);

				activityQuestionUsage.points = invalidValue;
				const updateEvent = new CustomEvent('update');
				activityQuestionUsage.dispatchEvent(updateEvent);

				expect(el.updateDisabled).to.equal(true);
			});
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
