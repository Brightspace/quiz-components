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
	activityUsage: 'https://activities.api.brightspace.com/rels/activity-usage'
});

class ActivityQuestionUsage extends HypermediaStateMixin(BaseMixin(LitElement)) {
	static get properties() {
		return {
			_activityHref: { observable: observableTypes.link, rel: rels.activityUsage },
			id: {
				type: String,
				observable: observableTypes.property,
				route: [{observable: observableTypes.properties}]
			},
			points: {
				type: String,
				observable: observableTypes.property,
				route: [{observable: observableTypes.properties}]
			},
			setPoints: {
				type: Object,
				observable: observableTypes.action,
				name: 'set-points',
				route: [{observable: observableTypes.link}] }
		};
	}

	static get styles() {
		return [ css`` ];
	}

	render() {
		return html`
		<d2l-list-item>
			<d2l-list-item-content>
				<div>
					<d2l-activity-name href="${this._activityHref}" .token="${this.token}"></d2l-activity-name>
				</div>
				<div slot="secondary">
				<d2l-activity-type href="${this._activityHref}" .token="${this.token}"></d2l-activity-type>
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
					@change=${this._validation}
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
