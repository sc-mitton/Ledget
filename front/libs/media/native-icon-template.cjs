module.exports = (
  { imports, interfaces, componentName, props, jsx, exports },
  { tpl }
) => {
  return tpl`${imports}
      ${interfaces}

      function ${componentName}({size = 24, ...props}: SvgProps & {size?: string | number}) {
        return ${jsx};
      }

      ${exports}
        `;
};
