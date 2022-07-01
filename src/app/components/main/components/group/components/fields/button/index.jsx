/* global api */
import React from 'react';
import PropTypes from 'prop-types';

class ButtonField extends React.Component {

	render() {

		const choose = () => {

			api.sendButtonClick(this.key);

		};

		const getOnlineStatus = () => {

			let isDisabled = false;

			if (this.disableOffline) {

				if (!navigator.onLine) {

					isDisabled = true;

				}

			}

			return isDisabled;

		};

		const fieldLabel = this.hideLabel === 'true' ? '' : <div className="field-label">{ this.label }</div>;

		const btLabel = this.buttonLabel ? this.buttonLabel : 'Click Here';

		const isDisabled = getOnlineStatus();

		const dataAttrs = {};
		dataAttrs['data-' + this.key] = btLabel;

		return (
			<div className={`field field-button key-${this.key}  disabled-${isDisabled}`} {...dataAttrs}>
				{ fieldLabel }
				<button className="bt" onClick={ choose } disabled={getOnlineStatus()}>
					{ btLabel }
				</button>
				{ this.help && <span className="help">{ this.help }</span> }
			</div>
		);

	}

	get field() {

		return this.props.field;

	}

	get disableOffline() {

		return this.field.disableOffline;

	}

	get label() {

		return this.field.label;

	}

	get type() {

		return this.field.type;

	}

	get help() {

		return this.field.help;

	}

	get buttonLabel() {

		return this.field.buttonLabel;

	}

	get key() {

		return this.field.key;

	}

	get hideLabel() {

		return this.field.hideLabel;

	}

}

ButtonField.propTypes = {
	field: PropTypes.object,
};

export default ButtonField;
