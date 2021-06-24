import '@brightspace-ui/core/components/list/list-item.js';
import '@brightspace-ui/core/components/list/list-item-content.js';
import '@brightspace-ui/core/components/inputs/input-number.js';
import '@brightspace-ui/core/components/colors/colors.js';
import '@brightspace-hmc/foundation-components/components/activity/name/d2l-activity-name';
import '@brightspace-hmc/foundation-components/components/common/d2l-hc-description';
import { css, LitElement } from 'lit-element/lit-element.js';
import { HypermediaStateMixin, observableTypes } from '@brightspace-hmc/foundation-engine/framework/lit/HypermediaStateMixin';
import { BaseMixin } from '../mixins/base-mixin';
import { html } from '@brightspace-hmc/foundation-engine/framework/lit/hypermedia-components';
import { labelStyles } from '@brightspace-ui/core/components/typography/styles.js';

const rels = Object.freeze({
	activityUsage: 'https://activities.api.brightspace.com/rels/activity-usage',
	linkPlacement: 'https://lti.api.brightspace.com/rels/link-placement'
});

const MIN_VALUE = 0;
const MAX_VALUE = 9999;

class ActivityQuestionUsage extends HypermediaStateMixin(BaseMixin(LitElement)) {
	static get properties() {
		return {
			_activityHref: {
				observable: observableTypes.link,
				rel: rels.linkPlacement,
				route: [{
					observable: observableTypes.link,
					rel: rels.activityUsage
				}],
				prime: true
			},
			_activityUsageHref: {
				observable: observableTypes.link,
				rel: rels.activityUsage,
				prime: true
			},
			_setPoints: {
				observable: observableTypes.action,
				name: 'set-points'
			},
			questionId: {
				type: String,
				observable: observableTypes.property,
				name: 'id'
			},
			points: {
				type: String,
				observable: observableTypes.property
			}
		};
	}

	static get styles() {
		return [ css`
		.activity_list__points_input {
			display: flex;
			align-items: baseline;
		}
		.points_input__label {
			margin: 12px;
		}
		`,
		labelStyles ];
	}

	_onInputChange(e) {
		if (!this._setPoints.has) {
			return;
		}

		this._setPoints.commit(
			{
				points: {
					observable: observableTypes.property,
					value: e.currentTarget.value
				}
			}
		);

		const updateEvent = new CustomEvent('d2l-activity-question-usage-input-updated');
		this.dispatchEvent(updateEvent);
	}

	isValid() {
		return this.points && this.points > MIN_VALUE && this.points <= MAX_VALUE;
	}

	render() {
		return html`
		<d2l-list-item>
			<d2l-list-item-content>
				<div>
					<d2l-hc-name href="${this._activityHref}" .token="${this.token}"></d2l-hc-name>
				</div>
				<div slot="secondary">
					${this.localize('externalActivity')} - <d2l-hc-description href="${this._activityHref}" .token="${this.token}"></d2l-hc-description>
				</div>
			</d2l-list-item-content>
			<div class="activity_list__points_input" slot="actions">
				<label for="points_input_${this.questionId}" class="points_input__label d2l-label-text">
					${this.localize('inputLabelPoints')}
				</label>
				<d2l-input-number
					id="points_input_${this.questionId}"
					label=${this.localize('inputLabelPoints')}
					value=${ this.points }
					@change="${this._onInputChange}"
					min=${MIN_VALUE}
					max=${MAX_VALUE}
					min-exclusive
					required
					label-hidden>
				</d2l-input-number>
			</div>
		</d2l-list-item>
		`;
	}

}

customElements.define(
	'd2l-activity-question-usage',
	ActivityQuestionUsage
);
