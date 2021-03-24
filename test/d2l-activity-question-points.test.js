import '../src/components/d2l-activity-question-points.js';
import { expect, fixture, fixtureCleanup, html } from '@open-wc/testing';
import { QuizServiceFactory } from '../src/services/quizServiceFactory';
import { QuizTestService } from './utilities/quizTestService';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';
import sinon from 'sinon';

const defaultFixture = html`
<d2l-activity-question-points href="/base/data/activity-collection.json" token="whatever"></d2l-activity-question-points>
`;

let getQuizServiceStub;

const defaultQuestions = [
	{
		'id': 1,
		'title': 'Title1',
		'secondary': 'Description1',
		'points': 1
	},
	{
		'id': 2,
		'title': 'Title2',
		'secondary': 'Description2',
		'points': 2
	},
	{
		'id': 3,
		'title': 'Title3',
		'secondary': 'Description3',
		'points': 3
	}
];

describe('d2l-activity-question-points', () => {
	describe('accessibility', () => {
		it('should pass all axe tests', async() => {
			const el = await fixture(defaultFixture);
			await expect(el).to.be.accessible();
		});
	});

	describe('constructor', () => {
		it('should construct', () => {
			expect(() => runConstructor('d2l-activity-question-points')).to.not.throw();
		});
	});

	describe('displays questions', () => {
		beforeEach(() => {
			getQuizServiceStub = sinon.stub(QuizServiceFactory, 'getQuizService');
		});

		afterEach(() => {
			getQuizServiceStub.restore();
			fixtureCleanup();
		});

		it('Displays all questions', async() => {
			setupTestData({
				questions: defaultQuestions
			});

			const el = await fixture(defaultFixture);
			const rows = el.shadowRoot.querySelectorAll('d2l-list-item');
			expect(rows.length).to.equal(4);
		});
	});

	describe('user can change point values', () => {
		beforeEach(() => {
			getQuizServiceStub = sinon.stub(QuizServiceFactory, 'getQuizService');
		});

		afterEach(() => {
			getQuizServiceStub.restore();
			fixtureCleanup();
		});

	});
});

function setupTestData({ questions }) {
	const patches = {};
	if (questions && Array.isArray(questions)) {
		patches['getQuestions'] = async() => questions;
	}
	getQuizServiceStub.returns(new QuizTestService(patches));
}
