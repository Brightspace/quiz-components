import '@brightspace-ui/core/components/button/button.js';
import '@brightspace-ui/core/components/list/list.js';
import '@brightspace-ui/core/components/list/list-item.js';
import '@brightspace-ui/core/components/list/list-item-content.js';
import '@brightspace-ui/core/components/inputs/input-number.js';
import '@brightspace-ui/core/components/colors/colors.js';
import './d2l-activity-question-usage.js';

import { css, LitElement } from 'lit-element/lit-element.js';
import { heading4Styles, labelStyles } from '@brightspace-ui/core/components/typography/styles.js';
import { HypermediaStateMixin, observableTypes } from '@brightspace-hmc/foundation-engine/framework/lit/HypermediaStateMixin';
import { BaseMixin } from '../mixins/base-mixin';
import { html } from '@brightspace-hmc/foundation-engine/framework/lit/hypermedia-components';

class ActivityQuestionPoints extends HypermediaStateMixin(BaseMixin(LitElement)) {
	static get properties() {
		return {
			updateDisabled: {
				type: Boolean
			},
			_questions: {
				observable: observableTypes.subEntities,
				rel: 'item',
				prime: true
			}
		};
	}

	static get styles() {
		const activityQuestionPointsStyles = css`
			.main_body {
				max-width: 723px;
				border: 1px solid var(--d2l-color-gypsum);
				border-radius: 8px;
			}
			.main_body__title {
				background-color: var(--d2l-color-regolith);
				border-bottom: 1px solid var(--d2l-color-gypsum);
				display: flex;
				padding: 0px 30px;
			}
			.main_body_content {
				padding: 30px;
			}
			.main_body_content__description {
				padding-bottom: 18px;
			}
			.main_body__activity_list {
				padding: 30px;
				padding-top: 0;
			}
			.button_group {
				margin: 30px;
			}
			.button_group__button {
				margin-right: 12px;
			}
			:host([dir="rtl"]) .button_group__button {
				margin-left: 12px;
				margin-right: 0px;
			}
		`;
		return [
			activityQuestionPointsStyles,
			heading4Styles,
			labelStyles
		];
	}

	constructor() {
		super();
		this.updateDisabled = false;
	}

	_validation() {
		console.log(this._questions);
		this.updateDisabled = this._questions.reduce((result, question) => {
			const activityQuestionUsage = this.shadowRoot.querySelector(`#activity_question_usage_${question.properties.id}`);
			return result || !activityQuestionUsage || !activityQuestionUsage.isValid();
		}, false);
	}

	async _updatePoints() {
		this._validation();

		if (!this.updateDisabled) {
			await this._state.push();

			this._notifyParent();
		}
	}

	_notifyParent() {
		(window.opener || window.parent).postMessage(
			{
				subject: 'question_points_updated'
			},
			'*'
		);
	}

	_renderQuestion(question) {
		return html`
		<d2l-activity-question-usage
			id='activity_question_usage_${question.properties.id}'
			href=${question.href}
			.token=${this.token}
			@d2l-activity-question-usage-input-updated=${this._validation}>
		</d2l-activity-question-usage>
		`;
	}

	render() {
		return html`
			<div class="main_body">
				<div class="main_body__title">
					<div class="d2l-heading-4">
						${this.localize('mainBodyTitle')}
					</div>
				</div>
				<div class="main_body_content">
					<div class="main_body_content__description">
						${this.localize('mainBodyDescription')}
					</div>
					<div>
						${this.localize('mainBodyWarning')}
					</div>
				</div>
				<div class="main_body__activity_list">
					<d2l-list separators="between">
						${ this._questions?.map(question => this._renderQuestion(question)) }
					</d2l-list>
				</div>
			</div>
			<div class="button_group">
				<d2l-button
					class="button_group__button"
					primary
					?disabled=${this.updateDisabled}
					@click=${this._updatePoints}>
					${this.localize('buttonUpdate')}
				</d2l-button>
				<d2l-button
					class="button_group__button"
					@click=${this._notifyParent}>
					${this.localize('buttonCancel')}
				</d2l-button>
			</div>
		`;
	}
}

customElements.define(
	'd2l-activity-question-points',
	ActivityQuestionPoints,
);
