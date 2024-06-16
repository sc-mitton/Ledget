module.exports = (
  { imports, interfaces, componentName, props, jsx, exports },
  { tpl },
) => {
  return tpl`${imports}
    import {NativeSvgProps} from '../../types';
    ${interfaces}

    function ${componentName}({size = '1.25em', ...props}: NativeSvgProps) {
      return ${jsx};
    }

    ${exports}
      `
}

