export function DisplayErrors({ errors }) {
  return (
    <>
      {errors.map((error) => (
        <span key={error}>
          <span>{error}</span>
          <br />
        </span>
      ))}
    </>
  )
}
