/* global api */
'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';

class ListField extends React.Component {

	constructor(props) {

		super(props);
		this.state = {
			showInputModal: false,
			itemToAdd: '',
			selectedIndex: 0,
		};

		this.addClick = this.addClick.bind(this);
		this.removeClick = this.removeClick.bind(this);
		this.upClick = this.upClick.bind(this);
		this.downClick = this.downClick.bind(this);
		this.cancelAdd = this.cancelAdd.bind(this);
		this.itemToAddChanged = this.itemToAddChanged.bind(this);
		this.selectItem = this.selectItem.bind(this);
		this.saveItem = this.saveItem.bind(this);
		this.addBulk = this.addBulk.bind(this);

	}

	render() {

		return (
			<div className={`field field-list key-${this.field.key}`}>
				<div className="field-label" aria-label={this.label}>{this.label}</div>
				<div>
					<div>
						<select style={this.style} className="ep-list" size={this.size} onChange={this.selectItem.bind(this)}>
							{
								this.value.map((item, index) => {

									if (index === this.state.selectedIndex) {

										return (<option selected value={item} key={index} aria-label={item}>{item}</option>);

									}

									return (<option value={item} key={index} aria-label={item}>{item}</option>);

								})
							}
						</select>
					</div>
					<div className="ep-list-button-container">
						<button className="ep-list-button" onClick={this.addClick} aria-label="Add">
							<span className="ep-list-button-text">+</span></button>
						<button className="ep-list-button" onClick={this.removeClick} aria-label="Remove">
							<span className="ep-list-button-text">-</span></button>
						{this.orderable
																												&& <React.Fragment>
																													<button className="ep-list-button" onClick={this.upClick} aria-label="Move up">
																														<span className="ep-list-button-text">↑</span></button>
																													<button className="ep-list-button" onClick={this.downClick} aria-label="Move down">
																														<span className="ep-list-button-text">↓</span></button>
																												</React.Fragment>
						}
						{this.allowBulk
																												&& <React.Fragment>
																													<div>
																														<button className="ep-list-button" onClick={this.addBulk} aria-label="Add bulk">
																															<span className="ep-list-button-text">Add bulk</span></button>
																													</div>
																												</React.Fragment>
						}
					</div>
					<ReactModal style={this.modalStyle} shouldCloseOnOverlayClick={true} isOpen={this.state.showInputModal} contentLabel="Add Item" closeTimeoutMS={this.modalCloseTimeoutMS}>
						<div className="ep-list-modal-container">
							<div className="ep-list-modal-input-container">
								<label className="ep-list-modal-input-label">{this.addItemLabel}</label>
								<input className="ep-list-modal-input" type="text" value={this.state.itemToAdd} autoFocus={true} onChange={this.itemToAddChanged} aria-label={this.addItemLabel}/>
							</div>
							<div className="ep-list-modal-button-container">
								<button className="ep-list-modal-button" onClick={this.cancelAdd.bind(this)} aria-label="Cancel">Cancel</button>
								{(this.addItemValidator.test(this.state.itemToAdd)
																																								&&																																								<button className="ep-list-modal-button" onClick={this.saveItem.bind(this)} aria-label="Save">Save</button>)
																																				|| <button className="ep-list-modal-button" disabled="disabled" aria-label="Save">Save</button>
								}
							</div>
						</div>
					</ReactModal>
				</div>
				{this.help && <span className="help">{this.help}</span>}
			</div>
		);

	}

	selectItem(e) {

		this.setState({ selectedIndex: e.target.selectedIndex });

	}

	itemToAddChanged(e) {

		this.setState({ itemToAdd: e.target.value });

	}

	addClick() {

		this.setState({ showInputModal: true });

	}

	cancelAdd() {

		this.setState({ showInputModal: false, itemToAdd: '' });

	}

	saveItem() {

		if (this.state.itemToAdd !== undefined && this.state.itemToAdd !== null && this.state.itemToAdd !== '') {

			this.props.onChange([ ...this.value, this.state.itemToAdd ]);

		}

		this.setState({ showInputModal: false, itemToAdd: '' });

	}

