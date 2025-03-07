import '../style.css';
import '@nlux-dev/themes/src/luna/main.css';
import {createMessageDom} from '@shared/components/Message/create';
import {MessageDirection, MessageProps, MessageStatus} from '@shared/components/Message/props';
import {updateMessageDom} from '@shared/components/Message/update';

const newExpo = document.createElement('div');
newExpo.innerHTML = `
    <div class="nlux_root expo-container">
        <h3>Message Comp</h3>
        <div class="Message-expo">
            <div class="controls">
                <select class="direction">
                    <option value="received">Received</option>
                    <option value="sent">Sent</option>
                </select>
                <select class="status">
                    <option value="complete">Complete</option>
                    <option value="streaming">Streaming</option>
                </select>
                <input type="text" placeholder="Message" />
            </div>
            <div class="content">
                <!-- Message component will be rendered here -->
            </div>
        </div>
  </div>
`;

document.querySelector<HTMLDivElement>('#app')!.append(newExpo);

document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector<HTMLDivElement>('.Message-expo')!;
    let props: MessageProps = {
        direction: 'received',
        status: 'complete',
        message: 'Hello, World!',
    };

    const message = createMessageDom(props);

    const directionSelector = container.querySelector<HTMLSelectElement>('.controls select.direction')!;
    directionSelector.addEventListener('change', () => {
        const direction = directionSelector.value as MessageDirection;
        const newProps: MessageProps = {
            ...props,
            direction,
        };

        updateMessageDom(message, props, newProps);
        props = newProps;
    });

    const statusSelector = container.querySelector<HTMLSelectElement>('.controls select.status')!;
    statusSelector.addEventListener('change', () => {
        const status = statusSelector.value as MessageStatus;
        const newProps: MessageProps = {
            ...props,
            status,
        };

        updateMessageDom(message, props, newProps);
        props = newProps;
    });

    const messageInput = container.querySelector<HTMLInputElement>('.controls input')!;
    messageInput.value = props.message ?? '';
    messageInput.addEventListener('input', () => {
        const newProps: MessageProps = {
            ...props,
            message: messageInput.value,
        };

        updateMessageDom(message, props, newProps);
        props = newProps;
    });

    container.querySelector<HTMLDivElement>('.content')!.append(message);
});
