module.exports = (
  { imports, interfaces, componentName, props, jsx, exports },
  { tpl },
) => {
  return tpl`${imports}
    ${interfaces}

    function ${componentName}({size = '1.25em', ...props}: SvgProps & {size?: string | number}) {
      return ${jsx};
    }

    ${exports}
      `
}