	removeClick() {

		if (this.state.selectedIndex >= 0) {

			this.props.onChange(this.value.filter((item, index) => index !== this.state.selectedIndex));

		}

	}

	upClick() {

		const { selectedIndex } = this.state;
		if (selectedIndex >= 1) {

			const newIndex = selectedIndex - 1;
			this.props.onChange([ ...this.value.slice(0, newIndex), this.value[selectedIndex], this.value[newIndex], ...this.value.slice(selectedIndex + 1) ]);
			this.setState({ selectedIndex: this.state.selectedIndex - 1 });

		}

	}

	downClick() {

		const { selectedIndex } = this.state;
		if (selectedIndex <= this.value.length - 2) {

			const newIndex = selectedIndex + 1;
			this.props.onChange([ ...this.value.slice(0, selectedIndex), this.value[newIndex], this.value[selectedIndex], ...this.value.slice(newIndex + 1) ]);
			this.setState({ selectedIndex: this.state.selectedIndex + 1 });

		}

	}

	addBulk() {

		// Console.log('addBulk()');

		this.choose();

	}

	choose() {

		const properties = [ 'openFile', 'dontAddToRecent' ];

		let file = api?.showOpenDialog({
			properties,
			filters: { name: 'Swatch', extensions: [ 'txt' ] },
		});

		if (!file) {

			return;

		}

		if (file.length <= 0) {

			return;

		}

		if (Array.isArray(file)) {

			file = file[0];

		}

		console.log('file', file);

		// Api.readSwatchFile(file).then(
		// 	_data => {
		//
		// 		console.log('data', _data);
		//
		// 	},
		// 	_error => {
		//
		// 		console.error('data', _error);
		//
		// 	},
		// );

		// let results = api?.readSwatchFile(file).then(
		// 	(_data, _more) => {
		//
		// 		console.log('returned data', _data, _more);
		//
		// 	},
		// );
		const results = api?.readSwatchFile(file);

		if (!results) {

			return;

		}

		if (results.length > 0) {

			console.log('results', results);

			const arr = results.trim().split('\n');

			const cleanArr = [];

			const isHex = /^#(?:[0-9a-f]{3}){1,2}$/i;

			if (Array.isArray(arr)) {

				for (const i in arr) {

					if (typeof arr[i] !== 'undefined' && isHex.test(arr[i])) {

						cleanArr.push(arr[i].trim());

					}

				}

			}

			this.onChange(cleanArr);

		}

	}

	get onChange() {

		return this.props.onChange;

	}

	get field() {

		return this.props.field;

	}

	get value() {

		return this.props.value || [];

	}

	get label() {

		return this.field.label;

	}

	get inputType() {

		return this.field.inputType || 'list';

	}

	get orderable() {

		return this.field.orderable || false;

	}

	get allowBulk() {

		return this.field.allowBulk || false;

	}

	get size() {

		return this.field.size || 10;

	}

	get help() {

		return this.field.help;

	}

	get style() {

		return this.field.style || {};

	}

	get modalStyle() {

		return this.field.modalStyle || {
			overlay: {
				backgroundColor: 'rgba(0, 0, 0, 0.5)',
			},
			content: {
				top: '50%',
				left: '50%',
				bottom: 'auto',
				right: 'auto',
				marginRight: '-50%',
				transform: 'translate(-50%, -50%)',
				width: '300px',
			},
		};

	}

	get modalCloseTimeoutMS() {

		return this.field.modalCloseTimeoutMS || 100;

	}

	get addItemLabel() {

		return this.field.addItemLabel || 'Add Item';

	}

	get addItemValidator() {

		if (this.field.addItemValidator) {

			const string_ = this.field.addItemValidator;
			const lastSlash = string_.lastIndexOf('/');
			const validator = new RegExp(string_.slice(1, lastSlash), string_.slice(lastSlash + 1));

			return validator;

		}

		return /.+/;

	}

}

ListField.propTypes = {
	field: PropTypes.object,
	value: PropTypes.string,
	onChange: PropTypes.func,
};

export default ListField;
