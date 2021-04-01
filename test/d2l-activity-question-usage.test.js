import '../src/components/d2l-activity-question-usage';
import { addToMock, mockLink } from './data/fetchMock';
import { expect, html } from '@open-wc/testing';
import { clearStore } from '@brightspace-hmc/foundation-engine/state/HypermediaState.js';
import { createComponentAndWait } from '@brightspace-hmc/foundation-components/test/test-util';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';

async function _createComponent(path) {
	return await createComponentAndWait(html`<d2l-activity-question-usage href="${path}" token="test-token"></d2l-activity-question-usage>`);
}

// TODO: put this somewhere common
const rels = Object.freeze({
	activityUsage: 'https://activities.api.brightspace.com/rels/activity-usage',
	external: 'https://assignments.api.brightspace.com/rels/external',
	assignment: 'https://api.brightspace.com/rels/assignment',
	userActivityUsage: 'https://activities.api.brightspace.com/rels/user-activity-usage'
});

describe('d2l-activity-question-usage', () => {
	const id = 13;
	const points = 20;
	const activityUsageHref = '/activity-usage';
	const userActivityUsageHref = '/user-activity-usage';
	const assignmentHref = '/assignment';

	before(() => {
		mockLink.reset();
		// add appropriate data to fetch mock
		addToMock('/activity-question-usage', {
			rel: [
				'item'
			],
			properties: {
				id,
				points
			},
			links: [
				{
					rel: [
						rels.activityUsage
					],
					href: activityUsageHref
				}
			]
		},
		_createComponent
		);

		addToMock(activityUsageHref, {
			links: [
				{
					rel: [
						rels.userActivityUsage
					],
					href: userActivityUsageHref
				}
			]
		},
		_createComponent
		);

		addToMock(userActivityUsageHref, {
			links: [
				{
					rel: [
						rels.assignment
					],
					href: assignmentHref
				}
			]
		},
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

		//check right values get displayed
		//check event is triggered on value changed
		//check commit is made and value updated on value changed

		it('should display correct data', async() => {
			const el = await _createComponent('/activity-question-usage');
			const name = el.shadowRoot.querySelector('d2l-hc-name');
			const type = el.shadowRoot.querySelector('d2l-activity-type');
			const input = el.shadowRoot.querySelector(`#points_input_${id}`);

			console.log(name);
			console.log(type);
			console.log(input);

			expect(name.href).to.equal(assignmentHref);
			expect(type.href).to.equal(activityUsageHref);
			expect(input.value).to.equal(points);
		});

		// it('should display correct question', async() => {
		// 	const el = await _createComponent('/activity-question-usage');
		// 	const rows = el.shadowRoot.querySelectorAll('d2l-list-item');
		// 	expect(rows.length).to.equal(1);
		// });

		// it('should allow a user to change point values', async() => {
		// 	await _createComponent('/activity-question-usage');
		// 	//fill this in
		// });
	});
});
