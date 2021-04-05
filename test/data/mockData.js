import { addToMock } from './fetchMock';
import { rels } from '../../src/helpers/utils';

export function mockActivityCollection(activityQuestionUsages, createComponent) {
	const entities = [];

	activityQuestionUsages.forEach(({id, points, activityUsageHref, activityQuestionUsageHref}) => {
		entities.push(mockActivityQuestionUsage(
			id,
			points,
			activityUsageHref,
			activityQuestionUsageHref
		));

		addToMock(
			activityQuestionUsageHref,
			mockActivityQuestionUsage(
				id,
				points,
				activityUsageHref,
				activityQuestionUsageHref
			),
			createComponent
		);
	});

	return {
		entities
	};
}

export function mockActivityQuestionUsage(id, points, activityUsageHref, activityQuestionUsageHref) {
	const links = [
		{
			rel: [
				rels.activityUsage
			],
			href: activityUsageHref
		}
	];

	if (activityQuestionUsageHref) {
		links.push(
			{
				rel: ['self'],
				href: activityQuestionUsageHref
			}
		);
	}

	return {
		rel: [
			'item'
		],
		properties: {
			id,
			points
		},
		links,
		actions: [
			{
				href: 'some-href',
				name: 'set-points',
				method: 'PATCH',
				fields: [
					{
						type: 'number',
						name: 'points'
					}
				]
			}
		]
	};
}

export function mockActivityUsage(userActivityUsageHref) {
	return {
		class: [
			'activity-usage'
		],
		links: [
			{
				rel: [
					rels.userActivityUsage
				],
				href: userActivityUsageHref
			}
		]
	};
}

export function mockUserActivityUsage(assignmentHref) {
	return {
		links: [
			{
				rel: [
					rels.assignment
				],
				href: assignmentHref
			}
		]
	};
}
