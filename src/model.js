import { computed, action, extendObservable } from "mobx";
import { deepCopy } from './util';

/**
 * 提取某个模式的所有state,actions
 */
export default class Model {
  constructor(schema) {
    Object.defineProperty(this, "$schema", {
      configurable: true,
      enumerable: true,
      writable: false,
      value: deepCopy(schema)
    })
    appendState(this, this.$schema.state);
    appendGetter(this, this, this.$schema.getters);
    appendAction(this, this, this.$schema.actions);
  }
}


// 添加state
export const appendState = function (_this, state) {
  if (typeof state === 'undefined') {
    return _this;
  }

  if (typeof state !== 'object') {
    console.warn('state must be a object!');
    return _this;
  }

  for (let _key in state) {
    extendObservable(_this, {
      [_key]: state[_key]
    });
  }
};

// 添加getters
export const appendGetter = function (object, context, getters) {
  if (typeof getters === 'undefined') {
    return object
  }

  for (let _key in getters) {
    extendObservable(object, {
      [_key]: computed(function () {
        return getters[_key].apply(context, arguments)
      })
    })
  }
};

// 添加actions
export const appendAction = function (object, context, actions) {
  if (typeof actions === 'undefined') {
    return object;
  }

  for (let _key in actions) {
    const _thisAction = function () {
      return actions[_key].apply(context, arguments)
    };

    object[_key] = action.bound(_thisAction);
  }
};
