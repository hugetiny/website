const Container = (props) => {
  const { children } = props
  return <div className="max-w-5xl mx-auto px-6 md:px-12 xl:px-6">{children}</div>
}

export default Container
