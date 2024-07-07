export const NodeImage = ({ node, attributes }: { node: any, attributes: any }) => {
  return (
    <img
      data-testid={`node/image/${attributes.id}`}
      src={attributes.src}
      alt={node.meta.label?.text}
    />
  )
}
