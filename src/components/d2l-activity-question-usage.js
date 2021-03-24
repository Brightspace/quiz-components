import '@brightspace-ui/core/components/list/list-item.js';
import '@brightspace-ui/core/components/list/list-item-content.js';
import '@brightspace-ui/core/components/inputs/input-number.js';
import '@brightspace-ui/core/components/colors/colors.js';
import '@brightspace-hmc/foundation-components/components/activity/name/d2l-activity-name';
import '@brightspace-hmc/foundation-components/components/activity/type/d2l-activity-type';
import { css, LitElement } from 'lit-element/lit-element.js';
import { customHypermediaElement, html } from '@brightspace-hmc/foundation-engine/framework/lit/hypermedia-components';
import { HypermediaStateMixin, observableTypes } from '@brightspace-hmc/foundation-engine/framework/lit/HypermediaStateMixin';
import { BaseMixin } from '../mixins/base-mixin';

const rels = Object.freeze({
	activityUsage: 'https://activities.api.brightspace.com/rels/activity-usage',
	external: 'https://assignments.api.brightspace.com/rels/external',
	assignment: 'https://api.brightspace.com/rels/assignment',
	userActivityUsage: 'https://activities.api.brightspace.com/rels/user-activity-usage'
});

class ActivityQuestionUsage extends HypermediaStateMixin(BaseMixin(LitElement)) {
	static get properties() {
		return {
			_activityHref: {
				observable: observableTypes.link,
				rel: rels.assignment,
				route: [{
					observable: observableTypes.link,
					rel: rels.activityUsage
				}, {
					observable: observableTypes.link,
					rel: rels.userActivityUsage
				}]
			},
			_activityUsageHref: {
				observable: observableTypes.link,
				rel: rels.activityUsage
			},
			_setPoints: {
				type: Object,
				observable: observableTypes.action,
				name: 'set-points'
			},
			id: {
				type: String,
				observable: observableTypes.property
			},
			points: {
				type: String,
				observable: observableTypes.property
			}
		};
	}

	static get styles() {
		return [ css`
		.points_input__label {
			margin: 12px;
		}
		` ];
	}

	_onInputChange(e) {
		if (!this._setPoints.has) {
			return;
		}
		const points = e.currentTarget.value;
		this._setPoints.commit(
			{
				points: {
					observable: observableTypes.property,
					value: points
				}
			}
		);
		this._state.push();
	}

	render() {
		return html`
		<d2l-list-item>
			<d2l-list-item-content>
				<div>
					<d2l-hc-name href="${this._activityHref}" .token="${this.token}"></d2l-hc-name>
				</div>
				<div slot="secondary">
					<d2l-activity-type href="${this._activityUsageHref}" .token="${this.token}"></d2l-activity-type>
				</div>
			</d2l-list-item-content>
			<div class="activity_list__points_input" slot="actions">
				<label for="points_input_${this.id}" class="points_input__label d2l-label-text">
					${this.localize('inputLabelPoints')}
				</label>
				<d2l-input-number
					id="points_input_${this.id}"
					label=${this.localize('inputLabelPoints')}
					value=${ this.points }
					@change="${this._onInputChange}"
					min=0
					min-exclusive
					required
					label-hidden>
				</d2l-input-number>
			</div>
		</d2l-list-item>
		`;
	}

}
customHypermediaElement(
	'd2l-activity-question-usage',
	ActivityQuestionUsage,
);
