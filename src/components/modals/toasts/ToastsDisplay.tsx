import { getStore } from 'hooks/jotai/base';
import { atom, useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { ToastContainer, Toast } from 'react-bootstrap';

export type ToastProps = {
  title: string;
  body: string;
  autohide?: boolean | undefined;
};

export type ToastState = ToastProps & {
  index: number;
};

export type ToastsDisplayState = {
  toasts: ToastState[];
};

export const TOAST_STATE_ATOM = atom<ToastsDisplayState>({ toasts: [] });

function deleteToast(index: number) {
  console.log(index);
  console.log(getStore().get(TOAST_STATE_ATOM));
  const state = getStore().get(TOAST_STATE_ATOM);
  getStore().set(TOAST_STATE_ATOM, {
    ...state,
    toasts: state.toasts.filter((stat) => stat.index !== index),
  });
  console.log(getStore().get(TOAST_STATE_ATOM));
}

export function makeToast(props: ToastProps) {
  console.log(getStore().get(TOAST_STATE_ATOM));
  const state = getStore().get(TOAST_STATE_ATOM);
  getStore().set(TOAST_STATE_ATOM, {
    ...state,
    toasts: [
      ...state.toasts,
      {
        ...props,
        autohide: props.autohide === undefined ? true : props.autohide,
        index: state.toasts.length,
      },
    ],
  });

  console.log(getStore().get(TOAST_STATE_ATOM));
}

function TheToast(props: { state: ToastState }) {
  const { state } = props;
  const { title, body, index, autohide } = state;
  return (
    <Toast
      onClose={() => deleteToast(index)}
      show
      delay={3000}
      autohide={autohide}
    >
      <Toast.Header>
        <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
        <strong className="me-auto">{title}</strong>
        {/* <small className="text-muted">just now</small> */}
      </Toast.Header>
      <Toast.Body className="text-dark">{body}</Toast.Body>
    </Toast>
  );
}

// eslint-disable-next-line import/prefer-default-export
export function ToastDisplay() {
  // useEffect(() => {
  //   makeToast('test', 'test 123');
  // }, []);

  console.log('render', useAtomValue(TOAST_STATE_ATOM));
  const toasts = useAtomValue(TOAST_STATE_ATOM).toasts.map((state) =>
    TheToast({ state }),
  );
  return (
    <ToastContainer
      id="toast-container"
      style={{ zIndex: 1, top: '50px', right: '5px' }}
    >
      {toasts}
    </ToastContainer>
  );
}
