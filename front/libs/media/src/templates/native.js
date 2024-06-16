module.exports = (
  { imports, interfaces, componentName, props, jsx, exports },
  { tpl },
) => {
  return tpl`${imports}
    import {NativeSvgProps} from '../../types';
    ${interfaces}

    function ${componentName}({size, ...props}: NativeSvgProps) {
      return ${jsx};
    }

    ${exports}
      `
}

