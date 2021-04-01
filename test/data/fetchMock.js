import { assert } from '@open-wc/testing';
import fetchMock from 'fetch-mock/esm/client.js';

export const mockLink = fetchMock;

export async function addToMock(path, object, createComponent) {
	mockLink.mock(`path:${path}`, () => object);

	await createComponent(path);
	assert.isTrue(mockLink.called(`path:${path}`), `${path} was not called`);
}
