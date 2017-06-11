import React from 'react';
import ReactDOM from 'react-dom';
import Modal from "./Modal";
import {default as ModalModel} from "./model/Modal";

it('renders without crashing', () => {
    const div = document.createElement('div');
    const modalModel = new ModalModel();

    ReactDOM.render(<Modal dataSource={modalModel}  />, div);
});

it ("test", () => {
    expect(false).toBe(true);
});