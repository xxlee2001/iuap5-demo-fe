/**
 * form 表单校验规则辅助方法
 * @
 */

const isFunction = (fun) => {
  return Object.prototype.toString.call(fun) === '[object Function]'
}

export const generateRules = (message='', required=true, validator) => {
  let rules = [
    { required, message }
  ]

  if (isFunction(validator)) rules.push({ validator })
  return rules
}
