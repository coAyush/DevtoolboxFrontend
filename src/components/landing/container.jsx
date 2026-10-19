import GlassContainer from "../../styles/GlassContainer";
const container = ({ header, footer, tools }) => {
  return (
    <>
      <GlassContainer>
        {header}
        {tools}
        {footer}
      </GlassContainer>
    </>
  )
}
export default container;