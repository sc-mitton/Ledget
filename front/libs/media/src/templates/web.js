module.exports = (
  { imports, interfaces, componentName, props, jsx, exports },
  { tpl },
) => {
  return tpl`${imports}
    import {SvgProps} from '../../types';
    ${interfaces}

    function ${componentName}({size, ...props}: SvgProps) {
      return ${jsx};
    }

    ${exports}
      `
}
