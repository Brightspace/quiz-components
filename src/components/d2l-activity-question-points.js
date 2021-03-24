import '@brightspace-ui/core/components/button/button.js';
import '@brightspace-ui/core/components/list/list.js';
import '@brightspace-ui/core/components/list/list-item.js';
import '@brightspace-ui/core/components/list/list-item-content.js';
import '@brightspace-ui/core/components/inputs/input-number.js';
import '@brightspace-ui/core/components/colors/colors.js';
import '@brightspace-hmc/foundation-components/components/activity/name/d2l-activity-name';
import '@brightspace-hmc/foundation-components/components/activity/type/d2l-activity-type';

import { css, LitElement } from 'lit-element/lit-element.js';
import { heading4Styles, labelStyles } from '@brightspace-ui/core/components/typography/styles.js';
import { BaseMixin } from '../mixins/base-mixin';
import { html } from '@brightspace-hmc/foundation-engine/framework/lit/hypermedia-components.js';
import { HypermediaStateMixin } from '@brightspace-hmc/foundation-engine/framework/lit/HypermediaStateMixin';
import { QuizServiceFactory } from '../services/quizServiceFactory';

class ActivityQuestionPoints extends HypermediaStateMixin(BaseMixin(LitElement)) {
	static get properties() {
		return {
			updateDisabled: {
				type: Boolean
			},
			questions: {
				type: Array
			}
		};
	}

	static get styles() {
		const activityQuestionPointsStyles = css`
			.main_body {
				border: 1px solid var(--d2l-color-gypsum);
				border-radius: 8px;
			}
			.main_body__title {
				background-color: var(--d2l-color-regolith);
				border-bottom: 1px solid var(--d2l-color-gypsum);
				display: flex;
				padding: 0px 30px;
			}
			.main_body__description {
				padding: 30px;
			}
			.main_body__activity_list {
				padding: 30px;
				padding-top: 0;
			}
			.activity_list__points_input {
				display: flex;
				align-items: baseline;
			}
			.points_input__label {
				margin: 12px;
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
		this._items = [];

		this.quizService = QuizServiceFactory.getQuizService();
	}

	async connectedCallback() {
		super.connectedCallback();

		this.questions = await this.quizService.getQuestions();
	}

	set _entity(entity) {
		if (this._entityHasChanged(entity)) {
			this._onActivityUsageCollectionChanged(entity);
			super._entity = entity;
		}
	}

	_onActivityUsageCollectionChanged(collection) {
		this._items = [];
		collection.onItemsChange((item, index) => {
			item.onActivityUsageChange((usage) => {
				this._onActivityCollectionItemChanged(item, usage, index);
			});
		});
	}

	_onActivityCollectionItemChanged(collectionItem, activityUsage, index) {
		this._items[index] = { collectionItem, activityUsage };
		this.requestUpdate();
	}

	_validation() {
		this.updateDisabled = this.questions.reduce((result, question) => {
			return result || !this.shadowRoot.querySelector(`#points_input_${question.id}`).value;
		}, false);
	}

	_updatePoints() {
		this._validation();

		if (!this.updateDisabled) {
			const results = this.questions.reduce((result, question) => {
				const value = this.shadowRoot.querySelector(`#points_input_${question.id}`).value;
				if (value) {
					result.push({
						id: question.id,
						value
					});
				}
				return result;
			}, []);

			this.quizService.updateQuestionPoints(results);
		}
	}

	_cancelUpdate() {
		console.log('Cancelling update');
	}

	_renderUsage(item) {
		const points = item.collectionItem._entity.properties.points;
		const id = item.collectionItem._entity.properties.id;
		return html`
		<d2l-list-item>
			<d2l-list-item-content>
				<div>
					<d2l-activity-name href="${item.activityUsage.userActivityUsageHref()}" .token="${this.token}"></d2l-activity-name>
				</div>
				<div slot="secondary">
				<d2l-activity-type href="${item.activityUsage.userActivityUsageHref()}" .token="${this.token}"></d2l-activity-type>
				</div>
			</d2l-list-item-content>
			<div class="activity_list__points_input" slot="actions">
				<label for="points_input_${id}" class="points_input__label d2l-label-text">
					${this.localize('inputLabelPoints')}
				</label>
				<d2l-input-number
					id="points_input_${id}"
					label=${this.localize('inputLabelPoints')}
					value=${ points }
					@change=${this._validation}
					min = 0
					min-exclusive
					required
					label-hidden>
				</d2l-input-number>
			</div>
		</d2l-list-item>
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
				<div class="main_body__description">
					${this.localize('mainBodyDescription')}
				</div>
				<div class="main_body__activity_list">
					<d2l-list separators="between">
						${ this._items && this._items.map(usage => this._renderUsage(usage)) }
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
					@click=${this._cancelUpdate}>
					${this.localize('buttonCancel')}
				</d2l-button>
			</div>
		`;
	}

}

customElements.define('d2l-activity-question-points', ActivityQuestionPoints);
