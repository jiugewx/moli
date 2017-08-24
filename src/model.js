import { computed, action, extendObservable } from "mobx";
import { deepCopy } from './util';

/**
 * 提取某个模式的所有state,actions
 */
export default class Model {
  constructor(schema) {
    this.$schema = deepCopy(schema);
    appendState(this, this.$schema.state);
    appendAction(this, this.$schema.actions);
    appendGetter(this, this.$schema.getters);
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
}

// 添加getters
export const appendGetter = function (_this, getters) {
  if (typeof getters === 'undefined') {
    return _this
  }

  for (let _key in getters) {
    extendObservable(_this, {
      [_key]: computed(function () {
        return getters[_key].apply(_this, arguments)
      })
    })
  }
}

// 添加actions
export const appendAction = function (_this, actions) {
  if (typeof actions === 'undefined') {
    return _this;
  }

  for (let _key in actions) {
    const _thisAction = function () {
      return actions[_key].apply(_this, arguments)
    };

    _this[_key] = action.bound(_thisAction);
  }
}